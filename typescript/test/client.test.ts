import { readFileSync } from 'node:fs';
import { inspect } from 'node:util';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CATALOG_REVISION, ENDPOINTS, OkData, OkDataConnectionError, OkDataError, VERSION, maxCost } from '../src/index.js';
import { MockApi, TEST_KEY, errorBody, okEnvelope } from './mock-api.js';

let api: MockApi;
let sleeps: number[];
let ok: OkData;

const client = (extra: Partial<ConstructorParameters<typeof OkData>[0]> = {}) =>
  new OkData({ apiKey: TEST_KEY, baseUrl: api.url, timeoutMs: 5_000, sleep: async (ms) => { sleeps.push(ms); }, ...extra });

beforeEach(async () => {
  vi.stubEnv('OKDATA_API_KEY', '');
  vi.stubEnv('OKDATA_BASE_URL', '');
  api = await MockApi.start();
  sleeps = [];
  ok = client();
});

afterEach(async () => {
  vi.unstubAllEnvs();
  await api.close();
});

const last = () => api.requests[api.requests.length - 1]!;

describe('requests', () => {
  it('reads the key from the environment and sends auth, idempotency and user agent headers', async () => {
    vi.stubEnv('OKDATA_API_KEY', TEST_KEY);
    vi.stubEnv('OKDATA_BASE_URL', api.url);
    const page = await new OkData().douyin.trends.list();
    expect(page.kind).toBe('page');
    expect(last().path).toBe('/v1/douyin/trends/list');
    expect(last().headers.authorization).toBe(`Bearer ${TEST_KEY}`);
    expect(last().headers['user-agent']).toBe(`okdata-js/${VERSION}`);
    expect(String(last().headers['idempotency-key'])).toHaveLength(36);
  });

  it('never shows the key when the client is printed or serialised', () => {
    expect(inspect(ok, { depth: 5 })).not.toContain(TEST_KEY);
    expect(JSON.stringify(ok)).not.toContain(TEST_KEY);
    expect(JSON.stringify(ok)).toContain('"key":"set"');
  });

  it('sends params, view and fields and returns a page', async () => {
    api.script('/v1/douyin/videos/search', { body: okEnvelope('douyin.videos.search', { items: [{ id: '7' }], nextCursor: 'c2', amount: '0.02' }) });
    const page = await ok.douyin.videos.search({ query: '露营装备 帐篷', sort: 'latest', view: 'compact', fields: ['id', 'metrics.likes'] });
    expect(last().query).toEqual({ query: '露营装备 帐篷', sort: 'latest', view: 'compact', fields: 'id,metrics.likes' });
    expect(page.items).toEqual([{ id: '7' }]);
    expect(page.nextCursor).toBe('c2');
    expect(page.hasMore).toBe(true);
    expect(page.cost).toBe('0.02');
  });

  it('leaves out undefined params', async () => {
    await ok.x.trends.list({ country: undefined });
    expect(last().query).toEqual({});
  });

  it('returns an item for single-object endpoints and takes id or url', async () => {
    api.script('/v1/tiktok/videos/get', { body: okEnvelope('tiktok.videos.get', { item: { id: '9', title: 't' } }) });
    const result = await ok.tiktok.videos.get({ url: 'https://www.tiktok.com/@a/video/9' });
    expect(result.kind).toBe('item');
    expect(result.item.id).toBe('9');
    expect(last().query).toEqual({ url: 'https://www.tiktok.com/@a/video/9' });
  });

  it('rejects a bad view or fields before sending anything', async () => {
    await expect(ok.weibo.trends.list({ view: 'tiny' as never })).rejects.toThrow(TypeError);
    await expect(ok.weibo.trends.list({ fields: 'id,,metrics likes' })).rejects.toThrow(TypeError);
    await expect(ok.weibo.trends.list({ fields: [] })).rejects.toThrow(TypeError);
    expect(api.requests).toHaveLength(0);
  });
});

describe('errors and retries', () => {
  it('throws API errors with the charge and retry advice, without retrying final ones', async () => {
    api.script('/v1/douyin/videos/get', { status: 404, body: errorBody('not_found', { message: 'No such video' }) });
    const err = await ok.douyin.videos.get({ id: '1' }).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(OkDataError);
    expect(err).toMatchObject({ code: 'not_found', status: 404, charged: false, retry: 'no', retryable: false, message: 'No such video' });
    expect(api.requests).toHaveLength(1);
    expect(sleeps).toEqual([]);
  });

  it('gets unauthorized without a key', async () => {
    const anon = new OkData({ baseUrl: api.url });
    await expect(anon.weibo.trends.list()).rejects.toMatchObject({ code: 'unauthorized' });
    expect(last().headers.authorization).toBeUndefined();
  });

  it('retries upstream errors with the same Idempotency-Key', async () => {
    api.script('/v1/bilibili/trends/list',
      { status: 503, body: errorBody('upstream_busy', { retry: 'yes' }) },
      { status: 502, body: errorBody('upstream_failed', { retry: 'yes' }) });
    await ok.bilibili.trends.list();
    expect(api.requests).toHaveLength(3);
    expect(new Set(api.requests.map((r) => r.headers['idempotency-key'])).size).toBe(1);
    expect(sleeps).toHaveLength(2);
  });

  it('waits exactly what the server asks on rate_limited, and throws when it is too long', async () => {
    api.script('/v1/weibo/trends/list', { status: 429, body: errorBody('rate_limited', { retry: 'yes', retryAfterSeconds: 2 }) });
    await ok.weibo.trends.list();
    expect(sleeps).toEqual([2000]);

    api.script('/v1/weibo/trends/list', { status: 429, body: errorBody('rate_limited', { retry: 'yes', retryAfterSeconds: 600 }) });
    await expect(ok.weibo.trends.list()).rejects.toMatchObject({ code: 'rate_limited', retryAfterSeconds: 600 });
    expect(sleeps).toEqual([2000]);
  });

  it('gives up after maxRetries', async () => {
    const busy = { status: 503, body: errorBody('upstream_busy', { retry: 'yes' }) };
    api.script('/v1/douyin/trends/list', busy, busy, busy, busy);
    await expect(ok.douyin.trends.list()).rejects.toMatchObject({ code: 'upstream_busy' });
    expect(api.requests).toHaveLength(ok.maxRetries + 1);
  });

  it('retries a timeout with the caller key and reports the free replay', async () => {
    api.script('/v1/youtube/videos/transcript/get',
      { status: 504, body: errorBody('timeout', { retry: 'same_key', charged: null }) },
      { body: okEnvelope('youtube.videos.transcript.get', { item: { video_id: 'v', text: 'hi' }, amount: '0', replayed: true }) });
    const result = await ok.youtube.videos.transcript.get({ id: 'v' }, { idempotencyKey: 'my-key-1' });
    expect(result.replayed).toBe(true);
    expect(result.cost).toBe('0');
    expect(api.requests.map((r) => r.headers['idempotency-key'])).toEqual(['my-key-1', 'my-key-1']);
  });

  it('retries a dropped connection', async () => {
    api.script('/v1/x/trends/list', { drop: true });
    await ok.x.trends.list({ country: 'US' });
    expect(api.requests).toHaveLength(2);
    expect(api.requests[0]!.headers['idempotency-key']).toBe(api.requests[1]!.headers['idempotency-key']);
  });

  it('throws a connection error when nothing answers', async () => {
    const dead = client({ baseUrl: 'http://127.0.0.1:9', maxRetries: 1 });
    const err = await dead.weibo.trends.list().catch((e: unknown) => e);
    expect(err).toBeInstanceOf(OkDataConnectionError);
    expect(err).toMatchObject({ code: 'connection_error', charged: null, retryable: true });
    expect(sleeps).toHaveLength(1);
  });

  it('waits for an in-flight call after a lost answer, with the same key', async () => {
    const inFlight = { status: 429, body: errorBody('rate_limited', { retry: 'yes', retryAfterSeconds: 1 }) };
    api.script('/v1/x/trends/list', { drop: true }, inFlight, inFlight, inFlight,
      { body: okEnvelope('x.trends.list', { items: [], amount: '0', replayed: true }) });
    const page = await ok.x.trends.list();
    expect(page.replayed).toBe(true);
    expect(api.requests).toHaveLength(5);
    expect(new Set(api.requests.map((r) => r.headers['idempotency-key'])).size).toBe(1);
  });

  it('marks the charge unknown when the earlier attempt is still running', async () => {
    const inFlight = { status: 429, body: errorBody('rate_limited', { retry: 'yes', retryAfterSeconds: 1 }) };
    api.script('/v1/x/trends/list', { drop: true }, ...Array(20).fill(inFlight));
    await expect(ok.x.trends.list()).rejects.toMatchObject({ code: 'rate_limited', charged: null });
  });

  it('keeps a plain rate limit as not charged', async () => {
    api.script('/v1/x/trends/list', ...Array(5).fill({ status: 429, body: errorBody('rate_limited', { retry: 'yes', retryAfterSeconds: 1 }) }));
    await expect(ok.x.trends.list()).rejects.toMatchObject({ code: 'rate_limited', charged: false });
    expect(api.requests).toHaveLength(ok.maxRetries + 1);
  });

  it('makes a key when given an empty one, so retries stay safe', async () => {
    api.script('/v1/x/trends/list', { status: 503, body: errorBody('upstream_busy', { retry: 'yes' }) });
    await ok.x.trends.list({}, { idempotencyKey: '' });
    expect(String(api.requests[0]!.headers['idempotency-key'])).toHaveLength(36);
    expect(api.requests[0]!.headers['idempotency-key']).toBe(api.requests[1]!.headers['idempotency-key']);
  });

  it('refuses a malformed key without echoing it', () => {
    const bad = 'okd_abc\ndef';
    expect(() => new OkData({ apiKey: bad })).toThrow(TypeError);
    try { new OkData({ apiKey: bad }); } catch (e) { expect(String(e)).not.toContain('okd_abc'); }
  });

  it('treats a non-JSON gateway error as retryable', async () => {
    api.script('/v1/weibo/trends/list', { status: 502, raw: '<html>bad gateway</html>' });
    await ok.weibo.trends.list();
    expect(api.requests).toHaveLength(2);
  });

  it('does not retry when the caller aborts', async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(ok.weibo.trends.list({}, { signal: controller.signal })).rejects.toThrow();
    expect(sleeps).toEqual([]);
  });
});

describe('paging, generic calls and free routes', () => {
  it('follows cursors until there are no more pages', async () => {
    const path = '/v1/tiktok/videos/comments/list';
    api.script(path,
      { body: okEnvelope('tiktok.videos.comments.list', { items: [{ id: 'a' }], nextCursor: 'p2' }) },
      { body: okEnvelope('tiktok.videos.comments.list', { items: [{ id: 'b' }], nextCursor: 'p3' }) },
      { body: okEnvelope('tiktok.videos.comments.list', { items: [{ id: 'c' }] }) });
    const ids: unknown[] = [];
    for await (const page of ok.pages('tiktok.videos.comments.list', { id: 'v1' }, { maxPages: 5 })) ids.push(page.items[0]!.id);
    expect(ids).toEqual(['a', 'b', 'c']);
    expect(api.requests.map((r) => r.query.cursor)).toEqual([undefined, 'p2', 'p3']);
    expect(new Set(api.requests.map((r) => r.headers['idempotency-key'])).size).toBe(3);
  });

  it('stops at maxPages', async () => {
    api.script('/v1/x/posts/search', ...[0, 1, 2, 3].map((i) => ({ body: okEnvelope('x.posts.search', { items: [{ id: String(i) }], nextCursor: `c${i}` }) })));
    let n = 0;
    for await (const _ of ok.pages('x.posts.search', { query: 'okdata' }, { maxPages: 2 })) n += 1;
    expect(n).toBe(2);
    expect(api.requests).toHaveLength(2);
  });

  it('calls any endpoint by id and refuses things that are not ids', async () => {
    expect((await ok.call('weibo.users.get', { id: '123' })).kind).toBe('item');
    await expect(ok.call('weibo.nothing.here')).rejects.toMatchObject({ code: 'unknown_endpoint' });
    expect(last().path).toBe('/v1/weibo/nothing/here');
    expect(() => ok.call('../../etc/passwd')).toThrow(TypeError);
  });

  it('reads the free routes and the account', async () => {
    expect(await ok.status()).toMatchObject({ summary: { available: Object.keys(ENDPOINTS).length } });
    expect(await ok.catalog()).toMatchObject({ revision: '0.1.0' });
    expect(await ok.account()).toMatchObject({ balance: '0.9' });
    expect(last().headers['idempotency-key']).toBeUndefined();
  });

  it('works out the most a job can cost without floats', () => {
    expect(maxCost('douyin.videos.search', 3)).toBe('0.06');
    expect(maxCost('wechat_mp.accounts.search')).toBe('0.58');
    expect(maxCost('x.posts.get', 7)).toBe('0.007');
    expect(() => maxCost('nope.nothing')).toThrow(TypeError);
  });
});

describe('generated endpoints', () => {
  const published = JSON.parse(readFileSync(new URL('../../docs/catalog.json', import.meta.url), 'utf8')) as {
    revision: string;
    endpoints: Array<{ id: string; path: string; method: string; price: string; maxCharge: string; list: boolean; params: Array<{ name: string; required: boolean; example?: unknown }> }>;
  };

  it('match the published catalog', () => {
    expect(CATALOG_REVISION).toBe(published.revision);
    expect(Object.keys(ENDPOINTS).sort()).toEqual(published.endpoints.map((e) => e.id).sort());
    for (const e of published.endpoints) {
      const info = ENDPOINTS[e.id as keyof typeof ENDPOINTS];
      expect([info.path, info.method, info.price, info.maxCharge, info.list]).toEqual([e.path, e.method, e.price, e.maxCharge, e.list]);
    }
  });

  it.each(published.endpoints.map((e) => [e.id, e] as const))('%s has a typed method that hits its path', async (_id, e) => {
    const parts = e.id.split('.');
    const action = parts.pop()!;
    let target: Record<string, unknown> = ok as unknown as Record<string, unknown>;
    for (const part of parts) target = target[part] as Record<string, unknown>;
    const args: Record<string, string> = Object.fromEntries(e.params.filter((p) => p.required).map((p) => [p.name, String(p.example ?? 'x')]));
    if (Object.keys(args).length === 0 && e.params.some((p) => p.name === 'id')) args.id = '1';
    const result = await (target[action] as (p: object) => Promise<{ kind: string }>)(args);
    expect(result.kind).toBe(e.list ? 'page' : 'item');
    expect(last().path).toBe(e.path);
    expect(last().query).toEqual(args);
  });
});

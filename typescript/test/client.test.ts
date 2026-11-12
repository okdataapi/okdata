import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { OkData, OkDataConnectionError, OkDataError } from '../src/index.js';
import { batchBody, errorReply, itemBody, pageBody, plainBody, startMock, type MockApi } from './mock-server.js';

let api: MockApi;
let slept: number[];
const KEY = 'okd_test_0123456789abcdef';
const client = (extra: ConstructorParameters<typeof OkData>[0] = {}) =>
  new OkData({ apiKey: KEY, baseUrl: api.url, sleep: async (ms) => { slept.push(ms); }, ...extra });

beforeAll(async () => { api = await startMock(); });
afterAll(async () => { await api.close(); });
beforeEach(() => { api.seen.length = 0; slept = []; });

describe('requests', () => {
  it('sends a GET with flat params, view and fields, and the standard headers', async () => {
    api.handle(() => ({ body: pageBody([{ id: '1' }], { next: 'c1.abc' }) }));
    const page = await client({ source: 'weekly-report', endUser: 'u_42' }).douyin.videos.search({
      query: '露营装备', sort: 'latest', view: 'compact', fields: ['id', 'metrics.likes'],
    });
    const req = api.seen[0]!;
    expect(req.method).toBe('GET');
    expect(req.path).toBe('/v1/douyin/videos/search');
    expect(Object.fromEntries(req.query)).toEqual({ query: '露营装备', sort: 'latest', view: 'compact', fields: 'id,metrics.likes' });
    expect(req.headers.authorization).toBe(`Bearer ${KEY}`);
    expect(req.headers['x-entry']).toBe('sdk');
    expect(req.headers['x-source']).toBe('weekly-report');
    expect(req.headers['x-end-user']).toBe('u_42');
    expect(req.headers['user-agent']).toMatch(/^okdata-sdk-js\/\d/);
    expect(req.headers['idempotency-key']).toMatch(/^[0-9a-f-]{36}$/);
    expect(req.headers['x-max-price']).toBeUndefined();
    expect(page.kind).toBe('page');
    expect(page.items).toEqual([{ id: '1' }]);
    expect(page.nextCursor).toBe('c1.abc');
    expect(page.hasMore).toBe(true);
    expect(page.returned).toBe(1);
    expect(page.cost).toBe('0.02');
    expect(page.balanceAfter).toBe('9.98');
    expect(page.resultStatus).toBe('complete');
    expect(page.idempotencyKey).toBe(req.headers['idempotency-key']);
  });

  it('sends maxPrice as X-Max-Price and never in the query', async () => {
    api.handle(() => ({ body: itemBody({ id: '1' }) }));
    await client().x.posts.get({ id: '1850000000000000000', maxPrice: '0.05' });
    await client().x.posts.get({ url: 'https://x.com/a/status/1', maxPrice: 0.0003 });
    expect(api.seen[0]!.headers['x-max-price']).toBe('0.05');
    expect(api.seen[0]!.query.has('maxPrice')).toBe(false);
    expect(api.seen[1]!.headers['x-max-price']).toBe('0.0003');
  });

  it('refuses a malformed maxPrice, view or fields before sending anything', async () => {
    const ok = client();
    await expect(ok.x.posts.get({ id: '1', maxPrice: '5 dollars' })).rejects.toThrow(TypeError);
    await expect(ok.x.posts.get({ id: '1', maxPrice: '123456789' })).rejects.toThrow(/7 digits/);
    await expect(ok.call('x.posts.get', { id: '1', view: 'huge' })).rejects.toThrow(/view must be/);
    await expect(ok.x.posts.get({ id: '1', fields: ['metrics likes'] })).rejects.toThrow(/dotted names/);
    expect(api.seen).toHaveLength(0);
  });

  it('sends the batch form as POST with a JSON body and returns items and missing', async () => {
    api.handle(() => ({ body: batchBody([{ id: '1' }], [{ id: 'missing', reason: 'not_found' }]) }));
    const batch = await client().x.users.get({ ids: ['1', 'missing'], fields: 'id,name' });
    const req = api.seen[0]!;
    expect(req.method).toBe('POST');
    expect(req.path).toBe('/v1/x/users/get');
    expect(req.body).toEqual({ ids: ['1', 'missing'], fields: ['id', 'name'] });
    expect(req.headers['content-type']).toBe('application/json');
    expect(batch.kind).toBe('batch');
    expect(batch.items).toEqual([{ id: '1' }]);
    expect(batch.missing).toEqual([{ id: 'missing', reason: 'not_found' }]);
    expect(batch.resultStatus).toBe('partial');
  });

  it('keeps the single form of a batch endpoint a GET', async () => {
    api.handle(() => ({ body: itemBody({ id: '1', name: 'OpenAI' }) }));
    const one = await client().x.users.get({ username: 'openai' });
    expect(api.seen[0]!.method).toBe('GET');
    expect(one.kind).toBe('item');
    expect(one.item.name).toBe('OpenAI');
  });

  it('calls an id the SDK does not know as a GET on its path', async () => {
    api.handle(() => ({ body: pageBody([]) }));
    await client().call('newplatform.things.list', { limit: 5, flag: true, tags: ['a', 'b'] });
    expect(api.seen[0]!.path).toBe('/v1/newplatform/things/list');
    expect(Object.fromEntries(api.seen[0]!.query)).toEqual({ limit: '5', flag: 'true', tags: 'a,b' });
    await expect(client().call('not an id')).rejects.toThrow(/not an endpoint id/);
  });

  it('reuses a given idempotency key', async () => {
    api.handle(() => ({ body: itemBody({ id: '1' }, { replayed: true, amount: '0' }) }));
    const res = await client().x.posts.get({ id: '1' }, { idempotencyKey: 'job-7-post-1' });
    expect(api.seen[0]!.headers['idempotency-key']).toBe('job-7-post-1');
    expect(res.replayed).toBe(true);
    expect(res.cost).toBe('0');
  });
});

describe('free routes', () => {
  it('reads the catalog and status without a key, the account with one', async () => {
    api.handle((req) => ({ body: plainBody({ path: req.path }) }));
    const ok = client();
    expect(await ok.catalog()).toEqual({ path: '/v1/catalog' });
    expect(await ok.status()).toEqual({ path: '/v1/catalog/status' });
    expect(api.seen[0]!.headers.authorization).toBeUndefined();
    expect(api.seen[1]!.headers.authorization).toBeUndefined();
    await ok.account();
    expect(api.seen[2]!.headers.authorization).toBe(`Bearer ${KEY}`);
    expect(api.seen[2]!.headers['idempotency-key']).toBeUndefined();
  });

  it('looks up calls, kept results and keys, and usage', async () => {
    api.handle((req) => (req.path.endsWith('/result') ? { body: pageBody([{ id: '1' }], { amount: '0', replayed: true }) } : { body: plainBody({ ok: true }) }));
    const ok = client();
    await ok.calls.get('0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20');
    const kept = await ok.calls.result('0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20', { view: 'full', fields: ['id'] });
    await ok.calls.byKey('job-7');
    await ok.usage({ groupBy: ['day', 'capability'], since: '2026-11-01' });
    expect(api.seen.map((s) => `${s.path}?${s.query}`)).toEqual([
      '/v1/calls/0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20?',
      '/v1/calls/0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20/result?view=full&fields=id',
      '/v1/calls?idempotency_key=job-7',
      '/v1/usage?group_by=day%2Ccapability&since=2026-11-01',
    ]);
    expect(kept.replayed).toBe(true);
    expect(() => ok.calls.get('../etc')).toThrow(TypeError);
  });
});

describe('errors', () => {
  it('carries every field of the error body', async () => {
    api.handle(() => errorReply('invalid_params', { param: 'sort', problems: ['sort must be one of: relevance, latest'] }));
    const err = await client().douyin.videos.search({ query: 'x' }).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(OkDataError);
    const e = err as OkDataError;
    expect(e.code).toBe('invalid_params');
    expect(e.status).toBe(400);
    expect(e.charged).toBe(false);
    expect(e.retry).toBe('after_fix');
    expect(e.requestId).toMatch(/^0000/);
    expect(e.message).toBe('message for invalid_params');
    expect(e.messageZh).toBe('invalid_params 的中文');
    expect(e.problems).toEqual(['sort must be one of: relevance, latest']);
    expect(e.param).toBe('sort');
    expect(e.docsUrl).toContain('#invalid_params');
    expect(e.idempotencyKey).toMatch(/^[0-9a-f-]{36}$/);
    expect(api.seen).toHaveLength(1); // after_fix: never retried
  });

  it('reports a charged not_found with its amount, without retrying', async () => {
    api.handle(() => ({ status: 404, body: { ...errorReply('not_found').body, charged: true, amount: '0.002' } }));
    const e = (await client().x.posts.get({ id: '1' }).catch((x: unknown) => x)) as OkDataError;
    expect(e.charged).toBe(true);
    expect(e.amount).toBe('0.002');
    expect(api.seen).toHaveLength(1);
  });

  it('turns a non-okdata answer into bad_response', async () => {
    api.handle(() => ({ status: 403, text: '<html>blocked</html>' }));
    const e = (await client().x.posts.get({ id: '1' }).catch((x: unknown) => x)) as OkDataError;
    expect(e.code).toBe('bad_response');
    expect(e.status).toBe(403);
    expect(e.retry).toBe('no');
  });

  it('never shows the key', () => {
    const ok = client();
    expect(JSON.stringify(ok)).not.toContain(KEY);
    expect(ok.hasKey).toBe(true);
    expect(() => new OkData({ apiKey: 'okd_ bad key' })).toThrow(/spaces/);
    expect(() => new OkData({ apiKey: KEY, baseUrl: 'ftp://x' })).toThrow(/baseUrl/);
    expect(() => new OkData({ apiKey: KEY, source: 'has space' })).toThrow(/source/);
  });
});

describe('retries', () => {
  it('retries retry=yes with the same Idempotency-Key and succeeds', async () => {
    api.handle((_req, n) => (n < 2 ? errorReply('upstream_failed') : { body: itemBody({ id: '1' }) }));
    const res = await client().x.posts.get({ id: '1' });
    expect(res.item).toEqual({ id: '1' });
    expect(api.seen).toHaveLength(3);
    expect(new Set(api.seen.map((s) => s.headers['idempotency-key'])).size).toBe(1);
    expect(slept).toHaveLength(2);
  });

  it('stops after maxRetries and throws the last error', async () => {
    api.handle(() => errorReply('upstream_busy'));
    const e = (await client({ maxRetries: 1 }).x.posts.get({ id: '1' }).catch((x: unknown) => x)) as OkDataError;
    expect(e.code).toBe('upstream_busy');
    expect(e.charged).toBe(false);
    expect(api.seen).toHaveLength(2);
  });

  it('waits retry_after_seconds, and throws when the wait is longer than allowed', async () => {
    api.handle((_req, n) => (n === 0 ? errorReply('rate_limited', { retry_after_seconds: 2, reason: 'rate' }) : { body: itemBody({ id: '1' }) }));
    await client().x.posts.get({ id: '1' });
    expect(slept).toEqual([2000]);
    api.handle(() => errorReply('cost_cap_exceeded', { retry_after_seconds: 36_000 }));
    const e = (await client().x.posts.get({ id: '1' }).catch((x: unknown) => x)) as OkDataError;
    expect(e.code).toBe('cost_cap_exceeded');
    expect(e.retryAfterSeconds).toBe(36_000);
  });

  it('never retries retry=no', async () => {
    api.handle(() => errorReply('unauthorized', { reason: 'key_disabled' }));
    const e = (await client().x.posts.get({ id: '1' }).catch((x: unknown) => x)) as OkDataError;
    expect(e.code).toBe('unauthorized');
    expect(e.reason).toBe('key_disabled');
    expect(api.seen).toHaveLength(1);
  });

  it('tries retry=once one more time only', async () => {
    api.handle(() => ({ status: 502, body: { ...errorReply('upstream_failed').body, retry: 'once' } }));
    await client({ maxRetries: 5 }).x.posts.get({ id: '1' }).catch(() => undefined);
    expect(api.seen).toHaveLength(2);
  });

  it('resends call_in_progress and settlement_unknown with the same key', async () => {
    api.handle((_req, n) => (n === 0 ? errorReply('settlement_unknown') : n === 1 ? errorReply('call_in_progress', { retry_after_seconds: 1 }) : { body: itemBody({ id: '1' }, { replayed: true, amount: '0' }) }));
    const res = await client().x.posts.get({ id: '1' });
    expect(res.replayed).toBe(true);
    expect(new Set(api.seen.map((s) => s.headers['idempotency-key'])).size).toBe(1);
  });

  it('marks the charge unknown when an earlier attempt may have run', async () => {
    api.handle((_req, n) => (n === 0 ? { destroy: true } : errorReply('upstream_failed')));
    const e = (await client({ maxRetries: 1 }).x.posts.get({ id: '1' }).catch((x: unknown) => x)) as OkDataError;
    expect(e.code).toBe('upstream_failed');
    expect(e.charged).toBeNull();
    expect(e.idempotencyKey).toBe(api.seen[0]!.headers['idempotency-key']);
  });

  it('retries a dropped connection, then reports connection_error with charged unknown', async () => {
    api.handle(() => ({ destroy: true }));
    const e = (await client({ maxRetries: 2 }).x.posts.get({ id: '1' }).catch((x: unknown) => x)) as OkDataError;
    expect(e).toBeInstanceOf(OkDataConnectionError);
    expect(e.code).toBe('connection_error');
    expect(e.charged).toBeNull();
    expect(api.seen).toHaveLength(3);
  });

  it('gives up on a slow answer with client_timeout', async () => {
    api.handle(() => ({ delayMs: 300, body: itemBody({ id: '1' }) }));
    const e = (await client({ maxRetries: 0, timeoutMs: 50 }).x.posts.get({ id: '1' }).catch((x: unknown) => x)) as OkDataError;
    expect(e.code).toBe('client_timeout');
    expect(e.retry).toBe('same_key');
  });

  it('does not retry when the caller aborts', async () => {
    api.handle(() => ({ delayMs: 300, body: itemBody({ id: '1' }) }));
    const ctl = new AbortController();
    setTimeout(() => ctl.abort(), 20);
    await expect(client().x.posts.get({ id: '1' }, { signal: ctl.signal })).rejects.toThrow(/abort/i);
    expect(api.seen).toHaveLength(1);
  });

  it('resends a garbled 200 with the same key (it may have run), and marks the charge unknown if it stays garbled', async () => {
    api.handle((_req, n) => (n === 0 ? { status: 200, text: '{"code":"ok","data":' } : { body: itemBody({ id: '1' }, { replayed: true, amount: '0' }) }));
    expect((await client().x.posts.get({ id: '1' })).replayed).toBe(true);
    expect(new Set(api.seen.map((s) => s.headers['idempotency-key'])).size).toBe(1);
    api.handle(() => ({ status: 200, text: 'truncated' }));
    const e = (await client({ maxRetries: 1 }).x.posts.get({ id: '1' }).catch((x: unknown) => x)) as OkDataError;
    expect([e.code, e.charged, e.retry]).toEqual(['bad_response', null, 'same_key']);
  });

  it('retries a 502 proxy page as bad_response', async () => {
    api.handle((_req, n) => (n === 0 ? { status: 502, text: 'Bad Gateway' } : { body: itemBody({ id: '1' }) }));
    const res = await client().x.posts.get({ id: '1' });
    expect(res.item).toEqual({ id: '1' });
    expect(api.seen).toHaveLength(2);
  });
});

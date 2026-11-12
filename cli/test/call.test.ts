import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { batchBody, errorReply, itemBody, pageBody, plainBody, sandbox, startMock, type MockApi, type Sandbox } from './helpers.js';

const KEY = 'okd_cli_test_key_0123456789';
let api: MockApi;
let box: Sandbox;

beforeAll(async () => { api = await startMock(); });
afterAll(async () => { await api.close(); });
beforeEach(() => {
  api.seen.length = 0;
  box = sandbox(api.url, { OKDATA_API_KEY: KEY });
});

describe('okdata call', () => {
  it('sends key=value params typed by the catalog, prints a summary and one item per line', async () => {
    api.handle(() => ({ body: pageBody([{ id: 'a' }, { id: 'b' }], { next: 'c1.next', amount: '0.02' }) }));
    const r = await box.run(['call', 'douyin.videos.search', 'query=露营装备', 'sort=latest', '--fields', 'id,text', '--max-price', '0.05']);
    expect(r.code).toBe(0);
    const req = api.seen[0]!;
    expect(Object.fromEntries(req.query)).toEqual({ query: '露营装备', sort: 'latest', fields: 'id,text' });
    expect(req.headers['x-max-price']).toBe('0.05');
    expect(req.headers['x-entry']).toBe('cli');
    expect(req.headers['user-agent']).toMatch(/okdata-cli\//);
    expect(r.out.trim().split('\n').map((l) => JSON.parse(l))).toEqual([{ id: 'a' }, { id: 'b' }]);
    expect(r.err).toContain('cost $0.02');
    expect(r.err).toContain("next page: okdata call douyin.videos.search 'query=露营装备' sort=latest fields=id,text cursor=c1.next");
    expect(r.out + r.err).not.toContain(KEY);
  });

  it('takes the pairs the Playground prints, including view, fields and max_price', async () => {
    api.handle(() => ({ body: pageBody([]) }));
    await box.run(['call', 'douyin.videos.search', 'query=x', 'view=compact', 'fields=id,text', 'max_price=0.03']);
    expect(Object.fromEntries(api.seen[0]!.query)).toEqual({ query: 'x', view: 'compact', fields: 'id,text' });
    expect(api.seen[0]!.headers['x-max-price']).toBe('0.03');
  });

  it('sends a list as the batch POST, and exits 3 on a partial batch', async () => {
    api.handle(() => ({ body: batchBody([{ id: '1' }], [{ id: 'missing', reason: 'not_found' }], { capability: 'x.users.get' }) }));
    const r = await box.run(['call', 'x.users.get', 'ids=1,missing']);
    expect(api.seen[0]!.method).toBe('POST');
    expect(api.seen[0]!.body).toEqual({ ids: ['1', 'missing'] });
    expect(r.code).toBe(3);
    expect(r.err).toContain('missing: missing (not_found)');
  });

  it('prints the raw envelope with --json', async () => {
    api.handle(() => ({ body: itemBody({ id: '1' }, { capability: 'x.posts.get' }) }));
    const r = await box.run(['call', 'x.posts.get', 'id=1', '--json']);
    expect(r.code).toBe(0);
    const body = JSON.parse(r.out);
    expect(body.code).toBe('ok');
    expect(body.data.item).toEqual({ id: '1' });
  });

  it('writes items to --out', async () => {
    api.handle(() => ({ body: pageBody([{ id: 'a' }]) }));
    const r = await box.run(['call', 'douyin.videos.search', 'query=x', '--out', 'items.jsonl']);
    expect(r.out).toBe('');
    expect(readFileSync(join(box.dir, 'items.jsonl'), 'utf8')).toBe('{"id":"a"}\n');
  });

  it('refuses bad arguments with exit 1 and sends nothing', async () => {
    for (const argv of [
      ['call'],
      ['call', 'douyin.videos.search', 'query'],
      ['call', 'douyin.xingtu.creators.search', 'followers_min=lots'],
      ['call', 'douyin.videos.search', 'query=x', '--max-price', 'cheap'],
      ['call', 'douyin.videos.search', 'query=x', '--bogus'],
      ['call', 'x.posts.get', 'id=1', '--pages', '2'],
      ['nope'],
    ]) {
      const r = await box.run(argv);
      expect([argv.join(' '), r.code]).toEqual([argv.join(' '), 1]);
    }
    expect(api.seen).toHaveLength(0);
  });
});

describe('exit codes', () => {
  it('2 for a refusal that was not charged', async () => {
    api.handle(() => errorReply('invalid_params', { param: 'sort', problems: ['sort must be one of: relevance, latest'] }));
    const r = await box.run(['call', 'douyin.videos.search', 'query=x', 'sort=loud']);
    expect(r.code).toBe(2);
    expect(r.err).toContain('Error invalid_params');
    expect(r.err).toContain('sort must be one of');
    expect(r.err).toContain('Charged: no');
    expect(r.err).toContain('中文：');
  });

  it('3 for a charged not_found, and for a charge not yet known', async () => {
    api.handle(() => ({ status: 404, body: { ...errorReply('not_found').body, charged: true, amount: '0.002' } }));
    expect((await box.run(['call', 'x.posts.get', 'id=1'])).code).toBe(3);
    api.handle(() => errorReply('settlement_unknown'));
    const r = await box.run(['call', 'x.posts.get', 'id=1']);
    expect(r.code).toBe(3);
    expect(r.err).toContain('Charged: unknown');
  });

  it('4 for auth errors, and for no key at all without sending anything', async () => {
    api.handle(() => errorReply('unauthorized', { next_step: 'No key yet: sign up at https://okdata.online/console/' }));
    const r = await box.run(['call', 'x.posts.get', 'id=1']);
    expect(r.code).toBe(4);
    expect(r.err).toContain('sign up');
    api.seen.length = 0;
    const nokey = await sandbox(api.url).run(['balance']);
    expect(nokey.code).toBe(4);
    expect(nokey.err).toContain('okdata login');
    expect(api.seen).toHaveLength(0);
  });

  it('5 when the API cannot be reached', async () => {
    const r = await sandbox('http://127.0.0.1:9', { OKDATA_API_KEY: KEY }).run(['call', 'x.posts.get', 'id=1']);
    expect(r.code).toBe(5);
    expect(r.err).toContain('connection_error');
  });

  it('prints errors as JSON with --json', async () => {
    api.handle(() => errorReply('insufficient_balance', { required: '0.02', available: '0.001', top_up_url: 'https://okdata.online/console/billing/' }));
    const r = await box.run(['call', 'douyin.videos.search', 'query=x', '--json']);
    expect(r.code).toBe(2);
    const doc = JSON.parse(r.out);
    expect(doc.exit_code).toBe(2);
    expect(doc.error).toMatchObject({ code: 'insufficient_balance', charged: false, retry: 'after_fix', required: '0.02' });
  });
});

describe('pages and budgets', () => {
  const listing = (req: { query: URLSearchParams }) => {
    const n = Number(req.query.get('cursor') ?? '1');
    return { body: pageBody([{ id: `${n}` }], { amount: '0.02', next: n < 5 ? String(n + 1) : null }) };
  };

  it('follows next_cursor for --pages and exits 0 when it got them all', async () => {
    api.handle(listing);
    const r = await box.run(['call', 'douyin.videos.search', 'query=x', '--pages', '3']);
    expect(r.code).toBe(0);
    expect(r.out.trim().split('\n')).toHaveLength(3);
    expect(r.err).toContain('3 pages, 3 items, spent $0.06');
  });

  it('stops before --max-spend and exits 3 (charged, stopped)', async () => {
    api.handle(listing);
    const r = await box.run(['call', 'douyin.videos.search', 'query=x', '--pages', '5', '--max-spend', '0.05', '--json']);
    expect(r.code).toBe(3);
    const doc = JSON.parse(r.out);
    expect(doc).toMatchObject({ pages: 2, spent: '0.04', stop_reason: 'max_spend', next_cursor: '3', exit_code: 3 });
    expect(doc.items).toHaveLength(2);
  });

  it('exits 2 when the budget is below one page (nothing called)', async () => {
    api.handle(listing);
    const r = await box.run(['call', 'douyin.videos.search', 'query=x', '--max-spend', '0.01']);
    expect(r.code).toBe(2);
    expect(api.seen).toHaveLength(0);
  });

  it('exits 3 when a later page fails after earlier ones were charged', async () => {
    api.handle((req) => (req.query.get('cursor') === '2' ? errorReply('upstream_failed', { retry: 'no' }) : listing(req)));
    const r = await box.run(['call', 'douyin.videos.search', 'query=x', '--pages', '3']);
    expect(r.code).toBe(3);
    expect(r.out.trim().split('\n')).toHaveLength(1);
    expect(r.err).toContain('Error upstream_failed');
  });
});

describe('okdata more and balance', () => {
  it('reads a kept result for free, and the call record with --receipt', async () => {
    api.handle((req) => (req.path.endsWith('/result')
      ? { body: pageBody([{ id: 'a' }], { amount: '0', replayed: true }) }
      : { body: plainBody({ capability: 'douyin.videos.search', status: 'settled', charged: '0.02', result_status: 'complete', items: 1 }) }));
    const id = '0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20';
    const r = await box.run(['more', id, '--view', 'full']);
    expect(r.code).toBe(0);
    expect(api.seen[0]!.path).toBe(`/v1/calls/${id}/result`);
    expect(api.seen[0]!.query.get('view')).toBe('full');
    expect(r.err).toContain('replayed, not charged');
    expect(JSON.parse(r.out.trim())).toEqual({ id: 'a' });
    const receipt = await box.run(['more', id, '--receipt']);
    expect(receipt.out).toContain('settled · charged $0.02');
  });

  it('shows the balance, limits and where the key came from', async () => {
    api.handle(() => ({ body: plainBody({
      balance: '9.5', currency: 'USD', account_id: 'acc_1',
      key: { id: 'k1', prefix: 'okd_ab12', name: 'Command line', purpose: 'cli', status: 'active', budget: { daily: { limit: '5', spent: '0.1' }, monthly: null, total: null } },
      rate: { tier: 'trial', per_minute: 60, concurrent: 5, free_per_minute: 120 },
    }) }));
    const r = await box.run(['balance']);
    expect(r.code).toBe(0);
    expect(r.out).toContain('Balance $9.5 USD');
    expect(r.out).toContain('"Command line" (okd_ab12…)');
    expect(r.out).toContain('today $0.1 of $5');
    expect(r.out).toContain('Key from: OKDATA_API_KEY');
    const json = await box.run(['balance', '--json']);
    expect(JSON.parse(json.out).balance).toBe('9.5');
  });
});

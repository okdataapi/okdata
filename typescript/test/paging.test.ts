import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { OkData, type Page, type Post } from '../src/index.js';
import { errorReply, pageBody, startMock, type MockApi } from './mock-server.js';

let api: MockApi;
const ok = () => new OkData({ apiKey: 'okd_test', baseUrl: api.url, sleep: async () => {} });

beforeAll(async () => { api = await startMock(); });
afterAll(async () => { await api.close(); });
beforeEach(() => { api.seen.length = 0; });

/** Pages of 2 items at $0.02 each; the cursor is the next page number; `last` pages in all. */
const listing = (last: number, amount = '0.02') => (req: { query: URLSearchParams }) => {
  const n = Number(req.query.get('cursor') ?? '1');
  return { body: pageBody([{ id: `${n}a` }, { id: `${n}b` }], { amount, next: n < last ? String(n + 1) : null }) };
};

async function collect<T>(it: AsyncIterable<T>): Promise<T[]> {
  const out: T[] = [];
  for await (const x of it) out.push(x);
  return out;
}

describe('pages()', () => {
  it('follows next_cursor with the same params until the end', async () => {
    api.handle(listing(3));
    const pager = ok().pages('douyin.videos.search', { query: '露营', sort: 'latest' });
    const pages: Page<Post>[] = await collect(pager);
    expect(pages.map((p) => p.items.length)).toEqual([2, 2, 2]);
    expect(api.seen.map((s) => s.query.get('cursor'))).toEqual([null, '2', '3']);
    expect(api.seen.every((s) => s.query.get('query') === '露营' && s.query.get('sort') === 'latest')).toBe(true);
    expect(new Set(api.seen.map((s) => s.headers['idempotency-key'])).size).toBe(3);
    expect(pager.stopReason).toBe('end');
    expect(pager.spent).toBe('0.06');
    expect(pager.calls).toBe(3);
  });

  it('stops at maxPages', async () => {
    api.handle(listing(10));
    const pager = ok().pages('douyin.videos.search', { query: 'x' }, { maxPages: 2 });
    expect(await collect(pager)).toHaveLength(2);
    expect(pager.stopReason).toBe('max_pages');
  });

  it('stops before the next page could take the total past maxSpend, and caps each call at what is left', async () => {
    api.handle(listing(10));
    const pager = ok().pages('douyin.videos.search', { query: 'x' }, { maxSpend: '0.05' });
    expect(await collect(pager)).toHaveLength(2); // 0.02 + 0.02; a third could reach 0.06
    expect(pager.stopReason).toBe('max_spend');
    expect(pager.spent).toBe('0.04');
    expect(api.seen.map((s) => s.headers['x-max-price'])).toEqual(['0.05', '0.03']);
  });

  it('makes no call when maxSpend is below one page', async () => {
    api.handle(listing(10));
    const pager = ok().pages('douyin.videos.search', { query: 'x' }, { maxSpend: 0.01 });
    expect(await collect(pager)).toHaveLength(0);
    expect(pager.stopReason).toBe('max_spend');
    expect(api.seen).toHaveLength(0);
  });

  it('prices a per-item endpoint by its most per call, and keeps a tighter maxPrice of yours', async () => {
    // $0.058 an item, at most $0.58 a call; each page here charges 2 items ($0.116).
    api.handle(listing(10, '0.116'));
    const pager = ok().pages('wechat_mp.accounts.search', { query: '咖啡', maxPrice: '0.3' }, { maxSpend: '0.8' });
    expect(await collect(pager)).toHaveLength(2); // 0.116 + 0.58 <= 0.8 once more; 0.232 + 0.58 > 0.8
    expect(pager.spent).toBe('0.232');
    expect(pager.stopReason).toBe('max_spend');
    expect(api.seen.map((s) => s.headers['x-max-price'])).toEqual(['0.3', '0.3']);
  });

  it('treats the server refusing our cap as the budget, not an error', async () => {
    api.handle(() => errorReply('max_price_exceeded', { required: '0.5' }));
    const pager = ok().pages('newplatform.things.list', {}, { maxSpend: '0.1' });
    expect(await collect(pager)).toHaveLength(0);
    expect(pager.stopReason).toBe('max_spend');
  });

  it('stops when the balance will not cover the next page', async () => {
    api.handle(() => ({ body: pageBody([{ id: '1' }], { next: '2', coversNext: false }) }));
    const pager = ok().pages('douyin.videos.search', { query: 'x' });
    expect(await collect(pager)).toHaveLength(1);
    expect(pager.stopReason).toBe('balance');
  });

  it('passes an error on a later page through, with what was spent so far', async () => {
    api.handle((req) => (req.query.get('cursor') === '2' ? errorReply('cursor_expired', { param: 'cursor' }) : listing(5)(req)));
    const pager = ok().pages('douyin.videos.search', { query: 'x' });
    await expect(collect(pager)).rejects.toMatchObject({ code: 'cursor_expired' });
    expect(pager.spent).toBe('0.02');
  });

  it('refuses a single-object endpoint and a second iteration', async () => {
    expect(() => ok().pages('x.posts.get' as never, { id: '1' } as never)).toThrow(/one object/);
    api.handle(listing(1));
    const pager = ok().pages('douyin.videos.search', { query: 'x' });
    await collect(pager);
    await expect(collect(pager)).rejects.toThrow(/once/);
  });
});

describe('items()', () => {
  it('yields items across pages and stops at maxItems without fetching more', async () => {
    api.handle(listing(10));
    const items = ok().items('douyin.videos.search', { query: 'x' }, { maxItems: 3 });
    expect((await collect(items)).map((i) => i.id)).toEqual(['1a', '1b', '2a']);
    expect(items.stopReason).toBe('max_items');
    expect(items.items).toBe(3);
    expect(api.seen).toHaveLength(2);
    expect(items.spent).toBe('0.04');
  });

  it('reports the pager stop reason otherwise', async () => {
    api.handle(listing(2));
    const items = ok().items('douyin.videos.search', { query: 'x' });
    expect(await collect(items)).toHaveLength(4);
    expect(items.stopReason).toBe('end');
  });
});

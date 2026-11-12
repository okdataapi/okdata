// Compile-time checks of the generated types (tsc runs this file; vitest does not).
import { OkData, type Account, type Batch, type Item, type Page, type Post } from '../src/index.js';

const ok = new OkData({ apiKey: 'okd_x' });

export async function checks(): Promise<void> {
  const page: Page<Post> = await ok.douyin.videos.search({ query: '露营', sort: 'latest', maxPrice: '0.05' });
  const one: Item<Post> = await ok.x.posts.get({ url: 'https://x.com/a/status/1' });
  const single: Item<Account> = await ok.x.users.get({ username: 'openai' });
  const batch: Batch<Account> = await ok.x.users.get({ ids: ['1', '2'] });
  const viaCall: Page<Post> = await ok.call('douyin.videos.search', { query: 'x' });
  for await (const p of ok.pages('douyin.videos.search', { query: 'x' }, { maxSpend: '0.1' })) p.items.map((x: Post) => x.id);
  for await (const item of ok.items('douyin.videos.comments.list', { id: '1' }, { maxItems: 5 })) void item.text;
  void [page, one, single, batch, viaCall];

  // The README's examples.
  for (const row of page.items) console.log(row.id, row.metrics.likes, row.text.slice(0, 60));
  for await (const p of ok.pages('douyin.videos.comments.list', { id: '7301234567890123456' }, { maxPages: 5, maxSpend: '0.01' })) console.log(p.items.length, p.cost);
  const items = ok.items('x.posts.search', { query: 'claude code' }, { maxItems: 200, maxSpend: '0.05' });
  for await (const post of items) console.log(post.text);
  console.log(items.spent, items.stopReason, await ok.call('weibo.trends.list', {}));

  // @ts-expect-error query is required
  await ok.douyin.videos.search({});
  // @ts-expect-error sort takes only the catalog's values
  await ok.douyin.videos.search({ query: 'x', sort: 'loudest' });
  // @ts-expect-error id and url: exactly one
  await ok.x.posts.get({ id: '1', url: 'https://x.com/a/status/1' });
  // @ts-expect-error id or url is needed
  await ok.x.posts.get({});
}

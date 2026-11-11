import { OkData } from '../src/index.js';
const ok = new OkData({ apiKey: 'okd_x' });
// @ts-expect-error id or url is required
void ok.douyin.videos.get({});
// @ts-expect-error not both
void ok.douyin.videos.get({ id: '1', url: 'u' });
// @ts-expect-error query is required
void ok.douyin.videos.search({});
// @ts-expect-error sort is an enum
void ok.douyin.videos.search({ query: 'a', sort: 'oldest' });
void ok.douyin.trends.list();
void ok.x.trends.list({ country: 'US', view: 'compact', fields: ['rank', 'name'] });
async function f() { const p = await ok.youtube.videos.search({ query: 'a' }); const n: number | null = p.items[0]!.metrics.views; return n; }
void f;

# okdata for TypeScript and JavaScript

Public data from Douyin, Xiaohongshu (RedNote), WeChat Official Accounts, Bilibili, Weibo, TikTok, X and YouTube,
for AI agents and scripts. One client, one result shape, pay per call; failed calls are free.

```bash
npm install okdata
```

Built on `fetch` with no dependencies. Node 20+, Bun and Deno. Get a key at
[okdata.online](https://okdata.online/signup/?src=npm-okdata) and put it in `OKDATA_API_KEY`. Run it on a server:
a key in a browser bundle is a key anyone can read.

## Use it

```ts
import { OkData } from 'okdata';

const ok = new OkData(); // reads OKDATA_API_KEY; new OkData({ apiKey: 'okd_...' }) also works

// Lists come back as a page: items, nextCursor, hasMore, cost
const page = await ok.xiaohongshu.notes.search({ query: '露营 装备', sort: 'popular' });
for (const note of page.items) console.log(note.metrics.likes, note.title, note.url);
console.log(page.cost);       // '0.02' (USD, a decimal string)
console.log(page.nextCursor); // pass back as cursor for the next page (a new call)

// Single objects come back as an item
const { item: video } = await ok.youtube.videos.get({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' });
const { item: transcript } = await ok.youtube.videos.transcript.get({ id: 'dQw4w9WgXcQ', lang: 'en' });
console.log(transcript.text.slice(0, 200));
```

Every endpoint is a method named after its id: `douyin.videos.comments.list` is
`ok.douyin.videos.comments.list({ id })`. Parameters and results are typed, enums are unions, and endpoints that
read one object take `{ id }` or `{ url }`, never both. Hover a method to see its price.

Any endpoint, including ones newer than your SDK version, also works by id:

```ts
const result = await ok.call('weibo.trends.list');
```

## Spend on purpose

```ts
import { maxCost } from 'okdata';

console.log(maxCost('douyin.videos.search', 5)); // '0.1': say this before a big job

for await (const page of ok.pages('tiktok.videos.comments.list', { id: '7305085486984858894' }, { maxPages: 5 })) {
  // each page is its own call and its own charge; stops early when there are no more
}
```

`view: 'compact'` drops null fields and `fields: ['id', 'text', 'metrics.likes']` keeps only what you list, which
keeps results small when an agent reads them (treat such results as `Partial<...>`).

## Errors and retries

Errors throw `OkDataError` with `code`, `status`, `charged`, `retry`, `retryAfterSeconds` and `requestId`:

```ts
import { OkDataError } from 'okdata';

try {
  await ok.douyin.videos.get({ id: '0' });
} catch (err) {
  if (err instanceof OkDataError) console.log(err.code, err.charged, err.retry); // not_found false no
}
```

The client retries `rate_limited`, `upstream_busy`, `upstream_failed`, `internal_error`, `timeout` and network
failures (2 retries by default, exponential backoff, and exactly the wait the server asks for on a 429). Every paid
call carries an `Idempotency-Key`, made for you unless you pass `{ idempotencyKey }`, and retries reuse it, so a
retry is never charged twice: a call that went through before a timeout comes back as a free replay
(`result.replayed`). If the first attempt is still running, the client waits for it; if it gives up first, the error
has `charged: null`.

`OkDataConnectionError` means no answer came back; `charged` is `null` because it is not known. Look the call up
with `ok.getCall(requestId)` or send it again with the same `idempotencyKey`.

## Options

| Option | Default | |
|---|---|---|
| `apiKey` | `process.env.OKDATA_API_KEY` | keys start with `okd_`; never commit one |
| `baseUrl` | `OKDATA_BASE_URL` or `https://api.okdata.online` | |
| `timeoutMs` | `60000` | per attempt; some WeChat endpoints are slow |
| `maxRetries` | `2` | `0` turns retries off |
| `maxRetryDelayMs` | `8000` | a server wait longer than this throws instead of sleeping |
| `fetch` | `globalThis.fetch` | pass your own for proxies |

Per call: `{ idempotencyKey, signal, timeoutMs }` as the second argument. Also: `ok.account()` (balance),
`ok.status()` and `ok.catalog()` (free, no key), `ENDPOINTS` (every endpoint's path, price and page size).

## Links

- Every endpoint, with parameters, fields and prices: <https://okdata.online/apis/>
- Errors: <https://github.com/okdataapi/okdata/blob/main/docs/errors.md>
- MCP server for agents: `https://api.okdata.online/mcp`
- Source and issues: <https://github.com/okdataapi/okdata>

MIT licence. okdata is not affiliated with the platforms it reads.

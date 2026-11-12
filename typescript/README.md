# @okdata/sdk

Social data for AI agents, paid per call: Douyin, Xiaohongshu, WeChat, Bilibili, Weibo, Kuaishou, Zhihu,
TikTok, X, YouTube, Instagram, Reddit and more, as one API with one envelope and one error format.
Every endpoint is a typed method generated from the okdata catalog, with its price in its doc comment.
No runtime dependencies; Node 20.3+ (or any runtime with `fetch` and `AbortSignal.any`).

```sh
npm install @okdata/sdk
export OKDATA_API_KEY=okd_...   # https://okdata.online/console/
```

## First call

The Playground's TypeScript tab shows the raw `fetch`; with the SDK the same call is:

```ts
import { OkData } from '@okdata/sdk';

const ok = new OkData(); // reads OKDATA_API_KEY; new OkData({ apiKey: 'okd_...' }) works too
const page = await ok.douyin.videos.search({ query: '露营装备', sort: 'latest', maxPrice: '0.05' });
for (const row of page.items) console.log(row.id, row.metrics.likes, row.text.slice(0, 60));
console.log('cost: $' + page.cost);
```

Parameters are flat and named as in the API (`query`, `id`, `url`, `cursor`, ...), typed from the
catalog: required ones are required, enums are unions, "id or url" is exactly one of the two. Every
method also takes `view` (`compact` | `standard` | `full`, same price), `fields` (`['id', 'text']` or
`'id,text'`) and `maxPrice` (sent as `X-Max-Price`: a call that could cost more is refused before it
runs, never charged). The second argument takes `{ idempotencyKey, signal, timeoutMs }`. Any endpoint
also works by id, typed: `ok.call('weibo.trends.list', {})`; ids newer than your SDK version work too.

What comes back: a `Page` (list endpoints: `items`, `nextCursor`, `hasMore`), an `Item` (one object:
`item`) or a `Batch` (`ids: [...]` on endpoints that take a list: `items`, `missing`). Each has
`cost`, `balanceAfter`, `requestId`, `resultStatus`, `replayed`, `warnings`, `meta` and the `raw`
envelope. Objects are typed (`Post`, `Account`, `Comment`, ...); fields outside `view=compact` are
optional.

## Paging within a budget

```ts
for await (const page of ok.pages('douyin.videos.comments.list', { id: '7301234567890123456' }, { maxPages: 5, maxSpend: '0.01' })) {
  console.log(page.items.length, page.cost);
}

const items = ok.items('x.posts.search', { query: 'claude code' }, { maxItems: 200, maxSpend: '0.05' });
for await (const post of items) console.log(post.text);
console.log(items.spent, items.stopReason); // '0.03', 'max_items' | 'max_spend' | 'end' | 'balance' | 'max_pages'
```

Each page is a separate, separately charged call. Before each page the pager adds what that page could
cost at most (the endpoint's `maxCharge`) and stops if the total would pass `maxSpend`; each call also
carries `X-Max-Price` set to what is left, so the server refuses (free) anything dearer.

## Retries and idempotency

Every paid call gets an `Idempotency-Key`, reused by its retries, so a retry is never charged twice.
Retries follow the error body: `retry` `yes` / `same_key` are retried (after `retry_after_seconds` when
given; a wait longer than `maxRetryDelayMs` throws instead), `once` gets one more try, `no` and
`after_fix` are never retried. Defaults: `maxRetries: 2`, `timeoutMs: 65000` per attempt.

## Errors

```ts
import { OkDataError } from '@okdata/sdk';

try {
  await ok.x.posts.get({ id: '1850000000000000000' });
} catch (err) {
  if (!(err instanceof OkDataError)) throw err;
  err.code; err.charged; err.retry; err.requestId; // branch on code, never on message
  err.message; err.messageZh; err.problems; err.param; err.reason; err.retryAfterSeconds;
}
```

`charged` is `false` for almost every error, `true` for a `not_found` the endpoint charges (`amount`
says how much) and `null` when it is not known yet (a lost answer, `settlement_unknown`): look it up
with `ok.calls.get(err.requestId)` or `ok.calls.byKey(err.idempotencyKey)`. A lost connection throws
`OkDataConnectionError` (`connection_error` or `client_timeout`, `charged: null`). The codes are in
`ERROR_CODES` and at https://okdata.online/docs/errors/.

## Free routes

`ok.catalog()`, `ok.status()` (no key needed), `ok.account()` (balance, key limits, rate tier),
`ok.usage({ groupBy: ['day', 'capability'] })`, `ok.calls.get(requestId)`,
`ok.calls.result(requestId, { view: 'full' })` (a result kept 24 h, read again for free) and
`ok.calls.byKey(idempotencyKey)`. `ok.request(method, path, init)` reaches any other route.

## Options

`new OkData({ apiKey, baseUrl, timeoutMs, maxRetries, retryBaseMs, maxRetryDelayMs, source, endUser, userAgent, fetch })`.
`baseUrl` defaults to `OKDATA_BASE_URL`, then `https://api.okdata.online`. `source` and `endUser` are
sent as `X-Source` and `X-End-User` for your usage figures; every call carries `X-Entry: sdk`. Keep keys
on a server: a key in a browser bundle is a key anyone can read.

## Development

This directory is exported from the okdata monorepo. `src/generated/` (the typed methods, models and
the error table) is generated there from the endpoint catalog and committed here, so the package builds
on its own; please do not edit it by hand. Issues and pull requests on the hand-written files are welcome.

In the repository root (one npm workspace for `typescript/` and `cli/`):

```sh
npm install
npm run typecheck -w typescript
npm test -w typescript          # unit tests against a local mock server: no key, no network
npm run build -w typescript     # dist/
OKDATA_LIVE_KEY=okd_... npm test -w typescript   # adds a live smoke test of the free routes only
```

MIT licensed.

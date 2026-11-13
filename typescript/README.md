# okdata for TypeScript

**抖音数据 API · 小红书数据接口 · 公众号文章阅读数接口 · 星图 / 蒲公英达人数据 · 社媒数据 MCP。**
[中文说明](#中文) · [中文文档](https://okdata.online/zh/docs/sdk/?src=npm-okdata-sdk)

Social data for AI agents, paid per call: TikTok, RedNote (Xiaohongshu), Douyin, WeChat (Official Accounts
and Channels), X, YouTube, Instagram, Reddit, Bilibili, Weibo, Kuaishou and more. 200+ endpoints on 17
platforms behind one key, as typed TypeScript methods, plain HTTP, or a remote MCP server for Claude, Cursor
and Codex. A call that fails costs nothing, and you need no platform accounts, cookies or QR logins.
Every endpoint is a typed method generated from the okdata catalog, with its price in its doc comment.

```sh
npm install @okdata/sdk     # Node 20.3+ (or any runtime with fetch and AbortSignal.any), no dependencies
export OKDATA_API_KEY=okd_...
```

No key yet? Sign up at [okdata.online](https://okdata.online/signup/?src=npm-okdata-sdk)
(中文：[注册](https://okdata.online/zh/signup/?src=npm-okdata-sdk)).

## What you can read

| Platform | For example | Per call or item |
|---|---|---|
| Douyin (抖音) | video search, comments and replies, plays and likes, the hot list, Xingtu (星图) creators with rates and audience | from $0.002 |
| Xiaohongshu / RedNote (小红书) | note search, notes, comments, creators, PGY (蒲公英) creators, shop products and reviews | from $0.02 |
| WeChat (微信) | Official Account (公众号) articles with reads and likes, Channels (视频号) videos and comments, WeChat Search | from $0.015 |
| Weibo (微博) | the hot search list, post search, comments, accounts | from $0.002 |
| Bilibili (B站) | video search, comments, uploader videos, the popular board | from $0.002 |
| Kuaishou (快手) | video search, comments, accounts, the hot list | from $0.002 |
| TikTok | video search, comments, accounts, transcripts, TikTok Shop products, Creative Center ads | from $0.002 |
| X (Twitter) | post search, replies, quotes, accounts, followers, lists, communities | from $0.0001 |
| YouTube, Instagram, Reddit, Telegram | search, posts, comments, channels and accounts, transcripts | from $0.002 |
| Meta and Google ad libraries | ads by keyword or advertiser | from $0.004 |

Every endpoint with its parameters, fields and price: [okdata.online/apis](https://okdata.online/apis/?src=npm-okdata-sdk)
(中文：[接口列表](https://okdata.online/zh/apis/?src=npm-okdata-sdk)).

## Use it from Claude, Cursor or Codex (MCP)

An agent can use the same endpoints without this SDK, through the remote MCP server at
`https://api.okdata.online/mcp` (Streamable HTTP, header `Authorization: Bearer <key>`). In Claude Code:

```sh
claude mcp add --transport http --scope user okdata https://api.okdata.online/mcp \
  --header 'Authorization: Bearer ${OKDATA_API_KEY}'
```

`npx okdata setup --client cursor` (or `codex`, `claude-code`) writes the entry for you. Claude Desktop and
other clients that only start local servers run [`npx -y @okdata/mcp`](https://www.npmjs.com/package/@okdata/mcp)
instead. The agent looks up an endpoint and its price for free; only the data call is charged. More clients:
[okdata.online/mcp](https://okdata.online/mcp/?src=npm-okdata-sdk).

<a id="中文"></a>

## 中文

okdata 是给 AI 智能体和代码用的社媒数据接口，按次付费。一个 key 就能读抖音、小红书、公众号、视频号、B站、微博、快手，
以及 TikTok、X、YouTube、Instagram、Reddit 的公开数据：搜视频和笔记、批量拉评论、查星图和蒲公英达人、
拿公众号文章的阅读数和点赞数、看微博热搜和抖音热榜。可以用这个 TypeScript SDK，也可以在 Claude、Cursor、Codex 里
接 MCP（上面那一条命令；Claude Desktop 用 `npx -y @okdata/mcp`），或者直接发 HTTP 请求。调用失败不扣钱，
不需要平台账号、Cookie，也不用扫码。支付宝、微信、银行卡都能充值。

[中文文档](https://okdata.online/zh/docs/sdk/?src=npm-okdata-sdk) · [接口和价格](https://okdata.online/zh/apis/?src=npm-okdata-sdk) ·
[MCP 接入](https://okdata.online/zh/mcp/?src=npm-okdata-sdk) · [注册](https://okdata.online/zh/signup/?src=npm-okdata-sdk)

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

MIT licensed.

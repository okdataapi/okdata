# okdata for Python

**抖音数据 API · 小红书数据接口 · 公众号文章阅读数接口 · 星图 / 蒲公英达人数据 · 社媒数据 MCP。**
[中文说明](#中文) · [中文文档](https://okdata.online/zh/docs/sdk/?src=pypi-okdata)

Social data for AI agents, paid per call: TikTok, RedNote (Xiaohongshu), Douyin, WeChat (Official Accounts
and Channels), X, YouTube, Instagram, Reddit, Bilibili, Weibo, Kuaishou and more. 200+ endpoints on 17
platforms behind one key, as typed Python methods, plain HTTP, or a remote MCP server for Claude, Cursor
and Codex. A call that fails costs nothing, and you need no platform accounts, cookies or QR logins.
Every endpoint is a typed method generated from the okdata catalog, with its price in its docstring.

```sh
pip install okdata          # Python 3.9+, one dependency (httpx)
export OKDATA_API_KEY=okd_...
```

No key yet? Sign up at [okdata.online](https://okdata.online/signup/?src=pypi-okdata)
(中文：[注册](https://okdata.online/zh/signup/?src=pypi-okdata)).

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

Every endpoint with its parameters, fields and price: [okdata.online/apis](https://okdata.online/apis/?src=pypi-okdata)
(中文：[接口列表](https://okdata.online/zh/apis/?src=pypi-okdata)).

## Use it from Claude, Cursor or Codex (MCP)

An agent can use the same endpoints without this SDK, through the remote MCP server at
`https://api.okdata.online/mcp` (Streamable HTTP, header `Authorization: Bearer <key>`). In Claude Code:

```sh
claude mcp add --transport http --scope user okdata https://api.okdata.online/mcp \
  --header 'Authorization: Bearer ${OKDATA_API_KEY}'
```

`npx okdata setup --client cursor` (or `codex`, `claude-code`) writes the entry for you. The agent looks up
an endpoint and its price for free; only the data call is charged. More clients:
[okdata.online/mcp](https://okdata.online/mcp/?src=pypi-okdata).

<a id="中文"></a>

## 中文

okdata 是给 AI 智能体和代码用的社媒数据接口，按次付费。一个 key 就能读抖音、小红书、公众号、视频号、B站、微博、快手，
以及 TikTok、X、YouTube、Instagram、Reddit 的公开数据：搜视频和笔记、批量拉评论、查星图和蒲公英达人、
拿公众号文章的阅读数和点赞数、看微博热搜和抖音热榜。可以用这个 Python SDK，也可以在 Claude、Cursor、Codex 里
接 MCP（上面那一条命令），或者直接发 HTTP 请求。调用失败不扣钱，不需要平台账号、Cookie，也不用扫码。
支付宝、微信、银行卡都能充值。

[中文文档](https://okdata.online/zh/docs/sdk/?src=pypi-okdata) · [接口和价格](https://okdata.online/zh/apis/?src=pypi-okdata) ·
[MCP 接入](https://okdata.online/zh/mcp/?src=pypi-okdata) · [注册](https://okdata.online/zh/signup/?src=pypi-okdata)

## First call

The Playground's Python tab shows the raw HTTP request; with the SDK the same call is:

```python
from okdata import OkData

ok = OkData()  # reads OKDATA_API_KEY; OkData("okd_...") works too
page = ok.douyin.videos.search(query="露营装备", sort="latest", max_price="0.05")
for row in page.items:
    print(row["id"], row["metrics"]["likes"], row["text"][:60])
print("cost: $" + page.cost)
```

Parameters are flat and named as in the API (`query`, `id`, `url`, `cursor`, ...). Every method also
takes `view` (`compact` | `standard` | `full`, same price), `fields` (`["id", "text"]` or `"id,text"`),
`max_price` (sent as `X-Max-Price`: a call that could cost more is refused before it runs, never
charged), `idempotency_key` and `timeout`. Any endpoint also works by id:
`ok.call("weibo.trends.list")`, including ids newer than your SDK version.

What comes back: `Page` (list endpoints: `items`, `next_cursor`, `has_more`), `Item` (one object:
`item`) or `Batch` (`ids=[...]` on endpoints that take a list: `items`, `missing`). Each has `cost`,
`balance_after`, `request_id`, `result_status`, `replayed`, `warnings`, `meta` and the `raw` envelope.
Items are plain dicts, typed as `TypedDict`s (`Post`, `Account`, `Comment`, ...).

## Paging within a budget

```python
for page in ok.pages("douyin.videos.comments.list", id="7301234567890123456", max_pages=5, max_spend="0.01"):
    ...

items = ok.items("x.posts.search", query="claude code", max_items=200, max_spend="0.05")
rows = list(items)
print(items.spent, items.stop_reason)   # "0.03", "max_items" | "max_spend" | "end" | "balance" | "max_pages"
```

Each page is a separate, separately charged call. Before each page the pager adds what that page could
cost at most (the endpoint's `max_charge`) and stops if the total would pass `max_spend`; each call also
carries `X-Max-Price` set to what is left, so the server refuses (free) anything dearer.

## Retries and idempotency

Every paid call gets an `Idempotency-Key`, reused by its retries, so a retry is never charged twice.
Retries follow the error body: `retry` `yes` / `same_key` are retried (after `retry_after_seconds` when
given; a wait longer than `max_retry_delay` raises instead), `once` gets one more try, `no` and
`after_fix` are never retried. Defaults: `max_retries=2`, `timeout=65` seconds per attempt.

## Errors

```python
from okdata import OkDataError

try:
    ok.x.posts.get(id="1850000000000000000")
except OkDataError as err:
    err.code, err.charged, err.retry, err.request_id   # branch on code, never on message
    err.message, err.message_zh, err.problems, err.param, err.reason, err.retry_after_seconds
```

`charged` is `False` for almost every error, `True` for a `not_found` the endpoint charges (`amount`
says how much) and `None` when it is not known yet (a lost answer, `settlement_unknown`): look it up
with `ok.calls.get(err.request_id)` or `ok.calls.by_key(err.idempotency_key)`. A lost connection raises
`OkDataConnectionError` (`connection_error` or `client_timeout`, `charged=None`). The codes are in
`okdata.ERROR_CODES` and at https://okdata.online/docs/errors/.

## Async

```python
import asyncio
from okdata import AsyncOkData

async def main():
    async with AsyncOkData() as ok:
        page = await ok.weibo.trends.list()
        async for row in ok.items("douyin.videos.search", query="露营装备", max_spend="0.1"):
            print(row["id"])

asyncio.run(main())
```

## Free routes

`ok.catalog()`, `ok.status()` (no key needed), `ok.account()` (balance, key limits, rate tier),
`ok.usage(group_by=["day", "capability"])`, `ok.calls.get(request_id)`, `ok.calls.result(request_id,
view="full")` (a result kept 24 h, read again for free) and `ok.calls.by_key(idempotency_key)`.

## Options

`OkData(api_key=None, *, base_url=None, timeout=65.0, max_retries=2, retry_base_delay=0.5,
max_retry_delay=20.0, source=None, end_user=None, user_agent=None, http_client=None)`. `base_url`
defaults to `OKDATA_BASE_URL`, then `https://api.okdata.online`. `source` and `end_user` are sent as
`X-Source` and `X-End-User` for your usage figures; every call carries `X-Entry: sdk`.

MIT licensed.

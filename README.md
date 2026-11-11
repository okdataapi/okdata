# okdata: social data API for AI agents and code

[English](#english) · [中文](#中文)

<a id="english"></a>

[okdata](https://okdata.online) reads public data from Douyin, Xiaohongshu (RedNote), WeChat Official Accounts,
Bilibili, Weibo, TikTok, X and YouTube: posts, accounts, comments, hot search boards and video transcripts.
35 endpoints, one key, one response shape. You pay per call, from $0.001, and a call that fails costs nothing.
No platform accounts, cookies or QR logins on your side.

This repository holds the Python and TypeScript SDKs and the documents agents read (one Markdown file per
endpoint, `llms.txt`, OpenAPI 3.1, the price list). The docs are generated from the same catalog the API runs on.

| | Install or connect | Source |
|---|---|---|
| Python SDK | `pip install okdata` | [`python/`](python/) |
| TypeScript SDK | `npm install okdata` | [`typescript/`](typescript/) |
| Remote MCP server | `https://api.okdata.online/mcp` (Streamable HTTP) | hosted |
| Agent Skills | `npx skills add okdataapi/skills` | [okdataapi/skills](https://github.com/okdataapi/skills) |
| Plain HTTP | `https://api.okdata.online/v1/...` | [`docs/openapi.json`](docs/openapi.json) |

Get a key at [okdata.online](https://okdata.online/signup/?src=gh-okdata). Keys start with `okd_`; keep yours in
the `OKDATA_API_KEY` environment variable.

## Quick start

Python:

```python
from okdata import OkData

ok = OkData()  # reads OKDATA_API_KEY
page = ok.xiaohongshu.notes.search(query="防晒霜 推荐", sort="popular", fields=["id", "title", "metrics.likes", "url"])
for note in page.items:
    print(note["metrics"]["likes"], note["title"], note["url"])
print("cost:", page.cost, "USD")
```

TypeScript:

```ts
import { OkData } from 'okdata';

const ok = new OkData(); // reads OKDATA_API_KEY
const page = await ok.youtube.videos.search({ query: 'claude code tutorial', sort: 'latest' });
for (const video of page.items) console.log(video.metrics.views, video.title, video.url);
console.log('cost:', page.cost, 'USD');
```

cURL (the path is the endpoint id with dots as slashes, under `/v1`):

```bash
curl -G https://api.okdata.online/v1/douyin/videos/search \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode "query=露营装备" -d sort=latest
```

## Connect an AI agent

Tell the agent: *"Read https://okdata.online/agents.md and set up okdata. My key is in OKDATA_API_KEY."*

Or add the MCP server yourself. Claude Code:

```bash
claude mcp add --transport http okdata https://api.okdata.online/mcp \
  --header "Authorization: Bearer $OKDATA_API_KEY"
```

Cursor (`~/.cursor/mcp.json`):

```json
{ "mcpServers": { "okdata": { "url": "https://api.okdata.online/mcp", "headers": { "Authorization": "Bearer ${env:OKDATA_API_KEY}" } } } }
```

Codex (`~/.codex/config.toml`):

```toml
[mcp_servers.okdata]
url = "https://api.okdata.online/mcp"
bearer_token_env_var = "OKDATA_API_KEY"
```

The server has four tools. `find` (search endpoints in plain English or Chinese) and `describe` (parameters,
fields, price) are free and work without a key; `call` runs an endpoint at its price; `account` shows the balance.
More clients: [docs/agents.md](docs/agents.md).

## How calls behave

- **One shape.** Success is `{"code":"ok","data":{"items":[...]},"page":{...},"meta":{...}}` (or `data.item` for a
  single object). A Post has the same fields on Douyin and on YouTube; a field a platform lacks is `null` and
  `meta.unavailable` says why.
- **Billing.** `meta.billing.amount` is what the call cost, in USD. One call is one page; the next page
  (`page.next_cursor` sent back as `cursor`) is a new call. Errors are never charged.
- **Safe retries.** Send an `Idempotency-Key`. The same key and request within 24 hours replays the stored result
  for free, so a retry after a timeout cannot bill twice. Both SDKs do this for you.
- **Smaller answers.** `view=compact|standard|full` and `fields=id,text,metrics.likes` cut what comes back, which
  saves tokens when an agent reads the result.
- **Errors** carry `code`, `charged`, `retry` and `retry_after_seconds`; see [docs/errors.md](docs/errors.md).

## Endpoints

Every endpoint has a page under [`docs/apis/`](docs/apis/) with parameters, fields, request examples and the
price; prices also live in [`docs/prices.json`](docs/prices.json).

<!-- okdata:endpoints:en:start -->
**Douyin**

| Endpoint | ID | Price |
|---|---|---|
| [Douyin video search](docs/apis/douyin/videos/search.md) | `douyin.videos.search` | $0.02 per call |
| [Douyin video detail](docs/apis/douyin/videos/get.md) | `douyin.videos.get` | $0.002 per call |
| [Douyin video comments](docs/apis/douyin/videos/comments/list.md) | `douyin.videos.comments.list` | $0.002 per call |
| [Douyin account profile](docs/apis/douyin/users/get.md) | `douyin.users.get` | $0.002 per call |
| [Douyin account videos](docs/apis/douyin/users/videos/list.md) | `douyin.users.videos.list` | $0.002 per call |
| [Douyin hot search board](docs/apis/douyin/trends/list.md) | `douyin.trends.list` | $0.002 per call |

**Xiaohongshu (RedNote)**

| Endpoint | ID | Price |
|---|---|---|
| [Xiaohongshu note search](docs/apis/xiaohongshu/notes/search.md) | `xiaohongshu.notes.search` | $0.02 per call |
| [Xiaohongshu note detail](docs/apis/xiaohongshu/notes/get.md) | `xiaohongshu.notes.get` | $0.02 per call |
| [Xiaohongshu note comments](docs/apis/xiaohongshu/notes/comments/list.md) | `xiaohongshu.notes.comments.list` | $0.02 per call |
| [Xiaohongshu account profile](docs/apis/xiaohongshu/users/get.md) | `xiaohongshu.users.get` | $0.02 per call |
| [Xiaohongshu account notes](docs/apis/xiaohongshu/users/notes/list.md) | `xiaohongshu.users.notes.list` | $0.02 per call |
| [Xiaohongshu hot topics](docs/apis/xiaohongshu/trends/list.md) | `xiaohongshu.trends.list` | $0.02 per call |

**WeChat Official Accounts**

| Endpoint | ID | Price |
|---|---|---|
| [Official Account search](docs/apis/wechat_mp/accounts/search.md) | `wechat_mp.accounts.search` | $0.058 per item returned, at most $0.58 per call |
| [Official Account article history](docs/apis/wechat_mp/accounts/articles/list.md) | `wechat_mp.accounts.articles.list` | $0.04 per call |
| [Official Account article detail](docs/apis/wechat_mp/articles/get.md) | `wechat_mp.articles.get` | $0.02 per call |

**Bilibili**

| Endpoint | ID | Price |
|---|---|---|
| [Bilibili video search](docs/apis/bilibili/videos/search.md) | `bilibili.videos.search` | $0.002 per call |
| [Bilibili video detail](docs/apis/bilibili/videos/get.md) | `bilibili.videos.get` | $0.002 per call |
| [Bilibili video comments](docs/apis/bilibili/videos/comments/list.md) | `bilibili.videos.comments.list` | $0.002 per call |
| [Bilibili popular board](docs/apis/bilibili/trends/list.md) | `bilibili.trends.list` | $0.002 per call |

**Weibo**

| Endpoint | ID | Price |
|---|---|---|
| [Weibo post search](docs/apis/weibo/posts/search.md) | `weibo.posts.search` | $0.002 per call |
| [Weibo hot search](docs/apis/weibo/trends/list.md) | `weibo.trends.list` | $0.002 per call |
| [Weibo account profile](docs/apis/weibo/users/get.md) | `weibo.users.get` | $0.002 per call |

**TikTok**

| Endpoint | ID | Price |
|---|---|---|
| [TikTok video search](docs/apis/tiktok/videos/search.md) | `tiktok.videos.search` | $0.002 per call |
| [TikTok video detail](docs/apis/tiktok/videos/get.md) | `tiktok.videos.get` | $0.002 per call |
| [TikTok video comments](docs/apis/tiktok/videos/comments/list.md) | `tiktok.videos.comments.list` | $0.002 per call |
| [TikTok account profile](docs/apis/tiktok/users/get.md) | `tiktok.users.get` | $0.002 per call |

**X (Twitter)**

| Endpoint | ID | Price |
|---|---|---|
| [X post detail](docs/apis/x/posts/get.md) | `x.posts.get` | $0.001 per call |
| [X post search](docs/apis/x/posts/search.md) | `x.posts.search` | $0.006 per call |
| [X account profile](docs/apis/x/users/get.md) | `x.users.get` | $0.001 per call |
| [X account posts](docs/apis/x/users/posts/list.md) | `x.users.posts.list` | $0.006 per call |
| [X trending topics](docs/apis/x/trends/list.md) | `x.trends.list` | $0.009 per call |

**YouTube**

| Endpoint | ID | Price |
|---|---|---|
| [YouTube video search](docs/apis/youtube/videos/search.md) | `youtube.videos.search` | $0.004 per call |
| [YouTube video detail](docs/apis/youtube/videos/get.md) | `youtube.videos.get` | $0.004 per call |
| [YouTube video comments](docs/apis/youtube/videos/comments/list.md) | `youtube.videos.comments.list` | $0.004 per call |
| [YouTube video transcript](docs/apis/youtube/videos/transcript/get.md) | `youtube.videos.transcript.get` | $0.004 per call |
<!-- okdata:endpoints:en:end -->

## What is in this repository

```
docs/                 generated: endpoint pages (en, zh), llms.txt, openapi.json, prices.json, catalog.json
python/               the okdata package for Python 3.10+ (httpx)
typescript/           the okdata package for Node 20+, Bun and Deno (fetch, no dependencies)
scripts/sync.ts       regenerates docs/ and the SDKs' endpoint files from the catalog
server.json           the entry for the official MCP registry
```

`docs/`, `python/src/okdata/_endpoints.py`, `python/src/okdata/_models.py`, `typescript/src/endpoints.ts`,
`typescript/src/models.ts` and the tables above are generated; edit the catalog, not these files.

Questions and bugs: open an issue. MIT licence. okdata is not affiliated with any of the platforms it reads.

---

<a id="中文"></a>

## 中文

[okdata](https://okdata.online/zh/) 是给 AI 智能体和代码用的社媒数据接口：抖音、小红书、微信公众号、B站、微博、
TikTok、X、YouTube 的公开内容、账号、评论、热搜榜和视频字幕。35 个接口，一个 key，同一种返回结构。按次付费，
最低 $0.001 一次，调用失败不扣钱。你这边不需要平台账号、Cookie，也不用扫码。

这个仓库放的是 Python 和 TypeScript SDK，以及给智能体读的文档（每个接口一个 Markdown 文件、`llms.txt`、
OpenAPI 3.1、价目表）。文档由 API 自己用的同一份接口目录生成，不会和线上对不上。

| | 安装或接入 | 源码 |
|---|---|---|
| Python SDK | `pip install okdata` | [`python/`](python/) |
| TypeScript SDK | `npm install okdata` | [`typescript/`](typescript/) |
| 远程 MCP | `https://api.okdata.online/mcp`（Streamable HTTP） | 托管 |
| Agent Skills | `npx skills add okdataapi/skills` | [okdataapi/skills](https://github.com/okdataapi/skills) |

在 [okdata.online](https://okdata.online/zh/signup/?src=gh-okdata) 注册拿 key。key 以 `okd_` 开头，
放进环境变量 `OKDATA_API_KEY`，不要写进代码。

### 三行代码

```python
from okdata import OkData

ok = OkData()  # 从 OKDATA_API_KEY 读取 key
page = ok.douyin.trends.list()
for row in page.items:
    print(row["rank"], row["name"], row["heat"])
```

### 接到智能体里

对智能体说：“读一下 https://okdata.online/zh/agents.md ，把 okdata 配好，key 在 OKDATA_API_KEY 里。”
或者自己加 MCP（Claude Code）：

```bash
claude mcp add --transport http okdata https://api.okdata.online/mcp \
  --header "Authorization: Bearer $OKDATA_API_KEY"
```

`find`（用中文或英文找接口）和 `describe`（看参数、字段和价格）免费、不需要 key；`call` 按接口价格扣费；
`account` 看余额。

### 几个约定

- **扣费**：`meta.billing.amount` 就是这次花的钱（美元）。一次调用一页，翻页是新的一次调用。报错不扣费。
- **重试不重复扣费**：带上 `Idempotency-Key`，24 小时内同一个 key、同一个请求直接返回上次的结果，不再扣费。两个 SDK 都会自动带。
- **省 token**：`view=compact` 去掉空字段，`fields=id,text,metrics.likes` 只要需要的字段。
- **错误**：返回 `code`、`charged`（是否扣费）、`retry`（要不要重试），见 [docs/zh/errors.md](docs/zh/errors.md)。

### 接口列表

每个接口在 [`docs/zh/apis/`](docs/zh/apis/) 下都有一页，写清参数、返回字段、示例和价格。

<!-- okdata:endpoints:zh:start -->
**抖音**

| 接口 | ID | 价格 |
|---|---|---|
| [抖音视频搜索](docs/zh/apis/douyin/videos/search.md) | `douyin.videos.search` | 每次 $0.02 |
| [抖音视频详情](docs/zh/apis/douyin/videos/get.md) | `douyin.videos.get` | 每次 $0.002 |
| [抖音视频评论](docs/zh/apis/douyin/videos/comments/list.md) | `douyin.videos.comments.list` | 每次 $0.002 |
| [抖音账号信息](docs/zh/apis/douyin/users/get.md) | `douyin.users.get` | 每次 $0.002 |
| [抖音账号作品列表](docs/zh/apis/douyin/users/videos/list.md) | `douyin.users.videos.list` | 每次 $0.002 |
| [抖音热搜榜](docs/zh/apis/douyin/trends/list.md) | `douyin.trends.list` | 每次 $0.002 |

**小红书**

| 接口 | ID | 价格 |
|---|---|---|
| [小红书笔记搜索](docs/zh/apis/xiaohongshu/notes/search.md) | `xiaohongshu.notes.search` | 每次 $0.02 |
| [小红书笔记详情](docs/zh/apis/xiaohongshu/notes/get.md) | `xiaohongshu.notes.get` | 每次 $0.02 |
| [小红书笔记评论](docs/zh/apis/xiaohongshu/notes/comments/list.md) | `xiaohongshu.notes.comments.list` | 每次 $0.02 |
| [小红书博主信息](docs/zh/apis/xiaohongshu/users/get.md) | `xiaohongshu.users.get` | 每次 $0.02 |
| [小红书博主笔记列表](docs/zh/apis/xiaohongshu/users/notes/list.md) | `xiaohongshu.users.notes.list` | 每次 $0.02 |
| [小红书热点话题](docs/zh/apis/xiaohongshu/trends/list.md) | `xiaohongshu.trends.list` | 每次 $0.02 |

**微信公众号**

| 接口 | ID | 价格 |
|---|---|---|
| [公众号搜索](docs/zh/apis/wechat_mp/accounts/search.md) | `wechat_mp.accounts.search` | 每条 $0.058，每次最多 $0.58 |
| [公众号历史文章](docs/zh/apis/wechat_mp/accounts/articles/list.md) | `wechat_mp.accounts.articles.list` | 每次 $0.04 |
| [公众号文章详情](docs/zh/apis/wechat_mp/articles/get.md) | `wechat_mp.articles.get` | 每次 $0.02 |

**B站**

| 接口 | ID | 价格 |
|---|---|---|
| [B站视频搜索](docs/zh/apis/bilibili/videos/search.md) | `bilibili.videos.search` | 每次 $0.002 |
| [B站视频详情](docs/zh/apis/bilibili/videos/get.md) | `bilibili.videos.get` | 每次 $0.002 |
| [B站视频评论](docs/zh/apis/bilibili/videos/comments/list.md) | `bilibili.videos.comments.list` | 每次 $0.002 |
| [B站热门榜](docs/zh/apis/bilibili/trends/list.md) | `bilibili.trends.list` | 每次 $0.002 |

**微博**

| 接口 | ID | 价格 |
|---|---|---|
| [微博搜索](docs/zh/apis/weibo/posts/search.md) | `weibo.posts.search` | 每次 $0.002 |
| [微博热搜](docs/zh/apis/weibo/trends/list.md) | `weibo.trends.list` | 每次 $0.002 |
| [微博账号信息](docs/zh/apis/weibo/users/get.md) | `weibo.users.get` | 每次 $0.002 |

**TikTok**

| 接口 | ID | 价格 |
|---|---|---|
| [TikTok 视频搜索](docs/zh/apis/tiktok/videos/search.md) | `tiktok.videos.search` | 每次 $0.002 |
| [TikTok 视频详情](docs/zh/apis/tiktok/videos/get.md) | `tiktok.videos.get` | 每次 $0.002 |
| [TikTok 视频评论](docs/zh/apis/tiktok/videos/comments/list.md) | `tiktok.videos.comments.list` | 每次 $0.002 |
| [TikTok 账号信息](docs/zh/apis/tiktok/users/get.md) | `tiktok.users.get` | 每次 $0.002 |

**X（推特）**

| 接口 | ID | 价格 |
|---|---|---|
| [X 帖子详情](docs/zh/apis/x/posts/get.md) | `x.posts.get` | 每次 $0.001 |
| [X 帖子搜索](docs/zh/apis/x/posts/search.md) | `x.posts.search` | 每次 $0.006 |
| [X 账号信息](docs/zh/apis/x/users/get.md) | `x.users.get` | 每次 $0.001 |
| [X 账号帖子列表](docs/zh/apis/x/users/posts/list.md) | `x.users.posts.list` | 每次 $0.006 |
| [X 趋势](docs/zh/apis/x/trends/list.md) | `x.trends.list` | 每次 $0.009 |

**YouTube**

| 接口 | ID | 价格 |
|---|---|---|
| [YouTube 视频搜索](docs/zh/apis/youtube/videos/search.md) | `youtube.videos.search` | 每次 $0.004 |
| [YouTube 视频详情](docs/zh/apis/youtube/videos/get.md) | `youtube.videos.get` | 每次 $0.004 |
| [YouTube 视频评论](docs/zh/apis/youtube/videos/comments/list.md) | `youtube.videos.comments.list` | 每次 $0.004 |
| [YouTube 视频字幕](docs/zh/apis/youtube/videos/transcript/get.md) | `youtube.videos.transcript.get` | 每次 $0.004 |
<!-- okdata:endpoints:zh:end -->

有问题或建议请提 issue。MIT 许可证。okdata 与上述各平台没有关联。

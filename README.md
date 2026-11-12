# okdata: social data API for AI agents and code

**小红书数据接口 · 抖音数据 API · 公众号文章接口 · 快手 / B站 / 微博 / 知乎数据采集 · 社媒数据 MCP。**一个 Key 调用抖音、小红书、微信（公众号、视频号、搜一搜）、快手、B站、微博、知乎、TikTok、X、YouTube、Instagram、Reddit 的公开数据：搜内容、读评论、查博主、看热榜、拿字幕和广告。按次计费，失败不扣费，不用平台账号和 Cookie。[中文文档](https://okdata.online/zh/?src=gh-okdata) · [免费注册](https://okdata.online/zh/signup/?src=gh-okdata)

[English](#english) · [中文](#中文)

<a id="english"></a>

[okdata](https://okdata.online) reads public data from Douyin, Xiaohongshu (RedNote), WeChat (Official Accounts,
Channels and Search), Kuaishou, Bilibili, Weibo, Zhihu, TikTok, X, YouTube, Instagram, Reddit, Telegram and the
Meta and Google ad libraries: posts, accounts, comments, hot lists, transcripts, creators and ads.
196 endpoints on 17 platforms, one key, one response shape. You pay per call or per item returned, from $0.0001,
and a call that fails costs nothing. No platform accounts, cookies or QR logins on your side.

This repository holds the source of the two SDKs and the command line, and the documents agents read (one
Markdown page per endpoint in English and Chinese, `llms.txt`, OpenAPI 3.1, the price list). All of it is
generated from the same catalog the API runs on.

| | Install or connect | Source |
|---|---|---|
| TypeScript SDK | `npm install @okdata/sdk` | [`typescript/`](typescript/) |
| Python SDK | `pip install okdata` | [`python/`](python/) |
| Command line | `npx okdata` (or `npm install -g okdata`) | [`cli/`](cli/) |
| Remote MCP server | `https://api.okdata.online/mcp` (Streamable HTTP) | hosted |
| Agent Skills | `npx skills add okdataapi/skills` | [okdataapi/skills](https://github.com/okdataapi/skills) |
| Plain HTTP | `https://api.okdata.online/v1/...` | [`docs/openapi.json`](docs/openapi.json) |

Get a key at [okdata.online](https://okdata.online/signup/?src=gh-okdata), or let the command line make one
with `npx okdata login`. Keys start with `okd_`; keep yours in the `OKDATA_API_KEY` environment variable.

## Quick start

TypeScript (Node 20.3+, Bun, Deno; no dependencies):

```ts
import { OkData } from '@okdata/sdk';

const ok = new OkData(); // reads OKDATA_API_KEY
const page = await ok.douyin.videos.search({ query: '露营装备', sort: 'latest', maxPrice: '0.05' });
for (const row of page.items) console.log(row.id, row.metrics.likes, row.text.slice(0, 60));
console.log('cost: $' + page.cost);
```

Python (3.9+, sync and async):

```python
from okdata import OkData

ok = OkData()  # reads OKDATA_API_KEY
page = ok.xiaohongshu.notes.search(query="防晒霜 推荐", sort="popular", fields=["id", "title", "metrics.likes", "url"])
for note in page.items:
    print(note["metrics"]["likes"], note["title"], note["url"])
print("cost: $" + page.cost)
```

Every endpoint is a typed method named after its id (`douyin.videos.search` is `ok.douyin.videos.search`), with
its price in the doc comment. Both SDKs page within a spend limit (`ok.pages(...)`, `ok.items(...)`), send an
`Idempotency-Key` so a retry is never charged twice, and raise one error type that says whether the call was
charged and whether to retry. Details: [typescript/README.md](typescript/README.md),
[python/README.md](python/README.md).

Command line:

```bash
npx okdata find 小红书 评论                    # free, no key: which endpoint, what it costs
npx okdata show xiaohongshu.notes.comments.list
npx okdata login                              # open the printed link and approve; saves a key for this terminal
npx okdata call douyin.videos.search 'query=露营装备' 'sort=latest' --max-price 0.05
npx okdata balance
```

`okdata call` prints a summary on stderr and the items on stdout, one JSON object per line, so
`okdata call … | jq .text` works. All commands: [cli/README.md](cli/README.md).

cURL (the path is the endpoint id with dots as slashes, under `/v1`):

```bash
curl -G https://api.okdata.online/v1/douyin/videos/search \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode "query=露营装备" -d sort=latest
```

## Connect an AI agent

Tell the agent: *"Read https://okdata.online/agents.md and set up okdata. My key is in OKDATA_API_KEY."*

Or let the command line write the MCP entry for you (it keeps a backup of the file it changes):

```bash
npx okdata setup --client claude-code     # also: cursor, codex, or several: --client claude-code,cursor
```

Or add it by hand. Claude Code (the single quotes keep the variable's name, not the key, in the config):

```bash
claude mcp add --transport http --scope user okdata https://api.okdata.online/mcp \
  --header 'Authorization: Bearer ${OKDATA_API_KEY}'
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

The server has five tools. `find` (the endpoint for a need, in plain English or Chinese), `describe` (parameters,
fields, price) and `account` (balance, receipts, usage; service status without a key) are free; `call` runs an
endpoint at its price; `read_more` returns the rest of a long answer for free. More clients:
[docs/agents.md](docs/agents.md).

## How calls behave

- **One shape.** Success is `{"code":"ok","data":{"items":[...]},"page":{...},"meta":{...}}` (or `data.item` for a
  single object). A Post has the same fields on Douyin and on YouTube; a field a platform lacks is `null` and
  `meta.unavailable` says why.
- **Billing.** `meta.billing.amount` is what the call cost, in USD. Most endpoints charge per call; some charge per
  item returned, up to a fixed amount per call. One call is one page; the next page (`page.next_cursor` sent back
  as `cursor`) is a new call. Errors are not charged.
- **Price cap.** `X-Max-Price` (`maxPrice` in TypeScript, `max_price` in Python and MCP) refuses a call that could
  cost more, before it runs and without charge.
- **Safe retries.** Send an `Idempotency-Key`. The same key and request within 24 hours replays the stored result
  for free, so a retry after a timeout cannot bill twice. The SDKs and the command line do this for you.
- **Smaller answers.** `view=compact|standard|full` and `fields=id,text,metrics.likes` cut what comes back, which
  saves tokens when an agent reads the result.
- **Errors** carry `code`, `charged`, `retry` and `retry_after_seconds`; see [docs/errors.md](docs/errors.md).
- **Coming soon.** A few endpoints are listed before they can be called; they answer `capability_paused` and charge
  nothing. The tables below and in [docs/](docs/README.md) mark them.

## Platforms

Each platform page lists its endpoints with parameters, fields and prices; [docs/README.md](docs/README.md) has
every endpoint on one page and [docs/prices.json](docs/prices.json) every price as data.

<!-- okdata:platforms:en:start -->
| Platform | Endpoints | Price per call or item | What you get |
|---|---|---|---|
| [Douyin](docs/apis/douyin.md) | 38 | $0.002–$0.04 | China’s TikTok: videos, accounts, comments and the hot search board. |
| [Xiaohongshu (RedNote)](docs/apis/xiaohongshu.md) | 30 | $0.02–$0.04 | Lifestyle notes, creators and what people search for. |
| [WeChat Official Accounts](docs/apis/wechat_mp.md) | 8 (1 coming soon) | $0.02–$0.15 | Official Account articles and history, without a QR login. |
| [Bilibili](docs/apis/bilibili.md) | 9 | $0.002–$0.0025 | Videos, comments and the popular board. |
| [Weibo](docs/apis/weibo.md) | 11 | $0.002–$0.0025 | Posts, accounts and the hot search list. |
| [TikTok](docs/apis/tiktok.md) | 15 | $0.002–$0.004 | Videos, accounts and comments worldwide. |
| [X (Twitter)](docs/apis/x.md) | 20 | $0.0001–$0.009 | Posts, accounts, search and trends. |
| [YouTube](docs/apis/youtube.md) | 7 | $0.002–$0.004 | Videos, comments and transcripts. |
| [Meta Ad Library](docs/apis/meta.md) | 3 | $0.004 | Ads running on Facebook and Instagram, by keyword or advertiser. |
| [Google Ads Transparency](docs/apis/google.md) | 2 | $0.004 | Advertisers and their ads on Search, YouTube and Display. |
| [Instagram](docs/apis/instagram.md) | 8 | $0.002–$0.004 | Profiles, posts and reels, comments, hashtags and what a reel says. |
| [Reddit](docs/apis/reddit.md) | 11 | $0.002–$0.004 | Posts, comments, communities, people and what is trending. |
| [Kuaishou](docs/apis/kuaishou.md) | 8 | $0.002–$0.02 | Videos, accounts, comments and the hot list. |
| [Zhihu](docs/apis/zhihu.md) | 2 | $0.002 | Questions and answers, articles, columns, people and the hot list. |
| [WeChat Channels](docs/apis/wechat_channels.md) | 15 (1 coming soon) | $0.015–$0.15 | Channels videos, accounts, comments and live replays, without a QR login. |
| [WeChat Search](docs/apis/wechat.md) | 6 (4 coming soon) | $0.02–$0.15 | WeChat Search across Official Account articles, Channels videos and mini programs. |
| [Telegram](docs/apis/telegram.md) | 3 | $0.002 | Public channels and their messages. |
<!-- okdata:platforms:en:end -->

## What is in this repository

```
typescript/    @okdata/sdk on npm: TypeScript SDK (fetch, no runtime dependencies)
python/        okdata on PyPI: Python SDK (httpx), sync and async
cli/           okdata on npm: the command line (find, show, call, login, setup, ...)
docs/          endpoint, platform and object pages (en, zh), agents.md, llms.txt, openapi.json,
               prices.json, mcp-tools.json, catalog.json, errors.json
server.json    the entry for the official MCP Registry (online.okdata/mcp)
scripts/       sync.mjs: refreshes all of the above from the okdata monorepo (maintainers)
```

The catalog, the API and the release process live in a private monorepo; the packages are published from there
and exported here with their generated code (`typescript/src/generated/`, `python/src/okdata/_generated/`)
committed and the few monorepo-only build settings rewritten, so every directory builds and tests on its own.
`docs/` and the platform tables in this README are generated too. Please do not edit generated files by hand;
issues and pull requests on everything else are welcome.

Build and test locally (no key, no network; the tests use local mock servers), more in
[CONTRIBUTING.md](CONTRIBUTING.md):

```bash
npm ci && npm run typecheck && npm test && npm run build        # typescript/ and cli/
cd python && pip install -e '.[dev]' && pytest && mypy
```

Questions and bugs: open an issue. MIT licence. okdata is not affiliated with any of the platforms it reads.

---

<a id="中文"></a>

## 中文

[okdata](https://okdata.online/zh/) 是给 AI 智能体和代码用的社媒数据接口：抖音、小红书、微信（公众号、视频号、搜一搜）、
快手、B站、微博、知乎、TikTok、X、YouTube、Instagram、Reddit、Telegram，以及 Meta 和 Google 的广告库，
能查公开的内容、账号、评论、热榜、字幕、达人和广告。17 个平台、196 个接口，一个 key，同一种返回结构。
按次或按返回条数付费，最低 $0.0001，调用失败不扣钱。你这边不需要平台账号、Cookie，也不用扫码。

这个仓库放的是两个 SDK 和命令行工具的源码，以及给智能体读的文档（每个接口一页中英文 Markdown、`llms.txt`、
OpenAPI 3.1、价目表）。这些都由 API 自己用的同一份接口目录生成，不会和线上对不上。

| | 安装或接入 | 源码 |
|---|---|---|
| TypeScript SDK | `npm install @okdata/sdk` | [`typescript/`](typescript/) |
| Python SDK | `pip install okdata` | [`python/`](python/) |
| 命令行 | `npx okdata`（或 `npm install -g okdata`） | [`cli/`](cli/) |
| 远程 MCP | `https://api.okdata.online/mcp`（Streamable HTTP） | 托管 |
| Agent Skills | `npx skills add okdataapi/skills` | [okdataapi/skills](https://github.com/okdataapi/skills) |

在 [okdata.online](https://okdata.online/zh/signup/?src=gh-okdata) 注册拿 key，或者用命令行 `npx okdata login`
直接生成一个。key 以 `okd_` 开头，放进环境变量 `OKDATA_API_KEY`，不要写进代码。

### 几行代码

```python
from okdata import OkData

ok = OkData()  # 从 OKDATA_API_KEY 读取 key
page = ok.douyin.trends.list()
for row in page.items:
    print(row["rank"], row["name"], row["heat"])
print("花费: $" + page.cost)
```

```ts
import { OkData } from '@okdata/sdk';

const ok = new OkData(); // 从 OKDATA_API_KEY 读取 key
const page = await ok.weibo.trends.list({});
for (const row of page.items) console.log(row.rank, row.name, row.heat);
```

每个接口都是一个带类型的方法，名字就是接口 ID（`douyin.trends.list` 就是 `ok.douyin.trends.list`），注释里写着价格。
两个 SDK 都能在花费上限内自动翻页（`ok.pages(...)`、`ok.items(...)`），自动带 `Idempotency-Key`，重试不会重复扣费。

命令行：

```bash
npx okdata find 小红书 评论                    # 免费、不需要 key：该用哪个接口、多少钱
npx okdata login                              # 打开打印出来的链接确认，key 保存在本机
npx okdata call douyin.videos.search 'query=露营装备' 'sort=latest' --max-price 0.05
```

### 接到智能体里

对智能体说：“读一下 https://okdata.online/zh/agents.md ，把 okdata 配好，key 在 OKDATA_API_KEY 里。”
或者用命令行写好 MCP 配置：`npx okdata setup --client claude-code`（也支持 `cursor`、`codex`）。
也可以自己加（Claude Code，单引号让配置里只存变量名、不存 key）：

```bash
claude mcp add --transport http --scope user okdata https://api.okdata.online/mcp \
  --header 'Authorization: Bearer ${OKDATA_API_KEY}'
```

MCP 有五个工具：`find`（用中文或英文找接口）、`describe`（看参数、字段和价格）、`account`（余额、扣费明细、用量；
不带 key 时看服务状态）免费；`call` 按接口价格扣费；`read_more` 免费读取被截断的长结果。

### 几个约定

- **扣费**：`meta.billing.amount` 就是这次花的钱（美元）。大多数接口按次计费，少数按返回条数计费、每次有封顶。
  一次调用一页，翻页是新的一次调用。报错不扣费。
- **价格上限**：`X-Max-Price`（TypeScript 里是 `maxPrice`，Python 和 MCP 里是 `max_price`）：可能超价的调用直接拒绝，不扣费。
- **重试不重复扣费**：带上 `Idempotency-Key`，24 小时内同一个 key、同一个请求直接返回上次的结果，不再扣费。SDK 和命令行都会自动带。
- **省 token**：`view=compact` 去掉空字段，`fields=id,text,metrics.likes` 只要需要的字段。
- **错误**：返回 `code`、`charged`（是否扣费）、`retry`（要不要重试），见 [docs/zh/errors.md](docs/zh/errors.md)。
- **即将上线**：少数接口已经列出但暂时不能调用，调用会返回 `capability_paused`，不扣费。下表和 [docs/](docs/README.md) 里有标注。

### 平台

每个平台一页，写清各接口的参数、返回字段和价格；全部接口在 [docs/README.md](docs/README.md)，价格数据在
[docs/prices.json](docs/prices.json)。

<!-- okdata:platforms:zh:start -->
| 平台 | 接口数 | 单价 | 能查什么 |
|---|---|---|---|
| [抖音](docs/zh/apis/douyin.md) | 38 | $0.002–$0.04 | 视频、账号、评论和热搜榜。 |
| [小红书](docs/zh/apis/xiaohongshu.md) | 30 | $0.02–$0.04 | 笔记、博主和大家在搜什么。 |
| [微信公众号](docs/zh/apis/wechat_mp.md) | 8 (1 个即将上线) | $0.02–$0.15 | 公众号文章和历史文章，不用扫码。 |
| [B站](docs/zh/apis/bilibili.md) | 9 | $0.002–$0.0025 | 视频、评论和热门榜。 |
| [微博](docs/zh/apis/weibo.md) | 11 | $0.002–$0.0025 | 微博、账号和热搜。 |
| [TikTok](docs/zh/apis/tiktok.md) | 15 | $0.002–$0.004 | 全球的视频、账号和评论。 |
| [X（推特）](docs/zh/apis/x.md) | 20 | $0.0001–$0.009 | 帖子、账号、搜索和趋势。 |
| [YouTube](docs/zh/apis/youtube.md) | 7 | $0.002–$0.004 | 视频、评论和字幕。 |
| [Meta 广告库](docs/zh/apis/meta.md) | 3 | $0.004 | Facebook 和 Instagram 上在投的广告，按关键词或广告主查。 |
| [Google 广告透明中心](docs/zh/apis/google.md) | 2 | $0.004 | 广告主和他们在搜索、YouTube、展示广告上的广告。 |
| [Instagram](docs/zh/apis/instagram.md) | 8 | $0.002–$0.004 | 账号、帖子和 Reels、评论、话题，以及 Reel 里说了什么。 |
| [Reddit](docs/zh/apis/reddit.md) | 11 | $0.002–$0.004 | 帖子、评论、社区、用户和正在热的内容。 |
| [快手](docs/zh/apis/kuaishou.md) | 8 | $0.002–$0.02 | 视频、账号、评论和热榜。 |
| [知乎](docs/zh/apis/zhihu.md) | 2 | $0.002 | 问题和回答、文章、专栏、用户和热榜。 |
| [微信视频号](docs/zh/apis/wechat_channels.md) | 15 (1 个即将上线) | $0.015–$0.15 | 视频号的视频、账号、评论和直播回放，不用扫码。 |
| [微信搜一搜](docs/zh/apis/wechat.md) | 6 (4 个即将上线) | $0.02–$0.15 | 微信搜一搜：公众号文章、视频号视频和小程序。 |
| [Telegram](docs/zh/apis/telegram.md) | 3 | $0.002 | 公开频道和频道消息。 |
<!-- okdata:platforms:zh:end -->

`typescript/`、`python/`、`cli/` 和 `docs/` 都从私有的 okdata 主仓库导出，npm 和 PyPI 的包也从那里发布；
生成的代码一并提交在这里，所以每个目录都能单独构建和测试。生成的文件请不要手改，其余部分欢迎提 issue 和 PR。

有问题或建议请提 issue。MIT 许可证。okdata 与上述各平台没有关联。

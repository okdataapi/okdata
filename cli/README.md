# okdata command line

**抖音数据 API · 小红书数据接口 · 公众号文章阅读数接口 · 星图 / 蒲公英达人数据 · 社媒数据 MCP。**
[中文说明](#中文) · [中文文档](https://okdata.online/zh/docs/cli/?src=npm-okdata)

Social data for AI agents, paid per call: TikTok, RedNote (Xiaohongshu), Douyin, WeChat (Official Accounts
and Channels), X, YouTube, Instagram, Reddit, Bilibili, Weibo, Kuaishou and more. 200+ endpoints on 17
platforms behind one key. This command finds and calls them from a terminal or an agent's shell, logs in
with a browser link, checks your balance, and sets up the okdata MCP server in Claude Code, Cursor or Codex.
A call that fails costs nothing, and you need no platform accounts, cookies or QR logins.

```sh
npx okdata login                     # or: npm install -g okdata
npx okdata call douyin.videos.search 'query=露营装备' 'sort=latest'
```

That second line is what the console Playground's 命令行 tab prints for a request: the endpoint id,
then each parameter as `name=value` (quote values with spaces or Chinese). Lists are comma-separated
(`ids=1,2,3`) or JSON (`ids=["1","2"]`); numbers and true/false are typed from the catalog.

No account yet? Sign up at [okdata.online](https://okdata.online/signup/?src=npm-okdata)
(中文：[注册](https://okdata.online/zh/signup/?src=npm-okdata)); `okdata login` then links this terminal to it.

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

Every endpoint with its parameters, fields and price: [okdata.online/apis](https://okdata.online/apis/?src=npm-okdata)
(中文：[接口列表](https://okdata.online/zh/apis/?src=npm-okdata)), or `npx okdata find <words>` (free, no key).

## Use it from Claude, Cursor or Codex (MCP)

`npx okdata setup --client claude-code` (or `cursor`, `codex`; several: `--client claude-code,cursor`) writes
the okdata MCP server into the client's config; "MCP setup" below has the details. The server is remote, at
`https://api.okdata.online/mcp` (Streamable HTTP, header `Authorization: Bearer <key>`). Claude Desktop and
other clients that only start local servers run [`npx -y @okdata/mcp`](https://www.npmjs.com/package/@okdata/mcp)
instead. The agent looks up an endpoint and its price for free; only the data call is charged. More clients:
[okdata.online/mcp](https://okdata.online/mcp/?src=npm-okdata).

<a id="中文"></a>

## 中文

okdata 是给 AI 智能体和代码用的社媒数据接口，按次付费。一个 key 就能读抖音、小红书、公众号、视频号、B站、微博、快手，
以及 TikTok、X、YouTube、Instagram、Reddit 的公开数据：搜视频和笔记、批量拉评论、查星图和蒲公英达人、
拿公众号文章的阅读数和点赞数、看微博热搜和抖音热榜。这个命令行可以在终端或智能体的 shell 里查接口、发起调用、看余额，
`npx okdata login` 用浏览器链接登录，`npx okdata setup` 一条命令把 MCP 配进 Claude Code、Cursor、Codex
（Claude Desktop 用 `npx -y @okdata/mcp`）。调用失败不扣钱，不需要平台账号、Cookie，也不用扫码。
支付宝、微信、银行卡都能充值。

[中文文档](https://okdata.online/zh/docs/cli/?src=npm-okdata) · [接口和价格](https://okdata.online/zh/apis/?src=npm-okdata) ·
[MCP 接入](https://okdata.online/zh/mcp/?src=npm-okdata) · [注册](https://okdata.online/zh/signup/?src=npm-okdata)

## Commands

| Command | Cost | What it does |
| --- | --- | --- |
| `okdata find <words…>` | free, no key | Endpoints for plain words, English or 中文. A platform named in the words (or `--platform`) limits the search to it; `--category`, `--limit`. |
| `okdata show <id>` | free, no key | Parameters, price, paging, an example call and the docs link. `--lang zh` for Chinese. |
| `okdata call <id> name=value…` | charged | One call. `--view compact\|standard\|full`, `--fields id,text`, `--max-price 0.05` (refused, not charged, if it could cost more), `--idempotency-key K`, `--out items.jsonl`, `--source S`, `--end-user U`. |
| `okdata call … --pages N --max-spend X` | charged | Follow `next_cursor` for up to N pages, stopping before the total could pass X dollars. |
| `okdata more <request_id>` | free | A call's kept result again (24 h), in any `--view` / `--fields`; `--receipt` shows the call record (status, charge). |
| `okdata balance` | free | Balance, this key's limits and the account's rate tier. |
| `okdata run <plan.json>` | charged with `--yes` | A list of calls: `--plan` (the default) prints the most it can cost; `--yes` runs it within `--max-spend`, `--out` writes the items. |
| `okdata login` | free | Links this terminal to your account: open the printed link, check the 8-character code, approve. A new key named "Command line" is saved; it is never printed. `--no-browser`. |
| `okdata setup --client claude-code\|cursor\|codex` | free | Writes the okdata MCP entry into the client's config (several: `--client claude-code,cursor`). |

Every command takes `--json` (one JSON document on stdout, errors included), `--base-url URL` and
`--help`. Without `--json`, a summary goes to stderr and the items to stdout, one JSON object per line,
so `okdata call … | jq .text` works.

A plan for `run`:

```json
{ "steps": [
  { "capability": "douyin.videos.search", "params": { "query": "露营装备" }, "pages": 2 },
  { "capability": "x.posts.get", "params": { "id": "1850000000000000000" } }
] }
```

## Exit codes

| Code | Meaning |
| --- | --- |
| 0 | Done. |
| 1 | Usage: a bad command, flag or parameter; nothing was sent. |
| 2 | Refused, not charged. The error says why and whether to retry (`retry`: no, yes, once, after_fix, same_key). |
| 3 | Charged but failed, or partial: a charged `not_found`, a charge not known yet (look it up with `okdata more <request_id> --receipt`), a partial result (a batch with missing ids), or pages/steps that were charged and then stopped by an error, `--max-spend` or the balance. |
| 4 | Auth: no key, or the key is invalid, disabled, out of scope, or the account is suspended. Run `okdata login`. |
| 5 | Network: no answer from the API (nothing known to be charged). |

## Keys and files

- The key comes from `OKDATA_API_KEY`, else from the one `okdata login` saved. It is never printed.
- `okdata login` saves `config.json` (mode 0600) in the OS config directory: `~/Library/Application Support/okdata`
  on macOS, `$XDG_CONFIG_HOME/okdata` or `~/.config/okdata` on Linux, `%APPDATA%\okdata` on Windows
  (`OKDATA_CONFIG_DIR` overrides). The catalog used by `find` and `show` is cached there for an hour.
- The API is `https://api.okdata.online`; `--base-url` or `OKDATA_BASE_URL` changes it.

## MCP setup

`okdata setup --client claude-code` merges this into `~/.claude.json` (the rest of the file is kept and
a backup is written next to it):

```json
{ "mcpServers": { "okdata": { "type": "http", "url": "https://api.okdata.online/mcp", "headers": { "Authorization": "Bearer ${OKDATA_API_KEY}" } } } }
```

It also prints the same thing as Claude Code's own command, which you can run instead (setup never runs it):

```sh
claude mcp add --transport http --scope user okdata https://api.okdata.online/mcp --header 'Authorization: Bearer ${OKDATA_API_KEY}'
```

Cursor gets `~/.cursor/mcp.json` with `Bearer ${env:OKDATA_API_KEY}`; Codex gets a
`[mcp_servers.okdata]` table in `~/.codex/config.toml` with `bearer_token_env_var = "OKDATA_API_KEY"`.
The files hold only the variable's name, so set `OKDATA_API_KEY` where the client starts, or add
`--write-key` to store the key `okdata login` saved (the files are then written 0600). `--print` only
shows the entries; `--home DIR` writes under another home directory. Restart the client afterwards.

MIT licensed.

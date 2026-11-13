# okdata MCP server for Claude Desktop, Cursor and other local clients

**社媒数据 MCP · 抖音 MCP · 小红书 MCP · 公众号 MCP · 抖音数据 API · 小红书数据接口 · 星图 / 蒲公英达人数据。**
[中文说明](#中文) · [中文文档](https://okdata.online/zh/mcp/?src=pypi-okdata-mcp)

<!-- mcp-name: online.okdata/mcp -->

Social data for AI agents, paid per call: TikTok, RedNote (Xiaohongshu), Douyin, WeChat (Official Accounts
and Channels), X, YouTube, Instagram, Reddit, Bilibili, Weibo, Kuaishou and more. 200+ endpoints on 17
platforms behind one key. This package is the okdata MCP server as a local stdio command, for clients that
only start local servers (Claude Desktop, some IDEs and agent frameworks): it passes every request to the
hosted server at `https://api.okdata.online/mcp` with your key. The agent looks up an endpoint and its price
for free; only the data call is charged, and a call that fails costs nothing. You need no platform
accounts, cookies or QR logins.

```sh
uvx okdata-mcp          # Python 3.10+; your MCP client runs this, not you
pip install okdata-mcp  # or install it, then the command is okdata-mcp
```

No key yet? Sign up at [okdata.online](https://okdata.online/signup/?src=pypi-okdata-mcp)
(中文：[注册](https://okdata.online/zh/signup/?src=pypi-okdata-mcp)). Keys start with `okd_`.

## Claude Desktop

Open **Settings… > Developer > Edit Config** and add the server to `claude_desktop_config.json` (on a Mac in
`~/Library/Application Support/Claude/`, on Windows in `%APPDATA%\Claude\`):

```json
{
  "mcpServers": {
    "okdata": {
      "command": "uvx",
      "args": ["okdata-mcp"],
      "env": { "OKDATA_API_KEY": "okd_..." }
    }
  }
}
```

Quit Claude Desktop completely and open it again. Apps opened from the Dock or Start menu do not see the
variables of your terminal, so the key goes into the file itself: keep that file private. If the log says
`uvx` was not found, put its full path (`which uvx`) as the `command`.

## Cursor

`~/.cursor/mcp.json` (or `.cursor/mcp.json` in a project you do not share):

```json
{
  "mcpServers": {
    "okdata": {
      "command": "uvx",
      "args": ["okdata-mcp"],
      "env": { "OKDATA_API_KEY": "okd_..." }
    }
  }
}
```

## Claude Code

```sh
claude mcp add --transport stdio --scope user --env OKDATA_API_KEY=okd_... okdata -- uvx okdata-mcp
```

Claude Code, Cursor and Codex can also connect to the hosted server directly, with no local process:
`npx okdata setup --client claude-code` (or `cursor`, `codex`) writes that entry. More clients:
[okdata.online/mcp](https://okdata.online/mcp/?src=pypi-okdata-mcp).

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

Every endpoint with its parameters, fields and price: [okdata.online/apis](https://okdata.online/apis/?src=pypi-okdata-mcp)
(中文：[接口列表](https://okdata.online/zh/apis/?src=pypi-okdata-mcp)).

## The tools

| Tool | Cost | What it does |
|---|---|---|
| `find` | free, no key | The endpoint for a need in plain words, English or 中文, with its price and a ready call. |
| `describe` | free, no key | Parameters, fields, price and an example of up to 5 endpoints. |
| `call` | charged | One page of data from one endpoint, at the price `describe` showed. Failed calls are free. |
| `read_more` | free | The rest of an answer cut at about 20 KB, or the same result in another view, for 24 hours. |
| `account` | free | The balance, a call's receipt, usage by day or endpoint; `status` (no key) says which endpoints are up. |

Without a key, `find`, `describe` and `account` status still work, so an agent can check the connection and
say what a task will cost before you add one; `call` then answers how to add the key. A `call` without an
`idempotency_key` gets one from this package, so if its answer is lost on the way, the agent can send the
same call with that `idempotency_key` again and is not charged twice.

## Settings

All through environment variables, in the `env` of the client's entry:

- `OKDATA_API_KEY`: your key. It is sent as `Authorization: Bearer ...` to the server and never printed.
- `OKDATA_MCP_URL`: another MCP server address. `OKDATA_BASE_URL` (the API base, as the SDKs take it) works
  too; `/mcp` is added.

`okdata-mcp --version` and `--help` print and exit; anything else on stdout is MCP. `python -m okdata_mcp`
is the same command. The npm package [`@okdata/mcp`](https://www.npmjs.com/package/@okdata/mcp)
(`npx -y @okdata/mcp`) does the same; to write code against okdata instead, use the SDK:
`pip install okdata`.

<a id="中文"></a>

## 中文

okdata 是给 AI 智能体用的社媒数据接口，按次付费。一个 key 就能读抖音、小红书、公众号、视频号、B站、微博、快手，
以及 TikTok、X、YouTube、Instagram、Reddit 的公开数据：搜视频和笔记、批量拉评论、查星图和蒲公英达人、
拿公众号文章的阅读数和点赞数、看微博热搜和抖音热榜。这个包是 okdata MCP 服务的本地 stdio 版本，给只能启动本地
服务的客户端用（Claude Desktop、部分 IDE 和智能体框架），不用再折腾 mcp-remote：它把每个请求原样转发到
`https://api.okdata.online/mcp`。在 `claude_desktop_config.json` 里加上：

```json
{
  "mcpServers": {
    "okdata": {
      "command": "uvx",
      "args": ["okdata-mcp"],
      "env": { "OKDATA_API_KEY": "okd_..." }
    }
  }
}
```

然后彻底退出 Claude Desktop 再打开。需要先装好 [uv](https://docs.astral.sh/uv/)（Python 3.10 或更新）。
查接口、看价格免费，不带 key 也能用；只有 `call` 按接口单价收费，失败不扣钱。不需要平台账号、Cookie，也不用扫码。
支付宝、微信、银行卡都能充值。用 Node.js 的话：`npx -y @okdata/mcp`。

[MCP 接入说明](https://okdata.online/zh/mcp/?src=pypi-okdata-mcp) · [接口和价格](https://okdata.online/zh/apis/?src=pypi-okdata-mcp) ·
[注册](https://okdata.online/zh/signup/?src=pypi-okdata-mcp)

MIT licensed.

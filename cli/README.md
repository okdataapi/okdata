# okdata command line

Find and call okdata endpoints from a terminal or an agent's shell: Douyin, Xiaohongshu, WeChat,
Bilibili, Weibo, TikTok, X, YouTube and more, paid per call. Log in with a browser link, check your
balance, and set up the okdata MCP server in Claude Code, Cursor or Codex.

```sh
npx okdata login                     # or: npm install -g okdata
npx okdata call douyin.videos.search 'query=露营装备' 'sort=latest'
```

That second line is what the console Playground's 命令行 tab prints for a request: the endpoint id,
then each parameter as `name=value` (quote values with spaces or Chinese). Lists are comma-separated
(`ids=1,2,3`) or JSON (`ids=["1","2"]`); numbers and true/false are typed from the catalog.

No account yet? Sign up at [okdata.online](https://okdata.online/signup/?src=npm-okdata)
(中文：[注册](https://okdata.online/zh/signup/?src=npm-okdata)); `okdata login` then links this terminal to it.

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

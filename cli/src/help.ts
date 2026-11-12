// `okdata --help`: commands, flags and exit codes in one screen.
import { VERSION } from './version.js';

export const HELP = `okdata ${VERSION}: social data for AI agents, paid per call (https://okdata.online)

Usage: okdata <command> [arguments] [--json]

Look things up (free, no key):
  find <words…>        Endpoints for plain words, English or 中文 (--platform, --category, --limit)
  show <id>            What an endpoint takes, costs and returns

Your account (free):
  balance              Balance, this key's limits, rate tier
  more <request_id>    A call's kept result again, free for 24 h (--view, --fields, --out; --receipt: the call record)

Call (charged; failed calls are free):
  call <id> name=value…
                       --view compact|standard|full  --fields id,text  --max-price 0.05
                       --pages N --max-spend 0.10 (follow next_cursor within a budget)
                       --idempotency-key K  --out items.jsonl  --source S  --end-user U
  run <plan.json>      A list of calls: --plan shows the most it can cost, --yes runs it
                       (--max-spend, --out). Plan: {"steps":[{"capability":"…","params":{…},"pages":2}]}

Set up:
  login                Link this terminal to your account (a browser link + code); saves a key, never prints it
  setup --client claude-code|cursor|codex
                       Write the okdata MCP entry into the client's config (--print to only show it,
                       --write-key to store the saved key instead of the OKDATA_API_KEY reference)

Every command: --json (one JSON document on stdout), --base-url URL, --help.
Key: OKDATA_API_KEY, else the one okdata login saved. API: --base-url, OKDATA_BASE_URL, else https://api.okdata.online.
Output: a summary on stderr, one JSON item per line on stdout (pipe it to jq).

Exit codes:
  0  done
  1  usage: a bad command, flag or parameter (nothing sent)
  2  refused, not charged (the error says why and whether to retry)
  3  charged but failed, or partial: a charged not_found, a charge not yet known, a partial result,
     or pages/steps charged and then stopped (by an error, --max-spend or the balance)
  4  auth: no key, or the key is invalid, disabled, out of scope, or the account is suspended
  5  network: no answer from the API (nothing known to be charged)
`;

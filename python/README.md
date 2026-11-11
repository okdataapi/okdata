# okdata for Python

Public data from Douyin, Xiaohongshu (RedNote), WeChat Official Accounts, Bilibili, Weibo, TikTok, X and YouTube,
for AI agents and scripts. One client, one result shape, pay per call; failed calls are free.

```bash
pip install okdata
```

Python 3.10+, one dependency (`httpx`). Get a key at [okdata.online](https://okdata.online/signup/?src=pypi-okdata)
and put it in `OKDATA_API_KEY`.

## Use it

```python
from okdata import OkData

ok = OkData()  # reads OKDATA_API_KEY; OkData("okd_...") also works

# Lists come back as a Page: items, next_cursor, has_more, cost
page = ok.xiaohongshu.notes.search(query="露营 装备", sort="popular")
for note in page.items:
    print(note["metrics"]["likes"], note["title"], note["url"])
print(page.cost)          # Decimal('0.02'): what this call was charged
print(page.next_cursor)   # pass back as cursor= for the next page (a new call)

# Single objects come back as an Item
video = ok.youtube.videos.get(url="https://www.youtube.com/watch?v=dQw4w9WgXcQ").item
transcript = ok.youtube.videos.transcript.get(id="dQw4w9WgXcQ", lang="en").item
print(transcript["text"][:200])
```

Every endpoint is a method named after its id: `douyin.videos.comments.list` is
`ok.douyin.videos.comments.list(id=...)`. Parameters are keyword-only and typed, enums are `Literal`s, and each
method's docstring has the price. Endpoints that take `id` or `url` want exactly one of them.

Any endpoint, including ones newer than your SDK version, also works by id:

```python
result = ok.call("weibo.trends.list")
```

## Spend on purpose

```python
from okdata import max_cost

print(max_cost("douyin.videos.search", pages=5))   # Decimal('0.10'): say this before a big job

for page in ok.iter_pages("tiktok.videos.comments.list", {"id": "7305085486984858894"}, max_pages=5):
    ...  # each page is its own call and its own charge; stops early when there are no more
```

`view="compact"` drops null fields and `fields=["id", "text", "metrics.likes"]` keeps only what you list, which
keeps results small when an agent reads them.

## Errors and retries

Errors raise `OkDataError` with `code`, `status`, `charged`, `retry`, `retry_after_seconds` and `request_id`:

```python
from okdata import OkDataError

try:
    ok.douyin.videos.get(id="0")
except OkDataError as err:
    print(err.code, err.charged, err.retry)   # not_found False no
```

The client retries `rate_limited`, `upstream_busy`, `upstream_failed`, `internal_error`, `timeout` and network
failures (2 retries by default, exponential backoff, and exactly the wait the server asks for on a 429). Every paid
call carries an `Idempotency-Key`, made for you unless you pass `idempotency_key=`, and retries reuse it, so a retry
is never charged twice: a call that went through before a timeout comes back as a free replay (`result.replayed`).
If the first attempt is still running, the client waits for it; if it gives up first, the error has `charged=None`.

`OkDataConnectionError` means no answer came back; `charged` is `None` because it is not known. Look the call up
with `ok.get_call(request_id)` or send it again with the same `idempotency_key`.

## Options

| Argument | Default | |
|---|---|---|
| `api_key` | `$OKDATA_API_KEY` | keys start with `okd_`; never put one in code you commit |
| `base_url` | `$OKDATA_BASE_URL` or `https://api.okdata.online` | |
| `timeout` | `60.0` | seconds per attempt; some WeChat endpoints are slow |
| `max_retries` | `2` | `0` turns retries off |
| `max_retry_delay` | `8.0` | a server wait longer than this raises instead of sleeping |
| `http_client` | a new `httpx.Client` | pass your own for proxies or custom transports |

Also: `ok.account()` (balance), `ok.status()` and `ok.catalog()` (free, no key), `okdata.ENDPOINTS` (every
endpoint's path, price and page size).

## Links

- Every endpoint, with parameters, fields and prices: <https://okdata.online/apis/>
- Errors: <https://github.com/okdataapi/okdata/blob/main/docs/errors.md>
- MCP server for agents: `https://api.okdata.online/mcp`
- Source and issues: <https://github.com/okdataapi/okdata>

MIT licence. okdata is not affiliated with the platforms it reads.

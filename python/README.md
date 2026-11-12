# okdata for Python

Social data for AI agents, paid per call: Douyin, Xiaohongshu, WeChat, Bilibili, Weibo, Kuaishou, Zhihu,
TikTok, X, YouTube, Instagram, Reddit and more, as one API with one envelope and one error format.
Every endpoint is a typed method generated from the okdata catalog, with its price in its docstring.

```sh
pip install okdata          # Python 3.9+, one dependency (httpx)
export OKDATA_API_KEY=okd_...   # https://okdata.online/console/
```

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

## Development

This directory is exported from the okdata monorepo. `src/okdata/_generated/` (the typed methods,
models and the error table) is generated there from the endpoint catalog and committed here; please do
not edit it by hand.

```sh
python3 -m venv .venv && . .venv/bin/activate
pip install -e '.[dev]'
pytest                      # against a local mock server: no key, no network
mypy                        # --strict; settings in pyproject.toml
OKDATA_LIVE_KEY=okd_... pytest     # adds a live smoke test of the free routes
```

With uv: `uv run --extra dev pytest` and `uv run --extra dev mypy`. Build a wheel with `uv build` (or
`python -m build`). The PyPI name and the import name are both `okdata`.

MIT licensed.

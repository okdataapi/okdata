from __future__ import annotations

import asyncio
from typing import Any, List

import pytest

from okdata import AsyncOkData, OkData, OkDataError

from .conftest import KEY
from .mock_api import MockApi, Reply, Seen, error_reply, item_body, page_body


def listing(last: int, amount: str = "0.02"):  # type: ignore[no-untyped-def]
    """Pages of 2 items; the cursor is the next page number; `last` pages in all."""
    def handler(req: Seen, n: int) -> Reply:
        page = int(req.query.get("cursor", "1"))
        return Reply(body=page_body([{"id": f"{page}a"}, {"id": f"{page}b"}], str(page + 1) if page < last else None, amount=amount))
    return handler


def test_follows_next_cursor_with_the_same_params(ok: OkData, api: MockApi) -> None:
    api.handle(listing(3))
    pager = ok.pages("douyin.videos.search", query="露营", sort="latest")
    assert [len(p.items) for p in pager] == [2, 2, 2]
    assert [s.query.get("cursor") for s in api.seen] == [None, "2", "3"]
    assert all(s.query["query"] == "露营" and s.query["sort"] == "latest" for s in api.seen)
    assert len({s.headers["idempotency-key"] for s in api.seen}) == 3
    assert (pager.stop_reason, pager.spent, pager.calls) == ("end", "0.06", 3)


def test_max_pages(ok: OkData, api: MockApi) -> None:
    api.handle(listing(10))
    pager = ok.pages("douyin.videos.search", {"query": "x"}, max_pages=2)
    assert len(list(pager)) == 2 and pager.stop_reason == "max_pages"


def test_max_spend_stops_before_and_caps_each_call(ok: OkData, api: MockApi) -> None:
    api.handle(listing(10))
    pager = ok.pages("douyin.videos.search", query="x", max_spend="0.05")
    assert len(list(pager)) == 2
    assert (pager.stop_reason, pager.spent) == ("max_spend", "0.04")
    assert [s.headers["x-max-price"] for s in api.seen] == ["0.05", "0.03"]


def test_no_call_when_budget_is_below_one_page(ok: OkData, api: MockApi) -> None:
    pager = ok.pages("douyin.videos.search", query="x", max_spend=0.01)
    assert list(pager) == [] and pager.stop_reason == "max_spend" and api.seen == []


def test_per_item_endpoint_uses_its_most_per_call_and_keeps_a_tighter_cap(ok: OkData, api: MockApi) -> None:
    api.handle(listing(10, amount="0.116"))
    pager = ok.pages("wechat_mp.accounts.search", query="咖啡", max_price="0.3", max_spend="0.8")
    assert len(list(pager)) == 2  # 0.116 + 0.58 <= 0.8 once more; 0.232 + 0.58 > 0.8
    assert (pager.spent, pager.stop_reason) == ("0.232", "max_spend")
    assert [s.headers["x-max-price"] for s in api.seen] == ["0.3", "0.3"]


def test_server_refusing_our_cap_is_the_budget(ok: OkData, api: MockApi) -> None:
    api.handle(lambda req, n: error_reply("max_price_exceeded", required="0.5"))
    pager = ok.pages("newplatform.things.list", max_spend="0.1")
    assert list(pager) == [] and pager.stop_reason == "max_spend"


def test_stops_when_balance_will_not_cover_next(ok: OkData, api: MockApi) -> None:
    api.handle(lambda req, n: Reply(body=page_body([{"id": "1"}], "2", covers_next=False)))
    pager = ok.pages("douyin.videos.search", query="x")
    assert len(list(pager)) == 1 and pager.stop_reason == "balance"


def test_error_on_a_later_page_passes_through(ok: OkData, api: MockApi) -> None:
    first = listing(5)
    api.handle(lambda req, n: error_reply("cursor_expired", param="cursor") if req.query.get("cursor") == "2" else first(req, n))
    pager = ok.pages("douyin.videos.search", query="x")
    with pytest.raises(OkDataError) as info:
        list(pager)
    assert info.value.code == "cursor_expired" and pager.spent == "0.02"


def test_refuses_single_object_endpoints_and_a_second_run(ok: OkData, api: MockApi) -> None:
    with pytest.raises(TypeError, match="one object"):
        ok.pages("x.posts.get", id="1")
    api.handle(listing(1))
    pager = ok.pages("douyin.videos.search", query="x")
    list(pager)
    with pytest.raises(RuntimeError, match="once"):
        list(pager)


def test_items_stop_at_max_items_without_fetching_more(ok: OkData, api: MockApi) -> None:
    api.handle(listing(10))
    items = ok.items("douyin.videos.search", query="x", max_items=3)
    assert [i["id"] for i in items] == ["1a", "1b", "2a"]
    assert (items.stop_reason, items.items, items.spent, len(api.seen)) == ("max_items", 3, "0.04", 2)


def test_async_client_pages_items_and_calls(api: MockApi) -> None:
    slept: List[float] = []

    async def sleep(s: float) -> None:
        slept.append(s)

    async def run() -> Any:
        async with AsyncOkData(KEY, base_url=api.url, sleep=sleep) as ok:
            api.handle(listing(10))
            pages = [p async for p in ok.pages("douyin.videos.search", query="x", max_spend="0.05")]
            items = ok.items("douyin.videos.search", query="x", max_items=3)
            got = [i["id"] async for i in items]
            api.handle(lambda req, n: error_reply("upstream_failed") if n == 0 else Reply(body=item_body({"id": "p"})))
            api.seen.clear()
            one = await ok.x.posts.get(id="1")
            account_seen = len(api.seen)
            return pages, got, items.stop_reason, one, account_seen

    pages, got, reason, one, attempts = asyncio.run(run())
    assert len(pages) == 2
    assert got == ["1a", "1b", "2a"] and reason == "max_items"
    assert one.item == {"id": "p"} and attempts == 2 and len(slept) == 1


def test_async_errors_and_free_routes(api: MockApi) -> None:
    async def run() -> Any:
        async with AsyncOkData(KEY, base_url=api.url, max_retries=0) as ok:
            api.handle(lambda req, n: error_reply("insufficient_balance", required="0.02", available="0.001"))
            try:
                await ok.douyin.videos.search(query="x")
            except OkDataError as err:
                caught = err
            api.handle(lambda req, n: Reply(body={"code": "ok", "request_id": "r", "data": {"balance": "1"}, "warnings": []}))
            return caught, await ok.account()

    err, account = asyncio.run(run())
    assert (err.code, err.required, err.available, err.charged) == ("insufficient_balance", "0.02", "0.001", False)
    assert account == {"balance": "1"}

from __future__ import annotations

import json
from decimal import Decimal
from pathlib import Path
from typing import List

import pytest

import okdata
from okdata import ENDPOINTS, Item, OkData, OkDataConnectionError, OkDataError, Page, max_cost

from mock_api import TEST_KEY, MockApi, Scripted, error_body, ok_envelope

REPO = Path(__file__).resolve().parents[2]


def test_reads_key_from_env_and_sends_headers(api: MockApi, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("OKDATA_API_KEY", TEST_KEY)
    monkeypatch.setenv("OKDATA_BASE_URL", api.url)
    with OkData() as ok:
        page = ok.douyin.trends.list()

    assert isinstance(page, Page)
    req = api.requests[-1]
    assert req.method == "GET" and req.path == "/v1/douyin/trends/list"
    assert req.headers["authorization"] == f"Bearer {TEST_KEY}"
    assert req.headers["user-agent"] == f"okdata-python/{okdata.__version__}"
    assert len(req.headers["idempotency-key"]) == 36


def test_repr_never_shows_the_key() -> None:
    ok = OkData(TEST_KEY)
    assert TEST_KEY not in repr(ok)
    assert "key=set" in repr(ok)
    ok.close()


def test_search_sends_params_view_and_fields(client: OkData, api: MockApi) -> None:
    api.script("/v1/douyin/videos/search", Scripted(body=ok_envelope(
        "douyin.videos.search", items=[{"id": "7", "metrics": {"likes": 5}}], next_cursor="c2", amount="0.02")))

    page = client.douyin.videos.search(query="露营装备 帐篷", sort="latest", view="compact", fields=["id", "metrics.likes"])

    req = api.requests[-1]
    assert req.query == {"query": "露营装备 帐篷", "sort": "latest", "view": "compact", "fields": "id,metrics.likes"}
    assert page.items == [{"id": "7", "metrics": {"likes": 5}}]
    assert page.next_cursor == "c2" and page.has_more is True
    assert page.cost == Decimal("0.02")
    assert list(page) == page.items and len(page) == 1


def test_none_params_are_not_sent(client: OkData, api: MockApi) -> None:
    client.x.trends.list()
    assert api.requests[-1].query == {}


def test_single_object_endpoint_returns_item(client: OkData, api: MockApi) -> None:
    api.script("/v1/x/users/get", Scripted(body=ok_envelope("x.users.get", item={"id": "1", "followers": 10}, amount="0.001")))
    result = client.x.users.get(username="openai")
    assert isinstance(result, Item)
    assert result.item["followers"] == 10
    assert api.requests[-1].query == {"username": "openai"}


def test_id_or_url_needs_exactly_one(client: OkData, api: MockApi) -> None:
    with pytest.raises(ValueError):
        client.tiktok.videos.get()
    with pytest.raises(ValueError):
        client.tiktok.videos.get(id="1", url="https://www.tiktok.com/@a/video/1")
    assert api.requests == []  # rejected before anything was sent
    client.tiktok.videos.get(url="https://www.tiktok.com/@a/video/1")
    assert api.requests[-1].query == {"url": "https://www.tiktok.com/@a/video/1"}


def test_bad_view_and_fields_fail_locally(client: OkData, api: MockApi) -> None:
    with pytest.raises(ValueError):
        client.weibo.trends.list(view="tiny")  # type: ignore[arg-type]
    with pytest.raises(ValueError):
        client.weibo.trends.list(fields="id,,metrics likes")
    with pytest.raises(ValueError):
        client.weibo.trends.list(fields=[])
    assert api.requests == []


def test_api_error_is_raised_with_charge_and_retry_advice(client: OkData, api: MockApi, sleeps: List[float]) -> None:
    api.script("/v1/douyin/videos/get", Scripted(status=404, body=error_body("not_found", "No such video")))
    with pytest.raises(OkDataError) as info:
        client.douyin.videos.get(id="1")
    err = info.value
    assert (err.code, err.status, err.charged, err.retry, err.retryable) == ("not_found", 404, False, "no", False)
    assert "No such video" in str(err)
    assert len(api.requests) == 1 and sleeps == []


def test_missing_key_gets_unauthorized_without_retry(api: MockApi) -> None:
    ok = OkData(base_url=api.url)
    with pytest.raises(OkDataError) as info:
        ok.weibo.trends.list()
    assert info.value.code == "unauthorized"
    assert "authorization" not in api.requests[-1].headers
    assert len(api.requests) == 1
    ok.close()


def test_retries_upstream_errors_with_the_same_idempotency_key(client: OkData, api: MockApi, sleeps: List[float]) -> None:
    api.script(
        "/v1/bilibili/trends/list",
        Scripted(status=503, body=error_body("upstream_busy", retry="yes")),
        Scripted(status=502, body=error_body("upstream_failed", retry="yes")),
    )
    page = client.bilibili.trends.list()
    assert isinstance(page, Page)
    keys = {r.headers["idempotency-key"] for r in api.requests}
    assert len(api.requests) == 3 and len(keys) == 1
    assert len(sleeps) == 2 and all(0 < s <= client.max_retry_delay for s in sleeps)


def test_rate_limited_waits_what_the_server_says(client: OkData, api: MockApi, sleeps: List[float]) -> None:
    api.script("/v1/weibo/trends/list", Scripted(
        status=429, body=error_body("rate_limited", retry="yes", retry_after_seconds=2), headers={"Retry-After": "2"}))
    client.weibo.trends.list()
    assert sleeps == [2.0]


def test_rate_limit_longer_than_the_cap_is_raised_not_waited(client: OkData, api: MockApi, sleeps: List[float]) -> None:
    api.script("/v1/weibo/trends/list", Scripted(status=429, body=error_body("rate_limited", retry="yes", retry_after_seconds=600)))
    with pytest.raises(OkDataError) as info:
        client.weibo.trends.list()
    assert info.value.retry_after_seconds == 600 and sleeps == []


def test_gives_up_after_max_retries(client: OkData, api: MockApi, sleeps: List[float]) -> None:
    busy = Scripted(status=503, body=error_body("upstream_busy", retry="yes"))
    api.script("/v1/douyin/trends/list", busy, busy, busy, busy)
    with pytest.raises(OkDataError) as info:
        client.douyin.trends.list()
    assert info.value.code == "upstream_busy"
    assert len(api.requests) == client.max_retries + 1


def test_timeout_is_retried_with_same_key_and_replay_is_free(client: OkData, api: MockApi) -> None:
    api.script(
        "/v1/youtube/videos/transcript/get",
        Scripted(status=504, body=error_body("timeout", retry="same_key", charged=None)),
        Scripted(body=ok_envelope("youtube.videos.transcript.get", item={"video_id": "v", "text": "hi"}, amount="0", replayed=True)),
    )
    result = client.youtube.videos.transcript.get(id="v", idempotency_key="my-key-1")
    assert result.replayed is True and result.cost == Decimal("0")
    assert [r.headers["idempotency-key"] for r in api.requests] == ["my-key-1", "my-key-1"]


def test_dropped_connection_is_retried(client: OkData, api: MockApi) -> None:
    api.script("/v1/x/trends/list", Scripted(drop=True))
    page = client.x.trends.list(country="US")
    assert isinstance(page, Page)
    assert len(api.requests) == 2
    assert api.requests[0].headers["idempotency-key"] == api.requests[1].headers["idempotency-key"]


def test_unreachable_server_raises_connection_error(sleeps: List[float]) -> None:
    ok = OkData(TEST_KEY, base_url="http://127.0.0.1:9", timeout=1, max_retries=1)
    ok._sleep = sleeps.append
    with pytest.raises(OkDataConnectionError) as info:
        ok.weibo.trends.list()
    assert info.value.charged is None and info.value.retryable
    assert len(sleeps) == 1
    ok.close()


def test_non_json_gateway_error_is_retryable(client: OkData, api: MockApi) -> None:
    api.script("/v1/weibo/trends/list", Scripted(status=502, raw=b"<html>bad gateway</html>"))
    client.weibo.trends.list()
    assert len(api.requests) == 2


def test_iter_pages_follows_cursor_and_stops(client: OkData, api: MockApi) -> None:
    path = "/v1/tiktok/videos/comments/list"
    api.script(
        path,
        Scripted(body=ok_envelope("tiktok.videos.comments.list", items=[{"id": "a"}], next_cursor="p2")),
        Scripted(body=ok_envelope("tiktok.videos.comments.list", items=[{"id": "b"}], next_cursor="p3")),
        Scripted(body=ok_envelope("tiktok.videos.comments.list", items=[{"id": "c"}])),
    )
    pages = list(client.iter_pages("tiktok.videos.comments.list", {"id": "v1"}, max_pages=5))
    assert [p.items[0]["id"] for p in pages] == ["a", "b", "c"]
    assert [r.query.get("cursor") for r in api.requests] == [None, "p2", "p3"]
    assert len({r.headers["idempotency-key"] for r in api.requests}) == 3  # each page is its own call


def test_iter_pages_respects_max_pages(client: OkData, api: MockApi) -> None:
    api.script("/v1/x/posts/search", *[
        Scripted(body=ok_envelope("x.posts.search", items=[{"id": str(i)}], next_cursor=f"c{i}")) for i in range(5)
    ])
    pages = list(client.iter_pages("x.posts.search", {"query": "okdata"}, max_pages=2))
    assert len(pages) == 2 and len(api.requests) == 2
    with pytest.raises(ValueError):
        list(client.iter_pages("x.posts.search", {"query": "okdata"}, max_pages=0))


def test_call_by_id_and_unknown_ids(client: OkData, api: MockApi) -> None:
    result = client.call("weibo.users.get", {"id": "123"})
    assert isinstance(result, Item)
    with pytest.raises(OkDataError) as info:
        client.call("weibo.nothing.here")
    assert info.value.code == "unknown_endpoint"
    assert api.requests[-1].path == "/v1/weibo/nothing/here"
    with pytest.raises(ValueError):
        client.call("../../etc/passwd")


def test_free_routes(client: OkData, api: MockApi) -> None:
    assert client.status()["summary"]["available"] == len(ENDPOINTS)
    assert client.catalog()["revision"] == "0.1.0"
    assert client.account()["balance"] == "0.9"
    assert "idempotency-key" not in api.requests[-1].headers


def test_max_cost() -> None:
    assert max_cost("douyin.videos.search", pages=3) == Decimal("0.06")
    assert max_cost("wechat_mp.accounts.search") == Decimal("0.58")  # per-item endpoint: its cap
    with pytest.raises(ValueError):
        max_cost("nope.nothing")


def test_generated_table_matches_published_catalog() -> None:
    published = json.loads((REPO / "docs" / "catalog.json").read_text(encoding="utf-8"))
    assert okdata.CATALOG_REVISION == published["revision"]
    by_id = {e["id"]: e for e in published["endpoints"]}
    assert set(by_id) == set(ENDPOINTS)
    for endpoint_id, info in ENDPOINTS.items():
        e = by_id[endpoint_id]
        assert (info.path, info.method, info.price, info.max_charge, info.list) == (e["path"], e["method"], e["price"], e["maxCharge"], e["list"])


def test_every_endpoint_has_a_typed_method() -> None:
    ok = OkData(TEST_KEY)
    for endpoint_id in ENDPOINTS:
        *namespace, action = endpoint_id.split(".")
        target = ok
        for part in namespace:
            target = getattr(target, part)
        assert callable(getattr(target, action)), endpoint_id
    ok.close()


def _catalog_endpoints() -> List[dict]:
    return json.loads((REPO / "docs" / "catalog.json").read_text(encoding="utf-8"))["endpoints"]


@pytest.mark.parametrize("endpoint", _catalog_endpoints(), ids=lambda e: e["id"])
def test_every_typed_method_hits_its_path(client: OkData, api: MockApi, endpoint: dict) -> None:
    *namespace, action = endpoint["id"].split(".")
    target = client
    for part in namespace:
        target = getattr(target, part)
    args = {p["name"]: str(p.get("example", "x")) for p in endpoint["params"] if p["required"]}
    if not args and any(p["name"] == "id" for p in endpoint["params"]):
        args = {"id": "1"}  # id-or-url endpoints take one of the two

    result = getattr(target, action)(**args)

    assert isinstance(result, Page if endpoint["list"] else Item)
    assert api.requests[-1].path == endpoint["path"]
    assert api.requests[-1].query == args


def test_waits_for_an_in_flight_call_after_a_lost_answer(client: OkData, api: MockApi, sleeps: List[float]) -> None:
    # The first answer is lost; the server is still running that call, so the same key gets rate_limited.
    in_flight = Scripted(status=429, body=error_body("rate_limited", retry="yes", retry_after_seconds=1))
    api.script("/v1/x/trends/list", Scripted(drop=True), in_flight, in_flight, in_flight,
               Scripted(body=ok_envelope("x.trends.list", items=[], amount="0", replayed=True)))
    page = client.x.trends.list()
    assert page.replayed is True
    assert len(api.requests) == 5
    assert len({r.headers["idempotency-key"] for r in api.requests}) == 1


def test_still_in_flight_reports_the_charge_as_unknown(client: OkData, api: MockApi) -> None:
    in_flight = Scripted(status=429, body=error_body("rate_limited", retry="yes", retry_after_seconds=1))
    api.script("/v1/x/trends/list", Scripted(drop=True), *[in_flight] * 20)
    with pytest.raises(OkDataError) as info:
        client.x.trends.list()
    assert info.value.code == "rate_limited"
    assert info.value.charged is None  # the first attempt may still be billed


def test_plain_rate_limit_is_still_not_charged(client: OkData, api: MockApi) -> None:
    api.script("/v1/x/trends/list", *[Scripted(status=429, body=error_body("rate_limited", retry="yes", retry_after_seconds=1))] * 5)
    with pytest.raises(OkDataError) as info:
        client.x.trends.list()
    assert info.value.charged is False
    assert len(api.requests) == client.max_retries + 1


def test_malformed_keys_are_refused_without_echoing_them() -> None:
    bad = "okd_abc\ndef"
    with pytest.raises(ValueError) as info:
        OkData(bad)
    assert bad not in str(info.value) and "okd_abc" not in str(info.value)


def test_get_call_checks_the_request_id(client: OkData) -> None:
    with pytest.raises(ValueError):
        client.get_call("abc?x=1")

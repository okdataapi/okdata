from __future__ import annotations

import re
from typing import List

import pytest

from okdata import Batch, Item, OkData, OkDataConnectionError, OkDataError, Page

from .conftest import KEY
from .mock_api import MockApi, Reply, api_error, batch_body, error_reply, item_body, page_body, plain_body

UUID = re.compile(r"[0-9a-f-]{36}")


def test_get_with_flat_params_view_fields_and_headers(api: MockApi) -> None:
    api.handle(lambda req, n: Reply(body=page_body([{"id": "1"}], "c1.abc")))
    with OkData(KEY, base_url=api.url, source="weekly-report", end_user="u_42") as ok:
        page = ok.douyin.videos.search(query="露营装备", sort="latest", view="compact", fields=["id", "metrics.likes"])
    req = api.seen[0]
    assert (req.method, req.path) == ("GET", "/v1/douyin/videos/search")
    assert req.query == {"query": "露营装备", "sort": "latest", "view": "compact", "fields": "id,metrics.likes"}
    assert req.headers["authorization"] == f"Bearer {KEY}"
    assert req.headers["x-entry"] == "sdk"
    assert req.headers["x-source"] == "weekly-report"
    assert req.headers["x-end-user"] == "u_42"
    assert req.headers["user-agent"].startswith("okdata-sdk-python/")
    assert UUID.fullmatch(req.headers["idempotency-key"])
    assert "x-max-price" not in req.headers
    assert isinstance(page, Page)
    assert page.items == [{"id": "1"}]
    assert (page.next_cursor, page.has_more, page.returned) == ("c1.abc", True, 1)
    assert (page.cost, page.balance_after, page.result_status) == ("0.02", "9.98", "complete")
    assert page.idempotency_key == req.headers["idempotency-key"]


def test_max_price_goes_as_header(ok: OkData, api: MockApi) -> None:
    api.handle(lambda req, n: Reply(body=item_body({"id": "1"})))
    ok.x.posts.get(id="1850000000000000000", max_price="0.05")
    ok.x.posts.get(url="https://x.com/a/status/1", max_price=0.0003)
    assert api.seen[0].headers["x-max-price"] == "0.05"
    assert "max_price" not in api.seen[0].query
    assert api.seen[1].headers["x-max-price"] == "0.0003"


def test_bad_arguments_fail_before_sending(ok: OkData, api: MockApi) -> None:
    with pytest.raises(ValueError):
        ok.x.posts.get(id="1", max_price="5 dollars")
    with pytest.raises(ValueError, match="7 digits"):
        ok.x.posts.get(id="1", max_price="123456789")
    with pytest.raises(ValueError, match="view must be"):
        ok.call("x.posts.get", id="1", view="huge")
    with pytest.raises(ValueError, match="dotted names"):
        ok.x.posts.get(id="1", fields=["metrics likes"])
    with pytest.raises(TypeError):
        ok.douyin.videos.search()  # type: ignore[call-arg]
    assert api.seen == []


def test_batch_form_is_a_post_with_items_and_missing(ok: OkData, api: MockApi) -> None:
    api.handle(lambda req, n: Reply(body=batch_body([{"id": "1"}], [{"id": "missing", "reason": "not_found"}])))
    batch = ok.x.users.get(ids=["1", "missing"], fields="id,name")
    req = api.seen[0]
    assert (req.method, req.path) == ("POST", "/v1/x/users/get")
    assert req.body == {"ids": ["1", "missing"], "fields": ["id", "name"]}
    assert req.headers["content-type"] == "application/json"
    assert isinstance(batch, Batch)
    assert batch.items == [{"id": "1"}]
    assert batch.missing == [{"id": "missing", "reason": "not_found"}]
    assert batch.result_status == "partial"


def test_single_form_of_a_batch_endpoint_is_a_get(ok: OkData, api: MockApi) -> None:
    api.handle(lambda req, n: Reply(body=item_body({"id": "1", "name": "OpenAI"})))
    one = ok.x.users.get(username="openai")
    assert api.seen[0].method == "GET"
    assert isinstance(one, Item) and one.item["name"] == "OpenAI"


def test_unknown_ids_are_a_get_on_their_path(ok: OkData, api: MockApi) -> None:
    api.handle(lambda req, n: Reply(body=page_body([])))
    ok.call("newplatform.things.list", {"limit": 5, "flag": True, "tags": ["a", "b"]})
    assert api.seen[0].path == "/v1/newplatform/things/list"
    assert api.seen[0].query == {"limit": "5", "flag": "true", "tags": "a,b"}
    with pytest.raises(ValueError, match="not an endpoint id"):
        ok.call("not an id")


def test_given_idempotency_key_is_reused(ok: OkData, api: MockApi) -> None:
    api.handle(lambda req, n: Reply(body=item_body({"id": "1"}, replayed=True, amount="0")))
    res = ok.x.posts.get(id="1", idempotency_key="job-7-post-1")
    assert api.seen[0].headers["idempotency-key"] == "job-7-post-1"
    assert res.replayed and res.cost == "0"


def test_free_routes(ok: OkData, api: MockApi) -> None:
    api.handle(lambda req, n: Reply(body=page_body([{"id": "1"}], amount="0", replayed=True)) if req.path.endswith("/result") else Reply(body=plain_body({"path": req.path})))
    assert ok.catalog() == {"path": "/v1/catalog"}
    assert ok.status() == {"path": "/v1/catalog/status"}
    assert "authorization" not in api.seen[0].headers and "authorization" not in api.seen[1].headers
    ok.account()
    assert api.seen[2].headers["authorization"] == f"Bearer {KEY}"
    rid = "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20"
    ok.calls.get(rid)
    kept = ok.calls.result(rid, view="full", fields=["id"])
    ok.calls.by_key("job-7")
    ok.usage(group_by=["day", "capability"], since="2026-11-01")
    assert [(s.path, s.query) for s in api.seen[3:]] == [
        (f"/v1/calls/{rid}", {}),
        (f"/v1/calls/{rid}/result", {"view": "full", "fields": "id"}),
        ("/v1/calls", {"idempotency_key": "job-7"}),
        ("/v1/usage", {"group_by": "day,capability", "since": "2026-11-01"}),
    ]
    assert kept.replayed
    with pytest.raises(ValueError):
        ok.calls.get("../etc")


def test_error_carries_every_field(ok: OkData, api: MockApi) -> None:
    api.handle(lambda req, n: error_reply("invalid_params", param="sort", problems=["sort must be one of: relevance, latest"]))
    with pytest.raises(OkDataError) as info:
        ok.douyin.videos.search(query="x")
    e = info.value
    assert (e.code, e.status, e.charged, e.retry) == ("invalid_params", 400, False, "after_fix")
    assert e.message == "message for invalid_params" and e.message_zh == "invalid_params 的中文"
    assert e.problems == ["sort must be one of: relevance, latest"] and e.param == "sort"
    assert e.request_id and e.docs_url and e.docs_url.endswith("#invalid_params")
    assert e.idempotency_key and UUID.fullmatch(e.idempotency_key)
    assert len(api.seen) == 1  # after_fix: never retried


def test_charged_not_found_carries_amount(ok: OkData, api: MockApi) -> None:
    api.handle(lambda req, n: Reply(404, {**api_error("not_found"), "charged": True, "amount": "0.002"}))
    with pytest.raises(OkDataError) as info:
        ok.x.posts.get(id="1")
    assert info.value.charged is True and info.value.amount == "0.002"
    assert len(api.seen) == 1


def test_key_is_never_shown() -> None:
    ok = OkData(KEY, base_url="http://127.0.0.1:9")
    assert KEY not in repr(ok) and ok.has_key
    assert KEY not in repr(ok._cfg) and KEY not in repr(vars(ok))
    with pytest.raises(ValueError, match="spaces"):
        OkData("okd_ bad key")
    with pytest.raises(ValueError, match="base_url"):
        OkData(KEY, base_url="ftp://x")
    with pytest.raises(ValueError, match="source"):
        OkData(KEY, source="has space")


class TestRetries:
    def test_retry_yes_reuses_the_key_and_succeeds(self, ok: OkData, api: MockApi, slept: List[float]) -> None:
        api.handle(lambda req, n: error_reply("upstream_failed") if n < 2 else Reply(body=item_body({"id": "1"})))
        assert ok.x.posts.get(id="1").item == {"id": "1"}
        assert len(api.seen) == 3
        assert len({s.headers["idempotency-key"] for s in api.seen}) == 1
        assert len(slept) == 2

    def test_stops_after_max_retries(self, api: MockApi, slept: List[float]) -> None:
        api.handle(lambda req, n: error_reply("upstream_busy"))
        with pytest.raises(OkDataError) as info:
            OkData(KEY, base_url=api.url, max_retries=1, sleep=slept.append).x.posts.get(id="1")
        assert info.value.code == "upstream_busy" and info.value.charged is False
        assert len(api.seen) == 2

    def test_waits_retry_after_and_refuses_long_waits(self, ok: OkData, api: MockApi, slept: List[float]) -> None:
        api.handle(lambda req, n: error_reply("rate_limited", retry_after_seconds=2, reason="rate") if n == 0 else Reply(body=item_body({"id": "1"})))
        ok.x.posts.get(id="1")
        assert slept == [2]
        api.handle(lambda req, n: error_reply("cost_cap_exceeded", retry_after_seconds=36000))
        with pytest.raises(OkDataError) as info:
            ok.x.posts.get(id="1")
        assert info.value.retry_after_seconds == 36000

    def test_never_retries_no(self, ok: OkData, api: MockApi) -> None:
        api.handle(lambda req, n: error_reply("unauthorized", reason="key_disabled"))
        with pytest.raises(OkDataError) as info:
            ok.x.posts.get(id="1")
        assert info.value.reason == "key_disabled" and len(api.seen) == 1

    def test_once_means_one_more_try(self, api: MockApi, slept: List[float]) -> None:
        api.handle(lambda req, n: Reply(502, {**api_error("upstream_failed"), "retry": "once"}))
        with pytest.raises(OkDataError):
            OkData(KEY, base_url=api.url, max_retries=5, sleep=slept.append).x.posts.get(id="1")
        assert len(api.seen) == 2

    def test_same_key_for_in_progress_and_unknown_settlement(self, ok: OkData, api: MockApi) -> None:
        replies = [error_reply("settlement_unknown"), error_reply("call_in_progress", retry_after_seconds=1), Reply(body=item_body({"id": "1"}, replayed=True, amount="0"))]
        api.handle(lambda req, n: replies[n])
        assert ok.x.posts.get(id="1").replayed
        assert len({s.headers["idempotency-key"] for s in api.seen}) == 1

    def test_charge_unknown_when_an_earlier_attempt_may_have_run(self, api: MockApi, slept: List[float]) -> None:
        api.handle(lambda req, n: Reply(drop=True) if n == 0 else error_reply("upstream_failed"))
        with pytest.raises(OkDataError) as info:
            OkData(KEY, base_url=api.url, max_retries=1, sleep=slept.append).x.posts.get(id="1")
        assert info.value.code == "upstream_failed" and info.value.charged is None
        assert info.value.idempotency_key == api.seen[0].headers["idempotency-key"]

    def test_dropped_connection_is_connection_error(self, api: MockApi, slept: List[float]) -> None:
        api.handle(lambda req, n: Reply(drop=True))
        with pytest.raises(OkDataConnectionError) as info:
            OkData(KEY, base_url=api.url, max_retries=2, sleep=slept.append).x.posts.get(id="1")
        assert info.value.code == "connection_error" and info.value.charged is None
        assert len(api.seen) == 3

    def test_slow_answer_is_client_timeout(self, api: MockApi, slept: List[float]) -> None:
        api.handle(lambda req, n: Reply(body=item_body({"id": "1"}), delay=0.5))
        with pytest.raises(OkDataConnectionError) as info:
            OkData(KEY, base_url=api.url, max_retries=0, timeout=0.1, sleep=slept.append).x.posts.get(id="1")
        assert info.value.code == "client_timeout" and info.value.retry == "same_key"

    def test_garbled_200_is_resent_with_the_same_key(self, api: MockApi, slept: List[float]) -> None:
        api.handle(lambda req, n: Reply(200, text='{"code":"ok","data":') if n == 0 else Reply(body=item_body({"id": "1"}, replayed=True, amount="0")))
        assert OkData(KEY, base_url=api.url, sleep=slept.append).x.posts.get(id="1").replayed
        assert len({s.headers["idempotency-key"] for s in api.seen}) == 1
        api.handle(lambda req, n: Reply(200, text="truncated"))
        with pytest.raises(OkDataError) as info:
            OkData(KEY, base_url=api.url, max_retries=1, sleep=slept.append).x.posts.get(id="1")
        assert (info.value.code, info.value.charged, info.value.retry) == ("bad_response", None, "same_key")

    def test_proxy_page_is_bad_response_and_retried(self, ok: OkData, api: MockApi) -> None:
        api.handle(lambda req, n: Reply(502, text="Bad Gateway") if n == 0 else Reply(body=item_body({"id": "1"})))
        assert ok.x.posts.get(id="1").item == {"id": "1"}
        api.handle(lambda req, n: Reply(403, text="<html>blocked</html>"))
        with pytest.raises(OkDataError) as info:
            ok.x.posts.get(id="1")
        assert (info.value.code, info.value.status, info.value.retry) == ("bad_response", 403, "no")

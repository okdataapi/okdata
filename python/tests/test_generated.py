from __future__ import annotations

import asyncio
import inspect
import re
from importlib import metadata
from typing import Any

from okdata import CATALOG_REVISION, ENDPOINTS, ERROR_CODES, ERRORS, AsyncOkData, OkData, __version__


def _method(client: Any, endpoint_id: str) -> Any:
    node = client
    for part in endpoint_id.split("."):
        node = getattr(node, part, None)
    return node


def test_every_endpoint_has_a_sync_and_an_async_method() -> None:
    ok = OkData("okd_x", base_url="http://127.0.0.1:9")
    aok = AsyncOkData("okd_x", base_url="http://127.0.0.1:9")
    assert len(ENDPOINTS) > 100
    assert [i for i in ENDPOINTS if not callable(_method(ok, i))] == []
    assert [i for i in ENDPOINTS if not inspect.iscoroutinefunction(_method(aok, i))] == []
    ok.close()
    asyncio.run(aok.aclose())


def test_table_has_paths_prices_and_the_error_codes() -> None:
    info = ENDPOINTS["douyin.videos.search"]
    assert (info.path, info.list, info.unit) == ("/v1/douyin/videos/search", True, "call")
    assert all(e.path == "/v1/" + i.replace(".", "/") for i, e in ENDPOINTS.items())
    assert re.fullmatch(r"[0-9a-f]{16}", CATALOG_REVISION)
    assert set(ERROR_CODES) == set(ERRORS) and ERRORS["settlement_unknown"] == (500, None, "same_key")


def test_versions_agree() -> None:
    assert metadata.version("okdata") == __version__

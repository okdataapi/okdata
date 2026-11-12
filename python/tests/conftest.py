from __future__ import annotations

from typing import Iterator, List

import pytest

from okdata import OkData

from .mock_api import MockApi

KEY = "okd_test_0123456789abcdef"


@pytest.fixture(scope="session")
def server() -> Iterator[MockApi]:
    api = MockApi()
    yield api
    api.close()


@pytest.fixture()
def api(server: MockApi) -> MockApi:
    server.seen.clear()
    return server


@pytest.fixture()
def slept() -> List[float]:
    return []


@pytest.fixture()
def ok(api: MockApi, slept: List[float]) -> Iterator[OkData]:
    client = OkData(KEY, base_url=api.url, sleep=slept.append)
    yield client
    client.close()

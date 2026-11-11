from __future__ import annotations

from typing import Iterator, List

import pytest

from okdata import OkData

from mock_api import TEST_KEY, MockApi


@pytest.fixture(autouse=True)
def _no_real_env(monkeypatch: pytest.MonkeyPatch) -> None:
    """Tests never see a real key or the real API, whatever the shell has set."""
    monkeypatch.delenv("OKDATA_API_KEY", raising=False)
    monkeypatch.delenv("OKDATA_BASE_URL", raising=False)
    # Keep every request on this machine: no proxy from the environment or the OS settings.
    for name in ("HTTP_PROXY", "HTTPS_PROXY", "ALL_PROXY", "http_proxy", "https_proxy", "all_proxy"):
        monkeypatch.delenv(name, raising=False)
    monkeypatch.setenv("NO_PROXY", "*")


@pytest.fixture
def api() -> Iterator[MockApi]:
    server = MockApi()
    yield server
    server.close()


@pytest.fixture
def sleeps() -> List[float]:
    return []


@pytest.fixture
def client(api: MockApi, sleeps: List[float]) -> Iterator[OkData]:
    ok = OkData(TEST_KEY, base_url=api.url, timeout=5)
    ok._sleep = sleeps.append  # record backoff instead of waiting
    yield ok
    ok.close()

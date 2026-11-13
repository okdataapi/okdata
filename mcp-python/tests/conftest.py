from __future__ import annotations

from typing import Iterator

import pytest

from .fake_remote import FakeRemote


@pytest.fixture
def anyio_backend() -> str:
    return "asyncio"


@pytest.fixture(scope="session")
def remote_server() -> Iterator[FakeRemote]:
    fake = FakeRemote()
    yield fake
    fake.close()


@pytest.fixture
def fake(remote_server: FakeRemote) -> FakeRemote:
    remote_server.seen.clear()
    return remote_server

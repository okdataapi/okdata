"""Opt-in smoke test against the live API: OKDATA_LIVE_KEY=okd_... pytest. Free routes only
(catalog, status, account balance); nothing here is ever charged."""
from __future__ import annotations

import os

import pytest

from okdata import OkData

KEY = os.environ.get("OKDATA_LIVE_KEY")
pytestmark = pytest.mark.skipif(not KEY, reason="set OKDATA_LIVE_KEY to run the live smoke test")


def test_live_free_routes() -> None:
    with OkData(KEY, base_url=os.environ.get("OKDATA_LIVE_BASE_URL", "https://api.okdata.online"), timeout=30) as ok:
        assert isinstance(ok.catalog()["endpoints"], list)
        assert isinstance(ok.status()["revision"], str)
        account = ok.account()
        assert account["currency"] == "USD" and isinstance(account["balance"], str)

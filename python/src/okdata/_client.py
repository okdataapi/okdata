"""OkData: the synchronous client."""
from __future__ import annotations

import time
from typing import Any, Callable, Dict, Mapping, Optional, Sequence, Union

import httpx

from ._base import (
    call_request, check_request_id, endpoint, make_config, merge_params, result_query, usage_query,
)
from ._generated._sync import SyncEndpoints
from ._paging import ItemPager, Pager, _Budget
from ._result import to_result
from ._transport import Send, send_sync
from ._types import Price, Result, View


class _Calls:
    """Earlier calls: their record, their kept result (free for 24 h), where an Idempotency-Key stands."""

    def __init__(self, ok: "OkData") -> None:
        self._ok = ok

    def get(self, request_id: str) -> Dict[str, Any]:
        return self._ok.request("GET", f"/v1/calls/{check_request_id(request_id)}")

    def result(self, request_id: str, *, view: Optional[View] = None, fields: Optional[Union[str, Sequence[str]]] = None) -> Result:
        body = send_sync(self._ok._cfg, self._ok._http, self._ok._sleep,
                         Send("GET", f"/v1/calls/{check_request_id(request_id)}/result", result_query(view, fields)))
        return to_result(body, None)

    def by_key(self, idempotency_key: str) -> Dict[str, Any]:
        return self._ok.request("GET", "/v1/calls", query=[("idempotency_key", idempotency_key)])


class OkData(SyncEndpoints):
    """Client for the okdata API.

    >>> ok = OkData()  # reads OKDATA_API_KEY
    >>> page = ok.douyin.videos.search(query="露营装备", max_price="0.05")
    >>> page.items[0]["text"], page.cost

    Every paid call carries an Idempotency-Key, reused by its retries, so a retry is never charged
    twice. Failed calls are not charged.
    """

    def __init__(
        self,
        api_key: Optional[str] = None,
        *,
        base_url: Optional[str] = None,
        timeout: float = 65.0,
        max_retries: int = 2,
        retry_base_delay: float = 0.5,
        max_retry_delay: float = 20.0,
        entry: str = "sdk",
        source: Optional[str] = None,
        end_user: Optional[str] = None,
        user_agent: Optional[str] = None,
        http_client: Optional[httpx.Client] = None,
        sleep: Optional[Callable[[float], None]] = None,
    ) -> None:
        self._cfg = make_config(api_key, base_url, timeout, max_retries, retry_base_delay, max_retry_delay, entry, source, end_user, user_agent)
        self.base_url = self._cfg.base_url
        self._owns_http = http_client is None
        self._http = http_client or httpx.Client()
        self._sleep: Callable[[float], None] = sleep or time.sleep
        self.calls = _Calls(self)
        self._init_endpoints(self)

    @property
    def has_key(self) -> bool:
        """Whether a key is set; the key itself is never shown."""
        return self._cfg.api_key is not None

    def __repr__(self) -> str:
        return f"OkData(base_url={self.base_url!r}, key={'set' if self.has_key else 'missing'})"

    def __enter__(self) -> "OkData":
        return self

    def __exit__(self, *exc: object) -> None:
        self.close()

    def close(self) -> None:
        if self._owns_http:
            self._http.close()

    def _call(self, endpoint_id: str, params: Mapping[str, Any], *, idempotency_key: Optional[str] = None, timeout: Optional[float] = None) -> Result:
        req = call_request(endpoint_id, params, idempotency_key, timeout)
        return to_result(send_sync(self._cfg, self._http, self._sleep, req), req.idempotency_key)

    def call(self, endpoint_id: str, params: Optional[Mapping[str, Any]] = None, *, idempotency_key: Optional[str] = None,
             timeout: Optional[float] = None, **kwargs: Any) -> Result:
        """Any endpoint by id: ``call("weibo.trends.list")``. Ids newer than this SDK work too (GET)."""
        return self._call(endpoint_id, merge_params(params, kwargs), idempotency_key=idempotency_key, timeout=timeout)

    def pages(self, endpoint_id: str, params: Optional[Mapping[str, Any]] = None, *, max_pages: Optional[int] = None,
              max_spend: Optional[Price] = None, timeout: Optional[float] = None, **kwargs: Any) -> Pager[Dict[str, Any]]:
        """Pages of a list endpoint, following next_cursor, within max_pages / max_spend (US dollars).

        Before each page the pager adds what it could cost at most and stops if that would pass
        max_spend; each call also carries X-Max-Price = what is left, so the server refuses dearer ones.
        """
        budget = _Budget(endpoint_id, endpoint(endpoint_id), merge_params(params, kwargs), max_pages, max_spend)
        return Pager(budget, lambda p: self._call(endpoint_id, p, timeout=timeout))

    def items(self, endpoint_id: str, params: Optional[Mapping[str, Any]] = None, *, max_items: Optional[int] = None,
              max_pages: Optional[int] = None, max_spend: Optional[Price] = None, timeout: Optional[float] = None,
              **kwargs: Any) -> ItemPager[Dict[str, Any]]:
        """The items of a list endpoint across pages, within max_items / max_pages / max_spend."""
        return ItemPager(self.pages(endpoint_id, params, max_pages=max_pages, max_spend=max_spend, timeout=timeout, **kwargs), max_items)

    def account(self) -> Dict[str, Any]:
        """Balance, this key with its spending limits, and the account's rate limits. Free."""
        return self.request("GET", "/v1/account")

    def catalog(self) -> Dict[str, Any]:
        """Every endpoint with its parameters and price. Free, no key needed."""
        return self.request("GET", "/v1/catalog", auth=False)

    def status(self) -> Dict[str, Any]:
        """Which endpoints are up right now. Free, no key needed."""
        return self.request("GET", "/v1/catalog/status", auth=False)

    def usage(self, *, group_by: Optional[Sequence[str]] = None, since: Optional[str] = None, until: Optional[str] = None) -> Dict[str, Any]:
        """Calls, settled calls and charges grouped as asked (30 days by default). Free."""
        return self.request("GET", "/v1/usage", query=usage_query(group_by, since, until))

    def request(self, method: str, path: str, *, query: Sequence[Any] = (), body: Optional[Dict[str, Any]] = None, auth: bool = True) -> Dict[str, Any]:
        """A raw request to any route; returns the envelope's data."""
        envelope = send_sync(self._cfg, self._http, self._sleep, Send(method, path, tuple(query), body, None, None, auth))
        data = envelope.get("data")
        return data if isinstance(data, dict) else {}

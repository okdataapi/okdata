"""AsyncOkData: the asyncio client, the same surface as OkData with ``await``."""
from __future__ import annotations

import asyncio
from typing import Any, Awaitable, Callable, Dict, Mapping, Optional, Sequence, Union

import httpx

from ._base import (
    call_request, check_request_id, endpoint, make_config, merge_params, result_query, usage_query,
)
from ._generated._async import AsyncEndpoints
from ._paging import AsyncItemPager, AsyncPager, _Budget
from ._result import to_result
from ._transport import Send, send_async
from ._types import Price, Result, View


class _AsyncCalls:
    def __init__(self, ok: "AsyncOkData") -> None:
        self._ok = ok

    async def get(self, request_id: str) -> Dict[str, Any]:
        return await self._ok.request("GET", f"/v1/calls/{check_request_id(request_id)}")

    async def result(self, request_id: str, *, view: Optional[View] = None, fields: Optional[Union[str, Sequence[str]]] = None) -> Result:
        body = await send_async(self._ok._cfg, self._ok._http, self._ok._sleep,
                                Send("GET", f"/v1/calls/{check_request_id(request_id)}/result", result_query(view, fields)))
        return to_result(body, None)

    async def by_key(self, idempotency_key: str) -> Dict[str, Any]:
        return await self._ok.request("GET", "/v1/calls", query=[("idempotency_key", idempotency_key)])


class AsyncOkData(AsyncEndpoints):
    """Async client for the okdata API.

    >>> async with AsyncOkData() as ok:
    ...     page = await ok.douyin.videos.search(query="露营装备")
    ...     async for item in ok.items("douyin.videos.search", query="露营装备", max_spend="0.1"):
    ...         ...
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
        http_client: Optional[httpx.AsyncClient] = None,
        sleep: Optional[Callable[[float], Awaitable[None]]] = None,
    ) -> None:
        self._cfg = make_config(api_key, base_url, timeout, max_retries, retry_base_delay, max_retry_delay, entry, source, end_user, user_agent)
        self.base_url = self._cfg.base_url
        self._owns_http = http_client is None
        self._http = http_client or httpx.AsyncClient()
        self._sleep: Callable[[float], Awaitable[None]] = sleep or asyncio.sleep
        self.calls = _AsyncCalls(self)
        self._init_endpoints(self)

    @property
    def has_key(self) -> bool:
        return self._cfg.api_key is not None

    def __repr__(self) -> str:
        return f"AsyncOkData(base_url={self.base_url!r}, key={'set' if self.has_key else 'missing'})"

    async def __aenter__(self) -> "AsyncOkData":
        return self

    async def __aexit__(self, *exc: object) -> None:
        await self.aclose()

    async def aclose(self) -> None:
        if self._owns_http:
            await self._http.aclose()

    async def _call(self, endpoint_id: str, params: Mapping[str, Any], *, idempotency_key: Optional[str] = None, timeout: Optional[float] = None) -> Result:
        req = call_request(endpoint_id, params, idempotency_key, timeout)
        return to_result(await send_async(self._cfg, self._http, self._sleep, req), req.idempotency_key)

    async def call(self, endpoint_id: str, params: Optional[Mapping[str, Any]] = None, *, idempotency_key: Optional[str] = None,
                   timeout: Optional[float] = None, **kwargs: Any) -> Result:
        return await self._call(endpoint_id, merge_params(params, kwargs), idempotency_key=idempotency_key, timeout=timeout)

    def pages(self, endpoint_id: str, params: Optional[Mapping[str, Any]] = None, *, max_pages: Optional[int] = None,
              max_spend: Optional[Price] = None, timeout: Optional[float] = None, **kwargs: Any) -> AsyncPager[Dict[str, Any]]:
        """``async for page in ok.pages(...)``: see OkData.pages."""
        budget = _Budget(endpoint_id, endpoint(endpoint_id), merge_params(params, kwargs), max_pages, max_spend)
        return AsyncPager(budget, lambda p: self._call(endpoint_id, p, timeout=timeout))

    def items(self, endpoint_id: str, params: Optional[Mapping[str, Any]] = None, *, max_items: Optional[int] = None,
              max_pages: Optional[int] = None, max_spend: Optional[Price] = None, timeout: Optional[float] = None,
              **kwargs: Any) -> AsyncItemPager[Dict[str, Any]]:
        return AsyncItemPager(self.pages(endpoint_id, params, max_pages=max_pages, max_spend=max_spend, timeout=timeout, **kwargs), max_items)

    async def account(self) -> Dict[str, Any]:
        return await self.request("GET", "/v1/account")

    async def catalog(self) -> Dict[str, Any]:
        return await self.request("GET", "/v1/catalog", auth=False)

    async def status(self) -> Dict[str, Any]:
        return await self.request("GET", "/v1/catalog/status", auth=False)

    async def usage(self, *, group_by: Optional[Sequence[str]] = None, since: Optional[str] = None, until: Optional[str] = None) -> Dict[str, Any]:
        return await self.request("GET", "/v1/usage", query=usage_query(group_by, since, until))

    async def request(self, method: str, path: str, *, query: Sequence[Any] = (), body: Optional[Dict[str, Any]] = None, auth: bool = True) -> Dict[str, Any]:
        envelope = await send_async(self._cfg, self._http, self._sleep, Send(method, path, tuple(query), body, None, None, auth))
        data = envelope.get("data")
        return data if isinstance(data, dict) else {}

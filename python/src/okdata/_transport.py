"""One logical request, sync or async: the same Idempotency-Key on every attempt, retries as the
error body says, a per-attempt timeout, and the charge marked unknown when an earlier attempt's fate is."""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Awaitable, Callable, Dict, Optional, Sequence, Tuple

import httpx

from ._errors import OkDataConnectionError, OkDataError
from ._result import RetryPolicy, leaves_outcome_open, parse_answer, retry_delay


@dataclass(frozen=True)
class Config:
    base_url: str
    api_key: Optional[str] = field(repr=False)  # never in a repr, a log line or a traceback
    timeout: float = field(default=65.0)
    policy: RetryPolicy = field(default_factory=lambda: RetryPolicy(2, 0.5, 20.0))
    headers: Dict[str, str] = field(default_factory=dict)


@dataclass(frozen=True)
class Send:
    method: str
    path: str
    query: Sequence[Tuple[str, str]] = ()
    body: Optional[Dict[str, Any]] = None
    idempotency_key: Optional[str] = None
    max_price: Optional[str] = None
    auth: bool = True
    """False: send no Authorization header (the free catalog routes, the CLI link)."""
    timeout: Optional[float] = None


def _headers(cfg: Config, req: Send) -> Dict[str, str]:
    headers = {"Accept": "application/json", **cfg.headers}
    if req.auth and cfg.api_key:
        headers["Authorization"] = f"Bearer {cfg.api_key}"
    if req.idempotency_key:
        headers["Idempotency-Key"] = req.idempotency_key
    if req.max_price is not None:
        headers["X-Max-Price"] = req.max_price
    return headers


def _lost(cfg: Config, req: Send, err: Exception) -> OkDataConnectionError:
    if isinstance(err, httpx.TimeoutException):
        limit = req.timeout if req.timeout is not None else cfg.timeout
        return OkDataConnectionError(f"no answer from {cfg.base_url} within {limit} s", "client_timeout", req.idempotency_key)
    return OkDataConnectionError(f"could not reach {cfg.base_url}: {err}", "connection_error", req.idempotency_key)


def _give_up(err: OkDataError, open_outcome: bool) -> OkDataError:
    return err.with_charged(None) if open_outcome and err.charged is False else err


def send_sync(cfg: Config, http: httpx.Client, sleep: Callable[[float], None], req: Send) -> Dict[str, Any]:
    """Sends one request (with its retries); returns the success envelope or raises OkDataError."""
    open_outcome = False
    retries = 0
    while True:
        try:
            try:
                res = http.request(req.method, cfg.base_url + req.path, params=list(req.query), json=req.body,
                                   headers=_headers(cfg, req), timeout=req.timeout if req.timeout is not None else cfg.timeout)
            except httpx.TransportError as err:
                raise _lost(cfg, req, err) from err
            return parse_answer(res.status_code, res.headers, res.text, req.idempotency_key)
        except OkDataError as err:
            open_outcome = open_outcome or leaves_outcome_open(err)
            delay = retry_delay(err, retries, cfg.policy)
            if delay is None:
                final = _give_up(err, open_outcome)
                if final is err:
                    raise
                raise final from err
            sleep(delay)
            retries += 1


async def send_async(cfg: Config, http: httpx.AsyncClient, sleep: Callable[[float], Awaitable[None]], req: Send) -> Dict[str, Any]:
    """The async twin of send_sync."""
    open_outcome = False
    retries = 0
    while True:
        try:
            try:
                res = await http.request(req.method, cfg.base_url + req.path, params=list(req.query), json=req.body,
                                         headers=_headers(cfg, req), timeout=req.timeout if req.timeout is not None else cfg.timeout)
            except httpx.TransportError as err:
                raise _lost(cfg, req, err) from err
            return parse_answer(res.status_code, res.headers, res.text, req.idempotency_key)
        except OkDataError as err:
            open_outcome = open_outcome or leaves_outcome_open(err)
            delay = retry_delay(err, retries, cfg.policy)
            if delay is None:
                final = _give_up(err, open_outcome)
                if final is err:
                    raise
                raise final from err
            await sleep(delay)
            retries += 1

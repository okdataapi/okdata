"""The okdata client: auth, retries with Idempotency-Key, and the typed endpoint methods."""
from __future__ import annotations

import os
import random
import re
import time
import uuid
from decimal import Decimal
from typing import Any, Callable, Dict, Iterator, Mapping, NoReturn, Optional, Tuple, Union, cast

import httpx

from ._endpoints import ENDPOINTS, Platforms
from ._errors import OkDataConnectionError, OkDataError, Retry
from ._params import Fields, View, check_view, drop_none, join_fields, query_value
from ._response import EndpointInfo, Item, Page, parse_success
from ._version import __version__

DEFAULT_BASE_URL = "https://api.okdata.online"
ENV_API_KEY = "OKDATA_API_KEY"
ENV_BASE_URL = "OKDATA_BASE_URL"
RETRY_STATUSES = frozenset({429, 500, 502, 503, 504})
_ID = re.compile(r"[a-z0-9_]+(\.[a-z0-9_]+)+")
_PATH = re.compile(r"/v1(/[a-z0-9_]+)+")
_RETRY_VALUES = ("no", "yes", "after_fix", "same_key")
_KEY = re.compile(r"[\x21-\x7e]+")
_REQUEST_ID = re.compile(r"[A-Za-z0-9-]+")
# After an attempt that may still be running on the server, a retry with the same key gets
# rate_limited until it finishes; wait for it this many extra times before giving up.
IN_FLIGHT_WAITS = 5

Result = Union[Page[Dict[str, Any]], Item[Dict[str, Any]]]


def endpoint_info(endpoint: str) -> EndpointInfo:
    """The catalog entry for an id like "douyin.videos.search" or a path like "/v1/douyin/videos/search".

    Ids this SDK version does not know yet still work: they map to GET /v1/<id with dots as slashes>.
    """
    if endpoint in ENDPOINTS:
        return ENDPOINTS[endpoint]
    for info in ENDPOINTS.values():
        if info.path == endpoint:
            return info
    if _PATH.fullmatch(endpoint):
        path = endpoint
    elif _ID.fullmatch(endpoint):
        path = "/v1/" + endpoint.replace(".", "/")
    else:
        raise ValueError(f"not an endpoint id or /v1 path: {endpoint!r}")
    return EndpointInfo(
        id=endpoint, method="GET", path=path, object="unknown", list=False, page_size=None,
        unit="call", price="0", max_charge="0", title=endpoint,
    )


def max_cost(endpoint: str, pages: int = 1) -> Decimal:
    """The most `pages` calls of an endpoint can cost, in US dollars. Say this before a big job."""
    if pages < 0:
        raise ValueError("pages must be 0 or more")
    info = ENDPOINTS.get(endpoint)
    if info is None:
        raise ValueError(f"unknown endpoint {endpoint!r}; see okdata.ENDPOINTS")
    return Decimal(info.max_charge) * pages


class OkData(Platforms):
    """Client for the okdata API.

    >>> ok = OkData()  # reads OKDATA_API_KEY
    >>> page = ok.douyin.trends.list()
    >>> page.items[0]["name"], page.cost

    Every paid call carries an Idempotency-Key (one is made for you when you do not pass one), and
    retries reuse it, so a retry never charges twice. Failed calls are not charged.
    """

    def __init__(
        self,
        api_key: Optional[str] = None,
        *,
        base_url: Optional[str] = None,
        timeout: float = 60.0,
        max_retries: int = 2,
        retry_base_delay: float = 0.5,
        max_retry_delay: float = 8.0,
        http_client: Optional[httpx.Client] = None,
    ) -> None:
        key = (api_key if api_key is not None else os.environ.get(ENV_API_KEY, "")).strip()
        if key and not _KEY.fullmatch(key):
            raise ValueError("the API key contains spaces or control characters; copy it again (keys start with okd_)")
        self._api_key: Optional[str] = key or None
        url = (base_url or os.environ.get(ENV_BASE_URL) or DEFAULT_BASE_URL).rstrip("/")
        if not url.startswith(("https://", "http://")):
            raise ValueError(f"base_url must start with https:// or http://, got {url!r}")
        if max_retries < 0:
            raise ValueError("max_retries must be 0 or more")
        self.base_url = url
        self.max_retries = max_retries
        self.retry_base_delay = retry_base_delay
        self.max_retry_delay = max_retry_delay
        self._owns_http = http_client is None
        self._http = http_client or httpx.Client(timeout=timeout)
        self._sleep: Callable[[float], None] = time.sleep
        self._init_platforms(self)

    def __repr__(self) -> str:
        return f"OkData(base_url={self.base_url!r}, key={'set' if self._api_key else 'missing'})"

    def __enter__(self) -> "OkData":
        return self

    def __exit__(self, *exc: object) -> None:
        self.close()

    def close(self) -> None:
        if self._owns_http:
            self._http.close()

    # Calls -------------------------------------------------------------------------------------

    def call(
        self,
        endpoint: str,
        params: Optional[Mapping[str, Any]] = None,
        *,
        view: Optional[View] = None,
        fields: Optional[Fields] = None,
        idempotency_key: Optional[str] = None,
    ) -> Result:
        """Call any endpoint by id, e.g. call("weibo.trends.list"). Returns a Page or an Item."""
        info = endpoint_info(endpoint)
        return self._call(info, params, view=view, fields=fields, idempotency_key=idempotency_key)

    def iter_pages(
        self,
        endpoint: str,
        params: Optional[Mapping[str, Any]] = None,
        *,
        max_pages: int,
        view: Optional[View] = None,
        fields: Optional[Fields] = None,
    ) -> Iterator[Page[Dict[str, Any]]]:
        """Yield pages until there are no more or max_pages is reached. Each page is its own charge."""
        if max_pages < 1:
            raise ValueError("max_pages must be 1 or more")
        info = endpoint_info(endpoint)
        current = dict(params or {})
        for _ in range(max_pages):
            result = self._call(info, current, view=view, fields=fields, idempotency_key=None)
            if not isinstance(result, Page):
                raise TypeError(f"{info.id} returns one object, not pages")
            yield result
            if not result.has_more or not result.next_cursor:
                return
            current = {**current, "cursor": result.next_cursor}

    def account(self) -> Dict[str, Any]:
        """Balance, key info and rate limit of the key in use."""
        return self._plain("GET", "/v1/account")

    def catalog(self) -> Dict[str, Any]:
        """Every endpoint with parameters and prices. Free, no key needed."""
        return self._plain("GET", "/v1/catalog")

    def status(self) -> Dict[str, Any]:
        """Which endpoints are up right now. Free, no key needed."""
        return self._plain("GET", "/v1/catalog/status")

    def get_call(self, request_id: str) -> Dict[str, Any]:
        """The outcome and charge of an earlier call, e.g. after a timeout."""
        if not _REQUEST_ID.fullmatch(request_id or ""):
            raise ValueError("request_id must be the request_id of an earlier call")
        return self._plain("GET", f"/v1/calls/{request_id}")

    # Used by the generated endpoint methods ----------------------------------------------------

    def _page(self, endpoint: str, params: Mapping[str, Any], *, view: Optional[View], fields: Optional[Fields],
              idempotency_key: Optional[str]) -> Page[Any]:
        result = self._call(ENDPOINTS[endpoint], params, view=view, fields=fields, idempotency_key=idempotency_key)
        if not isinstance(result, Page):
            raise OkDataError(f"{endpoint} answered with one object, expected a page", code="bad_response")
        return result

    def _item(self, endpoint: str, params: Mapping[str, Any], *, view: Optional[View], fields: Optional[Fields],
              idempotency_key: Optional[str]) -> Item[Any]:
        result = self._call(ENDPOINTS[endpoint], params, view=view, fields=fields, idempotency_key=idempotency_key)
        if not isinstance(result, Item):
            raise OkDataError(f"{endpoint} answered with a page, expected one object", code="bad_response")
        return result

    # Transport ---------------------------------------------------------------------------------

    def _call(self, info: EndpointInfo, params: Optional[Mapping[str, Any]], *, view: Optional[View],
              fields: Optional[Fields], idempotency_key: Optional[str]) -> Result:
        values = drop_none(params)
        options = drop_none({"view": check_view(view), "fields": join_fields(fields)})
        if info.method == "POST":
            paging = {k: values.pop(k) for k in list(values) if k == "cursor"}
            query, body = {**paging, **options}, values
        else:
            query, body = {**values, **options}, None
        key = idempotency_key or str(uuid.uuid4())
        envelope, _ = self._send(info.method, info.path, query=query, body=body, idempotency_key=key)
        return parse_success(envelope)

    def _plain(self, method: str, path: str) -> Dict[str, Any]:
        envelope, _ = self._send(method, path, query={}, body=None, idempotency_key=None)
        data = envelope.get("data")
        return data if isinstance(data, dict) else {"value": data}

    def _headers(self, idempotency_key: Optional[str]) -> Dict[str, str]:
        headers = {"Accept": "application/json", "User-Agent": f"okdata-python/{__version__}"}
        if self._api_key:
            headers["Authorization"] = f"Bearer {self._api_key}"
        if idempotency_key:
            headers["Idempotency-Key"] = idempotency_key
        return headers

    def _send(self, method: str, path: str, *, query: Mapping[str, Any], body: Optional[Mapping[str, Any]],
              idempotency_key: Optional[str]) -> Tuple[Dict[str, Any], httpx.Headers]:
        url = self.base_url + path
        params = {k: query_value(v) for k, v in query.items()}
        attempt = 0
        in_flight_waits = 0
        ambiguous = False  # an earlier attempt may have run (and been charged) without us seeing the answer
        while True:
            try:
                response = self._request(method, url, params=params, body=body, idempotency_key=idempotency_key)
                return self._parse(response), response.headers
            except OkDataError as err:
                ambiguous = ambiguous or err.charged is None
                if ambiguous and err.code == "rate_limited" and idempotency_key and in_flight_waits < IN_FLIGHT_WAITS:
                    in_flight_waits += 1
                    self._sleep(min(err.retry_after_seconds or 1.0, self.max_retry_delay))
                    continue
                delay = self._retry_delay(err, attempt)
                if delay is None:
                    if ambiguous and err.charged is False:
                        err.charged = None  # the first attempt may still finish and be billed
                    raise
            attempt += 1
            self._sleep(delay)

    def _request(self, method: str, url: str, *, params: Mapping[str, str], body: Optional[Mapping[str, Any]],
                 idempotency_key: Optional[str]) -> httpx.Response:
        try:
            return self._http.request(method, url, params=params, json=body, headers=self._headers(idempotency_key))
        except httpx.TimeoutException as exc:
            raise OkDataConnectionError(f"no answer in time from {self.base_url}: {exc}", code="client_timeout") from exc
        except httpx.TransportError as exc:
            raise OkDataConnectionError(f"could not reach {self.base_url}: {exc}") from exc

    def _parse(self, response: httpx.Response) -> Dict[str, Any]:
        try:
            body = response.json()
        except ValueError:
            body = None
        if isinstance(body, dict) and body.get("code") == "ok":
            return body
        if isinstance(body, dict) and isinstance(body.get("code"), str):
            self._raise_api_error(body, response)
        retry: Retry = "yes" if response.status_code in RETRY_STATUSES else "no"
        raise OkDataError(
            f"HTTP {response.status_code} without an okdata answer", code="bad_response",
            status=response.status_code, request_id=response.headers.get("x-request-id"),
            charged=None, retry=retry, retry_after_seconds=_retry_after_header(response),
        )

    @staticmethod
    def _raise_api_error(body: Dict[str, Any], response: httpx.Response) -> NoReturn:
        advice = body.get("retry")
        retry = cast(Retry, advice) if advice in _RETRY_VALUES else "no"
        retry_after = _seconds(body.get("retry_after_seconds"))
        raise OkDataError(
            str(body.get("message") or body["code"]), code=body["code"], status=response.status_code,
            request_id=body.get("request_id") or response.headers.get("x-request-id"),
            charged=body.get("charged", False), retry=retry,
            retry_after_seconds=retry_after if retry_after is not None else _retry_after_header(response),
            body=body,
        )

    def _retry_delay(self, err: OkDataError, attempt: int) -> Optional[float]:
        """Seconds to wait before the next try, or None to give up and raise."""
        if not err.retryable or attempt >= self.max_retries:
            return None
        if err.retry_after_seconds is not None:
            # The server said how long; waiting less only earns another rate_limited.
            return err.retry_after_seconds if err.retry_after_seconds <= self.max_retry_delay else None
        backoff = self.retry_base_delay * (2.0 ** attempt)
        return min(self.max_retry_delay, backoff * random.uniform(0.5, 1.0))


def _seconds(value: Any) -> Optional[float]:
    """A non-negative number of seconds, or None for anything else."""
    try:
        seconds = float(value)
    except (TypeError, ValueError):
        return None
    return seconds if seconds >= 0 else None


def _retry_after_header(response: httpx.Response) -> Optional[float]:
    return _seconds(response.headers.get("retry-after"))


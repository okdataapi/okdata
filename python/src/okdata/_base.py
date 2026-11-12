"""What OkData and AsyncOkData share: options, headers, and turning a call into a request."""
from __future__ import annotations

import os
import re
import uuid
from typing import Any, Dict, List, Mapping, Optional, Sequence, Tuple, Union

from ._generated._endpoints import ENDPOINTS
from ._request import build_request, field_list
from ._result import RetryPolicy
from ._transport import Config, Send
from ._types import EndpointInfo
from ._version import __version__

DEFAULT_BASE_URL = "https://api.okdata.online"
ENV_API_KEY = "OKDATA_API_KEY"
ENV_BASE_URL = "OKDATA_BASE_URL"
_LABEL = re.compile(r"[\x21-\x7e]{1,128}")
_KEY = re.compile(r"[\x21-\x7e]+")
_REQUEST_ID = re.compile(r"[A-Za-z0-9-]{1,64}")


def endpoint(endpoint_id: str) -> Optional[EndpointInfo]:
    """The catalog entry this SDK was generated with, or None for an id it does not know."""
    return ENDPOINTS.get(endpoint_id)


def _label(value: Optional[str], name: str, most: int = 128) -> Optional[str]:
    if value is None:
        return None
    if not _LABEL.fullmatch(value) or len(value) > most:
        raise ValueError(f"{name} must be 1-{most} visible ASCII characters, no spaces")
    return value


def make_config(
    api_key: Optional[str], base_url: Optional[str], timeout: float, max_retries: int, retry_base_delay: float,
    max_retry_delay: float, entry: str, source: Optional[str], end_user: Optional[str], user_agent: Optional[str],
) -> Config:
    key = (api_key if api_key is not None else os.environ.get(ENV_API_KEY, "")).strip()
    if key and not _KEY.fullmatch(key):
        raise ValueError("the API key has spaces or control characters in it; copy it again (keys start with okd_)")
    url = (base_url or os.environ.get(ENV_BASE_URL) or DEFAULT_BASE_URL).rstrip("/")
    if not re.match(r"https?://[^/]+", url):
        raise ValueError(f"base_url must start with https:// or http://, got {url!r}")
    if isinstance(max_retries, bool) or not isinstance(max_retries, int) or max_retries < 0:
        raise ValueError("max_retries must be a whole number, 0 or more")
    headers = {"X-Entry": _label(entry, "entry", 32) or "sdk", "User-Agent": " ".join(filter(None, [f"okdata-sdk-python/{__version__}", user_agent]))}
    for header, value, name in (("X-Source", source, "source"), ("X-End-User", end_user, "end_user")):
        if _label(value, name) is not None:
            headers[header] = value  # type: ignore[assignment]
    return Config(url, key or None, timeout, RetryPolicy(max_retries, retry_base_delay, max_retry_delay), headers)


def call_request(endpoint_id: str, params: Mapping[str, Any], idempotency_key: Optional[str], timeout: Optional[float]) -> Send:
    req = build_request(endpoint_id, ENDPOINTS.get(endpoint_id), params)
    return Send(req.method, req.path, tuple(req.query), req.body, idempotency_key or str(uuid.uuid4()), req.max_price, True, timeout)


def merge_params(params: Optional[Mapping[str, Any]], kwargs: Mapping[str, Any]) -> Dict[str, Any]:
    return {**(params or {}), **kwargs}


def check_request_id(request_id: str) -> str:
    if not _REQUEST_ID.fullmatch(request_id):
        raise ValueError("request_id must be the request_id of an earlier call")
    return request_id


def result_query(view: Optional[str], fields: Optional[Union[str, Sequence[str]]]) -> Tuple[Tuple[str, str], ...]:
    query: List[Tuple[str, str]] = []
    if view is not None:
        query.append(("view", view))
    if fields is not None:
        query.append(("fields", ",".join(field_list(fields))))
    return tuple(query)


def usage_query(group_by: Optional[Sequence[str]], since: Optional[str], until: Optional[str]) -> Tuple[Tuple[str, str], ...]:
    query: List[Tuple[str, str]] = []
    if group_by:
        query.append(("group_by", ",".join(group_by)))
    if since:
        query.append(("since", since))
    if until:
        query.append(("until", until))
    return tuple(query)

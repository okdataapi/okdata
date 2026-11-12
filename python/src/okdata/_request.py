"""Turns an endpoint id and flat params into the HTTP request the contract wants: GET with query
parameters, or POST with a JSON body when a list parameter (ids, keywords) is given to an endpoint
that takes one. view, fields and max_price ride along; max_price becomes X-Max-Price."""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Any, Dict, List, Mapping, Optional, Sequence, Tuple, Union

from ._money import max_price_header
from ._types import EndpointInfo

_ID = re.compile(r"[a-z0-9_]+(\.[a-z0-9_]+)+")
_FIELD = re.compile(r"[A-Za-z0-9_]+(\.[A-Za-z0-9_]+)*")
VIEWS = ("compact", "standard", "full")


@dataclass(frozen=True)
class HttpRequest:
    method: str
    path: str
    query: List[Tuple[str, str]] = field(default_factory=list)
    body: Optional[Dict[str, Any]] = None
    max_price: Optional[str] = None


def path_of_id(endpoint_id: str) -> str:
    """/v1/douyin/videos/search for douyin.videos.search."""
    if not _ID.fullmatch(endpoint_id):
        raise ValueError(f"not an endpoint id: {endpoint_id!r} (ids look like douyin.videos.search)")
    return "/v1/" + endpoint_id.replace(".", "/")


def field_list(fields: Union[str, Sequence[str]]) -> List[str]:
    parts = [f.strip() for f in (fields.split(",") if isinstance(fields, str) else list(fields))]
    parts = [p for p in parts if p]
    if not parts:
        raise ValueError("fields is empty; leave it out to get every field")
    bad = [p for p in parts if not _FIELD.fullmatch(p)]
    if bad:
        raise ValueError(f"fields are dotted names like metrics.likes, not {bad!r}")
    return parts


def _query_value(value: Any) -> str:
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, (list, tuple)):
        return ",".join(str(v) for v in value)
    return str(value)


def _is_list(value: Any) -> bool:
    return isinstance(value, (list, tuple))


def build_request(endpoint_id: str, info: Optional[EndpointInfo], params: Mapping[str, Any]) -> HttpRequest:
    values: Dict[str, Any] = {k: v for k, v in params.items() if v is not None}
    cap = values.pop("max_price", None)
    view = values.pop("view", None)
    fields = values.pop("fields", None)
    if view is not None:
        if view not in VIEWS:
            raise ValueError(f"view must be one of {', '.join(VIEWS)}")
        values["view"] = view
    if fields is not None:
        values["fields"] = field_list(fields)
    path = info.path if info is not None else path_of_id(endpoint_id)
    max_price = max_price_header(cap) if cap is not None else None
    batch = info is not None and info.post and any(info.params.get(k) == "string[]" and _is_list(v) for k, v in values.items())
    if batch:
        body = {k: list(v) if _is_list(v) else v for k, v in values.items()}
        return HttpRequest("POST", path, [], body, max_price)
    return HttpRequest("GET", path, [(k, _query_value(v)) for k, v in values.items()], None, max_price)

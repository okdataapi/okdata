"""Helpers for request parameters: view, fields and id-or-url."""
from __future__ import annotations

import re
from typing import Any, Dict, Literal, Mapping, Optional, Sequence, Union

View = Literal["compact", "standard", "full"]
"""compact drops null fields, standard is the default, full adds platform extras under ext."""

Fields = Union[str, Sequence[str]]
"""Dotted field paths to keep, e.g. ["id", "text", "metrics.likes"] or "id,text,metrics.likes"."""

VIEWS = ("compact", "standard", "full")
_FIELD = re.compile(r"[A-Za-z0-9_]+(\.[A-Za-z0-9_]+)*")


def join_fields(fields: Optional[Fields]) -> Optional[str]:
    """["id", "metrics.likes"] -> "id,metrics.likes". Rejects empty or malformed paths."""
    if fields is None:
        return None
    parts = fields.split(",") if isinstance(fields, str) else list(fields)
    cleaned = [p.strip() for p in parts if isinstance(p, str) and p.strip()]
    if not cleaned:
        raise ValueError("fields is empty; leave it out to get every field")
    bad = [p for p in cleaned if not _FIELD.fullmatch(p)]
    if bad:
        raise ValueError(f"fields must be dotted names like metrics.likes, got {bad!r}")
    return ",".join(cleaned)


def check_view(view: Optional[str]) -> Optional[str]:
    if view is not None and view not in VIEWS:
        raise ValueError(f"view must be one of {', '.join(VIEWS)}, got {view!r}")
    return view


def require_one_of(**values: Any) -> None:
    """Endpoints that take id or url need exactly one of the two."""
    given = [name for name, value in values.items() if value is not None]
    if len(given) != 1:
        names = " or ".join(values)
        raise ValueError(f"give {names}, exactly one of them (got {len(given)})")


def query_value(value: Any) -> str:
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, (list, tuple)):
        return ",".join(str(v) for v in value)
    return str(value)


def drop_none(params: Optional[Mapping[str, Any]]) -> Dict[str, Any]:
    return {k: v for k, v in (params or {}).items() if v is not None}

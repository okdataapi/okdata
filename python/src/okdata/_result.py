"""Success envelopes as Page / Item / Batch, error bodies as OkDataError, and when to retry."""
from __future__ import annotations

import json
import random
from dataclasses import dataclass
from typing import Any, Callable, Dict, Mapping, Optional, cast

from ._errors import RETRY_ADVICE, OkDataError, RetryAdvice
from ._types import Batch, Item, Meta, Page, Result

_RETRY_STATUSES = frozenset({429, 500, 502, 503, 504})
_IN_PROGRESS_MIN_S = 1.0


def seconds(value: Any) -> Optional[float]:
    """A non-negative number of seconds, or None."""
    if isinstance(value, bool):
        return None
    try:
        n = float(value)
    except (TypeError, ValueError):
        return None
    return n if n >= 0 and n == n and n != float("inf") else None


def to_result(body: Mapping[str, Any], idempotency_key: Optional[str]) -> Result:
    meta = cast(Meta, body.get("meta") or {})
    billing = meta.get("billing") or {}
    data = body.get("data") or {}
    base: Dict[str, Any] = dict(
        request_id=str(body.get("request_id", "")),
        capability=str(meta.get("capability", "")),
        result_status=str(meta.get("result_status", "complete")),
        cost=str(billing.get("amount", "0")),
        balance_after=billing.get("balance_after") or None,
        replayed=meta.get("replayed") is True,
        cached=meta.get("cached") is True,
        unavailable=dict(meta.get("unavailable") or {}),
        warnings=list(body.get("warnings") or []),
        meta=meta,
        idempotency_key=idempotency_key,
        raw=dict(body),
    )
    items = data.get("items")
    page = body.get("page")
    if isinstance(items, list) and isinstance(page, dict):
        cursor = page.get("next_cursor")
        return Page(
            **base, items=items, next_cursor=cursor, cursor_expires_at=page.get("cursor_expires_at"),
            has_more=page.get("has_more") is True and cursor is not None, returned=int(page.get("returned", len(items))),
        )
    if isinstance(items, list):
        return Batch(**base, items=items, missing=list(data.get("missing") or []))
    return Item(**base, item=cast(Dict[str, Any], data.get("item")))


def parse_answer(status: int, headers: Mapping[str, str], text: str, idempotency_key: Optional[str]) -> Dict[str, Any]:
    """The success envelope of an answer, or raises the OkDataError it carries."""
    try:
        parsed = json.loads(text) if text else None
    except ValueError:
        parsed = None
    body = parsed if isinstance(parsed, dict) else None
    if body is not None and body.get("code") == "ok" and status < 400:
        return body
    retry_after_header = seconds(headers.get("retry-after"))
    if body is not None and isinstance(body.get("code"), str):
        advice = body.get("retry")
        raise OkDataError(
            body["code"],
            body["message"] if isinstance(body.get("message"), str) else body["code"],
            status=status,
            request_id=body["request_id"] if isinstance(body.get("request_id"), str) else headers.get("x-request-id"),
            charged=body.get("charged", False),
            retry=cast(RetryAdvice, advice) if advice in RETRY_ADVICE else "no",
            retry_after_seconds=seconds(body.get("retry_after_seconds")) if body.get("retry_after_seconds") is not None else retry_after_header,
            idempotency_key=idempotency_key,
            body=body,
        )
    raise OkDataError(
        "bad_response",
        f"HTTP {status} without an okdata answer",
        status=status,
        request_id=headers.get("x-request-id"),
        charged=None if status >= 500 or status < 300 else False,
        retry="same_key" if status < 300 else "yes" if status in _RETRY_STATUSES else "no",
        retry_after_seconds=retry_after_header,
        idempotency_key=idempotency_key,
    )


@dataclass(frozen=True)
class RetryPolicy:
    max_retries: int
    base_delay: float
    """First backoff step, seconds, when the server names no wait."""
    max_delay: float
    """A server-named wait longer than this is not slept through: the error is raised."""


def retry_delay(err: OkDataError, attempt: int, policy: RetryPolicy, rand: Callable[[], float] = random.random) -> Optional[float]:
    """Seconds to wait before the next attempt, or None to stop. ``attempt`` counts retries made so far.

    yes / same_key: retry (same Idempotency-Key); once: one more try at most; no / after_fix: never.
    """
    if attempt >= policy.max_retries or err.retry in ("no", "after_fix"):
        return None
    if err.retry == "once" and attempt > 0:
        return None
    if err.retry_after_seconds is not None:
        return err.retry_after_seconds if err.retry_after_seconds <= policy.max_delay else None
    backoff = min(policy.max_delay, policy.base_delay * 2.0 ** attempt) * (0.5 + rand() / 2)
    return max(_IN_PROGRESS_MIN_S, backoff) if err.code == "call_in_progress" else backoff


def leaves_outcome_open(err: OkDataError) -> bool:
    """Errors after which an earlier attempt with the same key may still have run (and been charged)."""
    return err.charged is None or err.code == "call_in_progress"

"""What a call returns (Page, Item, Batch) and the shapes shared with the generated methods."""
from __future__ import annotations

from dataclasses import dataclass
from decimal import Decimal
from typing import Any, Dict, Generic, List, Literal, Mapping, Optional, Sequence, TypedDict, TypeVar, Union

T = TypeVar("T")

View = Literal["compact", "standard", "full"]
"""compact (shortest; long text cut at 500 characters), standard (default) or full (adds ``ext``)."""

Fields = Union[str, Sequence[str]]
"""Dotted paths to keep: ``["id", "metrics.likes"]`` or ``"id,metrics.likes"``."""

Price = Union[str, Decimal, int, float]
"""US dollars. Text (``"0.05"``) or Decimal is exact; floats are rounded to 6 places."""

ResultStatus = Literal["complete", "partial", "empty"]


class Billing(TypedDict, total=False):
    amount: str
    """What this call cost, US dollars as a decimal string ("0" for a free replay)."""
    currency: str
    balance_after: str
    covers_next: bool
    """Sent (as false) only when what is left does not cover another call like this one."""
    top_up_url: str


class Meta(TypedDict, total=False):
    capability: str
    result_status: ResultStatus
    billing: Billing
    unavailable: Dict[str, str]
    """Fields this endpoint cannot give, and why ("platform" or "capability")."""
    cached: bool
    replayed: bool
    fetched_at: str


class CallWarning(TypedDict, total=False):
    code: str
    """items_dropped, text_truncated, items_capped_by_balance or note."""
    message: str
    count: int
    item: int
    fields: List[str]


class Missing(TypedDict):
    id: str
    reason: str


@dataclass(frozen=True)
class EndpointInfo:
    """One endpoint as the SDK needs it at run time (generated from the catalog)."""

    id: str
    path: str
    list: bool
    post: bool
    """True: a list parameter (ids, keywords) sends the call as POST with a JSON body."""
    batch_max: Optional[int]
    unit: Literal["call", "item"]
    price: str
    max_charge: str
    page_size: Optional[int]
    params: Mapping[str, str]
    object: str
    title: str
    paused: bool


@dataclass(frozen=True)
class _Result:
    request_id: str
    capability: str
    result_status: str
    cost: str
    """What this call cost, US dollars as a decimal string."""
    balance_after: Optional[str]
    replayed: bool
    """True when an Idempotency-Key replayed a stored result at no charge."""
    cached: bool
    unavailable: Dict[str, str]
    warnings: List[CallWarning]
    meta: Meta
    idempotency_key: Optional[str]
    """The key this call was sent with; resending with it never charges twice."""
    raw: Dict[str, Any]
    """The success envelope exactly as the API sent it."""


@dataclass(frozen=True)
class Page(_Result, Generic[T]):
    """One page of a list endpoint. The next page is a new call, charged on its own."""

    items: List[T]
    next_cursor: Optional[str]
    cursor_expires_at: Optional[str]
    has_more: bool
    returned: int


@dataclass(frozen=True)
class Item(_Result, Generic[T]):
    """The answer of a single-object endpoint."""

    item: T


@dataclass(frozen=True)
class Batch(_Result, Generic[T]):
    """The batch form of a single-object endpoint (ids given): found objects and what was missing."""

    items: List[T]
    missing: List[Missing]


Result = Union[Page[Dict[str, Any]], Item[Dict[str, Any]], Batch[Dict[str, Any]]]

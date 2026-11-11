"""What a call returns: a Page of items or a single Item, plus what it cost."""
from __future__ import annotations

from dataclasses import dataclass
from decimal import Decimal
from typing import Any, Dict, Generic, Iterator, List, Literal, Optional, TypedDict, TypeVar, cast

T = TypeVar("T")


class Billing(TypedDict):
    amount: str
    """What this call cost, in US dollars, as a decimal string."""
    currency: str
    balance_after: str


class Meta(TypedDict, total=False):
    capability: str
    """The endpoint id that answered."""
    billing: Billing
    unavailable: Dict[str, str]
    """Fields that are null and why: "platform" (never shown) or "capability" (not fetched yet)."""
    cached: bool
    replayed: bool
    """True when an Idempotency-Key replayed a stored result at no charge."""
    fetched_at: str


@dataclass(frozen=True)
class EndpointInfo:
    """One catalog entry: where an endpoint lives and what it costs."""

    id: str
    method: Literal["GET", "POST"]
    path: str
    object: str
    list: bool
    page_size: Optional[int]
    unit: Literal["call", "item"]
    price: str
    max_charge: str
    title: str


@dataclass(frozen=True)
class _Result:
    request_id: str
    meta: Meta
    warnings: List[str]
    raw: Dict[str, Any]

    @property
    def cost(self) -> Decimal:
        """What this call cost in US dollars (0 for a free replay)."""
        billing = self.meta.get("billing")
        return Decimal(billing["amount"]) if billing else Decimal("0")

    @property
    def replayed(self) -> bool:
        return bool(self.meta.get("replayed", False))

    @property
    def unavailable(self) -> Dict[str, str]:
        return dict(self.meta.get("unavailable", {}))


@dataclass(frozen=True)
class Page(_Result, Generic[T]):
    """One page from a list endpoint. The next page is a new, separately charged call."""

    items: List[T]
    next_cursor: Optional[str]
    has_more: bool

    def __iter__(self) -> Iterator[T]:
        return iter(self.items)

    def __len__(self) -> int:
        return len(self.items)


@dataclass(frozen=True)
class Item(_Result, Generic[T]):
    """The answer of a single-object endpoint."""

    item: T


def parse_success(body: Dict[str, Any]) -> "Page[Any] | Item[Any]":
    """Turn a success envelope into a Page (data.items) or an Item (data.item)."""
    data = body.get("data") or {}
    request_id = str(body.get("request_id", ""))
    meta = cast(Meta, body.get("meta") or {})
    warnings = [str(w) for w in body.get("warnings") or []]
    if "items" in data:
        page = body.get("page") or {}
        return Page(
            request_id=request_id, meta=meta, warnings=warnings, raw=body,
            items=list(data["items"]),
            next_cursor=page.get("next_cursor"),
            has_more=bool(page.get("has_more", False)),
        )
    return Item(request_id=request_id, meta=meta, warnings=warnings, raw=body, item=data.get("item"))

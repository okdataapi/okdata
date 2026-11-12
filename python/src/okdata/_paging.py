"""pages() and items(): follow page.next_cursor with the same parameters, and stop before the next
call could take the total past max_spend (counted from meta.billing.amount of the pages so far)."""
from __future__ import annotations

from decimal import Decimal
from typing import Any, AsyncIterator, Awaitable, Callable, Dict, Generic, Iterator, Literal, Mapping, Optional, Tuple, TypeVar

from ._errors import OkDataError
from ._money import text, usd
from ._types import EndpointInfo, Page, Price, Result

T = TypeVar("T")
StopReason = Literal["end", "max_pages", "max_items", "max_spend", "balance"]
"""Why paging ended: no next page, a limit you set, or a balance that will not cover the next page."""


def _positive(n: Optional[int], name: str) -> Optional[int]:
    if n is not None and (isinstance(n, bool) or not isinstance(n, int) or n < 1):
        raise ValueError(f"{name} must be a whole number, 1 or more")
    return n


class _Budget:
    """The paging state both pagers share: pages, spend, the per-call cap, why it stopped."""

    def __init__(self, endpoint_id: str, info: Optional[EndpointInfo], params: Mapping[str, Any],
                 max_pages: Optional[int], max_spend: Optional[Price]) -> None:
        if info is not None and not info.list:
            raise TypeError(f"{endpoint_id} returns one object, not pages")
        self.endpoint_id = endpoint_id
        self.worst = Decimal(info.max_charge) if info is not None else Decimal(0)
        self.params: Dict[str, Any] = dict(params)
        self.max_pages = _positive(max_pages, "max_pages")
        self.max_spend = usd(max_spend, "max_spend") if max_spend is not None else None
        cap = self.params.get("max_price")
        self.user_cap = usd(cap, "max_price") if cap is not None else None
        self.spent = Decimal(0)
        self.calls = 0
        self.stop_reason: Optional[StopReason] = None
        self.started = False

    def start(self) -> None:
        if self.started:
            raise RuntimeError("a pager can be iterated once; call pages() again for a new run")
        self.started = True

    def next_call(self) -> Optional[Tuple[Dict[str, Any], bool]]:
        """The params of the next call and whether our own cap is on it, or None to stop."""
        if self.max_pages is not None and self.calls >= self.max_pages:
            self.stop_reason = "max_pages"
            return None
        left = self.max_spend - self.spent if self.max_spend is not None else None
        if left is not None and self.worst > left:
            self.stop_reason = "max_spend"
            return None
        capped = left is not None and (self.user_cap is None or left < self.user_cap)
        return ({**self.params, "max_price": text(left)} if capped and left is not None else self.params), capped

    def refused(self, err: OkDataError, capped: bool) -> bool:
        """Our own cap refused a page the catalog priced lower than the server does: that is the budget."""
        if capped and err.code == "max_price_exceeded":
            self.stop_reason = "max_spend"
            return True
        return False

    def after(self, result: Result) -> bool:
        """Counts a page; True when there is a next one to fetch."""
        if not isinstance(result, Page):
            raise TypeError(f"{self.endpoint_id} answered with one object, not a page")
        self.calls += 1
        self.spent += Decimal(result.cost or "0")
        if not result.next_cursor or not result.has_more:
            self.stop_reason = "end"
            return False
        if result.meta.get("billing", {}).get("covers_next") is False:
            self.stop_reason = "balance"
            return False
        self.params = {**self.params, "cursor": result.next_cursor}
        return True


class _Stats:
    _budget: _Budget

    @property
    def spent(self) -> str:
        """US dollars charged by the pages fetched so far."""
        return text(self._budget.spent)

    @property
    def calls(self) -> int:
        return self._budget.calls


class Pager(_Stats, Generic[T]):
    """Pages of one listing. Iterate it once; spent, calls and stop_reason tell how it went."""

    def __init__(self, budget: _Budget, call: Callable[[Dict[str, Any]], Result]) -> None:
        self._budget = budget
        self._call = call

    @property
    def stop_reason(self) -> Optional[StopReason]:
        return self._budget.stop_reason

    def __iter__(self) -> Iterator[Page[T]]:
        self._budget.start()
        while True:
            step = self._budget.next_call()
            if step is None:
                return
            params, capped = step
            try:
                result = self._call(params)
            except OkDataError as err:
                if self._budget.refused(err, capped):
                    return
                raise
            more = self._budget.after(result)
            yield result  # type: ignore[misc]
            if not more:
                return


class ItemPager(_Stats, Generic[T]):
    """The items of one listing, page after page, up to max_items."""

    def __init__(self, pager: Pager[T], max_items: Optional[int]) -> None:
        self._pager = pager
        self._budget = pager._budget
        self._max_items = _positive(max_items, "max_items")
        self._items = 0
        self._hit = False

    @property
    def items(self) -> int:
        return self._items

    @property
    def stop_reason(self) -> Optional[StopReason]:
        return "max_items" if self._hit else self._pager.stop_reason

    def __iter__(self) -> Iterator[T]:
        for page in self._pager:
            for item in page.items:
                yield item
                self._items += 1
                if self._max_items is not None and self._items >= self._max_items:
                    self._hit = True
                    return


class AsyncPager(_Stats, Generic[T]):
    """The async twin of Pager: ``async for page in ok.pages(...)``."""

    def __init__(self, budget: _Budget, call: Callable[[Dict[str, Any]], Awaitable[Result]]) -> None:
        self._budget = budget
        self._call = call

    @property
    def stop_reason(self) -> Optional[StopReason]:
        return self._budget.stop_reason

    async def __aiter__(self) -> AsyncIterator[Page[T]]:
        self._budget.start()
        while True:
            step = self._budget.next_call()
            if step is None:
                return
            params, capped = step
            try:
                result = await self._call(params)
            except OkDataError as err:
                if self._budget.refused(err, capped):
                    return
                raise
            more = self._budget.after(result)
            yield result  # type: ignore[misc]
            if not more:
                return


class AsyncItemPager(_Stats, Generic[T]):
    """The async twin of ItemPager."""

    def __init__(self, pager: AsyncPager[T], max_items: Optional[int]) -> None:
        self._pager = pager
        self._budget = pager._budget
        self._max_items = _positive(max_items, "max_items")
        self._items = 0
        self._hit = False

    @property
    def items(self) -> int:
        return self._items

    @property
    def stop_reason(self) -> Optional[StopReason]:
        return "max_items" if self._hit else self._pager.stop_reason

    async def __aiter__(self) -> AsyncIterator[T]:
        async for page in self._pager:
            for item in page.items:
                yield item
                self._items += 1
                if self._max_items is not None and self._items >= self._max_items:
                    self._hit = True
                    return

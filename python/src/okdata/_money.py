"""US dollars as decimal strings outside, Decimal inside: no float ever touches a price or budget."""
from __future__ import annotations

import re
from decimal import ROUND_HALF_UP, Decimal, InvalidOperation
from typing import Union

_USD = re.compile(r"\d{1,12}(\.\d{1,6})?")
MAX_PRICE = re.compile(r"\d{1,7}(\.\d{1,6})?")
"""What X-Max-Price accepts: up to 7 digits, then up to 6 decimals."""
_MICRO = Decimal("0.000001")


def usd(value: Union[str, Decimal, int, float], name: str) -> Decimal:
    """A budget or cap as a Decimal; text must be a plain decimal, numbers are rounded to 6 places."""
    if isinstance(value, bool):
        raise TypeError(f"{name} must be US dollars, not a bool")
    if isinstance(value, str):
        text = value.strip()
        if not _USD.fullmatch(text):
            raise ValueError(f"{name} must be US dollars as a decimal string, like '0.05'")
        return Decimal(text)
    try:
        amount = Decimal(str(value)) if isinstance(value, float) else Decimal(value)
    except (InvalidOperation, ValueError) as err:
        raise ValueError(f"{name} must be US dollars") from err
    if not amount.is_finite() or amount < 0:
        raise ValueError(f"{name} must be 0 or more US dollars")
    return amount.quantize(_MICRO, rounding=ROUND_HALF_UP)


def text(amount: Decimal) -> str:
    """Decimal("0.0400") -> "0.04"; Decimal("0") -> "0"."""
    normalized = amount.quantize(_MICRO, rounding=ROUND_HALF_UP).normalize()
    out = format(normalized, "f")
    return out if out != "-0" else "0"


def max_price_header(value: Union[str, Decimal, int, float]) -> str:
    """The price cap as X-Max-Price wants it."""
    out = text(usd(value, "max_price"))
    if not MAX_PRICE.fullmatch(out):
        raise ValueError("max_price must be at most 7 digits before the point, like '0.05'")
    return out

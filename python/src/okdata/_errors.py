"""Errors the client raises. Every API error says whether it was charged and whether to retry;
branch on ``code`` (and ``reason``), never on ``message``."""
from __future__ import annotations

from typing import Any, Dict, List, Literal, Mapping, Optional

RetryAdvice = Literal["no", "yes", "once", "after_fix", "same_key"]
"""no: fails the same way again. yes: retry. once: one more try. after_fix: change what problems says.
same_key: resend with the same Idempotency-Key (never charged twice)."""

RETRY_ADVICE = ("no", "yes", "once", "after_fix", "same_key")


def _text(body: Mapping[str, Any], key: str) -> Optional[str]:
    value = body.get(key)
    return value if isinstance(value, str) else None


class OkDataError(Exception):
    """An error answer from the API, or a call that got none.

    ``charged`` is False for almost every error, True for a not_found the endpoint charges (then
    ``amount`` says how much), and None when it is not known (a lost answer, settlement_unknown):
    look the call up with ``ok.calls.get(request_id)`` or ``ok.calls.by_key(idempotency_key)``.
    """

    def __init__(
        self,
        code: str,
        message: str,
        *,
        status: Optional[int] = None,
        request_id: Optional[str] = None,
        charged: Optional[bool] = False,
        retry: RetryAdvice = "no",
        retry_after_seconds: Optional[float] = None,
        idempotency_key: Optional[str] = None,
        body: Optional[Mapping[str, Any]] = None,
    ) -> None:
        super().__init__(f"{code}: {message}")
        data: Mapping[str, Any] = body or {}
        self.code = code
        self.message = message
        self.status = status
        self.request_id = request_id
        self.charged = charged
        self.retry: RetryAdvice = retry
        self.retry_after_seconds = retry_after_seconds
        self.idempotency_key = idempotency_key
        self.body: Optional[Dict[str, Any]] = dict(body) if body is not None else None
        self.message_zh = _text(data, "message_zh")
        problems = data.get("problems")
        self.problems: List[str] = [str(p) for p in problems] if isinstance(problems, list) else []
        self.param = _text(data, "param")
        self.reason = _text(data, "reason")
        self.docs_url = _text(data, "docs_url")
        self.amount = _text(data, "amount")
        self.required = _text(data, "required")
        self.available = _text(data, "available")
        self.top_up_url = _text(data, "top_up_url")
        self.next_step = _text(data, "next_step")
        self.next_step_zh = _text(data, "next_step_zh")

    def with_charged(self, charged: Optional[bool]) -> "OkDataError":
        """The same error with another charge state."""
        return OkDataError(
            self.code, self.message, status=self.status, request_id=self.request_id, charged=charged,
            retry=self.retry, retry_after_seconds=self.retry_after_seconds,
            idempotency_key=self.idempotency_key, body=self.body,
        )

    def to_dict(self) -> Dict[str, Any]:
        return {
            **(self.body or {}),
            "code": self.code, "message": self.message, "status": self.status, "request_id": self.request_id,
            "charged": self.charged, "retry": self.retry, "retry_after_seconds": self.retry_after_seconds,
            "idempotency_key": self.idempotency_key,
        }

    def __repr__(self) -> str:
        return f"OkDataError(code={self.code!r}, status={self.status!r}, charged={self.charged!r}, retry={self.retry!r}, request_id={self.request_id!r})"


class OkDataConnectionError(OkDataError):
    """No answer came back (network failure or the client's own timeout); whether the call ran is unknown."""

    def __init__(self, message: str, code: Literal["connection_error", "client_timeout"], idempotency_key: Optional[str]) -> None:
        super().__init__(code, message, charged=None, retry="same_key", idempotency_key=idempotency_key)

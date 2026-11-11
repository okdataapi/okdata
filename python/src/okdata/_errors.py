"""Errors raised by the client. Every API error says whether it was charged and whether to retry."""
from __future__ import annotations

from typing import Any, Dict, Literal, Optional

Retry = Literal["no", "yes", "after_fix", "same_key"]


class OkDataError(Exception):
    """An error answer from the API, or a request that never got one.

    code: the API error code, e.g. "invalid_params", "not_found", "rate_limited" (see docs/errors.md).
    charged: False for every API error; None when it is not known yet (a timeout), in which case
        retrying with the same Idempotency-Key cannot charge twice.
    retry: "no", "yes", "after_fix" or "same_key", as the API advises.
    """

    def __init__(
        self,
        message: str,
        *,
        code: str,
        status: Optional[int] = None,
        request_id: Optional[str] = None,
        charged: Optional[bool] = False,
        retry: Retry = "no",
        retry_after_seconds: Optional[float] = None,
        body: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(message)
        self.message = message
        self.code = code
        self.status = status
        self.request_id = request_id
        self.charged = charged
        self.retry = retry
        self.retry_after_seconds = retry_after_seconds
        self.body = body

    @property
    def retryable(self) -> bool:
        """True when sending the same request again may succeed."""
        return self.retry in ("yes", "same_key")

    def __str__(self) -> str:
        where = f" (request {self.request_id})" if self.request_id else ""
        return f"{self.code}: {self.message}{where}"

    def __repr__(self) -> str:
        return f"{type(self).__name__}(code={self.code!r}, status={self.status!r}, charged={self.charged!r}, retry={self.retry!r})"


class OkDataConnectionError(OkDataError):
    """The request did not get an answer: a network failure or a client-side timeout.

    Whether the call ran is unknown, so charged is None. The client retries it with the same
    Idempotency-Key, which replays a finished call instead of charging again.
    """

    def __init__(self, message: str, *, code: str = "connection_error") -> None:
        super().__init__(message, code=code, charged=None, retry="same_key")

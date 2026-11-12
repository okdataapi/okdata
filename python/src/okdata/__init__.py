"""okdata: social data for AI agents, paid per call.

    >>> from okdata import OkData
    >>> ok = OkData()  # reads OKDATA_API_KEY
    >>> page = ok.douyin.videos.search(query="露营装备", max_price="0.05")

One typed method per endpoint (generated from the catalog), sync (OkData) and async (AsyncOkData),
an automatic Idempotency-Key per call, retries driven by the error's ``retry`` field, and
``pages()`` / ``items()`` that stop before ``max_spend``.
"""
from ._async_client import AsyncOkData
from ._base import DEFAULT_BASE_URL, ENV_API_KEY, ENV_BASE_URL, endpoint
from ._client import OkData
from ._errors import OkDataConnectionError, OkDataError, RetryAdvice
from ._generated._endpoints import CATALOG_REVISION, ENDPOINTS, PRICE_BOOK
from ._generated._errors import ERROR_CODES, ERRORS
from ._generated._models import *  # noqa: F401,F403  (Post, Account, Comment, ...)
from ._paging import AsyncItemPager, AsyncPager, ItemPager, Pager, StopReason
from ._types import Batch, Billing, CallWarning, EndpointInfo, Fields, Item, Meta, Missing, Page, Price, Result, View
from ._version import __version__

__all__ = [
    "OkData", "AsyncOkData", "OkDataError", "OkDataConnectionError", "RetryAdvice",
    "Page", "Item", "Batch", "Result", "Meta", "Billing", "CallWarning", "Missing", "EndpointInfo",
    "View", "Fields", "Price", "Pager", "ItemPager", "AsyncPager", "AsyncItemPager", "StopReason",
    "ENDPOINTS", "CATALOG_REVISION", "PRICE_BOOK", "ERROR_CODES", "ERRORS", "endpoint",
    "DEFAULT_BASE_URL", "ENV_API_KEY", "ENV_BASE_URL", "__version__",
]

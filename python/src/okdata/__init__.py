"""okdata: public social data for AI agents and code, paid per call.

    from okdata import OkData
    ok = OkData()  # reads OKDATA_API_KEY
    page = ok.weibo.trends.list()

Docs: https://okdata.online/docs/  ·  Endpoints: https://okdata.online/apis/
"""
from ._client import DEFAULT_BASE_URL, OkData, endpoint_info, max_cost
from ._endpoints import CATALOG_REVISION, ENDPOINTS, PRICE_BOOK
from ._errors import OkDataConnectionError, OkDataError
from ._models import Account, AccountRef, Comment, Metrics, Post, Segment, Transcript, Trend
from ._params import Fields, View
from ._response import EndpointInfo, Item, Meta, Page
from ._version import __version__

__all__ = [
    "Account",
    "AccountRef",
    "CATALOG_REVISION",
    "Comment",
    "DEFAULT_BASE_URL",
    "ENDPOINTS",
    "EndpointInfo",
    "Fields",
    "Item",
    "Meta",
    "Metrics",
    "OkData",
    "OkDataConnectionError",
    "OkDataError",
    "PRICE_BOOK",
    "Page",
    "Post",
    "Segment",
    "Transcript",
    "Trend",
    "View",
    "__version__",
    "endpoint_info",
    "max_cost",
]

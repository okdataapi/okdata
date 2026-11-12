"""A local stand-in for the API: real HTTP on 127.0.0.1 in a thread, a scripted answer per request,
and a log of what came in. Bodies follow docs/contract.md (success envelope, 9-field errors)."""
from __future__ import annotations

import itertools
import json
import threading
import time
from dataclasses import dataclass, field
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any, Callable, Dict, List, Optional
from urllib.parse import parse_qsl, urlsplit

from okdata import ERRORS


@dataclass
class Seen:
    method: str
    path: str
    query: Dict[str, str]
    headers: Dict[str, str]
    body: Any


@dataclass
class Reply:
    status: int = 200
    body: Any = None
    text: Optional[str] = None
    headers: Dict[str, str] = field(default_factory=dict)
    drop: bool = False
    delay: float = 0.0


Handler = Callable[[Seen, int], Reply]
_ids = itertools.count(1)


def _request_id() -> str:
    return f"00000000-0000-4000-8000-{next(_ids):012d}"


class MockApi:
    def __init__(self) -> None:
        self.seen: List[Seen] = []
        self.handler: Handler = lambda req, n: Reply(404, api_error("unknown_endpoint"))
        api = self

        class _H(BaseHTTPRequestHandler):
            def log_message(self, *args: Any) -> None:  # quiet
                pass

            def _handle(self) -> None:
                url = urlsplit(self.path)
                length = int(self.headers.get("content-length") or 0)
                raw = self.rfile.read(length) if length else b""
                seen = Seen(self.command, url.path, dict(parse_qsl(url.query)), {k.lower(): v for k, v in self.headers.items()},
                            json.loads(raw) if raw else None)
                api.seen.append(seen)
                reply = api.handler(seen, len(api.seen) - 1)
                if reply.delay:
                    time.sleep(reply.delay)
                if reply.drop:
                    self.close_connection = True
                    self.connection.shutdown(2)
                    return
                payload = (reply.text if reply.text is not None else json.dumps(reply.body)).encode()
                self.send_response(reply.status)
                self.send_header("Content-Type", "text/html" if reply.text is not None else "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(payload)))
                for k, v in reply.headers.items():
                    self.send_header(k, v)
                self.end_headers()
                self.wfile.write(payload)

            do_GET = _handle
            do_POST = _handle

        self._server = ThreadingHTTPServer(("127.0.0.1", 0), _H)
        self._server.daemon_threads = True
        self.url = f"http://127.0.0.1:{self._server.server_address[1]}"
        self._thread = threading.Thread(target=self._server.serve_forever, daemon=True)
        self._thread.start()

    def handle(self, handler: Handler) -> None:
        self.handler = handler

    def close(self) -> None:
        self._server.shutdown()
        self._server.server_close()


def _meta(capability: str = "douyin.videos.search", amount: str = "0.02", balance: str = "9.98", status: str = "complete",
          replayed: bool = False, covers_next: Optional[bool] = None) -> Dict[str, Any]:
    billing: Dict[str, Any] = {"amount": amount, "currency": "USD", "balance_after": balance}
    if covers_next is False:
        billing.update(covers_next=False, top_up_url="https://okdata.online/console/billing/")
    return {"capability": capability, "result_status": status, "billing": billing, "unavailable": {}, "cached": False,
            "replayed": replayed, "fetched_at": "2026-11-12T00:00:00Z"}


def page_body(items: List[Any], next_cursor: Optional[str] = None, **meta: Any) -> Dict[str, Any]:
    return {
        "code": "ok", "request_id": _request_id(), "data": {"items": items},
        "page": {"next_cursor": next_cursor, "cursor_expires_at": "2026-11-13T00:00:00Z" if next_cursor else None,
                 "has_more": next_cursor is not None, "returned": len(items)},
        "warnings": [], "meta": _meta(**meta),
    }


def item_body(item: Any, **meta: Any) -> Dict[str, Any]:
    return {"code": "ok", "request_id": _request_id(), "data": {"item": item}, "warnings": [], "meta": _meta(**meta)}


def batch_body(items: List[Any], missing: List[Any], **meta: Any) -> Dict[str, Any]:
    meta.setdefault("status", "partial" if missing else "complete")
    return {"code": "ok", "request_id": _request_id(), "data": {"items": items, "missing": missing}, "warnings": [], "meta": _meta(**meta)}


def plain_body(data: Any) -> Dict[str, Any]:
    return {"code": "ok", "request_id": _request_id(), "data": data, "warnings": []}


def api_error(code: str, **extra: Any) -> Dict[str, Any]:
    _, charged, retry = ERRORS[code]
    return {"code": code, "request_id": _request_id(), "message": f"message for {code}", "message_zh": f"{code} 的中文",
            "charged": charged, "retry": retry, "retry_after_seconds": None, "param": None,
            "docs_url": f"https://okdata.online/docs/errors/#{code}", **extra}


def error_reply(code: str, **extra: Any) -> Reply:
    return Reply(ERRORS[code][0], api_error(code, **extra))

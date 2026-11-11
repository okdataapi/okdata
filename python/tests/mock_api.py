"""A local stand-in for api.okdata.online: answers like the real API, records every request,
and plays back scripted answers (errors, dropped connections) in order. No real key, no network."""
from __future__ import annotations

import json
import threading
import uuid
from dataclasses import dataclass, field
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any, Dict, List, Optional
from urllib.parse import parse_qsl, urlsplit

from okdata import ENDPOINTS

TEST_KEY = "okd_test_0000000000000000"


@dataclass
class Recorded:
    method: str
    path: str
    query: Dict[str, str]
    headers: Dict[str, str]
    body: Optional[Any]


@dataclass
class Scripted:
    status: int = 200
    body: Optional[Dict[str, Any]] = None
    raw: Optional[bytes] = None
    headers: Dict[str, str] = field(default_factory=dict)
    drop: bool = False


def ok_envelope(endpoint: str, *, items: Optional[List[Any]] = None, item: Any = None, next_cursor: Optional[str] = None,
                amount: str = "0.002", replayed: bool = False) -> Dict[str, Any]:
    body: Dict[str, Any] = {
        "code": "ok",
        "request_id": str(uuid.uuid4()),
        "warnings": [],
        "meta": {
            "capability": endpoint,
            "billing": {"amount": amount, "currency": "USD", "balance_after": "0.9"},
            "unavailable": {},
            "cached": False,
            "replayed": replayed,
            "fetched_at": "2026-11-12T08:00:00Z",
        },
    }
    if items is not None:
        body["data"] = {"items": items}
        body["page"] = {"next_cursor": next_cursor, "has_more": next_cursor is not None}
    else:
        body["data"] = {"item": item}
    return body


def error_body(code: str, message: str = "scripted", *, retry: str = "no", charged: Optional[bool] = False,
               retry_after_seconds: Optional[float] = None) -> Dict[str, Any]:
    return {"code": code, "message": message, "request_id": str(uuid.uuid4()), "charged": charged, "retry": retry,
            "retry_after_seconds": retry_after_seconds}


class MockApi:
    def __init__(self) -> None:
        self.requests: List[Recorded] = []
        self._script: Dict[str, List[Scripted]] = {}
        self._lock = threading.Lock()
        self._server = ThreadingHTTPServer(("127.0.0.1", 0), self._handler())
        self._thread = threading.Thread(target=self._server.serve_forever, kwargs={"poll_interval": 0.02}, daemon=True)
        self._thread.start()

    @property
    def url(self) -> str:
        host, port = self._server.server_address[:2]
        return f"http://{host}:{port}"

    def close(self) -> None:
        self._server.shutdown()
        self._server.server_close()

    def script(self, path: str, *answers: Scripted) -> None:
        with self._lock:
            self._script.setdefault(path, []).extend(answers)

    def _next(self, path: str) -> Optional[Scripted]:
        with self._lock:
            queue = self._script.get(path)
            return queue.pop(0) if queue else None

    def _default(self, rec: Recorded) -> Scripted:
        if rec.path in ("/v1/catalog", "/v1/catalog/status"):
            return Scripted(body={"code": "ok", "request_id": str(uuid.uuid4()), "warnings": [],
                                  "data": {"revision": "0.1.0", "summary": {"available": len(ENDPOINTS), "paused": 0}}})
        if rec.headers.get("authorization") != f"Bearer {TEST_KEY}":
            return Scripted(status=401, body=error_body("unauthorized", "Send your API key", retry="after_fix"))
        if rec.path == "/v1/account":
            return Scripted(body={"code": "ok", "request_id": str(uuid.uuid4()), "warnings": [],
                                  "data": {"balance": "0.9", "currency": "USD"}})
        info = next((e for e in ENDPOINTS.values() if e.path == rec.path), None)
        if info is None:
            return Scripted(status=404, body=error_body("unknown_endpoint", "No endpoint here"))
        if info.list:
            return Scripted(body=ok_envelope(info.id, items=[{"id": "1", "text": "hello"}], amount=info.price))
        return Scripted(body=ok_envelope(info.id, item={"id": "1", "text": "hello"}, amount=info.price))

    def _handler(self) -> type:
        api = self

        class Handler(BaseHTTPRequestHandler):
            def log_message(self, *args: Any) -> None:
                pass

            def _serve(self) -> None:
                parts = urlsplit(self.path)
                length = int(self.headers.get("content-length") or 0)
                raw = self.rfile.read(length) if length else b""
                rec = Recorded(
                    method=self.command,
                    path=parts.path,
                    query=dict(parse_qsl(parts.query, keep_blank_values=True)),
                    headers={k.lower(): v for k, v in self.headers.items()},
                    body=json.loads(raw) if raw else None,
                )
                with api._lock:
                    api.requests.append(rec)
                answer = api._next(rec.path) or api._default(rec)
                if answer.drop:
                    self.close_connection = True
                    return
                payload = answer.raw if answer.raw is not None else json.dumps(answer.body).encode()
                self.send_response(answer.status)
                self.send_header("Content-Type", "application/json" if answer.raw is None else "text/html")
                self.send_header("Content-Length", str(len(payload)))
                for k, v in answer.headers.items():
                    self.send_header(k, v)
                self.end_headers()
                self.wfile.write(payload)

            do_GET = _serve
            do_POST = _serve

        return Handler

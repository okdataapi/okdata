"""A local stand-in for the remote okdata MCP server (https://api.okdata.online/mcp): real HTTP on
127.0.0.1 in a thread, stateless JSON-RPC over POST with JSON answers, like the hosted one. It logs the
headers and body of every request so tests can check what the bridge sent."""
from __future__ import annotations

import json
import threading
from dataclasses import dataclass
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any, Dict, List, Optional

INSTRUCTIONS = "okdata returns public data from social platforms. find, describe and account status work without a key."

TOOLS: List[Dict[str, Any]] = [
    {"name": "find", "description": "Find a capability. Free, no key.",
     "inputSchema": {"type": "object", "properties": {"query": {"type": "string"}}, "additionalProperties": False}},
    {"name": "call", "description": "Call a capability. Needs an API key.",
     "inputSchema": {"type": "object", "properties": {"capability": {"type": "string"}, "idempotency_key": {"type": "string"}},
                     "required": ["capability"], "additionalProperties": False},
     "annotations": {"readOnlyHint": False, "openWorldHint": True}},
]


@dataclass
class Seen:
    headers: Dict[str, str]
    body: Any


class FakeRemote:
    """tools/call: `find` echoes its arguments; `call` answers 401 without a key (as the API does),
    else echoes, with isError for capability "x.fails"; `drop` (or a call of "x.drop") closes the
    connection without an answer; any other name is a JSON-RPC error."""

    def __init__(self) -> None:
        self.seen: List[Seen] = []
        remote = self

        class _H(BaseHTTPRequestHandler):
            def log_message(self, *args: Any) -> None:  # quiet
                pass

            def do_GET(self) -> None:  # noqa: N802 - the server keeps no streams, like the API
                self._send(405, {"jsonrpc": "2.0", "error": {"code": -32000, "message": "Method not allowed."}, "id": None})

            do_DELETE = do_GET  # noqa: N815

            def do_POST(self) -> None:  # noqa: N802
                raw = self.rfile.read(int(self.headers.get("content-length") or 0))
                body = json.loads(raw)
                headers = {k.lower(): v for k, v in self.headers.items()}
                remote.seen.append(Seen(headers, body))
                answer = remote.answer(headers, body)
                if answer is None:
                    self._send(202, None)
                elif answer == "drop":
                    self.close_connection = True
                    self.connection.shutdown(2)
                else:
                    status, payload, extra = answer
                    self._send(status, payload, extra)

            def _send(self, status: int, payload: Any, extra: Optional[Dict[str, str]] = None) -> None:
                data = b"" if payload is None else json.dumps(payload).encode()
                self.send_response(status)
                if payload is not None:
                    self.send_header("content-type", "application/json")
                for name, value in (extra or {}).items():
                    self.send_header(name, value)
                self.send_header("content-length", str(len(data)))
                self.end_headers()
                self.wfile.write(data)

        self._server = ThreadingHTTPServer(("127.0.0.1", 0), _H)
        self._thread = threading.Thread(target=self._server.serve_forever, daemon=True)
        self._thread.start()

    @property
    def url(self) -> str:
        return f"http://127.0.0.1:{self._server.server_address[1]}/mcp"

    def close(self) -> None:
        self._server.shutdown()
        self._server.server_close()

    def calls(self) -> List[Seen]:
        """The tools/call requests seen so far."""
        return [s for s in self.seen if isinstance(s.body, dict) and s.body.get("method") == "tools/call"]

    def answer(self, headers: Dict[str, str], body: Any) -> Any:
        method, rid, params = body.get("method"), body.get("id"), body.get("params") or {}
        ok = lambda result: (200, {"jsonrpc": "2.0", "id": rid, "result": result}, {})  # noqa: E731
        if rid is None:
            return None  # a notification
        if method == "initialize":
            result = {"protocolVersion": params.get("protocolVersion"), "capabilities": {"tools": {}},
                      "serverInfo": {"name": "okdata", "version": "rev-test"}, "instructions": INSTRUCTIONS}
            return 200, {"jsonrpc": "2.0", "id": rid, "result": result}, {"mcp-session-id": "ok1.test"}
        if method == "tools/list":
            return ok({"tools": TOOLS})
        if method != "tools/call":
            return 200, {"jsonrpc": "2.0", "id": rid, "error": {"code": -32601, "message": "Method not found"}}, {}
        name, args = params.get("name"), params.get("arguments") or {}
        if name == "drop":
            return "drop"
        if name == "call" and "authorization" not in headers:
            error = {"code": -32600, "message": "call needs a credential: sign in through OAuth, or send an API key as Authorization: Bearer okd_..."}
            return 401, {"jsonrpc": "2.0", "id": rid, "error": error}, {"www-authenticate": 'Bearer resource_metadata="x", scope="mcp"'}
        if args.get("capability") == "x.drop":
            return "drop"
        if name in ("find", "call"):
            text = f"{name} {json.dumps(args, sort_keys=True)}"
            return ok({"content": [{"type": "text", "text": text}], **({"isError": True} if args.get("capability") == "x.fails" else {})})
        return 200, {"jsonrpc": "2.0", "id": rid, "error": {"code": -32602, "message": f"Tool {name} not found. Tools: find, call."}}, {}

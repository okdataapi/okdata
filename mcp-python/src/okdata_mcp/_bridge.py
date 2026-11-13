"""The bridge: an MCP server on stdio whose tools are the remote okdata server's tools. tools/list and
tools/call go to the remote server as they are, with the key in Authorization; the server's name,
version and instructions are the remote's. The remote server has no prompts or resources.

A tool call always answers with a tool result: a failure becomes text with isError, written for the
agent (the remote's own error text, how to add a key, or how to resend a lost paid call safely). A
`call` without an idempotency_key gets one, so an answer lost on the way can be fetched again without
paying twice."""
from __future__ import annotations

import uuid
from contextlib import AsyncExitStack, asynccontextmanager
from typing import Any, AsyncIterator, Dict, Mapping, Optional

import httpx2
from mcp import Client, types
from mcp.client.streamable_http import streamable_http_client
from mcp.server.context import ServerRequestContext
from mcp.server.lowlevel import Server
from mcp.server.stdio import stdio_server
from mcp.shared.exceptions import MCPError

from ._config import KEYS_URL, Settings, remote_headers
from ._version import __version__

CALL_TIMEOUT = 180.0
"""Seconds a tool call may take: the remote may try more than one data source before it answers."""
CONNECT_TIMEOUT = 30.0
NO_ANSWER = -32050
"""The JSON-RPC error code this bridge gives a request the remote server did not answer."""


class ConnectError(Exception):
    """The remote server could not be reached at start."""


def why(exc: BaseException) -> str:
    """Why a request got no usable answer, in a few words (the first error of a group)."""
    while getattr(exc, "exceptions", None):
        exc = exc.exceptions[0]  # type: ignore[attr-defined]
    if isinstance(exc, MCPError):
        return "no answer in time" if exc.code == types.REQUEST_TIMEOUT else exc.message
    return str(exc) or type(exc).__name__


class _AlwaysAnswer(httpx2.AsyncBaseTransport):
    """Gives the MCP client an answer for every request it sends. A request the remote did not answer
    (refused, dropped, timed out), or answered at an error status with something other than JSON, comes
    back as a JSON-RPC error with code NO_ANSWER and fails alone: as an exception it would close the MCP
    client's connection for every later call. JSON bodies are read here, so a connection lost halfway
    through one is caught too."""

    def __init__(self, inner: httpx2.AsyncBaseTransport) -> None:
        self._inner = inner

    async def handle_async_request(self, request: httpx2.Request) -> httpx2.Response:
        try:
            response = await self._inner.handle_async_request(request)
            if not response.headers.get("content-type", "").startswith("application/json"):
                if response.status_code < 400:
                    return response  # 202 Accepted, or a stream
                await response.aclose()
                return _no_answer(request, f"HTTP {response.status_code}")
            try:
                body = b"".join([chunk async for chunk in response.aiter_raw()])
            finally:
                await response.aclose()
            return httpx2.Response(response.status_code, headers=response.headers, content=body, request=request)
        except httpx2.TransportError as exc:
            return _no_answer(request, str(exc) or type(exc).__name__)

    async def aclose(self) -> None:
        await self._inner.aclose()


def _no_answer(request: httpx2.Request, reason: str) -> httpx2.Response:
    error = {"jsonrpc": "2.0", "id": None, "error": {"code": NO_ANSWER, "message": reason}}
    return httpx2.Response(502, json=error, request=request)


@asynccontextmanager
async def connect_remote(settings: Settings) -> AsyncIterator[Client]:
    """Connects to the remote server (initialize); raises ConnectError when it cannot be reached."""
    http = httpx2.AsyncClient(
        headers=remote_headers(settings),
        timeout=httpx2.Timeout(CONNECT_TIMEOUT, read=CALL_TIMEOUT),
        transport=_AlwaysAnswer(httpx2.AsyncHTTPTransport()),
    )
    client = Client(
        streamable_http_client(settings.url, http_client=http, terminate_on_close=False),
        mode="legacy",  # the remote speaks the initialize handshake
        cache=None,
        client_info=types.Implementation(name="okdata-mcp", version=__version__),
        read_timeout_seconds=CALL_TIMEOUT + 10,
    )
    async with http, AsyncExitStack() as stack:
        try:
            remote = await stack.enter_async_context(client)
        except Exception as exc:
            raise ConnectError(f"could not reach {settings.url}: {why(exc)}") from exc
        yield remote


def key_needed(tool: str) -> str:
    """The answer when the remote refuses a tool for want of a key and the bridge has none."""
    return (
        f"{tool} needs an okdata API key, and okdata-mcp was started without one: nothing was charged. "
        f'Add OKDATA_API_KEY to the "env" of the okdata server in your MCP client\'s config (make a key at {KEYS_URL}), '
        "then restart the client. find, describe and account status work without a key."
    )


def no_answer(settings: Settings, tool: str, args: Mapping[str, Any], reason: str) -> str:
    """The answer when a tool call got no usable answer: a paid call may still have run."""
    head = f"okdata-mcp got no usable answer from {settings.url} ({reason})."
    if tool != "call":
        return f"{head} {tool} is free: try again."
    return (
        f"{head} The call may have run and been charged. To get its result without paying twice, "
        f'send the same call again with idempotency_key "{args.get("idempotency_key")}".'
    )


def with_idempotency_key(tool: str, args: Optional[Mapping[str, Any]]) -> Dict[str, Any]:
    """call's arguments with an idempotency_key: the caller's own, or a new one."""
    given = dict(args or {})
    if tool == "call" and "idempotency_key" not in given:
        return {**given, "idempotency_key": f"okdata-mcp-{uuid.uuid4()}"}
    return given


def _tool_error(text: str) -> types.CallToolResult:
    return types.CallToolResult(content=[types.TextContent(type="text", text=text)], is_error=True)


async def forward_call(remote: Client, settings: Settings, tool: str, arguments: Optional[Mapping[str, Any]]) -> types.CallToolResult:
    args = with_idempotency_key(tool, arguments)
    try:
        return await remote.call_tool(tool, args, read_timeout_seconds=CALL_TIMEOUT + 10)
    except MCPError as err:
        if err.code in (NO_ANSWER, types.REQUEST_TIMEOUT):
            return _tool_error(no_answer(settings, tool, args, why(err)))
        if err.code == types.INVALID_REQUEST and not settings.api_key:
            return _tool_error(key_needed(tool))  # the remote answers HTTP 401 with this code
        return _tool_error(err.message)  # a JSON-RPC error the remote answered: its own words
    except Exception as exc:  # a malformed answer: the call may have run
        return _tool_error(no_answer(settings, tool, args, why(exc)))


def build_server(remote: Client, settings: Settings) -> Server[Any]:
    """The local server: the remote's identity and instructions, its tools forwarded."""

    async def list_tools(ctx: ServerRequestContext[Any], params: Optional[types.PaginatedRequestParams]) -> types.ListToolsResult:
        try:
            return await remote.list_tools(cursor=params.cursor if params else None)
        except Exception as exc:
            raise MCPError(types.INTERNAL_ERROR, f"okdata-mcp could not list the tools of {settings.url}: {why(exc)}") from exc

    async def call_tool(ctx: ServerRequestContext[Any], params: types.CallToolRequestParams) -> types.CallToolResult:
        return await forward_call(remote, settings, params.name, params.arguments)

    info = remote.server_info
    return Server(
        info.name if info else "okdata",
        version=info.version if info else __version__,
        title=info.title if info else None,
        website_url=info.website_url if info else None,
        instructions=remote.instructions,
        on_list_tools=list_tools,
        on_call_tool=call_tool,
    )


async def serve(settings: Settings) -> None:
    """Connects to the remote server, then serves MCP on stdin and stdout until stdin closes."""
    async with connect_remote(settings) as remote:
        server = build_server(remote, settings)
        async with stdio_server() as (read_stream, write_stream):
            await server.run(read_stream, write_stream, server.create_initialization_options())

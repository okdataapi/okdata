"""Opt-in smoke test against the live server: OKDATA_MCP_LIVE=1 pytest. It runs `python -m okdata_mcp`
over stdio with no key and uses only the free tools (find, describe, account status); it never calls
`call`, so nothing is ever charged."""
from __future__ import annotations

import os
import sys

import pytest
from mcp import Client, StdioServerParameters, types

pytestmark = [pytest.mark.anyio, pytest.mark.skipif(not os.environ.get("OKDATA_MCP_LIVE"), reason="set OKDATA_MCP_LIVE=1 to run the live smoke test")]


@pytest.fixture
def anyio_backend() -> str:
    return "asyncio"


def text(result: types.CallToolResult) -> str:
    block = result.content[0]
    assert isinstance(block, types.TextContent)
    return block.text


async def test_live_free_tools_over_stdio() -> None:
    env = {"PYTHONPATH": os.pathsep.join(sys.path)}
    if os.environ.get("OKDATA_LIVE_MCP_URL"):
        env["OKDATA_MCP_URL"] = os.environ["OKDATA_LIVE_MCP_URL"]
    params = StdioServerParameters(command=sys.executable, args=["-m", "okdata_mcp"], env=env)  # no OKDATA_API_KEY
    async with Client(params, mode="legacy", cache=None) as client:
        assert client.server_info is not None and client.server_info.name == "okdata"
        assert "find" in (client.instructions or "")
        names = [t.name for t in (await client.list_tools()).tools]
        assert {"find", "describe", "call", "account"} <= set(names)
        found = await client.call_tool("find", {"query": "小红书 笔记 评论"})
        assert not found.is_error and "xiaohongshu." in text(found)
        described = await client.call_tool("describe", {"ids": ["weibo.trends.list"]})
        assert not described.is_error and "weibo.trends.list" in text(described)
        status = await client.call_tool("account", {"what": "status"})
        assert not status.is_error, text(status)

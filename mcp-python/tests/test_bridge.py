"""The bridge against a fake remote server: what it forwards, what it adds (key, user agent, X-Entry,
an idempotency_key for call) and how failures reach the agent."""
from __future__ import annotations

import os
import re
import sys
from contextlib import asynccontextmanager
from typing import Any, AsyncIterator

import pytest
from mcp import Client, StdioServerParameters, types

from okdata_mcp import ConnectError, __version__, build_server, connect_remote, settings_from_env

from .fake_remote import INSTRUCTIONS, TOOLS, FakeRemote

KEY = "okd_bridge_test_0123456789"
pytestmark = pytest.mark.anyio


@asynccontextmanager
async def bridged(fake: FakeRemote, **env: str) -> AsyncIterator[Client]:
    """An MCP client talking to the bridge in memory, the bridge talking to the fake remote over HTTP."""
    settings = settings_from_env({"OKDATA_MCP_URL": fake.url, **env})
    async with connect_remote(settings) as remote:
        async with Client(build_server(remote, settings), mode="legacy", cache=None) as client:
            yield client


def text(result: types.CallToolResult) -> str:
    block = result.content[0]
    assert isinstance(block, types.TextContent)
    return block.text


def args_of(seen: Any) -> Any:
    return seen.body["params"]["arguments"]


async def test_forwards_the_tool_list_the_server_identity_and_its_instructions(fake: FakeRemote) -> None:
    async with bridged(fake, OKDATA_API_KEY=KEY) as client:
        assert client.server_info is not None
        assert (client.server_info.name, client.server_info.version) == ("okdata", "rev-test")
        assert client.instructions == INSTRUCTIONS
        listed = await client.list_tools()
        assert [t.model_dump(by_alias=True, exclude_none=True) for t in listed.tools] == TOOLS


async def test_sends_the_key_its_user_agent_and_x_entry(fake: FakeRemote) -> None:
    async with bridged(fake, OKDATA_API_KEY=KEY) as client:
        await client.call_tool("find", {"query": "小红书 评论"})
    init = next(s for s in fake.seen if s.body.get("method") == "initialize")
    assert init.body["params"]["clientInfo"] == {"name": "okdata-mcp", "version": __version__}
    posts = [s for s in fake.seen]
    assert posts
    for seen in posts:
        assert seen.headers["authorization"] == f"Bearer {KEY}"
        assert re.match(rf"^okdata-mcp/{re.escape(__version__)} python/", seen.headers["user-agent"])
        assert seen.headers["x-entry"] == "mcp-stdio"
    assert fake.calls()[0].headers["mcp-session-id"] == "ok1.test"


async def test_forwards_a_call_as_it_is_adding_an_idempotency_key_only_when_it_has_none(fake: FakeRemote) -> None:
    async with bridged(fake, OKDATA_API_KEY=KEY) as client:
        found = await client.call_tool("find", {"query": "x"})
        assert not found.is_error and text(found) == 'find {"query": "x"}'
        await client.call_tool("call", {"capability": "weibo.trends.list"})
        await client.call_tool("call", {"capability": "weibo.trends.list", "idempotency_key": "mine-1"})
    first, second = (args_of(s) for s in fake.calls()[1:])
    assert re.fullmatch(r"okdata-mcp-[0-9a-f-]{36}", first.pop("idempotency_key"))
    assert first == {"capability": "weibo.trends.list"}
    assert second == {"capability": "weibo.trends.list", "idempotency_key": "mine-1"}
    assert args_of(fake.calls()[0]) == {"query": "x"}  # only call gets one


async def test_without_a_key_free_tools_work_and_a_paid_tool_says_how_to_add_one(fake: FakeRemote) -> None:
    async with bridged(fake) as client:
        assert text(await client.call_tool("find", {"query": "x"})) == 'find {"query": "x"}'
        paid = await client.call_tool("call", {"capability": "douyin.videos.search", "query": "x"})
    assert paid.is_error
    assert "call needs an okdata API key" in text(paid)
    assert "OKDATA_API_KEY" in text(paid) and "https://okdata.online/console/" in text(paid)
    assert all("authorization" not in s.headers for s in fake.seen)


async def test_passes_is_error_on_and_turns_json_rpc_errors_into_tool_errors(fake: FakeRemote) -> None:
    async with bridged(fake, OKDATA_API_KEY=KEY) as client:
        failed = await client.call_tool("call", {"capability": "x.fails"})
        assert failed.is_error and text(failed).startswith('call {"capability": "x.fails"')
        unknown = await client.call_tool("nope", {})
        assert unknown.is_error and text(unknown) == "Tool nope not found. Tools: find, call."


async def test_a_lost_answer_says_what_to_do_and_the_bridge_keeps_working(fake: FakeRemote) -> None:
    async with bridged(fake, OKDATA_API_KEY=KEY) as client:
        lost = await client.call_tool("drop", {})
        assert lost.is_error
        assert re.fullmatch(r"okdata-mcp got no usable answer from http://127\.0\.0\.1:\d+/mcp \(.+\)\. drop is free: try again\.", text(lost))

        paid = await client.call_tool("call", {"capability": "x.drop"})
        sent = args_of(fake.calls()[-1])["idempotency_key"]
        assert paid.is_error
        assert "The call may have run and been charged" in text(paid)
        assert f'send the same call again with idempotency_key "{sent}"' in text(paid)

        assert text(await client.call_tool("find", {"query": "after"})) == 'find {"query": "after"}'


async def test_fails_to_start_with_the_address_when_the_remote_cannot_be_reached() -> None:
    settings = settings_from_env({"OKDATA_MCP_URL": "http://127.0.0.1:9/mcp"})
    with pytest.raises(ConnectError, match=r"^could not reach http://127\.0\.0\.1:9/mcp: "):
        async with connect_remote(settings):
            pass


async def test_serves_mcp_on_stdio_as_python_m_okdata_mcp(fake: FakeRemote) -> None:
    env = {"OKDATA_MCP_URL": fake.url, "OKDATA_API_KEY": KEY, "PYTHONPATH": os.pathsep.join(sys.path)}
    params = StdioServerParameters(command=sys.executable, args=["-m", "okdata_mcp"], env=env)
    async with Client(params, mode="legacy", cache=None) as client:
        assert client.server_info is not None and client.server_info.name == "okdata"
        assert [t.name for t in (await client.list_tools()).tools] == ["find", "call"]
        assert text(await client.call_tool("find", {"query": "stdio"})) == 'find {"query": "stdio"}'

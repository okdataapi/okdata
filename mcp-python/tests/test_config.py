from __future__ import annotations

import platform
import re
from importlib import metadata

import pytest

from okdata_mcp import DEFAULT_MCP_URL, ConfigError, __version__, remote_headers, settings_from_env
from okdata_mcp.__main__ import main
from okdata_mcp._config import ENTRY


def test_uses_the_hosted_server_and_no_key_by_default() -> None:
    settings = settings_from_env({})
    assert (settings.url, settings.api_key) == (DEFAULT_MCP_URL, None)
    assert settings_from_env({"OKDATA_API_KEY": "  "}).api_key is None
    assert "okd_" not in repr(settings_from_env({"OKDATA_API_KEY": "okd_secret"}))


def test_takes_okdata_mcp_url_else_okdata_base_url_plus_mcp() -> None:
    assert settings_from_env({"OKDATA_BASE_URL": "http://127.0.0.1:8787/"}).url == "http://127.0.0.1:8787/mcp"
    both = {"OKDATA_BASE_URL": "http://127.0.0.1:8787", "OKDATA_MCP_URL": "https://example.test/x/mcp"}
    assert settings_from_env(both).url == "https://example.test/x/mcp"


def test_refuses_an_address_that_is_not_an_http_url() -> None:
    with pytest.raises(ConfigError):
        settings_from_env({"OKDATA_MCP_URL": "api.okdata.online/mcp"})
    with pytest.raises(ConfigError, match="http"):
        settings_from_env({"OKDATA_MCP_URL": "ftp://api.okdata.online/mcp"})


def test_sends_the_key_only_when_there_is_one_with_its_user_agent_and_an_x_entry_the_api_accepts() -> None:
    assert remote_headers(settings_from_env({"OKDATA_API_KEY": " okd_abc "}))["authorization"] == "Bearer okd_abc"
    headers = remote_headers(settings_from_env({}))
    assert "authorization" not in headers
    assert headers["user-agent"] == f"okdata-mcp/{__version__} python/{platform.python_version()}"
    # The API refuses the whole request when X-Entry does not match this.
    assert headers["x-entry"] == ENTRY and re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9_.-]{0,31}", ENTRY)


def test_command_line(capsys: pytest.CaptureFixture[str]) -> None:
    assert main(["--version"]) == 0 and capsys.readouterr().out == f"{__version__}\n"
    assert main(["--help"]) == 0 and "OKDATA_API_KEY" in capsys.readouterr().out
    assert main(["serve"]) == 2 and "unknown argument 'serve'" in capsys.readouterr().err


def test_versions_agree() -> None:
    assert metadata.version("okdata-mcp") == __version__

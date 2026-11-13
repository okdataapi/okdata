"""Settings, from the environment only: the key (OKDATA_API_KEY, optional: find, describe and account
status work without one) and where the remote server is (OKDATA_MCP_URL, else OKDATA_BASE_URL plus
/mcp, else the hosted server). The key is never printed."""
from __future__ import annotations

import platform
from dataclasses import dataclass, field
from typing import Dict, Mapping, Optional
from urllib.parse import urlsplit

from ._version import __version__

DEFAULT_MCP_URL = "https://api.okdata.online/mcp"
KEYS_URL = "https://okdata.online/console/?src=okdata-mcp"
"""Where a key is made; shown when a tool needs one."""
ENTRY = "mcp-stdio"
"""Read by the API as a usage label (1 to 32 of [A-Za-z0-9_.-], or it refuses the request); on /mcp
the client name from initialize ("okdata-mcp") is what a call records, so this one is informational."""


class ConfigError(ValueError):
    pass


@dataclass(frozen=True)
class Settings:
    url: str
    api_key: Optional[str] = field(default=None, repr=False)  # never in a repr, a log line or a traceback


def settings_from_env(env: Mapping[str, str]) -> Settings:
    def value(name: str) -> str:
        return (env.get(name) or "").strip()

    base = value("OKDATA_BASE_URL").rstrip("/")
    url = value("OKDATA_MCP_URL") or (f"{base}/mcp" if base else DEFAULT_MCP_URL)
    parts = urlsplit(url)
    if parts.scheme not in ("http", "https") or not parts.netloc:
        raise ConfigError(f"{url!r} is not an http(s) URL; set OKDATA_MCP_URL to the MCP server's address, e.g. {DEFAULT_MCP_URL}")
    return Settings(url=url, api_key=value("OKDATA_API_KEY") or None)


def remote_headers(settings: Settings) -> Dict[str, str]:
    """The headers every request to the remote server carries."""
    headers = {"user-agent": f"okdata-mcp/{__version__} python/{platform.python_version()}", "x-entry": ENTRY}
    if settings.api_key:
        headers["authorization"] = f"Bearer {settings.api_key}"
    return headers

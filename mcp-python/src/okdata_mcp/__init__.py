"""okdata-mcp: the okdata MCP server on stdio. It forwards every request to the hosted server at
https://api.okdata.online/mcp, so MCP clients that only start local servers can use okdata."""
from ._bridge import ConnectError, build_server, connect_remote, forward_call, serve
from ._config import DEFAULT_MCP_URL, ConfigError, Settings, remote_headers, settings_from_env
from ._version import __version__

__all__ = [
    "DEFAULT_MCP_URL",
    "ConfigError",
    "ConnectError",
    "Settings",
    "__version__",
    "build_server",
    "connect_remote",
    "forward_call",
    "remote_headers",
    "serve",
    "settings_from_env",
]

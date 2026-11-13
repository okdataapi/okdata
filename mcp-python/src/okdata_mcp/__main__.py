"""okdata-mcp: the okdata MCP server on stdio, for MCP clients that start local servers. Settings come
from the environment (_config.py). stdout carries MCP messages only; anything else goes to stderr.
`python -m okdata_mcp` is the same command."""
from __future__ import annotations

import os
import sys
from typing import Optional, Sequence

import anyio

from ._bridge import ConnectError, serve, why
from ._config import DEFAULT_MCP_URL, ConfigError, settings_from_env
from ._version import __version__

HELP = f"""okdata-mcp {__version__}: the okdata MCP server on stdio (social data for AI agents, paid per call).
Your MCP client starts it; it forwards every request to {DEFAULT_MCP_URL}.

  OKDATA_API_KEY   your key (okd_...); find, describe and account status work without one
  OKDATA_MCP_URL   another MCP server address (or OKDATA_BASE_URL: the API base, /mcp is added)

Claude Desktop, in claude_desktop_config.json:
  {{ "mcpServers": {{ "okdata": {{ "command": "uvx", "args": ["okdata-mcp"], "env": {{ "OKDATA_API_KEY": "okd_..." }} }} }} }}

Docs: https://okdata.online/mcp/
"""


def main(argv: Optional[Sequence[str]] = None) -> int:
    args = list(sys.argv[1:] if argv is None else argv)
    if args[:1] in (["--version"], ["-v"]):
        print(__version__)
        return 0
    if args[:1] in (["--help"], ["-h"]):
        print(HELP, end="")
        return 0
    if args:
        print(f"okdata-mcp: unknown argument {args[0]!r}; it is set up through environment variables (okdata-mcp --help)", file=sys.stderr)
        return 2
    try:
        settings = settings_from_env(os.environ)
    except ConfigError as err:
        print(f"okdata-mcp: {err}", file=sys.stderr)
        return 2
    try:
        anyio.run(serve, settings)
    except ConnectError as err:
        print(f"okdata-mcp: {err}", file=sys.stderr)
        return 1
    except KeyboardInterrupt:
        return 130
    except Exception as exc:  # noqa: BLE001 - one line on stderr, not a traceback on the client's log
        print(f"okdata-mcp: stopped: {why(exc)}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())

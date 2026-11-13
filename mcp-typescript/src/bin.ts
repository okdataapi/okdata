#!/usr/bin/env node
// okdata-mcp: the okdata MCP server on stdio, for MCP clients that start local servers. Settings come
// from the environment (src/config.ts). stdout carries MCP messages only; anything else goes to stderr.
import { serve } from './bridge.js';
import { ConfigError, configFromEnv, DEFAULT_MCP_URL } from './config.js';
import { VERSION } from './version.js';

const HELP = `okdata-mcp ${VERSION}: the okdata MCP server on stdio (social data for AI agents, paid per call).
Your MCP client starts it; it forwards every request to ${DEFAULT_MCP_URL}.

  OKDATA_API_KEY   your key (okd_...); find, describe and account status work without one
  OKDATA_MCP_URL   another MCP server address (or OKDATA_BASE_URL: the API base, /mcp is added)

Claude Desktop, in claude_desktop_config.json:
  { "mcpServers": { "okdata": { "command": "npx", "args": ["-y", "@okdata/mcp"], "env": { "OKDATA_API_KEY": "okd_..." } } } }

Docs: https://okdata.online/mcp/
`;

async function main(argv: readonly string[]): Promise<number> {
  const [first] = argv;
  if (first === '--version' || first === '-v') {
    process.stdout.write(`${VERSION}\n`);
    return 0;
  }
  if (first === '--help' || first === '-h') {
    process.stdout.write(HELP);
    return 0;
  }
  if (first !== undefined) {
    process.stderr.write(`okdata-mcp: unknown argument ${JSON.stringify(first)}; it is set up through environment variables (okdata-mcp --help)\n`);
    return 2;
  }
  try {
    const bridge = await serve(configFromEnv(process.env));
    // The client closed our stdin: it is done with this server.
    process.stdin.once('end', () => void bridge.close().finally(() => process.exit(0)));
    return 0;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`okdata-mcp: ${message}\n`);
    return err instanceof ConfigError ? 2 : 1;
  }
}

process.exitCode = await main(process.argv.slice(2));

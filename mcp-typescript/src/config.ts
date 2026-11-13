// Settings, from the environment only: the key (OKDATA_API_KEY, optional: find, describe and account
// status work without one) and where the remote server is (OKDATA_MCP_URL, else OKDATA_BASE_URL plus
// /mcp, else the hosted server). The key is never printed.
import { VERSION } from './version.js';

export const DEFAULT_MCP_URL = 'https://api.okdata.online/mcp';
/** Where a key is made; shown when a tool needs one. */
export const KEYS_URL = 'https://okdata.online/console/?src=okdata-mcp';
/**
 * Read by the API as a usage label (1 to 32 of [A-Za-z0-9_.-], or it refuses the request); on /mcp
 * the client name from initialize ("okdata-mcp") is what a call records, so this one is informational.
 */
export const ENTRY = 'mcp-stdio';

export interface BridgeConfig {
  readonly url: URL;
  readonly apiKey: string | null;
}

export class ConfigError extends Error {}

type Env = Readonly<Record<string, string | undefined>>;

const value = (env: Env, name: string): string => env[name]?.trim() ?? '';

export function configFromEnv(env: Env): BridgeConfig {
  const base = value(env, 'OKDATA_BASE_URL').replace(/\/+$/, '');
  const raw = value(env, 'OKDATA_MCP_URL') || (base ? `${base}/mcp` : DEFAULT_MCP_URL);
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new ConfigError(`${JSON.stringify(raw)} is not a URL; set OKDATA_MCP_URL to the MCP server's address, e.g. ${DEFAULT_MCP_URL}`);
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') throw new ConfigError(`the MCP server address must be http or https, not ${url.protocol}`);
  return { url, apiKey: value(env, 'OKDATA_API_KEY') || null };
}

/** The headers every request to the remote server carries. */
export function remoteHeaders(config: BridgeConfig): Record<string, string> {
  return {
    'User-Agent': `okdata-mcp/${VERSION} node/${process.versions.node}`,
    'X-Entry': ENTRY,
    ...(config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {}),
  };
}

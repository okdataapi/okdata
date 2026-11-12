// The MCP entry each client needs, and how to merge it into the client's own config file. The
// entries match the console's Connect page: the key stays in OKDATA_API_KEY and the files hold only
// a reference to it, unless --write-key asks to store the saved key itself.
import { join } from 'node:path';
import { UsageError } from './exit.js';

export const CLIENTS = ['claude-code', 'cursor', 'codex'] as const;
export type ClientId = (typeof CLIENTS)[number];

export const SERVER_NAME = 'okdata';
export const ENV_VAR = 'OKDATA_API_KEY';

export interface ClientPlan {
  client: ClientId;
  file: string;
  /** What goes into the file (JSON entry or TOML table), for showing. */
  entry: string;
  /** The equivalent command the client's own CLI takes, when it has one. */
  command?: string;
  /** The new file text from the old one (null: no file yet). */
  merge(existing: string | null): string;
}

const auth = (key: string | null, ref: string): string => `Bearer ${key ?? ref}`;

function mergeJson(file: string, existing: string | null, entry: Record<string, unknown>): string {
  let doc: Record<string, unknown> = {};
  if (existing !== null && existing.trim() !== '') {
    let parsed: unknown;
    try {
      parsed = JSON.parse(existing);
    } catch {
      throw new UsageError(`${file} is not valid JSON, so it was left alone; fix it, or use --print and add the entry by hand`);
    }
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new UsageError(`${file} does not hold a JSON object; left alone`);
    doc = parsed as Record<string, unknown>;
  }
  const servers = doc.mcpServers && typeof doc.mcpServers === 'object' && !Array.isArray(doc.mcpServers) ? (doc.mcpServers as Record<string, unknown>) : {};
  return `${JSON.stringify({ ...doc, mcpServers: { ...servers, [SERVER_NAME]: entry } }, null, 2)}\n`;
}

const TABLE = new RegExp(`^\\s*\\[\\s*mcp_servers\\s*\\.\\s*(?:${SERVER_NAME}|"${SERVER_NAME}")\\s*[\\].]`);
const ANY_TABLE = /^\s*\[/;

/** Drops [mcp_servers.okdata] (and its sub-tables) from a TOML file and appends the new table. */
export function mergeToml(existing: string | null, table: string): string {
  const kept: string[] = [];
  let inOurs = false;
  for (const line of (existing ?? '').split('\n')) {
    if (ANY_TABLE.test(line)) inOurs = TABLE.test(line);
    if (!inOurs) kept.push(line);
  }
  const head = kept.join('\n').replace(/\s+$/, '');
  return `${head ? `${head}\n\n` : ''}${table}\n`;
}

export function planFor(client: ClientId, home: string, mcpUrl: string, key: string | null): ClientPlan {
  switch (client) {
    case 'claude-code': {
      const file = join(home, '.claude.json');
      const entry = { type: 'http', url: mcpUrl, headers: { Authorization: auth(key, `\${${ENV_VAR}}`) } };
      return {
        client, file, entry: JSON.stringify({ mcpServers: { [SERVER_NAME]: entry } }, null, 2),
        command: `claude mcp add --transport http --scope user ${SERVER_NAME} ${mcpUrl} --header 'Authorization: Bearer \${${ENV_VAR}}'`,
        merge: (existing) => mergeJson(file, existing, entry),
      };
    }
    case 'cursor': {
      const file = join(home, '.cursor', 'mcp.json');
      const entry = { url: mcpUrl, headers: { Authorization: auth(key, `\${env:${ENV_VAR}}`) } };
      return { client, file, entry: JSON.stringify({ mcpServers: { [SERVER_NAME]: entry } }, null, 2), merge: (existing) => mergeJson(file, existing, entry) };
    }
    case 'codex': {
      const file = join(home, '.codex', 'config.toml');
      const table = [
        `[mcp_servers.${SERVER_NAME}]`,
        `url = "${mcpUrl}"`,
        key ? `http_headers = { "Authorization" = "Bearer ${key}" }` : `bearer_token_env_var = "${ENV_VAR}"`,
      ].join('\n');
      return {
        client, file, entry: table,
        command: key ? undefined : `codex mcp add ${SERVER_NAME} --url ${mcpUrl} --bearer-token-env-var ${ENV_VAR}`,
        merge: (existing) => mergeToml(existing, table),
      };
    }
  }
}

/** "claude-code,cursor" → ['claude-code', 'cursor']; unknown names are a usage error. */
export function parseClients(value: string | undefined): ClientId[] {
  if (!value) throw new UsageError(`setup needs --client ${CLIENTS.join('|')} (several: --client claude-code,cursor)`);
  const names = value.split(',').map((s) => s.trim()).filter(Boolean);
  const bad = names.filter((n) => !(CLIENTS as readonly string[]).includes(n));
  if (bad.length || names.length === 0) throw new UsageError(`unknown client ${bad.join(', ')}; one of ${CLIENTS.join(', ')}`);
  return [...new Set(names)] as ClientId[];
}

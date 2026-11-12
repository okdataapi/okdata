// Where the CLI keeps its state: the OS config directory (OKDATA_CONFIG_DIR overrides). The key file
// is written 0600 in a 0700 directory and its key is never printed.
import { chmodSync, mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { DEFAULT_BASE_URL } from '@okdata/sdk';
import { UsageError } from './exit.js';
import type { Io } from './io.js';

export interface SavedConfig {
  api_key?: string;
  key_id?: string;
  key_name?: string;
  /** Set only when login ran against another API than the default. */
  base_url?: string;
  saved_at?: string;
}

/** macOS: ~/Library/Application Support/okdata; Windows: %APPDATA%\okdata; else $XDG_CONFIG_HOME/okdata. */
export function configDir(io: Pick<Io, 'env' | 'platform' | 'home'>): string {
  const { env, platform, home } = io;
  if (env.OKDATA_CONFIG_DIR) return env.OKDATA_CONFIG_DIR;
  if (platform === 'win32') return join(env.APPDATA || join(home, 'AppData', 'Roaming'), 'okdata');
  if (env.XDG_CONFIG_HOME) return join(env.XDG_CONFIG_HOME, 'okdata');
  if (platform === 'darwin') return join(home, 'Library', 'Application Support', 'okdata');
  return join(home, '.config', 'okdata');
}

export const configPath = (io: Pick<Io, 'env' | 'platform' | 'home'>): string => join(configDir(io), 'config.json');

function readJson(path: string): Record<string, unknown> | null {
  let text: string;
  try {
    text = readFileSync(path, 'utf8');
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw err;
  }
  const parsed: unknown = JSON.parse(text);
  return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : null;
}

export function readConfig(io: Pick<Io, 'env' | 'platform' | 'home'>): SavedConfig {
  const path = configPath(io);
  try {
    return (readJson(path) ?? {}) as SavedConfig;
  } catch (err) {
    throw new UsageError(`${path} cannot be read (${err instanceof Error ? err.message : String(err)}); run \`okdata login\` to write a new one`);
  }
}

/** Writes a file readable by its owner only, atomically (temp file + rename). */
export function writePrivate(path: string, text: string, dir: string): void {
  mkdirSync(dir, { recursive: true, mode: 0o700 });
  const tmp = `${path}.${process.pid}.tmp`;
  writeFileSync(tmp, text, { mode: 0o600 });
  chmodSync(tmp, 0o600);
  renameSync(tmp, path);
}

export function saveConfig(io: Pick<Io, 'env' | 'platform' | 'home'>, config: SavedConfig): string {
  const dir = configDir(io);
  const path = configPath(io);
  let previous: SavedConfig = {};
  try {
    previous = readConfig(io);
  } catch {
    previous = {}; // unreadable: replaced by this one
  }
  const merged = { ...previous, ...config, saved_at: new Date().toISOString() };
  writePrivate(path, `${JSON.stringify(merged, null, 2)}\n`, dir);
  return path;
}

/** The file mode of a path, or null when it does not exist. */
export function modeOf(path: string): number | null {
  try {
    return statSync(path).mode & 0o777;
  } catch {
    return null;
  }
}

export interface Credentials {
  apiKey: string | undefined;
  baseUrl: string;
  /** Where the key came from, for messages (never the key itself). */
  keySource: 'env' | 'config' | null;
  /** Why the saved config could not be read, when it could not (login writes a fresh one). */
  configProblem: string | null;
}

/** Key: OKDATA_API_KEY, else the saved one. Base URL: --base-url, OKDATA_BASE_URL, the saved one, the default. */
export function credentials(io: Pick<Io, 'env' | 'platform' | 'home'>, baseUrlFlag: string | undefined): Credentials {
  let saved: SavedConfig = {};
  let configProblem: string | null = null;
  try {
    saved = readConfig(io);
  } catch (err) {
    configProblem = err instanceof Error ? err.message : String(err);
  }
  const envKey = io.env.OKDATA_API_KEY?.trim();
  const apiKey = envKey || saved.api_key;
  return {
    apiKey,
    baseUrl: (baseUrlFlag ?? io.env.OKDATA_BASE_URL ?? saved.base_url ?? DEFAULT_BASE_URL).replace(/\/+$/, ''),
    keySource: envKey ? 'env' : saved.api_key ? 'config' : null,
    configProblem,
  };
}

/** The cached catalog lives next to the config; not secret, but kept private like the rest. */
export const catalogCachePath = (io: Pick<Io, 'env' | 'platform' | 'home'>): string => join(configDir(io), 'catalog-cache.json');

export { readJson };

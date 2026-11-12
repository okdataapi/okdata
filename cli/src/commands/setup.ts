// okdata setup --client claude-code|cursor|codex [--print] [--write-key] [--home dir]
// Writes the okdata MCP entry into each client's config file (merged, the rest kept, a backup made),
// or with --print only shows it. Nothing is run: for Claude Code the equivalent `claude mcp add`
// command is printed for those who prefer it.
import { chmodSync, copyFileSync, mkdirSync, readFileSync, realpathSync, renameSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { parse, str } from '../args.js';
import { modeOf } from '../config.js';
import type { Context } from '../context.js';
import { EXIT, NoKeyError, UsageError, type ExitCode } from '../exit.js';
import { printJson } from '../output.js';
import { ENV_VAR, parseClients, planFor, type ClientId } from '../setup-clients.js';

interface Outcome {
  client: ClientId;
  file: string;
  written: boolean;
  changed: boolean;
  backup: string | null;
  entry: string;
  command: string | null;
}

function readOrNull(path: string): string | null {
  try {
    return readFileSync(path, 'utf8');
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw err;
  }
}

/** The file a path points at, following a symlink (dotfile managers link these files). */
function realTarget(path: string): string {
  try {
    return realpathSync(path);
  } catch {
    return path; // not there yet: it is created
  }
}

/** Atomic write that keeps the file's mode (0600 when it holds a key). */
function writeKeepingMode(path: string, text: string, holdsKey: boolean): void {
  mkdirSync(dirname(path), { recursive: true });
  const mode = holdsKey ? 0o600 : modeOf(path) ?? 0o644;
  const tmp = `${path}.okdata-${process.pid}.tmp`;
  writeFileSync(tmp, text, { mode });
  chmodSync(tmp, mode);
  renameSync(tmp, path);
}

export async function setupCommand(ctx: Context, argv: readonly string[]): Promise<ExitCode> {
  const { values } = parse(argv, { client: { type: 'string' }, print: { type: 'boolean' }, 'write-key': { type: 'boolean' }, home: { type: 'string' } });
  const clients = parseClients(str(values.client));
  const home = str(values.home) ?? ctx.io.home;
  const mcpUrl = `${ctx.baseUrl}/mcp`;
  const writeKey = values['write-key'] === true;
  if (writeKey && !ctx.creds.apiKey) throw new NoKeyError();
  if (writeKey && (!/^[\x21-\x7e]+$/.test(ctx.creds.apiKey!) || /["\\]/.test(ctx.creds.apiKey!))) throw new UsageError('the saved key has characters a config file cannot hold; run okdata login again');
  // First every merge (a broken file stops it here, before anything is written), then the writes.
  const planned = clients.map((client) => {
    const shown = planFor(client, home, mcpUrl, null); // what is printed never holds the key
    const plan = writeKey ? planFor(client, home, mcpUrl, ctx.creds.apiKey!) : shown;
    const target = realTarget(plan.file); // write through a symlinked dotfile, not over it
    const before = values.print ? null : readOrNull(target);
    const after = values.print ? null : plan.merge(before);
    return { client, plan, shown, target, before, after };
  });
  const outcomes: Outcome[] = planned.map(({ client, plan, shown, target, before, after }) => {
    const base = { client, file: plan.file, entry: shown.entry, command: shown.command ?? null };
    if (values.print || after === null) return { ...base, written: false, changed: false, backup: null };
    if (after === before) return { ...base, written: true, changed: false, backup: null };
    const backup = before === null ? null : `${target}.okdata-backup`;
    if (backup) copyFileSync(target, backup);
    writeKeepingMode(target, after, writeKey);
    return { ...base, written: true, changed: true, backup };
  });
  const envMissing = !writeKey && !ctx.io.env[ENV_VAR];
  if (ctx.json) {
    printJson(ctx.io, { clients: outcomes, key_in_files: writeKey, env_var: ENV_VAR, env_var_set: !envMissing });
    return EXIT.ok;
  }
  for (const o of outcomes) {
    const head = values.print ? `${o.client}: add this to ${o.file}` : o.changed ? `${o.client}: wrote the okdata entry to ${o.file}${o.backup ? ` (backup: ${o.backup})` : ''}` : `${o.client}: ${o.file} already has this entry`;
    ctx.io.out([head, o.entry, ...(o.command ? ['', `Or with its own command (run it yourself): ${o.command}`] : []), ''].join('\n'));
  }
  if (writeKey) ctx.io.err('The saved key is in those files now (each written 0600). Revoke it in the console if a file leaks.');
  else if (envMissing) ctx.io.err(`Set ${ENV_VAR} where the client starts (e.g. export ${ENV_VAR}="okd_…" in ~/.zshrc), or run again with --write-key to store your saved key in the files instead.`);
  if (!values.print) ctx.io.err('Restart the client to load it; find, describe and account status work without a key.');
  return EXIT.ok;
}

// Dispatch: `okdata <command> …` → exit code. Errors become one message (or one JSON document with
// --json) and the exit code that says what happened to the money.
import { balanceCommand } from './commands/balance.js';
import { callCommand } from './commands/call.js';
import { findCommand } from './commands/find.js';
import { loginCommand } from './commands/login.js';
import { moreCommand } from './commands/more.js';
import { runCommand } from './commands/run.js';
import { setupCommand } from './commands/setup.js';
import { showCommand } from './commands/show.js';
import { makeContext, type Context } from './context.js';
import { EXIT, UsageError, exitCodeFor, type ExitCode } from './exit.js';
import { HELP } from './help.js';
import type { Io } from './io.js';
import { printError } from './output.js';
import { VERSION } from './version.js';

type Command = (ctx: Context, argv: readonly string[], zh: boolean) => Promise<ExitCode>;

const COMMANDS: Readonly<Record<string, Command>> = {
  find: findCommand,
  show: showCommand,
  call: callCommand,
  more: moreCommand,
  balance: balanceCommand,
  run: runCommand,
  login: loginCommand,
  setup: setupCommand,
};

/** The value of a --flag (or --flag=value) anywhere in argv, without consuming it. */
function peek(argv: readonly string[], name: string): string | undefined {
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i]!;
    if (a === `--${name}`) return argv[i + 1];
    if (a.startsWith(`--${name}=`)) return a.slice(name.length + 3);
  }
  return undefined;
}

/** Chinese titles when --lang zh, or when the locale is Chinese and no --lang is given. */
function wantsZh(argv: readonly string[], env: Io['env']): boolean {
  const lang = peek(argv, 'lang') ?? env.LC_ALL ?? env.LANG ?? '';
  return lang.toLowerCase().startsWith('zh');
}

export async function main(argv: readonly string[], io: Io): Promise<ExitCode> {
  const [name, ...rest] = argv;
  const json = rest.includes('--json');
  if (!name || name === '--help' || name === '-h' || name === 'help') {
    io.out(HELP);
    return name ? EXIT.ok : EXIT.usage;
  }
  if (name === '--version' || name === '-v') {
    io.out(VERSION);
    return EXIT.ok;
  }
  const command = COMMANDS[name];
  try {
    if (!command) throw new UsageError(`unknown command ${JSON.stringify(name)}; commands: ${Object.keys(COMMANDS).join(', ')}`);
    if (rest.includes('--help') || rest.includes('-h')) {
      io.out(HELP);
      return EXIT.ok;
    }
    const lang = peek(rest, 'lang');
    if (lang !== undefined && lang !== 'en' && lang !== 'zh') throw new UsageError('--lang is en or zh');
    const ctx = makeContext(io, { json, baseUrl: peek(rest, 'base-url') });
    return await command(ctx, rest, wantsZh(rest, io.env));
  } catch (err) {
    const code = exitCodeFor(err);
    printError(io, err, code, json);
    return code;
  }
}

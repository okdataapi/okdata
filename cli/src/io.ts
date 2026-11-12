// Everything the CLI touches outside itself, in one object, so tests can run it in-process.
import { spawn } from 'node:child_process';
import { homedir, hostname } from 'node:os';

export interface Io {
  out(text: string): void;
  err(text: string): void;
  env: Readonly<Record<string, string | undefined>>;
  platform: NodeJS.Platform;
  home: string;
  cwd: string;
  host: string;
  /** stdout is a terminal (a person is watching). */
  isTTY: boolean;
  fetch?: typeof fetch;
  sleep(ms: number): Promise<void>;
  /** Opens a URL in the browser; best effort. */
  openUrl(url: string): void;
}

function openInBrowser(url: string, platform: NodeJS.Platform): void {
  const [cmd, args] = platform === 'darwin' ? ['open', [url]]
    : platform === 'win32' ? ['cmd', ['/c', 'start', '""', url]]
    : ['xdg-open', [url]];
  try {
    const child = spawn(cmd, args, { stdio: 'ignore', detached: true });
    child.on('error', () => undefined); // no browser: the link is printed anyway
    child.unref();
  } catch {
    // same: the link is on screen
  }
}

export function processIo(): Io {
  return {
    out: (text) => { process.stdout.write(text.endsWith('\n') ? text : `${text}\n`); },
    err: (text) => { process.stderr.write(text.endsWith('\n') ? text : `${text}\n`); },
    env: process.env,
    platform: process.platform,
    home: homedir(),
    cwd: process.cwd(),
    host: hostname(),
    isTTY: process.stdout.isTTY === true,
    sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    openUrl: (url) => openInBrowser(url, process.platform),
  };
}

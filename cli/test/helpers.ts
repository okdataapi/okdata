// Runs the CLI in-process against a local mock API, with its own config directory and home.
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { catalog, pathOf } from '../../typescript/test/published.js';
import type { Io } from '../src/io.js';
import { main } from '../src/main.js';

export { startMock, pageBody, itemBody, batchBody, plainBody, errorReply, apiError, type MockApi } from '../../typescript/test/mock-server.js';

/** What GET /v1/catalog answers: the catalog with each endpoint's path. */
export const catalogData = () => ({ ...catalog, endpoints: catalog.endpoints.map((e) => ({ ...e, path: pathOf(e) })) });

export interface RunResult {
  code: number;
  out: string;
  err: string;
  opened: string[];
}

export interface Sandbox {
  dir: string;
  home: string;
  configDir: string;
  run(argv: string[], env?: Record<string, string | undefined>): Promise<RunResult>;
}

export function sandbox(baseUrl: string, env: Record<string, string | undefined> = {}): Sandbox {
  const dir = mkdtempSync(join(tmpdir(), 'okdata-cli-'));
  const home = join(dir, 'home');
  const configDir = join(dir, 'config');
  return {
    dir, home, configDir,
    async run(argv, extra = {}) {
      let out = '';
      let err = '';
      const opened: string[] = [];
      const io: Io = {
        out: (t) => { out += t.endsWith('\n') ? t : `${t}\n`; },
        err: (t) => { err += t.endsWith('\n') ? t : `${t}\n`; },
        env: { OKDATA_CONFIG_DIR: configDir, OKDATA_BASE_URL: baseUrl, ...env, ...extra },
        platform: 'linux',
        home,
        cwd: dir,
        host: 'test-host',
        isTTY: true,
        sleep: async () => {},
        openUrl: (url) => { opened.push(url); },
      };
      const code = await main(argv, io);
      return { code, out, err, opened };
    },
  };
}

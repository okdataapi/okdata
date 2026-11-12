// Refreshes this repository from the okdata monorepo, which holds the catalog the API runs on:
// typescript/, cli/ and python/ with their generated code, docs/, server.json and the platform
// tables in README.md. For maintainers: it needs a checkout of the (private) monorepo.
//
//   npm run sync -- --catalog <monorepo>            write
//   npm run sync -- --catalog <monorepo> --check    exit 1 if anything is out of date
//
// --catalog can also come from OKDATA_CATALOG_REPO. The work is done by the monorepo's
// scripts/export-public.mjs; nothing here reads keys or calls the API.
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const at = args.indexOf('--catalog');
const repo = at >= 0 ? args[at + 1] : process.env.OKDATA_CATALOG_REPO;
if (!repo || repo.startsWith('--')) {
  console.error('Pass --catalog <path to the okdata monorepo> or set OKDATA_CATALOG_REPO.');
  process.exit(1);
}
const script = path.join(path.resolve(repo), 'scripts', 'export-public.mjs');
if (!existsSync(script)) {
  console.error(`${script} not found; is ${repo} the okdata monorepo?`);
  process.exit(1);
}
const rest = args.filter((_, i) => at < 0 || (i !== at && i !== at + 1));
const run = spawnSync(process.execPath, [script, '--out', ROOT, ...rest], { stdio: 'inherit' });
process.exit(run.status ?? 1);

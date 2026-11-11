// Regenerates docs/, the SDKs' generated files and the endpoint tables in README.md from the
// catalog in the private okdata repository.
//
//   npm run sync -- --catalog ../okdata          write everything
//   npm run sync -- --catalog ../okdata --check  exit 1 if anything is out of date
//
// --catalog can also come from OKDATA_CATALOG_REPO. Nothing here reads keys or calls the API.
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { endpointTable, generateDocs } from './gen-docs.ts';
import { generatePython } from './gen-python.ts';
import { generateTypescript } from './gen-typescript.ts';
import type { Files, Source } from './shared.ts';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
/** Directories whose every file is generated; files the catalog no longer produces are removed. */
const OWNED_DIRS = ['docs'];

function parseArgs(argv: string[]): { catalogRepo: string; check: boolean } {
  const i = argv.indexOf('--catalog');
  const fromArg = i >= 0 ? argv[i + 1] : undefined;
  if (i >= 0 && (!fromArg || fromArg.startsWith('--'))) throw new Error('--catalog needs a path after it.');
  const catalogRepo = fromArg ?? process.env.OKDATA_CATALOG_REPO;
  if (!catalogRepo) {
    throw new Error('Pass --catalog <path to the private okdata repository> or set OKDATA_CATALOG_REPO.');
  }
  return { catalogRepo: path.resolve(catalogRepo), check: argv.includes('--check') };
}

async function load(catalogRepo: string): Promise<Source> {
  const at = (rel: string) => pathToFileURL(path.join(catalogRepo, rel)).href;
  try {
    const index = await import(at('packages/catalog/src/index.ts'));
    const gen = await import(at('packages/catalog/src/generate/index.ts'));
    const config = await import(at('apps/site/src/config.ts'));
    const { brand, siteUrl, apiUrl, mcpUrl, keyPrefix, envVar } = config.SITE;
    return { catalog: index.catalog, pathOf: index.pathOf, gen, site: { brand, siteUrl, apiUrl, mcpUrl, keyPrefix, envVar } };
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    throw new Error(`Could not load the catalog from ${catalogRepo}: ${reason}`);
  }
}

const MARKERS = {
  en: ['<!-- okdata:endpoints:en:start -->', '<!-- okdata:endpoints:en:end -->'],
  zh: ['<!-- okdata:endpoints:zh:start -->', '<!-- okdata:endpoints:zh:end -->'],
} as const;

/** README.md is hand-written except the endpoint tables between the markers. */
async function readme(src: Source): Promise<Files> {
  let text = await readFile(path.join(ROOT, 'README.md'), 'utf8');
  for (const lang of ['en', 'zh'] as const) {
    const [start, end] = MARKERS[lang];
    const a = text.indexOf(start);
    const b = text.indexOf(end);
    if (a < 0 || b < a) throw new Error(`README.md is missing ${start} ... ${end}`);
    text = `${text.slice(0, a + start.length)}\n${endpointTable(src, lang, 'root')}\n${text.slice(b)}`;
  }
  return new Map([['README.md', text]]);
}

async function listFiles(dir: string): Promise<string[]> {
  const entries = await readdir(path.join(ROOT, dir), { withFileTypes: true }).catch(() => []);
  const nested = await Promise.all(entries.map(async (d) => {
    const rel = path.posix.join(dir, d.name);
    return d.isDirectory() ? listFiles(rel) : [rel];
  }));
  return nested.flat();
}

async function stale(files: Files): Promise<string[]> {
  const existing = (await Promise.all(OWNED_DIRS.map(listFiles))).flat();
  return existing.filter((f) => !files.has(f));
}

async function changed(files: Files): Promise<string[]> {
  const results = await Promise.all([...files].map(async ([rel, text]) => {
    const current = await readFile(path.join(ROOT, rel), 'utf8').catch(() => null);
    return current === text ? null : rel;
  }));
  return results.filter((r): r is string => r !== null);
}

async function main(): Promise<void> {
  const { catalogRepo, check } = parseArgs(process.argv.slice(2));
  const src = await load(catalogRepo);
  const files: Files = new Map([
    ...generateDocs(src),
    ...generatePython(src),
    ...generateTypescript(src),
    ...(await readme(src)),
  ]);
  const diff = await changed(files);
  const extra = await stale(files);

  if (check) {
    for (const f of diff) console.error(`out of date: ${f}`);
    for (const f of extra) console.error(`not in the catalog any more: ${f}`);
    if (diff.length || extra.length) process.exit(1);
    console.log(`up to date: ${files.size} files from catalog ${src.catalog.revision}`);
    return;
  }
  for (const rel of diff) {
    await mkdir(path.dirname(path.join(ROOT, rel)), { recursive: true });
    await writeFile(path.join(ROOT, rel), files.get(rel) ?? '');
  }
  for (const rel of extra) await rm(path.join(ROOT, rel));
  console.log(`catalog ${src.catalog.revision}, price book ${src.catalog.priceBook}: ${src.catalog.endpoints.length} endpoints`);
  console.log(`${files.size} files checked, ${diff.length} written, ${extra.length} removed`);
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});

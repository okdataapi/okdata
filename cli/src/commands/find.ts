// okdata find <words…> [--platform p] [--category c] [--limit n]: free, no key.
import { int, parse, shellQuote, str } from '../args.js';
import { exampleParams, loadCatalog, needs, priceLine, type CatalogEndpoint } from '../catalog.js';
import type { Context } from '../context.js';
import { EXIT, UsageError, type ExitCode } from '../exit.js';
import { printJson } from '../output.js';
import { find } from '../search.js';

const CATEGORIES = ['social', 'creator', 'ads', 'commerce'];

export const callLine = (e: CatalogEndpoint): string =>
  ['okdata call', e.id, ...Object.entries(exampleParams(e)).map(([k, v]) => shellQuote(`${k}=${v}`))].join(' ');

export function findJson(e: CatalogEndpoint, zh: boolean) {
  return {
    id: e.id, title: zh ? e.title.zh : e.title.en, platform: e.platform, unit: e.unit, price: e.price,
    max_charge: e.maxCharge, needs: needs(e), paused: e.paused, status: e.status, call: callLine(e),
  };
}

export async function findCommand(ctx: Context, argv: readonly string[], zh: boolean): Promise<ExitCode> {
  const { values, positionals } = parse(argv, { platform: { type: 'string' }, category: { type: 'string' }, limit: { type: 'string' }, lang: { type: 'string' } });
  const words = positionals.join(' ').trim();
  const platform = str(values.platform);
  const category = str(values.category);
  if (!words && !platform) throw new UsageError('find needs some words or --platform, e.g. okdata find "抖音 评论"');
  if (category && !CATEGORIES.includes(category)) throw new UsageError(`--category is one of ${CATEGORIES.join(', ')}`);
  const catalog = await loadCatalog(ctx);
  if (platform && !catalog.platforms.some((p) => p.id === platform)) {
    throw new UsageError(`no platform ${JSON.stringify(platform)}; platforms: ${catalog.platforms.map((p) => p.id).join(', ')}`);
  }
  const result = find(catalog, words, { platform, category, limit: int(values.limit, 'limit', 1, 50) ?? 5 });
  if (ctx.json) {
    printJson(ctx.io, { platform: result.platform, listed_all: result.listedAll, matches: result.matches.map((e) => findJson(e, zh)) });
    return EXIT.ok;
  }
  if (result.matches.length === 0) {
    ctx.io.err('Nothing matched. Try other words, or --platform <id> to see what a platform has.');
    return EXIT.ok;
  }
  if (result.listedAll) ctx.io.err(`No endpoint matched those words; everything ${result.platform} has is below. Another platform is not a substitute.`);
  ctx.io.out(result.matches.map((e) => [
    `${e.id}  ${zh ? e.title.zh : e.title.en}${e.paused ? '  (paused)' : ''}`,
    `  ${priceLine(e)} · needs: ${needs(e).join(', ') || 'nothing'}`,
    `  ${callLine(e)}`,
  ].join('\n')).join('\n\n'));
  return EXIT.ok;
}

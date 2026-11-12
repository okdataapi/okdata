// okdata show <id>: what an endpoint takes, costs and returns. Free, no key.
import { parse } from '../args.js';
import { docsUrl, loadCatalog, needs, priceLine, type CatalogEndpoint, type CatalogParam } from '../catalog.js';
import type { Context } from '../context.js';
import { EXIT, UsageError, type ExitCode } from '../exit.js';
import { printJson } from '../output.js';
import { callLine } from './find.js';

function paramLine(p: CatalogParam, zh: boolean): string {
  const bits = [
    p.type,
    p.required ? 'required' : 'optional',
    p.enum ? `one of ${p.enum.join(' | ')}` : '',
    p.default !== undefined ? `default ${String(p.default)}` : '',
    p.example !== undefined && p.name !== 'cursor' ? `e.g. ${Array.isArray(p.example) ? p.example.join(',') : String(p.example)}` : '',
  ].filter(Boolean);
  return `  ${p.name.padEnd(18)} ${bits.join(', ')}\n  ${''.padEnd(18)} ${zh ? p.description.zh : p.description.en}`;
}

function chargesLine(e: CatalogEndpoint): string {
  const parts = [priceLine(e)];
  if (e.list && e.chargeWhenEmpty !== e.price) parts.push(`empty answer $${e.chargeWhenEmpty}`);
  if (Number(e.chargeWhenNotFound) > 0) parts.push(`not found $${e.chargeWhenNotFound}`);
  parts.push('failed calls are free');
  return parts.join('; ');
}

export async function showCommand(ctx: Context, argv: readonly string[], zh: boolean): Promise<ExitCode> {
  const { positionals } = parse(argv, { lang: { type: 'string' } });
  const id = positionals[0];
  if (!id || positionals.length > 1) throw new UsageError('show takes one endpoint id, e.g. okdata show douyin.videos.search');
  const catalog = await loadCatalog(ctx);
  const e = catalog.endpoints.find((x) => x.id === id);
  if (!e) throw new UsageError(`no endpoint ${JSON.stringify(id)}; try okdata find <words>`);
  if (ctx.json) {
    printJson(ctx.io, e);
    return EXIT.ok;
  }
  const own = e.params.filter((p) => !['view', 'fields'].includes(p.name));
  ctx.io.out([
    `${e.id}  ${zh ? e.title.zh : e.title.en}${e.paused ? '  (paused: calls answer capability_paused, not charged)' : ''}`,
    zh ? e.summary.zh : e.summary.en,
    '',
    `Price: ${chargesLine(e)}.`,
    e.list ? `Returns: a page of ${e.object} objects (about ${e.pageSize ?? '?'} a page); pass page.next_cursor back as cursor=… for the next page, a new call.` : `Returns: one ${e.object} object${e.post ? `, or a batch (up to ${e.batchMax ?? '?'} ids, POST)` : ''}.`,
    `Needs: ${needs(e).join(', ') || 'nothing'}`,
    '',
    'Parameters:',
    ...own.map((p) => paramLine(p, zh)),
    '  view               compact | standard (default) | full; same price',
    '  fields             comma-separated paths to keep, e.g. id,text,metrics.likes',
    '',
    `Example: ${callLine(e)}`,
    `Docs: ${docsUrl(e.id, zh)}`,
  ].join('\n'));
  return EXIT.ok;
}

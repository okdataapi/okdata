// okdata call <id> name=value… [--view] [--fields] [--max-price] [--pages N --max-spend X] [--out file]
// One paid call (or N pages of one listing within a budget). Exit 3 when something was charged and
// the job did not finish: a later page failed, the budget stopped it, or the result is partial.
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { endpoint, type AnyResult, type OkData, type Page, type StopReason } from '@okdata/sdk';
import { int, keyValues, parse, str } from '../args.js';
import type { Context } from '../context.js';
import { EXIT, UsageError, exitCodeFor, type ExitCode } from '../exit.js';
import { jsonLines, nextCommand, printError, printJson, summary, usd } from '../output.js';

export const LABEL_FLAGS = { source: { type: 'string' }, 'end-user': { type: 'string' } } as const;

export interface Listing {
  pages: Page<unknown>[];
  spent: string;
  stopReason: StopReason | null;
  error: unknown;
}

/** Pages of one listing within maxPages / maxSpend; an error after the first page is kept, not thrown. */
export async function fetchPages(ok: OkData, id: string, params: Record<string, unknown>, maxPages: number, maxSpend: string | undefined): Promise<Listing> {
  const pager = ok.pages(id, params, { maxPages, ...(maxSpend === undefined ? {} : { maxSpend }) });
  const pages: Page<unknown>[] = [];
  try {
    for await (const page of pager) pages.push(page);
  } catch (err) {
    return { pages, spent: pager.spent, stopReason: pager.stopReason, error: err };
  }
  return { pages, spent: pager.spent, stopReason: pager.stopReason, error: null };
}

export const itemsOf = (r: AnyResult): unknown[] => (r.kind === 'item' ? (r.item == null ? [] : [r.item]) : r.items);

export function emitItems(ctx: Context, items: readonly unknown[], out: string | undefined): void {
  if (out) {
    writeFileSync(resolve(ctx.io.cwd, out), items.length ? `${jsonLines(items)}\n` : '');
    ctx.io.err(`${items.length} item${items.length === 1 ? '' : 's'} written to ${out}`);
  } else if (items.length) {
    ctx.io.out(jsonLines(items));
  }
}

/** Creates (empties) the --out file before any call, so a paid result never meets an unwritable path. */
export function prepareOut(ctx: Context, out: string | undefined): void {
  if (!out) return;
  try {
    writeFileSync(resolve(ctx.io.cwd, out), '');
  } catch (err) {
    throw new UsageError(`cannot write --out ${out}: ${(err as Error).message}`);
  }
}

/** Params from key=value pairs and the --view / --fields / --max-price flags (flags win). */
export function callParams(id: string, pairs: readonly string[], values: Record<string, string | boolean | undefined>): Record<string, unknown> {
  const params = keyValues(id, pairs);
  if (str(values.view)) params.view = str(values.view);
  if (str(values.fields)) params.fields = str(values.fields);
  if (str(values['max-price'])) params.maxPrice = str(values['max-price']);
  return params;
}

export async function callCommand(ctx: Context, argv: readonly string[]): Promise<ExitCode> {
  const { values, positionals } = parse(argv, {
    view: { type: 'string' }, fields: { type: 'string' }, 'max-price': { type: 'string' }, 'idempotency-key': { type: 'string' },
    pages: { type: 'string' }, 'max-spend': { type: 'string' }, out: { type: 'string' }, ...LABEL_FLAGS,
  });
  const [id, ...pairs] = positionals;
  if (!id) throw new UsageError('call needs an endpoint id, e.g. okdata call douyin.videos.search query=露营装备');
  const params = callParams(id, pairs, values);
  const pages = int(values.pages, 'pages', 1, 100);
  const maxSpend = str(values['max-spend']);
  const ok = ctx.client({ source: str(values.source), endUser: str(values['end-user']) });
  prepareOut(ctx, str(values.out));
  if (pages !== undefined || maxSpend !== undefined) {
    if (endpoint(id) && !endpoint(id)!.list) throw new UsageError(`${id} returns one object; --pages and --max-spend are for list endpoints`);
    if (values['idempotency-key']) throw new UsageError('--idempotency-key is for one call; each page gets its own key');
    return listing(ctx, ok, id, params, pages ?? 1, maxSpend, str(values.out));
  }
  const result = await ok.call(id, params, { idempotencyKey: str(values['idempotency-key']) });
  const next = result.kind === 'page' && result.nextCursor ? nextCommand(id, params, result.nextCursor) : null;
  if (ctx.json) printJson(ctx.io, result.raw);
  else {
    ctx.io.err(summary(result, next).join('\n'));
    emitItems(ctx, itemsOf(result), str(values.out));
  }
  return result.resultStatus === 'partial' ? EXIT.charged : EXIT.ok;
}

async function listing(ctx: Context, ok: OkData, id: string, params: Record<string, unknown>, maxPages: number, maxSpend: string | undefined, out: string | undefined): Promise<ExitCode> {
  const run = await fetchPages(ok, id, params, maxPages, maxSpend);
  const items = run.pages.flatMap((p) => p.items);
  const last = run.pages.at(-1);
  const next = last?.nextCursor ? nextCommand(id, params, last.nextCursor) : null;
  const spentSomething = run.spent !== '0';
  const budgetStop = run.stopReason === 'max_spend' || run.stopReason === 'balance';
  const code: ExitCode = run.error ? exitCodeFor(run.error, spentSomething)
    : budgetStop ? (run.pages.length ? EXIT.charged : EXIT.refused)
    : run.pages.some((p) => p.resultStatus === 'partial') ? EXIT.charged : EXIT.ok;
  if (ctx.json) {
    printJson(ctx.io, {
      capability: id, pages: run.pages.length, items, spent: run.spent, stop_reason: run.stopReason,
      request_ids: run.pages.map((p) => p.requestId), next_cursor: last?.nextCursor ?? null,
      ...(run.error ? { error: (run.error as { toJSON?: () => unknown }).toJSON?.() ?? String(run.error) } : {}),
      exit_code: code,
    });
    return code;
  }
  for (const page of run.pages) ctx.io.err(summary(page as AnyResult, null)[0]!);
  const why = { end: 'no more pages', max_pages: `--pages ${maxPages} reached`, max_spend: `the next page could pass --max-spend ${maxSpend}`, balance: 'the balance will not cover another page', max_items: '' }[run.stopReason ?? 'end'];
  ctx.io.err(`${run.pages.length} page${run.pages.length === 1 ? '' : 's'}, ${items.length} items, spent ${usd(run.spent)}${run.error ? '' : `; stopped: ${why}`}`);
  if (next && !run.error) ctx.io.err(`next page: ${next}`);
  emitItems(ctx, items, out);
  if (run.error) printError(ctx.io, run.error, code, false);
  return code;
}

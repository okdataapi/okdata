// okdata run <plan.json> [--plan | --yes] [--max-spend X] [--out file]
// A plan is a list of calls, each with how many pages: {"steps":[{"capability":"…","params":{…},"pages":2}]}
// (or just the array). Without --yes it only prints what the plan could cost at most; with --yes it
// runs the steps in order and stops before --max-spend could be passed. Server-side task runs
// (/v1/runs, /v1/catalog/tasks) come later; this runs a plan on your side, one call at a time.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { OkDataError, endpoint, fromMicros, toMicros, type OkData } from '@okdata/sdk';
import { parse, str } from '../args.js';
import type { Context } from '../context.js';
import { EXIT, UsageError, exitCodeFor, type ExitCode } from '../exit.js';
import { jsonLines, printError, printJson, usd } from '../output.js';
import { fetchPages, itemsOf, prepareOut } from './call.js';

interface Step {
  capability: string;
  params: Record<string, unknown>;
  pages: number;
}

const ID = /^[a-z0-9_]+(\.[a-z0-9_]+)+$/;
const MAX_STEPS = 100;

export function readPlan(text: string, name: string): Step[] {
  let doc: unknown;
  try {
    doc = JSON.parse(text);
  } catch {
    throw new UsageError(`${name} is not valid JSON`);
  }
  const raw = Array.isArray(doc) ? doc : (doc as { steps?: unknown })?.steps;
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_STEPS) throw new UsageError(`${name} needs "steps": a list of 1 to ${MAX_STEPS} calls`);
  return raw.map((s: unknown, i: number) => {
    const step = s as { capability?: unknown; params?: unknown; pages?: unknown };
    if (typeof step?.capability !== 'string' || !ID.test(step.capability)) throw new UsageError(`step ${i + 1}: "capability" must be an endpoint id`);
    if (step.params !== undefined && (typeof step.params !== 'object' || step.params === null || Array.isArray(step.params))) throw new UsageError(`step ${i + 1}: "params" must be an object`);
    const pages = step.pages ?? 1;
    if (!Number.isInteger(pages) || (pages as number) < 1 || (pages as number) > 100) throw new UsageError(`step ${i + 1}: "pages" must be 1 to 100`);
    const info = endpoint(step.capability);
    if (info && !info.list && pages !== 1) throw new UsageError(`step ${i + 1}: ${step.capability} returns one object, so pages must be 1`);
    return { capability: step.capability, params: (step.params ?? {}) as Record<string, unknown>, pages: pages as number };
  });
}

interface StepRun {
  items: unknown[];
  pages: number;
  spent: string;
  stopReason: string | null;
  requestIds: string[];
  partial: boolean;
  error: unknown;
}

/** The tighter of the step's own price cap and what is left of the budget. */
function capFor(params: Record<string, unknown>, left: string): string {
  const own = params.maxPrice ?? params.max_price;
  if (own === undefined || own === null) return left;
  const ownMicros = toMicros(String(own));
  return ownMicros < toMicros(left) ? fromMicros(ownMicros) : left;
}

/** What a failed call cost: only a charged not_found costs anything (its amount). */
const chargedBy = (err: unknown): string =>
  err instanceof OkDataError && err.charged === true && err.amount ? err.amount : '0';

/** One step: pages of a listing, or one call of a single-object endpoint, within what is left. */
async function runStep(ok: OkData, step: Step, left: string | undefined): Promise<StepRun> {
  const info = endpoint(step.capability);
  if (info && !info.list) {
    if (left !== undefined && toMicros(info.maxCharge) > toMicros(left)) return { items: [], pages: 0, spent: '0', stopReason: 'max_spend', requestIds: [], partial: false, error: null };
    try {
      const { max_price: _snake, ...rest } = step.params;
      const params = left === undefined ? step.params : { ...rest, maxPrice: capFor(step.params, left) };
      const r = await ok.call(step.capability, params);
      return { items: itemsOf(r), pages: 1, spent: r.cost, stopReason: 'end', requestIds: [r.requestId], partial: r.resultStatus === 'partial', error: null };
    } catch (err) {
      const requestId = err instanceof OkDataError && err.requestId ? [err.requestId] : [];
      return { items: [], pages: 0, spent: chargedBy(err), stopReason: null, requestIds: requestId, partial: false, error: err };
    }
  }
  const run = await fetchPages(ok, step.capability, step.params, step.pages, left);
  const spent = fromMicros(toMicros(run.spent) + toMicros(chargedBy(run.error)));
  return { items: run.pages.flatMap((p) => p.items), pages: run.pages.length, spent, stopReason: run.stopReason, requestIds: run.pages.map((p) => p.requestId), partial: run.pages.some((p) => p.resultStatus === 'partial'), error: run.error };
}

/** The most a step can cost: maxCharge × pages, or null for an id this CLI does not know. */
const mostFor = (s: Step): bigint | null => {
  const info = endpoint(s.capability);
  return info ? toMicros(info.maxCharge) * BigInt(s.pages) : null;
};

function printPlan(ctx: Context, steps: Step[], maxSpend: string | undefined): void {
  const most = steps.map(mostFor);
  const known = most.every((m) => m !== null);
  const total = most.reduce<bigint>((a, m) => a + (m ?? 0n), 0n);
  if (ctx.json) {
    printJson(ctx.io, { steps: steps.map((s, i) => ({ ...s, most: most[i] === null ? null : fromMicros(most[i]!) })), most: known ? fromMicros(total) : null, max_spend: maxSpend ?? null });
    return;
  }
  ctx.io.out(steps.map((s, i) => `${i + 1}. ${s.capability} ${JSON.stringify(s.params)} · ${s.pages} page${s.pages === 1 ? '' : 's'} · at most ${most[i] === null ? '? (unknown endpoint)' : usd(fromMicros(most[i]!))}`).join('\n'));
  ctx.io.out(`At most ${known ? usd(fromMicros(total)) : `${usd(fromMicros(total))} plus the unknown steps`} in all${maxSpend ? `; --max-spend ${usd(maxSpend)} stops it earlier` : ''}. Add --yes to run it.`);
}

export async function runCommand(ctx: Context, argv: readonly string[]): Promise<ExitCode> {
  const { values, positionals } = parse(argv, { plan: { type: 'boolean' }, yes: { type: 'boolean' }, 'max-spend': { type: 'string' }, out: { type: 'string' }, source: { type: 'string' } });
  const [file] = positionals;
  if (!file || positionals.length > 1) throw new UsageError('run takes a plan file: okdata run plan.json --plan (see okdata --help)');
  let text: string;
  try {
    text = readFileSync(resolve(ctx.io.cwd, file), 'utf8');
  } catch (err) {
    throw new UsageError(`cannot read ${file}: ${(err as Error).message}`);
  }
  const steps = readPlan(text, file);
  const maxSpend = str(values['max-spend']);
  const budget = maxSpend === undefined ? null : toMicros(maxSpend);
  if (values.plan || !values.yes) {
    printPlan(ctx, steps, maxSpend);
    return EXIT.ok;
  }
  const ok = ctx.client({ source: str(values.source) ?? 'cli.run' });
  prepareOut(ctx, str(values.out));
  let spent = 0n;
  const report: Record<string, unknown>[] = [];
  const lines: string[] = [];
  let code: ExitCode = EXIT.ok;
  for (const [i, step] of steps.entries()) {
    const left = budget === null ? undefined : fromMicros(budget - spent);
    const run = await runStep(ok, step, left);
    spent += toMicros(run.spent);
    lines.push(...run.items.map((item) => jsonLines([{ step: i + 1, capability: step.capability, item }])));
    report.push({ step: i + 1, capability: step.capability, pages: run.pages, items: run.items.length, spent: run.spent, stop_reason: run.stopReason, request_ids: run.requestIds });
    if (!ctx.json) ctx.io.err(`${i + 1}. ${step.capability}: ${run.pages} page(s), ${run.items.length} items, ${usd(run.spent)}${run.stopReason && run.stopReason !== 'end' && run.stopReason !== 'max_pages' ? ` (stopped: ${run.stopReason})` : ''}`);
    if (run.error) {
      code = exitCodeFor(run.error, spent > 0n);
      if (!ctx.json) printError(ctx.io, run.error, code, false);
      else report[report.length - 1]!.error = (run.error as { toJSON?: () => unknown }).toJSON?.() ?? String(run.error);
      break;
    }
    if (run.stopReason === 'max_spend' || run.stopReason === 'balance') {
      code = spent > 0n ? EXIT.charged : EXIT.refused;
      break;
    }
    if (run.partial) code = EXIT.charged; // a partial result: keep going, but say so at the end
  }
  const out = str(values.out);
  if (out) writeFileSync(resolve(ctx.io.cwd, out), lines.length ? `${lines.join('\n')}\n` : '');
  if (ctx.json) printJson(ctx.io, { steps: report, spent: fromMicros(spent), done: report.length === steps.length && code === EXIT.ok, exit_code: code });
  else {
    if (!out && lines.length) ctx.io.out(lines.join('\n'));
    ctx.io.err(`Spent ${usd(fromMicros(spent))}${out ? `; items in ${out}` : ''}.${report.length < steps.length ? ` Stopped after step ${report.length} of ${steps.length}.` : code === EXIT.charged ? ' Some results are partial.' : ''}`);
  }
  return code;
}

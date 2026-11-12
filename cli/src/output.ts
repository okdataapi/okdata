// What the CLI prints. People get a short summary on stderr and one JSON item per line on stdout
// (pipe it to jq); --json prints one JSON document on stdout instead. Keys are never printed.
import { OkDataError, type AnyResult } from '@okdata/sdk';
import { shellQuote } from './args.js';
import { EXIT, NoKeyError, UsageError, type ExitCode } from './exit.js';
import type { Io } from './io.js';

export const usd = (amount: string | null | undefined): string => (amount == null || amount === '' ? '?' : `$${amount}`);

export const printJson = (io: Io, value: unknown): void => io.out(JSON.stringify(value, null, 2));

/** One line per item, for stdout. */
export const jsonLines = (items: readonly unknown[]): string => items.map((i) => JSON.stringify(i)).join('\n');

/** The next-page command for a page, ready to paste. */
export function nextCommand(id: string, params: Record<string, unknown>, cursor: string): string {
  const pairs = Object.entries({ ...params, cursor })
    .filter(([k, v]) => v !== undefined && v !== null && k !== 'maxPrice')
    .map(([k, v]) => shellQuote(`${k}=${Array.isArray(v) ? v.join(',') : String(v)}`));
  return `okdata call ${id} ${pairs.join(' ')}`;
}

/** The summary of one result: what came back, what it cost, where the next page is. */
export function summary(result: AnyResult, next: string | null): string[] {
  const count = result.kind === 'item' ? (result.item == null ? 0 : 1) : result.items.length;
  const parts = [
    result.capability,
    `${count} item${count === 1 ? '' : 's'}`,
    result.resultStatus,
    result.replayed ? 'replayed, not charged' : `cost ${usd(result.cost)}`,
    `balance ${usd(result.balanceAfter)}`,
  ];
  const lines = [parts.join(' · '), `request_id ${result.requestId}`];
  if (result.kind === 'batch' && result.missing.length) lines.push(`missing: ${result.missing.map((m) => `${m.id} (${m.reason})`).join(', ')}`);
  for (const w of result.warnings) lines.push(`warning ${w.code}: ${w.message}`);
  const cannot = Object.keys(result.unavailable);
  if (cannot.length) lines.push(`cannot give: ${cannot.join(', ')}`);
  if (result.kind === 'page') lines.push(next ? `next page: ${next}` : 'No next page.');
  return lines;
}

const yesNo = (v: boolean | null): string => (v === null ? 'unknown (look it up: okdata more <request_id>)' : v ? 'yes' : 'no');

function errorLines(err: unknown): string[] {
  if (err instanceof OkDataError) {
    const lines = [`Error ${err.code}: ${err.message}`];
    for (const p of err.problems) lines.push(`  - ${p}`);
    const charged = err.charged === true && err.amount ? `yes, ${usd(err.amount)}` : yesNo(err.charged);
    lines.push(`  Charged: ${charged} · Retry: ${err.retry}${err.retryAfterSeconds ? ` (after ${err.retryAfterSeconds} s)` : ''}`);
    if (err.required) lines.push(`  This call could cost ${usd(err.required)}${err.available ? `; balance ${usd(err.available)}` : ''}.`);
    if (err.nextStep) lines.push(`  ${err.nextStep}`);
    if (err.topUpUrl && !err.nextStep) lines.push(`  Top up: ${err.topUpUrl}`);
    if (err.messageZh) lines.push(`  中文：${err.messageZh}`);
    if (err.requestId) lines.push(`  Request ID: ${err.requestId}`);
    if (err.idempotencyKey && err.charged === null) lines.push(`  Idempotency-Key: ${err.idempotencyKey} (resend with --idempotency-key to never pay twice)`);
    return lines;
  }
  if (err instanceof UsageError) return [`okdata: ${err.message}`, 'See `okdata --help`.'];
  if (err instanceof NoKeyError) return [`okdata: ${err.message}`];
  return [`okdata: ${err instanceof Error ? err.message : String(err)}`];
}

export function errorJson(err: unknown, exitCode: ExitCode): Record<string, unknown> {
  if (err instanceof OkDataError) return { error: err.toJSON(), exit_code: exitCode };
  const code = err instanceof NoKeyError ? 'no_key' : exitCode === EXIT.usage ? 'usage' : 'error';
  return { error: { code, message: err instanceof Error ? err.message : String(err) }, exit_code: exitCode };
}

export function printError(io: Io, err: unknown, exitCode: ExitCode, json: boolean): void {
  if (json) printJson(io, errorJson(err, exitCode));
  else io.err(errorLines(err).join('\n'));
}

// okdata more <request_id> [--view] [--fields] [--out]: a call's kept result again, free for 24 h,
// in any view. Also the way to look up a call whose charge is unknown (--receipt).
import { parse, str } from '../args.js';
import type { Context } from '../context.js';
import { EXIT, UsageError, type ExitCode } from '../exit.js';
import { printJson, summary, usd } from '../output.js';
import { emitItems, itemsOf, prepareOut } from './call.js';

export async function moreCommand(ctx: Context, argv: readonly string[]): Promise<ExitCode> {
  const { values, positionals } = parse(argv, { view: { type: 'string' }, fields: { type: 'string' }, out: { type: 'string' }, receipt: { type: 'boolean' } });
  const [requestId] = positionals;
  if (!requestId || positionals.length > 1) throw new UsageError('more takes the request_id of an earlier call, e.g. okdata more 0f6c2a8e-…');
  const ok = ctx.client();
  prepareOut(ctx, str(values.out));
  if (values.receipt) {
    const call = await ok.calls.get(requestId);
    if (ctx.json) printJson(ctx.io, call);
    else ctx.io.out(`${String(call.capability)} · ${String(call.status)} · charged ${call.charged === null ? 'unknown yet' : usd(String(call.charged))} · ${String(call.result_status ?? '')} · ${String(call.items ?? 0)} items`);
    return EXIT.ok;
  }
  const view = str(values.view) as 'compact' | 'standard' | 'full' | undefined;
  const result = await ok.calls.result(requestId, { view, fields: str(values.fields) });
  if (ctx.json) {
    printJson(ctx.io, result.raw);
    return EXIT.ok;
  }
  ctx.io.err(summary(result, null).filter((l) => !l.startsWith('No next page')).join('\n'));
  if (result.kind === 'page' && result.nextCursor) ctx.io.err(`next page: okdata call ${result.capability} … cursor=${result.nextCursor} (same parameters as the first call)`);
  emitItems(ctx, itemsOf(result), str(values.out));
  return EXIT.ok;
}

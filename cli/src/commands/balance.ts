// okdata balance: the balance, this key's limits and the account's rate tier. Free.
import { parse } from '../args.js';
import type { Context } from '../context.js';
import { EXIT, type ExitCode } from '../exit.js';
import { printJson, usd } from '../output.js';

interface BudgetLine { limit: string | null; spent: string; remaining?: string | null }
interface AccountView {
  balance: string;
  currency: string;
  key: { name: string | null; prefix: string; purpose: string; status: string; budget: Record<'daily' | 'monthly' | 'total', BudgetLine | null> };
  rate: { tier: string; per_minute: number; concurrent: number };
}

function budget(name: string, line: BudgetLine | null | undefined): string | null {
  if (!line || line.limit === null) return null;
  return `${name} ${usd(line.spent)} of ${usd(line.limit)}`;
}

export async function balanceCommand(ctx: Context, argv: readonly string[]): Promise<ExitCode> {
  parse(argv, {});
  const account = (await ctx.client().account()) as unknown as AccountView;
  if (ctx.json) {
    printJson(ctx.io, account);
    return EXIT.ok;
  }
  const k = account.key;
  const limits = [budget('today', k?.budget?.daily), budget('this month', k?.budget?.monthly), budget('in total', k?.budget?.total)].filter(Boolean);
  ctx.io.out([
    `Balance ${usd(account.balance)} ${account.currency}`,
    k ? `Key ${k.name ? `"${k.name}" ` : ''}(${k.prefix}…) · ${k.purpose} · ${k.status}${limits.length ? ` · ${limits.join(', ')}` : ''}` : '',
    account.rate ? `Limits: ${account.rate.tier}, ${account.rate.per_minute} requests a minute, ${account.rate.concurrent} at once` : '',
    `Key from: ${ctx.creds.keySource === 'env' ? 'OKDATA_API_KEY' : 'okdata login'}`,
  ].filter(Boolean).join('\n'));
  return EXIT.ok;
}

// Command-line parsing: node:util parseArgs for --flags, and key=value pairs for endpoint params,
// typed by the catalog (integers, booleans, comma lists), so `okdata call <id> 'query=露营' sort=latest`
// sends exactly what the Playground's 命令行 tab shows.
import { parseArgs, type ParseArgsConfig } from 'node:util';
import { endpoint, type ParamType } from '@okdata/sdk';
import { UsageError } from './exit.js';

type Options = NonNullable<ParseArgsConfig['options']>;

/** Flags every command takes. */
export const COMMON: Options = {
  json: { type: 'boolean' },
  'base-url': { type: 'string' },
  help: { type: 'boolean', short: 'h' },
};

export interface Parsed {
  values: Record<string, string | boolean | undefined>;
  positionals: string[];
}

export function parse(argv: readonly string[], options: Options): Parsed {
  try {
    const { values, positionals } = parseArgs({ args: [...argv], options: { ...COMMON, ...options }, allowPositionals: true, strict: true });
    return { values: values as Parsed['values'], positionals };
  } catch (err) {
    throw new UsageError(err instanceof Error ? err.message.split('\n')[0]! : String(err));
  }
}

export const str = (v: string | boolean | undefined): string | undefined => (typeof v === 'string' ? v : undefined);

export function int(v: string | boolean | undefined, name: string, min = 1, max = 1000): number | undefined {
  if (v === undefined) return undefined;
  const n = typeof v === 'string' && /^\d+$/.test(v) ? Number(v) : NaN;
  if (!Number.isInteger(n) || n < min || n > max) throw new UsageError(`--${name} must be a whole number from ${min} to ${max}`);
  return n;
}

const NAME = /^[a-z_][a-z0-9_]*$/;
/** Pairs that are not endpoint params but call options, as the Playground may print them. */
const OPTION_KEYS: Readonly<Record<string, string>> = { max_price: 'maxPrice' };

function typed(name: string, raw: string, type: ParamType | undefined): unknown {
  switch (type) {
    case 'integer': {
      if (!/^-?\d+$/.test(raw)) throw new UsageError(`${name} takes a whole number, not ${JSON.stringify(raw)}`);
      return Number(raw);
    }
    case 'boolean': {
      if (raw !== 'true' && raw !== 'false') throw new UsageError(`${name} takes true or false, not ${JSON.stringify(raw)}`);
      return raw === 'true';
    }
    case 'string[]': {
      if (raw.trim().startsWith('[')) {
        let list: unknown;
        try {
          list = JSON.parse(raw);
        } catch {
          list = null;
        }
        if (!Array.isArray(list)) throw new UsageError(`${name} takes a list: a,b,c or ["a","b"]`);
        return list.map(String);
      }
      return raw.split(',').map((s) => s.trim()).filter(Boolean);
    }
    default:
      return raw;
  }
}

/** `query=露营` `ids=1,2` → { query: '露营', ids: ['1', '2'] }, typed by the endpoint's params. */
export function keyValues(id: string, pairs: readonly string[]): Record<string, unknown> {
  const types = endpoint(id)?.params ?? {};
  const out: Record<string, unknown> = {};
  for (const pair of pairs) {
    const eq = pair.indexOf('=');
    if (eq < 1) throw new UsageError(`expected name=value, got ${JSON.stringify(pair)}`);
    const name = pair.slice(0, eq);
    if (!NAME.test(name)) throw new UsageError(`${JSON.stringify(name)} is not a parameter name`);
    const value = pair.slice(eq + 1);
    out[OPTION_KEYS[name] ?? name] = OPTION_KEYS[name] ? value : typed(name, value, types[name]);
  }
  return out;
}

/** 'a b' -> "'a b'": a value as it can be pasted back into a POSIX shell. */
export const shellQuote = (s: string): string => (/^[A-Za-z0-9_.,:/=@%+-]+$/.test(s) ? s : `'${s.replace(/'/g, `'\\''`)}'`);

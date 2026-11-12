// The live catalog (GET /v1/catalog, free, no key) for find and show, cached for an hour next to the
// config. A failed fetch falls back to an older cache, with a note.
import { readFileSync } from 'node:fs';
import { catalogCachePath, configDir, writePrivate } from './config.js';
import type { Context } from './context.js';

export type Text = { en: string; zh: string };

export interface CatalogParam {
  name: string;
  type: 'string' | 'integer' | 'boolean' | 'string[]';
  required: boolean;
  description: Text;
  enum?: string[];
  default?: string | number | boolean;
  example?: string | number | boolean | string[];
}

export interface CatalogEndpoint {
  id: string;
  platform: string;
  path?: string;
  object: string;
  list: boolean;
  pageSize?: number;
  unit: 'call' | 'item';
  price: string;
  maxCharge: string;
  minimum: string | null;
  chargeWhenEmpty: string;
  chargeWhenNotFound: string;
  title: Text;
  short: Text;
  summary: Text;
  group: Text | null;
  aliases: { en: string[]; zh: string[] };
  category: string;
  params: CatalogParam[];
  oneOf: string[][];
  cursorTtlSeconds: number | null;
  status: string;
  paused: boolean;
  post: boolean;
  batchMax: number | null;
}

export interface CatalogPlatform {
  id: string;
  name: Text;
  summary: Text;
}

export interface CatalogData {
  revision: string;
  baseUrl?: string;
  platforms: CatalogPlatform[];
  endpoints: CatalogEndpoint[];
}

const TTL_MS = 3_600_000;

interface Cache {
  fetched_at: string;
  base_url: string;
  data: CatalogData;
}

function readCache(path: string): Cache | null {
  try {
    const cache = JSON.parse(readFileSync(path, 'utf8')) as Cache;
    return Array.isArray(cache?.data?.endpoints) ? cache : null;
  } catch {
    return null; // no cache yet, or a broken one: fetch
  }
}

export async function loadCatalog(ctx: Context): Promise<CatalogData> {
  const path = catalogCachePath(ctx.io);
  const cache = readCache(path);
  const fresh = cache && cache.base_url === ctx.baseUrl && Date.now() - Date.parse(cache.fetched_at) < TTL_MS;
  if (fresh) return cache.data;
  try {
    const data = (await ctx.client({ needKey: false }).catalog()) as unknown as CatalogData;
    if (!Array.isArray(data.endpoints)) throw new Error('the catalog answer has no endpoints');
    const next: Cache = { fetched_at: new Date().toISOString(), base_url: ctx.baseUrl, data };
    try {
      writePrivate(path, JSON.stringify(next), configDir(ctx.io));
    } catch (err) {
      ctx.io.err(`note: could not cache the catalog (${err instanceof Error ? err.message : String(err)})`);
    }
    return data;
  } catch (err) {
    if (cache && cache.base_url === ctx.baseUrl) {
      ctx.io.err(`note: using the catalog cached at ${cache.fetched_at} (${err instanceof Error ? err.message : String(err)})`);
      return cache.data;
    }
    throw err;
  }
}

export const docsUrl = (id: string, zh: boolean): string => `https://okdata.online${zh ? '/zh' : ''}/apis/${id.split('.').join('/')}/`;

/** "query", "id or url": what a call needs, from required params and oneOf groups. */
export function needs(e: CatalogEndpoint): string[] {
  const grouped = new Set(e.oneOf.flat());
  const required = e.params.filter((p) => p.required && !grouped.has(p.name)).map((p) => p.name);
  return [...required, ...e.oneOf.map((g) => g.join(' or '))];
}

/** A minimal working call: required params and the first of each oneOf group, with catalog examples. */
export function exampleParams(e: CatalogEndpoint): Record<string, string> {
  const out: Record<string, string> = {};
  const firsts = new Set(e.oneOf.map((g) => g.find((n) => e.params.some((p) => p.name === n && (p.example ?? p.default) !== undefined))));
  for (const p of e.params) {
    if (['cursor', 'view', 'fields'].includes(p.name)) continue;
    if (!p.required && !firsts.has(p.name)) continue;
    const v = p.example ?? p.default;
    if (v !== undefined) out[p.name] = Array.isArray(v) ? v.join(',') : String(v);
  }
  return out;
}

export function priceLine(e: CatalogEndpoint): string {
  if (e.unit === 'item') return `$${e.price} per item (at least $${e.minimum ?? e.price}, at most $${e.maxCharge} a call)`;
  return `$${e.price} per call`;
}

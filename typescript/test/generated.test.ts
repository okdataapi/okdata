import { readFileSync } from 'node:fs';
import { catalog, errorDocs, pathOf } from './published.js';
import { describe, expect, it } from 'vitest';
import { CATALOG_REVISION, ENDPOINTS, ERROR_CODES, ERRORS, OkData, PRICE_BOOK, VERSION } from '../src/index.js';

const methodAt = (ok: OkData, id: string): unknown =>
  id.split('.').reduce<unknown>((node, part) => (node as Record<string, unknown> | undefined)?.[part], ok);

describe('generated from the catalog', () => {
  it('covers every endpoint with its path and price', () => {
    expect(CATALOG_REVISION).toBe(catalog.revision);
    expect(PRICE_BOOK).toBe(catalog.priceBook);
    expect(Object.keys(ENDPOINTS)).toEqual(catalog.endpoints.map((e) => e.id));
    for (const e of catalog.endpoints) {
      const info = ENDPOINTS[e.id as keyof typeof ENDPOINTS];
      expect(info.path).toBe(pathOf(e));
      expect([info.price, info.maxCharge, info.list, info.post]).toEqual([e.price, e.maxCharge, e.list, e.post]);
    }
  });

  it('has a typed method for every endpoint', () => {
    const ok = new OkData({ apiKey: 'okd_x', baseUrl: 'http://127.0.0.1:9' });
    const missing = catalog.endpoints.filter((e) => typeof methodAt(ok, e.id) !== 'function').map((e) => e.id);
    expect(missing).toEqual([]);
  });

  it('carries the error table', () => {
    expect([...ERROR_CODES]).toEqual(errorDocs.map((d) => d.code));
    for (const d of errorDocs) expect(ERRORS[d.code]).toEqual({ http: d.http, charged: d.charged, retry: d.retry });
  });

  it('has the version of package.json', () => {
    const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as { version: string };
    expect(VERSION).toBe(pkg.version);
  });
});

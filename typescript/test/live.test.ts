// Opt-in smoke test against the live API: OKDATA_LIVE_KEY=okd_... npm test. Free routes only
// (catalog, status, account balance); nothing here is ever charged.
import { describe, expect, it } from 'vitest';
import { OkData } from '../src/index.js';

const key = process.env.OKDATA_LIVE_KEY;

describe.skipIf(!key)('live API (free routes only)', () => {
  const ok = new OkData({ apiKey: key, baseUrl: process.env.OKDATA_LIVE_BASE_URL ?? 'https://api.okdata.online' });

  it('reads the catalog and status', async () => {
    const cat = await ok.catalog();
    expect(Array.isArray(cat.endpoints)).toBe(true);
    const status = await ok.status();
    expect(typeof status.revision).toBe('string');
  }, 30_000);

  it('reads the account balance', async () => {
    const account = await ok.account();
    expect(account.currency).toBe('USD');
    expect(typeof account.balance).toBe('string');
  }, 30_000);
});

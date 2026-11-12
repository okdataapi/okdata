import { existsSync, lstatSync, mkdirSync, readFileSync, statSync, symlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { mergeToml } from '../src/setup-clients.js';
import { apiError, batchBody, pageBody, itemBody, plainBody, sandbox, startMock, type MockApi, type Sandbox } from './helpers.js';

const errorReplyBody = (code: Parameters<typeof apiError>[0]) => apiError(code);

const KEY = 'okd_setup_secret_0123456789';
let api: MockApi;
let box: Sandbox;
const mode = (p: string) => statSync(p).mode & 0o777;

beforeAll(async () => { api = await startMock(); });
afterAll(async () => { await api.close(); });
beforeEach(() => {
  api.seen.length = 0;
  box = sandbox('https://api.okdata.online');
});

describe('okdata setup', () => {
  it('writes the Claude Code entry into ~/.claude.json, keeps the rest, and prints the claude mcp add form', async () => {
    mkdirSync(box.home, { recursive: true });
    const file = join(box.home, '.claude.json');
    writeFileSync(file, JSON.stringify({ numStartups: 3, mcpServers: { other: { type: 'stdio', command: 'x' } } }));
    const r = await box.run(['setup', '--client', 'claude-code']);
    expect(r.code).toBe(0);
    const doc = JSON.parse(readFileSync(file, 'utf8'));
    expect(doc.numStartups).toBe(3);
    expect(doc.mcpServers.other).toEqual({ type: 'stdio', command: 'x' });
    expect(doc.mcpServers.okdata).toEqual({ type: 'http', url: 'https://api.okdata.online/mcp', headers: { Authorization: 'Bearer ${OKDATA_API_KEY}' } });
    expect(r.out).toContain("claude mcp add --transport http --scope user okdata https://api.okdata.online/mcp --header 'Authorization: Bearer ${OKDATA_API_KEY}'");
    expect(existsSync(`${file}.okdata-backup`)).toBe(true);
    expect(r.err).toContain('Set OKDATA_API_KEY');
    const again = await box.run(['setup', '--client', 'claude-code']);
    expect(again.out).toContain('already has this entry');
  });

  it('writes Cursor and Codex entries; Codex replaces its old okdata table', async () => {
    mkdirSync(join(box.home, '.codex'), { recursive: true });
    const toml = join(box.home, '.codex', 'config.toml');
    writeFileSync(toml, 'model = "gpt-5"\n\n[mcp_servers.okdata]\nurl = "https://old"\n\n[mcp_servers.okdata.env]\nX = "1"\n\n[mcp_servers.other]\nurl = "https://o"\n');
    const r = await box.run(['setup', '--client', 'cursor,codex', '--json'], { OKDATA_API_KEY: KEY });
    expect(r.code).toBe(0);
    expect(JSON.parse(readFileSync(join(box.home, '.cursor', 'mcp.json'), 'utf8')).mcpServers.okdata)
      .toEqual({ url: 'https://api.okdata.online/mcp', headers: { Authorization: 'Bearer ${env:OKDATA_API_KEY}' } });
    expect(readFileSync(toml, 'utf8')).toBe('model = "gpt-5"\n\n[mcp_servers.other]\nurl = "https://o"\n\n[mcp_servers.okdata]\nurl = "https://api.okdata.online/mcp"\nbearer_token_env_var = "OKDATA_API_KEY"\n');
    const doc = JSON.parse(r.out);
    expect(doc.env_var_set).toBe(true);
    expect(doc.clients.map((c: { client: string; changed: boolean }) => [c.client, c.changed])).toEqual([['cursor', true], ['codex', true]]);
    expect(r.out).not.toContain(KEY);
  });

  it('only prints with --print', async () => {
    const r = await box.run(['setup', '--client', 'claude-code', '--print']);
    expect(r.code).toBe(0);
    expect(r.out).toContain('"url": "https://api.okdata.online/mcp"');
    expect(existsSync(join(box.home, '.claude.json'))).toBe(false);
  });

  it('stores the saved key with --write-key, 0600, without printing it', async () => {
    const r = await box.run(['setup', '--client', 'claude-code,codex', '--write-key'], { OKDATA_API_KEY: KEY });
    expect(r.code).toBe(0);
    const claude = join(box.home, '.claude.json');
    expect(JSON.parse(readFileSync(claude, 'utf8')).mcpServers.okdata.headers.Authorization).toBe(`Bearer ${KEY}`);
    expect(readFileSync(join(box.home, '.codex', 'config.toml'), 'utf8')).toContain(`http_headers = { "Authorization" = "Bearer ${KEY}" }`);
    expect(mode(claude)).toBe(0o600);
    expect(r.out + r.err).not.toContain(KEY);
  });

  it('leaves a broken file alone and refuses unknown clients', async () => {
    mkdirSync(box.home, { recursive: true });
    const file = join(box.home, '.claude.json');
    writeFileSync(file, '{ not json');
    const r = await box.run(['setup', '--client', 'claude-code']);
    expect(r.code).toBe(1);
    expect(readFileSync(file, 'utf8')).toBe('{ not json');
    expect((await box.run(['setup', '--client', 'vim'])).code).toBe(1);
    expect((await box.run(['setup'])).code).toBe(1);
    expect((await box.run(['setup', '--client', 'cursor', '--write-key'])).code).toBe(4);
  });

  it('mergeToml appends to an empty file', () => {
    expect(mergeToml(null, '[mcp_servers.okdata]\nurl = "u"')).toBe('[mcp_servers.okdata]\nurl = "u"\n');
  });
});

describe('okdata login', () => {
  const linkApi = (statuses: string[]) => {
    let polls = 0;
    api.handle((req) => {
      if (req.path === '/cli/link') {
        return { body: plainBody({ device_code: 'okdc_secret_device', user_code: 'ABCD-EFGH', verification_url: 'https://okdata.online/console/link/', verification_url_complete: 'https://okdata.online/console/link/?code=ABCD-EFGH', expires_in: 600, interval: 5 }) };
      }
      const status = statuses[Math.min(polls++, statuses.length - 1)]!;
      return { body: plainBody(status === 'approved' ? { status, key: KEY, key_id: 'key_123', key_name: 'Command line' } : { status, interval: 10 }) };
    });
  };

  it('links the terminal, saves the key 0600, and never prints the key or device code', async () => {
    box = sandbox(api.url);
    linkApi(['pending', 'slow_down', 'approved']);
    const r = await box.run(['login']);
    expect(r.code).toBe(0);
    expect(r.err).toContain('ABCD-EFGH');
    expect(r.opened).toEqual(['https://okdata.online/console/link/?code=ABCD-EFGH']);
    expect(api.seen[0]!.body).toEqual({ client_name: expect.stringContaining('okdata CLI') });
    expect(api.seen.slice(1).every((s) => (s.body as { device_code: string }).device_code === 'okdc_secret_device')).toBe(true);
    expect(api.seen.every((s) => s.headers.authorization === undefined)).toBe(true);
    const file = join(box.configDir, 'config.json');
    const saved = JSON.parse(readFileSync(file, 'utf8'));
    expect(saved).toMatchObject({ api_key: KEY, key_id: 'key_123', key_name: 'Command line', base_url: api.url });
    expect(mode(file)).toBe(0o600);
    expect(r.out + r.err).not.toContain(KEY);
    expect(r.out + r.err).not.toContain('okdc_secret_device');

    // The saved key is used from now on (OKDATA_API_KEY unset).
    api.handle(() => ({ body: itemBody({ id: '1' }, { capability: 'x.posts.get' }) }));
    api.seen.length = 0;
    expect((await box.run(['call', 'x.posts.get', 'id=1'])).code).toBe(0);
    expect(api.seen[0]!.headers.authorization).toBe(`Bearer ${KEY}`);
  });

  it('exits 4 when the link is refused or expires, and saves nothing', async () => {
    box = sandbox(api.url);
    linkApi(['pending', 'denied']);
    const denied = await box.run(['login', '--json']);
    expect(denied.code).toBe(4);
    expect(JSON.parse(denied.out)).toMatchObject({ status: 'denied', exit_code: 4 });
    expect(denied.opened).toEqual([]);
    linkApi(['expired']);
    expect((await box.run(['login', '--no-browser'])).code).toBe(4);
    expect(existsSync(join(box.configDir, 'config.json'))).toBe(false);
  });
});

describe('okdata run', () => {
  const plan = (steps: unknown) => {
    const path = join(box.dir, 'plan.json');
    writeFileSync(path, JSON.stringify(steps));
    return 'plan.json';
  };
  const listing = (req: { path: string; query: URLSearchParams }) => {
    if (req.path === '/v1/x/posts/get') return { body: itemBody({ id: 'p' }, { capability: 'x.posts.get', amount: '0.0003' }) };
    const n = Number(req.query.get('cursor') ?? '1');
    return { body: pageBody([{ id: `${n}` }], { amount: '0.02', next: n < 5 ? String(n + 1) : null }) };
  };

  it('prints the most a plan can cost and runs nothing without --yes', async () => {
    const r = await box.run(['run', plan({ steps: [{ capability: 'douyin.videos.search', params: { query: '露营' }, pages: 3 }, { capability: 'x.posts.get', params: { id: '1' } }] })], { OKDATA_API_KEY: KEY });
    expect(r.code).toBe(0);
    expect(r.out).toContain('at most $0.06');
    expect(r.out).toContain('At most $0.0603 in all');
    expect(api.seen).toHaveLength(0);
  });

  it('runs the steps with --yes and writes items with their step', async () => {
    box = sandbox(api.url, { OKDATA_API_KEY: KEY });
    api.handle(listing);
    const r = await box.run(['run', plan([{ capability: 'douyin.videos.search', params: { query: 'x' }, pages: 2 }, { capability: 'x.posts.get', params: { id: '1' } }]), '--yes', '--out', 'out.jsonl']);
    expect(r.code).toBe(0);
    const lines = readFileSync(join(box.dir, 'out.jsonl'), 'utf8').trim().split('\n').map((l) => JSON.parse(l));
    expect(lines).toEqual([
      { step: 1, capability: 'douyin.videos.search', item: { id: '1' } },
      { step: 1, capability: 'douyin.videos.search', item: { id: '2' } },
      { step: 2, capability: 'x.posts.get', item: { id: 'p' } },
    ]);
    expect(api.seen.every((s) => s.headers['x-source'] === 'cli.run')).toBe(true);
    expect(r.err).toContain('Spent $0.0403');
  });

  it('stops before --max-spend across steps and exits 3', async () => {
    box = sandbox(api.url, { OKDATA_API_KEY: KEY });
    api.handle(listing);
    const r = await box.run(['run', plan([{ capability: 'douyin.videos.search', params: { query: 'x' }, pages: 2 }, { capability: 'douyin.videos.search', params: { query: 'y' }, pages: 2 }]), '--yes', '--max-spend', '0.05', '--json']);
    expect(r.code).toBe(3);
    const doc = JSON.parse(r.out);
    expect(doc.spent).toBe('0.04');
    expect(doc.steps[1]).toMatchObject({ pages: 0, stop_reason: 'max_spend' });
  });

  it('refuses a bad plan with exit 1', async () => {
    expect((await box.run(['run', plan({ steps: [] })])).code).toBe(1);
    expect((await box.run(['run', plan([{ capability: 'Not An Id' }])])).code).toBe(1);
    expect((await box.run(['run', plan([{ capability: 'x.posts.get', pages: 2 }])])).code).toBe(1);
    expect((await box.run(['run', 'missing.json'])).code).toBe(1);
  });
});

describe('review fixes', () => {
  it('a broken config.json does not block login or the free commands, and says so when a key is needed', async () => {
    box = sandbox(api.url);
    mkdirSync(box.configDir, { recursive: true });
    writeFileSync(join(box.configDir, 'config.json'), '{ truncated');
    const nokey = await box.run(['balance']);
    expect(nokey.code).toBe(1);
    expect(nokey.err).toContain('cannot be read');
    let polls = 0;
    api.handle((req) => (req.path === '/cli/link'
      ? { body: plainBody({ device_code: 'okdc_x', user_code: 'ABCD-EFGH', verification_url: 'u', expires_in: 600, interval: 5 }) }
      : { body: plainBody(polls++ ? { status: 'approved', key: KEY, key_id: 'k', key_name: 'Command line' } : { status: 'pending' }) }));
    expect((await box.run(['login', '--no-browser'])).code).toBe(0);
    expect(JSON.parse(readFileSync(join(box.configDir, 'config.json'), 'utf8')).api_key).toBe(KEY);
  });

  it('refuses an --out path it cannot write before anything is charged', async () => {
    box = sandbox(api.url, { OKDATA_API_KEY: KEY });
    api.handle(() => ({ body: pageBody([{ id: 'a' }]) }));
    const r = await box.run(['call', 'douyin.videos.search', 'query=x', '--out', 'no/such/dir/items.jsonl']);
    expect(r.code).toBe(1);
    expect(r.err).toContain('cannot write --out');
    expect(api.seen).toHaveLength(0);
  });

  it('run caps a step at what is left, counts a charged not_found, and exits 3 on a partial result', async () => {
    box = sandbox(api.url, { OKDATA_API_KEY: KEY });
    const plan = join(box.dir, 'p.json');
    writeFileSync(plan, JSON.stringify([
      { capability: 'x.posts.get', params: { id: '1', max_price: '0.5' } },
      { capability: 'x.posts.get', params: { id: 'gone' } },
      { capability: 'x.users.get', params: { ids: ['1', 'missing'] } },
    ]));
    api.handle((req) => (req.query.get('id') === 'gone'
      ? { status: 404, body: { ...errorReplyBody('not_found'), charged: true, amount: '0.0003' } }
      : req.method === 'POST' ? { body: batchBody([{ id: '1' }], [{ id: 'missing', reason: 'not_found' }]) } : { body: itemBody({ id: '1' }, { amount: '0.0003' }) }));
    const r = await box.run(['run', 'p.json', '--yes', '--max-spend', '0.1', '--json']);
    expect(api.seen[0]!.headers['x-max-price']).toBe('0.1');
    expect(r.code).toBe(3);
    expect(JSON.parse(r.out).spent).toBe('0.0006');
  });

  it('setup writes through a symlinked file and writes nothing when a later file is broken', async () => {
    box = sandbox('https://api.okdata.online');
    mkdirSync(join(box.home, '.cursor'), { recursive: true });
    const real = join(box.dir, 'dotfiles-claude.json');
    writeFileSync(real, '{}');
    symlinkSync(real, join(box.home, '.claude.json'));
    expect((await box.run(['setup', '--client', 'claude-code'])).code).toBe(0);
    expect(lstatSync(join(box.home, '.claude.json')).isSymbolicLink()).toBe(true);
    expect(JSON.parse(readFileSync(real, 'utf8')).mcpServers.okdata.url).toBe('https://api.okdata.online/mcp');
    writeFileSync(real, '{}');
    writeFileSync(join(box.home, '.cursor', 'mcp.json'), 'not json');
    expect((await box.run(['setup', '--client', 'claude-code,cursor'])).code).toBe(1);
    expect(readFileSync(real, 'utf8')).toBe('{}');
  });

  it('mergeToml finds the table with spaces around the dot', () => {
    expect(mergeToml('[ mcp_servers . okdata ]\nurl = "old"\n', '[mcp_servers.okdata]\nurl = "new"')).toBe('[mcp_servers.okdata]\nurl = "new"\n');
  });
});

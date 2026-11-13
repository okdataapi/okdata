// The bridge against a fake remote server: what it forwards, what it adds (key, user agent, X-Entry,
// an idempotency_key for call) and how failures reach the agent.
import { PassThrough } from 'node:stream';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { buildServer, connectRemote, serve } from '../src/bridge.js';
import { configFromEnv, type BridgeConfig } from '../src/config.js';
import { VERSION } from '../src/version.js';
import { INSTRUCTIONS, startFakeRemote, TOOLS, type FakeRemote } from './fake-remote.js';

const KEY = 'okd_bridge_test_0123456789';
let fake: FakeRemote;
let open: Array<{ close(): Promise<void> }> = [];

beforeAll(async () => { fake = await startFakeRemote(); });
afterAll(async () => { await fake.close(); });
beforeEach(() => { fake.seen.length = 0; });
afterEach(async () => {
  await Promise.allSettled(open.map((c) => c.close()));
  open = [];
});

/** An MCP client talking to the bridge in memory, the bridge talking to the fake remote over HTTP. */
async function connect(env: Record<string, string> = {}): Promise<{ client: Client; config: BridgeConfig }> {
  const config = configFromEnv({ OKDATA_MCP_URL: fake.url, ...env });
  const remote = await connectRemote(config);
  const server = buildServer(remote, config);
  const [here, there] = InMemoryTransport.createLinkedPair();
  await server.connect(there);
  const client = new Client({ name: 'test-client', version: '1.0.0' });
  await client.connect(here);
  open.push(client, server, remote);
  return { client, config };
}

const text = (r: unknown): string => ((r as CallToolResult).content[0] as { text: string }).text;

describe('okdata-mcp bridge', () => {
  it('forwards the tool list, the server identity and its instructions', async () => {
    const { client } = await connect({ OKDATA_API_KEY: KEY });
    expect(client.getServerVersion()).toMatchObject({ name: 'okdata', version: 'rev-test' });
    expect(client.getInstructions()).toBe(INSTRUCTIONS);
    expect(client.getServerCapabilities()?.tools).toBeDefined();
    const { tools } = await client.listTools();
    expect(tools).toEqual(TOOLS);
  });

  it('sends the key, its user agent and X-Entry; the remote learns the client as okdata-mcp', async () => {
    const { client } = await connect({ OKDATA_API_KEY: KEY });
    await client.callTool({ name: 'find', arguments: { query: '小红书 评论' } });
    const init = fake.seen.find((s) => s.body.method === 'initialize')!;
    expect(init.body.params?.clientInfo).toEqual({ name: 'okdata-mcp', version: VERSION });
    for (const s of fake.seen) {
      expect(s.headers.authorization).toBe(`Bearer ${KEY}`);
      expect(s.headers['user-agent']).toMatch(new RegExp(`^okdata-mcp/${VERSION.replace(/\./g, '\\.')} node/`));
      expect(s.headers['x-entry']).toBe('mcp-stdio');
    }
    expect(fake.calls()[0]!.headers['mcp-session-id']).toBe('ok1.test');
  });

  it('forwards a call as it is, adding an idempotency_key only when it has none', async () => {
    const { client } = await connect({ OKDATA_API_KEY: KEY });
    const found = await client.callTool({ name: 'find', arguments: { query: 'x' } });
    expect(found.isError).toBeFalsy();
    expect(text(found)).toBe('find {"query":"x"}');

    await client.callTool({ name: 'call', arguments: { capability: 'weibo.trends.list' } });
    await client.callTool({ name: 'call', arguments: { capability: 'weibo.trends.list', idempotency_key: 'mine-1' } });
    const [first, second] = fake.calls().slice(1).map((s) => s.body.params!.arguments!);
    expect(first).toEqual({ capability: 'weibo.trends.list', idempotency_key: expect.stringMatching(/^okdata-mcp-[0-9a-f-]{36}$/) });
    expect(second).toEqual({ capability: 'weibo.trends.list', idempotency_key: 'mine-1' });
    expect(fake.calls()[0]!.body.params!.arguments).toEqual({ query: 'x' }); // only call gets one
  });

  it('without a key: sends no Authorization, free tools work, and a paid tool says how to add a key', async () => {
    const { client } = await connect();
    expect(text(await client.callTool({ name: 'find', arguments: { query: 'x' } }))).toBe('find {"query":"x"}');
    const paid = await client.callTool({ name: 'call', arguments: { capability: 'douyin.videos.search', query: 'x' } });
    expect(paid.isError).toBe(true);
    expect(text(paid)).toContain('call needs an okdata API key');
    expect(text(paid)).toContain('OKDATA_API_KEY');
    expect(text(paid)).toContain('https://okdata.online/console/');
    expect(fake.seen.every((s) => s.headers.authorization === undefined)).toBe(true);
  });

  it('passes isError results on, and turns the remote\'s JSON-RPC errors into tool errors in its own words', async () => {
    const { client } = await connect({ OKDATA_API_KEY: KEY });
    const failed = await client.callTool({ name: 'call', arguments: { capability: 'x.fails' } });
    expect(failed.isError).toBe(true);
    expect(text(failed)).toContain('call {"capability":"x.fails"');
    const unknown = await client.callTool({ name: 'nope', arguments: {} });
    expect(unknown.isError).toBe(true);
    expect(text(unknown)).toBe('Tool nope not found. Tools: find, call.');
  });

  it('a lost answer says what to do (for call: resend with its idempotency_key), and the bridge keeps working', async () => {
    const { client } = await connect({ OKDATA_API_KEY: KEY });
    const lost = await client.callTool({ name: 'drop', arguments: {} });
    expect(lost.isError).toBe(true);
    expect(text(lost)).toMatch(/^okdata-mcp got no usable answer from http:\/\/127\.0\.0\.1:\d+\/mcp \(.+\)\. drop is free: try again\.$/);

    const paid = await client.callTool({ name: 'call', arguments: { capability: 'x.drop' } });
    const sent = fake.calls().at(-1)!.body.params!.arguments!.idempotency_key as string;
    expect(paid.isError).toBe(true);
    expect(text(paid)).toContain('The call may have run and been charged');
    expect(text(paid)).toContain(`send the same call again with idempotency_key "${sent}"`);

    expect(text(await client.callTool({ name: 'find', arguments: { query: 'after' } }))).toBe('find {"query":"after"}');
  });

  it('fails to start with the address when the remote cannot be reached', async () => {
    const config = configFromEnv({ OKDATA_MCP_URL: 'http://127.0.0.1:9/mcp' });
    await expect(connectRemote(config)).rejects.toThrow(/^could not reach http:\/\/127\.0\.0\.1:9\/mcp: /);
  });

  it('serves MCP as newline-delimited JSON on stdio streams', async () => {
    const stdin = new PassThrough();
    const stdout = new PassThrough();
    const bridge = await serve(configFromEnv({ OKDATA_MCP_URL: fake.url, OKDATA_API_KEY: KEY }), { stdin, stdout });
    open.push(bridge);
    const lines: string[] = [];
    let buffered = '';
    stdout.on('data', (chunk: Buffer) => {
      buffered += chunk.toString('utf8');
      const parts = buffered.split('\n');
      buffered = parts.pop()!;
      lines.push(...parts);
    });
    const reply = async (id: number) => {
      for (let i = 0; i < 200; i += 1) {
        const found = lines.map((l) => JSON.parse(l) as { id?: number }).find((m) => m.id === id);
        if (found) return found as { result?: Record<string, unknown> };
        await new Promise((r) => setTimeout(r, 10));
      }
      throw new Error(`no reply to ${id}; got ${lines.join('\n')}`);
    };
    const send = (m: object) => stdin.write(`${JSON.stringify({ jsonrpc: '2.0', ...m })}\n`);
    send({ id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'raw', version: '0' } } });
    expect((await reply(1)).result).toMatchObject({ serverInfo: { name: 'okdata' }, instructions: INSTRUCTIONS });
    send({ method: 'notifications/initialized' });
    send({ id: 2, method: 'tools/call', params: { name: 'find', arguments: { query: 'stdio' } } });
    expect((await reply(2)).result).toEqual({ content: [{ type: 'text', text: 'find {"query":"stdio"}' }] });
  });
});

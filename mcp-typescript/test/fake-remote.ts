// A local stand-in for the remote okdata MCP server (https://api.okdata.online/mcp): real HTTP on
// 127.0.0.1, stateless JSON-RPC over POST with JSON answers, like the hosted one. It logs the headers and
// body of every request so tests can check what the bridge sent.
import { createServer, type IncomingHttpHeaders, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';

export const INSTRUCTIONS = 'okdata returns public data from social platforms. find, describe and account status work without a key.';

export const TOOLS = [
  {
    name: 'find', description: 'Find a capability. Free, no key.',
    inputSchema: { type: 'object', properties: { query: { type: 'string' } }, additionalProperties: false },
  },
  {
    name: 'call', description: 'Call a capability. Needs an API key.',
    inputSchema: { type: 'object', properties: { capability: { type: 'string' }, idempotency_key: { type: 'string' } }, required: ['capability'], additionalProperties: false },
    annotations: { readOnlyHint: false, openWorldHint: true },
  },
];

export interface Seen {
  headers: IncomingHttpHeaders;
  body: { method?: string; id?: number | string; params?: { name?: string; arguments?: Record<string, unknown>; [k: string]: unknown } };
}

interface Answer {
  status: number;
  body?: unknown;
  headers?: Record<string, string>;
}

/**
 * tools/call: `find` echoes its arguments; `call` answers 401 without a key (as the API does), else
 * echoes, with isError for capability "x.fails"; `drop` (or a call of "x.drop") closes the connection
 * without an answer; any other name is a JSON-RPC error.
 */
function answer(seen: Seen): Answer | 'drop' {
  const { method, id, params = {} } = seen.body;
  const ok = (result: unknown): Answer => ({ status: 200, body: { jsonrpc: '2.0', id, result } });
  if (id === undefined) return { status: 202 };
  if (method === 'initialize') {
    return {
      ...ok({ protocolVersion: params.protocolVersion, capabilities: { tools: {} }, serverInfo: { name: 'okdata', version: 'rev-test' }, instructions: INSTRUCTIONS }),
      headers: { 'mcp-session-id': 'ok1.test' },
    };
  }
  if (method === 'tools/list') return ok({ tools: TOOLS });
  if (method !== 'tools/call') return { status: 200, body: { jsonrpc: '2.0', id, error: { code: -32601, message: 'Method not found' } } };
  const { name, arguments: args = {} } = params;
  if (name === 'drop') return 'drop';
  if (name === 'call' && !seen.headers.authorization) {
    return {
      status: 401,
      body: { jsonrpc: '2.0', id, error: { code: -32600, message: 'call needs a credential: sign in through OAuth, or send an API key as Authorization: Bearer okd_...' } },
      headers: { 'www-authenticate': 'Bearer resource_metadata="x", scope="mcp"' },
    };
  }
  if (args.capability === 'x.drop') return 'drop';
  if (name === 'find' || name === 'call') {
    const text = `${name} ${JSON.stringify(args, Object.keys(args).sort())}`;
    return ok({ content: [{ type: 'text', text }], ...(args.capability === 'x.fails' ? { isError: true } : {}) });
  }
  return { status: 200, body: { jsonrpc: '2.0', id, error: { code: -32602, message: `Tool ${name} not found. Tools: find, call.` } } };
}

export interface FakeRemote {
  url: string;
  seen: Seen[];
  /** The tools/call requests seen so far. */
  calls(): Seen[];
  close(): Promise<void>;
}

export async function startFakeRemote(): Promise<FakeRemote> {
  const seen: Seen[] = [];
  const server: Server = createServer((req, res) => {
    if (req.method !== 'POST') {
      res.writeHead(405, { 'content-type': 'application/json', allow: 'POST' }).end(JSON.stringify({ jsonrpc: '2.0', error: { code: -32000, message: 'Method not allowed.' }, id: null }));
      return;
    }
    let raw = '';
    req.on('data', (chunk: Buffer) => { raw += chunk.toString('utf8'); });
    req.on('end', () => {
      const entry: Seen = { headers: req.headers, body: JSON.parse(raw) as Seen['body'] };
      seen.push(entry);
      const a = answer(entry);
      if (a === 'drop') {
        req.socket.destroy();
        return;
      }
      if (a.body === undefined) res.writeHead(a.status, a.headers).end();
      else res.writeHead(a.status, { 'content-type': 'application/json', ...a.headers }).end(JSON.stringify(a.body));
    });
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  return {
    url: `http://127.0.0.1:${port}/mcp`,
    seen,
    calls: () => seen.filter((s) => s.body.method === 'tools/call'),
    close: () => new Promise((resolve) => {
      server.closeAllConnections();
      server.close(() => resolve());
    }),
  };
}

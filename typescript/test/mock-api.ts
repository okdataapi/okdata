// A local stand-in for api.okdata.online: answers like the real API, records every request and
// plays back scripted answers (errors, dropped connections) in order. No real key, no network.
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import { randomUUID } from 'node:crypto';
import { ENDPOINTS } from '../src/index.js';

export const TEST_KEY = 'okd_test_0000000000000000';

export interface Recorded {
  method: string;
  path: string;
  query: Record<string, string>;
  headers: Record<string, string | string[] | undefined>;
  body: unknown;
}

export interface Scripted {
  status?: number;
  body?: unknown;
  raw?: string;
  headers?: Record<string, string>;
  drop?: boolean;
}

export function okEnvelope(endpoint: string, opts: { items?: unknown[]; item?: unknown; nextCursor?: string | null; amount?: string; replayed?: boolean }): Record<string, unknown> {
  const body: Record<string, unknown> = {
    code: 'ok',
    request_id: randomUUID(),
    warnings: [],
    meta: {
      capability: endpoint,
      billing: { amount: opts.amount ?? '0.002', currency: 'USD', balance_after: '0.9' },
      unavailable: {},
      cached: false,
      replayed: opts.replayed ?? false,
      fetched_at: '2026-11-12T08:00:00Z',
    },
  };
  if (opts.items) {
    body.data = { items: opts.items };
    body.page = { next_cursor: opts.nextCursor ?? null, has_more: Boolean(opts.nextCursor) };
  } else {
    body.data = { item: opts.item ?? null };
  }
  return body;
}

export const errorBody = (code: string, opts: { retry?: string; charged?: boolean | null; retryAfterSeconds?: number | null; message?: string } = {}) => ({
  code,
  message: opts.message ?? 'scripted',
  request_id: randomUUID(),
  charged: opts.charged === undefined ? false : opts.charged,
  retry: opts.retry ?? 'no',
  retry_after_seconds: opts.retryAfterSeconds ?? null,
});

export class MockApi {
  readonly requests: Recorded[] = [];
  readonly #script = new Map<string, Scripted[]>();
  readonly #server: Server;

  private constructor() {
    this.#server = createServer((req, res) => { void this.#handle(req, res); });
  }

  static async start(): Promise<MockApi> {
    const api = new MockApi();
    await new Promise<void>((resolve) => api.#server.listen(0, '127.0.0.1', resolve));
    return api;
  }

  get url(): string {
    const { port } = this.#server.address() as AddressInfo;
    return `http://127.0.0.1:${port}`;
  }

  close(): Promise<void> {
    this.#server.closeAllConnections();
    return new Promise((resolve) => this.#server.close(() => resolve()));
  }

  script(path: string, ...answers: Scripted[]): void {
    this.#script.set(path, [...(this.#script.get(path) ?? []), ...answers]);
  }

  #default(rec: Recorded): Scripted {
    if (rec.path === '/v1/catalog' || rec.path === '/v1/catalog/status') {
      return { body: { code: 'ok', request_id: randomUUID(), warnings: [], data: { revision: '0.1.0', summary: { available: Object.keys(ENDPOINTS).length, paused: 0 } } } };
    }
    if (rec.headers.authorization !== `Bearer ${TEST_KEY}`) return { status: 401, body: errorBody('unauthorized', { retry: 'after_fix' }) };
    if (rec.path === '/v1/account') return { body: { code: 'ok', request_id: randomUUID(), warnings: [], data: { balance: '0.9', currency: 'USD' } } };
    const info = Object.values(ENDPOINTS).find((e) => e.path === rec.path);
    if (!info) return { status: 404, body: errorBody('unknown_endpoint') };
    return info.list
      ? { body: okEnvelope(info.id, { items: [{ id: '1', text: 'hello' }], amount: info.price }) }
      : { body: okEnvelope(info.id, { item: { id: '1', text: 'hello' }, amount: info.price }) };
  }

  async #handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const chunks: Buffer[] = [];
    for await (const chunk of req) chunks.push(chunk as Buffer);
    const raw = Buffer.concat(chunks).toString('utf8');
    const url = new URL(req.url ?? '/', 'http://localhost');
    const rec: Recorded = {
      method: req.method ?? 'GET',
      path: url.pathname,
      query: Object.fromEntries(url.searchParams),
      headers: req.headers,
      body: raw ? JSON.parse(raw) : undefined,
    };
    this.requests.push(rec);
    const queue = this.#script.get(rec.path);
    const answer = queue?.shift() ?? this.#default(rec);
    if (answer.drop) {
      req.socket.destroy();
      return;
    }
    const payload = answer.raw ?? JSON.stringify(answer.body);
    res.writeHead(answer.status ?? 200, { 'Content-Type': answer.raw ? 'text/html' : 'application/json', ...answer.headers });
    res.end(payload);
  }
}

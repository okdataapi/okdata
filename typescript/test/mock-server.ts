// A local stand-in for the API: real HTTP on 127.0.0.1, a scripted answer per request, and a log of
// what came in. Bodies follow docs/contract.md (success envelope, 9-field errors).
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import { ERRORS, type ErrorCode } from '../src/generated/errors.js';

export interface Seen {
  method: string;
  path: string;
  query: URLSearchParams;
  headers: IncomingMessage['headers'];
  body: unknown;
}

export interface Reply {
  status?: number;
  body?: unknown;
  /** Raw text instead of JSON (a proxy page). */
  text?: string;
  headers?: Record<string, string>;
  /** Drop the connection without answering. */
  destroy?: boolean;
  /** Wait this long before answering. */
  delayMs?: number;
}

export type Handler = (req: Seen, n: number) => Reply | Promise<Reply>;

export interface MockApi {
  url: string;
  seen: Seen[];
  /** Replace the handler; n counts requests from 0. */
  handle(h: Handler): void;
  close(): Promise<void>;
}

async function readBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const c of req) chunks.push(c as Buffer);
  const text = Buffer.concat(chunks).toString('utf8');
  return text ? JSON.parse(text) : undefined;
}

export async function startMock(handler: Handler = () => ({ status: 404, body: apiError('unknown_endpoint') })): Promise<MockApi> {
  let current = handler;
  const seen: Seen[] = [];
  const server: Server = createServer((req: IncomingMessage, res: ServerResponse) => {
    void (async () => {
      const url = new URL(req.url ?? '/', 'http://127.0.0.1');
      const entry: Seen = { method: req.method ?? 'GET', path: url.pathname, query: url.searchParams, headers: req.headers, body: await readBody(req) };
      seen.push(entry);
      const reply = await current(entry, seen.length - 1);
      if (reply.delayMs) await new Promise((r) => setTimeout(r, reply.delayMs));
      if (reply.destroy) { req.socket.destroy(); return; }
      const text = reply.text ?? JSON.stringify(reply.body ?? {});
      res.writeHead(reply.status ?? 200, { 'Content-Type': reply.text ? 'text/html' : 'application/json; charset=utf-8', ...reply.headers });
      res.end(text);
    })();
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  return {
    url: `http://127.0.0.1:${port}`,
    seen,
    handle: (h) => { current = h; },
    close: () => new Promise((resolve) => { server.closeAllConnections(); server.close(() => resolve()); }),
  };
}

let ids = 0;
const requestId = () => `00000000-0000-4000-8000-${String(++ids).padStart(12, '0')}`;

export interface PageOpts {
  amount?: string;
  balance?: string;
  next?: string | null;
  capability?: string;
  status?: 'complete' | 'partial' | 'empty';
  replayed?: boolean;
  coversNext?: false;
  warnings?: unknown[];
}

const meta = (o: PageOpts) => ({
  capability: o.capability ?? 'douyin.videos.search',
  result_status: o.status ?? 'complete',
  billing: { amount: o.amount ?? '0.02', currency: 'USD', balance_after: o.balance ?? '9.98', ...(o.coversNext === false ? { covers_next: false, top_up_url: 'https://okdata.online/console/billing/' } : {}) },
  unavailable: {},
  cached: false,
  replayed: o.replayed ?? false,
  fetched_at: '2026-11-12T00:00:00Z',
});

export function pageBody(items: unknown[], o: PageOpts = {}) {
  const next = o.next === undefined ? null : o.next;
  return {
    code: 'ok', request_id: requestId(), data: { items },
    page: { next_cursor: next, cursor_expires_at: next ? '2026-11-13T00:00:00Z' : null, has_more: next !== null, returned: items.length },
    warnings: o.warnings ?? [], meta: meta(o),
  };
}

export const itemBody = (item: unknown, o: PageOpts = {}) =>
  ({ code: 'ok', request_id: requestId(), data: { item }, warnings: [], meta: meta(o) });

export const batchBody = (items: unknown[], missing: unknown[], o: PageOpts = {}) =>
  ({ code: 'ok', request_id: requestId(), data: { items, missing }, warnings: [], meta: meta({ status: missing.length ? 'partial' : 'complete', ...o }) });

export const plainBody = (data: unknown) => ({ code: 'ok', request_id: requestId(), data, warnings: [] });

export function apiError(code: ErrorCode, extra: Record<string, unknown> = {}) {
  const doc = ERRORS[code];
  return {
    code, request_id: requestId(), message: `message for ${code}`, message_zh: `${code} 的中文`,
    charged: doc.charged, retry: doc.retry, retry_after_seconds: null, param: null,
    docs_url: `https://okdata.online/docs/errors/#${code}`, ...extra,
  };
}

/** A reply carrying an API error with its contract HTTP status. */
export const errorReply = (code: ErrorCode, extra: Record<string, unknown> = {}): Reply & { body: Record<string, unknown> } =>
  ({ status: ERRORS[code].http, body: apiError(code, extra) });

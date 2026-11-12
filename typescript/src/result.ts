// Success envelopes as typed results (Page, Item, Batch) and error bodies as OkDataError.
import { OkDataError } from './errors.js';
import type { RetryAdvice } from './generated/errors.js';
import type { AnyResult, Envelope, Meta } from './types.js';

type Json = Record<string, unknown>;

const RETRY: readonly RetryAdvice[] = ['no', 'yes', 'once', 'after_fix', 'same_key'];
const RETRY_STATUSES = new Set([429, 500, 502, 503, 504]);

/** A non-negative number of seconds, or null. */
export function seconds(value: unknown): number | null {
  const n = typeof value === 'number' ? value : typeof value === 'string' && value.trim() !== '' ? Number(value) : NaN;
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export function toResult(body: Envelope, idempotencyKey: string | null): AnyResult {
  const meta = (body.meta ?? {}) as Meta;
  const billing = meta.billing ?? { amount: '0', currency: 'USD', balance_after: '' };
  const data = (body.data ?? {}) as Envelope['data'];
  const base = {
    requestId: body.request_id,
    capability: meta.capability,
    resultStatus: meta.result_status ?? 'complete',
    cost: billing.amount ?? '0',
    balanceAfter: billing.balance_after || null,
    replayed: meta.replayed === true,
    cached: meta.cached === true,
    unavailable: meta.unavailable ?? {},
    warnings: Array.isArray(body.warnings) ? body.warnings : [],
    meta,
    idempotencyKey,
    raw: body,
  };
  if (Array.isArray(data.items) && body.page) {
    const page = body.page;
    return {
      ...base, kind: 'page', items: data.items as Json[], nextCursor: page.next_cursor ?? null,
      cursorExpiresAt: page.cursor_expires_at ?? null, hasMore: page.has_more === true && page.next_cursor != null,
      returned: page.returned ?? data.items.length,
    };
  }
  if (Array.isArray(data.items)) {
    return { ...base, kind: 'batch', items: data.items as Json[], missing: Array.isArray(data.missing) ? data.missing : [] };
  }
  return { ...base, kind: 'item', item: (data.item ?? null) as Json };
}

interface Answer {
  status: number;
  headers: Headers;
  text: string;
}

/** The success envelope of an answer, or the OkDataError it carries. */
export function parseAnswer(res: Answer, idempotencyKey: string | null): Json {
  let parsed: unknown;
  try {
    parsed = res.text ? JSON.parse(res.text) : undefined;
  } catch {
    parsed = undefined;
  }
  const body = (parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null) as Json | null;
  if (body?.code === 'ok' && res.status < 400) return body;
  const retryAfterHeader = seconds(res.headers.get('retry-after'));
  if (body && typeof body.code === 'string') {
    const advice = RETRY.includes(body.retry as RetryAdvice) ? (body.retry as RetryAdvice) : 'no';
    return throwError(new OkDataError({
      code: body.code,
      message: typeof body.message === 'string' ? body.message : body.code,
      status: res.status,
      requestId: typeof body.request_id === 'string' ? body.request_id : res.headers.get('x-request-id'),
      charged: body.charged === undefined ? false : (body.charged as boolean | null),
      retry: advice,
      retryAfterSeconds: seconds(body.retry_after_seconds) ?? retryAfterHeader,
      idempotencyKey,
      body,
    }));
  }
  // Not an okdata answer: a proxy page or a cut connection. A 5xx may have run the call.
  return throwError(new OkDataError({
    code: 'bad_response',
    message: `HTTP ${res.status} without an okdata answer`,
    status: res.status,
    requestId: res.headers.get('x-request-id'),
    charged: res.status >= 500 || res.status < 300 ? null : false,
    retry: res.status < 300 ? 'same_key' : RETRY_STATUSES.has(res.status) ? 'yes' : 'no',
    retryAfterSeconds: retryAfterHeader,
    idempotencyKey,
  }));
}

function throwError(err: OkDataError): never {
  throw err;
}

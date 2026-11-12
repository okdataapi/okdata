// Errors the client throws. Every API error says whether it was charged and whether to retry;
// branch on `code` (and `reason`), never on `message`.
import type { ErrorCode, RetryAdvice } from './generated/errors.js';

export type { ErrorCode, RetryAdvice } from './generated/errors.js';

/** Codes the client makes itself: no okdata answer came back, or it was not one. */
export type ClientErrorCode = 'connection_error' | 'client_timeout' | 'bad_response';

export interface OkDataErrorInit {
  code: ErrorCode | ClientErrorCode | (string & {});
  message: string;
  status?: number | null;
  requestId?: string | null;
  charged?: boolean | null;
  retry?: RetryAdvice;
  retryAfterSeconds?: number | null;
  idempotencyKey?: string | null;
  body?: Record<string, unknown> | null;
  cause?: unknown;
}

type Body = Record<string, unknown>;

const str = (body: Body, key: string): string | null => (typeof body[key] === 'string' ? (body[key] as string) : null);

/**
 * An error answer from the API, or a call that got none.
 *
 * `charged` is false for almost every error, true for a not_found that the endpoint charges (then
 * `amount` says how much), and null when it is not known (a lost answer, settlement_unknown): look
 * the call up with `ok.calls.get(requestId)` or `ok.calls.byKey(idempotencyKey)`.
 */
export class OkDataError extends Error {
  readonly code: string;
  readonly status: number | null;
  readonly requestId: string | null;
  readonly charged: boolean | null;
  readonly retry: RetryAdvice;
  readonly retryAfterSeconds: number | null;
  /** The fixed Chinese sentence for this code. */
  readonly messageZh: string | null;
  /** What exactly was wrong, one sentence each. */
  readonly problems: string[];
  /** The parameter or header at fault. */
  readonly param: string | null;
  /** A machine-readable detail: rate / concurrency, day / month / total, key_disabled, ... */
  readonly reason: string | null;
  readonly docsUrl: string | null;
  /** US dollars: what was charged (charged true), what the call could cost, the balance. */
  readonly amount: string | null;
  readonly required: string | null;
  readonly available: string | null;
  readonly topUpUrl: string | null;
  readonly nextStep: string | null;
  readonly nextStepZh: string | null;
  /** The Idempotency-Key the call was sent with; resend with it to never pay twice. */
  readonly idempotencyKey: string | null;
  /** The error body as the API sent it (null when there was none). */
  readonly body: Body | null;

  constructor(init: OkDataErrorInit) {
    super(init.message, init.cause === undefined ? undefined : { cause: init.cause });
    this.name = 'OkDataError';
    const body = init.body ?? {};
    this.code = init.code;
    this.status = init.status ?? null;
    this.requestId = init.requestId ?? null;
    this.charged = init.charged === undefined ? false : init.charged;
    this.retry = init.retry ?? 'no';
    this.retryAfterSeconds = init.retryAfterSeconds ?? null;
    this.messageZh = str(body, 'message_zh');
    this.problems = Array.isArray(body.problems) ? body.problems.map(String) : [];
    this.param = str(body, 'param');
    this.reason = str(body, 'reason');
    this.docsUrl = str(body, 'docs_url');
    this.amount = str(body, 'amount');
    this.required = str(body, 'required');
    this.available = str(body, 'available');
    this.topUpUrl = str(body, 'top_up_url');
    this.nextStep = str(body, 'next_step');
    this.nextStepZh = str(body, 'next_step_zh');
    this.idempotencyKey = init.idempotencyKey ?? null;
    this.body = init.body ?? null;
  }

  /** The same error with a different charge state or key (the class keeps its fields read-only). */
  with(changes: Pick<OkDataErrorInit, 'charged' | 'idempotencyKey'>): OkDataError {
    return new OkDataError({
      code: this.code, message: this.message, status: this.status, requestId: this.requestId,
      charged: changes.charged === undefined ? this.charged : changes.charged, retry: this.retry,
      retryAfterSeconds: this.retryAfterSeconds, body: this.body,
      idempotencyKey: changes.idempotencyKey === undefined ? this.idempotencyKey : changes.idempotencyKey,
      cause: this.cause,
    });
  }

  toJSON(): Record<string, unknown> {
    return {
      ...(this.body ?? {}),
      code: this.code,
      message: this.message,
      status: this.status,
      request_id: this.requestId,
      charged: this.charged,
      retry: this.retry,
      retry_after_seconds: this.retryAfterSeconds,
      idempotency_key: this.idempotencyKey,
    };
  }
}

/** No answer came back (network failure or the client's own timeout); whether the call ran is unknown. */
export class OkDataConnectionError extends OkDataError {
  constructor(message: string, code: 'connection_error' | 'client_timeout', idempotencyKey: string | null, cause?: unknown) {
    super({ code, message, charged: null, retry: 'same_key', idempotencyKey, cause });
    this.name = 'OkDataConnectionError';
  }
}

export const isOkDataError = (err: unknown): err is OkDataError => err instanceof OkDataError;

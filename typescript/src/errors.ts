// Errors thrown by the client. Every API error says whether it was charged and whether to retry.

export type RetryAdvice = 'no' | 'yes' | 'after_fix' | 'same_key';

export interface OkDataErrorInit {
  code: string;
  status?: number | null;
  requestId?: string | null;
  charged?: boolean | null;
  retry?: RetryAdvice;
  retryAfterSeconds?: number | null;
  body?: unknown;
  cause?: unknown;
}

/**
 * An error answer from the API, or a request that never got one.
 * `charged` is false for every API error and null when it is not known yet (a timeout); retrying with
 * the same Idempotency-Key can never charge twice.
 */
export class OkDataError extends Error {
  readonly code: string;
  readonly status: number | null;
  readonly requestId: string | null;
  readonly charged: boolean | null;
  readonly retry: RetryAdvice;
  readonly retryAfterSeconds: number | null;
  readonly body: unknown;

  constructor(message: string, init: OkDataErrorInit) {
    super(message, init.cause === undefined ? undefined : { cause: init.cause });
    this.name = 'OkDataError';
    this.code = init.code;
    this.status = init.status ?? null;
    this.requestId = init.requestId ?? null;
    this.charged = init.charged === undefined ? false : init.charged;
    this.retry = init.retry ?? 'no';
    this.retryAfterSeconds = init.retryAfterSeconds ?? null;
    this.body = init.body;
  }

  /** true when sending the same request again may succeed. */
  get retryable(): boolean {
    return this.retry === 'yes' || this.retry === 'same_key';
  }
}

/** No answer came back (network failure or client-side timeout); whether the call ran is unknown. */
export class OkDataConnectionError extends OkDataError {
  constructor(message: string, code: 'connection_error' | 'client_timeout', cause?: unknown) {
    super(message, { code, charged: null, retry: 'same_key', cause });
    this.name = 'OkDataConnectionError';
  }
}

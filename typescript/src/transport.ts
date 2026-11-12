// One logical request: the same Idempotency-Key on every attempt, retries as the error body says,
// a per-attempt timeout, and the charge marked unknown when an earlier attempt's fate is.
import { OkDataConnectionError, OkDataError } from './errors.js';
import { parseAnswer } from './result.js';
import { leavesOutcomeOpen, retryDelay, type RetryPolicy } from './retry.js';

export interface TransportConfig extends RetryPolicy {
  baseUrl: string;
  apiKey: string | undefined;
  timeoutMs: number;
  headers: Record<string, string>;
  fetch: typeof fetch;
  sleep: (ms: number) => Promise<void>;
}

export interface SendInput {
  method: 'GET' | 'POST';
  path: string;
  query?: ReadonlyArray<readonly [string, string]>;
  body?: unknown;
  idempotencyKey?: string | null;
  maxPrice?: string;
  /** false: send no Authorization header (the free catalog routes, the CLI link). */
  auth?: boolean;
  signal?: AbortSignal;
  timeoutMs?: number;
}

type Json = Record<string, unknown>;

function headersFor(cfg: TransportConfig, input: SendInput): Record<string, string> {
  const headers: Record<string, string> = { Accept: 'application/json', ...cfg.headers };
  if (input.auth !== false && cfg.apiKey) headers.Authorization = `Bearer ${cfg.apiKey}`;
  if (input.idempotencyKey) headers['Idempotency-Key'] = input.idempotencyKey;
  if (input.maxPrice !== undefined) headers['X-Max-Price'] = input.maxPrice;
  if (input.body !== undefined) headers['Content-Type'] = 'application/json';
  return headers;
}

async function attempt(cfg: TransportConfig, url: URL, input: SendInput): Promise<Json> {
  const timeout = AbortSignal.timeout(input.timeoutMs ?? cfg.timeoutMs);
  const signal = input.signal ? AbortSignal.any([input.signal, timeout]) : timeout;
  const key = input.idempotencyKey ?? null;
  let res: Response;
  let text: string;
  try {
    res = await cfg.fetch(url, {
      method: input.method,
      headers: headersFor(cfg, input),
      body: input.body === undefined ? undefined : JSON.stringify(input.body),
      signal,
    });
    text = await res.text(); // a body that stalls counts as a lost answer too
  } catch (err) {
    if (input.signal?.aborted) throw err; // the caller cancelled: no retry, no wrapping
    if (timeout.aborted) throw new OkDataConnectionError(`no answer from ${cfg.baseUrl} within ${input.timeoutMs ?? cfg.timeoutMs} ms`, 'client_timeout', key, err);
    const reason = err instanceof Error ? (err.cause instanceof Error ? err.cause.message : err.message) : String(err);
    throw new OkDataConnectionError(`could not reach ${cfg.baseUrl}: ${reason}`, 'connection_error', key, err);
  }
  return parseAnswer({ status: res.status, headers: res.headers, text }, key);
}

/** Sends one request (with its retries) and returns the success envelope, or throws OkDataError. */
export async function send(cfg: TransportConfig, input: SendInput): Promise<Json> {
  const url = new URL(cfg.baseUrl + input.path);
  for (const [k, v] of input.query ?? []) url.searchParams.append(k, v);
  let open = false; // an earlier attempt may have run, unseen
  for (let retries = 0; ; retries += 1) {
    try {
      return await attempt(cfg, url, input);
    } catch (err) {
      if (!(err instanceof OkDataError)) throw err;
      open ||= leavesOutcomeOpen(err);
      const delay = retryDelay(err, retries, cfg);
      if (delay === null) throw open && err.charged === false ? err.with({ charged: null }) : err;
      await cfg.sleep(delay);
    }
  }
}

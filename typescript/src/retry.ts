// When to send a call again, driven by the error body's `retry` and `retry_after_seconds`:
// yes / same_key: retry (same Idempotency-Key, so never charged twice); once: one more try at most;
// no / after_fix: never.
import type { OkDataError } from './errors.js';

export interface RetryPolicy {
  /** Retries after the first attempt. */
  maxRetries: number;
  /** First backoff step when the server names no wait. */
  baseDelayMs: number;
  /** A server-named wait longer than this is not slept through: the error is thrown instead. */
  maxDelayMs: number;
}

/** call_in_progress carries no wait; the call it waits on usually ends within seconds. */
const IN_PROGRESS_MIN_MS = 1_000;

/**
 * Milliseconds to wait before the next attempt, or null to stop.
 * `attempt` counts the retries already made (0 after the first failure).
 */
export function retryDelay(err: OkDataError, attempt: number, policy: RetryPolicy, random: () => number = Math.random): number | null {
  if (attempt >= policy.maxRetries) return null;
  if (err.retry === 'no' || err.retry === 'after_fix') return null;
  if (err.retry === 'once' && attempt > 0) return null;
  if (err.retryAfterSeconds !== null) {
    const ms = err.retryAfterSeconds * 1000;
    return ms <= policy.maxDelayMs ? ms : null;
  }
  const backoff = Math.min(policy.maxDelayMs, policy.baseDelayMs * 2 ** attempt) * (0.5 + random() / 2);
  return err.code === 'call_in_progress' ? Math.max(IN_PROGRESS_MIN_MS, backoff) : backoff;
}

/** Errors after which an earlier attempt with the same key may still have run (and been charged). */
export const leavesOutcomeOpen = (err: OkDataError): boolean => err.charged === null || err.code === 'call_in_progress';

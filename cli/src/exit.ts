// Exit codes, documented in README.md and `okdata --help`:
//   0 done   1 usage (bad command or arguments)   2 refused, not charged
//   3 charged but failed, or partial (some pages or steps charged, then stopped)
//   4 auth (no key, bad key, suspended account, key scope)   5 network (no answer from the API)
import { OkDataError } from '@okdata/sdk';

export const EXIT = { ok: 0, usage: 1, refused: 2, charged: 3, auth: 4, network: 5 } as const;
export type ExitCode = (typeof EXIT)[keyof typeof EXIT];

/** A mistake in how the command was called: exit 1, nothing sent. */
export class UsageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UsageError';
  }
}

/** No key to send: exit 4 before any request goes out. */
export class NoKeyError extends Error {
  constructor() {
    super('No API key. Run `okdata login`, or set OKDATA_API_KEY.');
    this.name = 'NoKeyError';
  }
}

const AUTH = new Set(['unauthorized', 'account_suspended', 'key_scope_denied']);
const NETWORK = new Set(['connection_error', 'client_timeout', 'bad_response']);

/** The exit code for an error; `spent` says whether something was already charged in this run. */
export function exitCodeFor(err: unknown, spent = false): ExitCode {
  if (err instanceof NoKeyError) return EXIT.auth;
  if (err instanceof OkDataError) {
    if (spent || err.charged === true) return EXIT.charged;
    if (AUTH.has(err.code)) return EXIT.auth;
    if (NETWORK.has(err.code)) return EXIT.network;
    if (err.charged === null) return EXIT.charged; // settlement_unknown: maybe charged
    return EXIT.refused;
  }
  return EXIT.usage; // UsageError, and the SDK's own TypeError/RangeError for bad arguments
}

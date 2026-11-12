// What every command gets: the parsed common flags, the io, and a client made on demand.
import { OkData } from '@okdata/sdk';
import { credentials, type Credentials } from './config.js';
import { NoKeyError, UsageError } from './exit.js';
import type { Io } from './io.js';
import { VERSION } from './version.js';

export interface Context {
  io: Io;
  json: boolean;
  baseUrl: string;
  creds: Credentials;
  /** A client; `needKey` refuses (exit 4) before any request when there is no key. */
  client(opts?: { needKey?: boolean; source?: string; endUser?: string }): OkData;
}

export function makeContext(io: Io, flags: { json: boolean; baseUrl?: string }): Context {
  const creds = credentials(io, flags.baseUrl);
  return {
    io,
    json: flags.json,
    baseUrl: creds.baseUrl,
    creds,
    client: ({ needKey = true, source, endUser } = {}) => {
      if (needKey && !creds.apiKey) throw creds.configProblem ? new UsageError(creds.configProblem) : new NoKeyError();
      return new OkData({
        apiKey: creds.apiKey ?? '',
        baseUrl: creds.baseUrl,
        entry: 'cli',
        source,
        endUser,
        userAgent: `okdata-cli/${VERSION}`,
        fetch: io.fetch,
        sleep: (ms) => io.sleep(ms),
      });
    },
  };
}

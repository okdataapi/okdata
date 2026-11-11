// The okdata client: auth, retries with Idempotency-Key, and the typed endpoint methods.
import { buildPlatforms, ENDPOINTS, type Platforms } from './endpoints.js';
import { OkDataConnectionError, OkDataError, type RetryAdvice } from './errors.js';
import type { CallOptions, EndpointInfo, Item, Meta, Page, SharedParams, View } from './types.js';

export const VERSION = '0.1.0';
export const DEFAULT_BASE_URL = 'https://api.okdata.online';
const RETRY_STATUSES = new Set([429, 500, 502, 503, 504]);
const RETRY_VALUES: readonly RetryAdvice[] = ['no', 'yes', 'after_fix', 'same_key'];
const VIEWS: readonly View[] = ['compact', 'standard', 'full'];
const ID = /^[a-z0-9_]+(\.[a-z0-9_]+)+$/;
const PATH = /^\/v1(\/[a-z0-9_]+)+$/;
const FIELD = /^[A-Za-z0-9_]+(\.[A-Za-z0-9_]+)*$/;
const KEY = /^[\x21-\x7e]+$/;
/** After an attempt that may still be running server-side, wait this many extra times on rate_limited. */
const IN_FLIGHT_WAITS = 5;

export interface OkDataOptions {
  /** Defaults to the OKDATA_API_KEY environment variable. Keys start with okd_. */
  apiKey?: string;
  /** Defaults to OKDATA_BASE_URL or https://api.okdata.online. */
  baseUrl?: string;
  /** Per attempt. Default 60 000; some WeChat endpoints are slow. */
  timeoutMs?: number;
  /** Default 2; 0 turns retries off. */
  maxRetries?: number;
  /** First backoff step. Default 500. */
  retryBaseMs?: number;
  /** A server-requested wait longer than this throws instead of sleeping. Default 8 000. */
  maxRetryDelayMs?: number;
  /** A custom fetch, e.g. one that goes through a proxy. */
  fetch?: typeof fetch;
  /** How to wait between retries (tests pass a recorder). */
  sleep?: (ms: number) => Promise<void>;
}

type Json = Record<string, unknown>;
export type AnyResult = Page<Json> | Item<Json>;

const env = (name: string): string | undefined =>
  (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.[name];

const isNode = (): boolean => typeof (globalThis as { window?: unknown }).window === 'undefined';

/** The catalog entry for an id or /v1 path; unknown ids map to GET /v1/<id with dots as slashes>. */
export function endpointInfo(endpoint: string): EndpointInfo {
  const known = (ENDPOINTS as Record<string, EndpointInfo>)[endpoint]
    ?? Object.values(ENDPOINTS as Record<string, EndpointInfo>).find((e) => e.path === endpoint);
  if (known) return known;
  let path: string;
  if (PATH.test(endpoint)) path = endpoint;
  else if (ID.test(endpoint)) path = `/v1/${endpoint.split('.').join('/')}`;
  else throw new TypeError(`not an endpoint id or /v1 path: ${JSON.stringify(endpoint)}`);
  return { id: endpoint, method: 'GET', path, object: 'unknown', list: false, pageSize: null, unit: 'call', price: '0', maxCharge: '0', title: endpoint };
}

const toMicros = (decimal: string): bigint => {
  const [whole = '0', frac = ''] = decimal.split('.');
  return BigInt(whole) * 1_000_000n + BigInt(frac.padEnd(6, '0').slice(0, 6));
};

const fromMicros = (micros: bigint): string => {
  const whole = micros / 1_000_000n;
  const frac = (micros % 1_000_000n).toString().padStart(6, '0').replace(/0+$/, '');
  return frac ? `${whole}.${frac}` : whole.toString();
};

/** The most `pages` calls of an endpoint can cost, in US dollars. Say it before a big job. */
export function maxCost(endpoint: string, pages = 1): string {
  const info = (ENDPOINTS as Record<string, EndpointInfo>)[endpoint];
  if (!info) throw new TypeError(`unknown endpoint ${JSON.stringify(endpoint)}; see ENDPOINTS`);
  if (!Number.isInteger(pages) || pages < 0) throw new RangeError('pages must be a whole number, 0 or more');
  return fromMicros(toMicros(info.maxCharge) * BigInt(pages));
}

function joinFields(fields: SharedParams['fields']): string | undefined {
  if (fields === undefined) return undefined;
  const parts = (typeof fields === 'string' ? fields.split(',') : [...fields]).map((f) => f.trim()).filter(Boolean);
  if (parts.length === 0) throw new TypeError('fields is empty; leave it out to get every field');
  const bad = parts.filter((p) => !FIELD.test(p));
  if (bad.length) throw new TypeError(`fields must be dotted names like metrics.likes, got ${JSON.stringify(bad)}`);
  return parts.join(',');
}

function checkView(view: unknown): View | undefined {
  if (view === undefined) return undefined;
  if (!VIEWS.includes(view as View)) throw new TypeError(`view must be one of ${VIEWS.join(', ')}`);
  return view as View;
}

const queryValue = (v: unknown): string => (Array.isArray(v) ? v.join(',') : String(v));

function toResult(body: Json): AnyResult {
  const data = (body.data ?? {}) as Json;
  const meta = (body.meta ?? {}) as Meta;
  const base = {
    requestId: String(body.request_id ?? ''),
    meta,
    warnings: Array.isArray(body.warnings) ? body.warnings.map(String) : [],
    cost: meta.billing?.amount ?? '0',
    replayed: meta.replayed === true,
    raw: body,
  };
  if (Array.isArray(data.items)) {
    const page = (body.page ?? {}) as { next_cursor?: string | null; has_more?: boolean };
    return { ...base, kind: 'page', items: data.items as Json[], nextCursor: page.next_cursor ?? null, hasMore: page.has_more === true };
  }
  return { ...base, kind: 'item', item: (data.item ?? null) as Json };
}

/** A non-negative number of seconds, or null for anything else. */
function seconds(value: unknown): number | null {
  const n = typeof value === 'number' ? value : typeof value === 'string' && value.trim() !== '' ? Number(value) : NaN;
  return Number.isFinite(n) && n >= 0 ? n : null;
}

const retryAfterHeader = (res: Response): number | null => seconds(res.headers.get('retry-after'));

/** The same error, with the charge marked unknown: an earlier attempt may still finish and be billed. */
function withUnknownCharge(err: OkDataError): OkDataError {
  return new OkDataError(err.message, {
    code: err.code, status: err.status, requestId: err.requestId, charged: null, retry: err.retry,
    retryAfterSeconds: err.retryAfterSeconds, body: err.body, cause: err,
  });
}

// Declaration merging gives the class the generated platform properties (ok.douyin.videos.search, ...).
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface OkData extends Platforms {}

/**
 * Client for the okdata API.
 *
 *     const ok = new OkData(); // reads OKDATA_API_KEY
 *     const page = await ok.weibo.trends.list();
 *
 * Every paid call carries an Idempotency-Key and retries reuse it, so a retry never charges twice.
 * Use it on a server: an API key in a browser bundle is a key anyone can read.
 */
export class OkData {
  readonly baseUrl: string;
  readonly maxRetries: number;
  readonly #apiKey: string | undefined;
  readonly #timeoutMs: number;
  readonly #retryBaseMs: number;
  readonly #maxRetryDelayMs: number;
  readonly #fetch: typeof fetch;
  readonly #sleep: (ms: number) => Promise<void>;

  constructor(options: OkDataOptions = {}) {
    const key = (options.apiKey ?? env('OKDATA_API_KEY') ?? '').trim();
    if (key && !KEY.test(key)) throw new TypeError('the API key contains spaces or control characters; copy it again (keys start with okd_)');
    this.#apiKey = key || undefined;
    const base = (options.baseUrl ?? env('OKDATA_BASE_URL') ?? DEFAULT_BASE_URL).replace(/\/+$/, '');
    if (!/^https?:\/\//.test(base)) throw new TypeError(`baseUrl must start with https:// or http://, got ${JSON.stringify(base)}`);
    const maxRetries = options.maxRetries ?? 2;
    if (!Number.isInteger(maxRetries) || maxRetries < 0) throw new RangeError('maxRetries must be a whole number, 0 or more');
    this.baseUrl = base;
    this.maxRetries = maxRetries;
    this.#timeoutMs = options.timeoutMs ?? 60_000;
    this.#retryBaseMs = options.retryBaseMs ?? 500;
    this.#maxRetryDelayMs = options.maxRetryDelayMs ?? 8_000;
    this.#fetch = options.fetch ?? globalThis.fetch.bind(globalThis);
    this.#sleep = options.sleep ?? ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
    Object.assign(this, buildPlatforms({
      page: <T>(id: string, params: object, opts?: CallOptions) => this.#typed<Page<T>>('page', id, params, opts),
      item: <T>(id: string, params: object, opts?: CallOptions) => this.#typed<Item<T>>('item', id, params, opts),
    }));
  }

  /** Never prints the key. */
  toJSON(): { baseUrl: string; key: 'set' | 'missing' } {
    return { baseUrl: this.baseUrl, key: this.#apiKey ? 'set' : 'missing' };
  }

  /** Call any endpoint by id, e.g. call('weibo.trends.list'). Resolves to a page or an item. */
  call(endpoint: string, params: Record<string, unknown> & SharedParams = {}, options?: CallOptions): Promise<AnyResult> {
    return this.#call(endpointInfo(endpoint), params, options);
  }

  /** Pages until there are no more or maxPages is reached. Each page is its own call and charge. */
  async *pages(
    endpoint: string,
    params: Record<string, unknown> & SharedParams,
    options: { maxPages: number; signal?: AbortSignal },
  ): AsyncGenerator<Page<Json>, void, undefined> {
    if (!Number.isInteger(options.maxPages) || options.maxPages < 1) throw new RangeError('maxPages must be 1 or more');
    const info = endpointInfo(endpoint);
    let current = { ...params };
    for (let n = 0; n < options.maxPages; n += 1) {
      const result = await this.#call(info, current, { signal: options.signal });
      if (result.kind !== 'page') throw new TypeError(`${info.id} returns one object, not pages`);
      yield result;
      if (!result.hasMore || !result.nextCursor) return;
      current = { ...current, cursor: result.nextCursor };
    }
  }

  /** Balance, key info and rate limit of the key in use. */
  account(): Promise<Json> { return this.#plain('/v1/account'); }

  /** Every endpoint with parameters and prices. Free, no key needed. */
  catalog(): Promise<Json> { return this.#plain('/v1/catalog'); }

  /** Which endpoints are up right now. Free, no key needed. */
  status(): Promise<Json> { return this.#plain('/v1/catalog/status'); }

  /** The outcome and charge of an earlier call, e.g. after a timeout. */
  getCall(requestId: string): Promise<Json> {
    if (!/^[A-Za-z0-9-]+$/.test(requestId)) throw new TypeError('requestId must be the request_id of an earlier call');
    return this.#plain(`/v1/calls/${requestId}`);
  }

  async #typed<R extends Page<unknown> | Item<unknown>>(kind: R['kind'], id: string, params: object, options?: CallOptions): Promise<R> {
    const result = await this.#call(endpointInfo(id), params as Record<string, unknown>, options);
    if (result.kind !== kind) {
      throw new OkDataError(`${id} answered with ${result.kind === 'page' ? 'a page' : 'one object'}`, { code: 'bad_response' });
    }
    return result as unknown as R;
  }

  async #call(info: EndpointInfo, params: Record<string, unknown>, options: CallOptions = {}): Promise<AnyResult> {
    const { view, fields, ...rest } = params as Record<string, unknown> & SharedParams;
    const values = Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== undefined && v !== null));
    const shared = Object.fromEntries(Object.entries({ view: checkView(view), fields: joinFields(fields) }).filter(([, v]) => v !== undefined));
    let query: Record<string, unknown>;
    let body: Record<string, unknown> | undefined;
    if (info.method === 'POST') {
      const { cursor, ...inBody } = values;
      query = { ...(cursor === undefined ? {} : { cursor }), ...shared };
      body = inBody;
    } else {
      query = { ...values, ...shared };
    }
    const key = options.idempotencyKey || crypto.randomUUID();
    const envelope = await this.#send(info.method, info.path, query, body, key, options);
    return toResult(envelope);
  }

  async #plain(path: string): Promise<Json> {
    const envelope = await this.#send('GET', path, {}, undefined, undefined, {});
    return (envelope.data ?? {}) as Json;
  }

  #headers(idempotencyKey: string | undefined, hasBody: boolean): Record<string, string> {
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (isNode()) headers['User-Agent'] = `okdata-js/${VERSION}`;
    if (this.#apiKey) headers.Authorization = `Bearer ${this.#apiKey}`;
    if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;
    if (hasBody) headers['Content-Type'] = 'application/json';
    return headers;
  }

  async #send(method: string, path: string, query: Record<string, unknown>, body: object | undefined,
    idempotencyKey: string | undefined, options: CallOptions): Promise<Json> {
    const url = new URL(this.baseUrl + path);
    for (const [k, v] of Object.entries(query)) url.searchParams.set(k, queryValue(v));
    let ambiguous = false; // an earlier attempt may have run (and been charged) without us seeing the answer
    let inFlightWaits = 0;
    for (let attempt = 0; ;) {
      try {
        const { res, text } = await this.#fetchOnce(url, method, body, idempotencyKey, options);
        return this.#parse(res, text);
      } catch (err) {
        if (!(err instanceof OkDataError)) throw err;
        ambiguous ||= err.charged === null;
        if (ambiguous && err.code === 'rate_limited' && idempotencyKey && inFlightWaits < IN_FLIGHT_WAITS) {
          inFlightWaits += 1;
          await this.#sleep(Math.min((err.retryAfterSeconds ?? 1) * 1000, this.#maxRetryDelayMs));
          continue;
        }
        const delay = this.#retryDelay(err, attempt);
        if (delay === null) throw ambiguous && err.charged === false ? withUnknownCharge(err) : err;
        attempt += 1;
        await this.#sleep(delay);
      }
    }
  }

  async #fetchOnce(url: URL, method: string, body: object | undefined, idempotencyKey: string | undefined,
    options: CallOptions): Promise<{ res: Response; text: string }> {
    const timeout = AbortSignal.timeout(options.timeoutMs ?? this.#timeoutMs);
    const signal = options.signal ? AbortSignal.any([options.signal, timeout]) : timeout;
    try {
      const res = await this.#fetch(url, {
        method,
        headers: this.#headers(idempotencyKey, body !== undefined),
        body: body === undefined ? undefined : JSON.stringify(body),
        signal,
      });
      return { res, text: await res.text() }; // a body that stalls counts as a lost answer too
    } catch (err) {
      if (options.signal?.aborted) throw err; // the caller cancelled: no retry
      if (timeout.aborted) throw new OkDataConnectionError(`no answer in time from ${this.baseUrl}`, 'client_timeout', err);
      throw new OkDataConnectionError(`could not reach ${this.baseUrl}: ${err instanceof Error ? err.message : String(err)}`, 'connection_error', err);
    }
  }

  #parse(res: Response, text: string): Json {
    let body: unknown;
    try { body = text ? JSON.parse(text) : undefined; } catch { body = undefined; }
    const json = (body && typeof body === 'object' ? body : {}) as Json;
    if (json.code === 'ok') return json;
    if (typeof json.code === 'string') {
      const advice = json.retry as RetryAdvice;
      const retryAfter = seconds(json.retry_after_seconds) ?? retryAfterHeader(res);
      throw new OkDataError(String(json.message ?? json.code), {
        code: json.code,
        status: res.status,
        requestId: (json.request_id as string | undefined) ?? res.headers.get('x-request-id'),
        charged: json.charged === undefined ? false : (json.charged as boolean | null),
        retry: RETRY_VALUES.includes(advice) ? advice : 'no',
        retryAfterSeconds: retryAfter,
        body: json,
      });
    }
    throw new OkDataError(`HTTP ${res.status} without an okdata answer`, {
      code: 'bad_response',
      status: res.status,
      requestId: res.headers.get('x-request-id'),
      charged: null,
      retry: RETRY_STATUSES.has(res.status) ? 'yes' : 'no',
      retryAfterSeconds: retryAfterHeader(res),
    });
  }

  /** Milliseconds to wait before the next try, or null to give up. */
  #retryDelay(err: OkDataError, attempt: number): number | null {
    if (!err.retryable || attempt >= this.maxRetries) return null;
    if (err.retryAfterSeconds !== null) {
      const ms = err.retryAfterSeconds * 1000;
      return ms <= this.#maxRetryDelayMs ? ms : null;
    }
    const backoff = this.#retryBaseMs * 2 ** attempt;
    return Math.min(this.#maxRetryDelayMs, backoff * (0.5 + Math.random() / 2));
  }
}

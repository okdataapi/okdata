// The okdata client: options, typed endpoint methods, paging, and the free account routes.
import { buildPlatforms, ENDPOINTS, type EndpointId, type EndpointTypes, type ListEndpointId, type Platforms } from './generated/endpoints.js';
import { ItemPager, Pager, type PageOptions } from './paging.js';
import { buildRequest, fieldList } from './request.js';
import { toResult } from './result.js';
import { send, type SendInput, type TransportConfig } from './transport.js';
import type { AnyResult, Batch, CallOptions, EndpointInfo, Envelope, Item, Page } from './types.js';
import { VERSION } from './version.js';

export const DEFAULT_BASE_URL = 'https://api.okdata.online';
export const ENV_API_KEY = 'OKDATA_API_KEY';
export const ENV_BASE_URL = 'OKDATA_BASE_URL';

export interface OkDataOptions {
  /** Defaults to the OKDATA_API_KEY environment variable. Keys start with okd_. */
  apiKey?: string;
  /** Defaults to OKDATA_BASE_URL, then https://api.okdata.online. */
  baseUrl?: string;
  /** Per attempt. Default 65 000 (the API gives up on a source well before that). */
  timeoutMs?: number;
  /** Retries after the first attempt, when the error says retry. Default 2; 0 turns them off. */
  maxRetries?: number;
  /** First backoff step. Default 500. */
  retryBaseMs?: number;
  /** A server-named wait longer than this throws instead of sleeping. Default 20 000. */
  maxRetryDelayMs?: number;
  /** X-Entry, for your usage figures. Default 'sdk'. */
  entry?: string;
  /** X-Source: a label of your own (a job, a feature), 1-128 visible ASCII characters. */
  source?: string;
  /** X-End-User: who the call is for, in your system, 1-128 visible ASCII characters. */
  endUser?: string;
  /** Added to the User-Agent, e.g. 'my-app/1.2'. */
  userAgent?: string;
  /** A custom fetch (a proxy, a test double). */
  fetch?: typeof fetch;
  /** How to wait between retries (tests pass a recorder). */
  sleep?: (ms: number) => Promise<void>;
}

type Json = Record<string, unknown>;
type ParamsOf<K extends EndpointId> = EndpointTypes[K]['params'];
type ItemOf<K extends EndpointId> = EndpointTypes[K]['item'];
type ResultOf<K extends EndpointId> = EndpointTypes[K]['list'] extends true ? Page<ItemOf<K>> : Item<ItemOf<K>> | Batch<ItemOf<K>>;

const LABEL = /^[\x21-\x7e]{1,128}$/;
const KEY = /^[\x21-\x7e]+$/;
const REQUEST_ID = /^[A-Za-z0-9-]{1,64}$/;

const env = (name: string): string | undefined =>
  (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.[name];

function label(value: string | undefined, name: string, max = 128): string | undefined {
  if (value === undefined) return undefined;
  if (!LABEL.test(value) || value.length > max) throw new TypeError(`${name} must be 1-${max} visible ASCII characters, no spaces`);
  return value;
}

function nonNegativeInt(n: number, name: string): number {
  if (!Number.isInteger(n) || n < 0) throw new RangeError(`${name} must be a whole number, 0 or more`);
  return n;
}

const endpointInfo = (id: string): EndpointInfo | undefined => (ENDPOINTS as Record<string, EndpointInfo>)[id];

// Declaration merging gives the class its generated platform properties (ok.douyin.videos.search ...).
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OkData extends Platforms {}

/**
 * Client for the okdata API.
 *
 *     const ok = new OkData();                      // reads OKDATA_API_KEY
 *     const page = await ok.douyin.videos.search({ query: '露营装备', maxPrice: '0.05' });
 *
 * Every paid call carries an Idempotency-Key, reused by its retries, so a retry is never charged twice.
 * Keep keys on a server: a key in a browser bundle is a key anyone can read.
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OkData {
  readonly baseUrl: string;
  readonly #cfg: TransportConfig;

  constructor(options: OkDataOptions = {}) {
    const key = (options.apiKey ?? env(ENV_API_KEY) ?? '').trim();
    if (key && !KEY.test(key)) throw new TypeError('the API key has spaces or control characters in it; copy it again (keys start with okd_)');
    const base = (options.baseUrl ?? env(ENV_BASE_URL) ?? DEFAULT_BASE_URL).replace(/\/+$/, '');
    if (!/^https?:\/\/[^/]+/.test(base)) throw new TypeError(`baseUrl must start with https:// or http://, got ${JSON.stringify(base)}`);
    const isNode = typeof (globalThis as { window?: unknown }).window === 'undefined';
    const headers: Record<string, string> = { 'X-Entry': label(options.entry ?? 'sdk', 'entry', 32)! };
    const source = label(options.source, 'source');
    const endUser = label(options.endUser, 'endUser');
    if (source) headers['X-Source'] = source;
    if (endUser) headers['X-End-User'] = endUser;
    if (isNode) headers['User-Agent'] = [`okdata-sdk-js/${VERSION}`, options.userAgent].filter(Boolean).join(' ');
    this.baseUrl = base;
    this.#cfg = {
      baseUrl: base,
      apiKey: key || undefined,
      timeoutMs: options.timeoutMs ?? 65_000,
      maxRetries: nonNegativeInt(options.maxRetries ?? 2, 'maxRetries'),
      baseDelayMs: options.retryBaseMs ?? 500,
      maxDelayMs: options.maxRetryDelayMs ?? 20_000,
      headers,
      fetch: options.fetch ?? globalThis.fetch.bind(globalThis),
      sleep: options.sleep ?? ((ms) => new Promise((resolve) => setTimeout(resolve, ms))),
    };
    Object.assign(this, buildPlatforms({ call: <R>(id: string, params: object, opts?: CallOptions) => this.#call(id, params as Json, opts) as Promise<R> }));
  }

  /** Whether a key is set; the key itself is never shown. */
  get hasKey(): boolean { return this.#cfg.apiKey !== undefined; }

  toJSON(): { baseUrl: string; key: 'set' | 'missing' } {
    return { baseUrl: this.baseUrl, key: this.hasKey ? 'set' : 'missing' };
  }

  /** Any endpoint by id: call('weibo.trends.list'). Ids newer than this SDK work too (GET). */
  call<K extends EndpointId>(id: K, params: ParamsOf<K>, options?: CallOptions): Promise<ResultOf<K>>;
  call(id: string, params?: Json, options?: CallOptions): Promise<AnyResult>;
  call(id: string, params: object = {}, options?: CallOptions): Promise<AnyResult> {
    return this.#call(id, params as Json, options);
  }

  /** Pages of a list endpoint, following next_cursor, within maxPages / maxSpend. */
  pages<K extends ListEndpointId>(id: K, params: ParamsOf<K>, options?: PageOptions): Pager<ItemOf<K>>;
  pages(id: string, params?: Json, options?: PageOptions): Pager<Json>;
  pages(id: string, params: object = {}, options: PageOptions = {}): Pager<unknown> {
    return new Pager(id, endpointInfo(id), params as Json, (p, o) => this.#call(id, p, o), options);
  }

  /** The items of a list endpoint across pages, within maxItems / maxPages / maxSpend. */
  items<K extends ListEndpointId>(id: K, params: ParamsOf<K>, options?: PageOptions): ItemPager<ItemOf<K>>;
  items(id: string, params?: Json, options?: PageOptions): ItemPager<Json>;
  items(id: string, params: object = {}, options: PageOptions = {}): ItemPager<unknown> {
    return new ItemPager(this.pages(id, params as Json, options), options.maxItems);
  }

  /** Balance, this key with its spending limits, and the account's rate limits. Free. */
  account(): Promise<Json> { return this.request('GET', '/v1/account'); }

  /** Every endpoint with its parameters and price. Free, no key needed. */
  catalog(): Promise<Json> { return this.request('GET', '/v1/catalog', { auth: false }); }

  /** Which endpoints are up right now. Free, no key needed. */
  status(): Promise<Json> { return this.request('GET', '/v1/catalog/status', { auth: false }); }

  /** Calls, settled calls and charges grouped as asked (30 days by default). Free. */
  usage(options: { groupBy?: readonly string[]; since?: string; until?: string } = {}): Promise<Json> {
    const query: [string, string][] = [];
    if (options.groupBy?.length) query.push(['group_by', options.groupBy.join(',')]);
    if (options.since) query.push(['since', options.since]);
    if (options.until) query.push(['until', options.until]);
    return this.request('GET', '/v1/usage', { query });
  }

  /** Earlier calls: their record, their kept result (free for 24 h), or where an Idempotency-Key stands. */
  readonly calls = {
    get: (requestId: string): Promise<Json> => this.request('GET', `/v1/calls/${checkRequestId(requestId)}`),
    result: async (requestId: string, options: { view?: 'compact' | 'standard' | 'full'; fields?: string | readonly string[] } = {}): Promise<AnyResult> => {
      const query: [string, string][] = [];
      if (options.view) query.push(['view', options.view]);
      if (options.fields) query.push(['fields', fieldList(options.fields).join(',')]);
      const body = await send(this.#cfg, { method: 'GET', path: `/v1/calls/${checkRequestId(requestId)}/result`, query });
      return toResult(body as unknown as Envelope, null);
    },
    byKey: (idempotencyKey: string): Promise<Json> => this.request('GET', '/v1/calls', { query: [['idempotency_key', idempotencyKey]] }),
  };

  /** A raw request to any route; returns the envelope's data. For routes this SDK has no method for. */
  async request(method: 'GET' | 'POST', path: string, init: Omit<SendInput, 'method' | 'path'> = {}): Promise<Json> {
    const body = await send(this.#cfg, { ...init, method, path });
    return (body.data ?? {}) as Json;
  }

  async #call(id: string, params: Json, options: CallOptions = {}): Promise<AnyResult> {
    const req = buildRequest(id, endpointInfo(id), params);
    const idempotencyKey = options.idempotencyKey ?? crypto.randomUUID();
    const body = await send(this.#cfg, {
      method: req.method, path: req.path, query: req.query, body: req.body, maxPrice: req.maxPrice,
      idempotencyKey, signal: options.signal, timeoutMs: options.timeoutMs,
    });
    return toResult(body as unknown as Envelope, idempotencyKey);
  }
}

function checkRequestId(requestId: string): string {
  if (!REQUEST_ID.test(requestId)) throw new TypeError('requestId must be the request_id of an earlier call');
  return requestId;
}

/** The catalog entry this SDK was generated with, or undefined for an id it does not know. */
export const endpoint = (id: string): EndpointInfo | undefined => endpointInfo(id);

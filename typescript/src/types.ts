// Shapes shared by the client, the pager and the generated endpoint methods (src/generated/).

/** How much of each object comes back. Same price for all three. */
export type View = 'compact' | 'standard' | 'full';

/** Wire types of endpoint parameters, as the catalog names them. */
export type ParamType = 'string' | 'integer' | 'boolean' | 'string[]';

/** Parameters every endpoint takes, next to its own. */
export interface CommonParams {
  /** compact (shortest; long text cut at 500 characters), standard (default) or full (adds `ext`). */
  view?: View;
  /** Keep only these dotted paths, e.g. ['id', 'text', 'metrics.likes'] or 'id,text,metrics.likes'. */
  fields?: string | readonly string[];
  /**
   * The most this call may be charged, in US dollars ('0.05'). Sent as X-Max-Price: a call that could
   * cost more is refused before it runs (max_price_exceeded) and never charged.
   */
  maxPrice?: string | number;
}

/** Exactly one of the keys of T: the catalog's oneOf groups ("id or url"). */
export type ExactlyOne<T> = {
  [K in keyof T]: { [P in K]: T[P] } & { [P in Exclude<keyof T, K>]?: never };
}[keyof T];

export interface CallOptions {
  /** Reuse it to resend the same call safely; one is made per call when left out. */
  idempotencyKey?: string;
  signal?: AbortSignal;
  /** Per attempt; overrides the client's timeoutMs. */
  timeoutMs?: number;
}

/** One endpoint as the SDK needs it at run time (generated from the catalog). */
export interface EndpointInfo {
  id: string;
  path: string;
  /** true: returns data.items and a page. */
  list: boolean;
  /** true: a list parameter (ids, keywords) sends the call as POST with a JSON body. */
  post: boolean;
  batchMax: number | null;
  unit: 'call' | 'item';
  /** US dollars, decimal strings. */
  price: string;
  maxCharge: string;
  pageSize: number | null;
  params: Readonly<Record<string, ParamType>>;
  object: string;
  title: string;
  paused: boolean;
}

export interface Billing {
  /** What this call cost, US dollars as a decimal string ("0" for a free replay). */
  amount: string;
  currency: 'USD';
  balance_after: string;
  /** Sent only when what is left does not cover another call like this one. */
  covers_next?: false;
  top_up_url?: string;
}

export type ResultStatus = 'complete' | 'partial' | 'empty';

export interface Meta {
  capability: string;
  result_status: ResultStatus;
  billing: Billing;
  /** Fields this endpoint cannot give, and why ('platform' or 'capability'). */
  unavailable: Record<string, string>;
  cached: boolean;
  replayed: boolean;
  fetched_at: string;
}

export interface Warning {
  code: 'items_dropped' | 'text_truncated' | 'items_capped_by_balance' | 'note' | (string & {});
  message: string;
  count?: number;
  item?: number;
  fields?: string[];
}

export interface PageInfo {
  next_cursor: string | null;
  cursor_expires_at: string | null;
  has_more: boolean;
  returned: number;
}

/** The success envelope exactly as the API sent it. */
export interface Envelope {
  code: 'ok';
  request_id: string;
  data: { items?: unknown[]; item?: unknown; missing?: Missing[] } & Record<string, unknown>;
  page?: PageInfo;
  warnings: Warning[];
  meta: Meta;
}

export interface Missing {
  id: string;
  reason: 'not_found' | (string & {});
}

interface ResultBase {
  requestId: string;
  capability: string;
  resultStatus: ResultStatus;
  /** What this call cost, US dollars as a decimal string. */
  cost: string;
  balanceAfter: string | null;
  /** true when an Idempotency-Key replayed a stored result at no charge. */
  replayed: boolean;
  cached: boolean;
  unavailable: Record<string, string>;
  warnings: Warning[];
  meta: Meta;
  /** The key this call was sent with; resending with it never charges twice. */
  idempotencyKey: string | null;
  raw: Envelope;
}

/** One page of a list endpoint. The next page is a new call, charged on its own. */
export interface Page<T> extends ResultBase {
  kind: 'page';
  items: T[];
  nextCursor: string | null;
  cursorExpiresAt: string | null;
  hasMore: boolean;
  returned: number;
}

/** The answer of a single-object endpoint. */
export interface Item<T> extends ResultBase {
  kind: 'item';
  item: T;
}

/** The batch form of a single-object endpoint (ids given): found objects and what was missing. */
export interface Batch<T> extends ResultBase {
  kind: 'batch';
  items: T[];
  missing: Missing[];
}

export type AnyResult = Page<Record<string, unknown>> | Item<Record<string, unknown>> | Batch<Record<string, unknown>>;

/** A single-object endpoint that also takes a list (`ids`): a batch answer for the list form. */
export interface SingleOrBatch<P, T, L extends string> {
  (params: Extract<P, { [K in L]: readonly string[] }>, options?: CallOptions): Promise<Batch<T>>;
  (params: P, options?: CallOptions): Promise<Item<T>>;
}

/** What the generated endpoint methods call into. */
export interface Requester {
  call<R extends AnyResult | Page<unknown> | Item<unknown> | Batch<unknown>>(id: string, params: object, options?: CallOptions): Promise<R>;
}

// Shapes shared by the client and the generated endpoint methods.

/** compact drops null fields, standard is the default, full adds platform extras under ext. */
export type View = 'compact' | 'standard' | 'full';

/** Options every endpoint takes. */
export interface SharedParams {
  view?: View;
  /** Dotted field paths to keep, e.g. ['id', 'text', 'metrics.likes'] or 'id,text,metrics.likes'. */
  fields?: string | readonly string[];
}

/** Endpoints that read an object by id or by link take exactly one of the two. */
export type IdOrUrl = { id: string; url?: undefined } | { url: string; id?: undefined };

export interface CallOptions {
  /** Reuse it to retry safely; one is made for you when left out. */
  idempotencyKey?: string;
  signal?: AbortSignal;
  /** Overrides the client's per-attempt timeout. */
  timeoutMs?: number;
}

export interface EndpointInfo {
  id: string;
  method: 'GET' | 'POST';
  path: string;
  object: string;
  list: boolean;
  pageSize: number | null;
  unit: 'call' | 'item';
  /** US dollars, as a decimal string. */
  price: string;
  maxCharge: string;
  title: string;
}

export interface Billing {
  /** What this call cost, in US dollars, as a decimal string. */
  amount: string;
  currency: string;
  balance_after: string;
}

export interface Meta {
  capability: string;
  billing: Billing;
  /** Fields that are null and why: 'platform' (never shown) or 'capability' (not fetched yet). */
  unavailable: Record<string, string>;
  cached: boolean;
  /** true when an Idempotency-Key replayed a stored result at no charge. */
  replayed: boolean;
  fetched_at: string;
}

interface ResultBase {
  requestId: string;
  meta: Meta;
  warnings: string[];
  /** What this call cost in US dollars, as a decimal string ('0' for a free replay). */
  cost: string;
  replayed: boolean;
  /** The response body as it came. */
  raw: unknown;
}

/** One page from a list endpoint. The next page is a new, separately charged call. */
export interface Page<T> extends ResultBase {
  kind: 'page';
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

/** The answer of a single-object endpoint. */
export interface Item<T> extends ResultBase {
  kind: 'item';
  item: T;
}

/** What the generated endpoint methods call into. */
export interface Requester {
  page<T>(endpoint: string, params: object, options?: CallOptions): Promise<Page<T>>;
  item<T>(endpoint: string, params: object, options?: CallOptions): Promise<Item<T>>;
}

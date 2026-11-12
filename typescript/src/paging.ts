// pages() and items(): follow page.next_cursor with the same parameters, and stop before the next
// call could take the total past maxSpend (counted from meta.billing.amount of the pages so far).
import { OkDataError } from './errors.js';
import { fromMicros, toMicros, usdText } from './money.js';
import type { AnyResult, CallOptions, EndpointInfo, Page } from './types.js';

/** Why paging ended: no next page, a limit you set, or a balance that will not cover the next page. */
export type StopReason = 'end' | 'max_pages' | 'max_items' | 'max_spend' | 'balance';

export interface PageOptions {
  /** Stop after this many pages (each page is a call). */
  maxPages?: number;
  /** items() only: stop after this many items. */
  maxItems?: number;
  /**
   * The most all pages together may cost, US dollars. Before each page the pager adds what that page
   * could cost at most (the endpoint's maxCharge) and stops if it would go past; each call is also
   * sent with X-Max-Price set to what is left, so the server refuses (free) anything dearer.
   */
  maxSpend?: string | number;
  signal?: AbortSignal;
  timeoutMs?: number;
}

type CallFn = (params: Record<string, unknown>, options: CallOptions) => Promise<AnyResult>;

const positive = (n: number | undefined, name: string): number | undefined => {
  if (n === undefined) return undefined;
  if (!Number.isInteger(n) || n < 1) throw new RangeError(`${name} must be a whole number, 1 or more`);
  return n;
};

/** Pages of one listing. Iterate it once; spent, calls and stopReason tell how it went. */
export class Pager<T> implements AsyncIterable<Page<T>> {
  #spent = 0n;
  #calls = 0;
  #stopReason: StopReason | null = null;
  #started = false;
  readonly #maxPages: number | undefined;
  readonly #maxSpend: bigint | null;
  readonly #userCap: bigint | null;

  constructor(
    private readonly id: string,
    private readonly info: EndpointInfo | undefined,
    private readonly params: Readonly<Record<string, unknown>>,
    private readonly callFn: CallFn,
    private readonly options: PageOptions = {},
  ) {
    this.#maxPages = positive(options.maxPages, 'maxPages');
    this.#maxSpend = options.maxSpend === undefined ? null : toMicros(usdText(options.maxSpend, 'maxSpend'));
    const cap = params.maxPrice ?? params.max_price;
    this.#userCap = cap === undefined || cap === null ? null : toMicros(usdText(cap as string | number, 'maxPrice'));
    if (info && !info.list) throw new TypeError(`${id} returns one object, not pages`);
  }

  /** US dollars charged by the pages fetched so far. */
  get spent(): string { return fromMicros(this.#spent); }
  get calls(): number { return this.#calls; }
  /** null while paging is still going (or never started). */
  get stopReason(): StopReason | null { return this.#stopReason; }

  /** The most the next page could cost, as far as this SDK knows (0 for an id it does not know). */
  #worstNext(): bigint {
    return this.info ? toMicros(this.info.maxCharge) : 0n;
  }

  #stop(reason: StopReason): void { this.#stopReason = reason; }

  async *[Symbol.asyncIterator](): AsyncGenerator<Page<T>, void, undefined> {
    if (this.#started) throw new Error('a Pager can be iterated once; call pages() again for a new run');
    this.#started = true;
    let params: Record<string, unknown> = { ...this.params };
    for (;;) {
      if (this.#maxPages !== undefined && this.#calls >= this.#maxPages) return this.#stop('max_pages');
      const left = this.#maxSpend === null ? null : this.#maxSpend - this.#spent;
      if (left !== null && this.#worstNext() > left) return this.#stop('max_spend');
      const capped = left !== null && (this.#userCap === null || left < this.#userCap);
      const callParams = capped ? { ...params, max_price: undefined, maxPrice: fromMicros(left) } : params;
      let page: AnyResult;
      try {
        page = await this.callFn(callParams, { signal: this.options.signal, timeoutMs: this.options.timeoutMs });
      } catch (err) {
        // Our own cap refused a page the catalog priced lower than the server does: that is the budget.
        if (capped && err instanceof OkDataError && err.code === 'max_price_exceeded') return this.#stop('max_spend');
        throw err;
      }
      if (page.kind !== 'page') throw new TypeError(`${this.id} answered with one object, not a page`);
      this.#calls += 1;
      this.#spent += toMicros(page.cost || '0');
      yield page as unknown as Page<T>;
      if (!page.nextCursor || !page.hasMore) return this.#stop('end');
      if (page.meta.billing?.covers_next === false) return this.#stop('balance');
      params = { ...params, cursor: page.nextCursor };
    }
  }
}

/** The items of one listing, page after page. */
export class ItemPager<T> implements AsyncIterable<T> {
  #items = 0;
  #maxItemsHit = false;
  readonly #maxItems: number | undefined;

  constructor(private readonly pager: Pager<T>, maxItems: number | undefined) {
    this.#maxItems = positive(maxItems, 'maxItems');
  }

  get spent(): string { return this.pager.spent; }
  get calls(): number { return this.pager.calls; }
  get items(): number { return this.#items; }
  get stopReason(): StopReason | null { return this.#maxItemsHit ? 'max_items' : this.pager.stopReason; }

  async *[Symbol.asyncIterator](): AsyncGenerator<T, void, undefined> {
    if (this.#maxItems !== undefined && this.#maxItems < 1) return;
    for await (const page of this.pager) {
      for (const item of page.items) {
        yield item;
        this.#items += 1;
        if (this.#maxItems !== undefined && this.#items >= this.#maxItems) {
          this.#maxItemsHit = true;
          return;
        }
      }
    }
  }
}

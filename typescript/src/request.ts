// Turns an endpoint id and flat params into the HTTP request the contract wants: GET with query
// parameters, or POST with a JSON body when a list parameter (ids, keywords) is given to an
// endpoint that takes one. view, fields and maxPrice ride along; maxPrice becomes X-Max-Price.
import { maxPriceHeader } from './money.js';
import type { EndpointInfo, View } from './types.js';

export interface HttpRequest {
  method: 'GET' | 'POST';
  path: string;
  query: [string, string][];
  body?: Record<string, unknown>;
  maxPrice?: string;
}

const VIEWS: readonly View[] = ['compact', 'standard', 'full'];
const ID = /^[a-z0-9_]+(\.[a-z0-9_]+)+$/;
const FIELD = /^[A-Za-z0-9_]+(\.[A-Za-z0-9_]+)*$/;

/** /v1/douyin/videos/search for douyin.videos.search. */
export function pathOfId(id: string): string {
  if (!ID.test(id)) throw new TypeError(`not an endpoint id: ${JSON.stringify(id)} (ids look like douyin.videos.search)`);
  return `/v1/${id.split('.').join('/')}`;
}

export function fieldList(fields: string | readonly string[]): string[] {
  const parts = (typeof fields === 'string' ? fields.split(',') : [...fields]).map((f) => f.trim()).filter(Boolean);
  if (parts.length === 0) throw new TypeError('fields is empty; leave it out to get every field');
  const bad = parts.filter((p) => !FIELD.test(p));
  if (bad.length) throw new TypeError(`fields are dotted names like metrics.likes, not ${JSON.stringify(bad)}`);
  return parts;
}

function checkView(view: unknown): View {
  if (!VIEWS.includes(view as View)) throw new TypeError(`view must be one of ${VIEWS.join(', ')}`);
  return view as View;
}

const queryValue = (v: unknown): string => (Array.isArray(v) ? v.map(String).join(',') : String(v));

/** True when this call goes as POST: the endpoint has a batch form and a list value is given. */
function isBatchCall(info: EndpointInfo | undefined, values: Record<string, unknown>): boolean {
  if (!info?.post) return false;
  return Object.entries(values).some(([name, v]) => info.params[name] === 'string[]' && Array.isArray(v));
}

export function buildRequest(id: string, info: EndpointInfo | undefined, params: Readonly<Record<string, unknown>>): HttpRequest {
  const { view, fields, maxPrice, max_price: maxPriceSnake, ...rest } = params as Record<string, unknown>;
  const cap = maxPrice ?? maxPriceSnake;
  const values: Record<string, unknown> = Object.fromEntries(
    Object.entries(rest).filter(([, v]) => v !== undefined && v !== null),
  );
  if (view !== undefined && view !== null) values.view = checkView(view);
  if (fields !== undefined && fields !== null) values.fields = fieldList(fields as string | readonly string[]);
  const path = info?.path ?? pathOfId(id);
  const maxPriceText = cap === undefined || cap === null ? undefined : maxPriceHeader(cap as string | number);
  const extra = maxPriceText === undefined ? {} : { maxPrice: maxPriceText };
  if (isBatchCall(info, values)) return { method: 'POST', path, query: [], body: values, ...extra };
  return { method: 'GET', path, query: Object.entries(values).map(([k, v]) => [k, queryValue(v)]), ...extra };
}

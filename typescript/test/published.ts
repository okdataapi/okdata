// The published catalog and error table: docs/catalog.json and docs/errors.json in this repository,
// the same data GET /v1/catalog and GET /v1/catalog/errors answer. The generated code must cover
// exactly these. (In the okdata monorepo the tests read the catalog package itself.)
import { readFileSync } from 'node:fs';
import type { ErrorCode, RetryAdvice } from '../src/index.js';

/** The fields the tests read; docs/catalog.json has many more. */
export interface PublishedEndpoint {
  id: string;
  platform: string;
  path: string;
  unit: 'call' | 'item';
  price: string;
  maxCharge: string;
  list: boolean;
  post: boolean;
  paused: boolean;
}

export interface PublishedError {
  code: ErrorCode;
  http: number;
  charged: false | null;
  retry: RetryAdvice;
}

const read = <T>(name: string): T => JSON.parse(readFileSync(new URL(`../../docs/${name}`, import.meta.url), 'utf8')) as T;

export const catalog = read<{ revision: string; priceBook: string; endpoints: PublishedEndpoint[]; [field: string]: unknown }>('catalog.json');
export const pathOf = (e: { path: string }): string => e.path;
export const errorDocs = read<{ errors: PublishedError[] }>('errors.json').errors;

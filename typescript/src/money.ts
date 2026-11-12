// US dollars as decimal strings outside, integer micro-dollars (bigint) inside: no float ever
// touches a price or a budget.
const USD = /^\d{1,12}(\.\d{1,6})?$/;
/** What X-Max-Price accepts: up to 7 digits, then up to 6 decimals. */
export const MAX_PRICE_PATTERN = /^\d{1,7}(\.\d{1,6})?$/;

/** "0.058" -> 58000n. Throws on anything that is not a plain non-negative decimal. */
export function toMicros(usd: string): bigint {
  const text = usd.trim();
  if (!USD.test(text)) throw new TypeError(`not a US dollar amount: ${JSON.stringify(usd)}`);
  const [whole = '0', frac = ''] = text.split('.');
  return BigInt(whole) * 1_000_000n + BigInt(frac.padEnd(6, '0'));
}

/** 58000n -> "0.058"; 0n -> "0". */
export function fromMicros(micros: bigint): string {
  const sign = micros < 0n ? '-' : '';
  const abs = micros < 0n ? -micros : micros;
  const whole = abs / 1_000_000n;
  const frac = (abs % 1_000_000n).toString().padStart(6, '0').replace(/0+$/, '');
  return `${sign}${whole}${frac ? `.${frac}` : ''}`;
}

/** A budget or cap given as text or a number, as a decimal string; numbers are rounded to 6 places. */
export function usdText(value: string | number, name: string): string {
  if (typeof value === 'number') {
    if (!Number.isFinite(value) || value < 0) throw new RangeError(`${name} must be 0 or more US dollars`);
    return fromMicros(BigInt(Math.round(value * 1_000_000)));
  }
  const text = value.trim();
  if (!USD.test(text)) throw new TypeError(`${name} must be US dollars as a decimal string, like '0.05'`);
  return fromMicros(toMicros(text));
}

/** The price cap as X-Max-Price wants it. */
export function maxPriceHeader(value: string | number): string {
  const text = usdText(value, 'maxPrice');
  if (!MAX_PRICE_PATTERN.test(text)) throw new TypeError("maxPrice must be at most 7 digits before the point, like '0.05'");
  return text;
}

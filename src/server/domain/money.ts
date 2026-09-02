/* Canonical Money helpers for EP0-002
 * Provides safe integer-only arithmetic and deterministic rounding/allocation
 */
import { Money, Currency } from './types';

const MAX_SAFE = Number.MAX_SAFE_INTEGER || 9007199254740991;

export function isSafeInteger(value: number): boolean {
  return Number.isSafeInteger(value);
}

export function ensureSafeIntegerOrThrow(value: number, name = 'value'): void {
  if (!isSafeInteger(value)) throw new Error(`${name} must be a safe integer`);
}

export function ensureSameCurrencyOrThrow(...monies: Money[]): void {
  if (monies.length < 2) return;
  const currency = monies[0].currency;
  for (const m of monies) {
    if (m.currency !== currency) throw new Error('Currency mismatch');
  }
}

export function zero(currency: Currency): Money {
  return { amountMinor: 0, currency };
}

export function add(a: Money, b: Money): Money {
  ensureSameCurrencyOrThrow(a, b);
  ensureSafeIntegerOrThrow(a.amountMinor, 'a.amountMinor');
  ensureSafeIntegerOrThrow(b.amountMinor, 'b.amountMinor');
  const sum = a.amountMinor + b.amountMinor;
  if (!isSafeInteger(sum)) throw new Error('Integer overflow in add');
  return { amountMinor: sum, currency: a.currency };
}

export function subtract(a: Money, b: Money): Money {
  ensureSameCurrencyOrThrow(a, b);
  ensureSafeIntegerOrThrow(a.amountMinor, 'a.amountMinor');
  ensureSafeIntegerOrThrow(b.amountMinor, 'b.amountMinor');
  const diff = a.amountMinor - b.amountMinor;
  if (!isSafeInteger(diff)) throw new Error('Integer overflow in subtract');
  return { amountMinor: diff, currency: a.currency };
}

export function negate(a: Money): Money {
  ensureSafeIntegerOrThrow(a.amountMinor, 'a.amountMinor');
  const neg = -a.amountMinor;
  if (!isSafeInteger(neg)) throw new Error('Integer overflow in negate');
  return { amountMinor: neg, currency: a.currency };
}

export function equals(a: Money, b: Money): boolean {
  ensureSameCurrencyOrThrow(a, b);
  return a.amountMinor === b.amountMinor;
}

export function compare(a: Money, b: Money): -1 | 0 | 1 {
  ensureSameCurrencyOrThrow(a, b);
  if (a.amountMinor < b.amountMinor) return -1;
  if (a.amountMinor > b.amountMinor) return 1;
  return 0;
}

export function multiplyByInteger(a: Money, multiplier: number): Money {
  ensureSafeIntegerOrThrow(a.amountMinor, 'a.amountMinor');
  if (!Number.isInteger(multiplier)) throw new Error('Multiplier must be integer');
  ensureSafeIntegerOrThrow(multiplier, 'multiplier');
  const absA = Math.abs(a.amountMinor);
  const absM = Math.abs(multiplier);
  if (absM !== 0 && absA > Math.floor(MAX_SAFE / absM)) {
    throw new Error('Integer overflow in multiplyByInteger');
  }
  const product = a.amountMinor * multiplier;
  if (!isSafeInteger(product)) throw new Error('Integer overflow in multiplyByInteger');
  return { amountMinor: product, currency: a.currency };
}

// divideAndRoundInteger: divides integer dividend by integer divisor and returns integer result
export type RoundingMode = 'HALF_UP' | 'HALF_AWAY_FROM_ZERO' | 'TRUNCATE';

export function divideAndRoundInteger(dividend: number, divisor: number, mode: RoundingMode): number {
  if (!Number.isInteger(dividend)) throw new Error('dividend must be integer');
  if (!Number.isInteger(divisor) || divisor <= 0) throw new Error('divisor must be positive integer');
  ensureSafeIntegerOrThrow(dividend, 'dividend');
  ensureSafeIntegerOrThrow(divisor, 'divisor');

  const q = Math.trunc(dividend / divisor); // truncated toward zero
  const r = dividend - q * divisor; // remainder, may be negative or positive
  const absR = Math.abs(r);
  const D = divisor;

  // compare absR * 2 with D using safe integer logic
  // check potential overflow for absR * 2 (absR <= MAX_SAFE/2)
  if (absR > Math.floor(MAX_SAFE / 2)) throw new Error('Integer overflow in rounding comparison');
  const twiceAbsR = absR * 2;

  if (twiceAbsR < D) return q; // closer to truncated
  if (twiceAbsR > D) {
    // round away from zero
    return dividend >= 0 ? q + 1 : q - 1;
  }
  // tie case: twiceAbsR === D
  switch (mode) {
    case 'HALF_AWAY_FROM_ZERO':
      return dividend >= 0 ? q + 1 : q - 1;
    case 'TRUNCATE':
      return q;
    case 'HALF_UP':
      // HALF_UP: ties round toward +Infinity
      return dividend >= 0 ? q + 1 : q; // negative tie -> toward +Infinity -> less negative -> q (trunc toward zero)
    default:
      throw new Error('Unknown rounding mode');
  }
}

export function divideMoneyAndRound(a: Money, divisor: number, mode: RoundingMode = 'HALF_UP'): Money {
  ensureSafeIntegerOrThrow(a.amountMinor, 'a.amountMinor');
  if (!Number.isInteger(divisor) || divisor <= 0) throw new Error('divisor must be a positive integer');
  const resultAmount = divideAndRoundInteger(a.amountMinor, divisor, mode);
  ensureSafeIntegerOrThrow(resultAmount, 'result');
  return { amountMinor: resultAmount, currency: a.currency };
}

export function applyBasisPoints(a: Money, basisPoints: number, mode: RoundingMode = 'HALF_UP'): Money {
  // basisPoints is integer (e.g., 125 for 1.25%)
  if (!Number.isInteger(basisPoints)) throw new Error('basisPoints must be integer');
  ensureSafeIntegerOrThrow(a.amountMinor, 'a.amountMinor');
  ensureSafeIntegerOrThrow(basisPoints, 'basisPoints');
  const absA = Math.abs(a.amountMinor);
  const absB = Math.abs(basisPoints);
  // check overflow for absA * absB
  if (absB !== 0 && absA > Math.floor(MAX_SAFE / absB)) {
    throw new Error('Integer overflow in applyBasisPoints');
  }
  const product = a.amountMinor * basisPoints; // safe after check
  // divisor is 10000
  const result = divideAndRoundInteger(product, 10000, mode);
  ensureSafeIntegerOrThrow(result, 'result');
  return { amountMinor: result, currency: a.currency };
}

export function allocate(a: Money, parts: number[]): Money[] {
  if (!Array.isArray(parts) || parts.length === 0) throw new Error('allocate: parts must be non-empty');
  for (const w of parts) {
    if (!Number.isInteger(w) || w <= 0) throw new Error('allocate: weights must be positive integers');
  }

  ensureSafeIntegerOrThrow(a.amountMinor, 'a.amountMinor');
  const totalWeight = parts.reduce((s, v) => s + v, 0);
  if (!Number.isInteger(totalWeight) || totalWeight <= 0) throw new Error('allocate: invalid total weight');

  const sign = Math.sign(a.amountMinor) || 1;
  const absAmount = Math.abs(a.amountMinor);

  const rawShares: number[] = [];
  let sumShares = 0;

  // compute floor proportional shares with overflow guards
  for (const w of parts) {
    // check multiplication safety: absAmount * w
    if (w !== 0 && absAmount > Math.floor(MAX_SAFE / w)) throw new Error('Integer overflow in allocate');
    const share = Math.floor((absAmount * w) / totalWeight);
    rawShares.push(share);
    sumShares += share;
  }

  const remainder = absAmount - sumShares;
  // corrected invariant: 0 <= remainder < parts.length
  if (!(remainder >= 0 && remainder < parts.length)) {
    // as a safety fallback, if invariant is violated, throw
    throw new Error('Allocation remainder invariant violated');
  }

  // distribute remainder deterministically to earliest indices
  for (let j = 0; j < remainder; j++) {
    rawShares[j] = rawShares[j] + 1;
  }

  // apply sign and construct Money results
  const results: Money[] = rawShares.map((s) => ({ amountMinor: s * sign, currency: a.currency }));

  // final check
  const checkSum = results.reduce((acc, m) => acc + m.amountMinor, 0);
  if (checkSum !== a.amountMinor) throw new Error('Allocation sum mismatch');
  return results;
}

// backward-compatible aliases
export const addMoney = add;
export const zeroMoney = zero;

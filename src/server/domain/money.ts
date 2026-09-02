/* Money helpers for EP0-001 (minimal, no external deps)
 * Use integer minor units only. Provide helper for adding Money amounts in same currency.
 */
import { Money } from './types';

export function addMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error('Currency mismatch in addMoney');
  }
  return { amountMinor: a.amountMinor + b.amountMinor, currency: a.currency };
}

export function zeroMoney(currency: string): Money {
  return { amountMinor: 0, currency };
}

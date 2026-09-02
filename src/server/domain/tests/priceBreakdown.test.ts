import assert from 'assert';
import { PriceBreakdown, Money, TaxLine, FeeLine } from '../types';
import { zero, add, addMoney, subtract } from '../money';

export async function runPriceBreakdownTests() {
  console.log('priceBreakdownTests: starting');

  const USD = 'USD';
  const breakdown: PriceBreakdown = {
    baseAmount: { amountMinor: 5000, currency: USD },
    taxes: [{ type: 'VAT', amount: { amountMinor: 500, currency: USD } } as TaxLine],
    fees: [{ type: 'Service', amount: { amountMinor: 200, currency: USD } } as FeeLine],
    markup: { amountMinor: 100, currency: USD },
    discount: { amountMinor: 0, currency: USD },
    supplierCost: { amountMinor: 4800, currency: USD },
    totalCustomerPrice: { amountMinor: 5800, currency: USD },
  } as PriceBreakdown;

  // sum components (base + taxes + fees + markup - discount) and compare to totalCustomerPrice
  let sum = zero(USD);
  sum = add(sum, breakdown.baseAmount);
  if (breakdown.taxes) {
    for (const t of breakdown.taxes) sum = add(sum, t.amount);
  }
  if (breakdown.fees) {
    for (const f of breakdown.fees) sum = add(sum, f.amount);
  }
  if (breakdown.markup) sum = add(sum, breakdown.markup);
  if (breakdown.discount) sum = subtract(sum, breakdown.discount);

  assert.strictEqual(sum.amountMinor, breakdown.totalCustomerPrice.amountMinor);

  console.log('priceBreakdownTests: completed');
}

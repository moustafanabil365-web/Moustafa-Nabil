import assert from 'assert';
import {
  Money,
  Currency,
} from '../types';

import {
  isSafeInteger,
  ensureSafeIntegerOrThrow,
  zero,
  add,
  subtract,
  negate,
  equals,
  compare,
  multiplyByInteger,
  divideAndRoundInteger,
  divideMoneyAndRound,
  applyBasisPoints,
  allocate,
  RoundingMode,
} from '../money';

export async function runMoneyTests() {
  console.log('moneyTests: starting');

  const USD: Currency = 'USD';
  const m1: Money = { amountMinor: 1000, currency: USD };
  assert.strictEqual(isSafeInteger(m1.amountMinor), true);
  ensureSafeIntegerOrThrow(m1.amountMinor, 'm1');

  // add/subtract
  const m2: Money = { amountMinor: 2000, currency: USD };
  const sum = add(m1, m2);
  assert.strictEqual(sum.amountMinor, 3000);
  const diff = subtract(m2, m1);
  assert.strictEqual(diff.amountMinor, 1000);

  // equals/compare
  assert.strictEqual(equals(m1, { amountMinor: 1000, currency: USD }), true);
  assert.strictEqual(compare(m1, m2), -1);

  // zero/negate
  const z = zero(USD);
  assert.strictEqual(z.amountMinor, 0);
  const neg = negate(m1);
  assert.strictEqual(neg.amountMinor, -1000);

  // multiplyByInteger
  const prod = multiplyByInteger(m1, 3);
  assert.strictEqual(prod.amountMinor, 3000);

  // multiply invalid multiplier (non-integer)
  let threw = false;
  try { multiplyByInteger(m1, 1.5); } catch (e) { threw = true; }
  assert.strictEqual(threw, true);

  // currency mismatch: operations should throw
  threw = false;
  try { add({ amountMinor: 100, currency: 'USD' }, { amountMinor: 100, currency: 'EUR' }); } catch (e) { threw = true; }
  assert.strictEqual(threw, true, 'add should throw on currency mismatch');
  threw = false;
  try { subtract({ amountMinor: 100, currency: 'USD' }, { amountMinor: 100, currency: 'EUR' }); } catch (e) { threw = true; }
  assert.strictEqual(threw, true, 'subtract should throw on currency mismatch');
  threw = false;
  try { compare({ amountMinor: 100, currency: 'USD' }, { amountMinor: 100, currency: 'EUR' }); } catch (e) { threw = true; }
  assert.strictEqual(threw, true, 'compare should throw on currency mismatch');
  threw = false;
  try { equals({ amountMinor: 100, currency: 'USD' }, { amountMinor: 100, currency: 'EUR' }); } catch (e) { threw = true; }
  assert.strictEqual(threw, true, 'equals should throw on currency mismatch');

  // ensureSafeIntegerOrThrow rejects non-safe integer
  threw = false;
  try { ensureSafeIntegerOrThrow(Number.MAX_SAFE_INTEGER + 1, 'unsafe'); } catch (e) { threw = true; }
  assert.strictEqual(threw, true, 'ensureSafeIntegerOrThrow should throw for unsafe integer');

  // multiply overflow
  threw = false;
  const large = Math.floor(Number.MAX_SAFE_INTEGER / 2) + 1;
  try { multiplyByInteger({ amountMinor: large, currency: USD }, 2); } catch (e) { threw = true; }
  assert.strictEqual(threw, true, 'multiplyByInteger should throw on overflow');

  // add overflow
  threw = false;
  const half = Math.floor(Number.MAX_SAFE_INTEGER / 2) + 1;
  try { add({ amountMinor: half, currency: USD }, { amountMinor: half, currency: USD }); } catch (e) { threw = true; }
  assert.strictEqual(threw, true, 'add should throw on overflow');

  // subtract overflow (construct operands that cause overflow)
  threw = false;
  const near = Math.floor(Number.MAX_SAFE_INTEGER / 2) + 1;
  try { subtract({ amountMinor: -near, currency: USD }, { amountMinor: near, currency: USD }); } catch (e) { threw = true; }
  assert.strictEqual(threw, true, 'subtract should throw on overflow');

  // applyBasisPoints overflow
  threw = false;
  const bigA = Math.floor(Number.MAX_SAFE_INTEGER / 200) + 1; // large so that bigA * 200 > MAX_SAFE
  try { applyBasisPoints({ amountMinor: bigA, currency: USD }, 200); } catch (e) { threw = true; }
  assert.strictEqual(threw, true, 'applyBasisPoints should throw on overflow');

  // divideAndRoundInteger rounding modes and tie cases
  const cases: Array<{ dividend: number; divisor: number; mode: RoundingMode; expected: number }> = [
    { dividend: 101, divisor: 2, mode: 'HALF_UP', expected: 51 },
    { dividend: 101, divisor: 2, mode: 'HALF_AWAY_FROM_ZERO', expected: 51 },
    { dividend: 101, divisor: 2, mode: 'TRUNCATE', expected: 50 },
    { dividend: -101, divisor: 2, mode: 'HALF_UP', expected: -50 },
    { dividend: -101, divisor: 2, mode: 'HALF_AWAY_FROM_ZERO', expected: -51 },
    { dividend: -101, divisor: 2, mode: 'TRUNCATE', expected: -50 },
  ];

  for (const c of cases) {
    const res = divideAndRoundInteger(c.dividend, c.divisor, c.mode);
    assert.strictEqual(res, c.expected, `divideAndRoundInteger ${c.dividend}/${c.divisor} ${c.mode}`);
  }

  // additional rounding non-tie cases (5/2 and -5/2)
  const roundingCases = [
    { dividend: 5, divisor: 2 },
    { dividend: -5, divisor: 2 },
  ];
  for (const rc of roundingCases) {
    const halfUp = divideAndRoundInteger(rc.dividend, rc.divisor, 'HALF_UP');
    const halfAway = divideAndRoundInteger(rc.dividend, rc.divisor, 'HALF_AWAY_FROM_ZERO');
    const trunc = divideAndRoundInteger(rc.dividend, rc.divisor, 'TRUNCATE');
    if (rc.dividend === 5) {
      assert.strictEqual(halfUp, 3);
      assert.strictEqual(halfAway, 3);
      assert.strictEqual(trunc, 2);
    } else {
      // -5
      assert.strictEqual(halfUp, -2);
      assert.strictEqual(halfAway, -3);
      assert.strictEqual(trunc, -2);
    }
  }

  // divideMoneyAndRound
  const m101: Money = { amountMinor: 101, currency: USD };
  const divHalfUp = divideMoneyAndRound(m101, 2, 'HALF_UP');
  assert.strictEqual(divHalfUp.amountMinor, 51);

  // applyBasisPoints
  const base: Money = { amountMinor: 10000, currency: USD };
  const bp = applyBasisPoints(base, 125, 'HALF_UP'); // 1.25% of 10000 = 125
  assert.strictEqual(bp.amountMinor, 125);

  // allocation simple
  const alloc = allocate({ amountMinor: 100, currency: USD }, [1, 1, 1]);
  assert.strictEqual(alloc.length, 3);
  assert.strictEqual(alloc[0].amountMinor, 34);
  assert.strictEqual(alloc[1].amountMinor, 33);
  assert.strictEqual(alloc[2].amountMinor, 33);
  assert.strictEqual(alloc.reduce((s, m) => s + m.amountMinor, 0), 100);

  // allocation weighted [1,2,3]
  const alloc2 = allocate({ amountMinor: 100, currency: USD }, [1, 2, 3]);
  // expected: totalWeight=6 -> raw floor shares: floor([16.66,33.33,50]) => [16,33,50], sum=99, remainder=1 -> add to first => [17,33,50]
  assert.deepStrictEqual(alloc2.map((m) => m.amountMinor), [17, 33, 50]);
  assert.strictEqual(alloc2.reduce((s, m) => s + m.amountMinor, 0), 100);

  // allocation for 101 with weights [1,2,3]
  const alloc3 = allocate({ amountMinor: 101, currency: USD }, [1, 2, 3]);
  // raw floors [16,33,50] sum=99 remainder=2 -> distribution to first two -> [17,34,50]
  assert.deepStrictEqual(alloc3.map((m) => m.amountMinor), [17, 34, 50]);
  assert.strictEqual(alloc3.reduce((s, m) => s + m.amountMinor, 0), 101);

  // negative allocation
  const allocNeg = allocate({ amountMinor: -100, currency: USD }, [1, 1, 1]);
  assert.deepStrictEqual(allocNeg.map((m) => m.amountMinor), [-34, -33, -33]);

  // subtraction producing negative amount
  const negSub = subtract({ amountMinor: 100, currency: USD }, { amountMinor: 200, currency: USD });
  assert.strictEqual(negSub.amountMinor, -100);

  // invalid allocation weights: empty
  threw = false;
  try { allocate({ amountMinor: 100, currency: USD }, []); } catch (e) { threw = true; }
  assert.strictEqual(threw, true);

  // invalid allocation: zero weight
  threw = false;
  try { allocate({ amountMinor: 100, currency: USD }, [1, 0, 1]); } catch (e) { threw = true; }
  assert.strictEqual(threw, true);

  // invalid allocation: negative weight
  threw = false;
  try { allocate({ amountMinor: 100, currency: USD }, [1, -2, 1]); } catch (e) { threw = true; }
  assert.strictEqual(threw, true);

  // invalid allocation: non-integer weight
  threw = false;
  try { allocate({ amountMinor: 100, currency: USD }, [1, 1.5, 1]); } catch (e) { threw = true; }
  assert.strictEqual(threw, true);

  // allocation overflow
  threw = false;
  const bigAmount = Math.floor(Number.MAX_SAFE_INTEGER / 2) + 1;
  try { allocate({ amountMinor: bigAmount, currency: USD }, [2, 2]); } catch (e) { threw = true; }
  assert.strictEqual(threw, true, 'allocate should throw on multiplication overflow');


  // divide by zero invalid
  threw = false;
  try { divideAndRoundInteger(100, 0, 'HALF_UP'); } catch (e) { threw = true; }
  assert.strictEqual(threw, true);

  console.log('moneyTests: completed');
}

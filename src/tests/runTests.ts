import { runAirlineTests } from './airlineNormalization.test';
import { runHotelTests } from './hotelNormalization.test';
import { runResidentialTests } from './residentialNormalization.test';
import { runCanonicalDestinationTests } from './canonicalDestinationDomain.test';

export function runAllTests() {
  console.log('====================================================');
  console.log('TraviQ Travel Domain Normalization & Lookup Test Suite');
  console.log('====================================================\n');

  const airlineResults = runAirlineTests();
  const hotelResults = runHotelTests();
  const residentialResults = runResidentialTests();
  const destinationResults = runCanonicalDestinationTests();

  const allResults = [...airlineResults, ...hotelResults, ...residentialResults, ...destinationResults];

  let passedCount = 0;
  let failedCount = 0;

  for (const r of allResults) {
    if (r.passed) {
      console.log(`✅  PASS: ${r.name}`);
      passedCount++;
    } else {
      console.error(`❌  FAIL: ${r.name} - ${r.message}`);
      failedCount++;
    }
  }

  console.log('\n====================================================');
  console.log(`Total: ${allResults.length} | Passed: ${passedCount} | Failed: ${failedCount}`);
  console.log('====================================================');

  if (failedCount > 0) {
    console.error(`\n❌ Test Suite Completed with ${failedCount} failure(s).`);
    process.exit(1);
  } else {
    console.log('\n✨ All Travel Domain Normalization & Classification Tests Passed Successfully!');
    process.exit(0);
  }
}

// Auto-run if executed directly via tsx
runAllTests();

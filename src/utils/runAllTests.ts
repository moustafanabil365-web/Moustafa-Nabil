import { runAirlineTests } from './airlineTests';
import { runHotelTests } from './hotelTests';

async function main() {
  try {
    console.log('Running airline tests...');
    await runAirlineTests();
    console.log('Airline tests passed.');

    console.log('Running hotel tests...');
    await runHotelTests();
    console.log('Hotel tests passed.');

    console.log('\nALL TESTS PASSED');
    process.exit(0);
  } catch (err) {
    console.error('TESTS FAILED:', err);
    process.exit(1);
  }
}

main();

import assert from 'assert';
import { buildAirlineIndexEntries, buildHotelIndexEntries, findAirlineByIataCode } from '../indexers';
import { TEST_AIRLINES } from '../../../src/utils/airlineTestData';
import { OFFICIAL_AIRLINES_DATABASE, OFFICIAL_HOTEL_CHAINS_DATABASE } from '../../../src/utils/bookingUtils';

export async function runSearchIndexTests() {
  console.log('searchIndexTests: starting');
  const airlines = buildAirlineIndexEntries();
  assert.ok(Array.isArray(airlines) && airlines.length > 0, 'airline index entries must be built');

  // find by IATA using helper
  const emirates = findAirlineByIataCode('EK');
  if (emirates) {
    const found = airlines.find((e) => e.id === emirates.id);
    assert.ok(found, 'emirates should be represented in index entries when present');
  }

  // hotel index builder should accept hotel arrays
  const hotels = buildHotelIndexEntries(OFFICIAL_HOTEL_CHAINS_DATABASE as any[]);
  assert.ok(Array.isArray(hotels));

  console.log('searchIndexTests: completed');
}

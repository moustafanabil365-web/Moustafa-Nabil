import assert from 'assert';
import { normalizeAirlineName, normalizeAirlineCode, findAirlineByCode, findAirlineByName, suggestAirlineCandidates } from './airlineNormalization';
import { OFFICIAL_AIRLINES_DATABASE } from './bookingUtils';
import { AIRLINES_BY_IATA, AIRLINES_BY_ICAO, getAirlineById } from './airlineIndex';
import { classifyAirline } from './airlineClassification';

export async function runAirlineTests() {
  console.log('airlineTests: starting');

  // Basic normalization
  assert.strictEqual(normalizeAirlineName('Emirates'), 'emirates');
  assert.strictEqual(normalizeAirlineName('  EMIRATES  '), 'emirates');
  assert.strictEqual(normalizeAirlineName('طيران الإمارات'), normalizeAirlineName('طيران\u0000 الإمارات'));

  // Code normalization
  assert.strictEqual(normalizeAirlineCode('ek'), 'EK');
  assert.strictEqual(normalizeAirlineCode(' EK '), 'EK');

  // IATA/ICAO maps are objects - ensure no runtime errors
  Object.keys(AIRLINES_BY_IATA).forEach((k) => {
    const v = (AIRLINES_BY_IATA as any)[k];
    assert.ok(v && v.id, `IATA map contains valid airline for ${k}`);
  });
  Object.keys(AIRLINES_BY_ICAO).forEach((k) => {
    const v = (AIRLINES_BY_ICAO as any)[k];
    assert.ok(v && v.id, `ICAO map contains valid airline for ${k}`);
  });

  // findAirlineByCode behavior using whichever sample has iataCode
  const sampleWithIata = OFFICIAL_AIRLINES_DATABASE.find((a) => (a as any).iataCode);
  if (sampleWithIata && (sampleWithIata as any).iataCode) {
    const found = findAirlineByCode(OFFICIAL_AIRLINES_DATABASE, (sampleWithIata as any).iataCode);
    assert.ok(found, 'findAirlineByCode should find airline by IATA code');
  }

  // ID lookup
  const some = OFFICIAL_AIRLINES_DATABASE[0];
  const byId = getAirlineById(some.id);
  assert.ok(byId && byId.id === some.id, 'getAirlineById should return the correct record');

  // Name lookup exact normalized
  const byName = findAirlineByName(OFFICIAL_AIRLINES_DATABASE, some.nameEn || some.name);
  if (byName) {
    assert.strictEqual(byName.id, some.id);
  }

  // Unknown entity
  const unknown = findAirlineByName(OFFICIAL_AIRLINES_DATABASE, 'Some Unknown Airline Name That Does Not Exist');
  assert.strictEqual(unknown, null, 'Unknown airline must return null');

  // Duplicate/ambiguous names: suggest candidates should return array
  const candidates = suggestAirlineCandidates(OFFICIAL_AIRLINES_DATABASE, 'air');
  assert.ok(Array.isArray(candidates), 'suggestAirlineCandidates returns array');

  // Missing optional fields: classifier should not guess
  const partial = { id: 'partial', name: 'Partial Air' } as any;
  const classification = classifyAirline(partial);
  assert.strictEqual(classification.verified, false);
  assert.strictEqual(classification.confidence, 0);

  // verify no exceptions for malformed inputs
  assert.strictEqual(findAirlineByName(OFFICIAL_AIRLINES_DATABASE, ''), null);
  assert.strictEqual(findAirlineByCode(OFFICIAL_AIRLINES_DATABASE, ''), null);

  console.log('airlineTests: completed');
}

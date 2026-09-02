import assert from 'assert';
import { normalizeHotelName, findHotelByName, suggestHotelCandidates } from './hotelNormalization';
import { OFFICIAL_HOTEL_CHAINS_DATABASE } from './bookingUtils';
import { getHotelById, findHotelByNormalizedName } from './hotelIndex';
import { classifyHotel } from './hotelClassification';

export async function runHotelTests() {
  console.log('hotelTests: starting');

  // Basic normalization
  assert.strictEqual(normalizeHotelName('Marriott'), 'marriott');
  assert.strictEqual(normalizeHotelName('  MARRIOTT  '), 'marriott');
  assert.strictEqual(normalizeHotelName('ماريوت'), normalizeHotelName('ماريوت\u0000'));

  // ID lookup
  const some = OFFICIAL_HOTEL_CHAINS_DATABASE[0];
  const byId = getHotelById(some.id);
  assert.ok(byId && byId.id === some.id, 'getHotelById should return the correct record');

  // Name lookup
  const byName = findHotelByName(OFFICIAL_HOTEL_CHAINS_DATABASE, some.name);
  if (byName) assert.strictEqual(byName.id, some.id);

  // Unknown hotel
  const unknown = findHotelByName(OFFICIAL_HOTEL_CHAINS_DATABASE, 'Nonexistent Hotel Example');
  assert.strictEqual(unknown, null);

  // Suggest candidates
  const candidates = suggestHotelCandidates(OFFICIAL_HOTEL_CHAINS_DATABASE, 'Mar');
  assert.ok(Array.isArray(candidates));

  // Classification consistency
  const partial = { id: 'p', name: 'Partial Hotel' } as any;
  const classification = classifyHotel(partial);
  assert.strictEqual(classification.verified, false);
  assert.strictEqual(classification.confidence, 0);

  // Missing optional fields should not throw
  assert.strictEqual(findHotelByName(OFFICIAL_HOTEL_CHAINS_DATABASE, ''), null);

  console.log('hotelTests: completed');
}

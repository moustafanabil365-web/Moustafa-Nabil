import {
  findHotelChainByQuery,
  normalizeHotelQuery,
  ENHANCED_HOTEL_CHAINS_DATABASE,
} from '../utils/hotelNormalization';

export function runHotelTests(): { name: string; passed: boolean; message?: string }[] {
  const results: { name: string; passed: boolean; message?: string }[] = [];

  function assert(name: string, condition: boolean, message?: string) {
    results.push({
      name: `[Hotels] ${name}`,
      passed: Boolean(condition),
      message: condition ? undefined : (message || 'Assertion failed'),
    });
  }

  // 1. Direct ID lookups
  const marriott = findHotelChainByQuery('marriott');
  assert('Query "marriott" finds Marriott', marriott?.id === 'marriott');

  const fourSeasons = findHotelChainByQuery('fourseasons');
  assert('Query "fourseasons" finds Four Seasons', fourSeasons?.id === 'fourseasons');

  // 2. Arabic name lookups
  const arabicHilton = findHotelChainByQuery('هيلتون');
  assert('Arabic query "هيلتون" finds Hilton', arabicHilton?.id === 'hilton');

  const arabicAccor = findHotelChainByQuery('أكور');
  assert('Arabic query "أكور" finds Accor', arabicAccor?.id === 'accor');

  const arabicFourSeasons = findHotelChainByQuery('فور سيزونز');
  assert('Arabic query "فور سيزونز" finds Four Seasons', arabicFourSeasons?.id === 'fourseasons');

  // 3. Sub-brand & Alias Matching
  const ritzCarlton = findHotelChainByQuery('Ritz-Carlton');
  assert('Sub-brand "Ritz-Carlton" maps to Marriott', ritzCarlton?.id === 'marriott');

  const fairmont = findHotelChainByQuery('Fairmont');
  assert('Sub-brand "Fairmont" maps to Accor', fairmont?.id === 'accor');

  const waldorf = findHotelChainByQuery('Waldorf Astoria');
  assert('Sub-brand "Waldorf Astoria" maps to Hilton', waldorf?.id === 'hilton');

  const holidayInn = findHotelChainByQuery('Holiday Inn');
  assert('Sub-brand "Holiday Inn" maps to IHG', holidayInn?.id === 'ihg');

  // 4. Case & Whitespace & Punctuation Insensitivity
  const messyQuery = findHotelChainByQuery('   ACCOR - ALL (Sofitel)!  ');
  assert('Messy punctuated query maps to Accor', messyQuery?.id === 'accor');

  // 5. Service Level Verification
  assert('Four Seasons is classified as LUXURY', fourSeasons?.serviceLevel === 'LUXURY');
  assert('Marriott is classified as PREMIUM', marriott?.serviceLevel === 'PREMIUM');

  // 6. Unknown Entity & Graceful Fallback
  const unknownHotel = findHotelChainByQuery('UnknownUnregisteredHotel404');
  assert('Unknown hotel query returns undefined safely', unknownHotel === undefined);

  const emptyHotel = findHotelChainByQuery('');
  assert('Empty query returns undefined safely', emptyHotel === undefined);

  // 7. Normalization helper verification
  assert(
    'normalizeHotelQuery strips accents and special chars',
    normalizeHotelQuery('  Hôtel / Sofîtel #1  ') === 'hotel sofitel 1'
  );

  return results;
}

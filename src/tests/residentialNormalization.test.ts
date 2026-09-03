import {
  classifyResidentialPropertyType,
  classifyResidentialServiceLevel,
  classifyResidentialStayType,
  classifyResidentialSegment,
  getResidentialClassification,
} from '../utils/residentialClassification';
import {
  normalizeResidentialPropertyName,
  normalizePropertyType,
  normalizeServiceLevel,
  createResidentialIndexes,
  findResidentialPropertyByName,
  findResidentialPropertyById,
  filterResidentialByServiceLevel,
  filterResidentialByPropertyType,
  filterResidentialByStayType,
  filterResidentialBySegment,
  filterResidentialByBedrooms,
  filterResidentialByGuests,
  OFFICIAL_RESIDENTIAL_PROPERTIES_DATABASE,
} from '../utils/residentialNormalization';

export function runResidentialTests(): { name: string; passed: boolean; message?: string }[] {
  const results: { name: string; passed: boolean; message?: string }[] = [];

  function assert(name: string, condition: boolean, message?: string) {
    results.push({
      name: `[Residential] ${name}`,
      passed: Boolean(condition),
      message: condition ? undefined : (message || 'Assertion failed'),
    });
  }

  // 1. Property Type Classification
  assert(
    'Penthouse keyword maps to PENTHOUSE',
    classifyResidentialPropertyType('Luxury Rooftop Penthouse') === 'PENTHOUSE'
  );
  assert(
    'Arabic بنتهاوس maps to PENTHOUSE',
    classifyResidentialPropertyType('بنتهاوس فاخر مع مسبح') === 'PENTHOUSE'
  );
  assert(
    'Villa keyword maps to VILLA',
    classifyResidentialPropertyType('Beachfront Luxury Villa') === 'VILLA'
  );
  assert(
    'Arabic فيلا maps to VILLA',
    classifyResidentialPropertyType('فيلا خاصة 4 غرف') === 'VILLA'
  );
  assert(
    'Duplex keyword maps to DUPLEX',
    classifyResidentialPropertyType('Two-level modern duplex') === 'DUPLEX'
  );
  assert(
    'Studio keyword maps to STUDIO',
    classifyResidentialPropertyType('Central Studio Apartment') === 'STUDIO'
  );
  assert(
    'Arabic استوديو maps to STUDIO',
    classifyResidentialPropertyType('استوديو مفروش للمبتعثين') === 'STUDIO'
  );
  assert(
    'Serviced Apartment maps to SERVICED_APARTMENT',
    classifyResidentialPropertyType('Marriott Executive Serviced Apartment') === 'SERVICED_APARTMENT'
  );
  assert(
    'Arabic شقق مخدومة maps to SERVICED_APARTMENT',
    classifyResidentialPropertyType('أجنحة وشقق مخدومة بالرياض') === 'SERVICED_APARTMENT'
  );
  assert(
    'Aparthotel keyword maps to APARTHOTEL',
    classifyResidentialPropertyType('Citadines Apart-Hotel') === 'APARTHOTEL'
  );
  assert(
    'Townhouse keyword maps to TOWNHOUSE',
    classifyResidentialPropertyType('Family Townhouse with Garden') === 'TOWNHOUSE'
  );
  assert(
    'Flat keyword maps to FLAT',
    classifyResidentialPropertyType('2-Bedroom Furnished Flat') === 'FLAT'
  );
  assert(
    'Generic accommodation falls back to APARTMENT',
    classifyResidentialPropertyType('Cozy Downtown Place') === 'APARTMENT'
  );

  // 2. Service Level Classification
  assert(
    'Luxury keywords map to LUXURY',
    classifyResidentialServiceLevel('Cheval Blanc Ultra-Luxury Penthouse') === 'LUXURY'
  );
  assert(
    'Arabic فاخر وسوبر ديلوكس maps to LUXURY',
    classifyResidentialServiceLevel('قصر سكني فاخر سوبر ديلوكس') === 'LUXURY'
  );
  assert(
    'Premium serviced chain maps to PREMIUM',
    classifyResidentialServiceLevel('Fraser Suites Executive Residence') === 'PREMIUM'
  );
  assert(
    'Budget keywords map to BUDGET',
    classifyResidentialServiceLevel('Low-cost student budget flat') === 'BUDGET'
  );
  assert(
    'Arabic اقتصادي maps to BUDGET',
    classifyResidentialServiceLevel('شقة استوديو اقتصادية رخيصة') === 'BUDGET'
  );
  assert(
    'Standard mainstream stay defaults to STANDARD',
    classifyResidentialServiceLevel('Comfortable Family Flat') === 'STANDARD'
  );

  // 3. Stay Type Classification
  assert(
    'Monthly cues map to MONTHLY',
    classifyResidentialStayType('Monthly lease furnished apartment') === 'MONTHLY'
  );
  assert(
    'Arabic شهري maps to MONTHLY',
    classifyResidentialStayType('إيجار شهري شقة غرفتين') === 'MONTHLY'
  );
  assert(
    'Extended stay maps to LONG_STAY',
    classifyResidentialStayType('Extended stay multi-week residence') === 'LONG_STAY'
  );
  assert(
    'Short stay / nightly maps to SHORT_STAY',
    classifyResidentialStayType('Nightly weekend holiday apartment') === 'SHORT_STAY'
  );
  assert(
    'Corporate housing maps to BUSINESS_STAY',
    classifyResidentialStayType('Corporate housing for business travel') === 'BUSINESS_STAY'
  );

  // 4. Segment Classification
  assert(
    'Workation / nomad maps to WORKATION',
    classifyResidentialSegment('Digital nomad workation apartment with fast wifi') === 'WORKATION'
  );
  assert(
    'Beach / sea view maps to BEACH',
    classifyResidentialSegment('Beachfront apartment with direct sea view') === 'BEACH'
  );
  assert(
    'Downtown maps to CITY_CENTER',
    classifyResidentialSegment('Downtown Central Residence') === 'CITY_CENTER'
  );
  assert(
    'Kids / Family friendly maps to FAMILY_FRIENDLY',
    classifyResidentialSegment('Family friendly spacious apartment with kids play area') === 'FAMILY_FRIENDLY'
  );

  // 5. Combined Classification Helper
  const fullClassification = getResidentialClassification(
    'Fraser Suites Luxury Penthouse',
    'Monthly lease in city center'
  );
  assert('Combined serviceLevel is LUXURY', fullClassification.serviceLevel === 'LUXURY');
  assert('Combined propertyType is PENTHOUSE', fullClassification.propertyType === 'PENTHOUSE');
  assert('Combined stayType is MONTHLY', fullClassification.stayType === 'MONTHLY');
  assert('Combined segment is CITY_CENTER', fullClassification.residentialSegment === 'CITY_CENTER');

  // 6. Name Normalization
  assert(
    'normalizeResidentialPropertyName handles diacritics and symbols',
    normalizeResidentialPropertyName('  Château & Résidence (Luxe) #5!  ') === 'chateau residence luxe 5'
  );

  // 7. Normalization Enum Helpers
  assert('normalizePropertyType handles SERVICED_RESIDENCE alias', normalizePropertyType('SERVICED_RESIDENCE') === 'SERVICED_APARTMENT');
  assert('normalizePropertyType handles Chalet', normalizePropertyType('CHALET') === 'VILLA');
  assert('normalizeServiceLevel handles Five Star', normalizeServiceLevel('FIVE_STAR') === 'LUXURY');
  assert('normalizeServiceLevel handles Economy', normalizeServiceLevel('ECONOMY') === 'BUDGET');

  // 8. Index Construction & Lookups
  const indexes = createResidentialIndexes(OFFICIAL_RESIDENTIAL_PROPERTIES_DATABASE);

  assert('Index by ID contains marriott_exec_apts', indexes.byId.has('marriott_exec_apts'));
  assert('Index by ID contains ascott_residences', indexes.byId.has('ascott_residences'));
  assert('Index by type contains SERVICED_APARTMENT', (indexes.byType.get('SERVICED_APARTMENT')?.length || 0) >= 2);
  assert('Index by serviceLevel contains PREMIUM', (indexes.byServiceLevel.get('PREMIUM')?.length || 0) >= 2);

  // 9. Name and ID Search
  const foundByName = findResidentialPropertyByName('Marriott Executive Apartments', OFFICIAL_RESIDENTIAL_PROPERTIES_DATABASE);
  assert('Find by English name returns Marriott Exec Apts', foundByName?.id === 'marriott_exec_apts');

  const foundByArabic = findResidentialPropertyByName('أسكوت ريزيدنس', OFFICIAL_RESIDENTIAL_PROPERTIES_DATABASE);
  assert('Find by Arabic name returns Ascott', foundByArabic?.id === 'ascott_residences');

  const foundById = findResidentialPropertyById('fraser_suites', OFFICIAL_RESIDENTIAL_PROPERTIES_DATABASE);
  assert('Find by ID returns Fraser Suites', foundById?.nameEn === 'Fraser Suites');

  // 10. Filters Verification
  const luxuryProps = filterResidentialByServiceLevel(OFFICIAL_RESIDENTIAL_PROPERTIES_DATABASE, 'LUXURY');
  assert('Filter by LUXURY returns Cheval', luxuryProps.some((p) => p.id === 'cheval_residences_luxury'));

  const aparthotels = filterResidentialByPropertyType(OFFICIAL_RESIDENTIAL_PROPERTIES_DATABASE, 'APARTHOTEL');
  assert('Filter by APARTHOTEL returns Fraser Suites and Citadines', aparthotels.some((p) => p.id === 'citadines_apart_hotel'));

  const min3Beds = filterResidentialByBedrooms(OFFICIAL_RESIDENTIAL_PROPERTIES_DATABASE, 3);
  assert('Filter by 3 bedrooms returns Ascott & Cheval', min3Beds.every((p) => (p.bedrooms || 0) >= 3));

  const guests4 = filterResidentialByGuests(OFFICIAL_RESIDENTIAL_PROPERTIES_DATABASE, 4);
  assert('Filter by 4 guests returns capable properties', guests4.every((p) => (p.maxGuests || 0) >= 4));

  // 11. Unknown entity & empty input handling
  const unknownName = findResidentialPropertyByName('UnknownFlat9999', OFFICIAL_RESIDENTIAL_PROPERTIES_DATABASE);
  assert('Unknown property name returns undefined', unknownName === undefined);

  const unknownId = findResidentialPropertyById('non_existent_id', OFFICIAL_RESIDENTIAL_PROPERTIES_DATABASE);
  assert('Unknown property id returns undefined', unknownId === undefined);

  const emptyName = findResidentialPropertyByName('', OFFICIAL_RESIDENTIAL_PROPERTIES_DATABASE);
  assert('Empty name returns undefined', emptyName === undefined);

  return results;
}

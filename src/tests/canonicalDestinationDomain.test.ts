/**
 * Comprehensive Canonical Destination Domain Tests
 * EP1-002: Deterministic verification of identity, normalization, adapters, and lookups.
 */

import {
  createDestinationId,
  createCityId,
  createAirportId,
  createCountryId,
  normalizeArabicText,
  normalizeDestinationQuery,
  generateDestinationSlug,
  destinationRepository,
  getDestinationById,
  getDestinationBySlug,
  findDestinationsByName,
  getDestinationsByCountry,
  getDestinationsByType,
  getDestinationsByTravelStyle,
  getCountryByCode,
  getCityById,
  getAirportById,
  getAirportByIata,
  validateCoordinates,
  validateStayDuration,
  validateDestinationHierarchy,
  Destination,
} from '../server/domain/destination';
import { GLOBAL_COUNTRIES } from '../data/globalDestinations';

export interface TestResult {
  name: string;
  passed: boolean;
  message?: string;
}

export function runCanonicalDestinationTests(): TestResult[] {
  const results: TestResult[] = [];

  function assert(name: string, condition: boolean, message?: string) {
    results.push({
      name,
      passed: Boolean(condition),
      message: condition ? undefined : (message || 'Assertion failed'),
    });
  }

  console.log('\n--- Running Canonical Destination Domain Tests (EP1-002) ---');

  // =========================================================================
  // 1. Deterministic Canonical ID Generation
  // =========================================================================
  {
    const id1 = createDestinationId('city', 'SA', 'Riyadh');
    const id2 = createDestinationId('city', 'SA', 'Riyadh');
    const idCountry = createDestinationId('country', 'SA', 'Saudi Arabia');
    const idRegion = createDestinationId('region', 'SA', 'Asir & Abha');
    const idIsland = createDestinationId('island', 'MV', 'Maldives Islands');

    assert('Destination ID is deterministic and reproducible', id1 === id2 && id1 === 'dst_city_sa_riyadh');
    assert('Country Destination ID format matches standard', idCountry === 'dst_country_sa');
    assert('Region Destination ID format matches standard', idRegion.startsWith('dst_region_sa_'));
    assert('Island Destination ID format matches standard', idIsland.startsWith('dst_island_mv_'));

    const cityId = createCityId('AE', 'Dubai');
    assert('City ID generation is deterministic', cityId === 'city_ae_dubai');

    const aptId = createAirportId('DXB');
    assert('Airport ID generation is deterministic', aptId === 'apt_dxb');

    const countryId = createCountryId('EG');
    assert('Country ID generation is deterministic', countryId === 'country_eg');
  }

  // =========================================================================
  // 2. Arabic Normalization Rules
  // =========================================================================
  {
    // Tashkeel / Diacritics
    const withTashkeel = 'مَكَّةُ المُكَرَّمَةُ';
    const normalizedTashkeel = normalizeArabicText(withTashkeel);
    assert('Arabic Tashkeel is completely removed', !/[ًٌٍَُِّْ]/.test(normalizedTashkeel));

    // Tatweel
    const withTatweel = 'الـــريـــاض';
    const normalizedTatweel = normalizeArabicText(withTatweel);
    assert('Arabic Tatweel is removed', !normalizedTatweel.includes('ـ'));

    // Alef variants
    const alefInput = 'أبوظبي وإسطنبول وآسيا';
    const alefNormalized = normalizeArabicText(alefInput);
    assert('Alef variants (أ, إ, آ) normalized to bare ا', !/[أإآ]/.test(alefNormalized));

    // Taa Marbouta to Haa
    const taaInput = 'القاهرة والمدينة';
    const taaNormalized = normalizeArabicText(taaInput);
    assert('Taa Marbouta normalized for lookup tolerance', !taaNormalized.includes('ة') && taaNormalized.includes('ه'));

    // Yaa / Alef Maksura
    const yaaInput = 'دبى وشاطئ';
    const yaaNormalized = normalizeArabicText(yaaInput);
    assert('Alef Maksura (ى) and Hamza on Nabrah (ئ) normalized to ي', !/[ىئ]/.test(yaaNormalized) && yaaNormalized.includes('ي'));
  }

  // =========================================================================
  // 3. English & Query Normalization
  // =========================================================================
  {
    const rawEnglish = '   Zürich,   Switzerland!  ';
    const normalizedEn = normalizeDestinationQuery(rawEnglish);
    assert('English query trimmed, lowercased, accents and punctuation stripped', normalizedEn === 'zurich switzerland');

    const slug = generateDestinationSlug('AlUla Heritage Oasis & Resorts');
    assert('Slug generator creates clean URL-safe tokens', slug === 'alula-heritage-oasis-resorts');
  }

  // =========================================================================
  // 4. Equivalent Input Normalization
  // =========================================================================
  {
    const q1 = normalizeDestinationQuery('الرياض');
    const q2 = normalizeDestinationQuery('الـرِّيَاضُ');
    assert('Accented and unaccented Arabic produce equivalent normalized output', q1 === q2);

    const q3 = normalizeDestinationQuery('Cairo, Egypt');
    const q4 = normalizeDestinationQuery('  cairo    egypt  ');
    assert('Whitespace and punctuation variations produce equivalent output', q3 === q4);
  }

  // =========================================================================
  // 5. Destination Lookups by ID, Slug, and Type
  // =========================================================================
  {
    const riyadh = getDestinationById('dst_city_sa_riyadh');
    assert('Retrieve destination by canonical ID', Boolean(riyadh && riyadh.nameEn === 'Riyadh'));

    const saCountry = getDestinationById('dst_country_sa');
    assert('Retrieve country destination by canonical ID', Boolean(saCountry && saCountry.type === 'country'));

    const bySlug = getDestinationBySlug('sa-riyadh');
    assert('Retrieve destination by URL slug', Boolean(bySlug && bySlug.id === 'dst_city_sa_riyadh'));

    const countries = getDestinationsByType('country');
    assert('Filter destinations by country type returns non-empty list', countries.length >= GLOBAL_COUNTRIES.length);

    const cities = getDestinationsByType('city');
    assert('Filter destinations by city type returns non-empty list', cities.length > 0);
  }

  // =========================================================================
  // 6. Destination Search by Name & Aliases
  // =========================================================================
  {
    // Search by Arabic name
    const foundAr = findDestinationsByName('دبي');
    assert('Find destination by Arabic query (دبي)', foundAr.some((d) => d.nameEn === 'Dubai'));

    // Search by Arabic with Tashkeel
    const foundWithTashkeel = findDestinationsByName('دُبَيّ');
    assert('Find destination by query with Tashkeel (دُبَيّ)', foundWithTashkeel.some((d) => d.nameEn === 'Dubai'));

    // Search by English name
    const foundEn = findDestinationsByName('Tokyo');
    assert('Find destination by English query (Tokyo)', foundEn.some((d) => d.countryCode === 'JP'));

    // Search by Country Code
    const foundSA = getDestinationsByCountry('SA');
    assert('Retrieve all destinations for country code SA', foundSA.length >= 6);

    // Search by Travel Style
    const spiritual = getDestinationsByTravelStyle('spiritual_pilgrimage');
    assert('Retrieve destinations by travel style (spiritual_pilgrimage)', spiritual.some((d) => d.name === 'مكة المكرمة'));
  }

  // =========================================================================
  // 7. Country, City, Airport Canonical Lookups
  // =========================================================================
  {
    // Country
    const sa = getCountryByCode('SA');
    assert('Retrieve Country by ISO-2 code (SA)', Boolean(sa && sa.nameEn === 'Saudi Arabia' && sa.flag === '🇸🇦'));

    const invalidCountry = getCountryByCode('ZZ');
    assert('Unknown country code returns undefined safely', invalidCountry === undefined);

    // City
    const cityRiyadh = getCityById('city_sa_riyadh');
    assert('Retrieve City by canonical ID', Boolean(cityRiyadh && cityRiyadh.countryCode === 'SA'));

    const invalidCity = getCityById('city_invalid_nowhere');
    assert('Unknown city ID returns undefined safely', invalidCity === undefined);

    // Airport
    const aptRuh = getAirportByIata('RUH');
    assert('Retrieve Airport by IATA (RUH)', Boolean(aptRuh && aptRuh.nameEn.includes('King Khalid')));

    const aptById = getAirportById('apt_ruh');
    assert('Retrieve Airport by ID (apt_ruh)', Boolean(aptById && aptById.iataCode === 'RUH'));

    const invalidAirport = getAirportByIata('ZZZ');
    assert('Unknown airport IATA returns undefined safely', invalidAirport === undefined);
  }

  // =========================================================================
  // 8. Domain Hierarchy and Validation
  // =========================================================================
  {
    // Coordinates validation
    const validCoords = validateCoordinates({ latitude: 24.7136, longitude: 46.6753 });
    assert('Valid geographic coordinates pass validation', validCoords.isValid);

    const invalidLat = validateCoordinates({ latitude: 120, longitude: 46.6753 });
    assert('Out of bound latitude fails validation', !invalidLat.isValid && invalidLat.errors.length > 0);

    // Stay duration validation
    const validDuration = validateStayDuration({ minDays: 2, maxDays: 6, recommendedDays: 4 });
    assert('Valid stay duration passes validation', validDuration.isValid);

    const invalidDuration = validateStayDuration({ minDays: 5, maxDays: 3, recommendedDays: 4 });
    assert('Inconsistent min/max stay duration fails validation', !invalidDuration.isValid);

    // Full Hierarchy validation for canonical destination
    const riyadhDest = getDestinationById('dst_city_sa_riyadh');
    if (riyadhDest) {
      const hierarchyResult = validateDestinationHierarchy(riyadhDest);
      assert('Canonical Riyadh destination passes full hierarchy validation', hierarchyResult.isValid);
    } else {
      assert('Canonical Riyadh destination exists for hierarchy check', false);
    }
  }

  // =========================================================================
  // 9. Dataset Adapter Integrity & Zero Duplication
  // =========================================================================
  {
    const allDestinations = destinationRepository.getAllDestinations();
    const allCountries = destinationRepository.getAllCountries();

    assert('All GLOBAL_COUNTRIES are represented in canonical countries', allCountries.length === GLOBAL_COUNTRIES.length);
    assert('Total destinations count exceeds total countries (includes cities/regions)', allDestinations.length > allCountries.length);

    // Verify IDs are all non-empty and well-formed
    const allIdsWellFormed = allDestinations.every((d) => d.id && d.id.startsWith('dst_') && d.countryCode.length === 2);
    assert('All canonical destinations have well-formed IDs and ISO-2 country codes', allIdsWellFormed);
  }

  return results;
}

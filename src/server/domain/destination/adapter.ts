/**
 * Canonical Destination Domain Adapter
 * EP1-002: Bridges existing datasets (GLOBAL_COUNTRIES, destination photos) into Canonical Destination Domain entities.
 * 
 * Rules:
 * - Does NOT duplicate raw datasets
 * - Dynamically adapts existing records into strongly typed Country, City, Airport, and Destination entities
 * - Generates deterministic IDs and consistent domain metadata
 */

import { GLOBAL_COUNTRIES, GlobalCountry } from '../../../data/globalDestinations';
import { Destination, DestinationType, Country, City, Airport, GeoCoordinates, BudgetTier } from './types';
import { createDestinationId, createCityId, createAirportId } from './identity';
import { generateDestinationSlug } from './normalization';

// Static Registry of Primary Transit Hubs & Airports for Canonical Cities
export const CANONICAL_AIRPORTS_DATA: Record<string, {
  iata: string;
  icao?: string;
  name: string;
  nameEn: string;
  nameAr?: string;
  cityId: string;
  countryCode: string;
  coords?: GeoCoordinates;
}> = {
  RUH: { iata: 'RUH', icao: 'OERK', name: 'King Khalid International Airport', nameEn: 'King Khalid International Airport', nameAr: 'مطار الملك خالد الدولي', cityId: 'city_sa_riyadh', countryCode: 'SA', coords: { latitude: 24.9576, longitude: 46.6988 } },
  JED: { iata: 'JED', icao: 'OEJN', name: 'King Abdulaziz International Airport', nameEn: 'King Abdulaziz International Airport', nameAr: 'مطار الملك عبد العزيز الدولي', cityId: 'city_sa_jeddah', countryCode: 'SA', coords: { latitude: 21.6796, longitude: 39.1565 } },
  MED: { iata: 'MED', icao: 'OEMA', name: 'Prince Mohammad bin Abdulaziz International Airport', nameEn: 'Prince Mohammad bin Abdulaziz International Airport', nameAr: 'مطار الأمير محمد بن عبد العزيز الدولي', cityId: 'city_sa_madinah', countryCode: 'SA', coords: { latitude: 24.5534, longitude: 39.7051 } },
  DMM: { iata: 'DMM', icao: 'OEDF', name: 'King Fahd International Airport', nameEn: 'King Fahd International Airport', nameAr: 'مطار الملك فهد الدولي', cityId: 'city_sa_dammam', countryCode: 'SA', coords: { latitude: 26.4712, longitude: 49.7979 } },
  DXB: { iata: 'DXB', icao: 'OMDB', name: 'Dubai International Airport', nameEn: 'Dubai International Airport', nameAr: 'مطار دبي الدولي', cityId: 'city_ae_dubai', countryCode: 'AE', coords: { latitude: 25.2532, longitude: 55.3657 } },
  AUH: { iata: 'AUH', icao: 'OMAA', name: 'Zayed International Airport', nameEn: 'Zayed International Airport', nameAr: 'مطار زايد الدولي', cityId: 'city_ae_abu_dhabi', countryCode: 'AE', coords: { latitude: 24.4330, longitude: 54.6511 } },
  CAI: { iata: 'CAI', icao: 'HECA', name: 'Cairo International Airport', nameEn: 'Cairo International Airport', nameAr: 'مطار القاهرة الدولي', cityId: 'city_eg_cairo', countryCode: 'EG', coords: { latitude: 30.1219, longitude: 31.4056 } },
  HBE: { iata: 'HBE', icao: 'HEBA', name: 'Borg El Arab International Airport', nameEn: 'Borg El Arab International Airport', nameAr: 'مطار برج العرب الدولي', cityId: 'city_eg_alexandria', countryCode: 'EG', coords: { latitude: 30.9177, longitude: 29.6964 } },
  SSH: { iata: 'SSH', icao: 'HESH', name: 'Sharm El Sheikh International Airport', nameEn: 'Sharm El Sheikh International Airport', nameAr: 'مطار شرم الشيخ الدولي', cityId: 'city_eg_sharm_el_sheikh', countryCode: 'EG', coords: { latitude: 27.9772, longitude: 34.3949 } },
  DOH: { iata: 'DOH', icao: 'OTHH', name: 'Hamad International Airport', nameEn: 'Hamad International Airport', nameAr: 'مطار حمد الدولي', cityId: 'city_qa_doha', countryCode: 'QA', coords: { latitude: 25.2731, longitude: 51.6081 } },
  KWI: { iata: 'KWI', icao: 'OKBK', name: 'Kuwait International Airport', nameEn: 'Kuwait International Airport', nameAr: 'مطار الكويت الدولي', cityId: 'city_kw_kuwait_city', countryCode: 'KW', coords: { latitude: 29.2267, longitude: 47.9806 } },
  MCT: { iata: 'MCT', icao: 'OOMS', name: 'Muscat International Airport', nameEn: 'Muscat International Airport', nameAr: 'مطار مسقط الدولي', cityId: 'city_om_muscat', countryCode: 'OM', coords: { latitude: 23.5933, longitude: 58.2844 } },
  BAH: { iata: 'BAH', icao: 'OBBI', name: 'Bahrain International Airport', nameEn: 'Bahrain International Airport', nameAr: 'مطار البحرين الدولي', cityId: 'city_bh_manama', countryCode: 'BH', coords: { latitude: 26.2708, longitude: 50.6336 } },
  AMM: { iata: 'AMM', icao: 'OJAI', name: 'Queen Alia International Airport', nameEn: 'Queen Alia International Airport', nameAr: 'مطار الملكة علياء الدولي', cityId: 'city_jo_amman', countryCode: 'JO', coords: { latitude: 31.7226, longitude: 35.9932 } },
  IST: { iata: 'IST', icao: 'LTFM', name: 'Istanbul Airport', nameEn: 'Istanbul Airport', nameAr: 'مطار إسطنبول الدولي', cityId: 'city_tr_istanbul', countryCode: 'TR', coords: { latitude: 41.2753, longitude: 28.7519 } },
  LHR: { iata: 'LHR', icao: 'EGLL', name: 'London Heathrow Airport', nameEn: 'London Heathrow Airport', nameAr: 'مطار لندن هيثرو', cityId: 'city_gb_london', countryCode: 'GB', coords: { latitude: 51.4700, longitude: -0.4543 } },
  CDG: { iata: 'CDG', icao: 'LFPG', name: 'Paris Charles de Gaulle Airport', nameEn: 'Paris Charles de Gaulle Airport', nameAr: 'مطار باريس شارل ديغول', cityId: 'city_fr_paris', countryCode: 'FR', coords: { latitude: 49.0097, longitude: 2.5479 } },
  FCO: { iata: 'FCO', icao: 'LIRF', name: 'Leonardo da Vinci–Fiumicino Airport', nameEn: 'Leonardo da Vinci–Fiumicino Airport', nameAr: 'مطار روما فيوميتشينو', cityId: 'city_it_rome', countryCode: 'IT', coords: { latitude: 41.8003, longitude: 12.2389 } },
  HND: { iata: 'HND', icao: 'RJTT', name: 'Tokyo Haneda Airport', nameEn: 'Tokyo Haneda Airport', nameAr: 'مطار طوكيو هانيدا', cityId: 'city_jp_tokyo', countryCode: 'JP', coords: { latitude: 35.5494, longitude: 139.7798 } },
  KUL: { iata: 'KUL', icao: 'WMKK', name: 'Kuala Lumpur International Airport', nameEn: 'Kuala Lumpur International Airport', nameAr: 'مطار كوالالمبور الدولي', cityId: 'city_my_kuala_lumpur', countryCode: 'MY', coords: { latitude: 2.7456, longitude: 101.7072 } },
  MLE: { iata: 'MLE', icao: 'VRMM', name: 'Velana International Airport', nameEn: 'Velana International Airport', nameAr: 'مطار فيلانا الدولي (المالديف)', cityId: 'city_mv_male', countryCode: 'MV', coords: { latitude: 4.1918, longitude: 73.5290 } },
  JFK: { iata: 'JFK', icao: 'KJFK', name: 'John F. Kennedy International Airport', nameEn: 'John F. Kennedy International Airport', nameAr: 'مطار جون إف كينيدي الدولي', cityId: 'city_us_new_york', countryCode: 'US', coords: { latitude: 40.6413, longitude: -73.7781 } }
};

// Known City English Names and Metadata dictionary for accurate translation & mapping
const KNOWN_CITY_DATA: Record<string, {
  nameEn: string;
  type?: DestinationType;
  primaryAirportIata?: string;
  coords?: GeoCoordinates;
  timezone?: string;
  budgetTier?: BudgetTier;
  travelStyles?: string[];
  idealDays?: { min: number; max: number; recommended: number };
  bestMonths?: string[];
}> = {
  'مكة المكرمة': { nameEn: 'Makkah', primaryAirportIata: 'JED', timezone: 'Asia/Riyadh', budgetTier: 'moderate', travelStyles: ['spiritual_pilgrimage', 'history_culture'], idealDays: { min: 3, max: 7, recommended: 4 }, coords: { latitude: 21.3891, longitude: 39.8579 }, bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'] },
  'المدينة المنورة': { nameEn: 'Madinah', primaryAirportIata: 'MED', timezone: 'Asia/Riyadh', budgetTier: 'moderate', travelStyles: ['spiritual_pilgrimage', 'history_culture'], idealDays: { min: 2, max: 5, recommended: 3 }, coords: { latitude: 24.5247, longitude: 39.5692 }, bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'] },
  'الرياض': { nameEn: 'Riyadh', primaryAirportIata: 'RUH', timezone: 'Asia/Riyadh', budgetTier: 'premium', travelStyles: ['luxury_shopping', 'history_culture', 'kids_entertainment'], idealDays: { min: 3, max: 6, recommended: 4 }, coords: { latitude: 24.7136, longitude: 46.6753 }, bestMonths: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'] },
  'العلا': { nameEn: 'AlUla', type: 'region', primaryAirportIata: 'MED', timezone: 'Asia/Riyadh', budgetTier: 'luxury', travelStyles: ['history_culture', 'relaxation_nature', 'adventure_thrills'], idealDays: { min: 2, max: 4, recommended: 3 }, coords: { latitude: 26.6186, longitude: 37.9248 }, bestMonths: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'] },
  'جدة': { nameEn: 'Jeddah', primaryAirportIata: 'JED', timezone: 'Asia/Riyadh', budgetTier: 'moderate', travelStyles: ['relaxation_nature', 'culinary_foodie', 'history_culture'], idealDays: { min: 2, max: 5, recommended: 3 }, coords: { latitude: 21.4858, longitude: 39.1925 }, bestMonths: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'] },
  'أبها وعسير': { nameEn: 'Abha and Asir', type: 'region', timezone: 'Asia/Riyadh', budgetTier: 'moderate', travelStyles: ['relaxation_nature', 'adventure_thrills'], idealDays: { min: 3, max: 5, recommended: 4 }, coords: { latitude: 18.2164, longitude: 42.5053 }, bestMonths: ['Jun', 'Jul', 'Aug', 'Sep'] },
  'دبي': { nameEn: 'Dubai', primaryAirportIata: 'DXB', timezone: 'Asia/Dubai', budgetTier: 'premium', travelStyles: ['luxury_shopping', 'kids_entertainment', 'culinary_foodie'], idealDays: { min: 4, max: 7, recommended: 5 }, coords: { latitude: 25.2048, longitude: 55.2708 }, bestMonths: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'] },
  'أبوظبي': { nameEn: 'Abu Dhabi', primaryAirportIata: 'AUH', timezone: 'Asia/Dubai', budgetTier: 'premium', travelStyles: ['history_culture', 'kids_entertainment', 'relaxation_nature'], idealDays: { min: 2, max: 4, recommended: 3 }, coords: { latitude: 24.4539, longitude: 54.3773 }, bestMonths: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'] },
  'رأس الخيمة والشارقة': { nameEn: 'Ras Al Khaimah and Sharjah', type: 'region', primaryAirportIata: 'DXB', timezone: 'Asia/Dubai', budgetTier: 'moderate', travelStyles: ['adventure_thrills', 'history_culture'], idealDays: { min: 2, max: 4, recommended: 3 }, coords: { latitude: 25.7895, longitude: 55.9432 }, bestMonths: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'] },
  'القاهرة والجيزة': { nameEn: 'Cairo and Giza', primaryAirportIata: 'CAI', timezone: 'Africa/Cairo', budgetTier: 'budget', travelStyles: ['history_culture', 'culinary_foodie', 'authentic_local'], idealDays: { min: 3, max: 6, recommended: 4 }, coords: { latitude: 30.0444, longitude: 31.2357 }, bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'] },
  'الأقصر وأسوان': { nameEn: 'Luxor and Aswan', type: 'region', timezone: 'Africa/Cairo', budgetTier: 'moderate', travelStyles: ['history_culture', 'relaxation_nature'], idealDays: { min: 3, max: 5, recommended: 4 }, coords: { latitude: 25.6872, longitude: 32.6396 }, bestMonths: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'] },
  'شرم الشيخ والغردقة': { nameEn: 'Sharm El Sheikh and Hurghada', type: 'region', primaryAirportIata: 'SSH', timezone: 'Africa/Cairo', budgetTier: 'moderate', travelStyles: ['relaxation_nature', 'adventure_thrills'], idealDays: { min: 4, max: 7, recommended: 5 }, coords: { latitude: 27.9158, longitude: 34.3299 }, bestMonths: ['Mar', 'Apr', 'May', 'Oct', 'Nov'] },
  'الإسكندرية والساحل الشمالي': { nameEn: 'Alexandria and North Coast', type: 'region', primaryAirportIata: 'HBE', timezone: 'Africa/Cairo', budgetTier: 'moderate', travelStyles: ['relaxation_nature', 'culinary_foodie', 'history_culture'], idealDays: { min: 2, max: 4, recommended: 3 }, coords: { latitude: 31.2001, longitude: 29.9187 }, bestMonths: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'] },
  'الدوحة ولوسيل': { nameEn: 'Doha and Lusail', primaryAirportIata: 'DOH', timezone: 'Asia/Qatar', budgetTier: 'premium', travelStyles: ['luxury_shopping', 'history_culture', 'culinary_foodie'], idealDays: { min: 3, max: 5, recommended: 4 }, coords: { latitude: 25.2854, longitude: 51.5310 }, bestMonths: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'] },
  'مدينة الكويت': { nameEn: 'Kuwait City', primaryAirportIata: 'KWI', timezone: 'Asia/Kuwait', budgetTier: 'moderate', travelStyles: ['culinary_foodie', 'history_culture', 'luxury_shopping'], idealDays: { min: 2, max: 4, recommended: 3 }, coords: { latitude: 29.3759, longitude: 47.9774 }, bestMonths: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'] },
  'مسقط والجبل الأخضر': { nameEn: 'Muscat and Jebel Akhdar', type: 'region', primaryAirportIata: 'MCT', timezone: 'Asia/Muscat', budgetTier: 'moderate', travelStyles: ['relaxation_nature', 'history_culture', 'adventure_thrills'], idealDays: { min: 3, max: 6, recommended: 4 }, coords: { latitude: 23.5880, longitude: 58.3829 }, bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'] },
  'صلالة وظفار': { nameEn: 'Salalah and Dhofar', type: 'region', timezone: 'Asia/Muscat', budgetTier: 'moderate', travelStyles: ['relaxation_nature', 'adventure_thrills'], idealDays: { min: 4, max: 7, recommended: 5 }, coords: { latitude: 17.0151, longitude: 54.0924 }, bestMonths: ['Jul', 'Aug', 'Sep'] },
  'إسطنبول': { nameEn: 'Istanbul', primaryAirportIata: 'IST', timezone: 'Europe/Istanbul', budgetTier: 'moderate', travelStyles: ['history_culture', 'culinary_foodie', 'luxury_shopping'], idealDays: { min: 4, max: 7, recommended: 5 }, coords: { latitude: 41.0082, longitude: 28.9784 }, bestMonths: ['Apr', 'May', 'Jun', 'Sep', 'Oct', 'Nov'] },
  'لندن': { nameEn: 'London', primaryAirportIata: 'LHR', timezone: 'Europe/London', budgetTier: 'premium', travelStyles: ['history_culture', 'luxury_shopping', 'kids_entertainment'], idealDays: { min: 4, max: 8, recommended: 6 }, coords: { latitude: 51.5074, longitude: -0.1278 }, bestMonths: ['May', 'Jun', 'Jul', 'Aug', 'Sep'] },
  'باريس': { nameEn: 'Paris', primaryAirportIata: 'CDG', timezone: 'Europe/Paris', budgetTier: 'premium', travelStyles: ['history_culture', 'luxury_shopping', 'culinary_foodie'], idealDays: { min: 4, max: 7, recommended: 5 }, coords: { latitude: 48.8566, longitude: 2.3522 }, bestMonths: ['Apr', 'May', 'Jun', 'Sep', 'Oct'] },
  'طوكيو': { nameEn: 'Tokyo', primaryAirportIata: 'HND', timezone: 'Asia/Tokyo', budgetTier: 'premium', travelStyles: ['history_culture', 'culinary_foodie', 'kids_entertainment'], idealDays: { min: 5, max: 9, recommended: 7 }, coords: { latitude: 35.6762, longitude: 139.6503 }, bestMonths: ['Mar', 'Apr', 'May', 'Oct', 'Nov'] },
  'كوالالمبور': { nameEn: 'Kuala Lumpur', primaryAirportIata: 'KUL', timezone: 'Asia/Kuala_Lumpur', budgetTier: 'budget', travelStyles: ['luxury_shopping', 'culinary_foodie', 'kids_entertainment'], idealDays: { min: 3, max: 5, recommended: 4 }, coords: { latitude: 3.1390, longitude: 101.6869 }, bestMonths: ['Dec', 'Jan', 'Feb', 'Jun', 'Jul', 'Aug'] },
  'جزر المالديف': { nameEn: 'Maldives Islands', type: 'island', primaryAirportIata: 'MLE', timezone: 'Indian/Maldives', budgetTier: 'luxury', travelStyles: ['relaxation_nature', 'adventure_thrills'], idealDays: { min: 4, max: 7, recommended: 5 }, coords: { latitude: 3.2028, longitude: 73.2207 }, bestMonths: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr'] }
};

/**
 * Transforms existing raw GlobalCountry items into canonical Country entities.
 */
export function adaptCountry(c: GlobalCountry): Country {
  return {
    code: c.code.toUpperCase(),
    name: c.name,
    nameEn: c.nameEn,
    nameAr: c.name,
    flag: c.flag,
    continent: c.continent,
    continentLabel: c.continentLabel,
    currency: c.currency,
  };
}

/**
 * Builds the canonical dataset of Countries from GLOBAL_COUNTRIES without duplicating data.
 */
export function buildCanonicalCountries(): Country[] {
  return GLOBAL_COUNTRIES.map(adaptCountry);
}

/**
 * Builds the canonical dataset of Cities from GLOBAL_COUNTRIES popularCities.
 */
export function buildCanonicalCities(): City[] {
  const cities: City[] = [];

  for (const c of GLOBAL_COUNTRIES) {
    const countryCode = c.code.toUpperCase();

    for (const rawCity of c.popularCities) {
      const known = KNOWN_CITY_DATA[rawCity.name];
      const nameEn = known?.nameEn || generateDestinationSlug(rawCity.name, 'city');
      const cityId = createCityId(countryCode, nameEn);

      cities.push({
        id: cityId,
        name: rawCity.name,
        nameEn: nameEn,
        nameAr: rawCity.name,
        countryCode: countryCode,
        administrativeRegion: rawCity.province,
        coordinates: known?.coords,
        timezone: known?.timezone,
        primaryAirportIata: known?.primaryAirportIata,
      });
    }
  }

  return cities;
}

/**
 * Builds the canonical dataset of Airports from the registered transit hubs.
 */
export function buildCanonicalAirports(): Airport[] {
  return Object.values(CANONICAL_AIRPORTS_DATA).map((a) => ({
    id: createAirportId(a.iata),
    iataCode: a.iata.toUpperCase(),
    icaoCode: a.icao,
    name: a.name,
    nameEn: a.nameEn,
    nameAr: a.nameAr,
    cityId: a.cityId,
    countryCode: a.countryCode.toUpperCase(),
    coordinates: a.coords,
    isInternational: true,
  }));
}

/**
 * Builds the canonical dataset of Destinations dynamically from GLOBAL_COUNTRIES.
 */
export function buildCanonicalDestinations(): Destination[] {
  const destinations: Destination[] = [];

  for (const c of GLOBAL_COUNTRIES) {
    const countryCode = c.code.toUpperCase();

    // 1. Country-level Destination
    const countryDestId = createDestinationId('country', countryCode, c.nameEn);
    const countrySlug = `country-${c.code.toLowerCase()}`;

    destinations.push({
      id: countryDestId,
      slug: countrySlug,
      type: 'country',
      name: c.name,
      nameEn: c.nameEn,
      nameAr: c.name,
      countryCode: countryCode,
      countryName: c.name,
      countryNameEn: c.nameEn,
      tags: [c.continent, c.currency],
      aliases: [c.name, c.nameEn, c.code],
    });

    // 2. City & Region & Island Destinations
    for (const rawCity of c.popularCities) {
      const known = KNOWN_CITY_DATA[rawCity.name];
      const nameEn = known?.nameEn || generateDestinationSlug(rawCity.name, 'destination');
      const destType: DestinationType = known?.type || 'city';
      const cityId = createCityId(countryCode, nameEn);
      const destId = createDestinationId(destType, countryCode, nameEn);
      const slug = `${c.code.toLowerCase()}-${generateDestinationSlug(nameEn)}`;

      const airportIata = known?.primaryAirportIata;
      const primaryAirportId = airportIata ? createAirportId(airportIata) : undefined;

      const landmarks = rawCity.landmark ? rawCity.landmark.split('و').map((s) => s.trim()).filter(Boolean) : [];

      destinations.push({
        id: destId,
        slug: slug,
        type: destType,
        name: rawCity.name,
        nameEn: nameEn,
        nameAr: rawCity.name,
        countryCode: countryCode,
        countryName: c.name,
        countryNameEn: c.nameEn,
        cityId: cityId,
        cityName: rawCity.name,
        administrativeRegion: rawCity.province,
        coordinates: known?.coords,
        timezone: known?.timezone,
        primaryAirportId: primaryAirportId,
        primaryAirportIata: airportIata,
        transitHubs: airportIata ? [airportIata] : [],
        budgetTier: known?.budgetTier || 'moderate',
        travelStyles: known?.travelStyles || ['history_culture', 'relaxation_nature'],
        tags: [c.continent, rawCity.tag].filter(Boolean),
        idealStayDuration: known?.idealDays ? {
          minDays: known.idealDays.min,
          maxDays: known.idealDays.max,
          recommendedDays: known.idealDays.recommended
        } : { minDays: 2, maxDays: 5, recommendedDays: 3 },
        bestTimeToVisit: known?.bestMonths ? {
          peakMonths: known.bestMonths,
          seasonDescription: 'Optimal climate and travel conditions'
        } : undefined,
        landmarkHighlights: landmarks,
        tagline: rawCity.tag,
        taglineAr: rawCity.tag,
        aliases: [
          rawCity.name,
          nameEn,
          rawCity.province || '',
          rawCity.landmark || '',
          `${rawCity.name} ${c.name}`,
          `${nameEn} ${c.nameEn}`
        ].filter(Boolean),
      });
    }
  }

  return destinations;
}

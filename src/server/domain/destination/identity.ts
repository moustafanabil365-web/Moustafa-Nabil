/**
 * Destination Domain Deterministic Identity Generator
 * EP1-002: Canonical ID strategy for destinations, cities, airports, and countries.
 * 
 * Rules:
 * - 100% Deterministic and reproducible
 * - Zero randomness / No UUIDs
 * - Independent of database or array index
 * - Prefixed and namespaced
 */

import { DestinationId, DestinationType } from './types';
import { generateDestinationSlug } from './normalization';

/**
 * Creates a branded canonical DestinationId.
 * Format: `dst_<type>_<countryCode>_<slug>`
 * e.g.:
 * - `dst_city_sa_riyadh`
 * - `dst_country_sa`
 * - `dst_landmark_eg_giza_pyramids`
 * - `dst_island_mv_maldives`
 * - `dst_region_sa_asir`
 */
export function createDestinationId(
  type: DestinationType,
  countryCode: string,
  slugOrName: string
): DestinationId {
  const safeCountry = (countryCode || 'xx').trim().toLowerCase().slice(0, 2);
  const slug = generateDestinationSlug(slugOrName);

  if (type === 'country') {
    return `dst_country_${safeCountry}` as DestinationId;
  }

  const cleanSlug = slug.replace(/_/g, '-');
  return `dst_${type}_${safeCountry}_${cleanSlug}` as DestinationId;
}

/**
 * Creates a deterministic canonical City ID.
 * Format: `city_<countryCode>_<citySlug>`
 * e.g. `city_sa_riyadh`, `city_ae_dubai`
 */
export function createCityId(countryCode: string, cityNameEn: string): string {
  const safeCountry = (countryCode || 'xx').trim().toLowerCase().slice(0, 2);
  const slug = generateDestinationSlug(cityNameEn);
  return `city_${safeCountry}_${slug}`;
}

/**
 * Creates a deterministic canonical Airport ID.
 * Format: `apt_<iataLowercase>`
 * e.g. `apt_ruh`, `apt_dxb`, `apt_cai`
 */
export function createAirportId(iataCode: string): string {
  const safeIata = (iataCode || 'xxx').trim().toLowerCase().slice(0, 3);
  return `apt_${safeIata}`;
}

/**
 * Creates a deterministic canonical Country ID.
 * Format: `country_<countryCodeLowercase>`
 * e.g. `country_sa`, `country_ae`
 */
export function createCountryId(countryCode: string): string {
  const safeCountry = (countryCode || 'xx').trim().toLowerCase().slice(0, 2);
  return `country_${safeCountry}`;
}

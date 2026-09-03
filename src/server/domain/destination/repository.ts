/**
 * Canonical Destination Domain In-Memory Repository & Lookup Foundation
 * EP1-002: Deterministic, type-safe lookups and lightweight in-memory indexes.
 * 
 * Rules:
 * - Deterministic lookup
 * - Normalized string comparison (Arabic & English)
 * - Safe handling of missing / unknown keys (no throws)
 * - No fuzzy search or external search engines (reserved for EP2)
 */

import { Destination, DestinationId, DestinationType, Country, City, Airport } from './types';
import { normalizeDestinationQuery } from './normalization';
import { 
  buildCanonicalCountries, 
  buildCanonicalCities, 
  buildCanonicalAirports, 
  buildCanonicalDestinations 
} from './adapter';

export class DestinationRepository {
  private destinationsById: Map<string, Destination> = new Map();
  private destinationsBySlug: Map<string, Destination> = new Map();
  private destinationsByCountry: Map<string, Destination[]> = new Map();
  private destinationsByType: Map<DestinationType, Destination[]> = new Map();
  private destinationsByTravelStyle: Map<string, Destination[]> = new Map();

  private countriesByCode: Map<string, Country> = new Map();
  private citiesById: Map<string, City> = new Map();
  private citiesByCountry: Map<string, City[]> = new Map();
  private airportsById: Map<string, Airport> = new Map();
  private airportsByIata: Map<string, Airport> = new Map();

  private allDestinations: Destination[] = [];
  private allCountries: Country[] = [];
  private allCities: City[] = [];
  private allAirports: Airport[] = [];

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    // 1. Countries
    this.allCountries = buildCanonicalCountries();
    for (const country of this.allCountries) {
      this.countriesByCode.set(country.code.toUpperCase(), country);
    }

    // 2. Cities
    this.allCities = buildCanonicalCities();
    for (const city of this.allCities) {
      this.citiesById.set(city.id, city);
      const countryCode = city.countryCode.toUpperCase();
      if (!this.citiesByCountry.has(countryCode)) {
        this.citiesByCountry.set(countryCode, []);
      }
      this.citiesByCountry.get(countryCode)!.push(city);
    }

    // 3. Airports
    this.allAirports = buildCanonicalAirports();
    for (const airport of this.allAirports) {
      this.airportsById.set(airport.id, airport);
      this.airportsByIata.set(airport.iataCode.toUpperCase(), airport);
    }

    // 4. Destinations
    this.allDestinations = buildCanonicalDestinations();
    for (const dest of this.allDestinations) {
      this.destinationsById.set(dest.id, dest);
      this.destinationsBySlug.set(dest.slug.toLowerCase(), dest);

      // Index by country
      const countryCode = dest.countryCode.toUpperCase();
      if (!this.destinationsByCountry.has(countryCode)) {
        this.destinationsByCountry.set(countryCode, []);
      }
      this.destinationsByCountry.get(countryCode)!.push(dest);

      // Index by type
      if (!this.destinationsByType.has(dest.type)) {
        this.destinationsByType.set(dest.type, []);
      }
      this.destinationsByType.get(dest.type)!.push(dest);

      // Index by travel styles
      if (dest.travelStyles) {
        for (const style of dest.travelStyles) {
          const styleKey = style.toLowerCase();
          if (!this.destinationsByTravelStyle.has(styleKey)) {
            this.destinationsByTravelStyle.set(styleKey, []);
          }
          this.destinationsByTravelStyle.get(styleKey)!.push(dest);
        }
      }
    }
  }

  // --- Destination Lookups ---

  public getDestinationById(id: DestinationId | string): Destination | undefined {
    if (!id) return undefined;
    return this.destinationsById.get(id);
  }

  public getDestinationBySlug(slug: string): Destination | undefined {
    if (!slug) return undefined;
    return this.destinationsBySlug.get(slug.trim().toLowerCase());
  }

  public getDestinationsByCountry(countryCode: string): Destination[] {
    if (!countryCode) return [];
    return this.destinationsByCountry.get(countryCode.trim().toUpperCase()) || [];
  }

  public getDestinationsByType(type: DestinationType): Destination[] {
    return this.destinationsByType.get(type) || [];
  }

  public getDestinationsByTravelStyle(travelStyle: string): Destination[] {
    if (!travelStyle) return [];
    return this.destinationsByTravelStyle.get(travelStyle.trim().toLowerCase()) || [];
  }

  public getAllDestinations(): Destination[] {
    return this.allDestinations;
  }

  /**
   * Performs deterministic lookup of destinations matching a query string
   * against name, nameEn, nameAr, aliases, province, and landmark tokens.
   */
  public findDestinationsByName(query: string): Destination[] {
    const normalizedQuery = normalizeDestinationQuery(query);
    if (!normalizedQuery) return [];

    const matches: Destination[] = [];

    for (const dest of this.allDestinations) {
      const normalizedNameAr = normalizeDestinationQuery(dest.nameAr);
      const normalizedNameEn = normalizeDestinationQuery(dest.nameEn);
      const normalizedCountryAr = normalizeDestinationQuery(dest.countryName);
      const normalizedCountryEn = normalizeDestinationQuery(dest.countryNameEn || '');
      const normalizedRegion = normalizeDestinationQuery(dest.administrativeRegion || '');

      let isMatch = 
        normalizedNameAr.includes(normalizedQuery) ||
        normalizedNameEn.includes(normalizedQuery) ||
        normalizedCountryAr.includes(normalizedQuery) ||
        normalizedCountryEn.includes(normalizedQuery) ||
        normalizedRegion.includes(normalizedQuery) ||
        (dest.countryCode.toLowerCase() === normalizedQuery);

      if (!isMatch && dest.aliases) {
        for (const alias of dest.aliases) {
          if (normalizeDestinationQuery(alias).includes(normalizedQuery)) {
            isMatch = true;
            break;
          }
        }
      }

      if (isMatch) {
        matches.push(dest);
      }
    }

    return matches;
  }

  // --- Country Lookups ---

  public getCountryByCode(code: string): Country | undefined {
    if (!code) return undefined;
    return this.countriesByCode.get(code.trim().toUpperCase());
  }

  public getAllCountries(): Country[] {
    return this.allCountries;
  }

  // --- City Lookups ---

  public getCityById(cityId: string): City | undefined {
    if (!cityId) return undefined;
    return this.citiesById.get(cityId.trim().toLowerCase());
  }

  public getCitiesByCountry(countryCode: string): City[] {
    if (!countryCode) return [];
    return this.citiesByCountry.get(countryCode.trim().toUpperCase()) || [];
  }

  public getAllCities(): City[] {
    return this.allCities;
  }

  // --- Airport Lookups ---

  public getAirportById(airportId: string): Airport | undefined {
    if (!airportId) return undefined;
    return this.airportsById.get(airportId.trim().toLowerCase());
  }

  public getAirportByIata(iataCode: string): Airport | undefined {
    if (!iataCode) return undefined;
    return this.airportsByIata.get(iataCode.trim().toUpperCase());
  }

  public getAllAirports(): Airport[] {
    return this.allAirports;
  }
}

// Global Singleton Instance for deterministic in-memory access
export const destinationRepository = new DestinationRepository();

// Convenient Root-Level Function Exports
export const getDestinationById = (id: DestinationId | string) => destinationRepository.getDestinationById(id);
export const getDestinationBySlug = (slug: string) => destinationRepository.getDestinationBySlug(slug);
export const findDestinationsByName = (query: string) => destinationRepository.findDestinationsByName(query);
export const getDestinationsByCountry = (countryCode: string) => destinationRepository.getDestinationsByCountry(countryCode);
export const getDestinationsByType = (type: DestinationType) => destinationRepository.getDestinationsByType(type);
export const getDestinationsByTravelStyle = (style: string) => destinationRepository.getDestinationsByTravelStyle(style);

export const getCountryByCode = (code: string) => destinationRepository.getCountryByCode(code);
export const getAllCountries = () => destinationRepository.getAllCountries();

export const getCityById = (cityId: string) => destinationRepository.getCityById(cityId);
export const getCitiesByCountry = (countryCode: string) => destinationRepository.getCitiesByCountry(countryCode);
export const getAllCities = () => destinationRepository.getAllCities();

export const getAirportById = (airportId: string) => destinationRepository.getAirportById(airportId);
export const getAirportByIata = (iataCode: string) => destinationRepository.getAirportByIata(iataCode);
export const getAllAirports = () => destinationRepository.getAllAirports();

/**
 * Canonical Destination Domain Types
 * EP1-002: Domain model for Destinations, Cities, Countries, and Transit Hubs in TraviQ.
 * 
 * Strict architectural rule: Pure TypeScript domain types without React or UI dependencies.
 */

export type DestinationId = string & { readonly __brand: unique symbol };

export type DestinationType = 
  | 'city' 
  | 'region' 
  | 'landmark' 
  | 'island' 
  | 'country';

export type BudgetTier = 'budget' | 'moderate' | 'premium' | 'luxury';

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface BestTimeToVisit {
  peakMonths: string[]; // e.g. ['Nov', 'Dec', 'Jan', 'Feb', 'Mar']
  shoulderMonths?: string[];
  lowMonths?: string[];
  seasonDescription?: string;
  seasonDescriptionAr?: string;
}

export interface IdealStayDuration {
  minDays: number;
  maxDays: number;
  recommendedDays: number;
}

export interface Country {
  code: string; // ISO 3166-1 alpha-2, e.g. "SA", "AE", "EG", "JP", "FR"
  name: string; // Primary localized name (Arabic or native)
  nameEn: string;
  nameAr: string;
  flag: string; // Emoji flag, e.g. "🇸🇦"
  continent: 'middle_east' | 'europe' | 'asia' | 'americas' | 'africa' | 'oceania';
  continentLabel?: string;
  currency: string; // ISO-4217, e.g. "SAR", "AED", "EGP", "USD", "EUR", "JPY"
  dialingCode?: string;
}

export interface City {
  id: string; // e.g. "city_sa_riyadh", "city_ae_dubai", "city_eg_cairo"
  name: string;
  nameEn: string;
  nameAr: string;
  countryCode: string; // ISO-2 country code
  administrativeRegion?: string; // Province / Governorate / State
  coordinates?: GeoCoordinates;
  timezone?: string; // IANA Timezone, e.g. "Asia/Riyadh", "Africa/Cairo"
  primaryAirportIata?: string; // Primary airport IATA code, e.g. "RUH", "DXB", "CAI"
}

export interface Airport {
  id: string; // e.g. "apt_ruh", "apt_dxb", "apt_cai"
  iataCode: string; // 3-letter IATA code, uppercase, e.g. "RUH"
  icaoCode?: string; // 4-letter ICAO code, uppercase, e.g. "OERK"
  name: string;
  nameEn: string;
  nameAr?: string;
  cityId: string; // Reference to canonical City ID
  countryCode: string; // ISO-2 country code
  coordinates?: GeoCoordinates;
  isInternational?: boolean;
}

export interface Destination {
  id: DestinationId;
  slug: string; // URL-safe stable slug, e.g. "sa-riyadh", "ae-dubai", "eg-giza-pyramids"
  type: DestinationType;
  name: string; // Default canonical display name
  nameEn: string;
  nameAr: string;
  countryCode: string; // ISO-2 country code
  countryName: string;
  countryNameEn?: string;
  
  // Optional Hierarchical & Geographic Links
  cityId?: string;
  cityName?: string;
  administrativeRegion?: string;
  coordinates?: GeoCoordinates;
  timezone?: string;
  
  // Transit & Airports
  primaryAirportId?: string;
  primaryAirportIata?: string;
  transitHubs?: string[];
  
  // Travel Experience Context
  bestTimeToVisit?: BestTimeToVisit;
  travelStyles?: string[];
  tags?: string[];
  budgetTier?: BudgetTier;
  idealStayDuration?: IdealStayDuration;
  
  // Search & Alias Metadata
  landmarkHighlights?: string[];
  tagline?: string;
  taglineAr?: string;
  aliases?: string[];
  
  // External / Provider identifiers (if applicable)
  providerIdentifiers?: Record<string, string>;
}

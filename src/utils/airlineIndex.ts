import { OFFICIAL_AIRLINES_DATABASE, OfficialAirline } from './bookingUtils';
import { AirlineClassification, classifyAirline } from './airlineClassification';

// Enrich legacy airlines with safe defaults (do not invent classifications)
export const OFFICIAL_AIRLINES_ENRICHED: OfficialAirline[] = OFFICIAL_AIRLINES_DATABASE.map((a) => ({
  ...a,
  // preserve existing fields; add safe metadata defaults for backward compatibility
  isActive: a.isActive !== undefined ? a.isActive : true,
  dataSource: a.dataSource || 'legacy_import',
  verified: a.verified || false,
  confidence: typeof a.confidence === 'number' ? a.confidence : 0,
}));

// In-memory lookup maps for O(1) access
export const AIRLINES_BY_IATA: Record<string, OfficialAirline> = {};
export const AIRLINES_BY_ICAO: Record<string, OfficialAirline> = {};
export const AIRLINES_BY_ID: Record<string, OfficialAirline> = {};

OFFICIAL_AIRLINES_ENRICHED.forEach((airline) => {
  AIRLINES_BY_ID[airline.id] = airline;
  if (airline.iataCode) {
    AIRLINES_BY_IATA[airline.iataCode.toUpperCase()] = airline;
  }
  if (airline.icaoCode) {
    AIRLINES_BY_ICAO[airline.icaoCode.toUpperCase()] = airline;
  }
});

export function getAirlineByIata(iata: string): OfficialAirline | null {
  if (!iata) return null;
  return AIRLINES_BY_IATA[iata.toUpperCase()] || null;
}

export function getAirlineByIcao(icao: string): OfficialAirline | null {
  if (!icao) return null;
  return AIRLINES_BY_ICAO[icao.toUpperCase()] || null;
}

export function getAirlineById(id: string): OfficialAirline | null {
  return AIRLINES_BY_ID[id] || null;
}

export function classifyAirlineRecord(airline: OfficialAirline): AirlineClassification {
  return classifyAirline(airline);
}

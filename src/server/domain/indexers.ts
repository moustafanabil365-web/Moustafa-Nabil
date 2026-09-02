/* Simple indexer adapters (EP1/EP2 foundations)
 * These adapters create in-memory index entries from existing normalization data.
 * They DO NOT duplicate normalization logic; they reuse bookingUtils and normalization utilities.
 */
import { OFFICIAL_AIRLINES_DATABASE, OfficialHotelChain } from '../../utils/bookingUtils';
import { getAirlineByIata } from '../../utils/airlineIndex';
import { normalizeHotelName } from '../../utils/hotelNormalization';
import { PlaceIndexEntry, PlaceType } from './types';

export function buildAirlineIndexEntries(): PlaceIndexEntry[] {
  return OFFICIAL_AIRLINES_DATABASE.map((a) => ({
    id: a.id,
    type: PlaceType.AIRLINE,
    title: a.nameEn || a.name,
    subtitle: a.country,
    iata: (a as any).iataCode || undefined,
    icao: (a as any).icaoCode || undefined,
    source: (a as any).dataSource || 'official_airlines',
  }));
}

export function buildHotelIndexEntries(hotels: OfficialHotelChain[]): PlaceIndexEntry[] {
  return hotels.map((h) => ({
    id: h.id,
    type: PlaceType.HOTEL,
    title: h.name,
    subtitle: h.samplePhone || undefined,
    source: h.dataSource || 'official_hotels',
  }));
}

export function findAirlineByIataCode(iata: string) {
  return getAirlineByIata(iata);
}

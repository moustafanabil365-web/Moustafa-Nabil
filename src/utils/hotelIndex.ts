import { OFFICIAL_HOTEL_CHAINS_DATABASE, OfficialHotelChain } from './bookingUtils';

export const OFFICIAL_HOTELS_ENRICHED: OfficialHotelChain[] = OFFICIAL_HOTEL_CHAINS_DATABASE.map((h) => ({
  ...h,
  isActive: h.isActive !== undefined ? h.isActive : true,
  dataSource: h.dataSource || 'legacy_import',
  verified: h.verified || false,
  confidence: typeof h.confidence === 'number' ? h.confidence : 0,
}));

export const HOTELS_BY_ID: Record<string, OfficialHotelChain> = {};
export const HOTELS_BY_NORMALIZED_NAME: Record<string, OfficialHotelChain> = {};

OFFICIAL_HOTELS_ENRICHED.forEach((h) => {
  HOTELS_BY_ID[h.id] = h;
  if (h.name) {
    HOTELS_BY_NORMALIZED_NAME[h.name.toLowerCase()] = h;
  }
});

export function getHotelById(id: string): OfficialHotelChain | null {
  return HOTELS_BY_ID[id] || null;
}

export function findHotelByNormalizedName(name: string): OfficialHotelChain | null {
  if (!name) return null;
  return HOTELS_BY_NORMALIZED_NAME[name.toLowerCase()] || null;
}

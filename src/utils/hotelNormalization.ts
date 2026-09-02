import { OfficialHotelChain } from './bookingUtils';

function normalizeText(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[\u200E\u200F\u202A-\u202E]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, ' ')
    .trim();
}

export function normalizeHotelName(name: string): string {
  return normalizeText(name);
}

export function findHotelByName(hotels: OfficialHotelChain[], name: string): OfficialHotelChain | null {
  const norm = normalizeHotelName(name);
  const byName = hotels.find((h) => h.name && normalizeHotelName(h.name) === norm);
  if (byName) return byName;
  const byAlias = hotels.find((h) => (h as any).aliases && Array.isArray((h as any).aliases) && (h as any).aliases.map(String).some((al: string) => normalizeHotelName(al) === norm));
  if (byAlias) return byAlias;
  return null;
}

export function suggestHotelCandidates(hotels: OfficialHotelChain[], name: string): OfficialHotelChain[] {
  const norm = normalizeHotelName(name);
  if (!norm) return [];
  const candidates = hotels.filter((h) => {
    const n1 = h.name ? normalizeHotelName(h.name) : '';
    return n1.includes(norm);
  });
  return candidates.slice(0, 10);
}

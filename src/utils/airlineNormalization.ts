import { OfficialAirline } from './bookingUtils';

function normalizeTextForMatching(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[\u200E\u200F\u202A-\u202E]/g, '') // remove RTL/LTR markers
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, ' ') // keep Arabic range
    .trim();
}

export function normalizeAirlineName(name: string): string {
  return normalizeTextForMatching(name);
}

export function normalizeAirlineCode(code: string): string {
  return code.trim().toUpperCase();
}

export function findAirlineByCode(
  airlines: OfficialAirline[],
  code: string
): OfficialAirline | null {
  const norm = normalizeAirlineCode(code);
  // Prefer ICAO exact match then IATA
  const byIcao = airlines.find((a) => a.icaoCode && normalizeAirlineCode(a.icaoCode) === norm);
  if (byIcao) return byIcao;
  const byIata = airlines.find((a) => a.iataCode && normalizeAirlineCode(a.iataCode) === norm);
  if (byIata) return byIata;
  return null;
}

export function findAirlineByName(
  airlines: OfficialAirline[],
  name: string
): OfficialAirline | null {
  const norm = normalizeAirlineName(name);
  // Exact normalized match against nameEn and name
  const byNameEn = airlines.find((a) => a.nameEn && normalizeAirlineName(a.nameEn) === norm);
  if (byNameEn) return byNameEn;
  const byLocal = airlines.find((a) => a.name && normalizeAirlineName(a.name) === norm);
  if (byLocal) return byLocal;
  // controlled aliases (if present) — not invented
  const byAlias = airlines.find((a) => {
    const maybe = (a as unknown) as { aliases?: unknown };
    if (!maybe.aliases || !Array.isArray(maybe.aliases)) return false;
    return (maybe.aliases as string[]).map(String).some((al) => normalizeAirlineName(al) === norm);
  });
  if (byAlias) return byAlias;
  return null;
}

export function suggestAirlineCandidates(airlines: OfficialAirline[], name: string): OfficialAirline[] {
  // Provide candidate suggestions using simple substring matching (not authoritative)
  const norm = normalizeAirlineName(name);
  if (!norm) return [];
  const candidates = airlines.filter((a) => {
    const n1 = a.nameEn ? normalizeAirlineName(a.nameEn) : '';
    const n2 = a.name ? normalizeAirlineName(a.name) : '';
    return n1.includes(norm) || n2.includes(norm);
  });
  return candidates.slice(0, 10);
}

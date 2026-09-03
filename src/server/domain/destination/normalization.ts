/**
 * Destination Normalization Utilities
 * EP1-002: Deterministic, safe text and query normalization for the Destination domain.
 * 
 * Rules:
 * - Safe whitespace collapsing
 * - Unicode NFKD normalization
 * - Arabic Tashkeel & Tatweel removal
 * - Arabic letter variant unification (Alef, Taa Marbouta, Yaa/Maksura)
 * - Punctuation stripping
 * - Slug generation
 */

/**
 * Normalizes an Arabic string by removing diacritics (tashkeel), tatweel,
 * and normalizing common letter variants for robust deterministic indexing.
 */
export function normalizeArabicText(text: string): string {
  if (!text) return '';

  return (
    text
      // 1. Remove Arabic diacritics / Tashkeel (Fatha, Damma, Kasra, Sukun, Shadda, Tanween, etc.)
      .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
      // 2. Remove Tatweel (ـ)
      .replace(/\u0640/g, '')
      // 3. Normalize Alef variants (أ, إ, آ, ٱ -> ا)
      .replace(/[أإآٱ]/g, 'ا')
      // 4. Normalize Taa Marbouta (ة -> ه) for lookup tolerance
      .replace(/ة/g, 'ه')
      // 5. Normalize Yaa / Alef Maksura (ى, ئ -> ي)
      .replace(/[ىئ]/g, 'ي')
      // 6. Normalize Waw with Hamza (ؤ -> و)
      .replace(/ؤ/g, 'و')
  );
}

/**
 * Normalizes destination query text or entity names for deterministic search and comparison.
 * Handles both Latin and Arabic inputs safely.
 */
export function normalizeDestinationQuery(text: string): string {
  if (!text) return '';

  let normalized = text.trim();

  // 1. Unicode decomposition to separate accents
  normalized = normalized.normalize('NFKD');

  // 2. Strip Latin accent marks
  normalized = normalized.replace(/[\u0300-\u036f]/g, '');

  // 3. Lowercase Latin characters
  normalized = normalized.toLowerCase();

  // 4. Normalize Arabic specific characters and diacritics
  normalized = normalizeArabicText(normalized);

  // 5. Replace common punctuation and symbols with a single space
  normalized = normalized.replace(/[.,/#!$%^&*;:{}=\-_`~()'"?؟،!«»[\]\\]/g, ' ');

  // 6. Collapse multiple whitespace into a single space
  normalized = normalized.replace(/\s+/g, ' ').trim();

  return normalized;
}

/**
 * Generates a clean, deterministic, URL-friendly ASCII slug from a name or phrase.
 * If the input is primarily non-Latin (e.g. Arabic), transliterates known tokens
 * or produces a safe sanitized slug.
 */
export function generateDestinationSlug(nameEn: string, fallbackSuffix?: string): string {
  if (!nameEn) {
    return fallbackSuffix ? fallbackSuffix.toLowerCase() : 'unknown';
  }

  const slug = nameEn
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    // Replace non-alphanumeric chars with hyphen
    .replace(/[^a-z0-9]+/g, '-')
    // Remove leading and trailing hyphens
    .replace(/^-+|-+$/g, '');

  return slug || (fallbackSuffix ? fallbackSuffix.toLowerCase() : 'dest');
}

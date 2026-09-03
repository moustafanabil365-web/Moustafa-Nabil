import {
  ResidentialServiceLevel,
  ResidentialPropertyType,
  ResidentialStayType,
  ResidentialSegment,
  ResidentialProperty,
} from '../types';

/**
 * Deterministically classifies the property type based on name and text markers.
 */
export function classifyResidentialPropertyType(
  name: string,
  description: string = ''
): ResidentialPropertyType {
  const combined = `${name} ${description}`.toLowerCase().trim();

  // Specific types tested before general ones
  if (combined.includes('penthouse') || combined.includes('بنتهاوس') || combined.includes('رووف') || combined.includes('roof suite')) {
    return 'PENTHOUSE';
  }
  if (combined.includes('duplex') || combined.includes('دوبلكس') || combined.includes('two-floor') || combined.includes('two-level')) {
    return 'DUPLEX';
  }
  if (combined.includes('villa') || combined.includes('فيلا') || combined.includes('شاليه') || combined.includes('chalet') || combined.includes('mansion')) {
    return 'VILLA';
  }
  if (combined.includes('townhouse') || combined.includes('تاون هاوس') || combined.includes('town house') || combined.includes('row house')) {
    return 'TOWNHOUSE';
  }
  if (combined.includes('studio') || combined.includes('استوديو') || combined.includes('استديو') || combined.includes('single room flat')) {
    return 'STUDIO';
  }
  if (combined.includes('aparthotel') || combined.includes('apart-hotel') || combined.includes('apart hotel') || combined.includes('شقق فندقية')) {
    return 'APARTHOTEL';
  }
  if (
    combined.includes('serviced apartment') ||
    combined.includes('serviced flat') ||
    combined.includes('executive apartment') ||
    combined.includes('شقة مخدومة') ||
    combined.includes('شقق مخدومة')
  ) {
    return 'SERVICED_APARTMENT';
  }
  if (
    combined.includes('residence') ||
    combined.includes('residences') ||
    combined.includes('سكن') ||
    combined.includes('مجمع سكني') ||
    combined.includes('إقامة سكنية')
  ) {
    return 'RESIDENCE';
  }
  if (combined.includes('flat') || combined.includes('شقة سكنية')) {
    return 'FLAT';
  }

  // Default fallback for residential accommodation
  return 'APARTMENT';
}

/**
 * Deterministically classifies the service level (Luxury, Premium, Standard, Budget).
 */
export function classifyResidentialServiceLevel(
  name: string,
  description: string = '',
  cues?: Partial<ResidentialProperty>
): ResidentialServiceLevel {
  if (cues?.serviceLevel) {
    return cues.serviceLevel;
  }

  const combined = `${name} ${description}`.toLowerCase().trim();

  // 1. Luxury signals
  const luxuryKeywords = [
    'luxury',
    'ultra-luxury',
    'royal',
    'palace',
    'five-star',
    '5 star',
    '5-star',
    'فاخر',
    'فاخرة',
    'ملكي',
    'سوبر ديلوكس',
    'super deluxe',
    'vip',
    'bespoke',
    'presidential',
    'cheval blanc',
    'bulgari residence',
    'four seasons private',
  ];
  if (luxuryKeywords.some((kw) => combined.includes(kw))) {
    return 'LUXURY';
  }

  // 2. Budget signals
  const budgetKeywords = [
    'budget',
    'economy',
    'low cost',
    'low-cost',
    'cheap',
    'اقتصادي',
    'اقتصادية',
    'رخيص',
    'شعبية',
    'basic flat',
    'hostel',
    'student flat',
    'بسيط',
  ];
  if (budgetKeywords.some((kw) => combined.includes(kw))) {
    return 'BUDGET';
  }

  // 3. Premium signals
  const premiumKeywords = [
    'premium',
    'upscale',
    'executive',
    'deluxe',
    'boutique',
    'راقٍ',
    'راقية',
    'مميز',
    'تنفيذي',
    'fraser suites',
    'ascott',
    'citadines',
    'marriott executive',
    'somerset',
    'oakwood',
  ];
  if (premiumKeywords.some((kw) => combined.includes(kw))) {
    return 'PREMIUM';
  }

  // Default baseline for verified mainstream residential stays
  return 'STANDARD';
}

/**
 * Deterministically classifies the stay type (Short, Long, Monthly, Family, Business).
 */
export function classifyResidentialStayType(
  name: string,
  description: string = ''
): ResidentialStayType | undefined {
  const combined = `${name} ${description}`.toLowerCase().trim();

  if (
    combined.includes('monthly') ||
    combined.includes('شهري') ||
    combined.includes('إيجار شهري') ||
    combined.includes('30 days') ||
    combined.includes('month-to-month') ||
    combined.includes('long-term lease')
  ) {
    return 'MONTHLY';
  }

  if (
    combined.includes('extended stay') ||
    combined.includes('long stay') ||
    combined.includes('إقامة طويلة') ||
    combined.includes('إقامة ممتدة') ||
    combined.includes('multi-week')
  ) {
    return 'LONG_STAY';
  }

  if (
    combined.includes('business stay') ||
    combined.includes('corporate stay') ||
    combined.includes('corporate housing') ||
    combined.includes('سفر عمل') ||
    combined.includes('رجال أعمال')
  ) {
    return 'BUSINESS_STAY';
  }

  if (
    combined.includes('family stay') ||
    combined.includes('إقامة عائلية') ||
    combined.includes('عطلة عائلية')
  ) {
    return 'FAMILY_STAY';
  }

  if (
    combined.includes('short stay') ||
    combined.includes('nightly') ||
    combined.includes('daily') ||
    combined.includes('يومي') ||
    combined.includes('عطلة نهاية الأسبوع') ||
    combined.includes('weekend')
  ) {
    return 'SHORT_STAY';
  }

  return undefined;
}

/**
 * Deterministically classifies the primary residential market segment.
 */
export function classifyResidentialSegment(
  name: string,
  description: string = ''
): ResidentialSegment | undefined {
  const combined = `${name} ${description}`.toLowerCase().trim();

  if (
    combined.includes('workation') ||
    combined.includes('digital nomad') ||
    combined.includes('remote work') ||
    combined.includes('عمل عن بعد')
  ) {
    return 'WORKATION';
  }

  if (
    combined.includes('beach') ||
    combined.includes('beachfront') ||
    combined.includes('sea view') ||
    combined.includes('coastal') ||
    combined.includes('شاطئ') ||
    combined.includes('مطل على البحر') ||
    combined.includes('ساحلي')
  ) {
    return 'BEACH';
  }

  if (
    combined.includes('city center') ||
    combined.includes('downtown') ||
    combined.includes('central') ||
    combined.includes('وسط المدينة') ||
    combined.includes('وسط البلد') ||
    combined.includes('المركز')
  ) {
    return 'CITY_CENTER';
  }

  if (
    combined.includes('family friendly') ||
    combined.includes('kids friendly') ||
    combined.includes('صديق للأطفال') ||
    combined.includes('مناسب للعائلات')
  ) {
    return 'FAMILY_FRIENDLY';
  }

  if (
    combined.includes('family') ||
    combined.includes('عائلي') ||
    combined.includes('عائلات') ||
    combined.includes('أسر')
  ) {
    return 'FAMILY';
  }

  if (
    combined.includes('business') ||
    combined.includes('corporate') ||
    combined.includes('executive') ||
    combined.includes('أعمال') ||
    combined.includes('شركات')
  ) {
    return 'BUSINESS';
  }

  if (
    combined.includes('honeymoon') ||
    combined.includes('couples') ||
    combined.includes('romantic') ||
    combined.includes('أزواج') ||
    combined.includes('شهر عسل') ||
    combined.includes('رومانسي')
  ) {
    return 'COUPLES';
  }

  if (
    combined.includes('luxury') ||
    combined.includes('فاخر') ||
    combined.includes('vip') ||
    combined.includes('royal')
  ) {
    return 'LUXURY';
  }

  if (
    combined.includes('budget') ||
    combined.includes('اقتصادي') ||
    combined.includes('low cost')
  ) {
    return 'BUDGET';
  }

  if (
    combined.includes('long stay') ||
    combined.includes('monthly') ||
    combined.includes('إقامة طويلة')
  ) {
    return 'LONG_STAY';
  }

  return undefined;
}

/**
 * Returns complete deterministic classification for a residential property.
 */
export function getResidentialClassification(
  name: string,
  description: string = '',
  cues?: Partial<ResidentialProperty>
): {
  serviceLevel: ResidentialServiceLevel;
  propertyType: ResidentialPropertyType;
  stayType?: ResidentialStayType;
  residentialSegment?: ResidentialSegment;
} {
  return {
    serviceLevel: classifyResidentialServiceLevel(name, description, cues),
    propertyType: classifyResidentialPropertyType(name, description),
    stayType: classifyResidentialStayType(name, description),
    residentialSegment: classifyResidentialSegment(name, description),
  };
}

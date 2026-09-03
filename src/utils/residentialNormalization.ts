import {
  ResidentialProperty,
  ResidentialPropertyType,
  ResidentialServiceLevel,
  ResidentialStayType,
  ResidentialSegment,
} from '../types';
import {
  classifyResidentialPropertyType,
  classifyResidentialServiceLevel,
  classifyResidentialStayType,
  classifyResidentialSegment,
} from './residentialClassification';

/**
 * Normalizes a residential property name for reliable indexing and search.
 * Handles case-insensitivity, unicode accents, excessive whitespace, and punctuation.
 */
export function normalizeResidentialPropertyName(name: string): string {
  if (!name || typeof name !== 'string') return '';
  return name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()'"’]/g, ' ') // replace punctuation with space
    .replace(/\s+/g, ' ') // collapse multiple spaces
    .trim();
}

/**
 * Normalizes a raw string into a valid ResidentialPropertyType if matching.
 */
export function normalizePropertyType(rawType: string): ResidentialPropertyType | undefined {
  if (!rawType || typeof rawType !== 'string') return undefined;
  const clean = rawType.trim().toUpperCase().replace(/[\s-]+/g, '_');
  
  const validTypes: Record<string, ResidentialPropertyType> = {
    APARTMENT: 'APARTMENT',
    FLAT: 'FLAT',
    SERVICED_APARTMENT: 'SERVICED_APARTMENT',
    STUDIO: 'STUDIO',
    PENTHOUSE: 'PENTHOUSE',
    DUPLEX: 'DUPLEX',
    VILLA: 'VILLA',
    TOWNHOUSE: 'TOWNHOUSE',
    RESIDENCE: 'RESIDENCE',
    APARTHOTEL: 'APARTHOTEL',
    // Aliases
    APART_HOTEL: 'APARTHOTEL',
    SERVICED_RESIDENCE: 'SERVICED_APARTMENT',
    TOWN_HOUSE: 'TOWNHOUSE',
    CHALET: 'VILLA',
  };

  return validTypes[clean] || classifyResidentialPropertyType(rawType);
}

/**
 * Normalizes a raw string into a valid ResidentialServiceLevel.
 */
export function normalizeServiceLevel(rawLevel: string): ResidentialServiceLevel | undefined {
  if (!rawLevel || typeof rawLevel !== 'string') return undefined;
  const clean = rawLevel.trim().toUpperCase();

  const validLevels: Record<string, ResidentialServiceLevel> = {
    LUXURY: 'LUXURY',
    PREMIUM: 'PREMIUM',
    STANDARD: 'STANDARD',
    BUDGET: 'BUDGET',
    // Aliases
    ECONOMY: 'BUDGET',
    FIRST_CLASS: 'PREMIUM',
    FIVE_STAR: 'LUXURY',
    MIDSCALE: 'STANDARD',
  };

  return validLevels[clean] || undefined;
}

/**
 * In-memory index structure for fast lookups.
 */
export interface ResidentialIndexStructure {
  byId: Map<string, ResidentialProperty>;
  byNormalizedName: Map<string, ResidentialProperty>;
  byType: Map<ResidentialPropertyType, ResidentialProperty[]>;
  byServiceLevel: Map<ResidentialServiceLevel, ResidentialProperty[]>;
  byCity: Map<string, ResidentialProperty[]>;
}

/**
 * Builds deterministic index maps for high-performance lookups.
 */
export function createResidentialIndexes(
  properties: ResidentialProperty[]
): ResidentialIndexStructure {
  const byId = new Map<string, ResidentialProperty>();
  const byNormalizedName = new Map<string, ResidentialProperty>();
  const byType = new Map<ResidentialPropertyType, ResidentialProperty[]>();
  const byServiceLevel = new Map<ResidentialServiceLevel, ResidentialProperty[]>();
  const byCity = new Map<string, ResidentialProperty[]>();

  for (const property of properties) {
    if (!property.id) continue;

    byId.set(property.id.toLowerCase(), property);

    const normName = normalizeResidentialPropertyName(property.name);
    if (normName) {
      byNormalizedName.set(normName, property);
    }
    if (property.nameEn) {
      const normNameEn = normalizeResidentialPropertyName(property.nameEn);
      if (normNameEn) {
        byNormalizedName.set(normNameEn, property);
      }
    }

    // Type Index
    const currentTypeList = byType.get(property.propertyType) || [];
    currentTypeList.push(property);
    byType.set(property.propertyType, currentTypeList);

    // Service Level Index
    const currentLevelList = byServiceLevel.get(property.serviceLevel) || [];
    currentLevelList.push(property);
    byServiceLevel.set(property.serviceLevel, currentLevelList);

    // City Index
    if (property.city) {
      const cityKey = property.city.toLowerCase().trim();
      const currentCityList = byCity.get(cityKey) || [];
      currentCityList.push(property);
      byCity.set(cityKey, currentCityList);
    }
  }

  return { byId, byNormalizedName, byType, byServiceLevel, byCity };
}

/**
 * Finds a residential property by exact or normalized name.
 */
export function findResidentialPropertyByName(
  name: string,
  properties: ResidentialProperty[]
): ResidentialProperty | undefined {
  if (!name) return undefined;
  const targetNorm = normalizeResidentialPropertyName(name);
  if (!targetNorm) return undefined;

  // 1. Direct match
  const directMatch = properties.find(
    (p) =>
      normalizeResidentialPropertyName(p.name) === targetNorm ||
      (p.nameEn && normalizeResidentialPropertyName(p.nameEn) === targetNorm)
  );
  if (directMatch) return directMatch;

  // 2. Substring match
  return properties.find((p) => {
    const pNorm = normalizeResidentialPropertyName(p.name);
    const pNormEn = p.nameEn ? normalizeResidentialPropertyName(p.nameEn) : '';
    return (
      (pNorm && (pNorm.includes(targetNorm) || targetNorm.includes(pNorm))) ||
      (pNormEn && (pNormEn.includes(targetNorm) || targetNorm.includes(pNormEn)))
    );
  });
}

/**
 * Finds a residential property by ID.
 */
export function findResidentialPropertyById(
  id: string,
  properties: ResidentialProperty[]
): ResidentialProperty | undefined {
  if (!id) return undefined;
  const targetId = id.trim().toLowerCase();
  return properties.find((p) => p.id.toLowerCase() === targetId);
}

// ==========================================
// Pure Filtering Functions
// ==========================================

export function filterResidentialByServiceLevel(
  properties: ResidentialProperty[],
  level: ResidentialServiceLevel
): ResidentialProperty[] {
  return properties.filter((p) => p.serviceLevel === level);
}

export function filterResidentialByPropertyType(
  properties: ResidentialProperty[],
  type: ResidentialPropertyType
): ResidentialProperty[] {
  return properties.filter((p) => p.propertyType === type);
}

export function filterResidentialByStayType(
  properties: ResidentialProperty[],
  stayType: ResidentialStayType
): ResidentialProperty[] {
  return properties.filter((p) => p.stayType === stayType);
}

export function filterResidentialBySegment(
  properties: ResidentialProperty[],
  segment: ResidentialSegment
): ResidentialProperty[] {
  return properties.filter((p) => {
    if (p.residentialSegment === segment) return true;
    if (p.residentialSegments && p.residentialSegments.includes(segment)) return true;
    return false;
  });
}

export function filterResidentialByBedrooms(
  properties: ResidentialProperty[],
  minBedrooms: number
): ResidentialProperty[] {
  return properties.filter((p) => (p.bedrooms !== undefined ? p.bedrooms >= minBedrooms : true));
}

export function filterResidentialByGuests(
  properties: ResidentialProperty[],
  guestsCount: number
): ResidentialProperty[] {
  return properties.filter((p) => (p.maxGuests !== undefined ? p.maxGuests >= guestsCount : true));
}

// ==========================================
// Verified Canonical Residential Properties Dataset
// ==========================================

export const OFFICIAL_RESIDENTIAL_PROPERTIES_DATABASE: ResidentialProperty[] = [
  {
    id: 'marriott_exec_apts',
    name: 'شقق ماريوت الفندقية التنفيذية (Marriott Executive Apartments)',
    nameEn: 'Marriott Executive Apartments',
    serviceLevel: 'PREMIUM',
    propertyType: 'SERVICED_APARTMENT',
    stayType: 'LONG_STAY',
    residentialSegment: 'BUSINESS',
    residentialSegments: ['BUSINESS', 'FAMILY', 'LONG_STAY'],
    city: 'Riyadh',
    country: 'Saudi Arabia',
    addressArea: 'Al Maather / Olaya',
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    officialUrl: 'https://www.marriott.com',
    logoEmoji: '🏢',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
    tagline: 'شقق مفروشة بالكامل بمستويات فندقية 5 نجوم لرجال الأعمال والإقامات الممتدة',
    description: 'مطبخ متكامل، خدمات تنظيف يومية، ومكتب استقبال ومسبح خاص مع كسب نقاط بونفوي.',
    directBenefits: [
      'حجز مباشر بدون عمولة وسيط مع ضمان أفضل سعر',
      'خدمة كونسيرج واستقبال على مدار 24 ساعة',
      'مطبخ متكامل وغسالة ملابس داخل الشقة',
      'نقاط Marriott Bonvoy المباشرة',
    ],
    amenities: ['Kitchen', 'WiFi', 'Pool', 'Housekeeping', 'Gym', 'Parking'],
    isActive: true,
    dataSource: 'OFFICIAL_PROVIDER_REGISTRY',
    verified: true,
    confidence: 0.98,
  },
  {
    id: 'ascott_residences',
    name: 'أسكوت ريزيدنس الفندقية (The Ascott Limited)',
    nameEn: 'Ascott The Residence',
    serviceLevel: 'PREMIUM',
    propertyType: 'SERVICED_APARTMENT',
    stayType: 'MONTHLY',
    residentialSegment: 'LONG_STAY',
    residentialSegments: ['LONG_STAY', 'BUSINESS', 'FAMILY'],
    city: 'Dubai',
    country: 'United Arab Emirates',
    addressArea: 'DIFC / Downtown',
    bedrooms: 3,
    bathrooms: 3,
    maxGuests: 6,
    officialUrl: 'https://www.discoverasr.com',
    logoEmoji: '🏨',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
    tagline: 'أكبر مشغل عالمي للشقق الفندقية الفاخرة والمجمعات السكنية',
    description: 'شقق سكنية مصممة للإقامات الشهرية والعائلات مع خدمات ضيافة متكاملة.',
    directBenefits: [
      'برنامج مكافآت ASR مع خصم فوري 10%',
      'عقود إيجار شهرية وسنوية مرنة بدون رسوم مفاجئة',
      'مرافق ترفيهية متكاملة للأطفال ومساحات عمل مشتركة',
    ],
    amenities: ['Full Kitchen', 'High-Speed WiFi', 'Gym', 'Children Play Area', 'Meeting Rooms'],
    isActive: true,
    dataSource: 'OFFICIAL_PROVIDER_REGISTRY',
    verified: true,
    confidence: 0.98,
  },
  {
    id: 'fraser_suites',
    name: 'فريزر سويتس الفندقية (Fraser Suites)',
    nameEn: 'Fraser Suites',
    serviceLevel: 'PREMIUM',
    propertyType: 'APARTHOTEL',
    stayType: 'SHORT_STAY',
    residentialSegment: 'FAMILY_FRIENDLY',
    residentialSegments: ['FAMILY_FRIENDLY', 'CITY_CENTER', 'BUSINESS'],
    city: 'Riyadh',
    country: 'Saudi Arabia',
    addressArea: 'Olaya District',
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    officialUrl: 'https://www.frasershospitality.com',
    logoEmoji: '🌟',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
    tagline: 'شقق فندقية عائلية فخمة في قلب العاصمة والمراكز الحيوية',
    description: 'إطلالات بانورامية على المدينة ومطابخ مجهزة بالكامل ومسابح عائلية.',
    directBenefits: [
      'تأكيد حجز رسمي فوري وإلغاء مرن',
      'خدمات غسيل وتنظيف دورية متقدمة',
      'إفطار بوفيه ومرافق صحية متكاملة',
    ],
    amenities: ['Kitchenette', 'Swimming Pool', 'Spa', 'Family Rooms', 'Free Parking'],
    isActive: true,
    dataSource: 'OFFICIAL_PROVIDER_REGISTRY',
    verified: true,
    confidence: 0.96,
  },
  {
    id: 'cheval_residences_luxury',
    name: 'شيفال ريزيدنس الفاخرة (Cheval Residences)',
    nameEn: 'Cheval Collection Penthouse & Residences',
    serviceLevel: 'LUXURY',
    propertyType: 'PENTHOUSE',
    stayType: 'SHORT_STAY',
    residentialSegment: 'LUXURY',
    residentialSegments: ['LUXURY', 'CITY_CENTER', 'COUPLES'],
    city: 'London',
    country: 'United Kingdom',
    addressArea: 'Kensington & Chelsea',
    bedrooms: 3,
    bathrooms: 3,
    maxGuests: 6,
    officialUrl: 'https://www.chevalcollection.com',
    logoEmoji: '👑',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
    tagline: 'بنتهاوس وأجنحة سكنية فاخرة جداً مع كونسيرج خاص 24/7',
    description: 'أرقى تجربة سكنية فاخرة في لندن ودبي مع إطلالات خلابة وتجهيزات حصرية.',
    directBenefits: [
      'خدمة كونسيرج شخصي واستقبال خاص',
      'بنتهاوس بتراس واسع وإطلالات غير محجوبة',
      'أعلى معايير الخصوصية والأمان',
    ],
    amenities: ['Private Terrace', 'Concierge 24/7', 'Designer Kitchen', 'Butler Service'],
    isActive: true,
    dataSource: 'OFFICIAL_PROVIDER_REGISTRY',
    verified: true,
    confidence: 0.95,
  },
  {
    id: 'citadines_apart_hotel',
    name: 'سيتادينز للشقق الفندقية (Citadines Apart\'hotel)',
    nameEn: 'Citadines Apart\'hotel',
    serviceLevel: 'STANDARD',
    propertyType: 'APARTHOTEL',
    stayType: 'SHORT_STAY',
    residentialSegment: 'CITY_CENTER',
    residentialSegments: ['CITY_CENTER', 'WORKATION', 'BUDGET'],
    city: 'Paris',
    country: 'France',
    addressArea: 'Bastille / Louvre',
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    officialUrl: 'https://www.discoverasr.com/citadines',
    logoEmoji: '🛎️',
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
    tagline: 'شقق فندقية مريحة وموثوقة في قلب أشهر العواصم العالمية',
    description: 'شقق واستوديوهات عملية توفر الراحة والاستقلالية بأسعار متوازنة.',
    directBenefits: [
      'مواقع مركزية قريبة من محطات المترو والمعالم',
      'مطبخ مجهز وواي فاي فائق السرعة',
      'استقبال مرن وتسجيل وصول ذاتي',
    ],
    amenities: ['Kitchenette', 'High-Speed WiFi', '24h Reception', 'Pet Friendly'],
    isActive: true,
    dataSource: 'OFFICIAL_PROVIDER_REGISTRY',
    verified: true,
    confidence: 0.94,
  },
  {
    id: 'blueground_furnished_flats',
    name: 'بلوجراوند للشقق المفروشة (Blueground)',
    nameEn: 'Blueground Furnished Apartments',
    serviceLevel: 'PREMIUM',
    propertyType: 'APARTMENT',
    stayType: 'MONTHLY',
    residentialSegment: 'WORKATION',
    residentialSegments: ['WORKATION', 'LONG_STAY', 'BUSINESS'],
    city: 'Dubai',
    country: 'United Arab Emirates',
    addressArea: 'Dubai Marina & Downtown',
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    officialUrl: 'https://www.theblueground.com',
    logoEmoji: '🛋️',
    imageUrl: 'https://images.unsplash.com/photo-1502005229762-ee152da915ba?auto=format&fit=crop&w=600&q=80',
    tagline: 'شقق سكنية مفروشة ومجهزة بالكامل مصممة للعمل والإقامات الشهرية',
    description: 'أثاث راقٍ ومساحات عمل مهيأة وخدمات دعم رقمي وتطبيق جوال للمستأجرين.',
    directBenefits: [
      'عقود شهرية ميسرة بدون الحاجة لوكلاء عقاريين',
      'تجهيز كامل بالأثاث والأجهزة الذكية',
      'دعم وصيانة مستمرة عبر تطبيق Blueground',
    ],
    amenities: ['Dedicated Workspace', 'Smart TV', 'Full Kitchen', 'Pool & Gym'],
    isActive: true,
    dataSource: 'OFFICIAL_PROVIDER_REGISTRY',
    verified: true,
    confidence: 0.92,
  },
];

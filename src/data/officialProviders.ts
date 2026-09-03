export type ProviderCategory = 'airlines' | 'hotels' | 'services';

export type AirlineSubcategory = 'PREMIUM' | 'STANDARD' | 'BUDGET';
export type HotelSubcategory = 'LUXURY' | 'PREMIUM' | 'STANDARD' | 'BUDGET' | 'HOSTEL' | 'BOUTIQUE';
export type ServiceSubcategory = 
  | 'insurance'
  | 'esim'
  | 'rail'
  | 'transfers'
  | 'vip'
  | 'lounges'
  | 'car_rental'
  | 'ferries'
  | 'luggage'
  | 'hajj_umrah'
  | 'government';

export type ProviderRegion = 'middle_east' | 'europe' | 'asia' | 'americas' | 'africa' | 'global';

export interface OfficialProvider {
  id: string;
  name: string;
  nameEn: string;
  category: ProviderCategory;
  subcategory: AirlineSubcategory | HotelSubcategory | ServiceSubcategory;
  regions: ProviderRegion[];
  countryCode?: string;
  countryName?: string;
  countryNameEn?: string;
  iconType: 'plane' | 'hotel' | 'shield' | 'wifi' | 'train' | 'car' | 'crown' | 'armchair' | 'ship' | 'briefcase' | 'landmark' | 'building' | 'globe';
  officialWebsite: string;
  shortDescription: string;
  shortDescriptionEn: string;
  tags: string[];
  metadata?: {
    tierBadge?: string;
    verifiedDirectBooking?: boolean;
    loyaltyProgram?: string;
    allianceOrNetwork?: string;
  };
}

export const PROVIDER_CATEGORIES: { id: ProviderCategory; labelAr: string; labelEn: string; icon: string }[] = [
  { id: 'airlines', labelAr: 'شركات الطيران', labelEn: 'Airlines', icon: 'plane' },
  { id: 'hotels', labelAr: 'الفنادق والإقامة', labelEn: 'Hotels & Lodging', icon: 'hotel' },
  { id: 'services', labelAr: 'خدمات السفر الإضافية', labelEn: 'Travel Services', icon: 'briefcase' },
];

export const PROVIDER_REGIONS: { id: ProviderRegion; labelAr: string; labelEn: string; icon: string }[] = [
  { id: 'global', labelAr: 'عالمي', labelEn: 'Global', icon: 'globe' },
  { id: 'middle_east', labelAr: 'الشرق الأوسط والخليج', labelEn: 'Middle East & Gulf', icon: 'landmark' },
  { id: 'europe', labelAr: 'أوروبا', labelEn: 'Europe', icon: 'building' },
  { id: 'asia', labelAr: 'آسيا والمحيط الهادئ', labelEn: 'Asia Pacific', icon: 'globe' },
  { id: 'americas', labelAr: 'الأمريكتان', labelEn: 'Americas', icon: 'building' },
  { id: 'africa', labelAr: 'أفريقيا', labelEn: 'Africa', icon: 'globe' },
];

export const AIRLINE_SUBCATEGORIES: { id: AirlineSubcategory; labelAr: string; labelEn: string; descAr: string; descEn: string }[] = [
  { id: 'PREMIUM', labelAr: 'ممتاز / متكامل الخدمات (Flagship)', labelEn: 'Premium / Full-Service', descAr: 'طيران متكامل الخدمات ودرجات أولى ورجال أعمال فاخرة', descEn: 'Flagship legacy carriers with full services and premium cabins' },
  { id: 'STANDARD', labelAr: 'متوسط / ناقل وطني وإقليمي', labelEn: 'Standard / Regional', descAr: 'خطوط طيران وطنية وإقليمية تقليدية وشبكة رحلات واسعة', descEn: 'Regional & standard national carriers connecting key routes' },
  { id: 'BUDGET', labelAr: 'اقتصادي / منخفض التكلفة (Low-Cost)', labelEn: 'Budget / Low-Cost', descAr: 'طيران اقتصادي يوفر خيارات سفر مرنة وتكلفة أقل', descEn: 'Point-to-point low-cost airlines offering essential travel' },
];

export const HOTEL_SUBCATEGORIES: { id: HotelSubcategory; labelAr: string; labelEn: string; descAr: string; descEn: string }[] = [
  { id: 'LUXURY', labelAr: 'فنادق فاخرة (5 نجوم & Resorts)', labelEn: 'Luxury & Ultra-Luxury', descAr: 'منتجعات وفنادق عالمية فاخرة وخدمات استثنائية', descEn: 'Ultra-luxury 5-star properties, fine dining and bespoke concierge' },
  { id: 'PREMIUM', labelAr: 'فنادق راقية (4-5 نجوم)', labelEn: 'Premium & Upscale', descAr: 'فنادق أعمال وسياحة راقية متكاملة المرافق', descEn: 'Upscale 4-5 star hotels with comprehensive amenities' },
  { id: 'STANDARD', labelAr: 'فنادق متوسطة (3-4 نجوم)', labelEn: 'Standard & Midscale', descAr: 'إقامة مريحة وعملية بجودة موثوقة وموقع حيوي', descEn: 'Reliable midscale hotels balancing comfort and value' },
  { id: 'BUDGET', labelAr: 'فنادق اقتصادية (1-3 نجوم)', labelEn: 'Budget & Economy', descAr: 'غرف نظيفة وعملية بأسعار اقتصادية مباشرة', descEn: 'Essential amenities with clean rooms at accessible rates' },
  { id: 'HOSTEL', labelAr: 'هوستلز ونزل شبابية (Hostels)', labelEn: 'Hostels & Co-living', descAr: 'إقامة مشتركة وخاصة مناسبة للرحالة والشباب', descEn: 'Social stays, private rooms and dorms for modern travelers' },
  { id: 'BOUTIQUE', labelAr: 'فنادق بوتيك وتجربة مميزة (Boutique)', labelEn: 'Boutique & Lifestyle', descAr: 'فنادق ذات طابع فني وتراثي وتصميم فريد', descEn: 'Design-led boutique hotels with authentic local character' },
];

export const SERVICE_SUBCATEGORIES: { id: ServiceSubcategory; labelAr: string; labelEn: string; icon: string }[] = [
  { id: 'insurance', labelAr: 'تأمين السفر والطبي', labelEn: 'Travel Insurance', icon: 'shield' },
  { id: 'esim', labelAr: 'شرائح الإنترنت (eSIM)', labelEn: 'Travel eSIM', icon: 'wifi' },
  { id: 'rail', labelAr: 'القطارات فائقة السرعة', labelEn: 'High-Speed Rail', icon: 'train' },
  { id: 'transfers', labelAr: 'توصيل المطار والمواصلات', labelEn: 'Airport Transfers', icon: 'car' },
  { id: 'vip', labelAr: 'خدمات VIP والليموزين', labelEn: 'VIP & Chauffeur', icon: 'crown' },
  { id: 'lounges', labelAr: 'صالات المطارات', labelEn: 'Airport Lounges', icon: 'armchair' },
  { id: 'car_rental', labelAr: 'تأجير السيارات', labelEn: 'Car Rental', icon: 'car' },
  { id: 'ferries', labelAr: 'العبارات البحرية', labelEn: 'Ferries & Maritime', icon: 'ship' },
  { id: 'luggage', labelAr: 'حفظ وشحن الأمتعة', labelEn: 'Luggage Storage', icon: 'briefcase' },
  { id: 'hajj_umrah', labelAr: 'خدمات الحج والعمرة الرسمية', labelEn: 'Hajj & Umrah Portals', icon: 'landmark' },
  { id: 'government', labelAr: 'البوابات والتأشيرات الرسمية', labelEn: 'Official Government Portals', icon: 'globe' },
];

export const OFFICIAL_PROVIDERS_DATABASE: OfficialProvider[] = [
  // =========================================================================
  // AIRLINES - 1. PREMIUM (ممتاز / متكامل الخدمات)
  // =========================================================================
  {
    id: 'airline-saudia',
    name: 'الخطوط السعودية',
    nameEn: 'Saudia Airlines',
    category: 'airlines',
    subcategory: 'PREMIUM',
    regions: ['middle_east', 'global'],
    countryCode: 'SA',
    countryName: 'المملكة العربية السعودية',
    countryNameEn: 'Saudi Arabia',
    iconType: 'plane',
    officialWebsite: 'https://www.saudia.com',
    shortDescription: 'الناقل الوطني للمملكة العربية السعودية، يقدم رحلات مباشرة محلية ودولية متكاملة الخدمات.',
    shortDescriptionEn: 'The flag carrier of Saudi Arabia, offering full-service domestic and international flights.',
    tags: ['الناقل الوطني', 'رحلات داخلية', 'رحلات دولية', 'السعودية', 'سكاي تيم', 'SkyTeam', 'Jeddah', 'Riyadh'],
    metadata: { tierBadge: 'ناقل وطني ممتاز', verifiedDirectBooking: true, loyaltyProgram: 'Alfursan', allianceOrNetwork: 'SkyTeam' }
  },
  {
    id: 'airline-emirates',
    name: 'طيران الإمارات',
    nameEn: 'Emirates',
    category: 'airlines',
    subcategory: 'PREMIUM',
    regions: ['middle_east', 'global'],
    countryCode: 'AE',
    countryName: 'الإمارات العربية المتحدة',
    countryNameEn: 'United Arab Emirates',
    iconType: 'plane',
    officialWebsite: 'https://www.emirates.com',
    shortDescription: 'شركة طيران دولية مقرها دبي، تشغل أسطولاً عريض البدن إلى أكثر من 150 وجهة حول العالم.',
    shortDescriptionEn: 'Dubai-based international carrier operating wide-body aircraft to over 150 global destinations.',
    tags: ['دبي', 'الإمارات', 'رحلات دولية', 'A380', 'Dubai', 'Emirates'],
    metadata: { tierBadge: 'طيران دولي ممتاز', verifiedDirectBooking: true, loyaltyProgram: 'Emirates Skywards' }
  },
  {
    id: 'airline-qatar',
    name: 'الخطوط الجوية القطرية',
    nameEn: 'Qatar Airways',
    category: 'airlines',
    subcategory: 'PREMIUM',
    regions: ['middle_east', 'global'],
    countryCode: 'QA',
    countryName: 'قطر',
    countryNameEn: 'Qatar',
    iconType: 'plane',
    officialWebsite: 'https://www.qatarairways.com',
    shortDescription: 'الناقل الوطني لدولة قطر مع مركز عمليات في الدوحة وشبكة رحلات تغطي القارات الست.',
    shortDescriptionEn: 'National carrier of Qatar operating from Doha with a global network covering six continents.',
    tags: ['الدوحة', 'قطر', 'oneworld', 'Doha', 'Qatar'],
    metadata: { tierBadge: 'ناقل وطني ممتاز', verifiedDirectBooking: true, loyaltyProgram: 'Privilege Club', allianceOrNetwork: 'oneworld' }
  },
  {
    id: 'airline-etihad',
    name: 'الاتحاد للطيران',
    nameEn: 'Etihad Airways',
    category: 'airlines',
    subcategory: 'PREMIUM',
    regions: ['middle_east', 'global'],
    countryCode: 'AE',
    countryName: 'الإمارات العربية المتحدة',
    countryNameEn: 'United Arab Emirates',
    iconType: 'plane',
    officialWebsite: 'https://www.etihad.com',
    shortDescription: 'الناقل الوطني لإمارة أبوظبي بدولة الإمارات العربية المتحدة، يسير رحلات لآسيا وأوروبا وأمريكا.',
    shortDescriptionEn: 'National airline of Abu Dhabi, operating scheduled passenger flights globally.',
    tags: ['أبوظبي', 'الإمارات', 'Abu Dhabi', 'Etihad'],
    metadata: { tierBadge: 'ناقل وطني ممتاز', verifiedDirectBooking: true, loyaltyProgram: 'Etihad Guest' }
  },
  {
    id: 'airline-singapore',
    name: 'الخطوط الجوية السنغافورية',
    nameEn: 'Singapore Airlines',
    category: 'airlines',
    subcategory: 'PREMIUM',
    regions: ['asia', 'global'],
    countryCode: 'SG',
    countryName: 'سنغافورة',
    countryNameEn: 'Singapore',
    iconType: 'plane',
    officialWebsite: 'https://www.singaporeair.com',
    shortDescription: 'الناقل الوطني لسنغافورة وعضو تحالف ستار ألاينس، يربط آسيا ببقية قارات العالم.',
    shortDescriptionEn: 'Flag carrier of Singapore and Star Alliance member with routes spanning worldwide.',
    tags: ['سنغافورة', 'Star Alliance', 'Singapore', 'Asia'],
    metadata: { tierBadge: 'طيران عالمي ممتاز', verifiedDirectBooking: true, loyaltyProgram: 'KrisFlyer', allianceOrNetwork: 'Star Alliance' }
  },
  {
    id: 'airline-ana',
    name: 'خطوط كل اليابان الجوية (ANA)',
    nameEn: 'All Nippon Airways (ANA)',
    category: 'airlines',
    subcategory: 'PREMIUM',
    regions: ['asia', 'global'],
    countryCode: 'JP',
    countryName: 'اليابان',
    countryNameEn: 'Japan',
    iconType: 'plane',
    officialWebsite: 'https://www.ana.co.jp',
    shortDescription: 'أكبر شركة طيران في اليابان، توفر شبكة رحلات داخلية ودولية واسعة من طوكيو.',
    shortDescriptionEn: 'Largest airline in Japan, operating extensive domestic and global route networks.',
    tags: ['اليابان', 'طوكيو', 'Japan', 'Tokyo', 'Star Alliance'],
    metadata: { tierBadge: 'طيران ممتاز', verifiedDirectBooking: true, loyaltyProgram: 'ANA Mileage Club', allianceOrNetwork: 'Star Alliance' }
  },
  {
    id: 'airline-cathay',
    name: 'كاثي باسيفيك',
    nameEn: 'Cathay Pacific',
    category: 'airlines',
    subcategory: 'PREMIUM',
    regions: ['asia', 'global'],
    countryCode: 'HK',
    countryName: 'هونغ كونغ',
    countryNameEn: 'Hong Kong',
    iconType: 'plane',
    officialWebsite: 'https://www.cathaypacific.com',
    shortDescription: 'الناقل الرئيسي لهونغ كونغ، يقدم رحلات ركاب مجدولة إلى وجهات دولية عبر آسيا والمحيط الهادئ.',
    shortDescriptionEn: 'Hong Kong flag carrier connecting Asia Pacific with worldwide destinations.',
    tags: ['هونغ كونغ', 'oneworld', 'Hong Kong', 'Asia'],
    metadata: { tierBadge: 'طيران ممتاز', verifiedDirectBooking: true, loyaltyProgram: 'Cathay', allianceOrNetwork: 'oneworld' }
  },
  {
    id: 'airline-lufthansa',
    name: 'لوفتهانزا',
    nameEn: 'Lufthansa',
    category: 'airlines',
    subcategory: 'PREMIUM',
    regions: ['europe', 'global'],
    countryCode: 'DE',
    countryName: 'ألمانيا',
    countryNameEn: 'Germany',
    iconType: 'plane',
    officialWebsite: 'https://www.lufthansa.com',
    shortDescription: 'الناقل الوطني لألمانيا وأكبر مجموعة طيران أوروبية، مع محاور رئيسية في فرانكفورت وميونيخ.',
    shortDescriptionEn: 'German flag carrier operating major European hubs at Frankfurt and Munich.',
    tags: ['ألمانيا', 'أوروبا', 'Germany', 'Frankfurt', 'Munich', 'Star Alliance'],
    metadata: { tierBadge: 'ناقل وطني ممتاز', verifiedDirectBooking: true, loyaltyProgram: 'Miles & More', allianceOrNetwork: 'Star Alliance' }
  },
  {
    id: 'airline-british-airways',
    name: 'الخطوط الجوية البريطانية',
    nameEn: 'British Airways',
    category: 'airlines',
    subcategory: 'PREMIUM',
    regions: ['europe', 'global'],
    countryCode: 'GB',
    countryName: 'المملكة المتحدة',
    countryNameEn: 'United Kingdom',
    iconType: 'plane',
    officialWebsite: 'https://www.britishairways.com',
    shortDescription: 'الناقل الوطني للمملكة المتحدة مع مركز عمليات رئيسي في مطار لندن هيثرو.',
    shortDescriptionEn: 'Flag carrier of the UK operating a global network centered at London Heathrow.',
    tags: ['بريطانيا', 'لندن', 'UK', 'London', 'Heathrow', 'oneworld'],
    metadata: { tierBadge: 'ناقل وطني ممتاز', verifiedDirectBooking: true, loyaltyProgram: 'Executive Club', allianceOrNetwork: 'oneworld' }
  },
  {
    id: 'airline-airfrance',
    name: 'الخطوط الجوية الفرنسية',
    nameEn: 'Air France',
    category: 'airlines',
    subcategory: 'PREMIUM',
    regions: ['europe', 'global'],
    countryCode: 'FR',
    countryName: 'فرنسا',
    countryNameEn: 'France',
    iconType: 'plane',
    officialWebsite: 'https://www.airfrance.com',
    shortDescription: 'الناقل الوطني لفرنسا، يعمل من مطار باريس شارل ديغول مع خدمات ركاب متكاملة.',
    shortDescriptionEn: 'French flag carrier operating worldwide from Paris Charles de Gaulle Airport.',
    tags: ['فرنسا', 'باريس', 'France', 'Paris', 'SkyTeam'],
    metadata: { tierBadge: 'ناقل وطني ممتاز', verifiedDirectBooking: true, loyaltyProgram: 'Flying Blue', allianceOrNetwork: 'SkyTeam' }
  },
  {
    id: 'airline-turkish',
    name: 'الخطوط الجوية التركية',
    nameEn: 'Turkish Airlines',
    category: 'airlines',
    subcategory: 'PREMIUM',
    regions: ['europe', 'middle_east', 'asia', 'global'],
    countryCode: 'TR',
    countryName: 'تركيا',
    countryNameEn: 'Turkey',
    iconType: 'plane',
    officialWebsite: 'https://www.turkishairlines.com',
    shortDescription: 'الناقل الوطني لتركيا، يخدم أكبر عدد من الوجهات والبلدان الدولية في العالم من إسطنبول.',
    shortDescriptionEn: 'Turkish flag carrier flying to more countries than any other airline from Istanbul.',
    tags: ['تركيا', 'إسطنبول', 'Turkey', 'Istanbul', 'Star Alliance'],
    metadata: { tierBadge: 'طيران دولي ممتاز', verifiedDirectBooking: true, loyaltyProgram: 'Miles&Smiles', allianceOrNetwork: 'Star Alliance' }
  },
  {
    id: 'airline-delta',
    name: 'خطوط دلتا الجوية',
    nameEn: 'Delta Air Lines',
    category: 'airlines',
    subcategory: 'PREMIUM',
    regions: ['americas', 'global'],
    countryCode: 'US',
    countryName: 'الولايات المتحدة الأمريكية',
    countryNameEn: 'United States',
    iconType: 'plane',
    officialWebsite: 'https://www.delta.com',
    shortDescription: 'إحدى كبرى شركات الطيران الأمريكية والعالمية، تشغل شبكة واسعة عبر الأمريكتين والعالم.',
    shortDescriptionEn: 'Major US network airline operating domestic and international routes.',
    tags: ['أمريكا', 'USA', 'Atlanta', 'New York', 'SkyTeam'],
    metadata: { tierBadge: 'طيران أمريكي رئيسي', verifiedDirectBooking: true, loyaltyProgram: 'SkyMiles', allianceOrNetwork: 'SkyTeam' }
  },

  // =========================================================================
  // AIRLINES - 2. STANDARD (متوسط / ناقل وطني وإقليمي)
  // =========================================================================
  {
    id: 'airline-egyptair',
    name: 'مصر للطيران',
    nameEn: 'EGYPTAIR',
    category: 'airlines',
    subcategory: 'STANDARD',
    regions: ['middle_east', 'africa', 'global'],
    countryCode: 'EG',
    countryName: 'مصر',
    countryNameEn: 'Egypt',
    iconType: 'plane',
    officialWebsite: 'https://www.egyptair.com',
    shortDescription: 'الناقل الوطني لجمهورية مصر العربية، يربط القاهرة بمدن الشرق الأوسط وأفريقيا وأوروبا.',
    shortDescriptionEn: 'National airline of Egypt operating regional and international flights from Cairo.',
    tags: ['مصر', 'القاهرة', 'Egypt', 'Cairo', 'Star Alliance'],
    metadata: { tierBadge: 'ناقل وطني إقليمي', verifiedDirectBooking: true, loyaltyProgram: 'EGYPTAIR Plus', allianceOrNetwork: 'Star Alliance' }
  },
  {
    id: 'airline-royal-jordanian',
    name: 'الملكية الأردنية',
    nameEn: 'Royal Jordanian',
    category: 'airlines',
    subcategory: 'STANDARD',
    regions: ['middle_east', 'global'],
    countryCode: 'JO',
    countryName: 'الأردن',
    countryNameEn: 'Jordan',
    iconType: 'plane',
    officialWebsite: 'https://www.rj.com',
    shortDescription: 'الناقل الوطني للمملكة الأردنية الهاشمية، يربط عمّان بشبكة إقليمية ودولية.',
    shortDescriptionEn: 'Flag carrier of Jordan based in Amman with regional and long-haul connections.',
    tags: ['الأردن', 'عمان', 'Jordan', 'Amman', 'oneworld'],
    metadata: { tierBadge: 'ناقل وطني', verifiedDirectBooking: true, loyaltyProgram: 'Royal Club', allianceOrNetwork: 'oneworld' }
  },
  {
    id: 'airline-gulf-air',
    name: 'طيران الخليج',
    nameEn: 'Gulf Air',
    category: 'airlines',
    subcategory: 'STANDARD',
    regions: ['middle_east', 'global'],
    countryCode: 'BH',
    countryName: 'البحرين',
    countryNameEn: 'Bahrain',
    iconType: 'plane',
    officialWebsite: 'https://www.gulfair.com',
    shortDescription: 'الناقل الوطني لمملكة البحرين، يقدم رحلات مجدولة إلى وجهات الشرق الأوسط وآسيا وأوروبا.',
    shortDescriptionEn: 'National carrier of the Kingdom of Bahrain operating across the Middle East, Asia, and Europe.',
    tags: ['البحرين', 'المنامة', 'Bahrain', 'Manama'],
    metadata: { tierBadge: 'ناقل وطني', verifiedDirectBooking: true, loyaltyProgram: 'Falconflyer' }
  },
  {
    id: 'airline-oman-air',
    name: 'الطيران العماني',
    nameEn: 'Oman Air',
    category: 'airlines',
    subcategory: 'STANDARD',
    regions: ['middle_east', 'global'],
    countryCode: 'OM',
    countryName: 'سلطنة عمان',
    countryNameEn: 'Oman',
    iconType: 'plane',
    officialWebsite: 'https://www.omanair.com',
    shortDescription: 'الناقل الوطني لسلطنة عمان ومقره في مسقط، يوفر خدمات طيران دولية ومحلية.',
    shortDescriptionEn: 'Flag carrier of Oman operating scheduled passenger services from Muscat.',
    tags: ['عمان', 'مسقط', 'Oman', 'Muscat'],
    metadata: { tierBadge: 'ناقل وطني', verifiedDirectBooking: true, loyaltyProgram: 'Sindbad' }
  },
  {
    id: 'airline-mea',
    name: 'طيران الشرق الأوسط (MEA)',
    nameEn: 'Middle East Airlines',
    category: 'airlines',
    subcategory: 'STANDARD',
    regions: ['middle_east', 'europe'],
    countryCode: 'LB',
    countryName: 'لبنان',
    countryNameEn: 'Lebanon',
    iconType: 'plane',
    officialWebsite: 'https://www.mea.com.lb',
    shortDescription: 'الناقل الوطني للبنان ومقره بيروت، يربط لبنان بالشرق الأوسط والخليج وأوروبا.',
    shortDescriptionEn: 'National airline of Lebanon operating from Beirut across the Middle East and Europe.',
    tags: ['لبنان', 'بيروت', 'Lebanon', 'Beirut', 'SkyTeam'],
    metadata: { tierBadge: 'ناقل وطني', verifiedDirectBooking: true, loyaltyProgram: 'Cedar Miles', allianceOrNetwork: 'SkyTeam' }
  },
  {
    id: 'airline-royal-air-maroc',
    name: 'الخطوط الملكية المغربية',
    nameEn: 'Royal Air Maroc',
    category: 'airlines',
    subcategory: 'STANDARD',
    regions: ['africa', 'europe', 'middle_east', 'global'],
    countryCode: 'MA',
    countryName: 'المغرب',
    countryNameEn: 'Morocco',
    iconType: 'plane',
    officialWebsite: 'https://www.royalairmaroc.com',
    shortDescription: 'الناقل الوطني للمملكة المغربية ومقره في الدار البيضاء، يربط أفريقيا بأوروبا والأمريكتين.',
    shortDescriptionEn: 'National airline of Morocco linking Africa, Europe, and the Americas through Casablanca.',
    tags: ['المغرب', 'الدار البيضاء', 'Morocco', 'Casablanca', 'oneworld'],
    metadata: { tierBadge: 'ناقل وطني', verifiedDirectBooking: true, loyaltyProgram: 'Safar Flyer', allianceOrNetwork: 'oneworld' }
  },
  {
    id: 'airline-tap-portugal',
    name: 'طيران تاب البرتغال',
    nameEn: 'TAP Air Portugal',
    category: 'airlines',
    subcategory: 'STANDARD',
    regions: ['europe', 'americas', 'global'],
    countryCode: 'PT',
    countryName: 'البرتغال',
    countryNameEn: 'Portugal',
    iconType: 'plane',
    officialWebsite: 'https://www.flytap.com',
    shortDescription: 'الناقل الوطني للبرتغال، يربط لشبونة بدول أوروبا وأمريكا الجنوبية وأفريقيا.',
    shortDescriptionEn: 'Flag carrier of Portugal connecting Lisbon with Europe, South America, and Africa.',
    tags: ['البرتغال', 'لشبونة', 'Portugal', 'Lisbon', 'Star Alliance'],
    metadata: { tierBadge: 'ناقل وطني أوروبي', verifiedDirectBooking: true, loyaltyProgram: 'Miles&Go', allianceOrNetwork: 'Star Alliance' }
  },
  {
    id: 'airline-ethiopian',
    name: 'الخطوط الجوية الإثيوبية',
    nameEn: 'Ethiopian Airlines',
    category: 'airlines',
    subcategory: 'STANDARD',
    regions: ['africa', 'global'],
    countryCode: 'ET',
    countryName: 'إثيوبيا',
    countryNameEn: 'Ethiopia',
    iconType: 'plane',
    officialWebsite: 'https://www.ethiopianairlines.com',
    shortDescription: 'أكبر شركة طيران في قارة أفريقيا، تشغل شبكة نقل محورية من أديس أبابا إلى مختلف القارات.',
    shortDescriptionEn: 'Largest airline in Africa with an extensive global hub based in Addis Ababa.',
    tags: ['أفريقيا', 'إثيوبيا', 'Africa', 'Ethiopia', 'Star Alliance'],
    metadata: { tierBadge: 'ناقل أفريقي رئيسي', verifiedDirectBooking: true, loyaltyProgram: 'ShebaMiles', allianceOrNetwork: 'Star Alliance' }
  },

  // =========================================================================
  // AIRLINES - 3. BUDGET (اقتصادي / منخفض التكلفة / محلي)
  // =========================================================================
  {
    id: 'airline-flynas',
    name: 'طيران ناس',
    nameEn: 'flynas',
    category: 'airlines',
    subcategory: 'BUDGET',
    regions: ['middle_east', 'global'],
    countryCode: 'SA',
    countryName: 'المملكة العربية السعودية',
    countryNameEn: 'Saudi Arabia',
    iconType: 'plane',
    officialWebsite: 'https://www.flynas.com',
    shortDescription: 'شركة الطيران الاقتصادي الأولى في المملكة العربية السعودية، تشغل رحلات محلية وإقليمية ودولية.',
    shortDescriptionEn: 'Leading Saudi low-cost carrier operating domestic, regional, and international routes.',
    tags: ['طيران اقتصادي', 'السعودية', 'رحلات داخلية', 'flynas', 'Saudi Low Cost'],
    metadata: { tierBadge: 'طيران اقتصادي رائد', verifiedDirectBooking: true, loyaltyProgram: 'nasmiles' }
  },
  {
    id: 'airline-flyadeal',
    name: 'طيران أديل',
    nameEn: 'flyadeal',
    category: 'airlines',
    subcategory: 'BUDGET',
    regions: ['middle_east'],
    countryCode: 'SA',
    countryName: 'المملكة العربية السعودية',
    countryNameEn: 'Saudi Arabia',
    iconType: 'plane',
    officialWebsite: 'https://www.flyadeal.com',
    shortDescription: 'ذراع الطيران الاقتصادي التابع للمؤسسة العامة للخطوط السعودية، مخصص للرحلات الاقتصادية المباشرة.',
    shortDescriptionEn: 'Low-cost subsidiary of Saudia Group operating point-to-point domestic and regional flights.',
    tags: ['طيران اقتصادي', 'السعودية', 'رحلات داخلية', 'flyadeal'],
    metadata: { tierBadge: 'طيران اقتصادي محلي', verifiedDirectBooking: true }
  },
  {
    id: 'airline-air-arabia',
    name: 'العربية للطيران',
    nameEn: 'Air Arabia',
    category: 'airlines',
    subcategory: 'BUDGET',
    regions: ['middle_east', 'africa', 'asia'],
    countryCode: 'AE',
    countryName: 'الإمارات العربية المتحدة',
    countryNameEn: 'United Arab Emirates',
    iconType: 'plane',
    officialWebsite: 'https://www.airarabia.com',
    shortDescription: 'أول شركة طيران اقتصادي في منطقة الشرق الأوسط وشمال أفريقيا، بمراكز في الشارقة وأبوظبي ومصر والمغرب.',
    shortDescriptionEn: 'Pioneering Middle East low-cost carrier based in Sharjah with regional hubs.',
    tags: ['طيران اقتصادي', 'الشارقة', 'الإمارات', 'Air Arabia'],
    metadata: { tierBadge: 'طيران اقتصادي إقليمي', verifiedDirectBooking: true, loyaltyProgram: 'AirRewards' }
  },
  {
    id: 'airline-wizz-air',
    name: 'ويز إير',
    nameEn: 'Wizz Air',
    category: 'airlines',
    subcategory: 'BUDGET',
    regions: ['europe', 'middle_east'],
    countryCode: 'HU',
    countryName: 'المجر / أوروبا',
    countryNameEn: 'Hungary / Europe',
    iconType: 'plane',
    officialWebsite: 'https://www.wizzair.com',
    shortDescription: 'شركة طيران اقتصادي أوروبية تشغل رحلات منخفضة التكلفة عبر أوروبا والشرق الأوسط والخليج.',
    shortDescriptionEn: 'European ultra-low-cost airline serving destinations across Europe and the Middle East.',
    tags: ['طيران اقتصادي', 'أوروبا', 'الخليج', 'Wizz Air', 'Europe Budget'],
    metadata: { tierBadge: 'طيران اقتصادي فائق', verifiedDirectBooking: true, loyaltyProgram: 'WIZZ Discount Club' }
  },
  {
    id: 'airline-ryanair',
    name: 'رايان إير',
    nameEn: 'Ryanair',
    category: 'airlines',
    subcategory: 'BUDGET',
    regions: ['europe'],
    countryCode: 'IE',
    countryName: 'أيرلندا / أوروبا',
    countryNameEn: 'Ireland / Europe',
    iconType: 'plane',
    officialWebsite: 'https://www.ryanair.com',
    shortDescription: 'أكبر شركة طيران اقتصادي في أوروبا من حيث عدد الركاب وشبكة الرحلات المباشرة بين المدن الأوروبية.',
    shortDescriptionEn: 'Largest European low-cost airline group with extensive point-to-point European routes.',
    tags: ['طيران اقتصادي', 'أوروبا', 'Ryanair', 'Budget Europe'],
    metadata: { tierBadge: 'طيران اقتصادي أوروبي', verifiedDirectBooking: true }
  },
  {
    id: 'airline-easyjet',
    name: 'إيزي جيت',
    nameEn: 'easyJet',
    category: 'airlines',
    subcategory: 'BUDGET',
    regions: ['europe'],
    countryCode: 'GB',
    countryName: 'المملكة المتحدة / أوروبا',
    countryNameEn: 'United Kingdom / Europe',
    iconType: 'plane',
    officialWebsite: 'https://www.easyjet.com',
    shortDescription: 'شركة طيران اقتصادي بريطانية أوروبية تشغل رحلات بين المطارات الرئيسية في مختلف الدول الأوروبية.',
    shortDescriptionEn: 'British low-cost carrier operating domestic and international routes across Europe.',
    tags: ['طيران اقتصادي', 'بريطانيا', 'أوروبا', 'easyJet'],
    metadata: { tierBadge: 'طيران اقتصادي أوروبي', verifiedDirectBooking: true }
  },
  {
    id: 'airline-pegasus',
    name: 'طيران بيجاسوس',
    nameEn: 'Pegasus Airlines',
    category: 'airlines',
    subcategory: 'BUDGET',
    regions: ['europe', 'middle_east'],
    countryCode: 'TR',
    countryName: 'تركيا',
    countryNameEn: 'Turkey',
    iconType: 'plane',
    officialWebsite: 'https://www.flypgs.com',
    shortDescription: 'شركة طيران اقتصادي تركية مقرها إسطنبول (مطار صبيحة كوكجن)، تربط تركيا بأوروبا والشرق الأوسط.',
    shortDescriptionEn: 'Turkish low-cost airline connecting Istanbul Sabiha Gökçen to European and Middle Eastern destinations.',
    tags: ['تركيا', 'طيران اقتصادي', 'إسطنبول', 'Pegasus', 'Flypgs'],
    metadata: { tierBadge: 'طيران اقتصادي إقليمي', verifiedDirectBooking: true, loyaltyProgram: 'BolBol' }
  },
  {
    id: 'airline-airasia',
    name: 'إير آسيا',
    nameEn: 'AirAsia',
    category: 'airlines',
    subcategory: 'BUDGET',
    regions: ['asia'],
    countryCode: 'MY',
    countryName: 'ماليزيا / جنوب شرق آسيا',
    countryNameEn: 'Malaysia / Southeast Asia',
    iconType: 'plane',
    officialWebsite: 'https://www.airasia.com',
    shortDescription: 'أكبر مجموعة طيران اقتصادي في آسيا، تغطي شبكة واسعة من الوجهات في ماليزيا وتايلاند وإندونيسيا واليابان.',
    shortDescriptionEn: 'Pioneering Southeast Asian low-cost airline group with routes across Asia.',
    tags: ['آسيا', 'ماليزيا', 'تايلاند', 'AirAsia', 'Asia Budget'],
    metadata: { tierBadge: 'طيران اقتصادي آسيوي', verifiedDirectBooking: true, loyaltyProgram: 'AirAsia Rewards' }
  },

  // =========================================================================
  // HOTELS - 1. LUXURY (فنادق فاخرة / 5 نجوم فاخرة / Resorts)
  // =========================================================================
  {
    id: 'hotel-ritz-carlton',
    name: 'فنادق الريتز-كارلتون',
    nameEn: 'The Ritz-Carlton',
    category: 'hotels',
    subcategory: 'LUXURY',
    regions: ['middle_east', 'europe', 'asia', 'americas', 'global'],
    iconType: 'hotel',
    officialWebsite: 'https://www.ritzcarlton.com',
    shortDescription: 'علامة فندقية عالمية فاخرة تابعة لماريوت، تشتهر بالخدمة الراقية والضيافة الكلاسيكية في العواصم والمنتجعات.',
    shortDescriptionEn: 'Luxury hotel brand by Marriott offering iconic hospitality in global city centers and resorts.',
    tags: ['فنادق فاخرة', 'ماريوت', 'الرياض', 'دبي', 'Ritz Carlton', 'Marriott Bonvoy'],
    metadata: { tierBadge: 'فاخر 5 نجوم', verifiedDirectBooking: true, loyaltyProgram: 'Marriott Bonvoy' }
  },
  {
    id: 'hotel-four-seasons',
    name: 'فنادق فور سيزونز',
    nameEn: 'Four Seasons Hotels and Resorts',
    category: 'hotels',
    subcategory: 'LUXURY',
    regions: ['middle_east', 'europe', 'asia', 'americas', 'global'],
    iconType: 'hotel',
    officialWebsite: 'https://www.fourseasons.com',
    shortDescription: 'سلسلة فنادق ومنتجعات دولية فاخرة تقدم إقامة راقية وخدمات مخصصة في أكثر من 47 دولة.',
    shortDescriptionEn: 'International luxury hotel company providing bespoke hospitality and world-class resorts.',
    tags: ['فنادق فاخرة', 'منتجعات', 'Four Seasons', 'Luxury Resorts'],
    metadata: { tierBadge: 'فاخر 5 نجوم', verifiedDirectBooking: true }
  },
  {
    id: 'hotel-st-regis',
    name: 'فنادق سانت ريجيس',
    nameEn: 'St. Regis Hotels & Resorts',
    category: 'hotels',
    subcategory: 'LUXURY',
    regions: ['middle_east', 'europe', 'asia', 'americas', 'global'],
    iconType: 'hotel',
    officialWebsite: 'https://st-regis.marriott.com',
    shortDescription: 'علامة ضيافة فاخرة تاريخية تشتهر بخدمة المساعد الشخصي (Butler Service) والمواقع الرمزية.',
    shortDescriptionEn: 'Historic ultra-luxury brand renowned for signature butler service and premier locations.',
    tags: ['فنادق فاخرة', 'St Regis', 'Marriott Bonvoy', 'Butler Service'],
    metadata: { tierBadge: 'فاخر 5 نجوم', verifiedDirectBooking: true, loyaltyProgram: 'Marriott Bonvoy' }
  },
  {
    id: 'hotel-aman',
    name: 'منتجعات وفنادق أمان',
    nameEn: 'Aman Resorts',
    category: 'hotels',
    subcategory: 'LUXURY',
    regions: ['middle_east', 'europe', 'asia', 'americas', 'global'],
    iconType: 'hotel',
    officialWebsite: 'https://www.aman.com',
    shortDescription: 'مجموعة منتجعات فائقة الفخامة تتميز بالخصوصية التامة والتصميم المعماري المتناغم مع الطبيعة والتراث.',
    shortDescriptionEn: 'Ultra-luxury sanctuary resorts offering exclusive seclusion and architecture worldwide.',
    tags: ['فنادق فائقة الفخامة', 'العلا', 'منتجعات خاصة', 'Aman Resorts'],
    metadata: { tierBadge: 'فائق الفخامة', verifiedDirectBooking: true }
  },
  {
    id: 'hotel-mandarin-oriental',
    name: 'مجموعة ماندرين أورينتال',
    nameEn: 'Mandarin Oriental Hotel Group',
    category: 'hotels',
    subcategory: 'LUXURY',
    regions: ['middle_east', 'europe', 'asia', 'americas', 'global'],
    iconType: 'hotel',
    officialWebsite: 'https://www.mandarinoriental.com',
    shortDescription: 'مجموعة فندقية فاخرة حائزة على جوائز تجمع بين الفخامة المعاصرة واللمسات الشرقية الأصيلة.',
    shortDescriptionEn: 'Award-winning luxury hotel operator combining contemporary luxury with oriental heritage.',
    tags: ['فنادق فاخرة', 'الرياض', 'لندن', 'طوكيو', 'Mandarin Oriental'],
    metadata: { tierBadge: 'فاخر 5 نجوم', verifiedDirectBooking: true, loyaltyProgram: 'Fans of M.O.' }
  },

  // =========================================================================
  // HOTELS - 2. PREMIUM (فنادق راقية / 4-5 نجوم)
  // =========================================================================
  {
    id: 'hotel-marriott',
    name: 'فنادق ومنتجعات ماريوت',
    nameEn: 'Marriott Hotels & Resorts',
    category: 'hotels',
    subcategory: 'PREMIUM',
    regions: ['middle_east', 'europe', 'asia', 'americas', 'global'],
    iconType: 'hotel',
    officialWebsite: 'https://marriott-hotels.marriott.com',
    shortDescription: 'العلامة الرئيسية لمجموعة ماريوت الدولية، تقدم غرفاً حديثة ومرافق اجتماعات ومطاعم متكاملة.',
    shortDescriptionEn: 'Flagship upscale brand of Marriott International providing modern rooms and premium amenities.',
    tags: ['فنادق راقية', 'ماريوت', 'Marriott', 'Marriott Bonvoy'],
    metadata: { tierBadge: 'راقي 4-5 نجوم', verifiedDirectBooking: true, loyaltyProgram: 'Marriott Bonvoy' }
  },
  {
    id: 'hotel-hilton',
    name: 'فنادق ومنتجعات هيلتون',
    nameEn: 'Hilton Hotels & Resorts',
    category: 'hotels',
    subcategory: 'PREMIUM',
    regions: ['middle_east', 'europe', 'asia', 'americas', 'global'],
    iconType: 'hotel',
    officialWebsite: 'https://www.hilton.com',
    shortDescription: 'إحدى أشهر العلامات الفندقية العالمية المتواجدة في أهم المدن والوجهات السياحية ورجال الأعمال.',
    shortDescriptionEn: 'Global upscale hospitality leader situated in key gateway cities and resort destinations.',
    tags: ['فنادق راقية', 'هيلتون', 'Hilton', 'Hilton Honors'],
    metadata: { tierBadge: 'راقي 4-5 نجوم', verifiedDirectBooking: true, loyaltyProgram: 'Hilton Honors' }
  },
  {
    id: 'hotel-hyatt-regency',
    name: 'حياة ريجنسي',
    nameEn: 'Hyatt Regency',
    category: 'hotels',
    subcategory: 'PREMIUM',
    regions: ['middle_east', 'europe', 'asia', 'americas', 'global'],
    iconType: 'hotel',
    officialWebsite: 'https://www.hyatt.com/brands/hyatt-regency',
    shortDescription: 'فنادق راقية متكاملة الخدمات مصممة للمسافرين لغرض الأعمال والترفيه العائلي مع خيارات طعام متنوعة.',
    shortDescriptionEn: 'Full-service upscale hotel brand by Hyatt tailored for business and leisure travelers.',
    tags: ['فنادق راقية', 'حياة', 'Hyatt', 'World of Hyatt'],
    metadata: { tierBadge: 'راقي 4-5 نجوم', verifiedDirectBooking: true, loyaltyProgram: 'World of Hyatt' }
  },
  {
    id: 'hotel-intercontinental',
    name: 'إنتركونتيننتال (IHG)',
    nameEn: 'InterContinental Hotels & Resorts',
    category: 'hotels',
    subcategory: 'PREMIUM',
    regions: ['middle_east', 'europe', 'asia', 'americas', 'global'],
    iconType: 'hotel',
    officialWebsite: 'https://www.ihg.com/intercontinental',
    shortDescription: 'علامة الفنادق الفاخرة الرائدة لمجموعة فنادق إنتركونتيننتال (IHG) بمواقع مركزية في كبرى العواصم.',
    shortDescriptionEn: 'Historic international luxury hotel brand operating under IHG Hotels & Resorts.',
    tags: ['فنادق راقية', 'إنتركونتيننتال', 'IHG', 'IHG One Rewards'],
    metadata: { tierBadge: 'راقي 5 نجوم', verifiedDirectBooking: true, loyaltyProgram: 'IHG One Rewards' }
  },
  {
    id: 'hotel-sofitel',
    name: 'فنادق سوفيتيل (Accor)',
    nameEn: 'Sofitel Hotels & Resorts',
    category: 'hotels',
    subcategory: 'PREMIUM',
    regions: ['middle_east', 'europe', 'asia', 'africa', 'global'],
    iconType: 'hotel',
    officialWebsite: 'https://sofitel.accor.com',
    shortDescription: 'علامة الضيافة الفرنسية الراقية التابعة لمجموعة أكور، تجمع بين الفخامة الفرنسية والثقافة المحلية.',
    shortDescriptionEn: 'French luxury and upscale brand by Accor combining French art de vivre with local culture.',
    tags: ['فنادق راقية', 'أكور', 'سوفيتيل', 'Sofitel', 'Accor ALL'],
    metadata: { tierBadge: 'راقي 5 نجوم', verifiedDirectBooking: true, loyaltyProgram: 'ALL - Accor Live Limitless' }
  },

  // =========================================================================
  // HOTELS - 3. STANDARD (فنادق متوسطة / 3-4 نجوم)
  // =========================================================================
  {
    id: 'hotel-courtyard',
    name: 'كورتيارد باي ماريوت',
    nameEn: 'Courtyard by Marriott',
    category: 'hotels',
    subcategory: 'STANDARD',
    regions: ['middle_east', 'europe', 'asia', 'americas', 'global'],
    iconType: 'hotel',
    officialWebsite: 'https://courtyard.marriott.com',
    shortDescription: 'فنادق مريحة وعملية مناسبة للعائلات والمسافرين لغرض العمل مع مساحات للعمل والاسترخاء.',
    shortDescriptionEn: 'Midscale-to-upscale hotel brand offering functional spaces for work and relaxation.',
    tags: ['فنادق متوسطة', 'ماريوت', 'Courtyard', 'Marriott Bonvoy'],
    metadata: { tierBadge: 'متوسط 3-4 نجوم', verifiedDirectBooking: true, loyaltyProgram: 'Marriott Bonvoy' }
  },
  {
    id: 'hotel-novotel',
    name: 'فنادق نوفوتيل (Accor)',
    nameEn: 'Novotel',
    category: 'hotels',
    subcategory: 'STANDARD',
    regions: ['middle_east', 'europe', 'asia', 'americas', 'africa', 'global'],
    iconType: 'hotel',
    officialWebsite: 'https://novotel.accor.com',
    shortDescription: 'فنادق متوسطة ملائمة للعائلات ورجال الأعمال توفر غرفاً فسيحة وبوفيهات إفطار ومرافق رياضية.',
    shortDescriptionEn: 'Midscale brand by Accor designed for family and business travelers with spacious rooms.',
    tags: ['فنادق عائلية', 'أكور', 'نوفوتيل', 'Novotel', 'Accor ALL'],
    metadata: { tierBadge: 'متوسط 4 نجوم', verifiedDirectBooking: true, loyaltyProgram: 'ALL - Accor Live Limitless' }
  },
  {
    id: 'hotel-holiday-inn',
    name: 'هوليداي إن (Holiday Inn)',
    nameEn: 'Holiday Inn',
    category: 'hotels',
    subcategory: 'STANDARD',
    regions: ['middle_east', 'europe', 'asia', 'americas', 'global'],
    iconType: 'hotel',
    officialWebsite: 'https://www.ihg.com/holidayinn',
    shortDescription: 'سلسلة فنادق عالمية متوسطة تقدم إقامة موثوقة ومريحة للأفراد والعائلات ومرافق طعام وراحة.',
    shortDescriptionEn: 'Trusted midscale hotel chain under IHG offering dependable comfort for leisure and business.',
    tags: ['فنادق متوسطة', 'Holiday Inn', 'IHG One Rewards'],
    metadata: { tierBadge: 'متوسط 3-4 نجوم', verifiedDirectBooking: true, loyaltyProgram: 'IHG One Rewards' }
  },
  {
    id: 'hotel-radisson-blu',
    name: 'راديسون بلو (Radisson Blu)',
    nameEn: 'Radisson Blu',
    category: 'hotels',
    subcategory: 'STANDARD',
    regions: ['middle_east', 'europe', 'asia', 'africa', 'global'],
    iconType: 'hotel',
    officialWebsite: 'https://www.radissonhotels.com/radisson-blu',
    shortDescription: 'فنادق عصرية ذات تصميم مميز وخدمات متكاملة تقع في المدن الكبرى وبالقرب من المطارات ومراكز الأعمال.',
    shortDescriptionEn: 'Upper-midscale hotel brand offering memorable guest experiences and stylish spaces.',
    tags: ['فنادق متوسطة', 'راديسون', 'Radisson Blu', 'Radisson Rewards'],
    metadata: { tierBadge: 'متوسط 4 نجوم', verifiedDirectBooking: true, loyaltyProgram: 'Radisson Rewards' }
  },

  // =========================================================================
  // HOTELS - 4. BUDGET (فنادق اقتصادية / 1-3 نجوم)
  // =========================================================================
  {
    id: 'hotel-ibis',
    name: 'فنادق إيبيس (Ibis / Ibis Styles / Budget)',
    nameEn: 'Ibis Hotels',
    category: 'hotels',
    subcategory: 'BUDGET',
    regions: ['middle_east', 'europe', 'asia', 'americas', 'africa', 'global'],
    iconType: 'hotel',
    officialWebsite: 'https://ibis.accor.com',
    shortDescription: 'أكبر شبكة فنادق اقتصادية في أوروبا والعالم، توفر غرفاً مريحة وعملية بأسعار معقولة ومواقع مركزية.',
    shortDescriptionEn: 'Leading economy brand worldwide offering well-designed essential rooms at affordable rates.',
    tags: ['فنادق اقتصادية', 'أكور', 'إيبيس', 'Ibis', 'Accor ALL'],
    metadata: { tierBadge: 'اقتصادي 2-3 نجوم', verifiedDirectBooking: true, loyaltyProgram: 'ALL - Accor Live Limitless' }
  },
  {
    id: 'hotel-premier-inn',
    name: 'بريمير إن (Premier Inn)',
    nameEn: 'Premier Inn',
    category: 'hotels',
    subcategory: 'BUDGET',
    regions: ['middle_east', 'europe'],
    iconType: 'hotel',
    officialWebsite: 'https://www.premierinn.com',
    shortDescription: 'أكبر سلسلة فنادق بريطانية اقتصادية مع فروع في الإمارات والشرق الأوسط، توفر أسرة مريحة وعزل صوتي ممتاز.',
    shortDescriptionEn: 'UK largest hotel brand with Gulf properties, renowned for comfy beds and reliable value.',
    tags: ['فنادق اقتصادية', 'بريطانيا', 'دبي', 'Premier Inn'],
    metadata: { tierBadge: 'اقتصادي 3 نجوم', verifiedDirectBooking: true }
  },
  {
    id: 'hotel-motel-one',
    name: 'موتيل ون (Motel One)',
    nameEn: 'Motel One',
    category: 'hotels',
    subcategory: 'BUDGET',
    regions: ['europe'],
    iconType: 'hotel',
    officialWebsite: 'https://www.motel-one.com',
    shortDescription: 'سلسلة فنادق اقتصادية بتصميم أنيق ومواقع مركزية في كبرى المدن الأوروبية مثل برلين وميونيخ وفيينا ولندن.',
    shortDescriptionEn: 'European design-budget hotel brand located in prime downtown locations.',
    tags: ['فنادق اقتصادية', 'أوروبا', 'ألمانيا', 'Motel One', 'Design Budget'],
    metadata: { tierBadge: 'اقتصادي بتصميم عصري', verifiedDirectBooking: true, loyaltyProgram: 'beOne' }
  },
  {
    id: 'hotel-rove',
    name: 'فنادق روف (Rove Hotels)',
    nameEn: 'Rove Hotels',
    category: 'hotels',
    subcategory: 'BUDGET',
    regions: ['middle_east'],
    countryCode: 'AE',
    iconType: 'hotel',
    officialWebsite: 'https://www.rovehotels.com',
    shortDescription: 'علامة ضيافة عصرية واقتصادية شبابية في دبي والإمارات توفر غرفاً متطورة ومساحات للعمل المشترك.',
    shortDescriptionEn: 'Contemporary lifestyle budget brand in Dubai tailored for modern explorers and digital nomads.',
    tags: ['فنادق اقتصادية', 'دبي', 'الإمارات', 'Rove Hotels'],
    metadata: { tierBadge: 'اقتصادي عصري', verifiedDirectBooking: true }
  },

  // =========================================================================
  // HOTELS - 5. HOSTEL (هوستلز ونزل شبابية)
  // =========================================================================
  {
    id: 'hotel-generator',
    name: 'جينيراتور هوستلز (Generator)',
    nameEn: 'Generator Hostels',
    category: 'hotels',
    subcategory: 'HOSTEL',
    regions: ['europe', 'americas'],
    iconType: 'building',
    officialWebsite: 'https://staygenerator.com',
    shortDescription: 'سلسلة نزل شبابية بتصميم مبتكر توفر غرفاً خاصة ومشتركة في أشهر المدن الأوروبية مثل لندن وباريس وبرلين وروما.',
    shortDescriptionEn: 'Design-led hostel and boutique hotel chain across major European and US travel hubs.',
    tags: ['هوستل', 'نزل شبابي', 'أوروبا', 'Generator Hostels'],
    metadata: { tierBadge: 'هوستل عصري', verifiedDirectBooking: true }
  },
  {
    id: 'hotel-selina',
    name: 'سيلينا (Selina Hospitality)',
    nameEn: 'Selina Hostels & Co-living',
    category: 'hotels',
    subcategory: 'HOSTEL',
    regions: ['americas', 'europe', 'asia', 'middle_east'],
    iconType: 'building',
    officialWebsite: 'https://www.selina.com',
    shortDescription: 'شبكة إقامة وسكن تشاركي متكاملة مخصصة للرحالة الرقميين والمسافرين المستقلين مع مساحات عمل جماعية وأنشطة مجتمعية.',
    shortDescriptionEn: 'Hospitality brand combining boutique stays with coworking and social community activities.',
    tags: ['هوستل', 'سكن تشاركي', 'رحالة رقميين', 'Selina'],
    metadata: { tierBadge: 'سكن تشاركي وهيكل هوستل', verifiedDirectBooking: true }
  },
  {
    id: 'hotel-wombats',
    name: 'وومباتس سيتي هوستلز (Wombat\'s)',
    nameEn: 'Wombat\'s City Hostels',
    category: 'hotels',
    subcategory: 'HOSTEL',
    regions: ['europe'],
    iconType: 'building',
    officialWebsite: 'https://www.wombats-hostels.com',
    shortDescription: 'نزل شبابية حائزة على جوائز تقع في فيينا وميونيخ وبودابست ولندن، معروفة بالنظافة والأجواء الآمنة والودودة.',
    shortDescriptionEn: 'Award-winning European hostel chain in Vienna, Munich, Budapest, and London.',
    tags: ['هوستل', 'أوروبا', 'فيينا', 'لندن', 'Wombats'],
    metadata: { tierBadge: 'هوستل أوروبي معتمد', verifiedDirectBooking: true }
  },

  // =========================================================================
  // HOTELS - 6. BOUTIQUE (فنادق بوتيك وتجربة مميزة)
  // =========================================================================
  {
    id: 'hotel-autograph-collection',
    name: 'أوتوجراف كولكشن (Autograph Collection)',
    nameEn: 'Autograph Collection Hotels',
    category: 'hotels',
    subcategory: 'BOUTIQUE',
    regions: ['middle_east', 'europe', 'asia', 'americas', 'global'],
    iconType: 'hotel',
    officialWebsite: 'https://autograph-hotels.marriott.com',
    shortDescription: 'مجموعة منتقاة من الفنادق المستقلة ذات الطابع الفريد والتصميم الفني المميز التابعة لماريوت.',
    shortDescriptionEn: 'Curated portfolio of independent boutique hotels with distinct personality and design.',
    tags: ['فنادق بوتيك', 'ماريوت', 'Autograph Collection', 'Marriott Bonvoy'],
    metadata: { tierBadge: 'بوتيك مميز', verifiedDirectBooking: true, loyaltyProgram: 'Marriott Bonvoy' }
  },
  {
    id: 'hotel-habitas-alula',
    name: 'هابيتاس العلا (Our Habitas)',
    nameEn: 'Our Habitas AlUla',
    category: 'hotels',
    subcategory: 'BOUTIQUE',
    regions: ['middle_east', 'americas', 'africa'],
    countryCode: 'SA',
    iconType: 'hotel',
    officialWebsite: 'https://www.ourhabitas.com/alula',
    shortDescription: 'منتجع بيئي فاخر في وادي عشار بالعلا يقدم تجربة ضيافة فريدة بين الجبال والتراث الطبيعي.',
    shortDescriptionEn: 'Eco-sustainable luxury boutique resort in Ashar Valley, AlUla, celebrating culture and nature.',
    tags: ['بوتيك', 'العلا', 'السعودية', 'منتجع صحراوي', 'Habitas AlUla'],
    metadata: { tierBadge: 'بوتيك بيئي فاخر', verifiedDirectBooking: true }
  },
  {
    id: 'hotel-slh',
    name: 'فنادق لكجري الصغيرة (SLH)',
    nameEn: 'Small Luxury Hotels of the World',
    category: 'hotels',
    subcategory: 'BOUTIQUE',
    regions: ['europe', 'asia', 'middle_east', 'americas', 'global'],
    iconType: 'hotel',
    officialWebsite: 'https://slh.com',
    shortDescription: 'شبكة تضم أكثر من 500 فندق بوتيك مستقل حول العالم تشتهر بالفخامة الحصرية والخدمة الشخصية.',
    shortDescriptionEn: 'Community of over 500 independently minded boutique hotels across 90+ countries.',
    tags: ['فنادق بوتيك', 'Small Luxury Hotels', 'SLH', 'Luxury Boutique'],
    metadata: { tierBadge: 'شبكة بوتيك دولية', verifiedDirectBooking: true }
  },

  // =========================================================================
  // TRAVEL SERVICES - 1. INSURANCE (تأمين السفر والطبي)
  // =========================================================================
  {
    id: 'service-allianz',
    name: 'أليانز جلوبال أسيستانس للتأمين',
    nameEn: 'Allianz Global Assistance',
    category: 'services',
    subcategory: 'insurance',
    regions: ['global', 'europe', 'middle_east', 'americas'],
    iconType: 'shield',
    officialWebsite: 'https://www.allianz-assistance.com',
    shortDescription: 'مزود تأمين سفر دولي معتمد يغطي حالات الطوارئ الطبية وإلغاء الرحلات واشتراطات تأشيرة شنغن.',
    shortDescriptionEn: 'Global travel insurance provider covering medical emergencies, flight cancellations, and Schengen visa requirements.',
    tags: ['تأمين سفر', 'شنغن', 'تأمين طبي', 'Allianz', 'Travel Insurance'],
    metadata: { tierBadge: 'تأمين دولي معتمد', verifiedDirectBooking: true }
  },
  {
    id: 'service-axa',
    name: 'أكسا للتأمين السياحي الدولي',
    nameEn: 'AXA Travel Insurance',
    category: 'services',
    subcategory: 'insurance',
    regions: ['global', 'europe', 'middle_east', 'americas'],
    iconType: 'shield',
    officialWebsite: 'https://www.axatravelinsurance.com',
    shortDescription: 'تأمين طبي وسياحي معتمد لدى السفارات يوفر تغطية للمصاريف الطبية وفقدان الأمتعة ودعم الطوارئ 24/7.',
    shortDescriptionEn: 'Official travel insurance covering emergency hospital expenses, baggage loss, and embassy visa compliance.',
    tags: ['تأمين سفر', 'أكسا', 'شنغن', 'AXA'],
    metadata: { tierBadge: 'تأمين معتمد', verifiedDirectBooking: true }
  },
  {
    id: 'service-safetywing',
    name: 'سيفيتي وينج (SafetyWing)',
    nameEn: 'SafetyWing Nomad Insurance',
    category: 'services',
    subcategory: 'insurance',
    regions: ['global'],
    iconType: 'shield',
    officialWebsite: 'https://safetywing.com',
    shortDescription: 'تأمين طبي وسفر عالمي مرن بنظام الاشتراك الشهري للمسافرين والرحالة والعمل عن بعد في 180+ دولة.',
    shortDescriptionEn: 'Global travel and medical insurance with flexible subscription for nomads and travelers.',
    tags: ['تأمين سفر', 'رحالة رقميين', 'SafetyWing', 'Nomad Insurance'],
    metadata: { tierBadge: 'تأمين شهري مرن', verifiedDirectBooking: true }
  },

  // =========================================================================
  // TRAVEL SERVICES - 2. ESIM (شرائح الإنترنت الإلكترونية)
  // =========================================================================
  {
    id: 'service-airalo',
    name: 'إيرالو (Airalo eSIM)',
    nameEn: 'Airalo Global eSIM',
    category: 'services',
    subcategory: 'esim',
    regions: ['global', 'middle_east', 'europe', 'asia', 'americas', 'africa'],
    iconType: 'wifi',
    officialWebsite: 'https://www.airalo.com',
    shortDescription: 'متجر الشرائح الإلكترونية (eSIM) الأول عالمياً، يوفر باقات بيانات محلية وإقليمية لأكثر من 200 دولة.',
    shortDescriptionEn: 'Global eSIM store providing data packs for travelers in over 200 countries and regions.',
    tags: ['eSIM', 'إنترنت السفر', 'شريحة إلكترونية', 'Airalo'],
    metadata: { tierBadge: 'شريحة إلكترونية عالمية', verifiedDirectBooking: true }
  },
  {
    id: 'service-holafly',
    name: 'هولافلاي (Holafly eSIM)',
    nameEn: 'Holafly Unlimited eSIM',
    category: 'services',
    subcategory: 'esim',
    regions: ['global', 'europe', 'asia', 'americas', 'middle_east'],
    iconType: 'wifi',
    officialWebsite: 'https://holafly.com',
    shortDescription: 'مزود شرائح إلكترونية يقدم باقات إنترنت غير محدودة البيانات في أوروبا وأمريكا واليابان ومعظم دول العالم.',
    shortDescriptionEn: 'eSIM provider specializing in unlimited data plans for international travelers.',
    tags: ['eSIM', 'إنترنت غير محدود', 'Holafly'],
    metadata: { tierBadge: 'بيانات غير محدودة', verifiedDirectBooking: true }
  },

  // =========================================================================
  // TRAVEL SERVICES - 3. RAIL (القطارات فائقة السرعة)
  // =========================================================================
  {
    id: 'service-haramain-rail',
    name: 'قطار الحرمين السريع (HHR)',
    nameEn: 'Haramain High Speed Railway',
    category: 'services',
    subcategory: 'rail',
    regions: ['middle_east'],
    countryCode: 'SA',
    iconType: 'train',
    officialWebsite: 'https://www.hhr.sa',
    shortDescription: 'الموقع الرسمي لحجز قطار الحرمين السريع الرابط بين مكة المكرمة، جدة، مطار الملك عبدالعزيز، والمدينة المنورة.',
    shortDescriptionEn: 'Official booking portal for Haramain High Speed Rail connecting Makkah, Jeddah, and Madinah.',
    tags: ['قطار الحرمين', 'مكة', 'المدينة', 'جدة', 'السعودية', 'Haramain Train'],
    metadata: { tierBadge: 'بوابة قطار رسمية', verifiedDirectBooking: true }
  },
  {
    id: 'service-eurostar',
    name: 'يوروستار (Eurostar)',
    nameEn: 'Eurostar High Speed Train',
    category: 'services',
    subcategory: 'rail',
    regions: ['europe'],
    iconType: 'train',
    officialWebsite: 'https://www.eurostar.com',
    shortDescription: 'قطار فائق السرعة يربط لندن بباريس وبروكسل وأمستردام عبر نفق القناة الأوروبية.',
    shortDescriptionEn: 'High-speed passenger railway service connecting London with Paris, Brussels, and Amsterdam.',
    tags: ['قطارات أوروبا', 'لندن', 'باريس', 'Eurostar', 'High Speed Rail'],
    metadata: { tierBadge: 'مشغل قطار رسمي', verifiedDirectBooking: true }
  },
  {
    id: 'service-sncf',
    name: 'السكك الحديدية الفرنسية (SNCF Connect)',
    nameEn: 'SNCF Connect TGV',
    category: 'services',
    subcategory: 'rail',
    regions: ['europe'],
    countryCode: 'FR',
    iconType: 'train',
    officialWebsite: 'https://www.sncf-connect.com',
    shortDescription: 'البوابة الرسمية لحجز قطارات TGV فائقة السرعة والقطارات الإقليمية في فرنسا وأوروبا.',
    shortDescriptionEn: 'Official French railway portal for booking high-speed TGV and regional European train routes.',
    tags: ['قطارات فرنسا', 'TGV', 'SNCF', 'باريس'],
    metadata: { tierBadge: 'مشغل وطني رسمي', verifiedDirectBooking: true }
  },
  {
    id: 'service-db-bahn',
    name: 'السكك الحديدية الألمانية (Deutsche Bahn)',
    nameEn: 'Deutsche Bahn (DB)',
    category: 'services',
    subcategory: 'rail',
    regions: ['europe'],
    countryCode: 'DE',
    iconType: 'train',
    officialWebsite: 'https://www.bahn.com',
    shortDescription: 'المشغل الوطني للسكك الحديدية الألمانية لقطارات ICE فائقة السرعة والربط بين المدن الأوروبية.',
    shortDescriptionEn: 'National railway company of Germany operating ICE high-speed trains throughout Central Europe.',
    tags: ['قطارات ألمانيا', 'ICE', 'Deutsche Bahn', 'أوروبا'],
    metadata: { tierBadge: 'مشغل وطني رسمي', verifiedDirectBooking: true }
  },
  {
    id: 'service-jr-pass',
    name: 'السكك الحديدية اليابانية (JR Pass / SmartEX)',
    nameEn: 'Japan Railways (SmartEX / JR)',
    category: 'services',
    subcategory: 'rail',
    regions: ['asia'],
    countryCode: 'JP',
    iconType: 'train',
    officialWebsite: 'https://smart-ex.jp/en',
    shortDescription: 'البوابة الرسمية لحجز قطارات الشينكانسن (القطار الرصاصة) والتنقل بين طوكيو وكيوتو وأوساكا.',
    shortDescriptionEn: 'Official reservation service for Tokaido Sanyo Kyushu Shinkansen bullet trains in Japan.',
    tags: ['قطارات اليابان', 'شينكانسن', 'طوكيو', 'كيوتو', 'Shinkansen', 'JR Pass'],
    metadata: { tierBadge: 'مشغل رسمي', verifiedDirectBooking: true }
  },

  // =========================================================================
  // TRAVEL SERVICES - 4. TRANSFERS & VIP (توصيل المطار والليموزين)
  // =========================================================================
  {
    id: 'service-welcome-pickups',
    name: 'ويلكم بيكبس لتوصيل المطار',
    nameEn: 'Welcome Pickups',
    category: 'services',
    subcategory: 'transfers',
    regions: ['europe', 'middle_east', 'asia', 'americas', 'global'],
    iconType: 'car',
    officialWebsite: 'https://www.welcomepickups.com',
    shortDescription: 'خدمة استقبال وتوصيل المطار بأسعار ثابتة وسائقين معتمدين ومتابعة مواعيد الرحلات الجوية.',
    shortDescriptionEn: 'Pre-booked airport transfers with flight tracking and professional local drivers globally.',
    tags: ['توصيل مطار', 'استقبال المطار', 'Welcome Pickups', 'Transfers'],
    metadata: { tierBadge: 'توصيل معتمد', verifiedDirectBooking: true }
  },
  {
    id: 'service-blacklane',
    name: 'بلاك لاين لخدمات السائق الخاص والـ VIP',
    nameEn: 'Blacklane Chauffeur Service',
    category: 'services',
    subcategory: 'vip',
    regions: ['global', 'middle_east', 'europe', 'americas', 'asia'],
    iconType: 'crown',
    officialWebsite: 'https://www.blacklane.com',
    shortDescription: 'خدمة ليموزين وسائق خاص راقية في أكثر من 50 دولة مع أسطول سيارات مرسيدس وBMW معتمدة.',
    shortDescriptionEn: 'Premium global chauffeur and airport limousine services with guaranteed luxury fleets.',
    tags: ['ليموزين', 'سائق خاص', 'VIP', 'Blacklane', 'Chauffeur'],
    metadata: { tierBadge: 'خدمة ليموزين VIP', verifiedDirectBooking: true }
  },

  // =========================================================================
  // TRAVEL SERVICES - 5. AIRPORT LOUNGES (صالات المطارات)
  // =========================================================================
  {
    id: 'service-priority-pass',
    name: 'برايورتي باس (Priority Pass)',
    nameEn: 'Priority Pass Airport Lounges',
    category: 'services',
    subcategory: 'lounges',
    regions: ['global'],
    iconType: 'armchair',
    officialWebsite: 'https://www.prioritypass.com',
    shortDescription: 'أكبر برنامج مستقل لدخول صالات المطارات حول العالم يتيح الدخول إلى أكثر من 1500 صالة لكبار الزوار.',
    shortDescriptionEn: 'Independent airport lounge access program providing access to 1,500+ airport lounges worldwide.',
    tags: ['صالات مطار', 'VIP Lounge', 'Priority Pass', 'Airport Lounges'],
    metadata: { tierBadge: 'برنامج صالات عالمي', verifiedDirectBooking: true }
  },
  {
    id: 'service-plaza-premium',
    name: 'بلازا بريميوم لونج',
    nameEn: 'Plaza Premium Lounge',
    category: 'services',
    subcategory: 'lounges',
    regions: ['middle_east', 'asia', 'europe', 'americas', 'global'],
    iconType: 'armchair',
    officialWebsite: 'https://www.plazapremiumlounge.com',
    shortDescription: 'شبكة صالات مطارات مستقلة حائزة على جوائز تقدم وجبات فاخرة واستراحات مريحة لجميع المسافرين.',
    shortDescriptionEn: 'Global hospitality network of independent airport lounges and transit hotel services.',
    tags: ['صالات مطار', 'استراحة مطار', 'Plaza Premium Lounge'],
    metadata: { tierBadge: 'صالات مطار معتمدة', verifiedDirectBooking: true }
  },

  // =========================================================================
  // TRAVEL SERVICES - 6. CAR RENTAL (تأجير السيارات)
  // =========================================================================
  {
    id: 'service-sixt',
    name: 'سيكست لتأجير السيارات (Sixt)',
    nameEn: 'Sixt Rent a Car',
    category: 'services',
    subcategory: 'car_rental',
    regions: ['europe', 'middle_east', 'americas', 'global'],
    iconType: 'car',
    officialWebsite: 'https://www.sixt.com',
    shortDescription: 'شركة تأجير سيارات عالمية ألمانية تشتهر بأسطول السيارات الفاخرة والحديثة في المطارات والمدن.',
    shortDescriptionEn: 'International car rental provider offering premium fleets and digital rental experiences.',
    tags: ['تأجير سيارات', 'سيكست', 'Sixt', 'Car Rental'],
    metadata: { tierBadge: 'شركة تأجير سيارات كبرى', verifiedDirectBooking: true }
  },
  {
    id: 'service-enterprise',
    name: 'إنتربرايز لتأجير السيارات (Enterprise)',
    nameEn: 'Enterprise Rent-A-Car',
    category: 'services',
    subcategory: 'car_rental',
    regions: ['americas', 'europe', 'global'],
    iconType: 'car',
    officialWebsite: 'https://www.enterprise.com',
    shortDescription: 'إحدى كبرى شركات تأجير السيارات في العالم، توفر آلاف الفروع في المطارات ووسط المدن.',
    shortDescriptionEn: 'One of the world largest car rental agencies with extensive airport and city locations.',
    tags: ['تأجير سيارات', 'Enterprise', 'Car Rental'],
    metadata: { tierBadge: 'تأجير سيارات عالمي', verifiedDirectBooking: true }
  },
  {
    id: 'service-hertz',
    name: 'هيرتز لتأجير السيارات (Hertz)',
    nameEn: 'Hertz Car Rental',
    category: 'services',
    subcategory: 'car_rental',
    regions: ['global', 'middle_east', 'europe', 'americas'],
    iconType: 'car',
    officialWebsite: 'https://www.hertz.com',
    shortDescription: 'علامة تأجير سيارات دولية عريقة تعمل في 145 دولة مع برنامج ولاية هيرتز جولد بلس.',
    shortDescriptionEn: 'Global car rental brand operating in 145 countries with Hertz Gold Plus Rewards.',
    tags: ['تأجير سيارات', 'Hertz', 'Car Rental'],
    metadata: { tierBadge: 'تأجير سيارات عالمي', verifiedDirectBooking: true, loyaltyProgram: 'Hertz Gold Plus' }
  },

  // =========================================================================
  // TRAVEL SERVICES - 7. FERRIES (العبارات البحرية)
  // =========================================================================
  {
    id: 'service-direct-ferries',
    name: 'دايركت فيريز (Direct Ferries)',
    nameEn: 'Direct Ferries',
    category: 'services',
    subcategory: 'ferries',
    regions: ['europe', 'middle_east', 'asia', 'americas', 'global'],
    iconType: 'ship',
    officialWebsite: 'https://www.directferries.com',
    shortDescription: 'بوابة موحدة للبحث وحجز رحلات العبارات والخطوط البحرية بين دول وجزر البحر المتوسط وأوروبا والعالم.',
    shortDescriptionEn: 'Global ferry ticket booking service comparing major ferry operators and routes worldwide.',
    tags: ['عبارات بحرية', 'جزر اليونان', 'البحر المتوسط', 'Direct Ferries', 'Ferry'],
    metadata: { tierBadge: 'بوابة عبارات بحرية', verifiedDirectBooking: true }
  },
  {
    id: 'service-ferryhopper',
    name: 'فيري هوبر (Ferryhopper)',
    nameEn: 'Ferryhopper',
    category: 'services',
    subcategory: 'ferries',
    regions: ['europe'],
    countryCode: 'GR',
    iconType: 'ship',
    officialWebsite: 'https://www.ferryhopper.com',
    shortDescription: 'منصة متخصصة في حجز عبارات جزر اليونان وإيطاليا وإسبانيا مع إصدار فوري للتذاكر الإلكترونية.',
    shortDescriptionEn: 'Ferry booking platform for Greek islands, Italy, and Spain with instant electronic boarding passes.',
    tags: ['عبارات جزر اليونان', 'سانتوريني', 'ميكونوس', 'Ferryhopper'],
    metadata: { tierBadge: 'بوابة جزر معتمدة', verifiedDirectBooking: true }
  },

  // =========================================================================
  // TRAVEL SERVICES - 8. LUGGAGE STORAGE (حفظ وشحن الأمتعة)
  // =========================================================================
  {
    id: 'service-bounce-luggage',
    name: 'باونس لحفظ الأمتعة (Bounce)',
    nameEn: 'Bounce Luggage Storage',
    category: 'services',
    subcategory: 'luggage',
    regions: ['global', 'europe', 'americas', 'asia', 'middle_east'],
    iconType: 'briefcase',
    officialWebsite: 'https://usebounce.com',
    shortDescription: 'شبكة عالمية لحفظ الحقائب والأمتعة في أكثر من 10,000 موقع آمن بالقرب من محطات القطار والمعالم السياحية.',
    shortDescriptionEn: 'Worldwide luggage storage network with 10,000+ secure storage points near stations and attractions.',
    tags: ['حفظ أمتعة', 'حقائب', 'أمان', 'Bounce Luggage'],
    metadata: { tierBadge: 'حفظ أمتعة مؤمن', verifiedDirectBooking: true }
  },
  {
    id: 'service-radical-storage',
    name: 'راديكال ستوريدج (Radical Storage)',
    nameEn: 'Radical Storage',
    category: 'services',
    subcategory: 'luggage',
    regions: ['europe', 'americas', 'asia', 'global'],
    iconType: 'briefcase',
    officialWebsite: 'https://radicalstorage.com',
    shortDescription: 'خدمة حفظ حقائب في مئات المدن السياحية مع تأمين شامل وسعر يومي موحد وسرعة إيداع واستلام.',
    shortDescriptionEn: 'Luggage storage network offering daily flat rates and security guarantee across major cities.',
    tags: ['حفظ حقائب', 'أمتعة', 'Radical Storage'],
    metadata: { tierBadge: 'حفظ حقائب معتمد', verifiedDirectBooking: true }
  },

  // =========================================================================
  // TRAVEL SERVICES - 9. HAJJ & UMRAH (خدمات الحج والعمرة الرسمية)
  // =========================================================================
  {
    id: 'service-nusuk',
    name: 'منصة نُسك الرسمية (Nusuk)',
    nameEn: 'Nusuk Official Portal',
    category: 'services',
    subcategory: 'hajj_umrah',
    regions: ['middle_east', 'global'],
    countryCode: 'SA',
    iconType: 'landmark',
    officialWebsite: 'https://www.nusuk.sa',
    shortDescription: 'المنصة الحكومية الرسمية المعتمدة لوزارة الحج والعمرة في المملكة العربية السعودية لإصدار تصاريح العمرة والروضة الشريفة وباقات الحج.',
    shortDescriptionEn: 'Official Saudi government platform for Umrah visas, Rawdah permits, and official Hajj packages.',
    tags: ['نسك', 'عمرة', 'حج', 'تصريح الروضة الشريفة', 'مكة', 'المدينة', 'Nusuk', 'Hajj'],
    metadata: { tierBadge: 'بوابة حكومية رسمية', verifiedDirectBooking: true }
  },
  {
    id: 'service-gph-gov',
    name: 'الهيئة العامة للعناية بشؤون الحرمين',
    nameEn: 'General Authority for the Two Holy Mosques',
    category: 'services',
    subcategory: 'hajj_umrah',
    regions: ['middle_east'],
    countryCode: 'SA',
    iconType: 'landmark',
    officialWebsite: 'https://gph.gov.sa',
    shortDescription: 'البوابة الرسمية لخدمات المسجد الحرام والمسجد النبوي الشريف (أوقات الصلوات، الترجمة الفورية، والخدمات الإرشادية).',
    shortDescriptionEn: 'Official administrative portal for services and guidance at the Grand Mosque and Prophet Mosque.',
    tags: ['الحرمين', 'المسجد الحرام', 'المسجد النبوي', 'مكة', 'المدينة'],
    metadata: { tierBadge: 'بوابة حكومية رسمية', verifiedDirectBooking: true }
  },

  // =========================================================================
  // TRAVEL SERVICES - 10. GOVERNMENT PORTALS (البوابات والتأشيرات الرسمية)
  // =========================================================================
  {
    id: 'service-visit-saudi',
    name: 'الهيئة السعودية للسياحة (روح السعودية)',
    nameEn: 'Visit Saudi Official Tourism',
    category: 'services',
    subcategory: 'government',
    regions: ['middle_east'],
    countryCode: 'SA',
    iconType: 'globe',
    officialWebsite: 'https://www.visitsaudi.com',
    shortDescription: 'الموقع الرسمي للهيئة السعودية للسياحة، يشمل التأشيرة السياحية الإلكترونية (eVisa) والفعاليات ودليل الوجهات.',
    shortDescriptionEn: 'Official Saudi tourism platform detailing destinations, events, and tourist eVisa guidelines.',
    tags: ['السعودية', 'تأشيرة سياحية', 'روح السعودية', 'Visit Saudi', 'eVisa'],
    metadata: { tierBadge: 'هيئة سياحية رسمية', verifiedDirectBooking: true }
  },
  {
    id: 'service-visit-dubai',
    name: 'دائرة الاقتصاد والسياحة بدبي (Visit Dubai)',
    nameEn: 'Visit Dubai Official',
    category: 'services',
    subcategory: 'government',
    regions: ['middle_east'],
    countryCode: 'AE',
    iconType: 'globe',
    officialWebsite: 'https://www.visitdubai.com',
    shortDescription: 'البوابة الرسمية لدليل دبي السياحي والفعاليات والاشتراطات الرسمية والمعالم.',
    shortDescriptionEn: 'Official Dubai tourism authority website covering city guides, attractions, and entry regulations.',
    tags: ['دبي', 'الإمارات', 'Visit Dubai', 'Tourism'],
    metadata: { tierBadge: 'هيئة سياحية رسمية', verifiedDirectBooking: true }
  },
  {
    id: 'service-experience-egypt',
    name: 'الهيئة المصرية العامة لتنشيط السياحة',
    nameEn: 'Experience Egypt Official',
    category: 'services',
    subcategory: 'government',
    regions: ['middle_east', 'africa'],
    countryCode: 'EG',
    iconType: 'globe',
    officialWebsite: 'https://experienceegypt.eg',
    shortDescription: 'البوابة الرسمية لوزارة السياحة والآثار المصرية والتأشيرة الإلكترونية وزيارة المتاحف والأهرامات.',
    shortDescriptionEn: 'Official Egyptian Tourism Authority portal for heritage destinations, museum tickets, and eVisa info.',
    tags: ['مصر', 'السياحة المصرية', 'الأهرامات', 'Experience Egypt'],
    metadata: { tierBadge: 'هيئة سياحية رسمية', verifiedDirectBooking: true }
  },
  {
    id: 'service-us-esta',
    name: 'بوابة التأشيرة الأمريكية الإلكترونية الرسمية (ESTA)',
    nameEn: 'US Official ESTA Application',
    category: 'services',
    subcategory: 'government',
    regions: ['americas'],
    countryCode: 'US',
    iconType: 'globe',
    officialWebsite: 'https://esta.cbp.dhs.gov',
    shortDescription: 'الموقع الحكومي الرسمي الوحيد لتقديم تصريح السفر الإلكتروني (ESTA) لدخول الولايات المتحدة الأمريكية.',
    shortDescriptionEn: 'Official US Department of Homeland Security portal for Electronic System for Travel Authorization (ESTA).',
    tags: ['تأشيرة أمريكا', 'ESTA', 'US Visa', 'سفر أمريكا'],
    metadata: { tierBadge: 'بوابة حكومية رسمية', verifiedDirectBooking: true }
  },
  {
    id: 'service-uk-eta',
    name: 'بوابة تصريح السفر البريطاني الرسمي (UK ETA)',
    nameEn: 'UK Official Electronic Travel Authorisation (ETA)',
    category: 'services',
    subcategory: 'government',
    regions: ['europe'],
    countryCode: 'GB',
    iconType: 'globe',
    officialWebsite: 'https://www.gov.uk/electronic-travel-authorisation',
    shortDescription: 'الموقع الحكومي البريطاني الرسمي الوحيد للتقديم على تصريح السفر الإلكتروني (ETA) لمواطني الخليج ودول العالم.',
    shortDescriptionEn: 'Official UK government portal for Electronic Travel Authorisation (ETA) applications.',
    tags: ['تأشيرة بريطانيا', 'UK ETA', 'بريطانيا', 'لندن'],
    metadata: { tierBadge: 'بوابة حكومية رسمية', verifiedDirectBooking: true }
  },
  {
    id: 'service-visit-japan',
    name: 'بوابة الدخول إلى اليابان (Visit Japan Web)',
    nameEn: 'Visit Japan Web Official',
    category: 'services',
    subcategory: 'government',
    regions: ['asia'],
    countryCode: 'JP',
    iconType: 'globe',
    officialWebsite: 'https://vjw-lp.digital.go.jp/en',
    shortDescription: 'الخدمة الرقمية الرسمية لوكالة الرقمية اليابانية لتسجيل إجراءات الهجرة والجمارك والإعفاء الضريبي.',
    shortDescriptionEn: 'Official digital service of Digital Agency Japan for immigration and customs declarations.',
    tags: ['اليابان', 'تأشيرة اليابان', 'Visit Japan Web', 'Tokyo'],
    metadata: { tierBadge: 'بوابة حكومية رسمية', verifiedDirectBooking: true }
  },
];

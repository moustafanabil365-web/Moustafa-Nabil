import { GeneratedPlan } from '../types';

export interface BookingProviderLink {
  id: string;
  name: string;
  category: 'airline_direct' | 'hotel_direct' | 'tickets_tours' | 'hotels' | 'flights_transit' | 'dining' | 'navigation' | 'rail_direct' | 'car_direct';
  logoEmoji: string;
  badgeColor: string;
  url: string;
  tagline: string;
  description: string;
  isDirectOfficial?: boolean;
  directBenefits?: string[];
  contactInfo?: {
    whatsapp?: string;
    phone?: string;
    email?: string;
  };
}

export interface ActivityBookingItem {
  id: string;
  dayNumber: number;
  timeSlot?: string;
  title: string;
  destination: string;
  category: 'attraction' | 'museum' | 'nature_adventure' | 'hotel' | 'dining' | 'transit' | 'shopping' | 'general';
  categoryLabel: string;
  links: BookingProviderLink[];
  bookingTips: string[];
  recommendedAdvanceDays: string;
  estimatedPriceRange?: string;
  isBooked?: boolean;
  directOfficialProvider?: string;
  earlyCheckinAvailable?: boolean;
  directContacts?: {
    receptionPhone?: string;
    whatsappConcierge?: string;
    bookingEmail?: string;
  };
}

export interface OfficialAirline {
  id: string;
  name: string;
  nameEn: string;
  country: string;
  logo: string;
  officialBookingUrl: string;
  webCheckinUrl: string;
  baggagePolicyUrl: string;
  directBenefits: string[];

  // New optional metadata fields (additive, backward-compatible)
  serviceLevel?: 'PREMIUM' | 'STANDARD' | 'ECONOMY';
  businessModel?: 'FULL_SERVICE' | 'HYBRID' | 'LOW_COST' | 'REGIONAL' | 'CHARTER' | 'CARGO' | 'PASSENGER_CARGO';
  operationType?: 'PASSENGER' | 'CARGO' | 'PASSENGER_CARGO';
  networkType?: 'DOMESTIC' | 'REGIONAL' | 'INTERNATIONAL' | 'GLOBAL';
  iataCode?: string;
  icaoCode?: string;
  alliance?: string;
  isActive?: boolean;
  dataSource?: string;
  verified?: boolean;
  confidence?: number;
}

export interface OfficialHotelChain {
  id: string;
  name: string;
  logo: string;
  officialBookingUrl: string;
  bestRateGuarantee: boolean;
  earlyCheckinAssistance: boolean;
  whatsappAvailable: boolean;
  samplePhone: string;
  directBenefits: string[];

  // New optional hotel metadata (additive)
  serviceLevel?: 'LUXURY' | 'PREMIUM' | 'STANDARD' | 'BUDGET';
  propertyType?:
    | 'HOTEL'
    | 'RESORT'
    | 'BOUTIQUE'
    | 'HOSTEL'
    | 'APART_HOTEL'
    | 'VILLA'
    | 'SERVICED_APARTMENT'
    | 'LODGE'
    | 'GUESTHOUSE';
  starRating?: 1 | 2 | 3 | 4 | 5;
  hotelSegment?:
    | 'BUSINESS'
    | 'LEISURE'
    | 'FAMILY'
    | 'COUPLES'
    | 'LUXURY'
    | 'WELLNESS'
    | 'BEACH_RESORT'
    | 'CITY_CENTER'
    | 'AIRPORT'
    | 'LONG_STAY'
    | 'BUDGET_TRAVEL'
    | 'ADVENTURE';

  isActive?: boolean;
  dataSource?: string;
  verified?: boolean;
  confidence?: number;
}

export const OFFICIAL_AIRLINES_DATABASE: OfficialAirline[] = [
  {
    id: 'saudia',
    name: 'الخطوط الجوية العربية السعودية (Saudia)',
    nameEn: 'Saudia Airlines',
    country: 'السعودية',
    logo: '🇸🇦 ✈️',
    officialBookingUrl: 'https://www.saudia.com',
    webCheckinUrl: 'https://www.saudia.com/travel-with-saudia/manage/check-in-online',
    baggagePolicyUrl: 'https://www.saudia.com/travel-with-saudia/baggage',
    directBenefits: [
      'أقل سعر رسمي للتذكرة بدون عمولات وسطاء',
      'قص بطاقة صعود الطائرة (Boarding Pass) مجاناً عبر الويب والتطبيق',
      'إدارة واختيار المقاعد وحزم الأمتعة والوزن الأصلي مجاناً',
      'كسب واستبدال أميال الفرسان (Alfursan) مباشرة',
    ],
  },
  {
    id: 'emirates',
    name: 'طيران الإمارات (Emirates)',
    nameEn: 'Emirates Airline',
    country: 'الإمارات',
    logo: '🇦🇪 ✈️',
    officialBookingUrl: 'https://www.emirates.com',
    webCheckinUrl: 'https://www.emirates.com/english/manage-booking/online-check-in/',
    baggagePolicyUrl: 'https://www.emirates.com/english/before-you-fly/baggage/',
    directBenefits: [
      'حجز مباشر من الموقع الرسمي بضمان أفضل سعر (Best Price Guarantee)',
      'تسجيل الوصول الإلكتروني وقص البوردنج قبل 48 ساعة من الإقلاع مجاناً',
      'تحديد الوجبات الخاصة واختيار المقاعد المفضلة مباشرة',
      'نقاط سكاي واردز (Skywards) الفورية',
    ],
  },
  {
    id: 'qatar',
    name: 'الخطوط الجوية القطرية (Qatar Airways)',
    nameEn: 'Qatar Airways',
    country: 'قطر',
    logo: '🇶🇦 ✈️',
    officialBookingUrl: 'https://www.qatarairways.com',
    webCheckinUrl: 'https://www.qatarairways.com/en/check-in.html',
    baggagePolicyUrl: 'https://www.qatarairways.com/en/baggage.html',
    directBenefits: [
      'أسعار رسمية معفاة من رسوم الإدارة التابعة للوكالات الخارجية',
      'إصدار البوردنج الرقمي مجاناً وإمكانية إضافته لمحفظة Apple Wallet',
      'خدمة تعديل الرحلة وتغيير الموعد بمرونة مباشرة من موقع الناقل',
      'نقاط نادي الامتياز Privilege Club (أفيوس Avios)',
    ],
  },
  {
    id: 'egyptair',
    name: 'مصر للطيران (EgyptAir)',
    nameEn: 'EgyptAir',
    country: 'مصر',
    logo: '🇪🇬 ✈️',
    officialBookingUrl: 'https://www.egyptair.com',
    webCheckinUrl: 'https://www.egyptair.com/ar/fly/Pages/web-checkin.aspx',
    baggagePolicyUrl: 'https://www.egyptair.com/ar/fly/baggage/Pages/baggage-allowance.aspx',
    directBenefits: [
      'حجز مباشر وتأكيد فوري من الموقع الرسمي',
      'قص بطاقة صعود الطائرة قبل السفر بـ 48 ساعة مجاناً',
      'حقائب مجانية حسب درجة السفر بدون مفاجآت الوزن الإضافي',
      'أميال تحالف ستار ألاينس (Star Alliance)',
    ],
  },
  {
    id: 'turkish',
    name: 'الخطوط الجوية التركية (Turkish Airlines)',
    nameEn: 'Turkish Airlines',
    country: 'تركيا',
    logo: '🇹🇷 ✈️',
    officialBookingUrl: 'https://www.turkishairlines.com',
    webCheckinUrl: 'https://www.turkishairlines.com/en-int/flights/manage-booking/',
    baggagePolicyUrl: 'https://www.turkishairlines.com/en-int/any-questions/baggage-information/',
    directBenefits: [
      'الموقع الرسمي يضمن أرخص الأسعار لرحلات الترانزيت ووجهات أوروبا',
      'إصدار البوردنج الإلكتروني مجاناً واختيار المقاعد بسهولة',
      'حجز جولة مجانية في إسطنبول (Touristanbul) لرحلات الترانزيت الطويلة',
      'أميال Miles&Smiles الرسمية',
    ],
  },
  {
    id: 'flynas',
    name: 'طيران ناس (flynas)',
    nameEn: 'flynas',
    country: 'السعودية',
    logo: '🟡 ✈️',
    officialBookingUrl: 'https://www.flynas.com',
    webCheckinUrl: 'https://www.flynas.com/ar/check-in',
    baggagePolicyUrl: 'https://www.flynas.com/ar/baggage-services',
    directBenefits: [
      'أرخص أسعار الطيران الاقتصادي الإقليمي مباشرة بدون رسوم طرف ثالث',
      'قص البوردنج مجاناً وتفادي رسوم كاونتر المطار',
      'شراء الأمتعة الإضافية بخصم يصل إلى 50% مقارنة بالمطار',
      'نقاط ناسمايلز (nasmiles) الفورية',
    ],
  },
  {
    id: 'flyadeal',
    name: 'طيران أديل (flyadeal)',
    nameEn: 'flyadeal',
    country: 'السعودية',
    logo: '🟣 ✈️',
    officialBookingUrl: 'https://www.flyadeal.com',
    webCheckinUrl: 'https://www.flyadeal.com/ar/check-in',
    baggagePolicyUrl: 'https://www.flyadeal.com/ar/baggage-policy',
    directBenefits: [
      'حجز مباشر منخفض التكلفة بأسعار رسمية فورية',
      'بوردنج إلكتروني سريع مجاني عبر الموقع والتطبيق',
      'إمكانية إضافة حقائب الكابينة وشحن الأمتعة بأقل سعر',
    ],
  },
  {
    id: 'lufthansa',
    name: 'لوفتهانزا (Lufthansa)',
    nameEn: 'Lufthansa',
    country: 'ألمانيا / أوروبا',
    logo: '🇩🇪 ✈️',
    officialBookingUrl: 'https://www.lufthansa.com',
    webCheckinUrl: 'https://www.lufthansa.com/de/en/online-check-in',
    baggagePolicyUrl: 'https://www.lufthansa.com/de/en/baggage-overview',
    directBenefits: [
      'حجز مباشر رسمي لجميع شبكات أوروبا والعالم بأقل تكلفة',
      'تسجيل الوصول الإلكتروني مجاناً قبل 23 ساعة',
      'أميال Miles & More الرسمية',
    ],
  },
  {
    id: 'british_airways',
    name: 'الخطوط الجوية البريطانية (British Airways)',
    nameEn: 'British Airways',
    country: 'بريطانيا',
    logo: '🇬🇧 ✈️',
    officialBookingUrl: 'https://www.britishairways.com',
    webCheckinUrl: 'https://www.britishairways.com/travel/olcilandingpage/public/en_gb',
    baggagePolicyUrl: 'https://www.britishairways.com/en-gb/information/baggage-essentials',
    directBenefits: [
      'حجز مباشر مع ضمان تعديل المواعيد بدون عمولة وسيط',
      'بوردنج رقمي مجاني مع Apple Wallet قبل 24 ساعة',
      'نقاط Executive Club Avios',
    ],
  },
  {
    id: 'airfrance',
    name: 'الخطوط الجوية الفرنسية (Air France)',
    nameEn: 'Air France',
    country: 'فرنسا',
    logo: '🇫🇷 ✈️',
    officialBookingUrl: 'https://www.airfrance.com',
    webCheckinUrl: 'https://www.airfrance.fr/en/check-in',
    baggagePolicyUrl: 'https://www.airfrance.fr/en/information/bagages',
    directBenefits: [
      'تذاكر رسمية مباشرة مع خدمة العملاء على مدار الساعة',
      'قص البوردنج مجاناً واختيار المقاعد مسبقاً',
      'برنامج Flying Blue الرسمي',
    ],
  },
];

export const OFFICIAL_HOTEL_CHAINS_DATABASE: OfficialHotelChain[] = [
  {
    id: 'marriott',
    name: 'ماريوت الدولية (Marriott Bonvoy)',
    logo: '🏨 🌟',
    officialBookingUrl: 'https://www.marriott.com',
    bestRateGuarantee: true,
    earlyCheckinAssistance: true,
    whatsappAvailable: true,
    samplePhone: '+966-11-211-5555',
    directBenefits: [
      'ضمان أقل سعر رسمي للغرف (Best Rate Guarantee) - إذا وجدت سعراً أقل يحسم لك 25%',
      'تطبيق الهاتف يتيح المفتاح الرقمي (Mobile Key) والاستلام السريع للغرفة دون انتظار الاستقبال',
      'تنسيق وقت الدخول المبكر (Early Check-in) والمغادرة المتأخرة مجاناً لأعضاء البرنامج',
      'إنترنت عالي السرعة مجاني وترقيات غرف للأعضاء',
      'تواصل مباشر مع الكونسيرج ومكتب الاستقبال بالواتساب والهاتف المباشر',
    ],
  },
  {
    id: 'hilton',
    name: 'هيلتون العالمية (Hilton Honors)',
    logo: '🏨 💎',
    officialBookingUrl: 'https://www.hilton.com',
    bestRateGuarantee: true,
    earlyCheckinAssistance: true,
    whatsappAvailable: true,
    samplePhone: '+966-11-800-4458',
    directBenefits: [
      'حجز مباشر يضمن اختيار رقم الغرفة الدقيق من خريطة الفندق التفاعلية بالهاتف',
      'تسجيل الدخول الرقمي المسبق واستلام الغرفة فور الوصول مباشرة عبر المفتاح الرقمي',
      'نقاط هيلتون أونرز واستبدال الليالي المجانية فوراً',
      'خدمة الدخول المبكر (Early Check-in) المنسقة مباشرة مع قسم الحجوزات',
    ],
  },
  {
    id: 'accor',
    name: 'أكور للفنادق (Accor ALL - Sofitel / Pullman / Fairmont / Novotel)',
    logo: '🏨 ⚜️',
    officialBookingUrl: 'https://all.accor.com',
    bestRateGuarantee: true,
    earlyCheckinAssistance: true,
    whatsappAvailable: true,
    samplePhone: '+966-12-571-7777',
    directBenefits: [
      'حجز مباشر يغطي أفخم سلاسل الفنادق (فيرمونت، بولمان، سوفيتيل، نوفوتيل، إيبيس)',
      'تواصل سريع ومباشر مع مكتب استقبال كل فندق قبل الوصول لترتيب الغرف المطلوبة',
      'تسجيل وصول ومغادرة سريع (Fast Check-in & Fast Check-out)',
      'خصومات حصرية للأعضاء تصل إلى 10% فورياً',
    ],
  },
  {
    id: 'ihg',
    name: 'مجموعة فنادق إنتركونتيننتال (IHG One Rewards)',
    logo: '🏨 👑',
    officialBookingUrl: 'https://www.ihg.com',
    bestRateGuarantee: true,
    earlyCheckinAssistance: true,
    whatsappAvailable: true,
    samplePhone: '+966-11-465-5000',
    directBenefits: [
      'حجز مباشر رسمي لفنادق إنتركونتيننتال، كراون بلازا، وهوليداي إن بأقل تكلفة',
      'إمكانية إلغاء الحجز حتى يوم الوصول في معظم الغرف المرنة',
      'خدمة طلب تسجيل الدخول المبكر بنقرة واحدة عبر تطبيق الفندق الرسمي',
    ],
  },
  {
    id: 'fourseasons',
    name: 'فور سيزونز الفاخرة (Four Seasons)',
    logo: '🏨 🌳',
    officialBookingUrl: 'https://www.fourseasons.com',
    bestRateGuarantee: true,
    earlyCheckinAssistance: true,
    whatsappAvailable: true,
    samplePhone: '+966-11-211-5000',
    directBenefits: [
      'شات وتواصل فوري مع الكونسيرج ومكتب الاستقبال على مدار 24 ساعة عبر تطبيق Four Seasons Chat الرسمي',
      'تجهيز الغرفة والسرير واستقبال خاص حسب طلبات النزيل المسبقة',
      'تنسيق استلام الغرفة فائق السرعة مع المساعد الشخصي',
    ],
  },
  {
    id: 'hyatt',
    name: 'حياة العالمية (World of Hyatt)',
    logo: '🏨 🔷',
    officialBookingUrl: 'https://www.hyatt.com',
    bestRateGuarantee: true,
    earlyCheckinAssistance: true,
    whatsappAvailable: true,
    samplePhone: '+966-11-288-1234',
    directBenefits: [
      'أفضل أسعار الغرف الرسمية بدون وسيط',
      'مفتاح الغرفة في محفظة Apple Wallet لفتح الباب فور الوصول',
      'خدمة كونسيرج مخصصة وتنسيق الدخول المبكر',
    ],
  },
];

/**
 * Clean query string for search URLs
 */
function cleanQuery(text: string): string {
  return encodeURIComponent(text.trim());
}

/**
 * Generate comprehensive direct deep links & official providers for any activity, landmark, or stay
 */
export function generateActivityBookingLinks(
  title: string,
  destination: string,
  category: string = 'attraction'
): BookingProviderLink[] {
  const fullSearchQuery = `${title} ${destination}`.trim();
  const encQuery = cleanQuery(fullSearchQuery);
  const encDest = cleanQuery(destination);
  const encTitle = cleanQuery(title);

  const links: BookingProviderLink[] = [];

  // 1. Official Direct Ticket / Museum / Attraction Site
  links.push({
    id: 'official-attraction-direct',
    name: 'الموقع الرسمي للمعلم / التذاكر المباشرة',
    category: 'tickets_tours',
    logoEmoji: '🏛️',
    badgeColor: 'bg-amber-950/70 text-[#f5d061] border border-[#d4af37]/60 font-black',
    url: `https://www.google.com/search?q=${cleanQuery(title + ' ' + destination + ' official website tickets')}`,
    tagline: 'حجز مباشر من المشغل الرسمي بدون وسيط',
    description: 'شراء التذاكر الرسمية من المصدر الأصلي بدون عمولات وسطاء مع ضمان تأكيد فوري ورقمي.',
    isDirectOfficial: true,
    directBenefits: [
      'أقل سعر رسمي للتذكرة',
      'تذكرة إلكترونية رسمية بباركود فوري',
      'تجنب طوابير الشباك والوسطاء',
    ],
  });

  // 2. Google Maps Direct & Reception Navigation
  links.push({
    id: 'google-maps',
    name: 'Google Maps (الموقع والتواصل المباشر)',
    category: 'navigation',
    logoEmoji: '📍',
    badgeColor: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40',
    url: `https://www.google.com/maps/search/?api=1&query=${encQuery}`,
    tagline: 'الموقع الدقيق، هاتف الاستقبال وساعات العمل',
    description: 'أرقام الاتصال المباشرة، الاتجاهات الدقيقة، ومواعيد الزيارة الحية.',
    isDirectOfficial: true,
  });

  // 3. Direct Hotel Chain Portals (if stay or hotel)
  if (category === 'hotel' || title.includes('فندق') || title.includes('منتجع') || title.includes('إقامة') || title.includes('Hotel')) {
    links.push({
      id: 'marriott-direct',
      name: 'Marriott Bonvoy Official',
      category: 'hotel_direct',
      logoEmoji: '🏨',
      badgeColor: 'bg-[#1a1408] text-[#f5d061] border border-[#d4af37]/70',
      url: `https://www.marriott.com/search/default.mi?destinationAddress.destination=${encDest}`,
      tagline: 'حجز فندقي رسمي مع ضمان أقل سعر وترتيب الدخول المبكر',
      description: 'حجز مباشر من الفندق مع مفتاح رقمي بالهاتف واستلام سريع للغرفة وتواصل واتساب مباشر.',
      isDirectOfficial: true,
      directBenefits: [
        'أرخص سعر رسمي مضمون (Best Rate Guarantee)',
        'تواصل واتساب وهاتف مباشر مع مكتب الاستقبال',
        'تنسيق خدمة الدخول المبكر (Early Check-in)',
        'مفتاح الغرفة الرقمي عبر الهاتف بدون انتظار',
      ],
    });

    links.push({
      id: 'hilton-direct',
      name: 'Hilton Honors Official',
      category: 'hotel_direct',
      logoEmoji: '🏨',
      badgeColor: 'bg-blue-950/70 text-blue-300 border border-blue-500/50',
      url: `https://www.hilton.com/en/search/?query=${encDest}`,
      tagline: 'حجز رسمي مباشر مع اختيار رقم الغرفة مسبقاً',
      description: 'اختر غرفتك بنفسك عبر خريطة الفندق الرقمية واستلم المفتاح فور وصولك.',
      isDirectOfficial: true,
    });
  }

  // 4. Official Direct High-Speed Rail & Transport
  if (title.includes('قطار') || title.includes('محطة') || title.includes('سفر بين') || title.includes('Train') || title.includes('حرمين')) {
    links.push({
      id: 'rail-direct',
      name: 'المشغل الرسمي للقطارات والسكك الحديدية',
      category: 'rail_direct',
      logoEmoji: '🚅',
      badgeColor: 'bg-purple-950/60 text-purple-300 border border-purple-500/40',
      url: `https://www.google.com/search?q=${cleanQuery(title + ' official train tickets booking')}`,
      tagline: 'حجز تذاكر القطارات السريعة مباشرة من هيئة السكك الحديدية',
      description: 'حجز رسمي بدون عمولة وكيل مع اختيار المقاعد والدرجات بسهولة.',
      isDirectOfficial: true,
    });
  }

  // 5. GetYourGuide (Authorized Global Experiences)
  links.push({
    id: 'getyourguide',
    name: 'GetYourGuide (تجارب سياحية معتمدة)',
    category: 'tickets_tours',
    logoEmoji: '🎟️',
    badgeColor: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
    url: `https://www.getyourguide.com/s/?q=${encQuery}&partner_id=smarttravel`,
    tagline: 'تذاكر الدخول السريع والجولات المصحوبة بمرشد',
    description: 'حجز مباشر لتذاكر تخطي الطوابير مع تأكيد فوري وإلغاء مرن.',
  });

  // 6. TripAdvisor (Reviews & Official Providers)
  links.push({
    id: 'tripadvisor',
    name: 'TripAdvisor Experiences',
    category: 'tickets_tours',
    logoEmoji: '🦉',
    badgeColor: 'bg-emerald-900/60 text-emerald-200 border-emerald-400/40',
    url: `https://www.tripadvisor.com/Search?q=${encQuery}`,
    tagline: 'مقارنة العروض وتقييمات الزوار الحية',
    description: 'استعراض تجارب المسافرين الحقيقية وصور المكان المحدثة.',
  });

  // 7. Viator (Tripadvisor experiences)
  links.push({
    id: 'viator',
    name: 'Viator Experiences',
    category: 'tickets_tours',
    logoEmoji: '⛵',
    badgeColor: 'bg-blue-950/60 text-blue-300 border-blue-500/40',
    url: `https://www.viator.com/searchResults/all?text=${encQuery}`,
    tagline: 'جولات خاصة وتجارب VIP حصرية',
    description: 'تجارب سياحية معتمدة عالمياً مع تأكيد فوري.',
  });

  return links;
}

/**
 * Extract all structured activities from a generated travel plan
 */
export function extractActivitiesFromPlan(plan: GeneratedPlan): ActivityBookingItem[] {
  const items: ActivityBookingItem[] = [];

  // Check if structured itinerary array exists
  const rawItinerary = (plan as any).itinerary;
  if (Array.isArray(rawItinerary) && rawItinerary.length > 0) {
    rawItinerary.forEach((day: any) => {
      // 1. Main Activities
      if (Array.isArray(day.activities)) {
        day.activities.forEach((act: any, actIdx: number) => {
          const actCategory = detectActivityCategory(act.title || '', act.description || '');
          items.push({
            id: `day_${day.dayNumber || 1}_act_${actIdx}`,
            dayNumber: day.dayNumber || 1,
            timeSlot: act.time || '10:00 - 12:30',
            title: act.title || 'نشاط سياحي',
            destination: day.destinationSummary || plan.destination,
            category: actCategory,
            categoryLabel: getCategoryArabicLabel(actCategory),
            links: generateActivityBookingLinks(act.title || '', day.destinationSummary || plan.destination, actCategory),
            bookingTips: generateBookingTips(act.title || '', actCategory),
            recommendedAdvanceDays: getRecommendedAdvance(actCategory),
            estimatedPriceRange: act.costEstimate || 'حسب الفئة المختارة',
            earlyCheckinAvailable: actCategory === 'hotel',
            directContacts: {
              receptionPhone: '+966-11-200-0000',
              whatsappConcierge: 'https://wa.me/966500000000',
              bookingEmail: 'concierge@smarttravel.ai',
            },
          });
        });
      }

      // 2. Dining
      if (day.meals) {
        if (day.meals.lunch) {
          items.push({
            id: `day_${day.dayNumber}_meal_lunch`,
            dayNumber: day.dayNumber,
            timeSlot: '13:30 - 15:00',
            title: `غداء: ${day.meals.lunch}`,
            destination: day.destinationSummary || plan.destination,
            category: 'dining',
            categoryLabel: 'طعام ومطاعم',
            links: generateActivityBookingLinks(day.meals.lunch, day.destinationSummary || plan.destination, 'dining'),
            bookingTips: ['يفضل الحجز المسبق في عطلات نهاية الأسبوع وأوقات الذروة.'],
            recommendedAdvanceDays: 'نفس اليوم أو قبلها بـ 24 ساعة',
            estimatedPriceRange: 'متوسط إلى راقٍ',
          });
        }
        if (day.meals.dinner) {
          items.push({
            id: `day_${day.dayNumber}_meal_dinner`,
            dayNumber: day.dayNumber,
            timeSlot: '20:30 - 22:30',
            title: `عشاء: ${day.meals.dinner}`,
            destination: day.destinationSummary || plan.destination,
            category: 'dining',
            categoryLabel: 'طعام ومطاعم',
            links: generateActivityBookingLinks(day.meals.dinner, day.destinationSummary || plan.destination, 'dining'),
            bookingTips: ['اختر طاولة بإطلالة مميزة وراجع خيارات الجلوس الخارجية.'],
            recommendedAdvanceDays: 'قبلها بـ 24 إلى 48 ساعة',
            estimatedPriceRange: 'تجربة طعام مميزة',
          });
        }
      }

      // 3. Accommodation / Hotel
      if (day.accommodationRecommendation) {
        items.push({
          id: `day_${day.dayNumber}_hotel`,
          dayNumber: day.dayNumber,
          timeSlot: 'تسجيل الوصول 14:00 - 15:00',
          title: `الإقامة: ${day.accommodationRecommendation}`,
          destination: day.destinationSummary || plan.destination,
          category: 'hotel',
          categoryLabel: 'فنادق وإقامة',
          links: generateActivityBookingLinks(day.accommodationRecommendation, day.destinationSummary || plan.destination, 'hotel'),
          bookingTips: [
            'احجز مباشرة من الموقع الرسمي للفندق لضمان أقل سعر وتفعيل الدخول المبكر.',
            'استخدم رقم هاتف أو واتساب الاستقبال المباشر لإبلاغهم بموعد وصولك واستلام الغرفة فوراً.',
          ],
          recommendedAdvanceDays: 'قبل السفر بـ 2 إلى 4 أسابيع',
          estimatedPriceRange: 'حسب نوع الغرفة المختارة',
          earlyCheckinAvailable: true,
          directContacts: {
            receptionPhone: '+966-11-211-5555',
            whatsappConcierge: 'https://wa.me/966551234567',
            bookingEmail: 'reservations@hotel-direct.com',
          },
        });
      }
    });

    if (items.length > 0) return items;
  }

  // Fallback: extract from dayLandmarks, local experiences, or markdown lines
  if (plan.dayLandmarks && plan.dayLandmarks.length > 0) {
    plan.dayLandmarks.forEach((landmark, idx) => {
      const cat = detectActivityCategory(landmark.landmarkName, landmark.description);
      items.push({
        id: `landmark_${landmark.dayNumber}_${idx}`,
        dayNumber: landmark.dayNumber,
        timeSlot: landmark.bestTime || '10:00 - 13:00',
        title: landmark.landmarkName,
        destination: landmark.city || plan.destination,
        category: cat,
        categoryLabel: getCategoryArabicLabel(cat),
        links: generateActivityBookingLinks(landmark.landmarkName, landmark.city || plan.destination, cat),
        bookingTips: generateBookingTips(landmark.landmarkName, cat),
        recommendedAdvanceDays: getRecommendedAdvance(cat),
        estimatedPriceRange: 'تذكرة دخول قياسية',
        earlyCheckinAvailable: cat === 'hotel',
      });
    });
  }

  // Also include Local Experiences
  if (plan.localExperiences && plan.localExperiences.length > 0) {
    plan.localExperiences.forEach((exp, idx) => {
      const cat: ActivityBookingItem['category'] = exp.category === 'culinary' ? 'dining' : 'attraction';
      items.push({
        id: `exp_${idx}`,
        dayNumber: 1,
        timeSlot: exp.recommendedTime || '16:00 - 18:30',
        title: exp.title,
        destination: exp.location || plan.destination,
        category: cat,
        categoryLabel: exp.categoryLabel || getCategoryArabicLabel(cat),
        links: generateActivityBookingLinks(exp.title, exp.location || plan.destination, cat),
        bookingTips: [exp.insiderTip || 'تجربة محلية مميزة لا تفوتها.'],
        recommendedAdvanceDays: 'قبلها بـ 24 ساعة',
        estimatedPriceRange: exp.estimatedCost || 'سعر مناسب',
      });
    });
  }

  // Accommodation area from constraints
  if (plan.constraints?.accommodationArea) {
    items.unshift({
      id: `hotel_primary`,
      dayNumber: 1,
      timeSlot: 'تسجيل الوصول 14:00',
      title: `فندق / إقامة منطقة ${plan.constraints.accommodationArea}`,
      destination: plan.destination,
      category: 'hotel',
      categoryLabel: 'فنادق وإقامة',
      links: generateActivityBookingLinks(plan.constraints.accommodationArea, plan.destination, 'hotel'),
      bookingTips: [
        'احجز من موقع السلسلة الرسمي لتحصل على أفضل سعر وخصم الأعضاء المباشر.',
        'تواصل مع الفندق قبل الوصول بـ 24 ساعة لترتيب الدخول المبكر للغرفة.',
      ],
      recommendedAdvanceDays: 'قبل السفر بـ 2 إلى 4 أسابيع',
      estimatedPriceRange: 'حسب الفندق المختار',
      earlyCheckinAvailable: true,
      directContacts: {
        receptionPhone: '+966-11-800-4444',
        whatsappConcierge: 'https://wa.me/966551234567',
        bookingEmail: 'concierge@directhotels.com',
      },
    });
  }

  return items;
}

function detectActivityCategory(title: string, desc: string): ActivityBookingItem['category'] {
  const text = `${title} ${desc}`.toLowerCase();
  if (text.includes('متحف') || text.includes('قلعة') || text.includes('قصر') || text.includes('معبد') || text.includes('museum') || text.includes('palace')) {
    return 'museum';
  }
  if (text.includes('فندق') || text.includes('منتجع') || text.includes('إقامة') || text.includes('hotel') || text.includes('resort')) {
    return 'hotel';
  }
  if (text.includes('مطعم') || text.includes('كافيه') || text.includes('مقهى') || text.includes('عشاء') || text.includes('غداء') || text.includes('restaurant') || text.includes('cafe')) {
    return 'dining';
  }
  if (text.includes('قطار') || text.includes('مطار') || text.includes('طيران') || text.includes('مترو') || text.includes('سيارة') || text.includes('flight') || text.includes('train')) {
    return 'transit';
  }
  if (text.includes('تسلق') || text.includes('هايكنج') || text.includes('سفاري') || text.includes('حديقة') || text.includes('شاطئ') || text.includes('بحر') || text.includes('safari') || text.includes('park')) {
    return 'nature_adventure';
  }
  if (text.includes('سوق') || text.includes('مول') || text.includes('تسوق') || text.includes('mall') || text.includes('shopping')) {
    return 'shopping';
  }
  return 'attraction';
}

function getCategoryArabicLabel(cat: ActivityBookingItem['category']): string {
  const map: Record<ActivityBookingItem['category'], string> = {
    museum: 'متاحف ومعالم أثرية',
    attraction: 'مزارات وأماكن سياحية',
    nature_adventure: 'طبيعة ومغامرات',
    hotel: 'فنادق وإقامة رسمية',
    dining: 'مطاعم وتجارب طعام',
    transit: 'طيران ومواصلات مباشرة',
    shopping: 'أسواق ومراكز تسوق',
    general: 'أنشطة متنوعة',
  };
  return map[cat] || 'نشاط سياحي';
}

function generateBookingTips(title: string, cat: ActivityBookingItem['category']): string[] {
  const tips: string[] = [];
  if (cat === 'museum' || cat === 'attraction') {
    tips.push('احجز التذكرة مباشرة من الموقع الرسمي لتفادي طوابير الانتظار وضمان الدخول المحدد بالوقت.');
    tips.push('تحقق من ساعات الإغلاق الأسبوعية وسياسة التصوير.');
  } else if (cat === 'hotel') {
    tips.push('الحجز من موقع الفندق مباشرة يمنحك ترقية مجانية وأولوية تسجيل الوصول المبكر (Early Check-in).');
    tips.push('تواصل عبر واتساب الاستقبال قبل موعد وصولك بساعتين لتجهيز الغرفة والمفتاح الرقمي.');
  } else if (cat === 'transit') {
    tips.push('احجز من موقع شركة الطيران الرسمي مباشرة لقص البوردنج مجاناً وإدارة الوزن الأصلي.');
  } else {
    tips.push('احتفظ بنسخة إلكترونية من تأكيد الحجز على هاتفك بدون الحاجة لطباعة ورقية.');
  }
  return tips;
}

function getRecommendedAdvance(cat: ActivityBookingItem['category']): string {
  switch (cat) {
    case 'hotel':
      return 'قبل السفر بـ 15 - 30 يوماً';
    case 'transit':
      return 'قبل السفر بـ 3 - 8 أسابيع';
    case 'museum':
      return 'قبل الزيارة بـ 3 - 7 أيام';
    case 'nature_adventure':
      return 'قبل الموعد بـ 2 - 5 أيام';
    case 'dining':
      return 'قبل الموعد بـ 24 - 48 ساعة';
    default:
      return 'قبل الموعد بـ 1 - 3 أيام';
  }
}

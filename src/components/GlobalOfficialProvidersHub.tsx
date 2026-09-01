import React, { useState, useMemo } from 'react';
import { 
  Search, Plane, Hotel, Building, Ticket, Compass, 
  ExternalLink, Sparkles, ShieldCheck, CheckCircle2, 
  Car, Train, Wifi, Globe, MapPin, X, ArrowUpRight, Zap
} from 'lucide-react';

export type ProviderCategory = 'all' | 'airlines' | 'hotels' | 'apartments' | 'tours' | 'services';

export interface OfficialProvider {
  id: string;
  name: string;
  nameEn: string;
  category: 'airlines' | 'hotels' | 'apartments' | 'tours' | 'services';
  categoryLabel: string;
  badge: string;
  region: string;
  regionLabel: string;
  logoEmoji: string;
  directUrl: string;
  tagline: string;
  highlights: string[];
  recommendedFor: string;
  imageUrl: string;
}

export const GLOBAL_OFFICIAL_PROVIDERS: OfficialProvider[] = [
  // ================= AIRLINES (خطوط الطيران الرسمية) =================
  {
    id: 'saudia',
    name: 'الخطوط السعودية (Saudia)',
    nameEn: 'Saudia Airlines',
    category: 'airlines',
    categoryLabel: 'طيران رسمي معتمد',
    badge: 'طيران 5 نجوم رسمي',
    region: 'middle_east',
    regionLabel: 'الخليج والشرق الأوسط',
    logoEmoji: '🇸🇦',
    directUrl: 'https://www.saudia.com',
    tagline: 'الناقل الوطني للمملكة العربية السعودية ورحلات الحج والعمرة والوجهات العالمية',
    highlights: ['أفضل أسعار مباشرة', 'بوردنج ووزن أصلي مجاني', 'دخول لصالة الفرسان', 'عضوية SkyTeam'],
    recommendedFor: 'المسافرين للرياض، جدة، المدينة، العلا والرحلات الدولية',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'flynas',
    name: 'طيران ناس (Flynas)',
    nameEn: 'Flynas',
    category: 'airlines',
    categoryLabel: 'طيران اقتصادي رسمي',
    badge: 'أفضل طيران اقتصادي',
    region: 'middle_east',
    regionLabel: 'السعودية والشرق الأوسط',
    logoEmoji: '✈️',
    directUrl: 'https://www.flynas.com',
    tagline: 'الطيران الاقتصادي الرائد في الشرق الأوسط مع عروض مباشرة وأسعار مرنة',
    highlights: ['عروض رحلات داخلية ودولية', 'تحديد مقاعد مرن', 'وجبات مسبقة الحجز'],
    recommendedFor: 'الرحلات الاقتصادية المباشرة بالسعودية وأوروبا وآسيا',
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'emirates',
    name: 'طيران الإمارات (Emirates)',
    nameEn: 'Emirates Airline',
    category: 'airlines',
    categoryLabel: 'طيران فاخر عالمي',
    badge: 'أفضل تجربة درجة أولى ورجال أعمال',
    region: 'global',
    regionLabel: 'عالمي والخليج',
    logoEmoji: '🇦🇪',
    directUrl: 'https://www.emirates.com',
    tagline: 'أكبر مشغل لطائرات A380 وبوينغ 777 مع تغطية شاملة لـ 150+ وجهة حول العالم',
    highlights: ['أفخم أجنحة الدرجة الأولى', 'ترفيه آيس (ice) الرائد عالمياً', 'ربط مباشر عبر دبي'],
    recommendedFor: 'رحلات أوروبا، أمريكا، شرق آسيا، وأستراليا الفاخرة',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'qatar_airways',
    name: 'الخطوط الجوية القطرية (Qatar Airways)',
    nameEn: 'Qatar Airways',
    category: 'airlines',
    categoryLabel: 'طيران 5 نجوم معتمد',
    badge: 'أفضل شركة طيران بالعالم (Skytrax)',
    region: 'global',
    regionLabel: 'عالمي والخليج',
    logoEmoji: '🇶🇦',
    directUrl: 'https://www.qatarairways.com',
    tagline: 'أجنحة Qsuite الحائزة على جوائز عالمية وشبكة وجهات تغطي أكثر من 160 مطاراً',
    highlights: ['أجنحة كيو سويت لرجال الأعمال', 'مطار حمد الدولي الترانزيت الأول', 'عضو تحالف oneworld'],
    recommendedFor: 'رحلات الترانزيت السلسة وأعلى مستويات الضيافة العالمية',
    imageUrl: 'https://images.unsplash.com/photo-1578895101407-742bc53b26c7?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'turkish_airlines',
    name: 'الخطوط الجوية التركية (Turkish Airlines)',
    nameEn: 'Turkish Airlines',
    category: 'airlines',
    categoryLabel: 'طيران عالمي رسمي',
    badge: 'أكثر شركة طيران تغطية للدول',
    region: 'europe_asia',
    regionLabel: 'أوروبا وآسيا والشرق الأوسط',
    logoEmoji: '🇹🇷',
    directUrl: 'https://www.turkishairlines.com',
    tagline: 'تطير إلى دول أكثر من أي شركة طيران أخرى في العالم عبر مركز إسطنبول العالمي',
    highlights: ['وجبات طهاة سماوية رائدة', 'جولة توقف مجانية بإسطنبول Touristanbul', 'عضو تحالف Star Alliance'],
    recommendedFor: 'المسافرين إلى تركيا، شرق وغرب أوروبا، وآسيا الوسطى',
    imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'egyptair',
    name: 'مصر للطيران (EgyptAir)',
    nameEn: 'EgyptAir',
    category: 'airlines',
    categoryLabel: 'طيران وطني معتمد',
    badge: 'أعرق خطوط طيران بالمنطقة',
    region: 'middle_east',
    regionLabel: 'مصر وأفريقيا والشرق الأوسط',
    logoEmoji: '🇪🇬',
    directUrl: 'https://www.egyptair.com',
    tagline: 'رحلات مباشرة إلى القاهرة، الأقصر، أسوان، شرم الشيخ وكبرى العواصم العالمية',
    highlights: ['رحلات داخلية يومية مريحة', 'وزن أمتعة سخي', 'عضو Star Alliance'],
    recommendedFor: 'رحلات مصر الداخلية والخارجية المباشرة',
    imageUrl: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'lufthansa',
    name: 'لوفتهانزا الألمانية (Lufthansa)',
    nameEn: 'Lufthansa Group',
    category: 'airlines',
    categoryLabel: 'طيران أوروبي رسمي',
    badge: 'الناقل الأوروبي الأول',
    region: 'europe',
    regionLabel: 'أوروبا والأمريكتين',
    logoEmoji: '🇩🇪',
    directUrl: 'https://www.lufthansa.com',
    tagline: 'دقة هندسية وربط مباشر عبر فرانكفورت وميونخ لجميع أنحاء القارة الأوروبية',
    highlights: ['شبكة قطارات وسكك حديدية متصلة Rail&Fly', 'صالات سيناتور الفاخرة'],
    recommendedFor: 'السياحة في ألمانيا والنمسا وسويسرا وشمال أوروبا',
    imageUrl: 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'singapore_airlines',
    name: 'الخطوط السنغافورية (Singapore Airlines)',
    nameEn: 'Singapore Airlines',
    category: 'airlines',
    categoryLabel: 'طيران آسيوي 5 نجوم',
    badge: 'قمة الفخامة والخدمة الجوية',
    region: 'asia',
    regionLabel: 'شرق وجنوب شرق آسيا وأستراليا',
    logoEmoji: '🇸🇬',
    directUrl: 'https://www.singaporeair.com',
    tagline: 'أيقونة الطيران الآسيوي مع خدمة لا تضاهى وأفضل مقصورة طيران في العالم',
    highlights: ['مطار شانغي الساحر للترانزيت', 'أفخم مقاعد في درجات السفر', 'أعلى معايير الأمان'],
    recommendedFor: 'الرحلات إلى بالي، سنغافورة، تايلاند، اليابان وأستراليا',
    imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&q=80'
  },

  // ================= HOTELS (سلاسل الفنادق الرسمية) =================
  {
    id: 'marriott',
    name: 'ماريوت بونفوي (Marriott Bonvoy)',
    nameEn: 'Marriott Bonvoy',
    category: 'hotels',
    categoryLabel: 'سلسلة فنادق عالمية',
    badge: '8,500+ فندق حول العالم',
    region: 'global',
    regionLabel: 'عالمي في 139 دولة',
    logoEmoji: '🏨',
    directUrl: 'https://www.marriott.com',
    tagline: 'ريتز كارلتون، سانت ريجيس، دبليو، جي دبليو ماريوت، وشيراتون بأفضل سعر مضمون',
    highlights: ['ضمان أفضل سعر رسمي', 'تسجيل وصول ذكي بالجوال والمفتاح الرقمي', 'نقاط بونفوي المجانية'],
    recommendedFor: 'عشاق الفخامة وخدمات الكونسيرج الملكية والمواقع المركزية',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'hilton',
    name: 'هيلتون أونرز (Hilton Honors)',
    nameEn: 'Hilton Hotels',
    category: 'hotels',
    categoryLabel: 'سلسلة فنادق عالمية',
    badge: 'فنادق ومنتجعات هيلتون الرسمية',
    region: 'global',
    regionLabel: 'عالمي في 120+ دولة',
    logoEmoji: '🌟',
    directUrl: 'https://www.hilton.com',
    tagline: 'والدورف أستوريا، كونراد، هيلتون، ودابل تري مع ترقيات غرف حصرية عبر الموقع الرسمي',
    highlights: ['اختيار رقم الغرفة مسبقاً من الخريطة', 'دخول مجاني للصالات التنفيذية', 'واي فاي مجاني فائق السرعة'],
    recommendedFor: 'العائلات ورجال الأعمال والإقامات القريبة من الحرمين والمطارات',
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'accor',
    name: 'أكور الفندقية (Accor ALL)',
    nameEn: 'Accor Hotels Group',
    category: 'hotels',
    categoryLabel: 'مجموعة الضيافة الأوروبية الأولى',
    badge: 'رافلز، فيرمونت، وسوفيتيل',
    region: 'global',
    regionLabel: 'أوروبا، الشرق الأوسط، والعالم',
    logoEmoji: '⚜️',
    directUrl: 'https://all.accor.com',
    tagline: 'فنادق برج الساعة بمكة المكرمة، فنادق باريس ولندن الفاخرة، ومنتجعات بولمان ونوفوتيل',
    highlights: ['أفضل إطلالات على الكعبة المشرفة', 'خصومات 10% فورية لأعضاء ALL', 'خدمات سبا واستجمام عالمية'],
    recommendedFor: 'زوار مكة والمدينة والمسافرين لفرنسا وأوروبا والمنتجعات',
    imageUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'ihg',
    name: 'مجموعة فنادق إنتركونتيننتال (IHG One Rewards)',
    nameEn: 'IHG Hotels & Resorts',
    category: 'hotels',
    categoryLabel: 'سلسلة فنادق دولية',
    badge: 'إنتركونتيننتال وهوليداي إن',
    region: 'global',
    regionLabel: 'عالمي',
    logoEmoji: '🛎️',
    directUrl: 'https://www.ihg.com',
    tagline: 'فنادق إنتركونتيننتال، سيكس سينسز، كيمبتون، وهوليداي إن العائلية المريحة',
    highlights: ['إقامة مجانية للأطفال في هوليداي إن', 'إفطار مجاني في العديد من الفروع', 'إلغاء مرن حتى يوم الوصول'],
    recommendedFor: 'العائلات مع أطفال ومحبي المنتجعات الصحية الراقية',
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'four_seasons',
    name: 'فنادق فورسيزونز الرسمية (Four Seasons)',
    nameEn: 'Four Seasons Hotels',
    category: 'hotels',
    categoryLabel: 'الضيافة فائقة الفخامة (Ultra-Luxury)',
    badge: 'معيار الرفاهية الأسمى',
    region: 'global',
    regionLabel: 'أفخم مدن ومنتجعات العالم',
    logoEmoji: '👑',
    directUrl: 'https://www.fourseasons.com',
    tagline: 'تجربة ضيافة استثنائية مع كونسيرج خاص، طائرات خاصة، ومطاعم حاصلة على نجوم ميشلان',
    highlights: ['تطبيق كونسيرج ومحادثة فورية 24/7', 'طهاة ميشلان عالميون', 'تجربة وصول خاصة'],
    recommendedFor: 'شهر العسل، كبار الشخصيات، وعشاق الفخامة المطلقة',
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80'
  },

  // ================= APARTMENTS & VILLAS (الشقق السكنية والفلل) =================
  {
    id: 'airbnb_official',
    name: 'إير بي إن بي الرسمي (Airbnb)',
    nameEn: 'Airbnb Official',
    category: 'apartments',
    categoryLabel: 'شقق وفلل سكنية حول العالم',
    badge: 'أكبر منصة شقق وتجارب محلية',
    region: 'global',
    regionLabel: '220+ دولة ومنطقة',
    logoEmoji: '🏡',
    directUrl: 'https://www.airbnb.com',
    tagline: 'شقق سكنية متكاملة، فلل شاطئية مع مسابح خاصة، وبيوت ريفية مع حماية AirCover',
    highlights: ['حماية AirCover الشاملة للضيوف', 'مطبخ كامل وغسالة ملابس للعائلات', 'تقييمات موثقة من نزلاء حقيقيين'],
    recommendedFor: 'العائلات الكبيرة، الإقامات الطويلة، وتجارب الأحياء المحلية',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'vrbo_official',
    name: 'فيربو للفلل السكنية (Vrbo)',
    nameEn: 'Vrbo Vacation Rentals',
    category: 'apartments',
    categoryLabel: 'فلل ومنازل عطلات مستقلة',
    badge: 'منازل كاملة خاصة بالكامل (Entire Homes)',
    region: 'global',
    regionLabel: 'أمريكا، أوروبا، والشرق الأوسط',
    logoEmoji: '🏖️',
    directUrl: 'https://www.vrbo.com',
    tagline: 'منازل عطلات كاملة بدون مشاركة مع المضيف لتوفير خصوصية تامة وراحة مطلقة',
    highlights: ['خصوصية 100% بدون أي مساحات مشتركة', 'مناسبة جداً للعائلات المحافظة', 'مسابح وحدائق خاصة'],
    recommendedFor: 'العائلات التي تبحث عن خصوصية تامة في الريف أو المنتجعات',
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'booking_apartments',
    name: 'شقق بوكينج الفندقية (Booking Homes)',
    nameEn: 'Booking.com Apartments',
    category: 'apartments',
    categoryLabel: 'شقق فندقية مع خدمة استقبال',
    badge: 'تأكيد فوري ودفع عند الوصول',
    region: 'global',
    regionLabel: 'عالمي',
    logoEmoji: '🏢',
    directUrl: 'https://www.booking.com',
    tagline: 'شقق فندقية مجهزة مع خدمة تنظيف واستقبال على مدار الساعة وميزة الإلغاء المجاني',
    highlights: ['إلغاء مجاني لمعظم الشقق', 'دفع عند الوصول متاح', 'برنامج الولاء Genius مع خصومات إضافية'],
    recommendedFor: 'الذين يفضلون الشقق الفندقية مع مرونة الإلغاء والخدمات الفندقية',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80'
  },

  // ================= TOURS & MUSEUMS (الجولات السياحية والمتاحف) =================
  {
    id: 'getyourguide_official',
    name: 'جت يور جايد الرسمي (GetYourGuide)',
    nameEn: 'GetYourGuide Official',
    category: 'tours',
    categoryLabel: 'جولات وتذاكر دخول رسمية',
    badge: 'تخطي طوابير التذاكر (Skip-The-Line)',
    region: 'global',
    regionLabel: '150+ دولة حول العالم',
    logoEmoji: '🎟️',
    directUrl: 'https://www.getyourguide.com',
    tagline: 'تذاكر رسمية للمتاحف والأنشطة والجولات البحرية مع إمكانية الإلغاء المجاني حتى 24 ساعة',
    highlights: ['تذاكر إلكترونية فورية على الجوال', 'تخطي طوابير الانتظار في اللوفر والكولوسيوم', 'مرشدين سياحيين محترفين'],
    recommendedFor: 'حجز تذاكر المتاحف والأنشطة والرحلات اليومية والجولات البحرية',
    imageUrl: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'viator_official',
    name: 'فاياتور الرسمي (Viator by Tripadvisor)',
    nameEn: 'Viator Official',
    category: 'tours',
    categoryLabel: 'أكبر مشغل جولات وتجارب',
    badge: '300,000+ تجربة سياحية معتمدة',
    region: 'global',
    regionLabel: 'عالمي',
    logoEmoji: '🧭',
    directUrl: 'https://www.viator.com',
    tagline: 'رحلات سفاري، مناطيد كابادوكيا، قوارب البوسفور، وجولات خاصة مع سائقين معتمدين',
    highlights: ['حجز الآن والدفع لاحقاً', 'تجارب حصرية للمجموعات الصغيرة', 'تقييمات مفصلة من ملايين المسافرين'],
    recommendedFor: 'الجولات الخاصة، تأجير اليخوت، وسفاري الصحراء والمغامرات الجبلية',
    imageUrl: 'https://images.unsplash.com/photo-1570939274717-7eda259b50ed?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'klook_official',
    name: 'كلوك الرسمي لآسيا وأوروبا (Klook)',
    nameEn: 'Klook Travel',
    category: 'tours',
    categoryLabel: 'تذاكر مدن الملاهي والقطارات السريعة',
    badge: 'الأقوى في آسيا ومدن ديزني ويونيفرسال',
    region: 'asia_europe',
    regionLabel: 'اليابان، تايلاند، سنغافورة، أوروبا',
    logoEmoji: '🎡',
    directUrl: 'https://www.klook.com',
    tagline: 'تذاكر ديزني لاند، يونيفرسال ستوديوز، قطار الشينكانسن باليابان، وبطاقات المواصلات',
    highlights: ['تأكيد فوري بتمرير الباركود QR', 'عروض حصرية على مدن الألعاب الكبرى', 'تذاكر قطارات الرصاصة اليابانية'],
    recommendedFor: 'المسافرين لليابان، كوريا، تايلاند، سنغافورة ومدن الملاهي العالمية',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80'
  },

  // ================= EXTRA SERVICES (المواصلات وشرائح الإنترنت والتأمين) =================
  {
    id: 'allianz_insurance_official',
    name: 'أليانز جلوبال للتأمين (Allianz Assistance)',
    nameEn: 'Allianz Global Assistance',
    category: 'services',
    categoryLabel: 'تأمين سفر وطبي دولي معتمد',
    badge: 'معتمد 100% لتأشيرة شنغن والسفارات الدولية',
    region: 'global',
    regionLabel: 'عالمي في 195 دولة',
    logoEmoji: '🛡️',
    directUrl: 'https://www.allianz-assistance.com',
    tagline: 'التغطية الطبية الأولى عالمياً لحالات الطوارئ، دخول المستشفيات، وإلغاء وتأخر الرحلات',
    highlights: ['تغطية طبية طارئة حتى 1,000,000 يورو', 'وثيقة معتمدة ومقبولة لدى سفارات الشنغن', 'خط طوارئ 24/7 بالعربية'],
    recommendedFor: 'جميع المسافرين لأوروبا وأمريكا والعائلات لضمان أمان طبي شامل',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'airalo_esim',
    name: 'إيرالو لشرائح الإنترنت (Airalo eSIM)',
    nameEn: 'Airalo eSIM',
    category: 'services',
    categoryLabel: 'شرائح إنترنت إلكترونية فورية',
    badge: 'إنترنت فوري بدون تغيير الشريحة',
    region: 'global',
    regionLabel: '200+ دولة حول العالم',
    logoEmoji: '📶',
    directUrl: 'https://www.airalo.com',
    tagline: 'تفعيل باقات إنترنت 5G و 4G فور وصولك للمطار بأسعار تبدأ من 4.5$ بدون فواتير تجوال باهظة',
    highlights: ['تفعيل فوري عبر رمز QR بالهاتف', 'احتفظ برقم واتسابك وبنكك الأصلي', 'شحن رصيد سهل أثناء السفر'],
    recommendedFor: 'جميع المسافرين لضمان بقاء الإنترنت نشطاً فور هبوط الطائرة',
    imageUrl: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'holafly_unlimited_official',
    name: 'هولافلاي للإنترنت اللامحدود (Holafly eSIM)',
    nameEn: 'Holafly eSIM',
    category: 'services',
    categoryLabel: 'بيانات غير محدودة (Unlimited Data)',
    badge: 'إنترنت مفتوح 100% ودعم واتساب 24/7',
    region: 'global',
    regionLabel: '160+ دولة ومنطقة',
    logoEmoji: '⚡',
    directUrl: 'https://esim.holafly.com',
    tagline: 'بيانات إنترنت مفتوحة وغير محدودة دون القلق من استهلاك الجيجابايت أثناء الرحلة',
    highlights: ['إنترنت مفتوح لا ينتهي', 'دعم فني فوري باللغة العربية عبر واتساب', 'توصيل فوري بالإيميل'],
    recommendedFor: 'صناع المحتوى والعائلات ومحبي مشاهدة الفيديو ومكالمات الإنترنت',
    imageUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'welcome_pickups_official_hub',
    name: 'ويلكم بيك ابس للنقل الخاص (Welcome Pickups)',
    nameEn: 'Welcome Pickups',
    category: 'services',
    categoryLabel: 'استقبال وتوصيل خاص بالمطارات',
    badge: 'سائق ينتظرك بالاسم وتتبع الرحلة',
    region: 'global',
    regionLabel: '150+ مطار حول العالم',
    logoEmoji: '🚘',
    directUrl: 'https://www.welcomepickups.com',
    tagline: 'سائق خاص ينتظرك داخل صالة الوصول بلوحة تحمل اسمك مع تتبع مباشر لموعد الطائرة',
    highlights: ['انتظار مجاني 60 دقيقة في المطار', 'تعديل موعد الوصول تلقائياً عند تأخر الطيران', 'سائقون يتحدثون الإنجليزية'],
    recommendedFor: 'العائلات والواصلين في أوقات متأخرة والباحثين عن راحة وسلاسة تامة',
    imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'blacklane_vip_official_hub',
    name: 'بلاك لين ليموزين VIP (Blacklane Chauffeur)',
    nameEn: 'Blacklane VIP Chauffeur',
    category: 'services',
    categoryLabel: 'خدمة سائق ليموزين VIP فاخرة',
    badge: 'مرسيدس وبي إم دبليو وسائقون بالزي الرسمي',
    region: 'global',
    regionLabel: '300+ مدينة في 50 دولة',
    logoEmoji: '👑',
    directUrl: 'https://www.blacklane.com',
    tagline: 'أسطول سيارات مرسيدس وبي إم دبليو الفاخرة وسائقين محترفين لرجال الأعمال والمناسبات',
    highlights: ['سائقون بالزي الرسمي وأعلى معايير الخصوصية', 'مياه وواي فاي مجاني بالسيارة', 'سعر ثابت بدون مفاجآت'],
    recommendedFor: 'كبار الشخصيات، رجال الأعمال، شهر العسل، والانتقال الفاخر بين المدن',
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'priority_pass_official_hub',
    name: 'برايورتي باس لصالات المطار (Priority Pass)',
    nameEn: 'Priority Pass Global Lounges',
    category: 'services',
    categoryLabel: 'صالات كبار الشخصيات والمسار السريع',
    badge: 'دخول 1,500+ صالة VIP في العالم',
    region: 'global',
    regionLabel: '140+ دولة',
    logoEmoji: '🛋️',
    directUrl: 'https://www.prioritypass.com',
    tagline: 'بوفيه طعام ومشروبات مجانية ومناطق استراحة وشاور قبل إقلاع رحلتك وخلال الترانزيت',
    highlights: ['دخول لأي صالة بأي درجة سفر', 'مأكولات ومشروبات مجانية', 'مناطق عمل وشاشات رحلات'],
    recommendedFor: 'المسافرين ذوي فترات الترانزيت الطويلة ورجال الأعمال والعائلات',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'bounce_storage_official_hub',
    name: 'باونس لحفظ الحقائب (Bounce Storage)',
    nameEn: 'Bounce Luggage Storage',
    category: 'services',
    categoryLabel: 'تخزين الأمتعة الآمن بالمدن',
    badge: '10,000+ موقع وتأمين 10,000$',
    region: 'global',
    regionLabel: '1,000+ مدينة سياحية',
    logoEmoji: '🧳',
    directUrl: 'https://usebounce.com',
    tagline: 'احفظ حقائبك بأمان قرب المحطات المركزية والمتاحف وتجول بحرية بدون أمتعة ثقيلة',
    highlights: ['تأمين 10,000$ على كل حقيبة', 'حجز فوري وإلغاء مجاني', 'سعر يبدأ من 5$ لليوم'],
    recommendedFor: 'أيام الوصول المبكر وقبل استلام الغرف بالفندق وبعد تسجيل الخروج',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'rentalcars_sixt',
    name: 'رينتال كارز وسيكست الرسمية (Rentalcars & Sixt)',
    nameEn: 'Rentalcars & Sixt',
    category: 'services',
    categoryLabel: 'تأجير سيارات رسمي من المطار',
    badge: 'استلام مباشر من صالة المطار',
    region: 'global',
    regionLabel: 'عالمي في 160+ دولة',
    logoEmoji: '🚗',
    directUrl: 'https://www.rentalcars.com',
    tagline: 'مقارنة وحجز سيارات الدفع الرباعي والعائلية والسيارات الفاخرة مع تأمين شامل كامل وبدون وديعة',
    highlights: ['استلام وتسليم بصالات الوصول', 'تأمين شامل بدون رسوم خصم', 'كيلومترات مفتوحة لمعظم السيارات'],
    recommendedFor: 'الرحلات الريفية في أوروبا (النمسا، سويسرا، ألمانيا) وأمريكا والخليج',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'trainline_official',
    name: 'ترين لاين للقطارات الأوروبية (Trainline)',
    nameEn: 'Trainline Europe',
    category: 'services',
    categoryLabel: 'حجز قطارات فائقة السرعة',
    badge: 'يوروستار، TGV، إيتالو، رينفي، ودويتشه بان',
    region: 'europe',
    regionLabel: 'بريطانيا وأوروبا بالكامل',
    logoEmoji: '🚄',
    directUrl: 'https://www.thetrainline.com',
    tagline: 'المنصة الرسمية الموحدة لحجز جميع شبكات القطارات السريعة بين المدن والعواصم الأوروبية',
    highlights: ['تذاكر إلكترونية فورية بالتطبيق', 'مقارنة أسعار وتوقيتات جميع مشغلي القطارات', 'تنبيهات فورية بأرصفة القطار'],
    recommendedFor: 'المسافرين بين مدن أوروبا (باريس - لندن - ميلانو - فيينا - برشلونة)',
    imageUrl: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'nusuk_official',
    name: 'منصة نُسك الحكومية الرسمية (Nusuk Official)',
    nameEn: 'Nusuk Platform',
    category: 'services',
    categoryLabel: 'المنصة الحكومية لضيوف الرحمن',
    badge: 'البوابة الرسمية لوزارة الحج والعمرة',
    region: 'middle_east',
    regionLabel: 'المملكة العربية السعودية',
    logoEmoji: '🕋',
    directUrl: 'https://www.nusuk.sa',
    tagline: 'إصدار تصاريح العمرة وزيارة الروضة الشريفة وحجز باقات الحج للمسلمين من جميع أنحاء العالم',
    highlights: ['إصدار تصاريح العمرة والروضة الشريفة مجاناً', 'تأشيرات العمرة السياحية الفورية', 'مرشد رقمي معتمد للمناسك'],
    recommendedFor: 'جميع قاصدي الحرمين الشريفين لأداء مناسك العمرة والحج والصلاة بالروضة',
    imageUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=600&q=80'
  }
];

interface GlobalOfficialProvidersHubProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: ProviderCategory;
}

export const GlobalOfficialProvidersHub: React.FC<GlobalOfficialProvidersHubProps> = ({
  isOpen,
  onClose,
  initialCategory = 'all',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProviderCategory>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'جميع المصادر الرسمية', icon: Globe, count: GLOBAL_OFFICIAL_PROVIDERS.length },
    { id: 'airlines', label: 'خطوط الطيران العالمية', icon: Plane, count: GLOBAL_OFFICIAL_PROVIDERS.filter(p => p.category === 'airlines').length },
    { id: 'hotels', label: 'سلاسل الفنادق الفاخرة', icon: Hotel, count: GLOBAL_OFFICIAL_PROVIDERS.filter(p => p.category === 'hotels').length },
    { id: 'apartments', label: 'الشقق والفلل السكنية', icon: Building, count: GLOBAL_OFFICIAL_PROVIDERS.filter(p => p.category === 'apartments').length },
    { id: 'tours', label: 'الجولات وتذاكر المتاحف', icon: Ticket, count: GLOBAL_OFFICIAL_PROVIDERS.filter(p => p.category === 'tours').length },
    { id: 'services', label: 'القطارات والإنترنت والسيارات', icon: Car, count: GLOBAL_OFFICIAL_PROVIDERS.filter(p => p.category === 'services').length },
  ];

  const filteredProviders = useMemo(() => {
    return GLOBAL_OFFICIAL_PROVIDERS.filter((provider) => {
      const matchesCategory = selectedCategory === 'all' || provider.category === selectedCategory;
      const matchesQuery = searchQuery.trim() === '' || 
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase())) ||
        provider.recommendedFor.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRegion = selectedRegion === 'all' || 
        provider.region === selectedRegion || 
        provider.region === 'global';

      return matchesCategory && matchesQuery && matchesRegion;
    });
  }, [selectedCategory, searchQuery, selectedRegion]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-amber-400/30 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-right">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-white/10 p-5 sm:p-6 flex items-center justify-between gap-4">
          <button 
            onClick={onClose}
            type="button"
            className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2 justify-end">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-black flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>روابط رسمية 100% بدون وسطاء</span>
                </span>
                <h2 className="text-lg sm:text-2xl font-black text-white">دليل المصادر ومواقع الحجز الرسمية في العالم</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                تصفح واحجز مباشرة من المواقع الرسمية لخطوط الطيران، سلاسل الفنادق، الشقق والفلل، الجولات، والمواصلات بأقل سعر أصلي
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 flex-shrink-0">
              <Compass className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 sm:p-5 bg-slate-950/60 border-b border-white/10 space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن شركة طيران (السعودية، الإمارات، لوفتهانزا)، فندق (ماريوت، هيلتون)، أو خدمة..."
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl pr-12 pl-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as ProviderCategory)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-black'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-700 text-slate-300'}`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Providers Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>تم العثور على <strong className="text-amber-400 font-bold">{filteredProviders.length}</strong> مزود رسمي معتمد</span>
            <span>اضغط على أي مزود للفتح المباشر للموقع الرسمي مع ضمان السعر الأصلي</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProviders.map((provider) => (
              <div 
                key={provider.id}
                className="bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-400/50 rounded-2xl p-4 sm:p-5 transition-all flex flex-col justify-between group shadow-lg hover:shadow-amber-500/10"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 font-semibold flex items-center gap-1.5">
                      <span className="text-base">{provider.logoEmoji}</span>
                      <span>{provider.categoryLabel}</span>
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                      {provider.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-2.5">
                    <img 
                      src={provider.imageUrl} 
                      alt={provider.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700 group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h3 className="text-base font-black text-white group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                        <span>{provider.name}</span>
                      </h3>
                      <p className="text-xs text-slate-400 font-mono">{provider.nameEn}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {provider.tagline}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {provider.highlights.map((h, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900/80 text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                        <span>{h}</span>
                      </span>
                    ))}
                  </div>

                  <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-xl border border-slate-800 mb-4">
                    <strong className="text-slate-300">مناسب لـ:</strong> {provider.recommendedFor}
                  </div>
                </div>

                <a
                  href={provider.directUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <span>زيارة الموقع الرسمي وإتمام الحجز المباشر</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>

          {filteredProviders.length === 0 && (
            <div className="text-center py-12 space-y-3 bg-slate-950/40 rounded-2xl border border-slate-800">
              <div className="text-4xl">🔍</div>
              <h3 className="text-base font-bold text-white">لم يتم العثور على مزود يطابق بحثك</h3>
              <p className="text-xs text-slate-400">جرب كتابة اسم شركة طيران أخرى أو تغيير تصنيف البحث أعلاه</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="px-4 py-2 rounded-xl bg-slate-800 text-amber-300 text-xs font-bold hover:bg-slate-700 cursor-pointer"
              >
                إعادة ضبط الفلاتر
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 p-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <Zap className="w-4 h-4" />
            <span>نظام التحويل الرسمي المباشر يضمن لك أسعار الشركة بدون أي عمولات وسيط</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
          >
            إغلاق الدليل
          </button>
        </div>

      </div>
    </div>
  );
};

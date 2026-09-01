export interface ExtraTravelServiceItem {
  id: string;
  category: 'insurance' | 'esim' | 'transfers' | 'lounges' | 'luggage' | 'trains_passes' | 'medical_telehealth';
  categoryLabel: string;
  categoryIcon: string;
  providerName: string;
  providerNameEn: string;
  officialUrl: string;
  badge: string;
  rating: number;
  reviewsCount: string;
  startingPrice: string;
  tagline: string;
  summary: string;
  features: string[];
  tipsForTraveler: string;
  coverageCountries: string;
  emergencyContactOrHotline?: string;
  recommendedFor: string;
  imageUrl: string;
}

export const EXTRA_TRAVEL_SERVICES_DATABASE: ExtraTravelServiceItem[] = [
  // =========================================================================
  // 1. TRAVEL & MEDICAL INSURANCE (تأمين السفر والتأمين الطبي الدولي)
  // =========================================================================
  {
    id: 'allianz_global_assistance',
    category: 'insurance',
    categoryLabel: 'تأمين سفر وطبي دولي',
    categoryIcon: '🛡️',
    providerName: 'أليانز جلوبال (Allianz Global Assistance)',
    providerNameEn: 'Allianz Travel Insurance',
    officialUrl: 'https://www.allianz-assistance.com',
    badge: 'معتمد 100% لتأشيرة شنغن والسفارات الدولية',
    rating: 4.9,
    reviewsCount: '2.4M+ وثيقة سنوياً',
    startingPrice: 'تبدأ من 15$ للرحلة',
    tagline: 'التغطية الطبية الأولى عالمياً لحالات الطوارئ، دخول المستشفيات، وإلغاء الرحلات',
    summary: 'وثيقة تأمين سفر شاملة متوافقة مع اشتراطات تأشيرة شنغن وتأشيرات دول أوروبا وأمريكا وآسيا، تغطي نفقات العلاج في أرقى المستشفيات الخاصة والإخلاء الطبي والتعويض عن فقدان الحقائب.',
    features: [
      'تغطية المصاريف الطبية الطارئة حتى 1,000,000 يورو',
      'وثيقة معتمدة ومقبولة لدى جميع سفارات دول الشنغن وبريطانيا وأمريكا',
      'تعويض فوري عند إلغاء أو تأخر رحلات الطيران وفقدان الأمتعة',
      'تغطية تكاليف الإخلاء الطبي الجوي في الحالات الحرجة',
      'دعم طوارئ 24/7 بعدة لغات بما فيها اللغة العربية',
    ],
    tipsForTraveler: 'احفظ وثيقة التأمين بصيغة PDF على هاتفك، واحتفظ برقم بوليصة التأمين وخط الطوارئ المباشر للاتصال الفوري عند الحاجة.',
    coverageCountries: 'عالمي في أكثر من 195 دولة',
    emergencyContactOrHotline: '+1 (800) 284-8300 / +33 1 42 99 02 02',
    recommendedFor: 'المسافرين لأوروبا، أمريكا، العائلات، والراغبين في راحة بال وأمان طبي كامل',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'axa_travel_insurance',
    category: 'insurance',
    categoryLabel: 'تأمين طبي وسياحي معتمد',
    categoryIcon: '🏥',
    providerName: 'أكسا العالمية للتأمين (AXA Assistance)',
    providerNameEn: 'AXA Travel Insurance',
    officialUrl: 'https://www.axatravelinsurance.com',
    badge: 'شبكة مستشفيات دولية كبرى ومطالبات فورية',
    rating: 4.8,
    reviewsCount: '1.8M+ عميل نشط',
    startingPrice: 'تبدأ من 12$ للرحلة',
    tagline: 'حماية صحية ومصرفية متكاملة لجميع أفراد الأسرة أثناء السفر الخارجي',
    summary: 'تأمين أكسا المعتمد دولياً يوفر حماية فورية من الحوادث المفاجئة، النزلات المعوية، التكاليف الجراحية، وإلغاء حجوزات الفنادق لأسباب قاهرة مع تطبيق ذكي لمتابعة المطالبات.',
    features: [
      'تغطية طبية بدون نسبة تحمل (Zero Deductible)',
      'إصدار فوري للشهادة التأمينية باللغة الإنجليزية في دقيقة واحدة',
      'تغطية مصاريف مرافقة أحد أفراد العائلة في المستشفى',
      'تعويض مالي عن فقدان جواز السفر والوثائق الثبوتية',
    ],
    tipsForTraveler: 'في حال زيارة أي طبيب أو مستشفى في الخارج، اطلب دائماً تقريراً طبياً مفصلاً وفاتورة مختومة لتسريع صرف التعويض.',
    coverageCountries: 'جميع دول العالم بلا استثناء',
    emergencyContactOrHotline: '+44 20 8603 9800',
    recommendedFor: 'المسافرين الأفراد والعائلات، ومقدمي طلبات التأشيرات الأوروبية',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'safetywing_nomad_insurance',
    category: 'insurance',
    categoryLabel: 'تأمين المسافرين والرحالة الرقميين',
    categoryIcon: '🌍',
    providerName: 'سيفيتي وينج (SafetyWing Nomad Insurance)',
    providerNameEn: 'SafetyWing Insurance',
    officialUrl: 'https://safetywing.com',
    badge: 'اشتراك شهري مرن يغطي 180+ دولة',
    rating: 4.8,
    reviewsCount: '500K+ رحالة ومسافر',
    startingPrice: '45$ شهرياً (تجديد مرن)',
    tagline: 'التأمين الطبي الأكثر مرونة للرحلات الطويلة والمسافرين الدائمين والعمل عن بُعد',
    summary: 'تغطية طبية شاملة وحوادث سفر تعمل بنظام الاشتراك الشهري المرن الذي يمكن تفعيله وإيقافه في أي وقت حتى لو كنت بالفعل خارج بلدك.',
    features: [
      'تغطية طبية حتى 250,000$ تشمل الحوادث والأمراض المفاجئة',
      'إمكانية شراء التأمين بعد السفر وبدء الرحلة بالفعل',
      'تغطية أطفال مجانية (طفل واحد لكل شخص بالغ مؤمن عليه)',
      'تغطية تأخير الرحلات وفقدان الأمتعة المشحونة',
    ],
    tipsForTraveler: 'الخيار الأفضل للرحلات المتعددة الدول أو الإقامات التي تمتد لأسابيع وأشهر بدون الحاجة لشراء وثيقة منفصلة لكل دولة.',
    coverageCountries: '180+ دولة حول العالم',
    emergencyContactOrHotline: 'دعم فوري عبر الدردشة 24/7 بالتطبيق',
    recommendedFor: 'أصحاب الرحلات الطويلة، صانعي المحتوى، والرحالة الرقميين والعائلات',
    imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'bupa_global_travel',
    category: 'medical_telehealth',
    categoryLabel: 'الرعاية الصحية فائقة الفخامة',
    categoryIcon: '🩺',
    providerName: 'بوبا العالمية (Bupa Global Health)',
    providerNameEn: 'Bupa Global',
    officialUrl: 'https://www.bupaglobal.com',
    badge: 'رعاية صحية خاصة في أرقى مستشفيات العالم',
    rating: 4.9,
    reviewsCount: '1.2M+ عضو عالمي',
    startingPrice: 'حسب الباقة والوجهة',
    tagline: 'وصول مباشر لأفضل الأطباء والاستشاريين والمستشفيات الخاصة حول العالم',
    summary: 'منظومة رعاية صحية عالمية توفر دخولاً مباشراً لأرقى المراكز الطبية دون الحاجة لانتظار الموافقات، مع خط ساخن لاستشارات أطباء استشاريين على مدار الساعة.',
    features: [
      'وصول مباشر لشبكة تضم أكثر من 1.7 مليون مقدم رعاية صحية',
      'تغطية شاملة للإقامة في غرف المستشفيات الخاصة الفاخرة',
      'استشارات طبية عن بُعد عبر الفيديو مع استشاريين عالميين',
      'فريق طبي مخصص لتنسيق الإخلاء والإعادة الطبية للوطن',
    ],
    tipsForTraveler: 'تطبيق Bupa Global يسمح لك بالبحث عن أقرب طبيب أو مستشفى ناطق بلغتك وإظهار بطاقة العضوية الرقمية فوراً.',
    coverageCountries: 'أكثر من 190 دولة',
    emergencyContactOrHotline: '+44 (0) 1273 208181',
    recommendedFor: 'كبار الشخصيات، الإقامات العلاجية، والعائلات الباحثة عن أرقى مستويات الرعاية',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80'
  },

  // =========================================================================
  // 2. ESIM & PORTABLE INTERNET (شرائح الإنترنت الإلكترونية والراوتر المتنقل)
  // =========================================================================
  {
    id: 'airalo_esim_official',
    category: 'esim',
    categoryLabel: 'شرائح إنترنت إلكترونية (eSIM)',
    categoryIcon: '📶',
    providerName: 'إيرالو (Airalo eSIM)',
    providerNameEn: 'Airalo eSIM Global',
    officialUrl: 'https://www.airalo.com',
    badge: 'المتجر الإلكتروني الأول لشرائح eSIM في العالم',
    rating: 4.9,
    reviewsCount: '10M+ عملية تحميل',
    startingPrice: 'تبدأ من 4.50$ (1GB - 20GB)',
    tagline: 'إنترنت 5G/4G فوري في أكثر من 200 دولة بدون تغيير شريحتك الأصلية',
    summary: 'شريحة رقمية إلكترونية تُثبت في ثوانٍ عبر مسح رمز QR أو تطبيق الجوال قبل سفرك، لتبدأ باستخدام الإنترنت عالي السرعة فور هبوط الطائرة مباشرة مع الحفاظ على رقمك للواتساب والرسائل البنكية.',
    features: [
      'تغطية شبكات 5G و 4G فائقة السرعة مع أكبر مشغلي الاتصالات المحليين',
      'تفعيل فوري بمسح رمز QR في أقل من دقيقة واحدة',
      'الحفاظ على شريحتك ورقمك الأصلي لاستقبال رسائل OTP البنكية والواتساب',
      'باقات محلية لكل دولة، باقات إقليمية (مثل أوروبا وآسيا)، وباقات عالمية',
      'إمكانية إعادة شحن الرصيد ومتابعة استهلاك البيانات بضغطة زر',
    ],
    tipsForTraveler: 'اشترِ الشريحة وثبتها عبر الواي فاي في منزلك قبل السفر، وبمجرد هبوط الطائرة في وجهتك، فعّل خط الـ eSIM وتجوال البيانات (Data Roaming) للاتصال الفوري.',
    coverageCountries: 'أكثر من 200 دولة ومنطقة',
    recommendedFor: 'جميع المسافرين دون استثناء لضمان بقاء الإنترنت نشطاً للملاحة والتواصل',
    imageUrl: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'holafly_unlimited_esim',
    category: 'esim',
    categoryLabel: 'إنترنت لا محدود في الخارج',
    categoryIcon: '⚡',
    providerName: 'هولافلاي (Holafly Unlimited eSIM)',
    providerNameEn: 'Holafly eSIM',
    officialUrl: 'https://esim.holafly.com',
    badge: 'باقات إنترنت مفتوح وغير محدود (Unlimited Data)',
    rating: 4.8,
    reviewsCount: '3M+ مسافر راضٍ',
    startingPrice: 'تبدأ من 19$ (بيانات غير محدودة)',
    tagline: 'بيانات إنترنت غير محدودة مع دعم فني 24/7 عبر واتساب',
    summary: 'الحل المثالي لمن لا يرغب في القلق بشأن انتهاء الجيجابايت أثناء مشاهدة الفيديوهات، البث المباشر، أو العمل عن بُعد، مع باقات إنترنت غير محدود لمدة 1 إلى 90 يوماً.',
    features: [
      'بيانات إنترنت غير محدودة بالكامل طوال مدة الرحلة',
      'دعم فني مباشر على مدار الساعة عبر واتساب والدردشة باللغة العربية',
      'شريحة رقمية تُرسل فوراً إلى بريدك الإلكتروني بعد الدفع',
      'تغطية ممتازة في أوروبا، أمريكا، اليابان، تركيا، ودول آسيا',
    ],
    tipsForTraveler: 'مثالية للمسافرين الذين يشاركون يومياتهم على السوشيال ميديا أو يشاهدون مقاطع الفيديو ويعملون عبر مكالمات الفيديو Zoom.',
    coverageCountries: 'أكثر من 160 وجهة سياحية',
    recommendedFor: 'صناع المحتوى، العائلات، والباحثين عن إنترنت مفتوح بدون قيود',
    imageUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'nomad_esim_app',
    category: 'esim',
    categoryLabel: 'باقات بيانات مرنة واقتصادية',
    categoryIcon: '📱',
    providerName: 'نوماد (Nomad eSIM)',
    providerNameEn: 'Nomad eSIM App',
    officialUrl: 'https://www.getnomad.app',
    badge: 'أسعار اقتصادية وباقات بيانات إقليمية متعددة',
    rating: 4.7,
    reviewsCount: '1.5M+ مستخدم',
    startingPrice: 'تبدأ من 4$ (باقات مخصصة)',
    tagline: 'تطبيق سهل وسريع لشراء باقات الإنترنت في 170+ دولة بأسعار تنافسية',
    summary: 'يوفر تطبيق Nomad تجربة مستخدم سلسلة لشراء وإدارة شرائح الإنترنت الإلكترونية مع تنبيهات فورية عند اقتراب استهلاك الباقة.',
    features: [
      'سرعات إنترنت مستقرة وموثوقة بالشراكة مع كبرى شركات الاتصالات',
      'تثبيت مباشر بنقرة واحدة على أجهزة iOS وأندرويد الحديثة',
      'عروض وتخفيضات مستمرة للباقات الإقليمية المشتركة',
    ],
    tipsForTraveler: 'تأكد من أن هاتفك يدعم تقنية eSIM (جميع أجهزة آيفون الحديثة وسامسونج وجوجل بيكسل) وغير مقفل على شبكة واحدة.',
    coverageCountries: '170+ دولة حول العالم',
    recommendedFor: 'المسافرين الباحثين عن أقل تكلفة وأسهل تجربة إدارة للبيانات',
    imageUrl: 'https://images.unsplash.com/photo-1557180295-76eee20ae8aa?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'solis_pocket_wifi',
    category: 'esim',
    categoryLabel: 'جهاز راوتر واي فاي متنقل (Pocket Wi-Fi)',
    categoryIcon: '📟',
    providerName: 'سوليس (Solis Pocket Wi-Fi Router)',
    providerNameEn: 'Solis Global Wi-Fi Hotspot',
    officialUrl: 'https://soliswifi.co',
    badge: 'اتصال لـ 10 أجهزة معاً مع بنك طاقة مدمج',
    rating: 4.8,
    reviewsCount: '800K+ جهاز مفعّل',
    startingPrice: 'إيجار أو شراء مع باقات يومية',
    tagline: 'راوتر محمول بحجم الجيب يوزع واي فاي مشفر لجميع هواتف ولابتوبات العائلة',
    summary: 'جهاز راوتر صغير الحجم يعمل في 135+ دولة بتقنية الشريحة الافتراضية، يتيح لجميع أفراد الأسرة الاتصال بشبكة واي فاي واحدة في نفس الوقت دون الحاجة لشراء شرائح منفصلة لكل فرد.',
    features: [
      'ربط حتى 10 أجهزة (هواتف، أجهزة لوحية، لابتوب) بشبكة واحدة',
      'بنك طاقة (Power Bank) مدمج لشحن هاتفك أثناء التنقل',
      'أمان وتشفير كامل يحميك من مخاطر شبكات الواي فاي العامة المفتوحة',
      'بطارية تدوم لأكثر من 16 ساعة من الاستخدام المتواصل',
    ],
    tipsForTraveler: 'الحل الأوفر والأسهل للعائلات الكبيرة والمجموعات، حيث يدفع الجميع لاشتراك جهاز واحد فقط.',
    coverageCountries: '135+ دولة في أمريكا وأوروبا وآسيا والشرق الأوسط',
    recommendedFor: 'العائلات الكبيرة، رحلات العمل الجماعية، وأصحاب الأجهزة المتعددة',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
  },

  // =========================================================================
  // 3. PRIVATE TRANSFERS & CHAUFFEUR (النقل الخاص وتوصيل المطارات الفاخر)
  // =========================================================================
  {
    id: 'welcome_pickups_official',
    category: 'transfers',
    categoryLabel: 'استقبال وتوصيل خاص بالمطارات',
    categoryIcon: '🚘',
    providerName: 'ويلكم بيك ابس (Welcome Pickups)',
    providerNameEn: 'Welcome Pickups Airport Transfers',
    officialUrl: 'https://www.welcomepickups.com',
    badge: 'سائق خاص ينتظرك بالاسم وتتبع لموعد الطائرة',
    rating: 4.9,
    reviewsCount: '1.5M+ رحلة ناجحة',
    startingPrice: 'أسعار ثابتة ومنافسة لسيارات الأجرة',
    tagline: 'استقبال شخصي داخل صالة الوصول مع سائقين مدربين ومركبات مريحة ونظيفة',
    summary: 'خدمة التوصيل من وإلى المطارات الرائدة عالمياً. ينتظرك سائقك الودود داخل صالة الوصول بلوحة تحمل اسمك، ويتابع مواعيد رحلتك لتعديل موعد الوصول تلقائياً في حال تأخرت الطائرة.',
    features: [
      'انتظار مجاني لمدة 60 دقيقة في المطار دون أي رسوم إضافية',
      'تتبع مباشر لموعد الرحلة عبر رقم الرحلة الجوية',
      'سائقون يتحدثون الإنجليزية بطلاقة ومستعدون لإرشادك للمدينة ومساعدتك في الحقائب',
      'مركبات حديثة ومكيفة مع توفير مقاعد أطفال معتمدة عند الطلب',
      'إلغاء مجاني حتى 24 ساعة قبل موعد الرحلة',
    ],
    tipsForTraveler: 'سيرسل لك التطبيق صورة واسم ورقم سائقك قبل وصولك بساعات مع إمكانية التواصل معه عبر واتساب للتنسيق.',
    coverageCountries: 'أكثر من 150 وجهة ومطاراً حول العالم',
    recommendedFor: 'العائلات مع أطفال وكبار السن، الواصلين ليلاً، والباحثين عن وصول سلس ومباشر للفندق',
    imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'blacklane_vip_chauffeur',
    category: 'transfers',
    categoryLabel: 'خدمة سائق ليموزين VIP فاخرة',
    categoryIcon: '👑',
    providerName: 'بلاك لين (Blacklane VIP Chauffeur)',
    providerNameEn: 'Blacklane Chauffeur Services',
    officialUrl: 'https://www.blacklane.com',
    badge: 'أسطول سيارات مرسيدس وبي إم دبليو وسائقون بالزي الرسمي',
    rating: 4.9,
    reviewsCount: '900K+ عميل راقٍ',
    startingPrice: 'تسعير متميز شامل لجميع الرسوم',
    tagline: 'قمة الفخامة والخصوصية لرحلات الأعمال والمناسبات الخاصة والنقل الراقي',
    summary: 'خدمة السائق الخاص الأولى لرجال الأعمال وكبار الشخصيات بأسطول من أفخم سيارات مرسيدس إس كلاس، بي إم دبليو الفئة السابعة، ومرسيدس V-Class العائلية الفسيحة.',
    features: [
      'سائقون محترفون بالزي الرسمي مع أعلى معايير الخصوصية والأمان',
      'سيارات فارهة مجهزة بالمياه النقية وواي فاي وشواحن الهواتف',
      'سعر شامل وثابت لا يتأثر بازدحام المرور أو وقت الذروة',
      'خدمة حجز بالساعة أو للرحلات بين المدن والعواصم',
    ],
    tipsForTraveler: 'مثالية للاجتماعات الرسمية، زوار المؤتمرات، شهر العسل، والانتقال بين المدن الأوروبية بأقصى درجات الرفاهية.',
    coverageCountries: 'أكثر من 300 مدينة في 50+ دولة',
    recommendedFor: 'كبار الشخصيات، رحلات العمل الفاخرة، وشهر العسل',
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sixt_car_rental_protection',
    category: 'transfers',
    categoryLabel: 'تأجير سيارات رسمي من المطار',
    categoryIcon: '🚗',
    providerName: 'سيكست & رينتال كارز (Sixt & Rentalcars)',
    providerNameEn: 'Sixt & Rentalcars Worldwide',
    officialUrl: 'https://www.rentalcars.com',
    badge: 'استلام فوري من المطار مع تأمين شامل 0% تحمل',
    rating: 4.8,
    reviewsCount: '8M+ حجز سيارة',
    startingPrice: 'مقارنة أفضل عروض التأجير اليومية',
    tagline: 'أكبر منصة لمقارنة وتأجير سيارات الدفع الرباعي والعائلية بأمان وموثوقية',
    summary: 'مقارنة فورية بين كبرى شركات التأجير العالمية (Sixt, Hertz, Europcar, Avis, Budget) مع خيارات التأمين الشامل بالكامل بدون نسبة اقتطاع عند الحوادث.',
    features: [
      'استلام وتسليم السيارة من مكاتب صالات الوصول بالمطارات مباشرة',
      'تأمين شامل بالكامل (Full Protection) يغطي الزجاج والإطارات والهيكل',
      'كيلومترات غير محدودة لمعظم الوجهات في أوروبا وأمريكا',
      'إلغاء مجاني حتى 48 ساعة قبل موعد الاستلام مع استرداد كامل',
    ],
    tipsForTraveler: 'تأكد من إحضار رخصة القيادة المحلية والرخصة الدولية (IDP) مع بطاقة ائتمان (Credit Card) تحمل نفس اسم السائق الرئيسي.',
    coverageCountries: '160+ دولة حول العالم',
    recommendedFor: 'محبي الرحلات البرية والريف الأوروبي وجبال الألب والمسافات الطويلة',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
  },

  // =========================================================================
  // 4. AIRPORT VIP LOUNGES & FAST TRACK (صالات المطار والمسار السريع)
  // =========================================================================
  {
    id: 'priority_pass_official',
    category: 'lounges',
    categoryLabel: 'صالات المطار الفاخرة والمسار السريع',
    categoryIcon: '🛋️',
    providerName: 'برايورتي باس (Priority Pass)',
    providerNameEn: 'Priority Pass Global',
    officialUrl: 'https://www.prioritypass.com',
    badge: 'دخول أكثر من 1,500 صالة VIP في مطارات 140+ دولة',
    rating: 4.8,
    reviewsCount: '30M+ مسافر سنوياً',
    startingPrice: 'عضويات سنوية أو دخول للزيارة الواحدة',
    tagline: 'استمتع بالهدوء والمأكولات والمشروبات المجانية والواي فاي السريع قبل إقلاع رحلتك',
    summary: 'برنامج صالات المطارات الأول في العالم الذي يتيح لك تحويل ساعات الانتظار في المطار والترانزيت إلى تجربة استرخاء ممتعة مع بوفيه طعام فاخر ومناطق عمل واستحمام.',
    features: [
      'دخول صالات VIP بغض النظر عن درجة تذكرتك أو شركة الطيران التي تسافر معها',
      'بوفيه مأكولات ومشروبات ساخنة وباردة مجاناً بالكامل',
      'مناطق عمل هادئة مجهزة بمقابس الشحن وواي فاي فائق السرعة',
      'مرافق استحمام (Shower Rooms) ومناطق استرخاء وشاشات لمتابعة الرحلات',
      'خصومات حصرية في مطاعم وسبا ومتاجر المطارات الكبرى',
    ],
    tipsForTraveler: 'العديد من البطاقات البنكية المتميزة (Visa Signature/Infinite وMastercard World) تمنحك دخولاً مجانياً عبر LoungeKey المرتبط بـ Priority Pass.',
    coverageCountries: 'أكثر من 140 دولة و600 مدينة',
    recommendedFor: 'المسافرين ذوي الرحلات الطويلة ومحطات الترانزيت والعائلات ورجال الأعمال',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'dragonpass_global_lounge',
    category: 'lounges',
    categoryLabel: 'صالات المطار وتخطي طوابير الجوازات (Fast Track)',
    categoryIcon: '⚡',
    providerName: 'دراجون باس (DragonPass & Fast Track)',
    providerNameEn: 'DragonPass Airport Services',
    officialUrl: 'https://en.dragonpass.com.cn',
    badge: 'خدمات المسار السريع وتخطي طوابير التفتيش والجوازات',
    rating: 4.7,
    reviewsCount: '15M+ مستخدم',
    startingPrice: 'باقات دخول مرنة',
    tagline: 'تخطي زحام التفتيش الأمني والجوازات والوصول إلى بوابتك بأسرع وقت ممكن',
    summary: 'منظومة متكاملة لخدمات المطارات توفر تصاريح Fast Track لتخطي طوابير التدقيق الأمني والجوازات، بالإضافة لشبكة صالات ضخمة وخصومات مطاعم المطارات.',
    features: [
      'تخطي طوابير التفتيش الأمني والجوازات عبر مسار Fast Track المخصص',
      'دخول صالات كبار الشخصيات مع وجبات طعام متميزة',
      'خدمات الاستقبال والمرافقة بالمطار (Meet & Greet)',
    ],
    tipsForTraveler: 'خدمة Fast Track توفر ما يصل إلى 45 دقيقة في أوقات الذروة والمواسم السياحية المزدحمة في المطارات الأوروبية الكبرى.',
    coverageCountries: 'مطارات أوروبا وآسيا والشرق الأوسط',
    recommendedFor: 'المسافرين المتعجلين، أصحاب الرحلات الصباحية المبكرة، والعائلات',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80'
  },

  // =========================================================================
  // 5. LUGGAGE STORAGE & BAGGAGE SERVICES (تخزين الأمتعة ونقل الحقائب)
  // =========================================================================
  {
    id: 'bounce_luggage_official',
    category: 'luggage',
    categoryLabel: 'تخزين الحقائب والأمتعة الآمن',
    categoryIcon: '🧳',
    providerName: 'باونس لتخزين الأمتعة (Bounce Luggage Storage)',
    providerNameEn: 'Bounce Luggage Storage',
    officialUrl: 'https://usebounce.com',
    badge: 'أكثر من 10,000 موقع آمن لحفظ الحقائب مع تأمين 10,000$',
    rating: 4.9,
    reviewsCount: '2M+ حقيبة محفوظة',
    startingPrice: 'تبدأ من 5$ لليوم الواحد',
    tagline: 'احفظ حقائبك بأمان قرب محطات القطار والمعالم السياحية وتجول بحرية وخفة',
    summary: 'تخلص من عناء سحب الحقائب الثقيلة قبل موعد تسجيل الدخول بالفندق أو بعد تسجيل الخروج، واحفظها في فنادق ومتاجر معتمدة ومؤمنة في قلب المدن الكبرى.',
    features: [
      'ضمان وتأمين Bounce Shield بقيمة 10,000$ على كل حقيبة محفوظة',
      'مواقع استراتيجية بجوار محطات المترو والقطارات المركزية والمتاحف',
      'حجز وإلغاء فوري مجاناً عبر تطبيق الجوال برمز QR للأمان',
      'لا توجد قيود على حجم أو وزن الحقيبة (سعر موحد لجميع الأحجام)',
    ],
    tipsForTraveler: 'إذا وصلت صباحاً وفندقك لا يتيح الدخول إلا الساعة 3 عصراً، ضع حقائبك في أقرب نقطة باونس واستمتع بيومك من اللحظة الأولى.',
    coverageCountries: 'أكثر من 1,000 مدينة في أوروبا وأمريكا وآسيا والشرق الأوسط',
    recommendedFor: 'المسافرين في الأيام الأولى والأخيرة من الرحلة والمهتمين بالاستفادة من كل دقيقة',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sendmybag_delivery',
    category: 'luggage',
    categoryLabel: 'شحن الأمتعة من الباب إلى الفندق',
    categoryIcon: '📦',
    providerName: 'سِند ماي باج (Send My Bag)',
    providerNameEn: 'Send My Bag Door to Door',
    officialUrl: 'https://www.sendmybag.com',
    badge: 'شحن الحقائب والأدوات الرياضية مباشرة إلى فندقك',
    rating: 4.8,
    reviewsCount: '500K+ شحنة دولية',
    startingPrice: 'تسعير مباشر حسب الوزن والمسار',
    tagline: 'سافر بخفة ودع حقائبك ومعدات التزلج أو الجولف تصل قبلك إلى الفندق',
    summary: 'خدمة شحن أمتعة دولية تستلم حقائبك من باب منزلك وتسلمها إلى فندقك في وجهتك السياحية، لتتجنب طوابير وزن الأمتعة ورسوم الوزن الزائد الباهظة لدى شركات الطيران.',
    features: [
      'توصيل من الباب إلى الباب عبر كبرى شركات الشحن العالمية (DHL/FedEx)',
      'تتبع مباشر بالأقمار الصناعية خطوة بخطوة لموقع حقيبتك',
      'مثالية لمعدات التزلج وأكياس الجولف والدراجات والأمتعة الثقيلة',
    ],
    tipsForTraveler: 'رائعة للإقامات الطويلة، الطلاب، والمسافرين الرياضيين لتوفر عناء سحب الأمتعة الضخمة في المطارات والقطارات.',
    coverageCountries: 'أكثر من 100 دولة حول العالم',
    recommendedFor: 'محبي الرياضات الشتوية، لاعبي الجولف، والعائلات ذات الأمتعة الكثيرة',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80'
  },

  // =========================================================================
  // 6. TRAIN PASSES & UNIFIED TICKETING (القطارات والبطاقات السياحية الموحدة)
  // =========================================================================
  {
    id: 'trainline_europe_official',
    category: 'trains_passes',
    categoryLabel: 'تذاكر القطارات السريعة في أوروبا',
    categoryIcon: '🚄',
    providerName: 'ترين لاين الأوروبية (Trainline Europe)',
    providerNameEn: 'Trainline Rail & Coach',
    officialUrl: 'https://www.thetrainline.com',
    badge: 'المنصة الموحدة لجميع قطارات يوروستار، TGV، إيتالو، ودويتشه بان',
    rating: 4.9,
    reviewsCount: '45M+ تذكرة سنوياً',
    startingPrice: 'أفضل أسعار المشغلين المباشرة',
    tagline: 'مقارنة وحجز تذاكر القطارات فائقة السرعة بين جميع المدن والعواصم الأوروبية',
    summary: 'المنصة الرسمية المعتمدة لحجز تذاكر شبكات السكك الحديدية الأوروبية في بريطانيا، فرنسا، إيطاليا، إسبانيا، ألمانيا، وسويسرا بتذاكر إلكترونية فورية على الجوال.',
    features: [
      'مقارنة أسعار ومواعيد جميع شركات القطارات في شاشة واحدة',
      'تذاكر إلكترونية (E-Tickets) تُحفظ في Apple Wallet أو تطبيق الجوال',
      'تنبيهات فورية بأرقام أرصفة القطارات ومواعيد التأخير في المحطات',
      'إمكانية حجز المقاعد الفردية والعائلية وطاولات العمل مع مقابس الشحن',
    ],
    tipsForTraveler: 'حجز تذاكر القطارات السريعة (مثل يوروستار وTGV) قبل شهر إلى شهرين من السفر يمنحك خصومات تصل إلى 60% مقارنة بالشراء في نفس اليوم.',
    coverageCountries: 'بريطانيا وجميع دول الاتحاد الأوروبي',
    recommendedFor: 'المسافرين بين المدن الأوروبية (باريس - لندن - ميلانو - فيينا - برشلونة)',
    imageUrl: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'eurail_pass_official',
    category: 'trains_passes',
    categoryLabel: 'تذكرة القطار الأوروبية الشاملة (Eurail Pass)',
    categoryIcon: '🎫',
    providerName: 'يوريل باس (Eurail Global Pass)',
    providerNameEn: 'Eurail Rail Pass',
    officialUrl: 'https://www.eurail.com',
    badge: 'تذكرة واحدة تتيح لك ركوب القطارات في 33 دولة أوروبية',
    rating: 4.8,
    reviewsCount: '1M+ مسافر قطار',
    startingPrice: 'باقات مرنة (مثلاً 4 أيام في شهر)',
    tagline: 'حرية مطلقة للتنقل بين آلاف المدن والقرى الأوروبية ببطاقة رقمية واحدة',
    summary: 'البطاقة الأشهر في تاريخ السياحة الأوروبية، تتيح لك الصعود للقطارات والتنقل بين فرنسا وسويسرا وإيطاليا والنمسا وألمانيا بمرونة تامة دون الحاجة لشراء تذكرة منفصلة لكل رحلة.',
    features: [
      'سفر غير محدود بالقطار عبر شبكات 33 دولة أوروبية',
      'تطبيق جوال تفاعلي (Rail Planner) للبحث والتخطيط وإظهار التذكرة للمفتش',
      'خصومات مجانية على قوارب البحيرات وبعض الفنادق والمعالم',
      'إمكانية سفر الأطفال مجاناً مع الكبار (حتى طفلين لكل بالغ)',
    ],
    tipsForTraveler: 'بعض القطارات الليلية والسريعة جداً (مثل TGV وEurostar) تتطلب حجز مقعد رمزي مسبقاً عبر تطبيق Rail Planner.',
    coverageCountries: '33 دولة أوروبية',
    recommendedFor: 'محبي الاستكشاف والجولات متعددة الدول في أوروبا والعائلات',
    imageUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'japan_rail_pass_official',
    category: 'trains_passes',
    categoryLabel: 'بطاقة قطار الرصاصة باليابان (JR Pass)',
    categoryIcon: '🚅',
    providerName: 'جابان ريل باس (Japan Rail Pass Official)',
    providerNameEn: 'JR Pass Japan',
    officialUrl: 'https://www.japanrailpass.net',
    badge: 'ركوب غير محدود لقطارات الشينكانسن فائق السرعة باليابان',
    rating: 4.9,
    reviewsCount: '2M+ زائر لليابان',
    startingPrice: 'باقات لـ 7 أو 14 أو 21 يوماً',
    tagline: 'التنقل الأسرع والأكثر فخامة بين طوكيو، كيوتو، أوساكا، وهيروشيما',
    summary: 'البطاقة الرسمية المعتمدة لزوار اليابان للتنقل على شبكة قطارات الرصاصة الشينكانسن (Shinkansen) وشبكات الحافلات وعبارات JR البحرية بأعلى معايير الدقة والسرعة.',
    features: [
      'ركوب غير محدود لقطارات الشينكانسن السريعة والقطارات المحلية التابعة لـ JR',
      'حجز مقاعد مجاني عبر المكاتب أو الأجهزة الآلية بالمحطات',
      'تشمل خط القطار الدائري الشهير (JR Yamanote Line) داخل طوكيو',
    ],
    tipsForTraveler: 'اشترِ قسيمة الـ JR Pass عبر الإنترنت قبل السفر لليابان واستبدلها بالتذكرة الأصلية فور وصولك لمطار هانيدا أو ناريتا.',
    coverageCountries: 'جميع أنحاء اليابان',
    recommendedFor: 'جميع المسافرين والسياح في اليابان لربط طوكيو وكيوتو وأوساكا',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'swiss_travel_pass_official',
    category: 'trains_passes',
    categoryLabel: 'تذكرة سويسرا الشاملة (Swiss Travel Pass)',
    categoryIcon: '🏔️',
    providerName: 'سويس ترافيل باس (Swiss Travel Pass)',
    providerNameEn: 'Swiss Travel System',
    officialUrl: 'https://www.mystsnet.com',
    badge: 'قطارات وباصات وقوارب ودخول 500 متحف بسويسرا مجاناً',
    rating: 5.0,
    reviewsCount: '1.8M+ سائح في سويسرا',
    startingPrice: 'باقات 3، 4، 6، 8 أو 15 يوماً',
    tagline: 'البطاقة السحرية لاكتشاف جبال الألب، البحيرات الفيروزية، والقرى السويسرية',
    summary: 'التذكرة الأكثر تكاملاً في العالم لسويسرا. تغطي جميع قطارات السكك الحديدية الفيدرالية، قوارب بحيرات جنيف وزيورخ ولوزيرن، الترام والباصات داخل 90 مدينة، ودخول مجاني لأكثر من 500 متحف وقصر.',
    features: [
      'ركوب غير محدود لجميع وسائل النقل العام في سويسرا (قطارات، باصات، قوارب)',
      'دخول مجاني لأكثر من 500 متحف ومعلم تاريخي في سويسرا',
      'خصم 50% على معظم التلفريكات والقطارات الجبلية للصعود للقمم الثلجية',
      'مجانية السفر للأطفال حتى سن 16 عاماً مع بطاقة الأسرة السويسرية المجانية (Swiss Family Card)',
    ],
    tipsForTraveler: 'لا تحتاج لحجز أي مقعد لمعظم القطارات السويسرية، فقط اصعد القطار واجلس في مقعدك وأظهر الباركود على هاتفك للمفتش.',
    coverageCountries: 'سويسرا بالكامل وعبر الحدود مع ليختنشتاين',
    recommendedFor: 'كل من يسافر إلى سويسرا وإنترلاكن وزيورخ وجنيف وزرمات',
    imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80'
  }
];

export const SERVICE_CATEGORIES = [
  { id: 'all', label: 'جميع خدمات السفر الإضافية', icon: '✨', count: EXTRA_TRAVEL_SERVICES_DATABASE.length },
  { id: 'insurance', label: 'تأمين السفر والطبي الدولي', icon: '🛡️', count: EXTRA_TRAVEL_SERVICES_DATABASE.filter(s => s.category === 'insurance' || s.category === 'medical_telehealth').length },
  { id: 'esim', label: 'شرائح الإنترنت (eSIM) والواي فاي', icon: '📶', count: EXTRA_TRAVEL_SERVICES_DATABASE.filter(s => s.category === 'esim').length },
  { id: 'transfers', label: 'النقل الخاص وسيارات المطارات', icon: '🚘', count: EXTRA_TRAVEL_SERVICES_DATABASE.filter(s => s.category === 'transfers').length },
  { id: 'lounges', label: 'صالات المطار والمسار السريع', icon: '🛋️', count: EXTRA_TRAVEL_SERVICES_DATABASE.filter(s => s.category === 'lounges').length },
  { id: 'luggage', label: 'تخزين وشحن الحقائب', icon: '🧳', count: EXTRA_TRAVEL_SERVICES_DATABASE.filter(s => s.category === 'luggage').length },
  { id: 'trains_passes', label: 'تذاكر القطارات والبطاقات الموحدة', icon: '🚄', count: EXTRA_TRAVEL_SERVICES_DATABASE.filter(s => s.category === 'trains_passes').length },
];

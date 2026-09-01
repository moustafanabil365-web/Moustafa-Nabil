export interface GlobalCountry {
  code: string;
  name: string;
  nameEn: string;
  flag: string;
  continent: 'middle_east' | 'europe' | 'asia' | 'americas' | 'africa' | 'oceania';
  continentLabel: string;
  currency: string;
  popularCities: Array<{
    name: string;
    province?: string;
    tag: string;
    landmark: string;
    imageUrl: string;
  }>;
}

export const GLOBAL_COUNTRIES: GlobalCountry[] = [
  // 1. Middle East & Arab Destinations (الخليج العربي والشرق الأوسط)
  {
    code: 'SA',
    name: 'المملكة العربية السعودية',
    nameEn: 'Saudi Arabia',
    flag: '🇸🇦',
    continent: 'middle_east',
    continentLabel: 'الخليج العربي والشرق الأوسط',
    currency: 'SAR',
    popularCities: [
      { name: 'مكة المكرمة', province: 'منطقة مكة المكرمة', tag: 'أقدس بقاع الأرض والمسجد الحرام ومناسك العمرة والحج', landmark: 'المسجد الحرام وبرج الساعة والكعبة المشرفة', imageUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80' },
      { name: 'المدينة المنورة', province: 'منطقة المدينة المنورة', tag: 'طيبة الطيبة ومسجد رسول الله ومسجد قباء', landmark: 'المسجد النبوي الشريف ومسجد قباء وجبل أحد', imageUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80' },
      { name: 'الرياض', province: 'منطقة الرياض', tag: 'العاصمة العالمية وبوليفارد وورلد والدرعية', landmark: 'برج المملكة وقصر المصمك وبوليفارد سيتي', imageUrl: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=800&q=80' },
      { name: 'العلا', province: 'منطقة المدينة المنورة', tag: 'متحف العالم الحي وعجائب الحِجر ومسرح مرايا', landmark: 'مدائن صالح وجبل الفيل ومسرح مرايا العاكس', imageUrl: 'https://images.unsplash.com/photo-1609873963597-25e24b89cb51?auto=format&fit=crop&w=800&q=80' },
      { name: 'جدة', province: 'منطقة مكة المكرمة', tag: 'عروس البحر الأحمر والبلد التاريخية والكورنيش', landmark: 'حي البلد التاريخي المسجل باليونسكو ونافورة الملك فهد', imageUrl: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80' },
      { name: 'أبها وعسير', province: 'منطقة عسير', tag: 'سيدة الضباب وجبال السودة والقرى التراثية', landmark: 'جبل السودة وقرية رجال ألمع والتلفريك', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    code: 'AE',
    name: 'الإمارات العربية المتحدة',
    nameEn: 'United Arab Emirates',
    flag: '🇦🇪',
    continent: 'middle_east',
    continentLabel: 'الخليج العربي',
    currency: 'AED',
    popularCities: [
      { name: 'دبي', province: 'إمارة دبي', tag: 'برج خليفة ودبي مول وجزيرة النخلة والترفيه', landmark: 'برج خليفة ودبي فاونتن ونخلة جميرا ومتحف المستقبل', imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80' },
      { name: 'أبوظبي', province: 'إمارة أبوظبي', tag: 'جامع الشيخ زايد ومتحف اللوفر أبوظبي وجزيرة ياس', landmark: 'جامع الشيخ زايد ومتحف اللوفر وعالم فيراري', imageUrl: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80' },
      { name: 'رأس الخيمة والشارقة', province: 'الإمارات الشمالية', tag: 'قمة جبل جيس ومتاحف الحضارة الإسلامية', landmark: 'قمة جبل جيس وأطول زيبلاين وقلعة الشارقة', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    code: 'EG',
    name: 'جمهورية مصر العربية',
    nameEn: 'Egypt',
    flag: '🇪🇬',
    continent: 'middle_east',
    continentLabel: 'الشرق الأوسط وأفريقيا',
    currency: 'EGP',
    popularCities: [
      { name: 'القاهرة والجيزة', province: 'محافظة القاهرة والجيزة', tag: 'أهرامات الجيزة والمتحف المصري الكبير وخان الخليلي', landmark: 'أهرامات الجيزة والمتحف المصري الكبير وقلعة صلاح الدين', imageUrl: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800&q=80' },
      { name: 'الأقصر وأسوان', province: 'صعيد مصر', tag: 'عاصمة الآثار ونهر النيل ومعابد الفراعنة الخالدة', landmark: 'معبد الكرنك ووادي الملوك ومعبد فيلة وأبو سمبل', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' },
      { name: 'شرم الشيخ والغردقة', province: 'البحر الأحمر وجنوب سيناء', tag: 'منتجعات الغوص العالمية والشعاب المرجانية الساحرة', landmark: 'محمية رأس محمد وخليج نعمة وجزر الجفتون', imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80' },
      { name: 'الإسكندرية والساحل الشمالي', province: 'البحر المتوسط', tag: 'عروس البحر الأبيض المتوسط والمكتبة والشواطئ الفيروزية', landmark: 'قلعة قايتباي ومكتبة الإسكندرية وكورنيش ستانلي', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    code: 'QA',
    name: 'دولة قطر',
    nameEn: 'Qatar',
    flag: '🇶🇦',
    continent: 'middle_east',
    continentLabel: 'الخليج العربي',
    currency: 'QAR',
    popularCities: [
      { name: 'الدوحة ولوسيل', province: 'بلدية الدوحة', tag: 'سوق واقف واللؤلؤة قطر ودرب لوسيل والمتاحف', landmark: 'سوق واقف ومتحف الفن الإسلامي ومارينا لوسيل', imageUrl: 'https://images.unsplash.com/photo-1578895101407-742bc53b26c7?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    code: 'KW',
    name: 'دولة الكويت',
    nameEn: 'Kuwait',
    flag: '🇰🇼',
    continent: 'middle_east',
    continentLabel: 'الخليج العربي',
    currency: 'KWD',
    popularCities: [
      { name: 'مدينة الكويت', province: 'محافظة العاصمة', tag: 'أبراج الكويت وسوق المباركية ومجمع الأفنيوز', landmark: 'أبراج الكويت ومركز الشيخ جابر الأحمد الثقافي', imageUrl: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    code: 'OM',
    name: 'سلطنة عمان',
    nameEn: 'Oman',
    flag: '🇴🇲',
    continent: 'middle_east',
    continentLabel: 'الخليج العربي',
    currency: 'OMR',
    popularCities: [
      { name: 'مسقط والجبل الأخضر', province: 'محافظة مسقط والداخلية', tag: 'جامع السلطان قابوس وسوق مطرح ووديان الجبل الأخضر', landmark: 'جامع السلطان قابوس الأكبر ودار الأوبرا السلطانية', imageUrl: 'https://images.unsplash.com/photo-1578895101407-742bc53b26c7?auto=format&fit=crop&w=800&q=80' },
      { name: 'صلالة وظفار', province: 'محافظة ظفار', tag: 'خريف صلالة والشلالات الخضراء الرذاذية وشاطئ المغسيل', landmark: 'وادي دربات وعين رزات والنافورات المائية', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    code: 'BH',
    name: 'مملكة البحرين',
    nameEn: 'Bahrain',
    flag: '🇧🇭',
    continent: 'middle_east',
    continentLabel: 'الخليج العربي',
    currency: 'BHD',
    popularCities: [
      { name: 'المنامة', province: 'محافظة العاصمة', tag: 'قلعة البحرين وباب البحرين ومسرح البحرين الوطني', landmark: 'قلعة البحرين وباب البحرين ومجمع السيف', imageUrl: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    code: 'JO',
    name: 'المملكة الأردنية الهاشمية',
    nameEn: 'Jordan',
    flag: '🇯🇴',
    continent: 'middle_east',
    continentLabel: 'الشرق الأوسط وبلاد الشام',
    currency: 'JOD',
    popularCities: [
      { name: 'البتراء ووادي رم', province: 'محافظة معان والعقبة', tag: 'المدينة الوردية المنحوتة بالصخر وصحراء وادي رم الفلكية', landmark: 'الخزنة في البتراء والسيق ومخيمات وادي رم', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' },
      { name: 'عمان والبحر الميت', province: 'محافظة العاصمة والبلقاء', tag: 'جبل القلعة والمدرج الروماني وأخفض نقطة على سطح الأرض', landmark: 'المدرج الروماني وجبل القلعة ومنتجعات البحر الميت', imageUrl: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    code: 'PS',
    name: 'فلسطين والقدس الشريف',
    nameEn: 'Palestine',
    flag: '🇵🇸',
    continent: 'middle_east',
    continentLabel: 'بلاد الشام',
    currency: 'USD',
    popularCities: [
      { name: 'القدس الشريف', province: 'القدس', tag: 'المسجد الأقصى المبارك وقبة الصخرة المشرفة والبلدة القديمة', landmark: 'المسجد الأقصى وقبة الصخرة المشرفة وكنيسة القيامة', imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80' },
      { name: 'بيت لحم والخليل', province: 'الضفة الغربية', tag: 'كنيسة المهد والمسجد الإبراهيمي الشريف', landmark: 'كنيسة المهد والمسجد الإبراهيمي في الخليل', imageUrl: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    code: 'MA',
    name: 'المملكة المغربية',
    nameEn: 'Morocco',
    flag: '🇲🇦',
    continent: 'middle_east',
    continentLabel: 'شمال أفريقيا والمغرب العربي',
    currency: 'MAD',
    popularCities: [
      { name: 'مراكش', province: 'مراكش-آسفي', tag: 'ساحة جامع الفنا وحديقة ماجوريل والرياضات الفاخرة', landmark: 'ساحة جامع الفنا وقصر الباهية وحديقة ماجوريل', imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80' },
      { name: 'شفشاون وطنجة', province: 'طنجة-تطوان', tag: 'الجوهرة الزرقاء ومضيق جبل طارق ومغارة هرقل', landmark: 'أزقة شفشاون الزرقاء ومغارة هرقل وكاب سبارتيل', imageUrl: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800&q=80' },
      { name: 'فاس والدار البيضاء', province: 'فاس والدار البيضاء', tag: 'جامعة القرويين التاريخية ومسجد الحسن الثاني على البحر', landmark: 'مسجد الحسن الثاني والمدينة العتيقة بفاس', imageUrl: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    code: 'TN',
    name: 'تونس',
    nameEn: 'Tunisia',
    flag: '🇹🇳',
    continent: 'africa',
    continentLabel: 'شمال أفريقيا',
    currency: 'TND',
    popularCities: [
      { name: 'تونس وسيدي بوسعيد', province: 'تونس الكبرى', tag: 'البيوت البيضاء والزرقاء وقرطاج التاريخية ومدرج الجم', landmark: 'قرية سيدي بوسعيد والمدينة العتيقة ومدرج الجم الروماني', imageUrl: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800&q=80' },
      { name: 'سوسة وجربة', province: 'الساحل وجربة', tag: 'جزيرة الأحلام جربة ومنتجعات البحر الأبيض المتوسط', landmark: 'حومة السوق بجربة وميناء القنطاوي والرباط', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
    ],
  },

  // 2. Top Europe Tourism Destinations (أوروبا الأكثر سياحة وزيارة)
  {
    code: 'FR',
    name: 'فرنسا',
    nameEn: 'France',
    flag: '🇫🇷',
    continent: 'europe',
    continentLabel: 'أوروبا الغربية',
    currency: 'EUR',
    popularCities: [
      { name: 'باريس', province: 'إيل دو فرانس', tag: 'مدينة النور والفن والموضة وعاصمة السياحة العالمية', landmark: 'برج إيفل ومتحف اللوفر وقوس النصر والشانزليزيه', imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80' },
      { name: 'نيس وكان', province: 'كوت دازور', tag: 'ريفييرا الفرنسية وشواطئ البحر المتوسط ومهرجان كان', landmark: 'ممشى الإنجليز وقصر المهرجانات في كان والبلدة القديمة', imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80' },
      { name: 'ليون وآنِسي', province: 'أوفيرن رون ألب', tag: 'عاصمة المطبخ وبحيرة آنسي فينيسيا جبال الألب', landmark: 'بحيرة آنسي الخلابة وكاتدرائية فورفيير بليون', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    code: 'ES',
    name: 'إسبانيا',
    nameEn: 'Spain',
    flag: '🇪🇸',
    continent: 'europe',
    continentLabel: 'أوروبا الجنوبية',
    currency: 'EUR',
    popularCities: [
      { name: 'مدريد', province: 'منطقة مدريد', tag: 'العاصمة الملكية والساحات التاريخية والمتاحف العريقة', landmark: 'القصر الملكي وساحة بلازا مايور ومتحف برادو', imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80' },
      { name: 'برشلونة', province: 'كتالونيا', tag: 'تحف غاودي المعمارية وشاطئ برشلونيتا', landmark: 'كنيسة ساغرادا فاميليا وحديقة غويل وشارع الرامبلا', imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80' },
      { name: 'غرناطة وإشبيلية', province: 'الأندلس', tag: 'قصر الحمراء وعمارة الأندلس الإسلامية الخالدة', landmark: 'قصر الحمراء وحي البيازين وساحة إسبانيا', imageUrl: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=800&q=80' },
      { name: 'مايوركا وملقا', province: 'جزر البليار وكوستا ديل سول', tag: 'شواطئ البحر المتوسط الفيروزية والمنتجعات', landmark: 'كهوف دراخ وكاتدرائية بالما وشواطئ ملقا', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    code: 'IT',
    name: 'إيطاليا',
    nameEn: 'Italy',
    flag: '🇮🇹',
    continent: 'europe',
    continentLabel: 'أوروبا الجنوبية',
    currency: 'EUR',
    popularCities: [
      { name: 'روما والفاتيكان', province: 'لاتسيو', tag: 'المدينة الخالدة ومدرج الكولوسيوم العظيم', landmark: 'الكولوسيوم ونافورة تريفي وكاتدرائية القديس بطرس', imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80' },
      { name: 'البندقية (فينيسيا)', province: 'فينيتو', tag: 'مدينة القنوات والجندول والجسور الرومانسية', landmark: 'القناة الكبرى وساحة سان ماركو وجسر ريالتو', imageUrl: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=800&q=80' },
      { name: 'ميلانو وبحيرة كومو', province: 'لومبارديا', tag: 'عاصمة الموضة وكاتدرائية الدومو الساحرة', landmark: 'كاتدرائية الدومو وغاليريا فيتوريو وبحيرة كومو', imageUrl: 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?auto=format&fit=crop&w=800&q=80' },
      { name: 'فلورنسا وساحل أمالفي', province: 'توسكانا وكامبانيا', tag: 'مهد عصر النهضة والقرى المعلقة على البحر', landmark: 'كاتدرائية سانتا ماريا وبلدات بوسيتانو وأمالفي', imageUrl: 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    code: 'TR',
    name: 'تركيا',
    nameEn: 'Turkey',
    flag: '🇹🇷',
    continent: 'europe',
    continentLabel: 'أوروبا وآسيا',
    currency: 'TRY',
    popularCities: [
      { name: 'إسطنبول', province: 'ولاية إسطنبول', tag: 'ملتقى القارتين والبوسفور وآيا صوفيا والسلطان أحمد', landmark: 'آيا صوفيا والمسجد الأزرق وقصر توبكابي والبوسفور', imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80' },
      { name: 'كابادوكيا', province: 'ولاية نوشهر', tag: 'مناطيد الهواء الساخن والمداخن الصخرية الأسطورية', landmark: 'وادي الورود والمناطيد والمدن تحت الأرض', imageUrl: 'https://images.unsplash.com/photo-1570939274717-7eda259b50ed?auto=format&fit=crop&w=800&q=80' },
      { name: 'طرابزون وأوزنجول', province: 'ولاية طرابزون', tag: 'جنة البحر الأسود والشلالات والغابات الخضراء', landmark: 'بحيرة أوزنجول ودير سوميلا ومرتفعات آيدر', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' },
      { name: 'أنطاليا وبودروم', province: 'ريفييرا التركية', tag: 'شواطئ الريفييرا والمنتجعات الشاملة والخلجان', landmark: 'شلالات دودين وشاطئ كونيالتي ومارينا بودروم', imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    code: 'GB',
    name: 'المملكة المتحدة (بريطانيا)',
    nameEn: 'United Kingdom',
    flag: '🇬🇧',
    continent: 'europe',
    continentLabel: 'أوروبا',
    currency: 'GBP',
    popularCities: [
      { name: 'لندن', province: 'إنجلترا', tag: 'ساعة بيغ بن وقصر باكنغهام ونهر التيمز والمسارح', landmark: 'بيغ بن وعين لندن وبرج لندن وهايد بارك', imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80' },
      { name: 'إدنبرة', province: 'اسكتلندا', tag: 'القلعة التاريخية والتلال الخضراء الخلابة والمهرجانات', landmark: 'قلعة إدنبرة والميل الملكي ومقعد آرثر', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' },
      { name: 'مانشستر وأكسفورد', province: 'إنجلترا', tag: 'عاصمة الرياضة والجامعات التاريخية العريقة', landmark: 'ملعب أولد ترافورد ومكتبة بودليان بأكسفورد', imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    code: 'DE',
    name: 'ألمانيا',
    nameEn: 'Germany',
    flag: '🇩🇪',
    continent: 'europe',
    continentLabel: 'أوروبا الوسطى',
    currency: 'EUR',
    popularCities: [
      { name: 'ميونخ وبافاريا', province: 'بافاريا', tag: 'قلعة نويشفانشتاين وقصور بافاريا وسيارات BMW', landmark: 'ساحة مارينا بلاتز وقلعة نويشفانشتاين الأسطورية', imageUrl: 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?auto=format&fit=crop&w=800&q=80' },
      { name: 'برلين', province: 'برلين', tag: 'بوابة براندنبورغ وجزيرة المتاحف وجدار برلين', landmark: 'بوابة براندنبورغ ومتحف بيرغامون ومبنى الرايخستاغ', imageUrl: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=800&q=80' },
      { name: 'الغابة السوداء وبادن بادن', province: 'بادن فورتمبيرغ', tag: 'الطبيعة الساحرة والينابيع العلاجية ومسارات المشي', landmark: 'شلالات تريبرغ وبحيرة تيتيزي وحمامات كاراكلا', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    code: 'AT',
    name: 'النمسا',
    nameEn: 'Austria',
    flag: '🇦🇹',
    continent: 'europe',
    continentLabel: 'أوروبا الوسطى',
    currency: 'EUR',
    popularCities: [
      { name: 'فيينا', province: 'ولاية فيينا', tag: 'عاصمة الموسيقى وقصر شونبرون الإمبراطوري', landmark: 'قصر شونبرون وقصر بيلفيدير وكاتدرائية سانت ستيفان', imageUrl: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=800&q=80' },
      { name: 'زيلامسي وكابرون', province: 'سالزبورغ', tag: 'البحيرة الساحرة والقمم الجليدية وشلالات كريمل', landmark: 'بحيرة زيل وقمة كيتزشتاينهورن وشلالات كريمل', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' },
      { name: 'سالزبورغ وهالشتات', province: 'سالزبورغ وأعالي النمسا', tag: 'مسقط رأس موزارت وقرية هالشتات الخيالية على البحيرة', landmark: 'قرية هالشتات وقلعة هوهنسالزبورغ وحدائق ميرابيل', imageUrl: 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    code: 'CH',
    name: 'سويسرا',
    nameEn: 'Switzerland',
    flag: '🇨🇭',
    continent: 'europe',
    continentLabel: 'أوروبا الوسطى',
    currency: 'CHF',
    popularCities: [
      { name: 'إنترلاكن وجبال الألب', province: 'كانتون برن', tag: 'عاصمة جبال الألب والقمم الثلجية الدائمة', landmark: 'قمة يونغفراوجوخ وشلالات لاوتربرونن وبحيرة برينز', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' },
      { name: 'جنيف ولوزيرن', province: 'جنيف ولوزيرن', tag: 'نافورة جنيف وجسر الشابل الخشبي التاريخي', landmark: 'نافورة جنيف وبحيرة ليمان وجسر كابيلبروكا', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' },
      { name: 'زيورخ وزيرمات', province: 'زيورخ وفاليه', tag: 'قمة ماترهورن الشهيرة وبحيرة زيورخ', landmark: 'قمة جبل ماترهورن وباهنهوفشتراسه وقمة غورنيرات', imageUrl: 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    code: 'GR',
    name: 'اليونان',
    nameEn: 'Greece',
    flag: '🇬🇷',
    continent: 'europe',
    continentLabel: 'أوروبا الجنوبية',
    currency: 'EUR',
    popularCities: [
      { name: 'سانتوريني وميكونوس', province: 'جزر السيكلاديز', tag: 'البيوت البيضاء والقباب الزرقاء وغروب أويا الأسطوري', landmark: 'قرية أويا والشاطئ الأحمر وطواحين ميكونوس', imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80' },
      { name: 'أثينا', province: 'أتيكا', tag: 'مهد الحضارة الإغريقية ومعبد البارثينون', landmark: 'الأكروبوليس ومعبد البارثينون وحي بلاكا التاريخي', imageUrl: 'https://images.unsplash.com/photo-1555993539-1732916bbf98?auto=format&fit=crop&w=800&q=80' },
      { name: 'كريت ورودس', province: 'الجزر اليونانية', tag: 'شواطئ بالوس الوردية وقصر كنوسوس الأثري', landmark: 'بحيرة بالوس وشاطئ إيلافونيسي والمدينة القديمة', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    code: 'PT',
    name: 'البرتغال',
    nameEn: 'Portugal',
    flag: '🇵🇹',
    continent: 'europe',
    continentLabel: 'أوروبا الجنوبية',
    currency: 'EUR',
    popularCities: [
      { name: 'لشبونة وسينترا', province: 'منطقة لشبونة', tag: 'ترام 28 الشهير وقصر بينا الملون على قمم التلال', landmark: 'برج بيليم وقصر بينا الوطني ودير جيرونيموس', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' },
      { name: 'بورتو والغارف', province: 'الشمال والجنوب', tag: 'جسر لويس الأول وكهوف بينانجيل البحرية المذهلة', landmark: 'جسر دوم لويس وشاطئ مارينا وكهف بينانجيل', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    code: 'NL',
    name: 'هولندا',
    nameEn: 'Netherlands',
    flag: '🇳🇱',
    continent: 'europe',
    continentLabel: 'أوروبا الغربية',
    currency: 'EUR',
    popularCities: [
      { name: 'أمستردام', province: 'شمال هولندا', tag: 'قنوات المياه التاريخية ومتحف فان غوخ وحدائق التوليب', landmark: 'متحف ريجكس وحدائق كيوكينهوف وقنوات المياه', imageUrl: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=800&q=80' },
      { name: 'جيثورن وروتردام', province: 'أوفرايسل وجنوب هولندا', tag: 'قرية البندقية الهولندية الخالية من السيارات والهندسة الحديثة', landmark: 'قرية جيثورن المائية ومنازل المكعبات بروتردام', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    code: 'GE',
    name: 'جورجيا',
    nameEn: 'Georgia',
    flag: '🇬🇪',
    continent: 'europe',
    continentLabel: 'القوقاز وأوروبا الشرقية',
    currency: 'GEL',
    popularCities: [
      { name: 'تبليسي', province: 'العاصمة تبليسي', tag: 'حمامات الكبريت والبلدة القديمة والتلفريك البانورامي', landmark: 'قلعة ناريكالا وجسر السلام وحمامات الكبريت', imageUrl: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=800&q=80' },
      { name: 'باتومي', province: 'أجاريا', tag: 'لؤلؤة البحر الأسود والممشى العصري وتمثال الحب', landmark: 'تمثال علي ونينو والبوليفارد وحديقة النباتات', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
      { name: 'كازبيجي وغوداوري', province: 'متسخيتا-متيانيتي', tag: 'جبال القوقاز الشاهقة وكنيسة جيرجيتي فوق الغيوم', landmark: 'كنيسة الثالوث في جيرجيتي ومنتجع غوداوري للتزلج', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    code: 'AZ',
    name: 'أذربيجان',
    nameEn: 'Azerbaijan',
    flag: '🇦🇿',
    continent: 'europe',
    continentLabel: 'القوقاز وبحر قزوين',
    currency: 'AZN',
    popularCities: [
      { name: 'باكو', province: 'العاصمة باكو', tag: 'أبراج الشعلة والبلدة القديمة إيشيري شيهر وبحر قزوين', landmark: 'أبراج الشعلة ومركز حيدر علييف والبوليفارد', imageUrl: 'https://images.unsplash.com/photo-1578895101407-742bc53b26c7?auto=format&fit=crop&w=800&q=80' },
      { name: 'غابالا وشاهداغ', province: 'منطقة غابالا وقوصار', tag: 'تلفريك توفانداغ والشلالات الجبلية ومنتجع التزلج', landmark: 'منتجع توفانداغ للتزلج وبحيرة نوهور وجبال شاهداغ', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    code: 'BA',
    name: 'البوسنة والهرسك',
    nameEn: 'Bosnia and Herzegovina',
    flag: '🇧🇦',
    continent: 'europe',
    continentLabel: 'البلقان وأوروبا الشرقية',
    currency: 'BAM',
    popularCities: [
      { name: 'سراييفو', province: 'كانتون سراييفو', tag: 'حي باشتشارشيا العثماني ونبع نهر البوسنة', landmark: 'حي باشتشارشيا التاريخي وسبيل الماء والتلفريك', imageUrl: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800&q=80' },
      { name: 'موستار وكرافيتسا', province: 'الهرسك', tag: 'الجسر العثماني القديم وشلالات كرافيتسا الفيروزية', landmark: 'جسر موستار القديم وتكية بلاغاي وشلالات كرافيتسا', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' },
    ],
  },

  // 3. Asia & Pacific Destinations (آسيا والمحيط الهادئ)
  {
    code: 'JP',
    name: 'اليابان',
    nameEn: 'Japan',
    flag: '🇯🇵',
    continent: 'asia',
    continentLabel: 'شرق آسيا',
    currency: 'JPY',
    popularCities: [
      { name: 'طوكيو', province: 'محافظة طوكيو', tag: 'تقاطع شيبويا وأضواء شينجوكو والتكنولوجيا والأنمي', landmark: 'برج طوكيو ومعبد سينسوجي وتقاطع شيبويا', imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80' },
      { name: 'كيوتو وجبل فوجي', province: 'محافظة كيوتو وشيزوكا', tag: 'المعابد الذهبية والكرز وبحيرات جبل فوجي', landmark: 'معبد فوشيمي إناري والضريح الذهبي وبحيرة كاواغوتشيكو', imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80' },
      { name: 'أوساكا ونارا', province: 'محافظة أوساكا ونارا', tag: 'عاصمة المأكولات وقلعة أوساكا وغزلان نارا', landmark: 'قلعة أوساكا ودوتونبوري وحديقة غزلان نارا', imageUrl: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    code: 'TH',
    name: 'تايلاند',
    nameEn: 'Thailand',
    flag: '🇹🇭',
    continent: 'asia',
    continentLabel: 'جنوب شرق آسيا',
    currency: 'THB',
    popularCities: [
      { name: 'بانكوك', province: 'محافظة بانكوك', tag: 'القصر الكبير والأسواق العائمة والأبراج الحديثة', landmark: 'القصر الكبير ومعبد وات أرون وأسواق أيكون سيام', imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80' },
      { name: 'بوكيت وجزر بي بي', province: 'محافظة بوكيت', tag: 'منتجعات الجزر وشاطئ باتونغ والمياه الزمردية', landmark: 'جزيرة بي بي وشاطئ كاتا والتمثال البوذي الكبير', imageUrl: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=800&q=80' },
      { name: 'كرابي وساموي', province: 'جنوب تايلاند', tag: 'شواطئ رايلي كليفز وغابات المنغروف الاستوائية', landmark: 'شاطئ رايلاي وجزيرة جيمس بوند وشلالات ساموي', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
      { name: 'شيانغ ماي', province: 'شمال تايلاند', tag: 'عاصمة الطبيعة الجبلية ومحميات الفيلة', landmark: 'معبد دوي سوثيب ومحميات الفيلة الطبيعية', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    code: 'MY',
    name: 'ماليزيا',
    nameEn: 'Malaysia',
    flag: '🇲🇾',
    continent: 'asia',
    continentLabel: 'جنوب شرق آسيا',
    currency: 'MYR',
    popularCities: [
      { name: 'كوالالمبور', province: 'الإقليم الاتحادي', tag: 'برجا بتروناس التوأم ومغارات باتو وحدائق الطيور', landmark: 'برجا بتروناس التوأم وكهوف باتو وحدائق بيرد بارك', imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80' },
      { name: 'لنكاوي', province: 'قدح', tag: 'جزيرة الأساطير والتلفريك والجسر المعلق السحابي', landmark: 'جسر السماء المعلق وتلفريك لنكاوي وشاطئ سينانج', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
      { name: 'بينانج وجينتنج', province: 'بينانج وبهانج', tag: 'عاصمة الطعام الآسيوي ومدينة ملاهي الغيوم', landmark: 'جورج تاون وتلفريك جينتنج ومرتفعات كاميرون', imageUrl: 'https://images.unsplash.com/photo-1544885935-98dd03b09034?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    code: 'ID',
    name: 'إندونيسيا',
    nameEn: 'Indonesia',
    flag: '🇮🇩',
    continent: 'asia',
    continentLabel: 'جنوب شرق آسيا',
    currency: 'IDR',
    popularCities: [
      { name: 'بالي وأوبود', province: 'مقاطعة بالي', tag: 'جزيرة الأحلام ومدرجات الأرز والشلالات الساحرة', landmark: 'مدرجات أرز تيغالالانغ ومعبد أولواتو وأرجوحة بالي', imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80' },
      { name: 'لومبوك وجزر جيلي', province: 'نوسا تينجارا', tag: 'شواطئ عذراء وشعاب مرجانية وبراكين نشطة', landmark: 'جبل رينجاني وجزر جيلي الشاطئية بدون سيارات', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
      { name: 'جاكرتا ويوجياكارتا', province: 'جزيرة جاوة', tag: 'معبد بروبودور العظيم وبركان ميرابي', landmark: 'معبد بروبودور وبورودوبور والنصب الوطني', imageUrl: 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    code: 'SG',
    name: 'سنغافورة',
    nameEn: 'Singapore',
    flag: '🇸🇬',
    continent: 'asia',
    continentLabel: 'جنوب شرق آسيا',
    currency: 'SGD',
    popularCities: [
      { name: 'سنغافورة وجزيرة سنتوسا', province: 'سنغافورة', tag: 'حدائق الخليج ومارينا باي ساندز ويونيفرسال ستوديوز', landmark: 'مارينا باي ساندز وحدائق غاردنز باي ذا باي ومطار شانغي', imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    code: 'MV',
    name: 'جزر المالديف',
    nameEn: 'Maldives',
    flag: '🇲🇻',
    continent: 'asia',
    continentLabel: 'المحيط الهندي',
    currency: 'MVR',
    popularCities: [
      { name: 'المنتجعات والفلل المائية', province: 'كافو وأري أتول', tag: 'أفخم فلل فوق الماء والمياه الكريستالية الصافية', landmark: 'منتجعات الأتول والغوص مع سلاحف البحر والدلافين', imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    code: 'KR',
    name: 'كوريا الجنوبية',
    nameEn: 'South Korea',
    flag: '🇰🇷',
    continent: 'asia',
    continentLabel: 'شرق آسيا',
    currency: 'KRW',
    popularCities: [
      { name: 'سول', province: 'العاصمة سول', tag: 'قصر غيونغبوك والكي بوب وبرج إن سول', landmark: 'قصر غيونغبوك وبرج إن سول وشارع ميونغ دونغ', imageUrl: 'https://images.unsplash.com/photo-1538669715315-25121b619717?auto=format&fit=crop&w=800&q=80' },
      { name: 'جزيرة جيجو وبوسان', province: 'جيجو وبوسان', tag: 'الشلالات البركانية وشاطئ هايونداي ومزارع الشاي', landmark: 'قمة شروق الشمس سونغسان وشاطئ هايونداي', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    code: 'CN',
    name: 'الصين',
    nameEn: 'China',
    flag: '🇨🇳',
    continent: 'asia',
    continentLabel: 'شرق آسيا',
    currency: 'CNY',
    popularCities: [
      { name: 'بكين وسور الصين العظيم', province: 'بلدية بكين', tag: 'سور الصين العظيم والمدينة المحرمة والقصر الصيفي', landmark: 'سور الصين العظيم والمدينة المحرمة وميدان تيانانمن', imageUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&q=80' },
      { name: 'شنغهاي وغوانزو', province: 'شنغهاي وغوانغدونغ', tag: 'ناطحات السحاب وبرج لؤلؤة الشرق وأسواق التجارة', landmark: 'شارع البوند وبرج شنغهاي وبرج كانتون', imageUrl: 'https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    code: 'IN',
    name: 'الهند',
    nameEn: 'India',
    flag: '🇮🇳',
    continent: 'asia',
    continentLabel: 'جنوب آسيا',
    currency: 'INR',
    popularCities: [
      { name: 'نيودلهي وأغرا (تاج محل)', province: 'دلهي وأوتار براديش', tag: 'أعجوبة تاج محل وقصور الملوك والقلعة الحمراء', landmark: 'ضريح تاج محل والقلعة الحمراء وبوابة الهند', imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80' },
      { name: 'كيرلا وغوا', province: 'جنوب وغرب الهند', tag: 'القنوات المائية الهادئة والشواطئ الاستوائية الخضراء', landmark: 'قوارب كيرلا المائية وشواطئ غوا ومزارع الشاي بمونار', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
    ],
  },

  // 4. Americas & Oceania Destinations (الأمريكتان وأوقيانوسيا)
  {
    code: 'US',
    name: 'الولايات المتحدة الأمريكية',
    nameEn: 'United States',
    flag: '🇺🇸',
    continent: 'americas',
    continentLabel: 'أمريكا الشمالية',
    currency: 'USD',
    popularCities: [
      { name: 'نيويورك', province: 'ولاية نيويورك', tag: 'تمثال الحرية وتايمز سكوير وسنترال بارك', landmark: 'تايمز سكوير ومبنى إمباير ستيت وسنترال بارك', imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80' },
      { name: 'أورلاندو وميامي', province: 'ولاية فلوريدا', tag: 'عاصمة الملاهي والترفيه وشواطئ ميامي', landmark: 'عالم والت ديزني ويونيفرسال ستوديوز وساوث بيتش', imageUrl: 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?auto=format&fit=crop&w=800&q=80' },
      { name: 'لوس أنجلوس وسان فرانسيسكو', province: 'كاليفورنيا', tag: 'هوليوود وجسر البوابة الذهبية وسيليكون فالي', landmark: 'ممشى المشاهير وجسر غولدن غيت ويوسيميتي', imageUrl: 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?auto=format&fit=crop&w=800&q=80' },
      { name: 'لاس فيغاس وجراند كانيون', province: 'نيفادا وأريزونا', tag: 'الأضواء الساطعة والأخدود العظيم الطبيعي', landmark: 'منتجعات الستريب والأخدود العظيم Grand Canyon', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    code: 'MX',
    name: 'المكسيك',
    nameEn: 'Mexico',
    flag: '🇲🇽',
    continent: 'americas',
    continentLabel: 'أمريكا اللاتينية',
    currency: 'MXN',
    popularCities: [
      { name: 'كانكون وريفييرا مايا', province: 'كينتانا رو', tag: 'شواطئ الكاريبي الفيروزية وأهرامات المايا تشيتشن إيتزا', landmark: 'أهرامات تشيتشن إيتزا وحفر السنوتي الطبيعية وسينوتي إيك كيل', imageUrl: 'https://images.unsplash.com/photo-1512815334188-6617fa79ebce?auto=format&fit=crop&w=800&q=80' },
      { name: 'مكسيكو سيتي', province: 'العاصمة', tag: 'المدينة التاريخية وأهرامات تيوتيهواكان والقصور', landmark: 'ميدان زوكالو وأهرامات الشمس والقمر وقصر تشابولتيبيك', imageUrl: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    code: 'CA',
    name: 'كندا',
    nameEn: 'Canada',
    flag: '🇨🇦',
    continent: 'americas',
    continentLabel: 'أمريكا الشمالية',
    currency: 'CAD',
    popularCities: [
      { name: 'تورونتو وشلالات نياجرا', province: 'أونتاريو', tag: 'برج CN وشلالات نياجرا الأسطورية', landmark: 'برج CN وشلالات نياجرا وجزر تورونتو', imageUrl: 'https://images.unsplash.com/photo-1517935703635-27190760b795?auto=format&fit=crop&w=800&q=80' },
      { name: 'فانكوفر وبانف', province: 'كولومبيا البريطانية وألبرتا', tag: 'طبيعة المحيط الهادئ وبحيرة لويز الفيروزية الخيالية', landmark: 'حديقة ستانلي وجسر كابيلانو وبحيرة لويز ببانف', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    code: 'BR',
    name: 'البرازيل',
    nameEn: 'Brazil',
    flag: '🇧🇷',
    continent: 'americas',
    continentLabel: 'أمريكا الجنوبية',
    currency: 'BRL',
    popularCities: [
      { name: 'ريو دي جانيرو وشلالات إيغوازو', province: 'ريو وبارانا', tag: 'تمثال المسيح الفادي وشاطئ كوباكابانا وأعظم شلالات بالعالم', landmark: 'تمثال المسيح الفادي وشاطئ كوباكابانا وشلالات إيغوازو', imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    code: 'AU',
    name: 'أستراليا',
    nameEn: 'Australia',
    flag: '🇦🇺',
    continent: 'oceania',
    continentLabel: 'أستراليا والمحيط الهادئ',
    currency: 'AUD',
    popularCities: [
      { name: 'سيدني والحاجز المرجاني', province: 'نيوساوث ويلز وكوينزلاند', tag: 'دار أوبرا سيدني وشاطئ بونداي والحاجز المرجاني العظيم', landmark: 'دار أوبرا سيدني وشاطئ بونداي والحاجز المرجاني العظيم', imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80' },
      { name: 'ملبورن وجولد كوست', province: 'فيكتوريا وكوينزلاند', tag: 'طريق المحيط العظيم والشواطئ الذهبية وركوب الأمواج', landmark: 'صخور الرسل الاثنا عشر وشارع الفنون بملبورن', imageUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    code: 'ZA',
    name: 'جنوب أفريقيا',
    nameEn: 'South Africa',
    flag: '🇿🇦',
    continent: 'africa',
    continentLabel: 'جنوب القارة الأفريقية',
    currency: 'ZAR',
    popularCities: [
      { name: 'كيب تاون وحديقة كروجر', province: 'كيب الغربية ومبومالانجا', tag: 'جبل الطاولة ورأس الرجاء الصالح وسفاري الحيوانات الخمسة الكبرى', landmark: 'جبل الطاولة والواجهة البحرية V&A وسفاري حديقة كروجر', imageUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    code: 'MU',
    name: 'موريشيوس وسيشل',
    nameEn: 'Mauritius & Seychelles',
    flag: '🇲🇺',
    continent: 'africa',
    continentLabel: 'المحيط الهندي',
    currency: 'MUR',
    popularCities: [
      { name: 'موريشيوس وجزيرة ماهي', province: 'المحيط الهندي', tag: 'أرض السبعة ألوان والشلالات الساحرة وشواطئ الغرانيت', landmark: 'أرض شاماريل الملونة وشاطئ آنس سورس دارجان', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    code: 'TZ',
    name: 'تنزانيا وزنجبار',
    nameEn: 'Tanzania & Zanzibar',
    flag: '🇹🇿',
    continent: 'africa',
    continentLabel: 'شرق أفريقيا',
    currency: 'TZS',
    popularCities: [
      { name: 'زنجبار وسيرينغيتي', province: 'زنجبار وأروشا', tag: 'شواطئ زنجبار البيضاء والتوابل وسفاري هجرة الحيوانات الكبرى', landmark: 'المدينة الحجرية ستون تاون وشاطئ نونغوي وحديقة سيرينغيتي', imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80' },
    ],
  },
];

// =========================================================================
// 🌍 PASSPORT EASY-ENTRY DIRECTORY (دليل الدول بدون تأشيرة والتأشيرة الفورية)
// =========================================================================
export interface VisaEntryCountry {
  countryName: string;
  flag: string;
  type: 'visa_free' | 'visa_on_arrival' | 'easy_evisa' | 'schengen_us_exempt';
  typeLabel: string;
  stayLimit: string;
  notes: string;
  officialVisaPortal?: string;
  popularHighlight: string;
}

export interface PassportVisaGuide {
  passportCode: 'EG' | 'GCC' | 'ARAB' | 'AFRICAN';
  passportName: string;
  flag: string;
  totalEasyCountries: number;
  countries: VisaEntryCountry[];
}

export const PASSPORT_VISA_DIRECTORIES: Record<string, PassportVisaGuide> = {
  EG: {
    passportCode: 'EG',
    passportName: 'الجواز المصري 🇪🇬',
    flag: '🇪🇬',
    totalEasyCountries: 58,
    countries: [
      { countryName: 'جورجيا', flag: '🇬🇪', type: 'schengen_us_exempt', typeLabel: 'دخول مباشر لحاملي إقامة الخليج أو شنغن/أمريكا', stayLimit: '90 يوماً', notes: 'دخول بدون فيزا لأي مصري لديه إقامة خليجية سارية أو تأشيرة شنغن/أمريكا/بريطانيا.', officialVisaPortal: 'https://www.evisa.gov.ge', popularHighlight: 'تبليسي، باتومي، كازبيجي' },
      { countryName: 'ألبانيا', flag: '🇦🇱', type: 'visa_free', typeLabel: 'بدون فيزا بمواسم الصيف أو بتأشيرة مسبقة', stayLimit: '90 يوماً', notes: 'مفتوحة بدون فيزا في موسم السياحة الصيفي أو لمن يحمل شنغن أو تأشيرة أمريكا.', officialVisaPortal: 'https://e-visa.al', popularHighlight: 'تيرانا وريفييرا ساراندي' },
      { countryName: 'أرمينيا', flag: '🇦🇲', type: 'visa_on_arrival', typeLabel: 'تأشيرة فورية بالمطار / إلكترونية', stayLimit: '120 يوماً', notes: 'تأشيرة فورية عند الوصول لحاملي إقامات الخليج أو تقديم إلكتروني فوري خلال 48 ساعة.', officialVisaPortal: 'https://evisa.mfa.am', popularHighlight: 'يريفان وبحيرة سيفان' },
      { countryName: 'أذربيجان', flag: '🇦🇿', type: 'easy_evisa', typeLabel: 'تأشيرة إلكترونية فورية (ASAN Visa)', stayLimit: '30 يوماً', notes: 'تأشيرة رسمية إلكترونية فورية (ASAN) خلال ساعات أو فورية بالمطار لحاملي إقامة الخليج.', officialVisaPortal: 'https://evisa.gov.az', popularHighlight: 'باكو، غابالا، قوبا' },
      { countryName: 'ماليزيا', flag: '🇲🇾', type: 'visa_free', typeLabel: 'بدون تأشيرة إطلاقاً (مجاناً)', stayLimit: '90 يوماً', notes: 'دخول مجاني مباشر في المطار لمدة 90 يوماً مع تعبئة بطاقة الوصول الرقمية MDAC.', officialVisaPortal: 'https://imigresen-online.imi.gov.my/mdac/main', popularHighlight: 'كوالالمبور، لنكاوي، بينانج' },
      { countryName: 'إندونيسيا (بالي)', flag: '🇮🇩', type: 'visa_on_arrival', typeLabel: 'تأشيرة فورية عند الوصول بالمطار (e-VoA)', stayLimit: '30 يوماً قابلة للتمديد', notes: 'تأشيرة فورية بمطار بالي أو جاكرتا بقيمة 35$ أو إصدارها إلكترونياً مسبقاً.', officialVisaPortal: 'https://molina.imigrasi.go.id', popularHighlight: 'جزيرة بالي، لومبوك، جاكرتا' },
      { countryName: 'جزر المالديف', flag: '🇲🇻', type: 'visa_free', typeLabel: 'تأشيرة سياحية مجانية عند الوصول بالمطار', stayLimit: '30 يوماً', notes: 'تمنح مجاناً لكافة الجنسيات عند الوصول بمجرد وجود حجز فندقي وتذكرة عودة.', officialVisaPortal: 'https://imuga.immigration.gov.mv', popularHighlight: 'المنتجعات المائية والأنشطة البحرية' },
      { countryName: 'موريشيوس', flag: '🇲🇺', type: 'visa_free', typeLabel: 'بدون تأشيرة مسبقة (عند الوصول مجاناً)', stayLimit: '90 يوماً', notes: 'تأشيرة مجانية في المطار مباشرة عند تقديم تذكرة العودة وتأكيد الفندق.', officialVisaPortal: 'https://passport.govmu.org', popularHighlight: 'شاماريل، بورت لويس، لو مورن' },
      { countryName: 'سيشل', flag: '🇸🇨', type: 'visa_free', typeLabel: 'تصريح سفر مجاني لجميع الجنسيات', stayLimit: '30 يوماً', notes: 'بدون فيزا مع تعبئة تصريح الدخول السياحي الرقمي قبل السفر.', officialVisaPortal: 'https://seychelles.govtas.com', popularHighlight: 'جزيرة ماهي، براسلين، لاديغ' },
      { countryName: 'تنزانيا وزنجبار', flag: '🇹🇿', type: 'visa_on_arrival', typeLabel: 'تأشيرة فورية بالمطار / إلكترونية', stayLimit: '90 يوماً', notes: 'تأشيرة فورية في مطار زنجبار أو دار السلام بمبلغ 50$.', officialVisaPortal: 'https://visa.immigration.go.tz', popularHighlight: 'شواطئ زنجبار، سفاري سيرينغيتي' },
      { countryName: 'كينيا', flag: '🇰🇪', type: 'easy_evisa', typeLabel: 'تصريح سفر إلكتروني فوري (eTA)', stayLimit: '90 يوماً', notes: 'إلغاء التأشيرة التقليدية واستبدالها بتصريح سفر إلكتروني فوري (eTA).', officialVisaPortal: 'https://www.etakenya.go.ke', popularHighlight: 'نيروبي ومحمية ماساي مارا' },
      { countryName: 'الأردن', flag: '🇯🇴', type: 'visa_free', typeLabel: 'دخول بدون تأشيرة للمصريين', stayLimit: '30 يوماً', notes: 'دخول ميسر بدون فيزا مسبقة للمسافرين عبر المطارات أو المعابر الرسمية.', officialVisaPortal: 'https://moi.gov.jo', popularHighlight: 'عمان، البتراء، البحر الميت، وادي رم' },
      { countryName: 'لبنان', flag: '🇱🇧', type: 'visa_on_arrival', typeLabel: 'تأشيرة مجانية عند الوصول بمطار بيروت', stayLimit: '30 يوماً', notes: 'تأشيرة فورية بمطار بيروت لحاملي تذكرة ذهاب وعودة ومبلغ نقدي أو حجز فندقي.', officialVisaPortal: 'http://www.general-security.gov.lb', popularHighlight: 'بيروت، جونيه، جبل لبنان' },
      { countryName: 'تركيا', flag: '🇹🇷', type: 'easy_evisa', typeLabel: 'تأشيرة إلكترونية فورية (للأعمار أقل من 20 أو أكبر من 45 أو حاملي شنغن)', stayLimit: '30 يوماً', notes: 'فيزا إلكترونية فورية للمصريين دون 20 عاماً أو فوق 45 عاماً، أو لمن يملك شنغن/أمريكا/بريطانيا.', officialVisaPortal: 'https://www.evisa.gov.tr', popularHighlight: 'إسطنبول، كابادوكيا، أنطاليا، طرابزون' },
      { countryName: 'البوسنة والهرسك', flag: '🇧🇦', type: 'schengen_us_exempt', typeLabel: 'دخول بدون فيزا لحاملي شنغن متعددة أو تأشيرة أمريكا', stayLimit: '30 يوماً', notes: 'دخول حر مباشر بدون فيزا لأي مصري يحمل تأشيرة شنغن متعددة سارية أو تأشيرة أمريكا.', officialVisaPortal: 'http://www.mvp.gov.ba', popularHighlight: 'سراييفو، موستار، شلالات كرافيتسا' },
      { countryName: 'سلطنة عمان', flag: '🇴🇲', type: 'easy_evisa', typeLabel: 'تأشيرة إلكترونية فورية / دخول مجاني لحاملي إقامة الخليج وشنغن', stayLimit: '14 إلى 30 يوماً', notes: 'دخول بدون تأشيرة حتى 14 يوماً لحاملي إقامة الخليج أو تأشيرة شنغن/أمريكا/بريطانيا، أو إلكترونية.', officialVisaPortal: 'https://evisa.rop.gov.om', popularHighlight: 'مسقط، صلالة، الجبل الأخضر' },
      { countryName: 'الإمارات العربية المتحدة', flag: '🇦🇪', type: 'easy_evisa', typeLabel: 'تأشيرة سياحية إلكترونية فورية عبر طيران الإمارات وفلاي دبي', stayLimit: '30 إلى 60 يوماً', notes: 'تصدر إلكترونياً خلال 24-48 ساعة عبر خطوط الطيران أو الفنادق أو منصة GDRFA / ICP.', officialVisaPortal: 'https://smartservices.icp.gov.ae', popularHighlight: 'دبي، أبوظبي، الشارقة، رأس الخيمة' },
      { countryName: 'المملكة العربية السعودية', flag: '🇸🇦', type: 'easy_evisa', typeLabel: 'تأشيرة سياحية وعمرة إلكترونية فورية (لمقيمي الخليج أو حاملي شنغن/أمريكا/بريطانيا)', stayLimit: '90 يوماً', notes: 'تأشيرة فورية عبر منصة نسك KSA Visa لكافة مقيمي الخليج أو حاملي شنغن أو أمريكا أو بريطانيا.', officialVisaPortal: 'https://visa.visitsaudi.com', popularHighlight: 'مكة، المدينة، العلا، الرياض، جدة' },
    ],
  },
  GCC: {
    passportCode: 'GCC',
    passportName: 'جوازات دول الخليج العربي (السعودية، الإمارات، الكويت، قطر، عمان، البحرين) 🇸🇦🇦🇪🇰🇼🇶🇦🇴🇲🇧🇭',
    flag: '🇸🇦',
    totalEasyCountries: 175,
    countries: [
      { countryName: 'كافة دول مجلس التعاون الخليجي', flag: '🇸🇦🇦🇪🇰🇼🇶🇦🇴🇲🇧🇭', type: 'visa_free', typeLabel: 'تنقل بالهوية الوطنية بدون جواز أو تأشيرة', stayLimit: 'إقامة مفتوحة', notes: 'تنقل حر كامل بالبطاقة المدنية بين السعودية، الإمارات، الكويت، قطر، عمان، البحرين.', popularHighlight: 'مكة، المدينة، الرياض، دبي، الدوحة، مسقط' },
      { countryName: 'المملكة المتحدة (بريطانيا)', flag: '🇬🇧', type: 'easy_evisa', typeLabel: 'تصريح سفر إلكتروني فوري UK ETA', stayLimit: '6 أشهر لكل زيارة على مدار عامين', notes: 'تصريح ETA فوري عبر تطبيق الجوال خلال دقائق بتكلفة 10 جنيهات فقط.', officialVisaPortal: 'https://www.gov.uk/electronic-travel-authorisation-eta', popularHighlight: 'لندن، مانشستر، إدنبرة، أكسفورد' },
      { countryName: 'منطقة الشنغن الأوروبية (فرنسا، سويسرا، إيطاليا، ألمانيا، النمسا)', flag: '🇪🇺', type: 'schengen_us_exempt', typeLabel: 'تأشيرة شلال الشنغن (Cascade Visa) لـ 5 سنوات أو إعفاء كامل', stayLimit: '90 يوماً', notes: 'يحصل مواطنو الخليج على تأشيرة شنغن متعددة السفرات لـ 5 سنوات من أول تقديم (والإمارات معفية تماماً).', officialVisaPortal: 'https://eeas.europa.eu', popularHighlight: 'باريس، إنترلاكن، ميلانو، فيينا' },
      { countryName: 'جورجيا', flag: '🇬🇪', type: 'visa_free', typeLabel: 'بدون تأشيرة إطلاقاً لمدة عام كامل (365 يوماً)', stayLimit: '365 يوماً', notes: 'دخول حر مباشر لمواطني الخليج والإقامة لمدة سنة كاملة بدون أي إجراءات.', officialVisaPortal: 'https://www.geoconsul.gov.ge', popularHighlight: 'تبليسي، باتومي، غوداوري، برجومي' },
      { countryName: 'البوسنة والهرسك', flag: '🇧🇦', type: 'visa_free', typeLabel: 'بدون تأشيرة إطلاقاً', stayLimit: '90 يوماً', notes: 'دخول حر ومباشر لكافة مواطني دول الخليج العربي.', officialVisaPortal: 'http://www.mvp.gov.ba', popularHighlight: 'سراييفو، موستار، كونيتس، ترافنيك' },
      { countryName: 'أذربيجان', flag: '🇦🇿', type: 'visa_on_arrival', typeLabel: 'تأشيرة فورية مجانية في المطار', stayLimit: '30 يوماً', notes: 'ختم فوري مباشر في مطار حيدر علييف بباكو لكافة مواطني الخليج.', officialVisaPortal: 'https://evisa.gov.az', popularHighlight: 'باكو، غابالا، شاهداغ، قوبا' },
      { countryName: 'تركيا', flag: '🇹🇷', type: 'visa_free', typeLabel: 'بدون تأشيرة إطلاقاً (معفى بالكامل)', stayLimit: '90 يوماً', notes: 'دخول حر ومباشر لمواطني السعودية، الإمارات، الكويت، قطر، عمان، البحرين.', officialVisaPortal: 'https://www.evisa.gov.tr', popularHighlight: 'إسطنبول، طرابزون، كابادوكيا، بورصة' },
      { countryName: 'اليابان', flag: '🇯🇵', type: 'easy_evisa', typeLabel: 'تأشيرة إلكترونية فورية (eVisa) / إعفاء للإمارات', stayLimit: '90 يوماً', notes: 'إصدار تأشيرة إلكترونية فورية عبر الإنترنت خلال 72 ساعة أو إعفاء كامل.', officialVisaPortal: 'https://www.evisa.mofa.go.jp', popularHighlight: 'طوكيو، كيوتو، أوساكا، جبل فوجي' },
      { countryName: 'كوريا الجنوبية', flag: '🇰🇷', type: 'easy_evisa', typeLabel: 'تصريح سفر إلكتروني فوري K-ETA', stayLimit: '90 يوماً', notes: 'تسجيل تصريح K-ETA عبر التطبيق والموقع في 10 دقائق.', officialVisaPortal: 'https://www.k-eta.go.kr', popularHighlight: 'سول، جزيرة جيجو، بوسان' },
      { countryName: 'ماليزيا', flag: '🇲🇾', type: 'visa_free', typeLabel: 'بدون تأشيرة إطلاقاً', stayLimit: '90 يوماً', notes: 'دخول مباشر مجاني لـ 90 يوماً.', officialVisaPortal: 'https://imigresen-online.imi.gov.my', popularHighlight: 'كوالالمبور، لنكاوي، بينانج، جينتنج' },
      { countryName: 'تايلاند', flag: '🇹🇭', type: 'visa_free', typeLabel: 'بدون تأشيرة إطلاقاً لمدة 60 يوماً', stayLimit: '60 يوماً', notes: 'إعفاء كامل وتمديد مدة الإقامة لمواطني الخليج حتى 60 يوماً مجاناً.', officialVisaPortal: 'https://www.thaievisa.go.th', popularHighlight: 'بانكوك، بوكيت، ساموي، كرابي' },
      { countryName: 'إندونيسيا (بالي)', flag: '🇮🇩', type: 'visa_on_arrival', typeLabel: 'تأشيرة فورية بالمطار / إلكترونية (e-VoA)', stayLimit: '30 يوماً', notes: 'تأشيرة فورية بالمطار أو إلكترونية مسبقة.', officialVisaPortal: 'https://molina.imigrasi.go.id', popularHighlight: 'جزيرة بالي، أوبود، لومبوك' },
      { countryName: 'جزر المالديف', flag: '🇲🇻', type: 'visa_free', typeLabel: 'تأشيرة مجانية فورية عند الوصول', stayLimit: '30 يوماً', notes: 'دخول مجاني فوري لجميع مواطني الخليج.', officialVisaPortal: 'https://imuga.immigration.gov.mv', popularHighlight: 'المنتجعات الفاخرة فوق الماء' },
      { countryName: 'موريشيوس وسيشل', flag: '🇲🇺🇸🇨', type: 'visa_free', typeLabel: 'بدون تأشيرة إطلاقاً', stayLimit: '90 يوماً', notes: 'دخول حر وسياحي مباشر ومجاني.', officialVisaPortal: 'https://passport.govmu.org', popularHighlight: 'جزر المحيط الهندي الاستوائية' },
      { countryName: 'ألبانيا والجبل الأسود (مونتينيغرو)', flag: '🇦🇱🇲🇪', type: 'visa_free', typeLabel: 'بدون تأشيرة إطلاقاً لمواطني الخليج', stayLimit: '90 يوماً', notes: 'دخول بدون فيزا طوال العام أو في المواسم السياحية.', officialVisaPortal: 'https://e-visa.al', popularHighlight: 'خليج كوتور، بودفا، تيرانا' },
      { countryName: 'سنغافورة', flag: '🇸🇬', type: 'visa_free', typeLabel: 'بدون تأشيرة إطلاقاً', stayLimit: '30 يوماً', notes: 'دخول حر فوري عبر مطار شانغي العالمي.', officialVisaPortal: 'https://eservices.ica.gov.sg', popularHighlight: 'مارينا باي، سنتوسا، غاردنز باي' },
    ],
  },
  ARAB: {
    passportCode: 'ARAB',
    passportName: 'كافة الجوازات العربية (الأردن، المغرب، تونس، الجزائر، لبنان، العراق، إلخ) 🇯🇴🇲🇦🇹🇳🇩🇿🇱🇧',
    flag: '🌍',
    totalEasyCountries: 65,
    countries: [
      { countryName: 'ماليزيا', flag: '🇲🇾', type: 'visa_free', typeLabel: 'بدون تأشيرة لمعظم الدول العربية', stayLimit: '30 إلى 90 يوماً', notes: 'دخول مجاني مباشر لمعظم حاملي الجوازات العربية.', officialVisaPortal: 'https://imigresen-online.imi.gov.my', popularHighlight: 'كوالالمبور، لنكاوي، بينانج' },
      { countryName: 'إندونيسيا (بالي)', flag: '🇮🇩', type: 'visa_on_arrival', typeLabel: 'تأشيرة فورية عند الوصول بالمطار', stayLimit: '30 يوماً', notes: 'تأشيرة فورية بالمطار مع إمكانية التقديم الإلكتروني.', officialVisaPortal: 'https://molina.imigrasi.go.id', popularHighlight: 'بالي، جاكرتا، لومبوك' },
      { countryName: 'جزر المالديف', flag: '🇲🇻', type: 'visa_free', typeLabel: 'تأشيرة مجانية فورية عند الوصول', stayLimit: '30 يوماً', notes: 'مفتوحة لكافة الجنسيات العربية بدون استثناء.', officialVisaPortal: 'https://imuga.immigration.gov.mv', popularHighlight: 'المنتجعات والأنشطة المائية' },
      { countryName: 'سيشل وموريشيوس', flag: '🇸🇨🇲🇺', type: 'visa_free', typeLabel: 'تصريح سفر مجاني عند الوصول', stayLimit: '30 إلى 90 يوماً', notes: 'دخول مجاني بمجرد وجود حجز فندق وتذكرة عودة.', officialVisaPortal: 'https://seychelles.govtas.com', popularHighlight: 'شواطئ المحيط الهندي' },
      { countryName: 'جورجيا', flag: '🇬🇪', type: 'schengen_us_exempt', typeLabel: 'دخول بدون فيزا لمقيمي الخليج أو حاملي شنغن وأمريكا', stayLimit: '90 يوماً', notes: 'إعفاء كامل للمقيمين في دول الخليج أو من يحمل تأشيرة أمريكا/شنغن/بريطانيا سارية.', officialVisaPortal: 'https://www.evisa.gov.ge', popularHighlight: 'تبليسي، باتومي، القوقاز' },
      { countryName: 'أذربيجان', flag: '🇦🇿', type: 'easy_evisa', typeLabel: 'تأشيرة إلكترونية فورية (ASAN Visa)', stayLimit: '30 يوماً', notes: 'تأشيرة إلكترونية تصدر خلال ساعات عبر الموقع الرسمي.', officialVisaPortal: 'https://evisa.gov.az', popularHighlight: 'باكو، غابالا، شاهداغ' },
      { countryName: 'تنزانيا وزنجبار', flag: '🇹🇿', type: 'visa_on_arrival', typeLabel: 'تأشيرة فورية بالمطار (50$)', stayLimit: '90 يوماً', notes: 'تأشيرة فورية بمطار زنجبار أو دار السلام لكافة الجنسيات.', officialVisaPortal: 'https://visa.immigration.go.tz', popularHighlight: 'زنجبار، دار السلام، كليمنجارو' },
      { countryName: 'كينيا', flag: '🇰🇪', type: 'easy_evisa', typeLabel: 'تصريح سفر إلكتروني فوري eTA', stayLimit: '90 يوماً', notes: 'إلغاء التأشيرات واعتماد تصريح eTA الفوري لجميع دول العالم.', officialVisaPortal: 'https://www.etakenya.go.ke', popularHighlight: 'نيروبي، ماساي مارا، مومباسا' },
      { countryName: 'تركيا', flag: '🇹🇷', type: 'easy_evisa', typeLabel: 'تأشيرة إلكترونية فورية (لحاملي شنغن/أمريكا/بريطانيا أو فئات عمرية معينة)', stayLimit: '30 يوماً', notes: 'فيزا إلكترونية فورية للأردنيين والتونسيين والمغاربة (أو حاملي شنغن/أمريكا).', officialVisaPortal: 'https://www.evisa.gov.tr', popularHighlight: 'إسطنبول، أنطاليا، كابادوكيا' },
      { countryName: 'سلطنة عمان', flag: '🇴🇲', type: 'easy_evisa', typeLabel: 'تأشيرة إلكترونية فورية / دخول حر لمقيمي الخليج', stayLimit: '14 إلى 30 يوماً', notes: 'إعفاء حتى 14 يوماً لمقيمي الخليج أو تأشيرة إلكترونية ميسرة.', officialVisaPortal: 'https://evisa.rop.gov.om', popularHighlight: 'مسقط، صلالة، نزوى' },
      { countryName: 'المملكة العربية السعودية', flag: '🇸🇦', type: 'easy_evisa', typeLabel: 'تأشيرة زيارة وعمرة إلكترونية فورية لمقيمي دول الخليج', stayLimit: '90 يوماً', notes: 'تأشيرة فورية لكافة المهن لمقيمي دول الخليج ولحاملي تأشيرات شنغن وأمريكا وبريطانيا.', officialVisaPortal: 'https://visa.visitsaudi.com', popularHighlight: 'مكة المكرمة، المدينة المنورة، الرياض، جدة، العلا' },
    ],
  },
};

// =========================================================================
// 🏛️ GLOBAL OFFICIAL TOURS & ACTIVITIES PLATFORMS (منصات الجولات والتذاكر العالمية الرسمية)
// =========================================================================
export interface GlobalTourPlatform {
  id: string;
  name: string;
  nameEn: string;
  category: 'global_tours' | 'museum_pass' | 'rail_pass' | 'local_experiences';
  logo: string;
  officialUrl: string;
  badge: string;
  description: string;
  coveredRegions: string;
  benefits: string[];
}

export const OFFICIAL_GLOBAL_TOUR_PLATFORMS: GlobalTourPlatform[] = [
  {
    id: 'getyourguide',
    name: 'جيت يور جايد (GetYourGuide)',
    nameEn: 'GetYourGuide Official',
    category: 'global_tours',
    logo: '🎫 🌍',
    officialUrl: 'https://www.getyourguide.com',
    badge: 'المشغل الأكبر للجولات وتخطي الطوابير عالمياً',
    description: 'حجز مباشر للجولات الإرشادية، تذاكر المتاحف، القصور، والأنشطة السياحية مع تأكيد فوري وإلغاء مرن.',
    coveredRegions: 'أوروبا، أمريكا، آسيا، الشرق الأوسط، أفريقيا (أكثر من 150 دولة)',
    benefits: ['تذاكر Fast Track لتخطي طوابير الانتظار الطويلة', 'مرشدون سياحيون مرخصون بعدة لغات', 'إلغاء مجاني حتى قبل 24 ساعة من الموعد', 'تأكيد وحفظ التذاكر الرقمية والباركود أوفلاين'],
  },
  {
    id: 'viator',
    name: 'فاياتور (Viator - A Tripadvisor Company)',
    nameEn: 'Viator Official',
    category: 'global_tours',
    logo: '🗺️ ⭐',
    officialUrl: 'https://www.viator.com',
    badge: 'أكبر قاعدة جولات ومغامرات وتجارب محلية',
    description: 'منصة تريب أدفايزور الرسمية للجولات والرحلات اليومية والأنشطة البحرية والصحراوية حول العالم.',
    coveredRegions: 'أكثر من 200 دولة وإقليم حول العالم',
    benefits: ['أكثر من 300,000 جولة وتجربة موثقة بتقييمات حقيقية', 'ضمان أفضل سعر لتذاكر الجولات الرسمية', 'خدمة دعم عملاء 24/7 حول العالم', 'حجز الآن والدفع لاحقاً (Reserve Now & Pay Later)'],
  },
  {
    id: 'klook',
    name: 'كلوك (Klook Global)',
    nameEn: 'Klook Travel Official',
    category: 'global_tours',
    logo: '🎡 ⚡',
    officialUrl: 'https://www.klook.com',
    badge: 'الرائد الأول لآسيا وأوروبا ومدن الملاهي والقطارات',
    description: 'المنصة المتخصصة الأولى لحجز ديزني لاند، يونيفرسال ستوديوز، قطارات اليابان وسويسرا، وشرائح الإنترنت.',
    coveredRegions: 'اليابان، كوريا، سنغافورة، ماليزيا، تايلاند، أوروبا، دبي، بريطانيا',
    benefits: ['تذاكر ديزني ويونيفرسال الرسمية بدون طوابير', 'حجز بطاقات قطارات JR Pass السريعة وتمريرات سويسرا', 'عروض حصرية وخصومات فورية بباركود الموبايل', 'نقاط مكافآت Klook واسترداد فوري'],
  },
  {
    id: 'tiqets',
    name: 'تيكيتس (Tiqets Direct)',
    nameEn: 'Tiqets Culture & Museums',
    category: 'museum_pass',
    logo: '🏛️ 📱',
    officialUrl: 'https://www.tiqets.com',
    badge: 'بوابة التذاكر الرقمية المباشرة للمتاحف والقصور',
    description: 'ربط رقمي فوري بأشهر المتاحف الأوروبية والعالمية (اللوفر، الكولوسيوم، ساغرادا فاميليا، برج إيفل، الفاتيكان).',
    coveredRegions: 'فرنسا، إيطاليا، إسبانيا، هولندا، بريطانيا، أمريكا، الإمارات',
    benefits: ['تذاكر رقمية فورية على الهاتف بدون طباعة', 'مواعيد دخول دقيقة محجوزة مسبقاً', 'دخول مباشر دون الوقوف في شباك التذاكر', 'دليل صوتي إلكتروني مجاني مع معظم المعالم'],
  },
  {
    id: 'swiss_travel_pass',
    name: 'تذكرة السفر السويسرية الموحدة (Swiss Travel Pass)',
    nameEn: 'SBB Swiss Travel System',
    category: 'rail_pass',
    logo: '🇨🇭 🚆',
    officialUrl: 'https://www.mystsnet.com/en/swisstravelpass/',
    badge: 'المشغل الرسمي للقطارات والبحيرات والمتاحف في سويسرا',
    description: 'ركوب غير محدود لجميع قطارات وباصات وقوارب سويسرا الخلابة مع دخول مجاني لأكثر من 500 متحف.',
    coveredRegions: 'سويسرا بالكامل (إنترلاكن، زيورخ، جنيف، لوزيرن، زيرمات)',
    benefits: ['ركوب غير محدود للقطارات البانورامية وقوارب البحيرات', 'دخول مجاني لأكثر من 500 متحف وقلعة في سويسرا', 'خصم 50% على قمم الجبال والتلفريك', 'تذكرة مجانية للأطفال المرافقين (Swiss Family Card)'],
  },
  {
    id: 'eurail_pass',
    name: 'تذكرة قطارات أوروبا الموحدة (Eurail Pass)',
    nameEn: 'Eurail Official',
    category: 'rail_pass',
    logo: '🇪🇺 🚄',
    officialUrl: 'https://www.eurail.com',
    badge: 'التنقل بالقطارات السريعة بين 33 دولة أوروبية',
    description: 'تذكرة واحدة تتيح لك السفر بين باريس، لندن، ميلانو، برشلونة، فيينا، زيورخ وأمستردام بأقصى درجات المرونة.',
    coveredRegions: '33 دولة أوروبية',
    benefits: ['حرية السفر والتنقل غير المحدود بالقطارات الأوروبية', 'تطبيق Rail Planner لحجز المقاعد وإدارة الرحلات أوفلاين', 'خصومات على العبارات البحرية والفنادق التابعة', 'مرونة كاملة لتعديل مواعيد الرحلات'],
  },
];

// =========================================================================
// 🧰 ESSENTIAL GLOBAL TRAVEL ADD-ON SERVICES (جميع الخدمات الإضافية المعتمدة للمسافر)
// =========================================================================
export interface TravelAddonService {
  id: string;
  category: 'esim' | 'insurance' | 'transfer' | 'car_rental' | 'vip_lounge' | 'luggage' | 'tax_free' | 'telehealth' | 'trains';
  categoryTitle: string;
  categoryLabel?: string;
  categoryIcon: string;
  providerName: string;
  officialUrl: string;
  badge: string;
  summary: string;
  features: string[];
  tipsForTraveler: string;
}

export const GLOBAL_TRAVEL_ADDON_SERVICES: TravelAddonService[] = [
  {
    id: 'airalo_esim',
    category: 'esim',
    categoryTitle: 'شريحة الإنترنت الدولية الفورية (eSIM)',
    categoryIcon: '📶',
    providerName: 'إيرالو (Airalo eSIM) & هولافلاي (Holafly) & نوماد (Nomad)',
    officialUrl: 'https://www.airalo.com',
    badge: 'إنترنت 5G/4G فوري في أكثر من 200 دولة بدون تغيير الشريحة',
    summary: 'شريحة رقمية إلكترونية تُفعل بمسح باركود QR على هاتفك قبل الإقلاع لتتصل بالإنترنت فور هبوط الطائرة بدون رسوم تجوال باهظة مع الحفاظ على رقمك للواتساب.',
    features: [
      'باقات إنترنت محلية وإقليمية وعالمية فائقة السرعة 5G/4G',
      'تفعيل فوري بمسح رمز QR خلال دقيقة واحدة على آيفون وأندرويد',
      'الحفاظ على شريحتك ورقمك الأصلي للواتساب والاتصالات البنكية',
      'أسعار تبدأ من 4.50$ بدون عقود أو التزامات',
    ],
    tipsForTraveler: 'قم بشراء وتثبيت الـ eSIM عبر الواي فاي في المنزل قبل السفر، وفعل خط البيانات عند الهبوط في المطار مباشرة.',
  },
  {
    id: 'holafly_unlimited',
    category: 'esim',
    categoryTitle: 'إنترنت لا محدود في الخارج (Unlimited Data eSIM)',
    categoryIcon: '⚡',
    providerName: 'هولافلاي (Holafly Unlimited Data)',
    officialUrl: 'https://esim.holafly.com',
    badge: 'باقات بيانات مفتوحة وغير محدودة 100% مع دعم واتساب 24/7',
    summary: 'بيانات غير محدودة في أوروبا وأمريكا واليابان ودول آسيا دون القلق من انتهاء الرصيد، مع دعم فني متواصل عبر واتساب.',
    features: [
      'بيانات إنترنت غير محدودة طوال فترة الإقامة بالخارج',
      'دعم فني فوري باللغة العربية عبر واتساب',
      'توصيل فوري لرمز الشريحة عبر الإيميل بعد الدفع',
    ],
    tipsForTraveler: 'الخيار الأفضل لصناع المحتوى ومن يستخدمون الفيديو ومكالمات الإنترنت بكثافة.',
  },
  {
    id: 'allianz_travel_insurance',
    category: 'insurance',
    categoryTitle: 'التأمين الطبي والسياحي الدولي الشامل',
    categoryIcon: '🛡️',
    providerName: 'أليانز جلوبال (Allianz) & أكسا (AXA Assistance) & سيفيتي وينج (SafetyWing)',
    officialUrl: 'https://www.allianz-assistance.com',
    badge: 'تغطية طبية معتمدة لشنغن وكافة سفارات العالم حتى 1,000,000€',
    summary: 'وثيقة تأمين سفر معتمدة تغطي تكاليف العلاج الطبي الطارئ، دخول المستشفيات، إلغاء أو تأخر الرحلات، وفقدان الأمتعة في جميع دول العالم.',
    features: [
      'تغطية نفقات العلاج الطبي الطارئ حتى 1,000,000 يورو',
      'وثيقة معتمدة ومقبولة 100% لإصدار تأشيرة شنغن وتأشيرات العالم',
      'تعويض فوري عن تأخر أو إلغاء رحلات الطيران وفقدان الحقائب',
      'خط طوارئ طبي مجاني متوفر 24 ساعة طوال أيام الأسبوع وبعدة لغات',
    ],
    tipsForTraveler: 'تأكد من طباعة وثيقة التأمين باللغة الإنجليزية أو حفظها بصيغة PDF على هاتفك لإبرازها في المطار أو عند استخراج الفيزا.',
  },
  {
    id: 'safetywing_travel_insurance',
    category: 'insurance',
    categoryLabel: 'تأمين طبي شهري مرن للمسافرين',
    categoryTitle: 'التأمين الطبي المرن للرحلات الطويلة (SafetyWing)',
    categoryIcon: '🏥',
    providerName: 'سيفيتي وينج (SafetyWing Nomad Insurance)',
    officialUrl: 'https://safetywing.com',
    badge: 'اشتراك شهري مرن يغطي 180+ دولة وتغطية أطفال مجانية',
    summary: 'تأمين طبي مرن بنظام الاشتراك الشهري للمسافرين الدائمين، يمكن شراؤه وتفعيله حتى بعد بدء الرحلة والسفر خارج بلدك.',
    features: [
      'تغطية طبية للحوادث والأمراض المفاجئة حتى 250,000$',
      'إمكانية شراء وتجديد البوليصة أثناء تواجدك بالفعل بالخارج',
      'تغطية مجانية لطفل واحد لكل شخص بالغ مؤمن عليه',
    ],
    tipsForTraveler: 'مثالي للرحلات متعددة الدول التي لا تعرف موعد عودتها بدقة.',
  },
  {
    id: 'welcome_pickups_transfers',
    category: 'transfer',
    categoryTitle: 'استقبال وتوصيل المطار الخاص مع سائق بالاسم',
    categoryIcon: '🚘',
    providerName: 'ويلكم بيك ابس (Welcome Pickups) & بلاك لين (Blacklane VIP)',
    officialUrl: 'https://www.welcomepickups.com',
    badge: 'سائق خاص ينتظرك بالاسم داخل صالة الوصول مع تتبع الرحلة',
    summary: 'حجز سيارة خاصة وسائق محترف ينتظرك بلوحة تحمل اسمك بصالة الوصول، مع تتبع مواعيد الطيران تلقائياً دون أي رسوم إضافية عند تأخر الطائرة.',
    features: [
      'انتظار مجاني لمدة 60 دقيقة في المطار مع تتبع مواعيد الرحلة الجوية',
      'سيارات فاخرة ونظيفة (مرسيدس، بي إم دبليو، فان عائلي فسيح)',
      'سعر شامل وثابت بدون رسوم خفية أو زيادات وقت الذروة',
      'سائقون محترفون يتحدثون الإنجليزية ومدربون على مساعدة الحقائب',
    ],
    tipsForTraveler: 'حجز التوصيل قبل 24 ساعة يضمن لك وصول السيارة في موعدها وتجنب طوابير التاكسي وأسعار المطار العشوائية.',
  },
  {
    id: 'sixt_car_rental',
    category: 'car_rental',
    categoryTitle: 'استئجار السيارات ورخصة القيادة الدولية',
    categoryIcon: '🚗',
    providerName: 'سيكست (Sixt) & هيرتز (Hertz) & رينتال كارز (Rentalcars)',
    officialUrl: 'https://www.sixt.com',
    badge: 'أسطول سيارات حديث مع تأمين شامل 0% تحمل',
    summary: 'استلام سيارتك مباشرة من صالة المطار بأحدث الموديلات، مع خيارات التأمين الشامل بدون نسبة تحمل، وأجهزة GPS ومقاعد الأطفال.',
    features: [
      'استلام وتسليم سلس وسريع في أكثر من 2,500 مطار ومدينة عالمية',
      'تأمين شامل بدون نسبة تحمل (Full Protection / Zero Deductible)',
      'كيلومترات غير محدودة لمعظم الوجهات السياحية',
      'إلغاء وتعديل مجاني حتى قبل 48 ساعة من موعد الاستلام',
    ],
    tipsForTraveler: 'احرص على استخراج الرخصة الدولية (IDP) قبل السفر وبطاقة ائتمانية (Credit Card) باسم السائق الرئيسي لحجز مبلغ التأمين المسترد.',
  },
  {
    id: 'trainline_eurail_passes',
    category: 'trains',
    categoryTitle: 'تذاكر القطارات السريعة والبطاقات الأوروبية الشاملة',
    categoryIcon: '🚄',
    providerName: 'ترين لاين (Trainline) & يوريل باس (Eurail Pass) & سويس باس (Swiss Pass)',
    officialUrl: 'https://www.thetrainline.com',
    badge: 'حجز قطارات يوروستار، TGV، إيتالو، وسويسرا الموحدة',
    summary: 'المنصة الموحدة لحجز قطارات أوروبا فائقة السرعة، وبطاقة Eurail للتنقل الحر بين 33 دولة وبطاقة Swiss Travel Pass الشاملة بسويسرا.',
    features: [
      'تذاكر إلكترونية فورية على الجوال مع حفظها في Apple Wallet',
      'مقارنة أسعار وتوقيتات جميع مشغلي القطارات السريعة',
      'تذاكر موحدة تغطي القطارات والباصات والقوارب والقمم الجبلية',
    ],
    tipsForTraveler: 'حجز قطارات يوروستار وTGV مبكراً يوفر ما يصل إلى 60% من سعر التذكرة.',
  },
  {
    id: 'priority_pass_lounges',
    category: 'vip_lounge',
    categoryTitle: 'صالات كبار الشخصيات بالمطارات والمسار السريع (Fast Track)',
    categoryIcon: '🛋️',
    providerName: 'برايورتي باس (Priority Pass) & دراجون باس (DragonPass)',
    officialUrl: 'https://www.prioritypass.com',
    badge: 'دخول أكثر من 1,500 صالة VIP في مطارات العالم',
    summary: 'استمتع بالراحة، المأكولات والمشروبات الفاخرة المجانية، الواي فاي فائق السرعة، ومناطق الاسترخاء والشاور قبل رحلتك وخلال فترات الترانزيت.',
    features: [
      'بوفيه مفتوح من المأكولات والمشروبات الساخنة والباردة مجاناً',
      'غرف هادئة للعمل، مقابس شحن، ومناطق استراحة وشاور',
      'تجاوز زحام صالات الانتظار العامة وتخطي طوابير التفتيش',
      'إمكانية مرافقة العائلة والأصدقاء ببطاقة العضوية الرقمية',
    ],
    tipsForTraveler: 'العديد من البطاقات البنكية الخليجية والمصرية (Visa Signature/Infinite وMastercard World) تمنحك دخولاً مجانياً عبر LoungeKey.',
  },
  {
    id: 'bounce_luggage_storage',
    category: 'luggage',
    categoryTitle: 'حفظ وتوصيل الحقائب والأمتعة الفندقية',
    categoryIcon: '🧳',
    providerName: 'باونس (Bounce Luggage) & سِند ماي باج (Send My Bag)',
    officialUrl: 'https://usebounce.com',
    badge: 'أكثر من 10,000 موقع آمن لحفظ الحقائب حول العالم مع تأمين 10,000$',
    summary: 'تخلص من عناء سحب الحقائب الثقيلة قبل موعد تسجيل دخول الفندق أو بعد تسجيل الخروج، واحفظها بأمان قرب محطات القطار والمعالم بسعر رمزي.',
    features: [
      'حفظ آمن في فنادق ومتاجر ومحطات مركزية معتمدة',
      'ضمان وتأمين على كل حقيبة حتى 10,000$',
      'حجز وإلغاء فوري عبر تطبيق الجوال',
      'أسعار تبدأ من 5$ لليوم الواحد بدون قيود على حجم الحقيبة',
    ],
    tipsForTraveler: 'مثالية للأيام الأولى والأخيرة من الرحلة لاستغلال كل ساعة في استكشاف المدينة بدون حقائب تعيق حركتك.',
  },
  {
    id: 'global_blue_tax_free',
    category: 'tax_free',
    categoryTitle: 'استرداد الضرائب للمسافرين (Tax Free Shopping Refund)',
    categoryIcon: '💶',
    providerName: 'جلوبال بلو (Global Blue) & بلانيت تاكس فري (Planet Tax Free)',
    officialUrl: 'https://www.globalblue.com',
    badge: 'استرداد حتى 19% من قيمة مشترياتك في أوروبا والعالم',
    summary: 'استرجع ضريبة القيمة المضافة (VAT) على مشترياتك من الملابس، الإلكترونيات، والعطور نقداً أو على بطاقتك البنكية في المطار قبل مغادرتك.',
    features: [
      'استرداد يصل من 10% إلى 19% من قيمة فواتير التسوق المؤهلة',
      'أكشاك مسح رقمي سريعة في المطارات الأوروبية والعالمية',
      'تحويل فوري للأموال إلى بطاقة الائتمان أو نقداً بالعملة المطلوبة',
      'تطبيق ذكي لتتبع جميع الفواتير والمبالغ المستردة خطوة بخطوة',
    ],
    tipsForTraveler: 'اطلب دائماً نموذج Tax-Free Form وجواز سفرك معك عند الشراء من المتاجر، واختم الفواتير من الجمارك في المطار قبل تسليم الحقائب.',
  },
  {
    id: 'telehealth_travel_doctor',
    category: 'telehealth',
    categoryTitle: 'استشارات طبية ورعاية طوارئ 24/7 عن بُعد',
    categoryIcon: '🩺',
    providerName: 'ترافيل دوكتور (Travel Health & Medical Advisory 24/7) & بوبا العالمية',
    officialUrl: 'https://www.iamat.org',
    badge: 'أطباء معتمدون واستشارات فورية بلغتك أينما كنت',
    summary: 'خدمة استشارات طبية فورية بالصوت والفيديو مع أطباء معتمدين، لتشخيص الحالات المفاجئة، وصف الأدوية المصرح بها دولياً، وإرشادك لأقرب مستشفى.',
    features: [
      'استشارات فورية بالفيديو مع أطباء يتحدثون العربية والإنجليزية',
      'توجيه طبي فوري لحالات الحساسية، النزلات المعوية، ودوار المرتفعات والسفر',
      'إرشادات استخدام الأدوية واللقاحات المطلوبة لكل وجهة حول العالم',
      'تحديد المستشفيات والصيدليات المعتمدة الأقرب لموقعك الجغرافي',
    ],
    tipsForTraveler: 'احتفظ دائماً بقائمة أدويتك الخاصة واسمها العلمي باللغة الإنجليزية في هاتفك لسهولة الاستشارة والصرف من الصيدليات الدولية.',
  },
];

export function searchGlobalDestinations(query: string) {
  if (!query || !query.trim()) return [];
  const q = query.trim().toLowerCase();

  const results: Array<{
    country: string;
    city: string;
    province?: string;
    fullTitle: string;
    flag: string;
    landmark: string;
    imageUrl: string;
    currency: string;
  }> = [];

  for (const c of GLOBAL_COUNTRIES) {
    // Check country match
    const countryMatch = c.name.toLowerCase().includes(q) || c.nameEn.toLowerCase().includes(q);
    
    for (const city of c.popularCities) {
      const cityMatch = city.name.toLowerCase().includes(q) || (city.province && city.province.toLowerCase().includes(q)) || city.landmark.toLowerCase().includes(q) || countryMatch;
      if (cityMatch) {
        results.push({
          country: c.name,
          city: city.name,
          province: city.province,
          fullTitle: `${city.name}، ${c.name}`,
          flag: c.flag,
          landmark: city.landmark,
          imageUrl: city.imageUrl,
          currency: c.currency,
        });
      }
    }
  }

  return results;
}


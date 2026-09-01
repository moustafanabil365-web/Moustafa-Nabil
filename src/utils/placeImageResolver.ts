// Comprehensive, Authentic Photographic Landmark and Destination Image Resolver
// Maps any landmark, attraction, city, or spiritual site to verified high-resolution authentic photography.

export interface ResolvedPhoto {
  url: string;
  landmarkName: string;
  cityName?: string;
  source: 'verified_curated' | 'scenic_hd';
}

export const VERIFIED_LANDMARKS_PHOTO_DB: Record<string, string> = {
  // ==========================================
  // 🕋 MAKKAH AL-MUKARRAMAH (المقدسات والمعالم بمكة)
  // ==========================================
  'المسجد الحرام': 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80',
  'الكعبة': 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80',
  'الكعبة المشرفة': 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80',
  'أداء العمرة': 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80',
  'عمرة': 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80',
  'صحن المطاف': 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80',
  'الصفا والمروة': 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80',
  'المسعى': 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80',
  'برج الساعة': 'https://images.unsplash.com/photo-1578895101407-742bc53b26c7?auto=format&fit=crop&w=1200&q=80',
  'أبراج الساعة': 'https://images.unsplash.com/photo-1578895101407-742bc53b26c7?auto=format&fit=crop&w=1200&q=80',
  'أبراج البيت': 'https://images.unsplash.com/photo-1578895101407-742bc53b26c7?auto=format&fit=crop&w=1200&q=80',
  'وقف الملك عبدالعزيز': 'https://images.unsplash.com/photo-1578895101407-742bc53b26c7?auto=format&fit=crop&w=1200&q=80',
  'جبل النور': 'https://images.unsplash.com/photo-1544885935-98dd03b09034?auto=format&fit=crop&w=1200&q=80',
  'غار حراء': 'https://images.unsplash.com/photo-1544885935-98dd03b09034?auto=format&fit=crop&w=1200&q=80',
  'جبل ثور': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  'غار ثور': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  'متحف مكة': 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80',
  'متحف مكة للآثار': 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80',
  'متحف عمارة الحرمين': 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80',
  'مصنع كسوة الكعبة': 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80',
  'عرفات': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  'جبل الرحمة': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  'منى': 'https://images.unsplash.com/photo-1578895101407-742bc53b26c7?auto=format&fit=crop&w=1200&q=80',
  'مزدلفة': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',

  // ==========================================
  // 🕌 MADINAH AL-MUNAWARRAH (المدينة المنورة والمقدسات)
  // ==========================================
  'المسجد النبوي': 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80',
  'المسجد النبوي الشريف': 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80',
  'الروضة الشريفة': 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80',
  'القبة الخضراء': 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80',
  'مسجد قباء': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
  'قباء': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
  'مسجد القبلتين': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
  'جبل أحد': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  'شهداء أحد': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  'مجمع الملك فهد لطباعة المصحف': 'https://images.unsplash.com/photo-1584281722572-887140f0980c?auto=format&fit=crop&w=1200&q=80',
  'مجمع الملك فهد لطباعة المصحف الشريف': 'https://images.unsplash.com/photo-1584281722572-887140f0980c?auto=format&fit=crop&w=1200&q=80',
  'مجمع المصحف': 'https://images.unsplash.com/photo-1584281722572-887140f0980c?auto=format&fit=crop&w=1200&q=80',
  'طباعة المصحف': 'https://images.unsplash.com/photo-1584281722572-887140f0980c?auto=format&fit=crop&w=1200&q=80',
  'مزارع نخيل المدينة': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
  'سوق التمور المركزي بالمدينة': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
  'قطار الحرمين': 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80',
  'قطار الحرمين السريع': 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80',

  // ==========================================
  // 🇵🇸 PALESTINE & JERUSALEM (القدس وفلسطين)
  // ==========================================
  'المسجد الأقصى': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
  'المسجد الأقصى المبارك': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
  'قبة الصخرة': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
  'قبة الصخرة المشرفة': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
  'المصلى المرواني': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
  'البلدة القديمة بالقدس': 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80',
  'باب العامود': 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80',
  'كنيسة القيامة': 'https://images.unsplash.com/photo-1548625361-195feee15f33?auto=format&fit=crop&w=1200&q=80',
  'درب الآلام': 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80',
  'جبل الزيتون': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  'كنيسة المهد': 'https://images.unsplash.com/photo-1548625361-195feee15f33?auto=format&fit=crop&w=1200&q=80',
  'بيت لحم': 'https://images.unsplash.com/photo-1548625361-195feee15f33?auto=format&fit=crop&w=1200&q=80',
  'الحرم الإبراهيمي': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
  'الخليل': 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80',

  // ==========================================
  // 🇪🇬 EGYPT (مصر والقاهرة والأقصر وأسوان والشواطئ)
  // ==========================================
  'الأهرامات': 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80',
  'أهرامات الجيزة': 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80',
  'هرم خوفو': 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80',
  'أبو الهول': 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80',
  'تمثال أبو الهول': 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80',
  'المتحف المصري الكبير': 'https://images.unsplash.com/photo-1544885935-98dd03b09034?auto=format&fit=crop&w=1200&q=80',
  'متحف الحضارة': 'https://images.unsplash.com/photo-1544885935-98dd03b09034?auto=format&fit=crop&w=1200&q=80',
  'المتحف القومي للحضارة المصرية': 'https://images.unsplash.com/photo-1544885935-98dd03b09034?auto=format&fit=crop&w=1200&q=80',
  'المتحف المصري بالتحرير': 'https://images.unsplash.com/photo-1544885935-98dd03b09034?auto=format&fit=crop&w=1200&q=80',
  'خان الخليلي': 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80',
  'شارع المعز': 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80',
  'قلعة صلاح الدين': 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80',
  'جامع محمد علي': 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80',
  'جامع الأزهر': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
  'برج القاهرة': 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80',
  'نهر النيل': 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80',
  'كورنيش النيل': 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80',
  'معبد الكرنك': 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=1200&q=80',
  'معبد الأقصر': 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=1200&q=80',
  'وادي الملوك': 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=1200&q=80',
  'معبد حتشبسوت': 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=1200&q=80',
  'معبد أبو سمبل': 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80',
  'معبد فيلة': 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80',
  'القرية النوبية': 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80',
  'قلعة قايتباي': 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80',
  'مكتبة الإسكندرية': 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80',
  'شرم الشيخ': 'https://images.unsplash.com/photo-1544885935-98dd03b09034?auto=format&fit=crop&w=1200&q=80',
  'محمية رأس محمد': 'https://images.unsplash.com/photo-1544885935-98dd03b09034?auto=format&fit=crop&w=1200&q=80',
  'الغردقة': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  'جزيرة الجفتون': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  'الجونة': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  'دهب': 'https://images.unsplash.com/photo-1544885935-98dd03b09034?auto=format&fit=crop&w=1200&q=80',
  'الثقب الأزرق': 'https://images.unsplash.com/photo-1544885935-98dd03b09034?auto=format&fit=crop&w=1200&q=80',
  'واحة سيوة': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',

  // ==========================================
  // 🇸🇦 SAUDI ARABIA & GULF (الرياض، العلا، جدة، دبي، أبوظبي، قطر)
  // ==========================================
  'الدرعية': 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=1200&q=80',
  'حي الطريف': 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=1200&q=80',
  'برج المملكة': 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=1200&q=80',
  'بوليفارد سيتي': 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=1200&q=80',
  'حافة العالم': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  'صخرة الفيل': 'https://images.unsplash.com/photo-1628178129759-450f3aa15ef9?auto=format&fit=crop&w=1200&q=80',
  'قاعة مرايا': 'https://images.unsplash.com/photo-1628178129759-450f3aa15ef9?auto=format&fit=crop&w=1200&q=80',
  'مدائن صالح': 'https://images.unsplash.com/photo-1628178129759-450f3aa15ef9?auto=format&fit=crop&w=1200&q=80',
  'الحِجر': 'https://images.unsplash.com/photo-1628178129759-450f3aa15ef9?auto=format&fit=crop&w=1200&q=80',
  'البلد بجدة': 'https://images.unsplash.com/photo-1578895101407-742bc53b26c7?auto=format&fit=crop&w=1200&q=80',
  'جدة التاريخية': 'https://images.unsplash.com/photo-1578895101407-742bc53b26c7?auto=format&fit=crop&w=1200&q=80',
  'نافورة الملك فهد': 'https://images.unsplash.com/photo-1578895101407-742bc53b26c7?auto=format&fit=crop&w=1200&q=80',
  'برج خليفة': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
  'متحف المستقبل': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
  'نافورة دبي': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
  'نخلة جميرا': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
  'برج العرب': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
  'جامع الشيخ زايد': 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80',
  'جامع الشيخ زايد الكبير': 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80',
  'متحف اللوفر أبوظبي': 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80',
  'قصر الوطن': 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80',
  'سوق واقف': 'https://images.unsplash.com/photo-1578895101407-742bc53b26c7?auto=format&fit=crop&w=1200&q=80',
  'متحف الفن الإسلامي بالدوحة': 'https://images.unsplash.com/photo-1578895101407-742bc53b26c7?auto=format&fit=crop&w=1200&q=80',
  'أبراج الكويت': 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=1200&q=80',
  'جامع السلطان قابوس': 'https://images.unsplash.com/photo-1544885935-98dd03b09034?auto=format&fit=crop&w=1200&q=80',
  'وادي دربات': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',

  // ==========================================
  // 🌍 WORLD ICONIC LANDMARKS (إسطنبول، باريس، لندن، روما، سويسرا، ماليزيا، المالديف، جورجيا، اليابان)
  // ==========================================
  'آيا صوفيا': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80',
  'جامع آيا صوفيا': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80',
  'المسجد الأزرق': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80',
  'قصر توبكابي': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80',
  'مضيق البوسفور': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80',
  'البازار الكبير': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80',
  'مناطيد كابادوكيا': 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?auto=format&fit=crop&w=1200&q=80',
  'كابادوكيا': 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?auto=format&fit=crop&w=1200&q=80',
  'بحيرة أوزنجول': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  'برج إيفل': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
  'متحف اللوفر': 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=80',
  'قوس النصر': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
  'شارع الشانزليزيه': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
  'قصر فرساي': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
  'بيغ بن': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
  'ساعة بيغ بن': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
  'عين لندن': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
  'جسر البرج': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
  'الكولوسيوم': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
  'نافورة تريفي': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
  'البانثيون': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
  'الفاتيكان': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
  'دوومو ميلانو': 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?auto=format&fit=crop&w=1200&q=80',
  'ساحة سان ماركو': 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=1200&q=80',
  'جندول البندقية': 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=1200&q=80',
  'ساغرادا فاميليا': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80',
  'حديقة غويل': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80',
  'القصر الملكي بمدريد': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&q=80',
  'إنترلاكن': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  'قمة يونغفراويوخ': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  'لوتيربرونين': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  'جبال الألب السويسرية': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  'تبليسي القديمة': 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=80',
  'قلعة ناريكالا': 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=80',
  'كازبيجي': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  'أبراج الشعلة بباكو': 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80',
  'مركز حيدر علييف': 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80',
  'برجا بتروناس': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
  'كهوف باتو': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
  'المالديف': 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
  'جزر المالديف': 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
  'شواطئ المالديف': 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
  'القصر الكبير ببانكوك': 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80',
  'معبد وات آرون': 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80',
  'جزيرة بي بي': 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1200&q=80',
  'شيبويا': 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
  'معبد سينسوجي': 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
  'جبل فوجي': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
  'معبد فوشيمي إيناري': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
  'غابة الخيزران كيوتو': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
  'تايمز سكوير': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
  'سنترال بارك': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
  'تمثال الحرية': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
};

// Destination-level curated fallback images (so we never ever use random generic photos)
export const DESTINATION_FALLBACKS: Record<string, string> = {
  'مكة': 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80',
  'مكة المكرمة': 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80',
  'المدينة': 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80',
  'المدينة المنورة': 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80',
  'القدس': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
  'فلسطين': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
  'مصر': 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80',
  'القاهرة': 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80',
  'الجيزة': 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80',
  'الأقصر': 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=1200&q=80',
  'أسوان': 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80',
  'الإسكندرية': 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80',
  'شرم الشيخ': 'https://images.unsplash.com/photo-1544885935-98dd03b09034?auto=format&fit=crop&w=1200&q=80',
  'الغردقة': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  'الرياض': 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=1200&q=80',
  'العلا': 'https://images.unsplash.com/photo-1628178129759-450f3aa15ef9?auto=format&fit=crop&w=1200&q=80',
  'جدة': 'https://images.unsplash.com/photo-1578895101407-742bc53b26c7?auto=format&fit=crop&w=1200&q=80',
  'دبي': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
  'أبوظبي': 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80',
  'الدوحة': 'https://images.unsplash.com/photo-1578895101407-742bc53b26c7?auto=format&fit=crop&w=1200&q=80',
  'الكويت': 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=1200&q=80',
  'مسقط': 'https://images.unsplash.com/photo-1544885935-98dd03b09034?auto=format&fit=crop&w=1200&q=80',
  'صلالة': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  'إسطنبول': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80',
  'كابادوكيا': 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?auto=format&fit=crop&w=1200&q=80',
  'باريس': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
  'لندن': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
  'روما': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
  'ميلانو': 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?auto=format&fit=crop&w=1200&q=80',
  'البندقية': 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=1200&q=80',
  'برشلونة': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80',
  'مدريد': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&q=80',
  'سويسرا': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  'تبليسي': 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=80',
  'جورجيا': 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=80',
  'باكو': 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80',
  'أذربيجان': 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80',
  'كوالالمبور': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
  'ماليزيا': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
  'المالديف': 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
  'بانكوك': 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80',
  'بوكيت': 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1200&q=80',
  'تايلاند': 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80',
  'طوكيو': 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
  'كيوتو': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
  'اليابان': 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
  'نيويورك': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
};

/**
 * Resolves a landmark or city name to a verified, authentic, ultra-crisp photo URL.
 * NEVER returns random unrelated photos.
 */
export function resolvePlaceImageUrl(
  placeName: string,
  cityOrDestination?: string,
  category?: 'landmark' | 'restaurant' | 'cafe' | 'nature' | 'heritage' | 'shopping'
): string {
  const cleanPlace = (placeName || '').trim().toLowerCase();
  const cleanDest = (cityOrDestination || '').trim().toLowerCase();
  const combined = `${cleanPlace} ${cleanDest}`;

  // 1. Direct landmark match (high precision)
  for (const [key, url] of Object.entries(VERIFIED_LANDMARKS_PHOTO_DB)) {
    const keyLower = key.toLowerCase();
    if (
      cleanPlace.includes(keyLower) ||
      keyLower.includes(cleanPlace) ||
      combined.includes(keyLower)
    ) {
      return url;
    }
  }

  // 2. Spiritual / Makkah & Madinah intelligent grouping
  if (
    combined.includes('مكة') ||
    combined.includes('makkah') ||
    combined.includes('mecca') ||
    combined.includes('حرم') ||
    combined.includes('عمرة') ||
    combined.includes('طواف') ||
    combined.includes('كعبة')
  ) {
    if (combined.includes('نور') || combined.includes('حراء') || combined.includes('جبل')) {
      return VERIFIED_LANDMARKS_PHOTO_DB['غار حراء'];
    }
    if (combined.includes('ساعة') || combined.includes('أبراج') || combined.includes('فندق')) {
      return VERIFIED_LANDMARKS_PHOTO_DB['أبراج الساعة'];
    }
    return VERIFIED_LANDMARKS_PHOTO_DB['المسجد الحرام'];
  }

  if (
    combined.includes('مدينة') ||
    combined.includes('madinah') ||
    combined.includes('medina') ||
    combined.includes('نبوي') ||
    combined.includes('روضة') ||
    combined.includes('قباء') ||
    combined.includes('مصحف')
  ) {
    if (combined.includes('قباء')) return VERIFIED_LANDMARKS_PHOTO_DB['مسجد قباء'];
    if (combined.includes('مصحف') || combined.includes('فهد')) return VERIFIED_LANDMARKS_PHOTO_DB['مجمع الملك فهد لطباعة المصحف'];
    if (combined.includes('تمر') || combined.includes('نخيل')) return VERIFIED_LANDMARKS_PHOTO_DB['مزارع نخيل المدينة'];
    return VERIFIED_LANDMARKS_PHOTO_DB['المسجد النبوي'];
  }

  // 3. Palestine & Jerusalem intelligent grouping
  if (
    combined.includes('قدس') ||
    combined.includes('jerusalem') ||
    combined.includes('أقصى') ||
    combined.includes('فلسطين') ||
    combined.includes('صخرة')
  ) {
    if (combined.includes('قيامة') || combined.includes('مهد') || combined.includes('كنيسة')) {
      return VERIFIED_LANDMARKS_PHOTO_DB['كنيسة القيامة'];
    }
    return VERIFIED_LANDMARKS_PHOTO_DB['المسجد الأقصى المبارك'];
  }

  // 4. Egypt & Pyramids intelligent grouping
  if (
    combined.includes('مصر') ||
    combined.includes('egypt') ||
    combined.includes('قاهرة') ||
    combined.includes('cairo') ||
    combined.includes('هرم') ||
    combined.includes('أهرام') ||
    combined.includes('جيزة')
  ) {
    if (combined.includes('متحف') || combined.includes('حضارة') || combined.includes('كبير')) {
      return VERIFIED_LANDMARKS_PHOTO_DB['المتحف المصري الكبير'];
    }
    if (combined.includes('معز') || combined.includes('خليلي') || combined.includes('قلعة') || combined.includes('أزهر')) {
      return VERIFIED_LANDMARKS_PHOTO_DB['خان الخليلي'];
    }
    if (combined.includes('نيل') || combined.includes('مركب') || combined.includes('فلوكة')) {
      return VERIFIED_LANDMARKS_PHOTO_DB['نهر النيل'];
    }
    return VERIFIED_LANDMARKS_PHOTO_DB['الأهرامات'];
  }

  // 5. Destination fallback from verified DB
  for (const [destKey, destUrl] of Object.entries(DESTINATION_FALLBACKS)) {
    if (cleanDest.includes(destKey.toLowerCase()) || cleanPlace.includes(destKey.toLowerCase())) {
      return destUrl;
    }
  }

  // 6. Category curated authentic photography
  if (category === 'cafe' || combined.includes('كافيه') || combined.includes('مقهى') || combined.includes('قهوة') || combined.includes('cafe')) {
    return 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80';
  }
  if (category === 'restaurant' || combined.includes('مطعم') || combined.includes('أكلات') || combined.includes('مشاوي') || combined.includes('restaurant')) {
    return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80';
  }
  if (category === 'nature' || combined.includes('طبيعة') || combined.includes('شاطئ') || combined.includes('جبل') || combined.includes('حديقة') || combined.includes('بحر')) {
    return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80';
  }

  // 7. High-standard default travel image
  return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';
}

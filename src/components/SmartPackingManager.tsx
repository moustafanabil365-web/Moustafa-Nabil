import React, { useState, useEffect, useMemo } from 'react';
import { 
  Luggage, CheckSquare, Square, Plus, Trash2, CloudRain, 
  Sun, Snowflake, Wind, ShieldCheck, AlertCircle, RefreshCw, 
  Briefcase, Compass, Users, Sparkles, Filter, Calendar,
  Clock, Bell, BellRing, CheckCircle2, AlertTriangle, ArrowRight,
  ListTodo, Check, Tag, ShieldAlert, Sparkle, Volume2
} from 'lucide-react';
import { 
  GeneratedPlan, PackingItem, PackingTemplateId, PackingListState, 
  TravelReminder, ReminderCategory, ReminderPriority 
} from '../types';

interface SmartPackingManagerProps {
  plan: GeneratedPlan;
  onUpdatePlan?: (updatedPlan: GeneratedPlan) => void;
}

interface TemplateDefinition {
  id: PackingTemplateId;
  name: string;
  emoji: string;
  description: string;
  defaultItems: Omit<PackingItem, 'id' | 'isPacked'>[];
}

const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'city_culture',
    name: 'استكشاف مدن وثقافة',
    emoji: '🏙️',
    description: 'ملابس مريحة للمشي اليومي، شواحن متنقلة، وأحذية داعمة للمتاحف والأسواق.',
    defaultItems: [
      { title: 'حذاء مريح للمشي لمسافات طويلة', category: 'footwear', categoryLabel: 'أحذية', quantity: 'زوجين' },
      { title: 'ملابس كاجوال خفيفة ومريحة', category: 'clothing', categoryLabel: 'ملابس', quantity: '5-7 قطع' },
      { title: 'حقيبة ظهر يومية خفيفة مقاومة للسرقة', category: 'special_gear', categoryLabel: 'معدات', quantity: '1' },
      { title: 'بنك طاقة متنقل (Power Bank) سريع الشحن', category: 'electronics', categoryLabel: 'إلكترونيات', quantity: '20,000 mAh' },
      { title: 'شاحن جداري عالمي للمقابس المتعددة', category: 'electronics', categoryLabel: 'إلكترونيات', quantity: '1' },
      { title: 'معقم يدين وواقي شمس يومي', category: 'toiletries', categoryLabel: 'عناية وصحة', quantity: 'عبوة' },
      { title: 'جواز السفر وتأشيرات الدخول وتأمين السفر', category: 'documents', categoryLabel: 'وثائق', quantity: 'أصل + صور' },
    ],
  },
  {
    id: 'beach_resort',
    name: 'عطلة شاطئية واستجمام',
    emoji: '🏖️',
    description: 'أزياء سباحة، نظارات شمسية، واقيات شمس قوية، وحقيبة مضادة للماء.',
    defaultItems: [
      { title: 'ملابس سباحة وبحر سريعة الجفاف', category: 'clothing', categoryLabel: 'ملابس', quantity: '3 أطقم' },
      { title: 'واقي شمس عالي الحماية (SPF 50+ مقاوم للماء)', category: 'toiletries', categoryLabel: 'عناية وصحة', quantity: 'عبوتين' },
      { title: 'نظارات شمسية مستقطبة وقبعة عريضة', category: 'clothing', categoryLabel: 'ملابس', quantity: 'طقم' },
      { title: 'صندل مريح للشاطئ وحذاء للمشي الخفيف', category: 'footwear', categoryLabel: 'أحذية', quantity: 'زوجين' },
      { title: 'حقيبة مقاومة للماء (Dry Bag) للهواتف', category: 'special_gear', categoryLabel: 'معدات', quantity: '1' },
      { title: 'منشفة مايكروفايبر سريعة الجفاف', category: 'special_gear', categoryLabel: 'معدات', quantity: '1' },
      { title: 'مرطب ما بعد الشمس ومسكنات خفيفة', category: 'toiletries', categoryLabel: 'عناية وصحة', quantity: '1' },
    ],
  },
  {
    id: 'winter_ski',
    name: 'رحلة شتاء وتزلج',
    emoji: '⛷️',
    description: 'ملابس حرارية متعددة الطبقات، معاطف ثقيلة مضادة للماء، قفازات ونظارات ثلج.',
    defaultItems: [
      { title: 'ملابس حرارية داخلية (Thermal Underwear)', category: 'clothing', categoryLabel: 'ملابس', quantity: '3 أطقم' },
      { title: 'معطف شتوي ثقيل مقاوم للرياح والأمطار (Puffer / Gore-Tex)', category: 'clothing', categoryLabel: 'ملابس', quantity: '1-2' },
      { title: 'حذاء شتوي ثلجي مانع للانزلاق ومعزول', category: 'footwear', categoryLabel: 'أحذية', quantity: 'زوج' },
      { title: 'قفازات ثلجية مبطنة وقبعة صوفية ووشاح رقبة', category: 'clothing', categoryLabel: 'ملابس', quantity: 'طقمين' },
      { title: 'نظارات تزلج واقية من انعكاس أشعة الثلج', category: 'special_gear', categoryLabel: 'معدات', quantity: '1' },
      { title: 'مرطب شفاه وكريم ترطيب عميق ضد جفاف البرد', category: 'toiletries', categoryLabel: 'عناية وصحة', quantity: 'عبوة' },
      { title: 'وسادات تدفئة يدوية حرارية فورية', category: 'special_gear', categoryLabel: 'معدات', quantity: '4 حبات' },
    ],
  },
  {
    id: 'business_conf',
    name: 'رحلة عمل ومؤتمرات',
    emoji: '💼',
    description: 'ملابس رسمية أنيقة ومقاومة للتجعد، حاسوب محمول، ومحولات عروض تقديمية.',
    defaultItems: [
      { title: 'بدلات / ملابس عمل رسمية أنيقة', category: 'clothing', categoryLabel: 'ملابس', quantity: '3-4 أطقم' },
      { title: 'حذاء جلدي رسمي مريح للمؤتمرات', category: 'footwear', categoryLabel: 'أحذية', quantity: 'زوجين' },
      { title: 'حاسوب محمول وشاحن سريع وماوس مريح', category: 'electronics', categoryLabel: 'إلكترونيات', quantity: 'طقم' },
      { title: 'وصلات شاشات ومحولات (HDMI / USB-C Hub)', category: 'electronics', categoryLabel: 'إلكترونيات', quantity: '1' },
      { title: 'بطاقات عمل تعريفية ودفتر ملاحظات وقلم فاخر', category: 'documents', categoryLabel: 'وثائق', quantity: 'مجموعة' },
      { title: 'مكواة بخار صغيرة محمولة للسفر', category: 'special_gear', categoryLabel: 'معدات', quantity: '1' },
    ],
  },
  {
    id: 'adventure_hiking',
    name: 'مغامرات وتسلق وهايكنج',
    emoji: '🧗‍♂️',
    description: 'أحذية هايكنج جبلية، عصي مشي، ملابس سريعة التهوية، وحقيبة إسعافات.',
    defaultItems: [
      { title: 'حذاء هايكنج جبلي احترافي عالي الساق', category: 'footwear', categoryLabel: 'أحذية', quantity: 'زوج' },
      { title: 'جوارب صوف ميرينو سميكة تمنع الاحتكاك', category: 'clothing', categoryLabel: 'ملابس', quantity: '4 أزواج' },
      { title: 'ملابس دراي-فت سريعة التبخير للتعرق', category: 'clothing', categoryLabel: 'ملابس', quantity: '4 قطع' },
      { title: 'عصي تسلق وهايكنج قابلة للطي', category: 'special_gear', categoryLabel: 'معدات', quantity: 'زوج' },
      { title: 'حقيبة إسعافات أولية متكاملة وأشرطة كدمات', category: 'toiletries', categoryLabel: 'عناية وصحة', quantity: 'حقيبة' },
      { title: 'مصباح رأس LED مع بطاريات إضافية', category: 'electronics', categoryLabel: 'إلكترونيات', quantity: '1' },
      { title: 'قارورة مياه مفرغة تحافظ على البرودة والحرارة', category: 'special_gear', categoryLabel: 'معدات', quantity: '1 لتر' },
    ],
  },
  {
    id: 'family_kids',
    name: 'رحلة عائلية مع أطفال',
    emoji: '👨‍👩‍👧‍👦',
    description: 'أطقم ملابس إضافية للأطفال، وجبات خفيفة، أدوية خافضة للحرارة، وألعاب سفر.',
    defaultItems: [
      { title: 'أطقم ملابس إضافية وغيارات يومية للأطفال', category: 'clothing', categoryLabel: 'ملابس', quantity: 'أطقم مضاعفة' },
      { title: 'حقيبة أدوية أطفال (خافض حرارة، مضاد حساسية، لصقات)', category: 'toiletries', categoryLabel: 'عناية وصحة', quantity: 'طقم' },
      { title: 'ألعاب وأجهزة لوحية مع سماعات رأس للرحلات الطويلة', category: 'electronics', categoryLabel: 'إلكترونيات', quantity: 'مجموعة' },
      { title: 'عربة أطفال خفيفة الوزن قابلة للطي داخل كابينة الطائرة', category: 'special_gear', categoryLabel: 'معدات', quantity: '1' },
      { title: 'وجبات خفيفة وبسكويت وسناكات سفر محكمة الإغلاق', category: 'special_gear', categoryLabel: 'معدات', quantity: 'تشكيلة' },
      { title: 'مناديل مبللة ومعقمات أسطح مكثفة', category: 'toiletries', categoryLabel: 'عناية وصحة', quantity: '3 عبوات' },
    ],
  },
  {
    id: 'backpacking_light',
    name: 'سفر اقتصادي خفيف (Backpacking)',
    emoji: '🎒',
    description: 'حزم ذكي فائق الخفة، حقيبة ظهر واحدة تناسب الكابينة، ومستلزمات متعددة الأغراض.',
    defaultItems: [
      { title: 'أكياس ضغط الملابس (Compression Cubes)', category: 'special_gear', categoryLabel: 'معدات', quantity: 'طقم' },
      { title: 'حذاء واحد متعدد الاستخدامات (مريح وأنيق)', category: 'footwear', categoryLabel: 'أحذية', quantity: 'زوج رئيسي' },
      { title: 'صابون وشامبو صلب متعدد الأغراض', category: 'toiletries', categoryLabel: 'عناية وصحة', quantity: '1' },
      { title: 'قفل أمان رقمي لخزانات النزل (Hostels)', category: 'special_gear', categoryLabel: 'معدات', quantity: '1' },
      { title: 'محفظة مخفية تحت الملابس للنقود والجواز', category: 'special_gear', categoryLabel: 'معدات', quantity: '1' },
    ],
  },
];

const REMINDER_CATEGORY_INFO: Record<ReminderCategory, { label: string; color: string; emoji: string }> = {
  booking: { label: 'حجوزات وإقامة', color: 'text-amber-400 bg-amber-950/40 border-amber-500/30', emoji: '🏨' },
  transit: { label: 'تذاكر وطيران ومواصلات', color: 'text-sky-400 bg-sky-950/40 border-sky-500/30', emoji: '✈️' },
  docs: { label: 'وثائق وجواز وتأشيرات', color: 'text-purple-400 bg-purple-950/40 border-purple-500/30', emoji: '🛂' },
  luggage: { label: 'تجهيز أمتعة ومشتريات', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30', emoji: '🧳' },
  finance: { label: 'مالية وعملات وبنوك', color: 'text-yellow-400 bg-yellow-950/40 border-yellow-500/30', emoji: '💳' },
  health: { label: 'صحة وتأمين وأدوية', color: 'text-rose-400 bg-rose-950/40 border-rose-500/30', emoji: '💊' },
  other: { label: 'تذكيرات عامة', color: 'text-neutral-400 bg-neutral-900 border-neutral-700', emoji: '📌' },
};

// Play gentle web audio chime for reminder triggers or testing
const playNotificationSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.36);
  } catch (e) {
    console.log('Audio chime not supported or muted');
  }
};

export const SmartPackingManager: React.FC<SmartPackingManagerProps> = ({
  plan,
  onUpdatePlan,
}) => {
  // Main Sub-Tab: 'packing' (Luggage items) vs 'tasks_reminders' (Dated reminders & travel alerts)
  const [activeSection, setActiveSection] = useState<'packing' | 'tasks_reminders'>('packing');

  // Departure Date calculation & state
  const defaultDepartureDate = useMemo(() => {
    if (plan.tripStartDate) return plan.tripStartDate;
    if (plan.packingState?.tripDepartureDate) return plan.packingState.tripDepartureDate;
    // Default to 4 days from now
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  }, [plan]);

  const [tripDepartureDate, setTripDepartureDate] = useState<string>(defaultDepartureDate);

  // Template setup
  const initialTemplateId: PackingTemplateId = useMemo(() => {
    if (plan.packingState?.templateId) return plan.packingState.templateId;
    const style = plan.constraints.travelStyle;
    const group = plan.constraints.groupType;

    if (group === 'family_kids') return 'family_kids';
    if (style === 'relaxation_nature') return 'beach_resort';
    if (style === 'adventure_thrills') return 'adventure_hiking';
    if (style === 'luxury_shopping' || style === 'history_culture') return 'city_culture';
    if (style === 'budget_backpacking') return 'backpacking_light';
    return 'city_culture';
  }, [plan]);

  const [selectedTemplateId, setSelectedTemplateId] = useState<PackingTemplateId>(initialTemplateId);
  const [items, setItems] = useState<PackingItem[]>(() => {
    if (plan.packingState?.items && plan.packingState.items.length > 0) {
      return plan.packingState.items;
    }
    const template = TEMPLATES.find((t) => t.id === initialTemplateId) || TEMPLATES[0];
    return template.defaultItems.map((item, idx) => ({
      ...item,
      id: `pack_${idx}_${Date.now()}`,
      isPacked: false,
    }));
  });

  // Reminders list state (synced with plan.reminders or plan.packingState.customReminders)
  const [reminders, setReminders] = useState<TravelReminder[]>(() => {
    if (plan.packingState?.customReminders && plan.packingState.customReminders.length > 0) {
      return plan.packingState.customReminders;
    }
    if (plan.reminders && plan.reminders.length > 0) {
      return plan.reminders;
    }

    // Default pre-populated smart dated reminders relative to departure
    const depTime = new Date(defaultDepartureDate).getTime() || (Date.now() + 86400000 * 4);
    return [
      {
        id: `rem-init-1`,
        title: 'إنهاء تسجيل الوصول الإلكتروني للطيران (Web Check-in)',
        dueDate: new Date(depTime - 86400000).toISOString().split('T')[0],
        dueTime: '10:00',
        category: 'transit',
        priority: 'high',
        isCompleted: false,
        notes: 'اختيار المقاعد المفضلة وتنزيل بطاقات صعود الطائرة (Boarding Pass) على الهاتف.',
        alertBeforeHours: 24,
        notifyBrowser: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: `rem-init-2`,
        title: 'تأكيد حجز الفندق وسياسة تسجيل الوصول المتأخر',
        dueDate: new Date(depTime - 86400000 * 2).toISOString().split('T')[0],
        dueTime: '14:00',
        category: 'booking',
        priority: 'medium',
        isCompleted: false,
        notes: 'التحقق من توفر خدمة الاستقبال على مدار 24 ساعة ومطابقة تفاصيل الوصول.',
        alertBeforeHours: 48,
        createdAt: new Date().toISOString(),
      },
      {
        id: `rem-init-3`,
        title: 'تفعيل شريحة التجوال الدولي أو شراء eSIM',
        dueDate: new Date(depTime - 86400000).toISOString().split('T')[0],
        dueTime: '18:00',
        category: 'other',
        priority: 'medium',
        isCompleted: true,
        notes: 'تثبيت رمز الاستجابة السريعة (QR Code) للشريحة قبل مغادرة المطار.',
        createdAt: new Date().toISOString(),
      },
      {
        id: `rem-init-4`,
        title: 'صرف العملات المحلية وتفعيل البطاقات البنكية الدولية',
        dueDate: new Date(depTime - 86400000 * 3).toISOString().split('T')[0],
        dueTime: '11:30',
        category: 'finance',
        priority: 'high',
        isCompleted: false,
        notes: 'إشعار البنك بالسفر لتفادي حظر البطاقات الائتمانية بالخارج.',
        alertBeforeHours: 48,
        createdAt: new Date().toISOString(),
      },
    ];
  });

  // Packing Form State
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<PackingItem['category']>('clothing');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string | null>(null);

  // Reminders Form State
  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderDueDate, setReminderDueDate] = useState('');
  const [reminderDueTime, setReminderDueTime] = useState('12:00');
  const [reminderCategory, setReminderCategory] = useState<ReminderCategory>('transit');
  const [reminderPriority, setReminderPriority] = useState<ReminderPriority>('high');
  const [reminderNotes, setReminderNotes] = useState('');
  const [reminderNotifyBrowser, setReminderNotifyBrowser] = useState(true);
  const [reminderFilter, setReminderFilter] = useState<'all' | 'pending' | 'completed' | 'high_priority'>('all');
  const [reminderCategoryFilter, setReminderCategoryFilter] = useState<string>('all');
  const [browserNotificationStatus, setBrowserNotificationStatus] = useState<string | null>(null);

  // Calculate Departure Countdown
  const departureStats = useMemo(() => {
    if (!tripDepartureDate) return null;
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const departure = new Date(`${tripDepartureDate}T00:00:00`);
    const diffMs = departure.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    const isToday = todayStr === tripDepartureDate;
    const isPast = diffDays < 0;
    const isTomorrow = diffDays === 1;
    const isImminent = diffDays >= 0 && diffDays <= 2; // Less than 48h
    const isUpcomingWeek = diffDays > 2 && diffDays <= 7;

    return {
      diffDays,
      isToday,
      isPast,
      isTomorrow,
      isImminent,
      isUpcomingWeek,
      departureDateFormatted: tripDepartureDate,
    };
  }, [tripDepartureDate]);

  // Urgent pending tasks check
  const urgentTasks = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return reminders.filter((r) => {
      if (r.isCompleted) return false;
      if (r.priority === 'high') return true;
      if (r.dueDate && r.dueDate <= todayStr) return true;
      return false;
    });
  }, [reminders]);

  // Sync state to plan
  const syncAllState = (
    newItems: PackingItem[],
    newReminders: TravelReminder[],
    templateId: PackingTemplateId,
    depDate: string
  ) => {
    setItems(newItems);
    setReminders(newReminders);
    setTripDepartureDate(depDate);

    const updatedPackingState: PackingListState = {
      templateId,
      items: newItems,
      customReminders: newReminders,
      tripDepartureDate: depDate,
      weatherAlerts: weatherAlerts.map((a) => a.text),
      lastUpdated: new Date().toISOString(),
    };

    if (onUpdatePlan) {
      onUpdatePlan({
        ...plan,
        packingState: updatedPackingState,
        reminders: newReminders,
        tripStartDate: depDate,
        isUserModified: true,
      });
    }

    try {
      localStorage.setItem(`smarttravel_reminders_${plan.id}`, JSON.stringify(newReminders));
      localStorage.setItem(`smarttravel_packing_${plan.id}`, JSON.stringify(updatedPackingState));
    } catch (e) {
      console.warn('Storage sync warn', e);
    }
  };

  // Weather analysis check
  const weatherAlerts = useMemo(() => {
    const alerts: { icon: string; text: string; action: string; type: 'rain' | 'cold' | 'hot' | 'wind' }[] = [];
    const weather = plan.weather;

    if (!weather) {
      alerts.push({
        icon: '🌤️',
        text: 'الطقس المعتدل: يفضل ارتداء طبقات خفيفة مع سترة ليلية.',
        action: 'تأكد من وجود سترة خفيفة للمساء',
        type: 'hot',
      });
      return alerts;
    }

    const maxTemp = Math.max(...(weather.forecast?.map((f) => f.tempMax) || [weather.currentTemp || 25]));
    const minTemp = Math.min(...(weather.forecast?.map((f) => f.tempMin) || [weather.currentTemp || 20]));
    const maxRainProb = Math.max(...(weather.forecast?.map((f) => f.precipitationProb) || [0]));

    if (maxRainProb >= 40) {
      alerts.push({
        icon: '🌧️',
        text: `توقعات هطول أمطار بنسبة تصل إلى ${maxRainProb}% خلال أيام الرحلة.`,
        action: 'تم التحقق من إضافة مظلة ومعطف واقٍ من المطر للأمتعة.',
        type: 'rain',
      });
    }

    if (minTemp <= 10) {
      alerts.push({
        icon: '❄️',
        text: `درجات حرارة منخفضة تصل إلى ${minTemp}°C ليلاً وفي الصباح الباكر.`,
        action: 'تأكد من حزم ملابس حرارية وجاكيت شتوي معزول وقفازات.',
        type: 'cold',
      });
    } else if (maxTemp >= 32) {
      alerts.push({
        icon: '☀️',
        text: `أجواء حارة مع درجات حرارة عظمى تصل إلى ${maxTemp}°C ومؤشر أشعة UV مرتفع.`,
        action: 'تأكد من واقي الشمس (SPF 50+)، ملابس قطنية خفيفة، ونظارات شمسية.',
        type: 'hot',
      });
    }

    if (weather.windSpeed && weather.windSpeed > 25) {
      alerts.push({
        icon: '💨',
        text: `نشاط في سرعة الرياح تصل إلى ${weather.windSpeed} كم/س.`,
        action: 'يفضل إضافة جاكيت واقٍ من الرياح (Windbreaker).',
        type: 'wind',
      });
    }

    return alerts;
  }, [plan.weather]);

  // AI Smart Packing Generator
  const handleGenerateAiPacking = async () => {
    setIsAiGenerating(true);
    setAiSuccessMessage(null);
    try {
      const res = await fetch('/api/generate-smart-packing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: plan.destination,
          durationDays: plan.durationDays,
          travelStyle: plan.constraints.travelStyle,
          groupType: plan.constraints.groupType,
          weatherForecast: plan.weather
            ? {
                currentTemp: plan.weather.currentTemp,
                condition: plan.weather.condition,
                tempMax: plan.weather.forecast?.[0]?.tempMax,
                tempMin: plan.weather.forecast?.[0]?.tempMin,
                precipitationProb: plan.weather.forecast?.[0]?.precipitationProb,
              }
            : undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.items && Array.isArray(data.items) && data.items.length > 0) {
          syncAllState(data.items, reminders, selectedTemplateId, tripDepartureDate);
          setAiSuccessMessage(`تم توليد ${data.items.length} غرضاً ذكياً متوافقاً مع طقس ${plan.destination}!`);
          setTimeout(() => setAiSuccessMessage(null), 5000);
        }
      }
    } catch (e) {
      console.error('Failed to generate AI packing list:', e);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Packing handlers
  const handleTogglePacked = (id: string) => {
    const updated = items.map((it) => (it.id === id ? { ...it, isPacked: !it.isPacked } : it));
    syncAllState(updated, reminders, selectedTemplateId, tripDepartureDate);
  };

  const handleSelectTemplate = (tmplId: PackingTemplateId) => {
    setSelectedTemplateId(tmplId);
    const tmpl = TEMPLATES.find((t) => t.id === tmplId) || TEMPLATES[0];
    const newItems: PackingItem[] = tmpl.defaultItems.map((item, idx) => ({
      ...item,
      id: `pack_${tmplId}_${idx}_${Date.now()}`,
      isPacked: false,
    }));
    syncAllState(newItems, reminders, tmplId, tripDepartureDate);
  };

  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;

    const categoryLabels: Record<PackingItem['category'], string> = {
      clothing: 'ملابس',
      footwear: 'أحذية',
      electronics: 'إلكترونيات',
      toiletries: 'عناية وصحة',
      documents: 'وثائق',
      special_gear: 'معدات',
    };

    const newItem: PackingItem = {
      id: `custom_${Date.now()}`,
      title: newItemTitle.trim(),
      category: newItemCategory,
      categoryLabel: categoryLabels[newItemCategory],
      isPacked: false,
      isCustom: true,
    };

    const updated = [...items, newItem];
    syncAllState(updated, reminders, selectedTemplateId, tripDepartureDate);
    setNewItemTitle('');
  };

  const handleDeleteItem = (id: string) => {
    const updated = items.filter((it) => it.id !== id);
    syncAllState(updated, reminders, selectedTemplateId, tripDepartureDate);
  };

  // Reminders handlers
  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderTitle.trim()) return;

    const newReminder: TravelReminder = {
      id: `rem-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      tripId: plan.id,
      title: reminderTitle.trim(),
      dueDate: reminderDueDate || undefined,
      dueTime: reminderDueTime || '12:00',
      category: reminderCategory,
      priority: reminderPriority,
      isCompleted: false,
      notes: reminderNotes.trim() || undefined,
      notifyBrowser: reminderNotifyBrowser,
      createdAt: new Date().toISOString(),
    };

    const updated = [newReminder, ...reminders];
    syncAllState(items, updated, selectedTemplateId, tripDepartureDate);
    playNotificationSound();

    // Reset Form
    setReminderTitle('');
    setReminderNotes('');
    setReminderDueDate('');
    setIsAddingReminder(false);
  };

  const handleToggleReminderComplete = (id: string) => {
    const updated = reminders.map((r) =>
      r.id === id ? { ...r, isCompleted: !r.isCompleted } : r
    );
    syncAllState(items, updated, selectedTemplateId, tripDepartureDate);
    playNotificationSound();
  };

  const handleDeleteReminder = (id: string) => {
    const updated = reminders.filter((r) => r.id !== id);
    syncAllState(items, updated, selectedTemplateId, tripDepartureDate);
  };

  // Add Preset Milestone Reminder
  const handleAddPresetMilestone = (
    title: string,
    daysBeforeDeparture: number,
    cat: ReminderCategory,
    prio: ReminderPriority,
    noteText: string
  ) => {
    const depTime = new Date(tripDepartureDate).getTime() || (Date.now() + 86400000 * 4);
    const targetDate = new Date(depTime - daysBeforeDeparture * 86400000).toISOString().split('T')[0];

    const newReminder: TravelReminder = {
      id: `rem-preset-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      tripId: plan.id,
      title,
      dueDate: targetDate,
      dueTime: '10:00',
      category: cat,
      priority: prio,
      isCompleted: false,
      notes: noteText,
      notifyBrowser: true,
      createdAt: new Date().toISOString(),
    };

    syncAllState(items, [newReminder, ...reminders], selectedTemplateId, tripDepartureDate);
    playNotificationSound();
  };

  // Request browser notification permission
  const handleRequestBrowserNotifications = async () => {
    if (!('Notification' in window)) {
      setBrowserNotificationStatus('متصفحك لا يدعم الإشعارات المباشرة.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setBrowserNotificationStatus('تم تفعيل التنبيهات بنجاح! ستتلقى إشعاراً عند اقتراب موعد السفر وتواريخ المهام.');
        playNotificationSound();
        new Notification(`✈️ سمارت ترافل: تنبيه رحلة ${plan.destination}`, {
          body: `تذكير: متبقي على موعد السفر ${departureStats?.diffDays || 0} أيام. تأكد من إنجاز المهام الحرجة!`,
          icon: '/favicon.ico',
        });
      } else {
        setBrowserNotificationStatus('تم رفض إذن التنبيهات من المتصفح.');
      }
    } catch (err) {
      console.warn('Notification permission error', err);
    }
  };

  // Quick Date Shortcut Helper
  const setQuickDate = (type: 'today' | 'tomorrow' | 'minus_3' | 'minus_7' | 'departure_day') => {
    const now = new Date();
    const depTime = new Date(tripDepartureDate).getTime() || (Date.now() + 86400000 * 4);

    if (type === 'today') {
      setReminderDueDate(now.toISOString().split('T')[0]);
    } else if (type === 'tomorrow') {
      now.setDate(now.getDate() + 1);
      setReminderDueDate(now.toISOString().split('T')[0]);
    } else if (type === 'departure_day') {
      setReminderDueDate(tripDepartureDate);
    } else if (type === 'minus_3') {
      const target = new Date(depTime - 86400000 * 3);
      setReminderDueDate(target.toISOString().split('T')[0]);
    } else if (type === 'minus_7') {
      const target = new Date(depTime - 86400000 * 7);
      setReminderDueDate(target.toISOString().split('T')[0]);
    }
  };

  // Progress calculations
  const packedCount = items.filter((it) => it.isPacked).length;
  const totalItemsCount = items.length;
  const packingProgressPercent = totalItemsCount > 0 ? Math.round((packedCount / totalItemsCount) * 100) : 0;

  const completedRemindersCount = reminders.filter((r) => r.isCompleted).length;
  const totalRemindersCount = reminders.length;
  const pendingRemindersCount = totalRemindersCount - completedRemindersCount;

  // Filtered lists
  const filteredPackingItems = selectedCategoryFilter === 'all'
    ? items
    : items.filter((it) => it.category === selectedCategoryFilter);

  const filteredReminders = reminders.filter((r) => {
    if (reminderFilter === 'pending' && r.isCompleted) return false;
    if (reminderFilter === 'completed' && !r.isCompleted) return false;
    if (reminderFilter === 'high_priority' && r.priority !== 'high') return false;
    if (reminderCategoryFilter !== 'all' && r.category !== reminderCategoryFilter) return false;
    return true;
  });

  return (
    <div id="smart-packing-and-tasks-section" className="bg-[#111622] border border-[#d4af37]/35 rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Section Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neutral-800/80 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#8c701f] p-0.5 shadow-lg shadow-[#d4af37]/20 flex items-center justify-center flex-shrink-0">
            <div className="w-full h-full bg-[#0b1325] rounded-[14px] flex items-center justify-center text-[#d4af37]">
              {activeSection === 'packing' ? <Luggage className="w-6 h-6" /> : <ListTodo className="w-6 h-6" />}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg sm:text-xl font-black text-white">
                إدارة الأغراض والمهام والتذكيرات الموقوتة
              </h3>
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 text-[#f5d061] border border-[#d4af37]/40">
                تنبيهات اقتراب السفر 🔔
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#9eb3cf] mt-0.5">
              قائمة حقيبة السفر الذكية، وجدول التذكيرات والمهام المجدولة بتواريخ محددة وتنبيهات الاستعداد للسفر إلى {plan.destination}.
            </p>
          </div>
        </div>

        {/* Section Navigation Tabs Switcher */}
        <div className="flex items-center gap-2 bg-[#090e1a] p-1.5 rounded-2xl border border-neutral-800 self-start lg:self-auto w-full lg:w-auto overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveSection('packing')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap flex-1 sm:flex-initial justify-center ${
              activeSection === 'packing'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#f5d061] text-[#0a1120] shadow-md shadow-[#d4af37]/20'
                : 'text-neutral-400 hover:text-white hover:bg-[#141e33]'
            }`}
          >
            <Luggage className="w-4 h-4" />
            <span>قائمة الأمتعة والحقيبة ({packedCount}/{totalItemsCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('tasks_reminders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap flex-1 sm:flex-initial justify-center relative ${
              activeSection === 'tasks_reminders'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#f5d061] text-[#0a1120] shadow-md shadow-[#d4af37]/20'
                : 'text-neutral-400 hover:text-white hover:bg-[#141e33]'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>المهام والتذكيرات الموقوتة ({pendingRemindersCount} متبقية)</span>
            {pendingRemindersCount > 0 && activeSection !== 'tasks_reminders' && (
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping absolute -top-1 -right-1" />
            )}
          </button>
        </div>
      </div>

      {/* TRAVEL COUNTDOWN & SMART DEPARTURE ALERT BAR */}
      <div className="bg-gradient-to-r from-[#0d1627] via-[#14213d] to-[#0d1627] border border-[#d4af37]/40 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37] flex-shrink-0 mt-0.5">
            <BellRing className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs text-[#d4af37] font-extrabold uppercase tracking-wider">
                عداد اقتراب موعد السفر • رحلة {plan.destination}
              </span>
              {departureStats?.isToday ? (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-black text-xs animate-pulse">
                  🚨 موعد السفر اليوم! رحلة سعيدة
                </span>
              ) : departureStats?.isTomorrow ? (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-black font-black text-xs animate-pulse">
                  ⚠️ موعد السفر غداً! تأكد من إغلاق الحقائب
                </span>
              ) : departureStats?.isImminent ? (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-black text-xs">
                  ⏳ متبقي {departureStats.diffDays} أيام فقط (مرحلة الاستعداد القصوى)
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-black text-xs">
                  🗓️ متبقي {departureStats?.diffDays || 0} يوماً على السفر
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1 flex-wrap text-xs text-neutral-300">
              <span>تاريخ الإقلاع المحدد:</span>
              <input
                type="date"
                value={tripDepartureDate}
                onChange={(e) => {
                  if (e.target.value) {
                    syncAllState(items, reminders, selectedTemplateId, e.target.value);
                  }
                }}
                className="bg-[#080d19] border border-neutral-700 focus:border-[#d4af37] text-[#f5d061] font-bold rounded-lg px-2.5 py-1 text-xs cursor-pointer"
              />
              <span className="text-[11px] text-neutral-400 hidden sm:inline">
                (يمكنك تعديل التاريخ لحساب التذكيرات الموقوتة آلياً)
              </span>
            </div>
          </div>
        </div>

        {/* Quick Browser Notification Activation & Sound Test */}
        <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
          <button
            type="button"
            onClick={handleRequestBrowserNotifications}
            className="px-3.5 py-2 rounded-xl bg-[#1a2744] hover:bg-[#23355d] border border-[#d4af37]/40 text-[#f5d061] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow flex-1 md:flex-initial justify-center"
            title="تفعيل التنبيهات المباشرة بالمتصفح"
          >
            <Bell className="w-4 h-4 text-[#d4af37]" />
            <span>تفعيل تنبيهات المتصفح</span>
          </button>

          <button
            type="button"
            onClick={playNotificationSound}
            className="p-2 rounded-xl bg-[#1a2744] hover:bg-[#23355d] border border-neutral-700 text-neutral-300 hover:text-white transition-all cursor-pointer"
            title="اختبار نغمة التنبيه"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {browserNotificationStatus && (
        <div className="p-3 bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl flex items-center justify-between gap-2">
          <span>✓ {browserNotificationStatus}</span>
          <button
            type="button"
            onClick={() => setBrowserNotificationStatus(null)}
            className="text-xs text-neutral-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* URGENT TASKS ALERT (If any pending high priority or due soon) */}
      {urgentTasks.length > 0 && (
        <div className="bg-gradient-to-r from-rose-950/40 via-amber-950/30 to-rose-950/40 border border-rose-500/40 rounded-2xl p-4 space-y-2.5 shadow-lg animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black text-rose-300">
              <AlertTriangle className="w-4 h-4 text-rose-400 animate-bounce" />
              <span>مهام عاجلة تتطلب إنجازك قبل السفر ({urgentTasks.length}):</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveSection('tasks_reminders');
                setReminderFilter('high_priority');
              }}
              className="text-[11px] text-amber-300 font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>عرض المهام العاجلة</span>
              <ArrowRight className="w-3 h-3 rotate-180" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {urgentTasks.slice(0, 4).map((ut) => (
              <div
                key={ut.id}
                onClick={() => handleToggleReminderComplete(ut.id)}
                className="bg-[#0a0f1c] hover:bg-[#121c33] border border-rose-500/30 rounded-xl p-2.5 flex items-center justify-between gap-2.5 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2">
                  <Square className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span className="text-xs text-white font-bold line-clamp-1">{ut.title}</span>
                </div>
                {ut.dueDate && (
                  <span className="text-[10px] text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30 font-mono whitespace-nowrap">
                    {ut.dueDate}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 1: SMART PACKING & LUGGAGE CHECKLIST */}
      {/* ========================================================================= */}
      {activeSection === 'packing' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* AI Generator Callout */}
          <div className="bg-gradient-to-r from-[#1c180d] via-[#241e12] to-[#1a1812] border border-[#d4af37]/40 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37] flex-shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm sm:text-base font-black text-white">
                    المساعد الذكي لتجهيز الحقيبة وتدقيق الطقس
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    توليد مخصص
                  </span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed mt-1">
                  يقوم الذكاء الاصطناعي بمطابقة أمتعتك مع طقس {plan.destination} ومدة الإقامة ({plan.durationDays} أيام) وتوليد أغراض مخصصة.
                </p>
                {aiSuccessMessage && (
                  <span className="inline-block mt-2 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-1 rounded-lg">
                    ✓ {aiSuccessMessage}
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerateAiPacking}
              disabled={isAiGenerating}
              className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f5d061] text-[#0a1120] font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
            >
              {isAiGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>جاري التحليل والتوليد...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>توليد قائمة ذكية بالذكاء الاصطناعي</span>
                </>
              )}
            </button>
          </div>

          {/* Weather Matcher & Intelligence Alerts Box */}
          {weatherAlerts.length > 0 && (
            <div className="bg-[#0b1426] border border-blue-500/30 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-300">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>نتائج التحقق الذكي من طقس وجهة السفر وتوصيات الملابس:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {weatherAlerts.map((alert, idx) => (
                  <div key={idx} className="bg-[#080d19] border border-blue-500/20 rounded-xl p-2.5 text-xs flex items-start gap-2">
                    <span className="text-base leading-none">{alert.icon}</span>
                    <div>
                      <span className="font-bold text-neutral-200 block">{alert.text}</span>
                      <span className="text-[11px] text-emerald-300 font-medium">{alert.action}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Templates Selector Carousel */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-neutral-300 block">
              اختر نوع ونمط الرحلة لتخصيص محتويات الحقيبة فوراً:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {TEMPLATES.map((tmpl) => {
                const isSelected = selectedTemplateId === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    onClick={() => handleSelectTemplate(tmpl.id)}
                    className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#1e1a10] border-[#d4af37] text-white shadow-md shadow-[#d4af37]/10'
                        : 'bg-[#0c1322] hover:bg-[#131d33] border-neutral-800 text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{tmpl.emoji}</span>
                      <span className="text-xs font-bold">{tmpl.name}</span>
                    </div>
                    <p className="text-[10px] text-neutral-400 line-clamp-2 leading-relaxed">{tmpl.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Filter & Add Item Bar */}
          <div className="flex items-center justify-between gap-3 pt-2 overflow-x-auto pb-1">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSelectedCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategoryFilter === 'all' ? 'bg-[#d4af37] text-black font-black' : 'bg-[#0b1325] text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                الكل ({items.length})
              </button>
              {['clothing', 'footwear', 'electronics', 'toiletries', 'documents', 'special_gear'].map((cat) => {
                const count = items.filter((i) => i.category === cat).length;
                const labels: Record<string, string> = {
                  clothing: '👕 ملابس',
                  footwear: '👟 أحذية',
                  electronics: '📱 إلكترونيات',
                  toiletries: '💊 عناية',
                  documents: '📄 وثائق',
                  special_gear: '🎒 معدات',
                };
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedCategoryFilter === cat ? 'bg-[#d4af37] text-black font-black' : 'bg-[#0b1325] text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    {labels[cat]} ({count})
                  </button>
                );
              })}
            </div>

            {/* Completion Percentage */}
            <div className="text-xs font-black text-[#d4af37] whitespace-nowrap hidden sm:block">
              اكتمال الحقيبة: {packingProgressPercent}% ({packedCount}/{totalItemsCount})
            </div>
          </div>

          {/* Add Custom Item Form */}
          <form onSubmit={handleAddCustomItem} className="flex gap-2 flex-wrap sm:flex-nowrap bg-[#080d1a] p-2 rounded-2xl border border-neutral-800">
            <input
              type="text"
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              placeholder="أضف غرضاً إضافياً للحقيبة (مثال: محول تيار، كتاب قراءة، نظارة إضافية...)"
              className="flex-1 bg-[#0e172a] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
            />
            <select
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value as PackingItem['category'])}
              className="bg-[#0e172a] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
            >
              <option value="clothing">ملابس</option>
              <option value="footwear">أحذية</option>
              <option value="electronics">إلكترونيات</option>
              <option value="toiletries">عناية وصحة</option>
              <option value="documents">وثائق وأموال</option>
              <option value="special_gear">معدات خاصة</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#d4af37] hover:bg-[#f5d061] text-black font-bold text-xs flex items-center gap-1 cursor-pointer whitespace-nowrap shadow"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة للحقيبة</span>
            </button>
          </form>

          {/* Items Checklist Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[440px] overflow-y-auto pr-1">
            {filteredPackingItems.map((item) => {
              return (
                <div
                  key={item.id}
                  onClick={() => handleTogglePacked(item.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    item.isPacked
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-neutral-400'
                      : 'bg-[#0c1424] hover:bg-[#111c33] border-[#d4af37]/20 text-neutral-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      className="flex-shrink-0 text-[#d4af37] mt-0.5"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTogglePacked(item.id);
                      }}
                    >
                      {item.isPacked ? (
                        <CheckSquare className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Square className="w-5 h-5 text-neutral-500" />
                      )}
                    </button>
                    <div>
                      <span className={`text-xs font-bold block leading-snug ${item.isPacked ? 'line-through text-neutral-500' : 'text-white'}`}>
                        {item.title}
                      </span>
                      
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-[10px] text-neutral-400 bg-[#070b14] px-1.5 py-0.2 rounded border border-neutral-800 font-medium">
                          {item.categoryLabel}
                        </span>
                        {item.quantity && (
                          <span className="text-[10px] text-amber-300/90 font-mono font-medium">
                            {item.quantity}
                          </span>
                        )}
                        {item.weatherReason && (
                          <span className="text-[10px] text-sky-300/90 bg-sky-950/40 px-1.5 py-0.2 rounded border border-sky-800/40 flex items-center gap-1">
                            <span>🌦️</span>
                            <span>{item.weatherReason}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 transition-colors"
                      title="حذف الغرض"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: DATED TASKS & TRAVEL REMINDERS WITH APPROACHING ALERTS */}
      {/* ========================================================================= */}
      {activeSection === 'tasks_reminders' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Quick Add Preset Milestones Carousel */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>محطات وتذكيرات ما قبل السفر الجاهزة (إضافة بضغطة زر):</span>
              </span>
              <span className="text-[11px] text-[#9eb3cf]">تُحسب التواريخ تلقائياً قبل الإقلاع</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {[
                {
                  title: '✈️ إنهاء تسجيل الوصول الإلكتروني (Web Check-in)',
                  days: 1,
                  cat: 'transit' as ReminderCategory,
                  prio: 'high' as ReminderPriority,
                  notes: 'قبل 24 ساعة من موعد الرحلة لاختيار أفضل المقاعد.',
                },
                {
                  title: '🛂 فحص صلاحية الجواز والتأشيرة الإلكترونية',
                  days: 7,
                  cat: 'docs' as ReminderCategory,
                  prio: 'high' as ReminderPriority,
                  notes: 'التأكد من أن الجواز صالح لأكثر من 6 أشهر.',
                },
                {
                  title: '💳 تفعيل البطاقات الدولية وصرف العملة',
                  days: 3,
                  cat: 'finance' as ReminderCategory,
                  prio: 'medium' as ReminderPriority,
                  notes: 'إشعار البنك بالوجهة لتفادي حظر العمليات.',
                },
                {
                  title: '⚖️ وزن الحقائب وتطابق شروط الأمتعة',
                  days: 1,
                  cat: 'luggage' as ReminderCategory,
                  prio: 'medium' as ReminderPriority,
                  notes: 'التأكد من وزن حقيبة الشحن واليد ومقاس السوائل 100 مل.',
                },
              ].map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() =>
                    handleAddPresetMilestone(
                      preset.title,
                      preset.days,
                      preset.cat,
                      preset.prio,
                      preset.notes
                    )
                  }
                  className="p-3 rounded-2xl bg-[#0c1424] hover:bg-[#121f38] border border-[#d4af37]/20 hover:border-[#d4af37] text-right transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <span className="text-xs font-bold text-white group-hover:text-[#f5d061] transition-colors block line-clamp-1">
                      {preset.title}
                    </span>
                    <span className="text-[10px] text-neutral-400 mt-1 block line-clamp-1">
                      {preset.notes}
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-neutral-800 flex items-center justify-between text-[10px]">
                    <span className="text-amber-400 font-mono font-bold">
                      قبل السفر بـ {preset.days} {preset.days === 1 ? 'يوم' : 'أيام'}
                    </span>
                    <span className="text-[#d4af37] font-bold group-hover:underline">+ إضافة</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Filter Bar & Add Custom Reminder Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#080d19] p-3 rounded-2xl border border-neutral-800">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <button
                type="button"
                onClick={() => setReminderFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  reminderFilter === 'all'
                    ? 'bg-[#d4af37] text-black font-black'
                    : 'bg-[#111a2e] text-neutral-300 hover:text-white'
                }`}
              >
                الكل ({reminders.length})
              </button>
              <button
                type="button"
                onClick={() => setReminderFilter('pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  reminderFilter === 'pending'
                    ? 'bg-[#d4af37] text-black font-black'
                    : 'bg-[#111a2e] text-neutral-300 hover:text-white'
                }`}
              >
                قيد الانتظار ({pendingRemindersCount})
              </button>
              <button
                type="button"
                onClick={() => setReminderFilter('high_priority')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  reminderFilter === 'high_priority'
                    ? 'bg-rose-500 text-white font-black'
                    : 'bg-[#111a2e] text-rose-300 hover:text-white'
                }`}
              >
                🚨 عاجلة ({reminders.filter((r) => r.priority === 'high' && !r.isCompleted).length})
              </button>
              <button
                type="button"
                onClick={() => setReminderFilter('completed')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  reminderFilter === 'completed'
                    ? 'bg-emerald-500 text-black font-black'
                    : 'bg-[#111a2e] text-neutral-400 hover:text-white'
                }`}
              >
                المكتملة ({completedRemindersCount})
              </button>
            </div>

            {/* Toggle Add Form */}
            <button
              type="button"
              onClick={() => setIsAddingReminder(!isAddingReminder)}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f5d061] text-[#0a1120] text-xs font-black shadow transition-all cursor-pointer self-stretch sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingReminder ? 'إلغاء الإضافة' : 'إضافة تذكير خاص بموعد محدد'}</span>
            </button>
          </div>

          {/* Custom Reminder Form */}
          {isAddingReminder && (
            <form
              onSubmit={handleAddReminder}
              className="bg-[#0b1325] border border-[#d4af37]/40 rounded-3xl p-5 space-y-4 shadow-xl animate-in fade-in"
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#d4af37]" />
                  <span>تخصيص تذكير جديد مرتبط بتاريخ ووقت وإشعار</span>
                </h4>
                <span className="text-[11px] text-[#f5d061] font-mono font-bold">
                  رحلة {plan.destination}
                </span>
              </div>

              {/* Title */}
              <div>
                <label className="text-xs text-neutral-300 font-bold block mb-1.5">
                  عنوان التذكير أو المهمة <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={reminderTitle}
                  onChange={(e) => setReminderTitle(e.target.value)}
                  placeholder="مثال: استلام تأشيرة الدخول، شراء شاحن محمول، حجز مطعم العشاء..."
                  className="w-full bg-[#080d19] border border-neutral-700 focus:border-[#d4af37] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
                />
              </div>

              {/* Date & Time with Quick Shortcut Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-neutral-300 font-bold block mb-1.5">
                    تاريخ الاستحقاق أو التنبيه (Due Date)
                  </label>
                  <input
                    type="date"
                    value={reminderDueDate}
                    onChange={(e) => setReminderDueDate(e.target.value)}
                    className="w-full bg-[#080d19] border border-neutral-700 focus:border-[#d4af37] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />

                  {/* Date Shortcuts */}
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    <span className="text-[10px] text-neutral-400">اختصار:</span>
                    <button
                      type="button"
                      onClick={() => setQuickDate('today')}
                      className="px-2 py-0.5 rounded-lg bg-[#14213d] hover:bg-[#1c2e55] text-[10px] text-neutral-200 border border-neutral-700"
                    >
                      اليوم
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickDate('tomorrow')}
                      className="px-2 py-0.5 rounded-lg bg-[#14213d] hover:bg-[#1c2e55] text-[10px] text-neutral-200 border border-neutral-700"
                    >
                      غداً
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickDate('minus_3')}
                      className="px-2 py-0.5 rounded-lg bg-[#14213d] hover:bg-[#1c2e55] text-[10px] text-[#f5d061] border border-[#d4af37]/30"
                    >
                      قبل السفر بـ 3 أيام
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickDate('departure_day')}
                      className="px-2 py-0.5 rounded-lg bg-[#14213d] hover:bg-[#1c2e55] text-[10px] text-rose-300 border border-rose-500/30"
                    >
                      يوم السفر
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-neutral-300 font-bold block mb-1.5">
                    توقيت التنبيه (Time)
                  </label>
                  <input
                    type="time"
                    value={reminderDueTime}
                    onChange={(e) => setReminderDueTime(e.target.value)}
                    className="w-full bg-[#080d19] border border-neutral-700 focus:border-[#d4af37] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Category & Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-neutral-300 font-bold block mb-1.5">
                    فئة المهمة
                  </label>
                  <select
                    value={reminderCategory}
                    onChange={(e) => setReminderCategory(e.target.value as ReminderCategory)}
                    className="w-full bg-[#080d19] border border-neutral-700 focus:border-[#d4af37] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="booking">🏨 حجوزات وفنادق</option>
                    <option value="transit">✈️ طيران ومواصلات وتذاكر</option>
                    <option value="docs">🛂 وثائق وجوازات وتأشيرات</option>
                    <option value="luggage">🧳 أمتعة ومشتريات سفر</option>
                    <option value="finance">💳 مالية وعملات ومصارف</option>
                    <option value="health">💊 صحة وأدوية وتأمين</option>
                    <option value="other">📌 أخرى وعام</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-neutral-300 font-bold block mb-1.5">
                    درجة الأهمية والاستعجال
                  </label>
                  <select
                    value={reminderPriority}
                    onChange={(e) => setReminderPriority(e.target.value as ReminderPriority)}
                    className="w-full bg-[#080d19] border border-neutral-700 focus:border-[#d4af37] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="high">🚨 عاجل وهام جداً (High Priority)</option>
                    <option value="medium">⚡ متوسط الأهمية (Medium Priority)</option>
                    <option value="low">☕ عادي واستعداد روتيني (Low)</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs text-neutral-300 font-bold block mb-1.5">
                  ملاحظات وتفاصيل إضافية (أرقام مرجعية، نصائح، أو مواقع)
                </label>
                <textarea
                  rows={2}
                  value={reminderNotes}
                  onChange={(e) => setReminderNotes(e.target.value)}
                  placeholder="مثال: الحجز عبر تطبيق الطيران، كود التأكيد #ABC123..."
                  className="w-full bg-[#080d19] border border-neutral-700 focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none resize-none"
                />
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddingReminder(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f5d061] text-[#0a1120] text-xs font-black shadow hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>حفظ التذكير الموقوت</span>
                </button>
              </div>
            </form>
          )}

          {/* Chronological Reminders List */}
          <div className="space-y-3">
            {filteredReminders.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#080d19] border border-neutral-800 text-center space-y-2">
                <ListTodo className="w-8 h-8 text-neutral-500 mx-auto" />
                <p className="text-xs text-neutral-400 font-bold">لا توجد مهام أو تذكيرات في هذا القسم حالياً.</p>
                <p className="text-[11px] text-neutral-500">اضغط على زر إضافة تذكير خاص أو اختر إحدى المحطات الجاهزة بالأعلى.</p>
              </div>
            ) : (
              filteredReminders.map((rem) => {
                const catInfo = REMINDER_CATEGORY_INFO[rem.category] || REMINDER_CATEGORY_INFO.other;
                const isHigh = rem.priority === 'high';

                return (
                  <div
                    key={rem.id}
                    onClick={() => handleToggleReminderComplete(rem.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      rem.isCompleted
                        ? 'bg-emerald-950/15 border-emerald-500/30 opacity-75'
                        : isHigh
                        ? 'bg-[#10172a] hover:bg-[#141f38] border-rose-500/40 shadow-sm'
                        : 'bg-[#0c1424] hover:bg-[#111c33] border-[#d4af37]/20'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleReminderComplete(rem.id);
                        }}
                        className="flex-shrink-0 mt-0.5 text-[#d4af37]"
                      >
                        {rem.isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Square className={`w-5 h-5 ${isHigh ? 'text-rose-400' : 'text-neutral-500'}`} />
                        )}
                      </button>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-xs sm:text-sm font-bold block ${
                              rem.isCompleted ? 'line-through text-neutral-500' : 'text-white'
                            }`}
                          >
                            {rem.title}
                          </span>

                          {isHigh && !rem.isCompleted && (
                            <span className="text-[10px] font-black px-2 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                              عاجل
                            </span>
                          )}
                        </div>

                        {rem.notes && (
                          <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                            {rem.notes}
                          </p>
                        )}

                        <div className="flex items-center gap-2 flex-wrap text-[11px] pt-1">
                          <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${catInfo.color}`}>
                            <span>{catInfo.emoji}</span> {catInfo.label}
                          </span>

                          {rem.dueDate && (
                            <span className="flex items-center gap-1 text-amber-300 font-mono bg-[#070c17] px-2 py-0.5 rounded border border-neutral-800">
                              <Calendar className="w-3 h-3 text-[#d4af37]" />
                              <span>{rem.dueDate}</span>
                              {rem.dueTime && <span>({rem.dueTime})</span>}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleDeleteReminder(rem.id)}
                        className="p-2 rounded-xl bg-[#080d19] hover:bg-red-950/40 text-neutral-500 hover:text-red-400 border border-neutral-800 transition-colors"
                        title="حذف التذكير"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

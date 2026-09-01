import React, { useState } from 'react';
import { 
  CheckCircle2, ExternalLink, ShieldCheck, Train, MapPin, 
  Sparkles, Clock, AlertTriangle, ArrowRight, Heart, Star,
  Compass, ChevronDown, ChevronUp, Copy, Check, Users, RefreshCw
} from 'lucide-react';
import { TravelConstraints } from '../types';
import { SupportedLanguage } from '../utils/i18n';

interface HajjUmrahServicesHubProps {
  onApplyUmrahPlan?: (constraints: Partial<TravelConstraints>) => void;
  onPlanTrip?: (constraints: any) => void;
  currentLanguage?: SupportedLanguage;
  onClose?: () => void;
}

export const HajjUmrahServicesHub: React.FC<HajjUmrahServicesHubProps> = ({
  onApplyUmrahPlan,
  onPlanTrip,
  currentLanguage,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'official_services' | 'rituals_guide' | 'train_transport' | 'hotels_zamzam'>('official_services');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [expandedRitual, setExpandedRitual] = useState<number | null>(0);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const handleApplyQuickUmrah = () => {
    const payload = {
      destination: 'مكة المكرمة والمدينة المنورة، المملكة العربية السعودية',
      durationDays: 6,
      groupType: 'family_kids' as const,
      budget: 8500,
      currency: 'SAR',
      travelStyle: 'spiritual_pilgrimage' as const,
      accommodationArea: 'أبراج الساعة / أجياد بمكة، والمنطقة المركزية الشمالية بالمدينة',
      specialConstraints: 'استخراج تصاريح العمرة والروضة الشريفة عبر منصة نسك، حجز قطار الحرمين السريع بين جدة ومكة والمدينة، حجز عربات الطواف الكهربائية لكبار السن، وتوفير وشحن ماء زمزم بالمطار.',
      dialect: 'saudi_gulf' as const,
      isMultiCity: true,
      preferredTransit: 'high_speed_train' as const,
      cityStops: [
        { id: 'makkah', cityName: 'مكة المكرمة (العمرة والطواف والسعي والصلاة بالحرم)', days: 3, hotelArea: 'أبراج الساعة / وقف الملك عبدالعزيز' },
        { id: 'madinah', cityName: 'المدينة المنورة (المسجد النبوي والروضة الشريفة ومسجد قباء)', days: 3, hotelArea: 'المركزية الشمالية' },
      ],
    };

    if (onPlanTrip) {
      onPlanTrip(payload);
    } else if (onApplyUmrahPlan) {
      onApplyUmrahPlan(payload);
    }
  };

  // Official verified services
  const OFFICIAL_HARAMAIN_SERVICES = [
    {
      id: 'nusuk_official',
      title: 'منصة نُسك الرسمية (Nusuk Platform)',
      authority: 'وزارة الحج والعمرة - المملكة العربية السعودية',
      badge: 'المنصة الوطنية الموحدة',
      desc: 'البوابة الحكومية الرسمية لإصدار تأشيرات العمرة والزيارة فورياً، وحجز تصاريح أداء العمرة وتصاريح الصلاة في الروضة الشريفة للرجال والنساء.',
      url: 'https://www.nusuk.sa/ar',
      features: [
        'إصدار تصريح العمرة الفوري ومراقبة الطاقة الاستيعابية',
        'حجز موعد الصلاة في الروضة الشريفة بالمسجد النبوي',
        'استخراج التأشيرة الإلكترونية المباشرة لجميع الجنسيات',
        'شراء باقات الحج المعتمدة لموسم الحج الرسمي',
      ],
      actionLabel: 'الانتقال لمنصة نُسك الرسمية',
      color: 'from-amber-600/30 to-amber-900/20 border-amber-500/50 text-amber-300',
      icon: '🕋',
    },
    {
      id: 'haramain_train',
      title: 'قطار الحرمين السريع (Haramain Railway)',
      authority: 'الخطوط الحديدية السعودية (سار / SAR)',
      badge: 'النقل السريع بين الحرمين (300 كم/س)',
      desc: 'حجز التذاكر المباشر لقطار الحرمين فائق السرعة الرابط بين مطار الملك عبدالعزيز بجدة ومكة المكرمة والمدينة المنورة في وقت قياسي وبراحة فائقة.',
      url: 'https://sar.hhr.sa/ar',
      features: [
        'مطار جدة ⟵ مكة المكرمة في 35 دقيقة فقط',
        'مكة المكرمة ⟵ المدينة المنورة في ساعتين و20 دقيقة',
        'شحن الأمتعة والجلوس في مقاعد الدرجة الاقتصادية أو الأعمال الفاخرة',
        'محطات قطار مجهزة بمصليات وصالات استقبال VIP',
      ],
      actionLabel: 'حجز تذاكر قطار الحرمين الرسمي',
      color: 'from-emerald-600/30 to-teal-900/20 border-emerald-500/50 text-emerald-300',
      icon: '🚄',
    },
    {
      id: 'tanaqol_carts',
      title: 'خدمة العربات الكهربائية للطواف والسعي (تطبيق تنقل)',
      authority: 'الهيئة العامة للعناية بشؤون المسجد الحرام والمسجد النبوي',
      badge: 'خدمة كبار السن وذوي الاحتياجات',
      desc: 'حجز العربات الكهربائية المعتمدة والمطوفة داخل الحرم المكي الشريف للطواف والسعي عبر المسارات المخصصة بالدور الميزانين والدور الأول.',
      url: 'https://gph.gov.sa',
      features: [
        'حجز فوري مسبق لعربة كهربائية فردية أو مزدوجة',
        'مسارات خاصة مظللة ومكيفة للطواف والسعي السلس',
        'توفر خدمة دافعي العربات المعتمدين والموثقين رسمياً',
        'سداد إلكتروني معتمد بدون أي مبالغات سعرية',
      ],
      actionLabel: 'حجز خدمة العربات الكهربائية',
      color: 'from-blue-600/30 to-indigo-900/20 border-blue-500/50 text-blue-300',
      icon: '🦽',
    },
    {
      id: 'zamzam_project',
      title: 'مشروع الملك عبدالله بن عبدالعزيز لسقيا زمزم',
      authority: 'مشروع سقيا زمزم الرسمي ومطارات المملكة',
      badge: 'ماء زمزم المبارك المعتمد للشحن',
      desc: 'الجهة الوحيدة المعتمدة لتعبئة وتغليف عبوات ماء زمزم بسعة 5 لترات المهيأة للشحن الجوي في جميع صالات مطارات جدة والمدينة والرياض.',
      url: 'https://zamzam.kasp.com.sa',
      features: [
        'استلام عبوات ماء زمزم المغلفة رسمياً والمخصصة للشحن',
        'نقاط بيع رسمية بصالات المغادرة الدولية بالمطارات',
        'شحن آمن بدون تسريب ومعتمد من شركات الطيران العالمية',
      ],
      actionLabel: 'موقع مشروع سقيا زمزم الرسمي',
      color: 'from-cyan-600/30 to-blue-900/20 border-cyan-500/50 text-cyan-300',
      icon: '💧',
    },
    {
      id: 'haramain_guidance',
      title: 'بوابة الحرمين الشريفين والترجمة الفورية',
      authority: 'رئاسة الشؤون الدينية بالمسجد الحرام والمسجد النبوي',
      badge: 'الخرائط التفاعلية والدروس والترجمة',
      desc: 'خرائط أبواب المسجد الحرام والمسجد النبوي، معرفة المصليات المتاحة ومصليات الجنائز، والاستماع للترجمة الفورية لخطبة الجمعة بـ 10 لغات عالمية.',
      url: 'https://gph.gov.sa',
      features: [
        'خريطة أبواب الحرم المكي ومصليات التوسعة السعودية الثالثة',
        'جدول أئمة الحرم المكي والنبوي للصلوات المكتوبة والتهجد',
        'بث مباشر وترجمة فورية لخطبة الجمعة ودروس الحرمين',
        'أرقام مكاتب إرشاد التائهين ومفقودات الحرمين على مدار الساعة',
      ],
      actionLabel: 'تصفح خدمات الحرمين الرسمية',
      color: 'from-amber-600/30 to-emerald-900/20 border-amber-500/50 text-amber-200',
      icon: '📖',
    },
    {
      id: 'madinah_historical',
      title: 'منصة زيارة معالم المدينة المنورة ومسجد قباء',
      authority: 'هيئة تطوير منطقة المدينة المنورة',
      badge: 'المزارات التاريخية المعتمدة',
      desc: 'دليل النقل الترددي والمعالم النبوية: مسجد قباء، جبل أحد ومقبرة الشهداء، مسجد القبلتين، وبئر غرس ومزارع النخيل التراثية.',
      url: 'https://mda.gov.sa',
      features: [
        'حافلات النقل الترددي السياحية المكيفة بين الحرم وقباء وأحد',
        'دخول مسجد قباء وأداء ركعتين بأجر عمرة تامة',
        'مسار مشاة درب السنة المطور والمظلل الرابط بين الحرم النبوي وقباء',
      ],
      actionLabel: 'دليل معالم ومزارات المدينة المنورة',
      color: 'from-emerald-600/30 to-teal-900/20 border-emerald-500/50 text-emerald-300',
      icon: '🌴',
    },
  ];

  // Rituals checklist step by step
  const UMRAH_RITUALS_STEPS = [
    {
      step: 1,
      title: 'الإحرام من الميقات والتلبية',
      time: 'قبل تجاوز الميقات المكاني',
      location: 'ميقات يلملم (لقادمي مصر واليمن) أو الجحفة / رابغ (لقادمي الشام والمدينة) أو قرن المنازل (أهل نجد والخليج) أو في الطائرة عند محاذاة الميقات',
      details: 'الاغتسال والتطيب في البدن (وليس في ملابس الإحرام للرجال)، ارتداء إزاري الإحرام الأبيضين (وللمرأة ملابسها الساترة المعتادة دون نقاب أو قفازين)، ونية الدخول في النسك بقول: «لبيك اللهم عمرة»، ثم الإكثار من التلبية: «لبيك اللهم لبيك، لبيك لا شريك لك لبيك، إن الحمد والنعمة لك والملك لا شريك لك».',
      tips: 'إذا كنت مسافراً بالطائرة، ارتدِ ملابس الإحرام في مطار المغادرة أو بالطائرة قبل إعلان قائد الطائرة عن محاذاة الميقات بنصف ساعة.',
    },
    {
      step: 2,
      title: 'دخول المسجد الحرام والطواف بالبيت 7 أشواط',
      time: 'عند الوصول لمكة المكرمة',
      location: 'صحن المطاف أو مسارات الأدوار العليا بالمسجد الحرام',
      details: 'دخول الحرم بالقدم اليمنى مع دعاء دخول المسجد. التوجه للكعبة المشرفة والبدء من محاذاة الحجر الأسود بالتكبير («بسم الله، والله أكبر»). الطواف 7 أشواط كاملة جاعلاً الكعبة عن يسارك، والإكثار من الدعاء وقراءة القرآن والذكر. ويستحب عند المرور بين الركن اليماني والحجر الأسود قول: «رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ».',
      tips: 'للطائفين من الرجال، يسن الاضطباع (كشف الكتف الأيمن) والرمل (الإسراع في المشي) في الأشواط الثلاثة الأولى فقط من طواف القدوم.',
    },
    {
      step: 3,
      title: 'صلاة ركعتي الطواف والشرب من زمزم',
      time: 'عقب إتمام الشوط السابع مباشرة',
      location: 'خلف مقام إبراهيم عليه السلام أو في أي مكان متاح بالمسجد الحرام',
      details: 'صلاة ركعتين خفيفتين خلف مقام إبراهيم (أو بأي ركن من الحرم في حال الزحام)، يقرأ في الأولى بعد الفاتحة بـ «قل يا أيها الكافرون» وفي الثانية بـ «قل هو الله أحد»، ثم التوجه لنقاط سقيا زمزم والشرب حتى التضلع والدعاء بما تيسر.',
      tips: 'لا تضيق على الطائفين بالصلاة قريباً جداً من المقام في أوقات الذروة، فالصلاة في أي مكان بالحرم مجزئة بإذن الله.',
    },
    {
      step: 4,
      title: 'السعي بين الصفا والمروة 7 أشواط',
      time: 'بعد ركعتي الطواف والشرب من زمزم',
      location: 'المسعى بالمسجد الحرام (مكيف ومجهز بعدة طوابق)',
      details: 'التوجه إلى جبل الصفا وتلاوة: «إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ»، واستقبال القبلة ورفع اليدين بالدعاء والتكبير 3 مرات. البدء من الصفا إلى المروة (وهذا شوط)، ومن المروة إلى الصفا (شوط ثانٍ)، حتى يكتمل 7 أشواط وينتهي الشوط السابع عند المروة.',
      tips: 'يسن للرجال فقط الهرولة الخفيفة بين العلمين الأخضرين في المسعى، بينما تمشي النساء بمشيتهن العادية.',
    },
    {
      step: 5,
      title: 'الحلق أو التقصير والتحلل من الإحرام',
      time: 'فور ختام الشوط السابع عند المروة',
      location: 'صالونات الحلاقة المعتمدة حول ساحات الحرم المكي',
      details: 'حلق جميع شعر الرأس للرجال (وهو الأفضل) أو تقصيره من كافة جوانب الرأس. وللمرأة تقصير قدر أنملة (حوالي 2 سم) من أطراف ضفائر شعرها. وبذلك تتم العمرة بحمد الله ويتحلل المعتمر تحللاً كاملاً من جميع محظورات الإحرام.',
      tips: 'احرص على استخدام شفرات حلاقة جديدة أحادية الاستخدام في صالونات الحلاقة المرخصة المحيطة بوقف الملك عبدالعزيز وساحة الحرم.',
    },
    {
      step: 6,
      title: 'زيارة المدينة المنورة والصلاة بالروضة الشريفة',
      time: 'قبل أو بعد أداء العمرة',
      location: 'المسجد النبوي الشريف، المدينة المنورة',
      details: 'الصلاة في المسجد النبوي (الصلاة فيه خير من ألف صلاة فيما سواه)، والسلام على النبي ﷺ وصاحبيه أبي بكر وعمر رضي الله عنهما، وأداء الصلاة في الروضة الشريفة («ما بين بيتي ومنبري روضة من رياض الجنة») وفق الموعد المحجوز عبر منصة نسك، وزيارة مسجد قباء ومقبرة البقيع وشهداء أحد.',
      tips: 'احجز تصريح الروضة الشريفة عبر تطبيق نسك مبكراً قبل السفر لتأكيد الفترة المناسبة (توجد فترات مخصصة للنساء صباحاً ومساءً وفترات مخصصة للرجال).',
    },
  ];

  return (
    <div className="bg-[#070b14] border border-[#d4af37]/40 rounded-3xl p-4 sm:p-7 shadow-[0_12px_45px_rgba(0,0,0,0.85)] text-white relative overflow-hidden animate-in fade-in duration-300">
      
      {/* Glow Effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d4af37] via-[#f5d061] to-[#8a6d1c] p-0.5 shadow-xl shadow-[#d4af37]/20 flex items-center justify-center flex-shrink-0">
            <div className="w-full h-full bg-[#090f1d] rounded-[14px] flex items-center justify-center text-2xl">
              🕋
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>بوابة الحج والعمرة والخدمات الرسمية للحرمين</span>
              </h2>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ربط رسمي معتمد</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1">
              دليلك الشامل لمنصة نُسك، قطار الحرمين السريع، تصاريح الروضة الشريفة، عربات الطواف، وخطوات المناسك الميسرة.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto">
          <button
            type="button"
            id="apply-quick-umrah-btn"
            onClick={handleApplyQuickUmrah}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#f5d061] to-[#d4af37] text-black font-black text-xs sm:text-sm shadow-xl shadow-[#d4af37]/20 hover:scale-[1.02] transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>تطبيق خطة العمرة والزيارة فوراً 🚀</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto py-4 border-b border-neutral-800/80 scrollbar-none">
        {[
          { id: 'official_services', label: 'الخدمات والبوابات الرسمية 🏛️', icon: ShieldCheck },
          { id: 'rituals_guide', label: 'دليل مناسك العمرة والزيارة خطوة بخطوة 📖', icon: Compass },
          { id: 'train_transport', label: 'قطار الحرمين والمواصلات السريعة 🚄', icon: Train },
          { id: 'hotels_zamzam', label: 'فنادق ساحات الحرمين وسقيا زمزم 🏨', icon: Heart },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#e5be42] text-black font-black shadow-lg shadow-[#d4af37]/20 scale-[1.02]'
                  : 'bg-[#0d1424] text-neutral-300 hover:bg-[#152038] hover:text-white border border-neutral-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content 1: Official Services */}
      {activeTab === 'official_services' && (
        <div className="pt-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {OFFICIAL_HARAMAIN_SERVICES.map((srv) => (
              <div
                key={srv.id}
                className="bg-[#0b1220] border border-neutral-800 hover:border-[#d4af37]/60 rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all hover:scale-[1.01] hover:shadow-xl group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-xl flex-shrink-0">
                      {srv.icon}
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-[#d4af37]/15 text-[#f5d061] border border-[#d4af37]/30 text-center">
                      {srv.badge}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-black text-white group-hover:text-[#f5d061] transition-colors mb-1">
                    {srv.title}
                  </h3>
                  <p className="text-[11px] text-[#d4af37] font-semibold mb-2">
                    {srv.authority}
                  </p>
                  <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                    {srv.desc}
                  </p>

                  <div className="space-y-1.5 mb-4">
                    {srv.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-1.5 text-[11px] text-neutral-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-800/80 flex items-center gap-2">
                  <a
                    href={srv.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#d4af37] hover:bg-[#f5d061] text-black font-extrabold text-xs transition-all shadow-md shadow-[#d4af37]/20"
                  >
                    <span>{srv.actionLabel}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy(srv.url, srv.id)}
                    className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 transition-all"
                    title="نسخ الرابط الرسمي"
                  >
                    {copiedLink === srv.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 2: Step-by-Step Rituals Guide */}
      {activeTab === 'rituals_guide' && (
        <div className="pt-5 space-y-4">
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-center gap-3">
            <span className="text-2xl">✨</span>
            <div className="text-xs sm:text-sm text-neutral-200">
              <p className="font-bold text-amber-300">مناسك العمرة النبوية الميسرة للمسافرين والعائلات</p>
              <p className="text-neutral-400 text-xs mt-0.5">تتبع الخطوات بالترتيب بدءاً من الميقات المكاني حتى التحلل الكامل وزيارة المسجد النبوي الشريف.</p>
            </div>
          </div>

          <div className="space-y-3">
            {UMRAH_RITUALS_STEPS.map((step, idx) => {
              const isExpanded = expandedRitual === idx;
              return (
                <div
                  key={step.step}
                  className={`border rounded-2xl transition-all ${
                    isExpanded 
                      ? 'bg-[#0e1628] border-[#d4af37] shadow-xl shadow-black/50' 
                      : 'bg-[#090f1d] border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div
                    onClick={() => setExpandedRitual(isExpanded ? null : idx)}
                    className="p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${
                        isExpanded ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/30' : 'bg-neutral-800 text-[#f5d061]'
                      }`}>
                        {step.step}
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                          <span>{step.title}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300">
                            {step.time}
                          </span>
                        </h4>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          📍 {step.location}
                        </p>
                      </div>
                    </div>

                    <div className="text-neutral-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-[#d4af37]" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-5 pt-1 border-t border-neutral-800/80 text-xs sm:text-sm space-y-3 animate-in fade-in">
                      <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 text-neutral-200 leading-relaxed">
                        <strong className="text-[#f5d061] block mb-1">شرح النسك والصفة الشرعية:</strong>
                        {step.details}
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-200 flex items-start gap-2 text-xs">
                        <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-emerald-300 block mb-0.5">نصيحة ذهبية لتيسير النسك:</strong>
                          {step.tips}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Content 3: Haramain Train Transport */}
      {activeTab === 'train_transport' && (
        <div className="pt-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0b1220] border border-neutral-800 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🚄</span>
                <div>
                  <h4 className="font-black text-white text-base">جدول رحلات ومسارات قطار الحرمين</h4>
                  <p className="text-xs text-emerald-400">السرعة القصوى 300 كم/س • قطارات كهربائية بالكامل</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-neutral-300">
                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                  <div>
                    <strong className="text-white block">مطار جدة (KAIA) ⟵ مكة المكرمة</strong>
                    <span className="text-neutral-400 text-[11px]">محطة داخل صالة المطار مباشرة</span>
                  </div>
                  <span className="font-bold text-[#f5d061] bg-[#d4af37]/10 px-2.5 py-1 rounded-lg">35 دقيقة</span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                  <div>
                    <strong className="text-white block">مكة المكرمة ⟵ المدينة المنورة</strong>
                    <span className="text-neutral-400 text-[11px]">من محطة الرصيفة إلى محطة المعرفة</span>
                  </div>
                  <span className="font-bold text-[#f5d061] bg-[#d4af37]/10 px-2.5 py-1 rounded-lg">ساعتان و20 دقيقة</span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                  <div>
                    <strong className="text-white block">مطار جدة (KAIA) ⟵ المدينة المنورة</strong>
                    <span className="text-neutral-400 text-[11px]">رحلة مباشرة بدون توقف طويل</span>
                  </div>
                  <span className="font-bold text-[#f5d061] bg-[#d4af37]/10 px-2.5 py-1 rounded-lg">ساعة و48 دقيقة</span>
                </div>
              </div>

              <a
                href="https://sar.hhr.sa/ar"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs transition-all shadow-lg shadow-emerald-500/20"
              >
                <span>حجز تذاكر القطار الرسمية من موقع SAR</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-[#0b1220] border border-neutral-800 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🚕</span>
                <div>
                  <h4 className="font-black text-white text-base">النقل الترددي وتطبيقات التوصيل المعتمدة</h4>
                  <p className="text-xs text-blue-400">حافلات مكة المكرمة وتطبيقات أوبر وكريم المعتمدة</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-neutral-300">
                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                  <strong className="text-white block mb-0.5">🚌 حافلات مكة المكرمة (Makkah Bus):</strong>
                  <p className="text-neutral-400 text-[11px] leading-relaxed">
                    شبكة حافلات مكيفة مجانية وحديثة تربط جميع أحياء مكة المكرمة ومحطة القطار بمحطات الحرم المكي المركزية (محطة كدي، محطة أجياد، ومحطة الغزة).
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                  <strong className="text-white block mb-0.5">🚖 سيارات الأجرة وتطبيقات الهواتف:</strong>
                  <p className="text-neutral-400 text-[11px] leading-relaxed">
                    توفر تطبيقات (Uber, Careem, Bolt, Kaiian) مع نقاط التقاط محددة خارج المنطقة المركزية لمنع الاختناقات المرورية.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 4: Hotels & Zamzam */}
      {activeTab === 'hotels_zamzam' && (
        <div className="pt-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0b1220] border border-neutral-800 rounded-2xl p-5">
              <h4 className="font-black text-white text-base mb-2 flex items-center gap-2">
                <span>🏨</span>
                <span>فنادق الساحات المركزية المباشرة</span>
              </h4>
              <p className="text-xs text-neutral-300 mb-4 leading-relaxed">
                ينصح باختيار الفنادق الواقعة في وقف الملك عبدالعزيز (أبراج الساعة، فيرمونت، رافلز، سويس أوتيل، موفنبيك) أو جبل عمر في مكة، وفنادق المنطقة المركزية الشمالية (أوبروي، دار التقوى، بولمان زمزم) في المدينة للاستمتاع بالسماع المباشر للأذان والصلاة من الغرفة.
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                  <span className="text-white font-bold">فنادق مكة (أبراج الساعة وجبل عمر)</span>
                  <span className="text-emerald-400 text-[11px]">0 دقيقة إلى ساحة الحرم</span>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                  <span className="text-white font-bold">فنادق المدينة (المركزية الشمالية)</span>
                  <span className="text-emerald-400 text-[11px]">خطوات إلى باب السلام والروضة</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0b1220] border border-neutral-800 rounded-2xl p-5">
              <h4 className="font-black text-white text-base mb-2 flex items-center gap-2">
                <span>💧</span>
                <span>شروط وتعليمات شحن ماء زمزم بالمطارات</span>
              </h4>
              <ul className="space-y-2 text-xs text-neutral-300 leading-relaxed list-disc list-inside">
                <li>يحق لكل معتمر يحمل تأشيرة عمرة شراء عبوة زمزم واحدة رسمية (سعة 5 لترات).</li>
                <li>يتم الشراء مباشرة من منصات كودا المعتمدة داخل صالة المغادرة بالمطار قبل تسليم الأمتعة.</li>
                <li>لا يسمح بوضع عبوات ماء زمزم داخل حقائب السفر العادية تفادياً للتسريب أو مصادرتها.</li>
                <li>تغليف المصنع الآلي معتمد ومختوم بباركود رسمي للتحقق الدولي.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

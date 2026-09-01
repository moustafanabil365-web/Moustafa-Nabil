import React, { useState } from 'react';
import { 
  ShieldCheck, MapPin, ExternalLink, Sparkles, Compass, 
  Heart, Copy, Check, Info, ArrowRight, BookOpen, Clock, Navigation
} from 'lucide-react';
import { TravelConstraints } from '../types';
import { SupportedLanguage } from '../utils/i18n';

interface PalestineJerusalemHubProps {
  onApplyPalestinePlan?: (constraints: Partial<TravelConstraints>) => void;
  onPlanTrip?: (constraints: any) => void;
  currentLanguage?: SupportedLanguage;
  onClose?: () => void;
}

export const PalestineJerusalemHub: React.FC<PalestineJerusalemHubProps> = ({
  onApplyPalestinePlan,
  onPlanTrip,
  currentLanguage,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'holy_landmarks' | 'transit_access' | 'interfaith_guide' | 'local_advisory'>('holy_landmarks');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleApplyQuickPalestine = () => {
    const payload = {
      destination: 'القدس، بيت لحم، والخليل، فلسطين',
      durationDays: 5,
      groupType: 'family_kids' as const,
      budget: 1600,
      currency: 'USD',
      travelStyle: 'spiritual_pilgrimage' as const,
      accommodationArea: 'البلدة القديمة بالقدس / شارع صلاح الدين وبيت لحم',
      specialConstraints: 'السفر الميسر عبر معبر الكرامة (جسر الملك حسين) من الأردن، زيارة المسجد الأقصى وقبة الصخرة والمصلى المرواني، زيارة كنيسة القيامة ودرب الآلام، كنيسة المهد في بيت لحم، والحرم الإبراهيمي في الخليل مع مرشد مقدسي مرخص.',
      dialect: 'modern_standard_arabic' as const,
      isMultiCity: true,
      preferredTransit: 'optimal' as const,
      cityStops: [
        { id: 'jerusalem', cityName: 'القدس الشريف (المسجد الأقصى، قبة الصخرة، كنيسة القيامة، جبل الزيتون)', days: 3, hotelArea: 'باب العامود / شارع الزهراء' },
        { id: 'bethlehem', cityName: 'بيت لحم (كنيسة المهد، مغارة الحليب، حقل الرعاة)', days: 1, hotelArea: 'ساحة المهد' },
        { id: 'hebron', cityName: 'الخليل (الحرم الإبراهيمي الشريف والبلدة العتيقة)', days: 1, hotelArea: 'مركز الخليل' },
      ],
    };

    if (onPlanTrip) {
      onPlanTrip(payload);
    } else if (onApplyPalestinePlan) {
      onApplyPalestinePlan(payload);
    }
  };

  const HOLY_PALESTINIAN_SITES = [
    {
      id: 'alaqsa_compound',
      title: 'المسجد الأقصى المبارك وقبة الصخرة المشرفة',
      location: 'البلدة القديمة، القدس الشريف',
      faith: 'مقدسات إسلامية (أولى القبلتين وثالث الحرمين الشريفين)',
      desc: 'المسجد الأقصى المبارك بكامل مساحته البالغة 144 دونماً، بما يحويه من الجامع القبلي ذي القبة الرصاصية، مسجد قبة الصخرة الذهبية المشرفة، المصلى المرواني، ومصلى باب الرحمة، والآبار والأروقة والمآذن الأثرية التاريخية.',
      tips: 'أفضل أوقات الصلاة والزيارة فجراً وظهراً، الدخول متاح من باب الأسباط وباب حطة وباب المجلس وباب السلسلة.',
      image: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'holy_sepulchre',
      title: 'كنيسة القيامة ودرب الآلام (Via Dolorosa)',
      location: 'حارة النصارى، البلدة القديمة، القدس الشريف',
      faith: 'مقدسات مسيحية (أقدس كنائس العالم المسيحي)',
      desc: 'الكنيسة التي تضم القبر المقدس ومكان الجلجثة، وتعد قبلة الحجاج المسيحيين من كافة أرجاء الأرض. يسبقها مسار درب الآلام المكون من 14 مرحلة تاريخية تبدأ من باب الأسباط وتمر بأسواق البلدة القديمة حتى الوصول إلى الكنيسة.',
      tips: 'يفتح باب الكنيسة في الصباح الباكر، وتقام القداديس اليومية لمختلف الطوائف (الروم الأرثوذكس، اللاتين الكاثوليك، الأرمن، السريان، والأقباط).',
      image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'nativity_bethlehem',
      title: 'كنيسة المهد ومغارة الميلاد',
      location: 'ساحة المهد، بيت لحم (10 كم جنوب القدس)',
      faith: 'مقدسات مسيحية وإسلامية عالمية (موقع ولادة السيد المسيح)',
      desc: 'أقدم كنيسة في العالم ما زالت تقام فيها الطقوس الدينية بانتظام، بنيت فوق المغارة التي ولد فيها السيد المسيح عليه السلام، وتتميز بأرضيات الفسيفساء البيزنطية وأعمدة الرخام الوردي وباب التواضع التاريخي.',
      tips: 'يمكن الوصول إليها بسهولة عبر حافلات النقل العام رقم 231 من محطة باب العامود بالقدس أو عبر السيارات السياحية.',
      image: 'https://images.unsplash.com/photo-1548625361-16a7e0a8ce88?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'ibrahimi_hebron',
      title: 'الحرم الإبراهيمي الشريف والبلدة العتيقة',
      location: 'البلدة القديمة، الخليل (30 كم جنوب القدس)',
      faith: 'مقدسات إسلامية وإرث تاريخي',
      desc: 'الصرح التاريخي العظيم المحاط بسور هيرودوسي ضخم، يضم مقامات وأضرحة أبي الأنبياء إبراهيم الخليل وزوجته سارة، وإسحاق ويعقوب ويوسف عليهم السلام، محاطاً بأسواق ومصانع الفخار والزجاج اليدوي الشهير.',
      tips: 'الزيارة منسقة ومنظمة، يفضل الذهاب في الصباح والتجول في حارة القزازين وتذوق الحلقوم الخليلي والراحة.',
      image: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div className="bg-[#060b13] border border-emerald-500/40 rounded-3xl p-4 sm:p-7 shadow-[0_12px_45px_rgba(0,0,0,0.85)] text-white relative overflow-hidden animate-in fade-in duration-300">
      
      {/* Background accents */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-400 to-amber-500 p-0.5 shadow-xl shadow-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <div className="w-full h-full bg-[#090f1d] rounded-[14px] flex items-center justify-center text-2xl">
              🕊️
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>مسار القدس وفلسطين المباركة (المقدسات الإسلامية والمسيحية)</span>
              </h2>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                🇵🇸 إرث وتراث عالمي
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1">
              دليل الزيارة الشامل للمسجد الأقصى، قبة الصخرة، كنيسة القيامة، كنيسة المهد في بيت لحم، والحرم الإبراهيمي في الخليل وإرشادات المعابر والتنقل الميسر.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto">
          <button
            type="button"
            id="apply-palestine-plan-btn"
            onClick={handleApplyQuickPalestine}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-black font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>تطبيق مسار القدس وفلسطين 🚀</span>
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

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto py-4 border-b border-neutral-800/80 scrollbar-none">
        {[
          { id: 'holy_landmarks', label: 'المعالم والمقدسات الدينية 🕌⛪', icon: MapPin },
          { id: 'transit_access', label: 'طرق الوصول ومعبر الكرامة (جسر الملك حسين) 🛂', icon: Navigation },
          { id: 'interfaith_guide', label: 'دليل الزائر والآداب والصلوات 📖', icon: BookOpen },
          { id: 'local_advisory', label: 'الإقامة والتسوق والأطعمة المقدسية 🫒', icon: Heart },
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
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black shadow-lg shadow-emerald-500/20 scale-[1.02]'
                  : 'bg-[#0d1424] text-neutral-300 hover:bg-[#152038] hover:text-white border border-neutral-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content 1: Holy Sites */}
      {activeTab === 'holy_landmarks' && (
        <div className="pt-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {HOLY_PALESTINIAN_SITES.map((site) => (
              <div
                key={site.id}
                className="bg-[#0b1220] border border-neutral-800 hover:border-emerald-500/50 rounded-2xl overflow-hidden flex flex-col justify-between transition-all group"
              >
                <div className="relative h-44 w-full overflow-hidden bg-neutral-900">
                  <img
                    src={site.image}
                    alt={site.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220] via-transparent to-black/40" />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold text-emerald-300">
                    📍 {site.location}
                  </div>
                </div>

                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-amber-300 block mb-1">
                      {site.faith}
                    </span>
                    <h3 className="text-base font-black text-white group-hover:text-emerald-300 transition-colors mb-2">
                      {site.title}
                    </h3>
                    <p className="text-xs text-neutral-300 leading-relaxed mb-3">
                      {site.desc}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-200">
                    <strong className="text-emerald-300 block mb-0.5">💡 إرشادات الزيارة:</strong>
                    {site.tips}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content 2: Transit & Access */}
      {activeTab === 'transit_access' && (
        <div className="pt-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0b1220] border border-neutral-800 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🚌</span>
                <div>
                  <h4 className="font-black text-white text-base">المسار البري عبر الأردن (معبر الكرامة / جسر الملك حسين)</h4>
                  <p className="text-xs text-emerald-400">المسار المفضل والتقليدي للمسافرين العرب والمسلمين</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-neutral-300">
                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                  <strong className="text-white block mb-0.5">1. الوصول إلى مطار الملكة علياء الدولي (عمّان - الأردن):</strong>
                  <p className="text-neutral-400 text-[11px]">ركوب سيارة تاكسي سياحي أو حافلة جت مباشرة إلى جسر الملك حسين (حوالي 45 دقيقة من عمّان).</p>
                </div>
                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                  <strong className="text-white block mb-0.5">2. إجراءات المعبر والحافلات الترددية (VIP Service):</strong>
                  <p className="text-neutral-400 text-[11px]">توفر خدمة VIP السريعة لختم الجوازات ونقل الحقائب بدون انتظار، والانتقال عبر باصات المعبر إلى الجانب الفلسطيني في أريحا.</p>
                </div>
                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                  <strong className="text-white block mb-0.5">3. من أريحا إلى القدس الشريف:</strong>
                  <p className="text-neutral-400 text-[11px]">ركوب سيارات النقل السياحي من استراحة أريحا إلى باب العامود أو الفندق بالقدس (حوالي 30-40 دقيقة).</p>
                </div>
              </div>
            </div>

            <div className="bg-[#0b1220] border border-neutral-800 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">✈️</span>
                <div>
                  <h4 className="font-black text-white text-base">الوصول الجوي المباشر</h4>
                  <p className="text-xs text-blue-400">لحاملي الجوازات الأجنبية وتأشيرات الدخول الإلكترونية</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-neutral-300">
                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                  <strong className="text-white block mb-0.5">الوصول عبر مطار بن غوريون (TLV):</strong>
                  <p className="text-neutral-400 text-[11px]">ركوب قطار المطار السريع مباشرة إلى محطة القدس المركزية (Yitzhak Navon) في 20 دقيقة فقط، ثم الترام الخفيف (Light Rail) إلى باب العامود والبلدة القديمة.</p>
                </div>
                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                  <strong className="text-white block mb-0.5">حافلات النقل بين القدس والمدن الفلسطينية:</strong>
                  <p className="text-neutral-400 text-[11px]">محطة حافلات باب العامود المركزية (محطة الحافلات العربية) تنطلق منها خطوط مباشرة لبيت لحم، رام الله، وأريحا بانتظام على مدار اليوم.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content 3: Interfaith & Visiting etiquette */}
      {activeTab === 'interfaith_guide' && (
        <div className="pt-5 space-y-4">
          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
            <h4 className="font-bold text-emerald-300 text-sm flex items-center gap-2">
              <span>🌿</span>
              <span>إرشادات احترام المقدسات والتعايش الروحي</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-300">
              <div className="p-3 rounded-xl bg-black/40 border border-neutral-800">
                <strong className="text-white block mb-1">زيارة المسجد الأقصى المبارك:</strong>
                <p className="text-neutral-400 text-[11px] leading-relaxed">
                  الالتزام باللباس المحتشم الساتر، خلع الأحذية عند دخول المصليات المسقوفة (القبلي، قبة الصخرة، المرواني)، عدم رفع الصوت، ومشاركة أهل القدس في الصلاة وحلقات العلم.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-neutral-800">
                <strong className="text-white block mb-1">زيارة كنيسة القيامة والمهد:</strong>
                <p className="text-neutral-400 text-[11px] leading-relaxed">
                  احترام أوقات القداديس والصلوات الكنسية، إشعال الشموع برفق وخشوع، والتجول في الكنائس والصلوات بهدوء وسكينة تامة.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content 4: Local food & stay */}
      {activeTab === 'local_advisory' && (
        <div className="pt-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0b1220] border border-neutral-800 rounded-2xl p-5">
              <h4 className="font-black text-white text-base mb-2 flex items-center gap-2">
                <span>🫓</span>
                <span>المأكولات والتراث الشعبي الفلسطيني الشهير</span>
              </h4>
              <ul className="space-y-2 text-xs text-neutral-300 list-disc list-inside">
                <li><strong className="text-white">كعك القدس بالسمسم والفلافل والبيض المشوي:</strong> عند باب العامود وشارع الواد.</li>
                <li><strong className="text-white">المسخن الفلسطيني الأصيل بزيت الزيتون والبلدي والسماق:</strong> في مطاعم القدس ورام الله.</li>
                <li><strong className="text-white">الكنافة النابلسية والمقدسية على الحطب:</strong> حلويات جعفر وزلاطيمو بالبلدة القديمة.</li>
                <li><strong className="text-white">الفخار والزجاج الخليلي والمطرزات اليدوية:</strong> أسواق الخليل والقدس التراثية.</li>
              </ul>
            </div>

            <div className="bg-[#0b1220] border border-neutral-800 rounded-2xl p-5">
              <h4 className="font-black text-white text-base mb-2 flex items-center gap-2">
                <span>🏨</span>
                <span>مناطق الإقامة الفندقية الموصى بها</span>
              </h4>
              <div className="space-y-2 text-xs text-neutral-300">
                <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                  <strong className="text-white block">شارع صلاح الدين والزهراء (القدس):</strong>
                  <span className="text-neutral-400 text-[11px]">فنادق عريقة على بعد 5 دقائق مشياً من باب الساهرة وباب العامود (فندق الأمريكان كولوني، فندق الكومودور، فندق الوطني).</span>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                  <strong className="text-white block">منطقة ساحة المهد (بيت لحم):</strong>
                  <span className="text-neutral-400 text-[11px]">إطلالة مباشرة على ساحة المهد وأسواق المدينة الحرفية.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

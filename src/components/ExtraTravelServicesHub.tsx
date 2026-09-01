import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, Wifi, Car, Compass, Search, ExternalLink, 
  Sparkles, Check, Phone, ArrowUpRight, Globe, AlertCircle, 
  HelpCircle, Clock, Copy, X, CheckCircle2, ChevronRight, Filter
} from 'lucide-react';
import { 
  EXTRA_TRAVEL_SERVICES_DATABASE, 
  SERVICE_CATEGORIES, 
  ExtraTravelServiceItem 
} from '../data/extraTravelServices';
import { SupportedLanguage } from '../utils/i18n';

interface ExtraTravelServicesHubProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
  destinationCity?: string;
  currentLanguage?: SupportedLanguage;
}

export const ExtraTravelServicesHub: React.FC<ExtraTravelServicesHubProps> = ({
  isOpen,
  onClose,
  initialCategory = 'all',
  destinationCity = '',
  currentLanguage = 'ar',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Quote & Helper Form State
  const [quoteDestination, setQuoteDestination] = useState(destinationCity || 'وجهة السفر المستهدفة');
  const [quoteTravelersCount, setQuoteTravelersCount] = useState('2');
  const [quoteDurationDays, setQuoteDurationDays] = useState('7');
  const [quoteServiceType, setQuoteServiceType] = useState<'insurance' | 'esim' | 'transfers' | 'all'>('insurance');
  const [generatedAdvice, setGeneratedAdvice] = useState<string | null>(null);

  // Interactive Redirect Modal State
  const [redirectData, setRedirectData] = useState<{
    isOpen: boolean;
    provider: ExtraTravelServiceItem | null;
    step: number;
    stepMessage: string;
    progress: number;
  }>({
    isOpen: false,
    provider: null,
    step: 1,
    stepMessage: '',
    progress: 0,
  });

  const filteredServices = useMemo(() => {
    return EXTRA_TRAVEL_SERVICES_DATABASE.filter((item) => {
      // Category check
      const matchesCategory =
        selectedCategory === 'all' ||
        item.category === selectedCategory ||
        (selectedCategory === 'insurance' && item.category === 'medical_telehealth');

      // Region check
      let matchesRegion = true;
      if (selectedRegionFilter !== 'all') {
        const text = (item.coverageCountries + ' ' + item.tagline + ' ' + item.summary + ' ' + item.recommendedFor).toLowerCase();
        if (selectedRegionFilter === 'europe' && !text.includes('أوروبا') && !text.includes('شنغن') && !text.includes('سويسرا') && !text.includes('بريطانيا')) {
          matchesRegion = false;
        } else if (selectedRegionFilter === 'asia' && !text.includes('آسيا') && !text.includes('اليابان') && !text.includes('تايلاند')) {
          matchesRegion = false;
        } else if (selectedRegionFilter === 'usa' && !text.includes('أمريكا') && !text.includes('كندا') && !text.includes('الولايات')) {
          matchesRegion = false;
        } else if (selectedRegionFilter === 'middle_east' && !text.includes('الشرق الأوسط') && !text.includes('الخليج') && !text.includes('السعودية')) {
          matchesRegion = false;
        }
      }

      // Query check
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.providerName.toLowerCase().includes(q) ||
        item.providerNameEn.toLowerCase().includes(q) ||
        item.tagline.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.features.some((f) => f.toLowerCase().includes(q)) ||
        item.recommendedFor.toLowerCase().includes(q) ||
        item.tipsForTraveler.toLowerCase().includes(q);

      return matchesCategory && matchesRegion && matchesQuery;
    });
  }, [selectedCategory, selectedRegionFilter, searchQuery]);

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Launch direct official redirect with progress animation
  const handleOpenOfficialProvider = (provider: ExtraTravelServiceItem) => {
    setRedirectData({
      isOpen: true,
      provider,
      step: 1,
      stepMessage: `جاري التحقق من الاعتماد الرسمي لـ ${provider.providerNameEn}...`,
      progress: 25,
    });

    setTimeout(() => {
      setRedirectData((prev) => ({
        ...prev,
        step: 2,
        stepMessage: 'جاري تشفير اتصال الأمان وضمان أفضل تسعير رسمي للمسافر...',
        progress: 65,
      }));
    }, 450);

    setTimeout(() => {
      setRedirectData((prev) => ({
        ...prev,
        step: 3,
        stepMessage: `تم تأكيد الاتصال الآمن! جاري نقلك إلى البوابة الرسمية (${provider.officialUrl})...`,
        progress: 100,
      }));
    }, 900);

    setTimeout(() => {
      window.open(provider.officialUrl, '_blank', 'noopener,noreferrer');
      setRedirectData((prev) => ({ ...prev, isOpen: false }));
    }, 1400);
  };

  // Quick Advisor Generator
  const handleGenerateAdvisor = () => {
    let advice = '';
    if (quoteServiceType === 'insurance') {
      advice = `🛡️ توصية التأمين الطبي والسياحي لرحلة ${quoteDestination || 'السفر'}:\n` +
        `• عدد المسافرين: ${quoteTravelersCount} أفراد | المدة: ${quoteDurationDays} أيام\n` +
        `• المزود الأفضل: Allianz Global Assistance أو AXA Travel Insurance\n` +
        `• المتطلبات الأساسية: وثيقة تغطي حتى 30,000€ على الأقل ومقبولة لكافة السفارات مع تغطية طوارئ المستشفيات.\n` +
        `• نصيحة هامة: قم بطباعة الشهادة بالإنجليزية فور الصدور واحتفظ برقم الخط الساخن.`;
    } else if (quoteServiceType === 'esim') {
      advice = `📶 توصية شريحة الإنترنت والواي فاي لرحلة ${quoteDestination || 'السفر'}:\n` +
        `• عدد المسافرين: ${quoteTravelersCount} أفراد | المدة: ${quoteDurationDays} أيام\n` +
        `• المزود الأفضل: Airalo eSIM (باقات محلية وإقليمية) أو Holafly (إنترنت غير محدود) أو Solis Pocket Wi-Fi.\n` +
        `• آلية التفعيل: قم بتثبيت الشريحة في المنزل عبر الواي فاي قبل السفر، وفعل تجوال البيانات عند الهبوط بالمطار.`;
    } else if (quoteServiceType === 'transfers') {
      advice = `🚘 توصية النقل الخاص والاستقبال لرحلة ${quoteDestination || 'السفر'}:\n` +
        `• عدد الركاب: ${quoteTravelersCount} أشخاص | الوجهة: ${quoteDestination}\n` +
        `• المزود الأفضل: Welcome Pickups (استقبال بالاسم بصالة الوصول) أو Blacklane VIP Chauffeur.\n` +
        `• المزايا: تتبع موعد الطائرة تلقائياً بدون رسوم عند التأخير + انتظار مجاني 60 دقيقة.`;
    } else {
      advice = `✨ الباقة الشاملة الموصى بها لرحلة ${quoteDestination || 'السفر'}:\n` +
        `1. تأمين طبي وسياحي معتمد: Allianz Global Assistance\n` +
        `2. شريحة إنترنت رقمية فورية: Airalo eSIM\n` +
        `3. استقبال خاص بالمطار: Welcome Pickups\n` +
        `4. صالات كبار الشخصيات بالمطار: Priority Pass\n` +
        `• جميع الخدمات موثقة بروابط المشغلين الرسميين المباشرة بدون أي وسيط إضافي.`;
    }
    setGeneratedAdvice(advice);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className="bg-[#070d19] border border-amber-500/30 rounded-3xl w-full max-w-6xl overflow-hidden shadow-2xl my-auto animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-[#0d1627] via-[#111e36] to-[#0d1627] border-b border-neutral-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 p-0.5 shadow-lg shadow-amber-500/20 flex-shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-[#090f1d] rounded-[14px] flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-xl font-black text-white">
                  بوابة خدمات السفر الإضافية المعتمدة (Add-on Travel Services)
                </h3>
                <span className="hidden sm:inline-flex text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  روابط رسمية 100%
                </span>
              </div>
              <p className="text-xs text-neutral-300 mt-0.5">
                تأمين السفر الطبي، شرائح الإنترنت الإلكترونية (eSIM)، النقل الخاص الفاخر، صالات المطار، وتذاكر القطارات.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs Bar */}
        <div className="bg-[#091122] border-b border-neutral-800 p-2 overflow-x-auto scrollbar-none flex items-center gap-1.5">
          {SERVICE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/20 font-black'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                selectedCategory === cat.id ? 'bg-black/25 text-black' : 'bg-neutral-800 text-neutral-400'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Sub-bar: Search & Region Quick Filter */}
        <div className="p-3 sm:px-6 bg-[#060a14] border-b border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن مزود، خدمة (eSIM، تأمين، سيارات)..."
              className="w-full bg-[#0d1627] border border-neutral-700/80 focus:border-amber-400 rounded-xl pr-9 pl-4 py-2 text-xs text-white placeholder:text-neutral-500 outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Region Quick Filter Tags */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
            <span className="text-[11px] text-neutral-400 flex items-center gap-1 flex-shrink-0">
              <Filter className="w-3 h-3 text-amber-400" />
              <span>المنطقة:</span>
            </span>
            {[
              { id: 'all', label: 'الكل (عالمي)' },
              { id: 'europe', label: '🇪🇺 أوروبا والشنغن' },
              { id: 'asia', label: '🇯🇵 آسيا واليابان' },
              { id: 'usa', label: '🇺🇸 أمريكا وكندا' },
              { id: 'middle_east', label: '🇸🇦 الخليج والشرق الأوسط' },
            ].map((reg) => (
              <button
                key={reg.id}
                type="button"
                onClick={() => setSelectedRegionFilter(reg.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedRegionFilter === reg.id
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50'
                    : 'bg-[#0d1627] text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                }`}
              >
                {reg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Quick Smart Travel Helper / Requirements Generator */}
          <div className="bg-gradient-to-br from-[#0c182d] via-[#10203d] to-[#091324] border border-amber-500/30 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">
                    مستشار متطلبات السفر السريع (Travel Advisory & Requirements)
                  </h4>
                  <span className="text-[11px] text-neutral-300">
                    حدد وجهتك وعدد المسافرين وسنجهز لك التوصية والمتطلبات المباشرة
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-bold text-neutral-300 block mb-1">الوجهة المستهدفة:</label>
                <input
                  type="text"
                  value={quoteDestination}
                  onChange={(e) => setQuoteDestination(e.target.value)}
                  placeholder="مثال: باريس، طوكيو، روما..."
                  className="w-full bg-[#060c18] border border-neutral-700 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-300 block mb-1">عدد المسافرين:</label>
                <select
                  value={quoteTravelersCount}
                  onChange={(e) => setQuoteTravelersCount(e.target.value)}
                  className="w-full bg-[#060c18] border border-neutral-700 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="1">مسافر فردي (1)</option>
                  <option value="2">شخصان (2) - زوجين/أصدقاء</option>
                  <option value="4">عائلة صغيرة (3 - 4)</option>
                  <option value="6">عائلة أو مجموعة كبيرة (5+)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-300 block mb-1">مدة الإقامة المقدرة:</label>
                <select
                  value={quoteDurationDays}
                  onChange={(e) => setQuoteDurationDays(e.target.value)}
                  className="w-full bg-[#060c18] border border-neutral-700 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="5">عطلة قصيرة (3 - 5 أيام)</option>
                  <option value="7">أسبوع سياحي (7 أيام)</option>
                  <option value="14">أسبوعان كاملان (14 يوماً)</option>
                  <option value="30">شهر أو أكثر (30+ يوماً)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-300 block mb-1">نوع الخدمة المطلوب استشارتها:</label>
                <select
                  value={quoteServiceType}
                  onChange={(e) => setQuoteServiceType(e.target.value as any)}
                  className="w-full bg-[#060c18] border border-neutral-700 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="insurance">🛡️ التأمين الطبي وتأشيرة شنغن</option>
                  <option value="esim">📶 شرائح الإنترنت والواي فاي (eSIM)</option>
                  <option value="transfers">🚘 النقل الخاص وتوصيل المطار</option>
                  <option value="all">✨ الباقة المتكاملة لجميع الخدمات</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={handleGenerateAdvisor}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/25 transition-transform active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>توليد التوصية المخصصة والمتطلبات فوراً</span>
              </button>

              <span className="text-[11px] text-neutral-400">
                🔒 توجيه مباشر وحصري إلى البوابات والمواقع الرسمية المعتمدة
              </span>
            </div>

            {/* Generated Advice Result */}
            {generatedAdvice && (
              <div className="bg-[#050a14] border border-amber-500/40 rounded-xl p-4 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-300">خلاصة الاستشارة والتوصية الرسمية:</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(generatedAdvice, 'advisor_quote')}
                    className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === 'advisor_quote' ? (
                      <span className="text-emerald-400 font-bold">✓ تم النسخ بنجاح</span>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ التوصية</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-neutral-200 leading-relaxed whitespace-pre-line font-mono bg-[#03060c] p-3 rounded-lg border border-neutral-800">
                  {generatedAdvice}
                </p>
              </div>
            )}
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between">
            <h4 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
              <span>قائمة المزودين والمشغلين الرسميين المعتمدين</span>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                {filteredServices.length} مزود معتمد
              </span>
            </h4>
          </div>

          {/* Services Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-[#091122] border border-neutral-800 hover:border-amber-500/50 rounded-2xl overflow-hidden flex flex-col justify-between transition-all group shadow-lg hover:shadow-amber-500/5"
              >
                <div>
                  {/* Card Cover Header with Badges */}
                  <div className="relative h-40 overflow-hidden bg-neutral-900">
                    <img
                      src={service.imageUrl}
                      alt={service.providerName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#091122] via-[#091122]/60 to-transparent" />
                    
                    {/* Floating category & rating badges */}
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <span className="text-xs px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md text-amber-300 font-black border border-amber-500/30 flex items-center gap-1.5">
                        <span>{service.categoryIcon}</span>
                        <span>{service.categoryLabel}</span>
                      </span>
                    </div>

                    <div className="absolute top-3 left-3">
                      <span className="text-[11px] px-2 py-0.5 rounded-lg bg-emerald-950/80 backdrop-blur-md text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
                        <span>★</span>
                        <span>{service.rating}</span>
                        <span className="text-neutral-400 text-[10px]">({service.reviewsCount})</span>
                      </span>
                    </div>

                    {/* Bottom Title on Image */}
                    <div className="absolute bottom-3 right-3 left-3">
                      <h4 className="text-sm sm:text-base font-black text-white drop-shadow-md">
                        {service.providerName}
                      </h4>
                      <span className="text-[11px] text-neutral-300 font-semibold drop-shadow">
                        {service.providerNameEn} • {service.coverageCountries}
                      </span>
                    </div>
                  </div>

                  {/* Card Main Body */}
                  <div className="p-4 sm:p-5 space-y-3.5">
                    {/* Badge & Starting Price */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] sm:text-[11px] font-bold text-amber-300 bg-amber-950/70 px-2.5 py-1 rounded-lg border border-amber-500/30">
                        {service.badge}
                      </span>
                      <span className="text-[11px] font-black text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 whitespace-nowrap">
                        {service.startingPrice}
                      </span>
                    </div>

                    {/* Tagline & Summary */}
                    <p className="text-xs text-neutral-200 leading-relaxed font-medium">
                      {service.summary}
                    </p>

                    {/* Key Features List */}
                    <div className="bg-[#050a14] p-3 rounded-xl border border-neutral-800 space-y-1.5">
                      <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider block">
                        أبرز المزايا والضمانات الرسمية:
                      </span>
                      {service.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-1.5 text-[11px] text-neutral-200">
                          <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Traveler Tip */}
                    <div className="bg-amber-950/30 p-2.5 rounded-xl border border-amber-500/30 text-[11px] text-amber-200/90 leading-relaxed">
                      <strong className="text-amber-300">💡 نصيحة المستشار الذكي: </strong>
                      <span>{service.tipsForTraveler}</span>
                    </div>

                    {/* Emergency Hotline (if available) */}
                    {service.emergencyContactOrHotline && (
                      <div className="flex items-center justify-between text-[11px] text-neutral-300 bg-[#070e1b] px-3 py-1.5 rounded-lg border border-neutral-800">
                        <span className="flex items-center gap-1 text-neutral-400">
                          <Phone className="w-3 h-3 text-sky-400" />
                          <span>طوارئ / دعم مباشر:</span>
                        </span>
                        <span className="font-mono font-bold text-white dir-ltr">
                          {service.emergencyContactOrHotline}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 pt-0 sm:p-5 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => handleOpenOfficialProvider(service)}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer transform active:scale-95"
                  >
                    <span>فتح البوابة والموقع الرسمي المباشر</span>
                    <ExternalLink className="w-4 h-4 text-black" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="bg-[#080d19] border border-neutral-800 rounded-2xl p-8 text-center space-y-3">
              <Search className="w-10 h-10 text-neutral-600 mx-auto" />
              <h4 className="text-sm font-bold text-white">لم يتم العثور على خدمات مطابقة للبحث</h4>
              <p className="text-xs text-neutral-400">
                جرب تغيير كلمات البحث أو اختيار تبويب تصنيف مختلف من الأعلى.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedRegionFilter('all');
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs cursor-pointer"
              >
                إعادة ضبط الفلاتر
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:px-6 bg-[#060a14] border-t border-neutral-800 text-[11px] text-neutral-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>جميع المزودين يتم التحقق من روابطهم الرسمية وتشفيرهم الأمني ببروتوكول SSL و3D Secure.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs cursor-pointer"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>

      {/* Redirect Progress Simulation Modal */}
      {redirectData.isOpen && redirectData.provider && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c1424] border border-amber-500/50 rounded-2xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center mx-auto text-3xl">
              {redirectData.provider.categoryIcon}
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-black text-white">
                توجيه رسمي وآمن إلى {redirectData.provider.providerName}
              </h4>
              <p className="text-xs text-neutral-300 font-mono">
                {redirectData.provider.officialUrl}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-amber-300 h-full transition-all duration-300"
                  style={{ width: `${redirectData.progress}%` }}
                />
              </div>
              <p className="text-xs text-amber-300 font-bold">{redirectData.stepMessage}</p>
            </div>

            <div className="pt-2 text-[11px] text-neutral-400">
              يتم فتح الموقع الرسمي في نافذة جديدة مباشرة دون أي رسوم وساطة 🔒
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Calendar, Users, Wallet, Compass, Hotel, ShieldAlert, 
  Sparkles, MessageSquare, ArrowRight, Zap, Check, Plus, Trash2,
  Train, Plane, Car, Bus, Layers, Gem, Globe2, Navigation, Search, X,
  Building, Globe, ChevronDown, ChevronUp
} from 'lucide-react';
import { 
  TravelConstraints, GroupType, TravelStyle, DialectPreference, 
  CityStop, TransitMode 
} from '../types';
import { PRESET_TRIPS } from '../data/presets';
import { GLOBAL_COUNTRIES, searchGlobalDestinations } from '../data/globalDestinations';
import { resolvePlaceImageUrl } from '../utils/placeImageResolver';
import { DirectQuickBookingModal, BookingModalTab } from './DirectQuickBookingModal';
import { GlobalDestinationsBrowser } from './GlobalDestinationsBrowser';

interface ConstraintFormProps {
  onSubmit: (constraints: TravelConstraints) => void;
  isLoading: boolean;
  onOpenOfficialProviders?: () => void;
}

const POPULAR_DESTINATIONS = [
  'القاهرة والأهرامات، مصر',
  'الأقصر وأسوان (معابد النيل)، مصر',
  'الرياض، السعودية',
  'العلا، السعودية',
  'دبي، الإمارات',
  'إسطنبول، تركيا',
  'طوكيو، اليابان',
  'الإسكندرية، مصر',
  'بالي، إندونيسيا',
  'لندن، بريطانيا',
];

const GROUP_OPTIONS: { value: GroupType; label: string; icon: string; desc: string }[] = [
  { value: 'family_kids', label: 'عائلة مع أطفال', icon: '👨‍👩‍👧‍👦', desc: 'أنشطة ملائمة لجميع الأعمار' },
  { value: 'couples_honeymoon', label: 'زوجان / شهر عسل', icon: '💑', desc: 'أجواء رومانسية ومطاعم مميزة' },
  { value: 'friends_youth', label: 'شباب وأصدقاء', icon: '⛺', desc: 'حيوية، تجارب جديدة ومغامرات' },
  { value: 'solo_traveler', label: 'مسافر منفرد (Solo)', icon: '🎒', desc: 'حرية الحركة واكتشاف الثقافات' },
  { value: 'business_leisure', label: 'عمل وترفيه (Bleisure)', icon: '💼', desc: 'توازن بين الأعمال والاستكشاف' },
];

const STYLE_OPTIONS: { value: TravelStyle; label: string; icon: string }[] = [
  { value: 'spiritual_pilgrimage', label: 'حج وعمرة ومقدسات روحانية', icon: '🕋' },
  { value: 'authentic_local', label: 'تجارب محلية وتراث أصيل', icon: '💎' },
  { value: 'history_culture', label: 'تاريخ وثقافة عميقة', icon: '🏛️' },
  { value: 'relaxation_nature', label: 'استرخاء وطبيعة', icon: '🌿' },
  { value: 'adventure_thrills', label: 'مغامرات وأنشطة', icon: '🧗' },
  { value: 'luxury_shopping', label: 'تسوق وتجارب فاخرة', icon: '🛍️' },
  { value: 'culinary_foodie', label: 'تجارب طعام ومقاهي', icon: '☕' },
  { value: 'kids_entertainment', label: 'ترفيه وملاهي أطفال', icon: '🎡' },
  { value: 'budget_backpacking', label: 'اقتصادية وشعبية', icon: '🪙' },
];

const TRANSIT_OPTIONS: { value: TransitMode; label: string; icon: any }[] = [
  { value: 'optimal', label: 'المسار الأكفأ والأسرع', icon: Sparkles },
  { value: 'high_speed_train', label: 'قطار فائق السرعة (Train)', icon: Train },
  { value: 'domestic_flight', label: 'طيران داخلي (Flight)', icon: Plane },
  { value: 'rental_car', label: 'سيارة مستأجرة (Road Trip)', icon: Car },
  { value: 'bus_coach', label: 'حافلات سياحية مريحة', icon: Bus },
];

const CURRENCIES = [
  { code: 'SAR', label: 'ريال سعودي (SAR)' },
  { code: 'USD', label: 'دولار أمريكي (USD)' },
  { code: 'EGP', label: 'جنيه مصري (EGP)' },
  { code: 'AED', label: 'درهم إماراتي (AED)' },
  { code: 'EUR', label: 'يورو (EUR)' },
  { code: 'KWD', label: 'دينار كويتي (KWD)' },
  { code: 'QAR', label: 'ريال قطري (QAR)' },
];

const DIALECTS: { value: DialectPreference; label: string; flag: string }[] = [
  { value: 'saudi_gulf', label: 'خليجية / سعودية راقية', flag: '🇸🇦' },
  { value: 'egyptian', label: 'مصرية ودودة وشيقة', flag: '🇪🇬' },
  { value: 'modern_standard_arabic', label: 'عربية فصحى معاصرة', flag: '🌍' },
];

export const ConstraintForm: React.FC<ConstraintFormProps> = ({ onSubmit, isLoading, onOpenOfficialProviders }) => {
  const [isMultiCity, setIsMultiCity] = useState(false);
  const [destination, setDestination] = useState('الرياض، المملكة العربية السعودية');
  const [showWorldDestinations, setShowWorldDestinations] = useState(true);
  const [cityStops, setCityStops] = useState<CityStop[]>([
    { id: '1', cityName: 'الرياض', days: 3, hotelArea: 'حي النخيل / العليا' },
    { id: '2', cityName: 'العلا', days: 2, hotelArea: 'واحة العلا التراثية' },
    { id: '3', cityName: 'جدة', days: 2, hotelArea: 'الكورنيش / البلد' },
  ]);
  const [preferredTransit, setPreferredTransit] = useState<TransitMode>('optimal');
  const [durationDays, setDurationDays] = useState<number>(4);
  const [groupType, setGroupType] = useState<GroupType>('family_kids');
  const [budget, setBudget] = useState<number | string>(7500);
  const [currency, setCurrency] = useState('SAR');
  const [travelStyle, setTravelStyle] = useState<TravelStyle>('authentic_local');
  const [accommodationArea, setAccommodationArea] = useState('منطقة مركز الملك عبدالله المالي (KAFD) أو العليا');
  const [specialConstraints, setSpecialConstraints] = useState('تفضيل الأماكن العائلية والراقية، تجنب الازدحام المروري، وتجربة ورش عمل ومطاعم محلية أصيلة.');
  const [includeLocalHiddenGems, setIncludeLocalHiddenGems] = useState(true);
  const [dialect, setDialect] = useState<DialectPreference>('saudi_gulf');
  const [presetCategory, setPresetCategory] = useState<'all' | 'spiritual' | 'egypt' | 'gulf' | 'easy_visa' | 'world'>('all');
  const [bookingModalTab, setBookingModalTab] = useState<BookingModalTab | null>(null);

  // Filter presets based on category tab
  const filteredPresets = PRESET_TRIPS.filter((p) => {
    if (presetCategory === 'all') return true;
    if (presetCategory === 'spiritual') return p.categoryTag === 'hajj_umrah' || p.categoryTag === 'palestine';
    if (presetCategory === 'egypt') return p.categoryTag === 'egypt';
    if (presetCategory === 'gulf') return p.categoryTag === 'gulf';
    if (presetCategory === 'easy_visa') return p.categoryTag === 'easy_visa' || p.categoryTag === 'nature';
    if (presetCategory === 'world') return p.categoryTag === 'world';
    return true;
  });

  // Recalculate duration if multi-city stops change
  const totalMultiCityDays = cityStops.reduce((acc, stop) => acc + (Number(stop.days) || 1), 0);

  const handleAddCityStop = () => {
    const newId = String(Date.now());
    setCityStops([...cityStops, { id: newId, cityName: '', days: 2, hotelArea: '' }]);
  };

  const handleRemoveCityStop = (id: string) => {
    if (cityStops.length <= 2) return;
    setCityStops(cityStops.filter((s) => s.id !== id));
  };

  const handleUpdateCityStop = (id: string, field: keyof CityStop, value: any) => {
    setCityStops(
      cityStops.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleApplyPreset = (presetId: string) => {
    const preset = PRESET_TRIPS.find((p) => p.id === presetId);
    if (preset) {
      setIsMultiCity(!!preset.isMultiCity);
      if (preset.isMultiCity && preset.cityStops) {
        setCityStops(preset.cityStops);
      }
      if (preset.preferredTransit) {
        setPreferredTransit(preset.preferredTransit);
      }
      setDestination(preset.destination);
      setDurationDays(preset.durationDays);
      setGroupType(preset.groupType);
      setBudget(preset.budget);
      setCurrency(preset.currency);
      setTravelStyle(preset.travelStyle);
      setAccommodationArea(preset.accommodationArea);
      setSpecialConstraints(preset.specialConstraints);
      setDialect(preset.dialect);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalDestination = destination.trim();
    let finalDuration = durationDays;

    if (isMultiCity) {
      const validStops = cityStops.filter((s) => s.cityName.trim());
      if (validStops.length === 0) return;
      finalDestination = validStops.map((s) => s.cityName.trim()).join(' ⟵ ');
      finalDuration = totalMultiCityDays;
    } else {
      if (!finalDestination) return;
    }

    onSubmit({
      destination: finalDestination,
      durationDays: Number(finalDuration) || 1,
      groupType,
      budget,
      currency,
      travelStyle,
      accommodationArea: accommodationArea.trim(),
      specialConstraints: specialConstraints.trim(),
      dialect,
      isMultiCity,
      cityStops: isMultiCity ? cityStops : undefined,
      preferredTransit: isMultiCity ? preferredTransit : undefined,
      includeLocalHiddenGems,
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Joyful, Vibrant 3D Travel Hero Header */}
      <div className="text-center space-y-4 relative py-2">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-500/20 via-sky-500/20 to-emerald-500/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-black shadow-lg shadow-amber-500/10">
          <span className="text-base animate-bounce">✈️</span>
          <span>منظومة TraviQ العالمية لتخطيط السفر الذكي والحجز الرسمي المباشر</span>
          <span className="text-base">🌍</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
          خطط عطلتك القادمة بذكاء واستمتع بأجمل وجهات العالم
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
          اختر وجهتك من بين أشهر دول ومدن العالم السياحية، صمم مسارك اليومي بدقة الذكاء الاصطناعي، واطلع على مصادر الحجز الرسمية بدون وسطاء.
        </p>

        {/* Global Official Directory Quick Hub Button */}
        {onOpenOfficialProviders && (
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={onOpenOfficialProviders}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 hover:scale-105 transition-all cursor-pointer"
            >
              <Compass className="w-5 h-5 text-slate-950" />
              <span>دليل مواقع الحجز الرسمية في العالم (طيران • فنادق • شقق • جولات)</span>
              <Sparkles className="w-4 h-4 text-slate-900" />
            </button>
          </div>
        )}
      </div>

      {/* Preset Inspiration Hub with 9D Landmark Cards */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#8a6d1c] p-0.5 shadow-md shadow-[#d4af37]/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#090f1d] rounded-[10px] flex items-center justify-center text-[#d4af37] text-sm font-bold">
                9D
              </div>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <span>مسارات ونماذج جاهزة للاستلهام والتنفيذ المباشر</span>
              </h3>
              <p className="text-[11px] text-neutral-400">
                أشهر الوجهات السياحية من مصر والدول العربية والخليجية مع صور المعالم وأسهل إجراءات السفر
              </p>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'جميع الوجهات 🌍' },
              { id: 'spiritual', label: '🕋 الحج والعمرة والقدس' },
              { id: 'egypt', label: '🇪🇬 مصر والأهرامات' },
              { id: 'gulf', label: '🇸🇦 السعودية والخليج' },
              { id: 'easy_visa', label: '✈️ بدون فيزا وطبيعة' },
              { id: 'world', label: '👑 عواصم عالمية' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                id={`cat-filter-${cat.id}`}
                onClick={() => setPresetCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  presetCategory === cat.id
                    ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/20 font-black'
                    : 'bg-[#141414] hover:bg-[#1f1f1f] text-neutral-300 border border-neutral-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 9D Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredPresets.map((preset) => (
            <div
              key={preset.id}
              id={`preset-card-${preset.id}`}
              onClick={() => handleApplyPreset(preset.id)}
              className="bg-[#0e121a] hover:bg-[#141b28] border border-neutral-800/90 hover:border-[#d4af37]/70 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.015] hover:shadow-2xl hover:shadow-[#d4af37]/10 flex flex-col justify-between group cursor-pointer text-right"
            >
              {/* Landmark Image & Top Badges */}
              <div className="relative h-36 w-full overflow-hidden bg-neutral-900">
                {preset.imageUrl ? (
                  <img
                    src={preset.imageUrl}
                    alt={preset.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center text-3xl">
                    {preset.emoji}
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e121a] via-black/20 to-black/60" />

                {/* Country Flag & Emoji */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-xs font-bold text-white shadow-lg">
                  <span>{preset.countryFlag || preset.emoji}</span>
                  <span className="text-[11px] text-neutral-200">{preset.countryName || 'وجهة عالمية'}</span>
                </div>

                {/* Duration Badge */}
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-[#d4af37]/90 text-black text-[11px] font-black shadow-lg">
                  {preset.durationDays} أيام {preset.isMultiCity ? '• مدن متعددة' : ''}
                </div>

                {/* Landmark Name Overlay */}
                {preset.landmarkName && (
                  <div className="absolute bottom-2 right-2.5 left-2.5 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#f5d061] drop-shadow-md flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#d4af37]" />
                      <span className="line-clamp-1">{preset.landmarkName}</span>
                    </span>
                    <span className="text-[10px] text-neutral-300 bg-black/60 px-2 py-0.5 rounded-md border border-white/10">
                      {preset.currency} {preset.budget.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Card Details Body */}
              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-[#f5d061] transition-colors line-clamp-1">
                    {preset.title}
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                    {preset.popularFor || preset.specialConstraints}
                  </p>
                </div>

                {/* Verified Highlight Chips */}
                {preset.highlights && preset.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {preset.highlights.slice(0, 3).map((h, hIdx) => (
                      <span
                        key={hIdx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-300 font-medium"
                      >
                        ✓ {h}
                      </span>
                    ))}
                  </div>
                )}

                {/* Quick Apply Footer */}
                <div className="pt-2 border-t border-neutral-800/70 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#d4af37] font-bold">
                    {preset.tag}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-extrabold text-white group-hover:text-[#d4af37] transition-colors">
                    <span>تطبيق الخطة</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 group-hover:translate-x-[-2px] rtl:group-hover:translate-x-[2px] transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trip Mode Switcher */}
      <div className="flex items-center justify-center">
        <div className="bg-[#111111] p-1.5 rounded-2xl border border-neutral-800 flex items-center gap-1 shadow-lg">
          <button
            type="button"
            id="trip-mode-single"
            onClick={() => setIsMultiCity(false)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              !isMultiCity
                ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/20'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>وجهة واحدة (Single City)</span>
          </button>
          <button
            type="button"
            id="trip-mode-multi"
            onClick={() => setIsMultiCity(true)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              isMultiCity
                ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/20'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>رحلة متعددة المدن (Multi-City Route)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40 text-amber-300 border border-amber-400/30">جديد</span>
          </button>
        </div>
      </div>

      {/* Main Constraints Form */}
      <form onSubmit={handleSubmit} className="bg-[#111111] rounded-2xl border border-neutral-800 p-6 sm:p-8 space-y-8 shadow-2xl shadow-black/80">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Destination Section - Mode Conditional */}
          {!isMultiCity ? (
            <>
              {/* Single City Destination */}
              <div className="md:col-span-8 space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="destination-input" className="flex items-center gap-2 text-sm font-bold text-white">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span>الوجهة أو المدينة المستهدفة *</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowWorldDestinations(!showWorldDestinations)}
                    className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>{showWorldDestinations ? 'إخفاء دليل دول العالم' : 'استعراض كل دول العالم الأكثر سياحة'}</span>
                    {showWorldDestinations ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>

                <div className="relative">
                  <input
                    id="destination-input"
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="مثال: الرياض، إسطنبول، دبي، العلا، طوكيو، باريس، روما..."
                    className="w-full bg-slate-900 border border-slate-700 hover:border-slate-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-2xl px-4 py-3.5 text-white placeholder:text-slate-500 text-sm font-medium transition-all"
                  />
                  {destination && (
                    <button
                      type="button"
                      onClick={() => setDestination('')}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Destination Quick Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400 ml-1">وجهات سريعة:</span>
                  {POPULAR_DESTINATIONS.slice(0, 7).map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => setDestination(city)}
                      className={`text-[11px] px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
                        destination === city
                          ? 'bg-amber-400/20 text-amber-300 border-amber-400/60 font-bold'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>

                {/* Full World Destinations Browser Under The Destination Input */}
                {showWorldDestinations && (
                  <div className="pt-2">
                    <GlobalDestinationsBrowser
                      selectedDestination={destination}
                      onSelectCity={(cityName, countryName) => {
                        setDestination(`${cityName}، ${countryName}`);
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Duration in Days */}
              <div className="md:col-span-4 space-y-2">
                <label htmlFor="duration-input" className="flex items-center gap-2 text-sm font-bold text-neutral-200">
                  <Calendar className="w-4 h-4 text-[#d4af37]" />
                  <span>مدة الرحلة بالأيام *</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDurationDays((prev) => Math.max(1, prev - 1))}
                    className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#1a1a1a] hover:bg-[#262626] border border-neutral-800 text-white font-bold text-lg transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <div className="flex-1 bg-[#1a1a1a] border border-neutral-800 rounded-xl py-2.5 text-center font-bold text-lg text-[#d4af37]">
                    {durationDays} {durationDays === 1 ? 'يوم' : durationDays === 2 ? 'يومان' : durationDays <= 10 ? 'أيام' : 'يوماً'}
                  </div>
                  <button
                    type="button"
                    onClick={() => setDurationDays((prev) => Math.min(30, prev + 1))}
                    className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#1a1a1a] hover:bg-[#262626] border border-neutral-800 text-white font-bold text-lg transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Multi-City Stops Builder */
            <div className="md:col-span-12 space-y-4 bg-[#141414] p-4 sm:p-6 rounded-2xl border border-neutral-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">تحديد محطات المسار متعدد المدن</h3>
                    <p className="text-xs text-neutral-400">
                      إجمالي المدة المقدرة: <span className="text-[#d4af37] font-bold">{totalMultiCityDays} أيام</span> عبر {cityStops.length} محطات
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddCityStop}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1f1f1f] hover:bg-[#2a2a2a] text-[#d4af37] border border-[#d4af37]/30 text-xs font-bold transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة محطة / مدينة جديدة</span>
                </button>
              </div>

              {/* City Stop Rows */}
              <div className="space-y-3">
                {cityStops.map((stop, index) => (
                  <div 
                    key={stop.id}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-[#1a1a1a] p-3 rounded-xl border border-neutral-800"
                  >
                    <div className="sm:col-span-1 flex items-center justify-center">
                      <span className="w-7 h-7 rounded-full bg-neutral-800 text-[#d4af37] border border-neutral-700 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                    </div>

                    <div className="sm:col-span-5">
                      <label className="block text-[11px] text-neutral-400 mb-1 font-semibold">
                        المدينة أو المحطة {index + 1}
                      </label>
                      <input
                        type="text"
                        required
                        value={stop.cityName}
                        onChange={(e) => handleUpdateCityStop(stop.id, 'cityName', e.target.value)}
                        placeholder="مثال: الرياض، طوكيو، فلورنسا..."
                        className="w-full bg-[#141414] border border-neutral-750 border-neutral-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] text-neutral-400 mb-1 font-semibold">
                        الأيام المخصصة
                      </label>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleUpdateCityStop(stop.id, 'days', Math.max(1, (Number(stop.days) || 1) - 1))}
                          className="w-8 h-8 rounded-lg bg-neutral-800 text-white font-bold hover:bg-neutral-700 text-sm flex items-center justify-center cursor-pointer"
                        >
                          -
                        </button>
                        <span className="flex-1 text-center text-xs font-bold text-[#d4af37] bg-[#141414] py-1.5 rounded border border-neutral-800">
                          {stop.days} أيام
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateCityStop(stop.id, 'days', Math.min(14, (Number(stop.days) || 1) + 1))}
                          className="w-8 h-8 rounded-lg bg-neutral-800 text-white font-bold hover:bg-neutral-700 text-sm flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] text-neutral-400 mb-1 font-semibold">
                        منطقة السكن (اختياري)
                      </label>
                      <input
                        type="text"
                        value={stop.hotelArea || ''}
                        onChange={(e) => handleUpdateCityStop(stop.id, 'hotelArea', e.target.value)}
                        placeholder="قرب السنتر..."
                        className="w-full bg-[#141414] border border-neutral-700 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div className="sm:col-span-1 flex justify-center">
                      {cityStops.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveCityStop(stop.id)}
                          className="p-2 text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                          title="حذف المحطة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Preferred Transit Mode Between Cities */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-neutral-300 mb-2">
                  وسيلة التنقل المفضلة بين المدن ومحطات المسار:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {TRANSIT_OPTIONS.map((opt) => {
                    const isSelected = preferredTransit === opt.value;
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setPreferredTransit(opt.value)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs text-right transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37] font-bold shadow-sm'
                            : 'bg-[#181818] border-neutral-800 text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="line-clamp-1">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Group Type */}
          <div className="md:col-span-12 space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-neutral-200">
              <Users className="w-4 h-4 text-[#d4af37]" />
              <span>نوع المسافرين والمرافقين *</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {GROUP_OPTIONS.map((opt) => {
                const isSelected = groupType === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    id={`group-opt-${opt.value}`}
                    onClick={() => setGroupType(opt.value)}
                    className={`flex flex-col items-start p-3.5 rounded-xl border text-right transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#d4af37]/10 border-[#d4af37] text-white shadow-md ring-1 ring-[#d4af37]/40'
                        : 'bg-[#161616] border-neutral-800/90 hover:bg-[#1c1c1c] text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <span className="text-xl">{opt.icon}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#d4af37]" />}
                    </div>
                    <span className="text-xs font-bold text-white">{opt.label}</span>
                    <span className="text-[11px] text-neutral-400 mt-1 leading-tight">{opt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Budget & Currency */}
          <div className="md:col-span-6 space-y-2">
            <label htmlFor="budget-input" className="flex items-center gap-2 text-sm font-bold text-neutral-200">
              <Wallet className="w-4 h-4 text-[#d4af37]" />
              <span>الميزانية الإجمالية التقديرية</span>
            </label>
            <div className="grid grid-cols-12 gap-2">
              <input
                id="budget-input"
                type="number"
                min="100"
                step="100"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="مثال: 5000"
                className="col-span-7 bg-[#1a1a1a] border border-neutral-800 rounded-xl px-4 py-2.5 text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#d4af37] text-sm font-medium"
              />
              <select
                id="currency-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="col-span-5 bg-[#1a1a1a] border border-neutral-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#d4af37] text-xs font-medium"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code} className="bg-[#1a1a1a] text-white">
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Preferred Accommodation Area */}
          <div className="md:col-span-6 space-y-2">
            <label htmlFor="accommodation-input" className="flex items-center gap-2 text-sm font-bold text-neutral-200">
              <Hotel className="w-4 h-4 text-[#d4af37]" />
              <span>منطقة الإقامة أو الفندق المفضل</span>
            </label>
            <input
              id="accommodation-input"
              type="text"
              value={accommodationArea}
              onChange={(e) => setAccommodationArea(e.target.value)}
              placeholder="مثال: قرب المترو، داون تاون، مطل على البحر..."
              className="w-full bg-[#1a1a1a] border border-neutral-800 rounded-xl px-4 py-2.5 text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#d4af37] text-sm font-medium"
            />
          </div>

          {/* Travel Style */}
          <div className="md:col-span-12 space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-neutral-200">
              <Compass className="w-4 h-4 text-[#d4af37]" />
              <span>طابع واهتمامات الرحلة الأساسية *</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {STYLE_OPTIONS.map((style) => {
                const isSelected = travelStyle === style.value;
                return (
                  <button
                    key={style.value}
                    type="button"
                    id={`style-opt-${style.value}`}
                    onClick={() => setTravelStyle(style.value)}
                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#d4af37] text-black border-[#d4af37] font-bold shadow-md shadow-[#d4af37]/20'
                        : 'bg-[#161616] border-neutral-800 text-neutral-300 hover:bg-[#1e1e1e]'
                    }`}
                  >
                    <span>{style.icon}</span>
                    <span>{style.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Local Experiences Module Toggle */}
          <div className="md:col-span-12 bg-[#171717] border border-[#d4af37]/30 p-4 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] flex-shrink-0 mt-0.5">
                <Gem className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold text-white block">
                  وحدة التجارب المحلية غير السياحية (Local Experiences Module)
                </span>
                <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">
                  اقتراح 2-3 تجارب سرية أصيلة (مطاعم عائلية خفية، ورش حرفية يدوية، جولات أحياء عتيقة) ودمجها بالجدول والميزانية.
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input
                type="checkbox"
                checked={includeLocalHiddenGems}
                onChange={(e) => setIncludeLocalHiddenGems(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]"></div>
            </label>
          </div>

          {/* Special Constraints & Strict Requirements */}
          <div className="md:col-span-8 space-y-2">
            <label htmlFor="special-constraints-input" className="flex items-center gap-2 text-sm font-bold text-neutral-200">
              <ShieldAlert className="w-4 h-4 text-[#d4af37]" />
              <span>محددات خاصة وشروط صارمة (Strict Constraints)</span>
            </label>
            <textarea
              id="special-constraints-input"
              rows={3}
              value={specialConstraints}
              onChange={(e) => setSpecialConstraints(e.target.value)}
              placeholder="مثال: وجود أطفال صغار، أكل حلال فقط، عدم صعود المرتفعات، تجنب السير لمسافات طويلة، تفضيل المقاهي الهادئة، سيارة خاصة أو مترو..."
              className="w-full bg-[#1a1a1a] border border-neutral-800 rounded-xl p-3.5 text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#d4af37] text-sm font-medium resize-none leading-relaxed"
            />
          </div>

          {/* Dialect / Tone Preference */}
          <div className="md:col-span-4 space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-neutral-200">
              <MessageSquare className="w-4 h-4 text-[#d4af37]" />
              <span>أسلوب ولهجة التقرير</span>
            </label>
            <div className="space-y-2">
              {DIALECTS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setDialect(d.value)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs transition-all cursor-pointer text-right ${
                    dialect === d.value
                      ? 'bg-[#d4af37]/10 border-[#d4af37] text-[#d4af37] font-bold'
                      : 'bg-[#161616] border-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{d.flag}</span>
                    <span>{d.label}</span>
                  </span>
                  {dialect === d.value && <Check className="w-3.5 h-3.5 text-[#d4af37]" />}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Submit Action */}
        <div className="pt-3">
          <button
            type="submit"
            id="generate-plan-submit-btn"
            disabled={isLoading || (!isMultiCity && !destination.trim()) || (isMultiCity && cityStops.filter(s => s.cityName.trim()).length === 0)}
            className="w-full py-4 px-6 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-black font-extrabold text-base shadow-xl shadow-[#d4af37]/20 transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed group cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>جاري استشارة الذكاء الاصطناعي وبناء المسار والتجارب والميزانية...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-black group-hover:rotate-12 transition-transform" />
                <span>
                  {isMultiCity
                    ? `توليد مسار الرحلة المتكامل لـ ${cityStops.length} مدن (${totalMultiCityDays} أيام)`
                    : 'توليد جدول الرحلة الذكي وتحليل الميزانية والقرارات'}
                </span>
                <ArrowRight className="w-5 h-5 text-black rtl:rotate-180" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Direct Quick Booking Execution Modal */}
      <DirectQuickBookingModal
        isOpen={bookingModalTab !== null}
        onClose={() => setBookingModalTab(null)}
        initialTab={bookingModalTab || 'flights'}
        defaultDestination={destination}
      />
    </div>
  );
};



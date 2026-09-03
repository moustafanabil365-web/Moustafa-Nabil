import React, { useState } from 'react';
import { 
  MapPin, Calendar, Users, Wallet, Compass, Hotel, ShieldAlert, 
  Sparkles, MessageSquare, ArrowRight, Check, Plus, Trash2,
  Train, Plane, Car, Bus, Layers, Gem, Globe, ChevronDown, ChevronUp, X
} from 'lucide-react';
import { 
  TravelConstraints, GroupType, TravelStyle, DialectPreference, 
  CityStop, TransitMode 
} from '../types';
import { PRESET_TRIPS } from '../data/presets';
import { DirectQuickBookingModal, BookingModalTab } from './DirectQuickBookingModal';
import { GlobalDestinationsBrowser } from './GlobalDestinationsBrowser';
import { SupportedLanguage, getTranslation } from '../utils/i18n';

interface ConstraintFormProps {
  onSubmit: (constraints: TravelConstraints) => void;
  isLoading: boolean;
  onOpenOfficialProviders?: () => void;
  currentLanguage?: SupportedLanguage;
}

const POPULAR_DESTINATIONS = [
  'الرياض، السعودية',
  'العلا، السعودية',
  'دبي، الإمارات',
  'القاهرة والأهرامات، مصر',
  'الأقصر وأسوان، مصر',
  'إسطنبول، تركيا',
  'طوكيو، اليابان',
  'لندن، بريطانيا',
  'باريس، فرنسا',
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

export const ConstraintForm: React.FC<ConstraintFormProps> = ({ 
  onSubmit, 
  isLoading, 
  onOpenOfficialProviders,
  currentLanguage = 'ar'
}) => {
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

  const isRtl = currentLanguage === 'ar';

  const groupOptions: { value: GroupType; labelKey: string; icon: string }[] = [
    { value: 'family_kids', labelKey: 'group_family_kids', icon: '👨‍👩‍👧‍👦' },
    { value: 'couples_honeymoon', labelKey: 'group_couples_honeymoon', icon: '💑' },
    { value: 'friends_youth', labelKey: 'group_friends_youth', icon: '⛺' },
    { value: 'solo_traveler', labelKey: 'group_solo_traveler', icon: '🎒' },
    { value: 'business_leisure', labelKey: 'group_business_leisure', icon: '💼' },
  ];

  const styleOptions: { value: TravelStyle; labelKey: string; icon: string }[] = [
    { value: 'spiritual_pilgrimage', labelKey: 'style_spiritual_pilgrimage', icon: '🕋' },
    { value: 'authentic_local', labelKey: 'style_authentic_local', icon: '💎' },
    { value: 'history_culture', labelKey: 'style_history_culture', icon: '🏛️' },
    { value: 'relaxation_nature', labelKey: 'style_relaxation_nature', icon: '🌿' },
    { value: 'adventure_thrills', labelKey: 'style_adventure_thrills', icon: '🧗' },
    { value: 'luxury_shopping', labelKey: 'style_luxury_shopping', icon: '🛍️' },
    { value: 'culinary_foodie', labelKey: 'style_culinary_foodie', icon: '☕' },
    { value: 'kids_entertainment', labelKey: 'style_kids_entertainment', icon: '🎡' },
    { value: 'budget_backpacking', labelKey: 'style_budget_backpacking', icon: '🪙' },
  ];

  const transitOptions: { value: TransitMode; labelKey: string; icon: any }[] = [
    { value: 'optimal', labelKey: 'transit_optimal', icon: Sparkles },
    { value: 'high_speed_train', labelKey: 'transit_high_speed_train', icon: Train },
    { value: 'domestic_flight', labelKey: 'transit_domestic_flight', icon: Plane },
    { value: 'rental_car', labelKey: 'transit_rental_car', icon: Car },
    { value: 'bus_coach', labelKey: 'transit_bus_coach', icon: Bus },
  ];

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
    <div className="w-full max-w-5xl mx-auto space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Preset Inspiration Hub */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-md shadow-amber-400/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#090f1d] rounded-[10px] flex items-center justify-center text-amber-400 text-sm font-bold">
                ✨
              </div>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <span>{getTranslation(currentLanguage, 'quick_presets_title')}</span>
              </h3>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: isRtl ? 'جميع الوجهات 🌍' : 'All Presets 🌍' },
              { id: 'spiritual', label: isRtl ? '🕋 الحج والعمرة والقدس' : '🕋 Pilgrimage' },
              { id: 'egypt', label: isRtl ? '🇪🇬 مصر والأهرامات' : '🇪🇬 Egypt' },
              { id: 'gulf', label: isRtl ? '🇸🇦 السعودية والخليج' : '🇸🇦 Gulf & Saudi' },
              { id: 'easy_visa', label: isRtl ? '✈️ بدون فيزا وطبيعة' : '✈️ Nature & Scenic' },
              { id: 'world', label: isRtl ? '👑 عواصم عالمية' : '👑 Global Capitals' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setPresetCategory(cat.id as any)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  presetCategory === cat.id
                    ? 'bg-amber-400 text-slate-950 border-amber-400 font-black shadow-md'
                    : 'bg-slate-900/90 text-slate-300 hover:text-white border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Horizontal Scrollable Presets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPresets.slice(0, 6).map((preset) => (
            <div
              key={preset.id}
              onClick={() => handleApplyPreset(preset.id)}
              className="bg-[#111624] border border-slate-800 hover:border-amber-400/50 rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 flex flex-col justify-between"
            >
              {/* Image Banner */}
              <div className="relative h-36 w-full overflow-hidden bg-slate-900">
                <img
                  src={preset.imageUrl}
                  alt={preset.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-amber-400/90 text-slate-950 text-[11px] font-black shadow-lg">
                  {preset.durationDays} {isRtl ? 'أيام' : 'Days'} {preset.isMultiCity ? (isRtl ? '• مدن متعددة' : '• Multi-City') : ''}
                </div>

                {preset.landmarkName && (
                  <div className="absolute bottom-2 right-2.5 left-2.5 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-300 drop-shadow-md flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      <span className="line-clamp-1">{preset.landmarkName}</span>
                    </span>
                    <span className="text-[10px] text-slate-300 bg-black/60 px-2 py-0.5 rounded-md border border-white/10">
                      {preset.currency} {preset.budget.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Card Details Body */}
              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                    {preset.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {preset.popularFor || preset.specialConstraints}
                  </p>
                </div>

                {/* Quick Apply Footer */}
                <div className="pt-2 border-t border-slate-800/70 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-amber-400 font-bold">
                    {preset.tag}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-extrabold text-white group-hover:text-amber-400 transition-colors">
                    <span>{isRtl ? 'تطبيق الخطة' : 'Apply Preset'}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trip Mode Switcher */}
      <div className="flex items-center justify-center">
        <div className="bg-slate-900 p-1.5 rounded-2xl border border-slate-800 flex items-center gap-1 shadow-lg">
          <button
            type="button"
            id="trip-mode-single"
            onClick={() => setIsMultiCity(false)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              !isMultiCity
                ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>{getTranslation(currentLanguage, 'single_city_tab')}</span>
          </button>
          <button
            type="button"
            id="trip-mode-multi"
            onClick={() => setIsMultiCity(true)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              isMultiCity
                ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{getTranslation(currentLanguage, 'multi_city_tab')}</span>
          </button>
        </div>
      </div>

      {/* Main Constraints Form */}
      <form onSubmit={handleSubmit} className="bg-slate-950/90 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-8 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Destination Section */}
          {!isMultiCity ? (
            <>
              <div className="md:col-span-8 space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="destination-input" className="flex items-center gap-2 text-sm font-bold text-white">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span>{getTranslation(currentLanguage, 'destination_label')} *</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowWorldDestinations(!showWorldDestinations)}
                    className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>{showWorldDestinations ? getTranslation(currentLanguage, 'hide_destinations_guide') : getTranslation(currentLanguage, 'toggle_destinations_guide')}</span>
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
                    placeholder={getTranslation(currentLanguage, 'destination_placeholder')}
                    className={`w-full bg-slate-900 border border-slate-700/90 hover:border-amber-400/50 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 rounded-2xl px-4 py-3 text-white placeholder:text-slate-500 text-sm font-medium transition-all ${
                      isRtl ? 'pr-4 pl-10' : 'pl-4 pr-10'
                    }`}
                  />
                  {destination && (
                    <button
                      type="button"
                      onClick={() => setDestination('')}
                      className={`absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-white ${isRtl ? 'left-3' : 'right-3'}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Destination Quick Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400 px-1">{isRtl ? 'وجهات سريعة:' : 'Quick Picks:'}</span>
                  {POPULAR_DESTINATIONS.slice(0, 6).map((city) => (
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
              </div>

              {/* Duration in Days */}
              <div className="md:col-span-4 space-y-2">
                <label htmlFor="duration-input" className="flex items-center gap-2 text-sm font-bold text-slate-200">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>{getTranslation(currentLanguage, 'duration_label')} *</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDurationDays((prev) => Math.max(1, prev - 1))}
                    className="w-11 h-11 flex items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold text-lg transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl py-2.5 text-center font-bold text-lg text-amber-400">
                    {durationDays} {isRtl ? (durationDays === 1 ? 'يوم' : durationDays === 2 ? 'يومان' : durationDays <= 10 ? 'أيام' : 'يوماً') : 'Days'}
                  </div>
                  <button
                    type="button"
                    onClick={() => setDurationDays((prev) => Math.min(30, prev + 1))}
                    className="w-11 h-11 flex items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold text-lg transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Full World Destinations Browser Spanning full width (col-span-12) */}
              {showWorldDestinations && (
                <div className="md:col-span-12 pt-1">
                  <GlobalDestinationsBrowser
                    selectedDestination={destination}
                    currentLanguage={currentLanguage}
                    onSelectCity={(cityName, countryName) => {
                      setDestination(`${cityName}، ${countryName}`);
                    }}
                  />
                </div>
              )}
            </>
          ) : (
            /* Multi-City Stops Builder */
            <div className="md:col-span-12 space-y-4 bg-slate-900/90 p-4 sm:p-6 rounded-2xl border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{isRtl ? 'تحديد محطات المسار متعدد المدن' : 'Multi-City Route Stops'}</h3>
                    <p className="text-xs text-slate-400">
                      {isRtl 
                        ? `إجمالي المدة المقدرة: ${totalMultiCityDays} أيام عبر ${cityStops.length} محطات` 
                        : `Total duration: ${totalMultiCityDays} days across ${cityStops.length} stops`}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddCityStop}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/30 text-xs font-bold transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'إضافة محطة / مدينة جديدة' : 'Add City Stop'}</span>
                </button>
              </div>

              {/* City Stop Rows */}
              <div className="space-y-3">
                {cityStops.map((stop, index) => (
                  <div 
                    key={stop.id}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-slate-950 p-3 rounded-xl border border-slate-800"
                  >
                    <div className="sm:col-span-1 flex items-center justify-center">
                      <span className="w-7 h-7 rounded-full bg-slate-900 text-amber-400 border border-slate-700 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                    </div>

                    <div className="sm:col-span-5">
                      <label className="block text-[11px] text-slate-400 mb-1 font-semibold">
                        {isRtl ? `المدينة أو المحطة ${index + 1}` : `City / Stop ${index + 1}`}
                      </label>
                      <input
                        type="text"
                        required
                        value={stop.cityName}
                        onChange={(e) => handleUpdateCityStop(stop.id, 'cityName', e.target.value)}
                        placeholder="e.g. Riyadh, London, Tokyo..."
                        className="w-full bg-slate-900 border border-slate-750 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] text-slate-400 mb-1 font-semibold">
                        {isRtl ? 'الأيام المخصصة' : 'Days'}
                      </label>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleUpdateCityStop(stop.id, 'days', Math.max(1, (Number(stop.days) || 1) - 1))}
                          className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800 text-sm flex items-center justify-center cursor-pointer"
                        >
                          -
                        </button>
                        <span className="flex-1 text-center text-xs font-bold text-amber-400 bg-slate-900 py-1.5 rounded border border-slate-800">
                          {stop.days} {isRtl ? 'أيام' : 'Days'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateCityStop(stop.id, 'days', Math.min(14, (Number(stop.days) || 1) + 1))}
                          className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800 text-sm flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] text-slate-400 mb-1 font-semibold">
                        {isRtl ? 'منطقة السكن' : 'Hotel Area'}
                      </label>
                      <input
                        type="text"
                        value={stop.hotelArea || ''}
                        onChange={(e) => handleUpdateCityStop(stop.id, 'hotelArea', e.target.value)}
                        placeholder="Center, Metro..."
                        className="w-full bg-slate-900 border border-slate-750 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="sm:col-span-1 flex justify-center">
                      {cityStops.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveCityStop(stop.id)}
                          className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
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
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  {getTranslation(currentLanguage, 'transit_mode_label')}:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {transitOptions.map((opt) => {
                    const isSelected = preferredTransit === opt.value;
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setPreferredTransit(opt.value)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs text-start transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold shadow-sm'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0 text-amber-400" />
                        <span className="line-clamp-1">{getTranslation(currentLanguage, opt.labelKey)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Group Type */}
          <div className="md:col-span-12 space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-200">
              <Users className="w-4 h-4 text-amber-400" />
              <span>{getTranslation(currentLanguage, 'travelers_group_label')} *</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {groupOptions.map((opt) => {
                const isSelected = groupType === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    id={`group-opt-${opt.value}`}
                    onClick={() => setGroupType(opt.value)}
                    className={`flex flex-col items-start p-3.5 rounded-xl border text-start transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400/10 border-amber-400 text-white shadow-md ring-1 ring-amber-400/40'
                        : 'bg-slate-900 border-slate-800 hover:bg-slate-850 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <span className="text-xl">{opt.icon}</span>
                      {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                    </div>
                    <span className="text-xs font-bold text-white">{getTranslation(currentLanguage, opt.labelKey)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Budget & Currency */}
          <div className="md:col-span-6 space-y-2">
            <label htmlFor="budget-input" className="flex items-center gap-2 text-sm font-bold text-slate-200">
              <Wallet className="w-4 h-4 text-amber-400" />
              <span>{getTranslation(currentLanguage, 'budget_label')}</span>
            </label>
            <div className="grid grid-cols-12 gap-2">
              <input
                id="budget-input"
                type="number"
                min="100"
                step="100"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="5000"
                className="col-span-7 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400 text-sm font-medium"
              />
              <select
                id="currency-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="col-span-5 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400 text-xs font-medium"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Preferred Accommodation Area */}
          <div className="md:col-span-6 space-y-2">
            <label htmlFor="accommodation-input" className="flex items-center gap-2 text-sm font-bold text-slate-200">
              <Hotel className="w-4 h-4 text-amber-400" />
              <span>{getTranslation(currentLanguage, 'accommodation_area_label')}</span>
            </label>
            <input
              id="accommodation-input"
              type="text"
              value={accommodationArea}
              onChange={(e) => setAccommodationArea(e.target.value)}
              placeholder={getTranslation(currentLanguage, 'accommodation_area_placeholder')}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400 text-sm font-medium"
            />
          </div>

          {/* Travel Style */}
          <div className="md:col-span-12 space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-200">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>{getTranslation(currentLanguage, 'travel_style_label')} *</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {styleOptions.map((style) => {
                const isSelected = travelStyle === style.value;
                return (
                  <button
                    key={style.value}
                    type="button"
                    id={`style-opt-${style.value}`}
                    onClick={() => setTravelStyle(style.value)}
                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                    }`}
                  >
                    <span>{style.icon}</span>
                    <span className="truncate">{getTranslation(currentLanguage, style.labelKey)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Local Experiences Module Toggle */}
          <div className="md:col-span-12 bg-slate-900/80 border border-amber-400/30 p-4 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5">
                <Gem className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold text-white block">
                  {getTranslation(currentLanguage, 'include_hidden_gems')}
                </span>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                  {isRtl 
                    ? 'اقتراح 2-3 تجارب سرية أصيلة (مطاعم عائلية خفية، ورش حرفية يدوية، جولات أحياء عتيقة) ودمجها بالجدول.'
                    : 'Include 2-3 local gems (authentic eateries, artisanal workshops, cultural trails) in your itinerary.'}
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
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
            </label>
          </div>

          {/* Special Constraints & Strict Requirements */}
          <div className="md:col-span-8 space-y-2">
            <label htmlFor="special-constraints-input" className="flex items-center gap-2 text-sm font-bold text-slate-200">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>{getTranslation(currentLanguage, 'special_constraints_label')}</span>
            </label>
            <textarea
              id="special-constraints-input"
              rows={3}
              value={specialConstraints}
              onChange={(e) => setSpecialConstraints(e.target.value)}
              placeholder={getTranslation(currentLanguage, 'special_constraints_placeholder')}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400 text-sm font-medium resize-none leading-relaxed"
            />
          </div>

          {/* Dialect / Tone Preference */}
          <div className="md:col-span-4 space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-200">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>{getTranslation(currentLanguage, 'dialect_label')}</span>
            </label>
            <div className="space-y-2">
              {DIALECTS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setDialect(d.value)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                    dialect === d.value
                      ? 'bg-amber-400/15 border-amber-400 text-amber-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{d.flag}</span>
                    <span>{d.label}</span>
                  </span>
                  {dialect === d.value && <Check className="w-3.5 h-3.5 text-amber-400" />}
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
            className="w-full py-4 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed group cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>{getTranslation(currentLanguage, 'generating_plan')}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-slate-950 group-hover:rotate-12 transition-transform" />
                <span>{getTranslation(currentLanguage, 'generate_plan_btn')}</span>
                <ArrowRight className="w-5 h-5 text-slate-950 rtl:rotate-180" />
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

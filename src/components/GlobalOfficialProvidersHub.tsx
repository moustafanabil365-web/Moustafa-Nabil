import React, { useState, useMemo } from 'react';
import { 
  Search, Plane, Hotel, Building, Compass, 
  ExternalLink, Sparkles, ShieldCheck, CheckCircle2, 
  Car, Train, Wifi, Globe, MapPin, X, ArrowUpRight, Zap,
  Star, Award, Navigation, Luggage, Crown, Flame, Ship, HeartHandshake, Filter,
  Armchair, Briefcase, Landmark
} from 'lucide-react';
import { 
  OfficialProvider, 
  OFFICIAL_PROVIDERS_DATABASE, 
  PROVIDER_CATEGORIES, 
  PROVIDER_REGIONS, 
  AIRLINE_SUBCATEGORIES, 
  HOTEL_SUBCATEGORIES, 
  SERVICE_SUBCATEGORIES,
  ProviderCategory,
  ProviderRegion
} from '../data/officialProviders';
import { SupportedLanguage, getTranslation } from '../utils/i18n';

interface GlobalOfficialProvidersHubProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage?: SupportedLanguage;
}

export const GlobalOfficialProvidersHub: React.FC<GlobalOfficialProvidersHubProps> = ({
  isOpen,
  onClose,
  currentLanguage = 'ar',
}) => {
  const [activeCategory, setActiveCategory] = useState<ProviderCategory | 'all'>('all');
  const [activeSubcategory, setActiveSubcategory] = useState<string>('all');
  const [activeRegion, setActiveRegion] = useState<ProviderRegion | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const isRtl = currentLanguage === 'ar';

  const renderIcon = (type: string, className: string = 'w-4 h-4') => {
    switch (type) {
      case 'plane': return <Plane className={className} />;
      case 'hotel': return <Hotel className={className} />;
      case 'shield': return <ShieldCheck className={className} />;
      case 'wifi': return <Wifi className={className} />;
      case 'train': return <Train className={className} />;
      case 'car': return <Car className={className} />;
      case 'crown': return <Crown className={className} />;
      case 'armchair': return <Armchair className={className} />;
      case 'ship': return <Ship className={className} />;
      case 'briefcase': return <Briefcase className={className} />;
      case 'landmark': return <Landmark className={className} />;
      case 'building': return <Building className={className} />;
      default: return <Globe className={className} />;
    }
  };

  const filteredProviders = useMemo(() => {
    return OFFICIAL_PROVIDERS_DATABASE.filter((p) => {
      // Category Filter
      if (activeCategory !== 'all' && p.category !== activeCategory) {
        return false;
      }

      // Subcategory Filter
      if (activeSubcategory !== 'all' && p.subcategory !== activeSubcategory) {
        return false;
      }

      // Region Filter
      if (activeRegion !== 'all') {
        const matchesRegion = p.regions.includes(activeRegion) || p.regions.includes('global');
        if (!matchesRegion) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesNameAr = p.name.toLowerCase().includes(q);
        const matchesNameEn = p.nameEn.toLowerCase().includes(q);
        const matchesDescAr = p.shortDescription.toLowerCase().includes(q);
        const matchesDescEn = p.shortDescriptionEn.toLowerCase().includes(q);
        const matchesCountry = (p.countryName && p.countryName.toLowerCase().includes(q)) || 
                               (p.countryNameEn && p.countryNameEn.toLowerCase().includes(q));
        const matchesTags = p.tags.some(t => t.toLowerCase().includes(q));

        if (!matchesNameAr && !matchesNameEn && !matchesDescAr && !matchesDescEn && !matchesCountry && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [activeCategory, activeSubcategory, activeRegion, searchQuery]);

  // Reset subcategory when category changes
  const handleCategoryChange = (category: ProviderCategory | 'all') => {
    setActiveCategory(category);
    setActiveSubcategory('all');
  };

  const handleResetFilters = () => {
    setActiveCategory('all');
    setActiveSubcategory('all');
    setActiveRegion('all');
    setSearchQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div 
        className="max-w-6xl w-full my-auto bg-[#080d1a] border border-amber-400/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        
        {/* Header Bar */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-950 via-[#0b1329] to-slate-950 border-b border-amber-400/20 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/40 flex items-center justify-center font-bold text-sm">
                🌐
              </span>
              <h2 className="text-base sm:text-xl font-black text-white flex items-center gap-2">
                <span>{getTranslation(currentLanguage, 'directory_title')}</span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-400/15 text-amber-300 font-bold border border-amber-400/30 hidden sm:inline-block">
                  {filteredProviders.length} {getTranslation(currentLanguage, 'providers_count_label')}
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl">
              {getTranslation(currentLanguage, 'directory_subtitle')}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700 hover:border-amber-400/50 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors flex-shrink-0"
            title={getTranslation(currentLanguage, 'close')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Controls Area */}
        <div className="p-4 sm:p-6 bg-slate-950/60 border-b border-slate-800/80 space-y-4">
          
          {/* Top Row: Search & Category Tabs */}
          <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
            
            {/* Category Switcher Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              <button
                type="button"
                onClick={() => handleCategoryChange('all')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  activeCategory === 'all'
                    ? 'bg-amber-400 text-slate-950 border-amber-400 font-black shadow-md shadow-amber-500/20'
                    : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{getTranslation(currentLanguage, 'category_all')}</span>
                <span className="text-[10px] opacity-70">({OFFICIAL_PROVIDERS_DATABASE.length})</span>
              </button>

              {PROVIDER_CATEGORIES.map((cat) => {
                const count = OFFICIAL_PROVIDERS_DATABASE.filter(p => p.category === cat.id).length;
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 border-amber-400 font-black shadow-md shadow-amber-500/20'
                        : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border-slate-800'
                    }`}
                  >
                    {renderIcon(cat.icon, 'w-3.5 h-3.5')}
                    <span>{isRtl ? cat.labelAr : cat.labelEn}</span>
                    <span className="text-[10px] opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Live Search Box */}
            <div className="relative w-full lg:w-80">
              <Search className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={getTranslation(currentLanguage, 'search_providers_placeholder')}
                className={`w-full bg-slate-900 border border-slate-700/90 hover:border-amber-400/50 rounded-xl py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all ${
                  isRtl ? 'pr-10 pl-9' : 'pl-10 pr-9'
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className={`absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-white ${isRtl ? 'left-3' : 'right-3'}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>

          {/* Subcategory Pills Row (if applicable) */}
          {activeCategory === 'airlines' && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-slate-850 pt-2.5">
              <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap px-1">
                {isRtl ? 'فئة الطيران:' : 'Airline Tier:'}
              </span>
              <button
                type="button"
                onClick={() => setActiveSubcategory('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                  activeSubcategory === 'all'
                    ? 'bg-amber-400/25 text-amber-300 border-amber-400'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800'
                }`}
              >
                {getTranslation(currentLanguage, 'category_all')}
              </button>
              {AIRLINE_SUBCATEGORIES.map((sub) => {
                const count = OFFICIAL_PROVIDERS_DATABASE.filter(p => p.category === 'airlines' && p.subcategory === sub.id).length;
                const isSelected = activeSubcategory === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setActiveSubcategory(sub.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border whitespace-nowrap ${
                      isSelected
                        ? 'bg-amber-400/25 text-amber-300 border-amber-400'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800'
                    }`}
                  >
                    <span>{isRtl ? sub.labelAr : sub.labelEn}</span>
                    <span className="text-[10px] ml-1 opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>
          )}

          {activeCategory === 'hotels' && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-slate-850 pt-2.5">
              <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap px-1">
                {isRtl ? 'فئة الإقامة:' : 'Hotel Tier:'}
              </span>
              <button
                type="button"
                onClick={() => setActiveSubcategory('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                  activeSubcategory === 'all'
                    ? 'bg-amber-400/25 text-amber-300 border-amber-400'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800'
                }`}
              >
                {getTranslation(currentLanguage, 'category_all')}
              </button>
              {HOTEL_SUBCATEGORIES.map((sub) => {
                const count = OFFICIAL_PROVIDERS_DATABASE.filter(p => p.category === 'hotels' && p.subcategory === sub.id).length;
                const isSelected = activeSubcategory === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setActiveSubcategory(sub.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border whitespace-nowrap ${
                      isSelected
                        ? 'bg-amber-400/25 text-amber-300 border-amber-400'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800'
                    }`}
                  >
                    <span>{isRtl ? sub.labelAr : sub.labelEn}</span>
                    <span className="text-[10px] ml-1 opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>
          )}

          {activeCategory === 'services' && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-slate-850 pt-2.5">
              <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap px-1">
                {isRtl ? 'نوع الخدمة:' : 'Service Type:'}
              </span>
              <button
                type="button"
                onClick={() => setActiveSubcategory('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                  activeSubcategory === 'all'
                    ? 'bg-amber-400/25 text-amber-300 border-amber-400'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800'
                }`}
              >
                {getTranslation(currentLanguage, 'category_all')}
              </button>
              {SERVICE_SUBCATEGORIES.map((sub) => {
                const count = OFFICIAL_PROVIDERS_DATABASE.filter(p => p.category === 'services' && p.subcategory === sub.id).length;
                const isSelected = activeSubcategory === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setActiveSubcategory(sub.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border whitespace-nowrap ${
                      isSelected
                        ? 'bg-amber-400/25 text-amber-300 border-amber-400'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800'
                    }`}
                  >
                    {renderIcon(sub.icon, 'w-3 h-3')}
                    <span>{isRtl ? sub.labelAr : sub.labelEn}</span>
                    <span className="text-[10px] opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Region Filter Row */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-slate-850 pt-2.5">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 px-1 whitespace-nowrap">
              <Globe className="w-3 h-3 text-amber-400" />
              <span>{getTranslation(currentLanguage, 'region_filter')}:</span>
            </span>
            <button
              type="button"
              onClick={() => setActiveRegion('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                activeRegion === 'all'
                  ? 'bg-slate-800 text-amber-300 border-amber-400/50'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border-slate-800'
              }`}
            >
              {getTranslation(currentLanguage, 'region_all')}
            </button>
            {PROVIDER_REGIONS.map((reg) => {
              const isSelected = activeRegion === reg.id;
              return (
                <button
                  key={reg.id}
                  type="button"
                  onClick={() => setActiveRegion(reg.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border whitespace-nowrap ${
                    isSelected
                      ? 'bg-slate-800 text-amber-300 border-amber-400/50'
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border-slate-800'
                  }`}
                >
                  {renderIcon(reg.icon, 'w-3 h-3')}
                  <span>{isRtl ? reg.labelAr : reg.labelEn}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Content Area: Provider Cards Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 max-h-[60vh] bg-[#070b14]">
          {filteredProviders.length === 0 ? (
            <div className="py-16 text-center bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 p-8 space-y-3">
              <Globe className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-300">
                {getTranslation(currentLanguage, 'no_providers_found')}
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs px-4 py-2 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold hover:bg-amber-400/30 transition-all cursor-pointer"
              >
                {getTranslation(currentLanguage, 'reset_filters')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProviders.map((provider) => {
                const subcategoryLabel = 
                  provider.category === 'airlines' 
                    ? AIRLINE_SUBCATEGORIES.find(s => s.id === provider.subcategory)?.[isRtl ? 'labelAr' : 'labelEn'] || provider.subcategory
                    : provider.category === 'hotels'
                    ? HOTEL_SUBCATEGORIES.find(s => s.id === provider.subcategory)?.[isRtl ? 'labelAr' : 'labelEn'] || provider.subcategory
                    : SERVICE_SUBCATEGORIES.find(s => s.id === provider.subcategory)?.[isRtl ? 'labelAr' : 'labelEn'] || provider.subcategory;

                return (
                  <div
                    key={provider.id}
                    className="bg-slate-900/90 border border-slate-800 hover:border-amber-400/40 rounded-2xl p-4 flex flex-col justify-between transition-all shadow-md hover:shadow-amber-500/5 group"
                  >
                    <div className="space-y-3">
                      
                      {/* Top Badges & Icon */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-700/80 group-hover:border-amber-400/50 flex items-center justify-center text-amber-400 transition-colors">
                            {renderIcon(provider.iconType, 'w-4 h-4')}
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-amber-300 transition-colors leading-tight">
                              {isRtl ? provider.name : provider.nameEn}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-mono">
                              {isRtl ? provider.nameEn : provider.name}
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-300 border border-amber-400/25 font-bold flex items-center gap-1 flex-shrink-0">
                          <ShieldCheck className="w-3 h-3 text-amber-400" />
                          <span>{getTranslation(currentLanguage, 'verified_provider_badge')}</span>
                        </span>
                      </div>

                      {/* Chips Row */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                        <span className="px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800 font-medium">
                          {subcategoryLabel}
                        </span>
                        {provider.countryName && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-950 text-amber-300/90 border border-slate-800 font-medium flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5 text-amber-400" />
                            <span>{isRtl ? provider.countryName : provider.countryNameEn || provider.countryName}</span>
                          </span>
                        )}
                        {provider.metadata?.allianceOrNetwork && (
                          <span className="px-2 py-0.5 rounded-md bg-blue-950/40 text-blue-300 border border-blue-800/40 font-bold">
                            {provider.metadata.allianceOrNetwork}
                          </span>
                        )}
                        {provider.metadata?.loyaltyProgram && (
                          <span className="px-2 py-0.5 rounded-md bg-purple-950/40 text-purple-300 border border-purple-800/40 font-medium">
                            {provider.metadata.loyaltyProgram}
                          </span>
                        )}
                      </div>

                      {/* Neutral Description */}
                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                        {isRtl ? provider.shortDescription : provider.shortDescriptionEn}
                      </p>

                    </div>

                    {/* Footer Action: Official Website Button */}
                    <div className="pt-3.5 mt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <span>{getTranslation(currentLanguage, 'direct_from_sources')}</span>
                      </div>

                      <a
                        href={provider.officialWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow-md shadow-amber-500/10 hover:shadow-amber-500/25 group/btn"
                      >
                        <span>{getTranslation(currentLanguage, 'official_website_btn')}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </a>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Summary */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{filteredProviders.length} {getTranslation(currentLanguage, 'providers_count_label')}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700 cursor-pointer"
          >
            {getTranslation(currentLanguage, 'close')}
          </button>
        </div>

      </div>
    </div>
  );
};

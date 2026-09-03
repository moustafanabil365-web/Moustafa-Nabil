import React, { useState, useMemo } from 'react';
import { 
  Globe, Search, MapPin, Sparkles, Check, Star, X, Landmark, Filter,
  Building2, Palmtree, Mountain, Heart, ArrowRight
} from 'lucide-react';
import { GLOBAL_COUNTRIES, GlobalCountry } from '../data/globalDestinations';
import { SupportedLanguage, getTranslation } from '../utils/i18n';

interface GlobalDestinationsBrowserProps {
  onSelectCity: (cityName: string, countryName: string) => void;
  selectedDestination?: string;
  currentLanguage?: SupportedLanguage;
}

type ContinentTab = 'all' | 'middle_east' | 'europe' | 'asia' | 'americas' | 'africa';
type ThemeCategory = 'all' | 'spiritual' | 'history' | 'nature' | 'beaches' | 'luxury' | 'family';

const THEME_CATEGORIES: { id: ThemeCategory; labelAr: string; labelEn: string; icon: any; keywords: string[] }[] = [
  { id: 'all', labelAr: 'جميع التجارب', labelEn: 'All Themes', icon: Sparkles, keywords: [] },
  { id: 'spiritual', labelAr: 'مقدسات وروحانية', labelEn: 'Spiritual', icon: Landmark, keywords: ['مكة', 'المدينة', 'القدس', 'الحرم', 'مسجد', 'عمرة', 'حج', 'روحاني', 'mecca', 'medina', 'jerusalem'] },
  { id: 'history', labelAr: 'تاريخ وحضارة', labelEn: 'History & Culture', icon: Building2, keywords: ['أهرامات', 'تاريخ', 'متحف', 'آثار', 'معبد', 'قصر', 'البلد', 'العلا', 'روما', 'أكروبوليس', 'أثينا', 'pyramids', 'museum', 'ancient'] },
  { id: 'nature', labelAr: 'طبيعة واسترخاء', labelEn: 'Nature & Scenery', icon: Mountain, keywords: ['طبيعة', 'جبال', 'بحيرات', 'شلالات', 'صلالة', 'السودة', 'ألب', 'إنترلاكن', 'بالي', 'سفاري', 'nature', 'alps', 'lake', 'green'] },
  { id: 'beaches', labelAr: 'شواطئ وجزر', labelEn: 'Beaches & Islands', icon: Palmtree, keywords: ['شاطئ', 'جزر', 'بحر', 'منتجع', 'غوص', 'شرم', 'المالديف', 'سيشل', 'سانتوريني', 'فوكيت', 'ريو', 'beach', 'island', 'resort'] },
  { id: 'luxury', labelAr: 'فخامة وتسوق', labelEn: 'Luxury & Shopping', icon: Star, keywords: ['دبي', 'تسوق', 'مول', 'برج خليفة', 'باريس', 'لندن', 'ميلانو', 'نيويورك', 'طوكيو', 'فاخر', 'luxury', 'mall', 'shopping'] },
  { id: 'family', labelAr: 'عائلات وترفيه', labelEn: 'Family & Fun', icon: Heart, keywords: ['ديزني', 'ملاهي', 'عائلي', 'أورلاندو', 'ياس', 'بوليفارد', 'ترفيه', 'disney', 'theme park', 'family'] },
];

export const GlobalDestinationsBrowser: React.FC<GlobalDestinationsBrowserProps> = ({
  onSelectCity,
  selectedDestination = '',
  currentLanguage = 'ar',
}) => {
  const [activeContinent, setActiveContinent] = useState<ContinentTab>('all');
  const [activeTheme, setActiveTheme] = useState<ThemeCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const isRtl = currentLanguage === 'ar';

  const continentTabs = [
    { id: 'all', labelAr: 'كل دول العالم', labelEn: 'All Countries', flag: '🌍', count: GLOBAL_COUNTRIES.length },
    { id: 'middle_east', labelAr: 'الشرق الأوسط والخليج', labelEn: 'Middle East', flag: '🕌', count: GLOBAL_COUNTRIES.filter(c => c.continent === 'middle_east').length },
    { id: 'europe', labelAr: 'أوروبا', labelEn: 'Europe', flag: '🏰', count: GLOBAL_COUNTRIES.filter(c => c.continent === 'europe').length },
    { id: 'asia', labelAr: 'آسيا والمحيط الهندي', labelEn: 'Asia Pacific', flag: '⛩️', count: GLOBAL_COUNTRIES.filter(c => c.continent === 'asia').length },
    { id: 'americas', labelAr: 'الأمريكتان', labelEn: 'Americas', flag: '🗽', count: GLOBAL_COUNTRIES.filter(c => c.continent === 'americas').length },
    { id: 'africa', labelAr: 'أفريقيا والجزر', labelEn: 'Africa', flag: '🌴', count: GLOBAL_COUNTRIES.filter(c => c.continent === 'africa' || c.continent === 'oceania').length },
  ];

  const filteredCountries = useMemo(() => {
    return GLOBAL_COUNTRIES.map((country) => {
      const matchesContinent = 
        activeContinent === 'all' || 
        country.continent === activeContinent || 
        (activeContinent === 'africa' && country.continent === 'oceania');

      if (!matchesContinent) return null;

      const q = searchQuery.toLowerCase().trim();
      const currentThemeObj = THEME_CATEGORIES.find(t => t.id === activeTheme);

      // Filter cities within the country
      const matchedCities = country.popularCities.filter((city) => {
        // Theme matching
        if (activeTheme !== 'all' && currentThemeObj) {
          const combinedCityText = `${city.name} ${city.tag} ${city.landmark} ${city.province || ''}`.toLowerCase();
          const matchesThemeKeywords = currentThemeObj.keywords.some(k => combinedCityText.includes(k.toLowerCase()));
          if (!matchesThemeKeywords) return false;
        }

        // Search query matching
        if (!q) return true;
        const matchesQuery = 
          country.name.toLowerCase().includes(q) ||
          country.nameEn.toLowerCase().includes(q) ||
          city.name.toLowerCase().includes(q) ||
          city.tag.toLowerCase().includes(q) ||
          city.landmark.toLowerCase().includes(q) ||
          (city.province && city.province.toLowerCase().includes(q));

        return matchesQuery;
      });

      if (matchedCities.length === 0) return null;

      return {
        ...country,
        popularCities: matchedCities,
      };
    }).filter(Boolean) as GlobalCountry[];
  }, [activeContinent, activeTheme, searchQuery]);

  const totalMatchedCities = useMemo(() => {
    return filteredCountries.reduce((acc, c) => acc + c.popularCities.length, 0);
  }, [filteredCountries]);

  return (
    <div 
      className="w-full bg-[#080d1a] border border-amber-400/30 rounded-3xl p-4 sm:p-6 space-y-5 shadow-2xl transition-all"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-md shadow-amber-400/20 flex-shrink-0">
            <div className="w-full h-full bg-[#090f1d] rounded-[14px] flex items-center justify-center text-amber-400 text-lg">
              🌍
            </div>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white">
                {getTranslation(currentLanguage, 'destinations_guide_title')}
              </h3>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-black border border-amber-400/40">
                {filteredCountries.length} {getTranslation(currentLanguage, 'matched_countries')} • {totalMatchedCities} {getTranslation(currentLanguage, 'matched_cities')}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {getTranslation(currentLanguage, 'destinations_guide_desc')}
            </p>
          </div>
        </div>

        {/* Live Search Box */}
        <div className="relative w-full lg:w-80">
          <Search className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={getTranslation(currentLanguage, 'search_destinations_placeholder')}
            className={`w-full bg-slate-900/90 border border-slate-700/90 hover:border-amber-400/50 rounded-xl py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all ${
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

      {/* Continents Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {continentTabs.map((tab) => {
          const isSelected = activeContinent === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveContinent(tab.id as ContinentTab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-amber-400 text-slate-950 border-amber-400 font-black shadow-md shadow-amber-500/20 scale-[1.02]'
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-850 hover:text-white border-slate-800'
              }`}
            >
              <span>{tab.flag}</span>
              <span>{isRtl ? tab.labelAr : tab.labelEn}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Experience Themes Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
        <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 px-1 whitespace-nowrap">
          <Filter className="w-3.5 h-3.5 text-amber-400" />
          <span>{isRtl ? 'التصنيف:' : 'Filter:'}</span>
        </span>
        {THEME_CATEGORIES.map((cat) => {
          const isCatSelected = activeTheme === cat.id;
          const IconComp = cat.icon;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveTheme(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                isCatSelected
                  ? 'bg-amber-400/20 text-amber-300 border-amber-400/60 font-black shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
              }`}
            >
              <IconComp className="w-3.5 h-3.5 text-amber-400" />
              <span>{isRtl ? cat.labelAr : cat.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Countries & Cities Content Grid */}
      {filteredCountries.length === 0 ? (
        <div className="py-12 text-center bg-slate-900/50 rounded-2xl border border-dashed border-slate-800 p-6 space-y-2">
          <Globe className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-sm font-bold text-slate-300">{getTranslation(currentLanguage, 'no_providers_found')}</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setActiveContinent('all');
              setActiveTheme('all');
            }}
            className="mt-2 text-xs px-4 py-2 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold hover:bg-amber-400/30 transition-all cursor-pointer"
          >
            {getTranslation(currentLanguage, 'reset_filters')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5 max-h-[580px] overflow-y-auto pr-1">
          {filteredCountries.map((country) => {
            return (
              <div 
                key={country.code}
                className="bg-slate-900/90 border border-slate-800/90 hover:border-amber-400/40 rounded-2xl p-4 transition-all shadow-lg flex flex-col justify-between group"
              >
                <div>
                  {/* Country Header */}
                  <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-xl shadow-inner flex-shrink-0">
                        {country.flag}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-amber-300 transition-colors truncate">
                          {isRtl ? country.name : country.nameEn}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                          <span className="font-semibold text-slate-300">{country.code}</span>
                          <span>•</span>
                          <span className="truncate">{isRtl ? country.nameEn : country.name}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-amber-400/15 text-amber-300 border border-amber-400/30">
                        {country.currency}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                        {country.popularCities.length} {getTranslation(currentLanguage, 'matched_cities')}
                      </span>
                    </div>
                  </div>

                  {/* Cities List for this Country */}
                  <div className="space-y-2.5">
                    {country.popularCities.map((city, idx) => {
                      const isSelected = selectedDestination.includes(city.name);
                      return (
                        <div
                          key={idx}
                          onClick={() => onSelectCity(city.name, country.name)}
                          className={`w-full text-start p-3 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer group/city ${
                            isSelected
                              ? 'bg-amber-400/15 border-amber-400 text-amber-300 shadow-md ring-1 ring-amber-400/30'
                              : 'bg-slate-950/80 hover:bg-slate-950 border-slate-800 hover:border-amber-400/50 text-slate-200'
                          }`}
                        >
                          {/* Image & Main Info */}
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            {/* City Image Preview */}
                            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-800 border border-slate-700 shadow-sm">
                              <img 
                                src={city.imageUrl} 
                                alt={city.name}
                                className="w-full h-full object-cover group-hover/city:scale-110 transition-transform duration-500"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80';
                                }}
                              />
                              {isSelected && (
                                <div className="absolute inset-0 bg-amber-400/30 backdrop-blur-[1px] flex items-center justify-center">
                                  <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow font-black">
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* City Typography & Details */}
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex items-center gap-1.5">
                                <h5 className="text-xs sm:text-sm font-black text-white group-hover/city:text-amber-300 transition-colors truncate">
                                  {city.name}
                                </h5>
                                {city.province && (
                                  <span className="text-[10px] text-slate-400 font-medium truncate hidden sm:inline">
                                    ({city.province})
                                  </span>
                                )}
                              </div>

                              {/* Landmark Line */}
                              <div className="flex items-center gap-1 text-[11px] text-amber-300/90 font-semibold truncate">
                                <Landmark className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                                <span className="truncate">{city.landmark}</span>
                              </div>

                              {/* Tag Badge */}
                              <div className="flex items-center">
                                <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800 font-medium truncate">
                                  {city.tag}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Action Button on the side */}
                          <div className="flex-shrink-0">
                            <span className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-xl font-black transition-all whitespace-nowrap ${
                              isSelected
                                ? 'bg-amber-400 text-slate-950 shadow-md'
                                : 'bg-slate-900 border border-amber-400/30 text-amber-300 group-hover/city:bg-amber-400 group-hover/city:text-slate-950 group-hover/city:border-amber-400'
                            }`}>
                              {isSelected ? (
                                <>
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  <span>{isRtl ? 'المحددة' : 'Selected'}</span>
                                </>
                              ) : (
                                <>
                                  <span>{getTranslation(currentLanguage, 'select_destination_btn')}</span>
                                  <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

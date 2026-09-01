import React, { useState, useMemo } from 'react';
import { 
  Globe, Search, MapPin, Sparkles, Compass, 
  ChevronRight, Check, Star, ArrowRight, Eye
} from 'lucide-react';
import { GLOBAL_COUNTRIES, GlobalCountry } from '../data/globalDestinations';

interface GlobalDestinationsBrowserProps {
  onSelectCity: (cityName: string, countryName: string) => void;
  selectedDestination?: string;
}

type ContinentTab = 'all' | 'middle_east' | 'europe' | 'asia' | 'americas' | 'africa';

export const GlobalDestinationsBrowser: React.FC<GlobalDestinationsBrowserProps> = ({
  onSelectCity,
  selectedDestination = '',
}) => {
  const [activeContinent, setActiveContinent] = useState<ContinentTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);

  const continentTabs = [
    { id: 'all', label: '🌍 كل دول العالم السياحية', count: GLOBAL_COUNTRIES.length },
    { id: 'middle_east', label: '🕌 الشرق الأوسط والخليج', count: GLOBAL_COUNTRIES.filter(c => c.continent === 'middle_east').length },
    { id: 'europe', label: '🏰 أوروبا الخلابة', count: GLOBAL_COUNTRIES.filter(c => c.continent === 'europe').length },
    { id: 'asia', label: '⛩️ آسيا والمحيط الهندي', count: GLOBAL_COUNTRIES.filter(c => c.continent === 'asia').length },
    { id: 'americas', label: '🗽 الأمريكتان', count: GLOBAL_COUNTRIES.filter(c => c.continent === 'americas').length },
    { id: 'africa', label: '🌴 أفريقيا والجزر الاستوائية', count: GLOBAL_COUNTRIES.filter(c => c.continent === 'africa' || c.continent === 'oceania').length },
  ];

  const filteredCountries = useMemo(() => {
    return GLOBAL_COUNTRIES.filter((country) => {
      const matchesContinent = 
        activeContinent === 'all' || 
        country.continent === activeContinent || 
        (activeContinent === 'africa' && country.continent === 'oceania');

      if (!matchesContinent) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const inCountryName = country.name.toLowerCase().includes(q) || country.nameEn.toLowerCase().includes(q);
      const inCities = country.popularCities.some(
        c => c.name.toLowerCase().includes(q) || c.tag.toLowerCase().includes(q) || c.landmark.toLowerCase().includes(q)
      );

      return inCountryName || inCities;
    });
  }, [activeContinent, searchQuery]);

  return (
    <div className="w-full bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-amber-400/25 rounded-3xl p-4 sm:p-6 space-y-5 shadow-2xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 text-xs">
              🌍
            </span>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>دليل الوجهات والدول الأكثر سياحة في العالم</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                تصفح واختر بضغطة واحدة
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-300">
            استكشف أشهر المدن والمعالم الأثرية والطبيعية حول العالم وانقر لاختيار وجهتك الفورية
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن دولة، مدينة، أو معلم..."
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pr-10 pl-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Continent Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {continentTabs.map((tab) => {
          const isSelected = activeContinent === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveContinent(tab.id as ContinentTab);
                setSelectedCountryCode(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md font-black scale-105'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Countries and Cities Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[480px] overflow-y-auto pr-1">
        {filteredCountries.map((country) => {
          return (
            <div 
              key={country.code}
              className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-400/50 rounded-2xl p-3.5 transition-all shadow-md hover:shadow-xl flex flex-col justify-between group"
            >
              <div>
                {/* Country Header */}
                <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl drop-shadow">{country.flag}</span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-amber-300 transition-colors">
                        {country.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono">{country.nameEn}</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-amber-300 border border-amber-400/20 font-bold">
                    {country.continentLabel}
                  </span>
                </div>

                {/* Popular Cities in Country */}
                <div className="space-y-2">
                  {country.popularCities.map((city, idx) => {
                    const isSelected = selectedDestination.includes(city.name);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => onSelectCity(city.name, country.name)}
                        className={`w-full text-right p-2 rounded-xl border transition-all flex items-center gap-2.5 cursor-pointer group/city ${
                          isSelected
                            ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-black shadow-md'
                            : 'bg-slate-900/80 hover:bg-slate-900 border-slate-750 border-slate-800/80 hover:border-amber-400/40 text-slate-200'
                        }`}
                      >
                        <img 
                          src={city.imageUrl} 
                          alt={city.name}
                          className="w-11 h-11 rounded-lg object-cover flex-shrink-0 border border-slate-700 group-hover/city:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-white group-hover/city:text-amber-300 truncate">
                              {city.name}
                            </span>
                            <span className="text-[10px] text-amber-400/90 font-bold flex-shrink-0">
                              اختر ✨
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            {city.landmark}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

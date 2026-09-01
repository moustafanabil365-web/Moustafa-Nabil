import React, { useState, useEffect } from 'react';
import { 
  CloudSun, Sun, CloudRain, Wind, Droplets, ShieldAlert, 
  Sparkles, RefreshCw, Shirt, Footprints, Glasses, Umbrella, 
  ThermometerSun, Compass, CheckCircle2, ChevronDown, ChevronUp
} from 'lucide-react';
import { WeatherData } from '../types';

interface WeatherWidgetProps {
  destination: string;
  initialWeather?: WeatherData;
  onWeatherLoaded?: (weather: WeatherData) => void;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  destination,
  initialWeather,
  onWeatherLoaded,
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(initialWeather || null);
  const [loading, setLoading] = useState(!initialWeather);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'forecast' | 'clothing'>('forecast');

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/weather?destination=${encodeURIComponent(destination)}`);
      if (!res.ok) {
        throw new Error('فشل جلب بيانات الطقس');
      }
      const data = await res.json();
      if (data.success && data.weather) {
        setWeather(data.weather);
        if (onWeatherLoaded) {
          onWeatherLoaded(data.weather);
        }
      }
    } catch (err: any) {
      console.error('Weather fetch error:', err);
      setError('تعذر تحديث بيانات الطقس الحية حالياً.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialWeather || initialWeather.destination !== destination) {
      fetchWeather();
    } else {
      setWeather(initialWeather);
    }
  }, [destination]);

  if (loading && !weather) {
    return (
      <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-5 animate-pulse flex items-center justify-center gap-3 text-neutral-400">
        <RefreshCw className="w-5 h-5 animate-spin text-[#d4af37]" />
        <span className="text-xs sm:text-sm font-medium">جاري رصد حالة الطقس وتوقعات الأجواء وتجهيز توصيات الملابس في {destination}...</span>
      </div>
    );
  }

  if (error && !weather) {
    return (
      <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-4 flex items-center justify-between gap-3 text-neutral-400">
        <div className="flex items-center gap-2 text-xs">
          <ShieldAlert className="w-4 h-4 text-orange-400" />
          <span>{error}</span>
        </div>
        <button
          onClick={fetchWeather}
          className="text-xs px-3 py-1.5 rounded-lg bg-neutral-800 text-[#d4af37] hover:bg-neutral-700 transition-colors cursor-pointer"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="bg-[#111111] border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-[#171717] via-[#141414] to-[#121212] border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d4af37]/20 to-amber-950/30 border border-[#d4af37]/40 flex items-center justify-center text-2xl shadow-inner shadow-black/60">
            {weather.forecast?.[0]?.icon || '🌤️'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30">
                طقس حي ومباشر
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                {destination}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                {weather.currentTemp}°C
              </span>
              <span className="text-xs sm:text-sm font-semibold text-neutral-300">
                {weather.condition}
              </span>
              <span className="text-[11px] text-neutral-500">
                (المحسوسة: {weather.apparentTemp}°C)
              </span>
            </div>
          </div>
        </div>

        {/* Quick Weather Metrics & Toggle */}
        <div className="flex items-center gap-3 sm:gap-4 self-end sm:self-auto flex-wrap">
          <div className="flex items-center gap-1 text-[11px] text-neutral-300 bg-[#1a1a1a] px-2.5 py-1.5 rounded-xl border border-neutral-800">
            <Droplets className="w-3.5 h-3.5 text-blue-400" />
            <span>رطوبة {weather.humidity}%</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-neutral-300 bg-[#1a1a1a] px-2.5 py-1.5 rounded-xl border border-neutral-800">
            <Wind className="w-3.5 h-3.5 text-teal-400" />
            <span>رياح {weather.windSpeed} كم/س</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-neutral-300 bg-[#1a1a1a] px-2.5 py-1.5 rounded-xl border border-neutral-800">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>UV: {weather.uvIndex}</span>
          </div>

          <button
            onClick={fetchWeather}
            disabled={loading}
            className="p-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#262626] text-neutral-400 hover:text-[#d4af37] border border-neutral-800 transition-colors cursor-pointer"
            title="تحديث بيانات الطقس"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#d4af37]' : ''}`} />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#262626] text-neutral-400 hover:text-white border border-neutral-800 transition-colors cursor-pointer"
            title={isExpanded ? 'طي تفاصيل الطقس' : 'توسيع تفاصيل الطقس'}
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-5">
          {/* Tabs: Forecast vs Clothing Recommendations */}
          <div className="flex items-center gap-2 border-b border-neutral-800/80 pb-3">
            <button
              onClick={() => setActiveTab('forecast')}
              className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'forecast'
                  ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/20'
                  : 'text-neutral-400 hover:text-white bg-[#161616] border border-neutral-800'
              }`}
            >
              <CloudSun className="w-3.5 h-3.5" />
              <span>توقعات الأيام القادمة ({weather.forecast.length} أيام)</span>
            </button>

            <button
              onClick={() => setActiveTab('clothing')}
              className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'clothing'
                  ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/20'
                  : 'text-neutral-400 hover:text-white bg-[#161616] border border-neutral-800'
              }`}
            >
              <Shirt className="w-3.5 h-3.5" />
              <span>👔 توصيات الملابس الذكية</span>
            </button>
          </div>

          {activeTab === 'forecast' ? (
            <div>
              {/* Forecast Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                {weather.forecast.map((day, idx) => (
                  <div
                    key={day.date || idx}
                    className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all ${
                      idx === 0
                        ? 'bg-[#1c1c1c] border-[#d4af37]/40 shadow-md'
                        : 'bg-[#141414] border-neutral-800/80 hover:border-neutral-700'
                    }`}
                  >
                    <span className="text-[11px] font-bold text-neutral-400 mb-1">
                      {day.dayName}
                    </span>
                    <span className="text-2xl my-1">{day.icon}</span>
                    <span className="text-xs font-medium text-white truncate max-w-full">
                      {day.condition}
                    </span>
                    <div className="flex items-center gap-1.5 mt-2 font-mono text-xs">
                      <span className="text-white font-bold">{day.tempMax}°</span>
                      <span className="text-neutral-500">/</span>
                      <span className="text-neutral-400">{day.tempMin}°</span>
                    </div>
                    {day.precipitationProb > 20 && (
                      <span className="mt-1.5 text-[10px] text-blue-400 font-bold bg-blue-950/40 px-1.5 py-0.5 rounded border border-blue-800/40 flex items-center gap-0.5">
                        <CloudRain className="w-2.5 h-2.5" />
                        {day.precipitationProb}%
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Rain or Sun Advisory banner */}
              {weather.clothingRecommendations?.rainOrSunWarning && (
                <div className="mt-3.5 p-3 rounded-xl bg-[#1e1910] border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>{weather.clothingRecommendations.rainOrSunWarning}</span>
                </div>
              )}
            </div>
          ) : (
            /* Smart Clothing Recommendations View */
            <div className="space-y-4">
              <div className="bg-[#161616] border border-neutral-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    ملخص توصيات الأناقة والراحة لحالة الطقس:
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {weather.clothingRecommendations.summary}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* Daytime Outfit */}
                <div className="bg-[#141414] border border-neutral-800/90 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center gap-2 text-[#d4af37] text-xs font-bold">
                    <Sun className="w-4 h-4" />
                    <span>الملابس النهارية (للأنشطة والجولات):</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {weather.clothingRecommendations.daytimeOutfit}
                  </p>
                </div>

                {/* Evening Outfit */}
                <div className="bg-[#141414] border border-neutral-800/90 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center gap-2 text-blue-400 text-xs font-bold">
                    <ThermometerSun className="w-4 h-4" />
                    <span>الملابس المسائية (مع انخفاض الحرارة):</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {weather.clothingRecommendations.eveningOutfit}
                  </p>
                </div>

                {/* Footwear */}
                <div className="bg-[#141414] border border-neutral-800/90 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center gap-2 text-teal-400 text-xs font-bold">
                    <Footprints className="w-4 h-4" />
                    <span>توصيات الأحذية والمشي:</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {weather.clothingRecommendations.shoesRecommendation}
                  </p>
                </div>

                {/* Essential Accessories */}
                <div className="bg-[#141414] border border-neutral-800/90 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                    <Glasses className="w-4 h-4" />
                    <span>إكسسوارات ومستلزمات الحماية:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {weather.clothingRecommendations.essentialAccessories.map((item, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-[#1d1d1d] text-neutral-200 px-2.5 py-1 rounded-lg border border-neutral-700/80 font-medium"
                      >
                        ✓ {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  Utensils, Search, Star, MapPin, DollarSign, Filter, 
  ExternalLink, Sparkles, MessageCircle, RefreshCw, Compass,
  Coffee, Soup, Wine, Heart, CheckCircle2, ChevronRight
} from 'lucide-react';
import { RestaurantItem, GeneratedPlan } from '../types';

interface RestaurantFinderProps {
  plan: GeneratedPlan;
  onAskAboutRestaurant: (restaurant: RestaurantItem) => void;
}

const CUISINE_OPTIONS = [
  { id: 'all', label: 'جميع المطابخ' },
  { id: 'local', label: '🇸🇦 محلي وتراثي' },
  { id: 'italian', label: '🍕 إيطالي وعالمي' },
  { id: 'seafood', label: '🦐 مأكولات بحرية' },
  { id: 'grill', label: '🥩 مشاوي وشرقي' },
  { id: 'cafe', label: '☕ مقاهي ومخبوزات' },
  { id: 'healthy', label: '🥗 صحي ونباتي' },
];

const PRICE_OPTIONS = [
  { id: 'all', label: 'كافة المستويات' },
  { id: '$', label: '$ اقتصادي' },
  { id: '$$', label: '$$ متوسط' },
  { id: '$$$', label: '$$$ مميز' },
  { id: '$$$$', label: '$$$$ فاخر راقٍ' },
];

export const RestaurantFinder: React.FC<RestaurantFinderProps> = ({
  plan,
  onAskAboutRestaurant,
}) => {
  const [restaurants, setRestaurants] = useState<RestaurantItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`smarttravel_fav_rest_${plan.destination}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const extractLandmarks = () => {
    const marks: string[] = [];
    if (plan.mapPoints) {
      plan.mapPoints.forEach((p) => {
        if (p.name && !marks.includes(p.name)) {
          marks.push(p.name);
        }
      });
    }
    return marks.slice(0, 8);
  };

  const fetchRestaurants = async (cuisine = selectedCuisine, price = selectedPrice) => {
    setLoading(true);
    try {
      const landmarks = extractLandmarks();
      const res = await fetch('/api/find-restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: plan.destination,
          landmarks,
          cuisinePreference: cuisine !== 'all' ? cuisine : undefined,
          pricePreference: price !== 'all' ? price : undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.restaurants) {
          setRestaurants(data.restaurants);
        }
      }
    } catch (err) {
      console.error('Failed fetching restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [plan.destination]);

  const toggleFavorite = (id: string) => {
    const next = favorites.includes(id) ? favorites.filter((f) => f !== id) : [...favorites, id];
    setFavorites(next);
    try {
      localStorage.setItem(`smarttravel_fav_rest_${plan.destination}`, JSON.stringify(next));
    } catch (e) {
      console.error(e);
    }
  };

  // Filter local items
  const filteredRestaurants = restaurants.filter((rest) => {
    const matchesCuisine =
      selectedCuisine === 'all' ||
      (selectedCuisine === 'local' && (rest.cuisine.includes('محلي') || rest.cuisine.includes('أصيل') || rest.cuisine.includes('شعبي') || rest.cuisine.includes('تراث'))) ||
      (selectedCuisine === 'italian' && (rest.cuisine.includes('إيطالي') || rest.cuisine.includes('بيتزا') || rest.cuisine.includes('باستا') || rest.cuisine.includes('عالمي'))) ||
      (selectedCuisine === 'seafood' && (rest.cuisine.includes('بحر') || rest.cuisine.includes('سمك') || rest.cuisine.includes('جمبري'))) ||
      (selectedCuisine === 'grill' && (rest.cuisine.includes('مشاوي') || rest.cuisine.includes('شرق') || rest.cuisine.includes('لحوم') || rest.cuisine.includes('ستيك'))) ||
      (selectedCuisine === 'cafe' && (rest.cuisine.includes('مقهى') || rest.cuisine.includes('قهوة') || rest.cuisine.includes('مخبز') || rest.cuisine.includes('حلى') || rest.cuisine.includes('حلويات'))) ||
      (selectedCuisine === 'healthy' && (rest.cuisine.includes('صحي') || rest.cuisine.includes('نباتي') || rest.dietaryTags?.includes('خيارات نباتية')));

    const matchesPrice = selectedPrice === 'all' || rest.priceLevel === selectedPrice;

    const matchesQuery =
      searchQuery.trim() === '' ||
      rest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rest.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rest.addressArea.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rest.signatureDishes.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCuisine && matchesPrice && matchesQuery;
  });

  return (
    <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-5 sm:p-7 shadow-2xl shadow-black/80 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40">
              <Utensils className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-[#d4af37]">دليل الذواقة والمطاعم الذكي</span>
            <span className="text-xs text-neutral-500 font-mono">({plan.destination})</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            مطاعم ومقاهٍ قريبة من مسار رحلتك
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            مقترحات ذكية منتقاة بعناية تقع بالقرب من المعالم المحددة في جدولك، مصنفة حسب نوع المطبخ ومستوى السعر.
          </p>
        </div>

        <button
          onClick={() => fetchRestaurants(selectedCuisine, selectedPrice)}
          disabled={loading}
          className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-[#1a1a1a] hover:bg-[#262626] text-neutral-200 border border-neutral-800 hover:border-[#d4af37]/40 transition-colors cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#d4af37]' : ''}`} />
          <span>تحديث واقتراح مطاعم إضافية</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم المطعم، الطبق المميز، أو الحي..."
            className="w-full bg-[#161616] border border-neutral-800 rounded-xl pr-10 pl-4 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] transition-colors"
          />
        </div>

        {/* Cuisines Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {CUISINE_OPTIONS.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCuisine(c.id)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                selectedCuisine === c.id
                  ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/20'
                  : 'bg-[#181818] text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Price Tier Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs text-neutral-500 font-medium ml-1">مستوى السعر:</span>
          {PRICE_OPTIONS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPrice(p.id)}
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                selectedPrice === p.id
                  ? 'bg-amber-400/20 text-[#d4af37] border border-[#d4af37]/50 font-bold'
                  : 'bg-[#141414] text-neutral-400 hover:text-neutral-200 border border-neutral-800/80'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Restaurant Cards Grid */}
      {loading && restaurants.length === 0 ? (
        <div className="p-12 text-center text-neutral-400 space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-[#d4af37] mx-auto" />
          <p className="text-sm font-medium">جاري رصد أفضل المطاعم والمقاهي القريبة من جدولك في {plan.destination}...</p>
        </div>
      ) : filteredRestaurants.length === 0 ? (
        <div className="p-8 text-center bg-[#161616] border border-neutral-800 rounded-xl text-neutral-400">
          <Utensils className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
          <p className="text-sm">لم يتم العثور على مطاعم تطابق الفلاتر المحددة.</p>
          <button
            onClick={() => {
              setSelectedCuisine('all');
              setSelectedPrice('all');
              setSearchQuery('');
            }}
            className="mt-3 text-xs text-[#d4af37] hover:underline cursor-pointer font-bold"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRestaurants.map((restaurant) => {
            const isFav = favorites.includes(restaurant.id);
            return (
              <div
                key={restaurant.id}
                className="bg-[#161616] hover:bg-[#191919] border border-neutral-800 hover:border-neutral-700 rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all group"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#d4af37]/15 text-[#e5c158] border border-[#d4af37]/30">
                        {restaurant.cuisine}
                      </span>
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950/40 text-emerald-300 border border-emerald-800/40">
                        {restaurant.priceLevel} ({restaurant.priceLabel})
                      </span>
                    </div>

                    <button
                      onClick={() => toggleFavorite(restaurant.id)}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title={isFav ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>

                  {/* Name and Rating */}
                  <div>
                    <h4 className="text-base sm:text-lg font-black text-white group-hover:text-[#d4af37] transition-colors">
                      {restaurant.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{restaurant.rating}</span>
                      </div>
                      {restaurant.reviewCount && (
                        <span className="text-[11px] text-neutral-500">
                          ({restaurant.reviewCount}+ تقييم)
                        </span>
                      )}
                      <span className="text-neutral-600">•</span>
                      <span className="text-xs text-neutral-400 font-medium">
                        {restaurant.estimatedCostPerPerson}
                      </span>
                    </div>
                  </div>

                  {/* Location and Proximity */}
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <MapPin className="w-3.5 h-3.5 text-[#d4af37] flex-shrink-0" />
                    <span className="truncate">{restaurant.addressArea}</span>
                  </div>

                  {restaurant.nearLandmark && (
                    <div className="text-[11px] text-[#e5c158]/80 bg-[#1c1913] px-2.5 py-1 rounded-lg border border-[#d4af37]/20 flex items-center gap-1.5">
                      <Compass className="w-3 h-3 text-[#d4af37] flex-shrink-0" />
                      <span>قريب من: <strong className="text-white">{restaurant.nearLandmark}</strong></span>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {restaurant.description}
                  </p>

                  {/* Signature Dishes */}
                  {restaurant.signatureDishes && restaurant.signatureDishes.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-neutral-400">أشهر الأطباق والطلبات:</span>
                      <div className="flex flex-wrap gap-1">
                        {restaurant.signatureDishes.map((dish, i) => (
                          <span
                            key={i}
                            className="text-[11px] bg-[#222222] text-neutral-300 px-2 py-0.5 rounded border border-neutral-700/60"
                          >
                            🍽️ {dish}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dietary & Atmosphere tags */}
                  {restaurant.dietaryTags && restaurant.dietaryTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {restaurant.dietaryTags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-neutral-900 text-neutral-400 px-2 py-0.5 rounded-full border border-neutral-800"
                        >
                          ✓ {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                  <a
                    href={restaurant.googleMapsQuery}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#222222] hover:bg-[#2c2c2c] text-neutral-300 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                    <span>عرض على خرائط Google</span>
                  </a>

                  <button
                    onClick={() => onAskAboutRestaurant(restaurant)}
                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-[#d4af37]/15 hover:bg-[#d4af37]/25 text-[#d4af37] border border-[#d4af37]/40 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>اسأل المستشار</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

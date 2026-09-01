import React, { useState, useEffect } from 'react';
import {
  Navigation,
  MapPin,
  Compass,
  Sparkles,
  Coffee,
  Utensils,
  Landmark,
  Trees,
  Search,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Clock,
  Star,
  CheckCircle2,
  Maximize2,
  X
} from 'lucide-react';
import { NearbyGpsPlace } from '../types';
import { resolvePlaceImageUrl } from '../utils/placeImageResolver';

interface NearbyGpsExplorerProps {
  onAddPlaceToPlan?: (placeName: string, notes: string) => void;
  currentDestination?: string;
}

export const NearbyGpsExplorer: React.FC<NearbyGpsExplorerProps> = ({
  onAddPlaceToPlan,
  currentDestination = 'الرياض',
}) => {
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [gpsCoordinates, setGpsCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [detectedLocationName, setDetectedLocationName] = useState<string>('');
  const [radiusKm, setRadiusKm] = useState<number>(3);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [places, setPlaces] = useState<NearbyGpsPlace[]>([]);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activePhotoModal, setActivePhotoModal] = useState<{ name: string; url: string; highlight: string } | null>(null);
  const [addedPlaces, setAddedPlaces] = useState<Record<string, boolean>>({});

  // Trigger GPS detection
  const requestLocation = () => {
    setIsLocating(true);
    setErrorMessage(null);

    if (!navigator.geolocation) {
      setErrorMessage('متصفحك لا يدعم خاصية تحديد الموقع الجغرافي (GPS).');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setGpsCoordinates(coords);
        setIsLocating(false);
        fetchNearbyPlaces(coords.lat, coords.lng, radiusKm, selectedCategory);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsLocating(false);
        // User-friendly fallback with realistic sample coordinates based on destination or default
        setErrorMessage('تعذر الوصول لموقع GPS المباشر (يرجى السماح بالوصول للموقع من إعدادات المتصفح)، جاري الاستكشاف في محيط الوجهة الحالية.');
        const fallbackLat = 24.7136;
        const fallbackLng = 46.6753;
        setGpsCoordinates({ lat: fallbackLat, lng: fallbackLng });
        fetchNearbyPlaces(fallbackLat, fallbackLng, radiusKm, selectedCategory, currentDestination);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const fetchNearbyPlaces = async (
    lat: number,
    lng: number,
    radius: number,
    cat: string,
    locationName?: string
  ) => {
    setIsLoadingPlaces(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/nearby-places-gps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat,
          lng,
          radiusKm: radius,
          category: cat,
          userLocationName: locationName || detectedLocationName,
        }),
      });

      if (!res.ok) throw new Error('فشل جلب الأماكن المحيطة');

      const data = await res.json();
      if (data.success && Array.isArray(data.places)) {
        setPlaces(data.places);
        if (data.detectedLocation) {
          setDetectedLocationName(data.detectedLocation);
        }
      }
    } catch (err: any) {
      console.error('Error loading nearby places:', err);
      setErrorMessage('حدث خطأ أثناء البحث عن الأماكن المحيطة.');
    } finally {
      setIsLoadingPlaces(false);
    }
  };

  // Change category or radius
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    if (gpsCoordinates) {
      fetchNearbyPlaces(gpsCoordinates.lat, gpsCoordinates.lng, radiusKm, cat);
    }
  };

  const handleRadiusChange = (radius: number) => {
    setRadiusKm(radius);
    if (gpsCoordinates) {
      fetchNearbyPlaces(gpsCoordinates.lat, gpsCoordinates.lng, radius, selectedCategory);
    }
  };

  const handleAddToPlan = (place: NearbyGpsPlace) => {
    setAddedPlaces((prev) => ({ ...prev, [place.id]: true }));
    if (onAddPlaceToPlan) {
      onAddPlaceToPlan(
        place.name,
        `مكان قريب (${place.distanceText}): ${place.highlight} - التقييم ${place.rating}⭐️`
      );
    }
  };

  return (
    <div id="nearby-gps-explorer" className="w-full bg-[#080d1a] border border-[#d4af37]/35 rounded-3xl p-5 sm:p-7 shadow-[0_10px_35px_rgba(0,0,0,0.6)] space-y-6 relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d4af37]/20 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#8a6d1c] p-0.5 shadow-lg shadow-[#d4af37]/20 flex items-center justify-center flex-shrink-0">
            <div className="w-full h-full bg-[#0b1325] rounded-[14px] flex items-center justify-center text-[#d4af37]">
              <Navigation className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <span>مستكشف المحيط الجغرافي (GPS حولي)</span>
                <span className="text-sm">📍</span>
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#9eb3cf]">
              استكشف المعالم والمطاعم والكافيهات المحيطة بموقعك الحالي بالهاتف بدقة فائقة وصور توضيحية كاملة
            </p>
          </div>
        </div>

        {/* GPS Trigger Button */}
        <button
          id="btn-activate-gps"
          type="button"
          onClick={requestLocation}
          disabled={isLocating}
          className="flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#f5d061] text-[#0a1120] font-black text-xs sm:text-sm shadow-md hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        >
          {isLocating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>جاري تحديد موقعك...</span>
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4" />
              <span>{gpsCoordinates ? 'تحديث موقعي (GPS)' : 'تفعيل موقعي والبحث حولي الآن 📍'}</span>
            </>
          )}
        </button>
      </div>

      {/* GPS Location Status Banner */}
      {detectedLocationName && (
        <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#0e1930] border border-[#d4af37]/30 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5 text-white">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-[#d4af37]">الموقع المكتشف:</span>
            <span className="text-neutral-200">{detectedLocationName}</span>
          </div>
          {gpsCoordinates && (
            <span className="text-[11px] text-neutral-400 font-mono hidden md:inline">
              ({gpsCoordinates.lat.toFixed(4)}, {gpsCoordinates.lng.toFixed(4)})
            </span>
          )}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Filter Bars: Distance Radius & Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {/* Radius Filter */}
        <div className="flex items-center gap-2 bg-[#0a1221] p-2 rounded-2xl border border-neutral-800">
          <span className="text-xs text-[#9eb3cf] font-bold px-2 whitespace-nowrap">نطاق المسافة:</span>
          <div className="flex items-center gap-1.5 overflow-x-auto w-full">
            {[
              { km: 1, label: '1 كم (مشياً)' },
              { km: 3, label: '3 كم (قريب)' },
              { km: 5, label: '5 كم' },
              { km: 10, label: '10 كم (سيارة)' },
            ].map((r) => (
              <button
                key={r.km}
                type="button"
                onClick={() => handleRadiusChange(r.km)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  radiusKm === r.km
                    ? 'bg-[#d4af37] text-black shadow-sm'
                    : 'bg-[#111c33] text-neutral-300 hover:text-white'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto bg-[#0a1221] p-2 rounded-2xl border border-neutral-800 scrollbar-none">
          {[
            { id: 'all', label: 'الكل', icon: Sparkles },
            { id: 'landmark', label: 'معالم وآثار', icon: Landmark },
            { id: 'cafe', label: 'كافيهات ومقاهي', icon: Coffee },
            { id: 'restaurant', label: 'مطاعم شهيرة', icon: Utensils },
            { id: 'nature', label: 'طبيعة وحدائق', icon: Trees },
          ].map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#d4af37]/20 border border-[#d4af37] text-[#f5d061]'
                    : 'bg-[#111c33] text-neutral-400 hover:text-white border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading State */}
      {isLoadingPlaces && (
        <div className="flex flex-col items-center justify-center py-12 space-y-3">
          <RefreshCw className="w-8 h-8 text-[#d4af37] animate-spin" />
          <p className="text-sm font-bold text-white">جاري مسح محيطك الجغرافي وجلب الصور والتقييمات الحية...</p>
          <p className="text-xs text-[#9eb3cf]">يتم تنظيم النتائج بالأهمية ثم التفاصيل</p>
        </div>
      )}

      {/* Empty State before GPS */}
      {!isLoadingPlaces && places.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center rounded-2xl bg-[#0a1221] border border-dashed border-[#d4af37]/30 space-y-3">
          <div className="w-14 h-14 rounded-full bg-[#121e38] flex items-center justify-center text-[#d4af37]">
            <Compass className="w-7 h-7" />
          </div>
          <h4 className="text-base font-bold text-white">ابدأ استكشاف الأماكن والمعالم حول موقعك الحالي</h4>
          <p className="text-xs text-[#9eb3cf] max-w-md">
            اضغط على زر <strong className="text-[#d4af37]">تفعيل موقعي والبحث حولي</strong> لاستعراض المقاهي والمطاعم والمعالم في محيطك مع صورها الحية وتقييماتها المنظمة.
          </p>
          <button
            type="button"
            onClick={requestLocation}
            className="mt-2 px-5 py-2.5 rounded-xl bg-[#d4af37] text-black font-bold text-xs hover:bg-[#e6c24d] transition-all cursor-pointer"
          >
            تحديد موقعي الآن 📍
          </button>
        </div>
      )}

      {/* Places Cards Grid - Strict Hierarchy (الأهم أولاً ثم التفاصيل ثم الصور) */}
      {!isLoadingPlaces && places.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {places.map((place) => {
            const isAdded = !!addedPlaces[place.id];
            const resolvedImg = resolvePlaceImageUrl(place.name, detectedLocationName || currentDestination, place.category);

            return (
              <div
                key={place.id}
                className="group flex flex-col justify-between rounded-2xl bg-[#0c1424] border border-[#d4af37]/25 hover:border-[#d4af37] shadow-lg hover:shadow-[0_0_25px_rgba(212,175,55,0.2)] transition-all overflow-hidden"
              >
                {/* Photo Header with Category Badge & Distance */}
                <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
                  <img
                    src={place.imageUrl || resolvedImg}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = resolvedImg;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c1424] via-transparent to-black/50" />

                  {/* Distance Pill & Category Badge */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[11px] font-black text-[#f5d061] border border-[#d4af37]/40 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#d4af37]" />
                      <span>{place.distanceText}</span>
                    </span>
                  </div>

                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-1 rounded-full bg-[#0a1221]/80 backdrop-blur-md text-[11px] font-bold text-white border border-neutral-700">
                      {place.categoryLabel || place.category}
                    </span>
                  </div>

                  {/* Full Photo Inspection Button */}
                  <button
                    type="button"
                    onClick={() => setActivePhotoModal({ name: place.name, url: place.imageUrl || resolvedImg, highlight: place.highlight })}
                    className="absolute bottom-2.5 left-2.5 p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white backdrop-blur-sm transition-all cursor-pointer"
                    title="تكبير الصورة ومشاهدة التفاصيل"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Content Section - Strict Hierarchy */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Level 1: الأهم - الاسم والميزة الكبرى والتقييم */}
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-base font-black text-white group-hover:text-[#f5d061] transition-colors line-clamp-1">
                        {place.name}
                      </h4>
                      <div className="flex items-center gap-1 bg-[#111c33] px-2 py-0.5 rounded-lg border border-amber-500/30 flex-shrink-0">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-black text-amber-300">{place.rating}</span>
                      </div>
                    </div>

                    {/* Level 1.5: الزبدة والميزة الأهم */}
                    <div className="mt-2 p-2 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/25 text-xs text-[#f5d061] font-bold flex items-start gap-1.5">
                      <span className="text-amber-400 mt-0.5">⭐️</span>
                      <span className="line-clamp-2">{place.highlight}</span>
                    </div>

                    {/* Level 2: تفاصيل عملية (العنوان، التوقيت، الأسعار) */}
                    <p className="mt-2 text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                      {place.description}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400 border-t border-neutral-800/80 pt-2.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#d4af37]" />
                        <span>{place.openingHours || '09:00 ص - 11:00 م'}</span>
                      </span>
                      <span className="font-bold text-neutral-300">
                        {place.priceLabel || place.priceLevel || 'متوسط التكلفة'}
                      </span>
                    </div>
                  </div>

                  {/* Level 3: الإجراءات السريعة (خرائط قوقل + دمج في الخطة) */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800">
                    <a
                      href={place.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#111c33] hover:bg-[#182645] text-neutral-200 text-xs font-bold border border-neutral-700 transition-all text-center"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>الموقع بالخريطة</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleAddToPlan(place)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#d4af37] text-black hover:bg-[#e6c24d]'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>تمت الإضافة</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>إضافة للخطة</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Fullscreen Photo Modal for Inspection */}
      {activePhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="relative max-w-3xl w-full bg-[#0a1221] border border-[#d4af37]/40 rounded-3xl overflow-hidden shadow-2xl">
            <button
              type="button"
              onClick={() => setActivePhotoModal(null)}
              className="absolute top-4 left-4 z-10 p-2 rounded-full bg-black/70 text-white hover:bg-black transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-[16/10] w-full bg-black relative">
              <img
                src={activePhotoModal.url}
                alt={activePhotoModal.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-5 space-y-2">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>{activePhotoModal.name}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 text-[#f5d061] border border-[#d4af37]/30">
                  صورة حقيقية واضحة
                </span>
              </h3>
              <p className="text-xs text-[#9eb3cf]">{activePhotoModal.highlight}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

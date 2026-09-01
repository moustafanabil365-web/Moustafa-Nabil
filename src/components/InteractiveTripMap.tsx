import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Map as MapIcon, Layers, Navigation, Gem, Hotel, Utensils, 
  MapPin, Train, Sparkles, Compass, ExternalLink, Maximize2, 
  Minimize2, Moon, Sun, CheckCircle2, ChevronRight, MessageCircle,
  Mountain, Zap
} from 'lucide-react';
import { GeneratedPlan, MapPoint, MapRouteLeg } from '../types';
import { extractMapPointsFromPlan } from '../utils/mapUtils';

interface InteractiveTripMapProps {
  plan: GeneratedPlan;
  onAskAboutLocation?: (locationName: string, category?: string) => void;
  onSwitchTo3D?: () => void;
  onSelectBooking?: (locationName: string) => void;
}

type MapLayerTheme = 'dark' | 'voyager';

export const InteractiveTripMap: React.FC<InteractiveTripMapProps> = ({
  plan,
  onAskAboutLocation,
  onSwitchTo3D,
  onSelectBooking,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const polylinesLayerRef = useRef<L.LayerGroup | null>(null);

  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [mapTheme, setMapTheme] = useState<MapLayerTheme>('dark');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isMapReady, setIsMapReady] = useState<boolean>(false);

  // Extract map points and route legs from plan
  const { points, routeLegs, center } = useMemo(() => {
    return extractMapPointsFromPlan(
      plan.destination,
      plan.itineraryMarkdown,
      plan.localExperiences,
      plan.constraints.cityStops,
      plan.constraints.accommodationArea
    );
  }, [plan]);

  // Unique list of days available for filter
  const dayIndices = useMemo(() => {
    const days = new Set<number>();
    points.forEach((p) => {
      if (p.dayIndex) days.add(p.dayIndex);
    });
    return Array.from(days).sort((a, b) => a - b);
  }, [points]);

  // Filtered points based on selection
  const filteredPoints = useMemo(() => {
    if (selectedFilter === 'all') return points;
    if (selectedFilter === 'gems') return points.filter((p) => p.category === 'gem');
    if (selectedFilter === 'hotels') return points.filter((p) => p.category === 'hotel');
    if (selectedFilter === 'city_stops') return points.filter((p) => p.category === 'city_stop');
    if (selectedFilter.startsWith('day-')) {
      const dayNum = parseInt(selectedFilter.replace('day-', ''), 10);
      return points.filter((p) => p.dayIndex === dayNum || p.category === 'hotel');
    }
    return points;
  }, [points, selectedFilter]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy existing instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [center.lat, center.lng],
      zoom: center.zoom || 12,
      zoomControl: false,
      attributionControl: false,
    });

    // Add custom zoom control on top-left
    L.control.zoom({ position: 'topleft' }).addTo(map);

    // Attribution on bottom-left
    L.control.attribution({ position: 'bottomleft', prefix: false })
      .addAttribution('&copy; <a href="https://carto.com/" target="_blank">CARTO</a> &copy; OpenStreetMap')
      .addTo(map);

    mapInstanceRef.current = map;
    markersLayerRef.current = L.layerGroup().addTo(map);
    polylinesLayerRef.current = L.layerGroup().addTo(map);

    setIsMapReady(true);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center.lat, center.lng, center.zoom]);

  // Update Tile Layer when mapTheme changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    
    // Remove previous tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    const tileUrl =
      mapTheme === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    const tileLayer = L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: 'abcd',
    });

    tileLayer.addTo(map);
  }, [mapTheme, isMapReady]);

  // Render Markers and Polylines
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !polylinesLayerRef.current) return;

    const markersLayer = markersLayerRef.current;
    const polylinesLayer = polylinesLayerRef.current;

    markersLayer.clearLayers();
    polylinesLayer.clearLayers();

    if (filteredPoints.length === 0) return;

    const bounds = L.latLngBounds([]);

    // 1. Render Markers
    filteredPoints.forEach((point, index) => {
      const latLng: [number, number] = [point.lat, point.lng];
      bounds.extend(latLng);

      // Icon determination based on category
      let iconColor = '#d4af37'; // gold default
      let bgStyle = 'background: #181818; border: 2px solid #d4af37; color: #d4af37;';
      let iconSymbol = '📍';

      if (point.category === 'gem') {
        iconColor = '#fbbf24';
        bgStyle = 'background: #231d09; border: 2px solid #fbbf24; color: #fbbf24; box-shadow: 0 0 10px rgba(251,191,36,0.5);';
        iconSymbol = '💎';
      } else if (point.category === 'hotel') {
        iconColor = '#60a5fa';
        bgStyle = 'background: #0f172a; border: 2px solid #60a5fa; color: #60a5fa;';
        iconSymbol = '🏨';
      } else if (point.category === 'food') {
        iconColor = '#f87171';
        bgStyle = 'background: #2a0f0f; border: 2px solid #f87171; color: #f87171;';
        iconSymbol = '🍽️';
      } else if (point.category === 'city_stop') {
        iconColor = '#a855f7';
        bgStyle = 'background: #2e1065; border: 2px solid #c084fc; color: #f3e8ff; box-shadow: 0 0 12px rgba(192,132,252,0.6);';
        iconSymbol = '🚆';
      } else if (point.dayIndex) {
        iconSymbol = `${point.dayIndex}`;
      }

      const customDivIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="${bgStyle} width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: bold; cursor: pointer; transition: transform 0.2s;" class="hover:scale-110">
            ${iconSymbol}
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
        popupAnchor: [0, -18],
      });

      const marker = L.marker(latLng, { icon: customDivIcon });

      // Rich styled HTML popup
      const popupHtml = `
        <div dir="rtl" style="font-family: inherit; min-width: 200px; max-width: 260px; color: #fff; background: #121212; padding: 4px; border-radius: 8px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 6px;">
            <span style="background: rgba(212,175,55,0.15); color: #d4af37; border: 1px solid rgba(212,175,55,0.3); font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px;">
              ${point.categoryLabel || 'معلم سياحي'}
            </span>
            ${point.recommendedTime ? `<span style="font-size: 10px; color: #9ca3af;">⏱️ ${point.recommendedTime}</span>` : ''}
          </div>
          <h4 style="font-size: 13px; font-weight: bold; color: #ffffff; margin: 0 0 4px 0; line-height: 1.3;">
            ${point.name}
          </h4>
          ${point.description ? `<p style="font-size: 11px; color: #d1d5db; margin: 0 0 8px 0; line-height: 1.4;">${point.description.substring(0, 120)}${point.description.length > 120 ? '...' : ''}</p>` : ''}
          <div style="display: flex; align-items: center; gap: 6px; padding-top: 6px; border-top: 1px solid #262626;">
            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(point.name + ' ' + plan.destination)}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 4px; font-size: 10px; font-weight: bold; color: #d4af37; text-decoration: none;">
              <span>فتح الاتجاهات 📍</span>
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        className: 'dark-leaflet-popup',
      });

      marker.on('click', () => {
        setSelectedPoint(point);
      });

      markersLayer.addLayer(marker);
    });

    // 2. Render Route Polylines
    // Case A: Multi-City route connections
    if (plan.constraints.isMultiCity && routeLegs.length > 0 && (selectedFilter === 'all' || selectedFilter === 'city_stops')) {
      routeLegs.forEach((leg) => {
        const poly = L.polyline([leg.fromCoords, leg.toCoords], {
          color: '#c084fc',
          weight: 3.5,
          dashArray: '8, 8',
          opacity: 0.85,
        });
        poly.bindTooltip(`مسار التنقل: من ${leg.fromCity} إلى ${leg.toCity}`, {
          direction: 'center',
          className: 'dark-leaflet-tooltip',
        });
        polylinesLayer.addLayer(poly);
      });
    }

    // Case B: Day Activity Sequential Lines
    if (selectedFilter.startsWith('day-')) {
      const dayNum = parseInt(selectedFilter.replace('day-', ''), 10);
      const dayActivities = filteredPoints
        .filter((p) => p.dayIndex === dayNum)
        .sort((a, b) => a.id.localeCompare(b.id));

      if (dayActivities.length >= 2) {
        const latLngs: [number, number][] = dayActivities.map((p) => [p.lat, p.lng]);
        const dayLine = L.polyline(latLngs, {
          color: '#d4af37',
          weight: 3,
          dashArray: '6, 6',
          opacity: 0.9,
        });
        polylinesLayer.addLayer(dayLine);
      }
    }

    // Fit Bounds gracefully
    if (bounds.isValid()) {
      mapInstanceRef.current.fitBounds(bounds, {
        padding: [45, 45],
        maxZoom: 15,
      });
    }
  }, [filteredPoints, routeLegs, selectedFilter, plan]);

  // Recenter map handler
  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    if (filteredPoints.length > 0) {
      const bounds = L.latLngBounds(filteredPoints.map((p) => [p.lat, p.lng]));
      if (bounds.isValid()) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [45, 45], maxZoom: 15 });
        return;
      }
    }
    mapInstanceRef.current.setView([center.lat, center.lng], center.zoom || 12);
  };

  const handleSelectPointCard = (p: MapPoint) => {
    setSelectedPoint(p);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([p.lat, p.lng], 15, { animate: true });
    }
  };

  return (
    <div className="bg-[#111111] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden transition-all space-y-0">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-neutral-800/90 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#141414]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shadow-md shadow-[#d4af37]/10">
            <MapIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white">
                خريطة المسار والمعالم التفاعلية (Interactive Route Map)
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
                LEAFLET LIVE
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              استكشف كافة المحطات، المعالم السياحية، المقاهي والتجارب الأصيلة الموزعة جغرافياً في {plan.destination}.
            </p>
          </div>
        </div>

        {/* Map Control Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Switch to 3D Terrain Map */}
          {onSwitchTo3D && (
            <button
              type="button"
              onClick={onSwitchTo3D}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#241a08] hover:bg-[#33240a] text-[#d4af37] border border-[#d4af37]/60 text-xs font-bold transition-all cursor-pointer shadow-md"
              title="الانتقال إلى خريطة التضاريس والارتفاعات 3D"
            >
              <Mountain className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>خريطة التضاريس 3D 🌐</span>
            </button>
          )}

          {/* Tile Layer Toggle */}
          <button
            type="button"
            onClick={() => setMapTheme((t) => (t === 'dark' ? 'voyager' : 'dark'))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e1e1e] hover:bg-[#282828] text-xs font-semibold text-neutral-300 border border-neutral-700 transition-all cursor-pointer"
            title="تبديل مظهر الخريطة"
          >
            {mapTheme === 'dark' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>الوضع الداكن</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>الوضع المضيء</span>
              </>
            )}
          </button>

          {/* Recenter Button */}
          <button
            type="button"
            onClick={handleRecenter}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e1e1e] hover:bg-[#282828] text-xs font-semibold text-neutral-300 border border-neutral-700 transition-all cursor-pointer"
            title="إعادة ضبط زاوية الخريطة"
          >
            <Navigation className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>ملاءمة العرض</span>
          </button>

          {/* Full Height Toggle */}
          <button
            type="button"
            onClick={() => setIsExpanded((e) => !e)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e1e1e] hover:bg-[#282828] text-xs font-semibold text-neutral-300 border border-neutral-700 transition-all cursor-pointer"
            title="توسيع ارتفاع الخريطة"
          >
            {isExpanded ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-neutral-400" />
                <span>تصغير</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-neutral-400" />
                <span>توسيع</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="px-4 py-2.5 bg-[#0e0e0e] border-b border-neutral-800 flex items-center gap-1.5 overflow-x-auto text-xs">
        <button
          type="button"
          onClick={() => setSelectedFilter('all')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
            selectedFilter === 'all'
              ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/20'
              : 'bg-[#181818] text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>كافة المعالم ({points.length})</span>
        </button>

        {/* Day-by-day filters */}
        {dayIndices.map((d) => (
          <button
            key={`day-${d}`}
            type="button"
            onClick={() => setSelectedFilter(`day-${d}`)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedFilter === `day-${d}`
                ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/20'
                : 'bg-[#181818] text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <span>🗓️ مسار اليوم {d}</span>
          </button>
        ))}

        {/* Local Hidden Gems Filter */}
        {points.some((p) => p.category === 'gem') && (
          <button
            type="button"
            onClick={() => setSelectedFilter('gems')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedFilter === 'gems'
                ? 'bg-[#fbbf24] text-black shadow-md shadow-[#fbbf24]/20'
                : 'bg-[#181818] text-amber-300 hover:text-white border border-neutral-800'
            }`}
          >
            <Gem className="w-3.5 h-3.5" />
            <span>تجارب أصيلة</span>
          </button>
        )}

        {/* Hotels / Accommodations Filter */}
        {points.some((p) => p.category === 'hotel') && (
          <button
            type="button"
            onClick={() => setSelectedFilter('hotels')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedFilter === 'hotels'
                ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                : 'bg-[#181818] text-blue-300 hover:text-white border border-neutral-800'
            }`}
          >
            <Hotel className="w-3.5 h-3.5" />
            <span>مقر الإقامة</span>
          </button>
        )}

        {/* Multi-City Stops Filter */}
        {plan.constraints.isMultiCity && (
          <button
            type="button"
            onClick={() => setSelectedFilter('city_stops')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedFilter === 'city_stops'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'bg-[#181818] text-purple-300 hover:text-white border border-neutral-800'
            }`}
          >
            <Train className="w-3.5 h-3.5" />
            <span>محطات المدن ({plan.constraints.cityStops?.length || 0})</span>
          </button>
        )}
      </div>

      {/* Map Container Element */}
      <div className="relative w-full">
        <div
          ref={mapContainerRef}
          className={`w-full transition-all duration-300 bg-[#0a0a0a] ${
            isExpanded ? 'h-[620px]' : 'h-[440px] sm:h-[480px]'
          }`}
          style={{ zIndex: 1 }}
        />

        {/* Map Legend Overlay */}
        <div className="absolute bottom-3 right-3 z-[10] bg-[#121212]/90 backdrop-blur-md border border-neutral-700/80 rounded-xl p-2.5 shadow-xl text-[11px] space-y-1.5 pointer-events-auto">
          <div className="text-neutral-400 font-bold mb-1 border-b border-neutral-800 pb-1 flex items-center gap-1">
            <Compass className="w-3 h-3 text-[#d4af37]" />
            <span>دليل الرموز:</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-300">
            <span className="w-4 h-4 rounded-full bg-[#181818] border border-[#d4af37] text-[#d4af37] flex items-center justify-center text-[9px] font-bold">1</span>
            <span>أنشطة الأيام المقترحة</span>
          </div>
          <div className="flex items-center gap-2 text-amber-300">
            <span className="w-4 h-4 rounded-full bg-[#231d09] border border-[#fbbf24] text-[#fbbf24] flex items-center justify-center text-[9px]">💎</span>
            <span>تجارب محلية غير سياحية</span>
          </div>
          <div className="flex items-center gap-2 text-blue-300">
            <span className="w-4 h-4 rounded-full bg-[#0f172a] border border-[#60a5fa] text-[#60a5fa] flex items-center justify-center text-[9px]">🏨</span>
            <span>الفندق ومقر الإقامة</span>
          </div>
          {plan.constraints.isMultiCity && (
            <div className="flex items-center gap-2 text-purple-300">
              <span className="w-4 h-4 rounded-full bg-[#2e1065] border border-[#c084fc] text-[#f3e8ff] flex items-center justify-center text-[9px]">🚆</span>
              <span>محطات التنقل بين المدن</span>
            </div>
          )}
        </div>
      </div>

      {/* Selected Location Detail & Action Card */}
      {selectedPoint && (
        <div className="p-4 sm:p-5 bg-[#141414] border-t border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30 font-bold">
                {selectedPoint.categoryLabel || 'معلم مميز'}
              </span>
              {selectedPoint.recommendedTime && (
                <span className="text-xs text-neutral-400">⏱️ التوقيت الموصى به: {selectedPoint.recommendedTime}</span>
              )}
            </div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#d4af37] flex-shrink-0" />
              {selectedPoint.name}
            </h4>
            {selectedPoint.description && (
              <p className="text-xs text-neutral-300 leading-relaxed max-w-3xl">
                {selectedPoint.description}
              </p>
            )}
            {selectedPoint.insiderTip && (
              <div className="text-[11px] text-amber-300/90 font-medium">
                💡 <strong className="text-amber-200">نصيحة حصرية:</strong> {selectedPoint.insiderTip}
              </div>
            )}
          </div>

          {/* Action Buttons for Selected Point */}
          <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
            {onSelectBooking && (
              <button
                type="button"
                onClick={() => onSelectBooking(selectedPoint.name)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs transition-all shadow-md cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>حجز التذاكر فورياً</span>
              </button>
            )}

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPoint.name + ' ' + plan.destination)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#222222] hover:bg-[#2c2c2c] text-white border border-neutral-700 text-xs font-bold transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>الاتجاهات في Google Maps</span>
            </a>

            {onAskAboutLocation && (
              <button
                type="button"
                onClick={() => onAskAboutLocation(selectedPoint.name, selectedPoint.categoryLabel)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-black font-extrabold text-xs transition-all shadow-md shadow-[#d4af37]/20 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>استشر الذكاء الاصطناعي حول الموقع</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quick Points Carousel (Bottom scroll) */}
      <div className="p-3 bg-[#0d0d0d] border-t border-neutral-800/80">
        <div className="text-[11px] text-neutral-400 font-bold mb-2 flex items-center justify-between">
          <span>المعالم والمحطات المعروضة ({filteredPoints.length}):</span>
          <span className="text-neutral-500 font-normal">اضغط على أي بطاقة لتكبيرها على الخريطة</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5">
          {filteredPoints.map((p) => {
            const isSelected = selectedPoint?.id === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPointCard(p)}
                className={`p-2.5 rounded-xl border text-right min-w-[190px] max-w-[220px] flex-shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1e1a0e] border-[#d4af37] ring-1 ring-[#d4af37]/50'
                    : 'bg-[#141414] border-neutral-800 hover:border-neutral-700 text-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1">
                  <span className="truncate max-w-[120px] text-[#d4af37] font-bold">{p.categoryLabel || 'معلم'}</span>
                  {p.dayIndex ? <span className="text-neutral-400">يوم {p.dayIndex}</span> : null}
                </div>
                <div className="text-xs font-bold text-white truncate">{p.name}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

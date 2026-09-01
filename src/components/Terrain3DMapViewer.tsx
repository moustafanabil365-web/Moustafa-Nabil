import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { 
  Compass, Mountain, Layers, Eye, Play, Pause, RotateCw, 
  MapPin, Navigation, Sparkles, ExternalLink, MessageCircle, 
  Maximize2, Minimize2, ArrowUpRight, CheckCircle2, Sliders,
  Zap, Info, Sun, Moon, Globe
} from 'lucide-react';
import { GeneratedPlan, MapPoint } from '../types';
import { extractMapPointsFromPlan } from '../utils/mapUtils';
import { generateActivityBookingLinks } from '../utils/bookingUtils';

interface Terrain3DMapViewerProps {
  plan: GeneratedPlan;
  onAskAboutLocation?: (locationName: string, category?: string) => void;
  onSelectBooking?: (activityTitle: string) => void;
}

type Map3DStyleType = 'terrain_topo' | 'satellite_3d' | 'dark_cyber' | 'outdoor_relief';

export const Terrain3DMapViewer: React.FC<Terrain3DMapViewerProps> = ({
  plan,
  onAskAboutLocation,
  onSelectBooking,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const tourIntervalRef = useRef<any>(null);

  const [activeStyle, setActiveStyle] = useState<Map3DStyleType>('terrain_topo');
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('all');
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [isPlayingTour, setIsPlayingTour] = useState<boolean>(false);
  const [currentTourIndex, setCurrentTourIndex] = useState<number>(0);
  const [terrainExaggeration, setTerrainExaggeration] = useState<number>(1.5);
  const [cameraPitch, setCameraPitch] = useState<number>(60);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);

  // Extract map points & route legs
  const { points, center } = useMemo(() => {
    return extractMapPointsFromPlan(
      plan.destination,
      plan.itineraryMarkdown,
      plan.localExperiences,
      plan.constraints.cityStops,
      plan.constraints.accommodationArea
    );
  }, [plan]);

  // Unique list of days
  const dayNumbers = useMemo(() => {
    const set = new Set<number>();
    points.forEach((p) => {
      if (p.dayIndex) set.add(p.dayIndex);
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [points]);

  // Filtered points by day
  const filteredPoints = useMemo(() => {
    if (selectedDayFilter === 'all') return points;
    const dayNum = parseInt(selectedDayFilter, 10);
    return points.filter((p) => p.dayIndex === dayNum || p.category === 'hotel');
  }, [points, selectedDayFilter]);

  // Get style configuration for MapLibre
  const getStyleDefinition = (styleType: Map3DStyleType): maplibregl.StyleSpecification => {
    const terrainSource = {
      type: 'raster-dem' as const,
      tiles: ['https://demotiles.maplibre.org/terrain-tiles/{z}/{x}/{y}.png'],
      tileSize: 256,
      maxzoom: 14,
    };

    if (styleType === 'satellite_3d') {
      return {
        version: 8,
        sources: {
          satellite: {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            ],
            tileSize: 256,
            attribution: 'Esri, Maxar, Earthstar Geographics',
          },
          terrainSource: terrainSource,
        },
        layers: [
          {
            id: 'satellite-layer',
            type: 'raster',
            source: 'satellite',
            minzoom: 0,
            maxzoom: 20,
          },
        ],
        terrain: {
          source: 'terrainSource',
          exaggeration: terrainExaggeration,
        },
      };
    }

    if (styleType === 'dark_cyber') {
      return {
        version: 8,
        sources: {
          cartoDark: {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
              'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
            ],
            tileSize: 256,
            attribution: '&copy; CARTO &copy; OpenStreetMap contributors',
          },
          terrainSource: terrainSource,
        },
        layers: [
          {
            id: 'carto-dark-layer',
            type: 'raster',
            source: 'cartoDark',
            minzoom: 0,
            maxzoom: 20,
          },
        ],
        terrain: {
          source: 'terrainSource',
          exaggeration: terrainExaggeration,
        },
      };
    }

    if (styleType === 'outdoor_relief') {
      return {
        version: 8,
        sources: {
          cartoVoyager: {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
              'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
            ],
            tileSize: 256,
            attribution: '&copy; CARTO &copy; OpenStreetMap contributors',
          },
          terrainSource: terrainSource,
        },
        layers: [
          {
            id: 'carto-voyager-layer',
            type: 'raster',
            source: 'cartoVoyager',
            minzoom: 0,
            maxzoom: 20,
          },
        ],
        terrain: {
          source: 'terrainSource',
          exaggeration: terrainExaggeration,
        },
      };
    }

    // Default: Topographic & Relief Terrain
    return {
      version: 8,
      sources: {
        openTopo: {
          type: 'raster',
          tiles: [
            'https://a.tile.opentopomap.org/{z}/{x}/{y}.png',
            'https://b.tile.opentopomap.org/{z}/{x}/{y}.png',
            'https://c.tile.opentopomap.org/{z}/{x}/{y}.png',
          ],
          tileSize: 256,
          attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap',
        },
        terrainSource: terrainSource,
      },
      layers: [
        {
          id: 'opentopo-layer',
          type: 'raster',
          source: 'openTopo',
          minzoom: 0,
          maxzoom: 17,
        },
      ],
      terrain: {
        source: 'terrainSource',
        exaggeration: terrainExaggeration,
      },
    };
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: getStyleDefinition(activeStyle),
      center: [center.lng, center.lat],
      zoom: 12.5,
      pitch: cameraPitch,
      bearing: -15,
      maxPitch: 85,
      attributionControl: false,
    });

    // Add navigation controls (pitch, rotate, zoom)
    map.addControl(
      new maplibregl.NavigationControl({
        visualizePitch: true,
        showCompass: true,
        showZoom: true,
      }),
      'top-left'
    );

    map.on('load', () => {
      setIsMapLoaded(true);
      addRouteAndMarkers(map);
    });

    mapRef.current = map;

    return () => {
      if (tourIntervalRef.current) clearInterval(tourIntervalRef.current);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [activeStyle]);

  // Update markers and route lines when filtered points change
  const addRouteAndMarkers = (map: maplibregl.Map) => {
    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Remove existing route layers/sources if present
    if (map.getLayer('3d-route-line-glow')) map.removeLayer('3d-route-line-glow');
    if (map.getLayer('3d-route-line')) map.removeLayer('3d-route-line');
    if (map.getSource('3d-route-source')) map.removeSource('3d-route-source');

    if (filteredPoints.length === 0) return;

    // Build 3D Route Coordinates
    const coordinates = filteredPoints.map((p) => [p.lng, p.lat]);

    if (coordinates.length >= 2) {
      map.addSource('3d-route-source', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordinates,
          },
        },
      });

      // Add Glowing background line
      map.addLayer({
        id: '3d-route-line-glow',
        type: 'line',
        source: '3d-route-source',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#d4af37',
          'line-width': 8,
          'line-opacity': 0.4,
          'line-blur': 4,
        },
      });

      // Add Sharp primary route line
      map.addLayer({
        id: '3d-route-line',
        type: 'line',
        source: '3d-route-source',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#f5d77f',
          'line-width': 3.5,
          'line-opacity': 0.95,
          'line-dasharray': [2, 1],
        },
      });
    }

    // Add 3D Elevated Pin Markers
    filteredPoints.forEach((point, idx) => {
      const el = document.createElement('div');
      el.className = 'group cursor-pointer relative';

      const isHotel = point.category === 'hotel';
      const isGem = point.category === 'gem';
      const pinColor = isHotel ? 'bg-amber-600' : isGem ? 'bg-purple-600' : 'bg-[#d4af37]';
      const iconEmoji = isHotel ? '🏨' : isGem ? '💎' : '📍';

      el.innerHTML = `
        <div class="flex flex-col items-center transform transition-all duration-300 hover:scale-125 hover:-translate-y-2">
          <div class="px-2 py-1 rounded-md text-[10px] font-black text-black ${pinColor} shadow-lg shadow-black/80 flex items-center gap-1 whitespace-nowrap border border-white/40">
            <span>${point.dayIndex ? `يوم ${point.dayIndex}` : ''}</span>
            <span>${iconEmoji}</span>
            <span class="max-w-[100px] truncate">${point.name}</span>
          </div>
          <div class="w-2 h-2 rotate-45 ${pinColor} -mt-1 shadow"></div>
          <div class="w-3 h-1 bg-black/60 rounded-full blur-[1px] mt-0.5"></div>
        </div>
      `;

      el.addEventListener('click', () => {
        flyToPoint(point);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([point.lng, point.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });
  };

  // Re-run markers on filter changes
  useEffect(() => {
    if (mapRef.current && isMapLoaded) {
      addRouteAndMarkers(mapRef.current);
    }
  }, [filteredPoints, isMapLoaded]);

  // Fly camera smoothly to a 3D point
  const flyToPoint = (point: MapPoint) => {
    setSelectedPoint(point);
    if (!mapRef.current) return;

    mapRef.current.flyTo({
      center: [point.lng, point.lat],
      zoom: 15.2,
      pitch: 65,
      bearing: Math.floor(Math.random() * 60) - 30,
      speed: 1.1,
      curve: 1.4,
      essential: true,
    });
  };

  // 3D Auto Flythrough Tour
  const toggleAutoTour = () => {
    if (isPlayingTour) {
      setIsPlayingTour(false);
      if (tourIntervalRef.current) clearInterval(tourIntervalRef.current);
    } else {
      setIsPlayingTour(true);
      if (filteredPoints.length === 0) return;

      let idx = currentTourIndex;
      flyToPoint(filteredPoints[idx]);

      tourIntervalRef.current = setInterval(() => {
        idx = (idx + 1) % filteredPoints.length;
        setCurrentTourIndex(idx);
        flyToPoint(filteredPoints[idx]);
      }, 5500);
    }
  };

  // Change pitch dynamically
  const handlePitchChange = (pitch: number) => {
    setCameraPitch(pitch);
    if (mapRef.current) {
      mapRef.current.setPitch(pitch);
    }
  };

  // Rotate 3D camera 360 degrees
  const rotateCamera360 = () => {
    if (!mapRef.current) return;
    const currentBearing = mapRef.current.getBearing();
    mapRef.current.easeTo({
      bearing: currentBearing + 90,
      duration: 1200,
      pitch: 65,
    });
  };

  // Reset to full overview
  const resetOverview = () => {
    if (!mapRef.current) return;
    setSelectedPoint(null);
    mapRef.current.flyTo({
      center: [center.lng, center.lat],
      zoom: 12,
      pitch: 50,
      bearing: 0,
      speed: 1.2,
    });
  };

  return (
    <div className={`space-y-4 ${isExpanded ? 'fixed inset-0 z-50 bg-[#0a0a0a] p-4 sm:p-6 overflow-y-auto' : ''}`}>
      {/* Top Header & 3D Visual Controls */}
      <div className="bg-[#141414] border border-neutral-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-full bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 text-xs font-black flex items-center gap-1.5">
              <Mountain className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>خريطة التضاريس ثلاثية الأبعاد (3D Elevation & Terrain)</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-blue-950/40 text-blue-300 border border-blue-500/30 text-[11px] font-bold">
              {filteredPoints.length} محطات ومعالم نشطة
            </span>
          </div>
          <p className="text-xs text-neutral-400">
            استكشف تضاريس {plan.destination} بارتفاعات حقيقية، مسارات ثلاثية الأبعاد، وجولات طيران افتراضية.
          </p>
        </div>

        {/* 3D Visual Style Selector & Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-[#1a1a1a] p-1 rounded-xl border border-neutral-800 text-xs">
            <button
              onClick={() => setActiveStyle('terrain_topo')}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeStyle === 'terrain_topo'
                  ? 'bg-[#d4af37] text-black shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="تضاريس طوبوغرافية"
            >
              <Mountain className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">طوبوغرافي</span>
            </button>

            <button
              onClick={() => setActiveStyle('satellite_3d')}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeStyle === 'satellite_3d'
                  ? 'bg-[#d4af37] text-black shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="قمر صناعي 3D"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">قمر صناعي</span>
            </button>

            <button
              onClick={() => setActiveStyle('dark_cyber')}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeStyle === 'dark_cyber'
                  ? 'bg-[#d4af37] text-black shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="ليلي غامر"
            >
              <Moon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ليلي</span>
            </button>

            <button
              onClick={() => setActiveStyle('outdoor_relief')}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeStyle === 'outdoor_relief'
                  ? 'bg-[#d4af37] text-black shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="نهاري استكشافي"
            >
              <Sun className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">استكشافي</span>
            </button>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] text-neutral-300 border border-neutral-700 transition-colors cursor-pointer"
            title={isExpanded ? 'تصغير الشاشة' : 'تكبير ملء الشاشة'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Day Filter & Flight Tour Action Bar */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedDayFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedDayFilter === 'all'
                ? 'bg-[#d4af37] text-black shadow-md'
                : 'bg-[#181818] text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            كل المسارات (كامل الرحلة)
          </button>
          {dayNumbers.map((dayNum) => (
            <button
              key={dayNum}
              onClick={() => setSelectedDayFilter(dayNum.toString())}
              className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedDayFilter === dayNum.toString()
                  ? 'bg-[#d4af37] text-black shadow-md'
                  : 'bg-[#181818] text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              مسار اليوم {dayNum}
            </button>
          ))}
        </div>

        {/* 3D Flythrough tour button */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={toggleAutoTour}
            className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
              isPlayingTour
                ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                : 'bg-[#221a08] hover:bg-[#2e230b] text-[#d4af37] border border-[#d4af37]/60'
            }`}
          >
            {isPlayingTour ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-[#d4af37]" />}
            <span>{isPlayingTour ? 'إيقاف الجولة' : 'جولة طيران 3D ✈️'}</span>
          </button>

          <button
            onClick={rotateCamera360}
            className="p-1.5 rounded-xl bg-[#181818] hover:bg-[#252525] text-neutral-300 border border-neutral-800 transition-colors cursor-pointer"
            title="تدوير الكاميرا 90 درجة"
          >
            <RotateCw className="w-4 h-4 text-[#d4af37]" />
          </button>

          <button
            onClick={resetOverview}
            className="px-2.5 py-1.5 rounded-xl bg-[#181818] hover:bg-[#252525] text-neutral-300 border border-neutral-800 text-xs font-semibold cursor-pointer"
          >
            إعادة التوسيط
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Container */}
      <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl bg-[#0d0d0d]">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Camera Tilt & Elevation Gauge Overlay */}
        <div className="absolute top-4 right-4 bg-[#111111]/90 backdrop-blur-md border border-neutral-800 rounded-xl p-3 text-xs space-y-2.5 shadow-xl pointer-events-auto">
          <div className="flex items-center justify-between gap-3 text-[11px] font-bold text-[#d4af37]">
            <span className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" />
              <span>زاوية الانحدار 3D:</span>
            </span>
            <span className="font-mono text-white">{cameraPitch}°</span>
          </div>
          <div className="flex items-center gap-1">
            {[30, 50, 65, 75].map((p) => (
              <button
                key={p}
                onClick={() => handlePitchChange(p)}
                className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  cameraPitch === p
                    ? 'bg-[#d4af37] text-black font-black'
                    : 'bg-[#1e1e1e] text-neutral-400 hover:text-white'
                }`}
              >
                {p}°
              </button>
            ))}
          </div>
        </div>

        {/* Selected Landmark Details Card Overlay */}
        {selectedPoint && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-[#121212]/95 backdrop-blur-md border border-[#d4af37]/60 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-3 z-10 animate-in fade-in slide-in-from-bottom-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#d4af37] text-[10px] font-black border border-[#d4af37]/40">
                    {selectedPoint.dayIndex ? `اليوم ${selectedPoint.dayIndex}` : 'معلم بارز'}
                  </span>
                  <span className="text-[11px] text-neutral-400">{selectedPoint.categoryLabel || 'نقطة مسار'}</span>
                </div>
                <h4 className="text-base font-black text-white">{selectedPoint.name}</h4>
              </div>
              <button
                onClick={() => setSelectedPoint(null)}
                className="text-neutral-500 hover:text-white text-xs p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {selectedPoint.description && (
              <p className="text-xs text-neutral-300 leading-relaxed">
                {selectedPoint.description}
              </p>
            )}

            {selectedPoint.insiderTip && (
              <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-300 flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                <span><strong>تلميحة 3D:</strong> {selectedPoint.insiderTip}</span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => onSelectBooking?.(selectedPoint.name)}
                className="flex-1 py-2 px-3 rounded-xl bg-[#d4af37] hover:bg-[#c49f2e] text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow"
              >
                <Zap className="w-3.5 h-3.5 text-black" />
                <span>حجز التذاكر فورياً</span>
              </button>

              {onAskAboutLocation && (
                <button
                  onClick={() => onAskAboutLocation(selectedPoint.name, selectedPoint.categoryLabel)}
                  className="py-2 px-3 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] text-neutral-200 border border-neutral-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  title="استشارة الذكاء الاصطناعي"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>اسأل AI</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Landmark Jump List */}
      <div className="bg-[#121212] border border-neutral-800 rounded-xl p-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>المحطات والمعالم الموزعة على الخريطة ثلاثية الأبعاد:</span>
          </span>
          <span>اضغط على أي معلم للطيران المباشر نحوه بزاوية 3D</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5">
          {filteredPoints.map((p) => (
            <button
              key={p.id}
              onClick={() => flyToPoint(p)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                selectedPoint?.id === p.id
                  ? 'bg-[#d4af37] text-black border-[#d4af37] shadow'
                  : 'bg-[#1a1a1a] text-neutral-300 border-neutral-800 hover:border-neutral-600 hover:text-white'
              }`}
            >
              <span>{p.category === 'hotel' ? '🏨' : p.category === 'gem' ? '💎' : '📍'}</span>
              <span>{p.name}</span>
              {p.dayIndex && <span className="text-[10px] opacity-75 font-mono">({p.dayIndex}D)</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

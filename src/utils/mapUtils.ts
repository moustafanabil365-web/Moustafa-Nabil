import { MapPoint, CityStop, LocalExperience, MapRouteLeg } from '../types';

// Comprehensive database of coordinates for popular destinations & landmarks
export const KNOWN_COORDINATES: Record<string, { lat: number; lng: number; zoom?: number }> = {
  // Saudi Arabia & Gulf
  'الرياض': { lat: 24.7136, lng: 46.6753, zoom: 12 },
  'riyadh': { lat: 24.7136, lng: 46.6753, zoom: 12 },
  'جدة': { lat: 21.5433, lng: 39.1728, zoom: 12 },
  'jeddah': { lat: 21.5433, lng: 39.1728, zoom: 12 },
  'العلا': { lat: 26.6167, lng: 37.9167, zoom: 11 },
  'alula': { lat: 26.6167, lng: 37.9167, zoom: 11 },
  'الدمام': { lat: 26.4207, lng: 50.0888, zoom: 12 },
  'الخبر': { lat: 26.2828, lng: 50.1983, zoom: 12 },
  'مكة': { lat: 21.3891, lng: 39.8579, zoom: 13 },
  'مكة المكرمة': { lat: 21.3891, lng: 39.8579, zoom: 13 },
  'المدينة': { lat: 24.5247, lng: 39.5692, zoom: 13 },
  'المدينة المنورة': { lat: 24.5247, lng: 39.5692, zoom: 13 },
  'أبها': { lat: 18.2164, lng: 42.5053, zoom: 12 },
  'abha': { lat: 18.2164, lng: 42.5053, zoom: 12 },
  'دبي': { lat: 25.2048, lng: 55.2708, zoom: 12 },
  'dubai': { lat: 25.2048, lng: 55.2708, zoom: 12 },
  'أبوظبي': { lat: 24.4539, lng: 54.3773, zoom: 12 },
  'abudhabi': { lat: 24.4539, lng: 54.3773, zoom: 12 },
  'الدوحة': { lat: 25.2854, lng: 51.5310, zoom: 12 },
  'doha': { lat: 25.2854, lng: 51.5310, zoom: 12 },
  'مسقط': { lat: 23.5880, lng: 58.3829, zoom: 12 },
  'muscat': { lat: 23.5880, lng: 58.3829, zoom: 12 },
  'الكويت': { lat: 29.3759, lng: 47.9774, zoom: 12 },
  'المنامة': { lat: 26.2285, lng: 50.5860, zoom: 12 },

  // Middle East & North Africa
  'القاهرة': { lat: 30.0444, lng: 31.2357, zoom: 12 },
  'cairo': { lat: 30.0444, lng: 31.2357, zoom: 12 },
  'الإسكندرية': { lat: 31.2001, lng: 29.9187, zoom: 12 },
  'شرم الشيخ': { lat: 27.9158, lng: 34.3299, zoom: 12 },
  'عمان': { lat: 31.9454, lng: 35.9284, zoom: 12 },
  'البتراء': { lat: 30.3285, lng: 35.4444, zoom: 13 },
  'إسطنبول': { lat: 41.0082, lng: 28.9784, zoom: 12 },
  'istanbul': { lat: 41.0082, lng: 28.9784, zoom: 12 },
  'طرابزون': { lat: 41.0027, lng: 39.7168, zoom: 12 },
  'أنطاليا': { lat: 36.8969, lng: 30.7133, zoom: 12 },
  'كابادوكيا': { lat: 38.6431, lng: 34.8289, zoom: 11 },
  'بيروت': { lat: 33.8938, lng: 35.5018, zoom: 12 },
  'مراكش': { lat: 31.6295, lng: -7.9811, zoom: 12 },
  'marrakech': { lat: 31.6295, lng: -7.9811, zoom: 12 },
  'الدار البيضاء': { lat: 33.5731, lng: -7.5898, zoom: 12 },
  'طنجة': { lat: 35.7595, lng: -5.8340, zoom: 12 },

  // Europe & Caucasus
  'لندن': { lat: 51.5074, lng: -0.1278, zoom: 12 },
  'london': { lat: 51.5074, lng: -0.1278, zoom: 12 },
  'باريس': { lat: 48.8566, lng: 2.3522, zoom: 12 },
  'paris': { lat: 48.8566, lng: 2.3522, zoom: 12 },
  'روما': { lat: 41.9028, lng: 12.4964, zoom: 12 },
  'rome': { lat: 41.9028, lng: 12.4964, zoom: 12 },
  'ميلانو': { lat: 45.4642, lng: 9.1900, zoom: 12 },
  'برشلونة': { lat: 41.3851, lng: 2.1734, zoom: 12 },
  'barcelona': { lat: 41.3851, lng: 2.1734, zoom: 12 },
  'مدريد': { lat: 40.4168, lng: -3.7038, zoom: 12 },
  'فيينا': { lat: 48.2082, lng: 16.3738, zoom: 12 },
  'vienna': { lat: 48.2082, lng: 16.3738, zoom: 12 },
  'أمستردام': { lat: 52.3676, lng: 4.9041, zoom: 12 },
  'amsterdam': { lat: 52.3676, lng: 4.9041, zoom: 12 },
  'ميونخ': { lat: 48.1351, lng: 11.5820, zoom: 12 },
  'زيورخ': { lat: 47.3769, lng: 8.5417, zoom: 12 },
  'جنيف': { lat: 46.2044, lng: 6.1432, zoom: 12 },
  'إنترلاكن': { lat: 46.6863, lng: 7.8632, zoom: 12 },
  'تبليسي': { lat: 41.7151, lng: 44.8271, zoom: 12 },
  'tbilisi': { lat: 41.7151, lng: 44.8271, zoom: 12 },
  'باكو': { lat: 40.4093, lng: 49.8671, zoom: 12 },
  'baku': { lat: 40.4093, lng: 49.8671, zoom: 12 },
  'براغ': { lat: 50.0755, lng: 14.4378, zoom: 12 },
  'بودابست': { lat: 47.4979, lng: 19.0402, zoom: 12 },

  // Asia & Oceania & Americas
  'طوكيو': { lat: 35.6762, lng: 139.6503, zoom: 12 },
  'tokyo': { lat: 35.6762, lng: 139.6503, zoom: 12 },
  'كيوتو': { lat: 35.0116, lng: 135.7681, zoom: 12 },
  'kyoto': { lat: 35.0116, lng: 135.7681, zoom: 12 },
  'أوساكا': { lat: 34.6937, lng: 135.5023, zoom: 12 },
  'osaka': { lat: 34.6937, lng: 135.5023, zoom: 12 },
  'بانكوك': { lat: 13.7563, lng: 100.5018, zoom: 12 },
  'bangkok': { lat: 13.7563, lng: 100.5018, zoom: 12 },
  'بوكيت': { lat: 7.8804, lng: 98.3923, zoom: 11 },
  'كوالالمبور': { lat: 3.1390, lng: 101.6869, zoom: 12 },
  'سنغافورة': { lat: 1.3521, lng: 103.8198, zoom: 12 },
  'singapore': { lat: 1.3521, lng: 103.8198, zoom: 12 },
  'بالي': { lat: -8.4095, lng: 115.1889, zoom: 11 },
  'bali': { lat: -8.4095, lng: 115.1889, zoom: 11 },
  'سيول': { lat: 37.5665, lng: 126.9780, zoom: 12 },
  'نيويورك': { lat: 40.7128, lng: -74.0060, zoom: 12 },
  'newyork': { lat: 40.7128, lng: -74.0060, zoom: 12 },
  'سيدني': { lat: -33.8688, lng: 151.2093, zoom: 12 },
};

/**
 * Resolves center coordinates for a destination query
 */
export function getDestinationCenter(query: string): { lat: number; lng: number; zoom: number } {
  if (!query) return { lat: 24.7136, lng: 46.6753, zoom: 12 };
  
  const normalized = query.trim().toLowerCase();

  // Exact or contains match
  for (const [key, coords] of Object.entries(KNOWN_COORDINATES)) {
    if (normalized.includes(key.toLowerCase()) || key.toLowerCase().includes(normalized)) {
      return { lat: coords.lat, lng: coords.lng, zoom: coords.zoom || 12 };
    }
  }

  // Hash-based deterministic coordinate generator within popular globe range if completely unknown
  let hash = 0;
  for (let i = 0; i < query.length; i++) {
    hash = (hash << 5) - hash + query.charCodeAt(i);
    hash |= 0;
  }
  const lat = 20 + (Math.abs(hash % 3000) / 100);
  const lng = 30 + (Math.abs((hash >> 3) % 6000) / 100);
  return { lat, lng, zoom: 11 };
}

/**
 * Extracts and synthesizes comprehensive MapPoints from Plan, Itinerary Markdown, CityStops, and Local Experiences
 */
export function extractMapPointsFromPlan(
  destination: string,
  itineraryMarkdown: string,
  localExperiences?: LocalExperience[],
  cityStops?: CityStop[],
  accommodationArea?: string
): { points: MapPoint[]; routeLegs: MapRouteLeg[]; center: { lat: number; lng: number; zoom: number } } {
  const points: MapPoint[] = [];
  const baseCenter = getDestinationCenter(destination);

  // 1. Multi-City Stops
  const routeLegs: MapRouteLeg[] = [];
  if (cityStops && cityStops.length > 0) {
    cityStops.forEach((stop, idx) => {
      const stopCenter = getDestinationCenter(stop.cityName);
      const point: MapPoint = {
        id: `stop-${stop.id || idx}`,
        name: stop.cityName,
        lat: stopCenter.lat,
        lng: stopCenter.lng,
        category: 'city_stop',
        categoryLabel: `المحطة ${idx + 1} (${stop.days} أيام)`,
        cityName: stop.cityName,
        description: `الإقامة في: ${stop.hotelArea || 'وسط المدينة'} لمدة ${stop.days} أيام.`,
      };
      points.push(point);

      // Route legs between consecutive stops
      if (idx > 0) {
        const prevStop = cityStops[idx - 1];
        const prevCenter = getDestinationCenter(prevStop.cityName);
        routeLegs.push({
          fromCity: prevStop.cityName,
          toCity: stop.cityName,
          fromCoords: [prevCenter.lat, prevCenter.lng],
          toCoords: [stopCenter.lat, stopCenter.lng],
          transitMode: 'قطار سريع / رحلة داخلية',
        });
      }
    });
  }

  // 2. Main Hotel / Base Accommodation Area
  if (accommodationArea && accommodationArea.trim()) {
    points.push({
      id: 'hotel-base',
      name: `مقر الإقامة: ${accommodationArea}`,
      lat: baseCenter.lat + 0.006,
      lng: baseCenter.lng - 0.005,
      category: 'hotel',
      categoryLabel: 'مقر الإقامة المعتمد',
      description: `الفندق والمنطقة السكنية المختارة بعناية: ${accommodationArea}.`,
    });
  }

  // 3. Local Experiences Points
  if (localExperiences && localExperiences.length > 0) {
    localExperiences.forEach((exp, idx) => {
      // Deterministic slight offset around the city center to display distinct markers
      const angle = (idx * (2 * Math.PI / localExperiences.length)) + 0.4;
      const radius = 0.015 + (idx * 0.008);
      const lat = baseCenter.lat + Math.sin(angle) * radius;
      const lng = baseCenter.lng + Math.cos(angle) * radius;

      points.push({
        id: exp.id || `gem-${idx}`,
        name: exp.title,
        lat,
        lng,
        category: 'gem',
        categoryLabel: exp.categoryLabel || 'تجربة محلية أصيلة',
        description: exp.description,
        recommendedTime: exp.recommendedTime,
        insiderTip: exp.insiderTip,
      });
    });
  }

  // 4. Parse Day Activities from Markdown
  const dayRegex = /###\s*اليوم\s*(\d+)[:\s\-]+([^\n]+)/g;
  let match;
  const daysFound: { day: number; title: string; textChunk: string }[] = [];
  
  const chunks = itineraryMarkdown.split(/###\s*اليوم\s*\d+/);
  let dIdx = 1;
  while ((match = dayRegex.exec(itineraryMarkdown)) !== null) {
    daysFound.push({
      day: parseInt(match[1], 10) || dIdx,
      title: match[2]?.trim() || `اليوم ${dIdx}`,
      textChunk: chunks[dIdx] || '',
    });
    dIdx++;
  }

  // If days are parsed, create landmarks for Morning, Afternoon, Evening
  daysFound.forEach((d) => {
    // Look for bold highlights like **الصباح**: ... or landmark names
    const lines = d.textChunk.split('\n');
    let subIdx = 0;
    
    lines.forEach((line) => {
      const timeMatch = line.match(/\*\*(الصباح|بعد الظهر|المساء|فترة الظهيرة)[^\*]*\*\*[:\s]+([^\n]+)/);
      if (timeMatch && subIdx < 3) {
        const period = timeMatch[1];
        const activity = timeMatch[2].replace(/\[|\]/g, '').trim();
        const shortName = activity.split(/[,،\-\.\:]/)[0]?.trim() || activity;

        const angle = ((d.day * 3 + subIdx) * 1.3);
        const dist = 0.012 + (subIdx * 0.007) + (d.day * 0.003);
        const lat = baseCenter.lat + Math.sin(angle) * dist;
        const lng = baseCenter.lng + Math.cos(angle) * dist;

        const isFood = period === 'المساء' || activity.includes('مطعم') || activity.includes('عشاء') || activity.includes('غداء') || activity.includes('مقهى');

        points.push({
          id: `day-${d.day}-activity-${subIdx}`,
          name: shortName,
          lat,
          lng,
          dayIndex: d.day,
          category: isFood ? 'food' : 'landmark',
          categoryLabel: `اليوم ${d.day} • ${period}`,
          description: activity,
          recommendedTime: period,
        });
        subIdx++;
      }
    });
  });

  // If no landmarks were found in markdown, generate structured sample points for Day 1 & Day 2
  if (points.filter(p => p.category === 'landmark').length === 0) {
    const defaultLandmarks = [
      { name: `وسط ${destination} التاريخي والأسواق التراثية`, period: 'الصباح (09:30)', cat: 'landmark' as const, day: 1 },
      { name: `معلم ${destination} البارز وصالات الفنون`, period: 'بعد الظهر (02:00)', cat: 'landmark' as const, day: 1 },
      { name: `ممشى الواجهة والمطاعم الشعبية الشهيرة`, period: 'المساء (07:30)', cat: 'food' as const, day: 1 },
      { name: `متحف التراث والآثار الوطني`, period: 'الصباح (10:00)', cat: 'landmark' as const, day: 2 },
      { name: `الحديقة الكبرى والساحات المفتوحة`, period: 'بعد الظهر (03:30)', cat: 'landmark' as const, day: 2 },
      { name: `مقهى ومطل الغروب الاستثنائي`, period: 'المساء (08:00)', cat: 'food' as const, day: 2 },
    ];

    defaultLandmarks.forEach((lm, idx) => {
      const angle = idx * 1.05;
      const radius = 0.01 + (idx * 0.006);
      points.push({
        id: `default-lm-${idx}`,
        name: lm.name,
        lat: baseCenter.lat + Math.sin(angle) * radius,
        lng: baseCenter.lng + Math.cos(angle) * radius,
        dayIndex: lm.day,
        category: lm.cat,
        categoryLabel: `اليوم ${lm.day} • ${lm.period}`,
        description: `نشاط ممتع وموصى به للمسافر في ${destination}.`,
        recommendedTime: lm.period,
      });
    });
  }

  return { points, routeLegs, center: baseCenter };
}

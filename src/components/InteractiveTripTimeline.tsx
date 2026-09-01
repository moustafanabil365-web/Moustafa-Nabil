import React, { useState, useMemo } from 'react';
import { 
  Clock, Sun, Sunset, Moon, Coffee, MapPin, Sparkles, 
  ChevronRight, ChevronLeft, Calendar, Ticket, Compass, 
  CloudSun, CheckCircle2, ChevronDown, ChevronUp, MessageSquarePlus
} from 'lucide-react';
import { GeneratedPlan, DayForecast } from '../types';

interface InteractiveTripTimelineProps {
  plan: GeneratedPlan;
  onOpenChat?: (promptText: string) => void;
  onAddActivityNote?: (dayNumber: number, activityTitle: string) => void;
}

interface ParsedSlot {
  id: string;
  timeSlot: 'morning' | 'afternoon' | 'evening' | 'general';
  timeSlotLabel: string;
  timeRange: string;
  title: string;
  description: string;
  location?: string;
  highlights: string[];
}

interface ParsedDay {
  dayNumber: number;
  dayTitle: string;
  slots: ParsedSlot[];
  rawContent: string;
  forecast?: DayForecast;
}

export const InteractiveTripTimeline: React.FC<InteractiveTripTimelineProps> = ({
  plan,
  onOpenChat,
  onAddActivityNote,
}) => {
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [expandedSlots, setExpandedSlots] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline');

  // Parse day-by-day markdown content into structured day timeline
  const parsedDays = useMemo<ParsedDay[]>(() => {
    const md = plan.itineraryMarkdown || '';
    const days: ParsedDay[] = [];
    const forecastList = plan.weather?.forecast || [];

    // Split markdown by Day markers (### اليوم X or ### Day X)
    const dayRegex = /###\s*(اليوم\s*(\d+)[:\s\-–—]*([^\n]*)|Day\s*(\d+)[:\s\-–—]*([^\n]*))/gi;
    const matches: { index: number; dayNum: number; title: string; fullMatch: string }[] = [];

    let match;
    while ((match = dayRegex.exec(md)) !== null) {
      const dayNum = parseInt(match[2] || match[4] || '1', 10);
      const title = (match[3] || match[5] || '').trim();
      matches.push({
        index: match.index,
        dayNum: isNaN(dayNum) ? matches.length + 1 : dayNum,
        title: title || `استكشاف ${plan.destination}`,
        fullMatch: match[0],
      });
    }

    if (matches.length === 0) {
      // Fallback: create default days based on durationDays
      const total = plan.durationDays || 3;
      for (let i = 1; i <= total; i++) {
        days.push({
          dayNumber: i,
          dayTitle: `اليوم ${i}: جولة ومعالم ${plan.destination}`,
          slots: [
            {
              id: `slot-${i}-1`,
              timeSlot: 'morning',
              timeSlotLabel: 'الصباح (09:00 - 12:30)',
              timeRange: '09:00 - 12:30',
              title: `استكشاف أبرز معالم ${plan.destination} الصباحية`,
              description: 'زيارة المعالم الرئيسية والأسواق التاريخية في أجواء صباحية منعشة.',
              highlights: ['جولة ممتعة', 'تصوير تذكاري'],
            },
            {
              id: `slot-${i}-2`,
              timeSlot: 'afternoon',
              timeSlotLabel: 'بعد الظهر (01:30 - 05:00)',
              timeRange: '01:30 - 05:00',
              title: 'غداء محلي أصيل وأنشطة ترفيهية',
              description: 'تناول أشهى الأطباق التراثية وزيارة المتاحف والحدائق المجاورة.',
              highlights: ['تذوق أطباق محلية', 'استراحة مريحة'],
            },
            {
              id: `slot-${i}-3`,
              timeSlot: 'evening',
              timeSlotLabel: 'المساء (06:30 - 10:00)',
              timeRange: '06:30 - 10:00',
              title: 'أمسية ساحرة وجلسة مقهى تقليدي',
              description: 'الاستمتاع بالإطلالات الليلية والأسواق الشعبية أو الواجهة المائية.',
              highlights: ['جلسة مسائية هادئة', 'إطلالة ليلية'],
            },
          ],
          rawContent: '',
          forecast: forecastList[i - 1] || forecastList[0],
        });
      }
      return days;
    }

    // Process parsed sections
    for (let i = 0; i < matches.length; i++) {
      const current = matches[i];
      const nextIndex = i + 1 < matches.length ? matches[i + 1].index : md.search(/##\s*2\.\s*💡|لماذا اخترنا/i);
      const endIndex = nextIndex !== -1 ? nextIndex : md.length;
      const dayContent = md.slice(current.index, endIndex);

      // Extract slot lines
      const slots: ParsedSlot[] = [];
      const lines = dayContent.split('\n');

      let currentSlot: Partial<ParsedSlot> | null = null;

      for (const line of lines) {
        const trimmed = line.trim();
        if (
          trimmed.startsWith('- **') || 
          trimmed.startsWith('* **') || 
          trimmed.includes('الصباح') || 
          trimmed.includes('بعد الظهر') || 
          trimmed.includes('المساء') ||
          trimmed.includes('Morning') ||
          trimmed.includes('Afternoon') ||
          trimmed.includes('Evening')
        ) {
          if (currentSlot && currentSlot.title) {
            slots.push(currentSlot as ParsedSlot);
          }

          let timeSlot: 'morning' | 'afternoon' | 'evening' | 'general' = 'general';
          let timeSlotLabel = 'نشاط الرحلة';
          let timeRange = 'خلال اليوم';

          if (trimmed.includes('الصباح') || trimmed.toLowerCase().includes('morning')) {
            timeSlot = 'morning';
            timeSlotLabel = 'الصباح';
            timeRange = '09:00 - 12:30';
          } else if (trimmed.includes('بعد الظهر') || trimmed.includes('الظهيرة') || trimmed.toLowerCase().includes('afternoon')) {
            timeSlot = 'afternoon';
            timeSlotLabel = 'بعد الظهر';
            timeRange = '01:30 - 05:00';
          } else if (trimmed.includes('المساء') || trimmed.includes('الليل') || trimmed.toLowerCase().includes('evening')) {
            timeSlot = 'evening';
            timeSlotLabel = 'المساء والليل';
            timeRange = '06:30 - 10:00';
          }

          // Clean title and description
          const rawText = trimmed.replace(/^[-*]\s*/, '').replace(/\*\*/g, '').trim();
          const parts = rawText.split(/[:：]\s*/);
          const headerPart = parts[0] || '';
          const descPart = parts.slice(1).join(': ') || '';

          // Extract specific time if mentioned in parentheses
          const timeMatch = headerPart.match(/\(([^)]+)\)/);
          if (timeMatch && timeMatch[1]) {
            timeRange = timeMatch[1];
          }

          currentSlot = {
            id: `slot-${current.dayNum}-${slots.length + 1}`,
            timeSlot,
            timeSlotLabel: headerPart || timeSlotLabel,
            timeRange,
            title: descPart.slice(0, 70) || headerPart,
            description: descPart || rawText,
            highlights: [],
          };
        } else if (currentSlot && trimmed.length > 0 && !trimmed.startsWith('#')) {
          currentSlot.description = (currentSlot.description ? currentSlot.description + ' ' : '') + trimmed;
        }
      }

      if (currentSlot && currentSlot.title) {
        slots.push(currentSlot as ParsedSlot);
      }

      // If no bullet points found, create 2 standard slots
      if (slots.length === 0) {
        slots.push({
          id: `slot-${current.dayNum}-1`,
          timeSlot: 'morning',
          timeSlotLabel: 'الصباح وبعد الظهر',
          timeRange: '10:00 - 04:00',
          title: current.title,
          description: dayContent.replace(current.fullMatch, '').slice(0, 200).trim() || 'جولة مميزة في المدينة',
          highlights: ['زيارة معالم', 'تجربة محلية'],
        });
      }

      days.push({
        dayNumber: current.dayNum,
        dayTitle: current.title || `اليوم ${current.dayNum}`,
        slots,
        rawContent: dayContent,
        forecast: forecastList[current.dayNum - 1] || forecastList[0],
      });
    }

    return days;
  }, [plan.itineraryMarkdown, plan.weather, plan.durationDays]);

  const activeDay = parsedDays.find((d) => d.dayNumber === selectedDayNumber) || parsedDays[0];

  const toggleSlotExpand = (slotId: string) => {
    setExpandedSlots((prev) => ({
      ...prev,
      [slotId]: !prev[slotId],
    }));
  };

  const getSlotIcon = (timeSlot: string) => {
    switch (timeSlot) {
      case 'morning':
        return <Sun className="w-4 h-4 text-amber-400" />;
      case 'afternoon':
        return <Coffee className="w-4 h-4 text-orange-400" />;
      case 'evening':
        return <Sunset className="w-4 h-4 text-indigo-400" />;
      default:
        return <Clock className="w-4 h-4 text-[#d4af37]" />;
    }
  };

  const getSlotBadgeColor = (timeSlot: string) => {
    switch (timeSlot) {
      case 'morning':
        return 'bg-amber-950/40 text-amber-300 border-amber-500/40';
      case 'afternoon':
        return 'bg-orange-950/40 text-orange-300 border-orange-500/40';
      case 'evening':
        return 'bg-indigo-950/40 text-indigo-300 border-indigo-500/40';
      default:
        return 'bg-neutral-800 text-[#d4af37] border-neutral-700';
    }
  };

  // Associated notes for current active day
  const activeDayNotes = Object.values(plan.activityNotes || {}).filter(
    (n) => n.dayNumber === activeDay?.dayNumber
  );

  return (
    <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-5 sm:p-7 shadow-2xl space-y-6">
      {/* Header with Day Navigator Tabs & View Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/80 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white">
                الخط الزمني التفاعلي لجدول الرحلة (Interactive Day Timeline)
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#d4af37]/15 text-[#f5d061] border border-[#d4af37]/30">
                تسلسل زمني حي
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              تصفح الأنشطة اليومية مرتبة بالساعة مع الطقس المباشر وحالة المعالم لكل فترة.
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <div className="flex items-center p-1 bg-[#181818] rounded-xl border border-neutral-800 text-xs">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'timeline'
                  ? 'bg-[#d4af37] text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              خط زمني متدرج
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#d4af37] text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              شبكة الفترات
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Day Selector Carousel */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span className="font-semibold text-white">اختر اليوم لعرض الجدول الزمني:</span>
          <span>{parsedDays.length} أيام مجدولة</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-neutral-700">
          {parsedDays.map((day) => {
            const isSelected = day.dayNumber === selectedDayNumber;
            const forecast = day.forecast;

            return (
              <button
                key={day.dayNumber}
                onClick={() => setSelectedDayNumber(day.dayNumber)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-xl border transition-all text-right cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? 'bg-[#1e1910] border-[#d4af37] text-white shadow-lg shadow-[#d4af37]/15 ring-1 ring-[#d4af37]/50'
                    : 'bg-[#161616] border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                  isSelected ? 'bg-[#d4af37] text-black' : 'bg-neutral-800 text-neutral-300'
                }`}>
                  {day.dayNumber}
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>اليوم {day.dayNumber}</span>
                    {forecast && (
                      <span className="text-[11px] opacity-90">{forecast.icon} {forecast.tempMax}°</span>
                    )}
                  </div>
                  <div className="text-[10px] text-neutral-400 truncate max-w-[120px]">
                    {day.dayTitle.replace(/اليوم\s*\d+[:\s\-]*/, '') || plan.destination}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Day Detail Card */}
      {activeDay && (
        <div className="space-y-6">
          {/* Day Banner with Live Weather Context */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#171717] via-[#141414] to-[#121212] border border-neutral-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-md bg-[#d4af37]/20 text-[#f5d061] border border-[#d4af37]/40 text-xs font-bold font-mono">
                  Day {activeDay.dayNumber} of {plan.durationDays}
                </span>
                <span className="text-xs text-neutral-400">
                  {plan.destination}
                </span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-white">
                {activeDay.dayTitle}
              </h4>
            </div>

            {/* Weather condition for this day */}
            {activeDay.forecast && (
              <div className="flex items-center gap-3 bg-[#1c1c1c] px-3.5 py-2 rounded-xl border border-neutral-800 self-start sm:self-auto">
                <span className="text-2xl">{activeDay.forecast.icon}</span>
                <div className="text-right">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{activeDay.forecast.condition}</span>
                    <span className="text-[#d4af37] font-mono">{activeDay.forecast.tempMax}°C</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    الصغرى: {activeDay.forecast.tempMin}°C • {activeDay.forecast.dayName}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Attached Notes & Bookings for this day */}
          {activeDayNotes.length > 0 && (
            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200 text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-[#d4af37]">
                <span className="flex items-center gap-1.5">
                  <Ticket className="w-3.5 h-3.5" />
                  <span>حجوزات وملاحظات مرتبطة بهذا اليوم ({activeDayNotes.length}):</span>
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeDayNotes.map((note) => (
                  <div key={note.id} className="bg-[#141414] p-2.5 rounded-lg border border-neutral-800 text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-neutral-200">
                      <span className="font-bold">{note.activityTitle || 'نشاط اليوم'}</span>
                      {note.bookingNumber && (
                        <span className="font-mono text-amber-300 bg-black/40 px-1.5 py-0.5 rounded">
                          #{note.bookingNumber}
                        </span>
                      )}
                    </div>
                    {note.noteText && <p className="text-neutral-400">{note.noteText}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline View */}
          {viewMode === 'timeline' ? (
            <div className="relative border-r-2 border-[#d4af37]/30 pr-6 mr-3 space-y-8 my-4">
              {activeDay.slots.map((slot, index) => {
                const isExpanded = expandedSlots[slot.id] ?? true;

                return (
                  <div key={slot.id || index} className="relative group">
                    {/* Pulsing Node on the Timeline line */}
                    <div className="absolute -right-[31px] top-1.5 w-4 h-4 rounded-full bg-[#111111] border-2 border-[#d4af37] flex items-center justify-center shadow-md shadow-[#d4af37]/30 group-hover:scale-125 transition-transform">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                    </div>

                    {/* Timeline Activity Box */}
                    <div className="bg-[#161616] border border-neutral-800 hover:border-neutral-700 rounded-2xl p-4 sm:p-5 transition-all shadow-md">
                      {/* Top Slot Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-neutral-800/80 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 ${getSlotBadgeColor(slot.timeSlot)}`}>
                            {getSlotIcon(slot.timeSlot)}
                            <span>{slot.timeSlotLabel}</span>
                          </span>
                          <span className="text-xs text-neutral-400 font-mono flex items-center gap-1 bg-[#1f1f1f] px-2 py-0.5 rounded border border-neutral-800">
                            <Clock className="w-3 h-3 text-[#d4af37]" />
                            {slot.timeRange}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 self-end sm:self-auto">
                          {onAddActivityNote && (
                            <button
                              onClick={() => onAddActivityNote(activeDay.dayNumber, slot.title)}
                              className="text-[11px] px-2.5 py-1 rounded-lg bg-[#1f1f1f] hover:bg-[#282828] text-amber-300 border border-neutral-800 flex items-center gap-1 transition-colors cursor-pointer"
                              title="إرفاق رقم حجز أو ملاحظة لهذا النشاط"
                            >
                              <Ticket className="w-3 h-3 text-[#d4af37]" />
                              <span>حجز/ملاحظة</span>
                            </button>
                          )}

                          {onOpenChat && (
                            <button
                              onClick={() => onOpenChat(`أود الاستفسار عن نشاط "${slot.title}" في اليوم ${activeDay.dayNumber}. ما هي أفضل النصائح والمطاعم المجاورة؟`)}
                              className="text-[11px] px-2.5 py-1 rounded-lg bg-[#1f1f1f] hover:bg-[#282828] text-neutral-300 hover:text-white border border-neutral-800 flex items-center gap-1 transition-colors cursor-pointer"
                              title="اسأل الذكاء الاصطناعي عن هذا النشاط"
                            >
                              <Sparkles className="w-3 h-3 text-[#d4af37]" />
                              <span>استشارة</span>
                            </button>
                          )}

                          <button
                            onClick={() => toggleSlotExpand(slot.id)}
                            className="p-1 rounded-lg bg-[#1f1f1f] text-neutral-400 hover:text-white cursor-pointer"
                          >
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Slot Description */}
                      <div className="mt-3.5 space-y-2">
                        <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
                          {slot.description}
                        </p>

                        {/* Google Maps Search Quick Link */}
                        <div className="pt-2 flex items-center justify-between flex-wrap gap-2 text-xs">
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${slot.title} ${plan.destination}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[11px] text-[#d4af37] hover:underline font-semibold"
                          >
                            <MapPin className="w-3.5 h-3.5" />
                            <span>عرض الموقع على Google Maps</span>
                          </a>

                          <span className="text-[11px] text-neutral-500">
                            اليوم {activeDay.dayNumber} • {plan.destination}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeDay.slots.map((slot, index) => (
                <div
                  key={slot.id || index}
                  className="bg-[#161616] border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-neutral-700 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-lg border text-[11px] font-bold flex items-center gap-1 ${getSlotBadgeColor(slot.timeSlot)}`}>
                        {getSlotIcon(slot.timeSlot)}
                        <span>{slot.timeSlotLabel}</span>
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {slot.timeRange}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-200 leading-relaxed pt-1">
                      {slot.description}
                    </p>
                  </div>

                  <div className="border-t border-neutral-800/80 pt-2.5 flex items-center justify-between">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${slot.title} ${plan.destination}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-[#d4af37] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <MapPin className="w-3 h-3" />
                      <span>الخريطة</span>
                    </a>

                    {onOpenChat && (
                      <button
                        onClick={() => onOpenChat(`أخبرني المزيد عن ${slot.title} في ${plan.destination}`)}
                        className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-[#d4af37]" />
                        <span>نصائح</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between border-t border-neutral-800/80 pt-4 text-xs text-neutral-400">
        <button
          onClick={() => setSelectedDayNumber((prev) => Math.max(1, prev - 1))}
          disabled={selectedDayNumber <= 1}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#161616] hover:bg-[#202020] disabled:opacity-30 disabled:cursor-not-allowed text-neutral-200 border border-neutral-800 transition-colors cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
          <span>اليوم السابق ({selectedDayNumber - 1 > 0 ? selectedDayNumber - 1 : 1})</span>
        </button>

        <span className="font-mono font-bold text-[#d4af37]">
          {selectedDayNumber} / {parsedDays.length}
        </span>

        <button
          onClick={() => setSelectedDayNumber((prev) => Math.min(parsedDays.length, prev + 1))}
          disabled={selectedDayNumber >= parsedDays.length}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#161616] hover:bg-[#202020] disabled:opacity-30 disabled:cursor-not-allowed text-neutral-200 border border-neutral-800 transition-colors cursor-pointer"
        >
          <span>اليوم التالي ({Math.min(parsedDays.length, selectedDayNumber + 1)})</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

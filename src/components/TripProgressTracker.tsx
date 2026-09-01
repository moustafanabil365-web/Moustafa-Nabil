import React, { useState, useEffect, useMemo } from 'react';
import { 
  Clock, Calendar, Compass, MapPin, Sparkles, ChevronRight, 
  CheckCircle, ArrowRight, Sun, Sunset, Moon, Sunrise, Navigation, RefreshCw 
} from 'lucide-react';
import { GeneratedPlan } from '../types';

interface TripProgressTrackerProps {
  plan: GeneratedPlan;
  onUpdatePlan?: (updated: GeneratedPlan) => void;
  onJumpToDay?: (dayNumber: number) => void;
}

// Approximate time offsets for popular destinations relative to UTC
const DESTINATION_UTC_OFFSETS: Record<string, number> = {
  'باريس': 2, 'paris': 2,
  'لندن': 1, 'london': 1,
  'روما': 2, 'rome': 2,
  'دبي': 4, 'dubai': 4,
  'الرياض': 3, 'riyadh': 3,
  'جدة': 3, 'jeddah': 3,
  'القاهرة': 3, 'cairo': 3,
  'إسطنبول': 3, 'istanbul': 3,
  'طوكيو': 9, 'tokyo': 9,
  'سيول': 9, 'seoul': 9,
  'كيوتو': 9, 'kyoto': 9,
  'بانكوك': 7, 'bangkok': 7,
  'كوالالمبور': 8, 'kuala lumpur': 8,
  'سنغافورة': 8, 'singapore': 8,
  'بالي': 8, 'bali': 8,
  'نيويورك': -4, 'new york': -4,
  'لوس أنجلوس': -7, 'los angeles': -7,
  'مدريد': 2, 'madrid': 2,
  'برشلونة': 2, 'barcelona': 2,
  'فيينا': 2, 'vienna': 2,
  'أمستردام': 2, 'amsterdam': 2,
  'جنيف': 2, 'geneva': 2,
  'تبليسي': 4, 'tbilisi': 4,
  'باكو': 4, 'baku': 4,
};

export const TripProgressTracker: React.FC<TripProgressTrackerProps> = ({
  plan,
  onUpdatePlan,
  onJumpToDay,
}) => {
  // Use today's date formatted as YYYY-MM-DD by default if not set
  const defaultStartDate = useMemo(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  }, []);

  const [startDateStr, setStartDateStr] = useState<string>(
    plan.tripStartDate || defaultStartDate
  );
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Update plan when start date changes
  const handleSaveStartDate = (newDate: string) => {
    setStartDateStr(newDate);
    setIsEditingDate(false);
    if (onUpdatePlan) {
      onUpdatePlan({
        ...plan,
        tripStartDate: newDate,
      });
    }
  };

  // Calculate destination timezone time
  const destinationOffset = useMemo(() => {
    const key = plan.destination.toLowerCase().trim();
    for (const [dest, offset] of Object.entries(DESTINATION_UTC_OFFSETS)) {
      if (key.includes(dest)) return offset;
    }
    // Default to +3 (Arabian Standard Time) or UTC offset
    return 3;
  }, [plan.destination]);

  // Compute destination local time string
  const destLocalTime = useMemo(() => {
    const utcTime = currentTime.getTime() + currentTime.getTimezoneOffset() * 60000;
    const destDate = new Date(utcTime + 3600000 * destinationOffset);
    return {
      hours: destDate.getHours(),
      minutes: destDate.getMinutes(),
      formatted: destDate.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', hour12: true }),
      hour24: destDate.getHours(),
    };
  }, [currentTime, destinationOffset]);

  // Trip progress calculations
  const progressInfo = useMemo(() => {
    const start = new Date(startDateStr);
    start.setHours(0, 0, 0, 0);

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const totalDays = plan.durationDays;

    let status: 'upcoming' | 'ongoing' | 'completed' = 'ongoing';
    let currentDayNumber = 1;
    let percent = 0;
    let statusLabel = '';

    if (diffDays < 0) {
      status = 'upcoming';
      const daysUntil = Math.abs(diffDays);
      statusLabel = `تبدأ الرحلة خلال ${daysUntil} ${daysUntil === 1 ? 'يوم' : 'أيام'}`;
      percent = 0;
      currentDayNumber = 1;
    } else if (diffDays >= totalDays) {
      status = 'completed';
      statusLabel = `اكتملت الرحلة (${totalDays} أيام)`;
      percent = 100;
      currentDayNumber = totalDays;
    } else {
      status = 'ongoing';
      currentDayNumber = diffDays + 1;
      statusLabel = `اليوم ${currentDayNumber} من أصل ${totalDays}`;
      // calculate fine-grained percentage including current time of day
      const dayFraction = destLocalTime.hour24 / 24;
      percent = Math.min(100, Math.round(((diffDays + dayFraction) / totalDays) * 100));
    }

    return {
      status,
      currentDayNumber,
      percent,
      statusLabel,
      diffDays,
    };
  }, [startDateStr, plan.durationDays, destLocalTime.hour24]);

  // Current slot of the day (Morning, Afternoon, Evening, Night)
  const currentSlot = useMemo(() => {
    const h = destLocalTime.hour24;
    if (h >= 6 && h < 12) {
      return {
        label: 'الفترة الصباحية',
        icon: Sunrise,
        color: 'text-amber-300',
        bg: 'bg-amber-500/10 border-amber-500/30',
        advice: 'وقت مثالي للمتاحف والأنشطة المفتوحة وتناول الإفطار المحلي.',
      };
    } else if (h >= 12 && h < 17) {
      return {
        label: 'فترة الظهيرة وما بعد الظهر',
        icon: Sun,
        color: 'text-orange-300',
        bg: 'bg-orange-500/10 border-orange-500/30',
        advice: 'وجبة الغداء، زيارة المعالم المغلقة، أو التسوق والاستراحة.',
      };
    } else if (h >= 17 && h < 21) {
      return {
        label: 'فترة المساء والغروب (Golden Hour)',
        icon: Sunset,
        color: 'text-rose-300',
        bg: 'bg-rose-500/10 border-rose-500/30',
        advice: 'التقاط الصور التذكارية، الجولات الراجلة وإطلالات الغروب.',
      };
    } else {
      return {
        label: 'الفترة الليلية والعشاء',
        icon: Moon,
        color: 'text-indigo-300',
        bg: 'bg-indigo-500/10 border-indigo-500/30',
        advice: 'عشاء فاخر في مطعم محلي مميز، وجولة خفيفة في الساحات المضاءة.',
      };
    }
  }, [destLocalTime.hour24]);

  const SlotIcon = currentSlot.icon;

  return (
    <div className="bg-[#141414] border border-[#d4af37]/40 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4 mb-6 relative overflow-hidden">
      {/* Background ambient gradient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      {/* Top Header Row: Trip Status & Clocks */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left side: Live Location & Local Time */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] flex-shrink-0">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-white font-black text-base flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#d4af37]" />
                <span>متابعة الرحلة الحية: {plan.destination}</span>
              </h3>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                progressInfo.status === 'ongoing' 
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40' 
                  : progressInfo.status === 'upcoming'
                  ? 'bg-sky-950/60 text-sky-300 border-sky-500/40'
                  : 'bg-neutral-800 text-neutral-300 border-neutral-700'
              }`}>
                {progressInfo.statusLabel}
              </span>
            </div>
            
            {/* Clocks Row */}
            <div className="flex items-center gap-4 text-xs text-neutral-400 mt-1 flex-wrap">
              <span className="flex items-center gap-1.5 text-neutral-300 font-medium">
                <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>التوقيت المحلي في {plan.destination}:</span>
                <strong className="text-white font-mono text-sm bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                  {destLocalTime.formatted}
                </strong>
                <span className="text-[10px] text-neutral-400">
                  (GMT{destinationOffset >= 0 ? `+${destinationOffset}` : destinationOffset})
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Right side: Start Date Controller & Jump to Day */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {isEditingDate ? (
            <div className="flex items-center gap-2 bg-[#1c1c1c] p-1.5 rounded-xl border border-neutral-700">
              <input
                type="date"
                value={startDateStr}
                onChange={(e) => setStartDateStr(e.target.value)}
                className="bg-neutral-900 text-white text-xs px-2.5 py-1.5 rounded-lg border border-neutral-700 focus:outline-none focus:border-[#d4af37]"
              />
              <button
                onClick={() => handleSaveStartDate(startDateStr)}
                className="px-3 py-1.5 rounded-lg bg-[#d4af37] text-black font-bold text-xs hover:bg-[#e5c158] cursor-pointer"
              >
                تطبيق
              </button>
              <button
                onClick={() => setIsEditingDate(false)}
                className="px-2 py-1.5 text-xs text-neutral-400 hover:text-white cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingDate(true)}
              className="flex items-center gap-1.5 text-xs text-neutral-300 bg-[#1c1c1c] hover:bg-[#252525] px-3 py-2 rounded-xl border border-neutral-800 cursor-pointer transition-colors"
              title="اضبط تاريخ بدء الرحلة لمزامنة التقدم الزمني"
            >
              <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>تاريخ المغادرة: {startDateStr}</span>
              <span className="text-[10px] text-[#d4af37] underline mr-1">تعديل</span>
            </button>
          )}

          {progressInfo.status === 'ongoing' && onJumpToDay && (
            <button
              onClick={() => onJumpToDay(progressInfo.currentDayNumber)}
              className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-[#d4af37]/20 hover:bg-[#d4af37]/30 text-[#d4af37] border border-[#d4af37]/50 cursor-pointer transition-all shadow-md"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>انتقل لجدول اليوم {progressInfo.currentDayNumber}</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar with Day Milestones */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span className="font-medium flex items-center gap-1">
            <span className="text-[#d4af37] font-bold">{progressInfo.percent}%</span> من إجمالي الرحلة
          </span>
          <span>
            {progressInfo.status === 'ongoing' 
              ? `متبقي ${plan.durationDays - progressInfo.currentDayNumber} ${plan.durationDays - progressInfo.currentDayNumber === 1 ? 'يوم' : 'أيام'}`
              : progressInfo.status === 'upcoming'
              ? `${plan.durationDays} أيام مخططة`
              : 'تمت الرحلة بالكامل'}
          </span>
        </div>

        {/* Progress Track */}
        <div className="relative w-full h-3 bg-[#0a0a0a] rounded-full overflow-hidden border border-neutral-800 p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-600 via-[#d4af37] to-amber-300 transition-all duration-700 shadow-lg shadow-[#d4af37]/30"
            style={{ width: `${progressInfo.percent}%` }}
          ></div>
        </div>

        {/* Day Pills Bar */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto py-1 text-[11px]">
          {Array.from({ length: plan.durationDays }, (_, idx) => {
            const dayNum = idx + 1;
            const isPast = progressInfo.status === 'completed' || (progressInfo.status === 'ongoing' && dayNum < progressInfo.currentDayNumber);
            const isCurrent = progressInfo.status === 'ongoing' && dayNum === progressInfo.currentDayNumber;
            const isFuture = !isPast && !isCurrent;

            return (
              <button
                key={dayNum}
                onClick={() => onJumpToDay && onJumpToDay(dayNum)}
                className={`flex-1 min-w-[50px] py-1.5 px-2 rounded-lg border text-center font-medium transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#d4af37] text-black border-[#d4af37] font-bold shadow-md shadow-[#d4af37]/20 scale-105'
                    : isPast
                    ? 'bg-[#181818] text-neutral-400 border-neutral-800 hover:border-neutral-700'
                    : 'bg-[#101010] text-neutral-500 border-neutral-900 hover:border-neutral-800'
                }`}
              >
                <span>يوم {dayNum}</span>
                {isCurrent && <span className="block text-[9px] font-black leading-tight">الآن</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Time Slot Guidance Card */}
      <div className={`p-3 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${currentSlot.bg}`}>
        <div className="flex items-center gap-2.5">
          <SlotIcon className={`w-4 h-4 ${currentSlot.color} flex-shrink-0`} />
          <div>
            <span className={`font-bold ${currentSlot.color} ml-1.5`}>{currentSlot.label}:</span>
            <span className="text-neutral-300">{currentSlot.advice}</span>
          </div>
        </div>

        <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 flex-shrink-0 self-end sm:self-center">
          <Sparkles className="w-3 h-3 text-[#d4af37]" />
          <span>مزامنة ذكية مع التوقيت الميداني</span>
        </div>
      </div>
    </div>
  );
};

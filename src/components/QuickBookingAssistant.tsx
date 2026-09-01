import React, { useState, useMemo } from 'react';
import { 
  Zap, ExternalLink, Copy, Check, Filter, Search, 
  Calendar, MapPin, Tag, ShieldCheck, Clock, Ticket, 
  Hotel, Plane, Utensils, Sparkles, AlertCircle, ArrowUpRight, 
  CheckCircle2, Bookmark
} from 'lucide-react';
import { GeneratedPlan } from '../types';
import { extractActivitiesFromPlan, ActivityBookingItem, BookingProviderLink } from '../utils/bookingUtils';

interface QuickBookingAssistantProps {
  plan: GeneratedPlan;
  initialActivityTitle?: string;
  onClose?: () => void;
  isModal?: boolean;
}

export const QuickBookingAssistant: React.FC<QuickBookingAssistantProps> = ({
  plan,
  initialActivityTitle,
  onClose,
  isModal = false,
}) => {
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(initialActivityTitle || '');
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [bookedActivityIds, setBookedActivityIds] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(`smarttravel_booked_${plan.id}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Extract all activities
  const allActivities = useMemo(() => {
    return extractActivitiesFromPlan(plan);
  }, [plan]);

  // Unique list of day numbers
  const dayNumbers = useMemo(() => {
    const days = new Set<number>();
    allActivities.forEach((act) => days.add(act.dayNumber));
    return Array.from(days).sort((a, b) => a - b);
  }, [allActivities]);

  // Filtered activities
  const filteredActivities = useMemo(() => {
    return allActivities.filter((act) => {
      // Day filter
      if (selectedDay !== 'all' && act.dayNumber.toString() !== selectedDay) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all' && act.category !== selectedCategory) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = act.title.toLowerCase().includes(q);
        const matchesTime = act.timeSlot?.toLowerCase().includes(q);
        const matchesDest = act.destination.toLowerCase().includes(q);
        if (!matchesTitle && !matchesTime && !matchesDest) return false;
      }
      return true;
    });
  }, [allActivities, selectedDay, selectedCategory, searchQuery]);

  // Toggle booked status
  const toggleBooked = (activityId: string) => {
    const updated = {
      ...bookedActivityIds,
      [activityId]: !bookedActivityIds[activityId],
    };
    setBookedActivityIds(updated);
    try {
      localStorage.setItem(`smarttravel_booked_${plan.id}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Copy link
  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLinkId(id);
    setTimeout(() => setCopiedLinkId(null), 2500);
  };

  const bookedCount = Object.values(bookedActivityIds).filter(Boolean).length;
  const totalCount = allActivities.length;
  const progressPercent = totalCount > 0 ? Math.round((bookedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1c1608] via-[#161616] to-[#0f0f0f] border border-[#d4af37]/40 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 text-xs font-black flex items-center gap-1.5 shadow">
                <Zap className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>مساعد الحجز السريع (Deep Links Engine)</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-950/50 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                روابط بحث مباشرة ومسبقة التعبئة
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              حجز فوري ومباشر لجميع محطات وتذاكر رحلة {plan.destination}
            </h2>
            <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
              يقوم النظام بإنشاء روابط بحث ذكية ومباشرة (Deep Links) لأشهر المنصات العالمية (GetYourGuide، TripAdvisor، Booking.com، وغيرها) استناداً إلى كل نشاط في جدولك لتوفير الوقت وتأكيد المقاعد بأقل الأسعار.
            </p>
          </div>

          {/* Booking Progress Tracker Card */}
          <div className="bg-[#0f0f0f]/90 border border-neutral-800 rounded-xl p-3.5 min-w-[200px] flex-shrink-0 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400 font-medium">حالة حجوزات الرحلة:</span>
              <span className="text-[#d4af37] font-black">{bookedCount} من {totalCount}</span>
            </div>
            <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#d4af37] to-emerald-400 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-neutral-500">
              <span>{progressPercent}% مكتمل</span>
              <span className="text-emerald-400 font-bold">{progressPercent === 100 ? 'جميع التذاكر مؤكدة 🎉' : 'بانتظار الحجز'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg">
        {/* Search Bar & Day selector */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-neutral-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن نشاط، معلم، متحف، أو تجربة لحجزها فوراً..."
              className="w-full bg-[#181818] border border-neutral-800 focus:border-[#d4af37] rounded-xl pr-10 pl-4 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs"
              >
                مسح
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedDay('all')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedDay === 'all'
                  ? 'bg-[#d4af37] text-black shadow'
                  : 'bg-[#181818] text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              كل الأيام
            </button>
            {dayNumbers.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDay(d.toString())}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedDay === d.toString()
                    ? 'bg-[#d4af37] text-black shadow'
                    : 'bg-[#181818] text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                اليوم {d}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-neutral-200 text-black'
                : 'bg-[#1a1a1a] text-neutral-400 hover:text-neutral-200 border border-neutral-800'
            }`}
          >
            جميع الفئات ({allActivities.length})
          </button>
          <button
            onClick={() => setSelectedCategory('attraction')}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'attraction'
                ? 'bg-[#d4af37] text-black'
                : 'bg-[#1a1a1a] text-neutral-400 hover:text-neutral-200 border border-neutral-800'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>معالم سياحية</span>
          </button>
          <button
            onClick={() => setSelectedCategory('museum')}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'museum'
                ? 'bg-[#d4af37] text-black'
                : 'bg-[#1a1a1a] text-neutral-400 hover:text-neutral-200 border border-neutral-800'
            }`}
          >
            <span>🏛️ متاحف وقلاع</span>
          </button>
          <button
            onClick={() => setSelectedCategory('hotel')}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'hotel'
                ? 'bg-[#d4af37] text-black'
                : 'bg-[#1a1a1a] text-neutral-400 hover:text-neutral-200 border border-neutral-800'
            }`}
          >
            <Hotel className="w-3.5 h-3.5" />
            <span>فنادق وإقامة</span>
          </button>
          <button
            onClick={() => setSelectedCategory('dining')}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'dining'
                ? 'bg-[#d4af37] text-black'
                : 'bg-[#1a1a1a] text-neutral-400 hover:text-neutral-200 border border-neutral-800'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>مطاعم ومقاهي</span>
          </button>
          <button
            onClick={() => setSelectedCategory('nature_adventure')}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'nature_adventure'
                ? 'bg-[#d4af37] text-black'
                : 'bg-[#1a1a1a] text-neutral-400 hover:text-neutral-200 border border-neutral-800'
            }`}
          >
            <span>🌿 طبيعة ومغامرات</span>
          </button>
        </div>
      </div>

      {/* Activity Booking Cards List */}
      <div className="space-y-4">
        {filteredActivities.length === 0 ? (
          <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-12 text-center space-y-3">
            <Ticket className="w-10 h-10 text-neutral-600 mx-auto" />
            <h4 className="text-base font-bold text-white">لم يتم العثور على أنشطة مطابقة للبحث</h4>
            <p className="text-xs text-neutral-400">جرب تغيير شروط التصفية أو مسح عبارة البحث في الأعلى.</p>
            <button
              onClick={() => { setSelectedDay('all'); setSelectedCategory('all'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-xl bg-[#1c1c1c] text-[#d4af37] text-xs font-bold border border-neutral-700 hover:bg-[#252525] cursor-pointer"
            >
              عرض جميع الأنشطة
            </button>
          </div>
        ) : (
          filteredActivities.map((act) => {
            const isBooked = !!bookedActivityIds[act.id];

            return (
              <div
                key={act.id}
                className={`bg-[#141414] border rounded-2xl p-5 sm:p-6 transition-all duration-300 shadow-xl space-y-4 ${
                  isBooked 
                    ? 'border-emerald-500/40 bg-emerald-950/10' 
                    : 'border-neutral-800 hover:border-[#d4af37]/50'
                }`}
              >
                {/* Activity Top Meta */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800/80 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 text-[#d4af37] text-[11px] font-black border border-[#d4af37]/40">
                        اليوم {act.dayNumber} {act.timeSlot ? `• ${act.timeSlot}` : ''}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#1e1e1e] text-neutral-300 text-[11px] font-medium border border-neutral-800">
                        {act.categoryLabel}
                      </span>
                      {act.estimatedPriceRange && (
                        <span className="text-[11px] text-amber-300/90 font-mono">
                          💰 التكلفة المقدرة: {act.estimatedPriceRange}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-white">{act.title}</h3>
                  </div>

                  {/* Booked Toggle Button */}
                  <button
                    onClick={() => toggleBooked(act.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer self-start sm:self-center ${
                      isBooked
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-900/30'
                        : 'bg-[#1c1c1c] hover:bg-[#252525] text-neutral-300 border border-neutral-700'
                    }`}
                  >
                    {isBooked ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span>تم حجز التذكرة ✅</span>
                      </>
                    ) : (
                      <>
                        <Ticket className="w-4 h-4 text-[#d4af37]" />
                        <span>تحديد كـ "تم الحجز"</span>
                      </>
                    )}
                  </button>
                </div>

                {/* AI Booking Tips & Window Notice */}
                {act.bookingTips && act.bookingTips.length > 0 && (
                  <div className="bg-[#181818] border border-amber-500/20 rounded-xl p-3 text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[#d4af37] font-bold text-[11px]">
                      <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>نصيحة الحجز الذكي (النافذة الموصى بها: {act.recommendedAdvanceDays}):</span>
                    </div>
                    <ul className="space-y-1 text-neutral-300 text-[11px] leading-relaxed pr-2">
                      {act.bookingTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#d4af37]">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Deep Link Provider Buttons Grid */}
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] text-neutral-400 font-bold block">
                    روابط البحث والحجز المباشر (اضغط للفتح الفوري في منصة الحجز):
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {act.links.map((link) => {
                      const isCopied = copiedLinkId === `${act.id}-${link.id}`;

                      return (
                        <div
                          key={link.id}
                          className="bg-[#101010] hover:bg-[#181818] border border-neutral-800 hover:border-[#d4af37]/60 rounded-xl p-3 transition-all flex flex-col justify-between gap-2.5 group"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1.5 mb-1">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black border flex items-center gap-1 ${link.badgeColor}`}>
                                <span>{link.logoEmoji}</span>
                                <span>{link.name}</span>
                              </span>

                              {/* Copy Deep Link URL Button */}
                              <button
                                onClick={() => handleCopyLink(link.url, `${act.id}-${link.id}`)}
                                className="text-neutral-500 hover:text-white text-[11px] p-1 cursor-pointer transition-colors"
                                title="نسخ رابط البحث المباشر"
                              >
                                {isCopied ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>

                            <p className="text-[11px] font-bold text-neutral-200 line-clamp-1">{link.tagline}</p>
                            <p className="text-[10px] text-neutral-400 line-clamp-2 mt-0.5 leading-snug">{link.description}</p>
                          </div>

                          {/* Action Button: Open in New Tab */}
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2 px-3 rounded-lg bg-[#1e1e1e] group-hover:bg-[#d4af37] text-neutral-200 group-hover:text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow"
                          >
                            <span>فتح والحجز فوراً</span>
                            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

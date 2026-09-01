import React, { useState, useMemo } from 'react';
import { 
  Lightbulb, Sparkles, Clock, Shirt, Ticket, Camera, 
  Eye, ShieldCheck, CheckCircle2, Copy, Check, Filter, 
  MessageCircle, ArrowRight, Share2, Compass, Award, Tag
} from 'lucide-react';
import { GeneratedPlan } from '../types';
import { generateSmartTipsForPlan, SmartActivityTip, SmartTipCategory } from '../utils/smartTipsUtils';

interface SmartTipsManagerProps {
  plan: GeneratedPlan;
  onOpenChat?: (initialPrompt?: string) => void;
}

export const SmartTipsManager: React.FC<SmartTipsManagerProps> = ({
  plan,
  onOpenChat,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [copiedTipId, setCopiedTipId] = useState<string | null>(null);
  const [appliedTipIds, setAppliedTipIds] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(`smarttravel_applied_tips_${plan.id}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Generate tips for plan
  const allTips = useMemo(() => {
    return generateSmartTipsForPlan(plan);
  }, [plan]);

  // Unique days list
  const dayNumbers = useMemo(() => {
    const set = new Set<number>();
    allTips.forEach((t) => set.add(t.dayNumber));
    return Array.from(set).sort((a, b) => a - b);
  }, [allTips]);

  // Filtered tips
  const filteredTips = useMemo(() => {
    return allTips.filter((tip) => {
      if (selectedCategory !== 'all' && tip.category !== selectedCategory) {
        return false;
      }
      if (selectedDay !== 'all' && tip.dayNumber.toString() !== selectedDay) {
        return false;
      }
      return true;
    });
  }, [allTips, selectedCategory, selectedDay]);

  // Toggle applied state
  const toggleApplied = (tipId: string) => {
    const updated = {
      ...appliedTipIds,
      [tipId]: !appliedTipIds[tipId],
    };
    setAppliedTipIds(updated);
    try {
      localStorage.setItem(`smarttravel_applied_tips_${plan.id}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Copy tip text
  const handleCopyTip = (tip: SmartActivityTip) => {
    const textToCopy = `💡 تلميحة ذكية لـ [${tip.activityTitle}] في ${plan.destination}:\n${tip.title}\n${tip.tipText}\n✨ الخلاصة: ${tip.highlightSnippet}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedTipId(tip.id);
    setTimeout(() => setCopiedTipId(null), 2500);
  };

  const appliedCount = Object.values(appliedTipIds).filter(Boolean).length;
  const totalCount = allTips.length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1c1808] via-[#161616] to-[#0f0f0f] border border-[#d4af37]/40 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 text-xs font-black flex items-center gap-1.5 shadow">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>التلميحات الذكية (Smart Contextual Tips Engine)</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-purple-950/50 text-purple-300 border border-purple-500/30 text-[11px] font-bold">
                توصيات محلية وحيل لتفادي الزحام
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              أسرار، توقيتات مثالية، وحيل محلية لأنشطة {plan.destination}
            </h2>
            <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
              يقوم الذكاء الاصطناعي بتحليل الأنشطة والمعالم اليومية في جدولك لتقديم نصائح دقيقة تشمل أوقات الزيارة الذهبية لتجنب الحشود، الملابس والآداب الملائمة، حيل التذاكر السريعة، وأفضل زوايا التصوير.
            </p>
          </div>

          {/* Applied Tips Counter Card */}
          <div className="bg-[#0f0f0f]/90 border border-neutral-800 rounded-xl p-3.5 min-w-[200px] flex-shrink-0 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400 font-medium">التلميحات المطبقة:</span>
              <span className="text-[#d4af37] font-black">{appliedCount} من {totalCount}</span>
            </div>
            <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#d4af37] to-purple-400 transition-all duration-500 rounded-full"
                style={{ width: `${totalCount > 0 ? (appliedCount / totalCount) * 100 : 0}%` }}
              />
            </div>
            <div className="text-[10px] text-neutral-500 text-left">
              {appliedCount > 0 ? `تم تجهيز ${appliedCount} نصيحة لرحلتك` : 'اضغط "تطبيق التلميحة" لحفظها'}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Day Selector */}
      <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-neutral-800/80 pb-3">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Filter className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="font-bold text-white">تصفية التلميحات حسب الفئة:</span>
          </div>

          {/* Day selection */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs w-full sm:w-auto">
            <button
              onClick={() => setSelectedDay('all')}
              className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer ${
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
                className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer ${
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

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-neutral-200 text-black'
                : 'bg-[#1a1a1a] text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            كل الفئات ({allTips.length})
          </button>
          <button
            onClick={() => setSelectedCategory('timing_crowds')}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'timing_crowds'
                ? 'bg-amber-400 text-black'
                : 'bg-[#1a1a1a] text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <span>⏰ توقيت الزيارة وتجنب الزحام</span>
          </button>
          <button
            onClick={() => setSelectedCategory('dress_code')}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'dress_code'
                ? 'bg-blue-400 text-black'
                : 'bg-[#1a1a1a] text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <span>👔 اللباس والآداب المحلية</span>
          </button>
          <button
            onClick={() => setSelectedCategory('ticket_hacks')}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'ticket_hacks'
                ? 'bg-emerald-400 text-black'
                : 'bg-[#1a1a1a] text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <span>🎟️ حيل التذاكر والتوفير</span>
          </button>
          <button
            onClick={() => setSelectedCategory('photography')}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'photography'
                ? 'bg-purple-400 text-black'
                : 'bg-[#1a1a1a] text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <span>📸 زوايا التصوير والإضاءة</span>
          </button>
          <button
            onClick={() => setSelectedCategory('hidden_secrets')}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'hidden_secrets'
                ? 'bg-rose-400 text-black'
                : 'bg-[#1a1a1a] text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <span>🤫 أسرار وزوايا خفية</span>
          </button>
        </div>
      </div>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTips.map((tip) => {
          const isApplied = !!appliedTipIds[tip.id];
          const isCopied = copiedTipId === tip.id;

          return (
            <div
              key={tip.id}
              className={`bg-[#141414] border rounded-2xl p-5 transition-all duration-300 shadow-xl flex flex-col justify-between gap-4 ${
                isApplied
                  ? 'border-emerald-500/40 bg-emerald-950/10'
                  : 'border-neutral-800 hover:border-[#d4af37]/50'
              }`}
            >
              <div className="space-y-3">
                {/* Top Meta */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-black border flex items-center gap-1 ${tip.badgeColor}`}>
                      <span>{tip.icon}</span>
                      <span>{tip.categoryLabel}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#1e1e1e] text-neutral-400 text-[10px] font-bold border border-neutral-800">
                      اليوم {tip.dayNumber} {tip.timeSlot ? `• ${tip.timeSlot}` : ''}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopyTip(tip)}
                    className="text-neutral-500 hover:text-white p-1 cursor-pointer transition-colors"
                    title="نسخ التلميحة"
                  >
                    {isCopied ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Activity & Tip Title */}
                <div>
                  <span className="text-[11px] text-[#d4af37] font-bold block mb-0.5">
                    📍 {tip.activityTitle}
                  </span>
                  <h3 className="text-base font-black text-white">{tip.title}</h3>
                </div>

                {/* Full Tip Content */}
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {tip.tipText}
                </p>

                {/* Highlight Snippet Box */}
                <div className="bg-[#191919] border border-neutral-800/80 rounded-xl p-2.5 flex items-start gap-2 text-[11px] text-amber-200/90 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-[#d4af37] flex-shrink-0 mt-0.5" />
                  <span><strong>خلاصة سريعة:</strong> {tip.highlightSnippet}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-neutral-800/80">
                <button
                  onClick={() => toggleApplied(tip.id)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isApplied
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow'
                      : 'bg-[#1e1e1e] hover:bg-[#282828] text-neutral-200 border border-neutral-700'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isApplied ? 'تم التجهيز والاعتماد ✅' : 'تطبيق هذه النصيحة'}</span>
                </button>

                {onOpenChat && (
                  <button
                    onClick={() => onOpenChat(`أود الاستفسار أكثر عن تلميحة [${tip.title}] الخاصة بـ [${tip.activityTitle}] في ${plan.destination}. كيف يمكنني تطبيقها بدقة؟`)}
                    className="py-2 px-3 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] text-[#d4af37] border border-[#d4af37]/40 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    title="سؤال المستشار الذكي حول هذه التلميحة"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">اسأل AI</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

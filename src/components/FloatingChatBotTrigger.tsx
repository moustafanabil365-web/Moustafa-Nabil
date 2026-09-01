import React, { useState } from 'react';
import { Sparkles, MessageSquare, X, Zap } from 'lucide-react';
import { GeneratedPlan } from '../types';

interface FloatingChatBotTriggerProps {
  onOpenChat: (initialMsg?: string) => void;
  plan: GeneratedPlan | null;
  isOpen: boolean;
}

export const FloatingChatBotTrigger: React.FC<FloatingChatBotTriggerProps> = ({
  onOpenChat,
  plan,
  isOpen,
}) => {
  const [showTeaser, setShowTeaser] = useState(true);

  if (isOpen) return null; // Hide floating trigger when chat modal is open

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start gap-2.5 font-['Cairo',sans-serif] pointer-events-auto">
      {/* Quick Interactive Prompt Bubble / Teaser */}
      {showTeaser && (
        <div className="bg-[#0b1220]/95 backdrop-blur-md border border-[#d4af37]/60 text-white rounded-3xl p-4 shadow-[0_0_30px_rgba(212,175,55,0.2)] max-w-xs animate-in fade-in slide-in-from-bottom-3 relative overflow-hidden">
          {/* Subtle Hieroglyphs Watermark */}
          <div className="absolute top-1 left-3 text-[10px] opacity-10 text-[#d4af37] font-serif select-none pointer-events-none">
            𓂀 𓆣 𓋹 𓊪
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTeaser(false);
            }}
            className="absolute top-2.5 left-2.5 text-neutral-400 hover:text-white text-xs p-1 cursor-pointer"
            title="إخفاء الرسالة"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5 pr-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-black text-[#f5d061] flex items-center gap-1.5">
              <span>𓂀</span>
              <span>المستشار الملكي الذكي متاح للرد الفوري</span>
            </span>
          </div>

          <p className="text-xs text-[#cad8eb] leading-relaxed pr-1 mb-3">
            {plan ? (
              <>
                هل تود تعديل مسار <strong>{plan.destination}</strong>، استكشاف المعالم الفرعونية، أو اقتراح بدائل سريعة؟
              </>
            ) : (
              'هل تبحث عن مسار سياحي فاخر أو استشارة فورية لرحلتك القادمة؟'
            )}
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onOpenChat()}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e6b800] hover:from-[#f5d061] hover:to-[#d4af37] text-black font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-md shadow-[#d4af37]/20"
            >
              <MessageSquare className="w-3.5 h-3.5 text-black" />
              <span>تحدث مع المستشار</span>
            </button>
            <button
              onClick={() => onOpenChat(plan ? `اقترح لي أفضل 3 خيارات للطعام والتجارب في ${plan.destination}` : 'ما هي أفضل الوجهات السياحية لهذا الموسم؟')}
              className="px-2.5 py-1.5 rounded-xl bg-[#141f33] hover:bg-[#1d2c47] text-[#d3e2f5] border border-[#d4af37]/30 text-[11px] font-medium transition-all cursor-pointer truncate max-w-[130px]"
            >
              💡 سؤال سريع
            </button>
          </div>
        </div>
      )}

      {/* Main Floating Button Badge */}
      <button
        id="floating-chatbot-btn"
        onClick={() => onOpenChat()}
        className="group relative flex items-center gap-3 bg-gradient-to-r from-[#0d1626] via-[#101b30] to-[#070b14] hover:from-[#17253f] hover:via-[#1a2b4a] hover:to-[#0c1322] border-2 border-[#d4af37] hover:border-[#f5d061] text-white px-4 py-3 sm:px-5 sm:py-3.5 rounded-full shadow-[0_0_25px_rgba(0,0,0,0.9),0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        aria-label="تحدث مع المستشار الذكي"
        title="اضغط للتحدث مع المستشار الملكي الذكي AI"
      >
        {/* Animated Glow Ring */}
        <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-[#d4af37] to-amber-500 opacity-40 blur group-hover:opacity-75 transition duration-500 animate-pulse pointer-events-none"></span>

        {/* Eye of Horus / Bot Icon with glowing badge */}
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] to-[#8a6d1c] group-hover:from-[#f5d061] group-hover:to-[#d4af37] text-black flex items-center justify-center font-black shadow-lg transition-transform group-hover:scale-110">
            <span className="text-xl font-serif">𓂀</span>
          </div>
          {/* Online green indicator pulse */}
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#090f1d]"></span>
          </span>
        </div>

        {/* Text Details */}
        <div className="text-right flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <span className="text-xs sm:text-sm font-black text-white group-hover:text-[#f5d061] transition-colors">
              استشارة المستشار الملكي
            </span>
            <span className="px-1.5 py-0.2 rounded bg-[#d4af37]/20 text-[#f5d061] text-[10px] font-extrabold border border-[#d4af37]/40 hidden sm:inline-block">
              AI Bot 𓂀
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#9bb0cb] group-hover:text-neutral-200 truncate max-w-[160px] sm:max-w-[200px]">
            {plan ? `مستشار رحلة ${plan.destination}` : 'استشارات سريعة وقرارات فورية'}
          </span>
        </div>

        {/* Action Icon */}
        <div className="mr-1 hidden sm:flex items-center justify-center w-7 h-7 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-black transition-all">
          <Zap className="w-3.5 h-3.5" />
        </div>
      </button>
    </div>
  );
};

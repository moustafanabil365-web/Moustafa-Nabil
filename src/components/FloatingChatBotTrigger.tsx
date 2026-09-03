import React, { useState } from 'react';
import { Sparkles, MessageSquare, X, Zap } from 'lucide-react';
import { GeneratedPlan } from '../types';
import { SupportedLanguage, getTranslation } from '../utils/i18n';

interface FloatingChatBotTriggerProps {
  onOpenChat: (initialMsg?: string) => void;
  plan: GeneratedPlan | null;
  isOpen: boolean;
  currentLanguage?: SupportedLanguage;
}

export const FloatingChatBotTrigger: React.FC<FloatingChatBotTriggerProps> = ({
  onOpenChat,
  plan,
  isOpen,
  currentLanguage = 'ar',
}) => {
  const [showTeaser, setShowTeaser] = useState(true);

  if (isOpen) return null; // Hide floating trigger when chat modal is open

  return (
    <div className={`fixed bottom-6 ${currentLanguage === 'ar' ? 'left-6' : 'right-6'} z-40 flex flex-col ${currentLanguage === 'ar' ? 'items-start' : 'items-end'} gap-2.5 pointer-events-auto`}>
      {/* Quick Interactive Prompt Bubble / Teaser */}
      {showTeaser && (
        <div className="bg-[#0b1220]/95 backdrop-blur-md border border-[#d4af37]/60 text-white rounded-3xl p-4 shadow-[0_0_30px_rgba(212,175,55,0.2)] max-w-xs animate-in fade-in slide-in-from-bottom-3 relative overflow-hidden">
          {/* Subtle Watermark */}
          <div className="absolute top-1 left-3 text-[10px] opacity-10 text-[#d4af37] font-serif select-none pointer-events-none">
            👑 ✨ ⚡
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTeaser(false);
            }}
            className={`absolute top-2.5 ${currentLanguage === 'ar' ? 'left-2.5' : 'right-2.5'} text-neutral-400 hover:text-white text-xs p-1 cursor-pointer`}
            title={getTranslation(currentLanguage, 'close')}
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5 pr-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-black text-[#f5d061] flex items-center gap-1.5">
              <span>{getTranslation(currentLanguage, 'chat_bot_available')}</span>
            </span>
          </div>

          <p className="text-xs text-[#cad8eb] leading-relaxed pr-1 mb-3">
            {plan ? (
              currentLanguage === 'ar' ? (
                <>هل تود تعديل مسار <strong>{plan.destination}</strong>، استكشاف المعالم الفريدة، أو اقتراح بدائل سريعة؟</>
              ) : (
                <>Would you like to customize your <strong>{plan.destination}</strong> route, explore attractions, or get smart alternatives?</>
              )
            ) : (
              getTranslation(currentLanguage, 'chat_teaser_default')
            )}
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onOpenChat()}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e6b800] hover:from-[#f5d061] hover:to-[#d4af37] text-black font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-md shadow-[#d4af37]/20"
            >
              <MessageSquare className="w-3.5 h-3.5 text-black" />
              <span>{getTranslation(currentLanguage, 'chat_talk_btn')}</span>
            </button>
            <button
              onClick={() => onOpenChat(plan ? (currentLanguage === 'ar' ? `اقترح لي أفضل 3 خيارات للطعام والتجارب في ${plan.destination}` : `Suggest the top 3 dining and experience spots in ${plan.destination}`) : (currentLanguage === 'ar' ? 'ما هي أفضل الوجهات السياحية لهذا الموسم؟' : 'What are the top recommended travel destinations for this season?'))}
              className="px-2.5 py-1.5 rounded-xl bg-[#141f33] hover:bg-[#1d2c47] text-[#d3e2f5] border border-[#d4af37]/30 text-[11px] font-medium transition-all cursor-pointer truncate max-w-[130px]"
            >
              {getTranslation(currentLanguage, 'chat_quick_q_btn')}
            </button>
          </div>
        </div>
      )}

      {/* Main Floating Button Badge */}
      <button
        id="floating-chatbot-btn"
        onClick={() => onOpenChat()}
        className="group relative flex items-center gap-2.5 bg-gradient-to-r from-[#0d1626] via-[#101b30] to-[#070b14] hover:from-[#17253f] hover:via-[#1a2b4a] hover:to-[#0c1322] border border-[#d4af37]/80 hover:border-[#f5d061] text-white px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full shadow-[0_0_18px_rgba(0,0,0,0.8),0_0_10px_rgba(212,175,55,0.2)] hover:shadow-[0_0_22px_rgba(212,175,55,0.35)] transform hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
        aria-label={getTranslation(currentLanguage, 'chat_royal_title')}
        title={getTranslation(currentLanguage, 'chat_royal_title')}
      >
        {/* Animated Glow Ring */}
        <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-[#d4af37] to-amber-500 opacity-30 blur-sm group-hover:opacity-60 transition duration-500 pointer-events-none"></span>

        {/* Bot Icon with glowing badge */}
        <div className="relative flex-shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#d4af37] to-[#8a6d1c] group-hover:from-[#f5d061] group-hover:to-[#d4af37] text-black flex items-center justify-center font-black shadow-md transition-transform group-hover:scale-105">
            <span className="text-sm sm:text-base">👑</span>
          </div>
          {/* Online green indicator pulse */}
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-[#090f1d]"></span>
          </span>
        </div>

        {/* Text Details */}
        <div className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'} flex flex-col justify-center`}>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] sm:text-xs font-bold text-white group-hover:text-[#f5d061] transition-colors leading-tight">
              {getTranslation(currentLanguage, 'chat_royal_title')}
            </span>
            <span className="px-1 py-0.2 rounded bg-[#d4af37]/20 text-[#f5d061] text-[9px] font-extrabold border border-[#d4af37]/40 hidden sm:inline-block leading-none">
              AI Concierge
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] text-[#9bb0cb] group-hover:text-neutral-200 truncate max-w-[140px] sm:max-w-[170px] leading-tight mt-0.5">
            {plan ? (currentLanguage === 'ar' ? `مستشار رحلة ${plan.destination}` : `${plan.destination} Advisor`) : getTranslation(currentLanguage, 'chat_online_desc')}
          </span>
        </div>

        {/* Action Icon */}
        <div className="mr-0.5 hidden sm:flex items-center justify-center w-5 h-5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-black transition-all">
          <Zap className="w-2.5 h-2.5" />
        </div>
      </button>
    </div>
  );
};

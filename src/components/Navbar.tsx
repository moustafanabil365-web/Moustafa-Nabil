import React, { useState } from 'react';
import { 
  Bookmark, PlusCircle, Sparkles, ListTodo, Bot, 
  Globe, Eye, EyeOff, ShieldCheck, Zap, CreditCard, ChevronDown, Compass
} from 'lucide-react';
import { AuthProfileBadge } from './AuthProfileBadge';
import { User } from 'firebase/auth';
import { SupportedLanguage, SUPPORTED_LANGUAGES, getTranslation } from '../utils/i18n';

interface NavbarProps {
  onNewTrip: () => void;
  onOpenSaved: () => void;
  onOpenReminders?: () => void;
  onOpenChat?: () => void;
  onOpenDirectBooking?: () => void;
  onOpenHajjUmrah?: () => void;
  onOpenPalestine?: () => void;
  onOpenOfficialProviders?: () => void;
  onOpenExtraServices?: () => void;
  savedCount: number;
  remindersPendingCount?: number;
  hasActivePlan: boolean;
  currentUser?: User | null;
  isAuthLoading?: boolean;
  currentLanguage?: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
  isEyeComfortMode?: boolean;
  onToggleEyeComfort?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewTrip,
  onOpenSaved,
  onOpenReminders,
  onOpenChat,
  onOpenDirectBooking,
  onOpenHajjUmrah,
  onOpenPalestine,
  onOpenOfficialProviders,
  onOpenExtraServices,
  savedCount,
  remindersPendingCount = 0,
  hasActivePlan,
  currentUser = null,
  isAuthLoading = false,
  currentLanguage = 'ar',
  onLanguageChange,
  isEyeComfortMode = false,
  onToggleEyeComfort,
}) => {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const selectedLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b shadow-xl transition-colors duration-300 ${
      isEyeComfortMode 
        ? 'bg-[#151922]/98 border-amber-400/30 text-[#f0f4fc]' 
        : 'bg-slate-950/95 border-amber-400/25 text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo & Modern Header */}
        <div 
          onClick={onNewTrip} 
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group flex-shrink-0"
          id="brand-logo"
        >
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-600 p-0.5 shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
              <Compass className="w-6 h-6 text-amber-400 group-hover:rotate-45 transition-transform duration-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg lg:text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                <span className="bg-gradient-to-r from-white via-amber-100 to-amber-400 bg-clip-text text-transparent">TraviQ</span>
                <span className="text-amber-400 font-extrabold">Smart Travel</span>
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/40">
                <span>✨</span>
                <span>البوابة الرسمية لحجوزات السفر الذكية</span>
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 tracking-wide flex items-center gap-1.5">
              <span>{getTranslation(currentLanguage, 'all_ages_friendly')}</span>
              <span className="hidden lg:inline text-amber-400/80">• خطط ذكية وربط مباشر مع 100+ جهة معتمدة</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">

          {/* Official Providers Directory Button */}
          {onOpenOfficialProviders && (
            <button
              type="button"
              id="official-providers-nav-btn"
              onClick={onOpenOfficialProviders}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/30 hover:from-amber-500/30 hover:to-amber-600/40 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all cursor-pointer shadow-md shadow-amber-500/10 hover:scale-[1.02]"
              title="دليل المصادر ومواقع الحجز الرسمية في العالم"
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden md:inline">المواقع الرسمية (100+)</span>
              <span className="md:hidden">المواقع الرسمية</span>
            </button>
          )}

          {/* Extra Travel Add-on Services Hub Button */}
          {onOpenExtraServices && (
            <button
              type="button"
              id="extra-travel-services-nav-btn"
              onClick={onOpenExtraServices}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-gradient-to-r from-sky-500/20 to-indigo-600/30 hover:from-sky-500/30 hover:to-indigo-600/40 text-sky-300 border border-sky-500/40 text-xs font-bold transition-all cursor-pointer shadow-md shadow-sky-500/10 hover:scale-[1.02]"
              title="خدمات السفر الإضافية: تأمين السفر، eSIM، النقل الخاص، وصالات المطار"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden lg:inline">خدمات السفر (eSIM / تأمين)</span>
              <span className="lg:hidden">خدمات السفر</span>
            </button>
          )}

          {/* Quick Hub Buttons for Religious Travel */}
          {onOpenHajjUmrah && (
            <button
              type="button"
              id="hajj-umrah-nav-btn"
              onClick={onOpenHajjUmrah}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/30 hover:from-amber-500/30 hover:to-amber-600/40 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all cursor-pointer shadow-md shadow-amber-500/10 hover:scale-[1.02]"
              title="خدمات الحج والعمرة ومنصة نسك"
            >
              <span className="text-sm">🕋</span>
              <span className="hidden lg:inline">{getTranslation(currentLanguage, 'nav_hajj_umrah')}</span>
            </button>
          )}

          {onOpenPalestine && (
            <button
              type="button"
              id="palestine-jerusalem-nav-btn"
              onClick={onOpenPalestine}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-600/30 hover:from-emerald-500/30 hover:to-teal-600/40 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all cursor-pointer shadow-md shadow-emerald-500/10 hover:scale-[1.02]"
              title="مسار القدس الشريف وفلسطين المباركة"
            >
              <span className="text-sm">🇵🇸</span>
              <span className="hidden xl:inline">{getTranslation(currentLanguage, 'nav_palestine_jerusalem')}</span>
            </button>
          )}
          
          {/* Eye Comfort Mode Switcher */}
          {onToggleEyeComfort && (
            <button
              type="button"
              id="eye-comfort-toggle-btn"
              onClick={onToggleEyeComfort}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isEyeComfortMode
                  ? 'bg-amber-950/60 border-amber-500 text-amber-300 shadow-md shadow-amber-500/20'
                  : 'bg-[#0e1627] hover:bg-[#15223c] border-neutral-800 text-neutral-300 hover:text-white'
              }`}
              title={getTranslation(currentLanguage, 'nav_eye_comfort')}
            >
              {isEyeComfortMode ? <Eye className="w-4 h-4 text-amber-400" /> : <EyeOff className="w-4 h-4 text-neutral-400" />}
              <span className="hidden 2xl:inline">{getTranslation(currentLanguage, 'nav_eye_comfort')}</span>
            </button>
          )}

          {/* Language Selector Dropdown */}
          {onLanguageChange && (
            <div className="relative">
              <button
                type="button"
                id="language-selector-btn"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-[#0e1627] hover:bg-[#15223c] border border-neutral-800 hover:border-[#d4af37]/50 text-xs font-bold text-neutral-200 transition-all cursor-pointer"
                title="تغيير اللغة (Change Language)"
              >
                <span className="text-base">{selectedLangObj.flag}</span>
                <span className="hidden sm:inline">{selectedLangObj.nativeName}</span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {isLangMenuOpen && (
                <div 
                  className="absolute left-0 sm:right-0 mt-2 w-52 bg-[#0b1220] border border-[#d4af37]/40 rounded-2xl p-1.5 shadow-2xl z-50 animate-in fade-in"
                  onClick={() => setIsLangMenuOpen(false)}
                >
                  <div className="px-3 py-1.5 border-b border-neutral-800 text-[10px] font-bold text-[#d4af37]">
                    اختر اللغة (Select Language)
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-0.5 mt-1">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          onLanguageChange(lang.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-right ${
                          currentLanguage === lang.code
                            ? 'bg-[#d4af37] text-black font-black'
                            : 'text-neutral-300 hover:bg-[#16233f] hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-base">{lang.flag}</span>
                          <span>{lang.nativeName}</span>
                        </span>
                        <span className="text-[10px] opacity-75 font-mono">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Direct Booking Hub Shortcut Button */}
          {onOpenDirectBooking && hasActivePlan && (
            <button
              id="direct-booking-hub-nav-btn"
              onClick={onOpenDirectBooking}
              className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-black px-3 sm:px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black transition-all cursor-pointer shadow-lg shadow-emerald-500/20 hover:scale-[1.03]"
              title="مركز الحجز والتنفيذ المباشر بدون وسيط"
            >
              <Zap className="w-4 h-4" />
              <span className="hidden md:inline">الحجز والتنفيذ المباشر</span>
              <span className="md:hidden">حجز رسمي</span>
            </button>
          )}

          {/* Talk to Bot Button in Header */}
          {onOpenChat && (
            <button
              id="talk-to-bot-nav-btn"
              onClick={onOpenChat}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-black px-3 sm:px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e6b800] hover:from-[#f5d061] hover:to-[#d4af37] text-black transition-all cursor-pointer shadow-lg shadow-[#d4af37]/25 hover:scale-[1.03]"
              title="تحدث مع المستشار الملكي الذكي"
            >
              <span className="text-sm">𓂀</span>
              <span className="hidden lg:inline">{getTranslation(currentLanguage, 'nav_chat_bot')}</span>
            </button>
          )}

          {/* Reminders & To-Dos Button */}
          {onOpenReminders && (
            <button
              id="travel-reminders-nav-btn"
              onClick={onOpenReminders}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-2.5 sm:px-3 py-2 rounded-xl bg-[#0e1627] hover:bg-[#15223c] text-neutral-200 border border-[#d4af37]/30 hover:border-[#d4af37] transition-all relative cursor-pointer"
              title="مهام وتذكيرات السفر"
            >
              <ListTodo className="w-4 h-4 text-[#d4af37]" />
              <span className="hidden xl:inline">{getTranslation(currentLanguage, 'nav_reminders')}</span>
              {remindersPendingCount > 0 && (
                <span className="w-4.5 h-4.5 flex items-center justify-center text-[10px] font-extrabold rounded-full bg-[#d4af37] text-black">
                  {remindersPendingCount}
                </span>
              )}
            </button>
          )}

          {hasActivePlan && (
            <button
              id="new-trip-nav-btn"
              onClick={onNewTrip}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-2.5 sm:px-3 py-2 rounded-xl bg-[#0e1627] hover:bg-[#15223c] text-neutral-200 border border-[#d4af37]/30 hover:border-[#d4af37] transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-[#d4af37]" />
              <span className="hidden sm:inline">{getTranslation(currentLanguage, 'nav_new_trip')}</span>
            </button>
          )}

          <button
            id="saved-trips-nav-btn"
            onClick={onOpenSaved}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-2.5 sm:px-3 py-2 rounded-xl bg-[#0e1627] hover:bg-[#15223c] text-neutral-200 border border-[#d4af37]/30 hover:border-[#d4af37] transition-all relative cursor-pointer"
          >
            <Bookmark className="w-4 h-4 text-[#d4af37]" />
            <span className="hidden sm:inline">{getTranslation(currentLanguage, 'nav_saved_trips')}</span>
            {savedCount > 0 && (
              <span className="w-4.5 h-4.5 flex items-center justify-center text-[10px] font-extrabold rounded-full bg-[#d4af37] text-black">
                {savedCount}
              </span>
            )}
          </button>

          {/* User Auth Profile Badge */}
          <AuthProfileBadge user={currentUser} isLoading={isAuthLoading} />
        </div>
      </div>
    </header>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bookmark, PlusCircle, ListTodo, 
  Eye, EyeOff, ChevronDown, Compass, Globe2, ShieldCheck, Plane, Building, Car, Briefcase, Landmark, Map, Zap, PlaneTakeoff, HeartHandshake, MapPin
} from 'lucide-react';
import { AuthProfileBadge } from './AuthProfileBadge';
import { User } from 'firebase/auth';
import { SupportedLanguage, SUPPORTED_LANGUAGES, getTranslation } from '../utils/i18n';

interface NavbarProps {
  onNewTrip: () => void;
  onOpenSaved: () => void;
  onOpenReminders?: () => void;
  onOpenOfficialProviders?: () => void;
  onOpenDirectBooking?: () => void;
  onOpenHajjUmrah?: () => void;
  onOpenPalestine?: () => void;
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
  onOpenOfficialProviders,
  onOpenDirectBooking,
  onOpenHajjUmrah,
  onOpenPalestine,
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
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const servicesMenuRef = useRef<HTMLDivElement>(null);

  const selectedLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];
  const isRtl = currentLanguage === 'ar';

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
      if (servicesMenuRef.current && !servicesMenuRef.current.contains(event.target as Node)) {
        setIsServicesMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b shadow-lg transition-colors duration-300 ${
      isEyeComfortMode 
        ? 'bg-[#121620]/95 border-amber-400/20 text-[#f0f4fc]' 
        : 'bg-[#080b11]/95 border-amber-400/20 text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3">
        
        {/* Brand Logo */}
        <div 
          onClick={onNewTrip} 
          className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
          id="brand-logo"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-600 p-0.5 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-amber-400">
              <Compass className="w-5 h-5 text-amber-400 group-hover:rotate-45 transition-transform duration-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                <span className="bg-gradient-to-r from-white via-amber-100 to-amber-400 bg-clip-text text-transparent">TraviQ</span>
                <span className="text-amber-400 font-extrabold text-sm sm:text-base">Smart Travel</span>
              </h1>
              <span className="hidden lg:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30">
                {getTranslation(currentLanguage, 'smart_booking_gateway')}
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 tracking-wide flex items-center gap-1.5">
              <span>{getTranslation(currentLanguage, 'all_ages_friendly')}</span>
              <span className="hidden xl:inline text-amber-400/70">• {getTranslation(currentLanguage, 'direct_from_sources')}</span>
            </p>
          </div>
        </div>

        {/* Navigation & Action Controls */}
        <div className="flex items-center gap-2">

          {/* Unified Entry: Official Services & Portals Directory */}
          <div className="relative" ref={servicesMenuRef}>
            <button
              type="button"
              id="official-providers-directory-nav-btn"
              onClick={() => setIsServicesMenuOpen(!isServicesMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-amber-400/40 shadow-sm"
              title={getTranslation(currentLanguage, 'nav_official_directory')}
            >
              <Globe2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{getTranslation(currentLanguage, 'nav_official_directory')}</span>
              <span className="sm:hidden">{isRtl ? 'الخدمات' : 'Services'}</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isServicesMenuOpen ? 'rotate-180 text-amber-400' : ''}`} />
            </button>

            {isServicesMenuOpen && (
              <div 
                className={`absolute top-full ${isRtl ? 'left-0 sm:-right-0 sm:left-auto' : 'right-0 sm:-right-0 sm:left-auto'} mt-2 w-[280px] sm:w-[320px] bg-slate-900/98 backdrop-blur-xl border border-amber-400/30 rounded-2xl p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-3 max-h-[85vh] overflow-y-auto`}
              >
                {/* Official Sources */}
                {onOpenOfficialProviders && (
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                      {isRtl ? 'المصادر الرسمية' : 'Official Sources'}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onOpenOfficialProviders();
                        setIsServicesMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer bg-slate-800/50 hover:bg-slate-800 text-slate-200 border border-transparent hover:border-amber-400/20"
                    >
                      <Building className="w-4 h-4 text-amber-400" />
                      <div className="flex flex-col items-start">
                        <span>{getTranslation(currentLanguage, 'nav_official_directory')}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{isRtl ? 'فنادق، طيران، بوابات حكومية' : 'Hotels, Airlines, Gov Portals'}</span>
                      </div>
                    </button>
                  </div>
                )}

                {/* Travel Services */}
                {onOpenExtraServices && (
                  <div className="space-y-1 pt-2 border-t border-white/5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                      {isRtl ? 'خدمات السفر الإضافية' : 'Travel Services'}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onOpenExtraServices();
                        setIsServicesMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer bg-slate-800/50 hover:bg-slate-800 text-slate-200 border border-transparent hover:border-amber-400/20"
                    >
                      <Briefcase className="w-4 h-4 text-amber-400" />
                      <div className="flex flex-col items-start">
                        <span>{isRtl ? 'الخدمات الإضافية الموحدة' : 'Extra Travel Services'}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{isRtl ? 'تأمين، اتصالات، نقل، وتخزين' : 'Insurance, eSIM, Transfers'}</span>
                      </div>
                    </button>
                  </div>
                )}

                {/* Religious Travel */}
                {onOpenHajjUmrah && (
                  <div className="space-y-1 pt-2 border-t border-white/5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                      {isRtl ? 'السياحة الدينية' : 'Religious Travel'}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onOpenHajjUmrah();
                        setIsServicesMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer bg-slate-800/50 hover:bg-slate-800 text-slate-200 border border-transparent hover:border-amber-400/20"
                    >
                      <Landmark className="w-4 h-4 text-amber-400" />
                      <div className="flex flex-col items-start">
                        <span>{isRtl ? 'خدمات الحج والعمرة' : 'Hajj & Umrah Services'}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{isRtl ? 'بوابة نسك والجهات الرسمية' : 'Nusuk & Official Portals'}</span>
                      </div>
                    </button>
                  </div>
                )}

                {/* Special Routes */}
                {onOpenPalestine && (
                  <div className="space-y-1 pt-2 border-t border-white/5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                      {isRtl ? 'مسارات خاصة' : 'Special Routes'}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onOpenPalestine();
                        setIsServicesMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer bg-slate-800/50 hover:bg-slate-800 text-slate-200 border border-transparent hover:border-emerald-500/30"
                    >
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      <div className="flex flex-col items-start text-left rtl:text-right">
                        <span className="text-emerald-400">{isRtl ? 'فلسطين والقدس' : 'Palestine & Jerusalem'}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{isRtl ? 'مسارات دينية وتاريخية' : 'Religious & Historical Routes'}</span>
                      </div>
                    </button>
                  </div>
                )}

                {/* Booking */}
                {onOpenDirectBooking && (
                  <div className="space-y-1 pt-2 border-t border-white/5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                      {isRtl ? 'الحجوزات المباشرة' : 'Direct Booking'}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onOpenDirectBooking();
                        setIsServicesMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer bg-slate-800/50 hover:bg-slate-800 text-slate-200 border border-transparent hover:border-amber-400/20"
                    >
                      <Zap className="w-4 h-4 text-amber-400" />
                      <div className="flex flex-col items-start">
                        <span>{isRtl ? 'بوابة الحجز المباشر' : 'Direct Booking Gateway'}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{isRtl ? 'تنفيذ الحجز بدون وسيط' : 'Book directly with providers'}</span>
                      </div>
                    </button>
                  </div>
                )}

              </div>
            )}
          </div>

          {/* Saved Trips Button */}
          <button
            type="button"
            id="saved-trips-nav-btn"
            onClick={onOpenSaved}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700"
            title={getTranslation(currentLanguage, 'nav_saved_trips')}
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">{getTranslation(currentLanguage, 'nav_saved_trips')}</span>
            {savedCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-black">
                {savedCount}
              </span>
            )}
          </button>

          {/* Reminders / Tasks Button */}
          {onOpenReminders && (
            <button
              type="button"
              id="reminders-nav-btn"
              onClick={onOpenReminders}
              className="relative p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
              title={getTranslation(currentLanguage, 'nav_reminders')}
            >
              <ListTodo className="w-4 h-4 text-amber-400" />
              {remindersPendingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-black flex items-center justify-center animate-pulse">
                  {remindersPendingCount}
                </span>
              )}
            </button>
          )}

          {/* Eye Comfort Mode Toggle */}
          {onToggleEyeComfort && (
            <button
              type="button"
              id="eye-comfort-nav-btn"
              onClick={onToggleEyeComfort}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isEyeComfortMode
                  ? 'bg-amber-400/20 text-amber-300 border-amber-400/50 shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
              }`}
              title={isEyeComfortMode ? getTranslation(currentLanguage, 'eye_comfort_active') : getTranslation(currentLanguage, 'nav_eye_comfort')}
            >
              {isEyeComfortMode ? <Eye className="w-4 h-4 text-amber-300" /> : <EyeOff className="w-4 h-4" />}
            </button>
          )}

          {/* Language Selector Dropdown */}
          <div className="relative" ref={langMenuRef}>
            <button
              type="button"
              id="language-selector-nav-btn"
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-750 hover:border-amber-400/40 transition-all cursor-pointer"
              title={getTranslation(currentLanguage, 'nav_language')}
            >
              <span className="text-sm">{selectedLangObj.flag}</span>
              <span className="hidden sm:inline font-sans">{selectedLangObj.nativeName}</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isLangMenuOpen ? 'rotate-180 text-amber-400' : ''}`} />
            </button>

            {isLangMenuOpen && (
              <div 
                className={`absolute ${isRtl ? 'left-0' : 'right-0'} mt-2 w-48 bg-slate-900/98 backdrop-blur-xl border border-amber-400/30 rounded-2xl p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-0.5`}
              >
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-white/10 mb-1">
                  {getTranslation(currentLanguage, 'nav_language')}
                </div>
                {SUPPORTED_LANGUAGES.map((lang) => {
                  const isCurrent = lang.code === currentLanguage;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        onLanguageChange?.(lang.code);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30 font-black'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.nativeName}</span>
                      </span>
                      {isCurrent && <span className="text-amber-400 text-xs">✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* User Auth Profile Badge */}
          <AuthProfileBadge user={currentUser} isLoading={isAuthLoading} />

        </div>

      </div>
    </header>
  );
};

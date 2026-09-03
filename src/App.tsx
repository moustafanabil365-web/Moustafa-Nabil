import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { ConstraintForm } from './components/ConstraintForm';
import { ItineraryViewer } from './components/ItineraryViewer';
import { DecisionAssistantChat } from './components/DecisionAssistantChat';
import { FloatingChatBotTrigger } from './components/FloatingChatBotTrigger';
import { SavedTripsDrawer } from './components/SavedTripsDrawer';
import { TravelRemindersDrawer } from './components/TravelRemindersDrawer';
import { TravelConstraints, GeneratedPlan, TravelReminder } from './types';
import { AlertCircle, RefreshCw, X } from 'lucide-react';
import { cachePlanForOffline, registerServiceWorker, getOfflinePlanById } from './utils/offlineStorage';
import { auth, saveTripToCloud, deleteTripFromCloud, fetchUserTripsFromCloud } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { SupportedLanguage, SUPPORTED_LANGUAGES, getTranslation } from './utils/i18n';
import { GlobalOfficialProvidersHub } from './components/GlobalOfficialProvidersHub';
import { DirectBookingExecutionHub } from './components/DirectBookingExecutionHub';
import { HajjUmrahServicesHub } from './components/HajjUmrahServicesHub';
import { PalestineJerusalemHub } from './components/PalestineJerusalemHub';
import { ExtraTravelServicesHub } from './components/ExtraTravelServicesHub';

const STORAGE_KEY = 'smarttravel_saved_plans_v1';
const REMINDERS_STORAGE_KEY = 'smarttravel_user_reminders_v1';
const LANG_STORAGE_KEY = 'smarttravel_user_language_v1';
const EYE_COMFORT_STORAGE_KEY = 'smarttravel_eye_comfort_v1';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [activePlan, setActivePlan] = useState<GeneratedPlan | null>(null);
  const [savedPlans, setSavedPlans] = useState<GeneratedPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingShared, setIsLoadingShared] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialMessage, setChatInitialMessage] = useState<string | undefined>(undefined);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isRemindersDrawerOpen, setIsRemindersDrawerOpen] = useState(false);
  const [isOfficialProvidersModalOpen, setIsOfficialProvidersModalOpen] = useState(false);
  const [isDirectBookingModalOpen, setIsDirectBookingModalOpen] = useState(false);
  const [isHajjUmrahModalOpen, setIsHajjUmrahModalOpen] = useState(false);
  const [isPalestineModalOpen, setIsPalestineModalOpen] = useState(false);
  const [isExtraServicesModalOpen, setIsExtraServicesModalOpen] = useState(false);
  const [remindersCount, setRemindersCount] = useState(0);

  // Internationalization & Eye Comfort Mode State
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('ar');
  const [isEyeComfortMode, setIsEyeComfortMode] = useState<boolean>(false);

  // Load language & eye comfort from storage on mount
  useEffect(() => {
    try {
      const storedLang = localStorage.getItem(LANG_STORAGE_KEY) as SupportedLanguage;
      if (storedLang && SUPPORTED_LANGUAGES.some((l) => l.code === storedLang)) {
        setCurrentLanguage(storedLang);
      }
      const storedEyeComfort = localStorage.getItem(EYE_COMFORT_STORAGE_KEY);
      if (storedEyeComfort === 'true') {
        setIsEyeComfortMode(true);
      }
    } catch (e) {
      console.warn(e);
    }
  }, []);

  // Update HTML element direction and lang attribute whenever language changes
  useEffect(() => {
    const langMeta = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = langMeta.direction;
  }, [currentLanguage]);

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {}
  };

  const handleToggleEyeComfort = () => {
    setIsEyeComfortMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(EYE_COMFORT_STORAGE_KEY, String(next));
      } catch {}
      return next;
    });
  };

  const currentLangMeta = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  // Auth State Listener and Cloud Sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
      if (user) {
        // Fetch trips from Firestore and merge with local
        try {
          const cloudTrips = await fetchUserTripsFromCloud(user.uid);
          if (cloudTrips && cloudTrips.length > 0) {
            setSavedPlans((prev) => {
              const ids = new Set(cloudTrips.map((p) => p.id));
              const localOnly = prev.filter((p) => !ids.has(p.id));
              // sync local only to cloud
              localOnly.forEach((p) => saveTripToCloud(user.uid, p));
              const merged = [...cloudTrips, ...localOnly];
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
              } catch {}
              return merged;
            });
          }
        } catch (e) {
          console.warn('Could not sync cloud trips:', e);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Register service worker on mount
  useEffect(() => {
    registerServiceWorker();
  }, []);

  // Check URL query parameters for shared trip link (?shared=ID)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedId = params.get('shared');

    if (sharedId) {
      setIsLoadingShared(true);
      
      // First check local offline cache
      const offlineFound = getOfflinePlanById(sharedId);
      if (offlineFound) {
        setActivePlan(offlineFound);
        setIsLoadingShared(false);
      }

      // Then fetch latest from server
      fetch(`/api/shared-trips/${sharedId}`)
        .then((res) => {
          if (!res.ok) throw new Error('لم يتم العثور على خطة السفر المشتركة أو انتهت صلاحيتها.');
          return res.json();
        })
        .then((data) => {
          if (data && data.plan) {
            const planWithShareId: GeneratedPlan = {
              ...data.plan,
              shareId: sharedId,
            };
            setActivePlan(planWithShareId);
            cachePlanForOffline(planWithShareId);
          }
        })
        .catch((err) => {
          console.warn('Could not fetch shared trip from server:', err);
          if (!offlineFound) {
            setError('تعذر فتح الخطة المشتركة من الرابط، يرجى التأكد من صحة الرابط.');
          }
        })
        .finally(() => {
          setIsLoadingShared(false);
        });
    }
  }, []);

  // Load reminders count
  useEffect(() => {
    try {
      const stored = localStorage.getItem(REMINDERS_STORAGE_KEY);
      if (stored) {
        const parsed: TravelReminder[] = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRemindersCount(parsed.filter((r) => !r.isCompleted).length);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [isRemindersDrawerOpen]);

  // Load saved plans from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedPlans(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load saved plans from storage', e);
    }
  }, []);

  // Save to localStorage and Firestore when savedPlans changes
  const savePlansToStorage = (plans: GeneratedPlan[]) => {
    setSavedPlans(plans);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
    } catch (e) {
      console.error('Failed to persist plans to storage', e);
    }
  };

  const handleGeneratePlan = async (constraints: TravelConstraints) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(constraints),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'فشل توليد خطة السفر، يرجى المحاولة لاحقاً.');
      }

      const newPlan: GeneratedPlan = {
        id: `plan-${Date.now()}`,
        destination: constraints.destination,
        durationDays: constraints.durationDays,
        constraints,
        itineraryMarkdown: data.itineraryMarkdown,
        generatedAt: data.generatedAt || new Date().toISOString(),
        localExperiences: data.localExperiences || [],
        activeAlerts: data.activeAlerts || [],
      };

      setActivePlan(newPlan);
      cachePlanForOffline(newPlan);

      // Save to saved plans list (keep last 20)
      const updated = [newPlan, ...savedPlans.filter((p) => p.id !== newPlan.id)].slice(0, 20);
      savePlansToStorage(updated);

      // Sync to cloud if user is signed in
      if (currentUser) {
        saveTripToCloud(currentUser.uid, newPlan);
      }

      // Trigger luxury celebration confetti
      try {
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#d4af37', '#e5c158', '#f3e5ab', '#ffffff', '#b89327'],
        });
      } catch {
        // ignore
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'حدث خطأ غير متوقع أثناء توليد الخطة.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePlan = (updatedPlan: GeneratedPlan) => {
    setActivePlan(updatedPlan);
    cachePlanForOffline(updatedPlan);
    const updatedList = savedPlans.map((p) => (p.id === updatedPlan.id ? updatedPlan : p));
    if (!savedPlans.some((p) => p.id === updatedPlan.id)) {
      savePlansToStorage([updatedPlan, ...savedPlans]);
    } else {
      savePlansToStorage(updatedList);
    }
    if (currentUser) {
      saveTripToCloud(currentUser.uid, updatedPlan);
    }
  };

  const handleUpdatePlanMarkdown = (newMarkdown: string) => {
    if (!activePlan) return;
    const updatedPlan: GeneratedPlan = {
      ...activePlan,
      itineraryMarkdown: newMarkdown,
      isUserModified: true,
    };
    handleUpdatePlan(updatedPlan);
  };

  const handleOpenChatWithMessage = (initialMsg?: string) => {
    setChatInitialMessage(initialMsg);
    setIsChatOpen(true);
  };

  const handleDeletePlan = (id: string) => {
    const updated = savedPlans.filter((p) => p.id !== id);
    savePlansToStorage(updated);
    if (currentUser) {
      deleteTripFromCloud(currentUser.uid, id);
    }
    if (activePlan?.id === id) {
      setActivePlan(null);
    }
  };

  return (
    <div 
      dir={currentLangMeta.direction} 
      className={`min-h-screen flex flex-col font-['Cairo',sans-serif] selection:bg-[#d4af37]/30 selection:text-white transition-colors duration-300 ${
        isEyeComfortMode 
          ? 'bg-[#0e131d] text-[#e8edf7]' 
          : 'bg-[#0a0a0a] text-neutral-200'
      }`}
    >
      {/* Top Navigation */}
      <Navbar
        onNewTrip={() => setActivePlan(null)}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        onOpenReminders={() => setIsRemindersDrawerOpen(true)}
        onOpenOfficialProviders={() => setIsOfficialProvidersModalOpen(true)}
        onOpenDirectBooking={() => setIsDirectBookingModalOpen(true)}
        onOpenHajjUmrah={() => setIsHajjUmrahModalOpen(true)}
        onOpenPalestine={() => setIsPalestineModalOpen(true)}
        onOpenExtraServices={() => setIsExtraServicesModalOpen(true)}
        savedCount={savedPlans.length}
        remindersPendingCount={remindersCount}
        hasActivePlan={!!activePlan}
        currentUser={currentUser}
        isAuthLoading={isAuthLoading}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        isEyeComfortMode={isEyeComfortMode}
        onToggleEyeComfort={handleToggleEyeComfort}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Error notification */}
        {error && (
          <div className="max-w-4xl mx-auto mb-6 p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-300 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block mb-0.5">{currentLanguage === 'ar' ? 'حدث خطأ' : 'An error occurred'}</span>
              <p className="text-xs sm:text-sm text-rose-200/90">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs text-rose-400 hover:underline cursor-pointer"
            >
              {getTranslation(currentLanguage, 'close')}
            </button>
          </div>
        )}

        {/* View Switcher: Active Itinerary or Constraint Builder */}
        {activePlan ? (
          <ItineraryViewer
            plan={activePlan}
            currentLanguage={currentLanguage}
            onLanguageChange={handleLanguageChange}
            onRegenerate={() => handleGeneratePlan(activePlan.constraints)}
            onOpenChat={handleOpenChatWithMessage}
            onOpenReminders={() => setIsRemindersDrawerOpen(true)}
            onUpdatePlanMarkdown={handleUpdatePlanMarkdown}
            onUpdatePlan={handleUpdatePlan}
          />
        ) : (
          <ConstraintForm 
            onSubmit={handleGeneratePlan} 
            isLoading={isLoading} 
            onOpenOfficialProviders={() => setIsOfficialProvidersModalOpen(true)}
            currentLanguage={currentLanguage}
          />
        )}
      </main>

      {/* Direct Booking Execution Modal */}
      {isDirectBookingModalOpen && activePlan && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="max-w-5xl w-full my-auto animate-in zoom-in-95 duration-200 relative">
            <button
              type="button"
              onClick={() => setIsDirectBookingModalOpen(false)}
              className="absolute -top-3 left-4 sm:-left-3 z-20 w-8 h-8 rounded-full bg-[#1e293b] text-white border border-neutral-700 hover:bg-[#334155] flex items-center justify-center cursor-pointer shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
            <DirectBookingExecutionHub
              plan={activePlan}
              currentLanguage={currentLanguage}
              onClose={() => setIsDirectBookingModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Hajj & Umrah Direct Hub Modal */}
      {isHajjUmrahModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="max-w-5xl w-full my-auto animate-in zoom-in-95 duration-200 relative">
            <button
              type="button"
              onClick={() => setIsHajjUmrahModalOpen(false)}
              className="absolute -top-3 left-4 sm:-left-3 z-20 w-8 h-8 rounded-full bg-[#1e293b] text-white border border-[#d4af37]/40 hover:bg-[#334155] flex items-center justify-center cursor-pointer shadow-xl"
            >
              <X className="w-4 h-4" />
            </button>
            <HajjUmrahServicesHub
              currentLanguage={currentLanguage}
              onPlanTrip={(constraints) => {
                setIsHajjUmrahModalOpen(false);
                handleGeneratePlan(constraints);
              }}
              onClose={() => setIsHajjUmrahModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Palestine & Jerusalem Hub Modal */}
      {isPalestineModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="max-w-5xl w-full my-auto animate-in zoom-in-95 duration-200 relative">
            <button
              type="button"
              onClick={() => setIsPalestineModalOpen(false)}
              className="absolute -top-3 left-4 sm:-left-3 z-20 w-8 h-8 rounded-full bg-[#1e293b] text-white border border-emerald-500/40 hover:bg-[#334155] flex items-center justify-center cursor-pointer shadow-xl"
            >
              <X className="w-4 h-4" />
            </button>
            <PalestineJerusalemHub
              currentLanguage={currentLanguage}
              onPlanTrip={(constraints) => {
                setIsPalestineModalOpen(false);
                handleGeneratePlan(constraints);
              }}
              onClose={() => setIsPalestineModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Decision Assistant Dynamic Chat Modal */}
      <DecisionAssistantChat
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false);
          setChatInitialMessage(undefined);
        }}
        plan={activePlan}
        initialMessage={chatInitialMessage}
        currentLanguage={currentLanguage}
      />

      {/* Saved Trips Drawer */}
      <SavedTripsDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedPlans={savedPlans}
        onSelectPlan={(plan) => setActivePlan(plan)}
        onDeletePlan={handleDeletePlan}
        currentLanguage={currentLanguage}
      />

      {/* Persistent Floating Chat Bot Trigger Badge on Screen */}
      <FloatingChatBotTrigger
        onOpenChat={handleOpenChatWithMessage}
        plan={activePlan}
        isOpen={isChatOpen}
        currentLanguage={currentLanguage}
      />

      {/* General Travel Reminders & Tasks Drawer */}
      <TravelRemindersDrawer
        isOpen={isRemindersDrawerOpen}
        onClose={() => setIsRemindersDrawerOpen(false)}
        tripDestination={activePlan?.destination}
        tripId={activePlan?.id}
        onRemindersChange={(rems) => {
          setRemindersCount(rems.filter((r) => !r.isCompleted).length);
        }}
        currentLanguage={currentLanguage}
      />

      {/* Extra Travel Services Hub Modal */}
      <ExtraTravelServicesHub
        isOpen={isExtraServicesModalOpen}
        onClose={() => setIsExtraServicesModalOpen(false)}
        destinationCity={activePlan?.destination}
        currentLanguage={currentLanguage}
      />

      {/* Global Official Providers Directory Modal */}
      <GlobalOfficialProvidersHub
        isOpen={isOfficialProvidersModalOpen}
        onClose={() => setIsOfficialProvidersModalOpen(false)}
        currentLanguage={currentLanguage}
      />

      {/* Luxury Footer */}
      <footer className="border-t border-neutral-800/80 bg-[#0a0a0a] py-6 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-neutral-400 italic font-semibold">
            {getTranslation(currentLanguage, 'footer_quote')}
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse"></div>
            <span className="text-[11px] text-neutral-400 uppercase tracking-wide">
              {getTranslation(currentLanguage, 'footer_tagline')}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}


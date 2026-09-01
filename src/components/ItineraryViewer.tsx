import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { 
  Calendar, Lightbulb, Wallet, Luggage, Copy, Check, 
  Printer, Download, Sparkles, MessageCircle, FileText, 
  AlertTriangle, RefreshCw, Gem, Radio, Layers, Train, Plane, Car, Bus, 
  Map as MapIcon, CloudSun, Utensils, Edit3, StickyNote, CheckCircle2,
  FileDown, Share2, Ticket, ShieldAlert, Plus, Camera, Coins, ListTodo, Users,
  Award, Leaf, Image as ImageIcon, Zap, Mountain, Globe
} from 'lucide-react';
import { GeneratedPlan, LocalExperience, RestaurantItem, WeatherData, ActivityNote, DayVisualLandmark } from '../types';
import { LocalExperiencesCard } from './LocalExperiencesCard';
import { RealTimeAlertsBanner } from './RealTimeAlertsBanner';
import { InteractiveTripMap } from './InteractiveTripMap';
import { Terrain3DMapViewer } from './Terrain3DMapViewer';
import { QuickBookingAssistant } from './QuickBookingAssistant';
import { SmartTipsManager } from './SmartTipsManager';
import { WeatherWidget } from './WeatherWidget';
import { RestaurantFinder } from './RestaurantFinder';
import { ItineraryEditor } from './ItineraryEditor';
import { PdfExportModal } from './PdfExportModal';
import { ShareTripModal } from './ShareTripModal';
import { ActivityNotesModal } from './ActivityNotesModal';
import { TravelAlertsDashboard } from './TravelAlertsDashboard';
import { CurrencyConverterWidget } from './CurrencyConverterWidget';
import { DayAttractionsVisualizer } from './DayAttractionsVisualizer';
import { TripProgressTracker } from './TripProgressTracker';
import { CollaboratorNotesDrawer } from './CollaboratorNotesDrawer';
import { OfflineStatusBanner } from './OfflineStatusBanner';
import { TripExperienceEvaluator } from './TripExperienceEvaluator';
import { LiveExpenseTracker } from './LiveExpenseTracker';
import { SmartPackingManager } from './SmartPackingManager';
import { EcoImpactTracker } from './EcoImpactTracker';
import { TripHighlightCardModal } from './TripHighlightCardModal';
import { DestinationPhotoGallery } from './DestinationPhotoGallery';
import { AiStudioStudioHub } from './AiStudioStudioHub';
import { InteractiveTripTimeline } from './InteractiveTripTimeline';
import { DirectBookingExecutionHub } from './DirectBookingExecutionHub';
import { TripRatingFeedback } from './TripRatingFeedback';
import { HealthAndSafetyAdvisoryWidget } from './HealthAndSafetyAdvisoryWidget';
import { PharaonicCartouche, WingedSunSymbol } from './PharaonicDecorations';

interface ItineraryViewerProps {
  plan: GeneratedPlan;
  onRegenerate: () => void;
  onOpenChat: (initialMessage?: string) => void;
  onOpenReminders?: () => void;
  onUpdatePlanMarkdown?: (newMarkdown: string) => void;
  onUpdatePlan?: (updatedPlan: GeneratedPlan) => void;
}

export const ItineraryViewer: React.FC<ItineraryViewerProps> = ({
  plan,
  onRegenerate,
  onOpenChat,
  onOpenReminders,
  onUpdatePlanMarkdown,
  onUpdatePlan,
}) => {
  const [activeTab, setActiveTab] = useState<
    'all' | 'direct_hub' | 'timeline' | 'gallery' | 'aistudio' | 'booking' | 'map3d' | 'smarttips' | 'map' | 'visuals' | 'itinerary' | 'evaluator' | 'expenses' | 'budget' | 'packing' | 'eco' | 'weather' | 'alerts' | 'restaurants' | 'experiences' | 'editor' | 'rationale' | 'raw'
  >('all');
  const [copied, setCopied] = useState(false);
  const [isEditingInline, setIsEditingInline] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isCollaboratorsOpen, setIsCollaboratorsOpen] = useState(false);
  const [isHighlightCardModalOpen, setIsHighlightCardModalOpen] = useState(false);
  const [selectedNoteDay, setSelectedNoteDay] = useState<number>(1);
  const [selectedNoteActivity, setSelectedNoteActivity] = useState<string>('');
  const [selectedBookingActivity, setSelectedBookingActivity] = useState<string>('');

  // Multi-Language Translation State (Arabic, English, French, Spanish)
  const [currentLanguage, setCurrentLanguage] = useState<'ar' | 'en' | 'fr' | 'es'>('ar');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [translationError, setTranslationError] = useState<string | null>(null);

  // Active Markdown based on selected language
  const displayMarkdown = 
    currentLanguage === 'ar'
      ? plan.itineraryMarkdown
      : plan.translatedItineraries?.[currentLanguage] || plan.itineraryMarkdown;

  const handleLanguageChange = async (targetLang: 'ar' | 'en' | 'fr' | 'es') => {
    if (targetLang === currentLanguage) return;
    if (targetLang === 'ar') {
      setCurrentLanguage('ar');
      return;
    }

    // Check if already cached in plan
    if (plan.translatedItineraries?.[targetLang]) {
      setCurrentLanguage(targetLang);
      return;
    }

    // Fetch translation from Gemini API
    setIsTranslating(true);
    setTranslationError(null);
    try {
      const res = await fetch('/api/translate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itineraryMarkdown: plan.itineraryMarkdown,
          targetLanguage: targetLang,
          destination: plan.destination,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to translate itinerary');
      }

      const data = await res.json();
      const updatedTranslations: Record<string, string> = {
        ...(plan.translatedItineraries || {}),
        [targetLang]: data.translatedMarkdown || plan.itineraryMarkdown,
      };

      const updatedPlan: GeneratedPlan = {
        ...plan,
        translatedItineraries: updatedTranslations,
      };

      if (onUpdatePlan) {
        onUpdatePlan(updatedPlan);
      }

      setCurrentLanguage(targetLang);
    } catch (err) {
      console.error('Translation error:', err);
      setTranslationError('تعذر الترجمة حالياً، تم الإبقاء على النص الأصلي.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSaveFeedback = (feedback: any) => {
    const updatedPlan: GeneratedPlan = {
      ...plan,
      userFeedback: feedback,
    };
    if (onUpdatePlan) {
      onUpdatePlan(updatedPlan);
    }
    try {
      localStorage.setItem(`smarttravel_feedback_${plan.id}`, JSON.stringify(feedback));
      localStorage.setItem(`smarttravel_plan_${plan.id}`, JSON.stringify(updatedPlan));
    } catch (e) {
      console.error('Failed to save feedback to storage:', e);
    }
  };

  const handleUpdateHealthAdvisories = (advisories: any) => {
    const updatedPlan: GeneratedPlan = {
      ...plan,
      healthAdvisories: advisories,
    };
    if (onUpdatePlan) {
      onUpdatePlan(updatedPlan);
    }
  };

  const handleJumpToDay = (dayNum: number) => {
    setActiveTab('itinerary');
    setTimeout(() => {
      window.scrollTo({ top: 350, behavior: 'smooth' });
    }, 100);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(plan.itineraryMarkdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([plan.itineraryMarkdown], { type: 'text/markdown;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `SmartTravel-${plan.destination.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_')}-${plan.durationDays}days.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    setIsPdfModalOpen(true);
  };

  const handleAskAboutExperience = (exp: LocalExperience) => {
    onOpenChat(`أرغب في دمج تجربة "${exp.title}" (${exp.location}) في جدول رحلتي. ما هو أفضل وقت لذلك وكيف يؤثر على ميزانية اليوم؟`);
  };

  const handleAskAboutLocation = (locationName: string, category?: string) => {
    onOpenChat(`أود الاستفسار عن معلم "${locationName}" (${category || 'موقع سياحي'}). ما هي أفضل الأوقات لزيارته وكيف يمكنني الوصول إليه بسهولة من مقر إقامتي؟`);
  };

  const handleAskAboutRestaurant = (restaurant: RestaurantItem) => {
    onOpenChat(`أود الاستفسار عن مطعم "${restaurant.name}" (${restaurant.cuisine} في ${restaurant.addressArea}). ما هي ترشيحاتك لأفضل الأطباق وهل يحتاج لحجز مسبق للطاولة؟`);
  };

  const handleSaveEditorPlan = (updatedPlan: GeneratedPlan) => {
    if (onUpdatePlan) {
      onUpdatePlan(updatedPlan);
    } else if (onUpdatePlanMarkdown) {
      onUpdatePlanMarkdown(updatedPlan.itineraryMarkdown);
    }
  };

  const handleUpdateLandmarks = (landmarks: DayVisualLandmark[]) => {
    const updatedPlan: GeneratedPlan = {
      ...plan,
      dayLandmarks: landmarks,
    };
    if (onUpdatePlan) {
      onUpdatePlan(updatedPlan);
    }
  };

  const handleSaveActivityNotes = (updatedNotes: Record<string, ActivityNote>) => {
    const updatedPlan: GeneratedPlan = {
      ...plan,
      activityNotes: updatedNotes,
      isUserModified: true,
    };
    if (onUpdatePlan) {
      onUpdatePlan(updatedPlan);
    }
    // save to localStorage
    try {
      localStorage.setItem(`smarttravel_plan_${plan.id}`, JSON.stringify(updatedPlan));
    } catch (e) {
      console.error(e);
    }
  };

  const openAddNoteForDay = (day: number, activityTitle?: string) => {
    setSelectedNoteDay(day);
    setSelectedNoteActivity(activityTitle || '');
    setIsNotesModalOpen(true);
  };

  // Extract sections from markdown for segmented views
  const parseSections = (md: string) => {
    const raw = md;
    
    // Look for standard headers
    const itineraryIdx = raw.search(/1\.\s*🗓️|جدول الرحلة الذكي|Day-by-Day/i);
    const rationaleIdx = raw.search(/2\.\s*💡|لماذا اخترنا هذه الأماكن|Decision Rationale/i);
    const budgetIdx = raw.search(/3\.\s*💰|تحليل وتوزيع الميزانية|Smart Budget Allocation/i);
    const packingIdx = raw.search(/4\.\s*🧳|قائمة الأغراض الذكية|Smart Packing Checklist/i);

    let itineraryPart = '';
    let rationalePart = '';
    let budgetPart = '';
    let packingPart = '';

    if (itineraryIdx !== -1) {
      const end = rationaleIdx !== -1 ? rationaleIdx : raw.length;
      itineraryPart = raw.slice(itineraryIdx, end).trim();
    }
    if (rationaleIdx !== -1) {
      const end = budgetIdx !== -1 ? budgetIdx : raw.length;
      rationalePart = raw.slice(rationaleIdx, end).trim();
    }
    if (budgetIdx !== -1) {
      const end = packingIdx !== -1 ? packingIdx : raw.length;
      budgetPart = raw.slice(budgetIdx, end).trim();
    }
    if (packingIdx !== -1) {
      packingPart = raw.slice(packingIdx).trim();
    }

    const hasWarning = raw.includes('⚠️') || raw.includes('Budget Warning') || raw.includes('تنبيه الميزانية');

    return {
      itineraryPart: itineraryPart || raw,
      rationalePart,
      budgetPart,
      packingPart,
      hasWarning,
    };
  };

  const parsed = parseSections(displayMarkdown);
  const isMultiCity = plan.constraints.isMultiCity;
  const cityStops = plan.constraints.cityStops;
  const customNotes = plan.customNotes || {};
  const hasCustomNotes = Object.keys(customNotes).length > 0;
  const activityNotes = plan.activityNotes || {};
  const activityNotesList = Object.values(activityNotes);
  const hasActivityNotes = activityNotesList.length > 0;

  const collaboratorCommentsCount = (plan.collaboratorComments || []).length;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Offline Status Indicator Banner */}
      <OfflineStatusBanner plan={plan} />

      {/* Visual Trip Progress Tracker Bar with Local Timezone & Current Active Slot */}
      <TripProgressTracker
        plan={plan}
        onUpdatePlan={onUpdatePlan}
        onJumpToDay={handleJumpToDay}
      />

      {/* Top Meta & Action Bar */}
      <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-black/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-[#d4af37]/20 to-[#8a6d1c]/20 text-[#f5d061] border border-[#d4af37]/50 text-xs font-black flex items-center gap-1.5 shadow-sm">
              <span className="text-sm">𓂀</span>
              {isMultiCity && <Layers className="w-3.5 h-3.5 text-[#d4af37]" />}
              {plan.destination}
            </span>
            <span className="px-3 py-1 rounded-full bg-[#141f33] text-[#d3e2f5] border border-[#d4af37]/30 text-xs font-semibold">
              {plan.durationDays} أيام
            </span>
            {plan.constraints.budget && (
              <span className="px-3 py-1 rounded-full bg-[#d4af37]/15 text-[#e5c158] border border-[#d4af37]/40 text-xs font-bold">
                {plan.constraints.budget} {plan.constraints.currency}
              </span>
            )}
            {isMultiCity && (
              <span className="px-2.5 py-1 rounded-full bg-blue-950/50 text-blue-300 border border-blue-500/40 text-[11px] font-bold">
                مسار متعدد المدن ({cityStops?.length || 0} محطات)
              </span>
            )}
            {plan.isUserModified && (
              <span className="px-2.5 py-1 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>معدل ومحفوظ محلياً</span>
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>خطة السفر الذكية المخصصة</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 text-[#f5d061] border border-[#d4af37]/40 font-bold hidden sm:inline-block">
              العرش الملكي 👑
            </span>
          </h2>
          <p className="text-xs text-[#9eb3cf] mt-1">
            مجهزة بمعرض الصور عالي الدقة، الاستجابة الفورية، تحويل العملات اللحظي، وتصدير الـ PDF.
          </p>
        </div>

        {/* Action Buttons Header */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Collaborator Notes / Group Planning Button */}
          <button
            id="collaborator-notes-btn"
            onClick={() => setIsCollaboratorsOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] hover:bg-[#282828] text-[#d4af37] border border-[#d4af37]/40 hover:border-[#d4af37] transition-all cursor-pointer relative"
            title="ملاحظات ونقاشات رفقاء السفر"
          >
            <Users className="w-4 h-4 text-[#d4af37]" />
            <span>رفقاء السفر</span>
            {collaboratorCommentsCount > 0 && (
              <span className="bg-[#d4af37] text-black text-[10px] font-black px-1.5 py-0.2 rounded-full mr-0.5">
                {collaboratorCommentsCount}
              </span>
            )}
          </button>

          {/* General Travel Reminders Button */}
          {onOpenReminders && (
            <button
              id="open-reminders-action-btn"
              onClick={onOpenReminders}
              className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] hover:bg-[#282828] text-amber-300 border border-amber-500/40 hover:border-[#d4af37] transition-all cursor-pointer"
              title="مهام وتذكيرات السفر العامة"
            >
              <ListTodo className="w-4 h-4 text-[#d4af37]" />
              <span>مهام وتذكيرات</span>
            </button>
          )}

          {/* PDF Export Button */}
          <button
            id="export-pdf-modal-btn"
            onClick={() => setIsPdfModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-black shadow-lg shadow-[#d4af37]/20 transition-all cursor-pointer"
            title="تصدير خطة الرحلة كملف PDF أنيق"
          >
            <FileDown className="w-4 h-4" />
            <span>تصدير PDF</span>
          </button>

          {/* Trip Highlight Card Generator Button */}
          <button
            id="highlight-card-btn"
            onClick={() => setIsHighlightCardModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2.5 rounded-xl bg-[#221a08] hover:bg-[#2e230b] text-[#d4af37] border border-[#d4af37]/60 hover:border-[#d4af37] transition-all cursor-pointer shadow-md shadow-[#d4af37]/10"
            title="إنشاء بطاقة الرحلة التذكارية للمشاركة على إنستغرام وإكس"
          >
            <ImageIcon className="w-4 h-4 text-[#d4af37]" />
            <span>بطاقة الهايلايت 📸</span>
          </button>

          {/* Share Trip Link Button */}
          <button
            id="share-trip-btn"
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2.5 rounded-xl bg-[#1a1a1a] hover:bg-[#282828] text-emerald-300 border border-emerald-500/40 hover:border-emerald-400 transition-all cursor-pointer"
            title="مشاركة رابط الرحلة المباشر"
          >
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span>مشاركة الرحلة</span>
          </button>

          {/* Booking & Personal Notes Button */}
          <button
            id="activity-notes-btn"
            onClick={() => setIsNotesModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2.5 rounded-xl bg-[#1a1a1a] hover:bg-[#282828] text-amber-300 border border-amber-500/40 hover:border-[#d4af37] transition-all cursor-pointer relative"
            title="إضافة وتعديل أرقام الحجوزات والملاحظات الشخصية"
          >
            <Ticket className="w-4 h-4 text-[#d4af37]" />
            <span>ملاحظات وحجوزات</span>
            {hasActivityNotes && (
              <span className="w-2 h-2 rounded-full bg-[#d4af37] absolute top-1.5 left-1.5 animate-pulse"></span>
            )}
          </button>

          {/* Direct Edit Button */}
          <button
            id="open-editor-btn"
            onClick={() => {
              setIsEditingInline(!isEditingInline);
              if (!isEditingInline) setActiveTab('editor');
            }}
            className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer ${
              isEditingInline || activeTab === 'editor'
                ? 'bg-amber-400/20 text-[#d4af37] border-[#d4af37]'
                : 'bg-[#1a1a1a] hover:bg-[#262626] text-neutral-200 border-neutral-800 hover:border-[#d4af37]/40'
            }`}
            title="تعديل الملاحظات أو الأوقات وحفظها محلياً"
          >
            <Edit3 className="w-4 h-4 text-[#d4af37]" />
            <span>تحرير الجدول</span>
          </button>

          {/* Ask AI Assistant */}
          <button
            id="ask-assistant-btn"
            onClick={() => onOpenChat()}
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2.5 rounded-xl bg-[#1f1f1f] hover:bg-[#2a2a2a] text-neutral-100 border border-neutral-700 transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-[#d4af37]" />
            <span>اسأل المستشار</span>
          </button>

          <button
            id="copy-markdown-btn"
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2.5 rounded-xl bg-[#1a1a1a] hover:bg-[#262626] text-neutral-300 border border-neutral-800 transition-colors cursor-pointer"
            title="نسخ نص الماركداون"
          >
            {copied ? <Check className="w-4 h-4 text-[#d4af37]" /> : <Copy className="w-4 h-4 text-neutral-400" />}
          </button>

          <button
            id="regenerate-plan-btn"
            onClick={onRegenerate}
            className="flex items-center gap-1 text-xs font-medium px-3 py-2.5 rounded-xl bg-[#1a1a1a] hover:bg-[#262626] text-neutral-300 border border-neutral-800 transition-colors cursor-pointer"
            title="توليد بديل"
          >
            <RefreshCw className="w-4 h-4 text-neutral-400" />
          </button>
        </div>
      </div>

      {/* Multi-City Journey Route Highlights */}
      {isMultiCity && cityStops && cityStops.length > 0 && (
        <div className="bg-[#141414] border border-neutral-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-[#d4af37]" />
            <span className="text-xs sm:text-sm font-bold text-white">تسلسل محطات المسار والتنقل بين المدن:</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {cityStops.map((stop, idx) => (
              <React.Fragment key={stop.id}>
                <div className="bg-[#1c1c1c] border border-neutral-700/80 rounded-xl p-3 min-w-[160px] flex-shrink-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="w-5 h-5 rounded-full bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-bold bg-[#141414] px-1.5 py-0.5 rounded">
                      {stop.days} أيام
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white">{stop.cityName}</div>
                  {stop.hotelArea && (
                    <div className="text-[11px] text-neutral-400 truncate mt-0.5">🏨 {stop.hotelArea}</div>
                  )}
                </div>
                {idx < cityStops.length - 1 && (
                  <div className="flex flex-col items-center justify-center px-1 text-neutral-500 flex-shrink-0">
                    <Train className="w-4 h-4 text-[#d4af37]" />
                    <span className="text-[10px] text-neutral-400 mt-0.5 font-mono">⟵ انتقال</span>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Travel Alerts & Live Flight Intelligence Dashboard Widget */}
      <TravelAlertsDashboard
        plan={plan}
        onApplyContingency={(newMarkdown) => {
          if (onUpdatePlanMarkdown) {
            onUpdatePlanMarkdown(newMarkdown);
          }
        }}
      />

      {/* Real-Time Health and Travel Advisory Safety Alerts */}
      <HealthAndSafetyAdvisoryWidget
        destination={plan.destination}
        initialData={plan.healthAdvisories}
        onUpdateAdvisories={handleUpdateHealthAdvisories}
      />

      {/* Real-Time Live Weather Forecast & Smart Clothing Recommendations */}
      <WeatherWidget
        destination={plan.destination}
        initialWeather={plan.weather}
      />

      {/* AI Multi-Language Translation Selector Bar */}
      <div className="bg-[#141414] border border-[#d4af37]/30 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#d4af37]/15 flex items-center justify-center border border-[#d4af37]/40 text-[#d4af37]">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-white">ترجمة الخطة الفورية (Gemini Multilingual)</span>
              {isTranslating && (
                <span className="text-[10px] text-amber-300 font-mono animate-pulse flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  جاري الترجمة بالذكاء الاصطناعي...
                </span>
              )}
            </div>
            <p className="text-[11px] text-neutral-400">
              ترجمة متزامنة للمسار، المبررات، والتفاصيل مع الحفاظ على التنسيق.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => handleLanguageChange('ar')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              currentLanguage === 'ar'
                ? 'bg-[#d4af37] text-black shadow'
                : 'bg-[#1c1c1c] text-neutral-300 hover:text-white border border-neutral-700 hover:border-[#d4af37]/50'
            }`}
          >
            <span>🇸🇦</span>
            <span>العربية (الأصلية)</span>
          </button>

          <button
            onClick={() => handleLanguageChange('en')}
            disabled={isTranslating}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              currentLanguage === 'en'
                ? 'bg-[#d4af37] text-black shadow'
                : 'bg-[#1c1c1c] text-neutral-300 hover:text-white border border-neutral-700 hover:border-[#d4af37]/50'
            } ${isTranslating ? 'opacity-50 cursor-wait' : ''}`}
          >
            <span>🇬🇧</span>
            <span>English</span>
            {plan.translatedItineraries?.['en'] && <Check className="w-3 h-3 text-emerald-400" />}
          </button>

          <button
            onClick={() => handleLanguageChange('fr')}
            disabled={isTranslating}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              currentLanguage === 'fr'
                ? 'bg-[#d4af37] text-black shadow'
                : 'bg-[#1c1c1c] text-neutral-300 hover:text-white border border-neutral-700 hover:border-[#d4af37]/50'
            } ${isTranslating ? 'opacity-50 cursor-wait' : ''}`}
          >
            <span>🇫🇷</span>
            <span>Français</span>
            {plan.translatedItineraries?.['fr'] && <Check className="w-3 h-3 text-emerald-400" />}
          </button>

          <button
            onClick={() => handleLanguageChange('es')}
            disabled={isTranslating}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              currentLanguage === 'es'
                ? 'bg-[#d4af37] text-black shadow'
                : 'bg-[#1c1c1c] text-neutral-300 hover:text-white border border-neutral-700 hover:border-[#d4af37]/50'
            } ${isTranslating ? 'opacity-50 cursor-wait' : ''}`}
          >
            <span>🇪🇸</span>
            <span>Español</span>
            {plan.translatedItineraries?.['es'] && <Check className="w-3 h-3 text-emerald-400" />}
          </button>
        </div>
      </div>

      {translationError && (
        <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-300 text-xs rounded-xl flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{translationError}</span>
        </div>
      )}

      {/* Inline Itinerary Editor Panel if triggered */}
      {isEditingInline && (
        <ItineraryEditor
          plan={plan}
          onSavePlan={(updated) => {
            handleSaveEditorPlan(updated);
            setIsEditingInline(false);
          }}
          onClose={() => setIsEditingInline(false)}
        />
      )}

      {/* Navigation Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#111111] border border-neutral-800 rounded-xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/20'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#1a1a1a]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>التقرير الشامل المتكامل</span>
        </button>

        <button
          onClick={() => setActiveTab('direct_hub')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'direct_hub'
              ? 'bg-gradient-to-r from-[#d4af37] via-[#f5d061] to-[#d4af37] text-black shadow-lg shadow-[#d4af37]/30'
              : 'text-emerald-300 hover:text-white bg-emerald-950/40 hover:bg-emerald-950/80 border border-emerald-500/40'
          }`}
        >
          <Zap className="w-4 h-4 text-emerald-400" />
          <span>✈️ مركز الحجز والتنفيذ المباشر (طيران • فنادق • سداد)</span>
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'timeline'
              ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/20'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#1a1a1a]'
          }`}
        >
          <Calendar className="w-4 h-4 text-[#d4af37]" />
          <span>⏱️ الخط الزمني التفاعلي (Day Timeline)</span>
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'gallery'
              ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/20'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#1a1a1a]'
          }`}
        >
          <Camera className="w-4 h-4 text-[#d4af37]" />
          <span>📸 معرض الصور الملكي والاستكشاف البصري</span>
        </button>

        <button
          onClick={() => setActiveTab('aistudio')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'aistudio'
              ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/20'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#1a1a1a]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#d4af37]" />
          <span>✨ ستوديو الذكاء الاصطناعي (موسيقى • فيديو • صور • تفريغ صوتي • خرائط حية)</span>
        </button>

        <button
          onClick={() => setActiveTab('booking')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'booking'
              ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/20'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#1a1a1a]'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span>⚡ مساعد الحجز السريع (Deep Links)</span>
        </button>

        <button
          onClick={() => setActiveTab('map3d')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'map3d'
              ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/20'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#1a1a1a]'
          }`}
        >
          <Mountain className="w-4 h-4 text-emerald-400" />
          <span>🌐 خريطة التضاريس 3D (Elevation)</span>
        </button>

        <button
          onClick={() => setActiveTab('smarttips')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'smarttips'
              ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/20'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#1a1a1a]'
          }`}
        >
          <Lightbulb className="w-4 h-4 text-yellow-400" />
          <span>💡 التلميحات الذكية (Smart Tips)</span>
        </button>

        <button
          onClick={() => setActiveTab('evaluator')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'evaluator'
              ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/20'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#1a1a1a]'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>🏆 تقييم تجربة الرحلة (AI Score)</span>
        </button>

        <button
          onClick={() => setActiveTab('expenses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'expenses'
              ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/20'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#1a1a1a]'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>💳 متتبع المصاريف اللحظي</span>
        </button>

        <button
          onClick={() => setActiveTab('packing')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'packing'
              ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/20'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#1a1a1a]'
          }`}
        >
          <Luggage className="w-4 h-4" />
          <span>🧳 قوالب الأمتعة والطقس</span>
        </button>

        <button
          onClick={() => setActiveTab('eco')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'eco'
              ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/20'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#1a1a1a]'
          }`}
        >
          <Leaf className="w-4 h-4" />
          <span>🌿 الأثر البيئي والاستدامة</span>
        </button>

        <button
          onClick={() => setActiveTab('visuals')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'visuals'
              ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/20'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#1a1a1a]'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>📸 معرض المعالم (Scenic AI)</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'map'
              ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/20'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#1a1a1a]'
          }`}
        >
          <MapIcon className="w-4 h-4" />
          <span>🗺️ الخريطة التفاعلية</span>
        </button>

        <button
          onClick={() => setActiveTab('itinerary')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'itinerary'
              ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/20'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#1a1a1a]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>🗓️ جدول الأيام والأنشطة</span>
        </button>

        <button
          onClick={() => setActiveTab('budget')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'budget'
              ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/20'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#1a1a1a]'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>💰 الميزانية وتحويل العملات</span>
        </button>

        <button
          onClick={() => setActiveTab('restaurants')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'restaurants'
              ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/20'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#1a1a1a]'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>🍽️ البحث عن مطاعم</span>
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'alerts'
              ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/20'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#1a1a1a]'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>🛡️ استخبارات وتنبيهات السفر</span>
        </button>

        <button
          onClick={() => setActiveTab('weather')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'weather'
              ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/20'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#1a1a1a]'
          }`}
        >
          <CloudSun className="w-4 h-4" />
          <span>⛅ الطقس وتوصيات الملابس</span>
        </button>

        {plan.localExperiences && plan.localExperiences.length > 0 && (
          <button
            onClick={() => setActiveTab('experiences')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'experiences'
                ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/20'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#1a1a1a]'
            }`}
          >
            <Gem className="w-4 h-4" />
            <span>💎 تجارب محلية أصيلة</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('editor')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'editor'
              ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/20'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#1a1a1a]'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>✏️ تحرير الجدول</span>
        </button>

        <button
          onClick={() => setActiveTab('rationale')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'rationale'
              ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/20'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#1a1a1a]'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          <span>💡 أسباب الاختيار</span>
        </button>

        <button
          onClick={() => setActiveTab('raw')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'raw'
              ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/20'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#1a1a1a]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>نص Markdown</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80 min-h-[400px]">
        {activeTab === 'direct_hub' ? (
          <div className="space-y-6">
            <DirectBookingExecutionHub
              plan={plan}
              currentLanguage={currentLanguage}
            />
          </div>
        ) : activeTab === 'timeline' ? (
          <div className="space-y-6">
            <InteractiveTripTimeline
              plan={plan}
              onOpenChat={onOpenChat}
              onAddActivityNote={(day, title) => openAddNoteForDay(day, title)}
            />
          </div>
        ) : activeTab === 'gallery' ? (
          <div className="space-y-6">
            <DestinationPhotoGallery
              destination={plan.destination}
              durationDays={plan.durationDays}
            />
          </div>
        ) : activeTab === 'aistudio' ? (
          <div className="space-y-6">
            <AiStudioStudioHub
              destination={plan.destination}
            />
          </div>
        ) : activeTab === 'booking' ? (
          <div className="space-y-6">
            <QuickBookingAssistant
              plan={plan}
              initialActivityTitle={selectedBookingActivity}
            />
          </div>
        ) : activeTab === 'map3d' ? (
          <div className="space-y-6">
            <Terrain3DMapViewer
              plan={plan}
              onAskAboutLocation={handleAskAboutLocation}
              onSelectBooking={(title) => {
                setSelectedBookingActivity(title);
                setActiveTab('booking');
              }}
            />
          </div>
        ) : activeTab === 'smarttips' ? (
          <div className="space-y-6">
            <SmartTipsManager
              plan={plan}
              onOpenChat={onOpenChat}
            />
          </div>
        ) : activeTab === 'evaluator' ? (
          <div className="space-y-6">
            <TripExperienceEvaluator
              plan={plan}
              onUpdatePlan={onUpdatePlan}
              onOpenChat={onOpenChat}
            />
            {/* Star-Rating & Trip Quality Feedback */}
            <TripRatingFeedback
              destination={plan.destination}
              initialFeedback={plan.userFeedback}
              onSaveFeedback={handleSaveFeedback}
            />
          </div>
        ) : activeTab === 'expenses' ? (
          <div className="space-y-6">
            <LiveExpenseTracker
              plan={plan}
              onUpdatePlan={onUpdatePlan}
            />
          </div>
        ) : activeTab === 'packing' ? (
          <div className="space-y-6">
            <SmartPackingManager
              plan={plan}
              onUpdatePlan={onUpdatePlan}
            />
          </div>
        ) : activeTab === 'eco' ? (
          <div className="space-y-6">
            <EcoImpactTracker
              plan={plan}
              onOpenChat={onOpenChat}
            />
          </div>
        ) : activeTab === 'visuals' ? (
          <div className="space-y-6">
            <DayAttractionsVisualizer
              plan={plan}
              onUpdateDayLandmarks={handleUpdateLandmarks}
              onAskAboutAttraction={(landmark) => handleAskAboutLocation(landmark, 'معلم سياحي رئيسي')}
            />
          </div>
        ) : activeTab === 'map' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2 text-[#d4af37] font-bold text-lg">
                <MapIcon className="w-5 h-5" />
                <h3 className="text-white font-bold">الخريطة الجغرافية التفاعلية للمسار والمعالم السياحية</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('map3d')}
                className="px-3 py-1.5 rounded-xl bg-[#241a08] hover:bg-[#33240a] text-[#d4af37] border border-[#d4af37]/60 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow"
              >
                <Mountain className="w-3.5 h-3.5" />
                <span>تبديل إلى خريطة التضاريس 3D</span>
              </button>
            </div>
            <InteractiveTripMap
              plan={plan}
              onAskAboutLocation={handleAskAboutLocation}
              onSwitchTo3D={() => setActiveTab('map3d')}
              onSelectBooking={(title) => {
                setSelectedBookingActivity(title);
                setActiveTab('booking');
              }}
            />
          </div>
        ) : activeTab === 'alerts' ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[#d4af37] font-bold text-lg border-b border-neutral-800 pb-3">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="text-white font-bold">لوحة استخبارات وتنبيهات السفر</h3>
            </div>
            <TravelAlertsDashboard
              plan={plan}
              onApplyContingency={(newMarkdown) => {
                if (onUpdatePlanMarkdown) onUpdatePlanMarkdown(newMarkdown);
              }}
            />
          </div>
        ) : activeTab === 'weather' ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[#d4af37] font-bold text-lg border-b border-neutral-800 pb-3">
              <CloudSun className="w-5 h-5" />
              <h3 className="text-white font-bold">حالة الطقس المباشرة وتوصيات الملابس</h3>
            </div>
            <WeatherWidget destination={plan.destination} initialWeather={plan.weather} />
          </div>
        ) : activeTab === 'restaurants' ? (
          <div className="space-y-6">
            <RestaurantFinder
              plan={plan}
              onAskAboutRestaurant={handleAskAboutRestaurant}
            />
          </div>
        ) : activeTab === 'editor' ? (
          <div className="space-y-6">
            <ItineraryEditor
              plan={plan}
              onSavePlan={handleSaveEditorPlan}
            />
          </div>
        ) : activeTab === 'raw' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-neutral-400 border-b border-neutral-800 pb-3">
              <span>نص Markdown ({currentLanguage.toUpperCase()}) المولد بواسطة الذكاء الاصطناعي:</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[#d4af37] hover:underline cursor-pointer font-bold"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>نسخ</span>
              </button>
            </div>
            <pre className="bg-[#0a0a0a] p-4 rounded-xl text-xs sm:text-sm text-neutral-300 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed border border-neutral-800" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
              {displayMarkdown}
            </pre>
          </div>
        ) : activeTab === 'experiences' && plan.localExperiences ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[#d4af37] font-bold text-lg border-b border-neutral-800 pb-3">
              <Gem className="w-5 h-5" />
              <h3 className="text-white font-bold">وحدة التجارب المحلية غير السياحية (Local Experiences Module)</h3>
            </div>
            <LocalExperiencesCard
              experiences={plan.localExperiences}
              destination={plan.destination}
              onAskAboutExperience={handleAskAboutExperience}
            />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Visual Photo Gallery & Pharaonic Discoveries Banner */}
            <DestinationPhotoGallery
              destination={plan.destination}
              durationDays={plan.durationDays}
            />

            {/* Personal Notes & Booking References Banner if present */}
            {hasActivityNotes && (
              <div className="bg-[#181818] border border-[#d4af37]/40 rounded-xl p-4 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#d4af37]">
                    <Ticket className="w-4 h-4" />
                    <span>أرقام الحجوزات والملاحظات الشخصية المرفقة بالأنشطة:</span>
                  </div>
                  <button
                    onClick={() => setIsNotesModalOpen(true)}
                    className="text-[11px] text-[#e5c158] hover:underline cursor-pointer font-bold"
                  >
                    إدارة وتعديل الملاحظات
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activityNotesList.map((item) => (
                    <div key={item.id} className="bg-[#121212] p-3 rounded-lg border border-neutral-800 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#d4af37]">
                          🗓️ اليوم {item.dayNumber} {item.activityTitle ? `• ${item.activityTitle}` : ''}
                        </span>
                        {item.bookingNumber && (
                          <span className="font-mono text-amber-300 bg-[#1c1c1c] px-2 py-0.5 rounded border border-neutral-700">
                            #{item.bookingNumber}
                          </span>
                        )}
                      </div>
                      {item.ticketRef && (
                        <div className="text-[11px] text-emerald-300 font-medium">
                          🎟️ التذكرة / الموعد: {item.ticketRef}
                        </div>
                      )}
                      {item.noteText && (
                        <p className="text-neutral-300 text-[11px] leading-relaxed pt-0.5">{item.noteText}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Notes Card if present */}
            {hasCustomNotes && (
              <div className="bg-[#181818] border border-[#d4af37]/40 rounded-xl p-4 space-y-2.5 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#d4af37]">
                    <StickyNote className="w-4 h-4" />
                    <span>ملاحظات وتعديلات اليوميات الشخصية:</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('editor')}
                    className="text-[11px] text-neutral-400 hover:text-white underline cursor-pointer"
                  >
                    تعديل الملاحظات
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {Object.entries(customNotes).map(([dayNum, note]) => (
                    <div key={dayNum} className="bg-[#121212] p-2.5 rounded-lg border border-neutral-800 text-xs">
                      <span className="font-bold text-[#d4af37] block mb-0.5">🗓️ اليوم {dayNum}:</span>
                      <p className="text-neutral-200">{note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* View Full or Segmented */}
            {activeTab === 'all' && (
              <div className="space-y-8">
                {/* Trip Quality & AI Experience Evaluator */}
                <TripExperienceEvaluator
                  plan={plan}
                  onUpdatePlan={onUpdatePlan}
                  onOpenChat={onOpenChat}
                />

                {/* Live Budget & Expense Tracker */}
                <LiveExpenseTracker
                  plan={plan}
                  onUpdatePlan={onUpdatePlan}
                />

                {/* Visual Landmarks Showcase (Scenic AI) */}
                <DayAttractionsVisualizer
                  plan={plan}
                  onUpdateDayLandmarks={handleUpdateLandmarks}
                  onAskAboutAttraction={(landmark) => handleAskAboutLocation(landmark, 'معلم سياحي رئيسي')}
                />

                {/* Quick Booking Assistant (Deep Links Engine) */}
                <QuickBookingAssistant
                  plan={plan}
                  initialActivityTitle={selectedBookingActivity}
                />

                {/* 3D Terrain & Elevation Map Viewer */}
                <Terrain3DMapViewer
                  plan={plan}
                  onAskAboutLocation={handleAskAboutLocation}
                  onSelectBooking={(title) => {
                    setSelectedBookingActivity(title);
                    setActiveTab('booking');
                  }}
                />

                {/* Smart Contextual Tips & Local Hacks */}
                <SmartTipsManager
                  plan={plan}
                  onOpenChat={onOpenChat}
                />

                {/* Embedded Leaflet Map */}
                <InteractiveTripMap
                  plan={plan}
                  onAskAboutLocation={handleAskAboutLocation}
                  onSwitchTo3D={() => setActiveTab('map3d')}
                  onSelectBooking={(title) => {
                    setSelectedBookingActivity(title);
                    setActiveTab('booking');
                  }}
                />

                {/* Smart Packing Checklist with Weather Verification */}
                <SmartPackingManager
                  plan={plan}
                  onUpdatePlan={onUpdatePlan}
                />

                {/* Eco-Impact & Sustainable Transit Tracker */}
                <EcoImpactTracker
                  plan={plan}
                  onOpenChat={onOpenChat}
                />

                {/* Local Experiences Card */}
                {plan.localExperiences && plan.localExperiences.length > 0 && (
                  <LocalExperiencesCard
                    experiences={plan.localExperiences}
                    destination={plan.destination}
                    onAskAboutExperience={handleAskAboutExperience}
                  />
                )}

                {/* Interactive Day-by-Day Timeline */}
                <InteractiveTripTimeline
                  plan={plan}
                  onOpenChat={onOpenChat}
                  onAddActivityNote={(day, title) => openAddNoteForDay(day, title)}
                />

                {/* Markdown Body */}
                <div className="markdown-body" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                  <Markdown>{displayMarkdown}</Markdown>
                </div>

                {/* Currency Converter & Budget Allocation Section */}
                <CurrencyConverterWidget
                  planBudget={plan.constraints.budget}
                  planCurrency={plan.constraints.currency}
                  destination={plan.destination}
                  durationDays={plan.durationDays}
                />

                {/* Quick Add Activity Note Action Bar */}
                <div className="bg-[#141414] border border-dashed border-[#d4af37]/40 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Ticket className="w-4 h-4 text-[#d4af37]" />
                    <span className="text-xs text-neutral-300">
                      هل لديك حجز فندقي، تذكرة طيران، أو ملاحظة تود ربطها بالخطة؟
                    </span>
                  </div>
                  <button
                    onClick={() => setIsNotesModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] text-[#d4af37] border border-[#d4af37]/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة تذكير / رقم حجز</span>
                  </button>
                </div>

                {/* Restaurant Finder Embedded */}
                <RestaurantFinder
                  plan={plan}
                  onAskAboutRestaurant={handleAskAboutRestaurant}
                />

                {/* Star-Rating & User Experience Feedback */}
                <TripRatingFeedback
                  destination={plan.destination}
                  initialFeedback={plan.userFeedback}
                  onSaveFeedback={handleSaveFeedback}
                />
              </div>
            )}

            {activeTab === 'itinerary' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-[#d4af37] font-bold text-lg">
                    <Calendar className="w-5 h-5" />
                    <h3 className="text-white font-bold">1. جدول الرحلة الذكي (Day-by-Day Itinerary)</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsNotesModalOpen(true)}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#252525] text-amber-300 border border-neutral-800 cursor-pointer"
                    >
                      <Ticket className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>إضافة رقم حجز</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('editor')}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#252525] text-[#d4af37] border border-neutral-800 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>تحرير الجدول</span>
                    </button>
                  </div>
                </div>

                {/* Interactive Day-by-Day Timeline */}
                <InteractiveTripTimeline
                  plan={plan}
                  onOpenChat={onOpenChat}
                  onAddActivityNote={(day, title) => openAddNoteForDay(day, title)}
                />

                {/* Day Attractions Visual Showcase alongside day by day */}
                <DayAttractionsVisualizer
                  plan={plan}
                  onUpdateDayLandmarks={handleUpdateLandmarks}
                  onAskAboutAttraction={(landmark) => handleAskAboutLocation(landmark, 'معلم سياحي رئيسي')}
                />

                <div className="markdown-body">
                  <Markdown>{parsed.itineraryPart}</Markdown>
                </div>
              </div>
            )}

            {activeTab === 'rationale' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#d4af37] font-bold text-lg border-b border-neutral-800 pb-3">
                  <Lightbulb className="w-5 h-5" />
                  <h3 className="text-white font-bold">2. لماذا اخترنا هذه الأماكن؟ (Decision Rationale)</h3>
                </div>
                <div className="markdown-body">
                  <Markdown>{parsed.rationalePart || 'لم يتم العثور على قسم المبررات بشكل منفصل، يرجى مراجعة التقرير الكامل.'}</Markdown>
                </div>
              </div>
            )}

            {activeTab === 'budget' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-[#d4af37] font-bold text-lg border-b border-neutral-800 pb-3">
                  <Wallet className="w-5 h-5" />
                  <h3 className="text-white font-bold">3. تحليل وتوزيع الميزانية (Smart Budget Allocation)</h3>
                </div>

                {/* Live Expense Tracker */}
                <LiveExpenseTracker
                  plan={plan}
                  onUpdatePlan={onUpdatePlan}
                />

                {/* Live Currency Converter Widget */}
                <CurrencyConverterWidget
                  planBudget={plan.constraints.budget}
                  planCurrency={plan.constraints.currency}
                  destination={plan.destination}
                  durationDays={plan.durationDays}
                />

                {parsed.hasWarning && (
                  <div className="p-4 rounded-xl bg-[#2a1708] border border-orange-500/40 text-orange-200 text-sm flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-orange-400" />
                    <div>
                      <span className="font-bold block mb-1 text-orange-300">⚠️ [Budget Warning]: تنبيه ذكي حول الميزانية</span>
                      <p className="text-xs sm:text-sm text-orange-200/90 leading-relaxed">
                        قد تحتاج بعض المطاعم أو الأنشطة المحددة إلى مراجعة للتأكد من عدم تجاوز السقف اليومي. راجع التوزيع والمصروفات أدناه لتحقيق التوازن الأمثل.
                      </p>
                    </div>
                  </div>
                )}

                <div className="markdown-body">
                  <Markdown>{parsed.budgetPart || 'لم يتم العثور على قسم الميزانية بشكل منفصل، يرجى مراجعة التقرير الكامل.'}</Markdown>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Sticky Assistant CTA Banner */}
      <div className="bg-[#111111] border border-[#d4af37]/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-[#d4af37]/20 flex items-center justify-center border border-[#d4af37]/40 text-[#d4af37]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">هل ترغب بتعديل الخطة أو استبدال نشاط معين؟</h4>
            <p className="text-xs text-neutral-400">مستشارك الذكي جاهز للإجابة واقتراح بدائل وحساب التكاليف فوراً.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {onOpenReminders && (
            <button
              onClick={onOpenReminders}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] text-neutral-200 border border-neutral-700 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <ListTodo className="w-4 h-4 text-[#d4af37]" />
              <span>المهام والتذكيرات</span>
            </button>
          )}

          <button
            onClick={() => setIsHighlightCardModalOpen(true)}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#221a08] hover:bg-[#2e230b] text-[#d4af37] border border-[#d4af37]/60 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow"
          >
            <ImageIcon className="w-4 h-4 text-[#d4af37]" />
            <span>بطاقة الهايلايت 📸</span>
          </button>

          <button
            onClick={() => setIsPdfModalOpen(true)}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] text-neutral-200 border border-neutral-700 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <FileDown className="w-4 h-4 text-[#d4af37]" />
            <span>تصدير PDF</span>
          </button>

          <button
            onClick={() => onOpenChat()}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#d4af37]/20 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>الدردشة مع المستشار</span>
          </button>
        </div>
      </div>

      {/* Modals & Drawers */}
      {isPdfModalOpen && (
        <PdfExportModal
          plan={plan}
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
        />
      )}

      {isShareModalOpen && (
        <ShareTripModal
          plan={plan}
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          onOpenCollaborators={() => {
            setIsShareModalOpen(false);
            setIsCollaboratorsOpen(true);
          }}
        />
      )}

      {isNotesModalOpen && (
        <ActivityNotesModal
          plan={plan}
          isOpen={isNotesModalOpen}
          onClose={() => setIsNotesModalOpen(false)}
          onSaveNotes={handleSaveActivityNotes}
          initialDay={selectedNoteDay}
          initialActivityTitle={selectedNoteActivity}
        />
      )}

      {/* Trip Highlight Card Share Modal */}
      {isHighlightCardModalOpen && (
        <TripHighlightCardModal
          plan={plan}
          isOpen={isHighlightCardModalOpen}
          onClose={() => setIsHighlightCardModalOpen(false)}
        />
      )}

      {/* Collaborator Notes & Group Planning Drawer */}
      <CollaboratorNotesDrawer
        isOpen={isCollaboratorsOpen}
        onClose={() => setIsCollaboratorsOpen(false)}
        plan={plan}
        onUpdatePlan={onUpdatePlan}
      />
    </div>
  );
};

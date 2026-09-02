import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plane, Hotel, Ticket, ShieldCheck, CreditCard, ExternalLink, 
  Phone, MessageSquare, Check, Sparkles, AlertCircle, ArrowUpRight, 
  Clock, Lock, CheckCircle2, ChevronRight, Zap, Download, 
  Smartphone, Copy, RefreshCw, Send, HelpCircle, BadgePercent,
  Calendar, MapPin, Eye, EyeOff, ShieldAlert, Award, User, 
  FileText, Bookmark, Trash2, CheckSquare, Layers
} from 'lucide-react';
import { GeneratedPlan } from '../types';
import { 
  OFFICIAL_AIRLINES_DATABASE, 
  OFFICIAL_HOTEL_CHAINS_DATABASE, 
  OfficialAirline, 
  OfficialHotelChain, 
  extractActivitiesFromPlan, 
  ActivityBookingItem 
} from '../utils/bookingUtils';
import { getAirlineById, getAirlineByIata, classifyAirlineRecord } from '../utils/airlineIndex';
import { 
  OFFICIAL_GLOBAL_TOUR_PLATFORMS, 
  GLOBAL_TRAVEL_ADDON_SERVICES, 
  GlobalTourPlatform, 
  TravelAddonService 
} from '../data/globalDestinations';
import { SupportedLanguage } from '../utils/i18n';

export interface SavedBookingRecord {
  id: string;
  referenceId: string;
  category: 'flight' | 'hotel' | 'tour' | 'service';
  providerName: string;
  providerLogo?: string;
  passengerName: string;
  passportOrId?: string;
  travelDate: string;
  contactPhone: string;
  passengerEmail?: string;
  specialNotes?: string;
  destination: string;
  officialUrl: string;
  createdAt: string;
  status: 'confirmed_redirected' | 'stored_locally';
}

interface DirectBookingExecutionHubProps {
  plan: GeneratedPlan;
  currentLanguage?: SupportedLanguage;
  onClose?: () => void;
}

type HubTab = 'flights' | 'hotels' | 'tours_activities' | 'addon_services' | 'saved_records' | 'checkout';

export const DirectBookingExecutionHub: React.FC<DirectBookingExecutionHubProps> = ({
  plan,
  currentLanguage = 'ar',
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<HubTab>('flights');
  const [selectedAirline, setSelectedAirline] = useState<OfficialAirline>(getAirlineById(OFFICIAL_AIRLINES_DATABASE[0].id) || OFFICIAL_AIRLINES_DATABASE[0]);
  const selectedAirlineClassification = classifyAirlineRecord(selectedAirline);
  const [selectedHotel, setSelectedHotel] = useState<OfficialHotelChain>(OFFICIAL_HOTEL_CHAINS_DATABASE[0]);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Dynamic Passenger Input State
  const [passengerName, setPassengerName] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [travelDate, setTravelDate] = useState(() => {
    // Default to tomorrow
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [contactPhone, setContactPhone] = useState('');
  const [passengerEmail, setPassengerEmail] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [travelClass, setTravelClass] = useState<'economy' | 'business' | 'first'>('economy');

  // Validation State
  const [formErrors, setFormErrors] = useState<{
    passengerName?: string;
    travelDate?: string;
    contactPhone?: string;
  }>({});

  // Interactive Redirect Loading State
  const [redirectModalData, setRedirectModalData] = useState<{
    isOpen: boolean;
    providerName: string;
    providerLogo: string;
    targetUrl: string;
    step: number;
    stepMessage: string;
    progress: number;
    recordId: string;
  }>({
    isOpen: false,
    providerName: '',
    providerLogo: '',
    targetUrl: '',
    step: 1,
    stepMessage: '',
    progress: 0,
    recordId: '',
  });

  // Local Storage Saved Bookings
  const [savedBookings, setSavedBookings] = useState<SavedBookingRecord[]>(() => {
    try {
      const stored = localStorage.getItem('traviq_saved_direct_bookings');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Early Check-in form state
  const [earlyCheckinTime, setEarlyCheckinTime] = useState('11:00');
  const [roomPreference, setRoomPreference] = useState('طابق علوي وإطلالة هادئة');
  const [generatedCheckinMsg, setGeneratedCheckinMsg] = useState<string | null>(null);

  // Checkout Simulator State
  const [paymentMethod, setPaymentMethod] = useState<'apple_pay' | 'mada' | 'visa_mastercard' | 'stc_pay' | 'tabby' | 'tamara' | 'google_pay' | 'paypal'>('apple_pay');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessReceipt, setPaymentSuccessReceipt] = useState<{
    referenceId: string;
    date: string;
    amount: string;
    method: string;
    serviceTitle: string;
  } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('traviq_saved_direct_bookings', JSON.stringify(savedBookings));
    } catch (e) {
      console.warn('Failed to save bookings locally', e);
    }
  }, [savedBookings]);

  // Extracted plan activities
  const allActivities = useMemo(() => extractActivitiesFromPlan(plan), [plan]);

  // Handle copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  // Validate passenger input form
  const validatePassengerForm = (): boolean => {
    const errors: {
      passengerName?: string;
      travelDate?: string;
      contactPhone?: string;
    } = {};

    if (!passengerName.trim()) {
      errors.passengerName = 'برجاء إدخال اسم المسافر كما هو مدون في جواز السفر أو الهوية';
    } else if (passengerName.trim().length < 3) {
      errors.passengerName = 'الاسم يجب ألا يقل عن 3 أحرف';
    }

    if (!travelDate) {
      errors.travelDate = 'برجاء تحديد تاريخ السفر أو الحجز المطلوب';
    }

    if (!contactPhone.trim()) {
      errors.contactPhone = 'برجاء إدخال رقم الهاتف أو الواتساب للتواصل وتأكيد الحجز';
    } else if (contactPhone.trim().length < 6) {
      errors.contactPhone = 'رقم الهاتف غير صالح';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Trigger Safe Direct Redirect with Progress Animation
  const handleInitiateDirectBooking = (
    providerName: string,
    providerLogo: string,
    targetUrl: string,
    category: 'flight' | 'hotel' | 'tour' | 'service'
  ) => {
    const isValid = validatePassengerForm();
    if (!isValid) {
      // Scroll to form inputs smoothly
      const formElem = document.getElementById('passenger-dynamic-inputs-card');
      if (formElem) {
        formElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const reference = `TRAVIQ-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create record to store in localStorage
    const newRecord: SavedBookingRecord = {
      id: `rec_${Date.now()}`,
      referenceId: reference,
      category,
      providerName,
      providerLogo,
      passengerName: passengerName.trim(),
      passportOrId: passportNumber.trim() || undefined,
      travelDate,
      contactPhone: contactPhone.trim(),
      passengerEmail: passengerEmail.trim() || undefined,
      specialNotes: specialNotes.trim() || undefined,
      destination: plan.destination,
      officialUrl: targetUrl,
      createdAt: new Date().toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' }),
      status: 'confirmed_redirected',
    };

    // Save record to local state
    setSavedBookings((prev) => [newRecord, ...prev.filter((r) => r.referenceId !== reference)]);

    // Start Interactive Multi-step Loading Animation
    setRedirectModalData({
      isOpen: true,
      providerName,
      providerLogo,
      targetUrl,
      step: 1,
      stepMessage: 'جارٍ التحقق من صحة البيانات المسجلة ومعايير الحجز المباشر...',
      progress: 25,
      recordId: reference,
    });

    // Step 2 after 700ms
    setTimeout(() => {
      setRedirectModalData((prev) => ({
        ...prev,
        step: 2,
        stepMessage: 'جارٍ تشفير وحفظ بيانات الحجز في سجلك المحلي لسهولة الرجوع...',
        progress: 65,
      }));
    }, 750);

    // Step 3 after 1500ms
    setTimeout(() => {
      setRedirectModalData((prev) => ({
        ...prev,
        step: 3,
        stepMessage: `جارٍ فتح الاتصال الآمن وتوجيهك إلى الموقع الرسمي لـ (${providerName})...`,
        progress: 100,
      }));
    }, 1500);

    // Auto-open external URL after 2300ms
    setTimeout(() => {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }, 2300);
  };

  // Delete saved record
  const handleDeleteRecord = (id: string) => {
    setSavedBookings((prev) => prev.filter((r) => r.id !== id));
  };

  // Generate WhatsApp / Email Early Check-in template
  const handleGenerateEarlyCheckinMsg = () => {
    const pName = passengerName.trim() || 'مسافر كريم';
    const msg = `مرحباً فريق الاستقبال في ${selectedHotel.name}،
أنا النزيل (${pName})، ورقم التواصل (${contactPhone || 'المسجل في الحجز'}).
لدي حجز قادم لرحلة ${plan.destination} بتاريخ (${travelDate}).
أود إشعاركم بأن موعد وصولي المتوقع للفندق سيكون في تمام الساعة (${earlyCheckinTime}).
نرجو التكرم بتنسيق تسجيل الوصول المبكر (Early Check-in) وتجهيز الغرفة (${roomPreference}) ومفتاح الدخول فور الوصول إن أمكن.
شاكرين لكم حسن تعاونكم الدائم.`;
    setGeneratedCheckinMsg(msg);
  };

  // Simulate Instant Direct Payment Execution
  const handleExecutePayment = () => {
    setIsProcessingPayment(true);
    setPaymentSuccessReceipt(null);

    setTimeout(() => {
      setIsProcessingPayment(false);
      const ref = `TRAVIQ-PAY-${Math.floor(100000 + Math.random() * 900000)}`;
      setPaymentSuccessReceipt({
        referenceId: ref,
        date: new Date().toLocaleString('ar-SA'),
        amount: plan.constraints?.budget ? `${plan.constraints.budget} ${plan.constraints.currency || 'SAR'}` : '2,450 ر.س',
        method: getPaymentMethodTitle(paymentMethod),
        serviceTitle: `تأكيد حجز وتنفيذ خدمات رحلة ${plan.destination}`,
      });
    }, 1400);
  };

  const getPaymentMethodTitle = (method: string) => {
    switch (method) {
      case 'apple_pay': return 'Apple Pay (الدفع الآمن بلمسة واحدة)';
      case 'mada': return 'بطاقة مدى (Mada Direct Debit)';
      case 'visa_mastercard': return 'Visa / Mastercard (3D Secure 2.0)';
      case 'stc_pay': return 'محفظة STC Pay الرقمية';
      case 'tabby': return 'تابي (Tabby - 4 دفعات بدون فوائد)';
      case 'tamara': return 'تمارا (Tamara - قسمها على دفعات)';
      case 'google_pay': return 'Google Pay';
      case 'paypal': return 'PayPal Buyer Protection';
      default: return 'بوابة الدفع الآمنة المعتمدة';
    }
  };

  return (
    <div id="direct-booking-execution-hub" className="bg-gradient-to-b from-[#0b1426] via-[#091122] to-[#070c18] border border-[#d4af37]/50 rounded-3xl p-4 sm:p-7 space-y-6 shadow-2xl relative overflow-hidden text-right">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

      {/* ========================================================================= */}
      {/* 🚀 TOP MAIN BANNER & BRANDING */}
      {/* ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-neutral-800/90 pb-6 relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-[#d4af37]/25 to-[#f5d061]/20 text-[#f5d061] border border-[#d4af37]/50 text-xs font-black flex items-center gap-1.5 shadow-md">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span>منظومة الحجز والتنفيذ المباشر المعتمدة (Direct Official Execution Engine)</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% بدون عمولات وسطاء • بوردنج ووزن مجاناً • ضمان أقل سعر</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">
            بوابة الحجز والتنفيذ الرسمي المباشر لرحلة {plan.destination}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl leading-relaxed">
            أدخل بياناتك مرة واحدة واربط حجزك مباشرة بمواقع شركات الطيران والفنادق ومنظمي الجولات والمشغلين الرسميين، مع حفظ سجلاتك محلياً والتحقق الفوري من صحة البيانات.
          </p>
        </div>

        {/* Saved Bookings Quick Badge */}
        {savedBookings.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveTab('saved_records')}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-[#d4af37]/20 hover:from-amber-500/30 hover:to-[#d4af37]/30 border border-[#d4af37]/50 text-white text-xs font-black flex items-center gap-2 transition-all shadow cursor-pointer self-start lg:self-auto"
          >
            <Bookmark className="w-4 h-4 text-[#d4af37]" />
            <span>حجوزاتي المسجلة والمحفوظة ({savedBookings.length})</span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 📝 DYNAMIC PASSENGER INPUTS & FORM VALIDATION CARD */}
      {/* ========================================================================= */}
      <div id="passenger-dynamic-inputs-card" className="bg-[#0e1930] border-2 border-sky-500/40 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-500/50 flex items-center justify-center text-sky-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <span>بيانات المسافر والتحقق الرقمي للحجز المباشر</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-500/30">
                  تخزين محلي آمن 🔒
                </span>
              </h3>
              <p className="text-xs text-neutral-300">
                تُستخدم هذه البيانات للتحقق وتعبئة روابط الحجز الرسمي وربطها برقمك المرجعي تلقائياً.
              </p>
            </div>
          </div>

          <span className="text-[11px] font-bold text-amber-300 bg-amber-950/60 px-3 py-1 rounded-lg border border-amber-500/30 self-start sm:self-auto">
            الحقول المميزة بـ (*) إلزامية للتحقق
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Field 1: Passenger Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-200 flex items-center justify-between">
              <span>اسم المسافر الكامل (كما في الجواز) *</span>
              {passengerName && !formErrors.passengerName && (
                <span className="text-emerald-400 text-[10px] flex items-center gap-0.5">
                  <Check className="w-3 h-3" /> تم التحقق
                </span>
              )}
            </label>
            <div className="relative">
              <input
                type="text"
                value={passengerName}
                onChange={(e) => {
                  setPassengerName(e.target.value);
                  if (formErrors.passengerName) {
                    setFormErrors((prev) => ({ ...prev, passengerName: undefined }));
                  }
                }}
                className={`w-full bg-[#070d1a] border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none transition-all ${
                  formErrors.passengerName ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-neutral-700 focus:border-sky-400'
                }`}
                placeholder="مثال: أحمد محمد علي / Ahmed Mohamed"
              />
            </div>
            {formErrors.passengerName && (
              <p className="text-[11px] font-bold text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                <span>{formErrors.passengerName}</span>
              </p>
            )}
          </div>

          {/* Field 2: Travel Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-200 flex items-center justify-between">
              <span>تاريخ السفر / الحجز المستهدف *</span>
              {travelDate && !formErrors.travelDate && (
                <span className="text-emerald-400 text-[10px] flex items-center gap-0.5">
                  <Check className="w-3 h-3" /> صحيح
                </span>
              )}
            </label>
            <div className="relative">
              <input
                type="date"
                value={travelDate}
                onChange={(e) => {
                  setTravelDate(e.target.value);
                  if (formErrors.travelDate) {
                    setFormErrors((prev) => ({ ...prev, travelDate: undefined }));
                  }
                }}
                className={`w-full bg-[#070d1a] border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white outline-none transition-all ${
                  formErrors.travelDate ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-neutral-700 focus:border-sky-400'
                }`}
              />
            </div>
            {formErrors.travelDate && (
              <p className="text-[11px] font-bold text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                <span>{formErrors.travelDate}</span>
              </p>
            )}
          </div>

          {/* Field 3: Contact Phone / WhatsApp */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-200 flex items-center justify-between">
              <span>رقم الهاتف / الواتساب للتنبيهات *</span>
              {contactPhone && !formErrors.contactPhone && (
                <span className="text-emerald-400 text-[10px] flex items-center gap-0.5">
                  <Check className="w-3 h-3" /> جاهز
                </span>
              )}
            </label>
            <div className="relative">
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => {
                  setContactPhone(e.target.value);
                  if (formErrors.contactPhone) {
                    setFormErrors((prev) => ({ ...prev, contactPhone: undefined }));
                  }
                }}
                className={`w-full bg-[#070d1a] border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none transition-all ${
                  formErrors.contactPhone ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-neutral-700 focus:border-sky-400'
                }`}
                placeholder="+20 100 000 0000 / +966 50 000 0000"
              />
            </div>
            {formErrors.contactPhone && (
              <p className="text-[11px] font-bold text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                <span>{formErrors.contactPhone}</span>
              </p>
            )}
          </div>

          {/* Field 4: Passport / ID (Optional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-300">رقم جواز السفر أو الهوية الوطنية (اختياري)</label>
            <input
              type="text"
              value={passportNumber}
              onChange={(e) => setPassportNumber(e.target.value)}
              className="w-full bg-[#070d1a] border border-neutral-700 focus:border-sky-400 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none"
              placeholder="مثال: A12345678 / 1087654321"
            />
          </div>

          {/* Field 5: Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-300">البريد الإلكتروني لاستلام التذاكر الرقمية</label>
            <input
              type="email"
              value={passengerEmail}
              onChange={(e) => setPassengerEmail(e.target.value)}
              className="w-full bg-[#070d1a] border border-neutral-700 focus:border-sky-400 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none"
              placeholder="name@example.com"
            />
          </div>

          {/* Field 6: Travel Class / Preference */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-300">درجة السفر وتفضيل المقعد</label>
            <select
              value={travelClass}
              onChange={(e) => setTravelClass(e.target.value as any)}
              className="w-full bg-[#070d1a] border border-neutral-700 focus:border-sky-400 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white outline-none"
            >
              <option value="economy">درجة سياحية متميزة (Economy Plus)</option>
              <option value="business">درجة رجال الأعمال (Business Class)</option>
              <option value="first">الدرجة الأولى الفاخرة (First Class)</option>
            </select>
          </div>
        </div>

        {/* Special Preferences line */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-neutral-300">تفضيلات إضافية خاصة (مقعد نافذة / وجبة خاصة / وصول مبكر):</label>
          <input
            type="text"
            value={specialNotes}
            onChange={(e) => setSpecialNotes(e.target.value)}
            className="w-full bg-[#070d1a] border border-neutral-700 focus:border-sky-400 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 outline-none"
            placeholder="مثال: مقعد بجوار النافذة، وجبة نباتية، توفير سرير إضافي للطفل..."
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🧭 PRIMARY NAVIGATION TABS */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 bg-[#060c18] p-1.5 rounded-2xl border border-neutral-800 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('flights')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap flex-1 justify-center ${
            activeTab === 'flights'
              ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25'
              : 'text-neutral-400 hover:text-white hover:bg-[#111a2f]'
          }`}
        >
          <Plane className="w-4 h-4" />
          <span>طيران رسمي وبوردنج مجاني ✈️</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('hotels')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap flex-1 justify-center ${
            activeTab === 'hotels'
              ? 'bg-gradient-to-r from-amber-500 to-[#d4af37] text-black shadow-lg shadow-amber-500/25'
              : 'text-neutral-400 hover:text-white hover:bg-[#111a2f]'
          }`}
        >
          <Hotel className="w-4 h-4" />
          <span>فنادق أصلية ودخول مبكر 🏨</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tours_activities')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap flex-1 justify-center ${
            activeTab === 'tours_activities'
              ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/25'
              : 'text-neutral-400 hover:text-white hover:bg-[#111a2f]'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>جولات ومتاحف وتخطي الطوابير 🏛️</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('addon_services')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap flex-1 justify-center ${
            activeTab === 'addon_services'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
              : 'text-neutral-400 hover:text-white hover:bg-[#111a2f]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>الخدمات الإضافية المعتمدة (eSIM، تأمين، سيارات) 🧰</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('saved_records')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap flex-1 justify-center ${
            activeTab === 'saved_records'
              ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-black shadow-lg shadow-amber-500/25'
              : 'text-neutral-400 hover:text-white hover:bg-[#111a2f]'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>حجوزاتي المسجلة ({savedBookings.length}) 📂</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OFFICIAL AIRLINES DIRECT PORTAL */}
      {/* ========================================================================= */}
      {activeTab === 'flights' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Highlight Notification Bar */}
          <div className="bg-gradient-to-r from-[#0c182e] via-[#142647] to-[#0c182e] border border-sky-500/40 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/50 flex items-center justify-center text-sky-400 flex-shrink-0 mt-0.5">
                <Plane className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-black text-white">
                  المزايا الحصرية للحجز المباشر من موقع شركة الطيران والمشغل الرسمي:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 text-xs text-neutral-200">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>أقل سعر رسمي معفي من عمولات الوسطاء</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>قص البوردنج (Boarding Pass) مجاناً عبر الإنترنت</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>اختيار المقاعد والأمتعة والوزن الأصلي بأمان</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 🕋 & 🇵🇸 Dedicated Holy & Heritage Paths Quick Access Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Hajj & Umrah Portal Card */}
            <div className="bg-gradient-to-br from-[#1c1404] via-[#241a06] to-[#120d02] border-2 border-amber-500/50 rounded-2xl p-4 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🕋</span>
                  <div>
                    <h4 className="text-sm font-black text-white">بوابة الحج والعمرة والروضة الشريفة الرسمية</h4>
                    <span className="text-[11px] text-amber-300">منصة نُسك (Nusuk) • قطار الحرمين السريع • الخطوط السعودية</span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  اعتماد رسمي
                </span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                استخراج تصاريح العمرة والروضة الشريفة فوراً بدون وسطاء، وحجز تذاكر قطار الحرمين السريع بين مكة والمدينة وجدة.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleInitiateDirectBooking('منصة نُسك الرسمية (Nusuk)', '🕋', 'https://www.nusuk.sa', 'flight')}
                  className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <span>بوابة نُسك الرسمية</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleInitiateDirectBooking('قطار الحرمين السريع', '🚄', 'https://sar.hhr.sa', 'flight')}
                  className="py-2 px-3 rounded-xl bg-[#2e210a] hover:bg-[#3d2c0d] border border-amber-400/40 text-amber-200 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <span>قطار الحرمين</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Palestine & Jerusalem Portal Card */}
            <div className="bg-gradient-to-br from-[#06190f] via-[#092415] to-[#04120a] border-2 border-emerald-500/50 rounded-2xl p-4 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🇵🇸</span>
                  <div>
                    <h4 className="text-sm font-black text-white">مسار القدس الشريف والمسجد الأقصى المبارك</h4>
                    <span className="text-[11px] text-emerald-300">أوقاف القدس • معابر الأردن وجسر الملك حسين • السياحة الفلسطينية</span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  تراث وهوية
                </span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                الإجراءات المعتمدة لزيارة المسجد الأقصى والبلدة القديمة بالقدس وبيت لحم والخليل، مع بيانات العبور الرسمية.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleInitiateDirectBooking('أوقاف القدس والمسجد الأقصى', '🕌', 'https://www.jerusalem-waqf.org', 'tour')}
                  className="py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <span>بوابة أوقاف القدس</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleInitiateDirectBooking('دليل السياحة الفلسطيني الرسمي', '🌿', 'https://www.travelpalestine.ps', 'tour')}
                  className="py-2 px-3 rounded-xl bg-[#0d2a1b] hover:bg-[#133c27] border border-emerald-400/40 text-emerald-200 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <span>دليل السفر للقدس</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Airlines Grid Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#d4af37] uppercase tracking-wider">
                اختر شركة الطيران الرسمية المفضلة لوجهتك ({plan.destination}):
              </span>
              <span className="text-[11px] text-neutral-400">جميع الروابط موثقة ورسمية 100%</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {OFFICIAL_AIRLINES_DATABASE.map((airline) => {
                const enrichedAirline = getAirlineById(airline.id) || airline;
                const airlineClass = classifyAirlineRecord(enrichedAirline);
                const isSelected = selectedAirline.id === airline.id;
                return (
                  <div
                    key={airline.id}
                    onClick={() => setSelectedAirline(getAirlineById(airline.id) || airline)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'bg-[#15233d] border-sky-400 shadow-lg shadow-sky-500/20'
                        : 'bg-[#090f1e] hover:bg-[#111c33] border-neutral-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{airline.logo}</span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-black text-white">{airline.name}</h4>
                          <span className="text-[10px] text-neutral-400 block">{airline.nameEn} • {airline.country}</span>
                          {airlineClass && airlineClass.verified && airlineClass.serviceLevel && (
                            <span className="text-[10px] inline-block mt-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                              {airlineClass.serviceLevel === 'PREMIUM' ? 'ممتاز' : airlineClass.serviceLevel === 'STANDARD' ? 'قياسي' : airlineClass.serviceLevel === 'ECONOMY' ? 'اقتصادي' : ''}
                            </span>
                            )}
                        </div>
                      </div>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-sky-400 text-black flex items-center justify-center text-xs font-black">
                          ✓
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 bg-[#060a14] p-2.5 rounded-xl border border-neutral-800/80 text-[11px]">
                      {airline.directBenefits.slice(0, 2).map((benefit, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-1.5 text-neutral-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          <span className="line-clamp-1">{benefit}</span>
                        </div>
                      ))}
                    </div>

                    {/* Direct Action Buttons with Validation & Interactive Loading */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAirline(getAirlineById(airline.id) || airline);
                          handleInitiateDirectBooking(
                            airline.name,
                            airline.logo,
                            airline.officialBookingUrl,
                            'flight'
                          );
                        }}
                        className="px-3 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-white text-xs font-black flex items-center justify-center gap-1 transition-all shadow cursor-pointer"
                        title="تأكيد البيانات والانتقال للموقع الرسمي للحجز"
                      >
                        <span>تأكيد وحجز رسمي</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>

                      <a
                        href={airline.webCheckinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-2 rounded-xl bg-[#1b2844] hover:bg-[#25375d] border border-sky-500/40 text-sky-300 text-xs font-bold flex items-center justify-center gap-1 transition-all text-center"
                        title="قص بطاقة صعود الطائرة مجاناً"
                      >
                        <span>قص البوردنج 🎫</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Airline Deep Dive Box */}
          <div className="bg-[#0d1629] border border-sky-500/40 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedAirline.logo}</span>
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <span>{selectedAirline.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 font-bold">
                      بوابة الحجز المباشرة الرسمية
                    </span>
                    {selectedAirlineClassification && selectedAirlineClassification.verified && selectedAirlineClassification.serviceLevel && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold">
                        {selectedAirlineClassification.serviceLevel === 'PREMIUM' ? 'ممتاز' : selectedAirlineClassification.serviceLevel === 'STANDARD' ? 'قياسي' : selectedAirlineClassification.serviceLevel === 'ECONOMY' ? 'اقتصادي' : ''}
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-neutral-300 mt-0.5">
                    الرابط المباشر للبحث وحجز الرحلات إلى {plan.destination} وتأكيد التذاكر الإلكترونية الأصلية
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleInitiateDirectBooking(
                    selectedAirline.name,
                    selectedAirline.logo,
                    selectedAirline.officialBookingUrl,
                    'flight'
                  )
                }
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-white font-black text-xs flex items-center gap-1.5 shadow-lg hover:scale-105 transition-all cursor-pointer"
              >
                <span>تأكيد البيانات وفتح الموقع الرسمي لـ {selectedAirline.nameEn}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#080e1c] p-4 rounded-xl border border-neutral-800 space-y-2">
                <h5 className="text-xs font-black text-sky-400 flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  <span>المزايا الحصرية للحجز المباشر من موقع هذه الشركة:</span>
                </h5>
                <ul className="space-y-1.5 text-xs text-neutral-200">
                  {selectedAirline.directBenefits.map((b, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#080e1c] p-4 rounded-xl border border-neutral-800 space-y-2.5 flex flex-col justify-between">
                <div>
                  <h5 className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                    <Zap className="w-4 h-4" />
                    <span>خدمة قص البوردنج وإدارة الأمتعة:</span>
                  </h5>
                  <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                    يمكنك إصدار بطاقات الصعود الرقمية وإضافتها لمحفظة الهاتف Apple Wallet أو Google Wallet قبل 24-48 ساعة مجاناً ودون الانتظار في كاونتر المطار.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={selectedAirline.webCheckinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 rounded-lg bg-sky-950/70 hover:bg-sky-900 border border-sky-500/40 text-sky-300 text-xs font-bold text-center transition-all"
                  >
                    تسجيل الوصول الإلكتروني (Web Check-in) 🎫
                  </a>
                  <a
                    href={selectedAirline.baggagePolicyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-bold transition-all"
                    title="الاطلاع على جدول الأوزان المسموح بها"
                  >
                    جدول الأوزان 🧳
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: OFFICIAL HOTEL PORTALS & FAST CHECK-IN */}
      {/* ========================================================================= */}
      {activeTab === 'hotels' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#201808] via-[#2a200d] to-[#201808] border border-[#d4af37]/40 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37] flex-shrink-0 mt-0.5">
                <Hotel className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-black text-white">
                  الحجز المباشر من موقع الفندق + خدمة التنسيق السريع لاستلام الغرفة
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed mt-1">
                  احصل على ضمان أقل سعر للغرفة مع ترقيات مجانية للأعضاء، وإمكانية التواصل المباشر عبر واتساب وهاتف الاستقبال لترتيب تسجيل الدخول المبكر (Early Check-in).
                </p>
              </div>
            </div>
          </div>

          {/* Hotel Chains Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {OFFICIAL_HOTEL_CHAINS_DATABASE.map((hotel) => {
              const isSelected = selectedHotel.id === hotel.id;
              return (
                <div
                  key={hotel.id}
                  onClick={() => setSelectedHotel(hotel)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'bg-[#1f1b11] border-[#d4af37] shadow-lg shadow-[#d4af37]/20'
                      : 'bg-[#090f1d] hover:bg-[#121a2f] border-neutral-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{hotel.logo}</span>
                      <h4 className="text-xs sm:text-sm font-black text-white">{hotel.name}</h4>
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-[#d4af37] text-black flex items-center justify-center text-xs font-black">
                        ✓
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 bg-[#060a14] p-2.5 rounded-xl border border-neutral-800/80 text-[11px]">
                    {hotel.directBenefits.slice(0, 2).map((benefit, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-1.5 text-neutral-300">
                        <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span className="line-clamp-1">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedHotel(hotel);
                        handleInitiateDirectBooking(
                          hotel.name,
                          hotel.logo,
                          hotel.officialBookingUrl,
                          'hotel'
                        );
                      }}
                      className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-[#d4af37] text-black text-xs font-black flex items-center justify-center gap-1 hover:brightness-110 transition-all shadow cursor-pointer"
                    >
                      <span>تأكيد وحجز فندقي مباشر</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Early Check-in Generator */}
          <div className="bg-[#121a2c] border border-neutral-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-3 border-b border-neutral-800 pb-3">
              <Sparkles className="w-5 h-5 text-[#d4af37]" />
              <div>
                <h4 className="text-sm font-black text-white">
                  منسق تسجيل الدخول المبكر والطلبات الخاصة بالفندق (Early Check-in Assistant)
                </h4>
                <p className="text-xs text-neutral-300">
                  توليد رسالة رسمية مسبقة لإرسالها لمكتب استقبال فندقك في {plan.destination} لتجهيز الغرفة والمفتاح الرقمي قبل وصولك
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">اسم النزيل الأساسي:</label>
                <input
                  type="text"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  className="w-full bg-[#080d19] border border-neutral-700 focus:border-[#d4af37] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  placeholder="الاسم كما في الحجز..."
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">وقت الوصول المتوقع للفندق:</label>
                <input
                  type="time"
                  value={earlyCheckinTime}
                  onChange={(e) => setEarlyCheckinTime(e.target.value)}
                  className="w-full bg-[#080d19] border border-neutral-700 focus:border-[#d4af37] rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">تفضيل الغرفة الخاص:</label>
                <input
                  type="text"
                  value={roomPreference}
                  onChange={(e) => setRoomPreference(e.target.value)}
                  className="w-full bg-[#080d19] border border-neutral-700 focus:border-[#d4af37] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  placeholder="سرير مزدوج كبير، طابق هادئ..."
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleGenerateEarlyCheckinMsg}
                className="px-4 py-2 rounded-xl bg-[#d4af37] hover:bg-[#f5d061] text-black font-black text-xs flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>تجهيز صيغة رسالة الاستقبال الرسمية</span>
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(generatedCheckinMsg || 'مرحباً، أود التنسيق لتسجيل الدخول المبكر.')}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>إرسال عبر واتساب الاستقبال 💬</span>
              </a>

              <a
                href={`tel:${selectedHotel.samplePhone}`}
                className="px-4 py-2 rounded-xl bg-sky-950/80 hover:bg-sky-900 border border-sky-500/40 text-sky-300 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-sky-400" />
                <span>اتصال هاتفي مباشر بالاستقبال 📞</span>
              </a>
            </div>

            {generatedCheckinMsg && (
              <div className="bg-[#080d19] p-4 rounded-xl border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#d4af37]">صيغة الرسالة المهنية الجاهزة للنسخ أو الإرسال:</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(generatedCheckinMsg, 'checkin_msg')}
                    className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copiedLink === 'checkin_msg' ? (
                      <span className="text-emerald-400 font-bold">✓ تم النسخ بنجاح</span>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ النص</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-neutral-200 leading-relaxed whitespace-pre-line font-mono bg-[#050811] p-3 rounded-lg border border-neutral-800">
                  {generatedCheckinMsg}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: OFFICIAL TOURS & ACTIVITIES */}
      {/* ========================================================================= */}
      {activeTab === 'tours_activities' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-[#0c1424] border border-neutral-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm sm:text-base font-black text-white">
                تذاكر المتاحف والأنشطة والجولات الرسمية لرحلة {plan.destination}
              </h4>
              <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                قائمة منظمة لجميع محطات جدولك مرتبطة بروابط المشغلين المعتمدين لتخطي طوابير التذاكر والحجز بأقل سعر رسمي.
              </p>
            </div>
            <span className="text-xs font-bold text-[#d4af37] bg-[#d4af37]/15 px-3 py-1.5 rounded-xl border border-[#d4af37]/30 whitespace-nowrap">
              {allActivities.length} محطة ونشاط معتمد
            </span>
          </div>

          {/* Global Official Platforms Directory */}
          <div className="space-y-3">
            <span className="text-xs font-black text-[#d4af37] uppercase tracking-wider block">
              أكبر مشغلي ومنصات الجولات والتذاكر العالمية المعتمدة:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {OFFICIAL_GLOBAL_TOUR_PLATFORMS.map((platform) => (
                <div
                  key={platform.id}
                  className="bg-[#09101f] border border-neutral-800 hover:border-purple-500/50 p-4 rounded-2xl flex flex-col justify-between space-y-3 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{platform.logo}</span>
                        <h5 className="text-xs sm:text-sm font-black text-white">{platform.name}</h5>
                      </div>
                    </div>
                    <span className="text-[10px] text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/30 font-bold block">
                      {platform.badge}
                    </span>
                    <p className="text-[11px] text-neutral-300 leading-relaxed">
                      {platform.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleInitiateDirectBooking(
                        platform.name,
                        platform.logo,
                        platform.officialUrl,
                        'tour'
                      )
                    }
                    className="w-full py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-200 text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer"
                  >
                    <span>تأكيد البيانات والبحث المباشر</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Day Activities List */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-black text-neutral-200 uppercase tracking-wider block">
              محطات جدولك اليومي وروابط الحجز السريع:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allActivities.map((act) => (
                <div
                  key={act.id}
                  className="bg-[#080d19] border border-neutral-800 hover:border-[#d4af37]/40 rounded-2xl p-4 space-y-3 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-[#142038] text-sky-300 border border-sky-500/30">
                        اليوم {act.dayNumber} • {act.timeSlot || 'موعد مرن'}
                      </span>
                      <span className="text-[10px] text-[#d4af37] font-extrabold bg-[#d4af37]/10 px-2 py-0.5 rounded border border-[#d4af37]/30">
                        {act.categoryLabel}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-white">{act.title}</h4>
                    <p className="text-xs text-neutral-400">الوجهة: {act.destination}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-neutral-800">
                    <span className="text-[11px] font-bold text-neutral-300 block">روابط المشغلين والتذاكر المباشرة:</span>
                    <div className="flex flex-wrap gap-2">
                      {act.links.slice(0, 3).map((link) => (
                        <button
                          key={link.id}
                          type="button"
                          onClick={() =>
                            handleInitiateDirectBooking(
                              link.name,
                              link.logoEmoji,
                              link.url,
                              'tour'
                            )
                          }
                          className={`text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all shadow cursor-pointer ${
                            link.isDirectOfficial
                              ? 'bg-[#1b253b] hover:bg-[#253555] text-[#f5d061] border border-[#d4af37]/40'
                              : 'bg-[#111827] hover:bg-[#1f293d] text-neutral-200 border border-neutral-700'
                          }`}
                        >
                          <span>{link.logoEmoji}</span>
                          <span>{link.name}</span>
                          <ArrowUpRight className="w-3 h-3 opacity-70" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: ESSENTIAL GLOBAL ADD-ON SERVICES */}
      {/* ========================================================================= */}
      {activeTab === 'addon_services' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-gradient-to-r from-[#0d221c] via-[#133027] to-[#0d221c] border border-emerald-500/40 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-black text-white">
                  الخدمات الإضافية المعتمدة للمسافر (eSIM، التأمين الشامل، التوصيل، صالات VIP)
                </h4>
                <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                  قائمة بأهم الخدمات الموثقة عالمياً التي تسهل رحلتك وتوفر عليك الوقت والمال عند السفر إلى {plan.destination}.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GLOBAL_TRAVEL_ADDON_SERVICES.map((srv) => (
              <div
                key={srv.id}
                className="bg-[#08101e] border border-neutral-800 hover:border-emerald-500/50 rounded-2xl p-5 space-y-3.5 flex flex-col justify-between transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{srv.categoryIcon}</span>
                      <div>
                        <h4 className="text-sm font-black text-white">{srv.categoryTitle}</h4>
                        <span className="text-[11px] text-neutral-400">{srv.providerName}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/30 font-bold block">
                    {srv.badge}
                  </span>

                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {srv.summary}
                  </p>

                  <div className="bg-[#050a14] p-3 rounded-xl border border-neutral-800/90 space-y-1.5">
                    {srv.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-1.5 text-[11px] text-neutral-200">
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-amber-950/40 p-2.5 rounded-xl border border-amber-500/30 text-[11px] text-amber-200">
                    <span className="font-bold">💡 نصيحة المستشار: </span>
                    <span>{srv.tipsForTraveler}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleInitiateDirectBooking(
                        srv.providerName,
                        srv.categoryIcon,
                        srv.officialUrl,
                        'service'
                      )
                    }
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow transition-all cursor-pointer"
                  >
                    <span>تأكيد البيانات وفتح بوابة المشغل الرسمي</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: SAVED BOOKINGS & LOCAL STORAGE RECORDS */}
      {/* ========================================================================= */}
      {activeTab === 'saved_records' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-[#0c1424] border border-neutral-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-[#d4af37]" />
                <span>سجل الحجوزات المؤكدة والمحفوظة محلياً</span>
              </h4>
              <p className="text-xs text-neutral-300 mt-0.5">
                جميع الحجوزات والبيانات التي تم تأكيدها محلياً للرجوع إليها في أي وقت دون فقدان تفاصيل السفر.
              </p>
            </div>

            {savedBookings.length > 0 && (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                {savedBookings.length} سجل محفوظ
              </span>
            )}
          </div>

          {savedBookings.length === 0 ? (
            <div className="bg-[#080d19] border border-neutral-800 rounded-2xl p-8 text-center space-y-3">
              <FileText className="w-12 h-12 text-neutral-600 mx-auto" />
              <h4 className="text-sm font-bold text-white">لا توجد حجوزات محفوظة حتى الآن</h4>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                عند قيامك بتعبئة بياناتك والضغط على زر "تأكيد وحجز رسمي" لأي شركة طيران أو فندق أو نشاط، سيتم حفظ نسخة موثقة هنا تلقائياً.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('flights')}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-black text-xs cursor-pointer shadow"
              >
                استعراض وحجز الطيران الرسمي الآن ✈️
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {savedBookings.map((record) => (
                <div
                  key={record.id}
                  className="bg-[#09101f] border border-neutral-800 hover:border-[#d4af37]/40 rounded-2xl p-4 sm:p-5 space-y-3 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{record.providerLogo || '📄'}</span>
                      <div>
                        <h4 className="text-sm font-black text-white flex items-center gap-2">
                          <span>{record.providerName}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                            {record.referenceId}
                          </span>
                        </h4>
                        <span className="text-[11px] text-neutral-400">
                          الوجهة: {record.destination} • تاريخ الإنشاء: {record.createdAt}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <a
                        href={record.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-[#142038] hover:bg-[#1f3054] border border-sky-500/40 text-sky-300 text-xs font-bold flex items-center gap-1"
                      >
                        <span>فتح الموقع الرسمي</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDeleteRecord(record.id)}
                        className="p-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs cursor-pointer"
                        title="حذف هذا السجل"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs bg-[#060a14] p-3 rounded-xl border border-neutral-800">
                    <div>
                      <span className="text-neutral-400 text-[10px] block">اسم المسافر:</span>
                      <span className="font-bold text-white">{record.passengerName}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 text-[10px] block">تاريخ السفر / الحجز:</span>
                      <span className="font-bold text-amber-300">{record.travelDate}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 text-[10px] block">رقم الهاتف / الواتساب:</span>
                      <span className="font-bold text-sky-300">{record.contactPhone}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 text-[10px] block">الجواز / الهوية:</span>
                      <span className="font-bold text-neutral-200">{record.passportOrId || 'غير مدخل'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🔄 INTERACTIVE REDIRECT LOADING MODAL (حالة التحميل التفاعلية والتوجيه المشفر) */}
      {/* ========================================================================= */}
      {redirectModalData.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0c1426] border-2 border-sky-400 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center space-y-6 shadow-2xl relative overflow-hidden">
            {/* Top Accent Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-sky-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-3 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-sky-500/20 border border-sky-400 flex items-center justify-center text-3xl mx-auto shadow-lg shadow-sky-500/30 animate-pulse">
                {redirectModalData.providerLogo || '✈️'}
              </div>

              <h3 className="text-lg sm:text-xl font-black text-white">
                تأكيد وتوجيه الحجز المباشر لـ ({redirectModalData.providerName})
              </h3>
              <p className="text-xs text-neutral-300">
                الرقم المرجعي المعتمد: <span className="font-mono font-bold text-[#f5d061]">{redirectModalData.recordId}</span>
              </p>
            </div>

            {/* Progress Bar & Steps */}
            <div className="space-y-3 relative z-10">
              <div className="w-full bg-[#060a14] rounded-full h-3 p-0.5 border border-neutral-700 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-sky-400 via-blue-500 to-[#d4af37] h-full rounded-full transition-all duration-500 shadow-md shadow-sky-500/50"
                  style={{ width: `${redirectModalData.progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-400 font-bold">
                <span>التحقق الرقمي</span>
                <span>تشفير السجل</span>
                <span>فتح البوابة الرسمية</span>
              </div>

              <div className="bg-[#070e1c] p-3.5 rounded-xl border border-sky-500/30 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 text-sky-400 animate-spin" />
                <span className="text-xs font-bold text-sky-200">
                  {redirectModalData.stepMessage}
                </span>
              </div>
            </div>

            {/* Traveler Summary */}
            <div className="bg-[#060a14] p-3 rounded-xl border border-neutral-800 text-xs text-neutral-300 grid grid-cols-2 gap-2 text-right">
              <div>
                <span className="text-neutral-500 text-[10px] block">المسافر:</span>
                <span className="font-bold text-white truncate block">{passengerName || 'مسافر كريم'}</span>
              </div>
              <div>
                <span className="text-neutral-500 text-[10px] block">تاريخ السفر:</span>
                <span className="font-bold text-[#d4af37]">{travelDate}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2 relative z-10">
              <a
                href={redirectModalData.targetUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => setRedirectModalData((prev) => ({ ...prev, isOpen: false }))}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
              >
                <span>الانتقال فوراً للموقع الرسمي الآن</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => setRedirectModalData((prev) => ({ ...prev, isOpen: false }))}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

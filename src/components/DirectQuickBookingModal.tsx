import React, { useState } from 'react';
import { 
  Plane, Hotel, Ticket, CreditCard, ExternalLink, X, 
  Check, ArrowRight, ShieldCheck, Clock, Luggage, 
  Calendar, MapPin, Users, Sparkles, MessageSquare, 
  Phone, CheckCircle2, ChevronRight, Zap, Copy, 
  BadgePercent, AlertCircle, Building2
} from 'lucide-react';
import { OFFICIAL_AIRLINES_DATABASE, OFFICIAL_HOTEL_CHAINS_DATABASE, OfficialAirline, OfficialHotelChain } from '../utils/bookingUtils';

export type BookingModalTab = 'flights' | 'hajj_umrah' | 'palestine' | 'hotels' | 'museums' | 'checkout';

interface DirectQuickBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: BookingModalTab;
  defaultDestination?: string;
}

const POPULAR_AIRPORTS = [
  { code: 'CAI', city: 'القاهرة', country: 'مصر' },
  { code: 'RUH', city: 'الرياض', country: 'السعودية' },
  { code: 'JED', city: 'جدة / مكة', country: 'السعودية' },
  { code: 'MED', city: 'المدينة المنورة', country: 'السعودية' },
  { code: 'DXB', city: 'دبي', country: 'الإمارات' },
  { code: 'AUH', city: 'أبوظبي', country: 'الإمارات' },
  { code: 'KWI', city: 'الكويت', country: 'الكويت' },
  { code: 'DOH', city: 'الدوحة', country: 'قطر' },
  { code: 'AMM', city: 'عمان', country: 'الأردن' },
  { code: 'IST', city: 'إسطنبول', country: 'تركيا' },
  { code: 'LHR', city: 'لندن', country: 'بريطانيا' },
  { code: 'CDG', city: 'باريس', country: 'فرنسا' },
  { code: 'FCO', city: 'روما', country: 'إيطاليا' },
  { code: 'TBS', city: 'تبليسي', country: 'جورجيا' },
  { code: 'GYD', city: 'باكو', country: 'أذربيجان' },
  { code: 'KUL', city: 'كوالالمبور', country: 'ماليزيا' },
  { code: 'MLE', city: 'المالديف', country: 'المالديف' },
];

const POPULAR_ATTRACTIONS = [
  {
    id: 'nusuk-rawdah',
    name: 'تصريح الروضة الشريفة والعمرة - منصة نُسك الرسمية',
    city: 'المدينة المنورة ومكة المكرمة',
    operator: 'وزارة الحج والعمرة (نسك)',
    url: 'https://www.nusuk.sa',
    badge: 'تصريح رسمي مجاني',
  },
  {
    id: 'gem-egypt',
    name: 'المتحف المصري الكبير (GEM)',
    city: 'الجيزة / القاهرة',
    operator: 'وزارة السياحة والآثار المصرية',
    url: 'https://visit-gem.com',
    badge: 'تخطي الطابور Fast Track',
  },
  {
    id: 'giza-pyramids',
    name: 'أهرامات الجيزة وتمثال أبو الهول',
    city: 'الجيزة / القاهرة',
    operator: 'وزارة السياحة والآثار',
    url: 'https://egymonuments.gov.eg',
    badge: 'تذاكر رقمية معتمدة',
  },
  {
    id: 'burj-khalifa',
    name: 'قمة برج خليفة (At the Top)',
    city: 'دبي',
    operator: 'إعمار Emaar Hospitality',
    url: 'https://www.burjkhalifa.ae/en/index.aspx',
    badge: 'المشغل الرسمي المباشر',
  },
  {
    id: 'museum-of-future',
    name: 'متحف المستقبل (Museum of the Future)',
    city: 'دبي',
    operator: 'مؤسسة دبي للمستقبل',
    url: 'https://museumofthefuture.ae',
    badge: 'حجز مواعيد دقيقة',
  },
  {
    id: 'sheikh-zayed-mosque',
    name: 'جامع الشيخ زايد الكبير',
    city: 'أبوظبي',
    operator: 'مركز جامع الشيخ زايد الكبير',
    url: 'https://www.szgmc.gov.ae',
    badge: 'دخول ميسر رسمي',
  },
  {
    id: 'louvre-paris',
    name: 'متحف اللوفر بباريس (Musée du Louvre)',
    city: 'باريس',
    operator: 'بوابة متحف اللوفر الرسمية',
    url: 'https://www.ticketlouvre.fr',
    badge: 'تذكرة مؤكدة بموعد مسبق',
  },
  {
    id: 'eiffel-tower',
    name: 'برج إيفل (Tour Eiffel)',
    city: 'باريس',
    operator: 'الموقع الرسمي لبرج إيفل',
    url: 'https://www.toureiffel.paris',
    badge: 'صعود القمة بدون وسيط',
  },
  {
    id: 'colosseum-rome',
    name: 'الكولوسيوم والمنتدى الروماني (Colosseo)',
    city: 'روما',
    operator: 'Parco Archeologico del Colosseo',
    url: 'https://www.coopculture.it',
    badge: 'السعر الحكومي الأصلي',
  },
  {
    id: 'hagia-sophia',
    name: 'جامع آيا صوفيا الكبير وقصر توبكابي',
    city: 'إسطنبول',
    operator: 'وزارة الثقافة والسياحة التركية',
    url: 'https://muze.gov.tr',
    badge: 'تذكرة إلكترونية سريعة',
  },
];

export const DirectQuickBookingModal: React.FC<DirectQuickBookingModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'flights',
  defaultDestination = '',
}) => {
  const [activeTab, setActiveTab] = useState<BookingModalTab>(initialTab);

  // Sync initialTab when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Flights Form State
  const [flightOrigin, setFlightOrigin] = useState('CAI - القاهرة');
  const [flightDestination, setFlightDestination] = useState(defaultDestination || 'JED - جدة / مكة');
  const [flightTripType, setFlightTripType] = useState<'roundtrip' | 'oneway'>('roundtrip');
  const [flightDepartDate, setFlightDepartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [flightReturnDate, setFlightReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 21);
    return d.toISOString().split('T')[0];
  });
  const [flightPassengers, setFlightPassengers] = useState(2);
  const [flightCabin, setFlightCabin] = useState<'economy' | 'business'>('economy');
  const [selectedAirline, setSelectedAirline] = useState<OfficialAirline>(OFFICIAL_AIRLINES_DATABASE[0]);

  // Hotel Form State
  const [hotelDestination, setHotelDestination] = useState(defaultDestination || 'مكة المكرمة / أبراج الساعة');
  const [hotelCheckIn, setHotelCheckIn] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [hotelCheckOut, setHotelCheckOut] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 21);
    return d.toISOString().split('T')[0];
  });
  const [hotelGuests, setHotelGuests] = useState(2);
  const [hotelRooms, setHotelRooms] = useState(1);
  const [selectedHotelChain, setSelectedHotelChain] = useState<OfficialHotelChain>(OFFICIAL_HOTEL_CHAINS_DATABASE[0]);
  const [earlyCheckinTime, setEarlyCheckinTime] = useState('11:00');
  const [guestName, setGuestName] = useState('مسافر كريم');
  const [roomPreference, setRoomPreference] = useState('طابق علوي مع إطلالة هادئة');
  const [whatsappMsgCopied, setWhatsappMsgCopied] = useState(false);

  // Museums Form State
  const [selectedAttraction, setSelectedAttraction] = useState(POPULAR_ATTRACTIONS[0]);
  const [museumVisitDate, setMuseumVisitDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return d.toISOString().split('T')[0];
  });
  const [museumTicketsCount, setMuseumTicketsCount] = useState(2);
  const [museumTicketType, setMuseumTicketType] = useState('fast_track');

  // Payment State
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'apple_pay' | 'mada' | 'visa' | 'tabby' | 'stc_pay'>('apple_pay');
  const [confirmedReceipt, setConfirmedReceipt] = useState<{
    ref: string;
    amount: string;
    method: string;
    date: string;
  } | null>(null);

  if (!isOpen) return null;

  // Flight Confirm Handler
  const handleConfirmFlight = () => {
    const targetUrl = selectedAirline.officialBookingUrl;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  // Hotel Confirm Handler
  const handleConfirmHotel = () => {
    const targetUrl = selectedHotelChain.officialBookingUrl;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  // Museum Confirm Handler
  const handleConfirmMuseum = () => {
    const targetUrl = selectedAttraction.url;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  // Copy WhatsApp check-in template
  const handleCopyWhatsApp = () => {
    const msg = `السلام عليكم ورحمة الله وبركاته،
فريق الاستقبال في ${selectedHotelChain.name}،
أنا النزيل (${guestName})، ولدي حجز قادم طرفكم.
موعد وصولي المتوقع هو الساعة (${earlyCheckinTime}).
نرجو التكرم بتجهيز الغرفة (${roomPreference}) وتنسيق تسجيل الوصول المبكر (Early Check-in).
شاكرين حسن تعاونكم.`;
    navigator.clipboard.writeText(msg);
    setWhatsappMsgCopied(true);
    setTimeout(() => setWhatsappMsgCopied(false), 2500);
  };

  // Payment Confirmation Simulator
  const handleConfirmPayment = () => {
    const ref = `TRQ-${Math.floor(100000 + Math.random() * 900000)}`;
    const methodNames: Record<string, string> = {
      apple_pay: 'Apple Pay (سداد بلمسة واحدة)',
      mada: 'بطاقة مدى Mada البنكية',
      visa: 'Visa / Mastercard (3D Secure)',
      tabby: 'تابي Tabby (تقسيط بدون فوائد)',
      stc_pay: 'محفظة STC Pay الرقمية',
    };
    setConfirmedReceipt({
      ref,
      amount: 'مباشر مع المشغل الرسمي بدون فوائد أو هوامش إضافية',
      method: methodNames[selectedPaymentMethod] || 'سداد آمن معتمد',
      date: new Date().toLocaleString('ar-SA'),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-[#0b1324] border border-[#d4af37]/40 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#090f1d] via-[#111a30] to-[#090f1d] border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/50 flex items-center justify-center text-[#f5d061] text-lg font-bold">
              𓂀
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>بوابة التنفيذ والحجز المباشر من المواقع الرسمية</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  بدون وسيط 0% عمولة
                </span>
              </h3>
              <p className="text-xs text-neutral-400">
                أدخل بياناتك ثم اضغط تأكيد للانتقال فوراً لموقع المشغل أو شركة الطيران الرسمية
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5 Interactive Category Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 bg-[#070b16] border-b border-neutral-800 p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab('flights')}
            className={`py-2.5 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'flights'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30 border border-sky-400'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <Plane className="w-4 h-4" />
            <span>✈️ طيران رسمي مباشر</span>
          </button>

          <button
            onClick={() => setActiveTab('hajj_umrah')}
            className={`py-2.5 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'hajj_umrah'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 border border-amber-400'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <span className="text-sm">🕋</span>
            <span>بوابة الحج والعمرة</span>
          </button>

          <button
            onClick={() => setActiveTab('palestine')}
            className={`py-2.5 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'palestine'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 border border-emerald-400'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <span className="text-sm">🇵🇸</span>
            <span>مسار القدس وفلسطين</span>
          </button>

          <button
            onClick={() => setActiveTab('hotels')}
            className={`py-2.5 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'hotels'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <Hotel className="w-4 h-4" />
            <span>🏨 حجز فندقي أصلي</span>
          </button>

          <button
            onClick={() => setActiveTab('museums')}
            className={`py-2.5 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'museums'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>🏛️ تذاكر متاحف معتمدة</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-right">
          
          {/* TAB 1: FLIGHTS */}
          {activeTab === 'flights' && (
            <div className="space-y-5">
              <div className="bg-sky-950/40 border border-sky-500/30 rounded-xl p-4 flex items-start gap-3">
                <div className="text-2xl">✈️</div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-sky-200">مزايا الحجز المباشر من موقع شركة الطيران الرسمي:</h4>
                  <p className="text-xs text-sky-300/90 leading-relaxed">
                    حجز تذكرتك مباشرة يضمن لك الحصول على أقل سعر بدون رسوم وسيط، واحتساب وزن الأمتعة والحقائب الأصلي كاملاً، وقص بطاقة صعود الطائرة (Boarding Pass) وتعديل الرحلة مباشرة.
                  </p>
                </div>
              </div>

              {/* Data Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">مطار / مدينة المغادرة (Origin)</label>
                  <input
                    type="text"
                    value={flightOrigin}
                    onChange={(e) => setFlightOrigin(e.target.value)}
                    placeholder="مثال: CAI - مطار القاهرة الدولي"
                    className="w-full bg-[#111a2e] border border-neutral-700 focus:border-sky-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  />
                  <div className="flex flex-wrap gap-1 pt-1">
                    {['CAI - القاهرة', 'RUH - الرياض', 'JED - جدة', 'DXB - دبي', 'KWI - الكويت'].map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => setFlightOrigin(a)}
                        className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 cursor-pointer"
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">مطار / مدينة الوصول (Destination)</label>
                  <input
                    type="text"
                    value={flightDestination}
                    onChange={(e) => setFlightDestination(e.target.value)}
                    placeholder="مثال: JED - جدة / مكة المكرمة"
                    className="w-full bg-[#111a2e] border border-neutral-700 focus:border-sky-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  />
                  <div className="flex flex-wrap gap-1 pt-1">
                    {['JED - مكة / جدة', 'MED - المدينة', 'IST - إسطنبول', 'LHR - لندن', 'TBS - تبليسي'].map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => setFlightDestination(a)}
                        className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 cursor-pointer"
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">تاريخ الذهاب</label>
                  <input
                    type="date"
                    value={flightDepartDate}
                    onChange={(e) => setFlightDepartDate(e.target.value)}
                    className="w-full bg-[#111a2e] border border-neutral-700 focus:border-sky-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">تاريخ العودة</label>
                  <input
                    type="date"
                    value={flightReturnDate}
                    onChange={(e) => setFlightReturnDate(e.target.value)}
                    className="w-full bg-[#111a2e] border border-neutral-700 focus:border-sky-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">عدد المسافرين ودرجة السفر</label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={flightPassengers}
                      onChange={(e) => setFlightPassengers(Number(e.target.value))}
                      className="bg-[#111a2e] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value={1}>1 مسافر</option>
                      <option value={2}>2 مسافرين</option>
                      <option value={3}>3 مسافرين</option>
                      <option value={4}>4 مسافرين (عائلة)</option>
                      <option value={6}>6 مسافرين (مجموعة)</option>
                    </select>
                    <select
                      value={flightCabin}
                      onChange={(e) => setFlightCabin(e.target.value as any)}
                      className="bg-[#111a2e] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="economy">الدرجة السياحية (Economy)</option>
                      <option value="business">درجة رجال الأعمال (Business)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">شركة الطيران الرسمية</label>
                  <select
                    value={selectedAirline.id}
                    onChange={(e) => {
                      const found = OFFICIAL_AIRLINES_DATABASE.find((a) => a.id === e.target.value);
                      if (found) setSelectedAirline(found);
                    }}
                    className="w-full bg-[#111a2e] border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white"
                  >
                    {OFFICIAL_AIRLINES_DATABASE.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.country})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Selected Airline Highlights */}
              <div className="bg-[#101a30] border border-sky-500/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white text-sm">{selectedAirline.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold">
                      موقع رسمي معتمد
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    🧳 {selectedAirline.directBenefits[2] || selectedAirline.directBenefits[0]}
                  </p>
                </div>
              </div>

              {/* Big Action Confirmation Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  onClick={handleConfirmFlight}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 hover:from-sky-500 hover:to-sky-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-sky-600/30 transition-all cursor-pointer"
                >
                  <span>فتح الموقع الرسمي ({selectedAirline.name}) فوراً</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveTab('checkout')}
                  className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-[#142238] hover:bg-[#1e3456] border border-sky-400/40 text-sky-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>الخطوة الأخيرة: تأكيد الحجز وضمان السداد 💳</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </button>
              </div>
            </div>
          )}

          {/* TAB: HAJJ & UMRAH (بوابة الحج والعمرة الرسمية) */}
          {activeTab === 'hajj_umrah' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
                <div className="text-2xl">🕋</div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-amber-200">بوابة خدمات الحج والعمرة والزيارة الرسمية المعتمدة:</h4>
                  <p className="text-xs text-amber-300/90 leading-relaxed">
                    منظومة موثقة بالكامل لربط المعتمرين والحجاج بمنصة نُسك الرسمية (Nusuk)، تذاكر قطار الحرمين السريع بين مكة والمدينة وجدة، وتصاريح الروضة الشريفة وطواف العمرة.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  {
                    title: 'منصة نُسك الرسمية (Nusuk Portal)',
                    desc: 'استخراج تأشيرات العمرة الإلكترونية وتصاريح الروضة الشريفة والعمرة الرسمية بدون وسطاء.',
                    url: 'https://www.nusuk.sa',
                    badge: 'المنصة الحكومية المعتمدة',
                    icon: '🕋',
                  },
                  {
                    title: 'قطار الحرمين السريع (Haramain Railway)',
                    desc: 'الموقع الرسمي لحجز تذاكر القطار فائق السرعة بين مكة المكرمة والمدينة المنورة ومطار جدة.',
                    url: 'https://sar.hhr.sa',
                    badge: 'المشغل الرسمي للقطار',
                    icon: '🚄',
                  },
                  {
                    title: 'وزارة الحج والعمرة السعودية',
                    desc: 'اللوائح والأنظمة والاشتراطات الصحية وباقات الحج والعمرة المعتمدة لجميع الجنسيات.',
                    url: 'https://www.haj.gov.sa',
                    badge: 'الجهة التشريعية العليا',
                    icon: '📜',
                  },
                  {
                    title: 'بوابة الخطوط السعودية لضيوف الرحمن',
                    desc: 'حجوزات رحلات الطيران المباشرة إلى مطار الملك عبدالعزيز بجدة ومطار الأمير محمد بالمدينة.',
                    url: 'https://www.saudia.com',
                    badge: 'الناقل الوطني الرسمي',
                    icon: '✈️',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#181308] border border-amber-500/30 rounded-xl p-4 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {item.badge}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-black text-white">{item.title}</h4>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-black text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>فتح البوابة الرسمية</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setActiveTab('checkout')}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <span>الخطوة الأخيرة: اعتماد بيانات الزيارة والسداد الرمزي 💳</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </button>
              </div>
            </div>
          )}

          {/* TAB: PALESTINE & JERUSALEM (مسار القدس وفلسطين) */}
          {activeTab === 'palestine' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-3">
                <div className="text-2xl">🇵🇸</div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-emerald-200">مسار القدس الشريف وفلسطين المباركة:</h4>
                  <p className="text-xs text-emerald-300/90 leading-relaxed">
                    دليل شامل لزيارة المسجد الأقصى المبارك، قبة الصخرة، البلدة القديمة بالقدس، كنيسة القيامة، وبيت لحم والخليل، مع بيانات العبور المعتمدة من جسر الملك حسين والأردن.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  {
                    title: 'دائرة الأوقاف والشؤون والمقدسات الإسلامية بالقدس',
                    desc: 'المعلومات الرسمية لأوقات الصلاة والزيارة في المسجد الأقصى المبارك وقبة الصخرة المشرفة.',
                    url: 'https://www.jerusalem-waqf.org',
                    badge: 'الإشراف الهاشمي الرسمي',
                    icon: '🕌',
                  },
                  {
                    title: 'وزارة السياحة والآثار الفلسطينية',
                    desc: 'الدليل السياحي الرسمي لمعالم القدس، بيت لحم، أريحا، الخليل، ورام الله.',
                    url: 'https://www.travelpalestine.ps',
                    badge: 'بوابة السياحة الفلسطينية',
                    icon: '🌿',
                  },
                  {
                    title: 'المعابر والجسور الأردنية (جسر الملك حسين)',
                    desc: 'الإجراءات الرسمية ومواعيد العبور للمسافرين عبر جسر الملك حسين إلى القدس والضفة الغربية.',
                    url: 'https://psd.gov.jo',
                    badge: 'معبر السفر الرسمي',
                    icon: '🛂',
                  },
                  {
                    title: 'مؤسسة إحياء التراث والبحوث الإسلامية (بيت المقدس)',
                    desc: 'الموسوعة التاريخية والمخطوطات الموثقة للبلدة القديمة وحارات القدس التراثية.',
                    url: 'https://www.unesco.org',
                    badge: 'تراث إنساني عالمي (UNESCO)',
                    icon: '🏛️',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#0b1c14] border border-emerald-500/30 rounded-xl p-4 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {item.badge}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-black text-white">{item.title}</h4>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>فتح البوابة الرسمية</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setActiveTab('checkout')}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  <span>الخطوة الأخيرة: اعتماد بيانات الزيارة والسداد الرمزي 💳</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: HOTELS */}
          {activeTab === 'hotels' && (
            <div className="space-y-5">
              <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
                <div className="text-2xl">🏨</div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-amber-200">مزايا الحجز الفندقي الأصلي المباشر:</h4>
                  <p className="text-xs text-amber-300/90 leading-relaxed">
                    الحجز مع الفندق مباشرة يضمن لك أفضل سعر مضمون (Best Rate Guarantee)، ترقية الغرفة بحسب التوفر، وتجهيز الغرفة لتسجيل الوصول المبكر (Early Check-in) والتواصل المباشر مع الاستقبال عبر واتساب.
                  </p>
                </div>
              </div>

              {/* Data Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">الوجهة أو اسم الفندق المطلوب</label>
                  <input
                    type="text"
                    value={hotelDestination}
                    onChange={(e) => setHotelDestination(e.target.value)}
                    placeholder="مثال: مكة المكرمة - وقف الملك عبدالعزيز / دبي داون تاون"
                    className="w-full bg-[#1c180e] border border-neutral-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">السلسلة الفندقية المعتمدة</label>
                  <select
                    value={selectedHotelChain.id}
                    onChange={(e) => {
                      const found = OFFICIAL_HOTEL_CHAINS_DATABASE.find((h) => h.id === e.target.value);
                      if (found) setSelectedHotelChain(found);
                    }}
                    className="w-full bg-[#1c180e] border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white"
                  >
                    {OFFICIAL_HOTEL_CHAINS_DATABASE.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">تاريخ تسجيل الوصول (Check-in)</label>
                  <input
                    type="date"
                    value={hotelCheckIn}
                    onChange={(e) => setHotelCheckIn(e.target.value)}
                    className="w-full bg-[#1c180e] border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">تاريخ تسجيل المغادرة (Check-out)</label>
                  <input
                    type="date"
                    value={hotelCheckOut}
                    onChange={(e) => setHotelCheckOut(e.target.value)}
                    className="w-full bg-[#1c180e] border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">اسم النزيل وتفضيل الغرفة</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="اسمك الكامل"
                    className="w-full bg-[#1c180e] border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">وقت الوصول المتوقع (Early Check-in)</label>
                  <input
                    type="time"
                    value={earlyCheckinTime}
                    onChange={(e) => setEarlyCheckinTime(e.target.value)}
                    className="w-full bg-[#1c180e] border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white"
                  />
                </div>
              </div>

              {/* WhatsApp Early Check-in Card */}
              <div className="bg-[#241e12] border border-amber-500/40 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span>رسالة واتساب جاهزة لاستقبال فندق {selectedHotelChain.name} (طلب وصول مبكر)</span>
                  </div>
                  <button
                    onClick={handleCopyWhatsApp}
                    className="text-xs px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {whatsappMsgCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{whatsappMsgCopied ? 'تم النسخ!' : 'نسخ الرسالة'}</span>
                  </button>
                </div>
                <p className="text-xs text-neutral-300 font-mono bg-black/40 p-2.5 rounded-lg leading-relaxed">
                  "مرحباً فريق استقبال {selectedHotelChain.name}، أنا النزيل ({guestName})، موعد وصولي المتوقع ({earlyCheckinTime}). نرجو التكرم بتجهيز الغرفة ({roomPreference}) وتنسيق تسجيل الوصول المبكر."
                </p>
              </div>

              {/* Big Action Confirmation Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  onClick={handleConfirmHotel}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  <span>فتح الموقع الرسمي ({selectedHotelChain.name}) فوراً</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveTab('checkout')}
                  className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-[#1a1c38] hover:bg-[#25284f] border border-indigo-400/40 text-indigo-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>الخطوة الأخيرة: تأكيد الحجز وضمان السداد 💳</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: MUSEUMS & ATTRACTIONS */}
          {activeTab === 'museums' && (
            <div className="space-y-5">
              <div className="bg-purple-950/40 border border-purple-500/30 rounded-xl p-4 flex items-start gap-3">
                <div className="text-2xl">🏛️</div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-purple-200">تذاكر متاحف ومعالم معتمدة من المشغل الرسمي:</h4>
                  <p className="text-xs text-purple-300/90 leading-relaxed">
                    حجز تذاكر المزارات السياحية والدينية من بواباتها الرسمية يضمن لك مسار سريع (Fast Track) لتخطي الطوابير، مع الباركود الرسمي المباشر على هاتفك وبالسعر المعتمد.
                  </p>
                </div>
              </div>

              {/* Data Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-neutral-300">اختر المعلم أو المزار السياحي / الديني</label>
                  <select
                    value={selectedAttraction.id}
                    onChange={(e) => {
                      const found = POPULAR_ATTRACTIONS.find((a) => a.id === e.target.value);
                      if (found) setSelectedAttraction(found);
                    }}
                    className="w-full bg-[#181329] border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white"
                  >
                    {POPULAR_ATTRACTIONS.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} — {a.city} ({a.operator})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">تاريخ الزيارة المحدد</label>
                  <input
                    type="date"
                    value={museumVisitDate}
                    onChange={(e) => setMuseumVisitDate(e.target.value)}
                    className="w-full bg-[#181329] border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">عدد التذاكر المطلوبة</label>
                  <select
                    value={museumTicketsCount}
                    onChange={(e) => setMuseumTicketsCount(Number(e.target.value))}
                    className="w-full bg-[#181329] border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white"
                  >
                    <option value={1}>1 تذكرة فردية</option>
                    <option value={2}>2 تذاكر (زوجين)</option>
                    <option value={3}>3 تذاكر</option>
                    <option value={4}>4 تذاكر عائلية</option>
                    <option value={6}>6 تذاكر مجموعة</option>
                  </select>
                </div>
              </div>

              {/* Selected Attraction Card */}
              <div className="bg-[#1f1738] border border-purple-500/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white text-sm">{selectedAttraction.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/30 text-purple-200 font-bold">
                      {selectedAttraction.badge}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    🏛️ المشغل: {selectedAttraction.operator} | 📍 المدينة: {selectedAttraction.city}
                  </p>
                </div>
              </div>

              {/* Big Action Confirmation Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  onClick={handleConfirmMuseum}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 hover:from-purple-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-purple-600/30 transition-all cursor-pointer"
                >
                  <span>فتح الموقع الرسمي للتذاكر ({selectedAttraction.name})</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveTab('checkout')}
                  className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-[#281b38] hover:bg-[#38264e] border border-purple-400/40 text-purple-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>الخطوة الأخيرة: تأكيد الحجز وضمان السداد 💳</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: FINAL CHECKOUT & SYMBOLIC FEE (الخطوة الأخيرة: السداد والتأكيد) */}
          {activeTab === 'checkout' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="bg-gradient-to-r from-[#0b2416] via-[#10301d] to-[#0b2416] border border-emerald-500/40 rounded-2xl p-4 sm:p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-bold text-lg">
                      💳
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-black text-white">
                        الخطوة الأخيرة: تأكيد الحجز وضمان السداد المعتمد
                      </h4>
                      <p className="text-xs text-emerald-300/90">
                        مباشرة مع مقدمي الخدمة المعتمدين • بدون رسوم خفية • رسوم خدمة استشارية رمزية
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-300 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500/30">
                    حماية 100%
                  </span>
                </div>
              </div>

              {/* Service Fee Summary & Support */}
              <div className="bg-[#0b1424] border border-neutral-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-neutral-800">
                  <span className="text-neutral-300">قيمة تذاكر الحجز الأساسية للمشغل:</span>
                  <span className="font-bold text-white">تُدفع مباشرة للجهة الرسمية بدون زيادة 0%</span>
                </div>
                <div className="flex items-center justify-between text-xs pb-2 border-b border-neutral-800">
                  <span className="text-neutral-300">رسوم استشارة وتأكيد الحجز المباشر (رمزية):</span>
                  <span className="font-bold text-[#d4af37]">5.00 ر.س (أو 1.50 $ / 50 ج.م)</span>
                </div>
                <div className="flex items-center justify-between text-xs font-black text-emerald-300">
                  <span>الضمان المالي والتشفير:</span>
                  <span>معتمد عبر 3D Secure وشهادة SSL البنكية</span>
                </div>
              </div>

              {/* Payment Methods Grid */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-300 block">اختر وسيلة السداد الآمن المفضلة:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'apple_pay', title: 'Apple Pay', desc: 'دفع فوري بلمسة واحدة', icon: '' },
                    { id: 'mada', title: 'بطاقة مدى Mada', desc: 'سحب بنكي مباشر وآمن', icon: '💳' },
                    { id: 'visa', title: 'Visa / Mastercard', desc: 'حماية مصرفية 3D Secure', icon: '🔒' },
                    { id: 'tabby', title: 'تابي Tabby', desc: 'تقسيط مريح 0% فوائد', icon: '⚡' },
                    { id: 'stc_pay', title: 'محفظة STC Pay', desc: 'محفظة رقمية معتمدة', icon: '📱' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedPaymentMethod(m.id as any)}
                      className={`p-3.5 rounded-xl border text-right transition-all flex flex-col justify-between gap-1 cursor-pointer ${
                        selectedPaymentMethod === m.id
                          ? 'bg-emerald-950/60 border-emerald-400 shadow-md shadow-emerald-500/20 ring-1 ring-emerald-400'
                          : 'bg-[#101b16] border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base">{m.icon}</span>
                        {selectedPaymentMethod === m.id && <Check className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white">{m.title}</h5>
                        <p className="text-[10px] text-neutral-400">{m.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Confirmation / Receipt Simulator */}
              {confirmedReceipt && (
                <div className="bg-[#0e2418] border border-emerald-500/50 rounded-2xl p-4 sm:p-5 space-y-2.5 animate-in fade-in">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>تم تأكيد الحجز وتوثيق إيصال السداد المالي بنجاح!</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-neutral-300 font-mono pt-1 bg-[#06110a] p-3 rounded-xl border border-emerald-500/30">
                    <div>الرقم المرجعي: <strong className="text-white">{confirmedReceipt.ref}</strong></div>
                    <div>وسيلة السداد: <strong className="text-emerald-300">{confirmedReceipt.method}</strong></div>
                    <div className="col-span-2">تاريخ الاعتماد: <span className="text-neutral-400">{confirmedReceipt.date}</span></div>
                  </div>
                </div>
              )}

              {/* Big Action Confirmation Button */}
              <button
                onClick={handleConfirmPayment}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition-all transform active:scale-[0.99] cursor-pointer"
              >
                <span>تأكيد الحجز النهائي واعتماد السداد وتوثيق السجل 💳</span>
                <ShieldCheck className="w-4 h-4 text-black" />
              </button>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-[#080d18] border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>اتصال مشفر مباشر 256-bit SSL بدون تخزين لبيانات البطاقات</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold cursor-pointer"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};

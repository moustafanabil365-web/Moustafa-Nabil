import React, { useState, useRef } from 'react';
import { 
  FileDown, Printer, X, Check, RefreshCw, Sparkles, 
  MapPin, Calendar, Wallet, Users, CloudSun, Utensils, 
  Luggage, ShieldAlert, CheckCircle2, Ticket, Share2
} from 'lucide-react';
import Markdown from 'react-markdown';
import { GeneratedPlan } from '../types';

interface PdfExportModalProps {
  plan: GeneratedPlan;
  isOpen: boolean;
  onClose: () => void;
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({
  plan,
  isOpen,
  onClose,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [themeMode, setThemeMode] = useState<'luxury_dark' | 'clean_light'>('clean_light');
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleDownloadPdf = async () => {
    if (!printAreaRef.current) return;
    setIsGenerating(true);

    try {
      // Dynamically load html2pdf
      const html2pdf = (await import('html2pdf.js')).default;
      const element = printAreaRef.current;
      
      const opt = {
        margin: [8, 8, 8, 8] as [number, number, number, number],
        filename: `SmartTravel-${plan.destination.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_')}-${plan.durationDays}days.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          logging: false,
          scrollY: 0
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('Failed generating PDF via html2pdf, falling back to window.print():', err);
      window.print();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBrowserPrint = () => {
    window.print();
  };

  const activityNotesList = Object.values(plan.activityNotes || {});
  const customNotesList = Object.entries(plan.customNotes || {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-[#121212] border border-[#d4af37]/40 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl shadow-black relative my-auto">
        
        {/* Modal Top Bar */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                تصدير وطباعة خطة الرحلة (PDF Export)
              </h3>
              <p className="text-xs text-neutral-400">
                ملف PDF منسق بدقة عالية يحتوي على كافة تفاصيل رحلتك، الملاحظات، والخرائط.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <div className="hidden sm:flex items-center p-1 bg-[#1a1a1a] rounded-xl border border-neutral-800 text-xs">
              <button
                onClick={() => setThemeMode('clean_light')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  themeMode === 'clean_light' ? 'bg-white text-black shadow' : 'text-neutral-400'
                }`}
              >
                نسق طباعة فاتح (توفير حبر)
              </button>
              <button
                onClick={() => setThemeMode('luxury_dark')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  themeMode === 'luxury_dark' ? 'bg-[#d4af37] text-black shadow' : 'text-neutral-400'
                }`}
              >
                نسق داكن فاخر (عرض رقمي)
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Preview Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0a0a0a]">
          <div
            ref={printAreaRef}
            id="pdf-printable-document"
            className={`p-6 sm:p-8 rounded-xl shadow-lg border text-right max-w-3xl mx-auto space-y-6 transition-colors ${
              themeMode === 'luxury_dark'
                ? 'bg-[#111111] text-neutral-100 border-[#d4af37]/30'
                : 'bg-white text-neutral-900 border-neutral-300'
            }`}
            style={{ direction: 'rtl' }}
          >
            {/* Document Header */}
            <div className={`border-b pb-5 flex items-start justify-between gap-4 ${
              themeMode === 'luxury_dark' ? 'border-[#d4af37]/30' : 'border-neutral-200'
            }`}>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    themeMode === 'luxury_dark'
                      ? 'bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}>
                    SmartTravel AI • تقرير وخطة رحلة رسمية
                  </span>
                  {plan.shareId && (
                    <span className="text-[10px] font-mono text-neutral-400">
                      ID: {plan.shareId}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-black">
                  دليل وخطة السفر: {plan.destination}
                </h1>
                
                <p className={`text-xs ${themeMode === 'luxury_dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  تم إعداد هذا التقرير بدقة بواسطة الذكاء الاصطناعي مع الأخذ بالاعتبار كافة القيود والتفضيلات الشخصية.
                </p>
              </div>

              <div className={`p-3 rounded-xl text-center border min-w-[120px] ${
                themeMode === 'luxury_dark'
                  ? 'bg-[#181818] border-[#d4af37]/30 text-white'
                  : 'bg-amber-50 border-amber-200 text-amber-950'
              }`}>
                <span className="text-[10px] block opacity-75 font-semibold">المدة الإجمالية</span>
                <span className="text-xl font-black">{plan.durationDays} أيام</span>
                <span className="text-[10px] block opacity-75 font-mono">
                  {new Date().toLocaleDateString('ar-SA')}
                </span>
              </div>
            </div>

            {/* Trip Key Parameters Grid */}
            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl text-xs ${
              themeMode === 'luxury_dark'
                ? 'bg-[#161616] border border-neutral-800'
                : 'bg-neutral-50 border border-neutral-200'
            }`}>
              <div>
                <span className="block opacity-60 text-[10px]">الوجهة والمحطات:</span>
                <strong className="text-sm">{plan.destination}</strong>
              </div>

              <div>
                <span className="block opacity-60 text-[10px]">الميزانية التقديرية:</span>
                <strong className="text-sm">{plan.constraints.budget} {plan.constraints.currency}</strong>
              </div>

              <div>
                <span className="block opacity-60 text-[10px]">طبيعة المجموعة:</span>
                <strong className="text-sm">{plan.constraints.groupType}</strong>
              </div>

              <div>
                <span className="block opacity-60 text-[10px]">نمط وأسلوب السفر:</span>
                <strong className="text-sm">{plan.constraints.travelStyle}</strong>
              </div>
            </div>

            {/* Weather Snapshot if present */}
            {plan.weather && (
              <div className={`p-4 rounded-xl border text-xs space-y-2 ${
                themeMode === 'luxury_dark'
                  ? 'bg-[#161616] border-neutral-800'
                  : 'bg-sky-50 border-sky-200'
              }`}>
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5">
                    <CloudSun className="w-4 h-4 text-amber-500" />
                    حالة الطقس المباشرة وتوصيات الملابس:
                  </span>
                  <span>{plan.weather.currentTemp}° م ({plan.weather.condition})</span>
                </div>
                <p className="opacity-85 leading-relaxed text-[11px]">
                  <strong>الملابس النهارية:</strong> {plan.weather.clothingRecommendations.daytimeOutfit} | 
                  <strong> المسائية:</strong> {plan.weather.clothingRecommendations.eveningOutfit}
                </p>
              </div>
            )}

            {/* Personal Booking & Activity Notes section if present */}
            {(activityNotesList.length > 0 || customNotesList.length > 0) && (
              <div className={`p-4 rounded-xl border space-y-2.5 ${
                themeMode === 'luxury_dark'
                  ? 'bg-[#1a160e] border-[#d4af37]/40'
                  : 'bg-amber-50 border-amber-300'
              }`}>
                <div className="flex items-center gap-2 font-bold text-xs">
                  <Ticket className="w-4 h-4 text-[#d4af37]" />
                  <span>الملاحظات وأرقام الحجوزات الشخصية:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {activityNotesList.map((item) => (
                    <div
                      key={item.id}
                      className={`p-2.5 rounded-lg border text-[11px] space-y-1 ${
                        themeMode === 'luxury_dark'
                          ? 'bg-[#121212] border-neutral-800'
                          : 'bg-white border-amber-200'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span>🗓️ اليوم {item.dayNumber} {item.activityTitle ? `(${item.activityTitle})` : ''}</span>
                        {item.bookingNumber && <span className="font-mono text-amber-600">#{item.bookingNumber}</span>}
                      </div>
                      {item.ticketRef && <p className="opacity-80">التذكرة: {item.ticketRef}</p>}
                      {item.noteText && <p className="font-medium">{item.noteText}</p>}
                    </div>
                  ))}

                  {customNotesList.map(([dayIdx, note]) => (
                    <div
                      key={dayIdx}
                      className={`p-2.5 rounded-lg border text-[11px] space-y-1 ${
                        themeMode === 'luxury_dark'
                          ? 'bg-[#121212] border-neutral-800'
                          : 'bg-white border-amber-200'
                      }`}
                    >
                      <span className="font-bold block">🗓️ ملاحظة اليوم {dayIdx}:</span>
                      <p>{note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Markdown Body (Itinerary & Details) */}
            <div className={`markdown-body text-xs sm:text-sm leading-relaxed ${
              themeMode === 'luxury_dark' ? 'dark-pdf' : 'light-pdf'
            }`}>
              <Markdown>{plan.itineraryMarkdown}</Markdown>
            </div>

            {/* Local Experiences Section if present */}
            {plan.localExperiences && plan.localExperiences.length > 0 && (
              <div className={`border-t pt-4 space-y-3 ${
                themeMode === 'luxury_dark' ? 'border-neutral-800' : 'border-neutral-200'
              }`}>
                <h4 className="font-bold text-sm">💎 ترشيحات التجارب المحلية الأصيلة:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {plan.localExperiences.map((exp) => (
                    <div
                      key={exp.id}
                      className={`p-3 rounded-lg border text-[11px] space-y-1 ${
                        themeMode === 'luxury_dark'
                          ? 'bg-[#161616] border-neutral-800'
                          : 'bg-neutral-50 border-neutral-200'
                      }`}
                    >
                      <strong className="block text-xs">{exp.title} ({exp.location})</strong>
                      <p className="opacity-85">{exp.description}</p>
                      <span className="text-[10px] opacity-70 block">💡 نصيحة الخبراء: {exp.insiderTip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Document Footer */}
            <div className={`border-t pt-4 flex items-center justify-between text-[10px] opacity-75 ${
              themeMode === 'luxury_dark' ? 'border-neutral-800 text-neutral-400' : 'border-neutral-300 text-neutral-600'
            }`}>
              <span>SmartTravel AI • صُممت هذه الخطة بالذكاء الاصطناعي للسياحة الذكية</span>
              <span>صفحة تلخيصية للرحلة • {plan.destination}</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 sm:p-5 border-t border-neutral-800 bg-[#151515] flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          <div className="text-xs text-neutral-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>جاهز للطباعة أو التنزيل الفوري كملف PDF عالي الدقة.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleBrowserPrint}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-xl bg-[#222222] hover:bg-[#2c2c2c] text-neutral-200 border border-neutral-700 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-neutral-400" />
              <span>طباعة المتصفح</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-black shadow-lg shadow-[#d4af37]/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>جاري إنشاء وتصدير الـ PDF...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  <span>تحميل ملف PDF فوري</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

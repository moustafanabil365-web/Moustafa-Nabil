import React, { useState, useRef } from 'react';
import { 
  X, Download, Share2, Sparkles, Image as ImageIcon, 
  MapPin, Calendar, Wallet, Check, Copy, Award, Leaf, Layers
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { GeneratedPlan } from '../types';

interface TripHighlightCardModalProps {
  plan: GeneratedPlan;
  isOpen: boolean;
  onClose: () => void;
}

type CardTheme = 'gold' | 'emerald' | 'sunset' | 'midnight';

const THEMES: Record<CardTheme, { 
  name: string; 
  badge: string; 
  bgClass: string; 
  borderClass: string; 
  accentColor: string;
  glowColor: string;
}> = {
  gold: {
    name: 'ذهبي فاخر (Gold Luxury)',
    badge: '✨ فاخر',
    bgClass: 'bg-gradient-to-b from-[#1c1708] via-[#121212] to-[#0a0a0a]',
    borderClass: 'border-[#d4af37]/60 shadow-[#d4af37]/20',
    accentColor: '#d4af37',
    glowColor: 'rgba(212, 175, 55, 0.15)',
  },
  emerald: {
    name: 'زمردي طبيعي (Emerald Nature)',
    badge: '🌿 بيئي',
    bgClass: 'bg-gradient-to-b from-[#0a1c12] via-[#0d1410] to-[#080c09]',
    borderClass: 'border-emerald-500/60 shadow-emerald-500/20',
    accentColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.15)',
  },
  sunset: {
    name: 'غروب دافئ (Sunset Glow)',
    badge: '🌅 غروب',
    bgClass: 'bg-gradient-to-b from-[#24120c] via-[#170e0a] to-[#0d0908]',
    borderClass: 'border-amber-500/60 shadow-amber-500/20',
    accentColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.15)',
  },
  midnight: {
    name: 'أسود حديث (Midnight Luxe)',
    badge: '🌌 كلاسيك',
    bgClass: 'bg-gradient-to-b from-[#14141e] via-[#0f0f14] to-[#07070a]',
    borderClass: 'border-purple-500/60 shadow-purple-500/20',
    accentColor: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.15)',
  },
};

export const TripHighlightCardModal: React.FC<TripHighlightCardModalProps> = ({
  plan,
  isOpen,
  onClose,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<CardTheme>('gold');
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const currentTheme = THEMES[selectedTheme];

  // Extract top highlights / landmarks
  const highlights = (plan.dayLandmarks || [])
    .slice(0, 3)
    .map((l) => l.landmarkName)
    .filter(Boolean);

  const fallbackHighlights = [
    'استكشاف المعالم التاريخية والمعمارية',
    'تجارب المأكولات والمقاهي الأصيلة',
    'جولات المشي والتسوق في الأسواق التراثية',
  ];

  const displayHighlights = highlights.length > 0 ? highlights : fallbackHighlights;

  // Group type label in Arabic
  const groupLabels: Record<string, string> = {
    family_kids: 'عائلية مع أطفال 👨‍👩‍👧‍👦',
    couples_honeymoon: 'شهر عسل ورومانسي 💍',
    friends_youth: 'شبابية وأصدقاء 🏕️',
    solo_traveler: 'استكشاف فردي 🚶‍♂️',
    business_leisure: 'عمل واستجمام 💼',
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2.5, // High resolution
        useCORS: true,
        backgroundColor: '#0a0a0a',
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `SmartTravel-Card-${plan.destination.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating card image:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const shareText = `✈️ استعد لرحلتي القادمة إلى ${plan.destination} (${plan.durationDays} أيام)! خطة سياحية مخصصة بالذكاء الاصطناعي مع مرشد السفر الذكي.`;

  const handleShareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleShareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleCopyShareText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-[#121212] border border-neutral-800 rounded-3xl max-w-2xl w-full p-5 sm:p-6 space-y-6 shadow-2xl relative my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                إنشاء بطاقة الرحلة التذكارية (Trip Highlight Card)
              </h3>
              <p className="text-[11px] text-neutral-400">
                بطاقة أنيقة مهيأة للمشاركة الفورية على إنستغرام ستوري، إكس، والواتساب.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#1c1c1c] hover:bg-[#282828] text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Picker */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-bold text-neutral-300">اختر نمط ولون البطاقة:</span>
          <div className="flex items-center gap-1.5">
            {(Object.keys(THEMES) as CardTheme[]).map((themeKey) => {
              const th = THEMES[themeKey];
              const isSelected = selectedTheme === themeKey;
              return (
                <button
                  key={themeKey}
                  onClick={() => setSelectedTheme(themeKey)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#222] text-white border border-[#d4af37] shadow-sm'
                      : 'bg-[#181818] text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: th.accentColor }}
                  ></span>
                  <span>{th.badge}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* The Visual Highlight Card (Target for html2canvas) */}
        <div className="flex justify-center p-2">
          <div
            ref={cardRef}
            className={`w-full max-w-[420px] rounded-3xl p-6 sm:p-7 border-2 ${currentTheme.bgClass} ${currentTheme.borderClass} relative overflow-hidden shadow-2xl space-y-5 text-right`}
            dir="rtl"
            style={{
              boxShadow: `0 20px 50px -10px ${currentTheme.glowColor}`,
            }}
          >
            {/* Background Ambient Radial Lights */}
            <div
              className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"
              style={{ backgroundColor: currentTheme.accentColor, opacity: 0.15 }}
            ></div>

            {/* Top Brand & Type Badge */}
            <div className="flex items-center justify-between relative z-10 border-b border-neutral-800/80 pb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shadow-md"
                  style={{ backgroundColor: currentTheme.accentColor, color: '#000' }}
                >
                  ✈️
                </div>
                <span className="text-xs font-black tracking-wider text-white">
                  مرشد السفر الذكي
                </span>
              </div>

              <span
                className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border"
                style={{
                  color: currentTheme.accentColor,
                  borderColor: `${currentTheme.accentColor}50`,
                  backgroundColor: `${currentTheme.accentColor}15`,
                }}
              >
                بطاقة الرحلة الرسمية
              </span>
            </div>

            {/* Destination Headline & Duration */}
            <div className="space-y-1 relative z-10">
              <div className="text-[11px] font-bold text-neutral-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>الوجهة السياحية القادمة</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                {plan.destination}
              </h2>
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-[#1e1e1e] text-neutral-200 border border-neutral-800">
                  🗓️ {plan.durationDays} أيام
                </span>
                {plan.constraints.groupType && (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-[#1e1e1e] text-neutral-200 border border-neutral-800">
                    {groupLabels[plan.constraints.groupType] || 'رحلة مخصصة'}
                  </span>
                )}
                {plan.constraints.budget && (
                  <span
                    className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg border font-mono"
                    style={{
                      color: currentTheme.accentColor,
                      borderColor: `${currentTheme.accentColor}40`,
                      backgroundColor: `${currentTheme.accentColor}10`,
                    }}
                  >
                    💰 {plan.constraints.budget} {plan.constraints.currency}
                  </span>
                )}
              </div>
            </div>

            {/* Top Highlights List */}
            <div className="bg-[#141414]/90 border border-neutral-800/90 rounded-2xl p-4 space-y-2 relative z-10">
              <span className="text-[11px] font-bold text-neutral-400 block mb-1">
                ⭐ أبرز محطات وجواهر الرحلة:
              </span>
              {displayHighlights.map((hl, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-neutral-200">
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                    style={{ backgroundColor: `${currentTheme.accentColor}30`, color: currentTheme.accentColor }}
                  >
                    {idx + 1}
                  </span>
                  <span className="font-bold truncate">{hl}</span>
                </div>
              ))}
            </div>

            {/* Quality Score & Eco Rating Footer */}
            <div className="grid grid-cols-2 gap-2 pt-1 relative z-10">
              <div className="bg-[#181818] border border-neutral-800 p-2.5 rounded-xl flex items-center gap-2">
                <Award className="w-5 h-5" style={{ color: currentTheme.accentColor }} />
                <div>
                  <div className="text-[9px] text-neutral-400">تقييم الجودة</div>
                  <div className="text-xs font-black text-white font-mono">
                    {plan.tripQualityEvaluation?.overallScore || '8.8'} / 10
                  </div>
                </div>
              </div>

              <div className="bg-[#181818] border border-neutral-800 p-2.5 rounded-xl flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="text-[9px] text-neutral-400">الاستدامة البيئية</div>
                  <div className="text-xs font-black text-emerald-400 font-mono">
                    درجة ({plan.ecoImpact?.ecoGrade || 'A+'})
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom URL Watermark */}
            <div className="pt-2 text-center border-t border-neutral-800/80">
              <span className="text-[9px] text-neutral-500 font-mono tracking-wider">
                مولد بواسطة منصة مرشد السفر الذكي • SmartTravel AI
              </span>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-neutral-800 pt-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleShareWhatsApp}
              className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>واتساب</span>
            </button>
            <button
              onClick={handleShareTwitter}
              className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-sky-950/60 hover:bg-sky-900 text-sky-300 border border-sky-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>إكس (تويتر)</span>
            </button>
            <button
              onClick={handleCopyShareText}
              className="px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] hover:bg-[#282828] text-neutral-300 border border-neutral-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              title="نسخ نص المشاركة"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <button
            onClick={handleDownloadImage}
            disabled={isExporting}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#d4af37]/20 cursor-pointer disabled:opacity-60"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'جاري تصدير الصورة...' : 'تحميل بطاقة الهايلايت (PNG) 📸'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

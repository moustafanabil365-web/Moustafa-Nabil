import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { 
  Share2, MapPin, Calendar, Wallet, Sparkles, Download, 
  Check, Copy, Compass, Star, Eye 
} from 'lucide-react';
import { GeneratedPlan } from '../types';

interface SocialSharePreviewCardProps {
  plan: GeneratedPlan;
  shareUrl: string;
  onDownloaded?: () => void;
}

export const SocialSharePreviewCard: React.FC<SocialSharePreviewCardProps> = ({
  plan,
  shareUrl,
  onDownloaded,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Download Card as PNG Image for Social Media (Instagram Stories / WhatsApp Status / Twitter)
  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: '#0a0a0a',
        logging: false,
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `SmartTravel-${plan.destination.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_')}-StoryCard.png`;
      link.href = dataUrl;
      link.click();
      if (onDownloaded) onDownloaded();
    } catch (err) {
      console.error('Error generating social preview card image:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const travelStyleArabicMap: Record<string, string> = {
    relaxation_nature: 'استجمام وطبيعة هادئة',
    history_culture: 'تاريخ وثقافة واستكشاف',
    adventure_thrills: 'مغامرات وأنشطة حماسية',
    luxury_shopping: 'تسوق فاخر وفنادق راقية',
    budget_backpacking: 'اقتصادي واكتشاف حر',
    culinary_foodie: 'تذوق وأطعمة شعبية',
    kids_entertainment: 'عائلي وترفيه أطفال',
    authentic_local: 'تجارب محلية غير سياحية',
  };

  return (
    <div className="space-y-3">
      {/* Social Story Card Canvas Container */}
      <div
        ref={cardRef}
        className="bg-gradient-to-br from-[#181818] via-[#121212] to-[#0a0a0a] border-2 border-[#d4af37]/60 rounded-2xl p-5 shadow-2xl relative overflow-hidden text-neutral-100 font-['Cairo',sans-serif]"
        style={{ minHeight: '260px' }}
      >
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#d4af37]/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none -ml-10 -mb-10"></div>

        {/* Brand Top Header */}
        <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#d4af37] text-black font-black flex items-center justify-center text-sm shadow-md">
              ST
            </div>
            <div>
              <span className="font-black text-xs text-white tracking-wider block">SMARTTRAVEL AI</span>
              <span className="text-[9px] text-[#d4af37]">خطة السفر الذكية المعتمدة</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-[#d4af37] font-bold bg-[#202020] px-2.5 py-1 rounded-full border border-[#d4af37]/40">
            <Sparkles className="w-3 h-3" />
            <span>خطة ذكية مخصصة</span>
          </div>
        </div>

        {/* Main Destination Hero */}
        <div className="py-4 space-y-1 relative z-10">
          <div className="flex items-center gap-2 text-neutral-400 text-xs">
            <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>الوجهة السياحية المستهدفة:</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-wide bg-gradient-to-r from-white via-amber-100 to-[#d4af37] bg-clip-text text-transparent">
            {plan.destination}
          </h2>
        </div>

        {/* Key Trip Pillars Badges */}
        <div className="grid grid-cols-3 gap-2 relative z-10 my-1">
          <div className="bg-[#1c1c1c] p-2.5 rounded-xl border border-neutral-800 text-center">
            <Calendar className="w-3.5 h-3.5 text-[#d4af37] mx-auto mb-1" />
            <span className="block text-[10px] text-neutral-400">المدة</span>
            <strong className="text-xs text-white font-bold">{plan.durationDays} أيام</strong>
          </div>

          <div className="bg-[#1c1c1c] p-2.5 rounded-xl border border-neutral-800 text-center">
            <Wallet className="w-3.5 h-3.5 text-[#d4af37] mx-auto mb-1" />
            <span className="block text-[10px] text-neutral-400">الميزانية</span>
            <strong className="text-xs text-white font-bold">
              {plan.constraints.budget} {plan.constraints.currency}
            </strong>
          </div>

          <div className="bg-[#1c1c1c] p-2.5 rounded-xl border border-neutral-800 text-center">
            <Compass className="w-3.5 h-3.5 text-[#d4af37] mx-auto mb-1" />
            <span className="block text-[10px] text-neutral-400">النمط</span>
            <strong className="text-[11px] text-white font-bold truncate block">
              {travelStyleArabicMap[plan.constraints.travelStyle] || plan.constraints.travelStyle}
            </strong>
          </div>
        </div>

        {/* Footer Deep Link Bar */}
        <div className="mt-3 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[10px] text-neutral-400 relative z-10">
          <span className="font-mono text-neutral-300 truncate max-w-[220px]">
            {shareUrl || 'smarttravel.ai/trip'}
          </span>
          <span className="text-[#d4af37] font-bold">امسح أو افتح الرابط لعرض كامل الخطة ↗</span>
        </div>
      </div>

      {/* Action Download Story Card Button */}
      <button
        onClick={handleDownloadImage}
        disabled={isExporting}
        className="w-full py-2.5 px-4 rounded-xl bg-[#222222] hover:bg-[#2c2c2c] text-[#d4af37] border border-[#d4af37]/40 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
      >
        <Download className="w-4 h-4" />
        <span>{isExporting ? 'جاري تجهيز بطاقة القصة...' : 'تنزيل بطاقة السوشيال ميديا (Instagram Story / Status PNG)'}</span>
      </button>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  Share2, Copy, Check, X, Send, Mail, Globe, 
  Sparkles, ExternalLink, QrCode, ShieldCheck, RefreshCw, Calendar, MapPin,
  Download, Image as ImageIcon, Users
} from 'lucide-react';
import { GeneratedPlan } from '../types';
import { SocialSharePreviewCard } from './SocialSharePreviewCard';

interface ShareTripModalProps {
  plan: GeneratedPlan;
  isOpen: boolean;
  onClose: () => void;
  onOpenCollaborators?: () => void;
}

export const ShareTripModal: React.FC<ShareTripModalProps> = ({
  plan,
  isOpen,
  onClose,
  onOpenCollaborators,
}) => {
  const [shareUrl, setShareUrl] = useState<string>('');
  const [shareId, setShareId] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeView, setActiveView] = useState<'link' | 'card'>('link');
  const [error, setError] = useState<string | null>(null);

  // Generate or retrieve share link
  const generateShareLink = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/share-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });

      if (!res.ok) {
        throw new Error('فشل إنشاء رابط المشاركة');
      }

      const data = await res.json();
      const origin = window.location.origin;
      const fullUrl = `${origin}?shared=${data.shareId}`;
      setShareUrl(fullUrl);
      setShareId(data.shareId);
    } catch (err: any) {
      console.error('Error generating share link:', err);
      // Fallback: encode essential plan info into URL parameter
      const origin = window.location.origin;
      const fallbackUrl = `${origin}?shared=${plan.id || 'trip'}`;
      setShareUrl(fallbackUrl);
      setError('تم إنشاء رابط مباشر.');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (isOpen && !shareUrl) {
      generateShareLink();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const shareText = `✨ خطة رحلتي الذكية إلى ${plan.destination} (${plan.durationDays} أيام) مع توزيع الميزانية والأماكن غير السياحية:\n${shareUrl}`;

  // 1. WhatsApp Share
  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  // 2. Twitter / X Share Intent
  const handleTwitterShare = () => {
    const tweetText = `✨ صممت خطة رحلتي إلى ${plan.destination} (${plan.durationDays} أيام) بالذكاء الاصطناعي عبر SmartTravel AI!\nشاهد المسار والميزانية هنا:`;
    const hashtags = 'سياحة,سفر,SmartTravel,Travel';
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}&hashtags=${hashtags}`;
    window.open(url, '_blank');
  };

  // 3. Telegram Share
  const handleTelegramShare = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`✨ خطة رحلة ${plan.destination} (${plan.durationDays} أيام)`)}`;
    window.open(url, '_blank');
  };

  // 4. Facebook Share
  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  // 5. LinkedIn Share
  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  // 6. Native Web Share API (Mobile native sheet)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `خطة رحلة ${plan.destination} - SmartTravel AI`,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.warn('Native share cancelled or failed:', err);
      }
    } else {
      handleCopy();
    }
  };

  // 7. Email Share
  const handleEmailShare = () => {
    const subject = encodeURIComponent(`خطة رحلة سياحية إلى ${plan.destination}`);
    const body = encodeURIComponent(`مرحباً،\n\nأشاركك خطة السفر المخصصة إلى ${plan.destination} (${plan.durationDays} أيام).\n\nيمكنك الاطلاع على جدول الأيام، الفنادق، الخريطة التفاعلية، والأنشطة عبر هذا الرابط:\n${shareUrl}\n\nنتمنى لك رحلة ممتعة!`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#121212] border border-[#d4af37]/40 rounded-2xl w-full max-w-lg p-6 shadow-2xl shadow-black relative space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl bg-neutral-800/80 text-neutral-400 hover:text-white transition-colors cursor-pointer z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white">مشاركة خطة الرحلة على منصات التواصل</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-500/30">
                رابط مباشر سحابي
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              شارك تفاصيل الرحلة على واتساب، تويتر (X)، تيليجرام أو ولد بطاقة قصة بصرية للنشر.
            </p>
          </div>
        </div>

        {/* Tab Switcher: Direct Share vs Story Card */}
        <div className="flex items-center gap-2 bg-[#181818] p-1 rounded-xl border border-neutral-800">
          <button
            onClick={() => setActiveView('link')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeView === 'link'
                ? 'bg-[#d4af37] text-black shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>روابط السوشيال والمشاركة</span>
          </button>

          <button
            onClick={() => setActiveView('card')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeView === 'card'
                ? 'bg-[#d4af37] text-black shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>بطاقة القصة (Story Card)</span>
          </button>
        </div>

        {activeView === 'link' ? (
          <div className="space-y-4">
            {/* Trip Summary Pill */}
            <div className="bg-[#181818] border border-neutral-800 rounded-xl p-3.5 flex items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                    {plan.destination}
                  </span>
                  <span className="text-xs text-neutral-400">• {plan.durationDays} أيام</span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  الميزانية: {plan.constraints.budget} {plan.constraints.currency} | النمط: {plan.constraints.travelStyle}
                </p>
              </div>

              {onOpenCollaborators && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenCollaborators();
                  }}
                  className="p-2 rounded-lg bg-[#222222] hover:bg-[#2a2a2a] text-[#d4af37] border border-[#d4af37]/40 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  title="فتح مساحة رفقاء السفر"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>الرفقاء</span>
                </button>
              )}
            </div>

            {/* Deep Link Field */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-neutral-300">
                الرابط العميق المباشر (Deep Link):
              </label>
              
              {isGenerating ? (
                <div className="h-11 bg-[#181818] border border-neutral-800 rounded-xl flex items-center justify-center gap-2 text-xs text-neutral-400">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#d4af37]" />
                  <span>جاري توليد وحفظ رابط المشاركة السحابي...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 bg-[#181818] border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono select-all focus:outline-none focus:border-[#d4af37]"
                  />
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer flex-shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>تم!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>نسخ</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {error && <p className="text-[11px] text-amber-400">{error}</p>}
            </div>

            {/* Direct Social Share Grid */}
            <div className="space-y-2">
              <span className="block text-[11px] font-bold text-neutral-400">
                شارك مباشرة بضغطة زر:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {/* WhatsApp */}
                <button
                  onClick={handleWhatsAppShare}
                  disabled={!shareUrl}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                >
                  <span>واتساب WhatsApp</span>
                </button>

                {/* Twitter / X */}
                <button
                  onClick={handleTwitterShare}
                  disabled={!shareUrl}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                >
                  <span>منصة X (تويتر)</span>
                </button>

                {/* Telegram */}
                <button
                  onClick={handleTelegramShare}
                  disabled={!shareUrl}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-sky-950/50 hover:bg-sky-900/60 text-sky-300 border border-sky-700/50 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                >
                  <span>تيليجرام Telegram</span>
                </button>

                {/* Facebook */}
                <button
                  onClick={handleFacebookShare}
                  disabled={!shareUrl}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-blue-950/50 hover:bg-blue-900/60 text-blue-300 border border-blue-700/50 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                >
                  <span>فيسبوك Facebook</span>
                </button>

                {/* LinkedIn */}
                <button
                  onClick={handleLinkedInShare}
                  disabled={!shareUrl}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-indigo-950/50 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-700/50 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                >
                  <span>لينكد إن LinkedIn</span>
                </button>

                {/* Native Mobile Share Sheet */}
                <button
                  onClick={handleNativeShare}
                  disabled={!shareUrl}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#252525] hover:bg-[#303030] text-[#d4af37] border border-[#d4af37]/40 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>مشاركة الجهاز...</span>
                </button>
              </div>
            </div>

            {/* Security & Offline Access Note */}
            <div className="bg-[#161616] border border-neutral-800/80 rounded-xl p-3 flex items-center gap-2.5 text-[11px] text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-[#d4af37] flex-shrink-0" />
              <span>
                يمكن فتح هذا الرابط على أي هاتف أو جهاز كمبيوتر وحفظه تلقائياً للاستخدام بدون إنترنت (Offline Ready).
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <SocialSharePreviewCard plan={plan} shareUrl={shareUrl} />
          </div>
        )}

        {/* Footer Close */}
        <div className="flex justify-between items-center pt-2 border-t border-neutral-800/80">
          <div className="text-[11px] text-neutral-500">
            SmartTravel AI Social Engine v2.4
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

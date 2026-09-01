import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, MessageSquare, CheckCircle2, Sparkles, ThumbsUp, 
  Send, Edit3, ShieldCheck, Heart, Award
} from 'lucide-react';
import { TripUserFeedback } from '../types';

interface TripRatingFeedbackProps {
  initialFeedback?: TripUserFeedback;
  destination: string;
  onSaveFeedback: (feedback: TripUserFeedback) => void;
}

const RATING_LABELS: Record<number, { text: string; emoji: string; color: string }> = {
  1: { text: 'غير مرضٍ - يحتاج لتحسين', emoji: '😕', color: 'text-rose-400' },
  2: { text: 'مقبول - بحاجة لمزيد من التخصيص', emoji: '😐', color: 'text-amber-400' },
  3: { text: 'جيد - خطة مناسبة', emoji: '🙂', color: 'text-yellow-400' },
  4: { text: 'ممتاز جداً - خطة ثرية ومنظمة', emoji: '😃', color: 'text-emerald-400' },
  5: { text: 'تجربة ملكية استثنائية 👑', emoji: '🤩', color: 'text-[#d4af37]' },
};

const ASPECT_OPTIONS = [
  { id: 'pacing', label: '🎯 توازن وتوزيع الأوقات والراحة', icon: '⏱️' },
  { id: 'budget', label: '💰 دقة تقدير الميزانية والمصاريف', icon: '💵' },
  { id: 'gems', label: '💎 الجواهر الخفية والأماكن غير السياحية', icon: '✨' },
  { id: 'weather', label: '🌦️ تناغم الأنشطة مع الطقس', icon: '🌤️' },
  { id: 'packing', label: '🎒 دقة اقتراحات حقيبة السفر', icon: '🧳' },
  { id: 'transit', label: '🚗 سهولة وانسيابية مسارات التنقل', icon: '🚇' },
];

export const TripRatingFeedback: React.FC<TripRatingFeedbackProps> = ({
  initialFeedback,
  destination,
  onSaveFeedback,
}) => {
  const [rating, setRating] = useState<number>(initialFeedback?.rating || 5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [selectedAspects, setSelectedAspects] = useState<string[]>(
    initialFeedback?.likedAspects || ['pacing', 'gems', 'budget']
  );
  const [reviewComment, setReviewComment] = useState<string>(initialFeedback?.reviewComment || '');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(Boolean(initialFeedback?.submittedAt));
  const [isEditing, setIsEditing] = useState<boolean>(!initialFeedback?.submittedAt);
  const [isSaving, setIsSaving] = useState(false);

  // Category sub-ratings
  const [subRatings, setSubRatings] = useState({
    accuracy: initialFeedback?.categoryRatings?.accuracy || 5,
    variety: initialFeedback?.categoryRatings?.variety || 5,
    budgetMatch: initialFeedback?.categoryRatings?.budgetMatch || 5,
  });

  const currentDisplayRating = hoverRating || rating;
  const ratingInfo = RATING_LABELS[currentDisplayRating] || RATING_LABELS[5];

  const toggleAspect = (aspectId: string) => {
    setSelectedAspects((prev) =>
      prev.includes(aspectId) ? prev.filter((id) => id !== aspectId) : [...prev, aspectId]
    );
  };

  const handleSave = () => {
    setIsSaving(true);
    const feedback: TripUserFeedback = {
      rating,
      likedAspects: selectedAspects,
      reviewComment: reviewComment.trim(),
      categoryRatings: subRatings,
      submittedAt: new Date().toISOString(),
    };

    onSaveFeedback(feedback);

    setTimeout(() => {
      setIsSaving(false);
      setIsSubmitted(true);
      setIsEditing(false);
    }, 400);
  };

  return (
    <div className="bg-[#121212] border border-[#d4af37]/30 rounded-2xl p-5 sm:p-7 shadow-2xl shadow-black/80 space-y-6" id="trip-rating-section">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white">
                تقييم الخطة وتجربة السفر في {destination}
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30 font-bold">
                تحسين النموذج والتخصيص
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              رأيك يُسجّل مباشرة في بيانات الرحلة ويساعد في تحسين دقة الذكاء الاصطناعي وتخصيص رحلاتك القادمة
            </p>
          </div>
        </div>

        {isSubmitted && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="self-start sm:self-auto text-xs text-[#d4af37] hover:text-amber-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1c1c1c] border border-neutral-700 hover:border-[#d4af37]/40 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>تعديل التقييم</span>
          </button>
        )}
      </div>

      {/* Submitted View / Active Editing Form */}
      {isSubmitted && !isEditing ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#181818] border border-emerald-500/40 rounded-xl p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-bold">تم حفظ تقييمك بنجاح في بيانات الرحلة</span>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">
              {new Date(initialFeedback?.submittedAt || Date.now()).toLocaleDateString('ar-SA')}
            </span>
          </div>

          <div className="flex items-center gap-3 bg-[#111111] p-3.5 rounded-lg border border-neutral-800">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={`saved-${star}`}
                  className={`w-5 h-5 ${
                    star <= rating ? 'text-[#d4af37] fill-[#d4af37]' : 'text-neutral-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-white">
              {ratingInfo.emoji} {ratingInfo.text} ({rating}/5)
            </span>
          </div>

          {selectedAspects.length > 0 && (
            <div>
              <span className="text-xs text-neutral-400 block mb-2 font-medium">أبرز المزايا التي نالت إعجابك:</span>
              <div className="flex flex-wrap gap-2">
                {selectedAspects.map((aspectId) => {
                  const aspect = ASPECT_OPTIONS.find((a) => a.id === aspectId);
                  return (
                    <span
                      key={`saved-aspect-${aspectId}`}
                      className="text-xs px-2.5 py-1 rounded-lg bg-neutral-800 text-neutral-200 border border-neutral-700 font-medium"
                    >
                      {aspect?.label || aspectId}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {reviewComment && (
            <div className="bg-[#141414] p-3 rounded-lg border border-neutral-800 text-xs text-neutral-300">
              <span className="text-neutral-400 font-bold block mb-1">ملاحظاتك ومقترحاتك:</span>
              <p className="leading-relaxed italic text-neutral-200">"{reviewComment}"</p>
            </div>
          )}
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Main 5-Star Interactive Rating */}
          <div className="bg-[#181818] border border-neutral-700/80 rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-3">
            <span className="text-xs font-bold text-neutral-300">
              ما هو تقييمك الشامل لجودة وتكامل هذه الخطة السياحية؟
            </span>

            {/* Stars Row */}
            <div className="flex items-center gap-2 sm:gap-3 py-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const isActive = star <= currentDisplayRating;
                return (
                  <button
                    key={`star-${star}`}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    onClick={() => setRating(star)}
                    className="p-1 sm:p-2 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                    title={`${star} نجوم`}
                  >
                    <Star
                      className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors ${
                        isActive
                          ? 'text-[#d4af37] fill-[#d4af37] drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]'
                          : 'text-neutral-600 hover:text-neutral-400'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Dynamic Rating Label */}
            <motion.div
              key={currentDisplayRating}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm sm:text-base font-bold flex items-center gap-2"
            >
              <span>{ratingInfo.emoji}</span>
              <span className={ratingInfo.color}>{ratingInfo.text}</span>
              <span className="text-xs text-neutral-400 font-mono">({currentDisplayRating} من 5)</span>
            </motion.div>
          </div>

          {/* Sub-aspects Multi-Select */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
              <ThumbsUp className="w-3.5 h-3.5 text-[#d4af37]" />
              ما هي أكثر الجوانب التي وجدتها متميزة في الخطة؟ (اختر ما ينطبق)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {ASPECT_OPTIONS.map((aspect) => {
                const isSelected = selectedAspects.includes(aspect.id);
                return (
                  <button
                    key={aspect.id}
                    type="button"
                    onClick={() => toggleAspect(aspect.id)}
                    className={`p-3 rounded-xl border text-right transition-all cursor-pointer flex items-center justify-between text-xs font-medium ${
                      isSelected
                        ? 'bg-[#d4af37]/15 border-[#d4af37]/60 text-amber-200 shadow-sm'
                        : 'bg-[#181818] hover:bg-[#202020] border-neutral-800 text-neutral-300'
                    }`}
                  >
                    <span>{aspect.label}</span>
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                        isSelected
                          ? 'border-[#d4af37] bg-[#d4af37] text-black font-black'
                          : 'border-neutral-600'
                      }`}
                    >
                      {isSelected ? '✓' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Review / Comment Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#d4af37]" />
              ملاحظاتك الإضافية أو مقترحات تخصيص محددة (اختياري)
            </label>
            <textarea
              rows={3}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="مثال: الجدول ممتاز جداً، ولكن أفضّل تخصيص وقت أطول لأسواق المشي الشعبية في المساء..."
              className="w-full bg-[#161616] border border-neutral-700/80 rounded-xl p-3 text-xs sm:text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] leading-relaxed resize-none"
            />
          </div>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-neutral-800">
            <div className="flex items-center gap-2 text-[11px] text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>يتم تخزين التقييم تلقائياً في السجل السحابي للرحلة</span>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38f28] hover:from-[#e5c158] hover:to-[#c49f34] text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#d4af37]/20 transition-all cursor-pointer"
            >
              {isSaving ? (
                <>
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>حفظ التقييم وتأكيد التجربة</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

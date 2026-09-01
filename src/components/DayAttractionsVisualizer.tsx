import React, { useState, useEffect } from 'react';
import { 
  Camera, Sparkles, RefreshCw, Eye, Maximize2, X, 
  MapPin, Clock, Sun, Image as ImageIcon, CheckCircle2,
  ChevronRight, ChevronLeft, AlertCircle, Compass
} from 'lucide-react';
import { GeneratedPlan, DayVisualLandmark } from '../types';
import { resolvePlaceImageUrl } from '../utils/placeImageResolver';

interface DayAttractionsVisualizerProps {
  plan: GeneratedPlan;
  onUpdateDayLandmarks?: (landmarks: DayVisualLandmark[]) => void;
  onAskAboutAttraction?: (landmarkName: string) => void;
}

export const DayAttractionsVisualizer: React.FC<DayAttractionsVisualizerProps> = ({
  plan,
  onUpdateDayLandmarks,
  onAskAboutAttraction,
}) => {
  const [landmarks, setLandmarks] = useState<DayVisualLandmark[]>(plan.dayLandmarks || []);
  const [isLoadingExtraction, setIsLoadingExtraction] = useState(false);
  const [generatingDays, setGeneratingDays] = useState<Record<number, boolean>>({});
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string; desc: string } | null>(null);

  // Extract landmarks if not already stored
  useEffect(() => {
    if (plan.dayLandmarks && plan.dayLandmarks.length > 0) {
      setLandmarks(plan.dayLandmarks);
      return;
    }

    const extractLandmarks = async () => {
      setIsLoadingExtraction(true);
      try {
        const res = await fetch('/api/extract-day-landmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            destination: plan.destination,
            durationDays: plan.durationDays,
            itineraryMarkdown: plan.itineraryMarkdown,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.landmarks && Array.isArray(data.landmarks)) {
            setLandmarks(data.landmarks);
            if (onUpdateDayLandmarks) {
              onUpdateDayLandmarks(data.landmarks);
            }
          }
        }
      } catch (err) {
        console.error('Failed to extract day landmarks', err);
      } finally {
        setIsLoadingExtraction(false);
      }
    };

    extractLandmarks();
  }, [plan.id, plan.destination, plan.durationDays]);

  // Generate or Regenerate an AI image with Imagen for a specific day's attraction
  const handleRegenerateImage = async (dayNumber: number, landmarkName: string) => {
    setGeneratingDays((prev) => ({ ...prev, [dayNumber]: true }));

    try {
      const res = await fetch('/api/generate-attraction-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: plan.destination,
          landmarkName,
          dayNumber,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.imageUrl) {
          const updated = landmarks.map((l) =>
            l.dayNumber === dayNumber
              ? { ...l, imageUrl: data.imageUrl, generatedBy: data.generatedBy || 'imagen' }
              : l
          );
          setLandmarks(updated);
          if (onUpdateDayLandmarks) {
            onUpdateDayLandmarks(updated);
          }
        }
      }
    } catch (e) {
      console.error('Failed to regenerate image', e);
    } finally {
      setGeneratingDays((prev) => ({ ...prev, [dayNumber]: false }));
    }
  };

  return (
    <div className="bg-[#141414] border border-neutral-800 rounded-2xl p-5 sm:p-7 space-y-6 shadow-xl" id="day-attractions-visualizer">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>المعرض البصري لمعالم الرحلة الذكية</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30 font-extrabold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                معالم مصورة عالية الدقة
              </span>
            </h3>
            <p className="text-xs text-neutral-400">
              صور فوتوغرافية سينمائية فائقة الدقة لكل يوم من أيام رحلتك مع أفضل أوقات وزوايا التصوير
            </p>
          </div>
        </div>

        {landmarks.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400">
              {landmarks.length} أيام مصورة
            </span>
          </div>
        )}
      </div>

      {/* Loading State during Initial AI Extraction */}
      {isLoadingExtraction ? (
        <div className="p-12 text-center bg-[#181818] border border-neutral-800 rounded-xl space-y-3">
          <RefreshCw className="w-8 h-8 text-[#d4af37] animate-spin mx-auto" />
          <h4 className="text-sm font-bold text-white">جاري تحليل معالم أيام الرحلة وتوليد المشاهد البصرية...</h4>
          <p className="text-xs text-neutral-400">يتم استخراج أبرز المعالم السياحية وتجهيز إضاءات التصوير لكل يوم.</p>
        </div>
      ) : landmarks.length === 0 ? (
        <div className="p-8 text-center bg-[#181818] border border-neutral-800 rounded-xl space-y-2">
          <ImageIcon className="w-8 h-8 text-neutral-500 mx-auto" />
          <p className="text-xs text-neutral-400">لا توجد معالم مستخرجة حالياً، يمكنك مراجعة جدول الرحلة.</p>
        </div>
      ) : (
        /* Day by Day Grid Showcase */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {landmarks.map((landmark) => {
            const isGenerating = generatingDays[landmark.dayNumber];

            return (
              <div
                key={landmark.dayNumber}
                className="bg-[#181818] border border-neutral-800 hover:border-[#d4af37]/50 rounded-xl overflow-hidden flex flex-col transition-all duration-200 group hover:shadow-xl hover:shadow-black/50"
              >
                {/* Image Banner */}
                <div className="relative aspect-[16/10] bg-[#111111] overflow-hidden">
                  <img
                    src={landmark.imageUrl || resolvePlaceImageUrl(landmark.landmarkName, landmark.city || plan.destination)}
                    alt={landmark.landmarkName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      const fallback = resolvePlaceImageUrl(landmark.landmarkName, landmark.city || plan.destination);
                      if (e.currentTarget.src !== fallback) {
                        e.currentTarget.src = fallback;
                      }
                    }}
                  />

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Day Badge */}
                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-[#d4af37]/40 text-[#d4af37] text-xs font-bold shadow-lg">
                      اليوم {landmark.dayNumber}
                    </span>
                  </div>

                  {/* Imagen AI Tag */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md border border-neutral-700 text-[10px] text-neutral-300 font-mono flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-[#d4af37]" />
                      Imagen
                    </span>
                  </div>

                  {/* Hover Actions: Lightbox + Regenerate */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
                    <button
                      onClick={() =>
                        setLightboxImage({
                          url: landmark.imageUrl || '',
                          title: `${landmark.dayTitle} - ${landmark.landmarkName}`,
                          desc: landmark.description,
                        })
                      }
                      className="px-2.5 py-1 rounded-lg bg-black/80 hover:bg-black text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      title="عرض بالصورة الكاملة"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>تكبير</span>
                    </button>

                    <button
                      onClick={() => handleRegenerateImage(landmark.dayNumber, landmark.landmarkName)}
                      disabled={isGenerating}
                      className="px-2.5 py-1 rounded-lg bg-[#d4af37]/90 hover:bg-[#d4af37] text-black text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-md"
                      title="إعادة توليد صورة جديدة بالذكاء الاصطناعي"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                      <span>{isGenerating ? 'جاري التوليد...' : 'توليد بديل'}</span>
                    </button>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-[#d4af37] font-bold">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{landmark.landmarkName}</span>
                    </div>

                    <h4 className="text-sm font-bold text-white line-clamp-1">
                      {landmark.dayTitle}
                    </h4>

                    <p className="text-xs text-neutral-300 leading-relaxed line-clamp-2">
                      {landmark.description}
                    </p>
                  </div>

                  {/* Photography & Time Tips */}
                  <div className="space-y-2 pt-2 border-t border-neutral-800/80 text-[11px]">
                    {landmark.bestTime && (
                      <div className="flex items-center gap-1.5 text-amber-300 font-medium">
                        <Clock className="w-3 h-3 text-[#d4af37]" />
                        <span>أفضل توقيت للزيارة: {landmark.bestTime}</span>
                      </div>
                    )}

                    {landmark.photoTip && (
                      <div className="flex items-start gap-1.5 text-neutral-400">
                        <Sun className="w-3 h-3 text-amber-400 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">نصيحة التصوير: {landmark.photoTip}</span>
                      </div>
                    )}
                  </div>

                  {/* Ask Assistant Option */}
                  {onAskAboutAttraction && (
                    <button
                      onClick={() => onAskAboutAttraction(landmark.landmarkName)}
                      className="w-full text-center py-1.5 rounded-lg bg-[#141414] hover:bg-[#202020] text-[11px] text-neutral-400 hover:text-[#d4af37] border border-neutral-800 transition-colors cursor-pointer"
                    >
                      💬 استفسر عن تذاكر ومواعيد هذا المعلم
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full-Screen Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div 
            className="max-w-4xl w-full bg-[#121212] border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] bg-black">
              <img
                src={lightboxImage.url}
                alt={lightboxImage.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-neutral-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 border-t border-neutral-800">
              <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                {lightboxImage.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300">
                {lightboxImage.desc}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

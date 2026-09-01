import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, Activity, HeartPulse, Droplets, AlertTriangle, 
  CheckCircle2, RefreshCw, PhoneCall, ShieldCheck, Thermometer,
  Sparkles, FileText, Info, ChevronDown, ChevronUp, Syringe
} from 'lucide-react';
import { DestinationHealthAdvisory, HealthAdvisoryItem } from '../types';

interface HealthAndSafetyAdvisoryWidgetProps {
  destination: string;
  initialData?: DestinationHealthAdvisory;
  onUpdateAdvisories?: (advisory: DestinationHealthAdvisory) => void;
}

export const HealthAndSafetyAdvisoryWidget: React.FC<HealthAndSafetyAdvisoryWidgetProps> = ({
  destination,
  initialData,
  onUpdateAdvisories,
}) => {
  const [advisoryData, setAdvisoryData] = useState<DestinationHealthAdvisory | null>(
    initialData || null
  );
  const [isLoading, setIsLoading] = useState<boolean>(!initialData);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealthAdvisories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/destination-health-advisories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination }),
      });

      if (res.ok) {
        const json = await res.json();
        const data: DestinationHealthAdvisory = json.advisory || json;
        setAdvisoryData(data);
        if (onUpdateAdvisories) {
          onUpdateAdvisories(data);
        }
      } else {
        throw new Error('Failed to fetch health advisory data');
      }
    } catch (err: any) {
      console.error('Health advisory fetch error:', err);
      setError('تعذر تحميل أحدث التنبيهات الصحية تلقائياً.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!initialData) {
      fetchHealthAdvisories();
    }
  }, [destination]);

  const getSafetyBadge = (level: number = 1, label?: string) => {
    if (level >= 3) {
      return { 
        text: label || 'مستوى تحذيري مرتفع', 
        bg: 'bg-rose-950/50 border-rose-600/60 text-rose-300' 
      };
    }
    if (level === 2) {
      return { 
        text: label || 'مستوى 2: توخي الحذر المعتدل', 
        bg: 'bg-amber-950/50 border-amber-600/60 text-amber-300' 
      };
    }
    return { 
      text: label || 'مستوى 1: احتياطات اعتيادية وآمنة', 
      bg: 'bg-emerald-950/50 border-emerald-600/60 text-emerald-300' 
    };
  };

  const badge = getSafetyBadge(advisoryData?.safetyLevel, advisoryData?.safetyLevelLabel);

  return (
    <div className="bg-[#111111] border border-rose-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-black/80 space-y-5" id="health-safety-advisory">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <HeartPulse className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-black text-white">
                الإرشادات والتحذيرات الصحية المباشرة (Health & Safety Advisories)
              </h3>
              <span className={`text-[10px] px-2 py-0.5 rounded border font-bold ${badge.bg}`}>
                {badge.text}
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              استخبارات فورية ومستمرة حول مياه الشرب، اللقاحات، وأرقام الطوارئ الطبية لوجهة {destination}.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={fetchHealthAdvisories}
            disabled={isLoading}
            className="p-2 rounded-xl bg-[#1a1a1a] hover:bg-[#252525] text-neutral-300 border border-neutral-800 hover:border-rose-500/40 transition-colors cursor-pointer"
            title="تحديث البيانات الصحية"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-rose-400' : ''}`} />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-[#1a1a1a] hover:bg-[#252525] text-neutral-300 border border-neutral-800 transition-colors cursor-pointer"
            title={isExpanded ? 'تصغير' : 'توسيع'}
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {isLoading && !advisoryData && (
        <div className="py-8 text-center text-xs text-neutral-400 space-y-2">
          <RefreshCw className="w-5 h-5 animate-spin text-rose-400 mx-auto" />
          <p>جاري فحص وتحديث بروتوكولات الصحة والسلامة لوجهة {destination}...</p>
        </div>
      )}

      {error && !advisoryData && (
        <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-3 text-xs text-rose-300 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchHealthAdvisories} className="text-white underline font-bold cursor-pointer">
            إعادة المحاولة
          </button>
        </div>
      )}

      {advisoryData && isExpanded && (
        <div className="space-y-4">
          {/* Quick Metrics Bar (Water, Hospital Phone, Emergency Numbers) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Tap Water Safety */}
            <div className="bg-[#171717] border border-neutral-800 rounded-xl p-3 flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center flex-shrink-0">
                <Droplets className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-400 font-bold block">مياه الشرب والصنبور</span>
                <span className={`text-xs font-bold leading-tight block ${advisoryData.tapWaterSafe ? 'text-emerald-300' : 'text-amber-300'}`}>
                  {advisoryData.tapWaterSafe ? '✅ مياه الصنبور صالحة للشرب' : '⚠️ يفضل المياه المعبأة'}
                </span>
                {advisoryData.tapWaterNote && (
                  <p className="text-[10px] text-neutral-400 leading-tight pt-0.5">{advisoryData.tapWaterNote}</p>
                )}
              </div>
            </div>

            {/* Emergency Medical Hotline */}
            <div className="bg-[#171717] border border-neutral-800 rounded-xl p-3 flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 font-bold block">أرقام الطوارئ والإسعاف</span>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="text-xs font-mono font-bold text-rose-300 bg-[#121212] px-2 py-0.5 rounded border border-rose-900/40">
                    🚑 {advisoryData.emergencyNumbers?.ambulance || '112'}
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-300 bg-[#121212] px-2 py-0.5 rounded border border-amber-900/40">
                    👮 {advisoryData.emergencyNumbers?.police || '999'}
                  </span>
                </div>
              </div>
            </div>

            {/* Medical Facility & Insurance */}
            <div className="bg-[#171717] border border-neutral-800 rounded-xl p-3 flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 font-bold block">التأمين والمستشفيات</span>
                <p className="text-xs text-neutral-300 leading-snug">
                  {advisoryData.medicalFacilityNote || 'المستشفيات تقبل وثائق التأمين الطبي الدولي المعتمدة.'}
                </p>
              </div>
            </div>
          </div>

          {/* Vaccination Notes */}
          {(advisoryData.requiredVaccines?.length > 0 || advisoryData.recommendedVaccines?.length > 0) && (
            <div className="bg-[#15181b] border border-sky-500/30 rounded-xl p-3 text-xs text-sky-200 flex items-start gap-2.5">
              <Syringe className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1 w-full">
                <span className="font-bold text-sky-100">اللقاحات والتحصينات الوقائية:</span>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {advisoryData.requiredVaccines?.map((v, i) => (
                    <span key={`req-${i}`} className="px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-700/50 text-[11px] font-bold">
                      إلزامي: {v}
                    </span>
                  ))}
                  {advisoryData.recommendedVaccines?.map((v, i) => (
                    <span key={`rec-${i}`} className="px-2 py-0.5 rounded bg-sky-950/60 text-sky-300 border border-sky-700/50 text-[11px]">
                      موصى به: {v}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Detailed Health Items */}
          {advisoryData.healthItems && advisoryData.healthItems.length > 0 && (
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-neutral-300 block">
                التنبيهات والمحاذير الوقائية المفصلة:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {advisoryData.healthItems.map((item) => {
                  const isWarning = item.severity === 'warning';
                  const isAdvisory = item.severity === 'advisory';

                  return (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl border flex flex-col justify-between gap-2 ${
                        isWarning
                          ? 'bg-rose-950/20 border-rose-500/40'
                          : isAdvisory
                          ? 'bg-amber-950/20 border-amber-500/40'
                          : 'bg-[#181818] border-neutral-800'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                            <span>{isWarning ? '⚠️' : isAdvisory ? '💡' : '🛡️'}</span>
                            <span>{item.title}</span>
                          </div>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                              isWarning
                                ? 'bg-rose-950 text-rose-300 border-rose-700'
                                : isAdvisory
                                ? 'bg-amber-950 text-amber-300 border-amber-700'
                                : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                            }`}
                          >
                            {item.severity}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-300 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {item.recommendation && (
                        <div className="text-[10px] text-[#d4af37] bg-[#121212] p-2 rounded-lg border border-neutral-800 flex items-start gap-1.5">
                          <Sparkles className="w-3 h-3 text-[#d4af37] flex-shrink-0 mt-0.5" />
                          <span>{item.recommendation}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

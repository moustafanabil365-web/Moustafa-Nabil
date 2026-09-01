import React, { useState, useEffect } from 'react';
import { 
  Radio, AlertTriangle, Info, ShieldCheck, RefreshCw, 
  ExternalLink, ChevronRight, Zap, CheckCircle2, ArrowRight
} from 'lucide-react';
import { TravelAlert, GeneratedPlan } from '../types';

interface RealTimeAlertsBannerProps {
  destination: string;
  isMultiCity?: boolean;
  initialAlerts?: TravelAlert[];
  plan: GeneratedPlan;
  onApplyContingencyPlan?: (newItineraryMarkdown: string) => void;
}

export const RealTimeAlertsBanner: React.FC<RealTimeAlertsBannerProps> = ({
  destination,
  isMultiCity,
  initialAlerts,
  plan,
  onApplyContingencyPlan,
}) => {
  const [alerts, setAlerts] = useState<TravelAlert[]>(initialAlerts || []);
  const [isScanning, setIsScanning] = useState(false);
  const [activeDisruptionSolving, setActiveDisruptionSolving] = useState<string | null>(null);
  const [isHandlingDisruption, setIsHandlingDisruption] = useState(false);
  const [contingencySuccess, setContingencySuccess] = useState<string | null>(null);

  // Auto-scan alerts on load if none exist
  useEffect(() => {
    if (!initialAlerts || initialAlerts.length === 0) {
      handleScanAlerts();
    }
  }, [destination]);

  const handleScanAlerts = async () => {
    setIsScanning(true);
    try {
      const res = await fetch('/api/check-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          isMultiCity,
          cityStops: plan.constraints.cityStops,
        }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.alerts)) {
        setAlerts(data.alerts);
      }
    } catch (e) {
      console.warn('Failed to scan live alerts:', e);
    } finally {
      setIsScanning(false);
    }
  };

  const handleResolveDisruption = async (alert: TravelAlert) => {
    setActiveDisruptionSolving(alert.id);
    setIsHandlingDisruption(true);
    setContingencySuccess(null);

    try {
      const res = await fetch('/api/handle-disruption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disruption: `${alert.title}: ${alert.description}. الأثر: ${alert.impact}`,
          currentItinerary: plan.itineraryMarkdown,
          destination,
          constraints: plan.constraints,
        }),
      });
      const data = await res.json();
      if (data.success && data.itineraryMarkdown) {
        if (onApplyContingencyPlan) {
          onApplyContingencyPlan(data.itineraryMarkdown);
        }
        setContingencySuccess(`تم تعديل جدول الرحلة بنجاح وتجاوز اضطراب: ${alert.title}!`);
        // Mark alert as resolved
        setAlerts((prev) =>
          prev.map((a) => (a.id === alert.id ? { ...a, isResolved: true } : a))
        );
      }
    } catch (err) {
      console.error('Failed to handle disruption:', err);
    } finally {
      setIsHandlingDisruption(false);
      setActiveDisruptionSolving(null);
    }
  };

  return (
    <div className="bg-[#141414] border border-neutral-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800/80 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Radio className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#141414]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white">
                رادار مراقبة اضطرابات السفر والتنبيهات المباشرة (Real-time Travel Alerts)
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono">
                LIVE
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              مراقبة مسار الرحلة، تأخير الرحلات الجوية، مواعيد القطارات وحالة الطقس والازدحام في {destination}.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleScanAlerts}
          disabled={isScanning}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1c1c1c] hover:bg-[#262626] text-neutral-300 hover:text-white border border-neutral-700 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-[#d4af37]' : ''}`} />
          <span>{isScanning ? 'جاري الفحص المباشر...' : 'تحديث الرادار'}</span>
        </button>
      </div>

      {/* Contingency Success message */}
      {contingencySuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{contingencySuccess}</span>
        </div>
      )}

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="py-6 text-center text-xs text-neutral-400 flex flex-col items-center justify-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <span>جميع المسارات ومواعيد الرحلات الجوية والقطارات تسير بسلاسة تامة دون اضطرابات مسجلة.</span>
          </div>
        ) : (
          alerts.map((alert) => {
            const isHigh = alert.severity === 'high';
            const isSolvingThis = activeDisruptionSolving === alert.id;

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  alert.isResolved
                    ? 'bg-[#101913] border-emerald-900/50 opacity-70'
                    : isHigh
                    ? 'bg-[#1d1210] border-rose-500/30'
                    : 'bg-[#181611] border-amber-500/30'
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 ${
                        alert.isResolved
                          ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-500/30'
                          : isHigh
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {alert.isResolved ? (
                        'تم حل الاضطراب بخطة بديلة'
                      ) : (
                        <>
                          <AlertTriangle className="w-3 h-3" />
                          <span>{isHigh ? 'تنبيه طارئ' : 'تنبيه استباقي'}</span>
                        </>
                      )}
                    </span>
                    <span className="text-xs text-neutral-400">📍 {alert.affectedLocation}</span>
                    <span className="text-[11px] text-neutral-500">⏱️ {alert.timestamp}</span>
                  </div>

                  <h4 className="text-sm font-bold text-white">{alert.title}</h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">{alert.description}</p>
                  
                  <div className="text-[11px] text-neutral-400 flex flex-wrap gap-x-4 gap-y-1 pt-1">
                    <span><strong>الأثر:</strong> {alert.impact}</span>
                    <span className="text-amber-300/90"><strong>التصرف المقترح:</strong> {alert.suggestedAction}</span>
                  </div>
                </div>

                {/* Contingency Plan Action */}
                {!alert.isResolved && (
                  <div className="flex-shrink-0 flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isHandlingDisruption}
                      onClick={() => handleResolveDisruption(alert)}
                      className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#d4af37]/20 cursor-pointer disabled:opacity-50"
                    >
                      {isSolvingThis ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          <span>جاري صياغة الخطة البديلة...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5" />
                          <span>تطبيق خطة طوارئ بديلة فوراً</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

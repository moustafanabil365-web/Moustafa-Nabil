import React, { useState } from 'react';
import { WifiOff, Wifi, CheckCircle2, Download, HardDrive, ShieldCheck } from 'lucide-react';
import { GeneratedPlan } from '../types';
import { useOfflineStatus } from '../hooks/useOfflineStatus';

interface OfflineStatusBannerProps {
  plan?: GeneratedPlan | null;
}

export const OfflineStatusBanner: React.FC<OfflineStatusBannerProps> = ({ plan }) => {
  const { isOnline, isOffline, isCached, forceCacheCurrentPlan, metadata } = useOfflineStatus(plan);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleManualCache = () => {
    const ok = forceCacheCurrentPlan();
    if (ok) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }
  };

  if (isOnline && !downloadSuccess) {
    // When online, show a subtle pill if requested or when plan is loaded
    return null;
  }

  return (
    <div className="w-full mb-4 animate-fadeIn">
      {isOffline ? (
        <div className="bg-amber-950/70 border border-amber-500/50 rounded-2xl p-4 shadow-lg backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0">
              <WifiOff className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">أنت في وضع عدم الاتصال (Offline Mode)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-600/40">
                  التخزين المحلي نشط
                </span>
              </div>
              <p className="text-xs text-amber-300/80 mt-0.5">
                يمكنك تصفح جدول الأيام الكامل، قائمة الأغراض، الملاحظات والحجوزات حتى أثناء الطيران أو انقطاع الإنترنت.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-300 bg-[#121212]/80 px-3 py-1.5 rounded-xl border border-amber-500/30">
            <HardDrive className="w-3.5 h-3.5 text-amber-400" />
            <span>{metadata.totalCachedPlans} خطط مخزنة محلياً</span>
          </div>
        </div>
      ) : downloadSuccess ? (
        <div className="bg-emerald-950/70 border border-emerald-500/50 rounded-2xl p-3.5 shadow-lg backdrop-blur-md flex items-center justify-between gap-3 text-emerald-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-xs sm:text-sm font-bold text-white">
              تم حفظ الخطة وقائمة الأغراض محلياً بنجاح! ستتمكن من فتحها بدون إنترنت أثناء السفر.
            </span>
          </div>
          <span className="text-[11px] text-emerald-400 font-bold">جاهز للاستخدام Offline</span>
        </div>
      ) : null}
    </div>
  );
};

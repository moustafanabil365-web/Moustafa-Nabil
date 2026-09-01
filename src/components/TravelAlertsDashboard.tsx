import React, { useState, useEffect } from 'react';
import { 
  Plane, Clock, AlertTriangle, AlertCircle, Info, Shield, 
  CreditCard, PhoneCall, RefreshCw, ChevronDown, ChevronUp, 
  ExternalLink, Sparkles, Navigation, CheckCircle2, Globe
} from 'lucide-react';
import { TravelAlert, GeneratedPlan } from '../types';

interface TravelAlertsDashboardProps {
  plan: GeneratedPlan;
  onApplyContingency?: (newMarkdown: string) => void;
}

interface QuickMetrics {
  timezoneOffset?: string;
  airportStatus?: string;
  localEmergencyNumber?: string;
  bestPaymentMethod?: string;
}

export const TravelAlertsDashboard: React.FC<TravelAlertsDashboardProps> = ({
  plan,
  onApplyContingency,
}) => {
  const [alerts, setAlerts] = useState<TravelAlert[]>(plan.activeAlerts || []);
  const [metrics, setMetrics] = useState<QuickMetrics>({
    timezoneOffset: 'جارِ الحساب...',
    airportStatus: 'عمليات طبيعية ومنتظمة',
    localEmergencyNumber: '112 / 911',
    bestPaymentMethod: 'Apple Pay والبطاقات مقبولة بشكل واسع',
  });
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [destTime, setDestTime] = useState<string>('');

  const fetchLiveAlerts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/travel-alerts-feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: plan.destination,
          isMultiCity: plan.constraints.isMultiCity,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.alerts) {
          setAlerts(data.alerts);
        }
        if (data.quickMetrics) {
          setMetrics(data.quickMetrics);
        }
      }
    } catch (e) {
      console.error('Failed to fetch travel alerts feed:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveAlerts();
  }, [plan.destination]);

  // Live Clock calculation
  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      // Riyadh / Gulf time
      const saudiStr = now.toLocaleTimeString('ar-SA', {
        timeZone: 'Asia/Riyadh',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      setCurrentTime(saudiStr);

      // Destination rough timezone estimation
      try {
        let tz = 'UTC';
        const d = plan.destination.toLowerCase();
        if (d.includes('لندن') || d.includes('london')) tz = 'Europe/London';
        else if (d.includes('باريس') || d.includes('paris') || d.includes('فرنسا')) tz = 'Europe/Paris';
        else if (d.includes('طوكيو') || d.includes('tokyo') || d.includes('اليابان')) tz = 'Asia/Tokyo';
        else if (d.includes('دبي') || d.includes('dubai') || d.includes('أبوظبي')) tz = 'Asia/Dubai';
        else if (d.includes('إسطنبول') || d.includes('istanbul') || d.includes('تركيا')) tz = 'Europe/Istanbul';
        else if (d.includes('روما') || d.includes('rome') || d.includes('إيطاليا')) tz = 'Europe/Rome';
        else if (d.includes('القاهرة') || d.includes('cairo') || d.includes('مصر')) tz = 'Africa/Cairo';
        else if (d.includes('بانكوك') || d.includes('bangkok') || d.includes('تايلاند')) tz = 'Asia/Bangkok';
        else if (d.includes('نيويورك') || d.includes('new york')) tz = 'America/New_York';
        else if (d.includes('سيول') || d.includes('seoul') || d.includes('كوريا')) tz = 'Asia/Seoul';
        else tz = 'Asia/Riyadh';

        const destStr = now.toLocaleTimeString('ar-SA', {
          timeZone: tz,
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
        setDestTime(destStr);
      } catch {
        setDestTime(saudiStr);
      }
    };

    updateClocks();
    const interval = setInterval(updateClocks, 10000);
    return () => clearInterval(interval);
  }, [plan.destination]);

  return (
    <div className="bg-[#111111] border border-amber-500/30 rounded-2xl p-5 shadow-2xl shadow-black/80 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 border-b border-neutral-800/80 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-[#d4af37]">
            <Plane className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-white">
                لوحة تنبيهات السفر واستخبارات الرحلة الحية
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/50 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                مباشر
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              متابعة حالة المطارات، فارق التوقيت، وأحدث تحذيرات التنقل لوجهة {plan.destination}.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchLiveAlerts}
            disabled={loading}
            className="p-2 rounded-xl bg-[#1a1a1a] hover:bg-[#252525] text-neutral-300 border border-neutral-800 hover:border-[#d4af37]/40 transition-colors cursor-pointer"
            title="تحديث البيانات المباشرة"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#d4af37]' : ''}`} />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-[#1a1a1a] hover:bg-[#252525] text-neutral-300 border border-neutral-800 transition-colors cursor-pointer"
            title={isExpanded ? 'تصغير اللوحة' : 'توسيع اللوحة'}
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* 1. Timezone and Clocks */}
        <div className="bg-[#161616] border border-neutral-800/80 rounded-xl p-3 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-neutral-400">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3 h-3 text-[#d4af37]" />
              التوقيت المحلي
            </span>
            <span className="text-[10px] text-[#d4af37] font-bold">{metrics.timezoneOffset || 'فارق الساعات'}</span>
          </div>
          <div className="flex items-center justify-between gap-1 pt-0.5">
            <div>
              <span className="text-[10px] text-neutral-500 block">الوجهة ({plan.destination}):</span>
              <span className="text-xs font-mono font-bold text-white">{destTime || '--:--'}</span>
            </div>
            <div className="text-left">
              <span className="text-[10px] text-neutral-500 block">مكة/الرياض:</span>
              <span className="text-xs font-mono text-neutral-400">{currentTime || '--:--'}</span>
            </div>
          </div>
        </div>

        {/* 2. Airport Status */}
        <div className="bg-[#161616] border border-neutral-800/80 rounded-xl p-3 space-y-1">
          <div className="flex items-center gap-1 text-[11px] text-neutral-400 font-medium">
            <Plane className="w-3 h-3 text-sky-400" />
            <span>حالة المطار والطيران</span>
          </div>
          <p className="text-xs font-bold text-sky-300 leading-tight pt-0.5">
            {metrics.airportStatus || 'عمليات اعتيادية'}
          </p>
        </div>

        {/* 3. Emergency Number */}
        <div className="bg-[#161616] border border-neutral-800/80 rounded-xl p-3 space-y-1">
          <div className="flex items-center gap-1 text-[11px] text-neutral-400 font-medium">
            <PhoneCall className="w-3 h-3 text-rose-400" />
            <span>رقم الطوارئ الموحد</span>
          </div>
          <p className="text-xs font-mono font-bold text-rose-300 pt-0.5">
            {metrics.localEmergencyNumber || '112 / 911'}
          </p>
        </div>

        {/* 4. Payment Methods */}
        <div className="bg-[#161616] border border-neutral-800/80 rounded-xl p-3 space-y-1">
          <div className="flex items-center gap-1 text-[11px] text-neutral-400 font-medium">
            <CreditCard className="w-3 h-3 text-emerald-400" />
            <span>وسيلة الدفع الموصى بها</span>
          </div>
          <p className="text-[11px] font-semibold text-emerald-300 leading-tight pt-0.5 truncate" title={metrics.bestPaymentMethod}>
            {metrics.bestPaymentMethod || 'Apple Pay والبطاقات'}
          </p>
        </div>
      </div>

      {/* Collapsible Alerts Feed */}
      {isExpanded && (
        <div className="space-y-2.5 pt-1">
          {loading && alerts.length === 0 ? (
            <div className="p-4 text-center text-xs text-neutral-400">
              <RefreshCw className="w-4 h-4 animate-spin text-[#d4af37] mx-auto mb-1" />
              جاري فحص وتحديث تنبيهات الطيران والتنقل...
            </div>
          ) : (
            alerts.map((alert) => {
              const isHigh = alert.severity === 'high';
              const isMedium = alert.severity === 'medium';
              const borderClass = isHigh
                ? 'border-rose-500/40 bg-rose-950/20'
                : isMedium
                ? 'border-amber-500/40 bg-amber-950/20'
                : 'border-blue-500/30 bg-[#161616]';

              const badgeColor = isHigh
                ? 'text-rose-400 bg-rose-950/40 border-rose-800/50'
                : isMedium
                ? 'text-amber-400 bg-amber-950/40 border-amber-800/50'
                : 'text-sky-400 bg-sky-950/40 border-sky-800/50';

              return (
                <div
                  key={alert.id}
                  className={`border rounded-xl p-3 flex flex-col sm:flex-row sm:items-start justify-between gap-3 transition-all ${borderClass}`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badgeColor}`}>
                        {alert.type === 'flight' ? '✈️ رحلات وطيران' : alert.type === 'traffic' ? '🚗 تنقل ومواصلات' : 'ℹ️ تنبيه إرشادي'}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-white">
                        {alert.title}
                      </h4>
                      <span className="text-[10px] text-neutral-500 font-mono">({alert.affectedLocation})</span>
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed">
                      {alert.description}
                    </p>

                    {alert.suggestedAction && (
                      <div className="text-[11px] text-[#e5c158] flex items-center gap-1.5 pt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37] flex-shrink-0" />
                        <span><strong>الإجراء الموصى به:</strong> {alert.suggestedAction}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

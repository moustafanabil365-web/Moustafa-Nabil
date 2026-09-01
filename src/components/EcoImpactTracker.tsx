import React, { useMemo } from 'react';
import { 
  Leaf, Trees, Train, Plane, Car, Sparkles, Award, 
  ArrowDownRight, CheckCircle, ShieldCheck, Zap, Info
} from 'lucide-react';
import { GeneratedPlan, EcoImpactCalculation } from '../types';

interface EcoImpactTrackerProps {
  plan: GeneratedPlan;
  onOpenChat?: (prompt?: string) => void;
}

export const EcoImpactTracker: React.FC<EcoImpactTrackerProps> = ({
  plan,
  onOpenChat,
}) => {
  const isMultiCity = plan.constraints.isMultiCity;
  const transitMode = plan.constraints.preferredTransit;
  const duration = plan.durationDays || 5;

  const ecoData: EcoImpactCalculation = useMemo(() => {
    if (plan.ecoImpact) return plan.ecoImpact;

    // Estimate based on duration, transit mode, multi-city
    let transitKg = 80;
    if (transitMode === 'high_speed_train') {
      transitKg = 22;
    } else if (transitMode === 'domestic_flight') {
      transitKg = 185;
    } else if (transitMode === 'rental_car') {
      transitKg = 95;
    } else if (transitMode === 'bus_coach') {
      transitKg = 35;
    }

    const hotelKg = duration * 16; // avg ~16kg CO2 per hotel room night
    const activityKg = duration * 8; // avg sightseeing & local transfers
    const foodKg = duration * 6;

    const totalCarbonKg = transitKg + hotelKg + activityKg + foodKg;
    const carbonPerDayKg = Math.round(totalCarbonKg / duration);

    let ecoGrade: EcoImpactCalculation['ecoGrade'] = 'A';
    let gradeLabel = 'خطة سفر بيئية مستدامة بدرجة عالية';

    if (totalCarbonKg < 120) {
      ecoGrade = 'A+';
      gradeLabel = 'أداء بيئي استثنائي منخفض الانبعاثات';
    } else if (totalCarbonKg < 200) {
      ecoGrade = 'A';
      gradeLabel = 'خطة مستدامة ومتوازنة بيئياً';
    } else if (totalCarbonKg < 350) {
      ecoGrade = 'B';
      gradeLabel = 'مستوى انبعاثات متوسط ضمن المعايير';
    } else {
      ecoGrade = 'C';
      gradeLabel = 'انبعاثات مرتفعة، ينصح بالبدائل الخضراء';
    }

    const treesToOffset = Math.max(1, Math.ceil(totalCarbonKg / 48)); // 1 tree offsets ~48kg CO2 per year

    const alternatives = [
      {
        title: 'اعتماد شبكات القطارات والمترو فائقة السرعة',
        description: 'استبدال رحلات الطيران القصيرة أو السيارات بالقطارات السريعة يقلل انبعاثات التنقل بنسبة تصل إلى 78%.',
        co2SavedKg: 95,
        ecoTip: 'احصل على تذاكر القطار الأسبوعية للمرونة والتوفير',
      },
      {
        title: 'استخدام الدراجات الهوائية والجولات الراجلة',
        description: 'استكشاف وسط المدينة التاريخي سيراً على الأقدام أو بالدراجات يمنح تجربة سياحية أصيلة وصفر انبعاثات.',
        co2SavedKg: 18,
        ecoTip: 'تطبيقات تأجير الدراجات متوفرة في معظم المدن',
      },
      {
        title: 'اختيار أماكن الإقامة الحاصلة على شهادة الاستدامة (Green Key / LEED)',
        description: 'الفنادق البيئية تتبع سياسات تقليل هدر المياه والطاقة وتعتمد الطاقة المتجددة.',
        co2SavedKg: 32,
        ecoTip: 'ابحث عن وسم الفنادق الصديقة للبيئة عند الحجز',
      },
    ];

    return {
      totalCarbonKg,
      carbonPerDayKg,
      ecoGrade,
      gradeLabel,
      breakdown: {
        transit: transitKg,
        accommodation: hotelKg,
        activities: activityKg,
        food: foodKg,
      },
      sustainableAlternatives: alternatives,
      treesToOffset,
      calculatedAt: new Date().toISOString(),
    };
  }, [plan, transitMode, duration]);

  const handleAskEcoAlternative = (alt: { title: string; description: string }) => {
    if (onOpenChat) {
      onOpenChat(
        `أود تطبيق البديل الصديق للبيئة: "${alt.title}" (${alt.description}) في خطة رحلتي. ما هي الخيارات المتاحة في ${plan.destination}؟`
      );
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#101912] to-[#0f1410] border border-emerald-500/30 rounded-2xl p-5 sm:p-6 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-900/40 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white">
                المؤشر الصديق للبيئة وحساب البصمة الكربونية (Eco-Impact Tracker)
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                سفر مستدام
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              حساب البصمة الكربونية التقديرية لوسائل التنقل والإقامة مع اقتراح بدائل خضراء ذكية.
            </p>
          </div>
        </div>

        {/* Eco Grade Stamp */}
        <div className="flex items-center gap-2 bg-[#142217] border border-emerald-500/40 px-3.5 py-1.5 rounded-xl self-start sm:self-auto">
          <Award className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-[10px] text-emerald-300 font-bold">تصنيف الاستدامة</div>
            <div className="text-sm font-black text-emerald-400 font-mono">
              درجة ({ecoData.ecoGrade})
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10">
        {/* Total Carbon */}
        <div className="bg-[#121c14] border border-emerald-900/50 rounded-xl p-4">
          <span className="text-xs text-neutral-400 block mb-1">إجمالي الانبعاثات التقديرية</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">
              {ecoData.totalCarbonKg}
            </span>
            <span className="text-xs text-emerald-400 font-bold font-mono">كجم CO₂e</span>
          </div>
          <span className="text-[11px] text-neutral-400 block mt-1">
            معدل {ecoData.carbonPerDayKg} كجم CO₂e / يوم
          </span>
        </div>

        {/* Tree Offset */}
        <div className="bg-[#121c14] border border-emerald-900/50 rounded-xl p-4">
          <span className="text-xs text-neutral-400 block mb-1">التعويض البيئي (Carbon Offset)</span>
          <div className="flex items-center gap-2">
            <Trees className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div className="text-xl sm:text-2xl font-black text-emerald-300 font-mono">
              {ecoData.treesToOffset} <span className="text-xs text-neutral-300 font-sans">أشجار</span>
            </div>
          </div>
          <span className="text-[11px] text-neutral-400 block mt-1">
            كافية لامتصاص كامل انبعاثات هذه الرحلة
          </span>
        </div>

        {/* Status Verdict */}
        <div className="bg-[#121c14] border border-emerald-900/50 rounded-xl p-4 flex flex-col justify-between">
          <span className="text-xs text-neutral-400 block mb-1">التقييم البيئي العام</span>
          <span className="text-xs font-bold text-emerald-300 leading-snug">
            {ecoData.gradeLabel}
          </span>
          <span className="text-[10px] text-emerald-400/80 mt-1">
            🌿 يراعي المسارات الأقصر ووسائل النقل الفعالة
          </span>
        </div>
      </div>

      {/* Breakdown Bar */}
      <div className="bg-[#121c14] border border-emerald-900/50 rounded-xl p-4 space-y-3 relative z-10">
        <span className="text-xs font-bold text-neutral-300 block">
          توزيع البصمة الكربونية حسب الأنشطة (كجم CO₂e):
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="bg-[#0e1710] p-2.5 rounded-lg border border-emerald-900/30">
            <span className="text-neutral-400 text-[11px] block">🚕 التنقل والمواصلات</span>
            <strong className="text-white font-mono font-bold text-sm">{ecoData.breakdown.transit} كجم</strong>
          </div>
          <div className="bg-[#0e1710] p-2.5 rounded-lg border border-emerald-900/30">
            <span className="text-neutral-400 text-[11px] block">🏨 الإقامة والفنادق</span>
            <strong className="text-white font-mono font-bold text-sm">{ecoData.breakdown.accommodation} كجم</strong>
          </div>
          <div className="bg-[#0e1710] p-2.5 rounded-lg border border-emerald-900/30">
            <span className="text-neutral-400 text-[11px] block">🎟️ المعالم والجولات</span>
            <strong className="text-white font-mono font-bold text-sm">{ecoData.breakdown.activities} كجم</strong>
          </div>
          <div className="bg-[#0e1710] p-2.5 rounded-lg border border-emerald-900/30">
            <span className="text-neutral-400 text-[11px] block">🍽️ الطعام والوجبات</span>
            <strong className="text-white font-mono font-bold text-sm">{ecoData.breakdown.food} كجم</strong>
          </div>
        </div>
      </div>

      {/* Sustainable Alternatives Carousel / Cards */}
      <div className="space-y-3 relative z-10">
        <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-emerald-400" />
          اقتراحات وبدائل لتقليل الانبعاثات وتحقيق سفر أخضر:
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {ecoData.sustainableAlternatives.map((alt, idx) => (
            <div
              key={idx}
              className="bg-[#121c14] hover:bg-[#162419] border border-emerald-900/60 rounded-xl p-3.5 flex flex-col justify-between space-y-3 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <strong className="text-xs text-white leading-snug">{alt.title}</strong>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex-shrink-0">
                    -{alt.co2SavedKg} كجم CO₂
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">{alt.description}</p>
              </div>

              <div className="pt-2 border-t border-emerald-900/40 flex items-center justify-between gap-2">
                <span className="text-[10px] text-emerald-400/90 truncate">💡 {alt.ecoTip}</span>
                <button
                  onClick={() => handleAskEcoAlternative(alt)}
                  className="text-[11px] font-bold px-2 py-1 rounded bg-emerald-950 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/30 cursor-pointer flex-shrink-0"
                >
                  استشر AI
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

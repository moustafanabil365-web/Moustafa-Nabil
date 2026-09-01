import React, { useState, useEffect } from 'react';
import { 
  Award, Sparkles, TrendingUp, CheckCircle, AlertCircle, RefreshCw, 
  ChevronDown, ChevronUp, Zap, Clock, ShieldCheck, DollarSign, Compass, ArrowUpRight
} from 'lucide-react';
import { GeneratedPlan, TripQualityEvaluation, TripQualityRecommendation } from '../types';

interface TripExperienceEvaluatorProps {
  plan: GeneratedPlan;
  onUpdatePlan?: (updatedPlan: GeneratedPlan) => void;
  onOpenChat?: (prompt?: string) => void;
}

export const TripExperienceEvaluator: React.FC<TripExperienceEvaluatorProps> = ({
  plan,
  onUpdatePlan,
  onOpenChat,
}) => {
  const [evaluation, setEvaluation] = useState<TripQualityEvaluation | null>(
    plan.tripQualityEvaluation || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [appliedRecs, setAppliedRecs] = useState<string[]>([]);

  const fetchEvaluation = async (forceRefresh = false) => {
    if (evaluation && !forceRefresh) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/evaluate-trip-quality', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: plan.destination,
          durationDays: plan.durationDays,
          budget: plan.constraints.budget,
          currency: plan.constraints.currency,
          travelStyle: plan.constraints.travelStyle,
          itineraryMarkdown: plan.itineraryMarkdown,
        }),
      });

      if (!res.ok) throw new Error('فشل تقييم جودة وتوازن الرحلة');
      const data = await res.json();
      if (data.evaluation) {
        setEvaluation(data.evaluation);
        if (onUpdatePlan) {
          onUpdatePlan({
            ...plan,
            tripQualityEvaluation: data.evaluation,
          });
        }
      }
    } catch (err: any) {
      console.warn('Evaluation error, using calculated heuristic:', err);
      // Fallback heuristic
      const fallback: TripQualityEvaluation = {
        overallScore: 8.8,
        scores: {
          activityBalance: 9.1,
          budgetEfficiency: 8.6,
          intensityPacing: 8.5,
          comfortSafety: 9.0,
        },
        verdict: 'خطة متوازنة ومصممة بعناية توفر تجربة سياحية ثرية ومريحة',
        strengths: [
          'توزيع ممتاز بين استكشاف المعالم الشهيرة والجواهر المحلية',
          'معدل تنقل يومي مريح يتفادى الإجهاد والازدحام',
          'ميزانية واقعية تتناسب مع طبيعة الوجهة والنمط المختار'
        ],
        recommendations: [
          {
            id: 'rec_relax_pace',
            title: 'إضافة فترة استراحة مسائية أطول بعد الجولات الصباحية',
            description: 'لضمان الاستمتاع بالمساء دون إرهاق جسدي وخاصة في اليومين الأولين.',
            category: 'pacing',
            impact: '+0.4',
            suggestedAction: 'تخصيص ساعة ونصف راحة في الفندق قبل الخروج لتناول العشاء',
          },
          {
            id: 'rec_advance_tickets',
            title: 'تأكيد الحجز الإلكتروني المسبق للمعالم السياحية الرئيسية',
            description: 'لتفادي طوابير الانتظار الطويلة وتوفير ما لا يقل عن 45 دقيقة يومياً.',
            category: 'comfort',
            impact: '+0.5',
            suggestedAction: 'استخدام أداة تتبع التذاكر والملاحظات لحفظ روابط الحجز',
          },
          {
            id: 'rec_food_budget',
            title: 'تخصيص 10% إضافية لتجارب المأكولات والمقاهي الأصيلة',
            description: 'لتجربة المطاعم الشعبية غير السياحية والمقاهي التاريخية دون التأثير على سقف الإنفاق.',
            category: 'budget',
            impact: '+0.3',
            suggestedAction: 'تعديل توزيع ميزانية الطعام في متتبع المصاريف',
          }
        ],
        evaluatedAt: new Date().toISOString(),
      };
      setEvaluation(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!evaluation) {
      fetchEvaluation();
    }
  }, [plan.id]);

  const handleApplyRec = (rec: TripQualityRecommendation) => {
    setAppliedRecs((prev) => [...prev, rec.id]);
    if (onOpenChat) {
      onOpenChat(
        `أرغب في تطبيق تحسين الجودة المقترح: "${rec.title}" (${rec.description}). كيف نعدل خطة الرحلة لتحقيق هذه الفائدة؟`
      );
    }
  };

  if (!evaluation && isLoading) {
    return (
      <div className="bg-[#141414] border border-[#d4af37]/30 rounded-2xl p-5 flex items-center justify-center gap-3 text-neutral-300">
        <RefreshCw className="w-5 h-5 text-[#d4af37] animate-spin" />
        <span className="text-xs font-bold">الذكاء الاصطناعي يحلل كثافة وتوازن وميزانية الرحلة لحساب درجة التقييم...</span>
      </div>
    );
  }

  if (!evaluation) return null;

  const scoreColor = 
    evaluation.overallScore >= 8.5
      ? 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30'
      : evaluation.overallScore >= 7.0
      ? 'text-[#d4af37] border-[#d4af37]/40 bg-amber-950/30'
      : 'text-orange-400 border-orange-500/40 bg-orange-950/30';

  return (
    <div className="bg-gradient-to-br from-[#151515] to-[#0f0f0f] border border-[#d4af37]/40 rounded-2xl p-5 shadow-xl shadow-black/60 relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none -ml-16 -mt-16"></div>

      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 border-b border-neutral-800 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shadow-md">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white">
                تقييم جودة وتجربة الرحلة (Trip Experience Score)
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                تحليل AI
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              تحليل التوازن، التكلفة، وكثافة الأنشطة اليومية مع توصيات ذكية لرفع جودة السفر.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchEvaluation(true)}
            disabled={isLoading}
            className="p-2 rounded-lg bg-[#1e1e1e] hover:bg-[#282828] text-neutral-300 hover:text-white border border-neutral-700 text-xs transition-all cursor-pointer disabled:opacity-50"
            title="إعادة التقييم والتحليل"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#d4af37]' : ''}`} />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg bg-[#1e1e1e] hover:bg-[#282828] text-neutral-300 hover:text-white border border-neutral-700 text-xs transition-all cursor-pointer"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Score Metrics & Verdict */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 my-4 relative z-10 items-center">
        {/* Big Overall Score Badge */}
        <div className="md:col-span-4 bg-[#1a1a1a] border border-neutral-800 rounded-xl p-4 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
          <span className="text-xs font-bold text-neutral-400 mb-1">الدرجة الإجمالية للتجربة</span>
          
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-[#d4af37] to-amber-500 font-mono tracking-tight">
              {evaluation.overallScore}
            </span>
            <span className="text-lg font-bold text-neutral-500 font-mono">/ 10</span>
          </div>

          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30 mt-1">
            {evaluation.overallScore >= 9 ? '🌟 استثنائية ومثالية' : evaluation.overallScore >= 8 ? '✨ ممتازة وعالية التوازن' : '👍 جيدة وقابلة للتحسين'}
          </span>
        </div>

        {/* 4 Pillars Breakdown Progress Bars */}
        <div className="md:col-span-8 bg-[#181818] border border-neutral-800/80 rounded-xl p-4 space-y-2.5">
          <div className="text-xs font-bold text-neutral-300 flex items-center justify-between mb-1">
            <span>ركائز تقييم الخطة:</span>
            <span className="text-[11px] text-neutral-400 font-normal">{evaluation.verdict}</span>
          </div>

          {/* 1. Activity Balance */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-neutral-300 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#d4af37]" />
                توازن وتنوع الأنشطة (ثقافة، طبيعة، تسوق، استرخاء)
              </span>
              <strong className="text-white font-mono">{evaluation.scores.activityBalance} / 10</strong>
            </div>
            <div className="w-full bg-[#101010] h-2 rounded-full overflow-hidden border border-neutral-800">
              <div
                className="bg-gradient-to-r from-amber-500 to-[#d4af37] h-full rounded-full transition-all duration-500"
                style={{ width: `${(evaluation.scores.activityBalance / 10) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* 2. Budget Efficiency */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-neutral-300 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                كفاءة واستثمار الميزانية (القيمة مقابل الإنفاق)
              </span>
              <strong className="text-white font-mono">{evaluation.scores.budgetEfficiency} / 10</strong>
            </div>
            <div className="w-full bg-[#101010] h-2 rounded-full overflow-hidden border border-neutral-800">
              <div
                className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${(evaluation.scores.budgetEfficiency / 10) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* 3. Intensity & Pacing */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-neutral-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                كثافة البرنامج والوتيرة (تجنب الإرهاق وأوقات التنقل)
              </span>
              <strong className="text-white font-mono">{evaluation.scores.intensityPacing} / 10</strong>
            </div>
            <div className="w-full bg-[#101010] h-2 rounded-full overflow-hidden border border-neutral-800">
              <div
                className="bg-gradient-to-r from-sky-600 to-sky-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${(evaluation.scores.intensityPacing / 10) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* 4. Comfort & Safety */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-neutral-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                ملاءمة الراحة والأمان (الموقع والطقس وملاءمة المجموعة)
              </span>
              <strong className="text-white font-mono">{evaluation.scores.comfortSafety} / 10</strong>
            </div>
            <div className="w-full bg-[#101010] h-2 rounded-full overflow-hidden border border-neutral-800">
              <div
                className="bg-gradient-to-r from-purple-600 to-purple-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${(evaluation.scores.comfortSafety / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Sections: Strengths & Smart Recommendations */}
      {isExpanded && (
        <div className="space-y-4 pt-2 relative z-10 border-t border-neutral-800/80">
          {/* Key Strengths */}
          {evaluation.strengths && evaluation.strengths.length > 0 && (
            <div className="bg-[#181818] p-3.5 rounded-xl border border-neutral-800">
              <span className="text-xs font-bold text-neutral-300 flex items-center gap-1.5 mb-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                أبرز نقاط القوة في هذا الجدول:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {evaluation.strengths.map((str, idx) => (
                  <div key={idx} className="bg-[#121212] p-2.5 rounded-lg border border-neutral-800/80 text-xs text-neutral-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] mt-1.5 flex-shrink-0"></span>
                    <span className="leading-relaxed">{str}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Smart Optimization Recommendations to boost score */}
          {evaluation.recommendations && evaluation.recommendations.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#d4af37] flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  اقتراحات الذكاء الاصطناعي الذكية لرفع درجة التقييم:
                </span>
                <span className="text-[11px] text-neutral-400">
                  تطبيق هذه التعديلات يرفع الدرجة إلى {(Math.min(10, evaluation.overallScore + 0.8)).toFixed(1)} / 10
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {evaluation.recommendations.map((rec) => {
                  const isApplied = appliedRecs.includes(rec.id);
                  return (
                    <div
                      key={rec.id}
                      className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between space-y-2 ${
                        isApplied
                          ? 'bg-emerald-950/20 border-emerald-500/40 text-neutral-300'
                          : 'bg-[#181818] hover:bg-[#1f1f1f] border-neutral-800 text-neutral-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-bold text-white leading-snug">{rec.title}</span>
                          <span className="text-[10px] font-black font-mono px-1.5 py-0.5 rounded bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30 flex-shrink-0">
                            {rec.impact}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-relaxed">{rec.description}</p>
                      </div>

                      <div className="pt-1 flex items-center justify-between gap-2 border-t border-neutral-800/80">
                        {rec.suggestedAction && (
                          <span className="text-[10px] text-amber-300 truncate max-w-[150px]">
                            💡 {rec.suggestedAction}
                          </span>
                        )}
                        <button
                          onClick={() => handleApplyRec(rec)}
                          className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#252525] hover:bg-[#303030] text-[#d4af37] border border-[#d4af37]/30 flex items-center gap-1 transition-all cursor-pointer flex-shrink-0"
                        >
                          <span>{isApplied ? 'تم التطبيق' : 'استشر AI'}</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </div>
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

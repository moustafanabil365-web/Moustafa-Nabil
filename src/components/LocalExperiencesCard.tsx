import React, { useState } from 'react';
import { Gem, Sparkles, MapPin, Clock, DollarSign, Lightbulb, Compass, Plus, Check } from 'lucide-react';
import { LocalExperience } from '../types';

interface LocalExperiencesProps {
  experiences: LocalExperience[];
  destination: string;
  onAskAboutExperience?: (experience: LocalExperience) => void;
}

export const LocalExperiencesCard: React.FC<LocalExperiencesProps> = ({
  experiences,
  destination,
  onAskAboutExperience,
}) => {
  const [selectedExp, setSelectedExp] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const handleToggleAdd = (id: string) => {
    setAddedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!experiences || experiences.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#121212] border border-[#d4af37]/40 rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
            <Gem className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white">
                تجارب محلية أصيلة وغير سياحية (Hidden Local Gems)
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30 font-bold">
                حصري للمسافر الذكي
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              أنشطة ومطاعم وورش عمل يرتادها أهالي {destination} بعيداً عن صخب السياحة التقليدية.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of 3 Experiences */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {experiences.map((exp) => {
          const isAdded = addedIds.has(exp.id);
          const isExpanded = selectedExp === exp.id;

          return (
            <div
              key={exp.id}
              className={`bg-[#181818] rounded-xl border transition-all flex flex-col justify-between p-4.5 ${
                isAdded
                  ? 'border-[#d4af37] ring-1 ring-[#d4af37]/40'
                  : 'border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div className="space-y-3">
                {/* Category & Cost Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#222222] text-[#d4af37] border border-[#d4af37]/30 flex items-center gap-1.5">
                    <Compass className="w-3 h-3" />
                    {exp.categoryLabel || 'تجربة محلية'}
                  </span>
                  <span className="text-xs text-neutral-300 font-semibold flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-[#d4af37]" />
                    {exp.estimatedCost}
                  </span>
                </div>

                {/* Title & Location */}
                <div>
                  <h4 className="text-sm font-bold text-white leading-snug">{exp.title}</h4>
                  <div className="flex items-center gap-3 text-[11px] text-neutral-400 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-neutral-500" />
                      {exp.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-neutral-500" />
                      {exp.duration}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-neutral-300 leading-relaxed line-clamp-3">
                  {exp.description}
                </p>

                {/* Why Non-Touristy Box */}
                <div className="bg-[#121212] p-2.5 rounded-lg border border-neutral-800 text-[11px] space-y-1.5">
                  <div className="text-amber-400/90 font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>سر أصالة المكان:</span>
                  </div>
                  <p className="text-neutral-400 leading-normal">
                    {exp.whyNonTouristy}
                  </p>
                </div>

                {/* Insider tip */}
                {exp.insiderTip && (
                  <div className="text-[11px] text-neutral-400 flex items-start gap-1.5 bg-[#141414] p-2 rounded border border-neutral-850">
                    <Lightbulb className="w-3.5 h-3.5 text-[#d4af37] flex-shrink-0 mt-0.5" />
                    <p className="leading-snug"><strong className="text-neutral-300">نصيحة ذهبية:</strong> {exp.insiderTip}</p>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 mt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleAdd(exp.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isAdded
                      ? 'bg-[#d4af37] text-black shadow-md'
                      : 'bg-[#222222] hover:bg-[#2c2c2c] text-neutral-200 border border-neutral-700'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>مدرجة ضمن مفضلاتي</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>تفضيل التجربة</span>
                    </>
                  )}
                </button>

                {onAskAboutExperience && (
                  <button
                    type="button"
                    onClick={() => onAskAboutExperience(exp)}
                    className="p-2 rounded-lg bg-[#222222] hover:bg-[#2c2c2c] text-[#d4af37] border border-neutral-700 hover:border-[#d4af37]/50 transition-all text-xs font-semibold cursor-pointer"
                    title="اسأل المستشار عن كيفية دمج هذه التجربة بجدولك"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import { X, Trash2, Calendar, MapPin, ArrowRight, Luggage, Clock } from 'lucide-react';
import { GeneratedPlan } from '../types';

interface SavedTripsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedPlans: GeneratedPlan[];
  onSelectPlan: (plan: GeneratedPlan) => void;
  onDeletePlan: (id: string) => void;
}

export const SavedTripsDrawer: React.FC<SavedTripsDrawerProps> = ({
  isOpen,
  onClose,
  savedPlans,
  onSelectPlan,
  onDeletePlan,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-start bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#111111] border-l border-neutral-800 h-full flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#0f0f0f] border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <Luggage className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base">الرحلات المحفوظة</h3>
              <p className="text-xs text-neutral-400">{savedPlans.length} خطط محفوظة محلياً</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#1a1a1a] hover:bg-[#262626] text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedPlans.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#1a1a1a] border border-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
                <Calendar className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-neutral-300">لا توجد رحلات محفوظة حتى الآن</p>
              <p className="text-xs text-neutral-500">
                عند توليد أي خطة رحلة جديدة، سيتم حفظها هنا تلقائياً لسرعة الرجوع إليها.
              </p>
            </div>
          ) : (
            savedPlans.map((plan) => (
              <div
                key={plan.id}
                className="p-4 rounded-xl bg-[#181818] border border-neutral-800 hover:border-[#d4af37]/50 transition-all space-y-3 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                      <h4 className="font-bold text-neutral-100 text-sm">{plan.destination}</h4>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-400">
                      <span>{plan.durationDays} أيام</span>
                      <span>•</span>
                      <span>{plan.constraints.budget} {plan.constraints.currency}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeletePlan(plan.id)}
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-[#262626] transition-colors cursor-pointer"
                    title="حذف الخطة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-[11px]">
                  <span className="text-neutral-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(plan.generatedAt).toLocaleDateString('ar-SA')}
                  </span>
                  <button
                    onClick={() => {
                      onSelectPlan(plan);
                      onClose();
                    }}
                    className="text-[#d4af37] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>عرض الخطة</span>
                    <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};


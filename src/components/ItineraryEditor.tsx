import React, { useState } from 'react';
import { 
  Edit3, Save, RotateCcw, Check, Sparkles, Plus, Trash2, 
  Clock, StickyNote, Calendar, Eye, FileText, AlertCircle, 
  MapPin, CheckCircle2, X
} from 'lucide-react';
import Markdown from 'react-markdown';
import { GeneratedPlan } from '../types';

interface ItineraryEditorProps {
  plan: GeneratedPlan;
  onSavePlan: (updatedPlan: GeneratedPlan) => void;
  onClose?: () => void;
}

export const ItineraryEditor: React.FC<ItineraryEditorProps> = ({
  plan,
  onSavePlan,
  onClose,
}) => {
  const [activeMode, setActiveMode] = useState<'visual_notes' | 'raw_markdown'>('visual_notes');
  const [editedMarkdown, setEditedMarkdown] = useState(plan.itineraryMarkdown);
  const [customNotes, setCustomNotes] = useState<Record<number, string>>(plan.customNotes || {});
  const [newNoteDay, setNewNoteDay] = useState<number>(1);
  const [newNoteText, setNewNoteText] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAddNote = () => {
    if (!newNoteText.trim()) return;
    const updated = {
      ...customNotes,
      [newNoteDay]: newNoteText.trim(),
    };
    setCustomNotes(updated);
    setNewNoteText('');
  };

  const handleRemoveNote = (dayIdx: number) => {
    const updated = { ...customNotes };
    delete updated[dayIdx];
    setCustomNotes(updated);
  };

  const handleSave = () => {
    // If notes exist, we can also inject/sync them into the updated plan object
    const updatedPlan: GeneratedPlan = {
      ...plan,
      itineraryMarkdown: editedMarkdown,
      customNotes,
      isUserModified: true,
    };

    // Save to local storage for persistence
    try {
      localStorage.setItem(`smarttravel_plan_${plan.id}`, JSON.stringify(updatedPlan));
      localStorage.setItem('smarttravel_last_active_plan', JSON.stringify(updatedPlan));
    } catch (err) {
      console.error('Failed saving plan to localStorage:', err);
    }

    onSavePlan(updatedPlan);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      if (onClose) onClose();
    }, 1500);
  };

  const handleReset = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في التراجع عن جميع التعديلات والعودة للخطة الأصلية؟')) {
      setEditedMarkdown(plan.itineraryMarkdown);
      setCustomNotes({});
      const restoredPlan: GeneratedPlan = {
        ...plan,
        customNotes: {},
        isUserModified: false,
      };
      onSavePlan(restoredPlan);
    }
  };

  return (
    <div className="bg-[#121212] border border-[#d4af37]/40 rounded-2xl p-5 sm:p-7 shadow-2xl shadow-black space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-black text-white">
                محرر الجدول والملاحظات المباشر
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30">
                حفظ محلي فوري
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              قم بتعديل المواعيد، إضافة ملاحظاتك الخاصة لكل يوم، أو تحرير نص الخطة بالكامل دون إعادة التوليد.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="إغلاق المحرر"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Editor Sub-Tabs */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 p-1 bg-[#181818] border border-neutral-800 rounded-xl">
          <button
            onClick={() => setActiveMode('visual_notes')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'visual_notes'
                ? 'bg-[#d4af37] text-black shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <StickyNote className="w-3.5 h-3.5" />
            <span>ملاحظات وتعديلات الأيام</span>
          </button>

          <button
            onClick={() => setActiveMode('raw_markdown')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'raw_markdown'
                ? 'bg-[#d4af37] text-black shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>تحرير نص الخطة بالكامل (Markdown)</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] text-neutral-400 hover:text-rose-400 border border-neutral-800 transition-colors cursor-pointer"
            title="استعادة النص الأصلي"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">استعادة الأصل</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold px-5 py-2 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-black shadow-lg shadow-[#d4af37]/20 transition-all cursor-pointer"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-black" />
                <span>تم الحفظ محلياً!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>حفظ التعديلات محلياً</span>
              </>
            )}
          </button>
        </div>
      </div>

      {activeMode === 'visual_notes' ? (
        <div className="space-y-6">
          {/* Add New Day Note Box */}
          <div className="bg-[#181818] border border-neutral-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#d4af37]">
              <Plus className="w-4 h-4" />
              <span>إضافة ملاحظة أو تعديل خاص لليوم:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-[11px] text-neutral-400 mb-1">اختر اليوم:</label>
                <select
                  value={newNoteDay}
                  onChange={(e) => setNewNoteDay(Number(e.target.value))}
                  className="w-full bg-[#111111] border border-neutral-700 rounded-lg p-2 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                >
                  {Array.from({ length: plan.durationDays || 5 }).map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      اليوم {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[11px] text-neutral-400 mb-1">نص الملاحظة أو التعديل (مثل: حجز مطعم في تمام 8:00 م، أو استبدال المتحف بالسوق):</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                    placeholder="اكتب ملاحظتك الخاصة هنا..."
                    className="flex-1 bg-[#111111] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-[#d4af37] focus:outline-none"
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={!newNoteText.trim()}
                    className="px-4 py-2 rounded-lg bg-[#d4af37] disabled:opacity-40 text-black font-bold text-xs cursor-pointer"
                  >
                    إضافة
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Active Custom Notes List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-neutral-400">
              الملاحظات والتعديلات المحفوظة محلياً:
            </h4>

            {Object.keys(customNotes).length === 0 ? (
              <div className="p-6 text-center bg-[#161616] border border-dashed border-neutral-800 rounded-xl text-xs text-neutral-500">
                لا توجد ملاحظات مخصصة بعد. أضف ملاحظاتك أو مواعيدك الخاصة لكل يوم أعلاه وستظهر مباشرة في جدول رحلتك.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(customNotes).map(([dayKey, note]) => (
                  <div
                    key={dayKey}
                    className="bg-[#181818] border border-[#d4af37]/30 rounded-xl p-3.5 flex items-start justify-between gap-3 shadow-md"
                  >
                    <div className="space-y-1">
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40">
                        🗓️ ملاحظة اليوم {dayKey}
                      </span>
                      <p className="text-xs text-neutral-200 leading-relaxed font-medium">
                        {note}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveNote(Number(dayKey))}
                      className="p-1 rounded text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="حذف الملاحظة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Raw Markdown Live In-Place Editor */
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>محرر Markdown المباشر: يمكنك تعديل الأوقات والأنشطة والعناوين بحرية</span>
            <span className="font-mono text-[11px] text-neutral-500">
              {editedMarkdown.length} حرف
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Markdown Text Area */}
            <div>
              <label className="block text-[11px] text-neutral-400 mb-1.5 font-bold">
                نص الخطة (تعديل حر):
              </label>
              <textarea
                value={editedMarkdown}
                onChange={(e) => setEditedMarkdown(e.target.value)}
                rows={16}
                className="w-full bg-[#0a0a0a] border border-neutral-800 focus:border-[#d4af37] rounded-xl p-4 text-xs font-mono text-neutral-200 leading-relaxed focus:outline-none resize-y"
                placeholder="عدل نص الخطة هنا..."
              />
            </div>

            {/* Live Preview Pane */}
            <div className="hidden lg:block">
              <label className="block text-[11px] text-neutral-400 mb-1.5 font-bold">
                المعاينة المباشرة:
              </label>
              <div className="h-[365px] bg-[#0d0d0d] border border-neutral-800 rounded-xl p-4 overflow-y-auto markdown-body text-xs">
                <Markdown>{editedMarkdown}</Markdown>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Button Confirmation */}
      <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-3">
        <span className="text-[11px] text-neutral-500 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>يتم حفظ الخطة والتعديلات فوراً في متصفحك دون استهلاك رصيد توليد.</span>
        </span>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-black shadow-lg shadow-[#d4af37]/20 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>حفظ التعديلات الآن</span>
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  FileText, Bookmark, Ticket, Clock, Check, X, 
  Trash2, Plus, AlertCircle, Edit3, Calendar, Sparkles, Hash
} from 'lucide-react';
import { ActivityNote, GeneratedPlan } from '../types';

interface ActivityNotesModalProps {
  plan: GeneratedPlan;
  isOpen: boolean;
  onClose: () => void;
  onSaveNotes: (notes: Record<string, ActivityNote>) => void;
  initialDay?: number;
  initialActivityTitle?: string;
}

export const ActivityNotesModal: React.FC<ActivityNotesModalProps> = ({
  plan,
  isOpen,
  onClose,
  onSaveNotes,
  initialDay = 1,
  initialActivityTitle = '',
}) => {
  const [notes, setNotes] = useState<Record<string, ActivityNote>>(plan.activityNotes || {});
  const [selectedDay, setSelectedDay] = useState<number>(initialDay);
  const [activityTitle, setActivityTitle] = useState<string>(initialActivityTitle);
  const [bookingNumber, setBookingNumber] = useState<string>('');
  const [ticketRef, setTicketRef] = useState<string>('');
  const [noteText, setNoteText] = useState<string>('');
  const [savedFeedback, setSavedFeedback] = useState(false);

  React.useEffect(() => {
    if (initialDay) setSelectedDay(initialDay);
    if (initialActivityTitle) setActivityTitle(initialActivityTitle);
  }, [initialDay, initialActivityTitle]);

  if (!isOpen) return null;

  const handleAddOrUpdateNote = () => {
    if (!noteText.trim() && !bookingNumber.trim() && !ticketRef.trim()) return;

    const noteKey = `day-${selectedDay}-${Date.now().toString(36)}`;
    const newNote: ActivityNote = {
      id: noteKey,
      activityKey: noteKey,
      dayNumber: selectedDay,
      activityTitle: activityTitle.trim() || `نشاط اليوم ${selectedDay}`,
      noteText: noteText.trim(),
      bookingNumber: bookingNumber.trim(),
      ticketRef: ticketRef.trim(),
      createdAt: new Date().toLocaleDateString('ar-SA'),
    };

    const updated = {
      ...notes,
      [noteKey]: newNote,
    };

    setNotes(updated);
    onSaveNotes(updated);

    // Reset inputs
    setActivityTitle('');
    setBookingNumber('');
    setTicketRef('');
    setNoteText('');
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const handleDeleteNote = (key: string) => {
    const updated = { ...notes };
    delete updated[key];
    setNotes(updated);
    onSaveNotes(updated);
  };

  const notesList = Object.values(notes);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#121212] border border-[#d4af37]/40 rounded-2xl w-full max-w-2xl p-6 shadow-2xl shadow-black relative space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl bg-neutral-800/80 text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white">
                الملاحظات الشخصية وأرقام الحجوزات
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30">
                حفظ محلي فوري
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              أضف أرقام تذاكر الطيران، حجوزات الفنادق، أو تذكيرات خاصة لتظهر بجانب أنشطة الخطة.
            </p>
          </div>
        </div>

        {/* New Note Form */}
        <div className="bg-[#181818] border border-neutral-800 rounded-xl p-4 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#d4af37]">
            <Plus className="w-4 h-4" />
            <span>إضافة تذكير أو حجز جديد:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Day Selector */}
            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">اليوم:</label>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(Number(e.target.value))}
                className="w-full bg-[#111111] border border-neutral-700 rounded-lg p-2 text-xs text-white focus:border-[#d4af37] focus:outline-none"
              >
                {Array.from({ length: plan.durationDays || 5 }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    اليوم {i + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* Activity Name / Target */}
            <div className="sm:col-span-2">
              <label className="block text-[11px] text-neutral-400 mb-1">اسم النشاط أو المعلم (اختياري):</label>
              <input
                type="text"
                value={activityTitle}
                onChange={(e) => setActivityTitle(e.target.value)}
                placeholder="مثال: حجز فندق ريتز، أو تذكرة متحف اللوفر"
                className="w-full bg-[#111111] border border-neutral-700 rounded-lg p-2 text-xs text-white placeholder-neutral-500 focus:border-[#d4af37] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Booking Reference */}
            <div>
              <label className="block text-[11px] text-neutral-400 mb-1 flex items-center gap-1">
                <Hash className="w-3 h-3 text-[#d4af37]" />
                رقم الحجز / رمز التأكيد:
              </label>
              <input
                type="text"
                value={bookingNumber}
                onChange={(e) => setBookingNumber(e.target.value)}
                placeholder="مثال: BK-849202 أو PNR: ABC123"
                className="w-full bg-[#111111] border border-neutral-700 rounded-lg p-2 text-xs text-white placeholder-neutral-500 font-mono focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            {/* Ticket Ref / Barcode */}
            <div>
              <label className="block text-[11px] text-neutral-400 mb-1 flex items-center gap-1">
                <Ticket className="w-3 h-3 text-emerald-400" />
                رقم التذكرة أو وقت الدخول:
              </label>
              <input
                type="text"
                value={ticketRef}
                onChange={(e) => setTicketRef(e.target.value)}
                placeholder="مثال: دخول الساعة 4:30 م - بوابة رقم 3"
                className="w-full bg-[#111111] border border-neutral-700 rounded-lg p-2 text-xs text-white placeholder-neutral-500 focus:border-[#d4af37] focus:outline-none"
              />
            </div>
          </div>

          {/* Note text */}
          <div>
            <label className="block text-[11px] text-neutral-400 mb-1">
              الملاحظة أو التذكير الخاص:
            </label>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={2}
              placeholder="مثال: إحضار جواز السفر الأصلي عند الدخول، أو طلب طاولة عائلية هادئة..."
              className="w-full bg-[#111111] border border-neutral-700 rounded-lg p-2.5 text-xs text-white placeholder-neutral-500 focus:border-[#d4af37] focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-neutral-500">
              {savedFeedback && <span className="text-emerald-400 font-bold">✓ تم الحفظ بنجاح!</span>}
            </span>
            <button
              onClick={handleAddOrUpdateNote}
              disabled={!noteText.trim() && !bookingNumber.trim() && !ticketRef.trim()}
              className="px-5 py-2 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] disabled:opacity-40 text-black font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة الملاحظة</span>
            </button>
          </div>
        </div>

        {/* Existing Notes List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-neutral-300">
              الملاحظات وأرقام الحجز المحفوظة ({notesList.length}):
            </h4>
            <span className="text-[10px] text-neutral-500">تظهر في جدول الرحلة وتصدير الـ PDF</span>
          </div>

          {notesList.length === 0 ? (
            <div className="p-6 text-center bg-[#161616] border border-dashed border-neutral-800 rounded-xl text-xs text-neutral-500">
              لا توجد أرقام حجز أو تذكيرات خاصة مضافة حتى الآن.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(notes).map(([key, item]) => (
                <div
                  key={key}
                  className="bg-[#181818] border border-neutral-800 hover:border-[#d4af37]/40 rounded-xl p-3.5 space-y-2 relative group transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30">
                      🗓️ اليوم {item.dayNumber} {item.activityTitle ? `• ${item.activityTitle}` : ''}
                    </span>

                    <button
                      onClick={() => handleDeleteNote(key)}
                      className="p-1 rounded text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {item.bookingNumber && (
                    <div className="text-xs bg-[#111111] px-2.5 py-1 rounded border border-neutral-800 flex items-center justify-between">
                      <span className="text-neutral-400 text-[10px]">رقم الحجز:</span>
                      <span className="font-mono font-bold text-amber-300">{item.bookingNumber}</span>
                    </div>
                  )}

                  {item.ticketRef && (
                    <div className="text-xs bg-[#111111] px-2.5 py-1 rounded border border-neutral-800 flex items-center justify-between">
                      <span className="text-neutral-400 text-[10px]">التذكرة / الموعد:</span>
                      <span className="text-emerald-300 font-medium text-[11px]">{item.ticketRef}</span>
                    </div>
                  )}

                  {item.noteText && (
                    <p className="text-xs text-neutral-300 leading-relaxed pt-0.5">
                      {item.noteText}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-neutral-800">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#d4af37] text-black text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer"
          >
            تم وإغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

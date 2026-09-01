import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Circle, Clock, Plus, Trash2, Calendar, 
  AlertCircle, Sparkles, X, Tag, ShieldCheck, Filter,
  Bell, FileText, Check, ChevronDown, ListTodo, Hotel, Train,
  FileCheck, Luggage, Landmark, CreditCard, HeartPulse
} from 'lucide-react';
import { TravelReminder, ReminderCategory, ReminderPriority } from '../types';

interface TravelRemindersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tripDestination?: string;
  tripId?: string;
  onRemindersChange?: (reminders: TravelReminder[]) => void;
}

const STORAGE_KEY = 'smarttravel_user_reminders_v1';

const CATEGORY_MAP: Record<ReminderCategory, { label: string; icon: any; color: string }> = {
  booking: { label: 'حجوزات وإقامة', icon: Hotel, color: 'text-amber-400 bg-amber-950/40 border-amber-500/30' },
  transit: { label: 'تذاكر ومواصلات', icon: Train, color: 'text-blue-400 bg-blue-950/40 border-blue-500/30' },
  docs: { label: 'وثائق وتأشيرات', icon: FileCheck, color: 'text-purple-400 bg-purple-950/40 border-purple-500/30' },
  luggage: { label: 'أمتعة وتجهيزات', icon: Luggage, color: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30' },
  finance: { label: 'مالية وعملات', icon: CreditCard, color: 'text-yellow-400 bg-yellow-950/40 border-yellow-500/30' },
  health: { label: 'صحة وتأمين', icon: HeartPulse, color: 'text-rose-400 bg-rose-950/40 border-rose-500/30' },
  other: { label: 'عام وأخرى', icon: Tag, color: 'text-neutral-400 bg-neutral-900 border-neutral-700' },
};

const PRESET_TEMPLATES = [
  { title: 'تأكيد حجز الفندق واستلام قسيمة الوصول', category: 'booking' as ReminderCategory, priority: 'high' as ReminderPriority },
  { title: 'شراء تذاكر القطارات السريعة أو التنقل الداخلي', category: 'transit' as ReminderCategory, priority: 'high' as ReminderPriority },
  { title: 'إصدار أو طباعة التأشيرة السياحية وجواز السفر', category: 'docs' as ReminderCategory, priority: 'high' as ReminderPriority },
  { title: 'تفعيل باقة التجوال الدولي أو شراء شريحة eSIM', category: 'other' as ReminderCategory, priority: 'medium' as ReminderPriority },
  { title: 'شراء وثيقة تأمين السفر الصحي الإلزامي', category: 'health' as ReminderCategory, priority: 'high' as ReminderPriority },
  { title: 'صرف العملة النقدية وتفعيل البطاقات البنكية الدولية', category: 'finance' as ReminderCategory, priority: 'medium' as ReminderPriority },
  { title: 'شراء محول أفياش الكهرباء الدولي (Universal Adapter)', category: 'luggage' as ReminderCategory, priority: 'low' as ReminderPriority },
  { title: 'تأكيد حجز السيارة واستخراج رخصة القيادة الدولية', category: 'transit' as ReminderCategory, priority: 'medium' as ReminderPriority },
];

export const TravelRemindersDrawer: React.FC<TravelRemindersDrawerProps> = ({
  isOpen,
  onClose,
  tripDestination,
  tripId,
  onRemindersChange,
}) => {
  const [reminders, setReminders] = useState<TravelReminder[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  
  // Form State
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newDueTime, setNewDueTime] = useState('');
  const [newCategory, setNewCategory] = useState<ReminderCategory>('booking');
  const [newPriority, setNewPriority] = useState<ReminderPriority>('medium');
  const [newNotes, setNewNotes] = useState('');

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: TravelReminder[] = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setReminders(parsed);
          if (onRemindersChange) onRemindersChange(parsed);
          return;
        }
      }
    } catch (e) {
      console.error('Failed to load reminders', e);
    }

    // Default initial reminders if empty
    const initialList: TravelReminder[] = [
      {
        id: `rem-1`,
        title: 'تأكيد حجز الفندق ومطابقة تواريخ تسجيل الوصول',
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        dueTime: '12:00',
        category: 'booking',
        priority: 'high',
        isCompleted: false,
        notes: 'التحقق من توفر خدمة الاستقبال على مدار 24 ساعة.',
        createdAt: new Date().toISOString(),
      },
      {
        id: `rem-2`,
        title: 'شراء تذكرة قطار التنقل السريع مسبقاً للحصول على أفضل سعر',
        dueDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
        dueTime: '10:30',
        category: 'transit',
        priority: 'high',
        isCompleted: false,
        notes: 'حجز الدرجة الأولى أو المقعد المجاور للنافذة.',
        createdAt: new Date().toISOString(),
      },
      {
        id: `rem-3`,
        title: 'تفعيل باقة الإنترنت والتجوال الدولي على الهاتف',
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        dueTime: '18:00',
        category: 'other',
        priority: 'medium',
        isCompleted: true,
        notes: 'أو تثبيت شريحة eSIM الرقمية قبل الإقلاع.',
        createdAt: new Date().toISOString(),
      },
    ];
    setReminders(initialList);
    saveReminders(initialList);
  }, []);

  const saveReminders = (list: TravelReminder[]) => {
    setReminders(list);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      if (onRemindersChange) onRemindersChange(list);
    } catch (e) {
      console.error('Failed to save reminders', e);
    }
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newReminder: TravelReminder = {
      id: `rem-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      tripId,
      title: newTitle.trim(),
      dueDate: newDueDate || undefined,
      dueTime: newDueTime || undefined,
      category: newCategory,
      priority: newPriority,
      isCompleted: false,
      notes: newNotes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    const updated = [newReminder, ...reminders];
    saveReminders(updated);

    // Reset Form
    setNewTitle('');
    setNewDueDate('');
    setNewDueTime('');
    setNewNotes('');
    setIsAddingNew(false);
  };

  const handleAddPreset = (preset: typeof PRESET_TEMPLATES[0]) => {
    const newReminder: TravelReminder = {
      id: `rem-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      tripId,
      title: preset.title,
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      dueTime: '12:00',
      category: preset.category,
      priority: preset.priority,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };
    saveReminders([newReminder, ...reminders]);
  };

  const handleToggleComplete = (id: string) => {
    const updated = reminders.map((r) =>
      r.id === id ? { ...r, isCompleted: !r.isCompleted } : r
    );
    saveReminders(updated);
  };

  const handleDelete = (id: string) => {
    const updated = reminders.filter((r) => r.id !== id);
    saveReminders(updated);
  };

  // Filter Logic
  const filteredReminders = reminders.filter((r) => {
    if (activeFilter === 'pending' && r.isCompleted) return false;
    if (activeFilter === 'completed' && !r.isCompleted) return false;
    if (selectedCategoryFilter !== 'all' && r.category !== selectedCategoryFilter) return false;
    return true;
  });

  const pendingCount = reminders.filter((r) => !r.isCompleted).length;
  const completedCount = reminders.filter((r) => r.isCompleted).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end transition-opacity">
      <div 
        className="w-full max-w-lg bg-[#0e0e0e] border-r border-neutral-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-300"
        id="travel-reminders-panel"
      >
        {/* Panel Header */}
        <div className="p-5 border-b border-neutral-800/80 bg-[#121212] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <ListTodo className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">مهام وتذكيرات السفر</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#d4af37] text-black font-extrabold">
                  {pendingCount} متبقية
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                {tripDestination ? `تذكيرات خاصة برحلة ${tripDestination}` : 'جدول المهام والتذكيرات العامة للرحلة'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="إغلاق اللوحة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Add / Stats Bar */}
        <div className="p-4 bg-[#141414] border-b border-neutral-800/80 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-[#d4af37] text-black'
                  : 'bg-[#1c1c1c] text-neutral-300 hover:bg-[#252525]'
              }`}
            >
              الكل ({reminders.length})
            </button>
            <button
              onClick={() => setActiveFilter('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'pending'
                  ? 'bg-[#d4af37] text-black'
                  : 'bg-[#1c1c1c] text-neutral-300 hover:bg-[#252525]'
              }`}
            >
              قيد الانتظار ({pendingCount})
            </button>
            <button
              onClick={() => setActiveFilter('completed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'completed'
                  ? 'bg-[#d4af37] text-black'
                  : 'bg-[#1c1c1c] text-neutral-300 hover:bg-[#252525]'
              }`}
            >
              المكتملة ({completedCount})
            </button>
          </div>

          <button
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 hover:bg-[#d4af37]/30 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>مهمة جديدة</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* New Reminder Form */}
          {isAddingNew && (
            <form 
              onSubmit={handleAddReminder}
              className="bg-[#181818] border border-[#d4af37]/40 rounded-xl p-4 space-y-3 shadow-xl animate-in fade-in duration-200"
            >
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <span className="text-xs font-bold text-[#d4af37] flex items-center gap-1.5">
                  <Plus className="w-4 h-4" />
                  إضافة تذكير / مهمة جديدة
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="text-neutral-400 hover:text-white text-xs"
                >
                  إلغاء
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                  عنوان المهمة أو التذكير *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: تأكيد حجز الفندق، شراء تذكرة قطار..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#111111] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                    تاريخ التذكير
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-[#111111] border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                    وقت التذكير
                  </label>
                  <input
                    type="time"
                    value={newDueTime}
                    onChange={(e) => setNewDueTime(e.target.value)}
                    className="w-full bg-[#111111] border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                    التصنيف
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ReminderCategory)}
                    className="w-full bg-[#111111] border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="booking">🏨 حجوزات وإقامة</option>
                    <option value="transit">🚆 تذاكر ومواصلات</option>
                    <option value="docs">🛂 وثائق وتأشيرات</option>
                    <option value="luggage">🧳 أمتعة وتجهيزات</option>
                    <option value="finance">💳 مالية وعملات</option>
                    <option value="health">💊 صحة وتأمين</option>
                    <option value="other">📌 عام وأخرى</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                    الأهمية
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as ReminderPriority)}
                    className="w-full bg-[#111111] border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="high">🔴 عالي الأهمية</option>
                    <option value="medium">🟡 متوسط</option>
                    <option value="low">🟢 عادي</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                  ملاحظات أو روابط إضافية (اختياري)
                </label>
                <textarea
                  rows={2}
                  placeholder="رقم الحجز، رابط الموقع، أو أي تفاصيل خاصة..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-[#111111] border border-neutral-700 rounded-lg p-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#d4af37] hover:bg-[#e5c158] text-black text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>حفظ المهمة</span>
                </button>
              </div>
            </form>
          )}

          {/* Quick Preset Templates Bar */}
          <div className="bg-[#141414] border border-neutral-800/80 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-neutral-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                قوالب تذكير شائعة للسفر (إضافة سريعة):
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_TEMPLATES.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddPreset(preset)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-[#1c1c1c] hover:bg-[#282828] text-neutral-300 border border-neutral-700/60 hover:border-[#d4af37]/40 flex items-center gap-1 transition-all cursor-pointer text-right"
                  title="انقر للإضافة السريعة إلى قائمتك"
                >
                  <Plus className="w-3 h-3 text-[#d4af37]" />
                  <span>{preset.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedCategoryFilter('all')}
              className={`px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategoryFilter === 'all'
                  ? 'bg-white text-black font-bold'
                  : 'bg-[#181818] text-neutral-400 hover:text-white'
              }`}
            >
              جميع التصنيفات
            </button>
            {Object.entries(CATEGORY_MAP).map(([catKey, info]) => (
              <button
                key={catKey}
                onClick={() => setSelectedCategoryFilter(catKey)}
                className={`px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategoryFilter === catKey
                    ? 'bg-[#d4af37] text-black font-bold'
                    : 'bg-[#181818] text-neutral-400 hover:text-white'
                }`}
              >
                {info.label}
              </button>
            ))}
          </div>

          {/* Reminders List */}
          {filteredReminders.length === 0 ? (
            <div className="p-8 text-center bg-[#141414] border border-neutral-800 rounded-xl space-y-3">
              <CheckCircle2 className="w-10 h-10 text-[#d4af37]/50 mx-auto" />
              <h4 className="text-sm font-bold text-white">لا توجد مهام تطابق هذا التصنيف</h4>
              <p className="text-xs text-neutral-400">
                يمكنك إضافة مهمة جديدة أو النقر على أحد القوالب الشائعة أعلاه.
              </p>
              <button
                onClick={() => setIsAddingNew(true)}
                className="px-4 py-2 rounded-xl bg-[#d4af37] text-black text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة مهمة جديدة الآن</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredReminders.map((reminder) => {
                const catInfo = CATEGORY_MAP[reminder.category] || CATEGORY_MAP.other;
                const CatIcon = catInfo.icon;
                
                // Determine if overdue or today
                const isToday = reminder.dueDate === new Date().toISOString().split('T')[0];
                const isOverdue = reminder.dueDate && reminder.dueDate < new Date().toISOString().split('T')[0] && !reminder.isCompleted;

                return (
                  <div
                    key={reminder.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      reminder.isCompleted
                        ? 'bg-[#121212]/60 border-neutral-800/60 opacity-60'
                        : isOverdue
                        ? 'bg-[#1f1111] border-rose-500/40 shadow-sm'
                        : 'bg-[#161616] border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Checkbox toggle */}
                      <button
                        onClick={() => handleToggleComplete(reminder.id)}
                        className="mt-0.5 flex-shrink-0 cursor-pointer text-neutral-400 hover:text-[#d4af37] transition-colors"
                        title={reminder.isCompleted ? 'إعادة المهمة لقيد الانتظار' : 'تحديد المهمة كمكتملة'}
                      >
                        {reminder.isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-neutral-500 hover:text-[#d4af37]" />
                        )}
                      </button>

                      {/* Main Info */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span
                            className={`text-xs sm:text-sm font-bold ${
                              reminder.isCompleted
                                ? 'line-through text-neutral-400'
                                : 'text-neutral-100'
                            }`}
                          >
                            {reminder.title}
                          </span>

                          <div className="flex items-center gap-1.5">
                            {/* Priority Badge */}
                            {reminder.priority === 'high' && (
                              <span className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-600/40 text-[10px] font-bold">
                                عالي
                              </span>
                            )}
                            {reminder.priority === 'medium' && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-600/40 text-[10px] font-bold">
                                متوسط
                              </span>
                            )}

                            {/* Category Pill */}
                            <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold flex items-center gap-1 ${catInfo.color}`}>
                              <CatIcon className="w-3 h-3" />
                              <span>{catInfo.label}</span>
                            </span>
                          </div>
                        </div>

                        {/* Due Date and Time Tag */}
                        {(reminder.dueDate || reminder.dueTime) && (
                          <div className="flex items-center gap-2 text-[11px] text-neutral-400 flex-wrap">
                            <span className={`flex items-center gap-1 font-mono ${
                              isOverdue ? 'text-rose-400 font-bold' : isToday ? 'text-amber-400 font-bold' : 'text-neutral-400'
                            }`}>
                              <Calendar className="w-3 h-3" />
                              {reminder.dueDate}
                              {isOverdue && ' (متأخر!)'}
                              {isToday && ' (اليوم!)'}
                            </span>
                            {reminder.dueTime && (
                              <span className="flex items-center gap-1 text-neutral-400 font-mono">
                                <Clock className="w-3 h-3" />
                                {reminder.dueTime}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Notes */}
                        {reminder.notes && (
                          <p className="text-[11px] text-neutral-300 bg-[#111111] p-2 rounded-lg border border-neutral-800 leading-relaxed">
                            {reminder.notes}
                          </p>
                        )}
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(reminder.id)}
                        className="p-1.5 text-neutral-500 hover:text-rose-400 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                        title="حذف المهمة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-neutral-800/80 bg-[#121212] flex items-center justify-between text-xs text-neutral-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
            <span>محفوظة محلياً بشكل دائم</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { 
  Wallet, Plus, Trash2, AlertTriangle, CheckCircle, TrendingUp, 
  DollarSign, PieChart, Tag, Calendar, ShoppingBag, Utensils, 
  BedDouble, Train, Ticket, ShieldAlert, Sparkles, Filter
} from 'lucide-react';
import { GeneratedPlan, TripExpenseItem, ExpenseCategory } from '../types';

interface LiveExpenseTrackerProps {
  plan: GeneratedPlan;
  onUpdatePlan?: (updatedPlan: GeneratedPlan) => void;
}

const CATEGORY_CONFIG: Record<ExpenseCategory, { label: string; icon: React.ReactNode; defaultRatio: number; color: string }> = {
  accommodation: {
    label: '🏨 إقامة وفنادق',
    icon: <BedDouble className="w-3.5 h-3.5" />,
    defaultRatio: 0.35,
    color: '#3b82f6', // blue
  },
  dining: {
    label: '🍽️ طعام ومطاعم',
    icon: <Utensils className="w-3.5 h-3.5" />,
    defaultRatio: 0.25,
    color: '#10b981', // emerald
  },
  activities: {
    label: '🎟️ أنشطة وتذاكر',
    icon: <Ticket className="w-3.5 h-3.5" />,
    defaultRatio: 0.20,
    color: '#d4af37', // gold
  },
  transit: {
    label: '🚕 مواصلات وتنقل',
    icon: <Train className="w-3.5 h-3.5" />,
    defaultRatio: 0.10,
    color: '#8b5cf6', // purple
  },
  shopping: {
    label: '🛍️ تسوق وهدايا',
    icon: <ShoppingBag className="w-3.5 h-3.5" />,
    defaultRatio: 0.05,
    color: '#ec4899', // pink
  },
  emergency: {
    label: '🛡️ طوارئ وتأمين',
    icon: <ShieldAlert className="w-3.5 h-3.5" />,
    defaultRatio: 0.05,
    color: '#f59e0b', // amber
  },
  other: {
    label: '✨ متفرقات ومصاريف أخرى',
    icon: <Tag className="w-3.5 h-3.5" />,
    defaultRatio: 0.0,
    color: '#6b7280', // gray
  },
};

export const LiveExpenseTracker: React.FC<LiveExpenseTrackerProps> = ({
  plan,
  onUpdatePlan,
}) => {
  const expenses: TripExpenseItem[] = plan.expenses || [];
  
  // Total numeric budget
  const numericBudget = useMemo(() => {
    const raw = String(plan.constraints.budget).replace(/[^0-9.]/g, '');
    return parseFloat(raw) || 5000;
  }, [plan.constraints.budget]);

  const currency = plan.constraints.currency || 'SAR';

  // Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('dining');
  const [dayNumber, setDayNumber] = useState<number>(1);
  const [notes, setNotes] = useState('');
  const [isAddingOpen, setIsAddingOpen] = useState(false);
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('all');

  // Summary Metrics
  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [expenses]);

  const remainingBudget = numericBudget - totalSpent;
  const percentageSpent = Math.min(100, Math.round((totalSpent / numericBudget) * 100)) || 0;
  const dailyAverageSpent = plan.durationDays > 0 ? (totalSpent / plan.durationDays).toFixed(0) : '0';
  const plannedDailyTarget = plan.durationDays > 0 ? (numericBudget / plan.durationDays).toFixed(0) : '0';

  // Category breakdown
  const categoryStats = useMemo(() => {
    const spentMap: Record<ExpenseCategory, number> = {
      accommodation: 0,
      dining: 0,
      activities: 0,
      transit: 0,
      shopping: 0,
      emergency: 0,
      other: 0,
    };

    expenses.forEach((item) => {
      if (spentMap[item.category] !== undefined) {
        spentMap[item.category] += Number(item.amount) || 0;
      } else {
        spentMap.other += Number(item.amount) || 0;
      }
    });

    return (Object.keys(CATEGORY_CONFIG) as ExpenseCategory[]).map((cat) => {
      const conf = CATEGORY_CONFIG[cat];
      const allocated = Math.round(numericBudget * conf.defaultRatio);
      const spent = spentMap[cat];
      const percent = allocated > 0 ? Math.round((spent / allocated) * 100) : spent > 0 ? 100 : 0;
      const isExceeded = allocated > 0 && spent > allocated;

      return {
        category: cat,
        label: conf.label,
        allocated,
        spent,
        percent,
        isExceeded,
        diff: spent - allocated,
        color: conf.color,
      };
    });
  }, [expenses, numericBudget]);

  const exceededCategories = categoryStats.filter((c) => c.isExceeded);

  // Add Expense
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount || Number(amount) <= 0) return;

    const newExpense: TripExpenseItem = {
      id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title: title.trim(),
      amount: parseFloat(amount),
      currency,
      category,
      dayNumber: Number(dayNumber) || 1,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    const updatedExpenses = [newExpense, ...expenses];
    const updatedPlan: GeneratedPlan = {
      ...plan,
      expenses: updatedExpenses,
      isUserModified: true,
    };

    if (onUpdatePlan) {
      onUpdatePlan(updatedPlan);
    }

    // Reset Form
    setTitle('');
    setAmount('');
    setNotes('');
    setIsAddingOpen(false);
  };

  // Delete Expense
  const handleDeleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter((e) => e.id !== id);
    const updatedPlan: GeneratedPlan = {
      ...plan,
      expenses: updatedExpenses,
      isUserModified: true,
    };
    if (onUpdatePlan) {
      onUpdatePlan(updatedPlan);
    }
  };

  const filteredExpenses = selectedFilterCategory === 'all'
    ? expenses
    : expenses.filter((e) => e.category === selectedFilterCategory);

  return (
    <div className="bg-[#131313] border border-neutral-800 rounded-2xl p-5 sm:p-6 space-y-6 shadow-2xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white">
                متتبع المصاريف اللحظي (Live Trip Budget & Expense Tracker)
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-500/30">
                تسجيل لحظي
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              سجل فواتيرك ونفقاتك اليومية وقارنها فوراً مع الميزانية المخططة ({numericBudget.toLocaleString()} {currency}).
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddingOpen(!isAddingOpen)}
          className="px-4 py-2 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isAddingOpen ? 'إلغاء الإدخال' : 'تسجيل مصروف جديد +'}</span>
        </button>
      </div>

      {/* Warnings Banner if any category is exceeded */}
      {exceededCategories.length > 0 && (
        <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-red-300">
              ⚠️ تنبيه تجاوز الميزانية في ({exceededCategories.length}) فئات:
            </span>
            <p className="mt-0.5 text-red-200/90 leading-relaxed">
              {exceededCategories.map((c) => (
                <span key={c.category} className="inline-block ml-2 font-mono">
                  • {c.label}: تم تجاوز المخطط بمقدار (+{c.diff.toLocaleString()} {currency})
                </span>
              ))}
            </p>
          </div>
        </div>
      )}

      {/* 3 Main Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Total Spent */}
        <div className="bg-[#181818] border border-neutral-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
            <span>إجمالي المصروف الفعلي</span>
            <span className="text-[11px] font-mono text-[#d4af37]">{percentageSpent}% من الميزانية</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono">
            {totalSpent.toLocaleString()} <span className="text-xs text-neutral-400 font-sans">{currency}</span>
          </div>
          <div className="w-full bg-[#101010] h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full rounded-full transition-all ${
                percentageSpent > 100 ? 'bg-red-500' : percentageSpent > 80 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, percentageSpent)}%` }}
            ></div>
          </div>
        </div>

        {/* Remaining Budget */}
        <div className="bg-[#181818] border border-neutral-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
            <span>المتبقي من الميزانية</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${remainingBudget >= 0 ? 'bg-emerald-950/40 text-emerald-400' : 'bg-red-950/40 text-red-400'}`}>
              {remainingBudget >= 0 ? 'ضمن النطاق' : 'عجز'}
            </span>
          </div>
          <div className={`text-xl sm:text-2xl font-black font-mono ${remainingBudget >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {remainingBudget.toLocaleString()} <span className="text-xs text-neutral-400 font-sans">{currency}</span>
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            الميزانية الكلية: {numericBudget.toLocaleString()} {currency}
          </div>
        </div>

        {/* Daily Burn Rate */}
        <div className="bg-[#181818] border border-neutral-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
            <span>المعدل اليومي للصرف</span>
            <span className="text-[10px] text-neutral-400">المدة: {plan.durationDays} أيام</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono">
            {dailyAverageSpent} <span className="text-xs text-neutral-400 font-sans">{currency} / يوم</span>
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            المستهدف اليومي المخطط: {plannedDailyTarget} {currency}
          </div>
        </div>
      </div>

      {/* Add Expense Form Modal/Inline */}
      {isAddingOpen && (
        <form onSubmit={handleAddExpense} className="bg-[#1a1a1a] border border-[#d4af37]/40 rounded-xl p-4 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <span className="text-xs font-bold text-[#d4af37] flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              تسجيل عملية شراء أو نفقة جديدة:
            </span>
            <span className="text-[11px] text-neutral-400 font-mono">العملة: {currency}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Title */}
            <div>
              <label className="block text-[11px] font-bold text-neutral-300 mb-1">بيان المصروف / المكان *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: غداء في مطعم الساحل، تذكرة دخول متحف..."
                className="w-full bg-[#121212] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-[11px] font-bold text-neutral-300 mb-1">المبلغ بالمصروف *</label>
              <input
                type="number"
                step="any"
                required
                min="0.1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`0.00 ${currency}`}
                className="w-full bg-[#121212] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-[11px] font-bold text-neutral-300 mb-1">فئة المصروف</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full bg-[#121212] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              >
                {(Object.keys(CATEGORY_CONFIG) as ExpenseCategory[]).map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_CONFIG[cat].label}
                  </option>
                ))}
              </select>
            </div>

            {/* Day Number */}
            <div>
              <label className="block text-[11px] font-bold text-neutral-300 mb-1">يوم الصرف في الجدول</label>
              <select
                value={dayNumber}
                onChange={(e) => setDayNumber(Number(e.target.value))}
                className="w-full bg-[#121212] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              >
                {Array.from({ length: plan.durationDays || 5 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    اليوم {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ملاحظات اختيارية (مثال: دفع كاش، تم الحصول على خصم 15%...)"
              className="w-full bg-[#121212] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-300 focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingOpen(false)}
              className="px-3 py-1.5 rounded-lg bg-[#252525] hover:bg-[#303030] text-neutral-300 text-xs font-bold cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 rounded-lg bg-[#d4af37] hover:bg-[#e5c158] text-black text-xs font-bold cursor-pointer shadow"
            >
              حفظ المصروف
            </button>
          </div>
        </form>
      )}

      {/* Category Progress Bars vs Planned Budget */}
      <div className="space-y-3 bg-[#161616] p-4 rounded-xl border border-neutral-800">
        <div className="flex items-center justify-between text-xs font-bold text-neutral-300">
          <span>توزيع الصرف ومقارنته بالمخطط حسب الفئات:</span>
          <span className="text-[11px] text-neutral-400">الإنفاق الفعلي / السقف المقترح</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {categoryStats.map((stat) => (
            <div key={stat.category} className="bg-[#111111] p-3 rounded-lg border border-neutral-800/80 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  {stat.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-neutral-300 font-bold">
                    {stat.spent.toLocaleString()} / {stat.allocated.toLocaleString()} {currency}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                      stat.isExceeded
                        ? 'bg-red-950/50 text-red-400 border border-red-500/30'
                        : stat.percent > 80
                        ? 'bg-amber-950/50 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-950/50 text-emerald-400'
                    }`}
                  >
                    {stat.percent}%
                  </span>
                </div>
              </div>

              <div className="w-full bg-[#1e1e1e] h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    stat.isExceeded ? 'bg-red-500' : stat.percent > 80 ? 'bg-amber-500' : 'bg-[#d4af37]'
                  }`}
                  style={{ width: `${Math.min(100, stat.percent)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logged Expenses List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white">سجل العمليات المدخلة ({expenses.length}):</span>
          </div>

          {/* Filter Categories */}
          <div className="flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => setSelectedFilterCategory('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                selectedFilterCategory === 'all'
                  ? 'bg-[#d4af37] text-black'
                  : 'bg-[#1a1a1a] text-neutral-400 hover:text-white'
              }`}
            >
              الكل
            </button>
            {(Object.keys(CATEGORY_CONFIG) as ExpenseCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedFilterCategory === cat
                    ? 'bg-[#d4af37] text-black'
                    : 'bg-[#1a1a1a] text-neutral-400 hover:text-white'
                }`}
              >
                {CATEGORY_CONFIG[cat].label}
              </button>
            ))}
          </div>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="bg-[#161616] p-6 rounded-xl border border-dashed border-neutral-800 text-center text-xs text-neutral-400">
            لا توجد مصاريف مسجلة حتى الآن. انقر على &quot;تسجيل مصروف جديد +&quot; للبدء في تتبع رحلتك لحظياً.
          </div>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {filteredExpenses.map((exp) => (
              <div
                key={exp.id}
                className="bg-[#181818] hover:bg-[#1c1c1c] border border-neutral-800 rounded-xl p-3 flex items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#242424] flex items-center justify-center text-[#d4af37] text-xs font-bold">
                    D{exp.dayNumber || 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-xs text-white">{exp.title}</strong>
                      <span className="text-[10px] text-neutral-400 bg-[#121212] px-1.5 py-0.5 rounded border border-neutral-800">
                        {CATEGORY_CONFIG[exp.category]?.label || exp.category}
                      </span>
                    </div>
                    {exp.notes && (
                      <p className="text-[11px] text-neutral-400 mt-0.5">{exp.notes}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-emerald-400 font-mono">
                    {exp.amount.toLocaleString()} {exp.currency}
                  </span>
                  <button
                    onClick={() => handleDeleteExpense(exp.id)}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-950/60 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                    title="حذف المصروف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

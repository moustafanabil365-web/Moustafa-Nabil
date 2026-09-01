import React, { useState, useEffect } from 'react';
import { 
  ArrowRightLeft, RefreshCw, DollarSign, Wallet, TrendingUp, 
  CreditCard, Sparkles, HelpCircle, Check, Coins, ShieldAlert,
  Layers, Building, Utensils, Compass, Bus, AlertCircle
} from 'lucide-react';
import { CurrencyRateInfo } from '../types';
import { D3BudgetPieChart } from './D3BudgetPieChart';

interface CurrencyConverterWidgetProps {
  planBudget?: number | string;
  planCurrency?: string;
  destination?: string;
  durationDays?: number;
}

const SUPPORTED_CURRENCIES: CurrencyRateInfo[] = [
  { code: 'SAR', name: 'ريال سعودي', symbol: 'ر.س', flag: '🇸🇦', rateAgainstUSD: 3.75 },
  { code: 'AED', name: 'درهم إماراتي', symbol: 'د.إ', flag: '🇦🇪', rateAgainstUSD: 3.6725 },
  { code: 'KWD', name: 'دينار كويتي', symbol: 'د.ك', flag: '🇰🇼', rateAgainstUSD: 0.308 },
  { code: 'QAR', name: 'ريال قطري', symbol: 'ر.ق', flag: '🇶🇦', rateAgainstUSD: 3.64 },
  { code: 'BHD', name: 'دينار بحريني', symbol: 'د.ب', flag: '🇧🇭', rateAgainstUSD: 0.376 },
  { code: 'OMR', name: 'ريال عماني', symbol: 'ر.ع', flag: '🇴🇲', rateAgainstUSD: 0.385 },
  { code: 'EGP', name: 'جنيه مصري', symbol: 'ج.م', flag: '🇪🇬', rateAgainstUSD: 48.80 },
  { code: 'USD', name: 'دولار أمريكي', symbol: '$', flag: '🇺🇸', rateAgainstUSD: 1.00 },
  { code: 'EUR', name: 'يورو أوروبي', symbol: '€', flag: '🇪🇺', rateAgainstUSD: 0.92 },
  { code: 'GBP', name: 'جنيه إسترليني', symbol: '£', flag: '🇬🇧', rateAgainstUSD: 0.79 },
  { code: 'TRY', name: 'ليرة تركية', symbol: '₺', flag: '🇹🇷', rateAgainstUSD: 36.20 },
  { code: 'JPY', name: 'ين ياباني', symbol: '¥', flag: '🇯🇵', rateAgainstUSD: 154.50 },
  { code: 'CHF', name: 'فرنك سويسري', symbol: 'CHF', flag: '🇨🇭', rateAgainstUSD: 0.88 },
  { code: 'MYR', name: 'رينغيت ماليزي', symbol: 'RM', flag: '🇲🇾', rateAgainstUSD: 4.42 },
  { code: 'THB', name: 'بات تايلاندي', symbol: '฿', flag: '🇹🇭', rateAgainstUSD: 34.10 },
  { code: 'MAD', name: 'درهم مغربي', symbol: 'د.م', flag: '🇲🇦', rateAgainstUSD: 10.10 },
  { code: 'GEL', name: 'لاري جورجي', symbol: '₾', flag: '🇬🇪', rateAgainstUSD: 2.78 },
  { code: 'AZN', name: 'مانات أذربيجاني', symbol: '₼', flag: '🇦🇿', rateAgainstUSD: 1.70 },
  { code: 'CAD', name: 'دولار كندي', symbol: 'C$', flag: '🇨🇦', rateAgainstUSD: 1.41 },
  { code: 'AUD', name: 'دولار أسترالي', symbol: 'A$', flag: '🇦🇺', rateAgainstUSD: 1.55 },
  { code: 'IDR', name: 'روبية إندونيسية', symbol: 'Rp', flag: '🇮🇩', rateAgainstUSD: 16250.00 },
];

export const CurrencyConverterWidget: React.FC<CurrencyConverterWidgetProps> = ({
  planBudget = 10000,
  planCurrency = 'SAR',
  destination = '',
  durationDays = 5,
}) => {
  // Rates Map (USD based)
  const [rates, setRates] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    SUPPORTED_CURRENCIES.forEach((c) => {
      initial[c.code] = c.rateAgainstUSD;
    });
    return initial;
  });

  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('لحظي ومحدث');

  // Converter States
  const [fromCurrency, setFromCurrency] = useState<string>(() => {
    return planCurrency && SUPPORTED_CURRENCIES.some((c) => c.code === planCurrency)
      ? planCurrency
      : 'SAR';
  });
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [amount, setAmount] = useState<number>(1000);

  // Preferred Display Currency for Plan Budget Breakdown
  const [userPreferredCurrency, setUserPreferredCurrency] = useState<string>(() => {
    return planCurrency && SUPPORTED_CURRENCIES.some((c) => c.code === planCurrency)
      ? planCurrency
      : 'SAR';
  });

  // Fetch Live Rates
  const fetchLiveRates = async () => {
    setIsLoadingRates(true);
    try {
      const res = await fetch('/api/exchange-rates');
      if (res.ok) {
        const data = await res.json();
        if (data.rates) {
          setRates((prev) => ({ ...prev, ...data.rates }));
          setLastUpdated(new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }));
        }
      }
    } catch (e) {
      console.error('Failed to fetch live rates', e);
    } finally {
      setIsLoadingRates(false);
    }
  };

  useEffect(() => {
    fetchLiveRates();
  }, []);

  // Helper Conversion Calculator: From A -> USD -> To B
  const convertAmount = (val: number, from: string, to: string): number => {
    if (!val || val <= 0) return 0;
    if (from === to) return val;
    const fromRate = rates[from] || 1;
    const toRate = rates[to] || 1;
    // Amount in USD = val / fromRate
    const inUSD = val / fromRate;
    return inUSD * toRate;
  };

  const currentRate = convertAmount(1, fromCurrency, toCurrency);
  const convertedTotal = convertAmount(amount, fromCurrency, toCurrency);

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  // Numeric Plan Budget calculation
  const numericBudget = typeof planBudget === 'number' 
    ? planBudget 
    : parseFloat(String(planBudget).replace(/[^0-9.]/g, '')) || 10000;

  // Plan budget converted to User Preferred Currency
  const convertedPlanBudget = convertAmount(numericBudget, planCurrency, userPreferredCurrency);
  const dailyBudgetPreferred = durationDays > 0 ? convertedPlanBudget / durationDays : 0;

  const fromInfo = SUPPORTED_CURRENCIES.find((c) => c.code === fromCurrency) || SUPPORTED_CURRENCIES[0];
  const toInfo = SUPPORTED_CURRENCIES.find((c) => c.code === toCurrency) || SUPPORTED_CURRENCIES[8];
  const preferredInfo = SUPPORTED_CURRENCIES.find((c) => c.code === userPreferredCurrency) || fromInfo;

  return (
    <div className="bg-[#141414] border border-neutral-800 rounded-2xl p-5 sm:p-7 space-y-6 shadow-xl" id="currency-converter-section">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>أداة تحويل العملات وتوزيع الميزانية التفاعلية</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-[#d4af37] border border-amber-500/30">
                أسعار لحظية
              </span>
            </h3>
            <p className="text-xs text-neutral-400">
              اختر عملتك المفضلة لعرض تقديرات الميزانية والمصروف اليومي ومقارنة الأسعار الفورية
            </p>
          </div>
        </div>

        <button
          onClick={fetchLiveRates}
          disabled={isLoadingRates}
          className="self-start sm:self-auto flex items-center gap-1.5 text-xs text-neutral-300 hover:text-[#d4af37] px-3 py-1.5 rounded-lg bg-[#1c1c1c] border border-neutral-700/70 hover:border-[#d4af37]/40 transition-colors cursor-pointer"
          title="تحديث أسعار الصرف"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRates ? 'animate-spin text-[#d4af37]' : ''}`} />
          <span>تحديث الصرف ({lastUpdated})</span>
        </button>
      </div>

      {/* Grid: Live Converter + Budget Re-Calculation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Converter (5 Cols) */}
        <div className="lg:col-span-5 bg-[#181818] border border-neutral-700/60 rounded-xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#d4af37] flex items-center gap-1.5">
              <ArrowRightLeft className="w-4 h-4" />
              حاسبة التحويل السريع بين العملات
            </span>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-[11px] font-bold text-neutral-400 mb-1">
              المبلغ المراد تحويله
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full bg-[#111111] border border-neutral-700 rounded-lg px-3 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-[#d4af37] font-mono"
              />
              <span className="absolute left-3 top-2.5 text-xs text-neutral-400 font-bold">
                {fromInfo.symbol}
              </span>
            </div>
          </div>

          {/* Currency Selectors & Swap Button */}
          <div className="grid grid-cols-5 gap-2 items-center">
            <div className="col-span-2">
              <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                من العملة
              </label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full bg-[#111111] border border-neutral-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={`from-${c.code}`} value={c.code}>
                    {c.flag} {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-1 flex justify-center pt-5">
              <button
                type="button"
                onClick={handleSwap}
                className="w-8 h-8 rounded-full bg-[#242424] hover:bg-[#333333] border border-neutral-600 flex items-center justify-center text-[#d4af37] transition-transform hover:rotate-180 cursor-pointer"
                title="عكس اتجاه التحويل"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="col-span-2">
              <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                إلى العملة
              </label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full bg-[#111111] border border-neutral-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={`to-${c.code}`} value={c.code}>
                    {c.flag} {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Result Card */}
          <div className="bg-[#111111] border border-[#d4af37]/30 rounded-xl p-4 text-center space-y-1">
            <span className="text-[11px] text-neutral-400 block">
              القيمة المقابلة المحسوبة:
            </span>
            <div className="text-xl sm:text-2xl font-black text-[#d4af37] font-mono">
              {convertedTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
              <span className="text-sm font-bold text-neutral-200">{toInfo.code} ({toInfo.symbol})</span>
            </div>
            <p className="text-[10px] text-neutral-400 font-mono pt-1">
              سعر الصرف: 1 {fromInfo.code} = {currentRate.toFixed(4)} {toInfo.code}
            </p>
          </div>
        </div>

        {/* Right Column: Trip Budget Breakdown in User Preferred Currency (7 Cols) */}
        <div className="lg:col-span-7 bg-[#181818] border border-neutral-700/60 rounded-xl p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-[#d4af37]" />
              توزيع الميزانية بعملتك المحلية المختارة:
            </span>

            {/* Currency Selector for Plan */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-neutral-400 whitespace-nowrap">العملة المفضلة:</span>
              <select
                value={userPreferredCurrency}
                onChange={(e) => setUserPreferredCurrency(e.target.value)}
                className="bg-[#111111] border border-[#d4af37]/40 rounded-lg px-2 py-1 text-xs text-[#d4af37] font-bold focus:outline-none"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={`pref-${c.code}`} value={c.code}>
                    {c.flag} {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Big Summary Pill */}
          <div className="bg-gradient-to-r from-[#1c1c1c] via-[#222222] to-[#1c1c1c] border border-neutral-700 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-neutral-400 block">إجمالي ميزانية الرحلة المقدرة</span>
              <div className="text-lg sm:text-xl font-black text-emerald-400 font-mono">
                {convertedPlanBudget.toLocaleString('en-US', { maximumFractionDigits: 0 })}{' '}
                <span className="text-xs font-bold text-neutral-200">{preferredInfo.symbol}</span>
              </div>
            </div>
            <div className="text-left border-r border-neutral-700 pr-4">
              <span className="text-[11px] text-neutral-400 block">المصروف اليومي التقريبي</span>
              <div className="text-base sm:text-lg font-black text-[#d4af37] font-mono">
                {dailyBudgetPreferred.toLocaleString('en-US', { maximumFractionDigits: 0 })}{' '}
                <span className="text-xs font-bold text-neutral-200">{preferredInfo.symbol} / يوم</span>
              </div>
            </div>
          </div>

          {/* Categorized Allocation Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {/* Accommodation ~40% */}
            <div className="bg-[#121212] p-2.5 rounded-lg border border-neutral-800 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-neutral-400">
                <span className="flex items-center gap-1 font-bold text-amber-300">
                  <Building className="w-3 h-3" />
                  الإقامة والفنادق
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">40%</span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-white font-mono">
                {(convertedPlanBudget * 0.40).toLocaleString('en-US', { maximumFractionDigits: 0 })}{' '}
                <span className="text-[10px] text-neutral-400">{preferredInfo.symbol}</span>
              </div>
            </div>

            {/* Food & Dining ~25% */}
            <div className="bg-[#121212] p-2.5 rounded-lg border border-neutral-800 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-neutral-400">
                <span className="flex items-center gap-1 font-bold text-orange-300">
                  <Utensils className="w-3 h-3" />
                  المطاعم والوجبات
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">25%</span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-white font-mono">
                {(convertedPlanBudget * 0.25).toLocaleString('en-US', { maximumFractionDigits: 0 })}{' '}
                <span className="text-[10px] text-neutral-400">{preferredInfo.symbol}</span>
              </div>
            </div>

            {/* Activities ~15% */}
            <div className="bg-[#121212] p-2.5 rounded-lg border border-neutral-800 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-neutral-400">
                <span className="flex items-center gap-1 font-bold text-purple-300">
                  <Compass className="w-3 h-3" />
                  الأنشطة والجولات
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">15%</span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-white font-mono">
                {(convertedPlanBudget * 0.15).toLocaleString('en-US', { maximumFractionDigits: 0 })}{' '}
                <span className="text-[10px] text-neutral-400">{preferredInfo.symbol}</span>
              </div>
            </div>

            {/* Transit ~10% */}
            <div className="bg-[#121212] p-2.5 rounded-lg border border-neutral-800 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-neutral-400">
                <span className="flex items-center gap-1 font-bold text-blue-300">
                  <Bus className="w-3 h-3" />
                  المواصلات الداخلية
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">10%</span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-white font-mono">
                {(convertedPlanBudget * 0.10).toLocaleString('en-US', { maximumFractionDigits: 0 })}{' '}
                <span className="text-[10px] text-neutral-400">{preferredInfo.symbol}</span>
              </div>
            </div>

            {/* Buffer ~10% */}
            <div className="bg-[#121212] p-2.5 rounded-lg border border-neutral-800 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-neutral-400">
                <span className="flex items-center gap-1 font-bold text-emerald-300">
                  <ShieldAlert className="w-3 h-3" />
                  الطوارئ والتسوق
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">10%</span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-white font-mono">
                {(convertedPlanBudget * 0.10).toLocaleString('en-US', { maximumFractionDigits: 0 })}{' '}
                <span className="text-[10px] text-neutral-400">{preferredInfo.symbol}</span>
              </div>
            </div>

            {/* Quick Tip */}
            <div className="bg-[#121212] p-2.5 rounded-lg border border-neutral-800 flex items-center justify-center text-center">
              <span className="text-[10px] text-neutral-400 leading-tight">
                💡 التقديرات تشمل الضريبة المضافة المحلية ورسوم الخدمة.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* D3-Based Interactive Pie Chart Visualization */}
      <D3BudgetPieChart
        totalBudget={convertedPlanBudget}
        currencySymbol={preferredInfo.symbol}
        currencyCode={preferredInfo.code}
        durationDays={durationDays}
      />

      {/* Destination Payment & Smart Financial Advice */}
      <div className="bg-[#181818] border border-neutral-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-neutral-300">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-[#d4af37] flex-shrink-0" />
          <span>
            <strong>نصيحة الدفع في {destination || 'وجهتك'}:</strong> يُنصح باستخدام البطاقات البنكية الدولية ذات الرسوم المنخفضة على العملات الأجنبية (0% FX Fee) مع حمل مبلغ نقدي بسيط للمشتريات الشعبية.
          </span>
        </div>
      </div>
    </div>
  );
};

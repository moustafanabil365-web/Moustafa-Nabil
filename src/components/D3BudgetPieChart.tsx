import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PieChart as PieIcon, Building, Utensils, Compass, Bus, 
  ShieldAlert, ShoppingBag, Sparkles, DollarSign 
} from 'lucide-react';

export interface BudgetSliceData {
  id: string;
  name: string;
  nameEn: string;
  percentage: number;
  amount: number;
  color: string;
  hoverColor: string;
  icon: string;
  description: string;
}

interface D3BudgetPieChartProps {
  totalBudget: number;
  currencySymbol: string;
  currencyCode?: string;
  durationDays?: number;
  customBreakdown?: {
    accommodation?: number;
    dining?: number;
    activities?: number;
    transit?: number;
    shopping?: number;
  };
}

export const D3BudgetPieChart: React.FC<D3BudgetPieChartProps> = ({
  totalBudget,
  currencySymbol,
  currencyCode = 'SAR',
  durationDays = 5,
  customBreakdown,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [activeCategory, setActiveCategory] = useState<BudgetSliceData | null>(null);
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  // Compute slices data based on total budget and proportions
  const slicesData: BudgetSliceData[] = useMemo(() => {
    const pAcc = customBreakdown?.accommodation ?? 0.40;
    const pDin = customBreakdown?.dining ?? 0.25;
    const pAct = customBreakdown?.activities ?? 0.15;
    const pTra = customBreakdown?.transit ?? 0.10;
    const pShop = customBreakdown?.shopping ?? 0.10;

    return [
      {
        id: 'accommodation',
        name: 'الإقامة والفنادق',
        nameEn: 'Accommodation',
        percentage: Math.round(pAcc * 100),
        amount: totalBudget * pAcc,
        color: '#f59e0b', // Amber
        hoverColor: '#fbbf24',
        icon: '🏨',
        description: 'حجوزات الفنادق والمنتجعات والضريبة الفندقية المحلية',
      },
      {
        id: 'dining',
        name: 'المطاعم والوجبات',
        nameEn: 'Food & Dining',
        percentage: Math.round(pDin * 100),
        amount: totalBudget * pDin,
        color: '#f97316', // Orange
        hoverColor: '#fb923c',
        icon: '🍽️',
        description: 'الإفطار والغداء والعشاء وتجارب المقاهي الشعبية والراقية',
      },
      {
        id: 'activities',
        name: 'الأنشطة والجولات',
        nameEn: 'Activities & Tours',
        percentage: Math.round(pAct * 100),
        amount: totalBudget * pAct,
        color: '#a855f7', // Purple
        hoverColor: '#c084fc',
        icon: '🎡',
        description: 'تذاكر المعالم والمتاحف والرحلات الميدانية والأنشطة',
      },
      {
        id: 'transit',
        name: 'المواصلات الداخلية',
        nameEn: 'Transit & Mobility',
        percentage: Math.round(pTra * 100),
        amount: totalBudget * pTra,
        color: '#38bdf8', // Sky Blue
        hoverColor: '#7dd3fc',
        icon: '🚇',
        description: 'المترو وتطبيقات التوصيل والقطارات والوقود',
      },
      {
        id: 'buffer',
        name: 'الطوارئ والتسوق',
        nameEn: 'Shopping & Contingency',
        percentage: Math.round(pShop * 100),
        amount: totalBudget * pShop,
        color: '#10b981', // Emerald
        hoverColor: '#34d399',
        icon: '🛍️',
        description: 'المشتريات التذكارية ومخصص الأمان للمصاريف غير المتوقعة',
      },
    ];
  }, [totalBudget, customBreakdown]);

  // Render D3 Chart
  useEffect(() => {
    if (!svgRef.current) return;

    const width = 280;
    const height = 280;
    const margin = 10;
    const radius = Math.min(width, height) / 2 - margin;
    const innerRadius = radius * 0.62; // Donut style

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // D3 Pie Generator
    const pie = d3
      .pie<BudgetSliceData>()
      .value((d) => d.amount)
      .sort(null)
      .padAngle(0.035);

    // Standard Arc
    const arc = d3
      .arc<d3.PieArcDatum<BudgetSliceData>>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .cornerRadius(6);

    // Expanded Hover Arc
    const arcHover = d3
      .arc<d3.PieArcDatum<BudgetSliceData>>()
      .innerRadius(innerRadius - 3)
      .outerRadius(radius + 7)
      .cornerRadius(8);

    const arcs = g
      .selectAll('.arc')
      .data(pie(slicesData))
      .enter()
      .append('g')
      .attr('class', 'arc')
      .style('cursor', 'pointer');

    // Paths with smooth transition & events
    arcs
      .append('path')
      .attr('d', (d) => arc(d) as string)
      .attr('fill', (d) => d.data.color)
      .attr('stroke', '#141414')
      .attr('stroke-width', 2.5)
      .style('transition', 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)')
      .on('mouseenter', function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', arcHover(d) as string)
          .attr('fill', d.data.hoverColor)
          .style('filter', 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))');
        setActiveCategory(d.data);
        setHoveredSlice(d.data.id);
      })
      .on('mouseleave', function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', arc(d) as string)
          .attr('fill', d.data.color)
          .style('filter', 'none');
        setActiveCategory(null);
        setHoveredSlice(null);
      })
      .on('click', (_event, d) => {
        setActiveCategory(d.data);
      });

    // Gentle entry rotation animation
    arcs
      .selectAll('path')
      .transition()
      .duration(650)
      .attrTween('d', function (d: any) {
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) {
          return arc(i(t)) as string;
        };
      });
  }, [slicesData]);

  const active = activeCategory || slicesData[0];
  const isHovering = Boolean(activeCategory);

  return (
    <div className="bg-[#121212] border border-neutral-800/90 rounded-2xl p-5 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
            <PieIcon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>المخطط البياني التفاعلي للميزانية (D3 Budget Engine)</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                تفاعلي
              </span>
            </h4>
            <p className="text-[11px] text-neutral-400">
              حرّك المؤشر فوق قطاعات الدائرة للاطلاع على تفاصيل كل بند ونسبته المحسوبة
            </p>
          </div>
        </div>

        <div className="text-left">
          <span className="text-[10px] text-neutral-500 block">المجموع الإجمالي:</span>
          <span className="text-xs sm:text-sm font-black font-mono text-[#d4af37]">
            {totalBudget.toLocaleString('en-US', { maximumFractionDigits: 0 })} {currencySymbol}
          </span>
        </div>
      </div>

      {/* Chart Layout: Visual Pie + Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left (D3 Donut Chart SVG) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-[240px] h-[240px] sm:w-[260px] sm:h-[260px] flex items-center justify-center">
            <svg ref={svgRef} className="w-full h-full drop-shadow-xl" />

            {/* Center Donut Info Badge */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isHovering ? active.id : 'total'}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-0.5"
                >
                  <span className="text-lg">{isHovering ? active.icon : '💰'}</span>
                  <span className="text-[11px] font-bold text-neutral-300 block max-w-[120px] truncate">
                    {isHovering ? active.name : 'إجمالي الميزانية'}
                  </span>
                  <div className="text-xs sm:text-sm font-black font-mono text-white">
                    {isHovering
                      ? `${active.amount.toLocaleString('en-US', { maximumFractionDigits: 0 })} ${currencySymbol}`
                      : `${totalBudget.toLocaleString('en-US', { maximumFractionDigits: 0 })} ${currencySymbol}`}
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded font-mono" style={{ color: isHovering ? active.color : '#d4af37' }}>
                    {isHovering ? `${active.percentage}% من الميزانية` : `${durationDays} أيام`}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <span className="text-[10px] text-neutral-500 pt-1 text-center">
            💡 اضغط أو مرر الفأرة فوق أي فئة لإبراز تفاصيلها
          </span>
        </div>

        {/* Right (Interactive Interactive Category Breakdown List) */}
        <div className="md:col-span-7 space-y-2">
          {slicesData.map((slice) => {
            const isSelected = hoveredSlice === slice.id || (!hoveredSlice && active.id === slice.id);
            const daily = durationDays > 0 ? slice.amount / durationDays : 0;

            return (
              <div
                key={slice.id}
                onMouseEnter={() => {
                  setActiveCategory(slice);
                  setHoveredSlice(slice.id);
                }}
                onMouseLeave={() => {
                  setActiveCategory(null);
                  setHoveredSlice(null);
                }}
                onClick={() => setActiveCategory(slice)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-[#1e1e1e] border-neutral-600 shadow-md scale-[1.01]'
                    : 'bg-[#151515] hover:bg-[#1a1a1a] border-neutral-800 text-neutral-300'
                }`}
              >
                {/* Left side: Icon & Category name */}
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shadow-inner"
                    style={{ backgroundColor: `${slice.color}25`, border: `1px solid ${slice.color}60` }}
                  >
                    <span>{slice.icon}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">{slice.name}</span>
                      <span
                        className="text-[10px] font-mono font-black px-1.5 py-0.2 rounded"
                        style={{ color: slice.color, backgroundColor: `${slice.color}20` }}
                      >
                        {slice.percentage}%
                      </span>
                    </div>
                    <span className="text-[10px] text-neutral-400 block max-w-[210px] sm:max-w-xs truncate">
                      {slice.description}
                    </span>
                  </div>
                </div>

                {/* Right side: Converted Amount and Daily calculation */}
                <div className="text-left flex-shrink-0">
                  <div className="text-xs sm:text-sm font-black font-mono text-white">
                    {slice.amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}{' '}
                    <span className="text-[10px] text-neutral-400 font-normal">{currencySymbol}</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono block">
                    ~{daily.toLocaleString('en-US', { maximumFractionDigits: 0 })} / يوم
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

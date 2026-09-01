import { GeneratedPlan } from '../types';

export type SmartTipCategory = 
  | 'timing_crowds' 
  | 'dress_code' 
  | 'ticket_hacks' 
  | 'photography' 
  | 'hidden_secrets' 
  | 'transit_etiquette';

export interface SmartActivityTip {
  id: string;
  activityTitle: string;
  dayNumber: number;
  timeSlot?: string;
  category: SmartTipCategory;
  categoryLabel: string;
  icon: string;
  badgeColor: string;
  title: string;
  tipText: string;
  highlightSnippet: string; // Brief one-line takeaway
  recommendedAction?: string;
  isApplied?: boolean;
}

/**
 * Generate rich, contextual smart tips for the itinerary
 */
export function generateSmartTipsForPlan(plan: GeneratedPlan): SmartActivityTip[] {
  const tips: SmartActivityTip[] = [];
  const destination = plan.destination;
  const md = plan.itineraryMarkdown;

  // Rule-based and contextual intelligence extractor
  const lowerDest = destination.toLowerCase();

  // Helper to add tip
  const addTip = (
    dayNum: number,
    activityTitle: string,
    timeSlot: string,
    category: SmartTipCategory,
    categoryLabel: string,
    icon: string,
    badgeColor: string,
    title: string,
    tipText: string,
    highlightSnippet: string,
    recommendedAction?: string
  ) => {
    tips.push({
      id: `tip-${dayNum}-${tips.length + 1}`,
      activityTitle,
      dayNumber: dayNum,
      timeSlot,
      category,
      categoryLabel,
      icon,
      badgeColor,
      title,
      tipText,
      highlightSnippet,
      recommendedAction,
      isApplied: false,
    });
  };

  // Extract days from plan
  const dayMatches = md.split(/(?:###|##|\*\*)\s*اليوم/gi).slice(1);

  if (dayMatches.length > 0) {
    dayMatches.forEach((dayChunk, index) => {
      const dayNum = index + 1;
      const lines = dayChunk.split('\n');

      lines.forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;

        // Morning activities
        if (trimmed.includes('صباح') || trimmed.includes('Morning') || trimmed.includes('09:') || trimmed.includes('10:')) {
          const actName = trimmed.replace(/^[-*•\d.:\s*]+/, '').split(/[،,.]/)[0];
          if (actName.length > 3) {
            // Timing & Crowd Avoidance tip
            addTip(
              dayNum,
              actName,
              'الفترة الصباحية',
              'timing_crowds',
              'توقيت الزيارة والزحام',
              '⏰',
              'bg-amber-950/50 text-amber-300 border-amber-500/30',
              'الوصول المبكر يمنحك تجربة هادئة بدون طوابير',
              `يُفضل الوصول إلى ${actName} قبل الساعة 09:30 صباحاً، حيث تبدأ الحافلات السياحية بالتوافد بعد العاشرة، مما يتيح لك الاستمتاع بصفاء المكان وإجراء جولات تصويرية رائعة بدون ازدحام.`,
              'ابدأ نشاطك قبل 09:30 صباحاً لتفادي حشود الأفواج السياحية',
              'ضبط المنبه والانطلاق مبكراً'
            );

            // Photography lighting tip
            addTip(
              dayNum,
              actName,
              'الفترة الصباحية',
              'photography',
              'أفضل زوايا التصوير',
              '📸',
              'bg-purple-950/50 text-purple-300 border-purple-500/30',
              'إضاءة الصباح الناعمة تمنحك صوراً نقية',
              `استغل الإضاءة الصباحية غير المباشرة من الجهة الشرقية لالتقاط واجهات المعلم دون ظلال حادة مزعجة. تجنب التصوير المباشر مقابل قرص الشمس.`,
              'التقط صورك من الزاوية الشرقية مع أشعة الشمس الصباحية',
              'تحضير زاوية التصوير'
            );
          }
        }

        // Afternoon & Cultural / Heritage
        if (trimmed.includes('مسجد') || trimmed.includes('معبد') || trimmed.includes('متحف') || trimmed.includes('تراث') || trimmed.includes('قصر') || trimmed.includes('قلعة')) {
          const actName = trimmed.replace(/^[-*•\d.:\s*]+/, '').split(/[،,.]/)[0];
          if (actName.length > 3) {
            // Dress code & etiquette
            addTip(
              dayNum,
              actName,
              'فترة الظهيرة / بعد الظهر',
              'dress_code',
              'اللباس والآداب المحلية',
              '👔',
              'bg-blue-950/50 text-blue-300 border-blue-500/30',
              'الالتزام بالزي المحتشم والمريح للمشي',
              `تتطلب المزارات التراثية والدينية في ${destination} ملابس محتشمة تغطي الكتفين والركبتين، مع سهولة خلع الحذاء عند المداخل إن لزم. كما يوصى بارتداء أحذية رياضية مريحة مع جوارب قطنية للمشي على الأرضيات التاريخية.`,
              'ارتدِ زياً محتشماً وحذاءً مريحاً وسهل النزع',
              'تجهيز الزي الملائم'
            );

            // Ticket Hacks
            addTip(
              dayNum,
              actName,
              'فترة الظهيرة / بعد الظهر',
              'ticket_hacks',
              'حيل التذاكر السريعة',
              '🎟️',
              'bg-emerald-950/50 text-emerald-300 border-emerald-500/30',
              'تذاكر الهاتف الرقمية والبطاقات المجمعة',
              `شراء التذكرة عبر الإنترنت يتيح لك الدخول من المسار المخصص (Priority Line). تحقق إذا كانت المدينة توفر بطاقة متاحف مجمعة (City Pass) لتوفير ما يصل إلى 35% من كلفة الدخول المتفرقة.`,
              'استخدم التذاكر الرقمية المسبقة لتخطي طابور شباك التذاكر',
              'حجز تذكرة رقمية مسبقة'
            );
          }
        }

        // Evening / Sunset activities
        if (trimmed.includes('مساء') || trimmed.includes('غروب') || trimmed.includes('ليل') || trimmed.includes('عشاء') || trimmed.includes('18:') || trimmed.includes('19:')) {
          const actName = trimmed.replace(/^[-*•\d.:\s*]+/, '').split(/[،,.]/)[0];
          if (actName.length > 3) {
            // Hidden secrets & Golden hour
            addTip(
              dayNum,
              actName,
              'الفترة المسائية والغروب',
              'hidden_secrets',
              'أسرار وزوايا خفية',
              '🤫',
              'bg-rose-950/50 text-rose-300 border-rose-500/30',
              'زوايا بانورامية مجانية ومقاهي مطلة',
              `بدلاً من منصات المشاهدة المكتظة، توجد شرفات ومقاهي قريبة في الطوابق العليا توفر إطلالة ساحرة على أفق ${destination} مع المشروبات والقهوة بأسعار معقولة جداً.`,
              'استمتع بالغروب من شرفات المقاهي المرتفعة بدلاً من المنصات المزدحمة',
              'اكتشاف إطلالة بديلة'
            );

            // Transit & safety tip
            addTip(
              dayNum,
              actName,
              'الفترة المسائية والغروب',
              'transit_etiquette',
              'المواصلات والدفع الذكي',
              '💳',
              'bg-teal-950/50 text-teal-300 border-teal-500/30',
              'الدفع اللاتلامسي وتطبيقات النقل المعتمدة',
              `في فترات المساء، اعتمد على تطبيقات النقل الرسمية المربوطة بالبطاقة الائتمانية لتجنب الخلاف على أسعار العدادات، واحرص على الاحتفاظ بمبلغ نقدي صغير للأسواق الشعبية والمحلات العتيقة.`,
              'استخدم الدفع اللاتلامسي وتطبيقات النقل المعتمدة ليلاً',
              'تفعيل محفظة الهاتف الذكي'
            );
          }
        }
      });
    });
  }

  // Ensure we have at least 4-6 rich smart tips even for brief plans
  if (tips.length < 4) {
    const generalTips: Array<{
      category: SmartTipCategory;
      categoryLabel: string;
      icon: string;
      badgeColor: string;
      title: string;
      tipText: string;
      highlight: string;
      day: number;
    }> = [
      {
        category: 'timing_crowds',
        categoryLabel: 'توقيت الزيارة والزحام',
        icon: '⏰',
        badgeColor: 'bg-amber-950/50 text-amber-300 border-amber-500/30',
        title: `قاعدة الساعات الذهبية في ${destination}`,
        tipText: `أفضل الفترات لاستكشاف الشوارع والمعالم السياحية الرئيسية هي بين 8:30 و10:30 صباحاً، أو بعد 4:30 عصراً مع انكسار أشعة الشمس وتراجع كثافة الأفواج السياحية.`,
        highlight: 'استكشف المعالم في الصباح الباكر أو بعد الرابعة عصراً',
        day: 1,
      },
      {
        category: 'dress_code',
        categoryLabel: 'الملابس والراحة',
        icon: '👔',
        badgeColor: 'bg-blue-950/50 text-blue-300 border-blue-500/30',
        title: 'طبقات الملابس والأحذية المناسبة للأرصفة الحجرية',
        tipText: `تتميز الأزقة القديمة بأرصفة حجرية تتطلب أحذية ذات نعل ممتص للصدمات. احتفظ بوشاح خفيف أو سترة في حقيبة الظهر للتعامل مع التغيرات المفاجئة في درجات الحرارة بين الأماكن المغلقة والمفتوحة.`,
        highlight: 'أحذية رياضية قوية مع سترة خفيفة في حقيبة الظهر',
        day: 1,
      },
      {
        category: 'ticket_hacks',
        categoryLabel: 'حيل التوفير والتذاكر',
        icon: '🎟️',
        badgeColor: 'bg-emerald-950/50 text-emerald-300 border-emerald-500/30',
        title: 'حجز التذاكر عبر التطبيقات الرسمية',
        tipText: `حجز التذاكر الرسمية عبر الإنترنت قبل الزيارة بـ 48 ساعة يضمن لك الدخول السريع ويحميك من رسوم السماسرة في شوارع المعالم.`,
        highlight: 'احجز التذاكر من المواقع الرسمية مسبقاً وتجنب شباك الانتظار',
        day: 2,
      },
      {
        category: 'hidden_secrets',
        categoryLabel: 'أسرار وتجارب خفية',
        icon: '🤫',
        badgeColor: 'bg-rose-950/50 text-rose-300 border-rose-500/30',
        title: 'أزقة ومطاعم السكان المحليين خلف الشوارع الرئيسية',
        tipText: `ابتعد مسافة شارعين فقط عن الميدان السياحي الرئيسي لتجد مطاعم عائلية تقدم أطباقاً محلية أصيلة بنصف السعر وجودة أعلى بكثير.`,
        highlight: 'تناول طعامك على بعد شارعين من الساحات السياحية لتجربة أصيلة واقتصادية',
        day: 2,
      },
    ];

    generalTips.forEach((gt, idx) => {
      addTip(
        gt.day,
        `استكشاف ${destination}`,
        gt.day === 1 ? 'اليوم الأول' : 'اليوم الثاني',
        gt.category,
        gt.categoryLabel,
        gt.icon,
        gt.badgeColor,
        gt.title,
        gt.tipText,
        gt.highlight,
        'تطبيق التلميحة'
      );
    });
  }

  return tips;
}

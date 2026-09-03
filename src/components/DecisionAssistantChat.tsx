import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { 
  Send, Bot, User, X, Sparkles, Compass, ShieldCheck, Zap
} from 'lucide-react';
import { ChatMessage, GeneratedPlan } from '../types';
import { SupportedLanguage } from '../utils/i18n';

interface DecisionAssistantChatProps {
  isOpen: boolean;
  onClose: () => void;
  plan: GeneratedPlan | null;
  initialMessage?: string;
  currentLanguage?: SupportedLanguage;
}

const PHARAONIC_QUICK_SUGGESTIONS = [
  '⚡ ما أفضل خطة بديلة وسريعة في حال هطول أمطار أو ازدحام؟',
  '𓂀 رتب لي جولة فرعونية ملكية في الأهرامات والمتحف الكبير لتفادي الزحام.',
  '🍽️ اقترح أفضل 3 مطاعم عائلية وحلال قريبة ذات طابع أصيل.',
  '💰 كيف يمكن تقليل الميزانية بنسبة 20% دون التأثير على جودة الرحلة؟',
  '⛵ كيف أنسق جولة نيلية عند الغروب مع عشاء تقليدي فاخر؟',
  '🚗 هل الأفضل استئجار سيارة خاصة أم الاعتماد على تطبيقات التوصيل والمترو؟',
];

export const DecisionAssistantChat: React.FC<DecisionAssistantChatProps> = ({
  isOpen,
  onClose,
  plan,
  initialMessage,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (messages.length === 0) {
        const initialGreeting: ChatMessage = {
          id: 'welcome-royal-1',
          role: 'assistant',
          text: plan
            ? `𓂀 **مرحباً بك في مجلس المستشار الملكي الذكي** لرحلتك إلى **${plan.destination}** (${plan.durationDays} أيام)!\n\nأنا جاهز لتقديم إجابات فورية وقرارات مدروسة في ثوانٍ معدودة:\n- ⚡ **بدائل فورية وخطة طوارئ** عند أي تأخير أو تقلب جوي\n- 💎 **تجارب محلية وتراثية أصيلة** غير سياحية\n- 💰 **تحسين الميزانية والتوفير الذكي**\n- 📍 **أفضل أوقات الزيارة ومسارات التنقل الملكية**\n\nما الذي تود استشارته أو تعديله في مسارك الآن؟`
            : '𓂀 مرحباً بك! أنا **المستشار الملكي الذكي للسفر**. كيف يمكنني مساعدتك في تخطيط وجهاتك واستفساراتك السياحية الآن بسرعة فائقة؟',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages([initialGreeting]);
      }

      if (initialMessage && initialMessage.trim()) {
        handleSend(initialMessage);
      }
    }
  }, [isOpen, initialMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const assistantMsgId = `assistant-${Date.now()}`;
    const initialAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      text: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg, initialAssistantMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Try streaming endpoint for 0-latency typing response
      const response = await fetch('/api/ask-concierge-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          currentItinerary: plan?.itineraryMarkdown || '',
          context: plan ? plan.constraints : null,
        }),
      });

      if (response.ok && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.replace('data: ', '').trim();
              if (dataStr === '[DONE]') {
                break;
              }
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.text) {
                  accumulated += parsed.text;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMsgId ? { ...msg, text: accumulated } : msg
                    )
                  );
                }
              } catch {
                // Ignore parse errors on partial lines
              }
            }
          }
        }

        if (!accumulated.trim()) {
          // If empty stream, fallback to standard endpoint
          await fetchStandardFallback(query, assistantMsgId);
        }
      } else {
        await fetchStandardFallback(query, assistantMsgId);
      }
    } catch {
      await fetchStandardFallback(query, assistantMsgId);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStandardFallback = async (query: string, assistantMsgId: string) => {
    try {
      const res = await fetch('/api/ask-concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          currentItinerary: plan?.itineraryMarkdown || '',
          context: plan ? plan.constraints : null,
        }),
      });
      const data = await res.json();
      const answer = data.answer || 'عذراً، لم أتمكن من إيجاد رد في الوقت الحالي.';
      setMessages((prev) =>
        prev.map((msg) => (msg.id === assistantMsgId ? { ...msg, text: answer } : msg))
      );
    } catch (e: any) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                text: `⚠️ حدث خطأ أثناء الاتصال: ${e.message || 'يرجى المحاولة ثانية.'}`,
              }
            : msg
        )
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      {/* Pharaonic Royal Chat Container */}
      <div className="w-full max-w-2xl bg-gradient-to-b from-[#0e1626] via-[#090d17] to-[#06080e] border border-[#d4af37]/40 rounded-3xl shadow-[0_0_40px_rgba(212,175,55,0.15)] flex flex-col h-[92vh] sm:h-[82vh] overflow-hidden">
        
        {/* Pharaonic Header */}
        <div className="p-4 sm:px-6 bg-[#0a101d] border-b border-[#d4af37]/30 flex items-center justify-between relative overflow-hidden">
          {/* Subtle Hieroglyph Gold Watermark Accent */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none text-4xl select-none font-serif tracking-widest text-[#d4af37]">
            𓂀 𓆣 𓋹 𓊪 𓎛 𓏏 𓉴
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#8a6d1c] p-0.5 shadow-md shadow-[#d4af37]/30 flex items-center justify-center">
              <div className="w-full h-full bg-[#0d1626] rounded-[14px] flex items-center justify-center text-[#d4af37]">
                <span className="text-xl">𓂀</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-white text-sm sm:text-base flex items-center gap-1.5">
                  <span>المستشار الملكي الذكي</span>
                  <span className="text-[11px] text-[#d4af37]">𓍹SmartTravel𓍺</span>
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#d4af37]/15 text-[#f5d061] border border-[#d4af37]/40 font-bold flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5 text-[#d4af37]" />
                  <span>فوري وسريع</span>
                </span>
              </div>
              <p className="text-xs text-[#9eb3cf]">
                {plan ? `متصل مع سياق رحلة ${plan.destination}` : 'استشارات سياحية وقرارات فورية'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#141f33] hover:bg-[#1d2c47] text-[#9eb3cf] hover:text-white border border-[#d4af37]/20 flex items-center justify-center transition-colors cursor-pointer relative z-10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2.5 bg-[#070b13] border-b border-[#d4af37]/20 flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
          <span className="text-[#d4af37] whitespace-nowrap flex items-center gap-1 font-bold text-[11px]">
            <Sparkles className="w-3 h-3 text-[#d4af37]" />
            اقتراحات سريعة:
          </span>
          {PHARAONIC_QUICK_SUGGESTIONS.map((sug, i) => (
            <button
              key={i}
              onClick={() => handleSend(sug)}
              disabled={isLoading}
              className="px-3 py-1 rounded-full bg-[#0d1627] hover:bg-[#16243f] text-[#d3e2f5] border border-[#d4af37]/30 hover:border-[#d4af37] whitespace-nowrap text-[11px] font-medium transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1 shadow-sm"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-[#d4af37] text-black font-black shadow-md shadow-[#d4af37]/30'
                      : 'bg-[#0f1a2d] text-[#d4af37] border border-[#d4af37]/40'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <span className="text-base">𓂀</span>}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#e6b800] text-black font-semibold rounded-tr-none shadow-lg shadow-[#d4af37]/15'
                      : 'bg-[#0d1628]/90 text-neutral-100 border border-[#d4af37]/30 rounded-tl-none shadow-md backdrop-blur-sm'
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  ) : msg.text ? (
                    <div className="markdown-body">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-[#d4af37]">
                      <div className="w-3.5 h-3.5 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
                      <span>المستشار الملكي يكتب الرد الآن...</span>
                    </div>
                  )}
                  <span className={`block text-[10px] mt-2 text-left rtl:text-right ${isUser ? 'text-black/70' : 'text-[#8aa0be]'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isLoading && messages[messages.length - 1]?.text === '' && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#0f1a2d] text-[#d4af37] border border-[#d4af37]/40 flex items-center justify-center flex-shrink-0">
                <span className="text-base animate-pulse">𓂀</span>
              </div>
              <div className="bg-[#0d1628] rounded-2xl rounded-tl-none p-3.5 border border-[#d4af37]/30 flex items-center gap-2 text-xs text-[#d3e2f5]">
                <div className="w-3.5 h-3.5 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
                <span>المستشار يستشير سجلات الحكمة ويعد القرار الأسرع...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 sm:p-4 bg-[#0a101d] border-t border-[#d4af37]/30 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب استشارتك أو التعديل المطلوب للرد الفوري..."
            disabled={isLoading}
            className="flex-1 bg-[#121c2e] border border-[#d4af37]/30 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder:text-[#6a84a6] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] disabled:opacity-50 transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#b38f22] hover:from-[#e5c158] hover:to-[#c49c2a] text-black flex items-center justify-center font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex-shrink-0 shadow-lg shadow-[#d4af37]/25"
          >
            <Send className="w-4 h-4 rtl:rotate-180" />
          </button>
        </form>
      </div>
    </div>
  );
};

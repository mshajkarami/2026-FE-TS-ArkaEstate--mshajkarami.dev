import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Sparkles,
  CheckCircle2,
  CheckCheck,
  Calendar,
  RotateCcw,
  ArrowUpLeft,
  Building2,
  Loader2,
} from 'lucide-react';
import { LUXURY_PROPERTIES, LuxuryProperty } from '../data/properties';
import { toPersianDigits } from '../utils/format';

interface Message {
  id: string;
  sender: 'kaveh' | 'user';
  text: string;
  timestamp: string;
  featuredProperty?: LuxuryProperty;
  metrics?: {
    liquidityScore: string;
    legalSafety: string;
    fairPriceMargin: string;
  };
}

interface KavehChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPropertyForVip: (property: LuxuryProperty | null) => void;
  initialPropertyContext?: LuxuryProperty | null;
}

const QUICK_STARTERS = [
  {
    id: 'starter-1',
    label: '🔍 حباب‌سنجی نیاوران',
    query: 'قیمت متری پنت‌هاوس نیاوران چقدر با ارزش منصفانه فاصله دارد؟',
  },
  {
    id: 'starter-2',
    label: '📊 بازدهی الهیه vs زعفرانیه',
    query: 'بین سرمایه‌گذاری در الهیه و زعفرانیه در افق ۳ ساله کدام پربازده‌تر است؟',
  },
  {
    id: 'starter-3',
    label: '🏛️ خرید امن خارج از کشور',
    query: 'به عنوان مقیم خارج، چگونه بدون حضور فیزیکی با وکالت سامانه میخک خرید امن داشته باشم؟',
  },
  {
    id: 'starter-4',
    label: '📐 ممیزی ۱۰۰ پوینتی سازه',
    query: 'آرکا استیت در آزمون ۱۰۰ پوینتی سازه دقیقاً چه مواردی از متریال و بتن را کنترل می‌کند؟',
  },
];

const ANALYSIS_STAGES = [
  'در حال واکاوی پرسش و استعلام اولیه سامانه کاداستر...',
  'جستجو در پرونده‌های ثبتی و ۱۰ معامله قطعی اخیر منطقه...',
  'ممیزی مهندسی عیار بتن C40، برند تأسیسات و عایق صوتی...',
  'محاسبه حاشیه چانه‌زنی و تدوین جمع‌بندی کارشناسی کاوه...',
];

export const KavehChatModal: React.FC<KavehChatModalProps> = ({
  isOpen,
  onClose,
  onSelectPropertyForVip,
  initialPropertyContext,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  // Initialize conversation
  useEffect(() => {
    if (!isOpen) return;

    if (initialPropertyContext) {
      setMessages([
        {
          id: 'welcome-context',
          sender: 'kaveh',
          text: `درود بر شما جناب‌عالی. من کاوه هستم؛ مشاور ارشد مجموعه آرکا استیت.\n\nپرونده ممیزی مهندسی و مالی **${initialPropertyContext.title}** (${toPersianDigits(initialPropertyContext.priceBillion)} میلیارد تومان) را برای شما باز کرده‌ام. در خصوص استعلام ثبتی تک‌برگ، عیار بتن سازه، یا حاشیه چانه‌زنی منصفانه این فایل چه پرسشی مدنظر دارید؟`,
          timestamp: 'هم‌اکنون',
          featuredProperty: initialPropertyContext,
          metrics: {
            liquidityScore: `${toPersianDigits(35)} روز`,
            legalSafety: '۱۰۰٪ تک‌برگ',
            fairPriceMargin: `${toPersianDigits(6)}٪ تا ${toPersianDigits(9)}٪`,
          },
        },
      ]);
    } else {
      setMessages([
        {
          id: 'welcome-default',
          sender: 'kaveh',
          text: `درود و احترام جناب‌عالی. من کاوه هستم؛ مشاور ارشد مجموعه آرکا استیت.\n\nمن پورسانتی از معاملات دریافت نمی‌کنم؛ هدف من ممیزی مهندسی ۱۰۰ پوینتی، حباب‌سنجی قیمت و حفاظت از سرمایه شما در بازار پرابهام املاک شمیرانات است.\n\nمی‌توانید مستقیماً پرسش خود را مطرح نمایید یا از محورهای تحلیلی پیشنهادی استفاده کنید.`,
          timestamp: 'هم‌اکنون',
        },
      ]);
    }

    return () => {
      clearAllTimers();
    };
  }, [isOpen, initialPropertyContext]);

  // Scroll to bottom when new messages arrive or when analyzing state updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAnalyzing, analysisProgress]);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isAnalyzing) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'هم‌اکنون',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');

    // Begin multi-stage AI audit animation with progress bar
    setIsAnalyzing(true);
    setAnalysisProgress(15);
    setCurrentStageIndex(0);
    clearAllTimers();

    // Stage 1
    const t1 = setTimeout(() => {
      setAnalysisProgress(45);
      setCurrentStageIndex(1);
    }, 600);

    // Stage 2
    const t2 = setTimeout(() => {
      setAnalysisProgress(75);
      setCurrentStageIndex(2);
    }, 1300);

    // Stage 3
    const t3 = setTimeout(() => {
      setAnalysisProgress(95);
      setCurrentStageIndex(3);
    }, 1900);

    // Final Stage: 100% and emit answer
    const t4 = setTimeout(() => {
      setAnalysisProgress(100);

      const t5 = setTimeout(() => {
        let responseText = '';
        let featuredProp: LuxuryProperty | undefined;
        let metrics: Message['metrics'];

        const lower = text.toLowerCase();

        if (lower.includes('نیاوران') || lower.includes('حباب') || lower.includes('۸۵')) {
          featuredProp = LUXURY_PROPERTIES.find((p) => p.neighborhood === 'niavaran');
          responseText = `بررسی داده‌های ۱۰ معامله قطعی اخیر در گذر نیاوران نشان می‌دهد که بهای هر مترمربع این پنت‌هاوس حدود ۵.۸٪ بالاتر از میانگین ثبت اسناد است.\n\nبا این حال، به موجب گزارش ممیزی مهندس سازه آرکا، کاربرد بتن رده C40، سیستم چیلر مرکزی Daikin و عایق صوتی ۳ لایه اروپایی، ارزش افزوده ذاتی متری ۲۱ میلیون تومان را توجیه می‌کند.\n\n**توصیه استراتژیک کاوه:** برای ورود بدون ریسک، حاشیه چانه‌زنی منطقی جهت تثبیت قیمت بین ۷۹ تا ۸۲ میلیارد تومان وجود دارد.`;
          metrics = {
            liquidityScore: '۳۸ روز',
            legalSafety: '۱۰۰٪ کاداستر',
            fairPriceMargin: '۷٪ چانه‌زنی',
          };
        } else if (lower.includes('الهیه') || lower.includes('زعفرانیه') || lower.includes('مقایسه')) {
          featuredProp = LUXURY_PROPERTIES.find((p) => p.neighborhood === 'elahieh');
          responseText = `در افق ۳ ساله (۱۴۰۵ تا ۱۴۰۸)، مقایسه این دو منطقه به شرح زیر است:\n\n۱. **الهیه:** نقدشوندگی بالاتر در پنت‌هاوس‌ها، بازدهی اجاره‌ای بر مبنای ارز (حدود ۴.۶٪ سالانه)، اما ورود نیازمند بودجه بالاتر از ۹۰ میلیارد تومان.\n۲. **زعفرانیه:** پتانسیل رشد ارزش ذاتی بالاتر به دلیل کمبود زمین در بافت اصیل و مشاعات هتلینگ قوی‌تر.\n\nاگر اولویت شما **حفظ ارزش در برابر تورم با نقدشوندگی سریع** است، الهیه برنده است. اگر به دنبال **پرستیژ سکونت کلکسیونی** هستید، پروژه‌های اصیل زعفرانیه ارجحیت دارند.`;
          metrics = {
            liquidityScore: '۳۴ روز',
            legalSafety: 'سند شاهنشاهی',
            fairPriceMargin: '۵٪ چانه‌زنی',
          };
        } else if (lower.includes('خارج') || lower.includes('میخک') || lower.includes('کانادا') || lower.includes('اروپا') || lower.includes('دبی')) {
          responseText = `برای ایرانیان مقیم خارج از کشور، پروتکل ۵ مرحله‌ای «پرایوت-کلاینت» آرکا استیت به شرح زیر اجرا می‌شود:\n\n۱. **استعلام برخط ثبتی تک‌برگ:** کنترل عدم بازداشت، عدم توقیف و تطابق نام مالک رسمی پیش از تبادل هر ریال.\n۲. **بازرسی فنی ویدیویی زنده:** اعزام مهندس ارشد سازه با تماس تصویری ۴K و گزارش ضخامت‌سنجی رنگ و تست آکوستیک.\n۳. **تنظیم وکالت‌نامه در سامانه میخک:** صدور وکالت کاری محضری منحصراً جهت پیگیری امور اداری بدون حق واگذاری دارایی.\n۴. **تسویه امن مالی:** از طریق حساب‌های تراستی صرافی‌های دارای پروانه رسمی بین‌المللی.\n۵. **مدیریت دارایی:** تحویل کلید، نصب دزدگیر هوشمند و مدیریت اجاره‌داری دلاری.`;
          metrics = {
            liquidityScore: 'پوشش کامل',
            legalSafety: '۱۰۰٪ سامانه میخک',
            fairPriceMargin: 'صفر ریسک',
          };
        } else if (lower.includes('ممیزی') || lower.includes('متریال') || lower.includes('بتن') || lower.includes('سازه')) {
          responseText = `چک‌لیست ممیزی ۱۰۰ پوینتی مهندسی آرکا استیت شامل ۴ رکن آزمایشگاهی است:\n\n• **ژئوتکنیک و سازه:** شیت نتایج آزمایشگاه بتن و جوش، بررسی درز انقطاع و مقاومت در برابر شتاب زلزله تا ۸ ریشتر.\n• **تاسیسات مکانیکی:** اصالت برند کمپرسور چیلرها، شیرآلات توکار Grohe/Hansgrohe آلمان و سیستم بوستر پمپ گراندفوس.\n• **ایزولاسیون و آکوستیک:** پایش ضریب انتقال صوت بین واحدها (کمتر از ۴۲ دسی‌بل) و پنجره‌های ترمال‌بریک Schüco.\n• **حقوقی و کاداستر:** تطابق متراژ دقیق پایان‌کار شهرداری با نقشه وضع موجود جهت جلوگیری از ادعای اضافه مساحت.`;
          metrics = {
            liquidityScore: '۱۰۰ پوینت',
            legalSafety: '۳ مُهر مستقل',
            fairPriceMargin: 'ضمانت کتبی',
          };
        } else if (lower.includes('بودجه') || lower.includes('میلیارد') || lower.includes('پیشنهاد')) {
          featuredProp = LUXURY_PROPERTIES[1];
          responseText = `بر مبنای الگوریتم تطبیق سبد دارایی آرکا استیت، بهترین پیشنهاد با ضریب نقدشوندگی بالا، فایل‌های آماده تحویل با ریشه سند پاک و مشاعات کامل است.\n\nبه عنوان نمونه، فایل **${featuredProp.title}** با پلان شاهکار، دسترسی سریع و ارزش افزوده فاز پایانی، یکی از متعادل‌ترین گزینه‌های حال حاضر منطقه است. مایلید شناسنامه ممیزی کامل آن را مشاهده کنید؟`;
          metrics = {
            liquidityScore: `${toPersianDigits(featuredProp.liquidityScore || 38)} روز`,
            legalSafety: 'تک‌برگ پاک',
            fairPriceMargin: '۸٪ تخفیف نقدی',
          };
        } else {
          responseText = `پرسش شما در سامانه پردازش الگوریتمی آرکا استیت ثبت شد. ممیزی پرونده‌های شمیرانات نشان می‌دهد که دقت در استعلام ریشه سند و مقاومت سازه همواره بر نمای ظاهری اولویت دارد.\n\nبرای دریافت سنجه‌های دقیق آماری و بررسی پرونده مدنظر، می‌توانید از محورهای زیر انتخاب کنید یا با کارشناسان ارشد ما جلسه محرمانه حضوری رزرو نمایید.`;
          metrics = {
            liquidityScore: '۹۲٪',
            legalSafety: '۱۰۰٪ ممیزی',
            fairPriceMargin: 'قابل مذاکره',
          };
        }

        const kavehReply: Message = {
          id: `kaveh-${Date.now()}`,
          sender: 'kaveh',
          text: responseText,
          timestamp: 'هم‌اکنون',
          featuredProperty: featuredProp,
          metrics,
        };

        setMessages((prev) => [...prev, kavehReply]);
        setIsAnalyzing(false);
      }, 250);

      timersRef.current.push(t5);
    }, 2400);

    timersRef.current.push(t1, t2, t3, t4);
  };

  const handleClearHistory = () => {
    clearAllTimers();
    setIsAnalyzing(false);
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'kaveh',
        text: `تاریخچه گفت‌وگو بازنشانی شد. مهندس کاوه آماده ممیزی و ارائه سنجه‌های مالی و حقوقی املاک شمیرانات است.`,
        timestamp: 'هم‌اکنون',
      },
    ]);
  };

  // Helper to cleanly render text with bold tags (**bold**) and nice line spacing
  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, lineIdx) => {
      if (!line.trim()) {
        return <div key={lineIdx} className="h-1.5" />;
      }

      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <div key={lineIdx} className="leading-relaxed">
          {parts.map((part, partIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              const clean = part.slice(2, -2);
              return (
                <strong key={partIdx} className="font-extrabold text-[#0B2B22]">
                  {clean}
                </strong>
              );
            }
            return <span key={partIdx}>{part}</span>;
          })}
        </div>
      );
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="kaveh-chat-title"
      className="fixed bottom-3 sm:bottom-24 right-3 left-3 sm:left-auto sm:right-6 z-50 sm:w-[420px] max-w-[420px] mx-auto sm:mx-0 h-[600px] max-h-[88vh] sm:max-h-[82vh] flex flex-col rounded-3xl bg-[#EFEAE2] border border-[#C5A880]/40 shadow-[0_16px_50px_rgba(11,27,23,0.38)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-250 pointer-events-auto"
      style={{
        backgroundImage: `radial-gradient(#D5CEBE 0.75px, transparent 0.75px)`,
        backgroundSize: '16px 16px',
      }}
    >
      {/* WhatsApp Luxury Green Top Bar */}
      <header className="px-4 py-3 bg-[#0B2B22] text-[#FBFBF8] border-b border-[#C5A880]/30 flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          {/* Kaveh Circular Avatar with WhatsApp-style online dot */}
          <div className="relative shrink-0">
            <img
              src="./kaveh.jpg"
              alt="مهندس کاوه"
              className="w-10 h-10 rounded-full object-cover border-2 border-[#C5A880] shadow"
            />
            <span
              className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0B2B22] absolute bottom-0 left-0"
              title="آنلاین"
            />
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1.5">
              <h3 id="kaveh-chat-title" className="text-sm font-black tracking-tight text-white">
                مهندس کاوه
              </h3>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A880]" />
            </div>
            <p className="text-[11px] text-[#DFCAAA] font-medium leading-tight">
              مشاور ارشد مجموعه آرکا استیت
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleClearHistory}
            title="پاکسازی تاریخچه چت"
            className="w-8 h-8 rounded-full hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onSelectPropertyForVip(null);
            }}
            title="رزرو جلسه حضوری"
            className="w-8 h-8 rounded-full hover:bg-white/10 text-[#C5A880] hover:text-[#DFCAAA] flex items-center justify-center transition-colors cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="بستن چت کاوه"
            className="w-8 h-8 rounded-full hover:bg-white/10 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Messages Stream - WhatsApp Wallpaper Background */}
      <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 text-right">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            {/* Bubble */}
            <div
              className={`max-w-[88%] p-3 text-xs sm:text-[13px] leading-relaxed shadow-[0_1px_2px_rgba(0,0,0,0.12)] ${
                msg.sender === 'user'
                  ? 'bg-[#D9FDD3] text-[#111B21] rounded-2xl rounded-tl-xs border border-[#C5E9BF]'
                  : 'bg-white text-[#111B21] rounded-2xl rounded-tr-xs border border-[#E2DBD0]'
              }`}
            >
              <div className="text-[#111B21] space-y-1">
                {renderFormattedText(msg.text)}
              </div>

              {/* Mini Metrics Badge in Light Theme */}
              {msg.metrics && (
                <div className="mt-2.5 pt-2 border-t border-black/8 grid grid-cols-3 gap-1.5 text-center text-[10px]">
                  <div className="bg-[#F6F5F2] rounded-lg p-1.5 border border-[#E7E3DC]">
                    <div className="text-[#667781] text-[9px]">نقدشوندگی</div>
                    <div className="text-[#0B2B22] font-black mt-0.5">{msg.metrics.liquidityScore}</div>
                  </div>
                  <div className="bg-[#F6F5F2] rounded-lg p-1.5 border border-[#E7E3DC]">
                    <div className="text-[#667781] text-[9px]">ایمنی حقوقی</div>
                    <div className="text-emerald-700 font-black mt-0.5">{msg.metrics.legalSafety}</div>
                  </div>
                  <div className="bg-[#F6F5F2] rounded-lg p-1.5 border border-[#E7E3DC]">
                    <div className="text-[#667781] text-[9px]">حاشیه چانه‌زنی</div>
                    <div className="text-[#9A7D56] font-black mt-0.5">{msg.metrics.fairPriceMargin}</div>
                  </div>
                </div>
              )}

              {/* Mini Embedded Property Spotlight with valid image and fallback */}
              {msg.featuredProperty && (
                <div className="mt-2.5 p-2 rounded-xl bg-[#F8F7F4] border border-[#DDD6CC] flex items-center gap-2.5 shadow-2xs">
                  <div className="w-16 h-14 rounded-lg overflow-hidden shrink-0 border border-[#DDD6CC] bg-[#EFEAE2]">
                    <img
                      src={msg.featuredProperty.imageUrl}
                      alt={msg.featuredProperty.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = './images/property_niavaran_garden.jpg';
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-right">
                    <h5 className="text-[11px] font-bold text-[#111B21] truncate">
                      {msg.featuredProperty.title}
                    </h5>
                    <div className="text-[10px] text-[#0B2B22] font-extrabold mt-0.5">
                      {toPersianDigits(msg.featuredProperty.priceBillion)} میلیارد تومان
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelectPropertyForVip(msg.featuredProperty!);
                      }}
                      className="mt-1 text-[10px] text-[#128C7E] hover:text-[#075E54] font-black flex items-center gap-0.5 cursor-pointer transition-colors"
                    >
                      <span>رزرو کارشناسی VIP</span>
                      <ArrowUpLeft className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Timestamp and Double Check Mark */}
              <div className="flex items-center justify-end gap-1 text-[10px] text-[#667781] mt-1.5">
                <span>{msg.timestamp}</span>
                {msg.sender === 'user' && (
                  <CheckCheck className="w-3.5 h-3.5 text-[#53BDEB]" />
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Sophisticated AI Thinking & Multi-Stage Progress Card */}
        {isAnalyzing && (
          <div className="flex flex-col items-start w-full max-w-[90%] animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="w-full bg-white text-[#111B21] rounded-2xl rounded-tr-xs p-3.5 border border-[#C5A880]/40 shadow-[0_4px_12px_rgba(11,43,34,0.08)] space-y-2.5">
              {/* Header with Sparkle Emblem and Percentage */}
              <div className="flex items-center justify-between gap-2 border-b border-[#F0ECE1] pb-2">
                <div className="flex items-center gap-2">
                  <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-[#0B2B22] text-[#C5A880] shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  </div>
                  <div>
                    <span className="text-[11.5px] font-black text-[#0B2B22]">
                      مهندس کاوه در حال بررسی پرونده...
                    </span>
                  </div>
                </div>
                <span className="text-[11.5px] font-mono font-bold text-[#128C7E]">
                  {toPersianDigits(analysisProgress)}٪
                </span>
              </div>

              {/* Dynamic Stage Text with Pulsing Pip */}
              <div className="text-[11.5px] text-[#4A5568] flex items-center gap-2 pr-1 font-medium min-h-[22px] transition-all duration-300">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] shrink-0 animate-pulse" />
                <span className="leading-tight">{ANALYSIS_STAGES[currentStageIndex]}</span>
              </div>

              {/* Progress Bar Track */}
              <div className="w-full h-2 rounded-full bg-[#EFEAE2] overflow-hidden p-0.5 border border-[#DDD6CC]">
                <div
                  className="h-full rounded-full bg-gradient-to-l from-[#C5A880] via-[#128C7E] to-[#0B2B22] transition-all duration-300 ease-out relative overflow-hidden"
                  style={{ width: `${analysisProgress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>

              {/* Micro Step Tags */}
              <div className="flex items-center justify-between text-[8.5px] sm:text-[9px] text-[#8696A0] pt-0.5 px-0.5 font-medium">
                <span className={analysisProgress >= 20 ? 'text-[#128C7E] font-bold' : ''}>۱. استعلام کاداستر</span>
                <span className={analysisProgress >= 50 ? 'text-[#128C7E] font-bold' : ''}>۲. ممیزی سازه</span>
                <span className={analysisProgress >= 80 ? 'text-[#128C7E] font-bold' : ''}>۳. حباب‌سنجی</span>
                <span className={analysisProgress >= 98 ? 'text-[#128C7E] font-bold' : ''}>۴. گزارش نهایی</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Chips Bar (Disabled while analyzing) */}
      <div className="px-3 py-1.5 bg-[#F0F2F5] border-t border-[#E9EDEF] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        {QUICK_STARTERS.map((starter) => (
          <button
            key={starter.id}
            type="button"
            disabled={isAnalyzing}
            onClick={() => handleSendMessage(starter.query)}
            className="px-2.5 py-1 rounded-full text-[10.5px] font-semibold bg-white hover:bg-[#E7F3E6] text-[#111B21] border border-[#D1D7DB] hover:border-[#128C7E] transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {starter.label}
          </button>
        ))}
      </div>

      {/* WhatsApp Light Input Tray */}
      <footer className="p-2.5 bg-[#F0F2F5] border-t border-[#E9EDEF] shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isAnalyzing}
            placeholder={isAnalyzing ? 'کاوه در حال بررسی پرونده است...' : 'پرسش ملکی یا حقوقی خود را بنویسید...'}
            className="flex-1 h-10 px-3.5 rounded-2xl bg-white border border-[#E9EDEF] text-xs sm:text-[13px] text-[#111B21] placeholder:text-[#8696A0] focus:outline-none focus:border-[#128C7E] shadow-2xs disabled:opacity-60 disabled:cursor-not-allowed"
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || isAnalyzing}
            aria-label="ارسال پیام"
            className="w-10 h-10 rounded-full bg-[#128C7E] hover:bg-[#075E54] disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center font-bold transition-all shadow-sm cursor-pointer shrink-0"
          >
            {isAnalyzing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4 scale-x-[-1] ml-0.5" />
            )}
          </button>
        </form>
      </footer>
    </div>
  );
};

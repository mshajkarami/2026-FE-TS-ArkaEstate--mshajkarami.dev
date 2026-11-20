import React, { useState } from 'react';
import {
  ChevronDown,
  HelpCircle,
  FileCheck2,
  TrendingUp,
  Globe2,
  Sparkles,
  ArrowUpLeft,
  MessageCircle,
} from 'lucide-react';

interface FaqSectionProps {
  onOpenConsultation?: () => void;
}

type FaqCategory = 'all' | 'legal' | 'financial' | 'expats';

interface FaqItem {
  id: string;
  category: 'legal' | 'financial' | 'expats';
  question: string;
  answer: string;
  highlight?: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'legal',
    question: 'شناسنامه رسمی ممیزی ۳ کارشناس دقیقاً شامل چه مواردی است و چگونه صادر می‌شود؟',
    answer:
      'هر شناسنامه ممیزی شامل گزارش ۱۰۰ پوینتی فنی سازه توسط مهندس پایه ارشد نظام مهندسی، استعلام ثبتی کاداستر و پایان‌کار شهرداری توسط وکیل پایه یک دادگستری، و تحلیل سنجه قیمت توسط تحلیلگر مالی است. فایل صوتی کارشناسان و ۳ مُهر رسمی دیجیتال همراه هر پرونده در اختیار خریدار قرار می‌گیرد.',
    highlight: 'گزارش مکتوب با ۳ مُهر رسمی دیجیتال',
  },
  {
    id: 'faq-2',
    category: 'financial',
    question: 'کارمزد و هزینه‌های خدمات آرکا استیت چگونه محاسبه می‌شود؟ آیا با بنگاه‌های سنتی تفاوت دارد؟',
    answer:
      'بر خلاف بنگاه‌های سنتی که کارمزد درصدی مبهم و گاه سلیقه‌ای دریافت می‌کنند، در آرکا استیت تعرفه‌ها کاملاً شفاف، منطبق بر ضوابط قانونی و با ارائه فاکتور رسمی ممیزی است. هزینه کارشناسی فنی و حقوقی پیش از پرداخت هرگونه بیعانه به صورت مقطوع به خریدار اعلام می‌شود.',
    highlight: 'شفافیت مطلق و بدون هزینه‌های پنهان',
  },
  {
    id: 'faq-3',
    category: 'expats',
    question: 'ایرانیان مقیم خارج از کشور چگونه بدون حضور فیزیکی در ایران می‌توانند معامله انجام دهند؟',
    answer:
      'دپارتمان پرایوت-کلاینت آرکا استیت از طریق وکالت‌نامه رسمی تاییدشده در سامانه میخک وزارت امور خارجه، کلیه مراحل استعلام ثبتی، بازرسی حضوری با تماس ویدیویی زنده، تنظیم قرارداد و حتی تحویل کلید و مدیریت اجاره‌داری را به صورت قانونی و با تضمین ۱۰۰٪ حقوقی مدیریت می‌کند.',
    highlight: 'پوشش کامل حقوقی از طریق سامانه میخک',
  },
  {
    id: 'faq-4',
    category: 'financial',
    question: 'شبیه‌ساز زنده ROI چگونه سود ۵ ساله و نقدشوندگی را محاسبه می‌کند؟',
    answer:
      'الگوریتم شبیه‌ساز مالی ما بر پایه دیتای تاریخی معاملات قطعی سامانه ثبت اسناد شمیرانات، تورم میانگین مصالح و نرخ بازدهی اجاره منطقه فرمول‌بندی شده است. این ابزار دقیق‌ترین تصویر از بازگشت سرمایه و زمان سربه‌سر شدن نقدینگی را در اختیار سرمایه‌گذار می‌گذارد.',
    highlight: 'محاسبه بر پایه دیتای قطعی ثبت اسناد',
  },
  {
    id: 'faq-5',
    category: 'legal',
    question: 'اگر ملکی در فرآیند ممیزی ۳ کارشناس رد شود چه اتفاقی می‌افتد؟',
    answer:
      'اگر ملکی حتی در یکی از ارکان سه‌گانه (نقص مقاومت سازه، ریشه اوقافی بدون مجوز یا اختلاف در کمیسیون ماده ۱۰۰ شهرداری) رد صلاحیت شود، بلافاصله از انتشار در پلتفرم حذف شده و گزارش دلایل رد به صورت محرمانه به خریدار ارائه می‌شود تا از اتلاف سرمایه جلوگیری شود.',
    highlight: 'حذف ۱۰۰٪ فایل‌های دارای ریسک',
  },
  {
    id: 'faq-6',
    category: 'expats',
    question: 'چگونه می‌توانم درخواست بازدید اختصاصی با حضور مهندس ناظر را ثبت کنم؟',
    answer:
      'با کلیک روی دکمه «مشاوره اختصاصی VIP» در نوبار یا صفحه هر ملک، کنسیرژ اختصاصی شما ظرف حداکثر ۴ ساعت کاری با شما هماهنگ شده و وقت بازدید خصوصی به همراه مهندس سازه و کارشناس حقوقی در محل ملک تنظیم می‌شود.',
    highlight: 'پاسخگویی کنسیرژ ظرف ۴ ساعت',
  },
];

const CATEGORY_TABS: { id: FaqCategory; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'all', label: 'همه پرسش‌ها', icon: HelpCircle },
  { id: 'legal', label: 'ممیزی اسناد و حقوقی', icon: FileCheck2 },
  { id: 'financial', label: 'محاسبات مالی و ROI', icon: TrendingUp },
  { id: 'expats', label: 'خریداران مقیم خارج', icon: Globe2 },
];

export const FaqSection: React.FC<FaqSectionProps> = ({ onOpenConsultation }) => {
  const [activeTab, setActiveTab] = useState<FaqCategory>('all');
  const [expandedId, setExpandedId] = useState<string | null>('faq-1');

  const filteredItems =
    activeTab === 'all'
      ? FAQ_ITEMS
      : FAQ_ITEMS.filter((item) => item.category === activeTab);

  const toggleAccordion = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="pt-28 pb-16 md:pt-32 md:pb-24 bg-[#FBFBF8] border-t border-[#C5A880]/15 relative"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#132E27]/10 border border-[#132E27]/20 text-xs font-bold text-[#132E27]">
            <HelpCircle className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>پاسخ به ابهامات کلیدی خریداران و سرمایه‌گذاران املاک لوکس</span>
          </div>

          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0B1B17] leading-tight"
            style={{ textWrap: 'balance' }}
          >
            پرسش‌های متداول و دغدغه‌های معامله
          </h2>

          <p className="text-sm sm:text-[15px] text-[#0B1B17]/65 leading-relaxed font-normal">
            پاسخ‌های شفاف و رسمی هیئت ممیزی آرکا استیت به متداول‌ترین سوالات درباره اصالت اسناد، نحوه خرید از خارج کشور و تضمین‌های قراردادی.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-8 sm:mb-10">
          {CATEGORY_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-[#0B1B17] text-[#FBFBF8] border border-[#C5A880]/50 shadow-md scale-[1.02]'
                    : 'bg-white text-[#0B1B17]/75 hover:text-[#0B1B17] border border-[#C5A880]/20 hover:bg-[#F5EFE6]/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-[#C5A880]' : 'text-[#9A7D56]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Accordion FAQ List */}
        <div className="space-y-3.5 mb-14">
          {filteredItems.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className={`rounded-3xl border transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? 'bg-white border-[#C5A880]/40 shadow-xl shadow-[#0B1B17]/5'
                    : 'bg-white/80 hover:bg-white border-[#C5A880]/20 shadow-sm'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(item.id)}
                  aria-expanded={isExpanded}
                  className="w-full text-right p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A880]"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-colors ${
                        isExpanded
                          ? 'bg-[#C5A880] text-[#0B1B17]'
                          : 'bg-[#F5EFE6] text-[#7D6039]'
                      }`}
                    >
                      ؟
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-[#0B1B17] leading-snug">
                      {item.question}
                    </span>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-all duration-200 ${
                      isExpanded
                        ? 'border-[#C5A880] bg-[#C5A880]/15 text-[#7D6039] rotate-180'
                        : 'border-[#C5A880]/30 bg-white text-[#9A7D56]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-right border-t border-[#C5A880]/15 animate-fadeIn">
                    <p className="text-xs sm:text-sm text-[#0B1B17]/75 leading-[1.9] font-normal mb-3">
                      {item.answer}
                    </p>
                    {item.highlight && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#132E27]/5 border border-[#C5A880]/30 text-[11px] font-bold text-[#7D6039]">
                        <Sparkles className="w-3 h-3 text-[#C5A880]" />
                        <span>نکته کلیدی: {item.highlight}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions CTA Banner */}
        <div className="rounded-3xl bg-[#0B1B17] text-[#FBFBF8] p-6 sm:p-8 border border-[#C5A880]/35 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1.5 text-center sm:text-right">
            <div className="text-base sm:text-lg font-black text-white flex items-center justify-center sm:justify-start gap-2">
              <MessageCircle className="w-5 h-5 text-[#C5A880]" />
              <span>هنوز سوالی دارید که در اینجا پاسخ داده نشده است؟</span>
            </div>
            <p className="text-xs sm:text-sm text-[#FBFBF8]/65">
              کنسیرژ اختصاصی آرکا استیت آماده پاسخگویی مستقیم و کاملاً محرمانه به شماست.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenConsultation}
            className="h-11 sm:h-12 px-6 rounded-full gold-cta-btn text-[#0B1B17] text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-lg whitespace-nowrap shrink-0 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>گفتگوی مستقیم با کنسیرژ VIP</span>
            <ArrowUpLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import {
  ArrowUpLeft,
  BarChart3,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  LineChart,
  PieChart,
  ShieldAlert,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { toPersianDigits } from '../utils/format';

interface MarketIntelligenceSectionProps {
  onOpenConsultation: () => void;
}

export const MarketIntelligenceSection: React.FC<MarketIntelligenceSectionProps> = ({
  onOpenConsultation,
}) => {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadReport = () => {
    setDownloaded(true);
    setTimeout(() => {
      setDownloaded(false);
    }, 4000);
  };

  return (
    <section id="market-intelligence" className="pt-28 pb-16 md:pt-32 md:pb-24 bg-[#0B1B17] text-[#FBFBF8] relative overflow-hidden">
      {/* Background architectural grid pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#C5A880_1px,transparent_1px),linear-gradient(to_bottom,#C5A880_1px,transparent_1px)] bg-[size:4rem_4rem]"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3 mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#132E27] border border-[#C5A880]/30 text-xs font-bold text-[#C5A880]">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>گزارش فصلی هوش بازار و اقتصاد مسکن لوکس · پاییز ۱۴۰۴</span>
          </div>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-black text-[#FBFBF8] leading-tight"
            style={{ textWrap: 'balance' }}
          >
            سرمایه‌گذاری بر پایه اسناد قطعی معاملات، نه شایعات و حدس‌های بازار
          </h2>
          <p className="text-sm sm:text-[15px] text-[#FBFBF8]/70 leading-relaxed">
            هیئت تحلیل مالی آرکا استیت هر فصل با پایش معاملات قطعی سامانه ثبت اسناد و انبوه‌سازان شمیران، گزارشی مستند از نبض بازدهی و نقدشوندگی منتشر می‌کند.
          </p>
        </div>

        {/* 4 Macro Key Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mb-10">
          <div className="rounded-2xl bg-white/[0.04] border border-[#C5A880]/20 p-5 space-y-1.5">
            <div className="text-[11px] text-[#FBFBF8]/60 font-medium">
              میانگین رشد سالانه قیمت
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#10B981] tabular-nums flex items-center gap-1.5">
              <TrendingUp className="w-5 h-5" />
              <span>+{toPersianDigits(28.4)}٪</span>
            </div>
            <div className="text-[11px] text-[#FBFBF8]/50 pt-1">
              در منطقه ۱ و پنت‌هاوس‌های بالای ۳۰۰ متر
            </div>
          </div>

          <div className="rounded-2xl bg-white/[0.04] border border-[#C5A880]/20 p-5 space-y-1.5">
            <div className="text-[11px] text-[#FBFBF8]/60 font-medium">
              سرعت میانگین فروش مجدد
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#C5A880] tabular-nums flex items-center gap-1.5">
              <LineChart className="w-5 h-5" />
              <span>{toPersianDigits(38)} روز</span>
            </div>
            <div className="text-[11px] text-[#FBFBF8]/50 pt-1">
              برای املاک دارای گواهی ممیزی ۳۶۰ درجه
            </div>
          </div>

          <div className="rounded-2xl bg-white/[0.04] border border-[#C5A880]/20 p-5 space-y-1.5">
            <div className="text-[11px] text-[#FBFBF8]/60 font-medium">
              سهم خریدهای سرمایه‌گذاری
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#38BDF8] tabular-nums flex items-center gap-1.5">
              <PieChart className="w-5 h-5" />
              <span>{toPersianDigits(64)}٪</span>
            </div>
            <div className="text-[11px] text-[#FBFBF8]/50 pt-1">
              با انگیزه اصلی حفظ ارزش و پوشش تورم
            </div>
          </div>

          <div className="rounded-2xl bg-white/[0.04] border border-[#C5A880]/20 p-5 space-y-1.5">
            <div className="text-[11px] text-[#FBFBF8]/60 font-medium">
              نرخ رهن خالص به قیمت
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#FBBF24] tabular-nums flex items-center gap-1.5">
              <BarChart3 className="w-5 h-5" />
              <span>{toPersianDigits(4.3)}٪</span>
            </div>
            <div className="text-[11px] text-[#FBFBF8]/50 pt-1">
              بالاترین تقاضای رهن توسط مدیران ارشد
            </div>
          </div>
        </div>

        {/* Featured Editorial Report Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#132E27] via-[#0F241F] to-[#0B1B17] border border-[#C5A880]/30 p-6 sm:p-9 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3.5 max-w-2xl text-center lg:text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1B17] text-[#C5A880] text-xs font-bold border border-[#C5A880]/30">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>سند سالانه آرکا: چشم‌انداز مسکن لوکس ۱۴۰۴ تا ۱۴۰۶</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-[#FBFBF8] leading-snug">
              دانلود رایگان گزارش تحلیلی: راهنمای تخصصی تخصیص سرمایه در املاک تهران
            </h3>

            <p className="text-xs sm:text-sm text-[#FBFBF8]/75 leading-relaxed">
              شامل تحلیل اثر نوسانات ارزی بر متریال ساخت، جدول بازدهی تطبیقی مناطق ۴ گانه و بررسی ۱۰ خطای رایج حقوقی در پیش‌خرید املاک لوکس.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-[#FBFBF8]/70 pt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>فرمت PDF ۴۲ صفحه‌ای</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>به‌روزرسانی با معاملات آبان ۱۴۰۴</span>
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={handleDownloadReport}
              className="h-12 px-6 rounded-2xl bg-white hover:bg-[#F5EFE6] text-[#0B1B17] text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
            >
              <Download className="w-4 h-4 text-[#C5A880]" />
              <span>
                {downloaded ? 'گزارش دانلود شد ✓' : 'دانلود خلاصه اجرایی (PDF)'}
              </span>
            </button>

            <button
              type="button"
              onClick={onOpenConsultation}
              className="h-12 px-6 rounded-2xl gold-cta-btn text-[#0B1B17] text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>مشاوره با تحلیلگر ارشد سرمایه‌گذاری</span>
              <ArrowUpLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

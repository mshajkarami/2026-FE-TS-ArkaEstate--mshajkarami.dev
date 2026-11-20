import React from 'react';
import {
  ShieldCheck,
  Scale,
  Lock,
  Award,
  TrendingUp,
  FileCheck2,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { ArkaLogo } from './ArkaLogo';
import { toPersianDigits } from '../utils/format';

interface AboutUsSectionProps {
  onOpenConsultation?: () => void;
}

const TRUST_STATS = [
  {
    value: '+۴۵۰',
    unit: 'میلیارد تومان',
    label: 'ارزش املاک ممیزی‌شده',
    sub: 'مجموع ارزش فایل‌های کارشناسی‌شده در شمیرانات',
  },
  {
    value: '۱۰۰٪',
    unit: 'تضمین حقوقی',
    label: 'استعلام اصالت تک‌برگ',
    sub: 'صفر پرونده معارض یا اختلاف ملکی',
  },
  {
    value: '۳۸',
    unit: 'روز کاری',
    label: 'میانگین نقدشوندگی',
    sub: 'سرعت فروش پنت‌هاوس‌ها نسبت به میانگین بازار',
  },
  {
    value: '۳',
    unit: 'مُهر مستقل',
    label: 'ممیزی پیش از انتشار',
    sub: 'تایید هم‌زمان مهندس سازه، وکیل و تحلیلگر مالی',
  },
];

const CORE_PILLARS = [
  {
    icon: ShieldCheck,
    title: 'حذف کامل تعارض منافع',
    badge: 'حکمرانی مستقل',
    description:
      'در آژانس‌های سنتی، مشاور هرچه ملک را گران‌تر و سریع‌تر بفروشد سود بیشتری می‌برد. در آرکا استیت، کارشناسان ما حقوق ثابت و پاداش کیفیت ممیزی دریافت می‌کنند؛ منفعت ما منحصراً در سلامت معامله و حفظ سرمایه خریدار تعریف شده است.',
  },
  {
    icon: Scale,
    title: 'دقت آزمایشگاهی و مهندسی سازه',
    badge: 'تست‌های میدانی',
    description:
      'ما به کاتالوگ‌های تبلیغاتی سازنده اکتفا نمی‌کنیم؛ اعزام مهندس ارشد سازه، بررسی نتایج آزمایش بتن، تست ضخامت عایق‌های صوتی، کنترل برند چیلرها و آسانسورها و انطباق کامل پلان با پروانه ساختمانی بخشی از پروتکل الزامی ماست.',
  },
  {
    icon: Lock,
    title: 'محرمانگی در تراز پرایوت‌بنکینگ',
    badge: 'حفظ حریم خصوصی',
    description:
      'خریداران پنت‌هاوس‌ها و سرمایه‌گذاران ارشد به آرامش و امنیت اطلاعات مالی خود اهمیت می‌دهند. هویت طرفین، اسناد مذاکره و توافقات نهایی در امن‌ترین لایه‌های پروتکل‌های محرمانگی (NDA) نگهداری می‌شوند.',
  },
];

export const AboutUsSection: React.FC<AboutUsSectionProps> = ({
  onOpenConsultation,
}) => {
  return (
    <section
      id="about"
      className="pt-28 pb-16 md:pt-32 md:pb-24 bg-[#0B1B17] text-[#FBFBF8] relative overflow-hidden"
    >
      {/* Background Architectural Grid Pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#C5A880_1px,transparent_1px),linear-gradient(to_bottom,#C5A880_1px,transparent_1px)] bg-[size:4rem_4rem]"
      />

      {/* Subtle radial emerald luxury aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 -right-40 w-[700px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(197,168,128,0.12),transparent_70%)]"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 pb-10 border-b border-[#C5A880]/20">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#132E27] border border-[#C5A880]/30 text-xs font-bold text-[#C5A880]">
              <Award className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>رسالت سازمانی، فلسفه تاسیس و ارکان ممیزی آرکا استیت</span>
            </div>

            <h2
              className="text-2xl sm:text-3xl md:text-5xl font-black text-[#FBFBF8] leading-[1.25] tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              پایان معاملات پرریسک و ابهام‌آمیز در{' '}
              <span className="gold-gradient-text block sm:inline">
                بازار مسکن فاخر؛ استانداردی نو در اعتبارسنجی ملک
              </span>
            </h2>

            <p className="text-sm sm:text-base text-[#FBFBF8]/75 leading-relaxed font-normal pt-2">
              بازار املاک شمیرانات همواره با آگهی‌های غیرواقعی، قیمت‌گذاری‌های متناقض و ریسک‌های پنهان ثبتی همراه بوده است. آرکا استیت با حذف واسطه‌گری سنتی و غیرمتخصص، هر فایل را مستقلاً از نظر استحکام سازه، اصالت کاداستر و ارزش منصفانه قیمت کارشناسی کرده و سپس منتشر می‌کند.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="w-16 h-16 rounded-3xl bg-[#132E27] border border-[#C5A880]/40 flex items-center justify-center shadow-lg shadow-black/40">
              <ArkaLogo size={36} goldColor="#C5A880" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-white">هیئت موسس آرکا استیت</div>
              <div className="text-xs text-[#C5A880] font-medium mt-0.5 font-serif-latin tracking-wide">
                ArkaEstate Governance Board
              </div>
            </div>
          </div>
        </div>

        {/* 3 Core Philosophical Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {CORE_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="group rounded-3xl bg-white/[0.03] hover:bg-white/[0.06] border border-[#C5A880]/20 hover:border-[#C5A880]/50 p-7 transition-all duration-300 flex flex-col justify-between gap-6 shadow-xl"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#C5A880]/15 border border-[#C5A880]/30 text-[#C5A880] flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#132E27] text-[#C5A880] border border-[#C5A880]/30">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-[#C5A880] transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#FBFBF8]/70 leading-relaxed font-normal">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-[#C5A880]/80 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span>تضمین‌شده در تمام قراردادهای ممیزی</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4 Big Trust Metrics Strip */}
        <div className="rounded-3xl bg-gradient-to-r from-[#132E27]/80 via-[#0B1B17] to-[#132E27]/80 border border-[#C5A880]/35 p-6 sm:p-8 lg:p-10 shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {TRUST_STATS.map((stat, i) => (
              <div key={i} className="space-y-1.5 text-right sm:border-l sm:last:border-l-0 border-white/10 sm:pl-4 pb-4 sm:pb-0 border-b sm:border-b-0 last:border-b-0">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tabular-nums tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-xs sm:text-sm text-[#C5A880] font-bold">
                    {stat.unit}
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-extrabold text-white">
                  {stat.label}
                </div>
                <p className="text-[11px] text-[#FBFBF8]/60 font-light leading-normal">
                  {stat.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

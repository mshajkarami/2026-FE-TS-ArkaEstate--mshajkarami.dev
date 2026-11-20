import React from 'react';
import { Award, Building2, Scale, TrendingUp } from 'lucide-react';
import { toPersianDigits } from '../utils/format';

const EXPERTS = [
  {
    id: 'architect',
    image: './images/expert_arman_kazemi.jpg',
    emblem: './images/emblem_structural_cube.jpg',
    initials: 'آک',
    name: 'مهندس آرمان کاظمی',
    role: 'کارشناس ارشد سازه و معماری',
    credential: 'پروانه پایه یک نظام مهندسی · ۲۸۴۱۱',
    years: 17,
    icon: Building2,
    focus:
      'بازرسی حضوری کیفیت بتن، عایق‌های صوتی و حرارتی، پلان معماری، استاندارد تاسیسات مکانیکی و نورگیری چهارفصل پیش از انتشار هر فایل.',
  },
  {
    id: 'legal',
    image: './images/expert_sara_matinfar.jpg',
    emblem: './images/emblem_legal_seal.jpg',
    initials: 'سم',
    name: 'دکتر سارا متین‌فر',
    role: 'مشاور حقوقی و ارزیابی اسناد ملکی',
    credential: 'وکیل پایه یک دادگستری · ۴۹۱۲۰',
    years: 14,
    icon: Scale,
    focus:
      'استعلام اصالت سند تک‌برگ، بررسی ریشه ملک و عدم اوقاف، انطباق پایان‌کار با صورت‌مجلس تفکیکی و تنظیم قراردادهای بی‌ریسک.',
  },
  {
    id: 'investment',
    image: './images/expert_mehrdad_farhadi.jpg',
    emblem: './images/emblem_roi_wealth.jpg',
    initials: 'مف',
    name: 'مهرداد فرهادی',
    role: 'تحلیلگر ارشد سرمایه‌گذاری املاک',
    credential: 'تحلیلگر مالی CFA سطح ۳',
    years: 12,
    icon: TrendingUp,
    focus:
      'قیمت‌گذاری تطبیقی بر پایه معاملات واقعی منطقه، محاسبه سنجه فرصت قیمت، نرخ بازدهی ۵ ساله و سرعت نقدشوندگی دارایی.',
  },
];

export const ExpertsSection: React.FC = () => {
  return (
    <section id="experts" className="pt-28 pb-16 md:pt-32 md:pb-24 bg-[#FBFBF8] border-t border-[#C5A880]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-3 mb-12">
          <p className="text-xs font-bold tracking-wide text-[#9A7D56]">
            ۰۳. هیئت ارزیابی مستقل آرکا استیت
          </p>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0B1B17] leading-tight"
            style={{ textWrap: 'balance' }}
          >
            هیچ ملکی بدون تایید کتبی هر ۳ کارشناس مستقل منتشر نمی‌شود
          </h2>
          <p className="text-sm sm:text-[15px] text-[#0B1B17]/65 leading-relaxed">
            برای حذف کامل تعارض منافع، هر فایل ملکی پیش از نمایش در مجموعه، به صورت مستقل از سه منظر استحکام سازه، اصالت اسناد و ارزش‌گذاری منصفانه ممیزی می‌شود.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7">
          {EXPERTS.map((expert) => {
            const Icon = expert.icon;
            return (
              <div
                key={expert.id}
                className="rounded-3xl bg-white border border-[#C5A880]/22 p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-[0_16px_40px_-24px_rgba(11,27,23,0.12)]"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="relative">
                      <img
                        src={expert.image}
                        alt={expert.name}
                        className="w-16 h-16 rounded-2xl object-cover object-top border-2 border-[#C5A880]/40 shadow-md group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-[#0B1B17] border border-[#C5A880] text-[#C5A880] flex items-center justify-center shadow-xs">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-[#F5EFE6] pl-3 pr-1.5 py-1 rounded-2xl border border-[#C5A880]/25 shadow-xs">
                      <img
                        src={expert.emblem}
                        alt="نشان رسمی ممیزی"
                        className="w-9 h-9 rounded-xl object-cover border border-[#C5A880]/40 shadow-xs"
                      />
                      <span className="text-[11px] font-bold text-[#9A7D56]">
                        نشان ممیزی رسمی
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-[#0B1B17]">
                      {expert.name}
                    </h3>
                    <p className="text-xs font-bold text-[#9A7D56] mt-1">
                      {expert.role}
                    </p>
                  </div>

                  <p className="text-sm text-[#0B1B17]/70 leading-[1.85]">
                    {expert.focus}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#C5A880]/15 flex items-center justify-between gap-2 text-[11px] font-semibold text-[#0B1B17]/55">
                  <span className="inline-flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>{expert.credential}</span>
                  </span>
                  <span className="tabular-nums shrink-0">
                    {toPersianDigits(expert.years)} سال تجربه
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

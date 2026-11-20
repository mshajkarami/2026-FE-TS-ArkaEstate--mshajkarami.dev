import React from 'react';
import {
  ArrowDown,
  Building2,
  FileCheck2,
  KeyRound,
  Lock,
  Paintbrush,
  Scale,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';

interface PrivateConciergeSectionProps {
  onOpenVipModal: () => void;
}

const CONCIERGE_SERVICES = [
  {
    icon: ShieldCheck,
    emblem: '/images/emblem_structural_cube.jpg',
    title: 'ممیزی فنی و استحکام‌سنجی پیش از معامله',
    description:
      'اعزام مهندس ارشد سازه پیش از پرداخت هرگونه بیعانه؛ تست مقاومت مصالح، بررسی عایق‌های صوتی، تاسیسات مکانیکی و تایید انطباق نقشه معماری با وضع موجود.',
    tag: 'بازرسی حضوری ۴۸ ساعته',
  },
  {
    icon: Scale,
    emblem: '/images/emblem_legal_seal.jpg',
    title: 'استعلام اصالت اسناد و تضمین ۱۰۰٪ حقوقی',
    description:
      'استعلام رسمی کاداستر اداره ثبت، احراز سلامت پایان‌کار شهرداری، بررسی ریشه ملک در مراجع قضایی و تنظیم مبایعه‌نامه اختصاصی توسط وکیل پایه یک دادگستری.',
    tag: 'صفر درصد ریسک قراردادی',
  },
  {
    icon: KeyRound,
    emblem: '/images/emblem_concierge_key.jpg',
    title: 'مدیریت دارایی و تحویل کلید اختصاصی VIP',
    description:
      'حفاظت و نگهداری دوره‌ای از پنت‌هاوس‌ها، گزینش مستأجران معتبر از میان مدیران ارشد و دیپلمات‌ها، تحویل کلید اختصاصی و مدیریت بی‌دردسر امور ملکی.',
    tag: 'پوشش کامل برای مالکان مقیم و خارج از کشور',
  },
  {
    icon: Paintbrush,
    emblem: '/images/emblem_roi_wealth.jpg',
    title: 'مهندسی مالی، توازن سبد دارایی و بیشینه‌سازی بازده (ROI)',
    description:
      'تحلیل نقاط ورود و خروج، محاسبه سنجه فرصت، بهره‌گیری از اهرم رهن کامل، بازآرایی پورتفولیو و تضمین بیشترین نرخ بهره‌وری و سپر تورمی دارایی ملکی.',
    tag: 'بیشینه‌سازی سود و حفظ ارزش ریال',
  },
];

export const PrivateConciergeSection: React.FC<PrivateConciergeSectionProps> = ({
  onOpenVipModal,
}) => {
  return (
    <section id="concierge" className="pt-28 pb-16 md:pt-32 md:pb-24 bg-[#FBFBF8] border-t border-[#C5A880]/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#132E27]/10 border border-[#132E27]/20 text-xs font-bold text-[#132E27]">
              <img
                src="/images/emblem_concierge_key.jpg"
                alt="نشان کنسیرژ VIP"
                className="w-4 h-4 rounded-full object-cover border border-[#C5A880]/50"
              />
              <span>خدمات ممیزی و کنسیرژ اختصاصی (Private Client Services)</span>
            </div>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0B1B17] leading-tight"
              style={{ textWrap: 'balance' }}
            >
              همراهی اختصاصی در تراز دفاتر خانوادگی و بانکداری اختصاصی (Family Office)
            </h2>
            <p className="text-sm sm:text-[15px] text-[#0B1B17]/65 leading-relaxed">
              هر خریدار و سرمایه‌گذار در آرکا استیت یک مشاور ارشد اختصاصی دارد که از نخستین گام اعتبارسنجی تا انتقال قطعی سند در دفتر اسناد رسمی در کنار اوست.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenVipModal}
            className="h-12 px-6 rounded-full gold-cta-btn text-[#0B1B17] text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm self-start md:self-auto shrink-0"
          >
            <span>درخواست ارتباط با کنسیرژ ارشد</span>
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-7">
          {CONCIERGE_SERVICES.map((service, index) => {
            return (
              <div
                key={index}
                className="rounded-3xl bg-white border border-[#C5A880]/25 p-7 sm:p-8 hover:border-[#0B1B17] hover:shadow-xl transition-all duration-300 flex flex-col justify-between gap-6 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#C5A880]/40 shadow-md group-hover:scale-105 group-hover:border-[#C5A880] transition-transform bg-[#0B1B17]">
                      <img
                        src={service.emblem}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[11px] font-extrabold text-[#9A7D56] bg-[#F5EFE6] px-3 py-1 rounded-full border border-[#C5A880]/20">
                      {service.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-[#0B1B17] leading-snug group-hover:text-[#9A7D56] transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-sm text-[#0B1B17]/70 leading-[1.9]">
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#C5A880]/15 flex items-center justify-between text-xs font-bold text-[#0B1B17]/60">
                  <span>پوشش انحصاری شمیرانات و شهرک غرب</span>
                  <span className="text-[#C5A880] font-black">۱۰۰٪ محرمانه</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

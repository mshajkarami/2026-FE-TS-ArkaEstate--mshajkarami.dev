import React, { useMemo, useState } from 'react';
import {
  ArrowUpLeft,
  Building2,
  Coins,
  FileCheck2,
  Percent,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { formatBillionToman, toPersianDigits } from '../utils/format';

interface RoiSimulatorProps {
  onOpenVip: () => void;
}

type PaymentStrategy = 'cash' | 'deposit' | 'developer';
type GrowthScenario = 'conservative' | 'balanced' | 'bullish';

const STRATEGIES: {
  id: PaymentStrategy;
  label: string;
  badge: string;
  description: string;
}[] = [
  {
    id: 'cash',
    label: 'خرید ۱۰۰٪ نقدی',
    badge: 'تخفیف ویژه پای میز',
    description: 'دریافت تخفیف قطعی ۶٪ در معاملات نقدی بدون تاخیر',
  },
  {
    id: 'deposit',
    label: 'اهرم رهن کامل',
    badge: 'کسر از بودجه نقدی',
    description: 'تامین ۱۰ تا ۱۲ درصد بودجه از طریق واگذاری رهن کامل',
  },
  {
    id: 'developer',
    label: 'اقساطی پیش‌فروش',
    badge: 'بدون بهره بانکی',
    description: '۴۰٪ نقد اولیه + ۵۰٪ اقساط مرحله‌ای سازنده + ۱۰٪ تحویل و سند',
  },
];

const SCENARIOS: Record<GrowthScenario, { label: string; rate: number; note: string }> = {
  conservative: {
    label: 'محافظه‌کارانه',
    rate: 26,
    note: 'رشد همگام با تورم رسمی پایه مسکن',
  },
  balanced: {
    label: 'متعادل (تاریخی شمیران)',
    rate: 33,
    note: 'میانگین بازدهی ثبت‌شده ۱۰ سال اخیر منطقه ۱',
  },
  bullish: {
    label: 'جهش ارزی و تورم مصالح',
    rate: 42,
    note: 'سناریوی پیشتاز در دوره‌های جهش ارزی پایتخت',
  },
};

export const RoiSimulator: React.FC<RoiSimulatorProps> = ({ onOpenVip }) => {
  const [propertyPrice, setPropertyPrice] = useState(75); // Billion Toman
  const [strategy, setStrategy] = useState<PaymentStrategy>('deposit');
  const [scenario, setScenario] = useState<GrowthScenario>('balanced');
  const [customRate, setCustomRate] = useState<number | null>(null);

  const activeRate = customRate !== null ? customRate : SCENARIOS[scenario].rate;

  const simulation = useMemo(() => {
    // Strategy details
    const cashDiscount = propertyPrice * 0.06; // 6% cash discount
    const netCashPrice = propertyPrice - cashDiscount;

    const fullDepositAmount = Math.round(propertyPrice * 0.11 * 10) / 10; // ~11% full mortgage deposit
    const outOfPocketWithDeposit = propertyPrice - fullDepositAmount;

    const developerDownpayment = Math.round(propertyPrice * 0.4 * 10) / 10; // 40% initial
    const developerInstallments = Math.round(propertyPrice * 0.5 * 10) / 10; // 50% staged
    const developerFinalHandover = Math.round(propertyPrice * 0.1 * 10) / 10; // 10% on key & deed

    // 5-Year Compound Growth Projection
    const yearlyProjection = Array.from({ length: 6 }, (_, year) => {
      const projectedValue = propertyPrice * Math.pow(1 + activeRate / 100, year);
      return {
        year,
        value: Math.round(projectedValue * 10) / 10,
      };
    });

    const fiveYearValue = yearlyProjection[5].value;
    const totalCapitalGain = Math.round((fiveYearValue - propertyPrice) * 10) / 10;
    const growthMultiplier = Math.round((fiveYearValue / propertyPrice) * 10) / 10;

    // Liquidity index (higher for units in prime zones)
    const liquidityScore = Math.min(
      98,
      Math.max(82, Math.round(96 - Math.max(0, propertyPrice - 80) * 0.1))
    );
    const avgDaysToResell = Math.round(32 + Math.max(0, propertyPrice - 70) * 0.2);

    return {
      cashDiscount,
      netCashPrice,
      fullDepositAmount,
      outOfPocketWithDeposit,
      developerDownpayment,
      developerInstallments,
      developerFinalHandover,
      yearlyProjection,
      fiveYearValue,
      totalCapitalGain,
      growthMultiplier,
      liquidityScore,
      avgDaysToResell,
    };
  }, [propertyPrice, activeRate]);

  const pricePercent = ((propertyPrice - 25) / (180 - 25)) * 100;
  const ratePercent = ((activeRate - 20) / (45 - 20)) * 100;
  const maxChartVal = simulation.yearlyProjection[5].value;

  return (
    <section
      id="roi-simulator"
      className="pt-28 pb-16 md:pt-32 md:pb-24 bg-[#0B1B17] text-[#FBFBF8] relative overflow-hidden select-none"
    >
      {/* Background radial gold aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(197,168,128,0.15),transparent_70%)]"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#C5A880]/30 text-xs font-bold text-[#C5A880]">
              <img
                src="./images/emblem_roi_wealth.jpg"
                alt="نشان رشد ثروت"
                className="w-4 h-4 rounded-md object-cover border border-[#C5A880]/50"
              />
              <span>محاسبه‌گر ارزش ذاتی، بازدهی و نقدشوندگی مسکن اعیانی</span>
            </div>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight text-[#FBFBF8]"
              style={{ textWrap: 'balance' }}
            >
              برآورد دقیق بازدهی سرمایه‌گذاری، ارزش ذاتی و نقدشوندگی ملک
            </h2>
            <p className="text-sm sm:text-[15px] text-[#FBFBF8]/70 leading-relaxed">
              ارزش ملک و روش پرداخت متناسب با بازار ایران را انتخاب کنید تا محاسبات اهرم رهن کامل، سود مرکب ۵ ساله و سرعت نقدشوندگی را بلافاصله بسنجید.
            </p>
          </div>

          <div className="flex items-center gap-2.5 text-xs font-bold text-[#C5A880] bg-white/5 px-4 py-2.5 rounded-2xl border border-[#C5A880]/25 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>مبتنی بر داده‌های واقعی معاملات قطعی شمیرانات و منطقه ۲</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-stretch">
          {/* =======================================================
              CONTROLS PANEL (Tailored strictly to Iranian Market)
             ======================================================= */}
          <div className="lg:col-span-5 rounded-3xl bg-white/[0.04] border border-[#C5A880]/25 p-6 sm:p-7 flex flex-col justify-between gap-6 shadow-xl backdrop-blur-md">
            <div className="space-y-6">
              {/* 1. Property Price Slider */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-[#FBFBF8]/85 font-bold flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>ارزش تخمینی ملک هدف</span>
                  </span>
                  <span className="font-black text-base text-[#C5A880] tabular-nums">
                    {formatBillionToman(propertyPrice)}
                  </span>
                </div>

                {/* Custom Ultra-Visible Golden Slider */}
                <div className="relative h-6 flex items-center" dir="ltr">
                  <div className="w-full h-2 rounded-full bg-white/15 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#9A7D56] via-[#C5A880] to-[#E5D7C1] rounded-full transition-all duration-75 shadow-sm"
                      style={{ width: `${pricePercent}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    aria-label="ارزش ملک به میلیارد تومان"
                    min={25}
                    max={180}
                    step={5}
                    value={propertyPrice}
                    onChange={(e) => setPropertyPrice(Number(e.target.value))}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer h-full z-20"
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#0B1B17] border-2 border-[#C5A880] shadow-md shadow-[#C5A880]/50 pointer-events-none transition-all duration-75"
                    style={{ left: `${pricePercent}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-[#FBFBF8]/45 tabular-nums">
                  <span>۲۵ میلیارد (سوئیت لوکس)</span>
                  <span>۱۸۰ میلیارد (پنت‌هاوس رویال)</span>
                </div>
              </div>

              {/* 2. Iranian Payment Structure Selector */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-[#FBFBF8]/85 font-bold flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>استراتژی پرداخت در بازار ایران</span>
                  </span>
                  <span className="text-[11px] text-[#C5A880] font-semibold">
                    (بدون وام بانکی)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {STRATEGIES.map((item) => {
                    const active = strategy === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setStrategy(item.id)}
                        className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                          active
                            ? 'bg-[#C5A880] text-[#0B1B17] border-[#C5A880] shadow-lg font-bold scale-[1.02]'
                            : 'bg-white/5 text-[#FBFBF8]/75 border-white/10 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        <div className="text-xs font-black">{item.label}</div>
                        <div
                          className={`text-[10px] px-1.5 py-0.5 rounded-full inline-block font-semibold w-fit ${
                            active
                              ? 'bg-[#0B1B17]/15 text-[#0B1B17]'
                              : 'bg-white/10 text-[#C5A880]'
                          }`}
                        >
                          {item.badge}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Annual Appreciation & Inflation Scenario */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-[#FBFBF8]/85 font-bold flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>سناریوی رشد سالانه و سپر تورمی</span>
                  </span>
                  <span className="font-black text-sm text-[#10B981] tabular-nums">
                    {toPersianDigits(activeRate)}٪ سالانه
                  </span>
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-3 gap-2">
                  {(Object.entries(SCENARIOS) as [GrowthScenario, typeof SCENARIOS[GrowthScenario]][]).map(
                    ([key, data]) => {
                      const active = scenario === key && customRate === null;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            setScenario(key);
                            setCustomRate(null);
                          }}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            active
                              ? 'bg-emerald-500/20 text-[#10B981] border-[#10B981] font-bold'
                              : 'bg-white/5 text-white/70 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="text-xs font-bold">{data.label}</div>
                          <div className="text-[11px] text-[#C5A880] tabular-nums mt-0.5">
                            {toPersianDigits(data.rate)}٪
                          </div>
                        </button>
                      );
                    }
                  )}
                </div>

                {/* Custom Growth Rate Slider */}
                <div className="relative h-5 flex items-center pt-2" dir="ltr">
                  <div className="w-full h-1.5 rounded-full bg-white/15 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-600 to-[#10B981] rounded-full transition-all duration-75"
                      style={{ width: `${ratePercent}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    aria-label="نرخ رشد سالانه درصد"
                    min={20}
                    max={45}
                    step={1}
                    value={activeRate}
                    onChange={(e) => {
                      setCustomRate(Number(e.target.value));
                    }}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer h-full z-20"
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#0B1B17] border-2 border-[#10B981] shadow-md shadow-emerald-500/50 pointer-events-none transition-all duration-75"
                    style={{ left: `${ratePercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Note & Basis footer */}
            <div className="pt-4 border-t border-white/10 text-xs text-white/55 flex items-center justify-between">
              <span>مبنای محاسبات: تورم ملکی میانگین ۱۰ ساله منطقه ۱ تهران</span>
              <Sparkles className="w-4 h-4 text-[#C5A880]" />
            </div>
          </div>

          {/* =======================================================
              OUTPUT & 5-YEAR WEALTH COMPOUNDING CHART
             ======================================================= */}
          <div className="lg:col-span-7 rounded-3xl bg-white/[0.04] border border-[#C5A880]/25 p-6 sm:p-8 flex flex-col justify-between gap-8 shadow-xl backdrop-blur-md">
            {/* 3 Practical Iranian Real Estate KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Card 1: 5-Year Asset Value */}
              <div className="rounded-2xl bg-[#112A24] border border-[#C5A880]/30 p-4 sm:p-5 flex flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs text-[#FBFBF8]/65 font-medium">
                      ارزش تخمینی پس از ۵ سال
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-[#C5A880] tabular-nums mt-1.5">
                      {formatBillionToman(simulation.fiveYearValue)}
                    </div>
                  </div>
                  <img
                    src="./images/emblem_roi_wealth.jpg"
                    alt="نشان رشد ثروت"
                    className="w-10 h-10 rounded-xl object-cover border border-[#C5A880]/50 shadow-md shrink-0"
                  />
                </div>
                <div className="text-xs text-[#10B981] font-bold mt-3 flex items-center gap-1 tabular-nums">
                  <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                  <span>+{formatBillionToman(simulation.totalCapitalGain)} سود سرمایه‌ای</span>
                </div>
              </div>

              {/* Card 2: Strategy Dynamic Value (Deposit / Cash Discount / Installment) */}
              <div className="rounded-2xl bg-[#112A24] border border-[#C5A880]/30 p-4 sm:p-5 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-[#FBFBF8]/65 font-medium">
                    {strategy === 'cash' && 'تخفیف نقدی پای قرارداد'}
                    {strategy === 'deposit' && 'اهرم رهن کامل برآوردی'}
                    {strategy === 'developer' && 'پیش‌پرداخت نقد اولیه (۴۰٪)'}
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-[#FBFBF8] tabular-nums mt-1.5">
                    {strategy === 'cash' && formatBillionToman(simulation.cashDiscount)}
                    {strategy === 'deposit' && formatBillionToman(simulation.fullDepositAmount)}
                    {strategy === 'developer' && formatBillionToman(simulation.developerDownpayment)}
                  </div>
                </div>

                <div className="text-[11px] text-[#C5A880] font-medium mt-3 tabular-nums">
                  {strategy === 'cash' && `خالص پرداختی: ${formatBillionToman(simulation.netCashPrice)}`}
                  {strategy === 'deposit' && `خالص بودجه نقد: ${formatBillionToman(simulation.outOfPocketWithDeposit)}`}
                  {strategy === 'developer' && `مانده ${formatBillionToman(simulation.developerInstallments)} طی ۳۰ ماه`}
                </div>
              </div>

              {/* Card 3: Liquidity & Wealth Shield Index */}
              <div className="rounded-2xl bg-[#112A24] border border-[#C5A880]/30 p-4 sm:p-5 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-[#FBFBF8]/65 font-medium">
                    شاخص نقدشوندگی و کشش بازار
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-[#10B981] tabular-nums mt-1.5">
                    {toPersianDigits(simulation.liquidityScore)} از ۱۰۰
                  </div>
                </div>
                <div className="text-xs text-[#FBFBF8]/60 mt-3 tabular-nums flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] shrink-0" />
                  <span>مدت فروش مجدد: ~{toPersianDigits(simulation.avgDaysToResell)} روز</span>
                </div>
              </div>
            </div>

            {/* 5-Year Compound Growth Visual Chart */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white/90">
                    نمودار رشد مرکب دارایی (سال ۰ تا سال ۵)
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#C5A880]/20 text-[#C5A880] font-bold tabular-nums">
                    رشد {toPersianDigits(simulation.growthMultiplier)} برابری
                  </span>
                </div>
                <span className="text-[11px] text-[#C5A880] font-semibold tabular-nums">
                  واحد: میلیارد تومان
                </span>
              </div>

              <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-52 pt-8 px-2 bg-black/20 rounded-2xl border border-white/5">
                {simulation.yearlyProjection.map((point) => {
                  const heightPct = Math.max(22, Math.round((point.value / maxChartVal) * 100));
                  const isFinal = point.year === 5;
                  const isStart = point.year === 0;

                  return (
                    <div
                      key={point.year}
                      className="flex flex-col items-center gap-2 h-full justify-end group cursor-pointer"
                    >
                      <span
                        className={`text-[9.5px] xs:text-[11px] sm:text-xs font-bold tabular-nums transition-transform group-hover:scale-110 ${
                          isFinal
                            ? 'text-[#C5A880] font-black'
                            : isStart
                            ? 'text-white/60'
                            : 'text-white/80'
                        }`}
                      >
                        {toPersianDigits(point.value)}
                      </span>

                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full max-w-[42px] rounded-t-xl transition-all duration-500 ${
                          isFinal
                            ? 'bg-gradient-to-t from-[#9A7D56] via-[#C5A880] to-[#E8D9C4] shadow-lg shadow-[#C5A880]/30'
                            : isStart
                            ? 'bg-white/20 group-hover:bg-white/30'
                            : 'bg-gradient-to-t from-emerald-950/80 to-[#10B981]/60 group-hover:to-[#10B981]'
                        }`}
                      />

                      <span
                        className={`text-[9.5px] xs:text-[11px] font-semibold mt-1 whitespace-nowrap ${
                          isFinal ? 'text-[#C5A880] font-bold' : 'text-white/60'
                        }`}
                      >
                        {isStart ? 'امروز' : `سال ${toPersianDigits(point.year)}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom VIP CTA Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
              <div className="text-xs text-white/65 leading-relaxed text-center sm:text-right">
                <span>
                  برای بررسی جزئیات جریان نقدینگی و تدوین سناریوی سرمایه‌گذاری اختصاصی، با کارشناسان مالی ما در ارتباط باشید.
                </span>
              </div>

              <button
                type="button"
                onClick={onOpenVip}
                className="w-full sm:w-auto px-6 h-11 rounded-full gold-cta-btn text-[#0B1B17] text-xs sm:text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#C5A880]/20 shrink-0 hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                <span>دریافت تحلیل مالی اختصاصی این بودجه</span>
                <ArrowUpLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

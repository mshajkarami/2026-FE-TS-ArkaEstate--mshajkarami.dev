import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpLeft,
  CheckCircle2,
  Sparkles,
  X,
} from 'lucide-react';
import {
  LUXURY_PROPERTIES,
  LuxuryProperty,
  NEIGHBORHOOD_OPTIONS,
  NeighborhoodId,
  PurposeMode,
} from '../data/properties';
import { formatBillionToman, toPersianDigits } from '../utils/format';

interface MatchWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPurpose: PurposeMode;
  initialNeighborhood: NeighborhoodId;
  initialBudgetMin: number;
  initialBudgetMax: number;
  onSelectPropertyForVip: (property: LuxuryProperty) => void;
}

type PriorityId = 'quiet' | 'roi' | 'view' | 'smart';

export const MatchWizardModal: React.FC<MatchWizardModalProps> = ({
  isOpen,
  onClose,
  initialPurpose,
  initialNeighborhood,
  initialBudgetMin,
  initialBudgetMax,
  onSelectPropertyForVip,
}) => {
  const [step, setStep] = useState(1);
  const [purpose, setPurpose] = useState<PurposeMode>(initialPurpose);
  const [neighborhood, setNeighborhood] = useState<NeighborhoodId>(initialNeighborhood);
  const [budgetCap, setBudgetCap] = useState(initialBudgetMax);
  const [priorities, setPriorities] = useState<PriorityId[]>(['quiet', 'roi']);

  const togglePriority = (id: PriorityId) => {
    setPriorities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const rankedMatches = useMemo(() => {
    return LUXURY_PROPERTIES.map((prop) => {
      let score = 78;
      const reasons: string[] = [];

      if (prop.purpose.includes(purpose)) {
        score += 9;
        reasons.push('منطبق با هدف اصلی خرید');
      }
      if (neighborhood === 'all' || prop.neighborhood === neighborhood) {
        score += 6;
        reasons.push(`واقع در محدوده ${prop.neighborhoodLabel}`);
      }
      if (prop.priceBillion <= budgetCap && prop.priceBillion >= initialBudgetMin - 15) {
        score += 5;
        reasons.push('در بازه بودجه هدف شما');
      }
      if (priorities.includes('roi') && prop.annualRoiPercent >= 28) {
        score += 2;
        reasons.push(`بازدهی تخمینی ${toPersianDigits(prop.annualRoiPercent)}٪ سالانه`);
      }
      if (priorities.includes('smart') && prop.bmsSmart) {
        score += 1;
        reasons.push('مجهز به سیستم هوشمند BMS');
      }

      return {
        property: prop,
        computedScore: Math.min(99, score),
        reasons: reasons.slice(0, 3),
      };
    }).sort((a, b) => b.computedScore - a.computedScore);
  }, [purpose, neighborhood, budgetCap, initialBudgetMin, priorities]);

  if (!isOpen) return null;

  const progressPct = (step / 4) * 100;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="ویزارد هوشمند تطبیق ملک آرکا استیت"
      className="fixed inset-0 z-[80] bg-[#0B1B17]/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-3xl bg-[#FBFBF8] border border-[#C5A880]/30 shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar + Golden Progress */}
        <div className="bg-[#0B1B17] text-[#FBFBF8] p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#C5A880]/20 border border-[#C5A880]/40 text-[#C5A880] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold">
                  ویزارد تطبیق هوشمند ملک آرکا
                </h3>
                <p className="text-xs text-white/65">
                  گام {toPersianDigits(step)} از {toPersianDigits(4)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="بستن ویزارد"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-5 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-l from-[#D8BD98] to-[#C5A880] transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Step Body */}
        <div className="p-6 sm:p-7 space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="text-lg font-extrabold text-[#0B1B17]">
                اولویت اصلی شما از این خرید چیست؟
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {[
                  {
                    id: 'family' as PurposeMode,
                    title: 'سکونت خانوادگی آرام و باکیفیت',
                    desc: 'تمرکز بر دنج بودن محله، نورگیری طبیعی و استاندارد بالای مشاعات',
                  },
                  {
                    id: 'investment' as PurposeMode,
                    title: 'سرمایه‌گذاری پربازده و نقدشوندگی سریع',
                    desc: 'تمرکز بر خرید زیر قیمت کارشناسی و نرخ رشد ۵ ساله بالاتر از میانگین',
                  },
                  {
                    id: 'penthouse' as PurposeMode,
                    title: 'پنت‌هاوس، برج‌باغ و املاک کلکسیونی',
                    desc: 'تمرکز بر معماری امضادار، چشم‌انداز بدون مشرف و تراس اختصاصی',
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPurpose(opt.id)}
                    className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
                      purpose === opt.id
                        ? 'bg-[#0B1B17] text-[#FBFBF8] border-[#0B1B17]'
                        : 'bg-white text-[#0B1B17] border-[#C5A880]/25 hover:bg-[#F5EFE6]/70'
                    }`}
                  >
                    <div className="font-extrabold text-sm">{opt.title}</div>
                    <div
                      className={`text-xs mt-1 ${
                        purpose === opt.id ? 'text-white/70' : 'text-[#0B1B17]/60'
                      }`}
                    >
                      {opt.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h4 className="text-lg font-extrabold text-[#0B1B17]">
                محله هدف و سقف بودجه شما چقدر است؟
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {NEIGHBORHOOD_OPTIONS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setNeighborhood(item.id)}
                    className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${
                      neighborhood === item.id
                        ? 'bg-[#0B1B17] text-[#FBFBF8] border-[#0B1B17]'
                        : 'bg-white text-[#0B1B17] border-[#C5A880]/25 hover:bg-[#F5EFE6]/70'
                    }`}
                  >
                    <div className="text-xs font-extrabold">{item.label}</div>
                    <div
                      className={`text-[11px] mt-1 ${
                        neighborhood === item.id ? 'text-[#C5A880]' : 'text-[#0B1B17]/55'
                      }`}
                    >
                      میانگین متری: {item.avgPricePerSqm}
                    </div>
                  </button>
                ))}
              </div>

              <div className="rounded-2xl bg-white border border-[#C5A880]/25 p-4 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#0B1B17]/75">سقف بودجه مدنظر</span>
                  <span className="text-[#9A7D56] tabular-nums">
                    تا {formatBillionToman(budgetCap)}
                  </span>
                </div>
                <input
                  type="range"
                  min={35}
                  max={150}
                  step={5}
                  value={budgetCap}
                  onChange={(e) => setBudgetCap(Number(e.target.value))}
                  className="arka-range w-full bg-[#E8E2D5] rounded-full h-1.5"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h4 className="text-lg font-extrabold text-[#0B1B17]">
                کدام ویژگی‌های فنی و سبک زندگی برایتان حیاتی‌تر است؟
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'quiet' as PriorityId, label: 'کوچه دنج و عایق صوتی کامل' },
                  { id: 'roi' as PriorityId, label: 'بازدهی سالانه بالای ۲۸٪' },
                  { id: 'view' as PriorityId, label: 'چشم‌انداز کوهستان و تراس بزرگ' },
                  { id: 'smart' as PriorityId, label: 'سیستم هوشمند BMS و پارکینگ اضافه' },
                ].map((item) => {
                  const active = priorities.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => togglePriority(item.id)}
                      className={`p-4 rounded-2xl border text-right flex items-center justify-between gap-3 transition-all cursor-pointer ${
                        active
                          ? 'bg-[#0B1B17] text-[#FBFBF8] border-[#0B1B17]'
                          : 'bg-white text-[#0B1B17] border-[#C5A880]/25 hover:bg-[#F5EFE6]/70'
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-bold">{item.label}</span>
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 ${
                          active ? 'text-[#C5A880]' : 'text-[#0B1B17]/20'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-lg font-extrabold text-[#0B1B17]">
                  نتایج تطبیق هوشمند برای پروفایل شما
                </h4>
                <p className="text-xs text-[#0B1B17]/60">
                  مرتب‌شده بر اساس بالاترین هم‌راستایی با هدف، بودجه و تحلیل ۳ کارشناس
                </p>
              </div>

              <div className="space-y-3 max-h-[340px] overflow-y-auto pl-1">
                {rankedMatches.slice(0, 3).map(({ property, computedScore, reasons }) => (
                  <div
                    key={property.id}
                    className="rounded-2xl bg-white border border-[#C5A880]/25 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#10B981] tabular-nums">
                          {toPersianDigits(computedScore)}٪ تطابق
                        </span>
                        <span aria-hidden="true" className="text-[#C5A880]">·</span>
                        <span className="text-xs text-[#0B1B17]/60">
                          {property.neighborhoodLabel}
                        </span>
                      </div>
                      <div className="text-sm sm:text-base font-extrabold text-[#0B1B17]">
                        {property.title}
                      </div>
                      <div className="text-xs font-bold text-[#9A7D56] tabular-nums">
                        {formatBillionToman(property.priceBillion)} · {toPersianDigits(property.areaSqm)} متر
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {reasons.map((r) => (
                          <span key={r} className="text-[11px] text-[#0B1B17]/65">
                            ✓ {r}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelectPropertyForVip(property);
                      }}
                      className="px-4 h-10 rounded-full gold-cta-btn text-[#0B1B17] text-xs font-extrabold inline-flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>هماهنگی بازدید</span>
                      <ArrowUpLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Wizard Navigation Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[#C5A880]/20">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="inline-flex items-center gap-1.5 px-4 h-11 rounded-full border border-[#C5A880]/30 bg-white hover:bg-[#F5EFE6] text-xs font-bold text-[#0B1B17] transition-colors cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                <span>مرحله قبل</span>
              </button>
            ) : (
              <span className="text-xs text-[#0B1B17]/45">بدون نیاز به ثبت‌نام</span>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="inline-flex items-center gap-2 px-6 h-11 rounded-full gold-cta-btn text-[#0B1B17] text-xs sm:text-sm font-extrabold cursor-pointer"
              >
                <span>{step === 3 ? 'مشاهده املاک منطبق' : 'مرحله بعد'}</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-bold text-[#9A7D56] hover:text-[#0B1B17] transition-colors cursor-pointer"
              >
                تکرار ارزیابی با معیار جدید
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

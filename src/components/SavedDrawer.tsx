import React from 'react';
import { ArrowUpLeft, Heart, Trash2, X } from 'lucide-react';
import { LuxuryProperty } from '../data/properties';
import { formatBillionToman, toPersianDigits } from '../utils/format';

interface SavedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedProperties: LuxuryProperty[];
  onRemove: (id: string) => void;
  onBookVip: (property: LuxuryProperty) => void;
}

export const SavedDrawer: React.FC<SavedDrawerProps> = ({
  isOpen,
  onClose,
  savedProperties,
  onRemove,
  onBookVip,
}) => {
  React.useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const totalPortfolioValue = savedProperties.reduce(
    (sum, p) => sum + p.priceBillion,
    0
  );
  const avgRoi =
    savedProperties.length > 0
      ? Math.round(
          savedProperties.reduce((sum, p) => sum + p.annualRoiPercent, 0) /
            savedProperties.length
        )
      : 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="سبد املاک نشان‌شده"
      className="fixed inset-0 z-[80] bg-[#0B1B17]/50 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md h-full bg-[#FBFBF8] border-r border-[#C5A880]/30 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#0B1B17] text-[#FBFBF8] p-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Heart className="w-5 h-5 text-[#C5A880] fill-[#C5A880]/40" />
            <div>
              <h3 className="text-base font-extrabold">سبد املاک نشان‌شده</h3>
              <p className="text-xs text-white/60 tabular-nums">
                {toPersianDigits(savedProperties.length)} ملک در سبد مقایسه
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن سبد"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Summary Strip */}
        {savedProperties.length > 0 && (
          <div className="px-6 py-4 bg-[#F5EFE6]/80 border-b border-[#C5A880]/20 grid grid-cols-2 gap-4">
            <div>
              <div className="text-[11px] text-[#0B1B17]/60 font-medium">
                ارزش کل سبد انتخابی
              </div>
              <div className="text-sm font-black text-[#0B1B17] tabular-nums mt-0.5">
                {formatBillionToman(totalPortfolioValue)}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[#0B1B17]/60 font-medium">
                میانگین بازدهی سالانه
              </div>
              <div className="text-sm font-black text-[#10B981] tabular-nums mt-0.5">
                {toPersianDigits(avgRoi)}٪ سالانه
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {savedProperties.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
              <Heart className="w-10 h-10 text-[#C5A880]/50" />
              <div className="text-sm font-bold text-[#0B1B17]">
                هنوز ملکی نشان نکرده‌اید
              </div>
              <p className="text-xs text-[#0B1B17]/60 max-w-xs leading-relaxed">
                با لمس آیکون قلب روی هر ملک، آن را به سبد سرمایه‌گذاری و مقایسه اضافه کنید.
              </p>
            </div>
          ) : (
            savedProperties.map((prop) => (
              <div
                key={prop.id}
                className="rounded-2xl bg-white border border-[#C5A880]/25 p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs text-[#9A7D56] font-bold">
                      {prop.neighborhoodLabel}
                    </div>
                    <h4 className="text-sm font-extrabold text-[#0B1B17] mt-0.5">
                      {prop.title}
                    </h4>
                    <div className="text-xs font-bold text-[#0B1B17]/75 tabular-nums mt-1">
                      {formatBillionToman(prop.priceBillion)} · {toPersianDigits(prop.areaSqm)} متر
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(prop.id)}
                    aria-label={`حذف ${prop.title}`}
                    className="w-8 h-8 rounded-full text-[#0B1B17]/45 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onBookVip(prop);
                  }}
                  className="w-full h-9 rounded-xl bg-[#0B1B17] hover:bg-[#132E27] text-[#FBFBF8] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>هماهنگی بازدید VIP</span>
                  <ArrowUpLeft className="w-3.5 h-3.5 text-[#C5A880]" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

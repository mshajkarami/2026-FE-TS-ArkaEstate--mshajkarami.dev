import React, { useState } from 'react';
import { CheckCircle2, PhoneCall, ShieldCheck, X } from 'lucide-react';
import { LuxuryProperty } from '../data/properties';
import { formatBillionToman } from '../utils/format';

interface VipModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProperty: LuxuryProperty | null;
}

export const VipModal: React.FC<VipModalProps> = ({
  isOpen,
  onClose,
  selectedProperty,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredTime, setPreferredTime] = useState('عصر (۱۶ تا ۲۰)');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const resetAndClose = () => {
    setSubmitted(false);
    setError('');
    onClose();
  };

  React.useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        resetAndClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedPhone = phone.replace(/[^\d۰-۹]/g, '');
    if (fullName.trim().length < 3) {
      setError('لطفاً نام و نام خانوادگی خود را به صورت کامل وارد کنید.');
      return;
    }
    if (cleanedPhone.length < 10) {
      setError('لطفاً شماره موبایل معتبر (مانند ۰۹۱۲۳۴۵۶۷۸۹) وارد کنید.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="درخواست مشاوره اختصاصی VIP"
      className="fixed inset-0 z-[85] bg-[#0B1B17]/60 backdrop-blur-md flex items-center justify-center p-4"
      onClick={resetAndClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-[#FBFBF8] border border-[#C5A880]/30 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#0B1B17] text-[#FBFBF8] p-6 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-[#C5A880]">
              سرویس خصوصی مشتریان آرکا استیت
            </div>
            <h3 className="text-lg sm:text-xl font-black mt-1">
              رزرو مشاوره اختصاصی VIP
            </h3>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            aria-label="بستن"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 sm:p-7">
          {submitted ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#10B981]/12 text-[#10B981] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-extrabold text-[#0B1B17]">
                درخواست مشاوره اختصاصی شما ثبت شد
              </h4>
              <p className="text-sm text-[#0B1B17]/70 leading-relaxed max-w-sm mx-auto">
                {fullName} گرامی، مشاور ارشد آرکا استیت در بازه <span className="font-bold text-[#0B1B17]">{preferredTime}</span> با شماره <span className="font-bold text-[#0B1B17]">{phone}</span> تماس خواهد گرفت.
              </p>
              <button
                type="button"
                onClick={resetAndClose}
                className="mt-2 px-7 h-11 rounded-full bg-[#0B1B17] text-[#FBFBF8] text-xs font-bold cursor-pointer"
              >
                بازگشت به صفحه اصلی
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {selectedProperty && (
                <div className="rounded-2xl bg-[#F5EFE6]/85 border border-[#C5A880]/30 p-4">
                  <div className="text-[11px] font-bold text-[#9A7D56]">
                    ملک انتخاب‌شده برای بازدید خصوصی
                  </div>
                  <div className="text-sm font-extrabold text-[#0B1B17] mt-0.5">
                    {selectedProperty.title} — {formatBillionToman(selectedProperty.priceBillion)}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="vip-name" className="block text-xs font-bold text-[#0B1B17]/80">
                  نام و نام خانوادگی
                </label>
                <input
                  id="vip-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="مثلاً: کیانوش رادمنش"
                  className="w-full h-12 px-4 rounded-2xl bg-white border border-[#C5A880]/30 text-sm text-[#0B1B17] focus:outline-none focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="vip-phone" className="block text-xs font-bold text-[#0B1B17]/80">
                  شماره تماس مستقیم
                </label>
                <input
                  id="vip-phone"
                  type="tel"
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0912 000 0000"
                  className="w-full h-12 px-4 rounded-2xl bg-white border border-[#C5A880]/30 text-sm text-[#0B1B17] text-right focus:outline-none focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20"
                />
              </div>

              <div className="space-y-1.5">
                <span className="block text-xs font-bold text-[#0B1B17]/80">
                  بازه زمانی ترجیحی تماس
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {['صبح (۱۰ تا ۱۳)', 'ظهر (۱۳ تا ۱۶)', 'عصر (۱۶ تا ۲۰)'].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setPreferredTime(slot)}
                      className={`h-10 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
                        preferredTime === slot
                          ? 'bg-[#0B1B17] text-[#FBFBF8] border-[#0B1B17]'
                          : 'bg-white text-[#0B1B17]/75 border-[#C5A880]/25 hover:bg-[#F5EFE6]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <p role="alert" className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full h-12 rounded-full gold-cta-btn text-[#0B1B17] text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>ثبت درخواست مشاوره محرمانه</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#0B1B17]/55 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                <span>اطلاعات شما کاملاً محرمانه و صرفاً در اختیار مدیر پرونده قرار می‌گیرد.</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

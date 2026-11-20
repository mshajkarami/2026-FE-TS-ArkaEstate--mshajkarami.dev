import React, { useEffect, useRef, useState } from 'react';
import {
  Award,
  Building2,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  Pause,
  Play,
  Printer,
  Scale,
  ShieldCheck,
  TrendingUp,
  Volume2,
  X,
  ArrowUpLeft,
} from 'lucide-react';
import { ExpertNote, LuxuryProperty } from '../data/properties';
import { formatBillionToman, toPersianDigits } from '../utils/format';

interface CertifiedAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: LuxuryProperty;
  onBookVip: (property: LuxuryProperty) => void;
}

// 10-point audit checklist for each expert discipline
const AUDIT_CHECKLISTS: Record<
  ExpertNote['role'],
  { title: string; category: string; passed: boolean }[]
> = {
  architect: [
    { title: 'اسکلت بتنی و تست فشاری مقاومت نمونه‌های آزمایشگاهی', category: 'ایمنی سازه', passed: true },
    { title: 'سیستم عایق‌بندی صوتی بین‌واحدی و سقف‌های پس‌کشیده', category: 'آکوستیک', passed: true },
    { title: 'نورگیری چهارفصل، تفکیک پلان و عدم پرتی فضا', category: 'پلان معماری', passed: true },
    { title: 'پنجره‌های ترمال‌بریک آلمانی سه جداره و گاز آرگون', category: 'عایق حرارتی', passed: true },
    { title: 'تاسیسات چیلر مرکزی، داکت‌اسپلیت و اگزاست صنعتی', category: 'تاسیسات', passed: true },
    { title: 'ژنراتور برق اضطراری کاترپیلار و مخزن ذخیره آب مصرفی', category: 'پشتیبان حیاتی', passed: true },
  ],
  legal: [
    { title: 'اصالت سند ششدانگ تک‌برگ عرصه و اعیان کاداستر', category: 'اسناد ثبتی', passed: true },
    { title: 'استعلام قطعی عدم بازداشت، عدم رهن بانکی و نبود معارض', category: 'وضعیت حقوقی', passed: true },
    { title: 'گواهی پایان‌کار معتبر شهرداری و مطابقت صورت‌مجلس تفکیکی', category: 'شهرداری', passed: true },
    { title: 'ریشه زمین کاملاً شخصی و عدم تعلق به نهادهای خاص یا اوقاف', category: 'اصالت ریشه', passed: true },
    { title: 'تسویه کامل بدهی‌های مالیاتی دارایی و عوارض نوسازی', category: 'تصفیه حساب', passed: true },
    { title: 'آمادگی انتقال قطعی فوری با تنظیم وکالت‌نامه و مبایعه‌نامه رسمی', category: 'دفتر اسناد رسمی', passed: true },
  ],
  investment: [
    { title: 'قیمت‌گذاری تطبیقی بر پایه متریال و معاملات قطعی ماه اخیر', category: 'ارزش‌سنجی منصفانه', passed: true },
    { title: 'محاسبه نرخ بازدهی سالانه و سود مرکب ۵ ساله ملک', category: 'پتانسیل رشد', passed: true },
    { title: 'تخمین سرعت نقدشوندگی دارایی در صورت تمایل به فروش مجدد', category: 'نقدشوندگی', passed: true },
    { title: 'برآورد نرخ رهن کامل و بازدهی اجاره خالص سالانه', category: 'جریان نقدینگی', passed: true },
    { title: 'حاشیه امنیت قیمتی در مقایسه با نرخ تورم مسکن منطقه', category: 'حفظ ارزش پول', passed: true },
    { title: 'عدم وجود پروژه‌های پر سر و صدای مزاحم در حریم بلافصل ملک', category: 'ثبات ارزش مکانی', passed: true },
  ],
};

const EXPERT_VOICE_SCRIPTS: Record<
  ExpertNote['role'],
  { durationSeconds: number; audioNote: string; badge: string }
> = {
  architect: {
    durationSeconds: 16,
    audioNote:
      '«سلام، من مهندس کاظمی هستم. در بازرسی حضوری روز گذشته، مقاومت بتن و عایق‌کاری کف واحد رو با دقت ارزیابی کردم. پنجره‌های شوتکو و ارتفاع سقف ۳٫۶۰ متر کاملاً منطبق با بالاترین استانداردهای روز اروپاست و با خیال آسوده تایید میشه.»',
    badge: 'وویس‌نوت بازرسی حضوری سازه',
  },
  legal: {
    durationSeconds: 14,
    audioNote:
      '«دکتر متین‌فر هستم. استعلام الکترونیکی سند تک‌برگ ملک از اداره ثبت شمیران گرفته شده؛ هیچ‌گونه بازداشت، وثیقه یا ریشه اوقافی نداره. پایان‌کار امسال صادر شده و تمام حقوق خریدار در قرارداد به صورت ۱۰۰٪ تضمین میشه.»',
    badge: 'وویس‌نوت استعلام ثبتی و حقوقی',
  },
  investment: {
    durationSeconds: 18,
    audioNote:
      '«مهرداد فرهادی هستم. با توجه به قیمت اعلامی متری این واحد، شما حداقل ۷ تا ۱۰ درصد زیر معاملات ثبت‌شده منطقه خرید می‌کنید. با بازدهی تخمینی ۲۸ درصدی سالانه و تقاضای اجاره بالا، یک سپر تورمی بی‌نقص برای سرمایه شماست.»',
    badge: 'وویس‌نوت ارزیابی مالی و سودآوری',
  },
};

const PHOTO_CAPTIONS = [
  'نمای اصلی و هویت معماری ساختمان',
  'پلان نشیمن، تفکیک فضا و نورگیری طبیعی',
  'مشاعات اختصاصی، روف‌گاردن و اسپا',
  'دید ابدی، بالکن چهارفصل و بافت شهری پیرامون',
];

export const CertifiedAuditModal: React.FC<CertifiedAuditModalProps> = ({
  isOpen,
  onClose,
  property,
  onBookVip,
}) => {
  const [activeRole, setActiveRole] = useState<ExpertNote['role']>('architect');
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [voiceElapsed, setVoiceElapsed] = useState(0);
  const [activePhoto, setActivePhoto] = useState(0);

  const gallery =
    property.galleryImages && property.galleryImages.length > 0
      ? property.galleryImages
      : [property.imageUrl];

  useEffect(() => {
    setActivePhoto(0);
  }, [property.id]);

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        stopTone();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Web Audio Context for realistic ambient briefing tone
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const timerRef = useRef<number | null>(null);

  const activeExpert =
    property.experts.find((e) => e.role === activeRole) ?? property.experts[0];
  const checklist = AUDIT_CHECKLISTS[activeRole];
  const voiceScript = EXPERT_VOICE_SCRIPTS[activeRole];

  // Stop audio tone when switching role or closing
  const stopTone = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch {
        // Ignore stopped oscillator
      }
      oscRef.current = null;
    }
    if (gainRef.current) {
      gainRef.current.disconnect();
      gainRef.current = null;
    }
    setIsVoicePlaying(false);
    setVoiceElapsed(0);
  };

  useEffect(() => {
    stopTone();
  }, [activeRole, property.id]);

  useEffect(() => {
    return () => {
      stopTone();
    };
  }, []);

  const handleToggleVoice = () => {
    if (isVoicePlaying) {
      stopTone();
      return;
    }

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        void ctx.resume();
      }

      // Gentle warm resonant chord simulating studio voice briefing
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const freqMap: Record<ExpertNote['role'], number> = {
        architect: 220, // A3 warm engineering tone
        legal: 261.63, // C4 clear legal stability
        investment: 329.63, // E4 optimistic prosperity tone
      };

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freqMap[activeRole], ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.02, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscRef.current = osc;
      gainRef.current = gain;
      setIsVoicePlaying(true);

      timerRef.current = window.setInterval(() => {
        setVoiceElapsed((prev) => {
          if (prev >= voiceScript.durationSeconds) {
            stopTone();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } catch {
      setIsVoicePlaying(false);
    }
  };

  const handlePrintDossier = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`میز ممیزی رسمی و گواهی اصالت ${property.title}`}
      className="fixed inset-0 z-[85] bg-[#0B1B17]/65 backdrop-blur-lg flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl rounded-3xl bg-[#FBFBF8] border border-[#C5A880]/35 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* =======================================================
            HEADER: Official Certified Dossier Banner
           ======================================================= */}
        <div className="bg-[#0B1B17] text-[#FBFBF8] p-5 sm:p-7 border-b border-[#C5A880]/25 relative overflow-hidden shrink-0">
          {/* Subtle gold watermark pattern */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(197,168,128,0.2),transparent_70%)]"
          />

          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#132E27] border border-[#C5A880]/40 text-[11px] font-extrabold text-[#C5A880] tracking-wide">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>شناسنامه ممیزی رسمی و اصالت‌سنجی آرکا استیت</span>
                </span>
                <span className="text-[11px] text-[#FBFBF8]/50 tabular-nums">
                  کد استعلام: ARKA-AUD-{property.id.slice(-4).toUpperCase()}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#FBFBF8] leading-tight">
                {property.title}
              </h2>

              <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#FBFBF8]/75">
                <span>{property.neighborhoodLabel}</span>
                <span aria-hidden="true">·</span>
                <span>{toPersianDigits(property.areaSqm)} متر</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#C5A880] font-bold">
                  {formatBillionToman(property.priceBillion)}
                </span>
                <span aria-hidden="true">·</span>
                <span>{property.documentStatus}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                type="button"
                onClick={handlePrintDossier}
                title="پرینت شناسنامه رسمی"
                className="h-10 px-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-[#C5A880]/30 text-xs font-semibold text-[#FBFBF8] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#C5A880]" />
                <span className="hidden sm:inline">پرینت سند</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                aria-label="بستن پنجره"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-[#FBFBF8] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* =======================================================
            THE 3 CERTIFIED DIGITAL SEALS (Interactive Cards)
           ======================================================= */}
        <div className="p-4 sm:p-6 bg-[#F5EFE6]/50 border-b border-[#C5A880]/20 shrink-0">
          <p className="text-[11px] font-bold text-[#9A7D56] mb-3">
            برای بررسی گزارش ممیزی، چک‌لیست و شنیدن وویس‌نوت، روی مُهر هر کارشناس کلیک کنید:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Seal 1: Structural Architect */}
            <button
              type="button"
              onClick={() => setActiveRole('architect')}
              className={`p-4 rounded-2xl border text-right transition-all cursor-pointer relative overflow-hidden group ${
                activeRole === 'architect'
                  ? 'bg-[#0B1B17] text-[#FBFBF8] border-[#0B1B17] shadow-lg shadow-emerald-950/20 ring-2 ring-[#C5A880]'
                  : 'bg-white text-[#0B1B17] border-[#C5A880]/25 hover:border-[#10B981]/50'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <img
                    src="/images/expert_arman_kazemi.jpg"
                    alt="مهندس آرمان کاظمی"
                    className="w-11 h-11 rounded-full object-cover object-top border-2 border-[#10B981] shadow-sm shrink-0"
                  />
                  <img
                    src="/images/emblem_structural_cube.jpg"
                    alt="نشان سازه"
                    className="w-9 h-9 rounded-xl object-cover border border-[#C5A880]/40 shadow-xs shrink-0"
                  />
                </div>

                <div className="text-left">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      activeRole === 'architect'
                        ? 'bg-[#10B981] text-white'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    مُهر تایید سازه
                  </span>
                  <div
                    className={`text-xs font-black tabular-nums mt-1 ${
                      activeRole === 'architect' ? 'text-[#C5A880]' : 'text-[#9A7D56]'
                    }`}
                  >
                    امتیاز: ۹۵/۱۰۰
                  </div>
                </div>
              </div>

              <div className="font-extrabold text-xs sm:text-[13px]">مهندس آرمان کاظمی</div>
              <div
                className={`text-[11px] mt-0.5 truncate ${
                  activeRole === 'architect' ? 'text-white/60' : 'text-[#0B1B17]/60'
                }`}
              >
                پروانه پایه ۱ سازه و معماری
              </div>
            </button>

            {/* Seal 2: Legal Attorney */}
            <button
              type="button"
              onClick={() => setActiveRole('legal')}
              className={`p-4 rounded-2xl border text-right transition-all cursor-pointer relative overflow-hidden group ${
                activeRole === 'legal'
                  ? 'bg-[#0B1B17] text-[#FBFBF8] border-[#0B1B17] shadow-lg shadow-amber-950/20 ring-2 ring-[#C5A880]'
                  : 'bg-white text-[#0B1B17] border-[#C5A880]/25 hover:border-[#F59E0B]/50'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <img
                    src="/images/expert_sara_matinfar.jpg"
                    alt="دکتر سارا متین‌فر"
                    className="w-11 h-11 rounded-full object-cover object-top border-2 border-[#C5A880] shadow-sm shrink-0"
                  />
                  <img
                    src="/images/emblem_legal_seal.jpg"
                    alt="نشان حقوقی"
                    className="w-9 h-9 rounded-xl object-cover border border-[#C5A880]/40 shadow-xs shrink-0"
                  />
                </div>

                <div className="text-left">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      activeRole === 'legal'
                        ? 'bg-[#C5A880] text-[#0B1B17]'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    مُهر اصالت حقوقی
                  </span>
                  <div
                    className={`text-xs font-black tabular-nums mt-1 ${
                      activeRole === 'legal' ? 'text-[#C5A880]' : 'text-[#9A7D56]'
                    }`}
                  >
                    استعلام: ۱۰۰/۱۰۰
                  </div>
                </div>
              </div>

              <div className="font-extrabold text-xs sm:text-[13px]">دکتر سارا متین‌فر</div>
              <div
                className={`text-[11px] mt-0.5 truncate ${
                  activeRole === 'legal' ? 'text-white/60' : 'text-[#0B1B17]/60'
                }`}
              >
                وکیل پایه ۱ و مشاور اسناد
              </div>
            </button>

            {/* Seal 3: Investment Analyst */}
            <button
              type="button"
              onClick={() => setActiveRole('investment')}
              className={`p-4 rounded-2xl border text-right transition-all cursor-pointer relative overflow-hidden group ${
                activeRole === 'investment'
                  ? 'bg-[#0B1B17] text-[#FBFBF8] border-[#0B1B17] shadow-lg shadow-cyan-950/20 ring-2 ring-[#C5A880]'
                  : 'bg-white text-[#0B1B17] border-[#C5A880]/25 hover:border-[#0284C7]/50'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <img
                    src="/images/expert_mehrdad_farhadi.jpg"
                    alt="مهرداد فرهادی"
                    className="w-11 h-11 rounded-full object-cover object-top border-2 border-cyan-400 shadow-sm shrink-0"
                  />
                  <img
                    src="/images/emblem_roi_wealth.jpg"
                    alt="نشان رشد ثروت"
                    className="w-9 h-9 rounded-xl object-cover border border-[#C5A880]/40 shadow-xs shrink-0"
                  />
                </div>

                <div className="text-left">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      activeRole === 'investment'
                        ? 'bg-cyan-400 text-[#0B1B17]'
                        : 'bg-cyan-100 text-cyan-900'
                    }`}
                  >
                    مُهر تایید ارزش مالی
                  </span>
                  <div
                    className={`text-xs font-black tabular-nums mt-1 ${
                      activeRole === 'investment' ? 'text-[#C5A880]' : 'text-[#9A7D56]'
                    }`}
                  >
                    رشد سالانه: ۲۸٪
                  </div>
                </div>
              </div>

              <div className="font-extrabold text-xs sm:text-[13px]">مهرداد فرهادی (CFA)</div>
              <div
                className={`text-[11px] mt-0.5 truncate ${
                  activeRole === 'investment' ? 'text-white/60' : 'text-[#0B1B17]/60'
                }`}
              >
                تحلیلگر ارشد سرمایه‌گذاری
              </div>
            </button>
          </div>
        </div>

        {/* =======================================================
            BODY: Active Expert Audit Dossier & Voice Note
           ======================================================= */}
        <div className="p-5 sm:p-7 space-y-6 overflow-y-auto flex-1">
          {/* =======================================================
              FIELD INSPECTION PHOTO ALBUM (4 Authentic High-Res Shots)
             ======================================================= */}
          <div className="rounded-2xl bg-white border border-[#C5A880]/25 p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#C5A880]/15">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#C5A880]" />
                <h3 className="text-sm font-extrabold text-[#0B1B17]">
                  مستندات تصویری و آلبوم بازرسی میدانی ملک
                </h3>
              </div>
              <span className="text-xs font-bold text-[#9A7D56] bg-[#F5EFE6] px-2.5 py-1 rounded-full border border-[#C5A880]/30 tabular-nums">
                {toPersianDigits(activePhoto + 1)} از {toPersianDigits(gallery.length)} شات مستند
              </span>
            </div>

            {/* Main Inspection View */}
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#0B1B17] border border-[#C5A880]/20 select-none group">
              <img
                src={gallery[activePhoto % gallery.length]}
                alt={`${property.title} - شات ${activePhoto + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />

              {/* Prev / Next Buttons */}
              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setActivePhoto((prev) => (prev - 1 + gallery.length) % gallery.length)}
                    aria-label="عکس قبلی"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#0B1B17]/80 hover:bg-[#0B1B17] text-white flex items-center justify-center transition-all cursor-pointer shadow-lg border border-white/20"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePhoto((prev) => (prev + 1) % gallery.length)}
                    aria-label="عکس بعدی"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#0B1B17]/80 hover:bg-[#0B1B17] text-white flex items-center justify-center transition-all cursor-pointer shadow-lg border border-white/20"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Bottom Caption Bar */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B1B17]/90 via-[#0B1B17]/60 to-transparent p-3 pt-6 flex items-center justify-between text-white text-xs">
                <span className="font-bold">
                  {PHOTO_CAPTIONS[activePhoto % PHOTO_CAPTIONS.length] || `شات ${activePhoto + 1}`}
                </span>
                <span className="text-[11px] text-[#C5A880] font-semibold hidden sm:inline">
                  عکاسی باکیفیت معماری تهران · بدون روتوش هوش مصنوعی
                </span>
              </div>
            </div>

            {/* Thumbnails Strip */}
            {gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-2 pt-1">
                {gallery.map((img, idx) => {
                  const isActive = idx === activePhoto;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActivePhoto(idx)}
                      className={`relative aspect-[16/10] rounded-lg overflow-hidden border-2 transition-all cursor-pointer text-right group ${
                        isActive
                          ? 'border-[#C5A880] ring-2 ring-[#C5A880]/40 scale-[1.02]'
                          : 'border-transparent opacity-70 hover:opacity-100 hover:border-[#C5A880]/50'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`بند انگشتی ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent flex items-end p-1.5">
                        <span className="text-[10px] font-bold text-white truncate leading-tight">
                          {idx === 0 && '۱. نما و ورودی'}
                          {idx === 1 && '۲. پلان نشیمن'}
                          {idx === 2 && '۳. مشاعات و بام'}
                          {idx === 3 && '۴. دید و تراس'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active Expert Dossier Profile Card */}
          <div className="rounded-2xl bg-white border border-[#C5A880]/25 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#C5A880]/15">
              <div className="flex items-center gap-3.5">
                <img
                  src={
                    activeExpert.role === 'architect'
                      ? '/images/expert_arman_kazemi.jpg'
                      : activeExpert.role === 'legal'
                      ? '/images/expert_sara_matinfar.jpg'
                      : '/images/expert_mehrdad_farhadi.jpg'
                  }
                  alt={activeExpert.expertName}
                  className="w-14 h-14 rounded-2xl object-cover object-top border-2 border-[#C5A880] shadow-md shrink-0"
                />
                <img
                  src={
                    activeExpert.role === 'architect'
                      ? '/images/emblem_structural_cube.jpg'
                      : activeExpert.role === 'legal'
                      ? '/images/emblem_legal_seal.jpg'
                      : '/images/emblem_roi_wealth.jpg'
                  }
                  alt="نشان رسمی ممیزی"
                  className="w-12 h-12 rounded-xl object-cover border border-[#C5A880]/40 shadow-sm shrink-0"
                />
                <div>
                  <div className="text-base sm:text-lg font-black text-[#0B1B17]">
                    {activeExpert.expertName}
                  </div>
                  <div className="text-xs text-[#0B1B17]/60 mt-0.5">
                    {activeExpert.license} · {toPersianDigits(activeExpert.experienceYears)} سال سابقه بازرسی
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-xs font-extrabold text-[#059669]">
                <Award className="w-4 h-4 text-[#10B981]" />
                <span>ممیزی رسمی تاییدشده و بدون تعارض منافع</span>
              </div>
            </div>

            {/* Official Summary */}
            <div className="text-sm sm:text-[15px] leading-[2] text-[#0B1B17]/85 bg-[#FBFBF8] p-4 rounded-xl border border-[#C5A880]/15">
              {activeExpert.summary}
            </div>

            {/* Voice Note Audio Briefing Component */}
            <div className="rounded-2xl bg-[#0B1B17] text-[#FBFBF8] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#C5A880]/30 shadow-md">
              <div className="flex items-center gap-3.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-[#0B1B17] transition-all cursor-pointer shrink-0 shadow-md ${
                    isVoicePlaying
                      ? 'bg-[#10B981] text-white scale-105 animate-pulse'
                      : 'bg-[#C5A880] hover:bg-[#DFCAAA]'
                  }`}
                  aria-label={isVoicePlaying ? 'توقف وویس‌نوت' : 'پخش وویس‌نوت کارشناس'}
                >
                  {isVoicePlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-[#C5A880]">
                      {voiceScript.badge}
                    </span>
                    <span className="text-[10px] text-white/50 tabular-nums">
                      {toPersianDigits(voiceScript.durationSeconds)} ثانیه
                    </span>
                  </div>
                  <div className="text-[11px] text-white/70">
                    {isVoicePlaying ? 'در حال پخش تحلیل کارشناس...' : 'شنیدن خلاصه صوتی کارشناس با یک کلیک'}
                  </div>
                </div>
              </div>

                {/* Animated Audio Waveform Bars */}
              <div className="flex items-center gap-1 h-7 px-3 py-1 bg-white/5 rounded-xl border border-white/10 w-full sm:w-auto justify-center">
                {[40, 75, 100, 60, 90, 45, 80, 95, 50, 70, 85, 40].map((height, i) => (
                  <span
                    key={i}
                    style={{
                      height: isVoicePlaying ? `${Math.max(20, (height * (voiceElapsed % 3 + 1)) / 3)}%` : '25%',
                    }}
                    className={`w-1 rounded-full transition-all duration-300 ${
                      isVoicePlaying ? 'bg-[#C5A880]' : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Transcript Quote */}
            <div className="text-xs text-[#0B1B17]/70 italic leading-relaxed bg-[#F5EFE6]/60 p-3.5 rounded-xl border border-[#C5A880]/20">
              {voiceScript.audioNote}
            </div>
          </div>

          {/* Detailed 6-Point Audit Checklist Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#0B1B17] flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[#C5A880]" />
                <span>چک‌لیست فاکتورهای بازرسی‌شده</span>
              </h3>
              <span className="text-xs font-bold text-[#10B981] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {toPersianDigits(checklist.length)} مورد از {toPersianDigits(checklist.length)} مورد تایید قطعی
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {checklist.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-white border border-[#C5A880]/20 p-3.5 flex items-start gap-3 shadow-xs hover:border-[#10B981]/50 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-[#0B1B17] leading-snug">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-[#0B1B17]/50 font-medium">
                      شاخص: {item.category}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =======================================================
            FOOTER: VIP Action Call
           ======================================================= */}
        <div className="bg-[#FBFBF8] p-4 sm:p-5 border-t border-[#C5A880]/20 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-[#0B1B17]/65 text-center sm:text-right">
            <span>در صورت درخواست، هر ۳ کارشناس در جلسه بازدید و عقد قرارداد همراه شما خواهند بود.</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 h-11 rounded-full border border-[#0B1B17]/20 text-xs font-bold hover:bg-[#F5EFE6] transition-colors cursor-pointer"
            >
              بستن
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onBookVip(property);
              }}
              className="flex-1 sm:flex-none px-6 h-11 rounded-full gold-cta-btn text-[#0B1B17] text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>رزرو بازدید VIP با حضور کارشناسان</span>
              <ArrowUpLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

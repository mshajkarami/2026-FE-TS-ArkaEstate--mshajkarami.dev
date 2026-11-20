import React, { useEffect, useRef, useState } from 'react';
import {
  Award,
  Building2,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  FileCheck2,
  Heart,
  MapPin,
  Pause,
  Play,
  Printer,
  Scale,
  Share2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Volume2,
  ArrowRight,
  ArrowUpLeft,
  X,
  Copy,
  Check,
} from 'lucide-react';
import { ExpertNote, LuxuryProperty } from '../data/properties';
import { formatBillionToman, toPersianDigits } from '../utils/format';
import { ArkaLogo } from './ArkaLogo';

interface PropertyAuditPageProps {
  property: LuxuryProperty;
  onBack: () => void;
  onBookVip: (property: LuxuryProperty) => void;
  onConsultKaveh: (property: LuxuryProperty) => void;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
}

// 6-point audit checklist for each expert discipline
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
  'نمای اصلی و هویت معماری ساختمان در بافت اصیل منطقه',
  'پلان نشیمن، تفکیک فضا، نورگیری طبیعی و متریال کف',
  'مشاعات اختصاصی، روف‌گاردن، استخر و اسپای هوشمند',
  'دید ابدی کوهستان و شهر، بالکن چهارفصل و محوطه سبز',
];

export const PropertyAuditPage: React.FC<PropertyAuditPageProps> = ({
  property,
  onBack,
  onBookVip,
  onConsultKaveh,
  isSaved = false,
  onToggleSave,
}) => {
  const [activeRole, setActiveRole] = useState<ExpertNote['role']>('architect');
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [voiceElapsed, setVoiceElapsed] = useState(0);
  const [activePhoto, setActivePhoto] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const gallery =
    property.galleryImages && property.galleryImages.length > 0
      ? property.galleryImages
      : [property.imageUrl];

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
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {
        // Ignore closed context
      }
      audioCtxRef.current = null;
    }
    setIsVoicePlaying(false);
    setVoiceElapsed(0);
  };

  useEffect(() => {
    stopTone();
  }, [activeRole]);

  useEffect(() => {
    // Scroll to top when page opens
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Handle ESC key to return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        stopTone();
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      stopTone();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [property.id]);

  const handleToggleVoice = () => {
    if (isVoicePlaying) {
      stopTone();
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const baseFreq = activeRole === 'architect' ? 220 : activeRole === 'legal' ? 260 : 310;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscRef.current = osc;
      gainRef.current = gain;
      setIsVoicePlaying(true);
      setVoiceElapsed(0);

      const total = voiceScript.durationSeconds;
      timerRef.current = window.setInterval(() => {
        setVoiceElapsed((prev) => {
          if (prev >= total - 1) {
            stopTone();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } catch {
      setIsVoicePlaying(true);
      setVoiceElapsed(0);
      const total = voiceScript.durationSeconds;
      timerRef.current = window.setInterval(() => {
        setVoiceElapsed((prev) => {
          if (prev >= total - 1) {
            stopTone();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const handleCopyShareLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#audit-${property.id}`;
    navigator.clipboard?.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const pricePerSqmBillion = property.priceBillion / property.areaSqm;
  const pricePerSqmMillion = Math.round(pricePerSqmBillion * 1000);

  return (
    <div className="min-h-screen bg-[#FBFBF8] text-[#0B1B17] flex flex-col relative select-none animate-fadeIn">
      {/* =======================================================
          TOP STICKY LUXURY AUDIT DOSSIER BAR
         ======================================================= */}
      <header className="sticky top-0 z-50 bg-[#0B1B17]/95 backdrop-blur-xl border-b border-[#C5A880]/30 text-[#FBFBF8] shadow-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2.5 sm:gap-4">
          {/* Back button */}
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-[#C5A880] text-xs sm:text-sm font-bold text-white transition-all cursor-pointer shadow-sm group shrink-0"
          >
            <ArrowRight className="w-4 h-4 text-[#C5A880] group-hover:translate-x-1 transition-transform" />
            <span className="hidden sm:inline">بازگشت به کلکسیون املاک</span>
            <span className="sm:hidden">بازگشت</span>
          </button>

          {/* Center: Branding & Official Dossier Header */}
          <div className="hidden md:flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#132E27] border border-[#C5A880]/50 flex items-center justify-center shadow-xs">
              <ArkaLogo size={18} goldColor="#C5A880" />
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white">
                  شناسنامه ممیزی رسمی و گواهی اصالت
                </span>
                <span className="text-[10px] text-[#C5A880] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-[#C5A880]/40">
                  ARKA-AUD-{property.id.slice(-4).toUpperCase()}
                </span>
              </div>
              <div className="text-[11px] text-[#FBFBF8]/60 mt-0.5">
                تاییدیه مستقل ۳ جانبه · بدون تعارض منافع · کد رهگیری رسمی کاداستر
              </div>
            </div>
          </div>

          {/* Left Actions: Share + Print + VIP Button */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Share Link Button */}
            <button
              type="button"
              onClick={handleCopyShareLink}
              title="کپی لینک مستقیم شناسنامه برای اشتراک‌گذاری"
              className="h-9 sm:h-10 px-2.5 sm:px-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-[#C5A880]/30 text-xs font-semibold text-[#FBFBF8] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 hidden xs:inline">لینک کپی شد ✓</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-[#C5A880]" />
                  <span className="hidden sm:inline">اشتراک پرونده</span>
                </>
              )}
            </button>

            {/* Print Button */}
            <button
              type="button"
              onClick={() => window.print()}
              title="پرینت رسمی شناسنامه ممیزی"
              className="h-9 sm:h-10 px-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-[#C5A880]/30 text-xs font-semibold text-[#FBFBF8] flex items-center gap-1.5 transition-colors cursor-pointer hidden sm:inline-flex"
            >
              <Printer className="w-4 h-4 text-[#C5A880]" />
              <span>چاپ سند</span>
            </button>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={() => onBookVip(property)}
              className="h-9 sm:h-10 px-3.5 sm:px-5 rounded-full gold-cta-btn text-[#0B1B17] text-xs sm:text-[13px] font-extrabold flex items-center gap-1.5 cursor-pointer shadow-md whitespace-nowrap"
            >
              <span>رزرو بازدید VIP</span>
              <ArrowUpLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* =======================================================
            SECTION 1: HERO OVERVIEW & ARCHITECTURAL GALLERY
           ======================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Inspection Photo Album (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-3xl bg-white border border-[#C5A880]/30 p-4 sm:p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#C5A880]/15">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#C5A880]" />
                  <h3 className="text-sm font-extrabold text-[#0B1B17]">
                    مستندات تصویری و آلبوم بازرسی میدانی ملک
                  </h3>
                </div>
                <span className="text-xs font-bold text-[#9A7D56] bg-[#F5EFE6] px-3 py-1 rounded-full border border-[#C5A880]/30 tabular-nums">
                  {toPersianDigits(activePhoto + 1)} از {toPersianDigits(gallery.length)} شات مستند
                </span>
              </div>

              {/* Main Photo Viewer */}
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#0B1B17] border border-[#C5A880]/20 select-none group shadow-inner">
                <img
                  src={gallery[activePhoto % gallery.length]}
                  alt={`${property.title} - شات ${toPersianDigits(activePhoto + 1)}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />

                {/* Prev / Next Buttons */}
                {gallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setActivePhoto((prev) => (prev - 1 + gallery.length) % gallery.length)}
                      aria-label="عکس قبلی"
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0B1B17]/80 hover:bg-[#0B1B17] text-white flex items-center justify-center transition-all cursor-pointer shadow-lg border border-white/20"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePhoto((prev) => (prev + 1) % gallery.length)}
                      aria-label="عکس بعدی"
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0B1B17]/80 hover:bg-[#0B1B17] text-white flex items-center justify-center transition-all cursor-pointer shadow-lg border border-white/20"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Caption Bar */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B1B17]/95 via-[#0B1B17]/65 to-transparent p-4 pt-8 flex items-center justify-between text-white text-xs">
                  <span className="font-bold">
                    {PHOTO_CAPTIONS[activePhoto % PHOTO_CAPTIONS.length] || `شات بازرسی ${toPersianDigits(activePhoto + 1)}`}
                  </span>
                  <span className="text-[#C5A880] text-[11px] font-bold">
                    تصویربرداری تیم ممیزی آرکا
                  </span>
                </div>
              </div>

              {/* Thumbnails Row */}
              {gallery.length > 1 && (
                <div className="grid grid-cols-4 gap-2.5 pt-1">
                  {gallery.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActivePhoto(idx)}
                      className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        idx === activePhoto
                          ? 'border-[#C5A880] ring-2 ring-[#C5A880]/30 scale-[1.02]'
                          : 'border-transparent opacity-65 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`تصویر کوچک ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Property Passport & Certified Metadata (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl bg-white border border-[#C5A880]/30 p-6 sm:p-7 shadow-sm space-y-6">
              {/* Badge & Neighborhood */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#132E27] text-[#C5A880] text-xs font-bold border border-[#C5A880]/30">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{property.neighborhoodLabel}</span>
                </div>

                <div className="px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-xs font-extrabold text-[#059669]">
                  {property.documentStatus}
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B17] leading-tight">
                  {property.title}
                </h1>
                <p className="text-sm text-[#0B1B17]/70 leading-relaxed font-normal">
                  {property.subtitle}
                </p>
              </div>

              {/* Price Banner */}
              <div className="rounded-2xl bg-[#0B1B17] text-[#FBFBF8] p-5 border border-[#C5A880]/35 flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#FBFBF8]/60">ارزش کارشناسی منصفانه:</div>
                  <div className="text-2xl sm:text-3xl font-black text-[#C5A880] tabular-nums mt-0.5">
                    {formatBillionToman(property.priceBillion)}
                  </div>
                </div>
                <div className="text-left text-xs text-white/70">
                  <div>قیمت متری:</div>
                  <div className="font-extrabold text-[#FBFBF8] text-sm tabular-nums mt-0.5">
                    {toPersianDigits(pricePerSqmMillion)} میلیون تومان
                  </div>
                </div>
              </div>

              {/* 4-Item Specifications Matrix */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#FBFBF8] border border-[#C5A880]/20 space-y-0.5">
                  <div className="text-[#0B1B17]/50 font-medium">مساحت مفید سندی</div>
                  <div className="font-extrabold text-[#0B1B17] text-sm tabular-nums">
                    {toPersianDigits(property.areaSqm)} مترمربع
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FBFBF8] border border-[#C5A880]/20 space-y-0.5">
                  <div className="text-[#0B1B17]/50 font-medium">تعداد اتاق و خواب</div>
                  <div className="font-extrabold text-[#0B1B17] text-sm tabular-nums">
                    {toPersianDigits(property.bedrooms)} خواب مستر
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FBFBF8] border border-[#C5A880]/20 space-y-0.5">
                  <div className="text-[#0B1B17]/50 font-medium">پارکینگ اختصاصی</div>
                  <div className="font-extrabold text-[#0B1B17] text-sm tabular-nums">
                    {toPersianDigits(property.parkingSpaces)} پارکینگ سندی
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FBFBF8] border border-[#C5A880]/20 space-y-0.5">
                  <div className="text-[#0B1B17]/50 font-medium">وضعیت سند ملکی</div>
                  <div className="font-extrabold text-emerald-700 text-sm">
                    {property.documentStatus}
                  </div>
                </div>
              </div>

              {/* Master Governance Trust Seal */}
              <div className="p-4 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/30 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-[#10B981] shrink-0" />
                <div className="text-xs leading-relaxed text-[#065F46] font-semibold">
                  این ملک دارای گواهی ممیزی ۳ کارشناس مستقل (سازه، حقوقی و مالی) بوده و هرگونه تعارض منافع از معاملات آن حذف شده است.
                </div>
              </div>

              {/* Consult with Kaveh CTA */}
              <button
                type="button"
                onClick={() => onConsultKaveh(property)}
                className="w-full h-12 rounded-2xl border border-[#C5A880]/40 bg-[#F5EFE6] hover:bg-[#EDE3D4] text-[#0B1B17] text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <img src="./kaveh.jpg" alt="مهندس کاوه" className="w-6 h-6 rounded-full object-cover border border-[#C5A880]" />
                <span>تحلیل عمیق و حباب‌سنجی این فایل با کاوه</span>
                <Sparkles className="w-3.5 h-3.5 text-[#9A7D56]" />
              </button>
            </div>
          </div>
        </section>

        {/* =======================================================
            SECTION 2: THE 3 CERTIFIED DIGITAL SEALS (Interactive)
           ======================================================= */}
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-[#0B1B17]">
              هیئت ممیزی مستقل آرکا استیت برای این ملک
            </h2>
            <p className="text-xs sm:text-sm text-[#0B1B17]/65">
              برای مطالعه گزارش تفصیلی، بررسی چک‌لیست آزمایشگاهی و شنیدن صدای هر کارشناس، روی کارت ممیزی مربوطه کلیک کنید:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Seal 1: Structural Architect */}
            <button
              type="button"
              onClick={() => setActiveRole('architect')}
              className={`p-5 rounded-3xl border text-right transition-all cursor-pointer relative overflow-hidden group ${
                activeRole === 'architect'
                  ? 'bg-[#0B1B17] text-[#FBFBF8] border-[#0B1B17] shadow-xl shadow-emerald-950/20 ring-2 ring-[#C5A880]'
                  : 'bg-white text-[#0B1B17] border-[#C5A880]/25 hover:border-[#10B981]/50 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src="./images/expert_arman_kazemi.jpg"
                    alt="مهندس آرمان کاظمی"
                    className="w-13 h-13 rounded-2xl object-cover object-top border-2 border-[#10B981] shadow-sm shrink-0"
                  />
                  <img
                    src="./images/emblem_structural_cube.jpg"
                    alt="نشان ۳D سازه"
                    className="w-11 h-11 rounded-xl object-cover border border-[#C5A880]/40 shadow-xs shrink-0"
                  />
                </div>

                <div className="text-left">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      activeRole === 'architect'
                        ? 'bg-[#10B981] text-white'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    مُهر تایید سازه
                  </span>
                  <div
                    className={`text-sm font-black tabular-nums mt-1.5 ${
                      activeRole === 'architect' ? 'text-[#C5A880]' : 'text-[#9A7D56]'
                    }`}
                  >
                    امتیاز: ۹۵/۱۰۰
                  </div>
                </div>
              </div>

              <div className="font-extrabold text-sm sm:text-base">مهندس آرمان کاظمی</div>
              <div
                className={`text-xs mt-1 truncate ${
                  activeRole === 'architect' ? 'text-white/60' : 'text-[#0B1B17]/60'
                }`}
              >
                پروانه پایه ۱ سازه و معماری · ۱۷ سال سابقه
              </div>
            </button>

            {/* Seal 2: Legal Attorney */}
            <button
              type="button"
              onClick={() => setActiveRole('legal')}
              className={`p-5 rounded-3xl border text-right transition-all cursor-pointer relative overflow-hidden group ${
                activeRole === 'legal'
                  ? 'bg-[#0B1B17] text-[#FBFBF8] border-[#0B1B17] shadow-xl shadow-amber-950/20 ring-2 ring-[#C5A880]'
                  : 'bg-white text-[#0B1B17] border-[#C5A880]/25 hover:border-[#F59E0B]/50 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src="./images/expert_sara_matinfar.jpg"
                    alt="دکتر سارا متین‌فر"
                    className="w-13 h-13 rounded-2xl object-cover object-top border-2 border-[#C5A880] shadow-sm shrink-0"
                  />
                  <img
                    src="./images/emblem_legal_seal.jpg"
                    alt="نشان ۳D حقوقی"
                    className="w-11 h-11 rounded-xl object-cover border border-[#C5A880]/40 shadow-xs shrink-0"
                  />
                </div>

                <div className="text-left">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      activeRole === 'legal'
                        ? 'bg-[#C5A880] text-[#0B1B17]'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    مُهر اصالت حقوقی
                  </span>
                  <div
                    className={`text-sm font-black tabular-nums mt-1.5 ${
                      activeRole === 'legal' ? 'text-[#C5A880]' : 'text-[#9A7D56]'
                    }`}
                  >
                    استعلام: ۱۰۰/۱۰۰
                  </div>
                </div>
              </div>

              <div className="font-extrabold text-sm sm:text-base">دکتر سارا متین‌فر</div>
              <div
                className={`text-xs mt-1 truncate ${
                  activeRole === 'legal' ? 'text-white/60' : 'text-[#0B1B17]/60'
                }`}
              >
                وکیل پایه یک دادگستری · ۱۴ سال سابقه
              </div>
            </button>

            {/* Seal 3: Investment Analyst */}
            <button
              type="button"
              onClick={() => setActiveRole('investment')}
              className={`p-5 rounded-3xl border text-right transition-all cursor-pointer relative overflow-hidden group ${
                activeRole === 'investment'
                  ? 'bg-[#0B1B17] text-[#FBFBF8] border-[#0B1B17] shadow-xl shadow-cyan-950/20 ring-2 ring-[#C5A880]'
                  : 'bg-white text-[#0B1B17] border-[#C5A880]/25 hover:border-[#0284C7]/50 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src="./images/expert_mehrdad_farhadi.jpg"
                    alt="مهرداد فرهادی"
                    className="w-13 h-13 rounded-2xl object-cover object-top border-2 border-cyan-400 shadow-sm shrink-0"
                  />
                  <img
                    src="./images/emblem_roi_wealth.jpg"
                    alt="نشان ۳D رشد ثروت"
                    className="w-11 h-11 rounded-xl object-cover border border-[#C5A880]/40 shadow-xs shrink-0"
                  />
                </div>

                <div className="text-left">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      activeRole === 'investment'
                        ? 'bg-cyan-400 text-[#0B1B17]'
                        : 'bg-cyan-100 text-cyan-900'
                    }`}
                  >
                    مُهر تایید ارزش مالی
                  </span>
                  <div
                    className={`text-sm font-black tabular-nums mt-1.5 ${
                      activeRole === 'investment' ? 'text-[#C5A880]' : 'text-[#9A7D56]'
                    }`}
                  >
                    رشد سالانه: ۲۸٪
                  </div>
                </div>
              </div>

              <div className="font-extrabold text-sm sm:text-base">مهرداد فرهادی (CFA)</div>
              <div
                className={`text-xs mt-1 truncate ${
                  activeRole === 'investment' ? 'text-white/60' : 'text-[#0B1B17]/60'
                }`}
              >
                تحلیلگر ارشد مالی و سرمایه‌گذاری · ۱۲ سال سابقه
              </div>
            </button>
          </div>
        </section>

        {/* =======================================================
            SECTION 3: ACTIVE EXPERT DETAILED DOSSIER & VOICE BRIEFING
           ======================================================= */}
        <section className="rounded-3xl bg-white border border-[#C5A880]/30 p-6 sm:p-9 shadow-sm space-y-7">
          {/* Active Expert Profile Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#C5A880]/15">
            <div className="flex items-center gap-4">
              <img
                src={
                  activeExpert.role === 'architect'
                    ? './images/expert_arman_kazemi.jpg'
                    : activeExpert.role === 'legal'
                    ? './images/expert_sara_matinfar.jpg'
                    : './images/expert_mehrdad_farhadi.jpg'
                }
                alt={activeExpert.expertName}
                className="w-16 h-16 rounded-2xl object-cover object-top border-2 border-[#C5A880] shadow-md shrink-0"
              />
              <img
                src={
                  activeExpert.role === 'architect'
                    ? './images/emblem_structural_cube.jpg'
                    : activeExpert.role === 'legal'
                    ? './images/emblem_legal_seal.jpg'
                    : './images/emblem_roi_wealth.jpg'
                }
                alt="نشان رسمی ممیزی"
                className="w-13 h-13 rounded-xl object-cover border border-[#C5A880]/40 shadow-sm shrink-0"
              />
              <div>
                <div className="text-lg sm:text-xl font-black text-[#0B1B17]">
                  {activeExpert.expertName}
                </div>
                <div className="text-xs text-[#0B1B17]/65 mt-0.5 font-medium">
                  {activeExpert.license} · {toPersianDigits(activeExpert.experienceYears)} سال سابقه بازرسی میدانی
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-xs font-extrabold text-[#059669]">
              <Award className="w-4 h-4 text-[#10B981]" />
              <span>ممیزی رسمی بدون تعارض منافع و با ضمانت کتبی</span>
            </div>
          </div>

          {/* Official Written Summary */}
          <div className="text-sm sm:text-base leading-[2.1] text-[#0B1B17]/85 bg-[#FBFBF8] p-5 sm:p-6 rounded-2xl border border-[#C5A880]/20 font-medium">
            {activeExpert.summary}
          </div>

          {/* Voice Note Audio Briefing Component */}
          <div className="rounded-2xl bg-[#0B1B17] text-[#FBFBF8] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-5 border border-[#C5A880]/30 shadow-lg">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`w-13 h-13 rounded-full flex items-center justify-center text-[#0B1B17] transition-all cursor-pointer shrink-0 shadow-md ${
                  isVoicePlaying
                    ? 'bg-[#10B981] text-white scale-105 animate-pulse'
                    : 'bg-[#C5A880] hover:bg-[#DFCAAA]'
                }`}
                aria-label={isVoicePlaying ? 'توقف وویس‌نوت' : 'پخش وویس‌نوت کارشناس'}
              >
                {isVoicePlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>

              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs sm:text-sm font-extrabold text-[#C5A880]">
                    {voiceScript.badge}
                  </span>
                  <span className="text-xs text-white/50 tabular-nums">
                    {toPersianDigits(voiceScript.durationSeconds)} ثانیه
                  </span>
                </div>
                <div className="text-xs text-white/75">
                  {isVoicePlaying ? 'در حال پخش تحلیل کارشناس...' : 'شنیدن تحلیل صوتی کارشناس با یک کلیک'}
                </div>
              </div>
            </div>

            {/* Waveform Bars */}
            <div className="hidden xs:flex items-center gap-1 self-stretch sm:self-auto justify-center sm:justify-end">
              {Array.from({ length: 24 }).map((_, i) => {
                const heights = [
                  14, 28, 42, 20, 36, 48, 18, 30, 44, 26, 38, 50, 16, 32, 46, 22, 34, 40,
                  24, 42, 28, 36, 20, 14,
                ];
                const active = isVoicePlaying && (i * 0.7) % 3 === 0;
                return (
                  <div
                    key={i}
                    style={{ height: `${heights[i % heights.length]}px` }}
                    className={`w-1 rounded-full transition-all duration-150 ${
                      active
                        ? 'bg-[#10B981] scale-y-110'
                        : isVoicePlaying
                        ? 'bg-[#C5A880]/70'
                        : 'bg-white/20'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Voice Script Transcription */}
          <div className="text-xs sm:text-sm text-[#0B1B17]/70 italic bg-[#F5EFE6]/60 p-4 rounded-xl border border-[#C5A880]/15 leading-relaxed">
            {voiceScript.audioNote}
          </div>

          {/* 6-Point Technical Inspection Checklist Grid */}
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-extrabold text-[#0B1B17] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <span>چک‌لیست رسمی و آزمون‌های فنی تاییدشده ({checklist.length} بند):</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {checklist.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl p-4 bg-[#FBFBF8] border border-[#C5A880]/20 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#9A7D56] bg-[#F5EFE6] px-2 py-0.5 rounded-md border border-[#C5A880]/25">
                      {item.category}
                    </span>
                    <div className="text-xs sm:text-[13px] font-bold text-[#0B1B17] leading-snug">
                      {item.title}
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-[#10B981]/15 text-[#059669] text-[11px] font-extrabold border border-[#10B981]/30 shrink-0">
                    تایید ✓
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =======================================================
            SECTION 4: FINANCIAL & MARKET CONTEXT COMPARISON
           ======================================================= */}
        <section className="rounded-3xl bg-[#0B1B17] text-[#FBFBF8] p-6 sm:p-9 border border-[#C5A880]/30 shadow-xl space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-black text-[#FBFBF8]">
              سنجه‌های اقتصادی و حاشیه امنیت سرمایه‌گذاری این ملک
            </h3>
            <p className="text-xs text-[#FBFBF8]/65">
              محاسبات بر پایه معاملات قطعی سامانه ثبت اسناد شمیرانات و شاخص‌های اقتصاد مسکن پاییز ۱۴۰۴
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="text-xs text-[#FBFBF8]/60">حاشیه سود نسبت به منطقه</div>
              <div className="text-xl sm:text-2xl font-black text-[#10B981] tabular-nums">
                {toPersianDigits(property.belowMarketPercent)}٪ زیر قیمت بازار
              </div>
              <p className="text-[11px] text-white/50 pt-1">
                فرصت خرید منصفانه بدون پرداخت حباب قیمت
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="text-xs text-[#FBFBF8]/60">نرخ رشد مرکب سالانه</div>
              <div className="text-xl sm:text-2xl font-black text-[#C5A880] tabular-nums">
                {toPersianDigits(property.annualRoiPercent)}٪ سالانه
              </div>
              <p className="text-[11px] text-white/50 pt-1">
                پیش‌بینی بازده دارایی در افق ۵ ساله
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="text-xs text-[#FBFBF8]/60">سرعت میانگین فروش مجدد</div>
              <div className="text-xl sm:text-2xl font-black text-cyan-400 tabular-nums">
                {toPersianDigits(property.liquidityScore)} روز کاری
              </div>
              <p className="text-[11px] text-white/50 pt-1">
                نقدشوندگی سریع به دلیل اصالت نقشه و سند
              </p>
            </div>
          </div>
        </section>

        {/* =======================================================
            SECTION 5: BOTTOM ACTIONS & CONSULTATION BANNER
           ======================================================= */}
        <section className="rounded-3xl bg-gradient-to-r from-[#132E27] via-[#0F241F] to-[#0B1B17] border border-[#C5A880]/35 p-6 sm:p-9 text-[#FBFBF8] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-right">
            <h3 className="text-lg sm:text-xl font-black">
              آماده بازدید خصوصی این ملک با حضور مهندس ناظر هستید؟
            </h3>
            <p className="text-xs sm:text-sm text-white/70 max-w-xl">
              کنسیرژ اختصاصی شما هماهنگی بازدید حضوری را انجام داده و کارشناس سازه و مشاور حقوقی در محل ملک به پرسش‌های شما پاسخ خواهند داد.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onConsultKaveh(property)}
              className="w-full sm:w-auto h-12 px-5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <img src="./kaveh.jpg" alt="مهندس کاوه" className="w-5 h-5 rounded-full object-cover" />
              <span>ممیزی با کاوه</span>
            </button>

            <button
              type="button"
              onClick={() => onBookVip(property)}
              className="w-full sm:w-auto h-12 px-7 rounded-full gold-cta-btn text-[#0B1B17] text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>رزرو بازدید خصوصی VIP</span>
              <ArrowUpLeft className="w-4 h-4" />
            </button>
          </div>
        </section>
      </main>

      {/* Dossier Footer */}
      <footer className="bg-[#0B1B17] border-t border-[#C5A880]/20 py-8 text-center text-xs text-white/50">
        <p>
          شناسنامه رسمی ممیزی آرکا استیت · استعلام الکترونیکی کاداستر شمیرانات · تمامی حقوق محفوظ است {toPersianDigits(1405)}
        </p>
      </footer>
    </div>
  );
};

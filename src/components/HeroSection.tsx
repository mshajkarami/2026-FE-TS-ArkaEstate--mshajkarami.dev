import React, { useEffect, useRef, useState } from 'react';
import {
  Building2,
  ChevronDown,
  Compass,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  ArrowDown,
  Play,
  Pause,
  Film,
  Maximize2,
  Minimize2,
  SkipForward,
  SkipBack,
  MapPin,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import {
  HERO_PENTHOUSE_IMAGE,
  HERO_BACKGROUNDS,
  HERO_VIDEOS,
  HERO_SEQUENCES,
  HeroSequence,
  HeroShot,
  NEIGHBORHOOD_OPTIONS,
  NeighborhoodId,
  PurposeMode,
} from '../data/properties';
import { toPersianDigits } from '../utils/format';

interface HeroSectionProps {
  purpose: PurposeMode;
  onPurposeChange: (mode: PurposeMode) => void;
  neighborhood: NeighborhoodId;
  onNeighborhoodChange: (id: NeighborhoodId) => void;
  budgetMin: number;
  budgetMax: number;
  onBudgetChange: (min: number, max: number) => void;
  onOpenKaveh: () => void;
  onScrollToExperts: () => void;
}

const PURPOSE_TABS: { id: PurposeMode; label: string; hint: string }[] = [
  { id: 'family', label: 'سکونت خانوادگی', hint: 'آرامش و نورگیری' },
  { id: 'investment', label: 'سرمایه‌گذاری پربازده', hint: 'رشد و نقدشوندگی' },
  { id: 'penthouse', label: 'پنت‌هاوس و برج‌باغ', hint: 'کلکسیونی و خاص' },
];

const BUDGET_FLOOR = 15;
const BUDGET_CEILING = 150;
const MODES: PurposeMode[] = ['family', 'investment', 'penthouse'];

export const HeroSection: React.FC<HeroSectionProps> = ({
  purpose,
  onPurposeChange,
  neighborhood,
  onNeighborhoodChange,
  budgetMin,
  budgetMax,
  onBudgetChange,
  onOpenKaveh,
  onScrollToExperts,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [autoPlayReel, setAutoPlayReel] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isCinematic, setIsCinematic] = useState(false);
  const [currentShot, setCurrentShot] = useState<1 | 2>(1);
  const [progress, setProgress] = useState(0);

  // 6 video refs: 3 modes x 2 shots
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const [isHeroVisible, setIsHeroVisible] = useState(true);

  // Track hero visibility on scroll to pause video and timers when scrolled away
  useEffect(() => {
    const handleScroll = () => {
      const visible = window.scrollY < 120;
      setIsHeroVisible(visible);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Advance cleanly between shots and between purpose modes:
  // Shot 1 -> Shot 2 -> Next Mode (Shot 1)
  // Family -> Investment -> Penthouse -> Family
  const handleAdvance = () => {
    // If user has scrolled down into the page, freeze auto-advance to avoid changing property filters off-screen
    if (window.scrollY >= 120) return;

    if (currentShot === 1) {
      setCurrentShot(2);
      setProgress(0);
    } else {
      const currentIndex = MODES.indexOf(purpose);
      const nextIndex = (currentIndex + 1) % MODES.length;
      const nextMode = MODES[nextIndex];
      setCurrentShot(1);
      setProgress(0);
      onPurposeChange(nextMode);
    }
  };

  const currentModeIdx = MODES.indexOf(purpose);
  const nextMode = currentShot === 1 ? purpose : MODES[(currentModeIdx + 1) % MODES.length];
  const nextShotNum = currentShot === 1 ? 2 : 1;
  const nextKey = `${nextMode}_${nextShotNum}`;

  // Video playback controller: smoothly starts incoming video and keeps outgoing video paused
  useEffect(() => {
    MODES.forEach((m) => {
      ([1, 2] as const).forEach((s) => {
        const vid = videoRefs.current[`${m}_${s}`];
        if (vid) {
          const isCurrent = m === purpose && s === currentShot;
          if (isCurrent && isHeroVisible) {
            vid.currentTime = 0;
            vid.playbackRate = 1.0;
            if (isPlaying && (!isHovered || isCinematic)) {
              vid.play().catch(() => {});
            }
          } else {
            // Outgoing video or scrolled away: pause video to prevent CPU/GPU load
            vid.pause();
          }
        }
      });
    });
  }, [purpose, currentShot, isPlaying, isHovered, isCinematic, isHeroVisible]);

  // High-precision Progress & Safety Auto-Advance Ticker
  useEffect(() => {
    if (!isPlaying || !autoPlayReel || (isHovered && !isCinematic) || !isHeroVisible) {
      return;
    }

    const durationMs = 3920; // Exact length of our 3.92s videos
    const startTimestamp = Date.now();

    const interval = setInterval(() => {
      if (window.scrollY >= 120) return;

      const activeVid = videoRefs.current[`${purpose}_${currentShot}`];
      if (activeVid && !activeVid.paused && activeVid.duration > 0) {
        const pct = (activeVid.currentTime / activeVid.duration) * 100;
        setProgress(Math.min(100, Math.max(0, pct)));
      } else {
        const elapsed = Date.now() - startTimestamp;
        const pct = (elapsed / durationMs) * 100;
        setProgress(Math.min(100, pct));
        if (elapsed >= durationMs) {
          handleAdvance();
        }
      }
    }, 40);

    return () => clearInterval(interval);
  }, [purpose, currentShot, isPlaying, autoPlayReel, isHovered, isCinematic, isHeroVisible]);

  // Keyboard shortcut listener: Esc to exit cinematic mode, C to toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (e.target as HTMLElement)?.tagName;
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(activeTag)) return;

      if (e.key === 'Escape' && isCinematic) {
        setIsCinematic(false);
      } else if (e.key === 'c' || e.key === 'C') {
        setIsCinematic((prev) => !prev);
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCinematic]);

  const minPercent = ((budgetMin - BUDGET_FLOOR) / (BUDGET_CEILING - BUDGET_FLOOR)) * 100;
  const maxPercent = ((budgetMax - BUDGET_FLOOR) / (BUDGET_CEILING - BUDGET_FLOOR)) * 100;

  const handleMinSlider = (val: number) => {
    const clamped = Math.min(val, budgetMax - 10);
    onBudgetChange(clamped, budgetMax);
  };

  const handleMaxSlider = (val: number) => {
    const clamped = Math.max(val, budgetMin + 10);
    onBudgetChange(budgetMin, clamped);
  };

  const scrollToNextSection = () => {
    const el = document.getElementById('properties');
    if (el) {
      const navOffset = 85;
      const top = el.getBoundingClientRect().top + window.pageYOffset - navOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const handleNextShot = () => {
    handleAdvance();
  };

  const handlePrevShot = () => {
    if (currentShot === 2) {
      setCurrentShot(1);
      setProgress(0);
    } else {
      const currentIndex = MODES.indexOf(purpose);
      const prevIndex = (currentIndex - 1 + MODES.length) % MODES.length;
      const prevMode = MODES[prevIndex];
      setCurrentShot(2);
      setProgress(0);
      onPurposeChange(prevMode);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const activeSequence = HERO_SEQUENCES[purpose];
  const activeShot = activeSequence.shots[currentShot - 1];

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#0B1B17] text-[#FBFBF8] select-none"
    >
      {/* =======================================================
          BACKGROUND: Dynamic Tehran Multi-Shot Cinematic Video (6 Videos)
         ======================================================= */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {(Object.entries(HERO_SEQUENCES) as [PurposeMode, HeroSequence][]).map(([mode, seq]) => {
          return seq.shots.map((shot) => {
            const isCurrent = purpose === mode && currentShot === shot.shotNumber;
            const isNext = nextKey === `${mode}_${shot.shotNumber}`;
            return (
              <div
                key={`${mode}_shot${shot.shotNumber}`}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1200 ease-in-out ${
                  isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* Fallback Still Image / Poster */}
                <img
                  src={shot.poster}
                  alt={shot.title}
                  className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.90] contrast-[1.05]"
                />

                {/* Ambient Motion Video */}
                <video
                  ref={(el) => {
                    videoRefs.current[`${mode}_${shot.shotNumber}`] = el;
                  }}
                  src={shot.src}
                  poster={shot.poster}
                  autoPlay={isCurrent}
                  muted
                  loop={false}
                  playsInline
                  preload={isCurrent || isNext ? 'auto' : 'metadata'}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                  onTimeUpdate={(e) => {
                    if (isCurrent && isPlaying) {
                      const vid = e.currentTarget;
                      if (vid.duration > 0) {
                        setProgress((vid.currentTime / vid.duration) * 100);
                      }
                    }
                  }}
                  onEnded={() => {
                    if (isCurrent && autoPlayReel && isPlaying && (!isHovered || isCinematic) && isHeroVisible) {
                      handleAdvance();
                    }
                  }}
                  className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.90] contrast-[1.05]"
                />
              </div>
            );
          });
        })}

        {/* Cinematic Scrim Layers: Adjusted when in Cinema Mode for maximum visual brilliance */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 transition-opacity duration-700 pointer-events-none z-20 ${
            isCinematic
              ? 'bg-gradient-to-t from-black/80 via-transparent to-black/70'
              : 'bg-gradient-to-t from-[#0B1B17] via-[#0B1B17]/60 to-[#0B1B17]/45'
          }`}
        />
        <div
          aria-hidden="true"
          className={`absolute inset-0 transition-opacity duration-700 pointer-events-none z-20 ${
            isCinematic
              ? 'bg-[radial-gradient(ellipse_90%_70%_at_50%_45%,rgba(197,168,128,0.08),transparent_80%)]'
              : 'bg-[radial-gradient(ellipse_80%_60%_at_50%_35%,rgba(197,168,128,0.18),transparent_75%)]'
          }`}
        />
      </div>

      {/* =======================================================
          CINEMATIC MODE: Anamorphic Scope Letterbox Bars (Top & Bottom)
         ======================================================= */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-[#C5A880]/30 transition-all duration-700 px-4 sm:px-8 py-3.5 flex items-center justify-between ${
          isCinematic ? 'translate-y-0 opacity-100 shadow-2xl' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        {/* Right: Brand & Mode indicator */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C5A880] to-[#99794E] p-0.5 shadow-lg">
            <div className="w-full h-full rounded-[10px] bg-[#0B1B17] flex items-center justify-center">
              <Film className="w-4 h-4 text-[#C5A880]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white">سینماتیک اختصاصی پایتخت</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]/30 font-bold">
                1080p UHD · 60fps
              </span>
            </div>
            <p className="text-xs text-white/60 mt-0.5">
              سکانس {toPersianDigits(MODES.indexOf(purpose) + 1)} از ۳: {activeSequence.modeLabel}
            </p>
          </div>
        </div>

        {/* Center: Current Shot Name */}
        <div className="hidden md:flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-xs text-[#C5A880] font-bold">{activeShot.title}</span>
          <span className="text-white/40">·</span>
          <span className="text-xs text-white/70">{activeShot.location}</span>
        </div>

        {/* Left: Cinema Controls & Exit */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            title="تمام صفحه"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsCinematic(false)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#C5A880] hover:bg-[#b5966c] text-[#0B1B17] font-extrabold text-xs shadow-lg transition-transform hover:scale-105 cursor-pointer"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>خروج از سینما</span>
            <span className="text-[10px] opacity-75 font-mono hidden sm:inline">(Esc)</span>
          </button>
        </div>
      </div>

      {/* =======================================================
          TOP & CENTER: Headline, Badges & Floating Cards (Normal Mode)
         ======================================================= */}
      <div
        className={`relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 lg:pt-40 flex flex-col items-center transition-all duration-700 ${
          isCinematic ? 'opacity-0 -translate-y-12 pointer-events-none' : 'opacity-100 translate-y-0'
        }`}
      >
        {/* Editorial Value Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#C5A880]/40 text-xs sm:text-[13px] font-bold text-[#C5A880] shadow-lg mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>مرجع تخصصی ممیزی، ارزش‌گذاری و کارگزاری املاک فاخر پایتخت</span>
        </div>

        {/* Main Cinematic Typography */}
        <h1
          className="max-w-4xl mx-auto text-center text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-[62px] font-black leading-[1.3] sm:leading-[1.25] tracking-tight text-white mb-4 sm:mb-6"
          style={{ textWrap: 'balance' }}
        >
          خرید مطمئن املاک نشان‌دار در شمیرانات؛{' '}
          <span className="gold-gradient-text block sm:inline">
            پیش از معامله، دقیق و مستند بدانید چه می‌خرید
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-center text-xs sm:text-base md:text-lg leading-[1.9] text-[#FBFBF8]/80 font-normal mb-6 sm:mb-8 px-2 sm:px-0">
          بررسی میدانی مقاومت سازه، استعلام قطعی اسناد کاداستر و ارزیابی منصفانه قیمت با همراهی ۳ کارشناس مستقل؛ پیش از آنکه ریالی پای قرارداد برود.
        </p>

        {/* 3 Floating Glass Hologram Badges Over the Full-Screen View */}
        <div className="w-full max-w-5xl flex flex-wrap items-center justify-center lg:justify-between gap-2.5 sm:gap-4 my-2">
          {/* Badge 1: Match Score */}
          <div className="flex items-center gap-2.5 sm:gap-3 rounded-2xl bg-[#0B1B17]/75 backdrop-blur-xl border border-[#C5A880]/35 px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-xl">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]/30 flex items-center justify-center shrink-0">
              <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] sm:text-xs text-white/70">شاخص انطباق:</span>
                <span className="text-xs sm:text-sm font-black text-white tabular-nums">
                  {toPersianDigits(96)}٪
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#C5A880] font-medium mt-0.5">
                اصالت سازه · نورگیری چهارفصل
              </p>
            </div>
          </div>

          {/* Badge 2: ROI Metric + Sparkline */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 rounded-2xl bg-[#0B1B17]/75 backdrop-blur-xl border border-[#C5A880]/35 px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-xl">
            <div className="text-right">
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-white/70">
                <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" />
                <span>سود تخمینی ۵ ساله</span>
              </div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-sm sm:text-base font-black text-white tabular-nums">
                  {toPersianDigits(28)}٪
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-[#10B981]">سالانه</span>
              </div>
            </div>

            {/* Ascending Green Sparkline */}
            <svg
              width="50"
              height="24"
              viewBox="0 0 68 34"
              fill="none"
              aria-hidden="true"
              className="shrink-0 sm:w-[58px] sm:h-[28px]"
            >
              <defs>
                <linearGradient id="heroSparkFill" x1="0" y1="0" x2="0" y2="34" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M2 29C10 27 16 24 23 20C31 15.5 38 17 46 11C52 6.5 59 5 66 3V32H2V29Z"
                fill="url(#heroSparkFill)"
              />
              <path
                d="M2 29C10 27 16 24 23 20C31 15.5 38 17 46 11C52 6.5 59 5 66 3"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="66" cy="3" r="3" fill="#10B981" />
            </svg>
          </div>

          {/* Badge 3: 3-Expert Certified Button */}
          <button
            type="button"
            onClick={onScrollToExperts}
            className="flex items-center gap-2.5 sm:gap-3 rounded-2xl bg-[#0B1B17]/75 backdrop-blur-xl border border-[#C5A880]/35 px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-xl hover:bg-[#0B1B17]/90 transition-colors cursor-pointer text-right group"
          >
            <div className="flex -space-x-2 space-x-reverse shrink-0">
              <img
                src="/images/expert_arman_kazemi.jpg"
                alt="مهندس آرمان کاظمی"
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover object-top border-2 border-[#0B1B17] shadow-sm"
              />
              <img
                src="/images/expert_sara_matinfar.jpg"
                alt="دکتر سارا متین‌فر"
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover object-top border-2 border-[#0B1B17] shadow-sm"
              />
              <img
                src="/images/expert_mehrdad_farhadi.jpg"
                alt="مهرداد فرهادی"
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover object-top border-2 border-[#0B1B17] shadow-sm"
              />
            </div>
            <div>
              <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-white">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                <span>تاییدشده توسط ۳ کارشناس مستقل</span>
              </div>
              <p className="text-[9.5px] sm:text-[10px] text-white/60 mt-0.5 group-hover:text-[#C5A880] transition-colors">
                مشاهده شناسنامه ممیزی سازه، اسناد و قیمت
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* =======================================================
          CINEMATIC MODE: The Director's Floating Bottom HUD
         ======================================================= */}
      {isCinematic && (
        <div className="relative z-40 max-w-5xl w-full mx-auto px-4 sm:px-6 pb-6 pt-2 animate-fadeIn">
          <div className="rounded-3xl bg-black/85 backdrop-blur-2xl border border-[#C5A880]/40 p-5 sm:p-7 shadow-2xl">
            {/* Top row: Mode Tabs and Shot Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
              {/* Sequence / Mode Switchers */}
              <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-2xl border border-white/10">
                {PURPOSE_TABS.map((tab) => {
                  const active = purpose === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        onPurposeChange(tab.id);
                        setCurrentShot(1);
                        setProgress(0);
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        active
                          ? 'bg-[#C5A880] text-[#0B1B17] shadow-lg'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Direct Shot 1 / Shot 2 Switcher Buttons */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/50 hidden sm:inline">انتخاب شات:</span>
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentShot(1);
                      setProgress(0);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      currentShot === 1
                        ? 'bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]/40'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    شات ۱ (نما)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentShot(2);
                      setProgress(0);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      currentShot === 2
                        ? 'bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]/40'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    شات ۲ (معماری و فضا)
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Row: Shot Title Description and Player Controls */}
            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#C5A880]">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{activeShot.location}</span>
                  <span className="text-white/40">·</span>
                  <span className="text-white/80">{activeShot.highlight}</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white mt-1">
                  {activeShot.title}
                </h3>
                <p className="text-xs text-white/60 mt-0.5">
                  {activeShot.subtitle}
                </p>
              </div>

              {/* Cinematic Transport Controls */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={handlePrevShot}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="شات قبلی"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2.5 rounded-xl bg-[#C5A880] hover:bg-[#b5966c] text-[#0B1B17] font-bold transition-transform hover:scale-105 cursor-pointer shadow-lg"
                  title={isPlaying ? 'مکث' : 'پخش'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleNextShot}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="شات بعدی"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsCinematic(false)}
                  className="mr-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  بازگشت به جستجوی ملک
                </button>
              </div>
            </div>

            {/* 2-Segment Multi-Shot Progress Bar (RTL: fills from Right to Left) */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-l from-[#C5A880] to-[#E6CA9E] transition-all duration-75 ease-linear"
                  style={{ width: currentShot === 1 ? `${progress}%` : '100%' }}
                />
              </div>
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-l from-[#C5A880] to-[#E6CA9E] transition-all duration-75 ease-linear"
                  style={{ width: currentShot === 2 ? `${progress}%` : '0%' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================
          BOTTOM: The Floating Hero Search Console & Trust Bar (Normal Mode)
         ======================================================= */}
      <div
        className={`relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 pt-6 transition-all duration-700 ${
          isCinematic ? 'opacity-0 translate-y-16 pointer-events-none' : 'opacity-100 translate-y-0'
        }`}
      >
        {/* Floating Glassmorphic Search Console with Hover Auto-Pause */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="max-w-5xl mx-auto rounded-3xl bg-[#0B1B17]/85 backdrop-blur-2xl border border-[#C5A880]/35 shadow-2xl p-4 sm:p-6 lg:p-7 transition-all duration-300"
        >
          {/* Interactive Purpose Tabs with 2-Segment Story Progress Bars & Cinema Mode CTA */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2 max-w-full overflow-hidden">
              <div
                role="tablist"
                aria-label="هدف خرید ملک"
                className="inline-flex items-center gap-1 p-1 rounded-2xl bg-white/5 border border-white/10 max-w-full overflow-x-auto no-scrollbar"
              >
                {PURPOSE_TABS.map((tab) => {
                  const active = purpose === tab.id;
                  return (
                    <button
                      key={tab.id}
                      role="tab"
                      aria-selected={active}
                      type="button"
                      onClick={() => {
                        onPurposeChange(tab.id);
                        setCurrentShot(1);
                        setProgress(0);
                      }}
                      className={`relative px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-[13px] font-bold transition-all duration-300 whitespace-nowrap shrink-0 cursor-pointer overflow-hidden ${
                        active
                          ? 'bg-[#C5A880] text-[#0B1B17] shadow-md scale-[1.02]'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="relative z-10">{tab.label}</span>

                      {/* Instagram/Apple-style 2-Segment Progress Bar for Active Auto-Reel Video (RTL: fills from Right to Left) */}
                      {active && isPlaying && autoPlayReel && (
                        <div
                          aria-hidden="true"
                          className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0B1B17]/25 flex gap-1 px-1 overflow-hidden"
                        >
                          {/* Segment 1: Shot 1 (Right in RTL) */}
                          <div className="flex-1 h-full bg-[#0B1B17]/30 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#0B1B17] transition-all duration-75 ease-linear"
                              style={{
                                width: currentShot === 1 ? `${progress}%` : '100%',
                              }}
                            />
                          </div>
                          {/* Segment 2: Shot 2 (Left in RTL) */}
                          <div className="flex-1 h-full bg-[#0B1B17]/30 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#0B1B17] transition-all duration-75 ease-linear"
                              style={{
                                width: currentShot === 2 ? `${progress}%` : '0%',
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Discrete Shot Indicator */}
              <div className="hidden sm:flex items-center gap-1 text-[11px] text-white/60 px-2 py-1 rounded-lg bg-white/5 border border-white/10 tabular-nums">
                <span className="text-[#C5A880] font-bold">شات {toPersianDigits(currentShot)}</span>
                <span>از ۲</span>
              </div>
            </div>

            {/* Cinema Mode Toggle & Play/Pause Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Highlighted Cinema Mode Button */}
              <button
                type="button"
                onClick={() => setIsCinematic(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#C5A880]/20 to-[#C5A880]/10 hover:from-[#C5A880]/30 hover:to-[#C5A880]/20 border border-[#C5A880]/40 text-xs font-bold text-[#C5A880] hover:text-white transition-all shadow-md cursor-pointer group"
                title="ورود به حالت تماشای تمام‌صفحه سینمایی بدون المان‌های مزاحم (کلید میانبر C)"
              >
                <Film className="w-3.5 h-3.5 text-[#C5A880] group-hover:scale-110 transition-transform" />
                <span>حالت سینمایی</span>
                <span className="text-[10px] px-1 py-0.2 rounded bg-black/40 text-white/60 font-mono hidden md:inline">
                  C
                </span>
              </button>

              {/* Reel Status & Play/Pause Button */}
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-[11px] text-white/80">
                <span className="relative flex h-2 w-2">
                  <span
                    className={`absolute inline-flex h-full w-full rounded-full bg-[#10B981] ${
                      isPlaying && autoPlayReel && !isHovered ? 'animate-ping opacity-75' : 'opacity-20'
                    }`}
                  />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
                </span>
                <span className="hidden sm:inline">
                  {isHovered
                    ? 'مکث'
                    : isPlaying && autoPlayReel
                    ? 'پخش خودکار'
                    : 'توقف'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (isPlaying && autoPlayReel) {
                      setIsPlaying(false);
                      setAutoPlayReel(false);
                    } else {
                      setIsPlaying(true);
                      setAutoPlayReel(true);
                    }
                  }}
                  className="p-1 hover:text-[#C5A880] text-white/80 transition-colors cursor-pointer"
                  title={
                    isPlaying && autoPlayReel
                      ? 'توقف موقت اسلایدشوی پس‌زمینه'
                      : 'فعال‌سازی پخش خودکار اسلایدشو'
                  }
                >
                  {isPlaying && autoPlayReel ? (
                    <Pause className="w-3 h-3" />
                  ) : (
                    <Play className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Controls Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-end pt-4">
            {/* Neighborhood Dropdown */}
            <div className="lg:col-span-4 space-y-1.5">
              <label
                htmlFor="hero-neighborhood"
                className="block text-xs font-bold text-white/80"
              >
                محله مدنظر در تهران
              </label>
              <div className="relative">
                <select
                  id="hero-neighborhood"
                  value={neighborhood}
                  onChange={(e) => onNeighborhoodChange(e.target.value as NeighborhoodId)}
                  className="w-full h-11 sm:h-12 pr-4 pl-10 rounded-2xl bg-white/10 border border-white/20 text-xs sm:text-sm font-semibold text-white appearance-none focus:outline-none focus:border-[#C5A880] transition-colors cursor-pointer"
                >
                  {NEIGHBORHOOD_OPTIONS.map((item) => (
                    <option key={item.id} value={item.id} className="bg-[#0B1B17] text-white">
                      {item.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#C5A880] pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Budget Range Slider */}
            <div className="lg:col-span-5 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-white/80">
                  بازه بودجه خرید:
                </span>
                <span
                  aria-live="polite"
                  className="text-xs sm:text-sm font-extrabold text-[#C5A880] tabular-nums"
                >
                  {toPersianDigits(budgetMin)} تا {toPersianDigits(budgetMax)} میلیارد تومان
                </span>
              </div>

              <div className="h-11 sm:h-12 rounded-2xl bg-white/10 border border-white/20 px-4 flex flex-col justify-center">
                <div className="relative h-4 flex items-center" dir="ltr" style={{ direction: 'ltr' }}>
                  <div className="w-full h-1.5 rounded-full bg-white/20" />
                  <div
                    className="absolute h-1.5 rounded-full bg-gradient-to-r from-[#C5A880] to-[#10B981]"
                    style={{
                      left: `${minPercent}%`,
                      width: `${Math.max(0, maxPercent - minPercent)}%`,
                    }}
                  />
                  <input
                    type="range"
                    dir="ltr"
                    style={{ direction: 'ltr' }}
                    aria-label="حداقل بودجه به میلیارد تومان"
                    min={BUDGET_FLOOR}
                    max={BUDGET_CEILING}
                    step={5}
                    value={budgetMin}
                    onChange={(e) => handleMinSlider(Number(e.target.value))}
                    className={`arka-range dual-range-input absolute inset-0 w-full ${
                      budgetMin > BUDGET_CEILING - 25 ? 'z-40' : 'z-20'
                    }`}
                  />
                  <input
                    type="range"
                    dir="ltr"
                    style={{ direction: 'ltr' }}
                    aria-label="حداکثر بودجه به میلیارد تومان"
                    min={BUDGET_FLOOR}
                    max={BUDGET_CEILING}
                    step={5}
                    value={budgetMax}
                    onChange={(e) => handleMaxSlider(Number(e.target.value))}
                    className="arka-range dual-range-input absolute inset-0 w-full z-30"
                  />
                </div>
              </div>
            </div>

            {/* Kaveh AI Consultation CTA Button */}
            <div className="lg:col-span-3">
              <button
                type="button"
                onClick={onOpenKaveh}
                className="w-full h-11 sm:h-12 px-3.5 sm:px-4 rounded-2xl gold-cta-btn text-[#0B1B17] text-xs sm:text-[13px] font-extrabold flex items-center justify-center gap-2.5 shadow-lg shadow-[#C5A880]/30 cursor-pointer whitespace-nowrap hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <img
                  src="/kaveh.jpg"
                  alt="مهندس کاوه"
                  className="w-6 h-6 rounded-full object-cover border border-[#0B1B17] shrink-0"
                />
                <span>مشاوره و ممیزی با کاوه</span>
                <Sparkles className="w-3.5 h-3.5 shrink-0 text-[#0B1B17]" />
              </button>
            </div>
          </div>
        </div>

        {/* Full-Screen Bottom Trust Bar & Scroll Prompt */}
        <div className="max-w-5xl mx-auto mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-7 tabular-nums">
            <span className="flex items-center gap-1.5">
              <span className="text-[#C5A880] font-black">{toPersianDigits(450)}+ میلیارد</span>
              <span>املاک ارزیابی‌شده</span>
            </span>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#C5A880] font-black">{toPersianDigits(94)}٪</span>
              <span>دقت تطابق</span>
            </span>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#C5A880] font-black">۳ کارشناس</span>
              <span>مستقل ارزیاب</span>
            </span>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#10B981] font-black">۱۰۰٪</span>
              <span>تضمین اسناد</span>
            </span>
          </div>

          <button
            type="button"
            onClick={scrollToNextSection}
            className="flex items-center gap-1.5 text-[#C5A880] hover:text-white transition-colors cursor-pointer group"
          >
            <span>مشاهده املاک</span>
            <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

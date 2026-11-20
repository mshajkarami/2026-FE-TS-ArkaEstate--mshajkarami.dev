import React, { useEffect, useRef, useState } from 'react';
import { Heart, Menu, Sparkles, X, ArrowUpLeft } from 'lucide-react';
import { toPersianDigits } from '../utils/format';
import { ArkaLogo } from './ArkaLogo';

interface NavbarProps {
  savedCount: number;
  onOpenKaveh: () => void;
  onOpenVip: () => void;
  onOpenSaved: () => void;
}

interface NavItem {
  id: string;
  label: string;
  mobileLabel: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'properties', label: 'املاک لوکس', mobileLabel: 'املاک لوکس برگزیده' },
  { id: 'new-developments', label: 'پروژه‌های معمارانه', mobileLabel: 'پروژه‌های معمارانه در حال ساخت' },
  { id: 'neighborhoods', label: 'اطلس محله‌ها', mobileLabel: 'اطلس محله‌های پایتخت' },
  { id: 'roi-simulator', label: 'شبیه‌ساز ROI', mobileLabel: 'شبیه‌ساز بازگشت سرمایه (ROI)' },
  { id: 'market-intelligence', label: 'نبض بازار', mobileLabel: 'گزارش فصلی نبض بازار مسکن' },
  { id: 'about', label: 'درباره ما', mobileLabel: 'درباره ما و منشور اصالت' },
  { id: 'faq', label: 'سوالات متداول', mobileLabel: 'پرسش‌های متداول' },
  { id: 'concierge', label: 'کنسیرژ VIP', mobileLabel: 'خدمات کنسیرژ و مشتریان VIP' },
];

export const Navbar: React.FC<NavbarProps> = ({
  savedCount,
  onOpenKaveh,
  onOpenVip,
  onOpenSaved,
}) => {
  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [activeSection, setActiveSection] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const sectionIds = [
      'properties',
      'new-developments',
      'neighborhoods',
      'roi-simulator',
      'market-intelligence',
      'about',
      'faq',
      'concierge',
    ];

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      if (currentScrollY > lastScrollY.current + 6) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY.current - 6) {
        setScrollDirection('up');
      }
      lastScrollY.current = currentScrollY;

      // Top of page (Hero section)
      if (currentScrollY < 240) {
        setActiveSection('');
        return;
      }

      // If reached the bottom of page (near concierge/footer)
      if (window.innerHeight + currentScrollY >= document.documentElement.scrollHeight - 60) {
        setActiveSection('concierge');
        return;
      }

      let current = '';

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          // Sync exactly when the section boundary reaches the top of the viewport
          const top = el.offsetTop - 30;
          if (currentScrollY >= top) {
            current = id;
            break;
          }
        }
      }

      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      // Scroll exactly to el.offsetTop so the previous section is 100% finished and scrolled away
      window.scrollTo({
        top: el.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  // Dynamic Theme (Dark vs Light):
  // Dark emerald glass on Hero and dark sections (New Developments, ROI Simulator, Market Intelligence, About Us)
  // Light frosted glass on light sections (Properties, Neighborhoods, FAQ, Concierge)
  const isDarkTheme =
    scrollY < 180 ||
    activeSection === 'new-developments' ||
    activeSection === 'roi-simulator' ||
    activeSection === 'market-intelligence' ||
    activeSection === 'about';

  return (
    <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 max-w-7xl mx-auto px-3 sm:px-4 transition-all duration-300">
      <nav
        aria-label="ناوبری اصلی آرکا استیت"
        className={`rounded-full backdrop-blur-xl h-14 sm:h-16 transition-colors duration-300 ease-out flex items-center justify-between px-3.5 sm:px-5 md:px-6 ${
          isDarkTheme
            ? 'bg-[#0B1B17]/85 text-[#FBFBF8] border border-[#C5A880]/35 shadow-2xl shadow-black/40'
            : 'bg-white/95 text-[#0B1B17] border border-[#C5A880]/25 shadow-2xl shadow-[#0B1B17]/10'
        }`}
      >
        {/* Right (Start in RTL): Architectural Gold Monogram + Brand Wordmark */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 sm:gap-3 whitespace-nowrap shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A880] rounded-full py-1"
        >
          <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0B1B17] border border-[#C5A880]/45 flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-105 shrink-0">
            <ArkaLogo size={20} goldColor="#C5A880" />
          </span>
          <span className={`flex items-center gap-1.5 sm:gap-2 transition-colors ${isDarkTheme ? 'text-[#FBFBF8]' : 'text-[#0B1B17]'}`}>
            <span className="text-sm sm:text-[15px] md:text-base font-extrabold tracking-tight">
              آرکا استیت
            </span>
            <span className="hidden sm:inline text-[#C5A880]/60 font-light" aria-hidden="true">
              |
            </span>
            <span className={`hidden sm:inline font-serif-latin text-sm sm:text-[15px] md:text-base font-semibold tracking-wide ${isDarkTheme ? 'text-[#FBFBF8]/85' : 'text-[#0B1B17]/80'}`}>
              ArkaEstate
            </span>
          </span>
        </a>

        {/* Center: Desktop Navigation Links with ScrollSpy & Safe Dynamic Hover Contrast */}
        <div className="hidden xl:flex items-center gap-3.5 2xl:gap-5 text-[12.5px] 2xl:text-[13px] font-medium transition-colors">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`transition-all duration-200 whitespace-nowrap shrink-0 py-1 cursor-pointer relative ${
                  isActive
                    ? isDarkTheme
                      ? 'text-[#C5A880] font-bold'
                      : 'text-[#9A7D56] font-bold'
                    : isDarkTheme
                      ? 'text-[#FBFBF8]/85 hover:text-[#C5A880]'
                      : 'text-[#0B1B17]/75 hover:text-[#9A7D56]'
                } after:absolute after:bottom-0 after:right-0 after:h-[2px] after:bg-[#C5A880] after:transition-all after:duration-200 ${
                  isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Left (End in RTL): Saved Properties + VIP CTA + Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenSaved}
            aria-label={`املاک نشان‌شده (${toPersianDigits(savedCount)} ملک)`}
            className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A880] flex items-center justify-center ${
              isDarkTheme
                ? 'border-white/20 bg-white/10 hover:bg-white/20 text-[#FBFBF8]'
                : 'border-[#C5A880]/30 bg-white/80 hover:bg-[#F5EFE6] text-[#0B1B17]'
            }`}
          >
            <Heart
              className={`w-4 h-4 sm:w-[18px] sm:h-[18px] transition-colors ${
                savedCount > 0
                  ? 'text-[#C5A880] fill-[#C5A880]/40'
                  : isDarkTheme
                  ? 'text-white/80'
                  : 'text-[#0B1B17]/75'
              }`}
            />
            <span className="absolute -top-1 -left-1 min-w-4.5 h-4.5 sm:min-w-5 sm:h-5 px-1 rounded-full bg-[#C5A880] text-[#0B1B17] text-[10px] sm:text-[11px] font-black tabular-nums flex items-center justify-center border border-[#0B1B17]">
              {toPersianDigits(savedCount)}
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenVip}
            className="hidden md:inline-flex items-center gap-2 px-4 sm:px-5 h-9 sm:h-10 rounded-full gold-cta-btn text-[#0B1B17] text-xs md:text-[13px] font-bold whitespace-nowrap shrink-0 cursor-pointer shadow-md shadow-[#C5A880]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B1B17]"
          >
            <span>مشاوره اختصاصی VIP</span>
            <ArrowUpLeft className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Hamburger Toggle (Visible below xl) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'بستن منو' : 'باز کردن منو'}
            aria-expanded={mobileMenuOpen}
            className={`xl:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
              isDarkTheme
                ? 'border-white/20 bg-white/10 hover:bg-white/20 text-white'
                : 'border-[#C5A880]/30 bg-white/80 hover:bg-[#F5EFE6] text-[#0B1B17]'
            }`}
          >
            {mobileMenuOpen ? <X className="w-4.5 h-4.5 sm:w-5 sm:h-5" /> : <Menu className="w-4.5 h-4.5 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Glassmorphic Drawer (Visible below xl) */}
      <div
        className={`xl:hidden overflow-hidden transition-all duration-300 ease-out origin-top ${
          mobileMenuOpen
            ? 'max-h-[calc(100vh-85px)] opacity-100 mt-2.5 sm:mt-3 translate-y-0'
            : 'max-h-0 opacity-0 mt-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <div
          className={`rounded-3xl backdrop-blur-2xl p-5 flex flex-col gap-2 transition-colors duration-300 shadow-2xl overflow-y-auto max-h-[calc(100vh-115px)] overscroll-contain no-scrollbar ${
            isDarkTheme
              ? 'bg-[#0B1B17]/95 border border-[#C5A880]/35 text-[#FBFBF8] shadow-black/50'
              : 'bg-white/95 border border-[#C5A880]/25 text-[#0B1B17] shadow-[#0B1B17]/10'
          }`}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-right px-4 py-2.5 rounded-2xl text-sm transition-all flex items-center justify-between cursor-pointer ${
                  isActive
                    ? isDarkTheme
                      ? 'bg-[#C5A880]/25 text-[#DFCAAA] font-bold border border-[#C5A880]/50 shadow-sm'
                      : 'bg-[#C5A880]/20 text-[#8A6D46] font-bold border border-[#C5A880]/40 shadow-sm'
                    : isDarkTheme
                      ? 'text-[#FBFBF8]/85 font-semibold hover:bg-white/10'
                      : 'text-[#0B1B17] font-semibold hover:bg-[#F5EFE6]/80'
                }`}
              >
                <span>{item.mobileLabel}</span>
                <ArrowUpLeft
                  className={`w-4 h-4 transition-transform ${
                    isActive ? (isDarkTheme ? 'text-[#DFCAAA] -translate-x-0.5' : 'text-[#8A6D46] -translate-x-0.5') : 'text-[#C5A880]'
                  }`}
                />
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenKaveh();
            }}
            className={`w-full text-right px-4 py-2.5 rounded-2xl text-sm font-semibold transition-colors flex items-center justify-between cursor-pointer ${
              isDarkTheme ? 'text-[#FBFBF8] hover:bg-white/10' : 'text-[#0B1B17] hover:bg-[#F5EFE6]/80'
            }`}
          >
            <span className="flex items-center gap-2">
              <img
                src="/kaveh.jpg"
                alt="مهندس کاوه"
                className="w-5 h-5 rounded-full object-cover border border-[#C5A880]"
              />
              <span>مشاوره با مهندس کاوه</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#C5A880]/25 text-[#DFCAAA] border border-[#C5A880]/40">
                ✦ هوش مصنوعی
              </span>
            </span>
            <ArrowUpLeft className="w-4 h-4 text-[#C5A880]" />
          </button>


          <div className="pt-3 mt-1 border-t border-[#C5A880]/20">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenVip();
              }}
              className="w-full h-12 rounded-full gold-cta-btn text-[#0B1B17] text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>درخواست مشاوره اختصاصی VIP</span>
              <ArrowUpLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

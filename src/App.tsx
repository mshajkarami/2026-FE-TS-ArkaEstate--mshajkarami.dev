import { useEffect, useMemo, useState } from 'react';
import {
  LUXURY_PROPERTIES,
  LuxuryProperty,
  NeighborhoodId,
  PurposeMode,
} from './data/properties';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PropertyShowcase } from './components/PropertyShowcase';
import { PropertyAuditPage } from './components/PropertyAuditPage';
import { NewDevelopmentsSection } from './components/NewDevelopmentsSection';
import { NeighborhoodAtlasSection } from './components/NeighborhoodAtlasSection';
import { RoiSimulator } from './components/RoiSimulator';
import { MarketIntelligenceSection } from './components/MarketIntelligenceSection';
import { ExpertsSection } from './components/ExpertsSection';
import { AboutUsSection } from './components/AboutUsSection';
import { FaqSection } from './components/FaqSection';
import { PrivateConciergeSection } from './components/PrivateConciergeSection';
import { KavehChatModal } from './components/KavehChatModal';
import { VipModal } from './components/VipModal';
import { SavedDrawer } from './components/SavedDrawer';
import { KavehFab } from './components/KavehFab';
import { ArkaLogo } from './components/ArkaLogo';
import { toPersianDigits } from './utils/format';

export default function App() {
  // Hero Search Console State
  const [purpose, setPurpose] = useState<PurposeMode>('family');
  const [neighborhood, setNeighborhood] = useState<NeighborhoodId>('all');
  const [budgetMin, setBudgetMin] = useState(25);
  const [budgetMax, setBudgetMax] = useState(80);
  const [showAllOverride, setShowAllOverride] = useState(false);

  // Interactive Modals & Drawers State
  const [savedIds, setSavedIds] = useState<string[]>([
    'arka-niavaran-01',
    'arka-farmanieh-03',
  ]);
  const [kavehOpen, setKavehOpen] = useState(false);
  const [kavehProperty, setKavehProperty] = useState<LuxuryProperty | null>(null);
  const [vipOpen, setVipOpen] = useState(false);
  const [vipProperty, setVipProperty] = useState<LuxuryProperty | null>(null);
  const [savedDrawerOpen, setSavedDrawerOpen] = useState(false);
  // Dedicated Full-Page Certified Audit Dossier
  const [activeAuditProperty, setActiveAuditProperty] = useState<LuxuryProperty | null>(null);

  // Sync with URL Hash (#audit-arka-niavaran-01) for shareable links & browser back button
  useEffect(() => {
    const handleHashSync = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#audit-')) {
        const propId = hash.replace('#audit-', '');
        const found = LUXURY_PROPERTIES.find((p) => p.id === propId);
        if (found) {
          setActiveAuditProperty(found);
          return;
        }
      }
      setActiveAuditProperty(null);
    };

    handleHashSync();
    window.addEventListener('hashchange', handleHashSync);
    window.addEventListener('popstate', handleHashSync);
    return () => {
      window.removeEventListener('hashchange', handleHashSync);
      window.removeEventListener('popstate', handleHashSync);
    };
  }, []);

  const handleOpenAudit = (property: LuxuryProperty) => {
    setActiveAuditProperty(property);
    window.location.hash = `#audit-${property.id}`;
  };

  const handleCloseAudit = () => {
    setActiveAuditProperty(null);
    if (window.location.hash.startsWith('#audit-')) {
      window.history.pushState(null, '', window.location.pathname);
    }
  };

  const handlePurposeChange = (mode: PurposeMode) => {
    setPurpose(mode);
    setShowAllOverride(false);
    if (mode === 'penthouse' && budgetMax < 120) {
      setBudgetMax(130);
    }
  };

  const handleNeighborhoodChange = (id: NeighborhoodId) => {
    setNeighborhood(id);
    setShowAllOverride(false);
  };

  const handleBudgetChange = (min: number, max: number) => {
    setBudgetMin(min);
    setBudgetMax(max);
    setShowAllOverride(false);
  };

  const handleResetFilters = () => {
    setNeighborhood('all');
    setBudgetMin(15);
    setBudgetMax(150);
    setShowAllOverride(true);
  };

  const filteredProperties = useMemo(() => {
    if (showAllOverride) return LUXURY_PROPERTIES;
    return LUXURY_PROPERTIES.filter((prop) => {
      const matchesPurpose = prop.purpose.includes(purpose);
      const matchesNeighborhood =
        neighborhood === 'all' || prop.neighborhood === neighborhood;
      const matchesBudget =
        prop.priceBillion >= budgetMin && prop.priceBillion <= budgetMax;
      return matchesPurpose && matchesNeighborhood && matchesBudget;
    });
  }, [purpose, neighborhood, budgetMin, budgetMax, showAllOverride]);

  const savedProperties = useMemo(
    () => LUXURY_PROPERTIES.filter((p) => savedIds.includes(p.id)),
    [savedIds]
  );

  const toggleSave = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const openVipForProperty = (property: LuxuryProperty | null) => {
    setVipProperty(property);
    setVipOpen(true);
  };

  const openKavehForProperty = (property: LuxuryProperty | null) => {
    setKavehProperty(property);
    setKavehOpen((prev) => (property ? true : !prev));
  };

  const handleSelectNeighborhood = (id: Exclude<NeighborhoodId, 'all'>) => {
    setNeighborhood(id);
    setShowAllOverride(false);
    const el = document.getElementById('properties');
    if (el) {
      const navOffset = 85;
      const top = el.getBoundingClientRect().top + window.pageYOffset - navOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const scrollToExperts = () => {
    const el = document.getElementById('experts');
    if (el) {
      const navOffset = 85;
      const top = el.getBoundingClientRect().top + window.pageYOffset - navOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  // Dedicated Full-Page Certified Audit View
  if (activeAuditProperty) {
    return (
      <div className="min-h-screen bg-[#FBFBF8] text-[#0B1B17] w-full max-w-full overflow-x-hidden">
        <PropertyAuditPage
          property={activeAuditProperty}
          onBack={handleCloseAudit}
          onBookVip={(prop) => openVipForProperty(prop)}
          onConsultKaveh={(prop) => openKavehForProperty(prop)}
          isSaved={savedIds.includes(activeAuditProperty.id)}
          onToggleSave={toggleSave}
        />

        {/* Interactive AI Wealth & Due-Diligence Advisor (Kaveh) */}
        {kavehOpen && (
          <KavehChatModal
            isOpen={kavehOpen}
            onClose={() => setKavehOpen(false)}
            onSelectPropertyForVip={(prop) => openVipForProperty(prop)}
            initialPropertyContext={kavehProperty}
          />
        )}

        {/* VIP Private Consultation Booking Modal */}
        <VipModal
          isOpen={vipOpen}
          onClose={() => setVipOpen(false)}
          selectedProperty={vipProperty}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBF8] text-[#0B1B17] flex flex-col w-full max-w-full overflow-x-hidden">
      {/* Floating Glass Pill Navbar */}
      <Navbar
        savedCount={savedIds.length}
        onOpenKaveh={() => openKavehForProperty(null)}
        onOpenVip={() => openVipForProperty(null)}
        onOpenSaved={() => setSavedDrawerOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* 4-Layer Dual-Impact Cinematic Hero */}
        <HeroSection
          purpose={purpose}
          onPurposeChange={handlePurposeChange}
          neighborhood={neighborhood}
          onNeighborhoodChange={handleNeighborhoodChange}
          budgetMin={budgetMin}
          budgetMax={budgetMax}
          onBudgetChange={handleBudgetChange}
          onOpenKaveh={() => openKavehForProperty(null)}
          onScrollToExperts={scrollToExperts}
        />

        {/* Live Filtered Luxury Property Showcase */}
        <PropertyShowcase
          properties={filteredProperties}
          allCount={LUXURY_PROPERTIES.length}
          savedIds={savedIds}
          onToggleSave={toggleSave}
          onResetFilters={handleResetFilters}
          onBookVipForProperty={(prop) => openVipForProperty(prop)}
          onConsultKavehForProperty={(prop) => openKavehForProperty(prop)}
          onOpenAudit={handleOpenAudit}
          activePurpose={purpose}
          activeNeighborhood={neighborhood}
          budgetMin={budgetMin}
          budgetMax={budgetMax}
        />

        {/* Exclusive Architectural Projects Under Construction (New Developments) */}
        <NewDevelopmentsSection
          onBookVip={() => {
            setVipProperty(null);
            setVipOpen(true);
          }}
        />

        {/* Neighborhood Lifestyle & Market Atlas */}
        <NeighborhoodAtlasSection
          onSelectNeighborhood={handleSelectNeighborhood}
        />

        {/* Live Interactive ROI & Mortgage Simulator */}
        <RoiSimulator onOpenVip={() => openVipForProperty(null)} />

        {/* Quarterly Market Intelligence & Economic Analysis Report */}
        <MarketIntelligenceSection
          onOpenConsultation={() => {
            setVipProperty(null);
            setVipOpen(true);
          }}
        />

        {/* 3-Expert Independent Audit Board */}
        <ExpertsSection />

        {/* Brand Manifesto & Trust Governance (About Us) */}
        <AboutUsSection
          onOpenConsultation={() => {
            setVipProperty(null);
            setVipOpen(true);
          }}
        />

        {/* Category Accordion & Frequent Inquiries (FAQ) */}
        <FaqSection
          onOpenConsultation={() => {
            setVipProperty(null);
            setVipOpen(true);
          }}
        />

        {/* Private Client Wealth & Concierge Services */}
        <PrivateConciergeSection
          onOpenVipModal={() => {
            setVipProperty(null);
            setVipOpen(true);
          }}
        />
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="bg-[#0B1B17] text-[#FBFBF8] border-t border-[#C5A880]/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#132E27] border border-[#C5A880]/40 flex items-center justify-center shrink-0">
              <ArkaLogo size={18} goldColor="#C5A880" />
            </span>
            <span className="text-sm font-bold">
              آرکا استیت <span className="text-[#C5A880]/60 mx-1">|</span>{' '}
              <span className="font-serif-latin tracking-wide text-[#FBFBF8]/80">
                ArkaEstate
              </span>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-[#FBFBF8]/65">
            <a href="#properties" className="hover:text-[#C5A880] transition-colors">
              املاک لوکس
            </a>
            <a href="#new-developments" className="hover:text-[#C5A880] transition-colors">
              پروژه‌های معمارانه
            </a>
            <a href="#neighborhoods" className="hover:text-[#C5A880] transition-colors">
              اطلس محله‌ها
            </a>
            <button
              type="button"
              onClick={() => openKavehForProperty(null)}
              className="hover:text-[#C5A880] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <img src="./kaveh.jpg" alt="کاوه" className="w-3.5 h-3.5 rounded-full object-cover inline-block" />
              <span>مشاوره با کاوه</span>
            </button>
            <a href="#roi-simulator" className="hover:text-[#C5A880] transition-colors">
              شبیه‌ساز ROI
            </a>
            <a href="#market-intelligence" className="hover:text-[#C5A880] transition-colors">
              نبض بازار
            </a>
            <a href="#about" className="hover:text-[#C5A880] transition-colors">
              درباره ما
            </a>
            <a href="#faq" className="hover:text-[#C5A880] transition-colors">
              سوالات متداول
            </a>
            <a href="#concierge" className="hover:text-[#C5A880] transition-colors">
              کنسیرژ VIP
            </a>
          </div>

          <p className="text-xs text-[#FBFBF8]/45 tabular-nums">
            © {toPersianDigits(1405)} آرکا استیت · ممیزی مهندسی، حقوقی و کارگزاری املاک فاخر پایتخت
          </p>
        </div>
      </footer>

      {/* Interactive AI Wealth & Due-Diligence Advisor (Kaveh) */}
      {kavehOpen && (
        <KavehChatModal
          isOpen={kavehOpen}
          onClose={() => setKavehOpen(false)}
          onSelectPropertyForVip={(prop) => openVipForProperty(prop)}
          initialPropertyContext={kavehProperty}
        />
      )}

      {/* VIP Private Consultation Booking Modal */}
      <VipModal
        isOpen={vipOpen}
        onClose={() => setVipOpen(false)}
        selectedProperty={vipProperty}
      />

      {/* Saved Properties Comparison Drawer */}
      <SavedDrawer
        isOpen={savedDrawerOpen}
        onClose={() => setSavedDrawerOpen(false)}
        savedProperties={savedProperties}
        onRemove={toggleSave}
        onBookVip={(prop) => openVipForProperty(prop)}
      />



      {/* Floating Kaveh AI Consultation FAB Button (hidden while chat modal is active) */}
      {!kavehOpen && <KavehFab onOpenKaveh={() => openKavehForProperty(null)} />}
    </div>
  );
}

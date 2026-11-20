import React, { useState } from 'react';
import {
  ArrowUpLeft,
  Building2,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  RotateCcw,
  Scale,
  ShieldCheck,
  TrendingUp,
  X,
} from 'lucide-react';
import {
  ExpertNote,
  LuxuryProperty,
  NeighborhoodId,
  PurposeMode,
} from '../data/properties';
import { formatBillionToman, toPersianDigits } from '../utils/format';
import { CertifiedAuditModal } from './CertifiedAuditModal';

interface PropertyShowcaseProps {
  properties: LuxuryProperty[];
  allCount: number;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onResetFilters: () => void;
  onBookVipForProperty: (property: LuxuryProperty) => void;
  onConsultKavehForProperty?: (property: LuxuryProperty) => void;
  onOpenAudit?: (property: LuxuryProperty) => void;
  activePurpose: PurposeMode;
  activeNeighborhood: NeighborhoodId;
  budgetMin: number;
  budgetMax: number;
}

const PURPOSE_LABELS: Record<PurposeMode, string> = {
  family: 'سکونت خانوادگی',
  investment: 'سرمایه‌گذاری پربازده',
  penthouse: 'پنت‌هاوس و برج‌باغ',
};

export const PropertyShowcase: React.FC<PropertyShowcaseProps> = ({
  properties,
  allCount,
  savedIds,
  onToggleSave,
  onResetFilters,
  onBookVipForProperty,
  onConsultKavehForProperty,
  onOpenAudit,
  activePurpose,
  activeNeighborhood,
  budgetMin,
  budgetMax,
}) => {
  const [selectedProperty, setSelectedProperty] = useState<LuxuryProperty | null>(null);
  const [activeExpertRole, setActiveExpertRole] = useState<ExpertNote['role']>('architect');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [activePhotoIndex, setActivePhotoIndex] = useState<Record<string, number>>({});

  const openPropertyModal = (property: LuxuryProperty) => {
    setSelectedProperty(property);
    setActiveExpertRole('architect');
  };

  return (
    <section id="properties" className="pt-28 pb-16 md:pt-32 md:pb-24 border-t border-[#C5A880]/15 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <p className="text-xs font-bold tracking-wide text-[#9A7D56]">
              ۰۱. کلکسیون اختصاصی املاک ممیزی‌شده
            </p>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0B1B17] leading-tight"
              style={{ textWrap: 'balance' }}
            >
              پنت‌هاوس‌ها و عمارت‌های دارای شناسنامه رسمی اصالت
            </h2>
            <p className="text-sm sm:text-[15px] text-[#0B1B17]/65 leading-relaxed">
              نمایش {toPersianDigits(properties.length)} ملک تاییدشده از مجموع {toPersianDigits(allCount)} فایل کلکسیونی · فیلتر فعال:{' '}
              <span className="font-semibold text-[#0B1B17]">{PURPOSE_LABELS[activePurpose]}</span>{' '}
              ({toPersianDigits(budgetMin)} تا {toPersianDigits(budgetMax)} میلیارد تومان)
            </p>
          </div>

          {(properties.length < allCount || activeNeighborhood !== 'all') && (
            <button
              type="button"
              onClick={onResetFilters}
              className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#C5A880]/35 bg-white hover:bg-[#F5EFE6] text-xs font-bold text-[#0B1B17] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#9A7D56]" />
              <span>نمایش همه املاک کلکسیونی</span>
            </button>
          )}
        </div>

        {/* Empty Filter State */}
        {properties.length === 0 ? (
          <div className="rounded-3xl bg-white border border-[#C5A880]/25 p-10 md:p-14 text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-[#F5EFE6] text-[#9A7D56] flex items-center justify-center mx-auto">
              <Building2 className="w-7 h-7" />
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-lg font-extrabold text-[#0B1B17]">
                در این بازه بودجه و محله، فایل تاییدشده‌ای ثبت نشده است
              </h3>
              <p className="text-sm text-[#0B1B17]/65 leading-relaxed">
                بازه بودجه را در کنسول بالا گسترش دهید یا کلکسیون کامل املاک کارشناسی‌شده آرکا استیت را مشاهده کنید.
              </p>
            </div>
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full gold-cta-btn text-[#0B1B17] text-sm font-bold cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>بازنشانی فیلترها</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 lg:gap-8">
            {properties.map((property) => {
              const isSaved = savedIds.includes(property.id);
              const gallery =
                property.galleryImages && property.galleryImages.length > 0
                  ? property.galleryImages
                  : [property.imageUrl];
              const photoIdx = activePhotoIndex[property.id] ?? 0;
              const currentSrc = gallery[photoIdx % gallery.length];
              const imgFailed = failedImages[`${property.id}_${photoIdx % gallery.length}`];

              const handlePrevPhoto = (e: React.MouseEvent) => {
                e.stopPropagation();
                setActivePhotoIndex((prev) => ({
                  ...prev,
                  [property.id]: (photoIdx - 1 + gallery.length) % gallery.length,
                }));
              };

              const handleNextPhoto = (e: React.MouseEvent) => {
                e.stopPropagation();
                setActivePhotoIndex((prev) => ({
                  ...prev,
                  [property.id]: (photoIdx + 1) % gallery.length,
                }));
              };

              const handleSelectPhoto = (e: React.MouseEvent, index: number) => {
                e.stopPropagation();
                setActivePhotoIndex((prev) => ({
                  ...prev,
                  [property.id]: index,
                }));
              };

              return (
                <article
                  key={property.id}
                  className="group rounded-3xl bg-white border border-[#C5A880]/22 overflow-hidden shadow-[0_18px_45px_-22px_rgba(11,27,23,0.12)] hover:shadow-[0_26px_60px_-20px_rgba(11,27,23,0.18)] transition-all duration-300 flex flex-col"
                >
                  {/* Image Container with Interactive Multi-Photo Gallery */}
                  <div className="relative aspect-[16/10] bg-[#0B1B17] overflow-hidden select-none">
                    {!imgFailed ? (
                      <img
                        key={currentSrc}
                        src={currentSrc}
                        alt={`${property.title} - شات ${toPersianDigits((photoIdx % gallery.length) + 1)}`}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedImages((prev) => ({
                            ...prev,
                            [`${property.id}_${photoIdx % gallery.length}`]: true,
                          }))
                        }
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#0B1B17] to-[#1A382F] flex flex-col items-center justify-center text-[#FBFBF8]/80 gap-2">
                        <Building2 className="w-8 h-8 text-[#C5A880]" />
                        <span className="text-xs font-semibold">{property.title}</span>
                      </div>
                    )}

                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B1B17]/85 via-transparent to-[#0B1B17]/25"
                    />

                    {/* Top Row: Photo Counter Badge + Bookmark */}
                    <div className="absolute top-4 inset-x-4 flex items-center justify-between gap-2 z-10 pointer-events-none">
                      <div className="flex items-center gap-2 pointer-events-auto">
                        {gallery.length > 1 && (
                          <div className="glass-surface-strong rounded-full px-3 py-1.5 border border-[#C5A880]/35 text-[11px] font-bold text-[#0B1B17] flex items-center gap-1.5 tabular-nums">
                            <Camera className="w-3.5 h-3.5 text-[#9A7D56]" />
                            <span>
                              {toPersianDigits((photoIdx % gallery.length) + 1)} از {toPersianDigits(gallery.length)}
                            </span>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => onToggleSave(property.id)}
                        aria-label={isSaved ? 'حذف از نشان‌شده‌ها' : 'افزودن به نشان‌شده‌ها'}
                        className={`w-10 h-10 rounded-full backdrop-blur-xl border flex items-center justify-center transition-all cursor-pointer pointer-events-auto ${
                          isSaved
                            ? 'bg-[#0B1B17] border-[#C5A880] text-[#C5A880]'
                            : 'bg-white/85 border-white/40 text-[#0B1B17] hover:bg-white'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isSaved ? 'fill-[#C5A880]' : ''}`} />
                      </button>
                    </div>

                    {/* Navigation Arrows for multi-photo exploration */}
                    {gallery.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={handlePrevPhoto}
                          aria-label="عکس قبلی"
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#0B1B17]/75 hover:bg-[#0B1B17] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer shadow-md"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={handleNextPhoto}
                          aria-label="عکس بعدی"
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#0B1B17]/75 hover:bg-[#0B1B17] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer shadow-md"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>

                        {/* Segmented photo indicators */}
                        <div className="absolute bottom-16 inset-x-0 flex justify-center items-center gap-1.5 z-10">
                          {gallery.map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={(e) => handleSelectPhoto(e, i)}
                              className={`transition-all duration-300 rounded-full h-1 cursor-pointer ${
                                i === (photoIdx % gallery.length)
                                  ? 'w-6 bg-[#C5A880]'
                                  : 'w-2 bg-white/40 hover:bg-white/80'
                              }`}
                              aria-label={`عکس ${toPersianDigits(i + 1)}`}
                            />
                          ))}
                        </div>
                      </>
                    )}

                    {/* Bottom Image Metadata Overlay */}
                    <div className="absolute bottom-4 inset-x-4 flex items-end justify-between gap-3 text-white">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-white/85 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                          <span>{property.neighborhoodLabel}</span>
                        </div>
                        <div className="text-lg sm:text-xl font-black mt-1 tabular-nums">
                          {formatBillionToman(property.priceBillion)}
                        </div>
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0B1B17]/80 border border-[#C5A880]/40 text-xs font-bold text-[#F5EFE6] backdrop-blur-md tabular-nums">
                        <span>{toPersianDigits(property.areaSqm)} متر</span>
                        <span className="text-[#C5A880]">·</span>
                        <span>{toPersianDigits(property.bedrooms)} خواب</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-7 flex-1 flex flex-col justify-between gap-5 sm:gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs text-[#0B1B17]/55 font-medium">
                        <span>{toPersianDigits(property.areaSqm)} مترمربع</span>
                        <span aria-hidden="true">·</span>
                        <span>{toPersianDigits(property.bedrooms)} خواب مستر</span>
                        <span aria-hidden="true">·</span>
                        <span>{toPersianDigits(property.parkingSpaces)} پارکینگ سندی</span>
                      </div>

                      <h3 className="text-xl font-extrabold text-[#0B1B17] leading-snug">
                        {property.title}
                      </h3>

                      <p className="text-sm text-[#0B1B17]/65 leading-relaxed">
                        {property.subtitle}
                      </p>

                      {/* Deal Opportunity & ROI Strip */}
                      <div className="pt-3 grid grid-cols-2 gap-3 border-t border-[#C5A880]/15">
                        <div className="text-right">
                          <div className="text-[11px] text-[#0B1B17]/55 font-medium">
                            بازدهی تخمینی ۵ ساله
                          </div>
                          <div className="text-sm font-extrabold text-[#10B981] tabular-nums mt-0.5 flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>{toPersianDigits(property.annualRoiPercent)}٪ سالانه</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-[11px] text-[#0B1B17]/55 font-medium">
                            سنجه فرصت قیمت
                          </div>
                          <div className="text-sm font-extrabold text-[#9A7D56] tabular-nums mt-0.5">
                            {toPersianDigits(property.belowMarketPercent)}٪ زیر قیمت منطقه
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mini Certified Seals Bar */}
                    <div className="pt-2.5 pb-1 flex items-center justify-between gap-1.5 text-[11px] border-t border-[#C5A880]/15">
                      <div className="flex items-center gap-1 text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>سازه: تایید</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-900 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>اسناد: تک‌برگ</span>
                      </div>
                      <div className="flex items-center gap-1 text-cyan-900 font-bold bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                        <span>مالی: A+</span>
                      </div>
                    </div>

                    {/* Card Actions: 2-Tier on Mobile (Hero action + 2 side-by-side buttons), Single-Row on Desktop */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (onOpenAudit) {
                            onOpenAudit(property);
                          } else {
                            openPropertyModal(property);
                          }
                        }}
                        className="w-full sm:flex-1 h-11 px-3.5 rounded-2xl bg-[#0B1B17] hover:bg-[#132E27] text-[#FBFBF8] text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer group shadow-sm active:scale-[0.99]"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#C5A880] group-hover:scale-110 transition-transform" />
                        <span>۳ مُهر ممیزی رسمی</span>
                      </button>

                      <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
                        {onConsultKavehForProperty && (
                          <button
                            type="button"
                            onClick={() => onConsultKavehForProperty(property)}
                            title="ممیزی و حباب‌سنجی این فایل با مهندس کاوه"
                            className="h-10 sm:h-11 px-2 sm:px-3.5 rounded-2xl border border-[#C5A880]/50 bg-white hover:bg-[#F5EFE6] text-[#0B1B17] text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shadow-2xs active:scale-[0.98]"
                          >
                            <img
                              src="/kaveh.jpg"
                              alt="کاوه"
                              className="w-4 h-4 sm:w-5 sm:h-5 rounded-full object-cover border border-[#C5A880]"
                            />
                            <span>تحلیل با کاوه</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onBookVipForProperty(property)}
                          className="h-10 sm:h-11 px-2 sm:px-3.5 rounded-2xl border border-[#C5A880]/30 bg-[#FBFBF8] hover:bg-[#F5EFE6] text-[#0B1B17] text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shadow-2xs active:scale-[0.98]"
                        >
                          <span>بازدید VIP</span>
                          <ArrowUpLeft className="w-3.5 h-3.5 text-[#9A7D56]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Fallback Certified Audit Modal if onOpenAudit is not provided */}
      {!onOpenAudit && selectedProperty && (
        <CertifiedAuditModal
          isOpen={!!selectedProperty}
          onClose={() => setSelectedProperty(null)}
          property={selectedProperty}
          onBookVip={(prop) => onBookVipForProperty(prop)}
        />
      )}
    </section>
  );
};

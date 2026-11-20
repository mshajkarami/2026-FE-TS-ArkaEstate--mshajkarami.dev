import React, { useState } from 'react';
import {
  ArrowUpLeft,
  Building,
  Calendar,
  CheckCircle2,
  Compass,
  Download,
  Eye,
  FileText,
  Layers,
  Sparkles,
  Users,
} from 'lucide-react';
import { NEW_DEVELOPMENTS, NewDevelopmentProject } from '../data/properties';
import { toPersianDigits } from '../utils/format';

interface NewDevelopmentsSectionProps {
  onBookVip: (projectName: string) => void;
}

export const NewDevelopmentsSection: React.FC<NewDevelopmentsSectionProps> = ({
  onBookVip,
}) => {
  const [selectedDev, setSelectedDev] = useState<NewDevelopmentProject | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownloadBrochure = (project: NewDevelopmentProject) => {
    setDownloadSuccess(project.id);
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 3000);
  };

  return (
    <section id="new-developments" className="pt-28 pb-16 md:pt-32 md:pb-24 bg-[#0B1B17] text-[#FBFBF8] relative overflow-hidden">
      {/* Subtle radial emerald luxury aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-1/4 w-[750px] h-[380px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(197,168,128,0.12),transparent_70%)]"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#132E27] border border-[#C5A880]/30 text-xs font-bold text-[#C5A880]">
              <Building className="w-3.5 h-3.5" />
              <span>پروژه‌های معمارانه و پیش‌فروش‌های اختصاصی</span>
            </div>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-black text-[#FBFBF8] leading-tight"
              style={{ textWrap: 'balance' }}
            >
              سرمایه‌گذاری در شاهکارهای در حال ساخت آرشیتکت‌های بنام
            </h2>
            <p className="text-sm sm:text-[15px] text-[#FBFBF8]/70 leading-relaxed">
              تمامی پروژه‌ها دارای پروانه معتبر، ممیزی مهندسی پیوسته و شرایط پرداخت مرحله‌ای متناسب با پیشرفت فیزیکی هستند.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-[#FBFBF8]/50">۳ پروژه با نظارت مستقیم</span>
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          </div>
        </div>

        {/* 3 Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {NEW_DEVELOPMENTS.map((project) => (
            <article
              key={project.id}
              className="group rounded-3xl bg-white/[0.04] border border-[#C5A880]/20 hover:border-[#C5A880]/50 transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#132E27]">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B17] via-transparent to-transparent opacity-80" />

                  {/* Neighborhood Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#0B1B17]/80 backdrop-blur-md border border-[#C5A880]/40 text-xs font-bold text-[#F5EFE6]">
                    {project.neighborhoodLabel}
                  </div>

                  {/* Available Units Badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#10B981]/90 backdrop-blur-md text-[11px] font-extrabold text-[#0B1B17]">
                    تنها {toPersianDigits(project.availableUnits)} واحد آزاد
                  </div>

                  {/* Architect Signature Callout */}
                  <div className="absolute bottom-3 right-4 left-4 flex items-center justify-between text-xs text-[#FBFBF8]/90 bg-[#0B1B17]/75 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
                    <span className="text-[11px] text-[#C5A880] font-bold">طراح معمار:</span>
                    <span className="font-extrabold truncate">{project.architect}</span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-black text-[#FBFBF8] group-hover:text-[#C5A880] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-[#FBFBF8]/65 leading-relaxed line-clamp-2">
                      {project.subtitle}
                    </p>
                  </div>

                  {/* Construction Progress Bar */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-[#FBFBF8]/70">پیشرفت فیزیکی سازه</span>
                      <span className="text-[#10B981] tabular-nums font-black">
                        {toPersianDigits(project.progressPercent)}٪
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        style={{ width: `${project.progressPercent}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-[#C5A880] to-[#10B981] transition-all duration-1000"
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#FBFBF8]/50 pt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#C5A880]" />
                        <span>تحویل: {project.deliveryDate}</span>
                      </span>
                      <span>کل واحدها: {toPersianDigits(project.totalUnits)}</span>
                    </div>
                  </div>

                  {/* Price & Tags */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
                      <span className="text-[#FBFBF8]/60">قیمت هر مترمربع:</span>
                      <span className="font-extrabold text-[#C5A880] tabular-nums">
                        {project.pricePerSqmRange} تومان
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-[#FBFBF8]/75"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Payment Plan Highlight */}
                    <div className="text-[11px] text-[#C5A880]/90 bg-[#C5A880]/10 p-2.5 rounded-xl border border-[#C5A880]/20 leading-relaxed">
                      <span className="font-bold">شرایط پرداخت: </span>
                      <span>{project.paymentPlan}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="p-6 pt-0 grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleDownloadBrochure(project)}
                  className="h-10 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-[#C5A880]/30 text-xs font-bold text-[#FBFBF8] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>
                    {downloadSuccess === project.id ? 'دانلود شد ✓' : 'کاتالوگ و پلان'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onBookVip(project.title)}
                  className="h-10 px-3 rounded-xl gold-cta-btn text-[#0B1B17] text-xs font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm"
                >
                  <span>جلسه با سازنده</span>
                  <ArrowUpLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import {
  ArrowUpLeft,
  Building2,
  Compass,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import {
  AUDIO_GUIDE_TRACKS,
  NEIGHBORHOOD_OPTIONS,
  NeighborhoodId,
} from '../data/properties';
import { toPersianDigits } from '../utils/format';

interface NeighborhoodAtlasSectionProps {
  onSelectNeighborhood: (id: Exclude<NeighborhoodId, 'all'>) => void;
}

const NEIGHBORHOOD_DATA: Record<
  Exclude<NeighborhoodId, 'all'>,
  {
    image: string;
    vibe: string;
    climate: string;
    liquidityDays: number;
    tranquilityScore: number;
  }
> = {
  niavaran: {
    image: '/images/neighborhood_niavaran.jpg',
    vibe: 'برج‌باغ‌های اصیل با کوچه‌باغ‌های دنج و کوهستانی',
    climate: '۳ درجه خنک‌تر از مرکز شهر',
    liquidityDays: 42,
    tranquilityScore: 95,
  },
  elahieh: {
    image: '/images/neighborhood_elahieh.jpg',
    vibe: 'خیابان‌های دیپلمات‌نشین، گالری‌ها و معماری های‌تک',
    climate: 'هوای معتدل کوهپایه با باد شمال‌غربی',
    liquidityDays: 38,
    tranquilityScore: 90,
  },
  farmanieh: {
    image: '/images/neighborhood_farmanieh.jpg',
    vibe: 'تلفیق آرامش بن‌بست‌های سنبل با دسترسی شاهراهی صدر',
    climate: 'پایش مستمر کیفیت هوا و پوشش گیاهی غنی',
    liquidityDays: 34,
    tranquilityScore: 92,
  },
  shahrak: {
    image: '/images/neighborhood_shahrak.jpg',
    vibe: 'شهرسازی مهندسی‌شده، خیابان‌های پهن و بافت ویلایی ناب',
    climate: 'دالان باد غرب تهران و آسمان باز بدون سایه‌انداز',
    liquidityDays: 45,
    tranquilityScore: 96,
  },
};

export const NeighborhoodAtlasSection: React.FC<NeighborhoodAtlasSectionProps> = ({
  onSelectNeighborhood,
}) => {
  return (
    <section id="neighborhoods" className="pt-28 pb-16 md:pt-32 md:pb-24 bg-[#FBFBF8] border-t border-[#C5A880]/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#132E27]/10 border border-[#132E27]/20 text-xs font-bold text-[#132E27]">
              <Compass className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>اطلس تحلیلی و مقایسه میدانی ۴ پهنه اعیان‌نشین تهران</span>
            </div>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0B1B17] leading-tight"
              style={{ textWrap: 'balance' }}
            >
              مقایسه تحلیلی بافت معماری، میانگین قیمت و شاخص آرامش محله‌ها
            </h2>
            <p className="text-sm sm:text-[15px] text-[#0B1B17]/65 leading-relaxed">
              پیش از انتخاب نهایی ملک، تفاوت‌های کلیدی هر منطقه از نظر بافت شهرسازی، میانگین معاملات قطعی، آب‌وهوا و سرعت نقدشوندگی را بررسی کنید.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-[#9A7D56] bg-white px-4 py-2.5 rounded-2xl border border-[#C5A880]/25 shadow-xs">
            <TrendingUp className="w-4 h-4 text-[#C5A880]" />
            <span>پایش پیوسته معاملات رسمی و ارزش‌گذاری منطقه‌ای</span>
          </div>
        </div>

        {/* 4 Neighborhood Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {AUDIO_GUIDE_TRACKS.map((track) => {
            const extra = NEIGHBORHOOD_DATA[track.id];
            const opt = NEIGHBORHOOD_OPTIONS.find((o) => o.id === track.id);
            const neighborhoodShortName = track.neighborhoodLabel.split(' · ')[0];

            return (
              <div
                key={track.id}
                className="group rounded-3xl bg-white border border-[#C5A880]/25 hover:border-[#0B1B17] hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Photo with Overlay */}
                  <div className="relative aspect-[16/11] overflow-hidden bg-[#0B1B17]">
                    <img
                      src={extra.image}
                      alt={track.neighborhoodLabel}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B17] via-transparent to-transparent opacity-85" />

                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#0B1B17]/80 backdrop-blur-md border border-[#C5A880]/40 text-xs font-extrabold text-[#FBFBF8]">
                      {track.neighborhoodLabel}
                    </div>

                    <div className="absolute bottom-3 right-3 left-3 text-white">
                      <div className="text-[11px] text-[#C5A880] font-bold">
                        میانگین قیمت هر متر:
                      </div>
                      <div className="text-xs font-black tabular-nums">
                        {opt?.avgPricePerSqm} تومان
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-4">
                    <p className="text-xs text-[#0B1B17]/70 leading-relaxed font-medium">
                      {extra.vibe}
                    </p>

                    {/* Quick Metrics */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div className="bg-[#FBFBF8] p-2.5 rounded-xl border border-[#C5A880]/15">
                        <div className="text-[#0B1B17]/50">شاخص آرامش</div>
                        <div className="font-extrabold text-[#0B1B17] mt-0.5 tabular-nums">
                          {toPersianDigits(extra.tranquilityScore)} از ۱۰۰
                        </div>
                      </div>
                      <div className="bg-[#FBFBF8] p-2.5 rounded-xl border border-[#C5A880]/15">
                        <div className="text-[#0B1B17]/50">میانگین فروش</div>
                        <div className="font-extrabold text-[#10B981] mt-0.5 tabular-nums">
                          {toPersianDigits(extra.liquidityDays)} روز
                        </div>
                      </div>
                    </div>

                    {/* Highlights Tags */}
                    <div className="space-y-1.5 pt-1">
                      {track.highlights.map((h) => (
                        <div
                          key={h}
                          className="flex items-center gap-1.5 text-[11px] text-[#0B1B17]/80 font-medium"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] shrink-0" />
                          <span className="truncate">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action: Filter Properties by Neighborhood */}
                <div className="p-5 pt-0">
                  <button
                    type="button"
                    onClick={() => onSelectNeighborhood(track.id)}
                    className="w-full h-11 px-4 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs bg-[#0B1B17] hover:bg-[#132E27] text-[#FBFBF8] hover:text-[#C5A880] group"
                  >
                    <span>مشاهده املاک فعال {neighborhoodShortName}</span>
                    <ArrowUpLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

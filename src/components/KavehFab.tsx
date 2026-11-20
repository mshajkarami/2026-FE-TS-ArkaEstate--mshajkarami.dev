import React, { useState } from 'react';
import { X } from 'lucide-react';

interface KavehFabProps {
  onOpenKaveh: () => void;
}

export const KavehFab: React.FC<KavehFabProps> = ({ onOpenKaveh }) => {
  const [dismissedHint, setDismissedHint] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-start gap-2 pointer-events-auto">
      {/* Compact Right-Aligned Tooltip Hint directly above Kaveh */}
      {!dismissedHint && (
        <div className="self-start hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1B17]/95 backdrop-blur-md border border-[#C5A880]/50 text-[#FBFBF8] text-[11px] shadow-xl animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span className="font-bold whitespace-nowrap text-white">
            مهندس کاوه آنلاین است
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setDismissedHint(true);
            }}
            className="w-4 h-4 rounded-full hover:bg-white/20 flex items-center justify-center text-white/60 cursor-pointer mr-0.5"
            title="بستن راهنما"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Floating Kaveh Button - Ultra-Compact on Mobile, Expanded on Tablet/Desktop */}
      <button
        type="button"
        onClick={onOpenKaveh}
        aria-label="گفت‌وگو و مشاوره هوشمند با مهندس کاوه"
        className="group relative h-12 sm:h-14 w-12 sm:w-auto px-1 sm:px-4 rounded-full bg-[#0B1B17] hover:bg-[#132E27] text-[#FBFBF8] border-2 border-[#C5A880]/70 shadow-[0_12px_35px_rgba(11,27,23,0.55)] hover:shadow-[0_16px_45px_rgba(197,168,128,0.45)] transition-all duration-300 flex items-center justify-center sm:justify-start gap-2.5 cursor-pointer hover:scale-[1.03] active:scale-[0.98]"
      >
        {/* Pulsing Ambient Gold Ring */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full border border-[#C5A880]/40 animate-ping opacity-30"
        />

        {/* Kaveh's Official Avatar with Online Badge */}
        <div className="relative shrink-0">
          <img
            src="./kaveh.jpg"
            alt="مهندس کاوه"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-[#C5A880] shadow-md group-hover:scale-105 transition-transform"
          />
          <span
            className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0B1B17] absolute -bottom-0.5 -left-0.5"
            title="آنلاین"
          />
        </div>

        {/* Text Details - Visible on sm and up */}
        <div className="hidden sm:flex text-right items-center gap-2">
          <span className="text-xs sm:text-[13px] font-black tracking-tight text-white whitespace-nowrap">
            مشاوره با مهندس کاوه
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-[#C5A880]/25 text-[#DFCAAA] border border-[#C5A880]/40">
            ✦ AI
          </span>
        </div>
      </button>
    </div>
  );
};

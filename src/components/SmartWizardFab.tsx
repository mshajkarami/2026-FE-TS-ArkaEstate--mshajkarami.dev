import React, { useState } from 'react';
import { Compass, Sparkles, X } from 'lucide-react';

interface SmartWizardFabProps {
  onOpenWizard: () => void;
}

export const SmartWizardFab: React.FC<SmartWizardFabProps> = ({ onOpenWizard }) => {
  const [dismissedHint, setDismissedHint] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2 pointer-events-auto">
      {/* Optional Floating Mini-Tooltip Hint */}
      {!dismissedHint && (
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#0B1B17]/90 backdrop-blur-md border border-[#C5A880]/40 text-[#FBFBF8] text-[11px] shadow-xl animate-bounce">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
          <span>یافتن خانه رویایی با الگوریتم هوشمند</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setDismissedHint(true);
            }}
            className="w-4 h-4 rounded-full hover:bg-white/20 flex items-center justify-center text-white/60 cursor-pointer ml-1"
            title="بستن راهنما"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* The Floating FAB Button */}
      <button
        type="button"
        onClick={onOpenWizard}
        aria-label="باز کردن ویزارد تطبیق هوشمند ملک"
        className="group relative h-13 sm:h-14 px-4 sm:px-5 rounded-full bg-[#0B1B17] hover:bg-[#132E27] text-[#FBFBF8] border border-[#C5A880]/50 shadow-[0_14px_38px_rgba(11,27,23,0.38)] hover:shadow-[0_16px_45px_rgba(197,168,128,0.45)] transition-all duration-300 flex items-center gap-3 cursor-pointer hover:scale-[1.03] active:scale-[0.98]"
      >
        {/* Pulsing Ambient Gold Ring */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full border border-[#C5A880]/30 animate-ping opacity-35"
        />

        {/* Icon with Gold Badge */}
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-[#C5A880] to-[#DFCAAA] text-[#0B1B17] flex items-center justify-center font-bold shrink-0 shadow-sm group-hover:rotate-12 transition-transform duration-300">
          <Sparkles className="w-4 h-4 text-[#0B1B17]" />
        </div>

        {/* Label and Badge */}
        <div className="text-right flex items-center gap-2">
          <span className="text-xs sm:text-[13px] font-black tracking-tight text-white whitespace-nowrap">
            ویزارد تطبیق هوشمند
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]/40">
            ✦ AI
          </span>
        </div>
      </button>
    </div>
  );
};

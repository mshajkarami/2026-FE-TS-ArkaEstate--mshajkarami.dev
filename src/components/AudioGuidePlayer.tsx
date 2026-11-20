import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Headphones,
  Pause,
  Play,
  Volume2,
  X,
} from 'lucide-react';
import { AUDIO_GUIDE_TRACKS, NeighborhoodId } from '../data/properties';
import { formatTimeMMSS } from '../utils/format';

interface AudioGuidePlayerProps {
  isOpen: boolean;
  activeTrackId: Exclude<NeighborhoodId, 'all'>;
  onSelectTrack: (id: Exclude<NeighborhoodId, 'all'>) => void;
  onClose: () => void;
}

export const AudioGuidePlayer: React.FC<AudioGuidePlayerProps> = ({
  isOpen,
  activeTrackId,
  onSelectTrack,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [expanded, setExpanded] = useState(true);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscRefs = useRef<OscillatorNode[]>([]);

  const track =
    AUDIO_GUIDE_TRACKS.find((t) => t.id === activeTrackId) ?? AUDIO_GUIDE_TRACKS[0];

  const stopAmbientTone = () => {
    oscRefs.current.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // Ignore already stopped oscillators
      }
    });
    oscRefs.current = [];
    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
      gainNodeRef.current = null;
    }
  };

  const startAmbientTone = (baseFreq: number) => {
    stopAmbientTone();
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        void ctx.resume();
      }
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.025, ctx.currentTime + 0.6);
      gain.connect(ctx.destination);
      gainNodeRef.current = gain;

      // Soft warm harmonic pad (root + perfect fifth)
      const freqs = [baseFreq, baseFreq * 1.498];
      oscRefs.current = freqs.map((f) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime);
        osc.connect(gain);
        osc.start();
        return osc;
      });
    } catch {
      // Gracefully continue timer animation if audio context is unavailable
    }
  };

  useEffect(() => {
    setElapsed(0);
    if (isPlaying) {
      startAmbientTone(track.frequencyBase);
    }
    return () => {
      if (!isOpen) stopAmbientTone();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTrackId, isOpen]);

  useEffect(() => {
    if (!isPlaying || !isOpen) {
      stopAmbientTone();
      return;
    }
    startAmbientTone(track.frequencyBase);

    const timer = window.setInterval(() => {
      setElapsed((prev) => {
        if (prev >= track.durationSeconds) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
      stopAmbientTone();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, isOpen]);

  useEffect(() => {
    return () => {
      stopAmbientTone();
      if (audioCtxRef.current) {
        void audioCtxRef.current.close();
      }
    };
  }, []);

  if (!isOpen) return null;

  const progressPct = Math.min(100, (elapsed / track.durationSeconds) * 100);

  return (
    <aside
      aria-label="پلیر تور صوتی محله‌ها"
      className="fixed bottom-5 left-5 z-50 w-[calc(100vw-2rem)] sm:w-[390px] rounded-3xl glass-surface-strong border border-[#C5A880]/35 shadow-[0_24px_60px_-14px_rgba(11,27,23,0.28)] overflow-hidden"
    >
      {/* Compact Player Header */}
      <div className="bg-[#0B1B17] text-[#FBFBF8] px-4 py-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-full bg-[#C5A880]/20 border border-[#C5A880]/40 text-[#C5A880] flex items-center justify-center shrink-0">
            <Headphones className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-extrabold truncate">{track.title}</div>
            <div className="text-[11px] text-white/60 truncate">{track.narrator}</div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            aria-label={expanded ? 'جمع کردن متن روایت' : 'باز کردن متن روایت'}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
          >
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              onClose();
            }}
            aria-label="بستن پلیر صوتی"
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Controls & Progress */}
      <div className="p-4 space-y-3.5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            aria-label={isPlaying ? 'توقف پخش' : 'شروع پخش'}
            className="w-11 h-11 rounded-full gold-cta-btn text-[#0B1B17] flex items-center justify-center shrink-0 cursor-pointer shadow-md"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current mr-0.5" />}
          </button>

          <div className="flex-1 space-y-1.5">
            <div
              className="h-1.5 rounded-full bg-[#E8E2D5] overflow-hidden cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const ratio = Math.max(0, Math.min(1, (rect.right - e.clientX) / rect.width));
                setElapsed(Math.round(ratio * track.durationSeconds));
              }}
            >
              <div
                className="h-full rounded-full bg-gradient-to-l from-[#C5A880] to-[#0B1B17] transition-all duration-200"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#0B1B17]/55 tabular-nums">
              <span>{formatTimeMMSS(elapsed)}</span>
              <span className="inline-flex items-center gap-1 text-[#9A7D56]">
                <Volume2 className="w-3 h-3" />
                <span>{isPlaying ? 'در حال پخش فضای صوتی محله' : 'آماده پخش'}</span>
              </span>
              <span>{formatTimeMMSS(track.durationSeconds)}</span>
            </div>
          </div>
        </div>

        {/* Neighborhood Switcher Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {AUDIO_GUIDE_TRACKS.map((item) => {
            const active = item.id === activeTrackId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTrack(item.id)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#0B1B17] text-[#FBFBF8]'
                    : 'bg-[#F5EFE6] text-[#0B1B17]/75 hover:bg-[#EAE0CE]'
                }`}
              >
                {item.neighborhoodLabel}
              </button>
            );
          })}
        </div>

        {/* Expandable Transcript & Highlights */}
        {expanded && (
          <div className="pt-2 border-t border-[#C5A880]/20 space-y-2.5">
            <p className="text-xs leading-[1.85] text-[#0B1B17]/75">
              {track.transcript}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-[#9A7D56]">
              {track.highlights.map((h, idx) => (
                <React.Fragment key={h}>
                  <span>{h}</span>
                  {idx < track.highlights.length - 1 && <span aria-hidden="true">·</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

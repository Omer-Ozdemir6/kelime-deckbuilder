import React from 'react';
import { motion } from 'framer-motion';
import { JokerCardIllustration } from './JokerCardIllustration';

/**
 * BalatroJokerCard
 * Renders an authentic Balatro-style Playing Card Joker with custom illustrations,
 * holographic foil shimmers, rarity badges, and stats description.
 */
export function BalatroJokerCard({
  joker,
  isSelected = false,
  isDisabled = false,
  isSold = false,
  onClick,
  showCost = true,
  showDesc = true,
  className = ''
}) {
  if (!joker) return null;

  const id = joker.id || '';
  const name = joker.name || 'Joker Kartı';
  const desc = joker.desc || 'Pasif Joker Etkisi';
  const cost = joker.cost || 50;
  const rarity = joker.rarity || 'yaygin';
  const bgGradient = joker.bgGradient || 'from-purple-900 via-slate-900 to-indigo-950';

  const RARITY_THEMES = {
    yaygin: {
      border: 'border-slate-400/80 shadow-slate-500/20',
      badgeBg: 'bg-slate-800 text-slate-200 border-slate-600',
      label: 'YAYGIN',
      glow: 'shadow-[0_0_15px_rgba(148,163,184,0.3)]'
    },
    nadir: {
      border: 'border-cyan-400/90 shadow-cyan-500/40',
      badgeBg: 'bg-cyan-950 text-cyan-200 border-cyan-500/60',
      label: 'NADİR',
      glow: 'shadow-[0_0_20px_rgba(34,211,238,0.4)]'
    },
    efsanevi: {
      border: 'border-amber-400/90 shadow-amber-500/50',
      badgeBg: 'bg-amber-950 text-amber-300 border-amber-500/60',
      label: 'EFSANEVİ',
      glow: 'shadow-[0_0_25px_rgba(245,158,11,0.5)]'
    },
    efsane_otesi: {
      border: 'border-purple-400/90 shadow-purple-500/60 ring-2 ring-purple-400/40',
      badgeBg: 'bg-purple-950 text-purple-200 border-purple-400',
      label: 'SPECTRAL',
      glow: 'shadow-[0_0_30px_rgba(168,85,247,0.6)] animate-pulse'
    }
  };

  const theme = RARITY_THEMES[rarity] || RARITY_THEMES.nadir;

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Floating Cost Tag Badge */}
      {showCost && !isSold && (
        <span className="mb-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-md border border-yellow-200 font-mono z-20">
          ${cost}
        </span>
      )}

      <motion.button
        whileHover={isDisabled || isSold ? {} : { scale: 1.06, y: -4 }}
        whileTap={isDisabled || isSold ? {} : { scale: 0.96 }}
        onClick={onClick}
        disabled={isDisabled || isSold}
        className={`w-28 sm:w-32 h-40 sm:h-44 rounded-2xl border-2 p-2 flex flex-col items-center justify-between relative cursor-pointer overflow-hidden transition-all ${theme.border} ${theme.glow} ${
          isSold
            ? 'opacity-40 bg-slate-950 border-slate-800'
            : `bg-gradient-to-b ${bgGradient}`
        } ${isSelected ? 'ring-4 ring-amber-300 scale-105 z-30' : ''}`}
      >
        {/* Balatro Metallic Holographic Shimmer Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent opacity-70 pointer-events-none" />

        {isSold ? (
          <span className="text-xs font-black text-slate-500 my-auto">SATILDI</span>
        ) : (
          <>
            {/* Top Card Corner Banner */}
            <div className="w-full flex items-center justify-between z-10">
              <span className="text-[10px] font-black text-amber-300 font-cinzel tracking-wider">J</span>
              <span className={`px-1.5 py-0.2 rounded text-[8px] font-black border uppercase tracking-wider ${theme.badgeBg}`}>
                {theme.label}
              </span>
              <span className="text-[10px] font-black text-amber-300 font-cinzel tracking-wider">J</span>
            </div>

            {/* Center Card Illustration */}
            <div className="my-auto flex flex-col items-center gap-1 z-10 py-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-black/60 border border-white/20 flex items-center justify-center p-1 shadow-inner backdrop-blur-sm">
                <JokerCardIllustration cardId={id} type="joker" className="w-9 h-9 sm:w-11 sm:h-11 drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-black text-white text-center line-clamp-1 font-cinzel drop-shadow-md">
                {name}
              </span>
            </div>

            {/* Bottom Card Description Box (Optional) */}
            {showDesc && (
              <div className="w-full bg-slate-950/90 rounded-xl p-1 border border-white/10 text-[8px] sm:text-[9px] font-bold text-slate-200 text-center leading-tight z-10 line-clamp-2 shadow-inner">
                {desc}
              </div>
            )}
          </>
        )}
      </motion.button>
    </div>
  );
}

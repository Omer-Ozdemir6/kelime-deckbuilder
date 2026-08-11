import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRarityDetails } from '../game/cardData';

export function HandCardRack({ handCards, onSelectCard }) {
  return (
    <div className="w-full bg-slate-950/95 border-t border-slate-800/90 p-2.5 pt-2 flex flex-col gap-1.5 shadow-2xl backdrop-blur-md">
      {/* Hand header label */}
      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 px-1">
        <span>Eldeki Harfler ({handCards.length})</span>
        <span className="text-slate-500">Seçmek için dokun</span>
      </div>

      {/* Hand Cards Container: Fits all cards dynamically in one row without scrollbars */}
      <div className="w-full flex items-center justify-center gap-1.5 overflow-hidden py-1 px-0.5 min-h-[84px]">
        <AnimatePresence mode="popLayout">
          {handCards.length === 0 ? (
            <div className="text-xs text-slate-500 font-medium py-4">El boş! Yenileme yapın.</div>
          ) : (
            handCards.map((card) => {
              const rarity = getRarityDetails(card.rarity);
              return (
                <motion.button
                  key={card.id}
                  layout
                  initial={{ scale: 0.8, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: 20 }}
                  whileHover={{ y: -4, scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onSelectCard(card)}
                  className={`flex-1 min-w-[34px] max-w-[46px] h-16 sm:h-18 rounded-xl flex flex-col items-center justify-between p-1 shadow-md border-2 transition-all relative cursor-pointer select-none ${
                    card.isSpecial
                      ? 'bg-gradient-to-b from-purple-900 via-indigo-900 to-slate-950 border-purple-400 text-purple-200 shadow-purple-900/50'
                      : card.rarity === 'cok_nadir'
                      ? 'bg-gradient-to-b from-amber-900 via-amber-950 to-slate-950 border-amber-400 text-amber-300 shadow-amber-900/50'
                      : card.rarity === 'nadir'
                      ? 'bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 border-indigo-400 text-indigo-200 shadow-indigo-900/40'
                      : 'bg-gradient-to-b from-slate-800 to-slate-900 border-slate-600 text-slate-100 shadow-slate-950/60'
                  }`}
                >
                  {/* Upgrade level badge */}
                  {card.upgradeLevel > 0 && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] flex items-center justify-center shadow-md">
                      +{card.upgradeLevel}
                    </div>
                  )}

                  {/* Top Label */}
                  <span className="text-[8px] sm:text-[9px] font-bold opacity-75 tracking-wider uppercase truncate w-full text-center">
                    {card.isSpecial ? card.specialType : 'HARF'}
                  </span>

                  {/* Main Letter Glyph */}
                  <span className="text-lg sm:text-xl font-extrabold tracking-tight drop-shadow-sm">
                    {card.letter}
                  </span>

                  {/* Points Badge */}
                  <div className="w-full flex items-center justify-center bg-slate-950/70 rounded py-0.5 border border-slate-800/80">
                    <span className="text-[9px] sm:text-[10px] font-black text-amber-400">
                      {card.isSpecial ? '★' : `${card.points}p`}
                    </span>
                  </div>
                </motion.button>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

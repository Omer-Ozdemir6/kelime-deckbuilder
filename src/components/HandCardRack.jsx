import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRarityDetails } from '../game/cardData';

export function HandCardRack({ handCards, onSelectCard }) {
  return (
    <div className="w-full bg-slate-950/95 border-t border-slate-800/90 p-2.5 pt-2 flex flex-col gap-1.5 shadow-2xl backdrop-blur-xl relative">
      {/* Hand header label */}
      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-1">
        <span className="flex items-center gap-1">
          <span className="text-amber-400">🎴</span> Eldeki Harfler ({handCards.length}/9)
        </span>
        <span className="text-slate-500 text-[10px]">Seçmek için dokun</span>
      </div>

      {/* Hand Cards Container: Fits all cards dynamically in one row without scrollbars */}
      <div className="w-full flex items-center justify-center gap-1.5 overflow-hidden py-1 px-0.5 min-h-[86px]">
        <AnimatePresence mode="popLayout">
          {handCards.length === 0 ? (
            <div className="text-xs text-slate-500 font-semibold py-4 italic">El boş! Kart Değiştir butonuna basın.</div>
          ) : (
            handCards.map((card) => {
              const rarity = getRarityDetails(card.rarity);
              const tileClass = card.isSpecial
                ? 'tile-bevel-purple text-purple-200'
                : card.rarity === 'cok_nadir'
                ? 'tile-bevel-amber text-amber-200'
                : card.rarity === 'nadir'
                ? 'tile-bevel-cyan text-cyan-200'
                : 'tile-bevel-slate text-slate-100';

              return (
                <motion.button
                  key={card.id}
                  layout
                  initial={{ scale: 0.8, opacity: 0, y: 25 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: 25 }}
                  whileHover={{ y: -6, scale: 1.06 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => onSelectCard(card)}
                  className={`flex-1 min-w-[34px] max-w-[46px] h-17 sm:h-19 rounded-2xl flex flex-col items-center justify-between p-1 transition-all relative cursor-pointer select-none ${tileClass}`}
                >
                  {/* Upgrade level badge */}
                  {card.upgradeLevel > 0 && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] flex items-center justify-center shadow-lg border border-amber-200 z-10 animate-pulse">
                      +{card.upgradeLevel}
                    </div>
                  )}

                  {/* Top Label */}
                  <span className="text-[8px] sm:text-[9px] font-black opacity-75 tracking-wider uppercase truncate w-full text-center">
                    {card.isSpecial ? card.specialType : 'HARF'}
                  </span>

                  {/* Main Letter Glyph */}
                  <span className="text-lg sm:text-xl font-extrabold tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {card.letter}
                  </span>

                  {/* Points Badge */}
                  <div className="w-full flex items-center justify-center bg-slate-950/80 rounded-lg py-0.5 border border-slate-800/80">
                    <span className="text-[9px] sm:text-[10px] font-black text-amber-300">
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

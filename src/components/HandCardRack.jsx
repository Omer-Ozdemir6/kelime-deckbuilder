import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { getRarityDetails, INFUSED_TYPES } from '../game/cardData';

export function HandCardRack({
  handCards = [],
  bankCards = [],
  onSelectCard,
  onSelectBankCard,
  onBankCard,
  onUnbankCard
}) {
  const maxBankSlots = 2;
  const bankSlots = [0, 1];

  return (
    <div className="w-full bg-slate-950/95 border-t border-slate-800/90 p-2.5 pt-2 flex flex-col gap-1.5 shadow-2xl backdrop-blur-xl relative">
      {/* Rack Header: Hand Label + Harf Bankasi Header */}
      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-1">
        <span className="flex items-center gap-1">
          <span className="text-amber-400">🎴</span> Eldeki Harfler ({handCards.length}/9)
        </span>

        {/* Bank Indicator Header */}
        <div className="flex items-center gap-1.5 text-emerald-400 font-extrabold text-[10px] bg-slate-900/90 px-2 py-0.5 rounded-full border border-emerald-500/30">
          <Landmark size={11} className="text-emerald-400 animate-pulse" />
          <span>Harf Bankası ({bankCards.length}/{maxBankSlots})</span>
        </div>
      </div>

      {/* Bank Slots Row */}
      <div className="w-full flex items-center justify-between gap-2 px-1 py-1 bg-emerald-950/20 border border-emerald-900/40 rounded-xl">
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-300/80 font-bold shrink-0">
          <Landmark size={13} className="text-emerald-400" />
          <span className="hidden sm:inline">Bankadaki Harfler:</span>
        </div>

        <div className="flex items-center gap-2">
          {bankSlots.map((index) => {
            const card = bankCards[index];
            if (card) {
              return (
                <motion.div
                  key={`bank_slot_${card.id}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-1 bg-slate-900 border border-amber-500/80 rounded-xl px-2 py-1 shadow-lg relative group"
                >
                  <button
                    onClick={() => onSelectBankCard && onSelectBankCard(card)}
                    className="flex items-center gap-1 text-amber-300 font-black text-xs hover:text-amber-200 cursor-pointer"
                    title={`"${card.letter}" kelimede kullan (Bankacı Bonusu)`}
                  >
                    <span>{card.letter}</span>
                    <span className="text-[9px] text-amber-400">({card.points}p)</span>
                  </button>

                  <button
                    onClick={() => onUnbankCard && onUnbankCard(card)}
                    className="p-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    title="Ele geri al"
                  >
                    <ArrowDownLeft size={11} />
                  </button>
                </motion.div>
              );
            }
            return (
              <div
                key={`empty_bank_${index}`}
                className="px-3 py-1 rounded-xl border border-dashed border-emerald-700/50 bg-slate-950/40 text-[10px] font-semibold text-emerald-600/70 italic flex items-center gap-1"
              >
                <span>Slot #{index + 1} Boş</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hand Cards Container: Fits all cards dynamically in one row without scrollbars */}
      <div className="w-full flex items-center justify-center gap-1.5 overflow-hidden py-1 px-0.5 min-h-[86px]">
        <AnimatePresence mode="popLayout">
          {handCards.length === 0 ? (
            <div className="text-xs text-slate-500 font-semibold py-4 italic">El boş! Harf çekin veya bankadan kullanın.</div>
          ) : (
            handCards.map((card) => {
              const rarity = getRarityDetails(card.rarity);

              let tileClass = card.isSpecial
                ? 'tile-bevel-purple text-purple-200'
                : card.rarity === 'cok_nadir'
                ? 'tile-bevel-amber text-amber-200'
                : card.rarity === 'nadir'
                ? 'tile-bevel-cyan text-cyan-200'
                : 'tile-bevel-slate text-slate-100';

              if (card.seal === 'POLYCHROME') tileClass = 'rainbow-shimmer-card text-pink-100 font-bold';
              else if (card.seal === 'FOIL') tileClass = 'foil-shine-overlay text-amber-950 font-bold';
              else if (card.seal === 'RED_SEAL') tileClass = 'red-seal-fire tile-bevel-amber text-rose-200';

              const canBank = bankCards.length < maxBankSlots && !card.isSpecial;

              return (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ scale: 0.8, opacity: 0, y: 25 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: 25 }}
                  className="flex-1 min-w-[36px] max-w-[48px] h-18 sm:h-20 flex flex-col items-center justify-between relative select-none group"
                >
                  {/* Bank card button overlay */}
                  {canBank && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onBankCard && onBankCard(card);
                      }}
                      className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[8px] flex items-center justify-center shadow-md z-20 transition active:scale-90"
                      title="Harf Bankasına Kaldır"
                    >
                      <Landmark size={9} />
                    </button>
                  )}

                  {/* Seal Badge (🪙 Foil, 🔮 Holographic, 🌈 Polychrome, 🔴 Red Seal, 💚 Emerald, ⚡ Lightning, ❄️ Freeze, 👑 Crown) */}
                  {card.seal && (
                    <div className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-slate-950 text-[10px] flex items-center justify-center shadow-lg border border-amber-400 z-20">
                      {card.seal === 'FOIL' && '🪙'}
                      {card.seal === 'HOLOGRAPHIC' && '🔮'}
                      {card.seal === 'POLYCHROME' && '🌈'}
                      {card.seal === 'RED_SEAL' && '🔴'}
                      {card.seal === 'EMERALD_SEAL' && '💚'}
                      {card.seal === 'LIGHTNING_SEAL' && '⚡'}
                      {card.seal === 'FREEZE_SEAL' && '❄️'}
                      {card.seal === 'CROWN_SEAL' && '👑'}
                    </div>
                  )}

                  {/* Infused Tile Badge */}
                  {card.infusedType && INFUSED_TYPES[card.infusedType] && (
                    <div
                      className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-slate-950 text-[10px] flex items-center justify-center shadow-lg border border-amber-400 z-10"
                      title={INFUSED_TYPES[card.infusedType].desc}
                    >
                      {INFUSED_TYPES[card.infusedType].icon}
                    </div>
                  )}

                  {/* Upgrade level badge */}
                  {card.upgradeLevel > 0 && !card.seal && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] flex items-center justify-center shadow-lg border border-amber-200 z-10 animate-pulse">
                      +{card.upgradeLevel}
                    </div>
                  )}

                  <motion.button
                    whileHover={{ y: -4, scale: 1.05 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => onSelectCard(card)}
                    className={`w-full h-full rounded-2xl flex flex-col items-center justify-between p-1 transition-all cursor-pointer ${tileClass}`}
                  >
                    {/* Top Label (Only for Special Cards) */}
                    {card.isSpecial && (
                      <span className="text-[8px] sm:text-[9px] font-black opacity-85 tracking-wider uppercase truncate w-full text-center">
                        {card.specialType}
                      </span>
                    )}

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
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

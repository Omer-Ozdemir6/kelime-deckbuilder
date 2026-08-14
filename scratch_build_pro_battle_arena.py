import os

web_dir = r"c:\Users\omr_k\Projects\kelime-deckbuilder\src\components"
rack_path = os.path.join(web_dir, "HandCardRack.jsx")
play_path = os.path.join(web_dir, "WordPlayArea.jsx")

# -------------------------------------------------------------
# 1. Upgrade HandCardRack.jsx to Balatro-Style Glossy Playing Cards
# -------------------------------------------------------------
rack_jsx = '''import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, ArrowDownLeft, Sparkles, X, Check } from 'lucide-react';
import { getRarityDetails, INFUSED_TYPES, SEAL_DEFINITIONS } from '../game/cardData';
import { soundEngine } from '../game/audioEngine';

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

  const [hoveredCard, setHoveredCard] = useState(null);
  const [detailModalCard, setDetailModalCard] = useState(null);

  const isSpecialOrSealedTile = (card) => {
    return !!(card.isSpecial || card.type === 'joker' || card.seal || card.infusedType);
  };

  const handleTileClick = (card) => {
    soundEngine.playTap();
    if (isSpecialOrSealedTile(card)) {
      setDetailModalCard(card);
    } else {
      onSelectCard(card);
    }
  };

  const handleConfirmPlaceOnBoard = (card) => {
    soundEngine.playTileClick();
    setDetailModalCard(null);
    onSelectCard(card);
  };

  return (
    <div className="w-full bg-slate-950/80 border-t-2 border-slate-800/90 p-2.5 pt-2 flex flex-col gap-2 shadow-2xl backdrop-blur-xl relative z-20">
      {/* RACK HEADER & HARF BANKASI */}
      <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 px-1">
        <span className="flex items-center gap-1.5 font-black text-amber-300">
          <span className="text-base">🎴</span> Eldeki Harfler ({handCards.length}/9)
        </span>

        {/* Bank Indicator Badge */}
        <div className="flex items-center gap-1.5 text-emerald-300 font-black text-[10px] bg-emerald-950/90 px-3 py-1 rounded-full border border-emerald-500/50 shadow-md">
          <Landmark size={12} className="text-emerald-400 animate-pulse" />
          <span>Harf Bankası ({bankCards.length}/{maxBankSlots})</span>
        </div>
      </div>

      {/* HARF BANKASI ROW */}
      <div className="w-full flex items-center justify-between gap-2 px-2 py-1.5 bg-emerald-950/30 border border-emerald-500/40 rounded-2xl shadow-inner">
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-300 font-extrabold shrink-0">
          <Landmark size={14} className="text-emerald-400" />
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
                  className="flex items-center gap-1.5 bg-gradient-to-b from-amber-400 to-yellow-500 text-slate-950 rounded-xl px-2.5 py-1 shadow-lg border border-yellow-200"
                >
                  <button
                    onClick={() => onSelectBankCard && onSelectBankCard(card)}
                    className="flex items-center gap-1 font-black text-xs cursor-pointer"
                    title={`"${card.letter}" kelimede kullan (Bankacı Bonusu)`}
                  >
                    <span className="text-sm font-black font-cinzel">{card.letter}</span>
                    <span className="text-[9px] font-extrabold bg-slate-950 text-amber-300 px-1 rounded">+{card.points}p</span>
                  </button>

                  <button
                    onClick={() => onUnbankCard && onUnbankCard(card)}
                    className="p-0.5 rounded-md bg-slate-950/80 hover:bg-slate-950 text-amber-300 transition cursor-pointer"
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
                className="px-3 py-1 rounded-xl border border-dashed border-emerald-700/60 bg-slate-950/60 text-[10px] font-bold text-emerald-500/80 italic flex items-center gap-1"
              >
                <span>Slot #{index + 1} Boş</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* HAND CARDS FLEX RACK WITH BALATRO 3D LIFT ANIMATION */}
      <div className="w-full flex items-center justify-center gap-1.5 sm:gap-2.5 max-w-full overflow-x-auto py-2 px-1 min-h-[95px] relative">
        <AnimatePresence>
          {handCards.length === 0 ? (
            <div className="text-xs text-slate-500 font-semibold py-4 italic">El boş! Harf çekin veya bankadan kullanın.</div>
          ) : (
            handCards.map((card, idx) => {
              const isSpecialOrSealed = isSpecialOrSealedTile(card);

              // Distinct Balatro Card Styling per Rarity & Seal
              let cardBg = 'bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-slate-700 text-slate-100 shadow-slate-900/50';
              if (card.isSpecial || card.type === 'joker') {
                cardBg = 'bg-gradient-to-b from-purple-800 via-indigo-900 to-slate-950 border-2 border-purple-400 text-purple-100 shadow-[0_0_20px_rgba(168,85,247,0.5)]';
              } else if (card.rarity === 'cok_nadir') {
                cardBg = 'bg-gradient-to-b from-amber-600 via-yellow-700 to-amber-950 border-2 border-amber-300 text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.5)]';
              } else if (card.rarity === 'nadir') {
                cardBg = 'bg-gradient-to-b from-cyan-600 via-blue-700 to-slate-950 border-2 border-cyan-300 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.5)]';
              }

              if (card.seal === 'POLYCHROME') cardBg = 'bg-gradient-to-b from-pink-500 via-purple-600 to-cyan-500 border-2 border-pink-300 text-white shadow-[0_0_25px_rgba(244,114,182,0.8)] animate-pulse';
              else if (card.seal === 'FOIL') cardBg = 'bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-600 border-2 border-yellow-200 text-slate-950 font-black shadow-[0_0_25px_rgba(251,191,36,0.8)]';
              else if (card.seal === 'RED_SEAL') cardBg = 'bg-gradient-to-b from-rose-600 via-red-700 to-slate-950 border-2 border-rose-400 text-rose-100 shadow-[0_0_25px_rgba(244,63,94,0.8)]';

              const canBank = bankCards.length < maxBankSlots && !card.isSpecial;

              return (
                <motion.div
                  key={card.id || `card_pos_${idx}`}
                  whileHover={{ y: -14, scale: 1.12, rotateZ: (idx % 2 === 0 ? 2 : -2) }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ duration: 0.18 }}
                  className={`w-11 sm:w-13 h-20 sm:h-22 shrink-0 rounded-2xl p-1 flex flex-col items-center justify-between border cursor-pointer select-none relative shadow-xl backdrop-blur-md ${cardBg}`}
                  onClick={() => handleTileClick(card)}
                  onMouseEnter={() => isSpecialOrSealed && setHoveredCard(card)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Bank Button Overlay */}
                  {canBank && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onBankCard && onBankCard(card);
                      }}
                      className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[9px] flex items-center justify-center shadow-lg z-30 transition cursor-pointer"
                      title="Harf Bankasına Kaldır"
                    >
                      <Landmark size={10} />
                    </button>
                  )}

                  {/* Seal Icon Badge */}
                  {card.seal && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-950 text-xs flex items-center justify-center shadow-xl border border-amber-300 z-30">
                      {card.seal === 'FOIL' && '🪙'}
                      {card.seal === 'HOLOGRAPHIC' && '🔮'}
                      {card.seal === 'POLYCHROME' && '🌈'}
                      {card.seal === 'RED_SEAL' && '🔴'}
                      {card.seal === 'EMERALD_SEAL' && '💚'}
                      {card.seal === 'FREEZE_SEAL' && '❄️'}
                    </div>
                  )}

                  {/* Main Letter Glyph */}
                  <span className="text-2xl sm:text-3xl font-black font-cinzel tracking-tight my-auto drop-shadow-md">
                    {card.letter}
                  </span>

                  {/* Points Badge */}
                  <div className="w-full flex items-center justify-center bg-slate-950/90 rounded-lg py-0.5 border border-slate-800">
                    <span className="text-[9px] sm:text-[10px] font-black text-amber-300">
                      {card.points > 0 ? `+${card.points}p` : '★ Joker'}
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* DETAIL MODAL */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {detailModalCard && (
            <div className="fixed inset-0 z-[9999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 select-none">
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                className="w-full max-w-sm bg-slate-900 border-2 border-amber-400 rounded-3xl p-5 shadow-2xl text-center space-y-3 relative"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 text-[10px] font-black uppercase">
                    {detailModalCard.isSpecial ? 'ÖZEL JOKER TAŞI' : 'MÜHÜRLÜ HARF TAŞI'}
                  </span>
                  <button onClick={() => setDetailModalCard(null)} className="p-1 rounded-full bg-slate-800 text-slate-300">
                    <X size={16} />
                  </button>
                </div>

                <div className="w-16 h-20 mx-auto rounded-2xl bg-slate-950 border-2 border-amber-400 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-amber-300 font-cinzel">{detailModalCard.letter}</span>
                  <span className="text-[9px] font-bold text-amber-400">+{detailModalCard.points} Puan</span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-black text-amber-300 font-cinzel">{detailModalCard.name || `${detailModalCard.letter} Harf Taşı`}</h3>
                  <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800 leading-relaxed text-left">
                    {detailModalCard.desc || 'İstediğiniz harfe dönüşen özel taş.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <button onClick={() => setDetailModalCard(null)} className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs">
                    KAPAT
                  </button>
                  <button onClick={() => handleConfirmPlaceOnBoard(detailModalCard)} className="flex-2 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1">
                    <Check size={16} />
                    <span>KULLAN</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
'''

with open(rack_path, "w", encoding="utf-8") as f:
    f.write(rack_jsx)

# -------------------------------------------------------------
# 2. Upgrade WordPlayArea.jsx to Transparent Felt Table with Neon Slots
# -------------------------------------------------------------
with open(play_path, "r", encoding="utf-8") as f:
    play_code = f.read()

# Make root container bg-transparent
play_code = play_code.replace(
    'className="flex-1 flex flex-col items-center justify-between p-3 relative overflow-hidden dark-felt-table"',
    'className="flex-1 flex flex-col items-center justify-between p-3 relative overflow-hidden bg-transparent z-10"'
)

# Enhance 7 Slots Frame with Neon Gold Glow
play_code = play_code.replace(
    'className="w-full min-h-[85px] p-2 bg-slate-950/90 backdrop-blur-xl gold-glow-border rounded-2xl shadow-2xl flex items-center justify-center gap-1 sm:gap-1.5 transition-all relative overflow-hidden"',
    'className="w-full min-h-[90px] p-2.5 bg-slate-950/80 backdrop-blur-xl border-2 border-amber-400/80 rounded-3xl shadow-[0_0_35px_rgba(245,158,11,0.35)] flex items-center justify-center gap-1.5 sm:gap-2 transition-all relative overflow-hidden"'
)

with open(play_path, "w", encoding="utf-8") as f:
    f.write(play_code)

print("HandCardRack.jsx & WordPlayArea.jsx upgraded to AAA Balatro Battle Arena!")

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, ArrowDownLeft, Sparkles, X, Check } from 'lucide-react';
import { getRarityDetails, INFUSED_TYPES, SEAL_DEFINITIONS, SPECIAL_CARDS } from '../game/cardData';
import { soundEngine } from '../game/audioEngine';
import { RunicCardFrame } from './RunicCardFrame';
import { JokerCardIllustration } from './JokerCardIllustration';
import { CardTooltipOverlay } from './CardTooltipOverlay';
import { fireSparkBurst } from './SparkParticles';

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
  const [hoveredTargetRect, setHoveredTargetRect] = useState(null);
  const [detailModalCard, setDetailModalCard] = useState(null);


  const isSpecialOrSealedTile = (card) => {
    return !!(card.isSpecial || card.type === 'joker' || card.seal || card.infusedType);
  };

  const handleTileClick = (card, e) => {
    soundEngine.playTap();
    if (e && e.clientX) {
      const color = card.seal === 'POLYCHROME' ? '#f472b6' : (card.seal === 'FOIL' ? '#fbbf24' : '#f59e0b');
      fireSparkBurst(e.clientX, e.clientY, color, 18);
    }

    // Only Special / Joker Tiles open the description & letter selector modal!
    if (card.isSpecial || card.type === 'joker' || (card.letter && card.letter.length > 2)) {
      setDetailModalCard(card);
    } else {
      // Normal letters are played directly & instantly with 0 popups!
      onSelectCard(card);
    }
  };

  const handleConfirmSpecialTile = (card) => {
    soundEngine.playTileClick();
    setDetailModalCard(null);
    onSelectCard(card); // Triggers JokerSelectorModal for letter selection
  };

  return (
    <div className="w-full bg-slate-950/90 border-t-2 border-slate-800/90 p-2 sm:p-3 flex flex-col gap-1.5 shadow-2xl backdrop-blur-xl relative z-20 shrink-0 overflow-hidden">
      {/* CENTERED HARF BANKASI SLOTS (NO TITLE TEXTS) */}
      <div className="w-full flex items-center justify-center gap-2.5 py-1 px-3 bg-emerald-950/30 border border-emerald-500/40 rounded-2xl shadow-inner">
        <Landmark size={14} className="text-emerald-400 shrink-0" />
        <div className="flex items-center gap-2 justify-center">
          {bankSlots.map((index) => {
            const card = bankCards[index];
            if (card) {
              return (
                <motion.div
                  key={`bank_slot_${card.id}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-1.5 bg-gradient-to-b from-amber-400 to-yellow-500 text-slate-950 rounded-xl px-3 py-1 shadow-lg border border-yellow-200"
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
                className="px-3.5 py-1 rounded-xl border border-dashed border-emerald-700/60 bg-slate-950/60 text-[10px] font-mono font-bold text-emerald-400/80 italic flex items-center gap-1"
              >
                <span>Slot #{index + 1} Boş</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* HAND CARDS FLEX RACK WITH BALATRO 3D LIFT ANIMATION */}
      <div className="w-full flex items-center justify-center gap-1.5 sm:gap-2.5 max-w-full overflow-x-auto py-1.5 px-1 min-h-[90px] relative overflow-y-hidden">
        <AnimatePresence>
          {handCards.length === 0 ? (
            <div className="text-xs text-slate-500 font-semibold py-3 italic">El boş! Harf çekin veya bankadan kullanın.</div>
          ) : (
            handCards.map((card, idx) => {
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
                  whileHover={{ y: -6, scale: 1.05, rotateZ: (idx % 2 === 0 ? 2 : -2) }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ duration: 0.18 }}
                  className={`w-11 sm:w-16 h-18 sm:h-26 shrink-0 rounded-2xl p-1 sm:p-1.5 flex flex-col items-center justify-between border cursor-pointer select-none relative shadow-2xl backdrop-blur-md overflow-visible ${cardBg}`}
                  onClick={(e) => handleTileClick(card, e)}
                >
                  <RunicCardFrame
                    rarity={card.isSpecial ? 'joker' : (card.rarity === 'efsanevi' ? 'legendary' : (card.rarity === 'nadir' ? 'rare' : 'common'))}
                  />

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

                  {/* Main Letter / Joker SVG Illustration Glyph */}
                  {card.isSpecial || card.type === 'joker' || (card.letter && card.letter.length > 1) ? (
                    <div className="my-auto flex flex-col items-center justify-center">
                      <JokerCardIllustration cardId={card.specialType || card.id || card.letter} type={card.specialType || 'joker'} className="w-8 h-8 sm:w-10 sm:h-10 my-auto drop-shadow-md" />
                    </div>
                  ) : (
                    <span className="text-2xl sm:text-3xl font-black font-cinzel tracking-tight my-auto drop-shadow-md">
                      {card.letter}
                    </span>
                  )}

                  {/* Points Badge */}
                  <div className="w-full flex items-center justify-center bg-slate-950/90 rounded-lg py-0.5 border border-slate-800 shrink-0">
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

      {/* SPECIAL JOKER DESCRIPTION & LETTER SELECTION LAUNCH MODAL */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {detailModalCard && (() => {
            const specKey = Object.keys(SPECIAL_CARDS).find(k => 
              SPECIAL_CARDS[k].id === detailModalCard.id || 
              SPECIAL_CARDS[k].type === detailModalCard.specialType ||
              SPECIAL_CARDS[k].name === detailModalCard.name
            ) || 'JOKER';
            const spec = SPECIAL_CARDS[specKey] || SPECIAL_CARDS.JOKER;

            const cardTitle = detailModalCard.name || spec.name || 'Joker Harf Taşı';
            const cardDesc = detailModalCard.desc || spec.desc || 'Kelimeyi tamamlayan en uygun Türkçe harfe dönüşür.';

            return (
              <div className="fixed inset-0 z-[9999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 select-none">
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.85, opacity: 0 }}
                  className="w-full max-w-sm bg-slate-900 border-2 border-amber-400 rounded-3xl p-5 shadow-2xl text-center space-y-4 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 text-[10px] font-black uppercase tracking-wider border border-purple-500/50">
                      🃏 ÖZEL JOKER TAŞI
                    </span>
                    <button onClick={() => setDetailModalCard(null)} className="p-1 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer">
                      <X size={16} />
                    </button>
                  </div>

                  {/* SVG Illustration Container */}
                  <div className="w-20 h-24 mx-auto rounded-2xl bg-gradient-to-b from-purple-900/60 via-indigo-950 to-slate-950 border-2 border-amber-400 flex flex-col items-center justify-center shadow-xl relative overflow-hidden p-2">
                    <RunicCardFrame rarity="joker" />
                    <JokerCardIllustration cardId={detailModalCard.id} type={detailModalCard.specialType || 'joker'} className="w-10 h-10 my-auto" />
                    <span className="text-[10px] font-black text-amber-300 bg-slate-950/90 px-2 py-0.5 rounded-md border border-amber-500/40">
                      {detailModalCard.points > 0 ? `+${detailModalCard.points} Puan` : 'Joker Harf'}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-base font-black text-amber-300 font-cinzel tracking-wide">{cardTitle}</h3>
                    <p className="text-xs text-slate-200 bg-slate-950 p-3 rounded-2xl border border-slate-800 leading-relaxed text-left font-medium">
                      {cardDesc}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                    <button onClick={() => setDetailModalCard(null)} className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer">
                      KAPAT
                    </button>
                    <button onClick={() => handleConfirmSpecialTile(detailModalCard)} className="flex-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-950/50 cursor-pointer">
                      <Sparkles size={16} />
                      <span>HARF SEÇ & OYNA</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            );
          })()}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

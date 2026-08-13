import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, ArrowUpRight, ArrowDownLeft, Info, Sparkles, X, Check, ArrowRight, ShieldAlert } from 'lucide-react';
import { getRarityDetails, INFUSED_TYPES, SEAL_DEFINITIONS, SPECIAL_CARDS } from '../game/cardData';
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

  // Check if a card is a special tile/joker/sealed tile
  const isSpecialOrSealedTile = (card) => {
    return !!(card.isSpecial || card.type === 'joker' || card.seal || card.infusedType);
  };

  // Handle tile click in rack
  const handleTileClick = (card) => {
    soundEngine.playTap();
    if (isSpecialOrSealedTile(card)) {
      // Open interactive detail modal for special cards & jokers!
      setDetailModalCard(card);
    } else {
      // Regular letter tile: place directly onto board immediately!
      onSelectCard(card);
    }
  };

  // Confirm placing card onto board from detail modal
  const handleConfirmPlaceOnBoard = (card) => {
    soundEngine.playTileClick();
    setDetailModalCard(null);
    onSelectCard(card);
  };

  return (
    <div className="w-full bg-slate-950/95 border-t border-slate-800/90 p-2.5 pt-2 flex flex-col gap-1.5 shadow-2xl backdrop-blur-xl relative">
      {/* Rack Header */}
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

      {/* Hand Cards Container: Clean non-overlapping flex layout */}
      <div className="w-full flex items-center justify-center gap-1.5 sm:gap-2 max-w-full overflow-x-auto py-1 px-1 min-h-[86px] relative">
        <AnimatePresence>
          {handCards.length === 0 ? (
            <div className="text-xs text-slate-500 font-semibold py-4 italic">El boş! Harf çekin veya bankadan kullanın.</div>
          ) : (
            handCards.map((card, idx) => {
              const rarity = getRarityDetails(card.rarity);
              const isSpecialOrSealed = isSpecialOrSealedTile(card);

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
                <div
                  key={card.id || `card_pos_${idx}`}
                  className="w-10 sm:w-12 h-18 sm:h-20 shrink-0 flex flex-col items-center justify-between relative select-none group"
                  onMouseEnter={() => isSpecialOrSealed && setHoveredCard(card)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* HOVER TOOLTIP POPOVER (ONLY FOR SPECIAL / JOKER / SEALED TILES!) */}
                  {isSpecialOrSealed && hoveredCard && hoveredCard.id === card.id && (
                    <motion.div
                      initial={{ opacity: 0, y: -5, scale: 0.95 }}
                      animate={{ opacity: 1, y: -12, scale: 1 }}
                      exit={{ opacity: 0, y: -5, scale: 0.95 }}
                      className="absolute bottom-full mb-1 z-[150] w-48 p-2.5 rounded-2xl bg-slate-900/95 border-2 border-amber-400 text-slate-100 shadow-2xl backdrop-blur-md pointer-events-none text-left space-y-1 left-1/2 -translate-x-1/2"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg">{card.letter}</span>
                        <span className="text-xs font-black text-amber-300">{card.name || 'Özel Joker Taş'}</span>
                      </div>
                      <p className="text-[10px] text-slate-300 font-medium leading-snug">
                        {card.desc || 'İstediğiniz harfe dönüşen özel joker taşı.'}
                      </p>
                      {card.seal && (
                        <div className="text-[9px] font-bold text-pink-300 bg-pink-950/80 px-1.5 py-0.5 rounded border border-pink-500/40 inline-block">
                          Mühür: {SEAL_DEFINITIONS[card.seal]?.name || card.seal}
                        </div>
                      )}
                      <div className="text-[8px] font-bold text-cyan-300 italic pt-0.5">
                        👉 Tıklayarak KULLAN veya detayını gör!
                      </div>
                    </motion.div>
                  )}

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

                  {/* Seal Badge */}
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

                  {/* Main Card Action Button */}
                  <motion.button
                    whileHover={{ y: -4, scale: 1.05 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handleTileClick(card)}
                    className={`w-full h-full rounded-2xl flex flex-col items-center justify-between p-1 transition-all cursor-pointer ${tileClass}`}
                  >
                    {/* Top Label (Only for Special Cards) */}
                    {card.isSpecial && (
                      <span className="text-[7px] sm:text-[8px] font-black opacity-90 tracking-tighter uppercase truncate w-full text-center text-amber-200">
                        {card.name || card.specialType}
                      </span>
                    )}

                    {/* Main Letter Glyph / Joker Artwork Icon */}
                    <span className="text-xl sm:text-2xl font-extrabold tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] animate-pulse">
                      {card.letter}
                    </span>

                    {/* Points Badge */}
                    <div className="w-full flex items-center justify-center bg-slate-950/80 rounded-lg py-0.5 border border-slate-800/80">
                      <span className="text-[9px] sm:text-[10px] font-black text-amber-300">
                        {card.points > 0 ? `+${card.points}p` : '★ Joker'}
                      </span>
                    </div>
                  </motion.button>
                </div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* INTERACTIVE SPECIAL TILE DETAIL MODAL (PORTAL TO DOCUMENT.BODY) */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {detailModalCard && (
            <div className="fixed inset-0 z-[9999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 select-none">
              <motion.div
                initial={{ scale: 0.85, opacity: 0, y: -20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.85, opacity: 0, y: -20 }}
                className="w-full max-w-sm max-h-[82vh] overflow-y-auto bg-gradient-to-b from-slate-900 via-[#0d1527] to-slate-950 border-2 border-amber-400 rounded-3xl p-4 sm:p-5 shadow-[0_0_60px_rgba(251,191,36,0.4)] text-center space-y-3 relative my-auto"
              >
                {/* Top Category Badge */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-500/50 text-purple-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                    <Sparkles size={11} />
                    <span>{detailModalCard.isSpecial ? 'ÖZEL JOKER TAŞI' : 'MÜHÜRLÜ HARF TAŞI'}</span>
                  </span>

                  <button
                    onClick={() => setDetailModalCard(null)}
                    className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Big Artwork Icon Showcase */}
                <div className="w-16 h-20 sm:w-20 sm:h-24 mx-auto rounded-2xl sm:rounded-3xl bg-gradient-to-b from-purple-900/80 via-indigo-950 to-slate-950 border-2 border-amber-400/80 flex flex-col items-center justify-center shadow-2xl space-y-0.5">
                  <span className="text-3xl sm:text-4xl drop-shadow-lg">{detailModalCard.letter}</span>
                  <span className="text-[9px] sm:text-[10px] font-black text-amber-300 bg-slate-950/90 px-2 py-0.5 rounded-full border border-amber-500/40">
                    {detailModalCard.points > 0 ? `+${detailModalCard.points} Puan` : '★ Joker'}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base font-black text-amber-300 font-cinzel">
                    {detailModalCard.name || `${detailModalCard.letter} Harf Taşı`}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-200 leading-relaxed bg-slate-950/90 p-3 rounded-2xl border border-slate-800 text-left">
                    {detailModalCard.desc || (detailModalCard.isSpecial ? 'Seçtiğinizde istediğiniz herhangi bir harfe dönüşerek kelimenizi tamamlamanızı ve devasa puanlar elde etmenizi sağlar!' : 'Özel bonus mühürlerle güçlendirilmiş harf taşı.')}
                  </p>
                </div>

                {/* Extra Seal / Infused Info */}
                {detailModalCard.seal && (
                  <div className="p-1.5 rounded-xl bg-pink-950/40 border border-pink-500/40 text-[10px] sm:text-[11px] font-bold text-pink-300 flex items-center justify-center gap-1.5">
                    <Sparkles size={12} className="text-pink-400" />
                    <span>Mühür Bonusu: {SEAL_DEFINITIONS[detailModalCard.seal]?.name || detailModalCard.seal}</span>
                  </div>
                )}

                {/* Action Buttons: KULLAN & KAPAT */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => setDetailModalCard(null)}
                    className="flex-1 py-3 px-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs sm:text-sm transition cursor-pointer border border-slate-700 active:scale-95"
                  >
                    KAPAT
                  </button>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleConfirmPlaceOnBoard(detailModalCard)}
                    className="flex-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xl shadow-emerald-500/30 border border-emerald-300"
                  >
                    <Check size={16} />
                    <span>KULLAN</span>
                  </motion.button>
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

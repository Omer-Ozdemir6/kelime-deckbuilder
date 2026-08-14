import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, ArrowRight, RefreshCw, Sparkles, ShoppingCart, Layers, Package, Ticket, Star } from 'lucide-react';
import { soundEngine } from '../game/audioEngine';
import { BoosterPackOpeningModal } from './BoosterPackOpeningModal';
import { JokerCardIllustration } from './JokerCardIllustration';

// Custom SVG Shop Header Crest Component
function ShopSvgCrest() {
  return (
    <div className="relative flex items-center justify-center shrink-0">
      <div className="absolute w-12 h-12 rounded-full bg-amber-500/20 blur-md pointer-events-none" />
      <svg className="w-10 h-10 drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="44" fill="#451a03" stroke="#f59e0b" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="36" fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4 2" />
        {/* Shopping Canopy / Tent */}
        <path d="M25 45 L50 25 L75 45 L70 65 L30 65 Z" fill="#b45309" stroke="#fef08a" strokeWidth="1.5" />
        <path d="M35 45 Q50 35 65 45" stroke="#fef08a" strokeWidth="2" fill="none" />
        {/* Coin Stack */}
        <circle cx="50" cy="55" r="10" fill="#facc15" stroke="#78350f" strokeWidth="1.5" />
        <text x="50" y="59" textAnchor="middle" fill="#78350f" fontSize="10" fontWeight="900">$</text>
      </svg>
    </div>
  );
}

export function ShopScreen({
  gold,
  fullDeck = [],
  activeRelicKeys = [],
  onBuyCard,
  onBuyPassiveJoker,
  onRemoveCard,
  onLeaveShop
}) {
  const MAX_DECK_SIZE = 30;
  const isDeckFull = fullDeck.length >= MAX_DECK_SIZE;
  const [rerollCost, setRerollCost] = useState(10);
  const [activePackOpening, setActivePackOpening] = useState(null);
  const [soldSlots, setSoldSlots] = useState({
    card1: false,
    card2: false,
    voucher: false,
    pack1: false,
    pack2: false
  });

  const handleReroll = () => {
    if (gold >= rerollCost) {
      try { soundEngine.playTap?.(); } catch(e) {}
      setRerollCost(prev => prev + 5);
      setSoldSlots({
        card1: false,
        card2: false,
        voucher: soldSlots.voucher,
        pack1: false,
        pack2: false
      });
    }
  };

  const buyItem = (slotKey, cost, callback, requiresDeckSpace = true) => {
    if (requiresDeckSpace && isDeckFull) {
      try { soundEngine.playInvalidWord?.(); } catch(e) {}
      return;
    }
    if (gold >= cost && !soldSlots[slotKey]) {
      try { soundEngine.playVictory?.(); } catch(e) {}
      if (callback) callback();
      setSoldSlots(prev => ({ ...prev, [slotKey]: true }));
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 bg-slate-950 text-slate-100 select-none relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Ambient Radial Glow Blob */}
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="w-[650px] h-[650px] bg-amber-500/15 rounded-full blur-3xl" />
      </div>

      {/* Background SVG Runic Radial Rays */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 z-0">
        <svg className="w-[700px] h-[700px] sm:w-[850px] sm:h-[850px] text-amber-500/35 animate-spin-slow" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="6 3" />
          <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <polygon points="100,20 180,100 100,180 20,100" fill="none" stroke="currentColor" strokeWidth="1" />
          <polygon points="100,10 190,100 100,190 10,100" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 2" />
        </svg>
      </div>

      {/* PACK OPENING ANIMATED MODAL */}
      {activePackOpening && (
        <BoosterPackOpeningModal
          packType={activePackOpening}
          onClose={() => setActivePackOpening(null)}
          onClaimCard={(claimedCard) => {
            if (onBuyCard) onBuyCard(claimedCard);
          }}
        />
      )}

      {/* SHOP OUTER CONTAINER CONTAINER */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl bg-slate-950/95 border-2 border-amber-500/70 rounded-3xl p-4 sm:p-5 shadow-[0_0_50px_rgba(245,158,11,0.35)] backdrop-blur-2xl flex flex-col gap-4 relative z-10"
      >
        {/* TOP STATUS BAR */}
        <div className="flex items-center justify-between border-b-2 border-slate-800/90 pb-3">
          <div className="flex items-center gap-3">
            <ShopSvgCrest />
            <div>
              <h2 className="text-lg sm:text-xl font-black text-amber-300 font-cinzel tracking-wide flex items-center gap-2">
                <span>DÜKKÂN (BALATRO SHOP)</span>
                <Sparkles size={16} className="text-amber-400" />
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <div className={`px-2.5 py-0.5 rounded-full text-xs font-black border flex items-center gap-1 ${
                  isDeckFull ? 'bg-rose-950 border-rose-500/80 text-rose-300' : 'bg-slate-900 border-slate-700 text-slate-300'
                }`}>
                  <Layers size={13} className={isDeckFull ? 'text-rose-400' : 'text-slate-400'} />
                  <span>Deste: {fullDeck.length} / {MAX_DECK_SIZE} {isDeckFull ? '(DOLU)' : ''}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-950/90 to-yellow-950/90 border-2 border-amber-400/80 px-4 py-2 rounded-2xl text-amber-300 font-black font-mono text-lg shadow-xl">
            <Coins size={20} className="text-amber-400 fill-amber-400" />
            <span>${gold}</span>
          </div>
        </div>

        {/* 4-GRID BALATRO SHOP LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* TOP LEFT PANEL: NEXT ROUND & REROLL BUTTONS */}
          <div className="bg-slate-900/90 border-2 border-slate-800 rounded-2xl p-4 flex flex-col gap-3 justify-center shadow-lg">
            {/* NEXT ROUND RED CTA BUTTON */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02 }}
              onClick={onLeaveShop}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-red-500 to-rose-600 hover:from-rose-500 hover:to-red-400 text-white font-black text-base shadow-xl border-2 border-rose-300 cursor-pointer flex items-center justify-center gap-2 tracking-wider"
            >
              <span>Sonraki Aşamaya Geç</span>
              <ArrowRight size={20} />
            </motion.button>

            {/* REROLL GREEN BUTTON */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02 }}
              onClick={handleReroll}
              disabled={gold < rerollCost}
              className={`w-full py-3.5 rounded-2xl font-black text-base shadow-xl border-2 flex items-center justify-center gap-2 cursor-pointer transition ${
                gold >= rerollCost
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 border-emerald-200 shadow-emerald-500/30'
                  : 'bg-slate-950 border-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              <RefreshCw size={18} />
              <span>Yenile ${rerollCost}</span>
            </motion.button>
          </div>

          {/* TOP RIGHT PANEL: AVAILABLE CARDS / JOKERS */}
          <div className="bg-slate-900/90 border-2 border-slate-800 rounded-2xl p-3 flex items-center justify-around gap-2 min-h-[155px] shadow-lg">
            {/* CARD SLOT 1: JOKER CARD ($6) */}
            <div className="flex flex-col items-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow border border-yellow-200 font-mono">
                $6
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => buyItem('card1', 6, () => onBuyCard && onBuyCard('JOKER_CARD', 6))}
                disabled={soldSlots.card1 || gold < 6 || isDeckFull}
                className={`w-24 h-32 rounded-2xl border-2 flex flex-col items-center justify-between p-2 shadow-xl cursor-pointer ${
                  soldSlots.card1 || isDeckFull
                    ? 'opacity-40 bg-slate-950 border-slate-800'
                    : 'bg-gradient-to-b from-purple-900 via-slate-900 to-purple-950 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                }`}
              >
                {soldSlots.card1 ? (
                  <span className="text-xs font-black text-slate-500 my-auto">SATILDI</span>
                ) : (
                  <>
                    <JokerCardIllustration cardId="SPECIAL_JOKER" type="joker" className="w-10 h-10 mt-1" />
                    <span className="text-[10px] font-black text-purple-200 text-center font-cinzel">Joker Taş</span>
                    <span className="text-[9px] font-black text-amber-300 bg-purple-950 px-1.5 py-0.5 rounded-full border border-purple-500/50">+15 Çarpan</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* CARD SLOT 2: FOIL HARF ($5) */}
            <div className="flex flex-col items-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow border border-yellow-200 font-mono">
                $5
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => buyItem('card2', 5, () => onBuyCard && onBuyCard('FOIL_JOKER', 5))}
                disabled={soldSlots.card2 || gold < 5 || isDeckFull}
                className={`w-24 h-32 rounded-2xl border-2 flex flex-col items-center justify-between p-2 shadow-xl cursor-pointer ${
                  soldSlots.card2 || isDeckFull
                    ? 'opacity-40 bg-slate-950 border-slate-800'
                    : 'bg-gradient-to-b from-sky-900 via-slate-900 to-sky-950 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                }`}
              >
                {soldSlots.card2 ? (
                  <span className="text-xs font-black text-slate-500 my-auto">SATILDI</span>
                ) : (
                  <>
                    <JokerCardIllustration cardId="SPECIAL_FOIL_JOKER" type="joker" className="w-10 h-10 mt-1" />
                    <span className="text-[10px] font-black text-sky-200 text-center font-cinzel">Foil Mühür</span>
                    <span className="text-[9px] font-black text-amber-300 bg-sky-950 px-1.5 py-0.5 rounded-full border border-sky-500/50">+30 Puan</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* BOTTOM LEFT PANEL: ANTE VOUCHER SLOT ($10) */}
          <div className="bg-slate-900/90 border-2 border-slate-800 rounded-2xl p-3 flex flex-col items-center justify-center gap-1.5 min-h-[155px] relative shadow-lg">
            <span className="absolute left-2 top-2 text-[9px] font-black text-slate-500 uppercase tracking-widest -rotate-90 origin-left">
              ANTE VOUCHER
            </span>

            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow border border-yellow-200 font-mono mb-1">
              $10
            </span>

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => buyItem('voucher', 10, null, false)}
              disabled={soldSlots.voucher || gold < 10}
              className={`w-24 h-28 rounded-2xl border-2 stroke-dasharray flex flex-col items-center justify-between p-2 shadow-xl cursor-pointer ${
                soldSlots.voucher
                  ? 'opacity-30 bg-slate-950 border-slate-800'
                  : 'bg-gradient-to-b from-emerald-950 via-teal-900 to-slate-950 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
              }`}
            >
              {soldSlots.voucher ? (
                <span className="text-xs font-black text-slate-500 my-auto">KULLANILDI</span>
              ) : (
                <>
                  <span className="text-[10px] font-black text-emerald-300 uppercase tracking-wider mt-1 font-cinzel">VOUCHER</span>
                  <span className="text-3xl">🎟️</span>
                  <span className="text-[8px] font-black text-emerald-200 text-center leading-tight bg-emerald-950 px-1 py-0.5 rounded-md border border-emerald-500/50">+1 Yenileme</span>
                </>
              )}
            </motion.button>
          </div>

          {/* BOTTOM RIGHT PANEL: BOOSTER PACKS (BUFFOON PACK $4 & ARCANA PACK $6) */}
          <div className="bg-slate-900/90 border-2 border-slate-800 rounded-2xl p-3 flex items-center justify-around gap-2 min-h-[155px] shadow-lg">
            {/* BOOSTER PACK 1: BUFFOON PACK ($4) */}
            <div className="flex flex-col items-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow border border-yellow-200 font-mono">
                $4
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => buyItem('pack1', 4, () => setActivePackOpening('BUFFOON_PACK'))}
                disabled={soldSlots.pack1 || gold < 4 || isDeckFull}
                className={`w-24 h-32 rounded-2xl border-2 flex flex-col items-center justify-between p-2 shadow-xl cursor-pointer ${
                  soldSlots.pack1 || isDeckFull
                    ? 'opacity-40 bg-slate-950 border-slate-800'
                    : 'bg-gradient-to-b from-amber-600 via-yellow-700 to-amber-900 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                }`}
              >
                {soldSlots.pack1 ? (
                  <span className="text-xs font-black text-slate-500 my-auto">AÇILDI</span>
                ) : (
                  <>
                    <span className="text-3xl mt-1">📦</span>
                    <span className="text-[10px] font-black text-amber-100 text-center leading-tight font-cinzel">Buffoon Pack</span>
                    <span className="text-[8px] font-black text-slate-950 bg-amber-300 px-2 py-0.5 rounded-full">PACK</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* BOOSTER PACK 2: ARCANA PACK ($6) */}
            <div className="flex flex-col items-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow border border-yellow-200 font-mono">
                $6
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => buyItem('pack2', 6, () => setActivePackOpening('ARCANA_PACK'))}
                disabled={soldSlots.pack2 || gold < 6 || isDeckFull}
                className={`w-24 h-32 rounded-2xl border-2 flex flex-col items-center justify-between p-2 shadow-xl cursor-pointer ${
                  soldSlots.pack2 || isDeckFull
                    ? 'opacity-40 bg-slate-950 border-slate-800'
                    : 'bg-gradient-to-b from-purple-600 via-pink-700 to-indigo-900 border-pink-300 shadow-[0_0_20px_rgba(236,72,153,0.4)]'
                }`}
              >
                {soldSlots.pack2 ? (
                  <span className="text-xs font-black text-slate-500 my-auto">AÇILDI</span>
                ) : (
                  <>
                    <span className="text-3xl mt-1">✨</span>
                    <span className="text-[10px] font-black text-pink-100 text-center leading-tight font-cinzel">Arcana Pack</span>
                    <span className="text-[8px] font-black text-slate-950 bg-pink-300 px-2 py-0.5 rounded-full">PACK</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}

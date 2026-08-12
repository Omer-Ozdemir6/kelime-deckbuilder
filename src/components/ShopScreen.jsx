import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, RefreshCw, Coins, X, ArrowRight, Trash2, Sparkles, Package, HelpCircle, Lock } from 'lucide-react';
import { LETTER_DEFINITIONS, SPECIAL_CARDS, getRarityDetails, PASSIVE_JOKERS, ALL_PASSIVE_JOKER_KEYS, PASSIVE_JOKERS_BY_RARITY, MAX_ACTIVE_JOKERS } from '../game/cardData';
import { soundEngine } from '../game/audioEngine';
import { discoverCodexItem } from '../game/codexManager';

// Rarity renk eşleştirmesi
const RARITY_STYLES = {
  yaygin: { border: 'border-slate-500/60', badge: 'bg-slate-800 text-slate-300', label: 'Yaygın', glow: 'rgba(100,116,139,0.3)' },
  nadir: { border: 'border-blue-400/60', badge: 'bg-blue-900/80 text-blue-200', label: 'Nadir', glow: 'rgba(96,165,250,0.3)' },
  efsanevi: { border: 'border-amber-400/60', badge: 'bg-amber-900/80 text-amber-200', label: 'Efsanevi', glow: 'rgba(251,191,36,0.4)' },
  efsane_otesi: { border: 'border-purple-400/60', badge: 'bg-purple-900/80 text-purple-200', label: 'Efsane Ötesi', glow: 'rgba(167,139,250,0.5)' },
  nadir_harf: { border: 'border-purple-400/60', badge: 'bg-purple-900/80 text-purple-200', label: 'Nadir', glow: 'rgba(192,38,211,0.3)' },
  cok_nadir: { border: 'border-amber-400/60', badge: 'bg-amber-900/80 text-amber-200', label: 'Çok Nadir', glow: 'rgba(245,158,11,0.4)' },
  normal: { border: 'border-slate-700/60', badge: 'bg-slate-900 text-slate-400', label: 'Normal', glow: 'rgba(71,85,105,0.2)' },
};

// Rastgele joker listesi oluştur (tekrar eden olmasın, aktif jokerler hariç tut)
function generateShopJokers(activeJokerIds = [], count = 2) {
  const allKeys = ALL_PASSIVE_JOKER_KEYS;
  // Zaten satın alınmış olanları çıkar
  const available = allKeys.filter(k => !activeJokerIds.includes(k));
  const shuffled = [...available].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(k => PASSIVE_JOKERS[k]);
}

// Rastgele harf + özel kart listesi oluştur
function generateShopCards(count = 4) {
  const letterKeys = Object.keys(LETTER_DEFINITIONS);
  const specialKeys = ['JOKER', 'MIRROR', 'GOLDEN', 'DOUBLE', 'ASH'];
  const combined = [...letterKeys.map(l => ({ type: 'letter', key: l })), ...specialKeys.map(s => ({ type: 'special', key: s }))];
  const shuffled = [...combined].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map((item, i) => {
    if (item.type === 'special') {
      const spec = SPECIAL_CARDS[item.key];
      return {
        id: `offer_${Date.now()}_${i}`,
        type: 'special',
        key: item.key,
        name: spec.name,
        cost: spec.cost,
        rarity: spec.rarity || 'nadir',
        icon: spec.letter,
        desc: spec.desc,
        bgGradient: spec.bgGradient
      };
    } else {
      const def = LETTER_DEFINITIONS[item.key];
      const rarityMap = { normal: 8, nadir: 15, cok_nadir: 22 };
      return {
        id: `offer_${Date.now()}_${i}`,
        type: 'letter',
        key: item.key,
        name: `${item.key} Harfi`,
        cost: rarityMap[def.rarity] || 10,
        rarity: def.rarity,
        icon: item.key,
        desc: def.desc,
        points: def.points
      };
    }
  });
}

// Joker Kartı bileşeni (??? veya açık)
function JokerCard({ joker, isOwned, canAfford, onBuy }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const rarityStyle = RARITY_STYLES[joker.rarity] || RARITY_STYLES.nadir;
  const alreadyOwned = isOwned;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-2xl border-2 ${rarityStyle.border} overflow-hidden flex flex-col cursor-pointer group`}
      style={{
        background: `linear-gradient(135deg, #0f172a 0%, #1e293b 100%)`,
        boxShadow: isRevealed ? `0 0 20px ${rarityStyle.glow}` : 'none',
      }}
      onClick={() => { if (!isRevealed) { soundEngine.playTap(); setIsRevealed(true); } }}
    >
      {/* Price tag */}
      <div className="absolute top-1.5 left-1.5 z-10 flex items-center gap-0.5 bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-lg text-[10px] font-black shadow-md">
        <Coins size={9} />
        <span>${joker.cost}</span>
      </div>

      {/* Rarity badge */}
      <div className={`absolute top-1.5 right-1.5 z-10 px-1.5 py-0.5 rounded-lg text-[9px] font-black ${rarityStyle.badge}`}>
        {rarityStyle.label}
      </div>

      {/* Card face */}
      <div className="p-3 pt-8 flex flex-col items-center text-center flex-1 gap-1.5">
        <AnimatePresence mode="wait">
          {!isRevealed ? (
            <motion.div
              key="mystery"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-purple-900 to-slate-900 border border-purple-600/40 flex items-center justify-center shadow-lg">
                <span className="text-2xl font-black text-purple-300">???</span>
              </div>
              <span className="text-[10px] text-slate-500 font-bold">Tıkla &amp; Keşfet</span>
            </motion.div>
          ) : (
            <motion.div
              key="revealed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-1"
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-b ${joker.bgGradient} flex flex-col items-center justify-center shadow-lg border border-white/10`}
              >
                <span className="text-xl">{joker.icon}</span>
                <span className="text-[8px] text-white/60 font-bold mt-0.5">{joker.artEmoji?.split('')[0]}</span>
              </div>
              <span className="text-xs font-black text-slate-100">{joker.name}</span>
              <span className="text-[9px] text-slate-400 leading-tight px-1">{joker.desc}</span>
              {joker.flavorText && (
                <span className="text-[8px] text-slate-600 italic leading-tight px-1 mt-0.5 text-center">
                  {joker.flavorText}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Buy button */}
      <div className="p-2 pt-0">
        {alreadyOwned ? (
          <div className="w-full py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-500 text-[10px] font-black text-center">
            ZATEN SAHİP
          </div>
        ) : !isRevealed ? (
          <div className="w-full py-1.5 rounded-xl bg-purple-900/60 border border-purple-600/40 text-purple-300 text-[10px] font-black text-center">
            👁 Keşfet
          </div>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); if (canAfford) { discoverCodexItem(joker.id); onBuy(joker); } }}
            disabled={!canAfford}
            className={`w-full py-1.5 rounded-xl text-[10px] font-black transition active:scale-95 cursor-pointer flex items-center justify-center gap-1 ${
              canAfford
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800'
            }`}
          >
            <Coins size={10} />
            <span>${joker.cost} SATIN AL</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}

// Harf/Özel Kart bileşeni
function CardSlot({ offer, isSold, canAfford, onBuy }) {
  const rarityKey = offer.rarity === 'cok_nadir' ? 'cok_nadir' : offer.rarity === 'nadir' ? 'nadir_harf' : 'normal';
  const rarityStyle = RARITY_STYLES[rarityKey] || RARITY_STYLES.normal;

  return (
    <div
      className={`relative rounded-2xl border overflow-hidden flex flex-col transition-all ${
        isSold
          ? 'opacity-40 border-slate-800'
          : `${rarityStyle.border} hover:scale-[1.02]`
      }`}
      style={{
        background: offer.bgGradient
          ? `linear-gradient(135deg, #0f172a, #1e293b)`
          : 'linear-gradient(135deg, #0f172a, #1e293b)',
        boxShadow: !isSold ? `0 0 12px ${rarityStyle.glow}` : 'none'
      }}
    >
      {/* Price tag */}
      {!isSold && (
        <div className="absolute top-1.5 left-1.5 z-10 flex items-center gap-0.5 bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-lg text-[10px] font-black shadow-md">
          <Coins size={9} />
          <span>${offer.cost}</span>
        </div>
      )}

      {/* Card body */}
      <div className="p-2 pt-7 flex flex-col items-center text-center gap-1 flex-1">
        {offer.type === 'special' ? (
          <div className={`w-11 h-14 rounded-xl bg-gradient-to-b ${offer.bgGradient || 'from-purple-900 to-slate-900'} flex items-center justify-center border border-white/10 shadow-md`}>
            <span className="text-xl">{offer.icon}</span>
          </div>
        ) : (
          <div className="w-11 h-14 rounded-xl bg-gradient-to-b from-amber-900/60 to-slate-900 border border-amber-500/40 flex flex-col items-center justify-center shadow-md">
            <span className="text-xl font-extrabold text-amber-200">{offer.icon}</span>
            <span className="text-[9px] font-bold text-amber-400/70">+{offer.points}p</span>
          </div>
        )}
        <span className="text-[10px] font-black text-slate-200 leading-tight">{offer.name}</span>
      </div>

      {/* Buy / Sold button */}
      <div className="p-1.5 pt-0">
        {isSold ? (
          <div className="w-full py-1 rounded-xl bg-slate-900 text-slate-600 text-[9px] font-black text-center">SATILDI</div>
        ) : (
          <button
            onClick={() => { if (canAfford) onBuy(offer); }}
            disabled={!canAfford}
            className={`w-full py-1 rounded-xl text-[9px] font-black transition active:scale-95 cursor-pointer flex items-center justify-center gap-0.5 ${
              canAfford
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                : 'bg-slate-900 text-slate-600 cursor-not-allowed'
            }`}
          >
            <Coins size={9} />
            SATIN AL
          </button>
        )}
      </div>
    </div>
  );
}

export function ShopScreen({
  gold,
  fullDeck = [],
  activeRelicKeys = [],
  activeJokerIds = [],
  onBuyCard,
  onBuyPassiveJoker,
  onRemoveCard,
  onLeaveShop
}) {
  const [rerollCost, setRerollCost] = useState(5);
  const [soldCardIds, setSoldCardIds] = useState([]);
  const [soldJokerIds, setSoldJokerIds] = useState([]);
  const [showRemoveDeck, setShowRemoveDeck] = useState(false);

  // Shop offers — yenileme yapılınca değişir
  const [cardOffers, setCardOffers] = useState(() => generateShopCards(4));
  const [jokerOffers, setJokerOffers] = useState(() => generateShopJokers(activeJokerIds, 2));

  // Joker slotu dolu mu?
  const currentJokerCount = activeJokerIds.length;
  const jokerSlotsLeft = MAX_ACTIVE_JOKERS - currentJokerCount;

  const handleReroll = () => {
    if (gold >= rerollCost) {
      soundEngine.playTap();
      setCardOffers(generateShopCards(4));
      setJokerOffers(generateShopJokers([...activeJokerIds, ...soldJokerIds], 2));
      setSoldCardIds([]);
      setRerollCost(prev => prev + 1);
    }
  };

  const handleBuyCard = (offer) => {
    if (gold >= offer.cost && !soldCardIds.includes(offer.id)) {
      soundEngine.playUpgradeSound();
      if (onBuyCard) onBuyCard(offer.key, offer.cost);
      setSoldCardIds(prev => [...prev, offer.id]);
    }
  };

  const handleBuyJoker = (joker) => {
    if (gold >= joker.cost && !soldJokerIds.includes(joker.id) && jokerSlotsLeft > 0) {
      soundEngine.playVictory();
      if (onBuyPassiveJoker) onBuyPassiveJoker(joker.id, joker.cost);
      setSoldJokerIds(prev => [...prev, joker.id]);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-slate-950 via-[#080c1a] to-slate-950 text-slate-100 overflow-hidden select-none relative">

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 shrink-0 bg-slate-950/95 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300">
            <ShoppingBag size={18} />
          </div>
          <div>
            <h2 className="text-sm font-black text-amber-300 font-cinzel tracking-wider">DÜKKÂN</h2>
            <p className="text-[9px] text-slate-500 font-semibold">Koşunu Güçlendir!</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Deste boyutu */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 px-2 py-1 rounded-xl text-[10px] font-black text-slate-300">
            🎴 {fullDeck.length}
          </div>
          {/* Altın */}
          <div className="flex items-center gap-1 bg-amber-950/80 border border-amber-500/40 px-2.5 py-1 rounded-xl text-xs font-black text-amber-300">
            <Coins size={13} className="text-amber-400 fill-amber-400" />
            <span>${gold}</span>
          </div>
          <button
            onClick={onLeaveShop}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-700 transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* ── MAIN SHOP BODY ── */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">

        {/* ── SECTION 1: JOKERLER ── */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-purple-300 text-[10px] font-black">
              <Sparkles size={11} className="text-purple-400" />
              <span>JOKERLER</span>
              <span className="text-slate-600 font-normal">— {MAX_ACTIVE_JOKERS - jokerSlotsLeft}/{MAX_ACTIVE_JOKERS} dolu</span>
            </div>
            {/* Joker slot göstergesi */}
            <div className="flex items-center gap-1">
              {Array.from({ length: MAX_ACTIVE_JOKERS }).map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-md border ${
                    i < currentJokerCount
                      ? 'bg-purple-500/40 border-purple-400/60'
                      : 'bg-slate-900 border-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {jokerOffers.map((joker) => (
              <JokerCard
                key={joker.id}
                joker={joker}
                isOwned={soldJokerIds.includes(joker.id) || activeJokerIds.includes(joker.id)}
                canAfford={gold >= joker.cost && jokerSlotsLeft > 0 && !soldJokerIds.includes(joker.id)}
                onBuy={handleBuyJoker}
              />
            ))}
          </div>

          {jokerSlotsLeft === 0 && (
            <div className="flex items-center gap-1.5 text-[10px] text-amber-400 font-bold bg-amber-950/30 border border-amber-800/40 rounded-xl px-2 py-1.5">
              <Lock size={11} />
              <span>Joker slotu dolu! (Maks {MAX_ACTIVE_JOKERS})</span>
            </div>
          )}
        </div>

        {/* ── SECTION 2: HARFLER & ÖZEL KARTLAR ── */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-amber-300 text-[10px] font-black">
            <Package size={11} className="text-amber-400" />
            <span>HARFLER &amp; ÖZEL KARTLAR</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {cardOffers.map((offer) => (
              <CardSlot
                key={offer.id}
                offer={offer}
                isSold={soldCardIds.includes(offer.id)}
                canAfford={gold >= offer.cost && !soldCardIds.includes(offer.id)}
                onBuy={handleBuyCard}
              />
            ))}
          </div>
        </div>

        {/* ── SECTION 3: DESTE İNCELTME ── */}
        <div
          onClick={() => setShowRemoveDeck(true)}
          className="flex items-center justify-between p-2.5 rounded-2xl bg-rose-950/20 border border-rose-800/40 cursor-pointer hover:border-rose-500/60 transition group"
        >
          <div className="flex items-center gap-2">
            <Trash2 size={14} className="text-rose-400 group-hover:text-rose-300 transition" />
            <div>
              <p className="text-xs font-black text-rose-300">Deste İncelt</p>
              <p className="text-[9px] text-slate-500">Desteden 1 harf yok et</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-rose-900/50 border border-rose-700/50 px-2 py-1 rounded-xl text-[10px] font-black text-rose-300">
            <Coins size={10} />
            $15
          </div>
        </div>
      </div>

      {/* ── BOTTOM CONTROLS ── */}
      <div className="shrink-0 px-3 py-3 border-t border-slate-800/80 flex items-center gap-2 bg-slate-950/95">
        {/* Reroll */}
        <button
          onClick={handleReroll}
          disabled={gold < rerollCost}
          className={`py-3 px-4 rounded-2xl font-black text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer ${
            gold >= rerollCost
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-md shadow-amber-950/30'
              : 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed'
          }`}
        >
          <RefreshCw size={14} />
          <span>YENİLE (${rerollCost})</span>
        </button>

        {/* Next Round */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onLeaveShop}
          className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm tracking-wide flex items-center justify-center gap-2 transition shadow-xl shadow-emerald-950/40 border border-emerald-300/60 cursor-pointer"
        >
          <span>SONRAKİ SINAVA GEÇ</span>
          <ArrowRight size={16} />
        </motion.button>
      </div>

      {/* ── DECK REMOVE MODAL ── */}
      <AnimatePresence>
        {showRemoveDeck && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="w-full max-w-md bg-gradient-to-b from-rose-950 via-slate-900 to-slate-950 border-2 border-rose-500/80 rounded-3xl p-5 shadow-2xl flex flex-col items-center text-center"
            >
              <h3 className="text-lg font-black text-rose-300 font-cinzel mb-1">🗑️ DESTE İNCELT</h3>
              <p className="text-xs text-slate-400 mb-4">Yok etmek istediğin 1 harfi seç ($15):</p>

              <div className="grid grid-cols-4 gap-2 w-full max-h-52 overflow-y-auto mb-4 p-1">
                {fullDeck.filter(c => !c.isSpecial).map((card) => (
                  <button
                    key={card.id}
                    disabled={gold < 15}
                    onClick={() => {
                      if (onRemoveCard) onRemoveCard(card.id, 15);
                      setShowRemoveDeck(false);
                    }}
                    className={`h-14 rounded-xl flex flex-col items-center justify-center gap-0.5 transition cursor-pointer border ${
                      gold >= 15
                        ? 'bg-slate-900 border-slate-700 hover:border-rose-500 hover:bg-rose-950/30'
                        : 'bg-slate-950/50 border-slate-800 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <span className="text-base font-extrabold text-slate-200">{card.letter}</span>
                    <span className="text-[9px] text-rose-400 font-bold">YOK ET</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowRemoveDeck(false)}
                className="py-2 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer"
              >
                Vazgeç
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

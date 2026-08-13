import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, RefreshCw, Coins, X, ArrowRight, Trash2, Sparkles, Package, HelpCircle, Lock, Gift, Check, Info } from 'lucide-react';
import { LETTER_DEFINITIONS, SPECIAL_CARDS, getRarityDetails, PASSIVE_JOKERS, ALL_PASSIVE_JOKER_KEYS, PASSIVE_JOKERS_BY_RARITY, MAX_ACTIVE_JOKERS, createCard } from '../game/cardData';
import { PLANET_CARDS } from '../game/planetData';
import { soundEngine } from '../game/audioEngine';
import { discoverCodexItem } from '../game/codexManager';
import { UnlockSequenceModal } from './UnlockSequenceModal';

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

// Rastgele joker listesi oluştur
function generateShopJokers(activeJokerIds = [], count = 2) {
  const allKeys = ALL_PASSIVE_JOKER_KEYS;
  const available = allKeys.filter(k => !activeJokerIds.includes(k));
  const shuffled = [...available].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(k => PASSIVE_JOKERS[k]);
}

// Rastgele harf + özel kart listesi oluştur
function generateShopCards(count = 4) {
  const letterKeys = Object.keys(LETTER_DEFINITIONS);
  const specialKeys = [
    'JOKER', 'MIRACLE_JOKER', 'FIRE_JOKER', 'CROWN_JOKER', 'FOIL_JOKER',
    'POISON_JOKER', 'COSMIC_JOKER', 'INFINITY_JOKER', 'MAGNETIC_JOKER',
    'HOLY_JOKER', 'WARRIOR_JOKER', 'SHADOW_JOKER', 'MIDAS_JOKER',
    'SUPERCHARGE_JOKER', 'TRANSMUTE_JOKER', 'VORTEX_JOKER', 'SHIELD_JOKER',
    'SCROLL_JOKER', 'TARGET_JOKER', 'SOUL_GEM_JOKER', 'TIME_GEM_JOKER',
    'NOVA_JOKER', 'SOVEREIGN_JOKER',
    'MIRROR', 'GOLDEN', 'DOUBLE', 'ASH'
  ];
  const combined = [
    ...letterKeys.map(l => ({ type: 'letter', key: l })),
    ...specialKeys.map(s => ({ type: 'special', key: s }))
  ];
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
        points: spec.points || 0,
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

// Pasif Joker Kartı Bileşeni (Üst Bara Gider)
function JokerCard({ joker, isOwned, canAfford, onBuy }) {
  const rarityStyle = RARITY_STYLES[joker.rarity] || RARITY_STYLES.nadir;
  const alreadyOwned = isOwned;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-3xl border-2 ${rarityStyle.border} overflow-hidden flex flex-col justify-between p-3.5 bg-gradient-to-b from-purple-950/80 via-slate-900 to-slate-950 shadow-xl group hover:scale-[1.02] transition-transform`}
      style={{ boxShadow: `0 0 25px ${rarityStyle.glow}` }}
    >
      {/* Top Header Row: Price + Category Tag + Rarity */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1 bg-amber-400 text-slate-950 px-2 py-0.5 rounded-lg text-xs font-black shadow-md">
          <Coins size={11} />
          <span>${joker.cost}</span>
        </div>

        <span className="px-2 py-0.5 rounded-md bg-purple-950 border border-purple-400/50 text-purple-200 text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
          <span>🟣</span> PASİF JOKER
        </span>

        <span className={`px-1.5 py-0.5 rounded text-[9px] font-black ${rarityStyle.badge}`}>
          {rarityStyle.label}
        </span>
      </div>

      {/* Main Art & Content */}
      <div className="flex items-start gap-3 my-1">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-b ${joker.bgGradient} flex items-center justify-center text-3xl shadow-lg border border-white/20 shrink-0 group-hover:scale-110 transition-transform`}>
          {joker.icon}
        </div>
        <div className="flex-1 text-left space-y-0.5">
          <h4 className="text-xs sm:text-sm font-black text-white font-cinzel">{joker.name}</h4>
          <p className="text-[10px] text-slate-300 font-medium leading-snug">{joker.desc}</p>
          <span className="text-[8px] font-bold text-purple-300 bg-purple-950/90 px-1.5 py-0.5 rounded inline-block mt-1">
            📍 Üst Bardaki Slotlara Yerleşir
          </span>
        </div>
      </div>

      {/* Action Buy Button */}
      <div className="mt-2 pt-2 border-t border-purple-900/50">
        {alreadyOwned ? (
          <div className="w-full py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-500 text-[10px] font-black text-center">
            ZATEN SAHİPSİNİZ
          </div>
        ) : (
          <button
            onClick={() => { if (canAfford) { discoverCodexItem(joker.id); onBuy(joker); } }}
            disabled={!canAfford}
            className={`w-full py-2 rounded-xl text-xs font-black transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shadow-lg ${
              canAfford
                ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 border border-amber-300'
                : 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800'
            }`}
          >
            <Coins size={12} />
            <span>${joker.cost} SATIN AL (PASİF KART)</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}

// Harf & Özel Taş Kartı Bileşeni (Ele Gider, Tahtaya Dizilir)
function CardSlot({ offer, isSold, canAfford, onBuy }) {
  const rarityKey = offer.rarity === 'cok_nadir' ? 'cok_nadir' : offer.rarity === 'nadir' ? 'nadir_harf' : 'normal';
  const rarityStyle = RARITY_STYLES[rarityKey] || RARITY_STYLES.normal;
  const isSpecialJokerTile = offer.type === 'special';

  return (
    <div
      className={`relative rounded-3xl border-2 overflow-hidden flex flex-col justify-between p-3.5 transition-all ${
        isSold ? 'opacity-30 border-slate-800 bg-slate-950' : `${rarityStyle.border} bg-gradient-to-b from-slate-900 via-[#0a1226] to-slate-950 hover:scale-[1.02]`
      }`}
      style={{ boxShadow: !isSold ? `0 0 15px ${rarityStyle.glow}` : 'none' }}
    >
      {!isSold && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 bg-amber-400 text-slate-950 px-2 py-0.5 rounded-lg text-xs font-black shadow-md">
            <Coins size={11} />
            <span>${offer.cost}</span>
          </div>

          <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider flex items-center gap-1 ${
            isSpecialJokerTile ? 'bg-pink-950 text-pink-200 border border-pink-500/50' : 'bg-slate-800 text-slate-300'
          }`}>
            <span>{isSpecialJokerTile ? '🃏' : '🔤'}</span>
            <span>{isSpecialJokerTile ? 'ÖZEL JOKER TAŞ' : 'HARF TAŞI'}</span>
          </span>
        </div>
      )}

      {/* Main Art & Content */}
      <div className="flex items-center gap-3 my-1">
        {offer.type === 'special' ? (
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-b ${offer.bgGradient || 'from-purple-900 to-slate-900'} flex flex-col items-center justify-center border border-white/20 shadow-lg shrink-0`}>
            <span className="text-2xl">{offer.icon}</span>
            <span className="text-[8px] font-black text-amber-300 mt-0.5">{offer.points > 0 ? `+${offer.points}p` : '★ Joker'}</span>
          </div>
        ) : (
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-amber-900/60 via-yellow-950 to-slate-900 border border-amber-500/50 flex flex-col items-center justify-center shadow-lg shrink-0">
            <span className="text-2xl font-black text-amber-200">{offer.icon}</span>
            <span className="text-[9px] font-bold text-amber-400">+{offer.points}p</span>
          </div>
        )}

        <div className="flex-1 text-left space-y-0.5">
          <h4 className="text-xs sm:text-sm font-black text-slate-100 font-cinzel">{offer.name}</h4>
          <p className="text-[10px] text-slate-400 font-medium leading-snug">{offer.desc}</p>
          <span className="text-[8px] font-bold text-cyan-300 bg-cyan-950/90 px-1.5 py-0.5 rounded inline-block mt-1">
            🎴 Desteğe Katılır &amp; Ele Gelip Tahtaya Dizilir
          </span>
        </div>
      </div>

      {/* Action Buy Button */}
      <div className="mt-2 pt-2 border-t border-slate-800">
        {isSold ? (
          <div className="w-full py-2 rounded-xl bg-slate-900 text-slate-600 text-[10px] font-black text-center">SATILDI</div>
        ) : (
          <button
            onClick={() => { if (canAfford) onBuy(offer); }}
            disabled={!canAfford}
            className={`w-full py-2 rounded-xl text-xs font-black transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shadow-lg ${
              canAfford
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 border border-amber-300'
                : 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800'
            }`}
          >
            <Coins size={12} />
            <span>${offer.cost} SATIN AL (ELE GELEN TAŞ)</span>
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
  wordCategoryLevels = {},
  onBuyCard,
  onBuyPassiveJoker,
  onBuyPlanetCard,
  onRemoveCard,
  onLeaveShop
}) {
  const [rerollCost, setRerollCost] = useState(5);
  const [soldCardIds, setSoldCardIds] = useState([]);
  const [soldJokerIds, setSoldJokerIds] = useState([]);
  const [showRemoveDeck, setShowRemoveDeck] = useState(false);
  const [activeBoosterPackModal, setActiveBoosterPackModal] = useState(null);
  const [purchasedItemShowcase, setPurchasedItemShowcase] = useState(null);

  const [cardOffers, setCardOffers] = useState(() => generateShopCards(4));
  const [jokerOffers, setJokerOffers] = useState(() => generateShopJokers(activeJokerIds, 2));

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
      setPurchasedItemShowcase([{
        id: joker.id,
        type: 'JOKER',
        name: joker.name,
        icon: joker.icon || '🃏',
        artEmoji: joker.artEmoji || '🃏✨⚡',
        desc: joker.desc,
        category: 'ALINAN PASİF JOKER',
        bgGradient: joker.bgGradient || 'from-purple-900 via-slate-900 to-slate-950',
        helpNote: 'Ekranın üst barındaki pasif slotlara eklendi! Oyun boyunca aktif kalır.'
      }]);
    }
  };

  // Booster Pack Unboxing Generator
  const handleOpenBoosterPack = (packType) => {
    if (packType === 'LETTER_PACK' && gold >= 15) {
      soundEngine.playVictory();
      const letterKeys = Object.keys(LETTER_DEFINITIONS);
      const shuffled = [...letterKeys].sort(() => 0.5 - Math.random()).slice(0, 3);
      setActiveBoosterPackModal({
        title: '🔤 HARF PAKETİ',
        desc: 'Destene katmak için 1 harf kartı seç:',
        cost: 15,
        type: 'LETTER',
        options: shuffled.map(key => ({ type: 'letter', key, name: `${key} Harfi`, icon: key, points: LETTER_DEFINITIONS[key].points }))
      });
    } else if (packType === 'INFUSED_PACK' && gold >= 25) {
      soundEngine.playVictory();
      const infusedOptions = [
        { type: 'special', key: 'GOLDEN', name: 'Altın Harf', icon: '💰', desc: '+15 Ekstra Altın' },
        { type: 'special', key: 'MIRROR', name: 'Ayna Harf', icon: '🪞', desc: 'Kartı Kopyalar' },
        { type: 'special', key: 'DOUBLE', name: 'Çift Harf', icon: '⚡', desc: '2x Skor Yapar' }
      ];
      setActiveBoosterPackModal({
        title: '✨ EFSUN PAKETİ',
        desc: 'Destene katmak için 1 mühürlü kart seç:',
        cost: 25,
        type: 'INFUSED',
        options: infusedOptions
      });
    } else if (packType === 'JOKER_PACK' && gold >= 30 && jokerSlotsLeft > 0) {
      soundEngine.playVictory();
      const jokers = generateShopJokers(activeJokerIds, 3);
      setActiveBoosterPackModal({
        title: '🃏 JOKER PAKETİ',
        desc: 'Üst barına katmak için 1 Pasif Joker seç:',
        cost: 30,
        type: 'JOKER',
        options: jokers.map(j => ({ type: 'joker', id: j.id, name: j.name, icon: j.icon, desc: j.desc, rawJoker: j }))
      });
    }
  };

  const handleClaimPackOption = (option) => {
    soundEngine.playUpgradeSound();
    if (activeBoosterPackModal.type === 'LETTER' || activeBoosterPackModal.type === 'INFUSED') {
      onBuyCard(option.key, activeBoosterPackModal.cost);
    } else if (activeBoosterPackModal.type === 'JOKER') {
      onBuyPassiveJoker(option.id, activeBoosterPackModal.cost);
      if (option.rawJoker) {
        setPurchasedItemShowcase([{
          id: option.rawJoker.id,
          type: 'JOKER',
          name: option.rawJoker.name,
          icon: option.rawJoker.icon || '🃏',
          artEmoji: option.rawJoker.artEmoji || '🃏✨',
          desc: option.rawJoker.desc,
          category: 'PAKETTEN ÇIKAN PASİF JOKER',
          bgGradient: option.rawJoker.bgGradient || 'from-purple-900 to-slate-950',
          helpNote: 'Üst barına yerleşti!'
        }]);
      }
    }
    setActiveBoosterPackModal(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-slate-950 via-[#080c1a] to-slate-950 text-slate-100 overflow-hidden select-none relative">
      {/* PURCHASED ITEM SHOWCASE SQUARE CARD MODAL */}
      {purchasedItemShowcase && (
        <UnlockSequenceModal
          items={purchasedItemShowcase}
          titleHeader="SATIN ALINAN PASİF JOKER"
          onClose={() => setPurchasedItemShowcase(null)}
        />
      )}

      {/* BALATRO SHOP HEADER */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-amber-500/40 shrink-0 bg-slate-950/95 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-300 shadow-lg animate-pulse">
            <ShoppingBag size={20} />
          </div>
          <div className="text-left">
            <h2 className="text-base font-black text-amber-300 font-cinzel tracking-wider flex items-center gap-1.5">
              <span>🛒 BALATRO ÇARŞISI</span>
            </h2>
            <p className="text-[10px] text-slate-400 font-semibold">Koşunu Güçlendir &amp; Deste Kur!</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-2xl text-xs font-black text-cyan-300 shadow-md">
            <span>🎴 Deste:</span>
            <span className="font-mono text-white">{fullDeck.length}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-amber-950 border border-amber-500/50 px-3.5 py-1.5 rounded-2xl text-sm font-black text-amber-300 shadow-xl">
            <Coins size={15} className="text-amber-400 fill-amber-400 animate-pulse" />
            <span className="font-mono">${gold}</span>
          </div>
          <button
            onClick={onLeaveShop}
            className="p-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition cursor-pointer shadow"
            title="Dükkândan Çık"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* EDUCATIONAL INFO REHBER BANNER */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border-b border-purple-800/40 px-4 py-1.5 flex items-center justify-between text-[11px] font-semibold text-slate-300 shrink-0">
        <span className="flex items-center gap-1.5">
          <Info size={13} className="text-amber-400 shrink-0" />
          <span><b>KART AYRIM REHBERİ:</b> 🟣 Pasif Jokerler üst bara gidip tura güç katar | 🎴 Özel Taşlar ele gelip tahtaya dizilir.</span>
        </span>

        <div className="flex items-center gap-1 text-[10px] font-black text-purple-300">
          <span>🟣 Joker Slot: {MAX_ACTIVE_JOKERS - jokerSlotsLeft}/{MAX_ACTIVE_JOKERS}</span>
        </div>
      </div>

      {/* MAIN BALATRO SHOP BODY */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
        {/* SECTION 1: PASİF JOKER VOUCHER SHELF (TOP ROW) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-300 text-xs font-black uppercase tracking-wider">
              <Sparkles size={14} className="text-purple-400" />
              <span>1. PASİF JOKER MARKETİ (ÜST BARA GİDEN KARTLAR)</span>
              <span className="text-slate-500 font-normal text-[10px]">— {MAX_ACTIVE_JOKERS - jokerSlotsLeft}/{MAX_ACTIVE_JOKERS} Slot Dolu</span>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: MAX_ACTIVE_JOKERS }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3.5 h-3.5 rounded-md border transition-all ${
                    i < currentJokerCount ? 'bg-purple-500 border-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.8)]' : 'bg-slate-900 border-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            <div className="flex items-center gap-2 text-xs text-amber-400 font-bold bg-amber-950/40 border border-amber-800/60 rounded-2xl p-2.5">
              <Lock size={14} />
              <span>Pasif Joker slotlarınız dolu! (Maksimum {MAX_ACTIVE_JOKERS} pasif joker alabilirsiniz)</span>
            </div>
          )}
        </div>

        {/* SECTION 2: BOOSTER PACKS (EFSUN & BOOSTER PAKETLERİ) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-cyan-300 text-xs font-black uppercase tracking-wider">
            <Gift size={14} className="text-cyan-400" />
            <span>2. BOOSTER PAKETİ MARKETİ (PAKET AÇMA)</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleOpenBoosterPack('LETTER_PACK')}
              disabled={gold < 15}
              className={`p-3 rounded-3xl border-2 flex flex-col items-center text-center transition cursor-pointer shadow-xl ${
                gold >= 15 ? 'bg-gradient-to-b from-cyan-950/60 to-slate-950 border-cyan-500/60 hover:border-cyan-400 hover:scale-105' : 'bg-slate-950 border-slate-800 opacity-40 cursor-not-allowed'
              }`}
            >
              <span className="text-3xl mb-1 drop-shadow">🔤</span>
              <span className="text-xs font-black text-cyan-300">Harf Paketi</span>
              <span className="text-[9px] text-slate-400 font-semibold mt-0.5">3 Harften 1 Seç</span>
              <span className="text-xs font-extrabold text-amber-300 mt-2 font-mono bg-slate-900 px-2 py-0.5 rounded-lg border border-amber-500/40">$15 💰</span>
            </button>

            <button
              onClick={() => handleOpenBoosterPack('INFUSED_PACK')}
              disabled={gold < 25}
              className={`p-3 rounded-3xl border-2 flex flex-col items-center text-center transition cursor-pointer shadow-xl ${
                gold >= 25 ? 'bg-gradient-to-b from-purple-950/60 to-slate-950 border-purple-500/60 hover:border-purple-400 hover:scale-105' : 'bg-slate-950 border-slate-800 opacity-40 cursor-not-allowed'
              }`}
            >
              <span className="text-3xl mb-1 drop-shadow">✨</span>
              <span className="text-xs font-black text-purple-300">Efsun Paketi</span>
              <span className="text-[9px] text-slate-400 font-semibold mt-0.5">3 Mühürden 1 Seç</span>
              <span className="text-xs font-extrabold text-amber-300 mt-2 font-mono bg-slate-900 px-2 py-0.5 rounded-lg border border-amber-500/40">$25 💰</span>
            </button>

            <button
              onClick={() => handleOpenBoosterPack('JOKER_PACK')}
              disabled={gold < 30 || jokerSlotsLeft === 0}
              className={`p-3 rounded-3xl border-2 flex flex-col items-center text-center transition cursor-pointer shadow-xl ${
                gold >= 30 && jokerSlotsLeft > 0 ? 'bg-gradient-to-b from-amber-950/60 to-slate-950 border-amber-500/60 hover:border-amber-400 hover:scale-105' : 'bg-slate-950 border-slate-800 opacity-40 cursor-not-allowed'
              }`}
            >
              <span className="text-3xl mb-1 drop-shadow">🃏</span>
              <span className="text-xs font-black text-amber-300">Joker Paketi</span>
              <span className="text-[9px] text-slate-400 font-semibold mt-0.5">3 Jokerdan 1 Seç</span>
              <span className="text-xs font-extrabold text-amber-300 mt-2 font-mono bg-slate-900 px-2 py-0.5 rounded-lg border border-amber-500/40">$30 💰</span>
            </button>
          </div>
        </div>

        {/* SECTION 3: HARF & ÖZEL JOKER TAŞLARI (HAND TILES MARKET) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-black uppercase tracking-wider">
            <Package size={14} className="text-amber-400" />
            <span>3. ELE GELEN HARF &amp; ÖZEL JOKER TAŞLARI (TAHTAYA DİZİLİR)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

        {/* SECTION 4: GEZEGEN TAŞLARI (KELİME KATEGORİSİ SEVİYE YÜKSELTME) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-black uppercase tracking-wider">
            <Sparkles size={14} className="text-indigo-400" />
            <span>4. GEZEGEN TAŞLARI (KELİME KATEGORİSİ SEVİYE YÜKSELTME)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PLANET_CARDS.map((planet) => {
              const currentLevel = wordCategoryLevels && wordCategoryLevels[planet.targetLength] ? wordCategoryLevels[planet.targetLength].level : 1;
              const canAffordPlanet = gold >= planet.cost;

              return (
                <div
                  key={planet.id}
                  className="p-3 rounded-2xl bg-gradient-to-b from-slate-900 via-[#0d162a] to-slate-950 border border-indigo-500/40 flex items-center justify-between shadow-md"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{planet.icon}</span>
                    <div className="text-left">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-black text-amber-300">{planet.name}</h4>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-950 border border-indigo-500/50 text-indigo-200 font-bold">
                          SEVİYE {currentLevel}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-300 font-medium">{planet.desc}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onBuyPlanetCard && onBuyPlanetCard(planet)}
                    disabled={!canAffordPlanet}
                    className={`px-3 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1 shrink-0 ${
                      canAffordPlanet
                        ? 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg border border-indigo-300'
                        : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                    }`}
                  >
                    <Coins size={12} />
                    <span>${planet.cost} YÜKSELT</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 5: DESTE YÖNETİMİ & İNCELTME (DECK THINNING) */}
        <div className="p-3 rounded-3xl bg-slate-950/90 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Trash2 size={18} className="text-rose-400" />
            <div className="text-left">
              <h4 className="text-xs font-black text-slate-200">Deste İnceltme (Zayıf Harfi Sil)</h4>
              <p className="text-[10px] text-slate-400">Destenden 1 istemediğin zayıf harfi tamamen yakıp çıkartır.</p>
            </div>
          </div>

          <button
            onClick={() => setShowRemoveDeck(true)}
            disabled={gold < 15}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition cursor-pointer shadow border ${
              gold >= 15 ? 'bg-rose-950 border-rose-500/60 text-rose-300 hover:bg-rose-900' : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
            }`}
          >
            $15 DESTE İNCELT
          </button>
        </div>
      </div>

      {/* BOTTOM SHOP CONTROLS BAR */}
      <div className="p-3 bg-slate-950/95 border-t border-slate-800 flex items-center gap-3 shrink-0">
        <button
          onClick={handleReroll}
          disabled={gold < rerollCost}
          className={`px-4 py-3 rounded-2xl text-xs font-black flex items-center gap-2 transition cursor-pointer border shadow-lg ${
            gold >= rerollCost
              ? 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-amber-500/40'
              : 'bg-slate-950 border-slate-800 text-slate-600 cursor-not-allowed'
          }`}
        >
          <RefreshCw size={14} className={gold >= rerollCost ? 'text-amber-400' : ''} />
          <span>DÜKKÂNI YENİLE (${rerollCost})</span>
        </button>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onLeaveShop}
          className="flex-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black py-3.5 px-6 rounded-2xl transition flex items-center justify-center gap-2 shadow-2xl shadow-emerald-500/30 text-sm tracking-wider border border-emerald-300 cursor-pointer"
        >
          <span>SONRAKİ SINAVA / BÖLGEYE GEÇ</span>
          <ArrowRight size={18} />
        </motion.button>
      </div>

      {/* BOOSTER PACK UNBOXING MODAL */}
      <AnimatePresence>
        {activeBoosterPackModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="w-full max-w-md bg-gradient-to-b from-slate-900 via-[#0d1527] to-slate-950 border-2 border-amber-400 rounded-3xl p-5 shadow-2xl text-center space-y-4"
            >
              <h3 className="text-xl font-black text-amber-300 font-cinzel">{activeBoosterPackModal.title}</h3>
              <p className="text-xs text-slate-300">{activeBoosterPackModal.desc}</p>

              <div className="grid grid-cols-3 gap-2 py-2">
                {activeBoosterPackModal.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleClaimPackOption(opt)}
                    className="p-3 rounded-2xl bg-slate-950 border-2 border-amber-500/50 hover:border-amber-300 hover:scale-105 transition flex flex-col items-center gap-1.5 cursor-pointer shadow-lg group"
                  >
                    <span className="text-3xl group-hover:scale-110 transition-transform">{opt.icon}</span>
                    <span className="text-xs font-black text-amber-200">{opt.name}</span>
                    {opt.desc && <span className="text-[9px] text-slate-400 leading-tight">{opt.desc}</span>}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

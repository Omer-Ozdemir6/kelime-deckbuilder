import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowUpCircle, Trash2, Sparkles, Check, Coins, X, BookOpen, ShieldCheck, RefreshCw, Package, Award, ArrowRight, Tag } from 'lucide-react';
import { LETTER_DEFINITIONS, SPECIAL_CARDS, SEAL_DEFINITIONS, getRarityDetails, getPerkDescription } from '../game/cardData';
import { RELICS } from '../game/relicData';
import { soundEngine } from '../game/audioEngine';

export function ShopScreen({
  gold,
  fullDeck = [],
  activeRelicKeys = [],
  wordTypeLevels = {},
  onBuyCard,
  onUpgradeCardPerk,
  onRemoveCard,
  onBuyRelic,
  onUpgradeWordTypeLevel,
  onLeaveShop
}) {
  const [rerollCost, setRerollCost] = useState(5);
  const [activeBoosterPack, setActiveBoosterPack] = useState(null);
  const [showDeckRemoveModal, setShowDeckRemoveModal] = useState(false);
  const [soldItemIds, setSoldItemIds] = useState([]);

  // Shelf 1: Main Shop Offers (4 Main Slots)
  const [shopLetterOffers, setShopLetterOffers] = useState([
    { id: 'offer_1', key: 'Ş', cost: 15, rarity: 'nadir', label: 'Ş Harfi' },
    { id: 'offer_2', key: 'Ğ', cost: 20, rarity: 'nadir', label: 'Ğ Harfi' },
    { id: 'offer_3', key: 'JOKER', cost: 35, isSpecial: true, label: 'Joker Kartı 🃏' },
    { id: 'offer_4', key: 'GOLDEN', cost: 25, isSpecial: true, label: 'Altın Harf 💰' }
  ]);

  // Shelf 2: Booster Packs (2 Slots)
  const boosterPacks = [
    {
      id: 'PACK_RARE',
      name: '🎁 Nadir Harf Paketi',
      cost: 15,
      icon: '💎',
      desc: '3 Nadir Türkçe harften 1 tanesini seç.',
      options: ['Ş', 'Ğ', 'Ç']
    },
    {
      id: 'PACK_JOKER',
      name: '🎁 Joker & Özel Paket',
      cost: 25,
      icon: '🃏',
      desc: '3 Özel kart seçeneğinden 1 tanesini kap.',
      options: ['JOKER', 'MIRROR', 'ASH']
    }
  ];

  // Shelf 3: Vouchers (1 Active Voucher per Ante)
  const [activeVoucher, setActiveVoucher] = useState({
    id: 'VOUCHER_DISCOUNT',
    name: '📜 Çarşı İndirimi',
    cost: 10,
    icon: '🏷️',
    desc: 'Tüm dükkân ürünlerinde %25 indirim sağlar.'
  });

  const handleRerollClick = () => {
    if (gold >= rerollCost) {
      soundEngine.playTap();
      // Generate 4 fresh random main shop offers
      const allKeys = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'P', 'V', 'Z', 'Ş', 'Ğ', 'Ç', 'Ö', 'Ü', 'JOKER', 'MIRROR', 'GOLDEN'];
      const shuffled = [...allKeys].sort(() => 0.5 - Math.random()).slice(0, 4);
      const newOffers = shuffled.map((key, i) => {
        const isSpec = key === 'JOKER' || key === 'MIRROR' || key === 'GOLDEN';
        const cost = isSpec ? 30 : (['Ş', 'Ğ', 'Ç', 'Z', 'J'].includes(key) ? 20 : 12);
        return {
          id: `offer_reroll_${Date.now()}_${i}`,
          key,
          cost,
          isSpecial: isSpec,
          label: isSpec ? `${key} Kartı` : `${key} Harfi`
        };
      });

      setShopLetterOffers(newOffers);
      setSoldItemIds([]);
      setRerollCost(prev => prev + 1); // Balatro incremental reroll cost ($5, $6, $7...)
    }
  };

  const handleBuyMainOffer = (offer) => {
    if (gold >= offer.cost && !soldItemIds.includes(offer.id)) {
      soundEngine.playUpgradeSound();
      if (onBuyCard) {
        onBuyCard(offer.key, offer.cost);
      }
      setSoldItemIds(prev => [...prev, offer.id]);
    }
  };

  const handleOpenPack = (pack) => {
    if (gold >= pack.cost && !soldItemIds.includes(pack.id)) {
      soundEngine.playVictory();
      setActiveBoosterPack(pack);
    }
  };

  const handleSelectPackOption = (key) => {
    if (activeBoosterPack && onBuyCard) {
      soundEngine.playUpgradeSound();
      onBuyCard(key, activeBoosterPack.cost);
      setSoldItemIds(prev => [...prev, activeBoosterPack.id]);
      setActiveBoosterPack(null);
    }
  };

  const handleBuyVoucher = () => {
    if (gold >= activeVoucher.cost && !soldItemIds.includes(activeVoucher.id)) {
      soundEngine.playUpgradeSound();
      if (onUpgradeWordTypeLevel) {
        onUpgradeWordTypeLevel('VOUCHER');
      }
      setSoldItemIds(prev => [...prev, activeVoucher.id]);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-3 sm:p-4 bg-gradient-to-b from-slate-950 via-[#0a0f1d] to-slate-950 text-slate-100 overflow-y-auto relative select-none">
      {/* 1. BALATRO SHOP HEADER */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 shrink-0 z-10 bg-slate-950/90 backdrop-blur-md px-2 py-1 rounded-2xl">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-md">
            <ShoppingBag size={20} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-amber-300 font-cinzel tracking-wide flex items-center gap-1.5">
              DÜKKÂN (SHOP)
            </h2>
            <p className="text-[11px] text-slate-400 font-medium">
              🎴 Deste Büyüklüğü: <strong className="text-amber-300 font-black">{fullDeck.length} Kart</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-amber-950/80 border border-amber-500/40 px-3 py-1.5 rounded-2xl text-xs font-black text-amber-300 shadow-md">
            <Coins size={14} className="text-amber-400 fill-amber-400" />
            <span>{gold}</span>
          </div>

          <button
            onClick={onLeaveShop}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition active:scale-95 cursor-pointer"
            title="Dükkândan Çık"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* 2. SHELF 1: MAIN SHOP ITEMS (KARTLAR & HARFLER) */}
      <div className="my-2 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-inner space-y-2">
        <div className="flex items-center justify-between text-xs font-black text-amber-300 border-b border-slate-800 pb-1">
          <span className="flex items-center gap-1">
            <Sparkles size={13} className="text-amber-400" />
            1. RAF: KARTLAR & HARFLER (MAIN SHOP SLOTS)
          </span>
          <span className="text-[10px] text-slate-500 font-mono">4 SLOT</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {shopLetterOffers.map((offer) => {
            const isSold = soldItemIds.includes(offer.id);
            const canAfford = gold >= offer.cost && !isSold;

            return (
              <div
                key={offer.id}
                className={`p-2.5 rounded-2xl border flex flex-col justify-between items-center text-center transition shadow-lg relative overflow-hidden ${
                  isSold
                    ? 'bg-slate-950/50 border-slate-900 opacity-50'
                    : canAfford
                    ? 'bg-slate-950/90 border-amber-500/60 hover:border-amber-400'
                    : 'bg-slate-950/70 border-slate-800 opacity-70'
                }`}
              >
                {/* Tile Icon / Glyph */}
                <div className={`w-12 h-16 rounded-xl flex flex-col items-center justify-center my-1 ${
                  offer.isSpecial ? 'tile-bevel-purple text-purple-200' : 'tile-bevel-amber text-amber-200'
                }`}>
                  <span className="text-xl font-extrabold">{offer.key}</span>
                </div>

                <span className="text-xs font-bold text-slate-200 mb-1">{offer.label}</span>

                {/* Price & Buy Button */}
                {isSold ? (
                  <span className="w-full py-1 rounded-xl bg-slate-900 text-slate-600 text-xs font-black uppercase">
                    SATILDI
                  </span>
                ) : (
                  <button
                    onClick={() => handleBuyMainOffer(offer)}
                    disabled={!canAfford}
                    className={`w-full py-1.5 px-2 rounded-xl text-xs font-black transition active:scale-95 flex items-center justify-center gap-1 cursor-pointer ${
                      canAfford
                        ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md'
                        : 'bg-slate-900 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <Coins size={12} />
                    <span>${offer.cost}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. SHELF 2: BOOSTER PACKS (BOOSTER PAKETLERİ) */}
      <div className="my-2 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-inner space-y-2">
        <div className="flex items-center justify-between text-xs font-black text-purple-300 border-b border-slate-800 pb-1">
          <span className="flex items-center gap-1">
            <Package size={13} className="text-purple-400" />
            2. RAF: BOOSTER PAKETLERİ (BOOSTER PACKS)
          </span>
          <span className="text-[10px] text-slate-500 font-mono">2 PAKET</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {boosterPacks.map((pack) => {
            const isSold = soldItemIds.includes(pack.id);
            const canAfford = gold >= pack.cost && !isSold;

            return (
              <div
                key={pack.id}
                className={`p-3 rounded-2xl border flex items-center justify-between gap-2 transition shadow-lg ${
                  isSold
                    ? 'bg-slate-950/50 border-slate-900 opacity-50'
                    : canAfford
                    ? 'bg-purple-950/40 border-purple-500/60 hover:border-purple-400'
                    : 'bg-slate-950/70 border-slate-800 opacity-70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{pack.icon}</span>
                  <div className="text-left">
                    <h4 className="text-xs font-black text-purple-300">{pack.name}</h4>
                    <p className="text-[10px] text-slate-400 leading-tight">{pack.desc}</p>
                  </div>
                </div>

                {isSold ? (
                  <span className="px-3 py-1 rounded-xl bg-slate-900 text-slate-600 text-xs font-black">
                    AÇILDI
                  </span>
                ) : (
                  <button
                    onClick={() => handleOpenPack(pack)}
                    disabled={!canAfford}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition active:scale-95 flex items-center gap-1 shrink-0 cursor-pointer ${
                      canAfford
                        ? 'bg-purple-500 hover:bg-purple-400 text-slate-950 shadow-md'
                        : 'bg-slate-900 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <Coins size={12} />
                    <span>${pack.cost}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. SHELF 3: VOUCHERS & DESTE İNCELTME (EFSUNLAR & KART SİLME) */}
      <div className="my-2 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-inner space-y-2">
        <div className="flex items-center justify-between text-xs font-black text-cyan-300 border-b border-slate-800 pb-1">
          <span className="flex items-center gap-1">
            <Award size={13} className="text-cyan-400" />
            3. RAF: EFSUNLAR & DESTE İNCELTME (VOUCHERS & REMOVAL)
          </span>
          <span className="text-[10px] text-slate-500 font-mono">1 EFSUN + 1 SİLME</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Active Voucher Slot */}
          <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/50 flex items-center justify-between gap-2 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{activeVoucher.icon}</span>
              <div className="text-left">
                <h4 className="text-xs font-black text-cyan-300">{activeVoucher.name}</h4>
                <p className="text-[10px] text-slate-400 leading-tight">{activeVoucher.desc}</p>
              </div>
            </div>

            {soldItemIds.includes(activeVoucher.id) ? (
              <span className="px-3 py-1 rounded-xl bg-slate-900 text-slate-600 text-xs font-black">
                ALINDI
              </span>
            ) : (
              <button
                onClick={handleBuyVoucher}
                disabled={gold < activeVoucher.cost}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition active:scale-95 flex items-center gap-1 shrink-0 cursor-pointer ${
                  gold >= activeVoucher.cost
                    ? 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-600 cursor-not-allowed'
                }`}
              >
                <Coins size={12} />
                <span>${activeVoucher.cost}</span>
              </button>
            )}
          </div>

          {/* Deck Thinning Slot (Harf Sil) */}
          <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-500/50 flex items-center justify-between gap-2 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🗑️</span>
              <div className="text-left">
                <h4 className="text-xs font-black text-rose-300">Harf Sil / Deste İncelt</h4>
                <p className="text-[10px] text-slate-400 leading-tight">Desteden zayıf 1 kartı yok et ($15).</p>
              </div>
            </div>

            <button
              onClick={() => setShowDeckRemoveModal(true)}
              disabled={gold < 15}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition active:scale-95 flex items-center gap-1 shrink-0 cursor-pointer ${
                gold >= 15
                  ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-md'
                  : 'bg-slate-900 text-slate-600 cursor-not-allowed'
              }`}
            >
              <Coins size={12} />
              <span>$15</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. BALATRO BOTTOM CONTROLS BAR (REROLL & NEXT ROUND) */}
      <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2 shrink-0">
        {/* Reroll Button ($5, $6, $7...) */}
        <button
          onClick={handleRerollClick}
          disabled={gold < rerollCost}
          className={`py-3 px-4 rounded-2xl font-black text-xs tracking-wide flex items-center justify-center gap-1.5 transition active:scale-95 shadow-xl cursor-pointer ${
            gold >= rerollCost
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-amber-950/50'
              : 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed'
          }`}
        >
          <RefreshCw size={15} />
          <span>YENİLE (${rerollCost})</span>
        </button>

        {/* Next Round / Leave Shop Primary Button */}
        <button
          onClick={onLeaveShop}
          className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 transition active:scale-95 shadow-xl shadow-emerald-950/50 border border-emerald-300 cursor-pointer"
        >
          <span>SONRAKİ SINAVA GEÇ</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* INTERACTIVE BOOSTER PACK PICK MODAL */}
      <AnimatePresence>
        {activeBoosterPack && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="w-full max-w-sm bg-gradient-to-b from-purple-950 via-slate-900 to-slate-950 border-2 border-purple-500/80 rounded-3xl p-5 shadow-2xl flex flex-col items-center text-center text-slate-100"
            >
              <span className="text-4xl mb-2">{activeBoosterPack.icon}</span>
              <h3 className="text-lg font-black text-purple-300 font-cinzel">{activeBoosterPack.name}</h3>
              <p className="text-xs text-slate-400 mb-4">{activeBoosterPack.desc}</p>

              <div className="grid grid-cols-3 gap-2 w-full mb-4">
                {activeBoosterPack.options.map((key) => (
                  <button
                    key={key}
                    onClick={() => handleSelectPackOption(key)}
                    className="h-20 rounded-2xl tile-bevel-amber flex flex-col items-center justify-center gap-1 hover:scale-105 transition cursor-pointer shadow-lg"
                  >
                    <span className="text-2xl font-extrabold text-amber-200">{key}</span>
                    <span className="text-[9px] font-bold text-amber-300">SEÇ</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setActiveBoosterPack(null)}
                className="py-2 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
              >
                İptal Et
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DECK REMOVAL SELECTION MODAL */}
      <AnimatePresence>
        {showDeckRemoveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="w-full max-w-md bg-gradient-to-b from-rose-950 via-slate-900 to-slate-950 border-2 border-rose-500/80 rounded-3xl p-5 shadow-2xl flex flex-col items-center text-center text-slate-100"
            >
              <h3 className="text-lg font-black text-rose-300 font-cinzel mb-1">🗑️ DESTE İNCELT (HARF SİL)</h3>
              <p className="text-xs text-slate-400 mb-4">Desteden kalıcı olarak yok etmek istediğin 1 harfi seç ($15):</p>

              <div className="grid grid-cols-4 gap-2 w-full max-h-56 overflow-y-auto mb-4 p-1">
                {fullDeck.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => {
                      if (onRemoveCard) onRemoveCard(card.id, 15);
                      setShowDeckRemoveModal(false);
                    }}
                    className="h-16 rounded-xl tile-bevel-slate flex flex-col items-center justify-center gap-0.5 hover:border-rose-500 transition cursor-pointer"
                  >
                    <span className="text-lg font-extrabold text-slate-200">{card.letter}</span>
                    <span className="text-[9px] text-rose-400 font-bold">YOK ET</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowDeckRemoveModal(false)}
                className="py-2 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
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

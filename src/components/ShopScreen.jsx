import React, { useState } from 'react';
import { ShoppingBag, ArrowUpCircle, Trash2, Sparkles, Check, Coins, X } from 'lucide-react';
import { LETTER_DEFINITIONS, SPECIAL_CARDS, getRarityDetails, getPerkDescription } from '../game/cardData';
import { RELICS } from '../game/relicData';

export function ShopScreen({
  gold,
  fullDeck,
  activeRelicKeys,
  onBuyCard,
  onUpgradeCardPerk,
  onRemoveCard,
  onBuyRelic,
  onLeaveShop
}) {
  const [activeTab, setActiveTab] = useState('BUY_CARDS'); // BUY_CARDS | PERK_UPGRADE | TRIM_DECK | BUY_RELICS

  // Available cards for purchase in shop
  const shopLetterOffers = [
    { key: 'Ş', cost: 35, rarity: 'nadir' },
    { key: 'Ğ', cost: 45, rarity: 'nadir' },
    { key: 'Ç', cost: 35, rarity: 'nadir' },
    { key: 'Z', cost: 60, rarity: 'cok_nadir' },
    { key: 'JOKER', cost: 45, isSpecial: true },
    { key: 'DOUBLE', cost: 50, isSpecial: true }
  ];

  return (
    <div className="flex-1 flex flex-col justify-between p-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 overflow-y-auto">
      {/* Shop Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-md">
            <ShoppingBag size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-amber-300 font-cinzel tracking-wide">DÜKKÂN & ÇARŞI</h2>
            <p className="text-[11px] text-slate-400 font-medium">Harf satın al, perk geliştir veya emanet edin.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-amber-950/80 border border-amber-500/40 px-3 py-1.5 rounded-2xl text-xs font-black text-amber-300 shadow-md">
            <Coins size={14} className="text-amber-400 fill-amber-400" />
            <span>{gold}</span>
          </div>

          <button
            onClick={onLeaveShop}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition active:scale-95"
            title="Dükkandan Çık"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Action Tabs */}
      <div className="grid grid-cols-4 gap-1.5 my-3">
        <button
          onClick={() => setActiveTab('BUY_CARDS')}
          className={`py-2 px-1 rounded-xl border text-[10px] sm:text-xs font-bold transition flex flex-col items-center gap-1 ${
            activeTab === 'BUY_CARDS'
              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          <span>🎴 HARF AL</span>
        </button>

        <button
          onClick={() => setActiveTab('PERK_UPGRADE')}
          className={`py-2 px-1 rounded-xl border text-[10px] sm:text-xs font-bold transition flex flex-col items-center gap-1 ${
            activeTab === 'PERK_UPGRADE'
              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          <span>⬆️ PERK</span>
        </button>

        <button
          onClick={() => setActiveTab('TRIM_DECK')}
          className={`py-2 px-1 rounded-xl border text-[10px] sm:text-xs font-bold transition flex flex-col items-center gap-1 ${
            activeTab === 'TRIM_DECK'
              ? 'bg-rose-500/20 border-rose-400 text-rose-300'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          <span>🗑️ SİL</span>
        </button>

        <button
          onClick={() => setActiveTab('BUY_RELICS')}
          className={`py-2 px-1 rounded-xl border text-[10px] sm:text-xs font-bold transition flex flex-col items-center gap-1 ${
            activeTab === 'BUY_RELICS'
              ? 'bg-purple-500/20 border-purple-400 text-purple-300'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          <span>🔮 EMANET</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto my-2 pr-1">
        {/* BUY CARDS TAB */}
        {activeTab === 'BUY_CARDS' && (
          <div className="grid grid-cols-2 gap-2.5">
            {shopLetterOffers.map((item) => {
              const isSpec = item.isSpecial;
              const spec = SPECIAL_CARDS[item.key];
              const def = LETTER_DEFINITIONS[item.key] || { points: 1, desc: 'Harf' };

              return (
                <div
                  key={item.key}
                  className="p-3 rounded-2xl border border-slate-800 bg-slate-900 flex flex-col items-center justify-between gap-1 shadow"
                >
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {isSpec ? spec.name : getRarityDetails(item.rarity).label}
                  </span>
                  <span className="text-3xl font-extrabold text-amber-300">
                    {isSpec ? spec.letter : item.key}
                  </span>
                  <span className="text-xs text-slate-400">
                    {isSpec ? spec.desc : `${def.points} Puan`}
                  </span>

                  <button
                    onClick={() => onBuyCard(item.key, item.cost)}
                    disabled={gold < item.cost}
                    className="w-full mt-2 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-black text-xs transition"
                  >
                    Satın Al ({item.cost} 💰)
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* PERK UPGRADE TAB */}
        {activeTab === 'PERK_UPGRADE' && (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-slate-400 text-center">Harfini Perk seviyesine yükselt:</p>
            <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
              {fullDeck.filter(c => !c.isSpecial).map((card) => {
                const nextLevel = (card.upgradeLevel || 0) + 1;
                const cost = nextLevel * 25 + 10;
                const perkText = getPerkDescription(nextLevel);

                return (
                  <div
                    key={card.id}
                    className="p-3 rounded-2xl border border-slate-800 bg-slate-900 flex flex-col items-center justify-between gap-1"
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-xl font-bold text-slate-100">{card.letter}</span>
                      <span className="text-xs font-black text-amber-400">
                        ({card.upgradeLevel > 0 ? `${card.letter}+${card.upgradeLevel}` : 'Temel'})
                      </span>
                    </div>

                    <span className="text-[10px] text-emerald-400 font-bold text-center">
                      Sonraki Perk: {perkText}
                    </span>

                    <button
                      onClick={() => onUpgradeCardPerk(card.id, cost)}
                      disabled={gold < cost || card.upgradeLevel >= 3}
                      className="w-full mt-1.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-black text-xs transition"
                    >
                      {card.upgradeLevel >= 3 ? 'MAX SEVİYE' : `Geliştir (${cost} 💰)`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TRIM DECK TAB */}
        {activeTab === 'TRIM_DECK' && (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-slate-400 text-center">Desteden kart silerek desteni incelt (Maliyet: 30 💰):</p>
            <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
              {fullDeck.map((card) => (
                <div
                  key={card.id}
                  className="p-2.5 rounded-2xl border border-slate-800 bg-slate-900 flex flex-col items-center justify-between gap-1"
                >
                  <span className="text-xl font-bold text-slate-100">{card.letter}</span>
                  <span className="text-[10px] text-slate-400">{card.isSpecial ? '★' : `${card.points}pt`}</span>
                  <button
                    onClick={() => onRemoveCard(card.id, 30)}
                    disabled={gold < 30 || fullDeck.length <= 6}
                    className="w-full mt-1 py-1 rounded-xl bg-rose-500 hover:bg-rose-400 disabled:opacity-40 text-slate-950 font-black text-[10px] transition"
                  >
                    Sil (30 💰)
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BUY RELICS TAB */}
        {activeTab === 'BUY_RELICS' && (
          <div className="flex flex-col gap-2.5">
            {Object.values(RELICS).map((relic) => {
              const isOwned = activeRelicKeys.includes(relic.id);
              return (
                <div
                  key={relic.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                    isOwned ? 'border-purple-500/50 bg-purple-950/40' : 'border-slate-800 bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{relic.icon}</span>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-extrabold text-amber-300">{relic.name}</span>
                      <p className="text-[10px] text-slate-400">{relic.desc}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onBuyRelic(relic.id, relic.cost)}
                    disabled={gold < relic.cost || isOwned}
                    className="py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-black text-xs transition shrink-0"
                  >
                    {isOwned ? 'SAHİPSİN' : `${relic.cost} 💰`}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Leave Shop Button */}
      <button
        onClick={onLeaveShop}
        className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 px-4 rounded-2xl transition shadow mt-2 text-xs"
      >
        DÜKKÂNDAN ÇIK VE HARİTAYA DÖN
      </button>
    </div>
  );
}

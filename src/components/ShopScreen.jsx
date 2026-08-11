import React, { useState } from 'react';
import { ShoppingBag, ArrowUpCircle, Trash2, Sparkles, Check, Coins, X, BookOpen, ShieldCheck } from 'lucide-react';
import { LETTER_DEFINITIONS, SPECIAL_CARDS, SEAL_DEFINITIONS, getRarityDetails, getPerkDescription } from '../game/cardData';
import { RELICS } from '../game/relicData';

export function ShopScreen({
  gold,
  fullDeck,
  activeRelicKeys,
  wordTypeLevels = {},
  onBuyCard,
  onUpgradeCardPerk,
  onRemoveCard,
  onBuyRelic,
  onUpgradeWordTypeLevel,
  onLeaveShop
}) {
  const [activeTab, setActiveTab] = useState('BUY_CARDS'); // BUY_CARDS | PERK_UPGRADE | EFSUN_BOOKS | TRIM_DECK | BUY_RELICS

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
            <h2 className="text-lg font-black text-amber-300 font-cinzel tracking-wide">DÜKKÂN & EFSUN ÇARŞISI</h2>
            <p className="text-[11px] text-slate-400 font-medium">Harf al, efsun kitapları okut veya mühür bas!</p>
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
      <div className="grid grid-cols-5 gap-1 my-3">
        <button
          onClick={() => setActiveTab('BUY_CARDS')}
          className={`py-2 px-1 rounded-xl border text-[10px] font-bold transition flex flex-col items-center gap-1 ${
            activeTab === 'BUY_CARDS'
              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          <span>🎴 HARF</span>
        </button>

        <button
          onClick={() => setActiveTab('EFSUN_BOOKS')}
          className={`py-2 px-1 rounded-xl border text-[10px] font-bold transition flex flex-col items-center gap-1 ${
            activeTab === 'EFSUN_BOOKS'
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          <span>📜 EFSUN</span>
        </button>

        <button
          onClick={() => setActiveTab('PERK_UPGRADE')}
          className={`py-2 px-1 rounded-xl border text-[10px] font-bold transition flex flex-col items-center gap-1 ${
            activeTab === 'PERK_UPGRADE'
              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          <span>⬆️ PERK</span>
        </button>

        <button
          onClick={() => setActiveTab('TRIM_DECK')}
          className={`py-2 px-1 rounded-xl border text-[10px] font-bold transition flex flex-col items-center gap-1 ${
            activeTab === 'TRIM_DECK'
              ? 'bg-rose-500/20 border-rose-400 text-rose-300'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          <span>🗑️ SİL</span>
        </button>

        <button
          onClick={() => setActiveTab('BUY_RELICS')}
          className={`py-2 px-1 rounded-xl border text-[10px] font-bold transition flex flex-col items-center gap-1 ${
            activeTab === 'BUY_RELICS'
              ? 'bg-purple-500/20 border-purple-400 text-purple-300'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          <span>🔮 TILSIM</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto my-2 pr-1">
        {/* BUY CARDS TAB */}
        {activeTab === 'BUY_CARDS' && (
          <div className="grid grid-cols-2 gap-2.5">
            {shopLetterOffers.map((item) => {
              const canAfford = gold >= item.cost;
              return (
                <div
                  key={item.key}
                  className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center text-lg font-black text-amber-300">
                      {item.key}
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-200">
                        {item.isSpecial ? SPECIAL_CARDS[item.key]?.name : `${item.key} Harfi`}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {item.isSpecial ? SPECIAL_CARDS[item.key]?.desc : LETTER_DEFINITIONS[item.key]?.desc}
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={!canAfford}
                    onClick={() => onBuyCard(item.key, item.cost)}
                    className={`mt-3 py-2 px-3 rounded-xl border text-xs font-black transition flex items-center justify-between ${
                      canAfford
                        ? 'bg-amber-500/20 border-amber-400 hover:bg-amber-500/30 text-amber-300 cursor-pointer'
                        : 'bg-slate-950/40 border-slate-800 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <span>AL</span>
                    <span className="flex items-center gap-1">
                      <Coins size={12} className="text-amber-400 fill-amber-400" />
                      {item.cost}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* EFSUN BOOKS TAB (Balatro-style Planet Card Equivalent) */}
        {activeTab === 'EFSUN_BOOKS' && (
          <div className="flex flex-col gap-2.5">
            {Object.values(wordTypeLevels).map((book) => {
              const canAfford = gold >= book.cost;
              return (
                <div
                  key={book.id}
                  className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-lg shadow-sm">
                      <BookOpen size={20} className="text-cyan-300" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-cyan-200 flex items-center gap-2">
                        <span>{book.name}</span>
                        <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-700/60">
                          Seviye {book.level}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold mt-0.5">
                        Efekt: +{book.level * book.bonusChips} Taban Puan | +{book.level * book.bonusMult} Taban Çarpan
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={!canAfford}
                    onClick={() => onUpgradeWordTypeLevel && onUpgradeWordTypeLevel(book.id)}
                    className={`py-2 px-3 rounded-xl border text-xs font-black transition flex items-center gap-1.5 ${
                      canAfford
                        ? 'bg-cyan-500/20 border-cyan-400 hover:bg-cyan-500/30 text-cyan-300 cursor-pointer'
                        : 'bg-slate-950/40 border-slate-800 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <span>OKU</span>
                    <span className="flex items-center gap-0.5">
                      <Coins size={12} className="text-amber-400 fill-amber-400" />
                      {book.cost}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* PERK UPGRADE TAB */}
        {activeTab === 'PERK_UPGRADE' && (
          <div className="flex flex-col gap-2">
            {fullDeck.map((card) => {
              const nextLevel = (card.upgradeLevel || 0) + 1;
              const cost = 20 * nextLevel;
              const canAfford = gold >= cost && nextLevel <= 3;

              return (
                <div
                  key={card.id}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-700 flex items-center justify-center font-black text-amber-300 text-sm">
                      {card.letter}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200">
                        {card.letter} (Seviye {card.upgradeLevel || 0})
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {getPerkDescription(card.upgradeLevel || 0)} ➔ {getPerkDescription(nextLevel)}
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={!canAfford || nextLevel > 3}
                    onClick={() => onUpgradeCardPerk(card.id, cost)}
                    className={`py-1.5 px-3 rounded-xl border text-xs font-black transition flex items-center gap-1 ${
                      nextLevel > 3
                        ? 'bg-emerald-950 border-emerald-700 text-emerald-400 cursor-default'
                        : canAfford
                        ? 'bg-emerald-500/20 border-emerald-400 hover:bg-emerald-500/30 text-emerald-300 cursor-pointer'
                        : 'bg-slate-950/40 border-slate-800 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    {nextLevel > 3 ? (
                      <span>MAKS</span>
                    ) : (
                      <>
                        <span>YÜKSELT</span>
                        <span className="flex items-center gap-0.5">
                          <Coins size={12} className="text-amber-400 fill-amber-400" />
                          {cost}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* TRIM DECK TAB */}
        {activeTab === 'TRIM_DECK' && (
          <div className="flex flex-col gap-2">
            {fullDeck.map((card) => {
              const cost = 25;
              const canAfford = gold >= cost && fullDeck.length > 8;

              return (
                <div
                  key={card.id}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-700 flex items-center justify-center font-black text-rose-300 text-sm">
                      {card.letter}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200">{card.letter} Harfi</div>
                      <div className="text-[10px] text-slate-400">Destenden kalıcı olarak sil</div>
                    </div>
                  </div>

                  <button
                    disabled={!canAfford}
                    onClick={() => onRemoveCard(card.id, cost)}
                    className={`py-1.5 px-3 rounded-xl border text-xs font-black transition flex items-center gap-1 ${
                      canAfford
                        ? 'bg-rose-500/20 border-rose-400 hover:bg-rose-500/30 text-rose-300 cursor-pointer'
                        : 'bg-slate-950/40 border-slate-800 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <Trash2 size={12} />
                    <span>SİL</span>
                    <span className="flex items-center gap-0.5">
                      <Coins size={12} className="text-amber-400 fill-amber-400" />
                      {cost}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* BUY RELICS TAB */}
        {activeTab === 'BUY_RELICS' && (
          <div className="grid grid-cols-1 gap-2.5">
            {Object.values(RELICS).map((relic) => {
              const isOwned = activeRelicKeys.includes(relic.id);
              const canAfford = gold >= relic.cost && !isOwned;

              return (
                <div
                  key={relic.id}
                  className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/50 flex items-center justify-center text-xl">
                      {relic.icon}
                    </div>
                    <div>
                      <div className="text-xs font-black text-purple-200">{relic.name}</div>
                      <div className="text-[10px] text-slate-400">{relic.desc}</div>
                    </div>
                  </div>

                  <button
                    disabled={!canAfford || isOwned}
                    onClick={() => onBuyRelic(relic.id, relic.cost)}
                    className={`py-2 px-3 rounded-xl border text-xs font-black transition flex items-center gap-1 ${
                      isOwned
                        ? 'bg-purple-950 border-purple-800 text-purple-400 cursor-default'
                        : canAfford
                        ? 'bg-purple-500/20 border-purple-400 hover:bg-purple-500/30 text-purple-300 cursor-pointer'
                        : 'bg-slate-950/40 border-slate-800 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    {isOwned ? (
                      <span>SAHİPSİN</span>
                    ) : (
                      <>
                        <span>EDİN</span>
                        <span className="flex items-center gap-0.5">
                          <Coins size={12} className="text-amber-400 fill-amber-400" />
                          {relic.cost}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-800/80 shrink-0">
        <button
          onClick={onLeaveShop}
          className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black py-3 px-4 rounded-xl transition shadow-lg text-xs tracking-wide cursor-pointer"
        >
          DÜKKÂNDAN ÇIK VE YOLUNA DEVAM ET
        </button>
      </div>
    </div>
  );
}

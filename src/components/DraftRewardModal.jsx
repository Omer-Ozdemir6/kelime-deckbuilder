import React, { useState } from 'react';
import { PlusCircle, ArrowUpCircle, Trash2, Check, Sparkles } from 'lucide-react';
import { LETTER_DEFINITIONS, SPECIAL_CARDS, getRarityDetails } from '../game/cardData';

export function DraftRewardModal({
  stage,
  fullDeck,
  onAddCard,
  onUpgradeCard,
  onRemoveCard
}) {
  const [activeTab, setActiveTab] = useState('ADD'); // ADD | UPGRADE | REMOVE

  // Generate 3 random card options for ADD tab (mix of Normal, Rare, Very Rare, & Special)
  const [addOptions] = useState(() => {
    const keys = Object.keys(LETTER_DEFINITIONS);
    const specKeys = Object.keys(SPECIAL_CARDS);
    
    // Pick 3 distinct options
    const picks = [];
    while (picks.length < 3) {
      const isSpecialRoll = Math.random() < 0.25;
      if (isSpecialRoll) {
        const spec = specKeys[Math.floor(Math.random() * specKeys.length)];
        if (!picks.includes(spec)) picks.push(spec);
      } else {
        const l = keys[Math.floor(Math.random() * keys.length)];
        if (!picks.includes(l)) picks.push(l);
      }
    }
    return picks;
  });

  const [selectedAddOption, setSelectedAddOption] = useState(null);
  const [selectedUpgradeCardId, setSelectedUpgradeCardId] = useState(null);
  const [selectedRemoveCardId, setSelectedRemoveCardId] = useState(null);

  const handleConfirm = () => {
    if (activeTab === 'ADD' && selectedAddOption) {
      onAddCard(selectedAddOption);
    } else if (activeTab === 'UPGRADE' && selectedUpgradeCardId) {
      onUpgradeCard(selectedUpgradeCardId);
    } else if (activeTab === 'REMOVE' && selectedRemoveCardId) {
      onRemoveCard(selectedRemoveCardId);
    }
  };

  return (
    <div className="absolute inset-0 bg-slate-950/95 z-50 flex flex-col p-4 backdrop-blur-md animate-fade-in overflow-hidden">
      {/* Stage Cleared Header */}
      <div className="text-center my-3 shrink-0">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-400 text-xs font-bold mb-1">
          <Sparkles size={14} />
          <span>KADEME {stage - 1} TAMAMLAMDI</span>
        </div>
        <h2 className="text-xl font-extrabold text-amber-300">DESTENİ GELİŞTİR</h2>
        <p className="text-xs text-slate-400 mt-0.5">Desteni güçlendirmek için bir seçenek seç.</p>
      </div>

      {/* 3 Main Deckbuilder Action Tabs */}
      <div className="grid grid-cols-3 gap-2 my-2 shrink-0">
        <button
          onClick={() => setActiveTab('ADD')}
          className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs font-bold transition ${
            activeTab === 'ADD'
              ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md shadow-amber-950'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
          }`}
        >
          <PlusCircle size={20} className={activeTab === 'ADD' ? 'text-amber-400' : 'text-slate-500'} />
          <span>➕ EKLE</span>
        </button>

        <button
          onClick={() => setActiveTab('UPGRADE')}
          className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs font-bold transition ${
            activeTab === 'UPGRADE'
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
          }`}
        >
          <ArrowUpCircle size={20} className={activeTab === 'UPGRADE' ? 'text-emerald-400' : 'text-slate-500'} />
          <span>⬆️ GELİŞTİR</span>
        </button>

        <button
          onClick={() => setActiveTab('REMOVE')}
          className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs font-bold transition ${
            activeTab === 'REMOVE'
              ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-md shadow-rose-950'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
          }`}
        >
          <Trash2 size={20} className={activeTab === 'REMOVE' ? 'text-rose-400' : 'text-slate-500'} />
          <span>🗑️ ÇIKAR</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 flex flex-col justify-between my-2 overflow-y-auto overflow-x-hidden p-1 scrollbar-thin">
        {/* ADD TAB */}
        {activeTab === 'ADD' && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-slate-400 text-center">Destene yeni bir harf veya özel kart ekle:</p>
            <div className="grid grid-cols-3 gap-2">
              {addOptions.map((optKey) => {
                const isSpec = !!SPECIAL_CARDS[optKey];
                const spec = SPECIAL_CARDS[optKey];
                const def = LETTER_DEFINITIONS[optKey] || { points: 1, rarity: 'normal', desc: 'Harf' };
                const isSelected = selectedAddOption === optKey;
                const rarity = getRarityDetails(isSpec ? spec.rarity : def.rarity);

                return (
                  <button
                    key={optKey}
                    onClick={() => setSelectedAddOption(optKey)}
                    className={`flex flex-col items-center justify-between p-2.5 rounded-2xl border-2 transition-all cursor-pointer relative min-h-[130px] ${
                      isSelected
                        ? 'border-amber-400 ring-2 ring-amber-400 bg-amber-950/50 shadow-lg'
                        : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {isSpec ? 'ÖZEL' : rarity.label}
                    </span>

                    <span className="text-3xl font-extrabold text-amber-300">
                      {isSpec ? spec.letter : optKey}
                    </span>

                    <span className="text-xs font-black text-amber-400">
                      {isSpec ? '★' : `${def.points} Puan`}
                    </span>

                    <p className="text-[9px] text-slate-400 text-center mt-1">
                      {isSpec ? spec.name : def.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* UPGRADE TAB */}
        {activeTab === 'UPGRADE' && (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-slate-400 text-center">Geliştirmek istediğin kartı seç (Puanı +2 artar):</p>
            <div className="grid grid-cols-4 gap-2 max-h-[280px] overflow-y-auto p-1">
              {fullDeck.filter(c => !c.isSpecial).map((card) => {
                const isSelected = selectedUpgradeCardId === card.id;
                return (
                  <button
                    key={card.id}
                    onClick={() => setSelectedUpgradeCardId(card.id)}
                    className={`p-2 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition ${
                      isSelected
                        ? 'border-emerald-400 ring-2 ring-emerald-400 bg-emerald-950/60 shadow-lg'
                        : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xl font-bold text-slate-100">{card.letter}</span>
                    <span className="text-[10px] text-emerald-400 font-extrabold">
                      {card.points}pt → {card.points + 2}pt
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* REMOVE TAB */}
        {activeTab === 'REMOVE' && (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-slate-400 text-center">Desteden tamamen çıkarılacak harfi seç:</p>
            <div className="grid grid-cols-4 gap-2 max-h-[280px] overflow-y-auto p-1">
              {fullDeck.map((card) => {
                const isSelected = selectedRemoveCardId === card.id;
                return (
                  <button
                    key={card.id}
                    onClick={() => setSelectedRemoveCardId(card.id)}
                    className={`p-2 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition ${
                      isSelected
                        ? 'border-rose-500 ring-2 ring-rose-500 bg-rose-950/60 shadow-lg'
                        : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xl font-bold text-slate-100">{card.letter}</span>
                    <span className="text-[10px] text-slate-400">{card.isSpecial ? '★' : `${card.points}pt`}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Confirm Selection Button */}
      <button
        onClick={handleConfirm}
        disabled={
          (activeTab === 'ADD' && !selectedAddOption) ||
          (activeTab === 'UPGRADE' && !selectedUpgradeCardId) ||
          (activeTab === 'REMOVE' && !selectedRemoveCardId)
        }
        className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-40 text-slate-950 font-extrabold py-3.5 px-4 rounded-2xl transition flex items-center justify-center gap-2 shadow-lg active:scale-95 text-sm mt-3"
      >
        <Check size={18} />
        <span>SEÇİMİ ONAYLA VE DEVAM ET</span>
      </button>
    </div>
  );
}

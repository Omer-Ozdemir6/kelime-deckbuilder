import React from 'react';
import { X, Layers, Sparkles } from 'lucide-react';
import { getRarityDetails } from '../game/cardData';

export function DeckInspectorModal({ fullDeck, onClose }) {
  // Sort cards by letter
  const sortedCards = [...fullDeck].sort((a, b) => a.letter.localeCompare(b.letter, 'tr'));

  // Calculate deck statistics
  const totalCards = fullDeck.length;
  const avgPoints = (fullDeck.reduce((acc, c) => acc + (c.points || 0), 0) / (totalCards || 1)).toFixed(1);

  return (
    <div className="absolute inset-0 bg-slate-950/95 z-50 flex flex-col p-4 backdrop-blur-md animate-fade-in overflow-hidden">
      {/* Modal Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Layers className="text-amber-400" size={20} />
          <h2 className="text-lg font-extrabold text-slate-100">DESTEYİ İNCELE</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
        >
          <X size={18} />
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 gap-2 bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 mb-3 text-xs">
        <div className="flex flex-col items-center border-r border-slate-800">
          <span className="text-slate-400 font-medium">Toplam Kart Sayısı</span>
          <span className="text-base font-extrabold text-amber-400">{totalCards} Kart</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-slate-400 font-medium">Ortalama Kart Puanı</span>
          <span className="text-base font-extrabold text-emerald-400">{avgPoints} Puan</span>
        </div>
      </div>

      {/* Deck Grid */}
      <div className="flex-1 overflow-y-auto grid grid-cols-4 gap-2 pr-1">
        {sortedCards.map((card, idx) => {
          const rarity = getRarityDetails(card.rarity);
          return (
            <div
              key={`${card.id}_inspect_${idx}`}
              className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 flex flex-col items-center justify-between gap-1 shadow relative"
            >
              {card.upgradeLevel > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] flex items-center justify-center">
                  +{card.upgradeLevel}
                </div>
              )}
              <span className="text-[9px] font-bold text-slate-400 uppercase">
                {card.isSpecial ? 'ÖZEL' : rarity.label}
              </span>
              <span className="text-2xl font-black text-amber-300">{card.letter}</span>
              <span className="text-[10px] font-bold text-amber-400/90">
                {card.isSpecial ? '★' : `${card.points}pt`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

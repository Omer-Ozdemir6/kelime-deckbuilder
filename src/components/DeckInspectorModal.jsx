import React, { useState } from 'react';
import { X, Layers, Sparkles, PieChart, Percent, Activity } from 'lucide-react';
import { getRarityDetails } from '../game/cardData';
import { RunicCardFrame } from './RunicCardFrame';
import { JokerCardIllustration } from './JokerCardIllustration';

export function DeckInspectorModal({ fullDeck = [], onClose }) {
  const [tab, setTab] = useState('DECK'); // 'DECK' | 'STATS'

  // Sort cards by letter
  const sortedCards = [...fullDeck].sort((a, b) => a.letter.localeCompare(b.letter, 'tr'));

  // Calculate deck statistics
  const totalCards = fullDeck.length || 1;
  const avgPoints = (fullDeck.reduce((acc, c) => acc + (c.points || 0), 0) / totalCards).toFixed(1);

  const vowels = ['A', 'E', 'I', 'İ', 'O', 'Ö', 'U', 'Ü'];
  const rareLetters = ['J', 'Z', 'Ğ', 'Ç', 'Ö', 'Ü', 'Ş'];

  const vowelCount = fullDeck.filter(c => vowels.includes(c.letter)).length;
  const consonantCount = fullDeck.filter(c => !vowels.includes(c.letter) && !c.isSpecial).length;
  const rareCount = fullDeck.filter(c => rareLetters.includes(c.letter)).length;
  const specialCount = fullDeck.filter(c => c.isSpecial).length;
  const glassCount = fullDeck.filter(c => c.seal === 'GLASS').length;
  const steelCount = fullDeck.filter(c => c.seal === 'STEEL').length;
  const stoneCount = fullDeck.filter(c => c.seal === 'STONE').length;
  const sealedCount = fullDeck.filter(c => c.seal).length;

  return (
    <div className="fixed inset-0 bg-slate-950/95 z-[350] flex flex-col p-4 sm:p-6 backdrop-blur-md animate-fade-in overflow-hidden select-none">
      {/* Modal Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Layers className="text-amber-400" size={20} />
          <h2 className="text-base sm:text-lg font-extrabold text-slate-100 font-cinzel">DESTE & CANLI İSTATİSTİK İNSPEKTÖRÜ</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => setTab('DECK')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition cursor-pointer border ${
            tab === 'DECK'
              ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          🎴 DESTE KARTLARI ({totalCards})
        </button>

        <button
          onClick={() => setTab('STATS')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 border ${
            tab === 'STATS'
              ? 'bg-purple-500 text-white border-purple-300 shadow-md'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          <PieChart size={14} />
          <span>📊 OLASILIK & İSTATİSTİK ENGINE</span>
        </button>
      </div>

      {/* TAB 1: DECK LIST */}
      {tab === 'DECK' && (
        <>
          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 mb-3 text-xs">
            <div className="flex flex-col items-center border-r border-slate-800">
              <span className="text-slate-400 font-medium text-[11px]">Toplam Kart Sayısı</span>
              <span className="text-base font-extrabold text-amber-400">{totalCards} Kart</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-slate-400 font-medium text-[11px]">Ortalama Harf Puanı</span>
              <span className="text-base font-extrabold text-emerald-400">{avgPoints} Puan</span>
            </div>
          </div>

          {/* Deck Grid */}
          <div className="flex-1 overflow-y-auto grid grid-cols-4 sm:grid-cols-6 gap-2 pr-1">
            {sortedCards.map((card, idx) => {
              const rarity = getRarityDetails(card.rarity);
              return (
                <div
                  key={`${card.id}_inspect_${idx}`}
                  className="p-2.5 rounded-2xl border border-slate-800 bg-slate-900 flex flex-col items-center justify-between gap-1 shadow relative overflow-hidden min-h-[90px]"
                >
                  <RunicCardFrame rarity={card.isSpecial ? 'joker' : (card.rarity === 'efsanevi' ? 'legendary' : 'common')} />
                  {card.upgradeLevel > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] flex items-center justify-center shadow z-20">
                      +{card.upgradeLevel}
                    </div>
                  )}
                  <span className="text-[9px] font-bold text-slate-400 uppercase truncate w-full text-center z-10">
                    {card.isSpecial ? 'ÖZEL' : rarity.label}
                  </span>
                  {card.isSpecial || card.type === 'joker' ? (
                    <JokerCardIllustration cardId={card.id} type={card.specialType || 'joker'} className="w-8 h-8 z-10" />
                  ) : (
                    <span className="text-2xl font-black text-amber-300 font-cinzel z-10">{card.letter}</span>
                  )}
                  <span className="text-[10px] font-bold text-amber-400/90 z-10">
                    {card.isSpecial ? '★' : `${card.points}pt`}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}


      {/* TAB 2: PROBABILITY & STATS */}
      {tab === 'STATS' && (
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-left">
          {/* Card Category Distribution */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <h4 className="text-xs font-black text-amber-300 flex items-center gap-1.5">
              <Activity size={14} className="text-amber-400" />
              <span>Deste Kart Dağılımı:</span>
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">🗣️ Sesli Harfler:</span>
                <strong className="text-sky-300">{vowelCount} (%{((vowelCount/totalCards)*100).toFixed(0)})</strong>
              </div>
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">🔤 Ünsüz Harfler:</span>
                <strong className="text-teal-300">{consonantCount} (%{((consonantCount/totalCards)*100).toFixed(0)})</strong>
              </div>
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">🌟 Nadir Harfler (J,Z,Ğ...):</span>
                <strong className="text-amber-300">{rareCount} (%{((rareCount/totalCards)*100).toFixed(0)})</strong>
              </div>
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">🃏 Özel Joker Taşlar:</span>
                <strong className="text-pink-300">{specialCount} (%{((specialCount/totalCards)*100).toFixed(0)})</strong>
              </div>
            </div>
          </div>

          {/* Live Seal & Probability Rates */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <h4 className="text-xs font-black text-purple-300 flex items-center gap-1.5">
              <Percent size={14} className="text-purple-400" />
              <span>Canlı Olasılık & Şans Oranları Engine:</span>
            </h4>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="p-2 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex justify-between items-center">
                <span>🥃 Cam Taş Kırılma İhtimali (%25 x2.0 Çarpan):</span>
                <span className="font-mono font-bold text-cyan-300">1 in 4 (%25.0) [{glassCount} Taş]</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span>🛡️ Çelik Taş Elde Tutma Bonusu (x1.5 Çarpan):</span>
                <span className="font-mono font-bold text-slate-200">Aktif [{steelCount} Taş]</span>
              </div>
              <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex justify-between items-center">
                <span>🎲 Şanslı Efsunlu Taş Altın Şansı:</span>
                <span className="font-mono font-bold text-emerald-300">1 in 5 (%20.0)</span>
              </div>
              <div className="p-2 rounded-xl bg-pink-950/40 border border-pink-500/40 flex justify-between items-center">
                <span>✨ Toplam Mühürlü Taş Oranı:</span>
                <span className="font-mono font-bold text-pink-300">%{((sealedCount/totalCards)*100).toFixed(0)} ({sealedCount}/{totalCards})</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

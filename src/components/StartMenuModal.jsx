import React, { useState } from 'react';
import { Play, Star, Lock, Sparkles, Trophy, BookOpen, Layers } from 'lucide-react';
import { STARTER_DECKS, LETTER_DEFINITIONS, SPECIAL_CARDS } from '../game/cardData';
import { RELICS } from '../game/relicData';
import { getDictionarySize } from '../data/turkishWords';

export function StartMenuModal({
  starPoints,
  highScore,
  unlockedDecks,
  selectedDeckId,
  onSelectDeck,
  onUnlockDeck,
  onStartRun
}) {
  const [activeTab, setActiveTab] = useState('DECKS'); // DECKS | COLLECTION

  return (
    <div className="absolute inset-0 bg-slate-950/95 z-50 flex flex-col justify-between p-4 backdrop-blur-md overflow-y-auto">
      {/* Title & Banner */}
      <div className="flex flex-col items-center text-center mt-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 flex items-center justify-center text-2xl font-black text-slate-950 shadow-xl shadow-amber-500/20 mb-2 border-2 border-yellow-200">
          🃏
        </div>

        <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
          KELİME DESTESİ
        </h1>
        <p className="text-[11px] text-slate-400 font-medium">
          Türkçe Harf Roguelite Deckbuilder
        </p>

        {/* Stats Row */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-1.5 bg-amber-950/40 border border-amber-800/50 px-3 py-1 rounded-full text-xs font-bold text-amber-300">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span>{starPoints} Yıldız</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-xs font-bold text-emerald-400">
            <Trophy size={13} />
            <span>En Yüksek: {highScore}</span>
          </div>
        </div>
      </div>

      {/* Main Menu Navigation Tabs */}
      <div className="grid grid-cols-2 gap-2 my-3">
        <button
          onClick={() => setActiveTab('DECKS')}
          className={`py-2 rounded-xl font-extrabold text-xs transition border flex items-center justify-center gap-1.5 ${
            activeTab === 'DECKS'
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          <Layers size={14} />
          <span>BAŞLANGIÇ DESTELERİ</span>
        </button>

        <button
          onClick={() => setActiveTab('COLLECTION')}
          className={`py-2 rounded-xl font-extrabold text-xs transition border flex items-center justify-center gap-1.5 ${
            activeTab === 'COLLECTION'
              ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          <BookOpen size={14} />
          <span>KOLEKSİYON (ANSİKLOPEDİ)</span>
        </button>
      </div>

      {/* TAB 1: STARTER DECKS */}
      {activeTab === 'DECKS' && (
        <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 px-1">
            <span>DESTE SEÇİMİ</span>
            <span className="text-[10px] text-slate-500 font-normal">Sözlük: {getDictionarySize()}+ Kelime</span>
          </div>

          {STARTER_DECKS.map((deck) => {
            const isUnlocked = unlockedDecks.includes(deck.id);
            const isSelected = selectedDeckId === deck.id;

            return (
              <div
                key={deck.id}
                onClick={() => {
                  if (isUnlocked) onSelectDeck(deck.id);
                }}
                className={`p-3 rounded-2xl border-2 transition flex items-center justify-between cursor-pointer ${
                  isSelected && isUnlocked
                    ? 'border-amber-400 bg-amber-950/40 shadow-lg'
                    : isUnlocked
                    ? 'border-slate-800 bg-slate-900/90 hover:border-slate-700'
                    : 'border-slate-800 bg-slate-950/60 opacity-75'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{deck.icon}</span>
                  <div className="flex flex-col text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-extrabold text-slate-100">{deck.name}</span>
                      {!isUnlocked && (
                        <span className="px-1.5 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-300 text-[10px] font-bold">
                          KİLİTLİ
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{deck.desc}</p>
                  </div>
                </div>

                {!isUnlocked && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUnlockDeck(deck.id, deck.unlockCost);
                    }}
                    disabled={starPoints < deck.unlockCost}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-black text-xs transition shadow shrink-0"
                  >
                    <Lock size={12} />
                    <span>{deck.unlockCost} Yıldız</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: COLLECTION / ENCYCLOPEDIA */}
      {activeTab === 'COLLECTION' && (
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
          {/* Section A: Emanetler (Relics) */}
          <div>
            <h3 className="text-xs font-black text-purple-300 uppercase tracking-wider mb-1.5">🔮 EMANETLER (RELICS)</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(RELICS).map((rel) => (
                <div key={rel.id} className="p-2.5 rounded-xl bg-slate-900 border border-purple-900/60 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-200">
                    <span>{rel.icon}</span>
                    <span>{rel.name}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">{rel.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section B: Nadir Türkçe Harfler */}
          <div>
            <h3 className="text-xs font-black text-amber-300 uppercase tracking-wider mb-1.5">💎 TÜRKÇE HARFLER VE PUANLARI</h3>
            <div className="grid grid-cols-4 gap-1.5">
              {Object.entries(LETTER_DEFINITIONS).map(([letter, def]) => (
                <div key={letter} className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center">
                  <span className="text-base font-black text-amber-300">{letter}</span>
                  <span className="text-[10px] text-slate-400 font-bold">{def.points} Puan</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Start Button */}
      <button
        onClick={() => onStartRun(selectedDeckId)}
        className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black py-3.5 px-6 rounded-2xl transition flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 active:scale-95 text-base tracking-wide mt-2"
      >
        <Play size={20} className="fill-slate-950" />
        <span>OYUNA BAŞLA</span>
      </button>
    </div>
  );
}


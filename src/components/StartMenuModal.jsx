import React from 'react';
import { Play, Star, Lock, Sparkles, Trophy, BookOpen } from 'lucide-react';
import { STARTER_DECKS } from '../game/cardData';
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
  return (
    <div className="absolute inset-0 bg-slate-950/95 z-50 flex flex-col justify-between p-5 backdrop-blur-md overflow-y-auto">
      {/* Title & Banner */}
      <div className="flex flex-col items-center text-center mt-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 flex items-center justify-center text-3xl font-black text-slate-950 shadow-xl shadow-amber-500/20 mb-3 border-2 border-yellow-200 animate-float">
          🃏
        </div>

        <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
          KELİME DESTESİ
        </h1>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Türkçe Harf Roguelite Deckbuilder
        </p>

        {/* Stats Row */}
        <div className="flex items-center gap-3 mt-4">
          <div className="flex items-center gap-1.5 bg-amber-950/40 border border-amber-800/50 px-3 py-1.5 rounded-full text-xs font-bold text-amber-300">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            <span>{starPoints} Yıldız</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-400">
            <Trophy size={14} />
            <span>En Yüksek: {highScore}</span>
          </div>
        </div>
      </div>

      {/* Starter Deck Selection */}
      <div className="flex flex-col gap-2.5 my-4">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300 px-1">
          <span>BAŞLANGIÇ DESTESİ SEÇ</span>
          <span className="text-[10px] text-slate-500 font-normal">Sözlük: {getDictionarySize()}+ Kelime</span>
        </div>

        <div className="flex flex-col gap-2">
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
      </div>

      {/* Start Button */}
      <button
        onClick={() => onStartRun(selectedDeckId)}
        className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black py-4 px-6 rounded-2xl transition flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 active:scale-95 text-base tracking-wide my-2"
      >
        <Play size={22} className="fill-slate-950" />
        <span>OYUNA BAŞLA</span>
      </button>
    </div>
  );
}

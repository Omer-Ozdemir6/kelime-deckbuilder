import React, { useState } from 'react';
import { Play, Star, Lock, Sparkles, Trophy, BookOpen, Layers, Settings, RotateCcw, Volume2, VolumeX, ShieldCheck, X } from 'lucide-react';
import { STARTER_DECKS, LETTER_DEFINITIONS } from '../game/cardData';
import { RELICS } from '../game/relicData';
import { getDictionarySize } from '../data/turkishWords';

export function StartMenuModal({
  starPoints,
  highScore,
  unlockedDecks,
  selectedDeckId,
  hasActiveRun = false,
  onSelectDeck,
  onUnlockDeck,
  onStartRun,
  onResumeRun
}) {
  const [activeModal, setActiveModal] = useState(null); // null | 'DECKS' | 'COLLECTION' | 'SETTINGS'
  const [soundEnabled, setSoundEnabled] = useState(true);

  const selectedDeck = STARTER_DECKS.find(d => d.id === selectedDeckId) || STARTER_DECKS[0];

  return (
    <div className="absolute inset-0 bg-[#050714]/95 z-50 flex flex-col justify-between p-5 backdrop-blur-xl overflow-y-auto relative">
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />

      {/* Top Logo & Title */}
      <div className="flex flex-col items-center text-center mt-3 relative z-10">
        <div className="w-18 h-18 rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 flex items-center justify-center text-3xl font-black text-slate-950 shadow-2xl shadow-amber-500/40 mb-3 border-2 border-yellow-200 animate-pulse-glow">
          🃏
        </div>

        <h1 className="text-4xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 font-cinzel">
          KELİME DESTESİ
        </h1>
        <p className="text-xs text-amber-200/80 font-bold mt-1 tracking-widest uppercase">
          Türkçe Harf Roguelite Deckbuilder
        </p>

        {/* Dictionary Badge */}
        <div className="mt-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-[10px] font-black text-amber-300 flex items-center gap-1.5 shadow-sm">
          <span>📖</span>
          <span>{getDictionarySize().toLocaleString('tr-TR')} RESMİ TDK KELİME DAHİL</span>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-3 mt-4">
          <div className="flex items-center gap-1.5 bg-amber-950/80 border border-amber-500/40 px-3.5 py-1.5 rounded-2xl text-xs font-black text-amber-300 shadow-md">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            <span>{starPoints} Yıldız</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-emerald-500/40 px-3.5 py-1.5 rounded-2xl text-xs font-black text-emerald-400 shadow-md">
            <Trophy size={14} className="text-emerald-400" />
            <span>En Yüksek: {highScore}</span>
          </div>
        </div>
      </div>

      {/* Main Menu Action Buttons */}
      <div className="w-full max-w-sm mx-auto flex flex-col gap-3 my-4 relative z-10">
        {/* 1. DEVAM ET (If run in progress) */}
        {hasActiveRun && (
          <button
            onClick={onResumeRun}
            className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-black text-sm transition flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/50 active:scale-95 border border-emerald-400/50"
          >
            <RotateCcw size={18} />
            <span>DEVAM ET (KALDIIĞIN YERDEN)</span>
          </button>
        )}

        {/* 2. YENİ RUN BAŞLAT */}
        <button
          onClick={() => onStartRun(selectedDeckId)}
          className="w-full py-4.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-base transition flex items-center justify-center gap-2 shadow-2xl shadow-amber-500/30 active:scale-95 tracking-wider border border-amber-300 animate-pulse-glow"
        >
          <Play size={22} className="fill-slate-950" />
          <span>YENİ RUN BAŞLAT</span>
        </button>

        {/* Selected Deck Summary Info */}
        <div className="text-xs text-amber-300 bg-slate-900/90 border border-amber-500/40 px-3.5 py-2 rounded-2xl flex items-center justify-between shadow-md">
          <span className="flex items-center gap-2 font-black">
            <span className="text-base">{selectedDeck.icon}</span>
            <span>Deste: {selectedDeck.name}</span>
          </span>
          <button
            onClick={() => setActiveModal('DECKS')}
            className="text-[10px] font-black text-amber-400 hover:underline uppercase bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40"
          >
            Değiştir
          </button>
        </div>

        {/* 3. DESTELER VE KİLİTLER */}
        <button
          onClick={() => setActiveModal('DECKS')}
          className="w-full py-3.5 px-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-bold text-xs transition flex items-center justify-between shadow-md active:scale-95"
        >
          <div className="flex items-center gap-2 font-extrabold">
            <Layers size={16} className="text-amber-400" />
            <span>DESTELER VE KİLİTLER</span>
          </div>
          <span className="text-[10px] font-black text-amber-300 bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800">
            {unlockedDecks.length} / {STARTER_DECKS.length} Açık
          </span>
        </button>

        {/* 4. ANANSİ / ANLAM KOLEKSİYONU & EMANETLER */}
        <button
          onClick={() => setActiveModal('COLLECTION')}
          className="w-full py-3.5 px-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-bold text-xs transition flex items-center justify-between shadow-md active:scale-95"
        >
          <div className="flex items-center gap-2 font-extrabold">
            <BookOpen size={16} className="text-cyan-400" />
            <span>EMANETLER & ANLAM KOLEKSİYONU</span>
          </div>
          <span className="text-[10px] font-black text-cyan-300 bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800">
            {Object.keys(RELICS).length} Emanet
          </span>
        </button>
      </div>

      {/* Footer Info */}
      <div className="text-center text-[10px] text-slate-500 font-semibold relative z-10 pt-2 border-t border-slate-800/60">
        Kelime Destesi v2.0 • TDK Entegreli Türkçe Harf Roguelite
      </div>

      {/* MODAL: DECKS SELECTION */}
      {activeModal === 'DECKS' && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-amber-400 font-black text-base font-cinzel">
              <Layers size={20} />
              <span>BAŞLANGIÇ DESTELERİ</span>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 my-3 overflow-y-auto space-y-3 pr-1">
            {STARTER_DECKS.map(deck => {
              const isUnlocked = unlockedDecks.includes(deck.id);
              const isSelected = selectedDeckId === deck.id;

              return (
                <div
                  key={deck.id}
                  className={`p-4 rounded-2xl border-2 transition flex flex-col gap-2 relative ${
                    isSelected
                      ? 'bg-amber-950/70 border-amber-400 shadow-lg shadow-amber-950/60'
                      : isUnlocked
                      ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-950/50 border-slate-900 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{deck.icon}</span>
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-100">{deck.name}</h3>
                        <p className="text-[11px] text-slate-400 font-medium">{deck.description}</p>
                      </div>
                    </div>

                    {isUnlocked ? (
                      <button
                        onClick={() => {
                          onSelectDeck(deck.id);
                          setActiveModal(null);
                        }}
                        className={`px-3 py-1.5 rounded-xl font-black text-xs transition ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {isSelected ? 'SEÇİLİ' : 'SEÇ'}
                      </button>
                    ) : (
                      <button
                        onClick={() => onUnlockDeck(deck.id, deck.unlockCost)}
                        disabled={starPoints < deck.unlockCost}
                        className={`px-3 py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1 ${
                          starPoints >= deck.unlockCost
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
                            : 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed'
                        }`}
                      >
                        <Lock size={12} />
                        <span>AÇ ({deck.unlockCost} ⭐)</span>
                      </button>
                    )}
                  </div>

                  {/* Letter list preview */}
                  <div className="flex items-center gap-1 flex-wrap pt-1">
                    {deck.letters.map((letObj, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 bg-slate-950 border border-slate-800 rounded font-bold text-[10px] text-amber-300"
                      >
                        {letObj.letter || letObj}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-2xl"
          >
            Tamam
          </button>
        </div>
      )}

      {/* MODAL: RELICS & COLLECTION */}
      {activeModal === 'COLLECTION' && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-cyan-400 font-black text-base font-cinzel">
              <BookOpen size={20} />
              <span>KUTSAL EMANETLER KÜTÜPHANESİ</span>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 my-3 overflow-y-auto space-y-3 pr-1">
            {Object.values(RELICS).map(relic => (
              <div key={relic.id} className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-500/40 text-2xl flex items-center justify-center shrink-0">
                  {relic.icon}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-purple-200">{relic.name}</h4>
                  <p className="text-xs text-slate-400">{relic.description}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-2xl"
          >
            Kapat
          </button>
        </div>
      )}
    </div>
  );
}

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
    <div className="absolute inset-0 bg-slate-950/95 z-50 flex flex-col justify-between p-5 backdrop-blur-md overflow-y-auto">
      {/* Top Logo & Title */}
      <div className="flex flex-col items-center text-center mt-3">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 flex items-center justify-center text-3xl font-black text-slate-950 shadow-2xl shadow-amber-500/30 mb-3 border-2 border-yellow-200 animate-pulse-glow">
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
          <div className="flex items-center gap-1.5 bg-amber-950/50 border border-amber-800/60 px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-300 shadow">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            <span>{starPoints} Yıldız</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-400 shadow">
            <Trophy size={14} />
            <span>En Yüksek: {highScore}</span>
          </div>
        </div>
      </div>

      {/* Main Menu Action Buttons (GDD 32 Structure) */}
      <div className="w-full max-w-sm mx-auto flex flex-col gap-2.5 my-4">
        {/* 1. DEVAM ET (If run in progress) */}
        {hasActiveRun && (
          <button
            onClick={onResumeRun}
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 active:scale-95"
          >
            <RotateCcw size={18} />
            <span>DEVAM ET (RUN İLERLEMESİ)</span>
          </button>
        )}

        {/* 2. YENİ RUN BAŞLAT */}
        <button
          onClick={() => onStartRun(selectedDeckId)}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-base transition flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 active:scale-95 tracking-wide"
        >
          <Play size={20} className="fill-slate-950" />
          <span>YENİ RUN BAŞLAT</span>
        </button>

        {/* Selected Deck Summary Info */}
        <div className="text-[11px] text-amber-300/80 bg-amber-950/40 border border-amber-800/40 px-3 py-1.5 rounded-xl flex items-center justify-between">
          <span className="flex items-center gap-1 font-bold">
            <span>{selectedDeck.icon}</span>
            <span>Deste: {selectedDeck.name}</span>
          </span>
          <button
            onClick={() => setActiveModal('DECKS')}
            className="text-[10px] font-extrabold text-amber-400 underline uppercase"
          >
            Değiştir
          </button>
        </div>

        {/* 3. DESTELER */}
        <button
          onClick={() => setActiveModal('DECKS')}
          className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-xs transition flex items-center justify-between shadow active:scale-95"
        >
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-amber-400" />
            <span>DESTELER VE KİLİTLER</span>
          </div>
          <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            {unlockedDecks.length} / {STARTER_DECKS.length} Açık
          </span>
        </button>

        {/* 4. KOLEKSİYON */}
        <button
          onClick={() => setActiveModal('COLLECTION')}
          className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-xs transition flex items-center justify-between shadow active:scale-95"
        >
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-purple-400" />
            <span>KOLEKSİYON (ANSİKLOPEDİ)</span>
          </div>
          <span className="text-[10px] text-purple-300 bg-purple-950/50 px-2 py-0.5 rounded border border-purple-800/60">
            Emanetler & Harfler
          </span>
        </button>

        {/* 5. AYARLAR */}
        <button
          onClick={() => setActiveModal('SETTINGS')}
          className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs transition flex items-center justify-between shadow active:scale-95"
        >
          <div className="flex items-center gap-2">
            <Settings size={16} className="text-slate-400" />
            <span>AYARLAR</span>
          </div>
          <span className="text-[10px] text-slate-500">Ses & Tercihler</span>
        </button>
      </div>

      {/* Footer Info */}
      <div className="text-center text-[10px] text-slate-500 font-medium">
        Sözlük: {getDictionarySize()}+ Geçerli Kelime • v1.0.0
      </div>

      {/* OVERLAY MODAL 1: DESTELER */}
      {activeModal === 'DECKS' && (
        <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-50 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm">
              <Layers size={18} />
              <span>BAŞLANGIÇ DESTELERİ</span>
            </div>
            <button onClick={() => setActiveModal(null)} className="p-1 rounded-full bg-slate-800 text-slate-300">
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 my-3 overflow-y-auto flex flex-col gap-2 pr-1">
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
                      ? 'border-slate-800 bg-slate-900/90'
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

          <button
            onClick={() => setActiveModal(null)}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition"
          >
            Tamam
          </button>
        </div>
      )}

      {/* OVERLAY MODAL 2: KOLEKSİYON */}
      {activeModal === 'COLLECTION' && (
        <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-50 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-purple-400 font-extrabold text-sm">
              <BookOpen size={18} />
              <span>KOLEKSİYON (ANSİKLOPEDİ)</span>
            </div>
            <button onClick={() => setActiveModal(null)} className="p-1 rounded-full bg-slate-800 text-slate-300">
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 my-3 overflow-y-auto flex flex-col gap-3 pr-1">
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

          <button
            onClick={() => setActiveModal(null)}
            className="w-full py-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-black text-xs transition"
          >
            Kapat
          </button>
        </div>
      )}

      {/* OVERLAY MODAL 3: AYARLAR */}
      {activeModal === 'SETTINGS' && (
        <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-50 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-slate-200 font-extrabold text-sm">
              <Settings size={18} className="text-amber-400" />
              <span>AYARLAR</span>
            </div>
            <button onClick={() => setActiveModal(null)} className="p-1 rounded-full bg-slate-800 text-slate-300">
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 my-3 overflow-y-auto flex flex-col gap-3">
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {soundEnabled ? <Volume2 size={18} className="text-emerald-400" /> : <VolumeX size={18} className="text-rose-400" />}
                <span className="text-xs font-bold text-slate-200">Ses Efektleri (SFX)</span>
              </div>
              <button
                onClick={() => setSoundEnabled(prev => !prev)}
                className={`px-3 py-1 rounded-xl text-xs font-extrabold border transition ${
                  soundEnabled ? 'bg-emerald-950 border-emerald-600 text-emerald-300' : 'bg-rose-950 border-rose-600 text-rose-300'
                }`}
              >
                {soundEnabled ? 'AÇIK' : 'KAPALI'}
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-blue-400" />
                <span className="text-xs font-bold text-slate-200">Dil (Language)</span>
              </div>
              <span className="text-xs font-extrabold text-amber-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                🇹🇷 Türkçe
              </span>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-xs transition"
          >
            Kaydet ve Kapat
          </button>
        </div>
      )}
    </div>
  );
}



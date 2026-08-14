import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Lock, Sparkles, Trophy, BookOpen, Layers, Settings, RotateCcw, Volume2, VolumeX, ShieldCheck, X, User, Award } from 'lucide-react';
import { STARTER_DECKS, LETTER_DEFINITIONS } from '../game/cardData';
import { RELICS } from '../game/relicData';
import { getDictionarySize } from '../data/turkishWords';
import { soundEngine } from '../game/audioEngine';
import { ACHIEVEMENTS, getUnlockedAchievementIds } from '../game/achievementsData';

export function StartMenuModal({
  highScore,
  unlockedDecks,
  selectedDeckId,
  hasActiveRun = false,
  onSelectDeck,
  onUnlockDeck,
  onStartRun,
  onResumeRun,
  onOpenCodex,
  onOpenChallengeSelect
}) {
  const [activeModal, setActiveModal] = useState(null); // null | 'DECKS' | 'COLLECTION' | 'SETTINGS'
  const [soundEnabled, setSoundEnabled] = useState(!soundEngine.isMuted());

  const selectedDeck = STARTER_DECKS.find(d => d.id === selectedDeckId) || STARTER_DECKS[0];
  const unlockedAchievementCount = getUnlockedAchievementIds().length;

  const handleToggleSound = () => {
    const nowMuted = soundEngine.toggleMute();
    setSoundEnabled(!nowMuted);
    if (!nowMuted) soundEngine.playTap();
  };

  return (
    <div className="absolute inset-0 z-50 w-full h-full flex flex-col justify-between p-4 sm:p-6 select-none overflow-y-auto bg-transparent">


      {/* TOP BAR: MASKOT, DICTIONARY & STATS & SETTINGS */}
      <div className="flex items-center justify-between z-10 w-full">
        <div className="flex items-center gap-2.5 bg-slate-950/80 border border-amber-500/40 px-3.5 py-1.5 rounded-2xl backdrop-blur-md shadow-2xl">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-purple-900 to-slate-900 border border-amber-400 p-0.5 shadow-md overflow-hidden shrink-0">
            <img src="/mascot.png" alt="Bilge Baykuş" className="w-full h-full object-cover scale-110" />
          </div>
          <div>
            <div className="text-[10px] font-black text-amber-400 tracking-wider uppercase">SÖZ REHBERİ BİLGE BAYKUŞ</div>
            <div className="text-xs font-bold text-slate-200">"Hoş Geldin Şair! Hazırsan Desteni Seç!"</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 bg-slate-950/80 border border-amber-500/30 px-3 py-1 rounded-2xl text-[10px] font-black text-amber-300 backdrop-blur-md shadow-sm">
            <span>📖</span>
            <span>{getDictionarySize().toLocaleString('tr-TR')} RESMİ TDK KELİME DAHİL</span>
          </div>

          <button
            onClick={handleToggleSound}
            title="Ses Efektleri"
            className={`p-2.5 rounded-2xl border backdrop-blur-md transition cursor-pointer shadow-md ${
              soundEnabled ? 'bg-slate-950/80 border-slate-700 text-slate-200' : 'bg-rose-950/80 border-rose-500 text-rose-300'
            }`}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          <button
            onClick={() => setActiveModal('SETTINGS')}
            title="Ayarlar"
            className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-700 hover:border-amber-400 text-amber-300 backdrop-blur-md transition cursor-pointer shadow-md"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* BALATRO LOGO GRAPHIC */}
      <div className="flex flex-col items-center justify-center my-auto z-10">
        <div className="flex items-center justify-center gap-1 sm:gap-2">
          {['K', 'E', 'L', 'İ'].map((char, i) => (
            <div key={i} className="w-12 h-16 sm:w-16 sm:h-22 rounded-xl bg-gradient-to-b from-blue-600 via-indigo-700 to-slate-900 border-2 border-cyan-400 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.5)] transform -rotate-3 hover:rotate-0 transition-transform">
              <span className="text-xl sm:text-3xl font-black text-white font-cinzel">{char}</span>
              <span className="text-[9px] font-bold text-cyan-300">+2p</span>
            </div>
          ))}
          
          {/* M Joker Tile */}
          <div className="w-14 h-18 sm:w-18 sm:h-24 rounded-xl bg-gradient-to-b from-amber-400 via-yellow-500 to-amber-600 border-2 border-yellow-200 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.8)] scale-110 z-10 animate-pulse">
            <span className="text-2xl sm:text-4xl font-black text-slate-950 font-cinzel">M</span>
            <span className="text-[9px] font-extrabold text-slate-950 bg-amber-200 px-1 rounded">🃏 JOKER</span>
          </div>

          {['E'].map((char, i) => (
            <div key={i} className="w-12 h-16 sm:w-16 sm:h-22 rounded-xl bg-gradient-to-b from-rose-600 via-red-700 to-slate-900 border-2 border-rose-400 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.5)] transform rotate-3 hover:rotate-0 transition-transform">
              <span className="text-xl sm:text-3xl font-black text-white font-cinzel">{char}</span>
              <span className="text-[9px] font-bold text-rose-300">+1p</span>
            </div>
          ))}
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-amber-300 font-cinzel tracking-widest mt-4 drop-shadow-[0_0_25px_rgba(245,158,11,0.8)]">
          KELİME DEKBUILDER
        </h1>
        <p className="text-xs sm:text-sm font-extrabold text-cyan-300 uppercase tracking-widest mt-1 bg-slate-950/80 px-3 py-1 rounded-full border border-cyan-500/40">
          ✨ TÜRKÇE ROGUELITE DECKBUILDER
        </p>
      </div>

      {/* MAIN MENU ACTION BUTTONS — POSITIONED AT VERY BOTTOM OF SCREEN */}
      <div className="w-full max-w-4xl mx-auto z-10 mt-auto mb-2">
        <div className="flex flex-row-reverse flex-wrap items-center justify-center gap-2.5 sm:gap-3.5">
          {/* 1. BUTTON (RIGHTMOST): YENİ RUN BAŞLAT */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onStartRun(selectedDeckId)}
            className="flex-1 min-w-[150px] sm:min-w-[180px] py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.5)] border border-yellow-200 cursor-pointer animate-pulse-glow"
          >
            <Play size={18} className="fill-slate-950" />
            <span>YENİ RUN BAŞLAT</span>
          </motion.button>

          {/* 2. BUTTON: DEVAM ET (KALDIĞIN YERDEN) */}
          {hasActiveRun && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onResumeRun}
              className="flex-1 min-w-[140px] sm:min-w-[170px] py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/50 border border-emerald-400/50 cursor-pointer"
            >
              <RotateCcw size={16} />
              <span>DEVAM ET</span>
            </motion.button>
          )}

          {/* 3. BUTTON: BAŞLANGIÇ DESTESİ SEÇİMİ */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveModal('DECKS')}
            className="flex-1 min-w-[130px] sm:min-w-[160px] py-3 px-3.5 rounded-2xl bg-slate-950/90 hover:bg-slate-900 border border-purple-500/50 text-purple-200 font-bold text-xs transition flex items-center justify-center gap-2 shadow-md backdrop-blur-md cursor-pointer"
          >
            <Layers size={15} className="text-purple-400" />
            <span>DESTE SEÇ</span>
          </motion.button>

          {/* 4. BUTTON: SÖZLÜK ANSİKLOPEDİSİ (CODEX) */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => { if (onOpenCodex) onOpenCodex(); else setActiveModal('COLLECTION'); }}
            className="flex-1 min-w-[130px] sm:min-w-[160px] py-3 px-3.5 rounded-2xl bg-slate-950/90 hover:bg-slate-900 border border-cyan-500/50 text-cyan-200 font-bold text-xs transition flex items-center justify-center gap-2 shadow-md backdrop-blur-md cursor-pointer"
          >
            <BookOpen size={15} className="text-cyan-400" />
            <span>ANSİKLOPEDİ</span>
          </motion.button>

          {/* 5. BUTTON (LEFTMOST): ÖZEL MEYDAN OKUMALAR (CHALLENGES) */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => { if (onOpenChallengeSelect) onOpenChallengeSelect(); }}
            className="flex-1 min-w-[130px] sm:min-w-[160px] py-3 px-3.5 rounded-2xl bg-slate-950/90 hover:bg-slate-900 border border-rose-500/50 text-rose-200 font-bold text-xs transition flex items-center justify-center gap-2 shadow-md backdrop-blur-md cursor-pointer"
          >
            <Trophy size={15} className="text-rose-400" />
            <span>MEYDAN OKUMALAR</span>
          </motion.button>
        </div>
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
                      <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 font-bold text-[10px] flex items-center gap-1">
                        <Lock size={11} />
                        <span>🏆 BAŞARIM İLE AÇILIR</span>
                      </span>
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

      {/* MODAL: SETTINGS */}
      {activeModal === 'SETTINGS' && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-amber-400 font-black text-base font-cinzel">
              <Settings size={20} />
              <span>AYARLAR</span>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 my-3 space-y-3">
            <button
              onClick={handleToggleSound}
              className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                {soundEnabled ? <Volume2 size={18} className="text-amber-300" /> : <VolumeX size={18} className="text-slate-500" />}
                <span className="font-extrabold text-sm text-slate-100">Ses Efektleri</span>
              </div>
              <div className={`w-11 h-6 rounded-full relative transition-colors ${soundEnabled ? 'bg-amber-500' : 'bg-slate-700'}`}>
                <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all shadow-md ${soundEnabled ? 'left-[22px]' : 'left-0.5'}`} />
              </div>
            </button>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 font-medium leading-relaxed">
              Kelime Destesi v2.0 • TDK Entegreli Türkçe Harf Roguelite Deckbuilder. İlerlemeniz bu cihazda otomatik olarak kaydedilir.
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-2xl"
          >
            Tamam
          </button>
        </div>
      )}
    </div>
  );
}

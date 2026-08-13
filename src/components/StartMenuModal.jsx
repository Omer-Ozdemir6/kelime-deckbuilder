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
    <div
      className="absolute inset-0 z-50 flex flex-col justify-between p-5 backdrop-blur-xl overflow-y-auto"
      style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(120,53,15,0.25) 0%, transparent 60%), linear-gradient(180deg, #050714 0%, #0a0a1a 55%, #050714 100%)' }}
    >
      {/* Animated background grid, consistent with StakesSelectModal */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(245,158,11,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.4) 1px, transparent 1px)',
          backgroundSize: '36px 36px'
        }}
      />

      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-purple-600/10 blur-[110px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-cyan-500/10 blur-[110px] pointer-events-none" />

      {/* Floating suit particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {['♠', '♥', '♦', '♣', '🂡'].map((p, i) => (
          <motion.span
            key={i}
            className="absolute text-3xl opacity-[0.06] select-none"
            style={{ left: `${8 + i * 20}%`, top: `${10 + (i % 3) * 28}%` }}
            animate={{ y: [0, -16, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 6 + i * 1.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
          >
            {p}
          </motion.span>
        ))}
      </div>

      {/* Top Logo & Title */}
      <div className="flex flex-col items-center text-center mt-3 relative z-10">
        <motion.div
          className="w-18 h-18 rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 flex items-center justify-center text-3xl font-black text-slate-950 shadow-2xl shadow-amber-500/40 mb-3 border-2 border-yellow-200 animate-pulse-glow"
          animate={{ rotate: [0, -4, 4, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          🃏
        </motion.div>

        <h1 className="text-4xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 font-cinzel drop-shadow-[0_0_25px_rgba(245,158,11,0.35)]">
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
        <div className="flex items-center justify-center gap-2.5 mt-4 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-emerald-500/40 px-3.5 py-1.5 rounded-2xl text-xs font-black text-emerald-400 shadow-md">
            <Trophy size={14} className="text-emerald-400" />
            <span>En Yüksek Skor: {highScore}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-amber-500/40 px-3.5 py-1.5 rounded-2xl text-xs font-black text-amber-300 shadow-md">
            <Award size={14} className="text-amber-300" />
            <span>Başarımlar: {unlockedAchievementCount}/{ACHIEVEMENTS.length}</span>
          </div>
        </div>
      </div>

      {/* Main Menu Action Buttons */}
      <div className="w-full max-w-sm mx-auto flex flex-col gap-3 my-4 relative z-10">
        {/* 1. DEVAM ET (If run in progress) */}
        {hasActiveRun && (
          <button
            onClick={onResumeRun}
            className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-black text-sm transition flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/50 active:scale-95 border border-emerald-400/50 cursor-pointer"
          >
            <RotateCcw size={18} />
            <span>DEVAM ET (KALDIĞIN YERDEN)</span>
          </button>
        )}

        {/* 2. YENİ RUN BAŞLAT */}
        <motion.button
          onClick={() => onStartRun(selectedDeckId)}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-base transition flex items-center justify-center gap-2 shadow-2xl shadow-amber-500/30 tracking-wider border border-amber-300 animate-pulse-glow cursor-pointer"
        >
          <Play size={22} className="fill-slate-950" />
          <span>YENİ RUN BAŞLAT</span>
        </motion.button>

        {/* 2B. ÖZEL MEYDAN OKUMA MODLARI (CHALLENGE RUNS) */}
        <button
          onClick={() => { if (onOpenChallengeSelect) onOpenChallengeSelect(); }}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-900/90 via-slate-900 to-indigo-950/90 hover:from-purple-800 hover:to-indigo-900 border border-purple-500/50 text-purple-200 font-bold text-xs transition flex items-center justify-between shadow-md active:scale-95 cursor-pointer"
        >
          <div className="flex items-center gap-2 font-extrabold">
            <Trophy size={16} className="text-purple-400" />
            <span>⚔️ ÖZEL MEYDAN OKUMA MODLARI</span>
          </div>
          <span className="text-[10px] font-black text-purple-300 bg-slate-950 px-2.5 py-0.5 rounded-lg border border-purple-500/50">
            CHALLENGE 🎯
          </span>
        </button>

        {/* 3. ANSİKLOPEDİ & KOLEKSİYON MÜZESİ */}
        <button
          onClick={() => { if (onOpenCodex) onOpenCodex(); else setActiveModal('COLLECTION'); }}
          className="w-full py-3.5 px-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-bold text-xs transition flex items-center justify-between shadow-md active:scale-95 cursor-pointer"
        >
          <div className="flex items-center gap-2 font-extrabold">
            <BookOpen size={16} className="text-cyan-400" />
            <span>SÖZLÜK ANSİKLOPEDİSİ & KOLEKSİYON</span>
          </div>
          <span className="text-[10px] font-black text-cyan-300 bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800">
            ANSİKLOPEDİ 📖
          </span>
        </button>

        {/* 4. Utility bar — profile / sound / settings / decks */}
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
            <div className="w-7 h-7 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0">
              <User size={14} />
            </div>
            <span className="text-[11px] font-black text-slate-300 truncate">Oyuncu</span>
          </div>

          <button
            onClick={() => setActiveModal('DECKS')}
            title="Başlangıç Destesi"
            className="w-11 h-11 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 flex items-center justify-center shadow-md active:scale-95 cursor-pointer shrink-0"
          >
            <Layers size={16} />
          </button>

          <button
            onClick={handleToggleSound}
            title="Ses Efektleri"
            className={`w-11 h-11 rounded-2xl border flex items-center justify-center shadow-md active:scale-95 cursor-pointer shrink-0 transition ${
              soundEnabled
                ? 'bg-slate-900/90 hover:bg-slate-800 border-slate-800 text-slate-300'
                : 'bg-rose-950/60 hover:bg-rose-950 border-rose-500/50 text-rose-300'
            }`}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          <button
            onClick={() => setActiveModal('SETTINGS')}
            title="Ayarlar"
            className="w-11 h-11 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 flex items-center justify-center shadow-md active:scale-95 cursor-pointer shrink-0"
          >
            <Settings size={16} />
          </button>
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

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Lock, Sparkles, Trophy, BookOpen, Layers, Settings, RotateCcw, Volume2, VolumeX, ShieldCheck, X, User, Award, Calendar, Flame, Compass, Coins } from 'lucide-react';
import { STARTER_DECKS, LETTER_DEFINITIONS } from '../game/cardData';
import { RELICS } from '../game/relicData';
import { getDictionarySize } from '../data/turkishWords';
import { soundEngine } from '../game/audioEngine';
import { ACHIEVEMENTS, getUnlockedAchievementIds } from '../game/achievementsData';
import { RunicCardFrame } from './RunicCardFrame';

const MASCOT_QUOTES = [
  "\"Hoş Geldin Şair! Hazırsan Desteni Seç ve Oyuna Başla!\"",
  "\"İpucu: Harf bankasına kaldırdığınız taşlar tur sonunda silinmez!\"",
  "\"İpucu: 5+ harfli uzun kelimeler yaptığınızda kombo çarpanınız korunur!\"",
  "\"İpucu: TDK Sözlük butonuna dokunarak kelimelerin resmi anlamını öğrenin!\"",
  "\"İpucu: Dükkândan aldığınız pasif jokerler tüm maç boyunca ekstra çarpan verir!\""
];

// SVG Emblem Renderer for Starter Decks
function DeckSvgEmblem({ deckId, isSelected, isUnlocked }) {
  let primaryColor = '#f59e0b';
  let secondaryColor = '#d97706';
  let pathIcon = null;

  if (deckId === 'starter_basit') {
    primaryColor = '#ef4444';
    secondaryColor = '#991b1b';
    pathIcon = (
      <g>
        <path d="M 16 20 L 28 40 L 40 20 Z" fill="#fef08a" stroke="#fbbf24" strokeWidth="2" />
        <circle cx="28" cy="26" r="3.5" fill="#ef4444" />
      </g>
    );
  } else if (deckId === 'starter_sesli') {
    primaryColor = '#38bdf8';
    secondaryColor = '#0369a1';
    pathIcon = (
      <path d="M 14 30 Q 21 16 28 30 Q 35 44 42 30" fill="none" stroke="#e0f2fe" strokeWidth="3.5" strokeLinecap="round" />
    );
  } else if (deckId === 'starter_tyccar') {
    primaryColor = '#fbbf24';
    secondaryColor = '#b45309';
    pathIcon = (
      <g>
        <circle cx="28" cy="28" r="12" fill="none" stroke="#fef08a" strokeWidth="3" />
        <text x="28" y="33" textAnchor="middle" fill="#fef08a" fontSize="15" fontWeight="900" fontFamily="Cinzel, serif">$</text>
      </g>
    );
  } else if (deckId === 'starter_nadir') {
    primaryColor = '#34d399';
    secondaryColor = '#047857';
    pathIcon = (
      <polygon points="28,14 42,28 28,42 14,28" fill="none" stroke="#a7f3d0" strokeWidth="3" />
    );
  } else if (deckId === 'starter_erratic') {
    primaryColor = '#c084fc';
    secondaryColor = '#6b21a8';
    pathIcon = (
      <g>
        <rect x="18" y="18" width="20" height="20" rx="5" fill="none" stroke="#f3e8ff" strokeWidth="2.5" />
        <circle cx="23" cy="23" r="2" fill="#f3e8ff" />
        <circle cx="33" cy="33" r="2" fill="#f3e8ff" />
        <circle cx="28" cy="28" r="2" fill="#f3e8ff" />
      </g>
    );
  } else if (deckId === 'starter_thin') {
    primaryColor = '#94a3b8';
    secondaryColor = '#334155';
    pathIcon = (
      <path d="M 18 38 L 28 16 L 38 38 Z" fill="none" stroke="#f1f5f9" strokeWidth="3" strokeLinejoin="round" />
    );
  } else if (deckId === 'starter_elemental') {
    primaryColor = '#f97316';
    secondaryColor = '#9a3412';
    pathIcon = (
      <path d="M 28 14 C 21 22 19 28 23 35 C 28 42 35 35 33 28 C 40 33 37 40 28 40 C 20 40 16 33 21 24 Z" fill="#fef08a" />
    );
  }

  return (
    <div className="relative w-12 h-14 sm:w-14 sm:h-16 shrink-0 flex items-center justify-center">
      <svg className="w-full h-full drop-shadow-xl" viewBox="0 0 56 64" fill="none">
        <defs>
          <linearGradient id={`deckGrad_${deckId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primaryColor} />
            <stop offset="100%" stopColor={secondaryColor} />
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="48" height="56" rx="10" fill={`url(#deckGrad_${deckId})`} stroke={isSelected ? '#fef08a' : primaryColor} strokeWidth={isSelected ? '3' : '1.5'} />
        <rect x="8" y="8" width="40" height="48" rx="8" fill="#0f172a" fillOpacity="0.88" stroke={primaryColor} strokeWidth="1" strokeDasharray="4 2" />
        {pathIcon}
      </svg>
    </div>
  );
}

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
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [focusedDeckIndex, setFocusedDeckIndex] = useState(() => {
    const idx = STARTER_DECKS.findIndex(d => d.id === selectedDeckId);
    return idx !== -1 ? idx : 0;
  });

  useEffect(() => {
    const idx = STARTER_DECKS.findIndex(d => d.id === selectedDeckId);
    if (idx !== -1) setFocusedDeckIndex(idx);
  }, [selectedDeckId]);

  const selectedDeck = STARTER_DECKS.find(d => d.id === selectedDeckId) || STARTER_DECKS[0];
  const unlockedAchievementCount = getUnlockedAchievementIds().length;

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIdx(prev => (prev + 1) % MASCOT_QUOTES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleSound = () => {
    const nowMuted = soundEngine.toggleMute();
    setSoundEnabled(!nowMuted);
    if (!nowMuted) soundEngine.playTap();
  };

  return (
    <div className="absolute inset-0 z-50 w-full h-full flex flex-col justify-between p-4 sm:p-6 select-none overflow-y-auto bg-slate-950">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Ambient Radial Glow Blob */}
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="w-[650px] h-[650px] bg-amber-500/15 rounded-full blur-3xl" />
      </div>

      {/* Ambient Runic Circle Rays in Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25 z-0">
        <svg className="w-[750px] h-[750px] text-amber-500/35 animate-spin-slow" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="8 4" />
          <circle cx="100" cy="100" r="75" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <polygon points="100,10 190,100 100,190 10,100" fill="none" stroke="currentColor" strokeWidth="1" />
          <polygon points="100,20 180,100 100,180 20,100" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 2" />
        </svg>
      </div>

      {/* TOP BAR: MASKOT, DICTIONARY & STATS & SETTINGS */}
      <div className="flex items-center justify-between z-10 w-full gap-2 flex-wrap">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 bg-slate-950/90 border-2 border-amber-500/50 px-4 py-2 rounded-2xl backdrop-blur-xl shadow-[0_0_25px_rgba(245,158,11,0.2)] flex-1 max-w-lg"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-b from-purple-900 to-slate-900 border-2 border-amber-400 p-0.5 shadow-md overflow-hidden shrink-0">
            <img src="/mascot.png" alt="Bilge Baykuş" className="w-full h-full object-cover scale-110" />
          </div>
          <div>
            <div className="text-[10px] sm:text-xs font-black text-amber-400 tracking-wider uppercase flex items-center gap-1.5">
              <span>SÖZ REHBERİ BİLGE BAYKUŞ</span>
              <Sparkles size={11} className="text-amber-300 animate-pulse" />
            </div>
            <div className="text-xs sm:text-sm font-extrabold text-slate-100 transition-all duration-500 leading-snug">
              {MASCOT_QUOTES[quoteIdx]}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          {/* High Score Widget */}
          <div className="flex items-center gap-1.5 bg-slate-950/90 border-2 border-amber-500/50 px-3.5 py-1.5 rounded-2xl text-xs font-black text-amber-300 backdrop-blur-xl shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Trophy size={15} className="text-amber-400 fill-amber-400" />
            <span>EN YÜKSEK: {(highScore || 0).toLocaleString('tr-TR')}</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-slate-950/90 border-2 border-cyan-500/40 px-3.5 py-1.5 rounded-2xl text-xs font-black text-cyan-300 backdrop-blur-xl shadow-sm">
            <BookOpen size={14} className="text-cyan-400" />
            <span>{getDictionarySize().toLocaleString('tr-TR')} RESMİ TDK KELİME DAHİL</span>
          </div>

          <button
            onClick={handleToggleSound}
            title="Ses Efektleri"
            className={`p-2.5 rounded-2xl border-2 backdrop-blur-xl transition cursor-pointer shadow-lg active:scale-95 ${
              soundEnabled ? 'bg-slate-950/90 border-slate-700 text-amber-300 hover:border-amber-400' : 'bg-rose-950/90 border-rose-500 text-rose-300'
            }`}
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>

          <button
            onClick={() => setActiveModal('SETTINGS')}
            title="Ayarlar"
            className="p-2.5 rounded-2xl bg-slate-950/90 border-2 border-slate-700 hover:border-amber-400 text-amber-300 backdrop-blur-xl transition cursor-pointer shadow-lg active:scale-95"
          >
            <Settings size={20} />
          </button>
        </motion.div>
      </div>

      {/* CENTER LOGO AREA: OFFICIAL HIGH QUALITY VERBO BRANDING */}
      <div className="flex flex-col items-center justify-center my-auto z-20 w-full max-w-4xl mx-auto px-2 select-none">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 18, stiffness: 220 }}
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          <img
            src="/verbo.png"
            alt="VERBO"
            className="w-full max-w-md sm:max-w-lg md:max-w-xl max-h-[320px] object-contain filter drop-shadow-[0_15px_50px_rgba(245,158,11,0.5)] hover:scale-105 transition-transform"
          />
        </motion.div>
      </div>

      {/* 1:1 BALATRO DOCK BAR: COLORFUL 3D ARCADE BUTTONS */}
      <div className="w-full max-w-5xl mx-auto z-20 mt-auto mb-3">
        <div className="bg-slate-950/90 border-2 border-slate-700/80 rounded-3xl p-3 sm:p-4 shadow-[0_15px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
          <div className="flex flex-row-reverse flex-wrap items-center justify-center gap-2.5 sm:gap-3.5">
            {/* 1. BUTTON (PLAY / YENİ RUN) - VIBRANT BLUE */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onStartRun(selectedDeckId)}
              className="flex-1 min-w-[150px] sm:min-w-[180px] py-3.5 px-4 rounded-2xl bg-gradient-to-b from-sky-400 via-blue-500 to-blue-700 text-white font-black text-xs sm:text-base transition flex items-center justify-center gap-2 shadow-[0_6px_0_#1e3a8a] border-2 border-sky-200 cursor-pointer tracking-wider font-cinzel"
            >
              <Play size={18} className="fill-white stroke-none" />
              <span>YENİ RUN</span>
            </motion.button>

            {/* 2. BUTTON (DEVAM ET) - GOLDEN ORANGE */}
            {hasActiveRun && (
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={onResumeRun}
                className="flex-1 min-w-[140px] sm:min-w-[165px] py-3.5 px-4 rounded-2xl bg-gradient-to-b from-amber-400 via-yellow-500 to-amber-600 text-slate-950 font-black text-xs sm:text-base transition flex items-center justify-center gap-2 shadow-[0_6px_0_#78350f] border-2 border-yellow-200 cursor-pointer tracking-wider font-cinzel"
              >
                <RotateCcw size={18} className="stroke-[3]" />
                <span>DEVAM ET</span>
              </motion.button>
            )}

            {/* 3. BUTTON (OPTIONS / DESTE SEÇ) - PURPLE */}
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveModal('DECKS')}
              className="flex-1 min-w-[130px] sm:min-w-[155px] py-3.5 px-3.5 rounded-2xl bg-gradient-to-b from-purple-500 via-indigo-600 to-purple-800 text-white font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-[0_6px_0_#4c1d95] border-2 border-purple-300 cursor-pointer font-cinzel"
            >
              <Layers size={17} />
              <span>DESTE SEÇ</span>
            </motion.button>

            {/* 4. BUTTON (COLLECTION / ANSİKLOPEDİ) - EMERALD GREEN */}
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => { if (onOpenCodex) onOpenCodex(); else setActiveModal('COLLECTION'); }}
              className="flex-1 min-w-[130px] sm:min-w-[155px] py-3.5 px-3.5 rounded-2xl bg-gradient-to-b from-emerald-400 via-teal-500 to-emerald-700 text-slate-950 font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-[0_6px_0_#064e3b] border-2 border-emerald-200 cursor-pointer font-cinzel"
            >
              <BookOpen size={17} />
              <span>ANSİKLOPEDİ</span>
            </motion.button>

            {/* 5. BUTTON (QUIT / MEYDAN OKUMALAR) - CRIMSON RED */}
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => { if (onOpenChallengeSelect) onOpenChallengeSelect(); }}
              className="flex-1 min-w-[130px] sm:min-w-[155px] py-3.5 px-3.5 rounded-2xl bg-gradient-to-b from-rose-500 via-red-600 to-rose-800 text-white font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-[0_6px_0_#881337] border-2 border-rose-300 cursor-pointer font-cinzel"
            >
              <Trophy size={17} />
              <span>MEYDAN OKUMALAR</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-[10px] sm:text-xs text-slate-500 font-bold relative z-10 pt-2 border-t border-slate-800/60">
        VERBO v2.5 AAA Sürümü • TDK Entegreli Türkçe Harf Roguelite
      </div>

      {/* MODAL: DECKS SELECTION - SPOTLIGHT CAROUSEL AAA DESIGN */}
      {activeModal === 'DECKS' && (() => {
        const focusedDeck = STARTER_DECKS[focusedDeckIndex] || STARTER_DECKS[0];
        const isUnlocked = unlockedDecks.includes(focusedDeck.id);
        const isSelected = selectedDeckId === focusedDeck.id;
        const runicRarity = isSelected ? 'legendary' : (isUnlocked ? 'joker' : 'common');

        // Group letters into clean frequency counts (e.g. A x3, K x2)
        const groupedLetters = [];
        const counts = {};
        (focusedDeck.letters || []).forEach(item => {
          const key = typeof item === 'object' ? (item.letter || item.type || 'A') : item;
          counts[key] = (counts[key] || 0) + 1;
        });
        Object.entries(counts).forEach(([key, count]) => {
          groupedLetters.push({ key, count });
        });

        return (
          <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl p-3 sm:p-6 flex items-center justify-center animate-fade-in select-none">
            <div className="w-full max-w-2xl max-h-[92vh] rounded-3xl border-2 border-amber-500/80 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 shadow-[0_0_50px_rgba(245,158,11,0.35)] p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden">
              
              {/* Ambient Background Runic Glow */}
              <div className="absolute inset-0 pointer-events-none opacity-15 flex items-center justify-center">
                <svg className="w-[500px] h-[500px] text-amber-400 animate-spin-slow" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="85" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 4" />
                  <polygon points="100,20 170,100 100,180 30,100" fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>
              </div>

              {/* HEADER BAR */}
              <div className="flex items-center justify-between border-b-2 border-amber-500/40 pb-3 z-10 relative">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/80 flex items-center justify-center text-amber-300 shadow-md">
                    <Layers size={22} className="text-amber-300" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-amber-300 tracking-wider font-cinzel flex items-center gap-2">
                      <span>BAŞLANGIÇ DESTELERİ KÜTÜPHANESİ</span>
                      <Sparkles size={16} className="text-amber-400" />
                    </h2>
                    <p className="text-[11px] sm:text-xs text-slate-400 font-semibold">
                      Kullanmak istediğiniz mistik harf destesini seçin
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    try { soundEngine.playTap?.(); } catch(e) {}
                    setActiveModal(null);
                  }}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition active:scale-95 shadow-md"
                  title="Kapat"
                >
                  <X size={18} />
                </button>
              </div>

              {/* DECK SELECTOR TABS BAR */}
              <div className="flex items-center gap-2 overflow-x-auto py-2.5 my-1 z-10 scrollbar-none">
                {STARTER_DECKS.map((d, idx) => {
                  const isTabSelected = idx === focusedDeckIndex;
                  const isTabUnlocked = unlockedDecks.includes(d.id);
                  const isTabActiveRun = selectedDeckId === d.id;

                  return (
                    <button
                      key={`deck_tab_${d.id}`}
                      onClick={() => {
                        try { soundEngine.playTap?.(); } catch(e) {}
                        setFocusedDeckIndex(idx);
                      }}
                      className={`px-3 py-2 rounded-2xl font-black text-xs transition cursor-pointer flex items-center gap-1.5 shrink-0 border shadow-md ${
                        isTabSelected
                          ? 'bg-amber-400 text-slate-950 border-amber-200 ring-2 ring-amber-400/50 scale-105 shadow-amber-500/40'
                          : isTabUnlocked
                          ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
                          : 'bg-slate-950/80 text-slate-500 border-slate-900 opacity-60'
                      }`}
                    >
                      <span className="text-base">{d.icon}</span>
                      <span className="truncate max-w-[110px]">{d.name.split(' ')[0]}</span>
                      {!isTabUnlocked && <Lock size={12} className="text-rose-400" />}
                      {isTabActiveRun && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
                    </button>
                  );
                })}
              </div>

              {/* MAIN SPOTLIGHT DECK CARD FRAME */}
              <div className="flex-1 my-2 z-10 relative flex items-center justify-center">
                <motion.div
                  key={`spotlight_deck_${focusedDeck.id}`}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`w-full rounded-3xl p-5 sm:p-6 backdrop-blur-2xl relative shadow-2xl flex flex-col justify-between gap-4 border transition-all ${
                    isSelected
                      ? 'border-amber-400 bg-gradient-to-b from-amber-950/90 via-slate-900 to-amber-950/90 shadow-[0_0_40px_rgba(245,158,11,0.5)] ring-2 ring-amber-400/50'
                      : isUnlocked
                      ? 'border-slate-700 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900'
                      : 'border-rose-950 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 opacity-90'
                  }`}
                >
                  {/* SVG Runic Frame Overlay */}
                  <RunicCardFrame rarity={runicRarity} active={isSelected} />

                  {/* SPOTLIGHT HEADER */}
                  <div className="flex items-start justify-between gap-3 z-10 relative">
                    <div className="flex items-center gap-3.5">
                      <DeckSvgEmblem deckId={focusedDeck.id} isSelected={isSelected} isUnlocked={isUnlocked} />

                      <div className="text-left">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-black text-base sm:text-xl text-amber-300 font-cinzel">
                            {focusedDeck.name}
                          </h3>
                          {isSelected && (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase shadow-md">
                              ✓ SEÇİLİ DESTE
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed mt-1">
                          {focusedDeck.desc || focusedDeck.description}
                        </p>
                      </div>
                    </div>

                    {focusedDeck.bonusGold && (
                      <div className="shrink-0 px-3 py-1.5 rounded-2xl bg-amber-950/90 border-2 border-amber-400/80 text-amber-300 font-mono font-black text-sm flex items-center gap-1 shadow-lg">
                        <Coins size={16} className="text-amber-400 fill-amber-400" />
                        <span>+${focusedDeck.bonusGold} Altın</span>
                      </div>
                    )}
                  </div>

                  {/* LETTER SUMMARY RACK */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col gap-2 z-10 relative">
                    <div className="flex items-center justify-between text-xs font-black text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Compass size={15} className="text-amber-400" />
                        <span>DESTE İÇERİĞİ VE HARF SAYILARI:</span>
                      </span>
                      <span className="font-mono text-amber-300">{focusedDeck.letters.length} KART</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap max-h-32 overflow-y-auto scrollbar-none pt-1">
                      {groupedLetters.map((item, idx) => {
                        let badgeStyle = 'bg-slate-900 border-amber-500/40 text-amber-300';
                        let label = item.key;

                        if (item.key === 'GOLDEN') { label = '✨ ALTIN HARF'; badgeStyle = 'bg-amber-950 border-amber-400 text-amber-300'; }
                        else if (item.key === 'MIRROR') { label = '🪞 AYNA HARF'; badgeStyle = 'bg-cyan-950 border-cyan-400 text-cyan-300'; }
                        else if (item.key === 'DOUBLE') { label = '2x ÇİFT HARF'; badgeStyle = 'bg-purple-950 border-purple-400 text-purple-300'; }
                        else if (item.key === 'JOKER') { label = '🃏 JOKER'; badgeStyle = 'bg-yellow-950 border-yellow-400 text-yellow-300'; }
                        else if (item.key === 'ASH') { label = '🔥 ATEŞ HARF'; badgeStyle = 'bg-rose-950 border-rose-400 text-rose-300'; }

                        return (
                          <div
                            key={idx}
                            className={`px-3 py-1 border rounded-xl font-black text-xs flex items-center gap-1.5 shadow-sm ${badgeStyle}`}
                          >
                            <span>{label}</span>
                            <span className="px-1.5 py-0.2 rounded bg-slate-950/80 text-white font-mono text-[10px]">x{item.count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ACTION CTA BUTTON */}
                  <div className="z-10 relative pt-1">
                    {isUnlocked ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          try { soundEngine.playVictory?.(); } catch(e) {}
                          onSelectDeck(focusedDeck.id);
                          setActiveModal(null);
                        }}
                        className={`w-full py-3.5 rounded-2xl font-black text-sm tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-2xl border-2 transition ${
                          isSelected
                            ? 'bg-amber-950/90 text-amber-300 border-amber-400 shadow-amber-500/40'
                            : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 border-amber-100 shadow-amber-500/70 hover:from-amber-300 hover:to-yellow-300'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Sparkles size={18} className="text-amber-400" />
                            <span>SEÇİLİ DESTE (DEĞİŞTİRMEK İÇİN TAMAMA BASIN)</span>
                          </>
                        ) : (
                          <>
                            <Play size={18} className="fill-current" />
                            <span>BU DESTEĞİ SEÇ VE OYUNA BAŞLA</span>
                          </>
                        )}
                      </motion.button>
                    ) : (
                      <div className="w-full p-3.5 rounded-2xl bg-rose-950/90 border-2 border-rose-500/80 flex items-center justify-between gap-3 shadow-xl">
                        <div className="flex items-center gap-2.5 text-rose-200 font-black text-xs sm:text-sm">
                          <Lock size={18} className="text-rose-400 shrink-0" />
                          <span>{focusedDeck.unlockRequirement || 'Başarım İle Açılır'}</span>
                        </div>
                        <span className="px-3 py-1 rounded-xl bg-rose-900 border border-rose-400 text-rose-100 font-black text-xs shrink-0">
                          🔒 KİLİTLİ
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* FOOTER CONFIRM BUTTON */}
              <div className="pt-2 border-t border-amber-500/30 z-10 relative">
                <button
                  onClick={() => {
                    try { soundEngine.playTap?.(); } catch(e) {}
                    setActiveModal(null);
                  }}
                  className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-black text-xs sm:text-sm border border-amber-500/60 cursor-pointer transition active:scale-98"
                >
                  KAPAT VE MENÜYE DÖN
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL: RELICS & COLLECTION */}
      {activeModal === 'COLLECTION' && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl p-4 sm:p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
            <div className="flex items-center gap-2.5 text-cyan-400 font-black text-base sm:text-lg font-cinzel">
              <BookOpen size={22} />
              <span>KUTSAL EMANETLER KÜTÜPHANESİ</span>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 my-4 overflow-y-auto space-y-3 pr-1">
            {Object.values(RELICS).map(relic => (
              <div key={relic.id} className="p-4 bg-slate-900 border border-slate-800 rounded-3xl flex items-center gap-4 shadow-lg">
                <div className="w-13 h-13 rounded-2xl bg-purple-950/80 border-2 border-purple-500/50 text-3xl flex items-center justify-center shrink-0">
                  {relic.icon}
                </div>
                <div>
                  <h4 className="font-black text-sm sm:text-base text-purple-200">{relic.name}</h4>
                  <p className="text-xs text-slate-400 font-medium">{relic.description}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm rounded-2xl cursor-pointer"
          >
            Kapat
          </button>
        </div>
      )}

      {/* MODAL: SETTINGS */}
      {activeModal === 'SETTINGS' && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl p-4 sm:p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
            <div className="flex items-center gap-2.5 text-amber-400 font-black text-base sm:text-lg font-cinzel">
              <Settings size={22} />
              <span>AYARLAR</span>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 my-4 space-y-4">
            <button
              onClick={handleToggleSound}
              className="w-full p-4 sm:p-5 rounded-3xl bg-slate-900 border-2 border-slate-800 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {soundEnabled ? <Volume2 size={22} className="text-amber-300" /> : <VolumeX size={22} className="text-slate-500" />}
                <span className="font-black text-sm sm:text-base text-slate-100">Ses Efektleri & Müzik</span>
              </div>
              <div className={`w-12 h-6 rounded-full relative transition-colors ${soundEnabled ? 'bg-amber-500' : 'bg-slate-700'}`}>
                <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all shadow-md ${soundEnabled ? 'left-[26px]' : 'left-0.5'}`} />
              </div>
            </button>

            <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 font-medium leading-relaxed space-y-1">
              <div className="text-sm font-black text-amber-300">Kelime Destesi v2.5 AAA Sürümü</div>
              <p>TDK Entegreli Türkçe Harf Roguelite Deckbuilder. İlerlemeniz ve açılan kilitler cihazınızda otomatik kaydedilir.</p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-2xl cursor-pointer"
          >
            Tamam
          </button>
        </div>
      )}
    </div>
  );
}


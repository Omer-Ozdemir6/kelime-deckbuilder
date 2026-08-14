import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Lock, Sparkles, Trophy, BookOpen, Layers, Settings, RotateCcw, Volume2, VolumeX, ShieldCheck, X, User, Award, Calendar, Flame, Compass } from 'lucide-react';
import { STARTER_DECKS, LETTER_DEFINITIONS } from '../game/cardData';
import { RELICS } from '../game/relicData';
import { getDictionarySize } from '../data/turkishWords';
import { soundEngine } from '../game/audioEngine';
import { ACHIEVEMENTS, getUnlockedAchievementIds } from '../game/achievementsData';

const MASCOT_QUOTES = [
  "\"Hoş Geldin Şair! Hazırsan Desteni Seç ve Oyuna Başla!\"",
  "\"İpucu: Harf bankasına kaldırdığınız taşlar tur sonunda silinmez!\"",
  "\"İpucu: 5+ harfli uzun kelimeler yaptığınızda kombo çarpanınız korunur!\"",
  "\"İpucu: TDK Sözlük butonuna dokunarak kelimelerin resmi anlamını öğrenin!\"",
  "\"İpucu: Dükkândan aldığınız pasif jokerler tüm maç boyunca ekstra çarpan verir!\""
];

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

          {/* Subtitle Badge */}
          <p className="text-xs sm:text-sm font-black text-cyan-300 uppercase tracking-widest bg-slate-950/90 px-5 py-1.5 rounded-full border-2 border-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.3)] backdrop-blur-md mt-1">
            ✨ TÜRKÇE HARF ROGUELITE DECKBUILDER
          </p>
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
        LÜGAT v2.5 AAA Sürümü • TDK Entegreli Türkçe Harf Roguelite
      </div>

      {/* MODAL: DECKS SELECTION */}
      {activeModal === 'DECKS' && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl p-4 sm:p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
            <div className="flex items-center gap-2.5 text-amber-400 font-black text-base sm:text-lg font-cinzel">
              <Layers size={22} />
              <span>BAŞLANGIÇ DESTELERİ SEÇİMİ</span>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 my-4 overflow-y-auto space-y-3 pr-1">
            {STARTER_DECKS.map(deck => {
              const isUnlocked = unlockedDecks.includes(deck.id);
              const isSelected = selectedDeckId === deck.id;

              return (
                <div
                  key={deck.id}
                  className={`p-4 sm:p-5 rounded-3xl border-2 transition flex flex-col gap-3 relative ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-950/80 to-slate-950 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.3)]'
                      : isUnlocked
                      ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-950/60 border-slate-900 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl sm:text-4xl p-2 rounded-2xl bg-slate-950 border border-slate-800">{deck.icon}</span>
                      <div>
                        <h3 className="font-black text-sm sm:text-base text-slate-100">{deck.name}</h3>
                        <p className="text-xs text-slate-400 font-medium">{deck.description}</p>
                      </div>
                    </div>

                    {isUnlocked ? (
                      <button
                        onClick={() => {
                          onSelectDeck(deck.id);
                          setActiveModal(null);
                        }}
                        className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm transition cursor-pointer shadow-md ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 shadow-amber-500/50'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        }`}
                      >
                        {isSelected ? '✓ SEÇİLİ' : 'DESTE SEÇ'}
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 font-bold text-[11px] flex items-center gap-1.5">
                        <Lock size={13} />
                        <span>BAŞARIM İLE AÇILIR</span>
                      </span>
                    )}
                  </div>

                  {/* Letter list preview */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-800/80">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">İçerik:</span>
                    {deck.letters.map((letObj, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-slate-950 border border-amber-500/40 rounded-md font-extrabold text-xs text-amber-300"
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
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-2xl cursor-pointer"
          >
            Tamam
          </button>
        </div>
      )}

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


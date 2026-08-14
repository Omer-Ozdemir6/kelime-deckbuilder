import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Timer, Check, RefreshCw, Trophy, ArrowRight, Sparkles, AlertCircle, FastForward } from 'lucide-react';
import { soundEngine } from '../game/audioEngine';
import { isWordValid } from '../data/turkishWords';
import { ChallengeResultsModal } from './ChallengeResultsModal';
import { RunicCardFrame } from './RunicCardFrame';

// Pool of solvable guaranteed Turkish anagram challenge words grouped by target length
const CHALLENGE_PUZZLE_POOL = [
  'KARE', 'KISA', 'MASA', 'KAZA', 'KAPI', 'ORAN', 'ADIM',
  'MERAK', 'KALEM', 'MELEK', 'KESİR', 'SABIR', 'ŞEHİR', 'YILDIZ',
  'KAMERA', 'KESKİN', 'ZİNCİR', 'KALKAN', 'YAPRAK', 'FIRTINA',
  'KARANLIK', 'FARKINDALIK', 'EFENDİ'
];

function generatePuzzle() {
  const chosenWord = CHALLENGE_PUZZLE_POOL[Math.floor(Math.random() * CHALLENGE_PUZZLE_POOL.length)];
  const letters = chosenWord.split('');
  // Shuffle letters for scrambled tile pool
  const scrambled = [...letters].sort(() => 0.5 - Math.random());
  return {
    targetWord: chosenWord,
    targetLength: chosenWord.length,
    scrambledPool: scrambled.map((char, i) => ({ id: `letter_${i}_${char}`, char, isUsed: false }))
  };
}

export function ChallengeScreen({
  onCompleteChallenge
}) {
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentPuzzle, setCurrentPuzzle] = useState(() => generatePuzzle());
  const [placedLetters, setPlacedLetters] = useState([]);
  const [challengeScore, setChallengeScore] = useState(0);
  const [wordsCompleted, setWordsCompleted] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [isChallengeEnded, setIsChallengeEnded] = useState(false);

  // 30-Second Countdown Timer
  useEffect(() => {
    if (isChallengeEnded) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsChallengeEnded(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isChallengeEnded]);

  const handleSelectLetter = (item) => {
    setPlacedLetters((prev) => {
      if (prev.some(l => l.id === item.id) || prev.length >= currentPuzzle.targetLength) return prev;
      soundEngine.playTileClick();
      setCurrentPuzzle((pz) => ({
        ...pz,
        scrambledPool: pz.scrambledPool.map(l => l.id === item.id ? { ...l, isUsed: true } : l)
      }));
      return [...prev, item];
    });
  };

  const handleRemovePlacedLetter = (item) => {
    setPlacedLetters((prev) => {
      if (!prev.some(l => l.id === item.id)) return prev;
      soundEngine.playTileClick();
      setCurrentPuzzle((pz) => ({
        ...pz,
        scrambledPool: pz.scrambledPool.map(l => l.id === item.id ? { ...l, isUsed: false } : l)
      }));
      return prev.filter(l => l.id !== item.id);
    });
  };

  const handleClearLetters = () => {
    soundEngine.playTap();
    setPlacedLetters([]);
    setCurrentPuzzle((prev) => ({
      ...prev,
      scrambledPool: prev.scrambledPool.map(l => ({ ...l, isUsed: false }))
    }));
  };

  const handleSkipWord = () => {
    soundEngine.playTap();
    setPlacedLetters([]);
    setCurrentPuzzle(generatePuzzle());
    setFeedback('⏩ KELİME PAS GEÇİLDİ!');
    setTimeout(() => setFeedback(''), 1200);
  };

  const handleSubmitWord = () => {
    // RULE: All slots MUST be completely filled!
    if (placedLetters.length < currentPuzzle.targetLength) {
      soundEngine.playInvalidWord();
      setFeedback(`⚠️ Eksik kare kabul edilmez! Tam ${currentPuzzle.targetLength} harf doldurmalısın.`);
      setTimeout(() => setFeedback(''), 2000);
      return;
    }

    const constructedWord = placedLetters.map(l => l.char).join('');
    const isValid = isWordValid(constructedWord);

    if (isValid) {
      soundEngine.playVictory();
      // Score calculation based on length: 3: +1, 4: +2, 5: +3, 6: +5, 7+: +8
      const pts = constructedWord.length === 3 ? 1 : constructedWord.length === 4 ? 2 : constructedWord.length === 5 ? 3 : constructedWord.length === 6 ? 5 : 8;
      setChallengeScore((prev) => prev + pts);
      setWordsCompleted((prev) => [...prev, constructedWord]);
      setFeedback(`✓ GEÇERLİ KELİME! +${pts} Puan`);
      setTimeout(() => setFeedback(''), 1500);

      // Generate next puzzle
      setPlacedLetters([]);
      setCurrentPuzzle(generatePuzzle());
    } else {
      soundEngine.playInvalidWord();
      setFeedback(`❌ "${constructedWord}" geçerli bir Türkçe kelime değil!`);
      setTimeout(() => setFeedback(''), 2000);
      handleClearLetters();
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-3 sm:p-5 bg-gradient-to-b from-slate-950 via-[#0a1224] to-slate-950 text-slate-100 overflow-y-auto relative select-none">
      {/* Top Challenge Header Bar */}
      <div className="flex items-center justify-between border-2 border-cyan-500/50 pb-2.5 z-10 bg-slate-950/90 px-4 py-3 rounded-3xl shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border-2 border-cyan-400/60 flex items-center justify-center text-cyan-300 shadow-lg relative overflow-hidden shrink-0">
            <RunicCardFrame rarity="rare" active={true} />
            <Zap size={22} className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-cyan-300 font-cinzel tracking-wide flex items-center gap-2">
              <span>⚡ SÜRELİ HARF CHALLENGE</span>
            </h2>
            <p className="text-[11px] text-slate-300 font-semibold">
              Kareleri doldur ➔ Skor Kap!
            </p>
          </div>
        </div>

        {/* Stats & Fixed-Size Non-Jittering Timer Box */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-2xl text-xs font-black text-amber-300 shadow">
            <Trophy size={14} className="text-amber-400" />
            <span>Skor: {challengeScore}</span>
          </div>

          <div
            className={`w-20 h-10 shrink-0 rounded-2xl border-2 flex items-center justify-center gap-1 text-sm font-black shadow-xl font-mono transition-colors ${
              timeLeft <= 5
                ? 'bg-rose-950 border-rose-500 text-rose-300 shadow-rose-500/50'
                : 'bg-slate-900 border-cyan-500/60 text-cyan-300 shadow-cyan-500/30'
            }`}
          >
            <Timer size={16} className={timeLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-cyan-400'} />
            <span>{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Main Challenge Puzzle Slot Board */}
      <div className="my-auto flex flex-col items-center gap-5 py-4 relative z-10 max-w-xl mx-auto w-full">
        {/* Target Length & Instruction Banner */}
        <div className="text-center space-y-1">
          <span className="px-4 py-1.5 rounded-full bg-cyan-950/90 border-2 border-cyan-400/60 text-cyan-300 text-xs font-black tracking-widest uppercase shadow-lg">
            HEDEF: TAM {currentPuzzle.targetLength} KAREYİ DOLDUR
          </span>
        </div>

        {/* TARGET SLOTS BOARD */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap min-h-24 p-4 rounded-3xl bg-slate-950/90 border-2 border-cyan-500/60 shadow-[0_0_40px_rgba(34,211,238,0.25)] relative overflow-hidden w-full">
          <RunicCardFrame rarity="rare" active={true} />

          {Array.from({ length: currentPuzzle.targetLength }).map((_, idx) => {
            const placed = placedLetters[idx];
            return (
              <motion.button
                key={`slot_${idx}`}
                onClick={() => placed && handleRemovePlacedLetter(placed)}
                className={`w-12 h-16 sm:w-16 sm:h-20 rounded-2xl border-2 flex items-center justify-center text-2xl sm:text-3xl font-black transition-all cursor-pointer shadow-xl relative z-10 ${
                  placed
                    ? 'bg-gradient-to-b from-amber-400 via-yellow-500 to-amber-600 border-amber-200 text-slate-950 shadow-amber-500/40 active:scale-95'
                    : 'border-dashed border-cyan-400/50 bg-slate-900/80 text-slate-700'
                }`}
              >
                {placed ? placed.char : ''}
              </motion.button>
            );
          })}
        </div>

        {/* Feedback Message */}
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs sm:text-sm font-black text-amber-300 bg-slate-950/95 border-2 border-amber-400/80 px-4 py-1.5 rounded-2xl shadow-xl"
          >
            {feedback}
          </motion.div>
        )}

        {/* SCRAMBLED LETTER POOL BUTTONS */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap max-w-md my-2">
          {currentPuzzle.scrambledPool.map((item) => (
            <motion.button
              key={item.id}
              whileHover={!item.isUsed ? { scale: 1.08, y: -4 } : {}}
              whileTap={!item.isUsed ? { scale: 0.92 } : {}}
              onClick={() => handleSelectLetter(item)}
              disabled={item.isUsed}
              className={`w-11 h-14 sm:w-13 sm:h-18 rounded-2xl text-xl font-black transition-all shadow-lg flex items-center justify-center cursor-pointer border-2 ${
                item.isUsed
                  ? 'bg-slate-900 border-slate-800 text-slate-700 cursor-not-allowed opacity-30'
                  : 'bg-gradient-to-b from-purple-800 via-indigo-900 to-slate-950 border-purple-400 text-purple-100 shadow-purple-500/40'
              }`}
            >
              {item.char}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Action Controls Bar */}
      <div className="flex items-center justify-between gap-2 sm:gap-3 border-t-2 border-slate-800/90 pt-3 z-10 max-w-xl mx-auto w-full">
        {/* TEMİZLE Button */}
        <button
          onClick={handleClearLetters}
          className="py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 text-slate-300 font-extrabold text-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-md"
          title="Tüm seçilen harfleri temizle"
        >
          <RefreshCw size={15} />
          <span>Temizle</span>
        </button>

        {/* KELİMEYİ PAS GEÇ Button */}
        <button
          onClick={handleSkipWord}
          className="py-3.5 px-4 rounded-2xl bg-purple-950 hover:bg-purple-900 border-2 border-purple-500/70 text-purple-200 font-extrabold text-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-lg"
          title="Zorlandığında kelimeyi pas geçip yeni bulmaca çek"
        >
          <FastForward size={15} className="text-purple-300" />
          <span>Pas Geç</span>
        </button>

        {/* KONTROL ET & GÖNDER Button */}
        <button
          onClick={handleSubmitWord}
          className="flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-black text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 transition active:scale-95 shadow-2xl shadow-cyan-500/50 border-2 border-cyan-200 cursor-pointer"
        >
          <Check size={18} className="stroke-[3]" />
          <span>KONTROL ET & GÖNDER</span>
        </button>
      </div>

      {/* CHALLENGE RESULTS MODAL ON TIMER END */}
      {isChallengeEnded && (
        <ChallengeResultsModal
          score={challengeScore}
          wordsCompleted={wordsCompleted}
          onProceed={(goldReward) => {
            if (onCompleteChallenge) {
              onCompleteChallenge(goldReward, challengeScore);
            }
          }}
        />
      )}
    </div>
  );
}


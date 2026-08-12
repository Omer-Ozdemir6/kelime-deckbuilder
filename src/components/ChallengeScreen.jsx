import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Timer, Check, RefreshCw, Trophy, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { soundEngine } from '../game/audioEngine';
import { isWordValid } from '../data/turkishWords';
import { ChallengeResultsModal } from './ChallengeResultsModal';

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
      setFeedback(`✓ MEŞHUR KELİME! +${pts} Pt`);
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
    <div className="flex-1 flex flex-col justify-between p-3 sm:p-4 bg-gradient-to-b from-slate-950 via-[#0a1224] to-slate-950 text-slate-100 overflow-y-auto relative select-none">
      {/* Top Challenge Header Bar */}
      <div className="flex items-center justify-between border-b border-cyan-500/40 pb-2.5 z-10 bg-slate-950/90 px-3 py-2 rounded-2xl shadow-xl">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-md animate-pulse">
            <Zap size={20} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-cyan-300 font-cinzel tracking-wide flex items-center gap-1.5">
              ⚡ SÜRELİ CHALENGE
            </h2>
            <p className="text-[11px] text-slate-400 font-medium">
              Tam doldur ➔ Skor Kap!
            </p>
          </div>
        </div>

        {/* Timer Box */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border text-sm font-black shadow-lg font-mono ${
          timeLeft <= 5
            ? 'bg-rose-950/90 border-rose-500 text-rose-300 animate-ping'
            : 'bg-slate-900 border-cyan-500/50 text-cyan-300'
        }`}>
          <Timer size={16} />
          <span>{timeLeft}s</span>
        </div>
      </div>

      {/* Main Challenge Puzzle Slot Board */}
      <div className="my-auto flex flex-col items-center gap-4 py-4">
        {/* Target Length & Instruction Banner */}
        <div className="text-center space-y-1">
          <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-black tracking-wide uppercase">
            HEDEF: TAM {currentPuzzle.targetLength} KAREYİ DOLDUR
          </span>
        </div>

        {/* TARGET SLOTS BOARD */}
        <div className="flex items-center justify-center gap-2 flex-wrap min-h-20 p-3 rounded-2xl bg-slate-950/80 border border-cyan-500/40 shadow-inner">
          {Array.from({ length: currentPuzzle.targetLength }).map((_, idx) => {
            const placed = placedLetters[idx];
            return (
              <motion.button
                key={`slot_${idx}`}
                onClick={() => placed && handleRemovePlacedLetter(placed)}
                className={`w-11 h-14 sm:w-14 sm:h-18 rounded-2xl border-2 flex items-center justify-center text-xl sm:text-2xl font-black transition-all cursor-pointer shadow-lg ${
                  placed
                    ? 'tile-bevel-amber text-amber-200 border-amber-300 active:scale-95'
                    : 'border-dashed border-cyan-500/40 bg-slate-900/60 text-slate-700'
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
            className="text-xs font-black text-amber-300 bg-slate-900/90 border border-amber-500/40 px-3 py-1 rounded-xl shadow"
          >
            {feedback}
          </motion.div>
        )}

        {/* SCRAMBLED LETTER POOL BUTTONS */}
        <div className="flex items-center justify-center gap-2 flex-wrap max-w-sm">
          {currentPuzzle.scrambledPool.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelectLetter(item)}
              disabled={item.isUsed}
              className={`w-10 h-13 sm:w-12 sm:h-16 rounded-2xl text-lg font-extrabold transition active:scale-95 shadow-md flex items-center justify-center cursor-pointer ${
                item.isUsed
                  ? 'bg-slate-900 border border-slate-800 text-slate-700 cursor-not-allowed opacity-30'
                  : 'tile-bevel-purple text-purple-200 border-purple-400 hover:scale-105'
              }`}
            >
              {item.char}
            </button>
          ))}
        </div>
      </div>

      {/* Action Controls Bar */}
      <div className="flex items-center justify-between gap-2 border-t border-slate-800 pt-3">
        <button
          onClick={handleClearLetters}
          className="py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-black text-xs transition active:scale-95 cursor-pointer"
        >
          <RefreshCw size={14} className="inline mr-1" />
          <span>Temizle</span>
        </button>

        <button
          onClick={handleSubmitWord}
          className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-black text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 transition active:scale-95 shadow-xl shadow-cyan-500/40 border border-cyan-200 cursor-pointer"
        >
          <Check size={16} />
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

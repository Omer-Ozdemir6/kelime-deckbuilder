import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Clock, CheckCircle2, XCircle, ChevronRight, Sparkles, RefreshCw, Lightbulb, Check, Key, Zap, Trophy, Award, Search, Eraser } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TRIVIA_QUESTIONS, generatePuzzleQuestionData } from '../game/triviaData';
import { soundEngine } from '../game/audioEngine';

// Custom 3D SVG Temple Crest Component for Riddles Temple
function TriviaSvgCrest() {
  return (
    <div className="relative flex items-center justify-center shrink-0">
      <div className="absolute w-12 h-12 rounded-full bg-amber-500/20 blur-md pointer-events-none" />
      <svg className="w-10 h-10 drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="44" fill="#311042" stroke="#c084fc" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="36" fill="none" stroke="#e9d5ff" strokeWidth="1" strokeDasharray="4 2" />
        {/* Ancient Temple Key */}
        <path d="M30 50 H65 M65 40 V60 M55 45 V55 M45 45 V55" stroke="#facc15" strokeWidth="4" strokeLinecap="round" />
        <circle cx="30" cy="50" r="8" fill="none" stroke="#facc15" strokeWidth="3" />
        <circle cx="30" cy="50" r="3" fill="#fef08a" />
      </svg>
    </div>
  );
}

export function TriviaScreen({ onResolveTrivia }) {
  const [roundIndex, setRoundIndex] = useState(0); // 0, 1, 2 for 3 rounds
  const totalRounds = 3;

  const [questionData, setQuestionData] = useState(() => generatePuzzleQuestionData());
  const [scrambledPool, setScrambledPool] = useState(() => questionData.scrambledPool);
  const [placedLetters, setPlacedLetters] = useState([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(true);
  const [correctRoundsCount, setCorrectRoundsCount] = useState(0);

  // Lifelines used in current round
  const [letterHintUsed, setLetterHintUsed] = useState(false);
  const [fiftyFiftyUsed, setFiftyFiftyUsed] = useState(false);

  // Reset state for new round
  const loadNewRound = useCallback((round) => {
    const qData = generatePuzzleQuestionData();
    setQuestionData(qData);
    setScrambledPool(qData.scrambledPool);
    setPlacedLetters([]);
    setIsRevealed(false);
    setIsCorrect(false);
    setShowHint(false);
    setFeedback('');
    setTimeLeft(30);
    setTimerActive(true);
    setLetterHintUsed(false);
    setFiftyFiftyUsed(false);
  }, []);

  // 30-second countdown timer
  useEffect(() => {
    if (!timerActive || isRevealed) return;

    if (timeLeft <= 0) {
      setTimerActive(false);
      setIsRevealed(true);
      setIsCorrect(false);
      try { soundEngine.playInvalidWord?.(); } catch(e) {}
      setFeedback(`⏰ SÜRE DOLDU! Doğru cevap: "${questionData.cleanAnswer}"`);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, timerActive, isRevealed, questionData]);

  // Handle tile tap from scrambled pool
  const handleSelectTile = useCallback((item) => {
    if (isRevealed || item.isUsed) return;

    setPlacedLetters(prev => {
      if (prev.some(l => l.id === item.id) || prev.length >= questionData.answerLength) {
        return prev;
      }
      try { soundEngine.playTileClick?.(); } catch(e) {}
      setScrambledPool(pool => pool.map(t => t.id === item.id ? { ...t, isUsed: true } : t));
      return [...prev, item];
    });
  }, [isRevealed, questionData.answerLength]);

  // Handle tile tap from answer slot board (returns to pool)
  const handleRemovePlacedTile = useCallback((item) => {
    if (isRevealed) return;

    setPlacedLetters(prev => {
      if (!prev.some(l => l.id === item.id)) return prev;
      try { soundEngine.playTileClick?.(); } catch(e) {}
      setScrambledPool(pool => pool.map(t => t.id === item.id ? { ...t, isUsed: false } : t));
      return prev.filter(l => l.id !== item.id);
    });
  }, [isRevealed]);

  // Clear all placed tiles back to pool
  const handleClearLetters = useCallback(() => {
    if (isRevealed) return;

    try { soundEngine.playTap?.(); } catch(e) {}
    setPlacedLetters([]);
    setScrambledPool(prev => prev.map(t => ({ ...t, isUsed: false })));
  }, [isRevealed]);

  // Lifeline 1: Reveal 1 Correct Letter
  const handleUseLetterHint = () => {
    if (isRevealed || letterHintUsed) return;
    try { soundEngine.playUpgradeSound?.(); } catch(e) {}
    setLetterHintUsed(true);

    // Find first unplaced answer slot index
    const nextIdx = placedLetters.length;
    if (nextIdx < questionData.answerLength) {
      const correctChar = questionData.cleanAnswer[nextIdx];
      const availableTile = scrambledPool.find(t => !t.isUsed && t.char === correctChar);
      if (availableTile) {
        handleSelectTile(availableTile);
        setFeedback(`💡 "${correctChar}" harfi yerleştirildi!`);
        setTimeout(() => setFeedback(''), 1800);
      }
    }
  };

  // Lifeline 2: 50:50 (Remove 3 Decoy Letters)
  const handleUseFiftyFifty = () => {
    if (isRevealed || fiftyFiftyUsed) return;
    try { soundEngine.playDeleteSound?.(); } catch(e) {}
    setFiftyFiftyUsed(true);

    const answerChars = questionData.cleanAnswer.split('');
    let removedCount = 0;
    setScrambledPool(pool => pool.map(tile => {
      if (!tile.isUsed && !answerChars.includes(tile.char) && removedCount < 3) {
        removedCount++;
        return { ...tile, isUsed: true };
      }
      return tile;
    }));

    setFeedback('💣 3 Yanıltıcı Harf Eleme Yapıldı!');
    setTimeout(() => setFeedback(''), 1800);
  };

  // Submit Answer
  const handleSubmitAnswer = () => {
    if (isRevealed) return;

    if (placedLetters.length < questionData.answerLength) {
      try { soundEngine.playInvalidWord?.(); } catch(e) {}
      setFeedback(`⚠️ Eksik harf! Cevap tam ${questionData.answerLength} harfli olmalı.`);
      setTimeout(() => setFeedback(''), 2000);
      return;
    }

    const userBuiltWord = placedLetters.map(l => l.char).join('');
    const matches = userBuiltWord === questionData.cleanAnswer;

    setTimerActive(false);
    setIsRevealed(true);
    setIsCorrect(matches);

    if (matches) {
      try { soundEngine.playVictory?.(); } catch(e) {}
      setCorrectRoundsCount(prev => prev + 1);
      setFeedback(`🎉 TEBRİKLER! DOĞRU CEVAP: "${questionData.cleanAnswer}"`);
      try {
        confetti({ particleCount: 70, spread: 75, origin: { y: 0.5 } });
      } catch (e) {}
    } else {
      try { soundEngine.playInvalidWord?.(); } catch(e) {}
      setFeedback(`❌ YANLIŞ CEVAP! Sen: "${userBuiltWord}" | Doğru: "${questionData.cleanAnswer}"`);
    }
  };

  // Proceed to Next Round or End Trivia Challenge
  const handleProceedNextRound = () => {
    try { soundEngine.playTap?.(); } catch(e) {}
    if (roundIndex < totalRounds - 1) {
      const nextR = roundIndex + 1;
      setRoundIndex(nextR);
      loadNewRound(nextR);
    } else {
      const wins = correctRoundsCount + (isCorrect ? 1 : 0);
      let rewardType = 'TRIVIA_FAIL';
      if (wins >= 3) rewardType = 'TRIVIA_WIN_100_LEGENDARY';
      else if (wins === 2) rewardType = 'TRIVIA_WIN_60_SPECIAL';
      else if (wins === 1) rewardType = 'TRIVIA_WIN_40';

      onResolveTrivia(rewardType, wins > 0);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-3 sm:p-5 bg-slate-950 text-slate-100 overflow-y-auto relative select-none">
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

      {/* Background SVG Runic Radial Rays */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 z-0">
        <svg className="w-[700px] h-[700px] sm:w-[850px] sm:h-[850px] text-amber-500/35 animate-spin-slow" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="6 3" />
          <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <polygon points="100,20 180,100 100,180 20,100" fill="none" stroke="currentColor" strokeWidth="1" />
          <polygon points="100,10 190,100 100,190 10,100" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 2" />
        </svg>
      </div>

      {/* ── 1. TOP HEADER BAR WITH TEMPLE SVG CREST & TIMER ── */}
      <div className="z-10 space-y-2.5 max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between border-2 border-amber-500/60 bg-slate-950/95 px-4 py-3 rounded-3xl shadow-[0_0_35px_rgba(245,158,11,0.3)] backdrop-blur-2xl">
          <div className="flex items-center gap-3">
            <TriviaSvgCrest />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-amber-300 uppercase tracking-widest block font-cinzel">
                  💡 BİLMECELER TAPINAĞI
                </span>
                <span className="px-3 py-0.5 rounded-full bg-amber-950 border border-amber-400/60 text-amber-300 font-mono font-black text-[10px]">
                  SORU {roundIndex + 1}/{totalRounds}
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-200">{questionData.category}</h3>
            </div>
          </div>

          {/* Countdown Timer Badge */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border-2 text-xs sm:text-sm font-black transition-all ${
            timeLeft <= 8 && !isRevealed
              ? 'bg-rose-950 border-rose-500 text-rose-300 animate-pulse ring-2 ring-rose-500/50'
              : 'bg-slate-900 border-amber-400/60 text-amber-300'
          }`}>
            <Clock size={18} className={timeLeft <= 8 && !isRevealed ? 'text-rose-400 animate-bounce' : 'text-amber-400'} />
            <span className="font-mono text-base">{timeLeft}s</span>
          </div>
        </div>

        {/* Animated Timer Gauge */}
        <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border-2 border-slate-800 shadow-inner">
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: `${(timeLeft / 30) * 100}%` }}
            transition={{ duration: 1, ease: 'linear' }}
            className={`h-full ${
              timeLeft <= 8 ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)]' : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500'
            }`}
          />
        </div>

        {/* ── 2. QUESTION CARD BOX ── */}
        <div className="p-4 sm:p-6 rounded-3xl bg-slate-950/95 border-2 border-amber-500/60 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="px-3 py-1 rounded-full bg-amber-950 border border-amber-400/60 text-amber-300 text-[10px] font-black tracking-wider uppercase">
              BİLMECE SORUSU
            </span>
            <span className="text-[10px] font-bold text-slate-400">
              Klavye ile doğrudan harf yazabilirsiniz
            </span>
          </div>

          <p className="text-base sm:text-xl font-extrabold text-slate-100 leading-relaxed relative z-10 font-cinzel my-2">
            "{questionData.question}"
          </p>

          {/* Hint text if active */}
          {showHint && questionData.hint && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-xs font-bold text-amber-300 bg-amber-950/80 px-3.5 py-1.5 rounded-xl border border-amber-500/50 inline-flex items-center gap-1.5"
            >
              <Lightbulb size={15} className="text-amber-400 shrink-0" />
              <span>İpucu: {questionData.hint}</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── 3. ANSWER SLOTS BOARD & SCRAMBLED POOL ── */}
      <div className="my-auto flex flex-col items-center gap-3 py-2 z-10 max-w-4xl mx-auto w-full">
        <span className="text-[11px] font-black text-amber-300 tracking-widest uppercase flex items-center gap-1.5 font-cinzel">
          <Key size={14} className="text-amber-400" />
          <span>TAŞLARI DİZEREK CEVABI OLUŞTUR ({placedLetters.length} / {questionData.answerLength})</span>
        </span>

        {/* Answer Slots Container */}
        <div className="flex items-center justify-center gap-2 flex-wrap min-h-16 p-3 sm:p-4 rounded-3xl bg-slate-950/95 border-2 border-amber-500/60 shadow-2xl max-w-full backdrop-blur-2xl">
          {Array.from({ length: questionData.answerLength }).map((_, idx) => {
            const placed = placedLetters[idx];
            return (
              <motion.button
                key={`slot_${idx}`}
                whileTap={{ scale: 0.95 }}
                disabled={isRevealed}
                onClick={() => placed && handleRemovePlacedTile(placed)}
                className={`w-11 h-14 sm:w-14 sm:h-16 rounded-2xl border-2 flex items-center justify-center text-xl sm:text-2xl font-black transition-all cursor-pointer shadow-xl ${
                  placed
                    ? isRevealed
                      ? isCorrect
                        ? 'bg-emerald-950 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(52,211,153,0.6)]'
                        : 'bg-rose-950 border-rose-500 text-rose-200'
                      : 'bg-gradient-to-b from-amber-400 via-yellow-400 to-amber-500 text-slate-950 border-yellow-100 font-extrabold shadow-amber-500/50'
                    : 'border-dashed border-amber-500/40 bg-slate-900/60 text-slate-700'
                }`}
              >
                {placed ? placed.char : ''}
              </motion.button>
            );
          })}
        </div>

        {/* Dynamic Feedback Message */}
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-xs sm:text-sm font-black px-4 py-2 rounded-2xl shadow-lg border text-center ${
              isRevealed
                ? isCorrect
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                  : 'bg-rose-950 border-rose-500 text-rose-300'
                : 'bg-amber-950 border-amber-500 text-amber-300'
            }`}
          >
            {feedback}
          </motion.div>
        )}

        {/* SCRAMBLED LETTER TILE POOL ("TAŞLAR") */}
        {!isRevealed && (
          <div className="flex items-center justify-center gap-2 flex-wrap max-w-md my-1">
            {scrambledPool.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleSelectTile(item)}
                disabled={item.isUsed || isRevealed}
                className={`w-10 h-13 sm:w-12 sm:h-15 rounded-2xl text-lg sm:text-xl font-extrabold transition shadow-md flex items-center justify-center cursor-pointer border-2 ${
                  item.isUsed
                    ? 'bg-slate-950 border-slate-800 text-slate-700 cursor-not-allowed opacity-20'
                    : 'bg-gradient-to-b from-purple-800 via-indigo-900 to-slate-950 text-purple-100 border-purple-400 hover:border-purple-300 shadow-purple-950/50'
                }`}
              >
                {item.char}
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* ── 4. BOTTOM ACTION & CONTROL BUTTONS DOCK ── */}
      <div className="z-20 max-w-4xl mx-auto w-full mt-auto">
        <div className="bg-slate-950/95 border-2 border-slate-800 rounded-3xl p-3 sm:p-4 shadow-[0_15px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl flex flex-col gap-3">
          
          {/* TOP DOCK ROW: LIFELINES & HINTS */}
          {!isRevealed && (
            <div className="flex items-center justify-between gap-2 flex-wrap">
              {/* Hint button */}
              {questionData.hint && !showHint && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { try { soundEngine.playTap?.(); } catch(e) {} setShowHint(true); }}
                  className="px-3.5 py-2 rounded-2xl bg-amber-950/90 border-2 border-amber-500/70 text-amber-300 hover:bg-amber-900 font-extrabold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg"
                >
                  <Lightbulb size={15} className="text-amber-400" />
                  <span>İpucu Göster</span>
                </motion.button>
              )}

              {/* Lifeline 1: Harf Aç */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleUseLetterHint}
                disabled={isRevealed || letterHintUsed}
                className={`px-3.5 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 transition border-2 ${
                  letterHintUsed
                    ? 'bg-slate-950 border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                    : 'bg-indigo-950 border-indigo-400 text-indigo-200 hover:bg-indigo-900 cursor-pointer shadow-lg'
                }`}
              >
                <Search size={14} />
                <span>Harf Aç {letterHintUsed ? '(Kullanıldı)' : ''}</span>
              </motion.button>

              {/* Lifeline 2: 50:50 Ele */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleUseFiftyFifty}
                disabled={isRevealed || fiftyFiftyUsed}
                className={`px-3.5 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 transition border-2 ${
                  fiftyFiftyUsed
                    ? 'bg-slate-950 border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                    : 'bg-rose-950 border-rose-400 text-rose-200 hover:bg-rose-900 cursor-pointer shadow-lg'
                }`}
              >
                <Eraser size={14} />
                <span>50:50 Ele {fiftyFiftyUsed ? '(Kullanıldı)' : ''}</span>
              </motion.button>
            </div>
          )}

          {/* BOTTOM DOCK ROW: MAIN CONTROLS (TEMİZLE & CEVAPLA OR NEXT ROUND) */}
          {!isRevealed ? (
            <div className="flex items-center gap-3 w-full">
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                onClick={handleClearLetters}
                disabled={placedLetters.length === 0}
                className="py-3.5 px-4 rounded-2xl bg-slate-900 border-2 border-slate-700 hover:bg-slate-800 text-slate-300 disabled:opacity-40 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shrink-0"
              >
                <RefreshCw size={16} />
                <span>TEMİZLE</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                onClick={handleSubmitAnswer}
                disabled={placedLetters.length < questionData.answerLength}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-base flex items-center justify-center gap-2 transition disabled:opacity-40 cursor-pointer shadow-2xl shadow-emerald-500/40 tracking-wider border-2 border-yellow-100"
              >
                <Check size={20} />
                <span>CEVAPLA VE ONAYLA</span>
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              onClick={handleProceedNextRound}
              className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black py-4 px-6 rounded-2xl transition flex items-center justify-center gap-2.5 shadow-2xl text-xs sm:text-base tracking-wider border-2 border-yellow-100 cursor-pointer"
            >
              <span>
                {roundIndex < totalRounds - 1
                  ? `SIRADAKİ BİLMECEYE GEÇ (${roundIndex + 2}/${totalRounds})`
                  : 'BİLMECE SINAVINI TAMAMLA VE ÖDÜLÜ AL'}
              </span>
              <ChevronRight size={20} />
            </motion.button>
          )}

        </div>
      </div>
    </div>
  );
}

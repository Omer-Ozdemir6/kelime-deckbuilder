import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Clock, CheckCircle2, XCircle, ChevronRight, Sparkles, RefreshCw, Lightbulb, Check, Key, Zap, Trophy, Award, Search, Eraser } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TRIVIA_QUESTIONS, generatePuzzleQuestionData } from '../game/triviaData';
import { soundEngine } from '../game/audioEngine';

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
      soundEngine.playInvalidWord();
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
      soundEngine.playTileClick();
      setScrambledPool(pool => pool.map(t => t.id === item.id ? { ...t, isUsed: true } : t));
      return [...prev, item];
    });
  }, [isRevealed, questionData.answerLength]);

  // Handle tile tap from answer slot board (returns to pool)
  const handleRemovePlacedTile = useCallback((item) => {
    if (isRevealed) return;

    setPlacedLetters(prev => {
      if (!prev.some(l => l.id === item.id)) return prev;
      soundEngine.playTileClick();
      setScrambledPool(pool => pool.map(t => t.id === item.id ? { ...t, isUsed: false } : t));
      return prev.filter(l => l.id !== item.id);
    });
  }, [isRevealed]);

  // Clear all placed tiles back to pool
  const handleClearLetters = useCallback(() => {
    if (isRevealed) return;

    soundEngine.playTap();
    setPlacedLetters([]);
    setScrambledPool(prev => prev.map(t => ({ ...t, isUsed: false })));
  }, [isRevealed]);



  // Lifeline 1: Reveal 1 Correct Letter
  const handleUseLetterHint = () => {
    if (isRevealed || letterHintUsed) return;
    soundEngine.playUpgradeSound();
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
    soundEngine.playDeleteSound();
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
      soundEngine.playInvalidWord();
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
      soundEngine.playVictory();
      setCorrectRoundsCount(prev => prev + 1);
      setFeedback(`🎉 TEBRİKLER! DOĞRU CEVAP: "${questionData.cleanAnswer}"`);
      try {
        confetti({ particleCount: 70, spread: 75, origin: { y: 0.5 } });
      } catch (e) {}
    } else {
      soundEngine.playInvalidWord();
      setFeedback(`❌ YANLIŞ CEVAP! Sen: "${userBuiltWord}" | Doğru: "${questionData.cleanAnswer}"`);
    }
  };

  // Proceed to Next Round or End Trivia Challenge
  const handleProceedNextRound = () => {
    soundEngine.playTap();
    if (roundIndex < totalRounds - 1) {
      const nextR = roundIndex + 1;
      setRoundIndex(nextR);
      loadNewRound(nextR);
    } else {
      // All 3 rounds done! Calculate grand reward
      const wins = correctRoundsCount + (isCorrect ? 1 : 0);
      let rewardType = 'TRIVIA_FAIL';
      if (wins >= 3) rewardType = 'TRIVIA_WIN_100_LEGENDARY';
      else if (wins === 2) rewardType = 'TRIVIA_WIN_60_SPECIAL';
      else if (wins === 1) rewardType = 'TRIVIA_WIN_40';

      onResolveTrivia(rewardType, wins > 0);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-3 sm:p-5 bg-gradient-to-b from-slate-950 via-[#0a1226] to-slate-950 text-slate-100 overflow-y-auto relative select-none">
      {/* Ambient Glow Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-cyan-500/10 blur-[100px] pointer-events-none" />

      {/* Top Header Bar */}
      <div className="z-10 space-y-2">
        <div className="flex items-center justify-between border-b border-cyan-500/40 pb-2.5 bg-slate-950/90 px-3.5 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl sm:text-3xl drop-shadow-md">{questionData.categoryIcon}</span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">
                  💡 BİLMECELER TAPINAĞI
                </span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-mono font-black text-[10px]">
                  SORU {roundIndex + 1}/{totalRounds}
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-100">{questionData.category}</h3>
            </div>
          </div>

          {/* Countdown Timer Badge */}
          <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl border text-xs sm:text-sm font-black transition-all ${
            timeLeft <= 8 && !isRevealed
              ? 'bg-rose-950/90 border-rose-500 text-rose-300 animate-pulse ring-2 ring-rose-500/50'
              : 'bg-slate-900 border-cyan-500/50 text-amber-300'
          }`}>
            <Clock size={16} className={timeLeft <= 8 && !isRevealed ? 'text-rose-400 animate-bounce' : 'text-amber-400'} />
            <span className="font-mono">{timeLeft}s</span>
          </div>
        </div>

        {/* Animated Timer Bar */}
        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800 shadow-inner">
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: `${(timeLeft / 30) * 100}%` }}
            transition={{ duration: 1, ease: 'linear' }}
            className={`h-full ${
              timeLeft <= 8 ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)]' : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500'
            }`}
          />
        </div>

        {/* Question Card Box */}
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border-2 border-cyan-500/40 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-cyan-400 pointer-events-none">
            <HelpCircle size={90} />
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-[10px] font-black tracking-wide uppercase">
              BİLMECE SORUSU
            </span>
            <span className="text-[10px] font-semibold text-slate-400">
              Klavye ile doğrudan harf yazabilirsiniz
            </span>
          </div>

          <p className="text-sm sm:text-lg font-extrabold text-slate-100 leading-relaxed relative z-10 font-cinzel">
            "{questionData.question}"
          </p>

          {/* Lifelines & Hints Bar */}
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
            {/* Hint text */}
            {questionData.hint && (
              <div>
                {showHint ? (
                  <span className="text-xs font-semibold text-amber-300 italic flex items-center gap-1.5">
                    <Lightbulb size={14} className="text-amber-400 shrink-0" />
                    İpucu: {questionData.hint}
                  </span>
                ) : (
                  <button
                    onClick={() => { soundEngine.playTap(); setShowHint(true); }}
                    className="text-xs font-extrabold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition cursor-pointer bg-amber-950/60 px-2.5 py-1 rounded-xl border border-amber-500/40"
                  >
                    <Lightbulb size={13} />
                    <span>İpucu Göster</span>
                  </button>
                )}
              </div>
            )}

            {/* Interactive Lifeline Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleUseLetterHint}
                disabled={isRevealed || letterHintUsed}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-black flex items-center gap-1 transition border ${
                  letterHintUsed
                    ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                    : 'bg-indigo-950 border-indigo-500/60 text-indigo-300 hover:bg-indigo-900 cursor-pointer shadow-md'
                }`}
                title="Cevaptan 1 doğru harfi slotlara yerleştirir"
              >
                <Search size={12} />
                <span>Harf Aç {letterHintUsed ? '(Kullanıldı)' : ''}</span>
              </button>

              <button
                onClick={handleUseFiftyFifty}
                disabled={isRevealed || fiftyFiftyUsed}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-black flex items-center gap-1 transition border ${
                  fiftyFiftyUsed
                    ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                    : 'bg-rose-950 border-rose-500/60 text-rose-300 hover:bg-rose-900 cursor-pointer shadow-md'
                }`}
                title="Aşağıdaki harflerden 3 gereksiz harfi eler"
              >
                <Eraser size={12} />
                <span>50:50 Ele {fiftyFiftyUsed ? '(Kullanıldı)' : ''}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ANSWER SLOTS BOARD */}
      <div className="my-auto flex flex-col items-center gap-3 py-3 z-10">
        <span className="text-[11px] font-black text-slate-300 tracking-wider uppercase flex items-center gap-1.5">
          <Key size={13} className="text-amber-400" />
          <span>TAŞLARI DİZEREK CEVABI OLUŞTUR ({placedLetters.length} / {questionData.answerLength})</span>
        </span>

        {/* Answer Slots Container */}
        <div className="flex items-center justify-center gap-2 flex-wrap min-h-16 p-3 sm:p-4 rounded-3xl bg-slate-950/90 border-2 border-cyan-500/40 shadow-2xl max-w-full">
          {Array.from({ length: questionData.answerLength }).map((_, idx) => {
            const placed = placedLetters[idx];
            return (
              <motion.button
                key={`slot_${idx}`}
                whileTap={{ scale: 0.95 }}
                disabled={isRevealed}
                onClick={() => placed && handleRemovePlacedTile(placed)}
                className={`w-11 h-14 sm:w-13 sm:h-16 rounded-2xl border-2 flex items-center justify-center text-xl sm:text-2xl font-black transition-all cursor-pointer shadow-xl ${
                  placed
                    ? isRevealed
                      ? isCorrect
                        ? 'bg-emerald-950 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(52,211,153,0.6)] animate-pulse'
                        : 'bg-rose-950 border-rose-500 text-rose-200'
                      : 'tile-bevel-amber text-amber-200 border-amber-300 active:scale-95'
                    : 'border-dashed border-cyan-500/40 bg-slate-900/60 text-slate-700'
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
                  ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-300'
                  : 'bg-rose-950/90 border-rose-500/60 text-rose-300'
                : 'bg-amber-950/90 border-amber-500/60 text-amber-300'
            }`}
          >
            {feedback}
          </motion.div>
        )}

        {/* SCRAMBLED LETTER TILE POOL ("TAŞLAR") */}
        {!isRevealed && (
          <div className="flex flex-col items-center gap-3 w-full max-w-md mt-1">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {scrambledPool.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleSelectTile(item)}
                  disabled={item.isUsed || isRevealed}
                  className={`w-10 h-13 sm:w-12 sm:h-15 rounded-2xl text-lg sm:text-xl font-extrabold transition shadow-md flex items-center justify-center cursor-pointer ${
                    item.isUsed
                      ? 'bg-slate-900 border border-slate-800 text-slate-700 cursor-not-allowed opacity-20'
                      : 'tile-bevel-purple text-purple-200 border-purple-400 hover:border-purple-300'
                  }`}
                >
                  {item.char}
                </motion.button>
              ))}
            </div>

            {/* Controls Bar: Temizle & Cevapla */}
            <div className="flex items-center gap-3 w-full px-2 mt-2">
              <button
                onClick={handleClearLetters}
                disabled={placedLetters.length === 0}
                className="flex-1 py-3 px-3 rounded-2xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 disabled:opacity-40 font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
              >
                <RefreshCw size={14} />
                <span>TEMİZLE</span>
              </button>

              <button
                onClick={handleSubmitAnswer}
                disabled={placedLetters.length < questionData.answerLength}
                className="flex-2 py-3 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition disabled:opacity-40 cursor-pointer shadow-xl shadow-cyan-500/30 tracking-wide border border-cyan-300"
              >
                <Check size={18} />
                <span>CEVAPLA</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Result Status & Proceed Button */}
      {isRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-3 mt-2 z-10"
        >
          {/* Feedback Result Banner */}
          <div className={`w-full p-3.5 rounded-2xl border flex items-center justify-center gap-2 text-xs sm:text-sm font-black shadow-xl ${
            isCorrect
              ? 'bg-emerald-950/95 border-emerald-500/80 text-emerald-300'
              : 'bg-rose-950/95 border-rose-500/80 text-rose-300'
          }`}>
            {isCorrect ? (
              <>
                <Sparkles size={18} className="text-amber-300" />
                <span>DOĞRU CEVAP! TEBRİKLER! ({roundIndex + 1}/{totalRounds} Soru Başarıyla Çözüldü)</span>
              </>
            ) : (
              <>
                <XCircle size={18} className="text-rose-400" />
                <span>MAALESEF YANLIŞ CEVAP! Doğru Cevap: "{questionData.cleanAnswer}"</span>
              </>
            )}
          </div>

          {/* Proceed Button */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleProceedNextRound}
            className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black py-4 px-6 rounded-2xl transition flex items-center justify-center gap-2 shadow-2xl shadow-amber-500/40 text-sm tracking-wider border border-amber-300 cursor-pointer"
          >
            <span>
              {roundIndex < totalRounds - 1
                ? `SIRADAKİ BİLMECEYE GEÇ (${roundIndex + 2}/${totalRounds})`
                : 'BİLMECE SINAVINI TAMAMLA VE ÖDÜLÜ AL'}
            </span>
            <ChevronRight size={18} />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}

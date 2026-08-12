import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Clock, CheckCircle2, XCircle, ChevronRight, Sparkles, RefreshCw, Lightbulb, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getRandomTriviaQuestion } from '../game/triviaData';
import { soundEngine } from '../game/audioEngine';

export function TriviaScreen({ onResolveTrivia }) {
  const [questionData, setQuestionData] = useState(() => getRandomTriviaQuestion());
  const [scrambledPool, setScrambledPool] = useState(() => questionData.scrambledPool);
  const [placedLetters, setPlacedLetters] = useState([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(true);

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
  const handleSelectTile = (item) => {
    if (isRevealed || item.isUsed) return;

    setPlacedLetters(prev => {
      if (prev.some(l => l.id === item.id) || prev.length >= questionData.answerLength) {
        return prev;
      }
      soundEngine.playTileClick();
      setScrambledPool(pool => pool.map(t => t.id === item.id ? { ...t, isUsed: true } : t));
      return [...prev, item];
    });
  };

  // Handle tile tap from answer slot board (returns to pool)
  const handleRemovePlacedTile = (item) => {
    if (isRevealed) return;

    setPlacedLetters(prev => {
      if (!prev.some(l => l.id === item.id)) return prev;
      soundEngine.playTileClick();
      setScrambledPool(pool => pool.map(t => t.id === item.id ? { ...t, isUsed: false } : t));
      return prev.filter(l => l.id !== item.id);
    });
  };

  // Clear all placed tiles back to pool
  const handleClearLetters = () => {
    if (isRevealed) return;

    soundEngine.playTap();
    setPlacedLetters([]);
    setScrambledPool(prev => prev.map(t => ({ ...t, isUsed: false })));
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
      setFeedback(`🎉 TEBRİKLER! DOĞRU CEVAP: "${questionData.cleanAnswer}"`);
      try {
        confetti({ particleCount: 65, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    } else {
      soundEngine.playInvalidWord();
      setFeedback(`❌ YANLIŞ CEVAP! Sen: "${userBuiltWord}" | Doğru: "${questionData.cleanAnswer}"`);
    }
  };

  const handleProceed = () => {
    soundEngine.playTap();
    onResolveTrivia(isCorrect ? 'TRIVIA_WIN_40' : 'TRIVIA_FAIL', isCorrect);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-3 sm:p-4 bg-gradient-to-b from-slate-950 via-[#0d1527] to-slate-950 text-slate-100 overflow-y-auto relative select-none">
      {/* Top Header Bar */}
      <div>
        <div className="flex items-center justify-between border-b border-cyan-500/40 pb-2.5 mb-2 bg-slate-950/90 px-3 py-2 rounded-2xl shadow-xl">
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl">{questionData.categoryIcon}</span>
            <div>
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">
                💡 BULMACA & BİLMECE
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-slate-200">{questionData.category}</h3>
            </div>
          </div>

          {/* Countdown Timer Badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border text-xs sm:text-sm font-black transition-all ${
            timeLeft <= 5 && !isRevealed
              ? 'bg-rose-950/90 border-rose-500 text-rose-300 animate-pulse'
              : 'bg-slate-900 border-cyan-500/50 text-amber-300'
          }`}>
            <Clock size={16} className={timeLeft <= 5 && !isRevealed ? 'text-rose-400' : 'text-amber-400'} />
            <span>{timeLeft}s</span>
          </div>
        </div>

        {/* Animated Timer Bar */}
        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mb-3 border border-slate-800">
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: `${(timeLeft / 30) * 100}%` }}
            transition={{ duration: 1, ease: 'linear' }}
            className={`h-full ${
              timeLeft <= 5 ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-400 to-yellow-400'
            }`}
          />
        </div>

        {/* Question Card Box */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10 text-cyan-400">
            <HelpCircle size={70} />
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-[10px] font-black tracking-wide uppercase mb-2 inline-block">
            SORU
          </span>
          <p className="text-sm sm:text-base font-extrabold text-slate-100 leading-relaxed relative z-10">
            "{questionData.question}"
          </p>

          {/* Optional Hint Button / Box */}
          {questionData.hint && (
            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
              {showHint ? (
                <span className="text-xs font-semibold text-amber-300 italic flex items-center gap-1.5">
                  <Lightbulb size={14} className="text-amber-400 shrink-0" />
                  İpucu: {questionData.hint}
                </span>
              ) : (
                <button
                  onClick={() => {
                    soundEngine.playTap();
                    setShowHint(true);
                  }}
                  className="text-[11px] font-bold text-amber-400/80 hover:text-amber-300 flex items-center gap-1 transition cursor-pointer"
                >
                  <Lightbulb size={13} />
                  <span>İpucu Göster</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ANSWER SLOTS BOARD */}
      <div className="my-auto flex flex-col items-center gap-3 py-3">
        <span className="text-[11px] font-black text-slate-400 tracking-wider uppercase">
          TAŞLARI DİZEREK CEVABI OLUŞTUR ({placedLetters.length} / {questionData.answerLength})
        </span>

        {/* Answer Slots Container */}
        <div className="flex items-center justify-center gap-2 flex-wrap min-h-16 p-3 rounded-2xl bg-slate-950/80 border border-cyan-500/30 shadow-inner max-w-full">
          {Array.from({ length: questionData.answerLength }).map((_, idx) => {
            const placed = placedLetters[idx];
            return (
              <motion.button
                key={`slot_${idx}`}
                whileTap={{ scale: 0.95 }}
                disabled={isRevealed}
                onClick={() => placed && handleRemovePlacedTile(placed)}
                className={`w-11 h-14 sm:w-13 sm:h-16 rounded-2xl border-2 flex items-center justify-center text-xl sm:text-2xl font-black transition-all cursor-pointer shadow-lg ${
                  placed
                    ? isRevealed
                      ? isCorrect
                        ? 'bg-emerald-950 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(52,211,153,0.4)]'
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
            className={`text-xs font-black px-3.5 py-1.5 rounded-xl shadow border text-center ${
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
          <div className="flex flex-col items-center gap-3 w-full max-w-sm mt-1">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {scrambledPool.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectTile(item)}
                  disabled={item.isUsed || isRevealed}
                  className={`w-10 h-13 sm:w-12 sm:h-15 rounded-2xl text-lg font-extrabold transition active:scale-95 shadow-md flex items-center justify-center cursor-pointer ${
                    item.isUsed
                      ? 'bg-slate-900 border border-slate-800 text-slate-700 cursor-not-allowed opacity-30'
                      : 'tile-bevel-purple text-purple-200 border-purple-400 hover:scale-105'
                  }`}
                >
                  {item.char}
                </button>
              ))}
            </div>

            {/* Controls Bar: Temizle & Cevapla */}
            <div className="flex items-center gap-3 w-full px-2 mt-1">
              <button
                onClick={handleClearLetters}
                disabled={placedLetters.length === 0}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 disabled:opacity-40 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow"
              >
                <RefreshCw size={14} />
                <span>TEMİZLE</span>
              </button>

              <button
                onClick={handleSubmitAnswer}
                disabled={placedLetters.length < questionData.answerLength}
                className="flex-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-40 cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                <Check size={16} />
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
          className="flex flex-col items-center gap-3 mt-2"
        >
          {/* Feedback Result Banner */}
          <div className={`w-full p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs sm:text-sm font-black shadow-md ${
            isCorrect
              ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-300'
              : 'bg-rose-950/90 border-rose-500/60 text-rose-300'
          }`}>
            {isCorrect ? (
              <>
                <Sparkles size={18} className="text-amber-300" />
                <span>DOĞRU CEVAP! TEBRİKLER! (+40 💰 Altın Kazandın)</span>
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
            onClick={handleProceed}
            className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black py-3.5 px-5 rounded-2xl transition flex items-center justify-center gap-2 shadow-2xl shadow-amber-500/30 text-sm tracking-wide border border-amber-300 cursor-pointer animate-pulse-glow"
          >
            <span>ÖDÜLÜ AL VE DEVAM ET</span>
            <ChevronRight size={18} />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}

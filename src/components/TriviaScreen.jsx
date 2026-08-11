import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Clock, CheckCircle2, XCircle, ChevronRight, Award, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getRandomTriviaQuestion } from '../game/triviaData';
import { soundEngine } from '../game/audioEngine';

export function TriviaScreen({ onResolveTrivia }) {
  const [questionData] = useState(() => getRandomTriviaQuestion());
  const [selectedOption, setSelectedOption] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [timerActive, setTimerActive] = useState(true);

  // 15-second countdown timer
  useEffect(() => {
    if (!timerActive || isRevealed) return;

    if (timeLeft <= 0) {
      setTimerActive(false);
      setIsRevealed(true);
      soundEngine.playInvalidWord();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, timerActive, isRevealed]);

  const handleSelectOption = (idx) => {
    if (selectedOption !== null || isRevealed) return;

    soundEngine.playTap();
    setTimerActive(false);
    setSelectedOption(idx);

    // 800ms reveal delay with suspense feedback
    setTimeout(() => {
      setIsRevealed(true);
      const isCorrect = idx === questionData.correctIndex;
      if (isCorrect) {
        soundEngine.playVictory();
        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        } catch (e) {}
      } else {
        soundEngine.playInvalidWord();
      }
    }, 850);
  };

  const handleProceed = () => {
    soundEngine.playTap();
    const isCorrect = selectedOption === questionData.correctIndex;
    onResolveTrivia(isCorrect ? 'TRIVIA_WIN_40' : 'TRIVIA_FAIL', isCorrect);
  };

  const isCorrectAnswer = selectedOption === questionData.correctIndex;
  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="flex-1 flex flex-col justify-between p-4 bg-gradient-to-b from-slate-950 via-[#0d1527] to-slate-950 text-slate-100 overflow-y-auto">
      {/* Top Category & Timer Bar */}
      <div>
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{questionData.categoryIcon}</span>
            <div>
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">
                💡 BİLMECE & GENEL KÜLTÜR
              </span>
              <h3 className="text-xs font-bold text-slate-300">{questionData.category}</h3>
            </div>
          </div>

          {/* Countdown Timer Badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-black transition-all ${
            timeLeft <= 5 && !isRevealed
              ? 'bg-rose-950/80 border-rose-500/80 text-rose-300 animate-pulse'
              : 'bg-slate-900 border-slate-700 text-amber-300'
          }`}>
            <Clock size={14} className={timeLeft <= 5 && !isRevealed ? 'text-rose-400' : 'text-amber-400'} />
            <span>{timeLeft}s</span>
          </div>
        </div>

        {/* Animated Timer Progress Bar */}
        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mb-4 border border-slate-800">
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: `${(timeLeft / 15) * 100}%` }}
            transition={{ duration: 1, ease: 'linear' }}
            className={`h-full ${
              timeLeft <= 5 ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-400 to-yellow-400'
            }`}
          />
        </div>

        {/* Question Card Box */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-xl mb-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10 text-slate-400">
            <HelpCircle size={60} />
          </div>
          <p className="text-sm sm:text-base font-extrabold text-slate-100 leading-relaxed relative z-10">
            "{questionData.question}"
          </p>
        </div>
      </div>

      {/* 4 Options Grid */}
      <div className="flex flex-col gap-2.5 my-2">
        {questionData.options.map((optText, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrectIndex = idx === questionData.correctIndex;

          let btnStyle = 'bg-slate-900/90 border-slate-700/80 text-slate-200 hover:border-amber-500/60';

          if (!isRevealed) {
            if (isSelected) {
              btnStyle = 'bg-amber-950/80 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse ring-1 ring-amber-400';
            }
          } else {
            if (isCorrectIndex) {
              btnStyle = 'bg-emerald-950/90 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(52,211,153,0.3)] font-black ring-1 ring-emerald-400';
            } else if (isSelected && !isCorrectIndex) {
              btnStyle = 'bg-rose-950/90 border-rose-500 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.3)] font-black ring-1 ring-rose-500';
            } else {
              btnStyle = 'bg-slate-950/50 border-slate-850 text-slate-600 opacity-50';
            }
          }

          return (
            <motion.button
              key={idx}
              whileTap={{ scale: 0.97 }}
              disabled={selectedOption !== null || isRevealed}
              onClick={() => handleSelectOption(idx)}
              className={`p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between text-left shadow-md cursor-pointer ${btnStyle}`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs border shrink-0 ${
                  isRevealed && isCorrectIndex
                    ? 'bg-emerald-500 text-slate-950 border-emerald-300'
                    : isRevealed && isSelected && !isCorrectIndex
                    ? 'bg-rose-500 text-white border-rose-300'
                    : isSelected
                    ? 'bg-amber-400 text-slate-950 border-amber-200'
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}>
                  {optionLabels[idx]}
                </span>
                <span className="text-xs sm:text-sm font-bold leading-snug">
                  {optText}
                </span>
              </div>

              {/* Status Icons */}
              {isRevealed && isCorrectIndex && (
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
              )}
              {isRevealed && isSelected && !isCorrectIndex && (
                <XCircle size={18} className="text-rose-400 shrink-0" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Result Status & Proceed Button */}
      <div className="mt-3">
        <AnimatePresence>
          {isRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-3"
            >
              {/* Feedback Result Banner */}
              <div className={`w-full p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-black shadow-md ${
                isCorrectAnswer
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                  : 'bg-rose-950/80 border-rose-500/60 text-rose-300'
              }`}>
                {isCorrectAnswer ? (
                  <>
                    <Sparkles size={16} className="text-amber-300" />
                    <span>DOĞRU CEVAP! TEBRİKLER! (+40 💰 Altın Kazandın)</span>
                  </>
                ) : (
                  <>
                    <XCircle size={16} className="text-rose-400" />
                    <span>MAALESEF YANLIŞ CEVAP! (Doğru cevap yeşil işaretlendi)</span>
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
        </AnimatePresence>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Coins, ChevronRight, CheckCircle2, Flame, Calculator, Sparkles, Lightbulb } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../game/audioEngine';

export function StageVictoryModal({
  stage,
  score,
  targetScore,
  goldEarned,
  playedWords = [],
  combo = 1,
  onProceedToRewards,
  onOpenMeaningModal
}) {
  const [activeTab, setActiveTab] = useState('GOLD'); // 'GOLD' or 'SCORE'
  const [visibleLineCount, setVisibleLineCount] = useState(0);

  useEffect(() => {
    try {
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  }, []);

  // Gold Calculations (including Balatro-style Interest: +1 Gold per 10 Gold held, max +5)
  const baseStageGold = Math.max(3, goldEarned || 4);
  const wordGoldTotal = Math.max(1, Math.floor(playedWords.length * 0.75));
  const comboBonusGold = combo > 1 ? Math.min(6, Math.floor(combo * 1.2)) : 0;
  const overkillGold = score > targetScore ? Math.min(8, Math.floor((score - targetScore) / 20)) : 0;
  const interestGold = Math.min(5, Math.floor((goldEarned + 15) / 10));
  const grandTotalGold = baseStageGold + wordGoldTotal + comboBonusGold + overkillGold + interestGold;

  // Build Gold calculation lines array
  const goldLines = [
    { id: 'base', icon: '🏛️', label: 'Mücadele Başarı Ödülü', val: `+${baseStageGold} 💰`, color: 'text-amber-300' },
    { id: 'words', icon: '🔤', label: `Kelimeler (${playedWords.length} Adet)`, val: `+${wordGoldTotal} 💰`, color: 'text-amber-300' },
    ...(comboBonusGold > 0 ? [{ id: 'combo', icon: '🔥', label: `Kombo Serisi Ödülü (×${combo})`, val: `+${comboBonusGold} 💰`, color: 'text-orange-300' }] : []),
    ...(overkillGold > 0 ? [{ id: 'overkill', icon: '✨', label: 'Skor Fazlası Performans', val: `+${overkillGold} 💰`, color: 'text-emerald-300' }] : []),
    ...(interestGold > 0 ? [{ id: 'interest', icon: '🏦', label: 'Banka Faiz Geliri (Her 10 Altına +1)', val: `+${interestGold} 💰`, color: 'text-yellow-300 font-bold' }] : []),
    { id: 'total', icon: '🏆', label: 'KAZANILAN NET ALTIN', val: `+${grandTotalGold} 💰`, color: 'text-amber-400 font-extrabold text-sm', isTotal: true }
  ];

  // Build Score calculation lines array
  let runningScore = 0;
  const scoreLines = playedWords.map((word, idx) => {
    const approxWordScore = Math.max(10, Math.floor((score / Math.max(1, playedWords.length)) * (0.8 + idx * 0.1)));
    runningScore += approxWordScore;
    if (idx === playedWords.length - 1) runningScore = score;
    return {
      id: `word_${idx}`,
      index: idx + 1,
      word,
      pts: approxWordScore,
      cumulative: runningScore
    };
  });

  const activeLinesCount = activeTab === 'GOLD' ? goldLines.length : scoreLines.length;

  // Line-by-line sequential typewriter animation effect
  useEffect(() => {
    setVisibleLineCount(0);
    const interval = setInterval(() => {
      setVisibleLineCount(prev => {
        if (prev < activeLinesCount) {
          soundEngine.playTap();
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 380);

    return () => clearInterval(interval);
  }, [activeTab, activeLinesCount]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-xl select-none">
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-md bg-gradient-to-b from-slate-900 via-[#0f172a] to-slate-950 border-2 border-amber-500/60 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col items-center text-center text-slate-100 relative overflow-hidden"
      >
        {/* Top Trophy Banner */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-xl mb-1.5 animate-bounce">
          <Trophy className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>

        <h2 className="text-lg sm:text-2xl font-black text-amber-300 font-cinzel tracking-wide uppercase">
          KADEME {stage} TAMAMLANDI!
        </h2>
        <p className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5">
          Tebrikler! Baraj puanı geçildi, zafer puanları hesaplanıyor...
        </p>

        {/* Header Summary Cards */}
        <div className="w-full grid grid-cols-2 gap-2 my-2.5">
          <div className="p-2 sm:p-2.5 rounded-2xl bg-slate-950/80 border border-emerald-500/40 flex flex-col items-center justify-center shadow-md">
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 size={11} /> Ulaşılan Puan
            </span>
            <span className="text-base sm:text-lg font-extrabold text-emerald-300 mt-0.5 font-mono">
              {score} <span className="text-xs text-slate-400 font-normal">/ {targetScore}</span>
            </span>
          </div>

          <div className="p-2 sm:p-2.5 rounded-2xl bg-slate-950/80 border border-amber-500/40 flex flex-col items-center justify-center shadow-md">
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <Coins size={11} /> Kazanılan Altın
            </span>
            <span className="text-base sm:text-lg font-extrabold text-amber-300 mt-0.5 font-mono">
              +{grandTotalGold} 💰
            </span>
          </div>
        </div>

        {/* Tab Toggle Selector */}
        <div className="w-full flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 mb-2">
          <button
            onClick={() => setActiveTab('GOLD')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'GOLD'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Coins size={13} />
            <span>💰 Altın Dökümü</span>
          </button>

          <button
            onClick={() => setActiveTab('SCORE')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'SCORE'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calculator size={13} />
            <span>🎯 Skor & Kelimeler</span>
          </button>
        </div>

        {/* TAB 1: GOLD BREAKDOWN WITH SEQUENTIAL LEFT-TO-RIGHT TYPEWRITER ANIMATION */}
        {activeTab === 'GOLD' && (
          <div className="w-full bg-gradient-to-b from-amber-950/30 via-slate-950/90 to-slate-950 border border-amber-500/50 rounded-2xl p-3 my-1 text-left space-y-2 shadow-xl min-h-[160px]">
            <div className="flex items-center justify-between text-[11px] font-black text-amber-300 border-b border-amber-500/30 pb-1">
              <span className="flex items-center gap-1.5">
                <Coins size={13} className="text-amber-400 fill-amber-400" />
                ADIM ADIM ALTIN HESAPLAMASI:
              </span>
              <span className="text-emerald-400 font-mono font-black text-xs">+{grandTotalGold} 💰</span>
            </div>

            <div className="space-y-2 pt-0.5">
              {goldLines.map((line, idx) => {
                const isVisible = idx < visibleLineCount;
                if (!isVisible) return null;

                return (
                  <motion.div
                    key={line.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className={`flex items-center justify-between py-1 px-2 rounded-xl text-xs font-bold border-b transition-all ${
                      line.isTotal
                        ? 'bg-amber-950/80 border-amber-500/50 text-amber-300 mt-2 pt-2 border-t'
                        : 'border-slate-800/60 bg-slate-900/40 text-slate-200'
                    }`}
                  >
                    {/* Left-to-Right Label */}
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="text-sm shrink-0">{line.icon}</span>
                      <span className="truncate">{line.label}</span>
                    </div>

                    {/* Right-side Score/Gold Points */}
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.15, type: 'spring' }}
                      className={`font-mono ${line.color} shrink-0 ml-2`}
                    >
                      {line.val}
                    </motion.span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: SCORE BREAKDOWN WITH SEQUENTIAL ROLLUP ANIMATION */}
        {activeTab === 'SCORE' && (
          <div className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-3 my-1 text-left space-y-2 shadow-inner min-h-[160px]">
            <div className="flex items-center justify-between text-[10px] font-black text-amber-300 border-b border-slate-800 pb-1">
              <span className="flex items-center gap-1">
                <Calculator size={12} className="text-amber-400" />
                KELİME KELİME PUANLAMA SIRASI:
              </span>
              <span>KÜMÜLATİF SKOR</span>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 scrollbar-thin">
              {scoreLines.map((item, idx) => {
                const isVisible = idx < visibleLineCount;
                if (!isVisible) return null;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="flex items-center justify-between text-xs py-1 px-2 rounded-xl bg-slate-900/50 border border-slate-800/80"
                  >
                    {/* Left side Word */}
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <span className="text-[10px] text-slate-500 font-mono">#{item.index}</span>
                      <button
                        onClick={() => onOpenMeaningModal && onOpenMeaningModal(item.word)}
                        className="font-black text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer truncate"
                        title={`${item.word} TDK Anlamı`}
                      >
                        <span className="truncate">{item.word}</span>
                        <span className="text-[9px] text-amber-400 shrink-0">📖</span>
                      </button>
                    </div>

                    {/* Right side Points Rollup */}
                    <div className="flex items-center gap-2 font-mono shrink-0 ml-2">
                      <span className="text-[10px] text-slate-400">+{item.pts}p</span>
                      <span className="font-extrabold text-emerald-300 text-xs">➔ {item.cumulative}p</span>
                    </div>
                  </motion.div>
                );
              })}

              {visibleLineCount >= scoreLines.length && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between pt-2 border-t border-amber-500/40 text-xs font-black text-amber-300 px-1"
                >
                  <span>🏆 KADEME NET SKORU</span>
                  <span className="text-sm font-extrabold text-emerald-300 font-mono">{score} / {targetScore}</span>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* Proceed Action Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onProceedToRewards}
          className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black py-3 px-6 rounded-2xl transition flex items-center justify-center gap-2 shadow-2xl shadow-amber-500/40 text-sm tracking-wide border border-amber-300 cursor-pointer mt-2"
        >
          <span>ÖDÜLÜ AL VE DEVAM ET</span>
          <ChevronRight size={18} />
        </motion.button>
      </motion.div>
    </div>
  );
}

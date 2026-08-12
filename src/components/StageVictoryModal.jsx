import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Coins, ChevronRight, CheckCircle2, Flame, History, BookOpen, Calculator, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

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

  useEffect(() => {
    try {
      confetti({
        particleCount: 70,
        spread: 75,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  }, []);

  // Detailed Gold Items Calculation
  const baseStageGold = Math.max(3, goldEarned || 4);
  const wordGoldTotal = Math.max(1, Math.floor(playedWords.length * 0.75));
  const comboBonusGold = combo > 1 ? Math.min(6, Math.floor(combo * 1.2)) : 0;
  const overkillGold = score > targetScore ? Math.min(8, Math.floor((score - targetScore) / 20)) : 0;
  const grandTotalGold = baseStageGold + wordGoldTotal + comboBonusGold + overkillGold;

  // Running score accumulator for step-by-step breakdown animation
  let runningTotal = 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-md bg-gradient-to-b from-slate-900 via-[#0f172a] to-slate-950 border-2 border-amber-500/60 rounded-3xl p-5 shadow-2xl flex flex-col items-center text-center text-slate-100 relative overflow-hidden"
      >
        {/* Glowing Banner */}
        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-xl mb-2 animate-float">
          <Trophy size={28} />
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-amber-300 font-cinzel tracking-wide uppercase">
          BÖLÜM {stage} TAMAMLANDI!
        </h2>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          Tebrikler! Baraj puanını başarıyla geçerek zafer kazandın!
        </p>

        {/* Top Summary Cards */}
        <div className="w-full grid grid-cols-2 gap-2.5 my-3">
          <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-emerald-500/40 flex flex-col items-center justify-center shadow-md">
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 size={11} /> Ulaşılan Puan
            </span>
            <span className="text-lg font-extrabold text-emerald-300 mt-0.5 font-mono">
              {score} <span className="text-xs text-slate-400 font-normal">/ {targetScore}</span>
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-amber-500/40 flex flex-col items-center justify-center shadow-md">
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <Coins size={11} /> Kazanılan Altın
            </span>
            <span className="text-lg font-extrabold text-amber-300 mt-0.5 font-mono">
              +{grandTotalGold} 💰
            </span>
          </div>
        </div>

        {/* TAB TOGGLE SELECTOR */}
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

        {/* TAB 1: DETAILED GOLD BREAKDOWN CARD */}
        {activeTab === 'GOLD' && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-gradient-to-b from-amber-950/30 via-slate-950/90 to-slate-950 border border-amber-500/50 rounded-2xl p-3 my-1 text-left space-y-1.5 shadow-xl"
          >
            <div className="flex items-center justify-between text-[11px] font-black text-amber-300 border-b border-amber-500/30 pb-1">
              <span className="flex items-center gap-1.5">
                <Coins size={13} className="text-amber-400 fill-amber-400" />
                DETAYLI ALTIN KAZANIM DÖKÜMÜ:
              </span>
              <span className="text-emerald-400 font-mono font-black text-xs">+{grandTotalGold} 💰</span>
            </div>

            <div className="space-y-1.5 text-xs font-bold text-slate-200 pt-0.5">
              {/* 1. Base Stage Clear Gold */}
              <div className="flex items-center justify-between py-1 border-b border-slate-900/80">
                <span className="text-slate-300 flex items-center gap-1">
                  <span>🏛️</span> Sınav Başarı Ödülü:
                </span>
                <span className="text-amber-300 font-mono font-extrabold">+{baseStageGold} 💰</span>
              </div>

              {/* 2. Played Words & Letter Bonus Gold */}
              <div className="flex items-center justify-between py-1 border-b border-slate-900/80">
                <span className="text-slate-300 flex items-center gap-1">
                  <span>🔤</span> Kelimeler ({playedWords.length} Adet):
                </span>
                <span className="text-amber-300 font-mono font-extrabold">+{wordGoldTotal} 💰</span>
              </div>

              {/* 3. Combo Series Gold Bonus */}
              {comboBonusGold > 0 && (
                <div className="flex items-center justify-between py-1 border-b border-slate-900/80 text-orange-300">
                  <span className="flex items-center gap-1">
                    <Flame size={13} className="text-orange-400" />
                    <span>Kombo Serisi Ödülü (×{combo}):</span>
                  </span>
                  <span className="text-amber-300 font-mono font-extrabold">+{comboBonusGold} 💰</span>
                </div>
              )}

              {/* 4. Overkill Performance Score Gold */}
              {overkillGold > 0 && (
                <div className="flex items-center justify-between py-1 border-b border-slate-900/80 text-emerald-300">
                  <span className="flex items-center gap-1">
                    <Sparkles size={13} className="text-emerald-400" />
                    <span>Skor Fazlası Performans Ödülü:</span>
                  </span>
                  <span className="text-emerald-300 font-mono font-extrabold">+{overkillGold} 💰</span>
                </div>
              )}
            </div>

            {/* Net Total Gold Payout Row */}
            <div className="flex items-center justify-between pt-2 border-t border-amber-500/40 text-xs font-black text-amber-300">
              <span>💰 KAZANILAN NET ALTIN</span>
              <span className="text-sm font-extrabold text-amber-300 font-mono">+{grandTotalGold} 💰</span>
            </div>
          </motion.div>
        )}

        {/* TAB 2: DETAILED SEQUENTIAL SCORING ROLLUP BREAKDOWN */}
        {activeTab === 'SCORE' && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-3 my-1 text-left space-y-1.5 shadow-inner"
          >
            <div className="flex items-center justify-between text-[10px] font-black text-amber-300 border-b border-slate-800 pb-1">
              <span className="flex items-center gap-1">
                <Calculator size={12} className="text-amber-400" />
                DETAYLI PUANLAMA & KELİMELER:
              </span>
              <span>KÜMÜLATİF SKOR</span>
            </div>

            {/* Sequential Word Score Items */}
            <div className="space-y-1 max-h-32 overflow-y-auto pr-1 scrollbar-thin">
              {playedWords.map((word, idx) => {
                const approxWordScore = Math.max(10, Math.floor((score / Math.max(1, playedWords.length)) * (0.8 + idx * 0.1)));
                runningTotal += approxWordScore;
                if (idx === playedWords.length - 1) runningTotal = score;

                return (
                  <motion.div
                    key={`score_line_${idx}`}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.15 }}
                    className="flex items-center justify-between text-xs py-1 border-b border-slate-900/80"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-500 font-mono">#{idx + 1}</span>
                      <button
                        onClick={() => onOpenMeaningModal && onOpenMeaningModal(word)}
                        className="font-black text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer active:scale-95 transition"
                        title={`${word} kelimesinin TDK anlamını gör`}
                      >
                        <span>{word}</span>
                        <span className="text-[9px] text-amber-400">📖</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-[10px] text-slate-400">+{approxWordScore}p</span>
                      <span className="font-extrabold text-emerald-300 text-xs">➔ {runningTotal}p</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Grand Total Score Row */}
            <div className="flex items-center justify-between pt-1.5 border-t border-amber-500/40 text-xs font-black text-amber-300">
              <span>🏆 GÜNCEL TOPLAM KADEME SKORU</span>
              <span className="text-sm font-extrabold text-emerald-300 font-mono">{score} / {targetScore}</span>
            </div>
          </motion.div>
        )}

        {/* Proceed Action Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onProceedToRewards}
          className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black py-3 px-6 rounded-2xl transition flex items-center justify-center gap-2 shadow-2xl shadow-amber-500/40 text-sm tracking-wide border border-amber-300 cursor-pointer mt-2"
        >
          <span>ALTIN ÖDÜLÜNÜ AL & DEVAM ET</span>
          <ChevronRight size={18} />
        </motion.button>
      </motion.div>
    </div>
  );
}

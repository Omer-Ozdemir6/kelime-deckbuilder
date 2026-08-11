import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Coins, ChevronRight, CheckCircle2, Flame, History } from 'lucide-react';
import confetti from 'canvas-confetti';

export function StageVictoryModal({
  stage,
  score,
  targetScore,
  goldEarned,
  playedWords = [],
  combo,
  onProceedToRewards
}) {
  useEffect(() => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-md bg-gradient-to-b from-slate-900 via-[#0f172a] to-slate-950 border-2 border-amber-500/60 rounded-3xl p-5 shadow-2xl flex flex-col items-center text-center text-slate-100 relative overflow-hidden"
      >
        {/* Glowing Banner */}
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-xl mb-3 animate-float">
          <Trophy size={32} />
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-amber-300 font-cinzel tracking-wide uppercase">
          BÖLÜM {stage} TAMAMLANDI!
        </h2>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Tebrikler! Baraj puanını başarıyla geçerek zafer kazandın!
        </p>

        {/* Score & Gold Summary Cards */}
        <div className="w-full grid grid-cols-2 gap-3 my-4">
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-emerald-500/40 flex flex-col items-center justify-center shadow-md">
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 size={12} /> Skor Ulaşıldı
            </span>
            <span className="text-xl font-extrabold text-emerald-300 mt-1">
              {score} <span className="text-xs text-slate-400 font-normal">/ {targetScore}</span>
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80 border border-amber-500/40 flex flex-col items-center justify-center shadow-md">
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <Coins size={12} /> Toplam Altın
            </span>
            <span className="text-xl font-extrabold text-amber-300 mt-1">
              +{goldEarned} 💰
            </span>
          </div>
        </div>

        {/* Stats Row: Played Words & Max Combo */}
        <div className="w-full p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs mb-4">
          <div className="flex items-center gap-1.5 text-slate-300">
            <History size={14} className="text-amber-400" />
            <span>Kelimeler: <strong className="text-amber-300">{playedWords.length} Adet</strong></span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <Flame size={14} className="text-orange-400" />
            <span>En Yüksek Kombo: <strong className="text-orange-300">{combo}x</strong></span>
          </div>
        </div>

        {/* Played Words Preview Pills */}
        {playedWords.length > 0 && (
          <div className="w-full mb-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5 text-left">
              YAZILAN KELİMELER:
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto pr-1 scrollbar-thin">
              {playedWords.map((word, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-amber-500/40 text-amber-300 text-[11px] font-extrabold"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Proceed Action Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onProceedToRewards}
          className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black py-4 px-6 rounded-2xl transition flex items-center justify-center gap-2 shadow-2xl shadow-amber-500/40 text-sm tracking-wide border border-amber-300 cursor-pointer animate-pulse-glow"
        >
          <span>ÖDÜLLERİ AL & DEVAM ET</span>
          <ChevronRight size={18} />
        </motion.button>
      </motion.div>
    </div>
  );
}

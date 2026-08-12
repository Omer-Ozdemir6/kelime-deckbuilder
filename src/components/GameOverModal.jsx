import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, Trophy, Coins, BookOpen, Sparkles } from 'lucide-react';
import { soundEngine } from '../game/audioEngine';

export function GameOverModal({
  stage,
  currentScore,
  totalRunGold = 0,
  totalRunWords = 0,
  onReturnToMainMenu
}) {
  useEffect(() => {
    try {
      soundEngine.playGameOver && soundEngine.playGameOver();
    } catch (e) {}
  }, []);

  const statsList = [
    {
      id: 'stat_stage',
      icon: '🏛️',
      label: 'Ulaşılan Kademe:',
      value: `KADEME ${stage}`,
      color: 'text-amber-300'
    },
    {
      id: 'stat_score',
      icon: <Trophy size={14} className="text-emerald-400" />,
      label: 'Toplam Run Skoru:',
      value: `${currentScore} Puan`,
      color: 'text-emerald-300'
    },
    {
      id: 'stat_gold',
      icon: <Coins size={14} className="text-amber-400 fill-amber-400" />,
      label: 'Kazanılan Toplam Altın:',
      value: `+${totalRunGold || 25} 💰`,
      color: 'text-amber-300'
    },
    {
      id: 'stat_words',
      icon: <BookOpen size={14} className="text-cyan-400" />,
      label: 'Yazılan Toplam Kelime:',
      value: `${totalRunWords || 8} Kelime`,
      color: 'text-cyan-300'
    }
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/95 z-50 flex items-center justify-center p-4 backdrop-blur-xl animate-fade-in select-none">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-md bg-gradient-to-b from-slate-900 via-[#190d16] to-slate-950 border-2 border-rose-600/70 rounded-3xl p-5 shadow-2xl flex flex-col items-center text-center text-slate-100 relative overflow-hidden"
      >
        {/* Skull Icon Header */}
        <div className="w-16 h-16 rounded-3xl bg-rose-950/80 border-2 border-rose-500/80 flex items-center justify-center text-3xl mb-2 shadow-2xl shadow-rose-950 animate-pulse">
          💀
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-rose-400 font-cinzel tracking-wide uppercase">
          SINAV ELENDİ (RUN GENEL HESABI)
        </h2>
        <p className="text-xs text-slate-400 mt-0.5 font-medium">
          Hamle hakkınız bitti! Kazanılan altınlar ve başarımlar hesaplandı.
        </p>

        {/* SEQUENTIAL ANIMATED RUN STATS SUMMARY CARD */}
        <div className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-3.5 my-3 flex flex-col gap-2.5 shadow-inner text-left">
          {statsList.map((stat, idx) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.25 }}
              className="flex justify-between items-center text-xs pb-1.5 border-b border-slate-800/80 last:border-b-0"
            >
              <span className="text-slate-400 flex items-center gap-1.5">
                <span>{stat.icon}</span>
                <span>{stat.label}</span>
              </span>
              <span className={`font-extrabold text-sm font-mono ${stat.color}`}>
                {stat.value}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Lock / Meta Progression Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="w-full bg-slate-900/60 border border-slate-800 rounded-xl p-2 mb-3 text-[10px] text-slate-400 flex items-center justify-center gap-1.5"
        >
          <Sparkles size={12} className="text-amber-400 shrink-0" />
          <span>Kazanılan başarım ve altınlar dükkândaki kilitli yeni jokerleri açar!</span>
        </motion.div>

        {/* Main Menu Action Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReturnToMainMenu}
          className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black py-3.5 px-6 rounded-2xl transition flex items-center justify-center gap-2 shadow-2xl shadow-amber-500/30 text-sm tracking-wide border border-amber-300 cursor-pointer"
        >
          <Home size={18} />
          <span>ANA MENÜYE DÖN</span>
        </motion.button>
      </motion.div>
    </div>
  );
}

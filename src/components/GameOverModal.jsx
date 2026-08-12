import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, Trophy, Coins, BookOpen, Sparkles, Unlock } from 'lucide-react';
import { soundEngine } from '../game/audioEngine';

export function GameOverModal({
  stage,
  currentScore,
  totalRunGold = 0,
  totalRunWords = 0,
  runAchievements = [],
  runMetaUnlocks = [],
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

  // Balatro-style unlock reveal: achievements + newly opened heroes/stakes from this run
  const allUnlocks = [
    ...runAchievements.map(a => ({
      id: a.id,
      icon: '🏆',
      title: a.title,
      desc: a.rewardDesc || a.unlockedDesc,
      color: 'border-amber-500/70 bg-amber-950/40 text-amber-300'
    })),
    ...runMetaUnlocks.map(u => ({
      id: u.id,
      icon: u.icon,
      title: u.type === 'HERO' ? `Yeni Karakter: ${u.name}` : `Yeni Mühür: ${u.name}`,
      desc: u.desc,
      color: u.type === 'HERO' ? 'border-purple-500/70 bg-purple-950/40 text-purple-300' : 'border-cyan-500/70 bg-cyan-950/40 text-cyan-300'
    }))
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/95 z-50 flex items-center justify-center p-4 backdrop-blur-xl animate-fade-in select-none overflow-y-auto">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-md bg-gradient-to-b from-slate-900 via-[#190d16] to-slate-950 border-2 border-rose-600/70 rounded-3xl p-5 shadow-2xl flex flex-col items-center text-center text-slate-100 relative overflow-hidden my-4"
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

        {/* NEW UNLOCKS REVEAL — Balatro style */}
        {allUnlocks.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="w-full mb-3"
          >
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-black text-amber-300 uppercase tracking-wider mb-2">
              <Unlock size={13} />
              <span>Bu Run'da Açılanlar</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {allUnlocks.map((u, idx) => (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0, scale: 0.9, x: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: 1.2 + idx * 0.15 }}
                  className={`flex items-center gap-2.5 p-2.5 rounded-2xl border shadow-md ${u.color}`}
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-950/60 border border-white/10 flex items-center justify-center text-xl shrink-0">
                    {u.icon}
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-black">{u.title}</h4>
                    <p className="text-[10px] opacity-80 font-semibold">{u.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="w-full bg-slate-900/60 border border-slate-800 rounded-xl p-2 mb-3 text-[10px] text-slate-400 flex items-center justify-center gap-1.5"
          >
            <Sparkles size={12} className="text-amber-400 shrink-0" />
            <span>Yeni başarımlar kazandıkça karakter ve mühürler kalıcı olarak açılır!</span>
          </motion.div>
        )}

        {/* Main Menu Action Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 + allUnlocks.length * 0.15 }}
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

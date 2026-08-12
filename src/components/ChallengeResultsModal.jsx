import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Coins, RefreshCw, Award, ChevronRight, Sparkles, Zap, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../game/audioEngine';

export function ChallengeResultsModal({
  score,
  wordsCompleted = [],
  onProceed
}) {
  const [progressWidth, setProgressWidth] = useState(0);

  // Reward Tiers:
  // Bronze: 1-5 pts -> +8 Gold
  // Silver: 6-10 pts -> +15 Gold, +1 Refresh
  // Gold: 11-15 pts -> +25 Gold, +1 Free Upgrade
  // Diamond: 16+ pts -> +40 Gold, +1 Booster Pack
  let maxScore = 20;
  let targetPercentage = Math.min(100, Math.floor((score / maxScore) * 100));

  let rewardTier = 'NONE';
  let rewardTitle = 'Başlangıç Seviyesi';
  let rewardText = '+5 💰 Altın';
  let goldAward = 5;

  if (score >= 16) {
    rewardTier = 'DIAMOND';
    rewardTitle = '💎 ELMAS EFSANE KADEMESİ!';
    rewardText = '+40 💰 Altın + 💎 Nadir Booster Paket Ödülü!';
    goldAward = 40;
  } else if (score >= 11) {
    rewardTier = 'GOLD';
    rewardTitle = '🥇 ALTIN USTA KADEMESİ!';
    rewardText = '+25 💰 Altın + ⬆️ Ücretsiz Harf Yükseltme Ödülü!';
    goldAward = 25;
  } else if (score >= 6) {
    rewardTier = 'SILVER';
    rewardTitle = '🥈 GÜMÜŞ CHANGER KADEMESİ!';
    rewardText = '+15 💰 Altın + 🔄 +1 Ek Yenileme Ödülü!';
    goldAward = 15;
  } else if (score >= 1) {
    rewardTier = 'BRONZE';
    rewardTitle = '🥉 BRONZ BAŞARI KADEMESİ!';
    rewardText = '+8 💰 Altın Ödülü!';
    goldAward = 8;
  }

  useEffect(() => {
    soundEngine.playVictory();
    try {
      confetti({
        particleCount: score >= 10 ? 80 : 40,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    // Animate progress bar fill from 0% to target percentage smoothly
    const timer = setTimeout(() => {
      setProgressWidth(targetPercentage);
    }, 200);

    return () => clearTimeout(timer);
  }, [score, targetPercentage]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-md bg-gradient-to-b from-slate-900 via-[#0f172a] to-slate-950 border-2 border-cyan-500/60 rounded-3xl p-5 shadow-2xl flex flex-col items-center text-center text-slate-100 relative overflow-hidden"
      >
        {/* Challenge Header Badge */}
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-xl mb-2 animate-bounce">
          <Zap size={28} />
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-cyan-300 font-cinzel tracking-wide uppercase">
          ⚡ SÜRELİ CHALLENGE TAMAMLANDI!
        </h2>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          30 Saniye boyunca hızlıca kilitli harf bulmacalarını çözdün!
        </p>

        {/* Challenge Score Stat Box */}
        <div className="w-full bg-slate-950/80 border border-cyan-500/40 rounded-2xl p-3 my-3 flex items-center justify-between shadow-md">
          <div className="text-left">
            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider block">
              Çözülen Kelime Adedi
            </span>
            <span className="text-lg font-extrabold text-white font-mono">
              {wordsCompleted.length} Kelime
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block">
              Toplam Challenge Skoru
            </span>
            <span className="text-xl font-black text-amber-300 font-mono">
              {score} Puan
            </span>
          </div>
        </div>

        {/* ANIMATED PROGRESS BAR FILLING FROM LEFT TO RIGHT */}
        <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 my-2 space-y-2 shadow-inner text-left">
          <div className="flex items-center justify-between text-[11px] font-black text-cyan-300">
            <span className="flex items-center gap-1">
              <Sparkles size={13} className="text-cyan-400 animate-pulse" />
              KAZANILAN ÖDÜL KADEMESİ:
            </span>
            <span className="font-mono text-amber-300">{score} / {maxScore} Pt</span>
          </div>

          {/* Progress Bar Container */}
          <div className="w-full h-4 bg-slate-900 rounded-full p-0.5 border border-slate-800 relative overflow-hidden shadow-inner">
            {/* Animated Fill Bar */}
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-cyan-400 to-purple-500 transition-all duration-1000 shadow-[0_0_15px_rgba(34,211,238,0.8)] relative overflow-hidden"
              style={{ width: `${progressWidth}%` }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-shimmer" />
            </div>
          </div>

          {/* Reward Tiers Markers Row */}
          <div className="grid grid-cols-4 gap-1 text-[9px] font-extrabold text-center pt-1 border-t border-slate-800/80">
            <span className={score >= 1 ? 'text-amber-400' : 'text-slate-600'}>🥉 Bronz (1p)</span>
            <span className={score >= 6 ? 'text-slate-200' : 'text-slate-600'}>🥈 Gümüş (6p)</span>
            <span className={score >= 11 ? 'text-yellow-300' : 'text-slate-600'}>🥇 Altın (11p)</span>
            <span className={score >= 16 ? 'text-purple-300' : 'text-slate-600'}>💎 Elmas (16p)</span>
          </div>

          {/* Earned Reward Summary Badge */}
          <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-center space-y-0.5 mt-1">
            <div className="text-xs font-black text-amber-300 uppercase tracking-wide">
              {rewardTitle}
            </div>
            <div className="text-xs font-bold text-slate-200">
              {rewardText}
            </div>
          </div>
        </div>

        {/* Proceed Action Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onProceed && onProceed(goldAward)}
          className="w-full bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-black py-3 px-6 rounded-2xl transition flex items-center justify-center gap-2 shadow-2xl shadow-cyan-500/40 text-sm tracking-wide border border-cyan-200 cursor-pointer mt-2"
        >
          <span>ÖDÜLÜ AL VE HARİTAYA DÖN</span>
          <ChevronRight size={18} />
        </motion.button>
      </motion.div>
    </div>
  );
}

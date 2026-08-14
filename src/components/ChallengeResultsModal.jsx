import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Coins, RefreshCw, Award, ChevronRight, Sparkles, Zap, Gift, Check, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../game/audioEngine';
import { RunicCardFrame } from './RunicCardFrame';

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

  let rewardTier = 'BRONZE';
  let rewardTitle = '🥉 BRONZ BAŞARI KADEMESİ';
  let rewardText = '+8 💰 Altın Ödülü';
  let goldAward = 8;
  let tierBadgeStyle = 'from-amber-700 via-amber-800 to-amber-900 border-amber-500 text-amber-100 shadow-amber-900/50';

  if (score >= 16) {
    rewardTier = 'DIAMOND';
    rewardTitle = '💎 ELMAS EFSANE KADEMESİ!';
    rewardText = '+40 💰 Altın + 💎 Nadir Booster Paket Ödülü!';
    goldAward = 40;
    tierBadgeStyle = 'from-purple-600 via-pink-600 to-indigo-600 border-pink-300 text-white shadow-[0_0_30px_rgba(236,72,153,0.8)]';
  } else if (score >= 11) {
    rewardTier = 'GOLD';
    rewardTitle = '🥇 ALTIN USTA KADEMESİ!';
    rewardText = '+25 💰 Altın + ⬆️ Ücretsiz Harf Yükseltme Ödülü!';
    goldAward = 25;
    tierBadgeStyle = 'from-amber-400 via-yellow-400 to-amber-500 border-amber-200 text-slate-950 shadow-[0_0_30px_rgba(245,158,11,0.8)]';
  } else if (score >= 6) {
    rewardTier = 'SILVER';
    rewardTitle = '🥈 GÜMÜŞ CHANGER KADEMESİ!';
    rewardText = '+15 💰 Altın + 🔄 +1 Ek Yenileme Ödülü!';
    goldAward = 15;
    tierBadgeStyle = 'from-slate-400 via-slate-200 to-slate-400 border-white text-slate-950 shadow-[0_0_20px_rgba(226,232,240,0.6)]';
  } else if (score <= 0) {
    rewardTitle = '⚡ BAŞLANGIÇ SEVİYESİ';
    rewardText = '+5 💰 Teşvik Altını';
    goldAward = 5;
    tierBadgeStyle = 'from-slate-800 to-slate-900 border-slate-700 text-slate-300';
  }

  useEffect(() => {
    soundEngine.playVictory();
    try {
      confetti({
        particleCount: score >= 10 ? 90 : 50,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch (e) {}

    const timer = setTimeout(() => {
      setProgressWidth(targetPercentage);
    }, 250);

    return () => clearTimeout(timer);
  }, [score, targetPercentage]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl select-none overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute w-96 h-96 rounded-full bg-cyan-500/30 blur-[130px] pointer-events-none" />

      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-gradient-to-b from-slate-900 via-[#0f172a] to-slate-950 border-4 border-cyan-400/80 rounded-3xl p-5 sm:p-6 shadow-[0_0_60px_rgba(34,211,238,0.4)] flex flex-col items-center text-center text-slate-100 relative overflow-hidden z-10"
      >
        {/* SVG Runic Card Frame Overlay */}
        <RunicCardFrame rarity="legendary" active={true} />

        {/* Challenge Header Crest */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-teal-500/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-2xl mb-3 relative overflow-hidden shrink-0">
          <Zap size={32} className="animate-pulse" />
        </div>

        <span className="px-3.5 py-1 rounded-full bg-cyan-950 border border-cyan-400/60 text-cyan-300 text-[10px] font-black uppercase tracking-widest mb-1 shadow-md">
          SÜRELİ CHALLENGE SONUÇLARI
        </span>

        <h2 className="text-xl sm:text-2xl font-black text-white font-cinzel tracking-wide uppercase">
          ⚡ MÜCADELE TAMAMLANDI!
        </h2>
        <p className="text-xs text-slate-300 font-semibold mt-0.5">
          30 Saniye boyunca hızlıca kilitli harf bulmacalarını çözdün!
        </p>

        {/* Stats Grid Overview */}
        <div className="w-full grid grid-cols-2 gap-3 my-4 z-10">
          <div className="bg-slate-950/90 border-2 border-cyan-500/50 rounded-2xl p-3 flex flex-col items-center shadow-lg">
            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider">
              Çözülen Kelimeler
            </span>
            <span className="text-2xl font-black text-white font-mono mt-0.5">
              {wordsCompleted.length}
            </span>
          </div>

          <div className="bg-slate-950/90 border-2 border-amber-500/50 rounded-2xl p-3 flex flex-col items-center shadow-lg">
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">
              Toplam Challenge Skoru
            </span>
            <span className="text-2xl font-black text-amber-300 font-mono mt-0.5">
              {score} Puan
            </span>
          </div>
        </div>

        {/* SOLVED WORDS CHIPS (IF ANY) */}
        {wordsCompleted.length > 0 && (
          <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-2.5 mb-3 text-left z-10">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">
              ✓ Tamamlanan Kelimeler:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap max-h-16 overflow-y-auto scrollbar-none">
              {wordsCompleted.map((w, idx) => (
                <span key={idx} className="px-2.5 py-0.5 rounded-lg bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 font-extrabold text-[10px] shadow-sm">
                  {w}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ANIMATED PROGRESS BAR & REWARD TIER */}
        <div className="w-full bg-slate-950/95 border-2 border-slate-800 rounded-2xl p-3.5 space-y-2.5 shadow-inner text-left z-10">
          <div className="flex items-center justify-between text-xs font-black text-cyan-300">
            <span className="flex items-center gap-1.5">
              <Sparkles size={14} className="text-cyan-400 animate-pulse" />
              <span>KAZANILAN ÖDÜL KADEMESİ:</span>
            </span>
            <span className="font-mono text-amber-300 text-sm">{score} / {maxScore} Pt</span>
          </div>

          {/* Progress Bar Container */}
          <div className="w-full h-4 bg-slate-900 rounded-full p-0.5 border border-slate-800 relative overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-cyan-400 to-purple-500 transition-all duration-1000 shadow-[0_0_15px_rgba(34,211,238,0.8)] relative overflow-hidden"
              style={{ width: `${progressWidth}%` }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-shimmer" />
            </div>
          </div>

          {/* Reward Tiers Markers Row */}
          <div className="grid grid-cols-4 gap-1 text-[9px] font-black text-center pt-1.5 border-t border-slate-800/80">
            <span className={score >= 1 ? 'text-amber-400' : 'text-slate-600'}>🥉 Bronz (1p)</span>
            <span className={score >= 6 ? 'text-slate-200' : 'text-slate-600'}>🥈 Gümüş (6p)</span>
            <span className={score >= 11 ? 'text-yellow-300' : 'text-slate-600'}>🥇 Altın (11p)</span>
            <span className={score >= 16 ? 'text-purple-300' : 'text-slate-600'}>💎 Elmas (16p)</span>
          </div>

          {/* EARNED TIER BADGE */}
          <div className={`p-3 rounded-2xl bg-gradient-to-r border-2 text-center shadow-xl space-y-0.5 ${tierBadgeStyle}`}>
            <div className="text-xs sm:text-sm font-black uppercase tracking-wide">
              {rewardTitle}
            </div>
            <div className="text-xs font-bold opacity-90">
              {rewardText}
            </div>
          </div>
        </div>

        {/* Proceed Action Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onProceed && onProceed(goldAward)}
          className="w-full bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-black py-4 px-6 rounded-2xl transition flex items-center justify-center gap-2 shadow-2xl shadow-cyan-500/50 text-sm sm:text-base tracking-wide border-2 border-cyan-200 cursor-pointer mt-3 z-10 animate-pulse"
        >
          <span>ÖDÜLÜ AL VE HARİTAYA DÖN</span>
          <ChevronRight size={20} className="stroke-[3]" />
        </motion.button>
      </motion.div>
    </div>
  );
}


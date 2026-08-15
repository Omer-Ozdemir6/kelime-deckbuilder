import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, Sparkles, ArrowRight, RotateCcw, Coins, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../game/audioEngine';
import { RunicCardFrame } from './RunicCardFrame';

export function RunVictoryModal({
  stage = 8,
  score = 0,
  totalGold = 0,
  wordsPlayedCount = 0,
  onContinueEndless,
  onReturnToMainMenu
}) {
  useEffect(() => {
    try {
      soundEngine.playVictory?.();
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 }
      });
      setTimeout(() => {
        try {
          confetti({
            particleCount: 100,
            spread: 120,
            origin: { y: 0.3 }
          });
        } catch (e) {}
      }, 700);
    } catch (e) {}
  }, []);

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center p-3 sm:p-4 bg-slate-950/95 backdrop-blur-2xl select-none">
      {/* Background SVG Radial Starburst */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 z-0">
        <svg className="w-[800px] h-[800px] text-amber-500/40 animate-spin-slow" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="6 3" />
          <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <polygon points="100,10 190,100 100,190 10,100" fill="none" stroke="currentColor" strokeWidth="1" />
          <polygon points="100,20 180,100 100,180 20,100" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 2" />
        </svg>
      </div>

      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-lg max-h-[92vh] overflow-y-auto scrollbar-thin bg-slate-950/95 border-4 border-amber-400 rounded-3xl p-5 sm:p-7 shadow-[0_0_80px_rgba(245,158,11,0.5)] flex flex-col items-center text-center text-slate-100 relative z-10 backdrop-blur-2xl"
      >
        <RunicCardFrame rarity="legendary" active={true} />

        {/* Golden Trophy Crest */}
        <div className="relative mb-2">
          <div className="absolute inset-0 bg-amber-500/40 rounded-full blur-2xl pointer-events-none" />
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-b from-amber-300 via-amber-500 to-yellow-700 p-1 flex items-center justify-center shadow-2xl border-2 border-yellow-200 relative z-10">
            <div className="w-full h-full rounded-2xl bg-slate-950 flex flex-col items-center justify-center gap-1">
              <Crown className="w-12 h-12 text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 font-cinzel tracking-wider uppercase drop-shadow">
          👑 OYUN KAZANILDI!
        </h1>
        <p className="text-xs sm:text-sm text-amber-200/90 font-medium mt-1">
          Tebrikler! Kadim Mahzen Final Boss'unu Mağlup Ettin ve Efsaneler Arasına Girdin!
        </p>

        {/* RUN STATS SUMMARY */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-4 z-10">
          <div className="p-3 rounded-2xl bg-slate-900/95 border border-amber-500/50 flex flex-col items-center justify-center shadow-md">
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <Trophy size={12} /> Biten Kademe
            </span>
            <span className="text-lg font-extrabold text-amber-300 mt-0.5 font-mono">
              Kademe {stage}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/95 border border-emerald-500/50 flex flex-col items-center justify-center shadow-md">
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <Award size={12} /> Skor Puanı
            </span>
            <span className="text-lg font-extrabold text-emerald-300 mt-0.5 font-mono">
              {score}p
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/95 border border-amber-500/50 flex flex-col items-center justify-center shadow-md col-span-2 sm:col-span-1">
            <span className="text-[10px] font-black text-yellow-400 uppercase tracking-wider flex items-center gap-1">
              <Coins size={12} /> Toplam Altın
            </span>
            <span className="text-lg font-extrabold text-yellow-300 mt-0.5 font-mono">
              ${totalGold} 💰
            </span>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="w-full space-y-2.5 mt-2 z-10">
          {/* ENDLESS MODE CTA BUTTON */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            onClick={onContinueEndless}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm sm:text-base shadow-2xl border-2 border-yellow-100 cursor-pointer flex items-center justify-center gap-2 tracking-wider"
          >
            <Sparkles size={20} />
            <span>SONSUZ MODA DEVAM ET (ENDLESS MODE)</span>
            <ArrowRight size={20} />
          </motion.button>

          {/* MAIN MENU BUTTON */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            onClick={onReturnToMainMenu}
            className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 text-slate-300 font-bold text-xs sm:text-sm shadow-lg cursor-pointer flex items-center justify-center gap-2 tracking-wider"
          >
            <RotateCcw size={16} />
            <span>ANA MENÜYE DÖN</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

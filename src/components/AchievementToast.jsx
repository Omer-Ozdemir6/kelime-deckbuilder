import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Unlock, Sparkles, X } from 'lucide-react';
import { soundEngine } from '../game/audioEngine';

export function AchievementToast({
  achievement,
  onClose
}) {
  useEffect(() => {
    soundEngine.playVictory();
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 4500);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!achievement) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -40, scale: 0.9 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-sm bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-2 border-amber-400 rounded-2xl p-3 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 text-slate-100"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-md shrink-0 animate-bounce">
            <Trophy size={20} />
          </div>

          <div className="text-left space-y-0.5">
            <div className="flex items-center gap-1 text-[10px] font-black text-amber-400 uppercase tracking-wider">
              <Unlock size={11} />
              <span>BAŞARIM KAZANILDI!</span>
            </div>
            <h4 className="text-xs font-black text-white">{achievement.title}</h4>
            <p className="text-[10px] text-amber-200/90 font-bold flex items-center gap-1">
              <Sparkles size={10} className="text-amber-300" />
              <span>{achievement.rewardDesc}</span>
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
        >
          <X size={14} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, CheckCircle2, X, Sparkles, Award } from 'lucide-react';

export function ObjectiveCompletedToast({ goalNotice, onClose }) {
  useEffect(() => {
    if (!goalNotice) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // Auto dismiss after 4s
    return () => clearTimeout(timer);
  }, [goalNotice, onClose]);

  if (!goalNotice) return null;

  const { title, description, rewardGold, rewardStars } = goalNotice;

  return (
    <AnimatePresence>
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-3 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: -80, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -80, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="relative bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-2 border-amber-400 rounded-2xl p-3.5 shadow-[0_10px_30px_rgba(245,158,11,0.4)] backdrop-blur-xl flex items-center justify-between gap-3 text-slate-100 overflow-hidden"
        >
          {/* Shimmer overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.15)_50%,transparent_100%)] animate-shimmer pointer-events-none" />

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/60 text-amber-300 flex items-center justify-center shrink-0 shadow-inner">
              <Trophy size={20} className="text-amber-400 animate-bounce" />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-amber-400 tracking-wider uppercase flex items-center gap-1">
                  <Sparkles size={12} /> HEDEF TAMAMLANDI!
                </span>
              </div>
              <p className="text-xs font-bold text-slate-200 leading-tight">
                {title || description}
              </p>
              {(rewardGold || rewardStars) && (
                <div className="flex items-center gap-2 text-[10px] font-extrabold text-amber-300 pt-0.5">
                  {rewardGold && <span className="bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-700/60">+ {rewardGold} 💰 Altın</span>}
                  {rewardStars && <span className="bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-700/60">+ {rewardStars} ⭐ Yıldız</span>}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition shrink-0 border border-slate-700/60"
            title="Kapat"
          >
            <X size={14} />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

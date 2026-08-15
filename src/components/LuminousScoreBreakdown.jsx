import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { soundEngine } from '../game/audioEngine';

export function LuminousScoreBreakdown({ scoreBreakdown, onClose }) {
  const [visibleStepIndex, setVisibleStepIndex] = useState(-1);

  if (!scoreBreakdown || !scoreBreakdown.scoreSteps || scoreBreakdown.scoreSteps.length === 0) {
    return null;
  }

  const steps = scoreBreakdown.scoreSteps;
  const word = scoreBreakdown.word || '';

  useEffect(() => {
    setVisibleStepIndex(-1);
    const timers = [];

    steps.forEach((step, idx) => {
      const timer = setTimeout(() => {
        setVisibleStepIndex(idx);
        try {
          if (step.type === 'TOTAL') {
            soundEngine.playVictory?.();
          } else {
            soundEngine.playTileClick?.();
          }
        } catch (e) {}
      }, idx * 220);
      timers.push(timer);
    });

    const closeTimer = setTimeout(() => {
      if (onClose) onClose();
    }, steps.length * 220 + 1200);
    timers.push(closeTimer);

    return () => {
      timers.forEach(t => clearTimeout(t));
    };
  }, [scoreBreakdown]);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -20 }}
        className="pointer-events-auto max-w-sm w-full bg-slate-950/95 border-2 border-amber-400/80 rounded-3xl p-4 sm:p-5 shadow-[0_0_50px_rgba(245,158,11,0.4)] backdrop-blur-2xl flex flex-col items-center gap-3 relative overflow-hidden select-none"
      >
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center">
          <div className="w-48 h-48 bg-amber-500 rounded-full blur-3xl animate-pulse" />
        </div>

        {/* WORD BANNER */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/90 border border-amber-400/80 text-amber-300 font-black tracking-widest text-sm font-mono shadow-md">
          <Sparkles size={16} className="text-amber-400 animate-spin-slow" />
          <span>{word}</span>
        </div>

        {/* STEPS LIST */}
        <div className="w-full flex flex-col gap-2 my-1">
          {steps.map((step, idx) => {
            const isVisible = idx <= visibleStepIndex;
            let stepBg = 'bg-slate-900 border-slate-800 text-slate-300';

            if (step.type === 'CHIPS') {
              stepBg = 'bg-sky-950/90 border-sky-500/60 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.3)]';
            } else if (step.type === 'MULT') {
              stepBg = 'bg-purple-950/90 border-purple-500/60 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]';
            } else if (step.type === 'XMULT') {
              stepBg = 'bg-pink-950/90 border-pink-500/80 text-pink-300 shadow-[0_0_15px_rgba(244,114,182,0.5)] animate-pulse';
            } else if (step.type === 'TOTAL') {
              stepBg = 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 border-yellow-200 shadow-[0_0_25px_rgba(245,158,11,0.6)] font-black scale-105';
            }

            return (
              <AnimatePresence key={idx}>
                {isVisible && (
                  <motion.div
                    initial={{ opacity: 0, x: -20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.18 }}
                    className={`w-full px-3 py-2 rounded-2xl border flex items-center justify-between gap-2 shadow-md ${stepBg}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{step.icon}</span>
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-black tracking-wider uppercase font-cinzel leading-tight">
                          {step.label}
                        </span>
                        <span className="text-[10px] opacity-80 font-medium leading-tight">
                          {step.desc}
                        </span>
                      </div>
                    </div>

                    <div className="font-mono font-black text-sm sm:text-base shrink-0">
                      {typeof step.val === 'number' && step.type !== 'TOTAL' ? `+${step.val}` : step.val}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            );
          })}
        </div>

        {/* TAP TO DISMISS */}
        {visibleStepIndex >= steps.length - 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] text-amber-300/80 font-bold uppercase tracking-widest mt-1"
          >
            ✦ DOKUNUP DEVAM EDİN ✦
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

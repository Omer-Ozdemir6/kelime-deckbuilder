import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Play, Compass, BookOpen, SkipForward } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../game/audioEngine';

export function SplashScreen({ onStart }) {
  const [introStage, setIntroStage] = useState('TEASER'); // TEASER | FLASH | MAIN_SPLASH
  const [activeWordIndex, setActiveWordIndex] = useState(0);

  const TEASER_WORDS = [
    { text: '🔮 KADİM HARFLER...', color: 'text-sky-300 drop-shadow-[0_0_20px_rgba(56,189,248,0.8)]' },
    { text: '📜 MÜHÜRLÜ EFSUNLAR...', color: 'text-purple-300 drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]' },
    { text: '🌋 KELİME ZİNDANLARI...', color: 'text-orange-400 drop-shadow-[0_0_20px_rgba(249,115,22,0.8)]' },
    { text: '✨ SÖZ DİYARI UYANIYOR!', color: 'text-amber-300 drop-shadow-[0_0_30px_rgba(245,158,11,1)] text-2xl font-black' }
  ];

  useEffect(() => {
    if (introStage === 'TEASER') {
      const interval = setInterval(() => {
        setActiveWordIndex((prev) => {
          if (prev < TEASER_WORDS.length - 1) {
            soundEngine.playTap();
            return prev + 1;
          } else {
            clearInterval(interval);
            // Flash transition
            setTimeout(() => {
              setIntroStage('FLASH');
              soundEngine.playVictory();
              confetti({ particleCount: 60, spread: 80, origin: { y: 0.5 } });

              setTimeout(() => {
                setIntroStage('MAIN_SPLASH');
              }, 400);
            }, 800);
            return prev;
          }
        });
      }, 900);

      return () => clearInterval(interval);
    }
  }, [introStage]);

  const handleSkipTeaser = (e) => {
    e.stopPropagation();
    soundEngine.playVictory();
    setIntroStage('MAIN_SPLASH');
  };

  const handleFinalStartClick = () => {
    soundEngine.playSuccess();
    if (onStart) onStart();
  };

  return (
    <div
      onClick={introStage === 'MAIN_SPLASH' ? handleFinalStartClick : handleSkipTeaser}
      className="fixed inset-0 z-[500] bg-black flex flex-col items-center justify-between p-6 select-none cursor-pointer overflow-hidden relative"
    >
      <AnimatePresence mode="wait">
        {/* 1. DARK TEASER INTRO ANIMATION */}
        {introStage === 'TEASER' && (
          <motion.div
            key="dark-teaser-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex flex-col items-center justify-center bg-black p-6 text-center"
          >
            {/* Ambient Ember Orbs */}
            <div className="absolute w-80 h-80 rounded-full bg-amber-500/10 blur-[130px] animate-pulse pointer-events-none" />

            <AnimatePresence mode="wait">
              <motion.div
                key={`teaser_word_${activeWordIndex}`}
                initial={{ opacity: 0, scale: 0.8, y: 15 }}
                animate={{ opacity: [0, 1, 1, 0.8], scale: [0.8, 1.05, 1, 1], y: 0 }}
                exit={{ opacity: 0, scale: 1.1, filter: 'blur(8px)' }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="flex flex-col items-center gap-3 z-10"
              >
                <span className={`font-cinzel tracking-widest text-lg sm:text-2xl font-black ${TEASER_WORDS[activeWordIndex].color}`}>
                  {TEASER_WORDS[activeWordIndex].text}
                </span>

                {/* Animated flickering candle line under words */}
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.5, 1] }}
                  transition={{ duration: 0.3, repeat: Infinity, repeatType: 'reverse' }}
                  className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full shadow-[0_0_10px_rgba(245,158,11,0.8)]"
                />
              </motion.div>
            </AnimatePresence>

            {/* Skip Button at bottom right */}
            <button
              onClick={handleSkipTeaser}
              className="absolute bottom-6 right-6 flex items-center gap-1 text-[10px] font-black text-slate-500 hover:text-slate-300 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-full backdrop-blur-md shadow-md"
            >
              <span>ATLA</span>
              <SkipForward size={12} />
            </button>
          </motion.div>
        )}

        {/* 2. GOLDEN FLASH ILLUMINATION */}
        {introStage === 'FLASH' && (
          <motion.div
            key="flash-illumination"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.3] }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[600] bg-amber-400/30 backdrop-blur-xl pointer-events-none"
          />
        )}

        {/* 3. MAIN CINEMATIC SPLASH SCREEN */}
        {introStage === 'MAIN_SPLASH' && (
          <motion.div
            key="main-splash-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 flex flex-col items-center justify-between p-6 bg-gradient-to-b from-[#030612] via-[#0a0f24] to-[#030612]"
          >
            {/* Background Ambient Glow Orbs */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-500/15 blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-10 left-10 w-64 h-64 rounded-full bg-purple-600/10 blur-[100px] pointer-events-none" />

            {/* Top Tagline */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mt-6 flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black tracking-widest uppercase shadow-md"
            >
              <Sparkles size={14} className="text-amber-400" />
              <span>TÜRKÇE ROGUELITE DECKBUILDER BAŞYAPITI</span>
            </motion.div>

            {/* Center Title Logo */}
            <div className="flex flex-col items-center text-center my-auto z-10">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.9, ease: [0.175, 0.885, 0.32, 1.275] }}
                className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 flex items-center justify-center text-5xl shadow-[0_0_50px_rgba(245,158,11,0.4)] border-2 border-yellow-200 mb-5 relative"
              >
                <span>🃏</span>
                <div className="absolute -inset-1 rounded-3xl bg-amber-400/20 blur-md -z-10 animate-pulse" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl sm:text-5xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-400 font-cinzel drop-shadow-lg"
              >
                KELİME DESTESİ
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xs sm:text-sm text-slate-400 font-bold mt-2 tracking-widest uppercase"
              >
                Söz Diyarı • Harfler, Mühürler & Kadim Efsunlar
              </motion.p>
            </div>

            {/* Bottom Click to Start Prompt */}
            <motion.div
              animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-8 flex flex-col items-center gap-2 z-10"
            >
              <div className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-yellow-300 text-slate-950 font-black text-sm tracking-wide shadow-[0_0_25px_rgba(245,158,11,0.5)] border border-yellow-200 flex items-center gap-2">
                <Play size={18} className="fill-slate-950" />
                <span>BAŞLAMAK İÇİN DOKUNUN VEYA TIKLAYIN</span>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold">TDK Sözlük Altyapılı V2.5 AAA Sürümü</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Sparkles, Lightbulb, Compass, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../game/audioEngine';

export function SplashScreen({ onStart }) {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const HINTS = [
    "💡 İPUCU: 5 ve üzeri harfli kelimeler ekstra kombo ve altın kazandırır.",
    "💡 İPUCU: Pasif Jokerler üst barda yerleşerek her kelimede skoru katlar.",
    "💡 İPUCU: TDK sözlüğünde geçerli tüm kelimelerin tanımlarını inceleyebilirsiniz.",
    "💡 İPUCU: Gezegen Taşları ile kelime kategorilerinizin seviyesini yükseltebilirsiniz.",
    "💡 İPUCU: Mühürlü Harfler (Altın, Cam, Çelik) kelimelerinize devasa bonuslar katar.",
    "💡 İPUCU: Zorlandığınız köre girmeyip Pas Geçerek (Skip Blind) Etiket Ödülü alabilirsiniz."
  ];

  const [hintIndex, setHintIndex] = useState(0);

  useEffect(() => {
    // Dynamic progress bar loader (0% -> 100%)
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          const step = Math.floor(Math.random() * 7) + 3;
          const next = prev + step;
          return next >= 100 ? 100 : next;
        } else {
          clearInterval(timer);
          setIsLoaded(true);
          soundEngine.playVictory();
          try {
            confetti({ particleCount: 50, spread: 75, origin: { y: 0.7 } });
          } catch (e) {}
          return 100;
        }
      });
    }, 100);

    // Hints rotation timer
    const hintTimer = setInterval(() => {
      setHintIndex((prev) => (prev + 1) % HINTS.length);
    }, 2800);

    return () => {
      clearInterval(timer);
      clearInterval(hintTimer);
    };
  }, []);

  const handleStartClick = () => {
    soundEngine.playSuccess();
    if (onStart) onStart();
  };

  return (
    <div
      onClick={handleStartClick}
      className="absolute inset-0 z-[500] w-full h-full bg-slate-950 flex flex-col items-center justify-between p-4 sm:p-6 select-none cursor-pointer overflow-hidden"
    >
      {/* BACKGROUND IMAGE WITH BLURRED BACKDROP & FULL MOBILE FIT */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
        <img
          src="/1.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-xl opacity-40 scale-110 pointer-events-none"
        />
        <img
          src="/1.png"
          alt="Kelime Destesi Arka Planı"
          className="w-full h-full object-contain sm:object-cover object-center filter brightness-105 contrast-110 relative z-10"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/60 z-20 pointer-events-none" />
      </div>

      {/* TOP TAGLINE BADGE */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-2 sm:mt-4 z-30 flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/85 border border-amber-500/50 text-amber-300 text-xs font-black tracking-widest uppercase shadow-2xl backdrop-blur-md"
      >
        <Sparkles size={14} className="text-amber-400" />
        <span>TÜRKÇE ROGUELITE DECKBUILDER BAŞYAPITI</span>
      </motion.div>

      {/* BOTTOM AREA: LOADING BAR & WIDE HINTS PANEL */}
      <div className="w-full max-w-2xl flex flex-col items-center gap-3 z-10 mt-auto mb-3 sm:mb-6">
        {/* ANIMATED LOADING BAR */}
        <div className="w-full bg-slate-950/90 border border-amber-500/50 rounded-2xl p-2 shadow-2xl backdrop-blur-md flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-black text-amber-300 px-1">
            <span className="flex items-center gap-1.5">
              <Compass size={14} className="animate-spin text-amber-400" />
              <span>YÜKLENİYOR...</span>
            </span>
            <span className="font-mono text-white text-sm font-extrabold">%{progress}</span>
          </div>

          <div className="w-full h-3.5 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 p-0.5 relative">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-lg shadow-[0_0_12px_rgba(245,158,11,0.8)]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.15 }}
            />
          </div>
        </div>

        {/* WIDE HINTS PANEL (GENİŞ İPUÇLARI KUTUSU) */}
        <div className="w-full bg-slate-950/90 border border-amber-500/40 rounded-2xl p-3.5 shadow-2xl backdrop-blur-md text-center min-h-[56px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={hintIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="text-xs sm:text-sm font-extrabold text-amber-200 leading-relaxed font-cinzel flex items-center justify-center gap-2"
            >
              <span>{HINTS[hintIndex]}</span>
            </motion.p>
          </AnimatePresence>
        </div>

        {/* TAP TO START BUTTON WHEN LOADED */}
        {isLoaded ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: [1, 1.05, 1], opacity: 1 }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm sm:text-base tracking-wider shadow-[0_0_30px_rgba(245,158,11,0.7)] border border-yellow-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play size={20} className="fill-slate-950" />
            <span>OYUNA BAŞLAMAK İÇİN TIKLAYIN VEYA DOKUNUN</span>
          </motion.div>
        ) : (
          <span className="text-[10px] text-slate-400 font-semibold">TDK Sözlük Altyapılı V2.5 AAA Sürümü</span>
        )}
      </div>
    </div>
  );
}


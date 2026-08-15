import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Sparkles, Compass, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../game/audioEngine';

// Dedicated AAA SVG Logo Emblem Component for VERBO
function VerboLogoEmblem() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer Runic Glow Circle */}
      <div className="absolute w-44 h-44 sm:w-56 sm:h-56 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />
      
      {/* Ornate Vektörel Rün Kalkanı & Kart Amblemi */}
      <svg className="w-36 h-36 sm:w-44 sm:h-44 text-amber-400 drop-shadow-[0_0_35px_rgba(245,158,11,0.6)]" viewBox="0 0 160 160" fill="none">
        <defs>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
          <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Outer Runic Ring */}
        <circle cx="80" cy="80" r="74" stroke="url(#shieldGrad)" strokeWidth="2.5" strokeDasharray="8 4" opacity="0.8" />
        <circle cx="80" cy="80" r="66" stroke="#fbbf24" strokeWidth="1.5" opacity="0.6" />

        {/* Center Card Shield */}
        <rect x="42" y="32" width="76" height="96" rx="16" fill="url(#cardGrad)" stroke="url(#shieldGrad)" strokeWidth="3" filter="url(#glow)" />

        {/* Card Inner Border */}
        <rect x="48" y="38" width="64" height="84" rx="12" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.5" strokeDasharray="4 2" />

        {/* Joker Crown Symbol */}
        <path d="M60 62 L70 78 L80 50 L90 78 L100 62 L96 90 L64 90 Z" fill="url(#shieldGrad)" stroke="#fef08a" strokeWidth="1.5" />
        
        {/* Crown Jewels */}
        <circle cx="60" cy="60" r="3" fill="#38bdf8" />
        <circle cx="80" cy="48" r="4" fill="#f43f5e" />
        <circle cx="100" cy="60" r="3" fill="#38bdf8" />
        <circle cx="80" cy="74" r="3" fill="#fef08a" />

        {/* Bottom Banner Scroll */}
        <path d="M35 118 Q80 128 125 118 L120 132 Q80 142 40 132 Z" fill="#78350f" stroke="#fbbf24" strokeWidth="1.5" />
        <text x="80" y="129" textAnchor="middle" fill="#fef08a" fontSize="10" fontWeight="900" fontFamily="Cinzel, serif" letterSpacing="2">VERBO</text>
      </svg>
    </div>
  );
}

const HINTS = [
  "💡 İPUCU: 5 ve üzeri harfli kelimeler ekstra kombo ve yüksek altın bonusu kazandırır.",
  "💡 İPUCU: Pasif Jokerler üst barda yerleşerek oynadığınız her kelimede puanınızı katlar.",
  "💡 İPUCU: TDK sözlüğünde geçerli tüm kelimelerin anlamlarını kart geçmişinden öğrenebilirsiniz.",
  "💡 İPUCU: Gezegen Efsunları ile kelime türlerinizin (İsim, Sıfat, Fiil) taban puanını yükseltebilirsiniz.",
  "💡 İPUCU: Mühürlü Harfler (Altın, Cam, Çelik, Holo) kelimelerinize muazzam çarpanlar ekler.",
  "💡 İPUCU: Zorlandığınız aşamaya girmeyip Pas Geçerek (Skip Blind) bedava Etiket Ödülü alabilirsiniz.",
  "💡 İPUCU: Harf Bankasını kullanarak elinizdeki değerli harfleri sonraki turlar için saklayabilirsiniz.",
  "💡 İPUCU: Aynı kökten gelen kelimeleri üst üste türeterek Kelime Zinciri kombo bonusu elde edebilirsiniz.",
  "💡 İPUCU: Dükkândan Deste Yenileme ve Kart Silme hakları satın alarak destenizi optimize edin.",
  "💡 İPUCU: Kombo seviyeniz arttıkça süreniz hızlanır; seri ve hızlı kelimeler üreterek skoru tavan yapın!",
  "💡 İPUCU: Boss aşamalarında özel kurallara dikkat edin; bazı Boss'lar belirli harfleri veya hamleleri kısıtlayabilir.",
  "💡 İPUCU: Kademe aşamalarını geçtikçe yeni Kahramanlar ve Efsanevi Mühürlerin kilidini açabilirsiniz."
];

function getLoadingStatusText(p) {
  if (p < 25) return "📖 TDK TÜRKÇE SÖZLÜK YÜKLENİYOR...";
  if (p < 50) return "🔮 HARF MÜHÜRLERİ VE EFSUNLAR HAZIRLANIYOR...";
  if (p < 75) return "🃏 PASİF JOKERLER VE DESTE SENKRONİZE EDİLİYOR...";
  if (p < 95) return "🌌 GEZEGEN TAŞLARI VE KADEMELER OLUŞTURULUYOR...";
  return "✨ KELİME DÜNYASI HAZIRLANDI!";
}

export function SplashScreen({ onStart }) {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);

  useEffect(() => {
    // Dynamic progress bar loader (0% -> 100%) with realistic stage delays
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          const step = Math.floor(Math.random() * 4) + 2;
          const next = prev + step;
          return next >= 100 ? 100 : next;
        } else {
          clearInterval(timer);
          // Brief pause at 100% before hiding loading bar
          setTimeout(() => {
            setIsLoaded(true);
            try {
              soundEngine.playVictory?.();
              confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
            } catch (e) {}
          }, 450);
          return 100;
        }
      });
    }, 130);

    // Hints rotation timer (6.5 seconds per hint for easy reading)
    const hintTimer = setInterval(() => {
      setHintIndex((prev) => (prev + 1) % HINTS.length);
    }, 6500);

    return () => {
      clearInterval(timer);
      clearInterval(hintTimer);
    };
  }, []);

  const handleStartClick = () => {
    try { soundEngine.playSuccess?.(); } catch (e) {}
    if (onStart) onStart();
  };

  return (
    <div
      onClick={handleStartClick}
      className="absolute inset-0 z-[500] w-full h-full bg-slate-950 flex flex-col items-center justify-between p-4 sm:p-8 select-none cursor-pointer overflow-hidden backdrop-blur-sm"
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Ambient Radial Glow Blob */}
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="w-[600px] h-[600px] bg-amber-500/15 rounded-full blur-3xl" />
      </div>

      {/* Background SVG Runic Radial Rays */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 z-0">
        <svg className="w-[700px] h-[700px] sm:w-[850px] sm:h-[850px] text-amber-500/35 animate-spin-slow" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="6 3" />
          <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <polygon points="100,20 180,100 100,180 20,100" fill="none" stroke="currentColor" strokeWidth="1" />
          <polygon points="100,10 190,100 100,190 10,100" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 2" />
        </svg>
      </div>

      {/* CENTER LOGO PREVIEW - HIGH QUALITY VERBO OFFICIAL BRANDING */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="my-auto z-20 flex flex-col items-center text-center cursor-pointer"
      >
        <img
          src="/verbo.png"
          alt="VERBO"
          className="w-full max-w-sm sm:max-w-md max-h-[300px] object-contain filter drop-shadow-[0_15px_40px_rgba(245,158,11,0.5)] hover:scale-105 transition-transform"
        />
      </motion.div>

      {/* BOTTOM AREA: LOADING BAR & WIDE HINTS PANEL */}
      <div className="w-full max-w-2xl flex flex-col items-center gap-3.5 z-30 mt-auto mb-4 sm:mb-8">
        {/* ANIMATED 3D ARCADE LOADING GAUGE - HIDES WHEN LOADED (100%) */}
        {!isLoaded && (
          <div className="w-full bg-slate-950/95 border-2 border-amber-500/60 rounded-3xl p-3 shadow-[0_0_35px_rgba(245,158,11,0.3)] backdrop-blur-xl flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-black text-amber-300 px-1">
              <span className="flex items-center gap-2">
                <Compass size={16} className="animate-spin text-amber-400" />
                <span className="tracking-wider">{getLoadingStatusText(progress)}</span>
              </span>
              <span className="font-mono text-white text-sm font-black bg-amber-950/80 border border-amber-500/40 px-2.5 py-0.5 rounded-xl shadow">
                %{progress}
              </span>
            </div>

            {/* 3D Progress Fill Bar */}
            <div className="w-full h-4 sm:h-5 bg-slate-900 rounded-full overflow-hidden border-2 border-slate-800 p-0.5 relative shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.9)] relative overflow-hidden flex items-center justify-end pr-2"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut', duration: 0.15 }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.45)_50%,transparent_100%)] animate-shimmer" />
              </motion.div>
            </div>
          </div>
        )}

        {/* WIDE HINTS PANEL (GENİŞ İPUÇLARI KUTUSU - FLICKER FREE) */}
        <div className="w-full bg-slate-950/95 border-2 border-amber-500/40 rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl text-center min-h-[60px] flex items-center justify-center">
          <p className="text-xs sm:text-sm font-black text-amber-200 leading-relaxed font-cinzel flex items-center justify-center gap-2">
            <span>{HINTS[hintIndex]}</span>
          </p>
        </div>

        {/* TAP TO START TEXT WHEN LOADED - BREATHING FADE IN/OUT ANIMATION */}
        {isLoaded ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: [0.25, 1, 0.25], scale: [0.98, 1.02, 0.98] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
            className="w-full py-3.5 text-center cursor-pointer select-none"
          >
            <span className="text-sm sm:text-base font-black text-amber-300 tracking-widest font-cinzel uppercase drop-shadow-[0_0_20px_rgba(245,158,11,0.9)] flex items-center justify-center gap-2">
              <Sparkles size={16} className="text-amber-400 animate-pulse" />
              <span>BAŞLAMAK İÇİN DOKUNUN</span>
              <Sparkles size={16} className="text-amber-400 animate-pulse" />
            </span>
          </motion.div>
        ) : (
          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold">
            <ShieldCheck size={13} className="text-emerald-400" />
            <span>TDK Resmi Sözlük Altyapılı V2.5 AAA Sürümü</span>
          </div>
        )}
      </div>
    </div>
  );
}




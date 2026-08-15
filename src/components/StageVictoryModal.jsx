import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, CheckCircle2, Coins, Calculator, BookOpen, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../game/audioEngine';
import { RunicCardFrame } from './RunicCardFrame';

// Custom 3D SVG Victory Laurel Trophy Crest Component
function StageVictorySvgCrest() {
  return (
    <div className="relative flex items-center justify-center mb-1">
      {/* Outer Golden Glow Blob */}
      <div className="absolute w-28 h-28 rounded-full bg-amber-500/30 blur-2xl pointer-events-none" />

      <svg className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-[0_10px_30px_rgba(245,158,11,0.7)]" viewBox="0 0 120 120" fill="none">
        <defs>
          <linearGradient id="trophyGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="40%" stopColor="#fef08a" />
            <stop offset="75%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <linearGradient id="laurelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        {/* Outer Laurel Wreath Leaves */}
        <path d="M22 78 C8 60, 12 32, 35 22 M98 78 C112 60, 108 32, 85 22" stroke="url(#laurelGrad)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <circle cx="18" cy="68" r="4.5" fill="#fef08a" />
        <circle cx="102" cy="68" r="4.5" fill="#fef08a" />
        <circle cx="25" cy="42" r="5" fill="#facc15" />
        <circle cx="95" cy="42" r="5" fill="#facc15" />
        <circle cx="36" cy="25" r="4.5" fill="#fff" />
        <circle cx="84" cy="25" r="4.5" fill="#fff" />

        {/* Trophy Base Pedestal */}
        <path d="M38 96 L82 96 L76 82 L44 82 Z" fill="#451a03" stroke="#fef08a" strokeWidth="2" />
        <rect x="44" y="76" width="32" height="7" fill="url(#trophyGoldGrad)" stroke="#78350f" strokeWidth="1.5" rx="1.5" />

        {/* Trophy Cup Body */}
        <path d="M34 30 L86 30 C86 30, 90 66, 60 76 C30 66, 34 30, 34 30 Z" fill="url(#trophyGoldGrad)" stroke="#78350f" strokeWidth="2.5" />
        
        {/* Handles */}
        <path d="M34 36 C18 36, 18 58, 36 60 M86 36 C102 36, 102 58, 84 60" stroke="url(#trophyGoldGrad)" strokeWidth="4" fill="none" strokeLinecap="round" />

        {/* Center Star Seal */}
        <path d="M60 40 L63.5 49 L72.5 49 L65 54.5 L68.5 63.5 L60 58 L51.5 63.5 L55 54.5 L47.5 49 L56.5 49 Z" fill="#ffffff" stroke="#b45309" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

// Line Item SVG Icons
function LineSvgIcon({ type }) {
  if (type === 'base') {
    return (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" fill="#451a03" stroke="#f59e0b" strokeWidth="1.5" />
        <path d="M12 30 H28 M14 26 H26 M15 16 V26 M20 16 V26 M25 16 V26 M12 16 L20 10 L28 16 Z" fill="#fef08a" stroke="#78350f" strokeWidth="1" />
      </svg>
    );
  }
  if (type === 'words') {
    return (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 40 40" fill="none">
        <rect x="6" y="6" width="28" height="28" rx="6" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" />
        <text x="20" y="27" textAnchor="middle" fill="#c7d2fe" fontSize="18" fontWeight="900" fontFamily="Cinzel, serif">A</text>
      </svg>
    );
  }
  if (type === 'combo') {
    return (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" fill="#450a0a" stroke="#f87171" strokeWidth="1.5" />
        <path d="M20 8 C25 16, 32 20, 28 30 C25 35, 15 35, 12 30 C9 20, 15 16, 20 8 Z" fill="#f97316" stroke="#fef08a" strokeWidth="1" />
      </svg>
    );
  }
  if (type === 'overkill') {
    return (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" fill="#064e3b" stroke="#34d399" strokeWidth="1.5" />
        <path d="M20 10 L23 16 L29 16 L24 20 L26 26 L20 22 L14 26 L16 20 L11 16 L17 16 Z" fill="#fef08a" />
      </svg>
    );
  }
  if (type === 'interest') {
    return (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" fill="#713f12" stroke="#facc15" strokeWidth="1.5" />
        <rect x="10" y="14" width="20" height="14" rx="3" fill="#eab308" stroke="#78350f" strokeWidth="1" />
        <text x="20" y="25" textAnchor="middle" fill="#78350f" fontSize="12" fontWeight="900">$</text>
      </svg>
    );
  }

  // TOTAL
  return (
    <svg className="w-6 h-6 shrink-0" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" fill="#713f12" stroke="#fef08a" strokeWidth="2" />
      <path d="M10 28 L8 14 L15 20 L20 8 L25 20 L32 14 L30 28 Z" fill="#facc15" stroke="#fef08a" strokeWidth="1" />
    </svg>
  );
}

export function StageVictoryModal({
  stage,
  score,
  targetScore,
  goldEarned,
  playedWords = [],
  combo = 1,
  onProceedToRewards,
  onOpenMeaningModal
}) {
  const [activeTab, setActiveTab] = useState('GOLD'); // 'GOLD' or 'SCORE'
  const [visibleLineCount, setVisibleLineCount] = useState(0);

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 85,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  }, []);

  const handleWordClick = (rawWord) => {
    const wordStr = typeof rawWord === 'object' ? (rawWord?.word || rawWord?.cleanWord || '') : String(rawWord || '');
    if (wordStr && onOpenMeaningModal) {
      try { soundEngine.playTap?.(); } catch(e) {}
      onOpenMeaningModal(wordStr);
    }
  };

  // Balatro-tight Gold Calculations
  const baseStageGold = Math.max(3, Number(goldEarned) || 3);
  const comboBonusGold = combo > 2 ? Math.min(3, Math.floor(combo / 2)) : 0;
  const overkillGold = score > targetScore ? Math.min(8, Math.floor((score - targetScore) / 40)) : 0;
  const interestGold = Math.min(5, Math.floor((goldEarned || 0) / 5)); // +1 per 5 gold held, max +5
  const grandTotalGold = baseStageGold + comboBonusGold + overkillGold + interestGold;

  // Build Gold calculation lines array
  const goldLines = [
    { id: 'base', type: 'base', label: 'Mücadele Başarı Ödülü', val: `+${baseStageGold} 💰`, color: 'text-amber-300' },
    ...(comboBonusGold > 0 ? [{ id: 'combo', type: 'combo', label: `Kombo Serisi Ödülü (×${combo})`, val: `+${comboBonusGold} 💰`, color: 'text-orange-300' }] : []),
    ...(overkillGold > 0 ? [{ id: 'overkill', type: 'overkill', label: 'Skor Fazlası Performans', val: `+${overkillGold} 💰`, color: 'text-emerald-300' }] : []),
    ...(interestGold > 0 ? [{ id: 'interest', type: 'interest', label: 'Banka Faiz Geliri (Her 5 Altına +1)', val: `+${interestGold} 💰`, color: 'text-yellow-300 font-bold' }] : []),
    { id: 'total', type: 'total', label: 'KAZANILAN NET ALTIN', val: `+${grandTotalGold} 💰`, color: 'text-amber-400 font-extrabold text-sm', isTotal: true }
  ];

  const safePlayedWords = Array.isArray(playedWords) ? playedWords : [];

  // Build Score calculation lines array
  let runningScore = 0;
  const scoreLines = safePlayedWords.map((rawItem, idx) => {
    const wordStr = typeof rawItem === 'object' ? (rawItem?.word || '') : String(rawItem || '');
    const approxWordScore = Math.max(10, Math.floor((score / Math.max(1, safePlayedWords.length)) * (0.8 + idx * 0.1)));
    runningScore += approxWordScore;
    if (idx === safePlayedWords.length - 1) runningScore = score;
    return {
      id: `word_${idx}`,
      index: idx + 1,
      word: wordStr,
      pts: approxWordScore,
      cumulative: runningScore
    };
  });

  const activeLinesCount = activeTab === 'GOLD' ? goldLines.length : scoreLines.length;

  useEffect(() => {
    setVisibleLineCount(0);
    const interval = setInterval(() => {
      setVisibleLineCount(prev => {
        if (prev < activeLinesCount) {
          try { soundEngine.playTap?.(); } catch(e) {}
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 380);

    return () => clearInterval(interval);
  }, [activeTab, activeLinesCount]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 bg-slate-950/95 backdrop-blur-2xl select-none">
      {/* Background SVG Starburst Rays */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 z-0">
        <svg className="w-[750px] h-[750px] text-amber-500/35 animate-spin-slow" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="6 3" />
          <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <polygon points="100,10 190,100 100,190 10,100" fill="none" stroke="currentColor" strokeWidth="1" />
          <polygon points="100,20 180,100 100,180 20,100" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 2" />
        </svg>
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-md max-h-[92vh] overflow-y-auto scrollbar-thin bg-slate-950/95 border-4 border-amber-500/80 rounded-3xl p-4 sm:p-5 shadow-[0_0_60px_rgba(245,158,11,0.4)] flex flex-col items-center text-center text-slate-100 relative z-10 backdrop-blur-2xl"
      >
        {/* Runic Card Frame Overlay */}
        <RunicCardFrame rarity="legendary" active={true} />

        {/* Top Trophy Crest */}
        <StageVictorySvgCrest />

        <h2 className="text-lg sm:text-2xl font-black text-amber-300 font-cinzel tracking-wider uppercase drop-shadow-[0_4px_10px_rgba(245,158,11,0.5)]">
          KADEME {stage} TAMAMLANDI!
        </h2>
        <p className="text-[11px] sm:text-xs text-slate-300 font-medium mt-0.5">
          Tebrikler! Baraj puanı geçildi, zafer puanları hesaplanıyor...
        </p>

        {/* Header Summary Cards */}
        <div className="w-full grid grid-cols-2 gap-2 my-2.5 z-10">
          <div className="p-2.5 rounded-2xl bg-slate-900/95 border-2 border-emerald-500/70 flex flex-col items-center justify-center shadow-lg">
            <span className="text-[11px] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 size={13} /> Ulaşılan Puan
            </span>
            <span className="text-base sm:text-lg font-extrabold text-emerald-300 mt-0.5 font-mono">
              {score} <span className="text-xs text-slate-400 font-normal">/ {targetScore}</span>
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-900/95 border-2 border-amber-500/70 flex flex-col items-center justify-center shadow-lg">
            <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <Coins size={13} /> Kazanılan Altın
            </span>
            <span className="text-base sm:text-lg font-extrabold text-amber-300 mt-0.5 font-mono">
              +{grandTotalGold} 💰
            </span>
          </div>
        </div>

        {/* CLICKABLE PLAYED WORDS CHIPS BAR (TDK ANLAMI ÖĞREN) */}
        {safePlayedWords.length > 0 && (
          <div className="w-full bg-slate-900/95 border-2 border-amber-500/50 rounded-2xl p-2.5 my-1.5 z-10 text-left">
            <div className="flex items-center justify-between text-[10px] font-black text-amber-300 mb-1.5 uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <BookOpen size={13} className="text-amber-400" />
                <span>OYNANAN KELİMELER (TDK ANLAMI İÇİN TIKLA):</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
              {safePlayedWords.map((item, i) => {
                const wordStr = typeof item === 'object' ? (item?.word || '') : String(item || '');
                if (!wordStr) return null;
                return (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleWordClick(wordStr)}
                    className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-950 to-yellow-950 hover:from-amber-900 border border-amber-400/80 text-amber-200 text-xs font-black flex items-center gap-1 shadow-md shrink-0 cursor-pointer"
                    title={`"${wordStr}" TDK Sözlük Anlamını Oku`}
                  >
                    <span>{wordStr}</span>
                    <span className="text-[10px] text-amber-400">📖</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab Toggle Selector */}
        <div className="w-full flex items-center bg-slate-950 p-1 rounded-2xl border-2 border-slate-800 my-1.5 z-10">
          <button
            onClick={() => setActiveTab('GOLD')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'GOLD'
                ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Coins size={13} />
            <span>💰 Altın Dökümü</span>
          </button>

          <button
            onClick={() => setActiveTab('SCORE')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'SCORE'
                ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calculator size={13} />
            <span>🎯 Skor & Kelimeler</span>
          </button>
        </div>

        {/* TAB 1: GOLD BREAKDOWN WITH SEQUENTIAL TYPEWRITER ANIMATION */}
        {activeTab === 'GOLD' && (
          <div className="w-full bg-slate-900/95 border-2 border-amber-500/50 rounded-2xl p-3 my-1 text-left space-y-2 shadow-xl min-h-[150px] z-10">
            <div className="flex items-center justify-between text-xs font-black text-amber-300 border-b-2 border-amber-500/30 pb-1.5">
              <span className="flex items-center gap-1.5">
                <Coins size={14} className="text-amber-400 fill-amber-400" />
                ADIM ADIM ALTIN HESAPLAMASI:
              </span>
              <span className="text-emerald-400 font-mono font-black text-xs sm:text-sm">+{grandTotalGold} 💰</span>
            </div>

            <div className="space-y-1.5 pt-0.5">
              {goldLines.map((line, idx) => {
                const isVisible = idx < visibleLineCount;
                if (!isVisible) return null;

                return (
                  <motion.div
                    key={line.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className={`flex items-center justify-between py-1.5 px-2.5 rounded-xl text-xs font-bold border transition-all ${
                      line.isTotal
                        ? 'bg-amber-950 border-amber-400 text-amber-300 mt-1.5 pt-1.5 border-2 shadow-lg'
                        : 'border-slate-800 bg-slate-950/90 text-slate-200'
                    }`}
                  >
                    {/* Left-to-Right Label with Custom SVG Icon */}
                    <div className="flex items-center gap-2 overflow-hidden">
                      <LineSvgIcon type={line.type} />
                      <span className="truncate">{line.label}</span>
                    </div>

                    {/* Right-side Score/Gold Points */}
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.15, type: 'spring' }}
                      className={`font-mono ${line.color} shrink-0 ml-2`}
                    >
                      {line.val}
                    </motion.span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: SCORE BREAKDOWN WITH CLICKABLE WORDS */}
        {activeTab === 'SCORE' && (
          <div className="w-full bg-slate-900/95 border-2 border-slate-800 rounded-2xl p-3 my-1 text-left space-y-2 shadow-inner min-h-[150px] z-10">
            <div className="flex items-center justify-between text-xs font-black text-amber-300 border-b-2 border-slate-800 pb-1.5">
              <span className="flex items-center gap-1.5">
                <Calculator size={14} className="text-amber-400" />
                KELİME KELİME PUANLAMA SIRASI:
              </span>
              <span>KÜMÜLATİF SKOR</span>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 scrollbar-thin">
              {scoreLines.map((item, idx) => {
                const isVisible = idx < visibleLineCount;
                if (!isVisible) return null;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-xl bg-slate-950/90 border border-slate-800"
                  >
                    {/* Left side Word - CLICKABLE FOR TDK MEANING */}
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <span className="text-[10px] text-slate-500 font-mono">#{item.index}</span>
                      <button
                        onClick={() => handleWordClick(item.word)}
                        className="font-black text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer truncate bg-amber-950/80 px-2 py-0.5 rounded-lg border border-amber-500/40"
                        title={`"${item.word}" TDK Anlamını Oku`}
                      >
                        <span className="truncate">{item.word}</span>
                        <span className="text-[9px] text-amber-400 shrink-0">📖</span>
                      </button>
                    </div>

                    {/* Right side Points Rollup */}
                    <div className="flex items-center gap-2 font-mono shrink-0 ml-2">
                      <span className="text-[10px] text-slate-400">+{item.pts}p</span>
                      <span className="font-extrabold text-emerald-300 text-xs">➔ {item.cumulative}p</span>
                    </div>
                  </motion.div>
                );
              })}

              {visibleLineCount >= scoreLines.length && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between pt-2 border-t-2 border-amber-500/40 text-xs font-black text-amber-300 px-1"
                >
                  <span>🏆 KADEME NET SKORU</span>
                  <span className="text-sm font-extrabold text-emerald-300 font-mono">{score} / {targetScore}</span>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* Proceed Action Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          onClick={onProceedToRewards}
          className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black py-3.5 px-6 rounded-2xl transition flex items-center justify-center gap-2.5 shadow-2xl text-xs sm:text-base tracking-wider border-2 border-yellow-100 cursor-pointer mt-2 z-10"
        >
          <span>ÖDÜLÜ AL VE DEVAM ET</span>
          <ChevronRight size={20} />
        </motion.button>
      </motion.div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Flame, RotateCcw, Star, Coins, Home, Settings, Target, Sparkles } from 'lucide-react';
import { getBossStageRule, getMaxComboTime } from '../hooks/useGameState';
import { RELICS } from '../game/relicData';
import { PASSIVE_JOKERS } from '../game/cardData';
import { JokerCardIllustration } from './JokerCardIllustration';

function ComboTimerBadge({ combo, comboTimeLeft }) {
  const maxTime = getMaxComboTime(combo);
  const timePercent = Math.max(0, Math.min(100, (comboTimeLeft / maxTime) * 100));

  let badgeStyle = 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950';
  let glowStyle = 'shadow-[0_0_20px_rgba(245,158,11,0.6)] border-amber-300';
  let label = `KOMBO ×${combo}`;
  let icon = <Flame size={15} className="fill-slate-950 text-slate-950" />;

  if (combo > 7) {
    badgeStyle = 'bg-gradient-to-r from-cyan-400 via-indigo-600 to-purple-700 text-white';
    glowStyle = 'shadow-[0_0_25px_rgba(34,211,238,0.8)] border-cyan-300';
    label = `🌌 SUPERNOVA ×${combo}`;
    icon = <Sparkles size={16} className="fill-cyan-200 text-cyan-200 animate-spin" />;
  } else if (combo > 5) {
    badgeStyle = 'bg-gradient-to-r from-rose-600 via-red-600 to-orange-500 text-white';
    glowStyle = 'shadow-[0_0_25px_rgba(244,63,94,0.8)] border-rose-300';
    label = `🌋 VOLKANİK ÖFKE ×${combo}`;
    icon = <Flame size={16} className="fill-amber-300 text-amber-300 animate-pulse" />;
  } else if (combo > 3) {
    badgeStyle = 'bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 text-slate-950';
    glowStyle = 'shadow-[0_0_20px_rgba(249,115,22,0.7)] border-amber-300';
    label = `🔥 ATEŞ FIRTINASI ×${combo}`;
    icon = <Flame size={16} className="fill-slate-950 text-amber-200 animate-pulse" />;
  }

  const isLowTime = comboTimeLeft <= 3;

  return (
    <div className={`relative px-3 py-1 rounded-xl ${badgeStyle} ${glowStyle} border-2 text-xs font-black flex items-center gap-1.5 select-none shadow-lg overflow-hidden shrink-0 ${isLowTime ? 'animate-pulse' : ''}`}>
      {/* Depleting progress background bar overlay */}
      <div
        className="absolute bottom-0 left-0 h-1 bg-white/70 transition-all duration-1000 ease-linear rounded-full"
        style={{ width: `${timePercent}%` }}
      />

      <span className="relative z-10 flex items-center gap-1.5">
        {icon}
        <span className="tracking-wide uppercase font-black font-cinzel">{label}</span>
      </span>
    </div>
  );
}

function TargetScoreGauge({ progressPercent }) {
  const strokeDashoffset = 100 - progressPercent;

  return (
    <div className="relative w-8 h-8 shrink-0 flex items-center justify-center select-none">
      <svg className="w-full h-full transform -rotate-90 overflow-visible">
        <circle
          cx="16"
          cy="16"
          r="12"
          fill="none"
          stroke="rgba(15, 23, 42, 0.9)"
          strokeWidth="3"
        />
        <circle
          cx="16"
          cy="16"
          r="12"
          fill="none"
          stroke="#10b981"
          strokeWidth="3.5"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray="100"
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-emerald-300">
        <span>{progressPercent}%</span>
      </div>
    </div>
  );
}

function useAnimatedScore(targetScoreValue) {
  const [displayScore, setDisplayScore] = useState(targetScoreValue);

  useEffect(() => {
    if (displayScore === targetScoreValue) return;
    const diff = targetScoreValue - displayScore;
    const step = Math.max(1, Math.ceil(Math.abs(diff) / 10));
    const timer = setTimeout(() => {
      setDisplayScore(prev => {
        if (prev < targetScoreValue) return Math.min(targetScoreValue, prev + step);
        return Math.max(targetScoreValue, prev - step);
      });
    }, 20);
    return () => clearTimeout(timer);
  }, [targetScoreValue, displayScore]);

  return displayScore;
}

export function HeaderBar({
  stage = 1,
  currentScore = 0,
  targetScore = 100,
  handsLeft = 4,
  discardsLeft = 3,
  combo = 1,
  comboTimeLeft = 100,
  gold = 0,
  lives = 3,
  activeRelicKeys = [],
  fullDeckCount = 20,
  onOpenDeckInspector,
  onDiscardHand,
  onOpenMainMenu,
  onOpenRelicTooltip,
  activeBiome,
  activeFloorModifier
}) {
  const [showMinusOne, setShowMinusOne] = useState(false);
  const prevHandsRef = useRef(handsLeft);
  const animatedScore = useAnimatedScore(currentScore);

  useEffect(() => {
    if (handsLeft < prevHandsRef.current) {
      setShowMinusOne(true);
      const timer = setTimeout(() => {
        setShowMinusOne(false);
      }, 1200);
      prevHandsRef.current = handsLeft;
      return () => clearTimeout(timer);
    }
    prevHandsRef.current = handsLeft;
  }, [handsLeft]);

  const safeTargetScore = (targetScore && !isNaN(targetScore) && Number(targetScore) > 0) ? Number(targetScore) : 100;
  const rawPercent = Math.floor((animatedScore / safeTargetScore) * 100);
  const progressPercent = Math.min(100, Math.max(0, isNaN(rawPercent) || !isFinite(rawPercent) ? 0 : rawPercent));
  const bossRule = getBossStageRule(stage);

  // Biome-driven accent glow
  const biomeGlowColor = activeBiome?.glowColor || 'rgba(245, 158, 11, 0.5)';

  return (
    <header className="w-full bg-slate-950/90 border-b border-slate-800/80 p-2 sm:p-2.5 flex flex-col gap-2 z-10 shadow-2xl backdrop-blur-xl relative">
      {/* Top Ambient Glow Line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] transition-all duration-1000"
        style={{ background: `linear-gradient(90deg, transparent, ${biomeGlowColor}, transparent)` }}
      />

      {/* TOP ROW: GOLD BADGE (LEFT), COMBO TIMER & SETTINGS GEAR (RIGHT) */}
      <div className="w-full flex items-center justify-between gap-3 z-20 relative">
        {/* GOLD COUNT BADGE IN TOP-LEFT */}
        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-amber-300 bg-slate-900/90 border border-amber-500/40 px-3 py-1 rounded-xl shadow-inner font-mono">
          <Coins size={15} className="text-amber-400 fill-amber-400" />
          <span>${gold}</span>
        </div>

        {/* RIGHT: COMBO BADGE & SETTINGS GEAR */}
        <div className="flex items-center gap-2 shrink-0">
          {combo > 1 && (
            <ComboTimerBadge combo={combo} comboTimeLeft={comboTimeLeft} />
          )}

          {onOpenMainMenu && (
            <button
              onClick={onOpenMainMenu}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition active:scale-95 shadow-md cursor-pointer"
              title="Ayarlar & Menü"
            >
              <Settings size={16} className="text-amber-400" />
            </button>
          )}
        </div>
      </div>

      {/* MIDDLE ROW: SLEEK 1-LINE TARGET SCORE & PROGRESS STRIP WITH SEQUENTIAL ANIMATED COUNT-UP */}
      <div className="w-full bg-slate-950/90 border border-emerald-500/50 rounded-2xl px-3 py-1.5 flex items-center justify-between gap-3 shadow-lg z-20 relative">
        {/* Left: Gauge + Target Text + Sequential Count-Up */}
        <div className="flex items-center gap-2 shrink-0">
          <TargetScoreGauge progressPercent={progressPercent} />
          <span className="text-[11px] font-black text-emerald-300 font-cinzel">HEDEF:</span>
          <span className="text-sm sm:text-base font-black text-emerald-300 font-mono tracking-wider">
            {animatedScore} <span className="text-slate-500 text-xs font-bold">/ {safeTargetScore}</span>
          </span>
        </div>

        {/* Center: Thin Progress Bar */}
        <div className="flex-1 h-2 sm:h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800 relative shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.8)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Right: Hamle Hakkı */}
        <div className="flex items-center gap-1.5 shrink-0 text-xs font-bold">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-300">HAMLE HAKKI:</span>
          <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 rounded-lg font-black text-xs font-mono shadow border border-yellow-200 min-w-[28px] text-center">
            {showMinusOne ? <span className="text-rose-950 font-black animate-pulse">-1</span> : handsLeft}
          </span>
        </div>
      </div>

      {/* BOTTOM ROW: ALL 5 PASSIVE JOKER SLOTS FIT ON SCREEN WITHOUT SCROLLING (NO LABEL TEXT) */}
      <div className="w-full grid grid-cols-5 gap-1.5 sm:gap-2.5 p-1.5 bg-purple-950/40 border-2 border-purple-800/60 rounded-2xl shadow-inner z-20 relative">
        {Array.from({ length: 5 }).map((_, slotIdx) => {
          const relicKey = activeRelicKeys[slotIdx];
          const item = relicKey ? (PASSIVE_JOKERS[relicKey] || RELICS[relicKey]) : null;

          if (item) {
            return (
              <motion.button
                key={`passive_slot_${relicKey}_${slotIdx}`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onOpenRelicTooltip && onOpenRelicTooltip(relicKey)}
                className="w-full py-1.5 px-1 rounded-xl bg-gradient-to-b from-purple-900 via-indigo-950 to-slate-950 border-2 border-purple-400/80 hover:border-purple-300 text-purple-100 text-[10px] sm:text-xs font-black flex flex-col sm:flex-row items-center justify-center gap-1 shadow-lg transition cursor-pointer group truncate"
                title={`${item.name}: ${item.desc || item.description}`}
              >
                <JokerCardIllustration cardId={relicKey} className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform shrink-0 drop-shadow" />
                <span className="truncate w-full text-center sm:text-left font-cinzel leading-tight">{item.name}</span>
              </motion.button>
            );
          }

          return (
            <div
              key={`passive_empty_slot_${slotIdx}`}
              className="w-full h-10 sm:h-12 rounded-xl border-2 border-dashed border-purple-900/60 bg-slate-950/60 flex items-center justify-center text-[9px] sm:text-[10px] font-black text-purple-400/40 uppercase tracking-widest font-mono"
            >
              #{slotIdx + 1}
            </div>
          );
        })}
      </div>
    </header>
  );
}

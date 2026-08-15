import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Flame, RotateCcw, Star, Coins, Home, Target, Sparkles } from 'lucide-react';
import { getBossStageRule, getMaxComboTime } from '../hooks/useGameState';
import { RELICS } from '../game/relicData';
import { PASSIVE_JOKERS } from '../game/cardData';
import { JokerCardIllustration } from './JokerCardIllustration';

function ComboTimerBadge({ combo, comboTimeLeft }) {
  const maxTime = getMaxComboTime(combo);
  const timePercent = Math.max(0, Math.min(100, (comboTimeLeft / maxTime) * 100));
  const strokeDashoffset = 100 - timePercent;

  let strokeColor = '#f59e0b';
  let glowColor = 'rgba(245, 158, 11, 0.7)';
  let badgeStyle = 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black';
  let label = `KOMBO ×${combo}`;
  let icon = <Flame size={15} className="fill-slate-950 text-slate-950" />;

  if (combo > 7) {
    strokeColor = '#22d3ee';
    glowColor = 'rgba(34, 211, 238, 0.85)';
    badgeStyle = 'bg-gradient-to-r from-cyan-400 via-indigo-600 to-purple-700 text-white font-black';
    label = `🌌 SUPERNOVA ×${combo}`;
    icon = <Sparkles size={16} className="fill-cyan-200 text-cyan-200 animate-spin" />;
  } else if (combo > 5) {
    strokeColor = '#f43f5e';
    glowColor = 'rgba(244, 63, 94, 0.85)';
    badgeStyle = 'bg-gradient-to-r from-rose-600 via-red-600 to-orange-500 text-white font-black';
    label = `🌋 VOLKANİK ÖFKE ×${combo}`;
    icon = <Flame size={16} className="fill-amber-300 text-amber-300 animate-pulse" />;
  } else if (combo > 3) {
    strokeColor = '#f97316';
    glowColor = 'rgba(249, 115, 22, 0.85)';
    badgeStyle = 'bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 text-slate-950 font-black';
    label = `🔥 ATEŞ FIRTINASI ×${combo}`;
    icon = <Flame size={16} className="fill-slate-950 text-amber-200 animate-pulse" />;
  }

  const isLowTime = comboTimeLeft <= 3;
  if (isLowTime) {
    strokeColor = '#ef4444';
    glowColor = 'rgba(239, 68, 68, 0.95)';
  }

  return (
    <div className="relative inline-flex items-center p-[4px] shrink-0 select-none group">
      {/* SURROUNDING PERIMETER TIMER SVG OVERLAY */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        style={{ filter: `drop-shadow(0 0 8px ${glowColor})` }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Background track border */}
        <rect
          x="2"
          y="2"
          width="96"
          height="96"
          rx="12"
          ry="12"
          fill="none"
          stroke="rgba(15, 23, 42, 0.6)"
          strokeWidth="3.5"
          vectorEffect="non-scaling-stroke"
        />
        {/* Depleting perimeter progress line */}
        <rect
          x="2"
          y="2"
          width="96"
          height="96"
          rx="12"
          ry="12"
          fill="none"
          stroke={strokeColor}
          strokeWidth="3.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          pathLength="100"
          strokeDasharray="100"
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease'
          }}
        />
      </svg>


      {/* Inner Badge Pill (No text numbers!) */}
      <div className={`px-3 py-1.5 rounded-xl ${badgeStyle} text-xs sm:text-sm flex items-center gap-1.5 shadow-md relative z-10 ${isLowTime ? 'animate-pulse' : ''}`}>
        {icon}
        <span className="tracking-wide uppercase font-black">{label}</span>
      </div>
    </div>
  );
}


function TargetScoreGauge({ progressPercent }) {

  const strokeDashoffset = 100 - progressPercent;

  return (
    <div className="relative w-9 h-9 shrink-0 flex items-center justify-center select-none">
      <svg className="w-full h-full transform -rotate-90 overflow-visible" style={{ filter: 'url(#runicGlowFilter)' }}>
        <circle
          cx="18"
          cy="18"
          r="14"
          fill="none"
          stroke="rgba(15, 23, 42, 0.9)"
          strokeWidth="3"
        />
        <circle
          cx="18"
          cy="18"
          r="14"
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

export function HeaderBar({
  stage,
  currentScore,
  targetScore,
  handsLeft,
  discardsLeft,
  combo = 1,
  comboTimeLeft = 10,
  gold = 20,
  lives = 3,
  activeRelicKeys = [],
  fullDeckCount,
  onOpenDeckInspector,
  onDiscardHand,
  onOpenMainMenu,
  onOpenRelicTooltip,
  activeBiome,
  activeFloorModifier
}) {
  const [showMinusOne, setShowMinusOne] = useState(false);
  const prevHandsRef = useRef(handsLeft);

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
  const rawPercent = Math.floor((currentScore / safeTargetScore) * 100);
  const progressPercent = Math.min(100, Math.max(0, isNaN(rawPercent) || !isFinite(rawPercent) ? 0 : rawPercent));
  const bossRule = getBossStageRule(stage);

  // Biome-driven accent glow
  const biomeGlowColor = activeBiome?.glowColor || 'rgba(245, 158, 11, 0.5)';
  const biomeAccent = activeBiome?.accentColor || 'text-amber-400';

  return (
    <header className="w-full bg-slate-950/85 border-b border-slate-800/80 p-2.5 sm:p-3 flex flex-col gap-2 z-10 shadow-2xl backdrop-blur-xl relative">
      {/* Top Ambient Glow Line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] transition-all duration-1000"
        style={{ background: `linear-gradient(90deg, transparent, ${biomeGlowColor}, transparent)` }}
      />

      {/* Top Stat Badges Row */}
      <div className="flex items-center justify-between gap-1 flex-wrap">
        {/* Left Badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-600/10 border border-amber-500/40 text-amber-300 text-xs font-black tracking-wider flex items-center gap-1 shadow-md shadow-amber-950/30">
            <Sparkles size={12} className="text-amber-400" />
            <span>KADEME {stage}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-300 bg-slate-900/90 border border-amber-500/30 px-2.5 py-1 rounded-xl shadow-inner">
            <Coins size={13} className="text-amber-400 fill-amber-400" />
            <span>{gold}</span>
          </div>

          {bossRule && (
            <span className="px-2 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/50 text-rose-300 text-[10px] font-bold animate-pulse flex items-center gap-1">
              <span>⚠️</span>
              <span>{bossRule.title}</span>
            </span>
          )}
        </div>

        {/* Right Badges */}
        <div className="flex items-center gap-1.5">
          {/* Aggressive Tiered Combo Badge System */}
          {combo > 1 && (
            <ComboTimerBadge combo={combo} comboTimeLeft={comboTimeLeft} />
          )}

          {/* Home / Main menu toggle */}
          {onOpenMainMenu && (
            <button
              onClick={onOpenMainMenu}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition active:scale-95 shadow-md"
              title="Ana Menüye Dön"
            >
              <Home size={14} />
            </button>
          )}

          {/* Deck inspector toggle */}
          <button
            onClick={onOpenDeckInspector}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs px-2.5 py-1 rounded-xl border border-slate-700/80 transition active:scale-95 shadow-md group"
            title="Desteyi İncele"
          >
            <Layers size={14} className="text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="font-extrabold text-cyan-300">{fullDeckCount}</span>
          </button>
        </div>
      </div>

      {/* Active Passive Jokers & Relics Bar (Balatro-style Slots) */}
      {activeRelicKeys && activeRelicKeys.length > 0 ? (
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-2 scrollbar-none bg-purple-950/40 border border-purple-800/60 rounded-2xl shadow-inner">
          <span className="text-[10px] uppercase font-black text-purple-300 tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles size={12} className="text-purple-400 animate-pulse" />
            <span>PASİF JOKERLER ({activeRelicKeys.length}/5):</span>
          </span>
          {activeRelicKeys.map(key => {
            const item = PASSIVE_JOKERS[key] || RELICS[key];
            if (!item) return null;
            return (
              <button
                key={key}
                onClick={() => onOpenRelicTooltip && onOpenRelicTooltip(key)}
                className="px-2.5 py-1 rounded-xl bg-gradient-to-b from-purple-900 via-indigo-950 to-slate-950 hover:from-purple-800 border-2 border-purple-400/70 hover:border-purple-300 text-purple-100 text-[11px] font-black shrink-0 flex items-center gap-1.5 shadow-lg transition cursor-pointer active:scale-95 group"
                title={`${item.name}: ${item.desc || item.description}`}
              >
                <JokerCardIllustration cardId={key} className="w-5 h-5 group-hover:scale-125 transition-transform shrink-0" />
                <span className="truncate max-w-[110px]">{item.name}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center gap-1.5 py-1 px-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[10px] text-slate-500 font-semibold italic">
          <Sparkles size={11} className="text-purple-400 shrink-0" />
          <span>Pasif Joker Slotu Boş (Dükkândan yeni jokerler alabilirsiniz)</span>
        </div>
      )}

      {/* Active Biome + Floor Modifier Row */}
      {(activeBiome || activeFloorModifier) && (
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
          {activeBiome && (
            <span className={`flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full border bg-slate-900/80 ${biomeAccent} border-slate-700/60`}>
              {activeBiome.icon} {activeBiome.name}
            </span>
          )}
          {activeFloorModifier && (
            <span className="flex items-center gap-1.5 text-[10px] font-black px-2 py-0.5 rounded-full border bg-yellow-950/60 text-yellow-300 border-yellow-700/50 shrink-0">
              {activeFloorModifier.icon} {activeFloorModifier.name}
            </span>
          )}
        </div>
      )}

      {/* Enhanced Target Score Progress Bar Section with Thick Neon Arcade Gauge */}
      <div className="w-full bg-slate-950/90 border-2 border-emerald-500/50 rounded-3xl p-3 space-y-2 shadow-[0_0_35px_rgba(16,185,129,0.25)] relative overflow-hidden">
        <div className="flex items-center justify-between text-xs font-black">
          <div className="flex items-center gap-2">
            <TargetScoreGauge progressPercent={progressPercent} />
            <span className="text-emerald-300 font-extrabold uppercase tracking-widest text-xs flex items-center gap-1">
              <span>🎯 HEDEF PUAN:</span>
              <span className="text-amber-300 font-mono font-black text-sm">%{progressPercent}</span>
            </span>
          </div>

          <div className="flex items-baseline gap-1.5 bg-slate-900/90 border border-emerald-500/40 px-3 py-1 rounded-2xl shadow">
            <span className="text-lg font-black text-emerald-300 font-mono tracking-wider">{currentScore}</span>
            <span className="text-slate-400 text-xs font-extrabold">/ {safeTargetScore}</span>
          </div>
        </div>

        {/* Dynamic Glowing Progress Fill Bar with Percentage Shimmer */}
        <div className="w-full h-5 sm:h-6 bg-slate-900 rounded-full overflow-hidden p-0.5 border-2 border-slate-800 relative shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-700 shadow-[0_0_25px_rgba(16,185,129,0.9)] relative overflow-hidden flex items-center justify-end pr-2"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.45)_50%,transparent_100%)] animate-shimmer" />
            {progressPercent >= 15 && (
              <span className="text-[10px] font-black text-slate-950 font-mono relative z-10">
                %{progressPercent}
              </span>
            )}
          </div>
        </div>

        {/* Remaining Hands (Plays) & Refresh Action Row */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-300 pt-0.5">
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-extrabold uppercase text-[11px] tracking-wider">🎯 Hamle Hakkı:</span>
            <span className="px-3 py-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 rounded-xl font-black text-xs shadow-md border border-yellow-200 min-w-[32px] flex items-center justify-center">
              {showMinusOne ? (
                <span className="text-rose-950 animate-pulse font-mono font-black">-1</span>
              ) : (
                handsLeft
              )}
            </span>
          </div>
        </div>
      </div>
    </header>

  );
}

import React from 'react';
import { Layers, Flame, RotateCcw, Star, Heart, Coins, Home, Target, Sparkles } from 'lucide-react';
import { getBossStageRule } from '../hooks/useGameState';
import { RELICS } from '../game/relicData';

export function HeaderBar({
  stage,
  currentScore,
  targetScore,
  handsLeft,
  discardsLeft,
  combo,
  gold = 20,
  lives = 3,
  activeRelicKeys = [],
  starPoints,
  fullDeckCount,
  onOpenDeckInspector,
  onDiscardHand,
  onOpenMainMenu,
  onOpenRelicTooltip,
  activeBiome,
  activeFloorModifier
}) {
  const progressPercent = Math.min(100, Math.floor((currentScore / targetScore) * 100));
  const bossRule = getBossStageRule(stage);

  // Biome-driven accent glow
  const biomeGlowColor = activeBiome?.glowColor || 'rgba(245, 158, 11, 0.5)';
  const biomeAccent = activeBiome?.accentColor || 'text-amber-400';


  return (
    <header className="w-full bg-slate-950/85 border-b border-slate-800/80 p-2.5 sm:p-3 flex flex-col gap-2 z-10 shadow-2xl backdrop-blur-xl relative">
      {/* Top Ambient Glow Line - biome driven */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] transition-all duration-1000"
        style={{ background: `linear-gradient(90deg, transparent, ${biomeGlowColor}, transparent)` }}
      />

      {/* Top Stat Badges Row */}
      <div className="flex items-center justify-between gap-1 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Stage badge */}
          <div className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-600/10 border border-amber-500/40 text-amber-300 text-xs font-black tracking-wider flex items-center gap-1 shadow-md shadow-amber-950/30">
            <Sparkles size={12} className="text-amber-400" />
            <span>KADEME {stage}</span>
          </div>

          {/* Hearts / Lives */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900/90 border border-rose-900/50 text-rose-400 text-xs font-bold shadow-inner">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                size={13}
                className={i < lives ? 'fill-rose-500 text-rose-500 drop-shadow-[0_0_6px_rgba(244,63,94,0.6)]' : 'text-slate-700'}
              />
            ))}
          </div>

          {/* Gold */}
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

        <div className="flex items-center gap-1.5">
          {/* Combo badge */}
          {combo > 1 && (
            <div className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-slate-950 font-black text-[11px] flex items-center gap-1 shadow-lg shadow-orange-500/30 animate-bounce">
              <Flame size={13} className="fill-slate-950" />
              <span>COMBO ×{combo}</span>
            </div>
          )}

          {/* Stars */}
          <div className="flex items-center gap-1 text-xs font-extrabold text-amber-300 bg-slate-900/90 border border-amber-500/30 px-2.5 py-1 rounded-xl shadow-inner">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span>{starPoints}</span>
          </div>

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

      {/* Active Relics Badges (if any) */}
      {activeRelicKeys.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
          <span className="text-[10px] uppercase font-black text-purple-400 tracking-wider shrink-0 flex items-center gap-1">
            <span>✨</span> Emanetler:
          </span>
          {activeRelicKeys.map(key => {
            const relic = RELICS[key];
            if (!relic) return null;
            return (
              <button
                key={key}
                onClick={() => onOpenRelicTooltip && onOpenRelicTooltip(key)}
                className="px-2 py-0.5 rounded-lg bg-purple-950/90 hover:bg-purple-900 border border-purple-500/50 hover:border-purple-400 text-purple-200 text-[10px] font-bold shrink-0 flex items-center gap-1 shadow-sm transition cursor-pointer active:scale-95"
                title={`${relic.name} detaylarını gör`}
              >
                <span>{relic.icon}</span>
                <span>{relic.name}</span>
              </button>
            );
          })}
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

      {/* Target Score Progress Bar Section */}
      <div className="w-full bg-slate-900/90 border border-slate-800/90 rounded-2xl p-2.5 space-y-1.5 shadow-xl">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-400 uppercase tracking-wider flex items-center gap-1 text-[10px]">
            <Target size={12} className="text-emerald-400" />
            Hedef Puan:
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-black text-emerald-400">{currentScore}</span>
            <span className="text-slate-500 text-[11px]">/ {targetScore}</span>
            <span className="text-[10px] text-emerald-400/80 ml-1 font-mono">({progressPercent}%)</span>
          </div>
        </div>

        {/* Progress Fill Track */}
        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800/80 relative">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-400 transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] relative overflow-hidden"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-shimmer" />
          </div>
        </div>

        {/* Remaining Hands & Redraw Action Row */}
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 pt-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Kalan Tur:</span>
            <span className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded-md font-black text-amber-400">
              {handsLeft}
            </span>
          </div>

          <button
            onClick={onDiscardHand}
            disabled={discardsLeft <= 0}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition active:scale-95 shadow ${
              discardsLeft > 0
                ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
                : 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <RotateCcw size={12} className={discardsLeft > 0 ? 'text-amber-400' : 'text-slate-600'} />
            <span>Kart Değiştir ({discardsLeft})</span>
          </button>
        </div>
      </div>
    </header>
  );
}

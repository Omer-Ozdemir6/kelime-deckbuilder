import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Flame, RotateCcw, Star, Coins, Home, Target, Sparkles } from 'lucide-react';
import { getBossStageRule } from '../hooks/useGameState';
import { RELICS } from '../game/relicData';
import { PASSIVE_JOKERS } from '../game/cardData';

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
            <div className="shrink-0">
              {combo <= 3 ? (
                /* Tier 1: Ember Flame (Combo x2 - x3) */
                <div className="px-3 py-1 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.6)] border-2 border-amber-300 animate-pulse">
                  <Flame size={14} className="fill-slate-950 text-slate-950" />
                                    <span>KOMBO ×{combo}</span>
                  <span className={`ml-1 font-mono text-[10px] px-1.5 py-0.5 rounded-full border ${comboTimeLeft <= 3 ? 'bg-rose-950 text-rose-300 border-rose-500 animate-ping' : 'bg-slate-900/80 text-slate-900 border-slate-700'}`}>
                    ⏱️ {comboTimeLeft}s
                  </span>
                </div>
              ) : combo <= 5 ? (
                /* Tier 2: Aggressive Red/Orange Fire (Combo x4 - x5) */
                <div className="px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-[0_0_25px_rgba(249,115,22,0.9)] border-2 border-yellow-300 ring-2 ring-orange-400/80 animate-bounce">
                  <Flame size={16} className="fill-slate-950 text-amber-200 animate-pulse" />
                  <span className="tracking-wide uppercase font-extrabold">🔥 ATEŞ FIRTINASI ×{combo}</span> <span className={`ml-1 font-mono text-[11px] px-2 py-0.5 rounded-full border shadow ${comboTimeLeft <= 3 ? 'bg-rose-600 text-white border-rose-400 animate-bounce font-black' : 'bg-slate-950/80 text-amber-300 border-amber-500/60 font-bold'}`}>
                    ⏱️ {comboTimeLeft}s
                  </span>
                </div>
              ) : combo <= 7 ? (
                /* Tier 3: Volcanic Crimson Inferno (Combo x6 - x7) */
                <div className="px-4 py-1.5 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-orange-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_35px_rgba(244,63,94,0.95)] border-2 border-amber-300 ring-4 ring-rose-500/70 animate-bounce">
                  <Flame size={18} className="fill-amber-300 text-amber-300 animate-pulse" />
                  <span className="tracking-widest uppercase font-black">🌋 VOLKANİK ÖFKE ×{combo}</span> <span className={`ml-1 font-mono text-[11px] px-2 py-0.5 rounded-full border shadow ${comboTimeLeft <= 3 ? 'bg-rose-600 text-white border-rose-400 animate-bounce font-black' : 'bg-slate-950/80 text-amber-300 border-amber-500/60 font-bold'}`}>
                    ⏱️ {comboTimeLeft}s
                  </span>
                </div>
              ) : (
                /* Tier 4: Cosmic Supernova Blue Fire (Combo x8+) */
                <div className="px-4 py-1.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-indigo-600 to-purple-700 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_40px_rgba(34,211,238,0.95)] border-2 border-cyan-200 ring-4 ring-cyan-400/80 animate-pulse">
                  <Sparkles size={18} className="fill-cyan-200 text-cyan-200 animate-spin" />
                  <span className="tracking-widest uppercase font-black text-cyan-200">🌌 SUPERNOVA ×{combo}</span> <span className={`ml-1 font-mono text-[11px] px-2 py-0.5 rounded-full border shadow ${comboTimeLeft <= 3 ? 'bg-rose-600 text-white border-rose-400 animate-bounce font-black' : 'bg-slate-950/80 text-amber-300 border-amber-500/60 font-bold'}`}>
                    ⏱️ {comboTimeLeft}s
                  </span>
                </div>
              )}
            </div>
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
                <span className="text-sm group-hover:scale-125 transition-transform">{item.icon}</span>
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

      {/* Enhanced Target Score Progress Bar Section */}
      <div className="w-full bg-slate-900/90 border border-slate-800/90 rounded-2xl p-2.5 space-y-2 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-300 font-extrabold uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
            <Target size={14} className="text-emerald-400 animate-pulse" />
            HEDEF PUAN:
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-emerald-300 tracking-wider font-mono">{currentScore}</span>
            <span className="text-slate-400 text-xs font-bold">/ {safeTargetScore}</span>
            <span className="text-[10px] font-black text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-500/40 ml-1">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Dynamic Glowing Progress Fill Bar */}
        <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800/90 relative shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-500 shadow-[0_0_15px_rgba(16,185,129,0.7)] relative overflow-hidden"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.35)_50%,transparent_100%)] animate-shimmer" />
          </div>
        </div>

        {/* Remaining Hands (Plays) & Refresh Action Row */}
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 pt-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">🎯 Hamle Hakkı:</span>
            <span className="px-2.5 py-0.5 bg-amber-950/80 border border-amber-500/50 rounded-md font-black text-amber-300 text-xs shadow-md min-w-[28px] flex items-center justify-center">
              {showMinusOne ? (
                <span className="text-rose-400 animate-pulse font-mono font-black">-1</span>
              ) : (
                handsLeft
              )}
            </span>
          </div>

          <button
            onClick={onDiscardHand}
            disabled={discardsLeft <= 0}
            className={`px-3 py-1 rounded-xl text-[11px] font-black flex items-center gap-1.5 transition active:scale-95 shadow ${
              discardsLeft > 0
                ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 cursor-pointer'
                : 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed'
            }`}
            title="Eli Yenile: Eldeki harfleri desteye karıştırır ve 7 yeni harf çeker"
          >
            <RotateCcw size={12} className={discardsLeft > 0 ? 'text-amber-400' : 'text-slate-600'} />
            <span>🔄 YENİLE ({discardsLeft})</span>
          </button>
        </div>
      </div>
    </header>
  );
}

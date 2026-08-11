import React from 'react';
import { Layers, Flame, RotateCcw, Star, Heart, Coins, Home } from 'lucide-react';
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
  onOpenMainMenu
}) {
  const progressPercent = Math.min(100, Math.floor((currentScore / targetScore) * 100));
  const bossRule = getBossStageRule(stage);

  return (
    <header className="w-full bg-slate-950/90 border-b border-slate-800/80 p-3 flex flex-col gap-2 z-10 shadow-lg backdrop-blur-md">
      {/* Top row: Stage, Hearts, Gold, Combo, Deck & Stars */}
      <div className="flex items-center justify-between gap-1 flex-wrap">
        <div className="flex items-center gap-2">
          {/* Stage badge */}
          <div className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold tracking-wider flex items-center gap-1 shadow-sm">
            <span>KADEME {stage}</span>
          </div>

          {/* Hearts / Lives */}
          <div className="flex items-center gap-0.5 px-2 py-1 rounded-lg bg-rose-950/50 border border-rose-800/60 text-rose-400 text-xs font-bold">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                size={13}
                className={i < lives ? 'fill-rose-500 text-rose-500' : 'text-slate-700'}
              />
            ))}
          </div>

          {/* Gold */}
          <div className="flex items-center gap-1 text-xs font-bold text-yellow-400 bg-yellow-950/50 border border-yellow-800/50 px-2 py-1 rounded-lg">
            <Coins size={13} className="text-yellow-400 fill-yellow-400" />
            <span>{gold}</span>
          </div>

          {bossRule && (
            <span className="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-semibold animate-pulse">
              ⚠️ {bossRule.title}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Combo badge */}
          {combo > 1 && (
            <div className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-red-500 text-white font-extrabold text-xs flex items-center gap-1 shadow-md animate-bounce">
              <Flame size={13} className="text-yellow-200 fill-yellow-200" />
              <span>COMBO x{combo}</span>
            </div>
          )}

          {/* Stars */}
          <div className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-950/40 border border-amber-800/50 px-2 py-1 rounded-lg">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span>{starPoints}</span>
          </div>

          {/* Home / Main menu toggle */}
          {onOpenMainMenu && (
            <button
              onClick={onOpenMainMenu}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition active:scale-95"
              title="Ana Menüye Dön"
            >
              <Home size={14} />
            </button>
          )}

          {/* Deck inspector toggle */}
          <button
            onClick={onOpenDeckInspector}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded-lg border border-slate-700 transition active:scale-95"
            title="Desteyi İncele"
          >
            <Layers size={14} className="text-blue-400" />
            <span className="font-semibold">{fullDeckCount}</span>
          </button>
        </div>
      </div>

      {/* Active Relics Badges (if any) */}
      {activeRelicKeys.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Emanetler:</span>
          {activeRelicKeys.map(key => {
            const rel = RELICS[key];
            if (!rel) return null;
            return (
              <span
                key={key}
                title={rel.desc}
                className="px-2 py-0.5 rounded-md bg-purple-950/70 border border-purple-800 text-purple-200 text-[11px] font-semibold flex items-center gap-1 shrink-0"
              >
                <span>{rel.icon}</span>
                <span>{rel.name}</span>
              </span>
            );
          })}
        </div>
      )}

      {/* Target Progress Bar */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-baseline text-xs font-semibold px-0.5">
          <span className="text-slate-400">HEDEF PUAN</span>
          <div className="flex items-baseline gap-1">
            <span className="text-emerald-400 text-sm font-extrabold">{currentScore}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-200 font-bold">{targetScore}</span>
          </div>
        </div>

        <div className="w-full h-3 bg-slate-900 rounded-full border border-slate-800 overflow-hidden relative p-0.5">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Bottom info bar: Turns Left & Discards */}
      <div className="flex items-center justify-between text-xs text-slate-300 pt-0.5 px-0.5">
        <div className="flex items-center gap-1.5 font-medium">
          <span>Kalan Tur:</span>
          <span className={`font-bold px-1.5 py-0.2 rounded ${handsLeft <= 2 ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-slate-800 text-slate-200'}`}>
            {handsLeft}
          </span>
        </div>

        <button
          onClick={onDiscardHand}
          disabled={discardsLeft <= 0}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition ${
            discardsLeft > 0
              ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-300 active:scale-95'
              : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
          }`}
        >
          <RotateCcw size={12} />
          <span>Kart Değiştir ({discardsLeft})</span>
        </button>
      </div>
    </header>
  );
}

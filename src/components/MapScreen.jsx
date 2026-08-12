import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Coins, Star, Home, FastForward, Play, Lock, CheckCircle2, ShieldAlert, Award, Tag, HelpCircle, Lightbulb, Key } from 'lucide-react';
import { generateKademe } from '../game/mapGenerator';
import { soundEngine } from '../game/audioEngine';

export function MapScreen({
  currentKademe = 1,
  kademeData: inputKademeData,
  currentBlindIndex = 0,
  gold = 0,
  starPoints = 0,
  activeTags = [],
  onSelectNode,
  onPlayBlind,
  onSkipBlind,
  onOpenMainMenu
}) {
  const kademeData = inputKademeData || generateKademe(currentKademe);
  const blinds = kademeData.blinds || [];
  const activeCardRef = useRef(null);

  useEffect(() => {
    if (activeCardRef.current) {
      activeCardRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [currentBlindIndex]);

  const handlePlayClick = (index) => {
    soundEngine.playTap();
    if (onPlayBlind) {
      onPlayBlind(index);
    } else if (onSelectNode) {
      onSelectNode(index);
    }
  };

  const handleSkipClick = (index) => {
    soundEngine.playTap();
    if (onSkipBlind) {
      onSkipBlind(index);
    }
  };

  const getBlindCategoryLabel = (type) => {
    switch (type) {
      case 'SMALL_BLIND': return 'Normal Sınav';
      case 'BIG_BLIND': return 'Yüksek Sınav';
      case 'BOSS_BLIND': return 'Özel Boss Kuralı';
      case 'EVENT': return '🎭 Gizemli Durak';
      case 'TRIVIA': return '🧩 Kelime Bilmecesi';
      case 'TREASURE': return '💎 Kilitli Hazine';
      default: return 'Özel Durak';
    }
  };

  const getPlayButtonText = (type) => {
    switch (type) {
      case 'BOSS_BLIND': return '👑 BOSS SINAVINA BAŞLA';
      case 'EVENT': return '❓ OLAYI İNCELE';
      case 'TRIVIA': return '💡 BİLMECENİ ÇÖZ';
      case 'TREASURE': return '💰 SANDIĞI AÇ';
      default: return 'SINAVI OYNA';
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-3 sm:p-4 bg-gradient-to-b from-slate-950 via-[#0a0f1d] to-slate-950 text-slate-100 overflow-y-auto select-none relative">
      {/* Ambient Top Glow */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />

      {/* 1. TOP HEADER BAR */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 shrink-0 z-10 bg-slate-950/90 backdrop-blur-md px-2 py-1 rounded-2xl">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-md">
            <Sparkles size={18} />
          </div>
          <div>
            <h2 className="text-base font-black text-amber-300 tracking-wide font-cinzel flex items-center gap-1">
              KADEME {currentKademe}
            </h2>
            <p className="text-[10px] text-slate-400 font-medium">
              Sınavları Tamamla Veya Atla!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 bg-amber-950/80 border border-amber-500/40 px-2 py-1 rounded-xl text-xs font-black text-amber-300 shadow-sm">
            <Coins size={12} className="text-amber-400 fill-amber-400" />
            <span>{gold}</span>
          </div>
          {onOpenMainMenu && (
            <button
              onClick={onOpenMainMenu}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition active:scale-95 shadow-sm cursor-pointer"
              title="Ana Menüye Dön"
            >
              <Home size={15} />
            </button>
          )}
        </div>
      </div>

      {/* 2. ANTE RUN TRACK BAR (BALATRO PROGRESS STEPPER) */}
      <div className="my-2.5 px-3 py-2 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-inner flex items-center justify-between gap-1 z-10 shrink-0 overflow-x-auto scrollbar-none">
        {blinds.map((blind, idx) => {
          const isCurrent = idx === currentBlindIndex && blind.status !== 'COMPLETED' && blind.status !== 'SKIPPED';
          const isDone = blind.status === 'COMPLETED';
          const isSkipped = blind.status === 'SKIPPED';

          return (
            <React.Fragment key={blind.id}>
              {idx > 0 && (
                <div className={`h-0.5 flex-1 min-w-[8px] transition-colors duration-500 ${isDone || isSkipped ? 'bg-amber-400' : 'bg-slate-800'}`} />
              )}
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap ${
                  isCurrent
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)] animate-pulse'
                    : isDone
                    ? 'bg-emerald-950 border-emerald-500/60 text-emerald-300'
                    : isSkipped
                    ? 'bg-purple-950 border-purple-500/60 text-purple-300'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <span>{isDone ? '✓' : isSkipped ? '⏩' : isCurrent ? '◉' : '🔒'}</span>
                <span>{blind.title}</span>
              </div>
            </React.Fragment>
          );
        })}
        <div className="h-0.5 w-2 bg-slate-800" />
        <div className="px-2 py-1 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-300 text-[10px] font-bold flex items-center gap-1 shrink-0">
          <span>🏪</span>
          <span>Dükkân</span>
        </div>
      </div>

      {/* 3. BLIND CARDS CAROUSEL CONTAINER (RESPONSIVE SNAP-SCROLLING 9:16 CARDS) */}
      <div className="flex-1 flex items-center overflow-x-auto snap-x snap-mandatory gap-3 py-2 px-1 scrollbar-none z-10 min-h-[380px]">
        {blinds.map((blind, idx) => {
          const isCurrent = idx === currentBlindIndex && blind.status !== 'COMPLETED' && blind.status !== 'SKIPPED';
          const isDone = blind.status === 'COMPLETED';
          const isSkipped = blind.status === 'SKIPPED';
          const isLocked = !isCurrent && !isDone && !isSkipped;
          const isBoss = blind.type === 'BOSS_BLIND';
          const isSideEncounter = blind.type === 'EVENT' || blind.type === 'TRIVIA' || blind.type === 'TREASURE';

          return (
            <motion.div
              key={blind.id}
              ref={isCurrent ? activeCardRef : null}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.08 }}
              className={`w-[260px] sm:w-[280px] h-full snap-center shrink-0 rounded-3xl p-4 flex flex-col justify-between border transition-all duration-300 relative overflow-hidden shadow-2xl ${
                isCurrent
                  ? isBoss
                    ? 'bg-gradient-to-b from-rose-950/95 via-slate-900 to-slate-950 border-rose-500/90 ring-2 ring-rose-500/50 shadow-rose-950/60'
                    : isSideEncounter
                    ? 'bg-gradient-to-b from-purple-950/95 via-slate-900 to-slate-950 border-purple-500/90 ring-2 ring-purple-500/50 shadow-purple-950/60'
                    : 'bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 border-amber-500/90 ring-2 ring-amber-500/50 shadow-amber-950/60'
                  : isDone
                  ? 'bg-slate-900/60 border-emerald-900/60 opacity-85'
                  : isSkipped
                  ? 'bg-slate-900/60 border-purple-900/60 opacity-85'
                  : 'bg-slate-950/80 border-slate-900 opacity-60'
              }`}
            >
              {/* Card Header Section */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shadow-md border ${
                      isBoss ? 'bg-rose-950 border-rose-500/60' : isSideEncounter ? 'bg-purple-950 border-purple-500/60' : 'bg-amber-950/80 border-amber-500/60'
                    }`}>
                      {blind.icon}
                    </div>
                    <div>
                      <h3 className={`text-base font-black tracking-wide leading-tight ${
                        isBoss ? 'text-rose-300' : isSideEncounter ? 'text-purple-300' : 'text-amber-300'
                      }`}>
                        {blind.title}
                      </h3>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        {getBlindCategoryLabel(blind.type)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-1.5 mt-1">
                  {isDone && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/60 text-emerald-400 text-[10px] font-black flex items-center gap-1">
                      <CheckCircle2 size={11} /> Tamamlandı
                    </span>
                  )}
                  {isSkipped && (
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-500/60 text-purple-300 text-[10px] font-black flex items-center gap-1">
                      <FastForward size={11} /> Atlandı
                    </span>
                  )}
                  {isLocked && (
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-500 text-[10px] font-bold flex items-center gap-1">
                      <Lock size={11} /> Kilitli
                    </span>
                  )}
                  {isCurrent && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/80 text-amber-300 text-[10px] font-black animate-pulse">
                      ◉ Aktif Aşama
                    </span>
                  )}
                </div>

                {/* Target Score Banner or Description Box */}
                {!isSideEncounter ? (
                  <div className={`p-3 rounded-2xl my-1.5 border flex items-center justify-between shadow-inner ${
                    isBoss ? 'bg-rose-950/60 border-rose-800/80' : 'bg-slate-950/90 border-slate-800'
                  }`}>
                    <span className="text-xs text-slate-400 font-medium">Hedef Puan:</span>
                    <span className={`text-lg font-black tracking-wider ${isBoss ? 'text-rose-400' : 'text-amber-400'}`}>
                      🎯 {blind.targetScore}
                    </span>
                  </div>
                ) : (
                  <div className="p-3 rounded-2xl my-1.5 border bg-slate-950/90 border-purple-900/60 text-slate-300 text-xs shadow-inner">
                    <p className="text-[11px] leading-relaxed">{blind.desc}</p>
                  </div>
                )}

                {/* Boss Rule Modifier Box */}
                {isBoss && blind.bossRule && (
                  <div className="p-2.5 rounded-2xl bg-rose-950/50 border border-rose-700/60 text-rose-200 text-xs font-semibold flex flex-col gap-1 shadow-inner">
                    <div className="flex items-center gap-1.5 text-rose-300 font-black">
                      <ShieldAlert size={14} className="text-rose-400" />
                      <span>{blind.bossRule.title}</span>
                    </div>
                    <p className="text-[11px] text-rose-200/90 leading-normal">
                      {blind.bossRule.desc}
                    </p>
                  </div>
                )}

                {/* Standard Play Reward Info */}
                {!isSideEncounter && (
                  <div className="text-xs text-slate-300 flex items-center gap-1.5 font-bold">
                    <Coins size={14} className="text-amber-400 fill-amber-400" />
                    <span>Ödül: <strong className="text-amber-300">+{blind.rewardGold} Altın</strong></span>
                  </div>
                )}

                {/* Skip Tag Preview Box */}
                {blind.canSkip && blind.tag && !isDone && !isSkipped && (
                  <div className="mt-2 p-2.5 rounded-2xl bg-slate-950/90 border border-purple-500/50 flex flex-col gap-1 shadow-md">
                    <div className="flex items-center justify-between text-xs font-black text-purple-300">
                      <span className="flex items-center gap-1">
                        <Tag size={12} className="text-purple-400" />
                        <span>ATLA & ETİKET AL:</span>
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-lg bg-purple-900/80 border border-purple-500/60 text-purple-200 font-black">
                        {blind.tag.icon} {blind.tag.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      {blind.tag.desc}
                    </p>
                  </div>
                )}
              </div>

              {/* Card Action Buttons Section */}
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-col gap-2 shrink-0">
                {isCurrent && (
                  <>
                    <button
                      onClick={() => handlePlayClick(idx)}
                      className={`w-full py-3 px-3 rounded-2xl font-black text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 transition active:scale-95 shadow-xl cursor-pointer ${
                        isBoss
                          ? 'bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-rose-950/50'
                          : isSideEncounter
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-950/50'
                          : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 shadow-amber-950/50 border border-amber-300'
                      }`}
                    >
                      <Play size={16} className="fill-current" />
                      <span>{getPlayButtonText(blind.type)}</span>
                    </button>

                    {blind.canSkip && (
                      <button
                        onClick={() => handleSkipClick(idx)}
                        className="w-full py-2 px-3 rounded-2xl bg-purple-950/90 hover:bg-purple-900 border border-purple-500/70 text-purple-200 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md cursor-pointer"
                      >
                        <FastForward size={14} />
                        <span>ATLA ({blind.tag?.name})</span>
                      </button>
                    )}
                  </>
                )}

                {isDone && (
                  <div className="text-center text-xs font-black text-emerald-400 py-1.5 bg-emerald-950/50 rounded-xl border border-emerald-900/60">
                    ✓ Aşama Başarıyla Tamamlandı
                  </div>
                )}

                {isSkipped && (
                  <div className="text-center text-xs font-black text-purple-300 py-1.5 bg-purple-950/50 rounded-xl border border-purple-900/60">
                    ⏩ Atlandı (Etiket Ödülü Alındı)
                  </div>
                )}

                {isLocked && (
                  <div className="text-center text-xs font-medium text-slate-500 py-2 flex items-center justify-center gap-1 bg-slate-950/60 rounded-xl border border-slate-900">
                    <Lock size={12} /> Önceki Aşamayı Tamamla
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 4. ACTIVE TAGS TRAY */}
      {activeTags.length > 0 && (
        <div className="mt-2.5 p-2.5 rounded-2xl bg-slate-900/90 border border-purple-900/50 flex items-center gap-2 overflow-x-auto shrink-0 z-10">
          <div className="flex items-center gap-1 text-xs font-black text-purple-300 shrink-0">
            <Award size={14} className="text-purple-400" />
            <span>ETİKETLER:</span>
          </div>
          <div className="flex items-center gap-1.5">
            {activeTags.map((tag, i) => (
              <div
                key={i}
                className="px-2.5 py-1 rounded-xl bg-purple-950 border border-purple-500/50 text-purple-200 text-xs font-bold flex items-center gap-1 shadow-sm whitespace-nowrap"
                title={tag.desc}
              >
                <span>{tag.icon}</span>
                <span>{tag.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

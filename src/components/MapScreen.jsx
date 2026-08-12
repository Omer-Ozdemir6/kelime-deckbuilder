import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Coins, Star, Home, FastForward, Play, Lock, CheckCircle2, ShieldAlert, Award, Tag, HelpCircle, Lightbulb, Key, Swords, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { generateKademe } from '../game/mapGenerator';
import { soundEngine } from '../game/audioEngine';

// ─────────────────────────────────────────────────────────────
// KADEME TEMALAR — Her kademe farklı bir görsel konsept
// ─────────────────────────────────────────────────────────────
const KADEME_THEMES = {
  1: {
    name: 'Orman Diyarı',
    emoji: '🌿',
    bg: 'from-emerald-950 via-green-950 to-slate-950',
    headerBg: 'bg-emerald-950/90',
    headerBorder: 'border-emerald-800/80',
    titleColor: 'text-emerald-300',
    accentColor: 'text-emerald-400',
    primaryBtn: 'from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 hover:to-green-400 border-emerald-300',
    glowTop: 'from-emerald-500/15 to-transparent',
    cardActive: 'from-emerald-950/95 via-slate-900 to-slate-950 border-emerald-500/90 ring-emerald-500/50',
    bossCardActive: 'from-rose-950/95 via-slate-900 to-slate-950 border-rose-500/90 ring-rose-500/50',
    progressBar: 'from-emerald-400 to-green-400',
    progressBg: 'bg-emerald-950/90 border-emerald-900/90',
    goldBg: 'bg-emerald-950/80 border-emerald-500/40',
    goldColor: 'text-emerald-300',
    ambientGlow: 'rgba(52, 211, 153, 0.08)',
    particles: ['🌿', '🍃', '🌱', '🍀'],
  },
  2: {
    name: 'Çöl Sıcağı',
    emoji: '🏜️',
    bg: 'from-amber-950 via-orange-950 to-slate-950',
    headerBg: 'bg-amber-950/90',
    headerBorder: 'border-amber-800/80',
    titleColor: 'text-amber-300',
    accentColor: 'text-amber-400',
    primaryBtn: 'from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 border-amber-300',
    glowTop: 'from-amber-500/15 to-transparent',
    cardActive: 'from-amber-950/40 via-slate-900 to-slate-950 border-amber-500/90 ring-amber-500/50',
    bossCardActive: 'from-rose-950/95 via-slate-900 to-slate-950 border-rose-500/90 ring-rose-500/50',
    progressBar: 'from-amber-400 to-yellow-400',
    progressBg: 'bg-amber-950/90 border-amber-900/90',
    goldBg: 'bg-amber-950/80 border-amber-500/40',
    goldColor: 'text-amber-300',
    ambientGlow: 'rgba(245, 158, 11, 0.08)',
    particles: ['🏜️', '🌵', '☀️', '🦂'],
  },
  3: {
    name: 'Deniz Derinlikleri',
    emoji: '🌊',
    bg: 'from-cyan-950 via-blue-950 to-slate-950',
    headerBg: 'bg-cyan-950/90',
    headerBorder: 'border-cyan-800/80',
    titleColor: 'text-cyan-300',
    accentColor: 'text-cyan-400',
    primaryBtn: 'from-cyan-500 via-blue-500 to-cyan-600 hover:from-cyan-400 hover:to-blue-400 border-cyan-300',
    glowTop: 'from-cyan-500/15 to-transparent',
    cardActive: 'from-cyan-950/40 via-slate-900 to-slate-950 border-cyan-500/90 ring-cyan-500/50',
    bossCardActive: 'from-rose-950/95 via-slate-900 to-slate-950 border-rose-500/90 ring-rose-500/50',
    progressBar: 'from-cyan-400 to-blue-400',
    progressBg: 'bg-cyan-950/90 border-cyan-900/90',
    goldBg: 'bg-cyan-950/80 border-cyan-500/40',
    goldColor: 'text-cyan-300',
    ambientGlow: 'rgba(6, 182, 212, 0.08)',
    particles: ['🌊', '🐠', '🐙', '🪼'],
  },
  4: {
    name: 'Volkan Alanı',
    emoji: '🌋',
    bg: 'from-red-950 via-rose-950 to-slate-950',
    headerBg: 'bg-red-950/90',
    headerBorder: 'border-red-800/80',
    titleColor: 'text-red-300',
    accentColor: 'text-red-400',
    primaryBtn: 'from-red-500 via-rose-500 to-red-600 hover:from-red-400 hover:to-rose-400 border-red-300',
    glowTop: 'from-red-500/15 to-transparent',
    cardActive: 'from-red-950/40 via-slate-900 to-slate-950 border-red-500/90 ring-red-500/50',
    bossCardActive: 'from-orange-950/95 via-slate-900 to-slate-950 border-orange-500/90 ring-orange-500/50',
    progressBar: 'from-red-400 to-rose-400',
    progressBg: 'bg-red-950/90 border-red-900/90',
    goldBg: 'bg-red-950/80 border-red-500/40',
    goldColor: 'text-red-300',
    ambientGlow: 'rgba(239, 68, 68, 0.08)',
    particles: ['🌋', '🔥', '💥', '🫁'],
  },
  5: {
    name: 'Gece Gökyüzü',
    emoji: '🌌',
    bg: 'from-indigo-950 via-purple-950 to-slate-950',
    headerBg: 'bg-indigo-950/90',
    headerBorder: 'border-indigo-800/80',
    titleColor: 'text-indigo-300',
    accentColor: 'text-indigo-400',
    primaryBtn: 'from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-400 hover:to-purple-400 border-indigo-300',
    glowTop: 'from-indigo-500/15 to-transparent',
    cardActive: 'from-indigo-950/40 via-slate-900 to-slate-950 border-indigo-500/90 ring-indigo-500/50',
    bossCardActive: 'from-rose-950/95 via-slate-900 to-slate-950 border-rose-500/90 ring-rose-500/50',
    progressBar: 'from-indigo-400 to-purple-400',
    progressBg: 'bg-indigo-950/90 border-indigo-900/90',
    goldBg: 'bg-indigo-950/80 border-indigo-500/40',
    goldColor: 'text-indigo-300',
    ambientGlow: 'rgba(99, 102, 241, 0.08)',
    particles: ['🌌', '⭐', '🌙', '✨'],
  },
};

// 6+ kademe için Efsanevi tema
const LEGENDARY_THEME = {
  name: 'Efsanevi Bölge',
  emoji: '✨',
  bg: 'from-yellow-950 via-amber-950 to-slate-950',
  headerBg: 'bg-yellow-950/90',
  headerBorder: 'border-yellow-700/80',
  titleColor: 'text-yellow-300',
  accentColor: 'text-yellow-400',
  primaryBtn: 'from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-300 border-yellow-200',
  glowTop: 'from-yellow-500/20 to-transparent',
  cardActive: 'from-yellow-950/40 via-slate-900 to-slate-950 border-yellow-500/90 ring-yellow-500/50',
  bossCardActive: 'from-rose-950/95 via-slate-900 to-slate-950 border-rose-500/90 ring-rose-500/50',
  progressBar: 'from-yellow-400 to-amber-400',
  progressBg: 'bg-yellow-950/90 border-yellow-900/90',
  goldBg: 'bg-yellow-950/80 border-yellow-500/40',
  goldColor: 'text-yellow-300',
  ambientGlow: 'rgba(234, 179, 8, 0.10)',
  particles: ['✨', '💎', '🏆', '👑'],
};

function getKademeTheme(kademe) {
  return KADEME_THEMES[kademe] || LEGENDARY_THEME;
}

export function MapScreen({
  currentKademe = 1,
  kademeData: inputKademeData,
  currentBlindIndex = 0,
  gold = 0,
  activeTags = [],
  onSelectNode,
  onPlayBlind,
  onSkipBlind,
  onOpenMainMenu
}) {
  const kademeData = inputKademeData || generateKademe(currentKademe);
  const blinds = kademeData.blinds || [];
  const activeCardRef = useRef(null);
  const carouselRef = useRef(null);
  const theme = getKademeTheme(currentKademe);

  useEffect(() => {
    if (activeCardRef.current) {
      activeCardRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [currentBlindIndex]);

  const scrollCarousel = (dir) => {
    soundEngine.playTap();
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: dir * 292, behavior: 'smooth' });
    }
  };

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
      case 'SMALL_BLIND': return 'Normal Mücadele';
      case 'BIG_BLIND': return 'Yüksek Mücadele';
      case 'BOSS_BLIND': return 'Özel Boss Kuralı';
      case 'EVENT': return '🎭 Gizemli Durak';
      case 'TRIVIA': return '🧩 Kelime Bilmecesi';
      case 'TREASURE': return '💎 Kilitli Hazine';
      default: return 'Özel Durak';
    }
  };

  const getPlayButtonText = (type) => {
    switch (type) {
      case 'BOSS_BLIND': return '👑 BOSS MÜCADELESİNE BAŞLA';
      case 'EVENT': return '❓ OLAYI İNCELE';
      case 'TRIVIA': return '💡 BİLMECENİ ÇÖZ';
      case 'TREASURE': return '💰 SANDIĞI AÇ';
      default: return 'MÜCADELEYİ OYNA';
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`kademe-${currentKademe}`}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`flex-1 flex flex-col justify-between p-3 sm:p-4 bg-gradient-to-b ${theme.bg} text-slate-100 overflow-y-auto select-none relative`}
      >
        {/* Ambient Top Glow — tema renginde */}
        <div className={`absolute top-0 left-0 right-0 h-40 bg-gradient-to-b ${theme.glowTop} pointer-events-none`} />

        {/* Floating Particles (dekoratif, arka planda) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {theme.particles.map((p, i) => (
            <motion.span
              key={i}
              className="absolute text-2xl opacity-5 select-none"
              style={{
                left: `${10 + i * 22}%`,
                top: `${15 + (i % 3) * 25}%`,
              }}
              animate={{ y: [0, -12, 0], rotate: [0, 8, -8, 0] }}
              transition={{ duration: 5 + i * 1.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.7 }}
            >
              {p}
            </motion.span>
          ))}
        </div>

        {/* ── 1. TOP HEADER BAR ── */}
        <div className={`flex items-center justify-between border-b ${theme.headerBorder} pb-2.5 shrink-0 z-10 ${theme.headerBg} backdrop-blur-md px-2 py-1 rounded-2xl`}>
          <div className="flex items-center gap-2">
            {/* Tema emojisi + kademe */}
            <motion.div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
              style={{ background: theme.ambientGlow.replace('0.08', '0.25'), border: `1px solid ${theme.ambientGlow}` }}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              {theme.emoji}
            </motion.div>
            <div>
              <h2 className={`text-base font-black ${theme.titleColor} tracking-wide font-cinzel flex items-center gap-1.5`}>
                KADEME {currentKademe}
                <span className="text-[10px] font-bold opacity-60 normal-case">— {theme.name}</span>
              </h2>
              <p className="text-[10px] text-slate-400 font-medium">
                Mücadeleleri Tamamla Veya Atla!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div className={`flex items-center gap-1 ${theme.goldBg} px-2 py-1 rounded-xl text-xs font-black ${theme.goldColor} shadow-sm`}>
              <Coins size={12} className="fill-current" />
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

        {/* ── 2. KADEME PROGRESS STEPPER ── */}
        <div className={`my-2.5 px-3 py-2 rounded-2xl ${theme.progressBg} shadow-inner flex items-center justify-between gap-1 z-10 shrink-0 overflow-x-auto scrollbar-none`}>
          {blinds.map((blind, idx) => {
            const isCurrent = idx === currentBlindIndex && blind.status !== 'COMPLETED' && blind.status !== 'SKIPPED';
            const isDone = blind.status === 'COMPLETED';
            const isSkipped = blind.status === 'SKIPPED';

            return (
              <React.Fragment key={blind.id}>
                {idx > 0 && (
                  <div className={`h-0.5 flex-1 min-w-[8px] transition-colors duration-500 ${isDone || isSkipped ? `bg-gradient-to-r ${theme.progressBar}` : 'bg-slate-800'}`} />
                )}
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap ${
                    isCurrent
                      ? `bg-gradient-to-r ${theme.progressBar} border-current text-white shadow-[0_0_10px_rgba(0,0,0,0.3)] animate-pulse`
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
          <div className={`px-2 py-1 rounded-lg ${theme.goldBg} ${theme.goldColor} text-[10px] font-bold flex items-center gap-1 shrink-0`}>
            <span>🏪</span>
            <span>Dükkân</span>
          </div>
        </div>

        {/* ── 3. BLIND CARDS CAROUSEL ── */}
        <div className="flex-1 flex items-center gap-1.5 z-10 min-h-[380px]">
          <button
            onClick={() => scrollCarousel(-1)}
            className={`shrink-0 w-9 h-14 rounded-2xl flex items-center justify-center transition active:scale-90 bg-slate-950/80 border ${theme.headerBorder} ${theme.accentColor} shadow-md cursor-pointer`}
          >
            <ChevronLeft size={22} />
          </button>

          <div ref={carouselRef} className="flex-1 h-full flex items-center overflow-x-auto snap-x snap-mandatory gap-3 py-2 px-1 scrollbar-none">
          {blinds.map((blind, idx) => {
            const isCurrent = idx === currentBlindIndex && blind.status !== 'COMPLETED' && blind.status !== 'SKIPPED';
            const isDone = blind.status === 'COMPLETED';
            const isSkipped = blind.status === 'SKIPPED';
            const isLocked = !isCurrent && !isDone && !isSkipped;
            const isBoss = blind.type === 'BOSS_BLIND';
            const isSideEncounter = blind.type === 'EVENT' || blind.type === 'TRIVIA' || blind.type === 'TREASURE';

            let cardBg;
            if (isCurrent) {
              if (isBoss) {
                cardBg = `bg-gradient-to-b ${theme.bossCardActive} ring-2`;
              } else if (isSideEncounter) {
                cardBg = 'bg-gradient-to-b from-purple-950/95 via-slate-900 to-slate-950 border-purple-500/90 ring-2 ring-purple-500/50 shadow-purple-950/60';
              } else {
                cardBg = `bg-gradient-to-b ${theme.cardActive} ring-2`;
              }
            } else if (isDone) {
              cardBg = 'bg-slate-900/60 border-emerald-900/60 opacity-85';
            } else if (isSkipped) {
              cardBg = 'bg-slate-900/60 border-purple-900/60 opacity-85';
            } else {
              cardBg = 'bg-slate-950/80 border-slate-900 opacity-60';
            }

            return (
              <motion.div
                key={blind.id}
                ref={isCurrent ? activeCardRef : null}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className={`w-[260px] sm:w-[280px] h-full snap-center shrink-0 rounded-3xl p-4 flex flex-col justify-between border transition-all duration-300 relative overflow-hidden shadow-2xl ${cardBg}`}
              >
                {/* Card Header Section */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shadow-md border ${
                        isBoss ? 'bg-rose-950 border-rose-500/60' : isSideEncounter ? 'bg-purple-950 border-purple-500/60' : `border-current opacity-80`
                      }`}
                        style={!isBoss && !isSideEncounter ? { background: theme.ambientGlow.replace('0.08', '0.3') } : undefined}
                      >
                        {blind.icon}
                      </div>
                      <div>
                        <h3 className={`text-base font-black tracking-wide leading-tight ${
                          isBoss ? 'text-rose-300' : isSideEncounter ? 'text-purple-300' : isCurrent ? theme.titleColor : 'text-slate-300'
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
                      <span className={`px-2.5 py-0.5 rounded-full ${theme.goldBg} ${theme.goldColor} text-[10px] font-black animate-pulse border`}>
                        ◉ Aktif Aşama
                      </span>
                    )}
                  </div>

                  {/* Target Score Banner */}
                  {!isSideEncounter ? (
                    <div className={`p-3 rounded-2xl my-1.5 border flex items-center justify-between shadow-inner ${
                      isBoss ? 'bg-rose-950/60 border-rose-800/80' : 'bg-slate-950/90 border-slate-800'
                    }`}>
                      <span className="text-xs text-slate-400 font-medium">Hedef Puan:</span>
                      <span className={`text-lg font-black tracking-wider ${isBoss ? 'text-rose-400' : isCurrent ? theme.accentColor : 'text-slate-300'}`}>
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
                      <Coins size={14} className={`fill-current ${theme.accentColor}`} />
                      <span>Ödül: <strong className={theme.accentColor}>+{blind.rewardGold} Altın</strong></span>
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
                      <motion.button
                        onClick={() => handlePlayClick(idx)}
                        whileTap={{ scale: 0.97 }}
                        className={`w-full py-3 px-3 rounded-2xl font-black text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 transition shadow-xl cursor-pointer text-slate-950 bg-gradient-to-r ${
                          isBoss
                            ? 'from-rose-500 via-rose-400 to-red-500 hover:from-rose-400 hover:to-red-400 text-white shadow-rose-950/50'
                            : isSideEncounter
                            ? 'from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white shadow-purple-950/50'
                            : `${theme.primaryBtn} border shadow-sm`
                        }`}
                      >
                        <Play size={16} className="fill-current" />
                        <span>{getPlayButtonText(blind.type)}</span>
                      </motion.button>

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

          <button
            onClick={() => scrollCarousel(1)}
            className={`shrink-0 w-9 h-14 rounded-2xl flex items-center justify-center transition active:scale-90 bg-slate-950/80 border ${theme.headerBorder} ${theme.accentColor} shadow-md cursor-pointer`}
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* ── 4. ACTIVE TAGS TRAY ── */}
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
      </motion.div>
    </AnimatePresence>
  );
}

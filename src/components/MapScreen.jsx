import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Coins, Home, FastForward, Play, Lock, CheckCircle2, ShieldAlert, ChevronLeft, ChevronRight, Award, Compass, Skull, HelpCircle, Swords, Target, Flame } from 'lucide-react';
import { generateKademe } from '../game/mapGenerator';
import { soundEngine } from '../game/audioEngine';
import { RunicCardFrame } from './RunicCardFrame';

// Custom SVG Emblem Icons for Node Types
function NodeSvgIcon({ type, isBoss, isCurrent }) {
  if (isBoss) {
    return (
      <svg className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-[0_0_20px_rgba(244,63,94,0.9)]" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="42" fill="#4c0519" stroke="#f43f5e" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="35" fill="none" stroke="#fb7185" strokeWidth="1" strokeDasharray="6 3" />
        {/* Skull Head */}
        <path d="M32 45 C32 30, 68 30, 68 45 C68 58, 62 65, 62 72 L38 72 C38 65, 32 58, 32 45 Z" fill="#9f1239" stroke="#fef08a" strokeWidth="2" />
        {/* Eye Sockets */}
        <ellipse cx="43" cy="48" rx="6" ry="8" fill="#020617" />
        <ellipse cx="57" cy="48" rx="6" ry="8" fill="#020617" />
        <circle cx="43" cy="48" r="2.5" fill="#f43f5e" />
        <circle cx="57" cy="48" r="2.5" fill="#f43f5e" />
        {/* Teeth */}
        <path d="M43 72 L43 65 M50 72 L50 65 M57 72 L57 65" stroke="#fef08a" strokeWidth="2" />
      </svg>
    );
  }

  if (type === 'EVENT' || type === 'TRIVIA' || type === 'TREASURE') {
    return (
      <svg className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-[0_0_20px_rgba(168,85,247,0.9)]" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="42" fill="#2e1065" stroke="#c084fc" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="35" fill="none" stroke="#e9d5ff" strokeWidth="1" strokeDasharray="4 2" />
        {/* Cosmic Portal Eye */}
        <path d="M25 50 Q50 25 75 50 Q50 75 25 50 Z" fill="#581c87" stroke="#fef08a" strokeWidth="2" />
        <circle cx="50" cy="50" r="10" fill="#38bdf8" stroke="#fef08a" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="4" fill="#ffffff" />
      </svg>
    );
  }

  if (type === 'BIG_BLIND') {
    return (
      <svg className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-[0_0_20px_rgba(245,158,11,0.9)]" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="42" fill="#451a03" stroke="#f59e0b" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="35" fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4 2" />
        {/* Crossed Swords */}
        <path d="M28 28 L72 72 M72 28 L28 72" stroke="#fef08a" strokeWidth="5" strokeLinecap="round" />
        <path d="M28 28 L36 32 M72 28 L64 32 M72 72 L64 68 M28 72 L36 68" stroke="#b45309" strokeWidth="3" />
        <circle cx="50" cy="50" r="6" fill="#f59e0b" stroke="#fef08a" strokeWidth="1.5" />
      </svg>
    );
  }

  // SMALL_BLIND
  return (
    <svg className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-[0_0_20px_rgba(34,211,238,0.9)]" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="42" fill="#083344" stroke="#22d3ee" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="32" fill="none" stroke="#67e8f9" strokeWidth="1.5" strokeDasharray="5 3" />
      {/* Target Crosshair */}
      <circle cx="50" cy="50" r="18" fill="none" stroke="#fef08a" strokeWidth="2" />
      <circle cx="50" cy="50" r="6" fill="#22d3ee" />
      <line x1="50" y1="20" x2="50" y2="30" stroke="#fef08a" strokeWidth="2" />
      <line x1="50" y1="70" x2="50" y2="80" stroke="#fef08a" strokeWidth="2" />
      <line x1="20" y1="50" x2="30" y2="50" stroke="#fef08a" strokeWidth="2" />
      <line x1="70" y1="50" x2="80" y2="50" stroke="#fef08a" strokeWidth="2" />
    </svg>
  );
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

  useEffect(() => {
    if (activeCardRef.current) {
      activeCardRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [currentBlindIndex]);

  const scrollCarousel = (dir) => {
    try { soundEngine.playTap?.(); } catch(e) {}
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' });
    }
  };

  const handlePlayClick = (index) => {
    try { soundEngine.playVictory?.(); } catch(e) {}
    if (onPlayBlind) onPlayBlind(index);
    else if (onSelectNode) onSelectNode(index);
  };

  const handleSkipClick = (index) => {
    try { soundEngine.playTap?.(); } catch(e) {}
    if (onSkipBlind) onSkipBlind(index);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`kademe-${currentKademe}`}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.4 }}
        className="flex-1 flex flex-col justify-between p-3 sm:p-5 bg-transparent text-slate-100 overflow-hidden select-none relative z-10"
      >
        {/* Ambient SVG Background Grid & Runic Radial Network */}
        <div className="absolute inset-0 pointer-events-none opacity-20 z-0 flex items-center justify-center">
          <svg className="w-full h-full" width="100%" height="100%">
            <defs>
              <pattern id="mapPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(245, 158, 11, 0.4)" strokeWidth="0.8" />
                <circle cx="40" cy="40" r="1.5" fill="rgba(245, 158, 11, 0.6)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mapPattern)" />
          </svg>
        </div>

        {/* ── 1. TOP HEADER BAR WITH MYSTICAL CREST & ANTE STEPPER ── */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 border-2 border-amber-500/70 bg-slate-950/95 backdrop-blur-2xl px-3 sm:px-4 py-2 sm:py-3 rounded-3xl shadow-[0_0_40px_rgba(245,158,11,0.35)] z-20 relative">
          {/* LEFT CREST */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-500/30 to-yellow-600/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 shadow-xl relative overflow-hidden shrink-0">
              <RunicCardFrame rarity="legendary" active={true} />
              <Compass size={20} className="text-amber-300 animate-spin-slow z-10 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h2 className="text-sm sm:text-lg font-black text-amber-300 tracking-wider font-cinzel flex items-center gap-1">
                  <span>ANTE {currentKademe} / 8</span>
                  <Sparkles size={14} className="text-amber-400" />
                </h2>
                <span className="text-[9px] sm:text-[10px] px-2 sm:px-3 py-0.5 rounded-full bg-amber-950/90 border border-amber-400/60 text-amber-300 font-black uppercase shadow-md truncate max-w-[120px] sm:max-w-none">
                  {kademeData?.biome?.name || '🌲 Orman Diyarı'}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-semibold hidden sm:block">Aşamayı Geç veya Pas Edip Mistik Etiket Kazan!</p>
            </div>
          </div>

          {/* CENTER: ANTE 8-STEP STEPPER PROGRESS TRACKER */}
          <div className="hidden lg:flex flex-col items-center gap-1.5 px-4 py-1.5 rounded-2xl bg-slate-950/90 border-2 border-amber-500/50 shadow-inner">
            <div className="flex items-center gap-1.5 text-[10px] font-black text-amber-300 tracking-widest uppercase">
              <Flame size={13} className="text-amber-400 fill-amber-400" />
              <span>ANTE İLERLEME YOLU</span>
            </div>
            <div className="flex items-center gap-2">
              {Array.from({ length: 8 }).map((_, stepIdx) => {
                const stepNum = stepIdx + 1;
                const isPassed = stepNum < currentKademe;
                const isCurrentStep = stepNum === currentKademe;
                return (
                  <div
                    key={`ante_step_${stepNum}`}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                      isPassed
                        ? 'bg-emerald-500 text-slate-950 border border-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.8)]'
                        : isCurrentStep
                        ? 'bg-amber-400 text-slate-950 border-2 border-yellow-200 ring-2 ring-amber-400/60 scale-110 shadow-[0_0_15px_rgba(245,158,11,0.9)]'
                        : 'bg-slate-900 text-slate-600 border border-slate-800'
                    }`}
                    title={`Ante ${stepNum}`}
                  >
                    {isPassed ? '✓' : stepNum}
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT SHELF */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 bg-gradient-to-r from-amber-950/90 to-yellow-950/90 border-2 border-amber-400/80 px-4 py-1.5 rounded-2xl text-base font-black text-amber-300 shadow-2xl font-mono">
              <Coins size={18} className="text-amber-400 fill-amber-400" />
              <span>${gold}</span>
            </div>

            {onOpenMainMenu && (
              <button
                onClick={onOpenMainMenu}
                className="p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-900 text-slate-300 border-2 border-slate-800 transition cursor-pointer shadow-md active:scale-95"
                title="Ana Menüye Dön"
              >
                <Home size={18} />
              </button>
            )}
          </div>
        </div>

        {/* ── 2. BLIND CARDS CAROUSEL WITH SVG LASER PATH CONNECTORS ── */}
        <div className="flex-1 flex items-center justify-between gap-1 sm:gap-3 z-20 min-h-[380px] my-auto relative w-full">
          {/* MOBILE & DESKTOP PREV ARROW */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => scrollCarousel(-1)}
            className="flex shrink-0 w-10 sm:w-12 h-16 sm:h-20 rounded-2xl bg-slate-950/95 hover:bg-slate-900 border-2 border-amber-500/60 text-amber-300 items-center justify-center transition cursor-pointer shadow-[0_0_25px_rgba(245,158,11,0.4)] z-30 active:scale-95"
            title="Önceki Aşama"
          >
            <ChevronLeft size={28} />
          </motion.button>

          {/* CAROUSEL TRACK */}
          <div ref={carouselRef} className="flex-1 w-full h-full flex items-center justify-start md:justify-center gap-4 sm:gap-8 py-6 px-2 overflow-x-auto scrollbar-none snap-x snap-mandatory relative">
            {blinds.map((blind, idx) => {
              const isCurrent = idx === currentBlindIndex && blind.status !== 'COMPLETED' && blind.status !== 'SKIPPED';
              const isDone = blind.status === 'COMPLETED';
              const isSkipped = blind.status === 'SKIPPED';
              const isLocked = !isCurrent && !isDone && !isSkipped;
              const isBoss = blind.type === 'BOSS_BLIND';
              const isSideEncounter = blind.type === 'EVENT' || blind.type === 'TRIVIA' || blind.type === 'TREASURE';

              // Frame Rarity Key for RunicCardFrame SVG
              const runicRarity = isBoss ? 'legendary' : (isSideEncounter ? 'rare' : (blind.type === 'BIG_BLIND' ? 'joker' : 'common'));

              // Card Glow & Styling
              let cardStyle = 'border-slate-800 bg-slate-950/90 opacity-60';
              if (isCurrent) {
                if (isBoss) {
                  cardStyle = 'border-4 border-rose-500 bg-gradient-to-b from-rose-950 via-slate-900 to-rose-950 shadow-[0_0_50px_rgba(244,63,94,0.9)] ring-4 ring-rose-500/50 scale-[1.03]';
                } else if (isSideEncounter) {
                  cardStyle = 'border-3 border-purple-400 bg-gradient-to-b from-purple-950 via-slate-900 to-indigo-950 shadow-[0_0_40px_rgba(168,85,247,0.85)] ring-2 ring-purple-400/60';
                } else if (blind.type === 'BIG_BLIND') {
                  cardStyle = 'border-3 border-amber-400 bg-gradient-to-b from-amber-950 via-slate-900 to-yellow-950 shadow-[0_0_40px_rgba(245,158,11,0.85)] ring-2 ring-amber-400/60';
                } else {
                  cardStyle = 'border-3 border-cyan-400 bg-gradient-to-b from-cyan-950 via-slate-900 to-blue-950 shadow-[0_0_40px_rgba(34,211,238,0.85)] ring-2 ring-cyan-400/60';
                }
              } else if (isDone) {
                cardStyle = 'border-emerald-500/80 bg-emerald-950/70 opacity-90';
              } else if (isSkipped) {
                cardStyle = 'border-purple-500/80 bg-purple-950/70 opacity-90';
              }

              return (
                <div key={blind.id} className="relative flex items-center shrink-0">
                  {/* SVG LASER CONNECTOR LINE TO NEXT NODE */}
                  {idx < blinds.length - 1 && (
                    <div className="hidden md:block absolute right-[-32px] top-1/2 -translate-y-1/2 w-8 h-2 z-0 pointer-events-none">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 32 8" fill="none">
                        <line x1="0" y1="4" x2="32" y2="4" stroke={isDone || isSkipped ? '#10b981' : '#475569'} strokeWidth="3" strokeDasharray="4 2" />
                        {(isDone || isSkipped) && (
                          <circle cx="16" cy="4" r="3" fill="#34d399" />
                        )}
                      </svg>
                    </div>
                  )}

                  <motion.div
                    ref={isCurrent ? activeCardRef : null}
                    whileHover={isCurrent ? { scale: 1.04, y: -6 } : {}}
                    transition={{ duration: 0.2 }}
                    className={`w-[85vw] max-w-[300px] md:w-[270px] lg:w-[290px] min-h-[440px] h-auto snap-center rounded-3xl p-5 flex flex-col justify-between border backdrop-blur-2xl relative shadow-2xl overflow-hidden mx-auto transition-all ${cardStyle}`}
                  >

                    {/* SVG Runic Frame Overlay */}
                    <RunicCardFrame rarity={runicRarity} active={isCurrent} />

                    {/* CARD HEADER */}
                    <div className="flex flex-col gap-3 z-10 relative">
                      <div className="flex items-center gap-3">
                        <NodeSvgIcon type={blind.type} isBoss={isBoss} isCurrent={isCurrent} />

                        <div className="text-left">
                          <h3 className={`text-base font-black tracking-wide font-cinzel leading-snug ${
                            isBoss ? 'text-rose-300' : isSideEncounter ? 'text-purple-300' : 'text-amber-300'
                          }`}>
                            <span>{blind.title}</span>
                          </h3>
                          <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mt-0.5">
                            {blind.type === 'SMALL_BLIND' ? 'Normal Mücadele' : blind.type === 'BIG_BLIND' ? 'Yüksek Mücadele' : blind.type === 'BOSS_BLIND' ? 'Özel Boss Kuralı' : 'Gizemli Olay'}
                          </span>
                        </div>
                      </div>

                      {/* STATUS BADGE */}
                      <div className="mt-1">
                        {isCurrent && (
                          <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 text-[11px] font-black uppercase tracking-wider shadow-xl inline-flex items-center gap-1.5 border border-amber-200">
                            <Sparkles size={13} className="fill-slate-950" />
                            <span>🔥 AKTİF SAVAŞ AŞAMASI</span>
                          </span>
                        )}
                        {isDone && (
                          <span className="px-4 py-1.5 rounded-full bg-emerald-950 border-2 border-emerald-500 text-emerald-300 text-[11px] font-black inline-flex items-center gap-1.5 shadow-lg">
                            <CheckCircle2 size={14} className="text-emerald-400" />
                            <span>✓ Tamamlandı</span>
                          </span>
                        )}
                        {isSkipped && (
                          <span className="px-4 py-1.5 rounded-full bg-purple-950 border-2 border-purple-500 text-purple-300 text-[11px] font-black inline-flex items-center gap-1.5 shadow-lg">
                            <FastForward size={14} className="text-purple-400" />
                            <span>⏩ Atlandı (Etiket Ödülü Alındı)</span>
                          </span>
                        )}
                      </div>

                      {/* TARGET SCORE & DETAILS */}
                      {!isSideEncounter ? (
                        <div className="p-3.5 rounded-2xl bg-slate-950/95 border-2 border-slate-800 flex items-center justify-between my-2 shadow-inner">
                          <span className="text-xs text-slate-300 font-bold flex items-center gap-1.5">
                            <Target size={16} className="text-emerald-400" />
                            <span>Hedef Puan:</span>
                          </span>
                          <span className="text-2xl font-black text-amber-300 font-mono tracking-wider">
                            {blind.targetScore}
                          </span>
                        </div>
                      ) : (
                        <div className="p-3.5 rounded-2xl bg-slate-950/95 border border-purple-800/80 text-purple-200 text-xs my-2 leading-relaxed font-medium shadow-inner">
                          {blind.desc}
                        </div>
                      )}

                      {/* BOSS RULE BANNER */}
                      {isBoss && blind.bossRule && (
                        <div className="p-3.5 rounded-2xl bg-rose-950/90 border-2 border-rose-500/80 text-rose-200 text-xs font-semibold flex items-start gap-2.5 shadow-xl">
                          <ShieldAlert size={20} className="text-rose-400 shrink-0 mt-0.5" />
                          <div className="text-left space-y-1">
                            <h4 className="font-black text-rose-300 text-xs">{blind.bossRule.title}</h4>
                            <p className="text-[11px] text-rose-200/90 leading-snug">{blind.bossRule.desc}</p>
                          </div>
                        </div>
                      )}

                      {/* REWARD GOLD */}
                      {!isSideEncounter && (
                        <div className="flex items-center gap-1.5 text-xs font-black text-amber-300 bg-amber-950/80 px-3.5 py-1.5 rounded-xl border border-amber-500/50 w-fit shadow-md">
                          <Coins size={16} className="fill-amber-400 text-amber-400" />
                          <span>Ödül: +${blind.rewardGold} Altın</span>
                        </div>
                      )}
                    </div>

                    {/* ACTION CTA BUTTON */}
                    <div className="mt-4 pt-3 border-t border-slate-800/90 z-10 relative">
                      {isCurrent && (
                        <div className="space-y-2.5">
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => handlePlayClick(idx)}
                            className={`w-full py-3.5 rounded-2xl font-black text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 shadow-2xl cursor-pointer border-2 transition ${
                              isBoss
                                ? 'bg-gradient-to-r from-rose-600 via-red-500 to-rose-600 text-white border-rose-300 shadow-rose-600/70 hover:from-rose-500 hover:to-red-500'
                                : isSideEncounter
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-300 shadow-purple-600/70 hover:from-purple-500 hover:to-indigo-500'
                                : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 border-amber-200 shadow-amber-500/70 hover:from-amber-300 hover:to-yellow-300'
                            }`}
                          >
                            <Play size={18} className="fill-current" />
                            <span>SEÇ VE SAVAŞA BAŞLA</span>
                          </motion.button>

                          {!isBoss && (
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              whileHover={{ scale: 1.02 }}
                              onClick={() => handleSkipClick(idx)}
                              className="w-full py-2.5 rounded-2xl bg-purple-950/90 hover:bg-purple-900 border-2 border-purple-500/70 text-purple-200 font-extrabold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-xl"
                            >
                              <FastForward size={16} className="text-purple-300" />
                              <span>
                                {blind.tag
                                  ? `PAS GEÇ & ETİKET AL (${blind.tag.name})`
                                  : 'PAS GEÇ / AŞAMAYI ATLA (+$10 Altın)'}
                              </span>
                            </motion.button>
                          )}

                        </div>
                      )}

                      {isDone && (
                        <div className="w-full py-3 rounded-2xl bg-emerald-950 border-2 border-emerald-500 text-emerald-300 font-black text-xs text-center flex items-center justify-center gap-1.5 shadow-lg">
                          <CheckCircle2 size={16} />
                          <span>✓ Tamamlandı</span>
                        </div>
                      )}

                      {isSkipped && (
                        <div className="w-full py-3 rounded-2xl bg-purple-950 border-2 border-purple-500 text-purple-300 font-black text-xs text-center flex items-center justify-center gap-1.5 shadow-lg">
                          <FastForward size={16} />
                          <span>⏩ Atlandı (Etiket Ödülü Alındı)</span>
                        </div>
                      )}

                      {isLocked && (
                        <div className="w-full py-3 rounded-2xl bg-slate-950/90 border border-slate-800 text-slate-500 font-bold text-xs text-center flex items-center justify-center gap-1.5">
                          <Lock size={16} />
                          <span>Kilitli Aşamalar</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* DESKTOP NEXT ARROW */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => scrollCarousel(1)}
            className="flex shrink-0 w-10 sm:w-12 h-16 sm:h-20 rounded-2xl bg-slate-950/95 hover:bg-slate-900 border-2 border-amber-500/60 text-amber-300 items-center justify-center transition cursor-pointer shadow-[0_0_25px_rgba(245,158,11,0.4)] z-30 active:scale-95"
            title="Sonraki Aşama"
          >
            <ChevronRight size={28} />
          </motion.button>
        </div>

        {/* ── 3. ACTIVE TAGS TRAY (KAZANILAN ETİKETLER) ── */}
        {activeTags.length > 0 && (
          <div className="mt-3 p-3.5 rounded-3xl bg-slate-950/95 border-2 border-purple-800/80 backdrop-blur-2xl flex items-center justify-center gap-3 overflow-x-auto z-20 shrink-0 shadow-2xl w-full max-w-4xl mx-auto">
            <div className="flex items-center gap-1.5 text-xs font-black text-purple-300 shrink-0">
              <Award size={18} className="text-purple-400" />
              <span>KAZANILAN ETİKETLER:</span>
            </div>
            <div className="flex items-center gap-2.5">
              {activeTags.map((tag, i) => (
                <div
                  key={i}
                  className="px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-purple-950 to-indigo-950 border border-purple-400/80 text-purple-200 text-xs font-black flex items-center gap-2 shadow-lg shrink-0"
                  title={tag.desc}
                >
                  <span className="text-base">{tag.icon}</span>
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

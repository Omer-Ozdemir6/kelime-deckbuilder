import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Coins, Home, FastForward, Play, Lock, CheckCircle2, ShieldAlert, Tag, ChevronLeft, ChevronRight, ShoppingBag, Award, Compass } from 'lucide-react';
import { generateKademe } from '../game/mapGenerator';
import { soundEngine } from '../game/audioEngine';

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
    soundEngine.playTap();
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' });
    }
  };

  const handlePlayClick = (index) => {
    soundEngine.playVictory();
    if (onPlayBlind) onPlayBlind(index);
    else if (onSelectNode) onSelectNode(index);
  };

  const handleSkipClick = (index) => {
    soundEngine.playTap();
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
        {/* ── 1. TOP HEADER BAR ── */}
        <div className="flex items-center justify-between border border-amber-500/40 bg-slate-950/85 backdrop-blur-xl px-4 py-2.5 rounded-3xl shadow-2xl z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-300 shadow-lg animate-pulse">
              <Compass size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-amber-300 tracking-wider font-cinzel">
                  ANTE {currentKademe} / 8
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/90 border border-amber-500/40 text-amber-300 font-extrabold uppercase">
                  {kademeData?.biome?.name || 'Orman Diyarı'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Aşamayı Geç veya Pas Edip Etiket Kazan!</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 bg-amber-950/90 border border-amber-500/50 px-3.5 py-1.5 rounded-2xl text-sm font-black text-amber-300 shadow-xl font-mono">
              <Coins size={16} className="text-amber-400 fill-amber-400 animate-pulse" />
              <span>${gold}</span>
            </div>

            {onOpenMainMenu && (
              <button
                onClick={onOpenMainMenu}
                className="p-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition cursor-pointer shadow-md"
                title="Ana Menüye Dön"
              >
                <Home size={18} />
              </button>
            )}
          </div>
        </div>

                {/* ── 3. BLIND CARDS CAROUSEL WITH 3D NEON EFFECTS ── */}
        <div className="flex-1 flex items-center gap-2 z-20 min-h-[360px] my-auto">
          <button
            onClick={() => scrollCarousel(-1)}
            className="hidden md:flex shrink-0 w-10 h-16 rounded-2xl bg-slate-950/90 hover:bg-slate-900 border border-amber-500/40 text-amber-300 items-center justify-center transition cursor-pointer shadow-xl"
          >
            <ChevronLeft size={24} />
          </button>

          <div ref={carouselRef} className="flex-1 w-full h-full flex items-center justify-center gap-3 sm:gap-6 py-2 px-2 overflow-x-auto scrollbar-none">
            {blinds.map((blind, idx) => {
              const isCurrent = idx === currentBlindIndex && blind.status !== 'COMPLETED' && blind.status !== 'SKIPPED';
              const isDone = blind.status === 'COMPLETED';
              const isSkipped = blind.status === 'SKIPPED';
              const isLocked = !isCurrent && !isDone && !isSkipped;
              const isBoss = blind.type === 'BOSS_BLIND';
              const isSideEncounter = blind.type === 'EVENT' || blind.type === 'TRIVIA' || blind.type === 'TREASURE';

              // Distinct Neon Styling per card type
              let cardStyle = 'border-slate-800 bg-slate-950/80 opacity-50';
              if (isCurrent) {
                if (isBoss) {
                  cardStyle = 'border-2 border-rose-500 bg-gradient-to-b from-rose-950/90 via-slate-900 to-slate-950 shadow-[0_0_35px_rgba(244,63,94,0.7)] ring-2 ring-rose-400/80';
                } else if (isSideEncounter) {
                  cardStyle = 'border-2 border-purple-500 bg-gradient-to-b from-purple-950/90 via-slate-900 to-slate-950 shadow-[0_0_30px_rgba(168,85,247,0.7)] ring-2 ring-purple-400/80';
                } else if (blind.type === 'BIG_BLIND') {
                  cardStyle = 'border-2 border-amber-400 bg-gradient-to-b from-amber-950/90 via-slate-900 to-slate-950 shadow-[0_0_30px_rgba(245,158,11,0.7)] ring-2 ring-amber-400/80';
                } else {
                  cardStyle = 'border-2 border-cyan-400 bg-gradient-to-b from-cyan-950/90 via-slate-900 to-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.7)] ring-2 ring-cyan-400/80';
                }
              } else if (isDone) {
                cardStyle = 'border-emerald-500/60 bg-emerald-950/40 opacity-80';
              } else if (isSkipped) {
                cardStyle = 'border-purple-500/60 bg-purple-950/40 opacity-80';
              }

              return (
                <motion.div
                  key={blind.id}
                  ref={isCurrent ? activeCardRef : null}
                  whileHover={isCurrent ? { scale: 1.04, y: -6 } : {}}
                  transition={{ duration: 0.2 }}
                  className={`flex-1 min-w-[240px] max-w-[310px] min-h-[420px] h-auto snap-center shrink-0 rounded-3xl p-4 sm:p-5 flex flex-col justify-between border backdrop-blur-xl relative shadow-2xl ${cardStyle}`}
                >
                  {/* CARD HEADER */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-3xl shadow-xl border shrink-0 ${
                        isBoss ? 'bg-rose-900/80 border-rose-400 text-rose-200' : isSideEncounter ? 'bg-purple-900/80 border-purple-400 text-purple-200' : 'bg-amber-950/80 border-amber-400 text-amber-200'
                      }`}>
                        {blind.icon}
                      </div>

                      <div className="text-left">
                        <h3 className={`text-base font-black tracking-wide font-cinzel ${
                          isBoss ? 'text-rose-300' : isSideEncounter ? 'text-purple-300' : 'text-amber-300'
                        }`}>
                          {blind.title}
                        </h3>
                        <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">
                          {blind.type === 'SMALL_BLIND' ? 'Normal Mücadele' : blind.type === 'BIG_BLIND' ? 'Yüksek Mücadele' : blind.type === 'BOSS_BLIND' ? 'Özel Boss Kuralı' : 'Gizemli Olay'}
                        </span>
                      </div>
                    </div>

                    {/* STATUS BADGE */}
                    <div className="mt-1">
                      {isCurrent && (
                        <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider animate-pulse shadow-lg inline-block">
                          ◉ AKTİF AŞAMA
                        </span>
                      )}
                      {isDone && (
                        <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/60 text-emerald-300 text-[10px] font-black inline-block">
                          ✓ Tamamlandı
                        </span>
                      )}
                      {isSkipped && (
                        <span className="px-3 py-1 rounded-full bg-purple-950 border border-purple-500/60 text-purple-300 text-[10px] font-black inline-block">
                          ⏩ Atlandı (Etiket Alındı)
                        </span>
                      )}
                    </div>

                    {/* TARGET SCORE & DETAILS */}
                    {!isSideEncounter ? (
                      <div className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800 flex items-center justify-between my-2 shadow-inner">
                        <span className="text-xs text-slate-400 font-bold">Hedef Puan:</span>
                        <span className="text-xl font-black text-amber-300 font-mono tracking-wider">
                          🎯 {blind.targetScore}
                        </span>
                      </div>
                    ) : (
                      <div className="p-3 rounded-2xl bg-slate-950/90 border border-purple-800/60 text-purple-200 text-xs my-2 leading-relaxed">
                        {blind.desc}
                      </div>
                    )}

                    {/* BOSS RULE BANNER */}
                    {isBoss && blind.bossRule && (
                      <div className="p-2.5 rounded-2xl bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs font-semibold flex items-start gap-2 shadow-lg">
                        <ShieldAlert size={16} className="text-rose-400 shrink-0 mt-0.5" />
                        <div className="text-left">
                          <h4 className="font-black text-rose-300 text-xs">{blind.bossRule.title}</h4>
                          <p className="text-[10px] text-rose-200/90 leading-tight">{blind.bossRule.desc}</p>
                        </div>
                      </div>
                    )}

                    {/* REWARD GOLD */}
                    {!isSideEncounter && (
                      <div className="flex items-center gap-1.5 text-xs font-black text-amber-300">
                        <Coins size={14} className="fill-amber-400 text-amber-400" />
                        <span>Ödül: +${blind.rewardGold} Altın</span>
                      </div>
                    )}
                  </div>

                  {/* ACTION CTA BUTTON */}
                  <div className="mt-2 pt-2 border-t border-slate-800/80">
                    {isCurrent && (
                      <div className="space-y-2">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePlayClick(idx)}
                          className={`w-full py-3 rounded-2xl font-black text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 shadow-2xl cursor-pointer border ${
                            isBoss
                              ? 'bg-gradient-to-r from-rose-600 via-red-500 to-rose-600 text-white border-rose-300 shadow-rose-600/50'
                              : isSideEncounter
                              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-300 shadow-purple-600/50'
                              : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 border-amber-200 shadow-amber-500/50'
                          }`}
                        >
                          <Play size={16} className="fill-current" />
                          <span>SEÇ VE SAVAŞA BAŞLA</span>
                        </motion.button>

                        {blind.canSkip && (
                          <button
                            onClick={() => handleSkipClick(idx)}
                            className="w-full py-2 rounded-2xl bg-purple-950 hover:bg-purple-900 border border-purple-500/60 text-purple-200 font-extrabold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow"
                          >
                            <FastForward size={14} />
                            <span>PAS GEÇ &amp; ETİKET AL ({blind.tag?.name})</span>
                          </button>
                        )}
                      </div>
                    )}

                    {isDone && (
                      <div className="w-full py-2.5 rounded-2xl bg-emerald-950 border border-emerald-500/60 text-emerald-300 font-black text-xs text-center">
                        ✓ Tamamlandı
                      </div>
                    )}

                    {isSkipped && (
                      <div className="w-full py-2.5 rounded-2xl bg-purple-950 border border-purple-500/60 text-purple-300 font-black text-xs text-center">
                        ⏩ Atlandı (Etiket Ödülü Alındı)
                      </div>
                    )}

                    {isLocked && (
                      <div className="w-full py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-600 font-bold text-xs text-center flex items-center justify-center gap-1">
                        <Lock size={12} />
                        <span>Kilitli</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <button
            onClick={() => scrollCarousel(1)}
            className="hidden md:flex shrink-0 w-10 h-16 rounded-2xl bg-slate-950/90 hover:bg-slate-900 border border-amber-500/40 text-amber-300 items-center justify-center transition cursor-pointer shadow-xl"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* ── 4. ACTIVE TAGS TRAY ── */}
        {activeTags.length > 0 && (
          <div className="mt-3 p-3 rounded-3xl bg-slate-950/90 border border-purple-800/60 backdrop-blur-md flex items-center justify-center gap-2 overflow-x-auto z-20 shrink-0 shadow-2xl w-full max-w-4xl mx-auto">
            <div className="flex items-center gap-1 text-xs font-black text-purple-300 shrink-0">
              <Award size={16} className="text-purple-400" />
              <span>KAZANILAN ETİKETLER:</span>
            </div>
            <div className="flex items-center gap-2">
              {activeTags.map((tag, i) => (
                <div
                  key={i}
                  className="px-3 py-1 rounded-xl bg-purple-950 border border-purple-400/60 text-purple-200 text-xs font-black flex items-center gap-1.5 shadow-md shrink-0"
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

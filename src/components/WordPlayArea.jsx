import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RefreshCw, Sparkles, CheckCircle2, AlertCircle, BookOpen, X, History, SkipForward, Shuffle, RotateCcw, Zap, Trophy } from 'lucide-react';
import { calculateWordScore } from '../game/wordEngine';
import confetti from 'canvas-confetti';
import { getRarityDetails } from '../game/cardData';
import { RunicCardFrame } from './RunicCardFrame';
import { LuminousWordEffect } from './LuminousWordEffect';
import { BurstParticles } from './BurstParticles';
import { JokerCardIllustration } from './JokerCardIllustration';
import { CardTooltipOverlay } from './CardTooltipOverlay';

const SLOT_MOD_CONFIG = {
  '2xH':     { label: '2xH', color: 'text-cyan-300', bg: 'bg-cyan-950/90', border: 'border-cyan-500/80', title: 'Çift Harf Puanı' },
  '3xH':     { label: '3xH', color: 'text-purple-300', bg: 'bg-purple-950/90', border: 'border-purple-500/80', title: 'Üçlü Harf Puanı' },
  '2xK':     { label: '2xK', color: 'text-amber-300', bg: 'bg-amber-950/90', border: 'border-amber-500/80', title: 'Çift Kelime Puanı' },
  'JOKER':   { label: '🃏', color: 'text-pink-300', bg: 'bg-pink-950/90', border: 'border-pink-500/80', title: 'Bonus Joker Çarpanı' },
  'GOLD':    { label: '💰', color: 'text-yellow-300', bg: 'bg-yellow-950/90', border: 'border-yellow-500/80', title: '+5 Altın Bonusu' },
};

function EmptySlotSvgFrame({ active = false }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50" viewBox="0 0 100 100" preserveAspectRatio="none">
      <rect x="2" y="2" width="96" height="96" rx="12" fill="none" stroke={active ? '#f59e0b' : '#475569'} strokeWidth="1.5" strokeDasharray="5 3" />
      <circle cx="4" cy="4" r="1.5" fill={active ? '#fbbf24' : '#64748b'} />
      <circle cx="96" cy="4" r="1.5" fill={active ? '#fbbf24' : '#64748b'} />
      <circle cx="4" cy="96" r="1.5" fill={active ? '#fbbf24' : '#64748b'} />
      <circle cx="96" cy="96" r="1.5" fill={active ? '#fbbf24' : '#64748b'} />
    </svg>
  );
}

export function WordPlayArea({
  stage = 1,
  selectedCards = [],
  lastPlayedWord,
  playedWordsThisStage = [],
  combo,
  activeRelicKeys = [],
  boardSlotModifiers = {},
  activeBossRule = null,
  onUnselectCard,
  onClearCards,
  onShuffleHand,
  onDiscardHand,
  discardsLeft = 3,
  onPlayWord,
  onPassTurn,
  onPassRound,
  feedbackMessage,
  currentWordMeaning,
  onOpenMeaningModal
}) {
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [floatingScore, setFloatingScore] = useState(null);
  const [screenShake, setScreenShake] = useState(false);
  const [isWordLuminous, setIsWordLuminous] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const [hoveredSlotCard, setHoveredSlotCard] = useState(null);
  const [hoveredSlotTargetRect, setHoveredSlotTargetRect] = useState(null);

  const canPlayWord = selectedCards.length >= 2;

  const handlePlayWordWithVFX = () => {
    if (selectedCards.length < 2) return;
    
    // Trigger SVG Luminous & Burst VFX
    setIsWordLuminous(true);
    setShowBurst(true);
    setTimeout(() => {
      setIsWordLuminous(false);
      setShowBurst(false);
    }, 1200);

    // Trigger confetti spark burst from center
    try {
      confetti({
        particleCount: 45,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch(e) {}

    // Trigger Screen Shake
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 400);


    // Trigger Floating Score Popup
    if (scoreBreakdown && scoreBreakdown.isValid) {
      setFloatingScore(`+${scoreBreakdown.score} PUAN!`);
      setTimeout(() => setFloatingScore(null), 1200);
    }

    if (onPlayWord) onPlayWord();
  };

  const scoreBreakdown = calculateWordScore(selectedCards, lastPlayedWord, combo, playedWordsThisStage, activeRelicKeys, false, boardSlotModifiers, {}, [], activeBossRule);

  const [visibleFeedback, setVisibleFeedback] = useState(feedbackMessage);

  useEffect(() => {
    setVisibleFeedback(feedbackMessage);
    if (!feedbackMessage) return;
    const timer = setTimeout(() => {
      setVisibleFeedback(null);
    }, 3200); // Auto-dismiss banner after 3.2 seconds
    return () => clearTimeout(timer);
  }, [feedbackMessage]);

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-3 relative overflow-hidden bg-transparent z-10">
      {/* Played Words History Bar & Modal Toggle */}
      <div className="w-full flex items-center justify-between gap-2 px-1 mb-1">
        {playedWordsThisStage.length > 0 ? (
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest shrink-0 flex items-center gap-1">
              <History size={12} className="text-amber-400" />
              <span>OYNANANLAR ({playedWordsThisStage.length}):</span>
            </span>
            {playedWordsThisStage.map((w, idx) => (
              <button
                key={idx}
                onClick={() => onOpenMeaningModal && onOpenMeaningModal(w)}
                className="px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-amber-500/40 text-amber-300 text-[11px] font-mono font-bold hover:bg-slate-800 transition shrink-0 cursor-pointer shadow"
              >
                {w}
              </button>
            ))}
          </div>
        ) : (
          <span className="text-[11px] text-slate-300 font-semibold italic">Henüz kelime yazılmadı</span>
        )}

        {playedWordsThisStage.length > 0 && (
          <button
            onClick={() => setShowHistoryModal(true)}
            className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold shrink-0 transition"
            title="Kelime Geçmişini Gör"
          >
            <BookOpen size={14} />
          </button>
        )}
      </div>

      {/* HISTORY MODAL */}
      <AnimatePresence>
        {showHistoryModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-x-3 top-10 bottom-10 z-50 bg-slate-950/95 border-2 border-amber-500 rounded-3xl p-4 flex flex-col justify-between shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-black text-amber-300 flex items-center gap-1.5">
                <History size={16} />
                <span>Oynanan Kelimeler Geçmişi ({playedWordsThisStage.length})</span>
              </h3>
              <button onClick={() => setShowHistoryModal(false)} className="text-slate-400 hover:text-slate-200">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto my-3 space-y-2 pr-1">
              {playedWordsThisStage.map((w, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setShowHistoryModal(false);
                    if (onOpenMeaningModal) onOpenMeaningModal(w);
                  }}
                  className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs cursor-pointer hover:border-amber-500/50 transition"
                >
                  <span className="font-mono font-black text-amber-300">{idx + 1}. {w}</span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <span>TDK Anlamı</span>
                    <BookOpen size={12} />
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowHistoryModal(false)}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition"
            >
              Kapat
            </button>
          </motion.div>
        )}
      </AnimatePresence>

            {/* FLOATING SCORE POPUP ANIMATION */}
      <AnimatePresence>
        {floatingScore && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: [1, 1.3, 1.1], opacity: 1, y: -40 }}
            exit={{ opacity: 0, y: -70 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none px-6 py-2.5 rounded-3xl bg-amber-400 text-slate-950 font-black text-2xl sm:text-3xl tracking-widest font-cinzel shadow-[0_0_50px_rgba(245,158,11,0.9)] border-2 border-yellow-200"
          >
            {floatingScore}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Word Rack Area (Tile Tray Container) */}
      <div className="w-full flex-1 flex flex-col items-center justify-center my-2 min-h-[160px] relative">
        <div className="w-full max-w-4xl min-h-[110px] sm:min-h-[140px] px-3 sm:px-6 py-3 bg-slate-950/95 backdrop-blur-2xl border-3 sm:border-4 border-amber-400/90 rounded-3xl shadow-[0_0_60px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 sm:gap-3.5 md:gap-4.5 transition-all relative overflow-x-auto scrollbar-none mx-auto">
          <LuminousWordEffect word={selectedCards.map(c => c.letter).join('')} active={isWordLuminous} />
          <BurstParticles count={16} active={showBurst} color={combo > 3 ? '#f97316' : '#f59e0b'} />

          {[0, 1, 2, 3, 4, 5, 6].map((slotIdx) => {
            const card = selectedCards[slotIdx];
            const slotMod = boardSlotModifiers[slotIdx];
            const modCfg = SLOT_MOD_CONFIG[slotMod];

            if (card) {
              const tileClass = card.isSpecial
                ? 'tile-bevel-amber text-amber-200'
                : card.rarity === 'efsanevi'
                ? 'tile-bevel-yellow text-yellow-100'
                : card.rarity === 'nadir'
                ? 'tile-bevel-cyan text-cyan-200'
                : 'tile-bevel-slate text-slate-100';

              const isHovered = hoveredSlotCard?.id === card.id;

              return (
                <motion.button
                  key={`${card.id}_slot_${slotIdx}`}
                  layout
                  initial={{ scale: 0.7, opacity: 0, y: 12 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.7, opacity: 0, y: -12 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => onUnselectCard(slotIdx)}
                  onMouseEnter={(e) => {
                    setHoveredSlotCard(card);
                    setHoveredSlotTargetRect(e.currentTarget.getBoundingClientRect());
                  }}
                  onMouseLeave={() => {
                    setHoveredSlotCard(null);
                    setHoveredSlotTargetRect(null);
                  }}
                  className={`w-10 sm:w-14 md:w-16 h-15 sm:h-20 md:h-24 rounded-2xl flex flex-col items-center justify-between p-1 transition-all relative cursor-pointer select-none shrink-0 overflow-visible shadow-2xl ${tileClass} ${
                    modCfg ? `ring-2 sm:ring-4 ${modCfg.border}` : ''
                  }`}
                >
                  {isHovered && <CardTooltipOverlay card={card} targetRect={hoveredSlotTargetRect} />}

                  <RunicCardFrame
                    rarity={card.isSpecial ? 'joker' : (card.rarity === 'efsanevi' ? 'legendary' : (card.rarity === 'nadir' ? 'rare' : 'common'))}
                    active={true}
                  />

                  {/* Slot modifier badge overlay */}
                  {modCfg && (
                    <div className={`absolute -top-2.5 left-1/2 -translate-x-1/2 px-1 py-0.2 rounded ${modCfg.bg} ${modCfg.color} font-black text-[8px] sm:text-[9px] border ${modCfg.border} shadow-md z-20 whitespace-nowrap`}>
                      {modCfg.label}
                    </div>
                  )}

                  {/* Upgrade level badge */}
                  {card.upgradeLevel > 0 && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] flex items-center justify-center shadow-lg border border-amber-200 z-10">
                      +{card.upgradeLevel}
                    </div>
                  )}

                  {/* Main Letter Glyph */}
                  {card.isSpecial || card.type === 'joker' || (card.letter && card.letter.length > 2) ? (
                    <JokerCardIllustration cardId={card.id} type={card.specialType || 'joker'} className="w-5 h-5 sm:w-8 sm:h-8 my-auto" />
                  ) : (
                    <span className="text-base sm:text-2xl md:text-3xl font-black tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] my-auto font-cinzel">
                      {card.letter}
                    </span>
                  )}

                  {/* Points Badge */}
                  <div className="w-full flex items-center justify-center bg-slate-950/90 rounded-xl py-0.5 border border-slate-800/80">
                    <span className="text-[8px] sm:text-[10px] font-extrabold text-amber-300">
                      +{card.points}p
                    </span>
                  </div>
                </motion.button>
              );
            }

            // Empty Slot Tile Box with SVG Frame Overlay
            return (
              <div
                key={`empty_slot_${slotIdx}`}
                className={`w-10 sm:w-14 md:w-16 h-15 sm:h-20 md:h-24 shrink-0 rounded-2xl flex flex-col items-center justify-between p-1 transition-all relative overflow-hidden ${
                  modCfg
                    ? `${modCfg.bg} ${modCfg.border} text-amber-300`
                    : 'border border-slate-800 bg-slate-950/70 text-slate-600'
                }`}
              >
                <EmptySlotSvgFrame active={Boolean(modCfg)} />

                {modCfg ? (
                  <div className="text-[8px] sm:text-[9px] font-black uppercase text-center mt-1 font-mono relative z-10">{modCfg.label}</div>
                ) : (
                  <div className="my-auto flex flex-col items-center justify-center gap-0.5 relative z-10">
                    {slotIdx >= 4 ? (
                      <>
                        <span className="text-[11px] sm:text-xs font-black text-amber-300 animate-pulse drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]">
                          +{slotIdx === 4 ? '5p' : slotIdx === 5 ? '10p' : '15p'}
                        </span>
                        <span className="text-[9px] font-extrabold text-amber-500/70">
                          #{slotIdx + 1}
                        </span>
                      </>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-600 font-mono">
                        #{slotIdx + 1}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* VERBO Unique Turkish Scoring Engine HUD */}
        {scoreBreakdown && selectedCards.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-2.5 px-4 py-2 rounded-2xl bg-slate-950/95 border-2 border-amber-400/80 text-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.35)] flex flex-col items-center justify-center gap-1 z-20 backdrop-blur-md"
          >
            <div className="flex items-center gap-2 font-sans font-black text-xs sm:text-sm">
              {/* HARF GÜCÜ */}
              <div className="px-3 py-1 rounded-xl bg-amber-950/80 border border-amber-400/80 text-amber-300 flex items-center gap-1.5 shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                <Sparkles size={14} className="text-amber-400" />
                <span>Harf Gücü: {scoreBreakdown.chips || scoreBreakdown.basePoints}</span>
              </div>

              <span className="text-amber-400/80 font-black text-sm font-cinzel">×</span>

              {/* KELİME ÇARPANI */}
              <div className="px-3 py-1 rounded-xl bg-purple-950/80 border border-purple-400/80 text-purple-300 flex items-center gap-1.5 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                <Zap size={14} className="text-purple-400" />
                <span>Kelime Çarpanı: x{(scoreBreakdown.mult * (scoreBreakdown.xMult || 1)).toFixed(1).replace('.0', '')}</span>
              </div>
            </div>

            {/* Chain & Bank Badges */}
            <div className="flex items-center gap-1.5 flex-wrap justify-center pt-0.5">
              {scoreBreakdown.chainType === 'EXTEND' && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/30 text-amber-300 border border-amber-500/50 text-[10px] font-black tracking-wide flex items-center gap-1 animate-pulse">
                  🔗 KELİME ZİNCİRİ (UZAT) (+%20)
                </span>
              )}
              {scoreBreakdown.chainType === 'TRANSFORM' && (
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 text-[10px] font-black tracking-wide flex items-center gap-1">
                  🔀 KELİME DÖNÜŞÜMÜ (+%15)
                </span>
              )}
              {scoreBreakdown.isBankUsed && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 text-[10px] font-black tracking-wide flex items-center gap-1">
                  🏦 BANKA HARFİ
                </span>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Auto-Dismissing Feedback Message Banner */}
      <AnimatePresence>
        {visibleFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="text-center text-xs font-bold text-amber-300 bg-slate-900/95 border-2 border-amber-500/50 px-4 py-2 rounded-2xl mb-2 shadow-xl flex items-center justify-center gap-1.5 backdrop-blur-md"
          >
            <span>{visibleFeedback}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons: KARIŞTIR, YENİLE, PAS & OYNA */}
      <div className="w-full grid grid-cols-12 gap-1.5 sm:gap-3">
        {/* KARIŞTIR Button */}
        <button
          onClick={onShuffleHand || onClearCards}
          className="col-span-3 sm:col-span-2 bg-slate-900 hover:bg-slate-800 text-amber-300 font-black py-2.5 sm:py-3.5 px-1.5 sm:px-2 rounded-2xl border-2 border-amber-500/50 hover:border-amber-400 transition flex items-center justify-center gap-1 active:scale-95 text-[11px] sm:text-sm shadow-lg cursor-pointer truncate"
          title="Eldeki harflerin sırasını karıştırır"
        >
          <Shuffle size={14} className="text-amber-400 shrink-0" />
          <span className="truncate">Karıştır</span>
        </button>

        {/* YENİLE (Discard / Redraw) Button */}
        {onDiscardHand && (
          <button
            onClick={onDiscardHand}
            disabled={discardsLeft <= 0}
            className={`col-span-3 sm:col-span-3 font-black py-2.5 sm:py-3.5 px-1.5 sm:px-2 rounded-2xl border-2 transition flex items-center justify-center gap-1 active:scale-95 text-[11px] sm:text-sm shadow-lg truncate ${
              discardsLeft > 0
                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 border-2 border-yellow-300 text-slate-950 font-black shadow-[0_0_20px_rgba(245,158,11,0.6)] cursor-pointer'
                : 'bg-slate-950 border-slate-800 text-slate-600 cursor-not-allowed'
            }`}
            title="Eli Yenile: Eldeki harfleri desteye gönderir ve yeni harfler çeker"
          >
            <RotateCcw size={14} className={discardsLeft > 0 ? 'text-slate-950 shrink-0' : 'text-slate-600 shrink-0'} />
            <span className="truncate">Yenile ({discardsLeft})</span>
          </button>
        )}

        {/* PAS (Skip Round) Button */}
        <button
          onClick={onPassTurn || onPassRound}
          className="col-span-2 sm:col-span-2 bg-gradient-to-r from-rose-950 to-red-950 hover:from-rose-900 border-2 border-rose-500/80 text-rose-200 font-black py-2.5 sm:py-3.5 px-1 sm:px-2 rounded-2xl transition flex items-center justify-center gap-1 active:scale-95 text-[11px] sm:text-sm shadow-lg cursor-pointer truncate"
          title="Aşamayı pas geç"
        >
          <SkipForward size={14} className="text-rose-400 shrink-0" />
          <span className="truncate">Pas</span>
        </button>

        {/* OYNA Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handlePlayWordWithVFX}
          disabled={!canPlayWord}
          className={`col-span-4 sm:col-span-5 font-black py-2.5 sm:py-3.5 px-2 rounded-2xl transition flex items-center justify-center gap-1.5 text-xs sm:text-base tracking-wider border-2 shadow-2xl truncate ${
            canPlayWord
              ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 border-yellow-100 shadow-amber-500/30 cursor-pointer animate-pulse'
              : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
          }`}
        >
          <Play size={16} className={canPlayWord ? 'fill-slate-950 shrink-0' : 'shrink-0'} />
          <span className="truncate font-black tracking-widest text-sm sm:text-base">OYNA</span>
        </motion.button>
      </div>
    </div>
  );
}

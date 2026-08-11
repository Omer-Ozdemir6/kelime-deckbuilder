import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RefreshCw, Sparkles, CheckCircle2, AlertCircle, BookOpen, X, History, SkipForward } from 'lucide-react';
import { calculateWordScore } from '../game/wordEngine';
import { getRarityDetails } from '../game/cardData';

const SLOT_MOD_CONFIG = {
  '2xH':     { label: '2xH', color: 'text-cyan-300', bg: 'bg-cyan-950/90', border: 'border-cyan-500/80', title: 'Çift Harf Puanı' },
  '3xH':     { label: '3xH', color: 'text-purple-300', bg: 'bg-purple-950/90', border: 'border-purple-500/80', title: 'Üçlü Harf Puanı' },
  '2xK':     { label: '2xK', color: 'text-rose-300', bg: 'bg-rose-950/90', border: 'border-rose-500/80', title: 'Çift Kelime Puanı' },
  'GOLD_5':  { label: '💰+5', color: 'text-amber-300', bg: 'bg-amber-950/90', border: 'border-amber-500/80', title: '+5 Altın Yuvası' },
  'COMBO_1': { label: '⚡+1', color: 'text-yellow-300', bg: 'bg-yellow-950/90', border: 'border-yellow-500/80', title: '+1 Kombo Yuvası' }
};

export function WordPlayArea({
  stage = 1,
  selectedCards = [],
  lastPlayedWord,
  playedWordsThisStage = [],
  combo,
  activeRelicKeys = [],
  boardSlotModifiers = {},
  onUnselectCard,
  onClearCards,
  onPlayWord,
  onPassTurn,
  feedbackMessage,
  currentWordMeaning,
  onOpenMeaningModal
}) {
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  // Real-time projected score calculation
  const scoreBreakdown = calculateWordScore(selectedCards, lastPlayedWord, combo, playedWordsThisStage, activeRelicKeys, false, boardSlotModifiers);

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
    <div className="flex-1 flex flex-col items-center justify-between p-3 relative overflow-hidden bg-slate-950/30">
      {/* Played Words History Bar & Modal Toggle */}
      <div className="w-full flex items-center justify-between gap-2 px-1 mb-1">
        {playedWordsThisStage.length > 0 ? (
          <div className="flex-1 flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <History size={11} className="text-amber-400" />
              Kelimeler ({playedWordsThisStage.length}):
            </span>
            {playedWordsThisStage.map((w, idx) => (
              <button
                key={`${w}_${idx}`}
                onClick={() => onOpenMeaningModal && onOpenMeaningModal(w)}
                className="px-2.5 py-0.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/60 text-amber-300 font-extrabold text-[11px] tracking-wide shrink-0 shadow-md transition flex items-center gap-1 cursor-pointer active:scale-95"
                title={`${w} kelimesinin TDK anlamını gör`}
              >
                <span>{w}</span>
                <span className="text-[9px] text-amber-400">📖</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-[11px] text-slate-500 italic">Henüz kelime yazılmadı</div>
        )}

        {playedWordsThisStage.length > 0 && (
          <button
            onClick={() => setShowHistoryModal(true)}
            className="px-2 py-1 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[10px] font-extrabold flex items-center gap-1 shrink-0 transition active:scale-95 shadow-sm"
            title="Tüm Yazılan Kelimeleri Göster"
          >
            <BookOpen size={12} className="text-amber-400" />
            <span>Tümü</span>
          </button>
        )}
      </div>

      {/* History Modal Overlay */}
      <AnimatePresence>
        {showHistoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-30 p-4 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 text-amber-400 font-black text-sm">
                <BookOpen size={18} />
                <span>BU BÖLÜMDE YAZILAN KELİMELER ({playedWordsThisStage.length})</span>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 my-3 overflow-y-auto grid grid-cols-2 gap-2 pr-1">
              {playedWordsThisStage.map((word, index) => (
                <div
                  key={`${word}_modal_${index}`}
                  onClick={() => {
                    setShowHistoryModal(false);
                    onOpenMeaningModal && onOpenMeaningModal(word);
                  }}
                  className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 flex items-center justify-between gap-2 shadow-md cursor-pointer transition active:scale-95"
                  title={`${word} TDK Anlamını Gör`}
                >
                  <span className="text-xs font-bold text-slate-500">#{index + 1}</span>
                  <span className="text-sm font-extrabold text-amber-300 tracking-wider flex items-center gap-1">
                    <span>{word}</span>
                    <span className="text-[10px]">📖</span>
                  </span>
                  <span className="text-[10px] text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded-lg border border-slate-800 font-semibold">
                    {word.length} Harf
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

      {/* Word Rack Area (Tile Tray Container) */}
      <div className="w-full flex-1 flex flex-col items-center justify-center my-1.5 min-h-[140px]">
        {/* Selected Tiles Rack: 7 Fixed Board Slots */}
        <div className="w-full min-h-[85px] p-2 bg-slate-950/85 backdrop-blur-xl border border-slate-700/60 rounded-2xl shadow-2xl flex items-center justify-center gap-1 sm:gap-1.5 transition-all relative overflow-hidden">
          {[0, 1, 2, 3, 4, 5, 6].map((slotIdx) => {
            const card = selectedCards[slotIdx];
            const slotMod = boardSlotModifiers[slotIdx];
            const modCfg = SLOT_MOD_CONFIG[slotMod];

            if (card) {
              const tileClass = card.isSpecial
                ? 'tile-bevel-purple text-purple-200'
                : card.rarity === 'cok_nadir'
                ? 'tile-bevel-amber text-amber-200'
                : card.rarity === 'nadir'
                ? 'tile-bevel-cyan text-cyan-200'
                : 'tile-bevel-slate text-slate-100';

              return (
                <motion.button
                  key={`${card.id}_slot_${slotIdx}`}
                  layout
                  initial={{ scale: 0.7, opacity: 0, y: 12 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.7, opacity: 0, y: -12 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => onUnselectCard(slotIdx)}
                  className={`w-9 h-14 sm:w-11 sm:h-16 rounded-xl flex flex-col items-center justify-between p-1 transition-all relative cursor-pointer select-none shrink-0 ${tileClass} ${
                    modCfg ? `ring-2 ${modCfg.border}` : ''
                  }`}
                >
                  {/* Slot modifier badge overlay */}
                  {modCfg && (
                    <div className={`absolute -top-2 left-1/2 -translate-x-1/2 px-1 py-0.2 rounded-md ${modCfg.bg} ${modCfg.color} font-black text-[8px] border ${modCfg.border} shadow-md z-20`}>
                      {modCfg.label}
                    </div>
                  )}

                  {/* Upgrade level badge */}
                  {card.upgradeLevel > 0 && (
                    <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-amber-400 text-slate-950 font-black text-[8px] flex items-center justify-center shadow-lg border border-amber-200 z-10">
                      +{card.upgradeLevel}
                    </div>
                  )}

                  {/* Main Letter Glyph */}
                  <span className="text-base sm:text-lg font-extrabold tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] my-auto">
                    {card.letter}
                  </span>

                  {/* Points Badge */}
                  <div className="w-full flex items-center justify-center bg-slate-950/80 rounded-lg py-0.5 border border-slate-800/80">
                    <span className="text-[8px] sm:text-[9px] font-black text-amber-300">
                      {card.isSpecial ? '★' : `${card.points}p`}
                    </span>
                  </div>
                </motion.button>
              );
            }

            // Empty Slot Tile Box
            return (
              <div
                key={`empty_slot_${slotIdx}`}
                className={`w-9 h-14 sm:w-11 sm:h-16 rounded-xl border-2 border-dashed flex flex-col items-center justify-between p-1 transition-all relative shrink-0 ${
                  modCfg
                    ? `${modCfg.bg} ${modCfg.border} shadow-inner`
                    : 'border-slate-800/80 bg-slate-950/40 text-slate-700'
                }`}
                title={modCfg ? modCfg.title : `Slot #${slotIdx + 1}`}
              >
                {modCfg ? (
                  <div className="my-auto flex flex-col items-center justify-center">
                    <span className={`text-[9px] sm:text-[10px] font-black ${modCfg.color} tracking-tight`}>
                      {modCfg.label}
                    </span>
                  </div>
                ) : (
                  <span className="text-[9px] font-bold text-slate-700 my-auto">
                    #{slotIdx + 1}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Live Score Breakdown Preview Badge */}
        {selectedCards.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-2 px-3.5 py-1.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 shadow-lg backdrop-blur-md ${
              scoreBreakdown.isValid
                ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-200 shadow-emerald-950/50'
                : 'bg-rose-950/90 border-rose-500/60 text-rose-200 shadow-rose-950/50'
            }`}
          >
            {scoreBreakdown.isValid ? (
              <>
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span className="font-black text-sm text-emerald-300">{scoreBreakdown.score} Puan</span>
                  <span className="text-[10px] opacity-80 font-medium">
                    (Taban: {scoreBreakdown.basePoints} + Bonus: +{scoreBreakdown.lengthBonus}
                    {scoreBreakdown.extensionBonus > 0 && ` + Zincir: +${scoreBreakdown.extensionBonus}`}
                    {combo > 1 && ` × ${combo}`})
                  </span>
                </div>

                {/* Chain & Bank Badges */}
                <div className="flex items-center gap-1.5 flex-wrap justify-center pt-0.5">
                  {scoreBreakdown.chainType === 'EXTEND' && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-300 border border-amber-500/50 text-[9px] font-black tracking-wide flex items-center gap-1 animate-pulse">
                      🔗 KELİME ZİNCİRİ (UZAT) (+%20)
                    </span>
                  )}
                  {scoreBreakdown.chainType === 'TRANSFORM' && (
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 text-[9px] font-black tracking-wide flex items-center gap-1">
                      🔀 KELİME DÖNÜŞÜMÜ (+%15)
                    </span>
                  )}
                  {scoreBreakdown.isBankUsed && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 text-[9px] font-black tracking-wide flex items-center gap-1">
                      🏦 BANKA HARFİ
                    </span>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-1.5">
                <AlertCircle size={16} className="text-rose-400 shrink-0" />
                <span className="font-extrabold">{scoreBreakdown.message || 'Geçersiz Kelime'}</span>
              </div>
            )}
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
            className="text-center text-xs font-bold text-amber-300 bg-slate-900/95 border border-amber-500/40 px-3.5 py-1.5 rounded-2xl mb-2 shadow-lg flex items-center justify-center gap-1.5 backdrop-blur-md"
          >
            <span>{visibleFeedback}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons: KELİMEYİ OYNA, TEMİZLE & PAS GEÇ */}
      <div className="w-full grid grid-cols-5 gap-1.5">
        <button
          onClick={onClearCards}
          disabled={selectedCards.length === 0}
          className="col-span-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 font-bold py-3.5 px-1 rounded-2xl border border-slate-700/80 transition flex items-center justify-center gap-1 active:scale-95 text-[11px] shadow-md cursor-pointer"
          title="Seçilen harfleri sıfırla"
        >
          <RefreshCw size={12} className="text-slate-400" />
          <span>Temizle</span>
        </button>

        {onPassTurn && (
          <button
            onClick={onPassTurn}
            className="col-span-1 bg-rose-950/80 hover:bg-rose-900 text-rose-300 font-bold py-3.5 px-1 rounded-2xl border border-rose-700/60 transition flex items-center justify-center gap-1 active:scale-95 text-[11px] shadow-md cursor-pointer"
            title="Hamle kalmadığında turu pas geç / bitir"
          >
            <SkipForward size={12} className="text-rose-400" />
            <span>Pas</span>
          </button>
        )}

        <button
          onClick={onPlayWord}
          disabled={selectedCards.length < 2 || !scoreBreakdown.isValid}
          className={`${onPassTurn ? 'col-span-3' : 'col-span-4'} font-black py-3.5 px-3 rounded-2xl transition flex items-center justify-center gap-2 shadow-2xl active:scale-95 text-xs sm:text-sm tracking-wide border ${
            selectedCards.length >= 2 && scoreBreakdown.isValid
              ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 border-amber-300 shadow-amber-500/40 animate-pulse-glow'
              : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
          }`}
        >
          <Play size={16} className={selectedCards.length >= 2 && scoreBreakdown.isValid ? 'fill-slate-950' : 'fill-slate-600'} />
          <span>KELİMEYİ OYNA</span>
        </button>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RefreshCw, Sparkles, CheckCircle2, AlertCircle, BookOpen, X, History } from 'lucide-react';
import { calculateWordScore } from '../game/wordEngine';
import { getRarityDetails } from '../game/cardData';

export function WordPlayArea({
  stage = 1,
  selectedCards,
  lastPlayedWord,
  playedWordsThisStage = [],
  combo,
  onUnselectCard,
  onClearCards,
  onPlayWord,
  feedbackMessage,
  currentWordMeaning,
  onOpenMeaningModal
}) {
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  // Real-time projected score calculation
  const scoreBreakdown = calculateWordScore(selectedCards, lastPlayedWord, combo);

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
        {/* Selected Tiles Rack */}
        <div className="w-full min-h-[90px] p-2.5 bg-slate-950/85 backdrop-blur-xl border border-slate-700/60 rounded-2xl shadow-2xl flex flex-wrap items-center justify-center gap-2 transition-all relative">
          <AnimatePresence mode="popLayout">
            {selectedCards.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-slate-500 text-xs font-semibold tracking-wide flex items-center gap-1.5 py-4"
              >
                <Sparkles size={14} className="text-amber-400/80 animate-pulse" />
                <span>Harflere dokunarak kelime oluştur</span>
              </motion.div>
            ) : (
              selectedCards.map((card, index) => {
                const tileClass = card.isSpecial
                  ? 'tile-bevel-purple text-purple-200'
                  : card.rarity === 'cok_nadir'
                  ? 'tile-bevel-amber text-amber-200'
                  : card.rarity === 'nadir'
                  ? 'tile-bevel-cyan text-cyan-200'
                  : 'tile-bevel-slate text-slate-100';

                return (
                  <motion.button
                    key={`${card.id}_slot_${index}`}
                    layout
                    initial={{ scale: 0.7, opacity: 0, y: 15 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.7, opacity: 0, y: -15 }}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => onUnselectCard(index)}
                    className={`w-12 h-16 rounded-2xl flex flex-col items-center justify-between p-1 transition-all relative cursor-pointer select-none ${tileClass}`}
                  >
                    {/* Upgrade level badge */}
                    {card.upgradeLevel > 0 && (
                      <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] flex items-center justify-center shadow-lg border border-amber-200 z-10">
                        +{card.upgradeLevel}
                      </div>
                    )}

                    {/* Top small letter/type indicator */}
                    <span className="text-[9px] font-black opacity-75 uppercase">
                      {card.isSpecial ? card.specialType : 'HARF'}
                    </span>

                    {/* Main Letter Glyph */}
                    <span className="text-xl font-extrabold tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      {card.letter}
                    </span>

                    {/* Points Badge */}
                    <div className="w-full flex items-center justify-center bg-slate-950/80 rounded-lg py-0.5 border border-slate-800/80">
                      <span className="text-[9px] font-black text-amber-300">
                        {card.isSpecial ? '★' : `${card.points}p`}
                      </span>
                    </div>
                  </motion.button>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* Live Score Breakdown Preview Badge */}
        {selectedCards.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-2.5 px-3.5 py-1.5 rounded-2xl border text-xs font-bold flex items-center gap-2 shadow-lg backdrop-blur-md ${
              scoreBreakdown.isValid
                ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-200 shadow-emerald-950/50'
                : 'bg-rose-950/90 border-rose-500/60 text-rose-200 shadow-rose-950/50'
            }`}
          >
            {scoreBreakdown.isValid ? (
              <>
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-black text-sm text-emerald-300">{scoreBreakdown.score} Puan</span>
                  <span className="text-[10px] opacity-80 font-medium">
                    (Taban: {scoreBreakdown.basePoints} + Bonus: +{scoreBreakdown.lengthBonus}
                    {scoreBreakdown.extensionBonus > 0 && ` + Zincir: +${scoreBreakdown.extensionBonus}`}
                    {combo > 1 && ` × ${combo}`})
                  </span>
                </div>
              </>
            ) : (
              <>
                <AlertCircle size={16} className="text-rose-400 shrink-0" />
                <span className="font-extrabold">Geçersiz Kelime</span>
              </>
            )}
          </motion.div>
        )}
      </div>

      {/* Feedback Message Banner */}
      {feedbackMessage && (
        <div className="text-center text-xs font-bold text-amber-300 bg-slate-900/90 border border-amber-500/30 px-3.5 py-1.5 rounded-2xl mb-2 shadow-md flex items-center justify-center gap-1.5 animate-float">
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Action Buttons: KELİMEYİ OYNA & TEMİZLE */}
      <div className="w-full grid grid-cols-4 gap-2">
        <button
          onClick={onClearCards}
          disabled={selectedCards.length === 0}
          className="col-span-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 font-bold py-3.5 px-2 rounded-2xl border border-slate-700/80 transition flex items-center justify-center gap-1.5 active:scale-95 text-xs shadow-md"
        >
          <RefreshCw size={14} className="text-slate-400" />
          <span>Temizle</span>
        </button>

        <button
          onClick={onPlayWord}
          disabled={selectedCards.length < 2 || !scoreBreakdown.isValid}
          className={`col-span-3 font-black py-3.5 px-4 rounded-2xl transition flex items-center justify-center gap-2 shadow-2xl active:scale-95 text-sm tracking-wide border ${
            selectedCards.length >= 2 && scoreBreakdown.isValid
              ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 border-amber-300 shadow-amber-500/40 animate-pulse-glow'
              : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
          }`}
        >
          <Play size={18} className={selectedCards.length >= 2 && scoreBreakdown.isValid ? 'fill-slate-950' : 'fill-slate-600'} />
          <span>KELİMEYİ OYNA</span>
        </button>
      </div>
    </div>
  );
}

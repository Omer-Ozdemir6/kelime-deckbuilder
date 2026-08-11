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
  feedbackMessage
}) {
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  // Real-time projected score calculation
  const scoreBreakdown = calculateWordScore(selectedCards, lastPlayedWord, combo);

  // Dynamic board themes by stage
  const boardThemeClass = stage >= 7
    ? 'bg-amber-950/80 border-amber-500/80 shadow-amber-500/20'
    : stage >= 4
    ? 'bg-slate-950/80 border-cyan-500/60 shadow-cyan-950/40'
    : 'bg-slate-950/70 border-slate-700/80 shadow-inner';

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-3 relative overflow-hidden bg-slate-900/40">
      {/* Played Words History Bar & Modal Toggle */}
      <div className="w-full flex items-center justify-between gap-2 px-1 mb-1">
        {playedWordsThisStage.length > 0 ? (
          <div className="flex-1 flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <History size={11} className="text-amber-400" />
              Kelimeler ({playedWordsThisStage.length}):
            </span>
            {playedWordsThisStage.map((w, idx) => (
              <span
                key={`${w}_${idx}`}
                className="px-2 py-0.5 rounded-full bg-slate-950/80 border border-slate-800 text-amber-300 font-extrabold text-[11px] tracking-wide shrink-0 shadow-sm"
              >
                {w}
              </span>
            ))}
          </div>
        ) : (
          <div className="text-[11px] text-slate-500 italic">Henüz kelime yazılmadı</div>
        )}

        {playedWordsThisStage.length > 0 && (
          <button
            onClick={() => setShowHistoryModal(true)}
            className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[10px] font-bold flex items-center gap-1 shrink-0 transition"
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
              <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm">
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
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2 shadow-sm"
                >
                  <span className="text-xs font-bold text-slate-500">#{index + 1}</span>
                  <span className="text-sm font-extrabold text-amber-300 tracking-wider">{word}</span>
                  <span className="text-[10px] text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
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

      {/* Word Rack Area */}
      <div className="w-full flex-1 flex flex-col items-center justify-center my-2 min-h-[140px]">
        {/* Selected Tiles Rack */}
        <div className={`flex flex-wrap items-center justify-center gap-2 max-w-full min-h-[84px] p-2 border-2 border-dashed rounded-2xl transition-all w-full ${boardThemeClass}`}>
          <AnimatePresence mode="popLayout">
            {selectedCards.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-slate-500 text-xs font-medium tracking-wide flex items-center gap-1.5"
              >
                <Sparkles size={14} className="text-amber-500/70" />
                <span>Harflere dokunarak kelime oluştur</span>
              </motion.div>
            ) : (
              selectedCards.map((card, index) => {
                const rarity = getRarityDetails(card.rarity);
                return (
                  <motion.button
                    key={`${card.id}_slot_${index}`}
                    layout
                    initial={{ scale: 0.7, opacity: 0, y: 15 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.7, opacity: 0, y: -15 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onUnselectCard(index)}
                    className={`w-12 h-16 rounded-xl flex flex-col items-center justify-between p-1 shadow-lg border-2 transition-all relative group cursor-pointer ${
                      card.isSpecial
                        ? 'bg-gradient-to-b from-purple-800 to-indigo-950 border-purple-400 text-purple-200'
                        : 'bg-gradient-to-b from-slate-800 to-slate-900 border-amber-500/80 text-amber-300 shadow-amber-950/40'
                    }`}
                  >
                    {/* Upgrade level badge */}
                    {card.upgradeLevel > 0 && (
                      <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] flex items-center justify-center shadow">
                        +{card.upgradeLevel}
                      </div>
                    )}

                    {/* Top small letter/type indicator */}
                    <span className="text-[9px] font-bold text-slate-400 uppercase">
                      {card.isSpecial ? card.specialType : 'HARF'}
                    </span>

                    {/* Main Letter Glyph */}
                    <span className="text-xl font-extrabold tracking-tight">
                      {card.letter}
                    </span>

                    {/* Points Badge */}
                    <span className="text-[10px] font-black text-amber-400/90">
                      {card.isSpecial ? '★' : card.points}
                    </span>
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
            className={`mt-3 px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 shadow-md ${
              scoreBreakdown.isValid
                ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                : 'bg-rose-950/80 border-rose-500/60 text-rose-300'
            }`}
          >
            {scoreBreakdown.isValid ? (
              <>
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-sm text-emerald-200">{scoreBreakdown.score} Puan</span>
                  <span className="text-[10px] opacity-80">
                    (Taban: {scoreBreakdown.basePoints} + Bonus: +{scoreBreakdown.lengthBonus}
                    {scoreBreakdown.extensionBonus > 0 && ` + Zincir: +${scoreBreakdown.extensionBonus}`}
                    {combo > 1 && ` × ${combo}`})
                  </span>
                </div>
              </>
            ) : (
              <>
                <AlertCircle size={15} className="text-rose-400 shrink-0" />
                <span>Geçersiz Kelime</span>
              </>
            )}
          </motion.div>
        )}
      </div>

      {/* Feedback Message Banner */}
      {feedbackMessage && (
        <div className="text-center text-xs font-semibold text-amber-300 bg-amber-950/40 border border-amber-800/40 px-3 py-1 rounded-full mb-3 shadow-sm animate-pulse">
          {feedbackMessage}
        </div>
      )}

      {/* Action Buttons: KELİMEYİ OYNA & TEMİZLE */}
      <div className="w-full grid grid-cols-4 gap-2">
        <button
          onClick={onClearCards}
          disabled={selectedCards.length === 0}
          className="col-span-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 font-semibold py-3 px-2 rounded-2xl border border-slate-700 transition flex items-center justify-center gap-1 active:scale-95 text-xs"
        >
          <RefreshCw size={14} />
          <span>Temizle</span>
        </button>

        <button
          onClick={onPlayWord}
          disabled={selectedCards.length < 2 || !scoreBreakdown.isValid}
          className={`col-span-3 font-extrabold py-3.5 px-4 rounded-2xl transition flex items-center justify-center gap-2 shadow-lg active:scale-95 text-sm tracking-wide ${
            selectedCards.length >= 2 && scoreBreakdown.isValid
              ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-amber-500/30 animate-pulse-glow'
              : 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Play size={18} className="fill-slate-950" />
          <span>KELİMEYİ OYNA</span>
        </button>
      </div>
    </div>
  );
}

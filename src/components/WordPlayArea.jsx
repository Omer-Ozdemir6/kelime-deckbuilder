import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RefreshCw, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { calculateWordScore } from '../game/wordEngine';
import { getRarityDetails } from '../game/cardData';

export function WordPlayArea({
  selectedCards,
  lastPlayedWord,
  combo,
  onUnselectCard,
  onClearCards,
  onPlayWord,
  feedbackMessage
}) {
  // Real-time projected score calculation
  const scoreBreakdown = calculateWordScore(selectedCards, lastPlayedWord, combo);

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-4 relative overflow-hidden bg-slate-900/40">
      {/* Played Word History / Chain notification */}
      {lastPlayedWord && (
        <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5 bg-slate-950/60 px-3 py-1 rounded-full border border-slate-800/80 mb-1">
          <span className="text-slate-500">Son Kelime:</span>
          <span className="font-bold text-amber-400 tracking-wider">{lastPlayedWord}</span>
        </div>
      )}

      {/* Word Rack Area */}
      <div className="w-full flex-1 flex flex-col items-center justify-center my-2 min-h-[140px]">
        {/* Selected Tiles Rack */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-full min-h-[84px] p-2 bg-slate-950/70 border-2 border-dashed border-slate-700/80 rounded-2xl shadow-inner w-full">
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

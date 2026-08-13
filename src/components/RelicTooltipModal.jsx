import React from 'react';
import { motion } from 'framer-motion';
import { Coins, ArrowLeft, ArrowRight, Trash2, X, Sparkles } from 'lucide-react';
import { RELICS } from '../game/relicData';
import { PASSIVE_JOKERS } from '../game/cardData';
import { soundEngine } from '../game/audioEngine';

export function RelicTooltipModal({
  relicKey,
  activeRelicKeys = [],
  onSell,
  onReorder,
  onClose
}) {
  if (!relicKey) return null;
  const item = PASSIVE_JOKERS[relicKey] || RELICS[relicKey];
  if (!item) return null;

  const currentIndex = activeRelicKeys.indexOf(relicKey);
  const canMoveLeft = currentIndex > 0;
  const canMoveRight = currentIndex !== -1 && currentIndex < activeRelicKeys.length - 1;

  const handleMoveLeft = () => {
    if (!canMoveLeft || !onReorder) return;
    const newOrder = [...activeRelicKeys];
    const temp = newOrder[currentIndex - 1];
    newOrder[currentIndex - 1] = newOrder[currentIndex];
    newOrder[currentIndex] = temp;
    onReorder(newOrder);
  };

  const handleMoveRight = () => {
    if (!canMoveRight || !onReorder) return;
    const newOrder = [...activeRelicKeys];
    const temp = newOrder[currentIndex + 1];
    newOrder[currentIndex + 1] = newOrder[currentIndex];
    newOrder[currentIndex] = temp;
    onReorder(newOrder);
  };

  const handleSellJoker = () => {
    if (onSell) {
      onSell(relicKey);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[300] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        className="w-full max-w-sm bg-gradient-to-b from-purple-950 via-[#0a1124] to-slate-950 border-2 border-purple-400 rounded-3xl p-5 shadow-2xl text-center space-y-4 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900 text-slate-400 hover:text-white border border-slate-700 cursor-pointer"
        >
          <X size={16} />
        </button>

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-purple-900 to-slate-900 border border-purple-400 flex items-center justify-center text-4xl shadow-xl mx-auto">
          {item.icon || '🃏'}
        </div>

        <div>
          <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/50">
            PASİF JOKER İNCELEME
          </span>
          <h3 className="text-lg font-black text-amber-300 font-cinzel mt-1">{item.name}</h3>
          <p className="text-xs text-slate-300 font-medium leading-relaxed bg-slate-950/80 p-3 rounded-2xl border border-slate-800 mt-2">
            {item.desc || item.description || 'Aktif pasif yetenek.'}
          </p>
        </div>

        {/* Action Controls: Sell & Reorder */}
        <div className="pt-2 border-t border-purple-900/60 space-y-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleMoveLeft}
              disabled={!canMoveLeft}
              className={`flex-1 py-2 px-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1 cursor-pointer border ${
                canMoveLeft
                  ? 'bg-purple-900 hover:bg-purple-800 text-purple-200 border-purple-500/60'
                  : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
              }`}
            >
              <ArrowLeft size={14} />
              <span>SOLA TAŞI</span>
            </button>

            <button
              onClick={handleMoveRight}
              disabled={!canMoveRight}
              className={`flex-1 py-2 px-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1 cursor-pointer border ${
                canMoveRight
                  ? 'bg-purple-900 hover:bg-purple-800 text-purple-200 border-purple-500/60'
                  : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
              }`}
            >
              <span>SAĞA TAŞI</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <button
            onClick={handleSellJoker}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs transition flex items-center justify-center gap-1.5 shadow-lg border border-amber-300 cursor-pointer active:scale-95"
          >
            <Coins size={14} />
            <span>💵 PASİF JOKERİ SAT (+$15 ALTIN)</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

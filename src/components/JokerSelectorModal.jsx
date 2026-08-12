import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { TURKISH_ALPHABET } from '../game/wordEngine';

export function JokerSelectorModal({ jokerCard, onSelectLetter, onClose }) {
  if (!jokerCard) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 20 }}
        className="w-full max-w-sm bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/60 rounded-3xl p-5 shadow-2xl flex flex-col items-center text-center text-slate-100 relative overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between w-full border-b border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🃏</span>
            <div className="text-left">
              <h3 className="text-base font-black text-amber-300 font-cinzel">JOKER HARF SEÇİMİ</h3>
              <p className="text-[10px] text-slate-400">Joker kartının hangi harfe dönüşeceğini seç:</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* 29 Turkish Letters Grid */}
        <div className="grid grid-cols-6 gap-1.5 w-full my-2 max-h-[260px] overflow-y-auto pr-1">
          {TURKISH_ALPHABET.map((letter) => (
            <motion.button
              key={letter}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onSelectLetter(letter)}
              className="h-10 rounded-xl bg-slate-950 hover:bg-amber-500/20 border border-slate-700/80 hover:border-amber-400 text-amber-300 font-extrabold text-sm flex items-center justify-center transition shadow-md cursor-pointer"
            >
              {letter}
            </motion.button>
          ))}
        </div>

        <p className="text-[10px] text-amber-400/80 italic mt-2">
          💡 Not: Joker seçilen harfe dönüşür ancak 0 taban puan verir.
        </p>
      </motion.div>
    </div>
  );
}

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronRight } from 'lucide-react';
import { getRandomEvent } from '../game/eventData';

export function EventScreen({ onResolveEvent }) {
  const [eventData] = useState(() => getRandomEvent());

  return (
    <div className="flex-1 flex flex-col justify-between p-5 bg-gradient-to-b from-slate-950 via-purple-950/40 to-slate-950 text-slate-100 overflow-y-auto">
      {/* Event Header */}
      <div className="text-center mt-3">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-16 h-16 rounded-2xl bg-purple-900/60 border border-purple-500/50 flex items-center justify-center text-3xl mx-auto mb-3 shadow-xl animate-float"
        >
          {eventData.icon}
        </motion.div>
        <h2 className="text-lg sm:text-xl font-extrabold text-purple-300 font-cinzel">{eventData.title}</h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed bg-slate-900/90 p-4 rounded-2xl border border-purple-900/50 shadow-inner">
          "{eventData.desc}"
        </p>
      </div>

      {/* Choices List */}
      <div className="flex flex-col gap-3 my-4">
        <div className="flex items-center justify-center gap-1.5 text-xs font-black text-purple-400 uppercase tracking-wider mb-1">
          <Sparkles size={14} />
          <span>BİR SEÇENEK SEÇ:</span>
        </div>

        {eventData.choices.map((choice, idx) => (
          <motion.button
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onResolveEvent(choice.action)}
            className="p-3.5 rounded-2xl border border-purple-800/60 bg-slate-900/90 hover:bg-purple-950/60 text-left transition flex items-center justify-between shadow-md group cursor-pointer"
          >
            <span className="text-xs font-bold text-slate-200 group-hover:text-purple-200 leading-snug">
              {choice.text}
            </span>
            <ChevronRight size={18} className="text-purple-400 shrink-0 group-hover:translate-x-1 transition" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}

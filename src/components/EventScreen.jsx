import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronRight, Compass, ShieldAlert, Award } from 'lucide-react';
import { getRandomEvent } from '../game/eventData';
import { RunicCardFrame } from './RunicCardFrame';

export function EventScreen({ onResolveEvent }) {
  const [eventData] = useState(() => getRandomEvent());

  return (
    <div className="flex-1 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-hidden relative z-20 select-none">
      {/* Ambient background SVG pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
        <svg className="w-full h-full" width="100%" height="100%">
          <pattern id="eventGridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(168, 85, 247, 0.3)" strokeWidth="0.8" />
            <circle cx="40" cy="40" r="1.5" fill="rgba(168, 85, 247, 0.4)" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#eventGridPattern)" />
        </svg>
      </div>

      {/* Centered Mystical Event Card Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg max-h-[90vh] bg-gradient-to-b from-purple-950/95 via-slate-900/98 to-slate-950 rounded-3xl p-5 sm:p-7 border-2 border-purple-500/80 shadow-[0_0_50px_rgba(168,85,247,0.5)] flex flex-col justify-between relative overflow-y-auto scrollbar-none z-10"
      >
        {/* SVG Runic Frame Overlay */}
        <RunicCardFrame rarity="rare" active={true} />

        {/* Event Header Section */}
        <div className="text-center flex flex-col items-center gap-3 relative z-10">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 rounded-2xl bg-purple-900/80 border-2 border-purple-400 flex items-center justify-center text-4xl shadow-2xl relative overflow-hidden"
            style={{ filter: 'url(#neonGlowFilter)' }}
          >
            <span className="relative z-10">{eventData.icon}</span>
          </motion.div>

          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-purple-950 border border-purple-500/50 text-purple-300 shadow">
              🔮 GİZEMLİ OLAY
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-amber-300 font-cinzel tracking-wide">
              {eventData.title}
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/80 p-4 rounded-2xl border border-purple-800/60 shadow-inner font-medium text-center w-full">
            "{eventData.desc}"
          </p>
        </div>

        {/* Choices List */}
        <div className="flex flex-col gap-3 mt-5 relative z-10">
          <div className="flex items-center justify-center gap-1.5 text-xs font-black text-purple-300 uppercase tracking-wider mb-1">
            <Sparkles size={15} className="text-amber-400 animate-pulse" />
            <span>KADERİNİ SEÇ:</span>
          </div>

          {eventData.choices.map((choice, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.12 }}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onResolveEvent(choice.action)}
              className="p-4 rounded-2xl border-2 border-purple-500/60 bg-gradient-to-r from-slate-900 via-purple-950/80 to-slate-900 hover:from-purple-900/90 hover:to-indigo-950 text-left transition flex items-center justify-between shadow-xl group cursor-pointer active:scale-95"
            >
              <span className="text-xs sm:text-sm font-black text-slate-100 group-hover:text-amber-300 leading-snug">
                {choice.text}
              </span>
              <ChevronRight size={20} className="text-amber-400 shrink-0 group-hover:translate-x-1 transition" />
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

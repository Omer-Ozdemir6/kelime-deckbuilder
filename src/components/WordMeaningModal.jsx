import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, X, Sparkles, Check, Bookmark } from 'lucide-react';
import { RunicCardFrame } from './RunicCardFrame';

// Custom 3D SVG Codex Book Crest Component for TDK Modal
function TdkBookSvgCrest() {
  return (
    <div className="relative flex items-center justify-center shrink-0">
      <div className="absolute w-12 h-12 rounded-full bg-amber-500/25 blur-md pointer-events-none" />
      <svg className="w-10 h-10 drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="44" fill="#451a03" stroke="#f59e0b" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="36" fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4 2" />
        {/* Open Codex Book */}
        <path d="M22 62 Q50 72 78 62 L78 38 Q50 48 22 38 Z" fill="#fffbeb" stroke="#b45309" strokeWidth="2" />
        <line x1="50" y1="42" x2="50" y2="67" stroke="#dc2626" strokeWidth="3" />
        {/* Feather Quill */}
        <path d="M55 22 C45 30, 48 45, 62 48" stroke="#fef08a" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function WordMeaningModal({ meaningData, onClose }) {
  if (!meaningData) return null;

  const { word, originalWord, isStemMatched, found, meanings } = meaningData;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-4 bg-slate-950/95 backdrop-blur-2xl select-none">
      {/* Background SVG Rays */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25 z-0">
        <svg className="w-[700px] h-[700px] text-amber-500/30 animate-spin-slow" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="6 3" />
          <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <polygon points="100,20 180,100 100,180 20,100" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 15 }}
        className="w-full max-w-lg bg-slate-950/95 border-4 border-amber-500/80 rounded-3xl p-5 sm:p-6 shadow-[0_0_60px_rgba(245,158,11,0.4)] flex flex-col gap-4 relative z-10 backdrop-blur-2xl text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Runic Card Frame Overlay */}
        <RunicCardFrame rarity="legendary" active={true} />

        {/* HEADER BAR */}
        <div className="flex items-center justify-between border-b-2 border-slate-800/90 pb-3 z-10">
          <div className="flex items-center gap-3">
            <TdkBookSvgCrest />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="px-3 py-0.5 rounded-full bg-amber-950 border border-amber-400/60 text-amber-300 text-[10px] font-black tracking-widest uppercase flex items-center gap-1">
                  <Sparkles size={11} className="text-amber-400" />
                  <span>TDK GÜNCEL TÜRKÇE SÖZLÜK</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                {found ? 'Türk Dil Kurumu resmi tanımı ve kullanım örnekleri:' : 'Sözlük tanımı bulunamadı.'}
              </p>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border-2 border-slate-700 flex items-center justify-center transition cursor-pointer shadow-md"
            title="Kapat"
          >
            <X size={18} />
          </motion.button>
        </div>

        {/* WORD TITLE BANNER */}
        <div className="z-10 bg-slate-900/90 border-2 border-amber-500/60 rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-baseline gap-3">
            <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 font-cinzel tracking-wider drop-shadow-md">
              {originalWord}
            </h2>
            {isStemMatched && (
              <span className="text-xs font-black px-2.5 py-0.5 bg-slate-950 text-cyan-300 border border-cyan-500/50 rounded-full font-mono">
                Kök: {word}
              </span>
            )}
          </div>
          <span className="text-2xl opacity-80">📖</span>
        </div>

        {/* MEANINGS LIST CONTAINER */}
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1 z-10 scrollbar-thin">
          {meanings && meanings.length > 0 ? (
            meanings.map((m, idx) => (
              <div
                key={idx}
                className="bg-slate-900/90 border-2 border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 space-y-2.5 transition-all shadow-md"
              >
                <div className="flex items-start gap-3">
                  <span className="shrink-0 w-7 h-7 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/60 text-xs font-black flex items-center justify-center font-mono shadow-inner">
                    {idx + 1}
                  </span>
                  <div className="flex-1 space-y-1">
                    {m.type && (
                      <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-500/60 rounded-md shadow-sm">
                        {m.type}
                      </span>
                    )}
                    <p className="text-sm text-slate-100 leading-relaxed font-semibold">
                      {m.anlam}
                    </p>
                  </div>
                </div>

                {/* Example sentence if available */}
                {m.example && (
                  <div className="ml-10 pl-3 border-l-2 border-amber-500/50 text-xs italic text-slate-300 space-y-1 bg-slate-950/60 p-2.5 rounded-r-xl border-r border-slate-800">
                    <p className="leading-snug">"{m.example}"</p>
                    {m.author && (
                      <p className="text-[10px] text-amber-400 font-black not-italic flex items-center gap-1">
                        <Bookmark size={11} />
                        <span>— {m.author}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400 italic text-center py-4">Anlam bilgisi mevcut değil.</p>
          )}
        </div>

        {/* FOOTER ACTION BUTTON */}
        <div className="pt-1 flex justify-end z-10">
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm rounded-2xl transition shadow-xl shadow-amber-500/30 tracking-wider border-2 border-yellow-100 cursor-pointer flex items-center justify-center gap-2"
          >
            <Check size={18} />
            <span>ANLAŞILDI</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

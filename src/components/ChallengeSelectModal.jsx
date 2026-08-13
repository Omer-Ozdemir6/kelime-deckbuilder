import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Swords, Trophy, Sparkles, ChevronRight, X, Lock, Check } from 'lucide-react';
import { soundEngine } from '../game/audioEngine';
import { PRESET_CHALLENGE_RUNS } from '../game/challengeRunsData';

export function ChallengeSelectModal({ onSelectChallenge, onClose }) {
  const [selectedId, setSelectedId] = useState(PRESET_CHALLENGE_RUNS[0].id);
  const selectedChallenge = PRESET_CHALLENGE_RUNS.find(c => c.id === selectedId) || PRESET_CHALLENGE_RUNS[0];

  const handleStart = () => {
    soundEngine.playSuccess();
    if (onSelectChallenge) {
      onSelectChallenge(selectedChallenge);
    }
  };

  return (
    <div className="fixed inset-0 z-[400] bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between p-5 select-none overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400 flex items-center justify-center text-purple-300">
            <Swords size={22} />
          </div>
          <div>
            <h2 className="text-base font-black text-purple-300 font-cinzel">ÖZEL MEYDAN OKUMA MODLARI</h2>
            <p className="text-[11px] text-slate-400 font-medium">Farklı kural setleriyle hazırlanmış Balatro senaryoları.</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Challenge Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
        {PRESET_CHALLENGE_RUNS.map((c) => {
          const isSelected = c.id === selectedId;

          return (
            <motion.div
              key={c.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                soundEngine.playTap();
                setSelectedId(c.id);
              }}
              className={`p-4 rounded-3xl border-2 transition-all flex flex-col justify-between cursor-pointer relative shadow-xl bg-gradient-to-b ${
                isSelected
                  ? 'border-purple-400 ring-2 ring-purple-400/50 bg-slate-900 shadow-[0_0_25px_rgba(168,85,247,0.3)]'
                  : 'border-slate-800 bg-slate-950 opacity-70 hover:opacity-100'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl filter drop-shadow">{c.icon}</span>
                  {isSelected && (
                    <span className="bg-purple-400 text-slate-950 p-1 rounded-full text-xs font-black shadow-md">
                      <Check size={14} />
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-black text-amber-300 font-cinzel flex items-center gap-1.5">
                  <span>{c.title}</span>
                </h3>

                <p className="text-[11px] text-slate-300 font-medium leading-relaxed bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800/80 mt-2 text-left">
                  {c.desc}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-black text-purple-300">
                <span>Başlangıç Altını: +${c.starterGold} 💰</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Confirm Action Button */}
      <div className="pt-3 border-t border-slate-800">
        <button
          onClick={handleStart}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black transition flex items-center justify-center gap-2 shadow-2xl shadow-purple-950/50 text-sm tracking-wider border border-purple-400/50 cursor-pointer"
        >
          <span>{selectedChallenge.title} MODUNU BAŞLAT</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

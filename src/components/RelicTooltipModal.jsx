import React from 'react';
import { Sparkles, X, Shield, Zap } from 'lucide-react';
import { RELICS } from '../game/relicData';

export function RelicTooltipModal({ relicKey, onClose }) {
  if (!relicKey) return null;
  const relic = RELICS[relicKey];
  if (!relic) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-sm bg-gradient-to-b from-purple-950 via-slate-900 to-slate-950 border-2 border-purple-400/80 rounded-3xl p-5 shadow-[0_0_40px_rgba(168,85,247,0.3)] text-slate-100 space-y-4 transform transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Badge */}
        <div className="flex items-center justify-between border-b border-purple-900/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 border border-purple-400/40 rounded-full text-xs font-black tracking-wider flex items-center gap-1.5">
              <Sparkles size={12} className="text-purple-400" /> KUTSAL EMANET (RELIC)
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
            title="Kapat"
          >
            <X size={16} />
          </button>
        </div>

        {/* Relic Icon & Title */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-900/40 border border-purple-400/60 text-3xl flex items-center justify-center shadow-lg shadow-purple-950/80 shrink-0">
            {relic.icon}
          </div>
          <div className="space-y-0.5">
            <h3 className="text-lg font-black text-purple-200 tracking-wide font-cinzel">{relic.name}</h3>
            <span className="text-[11px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-700/50">
              Pasif Etki Aktif
            </span>
          </div>
        </div>

        {/* Description Box */}
        <div className="bg-slate-950/80 border border-purple-900/50 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400 uppercase tracking-wider">
            <Zap size={14} />
            <span>Özel Güç Açıklaması</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed font-medium">
            {relic.description}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-2xl transition shadow-lg shadow-purple-600/30"
        >
          Tamam
        </button>
      </div>
    </div>
  );
}

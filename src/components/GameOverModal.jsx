import React from 'react';
import { RotateCcw, Trophy, Star } from 'lucide-react';

export function GameOverModal({ stage, currentScore, starPoints, onRestart }) {
  return (
    <div className="absolute inset-0 bg-slate-950/95 z-50 flex flex-col items-center justify-between p-6 backdrop-blur-md animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center text-center my-auto">
        <div className="w-16 h-16 rounded-full bg-rose-950 border-2 border-rose-600 flex items-center justify-center text-3xl mb-3 shadow-lg shadow-rose-950">
          💀
        </div>

        <h2 className="text-2xl font-black text-rose-400 tracking-tight">TUR ELENDİ!</h2>
        <p className="text-xs text-slate-400 mt-1">Harf hamleniz bitti ama desteniz ve deneyiminiz gelişiyor.</p>

        {/* Stats card */}
        <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 my-6 flex flex-col gap-3 shadow-inner">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Ulaşılan Kademe:</span>
            <span className="font-extrabold text-amber-400 text-sm">KADEME {stage}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Son Bölüm Puanı:</span>
            <span className="font-extrabold text-emerald-400 text-sm">{currentScore} Puan</span>
          </div>

          <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800">
            <span className="text-slate-400 flex items-center gap-1">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <span>Toplam Yıldız:</span>
            </span>
            <span className="font-extrabold text-amber-300 text-sm">{starPoints} Yıldız</span>
          </div>
        </div>
      </div>

      <button
        onClick={onRestart}
        className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black py-4 px-6 rounded-2xl transition flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 active:scale-95 text-sm"
      >
        <RotateCcw size={18} />
        <span>YENİDEN DENE</span>
      </button>
    </div>
  );
}

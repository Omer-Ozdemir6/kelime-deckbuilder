import React from 'react';
import { Compass, ShieldAlert, ShoppingBag, Sparkles, ChevronRight, Star, Coins } from 'lucide-react';

export function MapScreen({
  mapNodes,
  currentNodeIndex,
  gold,
  starPoints,
  onSelectNode
}) {
  const activeNode = mapNodes[currentNodeIndex] || mapNodes[0];

  return (
    <div className="flex-1 flex flex-col justify-between p-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 overflow-y-auto">
      {/* Map Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Compass size={22} className="text-amber-400 animate-spin-slow" />
          <div>
            <h2 className="text-base font-extrabold text-amber-300">1. BÖLGE HARİTASI</h2>
            <p className="text-[10px] text-slate-400">İlerlemek için sıradaki düğüme gir.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-amber-950/60 border border-amber-800/60 px-2.5 py-1 rounded-lg text-xs font-bold text-amber-300">
            <Coins size={14} className="text-amber-400" />
            <span>{gold} 💰</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-300">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span>{starPoints}</span>
          </div>
        </div>
      </div>

      {/* Vertical Path of Map Nodes */}
      <div className="flex-1 my-4 flex flex-col gap-3 overflow-y-auto px-2 py-1">
        {mapNodes.map((node, index) => {
          const isCompleted = index < currentNodeIndex;
          const isCurrent = index === currentNodeIndex;
          const isFuture = index > currentNodeIndex;

          return (
            <div
              key={node.id}
              onClick={() => {
                if (isCurrent) onSelectNode(node);
              }}
              className={`p-3 rounded-2xl border-2 transition flex items-center justify-between ${
                isCurrent
                  ? 'border-amber-400 bg-amber-950/50 shadow-lg shadow-amber-950/50 scale-[1.02] cursor-pointer animate-pulse-glow'
                  : isCompleted
                  ? 'border-slate-800 bg-slate-900/60 opacity-60'
                  : 'border-slate-900 bg-slate-950/40 opacity-40 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold border ${
                  isCurrent ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-slate-800 border-slate-700'
                }`}>
                  {node.icon}
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-100">{node.title}</span>
                    {isCurrent && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-wider">
                        BURADASIN
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 line-clamp-1">{node.desc}</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {isCompleted && <span className="text-xs font-bold text-emerald-400">✓ Geçildi</span>}
                {isCurrent && <ChevronRight size={20} className="text-amber-400 animate-bounce" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Enter Active Node Button */}
      <button
        onClick={() => onSelectNode(activeNode)}
        className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black py-4 px-6 rounded-2xl transition flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 active:scale-95 text-base tracking-wide"
      >
        <span>NOKTAYA GİR ({activeNode.icon} {activeNode.type})</span>
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

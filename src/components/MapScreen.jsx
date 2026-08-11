import React, { useState } from 'react';
import { Compass, ChevronRight, Star, Coins, ArrowUp, Lock, CheckCircle2 } from 'lucide-react';

export function MapScreen({
  mapFloors = [],
  currentFloorIndex = 0,
  gold,
  starPoints,
  onSelectNode,
  onOpenMainMenu
}) {
  const currentFloor = mapFloors[currentFloorIndex] || mapFloors[0] || [];
  const [selectedBranchIndex, setSelectedBranchIndex] = useState(0);

  const selectedNode = currentFloor[selectedBranchIndex] || currentFloor[0];

  return (
    <div className="flex-1 flex flex-col justify-between p-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 overflow-y-auto">
      {/* Map Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Compass size={22} className="text-amber-400" />
          <div>
            <h2 className="text-base font-extrabold text-amber-300">ROGULITE HARİTASI</h2>
            <p className="text-[10px] text-slate-400">Kat: {currentFloorIndex + 1} / {mapFloors.length} — İstediğin yolu seç!</p>
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

          {onOpenMainMenu && (
            <button
              onClick={onOpenMainMenu}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition active:scale-95 ml-1"
              title="Ana Menüye Dön"
            >
              🏠
            </button>
          )}
        </div>
      </div>

      {/* Vertical Branching Tree View (Reversed: Top floor at top, Floor 0 at bottom) */}
      <div className="flex-1 my-3 flex flex-col-reverse gap-4 overflow-y-auto px-1 py-2">
        {mapFloors.map((floorNodes, floorIdx) => {
          const isCompleted = floorIdx < currentFloorIndex;
          const isCurrent = floorIdx === currentFloorIndex;
          const isFuture = floorIdx > currentFloorIndex;

          return (
            <div key={`floor_${floorIdx}`} className="flex flex-col gap-1">
              {/* Floor Label */}
              <div className="flex items-center justify-center gap-2 text-[10px] font-extrabold tracking-wider text-slate-500 uppercase">
                <div className="h-[1px] bg-slate-800 flex-1" />
                <span>{floorIdx === mapFloors.length - 1 ? '👑 BOSS KATI' : `KAT ${floorIdx + 1}`}</span>
                <div className="h-[1px] bg-slate-800 flex-1" />
              </div>

              {/* Floor Branch Choices (Side by side) */}
              <div className={`grid gap-2.5 ${floorNodes.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {floorNodes.map((node, branchIdx) => {
                  const isNodeSelected = isCurrent && selectedBranchIndex === branchIdx;

                  return (
                    <div
                      key={node.id}
                      onClick={() => {
                        if (isCurrent) setSelectedBranchIndex(branchIdx);
                      }}
                      className={`p-3 rounded-2xl border-2 transition-all flex flex-col justify-between relative cursor-pointer ${
                        isNodeSelected
                          ? 'border-amber-400 bg-amber-950/60 shadow-lg shadow-amber-950/60 ring-2 ring-amber-400/40 scale-[1.02]'
                          : isCurrent
                          ? 'border-amber-500/40 bg-slate-900/90 hover:border-amber-400/60'
                          : isCompleted
                          ? 'border-slate-800/80 bg-slate-950/50 opacity-50'
                          : 'border-slate-900 bg-slate-950/30 opacity-30 cursor-not-allowed'
                      }`}
                    >
                      {/* Current Floor Pick Indicator */}
                      {isNodeSelected && (
                        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.2 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow">
                          SEÇİLDİ
                        </div>
                      )}

                      <div className="flex items-start gap-2.5">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold border shrink-0 ${
                          isCurrent ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-slate-800 border-slate-700'
                        }`}>
                          {node.icon}
                        </div>

                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-extrabold text-slate-100 truncate">{node.title}</span>
                          <span className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-tight">{node.desc}</span>
                        </div>
                      </div>

                      {/* Bottom status / objective info */}
                      <div className="mt-2 pt-1 border-t border-slate-800/50 flex items-center justify-between text-[10px]">
                        {node.bonusObjective && (
                          <span className="text-amber-400 font-bold flex items-center gap-1">
                            ⭐ Bonus: +{node.bonusObjective.rewardGold}💰
                          </span>
                        )}
                        {isCompleted && (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 size={11} /> Geçildi
                          </span>
                        )}
                        {isFuture && (
                          <span className="text-slate-600 flex items-center gap-1">
                            <Lock size={10} /> Kilitli
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Enter Selected Branch Node Button */}
      {selectedNode && (
        <button
          onClick={() => onSelectNode(selectedNode)}
          className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black py-3.5 px-6 rounded-2xl transition flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 active:scale-95 text-sm tracking-wide"
        >
          <span>SEÇİLEN YOLA GİR ({selectedNode.icon} {selectedNode.title})</span>
          <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
}


import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, ChevronRight, Star, Coins, Lock, CheckCircle2, Sparkles, Zap } from 'lucide-react';

// Node type display config
const NODE_TYPE_CONFIG = {
  NORMAL:           { label: 'Kelime Sınavı', color: 'text-slate-300', bg: 'bg-slate-800/80', border: 'border-slate-700' },
  SPECIAL_OBJECTIVE:{ label: 'Özel Sınav',    color: 'text-cyan-300',   bg: 'bg-cyan-950/50', border: 'border-cyan-700/60' },
  ELITE:            { label: '⚔️ ELİT SINAV', color: 'text-red-300',    bg: 'bg-red-950/50',  border: 'border-red-700/60' },
  SHOP:             { label: '🏪 Çarşı',       color: 'text-amber-300',  bg: 'bg-amber-950/50',border: 'border-amber-700/60' },
  EVENT:            { label: '❓ Olay',         color: 'text-purple-300', bg: 'bg-purple-950/50',border:'border-purple-700/60' },
  TREASURE:         { label: '💰 Hazine',       color: 'text-yellow-300', bg: 'bg-yellow-950/50',border:'border-yellow-700/60' },
  BOSS:             { label: '👑 BOSS',          color: 'text-rose-300',   bg: 'bg-rose-950/50', border: 'border-rose-500/80' }
};

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
    <div className="flex-1 flex flex-col justify-between p-4 bg-gradient-to-b from-slate-950 via-[#0a0f1d] to-slate-950 text-slate-100 overflow-y-auto">
      {/* Map Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300">
            <Compass size={18} />
          </div>
          <div>
            <h2 className="text-base font-black text-amber-300 font-cinzel tracking-wide">ROGULİTE HARİTASI</h2>
            <p className="text-[10px] text-slate-400 font-medium">Kat: {currentFloorIndex + 1} / {mapFloors.length} — Dalı seç ve ilerle!</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-amber-950/80 border border-amber-500/40 px-2.5 py-1.5 rounded-2xl text-xs font-black text-amber-300">
            <Coins size={13} className="text-amber-400 fill-amber-400" />
            <span>{gold}</span>
          </div>
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 px-2.5 py-1.5 rounded-2xl text-xs font-black text-amber-300">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span>{starPoints}</span>
          </div>
          {onOpenMainMenu && (
            <button
              onClick={onOpenMainMenu}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition active:scale-95"
              title="Ana Menüye Dön"
            >
              🏠
            </button>
          )}
        </div>
      </div>

      {/* Vertical Branching Tree View */}
      <div className="flex-1 my-3 flex flex-col gap-3 overflow-y-auto px-1 py-2">
        {mapFloors.map((floorNodes, floorIdx) => {
          const isCompleted = floorIdx < currentFloorIndex;
          const isCurrent = floorIdx === currentFloorIndex;
          const isFuture = floorIdx > currentFloorIndex;
          const isBoss = floorIdx === mapFloors.length - 1;

          // Pick biome from first node on this floor
          const floorBiome = floorNodes[0]?.biome;
          const floorModifier = floorNodes[0]?.modifier;

          const biomeAccent = floorBiome?.accentColor || 'text-amber-400';
          const biomeBorder = floorBiome?.borderColor || 'border-amber-500/50';
          const biomeBg = floorBiome?.id === 'EMERALD_FOREST' ? 'bg-emerald-950/40' :
                          floorBiome?.id === 'CYAN_LIBRARY' ? 'bg-cyan-950/40' :
                          floorBiome?.id === 'PURPLE_THEATRE' ? 'bg-purple-950/40' :
                          floorBiome?.id === 'VOLCANO_ARENA' ? 'bg-red-950/40' :
                          floorBiome?.id === 'COSMIC_PEAK' ? 'bg-amber-950/60' :
                          'bg-slate-900/80';

          return (
            <div key={`floor_${floorIdx}`} className="flex flex-col gap-1.5">
              {/* Floor Label + Biome badge */}
              <div className="flex items-center gap-2 text-[10px] font-black tracking-wider uppercase">
                <div className="h-[1px] bg-slate-800/80 flex-1" />
                <span className={isBoss ? 'text-rose-400' : isCurrent ? biomeAccent : 'text-slate-600'}>
                  {isBoss ? '👑 BOSS KATI' : `KAT ${floorIdx + 1}`}
                </span>
                {floorBiome && (isCurrent || isCompleted) && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${biomeAccent} ${biomeBg} border ${biomeBorder}`}>
                    {floorBiome.icon} {floorBiome.name}
                  </span>
                )}
                {floorModifier && isCurrent && (
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black text-yellow-300 bg-yellow-950/50 border border-yellow-700/50">
                    {floorModifier.icon} {floorModifier.name}
                  </span>
                )}
                <div className="h-[1px] bg-slate-800/80 flex-1" />
              </div>

              {/* Floor Branch Choices */}
              <div className={`grid gap-2.5 ${floorNodes.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {floorNodes.map((node, branchIdx) => {
                  const isNodeSelected = isCurrent && selectedBranchIndex === branchIdx;
                  const typeCfg = NODE_TYPE_CONFIG[node.type] || NODE_TYPE_CONFIG.NORMAL;

                  // Dynamic border/bg for current nodes, using biome
                  const nodeSelectedStyle = isNodeSelected
                    ? `${biomeBorder.replace('/50', '')} ${biomeBg} shadow-lg scale-[1.02] ring-1 ${biomeBorder}`
                    : isCurrent
                    ? `border-slate-700/80 bg-slate-900/80 hover:${biomeBorder} hover:bg-slate-800/80`
                    : isCompleted
                    ? 'border-slate-800/60 bg-slate-950/40 opacity-50'
                    : 'border-slate-900/60 bg-slate-950/20 opacity-25 cursor-not-allowed';

                  return (
                    <motion.div
                      key={node.id}
                      initial={isCurrent ? { opacity: 0, y: 6 } : false}
                      animate={isCurrent ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: branchIdx * 0.08 }}
                      onClick={() => { if (isCurrent) setSelectedBranchIndex(branchIdx); }}
                      className={`p-3 rounded-2xl border-2 transition-all flex flex-col justify-between relative cursor-pointer ${nodeSelectedStyle}`}
                    >
                      {/* Selected indicator */}
                      {isNodeSelected && (
                        <div className={`absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full ${biomeBg} ${biomeAccent} font-black text-[9px] uppercase tracking-wider shadow border ${biomeBorder}`}>
                          SEÇİLDİ ✓
                        </div>
                      )}

                      <div className="flex items-start gap-2.5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border shrink-0 ${
                          isCurrent ? `${biomeBg} ${biomeBorder} ${biomeAccent}` : 'bg-slate-800 border-slate-700'
                        }`}>
                          {node.icon}
                        </div>

                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-xs font-extrabold text-slate-100 truncate leading-tight">{node.title}</span>
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded mt-1 w-fit ${typeCfg.color} ${typeCfg.bg} border ${typeCfg.border}`}>
                            {typeCfg.label}
                          </span>
                          {node.desc && (
                            <span className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-tight">{node.desc}</span>
                          )}
                        </div>
                      </div>

                      {/* Bottom status / modifier row */}
                      <div className="mt-2 pt-1.5 border-t border-slate-800/40 flex items-center justify-between text-[10px]">
                        {node.bonusObjective && (
                          <span className="text-amber-400 font-black flex items-center gap-1">
                            <Sparkles size={10} /> +{node.bonusObjective.rewardGold}💰 Bonus
                          </span>
                        )}
                        {node.targetScore && (
                          <span className="text-slate-400 font-bold ml-auto">🎯 {node.targetScore} Puan</span>
                        )}
                        {isCompleted && (
                          <span className="text-emerald-400 font-black flex items-center gap-1 ml-auto">
                            <CheckCircle2 size={11} /> Geçildi
                          </span>
                        )}
                        {isFuture && (
                          <span className="text-slate-700 flex items-center gap-1">
                            <Lock size={10} /> Kilitli
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Enter Selected Node Button */}
      {selectedNode && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => onSelectNode(selectedNode)}
          className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black py-4 px-6 rounded-2xl transition flex items-center justify-center gap-2 shadow-2xl shadow-amber-500/30 active:scale-95 text-sm tracking-wide border border-amber-300 animate-pulse-glow"
        >
          <span>{selectedNode.icon} {selectedNode.title} — GİR</span>
          <ChevronRight size={18} />
        </motion.button>
      )}
    </div>
  );
}

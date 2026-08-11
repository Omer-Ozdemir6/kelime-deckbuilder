import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Compass, Star, Coins, Lock, CheckCircle2, Sparkles, Home, ChevronRight, EyeOff } from 'lucide-react';
import { REGIONAL_BIOMES } from '../game/mapGenerator';

const NODE_TYPE_CONFIG = {
  NORMAL:            { label: 'Kelime Sınavı', color: 'text-slate-300', bg: 'bg-slate-900/90', border: 'border-slate-700' },
  SPECIAL_OBJECTIVE: { label: 'Özel Sınav',    color: 'text-cyan-300',   bg: 'bg-cyan-950/80', border: 'border-cyan-700/60' },
  ELITE:             { label: '⚔️ ELİT SINAV', color: 'text-red-300',    bg: 'bg-red-950/80',  border: 'border-red-700/60' },
  SHOP:              { label: '🏪 Çarşı',       color: 'text-amber-300',  bg: 'bg-amber-950/80',border: 'border-amber-700/60' },
  EVENT:             { label: '❓ Olay',         color: 'text-purple-300', bg: 'bg-purple-950/80',border:'border-purple-700/60' },
  TRIVIA:            { label: '💡 Bilmece',     color: 'text-yellow-300', bg: 'bg-yellow-950/80',border:'border-yellow-700/60' },
  TREASURE:          { label: '💰 Hazine',       color: 'text-yellow-300', bg: 'bg-yellow-950/80',border:'border-yellow-700/60' },
  CAMP:              { label: '🏕️ SON KAMP',     color: 'text-emerald-300',bg: 'bg-emerald-950/90',border:'border-emerald-500/80' },
  BOSS:              { label: '👑 BOSS',          color: 'text-rose-300',   bg: 'bg-rose-950/90', border: 'border-rose-500/80' }
};

const PATH_CATEGORY_CONFIG = {
  SAFE:    { label: '🟢 Güvenli Yol', badge: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300' },
  RISK:    { label: '🔴 Riskli Yol',  badge: 'bg-rose-950/80 border-rose-500/40 text-rose-300' },
  BUILD:   { label: '🔵 Build Yolu',  badge: 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300' },
  MYSTERY: { label: '🟣 Gizem Yolu', badge: 'bg-purple-950/80 border-purple-500/40 text-purple-300' }
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
  const [isConfirmingNode, setIsConfirmingNode] = useState(false);

  const selectedNode = currentFloor[selectedBranchIndex] || currentFloor[0];

  const currentBiome = selectedNode?.biome || currentFloor[0]?.biome;
  const currentModifier = selectedNode?.modifier || currentFloor[0]?.modifier;

  const activeFloorRef = useRef(null);
  const containerRef = useRef(null);

  // Mouse Click-and-Drag State
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  // Auto-scroll vertically & horizontally to active node
  useEffect(() => {
    if (activeFloorRef.current) {
      setTimeout(() => {
        activeFloorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      }, 100);
    }
  }, [currentFloorIndex]);

  // Mouse Drag Handlers
  const handleMouseDown = (e) => {
    if (!containerRef.current) return;
    setIsMouseDown(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setStartY(e.pageY - containerRef.current.offsetTop);
    setScrollLeft(containerRef.current.scrollLeft);
    setScrollTop(containerRef.current.scrollTop);
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const y = e.pageY - containerRef.current.offsetTop;
    const walkX = (x - startX) * 1.5;
    const walkY = (y - startY) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walkX;
    containerRef.current.scrollTop = scrollTop - walkY;
  };

  const handleMouseUpOrLeave = () => {
    setIsMouseDown(false);
  };

  // Confirm Node Button Click Sequence:
  // Step 1: Green line fills from 0 to 1 over 800ms
  // Step 2: AFTER green line finishes filling 100%, trigger screen transition!
  const handleConfirmNodeClick = () => {
    if (isConfirmingNode || !selectedNode) return;
    setIsConfirmingNode(true);

    setTimeout(() => {
      onSelectNode(selectedNode);
    }, 850);
  };

  // Map 5-Column Grid Layout Dimensions
  const colWidth = 115; // 115px per column
  const rowHeight = 110; // 110px per floor layer

  // Helper to compute (X, Y) center position for any node
  const getNodeCoordinates = (colIdx, floorIdx) => {
    const xCol = colIdx !== undefined ? colIdx : 2;
    const x = xCol * colWidth + 60;
    const y = floorIdx * rowHeight + rowHeight / 2 + 10;
    return { x, y };
  };

  return (
    <div className={`flex-1 flex flex-col justify-between p-3.5 bg-gradient-to-b ${currentBiome?.themeClass || 'from-slate-950 via-[#0a0f1d] to-slate-950'} text-slate-100 overflow-hidden relative transition-all duration-700 select-none`}>
      {/* Top Fixed Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 shrink-0 z-20 bg-slate-950/90 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-md">
            <Compass size={18} />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black text-amber-300 font-cinzel tracking-wide">
              SÖZ DİYARI ELMAS HARİTASI
            </h2>
            <p className="text-[10px] text-slate-400 font-medium">
              Kat {currentFloorIndex + 1} / {mapFloors.length} — Rotaları & Biyomları Keşfet!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 bg-amber-950/80 border border-amber-500/40 px-2 py-1 rounded-xl text-xs font-black text-amber-300 shadow-sm">
            <Coins size={12} className="text-amber-400 fill-amber-400" />
            <span>{gold}</span>
          </div>
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 px-2 py-1 rounded-xl text-xs font-black text-amber-300 shadow-sm">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span>{starPoints}</span>
          </div>
          {onOpenMainMenu && (
            <button
              onClick={onOpenMainMenu}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition active:scale-95 shadow-sm"
              title="Ana Menüye Dön"
            >
              <Home size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Active Biome & Region Modifier Clue Banner */}
      {(currentBiome || currentModifier) && (
        <div className="mt-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2 shadow-inner shrink-0 z-20 animate-fade-in">
          {currentBiome && (
            <div className={`flex items-center gap-1.5 text-xs font-black ${currentBiome.accentColor}`}>
              <span className="text-base">{currentBiome.icon}</span>
              <span>{currentBiome.name}</span>
            </div>
          )}
          {currentModifier && (
            <div className="flex items-center gap-1 text-[11px] font-extrabold text-yellow-300 bg-yellow-950/60 px-2 py-0.5 rounded-lg border border-yellow-700/50">
              <span>{currentModifier.icon}</span>
              <span>{currentModifier.desc || currentModifier.name}</span>
            </div>
          )}
        </div>
      )}

      {/* 2D FREE PAN / SCROLL CANVAS CONTAINER */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={`flex-1 my-2 overflow-auto scrollbar-thin relative touch-pan-x touch-pan-y p-3 rounded-2xl bg-slate-950/70 border border-slate-900 ${
          isMouseDown ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        <div
          className="relative min-w-[620px]"
          style={{ height: `${mapFloors.length * rowHeight + 70}px` }}
        >
          {/* Top Column Regional Biome Clues Bar */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-around px-3 z-20 pointer-events-none">
            {REGIONAL_BIOMES.map((b) => (
              <div
                key={b.id}
                className={`w-24 sm:w-28 p-1 rounded-xl border text-center flex flex-col items-center justify-center bg-slate-950/90 shadow-md ${b.borderColor}`}
              >
                <span className="text-[10px] font-black text-slate-200 flex items-center gap-1">
                  <span>{b.icon}</span>
                  <span className="truncate">{b.name.replace(/[^a-zA-ZĞÜŞİÖÇğüşiöç\s]/g, '').trim()}</span>
                </span>
                <span className="text-[7px] text-slate-400 font-bold truncate max-w-full">
                  {b.modifier.name}
                </span>
              </div>
            ))}
          </div>

          {/* SVG Tree Connecting Lines Overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {mapFloors.map((floorNodes, floorIdx) => {
              if (floorIdx >= mapFloors.length - 1) return null;

              const isCompletedFloor = floorIdx < currentFloorIndex;
              const isCurrentFloorLayer = floorIdx === currentFloorIndex - 1;
              const isCurrentFloor = floorIdx === currentFloorIndex;
              const isFogged = floorIdx > currentFloorIndex + 2;

              if (isFogged) return null;

              // 1. Past Completed Green Paths (< currentFloorIndex - 1)
              if (isCompletedFloor && !isCurrentFloorLayer) {
                const parentNode = floorNodes.find(n => n.completed) || floorNodes[0];
                const nextFloorNodes = mapFloors[floorIdx + 1] || [];
                const childNode = nextFloorNodes.find(n => n.completed) || nextFloorNodes[0];

                if (!parentNode || !childNode) return null;

                const parentPos = getNodeCoordinates(parentNode.colIndex, floorIdx);
                const childPos = getNodeCoordinates(childNode.colIndex, floorIdx + 1);
                const pathD = `M ${parentPos.x} ${parentPos.y + 40} C ${parentPos.x} ${parentPos.y + 70}, ${childPos.x} ${childPos.y + 10}, ${childPos.x} ${childPos.y + 40}`;

                return (
                  <g key={`group_completed_f${floorIdx}`}>
                    <path d={pathD} fill="none" stroke="#050811" strokeWidth="7" strokeLinecap="round" />
                    <path d={pathD} fill="none" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" opacity={0.9} />
                  </g>
                );
              }

              // 2. Line from Previous Floor to Currently Selected Node (Floor N-1 to Floor N)
              if (isCurrentFloorLayer && selectedNode) {
                const parentNode = floorNodes.find(n => n.completed) || floorNodes[0];
                if (!parentNode) return null;

                const parentPos = getNodeCoordinates(parentNode.colIndex, floorIdx);
                const childPos = getNodeCoordinates(selectedNode.colIndex, currentFloorIndex);
                const pathD = `M ${parentPos.x} ${parentPos.y + 40} C ${parentPos.x} ${parentPos.y + 70}, ${childPos.x} ${childPos.y + 10}, ${childPos.x} ${childPos.y + 40}`;

                return (
                  <g key={`group_active_path_to_selected`}>
                    {/* Black Background Track */}
                    <path d={pathD} fill="none" stroke="#050811" strokeWidth="7" strokeLinecap="round" />

                    {isConfirmingNode ? (
                      /* Animated Green Fill AFTER Confirm Click! */
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                        d={pathD}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="4"
                        strokeLinecap="round"
                        className="shadow-[0_0_15px_rgba(16,185,129,0.9)]"
                      />
                    ) : (
                      /* Yellow Dashed Preview BEFORE Confirm Click! */
                      <path
                        d={pathD}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="3"
                        strokeDasharray="5,4"
                        className="animate-pulse"
                        opacity={0.95}
                      />
                    )}
                  </g>
                );
              }

              // 3. Options from Current Selected Node to Next Floor Nodes
              if (isCurrentFloor && selectedNode) {
                const parentPos = getNodeCoordinates(selectedNode.colIndex, floorIdx);
                const nextFloorNodes = mapFloors[floorIdx + 1] || [];

                return nextFloorNodes.map((childNode) => {
                  const childPos = getNodeCoordinates(childNode.colIndex, floorIdx + 1);
                  const pathD = `M ${parentPos.x} ${parentPos.y + 40} C ${parentPos.x} ${parentPos.y + 70}, ${childPos.x} ${childPos.y + 10}, ${childPos.x} ${childPos.y + 40}`;

                  return (
                    <g key={`group_active_${selectedNode.id}_to_${childNode.id}`}>
                      <path d={pathD} fill="none" stroke="#050811" strokeWidth="6" strokeLinecap="round" />
                      <path
                        d={pathD}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="2"
                        strokeDasharray="4,4"
                        className="animate-pulse"
                        opacity={0.6}
                      />
                    </g>
                  );
                });
              }

              return null;
            })}
          </svg>

          {/* 2D 5-Column Tree Nodes Canvas Layer */}
          {mapFloors.map((floorNodes, floorIdx) => {
            const isCompleted = floorIdx < currentFloorIndex;
            const isCurrent = floorIdx === currentFloorIndex;
            const isFuture = floorIdx > currentFloorIndex;
            const isFogged = floorIdx > currentFloorIndex + 2;
            const isCamp = floorNodes[0]?.type === 'CAMP';
            const isBoss = floorNodes[0]?.type === 'BOSS';

            return (
              <div
                key={`floor_layer_${floorIdx}`}
                ref={isCurrent ? activeFloorRef : null}
                className="absolute left-0 right-0 flex items-center justify-between px-3 transition-all"
                style={{ top: `${floorIdx * rowHeight + 35}px`, height: `${rowHeight}px` }}
              >
                {/* Layer Floor Badge Indicator */}
                <div className="absolute left-1 text-[9px] font-black text-slate-600 uppercase tracking-widest pointer-events-none">
                  {isBoss ? '👑 BOSS' : isCamp ? '🏕️ KAMP' : `K${floorIdx + 1}`}
                </div>

                {/* Nodes 5-Column Grid */}
                <div className="w-full flex items-center justify-around">
                  {floorNodes.map((node, branchIdx) => {
                    const isNodeSelected = isCurrent && selectedBranchIndex === branchIdx;
                    const typeCfg = NODE_TYPE_CONFIG[node.type] || NODE_TYPE_CONFIG.NORMAL;
                    const pathCfg = PATH_CATEGORY_CONFIG[node.pathCategory] || PATH_CATEGORY_CONFIG.SAFE;

                    if (isFogged) {
                      return (
                        <div
                          key={node.id}
                          className="w-24 sm:w-28 p-2.5 rounded-2xl border border-slate-900 bg-slate-950/40 opacity-25 blur-xs flex flex-col items-center justify-center text-slate-600 pointer-events-none"
                        >
                          <EyeOff size={16} />
                          <span className="text-[8px] font-bold mt-1">Sisli Yol</span>
                        </div>
                      );
                    }

                    return (
                      <motion.div
                        key={node.id}
                        initial={isCurrent ? { scale: 0.9, opacity: 0 } : false}
                        animate={isCurrent ? { scale: 1, opacity: 1 } : {}}
                        onClick={() => { if (isCurrent && !isConfirmingNode) setSelectedBranchIndex(branchIdx); }}
                        className={`w-24 sm:w-28 p-2 rounded-2xl border-2 transition-all flex flex-col justify-between relative shadow-lg z-10 ${
                          isNodeSelected
                            ? 'border-amber-400 bg-amber-950/90 ring-2 ring-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.4)] scale-105'
                            : isCurrent
                            ? 'border-slate-600 bg-slate-900/95 hover:border-amber-400/60 cursor-pointer'
                            : isCompleted
                            ? 'border-slate-800 bg-slate-950/70 opacity-60 cursor-default'
                            : 'border-slate-900 bg-slate-950/50 opacity-40 cursor-not-allowed'
                        }`}
                      >
                        {/* Path Category Badge */}
                        {pathCfg && (
                          <span className={`text-[7px] font-black px-1 rounded-sm w-fit mb-0.5 border ${pathCfg.badge}`}>
                            {pathCfg.label}
                          </span>
                        )}

                        {/* Node Top Header */}
                        <div className="flex items-center gap-1 min-w-0">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs border shrink-0 ${
                            isNodeSelected
                              ? 'bg-amber-500/30 border-amber-400 text-amber-200'
                              : isCurrent
                              ? 'bg-slate-800 border-slate-700 text-slate-200'
                              : 'bg-slate-900 border-slate-800 text-slate-500'
                          }`}>
                            {node.icon}
                          </div>

                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-black text-slate-100 truncate leading-tight">
                              {node.title}
                            </span>
                            <span className={`text-[7px] font-black px-1 rounded w-fit mt-0.5 ${typeCfg.color} ${typeCfg.bg} border ${typeCfg.border}`}>
                              {typeCfg.label}
                            </span>
                          </div>
                        </div>

                        {/* Status Badges */}
                        <div className="mt-1 pt-0.5 border-t border-slate-800/80 flex items-center justify-between text-[8px] font-bold">
                          {isNodeSelected ? (
                            <span className="text-amber-300 font-black flex items-center gap-0.5">
                              SEÇİLDİ ✓
                            </span>
                          ) : isCompleted ? (
                            <span className="text-emerald-400 font-extrabold flex items-center gap-0.5">
                              <CheckCircle2 size={9} /> Geçildi
                            </span>
                          ) : isFuture ? (
                            <span className="text-slate-600 font-bold flex items-center gap-0.5">
                              <Lock size={8} /> Kilitli
                            </span>
                          ) : (
                            <span className="text-slate-400">Puan: {node.targetScore}</span>
                          )}

                          {node.targetScore > 0 && (
                            <span className="text-slate-300 font-black">
                              🎯{node.targetScore}
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
      </div>

      {/* Sticky Bottom Enter Node Button */}
      {selectedNode && (
        <div className="pt-2 border-t border-slate-800/80 shrink-0 z-20">
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.96 }}
            disabled={isConfirmingNode}
            onClick={handleConfirmNodeClick}
            className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 disabled:opacity-50 text-slate-950 font-black py-3.5 px-5 rounded-2xl transition flex items-center justify-center gap-2 shadow-2xl shadow-amber-500/30 text-sm tracking-wide border border-amber-300 cursor-pointer animate-pulse-glow"
          >
            <span>{isConfirmingNode ? 'ROTA DOLUYOR... ZİNDANA GİRİLİYOR 🔮' : `${selectedNode.icon} ${selectedNode.title} — GİR`}</span>
            <ChevronRight size={18} />
          </motion.button>
        </div>
      )}
    </div>
  );
}

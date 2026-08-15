import React from 'react';

/**
 * Mobile-first vertical phone frame wrapper with dynamic biome ambient lighting
 */
export function VerticalMobileContainer({ children, activeBiome }) {
  // Default fallback colors
  const glowColor1 = activeBiome?.glowColor || 'rgba(245, 158, 11, 0.1)';
  const glowColor2 = activeBiome?.id === 'EMERALD_FOREST' ? 'rgba(16, 185, 129, 0.12)' :
                     activeBiome?.id === 'CYAN_LIBRARY' ? 'rgba(6, 182, 212, 0.12)' :
                     activeBiome?.id === 'PURPLE_THEATRE' ? 'rgba(168, 85, 247, 0.12)' :
                     activeBiome?.id === 'VOLCANO_ARENA' ? 'rgba(239, 68, 68, 0.1)' :
                     activeBiome?.id === 'COSMIC_PEAK' ? 'rgba(234, 179, 8, 0.15)' :
                     'rgba(6, 182, 212, 0.08)';

  const frameBorderGlow = activeBiome?.id === 'EMERALD_FOREST' ? '0 0 60px rgba(0,0,0,0.9),0 0 20px rgba(16,185,129,0.2)' :
                          activeBiome?.id === 'CYAN_LIBRARY' ? '0 0 60px rgba(0,0,0,0.9),0 0 20px rgba(6,182,212,0.2)' :
                          activeBiome?.id === 'PURPLE_THEATRE' ? '0 0 60px rgba(0,0,0,0.9),0 0 20px rgba(168,85,247,0.2)' :
                          activeBiome?.id === 'VOLCANO_ARENA' ? '0 0 60px rgba(0,0,0,0.9),0 0 20px rgba(239,68,68,0.2)' :
                          activeBiome?.id === 'COSMIC_PEAK' ? '0 0 60px rgba(0,0,0,0.9),0 0 25px rgba(234,179,8,0.3)' :
                          '0 0 60px rgba(0,0,0,0.9),0 0 20px rgba(6,182,212,0.15)';

  return (
    <div className="min-h-screen bg-transparent text-slate-100 flex items-center justify-center p-0 relative overflow-hidden transition-all duration-1000">
      {/* Background Ambient Glow Orbs - dynamic per biome */}
      <div
        className="fixed -top-32 -left-32 w-96 h-96 rounded-full blur-[120px] pointer-events-none transition-all duration-1000"
        style={{ background: glowColor1 }}
      />
      <div
        className="fixed -bottom-32 -right-32 w-96 h-96 rounded-full blur-[120px] pointer-events-none transition-all duration-1000"
        style={{ background: glowColor2 }}
      />
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none transition-all duration-1000"
        style={{ background: activeBiome?.glowColor ? activeBiome.glowColor.replace('0.2', '0.06') : 'rgba(100,50,200,0.04)' }}
      />

      {/* Fullscreen responsive game container without frame border */}
      <div className="w-full max-w-full h-screen min-h-screen flex flex-col overflow-hidden relative z-10 bg-transparent border-0 shadow-none">
        {/* Game view area */}
        <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-transparent">
          {children}
        </div>
      </div>
    </div>
  );
}

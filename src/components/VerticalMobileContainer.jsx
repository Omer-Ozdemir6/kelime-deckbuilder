import React from 'react';

/**
 * Mobile-first vertical phone frame wrapper
 */
export function VerticalMobileContainer({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-0 md:p-4">
      {/* Phone container */}
      <div className="w-full max-w-md h-[100dvh] md:h-[840px] bg-slate-900 border-0 md:border-4 md:border-slate-800 md:rounded-[40px] shadow-2xl flex flex-col overflow-hidden relative backdrop-blur-xl">
        {/* Top notch indicator for phone preview on desktop */}
        <div className="hidden md:flex justify-center pt-2 pb-1 bg-slate-950/80 z-20 border-b border-slate-800/50">
          <div className="w-24 h-4 bg-slate-900 rounded-full flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-700"></div>
            <div className="w-12 h-1 rounded-full bg-slate-800"></div>
          </div>
        </div>

        {/* Game view area */}
        <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
          {children}
        </div>
      </div>
    </div>
  );
}

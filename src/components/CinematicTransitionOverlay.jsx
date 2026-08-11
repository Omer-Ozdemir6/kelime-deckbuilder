import React, { useEffect, useState } from 'react';

export function CinematicTransitionOverlay({ isTransitioning, onTransitionMidpoint, onTransitionComplete }) {
  const [phase, setPhase] = useState('IDLE'); // IDLE | CLOSING | BLACK | OPENING

  useEffect(() => {
    if (isTransitioning) {
      setPhase('CLOSING');

      // Phase 1: Close curtain to pitch black (800ms)
      const t1 = setTimeout(() => {
        setPhase('BLACK');
        if (onTransitionMidpoint) onTransitionMidpoint();

        // Phase 2: Hold pitch black screen for 600ms (clear black screen hold!)
        const t2 = setTimeout(() => {
          setPhase('OPENING');

          // Phase 3: Open curtain from center to edges (800ms)
          const t3 = setTimeout(() => {
            setPhase('IDLE');
            if (onTransitionComplete) onTransitionComplete();
          }, 800);

          return () => clearTimeout(t3);
        }, 600);

        return () => clearTimeout(t2);
      }, 800);

      return () => clearTimeout(t1);
    } else {
      setPhase('IDLE');
    }
  }, [isTransitioning]);

  if (phase === 'IDLE') return null;

  return (
    <div className="fixed inset-0 z-[99999] pointer-events-none overflow-hidden bg-transparent">
      <div
        className={`w-full h-full bg-slate-950 flex items-center justify-center relative ${
          phase === 'CLOSING'
            ? 'animate-curtain-close'
            : phase === 'OPENING'
            ? 'animate-curtain-open'
            : ''
        }`}
        style={{
          clipPath: phase === 'BLACK' ? 'circle(0% at 50% 50%)' : undefined
        }}
      >
        {phase === 'BLACK' && (
          <div className="text-amber-400 font-cinzel font-black text-sm tracking-widest uppercase flex items-center gap-2">
            <span className="animate-spin text-lg">🔮</span>
            <span>ZİNDANA GİRİLİYOR...</span>
          </div>
        )}
      </div>
    </div>
  );
}

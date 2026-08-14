import React from 'react';

/**
 * SvgFilterDefs
 * Global SVG filter definitions rendered once at root level.
 * Components can reference these via CSS/SVG `filter="url(#filterId)"`.
 */
export function SvgFilterDefs() {
  return (
    <svg className="absolute w-0 h-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <defs>
        {/* 1. FIRE AURA FILTER */}
        <filter id="fireAuraFilter" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.09" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* 2. NEON GLOW FILTER */}
        <filter id="neonGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* 3. PLASMA DISTORTION FILTER (For liquid / magic effects) */}
        <filter id="plasmaDistortFilter" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="3" result="turbulence">
            <animate attributeName="baseFrequency" dur="6s" values="0.02;0.05;0.02" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="5" xChannelSelector="R" yChannelSelector="G" result="displacement" />
        </filter>

        {/* 4. RUNIC GLOW FILTER */}
        <filter id="runicGlowFilter" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#f59e0b" floodOpacity="0.8" result="amberGlow" />
          <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#d97706" floodOpacity="0.5" result="outerGlow" />
          <feMerge>
            <feMergeNode in="outerGlow" />
            <feMergeNode in="amberGlow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}

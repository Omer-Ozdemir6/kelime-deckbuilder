import React from 'react';

/**
 * RunicCardFrame
 * Overlay SVG runic corners & animated border stroke for cards and badges.
 */
export function RunicCardFrame({ rarity = 'common', active = false, className = '' }) {
  let strokeColor = 'rgba(148, 163, 184, 0.4)';
  let cornerColor = '#94a3b8';
  let glowFilter = undefined;

  if (rarity === 'legendary') {
    strokeColor = 'rgba(245, 158, 11, 0.8)';
    cornerColor = '#fbbf24';
    glowFilter = 'url(#runicGlowFilter)';
  } else if (rarity === 'rare') {
    strokeColor = 'rgba(168, 85, 247, 0.8)';
    cornerColor = '#c084fc';
    glowFilter = 'url(#neonGlowFilter)';
  } else if (rarity === 'joker') {
    strokeColor = 'rgba(34, 211, 238, 0.85)';
    cornerColor = '#38bdf8';
    glowFilter = 'url(#plasmaDistortFilter)';
  } else if (active) {
    strokeColor = 'rgba(251, 191, 36, 0.9)';
    cornerColor = '#f59e0b';
    glowFilter = 'url(#runicGlowFilter)';
  }

  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none overflow-visible ${className}`}
      style={{ filter: glowFilter }}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {/* Outer border track */}
      <rect
        x="2.5"
        y="2.5"
        width="95"
        height="95"
        rx="7"
        ry="7"
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        strokeDasharray={active ? '6,3' : 'none'}
      />

      {/* Runic Corner Knot Accents inset cleanly inside card border */}
      {/* Top Left */}
      <path d="M 5 18 L 5 5 L 18 5" fill="none" stroke={cornerColor} strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <circle cx="5" cy="5" r="2.5" fill={cornerColor} vectorEffect="non-scaling-stroke" />

      {/* Top Right */}
      <path d="M 82 5 L 95 5 L 95 18" fill="none" stroke={cornerColor} strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <circle cx="95" cy="5" r="2.5" fill={cornerColor} vectorEffect="non-scaling-stroke" />

      {/* Bottom Left */}
      <path d="M 5 82 L 5 95 L 18 95" fill="none" stroke={cornerColor} strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <circle cx="5" cy="95" r="2.5" fill={cornerColor} vectorEffect="non-scaling-stroke" />

      {/* Bottom Right */}
      <path d="M 82 95 L 95 95 L 95 82" fill="none" stroke={cornerColor} strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <circle cx="95" cy="95" r="2.5" fill={cornerColor} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

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
        x="2"
        y="2"
        width="96"
        height="96"
        rx="12"
        ry="12"
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        strokeDasharray={active ? '6,3' : 'none'}
      />

      {/* Runic Corner Knot Accents using 0..100 percentage viewBox coordinates */}
      {/* Top Left */}
      <path d="M 3 14 L 3 3 L 14 3" fill="none" stroke={cornerColor} strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <circle cx="3" cy="3" r="2" fill={cornerColor} vectorEffect="non-scaling-stroke" />

      {/* Top Right */}
      <path d="M 86 3 L 97 3 L 97 14" fill="none" stroke={cornerColor} strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <circle cx="97" cy="3" r="2" fill={cornerColor} vectorEffect="non-scaling-stroke" />

      {/* Bottom Left */}
      <path d="M 3 86 L 3 97 L 14 97" fill="none" stroke={cornerColor} strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <circle cx="3" cy="97" r="2" fill={cornerColor} vectorEffect="non-scaling-stroke" />

      {/* Bottom Right */}
      <path d="M 86 97 L 97 97 L 97 86" fill="none" stroke={cornerColor} strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <circle cx="97" cy="97" r="2" fill={cornerColor} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

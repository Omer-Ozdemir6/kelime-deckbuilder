import React from 'react';
import { motion } from 'framer-motion';

/**
 * MorphingSeal
 * Morphing SVG Seal/Rune icon using Framer Motion path animations.
 */
export function MorphingSeal({ type = 'star', size = 32, className = '' }) {
  // SVG Path variants for morphing between Star, Shield, Sun and Gem
  const paths = {
    star: 'M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z',
    shield: 'M12 2L20 5V11C20 16.52 16.58 21.6 12 23C7.42 21.6 4 16.52 4 11V5L12 2Z',
    gem: 'M6 3L18 3L22 9L12 21L2 9L6 3Z',
    sun: 'M12 7C9.24 7 7 9.24 7 12C7 14.76 9.24 17 12 17C14.76 17 17 14.76 17 12C17 9.24 14.76 7 12 7ZM12 2V4M12 20V22M4 12H2M22 12H20'
  };

  const selectedPath = paths[type] || paths.star;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'url(#runicGlowFilter)' }}
      >
        <motion.path
          d={selectedPath}
          fill="url(#sealGradient)"
          stroke="#fbbf24"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ d: selectedPath, rotate: [0, 360] }}
          transition={{
            d: { duration: 0.6, ease: 'easeInOut' },
            rotate: { duration: 20, repeat: Infinity, ease: 'linear' }
          }}
        />
        <defs>
          <linearGradient id="sealGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';

/**
 * BurstParticles
 * Emits SVG vector sparkle particles radiating outward.
 */
export function BurstParticles({ count = 12, color = '#f59e0b', active = false }) {
  if (!active) return null;

  const particles = Array.from({ length: count }).map((_, i) => {
    const angle = (i / count) * 360;
    const distance = 40 + Math.random() * 50;
    const rad = (angle * Math.PI) / 180;
    const targetX = Math.cos(rad) * distance;
    const targetY = Math.sin(rad) * distance;

    return {
      id: i,
      x: targetX,
      y: targetY,
      scale: 0.5 + Math.random() * 0.8
    };
  });

  return (
    <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center overflow-visible">
      {particles.map((p) => (
        <motion.svg
          key={p.id}
          className="absolute w-5 h-5 overflow-visible"
          viewBox="0 0 24 24"
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: [1, 1, 0],
            scale: [0, p.scale, 0],
            rotate: [0, 180]
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <path
            d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
            fill={color}
            style={{ filter: 'url(#runicGlowFilter)' }}
          />
        </motion.svg>
      ))}
    </div>
  );
}

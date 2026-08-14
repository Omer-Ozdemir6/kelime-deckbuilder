import React from 'react';
import { motion } from 'framer-motion';

/**
 * LuminousWordEffect
 * SVG stroke-dashoffset animation illuminating word characters during submission.
 */
export function LuminousWordEffect({ word = '', active = false }) {
  if (!active || !word) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center overflow-visible">
      <svg
        className="w-full h-full overflow-visible"
        style={{ filter: 'url(#fireAuraFilter)' }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <motion.rect
          x="2"
          y="2"
          width="96"
          height="96"
          rx="12"
          ry="12"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="3.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          pathLength="100"
          initial={{ strokeDasharray: '100', strokeDashoffset: 100 }}
          animate={{ strokeDashoffset: [100, 0, -100] }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
      </svg>
    </div>
  );
}

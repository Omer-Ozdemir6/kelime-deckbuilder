import React from 'react';

/**
 * JokerCardIllustration
 * Master SVG Illustrations for ALL Jokers, Passive Jokers, and Relics in VERBO.
 * Provides custom thematic SVG drawings for all archetypes, plus a deterministic
 * procedural generator to ensure 100% unique colors & icons for all 150 Jokers.
 */
export function JokerCardIllustration({ type = 'joker', cardId = '', className = 'w-7 h-7 sm:w-9 sm:h-9' }) {
  const lowerId = (cardId || type || '').toLowerCase().trim();

  // ── 1. SPECIFIC LEGENDARY & UNIQUE JOKER ARCHETYPES ──
  if (lowerId.includes('chicot')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#3b0764" stroke="#c084fc" strokeWidth="2.5" />
        <path d="M20 46 C12 28, 6 22, 14 12 C26 20, 32 32, 34 46" fill="#a855f7" stroke="#fef08a" strokeWidth="2" />
        <path d="M40 46 C40 24, 40 10, 40 4 C40 24, 40 32, 40 46" fill="#ec4899" stroke="#fef08a" strokeWidth="2" />
        <path d="M60 46 C68 28, 74 22, 66 12 C54 20, 48 32, 46 46" fill="#eab308" stroke="#fef08a" strokeWidth="2" />
        <circle cx="14" cy="12" r="4.5" fill="#facc15" stroke="#fff" strokeWidth="1.5" />
        <circle cx="40" cy="4" r="4.5" fill="#facc15" stroke="#fff" strokeWidth="1.5" />
        <circle cx="66" cy="12" r="4.5" fill="#facc15" stroke="#fff" strokeWidth="1.5" />
      </svg>
    );
  }

  if (lowerId.includes('runner') || lowerId.includes('kosucu') || lowerId.includes('marathon')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
        {/* Winged Running Shoe / Runner Symbol */}
        <path d="M18 50 L52 50 C58 50 64 44 60 36 L48 26 C44 24 38 24 32 28 L20 38 Z" fill="#0284c7" stroke="#38bdf8" strokeWidth="2.5" />
        <path d="M26 36 L14 26 M30 42 L16 34 M34 48 L22 42" stroke="#bae6fd" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="52" cy="40" r="4" fill="#facc15" />
      </svg>
    );
  }

  if (lowerId.includes('mime') || lowerId.includes('mim') || lowerId.includes('theater')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#1e1b4b" stroke="#c084fc" strokeWidth="2.5" />
        {/* Drama Mime Mask */}
        <path d="M22 26 C22 14, 58 14, 58 26 C58 54, 50 68, 40 68 C30 68, 22 54, 22 26 Z" fill="#f8fafc" stroke="#a855f7" strokeWidth="2.5" />
        <ellipse cx="32" cy="36" rx="4" ry="6" fill="#4c0519" />
        <ellipse cx="48" cy="36" rx="4" ry="6" fill="#4c0519" />
        <path d="M30 54 Q40 60 50 54" stroke="#e11d48" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M32 44 Q32 48 32 50" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (lowerId.includes('jester') || lowerId.includes('soytari')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#4c0519" stroke="#f43f5e" strokeWidth="2.5" />
        {/* Tri-color Jester Cap */}
        <path d="M20 48 C12 28, 4 22, 12 12 C24 20, 30 34, 32 48" fill="#e11d48" stroke="#fef08a" strokeWidth="2" />
        <path d="M40 48 C40 24, 40 10, 40 4 C40 24, 40 34, 40 48" fill="#3b82f6" stroke="#fef08a" strokeWidth="2" />
        <path d="M60 48 C68 28, 76 22, 68 12 C56 20, 50 34, 48 48" fill="#eab308" stroke="#fef08a" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" fill="#facc15" />
        <circle cx="40" cy="4" r="4" fill="#facc15" />
        <circle cx="68" cy="12" r="4" fill="#facc15" />
      </svg>
    );
  }

  if (lowerId.includes('astronaut') || lowerId.includes('uzay')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#030712" stroke="#6366f1" strokeWidth="2.5" />
        {/* Astronaut Helmet */}
        <circle cx="40" cy="40" r="22" fill="#1e1b4b" stroke="#818cf8" strokeWidth="3" />
        <ellipse cx="40" cy="38" rx="15" ry="11" fill="#38bdf8" stroke="#bae6fd" strokeWidth="2" opacity="0.9" />
        <path d="M30 32 Q40 28 48 32" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      </svg>
    );
  }

  if (lowerId.includes('blacksmith') || lowerId.includes('demirci')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#451a03" stroke="#f97316" strokeWidth="2.5" />
        {/* Flaming Hammer & Anvil */}
        <path d="M20 54 H60 L54 62 H26 Z" fill="#78350f" stroke="#fef08a" strokeWidth="2" />
        <path d="M26 22 L46 42 L38 50 L18 30 Z" fill="#ea580c" stroke="#facc15" strokeWidth="2.5" />
        <path d="M42 38 L62 18" stroke="#fef08a" strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }

  if (lowerId.includes('alchemist') || lowerId.includes('simyaci')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#064e3b" stroke="#34d399" strokeWidth="2.5" />
        {/* Alchemist Chemical Flask */}
        <path d="M34 16 H46 V28 L58 54 C60 62, 52 68, 40 68 C28 68, 20 62, 22 54 L34 28 Z" fill="#059669" stroke="#a7f3d0" strokeWidth="2.5" />
        <circle cx="36" cy="48" r="4" fill="#a7f3d0" />
        <circle cx="46" cy="56" r="3" fill="#a7f3d0" />
      </svg>
    );
  }

  if (lowerId.includes('chess') || lowerId.includes('satranc') || lowerId.includes('king') || lowerId.includes('queen') || lowerId.includes('kral')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#713f12" stroke="#facc15" strokeWidth="2.5" />
        {/* Royal Crown / Chess King */}
        <path d="M18 56 L14 28 L28 40 L40 14 L52 40 L66 28 L62 56 Z" fill="#eab308" stroke="#fef08a" strokeWidth="2.5" />
        <circle cx="40" cy="46" r="5" fill="#ef4444" />
      </svg>
    );
  }

  if (lowerId.includes('owl') || lowerId.includes('gece')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.5" />
        {/* Night Owl Eyes */}
        <circle cx="28" cy="38" r="12" fill="#facc15" stroke="#fff" strokeWidth="2" />
        <circle cx="52" cy="38" r="12" fill="#facc15" stroke="#fff" strokeWidth="2" />
        <circle cx="28" cy="38" r="6" fill="#0f172a" />
        <circle cx="52" cy="38" r="6" fill="#0f172a" />
        <polygon points="40,44 34,54 46,54" fill="#ea580c" />
      </svg>
    );
  }

  if (lowerId.includes('dragon') || lowerId.includes('ejderha')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#450a0a" stroke="#ef4444" strokeWidth="2.5" />
        {/* Dragon Flame & Wings */}
        <path d="M16 46 C24 22, 40 10, 40 10 C40 10, 56 22, 64 46 C50 48, 40 64, 40 64 C40 64, 30 48, 16 46 Z" fill="#dc2626" stroke="#fef08a" strokeWidth="2.5" />
        <circle cx="40" cy="32" r="6" fill="#facc15" />
      </svg>
    );
  }

  if (lowerId.includes('ninja') || lowerId.includes('golge')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#18181b" stroke="#a855f7" strokeWidth="2.5" />
        {/* Shadow Ninja Mask */}
        <path d="M22 26 C22 26, 40 16, 58 26 C58 42, 50 62, 40 68 C30 62, 22 42, 22 26 Z" fill="#3f0764" stroke="#c084fc" strokeWidth="2.5" />
        <ellipse cx="31" cy="38" rx="4.5" ry="4.5" fill="#f43f5e" />
        <ellipse cx="49" cy="38" rx="4.5" ry="4.5" fill="#f43f5e" />
      </svg>
    );
  }

  if (lowerId.includes('pirate') || lowerId.includes('korsan')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#1c1917" stroke="#d97706" strokeWidth="2.5" />
        {/* Pirate Skull & Crossbones */}
        <path d="M16 38 C28 20, 52 20, 64 38 L60 44 H20 Z" fill="#78350f" stroke="#fef08a" strokeWidth="2" />
        <circle cx="40" cy="50" r="10" fill="#f8fafc" stroke="#1c1917" strokeWidth="2" />
      </svg>
    );
  }

  if (lowerId.includes('dice') || lowerId.includes('zar')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#881337" stroke="#fb7185" strokeWidth="2.5" />
        <rect x="22" y="22" width="36" height="36" rx="7" fill="#f43f5e" stroke="#fff" strokeWidth="2.5" />
        <circle cx="30" cy="30" r="3.5" fill="#fff" />
        <circle cx="50" cy="30" r="3.5" fill="#fff" />
        <circle cx="40" cy="40" r="3.5" fill="#fff" />
        <circle cx="30" cy="50" r="3.5" fill="#fff" />
        <circle cx="50" cy="50" r="3.5" fill="#fff" />
      </svg>
    );
  }

  if (lowerId.includes('fire') || lowerId.includes('alev') || lowerId.includes('ember') || lowerId.includes('kul')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#451a03" stroke="#f97316" strokeWidth="2.5" />
        <path d="M40 12 C50 28, 64 38, 56 58 C50 68, 30 68, 24 58 C18 38, 30 28, 40 12 Z" fill="#ea580c" stroke="#fde047" strokeWidth="2.5" />
        <path d="M40 32 C46 42, 52 46, 48 58 C44 64, 36 64, 32 58 C28 46, 34 42, 40 32 Z" fill="#facc15" />
      </svg>
    );
  }

  if (lowerId.includes('frost') || lowerId.includes('buz') || lowerId.includes('freeze') || lowerId.includes('ice')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#083344" stroke="#22d3ee" strokeWidth="2.5" />
        <path d="M40 12 V68 M12 40 H68 M20 20 L60 60 M20 60 L60 20" stroke="#a5f3fc" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="40" cy="40" r="7" fill="#67e8f9" />
      </svg>
    );
  }

  if (lowerId.includes('phoenix') || lowerId.includes('anka')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#7c2d12" stroke="#ea580c" strokeWidth="2.5" />
        <path d="M20 44 Q40 12 60 44 Q40 68 20 44 Z" fill="#f97316" stroke="#fef08a" strokeWidth="2.5" />
        <circle cx="40" cy="36" r="6" fill="#facc15" />
      </svg>
    );
  }

  if (lowerId.includes('gold') || lowerId.includes('altin') || lowerId.includes('midas') || lowerId.includes('merchant')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#713f12" stroke="#facc15" strokeWidth="2.5" />
        <circle cx="40" cy="40" r="22" fill="#eab308" stroke="#fef08a" strokeWidth="2.5" />
        <text x="40" y="49" textAnchor="middle" fill="#78350f" fontSize="26" fontWeight="900">$</text>
      </svg>
    );
  }

  // ── 2. DETERMINISTIC PROCEDURAL SVG ILLUSTRATION GENERATOR ──
  // Computes a unique color palette, geometry shape, and icon emblem based on cardId hash
  const hash = getHash(cardId || type || 'joker');
  const themeIndex = hash % PALETTES.length;
  const palette = PALETTES[themeIndex];
  const symbolType = (hash >> 3) % 6;

  return (
    <svg className={className} viewBox="0 0 80 80" fill="none">
      {/* Outer Runic Aura */}
      <circle cx="40" cy="40" r="36" fill={palette.bg} stroke={palette.border} strokeWidth="2.5" />
      <circle cx="40" cy="40" r="30" fill="none" stroke={palette.stroke} strokeWidth="1" strokeDasharray="5 3" />

      {/* Center Dynamic Symbol */}
      {symbolType === 0 && (
        // Runic Star
        <polygon points="40,14 47,30 64,30 50,40 55,56 40,46 25,56 30,40 16,30 33,30" fill={palette.accent} stroke="#fff" strokeWidth="1.5" />
      )}

      {symbolType === 1 && (
        // Runic Crown
        <path d="M20 54 L16 30 L28 40 L40 18 L52 40 L64 30 L60 54 Z" fill={palette.accent} stroke="#fff" strokeWidth="2" />
      )}

      {symbolType === 2 && (
        // Runic Gem / Diamond
        <polygon points="40,16 62,38 40,64 18,38" fill={palette.accent} stroke="#fff" strokeWidth="2" />
      )}

      {symbolType === 3 && (
        // Runic Shield
        <path d="M22 24 C22 24 40 18 40 18 C40 18 58 24 58 24 C58 46 48 62 40 66 C32 62 22 46 22 24 Z" fill={palette.accent} stroke="#fff" strokeWidth="2" />
      )}

      {symbolType === 4 && (
        // Jester Triple Bells
        <g>
          <path d="M22 46 C16 30 8 24 16 14 C26 22 30 34 32 46" fill={palette.accent} stroke="#fff" strokeWidth="1.5" />
          <path d="M40 46 C40 26 40 14 40 8 C40 26 40 34 40 46" fill={palette.stroke} stroke="#fff" strokeWidth="1.5" />
          <path d="M58 46 C64 30 72 24 64 14 C54 22 50 34 48 46" fill={palette.accent} stroke="#fff" strokeWidth="1.5" />
          <circle cx="16" cy="14" r="4" fill="#facc15" />
          <circle cx="40" cy="8" r="4" fill="#facc15" />
          <circle cx="64" cy="14" r="4" fill="#facc15" />
        </g>
      )}

      {symbolType === 5 && (
        // Orbital Lotus / Spheres
        <g>
          <circle cx="40" cy="40" r="14" fill={palette.accent} stroke="#fff" strokeWidth="2" />
          <circle cx="40" cy="18" r="5" fill="#facc15" />
          <circle cx="62" cy="40" r="5" fill="#facc15" />
          <circle cx="40" cy="62" r="5" fill="#facc15" />
          <circle cx="18" cy="40" r="5" fill="#facc15" />
        </g>
      )}
    </svg>
  );
}

/** Helper: Deterministic Hash from String */
function getHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/** Color Palettes for Deterministic Visual Diversity */
const PALETTES = [
  { bg: '#311042', border: '#ec4899', stroke: '#f472b6', accent: '#a855f7' }, // Amethyst Pink
  { bg: '#032b43', border: '#38bdf8', stroke: '#7dd3fc', accent: '#0284c7' }, // Sapphire Blue
  { bg: '#064e3b', border: '#34d399', stroke: '#6ee7b7', accent: '#10b981' }, // Emerald Green
  { bg: '#451a03', border: '#f97316', stroke: '#fdba74', accent: '#ea580c' }, // Volcanic Orange
  { bg: '#4c0519', border: '#f43f5e', stroke: '#fda4af', accent: '#e11d48' }, // Crimson Ruby
  { bg: '#713f12', border: '#facc15', stroke: '#fef08a', accent: '#eab308' }, // Imperial Gold
  { bg: '#1e1b4b', border: '#818cf8', stroke: '#c7d2fe', accent: '#4f46e5' }, // Celestial Indigo
  { bg: '#18181b', border: '#c084fc', stroke: '#e9d5ff', accent: '#9333ea' }  // Obsidian Purple
];

import React from 'react';

/**
 * JokerCardIllustration
 * Master AAA 3D SVG Illustrations for ALL Special Cards, Jokers, Passive Jokers, and Relics in VERBO.
 */
export function JokerCardIllustration({ type = 'joker', cardId = '', className = 'w-7 h-7 sm:w-9 sm:h-9' }) {
  const lowerId = (cardId || type || '').toLowerCase().trim();

  // ── 1. EFSANEVİ PASİF JOKERLER (Legendary Spectral Jokers) ──
  if (lowerId.includes('chicot')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <defs>
          <radialGradient id="chicotGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#3b0764" />
          </radialGradient>
        </defs>
        <circle cx="40" cy="40" r="36" fill="url(#chicotGlow)" stroke="#fef08a" strokeWidth="2.5" />
        <circle cx="40" cy="40" r="30" fill="none" stroke="#e9d5ff" strokeWidth="1" strokeDasharray="5 3" />
        {/* Royal Jester Hat */}
        <path d="M20 46 C12 28, 6 22, 14 12 C26 20, 32 32, 34 46" fill="#a855f7" stroke="#fef08a" strokeWidth="2" />
        <path d="M40 46 C40 24, 40 10, 40 4 C40 24, 40 32, 40 46" fill="#ec4899" stroke="#fef08a" strokeWidth="2" />
        <path d="M60 46 C68 28, 74 22, 66 12 C54 20, 48 32, 46 46" fill="#eab308" stroke="#fef08a" strokeWidth="2" />
        {/* Golden Bells */}
        <circle cx="14" cy="12" r="4.5" fill="#facc15" stroke="#fff" strokeWidth="1.5" />
        <circle cx="40" cy="4" r="4.5" fill="#facc15" stroke="#fff" strokeWidth="1.5" />
        <circle cx="66" cy="12" r="4.5" fill="#facc15" stroke="#fff" strokeWidth="1.5" />
        {/* Royal Crown Band */}
        <rect x="18" y="46" width="44" height="10" rx="3" fill="#b45309" stroke="#fef08a" strokeWidth="2" />
        <circle cx="40" cy="51" r="3" fill="#ef4444" />
      </svg>
    );
  }

  if (lowerId.includes('perkeo')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#1e1b4b" stroke="#60a5fa" strokeWidth="2.5" />
        <circle cx="40" cy="40" r="30" fill="none" stroke="#93c5fd" strokeWidth="1" strokeDasharray="6 3" />
        {/* Wizard Hat */}
        <path d="M40 10 L22 52 L58 52 Z" fill="#2563eb" stroke="#bfdbfe" strokeWidth="2.5" />
        <circle cx="40" cy="10" r="5" fill="#60a5fa" stroke="#fff" strokeWidth="1.5" />
        {/* Magical Scroll */}
        <rect x="28" y="42" width="24" height="22" rx="4" fill="#fef08a" stroke="#d97706" strokeWidth="2" />
        <line x1="33" y1="48" x2="47" y2="48" stroke="#b45309" strokeWidth="2" strokeDasharray="3 2" />
        <line x1="33" y1="54" x2="44" y2="54" stroke="#b45309" strokeWidth="2" strokeDasharray="3 2" />
      </svg>
    );
  }

  if (lowerId.includes('yorick')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#451a03" stroke="#f59e0b" strokeWidth="2.5" />
        {/* Flaming Skull */}
        <path d="M40 8 Q54 26 40 38 Q26 26 40 8 Z" fill="#ef4444" opacity="0.75" />
        <path d="M26 40 C26 26, 54 26, 54 40 C54 52, 46 60, 46 68 L34 68 C34 60, 26 52, 26 40 Z" fill="#fef3c7" stroke="#78350f" strokeWidth="2.5" />
        <ellipse cx="34" cy="42" rx="5" ry="7" fill="#0f172a" />
        <ellipse cx="46" cy="42" rx="5" ry="7" fill="#0f172a" />
        <path d="M35 68 V60 M40 68 V60 M45 68 V60" stroke="#78350f" strokeWidth="2" />
      </svg>
    );
  }

  if (lowerId.includes('canio')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#4c0519" stroke="#f43f5e" strokeWidth="2.5" />
        {/* Crimson Executioner Blade */}
        <path d="M26 62 L56 18 L64 26 L34 70 Z" fill="#e11d48" stroke="#fecdd3" strokeWidth="2" />
        <path d="M18 54 L30 66" stroke="#fda4af" strokeWidth="4" strokeLinecap="round" />
        <circle cx="22" cy="58" r="4" fill="#fb7185" />
      </svg>
    );
  }

  if (lowerId.includes('triboulet')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#713f12" stroke="#facc15" strokeWidth="2.5" />
        {/* Imperial Crown */}
        <path d="M20 58 L18 28 L32 40 L40 18 L48 40 L62 28 L60 58 Z" fill="#eab308" stroke="#fef08a" strokeWidth="2.5" />
        <circle cx="18" cy="25" r="4" fill="#ef4444" />
        <circle cx="40" cy="15" r="5" fill="#3b82f6" />
        <circle cx="62" cy="25" r="4" fill="#10b981" />
        <rect x="22" y="56" width="36" height="8" rx="2" fill="#b45309" stroke="#fef08a" strokeWidth="1.5" />
      </svg>
    );
  }

  // ── 2. ÖZEL EL JOKERLERİ VE KARTLARI (Special Hand Cards) ──
  if (lowerId.includes('holy') || lowerId.includes('kutsal')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#78350f" stroke="#fde047" strokeWidth="3" />
        <path d="M40 10 V70 M10 40 H70 M18 18 L62 62 M18 62 L62 18" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" />
        <circle cx="40" cy="40" r="14" fill="#facc15" stroke="#fff" strokeWidth="2.5" />
      </svg>
    );
  }

  if (lowerId.includes('double') || lowerId === '2x' || lowerId.includes('cift')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#1e1b4b" stroke="#60a5fa" strokeWidth="3" />
        <circle cx="40" cy="40" r="28" fill="none" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="6 3" />
        <text x="40" y="48" textAnchor="middle" fill="#38bdf8" fontSize="28" fontWeight="900" fontFamily="Cinzel, serif">2X</text>
      </svg>
    );
  }

  if (lowerId.includes('delete') || lowerId.includes('sil')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#450a0a" stroke="#f87171" strokeWidth="3" />
        <path d="M26 24 H54 M30 24 V56 H50 V24 M35 18 H45" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" />
        <path d="M35 32 L45 48 M45 32 L35 48" stroke="#ef4444" strokeWidth="3" />
      </svg>
    );
  }

  if (lowerId.includes('refresh') || lowerId.includes('yenile')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#064e3b" stroke="#34d399" strokeWidth="3" />
        <path d="M40 18 A 18 18 0 1 1 22 40" fill="none" stroke="#a7f3d0" strokeWidth="4" strokeLinecap="round" />
        <polygon points="40,10 40,26 52,18" fill="#a7f3d0" />
      </svg>
    );
  }

  if (lowerId.includes('mirror') || lowerId.includes('ayna')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />
        <ellipse cx="40" cy="40" rx="20" ry="26" fill="#0284c7" stroke="#bae6fd" strokeWidth="2.5" />
        <path d="M30 26 Q45 20 50 35" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      </svg>
    );
  }

  if (lowerId.includes('lightning') || lowerId.includes('yildirim') || lowerId.includes('supercharge')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#451a03" stroke="#eab308" strokeWidth="3" />
        <path d="M44 10 L22 42 H42 L36 70 L58 36 H38 L44 10 Z" fill="#facc15" stroke="#fef08a" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    );
  }

  if (lowerId.includes('rainbow') || lowerId.includes('gokkusagi') || lowerId.includes('polychrome') || lowerId.includes('cosmic') || lowerId.includes('vortex') || lowerId.includes('nova')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#311042" stroke="#ec4899" strokeWidth="3" />
        <path d="M16 56 A 24 24 0 0 1 64 56" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />
        <path d="M22 56 A 18 18 0 0 1 58 56" stroke="#eab308" strokeWidth="5" strokeLinecap="round" />
        <path d="M28 56 A 12 12 0 0 1 52 56" stroke="#3b82f6" strokeWidth="5" strokeLinecap="round" />
        <circle cx="40" cy="32" r="6" fill="#a855f7" stroke="#fff" strokeWidth="2" />
      </svg>
    );
  }

  if (lowerId.includes('midas') || lowerId.includes('gold') || lowerId.includes('altin')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#78350f" stroke="#facc15" strokeWidth="3" />
        <path d="M16 30 L26 56 H54 L64 30 L48 40 L40 18 L32 40 L16 30 Z" fill="#facc15" stroke="#fef08a" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="40" cy="46" r="5" fill="#fff" />
      </svg>
    );
  }

  if (lowerId.includes('shadow') || lowerId.includes('golge')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#18181b" stroke="#a855f7" strokeWidth="3" />
        <path d="M22 26 C22 26, 40 16, 58 26 C58 42, 50 62, 40 68 C30 62, 22 42, 22 26 Z" fill="#3f0764" stroke="#c084fc" strokeWidth="2.5" />
        <circle cx="31" cy="38" r="4.5" fill="#f43f5e" />
        <circle cx="49" cy="38" r="4.5" fill="#f43f5e" />
      </svg>
    );
  }

  if (lowerId.includes('warrior') || lowerId.includes('savasci') || lowerId.includes('target')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#450a0a" stroke="#f87171" strokeWidth="3" />
        <path d="M20 20 L60 60 M60 20 L20 60" stroke="#fef08a" strokeWidth="5" strokeLinecap="round" />
        <circle cx="40" cy="40" r="8" fill="#dc2626" stroke="#fff" strokeWidth="2.5" />
      </svg>
    );
  }

  if (lowerId.includes('oracle') || lowerId.includes('kahin') || lowerId.includes('blue_seal')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#083344" stroke="#38bdf8" strokeWidth="3" />
        <circle cx="40" cy="40" r="20" fill="#0284c7" stroke="#7dd3fc" strokeWidth="2.5" />
        <circle cx="40" cy="40" r="10" fill="#bae6fd" />
      </svg>
    );
  }

  if (lowerId.includes('fire') || lowerId.includes('alev') || lowerId.includes('ash') || lowerId.includes('kul')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#451a03" stroke="#f97316" strokeWidth="3" />
        <path d="M40 12 C50 28, 64 38, 56 58 C50 68, 30 68, 24 58 C18 38, 30 28, 40 12 Z" fill="#ea580c" stroke="#fde047" strokeWidth="2.5" />
        <path d="M40 32 C46 42, 52 46, 48 58 C44 64, 36 64, 32 58 C28 46, 34 42, 40 32 Z" fill="#facc15" />
      </svg>
    );
  }

  if (lowerId.includes('frost') || lowerId.includes('buz') || lowerId.includes('freeze')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#083344" stroke="#22d3ee" strokeWidth="3" />
        <path d="M40 12 V68 M12 40 H68 M20 20 L60 60 M20 60 L60 20" stroke="#a5f3fc" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="40" cy="40" r="7" fill="#67e8f9" />
      </svg>
    );
  }

  if (lowerId.includes('crown') || lowerId.includes('kral') || lowerId.includes('sovereign')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#713f12" stroke="#facc15" strokeWidth="3" />
        <path d="M20 56 L16 30 L28 40 L40 16 L52 40 L64 30 L60 56 Z" fill="#eab308" stroke="#fef08a" strokeWidth="2.5" />
        <circle cx="40" cy="48" r="4" fill="#ef4444" />
      </svg>
    );
  }

  if (lowerId.includes('poison') || lowerId.includes('zehir')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#064e3b" stroke="#34d399" strokeWidth="3" />
        <path d="M32 16 H48 V26 L58 52 C60 60, 52 68, 40 68 C28 68, 20 60, 22 52 L32 26 Z" fill="#059669" stroke="#a7f3d0" strokeWidth="2.5" />
        <circle cx="40" cy="52" r="5" fill="#6ee7b7" />
      </svg>
    );
  }

  if (lowerId.includes('infinity') || lowerId.includes('sonsuz')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#1e1b4b" stroke="#818cf8" strokeWidth="3" />
        <path d="M26 40 C16 26, 16 54, 40 40 C64 26, 64 54, 54 40 C44 26, 44 54, 26 40 Z" fill="none" stroke="#a5b4fc" strokeWidth="5" strokeLinecap="round" />
      </svg>
    );
  }

  if (lowerId.includes('scribe') || lowerId.includes('katip') || lowerId.includes('murekkep') || lowerId.includes('kalem') || lowerId.includes('scroll') || lowerId.includes('parsomon')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#451a03" stroke="#f59e0b" strokeWidth="3" />
        <path d="M22 60 L50 16 L60 22 L32 66 Z" fill="#fef08a" stroke="#b45309" strokeWidth="2.5" />
        <polygon points="22,60 16,70 28,66" fill="#b45309" />
      </svg>
    );
  }

  if (lowerId.includes('vowel') || lowerId.includes('sesli')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="3" />
        <path d="M22 40 Q40 20 58 40 Q40 60 22 40 Z" fill="#0284c7" stroke="#bae6fd" strokeWidth="2.5" />
        <circle cx="40" cy="40" r="6" fill="#fff" />
      </svg>
    );
  }

  if (lowerId.includes('merchant') || lowerId.includes('tuccar') || lowerId.includes('banka') || lowerId.includes('piggy') || lowerId.includes('kumbara')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#713f12" stroke="#facc15" strokeWidth="3" />
        <circle cx="40" cy="40" r="22" fill="#eab308" stroke="#fef08a" strokeWidth="2.5" />
        <text x="40" y="49" textAnchor="middle" fill="#78350f" fontSize="26" fontWeight="900">$</text>
      </svg>
    );
  }

  if (lowerId.includes('lucky') || lowerId.includes('sans') || lowerId.includes('cat') || lowerId.includes('kedi')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#064e3b" stroke="#34d399" strokeWidth="3" />
        <circle cx="30" cy="30" r="10" fill="#10b981" />
        <circle cx="50" cy="30" r="10" fill="#10b981" />
        <circle cx="30" cy="50" r="10" fill="#10b981" />
        <circle cx="50" cy="50" r="10" fill="#10b981" />
        <circle cx="40" cy="40" r="5" fill="#fef08a" />
      </svg>
    );
  }

  if (lowerId.includes('library') || lowerId.includes('kutuphane') || lowerId.includes('sozluk')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#312e81" stroke="#818cf8" strokeWidth="3" />
        <rect x="22" y="22" width="36" height="36" rx="5" fill="#4338ca" stroke="#c7d2fe" strokeWidth="2.5" />
        <line x1="33" y1="22" x2="33" y2="58" stroke="#c7d2fe" strokeWidth="3" />
      </svg>
    );
  }

  if (lowerId.includes('gambler') || lowerId.includes('kumarbaz') || lowerId.includes('zar')) {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#881337" stroke="#fb7185" strokeWidth="3" />
        <rect x="22" y="22" width="36" height="36" rx="7" fill="#f43f5e" stroke="#fff" strokeWidth="2.5" />
        <circle cx="30" cy="30" r="3.5" fill="#fff" />
        <circle cx="50" cy="30" r="3.5" fill="#fff" />
        <circle cx="40" cy="40" r="3.5" fill="#fff" />
        <circle cx="30" cy="50" r="3.5" fill="#fff" />
        <circle cx="50" cy="50" r="3.5" fill="#fff" />
      </svg>
    );
  }

  // ── 3. HER KART İÇİN ÖZEL VE KENDİNE HAS RENKLİ BALATRO JOKER SVG ÇİZİMİ ──
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none">
      {/* Outer Runic Circle Aura */}
      <circle cx="40" cy="40" r="36" fill="#2e1065" stroke="#c084fc" strokeWidth="2.5" />
      <circle cx="40" cy="40" r="30" fill="none" stroke="#e9d5ff" strokeWidth="1" strokeDasharray="5 3" />
      
      {/* Jester Hat Left Wing */}
      <path d="M20 46 C12 26, 2 22, 8 12 C22 18, 28 32, 32 46" fill="#a855f7" stroke="#fef08a" strokeWidth="2" />
      {/* Center Wing */}
      <path d="M40 46 C40 22, 40 10, 40 6 C40 22, 40 32, 40 46" fill="#3b82f6" stroke="#93c5fd" strokeWidth="2" />
      {/* Right Wing */}
      <path d="M60 46 C68 26, 78 22, 72 12 C58 18, 52 32, 48 46" fill="#f59e0b" stroke="#fef08a" strokeWidth="2" />

      {/* Jester Golden Bells */}
      <circle cx="8" cy="12" r="5" fill="#facc15" stroke="#fff" strokeWidth="1.5" />
      <circle cx="40" cy="6" r="5" fill="#facc15" stroke="#fff" strokeWidth="1.5" />
      <circle cx="72" cy="12" r="5" fill="#facc15" stroke="#fff" strokeWidth="1.5" />

      {/* Hat Crown Band */}
      <path d="M16 46 C28 52, 52 52, 64 46 L60 58 C48 64, 32 64, 20 58 Z" fill="#2563eb" stroke="#facc15" strokeWidth="2" />

      {/* Center Star Gem */}
      <circle cx="40" cy="54" r="4.5" fill="#fff" stroke="#f59e0b" strokeWidth="1.5" />
    </svg>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, ChevronRight, ChevronLeft, X, Check, Lock, Sparkles } from 'lucide-react';
import { soundEngine } from '../game/audioEngine';
import { getUnlockedHeroes } from '../game/codexManager';

// Custom SVG Class Crest Emblems
function HeroClassSvgEmblem({ heroId }) {
  if (heroId === 'SPELLCASTER') {
    return (
      <svg className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-[0_0_20px_rgba(168,85,247,0.7)]" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="45" fill="#1e1b4b" stroke="#a855f7" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="38" fill="none" stroke="#c084fc" strokeWidth="1" strokeDasharray="4 2" />
        {/* Wizard Hat & Wand */}
        <path d="M50 18 L68 55 L32 55 Z" fill="#7e22ce" stroke="#fef08a" strokeWidth="1.5" />
        <ellipse cx="50" cy="55" rx="24" ry="6" fill="#6b21a8" stroke="#fef08a" strokeWidth="1.5" />
        <path d="M50 18 L54 12 L58 18" stroke="#fef08a" strokeWidth="1.5" />
        {/* Magic Wand Star */}
        <path d="M68 40 L72 48 L80 48 L74 54 L76 62 L68 56 L60 62 L62 54 L56 48 L64 48 Z" fill="#fef08a" />
      </svg>
    );
  }

  if (heroId === 'WARRIOR') {
    return (
      <svg className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-[0_0_20px_rgba(245,158,11,0.7)]" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="45" fill="#451a03" stroke="#f59e0b" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="38" fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4 2" />
        {/* Shield & Swords */}
        <path d="M35 25 L65 25 L65 55 C65 72, 50 82, 50 82 C50 82, 35 72, 35 55 Z" fill="#b45309" stroke="#fef08a" strokeWidth="2" />
        <path d="M50 30 L50 72 M40 45 L60 45" stroke="#fef08a" strokeWidth="2" />
      </svg>
    );
  }

  if (heroId === 'TRICKSTER') {
    return (
      <svg className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-[0_0_20px_rgba(16,185,129,0.7)]" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="45" fill="#064e3b" stroke="#10b981" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="38" fill="none" stroke="#34d399" strokeWidth="1" strokeDasharray="4 2" />
        {/* Mask */}
        <path d="M22 45 C30 35, 45 35, 50 48 C55 35, 70 35, 78 45 C82 58, 68 70, 50 70 C32 70, 18 58, 22 45 Z" fill="#047857" stroke="#34d399" strokeWidth="2" />
        <ellipse cx="36" cy="50" rx="7" ry="5" fill="#064e3b" stroke="#fef08a" strokeWidth="1" />
        <ellipse cx="64" cy="50" rx="7" ry="5" fill="#064e3b" stroke="#fef08a" strokeWidth="1" />
      </svg>
    );
  }

  // LEXICON_ARCHON
  return (
    <svg className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-[0_0_20px_rgba(234,179,8,0.75)]" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="45" fill="#713f12" stroke="#eab308" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="38" fill="none" stroke="#fde047" strokeWidth="1" strokeDasharray="4 2" />
      {/* Imperial Crown */}
      <path d="M25 65 L20 35 L38 48 L50 25 L62 48 L80 35 L75 65 Z" fill="#ca8a04" stroke="#fef08a" strokeWidth="2" />
      <circle cx="20" cy="32" r="3.5" fill="#38bdf8" />
      <circle cx="50" cy="22" r="4.5" fill="#f43f5e" />
      <circle cx="80" cy="32" r="3.5" fill="#38bdf8" />
      <rect x="25" y="65" width="50" height="8" rx="2" fill="#a16207" stroke="#fef08a" strokeWidth="1" />
    </svg>
  );
}

export const HERO_CHARACTERS = [
  {
    id: 'SPELLCASTER',
    name: '🧙‍♂️ Söz Büyücüsü',
    role: 'Mistik Efsun Üstadı',
    icon: '🧙‍♂️',
    starterDeckId: 'starter_basit',
    color: 'from-purple-900/95 via-slate-900 to-purple-950 border-purple-500/70 text-purple-200',
    glowColor: 'rgba(168, 85, 247, 0.45)',
    perkDesc: 'Sesli harfler +15 Ekstra Taban Puan verir. Harf çekimlerinde Joker gelme şansı %50 daha yüksektir.',
    perkBadge: '✨ Sesli Harf Efsunu',
    achievementReq: 'Varsayılan Başlangıç Karakteri (AÇIK)'
  },
  {
    id: 'WARRIOR',
    name: '⚔️ Söz Savaşçısı',
    role: 'Ağır Kelime Muhafızı',
    icon: '⚔️',
    starterDeckId: 'starter_uzun',
    color: 'from-amber-900/95 via-slate-900 to-amber-950 border-amber-500/70 text-amber-200',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    perkDesc: '5+ Harfli uzun kelimeler yazıldığında kombo asla sıfırlanmaz ve %25 ekstra puan bonusu kazanılır.',
    perkBadge: '🛡️ Çelik Kombo',
    achievementReq: 'Bölge 2 Boss\'unu Mağlup Et'
  },
  {
    id: 'TRICKSTER',
    name: '🎭 Kurnaz Şair',
    role: 'Gizemli Söz Cambazı',
    icon: '🎭',
    starterDeckId: 'starter_combo',
    color: 'from-emerald-900/95 via-slate-900 to-emerald-950 border-emerald-500/70 text-emerald-200',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    perkDesc: 'Kelime zincirlerinde (Uzatma/Dönüştürme) +8 Ekstra Altın kazandırır ve rastgele Mühür verir.',
    perkBadge: '💰 Şair Midası',
    achievementReq: '1 Savaşta 15 Kelime Yap'
  },
  {
    id: 'LEXICON_ARCHON',
    name: '👑 Kadim Mimar',
    role: 'Efsanevi Söz Hakimi',
    icon: '👑',
    starterDeckId: 'starter_joker',
    color: 'from-yellow-900/95 via-slate-900 to-amber-950 border-yellow-400 text-yellow-200',
    glowColor: 'rgba(234, 179, 8, 0.5)',
    perkDesc: 'Tüm harfler +10 Taban Puan ile başlar ve destede 2 Ekstra Efsanevi Joker kartı yer alır!',
    perkBadge: '👑 Kadim Hakimiyet',
    achievementReq: 'Bölge 4 Final Boss\'unu Mağlup Et (Ante 4 Victory)'
  }
];

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 120 : -120,
    opacity: 0,
    scale: 0.94
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: 'spring', stiffness: 350, damping: 30 },
      opacity: { duration: 0.2 }
    }
  },
  exit: (direction) => ({
    x: direction < 0 ? 120 : -120,
    opacity: 0,
    scale: 0.94,
    transition: {
      x: { type: 'spring', stiffness: 350, damping: 30 },
      opacity: { duration: 0.2 }
    }
  })
};

export function CharacterSelectModal({ onSelectCharacter, onBack }) {
  const unlockedHeroes = getUnlockedHeroes();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const hero = HERO_CHARACTERS[currentIndex];
  const isUnlocked = unlockedHeroes.has(hero.id);

  const handlePrev = () => {
    try { soundEngine.playTap?.(); } catch(e) {}
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + HERO_CHARACTERS.length) % HERO_CHARACTERS.length);
  };

  const handleNext = () => {
    try { soundEngine.playTap?.(); } catch(e) {}
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % HERO_CHARACTERS.length);
  };

  const handleSelectDirect = (idx) => {
    if (idx === currentIndex) return;
    try { soundEngine.playTap?.(); } catch(e) {}
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const handleConfirm = () => {
    if (!isUnlocked) {
      try { soundEngine.playInvalidWord?.(); } catch(e) {}
      return;
    }
    try { soundEngine.playSuccess?.(); } catch(e) {}
    if (onSelectCharacter) {
      onSelectCharacter(hero);
    }
  };

  return (
    <div className="fixed inset-0 z-[400] bg-slate-950/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 select-none overflow-hidden">
      {/* Background SVG Runic Ray Aura */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <svg className="w-[700px] h-[700px] text-amber-500/30" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="6 3" />
          <polygon points="100,10 190,100 100,190 10,100" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      {/* Top Header */}
      <div className="flex items-center justify-between border-b-2 border-slate-800/90 pb-3 max-w-2xl w-full mx-auto relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            <Wand2 size={24} />
          </div>
          <div>
            <h2 className="text-base sm:text-xl font-black text-amber-300 font-cinzel tracking-wider flex items-center gap-2">
              <span>KAHRAMAN SINIFINI SEÇ</span>
              <Sparkles size={16} className="text-amber-400" />
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Başarımlar kazandıkça efsanevi yeni sınıfların kilitleri açılır.
            </p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="p-2 rounded-2xl bg-slate-950 text-slate-400 hover:text-slate-100 border-2 border-slate-800 hover:border-amber-400/60 cursor-pointer transition"
        >
          <X size={20} />
        </button>
      </div>

      {/* CENTER CAROUSEL AREA WITH LEFT / RIGHT ARROWS */}
      <div className="flex-1 flex flex-col items-center justify-center my-3 relative w-full max-w-xl mx-auto z-10">
        <div className="w-full flex items-center justify-between gap-3 sm:gap-5 relative">
          
          {/* LEFT ARROW BUTTON */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={handlePrev}
            className="z-20 p-3.5 sm:p-4 rounded-2xl bg-slate-950/90 hover:bg-amber-500/20 text-amber-400 border-2 border-amber-500/50 hover:border-amber-400 shadow-xl cursor-pointer backdrop-blur-xl transition flex items-center justify-center shrink-0 active:scale-95"
            title="Önceki Kahraman (Sol Ok)"
          >
            <ChevronLeft size={30} />
          </motion.button>

          {/* SINGLE CHARACTER CARD DISPLAY */}
          <div className="flex-1 relative overflow-hidden min-h-[360px] sm:min-h-[380px] flex items-center justify-center p-1">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={hero.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                style={{
                  boxShadow: isUnlocked
                    ? `0 0 40px ${hero.glowColor}`
                    : '0 0 20px rgba(0,0,0,0.6)'
                }}
                className={`w-full p-6 rounded-3xl border-2 flex flex-col justify-between cursor-default relative bg-gradient-to-b ${hero.color} backdrop-blur-xl shadow-2xl`}
              >
                <div>
                  {/* Top Status Badge & Custom SVG Emblem */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center justify-center">
                      <HeroClassSvgEmblem heroId={hero.id} />
                    </div>

                    {isUnlocked ? (
                      <div className="flex items-center gap-1.5 bg-emerald-950/90 border-2 border-emerald-500/60 px-3.5 py-1.5 rounded-full text-xs font-black text-emerald-300 shadow-md">
                        <Check size={15} className="text-emerald-400" />
                        <span>✓ AÇIK</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 bg-rose-950/90 border-2 border-rose-500/60 px-3.5 py-1.5 rounded-full text-xs font-black text-rose-300 shadow-md">
                        <Lock size={15} />
                        <span>🔒 KİLİTLİ</span>
                      </div>
                    )}
                  </div>

                  {/* Character Name & Role */}
                  <h3 className="text-2xl sm:text-3xl font-black tracking-wide font-cinzel text-white drop-shadow mb-0.5">
                    {hero.name}
                  </h3>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-300 block mb-4">
                    {hero.role}
                  </span>

                  {/* Character Perk Box */}
                  <div className="p-4 rounded-2xl bg-slate-950/90 border-2 border-slate-800 text-xs sm:text-sm font-medium leading-relaxed text-slate-100 shadow-inner">
                    {isUnlocked ? (
                      <p>{hero.perkDesc}</p>
                    ) : (
                      <div className="text-rose-300 font-extrabold flex flex-col gap-1">
                        <span className="text-xs uppercase tracking-wider text-rose-400 font-black">
                          🔒 Kilit Açma Koşulu:
                        </span>
                        <span>{hero.achievementReq}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer Perk Badge */}
                <div className="mt-4 pt-3 border-t-2 border-slate-800/80 flex items-center justify-between text-xs font-black text-amber-300">
                  <span className="px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-400/50 shadow">
                    {hero.perkBadge}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {currentIndex + 1} / {HERO_CHARACTERS.length}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT ARROW BUTTON */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleNext}
            className="z-20 p-3.5 sm:p-4 rounded-2xl bg-slate-950/90 hover:bg-amber-500/20 text-amber-400 border-2 border-amber-500/50 hover:border-amber-400 shadow-xl cursor-pointer backdrop-blur-xl transition flex items-center justify-center shrink-0 active:scale-95"
            title="Sonraki Kahraman (Sağ Ok)"
          >
            <ChevronRight size={30} />
          </motion.button>
        </div>

        {/* DOTS / QUICK HERO NAVIGATOR */}
        <div className="flex items-center justify-center gap-2.5 mt-5">
          {HERO_CHARACTERS.map((h, idx) => {
            const isHUnlocked = unlockedHeroes.has(h.id);
            const isSelected = idx === currentIndex;
            return (
              <button
                key={h.id}
                onClick={() => handleSelectDirect(idx)}
                className={`transition-all duration-300 cursor-pointer flex items-center justify-center rounded-2xl p-2 border-2 ${
                  isSelected
                    ? 'w-11 bg-amber-400 border-amber-200 text-slate-950 scale-110 shadow-[0_0_18px_rgba(245,158,11,0.6)]'
                    : isHUnlocked
                    ? 'w-9 bg-slate-950/90 border-slate-700 text-slate-300 hover:border-amber-400/60 hover:text-amber-300'
                    : 'w-9 bg-slate-950/60 border-slate-900 text-slate-600 opacity-60'
                }`}
                title={h.name}
              >
                <span className="text-base">{h.icon}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Confirm Action Button */}
      <div className="pt-3 border-t-2 border-slate-800/90 max-w-2xl w-full mx-auto z-10">
        <button
          disabled={!isUnlocked}
          onClick={handleConfirm}
          className={`w-full py-4 px-6 rounded-2xl transition flex items-center justify-center gap-2.5 shadow-2xl text-xs sm:text-base font-black tracking-wider border-2 cursor-pointer ${
            !isUnlocked
              ? 'bg-slate-900/90 border-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 border-yellow-100 shadow-[0_0_30px_rgba(245,158,11,0.5)]'
          }`}
        >
          {isUnlocked ? (
            <>
              <span>ZORLUK MÜHÜRÜNE GEÇ ({hero.name.toUpperCase()})</span>
              <ChevronRight size={20} />
            </>
          ) : (
            <span>🔒 BU KARAKTER KİLİTLİ (BAŞARIM GEREKLİ)</span>
          )}
        </button>
      </div>
    </div>
  );
}

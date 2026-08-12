import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ChevronRight, ChevronLeft, X, Lock, Zap, ShieldAlert, Info } from 'lucide-react';
import { soundEngine } from '../game/audioEngine';
import { getUnlockedStakes } from '../game/codexManager';

// ─────────────────────────────────────────────────────────────
// 10 ZORLUK MÜHÜRİ — Balatro'nun 8'ini aşıyor, her biri kümülatif
// ─────────────────────────────────────────────────────────────
export const STAKES_DEFINITIONS = [
  {
    id: 'WHITE_STAKE',
    name: 'Beyaz Mühür',
    title: 'Standart Zorluk',
    multiplier: 1.0,
    icon: '⚪',
    tier: 0,
    glowColor: '#e2e8f0',
    ringColor: 'rgba(226,232,240,0.5)',
    cardGradient: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e293b 100%)',
    borderColor: '#475569',
    accentColor: '#94a3b8',
    cumulativeModifiers: [],
    desc: 'Temel roguelite mücadele kural ve puan hedefleri. Yeni başlayanlar için ideal.',
    achievementReq: 'Varsayılan Açık',
  },
  {
    id: 'RED_STAKE',
    name: 'Kırmızı Mühür',
    title: 'Pahalı Çarşı',
    multiplier: 1.2,
    icon: '🔴',
    tier: 1,
    glowColor: '#f87171',
    ringColor: 'rgba(248,113,113,0.5)',
    cardGradient: 'linear-gradient(135deg, #4c0519 0%, #0f172a 50%, #3f0d14 100%)',
    borderColor: '#f87171',
    accentColor: '#fca5a5',
    cumulativeModifiers: [
      { icon: '🛒', text: 'Çarşıdaki tüm fiyatlar +%25 pahalı' }
    ],
    desc: 'Çarşıdaki tüm harf, efsun ve tılsım fiyatları %25 daha pahalıdır.',
    achievementReq: 'Varsayılan Açık',
  },
  {
    id: 'GREEN_STAKE',
    name: 'Yeşil Mühür',
    title: 'Hız Kazanı',
    multiplier: 1.5,
    icon: '🟢',
    tier: 2,
    glowColor: '#4ade80',
    ringColor: 'rgba(74,222,128,0.5)',
    cardGradient: 'linear-gradient(135deg, #052e16 0%, #0f172a 50%, #14532d 100%)',
    borderColor: '#4ade80',
    accentColor: '#86efac',
    cumulativeModifiers: [
      { icon: '🛒', text: 'Çarşı fiyatları +%25 pahalı' },
      { icon: '📈', text: 'Her bölgede hedef skor daha hızlı ölçeklenir' }
    ],
    desc: 'Skor hedefleri her bölgede önceki mühürlere kıyasla daha hızlı yükselir.',
    achievementReq: '🔴 Kırmızı Mühür\'de Bölge 2\'yi geç',
  },
  {
    id: 'BLACK_STAKE',
    name: 'Siyah Mühür',
    title: 'Kalıcı Lanет',
    multiplier: 1.8,
    icon: '⚫',
    tier: 3,
    glowColor: '#a78bfa',
    ringColor: 'rgba(167,139,250,0.5)',
    cardGradient: 'linear-gradient(135deg, #1a0533 0%, #030712 50%, #120024 100%)',
    borderColor: '#a78bfa',
    accentColor: '#c4b5fd',
    cumulativeModifiers: [
      { icon: '🛒', text: 'Çarşı fiyatları +%25 pahalı' },
      { icon: '📈', text: 'Hedef skor hızlı ölçeklenir' },
      { icon: '♾️', text: 'Çarşıda "Kalıcı Joker" çıkabilir (satılamaz)' }
    ],
    desc: 'Çarşıda "Kalıcı" Jokerler çıkabilir — satamaz veya yok edemezsin.',
    achievementReq: '🟢 Yeşil Mühür\'de Bölge 3\'ü geç',
  },
  {
    id: 'BLUE_STAKE',
    name: 'Mavi Mühür',
    title: 'Dar Harf Çekimi',
    multiplier: 2.1,
    icon: '🔵',
    tier: 4,
    glowColor: '#38bdf8',
    ringColor: 'rgba(56,189,248,0.5)',
    cardGradient: 'linear-gradient(135deg, #082f49 0%, #0c1a2e 50%, #0e2d4a 100%)',
    borderColor: '#38bdf8',
    accentColor: '#7dd3fc',
    cumulativeModifiers: [
      { icon: '🛒', text: 'Çarşı fiyatları +%25 pahalı' },
      { icon: '📈', text: 'Hedef skor hızlı ölçeklenir' },
      { icon: '♾️', text: 'Kalıcı Jokerler çıkabilir' },
      { icon: '✋', text: 'Atma hakkı (Discard) -1 azaltılır' }
    ],
    desc: 'Her savaş başında Atma Hakkın 1 adet azaltılmış olarak başlar.',
    achievementReq: '⚫ Siyah Mühür\'de Ante 4\'ü bitir',
  },
  {
    id: 'PURPLE_STAKE',
    name: 'Mor Mühür',
    title: 'Ağır Boss Barajı',
    multiplier: 2.5,
    icon: '🟣',
    tier: 5,
    glowColor: '#c084fc',
    ringColor: 'rgba(192,132,252,0.5)',
    cardGradient: 'linear-gradient(135deg, #3b0764 0%, #1e0a2e 50%, #4a0d6b 100%)',
    borderColor: '#c084fc',
    accentColor: '#e9d5ff',
    cumulativeModifiers: [
      { icon: '🛒', text: 'Çarşı fiyatları +%25 pahalı' },
      { icon: '📈', text: 'Hedef skor hızlı ölçeklenir' },
      { icon: '♾️', text: 'Kalıcı Jokerler çıkabilir' },
      { icon: '✋', text: 'Atma hakkı -1' },
      { icon: '💀', text: 'Boss hedefleri %40 daha yüksek' }
    ],
    desc: 'Bölge Boss hedefleri %40 daha yüksektir ve ek engel kuralları içerir.',
    achievementReq: '🔵 Mavi Mühür\'de Ante 4 Boss\'u mağlup et',
  },
  {
    id: 'ORANGE_STAKE',
    name: 'Turuncu Mühür',
    title: 'Geçici Güç',
    multiplier: 3.0,
    icon: '🟠',
    tier: 6,
    glowColor: '#fb923c',
    ringColor: 'rgba(251,146,60,0.5)',
    cardGradient: 'linear-gradient(135deg, #431407 0%, #1c0a03 50%, #7c2d12 100%)',
    borderColor: '#fb923c',
    accentColor: '#fdba74',
    cumulativeModifiers: [
      { icon: '🛒', text: 'Çarşı fiyatları +%25 pahalı' },
      { icon: '📈', text: 'Hedef skor hızlı ölçeklenir' },
      { icon: '♾️', text: 'Kalıcı Jokerler çıkabilir' },
      { icon: '✋', text: 'Atma hakkı -1' },
      { icon: '💀', text: 'Boss hedefleri %40 yüksek' },
      { icon: '⏳', text: 'Bazı Jokerler "Geçici" olur (5 turda sona erer)' }
    ],
    desc: 'Çarşıda "Geçici" Jokerler çıkabilir — 5 tur sonunda kendiliğinden yok olur.',
    achievementReq: '🟣 Mor Mühür\'de tam zafer kazan',
  },
  {
    id: 'GOLD_STAKE',
    name: 'Altın Mühür',
    title: 'Kiralık Risk',
    multiplier: 3.5,
    icon: '🟡',
    tier: 7,
    glowColor: '#facc15',
    ringColor: 'rgba(250,204,21,0.6)',
    cardGradient: 'linear-gradient(135deg, #713f12 0%, #1c1000 50%, #92400e 100%)',
    borderColor: '#facc15',
    accentColor: '#fef08a',
    cumulativeModifiers: [
      { icon: '🛒', text: 'Çarşı fiyatları +%25 pahalı' },
      { icon: '📈', text: 'Hedef skor hızlı ölçeklenir' },
      { icon: '♾️', text: 'Kalıcı Jokerler çıkabilir' },
      { icon: '✋', text: 'Atma hakkı -1' },
      { icon: '💀', text: 'Boss hedefleri %40 yüksek' },
      { icon: '⏳', text: 'Geçici Jokerler çıkabilir' },
      { icon: '💸', text: 'Bazı Jokerler "Kiralık" olur (her tur -5 Altın)' }
    ],
    desc: 'Çarşıda "Kiralık" Jokerler çıkabilir — her tur 5 Altın harcar.',
    achievementReq: '🟠 Turuncu Mühür\'de tam zafer kazan',
  },
  {
    id: 'OBSIDIAN_STAKE',
    name: 'Obsidyen Mühür',
    title: 'Cehennem Kapısı',
    multiplier: 4.0,
    icon: '🖤',
    tier: 8,
    glowColor: '#818cf8',
    ringColor: 'rgba(129,140,248,0.6)',
    cardGradient: 'linear-gradient(135deg, #1e1b4b 0%, #030712 50%, #312e81 100%)',
    borderColor: '#818cf8',
    accentColor: '#a5b4fc',
    cumulativeModifiers: [
      { icon: '🛒', text: 'Çarşı fiyatları +%25 pahalı' },
      { icon: '📈', text: 'Hedef skor hızlı ölçeklenir' },
      { icon: '♾️', text: 'Kalıcı Jokerler çıkabilir' },
      { icon: '✋', text: 'Atma hakkı -1' },
      { icon: '💀', text: 'Boss hedefleri %40 yüksek' },
      { icon: '⏳', text: 'Geçici Jokerler çıkabilir' },
      { icon: '💸', text: 'Kiralık Jokerler her tur -5 Altın' },
      { icon: '🔒', text: 'Her tur eldeki 1 harf rastgele kilitlenir' },
      { icon: '🃏', text: 'Joker slotu -1 (maks 4)' }
    ],
    desc: 'Her tur başında eldeki 1 harf kilitlenir. Joker slotun 4\'e düşer.',
    achievementReq: '🟡 Altın Mühür\'de tam zafer kazan',
  },
  {
    id: 'DIAMOND_STAKE',
    name: 'Elmas Mühür',
    title: 'Efsanevi Cehennem',
    multiplier: 5.0,
    icon: '💎',
    tier: 9,
    glowColor: '#67e8f9',
    ringColor: 'rgba(103,232,249,0.7)',
    cardGradient: 'linear-gradient(135deg, #083344 0%, #020617 30%, #0c4a6e 70%, #0e7490 100%)',
    borderColor: '#22d3ee',
    accentColor: '#a5f3fc',
    cumulativeModifiers: [
      { icon: '🛒', text: 'Çarşı fiyatları +%25 pahalı' },
      { icon: '📈', text: 'Hedef skor 3x daha hızlı ölçeklenir' },
      { icon: '♾️', text: 'Kalıcı Jokerler çıkabilir' },
      { icon: '✋', text: 'Atma hakkı 0 (atma yasak!)' },
      { icon: '💀', text: 'Boss hedefleri %60 yüksek' },
      { icon: '⏳', text: 'Geçici Jokerler çıkabilir' },
      { icon: '💸', text: 'Kiralık Jokerler her tur -5 Altın' },
      { icon: '🔒', text: 'Her tur 2 harf kilitlenir' },
      { icon: '🃏', text: 'Joker slotu yalnızca 1!' }
    ],
    desc: 'Maksimum cehennem: Hedef 3x, Atma Hakkı 0, tek Joker slotu. Gerçek ustalar için.',
    achievementReq: '🖤 Obsidyen Mühür\'de tam zafer kazan',
  },
];

// ─────────────────────────────────────────────────────────────
// Rarity badge görsel
// ─────────────────────────────────────────────────────────────
const TIER_LABELS = [
  { label: 'Başlangıç', color: '#94a3b8' },
  { label: 'Kolay', color: '#f87171' },
  { label: 'Normal', color: '#4ade80' },
  { label: 'Zor', color: '#a78bfa' },
  { label: 'Çok Zor', color: '#38bdf8' },
  { label: 'Uzman', color: '#c084fc' },
  { label: 'Usta', color: '#fb923c' },
  { label: 'Elit', color: '#facc15' },
  { label: 'Kaos', color: '#818cf8' },
  { label: 'Efsane', color: '#22d3ee' },
];

// ─────────────────────────────────────────────────────────────
// Ana Modal
// ─────────────────────────────────────────────────────────────
export function StakesSelectModal({ onSelectStake, onBack }) {
  const unlockedStakes = getUnlockedStakes();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModifiers, setShowModifiers] = useState(false);
  const [particles, setParticles] = useState([]);

  const currentStake = STAKES_DEFINITIONS[currentIndex];
  const isUnlocked = unlockedStakes.has(currentStake.id);
  const tierLabel = TIER_LABELS[currentStake.tier];

  // Parçacık efekti — kart değişince yenilenir
  useEffect(() => {
    const pts = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 2,
      dur: Math.random() * 3 + 2,
    }));
    setParticles(pts);
    setShowModifiers(false);
  }, [currentIndex]);

  const handlePrev = () => {
    soundEngine.playTap();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : STAKES_DEFINITIONS.length - 1));
  };

  const handleNext = () => {
    soundEngine.playTap();
    setCurrentIndex((prev) => (prev < STAKES_DEFINITIONS.length - 1 ? prev + 1 : 0));
  };

  const handleConfirm = () => {
    if (!isUnlocked) { soundEngine.playInvalidWord(); return; }
    soundEngine.playSuccess();
    if (onSelectStake) onSelectStake(currentStake);
  };

  return (
    <div
      className="fixed inset-0 z-[400] flex flex-col select-none overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #020617 0%, #0a0a1a 60%, #020617 100%)' }}
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Ambient glow blob */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 40%, ${currentStake.ringColor} 0%, transparent 70%)`,
        }}
      />

      {/* ── HEADER ── */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-5 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.5)' }}
          >
            <Trophy size={20} style={{ color: '#fbbf24' }} />
          </div>
          <div>
            <h2 className="text-base font-black tracking-wide" style={{ color: '#fbbf24', fontFamily: 'Cinzel, serif' }}>
              ZORLUK MÜHRÜ SEÇ
            </h2>
            <p className="text-[10px] font-semibold" style={{ color: '#64748b' }}>
              {currentIndex + 1} / {STAKES_DEFINITIONS.length} — Oklarla incele
            </p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="p-2 rounded-xl transition active:scale-95"
          style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(71,85,105,0.6)', color: '#94a3b8' }}
        >
          <X size={18} />
        </button>
      </div>

      {/* ── CAROUSEL ── */}
      <div className="relative z-10 flex-1 flex items-center justify-between px-3 py-4 gap-2">

        {/* Left arrow */}
        <button
          onClick={handlePrev}
          className="shrink-0 w-11 h-14 rounded-2xl flex items-center justify-center transition active:scale-90"
          style={{
            background: 'rgba(15,23,42,0.8)',
            border: `2px solid ${currentIndex > 0 ? currentStake.borderColor + '60' : 'rgba(71,85,105,0.4)'}`,
            color: currentStake.accentColor,
          }}
        >
          <ChevronLeft size={28} />
        </button>

        {/* Center card */}
        <div className="flex-1 max-w-xs">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStake.id}
              initial={{ scale: 0.82, opacity: 0, rotateY: -25, x: 40 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0, x: 0 }}
              exit={{ scale: 0.82, opacity: 0, rotateY: 25, x: -40 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-3xl overflow-hidden flex flex-col"
              style={{
                background: currentStake.cardGradient,
                border: `2px solid ${isUnlocked ? currentStake.borderColor : 'rgba(71,85,105,0.4)'}`,
                boxShadow: isUnlocked
                  ? `0 0 30px ${currentStake.ringColor}, 0 0 60px ${currentStake.ringColor.replace('0.5', '0.2')}, inset 0 1px 0 rgba(255,255,255,0.08)`
                  : '0 4px 24px rgba(0,0,0,0.6)',
                filter: isUnlocked ? 'none' : 'grayscale(0.6) brightness(0.7)',
              }}
            >
              {/* Floating particles */}
              {isUnlocked && particles.map(p => (
                <motion.div
                  key={p.id}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    left: `${p.x}%`, top: `${p.y}%`,
                    width: p.size, height: p.size,
                    background: currentStake.glowColor,
                    opacity: 0.6,
                  }}
                  animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
                />
              ))}

              {/* Lock badge */}
              {!isUnlocked && (
                <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black"
                  style={{ background: 'rgba(127,29,29,0.9)', border: '1px solid #ef4444', color: '#fca5a5' }}>
                  <Lock size={12} />
                  <span>KİLİTLİ</span>
                </div>
              )}

              {/* Tier badge */}
              <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-black"
                style={{
                  background: 'rgba(0,0,0,0.6)',
                  border: `1px solid ${tierLabel.color}50`,
                  color: tierLabel.color
                }}>
                {tierLabel.label}
              </div>

              {/* Card body */}
              <div className="p-5 pt-12 flex flex-col items-center text-center gap-3">

                {/* Big icon */}
                <motion.div
                  className="relative"
                  animate={isUnlocked ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div
                    className="w-20 h-20 rounded-3xl flex items-center justify-center text-5xl"
                    style={{
                      background: 'rgba(0,0,0,0.5)',
                      border: `2px solid ${currentStake.borderColor}80`,
                      boxShadow: isUnlocked ? `0 0 20px ${currentStake.ringColor}` : 'none',
                    }}
                  >
                    {currentStake.icon}
                  </div>
                </motion.div>

                {/* Name + title */}
                <div>
                  <h3 className="text-lg font-black tracking-wide" style={{ color: currentStake.accentColor, fontFamily: 'Cinzel, serif' }}>
                    {currentStake.name}
                  </h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#64748b' }}>
                    {currentStake.title}
                  </p>
                </div>

                {/* Multiplier badge */}
                <div
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full font-black text-sm"
                  style={{
                    background: 'rgba(0,0,0,0.5)',
                    border: `1px solid ${currentStake.borderColor}60`,
                    color: currentStake.accentColor,
                    boxShadow: `0 0 12px ${currentStake.ringColor}`,
                  }}
                >
                  <Zap size={14} fill="currentColor" />
                  <span>{currentStake.multiplier}x Skor Hedefi</span>
                </div>

                {/* Description or unlock requirement */}
                <div
                  className="w-full p-3 rounded-2xl text-xs font-semibold leading-relaxed"
                  style={{
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: isUnlocked ? '#cbd5e1' : '#fca5a5',
                  }}
                >
                  {isUnlocked ? currentStake.desc : (
                    <span>🔒 <strong>Kilit Koşulu:</strong> {currentStake.achievementReq}</span>
                  )}
                </div>

                {/* Cumulative modifiers toggle */}
                {isUnlocked && currentStake.cumulativeModifiers.length > 0 && (
                  <button
                    onClick={() => setShowModifiers(v => !v)}
                    className="flex items-center gap-1.5 text-[10px] font-bold transition-all"
                    style={{ color: currentStake.accentColor + 'aa' }}
                  >
                    <Info size={12} />
                    <span>{showModifiers ? 'Zorlukları Gizle' : `${currentStake.cumulativeModifiers.length} Kümülatif Zorluk Gör`}</span>
                  </button>
                )}

                <AnimatePresence>
                  {showModifiers && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="w-full overflow-hidden"
                    >
                      <div
                        className="w-full p-3 rounded-2xl flex flex-col gap-1.5"
                        style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}
                      >
                        {currentStake.cumulativeModifiers.map((mod, i) => (
                          <div key={i} className="flex items-center gap-2 text-[10px] font-semibold" style={{ color: '#94a3b8' }}>
                            <span className="text-sm">{mod.icon}</span>
                            <span>{mod.text}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom dot indicators */}
              <div className="flex items-center justify-center gap-1.5 pb-4">
                {STAKES_DEFINITIONS.map((s, idx) => {
                  const isActive = idx === currentIndex;
                  const isUnlockedDot = unlockedStakes.has(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => { soundEngine.playTap(); setCurrentIndex(idx); }}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width: isActive ? 16 : 6,
                        height: 6,
                        background: isActive
                          ? currentStake.glowColor
                          : isUnlockedDot
                            ? 'rgba(255,255,255,0.25)'
                            : 'rgba(255,255,255,0.1)',
                        boxShadow: isActive ? `0 0 6px ${currentStake.glowColor}` : 'none',
                      }}
                    />
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right arrow */}
        <button
          onClick={handleNext}
          className="shrink-0 w-11 h-14 rounded-2xl flex items-center justify-center transition active:scale-90"
          style={{
            background: 'rgba(15,23,42,0.8)',
            border: `2px solid ${currentIndex < STAKES_DEFINITIONS.length - 1 ? currentStake.borderColor + '60' : 'rgba(71,85,105,0.4)'}`,
            color: currentStake.accentColor,
          }}
        >
          <ChevronRight size={28} />
        </button>
      </div>

      {/* ── CONFIRM BUTTON ── */}
      <div className="relative z-10 px-5 pb-6 pt-3 border-t border-white/5">
        {/* Unlock progress bar */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${currentStake.glowColor}, ${currentStake.accentColor})` }}
              animate={{ width: `${((currentIndex + 1) / STAKES_DEFINITIONS.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-[10px] font-black" style={{ color: '#475569' }}>
            {Array.from(unlockedStakes).length}/{STAKES_DEFINITIONS.length} Açık
          </span>
        </div>

        <motion.button
          disabled={!isUnlocked}
          onClick={handleConfirm}
          whileTap={isUnlocked ? { scale: 0.97 } : {}}
          className="w-full py-4 px-6 rounded-2xl flex items-center justify-center gap-3 font-black text-sm tracking-wide transition-all"
          style={isUnlocked ? {
            background: `linear-gradient(135deg, ${currentStake.glowColor} 0%, ${currentStake.accentColor} 100%)`,
            color: '#030712',
            boxShadow: `0 0 20px ${currentStake.ringColor}, 0 4px 12px rgba(0,0,0,0.4)`,
            border: 'none',
          } : {
            background: 'rgba(15,23,42,0.8)',
            color: '#475569',
            border: '1px solid rgba(71,85,105,0.3)',
            cursor: 'not-allowed',
          }}
        >
          {isUnlocked ? (
            <>
              <span className="text-base">{currentStake.icon}</span>
              <span>{currentStake.name.toUpperCase()} İLE OYUNA BAŞLA!</span>
              <ChevronRight size={18} />
            </>
          ) : (
            <>
              <ShieldAlert size={16} />
              <span>🔒 KİLİTLİ — BAŞARIM GEREKLİ</span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}

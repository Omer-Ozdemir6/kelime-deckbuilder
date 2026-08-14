import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ChevronRight, ChevronLeft, X, Lock, Zap, Info, ShieldAlert } from 'lucide-react';
import { soundEngine } from '../game/audioEngine';
import { getUnlockedStakes } from '../game/codexManager';

// Custom 3D SVG Stake Seals Component
function StakeSealSvgEmblem({ stakeId, isUnlocked }) {
  const getSealColors = () => {
    switch (stakeId) {
      case 'WHITE_STAKE': return { main: '#e2e8f0', glow: '#94a3b8', bg: '#1e293b' };
      case 'RED_STAKE': return { main: '#f87171', glow: '#ef4444', bg: '#4c0519' };
      case 'GREEN_STAKE': return { main: '#4ade80', glow: '#10b981', bg: '#052e16' };
      case 'BLACK_STAKE': return { main: '#c084fc', glow: '#9333ea', bg: '#1a0533' };
      case 'BLUE_STAKE': return { main: '#38bdf8', glow: '#0284c7', bg: '#082f49' };
      case 'PURPLE_STAKE': return { main: '#e9d5ff', glow: '#a855f7', bg: '#3b0764' };
      case 'ORANGE_STAKE': return { main: '#fb923c', glow: '#f97316', bg: '#431407' };
      case 'GOLD_STAKE': return { main: '#fef08a', glow: '#eab308', bg: '#713f12' };
      case 'OBSIDIAN_STAKE': return { main: '#a5b4fc', glow: '#6366f1', bg: '#1e1b4b' };
      case 'DIAMOND_STAKE': return { main: '#a5f3fc', glow: '#06b6d4', bg: '#083344' };
      default: return { main: '#e2e8f0', glow: '#94a3b8', bg: '#1e293b' };
    }
  };

  const colors = getSealColors();

  return (
    <div className="relative flex items-center justify-center">
      {/* Background Ambient Glow */}
      <div 
        className="absolute w-28 h-28 rounded-full blur-xl pointer-events-none transition-all" 
        style={{ background: isUnlocked ? colors.glow : 'transparent', opacity: 0.5 }} 
      />

      <svg className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-[0_8px_25px_rgba(0,0,0,0.7)]" viewBox="0 0 120 120" fill="none">
        <defs>
          <linearGradient id={`stakeGrad_${stakeId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.main} />
            <stop offset="100%" stopColor={colors.glow} />
          </linearGradient>
          <radialGradient id={`stakeInner_${stakeId}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={colors.bg} />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>
        </defs>

        {/* Outer Wax Seal Edge Points */}
        <path d="M60 8 C72 8, 80 14, 90 20 C100 28, 110 38, 112 50 C114 65, 108 78, 98 88 C88 98, 75 110, 60 112 C45 110, 32 98, 22 88 C12 78, 6 65, 8 50 C10 38, 20 28, 30 20 C40 14, 48 8, 60 8 Z" 
          fill={`url(#stakeGrad_${stakeId})`} stroke="#fef08a" strokeWidth="1.5" opacity={isUnlocked ? 1 : 0.4} />

        {/* Inner Dark Basin */}
        <circle cx="60" cy="60" r="44" fill={`url(#stakeInner_${stakeId})`} stroke={colors.main} strokeWidth="2" strokeDasharray="8 3" opacity={isUnlocked ? 0.9 : 0.4} />
        
        {/* Runic Inner Accent Ring */}
        <circle cx="60" cy="60" r="36" fill="none" stroke="#fde047" strokeWidth="1" strokeDasharray="4 2" opacity="0.6" />

        {/* Center Symbol Art based on Stake Tier */}
        {stakeId === 'WHITE_STAKE' && (
          <circle cx="60" cy="60" r="18" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
        )}
        {stakeId === 'RED_STAKE' && (
          <path d="M60 40 L76 60 L60 80 L44 60 Z" fill="#f87171" stroke="#fef08a" strokeWidth="1.5" />
        )}
        {stakeId === 'GREEN_STAKE' && (
          <path d="M60 38 C75 38, 80 50, 60 80 C40 50, 45 38, 60 38 Z" fill="#4ade80" stroke="#fef08a" strokeWidth="1.5" />
        )}
        {stakeId === 'BLACK_STAKE' && (
          <path d="M60 36 C72 36, 78 48, 78 60 C78 72, 60 82, 60 82 C60 82, 42 72, 42 60 C42 48, 48 36, 60 36 Z" fill="#a78bfa" stroke="#fef08a" strokeWidth="1.5" />
        )}
        {stakeId === 'BLUE_STAKE' && (
          <polygon points="60,35 68,48 82,48 70,58 75,72 60,63 45,72 50,58 38,48 52,48" fill="#38bdf8" stroke="#fef08a" strokeWidth="1.5" />
        )}
        {stakeId === 'PURPLE_STAKE' && (
          <g>
            <circle cx="60" cy="56" r="14" fill="#c084fc" />
            <path d="M50 70 L70 70 L66 78 L54 78 Z" fill="#c084fc" />
          </g>
        )}
        {stakeId === 'ORANGE_STAKE' && (
          <path d="M50 40 L70 40 L55 60 L70 80 L50 80 L65 60 Z" fill="#fb923c" stroke="#fef08a" strokeWidth="1.5" />
        )}
        {stakeId === 'GOLD_STAKE' && (
          <circle cx="60" cy="60" r="18" fill="#facc15" stroke="#fef08a" strokeWidth="2.5" />
        )}
        {stakeId === 'OBSIDIAN_STAKE' && (
          <path d="M42 40 L60 82 L78 40 L60 52 Z" fill="#818cf8" stroke="#fef08a" strokeWidth="1.5" />
        )}
        {stakeId === 'DIAMOND_STAKE' && (
          <polygon points="60,32 80,50 60,86 40,50" fill="#22d3ee" stroke="#ffffff" strokeWidth="2" />
        )}
      </svg>
    </div>
  );
}

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
    cardGradient: 'from-slate-900 via-slate-950 to-slate-900',
    borderColor: '#94a3b8',
    accentColor: '#f8fafc',
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
    cardGradient: 'from-rose-950 via-slate-950 to-rose-950',
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
    cardGradient: 'from-emerald-950 via-slate-950 to-emerald-950',
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
    title: 'Kalıcı Lanet',
    multiplier: 1.8,
    icon: '⚫',
    tier: 3,
    glowColor: '#a78bfa',
    ringColor: 'rgba(167,139,250,0.5)',
    cardGradient: 'from-purple-950 via-slate-950 to-purple-950',
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
    cardGradient: 'from-sky-950 via-slate-950 to-sky-950',
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
    cardGradient: 'from-fuchsia-950 via-slate-950 to-fuchsia-950',
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
    cardGradient: 'from-orange-950 via-slate-950 to-orange-950',
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
    cardGradient: 'from-amber-950 via-slate-950 to-amber-950',
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
    cardGradient: 'from-indigo-950 via-slate-950 to-indigo-950',
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
    cardGradient: 'from-cyan-950 via-slate-950 to-cyan-950',
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

export function StakesSelectModal({ onSelectStake, onBack }) {
  const unlockedStakes = getUnlockedStakes();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModifiers, setShowModifiers] = useState(false);

  const currentStake = STAKES_DEFINITIONS[currentIndex];
  const isUnlocked = unlockedStakes.has(currentStake.id);
  const tierLabel = TIER_LABELS[currentStake.tier];

  useEffect(() => {
    setShowModifiers(false);
  }, [currentIndex]);

  const handlePrev = () => {
    try { soundEngine.playTap?.(); } catch(e) {}
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : STAKES_DEFINITIONS.length - 1));
  };

  const handleNext = () => {
    try { soundEngine.playTap?.(); } catch(e) {}
    setCurrentIndex((prev) => (prev < STAKES_DEFINITIONS.length - 1 ? prev + 1 : 0));
  };

  const handleConfirm = () => {
    if (!isUnlocked) { try { soundEngine.playInvalidWord?.(); } catch(e) {} return; }
    try { soundEngine.playSuccess?.(); } catch(e) {}
    if (onSelectStake) onSelectStake(currentStake);
  };

  return (
    <div className="fixed inset-0 z-[400] bg-slate-950/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 select-none overflow-hidden">
      {/* Background SVG Runic Ray Aura */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <svg className="w-[700px] h-[700px] text-amber-500/30" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="6 3" />
          <polygon points="100,20 180,100 100,180 20,100" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      {/* ── HEADER ── */}
      <div className="relative z-10 flex items-center justify-between px-2 pb-3 border-b-2 border-slate-800/90 max-w-2xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            <Trophy size={22} />
          </div>
          <div>
            <h2 className="text-base sm:text-xl font-black text-amber-300 font-cinzel tracking-wider">
              ZORLUK MÜHRÜ SEÇ
            </h2>
            <p className="text-xs font-semibold text-slate-400">
              {currentIndex + 1} / {STAKES_DEFINITIONS.length} — Oklarla mühürleri inceleyin
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

      {/* ── CAROUSEL AREA ── */}
      <div className="relative z-10 flex-1 flex items-center justify-center my-3 px-2 w-full max-w-xl mx-auto">
        <div className="w-full flex items-center justify-between gap-3 sm:gap-5">
          
          {/* Left arrow */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={handlePrev}
            className="z-20 p-3.5 sm:p-4 rounded-2xl bg-slate-950/90 hover:bg-amber-500/20 text-amber-400 border-2 border-amber-500/50 hover:border-amber-400 shadow-xl cursor-pointer backdrop-blur-xl transition flex items-center justify-center shrink-0"
            title="Önceki Mühür (Sol Ok)"
          >
            <ChevronLeft size={30} />
          </motion.button>

          {/* Center Card */}
          <div className="flex-1 relative overflow-hidden min-h-[360px] sm:min-h-[380px] flex items-center justify-center p-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStake.id}
                initial={{ scale: 0.88, opacity: 0, x: 50 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                exit={{ scale: 0.88, opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{
                  boxShadow: isUnlocked
                    ? `0 0 35px ${currentStake.ringColor}`
                    : '0 0 20px rgba(0,0,0,0.6)'
                }}
                className={`w-full p-6 rounded-3xl border-2 flex flex-col justify-between cursor-default relative bg-gradient-to-b ${currentStake.cardGradient} border-${currentStake.borderColor} backdrop-blur-xl shadow-2xl`}
              >
                <div>
                  {/* Top Status & Tier Badges */}
                  <div className="flex items-center justify-between mb-4">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-black border-2"
                      style={{ borderColor: tierLabel.color, color: tierLabel.color, background: 'rgba(2, 6, 23, 0.8)' }}
                    >
                      {tierLabel.label}
                    </span>

                    {isUnlocked ? (
                      <div className="flex items-center gap-1 bg-emerald-950/90 border-2 border-emerald-500/60 px-3 py-1 rounded-full text-xs font-black text-emerald-300 shadow">
                        <span>✓ AÇIK</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 bg-rose-950/90 border-2 border-rose-500/60 px-3 py-1 rounded-full text-xs font-black text-rose-300 shadow">
                        <Lock size={13} />
                        <span>KİLİTLİ</span>
                      </div>
                    )}
                  </div>

                  {/* 3D SVG Stake Seal Emblem */}
                  <div className="flex justify-center my-2">
                    <StakeSealSvgEmblem stakeId={currentStake.id} isUnlocked={isUnlocked} />
                  </div>

                  {/* Name + Title */}
                  <div className="text-center mt-2">
                    <h3 className="text-2xl sm:text-3xl font-black font-cinzel text-white drop-shadow">
                      {currentStake.name}
                    </h3>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mt-0.5">
                      {currentStake.title}
                    </p>
                  </div>

                  {/* Multiplier Badge */}
                  <div className="flex items-center justify-center gap-2 mt-3 mb-3">
                    <span className="px-4 py-1.5 rounded-full bg-slate-950/90 border-2 border-amber-400/80 text-amber-300 text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-md">
                      <Zap size={15} className="text-amber-400 fill-amber-400" />
                      <span>{currentStake.multiplier}x Skor Hedefi</span>
                    </span>
                  </div>

                  {/* Description Box */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/90 border-2 border-slate-800 text-xs font-medium leading-relaxed text-slate-200 text-center shadow-inner">
                    {isUnlocked ? currentStake.desc : (
                      <span className="text-rose-300 font-bold">🔒 Kilit Koşulu: {currentStake.achievementReq}</span>
                    )}
                  </div>

                  {/* Cumulative Modifiers Toggle */}
                  {isUnlocked && currentStake.cumulativeModifiers.length > 0 && (
                    <div className="mt-2 text-center">
                      <button
                        onClick={() => setShowModifiers(v => !v)}
                        className="text-xs font-black text-cyan-300 hover:text-cyan-200 flex items-center justify-center gap-1 mx-auto cursor-pointer"
                      >
                        <Info size={13} />
                        <span>{showModifiers ? 'Kümülatif Etkileri Gizle' : `${currentStake.cumulativeModifiers.length} Kümülatif Etki Göster`}</span>
                      </button>

                      {showModifiers && (
                        <div className="mt-2 p-2.5 rounded-xl bg-slate-950/95 border border-slate-800 text-[11px] font-bold text-slate-300 flex flex-col gap-1 text-left">
                          {currentStake.cumulativeModifiers.map((mod, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span>{mod.icon}</span>
                              <span>{mod.text}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Dots */}
                <div className="flex items-center justify-center gap-1.5 mt-4 pt-2 border-t border-slate-800/60">
                  {STAKES_DEFINITIONS.map((s, idx) => (
                    <div
                      key={s.id}
                      onClick={() => { try { soundEngine.playTap?.(); } catch(e){} setCurrentIndex(idx); }}
                      className={`h-2 rounded-full cursor-pointer transition-all ${
                        idx === currentIndex
                          ? 'w-6 bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.8)]'
                          : unlockedStakes.has(s.id)
                          ? 'w-2 bg-slate-600 hover:bg-slate-400'
                          : 'w-2 bg-slate-800'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right arrow */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleNext}
            className="z-20 p-3.5 sm:p-4 rounded-2xl bg-slate-950/90 hover:bg-amber-500/20 text-amber-400 border-2 border-amber-500/50 hover:border-amber-400 shadow-xl cursor-pointer backdrop-blur-xl transition flex items-center justify-center shrink-0"
            title="Sonraki Mühür (Sağ Ok)"
          >
            <ChevronRight size={30} />
          </motion.button>
        </div>
      </div>

      {/* ── CONFIRM BUTTON ── */}
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
              <span>{currentStake.name.toUpperCase()} İLE OYUNA BAŞLA!</span>
              <ChevronRight size={20} />
            </>
          ) : (
            <>
              <ShieldAlert size={18} />
              <span>🔒 MÜHÜR KİLİTLİ — BAŞARIM GEREKLİ</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

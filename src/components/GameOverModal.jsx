import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Trophy, Coins, BookOpen, Sparkles, RefreshCw, Layers, Skull, ShieldAlert, Award } from 'lucide-react';
import { soundEngine } from '../game/audioEngine';
import { UnlockSequenceModal } from './UnlockSequenceModal';

function DefeatSkullEmblem() {
  return (
    <div className="relative w-20 h-20 flex items-center justify-center mb-2">
      {/* Outer Rotating Runic Aura */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-600/40 via-red-500/30 to-amber-500/20 animate-spin-slow blur-md" />
      
      {/* Container Shield */}
      <div className="relative w-full h-full rounded-3xl bg-gradient-to-b from-rose-900/90 via-slate-950 to-rose-950/90 border-2 border-rose-500/80 shadow-[0_0_35px_rgba(244,63,94,0.6)] flex items-center justify-center overflow-hidden">
        {/* Ambient SVG pattern inside shield */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#f43f5e" strokeWidth="1" strokeDasharray="4 2" />
          <path d="M50 5 L95 50 L50 95 L5 50 Z" fill="none" stroke="#f43f5e" strokeWidth="1" />
        </svg>

        {/* Skull SVG with glowing eye sockets */}
        <svg className="w-11 h-11 text-rose-400 drop-shadow-[0_0_15px_rgba(244,63,94,0.9)] animate-pulse" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C7.58 2 4 5.58 4 10c0 2.5 1.14 4.74 2.94 6.24L6.5 19c-.11.36.01.76.29 1.01.28.25.69.31 1.03.15l1.68-.84c.8.29 1.63.48 2.5.48s1.7-.19 2.5-.48l1.68.84c.34.17.75.1 1.03-.15.28-.25.4-.65.29-1.01l-.44-2.76C18.86 14.74 20 12.5 20 10c0-4.42-3.58-8-8-8zm-3 7c.83 0 1.5.67 1.5 1.5S9.83 12 9 12s-1.5-.67-1.5-1.5S8.17 9 9 9zm6 0c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm-5 7.5v-1h4v1h-4z"/>
        </svg>
      </div>
    </div>
  );
}

export function GameOverModal({
  stage = 1,
  currentScore = 0,
  totalRunGold = 0,
  totalRunWords = 0,
  runAchievements = [],
  runMetaUnlocks = [],
  onStartNewRun,
  onReturnToMainMenu
}) {
  const [isShowcaseOpen, setIsShowcaseOpen] = useState(false);
  const [pendingDestination, setPendingDestination] = useState(null); // 'NEW_RUN' | 'MAIN_MENU'

  useEffect(() => {
    try {
      soundEngine.playGameOver && soundEngine.playGameOver();
    } catch (e) {}
  }, []);

  const statsList = [
    {
      id: 'stat_stage',
      icon: <Layers size={16} className="text-amber-400" />,
      label: 'Ulaşılan Kademe',
      value: `KADEME ${stage}`,
      color: 'text-amber-300',
      bg: 'bg-amber-950/40 border-amber-500/30'
    },
    {
      id: 'stat_score',
      icon: <Trophy size={16} className="text-emerald-400" />,
      label: 'Toplam Run Skoru',
      value: `${currentScore.toLocaleString('tr-TR')} Puan`,
      color: 'text-emerald-300',
      bg: 'bg-emerald-950/40 border-emerald-500/30'
    },
    {
      id: 'stat_gold',
      icon: <Coins size={16} className="text-yellow-400 fill-yellow-400" />,
      label: 'Kazanılan Altın',
      value: `+${totalRunGold || 25} 💰`,
      color: 'text-yellow-300',
      bg: 'bg-yellow-950/40 border-yellow-500/30'
    },
    {
      id: 'stat_words',
      icon: <BookOpen size={16} className="text-cyan-400" />,
      label: 'Yazılan Kelimeler',
      value: `${totalRunWords || 8} Kelime`,
      color: 'text-cyan-300',
      bg: 'bg-cyan-950/40 border-cyan-500/30'
    }
  ];

  // Map unlocks for sequential showcase
  const unlockSequenceItems = [
    ...(runAchievements || []).map(a => ({
      id: a.id,
      type: 'ACHIEVEMENT',
      name: a.title,
      icon: '🏆',
      desc: a.rewardDesc || a.unlockedDesc || 'Tebrikler! Oyunda yeni bir başarım kilit açımı yapıldı.',
      artEmoji: '🏆✨🎖️',
      category: 'BAŞARIM ÖDÜLÜ',
      bgGradient: 'from-amber-700 via-yellow-950 to-slate-950'
    })),
    ...(runMetaUnlocks || []).map(u => ({
      id: u.id,
      type: u.type === 'HERO' ? 'HERO' : u.type === 'STAKE' ? 'STAKE' : 'JOKER',
      name: u.type === 'HERO' ? `Yeni Karakter: ${u.name}` : `Yeni Mühür: ${u.name}`,
      icon: u.icon || (u.type === 'HERO' ? '⚔️' : '🟢'),
      desc: u.desc,
      artEmoji: u.type === 'HERO' ? '⚔️🛡️👑' : '🟢⚫🟣',
      category: u.type === 'HERO' ? 'YENİ KAHRAMAN' : 'ZORLUK MÜHÜRÜ',
      bgGradient: u.type === 'HERO' ? 'from-purple-800 via-indigo-950 to-slate-950' : 'from-cyan-800 via-blue-950 to-slate-950'
    }))
  ];

  const handleDestinationClick = (destination) => {
    soundEngine.playTap();
    if (unlockSequenceItems.length > 0) {
      setPendingDestination(destination);
      setIsShowcaseOpen(true);
    } else {
      executeDestination(destination);
    }
  };

  const executeDestination = (destination) => {
    if (destination === 'NEW_RUN' && onStartNewRun) {
      onStartNewRun();
    } else if (destination === 'MAIN_MENU' && onReturnToMainMenu) {
      onReturnToMainMenu();
    }
  };

  const handleShowcaseClose = () => {
    setIsShowcaseOpen(false);
    executeDestination(pendingDestination || 'MAIN_MENU');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/95 z-50 flex items-center justify-center p-4 backdrop-blur-2xl animate-fade-in select-none overflow-y-auto">
      {/* Ambient Crimson Background Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(225,29,72,0.15)_0%,transparent_75%)] pointer-events-none" />

      {/* SEQUENTIAL SQUARE CARD SHOWCASE MODAL */}
      {isShowcaseOpen && unlockSequenceItems.length > 0 && (
        <UnlockSequenceModal
          items={unlockSequenceItems}
          titleHeader="RUN BİTİMİ AÇILAN ÖZELLİKLER"
          onClose={handleShowcaseClose}
        />
      )}

      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 25 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 250 }}
        className="w-full max-w-lg bg-gradient-to-b from-slate-900 via-[#1a0c16] to-slate-950 border-2 border-rose-600/80 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(225,29,72,0.35)] flex flex-col items-center text-center text-slate-100 relative overflow-hidden my-4"
      >
        {/* Corner Runic SVG Accents */}
        <svg className="absolute top-2 left-2 w-10 h-10 text-rose-500/30" viewBox="0 0 100 100">
          <path d="M0 0 L40 0 L0 40 Z" fill="currentColor" />
          <line x1="0" y1="55" x2="55" y2="0" stroke="currentColor" strokeWidth="2" />
        </svg>
        <svg className="absolute top-2 right-2 w-10 h-10 text-rose-500/30 rotate-90" viewBox="0 0 100 100">
          <path d="M0 0 L40 0 L0 40 Z" fill="currentColor" />
          <line x1="0" y1="55" x2="55" y2="0" stroke="currentColor" strokeWidth="2" />
        </svg>

        {/* Skull Icon Emblem */}
        <DefeatSkullEmblem />

        <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-rose-200 to-red-400 font-cinzel tracking-wider uppercase drop-shadow">
          SINAV ELENDİ
        </h2>
        <div className="mt-1 px-3 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/40 text-[11px] font-black text-rose-300 uppercase tracking-widest">
          RUN GENEL HESABI
        </div>
        
        <p className="text-xs text-slate-400 mt-2.5 font-medium max-w-xs leading-relaxed">
          Hamle hakkınız tükendi! Koşu sonlandı, kazanılan altın ve ilerlemeniz kaydedildi.
        </p>

        {/* 2x2 GRID OF RUN STATS SUMMARY CARDS */}
        <div className="w-full grid grid-cols-2 gap-3 my-5">
          {statsList.map((stat, idx) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.12 }}
              className={`p-3 rounded-2xl border ${stat.bg} shadow-lg flex flex-col justify-between text-left relative overflow-hidden backdrop-blur-md`}
            >
              <div className="flex items-center justify-between text-slate-400 text-[11px] font-extrabold uppercase tracking-wider mb-1">
                <span>{stat.label}</span>
                <span>{stat.icon}</span>
              </div>
              <div className={`text-base sm:text-lg font-black font-mono tracking-wide ${stat.color}`}>
                {stat.value}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Unlocked Features Summary Hint */}
        {unlockSequenceItems.length > 0 && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-xs text-amber-300 font-black bg-gradient-to-r from-amber-950/80 via-yellow-950/90 to-amber-950/80 border-2 border-amber-500/60 rounded-2xl px-4 py-2.5 mb-4 w-full flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.25)]"
          >
            <Sparkles size={16} className="text-amber-400 animate-spin-slow shrink-0" />
            <span>Bu koşuda {unlockSequenceItems.length} Yeni Başarım / Kilit Açıldı!</span>
          </motion.div>
        )}

        {/* DESTINATION ACTION BUTTONS */}
        <div className="w-full flex flex-col gap-3">
          {/* Option 1: Yeni Koşu Başlat */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleDestinationClick('NEW_RUN')}
            className="w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-slate-950 font-black py-4 px-6 rounded-2xl transition flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(16,185,129,0.5)] text-sm sm:text-base tracking-wider border-2 border-emerald-200 cursor-pointer"
          >
            <RefreshCw size={20} className="stroke-[2.5]" />
            <span>YENİ KOŞU BAŞLAT</span>
          </motion.button>

          {/* Option 2: Ana Menüye Dön */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleDestinationClick('MAIN_MENU')}
            className="w-full bg-slate-900/90 hover:bg-slate-800/90 text-amber-300 border-2 border-amber-500/50 font-black py-3.5 px-6 rounded-2xl transition flex items-center justify-center gap-2.5 shadow-xl text-xs sm:text-sm tracking-wider cursor-pointer backdrop-blur-md"
          >
            <Home size={18} />
            <span>ANA MENÜYE DÖN</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}


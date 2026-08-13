import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Trophy, Coins, BookOpen, Sparkles, RefreshCw, ChevronRight } from 'lucide-react';
import { soundEngine } from '../game/audioEngine';
import { UnlockSequenceModal } from './UnlockSequenceModal';

export function GameOverModal({
  stage,
  currentScore,
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
      icon: '🏛️',
      label: 'Ulaşılan Kademe:',
      value: `KADEME ${stage}`,
      color: 'text-amber-300'
    },
    {
      id: 'stat_score',
      icon: <Trophy size={14} className="text-emerald-400" />,
      label: 'Toplam Run Skoru:',
      value: `${currentScore} Puan`,
      color: 'text-emerald-300'
    },
    {
      id: 'stat_gold',
      icon: <Coins size={14} className="text-amber-400 fill-amber-400" />,
      label: 'Kazanılan Toplam Altın:',
      value: `+${totalRunGold || 25} 💰`,
      color: 'text-amber-300'
    },
    {
      id: 'stat_words',
      icon: <BookOpen size={14} className="text-cyan-400" />,
      label: 'Yazılan Toplam Kelime:',
      value: `${totalRunWords || 8} Kelime`,
      color: 'text-cyan-300'
    }
  ];

  // Map unlocks for the square card sequential showcase
  const unlockSequenceItems = [
    ...runAchievements.map(a => ({
      id: a.id,
      type: 'ACHIEVEMENT',
      name: a.title,
      icon: '🏆',
      desc: a.rewardDesc || a.unlockedDesc || 'Tebrikler! Oyunda yeni bir başarım kilit açımı yapıldı.',
      artEmoji: '🏆✨🎖️',
      category: 'BAŞARIM ÖDÜLÜ',
      bgGradient: 'from-amber-700 via-yellow-950 to-slate-950'
    })),
    ...runMetaUnlocks.map(u => ({
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

  // Handle destination selection (Yeni Run veya Ana Menü)
  const handleDestinationClick = (destination) => {
    soundEngine.playTap();
    if (unlockSequenceItems.length > 0) {
      setPendingDestination(destination);
      setIsShowcaseOpen(true);
    } else {
      executeDestination(destination);
    }
  };

  // Execute destination navigation after showcase completes
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
    <div className="fixed inset-0 bg-slate-950/95 z-50 flex items-center justify-center p-4 backdrop-blur-xl animate-fade-in select-none overflow-y-auto">
      {/* SEQUENTIAL SQUARE CARD SHOWCASE MODAL */}
      {isShowcaseOpen && unlockSequenceItems.length > 0 && (
        <UnlockSequenceModal
          items={unlockSequenceItems}
          titleHeader="RUN BİTİMİ AÇILAN ÖZELLİKLER"
          onClose={handleShowcaseClose}
        />
      )}

      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-md bg-gradient-to-b from-slate-900 via-[#190d16] to-slate-950 border-2 border-rose-600/70 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col items-center text-center text-slate-100 relative overflow-hidden my-4"
      >
        {/* Skull Icon Header */}
        <div className="w-16 h-16 rounded-3xl bg-rose-950/80 border-2 border-rose-500/80 flex items-center justify-center text-3xl mb-2 shadow-2xl shadow-rose-950 animate-pulse">
          💀
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-rose-400 font-cinzel tracking-wide uppercase">
          SINAV ELENDİ (RUN GENEL HESABI)
        </h2>
        <p className="text-xs text-slate-400 mt-0.5 font-medium">
          Hamle hakkınız bitti! Kazanılan altınlar ve başarımlar hesaplandı.
        </p>

        {/* SEQUENTIAL ANIMATED RUN STATS SUMMARY CARD */}
        <div className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-4 my-4 flex flex-col gap-3 shadow-inner text-left">
          {statsList.map((stat, idx) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="flex justify-between items-center text-xs pb-2 border-b border-slate-800/80 last:border-b-0 last:pb-0"
            >
              <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
                <span>{stat.icon}</span>
                <span>{stat.label}</span>
              </span>
              <span className={`font-extrabold text-sm font-mono ${stat.color}`}>
                {stat.value}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Unlocked Features Summary Hint */}
        {unlockSequenceItems.length > 0 && (
          <div className="text-[10px] text-amber-300 font-bold bg-amber-950/40 border border-amber-500/40 rounded-xl px-3 py-1.5 mb-2 w-full flex items-center justify-center gap-1.5">
            <Sparkles size={12} className="text-amber-400" />
            <span>Bu koşuda kazanılan {unlockSequenceItems.length} yeni özellik kartı gösterilecek!</span>
          </div>
        )}

        {/* DESTINATION ACTION BUTTONS */}
        <div className="w-full flex flex-col gap-2.5 mt-2">
          {/* Option 1: Yeni Koşu Başlat */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => handleDestinationClick('NEW_RUN')}
            className="w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black py-3.5 px-5 rounded-2xl transition flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/50 text-sm tracking-wider border border-emerald-300 cursor-pointer"
          >
            <RefreshCw size={18} />
            <span>YENİ KOŞU BAŞLAT</span>
          </motion.button>

          {/* Option 2: Ana Menüye Dön */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => handleDestinationClick('MAIN_MENU')}
            className="w-full bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/50 font-black py-3.5 px-5 rounded-2xl transition flex items-center justify-center gap-2 shadow-lg text-sm tracking-wider cursor-pointer"
          >
            <Home size={18} />
            <span>ANA MENÜYE DÖN</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, ChevronRight, Trophy, Shield, Zap, BookOpen, Star, Unlock } from 'lucide-react';
import { soundEngine } from '../game/audioEngine';
import confetti from 'canvas-confetti';

const TYPE_CONFIGS = {
  HERO: {
    category: 'YENİ KAHRAMAN',
    iconDefault: '⚔️',
    gradient: 'from-amber-600 via-purple-900 to-slate-950',
    border: 'border-amber-400/80',
    glow: 'rgba(251,191,36,0.4)',
    badgeBg: 'bg-amber-400 text-slate-950',
    helpNote: 'Karakterler run başında seçilir ve kendilerine özgü özel pasif güçlerle oyunu değiştirir.'
  },
  STAKE: {
    category: 'ZORLUK MÜHÜRÜ',
    iconDefault: '🟢',
    gradient: 'from-cyan-600 via-blue-950 to-slate-950',
    border: 'border-cyan-400/80',
    glow: 'rgba(34,211,238,0.4)',
    badgeBg: 'bg-cyan-400 text-slate-950',
    helpNote: 'Mühürler oyundaki puan barajlarını ve mücadele zorluk seviyesini katlandırır.'
  },
  JOKER: {
    category: 'PASİF JOKER KARTI',
    iconDefault: '🃏',
    gradient: 'from-purple-600 via-slate-900 to-slate-950',
    border: 'border-purple-400/80',
    glow: 'rgba(192,132,252,0.4)',
    badgeBg: 'bg-purple-400 text-slate-950',
    helpNote: 'Ekranın üst barındaki slotlarda durur. Kelime yazarken ekstra çarpan, puan veya altın verir.'
  },
  RELIC: {
    category: 'EŞSİZ UĞUR / TILSIM',
    iconDefault: '📜',
    gradient: 'from-emerald-600 via-teal-950 to-slate-950',
    border: 'border-emerald-400/80',
    glow: 'rgba(52,211,153,0.4)',
    badgeBg: 'bg-emerald-400 text-slate-950',
    helpNote: 'Pasif turlarda kelimelere ve destene özel kalıcı avantajlar katar.'
  },
  ACHIEVEMENT: {
    category: 'BAŞARIM ÖDÜLÜ',
    iconDefault: '🏆',
    gradient: 'from-yellow-500 via-amber-950 to-slate-950',
    border: 'border-amber-300/90',
    glow: 'rgba(252,211,77,0.5)',
    badgeBg: 'bg-yellow-400 text-slate-950',
    helpNote: 'Zorlu görevleri başardığınızda kazanılan ve yeni kilitleri açan unvandır.'
  },
  SPECIAL_TILE: {
    category: 'ÖZEL HARF TAŞI',
    iconDefault: '✨',
    gradient: 'from-rose-600 via-pink-950 to-slate-950',
    border: 'border-pink-400/80',
    glow: 'rgba(244,114,182,0.4)',
    badgeBg: 'bg-pink-400 text-slate-950',
    helpNote: 'Elimizdeki harf taşları arasında gelen ve istediğimiz harfe dönüşen joker taşlardır.'
  },
  FEATURE: {
    category: 'AÇILAN SİSTEM ÖZELLİĞİ',
    iconDefault: '🔓',
    gradient: 'from-indigo-600 via-slate-900 to-slate-950',
    border: 'border-indigo-400/80',
    glow: 'rgba(129,140,248,0.4)',
    badgeBg: 'bg-indigo-400 text-slate-950',
    helpNote: 'Oyunda yeni bir mekaniğin veya dükkân özelliğinin kullanıma girdiğini gösterir.'
  }
};

export function UnlockSequenceModal({
  items = [],
  onClose,
  titleHeader = 'YENİ AÇILAN ÖZELLİK'
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    try {
      soundEngine.playVictory && soundEngine.playVictory();
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.5 }
      });
    } catch (e) {}
  }, [currentIndex]);

  if (!items || items.length === 0) return null;

  const currentItem = items[currentIndex];
  const typeConfig = TYPE_CONFIGS[currentItem.type] || TYPE_CONFIGS.FEATURE;
  const isLast = currentIndex === items.length - 1;

  const handleNext = () => {
    try { soundEngine.playTap(); } catch (e) {}
    if (isLast) {
      onClose && onClose();
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 select-none overflow-y-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id || currentIndex}
          initial={{ scale: 0.82, opacity: 0, y: 25, rotate: -2 }}
          animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: -20, rotate: 2 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className={`w-full max-w-sm sm:max-w-md bg-gradient-to-b ${currentItem.bgGradient || typeConfig.gradient} border-2 ${typeConfig.border} rounded-3xl p-5 shadow-2xl flex flex-col items-center text-center text-slate-100 relative overflow-hidden my-auto`}
          style={{ boxShadow: `0 0 35px ${typeConfig.glow}` }}
        >
          {/* Subtle background ambient sparkles effect */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
          
          {/* Top Progress & Category Pill */}
          <div className="w-full flex items-center justify-between mb-3 px-1">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md ${typeConfig.badgeBg}`}>
              <Sparkles size={11} />
              <span>{currentItem.category || typeConfig.category}</span>
            </span>

            <span className="text-xs font-mono font-black text-amber-300 bg-slate-950/80 px-2.5 py-1 rounded-full border border-amber-500/30">
              {currentIndex + 1} / {items.length}
            </span>
          </div>

          {/* Title Header */}
          <div className="flex items-center gap-1.5 text-amber-300 text-xs font-black uppercase tracking-widest mb-1">
            <Unlock size={14} className="text-amber-400" />
            <span>{titleHeader}</span>
          </div>

          {/* SQUARE CARD VISUAL CONTAINER (Balatro-Style Framed Showcase) */}
          <div className="w-36 h-36 sm:w-40 sm:h-40 my-3 rounded-2xl bg-slate-950/85 border-2 border-white/20 flex flex-col items-center justify-center relative shadow-2xl overflow-hidden group">
            {/* Inner Glowing Backdrop */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-white/15 pointer-events-none" />
            
            {/* Big Icon / Visual Artwork */}
            <div className="text-5xl sm:text-6xl drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] animate-bounce duration-1000">
              {currentItem.icon || typeConfig.iconDefault}
            </div>

            {/* Optional Art Emojis line if available */}
            {currentItem.artEmoji && (
              <div className="text-xs mt-1 tracking-widest opacity-90 font-mono">
                {currentItem.artEmoji}
              </div>
            )}

            {/* Rare / Type Corner Badge */}
            <div className="absolute bottom-1 right-1 text-[9px] font-black text-amber-300/80 bg-slate-900/90 px-1.5 py-0.5 rounded border border-white/10">
              ★ {currentItem.rarity || 'Efsanevi'}
            </div>
          </div>

          {/* Item Name */}
          <h3 className="text-xl sm:text-2xl font-black text-white font-cinzel tracking-wide drop-shadow-md">
            {currentItem.name || currentItem.title}
          </h3>

          {/* Description Box */}
          <div className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-3.5 my-3 text-xs leading-relaxed text-slate-200 shadow-inner text-left">
            <p className="font-semibold text-amber-200/95 mb-1.5 flex items-center gap-1.5">
              <Star size={13} className="text-amber-400 shrink-0" />
              <span>Özellik &amp; Etki:</span>
            </p>
            <p className="text-slate-300 text-xs leading-snug">
              {currentItem.desc || currentItem.rewardDesc || 'Yeni özellik kilit açımı tamamlandı.'}
            </p>

            {/* Educational Help Note detailing Jokers vs Tiles vs Features */}
            <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 italic flex items-start gap-1.5">
              <BookOpen size={12} className="text-cyan-400 shrink-0 mt-0.5" />
              <span>{typeConfig.helpNote}</span>
            </div>
          </div>

          {/* ACTION BUTTON (TAMAM / SONRAKİ) */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black py-3.5 px-6 rounded-2xl transition flex items-center justify-center gap-2 shadow-xl shadow-amber-500/30 text-sm tracking-wide border border-amber-300 cursor-pointer mt-1"
          >
            {isLast ? (
              <>
                <Check size={18} />
                <span>TAMAM (ANLAŞILDI)</span>
              </>
            ) : (
              <>
                <span>SONRAKİ ÖZELLİK</span>
                <ChevronRight size={18} />
              </>
            )}
          </motion.button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

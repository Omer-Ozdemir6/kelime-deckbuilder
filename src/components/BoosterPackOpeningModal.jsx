import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, Package, X, Star, Flame, Shield, Award } from 'lucide-react';
import { createCard, getRarityDetails } from '../game/cardData';
import { soundEngine } from '../game/audioEngine';
import { RunicCardFrame } from './RunicCardFrame';
import { JokerCardIllustration } from './JokerCardIllustration';
import confetti from 'canvas-confetti';

const PACK_CONFIGS = {
  BUFFOON_PACK: {
    title: 'BUFFOON JOKER PAKETİ',
    subtitle: 'Nadir Jokerler & Özel Harf Taşları',
    icon: '📦',
    bgGradient: 'from-orange-950 via-amber-900 to-rose-950',
    borderColor: 'border-amber-400',
    shadowGlow: 'shadow-[0_0_60px_rgba(245,158,11,0.6)]',
    badgeBg: 'bg-amber-400 text-slate-950',
    cardsPool: [
      { type: 'special', key: 'JOKER', name: 'Joker Harf Taşı', desc: 'Kelimeyi tamamlayan joker harf.', points: 0, rarity: 'nadir' },
      { type: 'special', key: 'DOUBLE', name: 'Çift Kelime Taşı', desc: 'Tüm kelime puanını 2x katlar.', points: 0, rarity: 'efsanevi' },
      { type: 'special', key: 'MIRROR', name: 'Ayna Harf Taşı', desc: 'Önceki harfin puanını kopyalar.', points: 0, rarity: 'nadir' },
      { type: 'special', key: 'GOLDEN', name: 'Altın Harf Taşı', desc: '+10 Puan & +15 Bonus Altın.', points: 10, rarity: 'efsanevi' },
      { type: 'special', key: 'CHAIN_TILE', name: 'Kombo Harf Taşı', desc: '+1 Kombo çarpanı kazandırır.', points: 5, rarity: 'nadir' },
      { type: 'letter', letter: 'Z', rarity: 'nadir', points: 4 },
      { type: 'letter', letter: 'Ş', rarity: 'nadir', points: 4 },
      { type: 'letter', letter: 'Ğ', rarity: 'nadir', points: 5 }
    ]
  },
  ARCANA_PACK: {
    title: 'ARKANA MİSTİK PAKETİ',
    subtitle: 'Kadim Mühürlü & Efsunlu Harfler',
    icon: '✨',
    bgGradient: 'from-purple-950 via-pink-900 to-indigo-950',
    borderColor: 'border-pink-400',
    shadowGlow: 'shadow-[0_0_60px_rgba(236,72,153,0.6)]',
    badgeBg: 'bg-pink-400 text-slate-950',
    cardsPool: [
      { type: 'sealed', letter: 'A', seal: 'FOIL', name: 'Altın Mühürlü A', desc: '+30 Bonus Taban Puanı.', points: 1, rarity: 'efsanevi' },
      { type: 'sealed', letter: 'E', seal: 'RED_SEAL', name: 'Kırmızı Mühürlü E', desc: 'Harf puanı 2 kez tetiklenir.', points: 1, rarity: 'efsanevi' },
      { type: 'sealed', letter: 'K', seal: 'POLYCHROME', name: 'Gökkuşağı Mühürlü K', desc: 'Polychrome ×1.5 çarpan.', points: 2, rarity: 'efsanevi' },
      { type: 'infused', letter: 'S', infusedType: 'ignited', name: 'Alevli S Harfi', desc: '+10 Alev Puanı ekler.', points: 2, rarity: 'nadir' },
      { type: 'infused', letter: 'M', infusedType: 'electric', name: 'Elektrikli M Harfi', desc: '+1 Kombo kademesi sıçratır.', points: 2, rarity: 'nadir' },
      { type: 'letter', letter: 'J', rarity: 'efsanevi', points: 7 },
      { type: 'letter', letter: 'Ç', rarity: 'nadir', points: 4 }
    ]
  }
};

export function BoosterPackOpeningModal({ packType = 'BUFFOON_PACK', onClose, onClaimCard }) {
  const config = PACK_CONFIGS[packType] || PACK_CONFIGS.BUFFOON_PACK;
  const [phase, setPhase] = useState('UNOPENED'); // 'UNOPENED' | 'TEARING' | 'REVEALED'
  const [revealedCards, setRevealedCards] = useState([]);
  const [selectedCardIdx, setSelectedCardIdx] = useState(null);

  const generatePackCards = () => {
    const pool = [...config.cardsPool];
    // Pick 3 unique random items from pool
    const shuffled = pool.sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, 3);

    return picked.map((item, idx) => {
      if (item.type === 'special') {
        const card = createCard(item.key);
        card.name = item.name;
        card.desc = item.desc;
        card.rarity = item.rarity;
        return card;
      } else if (item.type === 'sealed') {
        const card = createCard(item.letter, 0, null, item.seal);
        card.name = item.name;
        card.desc = item.desc;
        card.rarity = item.rarity;
        return card;
      } else if (item.type === 'infused') {
        const card = createCard(item.letter, 0, item.infusedType);
        card.name = item.name;
        card.desc = item.desc;
        card.rarity = item.rarity;
        return card;
      } else {
        return createCard(item.letter);
      }
    });
  };

  const handleTearPack = () => {
    try {
      soundEngine.playPackOpen ? soundEngine.playPackOpen() : soundEngine.playVictory?.();
    } catch (e) {}
    setPhase('TEARING');

    try {
      confetti({
        particleCount: 75,
        spread: 90,
        origin: { y: 0.5 }
      });
    } catch (e) {}

    setTimeout(() => {
      const cards = generatePackCards();
      setRevealedCards(cards);
      setPhase('REVEALED');
      try {
        soundEngine.playCardDraw ? soundEngine.playCardDraw() : soundEngine.playTap?.();
      } catch (e) {}
    }, 600);
  };

  const handleSelectCard = (idx) => {
    try { soundEngine.playTap?.(); } catch (e) {}
    setSelectedCardIdx(idx);
  };

  const handleConfirmClaim = () => {
    if (selectedCardIdx === null || !revealedCards[selectedCardIdx]) return;
    try { soundEngine.playUpgradeSound?.(); } catch (e) {}
    
    try {
      confetti({
        particleCount: 90,
        spread: 100,
        origin: { y: 0.6 }
      });
    } catch(e) {}

    onClaimCard(revealedCards[selectedCardIdx]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4 select-none overflow-hidden">
      {/* BACKGROUND AMBIENT GLOW */}
      <div className={`absolute w-[500px] h-[500px] rounded-full blur-[140px] opacity-40 pointer-events-none ${
        packType === 'BUFFOON_PACK' ? 'bg-amber-500' : 'bg-purple-600'
      }`} />

      {/* CLOSE BUTTON */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 rounded-full bg-slate-900/90 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition active:scale-95 shadow-lg z-50 cursor-pointer"
      >
        <X size={20} />
      </button>

      <div className="w-full max-w-xl flex flex-col items-center gap-6 relative z-10 text-center">
        
        {/* HEADER TITLE */}
        <div>
          <span className={`px-3 py-1 rounded-full font-black text-xs uppercase tracking-widest shadow-md ${config.badgeBg}`}>
            BOOSTER PACK OPENING
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 font-cinzel mt-2 tracking-wide">
            {config.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-bold mt-0.5">
            {config.subtitle}
          </p>
        </div>

        {/* PHASE 1 & 2: FOIL PACKET CONTAINER */}
        <AnimatePresence mode="wait">
          {phase !== 'REVEALED' && (
            <motion.div
              key="pack_container"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex flex-col items-center gap-6 my-6"
            >
              {/* 3D FOIL PACKET */}
              <motion.div
                animate={phase === 'UNOPENED' ? { y: [-6, 6, -6], rotateZ: [-1, 1, -1] } : {}}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                onClick={phase === 'UNOPENED' ? handleTearPack : undefined}
                className={`w-56 h-80 rounded-3xl border-4 ${config.borderColor} ${config.shadowGlow} bg-gradient-to-b ${config.bgGradient} p-4 flex flex-col items-center justify-between relative cursor-pointer shadow-2xl overflow-hidden group`}
              >
                {/* FOIL METALLIC GLIMMER */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-60 group-hover:opacity-100 transition pointer-events-none" />

                {/* TOP PACKET SEAL (TEARS AWAY ON CLICK) */}
                <motion.div
                  animate={phase === 'TEARING' ? { y: -200, rotate: -20, opacity: 0 } : { y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full border-b-2 border-dashed border-amber-300/60 pb-3 flex items-center justify-between"
                >
                  <span className="text-[10px] font-black text-amber-200 uppercase tracking-widest">PULL TO OPEN</span>
                  <Package size={16} className="text-amber-300 animate-bounce" />
                </motion.div>

                {/* PACKET CENTER EMBLEM */}
                <div className="my-auto flex flex-col items-center gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-20 h-20 rounded-2xl bg-slate-950/70 border-2 border-amber-400/80 flex items-center justify-center text-4xl shadow-xl"
                  >
                    {config.icon}
                  </motion.div>
                  <span className="text-sm font-black text-white font-cinzel tracking-wider">{config.title}</span>
                </div>

                {/* BOTTOM PACKET SEAL */}
                <motion.div
                  animate={phase === 'TEARING' ? { y: 150, opacity: 0 } : { y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full pt-3 border-t-2 border-dashed border-amber-300/60 flex items-center justify-center text-[10px] font-black text-amber-200/80 tracking-widest"
                >
                  BALATRO BOOSTER EDITION
                </motion.div>
              </motion.div>

              {/* TAP TO OPEN CTA BUTTON */}
              {phase === 'UNOPENED' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleTearPack}
                  className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm tracking-wide border border-amber-200 shadow-xl shadow-amber-500/30 cursor-pointer flex items-center gap-2 animate-pulse"
                >
                  <Sparkles size={18} />
                  <span>PAKETİ YIRT VE AÇ</span>
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* PHASE 3: REVEALED CARDS FAN LAYOUT */}
        <AnimatePresence>
          {phase === 'REVEALED' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full flex flex-col items-center gap-6 my-2"
            >
              <p className="text-xs font-black text-amber-300 uppercase tracking-widest bg-amber-950/80 border border-amber-500/50 px-4 py-1 rounded-full">
                Destene Eklemek İçin 1 Kart Seç
              </p>

              {/* 3-CARD CAROUSEL / FAN DISPLAY */}
              <div className="flex items-center justify-center gap-3 sm:gap-6 w-full py-2">
                {revealedCards.map((card, idx) => {
                  const isSelected = selectedCardIdx === idx;
                  const isRare = card.rarity === 'nadir';
                  const isLegendary = card.rarity === 'efsanevi' || card.rarity === 'cok_nadir';

                  let cardBg = 'bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-slate-700 text-slate-100';
                  if (card.isSpecial || card.type === 'joker') {
                    cardBg = 'bg-gradient-to-b from-purple-900 via-slate-900 to-purple-950 border-purple-400 text-purple-100 shadow-[0_0_25px_rgba(168,85,247,0.6)]';
                  } else if (isLegendary) {
                    cardBg = 'bg-gradient-to-b from-amber-600 via-yellow-700 to-amber-950 border-amber-300 text-amber-100 shadow-[0_0_25px_rgba(245,158,11,0.6)]';
                  } else if (isRare) {
                    cardBg = 'bg-gradient-to-b from-cyan-600 via-blue-700 to-slate-950 border-cyan-300 text-cyan-100 shadow-[0_0_25px_rgba(34,211,238,0.6)]';
                  }

                  return (
                    <motion.div
                      key={card.id || `revealed_${idx}`}
                      initial={{ scale: 0.5, y: 50, rotateZ: idx === 0 ? -12 : (idx === 2 ? 12 : 0) }}
                      animate={{
                        scale: isSelected ? 1.12 : 1,
                        y: isSelected ? -15 : 0,
                        rotateZ: isSelected ? 0 : (idx === 0 ? -6 : (idx === 2 ? 6 : 0))
                      }}
                      whileHover={{ scale: isSelected ? 1.15 : 1.06, y: -10 }}
                      onClick={() => handleSelectCard(idx)}
                      className={`w-32 sm:w-40 h-52 sm:h-60 rounded-3xl p-2.5 flex flex-col items-center justify-between border-2 cursor-pointer shadow-2xl relative transition-all ${cardBg} ${
                        isSelected ? 'border-4 border-amber-300 ring-4 ring-amber-400/50 z-30' : 'z-10 opacity-90 hover:opacity-100'
                      }`}
                    >
                      <RunicCardFrame rarity={card.isSpecial ? 'joker' : (isLegendary ? 'legendary' : (isRare ? 'rare' : 'common'))} />

                      {/* TOP BADGE */}
                      <div className="w-full flex items-center justify-between z-10">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-slate-950/80 px-2 py-0.5 rounded-full border border-amber-400/40">
                          {card.seal ? card.seal : (card.specialType || 'HARF')}
                        </span>
                        <span className="text-xs font-black text-amber-400">+{card.points || 1}p</span>
                      </div>

                      {/* CARD CENTER ICON / LETTER */}
                      <div className="my-auto flex flex-col items-center gap-1.5 z-10 py-1">
                        {card.isSpecial || card.specialType || card.type === 'joker' ? (
                          <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-slate-950/80 rounded-2xl border-2 border-amber-400/80 shadow-xl p-1">
                            <JokerCardIllustration cardId={card.specialType || card.id || card.key || 'joker'} type={card.specialType || 'joker'} className="w-11 h-11 sm:w-13 sm:h-13 drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]" />
                          </div>
                        ) : (
                          <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-slate-950/80 rounded-2xl border-2 border-amber-400/60 shadow-xl">
                            <span className="text-3xl sm:text-4xl font-black font-cinzel text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-yellow-300 to-amber-500 drop-shadow-md">
                              {card.letter}
                            </span>
                          </div>
                        )}
                        <span className="text-[11px] font-black text-center text-amber-200 line-clamp-1 font-cinzel">
                          {card.name || (card.isSpecial ? 'Joker Taşı' : `${card.letter} Harf Taşı`)}
                        </span>
                      </div>

                      {/* BOTTOM DESCRIPTION */}
                      <div className="w-full bg-slate-950/90 rounded-xl p-1.5 border border-slate-800 text-[9px] font-bold text-slate-300 text-center leading-tight z-10 line-clamp-2">
                        {card.desc || `${card.letter} harf taşı. Kelimelerinizi güçlendirir.`}
                      </div>

                      {/* SELECTED CHECKMARK OVERLAY */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg z-30">
                          <Check size={14} className="stroke-[3]" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* CONFIRM CLAIM BUTTON */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleConfirmClaim}
                disabled={selectedCardIdx === null}
                className={`py-4 px-10 rounded-2xl font-black text-sm tracking-wide border-2 shadow-2xl transition flex items-center gap-2 cursor-pointer ${
                  selectedCardIdx !== null
                    ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 border-amber-300 shadow-amber-500/40 animate-pulse'
                    : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                }`}
              >
                <Check size={18} />
                <span>SEÇİLEN KARTI DESTEYE EKLE</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

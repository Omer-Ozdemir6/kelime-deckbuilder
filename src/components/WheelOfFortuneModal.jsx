import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Dices, Gift, Flame, Trophy, Coins, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../game/audioEngine';

export function WheelOfFortuneModal({ onSpinResult, onClose }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [prizeResult, setPrizeResult] = useState(null);

  const PRIZES = [
    { id: 'FOIL_ALL', label: '🪙 TÜM HARFLERE FOIL MÜHÜR', icon: '🪙', color: 'bg-amber-950 border-amber-500 text-amber-300' },
    { id: 'GOLD_50', label: '💰 +50 ALTIN', icon: '💰', color: 'bg-emerald-950 border-emerald-500 text-emerald-300' },
    { id: 'JOKER_CARD', label: '🃏 EFSANEVİ JOKER KART', icon: '🃏', color: 'bg-purple-950 border-purple-500 text-purple-300' },
    { id: 'LEVEL_UP_ALL', label: '📜 TÜM SÖZLÜKLERE SEVİYE UP', icon: '📜', color: 'bg-cyan-950 border-cyan-500 text-cyan-300' },
    { id: 'POTION_PACK', label: '🧪 SIMYA İKSİRİ PAKETİ', icon: '🧪', color: 'bg-pink-950 border-pink-500 text-pink-300' },
    { id: 'HEAL_FULL', label: '❤️ +2 CAN (LIVES) YENİLENMESİ', icon: '❤️', color: 'bg-rose-950 border-rose-500 text-rose-300' }
  ];

  const handleSpin = () => {
    if (isSpinning || prizeResult) return;
    setIsSpinning(true);
    soundEngine.playTap();

    const randomPrizeIndex = Math.floor(Math.random() * PRIZES.length);
    const prize = PRIZES[randomPrizeIndex];

    // 5 full rotations (1800 deg) plus slice angle
    const degreesPerSlice = 360 / PRIZES.length;
    const targetDegrees = 1800 + randomPrizeIndex * degreesPerSlice;

    setRotation(targetDegrees);

    setTimeout(() => {
      setIsSpinning(false);
      setPrizeResult(prize);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      soundEngine.playSuccess();

      if (onSpinResult) {
        onSpinResult(prize);
      }
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-5 shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-xl bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800"
        >
          <X size={16} />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 mb-2">
          <Dices size={24} />
        </div>

        <h2 className="text-base font-black text-amber-300 font-cinzel tracking-wide">
          SİMYA ÇARKIOMANİ
        </h2>
        <p className="text-[11px] text-slate-400 mt-0.5 mb-4">
          Çarkıfeleği çevir, kadim efsun ve hazineleri kazan!
        </p>

        {/* Wheel Container */}
        <div className="relative w-56 h-56 my-2 flex items-center justify-center">
          {/* Top Indicator Arrow */}
          <div className="absolute -top-3 z-30 text-amber-400 text-2xl filter drop-shadow-md">
            ▼
          </div>

          <motion.div
            animate={{ rotate: rotation }}
            transition={{ duration: 3.5, ease: [0.15, 0.85, 0.35, 1] }}
            className="w-full h-full rounded-full border-4 border-amber-400/80 bg-slate-950 flex items-center justify-center relative overflow-hidden shadow-[0_0_25px_rgba(245,158,11,0.3)]"
          >
            {PRIZES.map((p, idx) => {
              const angle = (360 / PRIZES.length) * idx;
              return (
                <div
                  key={p.id}
                  className="absolute w-full h-full flex items-start justify-center pt-2"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <span className="text-lg filter drop-shadow">{p.icon}</span>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Prize Result Banner */}
        {prizeResult ? (
          <div className={`mt-4 p-3 rounded-2xl border w-full animate-bounce ${prizeResult.color}`}>
            <span className="text-xs font-black tracking-wide">{prizeResult.label}</span>
          </div>
        ) : (
          <button
            disabled={isSpinning}
            onClick={handleSpin}
            className="mt-4 w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black py-3 rounded-2xl shadow-lg border border-amber-300 text-xs tracking-wide cursor-pointer disabled:opacity-50"
          >
            {isSpinning ? 'ÇARK DÖNÜYOR... 🔮' : '🎲 ÇARKI ÇEVİR (BEDAVA)'}
          </button>
        )}
      </motion.div>
    </div>
  );
}

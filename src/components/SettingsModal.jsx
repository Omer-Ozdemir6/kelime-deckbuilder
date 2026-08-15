import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Volume2, VolumeX, Music, Shield, Home, X, Check, RefreshCw, Eye, Sparkles } from 'lucide-react';
import { soundEngine } from '../game/audioEngine';

export function SettingsModal({ onClose, onReturnToMainMenu }) {
  const [isSoundMuted, setIsSoundMuted] = useState(soundEngine.isMuted || false);

  const toggleSound = () => {
    const nextState = !isSoundMuted;
    setIsSoundMuted(nextState);
    soundEngine.setMuted(nextState);
    if (!nextState) soundEngine.playTap?.();
  };

  const handleReturnHome = () => {
    try { soundEngine.playTap?.(); } catch(e) {}
    onClose();
    if (onReturnToMainMenu) onReturnToMainMenu();
  };

  return (
    <div className="fixed inset-0 z-[250] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 select-none">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 15 }}
        transition={{ type: 'spring', damping: 20, stiffness: 280 }}
        className="w-full max-w-md bg-gradient-to-b from-slate-900 via-[#111827] to-slate-950 border-2 border-amber-400/80 rounded-3xl p-6 shadow-[0_0_50px_rgba(245,158,11,0.3)] relative overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 shadow">
              <Settings className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-lg font-black text-amber-300 font-cinzel tracking-wider">OYUN AYARLARI</h2>
              <p className="text-xs text-slate-400 font-medium">Ses, Müzik ve Menü kontrolleri</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-950 text-slate-400 hover:text-slate-100 border border-slate-800 hover:border-amber-400/60 transition cursor-pointer active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options List */}
        <div className="space-y-3.5 mb-6">
          {/* Sound FX Toggle */}
          <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-amber-400">
                {isSoundMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-200">Ses Efektleri & Müzik</h4>
                <p className="text-[11px] text-slate-400">{isSoundMuted ? 'Sesler kapalı' : 'Sesler ve tınılar aktif'}</p>
              </div>
            </div>

            <button
              onClick={toggleSound}
              className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer border shadow ${
                isSoundMuted
                  ? 'bg-rose-950 text-rose-300 border-rose-600'
                  : 'bg-emerald-500 text-slate-950 border-emerald-300'
              }`}
            >
              {isSoundMuted ? 'KAPALI' : 'AÇIK'}
            </button>
          </div>
        </div>

        {/* Main Menu Return CTA Button */}
        <div className="pt-4 border-t border-slate-800/90 space-y-2.5">
          <button
            onClick={handleReturnHome}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-600 text-white font-black text-xs tracking-wider border-2 border-rose-300 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(244,63,94,0.5)] transition cursor-pointer active:scale-95"
          >
            <Home size={16} />
            <span>ANA MENÜYE DÖN (ÇIKIŞ)</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs transition cursor-pointer active:scale-95"
          >
            OYUNA DEVAM ET
          </button>
        </div>
      </motion.div>
    </div>
  );
}

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Trash2, ArrowUpCircle, ShieldCheck, ChevronRight, Sparkles, AlertCircle } from 'lucide-react';
import { soundEngine } from '../game/audioEngine';

export function CampScreen({
  fullDeck = [],
  bossInfo = {},
  onResolveCamp
}) {
  const [activeTab, setActiveTab] = useState('REST'); // REST | REMOVE | UPGRADE
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [hasTakenCampAction, setHasTakenCampAction] = useState(false);
  const [campBonusNote, setCampBonusNote] = useState('');

  const handleRest = () => {
    if (hasTakenCampAction) return;
    soundEngine.playVictory();
    setHasTakenCampAction(true);
    setCampBonusNote('☕ Dinlendin! Boss savaşında +15 Taban Puan Bonusu kazandın!');
  };

  const handleRemoveCard = (cardId) => {
    if (hasTakenCampAction || !cardId) return;
    soundEngine.playDeleteSound();
    setSelectedCardId(cardId);
    setHasTakenCampAction(true);
    setCampBonusNote('🗑️ Seçilen harf desteden kalıcı olarak çıkarıldı!');
    onResolveCamp('REMOVE_CARD', { cardId });
  };

  const handleUpgradeCard = (cardId) => {
    if (hasTakenCampAction || !cardId) return;
    soundEngine.playVictory();
    setSelectedCardId(cardId);
    setHasTakenCampAction(true);
    setCampBonusNote('⬆️ Seçilen harfin puanı +2 artırıldı!');
    onResolveCamp('UPGRADE_CARD', { cardId });
  };

  const handleEnterBoss = () => {
    soundEngine.playTap();
    onResolveCamp('ENTER_BOSS', { bonusPoints: campBonusNote.includes('Dinlendin') ? 15 : 0 });
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 bg-gradient-to-b from-slate-950 via-[#0d1627] to-slate-950 text-slate-100 overflow-y-auto">
      {/* Camp Header */}
      <div className="text-center my-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950 border border-amber-500/50 text-amber-300 text-xs font-bold mb-1">
          <Sparkles size={14} />
          <span>🏕️ BOSS ÖNCESİ HAZIRLIK KAMPI</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-amber-300 font-cinzel">SON KAMP</h2>
        <p className="text-xs text-slate-400 mt-0.5">Boss savaşı öncesinde son hazırlığını yap.</p>
      </div>

      {/* Boss Preview Card */}
      {bossInfo && (
        <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex items-center justify-between shadow-lg my-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👑</span>
            <div>
              <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest block">YAKLAŞAN BOSS</span>
              <h3 className="text-xs font-extrabold text-slate-100">{bossInfo.title || 'Bölge Bossu'}</h3>
              <p className="text-[10px] text-slate-400">{bossInfo.desc || 'En az 4 harfli kelimeler kabul edilir!'}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] text-slate-400 font-bold block">Baraj Puan</span>
            <span className="text-base font-black text-rose-300">🎯 {bossInfo.targetScore || 250}</span>
          </div>
        </div>
      )}

      {/* Camp Action Tabs */}
      <div className="grid grid-cols-3 gap-2 my-2">
        <button
          onClick={() => setActiveTab('REST')}
          className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
            activeTab === 'REST'
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
          }`}
        >
          <Coffee size={18} className={activeTab === 'REST' ? 'text-amber-400' : 'text-slate-500'} />
          <span>☕ DİNLEN</span>
        </button>

        <button
          onClick={() => setActiveTab('REMOVE')}
          className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
            activeTab === 'REMOVE'
              ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-md'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
          }`}
        >
          <Trash2 size={18} className={activeTab === 'REMOVE' ? 'text-rose-400' : 'text-slate-500'} />
          <span>🗑️ KART SİL</span>
        </button>

        <button
          onClick={() => setActiveTab('UPGRADE')}
          className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
            activeTab === 'UPGRADE'
              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
          }`}
        >
          <ArrowUpCircle size={18} className={activeTab === 'UPGRADE' ? 'text-emerald-400' : 'text-slate-500'} />
          <span>⬆️ GELİŞTİR</span>
        </button>
      </div>

      {/* Tab Content Box */}
      <div className="flex-1 flex flex-col justify-between my-2 p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
        {/* REST TAB */}
        {activeTab === 'REST' && (
          <div className="flex flex-col items-center justify-center gap-3 text-center py-4">
            <Coffee size={40} className="text-amber-400 animate-pulse" />
            <h4 className="text-sm font-extrabold text-slate-100">Kamp Ateşinde Dinlen</h4>
            <p className="text-xs text-slate-400 max-w-xs">
              Moral topla ve Boss savaşında tüm hamlelerine **+15 Taban Puan Bonusu** kazan.
            </p>
            <button
              onClick={handleRest}
              disabled={hasTakenCampAction}
              className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs shadow-lg transition cursor-pointer"
            >
              {hasTakenCampAction ? 'KAMP AKSİYONU ALINDI ✓' : '☕ DİNLEN VE +15 PUAN AL'}
            </button>
          </div>
        )}

        {/* REMOVE TAB */}
        {activeTab === 'REMOVE' && (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-slate-400 text-center">Desteden ücretsiz 1 kart çıkar:</p>
            <div className="grid grid-cols-4 gap-2 max-h-[220px] overflow-y-auto p-1">
              {fullDeck.map((card) => (
                <button
                  key={card.id}
                  disabled={hasTakenCampAction}
                  onClick={() => handleRemoveCard(card.id)}
                  className={`p-2 rounded-xl border-2 flex flex-col items-center justify-center transition disabled:opacity-40 ${
                    selectedCardId === card.id
                      ? 'border-rose-500 bg-rose-950/80'
                      : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <span className="text-lg font-bold text-slate-100">{card.letter}</span>
                  <span className="text-[9px] text-rose-400 font-bold">Sil 🗑️</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* UPGRADE TAB */}
        {activeTab === 'UPGRADE' && (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-slate-400 text-center">Desteden 1 kartın puanını +2 yükselt:</p>
            <div className="grid grid-cols-4 gap-2 max-h-[220px] overflow-y-auto p-1">
              {fullDeck.filter(c => !c.isSpecial).map((card) => (
                <button
                  key={card.id}
                  disabled={hasTakenCampAction}
                  onClick={() => handleUpgradeCard(card.id)}
                  className={`p-2 rounded-xl border-2 flex flex-col items-center justify-center transition disabled:opacity-40 ${
                    selectedCardId === card.id
                      ? 'border-emerald-400 bg-emerald-950/80'
                      : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <span className="text-lg font-bold text-slate-100">{card.letter}</span>
                  <span className="text-[9px] text-emerald-400 font-extrabold">{card.points}pt → {card.points + 2}pt</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Camp Bonus Feedback Note */}
        {campBonusNote && (
          <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-black text-center mt-2 shadow-sm">
            {campBonusNote}
          </div>
        )}
      </div>

      {/* Enter Boss Battle Button */}
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={handleEnterBoss}
        className="w-full bg-gradient-to-r from-rose-500 via-red-500 to-rose-600 hover:from-rose-400 hover:to-red-400 text-white font-black py-3.5 px-5 rounded-2xl transition flex items-center justify-center gap-2 shadow-2xl shadow-rose-950 text-sm border border-rose-400 cursor-pointer animate-pulse-glow mt-2"
      >
        <span>⚔️ HAZIRIM, BOSS SAVAŞINA GİR!</span>
        <ChevronRight size={18} />
      </motion.button>
    </div>
  );
}

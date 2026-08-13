import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Shield, Lock, Coins, Award, X, Compass, Layers, Zap } from 'lucide-react';
import { LETTER_DEFINITIONS, SEAL_DEFINITIONS, PASSIVE_JOKERS, SPECIAL_CARDS } from '../game/cardData';
import { RELICS } from '../game/relicData';
import { REGIONAL_BIOMES } from '../game/mapGenerator';
import { getDiscoveredCodexItems, isCodexItemDiscovered } from '../game/codexManager';

export function CodexModal({ onClose }) {
  const [tab, setTab] = useState('LETTERS'); // LETTERS | SEALS | SPECIAL | RELICS | BIOMES | JOKERS
  const discoveredSet = getDiscoveredCodexItems();

  const letterKeys = Object.keys(LETTER_DEFINITIONS);
  const discoveredLetterCount = letterKeys.filter(k => discoveredSet.has(k)).length;

  const sealList = Object.values(SEAL_DEFINITIONS);
  const discoveredSealCount = sealList.filter(s => discoveredSet.has(s.id)).length;

  const specialList = Object.values(SPECIAL_CARDS);
  const discoveredSpecialCount = specialList.filter(s => discoveredSet.has(s.id) || discoveredSet.has(s.key) || discoveredSet.has(s.name)).length;

  const relicList = Object.values(RELICS);
  const discoveredRelicCount = relicList.filter(r => discoveredSet.has(r.id)).length;

  const biomeList = REGIONAL_BIOMES;
  const discoveredBiomeCount = biomeList.filter(b => discoveredSet.has(b.id)).length;

  const jokerList = Object.values(PASSIVE_JOKERS);
  const discoveredJokerCount = jokerList.filter(j => discoveredSet.has(j.id)).length;

  const RARITY_LABELS = {
    yaygin: { label: 'Yaygın', cls: 'text-slate-300 bg-slate-800 border-slate-600' },
    nadir: { label: 'Nadir', cls: 'text-blue-200 bg-blue-900/60 border-blue-600' },
    efsanevi: { label: 'Efsanevi', cls: 'text-amber-200 bg-amber-900/60 border-amber-600' },
    efsane_otesi: { label: 'Efsane Ötesi', cls: 'text-purple-200 bg-purple-900/60 border-purple-400' },
    cok_nadir: { label: 'Çok Nadir', cls: 'text-amber-200 bg-amber-900/60 border-amber-600' },
    normal: { label: 'Normal', cls: 'text-slate-400 bg-slate-900 border-slate-700' }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-2 sm:p-6 select-none">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg sm:max-w-4xl md:max-w-5xl h-[88vh] sm:h-[90vh] bg-slate-900 border-2 border-amber-500/60 rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 shadow-md">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-black text-amber-300 font-cinzel tracking-wide">
                SÖZLÜK ANSİKLOPEDİSİ
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium">
                Oynadıkça ve keşfettikçe kilitleri açılan bilgi koleksiyonu.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Category Tabs Bar */}
        <div className="grid grid-cols-6 gap-1 sm:gap-2 my-2 shrink-0">
          <button
            onClick={() => setTab('LETTERS')}
            className={`py-1.5 sm:py-2 px-1 rounded-xl border text-[9px] sm:text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
              tab === 'LETTERS' ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md' : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <span>🔤</span>
            <span>HARFLER</span>
            <span className="text-[7px] sm:text-[10px] opacity-70">({discoveredLetterCount}/{letterKeys.length})</span>
          </button>

          <button
            onClick={() => setTab('SEALS')}
            className={`py-1.5 sm:py-2 px-1 rounded-xl border text-[9px] sm:text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
              tab === 'SEALS' ? 'bg-pink-500/20 border-pink-400 text-pink-300 shadow-md' : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <span>🔴</span>
            <span>MÜHÜRLER</span>
            <span className="text-[7px] sm:text-[10px] opacity-70">({discoveredSealCount}/{sealList.length})</span>
          </button>

          <button
            onClick={() => setTab('SPECIAL')}
            className={`py-1.5 sm:py-2 px-1 rounded-xl border text-[9px] sm:text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
              tab === 'SPECIAL' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md' : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <span>🃏</span>
            <span>ÖZEL TAŞLAR</span>
            <span className="text-[7px] sm:text-[10px] opacity-70">({discoveredSpecialCount}/{specialList.length})</span>
          </button>

          <button
            onClick={() => setTab('RELICS')}
            className={`py-1.5 sm:py-2 px-1 rounded-xl border text-[9px] sm:text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
              tab === 'RELICS' ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-md' : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <span>🔮</span>
            <span>TILSIMLAR</span>
            <span className="text-[7px] sm:text-[10px] opacity-70">({discoveredRelicCount}/{relicList.length})</span>
          </button>

          <button
            onClick={() => setTab('BIOMES')}
            className={`py-1.5 sm:py-2 px-1 rounded-xl border text-[9px] sm:text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
              tab === 'BIOMES' ? 'bg-teal-500/20 border-teal-400 text-teal-300 shadow-md' : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <span>🏞️</span>
            <span>BİYOMLAR</span>
            <span className="text-[7px] sm:text-[10px] opacity-70">({discoveredBiomeCount}/{biomeList.length})</span>
          </button>

          <button
            onClick={() => setTab('JOKERS')}
            className={`py-1.5 sm:py-2 px-1 rounded-xl border text-[9px] sm:text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
              tab === 'JOKERS' ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300 shadow-md' : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <span>🟣</span>
            <span>PASİF JOKER</span>
            <span className="text-[7px] sm:text-[10px] opacity-70">({discoveredJokerCount}/{jokerList.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto pr-1 my-2">
          {/* LETTERS */}
          {tab === 'LETTERS' && (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-3">
              {letterKeys.map((letter) => {
                const info = LETTER_DEFINITIONS[letter];
                const isUnlocked = isCodexItemDiscovered(letter);

                if (!isUnlocked) {
                  return (
                    <div
                      key={letter}
                      className="p-2 sm:p-3 rounded-2xl bg-slate-950/40 border border-slate-800 flex flex-col items-center justify-center text-center opacity-40"
                    >
                      <Lock size={14} className="text-slate-600 mb-1" />
                      <span className="text-[10px] font-black text-slate-600">🔒 ???</span>
                    </div>
                  );
                }

                return (
                  <div
                    key={letter}
                    className="p-2 sm:p-3 rounded-2xl bg-slate-950 border border-amber-500/40 flex flex-col items-center justify-center text-center shadow-inner hover:border-amber-400 transition"
                  >
                    <span className="text-base sm:text-xl font-black text-amber-300">{letter}</span>
                    <span className="text-[9px] sm:text-xs font-bold text-slate-400">{info?.points || 1} Puan</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* SEALS */}
          {tab === 'SEALS' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {sealList.map((seal) => {
                const isUnlocked = isCodexItemDiscovered(seal.id);

                if (!isUnlocked) {
                  return (
                    <div
                      key={seal.id}
                      className="p-3 sm:p-4 rounded-2xl bg-slate-950/40 border border-slate-800 flex items-center gap-3 opacity-40"
                    >
                      <Lock size={20} className="text-slate-600 shrink-0" />
                      <div>
                        <div className="text-xs sm:text-sm font-black text-slate-600">🔒 ??? (Gizemli Mühür)</div>
                        <div className="text-[10px] sm:text-xs text-slate-600">Oyunda bu mühürle karşılaştığında bilgisi açılır.</div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={seal.id}
                    className={`p-3 sm:p-4 rounded-2xl border flex items-center gap-3 ${seal.badgeClass}`}
                  >
                    <span className="text-2xl sm:text-3xl shrink-0">{seal.icon}</span>
                    <div>
                      <div className="text-xs sm:text-sm font-black">{seal.name}</div>
                      <div className="text-[10px] sm:text-xs opacity-90 mt-0.5">{seal.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* SPECIAL HAND TILES */}
          {tab === 'SPECIAL' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {specialList.map((spec) => {
                const isUnlocked = isCodexItemDiscovered(spec.id) || isCodexItemDiscovered(spec.name) || isCodexItemDiscovered(spec.letter);

                if (!isUnlocked) {
                  return (
                    <div
                      key={spec.id}
                      className="p-3 sm:p-4 rounded-2xl bg-slate-950/40 border border-slate-800 flex items-center gap-3 opacity-40"
                    >
                      <Lock size={20} className="text-slate-600 shrink-0" />
                      <div>
                        <div className="text-xs sm:text-sm font-black text-slate-600">🔒 ??? (Özel Joker Taşı)</div>
                        <div className="text-[10px] sm:text-xs text-slate-600">Çarşıdan aldığında veya eline geldiğinde bilgisi açılır.</div>
                      </div>
                    </div>
                  );
                }

                const rarityInfo = RARITY_LABELS[spec.rarity] || RARITY_LABELS.nadir;

                return (
                  <div
                    key={spec.id}
                    className={`p-3 sm:p-4 rounded-2xl bg-gradient-to-r ${spec.bgGradient || 'from-slate-900 to-slate-950'} border border-cyan-500/40 flex items-start gap-3 shadow-lg`}
                  >
                    <div className="w-11 h-11 rounded-xl bg-black/40 border border-white/20 flex flex-col items-center justify-center shrink-0">
                      <span className="text-xl">{spec.letter}</span>
                      {spec.points > 0 && <span className="text-[8px] font-bold text-amber-300">+{spec.points}p</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs sm:text-sm font-black text-white">{spec.name}</span>
                        <span className={`px-1.5 py-0.5 rounded-lg border text-[8px] sm:text-[10px] font-black ${rarityInfo.cls}`}>
                          {rarityInfo.label}
                        </span>
                      </div>
                      <div className="text-[10px] sm:text-xs text-slate-200 mt-0.5 leading-snug">{spec.desc}</div>
                      <span className="text-[8px] font-bold text-cyan-300 bg-cyan-950 px-1.5 py-0.5 rounded inline-block mt-1">
                        🎴 Elde Oynanan Joker Taş
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* RELICS */}
          {tab === 'RELICS' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {relicList.map((relic) => {
                const isUnlocked = isCodexItemDiscovered(relic.id);

                if (!isUnlocked) {
                  return (
                    <div
                      key={relic.id}
                      className="p-3 sm:p-4 rounded-2xl bg-slate-950/40 border border-slate-800 flex items-center gap-3 opacity-40"
                    >
                      <Lock size={20} className="text-slate-600 shrink-0" />
                      <div>
                        <div className="text-xs sm:text-sm font-black text-slate-600">🔒 ??? (Gizemli Tılsım)</div>
                        <div className="text-[10px] sm:text-xs text-slate-600">Çarşıda veya savaşta edindiğinde bilgisi buraya eklenir.</div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={relic.id}
                    className="p-3 sm:p-4 rounded-2xl bg-slate-950 border border-purple-500/40 flex items-center gap-3 shadow-inner"
                  >
                    <span className="text-2xl sm:text-3xl shrink-0">{relic.icon}</span>
                    <div>
                      <div className="text-xs sm:text-sm font-black text-purple-300">{relic.name}</div>
                      <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5">{relic.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* BIOMES */}
          {tab === 'BIOMES' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {biomeList.map((b) => {
                const isUnlocked = isCodexItemDiscovered(b.id);

                if (!isUnlocked) {
                  return (
                    <div
                      key={b.id}
                      className="p-3 sm:p-4 rounded-2xl bg-slate-950/40 border border-slate-800 flex items-center gap-3 opacity-40"
                    >
                      <Lock size={20} className="text-slate-600 shrink-0" />
                      <div>
                        <div className="text-xs sm:text-sm font-black text-slate-600">🔒 ??? (Keşfedilmemiş Biyom)</div>
                        <div className="text-[10px] sm:text-xs text-slate-600">Bu bölgeye ulaştığında zindan ve boss bilgileri açılır.</div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={b.id}
                    className={`p-3 sm:p-4 rounded-2xl bg-slate-950 border ${b.borderColor} flex items-center gap-3 shadow-inner`}
                  >
                    <span className="text-2xl sm:text-3xl shrink-0">{b.icon}</span>
                    <div>
                      <div className={`text-xs sm:text-sm font-black ${b.accentColor}`}>{b.name}</div>
                      <div className="text-[10px] sm:text-xs text-slate-300 font-bold mt-0.5">{b.modifier.name}: {b.modifier.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* JOKERS */}
          {tab === 'JOKERS' && (
            <div className="flex flex-col gap-2">
              <p className="text-[10px] sm:text-xs text-slate-500 text-center mb-1">
                Dükkândan pasif joker satın alınınca Codex'te kilit açılır.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {jokerList.map((joker) => {
                  const isUnlocked = isCodexItemDiscovered(joker.id);
                  const rarityInfo = RARITY_LABELS[joker.rarity] || RARITY_LABELS.yaygin;

                  if (!isUnlocked) {
                    return (
                      <div
                        key={joker.id}
                        className="p-3 sm:p-4 rounded-2xl bg-slate-950/40 border border-slate-800 flex items-center gap-3 opacity-40"
                      >
                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                          <Lock size={16} className="text-slate-600" />
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-black text-slate-600">🔒 ??? (Gizemli Pasif Joker)</div>
                          <div className="text-[10px] sm:text-xs text-slate-600">Dükkândan satın alındığında bilgisi açılır.</div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={joker.id}
                      className={`p-3 sm:p-4 rounded-2xl bg-gradient-to-r ${joker.bgGradient} border border-white/10 flex items-start gap-3 shadow-lg`}
                      style={{ boxShadow: `0 0 12px ${joker.glowColor}` }}
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-black/30 border border-white/10 flex flex-col items-center justify-center shrink-0">
                        <span className="text-lg sm:text-xl">{joker.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs sm:text-sm font-black text-white">{joker.name}</span>
                          <span className={`px-1.5 py-0.5 rounded-lg border text-[8px] sm:text-[10px] font-black ${rarityInfo.cls}`}>
                            {rarityInfo.label}
                          </span>
                        </div>
                        <div className="text-[10px] sm:text-xs text-slate-200 mt-0.5 leading-snug">{joker.desc}</div>
                        {joker.flavorText && (
                          <div className="text-[9px] sm:text-[10px] text-slate-400 italic mt-1 leading-snug border-t border-white/10 pt-1">
                            {joker.flavorText}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-black py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm transition cursor-pointer"
          >
            KAPAT
          </button>
        </div>
      </motion.div>
    </div>
  );
}

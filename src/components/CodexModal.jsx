import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Shield, Lock, Coins, Award, X, Compass, Layers, Zap, Search, HelpCircle } from 'lucide-react';
import { LETTER_DEFINITIONS, SEAL_DEFINITIONS, PASSIVE_JOKERS, SPECIAL_CARDS } from '../game/cardData';
import { RELICS } from '../game/relicData';
import { REGIONAL_BIOMES } from '../game/mapGenerator';
import { getDiscoveredCodexItems, isCodexItemDiscovered } from '../game/codexManager';
import { soundEngine } from '../game/audioEngine';

export function CodexModal({ onClose }) {
  const [tab, setTab] = useState('LETTERS'); // LETTERS | SEALS | SPECIAL | RELICS | BIOMES | JOKERS
  const [searchQuery, setSearchQuery] = useState('');
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

  const totalItems = letterKeys.length + sealList.length + specialList.length + relicList.length + biomeList.length + jokerList.length;
  const totalDiscovered = discoveredLetterCount + discoveredSealCount + discoveredSpecialCount + discoveredRelicCount + discoveredBiomeCount + discoveredJokerCount;
  const completionPercent = Math.floor((totalDiscovered / Math.max(1, totalItems)) * 100);

  const RARITY_LABELS = {
    yaygin: { label: 'Yaygın', cls: 'text-slate-300 bg-slate-800 border-slate-600' },
    nadir: { label: 'Nadir', cls: 'text-blue-200 bg-blue-900/80 border-blue-400' },
    efsanevi: { label: 'Efsanevi', cls: 'text-amber-200 bg-amber-900/80 border-amber-400' },
    efsane_otesi: { label: 'Efsane Ötesi', cls: 'text-purple-200 bg-purple-900/80 border-purple-400' },
    cok_nadir: { label: 'Çok Nadir', cls: 'text-amber-200 bg-amber-900/80 border-amber-400' },
    normal: { label: 'Normal', cls: 'text-slate-400 bg-slate-900 border-slate-700' }
  };

  const handleTabChange = (newTab) => {
    try { soundEngine.playTap?.(); } catch(e) {}
    setTab(newTab);
  };

  const filterItem = (text) => {
    if (!searchQuery.trim()) return true;
    return String(text || '').toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-6 select-none">
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 260 }}
        className="w-full max-w-lg sm:max-w-4xl md:max-w-5xl h-[88vh] sm:h-[90vh] bg-gradient-to-b from-slate-900 via-[#101726] to-slate-950 border-2 border-amber-400/80 rounded-3xl p-4 sm:p-7 shadow-[0_0_60px_rgba(245,158,11,0.25)] flex flex-col justify-between relative overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-800/90 pb-3 mb-2 shrink-0 gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-500/30 to-amber-700/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-2xl font-black text-amber-300 font-cinzel tracking-wider flex items-center gap-2.5">
                <span>SÖZLÜK ANSİKLOPEDİSİ</span>
                <span className="text-[11px] bg-amber-500/20 text-amber-300 border border-amber-400/60 px-2.5 py-0.5 rounded-full font-black font-mono shadow">
                  %{completionPercent} KEŞFEDİLDİ
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Oynadıkça kilitleri açılan {totalItems} içerikten {totalDiscovered} tanesi keşfedildi.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Bar Input */}
            <div className="relative hidden sm:block">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Ansiklopedide ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 rounded-2xl bg-slate-950 border-2 border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/80 w-48 shadow-inner"
              />
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-slate-950 text-slate-400 hover:text-slate-100 border-2 border-slate-800 hover:border-amber-400/60 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full bg-slate-950 rounded-full h-3 mb-3 p-0.5 border-2 border-slate-800 overflow-hidden shrink-0 shadow-inner">
          <div
            className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 h-full rounded-full transition-all duration-700 shadow-[0_0_15px_rgba(245,158,11,0.7)]"
            style={{ width: `${completionPercent}%` }}
          />
        </div>

        {/* Category Tabs Bar */}
        <div className="grid grid-cols-6 gap-1.5 sm:gap-2.5 my-1.5 shrink-0">
          {[
            { id: 'LETTERS', label: 'HARFLER', icon: '🔤', count: `${discoveredLetterCount}/${letterKeys.length}`, activeCls: 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]' },
            { id: 'SEALS', label: 'MÜHÜRLER', icon: '🔴', count: `${discoveredSealCount}/${sealList.length}`, activeCls: 'bg-pink-500/20 border-pink-400 text-pink-300 shadow-[0_0_15px_rgba(244,114,182,0.3)]' },
            { id: 'SPECIAL', label: 'ÖZEL TAŞLAR', icon: '🃏', count: `${discoveredSpecialCount}/${specialList.length}`, activeCls: 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.3)]' },
            { id: 'RELICS', label: 'TILSIMLAR', icon: '🔮', count: `${discoveredRelicCount}/${relicList.length}`, activeCls: 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-[0_0_15px_rgba(192,132,252,0.3)]' },
            { id: 'BIOMES', label: 'BİYOMLAR', icon: '🏞️', count: `${discoveredBiomeCount}/${biomeList.length}`, activeCls: 'bg-teal-500/20 border-teal-400 text-teal-300 shadow-[0_0_15px_rgba(45,212,191,0.3)]' },
            { id: 'JOKERS', label: 'PASİF JOKER', icon: '🟣', count: `${discoveredJokerCount}/${jokerList.length}`, activeCls: 'bg-yellow-500/20 border-yellow-400 text-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.3)]' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className={`py-2 px-1 rounded-2xl border-2 text-[10px] sm:text-xs font-black transition flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer active:scale-95 ${
                tab === t.id ? t.activeCls : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span className="text-sm">{t.icon}</span>
              <span className="tracking-wider">{t.label}</span>
              <span className="text-[9px] sm:text-[10px] opacity-80 font-mono">({t.count})</span>
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto pr-1 my-3 scrollbar-thin">
          {/* LETTERS */}
          {tab === 'LETTERS' && (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5 sm:gap-3.5">
              {letterKeys.filter(letter => filterItem(letter)).map((letter) => {
                const info = LETTER_DEFINITIONS[letter];
                const isUnlocked = isCodexItemDiscovered(letter);

                if (!isUnlocked) {
                  return (
                    <div
                      key={letter}
                      className="p-3 sm:p-4 rounded-2xl bg-slate-950/50 border-2 border-slate-800/80 flex flex-col items-center justify-center text-center opacity-40 shadow-inner"
                    >
                      <Lock size={16} className="text-slate-600 mb-1" />
                      <span className="text-[10px] font-black text-slate-600 font-mono">🔒 ???</span>
                    </div>
                  );
                }

                return (
                  <motion.div
                    key={letter}
                    whileHover={{ scale: 1.06, y: -2 }}
                    className="p-3 sm:p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-400/80 flex flex-col items-center justify-center text-center shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:border-amber-300 transition cursor-pointer relative overflow-hidden"
                  >
                    <span className="text-xl sm:text-2xl font-black text-amber-300 font-cinzel drop-shadow">{letter}</span>
                    <span className="text-[10px] sm:text-xs font-black text-slate-300 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded-lg mt-1">
                      {info?.points || 1} Puan
                    </span>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* SEALS */}
          {tab === 'SEALS' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {sealList.filter(seal => filterItem(seal.name) || filterItem(seal.desc)).map((seal) => {
                const isUnlocked = isCodexItemDiscovered(seal.id);

                if (!isUnlocked) {
                  return (
                    <div
                      key={seal.id}
                      className="p-4 rounded-3xl bg-slate-950/50 border-2 border-slate-800/80 flex items-center gap-3.5 opacity-40"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                        <Lock size={22} className="text-slate-600" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-black text-slate-500">🔒 ??? (Gizemli Mühür)</div>
                        <div className="text-[11px] text-slate-600 font-medium">Oyunda bu mühürle karşılaştığında bilgisi açılır.</div>
                      </div>
                    </div>
                  );
                }

                return (
                  <motion.div
                    key={seal.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-3xl border-2 flex items-center gap-3.5 shadow-xl ${seal.badgeClass} backdrop-blur-md`}
                  >
                    <span className="text-3xl sm:text-4xl p-2 rounded-2xl bg-black/40 border border-white/20 shrink-0">{seal.icon}</span>
                    <div>
                      <div className="text-sm sm:text-base font-black tracking-wide">{seal.name}</div>
                      <div className="text-xs opacity-90 mt-0.5 leading-relaxed">{seal.desc}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* SPECIAL HAND TILES */}
          {tab === 'SPECIAL' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {specialList.filter(spec => filterItem(spec.name) || filterItem(spec.desc)).map((spec) => {
                const isUnlocked = isCodexItemDiscovered(spec.id) || isCodexItemDiscovered(spec.name) || isCodexItemDiscovered(spec.letter);

                if (!isUnlocked) {
                  return (
                    <div
                      key={spec.id}
                      className="p-4 rounded-3xl bg-slate-950/50 border-2 border-slate-800/80 flex items-center gap-3.5 opacity-40"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                        <Lock size={22} className="text-slate-600" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-black text-slate-500">🔒 ??? (Özel Joker Taş)</div>
                        <div className="text-[11px] text-slate-600 font-medium">Çarşıdan aldığında veya eline geldiğinde bilgisi açılır.</div>
                      </div>
                    </div>
                  );
                }

                const rarityInfo = RARITY_LABELS[spec.rarity] || RARITY_LABELS.nadir;

                return (
                  <motion.div
                    key={spec.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-3xl bg-gradient-to-r ${spec.bgGradient || 'from-slate-900 to-slate-950'} border-2 border-cyan-400/60 flex items-start gap-3.5 shadow-xl`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-black/50 border-2 border-cyan-300/40 flex flex-col items-center justify-center shrink-0 shadow">
                      <span className="text-2xl font-black text-white">{spec.letter}</span>
                      {spec.points > 0 && <span className="text-[9px] font-black text-amber-300">+{spec.points}p</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="text-sm font-black text-white">{spec.name}</span>
                        <span className={`px-2 py-0.5 rounded-lg border-2 text-[9px] font-black uppercase ${rarityInfo.cls}`}>
                          {rarityInfo.label}
                        </span>
                      </div>
                      <div className="text-xs text-slate-200 leading-relaxed">{spec.desc}</div>
                      <span className="text-[9px] font-black text-cyan-300 bg-cyan-950/90 border border-cyan-500/40 px-2 py-0.5 rounded-md inline-block mt-1.5">
                        🎴 Elde Oynanan Joker Taş
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* RELICS */}
          {tab === 'RELICS' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {relicList.filter(relic => filterItem(relic.name) || filterItem(relic.desc)).map((relic) => {
                const isUnlocked = isCodexItemDiscovered(relic.id);

                if (!isUnlocked) {
                  return (
                    <div
                      key={relic.id}
                      className="p-4 rounded-3xl bg-slate-950/50 border-2 border-slate-800/80 flex items-center gap-3.5 opacity-40"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                        <Lock size={22} className="text-slate-600" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-black text-slate-500">🔒 ??? (Gizemli Tılsım)</div>
                        <div className="text-[11px] text-slate-600 font-medium">Çarşıda veya savaşta edindiğinde bilgisi buraya eklenir.</div>
                      </div>
                    </div>
                  );
                }

                return (
                  <motion.div
                    key={relic.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-3xl bg-slate-950/90 border-2 border-purple-500/60 flex items-center gap-3.5 shadow-xl backdrop-blur-md"
                  >
                    <span className="text-3xl sm:text-4xl p-2 rounded-2xl bg-purple-950/80 border border-purple-500/40 shrink-0">{relic.icon}</span>
                    <div>
                      <div className="text-sm sm:text-base font-black text-purple-300">{relic.name}</div>
                      <div className="text-xs text-slate-300 font-medium mt-0.5 leading-relaxed">{relic.desc}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* BIOMES */}
          {tab === 'BIOMES' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {biomeList.filter(b => filterItem(b.name) || filterItem(b.modifier?.desc)).map((b) => {
                const isUnlocked = isCodexItemDiscovered(b.id);

                if (!isUnlocked) {
                  return (
                    <div
                      key={b.id}
                      className="p-4 rounded-3xl bg-slate-950/50 border-2 border-slate-800/80 flex items-center gap-3.5 opacity-40"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                        <Lock size={22} className="text-slate-600" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-black text-slate-500">🔒 ??? (Keşfedilmemiş Biyom)</div>
                        <div className="text-[11px] text-slate-600 font-medium">Bu bölgeye ulaştığında zindan ve boss bilgileri açılır.</div>
                      </div>
                    </div>
                  );
                }

                return (
                  <motion.div
                    key={b.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-3xl bg-slate-950/90 border-2 ${b.borderColor} flex items-center gap-3.5 shadow-xl backdrop-blur-md`}
                  >
                    <span className="text-3xl sm:text-4xl p-2 rounded-2xl bg-slate-900 border border-slate-800 shrink-0">{b.icon}</span>
                    <div>
                      <div className={`text-sm sm:text-base font-black ${b.accentColor}`}>{b.name}</div>
                      <div className="text-xs text-slate-200 font-extrabold mt-0.5 leading-relaxed">{b.modifier.name}: {b.modifier.desc}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* JOKERS */}
          {tab === 'JOKERS' && (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-slate-400 text-center mb-1 font-extrabold">
                💡 Dükkândan pasif joker satın alınınca Codex'te kilit otomatik açılır.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {jokerList.filter(joker => filterItem(joker.name) || filterItem(joker.desc)).map((joker) => {
                  const isUnlocked = isCodexItemDiscovered(joker.id);
                  const rarityInfo = RARITY_LABELS[joker.rarity] || RARITY_LABELS.yaygin;

                  if (!isUnlocked) {
                    return (
                      <div
                        key={joker.id}
                        className="p-4 rounded-3xl bg-slate-950/50 border-2 border-slate-800/80 flex items-center gap-3.5 opacity-40"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                          <Lock size={22} className="text-slate-600" />
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-black text-slate-500">🔒 ??? (Gizemli Pasif Joker)</div>
                          <div className="text-[11px] text-slate-600 font-medium">Dükkândan satın alındığında bilgisi açılır.</div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <motion.div
                      key={joker.id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-3xl bg-gradient-to-r ${joker.bgGradient} border-2 border-yellow-400/60 flex items-start gap-3.5 shadow-xl backdrop-blur-md`}
                      style={{ boxShadow: `0 0 20px ${joker.glowColor}` }}
                    >
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-black/40 border-2 border-white/20 flex flex-col items-center justify-center shrink-0 shadow">
                        <span className="text-2xl sm:text-3xl">{joker.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="text-sm font-black text-white">{joker.name}</span>
                          <span className={`px-2 py-0.5 rounded-lg border-2 text-[9px] font-black uppercase ${rarityInfo.cls}`}>
                            {rarityInfo.label}
                          </span>
                        </div>
                        <div className="text-xs text-slate-100 leading-relaxed font-medium">{joker.desc}</div>
                        {joker.flavorText && (
                          <div className="text-[10px] text-amber-200/90 italic mt-1.5 leading-snug border-t border-white/10 pt-1 font-cinzel">
                            {joker.flavorText}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t-2 border-slate-800 shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black py-3 sm:py-3.5 rounded-2xl text-xs sm:text-sm transition cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.4)] tracking-wider"
          >
            KAPAT
          </button>
        </div>
      </motion.div>
    </div>
  );
}


import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Shield, Lock, Coins, Award, X, Compass, Layers } from 'lucide-react';
import { LETTER_DEFINITIONS, SEAL_DEFINITIONS } from '../game/cardData';
import { RELICS } from '../game/relicData';
import { REGIONAL_BIOMES } from '../game/mapGenerator';
import { getDiscoveredCodexItems, isCodexItemDiscovered } from '../game/codexManager';

export function CodexModal({ onClose }) {
  const [tab, setTab] = useState('LETTERS'); // LETTERS | SEALS | RELICS | BIOMES
  const discoveredSet = getDiscoveredCodexItems();

  const letterKeys = Object.keys(LETTER_DEFINITIONS);
  const discoveredLetterCount = letterKeys.filter(k => discoveredSet.has(k)).length;

  const sealList = Object.values(SEAL_DEFINITIONS);
  const discoveredSealCount = sealList.filter(s => discoveredSet.has(s.id)).length;

  const relicList = Object.values(RELICS);
  const discoveredRelicCount = relicList.filter(r => discoveredSet.has(r.id)).length;

  const biomeList = REGIONAL_BIOMES;
  const discoveredBiomeCount = biomeList.filter(b => discoveredSet.has(b.id)).length;

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 select-none">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg h-[82vh] bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-4 shadow-2xl flex flex-col justify-between relative overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="text-base font-black text-amber-300 font-cinzel">SÖZLÜK ANSİKLOPEDİSİ</h2>
              <p className="text-[10px] text-slate-400 font-medium">Oynadıkça ve keşfettikçe kilitleri açılan bilgi koleksiyonu.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-4 gap-1.5 my-2.5">
          <button
            onClick={() => setTab('LETTERS')}
            className={`py-1.5 px-1 rounded-xl border text-[10px] font-bold transition flex flex-col items-center gap-0.5 ${
              tab === 'LETTERS' ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <span>🔤 HARFLER</span>
            <span className="text-[8px] opacity-80">({discoveredLetterCount}/{letterKeys.length})</span>
          </button>

          <button
            onClick={() => setTab('SEALS')}
            className={`py-1.5 px-1 rounded-xl border text-[10px] font-bold transition flex flex-col items-center gap-0.5 ${
              tab === 'SEALS' ? 'bg-pink-500/20 border-pink-400 text-pink-300' : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <span>🔴 MÜHÜRLER</span>
            <span className="text-[8px] opacity-80">({discoveredSealCount}/{sealList.length})</span>
          </button>

          <button
            onClick={() => setTab('RELICS')}
            className={`py-1.5 px-1 rounded-xl border text-[10px] font-bold transition flex flex-col items-center gap-0.5 ${
              tab === 'RELICS' ? 'bg-purple-500/20 border-purple-400 text-purple-300' : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <span>🔮 TILSIMLAR</span>
            <span className="text-[8px] opacity-80">({discoveredRelicCount}/{relicList.length})</span>
          </button>

          <button
            onClick={() => setTab('BIOMES')}
            className={`py-1.5 px-1 rounded-xl border text-[10px] font-bold transition flex flex-col items-center gap-0.5 ${
              tab === 'BIOMES' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <span>🏞️ BİYOMLAR</span>
            <span className="text-[8px] opacity-80">({discoveredBiomeCount}/{biomeList.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto pr-1 my-1">
          {/* LETTERS */}
          {tab === 'LETTERS' && (
            <div className="grid grid-cols-4 gap-2">
              {letterKeys.map((letter) => {
                const info = LETTER_DEFINITIONS[letter];
                const isUnlocked = isCodexItemDiscovered(letter);

                if (!isUnlocked) {
                  return (
                    <div
                      key={letter}
                      className="p-2 rounded-2xl bg-slate-950/40 border border-slate-800 flex flex-col items-center justify-center text-center opacity-40"
                    >
                      <Lock size={14} className="text-slate-600 mb-1" />
                      <span className="text-[10px] font-black text-slate-600">🔒 ???</span>
                    </div>
                  );
                }

                return (
                  <div
                    key={letter}
                    className="p-2 rounded-2xl bg-slate-950 border border-amber-500/40 flex flex-col items-center justify-center text-center shadow-inner"
                  >
                    <span className="text-base font-black text-amber-300">{letter}</span>
                    <span className="text-[9px] font-bold text-slate-400">{info?.points || 1} Puan</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* SEALS */}
          {tab === 'SEALS' && (
            <div className="flex flex-col gap-2">
              {sealList.map((seal) => {
                const isUnlocked = isCodexItemDiscovered(seal.id);

                if (!isUnlocked) {
                  return (
                    <div
                      key={seal.id}
                      className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800 flex items-center gap-3 opacity-40"
                    >
                      <Lock size={20} className="text-slate-600" />
                      <div>
                        <div className="text-xs font-black text-slate-600">🔒 ??? (Gizemli Mühür)</div>
                        <div className="text-[10px] text-slate-600">Oyunda bu mühürle karşılaştığında bilgisi açılır.</div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={seal.id}
                    className={`p-3 rounded-2xl border flex items-center gap-3 ${seal.badgeClass}`}
                  >
                    <span className="text-2xl">{seal.icon}</span>
                    <div>
                      <div className="text-xs font-black">{seal.name}</div>
                      <div className="text-[10px] opacity-90 mt-0.5">{seal.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* RELICS */}
          {tab === 'RELICS' && (
            <div className="flex flex-col gap-2">
              {relicList.map((relic) => {
                const isUnlocked = isCodexItemDiscovered(relic.id);

                if (!isUnlocked) {
                  return (
                    <div
                      key={relic.id}
                      className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800 flex items-center gap-3 opacity-40"
                    >
                      <Lock size={20} className="text-slate-600" />
                      <div>
                        <div className="text-xs font-black text-slate-600">🔒 ??? (Gizemli Tılsım)</div>
                        <div className="text-[10px] text-slate-600">Çarşıda veya savaşta edindiğinde bilgisi buraya eklenir.</div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={relic.id}
                    className="p-3 rounded-2xl bg-slate-950 border border-purple-500/40 flex items-center gap-3"
                  >
                    <span className="text-2xl">{relic.icon}</span>
                    <div>
                      <div className="text-xs font-black text-purple-300">{relic.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{relic.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* BIOMES */}
          {tab === 'BIOMES' && (
            <div className="flex flex-col gap-2">
              {biomeList.map((b) => {
                const isUnlocked = isCodexItemDiscovered(b.id);

                if (!isUnlocked) {
                  return (
                    <div
                      key={b.id}
                      className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800 flex items-center gap-3 opacity-40"
                    >
                      <Lock size={20} className="text-slate-600" />
                      <div>
                        <div className="text-xs font-black text-slate-600">🔒 ??? (Keşfedilmemiş Biyom)</div>
                        <div className="text-[10px] text-slate-600">Bu bölgeye ulaştığında zindan ve boss bilgileri açılır.</div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={b.id}
                    className={`p-3 rounded-2xl bg-slate-950 border ${b.borderColor} flex items-center gap-3`}
                  >
                    <span className="text-2xl">{b.icon}</span>
                    <div>
                      <div className={`text-xs font-black ${b.accentColor}`}>{b.name}</div>
                      <div className="text-[10px] text-slate-300 font-bold mt-0.5">{b.modifier.name}: {b.modifier.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-black py-2.5 rounded-xl text-xs transition cursor-pointer"
          >
            KAPAT
          </button>
        </div>
      </motion.div>
    </div>
  );
}

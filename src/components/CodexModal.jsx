import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Shield, Lock, Coins, Award, X, Compass, Layers } from 'lucide-react';
import { LETTER_DEFINITIONS, SEAL_DEFINITIONS, PASSIVE_JOKERS } from '../game/cardData';
import { RELICS } from '../game/relicData';
import { REGIONAL_BIOMES } from '../game/mapGenerator';
import { getDiscoveredCodexItems, isCodexItemDiscovered } from '../game/codexManager';

export function CodexModal({ onClose }) {
  const [tab, setTab] = useState('LETTERS'); // LETTERS | SEALS | RELICS | BIOMES | JOKERS
  const discoveredSet = getDiscoveredCodexItems();

  const letterKeys = Object.keys(LETTER_DEFINITIONS);
  const discoveredLetterCount = letterKeys.filter(k => discoveredSet.has(k)).length;

  const sealList = Object.values(SEAL_DEFINITIONS);
  const discoveredSealCount = sealList.filter(s => discoveredSet.has(s.id)).length;

  const relicList = Object.values(RELICS);
  const discoveredRelicCount = relicList.filter(r => discoveredSet.has(r.id)).length;

  const biomeList = REGIONAL_BIOMES;
  const discoveredBiomeCount = biomeList.filter(b => discoveredSet.has(b.id)).length;

  const jokerList = Object.values(PASSIVE_JOKERS);
  const discoveredJokerCount = jokerList.filter(j => discoveredSet.has(j.id)).length;

  const RARITY_LABELS = {
    yaygin: { label: 'YaygÄ±n', cls: 'text-slate-300 bg-slate-800 border-slate-600' },
    nadir: { label: 'Nadir', cls: 'text-blue-200 bg-blue-900/60 border-blue-600' },
    efsanevi: { label: 'Efsanevi', cls: 'text-amber-200 bg-amber-900/60 border-amber-600' },
    efsane_otesi: { label: 'Efsane Ã–tesi', cls: 'text-purple-200 bg-purple-900/60 border-purple-400' },
  };

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
              <h2 className="text-base font-black text-amber-300 font-cinzel">SÃ–ZLÃœK ANSÄ°KLOPEDÄ°SÄ°</h2>
              <p className="text-[10px] text-slate-400 font-medium">OynadÄ±kÃ§a ve keÅŸfettikÃ§e kilitleri aÃ§Ä±lan bilgi koleksiyonu.</p>
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
        <div className="grid grid-cols-5 gap-1 my-2">
          <button
            onClick={() => setTab('LETTERS')}
            className={`py-1.5 px-1 rounded-xl border text-[9px] font-bold transition flex flex-col items-center gap-0.5 ${
              tab === 'LETTERS' ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <span>ğŸ”¤</span>
            <span>HARFLER</span>
            <span className="text-[7px] opacity-70">({discoveredLetterCount}/{letterKeys.length})</span>
          </button>

          <button
            onClick={() => setTab('SEALS')}
            className={`py-1.5 px-1 rounded-xl border text-[9px] font-bold transition flex flex-col items-center gap-0.5 ${
              tab === 'SEALS' ? 'bg-pink-500/20 border-pink-400 text-pink-300' : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <span>ğŸ”´</span>
            <span>MÃœHÃœRLER</span>
            <span className="text-[7px] opacity-70">({discoveredSealCount}/{sealList.length})</span>
          </button>

          <button
            onClick={() => setTab('RELICS')}
            className={`py-1.5 px-1 rounded-xl border text-[9px] font-bold transition flex flex-col items-center gap-0.5 ${
              tab === 'RELICS' ? 'bg-purple-500/20 border-purple-400 text-purple-300' : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <span>ğŸ”®</span>
            <span>TILSIMLAR</span>
            <span className="text-[7px] opacity-70">({discoveredRelicCount}/{relicList.length})</span>
          </button>

          <button
            onClick={() => setTab('BIOMES')}
            className={`py-1.5 px-1 rounded-xl border text-[9px] font-bold transition flex flex-col items-center gap-0.5 ${
              tab === 'BIOMES' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <span>ğŸï¸</span>
            <span>BÄ°YOMLAR</span>
            <span className="text-[7px] opacity-70">({discoveredBiomeCount}/{biomeList.length})</span>
          </button>

          <button
            onClick={() => setTab('JOKERS')}
            className={`py-1.5 px-1 rounded-xl border text-[9px] font-bold transition flex flex-col items-center gap-0.5 ${
              tab === 'JOKERS' ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300' : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <span>ğŸƒ</span>
            <span>JOKERLER</span>
            <span className="text-[7px] opacity-70">({discoveredJokerCount}/{jokerList.length})</span>
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
                      <span className="text-[10px] font-black text-slate-600">ğŸ”’ ???</span>
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
                        <div className="text-xs font-black text-slate-600">ğŸ”’ ??? (Gizemli MÃ¼hÃ¼r)</div>
                        <div className="text-[10px] text-slate-600">Oyunda bu mÃ¼hÃ¼rle karÅŸÄ±laÅŸtÄ±ÄŸÄ±nda bilgisi aÃ§Ä±lÄ±r.</div>
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
                        <div className="text-xs font-black text-slate-600">ğŸ”’ ??? (Gizemli TÄ±lsÄ±m)</div>
                        <div className="text-[10px] text-slate-600">Ã‡arÅŸÄ±da veya savaÅŸta edindiÄŸinde bilgisi buraya eklenir.</div>
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
                        <div className="text-xs font-black text-slate-600">ğŸ”’ ??? (KeÅŸfedilmemiÅŸ Biyom)</div>
                        <div className="text-[10px] text-slate-600">Bu bÃ¶lgeye ulaÅŸtÄ±ÄŸÄ±nda zindan ve boss bilgileri aÃ§Ä±lÄ±r.</div>
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

          {/* JOKERS */}
          {tab === 'JOKERS' && (
            <div className="flex flex-col gap-2">
              <p className="text-[10px] text-slate-500 text-center mb-1">
                DÃ¼kkÃ¢ndan joker satÄ±n alÄ±nca Codex'te aÃ§Ä±lÄ±r.
              </p>
              {jokerList.map((joker) => {
                const isUnlocked = isCodexItemDiscovered(joker.id);
                const rarityInfo = RARITY_LABELS[joker.rarity] || RARITY_LABELS.yaygin;

                if (!isUnlocked) {
                  return (
                    <div
                      key={joker.id}
                      className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800 flex items-center gap-3 opacity-40"
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center">
                        <Lock size={16} className="text-slate-600" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-600">ğŸ”’ ??? (Gizemli Joker)</div>
                        <div className="text-[10px] text-slate-600">DÃ¼kkÃ¢ndan satÄ±n alÄ±ndÄ±ÄŸÄ±nda bilgisi aÃ§Ä±lÄ±r.</div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={joker.id}
                    className={`p-3 rounded-2xl bg-gradient-to-r ${joker.bgGradient} border border-white/10 flex items-start gap-3`}
                    style={{ boxShadow: `0 0 12px ${joker.glowColor}` }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-black/30 border border-white/10 flex flex-col items-center justify-center shrink-0">
                      <span className="text-lg">{joker.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-black text-white">{joker.name}</span>
                        <span className={`px-1.5 py-0.5 rounded-lg border text-[8px] font-black ${rarityInfo.cls}`}>
                          {rarityInfo.label}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-200 mt-0.5 leading-snug">{joker.desc}</div>
                      {joker.flavorText && (
                        <div className="text-[9px] text-slate-400 italic mt-1 leading-snug border-t border-white/10 pt-1">
                          {joker.flavorText}
                        </div>
                      )}
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


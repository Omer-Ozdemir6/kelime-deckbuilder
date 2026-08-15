import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sparkles, Shield, Lock, Coins, Award, X, Compass, Layers, Zap, Search, HelpCircle, Filter, Eye, CheckCircle2, Info, Key, Target } from 'lucide-react';
import { LETTER_DEFINITIONS, SEAL_DEFINITIONS, PASSIVE_JOKERS, SPECIAL_CARDS } from '../game/cardData';
import { RELICS } from '../game/relicData';
import { REGIONAL_BIOMES } from '../game/mapGenerator';
import { getDiscoveredCodexItems, isCodexItemDiscovered } from '../game/codexManager';
import { soundEngine } from '../game/audioEngine';
import { BalatroJokerCard } from './BalatroJokerCard';
import { JokerCardIllustration } from './JokerCardIllustration';

function getItemUnlockCondition(item, category, index) {
  if (item?.unlockHint) return item.unlockHint;

  if (category === 'JOKERS') {
    const rarity = item.rarity;
    if (rarity === 'efsane_otesi') {
      return '🔮 Çarşıdaki Mistik Ritüel Paketinden çıkar veya Ante 7 Boss\'unu yen.';
    }
    if (rarity === 'efsanevi') {
      return '👑 Ante 6 veya üstü seviye Boss\'unu mağlup ederek dükkânda kilidini aç.';
    }
    if (rarity === 'cok_nadir') {
      return '💎 Çarşıdan Pasif Joker alarak veya Efsanevi Paket açarak kilidini aç.';
    }
    if (item.name?.includes('Koşucu') || item.desc?.includes('Kombo')) {
      return '⚡ Tek bir turda Kombo sayacını 5 veya üzerine çıkar.';
    }
    if (item.name?.includes('Ejderha') || item.desc?.includes('Uzun')) {
      return '🔥 Savaş esnasında 6 harften uzun bir kelime oluştur.';
    }
    if (item.name?.includes('Altın') || item.name?.includes('Maden') || item.desc?.includes('Altın')) {
      return '💰 Tur tamamlandığında 30 Altın veya daha fazla servete ulaş.';
    }
    if (item.name?.includes('Mühür') || item.desc?.includes('Mühür')) {
      return '🔴 Destedeki bir harfe büyülü Mühür uygula.';
    }

    const jokerHints = [
      '🛒 Çarşıdan Pasif Joker slotu satın alarak kilidini aç.',
      '📦 Pasif Joker Paketlerinden (Booster Pack) rastgele çıkar.',
      '⚔️ Bir Mücadele (Blind) aşamasını tek kelimede tamamla.',
      '⚡ Kombo sayacını düşürmeden turu bitir.',
      '💎 Nadir bir harf (J, F, H, Ğ, V) içeren kelime yaz.',
      '📜 Savaşta Kelime Uzatma (Zincir) hamlesi yap.',
      '🏆 Zindanda Ante 3 Aşamasına başarıyla ulaş.',
      '🔮 Mistik Sandık açarak bu kartın kilidini aç.'
    ];
    return jokerHints[index % jokerHints.length];
  }

  if (category === 'SPECIAL') {
    const specialHints = [
      '🎴 Çarşıdan Özel Joker Taş Paketi satın al.',
      '⚡ Savaşta 2x Çarpan Kartını kelimede kullan.',
      '🗑️ Eldeki gereksiz bir harfi Sil Kartı ile yok et.',
      '🪞 Elde Ayna Harfi ile yanındaki harfi kopyala.',
      '💰 Altın Harf oynayarak anında ek altın kazan.',
      '🔥 Kül Harfini yüksek puan için feda et.'
    ];
    return specialHints[index % specialHints.length];
  }

  if (category === 'SEALS') {
    const sealHints = [
      '🔴 Çarşıda harfe Kırmızı Mühür bastır.',
      '💰 Çarşıda harfe Altın Mühür efsunla.',
      '❄️ Büyülü Sandıktan Buz Mühürlü Harf çıkar.',
      '👑 Kral Mührü içeren efsunlu kart edin.',
      '💥 Polikrom Mührü harfine uygulayarak katla.'
    ];
    return sealHints[index % sealHints.length];
  }

  if (category === 'RELICS') {
    const relicHints = [
      '🔮 Zindanda Mistik Hazine Sandığı aç.',
      '👑 Ante Boss\'unu alt ederek Tılsım ödülü kazan.',
      '🛒 Çarşıdaki Tılsım Satıcısından satın al.',
      '🎯 Gizemli Olay (Event) odasında hazineyi seç.'
    ];
    return relicHints[index % relicHints.length];
  }

  if (category === 'BIOMES') {
    return `🏞️ Zindanda Ante ${index + 1} Seviyesine ulaşarak bu bölgenin kilidini aç.`;
  }

  if (category === 'LETTERS') {
    return '🔤 Deste düzenleme ekranından veya Çarşıdan bu harfi destene ekle.';
  }

  return '🎯 Oyunda karşılaşıldığında veya satın alındığında kilit açılır.';
}

export function CodexModal({ onClose }) {
  const [tab, setTab] = useState('JOKERS'); // LETTERS | SEALS | SPECIAL | RELICS | BIOMES | JOKERS
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL | UNLOCKED | LOCKED
  const [rarityFilter, setRarityFilter] = useState('ALL'); // ALL | yaygin | nadir | efsanevi | efsane_otesi
  const [inspectedItem, setInspectedItem] = useState(null);

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
    nadir: { label: 'Nadir', cls: 'text-cyan-200 bg-cyan-950/80 border-cyan-400' },
    efsanevi: { label: 'Efsanevi', cls: 'text-amber-200 bg-amber-950/80 border-amber-400' },
    efsane_otesi: { label: 'Spectral', cls: 'text-purple-200 bg-purple-950/80 border-purple-400' },
    cok_nadir: { label: 'Çok Nadir', cls: 'text-amber-200 bg-amber-950/80 border-amber-400' },
    normal: { label: 'Normal', cls: 'text-slate-400 bg-slate-900 border-slate-700' }
  };

  const handleTabChange = (newTab) => {
    try { soundEngine.playTap?.(); } catch(e) {}
    setTab(newTab);
  };

  const filterItem = (item, idKey) => {
    const isUnlocked = isCodexItemDiscovered(idKey);

    // 1. Status Filter
    if (statusFilter === 'UNLOCKED' && !isUnlocked) return false;
    if (statusFilter === 'LOCKED' && isUnlocked) return false;

    // 2. Rarity Filter
    if (rarityFilter !== 'ALL' && item.rarity !== rarityFilter) return false;

    // 3. Search Query
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const nameMatch = String(item.name || item.id || idKey || '').toLowerCase().includes(q);
    const descMatch = String(item.desc || item.modifier?.desc || '').toLowerCase().includes(q);
    return nameMatch || descMatch;
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-4 lg:p-6 select-none">
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 260 }}
        className="w-full max-w-lg sm:max-w-4xl lg:max-w-[96vw] xl:max-w-[95vw] 2xl:max-w-[1750px] h-[88vh] sm:h-[90vh] lg:h-[94vh] bg-gradient-to-b from-slate-900 via-[#101726] to-slate-950 border-2 border-amber-400/80 lg:border-0 rounded-3xl p-3.5 sm:p-6 lg:p-7 shadow-[0_0_60px_rgba(245,158,11,0.25)] lg:shadow-2xl flex flex-col justify-between relative overflow-hidden"
      >
        {/* Top Header Row */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between border-b-2 border-slate-800/90 pb-3 mb-2 shrink-0 gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-500/30 to-amber-700/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] shrink-0">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-2xl font-black text-amber-300 font-cinzel tracking-wider flex items-center gap-2.5">
                <span>SÖZLÜK ANSİKLOPEDİSİ</span>
                <span className="text-[11px] bg-amber-500/20 text-amber-300 border border-amber-400/60 px-3 py-0.5 rounded-full font-black font-mono shadow">
                  %{completionPercent} KEŞFEDİLDİ ({totalDiscovered}/{totalItems})
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                Balatro tarzı kilitli koleksiyon: Her kartın altında özel kilit açma şartı yazmaktadır.
              </p>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Ansiklopedide ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 rounded-2xl bg-slate-950 border-2 border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/80 w-36 sm:w-48 shadow-inner font-medium"
              />
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-slate-950 text-slate-400 hover:text-slate-100 border-2 border-slate-800 hover:border-amber-400/60 transition cursor-pointer active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Discovery Progress Bar */}
        <div className="w-full bg-slate-950 rounded-full h-3 mb-2.5 p-0.5 border-2 border-slate-800 overflow-hidden shrink-0 shadow-inner">
          <div
            className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 h-full rounded-full transition-all duration-700 shadow-[0_0_15px_rgba(245,158,11,0.7)]"
            style={{ width: `${completionPercent}%` }}
          />
        </div>

        {/* Category Tabs Bar */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2.5 my-1 shrink-0">
          {[
            { id: 'JOKERS', label: 'PASİF JOKER', icon: '🟣', count: `${discoveredJokerCount}/${jokerList.length}`, activeCls: 'bg-yellow-500/20 border-yellow-400 text-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.3)]' },
            { id: 'SPECIAL', label: 'ÖZEL TAŞLAR', icon: '🃏', count: `${discoveredSpecialCount}/${specialList.length}`, activeCls: 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.3)]' },
            { id: 'SEALS', label: 'MÜHÜRLER', icon: '🔴', count: `${discoveredSealCount}/${sealList.length}`, activeCls: 'bg-pink-500/20 border-pink-400 text-pink-300 shadow-[0_0_15px_rgba(244,114,182,0.3)]' },
            { id: 'RELICS', label: 'TILSIMLAR', icon: '🔮', count: `${discoveredRelicCount}/${relicList.length}`, activeCls: 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-[0_0_15px_rgba(192,132,252,0.3)]' },
            { id: 'BIOMES', label: 'BİYOMLAR', icon: '🏞️', count: `${discoveredBiomeCount}/${biomeList.length}`, activeCls: 'bg-teal-500/20 border-teal-400 text-teal-300 shadow-[0_0_15px_rgba(45,212,191,0.3)]' },
            { id: 'LETTERS', label: 'HARFLER', icon: '🔤', count: `${discoveredLetterCount}/${letterKeys.length}`, activeCls: 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className={`py-2 px-1.5 rounded-2xl border-2 text-[10px] sm:text-xs font-black transition flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer active:scale-95 ${
                tab === t.id ? t.activeCls : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span className="text-sm">{t.icon}</span>
              <span className="tracking-wider">{t.label}</span>
              <span className="text-[9px] sm:text-[10px] opacity-80 font-mono">({t.count})</span>
            </button>
          ))}
        </div>

        {/* Secondary Filter & Status Bar */}
        <div className="flex items-center justify-between gap-2 my-2 py-1 px-3 rounded-2xl bg-slate-950/90 border border-slate-800 shrink-0 flex-wrap text-xs font-bold text-slate-300">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-extrabold flex items-center gap-1">
              <Filter size={13} className="text-amber-400" />
              <span>Kilit Filtresi:</span>
            </span>
            <div className="flex items-center gap-1">
              {[
                { id: 'ALL', label: 'Tümü' },
                { id: 'UNLOCKED', label: '🔓 Açıklar' },
                { id: 'LOCKED', label: '🔒 Gizliler' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black transition cursor-pointer border ${
                    statusFilter === f.id
                      ? 'bg-amber-500 text-slate-950 border-yellow-200 shadow'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rarity Filter */}
          {(tab === 'JOKERS' || tab === 'SPECIAL') && (
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-extrabold hidden sm:inline">Nadirlik:</span>
              <div className="flex items-center gap-1">
                {[
                  { id: 'ALL', label: 'Tümü' },
                  { id: 'yaygin', label: 'Yaygın' },
                  { id: 'nadir', label: 'Nadir' },
                  { id: 'efsanevi', label: 'Efsanevi' },
                  { id: 'efsane_otesi', label: 'Spectral' }
                ].map(r => (
                  <button
                    key={r.id}
                    onClick={() => setRarityFilter(r.id)}
                    className={`px-2 py-0.5 rounded-lg text-[9px] font-black transition cursor-pointer border ${
                      rarityFilter === r.id
                        ? 'bg-cyan-500 text-slate-950 border-cyan-200 shadow'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto pr-1 my-1 scrollbar-thin">
          {/* JOKERS TAB */}
          {tab === 'JOKERS' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3.5 sm:gap-4">
              {jokerList.filter(joker => filterItem(joker, joker.id)).map((joker, index) => {
                const isUnlocked = isCodexItemDiscovered(joker.id);
                const rarityInfo = RARITY_LABELS[joker.rarity] || RARITY_LABELS.yaygin;

                if (!isUnlocked) {
                  return (
                    <div
                      key={joker.id}
                      className="p-3.5 rounded-3xl bg-slate-950/80 border-2 border-slate-800/90 flex items-start gap-3.5 opacity-75 shadow-inner relative overflow-hidden"
                    >
                      <div className="w-24 sm:w-28 h-36 sm:h-40 rounded-2xl border-2 border-slate-800 bg-slate-950 p-2 flex flex-col items-center justify-between shrink-0 relative">
                        <div className="w-full flex items-center justify-between opacity-40">
                          <span className="text-[10px] font-black text-slate-500 font-cinzel">J</span>
                          <span className="text-[8px] font-black text-slate-500">#{index + 1}</span>
                          <span className="text-[10px] font-black text-slate-500 font-cinzel">J</span>
                        </div>
                        <div className="my-auto flex flex-col items-center gap-1">
                          <div className="w-12 h-12 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
                            <Lock size={22} />
                          </div>
                          <span className="text-[10px] font-black text-slate-500 font-mono">🔒 ???</span>
                        </div>
                        <div className="w-full bg-amber-950/60 rounded-xl p-1 text-[8px] font-black text-amber-300 text-center uppercase tracking-wider">
                          KİLİTLİ JOKER
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 pt-0.5 flex flex-col justify-between h-full">
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1.5 border-b border-white/10 pb-1">
                            <span className="text-xs sm:text-sm font-black text-slate-400 font-cinzel">🔒 Pasif Joker #{index + 1}</span>
                            <span className="text-[9px] font-black text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-500/40">
                              KİLİTLİ
                            </span>
                          </div>

                          <div className="text-xs text-amber-200/90 font-medium leading-relaxed bg-slate-950 p-2.5 rounded-2xl border border-amber-500/30 shadow-inner">
                            <span className="text-amber-400 font-black block mb-0.5 text-[10px] uppercase tracking-wider flex items-center gap-1">
                              <Target size={11} />
                              <span>NASIL AÇILIR:</span>
                            </span>
                            <span>{getItemUnlockCondition(joker, 'JOKERS', index)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <motion.div
                    key={joker.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      try { soundEngine.playTap?.(); } catch(e) {}
                      setInspectedItem({ ...joker, itemCategory: 'PASİF JOKER' });
                    }}
                    className={`p-3.5 rounded-3xl bg-gradient-to-r ${joker.bgGradient || 'from-slate-900 to-slate-950'} border-2 border-amber-400/60 flex items-start gap-3.5 shadow-xl backdrop-blur-md relative overflow-hidden cursor-pointer group`}
                    style={{ boxShadow: `0 0 20px ${joker.glowColor || 'rgba(245,158,11,0.2)'}` }}
                  >
                    <div className="shrink-0">
                      <BalatroJokerCard joker={joker} showCost={false} showDesc={false} className="w-24 sm:w-28 h-36 sm:h-40 group-hover:scale-105 transition-transform" />
                    </div>

                    <div className="flex-1 min-w-0 pt-0.5 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center justify-between gap-2 flex-wrap mb-1.5 border-b border-white/10 pb-1.5">
                          <span className="text-sm sm:text-base font-black text-white font-cinzel tracking-wide group-hover:text-amber-300 transition">
                            {joker.name}
                          </span>
                          <span className={`px-2 py-0.5 rounded-lg border-2 text-[9px] font-black uppercase tracking-wider ${rarityInfo.cls}`}>
                            {rarityInfo.label}
                          </span>
                        </div>

                        <div className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed bg-black/40 p-2.5 rounded-2xl border border-white/10 shadow-inner">
                          {joker.desc}
                        </div>
                      </div>

                      {joker.flavorText && (
                        <div className="text-[10px] sm:text-[11px] text-amber-200/90 italic mt-2 leading-snug border-t border-white/10 pt-1 font-cinzel">
                          {joker.flavorText}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* SPECIAL HAND TILES TAB */}
          {tab === 'SPECIAL' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
              {specialList.filter(spec => filterItem(spec, spec.id)).map((spec, index) => {
                const isUnlocked = isCodexItemDiscovered(spec.id) || isCodexItemDiscovered(spec.name) || isCodexItemDiscovered(spec.letter);
                const rarityInfo = RARITY_LABELS[spec.rarity] || RARITY_LABELS.nadir;

                if (!isUnlocked) {
                  return (
                    <div
                      key={spec.id}
                      className="p-3.5 rounded-3xl bg-slate-950/80 border-2 border-slate-800/80 flex items-start gap-3.5 opacity-75 shadow-inner"
                    >
                      <div className="w-16 h-20 rounded-2xl bg-slate-900 border border-slate-700/80 flex flex-col items-center justify-center shrink-0">
                        <Lock size={20} className="text-amber-400 mb-1" />
                        <span className="text-[9px] font-black text-slate-500 font-mono">🔒 ???</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-black text-slate-400 mb-1 font-cinzel">🔒 Gizemli Özel Taş</div>
                        <div className="text-xs text-amber-200/90 font-medium leading-snug bg-slate-950 p-2 rounded-xl border border-amber-500/30">
                          <span className="text-amber-400 font-black block text-[9px] uppercase tracking-wider">🎯 NASIL AÇILIR:</span>
                          <span>{getItemUnlockCondition(spec, 'SPECIAL', index)}</span>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <motion.div
                    key={spec.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setInspectedItem({ ...spec, itemCategory: 'ÖZEL TAŞ' })}
                    className={`p-3.5 rounded-3xl bg-gradient-to-r ${spec.bgGradient || 'from-slate-900 to-slate-950'} border-2 border-cyan-400/60 flex items-start gap-3.5 shadow-xl backdrop-blur-md relative overflow-hidden cursor-pointer group`}
                  >
                    <div className="w-16 h-20 rounded-2xl bg-black/60 border-2 border-cyan-300/50 flex flex-col items-center justify-center shrink-0 shadow group-hover:scale-105 transition-transform">
                      <JokerCardIllustration cardId={spec.id} type="special" className="w-8 h-8 drop-shadow" />
                      <span className="text-sm font-black text-white font-cinzel mt-0.5">{spec.letter}</span>
                      {spec.points > 0 && <span className="text-[8px] font-black text-amber-300">+{spec.points}p</span>}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center justify-between gap-1 mb-1 border-b border-white/10 pb-1">
                        <span className="text-sm font-black text-white font-cinzel group-hover:text-cyan-300 transition">{spec.name}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${rarityInfo.cls}`}>
                          {rarityInfo.label}
                        </span>
                      </div>
                      <div className="text-xs text-slate-100 font-medium leading-relaxed bg-black/40 p-2 rounded-xl border border-white/10">
                        {spec.desc}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* SEALS TAB */}
          {tab === 'SEALS' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
              {sealList.filter(seal => filterItem(seal, seal.id)).map((seal, index) => {
                const isUnlocked = isCodexItemDiscovered(seal.id);

                if (!isUnlocked) {
                  return (
                    <div
                      key={seal.id}
                      className="p-3.5 rounded-3xl bg-slate-950/80 border-2 border-slate-800/80 flex items-start gap-3.5 opacity-75 shadow-inner"
                    >
                      <div className="w-14 h-16 rounded-2xl bg-slate-900 border border-slate-700/80 flex flex-col items-center justify-center shrink-0">
                        <Lock size={20} className="text-amber-400 mb-1" />
                        <span className="text-[9px] font-black text-slate-500 font-mono">🔒 ???</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-black text-slate-400 mb-1 font-cinzel">🔒 Gizemli Mühür</div>
                        <div className="text-xs text-amber-200/90 font-medium leading-snug bg-slate-950 p-2 rounded-xl border border-amber-500/30">
                          <span className="text-amber-400 font-black block text-[9px] uppercase tracking-wider">🎯 NASIL AÇILIR:</span>
                          <span>{getItemUnlockCondition(seal, 'SEALS', index)}</span>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <motion.div
                    key={seal.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setInspectedItem({ ...seal, itemCategory: 'MÜHÜR' })}
                    className={`p-3.5 rounded-3xl border-2 flex items-start gap-3.5 shadow-xl ${seal.badgeClass} backdrop-blur-md relative overflow-hidden cursor-pointer group`}
                  >
                    <div className="w-16 h-20 rounded-2xl bg-black/50 border border-white/20 flex flex-col items-center justify-center shrink-0 shadow p-1 group-hover:scale-105 transition-transform">
                      <span className="text-3xl drop-shadow">{seal.icon}</span>
                      <span className="text-[8px] font-black uppercase text-amber-300 tracking-wider mt-1">MÜHÜR</span>
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center justify-between gap-1 mb-1 border-b border-white/10 pb-1">
                        <span className="text-sm font-black tracking-wide font-cinzel">{seal.name}</span>
                        <span className="px-1.5 py-0.5 rounded bg-black/40 text-[9px] font-black uppercase border border-white/20">
                          {seal.id}
                        </span>
                      </div>
                      <div className="text-xs opacity-95 leading-relaxed bg-black/30 p-2 rounded-xl border border-white/10">
                        {seal.desc}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* RELICS TAB */}
          {tab === 'RELICS' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
              {relicList.filter(relic => filterItem(relic, relic.id)).map((relic, index) => {
                const isUnlocked = isCodexItemDiscovered(relic.id);

                if (!isUnlocked) {
                  return (
                    <div
                      key={relic.id}
                      className="p-3.5 rounded-3xl bg-slate-950/80 border-2 border-slate-800/80 flex items-start gap-3.5 opacity-75 shadow-inner"
                    >
                      <div className="w-14 h-16 rounded-2xl bg-slate-900 border border-slate-700/80 flex flex-col items-center justify-center shrink-0">
                        <Lock size={20} className="text-amber-400 mb-1" />
                        <span className="text-[9px] font-black text-slate-500 font-mono">🔒 ???</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-black text-slate-400 mb-1 font-cinzel">🔒 Gizemli Tılsım</div>
                        <div className="text-xs text-amber-200/90 font-medium leading-snug bg-slate-950 p-2 rounded-xl border border-amber-500/30">
                          <span className="text-amber-400 font-black block text-[9px] uppercase tracking-wider">🎯 NASIL AÇILIR:</span>
                          <span>{getItemUnlockCondition(relic, 'RELICS', index)}</span>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <motion.div
                    key={relic.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setInspectedItem({ ...relic, itemCategory: 'TILSIM' })}
                    className="p-3.5 rounded-3xl bg-slate-950/90 border-2 border-purple-500/60 flex items-start gap-3.5 shadow-xl backdrop-blur-md relative overflow-hidden cursor-pointer group"
                  >
                    <div className="w-16 h-20 rounded-2xl bg-purple-950/80 border border-purple-400/50 flex flex-col items-center justify-center shrink-0 shadow p-1 group-hover:scale-105 transition-transform">
                      <JokerCardIllustration cardId={relic.id} type="relic" className="w-9 h-9 drop-shadow-[0_0_10px_rgba(192,132,252,0.6)]" />
                      <span className="text-[8px] font-black uppercase text-purple-300 tracking-wider mt-1">TILSIM</span>
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center justify-between gap-1 mb-1 border-b border-purple-500/20 pb-1">
                        <span className="text-sm font-black text-purple-300 font-cinzel group-hover:text-purple-200 transition">{relic.name}</span>
                        <span className="px-1.5 py-0.5 rounded bg-purple-950 text-[8px] font-black text-purple-200 border border-purple-500/40 uppercase">
                          TILSIM
                        </span>
                      </div>
                      <div className="text-xs text-slate-200 font-medium leading-relaxed bg-black/40 p-2 rounded-xl border border-white/10">
                        {relic.desc}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* BIOMES TAB */}
          {tab === 'BIOMES' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
              {biomeList.filter(b => filterItem(b, b.id)).map((b, index) => {
                const isUnlocked = isCodexItemDiscovered(b.id);

                if (!isUnlocked) {
                  return (
                    <div
                      key={b.id}
                      className="p-3.5 rounded-3xl bg-slate-950/80 border-2 border-slate-800/80 flex items-start gap-3.5 opacity-75 shadow-inner"
                    >
                      <div className="w-14 h-16 rounded-2xl bg-slate-900 border border-slate-700/80 flex flex-col items-center justify-center shrink-0">
                        <Lock size={20} className="text-amber-400 mb-1" />
                        <span className="text-[9px] font-black text-slate-500 font-mono">🔒 ???</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-black text-slate-400 mb-1 font-cinzel">🔒 Keşfedilmemiş Biyom</div>
                        <div className="text-xs text-amber-200/90 font-medium leading-snug bg-slate-950 p-2 rounded-xl border border-amber-500/30">
                          <span className="text-amber-400 font-black block text-[9px] uppercase tracking-wider">🎯 NASIL AÇILIR:</span>
                          <span>{getItemUnlockCondition(b, 'BIOMES', index)}</span>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <motion.div
                    key={b.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setInspectedItem({ ...b, itemCategory: 'BİYOM' })}
                    className={`p-3.5 rounded-3xl bg-slate-950/90 border-2 ${b.borderColor} flex items-start gap-3.5 shadow-xl backdrop-blur-md relative overflow-hidden cursor-pointer group`}
                  >
                    <div className="w-16 h-20 rounded-2xl bg-slate-900 border border-slate-700 flex flex-col items-center justify-center shrink-0 shadow p-1 group-hover:scale-105 transition-transform">
                      <span className="text-3xl drop-shadow">{b.icon}</span>
                      <span className="text-[8px] font-black uppercase text-teal-300 tracking-wider mt-1">BİYOM</span>
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center justify-between gap-1 mb-1 border-b border-white/10 pb-1">
                        <span className={`text-sm font-black font-cinzel ${b.accentColor}`}>{b.name}</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-900 text-[8px] font-black text-slate-300 border border-slate-700 uppercase">
                          BÖLGE
                        </span>
                      </div>
                      <div className="text-xs text-slate-200 font-extrabold leading-relaxed bg-black/40 p-2 rounded-xl border border-white/10">
                        <span className="text-amber-300 font-black">{b.modifier.name}: </span>
                        <span>{b.modifier.desc}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* LETTERS TAB */}
          {tab === 'LETTERS' && (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2.5 sm:gap-3.5">
              {letterKeys.filter(letter => filterItem({ name: letter }, letter)).map((letter, index) => {
                const info = LETTER_DEFINITIONS[letter];
                const isUnlocked = isCodexItemDiscovered(letter);

                if (!isUnlocked) {
                  return (
                    <div
                      key={letter}
                      className="p-3 sm:p-4 rounded-2xl bg-slate-950/50 border-2 border-slate-800/80 flex flex-col items-center justify-center text-center opacity-40 shadow-inner"
                      title={getItemUnlockCondition({ name: letter }, 'LETTERS', index)}
                    >
                      <Lock size={16} className="text-amber-400 mb-1" />
                      <span className="text-[10px] font-black text-slate-500 font-mono">🔒 ???</span>
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
        </div>

        {/* Footer */}
        <div className="pt-3 border-t-2 border-slate-800 shrink-0 flex items-center justify-between gap-3">
          <span className="text-xs font-bold text-slate-400 hidden sm:inline">
            💡 Kilitli kartların üzerinde özel kilit açma şartı yazmaktadır.
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-8 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black py-3 sm:py-3.5 rounded-2xl text-xs sm:text-sm transition cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.4)] tracking-wider active:scale-95 ml-auto"
          >
            KAPAT
          </button>
        </div>

        {/* ── CARD DETAIL INSPECTOR OVERLAY MODAL ── */}
        <AnimatePresence>
          {inspectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInspectedItem(null)}
              className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none"
            >
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 border-2 border-amber-400 rounded-3xl p-6 shadow-[0_0_50px_rgba(245,158,11,0.4)] relative flex flex-col items-center gap-4 text-center"
              >
                <button
                  onClick={() => setInspectedItem(null)}
                  className="absolute right-4 top-4 p-2 rounded-full bg-slate-950 text-slate-400 hover:text-slate-100 border border-slate-800 cursor-pointer"
                >
                  <X size={18} />
                </button>

                {/* Inspect Card Banner */}
                <span className="text-[10px] font-black text-amber-300 bg-amber-950/90 border border-amber-400/60 px-3 py-1 rounded-full uppercase tracking-widest font-mono">
                  {inspectedItem.itemCategory || 'KART İNCELEME'}
                </span>

                {/* Large Card Illustration */}
                {inspectedItem.itemCategory === 'PASİF JOKER' ? (
                  <BalatroJokerCard joker={inspectedItem} showCost={false} showDesc={true} className="w-36 h-52 scale-110 my-2" />
                ) : (
                  <div className="w-24 h-28 rounded-3xl bg-black/60 border-2 border-amber-400 flex flex-col items-center justify-center p-3 shadow-2xl my-2">
                    <JokerCardIllustration cardId={inspectedItem.id} type="special" className="w-12 h-12 drop-shadow" />
                    <span className="text-base font-black text-white font-cinzel mt-1">{inspectedItem.name || inspectedItem.letter}</span>
                  </div>
                )}

                {/* Card Title & Desc */}
                <div>
                  <h3 className="text-xl font-black text-amber-300 font-cinzel mb-1">{inspectedItem.name}</h3>
                  <div className="text-xs text-slate-100 font-medium leading-relaxed bg-black/50 p-3 rounded-2xl border border-white/10 shadow-inner">
                    {inspectedItem.desc || inspectedItem.modifier?.desc}
                  </div>
                </div>

                {/* Flavor Lore Quote */}
                {inspectedItem.flavorText && (
                  <div className="text-xs text-amber-200/90 italic font-cinzel border-t border-white/10 pt-2">
                    {inspectedItem.flavorText}
                  </div>
                )}

                <button
                  onClick={() => setInspectedItem(null)}
                  className="w-full bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl text-xs tracking-wider cursor-pointer active:scale-95 shadow-md mt-2"
                >
                  TAMAM
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

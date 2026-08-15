/**
 * Spectral (Kutsal / Karanlık Mistik) Pack & Ritual Card Definitions for Kelime Destesi
 * High Risk / High Reward Dark Alchemy Transformation Cards
 */

export const SPECTRAL_CARDS = [
  {
    id: 'SPECTRAL_DARK_RITUAL',
    name: '🔮 Karanlık Ritüel',
    icon: '🔮',
    cost: 40,
    desc: 'Destedeki 3 harfe 🔴 Kırmızı Mühür (2x Tetiklenme) basar, ancak 10 Altın harcar!',
    effectType: 'ADD_RED_SEAL_3',
    bgGradient: 'from-purple-900 via-indigo-950 to-slate-950 border-purple-500/80 text-purple-200'
  },
  {
    id: 'SPECTRAL_ALCHEMY',
    name: '🧪 Simya Dönüşümü',
    icon: '🧪',
    cost: 45,
    desc: 'Destedeki 2 harfi 🌈 Polikrom (x1.5 Çarpan) yapar, ancak 1 harfi tamamen yok eder!',
    effectType: 'POLYCHROME_2_REMOVE_1',
    bgGradient: 'from-pink-900 via-purple-950 to-slate-950 border-pink-500/80 text-pink-200'
  },
  {
    id: 'SPECTRAL_SOUL',
    name: '🌌 Ruh Bağı (Efsanevi)',
    icon: '🌌',
    cost: 60,
    desc: 'Destedeki 1 harfi 🌀 Efsanevi Vorteks Jokeri harfine dönüştürür!',
    effectType: 'TRANSFORM_VORTEX_JOKER',
    bgGradient: 'from-amber-900 via-purple-950 to-cyan-950 border-amber-400/80 text-amber-200'
  },
  {
    id: 'SPECTRAL_MIRROR',
    name: '🪞 Büyülü Ayna',
    icon: '🪞',
    cost: 50,
    desc: 'Sahip olunan rastgele 1 Pasif Jokeri kopyalar!',
    effectType: 'DUPLICATE_RANDOM_RELIC',
    bgGradient: 'from-cyan-900 via-blue-950 to-slate-950 border-cyan-400/80 text-cyan-200'
  },
  {
    id: 'SPECTRAL_FREEZE_ALL',
    name: '❄️ Çığ Ritüeli',
    icon: '❄️',
    cost: 35,
    desc: 'Destedeki 4 harfe ❄️ Buz Mühürü (Korumalı Harf) basar.',
    effectType: 'ADD_FREEZE_SEAL_4',
    bgGradient: 'from-sky-900 via-cyan-950 to-slate-950 border-sky-400/80 text-sky-200'
  }
];

export const SPECTRAL_PACKS = [
  {
    id: 'PACK_SPECTRAL_NORMAL',
    name: '🔮 Mistik Ritüel Paketi',
    icon: '🔮',
    cost: 35,
    cardsCount: 3,
    chooseCount: 1,
    desc: 'Yüksek riskli mistik ritüel kartları içerir.',
    badgeClass: 'from-purple-900 via-indigo-950 to-slate-950 border-purple-500 text-purple-300'
  },
  {
    id: 'PACK_SPECTRAL_JUMBO',
    name: '🌌 Dev Mistik Ritüel Paketi',
    icon: '🌌',
    cost: 60,
    cardsCount: 5,
    chooseCount: 2,
    desc: 'Dev Mistik Ritüel Paketi: 5 mistik ritüelden 2 tanesini seç!',
    badgeClass: 'from-pink-900 via-purple-950 to-cyan-950 border-pink-400 text-pink-300'
  }
];

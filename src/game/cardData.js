// Card data, perks, and starter deck variants for Kelime Destesi

export const LETTER_DEFINITIONS = {
  // Normal Letters (1-3 pt)
  A: { points: 1, rarity: 'normal', desc: 'Sık kullanılan sesli harf' },
  E: { points: 1, rarity: 'normal', desc: 'Sık kullanılan sesli harf' },
  İ: { points: 1, rarity: 'normal', desc: 'Sık kullanılan sesli harf' },
  I: { points: 2, rarity: 'normal', desc: 'Türkçe sesli harf' },
  K: { points: 3, rarity: 'normal', desc: 'Kelime kurucu sessiz harf' },
  L: { points: 2, rarity: 'normal', desc: 'Yaygın sessiz harf' },
  M: { points: 2, rarity: 'normal', desc: 'Yaygın sessiz harf' },
  N: { points: 2, rarity: 'normal', desc: 'Yaygın sessiz harf' },
  R: { points: 2, rarity: 'normal', desc: 'Yaygın sessiz harf' },
  S: { points: 2, rarity: 'normal', desc: 'Yaygın sessiz harf' },
  T: { points: 2, rarity: 'normal', desc: 'Yaygın sessiz harf' },

  // Nadir Letters (3-8 pt)
  B: { points: 3, rarity: 'nadir', desc: 'Güçlü sessiz harf' },
  C: { points: 4, rarity: 'nadir', desc: 'Değerli sessiz harf' },
  D: { points: 3, rarity: 'nadir', desc: 'Güçlü sessiz harf' },
  O: { points: 2, rarity: 'nadir', desc: 'Yuvarlak sesli harf' },
  U: { points: 2, rarity: 'nadir', desc: 'Yuvarlak sesli harf' },
  Y: { points: 3, rarity: 'nadir', desc: 'Kaynaştırma harfi' },
  Ş: { points: 5, rarity: 'nadir', desc: 'Türkçe özel harf' },
  Ğ: { points: 8, rarity: 'nadir', desc: 'Yüksek puanlı yumuşak g' },
  Ç: { points: 5, rarity: 'nadir', desc: 'Türkçe özel harf' },
  Ö: { points: 4, rarity: 'nadir', desc: 'Noktalı sesli harf' },
  Ü: { points: 3, rarity: 'nadir', desc: 'Noktalı sesli harf' },

  // Çok Nadir Letters (5-10 pt)
  F: { points: 6, rarity: 'cok_nadir', desc: 'Sert sessiz harf' },
  G: { points: 5, rarity: 'cok_nadir', desc: 'Değerli sessiz harf' },
  H: { points: 5, rarity: 'cok_nadir', desc: 'Değerli sessiz harf' },
  J: { points: 10, rarity: 'cok_nadir', desc: 'Efsanevi +10 Puan Harfi' },
  P: { points: 5, rarity: 'cok_nadir', desc: 'Sert sessiz harf' },
  V: { points: 7, rarity: 'cok_nadir', desc: 'Nadir yüksek puanlı harf' },
  Z: { points: 10, rarity: 'cok_nadir', desc: 'Efsanevi +10 Puan Harfi' },
};

export const SPECIAL_CARDS = {
  JOKER: {
    id: 'SPECIAL_JOKER',
    letter: '★',
    name: 'Joker Harf',
    points: 0,
    type: 'joker',
    cost: 45,
    rarity: 'nadir',
    desc: 'İstediğin herhangi bir harfin yerine geçer.',
    bgGradient: 'from-amber-500 via-purple-600 to-pink-500'
  },
  DOUBLE: {
    id: 'SPECIAL_DOUBLE',
    letter: '2x',
    name: 'Çift Puan',
    points: 0,
    type: 'double',
    cost: 50,
    rarity: 'nadir',
    desc: 'Kelimenin toplam puanını 2 ile çarpar.',
    bgGradient: 'from-blue-600 to-indigo-800'
  },
  DELETE: {
    id: 'SPECIAL_DELETE',
    letter: '🗑️',
    name: 'Sil Kartı',
    points: 0,
    type: 'delete',
    cost: 25,
    rarity: 'normal',
    desc: 'Eldeki istemediğin bir harfi yok eder ve yeni harf çeker.',
    bgGradient: 'from-red-600 to-rose-900'
  },
  REFRESH: {
    id: 'SPECIAL_REFRESH',
    letter: '🔄',
    name: 'Yenile',
    points: 0,
    type: 'refresh',
    cost: 30,
    rarity: 'normal',
    desc: 'Eldeki tüm harfleri desteye karıştırıp yeniden çeker.',
    bgGradient: 'from-emerald-600 to-teal-800'
  }
};

export const STARTER_DECKS = [
  {
    id: 'starter_basit',
    name: 'Başlangıç Destesi',
    desc: 'Temel Türkçe harflerden oluşan 10 kartlık dengeli deste.',
    icon: '🃏',
    unlocked: true,
    letters: ['A', 'A', 'E', 'İ', 'K', 'L', 'R', 'S', 'T', 'N']
  },
  {
    id: 'starter_uzun',
    name: 'Uzun Kelime Destesi',
    desc: 'Büyük ve kompozit kelimeler oluşturmak için geniş harf havuzu.',
    icon: '📜',
    unlocked: false,
    unlockCost: 40,
    letters: ['A', 'E', 'İ', 'K', 'L', 'M', 'N', 'R', 'S', 'T', 'O']
  },
  {
    id: 'starter_nadir',
    name: 'Nadir Harfler Destesi',
    desc: 'Ş, Ğ, Ç, Z gibi yüksek puanlı ama riskli Türkçe harfler içerir.',
    icon: '💎',
    unlocked: false,
    unlockCost: 80,
    letters: ['A', 'E', 'İ', 'K', 'L', 'R', 'Ş', 'Ç', 'Ğ', 'Z', 'JOKER']
  },
  {
    id: 'starter_combo',
    name: 'Seri Kombo Destesi',
    desc: 'Arka arkaya hızlı ve kısa kelimelerle yüksek kombo yapma destesi.',
    icon: '⚡',
    unlocked: false,
    unlockCost: 120,
    letters: ['A', 'A', 'E', 'E', 'İ', 'K', 'R', 'S', 'T', 'DOUBLE']
  }
];

let nextCardId = 1;

/**
 * Perks descriptions per upgrade tier:
 * Tier 0 (K): Base points
 * Tier 1 (K+): +2 Base Points
 * Tier 2 (K++): +2 Base Points & +3 bonus points if word length >= 4
 * Tier 3 (K+++): +4 Base Points & +1 Combo boost on play!
 */
export function getPerkDescription(upgradeLevel) {
  if (upgradeLevel === 1) return '+2 Puan';
  if (upgradeLevel === 2) return '+4 Puan (+3 Bonus if 4+ letters)';
  if (upgradeLevel >= 3) return '+6 Puan (+1 Kombo Artışı)';
  return 'Temel Harf';
}

export function createCard(letterOrSpecialKey, upgradeLevel = 0) {
  if (SPECIAL_CARDS[letterOrSpecialKey]) {
    const spec = SPECIAL_CARDS[letterOrSpecialKey];
    return {
      id: `card_${nextCardId++}_${Date.now()}`,
      letter: spec.letter,
      isSpecial: true,
      specialType: spec.type,
      name: spec.name,
      points: 0,
      upgradeLevel: 0,
      rarity: spec.rarity,
      desc: spec.desc,
      bgGradient: spec.bgGradient
    };
  }

  const upper = letterOrSpecialKey.toUpperCase();
  const def = LETTER_DEFINITIONS[upper] || { points: 1, rarity: 'normal', desc: 'Harf' };

  // Calculate points by tier
  const basePoints = def.points;
  const currentPoints = basePoints + upgradeLevel * 2;

  return {
    id: `card_${nextCardId++}_${Date.now()}`,
    letter: upper,
    isSpecial: false,
    specialType: null,
    points: currentPoints,
    basePoints: basePoints,
    upgradeLevel: upgradeLevel,
    rarity: def.rarity,
    desc: def.desc
  };
}

export function createDeckFromLetterList(letterList) {
  return letterList.map(item => createCard(item));
}

export function getRarityDetails(rarity) {
  switch (rarity) {
    case 'cok_nadir':
      return { label: 'Çok Nadir', color: 'border-amber-400 bg-amber-950/80 text-amber-300 shadow-amber-500/30' };
    case 'nadir':
      return { label: 'Nadir', color: 'border-purple-400 bg-purple-950/80 text-purple-300 shadow-purple-500/30' };
    default:
      return { label: 'Normal', color: 'border-slate-600 bg-slate-800/80 text-slate-200' };
  }
}

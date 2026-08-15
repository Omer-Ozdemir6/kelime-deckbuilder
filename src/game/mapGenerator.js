/**
 * Balatro-style Kademe (Ante) & Blind Generator for Kelime Destesi
 * Each Kademe consists of:
 * 1. Küçük Mücadele (Small Blind) - Can be played or skipped for a Tag reward
 * 2. Büyük Mücadele (Big Blind) - Can be played or skipped for a Tag reward
 * 3. Boss Mücadelesi (Boss Blind) - Unskippable, active Boss Rule constraint
 * 4. Dükkân (Shop) - After defeating Boss
 */

export const REGIONAL_BIOMES = [
  {
    colIndex: 0,
    id: 'BIOME_FROZEN',
    name: '❄️ Buzul Krallığı',
    icon: '❄️',
    themeClass: 'from-[#081e2b] via-slate-950 to-slate-950',
    accentColor: 'text-sky-400',
    borderColor: 'border-sky-500/50',
    glowColor: 'rgba(56, 189, 248, 0.2)',
    modifier: { id: 'FROZEN_ZONE', name: 'Buzlu Yuva', icon: '🧊', desc: 'Efsunlu harflere +15 bonus puan!' }
  },
  {
    colIndex: 1,
    id: 'BIOME_FOREST',
    name: '🌲 Zümrüt Ormanı',
    icon: '🌲',
    themeClass: 'from-[#06201b] via-slate-950 to-slate-950',
    accentColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/50',
    glowColor: 'rgba(16, 185, 129, 0.2)',
    modifier: { id: 'FOREST_ZONE', name: 'Bol Hazine', icon: '💎', desc: 'Tüm mücadeleler +10 Altın kazandırır!' }
  },
  {
    colIndex: 2,
    id: 'BIOME_VOLCANO',
    name: '🔥 Alevli Vadi',
    icon: '🌋',
    themeClass: 'from-[#260e06] via-slate-950 to-slate-950',
    accentColor: 'text-orange-400',
    borderColor: 'border-orange-500/50',
    glowColor: 'rgba(249, 115, 22, 0.2)',
    modifier: { id: 'FIRE_ZONE', name: 'Ateşli Kombo', icon: '🔥', desc: 'Kombo kazanımı 2 kat hızlıdır!' }
  },
  {
    colIndex: 3,
    id: 'BIOME_SHADOW',
    name: '🎭 Mor Gölge Bölgesi',
    icon: '🎭',
    themeClass: 'from-[#1c082b] via-slate-950 to-slate-950',
    accentColor: 'text-purple-400',
    borderColor: 'border-purple-500/50',
    glowColor: 'rgba(168, 85, 247, 0.2)',
    modifier: { id: 'SHADOW_ZONE', name: 'Gölge Aynası', icon: '🪞', desc: 'Tekrar harfli kelimelere +%40 bonus!' }
  },
  {
    colIndex: 4,
    id: 'BIOME_COSMIC',
    name: '🌌 Kozmik Zirve',
    icon: '🌟',
    themeClass: 'from-[#261f06] via-slate-950 to-slate-950',
    accentColor: 'text-yellow-400',
    borderColor: 'border-yellow-500/50',
    glowColor: 'rgba(234, 179, 8, 0.25)',
    modifier: { id: 'COSMIC_ZONE', name: 'Kozmik Mühür', icon: '🌟', desc: 'Nadir harflerin puanları 2x katlanır!' }
  }
];

export const FINAL_BOSS_BIOME = {
  colIndex: 99,
  id: 'BIOME_FINAL',
  name: '👑 Kadim Mahzen (Final Boss Realm)',
  icon: '👑',
  themeClass: 'from-[#3b0712] via-slate-950 to-slate-950',
  accentColor: 'text-rose-400',
  borderColor: 'border-rose-500/80',
  glowColor: 'rgba(244, 63, 94, 0.3)',
  modifier: { id: 'FINAL_ZONE', name: '👑 Kadim Baskı', icon: '👑', desc: 'Final Boss Realm! Hedef skor %25 ekstra yüksektir.' }
};

export const TAG_DEFINITIONS = [
  {
    id: 'TAG_REDRAW',
    name: 'Ekstra Yenileme',
    icon: '🔄',
    badgeClass: 'bg-cyan-950 border-cyan-500 text-cyan-300',
    desc: 'Sonraki mücadelelerde +2 el yenileme hakkı ekler.',
    effect: { type: 'ADD_DISCARDS', amount: 2 }
  },
  {
    id: 'TAG_GOLD',
    name: 'Altın Yağmuru',
    icon: '💰',
    badgeClass: 'bg-amber-950 border-amber-500 text-amber-300',
    desc: 'Anında +25 Altın kazandırır.',
    effect: { type: 'ADD_GOLD', amount: 25 }
  },
  {
    id: 'TAG_RARE_CARD',
    name: 'Nadir Mühür',
    icon: '🌟',
    badgeClass: 'bg-yellow-950 border-yellow-500 text-yellow-300',
    desc: 'Sonraki kart ödülünde garantili nadir harf verir.',
    effect: { type: 'RARE_CARD_GUARANTEE' }
  },
  {
    id: 'TAG_SHOP_DISCOUNT',
    name: 'Çarşı İndirimi',
    icon: '🏷️',
    badgeClass: 'bg-emerald-950 border-emerald-500 text-emerald-300',
    desc: 'Sonraki Dükkânda tüm ürünlerde %25 indirim sağlar.',
    effect: { type: 'SHOP_DISCOUNT', percent: 25 }
  },
  {
    id: 'TAG_EFSUN',
    name: 'Bedava Efsun',
    icon: '📘',
    badgeClass: 'bg-purple-950 border-purple-500 text-purple-300',
    desc: 'Rastgele 1 Kelime Tipi seviyesini bedava yükseltir.',
    effect: { type: 'FREE_EFSUN_UPGRADE' }
  },
  {
    id: 'TAG_RELIC',
    name: 'Hazine Emaneti',
    icon: '🏺',
    badgeClass: 'bg-rose-950 border-rose-500 text-rose-300',
    desc: 'Anında rastgele 1 Emanet kazandırır.',
    effect: { type: 'GRANT_RANDOM_RELIC' }
  },
  {
    id: 'TAG_JOKER',
    name: 'Joker Harfi',
    icon: '🃏',
    badgeClass: 'bg-indigo-950 border-indigo-500 text-indigo-300',
    desc: 'Desteğe 1 adet 🃏 Joker Harfi ekler.',
    effect: { type: 'ADD_JOKER_CARD' }
  }
];

// Easy Warmup Bosses for Kademes 1 & 2
export const EASY_BOSS_RULES = [
  { id: 'BOSS_MIN_LEN_4', title: '📜 Söz Ustası (Min 4 Harf)', desc: '4 harften kısa kelimeler kabul edilmez!', minWordLength: 4 },
  { id: 'BOSS_WATER', title: '🌊 Su Mühürü (Pahalı Iskarta)', desc: 'Iskarta (Yenileme) yapmak $2 Altın harcar!', minWordLength: 3, discardCost: 2 },
  { id: 'BOSS_TOOTH', title: '🦷 Diş Mühürü (Kelime Başı $1)', desc: 'Oynanan her kelime $1 Altın harcar!', minWordLength: 3, costPerWord: 1 },
  { id: 'BOSS_SERPENT', title: '🐍 Yılan Mühürü (Çekim Kısıtı)', desc: 'Tur başında elinize sadece 3 yeni harf çekilir!', minWordLength: 3, drawLimit: 3 },
  { id: 'BOSS_AMULET', title: '🔮 Tılsım Mühürü (Kombo Sıfırlama)', desc: 'Her tur başında Kombo Çarpanınız x1\'e sıfırlanır!', minWordLength: 3 }
];

// Medium Tier Bosses for Kademes 3, 4 & 5
export const MEDIUM_BOSS_RULES = [
  { id: 'BOSS_FLINT', title: '🔥 Çakmak Mühürü (Yarı Puan)', desc: 'Tüm kelimelerin taban puanı yarı yarıya düşer!', minWordLength: 3, halfChips: true },
  { id: 'BOSS_EYE', title: '👁️ Göz Mühürü (Uzunluk Tekrarı Yok)', desc: 'Aynı harf uzunluğunda kelime 2 kez üst üste oynanamaz!', minWordLength: 3, noSameLengthRepeat: true },
  { id: 'BOSS_ARM', title: '🦾 Karakalem (Rozetler İptal)', desc: 'Harflerin yükseltme seviyeleri (+1, +2, +3) devre dışı kalır!', minWordLength: 3, disableCardUpgrades: true },
  { id: 'BOSS_PLANT', title: '🌿 Sarmaşık (Sesliler Sessiz)', desc: 'Sesli harfler puan ve çarpan vermez!', minWordLength: 3, silentVowels: true }
];

// Hard Tier Bosses for Kademes 6 & 7
export const HARD_BOSS_RULES = [
  { id: 'BOSS_MIN_LEN_5', title: '🗿 Kadim Mühür (Min 5 Harf)', desc: 'En az 5 harfli kelimeler oynanmalı!', minWordLength: 5 },
  { id: 'BOSS_OX', title: '🐂 Öküz Mühürü (Riskli Harf)', desc: 'İçinde "E" veya "A" geçen kelime oynanırsa Altınınız 0 olur!', minWordLength: 3, zeroGoldLetter: 'E' },
  { id: 'BOSS_NEEDLE', title: '🗡️ İğne Mühürü (Tek Hamle)', desc: 'Sadece 1 kelime oynama hakkınız vardır!', minWordLength: 3, maxHands: 1 },
  { id: 'BOSS_MARK', title: '🎭 Maske Mühürü (Gizli Harfler)', desc: 'Elinizdeki bazı harfler kapalı/gizli çekilir!', minWordLength: 3, faceDownCards: true },
  { id: 'BOSS_PILLAR', title: '🏛️ Sütun Mühürü (Geçmiş Kartlar)', desc: 'Daha önce bu kademede oynanmış kartlar puan kazandırmaz!', minWordLength: 3 }
];

// Final Boss Rule for Kademe 8+
export const FINAL_BOSS_RULE = { id: 'BOSS_FINAL', title: '👑 Kadim Kelime Mimarı (Final Boss)', desc: 'Final Boss! En az 5 harfli kelimeler kabul edilir!', minWordLength: 5 };

export const KADEME_BOSS_RULES = [
  ...EASY_BOSS_RULES,
  ...MEDIUM_BOSS_RULES,
  ...HARD_BOSS_RULES,
  FINAL_BOSS_RULE
];

export function generateKademe(kademeNumber = 1, prevBiomeId = null) {
  const baseScale = Math.pow(1.85, kademeNumber - 1);
  const smallTarget = Math.round(75 * baseScale);
  const bigTarget = Math.round(140 * baseScale);
  const bossTarget = Math.round(250 * baseScale);

  // Pick 2 random unique tags
  const shuffledTags = [...TAG_DEFINITIONS].sort(() => 0.5 - Math.random());
  const smallTag = shuffledTags[0];
  const bigTag = shuffledTags[1];

  // Pick Boss Blind rule matched to Kademe difficulty tier
  let bossPool = EASY_BOSS_RULES;
  if (kademeNumber >= 8) {
    bossPool = [FINAL_BOSS_RULE];
  } else if (kademeNumber >= 6) {
    bossPool = HARD_BOSS_RULES;
  } else if (kademeNumber >= 3) {
    bossPool = MEDIUM_BOSS_RULES;
  } else {
    bossPool = EASY_BOSS_RULES;
  }

  const bossRuleDef = bossPool[Math.floor(Math.random() * bossPool.length)];

  // Procedurally roll surprise stop:
  // 35% Event, 25% Trivia, 20% Challenge, 10% Treasure, 10% None
  const roll = Math.random() * 100;
  let surpriseType = 'NONE';
  if (roll < 35) surpriseType = 'EVENT';
  else if (roll < 60) surpriseType = 'TRIVIA';
  else if (roll < 80) surpriseType = 'CHALLENGE';
  else if (roll < 90) surpriseType = 'TREASURE';

  const blinds = [
    {
      id: `k${kademeNumber}_b0`,
      index: 0,
      type: 'SMALL_BLIND',
      title: 'Küçük Mücadele',
      icon: '📜',
      targetScore: smallTarget,
      rewardGold: 3 + Math.floor(kademeNumber / 2),
      tag: smallTag,
      canSkip: true,
      status: 'ACTIVE'
    }
  ];

  let nextIdx = 1;

  if (surpriseType === 'EVENT') {
    blinds.push({
      id: `k${kademeNumber}_e`,
      index: nextIdx++,
      type: 'EVENT',
      title: 'Gizemli Olay',
      icon: '❓',
      targetScore: smallTarget,
      desc: 'Terk edilmiş bir harf masası veya kadim bir yazıt buldun. Karar ver!',
      canSkip: false,
      status: 'LOCKED'
    });
  } else if (surpriseType === 'TRIVIA') {
    blinds.push({
      id: `k${kademeNumber}_t`,
      index: nextIdx++,
      type: 'TRIVIA',
      title: 'Kelime Bilmecesi',
      icon: '💡',
      targetScore: smallTarget,
      desc: 'Bir bilge sana kelime bilmecesi sordu. Çöz ve ödülü kap!',
      canSkip: false,
      status: 'LOCKED'
    });
  } else if (surpriseType === 'CHALLENGE') {
    blinds.push({
      id: `k${kademeNumber}_ch`,
      index: nextIdx++,
      type: 'CHALLENGE',
      title: '⚡ Süreli Harf Challenge',
      icon: '⚡',
      targetScore: smallTarget,
      desc: '30 saniye boyunca kilitli kare bulmacalarını hızlıca doldur ve dev ödülü kap!',
      canSkip: false,
      status: 'LOCKED'
    });
  } else if (surpriseType === 'TREASURE') {
    blinds.push({
      id: `k${kademeNumber}_tr`,
      index: nextIdx++,
      type: 'TREASURE',
      title: 'Kilitli Hazine',
      icon: '💰',
      targetScore: smallTarget,
      desc: 'Çalıların arasına saklanmış kilitli bir sandık buldun!',
      canSkip: false,
      status: 'LOCKED'
    });
  }

  // Big Blind
  blinds.push({
    id: `k${kademeNumber}_b1`,
    index: nextIdx++,
    type: 'BIG_BLIND',
    title: 'Büyük Mücadele',
    icon: '⚔️',
    targetScore: bigTarget,
    rewardGold: 4 + Math.floor(kademeNumber / 2),
    tag: bigTag,
    canSkip: true,
    status: 'LOCKED'
  });

  // Boss Blind
  blinds.push({
    id: `k${kademeNumber}_b2`,
    index: nextIdx++,
    type: 'BOSS_BLIND',
    title: `Boss: ${bossRuleDef.title}`,
    icon: '👑',
    targetScore: bossTarget,
    rewardGold: 5 + Math.floor(kademeNumber / 2),
    bossRule: { ...bossRuleDef, title: `👑 ${bossRuleDef.title}`, desc: `${bossRuleDef.desc} (Hedef: ${bossTarget} Puan)` },
    maxHandsOverride: 7,
    canSkip: false,
    status: 'LOCKED'
  });

  // Assign Biome: Kademe 8+ is the fixed FINAL BOSS BIOME (Kadim Mahzen)!
  // Kademes 1-7 pick procedurally random biomes each run.
  let biome;
  if (kademeNumber >= 8) {
    biome = FINAL_BOSS_BIOME;
  } else {
    const targetPrevId = (typeof prevBiomeId !== 'undefined' && prevBiomeId) ? prevBiomeId : null;
    const available = REGIONAL_BIOMES.filter(b => b && b.id !== targetPrevId);
    const pool = available.length > 0 ? available : REGIONAL_BIOMES;
    biome = pool[Math.floor(Math.random() * pool.length)];
  }

  return {
    kademeNumber,
    biome,
    blinds
  };
}

// Backward compatibility alias for generateRunMap
export function generateRunMap() {
  return [generateKademe(1)];
}


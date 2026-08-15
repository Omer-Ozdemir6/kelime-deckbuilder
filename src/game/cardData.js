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

export const SEAL_DEFINITIONS = {
  FOIL: {
    id: 'FOIL',
    name: '🪙 Altın Yaldız',
    icon: '🪙',
    bonusChips: 30,
    bonusMult: 0,
    desc: 'Oynandığında +30 Taban Puan ekler.',
    badgeClass: 'border-amber-400 bg-amber-950/90 text-amber-300 shadow-amber-500/50'
  },
  HOLOGRAPHIC: {
    id: 'HOLOGRAPHIC',
    name: '🔮 Holografik Mühür',
    icon: '🔮',
    bonusChips: 0,
    bonusMult: 15,
    desc: 'Oynandığında +15 Çarpan ekler.',
    badgeClass: 'border-purple-400 bg-purple-950/90 text-purple-300 shadow-purple-500/50'
  },
  POLYCHROME: {
    id: 'POLYCHROME',
    name: '🌈 Polikrom Mühür',
    icon: '🌈',
    bonusChips: 0,
    bonusMult: 0,
    isPolychrome: true,
    desc: 'Kelimenin toplam puanını 1.5x ile çarpar.',
    badgeClass: 'border-pink-400 bg-pink-950/90 text-pink-300 shadow-pink-500/50 animate-pulse'
  },
  RED_SEAL: {
    id: 'RED_SEAL',
    name: '🔴 Kırmızı Mühür',
    icon: '🔴',
    isRedSeal: true,
    desc: 'Bu harf kelime skoru hesaplanırken 2 KEZ TETİKLENİR!',
    badgeClass: 'border-rose-500 bg-rose-950/90 text-rose-300 shadow-rose-500/50 ring-1 ring-rose-400'
  },
  EMERALD_SEAL: {
    id: 'EMERALD_SEAL',
    name: '💚 Zümrüt Mühür',
    icon: '💚',
    bonusGold: 4,
    desc: 'Oynandığında anında +4 Ekstra Altın kazandırır.',
    badgeClass: 'border-emerald-400 bg-emerald-950/90 text-emerald-300 shadow-emerald-500/50'
  },
  LIGHTNING_SEAL: {
    id: 'LIGHTNING_SEAL',
    name: '⚡ Yıldırım Mühürü',
    icon: '⚡',
    bonusCombo: 2,
    desc: 'Oynandığında kombo seviyesini anında +2 arttırır.',
    badgeClass: 'border-yellow-400 bg-yellow-950/90 text-yellow-300 shadow-yellow-500/50'
  },
  FREEZE_SEAL: {
    id: 'FREEZE_SEAL',
    name: '❄️ Buz Mühürü',
    icon: '❄️',
    isFreeze: true,
    desc: 'Korumalı Harf: Tur bittiğinde harf elden kaybolmaz.',
    badgeClass: 'border-cyan-400 bg-cyan-950/90 text-cyan-300 shadow-cyan-500/50'
  },
  GLASS: {
    id: 'GLASS',
    name: '🥃 Cam Mühür',
    icon: '🥃',
    isGlass: true,
    bonusMultX: 2.0,
    desc: 'Oynandığında x2.0 Çarpan verir, ancak %25 ihtimalle kırılıp desteden silinir!',
    badgeClass: 'border-cyan-300 bg-cyan-950/90 text-cyan-200 shadow-cyan-400/50'
  },
  STEEL: {
    id: 'STEEL',
    name: '🛡️ Çelik Mühür',
    icon: '🛡️',
    isSteel: true,
    desc: 'Elde tutulduğu sürece kelimenize x1.5 Çarpan kazandırır!',
    badgeClass: 'border-slate-400 bg-slate-900/90 text-slate-200 shadow-slate-400/50'
  },
  STONE: {
    id: 'STONE',
    name: '🗿 Taş Mühür',
    icon: '🗿',
    isStone: true,
    bonusChips: 50,
    desc: 'Harfsiz Taş: Oynandığında veya elde tutulduğunda +50 Taban Puan ekler.',
    badgeClass: 'border-stone-400 bg-stone-900/90 text-stone-300 shadow-stone-400/50'
  },
  BLUE_SEAL: {
    id: 'BLUE_SEAL',
    name: '🔵 Mavi Mühür',
    icon: '🔵',
    isBlueSeal: true,
    desc: 'Tur sonunda elde tutulursa rastgele 1 Gezegen Taş Seviye Yükseltmesi verir!',
    badgeClass: 'border-cyan-400 bg-cyan-950/90 text-cyan-200 shadow-cyan-400/50'
  },
  PURPLE_SEAL: {
    id: 'PURPLE_SEAL',
    name: '🟣 Mor Mühür',
    icon: '🟣',
    isPurpleSeal: true,
    desc: 'Iskarta yapıldığında anında rastgele 1 Efsun Taş kazandırır!',
    badgeClass: 'border-purple-400 bg-purple-950/90 text-purple-200 shadow-purple-400/50'
  }
};

// ─────────────────────────────────────────────────────────────
// STAKE DIFFICULTIES (Zorluk Mühürleri - Balatro Stakes)
// ─────────────────────────────────────────────────────────────
export const STAKES = [
  {
    id: 'WHITE_STAKE',
    name: '⚪ Beyaz Mühür (Normal)',
    icon: '⚪',
    color: 'text-slate-200 border-slate-400',
    desc: 'Standart oyun zorluğu.'
  },
  {
    id: 'RED_STAKE',
    name: '🔴 Kırmızı Mühür',
    icon: '🔴',
    color: 'text-rose-400 border-rose-500',
    desc: 'Artan ıskartalar tur sonunda ekstra altın kazandırmaz.'
  },
  {
    id: 'GREEN_STAKE',
    name: '🟢 Yeşil Mühür',
    icon: '🟢',
    color: 'text-emerald-400 border-emerald-500',
    desc: 'Kademe hedef skorları %25 daha hızlı yükselir.'
  },
  {
    id: 'BLUE_STAKE',
    name: '🔵 Mavi Mühür',
    icon: '🔵',
    color: 'text-cyan-400 border-cyan-500',
    desc: 'Her aşamada -1 Iskarta hakkınız olur.'
  },
  {
    id: 'BLACK_STAKE',
    name: '⚫ Siyah Mühür',
    icon: '⚫',
    color: 'text-purple-400 border-purple-500',
    desc: 'Dükkandaki ürün fiyatları %20 daha pahalıdır.'
  },
  {
    id: 'PURPLE_STAKE',
    name: '🟣 Mor Mühür',
    icon: '🟣',
    color: 'text-indigo-400 border-indigo-500',
    desc: 'Skor hedefleri %50 daha hızlı artar.'
  },
  {
    id: 'ORANGE_STAKE',
    name: '🟠 Turuncu Mühür',
    icon: '🟠',
    color: 'text-amber-400 border-amber-500',
    desc: 'Dükkandaki jokerler daha yüksek maliyetlidir.'
  },
  {
    id: 'GOLD_STAKE',
    name: '👑 Altın Mühür (Efsanevi)',
    icon: '👑',
    color: 'text-yellow-300 border-yellow-400',
    desc: 'En zorlu Balatro meydan okuması!'
  }
];

// ─────────────────────────────────────────────────────────────
// SPECIAL HAND CARDS (Joker / Double / Delete / Refresh)
// ─────────────────────────────────────────────────────────────
export const SPECIAL_CARDS = {
  JOKER: {
    id: 'SPECIAL_JOKER',
    letter: '🃏',
    name: 'Joker Harf',
    points: 0,
    type: 'joker',
    cost: 45,
    rarity: 'nadir',
    desc: 'Kelimeyi tamamlayan en uygun harfe dönüşür.',
    bgGradient: 'from-amber-500 via-purple-600 to-pink-500'
  },
  HOLY_JOKER: {
    id: 'SPECIAL_HOLY_JOKER',
    letter: '🌟',
    name: 'Kutsal Joker',
    points: 50,
    type: 'joker',
    cost: 65,
    rarity: 'cok_nadir',
    desc: 'Joker harfe dönüşür ve +50 Ekstra Puan ekler.',
    bgGradient: 'from-yellow-400 via-amber-500 to-yellow-600'
  },
  LIGHTNING_JOKER: {
    id: 'SPECIAL_LIGHTNING_JOKER',
    letter: '⚡',
    name: 'Yıldırım Jokeri',
    points: 0,
    type: 'double',
    cost: 70,
    rarity: 'cok_nadir',
    desc: 'Kelimedeki sesli harf sayısınca puanı çarpar.',
    bgGradient: 'from-amber-400 via-yellow-500 to-orange-600'
  },
  RAINBOW_JOKER: {
    id: 'SPECIAL_RAINBOW_JOKER',
    letter: '🌈',
    name: 'Gökkuşağı Jokeri',
    points: 0,
    type: 'joker',
    seal: 'POLYCHROME',
    cost: 80,
    rarity: 'cok_nadir',
    desc: 'Kelimeye Polikrom 1.5x Çarpan basarak Joker görevi görür.',
    bgGradient: 'from-pink-500 via-purple-500 to-cyan-500'
  },
  MIDAS_JOKER: {
    id: 'SPECIAL_MIDAS_JOKER',
    letter: '💎',
    name: 'Midas Jokeri',
    points: 25,
    type: 'joker',
    cost: 75,
    rarity: 'cok_nadir',
    desc: 'Her tur sonu destedeki 1 harfi Altın Yaldıza çevirir ve +25 Altın verir.',
    bgGradient: 'from-yellow-500 via-amber-600 to-yellow-800'
  },
  SHADOW_JOKER: {
    id: 'SPECIAL_SHADOW_JOKER',
    letter: '🎭',
    name: 'Gölge Jokeri',
    points: 30,
    type: 'joker',
    cost: 85,
    rarity: 'cok_nadir',
    desc: 'Desteden silinen her harf için kelimeye +10 Çarpan ekler!',
    bgGradient: 'from-purple-900 via-slate-900 to-black'
  },
  WARRIOR_JOKER: {
    id: 'SPECIAL_WARRIOR_JOKER',
    letter: '🗡️',
    name: 'Savaşçı Jokeri',
    points: 40,
    type: 'joker',
    cost: 90,
    rarity: 'cok_nadir',
    desc: '4+ Harfli kelimelerde kelimenin toplam skorunu 2X katlar!',
    bgGradient: 'from-red-600 via-rose-700 to-slate-900'
  },
  ORACLE_JOKER: {
    id: 'SPECIAL_ORACLE_JOKER',
    letter: '🔮',
    name: 'Kahin Jokeri',
    points: 35,
    type: 'joker',
    cost: 95,
    rarity: 'cok_nadir',
    desc: 'İstediğin harfe dönüşür ve +40 Ekstra Taban Puan kazandırır.',
    bgGradient: 'from-cyan-500 via-indigo-600 to-purple-700'
  },
  FIRE_JOKER: {
    id: 'SPECIAL_FIRE_JOKER',
    letter: '🔥',
    name: 'Alev Jokeri',
    points: 30,
    type: 'joker',
    cost: 75,
    rarity: 'cok_nadir',
    desc: 'İstediğin harfe dönüşür ve kombo seviyesini anında +2 arttırır!',
    bgGradient: 'from-orange-600 via-red-600 to-amber-500'
  },
  FROST_JOKER: {
    id: 'SPECIAL_FROST_JOKER',
    letter: '❄️',
    name: 'Buz Jokeri',
    points: 20,
    type: 'joker',
    seal: 'FREEZE_SEAL',
    cost: 70,
    rarity: 'nadir',
    desc: 'İstediğin harfe dönüşür. Tur sonunda elden kaybolmaz (Buz Mühürlü Joker).',
    bgGradient: 'from-cyan-600 via-blue-700 to-slate-900'
  },
  FOIL_JOKER: {
    id: 'SPECIAL_FOIL_JOKER',
    letter: '🪙',
    name: 'Altın Yaldız Jokeri',
    points: 30,
    type: 'joker',
    seal: 'FOIL',
    cost: 80,
    rarity: 'cok_nadir',
    desc: 'İstediğin harfe dönüşür ve kelimeye +30 Taban Puan ekler.',
    bgGradient: 'from-amber-400 via-yellow-500 to-amber-700'
  },
  CROWN_JOKER: {
    id: 'SPECIAL_CROWN_JOKER',
    letter: '👑',
    name: 'Kral Jokeri',
    points: 50,
    type: 'joker',
    seal: 'CROWN_SEAL',
    cost: 100,
    rarity: 'cok_nadir',
    desc: 'İstediğin harfe dönüşür. 5+ harfli kelimelerde +50 Puan ve +20 Çarpan katar!',
    bgGradient: 'from-yellow-400 via-amber-500 to-purple-800'
  },
  MIRACLE_JOKER: {
    id: 'SPECIAL_MIRACLE_JOKER',
    letter: '✨',
    name: 'Mucize Jokeri',
    points: 100,
    type: 'joker',
    cost: 120,
    rarity: 'cok_nadir',
    desc: 'İstediğin harfe dönüşür ve kelimeye +100 Efsanevi Taban Puan ekler!',
    bgGradient: 'from-purple-400 via-pink-500 to-amber-400'
  },
  POISON_JOKER: {
    id: 'SPECIAL_POISON_JOKER',
    letter: '☣️',
    name: 'Zehir Jokeri',
    points: 35,
    type: 'joker',
    cost: 85,
    rarity: 'cok_nadir',
    desc: 'İstediğin harfe dönüşür ve Boss barajını %25 zehirleyerek düşürür!',
    bgGradient: 'from-emerald-600 via-teal-700 to-slate-950'
  },
  COSMIC_JOKER: {
    id: 'SPECIAL_COSMIC_JOKER',
    letter: '🌠',
    name: 'Kozmik Joker Taş',
    points: 40,
    type: 'joker',
    seal: 'POLYCHROME',
    cost: 95,
    rarity: 'cok_nadir',
    desc: 'İstediğin harfe dönüşür ve Polikrom 2.0x Skor Çarpanı uygular!',
    bgGradient: 'from-indigo-600 via-purple-700 to-pink-600'
  },
  INFINITY_JOKER: {
    id: 'SPECIAL_INFINITY_JOKER',
    letter: '♾️',
    name: 'Sonsuzluk Jokeri',
    points: 50,
    type: 'joker',
    seal: 'RED_SEAL',
    cost: 110,
    rarity: 'cok_nadir',
    desc: 'İstediğin harfe dönüşür ve 2 KEZ TETİKLENEREK çift puan hesaplar!',
    bgGradient: 'from-cyan-500 via-blue-600 to-purple-800'
  },
  MAGNETIC_JOKER: {
    id: 'SPECIAL_MAGNETIC_JOKER',
    letter: '🧲',
    name: 'Mıknatıs Jokeri',
    points: 25,
    type: 'joker',
    cost: 80,
    rarity: 'nadir',
    desc: 'İstediğin harfe dönüşür ve oynandığında Harf Bankasına +1 Joker Taş ekler!',
    bgGradient: 'from-red-600 via-slate-800 to-blue-800'
  },
  SUPERCHARGE_JOKER: {
    id: 'SPECIAL_SUPERCHARGE_JOKER',
    letter: '⚡',
    name: 'Aşırı Yükleme Taş',
    points: 40,
    type: 'joker',
    seal: 'HOLOGRAPHIC',
    cost: 90,
    rarity: 'cok_nadir',
    desc: 'İstediğin harfe dönüşür ve kelimenin tüm harflerine +15 Çarpan basar!',
    bgGradient: 'from-yellow-400 via-amber-500 to-orange-600'
  },
  TRANSMUTE_JOKER: {
    id: 'SPECIAL_TRANSMUTE_JOKER',
    letter: '🧪',
    name: 'Simya Taş',
    points: 30,
    type: 'joker',
    cost: 85,
    rarity: 'nadir',
    desc: 'İstediğin harfe dönüşür ve elindeki tüm harf taşlarını +2 Seviye Yükseltir!',
    bgGradient: 'from-emerald-500 via-teal-600 to-amber-600'
  },
  VORTEX_JOKER: {
    id: 'SPECIAL_VORTEX_JOKER',
    letter: '🌀',
    name: 'Girdap Taş',
    points: 35,
    type: 'joker',
    seal: 'POLYCHROME',
    cost: 95,
    rarity: 'cok_nadir',
    desc: 'İstediğin harfe dönüşür ve Polikrom 1.5x Çarpan uygular!',
    bgGradient: 'from-violet-600 via-purple-700 to-cyan-500'
  },
  SHIELD_JOKER: {
    id: 'SPECIAL_SHIELD_JOKER',
    letter: '🛡️',
    name: 'Kalkan Taş',
    points: 50,
    type: 'joker',
    seal: 'FREEZE_SEAL',
    cost: 75,
    rarity: 'nadir',
    desc: 'İstediğin harfe dönüşür ve tur sonunda elden kaybolmaz (Buz Mühürlü).',
    bgGradient: 'from-blue-600 via-cyan-700 to-slate-900'
  },
  SCROLL_JOKER: {
    id: 'SPECIAL_SCROLL_JOKER',
    letter: '📜',
    name: 'Kadim Parşömen',
    points: 60,
    type: 'joker',
    cost: 85,
    rarity: 'nadir',
    desc: 'İstediğin harfe dönüşür ve kelimeye +60 Taban Puan ekler!',
    bgGradient: 'from-amber-600 via-yellow-700 to-amber-950'
  },
  TARGET_JOKER: {
    id: 'SPECIAL_TARGET_JOKER',
    letter: '🎯',
    name: 'Keskin Nişancı Taş',
    points: 45,
    type: 'joker',
    seal: 'FOIL',
    cost: 80,
    rarity: 'nadir',
    desc: 'İstediğin harfe dönüşür ve +30 Altın Yaldız Taban Puan katar.',
    bgGradient: 'from-rose-600 via-red-700 to-amber-500'
  },
  SOUL_GEM_JOKER: {
    id: 'SPECIAL_SOUL_GEM_JOKER',
    letter: '💎',
    name: 'Ruh Taşı',
    points: 75,
    type: 'joker',
    seal: 'CROWN_SEAL',
    cost: 115,
    rarity: 'cok_nadir',
    desc: 'İstediğin harfe dönüşür, +75 Taban Puan ve Kral Mührü +20 Çarpan verir!',
    bgGradient: 'from-cyan-400 via-blue-500 to-purple-800'
  },
  TIME_GEM_JOKER: {
    id: 'SPECIAL_TIME_GEM_JOKER',
    letter: '⏳',
    name: 'Zaman Kum Saati',
    points: 30,
    type: 'joker',
    seal: 'LIGHTNING_SEAL',
    cost: 70,
    rarity: 'nadir',
    desc: 'İstediğin harfe dönüşür ve Kombo Seviyesini anında +2 arttırır!',
    bgGradient: 'from-amber-500 via-yellow-600 to-slate-900'
  },
  NOVA_JOKER: {
    id: 'SPECIAL_NOVA_JOKER',
    letter: '💥',
    name: 'Süpernova Taş',
    points: 80,
    type: 'joker',
    seal: 'POLYCHROME',
    cost: 125,
    rarity: 'cok_nadir',
    desc: 'İstediğin harfe dönüşür ve devasa Polikrom 2.5x Çarpan uygular!',
    bgGradient: 'from-pink-500 via-rose-600 to-yellow-500'
  },
  SOVEREIGN_JOKER: {
    id: 'SPECIAL_SOVEREIGN_JOKER',
    letter: '👑',
    name: 'Hükümdar Taşı',
    points: 90,
    type: 'joker',
    seal: 'CROWN_SEAL',
    cost: 130,
    rarity: 'cok_nadir',
    desc: 'İstediğin harfe dönüşür, +90 Puan ve Kral Mührü katar!',
    bgGradient: 'from-yellow-400 via-amber-500 to-purple-900'
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
    bgGradient: 'from-rose-600 to-slate-800'
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
  },
  MIRROR: {
    id: 'SPECIAL_MIRROR',
    letter: '🪞',
    name: 'Ayna Harfi',
    points: 0,
    type: 'mirror',
    cost: 40,
    rarity: 'nadir',
    desc: 'Solundaki harfin değerini ve kendisini kopyalar.',
    bgGradient: 'from-slate-700 via-cyan-800 to-slate-900'
  },
  GOLDEN: {
    id: 'SPECIAL_GOLDEN',
    letter: '💰',
    name: 'Altın Harf',
    points: 10,
    type: 'golden',
    cost: 45,
    rarity: 'nadir',
    desc: 'Oynandığında anında +4 Ekstra Altın kazandırır.',
    bgGradient: 'from-yellow-400 via-amber-500 to-yellow-600'
  },
  ASH: {
    id: 'SPECIAL_ASH',
    letter: '🔥',
    name: 'Kül Harfi',
    points: 25,
    type: 'ash',
    cost: 35,
    rarity: 'nadir',
    desc: 'Tek kullanımlık: +25 Puan verir fakat oynandıktan sonra desteden yok olur.',
    bgGradient: 'from-orange-600 via-red-700 to-slate-900'
  },
  CHAIN_TILE: {
    id: 'SPECIAL_CHAIN_TILE',
    letter: '🔗',
    name: 'Zincir Harfi',
    points: 5,
    type: 'chain_tile',
    cost: 40,
    rarity: 'nadir',
    desc: 'Kelime zincirlerinde oynanırsa +%30 Çarpan ekler.',
    bgGradient: 'from-amber-600 via-orange-600 to-amber-800'
  }
};

// ─────────────────────────────────────────────────────────────
// PASSIVE JOKERS — Balatro tarzı pasif etkili güçlendiriciler
// rarity: 'yaygin' | 'nadir' | 'efsanevi' | 'efsane_otesi'
// maxPerRun: Bir koşuda bu jokerden maksimum kaç tane olabilir (varsayılan: 1)
// ─────────────────────────────────────────────────────────────

// Tur başına maksimum aktif joker sayısı (Balatro tarzı)
export const MAX_ACTIVE_JOKERS = 5;
export const JOKER_MAX_PER_RUN = 1;

export const PASSIVE_JOKERS = {

  // ══════════════════════════════════════════
  // 👑 EFSANEVİ JOKERLER (5 adet) — Legendary (Ruh Kartı / Spectral)
  // ══════════════════════════════════════════

  LEGENDARY_CHICOT: {
    id: 'LEGENDARY_CHICOT', icon: '🤡', name: 'Chicot (Boss Engelci)',
    rarity: 'efsane_otesi', cost: 150, maxPerRun: 1, isLegendary: true,
    effect: { type: 'disable_boss_rules' },
    desc: 'Oyundaki TÜM Boss Kurallarını ve kısıtlamalarını tamamen etkisiz hale getirir!',
    bgGradient: 'from-purple-900 via-rose-950 to-black', glowColor: 'rgba(168,85,247,0.8)',
    artEmoji: '🤡✨👑',
    flavorText: '"Kralın palyaçosu kural tanımaz!" — Kadim Balatro Efsanesi'
  },
  LEGENDARY_PERKEO: {
    id: 'LEGENDARY_PERKEO', icon: '🧙‍♂️', name: 'Perkeo (Kopya Üreteci)',
    rarity: 'efsane_otesi', cost: 150, maxPerRun: 1, isLegendary: true,
    effect: { type: 'duplicate_consumable' },
    desc: 'Her Çarşı çıkışında dükkandaki 1 Gezegen/Tayf eşyasının Negatif kopyasını üretir.',
    bgGradient: 'from-blue-900 via-indigo-950 to-black', glowColor: 'rgba(96,165,250,0.8)',
    artEmoji: '🧙‍♂️🔮📜',
    flavorText: '"Çoğaltmak büyücülerin işidir."'
  },
  LEGENDARY_YORICK: {
    id: 'LEGENDARY_YORICK', icon: '💀', name: 'Yorick (Iskarta Usta)',
    rarity: 'efsane_otesi', cost: 150, maxPerRun: 1, isLegendary: true,
    effect: { type: 'discards_to_xmult', per: 20, value: 1.0 },
    desc: 'Yapılan her 20 ıskartada kelimelere +x1.0 Çarpan ekler (Sürekli birikir!).',
    bgGradient: 'from-amber-900 via-yellow-950 to-black', glowColor: 'rgba(251,191,36,0.8)',
    artEmoji: '💀🔄📜',
    flavorText: '"Ah, zavallı Yorick!"'
  },
  LEGENDARY_CANIO: {
    id: 'LEGENDARY_CANIO', icon: '🩸', name: 'Canio (Harf Yakıcı)',
    rarity: 'efsane_otesi', cost: 150, maxPerRun: 1, isLegendary: true,
    effect: { type: 'destroy_card_xmult', value: 1.0 },
    desc: 'Desteden silinen/kırılan her harf için kelimenize +x1.0 Çarpan ekler.',
    bgGradient: 'from-rose-900 via-red-950 to-black', glowColor: 'rgba(244,63,94,0.8)',
    artEmoji: '🩸🔥🎴',
    flavorText: '"Yok oluş güç doğurur."'
  },
  JOKER_GRAND_POET: {
    id: 'JOKER_GRAND_POET', icon: '📜', name: 'Dev Ozan Jokeri',
    rarity: 'efsanevi', cost: 110, maxPerRun: 1,
    effect: { type: 'long_word_dragon_mult', minLen: 6, mult: 2.0, chips: 50 },
    desc: '🟡 Uzun Kelime Build: 6+ Harfli kelimelerde x2.0 Mult katar ve +50 Taban Puan ekler!',
    bgGradient: 'from-amber-600 via-yellow-700 to-amber-950', glowColor: 'rgba(245,158,11,0.8)',
    artEmoji: '📜👑✒️',
    flavorText: '"Uzun kelimeler şairlerin tacıdır."'
  },
  JOKER_EMERALD_CROWN: {
    id: 'JOKER_EMERALD_CROWN', icon: '👑', name: 'Zümrüt Tacı Jokeri',
    rarity: 'efsanevi', cost: 115, maxPerRun: 1,
    effect: { type: 'rare_letter_xmult', value: 1.5 },
    desc: '🔵 Nadir Harf Build: Kelimedeki her nadir harf (J, Z, Ğ, Ç, Ö, Ü, Ş) için x1.5 Mult çarpar!',
    bgGradient: 'from-emerald-600 via-teal-700 to-emerald-950', glowColor: 'rgba(16,185,129,0.8)',
    artEmoji: '👑💎✨',
    flavorText: '"Nadir harfler zümrüt gibi parlar."'
  },
  JOKER_CHAIN_MASTER: {
    id: 'JOKER_CHAIN_MASTER', icon: '🔗', name: 'Zincir Üstadı Jokeri',
    rarity: 'nadir', cost: 95, maxPerRun: 1,
    effect: { type: 'chain_master_xmult', mult: 2.5, gold: 5 },
    desc: '🟣 Zincir Build: Kelime uzatıldığında veya dönüştürüldüğünde x2.5 Mult ve +$5 Altın katar!',
    bgGradient: 'from-purple-600 via-indigo-700 to-purple-950', glowColor: 'rgba(168,85,247,0.8)',
    artEmoji: '🔗⚡💰',
    flavorText: '"Halkalar birbirine bağlandıkça zafer yakınlaşır."'
  },
  JOKER_SWIFT_SCRIBE: {
    id: 'JOKER_SWIFT_SCRIBE', icon: '⚡', name: 'Hızlı Katip Jokeri',
    rarity: 'nadir', cost: 80, maxPerRun: 1,
    effect: { type: 'short_word_combo_boost', maxLen: 4, combo: 2, chips: 30 },
    desc: '🟢 Hızlı Kombo Build: 3-4 Harfli kelimeler oynandığında kombo seviyesini +2 artırır ve +30 Puan katar!',
    bgGradient: 'from-cyan-600 via-sky-700 to-slate-950', glowColor: 'rgba(56,189,248,0.8)',
    artEmoji: '⚡📝🏃',
    flavorText: '"Hızlı yazan, rakiplerini geride bırakır."'
  },
  LEGENDARY_TRIBOULET: {
    id: 'LEGENDARY_TRIBOULET', icon: '👑', name: 'Triboulet (Nadir Harf Kralı)',
    rarity: 'efsane_otesi', cost: 150, maxPerRun: 1, isLegendary: true,
    effect: { type: 'rare_letter_xmult', value: 2.0 },
    desc: 'Kelimenizdeki her nadir harf (J, Z, Ğ, Ç, Ö, Ü, Ş) için x2.0 Çarpan çarpar!',
    bgGradient: 'from-yellow-500 via-amber-600 to-purple-950', glowColor: 'rgba(234,179,8,0.9)',
    artEmoji: '👑🏆✨',
    flavorText: '"Sadece en nadir harfler krallara yakışır."'
  },

  // ══════════════════════════════════════════
  // 🟩 YAYGIN JOKERLER (15 adet) — Common
  // ══════════════════════════════════════════

  SCRIBE_JOKER: {
    id: 'SCRIBE_JOKER', icon: '📝', name: 'Katip Jokeri',
    rarity: 'yaygin', cost: 35, maxPerRun: 1,
    effect: { type: 'per_word_chips', value: 4 },
    desc: 'Her başarılı kelimede +4 Taban Puan biriktirir.',
    bgGradient: 'from-slate-700 to-slate-900', glowColor: 'rgba(148,163,184,0.4)',
    artEmoji: '📝✍️📜',
    flavorText: '"Kalem kılıçtan güçlüdür." — Eski bir Katip Atasözü'
  },
  VOWEL_JOKER: {
    id: 'VOWEL_JOKER', icon: '🗣️', name: 'Sesli Harf Jokeri',
    rarity: 'yaygin', cost: 40, maxPerRun: 1,
    effect: { type: 'per_vowel_chips', value: 3 },
    desc: 'Kelimedeki her sesli harf için +3 Taban Puan ekler.',
    bgGradient: 'from-sky-800 to-blue-950', glowColor: 'rgba(56,189,248,0.4)',
    artEmoji: '🗣️🎵🔊',
    flavorText: '"A, E, İ, O, U... Sesin özü burada." — Dilbilim Ustası'
  },
  CONSONANT_JOKER: {
    id: 'CONSONANT_JOKER', icon: '🔤', name: 'Ünsüz Jokeri',
    rarity: 'yaygin', cost: 40, maxPerRun: 1,
    effect: { type: 'per_consonant_mult', value: 2 },
    desc: 'Kelimedeki her ünsüz harf için +2 Çarpan ekler.',
    bgGradient: 'from-teal-800 to-teal-950', glowColor: 'rgba(45,212,191,0.4)',
    artEmoji: '🔤💪🔡',
    flavorText: '"Sessizler konuşmayı mümkün kılar." — Fonetik Çıraklık Kitabı'
  },
  MERCHANT_JOKER: {
    id: 'MERCHANT_JOKER', icon: '💼', name: 'Tüccar Jokeri',
    rarity: 'yaygin', cost: 50, maxPerRun: 1,
    effect: { type: 'shop_gold_bonus', value: 10 },
    desc: 'Her Çarşı ziyaretinde +10 Altın ile başlarsın.',
    bgGradient: 'from-amber-800 to-amber-950', glowColor: 'rgba(245,158,11,0.4)',
    artEmoji: '💼🪙🛒',
    flavorText: '"En iyi yatırım, iyi bir dükkân arkadaşıdır." — Tüccar Mahfili'
  },
  PIGGY_JOKER: {
    id: 'PIGGY_JOKER', icon: '🐷', name: 'Kumbara Jokeri',
    rarity: 'yaygin', cost: 45, maxPerRun: 1,
    effect: { type: 'gold_to_chips', per: 5, value: 1 },
    desc: 'Tur sonu harcamadığın her 5 Altın için +1 Taban Puan birikir.',
    bgGradient: 'from-pink-800 to-rose-950', glowColor: 'rgba(244,114,182,0.4)',
    artEmoji: '🐷💰🏦',
    flavorText: '"Biriktirmek de bir sanattır." — Kumbara Filozofu'
  },
  SHORTCUT_JOKER: {
    id: 'SHORTCUT_JOKER', icon: '⚡', name: 'Kestirme Jokeri',
    rarity: 'yaygin', cost: 35, maxPerRun: 1,
    effect: { type: 'short_word_chips', maxLen: 3, value: 20 },
    desc: '3 harfli kelimeler +20 Taban Puan kazanır.',
    bgGradient: 'from-yellow-700 to-orange-900', glowColor: 'rgba(251,191,36,0.4)',
    artEmoji: '⚡🏃💨',
    flavorText: '"En kısa yol, en keskin yoldur." — Yıldırım Hızı Kılavuzu'
  },
  ECHO_JOKER: {
    id: 'ECHO_JOKER', icon: '🔁', name: 'Yankı Jokeri',
    rarity: 'yaygin', cost: 40, maxPerRun: 1,
    effect: { type: 'repeat_word_bonus_pct', value: 50 },
    desc: 'Aynı kelimeyi tekrar oynayınca +50% bonus puan.',
    bgGradient: 'from-violet-800 to-purple-950', glowColor: 'rgba(167,139,250,0.4)',
    artEmoji: '🔁🎵🌀',
    flavorText: '"Yankı, en güçlü cevaptır." — Dağ Mağarası Felsefesi'
  },
  LUCKY_CAT_JOKER: {
    id: 'LUCKY_CAT_JOKER', icon: '🍀', name: 'Şans Kedisi',
    rarity: 'yaygin', cost: 45, maxPerRun: 1,
    effect: { type: 'lucky_gold_chance', chance: 20, value: 25 },
    desc: 'Her kelimede %20 şansla +25 Altın düşer.',
    bgGradient: 'from-emerald-700 to-green-950', glowColor: 'rgba(52,211,153,0.4)',
    artEmoji: '🍀🐱🎰',
    flavorText: '"Şans, hazırlıklı zihnin önüne geçer." — Bahtsız Bir Kedinin Anısı'
  },
  LIBRARY_JOKER: {
    id: 'LIBRARY_JOKER', icon: '📚', name: 'Kütüphane',
    rarity: 'yaygin', cost: 50, maxPerRun: 1,
    effect: { type: 'hand_size_plus', value: 1, max: 3 },
    desc: 'Her tur başlangıcında el boyutun +1 artar (maks +3).',
    bgGradient: 'from-indigo-800 to-indigo-950', glowColor: 'rgba(99,102,241,0.4)',
    artEmoji: '📚🏛️📖',
    flavorText: '"Daha fazla harf, daha fazla güç." — Büyük Kütüphane Tüzüğü'
  },
  STEEL_JOKER: {
    id: 'STEEL_JOKER', icon: '🔩', name: 'Çelik Joker',
    rarity: 'yaygin', cost: 40, maxPerRun: 1,
    effect: { type: 'deck_size_chips', per: 1, value: 1 },
    desc: 'Deste boyutu ne kadar büyükse kart başına +1 Taban Puan.',
    bgGradient: 'from-slate-600 to-slate-900', glowColor: 'rgba(100,116,139,0.5)',
    artEmoji: '🔩⚙️🛡️',
    flavorText: '"Çelik eğilir ama kırılmaz." — Demirci Destesi'
  },
  RUNNER_JOKER: {
    id: 'RUNNER_JOKER', icon: '🏃', name: 'Koşucu Jokeri',
    rarity: 'yaygin', cost: 45, maxPerRun: 1,
    effect: { type: 'word_restores_discard', max: 3 },
    desc: 'Başarılı her kelime Atma Hakkını +1 yeniler (maks 3).',
    bgGradient: 'from-orange-700 to-red-900', glowColor: 'rgba(251,146,60,0.4)',
    artEmoji: '🏃💨🏅',
    flavorText: '"Durmak yok, yola devam!" — Sonsuz Koşucu Manifestosu'
  },
  HOARDER_JOKER: {
    id: 'HOARDER_JOKER', icon: '🏠', name: 'İstifçi Jokeri',
    rarity: 'yaygin', cost: 35, maxPerRun: 1,
    effect: { type: 'undeleted_card_chips', per: 1, value: 1 },
    desc: 'Silmediğin her harf kartı +1 Taban Puan bonusu taşır.',
    bgGradient: 'from-stone-700 to-stone-950', glowColor: 'rgba(168,162,158,0.4)',
    artEmoji: '🏠📦🗄️',
    flavorText: '"Bir gün lazım olur." — Tarihin Her Devrinde Söylenen Söz'
  },
  GAMBLER_JOKER: {
    id: 'GAMBLER_JOKER', icon: '🎲', name: 'Kumarbaz',
    rarity: 'yaygin', cost: 40, maxPerRun: 1,
    effect: { type: 'discard_gamble_chips', chance: 50, value: 30 },
    desc: 'Atma yaptığında %50 şansla +30 Taban Puan kazanırsın.',
    bgGradient: 'from-rose-700 to-rose-950', glowColor: 'rgba(251,113,133,0.4)',
    artEmoji: '🎲🎰🃏',
    flavorText: '"Ya hep ya hiç." — Kumarbazın Felsefesi'
  },
  TWIN_STARS_JOKER: {
    id: 'TWIN_STARS_JOKER', icon: '⭐', name: 'İkiz Yıldız',
    rarity: 'yaygin', cost: 50, maxPerRun: 1,
    effect: { type: 'two_rare_letters_mult', value: 1.3 },
    desc: 'İki farklı nadir harf kullananınca o tur puanı 1.3x olur.',
    bgGradient: 'from-amber-600 to-yellow-900', glowColor: 'rgba(234,179,8,0.5)',
    artEmoji: '⭐🌟✨',
    flavorText: '"İki yıldız bir araya gelince, kader değişir." — Gök Bilimi Dergisi'
  },
  COPYCAT_JOKER: {
    id: 'COPYCAT_JOKER', icon: '🦜', name: 'Papağan',
    rarity: 'yaygin', cost: 55, maxPerRun: 1,
    effect: { type: 'copy_last_joker' },
    desc: 'En son oynanan Joker\'in pasif efektini bu tur kopyalar.',
    bgGradient: 'from-green-700 to-emerald-950', glowColor: 'rgba(74,222,128,0.4)',
    artEmoji: '🦜🪞🔄',
    flavorText: '"Taklit, iltifatın en samimi biçimidir." — Papağan Akademisi'
  },

  // ══════════════════════════════════════════
  // 🟦 NADİR JOKERLER (15 adet) — Uncommon
  // ══════════════════════════════════════════

  PHOENIX_JOKER: {
    id: 'PHOENIX_JOKER', icon: '🔥', name: 'Anka Kuşu',
    rarity: 'nadir', cost: 65, maxPerRun: 1,
    effect: { type: 'low_score_mult', threshold_pct: 50, value: 1.5 },
    desc: 'Puan hedefin %50 altındaysa o el skoru 1.5x katlanır.',
    bgGradient: 'from-orange-600 via-red-700 to-rose-900', glowColor: 'rgba(249,115,22,0.5)',
    artEmoji: '🦅🔥⚡',
    flavorText: '"Küllerinden doğanı kim durdurabilir?" — Anka Efsanesi'
  },
  SCHOLAR_JOKER: {
    id: 'SCHOLAR_JOKER', icon: '🎓', name: 'Bilge',
    rarity: 'nadir', cost: 70, maxPerRun: 1,
    effect: { type: 'long_word_chips_gold', minLen: 7, chips: 50, gold: 2 },
    desc: '7+ harfli kelimeler +50 Taban Puan ve +2 Altın kazandırır.',
    bgGradient: 'from-blue-700 via-indigo-800 to-purple-950', glowColor: 'rgba(99,102,241,0.5)',
    artEmoji: '🎓📜🧠',
    flavorText: '"Uzun kelimeler, derin bilgelik taşır." — Akademi Söylencesi'
  },
  THIEF_JOKER: {
    id: 'THIEF_JOKER', icon: '🦝', name: 'Hırsız',
    rarity: 'nadir', cost: 60, maxPerRun: 1,
    effect: { type: 'discard_accumulate_chips', per_discard: 15 },
    desc: 'Her atmada +15 puan birikir; sonraki kelimeye eklenir.',
    bgGradient: 'from-slate-600 via-zinc-800 to-stone-950', glowColor: 'rgba(113,113,122,0.5)',
    artEmoji: '🦝🎭🌑',
    flavorText: '"Gecenin karanlığında, puan birikir." — Gece Soygunları Rehberi'
  },
  GLACIER_JOKER: {
    id: 'GLACIER_JOKER', icon: '🧊', name: 'Buzul',
    rarity: 'nadir', cost: 65, maxPerRun: 1,
    effect: { type: 'bank_card_chips', per_card: 4 },
    desc: 'Harf Bankasındaki her harf +4 Taban Puan verir.',
    bgGradient: 'from-cyan-700 via-sky-800 to-slate-950', glowColor: 'rgba(6,182,212,0.5)',
    artEmoji: '🧊❄️🏔️',
    flavorText: '"Soğuk, ama güçlü. Buz her şeyi dondurur." — Kuzey Arşivleri'
  },
  SERPENT_JOKER: {
    id: 'SERPENT_JOKER', icon: '🐍', name: 'Yılan',
    rarity: 'nadir', cost: 75, maxPerRun: 1,
    effect: { type: 'same_first_letter_combo_x2' },
    desc: 'Aynı harfle başlayan ardışık kelimeler komboyu 2x hızlandırır.',
    bgGradient: 'from-green-700 via-emerald-800 to-teal-950', glowColor: 'rgba(16,185,129,0.5)',
    artEmoji: '🐍🌿💚',
    flavorText: '"Yılan, sessizce ilerler. Sen de öyle." — Zehirli Dil Öğretisi'
  },
  ECLIPSE_JOKER: {
    id: 'ECLIPSE_JOKER', icon: '🌑', name: 'Tutulma',
    rarity: 'nadir', cost: 70, maxPerRun: 1,
    effect: { type: 'score_over_threshold_mult', threshold: 200, mult: 30 },
    desc: 'Skoru hedefi 200 aşınca her kelime +30 Çarpan kazanır.',
    bgGradient: 'from-slate-900 via-zinc-800 to-neutral-950', glowColor: 'rgba(168,85,247,0.5)',
    artEmoji: '🌑🌒🌓',
    flavorText: '"Gölge düştüğünde güç patlar." — Ay Gözlemevi Notları'
  },
  MIME_JOKER: {
    id: 'MIME_JOKER', icon: '🤡', name: 'Mim',
    rarity: 'nadir', cost: 80, maxPerRun: 1,
    effect: { type: 'retrigger_best_card_mult', value: 2 },
    desc: 'Önceki turda kullandığın en iyi harf kartı bu tur 2x Çarpan verir.',
    bgGradient: 'from-white/10 via-slate-700 to-slate-900', glowColor: 'rgba(226,232,240,0.4)',
    artEmoji: '🤡🎭🪄',
    flavorText: '"En iyi gösteri, tekrardır." — Sirk Felsefecileri Birliği'
  },
  BLUEPRINT_JOKER: {
    id: 'BLUEPRINT_JOKER', icon: '📐', name: 'Plan',
    rarity: 'nadir', cost: 75, maxPerRun: 1,
    effect: { type: 'copy_neighbor_joker' },
    desc: 'Soldaki Joker\'in efektini bu tur için bir kez daha tekrarlar.',
    bgGradient: 'from-blue-600 via-sky-700 to-cyan-900', glowColor: 'rgba(14,165,233,0.5)',
    artEmoji: '📐📏🗺️',
    flavorText: '"Her büyük yapı, önce kağıda çizilir." — Mimar\'ın El Kitabı'
  },
  SUPERNOVA_JOKER: {
    id: 'SUPERNOVA_JOKER', icon: '💥', name: 'Süpernova',
    rarity: 'nadir', cost: 85, maxPerRun: 1,
    effect: { type: 'total_words_played_chips', per_word: 1 },
    desc: 'Koşu boyunca kaç kelime oynadıysan +1 Taban Puan ekler.',
    bgGradient: 'from-yellow-500 via-orange-600 to-red-900', glowColor: 'rgba(234,88,12,0.5)',
    artEmoji: '💥⭐🌌',
    flavorText: '"Bir yıldız ölürken, evreni aydınlatır." — Kozmos Gözlemleri'
  },
  FIBONACCI_JOKER: {
    id: 'FIBONACCI_JOKER', icon: '🌀', name: 'Fibonacci',
    rarity: 'nadir', cost: 80, maxPerRun: 1,
    effect: { type: 'common_letters_chips', letters: ['A','E','İ','K','L','M','R','S','T','N'], chips: 55 },
    desc: 'A,E,İ,K,L,M,R,S,T,N harflerini içeren kelimeler +55 Taban Puan.',
    bgGradient: 'from-teal-600 via-cyan-700 to-indigo-900', glowColor: 'rgba(20,184,166,0.5)',
    artEmoji: '🌀🔢🐚',
    flavorText: '"0, 1, 1, 2, 3, 5... Sonsuzluğun şifresi." — Fibonacci\'nin Defteri'
  },
  LOYALTY_JOKER: {
    id: 'LOYALTY_JOKER', icon: '❤️', name: 'Sadakat',
    rarity: 'nadir', cost: 75, maxPerRun: 1,
    effect: { type: 'streak_letter_bonus', streak: 3, chips: 15 },
    desc: 'Aynı harfi 3 tur üst üste kullananınca o harf +15 Taban Puan kazanır.',
    bgGradient: 'from-rose-600 via-red-700 to-rose-950', glowColor: 'rgba(244,63,94,0.5)',
    artEmoji: '❤️🤝💍',
    flavorText: '"Sadık kal, güçlen." — Büyük Savaşçı Yemini'
  },
  ARCHIVIST_JOKER: {
    id: 'ARCHIVIST_JOKER', icon: '🗂️', name: 'Arşivci',
    rarity: 'nadir', cost: 90, maxPerRun: 1,
    effect: { type: 'total_words_chips_x2' },
    desc: 'Bu koşuda toplam oynanan kelime sayısı × 2 = Taban Puan bonusu.',
    bgGradient: 'from-amber-700 via-yellow-800 to-amber-950', glowColor: 'rgba(217,119,6,0.5)',
    artEmoji: '🗂️📁🗃️',
    flavorText: '"Her kayıt, bir güç kaynağıdır." — Büyük Arşiv Yasaları'
  },
  TWIN_JOKER: {
    id: 'TWIN_JOKER', icon: '👯', name: 'İkiz',
    rarity: 'nadir', cost: 65, maxPerRun: 1,
    effect: { type: 'special_card_synergy_chips', per_special: 5 },
    desc: 'Her kullanılan özel kartta diğer özel kartlar +5 Puan kazanır.',
    bgGradient: 'from-purple-600 via-pink-700 to-rose-950', glowColor: 'rgba(192,38,211,0.5)',
    artEmoji: '👯🪞💜',
    flavorText: '"İki olunca, güç katlanır." — İkizler Mitolojisi'
  },
  FOOL_JOKER: {
    id: 'FOOL_JOKER', icon: '🎪', name: 'Soytarı',
    rarity: 'nadir', cost: 60, maxPerRun: 1,
    effect: { type: 'random_seal_each_turn' },
    desc: 'Her tur başında rastgele bir Mühür efekti (FOIL/HOLO/POLY) uygular.',
    bgGradient: 'from-yellow-600 via-orange-700 to-red-900', glowColor: 'rgba(245,158,11,0.5)',
    artEmoji: '🎪🃏🤹',
    flavorText: '"Bir soytarı, sarayın en akıllısı olabilir." — Orta Çağ Deyişi'
  },
  SEER_JOKER: {
    id: 'SEER_JOKER', icon: '🔭', name: 'Kahin',
    rarity: 'nadir', cost: 70, maxPerRun: 1,
    effect: { type: 'boss_score_reduce_pct', value: 20 },
    desc: 'Bir sonraki Boss\'un skor hedefini %20 azaltır.',
    bgGradient: 'from-indigo-600 via-purple-700 to-violet-950', glowColor: 'rgba(124,58,237,0.5)',
    artEmoji: '🔭🌙🔮',
    flavorText: '"Geleceği görmek, onu değiştirme gücü verir." — Kahin\'in Vakaları'
  },

  // ══════════════════════════════════════════
  // 🟥 EFSANEVİ JOKERLER (8 adet) — Rare
  // ══════════════════════════════════════════

  JOKER_STENCIL: {
    id: 'JOKER_STENCIL', icon: '🖼️', name: 'Şablon',
    rarity: 'efsanevi', cost: 120, maxPerRun: 1,
    effect: { type: 'joker_slot_fill', slots: 5 },
    desc: 'Joker slotun kaç boş olursa olsun 5 Joker varmış gibi davranır.',
    bgGradient: 'from-slate-800 via-zinc-700 to-slate-950', glowColor: 'rgba(251,191,36,0.6)',
    artEmoji: '🖼️🎨✏️',
    flavorText: '"Boş tuval, sonsuz olasılık taşır." — Ressam Jokeri\'nin Mirası'
  },
  BARON_JOKER: {
    id: 'BARON_JOKER', icon: '👑', name: 'Baron',
    rarity: 'efsanevi', cost: 130, maxPerRun: 1,
    effect: { type: 'specific_letter_mult', letter: 'K', mult: 30 },
    desc: 'Eldeki her K harfi için +30 Çarpan ekler.',
    bgGradient: 'from-yellow-600 via-amber-700 to-yellow-950', glowColor: 'rgba(250,204,21,0.6)',
    artEmoji: '👑🏰⚜️',
    flavorText: '"Kral harfi K\'dır. Ve K, krallıkları kurar." — Baron\'ın Soykütüğü'
  },
  VAMPIRE_JOKER: {
    id: 'VAMPIRE_JOKER', icon: '🧛', name: 'Vampir',
    rarity: 'efsanevi', cost: 140, maxPerRun: 1,
    effect: { type: 'absorb_seal_mult', per_seal: 20 },
    desc: 'Oynanan her Mühürlü harf için o Mühür\'ü emer ve +20 Çarpan alır.',
    bgGradient: 'from-red-900 via-rose-800 to-slate-950', glowColor: 'rgba(239,68,68,0.6)',
    artEmoji: '🧛🩸🌑',
    flavorText: '"Mühürleri em, güçlen. Hiç bitmez bu açlık." — Karanlık Dönüşüm Kitabı'
  },
  CANIO_JOKER: {
    id: 'CANIO_JOKER', icon: '🎩', name: 'Canio',
    rarity: 'efsanevi', cost: 150, maxPerRun: 1,
    effect: { type: 'absorb_sold_joker' },
    desc: 'İlk Joker\'ini satınca o Joker\'in efekti kalıcı olarak Canio\'ya aktarılır.',
    bgGradient: 'from-slate-800 via-purple-900 to-black', glowColor: 'rgba(147,51,234,0.6)',
    artEmoji: '🎩🎭💀',
    flavorText: '"Sattığın şey, sana geri döner." — Canio\'nun Trajedisi'
  },
  HOLOGRAM_JOKER: {
    id: 'HOLOGRAM_JOKER', icon: '💠', name: 'Hologram',
    rarity: 'efsanevi', cost: 125, maxPerRun: 1,
    effect: { type: 'per_card_added_chips', value: 10 },
    desc: 'Desteye her yeni harf eklenince kalıcı +10 Taban Puan kazanır.',
    bgGradient: 'from-cyan-600 via-blue-700 to-indigo-950', glowColor: 'rgba(6,182,212,0.6)',
    artEmoji: '💠🌐🔷',
    flavorText: '"Her yeni kart, yeni bir ışık katarı." — Holografik Arşiv'
  },
  GOLDEN_JOKER: {
    id: 'GOLDEN_JOKER', icon: '💰', name: 'Altın Joker',
    rarity: 'efsanevi', cost: 115, maxPerRun: 1,
    effect: { type: 'per_joker_gold', value: 5 },
    desc: 'Tur sonu elindeki her Joker için +5 Altın kazanırsın.',
    bgGradient: 'from-yellow-500 via-amber-600 to-yellow-900', glowColor: 'rgba(234,179,8,0.7)',
    artEmoji: '💰🪙🏆',
    flavorText: '"Altın, altını çeker." — Midas\'ın Defteri'
  },
  OBELISK_JOKER: {
    id: 'OBELISK_JOKER', icon: '🗿', name: 'Dikilitaş',
    rarity: 'efsanevi', cost: 135, maxPerRun: 1,
    effect: { type: 'non_dominant_letter_mult_stack', value: 1 },
    desc: 'En sık oynadığın harf dışındaki her kelimede +1 Çarpan birikir.',
    bgGradient: 'from-stone-700 via-zinc-800 to-neutral-950', glowColor: 'rgba(120,113,108,0.6)',
    artEmoji: '🗿🏛️⛩️',
    flavorText: '"Farklılık, gücün kaynağıdır." — Dikilitaş Yazıtı'
  },
  IDOL_JOKER: {
    id: 'IDOL_JOKER', icon: '🏺', name: 'Put',
    rarity: 'efsanevi', cost: 145, maxPerRun: 1,
    effect: { type: 'random_idol_letter_2x' },
    desc: 'Her bölgede rastgele 1 harf "idol" olur; o harfi içeren her kelime 2x puan.',
    bgGradient: 'from-amber-700 via-orange-800 to-red-950', glowColor: 'rgba(245,158,11,0.7)',
    artEmoji: '🏺🔱🌟',
    flavorText: '"Tanrı harfini bul, dünyayı fethet." — İdol Tapınağı\'nın Sırrı'
  },

  // ══════════════════════════════════════════
  // 🌟 EFSANE-ÖTESİ JOKERLER (5 adet) — Legendary
  // Yalnızca Obsidyen/Elmas Mühür'de %5 şansla çarşıda çıkar
  // ══════════════════════════════════════════

  SOUL_JOKER: {
    id: 'SOUL_JOKER', icon: '✨', name: 'Ruh',
    rarity: 'efsane_otesi', cost: 200, maxPerRun: 1,
    effect: { type: 'all_joker_chips_x2' },
    desc: 'Aktif tüm Jokerler\'in Taban Puan değerlerini 2x katar.',
    bgGradient: 'from-white/20 via-purple-400/20 to-indigo-900', glowColor: 'rgba(255,255,255,0.8)',
    artEmoji: '✨👻🌌',
    flavorText: '"Ruh, tüm jokerler\'in özüdür." — Efsanevi Ruh Çağırma Kitabı'
  },
  CHAOS_JOKER: {
    id: 'CHAOS_JOKER', icon: '🌀', name: 'Kaos',
    rarity: 'efsane_otesi', cost: 180,
    effect: { type: 'random_joker_trigger_each_turn' },
    desc: 'Her tur başında tamamen rastgele bir Joker efekti tetiklenir.',
    bgGradient: 'from-violet-500 via-fuchsia-600 to-pink-900', glowColor: 'rgba(217,70,239,0.7)'
  },
  LEGEND_JOKER: {
    id: 'LEGEND_JOKER', icon: '🏆', name: 'Efsane',
    rarity: 'efsane_otesi', cost: 220,
    effect: { type: 'stage_progress_to_mult' },
    desc: 'Bu koşuda tamamladığın Bölge sayısını Çarpan olarak ekler.',
    bgGradient: 'from-yellow-400 via-amber-500 to-orange-700', glowColor: 'rgba(251,191,36,0.8)'
  },
  VOID_JOKER: {
    id: 'VOID_JOKER', icon: '🕳️', name: 'Boşluk',
    rarity: 'efsane_otesi', cost: 190,
    effect: { type: 'no_return_cards_mult', per_card: 25 },
    desc: 'Oynanan her kart desteye geri dönmez; bunun yerine +25 Çarpan kazandırır.',
    bgGradient: 'from-black via-slate-900 to-zinc-950', glowColor: 'rgba(100,100,100,0.6)'
  },
  COSMOS_JOKER: {
    id: 'COSMOS_JOKER', icon: '🌌', name: 'Kozmos',
    rarity: 'efsane_otesi', cost: 250, maxPerRun: 1,
    effect: { type: 'joker_count_squared_chips' },
    desc: 'Aktif Joker sayısının karesi kadar Taban Puan ekler (3→9, 4→16, 5→25).',
    bgGradient: 'from-indigo-900 via-purple-900 to-blue-950', glowColor: 'rgba(99,102,241,0.8)',
    artEmoji: '🌌🪐🌠',
    flavorText: '"Evren, jokerler\'in sayısıyla genişler." — Kozmos Ansiklopedisi'
  },

  // ══════════════════════════════════════════
  // 🌟 YENİ BALATRO TARZI JOKERLER (15 Ekstra Adet)
  // ══════════════════════════════════════════
  ALCHEMIST_JOKER: {
    id: 'ALCHEMIST_JOKER', icon: '🧙', name: 'Simyacı Jokeri',
    rarity: 'nadir', cost: 75, maxPerRun: 1,
    effect: { type: 'rare_letter_gold_chips', chips: 20, gold: 15 },
    desc: 'Kelimedeki her nadir harf (Ş, Ğ, Ç, Ö, Ü, Z) için +15 Altın ve +20 Taban Puan verir.',
    bgGradient: 'from-amber-600 via-yellow-700 to-amber-950', glowColor: 'rgba(245,158,11,0.5)',
    artEmoji: '🧙🧪🪙',
    flavorText: '"Kurşunu altına çevirmek sanattır." — Simya Loncası'
  },
  JUGGLER_JOKER: {
    id: 'JUGGLER_JOKER', icon: '🤹', name: 'Hokkabaz',
    rarity: 'yaygin', cost: 45, maxPerRun: 1,
    effect: { type: 'hand_leftover_chips', per_card: 5 },
    desc: 'Tur sonu elinde kalan her harf için +5 Taban Puan biriktirir.',
    bgGradient: 'from-pink-600 via-rose-700 to-purple-950', glowColor: 'rgba(244,114,182,0.4)',
    artEmoji: '🤹🎪✨',
    flavorText: '"Toplar havada, puanlar cebinde." — Sokak Göstericileri'
  },
  DRAGON_JOKER: {
    id: 'DRAGON_JOKER', icon: '🐉', name: 'Ejderha Jokeri',
    rarity: 'efsanevi', cost: 140, maxPerRun: 1,
    effect: { type: 'long_word_dragon_mult', minLen: 6, mult: 1.8 },
    desc: '6+ harfli her kelimede skoru 1.8x katlar ve tahtayı alevlendirir!',
    bgGradient: 'from-red-700 via-orange-800 to-amber-950', glowColor: 'rgba(239,68,68,0.7)',
    artEmoji: '🐉🔥🗡️',
    flavorText: '"Ejderhanın nefesi kelimeleri tutuşturur." — Kadim Tapınak'
  },
  SPLICE_JOKER: {
    id: 'SPLICE_JOKER', icon: '✂️', name: 'Terzi Jokeri',
    rarity: 'yaygin', cost: 40, maxPerRun: 1,
    effect: { type: 'same_first_last_letter_chips', chips: 35, mult: 10 },
    desc: 'Kelimedeki ilk ve son harf aynı olursa (örn: "KAPAK") +35 Puan & +10 Çarpan.',
    bgGradient: 'from-cyan-700 via-blue-800 to-indigo-950', glowColor: 'rgba(6,182,212,0.4)',
    artEmoji: '✂️🧵👗',
    flavorText: '"Başı ve sonu birleştiren mükemmel dikiş." — Terziler Odası'
  },
  MAGNET_JOKER: {
    id: 'MAGNET_JOKER', icon: '🧲', name: 'Mıknatıs',
    rarity: 'nadir', cost: 70, maxPerRun: 1,
    effect: { type: 'bank_card_mult_boost', per_bank_card: 1.2 },
    desc: 'Harf Bankasından kullanılan harf başına o turun skorunu 1.2x katlar.',
    bgGradient: 'from-red-600 via-slate-800 to-blue-900', glowColor: 'rgba(239,68,68,0.5)',
    artEmoji: '🧲⚡⚙️',
    flavorText: '"Güçlü bir çekim alanı her puanı çeker." — Laboratuvar Notu'
  },
  CELESTIAL_JOKER: {
    id: 'CELESTIAL_JOKER', icon: '🪐', name: 'Göksel Joker',
    rarity: 'efsanevi', cost: 130, maxPerRun: 1,
    effect: { type: 'seal_power_double' },
    desc: 'Destedeki Polikrom (🌈), Altın Yaldız (🪙) ve Kutsal mühürlerin gücünü 2x katlar!',
    bgGradient: 'from-indigo-600 via-purple-700 to-pink-900', glowColor: 'rgba(168,85,247,0.7)',
    artEmoji: '🪐🌌✨',
    flavorText: '"Yıldızlar mühürlerin üzerinde parıldar." — Gök Tapınağı'
  },
  VOWEL_KING_JOKER: {
    id: 'VOWEL_KING_JOKER', icon: '👑', name: 'Sesli Kral',
    rarity: 'nadir', cost: 65, maxPerRun: 1,
    effect: { type: 'vowel_trio_bonus', chips: 45, mult: 15 },
    desc: 'Tam 3 sesli harf içeren kelimelerde +45 Taban Puan & +15 Çarpan verir.',
    bgGradient: 'from-yellow-500 via-amber-600 to-yellow-900', glowColor: 'rgba(234,179,8,0.5)',
    artEmoji: '👑🎶🔊',
    flavorText: '"Üç sesli birleşince taht kurulur." — Krallık Alfabesi'
  },
  PHANTOM_JOKER: {
    id: 'PHANTOM_JOKER', icon: '👻', name: 'Hayalet Joker',
    rarity: 'yaygin', cost: 45, maxPerRun: 1,
    effect: { type: 'deleted_cards_permanent_chips', per_deleted: 2 },
    desc: 'Destenden silinen her harf kartı için kelimelere kalıcı +2 Taban Puan katar.',
    bgGradient: 'from-slate-700 via-purple-900 to-slate-950', glowColor: 'rgba(147,51,234,0.4)',
    artEmoji: '👻💨🌑',
    flavorText: '"Silinen kartlar yok olmaz, hayaletleşir." — Gece Mirası'
  },
  TIME_LORD_JOKER: {
    id: 'TIME_LORD_JOKER', icon: '⏳', name: 'Zaman Efendisi',
    rarity: 'efsanevi', cost: 135, maxPerRun: 1,
    effect: { type: 'hands_left_gold_bonus', per_hand: 15 },
    desc: 'Kalan Hamle Hakkın ne kadar fazlaysa tur sonu her hak için +15 Altın kazandırır.',
    bgGradient: 'from-amber-600 via-orange-700 to-slate-950', glowColor: 'rgba(245,158,11,0.6)',
    artEmoji: '⏳🕰️⌛',
    flavorText: '"Zaman en değerli birimdir." — Saat Kulesi Muhafızı'
  },
  PIRATE_JOKER: {
    id: 'PIRATE_JOKER', icon: '🏴‍☠️', name: 'Korsan Jokeri',
    rarity: 'nadir', cost: 75, maxPerRun: 1,
    effect: { type: 'boss_victory_gold', gold: 40 },
    desc: 'Boss savaşlarını kazandığında +40 Ekstra Altın ve 1 Mühürlü Kart kazanır.',
    bgGradient: 'from-stone-800 via-slate-900 to-black', glowColor: 'rgba(120,113,108,0.5)',
    artEmoji: '🏴‍☠️💰⛵',
    flavorText: '"Zafer ganimeti denizler kadar engindir." — Korsan Haritası'
  },
  CRESCENT_JOKER: {
    id: 'CRESCENT_JOKER', icon: '🌙', name: 'Hilal Jokeri',
    rarity: 'yaygin', cost: 40, maxPerRun: 1,
    effect: { type: 'final_hand_mult', mult: 1.5 },
    desc: 'Son kalan kelime hamlende o hamlenin skoru 1.5x ile çarpar!',
    bgGradient: 'from-cyan-800 via-blue-900 to-slate-950', glowColor: 'rgba(34,211,238,0.4)',
    artEmoji: '🌙✨🌌',
    flavorText: '"Son hamle geceyi aydınlatır." — Ay Savaşçıları'
  },
  FORGE_JOKER: {
    id: 'FORGE_JOKER', icon: '🔨', name: 'Ocak Ustası',
    rarity: 'nadir', cost: 65, maxPerRun: 1,
    effect: { type: 'upgrade_discount_pct', discount: 50 },
    desc: 'Deste geliştirme veya seviye yükseltme işlemleri %50 indirimli olur.',
    bgGradient: 'from-orange-700 via-amber-800 to-slate-950', glowColor: 'rgba(249,115,22,0.5)',
    artEmoji: '🔨🔥⚙️',
    flavorText: '"Ocakta pişen harf daha güçlü olur." — Demirci Mahfili'
  },
  CARD_SHARK_JOKER: {
    id: 'CARD_SHARK_JOKER', icon: '🦈', name: 'Kart Köpekbalığı',
    rarity: 'efsanevi', cost: 125, maxPerRun: 1,
    effect: { type: 'refresh_buffs_hand' },
    desc: 'Yenileme (Refresh) yaptığında elindeki tüm kartlara rastgele +5 Puan veya Mühür katar.',
    bgGradient: 'from-blue-700 via-cyan-800 to-slate-950', glowColor: 'rgba(14,165,233,0.6)',
    artEmoji: '🦈🌊🎲',
    flavorText: '"Denizin derinliklerinde kartlar yeniden doğar." — Derin Okyanus'
  },
  MYSTIC_JOKER: {
    id: 'MYSTIC_JOKER', icon: '🔮', name: 'Mistik Joker',
    rarity: 'yaygin', cost: 40, maxPerRun: 1,
    effect: { type: 'alternating_vowels_chips', chips: 30 },
    desc: 'Sesli-sessiz sıralı dizilime sahip kelimelerde (örn: A-K-A, K-A-K) +30 Puan verir.',
    bgGradient: 'from-purple-800 via-indigo-900 to-slate-950', glowColor: 'rgba(168,85,247,0.4)',
    artEmoji: '🔮📜✨',
    flavorText: '"Ritmi takip et, gücü hisset." — Mistik Düzen'
  },
  NEBULA_JOKER: {
    id: 'NEBULA_JOKER', icon: '🌌', name: 'Bulutsu Jokeri',
    rarity: 'efsane_otesi', cost: 260, maxPerRun: 1,
    effect: { type: 'deck_count_mult_all' },
    desc: 'Tüm harf kartlarının puanını destedeki toplam harf sayısı ile çarpar!',
    bgGradient: 'from-fuchsia-600 via-purple-700 to-indigo-950', glowColor: 'rgba(217,70,239,0.8)',
    artEmoji: '🌌⭐💫',
    flavorText: '"Bulutsu, sonsuz harflerin beşiğidir." — Galaksi Ansiklopedisi'
  },

  // ══════════════════════════════════════════
  // ⚖️ RİSK & ÖDÜL (ÇİFT TARAFLI - DEZAVANTAJLI / AVANTAJLI) JOKERLER (10 adet)
  // ══════════════════════════════════════════
  BOMBER_JOKER: {
    id: 'BOMBER_JOKER', icon: '💣', name: 'Bombacı Jokeri',
    rarity: 'efsanevi', cost: 90, maxPerRun: 1,
    effect: { type: 'risk_reward_bomber', chips: 100, mult: 30 },
    desc: '⚖️ +100 Taban Puan & +30 Çarpan katar; fakat 3 hamlede kazanamazsan destenden 2 harf yakıp yok eder!',
    bgGradient: 'from-red-900 via-rose-950 to-black', glowColor: 'rgba(239,68,68,0.7)',
    artEmoji: '💣🔥💥',
    flavorText: '"Fitil ateşlendi, çabuk ol!" — Bombacı Günlükleri'
  },
  VAMPIRIC_JOKER: {
    id: 'VAMPIRIC_JOKER', icon: '🩸', name: 'Vampir Sözlük',
    rarity: 'efsanevi', cost: 110, maxPerRun: 1,
    effect: { type: 'risk_reward_vampire', mult: 2.5 },
    desc: '⚖️ Kelime puanını 2.5x katlar; fakat her kelime oynandığında elindeki kalan 1 harfi emer ve yok eder!',
    bgGradient: 'from-rose-950 via-red-900 to-black', glowColor: 'rgba(225,29,72,0.7)',
    artEmoji: '🩸🧛📜',
    flavorText: '"Güç kanla ödenir." — Vampir Sözlüğü'
  },
  GREEDY_MERCHANT: {
    id: 'GREEDY_MERCHANT', icon: '⚖️', name: 'Açgözlü Tüccar',
    rarity: 'nadir', cost: 50, maxPerRun: 1,
    effect: { type: 'risk_reward_shop_discount', discount: 75, gold_tax_pct: 20 },
    desc: '⚖️ Dükkândaki TÜM ürünler %75 indirimli olur; fakat her tur sonu cebindeki altının %20\'sini komisyon alır!',
    bgGradient: 'from-amber-700 via-yellow-900 to-amber-950', glowColor: 'rgba(245,158,11,0.6)',
    artEmoji: '⚖️🪙💰',
    flavorText: '"İndirim var ama bedava değil." — Tüccar Meclisi'
  },
  HEAVY_SHACKLE: {
    id: 'HEAVY_SHACKLE', icon: '⛓️', name: 'Ağır Pranga',
    rarity: 'efsanevi', cost: 100, maxPerRun: 1,
    effect: { type: 'risk_reward_shackle', mult: 3.0, hand_reduction: 2 },
    desc: '⚖️ Tüm kelime puanlarını 3.0x ile çarpar; fakat tur başına hamle hakkını 2 düşürür (en fazla 2 kelime yazabilirsin)!',
    bgGradient: 'from-stone-700 via-slate-900 to-black', glowColor: 'rgba(120,113,108,0.6)',
    artEmoji: '⛓️🗝️🛡️',
    flavorText: '"Ağır prangalar, devasa güç getirir." — Zindan Muhafızı'
  },
  RISKY_GAMBLER: {
    id: 'RISKY_GAMBLER', icon: '🎲', name: 'Cüretkar Kumarbaz',
    rarity: 'nadir', cost: 60, maxPerRun: 1,
    effect: { type: 'risk_reward_gamble', chance: 50, win_mult: 4.0, fail_mult: 0 },
    desc: '⚖️ %50 şansla kelimenin puanını 4X katlar; fakat %50 şansla o kelimeden 0 PUAN alırsın!',
    bgGradient: 'from-purple-800 via-pink-900 to-rose-950', glowColor: 'rgba(217,70,239,0.6)',
    artEmoji: '🎲🎰🃏',
    flavorText: '"Kazanmak cesaret ister." — Kumarhane Kralı'
  },
  CURSED_CANDLE: {
    id: 'CURSED_CANDLE', icon: '🕯️', name: 'Lanetli Mum',
    rarity: 'efsanevi', cost: 85, maxPerRun: 1,
    effect: { type: 'risk_reward_candle', free_joker: true },
    desc: '⚖️ Her tur başında ücretsiz +1 Özel Joker Harf Taşı verir; fakat tur sonu barajı geçemezsen +1 can kaybettirir!',
    bgGradient: 'from-violet-900 via-indigo-950 to-black', glowColor: 'rgba(139,92,246,0.6)',
    artEmoji: '🕯️💀✨',
    flavorText: '"Mum eridikçe zaman daralır." — Lanetli Ritüel'
  },
  BLIND_SEER: {
    id: 'BLIND_SEER', icon: '🙈', name: 'Kör Kahin',
    rarity: 'nadir', cost: 70, maxPerRun: 1,
    effect: { type: 'risk_reward_blind', chips: 150, hide_cards: 2 },
    desc: '⚖️ Kelimelere +150 Taban Puan ekler; fakat eldeki 2 harfin üzerini kapatıp gizler!',
    bgGradient: 'from-cyan-900 via-slate-900 to-black', glowColor: 'rgba(6,182,212,0.5)',
    artEmoji: '🙈🔮👁️',
    flavorText: '"Gözlerini kapatan, gerçeği görür." — Kör Kahin'
  },
  WITHERED_ROSE: {
    id: 'WITHERED_ROSE', icon: '🥀', name: 'Solgun Gül',
    rarity: 'yaygin', cost: 45, maxPerRun: 1,
    effect: { type: 'risk_reward_rose', first_hand_mult: 3.5, subsequent_mult: 0.5 },
    desc: '⚖️ Turdaki İLK kelimen 3.5x Çarpan alır; fakat o turdaki sonraki kelimelerinin puanı %50 düşer!',
    bgGradient: 'from-rose-800 via-pink-950 to-black', glowColor: 'rgba(244,63,94,0.5)',
    artEmoji: '🥀🌹🖤',
    flavorText: '"İlk açılış muhteşemdir, sonrası solgun." — Gül Çiftliği'
  },
  OVERLOAD_JOKER: {
    id: 'OVERLOAD_JOKER', icon: '⚡', name: 'Aşırı Yükleme',
    rarity: 'nadir', cost: 65, maxPerRun: 1,
    effect: { type: 'risk_reward_overload', per_letter_chips: 20, zero_discards: true },
    desc: '⚖️ Kelimedeki her harfe +20 Taban Puan ekler; fakat elindeki Yenileme / Atma (Discard) hakkını 0 yapar!',
    bgGradient: 'from-yellow-600 via-orange-700 to-red-950', glowColor: 'rgba(234,179,8,0.6)',
    artEmoji: '⚡🔌💥',
    flavorText: '"Tam güç! Geri adım yok." — Mühendis Günlüğü'
  },
  TYRANT_JOKER: {
    id: 'TYRANT_JOKER', icon: '🏛️', name: 'Büyük Tiran',
    rarity: 'efsanevi', cost: 120, maxPerRun: 1,
    effect: { type: 'risk_reward_tyrant', small_deck_mult: 60, large_deck_penalty: -40 },
    desc: '⚖️ Deste boyutun 20 harften az ise devasa +60 Çarpan katar; fakat deste boyutun 25\'ten büyükse -40 ceza keser!',
    bgGradient: 'from-amber-800 via-yellow-900 to-stone-950', glowColor: 'rgba(245,158,11,0.6)',
    artEmoji: '🏛️👑⚔️',
    flavorText: '"Tiran küçük ve disiplinli bir ordu ister." — İmparatorluk Tüzüğü'
  }
};

export const EDITION_DEFINITIONS = {
  FOIL: {
    id: 'FOIL',
    name: '🪙 Varaklı (Foil)',
    icon: '🪙',
    bonusChips: 30,
    bonusMult: 0,
    bonusXMult: 1.0,
    desc: 'Oynandığında +30 Taban Puan (Chips) kazandırır.',
    badgeClass: 'border-amber-400 bg-amber-950/90 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.6)]'
  },
  HOLOGRAPHIC: {
    id: 'HOLOGRAPHIC',
    name: '🔮 Holografik (Holo)',
    icon: '🔮',
    bonusChips: 0,
    bonusMult: 10,
    bonusXMult: 1.0,
    desc: 'Oynandığında +10 Kırmızı Çarpan (Mult) kazandırır.',
    badgeClass: 'border-purple-400 bg-purple-950/90 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.6)]'
  },
  POLYCHROME: {
    id: 'POLYCHROME',
    name: '🌈 Polikrom (Poly)',
    icon: '🌈',
    bonusChips: 0,
    bonusMult: 0,
    bonusXMult: 1.5,
    desc: 'Kelimenin toplam puanını x1.5 KATLAR (xMult)!',
    badgeClass: 'border-pink-400 bg-pink-950/90 text-pink-300 shadow-[0_0_20px_rgba(244,114,182,0.8)] animate-pulse'
  },
  NEGATIVE: {
    id: 'NEGATIVE',
    name: '🖤 Negatif (Negative)',
    icon: '🖤',
    bonusChips: 0,
    bonusMult: 0,
    bonusXMult: 1.0,
    bonusJokerSlots: 1,
    desc: '+1 Ekstra Pasif Joker Yuvası kazandırır!',
    badgeClass: 'border-cyan-400 bg-slate-950 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.8)]'
  }
};

export const ALL_PASSIVE_JOKER_KEYS = Object.keys(PASSIVE_JOKERS);
export const PASSIVE_JOKERS_BY_RARITY = {
  yaygin: ALL_PASSIVE_JOKER_KEYS.filter(k => PASSIVE_JOKERS[k].rarity === 'yaygin'),
  nadir: ALL_PASSIVE_JOKER_KEYS.filter(k => PASSIVE_JOKERS[k].rarity === 'nadir'),
  efsanevi: ALL_PASSIVE_JOKER_KEYS.filter(k => PASSIVE_JOKERS[k].rarity === 'efsanevi'),
  efsane_otesi: ALL_PASSIVE_JOKER_KEYS.filter(k => PASSIVE_JOKERS[k].rarity === 'efsane_otesi'),
};

export const STARTER_DECKS = [
  {
    id: 'starter_basit',
    name: 'Standart Deste (Klasik Kırmızı)',
    desc: '20 Türkçe harften oluşan dengeli ve klasik başlangıç destesi. +$15 Başlangıç altını.',
    icon: '🃏',
    unlocked: true,
    bonusGold: 15,
    unlockRequirement: 'Başlangıçta Açık',
    letters: ['A', 'A', 'A', 'E', 'E', 'E', 'İ', 'O', 'U', 'K', 'K', 'L', 'L', 'M', 'N', 'R', 'S', 'T', 'B', 'Y']
  },
  {
    id: 'starter_sesli',
    name: 'Sesli Harf Krallığı (Mavi)',
    desc: 'Bolca sesli harf içeren 22 kartlık kolay kelime türetme destesi.',
    icon: '🌊',
    unlocked: true,
    bonusGold: 10,
    unlockRequirement: 'Başlangıçta Açık',
    letters: ['A', 'A', 'A', 'A', 'E', 'E', 'E', 'İ', 'İ', 'I', 'O', 'Ö', 'U', 'Ü', 'K', 'L', 'M', 'N', 'R', 'S', 'T', 'Y']
  },
  {
    id: 'starter_tyccar',
    name: 'Tüccar Destesi (Altın)',
    desc: 'Oyuna ekstra +$35 Altın ve 2 adet Altın Harf avantajıyla başlar.',
    icon: '💰',
    unlocked: false,
    unlockCost: 0,
    bonusGold: 35,
    unlockRequirement: 'Altın Avcısı Başarımı (Toplam 250 Altın Kazan)',
    achievementId: 'ACH_GOLD_100',
    letters: ['A', 'A', 'E', 'E', 'İ', 'O', 'K', 'K', 'L', 'M', 'N', 'R', 'S', 'T', 'B', 'D', 'Y', 'Z', 'GOLDEN', 'GOLDEN']
  },
  {
    id: 'starter_nadir',
    name: 'Nadir Harfler Destesi (Zümrüt)',
    desc: 'J, Z, Ş, Ğ, Ç, V, P gibi devasa puanlı ama zor Türkçe harfler içerir.',
    icon: '💎',
    unlocked: false,
    unlockCost: 0,
    unlockRequirement: 'Usta Yazar Başarımı (8+ Harfli Kelime Yaz)',
    achievementId: 'ACH_FIRST_7_LETTER',
    letters: ['A', 'A', 'E', 'E', 'İ', 'K', 'L', 'R', 'Ş', 'Ç', 'Ğ', 'Z', 'J', 'F', 'P', 'V', 'C', 'H']
  },
  {
    id: 'starter_erratic',
    name: 'Kaotik Rastgele Deste (Mor)',
    desc: 'Her yeni oyunda 20 harf tamamen rastgele ve sürpriz biçimde türetilir!',
    icon: '🎲',
    unlocked: false,
    unlockCost: 30,
    unlockRequirement: 'Ateş Fırtınası Başarımı (Kombo ×6 Yap)',
    achievementId: 'ACH_COMBO_5',
    isErratic: true,
    letters: []
  },
  {
    id: 'starter_thin',
    name: 'İnce & Keskin Deste (Siyah)',
    desc: 'Sadece 12 harften oluşan ultra hızlı dönen kombo destesi.',
    icon: '🗡️',
    unlocked: false,
    unlockCost: 40,
    unlockRequirement: 'Akademi Mezunu Başarımı (Kademe 6 Zaferi)',
    achievementId: 'ACH_STAGE_5',
    letters: ['A', 'A', 'E', 'İ', 'K', 'K', 'L', 'M', 'N', 'R', 'S', 'T']
  },
  {
    id: 'starter_elemental',
    name: 'Efsunlu Element Destesi (Alev)',
    desc: 'Başlangıçta Ateşli, Şanslı ve Çift Harf efsunlu harfler taşır.',
    icon: '🔥',
    unlocked: false,
    unlockCost: 50,
    unlockRequirement: 'Ejderha Katili Başarımı (Kademe 10 Boss Zaferi)',
    achievementId: 'ACH_BOSS_SLAYER',
    letters: ['A', 'A', 'E', 'E', 'İ', 'O', 'K', 'L', 'M', 'N', 'R', 'S', 'T', 'Y', 'MIRROR', 'DOUBLE', 'JOKER', 'ASH']
  }
];


let nextCardId = 1;

export function createCard(letterOrSpecialKey = 'A', upgradeLevel = 0, infusedType = null, seal = null) {
  const uniqueSuffix = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}_${Math.floor(Math.random() * 1000000)}`;

  let key = letterOrSpecialKey;
  if (key === 'JOKER_CARD' || key === 'JOKER_HARF') key = 'JOKER';
  if (key === 'FOIL_JOKER') key = 'RAINBOW_JOKER';

  if (SPECIAL_CARDS[key]) {
    const spec = SPECIAL_CARDS[key];
    return {
      id: `card_spec_${nextCardId++}_${uniqueSuffix}`,
      letter: '🃏',
      isSpecial: true,
      specialType: spec.type || 'joker',
      name: spec.name,
      points: spec.points || 0,
      upgradeLevel: 0,
      rarity: spec.rarity || 'nadir',
      desc: spec.desc,
      bgGradient: spec.bgGradient,
      infusedType: infusedType,
      seal: seal || spec.seal
    };
  }

  let upper = String(key || 'A').toUpperCase();
  if (upper === 'BUFFOON_PACK' || upper === 'ARCANA_PACK' || upper.length > 2) {
    const specialKeys = Object.keys(SPECIAL_CARDS);
    const randomSpecKey = specialKeys[Math.floor(Math.random() * specialKeys.length)];
    return createCard(randomSpecKey, upgradeLevel, infusedType, seal);
  }

  const def = LETTER_DEFINITIONS[upper] || { points: 1, rarity: 'normal', desc: 'Harf' };

  const basePoints = def.points;
  const currentPoints = basePoints + upgradeLevel * 2;

  return {
    id: `card_ltr_${nextCardId++}_${uniqueSuffix}`,
    letter: upper,
    isSpecial: false,
    name: `${upper} Harfi`,
    points: currentPoints,
    basePoints: basePoints,
    upgradeLevel: upgradeLevel,
    rarity: def.rarity,
    desc: def.desc,
    infusedType: infusedType,
    seal: seal
  };
}

export function getPerkDescription(upgradeLevel) {
  if (upgradeLevel === 1) return '+2 Puan';
  if (upgradeLevel === 2) return '+4 Puan (+3 Bonus if 4+ letters)';
  if (upgradeLevel >= 3) return '+6 Puan (+1 Kombo Artışı)';
  return 'Temel Harf';
}

export function getRarityDetails(rarityKey) {
  if (rarityKey === 'cok_nadir') {
    return { name: 'Çok Nadir', badgeClass: 'bg-amber-950 text-amber-300 border-amber-500/60' };
  }
  if (rarityKey === 'nadir') {
    return { name: 'Nadir', badgeClass: 'bg-purple-950 text-purple-300 border-purple-500/60' };
  }
  return { name: 'Normal', badgeClass: 'bg-slate-900 text-slate-400 border-slate-700' };
}

export const INFUSED_TYPES = {
  ignited: {
    id: 'ignited',
    name: 'Ateşli Harf',
    icon: '🌋',
    desc: 'Oynandığında kombo seviyesini +2 artırır.',
    badgeClass: 'border-orange-500 bg-orange-950/90 text-orange-300 shadow-orange-500/50 animate-pulse'
  },
  frozen: {
    id: 'frozen',
    name: 'Buzlu Harf',
    icon: '❄️',
    desc: 'Harf bankasında tutulduğunda her tur taban puanı +3 birikir.',
    badgeClass: 'border-cyan-400 bg-cyan-950/90 text-cyan-200 shadow-cyan-500/50'
  },
  electric: {
    id: 'electric',
    name: 'Volt Harfi',
    icon: '⚡',
    desc: 'Oynandığında anında 1 bedava harf çeker.',
    badgeClass: 'border-amber-400 bg-amber-950/90 text-amber-200 shadow-amber-500/50'
  },
  lucky: {
    id: 'lucky',
    name: 'Şanslı Harf',
    icon: '🍀',
    desc: 'Oynandığında +6 ekstra Altın kazandırır.',
    badgeClass: 'border-emerald-400 bg-emerald-950/90 text-emerald-200 shadow-emerald-500/50'
  }
};

export function createDeckFromLetterList(letterList = []) {
  return letterList.map(item => createCard(item));
}


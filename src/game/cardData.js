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
    bonusGold: 15,
    desc: 'Oynandığında anında +15 Ekstra Altın kazandırır.',
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
  CROWN_SEAL: {
    id: 'CROWN_SEAL',
    name: '👑 Kral Mühürü',
    icon: '👑',
    bonusChips: 50,
    bonusMult: 20,
    desc: '5+ Harfli kelimelerde oynanırsa +50 Puan ve +20 Çarpan ekler!',
    badgeClass: 'border-amber-300 bg-amber-900/90 text-yellow-200 shadow-yellow-500/60 ring-2 ring-yellow-400'
  }
};

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
    desc: 'Bir sonraki harfleri tahmin ederek +40 Ekstra Taban Puan kazandırır.',
    bgGradient: 'from-cyan-500 via-indigo-600 to-purple-700'
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
  }
};

// ─────────────────────────────────────────────────────────────
// PASSIVE JOKERS — Balatro tarzı pasif etkili güçlendiriciler
// rarity: 'yaygin' | 'nadir' | 'efsanevi' | 'efsane_otesi'
// ─────────────────────────────────────────────────────────────

export const PASSIVE_JOKERS = {

  // ══════════════════════════════════════════
  // 🟩 YAYGIN JOKERLER (15 adet) — Common
  // ══════════════════════════════════════════

  SCRIBE_JOKER: {
    id: 'SCRIBE_JOKER', icon: '📝', name: 'Katip Jokeri',
    rarity: 'yaygin', cost: 35,
    effect: { type: 'per_word_chips', value: 4 },
    desc: 'Her başarılı kelimede +4 Taban Puan biriktirir.',
    bgGradient: 'from-slate-700 to-slate-900', glowColor: 'rgba(148,163,184,0.4)'
  },
  VOWEL_JOKER: {
    id: 'VOWEL_JOKER', icon: '🗣️', name: 'Sesli Harf Jokeri',
    rarity: 'yaygin', cost: 40,
    effect: { type: 'per_vowel_chips', value: 3 },
    desc: 'Kelimedeki her sesli harf için +3 Taban Puan ekler.',
    bgGradient: 'from-sky-800 to-blue-950', glowColor: 'rgba(56,189,248,0.4)'
  },
  CONSONANT_JOKER: {
    id: 'CONSONANT_JOKER', icon: '🔤', name: 'Ünsüz Jokeri',
    rarity: 'yaygin', cost: 40,
    effect: { type: 'per_consonant_mult', value: 2 },
    desc: 'Kelimedeki her ünsüz harf için +2 Çarpan ekler.',
    bgGradient: 'from-teal-800 to-teal-950', glowColor: 'rgba(45,212,191,0.4)'
  },
  MERCHANT_JOKER: {
    id: 'MERCHANT_JOKER', icon: '💼', name: 'Tüccar Jokeri',
    rarity: 'yaygin', cost: 50,
    effect: { type: 'shop_gold_bonus', value: 10 },
    desc: 'Her Çarşı ziyaretinde +10 Altın ile başlarsın.',
    bgGradient: 'from-amber-800 to-amber-950', glowColor: 'rgba(245,158,11,0.4)'
  },
  PIGGY_JOKER: {
    id: 'PIGGY_JOKER', icon: '🐷', name: 'Kumbara Jokeri',
    rarity: 'yaygin', cost: 45,
    effect: { type: 'gold_to_chips', per: 5, value: 1 },
    desc: 'Tur sonu harcamadığın her 5 Altın için +1 Taban Puan birikir.',
    bgGradient: 'from-pink-800 to-rose-950', glowColor: 'rgba(244,114,182,0.4)'
  },
  SHORTCUT_JOKER: {
    id: 'SHORTCUT_JOKER', icon: '⚡', name: 'Kestirme Jokeri',
    rarity: 'yaygin', cost: 35,
    effect: { type: 'short_word_chips', maxLen: 3, value: 20 },
    desc: '3 harfli kelimeler +20 Taban Puan kazanır.',
    bgGradient: 'from-yellow-700 to-orange-900', glowColor: 'rgba(251,191,36,0.4)'
  },
  ECHO_JOKER: {
    id: 'ECHO_JOKER', icon: '🔁', name: 'Yankı Jokeri',
    rarity: 'yaygin', cost: 40,
    effect: { type: 'repeat_word_bonus_pct', value: 50 },
    desc: 'Aynı kelimeyi tekrar oynayınca +50% bonus puan.',
    bgGradient: 'from-violet-800 to-purple-950', glowColor: 'rgba(167,139,250,0.4)'
  },
  LUCKY_CAT_JOKER: {
    id: 'LUCKY_CAT_JOKER', icon: '🍀', name: 'Şans Kedisi',
    rarity: 'yaygin', cost: 45,
    effect: { type: 'lucky_gold_chance', chance: 20, value: 25 },
    desc: 'Her kelimede %20 şansla +25 Altın düşer.',
    bgGradient: 'from-emerald-700 to-green-950', glowColor: 'rgba(52,211,153,0.4)'
  },
  LIBRARY_JOKER: {
    id: 'LIBRARY_JOKER', icon: '📚', name: 'Kütüphane',
    rarity: 'yaygin', cost: 50,
    effect: { type: 'hand_size_plus', value: 1, max: 3 },
    desc: 'Her tur başlangıcında el boyutun +1 artar (maks +3).',
    bgGradient: 'from-indigo-800 to-indigo-950', glowColor: 'rgba(99,102,241,0.4)'
  },
  STEEL_JOKER: {
    id: 'STEEL_JOKER', icon: '🔩', name: 'Çelik Joker',
    rarity: 'yaygin', cost: 40,
    effect: { type: 'deck_size_chips', per: 1, value: 1 },
    desc: 'Deste boyutu ne kadar büyükse kart başına +1 Taban Puan.',
    bgGradient: 'from-slate-600 to-slate-900', glowColor: 'rgba(100,116,139,0.5)'
  },
  RUNNER_JOKER: {
    id: 'RUNNER_JOKER', icon: '🏃', name: 'Koşucu Jokeri',
    rarity: 'yaygin', cost: 45,
    effect: { type: 'word_restores_discard', max: 3 },
    desc: 'Başarılı her kelime Atma Hakkını +1 yeniler (maks 3).',
    bgGradient: 'from-orange-700 to-red-900', glowColor: 'rgba(251,146,60,0.4)'
  },
  HOARDER_JOKER: {
    id: 'HOARDER_JOKER', icon: '🏠', name: 'İstifçi Jokeri',
    rarity: 'yaygin', cost: 35,
    effect: { type: 'undeleted_card_chips', per: 1, value: 1 },
    desc: 'Silmediğin her harf kartı +1 Taban Puan bonusu taşır.',
    bgGradient: 'from-stone-700 to-stone-950', glowColor: 'rgba(168,162,158,0.4)'
  },
  GAMBLER_JOKER: {
    id: 'GAMBLER_JOKER', icon: '🎲', name: 'Kumarbaz',
    rarity: 'yaygin', cost: 40,
    effect: { type: 'discard_gamble_chips', chance: 50, value: 30 },
    desc: 'Atma yaptığında %50 şansla +30 Taban Puan kazanırsın.',
    bgGradient: 'from-rose-700 to-rose-950', glowColor: 'rgba(251,113,133,0.4)'
  },
  TWIN_STARS_JOKER: {
    id: 'TWIN_STARS_JOKER', icon: '⭐', name: 'İkiz Yıldız',
    rarity: 'yaygin', cost: 50,
    effect: { type: 'two_rare_letters_mult', value: 1.3 },
    desc: 'İki farklı nadir harf kullananınca o tur puanı 1.3x olur.',
    bgGradient: 'from-amber-600 to-yellow-900', glowColor: 'rgba(234,179,8,0.5)'
  },
  COPYCAT_JOKER: {
    id: 'COPYCAT_JOKER', icon: '🦜', name: 'Papağan',
    rarity: 'yaygin', cost: 55,
    effect: { type: 'copy_last_joker' },
    desc: 'En son oynanan Joker\'in pasif efektini bu tur kopyalar.',
    bgGradient: 'from-green-700 to-emerald-950', glowColor: 'rgba(74,222,128,0.4)'
  },

  // ══════════════════════════════════════════
  // 🟦 NADİR JOKERLER (15 adet) — Uncommon
  // ══════════════════════════════════════════

  PHOENIX_JOKER: {
    id: 'PHOENIX_JOKER', icon: '🔥', name: 'Anka Kuşu',
    rarity: 'nadir', cost: 65,
    effect: { type: 'low_score_mult', threshold_pct: 50, value: 1.5 },
    desc: 'Puan hedefin %50 altındaysa o el skoru 1.5x katlanır.',
    bgGradient: 'from-orange-600 via-red-700 to-rose-900', glowColor: 'rgba(249,115,22,0.5)'
  },
  SCHOLAR_JOKER: {
    id: 'SCHOLAR_JOKER', icon: '🎓', name: 'Bilge',
    rarity: 'nadir', cost: 70,
    effect: { type: 'long_word_chips_gold', minLen: 7, chips: 50, gold: 2 },
    desc: '7+ harfli kelimeler +50 Taban Puan ve +2 Altın kazandırır.',
    bgGradient: 'from-blue-700 via-indigo-800 to-purple-950', glowColor: 'rgba(99,102,241,0.5)'
  },
  THIEF_JOKER: {
    id: 'THIEF_JOKER', icon: '🦝', name: 'Hırsız',
    rarity: 'nadir', cost: 60,
    effect: { type: 'discard_accumulate_chips', per_discard: 15 },
    desc: 'Her atmada +15 puan birikir; sonraki kelimeye eklenir.',
    bgGradient: 'from-slate-600 via-zinc-800 to-stone-950', glowColor: 'rgba(113,113,122,0.5)'
  },
  GLACIER_JOKER: {
    id: 'GLACIER_JOKER', icon: '🧊', name: 'Buzul',
    rarity: 'nadir', cost: 65,
    effect: { type: 'bank_card_chips', per_card: 4 },
    desc: 'Harf Bankasındaki her harf +4 Taban Puan verir.',
    bgGradient: 'from-cyan-700 via-sky-800 to-slate-950', glowColor: 'rgba(6,182,212,0.5)'
  },
  SERPENT_JOKER: {
    id: 'SERPENT_JOKER', icon: '🐍', name: 'Yılan',
    rarity: 'nadir', cost: 75,
    effect: { type: 'same_first_letter_combo_x2' },
    desc: 'Aynı harfle başlayan ardışık kelimeler komboyu 2x hızlandırır.',
    bgGradient: 'from-green-700 via-emerald-800 to-teal-950', glowColor: 'rgba(16,185,129,0.5)'
  },
  ECLIPSE_JOKER: {
    id: 'ECLIPSE_JOKER', icon: '🌑', name: 'Tutulma',
    rarity: 'nadir', cost: 70,
    effect: { type: 'score_over_threshold_mult', threshold: 200, mult: 30 },
    desc: 'Skoru hedefi 200 aşınca her kelime +30 Çarpan kazanır.',
    bgGradient: 'from-slate-900 via-zinc-800 to-neutral-950', glowColor: 'rgba(168,85,247,0.5)'
  },
  MIME_JOKER: {
    id: 'MIME_JOKER', icon: '🤡', name: 'Mim',
    rarity: 'nadir', cost: 80,
    effect: { type: 'retrigger_best_card_mult', value: 2 },
    desc: 'Önceki turda kullandığın en iyi harf kartı bu tur 2x Çarpan verir.',
    bgGradient: 'from-white/10 via-slate-700 to-slate-900', glowColor: 'rgba(226,232,240,0.4)'
  },
  BLUEPRINT_JOKER: {
    id: 'BLUEPRINT_JOKER', icon: '📐', name: 'Plan',
    rarity: 'nadir', cost: 75,
    effect: { type: 'copy_neighbor_joker' },
    desc: 'Soldaki Joker\'in efektini bu tur için bir kez daha tekrarlar.',
    bgGradient: 'from-blue-600 via-sky-700 to-cyan-900', glowColor: 'rgba(14,165,233,0.5)'
  },
  SUPERNOVA_JOKER: {
    id: 'SUPERNOVA_JOKER', icon: '💥', name: 'Süpernova',
    rarity: 'nadir', cost: 85,
    effect: { type: 'total_words_played_chips', per_word: 1 },
    desc: 'Koşu boyunca kaç kelime oynadıysan +1 Taban Puan ekler.',
    bgGradient: 'from-yellow-500 via-orange-600 to-red-900', glowColor: 'rgba(234,88,12,0.5)'
  },
  FIBONACCI_JOKER: {
    id: 'FIBONACCI_JOKER', icon: '🌀', name: 'Fibonacci',
    rarity: 'nadir', cost: 80,
    effect: { type: 'common_letters_chips', letters: ['A','E','İ','K','L','M','R','S','T','N'], chips: 55 },
    desc: 'A,E,İ,K,L,M,R,S,T,N harflerini içeren kelimeler +55 Taban Puan.',
    bgGradient: 'from-teal-600 via-cyan-700 to-indigo-900', glowColor: 'rgba(20,184,166,0.5)'
  },
  LOYALTY_JOKER: {
    id: 'LOYALTY_JOKER', icon: '❤️', name: 'Sadakat',
    rarity: 'nadir', cost: 75,
    effect: { type: 'streak_letter_bonus', streak: 3, chips: 15 },
    desc: 'Aynı harfi 3 tur üst üste kullananınca o harf +15 Taban Puan kazanır.',
    bgGradient: 'from-rose-600 via-red-700 to-rose-950', glowColor: 'rgba(244,63,94,0.5)'
  },
  ARCHIVIST_JOKER: {
    id: 'ARCHIVIST_JOKER', icon: '🗂️', name: 'Arşivci',
    rarity: 'nadir', cost: 90,
    effect: { type: 'total_words_chips_x2' },
    desc: 'Bu koşuda toplam oynanan kelime sayısı × 2 = Taban Puan bonusu.',
    bgGradient: 'from-amber-700 via-yellow-800 to-amber-950', glowColor: 'rgba(217,119,6,0.5)'
  },
  TWIN_JOKER: {
    id: 'TWIN_JOKER', icon: '👯', name: 'İkiz',
    rarity: 'nadir', cost: 65,
    effect: { type: 'special_card_synergy_chips', per_special: 5 },
    desc: 'Her kullanılan özel kartta diğer özel kartlar +5 Puan kazanır.',
    bgGradient: 'from-purple-600 via-pink-700 to-rose-950', glowColor: 'rgba(192,38,211,0.5)'
  },
  FOOL_JOKER: {
    id: 'FOOL_JOKER', icon: '🎪', name: 'Soytarı',
    rarity: 'nadir', cost: 60,
    effect: { type: 'random_seal_each_turn' },
    desc: 'Her tur başında rastgele bir Mühür efekti (FOIL/HOLO/POLY) uygular.',
    bgGradient: 'from-yellow-600 via-orange-700 to-red-900', glowColor: 'rgba(245,158,11,0.5)'
  },
  SEER_JOKER: {
    id: 'SEER_JOKER', icon: '🔭', name: 'Kahin',
    rarity: 'nadir', cost: 70,
    effect: { type: 'boss_score_reduce_pct', value: 20 },
    desc: 'Bir sonraki Boss\'un skor hedefini %20 azaltır.',
    bgGradient: 'from-indigo-600 via-purple-700 to-violet-950', glowColor: 'rgba(124,58,237,0.5)'
  },

  // ══════════════════════════════════════════
  // 🟥 EFSANEVİ JOKERLER (8 adet) — Rare
  // ══════════════════════════════════════════

  JOKER_STENCIL: {
    id: 'JOKER_STENCIL', icon: '🖼️', name: 'Şablon',
    rarity: 'efsanevi', cost: 120,
    effect: { type: 'joker_slot_fill', slots: 5 },
    desc: 'Joker slotun kaç boş olursa olsun 5 Joker varmış gibi davranır.',
    bgGradient: 'from-slate-800 via-zinc-700 to-slate-950', glowColor: 'rgba(251,191,36,0.6)'
  },
  BARON_JOKER: {
    id: 'BARON_JOKER', icon: '👑', name: 'Baron',
    rarity: 'efsanevi', cost: 130,
    effect: { type: 'specific_letter_mult', letter: 'K', mult: 30 },
    desc: 'Eldeki her K harfi için +30 Çarpan ekler.',
    bgGradient: 'from-yellow-600 via-amber-700 to-yellow-950', glowColor: 'rgba(250,204,21,0.6)'
  },
  VAMPIRE_JOKER: {
    id: 'VAMPIRE_JOKER', icon: '🧛', name: 'Vampir',
    rarity: 'efsanevi', cost: 140,
    effect: { type: 'absorb_seal_mult', per_seal: 20 },
    desc: 'Oynanan her Mühürlü harf için o Mühür\'ü emer ve +20 Çarpan alır.',
    bgGradient: 'from-red-900 via-rose-800 to-slate-950', glowColor: 'rgba(239,68,68,0.6)'
  },
  CANIO_JOKER: {
    id: 'CANIO_JOKER', icon: '🎩', name: 'Canio',
    rarity: 'efsanevi', cost: 150,
    effect: { type: 'absorb_sold_joker' },
    desc: 'İlk Joker\'ini satınca o Joker\'in efekti kalıcı olarak Canio\'ya aktarılır.',
    bgGradient: 'from-slate-800 via-purple-900 to-black', glowColor: 'rgba(147,51,234,0.6)'
  },
  HOLOGRAM_JOKER: {
    id: 'HOLOGRAM_JOKER', icon: '💠', name: 'Hologram',
    rarity: 'efsanevi', cost: 125,
    effect: { type: 'per_card_added_chips', value: 10 },
    desc: 'Desteye her yeni harf eklenince kalıcı +10 Taban Puan kazanır.',
    bgGradient: 'from-cyan-600 via-blue-700 to-indigo-950', glowColor: 'rgba(6,182,212,0.6)'
  },
  GOLDEN_JOKER: {
    id: 'GOLDEN_JOKER', icon: '💰', name: 'Altın Joker',
    rarity: 'efsanevi', cost: 115,
    effect: { type: 'per_joker_gold', value: 5 },
    desc: 'Tur sonu elindeki her Joker için +5 Altın kazanırsın.',
    bgGradient: 'from-yellow-500 via-amber-600 to-yellow-900', glowColor: 'rgba(234,179,8,0.7)'
  },
  OBELISK_JOKER: {
    id: 'OBELISK_JOKER', icon: '🗿', name: 'Dikilitaş',
    rarity: 'efsanevi', cost: 135,
    effect: { type: 'non_dominant_letter_mult_stack', value: 1 },
    desc: 'En sık oynadığın harf dışındaki her kelimede +1 Çarpan birikir.',
    bgGradient: 'from-stone-700 via-zinc-800 to-neutral-950', glowColor: 'rgba(120,113,108,0.6)'
  },
  IDOL_JOKER: {
    id: 'IDOL_JOKER', icon: '🏺', name: 'Put',
    rarity: 'efsanevi', cost: 145,
    effect: { type: 'random_idol_letter_2x' },
    desc: 'Her bölgede rastgele 1 harf "idol" olur; o harfi içeren her kelime 2x puan.',
    bgGradient: 'from-amber-700 via-orange-800 to-red-950', glowColor: 'rgba(245,158,11,0.7)'
  },

  // ══════════════════════════════════════════
  // 🌟 EFSANE-ÖTESİ JOKERLER (5 adet) — Legendary
  // Yalnızca Obsidyen/Elmas Mühür'de %5 şansla çarşıda çıkar
  // ══════════════════════════════════════════

  SOUL_JOKER: {
    id: 'SOUL_JOKER', icon: '✨', name: 'Ruh',
    rarity: 'efsane_otesi', cost: 200,
    effect: { type: 'all_joker_chips_x2' },
    desc: 'Aktif tüm Jokerler\'in Taban Puan değerlerini 2x katar.',
    bgGradient: 'from-white/20 via-purple-400/20 to-indigo-900', glowColor: 'rgba(255,255,255,0.8)'
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
    effect: { type: 'star_points_to_mult' },
    desc: 'Bu koşuda kazandığın toplam Yıldız\'ı Çarpan olarak ekler.',
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
    rarity: 'efsane_otesi', cost: 250,
    effect: { type: 'joker_count_squared_chips' },
    desc: 'Aktif Joker sayısının karesi kadar Taban Puan ekler (3→9, 4→16, 5→25).',
    bgGradient: 'from-indigo-900 via-purple-900 to-blue-950', glowColor: 'rgba(99,102,241,0.8)'
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

export function createCard(letterOrSpecialKey, upgradeLevel = 0, infusedType = null, seal = null) {
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
      bgGradient: spec.bgGradient,
      infusedType: infusedType,
      seal: seal
    };
  }

  const upper = letterOrSpecialKey.toUpperCase();
  const def = LETTER_DEFINITIONS[upper] || { points: 1, rarity: 'normal', desc: 'Harf' };

  const basePoints = def.points;
  const currentPoints = basePoints + upgradeLevel * 2;

  return {
    id: `card_${nextCardId++}_${Date.now()}`,
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

export function createDeckFromLetterList(letterList = []) {
  return letterList.map(item => createCard(item));
}

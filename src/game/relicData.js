// Relic (Emanet) Definitions & Passive Effects for Kelime Destesi

export const RELICS = {
  UZUN_SOZ: {
    id: 'UZUN_SOZ',
    name: 'Uzun Söz Mührü',
    icon: '📜',
    cost: 55,
    desc: '5 harf ve üzerindeki kelimeler +25% ekstra puan kazandırır.',
    bgGradient: 'from-amber-700 to-yellow-900'
  },
  KISA_SOZ: {
    id: 'KISA_SOZ',
    name: 'Kısa Söz Tılsımı',
    icon: '⚡',
    cost: 45,
    desc: '3-4 harfli hızlı kelimeler +20% ekstra puan kazandırır.',
    bgGradient: 'from-sky-700 to-cyan-900'
  },
  MUREKKEP: {
    id: 'MUREKKEP',
    name: 'Sihirli Mürekkep',
    icon: '✒️',
    cost: 65,
    desc: 'Her kademedeki ilk kelime 2x puan kazandırır.',
    bgGradient: 'from-blue-700 to-indigo-900'
  },
  NADIR_MUHUR: {
    id: 'NADIR_MUHUR',
    name: 'Nadir Mühür',
    icon: '💎',
    cost: 75,
    desc: 'Ş, Ğ, Ç, Ö, Ü, Z harflerini içeren kelimeler +30% bonus puan verir.',
    bgGradient: 'from-purple-700 to-pink-900'
  },
  KESKIN_KALEM: {
    id: 'KESKIN_KALEM',
    name: 'Keskin Kalem',
    icon: '✏️',
    cost: 50,
    desc: 'Nadir ve Çok Nadir harfler +3 ekstra taban puan verir.',
    bgGradient: 'from-emerald-700 to-teal-900'
  },
  SERI_KATIP: {
    id: 'SERI_KATIP',
    name: 'Seri Kâtip',
    icon: '🔥',
    cost: 60,
    desc: 'Kombo çarpanı her başarılı kelimede +2 artar.',
    bgGradient: 'from-red-700 to-rose-900'
  },
  ALTIN_SOZLUK: {
    id: 'ALTIN_SOZLUK',
    name: 'Altın Sözlük',
    icon: '💰',
    cost: 70,
    desc: '5+ harfli her başarılı kelime +3 ekstra altın kazandırır.',
    bgGradient: 'from-yellow-600 to-amber-800'
  }
};

export const ALL_RELIC_KEYS = Object.keys(RELICS);


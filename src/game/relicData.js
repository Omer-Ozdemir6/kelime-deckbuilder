// Relic (Emanet) Definitions & Passive Effects for Kelime Destesi

export const RELICS = {
  ESKI_SOZLUK: {
    id: 'ESKI_SOZLUK',
    name: 'Eski Sözlük',
    icon: '📖',
    cost: 50,
    desc: '5 harf ve üzerindeki kelimeler +30% puan kazandırır.',
    bgGradient: 'from-amber-700 to-yellow-900'
  },
  MUREKKEP: {
    id: 'MUREKKEP',
    name: 'Sihirli Mürekkep',
    icon: '✒️',
    cost: 65,
    desc: 'Her kademedeki ilk kelime 2x puan kazandırır.',
    bgGradient: 'from-blue-700 to-indigo-900'
  },
  KESKIN_KALEM: {
    id: 'KESKIN_KALEM',
    name: 'Keskin Kalem',
    icon: '✏️',
    cost: 55,
    desc: 'Nadir ve Çok Nadir harfler +3 ekstra puan verir.',
    bgGradient: 'from-emerald-700 to-teal-900'
  },
  ESKI_DEFTER: {
    id: 'ESKI_DEFTER',
    name: 'Eski Defter',
    icon: '📓',
    cost: 70,
    desc: 'Her 5 geçerli kelimede destene 1 ücretsiz Joker ekler.',
    bgGradient: 'from-purple-700 to-pink-900'
  },
  SERI_KATIP: {
    id: 'SERI_KATIP',
    name: 'Seri Kâtip',
    icon: '⚡',
    cost: 60,
    desc: 'Kombo çarpanı her başarılı kelimede +2 artar.',
    bgGradient: 'from-red-700 to-rose-900'
  }
};

export const ALL_RELIC_KEYS = Object.keys(RELICS);

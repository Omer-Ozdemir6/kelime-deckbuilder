// Tayf / Hayalet Kartları Tanımları (Spectral Cards System)

export const SPECTRAL_CARDS = [
  {
    id: 'SPECTRAL_BLACK_HOLE',
    name: 'Kara Delik 🌌',
    icon: '🌌',
    cost: 35,
    rarity: 'efsane_otesi',
    desc: 'Tüm kelime seviyelerini (3, 4, 5, 6, 7+ harfli) aynı anda +1 yükseltir!',
    bgGradient: 'from-black via-purple-950 to-slate-950',
    type: 'BLACK_HOLE'
  },
  {
    id: 'SPECTRAL_SOUL',
    name: 'Ruh Kartı 👻',
    icon: '👻',
    cost: 40,
    rarity: 'efsane_otesi',
    desc: 'Oyundaki 5 Efsanevi Jokerdan birini anında çağırır!',
    bgGradient: 'from-indigo-900 via-purple-950 to-black',
    type: 'SOUL'
  },
  {
    id: 'SPECTRAL_CRYPTID',
    name: 'Kriptit 🔮',
    icon: '🔮',
    cost: 30,
    rarity: 'efsanevi',
    desc: 'Seçtiğiniz 1 harf taşının elinizde 2 ikiz kopyasını oluşturur.',
    bgGradient: 'from-blue-900 via-slate-900 to-indigo-950',
    type: 'CRYPTID'
  },
  {
    id: 'SPECTRAL_ECTOPLASM',
    name: 'Ektoplazma ⚡',
    icon: '⚡',
    cost: 30,
    rarity: 'efsanevi',
    desc: 'Rastgele 1 Pasif Jokere Negatif Efsun (+1 Joker Slotu) verir, ancak El Boyutunu -1 azaltır.',
    bgGradient: 'from-emerald-900 via-teal-950 to-slate-950',
    type: 'ECTOPLASM'
  },
  {
    id: 'SPECTRAL_AURA',
    name: 'Aura ✨',
    icon: '✨',
    cost: 25,
    rarity: 'nadir',
    desc: 'Elinizdeki rastgele 1 harfe Polikrom (x1.5 Çarpan) veya Altın Yaldız Mühür basar.',
    bgGradient: 'from-pink-900 via-rose-950 to-slate-950',
    type: 'AURA'
  },
  {
    id: 'SPECTRAL_ANKH',
    name: 'Ankh 🪞',
    icon: '🪞',
    cost: 35,
    rarity: 'efsanevi',
    desc: 'Rastgele 1 Pasif Jokerin kopyasını çıkarır, ancak diğer pasif jokerleri yok eder.',
    bgGradient: 'from-amber-900 via-yellow-950 to-slate-950',
    type: 'ANKH'
  }
];

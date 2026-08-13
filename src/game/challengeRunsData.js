// Balatro Tarzı 20 Özel Meydan Okuma Senaryosu (Preset Challenge Runs)

export const PRESET_CHALLENGE_RUNS = [
  {
    id: 'CHALLENGE_INFLATION',
    title: '💸 Enflasyon Fırtınası',
    icon: '📈',
    badgeClass: 'from-amber-600 to-rose-700 text-amber-100',
    desc: 'Dükkândan alınan her üründen sonra TÜM ürün fiyatları kalıcı olarak +$1 yükselir!',
    rules: { inflationPerBuy: 1 },
    starterGold: 30
  },
  {
    id: 'CHALLENGE_NO_SHOP',
    title: '🚫 Dükkânsız Yürüyüş',
    icon: '🏬',
    badgeClass: 'from-slate-700 to-slate-900 text-slate-200',
    desc: 'Dükkân tamamen kapalıdır! Kartlar ve jokerler sadece Paketlerden ve Etkinliklerden kazanılabilir.',
    rules: { noShop: true },
    starterGold: 50
  },
  {
    id: 'CHALLENGE_GOLDEN_NEEDLE',
    title: '🗡️ Bıçak Sırtı',
    icon: '🗡️',
    badgeClass: 'from-rose-600 to-red-800 text-rose-100',
    desc: 'Her mücadelede SADECE 1 HAMLE HAKKINIZ vardır! Tek kelimede baraj skoru yapmalısınız.',
    rules: { fixedHands: 1 },
    starterGold: 40
  },
  {
    id: 'CHALLENGE_LUXURY_TAX',
    title: '👑 Lüks Vergisi',
    icon: '👑',
    badgeClass: 'from-yellow-500 to-amber-700 text-yellow-100',
    desc: 'Elinizdeki her 15 Altın için el harf kapasiteniz -1 azalır. Zenginlik yük getirir!',
    rules: { luxuryTaxPerGold: 15 },
    starterGold: 60
  },
  {
    id: 'CHALLENGE_JOKER_CHAOS',
    title: '🃏 Joker Kaosu',
    icon: '🌀',
    badgeClass: 'from-purple-600 to-indigo-800 text-purple-100',
    desc: 'Oyun 5 Rastgele Pasif Joker ile başlar ancak dükkandan yeni joker alınamaz.',
    rules: { randomStarterJokers: 5, noJokerBuy: true },
    starterGold: 25
  },
  {
    id: 'CHALLENGE_GLASS_ONLY',
    title: '🥃 Cam Harf Saldırısı',
    icon: '🥃',
    badgeClass: 'from-cyan-500 to-blue-700 text-cyan-100',
    desc: 'Destenizdeki tüm harfler Cam Mühürlüdür! Devasa çarpan verir ancak %25 ihtimalle kırılır.',
    rules: { allGlassCards: true },
    starterGold: 35
  },
  {
    id: 'CHALLENGE_OMNISHIFT',
    title: '🔮 Gezegen Taşkını',
    icon: '🪐',
    badgeClass: 'from-indigo-600 to-purple-800 text-indigo-100',
    desc: 'Tüm kelime seviyeleri Seviye 5 ile başlar ancak hedef puanlar 2 kat daha yüksektir.',
    rules: { starterWordLevels: 5, doubleTargetScore: true },
    starterGold: 30
  },
  {
    id: 'CHALLENGE_CRUELTY',
    title: '💀 Acımasız Sınav',
    icon: '💀',
    badgeClass: 'from-red-700 to-black text-rose-200',
    desc: 'Iskarta hakkı YOKTUR! Can hakkı 1\'e düşürülmüştür.',
    rules: { zeroDiscards: true, maxLives: 1 },
    starterGold: 50
  }
];

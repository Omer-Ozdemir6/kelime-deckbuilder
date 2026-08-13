// Gezegen Taşları ve Kelime Kategorisi Seviye Yükseltme Tanımları (Planet Cards System)

export const PLANET_CARDS = [
  {
    id: 'PLANET_MERCURY',
    name: 'Merkür Taşı 🪐',
    targetLength: 3,
    targetLabel: '3 Harfli Kelimeler',
    baseChipsBonus: 10,
    baseMultBonus: 1,
    cost: 15,
    icon: '🪐',
    desc: '3 harfli kelimelerin seviyesini +1 artırır (+10 Taban Puan, +1 Çarpan).'
  },
  {
    id: 'PLANET_VENUS',
    name: 'Venüs Taşı 🌕',
    targetLength: 4,
    targetLabel: '4 Harfli Kelimeler',
    baseChipsBonus: 15,
    baseMultBonus: 2,
    cost: 18,
    icon: '🌕',
    desc: '4 harfli kelimelerin seviyesini +1 artırır (+15 Taban Puan, +2 Çarpan).'
  },
  {
    id: 'PLANET_EARTH',
    name: 'Dünya Taşı 🌍',
    targetLength: 5,
    targetLabel: '5 Harfli Kelimeler',
    baseChipsBonus: 20,
    baseMultBonus: 2,
    cost: 20,
    icon: '🌍',
    desc: '5 harfli kelimelerin seviyesini +1 artırır (+20 Taban Puan, +2 Çarpan).'
  },
  {
    id: 'PLANET_MARS',
    name: 'Mars Taşı 🔴',
    targetLength: 6,
    targetLabel: '6 Harfli Kelimeler',
    baseChipsBonus: 30,
    baseMultBonus: 3,
    cost: 25,
    icon: '🔴',
    desc: '6 harfli kelimelerin seviyesini +1 artırır (+30 Taban Puan, +3 Çarpan).'
  },
  {
    id: 'PLANET_JUPITER',
    name: 'Jüpiter Taşı 🟠',
    targetLength: 7,
    targetLabel: '7+ Harfli Kelimeler',
    baseChipsBonus: 40,
    baseMultBonus: 4,
    cost: 30,
    icon: '🟠',
    desc: '7 ve üzeri harfli kelimelerin seviyesini +1 artırır (+40 Taban Puan, +4 Çarpan).'
  }
];

export const INITIAL_WORD_LEVELS = {
  3: { level: 1, chips: 10, mult: 1 },
  4: { level: 1, chips: 20, mult: 2 },
  5: { level: 1, chips: 35, mult: 3 },
  6: { level: 1, chips: 50, mult: 4 },
  7: { level: 1, chips: 70, mult: 5 }
};

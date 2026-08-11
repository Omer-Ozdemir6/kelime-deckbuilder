/**
 * Procedural Roguelite Map & Dynamic Biome Generator for Kelime Destesi
 * Generates unique branching runs with random floor modifiers, biomes, and rewards.
 */

export const FLOOR_BIOMES = [
  {
    id: 'EMERALD_FOREST',
    name: 'Zümrüt Tapınağı',
    icon: '🌲',
    themeClass: 'from-[#06201b] via-slate-950 to-slate-950',
    accentColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/50',
    glowColor: 'rgba(16, 185, 129, 0.2)'
  },
  {
    id: 'CYAN_LIBRARY',
    name: 'Safir Kütüphanesi',
    icon: '🔮',
    themeClass: 'from-[#06182a] via-slate-950 to-slate-950',
    accentColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/50',
    glowColor: 'rgba(6, 182, 212, 0.2)'
  },
  {
    id: 'PURPLE_THEATRE',
    name: 'Efsunlu Amfitiyatro',
    icon: '🎭',
    themeClass: 'from-[#1c082b] via-slate-950 to-slate-950',
    accentColor: 'text-purple-400',
    borderColor: 'border-purple-500/50',
    glowColor: 'rgba(168, 85, 247, 0.2)'
  },
  {
    id: 'VOLCANO_ARENA',
    name: 'Yanardağ Arenası',
    icon: '🌋',
    themeClass: 'from-[#260e06] via-slate-950 to-slate-950',
    accentColor: 'text-amber-400',
    borderColor: 'border-amber-500/50',
    glowColor: 'rgba(245, 158, 11, 0.2)'
  },
  {
    id: 'COSMIC_PEAK',
    name: 'Kozmik Zirve',
    icon: '👑',
    themeClass: 'from-[#261f06] via-slate-950 to-slate-950',
    accentColor: 'text-yellow-400',
    borderColor: 'border-yellow-500/50',
    glowColor: 'rgba(234, 179, 8, 0.25)'
  }
];

export const FLOOR_MODIFIERS = [
  {
    id: 'FAST_THINK',
    name: 'Hızlı Düşün',
    icon: '⚡',
    desc: 'Tüm kelime puanlarına +%25 bonus!',
    scoreMultiplier: 1.25
  },
  {
    id: 'RARE_GEM',
    name: 'Mücevher Vadisi',
    icon: '💎',
    desc: 'Nadir harfler (Ş, Ğ, Ç, Ö, Ü, Z) +6 ekstra puan verir!',
    rareBonus: 6
  },
  {
    id: 'LONG_WORDS',
    name: 'Uzun Sözler Diyarı',
    icon: '📜',
    desc: '5+ harfli kelimeler ekstra +10 puan verir!',
    longWordBonus: 10
  },
  {
    id: 'GENEROUS_MERCHANT',
    name: 'Cömert Çarşı',
    icon: '🍷',
    desc: 'Bölüm sonu zafer altını +10 artar!',
    goldBonus: 10
  },
  {
    id: 'FIRE_COMBO',
    name: 'Ateşli Kombo',
    icon: '🔥',
    desc: 'Kombo seviyesi arttıkça puanlar ikiye katlanır!',
    comboMultiplierBonus: 1.5
  }
];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateRunMap() {
  const shuffledBiomes = [...FLOOR_BIOMES].sort(() => 0.5 - Math.random());
  const shuffledModifiers = [...FLOOR_MODIFIERS].sort(() => 0.5 - Math.random());

  const floors = [];
  const totalFloors = 7;

  for (let floorIdx = 0; floorIdx < totalFloors; floorIdx++) {
    const biome = shuffledBiomes[floorIdx % shuffledBiomes.length];
    const modifier = shuffledModifiers[floorIdx % shuffledModifiers.length];

    if (floorIdx === 0) {
      // Floor 0: Start Node
      floors.push([
        {
          id: 'node_f0_n0',
          floor: 0,
          stage: 1,
          branchIndex: 0,
          type: 'NORMAL',
          title: 'Giriş Kapısı',
          icon: biome.icon,
          biome,
          modifier,
          targetScore: 50,
          desc: 'Hedef 50 Puan',
          bonusObjective: { desc: 'En az 1 adet 4+ harfli kelime oyna', rewardGold: 10, targetLength: 4, count: 1 },
          completed: false
        }
      ]);
    } else if (floorIdx === totalFloors - 1) {
      // Floor 6: Boss Node
      const bossBiome = FLOOR_BIOMES[4]; // Cosmic Peak
      floors.push([
        {
          id: `node_f${floorIdx}_n0`,
          floor: floorIdx,
          stage: floorIdx + 1,
          branchIndex: 0,
          type: 'BOSS',
          title: 'BÖLGE BOSSU: SÖZCÜ SINAVI',
          icon: '👑',
          biome: bossBiome,
          modifier,
          targetScore: 380,
          desc: '8 Tur içinde 380 Puan yap! En az 4 harfli kelimeler kabul edilir!',
          bossRule: {
            id: 'BOSS_USTA',
            title: '👑 BOSS RULE: USTA SINAVI',
            desc: 'Sadece 4 harf ve üzerindeki kelimeler kabul edilir!',
            minWordLength: 4
          },
          completed: false
        }
      ]);
    } else {
      // Intermediate Floors: 2 Procedural Branches
      const isShopFloor = floorIdx === 3 || floorIdx === 5;
      const isEventFloor = floorIdx === 2;

      const branch1Type = isShopFloor ? 'SHOP' : isEventFloor ? 'EVENT' : (Math.random() > 0.5 ? 'SPECIAL_OBJECTIVE' : 'NORMAL');
      const branch2Type = isShopFloor ? 'EVENT' : isEventFloor ? 'TREASURE' : (Math.random() > 0.5 ? 'ELITE' : 'SHOP');

      const targetBase = 50 + floorIdx * 35 + Math.floor(Math.random() * 15);

      floors.push([
        {
          id: `node_f${floorIdx}_n0`,
          floor: floorIdx,
          stage: floorIdx + 1,
          branchIndex: 0,
          type: branch1Type,
          title: `Kat ${floorIdx + 1} - ${branch1Type === 'SHOP' ? 'Gezgin Çarşı' : branch1Type === 'EVENT' ? 'Gizemli Olay' : 'Kelime Sınavı'}`,
          icon: branch1Type === 'SHOP' ? '🏪' : branch1Type === 'EVENT' ? '❓' : '📜',
          biome,
          modifier,
          targetScore: targetBase,
          desc: `Hedef ${targetBase} Puan`,
          bonusObjective: branch1Type === 'SHOP' ? null : { desc: 'En az 2 adet 5+ harfli kelime oyna', rewardGold: 15, targetLength: 5, count: 2 },
          completed: false
        },
        {
          id: `node_f${floorIdx}_n1`,
          floor: floorIdx,
          stage: floorIdx + 1,
          branchIndex: 1,
          type: branch2Type,
          title: `Kat ${floorIdx + 1} - ${branch2Type === 'TREASURE' ? 'Hazine Mahzeni' : branch2Type === 'ELITE' ? 'Elit Sınav' : 'Seri Kombo'}`,
          icon: branch2Type === 'TREASURE' ? '💰' : branch2Type === 'ELITE' ? '👹' : '🔥',
          biome,
          modifier,
          targetScore: targetBase + 20,
          desc: `Hedef ${targetBase + 20} Puan`,
          bonusObjective: branch2Type === 'TREASURE' ? null : { desc: 'Kombo çarpanını 3x yap', rewardGold: 15, targetCombo: 3 },
          completed: false
        }
      ]);
    }
  }

  return floors;
}

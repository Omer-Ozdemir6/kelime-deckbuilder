/**
 * Dynamic Procedural Graph Map Generator for Kelime Destesi
 * Every run generates a 100% unique seed-based map topology!
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
    modifier: { id: 'FOREST_ZONE', name: 'Bol Hazine', icon: '💎', desc: 'Tüm sınavlar +10 Altın kazandırır!' }
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

export const SET_DEFINITIONS = [
  { setId: 1, name: 'BÖLGE 1: SAFİR KÜTÜPHANESİ', difficultyMultiplier: 1.0, bossRule: { title: '👑 BÖLGE 1 BOSSU: SÖZ USTASI', desc: 'En az 4 harfli kelimeler kabul edilir! Hedef: 250 Puan', minWordLength: 4 }, bossTargetScore: 250 },
  { setId: 2, name: 'BÖLGE 2: ALEVLİ VADİ', difficultyMultiplier: 1.25, bossRule: { title: '👑 BÖLGE 2 BOSSU: KIRIK ALFABE', desc: 'En az 4 harfli kelimeler! Hedef: 450 Puan', minWordLength: 4 }, bossTargetScore: 450 },
  { setId: 3, name: 'BÖLGE 3: ZÜMRÜT ORMANI', difficultyMultiplier: 1.45, bossRule: { title: '👑 BÖLGE 3 BOSSU: DAR SÖZLÜK', desc: 'En az 4 harfli kelimeler kabul edilir! Hedef: 700 Puan', minWordLength: 4 }, bossTargetScore: 700 },
  { setId: 4, name: 'BÖLGE 4: MOR TİYATRO', difficultyMultiplier: 1.70, bossRule: { title: '👑 BÖLGE 4 BOSSU: SESSİZLİK', desc: 'En az 4 harfli kelimeler kabul edilir! Hedef: 1000 Puan', minWordLength: 4 }, bossTargetScore: 1000 },
  { setId: 5, name: 'BÖLGE 5: GÖLGE KANYONU', difficultyMultiplier: 1.95, bossRule: { title: '👑 BÖLGE 5 BOSSU: HARF HIRS IZI', desc: 'En az 4 harfli kelimeler! Hedef: 1350 Puan', minWordLength: 4 }, bossTargetScore: 1350 },
  { setId: 6, name: 'BÖLGE 6: BUZUL TAPINAĞI', difficultyMultiplier: 2.25, bossRule: { title: '👑 BÖLGE 6 BOSSU: DONMUŞ KALEM', desc: 'En az 4 harfli kelimeler! Hedef: 1750 Puan', minWordLength: 4 }, bossTargetScore: 1750 },
  { setId: 7, name: 'BÖLGE 7: VOLKANİK ZİNDAN', difficultyMultiplier: 2.60, bossRule: { title: '👑 BÖLGE 7 BOSSU: KIYAMET ŞAİRİ', desc: 'En az 4 harfli kelimeler! Hedef: 2200 Puan', minWordLength: 4 }, bossTargetScore: 2200 },
  { setId: 8, name: 'BÖLGE 8: KOZMİK ZİRVE', difficultyMultiplier: 3.00, bossRule: { title: '👑 FİNAL BOSSU: KADİM KELİME MİMARI', desc: '8 Tur içinde 2800 Puan barajı geçilmeli!', minWordLength: 4 }, bossTargetScore: 2800 }
];

export function generateRunMap() {
  const floors = [];
  const floorsPerAnte = 9;
  const totalAntes = 4;
  const totalFloors = floorsPerAnte * totalAntes;

  const nodeTypePool = [
    { type: 'NORMAL', pathCategory: 'SAFE', weight: 25 },
    { type: 'SPECIAL_OBJECTIVE', pathCategory: 'SAFE', weight: 25 },
    { type: 'SHOP', pathCategory: 'BUILD', weight: 20 },
    { type: 'EVENT', pathCategory: 'MYSTERY', weight: 15 },
    { type: 'ELITE', pathCategory: 'RISK', weight: 10 },
    { type: 'TRIVIA', pathCategory: 'MYSTERY', weight: 5 } // 5% Rare Trivia
  ];

  const getRandomNodeType = () => {
    const rand = Math.random() * 100;
    let acc = 0;
    for (const item of nodeTypePool) {
      acc += item.weight;
      if (rand <= acc) return item;
    }
    return nodeTypePool[0];
  };

  const getTypeTitleIcon = (t) => {
    switch (t) {
      case 'SHOP': return { title: 'Gezgin Çarşı', icon: '🏪' };
      case 'EVENT': return { title: 'Gizemli Olay', icon: '❓' };
      case 'TRIVIA': return { title: '💡 BİLMECE SINAVI (NADİR)', icon: '💡' };
      case 'TREASURE': return { title: 'Hazine Mahzeni', icon: '💰' };
      case 'ELITE': return { title: 'Elit Sınav', icon: '⚔️' };
      case 'SPECIAL_OBJECTIVE': return { title: 'Özel Sınav', icon: '🎯' };
      default: return { title: 'Kelime Sınavı', icon: '📜' };
    }
  };

  for (let floorIdx = 0; floorIdx < totalFloors; floorIdx++) {
    const anteIdx = Math.floor(floorIdx / floorsPerAnte);
    const anteFloorIndex = floorIdx % floorsPerAnte;
    const anteDef = SET_DEFINITIONS[anteIdx] || SET_DEFINITIONS[0];
    const diffMult = anteDef.difficultyMultiplier || 1.0;
    const stageNumber = floorIdx + 1;
    const targetBase = Math.round((45 + floorIdx * 35 + Math.floor(Math.random() * 20)) * diffMult);

    if (anteFloorIndex === 0 && floorIdx === 0) {
      // Root Node
      const centerBiome = REGIONAL_BIOMES[2];
      floors.push([
        {
          id: 'node_f0_n0',
          floor: 0,
          stage: 1,
          colIndex: 2,
          type: 'NORMAL',
          pathCategory: 'SAFE',
          title: 'Giriş Kapısı',
          icon: centerBiome.icon,
          biome: centerBiome,
          modifier: centerBiome.modifier,
          targetScore: 45,
          desc: 'Hedef 45 Puan',
          bonusObjective: { desc: 'En az 1 adet 4+ harfli kelime oyna', rewardGold: 10, targetLength: 4, count: 1 },
          completed: false
        }
      ]);
    } else if (anteFloorIndex === 7) {
      // CAMP NODE
      const campBiome = REGIONAL_BIOMES[2];
      floors.push([
        {
          id: `node_f${floorIdx}_camp`,
          floor: floorIdx,
          stage: stageNumber,
          colIndex: 2,
          type: 'CAMP',
          pathCategory: 'BUILD',
          title: '🏕️ Son Kamp',
          icon: '🏕️',
          biome: campBiome,
          modifier: { id: 'PRE_BOSS_REST', name: 'Boss Öncesi Dinlenme', icon: '☕', desc: 'Desteni düzenle, dinlen veya kart yükselt!' },
          targetScore: 0,
          desc: 'Boss savaşı öncesi dinlen ve desteni düzenle!',
          completed: false
        }
      ]);
    } else if (anteFloorIndex === 8) {
      // ANTE BOSS NODE
      const bossBiome = REGIONAL_BIOMES[2];
      floors.push([
        {
          id: `node_f${floorIdx}_boss`,
          floor: floorIdx,
          stage: stageNumber,
          colIndex: 2,
          type: 'BOSS',
          pathCategory: 'RISK',
          title: anteDef.bossRule.title.replace('👑 ', ''),
          icon: '👑',
          biome: bossBiome,
          modifier: bossBiome.modifier,
          targetScore: anteDef.bossTargetScore,
          desc: anteDef.bossRule.desc,
          bossRule: anteDef.bossRule,
          maxHandsOverride: 8,
          completed: false
        }
      ]);
    } else {
      // Procedurally Generate Random Floor Columns (2 to 4 random columns from [0..4])
      const availableCols = [0, 1, 2, 3, 4];
      const count = anteFloorIndex === 3 ? 4 : (Math.floor(Math.random() * 3) + 2); // 2 to 4 cols
      
      // Shuffle & pick count columns
      const selectedCols = availableCols
        .sort(() => 0.5 - Math.random())
        .slice(0, count)
        .sort((a, b) => a - b);

      const floorNodes = [];
      selectedCols.forEach((colIdx, nodeIdx) => {
        const regionalBiome = REGIONAL_BIOMES[colIdx];
        const nCfg = getRandomNodeType();

        const tInfo = getTypeTitleIcon(nCfg.type);

        floorNodes.push({
          id: `node_f${floorIdx}_n${nodeIdx}`,
          floor: floorIdx,
          stage: stageNumber,
          colIndex: colIdx,
          type: nCfg.type,
          pathCategory: nCfg.pathCategory,
          title: tInfo.title,
          icon: tInfo.icon,
          biome: regionalBiome,
          modifier: regionalBiome.modifier,
          targetScore: targetBase + colIdx * 15,
          desc: `Hedef ${targetBase + colIdx * 15} Puan`,
          bonusObjective: nCfg.type === 'SHOP' || nCfg.type === 'TRIVIA' ? null : { desc: 'En az 2 adet 5+ harfli kelime oyna', rewardGold: 12 + colIdx * 2, targetLength: 5, count: 2 },
          completed: false
        });
      });

      floors.push(floorNodes);
    }
  }

  // Connect child array ids cleanly
  for (let f = 0; f < floors.length - 1; f++) {
    const parentFloor = floors[f];
    const childFloor = floors[f + 1];
    const childIds = childFloor.map(n => n.id);

    parentFloor.forEach(parentNode => {
      parentNode.children = childIds;
    });
  }

  return floors;
}

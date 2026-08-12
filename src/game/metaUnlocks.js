/**
 * Meta-Progression Unlock Conditions — Balatro tarzı başarım tabanlı açılım.
 * Yıldız puanı sistemi tamamen kaldırıldı; karakterler ve zorluk mühürleri
 * yalnızca run içinde kazanılan somut başarımlarla açılır.
 */
import { unlockHero, unlockStake, getUnlockedHeroes, getUnlockedStakes } from './codexManager';

// Kahraman açılım koşulları (id: DEFAULT_HEROES içindeki SPELLCASTER hariç)
const HERO_UNLOCK_CONDITIONS = [
  {
    id: 'WARRIOR',
    name: '⚔️ Söz Savaşçısı',
    icon: '⚔️',
    desc: "Bölge 2 Boss'unu Mağlup Et",
    check: (stats) => stats.maxKademeReached >= 3
  },
  {
    id: 'TRICKSTER',
    name: '🎭 Kurnaz Şair',
    icon: '🎭',
    desc: '1 Savaşta 15 Kelime Yap',
    check: (stats) => stats.maxWordsInBattle >= 15
  },
  {
    id: 'LEXICON_ARCHON',
    name: '👑 Kadim Mimar',
    icon: '👑',
    desc: "Bölge 4 Final Boss'unu Mağlup Et",
    check: (stats) => stats.maxKademeReached >= 5
  }
];

// Zorluk mührü zinciri — her mühür bir öncekinde belli bir bölgeyi geçince açılır
const STAKE_UNLOCK_CHAIN = [
  { id: 'GREEN_STAKE', name: 'Yeşil Mühür', icon: '🟢', requiresStake: 'RED_STAKE', requiresKademe: 3, desc: "Kırmızı Mühür'de Bölge 2'yi geç" },
  { id: 'BLACK_STAKE', name: 'Siyah Mühür', icon: '⚫', requiresStake: 'GREEN_STAKE', requiresKademe: 4, desc: "Yeşil Mühür'de Bölge 3'ü geç" },
  { id: 'BLUE_STAKE', name: 'Mavi Mühür', icon: '🔵', requiresStake: 'BLACK_STAKE', requiresKademe: 5, desc: "Siyah Mühür'de Ante 4'ü bitir" },
  { id: 'PURPLE_STAKE', name: 'Mor Mühür', icon: '🟣', requiresStake: 'BLUE_STAKE', requiresKademe: 5, desc: "Mavi Mühür'de Ante 4 Boss'u mağlup et" },
  { id: 'ORANGE_STAKE', name: 'Turuncu Mühür', icon: '🟠', requiresStake: 'PURPLE_STAKE', requiresKademe: 5, desc: "Mor Mühür'de tam zafer kazan" },
  { id: 'GOLD_STAKE', name: 'Altın Mühür', icon: '🟡', requiresStake: 'ORANGE_STAKE', requiresKademe: 5, desc: "Turuncu Mühür'de tam zafer kazan" },
  { id: 'OBSIDIAN_STAKE', name: 'Obsidyen Mühür', icon: '🖤', requiresStake: 'GOLD_STAKE', requiresKademe: 5, desc: "Altın Mühür'de tam zafer kazan" },
  { id: 'DIAMOND_STAKE', name: 'Elmas Mühür', icon: '💎', requiresStake: 'OBSIDIAN_STAKE', requiresKademe: 5, desc: "Obsidyen Mühür'de tam zafer kazan" }
];

/**
 * Bir run bittiğinde (Game Over veya Zafer) çağrılır.
 * @param {{ heroId: string, stakeId: string, maxKademeReached: number, maxWordsInBattle: number }} stats
 * @returns {Array} Bu run'da yeni açılan kahraman/mühürlerin listesi
 */
export function checkMetaUnlocks(stats) {
  const unlockedHeroes = getUnlockedHeroes();
  const unlockedStakes = getUnlockedStakes();
  const newlyUnlocked = [];

  HERO_UNLOCK_CONDITIONS.forEach((cond) => {
    if (!unlockedHeroes.has(cond.id) && cond.check(stats)) {
      unlockHero(cond.id);
      newlyUnlocked.push({ type: 'HERO', id: cond.id, name: cond.name, icon: cond.icon, desc: cond.desc });
    }
  });

  STAKE_UNLOCK_CHAIN.forEach((cond) => {
    if (
      !unlockedStakes.has(cond.id) &&
      stats.stakeId === cond.requiresStake &&
      stats.maxKademeReached >= cond.requiresKademe
    ) {
      unlockStake(cond.id);
      newlyUnlocked.push({ type: 'STAKE', id: cond.id, name: cond.name, icon: cond.icon, desc: cond.desc });
    }
  });

  return newlyUnlocked;
}

/**
 * Progressive Codex Discovery & Achievement Unlock System
 */

const STORAGE_KEY = 'kd_discovered_codex_v1';
const HERO_STORAGE_KEY = 'kd_unlocked_heroes_v1';
const STAKE_STORAGE_KEY = 'kd_unlocked_stakes_v1';

// Default unlocked items for brand new players
const DEFAULT_DISCOVERIES = [
  'A', 'B', 'C', 'D', 'E', 'K', 'L', 'M', 'N', 'O', 'R', 'S', 'T', 'Y',
  'BIOME_FROZEN'
];

const DEFAULT_HEROES = ['SPELLCASTER'];
// All 10 stakes (White & Red default unlocked, rest earned through progression)
const DEFAULT_STAKES = ['WHITE_STAKE', 'RED_STAKE'];
const ALL_STAKE_IDS = [
  'WHITE_STAKE', 'RED_STAKE', 'GREEN_STAKE', 'BLACK_STAKE',
  'BLUE_STAKE', 'PURPLE_STAKE', 'ORANGE_STAKE', 'GOLD_STAKE',
  'OBSIDIAN_STAKE', 'DIAMOND_STAKE'
];

export function getDiscoveredCodexItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DISCOVERIES));
      return new Set(DEFAULT_DISCOVERIES);
    }
    return new Set(JSON.parse(raw));
  } catch (e) {
    return new Set(DEFAULT_DISCOVERIES);
  }
}

export function discoverCodexItem(itemKey) {
  if (!itemKey) return;
  try {
    const current = getDiscoveredCodexItems();
    if (!current.has(itemKey)) {
      current.add(itemKey);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(current)));
    }
  } catch (e) {}
}

export function isCodexItemDiscovered(itemKey) {
  const current = getDiscoveredCodexItems();
  return current.has(itemKey);
}

// Hero Character Unlocks
export function getUnlockedHeroes() {
  try {
    const raw = localStorage.getItem(HERO_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(HERO_STORAGE_KEY, JSON.stringify(DEFAULT_HEROES));
      return new Set(DEFAULT_HEROES);
    }
    return new Set(JSON.parse(raw));
  } catch (e) {
    return new Set(DEFAULT_HEROES);
  }
}

export function unlockHero(heroId) {
  try {
    const set = getUnlockedHeroes();
    if (!set.has(heroId)) {
      set.add(heroId);
      localStorage.setItem(HERO_STORAGE_KEY, JSON.stringify(Array.from(set)));
    }
  } catch (e) {}
}

// Stake Difficulty Unlocks
export function getUnlockedStakes() {
  try {
    const raw = localStorage.getItem(STAKE_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STAKE_STORAGE_KEY, JSON.stringify(DEFAULT_STAKES));
      return new Set(DEFAULT_STAKES);
    }
    return new Set(JSON.parse(raw));
  } catch (e) {
    return new Set(DEFAULT_STAKES);
  }
}

export function unlockStake(stakeId) {
  try {
    const set = getUnlockedStakes();
    if (!set.has(stakeId)) {
      set.add(stakeId);
      localStorage.setItem(STAKE_STORAGE_KEY, JSON.stringify(Array.from(set)));
    }
  } catch (e) {}
}

/**
 * Achievements Registry & Meta-Unlock Progression Engine
 * Unlocked achievements permanently add new Jokers, Seals, and Vouchers to the Shop Item Pool!
 */

export const ACHIEVEMENTS = [
  {
    id: 'ACH_FIRST_7_LETTER',
    title: 'Usta Yazar',
    secretDesc: '??? (Gizli Başarım)',
    unlockedDesc: 'Tam 7 harfli uzun bir kelime oluştur.',
    rewardType: 'JOKER',
    rewardName: 'Ayna Kartı 🪞',
    rewardDesc: 'Dükkân havuzuna Ayna Kartı eklendi!',
    check: (stats) => stats.maxWordLength >= 7
  },
  {
    id: 'ACH_COMBO_5',
    title: 'Ateş Fırtınası',
    secretDesc: '??? (Gizli Başarım)',
    unlockedDesc: 'Kombo Çarpanında ×5 Seviyesine ulaş.',
    rewardType: 'SEAL',
    rewardName: 'Alevli Mühür 🔥',
    rewardDesc: 'Dükkân havuzuna Alevli Mühür eklendi!',
    check: (stats) => stats.maxCombo >= 5
  },
  {
    id: 'ACH_COMBO_8',
    title: 'Kozmik Supernova',
    secretDesc: '??? (Gizli Başarım)',
    unlockedDesc: 'Kombo Çarpanında ×8 Seviyesine ulaş.',
    rewardType: 'SEAL',
    rewardName: 'Süpernova Mührü 🌌',
    rewardDesc: 'Dükkân havuzuna Süpernova Mührü eklendi!',
    check: (stats) => stats.maxCombo >= 8
  },
  {
    id: 'ACH_GOLD_100',
    title: 'Altın Avcısı',
    secretDesc: '??? (Gizli Başarım)',
    unlockedDesc: 'Toplam 100 Altın biriktir.',
    rewardType: 'JOKER',
    rewardName: 'Altın Harf Taş 💰',
    rewardDesc: 'Dükkân havuzuna Altın Harf Taş eklendi!',
    check: (stats) => stats.totalGoldEarned >= 100
  },
  {
    id: 'ACH_STAGE_5',
    title: 'Akademi Mezunu',
    secretDesc: '??? (Gizli Başarım)',
    unlockedDesc: 'Kademe 5 zaferine ulaş.',
    rewardType: 'VOUCHER',
    rewardName: 'Çarşı İndirimi 📜',
    rewardDesc: 'Dükkân havuzuna Çarşı İndirimi Efsunu eklendi!',
    check: (stats) => stats.maxStage >= 5
  },
  {
    id: 'ACH_SINGLE_WORD_50P',
    title: 'Büyük Şair',
    secretDesc: '??? (Gizli Başarım)',
    unlockedDesc: 'Tek bir kelimeden 50+ puan kazan.',
    rewardType: 'JOKER',
    rewardName: 'Kül Kartı 🔥',
    rewardDesc: 'Dükkân havuzuna Kül Kartı eklendi!',
    check: (stats) => stats.maxSingleWordScore >= 50
  },
  {
    id: 'ACH_CHALLENGE_WIN',
    title: 'Zamana Karşı Şampiyon',
    secretDesc: '??? (Gizli Başarım)',
    unlockedDesc: 'Süreli Harf Challenge modunda 10+ puan yap.',
    rewardType: 'VOUCHER',
    rewardName: 'Derin Deste Efsunu 📜',
    rewardDesc: 'Dükkân havuzuna Derin Deste Efsunu eklendi!',
    check: (stats) => stats.challengeScore >= 10
  },
  {
    id: 'ACH_TOTAL_WORDS_20',
    title: 'Kelime Dağarcığı',
    secretDesc: '??? (Gizli Başarım)',
    unlockedDesc: 'Bir run boyunca 20+ geçerli kelime yaz.',
    rewardType: 'SEAL',
    rewardName: 'Zümrüt Mühür 💎',
    rewardDesc: 'Dükkân havuzuna Zümrüt Mühür eklendi!',
    check: (stats) => stats.totalWordsPlayed >= 20
  }
];

const STORAGE_KEY = 'kelime_deckbuilder_achievements_v1';

export function getUnlockedAchievementIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveUnlockedAchievementIds(unlockedIds) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(unlockedIds));
  } catch (e) {}
}

export function checkNewAchievements(currentRunStats) {
  const existingUnlocked = getUnlockedAchievementIds();
  const newlyUnlocked = [];

  ACHIEVEMENTS.forEach((ach) => {
    if (!existingUnlocked.includes(ach.id)) {
      if (ach.check(currentRunStats)) {
        newlyUnlocked.push(ach);
      }
    }
  });

  if (newlyUnlocked.length > 0) {
    const updated = [...existingUnlocked, ...newlyUnlocked.map(a => a.id)];
    saveUnlockedAchievementIds(updated);
  }

  return newlyUnlocked;
}

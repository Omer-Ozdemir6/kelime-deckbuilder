/**
 * Achievements Registry & Meta-Unlock Progression Engine
 * Unlocked achievements permanently add new Jokers, Seals, and Vouchers to the Shop Item Pool!
 */

export const ACHIEVEMENTS = [
  {
    id: 'ACH_FIRST_7_LETTER',
    title: 'Usta Yazar',
    secretDesc: '??? (Gizli Başarım)',
    unlockedDesc: 'Tam 8+ harfli devasa bir kelime oluştur.',
    rewardType: 'JOKER',
    rewardName: 'Ayna Kartı 🪞',
    rewardDesc: 'Dükkân havuzuna Ayna Kartı eklendi!',
    check: (stats) => (stats.maxWordLength || 0) >= 8
  },
  {
    id: 'ACH_COMBO_5',
    title: 'Ateş Fırtınası',
    secretDesc: '??? (Gizli Başarım)',
    unlockedDesc: 'Kombo Çarpanında ×6 Seviyesine ulaş.',
    rewardType: 'SEAL',
    rewardName: 'Alevli Mühür 🔥',
    rewardDesc: 'Dükkân havuzuna Alevli Mühür eklendi!',
    check: (stats) => (stats.maxCombo || 0) >= 6
  },
  {
    id: 'ACH_COMBO_8',
    title: 'Kozmik Supernova',
    secretDesc: '??? (Gizli Başarım)',
    unlockedDesc: 'Kombo Çarpanında ×10 Seviyesine ulaş.',
    rewardType: 'SEAL',
    rewardName: 'Süpernova Mührü 🌌',
    rewardDesc: 'Dükkân havuzuna Süpernova Mührü eklendi!',
    check: (stats) => (stats.maxCombo || 0) >= 10
  },
  {
    id: 'ACH_GOLD_100',
    title: 'Altın Avcısı',
    secretDesc: '??? (Gizli Başarım)',
    unlockedDesc: 'Toplam 250+ Altın biriktir.',
    rewardType: 'JOKER',
    rewardName: 'Altın Harf Taş 💰',
    rewardDesc: 'Dükkân havuzuna Altın Harf Taş eklendi!',
    check: (stats) => (stats.totalGoldEarned || 0) >= 250
  },
  {
    id: 'ACH_STAGE_5',
    title: 'Akademi Mezunu',
    secretDesc: '??? (Gizli Başarım)',
    unlockedDesc: 'Kademe 6 zaferine ulaş.',
    rewardType: 'VOUCHER',
    rewardName: 'Çarşı İndirimi 📜',
    rewardDesc: 'Dükkân havuzuna Çarşı İndirimi Efsunu eklendi!',
    check: (stats) => (stats.maxStage || 1) >= 6
  },
  {
    id: 'ACH_SINGLE_WORD_50P',
    title: 'Büyük Şair',
    secretDesc: '??? (Gizli Başarım)',
    unlockedDesc: 'Tek bir kelimeden 120+ puan kazan.',
    rewardType: 'JOKER',
    rewardName: 'Kül Kartı 🔥',
    rewardDesc: 'Dükkân havuzuna Kül Kartı eklendi!',
    check: (stats) => (stats.maxSingleWordScore || 0) >= 120
  },
  {
    id: 'ACH_CHALLENGE_WIN',
    title: 'Zamana Karşı Şampiyon',
    secretDesc: '??? (Gizli Başarım)',
    unlockedDesc: 'Süreli Harf Challenge modunda 25+ puan yap.',
    rewardType: 'VOUCHER',
    rewardName: 'Derin Deste Efsunu 📜',
    rewardDesc: 'Dükkân havuzuna Derin Deste Efsunu eklendi!',
    check: (stats) => (stats.challengeScore || 0) >= 25
  },
  {
    id: 'ACH_TOTAL_WORDS_20',
    title: 'Kelime Dağarcığı',
    secretDesc: '??? (Gizli Başarım)',
    unlockedDesc: 'Bir run boyunca 50+ geçerli kelime yaz.',
    rewardType: 'SEAL',
    rewardName: 'Zümrüt Mühür 💎',
    rewardDesc: 'Dükkân havuzuna Zümrüt Mühür eklendi!',
    check: (stats) => (stats.totalWordsPlayed || 0) >= 50
  },
  {
    id: 'ACH_TRIVIA_MASTER',
    title: 'Bilmece Dâhisi',
    secretDesc: '??? (Gizli Başarım)',
    unlockedDesc: 'Bilmece Sınavında 5 soruyu da doğru bil.',
    rewardType: 'JOKER',
    rewardName: 'Efsanevi Mucize Jokeri ✨',
    rewardDesc: 'Dükkân havuzuna Mucize Jokeri eklendi!',
    check: (stats) => (stats.triviaWins || 0) >= 5
  },
  {
    id: 'ACH_JOKER_COLLECTOR',
    title: 'Joker Koleksiyoncusu',
    secretDesc: '??? (Gizli Başarım)',
    unlockedDesc: 'Üst bardaki 5 Pasif Joker slotunu da doldur.',
    rewardType: 'VOUCHER',
    rewardName: 'Süper Çarşı Efsunu 📜',
    rewardDesc: 'Dükkân havuzuna Süper Çarşı Efsunu eklendi!',
    check: (stats) => (stats.activeJokersCount || 0) >= 5
  },
  {
    id: 'ACH_SINGLE_WORD_150P',
    title: 'Efsanevi Ozan',
    secretDesc: '??? (Gizli Başarım)',
    unlockedDesc: 'Tek bir kelimeden 350+ puan kazan.',
    rewardType: 'JOKER',
    rewardName: 'Süpernova Taş 💥',
    rewardDesc: 'Dükkân havuzuna Süpernova Taş eklendi!',
    check: (stats) => (stats.maxSingleWordScore || 0) >= 350
  },
  {
    id: 'ACH_BOSS_SLAYER',
    title: 'Ejderha Katili',
    secretDesc: '??? (Gizli Başarım)',
    unlockedDesc: 'Kademe 10 Final Boss zaferine ulaş.',
    rewardType: 'HERO',
    rewardName: 'Efsanevi Kahraman 👑',
    rewardDesc: 'Efsanevi Kahraman karakter kilitleri açıldı!',
    check: (stats) => (stats.maxStage || 1) >= 10
  },
  {
    id: 'ACH_1M_WORD',
    title: '100.000 Skor Barajı 🌌',
    secretDesc: '??? (Gizli Balatro Başarımı)',
    unlockedDesc: 'Tek kelimede 100.000+ skor yap.',
    rewardType: 'JOKER',
    rewardName: 'Kozmik Joker 🌠',
    rewardDesc: 'Kozmik Joker dükkân havuzuna eklendi!',
    check: (stats) => (stats.maxSingleWordScore || 0) >= 100000
  },
  {
    id: 'ACH_GLASS_BREAKER',
    title: 'Cam Ustası 🥃',
    secretDesc: '??? (Gizli Başarım)',
    unlockedDesc: 'Tek bir kelimede 600+ skor yap.',
    rewardType: 'SEAL',
    rewardName: 'Cam Mühür 🥃',
    rewardDesc: 'Dükkân havuzuna Cam Mühür eklendi!',
    check: (stats) => (stats.maxSingleWordScore || 0) >= 600
  },
  {
    id: 'ACH_ENDLESS_12',
    title: 'Sonsuz Mod Fatihi ♾️',
    secretDesc: '??? (Gizli Balatro Başarımı)',
    unlockedDesc: 'Sonsuz Modda Kademe 15 barajına ulaş.',
    rewardType: 'VOUCHER',
    rewardName: 'Sonsuz Efsun 📜',
    rewardDesc: 'Dükkân havuzuna Sonsuz Efsun eklendi!',
    check: (stats) => (stats.maxStage || 1) >= 15
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

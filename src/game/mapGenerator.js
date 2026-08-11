// Branching Roguelite Map Generator for Kelime Destesi Runs

export function generateRunMap() {
  const floors = [
    // Floor 0 (Start)
    [
      {
        id: 'node_f0_n0',
        floor: 0,
        stage: 1,
        branchIndex: 0,
        type: 'NORMAL',
        title: 'Bölüm 1 - Giriş',
        icon: '🟢',
        targetScore: 50,
        desc: 'Hedef 50 Puan (Temel Giriş Sınavı)',
        bonusObjective: { desc: 'En az 1 adet 4+ harfli kelime oyna', rewardGold: 10, targetLength: 4, count: 1 },
        nextNodeIds: ['node_f1_n0', 'node_f1_n1'],
        completed: false
      }
    ],

    // Floor 1 (Stage 2 - Branch: Long Word vs Combo)
    [
      {
        id: 'node_f1_n0',
        floor: 1,
        stage: 2,
        branchIndex: 0,
        type: 'SPECIAL_OBJECTIVE',
        title: 'Bölüm 2 - Uzun Sözler',
        icon: '📜',
        targetScore: 80,
        objectiveType: 'LONG_WORDS',
        desc: 'Hedef 80 Puan (5+ harfli kelimeler bonus verir)',
        bonusObjective: { desc: 'En az 2 adet 5+ harfli kelime oyna', rewardGold: 15, targetLength: 5, count: 2 },
        nextNodeIds: ['node_f2_n0', 'node_f2_n1'],
        completed: false
      },
      {
        id: 'node_f1_n1',
        floor: 1,
        stage: 2,
        branchIndex: 1,
        type: 'SPECIAL_OBJECTIVE',
        title: 'Bölüm 2 - Seri Kombo',
        icon: '🔥',
        targetScore: 75,
        objectiveType: 'COMBO_TARGET',
        desc: 'Hedef 75 Puan (Kombo çarpanını yüksek tut)',
        bonusObjective: { desc: 'Kombo çarpanını 3x yap', rewardGold: 12, targetCombo: 3 },
        nextNodeIds: ['node_f2_n0', 'node_f2_n1'],
        completed: false
      }
    ],

    // Floor 2 (Stage 3 - Branch: Event vs Treasure)
    [
      {
        id: 'node_f2_n0',
        floor: 2,
        stage: 3,
        branchIndex: 0,
        type: 'EVENT',
        title: 'Gizemli Kütüphane',
        icon: '❓',
        desc: 'Eski bir kütüphanede ilginç seçimler yap.',
        nextNodeIds: ['node_f3_n0', 'node_f3_n1'],
        completed: false
      },
      {
        id: 'node_f2_n1',
        floor: 2,
        stage: 3,
        branchIndex: 1,
        type: 'TREASURE',
        title: 'Hazinedar Mahzeni',
        icon: '💰',
        desc: 'Savaş yok! Direkt 40 Altın ve kart hediyesi kazan.',
        nextNodeIds: ['node_f3_n0', 'node_f3_n1'],
        completed: false
      }
    ],

    // Floor 3 (Stage 4 - Branch: Shop vs Rare Letters)
    [
      {
        id: 'node_f3_n0',
        floor: 3,
        stage: 4,
        branchIndex: 0,
        type: 'SHOP',
        title: 'Gezgin Çarşı',
        icon: '🏪',
        desc: 'Kart satın al, harf geliştir, deste incelt.',
        nextNodeIds: ['node_f4_n0', 'node_f4_n1'],
        completed: false
      },
      {
        id: 'node_f3_n1',
        floor: 3,
        stage: 4,
        branchIndex: 1,
        type: 'NORMAL',
        title: 'Bölüm 4 - Nadir Harfler',
        icon: '💎',
        targetScore: 130,
        desc: 'Hedef 130 Puan (Ş, Ğ, Ç, Z harflerine ekstra puan)',
        bonusObjective: { desc: 'Nadir harfli (Ş,Ğ,Ç,Ö,Ü,Z) kelime oyna', rewardGold: 20, requireRare: true },
        nextNodeIds: ['node_f4_n0', 'node_f4_n1'],
        completed: false
      }
    ],

    // Floor 4 (Stage 5 - Branch: Elite vs Fast Challenge)
    [
      {
        id: 'node_f4_n0',
        floor: 4,
        stage: 5,
        branchIndex: 0,
        type: 'ELITE',
        title: 'Bölüm 5 - Elit Kelimeci',
        icon: '👹',
        targetScore: 220,
        desc: 'Zorlu Hedef: 220 Puan (Nadir Emanet Ödülü)',
        bonusObjective: { desc: 'En az 1 adet 6+ harfli usta kelime oyna', rewardGold: 25, targetLength: 6, count: 1 },
        nextNodeIds: ['node_f5_n0', 'node_f5_n1'],
        completed: false
      },
      {
        id: 'node_f4_n1',
        floor: 4,
        stage: 5,
        branchIndex: 1,
        type: 'SPECIAL_OBJECTIVE',
        title: 'Bölüm 5 - Hızlı Sınav',
        icon: '⚡',
        targetScore: 160,
        desc: 'Hedef 160 Puan (4 Tur içinde başarmalısın!)',
        maxHandsOverride: 4,
        bonusObjective: { desc: 'Kalan son turdan önce tamamla', rewardGold: 15 },
        nextNodeIds: ['node_f5_n0', 'node_f5_n1'],
        completed: false
      }
    ],

    // Floor 5 (Stage 6 - Branch: Pre-Boss Shop vs Event)
    [
      {
        id: 'node_f5_n0',
        floor: 5,
        stage: 6,
        branchIndex: 0,
        type: 'SHOP',
        title: 'Boss Öncesi Çarşı',
        icon: '🏪',
        desc: 'Büyük Boss sınavı öncesi son hazırlıklar.',
        nextNodeIds: ['node_f6_n0'],
        completed: false
      },
      {
        id: 'node_f5_n1',
        floor: 5,
        stage: 6,
        branchIndex: 1,
        type: 'EVENT',
        title: 'Kadim Anlaşma Kulesi',
        icon: '❓',
        desc: 'Boss öncesi büyük riskli seçim teklifleri.',
        nextNodeIds: ['node_f6_n0'],
        completed: false
      }
    ],

    // Floor 6 (Stage 7 - Boss Floor 👑)
    [
      {
        id: 'node_f6_n0',
        floor: 6,
        stage: 7,
        branchIndex: 0,
        type: 'BOSS',
        title: 'BÖLGE BOSSU: SÖZCÜ SINAVI',
        icon: '👑',
        targetScore: 380,
        desc: '8 Tur içinde 380 Puan yap! Sadece 4+ harfli kelimeler kabul edilir!',
        bossRule: {
          id: 'BOSS_USTA',
          title: '👑 BOSS RULE: USTA SINAVI',
          desc: 'Sadece 4 harf ve üzerindeki kelimeler kabul edilir!',
          minWordLength: 4
        },
        nextNodeIds: [],
        completed: false
      }
    ]
  ];

  return floors;
}


// Branching Map Generator for Kelime Destesi Runs

export function generateRunMap() {
  const nodes = [
    {
      id: 'node_1',
      stage: 1,
      type: 'NORMAL',
      title: 'Bölüm 1 - Başlangıç',
      icon: '🟢',
      targetScore: 50,
      desc: 'Hedef 50 Puan',
      completed: false
    },
    {
      id: 'node_2',
      stage: 2,
      type: 'SPECIAL_OBJECTIVE',
      title: 'Bölüm 2 - Uzun Kelimeler',
      icon: '🔵',
      targetScore: 80,
      objectiveType: 'LONG_WORDS',
      desc: 'En az 5 harfli 2 kelime oluştur!',
      completed: false
    },
    {
      id: 'node_3',
      stage: 3,
      type: 'EVENT',
      title: 'Gizemli Sözlük Etkinliği',
      icon: '🟣',
      desc: 'Eski bir kütüphanede ilginç seçimler yap.',
      completed: false
    },
    {
      id: 'node_4',
      stage: 4,
      type: 'SHOP',
      title: 'Gezgin Tüccar Dükkânı',
      icon: '🟡',
      desc: 'Kart satın al, perk geliştir, kart sil.',
      completed: false
    },
    {
      id: 'node_5',
      stage: 5,
      type: 'ELITE',
      title: 'Bölüm 5 - Elit Meydan Okuma',
      icon: '🔴',
      targetScore: 200,
      desc: 'Yüksek Hedef: 200 Puan (Nadir Ödüller)',
      completed: false
    },
    {
      id: 'node_6',
      stage: 6,
      type: 'SPECIAL_OBJECTIVE',
      title: 'Bölüm 6 - Seri Kombo',
      icon: '🔵',
      targetScore: 250,
      objectiveType: 'COMBO_TARGET',
      desc: 'Kombo çarpanını 3x seviyesine çıkar!',
      completed: false
    },
    {
      id: 'node_7',
      stage: 7,
      type: 'EVENT',
      title: 'Sözlük Ustası Karşılaşması',
      icon: '🟣',
      desc: 'Riskli veya ödüllü bir anlaşma teklifi.',
      completed: false
    },
    {
      id: 'node_8',
      stage: 8,
      type: 'SHOP',
      title: 'Boss Öncesi Çarşı',
      icon: '🟡',
      desc: 'Boss sınavından önce son hazırlıklar.',
      completed: false
    },
    {
      id: 'node_9',
      stage: 9,
      type: 'BOSS',
      title: 'Bölge Bossu - Kelime Sınavı',
      icon: '👑',
      targetScore: 400,
      bossType: 'BOSS_SOZCU',
      desc: '8 Tur içinde 400 Puan yap ve bölgeyi tamamla!',
      completed: false
    }
  ];

  return nodes;
}

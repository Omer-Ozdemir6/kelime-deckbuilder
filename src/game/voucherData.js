/**
 * Balatro-style Run Vouchers (Permanent Shop & Run Upgrades for Kelime Destesi)
 * 1 Voucher appears in the Shop per Ante / Kademe ($10 cost)
 */

export const SHOP_VOUCHERS = [
  {
    id: 'VOUCHER_OVERPRINT',
    name: '📜 Fazla Baskı Kuponu',
    icon: '📜',
    cost: 10,
    desc: 'Tüm mücadelelerde tur başı +1 Hamle (El) hakkı sağlar.',
    effect: { type: 'ADD_HANDS', amount: 1 }
  },
  {
    id: 'VOUCHER_RECYCLE',
    name: '🔄 Geri Dönüşüm Kuponu',
    icon: '🔄',
    cost: 10,
    desc: 'Tüm mücadelelerde tur başı +1 Harf Yenileme (Iskarta) hakkı ekler.',
    effect: { type: 'ADD_DISCARDS', amount: 1 }
  },
  {
    id: 'VOUCHER_GRABBER',
    name: '✋ Geniş El Kuponu',
    icon: '✋',
    cost: 10,
    desc: 'Eldeki harf taşı tutma kapasitesini +1 artırır.',
    effect: { type: 'ADD_HAND_SIZE', amount: 1 }
  },
  {
    id: 'VOUCHER_SEED_MONEY',
    name: '🏦 Faiz Yatırım Kuponu',
    icon: '🏦',
    cost: 10,
    desc: 'Banka Faiz tavanını +$10 Altına yükseltir (Max +10 Altın faiz).',
    effect: { type: 'INCREASE_INTEREST_CAP', amount: 10 }
  },
  {
    id: 'VOUCHER_CLEARANCE',
    name: '🏷️ Çarşı İndirim Kuponu',
    icon: '🏷️',
    cost: 10,
    desc: 'Tüm dükkân ürünlerinde kalıcı %25 indirim sağlar.',
    effect: { type: 'SHOP_DISCOUNT', percent: 25 }
  },
  {
    id: 'VOUCHER_HONONE',
    name: '🎰 Ucuz Yenileme Kuponu',
    icon: '🎰',
    cost: 10,
    desc: 'Dükkân ürün yenileme (Reroll) bedelini $2 Altına sabitler.',
    effect: { type: 'CAP_REROLL_COST', cost: 2 }
  }
];

export function getRandomVoucher(purchasedVoucherIds = []) {
  const available = SHOP_VOUCHERS.filter(v => !purchasedVoucherIds.includes(v.id));
  if (available.length === 0) return SHOP_VOUCHERS[0];
  return available[Math.floor(Math.random() * available.length)];
}

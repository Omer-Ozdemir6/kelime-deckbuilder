/**
 * Event Definitions and Narrative Choices for Roguelite Run
 */

export const RANDOM_EVENTS = [
  {
    id: 'EVENT_OLD_DICTIONARY',
    title: 'Eski Sözlük Buldun',
    icon: '📖',
    desc: 'Terk edilmiş bir kütüphane masasında tozlu ve gizemli bir eski Türkçe sözlük duruyor.',
    choices: [
      { text: 'A) Destene rastgele nadir harf ekle (Ş / Ğ / Ç)', action: 'ADD_RARE' },
      { text: 'B) Destedeki bir harfi ücretsiz geliştir (+1 Perk)', action: 'UPGRADE_FREE' },
      { text: 'C) Sözlüğü antikacıya sat (+35 💰 Altın)', action: 'GOLD_35' }
    ]
  },
  {
    id: 'EVENT_ANCIENT_RUNES',
    title: 'Kadim Harf Yazıtı',
    icon: '🪨',
    desc: 'Yol kenarında alev ve zümrüt ışıkları saçan kadim bir taş yazıt yükseliyor.',
    choices: [
      { text: 'A) Yazıta dokun (Destene 1 Mühürlü Harf ekle)', action: 'ADD_INFUSED' },
      { text: 'B) Yazıttaki altın kırıntılarını topla (+40 💰 Altın)', action: 'GOLD_40' }
    ]
  },
  {
    id: 'EVENT_ALCHEMY_APPRENTICE',
    title: 'Simyacı Çırağı',
    icon: '⚗️',
    desc: 'Genç bir simyacı harflere efsun ve mühür basmayı deniyor. Sana özel teklifler sunuyor.',
    choices: [
      { text: 'A) 20 Altın ver (Destene Mühürlü Alev Harfi ekle)', action: 'BUY_INFUSED_20' },
      { text: 'B) 35 Altın ver (Rastgele 1 Emanet / Relic kazan)', action: 'BUY_RELIC_35' },
      { text: 'C) Teşekkür edip yoluna devam et', action: 'PASS' }
    ]
  },
  {
    id: 'EVENT_CURSED_LIBRARY',
    title: 'Gölge Kütüphanesi',
    icon: '📜',
    desc: 'Karanlık bir gölge sana fısıldıyor: "Zayıf bir harfini bana ver, karşılığında desteni güçlendireyim."',
    choices: [
      { text: 'A) 1 Standart Harf feda et (Destenden sil)', action: 'REMOVE_CARD_EVENT' },
      { text: 'B) Gölgenin hazinesini kabul et (+60 💰 Altın)', action: 'GOLD_60' }
    ]
  },
  {
    id: 'EVENT_WANDERING_BARD',
    title: 'Gezgin Harf Tüccarı',
    icon: '🐪',
    desc: 'Devesinin sırtında nadir harfler taşıyan gezgin bir tüccar sana selam veriyor.',
    choices: [
      { text: 'A) 30 Altın ver (Destene 1 JOKER Kartı al)', action: 'BUY_JOKER_30' },
      { text: 'B) Tüccara ilham ver (+25 💰 Altın hediye al)', action: 'GOLD_25' }
    ]
  },
  {
    id: 'EVENT_LOCKED_CHEST',
    title: 'Kilitli Hazine Sandığı',
    icon: '🗝️',
    desc: 'Çalıların arasına saklanmış ağır demir bir kilitli sandık buldun.',
    choices: [
      { text: 'A) Kilidi zorla (%70 Şansla 50 Altın, %30 Boş)', action: 'TRY_CHEST' },
      { text: 'B) Güvenli davran ve sandığı bırak', action: 'PASS' }
    ]
  }
];

export function getRandomEvent() {
  return RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
}

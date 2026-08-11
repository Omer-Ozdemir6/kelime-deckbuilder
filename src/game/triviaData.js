/**
 * Trivia & Riddle Question Bank for Word Deckbuilder
 */

export const TRIVIA_QUESTIONS = [
  {
    id: 'q1',
    category: 'Tarih',
    categoryIcon: '🏛️',
    question: 'Türkiye Cumhuriyeti’nin kurucusu Mustafa Kemal Atatürk’ün doğduğu şehir hangisidir?',
    options: ['Atina', 'Selanik', 'Manastır', 'İstanbul'],
    correctIndex: 1
  },
  {
    id: 'q2',
    category: 'Genel Kültür',
    categoryIcon: '🌍',
    question: 'Dünyanın en yüksek dağı olan Everest Dağı hangi dağ sırasındadır?',
    options: ['Alpler', 'And Dağları', 'Himalayalar', 'Kayalık Dağlar'],
    correctIndex: 2
  },
  {
    id: 'q3',
    category: 'Sinema',
    categoryIcon: '🎬',
    question: 'Tarihte en çok Oscar ödülü kazanan 11 Oscar sahibi filmlerden biri hangisidir?',
    options: ['Yüzüklerin Efendisi: Kralın Dönüşü', 'Baba (The Godfather)', 'Pulp Fiction', 'Gladyatör'],
    correctIndex: 0
  },
  {
    id: 'q4',
    category: 'Spor',
    categoryIcon: '⚽',
    question: 'Futbol tarihinde 1000 resmi gol barajını aştığı kabul edilen Brezilyalı efsane futbolcu kimdir?',
    options: ['Maradona', 'Pelé', 'Ronaldo Nazário', 'Zico'],
    correctIndex: 1
  },
  {
    id: 'q5',
    category: 'Edebiyat',
    categoryIcon: '📖',
    question: '"Safahat" adlı efsanevi şiir külliyatı hangi büyük şairimize aittir?',
    options: ['Yahya Kemal Beyatlı', 'Faruk Nafiz Çamlıbel', 'Mehmet Âkif Ersoy', 'Cahit Sıtkı Tarancı'],
    correctIndex: 2
  },
  {
    id: 'q6',
    category: 'Genel Kültür',
    categoryIcon: '🎨',
    question: 'Dünyaca ünlü "Mona Lisa" tablosu hangi müzede sergilenmektedir?',
    options: ['British Museum', 'Louvre Müzesi', 'Hermitage Müzesi', 'Prado Müzesi'],
    correctIndex: 1
  },
  {
    id: 'q7',
    category: 'Tarih',
    categoryIcon: '📜',
    question: 'İstanbul’un fethi hangi yılda gerçekleşmiştir?',
    options: ['1071', '1299', '1453', '1517'],
    correctIndex: 2
  },
  {
    id: 'q8',
    category: 'Sinema',
    categoryIcon: '🎥',
    question: 'Hababam Sınıfı film serisinde "Mahmut Hoca" karakterini canlandıran usta sanatçı kimdir?',
    options: ['Münir Özkul', 'Kemal Sunal', 'Şener Şen', 'Halit Akçatepe'],
    correctIndex: 0
  },
  {
    id: 'q9',
    category: 'Spor',
    categoryIcon: '🏋️‍♂️',
    question: 'Kendi ağırlığının 3 katından fazlasını kaldırarak dünya rekorları kıran "Cepte Herkül" lakaplı haltercimiz kimdir?',
    options: ['Halil Mutlu', 'Naim Süleymanoğlu', 'Taner Sağır', 'Nurcan Taylan'],
    correctIndex: 1
  },
  {
    id: 'q10',
    category: 'Genel Kültür',
    categoryIcon: '🪐',
    question: 'Güneş Sistemi’nde bulunan en büyük gezegen hangisidir?',
    options: ['Mars', 'Satürn', 'Neptün', 'Jüpiter'],
    correctIndex: 3
  }
];

export function getRandomTriviaQuestion() {
  return TRIVIA_QUESTIONS[Math.floor(Math.random() * TRIVIA_QUESTIONS.length)];
}

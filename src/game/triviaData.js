/**
 * Trivia & Riddle Question Bank for Word Deckbuilder
 */

export const TRIVIA_QUESTIONS = [
  {
    id: 'w1',
    category: 'Kelime Bilmecesi',
    categoryIcon: '🧩',
    question: 'Başında "K", sonunda "R", ortasında "A" harfi var. Kışın gökten yağar. Bu kelime nedir?',
    options: ['KAR', 'KOR', 'KUR', 'KIR'],
    correctIndex: 0
  },
  {
    id: 'w2',
    category: 'Kelime Bilmecesi',
    categoryIcon: '🔑',
    question: 'Dört harfli bir kelimeyim. Beni çevirirsen kilitli kapıyı açarsın. Ben neyim?',
    options: ['KAPI', 'ANAHTAR', 'KİLİT', 'DUVAR'],
    correctIndex: 0
  },
  {
    id: 'w3',
    category: 'Kelime Bilmecesi',
    categoryIcon: '📖',
    question: 'İlk harfim "S", son harfim "Z". Cümleleri ben oluştururum, binlerce anlam taşırım. Ben neyim?',
    options: ['SÖZ', 'SES', 'SİZ', 'SAZ'],
    correctIndex: 0
  },
  {
    id: 'w4',
    category: 'Kelime Bilmecesi',
    categoryIcon: '🔥',
    question: 'Ateşten çıkarım, "K" ile başlar "R" ile biterim. Kıvılcım gibi parlarım. Ben neyim?',
    options: ['KOR', 'KAR', 'KİR', 'KÜR'],
    correctIndex: 0
  },
  {
    id: 'w5',
    category: 'Kelime Bilmecesi',
    categoryIcon: '🌌',
    question: 'Gece gökyüzünde ışıldarım. İki harfli bir kelimeyim, ilk harfim "A". Ben neyim?',
    options: ['AY', 'AL', 'AK', 'AV'],
    correctIndex: 0
  },
  {
    id: 'w6',
    category: 'Kelime Bilmecesi',
    categoryIcon: '🌊',
    question: 'Engin maviliklerde akarım. "D" ile başlar "Z" ile biterim. Balıkların eviyim. Ben neyim?',
    options: ['DENİZ', 'DERYA', 'DERE', 'DALGA'],
    correctIndex: 0
  },
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
    id: 'q5',
    category: 'Edebiyat',
    categoryIcon: '📖',
    question: '"Safahat" adlı efsanevi şiir külliyatı hangi büyük şairimize aittir?',
    options: ['Yahya Kemal Beyatlı', 'Faruk Nafiz Çamlıbel', 'Mehmet Âkif Ersoy', 'Cahit Sıtkı Tarancı'],
    correctIndex: 2
  },
  {
    id: 'q7',
    category: 'Tarih',
    categoryIcon: '📜',
    question: 'İstanbul’un fethi hangi yılda gerçekleşmiştir?',
    options: ['1071', '1299', '1453', '1517'],
    correctIndex: 2
  }
];

export function getRandomTriviaQuestion() {
  return TRIVIA_QUESTIONS[Math.floor(Math.random() * TRIVIA_QUESTIONS.length)];
}

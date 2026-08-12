/**
 * Trivia & Riddle Question Bank for Word Deckbuilder (Question-Answer Letter Tile System)
 */

export const TRIVIA_QUESTIONS = [
  {
    id: 'w1',
    category: 'Kelime Bilmecesi',
    categoryIcon: '🧩',
    question: 'Başında "K", sonunda "R", ortasında "A" var. Kışın gökten süzülerek yağar. Bu kelime nedir?',
    answer: 'KAR',
    hint: '3 harfli hava olayı'
  },
  {
    id: 'w2',
    category: 'Kelime Bilmecesi',
    categoryIcon: '🔑',
    question: 'Kilitli kapıları açmak için çevrilen nesne nedir?',
    answer: 'ANAHTAR',
    hint: 'Çilingirlerin ve kapıların vazgeçilmezi'
  },
  {
    id: 'w3',
    category: 'Kelime Bilmecesi',
    categoryIcon: '📖',
    question: 'İlk harfi "S", son harfi "Z". Cümleleri oluşturan, ağızdan çıkan anlamlı anlatım nedir?',
    answer: 'SÖZ',
    hint: '3 harfli kavram'
  },
  {
    id: 'w4',
    category: 'Kelime Bilmecesi',
    categoryIcon: '🔥',
    question: 'Ateşten geriye kalan kırmızılıklı, henüz sönmemiş korlaşmış parça nedir?',
    answer: 'KOR',
    hint: '3 harfli ateş kalıntısı'
  },
  {
    id: 'w5',
    category: 'Kelime Bilmecesi',
    categoryIcon: '🌌',
    question: 'Gece gökyüzünde ışıldayan, Dünya\'mızın tek doğal uydusu nedir?',
    answer: 'AY',
    hint: '2 harfli gök cismi'
  },
  {
    id: 'w6',
    category: 'Kelime Bilmecesi',
    categoryIcon: '🌊',
    question: 'Engin mavilikler; balıkların ev sahipliğini yapan dev su kütlesi nedir?',
    answer: 'DENİZ',
    hint: '5 harfli su birikintisi'
  },
  {
    id: 'q1',
    category: 'Tarih',
    categoryIcon: '🏛️',
    question: 'Türkiye Cumhuriyeti’nin kurucusu Mustafa Kemal Atatürk’ün doğduğu kent neresidir?',
    answer: 'SELANİK',
    hint: 'Balkanlarda tarihi bir şehir'
  },
  {
    id: 'q2',
    category: 'Coğrafya',
    categoryIcon: '🌍',
    question: 'Dünyanın en yüksek noktası olan Everest Dağı\'nın yer aldığı sıra dağlar hangisidir?',
    answer: 'HİMALAYALAR',
    hint: 'Asya kıtasında dev dağ sırası'
  },
  {
    id: 'q3',
    category: 'Coğrafya',
    categoryIcon: '🇹🇷',
    question: 'Türkiye Cumhuriyeti\'nin başkenti olan ilimiz hangisidir?',
    answer: 'ANKARA',
    hint: 'İç Anadolu\'nun kalbi'
  },
  {
    id: 'q4',
    category: 'Coğrafya',
    categoryIcon: '🎈',
    question: 'Peri bacaları ve sıcak hava balonlarıyla ünlü Nevşehir bölgesinin tarihi adı nedir?',
    answer: 'KAPADOKYA',
    hint: 'Güzel atlar ülkesi'
  },
  {
    id: 'q5',
    category: 'Edebiyat',
    categoryIcon: '📜',
    question: 'İstiklal Marşı\'mızın yazarı olan milli şairimizin adı nedir?',
    answer: 'MEHMETAKİF',
    hint: 'Safahat eserinin yazarı'
  },
  {
    id: 'q6',
    category: 'Tarih',
    categoryIcon: '⚔️',
    question: 'İstanbul\'un fethinin gerçekleştiği tarihi yıl hangisidir?',
    answer: '1453',
    hint: 'Fatih Sultan Mehmet dönemi'
  },
  {
    id: 'q7',
    category: 'Bilim & Doğa',
    categoryIcon: '☀️',
    question: 'Güneş Sistemimizdeki en büyük gezegen hangisidir?',
    answer: 'JÜPİTER',
    hint: 'Dev gaz devi gezegen'
  },
  {
    id: 'q8',
    category: 'Sanat & Kültür',
    categoryIcon: '🎨',
    question: 'Mona Lisa tablosunu çizen dünyaca ünlü İtalyan rönesans dâhisi kimdir?',
    answer: 'VINCI',
    hint: 'Leonardo da ...'
  },
  {
    id: 'q9',
    category: 'Coğrafya',
    categoryIcon: '🏔️',
    question: 'Türkiye\'nin en yüksek dağı olan efsanevi dağ hangisidir?',
    answer: 'AĞRI',
    hint: 'Nuh\'un gemisi efsanesiyle bilinen dağ'
  },
  {
    id: 'q10',
    category: 'Tarih',
    categoryIcon: '🏛️',
    question: '1071 yılında Anadolu\'nun kapılarını Türklere açan tarihi savaşın adı nedir?',
    answer: 'MALAZGİRT',
    hint: 'Sultan Alparslan liderliğindeki zafer'
  }
];

const ALPHABET_TR = ['A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'H', 'I', 'İ', 'J', 'K', 'L', 'M', 'N', 'O', 'Ö', 'P', 'R', 'S', 'Ş', 'T', 'U', 'Ü', 'V', 'Y', 'Z'];

/**
 * Generates a full puzzle payload with scrambled letter tiles and extra decoys
 */
export function generatePuzzleQuestionData(customQuestionObj = null) {
  const q = customQuestionObj || TRIVIA_QUESTIONS[Math.floor(Math.random() * TRIVIA_QUESTIONS.length)];
  const cleanAnswer = q.answer.toUpperCase().replace(/\s+/g, '');
  const answerLetters = cleanAnswer.split('');

  // Add 2 to 4 decoy letters to make spelling challenging & engaging
  const decoyCount = Math.max(2, Math.min(4, 11 - answerLetters.length));
  const decoys = [];
  for (let i = 0; i < decoyCount; i++) {
    const randomChar = ALPHABET_TR[Math.floor(Math.random() * ALPHABET_TR.length)];
    decoys.push(randomChar);
  }

  // Combine and shuffle
  const allLetters = [...answerLetters, ...decoys];
  const scrambledPool = [...allLetters]
    .sort(() => 0.5 - Math.random())
    .map((char, index) => ({
      id: `tile_${index}_${char}_${Math.random().toString(36).substring(2, 6)}`,
      char,
      isUsed: false
    }));

  return {
    ...q,
    cleanAnswer,
    answerLength: cleanAnswer.length,
    scrambledPool
  };
}

export function getRandomTriviaQuestion() {
  return generatePuzzleQuestionData();
}

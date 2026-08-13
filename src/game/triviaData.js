/**
 * Trivia & Riddle Question Bank for Word Deckbuilder (50+ Diverse Vocabulary & Riddle Questions)
 */

export const TRIVIA_QUESTIONS = [
  // 🧩 KELİME BİLMECELERİ & ANAGRAMLAR
  { id: 'w1', category: 'Kelime Bilmecesi', categoryIcon: '🧩', question: 'Başında "K", sonunda "R", ortasında "A" var. Kışın gökten süzülerek yağar. Bu nedir?', answer: 'KAR', hint: '3 harfli hava olayı' },
  { id: 'w2', category: 'Kelime Bilmecesi', categoryIcon: '🔑', question: 'Kilitli kapıları açmak için çevrilen nesne nedir?', answer: 'ANAHTAR', hint: 'Çilingirlerin ve kapıların vazgeçilmezi' },
  { id: 'w3', category: 'Kelime Bilmecesi', categoryIcon: '📖', question: 'Cümleleri oluşturan, ağızdan çıkan anlamlı anlatım nedir?', answer: 'SÖZ', hint: '3 harfli kavram' },
  { id: 'w4', category: 'Kelime Bilmecesi', categoryIcon: '🔥', question: 'Ateşten geriye kalan kırmızılıklı, henüz sönmemiş korlaşmış parça nedir?', answer: 'KOR', hint: '3 harfli ateş kalıntısı' },
  { id: 'w5', category: 'Kelime Bilmecesi', categoryIcon: '🌌', question: 'Gece gökyüzünde ışıldayan, Dünya\'mızın tek doğal uydusu nedir?', answer: 'AY', hint: '2 harfli gök cismi' },
  { id: 'w6', category: 'Kelime Bilmecesi', categoryIcon: '🌊', question: 'Engin mavilikler; balıkların ev sahipliğini yapan dev su kütlesi nedir?', answer: 'DENİZ', hint: '5 harfli su birikintisi' },
  { id: 'w7', category: 'Kelime Bilmecesi', categoryIcon: '🌲', question: 'Gövdesi odunsu, yapraklarıyla doğaya oksijen veren canlı nedir?', answer: 'AĞAÇ', hint: '4 harfli bitki' },
  { id: 'w8', category: 'Kelime Bilmecesi', categoryIcon: '⚡', question: 'Bulutların sürtünmesiyle oluşan dev elektrik boşalması parıltısı nedir?', answer: 'ŞİMŞEK', hint: '6 harfli doğa olayı' },
  { id: 'w9', category: 'Kelime Bilmecesi', categoryIcon: '🍯', question: 'Arıların binbir çiçekten toplayarak kovanlarında ürettiği tatlı nedir?', answer: 'BAL', hint: '3 harfli şifalı yiyecek' },
  { id: 'w10', category: 'Kelime Bilmecesi', categoryIcon: '💎', question: 'Karbonun yer altında en sert ve değerli kristalleşmiş hali nedir?', answer: 'ELMAS', hint: '5 harfli değerli taş' },

  // 🏛️ TARİH & KÜLTÜR
  { id: 'q1', category: 'Tarih', categoryIcon: '🏛️', question: 'Mustafa Kemal Atatürk’ün doğduğu tarihi kent neresidir?', answer: 'SELANİK', hint: 'Balkanlarda tarihi bir şehir' },
  { id: 'q2', category: 'Tarih', categoryIcon: '⚔️', question: 'İstanbul\'un fethinin gerçekleştiği tarihi yıl hangisidir?', answer: '1453', hint: 'Fatih Sultan Mehmet dönemi' },
  { id: 'q3', category: 'Tarih', categoryIcon: '🏛️', question: '1071 yılında Anadolu\'nun kapılarını Türklere açan tarihi zafer nedir?', answer: 'MALAZGİRT', hint: 'Sultan Alparslan liderliğindeki zafer' },
  { id: 'q4', category: 'Tarih', categoryIcon: '📜', question: 'Osmanlı İmparatorluğu\'nun kurucusu olan ilk padişah kimdir?', answer: 'OSMANGAZİ', hint: 'Söğüt beldesinde kurulan devlet' },
  { id: 'q5', category: 'Tarih', categoryIcon: '👑', question: 'Mısır\'ın son antik kadın kraliçesi olan ünlü hükümdar kimdir?', answer: 'KLEOPATRA', hint: 'Nil nehri efsanesi' },
  { id: 'q6', category: 'Tarih', categoryIcon: '⛵', question: 'Amerika kıtasına 1492 yılında ulaşan Cenevizli kâşif kimdir?', answer: 'KOLOMP', hint: 'Kristof ...' },
  { id: 'q7', category: 'Tarih', categoryIcon: '🛡️', question: 'Çanakkale Savaşı zaferinin kazanıldığı tarihi yıl hangisidir?', answer: '1915', hint: 'Çanakkale Geçilmez!' },

  // 🌍 COĞRAFYA & ŞEHİRLER
  { id: 'g1', category: 'Coğrafya', categoryIcon: '🌍', question: 'Everest Dağı\'nın yer aldığı dünyaca ünlü sıra dağlar hangisidir?', answer: 'HİMALAYALAR', hint: 'Asya kıtasında dev dağ sırası' },
  { id: 'g2', category: 'Coğrafya', categoryIcon: '🇹🇷', question: 'Türkiye Cumhuriyeti\'nin başkenti olan ilimiz hangisidir?', answer: 'ANKARA', hint: 'İç Anadolu\'nun kalbi' },
  { id: 'g3', category: 'Coğrafya', categoryIcon: '🎈', question: 'Peri bacaları ve balonlarıyla ünlü Nevşehir bölgesinin tarihi adı nedir?', answer: 'KAPADOKYA', hint: 'Güzel atlar ülkesi' },
  { id: 'g4', category: 'Coğrafya', categoryIcon: '🏔️', question: 'Türkiye\'nin en yüksek dağı olan efsanevi dağ hangisidir?', answer: 'AĞRI', hint: 'Nuh\'un gemisi efsanesi' },
  { id: 'g5', category: 'Coğrafya', categoryIcon: '🌊', question: 'Dünyanın en uzun nehri kabul edilen Afrika nehri nedir?', answer: 'NİL', hint: 'Mısır\'a hayat veren nehir' },
  { id: 'g6', category: 'Coğrafya', categoryIcon: '🏜️', question: 'Kuzey Afrika\'yı kaplayan dünyanın en büyük sıcak çölü nedir?', answer: 'SAHRA', hint: 'Büyük Sahra Çölü' },
  { id: 'g7', category: 'Coğrafya', categoryIcon: '🌋', question: 'İtalya\'da Vezüv yanardağının külleri altında kalan antik kent nedir?', answer: 'POMPEİ', hint: 'Tarihi taşlaşmış şehir' },

  // 🧪 BİLİM & DOĞA
  { id: 's1', category: 'Bilim & Doğa', categoryIcon: '☀️', question: 'Güneş Sistemimizdeki en büyük dev gaz gezegeni hangisidir?', answer: 'JÜPİTER', hint: 'Dev gaz devi gezegen' },
  { id: 's2', category: 'Bilim & Doğa', categoryIcon: '🔴', question: 'Kızıl Gezegen olarak da bilinen Dünya\'ya en yakın gezegen nedir?', answer: 'MARS', hint: 'Kızıl gezegen' },
  { id: 's3', category: 'Bilim & Doğa', categoryIcon: '🧪', question: 'Kimyada suyu oluşturan H2O formülündeki "H" harfi hangi elementtir?', answer: 'HİDROJEN', hint: 'En hafif evrensel element' },
  { id: 's4', category: 'Bilim & Doğa', categoryIcon: '💡', question: 'Yerçekimi kanununu kafasına elma düşmesiyle keşfeden bilim insanı kimdir?', answer: 'NEWTON', hint: 'Isaac ...' },
  { id: 's5', category: 'Bilim & Doğa', categoryIcon: '🧬', question: 'Canlıların genetik şifresini taşıyan çift sarmallı molekül nedir?', answer: 'DNA', hint: 'Deoksiribonükleik asit' },
  { id: 's6', category: 'Bilim & Doğa', categoryIcon: '🧲', question: 'Demir ve nikel maddelerini kendine çeken mıknatıs madeni nedir?', answer: 'MIKNATIS', hint: 'Manyetik alan üreten taş' },

  // 📜 EDEBİYAT & MİTOLOJİ
  { id: 'l1', category: 'Edebiyat', categoryIcon: '📜', question: 'İstiklal Marşı\'mızın yazarı olan milli şairimizin adı nedir?', answer: 'MEHMETAKİF', hint: 'Safahat eserinin yazarı' },
  { id: 'l2', category: 'Edebiyat', categoryIcon: '🎭', question: 'Romeo ve Juliet oyununu yazan dünyaca ünlü İngiliz oyun yazarı kimdir?', answer: 'SHAKESPEARE', hint: 'Stratfordlu ozan' },
  { id: 'l3', category: 'Mitoloji', categoryIcon: '⚡', question: 'Yunan mitolojisinde Olympos dağının şimşekler fırlatan tanrısı kimdir?', answer: 'ZEUS', hint: 'Tanrıların kralı' },
  { id: 'l4', category: 'Mitoloji', categoryIcon: '🔱', question: 'Yunan mitolojisinde denizlerin ve okyanusların tanrısı kimdir?', answer: 'POSEİDON', hint: 'Üç dişli mızrak taşıyan tanrı' },
  { id: 'l5', category: 'Edebiyat', categoryIcon: '📚', question: 'Mesnevi eserinin yazarı olan hoşgörü abidesi tasavvuf dâhisi kimdir?', answer: 'MEVLANA', hint: 'Gel, ne olursan ol yine gel!' },

  // 🎨 SANAT & MÜZİK
  { id: 'a1', category: 'Sanat & Kültür', categoryIcon: '🎨', question: 'Mona Lisa tablosunu çizen dünyaca ünlü İtalyan rönesans dâhisi kimdir?', answer: 'VINCI', hint: 'Leonardo da ...' },
  { id: 'a2', category: 'Sanat & Kültür', categoryIcon: '🎵', question: '9. Senfoni\'yi işitme engelli olmasına rağmen besteleyen dâhi kimdir?', answer: 'BEETHOVEN', hint: 'Ludwig van ...' },
  { id: 'a3', category: 'Sanat & Kültür', categoryIcon: '🏛️', question: 'Osmanlı Mimarlık sanatının zirvesi Selimiye ve Süleymaniye mimarı kimdir?', answer: 'MİMARSİNAN', hint: 'Koca Sinan' },
  { id: 'a4', category: 'Sanat & Kültür', categoryIcon: '🎻', question: 'Dört Mevsim konçertosunu besteleyen İtalyan barok besteci kimdir?', answer: 'VIVALDI', hint: 'Antonio ...' }
];

const ALPHABET_TR = ['A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'H', 'I', 'İ', 'J', 'K', 'L', 'M', 'N', 'O', 'Ö', 'P', 'R', 'S', 'Ş', 'T', 'U', 'Ü', 'V', 'Y', 'Z'];

// Keep track of recently asked question IDs to prevent repetition
let askedQuestionIds = [];

/**
 * Generates a full puzzle payload with scrambled letter tiles and extra decoys
 */
export function generatePuzzleQuestionData(customQuestionObj = null) {
  let availableQuestions = TRIVIA_QUESTIONS.filter(q => !askedQuestionIds.includes(q.id));
  if (availableQuestions.length === 0) {
    askedQuestionIds = [];
    availableQuestions = [...TRIVIA_QUESTIONS];
  }

  const q = customQuestionObj || availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
  askedQuestionIds.push(q.id);

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

import tdkDictionary from './turkishDictionary.json' with { type: 'json' };

// Ultra-comprehensive TDK Turkish Dictionary with 90,000+ official words & stemmer fallback
const WORD_SET = new Set(tdkDictionary);

// Explicit additions for 2-letter game words
const EXPLICIT_ADDITIONS = [
  "AB", "AC", "AÇ", "AD", "AF", "AĞ", "AH", "AK", "AL", "AM", "AN", "AR", "AS", "AŞ", "AT", "AV", "AY", "AZ",
  "BA", "BE", "BU", "CE", "DA", "DE", "DO", "ED", "EH", "EK", "EL", "EM", "EN", "ER", "ES", "EŞ", "ET", "EV", "EY", "EZ",
  "FA", "FE", "HA", "HE", "IÇ", "IĞ", "IK", "IL", "IM", "IN", "IP", "IR", "IS", "IŞ", "IT", "IZ",
  "İÇ", "İĞ", "İK", "İL", "İM", "İN", "İP", "İR", "İS", "İŞ", "İT", "İZ",
  "LA", "LE", "ME", "Mİ", "MU", "MÜ", "NE", "OD", "OF", "OH", "OK", "OL", "OM", "ON", "OP", "OR", "OT", "OY",
  "ÖÇ", "ÖD", "ÖF", "ÖN", "ÖR", "ÖS", "ÖZ", "PE", "RE", "SE", "Sİ", "SU", "ŞU", "TA", "TE", "Tİ", "TU", "TÜ",
  "UN", "UR", "US", "UZ", "ÜÇ", "ÜN", "ÜS", "ÜT", "ÜZ", "VE", "YA", "YE", "YO", "ZA"
];
EXPLICIT_ADDITIONS.forEach(w => WORD_SET.add(w));

/**
 * Turkish Stemmer & Consonant Softening Fallback Validator
 * Handles suffix inflections (e.g. -ler, -da, -den, -i, -in, -im, -iniz, -dir, -lik, -sel)
 * for all 90,000+ base TDK words.
 */
function isMorphologicallyValidTurkishWord(word) {
  if (word.length < 2) return false;
  let testStr = word.toUpperCase('tr-TR').trim();

  if (WORD_SET.has(testStr)) return true;

  // Vowel drop fallback (e.g. NAKLİ -> NAKİL, FİKRİ -> FİKİR, AKLI -> AKIL)
  if (testStr.length >= 4) {
    const narrowVowels = ['İ', 'I', 'U', 'Ü'];
    for (const nv of narrowVowels) {
      const inserted = testStr.substring(0, testStr.length - 2) + nv + testStr.substring(testStr.length - 2);
      if (WORD_SET.has(inserted)) return true;
    }
  }

  const suffixes = [
    "LARIMIZDAN", "LERİMİZDEN", "LARINIZDAN", "LERİNİZDEN", "LARINDAN", "LERİNDEN",
    "LARIMIZDA", "LERİMİZDE", "LARINIZDA", "LERİNİZDE", "LARINDA", "LERİNDE",
    "LARIMIZI", "LERİMİZİ", "LARINIZI", "LERİNİZİ", "LARINI", "LERİNİ",
    "LARIMIZ", "LERİMİZ", "LARINIZ", "LERİNİZ", "LARIM", "LARIN", "LERİM", "LERİN",
    "LARDAN", "LERDEN", "LARDA", "LERDE", "LARI", "LERİ", "LAR", "LER",
    "LİK", "LİK", "LUK", "LÜK", "Lİ", "LI", "LU", "LÜ", "SİZ", "SUZ", "SÜZ",
    "DEN", "DAN", "TEN", "TAN", "DE", "DA", "TE", "TA", "YE", "YA", "NE", "NA", "Yİ", "YI", "YU", "YÜ",
    "MİŞ", "MIŞ", "MUŞ", "MÜŞ", "Dİ", "Dİ", "DU", "DÜ", "Tİ", "Tİ", "TU", "TÜ", "CEK", "CAK", "ECEK", "ACAK",
    "YOR", "MAK", "MEK", "EN", "AN", "İR", "ÜR", "ER", "AR",
    "İMİZ", "IMIZ", "UMUZ", "ÜMÜZ", "İNİZ", "INIZ", "UNUZ", "ÜNÜZ",
    "İM", "İM", "UM", "ÜM", "İN", "İN", "UN", "ÜN", "İ", "I", "U", "Ü", "E", "A"
  ];

  for (let i = 2; i < testStr.length; i++) {
    const prefix = testStr.substring(0, i);
    const suffix = testStr.substring(i);

    if (suffixes.includes(suffix)) {
      if (WORD_SET.has(prefix)) return true;

      const lastChar = prefix[prefix.length - 1];
      let restoredPrefix = prefix;
      if (lastChar === 'Ğ') restoredPrefix = prefix.slice(0, -1) + 'K';
      else if (lastChar === 'D') restoredPrefix = prefix.slice(0, -1) + 'T';
      else if (lastChar === 'B') restoredPrefix = prefix.slice(0, -1) + 'P';
      else if (lastChar === 'C') restoredPrefix = prefix.slice(0, -1) + 'Ç';

      if (WORD_SET.has(restoredPrefix)) return true;
    }
  }

  return false;
}

export function isWordValid(word) {
  if (!word || typeof word !== 'string') return false;
  const cleanWord = word.toUpperCase('tr-TR').trim();
  if (WORD_SET.has(cleanWord)) return true;
  return isMorphologicallyValidTurkishWord(cleanWord);
}

export function getDictionarySize() {
  return WORD_SET.size;
}

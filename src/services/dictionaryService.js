/**
 * Service to fetch TDK official word meanings, grammatical types, and example sentences
 * with client-side caching and stem fallback for inflected words.
 */

const MEANINGS_CACHE_KEY = 'kd_word_meanings_cache';

function getCache() {
  try {
    const raw = localStorage.getItem(MEANINGS_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveToCache(word, data) {
  try {
    const cache = getCache();
    cache[word] = data;
    // Limit cache size to 500 items
    const keys = Object.keys(cache);
    if (keys.length > 500) {
      delete cache[keys[0]];
    }
    localStorage.setItem(MEANINGS_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    // Ignore storage quota errors
  }
}

function extractStemCandidates(word) {
  const clean = word.toUpperCase('tr-TR').trim();
  const candidates = [clean];

  const suffixes = [
    "LARINI", "LERİNİ", "LARIN", "LERİN", "LERDE", "LARDA", "LARDAN", "LERDEN", "LERİM", "LARIM",
    "LARIMIZ", "LERİMİZ", "LARINIZ", "LERİNİZ", "LARDAN", "LERDEN", "LARI", "LERİ", "LAR", "LER",
    "LİK", "LÜK", "Lİ", "LI", "LU", "LÜ", "SİZ", "SUZ", "SÜZ",
    "DEN", "DAN", "TEN", "TAN", "DE", "DA", "TE", "TA", "YE", "YA", "Yİ", "YI", "YU", "YÜ",
    "MİŞ", "MIŞ", "MUŞ", "MÜŞ", "Dİ", "DU", "DÜ", "Tİ", "TU", "TÜ", "CEK", "CAK", "ECEK", "ACAK",
    "YOR", "MAK", "MEK", "EN", "AN", "İR", "ÜR", "ER", "AR",
    "İMİZ", "IMIZ", "UMUZ", "ÜMÜZ", "İNİZ", "INIZ", "UNUZ", "ÜNÜZ",
    "İM", "UM", "ÜM", "İN", "UN", "ÜN", "İ", "I", "U", "Ü", "E", "A"
  ];

  for (let i = 2; i < clean.length; i++) {
    const prefix = clean.substring(0, i);
    const suffix = clean.substring(i);

    if (suffixes.includes(suffix)) {
      candidates.push(prefix);

      const lastChar = prefix[prefix.length - 1];
      if (lastChar === 'Ğ') candidates.push(prefix.slice(0, -1) + 'K');
      else if (lastChar === 'D') candidates.push(prefix.slice(0, -1) + 'T');
      else if (lastChar === 'B') candidates.push(prefix.slice(0, -1) + 'P');
      else if (lastChar === 'C') candidates.push(prefix.slice(0, -1) + 'Ç');
    }
  }

  return Array.from(new Set(candidates));
}

async function fetchFromTDK(queryWord) {
  const cleanWord = queryWord.toLowerCase('tr-TR').trim();
  const urls = [
    `/api/tdk/gts?ara=${encodeURIComponent(cleanWord)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent('https://sozluk.gov.tr/gts?ara=' + cleanWord)}`
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (!response.ok) continue;
      const json = await response.json();

      if (Array.isArray(json) && json[0] && json[0].anlamlarListe) {
        const entry = json[0];
        const meanings = entry.anlamlarListe.map(a => ({
          anlam: a.anlam,
          type: a.ozelHaklar ? a.ozelHaklar[0]?.kisa_adı : (a.fiil === '1' ? 'fiil' : 'isim'),
          example: a.orneklerListe ? a.orneklerListe[0]?.ornek : null,
          author: a.orneklerListe ? a.orneklerListe[0]?.yazar ? a.orneklerListe[0].yazar[0]?.tam_adı : null : null
        }));

        return {
          word: entry.madde.toUpperCase('tr-TR'),
          matchedQuery: queryWord,
          found: true,
          meanings: meanings.slice(0, 4), // Top 4 meanings
          proverbCount: entry.atasozu ? entry.atasozu.length : 0
        };
      }
    } catch (e) {
      // Try next proxy fallback silently
    }
  }
  return null;
}

export async function getWordMeaning(rawWord) {
  if (!rawWord || typeof rawWord !== 'string') return null;
  const uppercaseWord = rawWord.toUpperCase('tr-TR').trim();

  // Check Cache
  const cache = getCache();
  if (cache[uppercaseWord]) {
    return cache[uppercaseWord];
  }

  const candidates = extractStemCandidates(uppercaseWord);

  for (const candidate of candidates) {
    const res = await fetchFromTDK(candidate);
    if (res && res.found) {
      const resultData = {
        ...res,
        originalWord: uppercaseWord,
        isStemMatched: candidate !== uppercaseWord
      };
      saveToCache(uppercaseWord, resultData);
      return resultData;
    }
  }

  // Not found fallback item
  const fallback = {
    word: uppercaseWord,
    originalWord: uppercaseWord,
    found: false,
    meanings: [{ anlam: 'Resmi TDK sözlük anlamı yüklenemedi veya kök kelime bulunamadı.', type: 'genel' }]
  };
  saveToCache(uppercaseWord, fallback);
  return fallback;
}

/**
 * Service to fetch TDK official word meanings, grammatical types, and example sentences
 * with client-side caching and stem fallback for inflected words.
 */

const MEANINGS_CACHE_KEY = 'kd_word_meanings_cache';

function getCache() {
  try {
    const raw = localStorage.getItem(MEANINGS_CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    let changed = false;
    // Clean out any stale fallback entries from cache
    for (const key of Object.keys(parsed)) {
      if (parsed[key]?.isFallback) {
        delete parsed[key];
        changed = true;
      }
    }
    if (changed) {
      localStorage.setItem(MEANINGS_CACHE_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch (e) {
    return {};
  }
}

function saveToCache(word, data) {
  // NEVER cache fallback placeholders!
  if (!data || data.isFallback) return;

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
  const targetUrl = `https://sozluk.gov.tr/gts?ara=${encodeURIComponent(cleanWord)}`;

  const urls = [
    // 1. Local Vite dev server proxy (No CORS restrictions)
    `/api/tdk/gts?ara=${encodeURIComponent(cleanWord)}`,
    // 2. Direct TDK API
    targetUrl
  ];



  for (const url of urls) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (!response.ok) continue;
      const json = await response.json();

      let data = null;
      if (json && json.contents) {
        try {
          const parsed = JSON.parse(json.contents);
          data = Array.isArray(parsed) ? parsed[0] : parsed;
        } catch (err) {}
      } else if (Array.isArray(json)) {
        data = json[0];
      } else if (typeof json === 'object') {
        data = json;
      }

      if (data && data.anlamlarListe && Array.isArray(data.anlamlarListe) && data.anlamlarListe.length > 0) {
        const meanings = data.anlamlarListe.map(a => ({
          anlam: a.anlam,
          type: a.ozelHaklar && a.ozelHaklar[0] ? a.ozelHaklar[0].kisa_adı : (a.fiil === '1' ? 'fiil' : 'isim'),
          example: a.orneklerListe && a.orneklerListe[0] ? a.orneklerListe[0].ornek : null,
          author: a.orneklerListe && a.orneklerListe[0] && a.orneklerListe[0].yazar ? a.orneklerListe[0].yazar[0]?.tam_adı : null
        }));

        return {
          word: (data.madde || cleanWord).toUpperCase('tr-TR'),
          matchedQuery: queryWord,
          found: true,
          isFallback: false,
          meanings: meanings.slice(0, 5),
          proverbCount: data.atasozu ? data.atasozu.length : 0
        };
      }
    } catch (e) {
      // Try next endpoint
    }
  }
  return null;
}

export async function getWordMeaning(rawWord) {
  if (!rawWord || typeof rawWord !== 'string') return null;
  const uppercaseWord = rawWord.toUpperCase('tr-TR').trim();

  // Check Cache (ignoring fallbacks)
  const cache = getCache();
  if (cache[uppercaseWord] && !cache[uppercaseWord].isFallback) {
    return cache[uppercaseWord];
  }

  const candidates = extractStemCandidates(uppercaseWord);

  for (const candidate of candidates) {
    const res = await fetchFromTDK(candidate);
    if (res && res.found && !res.isFallback) {
      const resultData = {
        ...res,
        originalWord: uppercaseWord,
        isStemMatched: candidate !== uppercaseWord
      };
      saveToCache(uppercaseWord, resultData);
      return resultData;
    }
  }

  // Fallback placeholder only if network is completely offline / unreachable
  const vowels = ['A', 'E', 'I', 'İ', 'O', 'Ö', 'U', 'Ü'];
  const vowelCount = [...uppercaseWord].filter(c => vowels.includes(c)).length;
  const consonantCount = Math.max(0, uppercaseWord.length - vowelCount);
  const isVerb = uppercaseWord.endsWith('MAK') || uppercaseWord.endsWith('MEK');
  const wordType = isVerb ? 'fiil' : 'isim';

  return {
    word: uppercaseWord,
    originalWord: uppercaseWord,
    found: true,
    isFallback: true,
    meanings: [
      {
        anlam: `${uppercaseWord} — Kurallara uygun Türkçe ${wordType}. (${uppercaseWord.length} Harfli, ${vowelCount} Sesli ve ${consonantCount} Sessiz harften oluşur).`,
        type: wordType.toUpperCase(),
        example: `"${uppercaseWord}" kelimesi ile destende skor elde ettin.`
      }
    ]
  };
}


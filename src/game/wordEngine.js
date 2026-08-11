import { isWordValid } from '../data/turkishWords';

/**
 * Length Bonus Table:
 * 2 letters: +0
 * 3 letters: +1
 * 4 letters: +2
 * 5 letters: +4
 * 6 letters: +7
 * 7 letters: +11
 * 8+ letters: +16
 */
export function getLengthBonus(length) {
  if (length <= 2) return 0;
  if (length === 3) return 1;
  if (length === 4) return 2;
  if (length === 5) return 4;
  if (length === 6) return 7;
  if (length === 7) return 11;
  return 16 + (length - 8) * 5;
}

export function isWordExtension(previousWord, newWord) {
  if (!previousWord || !newWord) return false;
  const p = previousWord.toUpperCase().trim();
  const n = newWord.toUpperCase().trim();
  return n.length > p.length && n.startsWith(p);
}

/**
 * Calculates score, perks, relic synergies, and word archetype rewards
 */
export function calculateWordScore(
  selectedCards,
  lastPlayedWord = '',
  currentCombo = 1,
  playedWordsThisStage = [],
  activeRelicKeys = [],
  isFirstWordInStage = false
) {
  if (!selectedCards || selectedCards.length === 0) {
    return {
      isValid: false,
      word: '',
      score: 0,
      goldEarned: 0,
      basePoints: 0,
      lengthBonus: 0,
      extensionBonus: 0,
      comboMultiplier: 1,
      isExtension: false,
      newCombo: 1,
      archetype: null,
      message: 'Lütfen harf seçin!'
    };
  }

  let wordStr = '';
  let cardSum = 0;
  let doubleMultiplier = 1;
  let perkComboBoost = 0;

  const hasKeskinKalem = activeRelicKeys.includes('KESKIN_KALEM');

  selectedCards.forEach(card => {
    if (card.isSpecial) {
      if (card.specialType === 'joker') {
        wordStr += 'A';
      } else if (card.specialType === 'double') {
        doubleMultiplier *= 2;
      }
    } else {
      wordStr += card.letter;

      // Base points
      let cardPts = card.points || 1;

      // Keskin Kalem Relic (+3 to Rare/Legendary letters)
      if (hasKeskinKalem && (card.rarity === 'nadir' || card.rarity === 'cok_nadir')) {
        cardPts += 3;
      }

      // Card Tier 2 Perk (+3 bonus if word length >= 4)
      if (card.upgradeLevel === 2 && selectedCards.length >= 4) {
        cardPts += 3;
      }

      // Card Tier 3 Perk (+1 Combo boost)
      if (card.upgradeLevel >= 3) {
        perkComboBoost += 1;
      }

      cardSum += cardPts;
    }
  });

  const upperWord = wordStr.toUpperCase().trim();

  if (upperWord.length < 2) {
    return {
      isValid: false,
      word: wordStr,
      score: 0,
      goldEarned: 0,
      basePoints: cardSum,
      lengthBonus: 0,
      extensionBonus: 0,
      comboMultiplier: 1,
      isExtension: false,
      newCombo: 1,
      message: 'En az 2 harfli kelime oluşturun!'
    };
  }

  // Prevent duplicate words in the same stage
  if (playedWordsThisStage.includes(upperWord)) {
    return {
      isValid: false,
      word: wordStr,
      score: 0,
      goldEarned: 0,
      basePoints: cardSum,
      lengthBonus: 0,
      extensionBonus: 0,
      comboMultiplier: 1,
      isExtension: false,
      newCombo: 1,
      message: `"${wordStr}" bu bölümde zaten kullanıldı!`
    };
  }

  const valid = isWordValid(upperWord);
  if (!valid) {
    return {
      isValid: false,
      word: wordStr,
      score: 0,
      goldEarned: 0,
      basePoints: cardSum,
      lengthBonus: 0,
      extensionBonus: 0,
      comboMultiplier: 1,
      isExtension: false,
      newCombo: 1,
      message: `"${wordStr}" sözlükte bulunamadı!`
    };
  }

  // Length Bonus
  const lengthBonus = getLengthBonus(upperWord.length);

  // Word Extension Bonus
  const extension = isWordExtension(lastPlayedWord, upperWord);
  const extensionBonus = extension ? 8 : 0;

  // Word Archetypes & Multipliers
  let archetype = { name: 'Dengeli', bonusMultiplier: 1.0, gold: 3 };
  if (upperWord.length === 3) {
    archetype = { name: 'Hızlı (Fast)', bonusMultiplier: 1.0, gold: 3, comboBonus: 1 };
  } else if (upperWord.length === 5) {
    archetype = { name: 'Güçlü (Strong)', bonusMultiplier: 1.25, gold: 6 };
  } else if (upperWord.length >= 6) {
    archetype = { name: 'Usta (Master)', bonusMultiplier: 1.5, gold: 12 };
  }

  // Relic Multipliers
  let relicScoreMultiplier = 1.0;
  if (activeRelicKeys.includes('ESKI_SOZLUK') && upperWord.length >= 5) {
    relicScoreMultiplier += 0.3; // +30%
  }
  if (activeRelicKeys.includes('MUREKKEP') && isFirstWordInStage) {
    relicScoreMultiplier *= 2.0; // 2x on first word
  }

  // Combo progression
  const hasSeriKatip = activeRelicKeys.includes('SERI_KATIP');
  const comboIncrement = (hasSeriKatip ? 2 : 1) + (archetype.comboBonus || 0) + perkComboBoost;
  const nextCombo = currentCombo + comboIncrement;

  // Total Score Calculation
  const subtotal = (cardSum + lengthBonus + extensionBonus) * archetype.bonusMultiplier * doubleMultiplier;
  const totalScore = Math.floor(subtotal * currentCombo * relicScoreMultiplier);

  // Gold Earned
  const totalGoldEarned = archetype.gold + (extension ? 4 : 0);

  return {
    isValid: true,
    word: upperWord,
    score: totalScore,
    goldEarned: totalGoldEarned,
    basePoints: cardSum,
    lengthBonus: lengthBonus,
    extensionBonus: extensionBonus,
    comboMultiplier: currentCombo,
    doubleMultiplier: doubleMultiplier,
    relicMultiplier: relicScoreMultiplier,
    isExtension: extension,
    newCombo: nextCombo,
    archetype: archetype,
    message: extension ? '⚡ KELİME ZİNCİRİ GENİŞLETİLDİ!' : '✓ GEÇERLİ KELİME!'
  };
}

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
  if (length === 3) return 2;
  if (length === 4) return 4;
  if (length === 5) return 4 + 5; // +9 (+5 Bonus on Slot #5)
  if (length === 6) return 7 + 5 + 10; // +22 (+10 Bonus on Slot #6)
  if (length === 7) return 11 + 5 + 10 + 15; // +41 (+15 Bonus on Slot #7)
  return 16 + 30 + (length - 8) * 8;
}

export function isWordExtension(previousWord, newWord) {
  if (!previousWord || !newWord) return false;
  const p = previousWord.toUpperCase().trim();
  const n = newWord.toUpperCase().trim();
  return n.length > p.length && (n.startsWith(p) || n.endsWith(p) || n.includes(p));
}

export function isWordTransformation(previousWord, newWord) {
  if (!previousWord || !newWord) return false;
  const p = previousWord.toUpperCase().trim();
  const n = newWord.toUpperCase().trim();

  // If it's already an extension, it's not a pure transform
  if (isWordExtension(p, n)) return false;

  // Must be at least 3 letters
  if (p.length < 2 || n.length < 3) return false;

  // Check character overlap
  let pMap = {};
  for (let ch of p) pMap[ch] = (pMap[ch] || 0) + 1;

  let sharedCount = 0;
  for (let ch of n) {
    if (pMap[ch] && pMap[ch] > 0) {
      sharedCount++;
      pMap[ch]--;
    }
  }

  // Transformation requires sharing at least 2 letters (or 50%+ of previous word length)
  const reqShared = Math.min(2, p.length);
  return sharedCount >= reqShared;
}

/**
 * Calculates score, perks, relic synergies, and word archetype rewards
 */
export const TURKISH_ALPHABET = [
  'A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'Ğ', 'H',
  'I', 'İ', 'J', 'K', 'L', 'M', 'N', 'O', 'Ö', 'P',
  'R', 'S', 'Ş', 'T', 'U', 'Ü', 'V', 'Y', 'Z'
];

/**
 * Resolves Joker cards in selectedCards to valid Turkish letters that form a valid dictionary word.
 */
function scoreJokerCandidate(candidate, letter) {
  let score = 100;
  // Heavy penalty for obscure trailing double vowels (e.g. SANAA, SELAA)
  if (/(AA|EE|II|İİ|UU|ÜÜ|OO|ÖÖ)$/i.test(candidate)) {
    score -= 90;
  }
  // Bonus for natural Turkish letter endings (T, L, M, N, R, K, S, D, B, E, İ)
  const preferredLetters = ['T', 'L', 'M', 'N', 'R', 'K', 'S', 'D', 'B', 'P', 'Y', 'Z', 'E', 'İ'];
  if (preferredLetters.includes((letter || '').toUpperCase())) {
    score += 30;
  }
  return score;
}

function solveJokerWord(selectedCards, playedWordsThisStage = []) {
  const jokerIndices = [];
  selectedCards.forEach((c, idx) => {
    if (c.isSpecial && (c.specialType === 'joker' || c.type === 'joker')) {
      jokerIndices.push(idx);
    }
  });

  const buildCandidateStr = (jokerSubstitutions = {}) => {
    let str = '';
    selectedCards.forEach((c, idx) => {
      if (c.isSpecial) {
        if (c.specialType === 'joker' || c.type === 'joker') {
          str += jokerSubstitutions[idx] || 'A';
        }
      } else {
        str += c.letter || '';
      }
    });
    return str.toUpperCase('tr-TR').trim();
  };

  if (jokerIndices.length === 0) {
    return {
      word: buildCandidateStr(),
      hasJoker: false,
      jokerMap: {},
      isResolved: true
    };
  }

  // 1 Joker case
  if (jokerIndices.length === 1) {
    const jIdx = jokerIndices[0];
    let candidatePool = [];

    for (const letter of TURKISH_ALPHABET) {
      const candidate = buildCandidateStr({ [jIdx]: letter });
      if (candidate.length >= 2 && isWordValid(candidate) && !playedWordsThisStage.includes(candidate)) {
        candidatePool.push({
          word: candidate,
          letter,
          score: scoreJokerCandidate(candidate, letter)
        });
      }
    }

    if (candidatePool.length > 0) {
      candidatePool.sort((a, b) => b.score - a.score);
      return {
        word: candidatePool[0].word,
        hasJoker: true,
        jokerMap: { [jIdx]: candidatePool[0].letter },
        isResolved: true
      };
    }

    const fallbackWord = buildCandidateStr({ [jIdx]: 'A' });
    return {
      word: fallbackWord,
      hasJoker: true,
      jokerMap: { [jIdx]: 'A' },
      isResolved: false
    };
  }

  // 2+ Jokers case
  if (jokerIndices.length >= 2) {
    const j1 = jokerIndices[0];
    const j2 = jokerIndices[1];
    let candidatePool = [];

    for (const l1 of TURKISH_ALPHABET) {
      for (const l2 of TURKISH_ALPHABET) {
        const candidate = buildCandidateStr({ [j1]: l1, [j2]: l2 });
        if (candidate.length >= 2 && isWordValid(candidate) && !playedWordsThisStage.includes(candidate)) {
          const score = scoreJokerCandidate(candidate, l1) + scoreJokerCandidate(candidate, l2);
          candidatePool.push({
            word: candidate,
            subst: { [j1]: l1, [j2]: l2 },
            score
          });
        }
      }
    }

    if (candidatePool.length > 0) {
      candidatePool.sort((a, b) => b.score - a.score);
      return {
        word: candidatePool[0].word,
        hasJoker: true,
        jokerMap: candidatePool[0].subst,
        isResolved: true
      };
    }

    const fallbackWord = buildCandidateStr({ [j1]: 'A', [j2]: 'A' });
    return {
      word: fallbackWord,
      hasJoker: true,
      jokerMap: { [j1]: 'A', [j2]: 'A' },
      isResolved: false
    };
  }

  return {
    word: buildCandidateStr(),
    hasJoker: false,
    jokerMap: {},
    isResolved: true
  };
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
  isFirstWordInStage = false,
  boardSlotModifiers = {},
  wordTypeLevels = {}
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
      chainType: 'NONE',
      comboMultiplier: 1,
      isExtension: false,
      newCombo: 1,
      archetype: null,
      message: 'Lütfen harf seçin!'
    };
  }

  const jokerSolution = solveJokerWord(selectedCards, playedWordsThisStage);
  const wordStr = jokerSolution.word;
  let cardSum = 0;
  let doubleMultiplier = 1;
  let polychromeMultiplier = 1.0;
  let sealBonusChips = 0;
  let sealBonusMult = 0;
  let perkComboBoost = 0;
  let infusedComboBoost = 0;
  let slotComboBoost = 0;
  let infusedBonusGold = 0;
  let slotBonusGold = 0;
  let extraDrawCards = 0;
  let isBankUsed = false;
  const activeSlotEffects = [];

  const hasKeskinKalem = activeRelicKeys.includes('KESKIN_KALEM');

  selectedCards.forEach((card, idx) => {
    if (card.fromBank) {
      isBankUsed = true;
    }

    // Process Board Slot Modifiers for slot index idx (0..7)
    const slotMod = boardSlotModifiers[idx];
    let slotLetterMult = 1;
    if (slotMod === '2xH') {
      slotLetterMult = 2;
      activeSlotEffects.push('2x Harf Yuvası');
    } else if (slotMod === '3xH') {
      slotLetterMult = 3;
      activeSlotEffects.push('3x Harf Yuvası');
    } else if (slotMod === '2xK') {
      doubleMultiplier *= 2;
      activeSlotEffects.push('2x Kelime Yuvası');
    } else if (slotMod === 'GOLD_5') {
      slotBonusGold += 5;
      activeSlotEffects.push('+5 Altın Yuvası');
    } else if (slotMod === 'COMBO_1') {
      slotComboBoost += 1;
      activeSlotEffects.push('+1 Kombo Yuvası');
    }

    // Number of evaluations (1 for normal, 2 for Red Seal!)
    const evaluationsCount = card.seal === 'RED_SEAL' ? 2 : 1;

    for (let evalIdx = 0; evalIdx < evaluationsCount; evalIdx++) {
      if (card.isSpecial) {
        if (card.specialType === 'joker' || card.type === 'joker') {
          // Joker base points = 0 (substitutes missing letter, 0 base points)
          cardSum += (card.points || 0) * slotLetterMult;
        } else if (card.specialType === 'double' || card.type === 'double') {
          doubleMultiplier *= 2;
        } else if (card.specialType === 'mirror' || card.type === 'mirror') {
          // Mirror tile: copies preceding card points
          const prevCard = idx > 0 ? selectedCards[idx - 1] : null;
          const mirroredPts = prevCard ? (prevCard.points || 2) : 2;
          cardSum += mirroredPts * slotLetterMult;
        } else if (card.specialType === 'golden' || card.type === 'golden') {
          cardSum += 10 * slotLetterMult;
          slotBonusGold += 15;
        } else if (card.specialType === 'ash' || card.type === 'ash') {
          cardSum += 25 * slotLetterMult;
        } else if (card.specialType === 'chain_tile' || card.type === 'chain_tile') {
          cardSum += 5 * slotLetterMult;
        }
      } else {
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

        cardSum += cardPts * slotLetterMult;
      }

      // Seal Bonuses (Foil, Holographic, Polychrome, Emerald, Lightning, Crown)
      if (card.seal === 'FOIL') {
        sealBonusChips += 30;
      } else if (card.seal === 'HOLOGRAPHIC') {
        sealBonusMult += 15;
      } else if (card.seal === 'POLYCHROME') {
        polychromeMultiplier *= 1.5;
      } else if (card.seal === 'EMERALD_SEAL') {
        slotBonusGold += 15;
      } else if (card.seal === 'LIGHTNING_SEAL') {
        slotComboBoost += 2;
      } else if (card.seal === 'CROWN_SEAL' && selectedCards.length >= 5) {
        sealBonusChips += 50;
        sealBonusMult += 20;
      }

      // Infused Elemental Perks
      if (card.infusedType === 'ignited') {
        infusedComboBoost += 2;
      } else if (card.infusedType === 'electric') {
        extraDrawCards += 1;
      } else if (card.infusedType === 'lucky') {
        infusedBonusGold += 6;
      }
    }
  });

  const upperWord = wordStr.toUpperCase().trim();
  const lengthBonus = getLengthBonus(upperWord.length);
  const potentialSubtotal = (cardSum + lengthBonus + sealBonusChips) * doubleMultiplier * polychromeMultiplier;
  const potentialScore = Math.max(1, Math.floor(potentialSubtotal * (currentCombo || 1)));

  if (upperWord.length < 2) {
    return {
      isValid: false,
      word: wordStr,
      score: 0,
      potentialScore: potentialScore,
      goldEarned: 0,
      basePoints: cardSum,
      lengthBonus: 0,
      extensionBonus: 0,
      chainType: 'NONE',
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
      potentialScore: potentialScore,
      goldEarned: 0,
      basePoints: cardSum,
      lengthBonus: 0,
      extensionBonus: 0,
      chainType: 'NONE',
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
      potentialScore: potentialScore,
      goldEarned: 0,
      basePoints: cardSum,
      lengthBonus: lengthBonus,
      extensionBonus: 0,
      chainType: 'NONE',
      comboMultiplier: currentCombo || 1,
      isExtension: false,
      newCombo: 1,
      message: `"${wordStr}" TDK sözlüğünde bulunamadı!`
    };
  }

  // Word Chain Analysis (UZAT vs DÖNÜŞTÜR)
  let chainType = 'NONE';
  let chainBonus = 0;

  const isExtension = isWordExtension(lastPlayedWord, upperWord);
  const isTransform = !isExtension && isWordTransformation(lastPlayedWord, upperWord);

  if (isExtension) {
    chainType = 'EXTEND';
    chainBonus = 10; // +10 flat bonus points
  } else if (isTransform) {
    chainType = 'TRANSFORM';
    chainBonus = 6; // +6 flat bonus points
  }

  // Duplicate letter check for Çift Harf Relic
  const charCounts = {};
  let hasDuplicateLetters = false;
  for (let ch of upperWord) {
    charCounts[ch] = (charCounts[ch] || 0) + 1;
    if (charCounts[ch] >= 2) hasDuplicateLetters = true;
  }

  // Rebalanced Word Archetypes & Multipliers (Gold: 2 - 5)
  let archetype = { name: 'Dengeli', bonusMultiplier: 1.0, gold: 2 };
  if (upperWord.length === 3) {
    archetype = { name: 'Hızlı (Fast)', bonusMultiplier: 1.0, gold: 2, comboBonus: 1 };
  } else if (upperWord.length === 5) {
    archetype = { name: 'Güçlü (Strong)', bonusMultiplier: 1.25, gold: 3 };
  } else if (upperWord.length >= 6) {
    archetype = { name: 'Usta (Master)', bonusMultiplier: 1.5, gold: 5 };
  }

  // Relic Multipliers & Synergy
  let relicScoreMultiplier = 1.0;
  if (activeRelicKeys.includes('UZUN_SOZ') && upperWord.length >= 5) {
    relicScoreMultiplier += 0.25; // +25%
  }
  if (activeRelicKeys.includes('KISA_SOZ') && (upperWord.length === 3 || upperWord.length === 4)) {
    relicScoreMultiplier += 0.20; // +20%
  }
  const rareLetters = ['Ş', 'Ğ', 'Ç', 'Ö', 'Ü', 'Z'];
  const containsRare = rareLetters.some(char => upperWord.includes(char));
  if (activeRelicKeys.includes('NADIR_MUHUR') && containsRare) {
    relicScoreMultiplier += 0.30; // +30%
  }
  if (activeRelicKeys.includes('MUREKKEP') && isFirstWordInStage) {
    relicScoreMultiplier *= 2.0; // 2x on first word
  }
  if (activeRelicKeys.includes('ZINCIR_USTASI') && chainType !== 'NONE') {
    relicScoreMultiplier += 0.30; // +30% on Zincir
  }
  if (activeRelicKeys.includes('BANKACI') && isBankUsed) {
    relicScoreMultiplier += 0.40; // +40% on Bank Use
  }
  if (activeRelicKeys.includes('CIFT_HARF') && hasDuplicateLetters) {
    relicScoreMultiplier += 0.25; // +25% on Double Letters
  }
  // Üç Sesli Mührü: 3 different vowels
  const vowels = ['A', 'E', 'I', 'İ', 'O', 'Ö', 'U', 'Ü'];
  const uniqueVowels = new Set([...upperWord].filter(c => vowels.includes(c)));
  if (activeRelicKeys.includes('UC_SESLI') && uniqueVowels.size >= 3) {
    relicScoreMultiplier += 0.35; // +35% on 3 Vowels
  }
  // Son Harf Tılsımı: 2x final letter points
  if (activeRelicKeys.includes('SON_HARF') && selectedCards.length > 0) {
    const lastCard = selectedCards[selectedCards.length - 1];
    if (lastCard && !lastCard.isSpecial) {
      cardSum += (lastCard.points || 1);
    }
  }

  // Chain Type extra percentage multiplier
  if (chainType === 'EXTEND') relicScoreMultiplier += 0.20; // +20%
  if (chainType === 'TRANSFORM') relicScoreMultiplier += 0.15; // +15%

  // Combo progression
  const hasSeriKatip = activeRelicKeys.includes('SERI_KATIP');
  const comboBoostFromChain = chainType !== 'NONE' ? 1 : 0;
  const comboIncrement = (hasSeriKatip ? 2 : 1) + (archetype.comboBonus || 0) + perkComboBoost + infusedComboBoost + slotComboBoost + comboBoostFromChain;
  const nextCombo = currentCombo + comboIncrement;

  // Efsun Kitapları Word Type Level Bonuses
  let wordTypeChips = 0;
  let wordTypeMult = 0;

  if (upperWord.length === 3 && wordTypeLevels.SHORT_3) {
    wordTypeChips += (wordTypeLevels.SHORT_3.level - 1) * 15;
    wordTypeMult += (wordTypeLevels.SHORT_3.level - 1) * 3;
  } else if (upperWord.length === 4 && wordTypeLevels.MEDIUM_4) {
    wordTypeChips += (wordTypeLevels.MEDIUM_4.level - 1) * 15;
    wordTypeMult += (wordTypeLevels.MEDIUM_4.level - 1) * 3;
  } else if (upperWord.length >= 5 && wordTypeLevels.LONG_5) {
    wordTypeChips += (wordTypeLevels.LONG_5.level - 1) * 20;
    wordTypeMult += (wordTypeLevels.LONG_5.level - 1) * 4;
  }

  // Total Score Calculation (Balatro Chips x Mult Engine)
  const totalChips = cardSum + lengthBonus + chainBonus + sealBonusChips + wordTypeChips;
  const effectiveComboMult = (currentCombo + sealBonusMult + wordTypeMult) * doubleMultiplier * relicScoreMultiplier * polychromeMultiplier;
  const totalScore = Math.floor(totalChips * effectiveComboMult * archetype.bonusMultiplier);

  // Rebalanced Gold Earned
  let totalGoldEarned = archetype.gold + (chainType === 'EXTEND' ? 3 : chainType === 'TRANSFORM' ? 1 : 0) + infusedBonusGold + slotBonusGold;
  if (activeRelicKeys.includes('ALTIN_SOZLUK') && upperWord.length >= 5) {
    totalGoldEarned += 2;
  }

  // Visual Feedback Message
  let msg = '✓ GEÇERLİ KELİME!';
  if (chainType === 'EXTEND') {
    msg = '⚡ KELİME ZİNCİRİ (UZATMAN)! (+%20 Çarpan)';
  } else if (chainType === 'TRANSFORM') {
    msg = '🔀 KELİME DÖNÜŞÜMÜ! (+%15 Çarpan)';
  }

  return {
    isValid: true,
    word: upperWord,
    score: totalScore,
    potentialScore: totalScore,
    goldEarned: totalGoldEarned,
    basePoints: cardSum,
    lengthBonus: lengthBonus,
    extensionBonus: chainBonus,
    chainType: chainType,
    isBankUsed: isBankUsed,
    hasDuplicateLetters: hasDuplicateLetters,
    comboMultiplier: currentCombo,
    doubleMultiplier: doubleMultiplier,
    relicMultiplier: relicScoreMultiplier,
    isExtension: isExtension,
    newCombo: nextCombo,
    archetype: archetype,
    message: msg
  };
}

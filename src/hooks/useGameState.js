import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { STARTER_DECKS, createDeckFromLetterList, createCard, LETTER_DEFINITIONS, SPECIAL_CARDS } from '../game/cardData';
import { calculateWordScore } from '../game/wordEngine';
import { soundEngine } from '../game/audioEngine';
import { generateRunMap, generateKademe } from '../game/mapGenerator';
import { RELICS } from '../game/relicData';
import { getWordMeaning } from '../services/dictionaryService';
import { discoverCodexItem } from '../game/codexManager';
import { checkNewAchievements } from '../game/achievementsData';
import { INITIAL_WORD_LEVELS } from '../game/planetData';

export function getStageTargetScore(stage) {
  if (stage === 1) return 50;
  if (stage === 2) return 80;
  if (stage === 3) return 120;
  if (stage === 4) return 180;
  if (stage === 5) return 250;
  if (stage === 10) return 400; // Boss Stage 10
  return Math.floor(50 * Math.pow(1.35, stage - 1));
}

export function getBossStageRule(stage) {
  if (stage === 9 || stage === 10) return { title: 'Kelime Mücadelesi', desc: '8 tur içinde 400 puan yap!', maxHands: 8, handSize: 7 };
  return null;
}

export function useGameState() {
  // Meta progression

  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('kd_high_score') || '0', 10);
  });

  const [unlockedDecks, setUnlockedDecks] = useState(() => {
    return JSON.parse(localStorage.getItem('kd_unlocked_decks') || '["starter_basit"]');
  });

  const [selectedDeckId, setSelectedDeckId] = useState('starter_basit');
  const [maxWordsInBattle, setMaxWordsInBattle] = useState(0);
  const [runUnlockedAchievements, setRunUnlockedAchievements] = useState([]);

  // Active Run State (Kademe / Ante System)
  const [currentKademe, setCurrentKademe] = useState(1);
  const [kademeData, setKademeData] = useState(() => generateKademe(1));
  const [currentBlindIndex, setCurrentBlindIndex] = useState(0);
  const [activeTags, setActiveTags] = useState([]);
  const [guaranteedRareCard, setGuaranteedRareCard] = useState(false);
  const [shopDiscountPercent, setShopDiscountPercent] = useState(0);
  const [extraDiscardsNextStage, setExtraDiscardsNextStage] = useState(0);

  const [mapFloors, setMapFloors] = useState([]);
  const [currentFloorIndex, setCurrentFloorIndex] = useState(0);
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [gold, setGold] = useState(20);
  const [lives, setLives] = useState(3); // ♥ ♥ ♥ Lives
  const [activeRelicKeys, setActiveRelicKeys] = useState([]);

  const [stage, setStage] = useState(1);
  const [currentScore, setCurrentScore] = useState(0);
  const [targetScore, setTargetScore] = useState(50);
  const [handsLeft, setHandsLeft] = useState(6);
  const [discardsLeft, setDiscardsLeft] = useState(3);
  const [combo, setCombo] = useState(1);
  const [comboTimeLeft, setComboTimeLeft] = useState(10);
  const [lastPlayedWord, setLastPlayedWord] = useState('');
  const [playedWordsThisStage, setPlayedWordsThisStage] = useState([]);
  const [isFirstWordInStage, setIsFirstWordInStage] = useState(true);
  const [wordCategoryLevels, setWordCategoryLevels] = useState(INITIAL_WORD_LEVELS);


  // Active Boss Rule & Bonus Objective State
  const [activeBossRule, setActiveBossRule] = useState(null);
  const [activeBonusObjective, setActiveBonusObjective] = useState(null);
  const [isBonusCompleted, setIsBonusCompleted] = useState(false);
  const [campBonusPoints, setCampBonusPoints] = useState(0);

  // Live Run Stats for Real-Time Achievement Evaluation
  const [runStats, setRunStats] = useState({
    maxWordLength: 0,
    maxCombo: 1,
    maxSingleWordScore: 0,
    totalGoldEarned: 20,
    maxStage: 1,
    totalWordsPlayed: 0,
    challengeScore: 0,
    triviaWins: 0,
    activeJokersCount: 0
  });

  const triggerAchievementCheck = useCallback((statsUpdate = {}) => {
    setRunStats(prev => {
      const updated = {
        ...prev,
        ...statsUpdate,
        maxWordLength: Math.max(prev.maxWordLength, statsUpdate.maxWordLength || 0),
        maxCombo: Math.max(prev.maxCombo, statsUpdate.maxCombo || 1),
        maxSingleWordScore: Math.max(prev.maxSingleWordScore, statsUpdate.maxSingleWordScore || 0),
        totalGoldEarned: Math.max(prev.totalGoldEarned, statsUpdate.totalGoldEarned || prev.totalGoldEarned),
        maxStage: Math.max(prev.maxStage, statsUpdate.maxStage || prev.maxStage),
        totalWordsPlayed: prev.totalWordsPlayed + (statsUpdate.playedWordIncrement || 0),
        triviaWins: prev.triviaWins + (statsUpdate.triviaWinsIncrement || 0),
        activeJokersCount: statsUpdate.activeJokersCount !== undefined ? statsUpdate.activeJokersCount : prev.activeJokersCount
      };

      const newlyUnlocked = checkNewAchievements(updated);
      if (newlyUnlocked.length > 0) {
        soundEngine.playVictory();
        try { confetti({ particleCount: 85, spread: 90, origin: { y: 0.5 } }); } catch(e) {}
        newlyUnlocked.forEach(ach => {
          discoverCodexItem(ach.rewardName);
          setRunUnlockedAchievements(p => [...p, ach]);
          setGoalNotice({
            category: '🏆 YENİ BAŞARIM KAZANILDI!',
            title: ach.title,
            description: `${ach.unlockedDesc} - Ödül: ${ach.rewardName}`,
            rewardGold: 25
          });
        });
      }
      return updated;
    });
  }, []);

  // Deck collections
  const [fullDeck, setFullDeck] = useState([]);
  const [drawPile, setDrawPile] = useState([]);
  const [discardPile, setDiscardPile] = useState([]);
  const [hand, setHand] = useState([]);
  const [bankCards, setBankCards] = useState([]); // Harf Bankasi (Maks 2 Slot)

  // Balatro-style Efsun Kitapları (Word Type Level Up State)
  const [wordTypeLevels, setWordTypeLevels] = useState({
    SHORT_3: { id: 'SHORT_3', name: '📘 3 Harfli Kelimeler', level: 1, cost: 25, bonusChips: 15, bonusMult: 3 },
    MEDIUM_4: { id: 'MEDIUM_4', name: '📗 4 Harfli Kelimeler', level: 1, cost: 30, bonusChips: 15, bonusMult: 3 },
    LONG_5: { id: 'LONG_5', name: '📙 5+ Harfli Kelimeler', level: 1, cost: 40, bonusChips: 20, bonusMult: 4 }
  });

  const upgradeWordTypeLevel = (typeId) => {
    const target = wordTypeLevels[typeId];
    if (!target) return false;
    if (gold >= target.cost) {
      setGold(prev => prev - target.cost);
      setWordTypeLevels(prev => ({
        ...prev,
        [typeId]: {
          ...prev[typeId],
          level: prev[typeId].level + 1,
          cost: Math.round(prev[typeId].cost * 1.4)
        }
      }));
      soundEngine.playSuccess();
      return true;
    }
    return false;
  };
  const [selectedCards, setSelectedCards] = useState([]);

  // UI State
  const [gameState, setGameState] = useState('START_MENU'); // START_MENU | MAP | PLAYING | SHOP | EVENT | STAGE_VICTORY_SUMMARY | DRAFT_REWARD | GAME_OVER

  // Combo Decay Timer Effect (Decreases combo if player doesn't make a move within 10s)
  useEffect(() => {
    let interval;
    if (gameState === 'PLAYING' && combo > 1) {
      interval = setInterval(() => {
        setComboTimeLeft(prev => {
          if (prev <= 1) {
            soundEngine.playDeselect();
            setCombo(c => Math.max(1, c - 1));
            setFeedbackMessage('⚠️ Zaman doldu! Kombo düştü.');
            return 10;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setComboTimeLeft(10);
    }
    return () => clearInterval(interval);
  }, [gameState, combo]);
  const [lastScoreBreakdown, setLastScoreBreakdown] = useState(null);
  const [lastStageVictoryStats, setLastStageVictoryStats] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [currentWordMeaning, setCurrentWordMeaning] = useState(null);
  const [isMeaningModalOpen, setIsMeaningModalOpen] = useState(false);
  const [goalNotice, setGoalNotice] = useState(null);
  const [activeAchievementToast, setActiveAchievementToast] = useState(null);

  // Dynamic Biome, Floor Modifier & Board Slot Modifiers State
  const [activeBiome, setActiveBiome] = useState(null);
  const [activeFloorModifier, setActiveFloorModifier] = useState(null);
  const [boardSlotModifiers, setBoardSlotModifiers] = useState({});

  const generateBoardSlotModifiers = (floorNumber = 1) => {
    // Kat 1 & Kat 2: Clean empty slots #1..#7 without multipliers
    if (floorNumber <= 2) {
      return {};
    }

    const possibleMods = ['2xH', '3xH', '2xK', 'GOLD_5', 'COMBO_1'];
    const slots = [0, 1, 2, 3, 4, 5, 6];
    const shuffledSlots = [...slots].sort(() => 0.5 - Math.random());

    // Progressive unlock: Kat 3..4 -> 1 mod, Kat 5..9 -> 2 mods, Kat 10+ -> 3 mods
    let chosenCount = 1;
    if (floorNumber >= 10) {
      chosenCount = 3;
    } else if (floorNumber >= 5) {
      chosenCount = 2;
    }

    const result = {};
    for (let i = 0; i < chosenCount; i++) {
      const slotIdx = shuffledSlots[i];
      const mod = possibleMods[Math.floor(Math.random() * possibleMods.length)];
      result[slotIdx] = mod;
    }
    return result;
  };

  const proceedFromVictory = () => {
    soundEngine.playTap();

    // Mark current blind COMPLETED and unlock next blind in current Kademe
    const updatedBlinds = kademeData.blinds.map((b, i) => {
      if (i === currentBlindIndex) return { ...b, status: 'COMPLETED' };
      if (i === currentBlindIndex + 1) return { ...b, status: 'ACTIVE' };
      return b;
    });

    setKademeData(prev => ({ ...prev, blinds: updatedBlinds }));

    const isLastBlind = currentBlindIndex >= kademeData.blinds.length - 1;
    const isBossBlind = kademeData.blinds[currentBlindIndex]?.type === 'BOSS_BLIND';

    if (!isBossBlind && !isLastBlind) {
      // Small or Big Blind completed -> return to Kademe Run Track
      const nextIdx = currentBlindIndex + 1;
      setCurrentBlindIndex(nextIdx);
      setGameState('MAP');
    } else {
      // Boss Blind completed -> Open Shop!
      setCurrentBlindIndex(kademeData.blinds.length);
      setGameState('SHOP');
    }
  };

  const passTurnOrSurrender = () => {
    if (gameState !== 'PLAYING') return;
    soundEngine.playDeselect();

    const nextHands = handsLeft - 1;
    setHandsLeft(nextHands);

    if (nextHands <= 0) {
      soundEngine.playInvalidWord();
      setFeedbackMessage('⚠️ Hamle hakkın kalmadı! Tur sona erdi.');
      setTimeout(() => {
        setGameState('GAME_OVER');
      }, 1200);
    } else {
      setFeedbackMessage(`⚠️ Tur pas geçildi! Kalan el hakkı: ${nextHands}`);
      const allToDiscard = [...discardPile, ...hand, ...selectedCards];
      setSelectedCards([]);
      const refilled = fillHandFromDrawPile([], drawPile, allToDiscard, 7);
      setHand(refilled.newHand);
      setDrawPile(refilled.newDraw);
      setDiscardPile(refilled.newDiscard);
    }
  };

  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const fillHandFromDrawPile = useCallback((currentHand, currentDraw, currentDiscard, targetHandSize = 7) => {
    // Hand limit cap max 7 — oyuncu en fazla 7 taş tutabilir
    const maxHandCapacity = 7;
    const effectiveTarget = Math.min(targetHandSize, maxHandCapacity);

    // Dedup currentHand by ID to prevent cloned cards in hand
    const cleanHand = currentHand.filter((card, idx, arr) => card && arr.findIndex(c => c.id === card.id) === idx);

    let needed = effectiveTarget - cleanHand.length;
    if (needed <= 0) return { newHand: cleanHand, newDraw: currentDraw, newDiscard: currentDiscard };

    // Filter out cards already present in hand from draw and discard pool
    const handIds = new Set(cleanHand.map(c => c.id));
    let pool = (currentDraw || []).filter(c => c && !handIds.has(c.id));
    let disc = (currentDiscard || []).filter(c => c && !handIds.has(c.id));

    if (pool.length < needed && disc.length > 0) {
      pool = shuffleArray([...pool, ...disc]);
      disc = [];
    }

    // Ensure pool has unique cards by ID
    pool = pool.filter((card, idx, arr) => arr.findIndex(c => c.id === card.id) === idx);

    const drawn = pool.slice(0, needed);
    const remainingDraw = pool.slice(needed);
    const newHand = [...cleanHand, ...drawn];

    return { newHand, newDraw: remainingDraw, newDiscard: disc };
  }, []);

  const [secretWordTrigger, setSecretWordTrigger] = useState('GİZEM');
  const [isSecretFoundThisRun, setIsSecretFoundThisRun] = useState(false);

  /**
   * Start a new Run (Kademe 1)
   */
  const startNewRun = (deckId = selectedDeckId) => {
    const starter = STARTER_DECKS.find(d => d.id === deckId) || STARTER_DECKS[0];
    let lettersToUse = starter.letters;

    if (starter.isErratic) {
      const allLetterKeys = Object.keys(LETTER_DEFINITIONS);
      lettersToUse = Array.from({ length: 20 }, () => allLetterKeys[Math.floor(Math.random() * allLetterKeys.length)]);
    }

    const initialCards = createDeckFromLetterList(lettersToUse);
    const initialKademe = generateKademe(1);

    const secretTriggers = ['GİZEM', 'SİHRİ', 'ALTIN', 'KADER', 'EFSANE', 'BİLGİ', 'EVRİM', 'YILDIZ'];
    const pickedSecret = secretTriggers[Math.floor(Math.random() * secretTriggers.length)];

    setCurrentKademe(1);
    setKademeData(initialKademe);
    setCurrentBlindIndex(0);

    if (starter.bonusGold) {
      setGold(20 + starter.bonusGold);
    } else {
      setGold(20);
    }

    // Auto-discover starting deck letters and biome in Codex
    initialCards.forEach(c => {
      discoverCodexItem(c.letter);
      if (c.seal) discoverCodexItem(c.seal);
    });
    if (initialKademe?.biome?.id) discoverCodexItem(initialKademe.biome.id);
    setActiveTags([]);
    setGuaranteedRareCard(false);
    setShopDiscountPercent(0);
    setExtraDiscardsNextStage(0);

    setMapFloors([initialKademe]);
    setCurrentFloorIndex(0);
    setGold(15);
    setLives(3);
    setActiveRelicKeys([]);
    setFullDeck(initialCards);
    setBankCards([]);
    setSecretWordTrigger(pickedSecret);
    setIsSecretFoundThisRun(false);
    setMaxWordsInBattle(0);
    setRunUnlockedAchievements([]);
    setGameState('MAP');
    soundEngine.playTap();
  };

  /**
   * Play current or specified blind in the Kademe
   */
  const playBlind = (blindIndex = currentBlindIndex) => {
    soundEngine.playTap();
    const targetBlind = kademeData.blinds[blindIndex];
    if (!targetBlind) return;

    if (targetBlind.type === 'EVENT') {
      setGameState('EVENT');
      return;
    }
    if (targetBlind.type === 'TRIVIA') {
      setGameState('TRIVIA');
      return;
    }
    if (targetBlind.type === 'CHALLENGE') {
      setGameState('CHALLENGE');
      return;
    }
    if (targetBlind.type === 'TREASURE') {
      soundEngine.playVictory();
      setGold(prev => prev + 40);
      setGoalNotice({ category: '💎 HAZİNE BULUNDU', title: 'Kilitli Sandık Açıldı!', description: '+40 Altın kazandın!', rewardGold: 40 });
      
      const updatedBlinds = kademeData.blinds.map((b, i) => {
        if (i === blindIndex) return { ...b, status: 'COMPLETED' };
        if (i === blindIndex + 1) return { ...b, status: 'ACTIVE' };
        return b;
      });
      setKademeData(prev => ({ ...prev, blinds: updatedBlinds }));
      setCurrentBlindIndex(blindIndex + 1);
      setGameState('MAP');
      return;
    }

    const maxHands = targetBlind.maxHandsOverride || (targetBlind.type === 'BOSS_BLIND' ? 7 : 6);
    const baseDiscards = 3 + extraDiscardsNextStage;
    setExtraDiscardsNextStage(0); // Consume extra discards

    const shuffled = shuffleArray(fullDeck);
    const drawn = shuffled.slice(0, 7);
    const remainingDraw = shuffled.slice(7);

    setStage(currentKademe);
    setCurrentScore(campBonusPoints);
    if (campBonusPoints > 0) {
      setFeedbackMessage(`☕ Kamp Bonusu Devrede! +${campBonusPoints} Puan ile başladın!`);
      setCampBonusPoints(0);
    }
    const safeScoreTarget = (targetBlind && typeof targetBlind.targetScore === 'number' && !isNaN(targetBlind.targetScore))
      ? targetBlind.targetScore
      : getStageTargetScore(currentKademe || 1);
    setTargetScore(safeScoreTarget);
    setHandsLeft(maxHands);
    setDiscardsLeft(baseDiscards);
    setCombo(1);
    setComboTimeLeft(10);
    setLastPlayedWord('');
    setPlayedWordsThisStage([]);
    setIsFirstWordInStage(true);
    setActiveBossRule(targetBlind.bossRule || null);
    setActiveBonusObjective(null);
    setIsBonusCompleted(false);
    setBoardSlotModifiers(generateBoardSlotModifiers(currentKademe));

    setDrawPile(remainingDraw);
    setDiscardPile([]);
    setHand(drawn);
    setSelectedCards([]);
    setLastScoreBreakdown(null);

    setFeedbackMessage(`${targetBlind.title} Başladı! Hedef: ${targetBlind.targetScore} Puan`);
    setGameState('PLAYING');
  };

  /**
   * Skip current blind to receive associated Tag reward!
   */
  const skipBlind = (blindIndex = currentBlindIndex) => {
    const targetBlind = kademeData.blinds[blindIndex];
    if (!targetBlind || !targetBlind.canSkip) return;

    soundEngine.playVictory();
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });

    const tag = targetBlind.tag;
    if (tag) {
      setActiveTags(prev => [...prev, tag]);

      // Execute Tag Effect
      if (tag.effect.type === 'ADD_GOLD') {
        setGold(prev => prev + tag.effect.amount);
        setGoalNotice({ category: '🏷️ ETİKET ÖDÜLÜ', title: tag.name, description: `+${tag.effect.amount} Altın kazandın!`, rewardGold: tag.effect.amount });
      } else if (tag.effect.type === 'ADD_DISCARDS') {
        setExtraDiscardsNextStage(prev => prev + tag.effect.amount);
        setGoalNotice({ category: '🏷️ ETİKET ÖDÜLÜ', title: tag.name, description: `Sonraki mücadele için +${tag.effect.amount} el yenileme hakkı eklendi!` });
      } else if (tag.effect.type === 'RARE_CARD_GUARANTEE') {
        setGuaranteedRareCard(true);
        setGoalNotice({ category: '🏷️ ETİKET ÖDÜLÜ', title: tag.name, description: 'Sonraki kart ödülünde garantili nadir harf sunulacak!' });
      } else if (tag.effect.type === 'SHOP_DISCOUNT') {
        setShopDiscountPercent(tag.effect.percent);
        setGoalNotice({ category: '🏷️ ETİKET ÖDÜLÜ', title: tag.name, description: 'Sonraki Dükkânda %25 indirim hakkı kazandın!' });
      } else if (tag.effect.type === 'FREE_EFSUN_UPGRADE') {
        const keys = Object.keys(wordTypeLevels);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        setWordTypeLevels(prev => ({
          ...prev,
          [randomKey]: { ...prev[randomKey], level: prev[randomKey].level + 1 }
        }));
        setGoalNotice({ category: '🏷️ ETİKET ÖDÜLÜ', title: tag.name, description: `${wordTypeLevels[randomKey].name} +1 Seviye Yükseldi!` });
      } else if (tag.effect.type === 'GRANT_RANDOM_RELIC') {
        const allRelicKeys = ['KESKIN_KALEM', 'UZUN_SOZ', 'KISA_SOZ', 'NADIR_MUHUR', 'SERI_KATIP', 'MUREKKEP', 'ZINCIR_USTASI', 'BANKACI', 'CIFT_HARF'];
        const unowned = allRelicKeys.filter(k => !activeRelicKeys.includes(k));
        if (unowned.length > 0) {
          const rewardRelic = unowned[Math.floor(Math.random() * unowned.length)];
          setActiveRelicKeys(prev => [...prev, rewardRelic]);
        }
        setGoalNotice({ category: '🏷️ ETİKET ÖDÜLÜ', title: tag.name, description: 'Rastgele 1 Emanet kazandın!' });
      } else if (tag.effect.type === 'ADD_JOKER_CARD') {
        const jokerCard = { id: `card_joker_${Date.now()}`, letter: '🃏', points: 0, rarity: 'nadir', isSpecial: true, specialType: 'joker' };
        setFullDeck(prev => [...prev, jokerCard]);
        setGoalNotice({ category: '🏷️ ETİKET ÖDÜLÜ', title: tag.name, description: 'Desteğe 🃏 Joker Harfi eklendi!' });
      }
    }

    // Mark current blind SKIPPED and activate next blind
    const updatedBlinds = kademeData.blinds.map((b, i) => {
      if (i === blindIndex) return { ...b, status: 'SKIPPED' };
      if (i === blindIndex + 1) return { ...b, status: 'ACTIVE' };
      return b;
    });

    setKademeData(prev => ({ ...prev, blinds: updatedBlinds }));
    const nextIdx = blindIndex + 1;
    setCurrentBlindIndex(nextIdx);
    setFeedbackMessage(`⏩ ${targetBlind.title} atlandı! Etiket ödülü alındı.`);
  };

  /**
   * Backward compatible enterMapNode helper
   */
  const enterMapNode = (nodeOrBlind) => {
    if (typeof nodeOrBlind === 'number') {
      playBlind(nodeOrBlind);
    } else if (nodeOrBlind && typeof nodeOrBlind.index === 'number') {
      playBlind(nodeOrBlind.index);
    } else {
      playBlind(currentBlindIndex);
    }
  };

  const selectCardFromHand = (card) => {
    if (gameState !== 'PLAYING') return;
    if (!card || selectedCards.some(c => c.id === card.id)) return; // Prevent duplicate selection

    if (card.isSpecial && card.specialType === 'delete') {
      soundEngine.playDeleteSound();
      const newHand = hand.filter(c => c.id !== card.id);
      const newDiscard = [...discardPile, card];
      const bossRule = getBossStageRule(stage);
      const handSize = bossRule ? bossRule.handSize : 7;
      const refilled = fillHandFromDrawPile(newHand, drawPile, newDiscard, handSize);
      setHand(refilled.newHand);
      setDrawPile(refilled.newDraw);
      setDiscardPile(refilled.newDiscard);
      setFeedbackMessage('Kart silindi!');
      return;
    }

    if (card.isSpecial && card.specialType === 'refresh') {
      soundEngine.playTap();
      const allToDiscard = [...discardPile, ...hand];
      const bossRule = getBossStageRule(stage);
      const handSize = bossRule ? bossRule.handSize : 7;
      const refilled = fillHandFromDrawPile([], drawPile, allToDiscard, handSize);
      setHand(refilled.newHand);
      setDrawPile(refilled.newDraw);
      setDiscardPile(refilled.newDiscard);
      setFeedbackMessage('El harfleri yenilendi!');
      return;
    }

    if (card.specialType === 'joker' || card.type === 'joker') {
      setPendingJokerCard(card);
      return;
    }

    soundEngine.playTap();
    setHand(prev => prev.filter(c => c.id !== card.id));
    setSelectedCards(prev => prev.some(c => c.id === card.id) ? prev : [...prev, card]);
  };

  const [pendingJokerCard, setPendingJokerCard] = useState(null);

  const handleAssignJokerLetter = (chosenLetter) => {
    if (!pendingJokerCard) return;
    soundEngine.playTap();
    const isFromBank = pendingJokerCard.fromBank;

    const assignedCard = {
      ...pendingJokerCard,
      letter: chosenLetter.toUpperCase('tr-TR'),
      assignedLetter: chosenLetter.toUpperCase('tr-TR'),
      displayLetter: `${chosenLetter.toUpperCase('tr-TR')} (🃏)`,
      points: 0
    };

    if (isFromBank) {
      setBankCards(prev => prev.filter(c => c.id !== pendingJokerCard.id));
    } else {
      setHand(prev => prev.filter(c => c.id !== pendingJokerCard.id));
    }

    setSelectedCards(prev => [...prev, assignedCard]);
    setPendingJokerCard(null);
    setFeedbackMessage(`🃏 Joker "${chosenLetter.toUpperCase('tr-TR')}" harfine dönüştürüldü!`);
  };

  const bankCardFromHand = (card) => {
    if (gameState !== 'PLAYING') return;
    if (!card) return;
    if (bankCards.length >= 2) {
      soundEngine.playInvalidWord();
      setFeedbackMessage('⚠️ Harf Bankası dolu! En fazla 2 harf saklanabilir.');
      return;
    }
    soundEngine.playTap();
    setHand(prev => prev.filter(c => c.id !== card.id));
    setBankCards(prev => prev.some(c => c.id === card.id) ? prev : [...prev, card]);
    setFeedbackMessage(`🏦 "${card.letter}" Harf Bankasına kaldırıldı!`);
  };

  const unbankCardToHand = (card) => {
    if (gameState !== 'PLAYING') return;
    if (!card) return;
    if (hand.length >= 7) {
      soundEngine.playInvalidWord();
      setFeedbackMessage('⚠️ El dolu! (Maks 7 taş tutabilirsin)');
      return;
    }
    soundEngine.playTap();
    setBankCards(prev => prev.filter(c => c.id !== card.id));
    setHand(prev => prev.some(c => c.id === card.id) ? prev : [...prev, card]);
    setFeedbackMessage(`"${card.letter}" Harf Bankasından ele geri alındı.`);
  };

  const selectCardFromBank = (card) => {
    if (gameState !== 'PLAYING') return;
    if (!card || selectedCards.some(c => c.id === card.id)) return;
    soundEngine.playTap();
    setBankCards(prev => prev.filter(c => c.id !== card.id));
    setSelectedCards(prev => [...prev, { ...card, fromBank: true }]);
  };

  const unselectCard = (index) => {
    if (gameState !== 'PLAYING') return;
    soundEngine.playDeselect();
    const targetCard = selectedCards[index];
    if (!targetCard) return;

    setSelectedCards(prev => prev.filter((_, i) => i !== index));

    const cleanCard = { ...targetCard };
    if (cleanCard.specialType === 'joker' || cleanCard.type === 'joker') {
      cleanCard.letter = '🃏';
      delete cleanCard.assignedLetter;
      delete cleanCard.displayLetter;
    }

    if (cleanCard.fromBank) {
      delete cleanCard.fromBank;
      setBankCards(prev => prev.some(c => c.id === cleanCard.id) ? prev : [...prev, cleanCard]);
    } else {
      setHand(prev => prev.some(c => c.id === cleanCard.id) ? prev : [...prev, cleanCard]);
    }
  };

  const clearSelectedCards = () => {
    if (selectedCards.length === 0) return;
    soundEngine.playDeselect();
    const returnToBank = selectedCards.filter(c => c.fromBank).map(c => {
      const clean = { ...c };
      delete clean.fromBank;
      return clean;
    });
    const returnToHand = selectedCards.filter(c => !c.fromBank);

    if (returnToBank.length > 0) {
      setBankCards(prev => {
        const bankIds = new Set(prev.map(c => c.id));
        const newItems = returnToBank.filter(c => !bankIds.has(c.id));
        return [...prev, ...newItems];
      });
    }
    if (returnToHand.length > 0) {
      setHand(prev => {
        const handIds = new Set(prev.map(c => c.id));
        const newItems = returnToHand.filter(c => !handIds.has(c.id));
        return [...prev, ...newItems];
      });
    }
    setSelectedCards([]);
  };

  const playWord = () => {
    if (gameState !== 'PLAYING') return;
    if (selectedCards.length === 0) return;

    const breakdown = calculateWordScore(
      selectedCards,
      lastPlayedWord,
      combo,
      playedWordsThisStage,
      activeRelicKeys,
      isFirstWordInStage,
      boardSlotModifiers,
      wordTypeLevels
    );

    setLastScoreBreakdown(breakdown);

    if (!breakdown.isValid) {
      soundEngine.playInvalidWord();
      setCombo(1);
    setComboTimeLeft(10);
      const playCost = activeBossRule?.doublePlayCost ? 2 : 1;
      const nextHands = Math.max(0, handsLeft - playCost);
      setHandsLeft(nextHands);
      setFeedbackMessage(`⚠️ ${breakdown.message} (-${playCost} Hamle, Kombo Sıfırlandı!)`);
      if (nextHands <= 0) {
        setTimeout(() => {
          setGameState('GAME_OVER');
        }, 1200);
      }
      return;
    }

    // Active Boss Rule Constraint Check
    if (activeBossRule) {
      if (activeBossRule.minWordLength && breakdown.word.length < activeBossRule.minWordLength) {
        soundEngine.playInvalidWord();
        setFeedbackMessage(`⚠️ ${activeBossRule.title}: En az ${activeBossRule.minWordLength} harfli kelime yazmalısın!`);
        return;
      }
      if (activeBossRule.noE && breakdown.word.includes('E')) {
        soundEngine.playInvalidWord();
        setFeedbackMessage(`⚠️ ${activeBossRule.title}: "E" harfi içeren kelimeler yasak! (0 Puan)`);
        return;
      }
    }

    // Check Bonus Objective Progress
    let bonusBonusGold = 0;
    if (activeBonusObjective && !isBonusCompleted) {
      let isDone = false;
      if (activeBonusObjective.targetLength && breakdown.word.length >= activeBonusObjective.targetLength) isDone = true;
      if (activeBonusObjective.targetCombo && breakdown.newCombo >= activeBonusObjective.targetCombo) isDone = true;
      if (activeBonusObjective.requireRare) {
        const rareLetters = ['Ş', 'Ğ', 'Ç', 'Ö', 'Ü', 'Z'];
        if (rareLetters.some(l => breakdown.word.includes(l))) isDone = true;
      }
      if (isDone) {
        setIsBonusCompleted(true);
        bonusBonusGold = activeBonusObjective.rewardGold || 15;
        setGoalNotice({
          category: '🎯 GÖREV TAMAMLANDI',
          title: activeBonusObjective.title || 'KADEMELİ HEDEF BAŞARILDI',
          description: activeBonusObjective.desc || `"${breakdown.word}" kelimesi ile hedef başarıldı!`,
          rewardGold: bonusBonusGold
        });
      }
    }

    // Secret Word Trigger Check
    if (secretWordTrigger && breakdown.word === secretWordTrigger && !isSecretFoundThisRun) {
      setIsSecretFoundThisRun(true);
      confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 } });

      const infusedTypes = ['ignited', 'electric', 'lucky', 'frozen'];
      const randomInfused = infusedTypes[Math.floor(Math.random() * infusedTypes.length)];
      const rareLetters = ['Ş', 'Z', 'Ğ', 'Ç', 'Ö', 'Ü'];
      const pickLetter = rareLetters[Math.floor(Math.random() * rareLetters.length)];
      const infusedCard = createCard(pickLetter, 1, randomInfused);

      setFullDeck(prev => [...prev, infusedCard]);

      setGoalNotice({
        category: '🌌 GİZLİ GEÇİT AÇILDI!',
        title: `Gizli Kelime Çözüldü: "${secretWordTrigger}"`,
        description: `Efsanevi Tapınak Geçidi Açıldı! Desteğe ${pickLetter} (${randomInfused.toUpperCase()}) Harfi Eklendi!`,
        rewardGold: 35,
        rewardSecret: 'Efsanevi Mühürlü Harf'
      });
      bonusBonusGold += 35;
    }

    // Process single-use Ash (🔥) tile consumption
    const ashCardsPlayed = selectedCards.filter(c => c.specialType === 'ash' || c.type === 'ash');
    if (ashCardsPlayed.length > 0) {
      const ashIds = ashCardsPlayed.map(c => c.id);
      setFullDeck(prev => prev.filter(c => !ashIds.includes(c.id)));
    }

    // Valid word played!
    soundEngine.playWordSuccess(combo);
    setIsFirstWordInStage(false);
    setPlayedWordsThisStage(prev => [...prev, breakdown.word.toUpperCase()]);

    // Progressive Codex Item Discoveries (Letters, Seals, Relics, Biomes)
    breakdown.word.toUpperCase().split('').forEach(char => discoverCodexItem(char));
    selectedCards.forEach(c => {
      if (c.seal) discoverCodexItem(c.seal);
      if (c.specialType) discoverCodexItem(c.specialType);
    });
    if (activeBiome?.id) discoverCodexItem(activeBiome.id);
    activeRelicKeys.forEach(k => discoverCodexItem(k));

    const newScore = currentScore + breakdown.score;
    const earnedGold = (breakdown.goldEarned || 3) + bonusBonusGold;
    const newGold = gold + earnedGold;
    const playCost = activeBossRule?.doublePlayCost ? 2 : 1;
    const nextHands = Math.max(0, handsLeft - playCost);

    // REAL-TIME ACHIEVEMENT CHECK TRIGGER
    triggerAchievementCheck({
      maxWordLength: breakdown.word.length,
      maxCombo: breakdown.newCombo,
      maxSingleWordScore: breakdown.score,
      playedWordIncrement: 1,
      totalGoldEarned: newGold,
      activeJokersCount: activeRelicKeys.length,
      maxStage: currentKademe
    });
    const nextCombo = breakdown.newCombo;

    setCurrentScore(newScore);
    setGold(newGold);
    setHandsLeft(nextHands);
    setCombo(nextCombo);
    setComboTimeLeft(10);
    setLastPlayedWord(breakdown.word);

    // Fetch TDK Word Meaning asynchronously
    getWordMeaning(breakdown.word).then(meaning => {
      if (meaning) {
        setCurrentWordMeaning(meaning);
      }
    });

    // REAL-TIME ACHIEVEMENT CHECK
    const wordsThisBattle = playedWordsThisStage.length + 1;
    setMaxWordsInBattle(prev => Math.max(prev, wordsThisBattle));

    const newlyUnlocked = checkNewAchievements({
      maxWordLength: breakdown.word.length,
      maxCombo: nextCombo,
      totalGoldEarned: newGold,
      maxStage: stage,
      maxSingleWordScore: breakdown.score,
      totalWordsPlayed: wordsThisBattle
    });
    if (newlyUnlocked.length > 0) {
      setActiveAchievementToast(newlyUnlocked[0]);
      setRunUnlockedAchievements(prev => [...prev, ...newlyUnlocked]);
    }

    let msg = `${breakdown.message} (+${earnedGold} 💰 Altın)`;
    if (bonusBonusGold > 0) msg += ` 🎉 BONUS HEDEF TAMAMLANDI! (+${bonusBonusGold} 💰)`;
    setFeedbackMessage(msg);

    const resetJokerCard = (card) => {
      if (!card) return card;
      if (card.specialType === 'joker' || card.type === 'joker' || card.isJoker || card.letter === '🃏') {
        return {
          ...card,
          letter: '🃏',
          assignedLetter: undefined,
          displayLetter: undefined
        };
      }
      return card;
    };

    const newDiscard = [...discardPile, ...selectedCards].map(resetJokerCard);
    setSelectedCards([]);

    // Check Stage Victory
    if (newScore >= targetScore) {
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      soundEngine.playVictory();

      const overkillGold = newScore > targetScore ? Math.min(8, Math.floor((newScore - targetScore) / 20)) : 0;
      const finalGoldEarned = earnedGold + overkillGold;
      setGold(prev => prev + overkillGold);

      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('kd_high_score', newScore.toString());
      }

      setLastStageVictoryStats({
        stage,
        score: newScore,
        targetScore,
        goldEarned: earnedGold,
        playedWords: [...playedWordsThisStage, breakdown.word.toUpperCase()],
        combo: nextCombo
      });

      setFeedbackMessage(`🎉 KADEME TAMAMLANDI! ${overkillGold > 0 ? `(+${overkillGold} 💰 Bonus Altın)` : ''}`);
      setTimeout(() => {
        setGameState('STAGE_VICTORY_SUMMARY');
      }, 700);
      return;
    }

    if (nextHands <= 0 && newScore < targetScore) {
      soundEngine.playInvalidWord();
      setFeedbackMessage('⚠️ Hamle hakkınız bitti! Baraj puanına ulaşılamadığı için mücadele elendi.');
      setTimeout(() => {
        setGameState('GAME_OVER');
      }, 1000);
      return;
    }

    const refilled = fillHandFromDrawPile(hand, drawPile, newDiscard, 7);
    setHand(refilled.newHand);
    setDrawPile(refilled.newDraw);
    setDiscardPile(refilled.newDiscard);
  };

  const discardAndRedraw = () => {
    if (gameState !== 'PLAYING') return;
    if (discardsLeft <= 0) {
      setFeedbackMessage('Yenileme hakkınız kalmadı!');
      return;
    }

    soundEngine.playTap();
    const nextDiscards = discardsLeft - 1;
    setDiscardsLeft(nextDiscards);

    const resetJokerCard = (card) => {
      if (!card) return card;
      if (card.specialType === 'joker' || card.type === 'joker' || card.isJoker) {
        return {
          ...card,
          letter: '🃏',
          assignedLetter: undefined,
          displayLetter: undefined
        };
      }
      return card;
    };

    const allToDiscard = [...discardPile, ...hand, ...selectedCards].map(resetJokerCard);
    setSelectedCards([]);

    const bossRule = getBossStageRule(stage);
    const handSize = bossRule ? bossRule.handSize : 7;
    const refilled = fillHandFromDrawPile([], drawPile, allToDiscard, handSize);

    setHand(refilled.newHand);
    setDrawPile(refilled.newDraw);
    setDiscardPile(refilled.newDiscard);

    // Purple Seal Trigger: Free Efsun card on discard
    const discardedCards = hand.filter(c => !selectedCards.includes(c));
    const hasPurpleSeal = discardedCards.some(c => c.seal === 'PURPLE_SEAL' || c.isPurpleSeal);
    if (hasPurpleSeal) {
      const efsunKeys = ['GOLDEN', 'MIRROR', 'DOUBLE', 'ASH'];
      const pickedKey = efsunKeys[Math.floor(Math.random() * efsunKeys.length)];
      const bonusCard = createCard(pickedKey);
      setFullDeck(prev => [...prev, bonusCard]);
      soundEngine.playUpgradeSound();
      setFeedbackMessage(`🟣 Mor Mühür Tetiklendi: Bedava ${bonusCard.name} kazandın!`);
    } else {
      setFeedbackMessage(`El yenilendi! (Kalan: ${nextDiscards})`);
    }
  };

  const handleSellPassiveJoker = (jokerId) => {
    setActiveRelicKeys(prev => prev.filter(id => id !== jokerId));
    setGold(prev => prev + 15);
    soundEngine.playCoins();
    setFeedbackMessage(`💵 Pasif Joker $15 Altına satıldı!`);
  };

  const handleReorderPassiveJokers = (newOrder) => {
    setActiveRelicKeys(newOrder);
    soundEngine.playTap();
  };

  // Stage Draft Reward & Blind Progression
  const advanceAfterDraft = (updatedDeck) => {
    setFullDeck(updatedDeck);

    // Mark current blind COMPLETED and unlock next blind in current Kademe
    const updatedBlinds = kademeData.blinds.map((b, i) => {
      if (i === currentBlindIndex) return { ...b, status: 'COMPLETED' };
      if (i === currentBlindIndex + 1) return { ...b, status: 'ACTIVE' };
      return b;
    });

    setKademeData(prev => ({ ...prev, blinds: updatedBlinds }));

    if (currentBlindIndex < 2) {
      // Small/Big Blind passed -> return to Kademe Screen with next blind active
      const nextIdx = currentBlindIndex + 1;
      setCurrentBlindIndex(nextIdx);
      setGameState('MAP');
    } else {
      // Boss Blind passed -> Open Shop!
      setCurrentBlindIndex(3);
      setGameState('SHOP');
    }
  };

  const handleAddCardToDeck = (letterOrSpecialKey) => {
    soundEngine.playUpgradeSound();
    const newCard = createCard(letterOrSpecialKey);
    const updated = [...fullDeck, newCard];
    advanceAfterDraft(updated);
  };

  const handleUpgradeCardInDeck = (cardId) => {
    soundEngine.playUpgradeSound();
    const updated = fullDeck.map(c => {
      if (c.id === cardId) {
        return createCard(c.letter, (c.upgradeLevel || 0) + 1);
      }
      return c;
    });
    advanceAfterDraft(updated);
  };

  const handleRemoveCardFromDeck = (cardId) => {
    soundEngine.playDeleteSound();
    const updated = fullDeck.filter(c => c.id !== cardId);
    advanceAfterDraft(updated);
  };

  const handleShopBuyCard = (cardKey, cost) => {
    const effectiveCost = shopDiscountPercent > 0 ? Math.round(cost * (1 - shopDiscountPercent / 100)) : cost;
    if (gold >= effectiveCost) {
      soundEngine.playUpgradeSound();
      setGold(prev => prev - effectiveCost);
      const newCard = createCard(cardKey);
      setFullDeck(prev => [...prev, newCard]);
    }
  };

  const handleShopUpgradePerk = (cardId, cost) => {
    const effectiveCost = shopDiscountPercent > 0 ? Math.round(cost * (1 - shopDiscountPercent / 100)) : cost;
    if (gold >= effectiveCost) {
      soundEngine.playUpgradeSound();
      setGold(prev => prev - effectiveCost);
      setFullDeck(prev => prev.map(c => {
        if (c.id === cardId) {
          return createCard(c.letter, (c.upgradeLevel || 0) + 1);
        }
        return c;
      }));
    }
  };

  const handleShopRemoveCard = (cardId, cost) => {
    const effectiveCost = shopDiscountPercent > 0 ? Math.round(cost * (1 - shopDiscountPercent / 100)) : cost;
    if (gold >= effectiveCost && fullDeck.length > 6) {
      soundEngine.playDeleteSound();
      setGold(prev => prev - effectiveCost);
      setFullDeck(prev => prev.filter(c => c.id !== cardId));
    }
  };

  const handleShopBuyRelic = (relicId, cost) => {
    const effectiveCost = shopDiscountPercent > 0 ? Math.round(cost * (1 - shopDiscountPercent / 100)) : cost;
    if (gold >= effectiveCost && !activeRelicKeys.includes(relicId)) {
      soundEngine.playVictory();
      setGold(prev => prev - effectiveCost);
      setActiveRelicKeys(prev => [...prev, relicId]);
    }
  };

  const handleLeaveShop = () => {
    const nextKademeNum = currentKademe + 1;
    const nextKademe = generateKademe(nextKademeNum);

    setCurrentKademe(nextKademeNum);
    setKademeData(nextKademe);
    setCurrentBlindIndex(0);
    setShopDiscountPercent(0);
    setGameState('MAP');
  };

  // Event Action
  const handleResolveEvent = (actionKey) => {
    soundEngine.playTap();
    if (actionKey === 'GOLD_35') setGold(prev => prev + 35);
    if (actionKey === 'GOLD_50') setGold(prev => prev + 50);
    if (actionKey === 'GOLD_15') setGold(prev => prev + 15);
    if (actionKey === 'GOLD_25') setGold(prev => prev + 25);
    if (actionKey === 'GOLD_40') setGold(prev => prev + 40);
    if (actionKey === 'GOLD_60') setGold(prev => prev + 60);

    if (actionKey === 'ADD_RARE') {
      const rareKeys = ['Ş', 'Ğ', 'Ç', 'Ö', 'Ü'];
      const pick = rareKeys[Math.floor(Math.random() * rareKeys.length)];
      setFullDeck(prev => [...prev, createCard(pick)]);
    }

    if (actionKey === 'ADD_INFUSED') {
      const types = ['ignited', 'lucky', 'electric'];
      const pickedType = types[Math.floor(Math.random() * types.length)];
      const pickLetter = ['A', 'E', 'K', 'L', 'S', 'T'][Math.floor(Math.random() * 6)];
      setFullDeck(prev => [...prev, createCard(pickLetter, 0, pickedType)]);
    }

    if (actionKey === 'BUY_INFUSED_20' && gold >= 20) {
      setGold(prev => prev - 20);
      setFullDeck(prev => [...prev, createCard('A', 0, 'ignited')]);
    }

    if (actionKey === 'BUY_RELIC_35' && gold >= 35) {
      setGold(prev => prev - 35);
      const allRelicKeys = ['KESKIN_KALEM', 'UZUN_SOZ', 'KISA_SOZ', 'NADIR_MUHUR', 'SERI_KATIP', 'MUREKKEP', 'ZINCIR_USTASI', 'BANKACI', 'CIFT_HARF'];
      const unowned = allRelicKeys.filter(k => !activeRelicKeys.includes(k));
      if (unowned.length > 0) {
        const rewardKey = unowned[Math.floor(Math.random() * unowned.length)];
        setActiveRelicKeys(prev => [...prev, rewardKey]);
      }
    }

    if (actionKey === 'BUY_JOKER_30' && gold >= 30) {
      setGold(prev => prev - 30);
      const jokerCard = { id: `card_joker_${Date.now()}`, letter: '🃏', points: 0, rarity: 'nadir', isSpecial: true, specialType: 'joker' };
      setFullDeck(prev => [...prev, jokerCard]);
    }

    if (actionKey === 'REMOVE_CARD_EVENT' && fullDeck.length > 6) {
      setFullDeck(prev => prev.slice(1));
    }

    if (actionKey === 'TRY_CHEST') {
      const isSuccess = Math.random() < 0.7;
      if (isSuccess) {
        setGold(prev => prev + 50);
        setFeedbackMessage('🎉 Sandığı başarıyla açtın! +50 Altın!');
      } else {
        setFeedbackMessage('⚠️ Sandık kilitli kaldı!');
      }
    }

    if (actionKey === 'UPGRADE_FREE' && fullDeck.length > 0) {
      const randomCard = fullDeck[Math.floor(Math.random() * fullDeck.length)];
      setFullDeck(prev => prev.map(c => c.id === randomCard.id ? createCard(c.letter, (c.upgradeLevel || 0) + 1) : c));
    }

    // Advance Kademe blind progression
    const updatedBlinds = kademeData.blinds.map((b, i) => {
      if (i === currentBlindIndex) return { ...b, status: 'COMPLETED' };
      if (i === currentBlindIndex + 1) return { ...b, status: 'ACTIVE' };
      return b;
    });
    setKademeData(prev => ({ ...prev, blinds: updatedBlinds }));
    const nextIdx = currentBlindIndex + 1;
    setCurrentBlindIndex(nextIdx);
    setGameState('MAP');
  };

  // Trivia Action
  const handleResolveTrivia = (actionKey, isCorrect) => {
    soundEngine.playTap();
    if (isCorrect) {
      setGold(prev => prev + 40);
      setFeedbackMessage('🎉 Bilmece Mücadelesi Tamamlandı! +40 Altın kazandın!');
    } else {
      setFeedbackMessage('💡 Bilmece Mücadelesi Sona Erdi.');
    }
    
    // Advance Kademe blind progression
    const updatedBlinds = kademeData.blinds.map((b, i) => {
      if (i === currentBlindIndex) return { ...b, status: 'COMPLETED' };
      if (i === currentBlindIndex + 1) return { ...b, status: 'ACTIVE' };
      return b;
    });
    setKademeData(prev => ({ ...prev, blinds: updatedBlinds }));
    const nextIdx = currentBlindIndex + 1;
    setCurrentBlindIndex(nextIdx);
    setGameState('MAP');
  };

  // Speed Challenge Action
  const handleResolveChallenge = (goldReward = 0, challengeScore = 0) => {
    soundEngine.playTap();
    if (goldReward > 0) {
      setGold(prev => prev + goldReward);
    }
    setFeedbackMessage(`⚡ Süreli Harf Challenge Tamamlandı! +${goldReward} 💰 Altın (Skor: ${challengeScore})`);

    const newlyUnlocked = checkNewAchievements({
      challengeScore
    });
    if (newlyUnlocked.length > 0) {
      setActiveAchievementToast(newlyUnlocked[0]);
      setRunUnlockedAchievements(prev => [...prev, ...newlyUnlocked]);
    }

    // Advance Kademe blind progression
    const updatedBlinds = kademeData.blinds.map((b, i) => {
      if (i === currentBlindIndex) return { ...b, status: 'COMPLETED' };
      if (i === currentBlindIndex + 1) return { ...b, status: 'ACTIVE' };
      return b;
    });
    setKademeData(prev => ({ ...prev, blinds: updatedBlinds }));
    const nextIdx = currentBlindIndex + 1;
    setCurrentBlindIndex(nextIdx);
    setGameState('MAP');
  };

  // Camp Action
  const handleResolveCamp = (actionType, extraData = {}) => {
    soundEngine.playTap();
    if (actionType === 'REMOVE_CARD' && extraData.cardId) {
      setFullDeck(prev => prev.filter(c => c.id !== extraData.cardId));
    }
    if (actionType === 'UPGRADE_CARD' && extraData.cardId) {
      setFullDeck(prev => prev.map(c => c.id === extraData.cardId ? createCard(c.letter, (c.upgradeLevel || 0) + 1) : c));
    }
    if (actionType === 'ENTER_BOSS') {
      if (extraData.bonusPoints) {
        setCampBonusPoints(extraData.bonusPoints);
      }
      setCurrentFloorIndex(prev => prev + 1);
      setGameState('MAP');
    }
  };

  const unlockDeck = (deckId) => {
    if (!unlockedDecks.includes(deckId)) {
      const newUnlocked = [...unlockedDecks, deckId];
      setUnlockedDecks(newUnlocked);
      localStorage.setItem('kd_unlocked_decks', JSON.stringify(newUnlocked));
      soundEngine.playVictory();
    }
  };

  const openWordMeaningModal = async (wordToLookup) => {
    const target = wordToLookup || lastPlayedWord;
    if (!target) return;
    soundEngine.playTap();
    const meaning = await getWordMeaning(target);
    if (meaning) {
      setCurrentWordMeaning(meaning);
      setIsMeaningModalOpen(true);
    }
  };

  const closeWordMeaningModal = () => {
    soundEngine.playTap();
    setIsMeaningModalOpen(false);
  };

  const clearGoalNotice = () => {
    setGoalNotice(null);
  };

  return {
    mapFloors,
    currentFloorIndex,
    activeNodeId,
    gold,
    lives,
    activeRelicKeys,
    stage,
    currentScore,
    targetScore,
    handsLeft,
    discardsLeft,
    combo,
    comboTimeLeft,
    lastPlayedWord,
    playedWordsThisStage,
    activeBossRule,
    activeBonusObjective,
    isBonusCompleted,
    fullDeck,
    drawPile,
    discardPile,
    hand,
    bankCards,
    selectedCards,
    gameState,
    lastScoreBreakdown,
    lastStageVictoryStats,
    feedbackMessage,
    highScore,
    unlockedDecks,
    selectedDeckId,
    currentWordMeaning,
    isMeaningModalOpen,
    handleBuyPlanetCard: (planetCard) => {
      if (gold < planetCard.cost) return false;
      setGold(prev => prev - planetCard.cost);
      soundEngine.playPurchase();
      const len = planetCard.targetLength;
      setWordCategoryLevels(prev => {
        const current = prev[len] || { level: 1, chips: 0, mult: 0 };
        return {
          ...prev,
          [len]: {
            level: current.level + 1,
            chips: current.chips + planetCard.baseChipsBonus,
            mult: current.mult + planetCard.baseMultBonus
          }
        };
      });
      return true;
    },
    goalNotice,
    activeBiome,
    activeFloorModifier,
    boardSlotModifiers,
    wordTypeLevels,
    wordCategoryLevels,

    currentKademe,
    kademeData,
    currentBlindIndex,
    activeTags,
    guaranteedRareCard,
    shopDiscountPercent,

    playBlind,
    skipBlind,
    setSelectedDeckId,
    startNewRun,
    enterMapNode,
    selectCardFromHand,
    bankCardFromHand,
    unbankCardToHand,
    selectCardFromBank,
    unselectCard,
    clearSelectedCards,
    playWord,
    passTurnOrSurrender,
    proceedFromVictory,
    proceedToRewardsFromVictory: proceedFromVictory,
    discardAndRedraw,
    handleAddCardToDeck,
    handleUpgradeCardInDeck,
    handleRemoveCardFromDeck,
    handleShopBuyCard,
    handleShopUpgradePerk,
    handleShopRemoveCard,
    handleShopBuyRelic,
    handleSellPassiveJoker,
    handleReorderPassiveJokers,
    handleLeaveShop,
    handleResolveEvent,
    handleResolveTrivia,
    handleResolveChallenge,
    handleResolveCamp,
    upgradeWordTypeLevel,
    unlockDeck,
    openWordMeaningModal,
    closeWordMeaningModal,
    pendingJokerCard,
    setPendingJokerCard,
    handleAssignJokerLetter,
    clearGoalNotice,
    activeAchievementToast,
    setActiveAchievementToast,
    maxWordsInBattle,
    runUnlockedAchievements,
    setGameState
  };
}

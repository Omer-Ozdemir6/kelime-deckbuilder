import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { STARTER_DECKS, createDeckFromLetterList, createCard, LETTER_DEFINITIONS, SPECIAL_CARDS } from '../game/cardData';
import { calculateWordScore } from '../game/wordEngine';
import { soundEngine } from '../game/audioEngine';
import { generateRunMap } from '../game/mapGenerator';
import { RELICS } from '../game/relicData';

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
  if (stage === 9 || stage === 10) return { title: 'Kelime Sınavı', desc: '8 tur içinde 400 puan yap!', maxHands: 8, handSize: 7 };
  return null;
}

export function useGameState() {
  // Meta progression
  const [starPoints, setStarPoints] = useState(() => {
    return parseInt(localStorage.getItem('kd_star_points') || '0', 10);
  });

  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('kd_high_score') || '0', 10);
  });

  const [unlockedDecks, setUnlockedDecks] = useState(() => {
    return JSON.parse(localStorage.getItem('kd_unlocked_decks') || '["starter_basit"]');
  });

  const [selectedDeckId, setSelectedDeckId] = useState('starter_basit');

  // Active Run State
  const [mapNodes, setMapNodes] = useState([]);
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
  const [gold, setGold] = useState(20);
  const [lives, setLives] = useState(3); // ♥ ♥ ♥ Lives
  const [activeRelicKeys, setActiveRelicKeys] = useState([]);

  const [stage, setStage] = useState(1);
  const [currentScore, setCurrentScore] = useState(0);
  const [targetScore, setTargetScore] = useState(50);
  const [handsLeft, setHandsLeft] = useState(6);
  const [discardsLeft, setDiscardsLeft] = useState(3);
  const [combo, setCombo] = useState(1);
  const [lastPlayedWord, setLastPlayedWord] = useState('');
  const [playedWordsThisStage, setPlayedWordsThisStage] = useState([]);
  const [isFirstWordInStage, setIsFirstWordInStage] = useState(true);

  // Deck collections
  const [fullDeck, setFullDeck] = useState([]);
  const [drawPile, setDrawPile] = useState([]);
  const [discardPile, setDiscardPile] = useState([]);
  const [hand, setHand] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);

  // UI State
  const [gameState, setGameState] = useState('START_MENU'); // START_MENU | MAP | PLAYING | SHOP | EVENT | DRAFT_REWARD | GAME_OVER
  const [lastScoreBreakdown, setLastScoreBreakdown] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const fillHandFromDrawPile = useCallback((currentHand, currentDraw, currentDiscard, targetHandSize = 7) => {
    // Hand limit cap max 9
    const maxHandCapacity = 9;
    const effectiveTarget = Math.min(targetHandSize, maxHandCapacity);
    let needed = effectiveTarget - currentHand.length;
    if (needed <= 0) return { newHand: currentHand, newDraw: currentDraw, newDiscard: currentDiscard };

    let pool = [...currentDraw];
    let disc = [...currentDiscard];

    if (pool.length < needed && disc.length > 0) {
      pool = shuffleArray([...pool, ...disc]);
      disc = [];
    }

    const drawn = pool.slice(0, needed);
    const remainingDraw = pool.slice(needed);
    const newHand = [...currentHand, ...drawn];

    return { newHand, newDraw: remainingDraw, newDiscard: disc };
  }, []);

  /**
   * Start a new Run
   */
  const startNewRun = (deckId = selectedDeckId) => {
    const starter = STARTER_DECKS.find(d => d.id === deckId) || STARTER_DECKS[0];
    const initialCards = createDeckFromLetterList(starter.letters);
    const newNodes = generateRunMap();

    setMapNodes(newNodes);
    setCurrentNodeIndex(0);
    setGold(20);
    setLives(3);
    setActiveRelicKeys([]);
    setFullDeck(initialCards);
    setGameState('MAP');
    soundEngine.playTap();
  };

  /**
   * Enter a node from the map
   */
  const enterMapNode = (node) => {
    soundEngine.playTap();
    if (node.type === 'SHOP') {
      setGameState('SHOP');
      return;
    }
    if (node.type === 'EVENT') {
      setGameState('EVENT');
      return;
    }

    // Battle / Stage node
    const stg = node.stage;
    const bossRule = getBossStageRule(stg);
    const handSize = bossRule ? bossRule.handSize : 7;
    const maxHands = bossRule ? bossRule.maxHands : 6;

    const shuffled = shuffleArray(fullDeck);
    const drawn = shuffled.slice(0, handSize);
    const remainingDraw = shuffled.slice(handSize);

    setStage(stg);
    setCurrentScore(0);
    setTargetScore(node.targetScore || getStageTargetScore(stg));
    setHandsLeft(maxHands);
    setDiscardsLeft(3);
    setCombo(1);
    setLastPlayedWord('');
    setPlayedWordsThisStage([]);
    setIsFirstWordInStage(true);

    setDrawPile(remainingDraw);
    setDiscardPile([]);
    setHand(drawn);
    setSelectedCards([]);
    setLastScoreBreakdown(null);
    setFeedbackMessage(`${node.title} Başladı!`);
    setGameState('PLAYING');
  };

  const selectCardFromHand = (card) => {
    if (gameState !== 'PLAYING') return;

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

    soundEngine.playTap();
    setHand(prev => prev.filter(c => c.id !== card.id));
    setSelectedCards(prev => [...prev, card]);
  };

  const unselectCard = (index) => {
    if (gameState !== 'PLAYING') return;
    soundEngine.playDeselect();
    const targetCard = selectedCards[index];
    setSelectedCards(prev => prev.filter((_, i) => i !== index));
    setHand(prev => [...prev, targetCard]);
  };

  const clearSelectedCards = () => {
    if (selectedCards.length === 0) return;
    soundEngine.playDeselect();
    setHand(prev => [...prev, ...selectedCards]);
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
      isFirstWordInStage
    );

    setLastScoreBreakdown(breakdown);

    if (!breakdown.isValid) {
      soundEngine.playInvalidWord();
      setCombo(1);
      setFeedbackMessage(breakdown.message);
      return;
    }

    // Valid word played!
    soundEngine.playWordSuccess(combo);
    setIsFirstWordInStage(false);
    setPlayedWordsThisStage(prev => [...prev, breakdown.word.toUpperCase()]);

    const newScore = currentScore + breakdown.score;
    const newGold = gold + (breakdown.goldEarned || 3);
    const nextHands = handsLeft - 1;
    const nextCombo = breakdown.newCombo;

    setCurrentScore(newScore);
    setGold(newGold);
    setHandsLeft(nextHands);
    setCombo(nextCombo);
    setLastPlayedWord(breakdown.word);
    setFeedbackMessage(`${breakdown.message} (+${breakdown.goldEarned} 💰 Altın)`);

    const newDiscard = [...discardPile, ...selectedCards];
    setSelectedCards([]);

    // Check Stage Victory
    if (newScore >= targetScore) {
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      soundEngine.playVictory();

      const earnedStars = Math.floor(newScore / 20) + stage * 5;
      const updatedStars = starPoints + earnedStars;
      setStarPoints(updatedStars);
      localStorage.setItem('kd_star_points', updatedStars.toString());

      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('kd_high_score', newScore.toString());
      }

      setFeedbackMessage(`🎉 KADEME TAMAMLAMDI! +${earnedStars} Yıldız Puanı`);
      setTimeout(() => {
        setGameState('DRAFT_REWARD');
      }, 1200);
      return;
    }

    if (nextHands <= 0) {
      setFeedbackMessage('Tur kalmadı! Oyun bitti.');
      setTimeout(() => {
        setGameState('GAME_OVER');
      }, 1000);
      return;
    }

    const bossRule = getBossStageRule(stage);
    const handSize = bossRule ? bossRule.handSize : 7;
    const refilled = fillHandFromDrawPile(hand, drawPile, newDiscard, handSize);
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

    const allToDiscard = [...discardPile, ...hand, ...selectedCards];
    setSelectedCards([]);

    const bossRule = getBossStageRule(stage);
    const handSize = bossRule ? bossRule.handSize : 7;
    const refilled = fillHandFromDrawPile([], drawPile, allToDiscard, handSize);

    setHand(refilled.newHand);
    setDrawPile(refilled.newDraw);
    setDiscardPile(refilled.newDiscard);
    setFeedbackMessage(`El yenilendi! (Kalan: ${nextDiscards})`);
  };

  // Stage Draft Reward
  const advanceAfterDraft = (updatedDeck) => {
    setFullDeck(updatedDeck);
    setCurrentNodeIndex(prev => prev + 1);
    setGameState('MAP');
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

  // Shop Actions
  const handleShopBuyCard = (cardKey, cost) => {
    if (gold >= cost) {
      soundEngine.playUpgradeSound();
      setGold(prev => prev - cost);
      const newCard = createCard(cardKey);
      setFullDeck(prev => [...prev, newCard]);
    }
  };

  const handleShopUpgradePerk = (cardId, cost) => {
    if (gold >= cost) {
      soundEngine.playUpgradeSound();
      setGold(prev => prev - cost);
      setFullDeck(prev => prev.map(c => {
        if (c.id === cardId) {
          return createCard(c.letter, (c.upgradeLevel || 0) + 1);
        }
        return c;
      }));
    }
  };

  const handleShopRemoveCard = (cardId, cost) => {
    if (gold >= cost && fullDeck.length > 6) {
      soundEngine.playDeleteSound();
      setGold(prev => prev - cost);
      setFullDeck(prev => prev.filter(c => c.id !== cardId));
    }
  };

  const handleShopBuyRelic = (relicId, cost) => {
    if (gold >= cost && !activeRelicKeys.includes(relicId)) {
      soundEngine.playVictory();
      setGold(prev => prev - cost);
      setActiveRelicKeys(prev => [...prev, relicId]);
    }
  };

  const handleLeaveShop = () => {
    setCurrentNodeIndex(prev => prev + 1);
    setGameState('MAP');
  };

  // Event Action
  const handleResolveEvent = (actionKey) => {
    soundEngine.playTap();
    if (actionKey === 'GOLD_35') setGold(prev => prev + 35);
    if (actionKey === 'GOLD_50') setGold(prev => prev + 50);
    if (actionKey === 'GOLD_15') setGold(prev => prev + 15);
    if (actionKey === 'ADD_RARE') {
      const rareKeys = ['Ş', 'Ğ', 'Ç', 'Ö', 'Ü'];
      const pick = rareKeys[Math.floor(Math.random() * rareKeys.length)];
      setFullDeck(prev => [...prev, createCard(pick)]);
    }
    if (actionKey === 'UPGRADE_FREE' && fullDeck.length > 0) {
      const randomCard = fullDeck[Math.floor(Math.random() * fullDeck.length)];
      setFullDeck(prev => prev.map(c => c.id === randomCard.id ? createCard(c.letter, (c.upgradeLevel || 0) + 1) : c));
    }
    setCurrentNodeIndex(prev => prev + 1);
    setGameState('MAP');
  };

  const unlockDeck = (deckId, cost) => {
    if (starPoints >= cost && !unlockedDecks.includes(deckId)) {
      const newStars = starPoints - cost;
      const newUnlocked = [...unlockedDecks, deckId];
      setStarPoints(newStars);
      setUnlockedDecks(newUnlocked);
      localStorage.setItem('kd_star_points', newStars.toString());
      localStorage.setItem('kd_unlocked_decks', JSON.stringify(newUnlocked));
      soundEngine.playVictory();
    }
  };

  return {
    mapNodes,
    currentNodeIndex,
    gold,
    lives,
    activeRelicKeys,
    stage,
    currentScore,
    targetScore,
    handsLeft,
    discardsLeft,
    combo,
    lastPlayedWord,
    playedWordsThisStage,
    fullDeck,
    drawPile,
    discardPile,
    hand,
    selectedCards,
    gameState,
    lastScoreBreakdown,
    feedbackMessage,
    starPoints,
    highScore,
    unlockedDecks,
    selectedDeckId,

    setSelectedDeckId,
    startNewRun,
    enterMapNode,
    selectCardFromHand,
    unselectCard,
    clearSelectedCards,
    playWord,
    discardAndRedraw,
    handleAddCardToDeck,
    handleUpgradeCardInDeck,
    handleRemoveCardFromDeck,
    handleShopBuyCard,
    handleShopUpgradePerk,
    handleShopRemoveCard,
    handleShopBuyRelic,
    handleLeaveShop,
    handleResolveEvent,
    unlockDeck,
    setGameState
  };
}

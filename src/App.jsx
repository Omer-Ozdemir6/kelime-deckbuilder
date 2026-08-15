import React, { useState, useEffect } from 'react';
import { VerticalMobileContainer } from './components/VerticalMobileContainer';
import { BalatroBackground } from './components/BalatroBackground';
import { HeaderBar } from './components/HeaderBar';
import { WordPlayArea } from './components/WordPlayArea';
import { HandCardRack } from './components/HandCardRack';
import { DraftRewardModal } from './components/DraftRewardModal';
import { DeckInspectorModal } from './components/DeckInspectorModal';
import { StartMenuModal } from './components/StartMenuModal';
import { GameOverModal } from './components/GameOverModal';
import { MapScreen } from './components/MapScreen';
import { ShopScreen } from './components/ShopScreen';
import { EventScreen } from './components/EventScreen';
import { TriviaScreen } from './components/TriviaScreen';
import { ChallengeScreen } from './components/ChallengeScreen';
import { CampScreen } from './components/CampScreen';
import WordMeaningModal from './components/WordMeaningModal';
import { ObjectiveCompletedToast } from './components/ObjectiveCompletedToast';
import { RelicTooltipModal } from './components/RelicTooltipModal';
import { StageVictoryModal } from './components/StageVictoryModal';
import { CodexModal } from './components/CodexModal';
import { WheelOfFortuneModal } from './components/WheelOfFortuneModal';
import { SplashScreen } from './components/SplashScreen';
import { CharacterSelectModal, HERO_CHARACTERS } from './components/CharacterSelectModal';
import { StakesSelectModal, STAKES_DEFINITIONS } from './components/StakesSelectModal';
import { JokerSelectorModal } from './components/JokerSelectorModal';
import { ChallengeSelectModal } from './components/ChallengeSelectModal';
import { SvgFilterDefs } from './components/SvgFilterDefs';
import { LuminousScoreBreakdown } from './components/LuminousScoreBreakdown';
import { SparkParticles } from './components/SparkParticles';
import { useGameState } from './hooks/useGameState';
import { checkMetaUnlocks } from './game/metaUnlocks';

import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const gameStateObj = useGameState();
  const [isSplashActive, setIsSplashActive] = useState(true);
  const [isDeckInspectorOpen, setIsDeckInspectorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedRelicKey, setSelectedRelicKey] = useState(null);
  const [isCodexOpen, setIsCodexOpen] = useState(false);
  const [isWheelOpen, setIsWheelOpen] = useState(false);
  const [isChallengeSelectOpen, setIsChallengeSelectOpen] = useState(false);
  const [runMetaUnlocks, setRunMetaUnlocks] = useState([]);

  const [selectedHero, setSelectedHero] = useState(HERO_CHARACTERS[0]);
  const [selectedStake, setSelectedStake] = useState(STAKES_DEFINITIONS[0]);

  const {
    mapNodes,
    currentNodeIndex,
    gold,
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
    hand,
    selectedCards,
    gameState,
    feedbackMessage,
    highScore,
    unlockedDecks,
    selectedDeckId,
    currentWordMeaning,
    isMeaningModalOpen,
    goalNotice,
    activeBiome,
    activeFloorModifier,
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
    openWordMeaningModal,
    closeWordMeaningModal,
    clearGoalNotice,
    setGameState
  } = gameStateObj;

  const handleStartGameFlow = () => {
    setGameState('CHARACTER_SELECT');
  };

  const handleHeroChosen = (hero) => {
    setSelectedHero(hero);
    setSelectedDeckId(hero.starterDeckId);
    setGameState('STAKES_SELECT');
  };

  const handleStakeChosen = (stake) => {
    setSelectedStake(stake);
    startNewRun(selectedHero.starterDeckId);
  };

  // Run bittiğinde (Game Over) başarım tabanlı kahraman/mühür açılımlarını kontrol et
  useEffect(() => {
    if (gameState === 'GAME_OVER') {
      const newly = checkMetaUnlocks({
        heroId: selectedHero.id,
        stakeId: selectedStake.id,
        maxKademeReached: gameStateObj.currentKademe,
        maxWordsInBattle: gameStateObj.maxWordsInBattle
      });
      setRunMetaUnlocks(newly);
    }
  }, [gameState]);

  const activeBackgroundBiome = (isSplashActive || gameState === 'START_MENU')
    ? { id: 'BIOME_NORTHERN_LIGHTS' }
    : activeBiome;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950">
      {/* GLOBAL BACKGROUND SHADER & VFX (Edge-to-edge full viewport on desktop) */}
      <BalatroBackground activeBiome={activeBackgroundBiome} stage={stage || gameStateObj.currentKademe || 1} />
      <SparkParticles />

      <VerticalMobileContainer activeBiome={activeBiome}>
        <SvgFilterDefs />

      {/* REAL-TIME UNLOCKED ACHIEVEMENT POPUP TOAST */}
      {gameStateObj.activeAchievementToast && (
        <AchievementToast
          achievement={gameStateObj.activeAchievementToast}
          onClose={() => gameStateObj.setActiveAchievementToast(null)}
        />
      )}
      {/* 0. INTRO SPLASH SCREEN */}
      {isSplashActive && (
        <SplashScreen onStart={() => setIsSplashActive(false)} />
      )}

      {/* TOP OBJECTIVE COMPLETED TOAST */}
      <ObjectiveCompletedToast
        goalNotice={goalNotice}
        onClose={clearGoalNotice}
      />

      {/* 1. START MENU */}
      {gameState === 'START_MENU' && !isSplashActive && (
        <StartMenuModal
          highScore={highScore}
          unlockedDecks={unlockedDecks}
          selectedDeckId={selectedDeckId}
          hasActiveRun={gameStateObj.mapFloors && gameStateObj.mapFloors.length > 0}
          onSelectDeck={setSelectedDeckId}
          onUnlockDeck={unlockDeck}
          onStartRun={handleStartGameFlow}
          onResumeRun={() => setGameState('MAP')}
          onOpenCodex={() => setIsCodexOpen(true)}
          onOpenChallengeSelect={() => setIsChallengeSelectOpen(true)}
        />
      )}

      {/* CHALLENGE RUNS SELECTION MODAL */}
      {isChallengeSelectOpen && (
        <ChallengeSelectModal
          onSelectChallenge={(challenge) => {
            setIsChallengeSelectOpen(false);
            if (gameStateObj.startChallengeRun) gameStateObj.startChallengeRun(challenge);
            setGameState('MAP');
          }}
          onClose={() => setIsChallengeSelectOpen(false)}
        />
      )}

      {/* 1B. STEP 1: CHARACTER CLASS SELECTION */}
      {gameState === 'CHARACTER_SELECT' && (
        <CharacterSelectModal
          onSelectCharacter={handleHeroChosen}
          onBack={() => setGameState('START_MENU')}
        />
      )}

      {/* 1C. STEP 2: STAKES / DIFFICULTY SELECTION */}
      {gameState === 'STAKES_SELECT' && (
        <StakesSelectModal
          onSelectStake={handleStakeChosen}
          onBack={() => setGameState('CHARACTER_SELECT')}
        />
      )}

      {/* 2. RUN KADEME TRACK MAP */}
      {gameState === 'MAP' && (
        <MapScreen
          currentKademe={gameStateObj.currentKademe}
          kademeData={gameStateObj.kademeData}
          currentBlindIndex={gameStateObj.currentBlindIndex}
          gold={gold}
          activeTags={gameStateObj.activeTags}
          onPlayBlind={gameStateObj.playBlind}
          onSkipBlind={gameStateObj.skipBlind}
          onSelectNode={enterMapNode}
          onOpenMainMenu={() => setIsSettingsOpen(true)}
        />
      )}

      {/* 3. MAIN GAMEPLAY SCREEN */}
      {gameState === 'PLAYING' && (
        <>
          <HeaderBar
            stage={stage}
            currentScore={currentScore}
            targetScore={targetScore}
            handsLeft={handsLeft}
            discardsLeft={discardsLeft}
            combo={combo}
            comboTimeLeft={gameStateObj.comboTimeLeft}
            gold={gold}
            lives={gameStateObj.lives}
            activeRelicKeys={activeRelicKeys}
            fullDeckCount={fullDeck.length}
            onOpenDeckInspector={() => setIsDeckInspectorOpen(true)}
            onDiscardHand={discardAndRedraw}
            onOpenMainMenu={() => setIsSettingsOpen(true)}
            onOpenRelicTooltip={(key) => setSelectedRelicKey(key)}
            activeBiome={activeBiome}
            activeFloorModifier={activeFloorModifier}
          />

          <WordPlayArea
            stage={stage}
            selectedCards={selectedCards}
            lastPlayedWord={lastPlayedWord}
            playedWordsThisStage={playedWordsThisStage}
            combo={combo}
            comboTimeLeft={gameStateObj.comboTimeLeft}
            activeRelicKeys={activeRelicKeys}
            boardSlotModifiers={gameStateObj.boardSlotModifiers}
            activeBossRule={gameStateObj.activeBossRule}
            onUnselectCard={unselectCard}
            onClearCards={clearSelectedCards}
            onShuffleHand={gameStateObj.shuffleHand}
            onDiscardHand={discardAndRedraw}
            discardsLeft={discardsLeft}

            onPlayWord={playWord}
            onPassTurn={gameStateObj.passTurnOrSurrender}
            feedbackMessage={feedbackMessage}
            currentWordMeaning={currentWordMeaning}
            onOpenMeaningModal={openWordMeaningModal}
          />


          <HandCardRack
            handCards={hand}
            bankCards={gameStateObj.bankCards}
            onSelectCard={selectCardFromHand}
            onSelectBankCard={selectCardFromBank}
            onBankCard={bankCardFromHand}
            onUnbankCard={unbankCardToHand}
          />
        </>
      )}

      {/* STAGE VICTORY SUMMARY MODAL */}
      {gameState === 'STAGE_VICTORY_SUMMARY' && gameStateObj.lastStageVictoryStats && (
        <StageVictoryModal
          stage={gameStateObj.lastStageVictoryStats.stage}
          score={gameStateObj.lastStageVictoryStats.score}
          targetScore={gameStateObj.lastStageVictoryStats.targetScore}
          goldEarned={gameStateObj.lastStageVictoryStats.goldEarned}
          playedWords={gameStateObj.lastStageVictoryStats.playedWords}
          combo={gameStateObj.lastStageVictoryStats.combo}
          onProceedToRewards={gameStateObj.proceedToRewardsFromVictory}
          onOpenMeaningModal={openWordMeaningModal}
        />
      )}

      {/* TDK WORD MEANING MODAL */}
      {isMeaningModalOpen && (
        <WordMeaningModal
          meaningData={currentWordMeaning}
          onClose={closeWordMeaningModal}
        />
      )}

      {/* RELIC TOOLTIP MODAL */}
      {selectedRelicKey && (
        <RelicTooltipModal
          relicKey={selectedRelicKey}
          activeRelicKeys={activeRelicKeys || []}
          onSell={gameStateObj.handleSellPassiveJoker}
          onReorder={gameStateObj.handleReorderPassiveJokers}
          onClose={() => setSelectedRelicKey(null)}
        />
      )}

      {/* 4. SHOP SCREEN */}
      {gameState === 'SHOP' && (
        <ShopScreen
          gold={gold}
          fullDeck={fullDeck}
          activeRelicKeys={activeRelicKeys}
          activeJokerIds={gameStateObj.activeRelicKeys || []}
          wordCategoryLevels={gameStateObj.wordCategoryLevels}
          onBuyCard={handleShopBuyCard}
          onBuyPassiveJoker={handleShopBuyRelic}
          onBuyPlanetCard={gameStateObj.handleBuyPlanetCard}
          onRemoveCard={handleShopRemoveCard}
          onLeaveShop={handleLeaveShop}
        />
      )}

      {/* 5. EVENT SCREEN */}
      {gameState === 'EVENT' && (
        <EventScreen
          onResolveEvent={handleResolveEvent}
        />
      )}

      {/* 5B. TRIVIA & RIDDLE CHALLENGE SCREEN */}
      {gameState === 'TRIVIA' && (
        <TriviaScreen
          onResolveTrivia={gameStateObj.handleResolveTrivia}
        />
      )}

      {/* 5B2. SPEED FILL CHALLENGE SCREEN */}
      {gameState === 'CHALLENGE' && (
        <ChallengeScreen
          onCompleteChallenge={(goldReward, challengeScore) => {
            gameStateObj.handleResolveChallenge(goldReward, challengeScore);
          }}
        />
      )}

      {/* 5C. PRE-BOSS CAMP SCREEN */}
      {gameState === 'CAMP' && (
        <CampScreen
          fullDeck={fullDeck}
          bossInfo={activeBiome?.bossRule || { title: 'Bölge Bossu', targetScore: 250 }}
          onResolveCamp={gameStateObj.handleResolveCamp}
        />
      )}

      {/* 6. DRAFT REWARD MODAL */}
      {gameState === 'DRAFT_REWARD' && (
        <DraftRewardModal
          stage={stage}
          fullDeck={fullDeck}
          onAddCard={handleAddCardToDeck}
          onUpgradeCard={handleUpgradeCardInDeck}
          onRemoveCard={handleRemoveCardFromDeck}
        />
      )}

      {/* DECK INSPECTOR */}
      {isDeckInspectorOpen && (
        <DeckInspectorModal
          fullDeck={fullDeck}
          onClose={() => setIsDeckInspectorOpen(false)}
        />
      )}

      {/* GAME OVER */}
      {gameState === 'GAME_OVER' && (
        <GameOverModal
          stage={stage}
          currentScore={currentScore}
          totalRunGold={gold}
          totalRunWords={playedWordsThisStage.length}
          runAchievements={gameStateObj.runUnlockedAchievements}
          runMetaUnlocks={runMetaUnlocks}
          onStartNewRun={() => gameStateObj.startNewRun()}
          onReturnToMainMenu={() => setGameState('START_MENU')}
        />
      )}

      {/* CODEX COMPENDIUM ENCYCLOPEDIA */}
      {isCodexOpen && (
        <CodexModal onClose={() => setIsCodexOpen(false)} />
      )}

      {/* JOKER LETTER SELECTOR MODAL */}
      {gameStateObj.pendingJokerCard && (
        <JokerSelectorModal
          jokerCard={gameStateObj.pendingJokerCard}
          onSelectLetter={gameStateObj.handleAssignJokerLetter}
          onClose={() => gameStateObj.setPendingJokerCard(null)}
        />
      )}

      {/* SETTINGS MODAL */}
      {isSettingsOpen && (
        <SettingsModal
          onClose={() => setIsSettingsOpen(false)}
          onReturnToMainMenu={() => {
            setIsSettingsOpen(false);
            setGameState('START_MENU');
          }}
        />
      )}

      {/* WHEEL OF FORTUNE MINI-GAME */}
      {isWheelOpen && (
        <WheelOfFortuneModal
          onSpinResult={(prize) => {
            if (prize.id === 'GOLD_50') {
              gameStateObj.handleAddCardToDeck && gameStateObj.handleAddCardToDeck(null);
            }
          }}
          onClose={() => setIsWheelOpen(false)}
        />
      )}
    </VerticalMobileContainer>
  </div>
  );
}

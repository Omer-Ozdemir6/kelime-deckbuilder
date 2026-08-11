import React, { useState } from 'react';
import { VerticalMobileContainer } from './components/VerticalMobileContainer';
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
import { useGameState } from './hooks/useGameState';

export default function App() {
  const gameStateObj = useGameState();
  const [isDeckInspectorOpen, setIsDeckInspectorOpen] = useState(false);

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
    unlockDeck
  } = gameStateObj;

  return (
    <VerticalMobileContainer>
      {/* 1. START MENU */}
      {gameState === 'START_MENU' && (
        <StartMenuModal
          starPoints={starPoints}
          highScore={highScore}
          unlockedDecks={unlockedDecks}
          selectedDeckId={selectedDeckId}
          onSelectDeck={setSelectedDeckId}
          onUnlockDeck={unlockDeck}
          onStartRun={() => startNewRun(selectedDeckId)}
        />
      )}

      {/* 2. RUN MAP */}
      {gameState === 'MAP' && (
        <MapScreen
          mapFloors={gameStateObj.mapFloors}
          currentFloorIndex={gameStateObj.currentFloorIndex}
          gold={gold}
          starPoints={starPoints}
          onSelectNode={enterMapNode}
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
            gold={gold}
            lives={gameStateObj.lives}
            activeRelicKeys={activeRelicKeys}
            starPoints={starPoints}
            fullDeckCount={fullDeck.length}
            onOpenDeckInspector={() => setIsDeckInspectorOpen(true)}
            onDiscardHand={discardAndRedraw}
          />

          <WordPlayArea
            stage={stage}
            selectedCards={selectedCards}
            lastPlayedWord={lastPlayedWord}
            playedWordsThisStage={playedWordsThisStage}
            combo={combo}
            onUnselectCard={unselectCard}
            onClearCards={clearSelectedCards}
            onPlayWord={playWord}
            feedbackMessage={feedbackMessage}
          />

          <HandCardRack
            handCards={hand}
            onSelectCard={selectCardFromHand}
          />
        </>
      )}

      {/* 4. SHOP SCREEN */}
      {gameState === 'SHOP' && (
        <ShopScreen
          gold={gold}
          fullDeck={fullDeck}
          activeRelicKeys={activeRelicKeys}
          onBuyCard={handleShopBuyCard}
          onUpgradeCardPerk={handleShopUpgradePerk}
          onRemoveCard={handleShopRemoveCard}
          onBuyRelic={handleShopBuyRelic}
          onLeaveShop={handleLeaveShop}
        />
      )}

      {/* 5. EVENT SCREEN */}
      {gameState === 'EVENT' && (
        <EventScreen
          onResolveEvent={handleResolveEvent}
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
          starPoints={starPoints}
          onRestart={() => startNewRun(selectedDeckId)}
        />
      )}
    </VerticalMobileContainer>
  );
}

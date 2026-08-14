import os

use_game_state_path = r"c:\Users\omr_k\Projects\kelime-deckbuilder\src\hooks\useGameState.js"

with open(use_game_state_path, "r", encoding="utf-8") as f:
    code = f.read()

target_broken = """    const breakdown = calculateWordScore(
      selectedCards,
      lastPlayedWord,
      combo,
    comboTimeLeft,
      playedWordsThisStage,
      activeRelicKeys,
      isFirstWordInStage,
      boardSlotModifiers,
      wordTypeLevels
    );"""

target_fixed = """    const breakdown = calculateWordScore(
      selectedCards,
      lastPlayedWord,
      combo,
      playedWordsThisStage,
      activeRelicKeys,
      isFirstWordInStage,
      boardSlotModifiers,
      wordTypeLevels
    );"""

code = code.replace(target_broken, target_fixed)

with open(use_game_state_path, "w", encoding="utf-8") as f:
    f.write(code)

print("calculateWordScore argument list in useGameState.js fixed successfully!")

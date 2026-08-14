import os

word_engine_path = r"c:\Users\omr_k\Projects\kelime-deckbuilder\src\game\wordEngine.js"

with open(word_engine_path, "r", encoding="utf-8") as f:
    code = f.read()

# Sanitize array parameters at the top of calculateWordScore
top_sanitize_code = '''export function calculateWordScore(
  selectedCards,
  lastPlayedWord = '',
  currentCombo = 1,
  playedWordsThisStage = [],
  activeRelicKeys = [],
  isFirstWordInStage = false,
  boardSlotModifiers = {},
  wordCategoryLevels = {},
  unselectedCardsInHand = []
) {
  const safeSelectedCards = Array.isArray(selectedCards) ? selectedCards : [];
  const safePlayedWords = Array.isArray(playedWordsThisStage) ? playedWordsThisStage : [];
  const safeRelicKeys = Array.isArray(activeRelicKeys) ? activeRelicKeys : [];
  const safeHandCards = Array.isArray(unselectedCardsInHand) ? unselectedCardsInHand : [];

  if (!safeSelectedCards || safeSelectedCards.length === 0) {'''

code = code.replace(
    '''export function calculateWordScore(
  selectedCards,
  lastPlayedWord = '',
  currentCombo = 1,
  playedWordsThisStage = [],
  activeRelicKeys = [],
  isFirstWordInStage = false,
  boardSlotModifiers = {},
  wordCategoryLevels = {},
  unselectedCardsInHand = []
) {
  if (!selectedCards || selectedCards.length === 0) {''',
    top_sanitize_code
)

# Replace playedWordsThisStage.includes with safePlayedWords.includes
code = code.replace('playedWordsThisStage.includes(upperWord)', 'safePlayedWords.includes(upperWord)')

# Replace activeRelicKeys.includes with safeRelicKeys.includes
code = code.replace('activeRelicKeys.includes', 'safeRelicKeys.includes')

# Replace unselectedCardsInHand.forEach with safeHandCards.forEach
code = code.replace('unselectedCardsInHand.forEach', 'safeHandCards.forEach')

with open(word_engine_path, "w", encoding="utf-8") as f:
    f.write(code)

print("wordEngine.js array parameters safely sanitized!")

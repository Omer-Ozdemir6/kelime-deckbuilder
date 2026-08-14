import os

word_engine_path = r"c:\Users\omr_k\Projects\kelime-deckbuilder\src\game\wordEngine.js"

with open(word_engine_path, "r", encoding="utf-8") as f:
    code = f.read()

target_broken = """  // Calculate Steel Tiles multiplier from unselected cards held in hand!
  unselectedCardsInHand.forEach(c => {
    if (c.seal === 'STEEL') {
      polychromeMultiplier *= 1.5;
    }
  });"""

target_fixed = """  // Calculate Steel Tiles multiplier from unselected cards held in hand!
  const safeHand = Array.isArray(unselectedCardsInHand) ? unselectedCardsInHand : [];
  safeHand.forEach(c => {
    if (c && c.seal === 'STEEL') {
      polychromeMultiplier *= 1.5;
    }
  });"""

code = code.replace(target_broken, target_fixed)

with open(word_engine_path, "w", encoding="utf-8") as f:
    f.write(code)

print("wordEngine.js line 350 fixed with safe Array check!")

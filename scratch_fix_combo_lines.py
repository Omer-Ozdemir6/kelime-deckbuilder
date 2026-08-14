import os

use_game_state_path = r"c:\Users\omr_k\Projects\kelime-deckbuilder\src\hooks\useGameState.js"

with open(use_game_state_path, "r", encoding="utf-8") as f:
    code = f.read()

target_broken = """  const [combo,
    comboTimeLeft, setCombo] = useState(1);"""

target_clean = """  const [combo, setCombo] = useState(1);"""

code = code.replace(target_broken, target_clean)

with open(use_game_state_path, "w", encoding="utf-8") as f:
    f.write(code)

print("Cleaned up broken combo line in useGameState.js!")

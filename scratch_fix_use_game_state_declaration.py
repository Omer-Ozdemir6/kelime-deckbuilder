import os

use_game_state_path = r"c:\Users\omr_k\Projects\kelime-deckbuilder\src\hooks\useGameState.js"

with open(use_game_state_path, "r", encoding="utf-8") as f:
    code = f.read()

code = code.replace(
    "const [combo, comboTimeLeft, setCombo] = useState(1);",
    "const [combo, setCombo] = useState(1);"
)

with open(use_game_state_path, "w", encoding="utf-8") as f:
    f.write(code)

print("useGameState.js line 58 double declaration fixed!")

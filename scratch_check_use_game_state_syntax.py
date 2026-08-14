import os, re

use_game_state_path = r"c:\Users\omr_k\Projects\kelime-deckbuilder\src\hooks\useGameState.js"

with open(use_game_state_path, "r", encoding="utf-8") as f:
    code = f.read()

print(f"File lines count: {len(code.splitlines())}")

# Check parens, braces, brackets
print("Parens:", code.count("("), code.count(")"))
print("Braces:", code.count("{"), code.count("}"))
print("Brackets:", code.count("["), code.count("]"))

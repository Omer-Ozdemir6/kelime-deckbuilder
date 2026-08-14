import os

menu_path = r"c:\Users\omr_k\Projects\kelime-deckbuilder\src\components\StartMenuModal.jsx"
with open(menu_path, "r", encoding="utf-8") as f:
    code = f.read()

code = code.replace(
    "{/* MAIN MENU ACTION BUTTONS — POSITIONED AT VERY BOTTOM OF SCREEN */}}",
    "{/* MAIN MENU ACTION BUTTONS — POSITIONED AT VERY BOTTOM OF SCREEN */}"
)

with open(menu_path, "w", encoding="utf-8") as f:
    f.write(code)

print("Fixed extra closing brace on line 107 in StartMenuModal.jsx!")

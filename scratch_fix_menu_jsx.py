import os

menu_path = r"c:\Users\omr_k\Projects\kelime-deckbuilder\src\components\StartMenuModal.jsx"
with open(menu_path, "r", encoding="utf-8") as f:
    code = f.read()

code = code.replace(
    "{      {/* BALATRO LOGO GRAPHIC */}",
    "{/* BALATRO LOGO GRAPHIC */}"
)

with open(menu_path, "w", encoding="utf-8") as f:
    f.write(code)

print("Fixed JSX comment bracket error in StartMenuModal.jsx!")

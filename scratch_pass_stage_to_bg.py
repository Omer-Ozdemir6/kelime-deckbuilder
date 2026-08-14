import os

app_path = r"c:\Users\omr_k\Projects\kelime-deckbuilder\src\App.jsx"
with open(app_path, "r", encoding="utf-8") as f:
    code = f.read()

code = code.replace(
    "<BalatroBackground />",
    "<BalatroBackground stage={stage || gameStateObj.currentKademe || 1} />"
)

with open(app_path, "w", encoding="utf-8") as f:
    f.write(code)

print("Passed dynamic stage to BalatroBackground in App.jsx!")

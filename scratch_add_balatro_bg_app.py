import os

app_path = r"c:\Users\omr_k\Projects\kelime-deckbuilder\src\App.jsx"
with open(app_path, "r", encoding="utf-8") as f:
    content = f.read()

if "BalatroBackground" not in content:
    content = content.replace(
        "import { VerticalMobileContainer } from './components/VerticalMobileContainer';",
        "import { VerticalMobileContainer } from './components/VerticalMobileContainer';\nimport { BalatroBackground } from './components/BalatroBackground';"
    )
    content = content.replace(
        "<VerticalMobileContainer activeBiome={activeBiome}>",
        "<VerticalMobileContainer activeBiome={activeBiome}>\n      <BalatroBackground />"
    )

with open(app_path, "w", encoding="utf-8") as f:
    f.write(content)

print("BalatroBackground added to App.jsx successfully!")

import os

use_game_state_path = r"c:\Users\omr_k\Projects\kelime-deckbuilder\src\hooks\useGameState.js"

with open(use_game_state_path, "r", encoding="utf-8") as f:
    code = f.read()

timer_effect = '''  // Combo Decay Timer Effect (Decreases combo if player doesn't make a move within 10s)
  useEffect(() => {
    let interval;
    if (gameState === 'PLAYING' && combo > 1) {
      interval = setInterval(() => {
        setComboTimeLeft(prev => {
          if (prev <= 1) {
            soundEngine.playDeselect();
            setCombo(c => Math.max(1, c - 1));
            setFeedbackMessage('⚠️ Zaman doldu! Kombo düştü.');
            return 10;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setComboTimeLeft(10);
    }
    return () => clearInterval(interval);
  }, [gameState, combo]);'''

# Remove timer_effect from top
code = code.replace(timer_effect, "")

# Insert timer_effect AFTER const [gameState, setGameState] = useState('START_MENU');
target = "const [gameState, setGameState] = useState('START_MENU'); // START_MENU | MAP | PLAYING | SHOP | EVENT | STAGE_VICTORY_SUMMARY | DRAFT_REWARD | GAME_OVER"

code = code.replace(target, target + "\n\n" + timer_effect)

with open(use_game_state_path, "w", encoding="utf-8") as f:
    f.write(code)

print("Moved timer_effect effect after gameState declaration!")

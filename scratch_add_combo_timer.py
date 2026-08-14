import os

web_dir = r"c:\Users\omr_k\Projects\kelime-deckbuilder\src"
use_game_state_path = os.path.join(web_dir, "hooks", "useGameState.js")
app_path = os.path.join(web_dir, "App.jsx")
header_path = os.path.join(web_dir, "components", "HeaderBar.jsx")

# -------------------------------------------------------------
# 1. Update useGameState.js: Add comboTimeLeft & decay timer
# -------------------------------------------------------------
with open(use_game_state_path, "r", encoding="utf-8") as f:
    gs_code = f.read()

if "comboTimeLeft" not in gs_code:
    # Insert state
    gs_code = gs_code.replace(
        "const [combo, setCombo] = useState(1);",
        "const [combo, setCombo] = useState(1);\n  const [comboTimeLeft, setComboTimeLeft] = useState(10);"
    )
    
    # Insert timer effect
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

    gs_code = gs_code.replace(
      "const [wordCategoryLevels, setWordCategoryLevels] = useState(INITIAL_WORD_LEVELS);",
      "const [wordCategoryLevels, setWordCategoryLevels] = useState(INITIAL_WORD_LEVELS);\n" + timer_effect
    )

    # Reset timer on valid word in playWord
    gs_code = gs_code.replace(
        "setCombo(nextCombo);",
        "setCombo(nextCombo);\n    setComboTimeLeft(10);"
    )

    # Reset timer in playBlind
    gs_code = gs_code.replace(
        "setCombo(1);",
        "setCombo(1);\n    setComboTimeLeft(10);"
    )

    # Export comboTimeLeft in return object
    gs_code = gs_code.replace(
        "combo,",
        "combo,\n    comboTimeLeft,"
    )

    with open(use_game_state_path, "w", encoding="utf-8") as f:
        f.write(gs_code)

# -------------------------------------------------------------
# 2. Update App.jsx: Pass comboTimeLeft to HeaderBar
# -------------------------------------------------------------
with open(app_path, "r", encoding="utf-8") as f:
    app_code = f.read()

if "comboTimeLeft=" not in app_code:
    app_code = app_code.replace(
        "combo={combo}",
        "combo={combo}\n            comboTimeLeft={gameStateObj.comboTimeLeft}"
    )

    with open(app_path, "w", encoding="utf-8") as f:
        f.write(app_code)

# -------------------------------------------------------------
# 3. Update HeaderBar.jsx: Display comboTimeLeft & pulsing timer bar
# -------------------------------------------------------------
with open(header_path, "r", encoding="utf-8") as f:
    header_code = f.read()

if "comboTimeLeft" not in header_code:
    header_code = header_code.replace(
        "combo = 1,",
        "combo = 1,\n  comboTimeLeft = 10,"
    )

    # Add Timer Badge next to Combo Badge
    timer_badge_jsx = '''                  <span>KOMBO ×{combo}</span>
                  <span className={`ml-1 font-mono text-[10px] px-1.5 py-0.5 rounded-full border ${comboTimeLeft <= 3 ? 'bg-rose-950 text-rose-300 border-rose-500 animate-ping' : 'bg-slate-900/80 text-slate-900 border-slate-700'}`}>
                    ⏱️ {comboTimeLeft}s
                  </span>'''
    
    header_code = header_code.replace("<span>KOMBO ×{combo}</span>", timer_badge_jsx)

    with open(header_path, "w", encoding="utf-8") as f:
        f.write(header_code)

print("Combo Decay Timer system successfully integrated across all components!")

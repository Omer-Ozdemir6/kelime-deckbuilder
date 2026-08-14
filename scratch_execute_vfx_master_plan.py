import os

web_dir = r"c:\Users\omr_k\Projects\kelime-deckbuilder\src\components"
bg_path = os.path.join(web_dir, "BalatroBackground.jsx")
play_path = os.path.join(web_dir, "WordPlayArea.jsx")
header_path = os.path.join(web_dir, "HeaderBar.jsx")

# -------------------------------------------------------------
# 1. Update BalatroBackground.jsx to support Biome Color Palettes
# -------------------------------------------------------------
bg_jsx = '''import React, { useEffect, useRef } from 'react';

const BIOME_PALETTES = {
  1: { // Orman Diyarı (Emerald Green & Gold)
    c1: 'rgba(16, 185, 129, 0.45)',
    c2: 'rgba(5, 150, 105, 0.25)',
    c3: 'rgba(245, 158, 11, 0.35)',
    c4: 'rgba(180, 83, 9, 0.20)'
  },
  2: { // Çöl Sıcağı (Amber & Orange Sunburst)
    c1: 'rgba(245, 158, 11, 0.45)',
    c2: 'rgba(217, 119, 6, 0.25)',
    c3: 'rgba(239, 68, 68, 0.35)',
    c4: 'rgba(185, 28, 28, 0.20)'
  },
  3: { // Deniz Derinlikleri (Cyan & Deep Blue Ocean)
    c1: 'rgba(6, 182, 212, 0.45)',
    c2: 'rgba(14, 116, 144, 0.25)',
    c3: 'rgba(59, 130, 246, 0.35)',
    c4: 'rgba(29, 78, 216, 0.20)'
  },
  4: { // Volkan Alanı (Crimson & Flame Red)
    c1: 'rgba(239, 68, 68, 0.50)',
    c2: 'rgba(185, 28, 28, 0.30)',
    c3: 'rgba(249, 115, 22, 0.40)',
    c4: 'rgba(194, 65, 12, 0.20)'
  },
  5: { // Gece Gökyüzü (Indigo & Cosmic Violet)
    c1: 'rgba(168, 85, 247, 0.45)',
    c2: 'rgba(126, 34, 206, 0.25)',
    c3: 'rgba(99, 102, 241, 0.40)',
    c4: 'rgba(67, 56, 202, 0.20)'
  },
  6: { // Efsanevi Bölge (Divine Golden)
    c1: 'rgba(251, 191, 36, 0.50)',
    c2: 'rgba(217, 119, 6, 0.30)',
    c3: 'rgba(244, 114, 182, 0.40)',
    c4: 'rgba(192, 38, 211, 0.20)'
  }
};

export function BalatroBackground({ stage = 1 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const paletteKey = Math.min(6, stage || 1);
    const pal = BIOME_PALETTES[paletteKey] || BIOME_PALETTES[1];

    const render = () => {
      time += 0.015;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.fillStyle = '#09050e';
      ctx.fillRect(0, 0, w, h);

      const numRings = 8;
      for (let i = numRings; i >= 1; i--) {
        const radius = i * 115 + Math.sin(time + i) * 22;
        const angle = time * 0.4 * (i % 2 === 0 ? 1 : -1);

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);

        const grad = ctx.createRadialGradient(0, 0, radius * 0.2, 0, 0, radius);
        if (i % 2 === 0) {
          grad.addColorStop(0, pal.c1);
          grad.addColorStop(0.5, pal.c2);
          grad.addColorStop(1, 'rgba(9, 5, 14, 0)');
        } else {
          grad.addColorStop(0, pal.c3);
          grad.addColorStop(0.5, pal.c4);
          grad.addColorStop(1, 'rgba(9, 5, 14, 0)');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * 1.3, radius * 0.8, angle, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [stage]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none w-full h-full transition-all duration-1000"
    />
  );
}
'''

with open(bg_path, "w", encoding="utf-8") as f:
    f.write(bg_jsx)

# -------------------------------------------------------------
# 2. Update WordPlayArea.jsx with Floating Score Popups & Spark Bursts
# -------------------------------------------------------------
with open(play_path, "r", encoding="utf-8") as f:
    play_code = f.read()

# Add imports for confetti
if "confetti" not in play_code:
    play_code = play_code.replace(
        "import { calculateWordScore } from '../game/wordEngine';",
        "import { calculateWordScore } from '../game/wordEngine';\nimport confetti from 'canvas-confetti';"
    )

# Add Floating Score Popups & Confetti Burst to onPlayWord handler
floating_score_jsx = '''  const [floatingScore, setFloatingScore] = useState(null);
  const [screenShake, setScreenShake] = useState(false);

  const handlePlayWordWithVFX = () => {
    if (selectedCards.length < 2) return;
    
    // Trigger confetti spark burst from center
    try {
      confetti({
        particleCount: 45,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch(e) {}

    // Trigger Screen Shake
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 400);

    // Trigger Floating Score Popup
    if (scoreBreakdown && scoreBreakdown.isValid) {
      setFloatingScore(`+${scoreBreakdown.score} PUAN!`);
      setTimeout(() => setFloatingScore(null), 1200);
    }

    if (onPlayWord) onPlayWord();
  };'''

if "handlePlayWordWithVFX" not in play_code:
    play_code = play_code.replace(
        "const scoreBreakdown = calculateWordScore",
        floating_score_jsx + "\n\n  const scoreBreakdown = calculateWordScore"
    )
    play_code = play_code.replace(
        "onClick={onPlayWord}",
        "onClick={handlePlayWordWithVFX}"
    )

with open(play_path, "w", encoding="utf-8") as f:
    f.write(play_code)

print("BalatroBackground.jsx & WordPlayArea.jsx updated with master VFX system!")

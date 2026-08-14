import os

web_dir = r"c:\Users\omr_k\Projects\kelime-deckbuilder\src"
comp_dir = os.path.join(web_dir, "components")

# -------------------------------------------------------------
# 1. BalatroBackground.jsx (Hypnotic Trippy Liquid Swirl Canvas)
# -------------------------------------------------------------
bg_jsx = '''import React, { useEffect, useRef } from 'react';

export function BalatroBackground() {
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

    const render = () => {
      time += 0.015;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      // Dark background
      ctx.fillStyle = '#0a050d';
      ctx.fillRect(0, 0, w, h);

      // Draw rotating trippy spiral waves
      const numRings = 8;
      for (let i = numRings; i >= 1; i--) {
        const radius = i * 110 + Math.sin(time + i) * 20;
        const angle = time * 0.4 * (i % 2 === 0 ? 1 : -1);

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);

        const grad = ctx.createRadialGradient(0, 0, radius * 0.2, 0, 0, radius);
        if (i % 2 === 0) {
          grad.addColorStop(0, 'rgba(180, 25, 45, 0.45)');
          grad.addColorStop(0.5, 'rgba(130, 15, 35, 0.25)');
          grad.addColorStop(1, 'rgba(10, 5, 13, 0)');
        } else {
          grad.addColorStop(0, 'rgba(25, 85, 160, 0.4)');
          grad.addColorStop(0.5, 'rgba(15, 55, 120, 0.2)');
          grad.addColorStop(1, 'rgba(10, 5, 13, 0)');
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none w-full h-full"
    />
  );
}
'''

with open(os.path.join(comp_dir, "BalatroBackground.jsx"), "w", encoding="utf-8") as f:
    f.write(bg_jsx)

# -------------------------------------------------------------
# 2. Authentic Balatro ShopScreen.jsx (Matching User Screenshot 100%)
# -------------------------------------------------------------
shop_jsx = '''import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, ArrowRight, RefreshCw, Sparkles, Tag, ShieldCheck, Layers } from 'lucide-react';
import { soundEngine } from '../game/audioEngine';

export function ShopScreen({
  gold,
  fullDeck = [],
  activeRelicKeys = [],
  onBuyCard,
  onBuyPassiveJoker,
  onRemoveCard,
  onLeaveShop
}) {
  const [rerollCost, setRerollCost] = useState(5);
  const [soldSlots, setSoldSlots] = useState({
    card1: false,
    card2: false,
    voucher: false,
    pack1: false,
    pack2: false
  });

  const handleReroll = () => {
    if (gold >= rerollCost) {
      soundEngine.playTap();
      setRerollCost(prev => prev + 1);
      setSoldSlots({
        card1: false,
        card2: false,
        voucher: soldSlots.voucher,
        pack1: false,
        pack2: false
      });
    }
  };

  const buyItem = (slotKey, cost, callback) => {
    if (gold >= cost && !soldSlots[slotKey]) {
      soundEngine.playVictory();
      if (callback) callback();
      setSoldSlots(prev => ({ ...prev, [slotKey]: true }));
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 bg-slate-950 text-slate-100 select-none relative overflow-hidden">
      {/* SHOP OUTER CONTAINER CONTAINER */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl bg-slate-900/90 border-4 border-slate-700/80 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-md flex flex-col gap-4 relative z-10"
      >
        {/* TOP STATUS BAR */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛒</span>
            <h2 className="text-lg font-black text-amber-300 font-cinzel tracking-wide">BALATRO SHOP</h2>
          </div>
          <div className="flex items-center gap-2 bg-amber-950/80 border border-amber-400/60 px-4 py-1.5 rounded-2xl text-amber-300 font-black font-mono text-base shadow-lg">
            <Coins size={18} className="text-amber-400 fill-amber-400 animate-pulse" />
            <span>${gold}</span>
          </div>
        </div>

        {/* 4-GRID BALATRO SHOP LAYOUT (EXACT REPLICA OF USER SCREENSHOT) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* TOP LEFT PANEL: NEXT ROUND & REROLL BUTTONS */}
          <div className="bg-slate-950/80 border-2 border-slate-800 rounded-2xl p-3 flex flex-col gap-3 justify-center">
            {/* NEXT ROUND RED CTA BUTTON */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onLeaveShop}
              className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-base shadow-lg border-2 border-rose-400 cursor-pointer flex items-center justify-center gap-2 tracking-wider"
            >
              <span>Next Round</span>
              <ArrowRight size={20} />
            </motion.button>

            {/* REROLL GREEN BUTTON */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleReroll}
              disabled={gold < rerollCost}
              className={`w-full py-3.5 rounded-2xl font-black text-base shadow-lg border-2 flex items-center justify-center gap-2 cursor-pointer transition ${
                gold >= rerollCost
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400'
                  : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              <RefreshCw size={18} />
              <span>Reroll ${rerollCost}</span>
            </motion.button>
          </div>

          {/* TOP RIGHT PANEL: AVAILABLE CARDS / JOKERS (SLOTS FOR CARDS ON SALE) */}
          <div className="bg-slate-950/80 border-2 border-slate-800 rounded-2xl p-3 flex items-center justify-around gap-2 min-h-[150px]">
            {/* CARD SLOT 1 */}
            <div className="flex flex-col items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-xs shadow">
                $6
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => buyItem('card1', 6, () => onBuyCard && onBuyCard('JOKER_CARD', 6))}
                disabled={soldSlots.card1 || gold < 6}
                className={`w-24 h-32 rounded-xl border-2 flex flex-col items-center justify-between p-2 shadow-xl cursor-pointer ${
                  soldSlots.card1
                    ? 'opacity-30 bg-slate-950 border-slate-800'
                    : 'bg-gradient-to-b from-purple-900 via-slate-900 to-purple-950 border-purple-400'
                }`}
              >
                {soldSlots.card1 ? (
                  <span className="text-xs font-black text-slate-500 my-auto">SATILDI</span>
                ) : (
                  <>
                    <span className="text-2xl mt-1">🃏</span>
                    <span className="text-[10px] font-black text-purple-200 text-center">Joker Kart</span>
                    <span className="text-[8px] font-bold text-amber-300 bg-purple-950 px-1 py-0.5 rounded">+15 Çarpan</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* CARD SLOT 2 */}
            <div className="flex flex-col items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-xs shadow">
                $5
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => buyItem('card2', 5, () => onBuyCard && onBuyCard('FOIL_JOKER', 5))}
                disabled={soldSlots.card2 || gold < 5}
                className={`w-24 h-32 rounded-xl border-2 flex flex-col items-center justify-between p-2 shadow-xl cursor-pointer ${
                  soldSlots.card2
                    ? 'opacity-30 bg-slate-950 border-slate-800'
                    : 'bg-gradient-to-b from-blue-900 via-slate-900 to-blue-950 border-blue-400'
                }`}
              >
                {soldSlots.card2 ? (
                  <span className="text-xs font-black text-slate-500 my-auto">SATILDI</span>
                ) : (
                  <>
                    <span className="text-2xl mt-1">🪙</span>
                    <span className="text-[10px] font-black text-blue-200 text-center">Foil Harf</span>
                    <span className="text-[8px] font-bold text-amber-300 bg-blue-950 px-1 py-0.5 rounded">+30 Puan</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* BOTTOM LEFT PANEL: ANTE 1 VOUCHER SLOT */}
          <div className="bg-slate-950/80 border-2 border-slate-800 rounded-2xl p-3 flex flex-col items-center justify-center gap-1.5 min-h-[150px] relative">
            <span className="absolute left-2 top-2 text-[9px] font-black text-slate-600 uppercase tracking-widest -rotate-90 origin-left">
              ANTE VOUCHER
            </span>

            <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-xs shadow mb-1">
              $10
            </span>

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => buyItem('voucher', 10)}
              disabled={soldSlots.voucher || gold < 10}
              className={`w-24 h-28 rounded-xl border-2 border-dashed flex flex-col items-center justify-between p-2 shadow-xl cursor-pointer ${
                soldSlots.voucher
                  ? 'opacity-30 bg-slate-950 border-slate-800'
                  : 'bg-gradient-to-b from-emerald-950 via-teal-900 to-slate-950 border-emerald-400'
              }`}
            >
              {soldSlots.voucher ? (
                <span className="text-xs font-black text-slate-500 my-auto">KULLANILDI</span>
              ) : (
                <>
                  <span className="text-xs font-black text-emerald-300 uppercase tracking-wider mt-1">VOUCHER</span>
                  <span className="text-2xl">🎟️</span>
                  <span className="text-[8px] font-bold text-emerald-200 text-center leading-tight">1 Iskarta Hakkı Artar</span>
                </>
              )}
            </motion.button>
          </div>

          {/* BOTTOM RIGHT PANEL: BOOSTER PACKS (BUFFOON PACK & ARCANA PACK) */}
          <div className="bg-slate-950/80 border-2 border-slate-800 rounded-2xl p-3 flex items-center justify-around gap-2 min-h-[150px]">
            {/* BOOSTER PACK 1: BUFFOON PACK ($4) */}
            <div className="flex flex-col items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-xs shadow">
                $4
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => buyItem('pack1', 4, () => onBuyCard && onBuyCard('BUFFOON_PACK', 4))}
                disabled={soldSlots.pack1 || gold < 4}
                className={`w-24 h-32 rounded-2xl border-2 flex flex-col items-center justify-between p-2 shadow-xl cursor-pointer ${
                  soldSlots.pack1
                    ? 'opacity-30 bg-slate-950 border-slate-800'
                    : 'bg-gradient-to-b from-orange-600 via-amber-700 to-rose-900 border-amber-300'
                }`}
              >
                {soldSlots.pack1 ? (
                  <span className="text-xs font-black text-slate-500 my-auto">AÇILDI</span>
                ) : (
                  <>
                    <span className="text-2xl mt-1">📦</span>
                    <span className="text-[10px] font-black text-amber-100 text-center leading-tight">Buffoon Pack</span>
                    <span className="text-[8px] font-extrabold text-slate-950 bg-amber-300 px-1.5 py-0.5 rounded-md">PACK</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* BOOSTER PACK 2: ARCANA PACK ($4) */}
            <div className="flex flex-col items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-xs shadow">
                $4
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => buyItem('pack2', 4, () => onBuyCard && onBuyCard('ARCANA_PACK', 4))}
                disabled={soldSlots.pack2 || gold < 4}
                className={`w-24 h-32 rounded-2xl border-2 flex flex-col items-center justify-between p-2 shadow-xl cursor-pointer ${
                  soldSlots.pack2
                    ? 'opacity-30 bg-slate-950 border-slate-800'
                    : 'bg-gradient-to-b from-purple-600 via-pink-700 to-indigo-900 border-pink-300'
                }`}
              >
                {soldSlots.pack2 ? (
                  <span className="text-xs font-black text-slate-500 my-auto">AÇILDI</span>
                ) : (
                  <>
                    <span className="text-2xl mt-1">✨</span>
                    <span className="text-[10px] font-black text-pink-100 text-center leading-tight">Arcana Pack</span>
                    <span className="text-[8px] font-extrabold text-slate-950 bg-pink-300 px-1.5 py-0.5 rounded-md">PACK</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
'''

with open(os.path.join(comp_dir, "ShopScreen.jsx"), "w", encoding="utf-8") as f:
    f.write(shop_jsx)

print("BalatroBackground.jsx created & ShopScreen.jsx updated to match screenshot!")

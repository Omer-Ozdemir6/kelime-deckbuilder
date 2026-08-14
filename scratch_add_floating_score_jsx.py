import os

play_path = r"c:\Users\omr_k\Projects\kelime-deckbuilder\src\components\WordPlayArea.jsx"
with open(play_path, "r", encoding="utf-8") as f:
    code = f.read()

popup_jsx = '''      {/* FLOATING SCORE POPUP ANIMATION */}
      <AnimatePresence>
        {floatingScore && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: [1, 1.3, 1.1], opacity: 1, y: -40 }}
            exit={{ opacity: 0, y: -70 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none px-6 py-2.5 rounded-3xl bg-amber-400 text-slate-950 font-black text-2xl sm:text-3xl tracking-widest font-cinzel shadow-[0_0_50px_rgba(245,158,11,0.9)] border-2 border-yellow-200"
          >
            {floatingScore}
          </motion.div>
        )}
      </AnimatePresence>'''

if "FLOATING SCORE POPUP ANIMATION" not in code:
    code = code.replace(
        "{/* Word Rack Area (Tile Tray Container) */}",
        popup_jsx + "\n\n      {/* Word Rack Area (Tile Tray Container) */}"
    )

with open(play_path, "w", encoding="utf-8") as f:
    f.write(code)

print("Floating score popup added to WordPlayArea.jsx!")

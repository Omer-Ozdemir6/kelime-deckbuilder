import os

header_path = r"c:\Users\omr_k\Projects\kelime-deckbuilder\src\components\HeaderBar.jsx"
with open(header_path, "r", encoding="utf-8") as f:
    code = f.read()

timer_span = ''' <span className={`ml-1 font-mono text-[11px] px-2 py-0.5 rounded-full border shadow ${comboTimeLeft <= 3 ? 'bg-rose-600 text-white border-rose-400 animate-bounce font-black' : 'bg-slate-950/80 text-amber-300 border-amber-500/60 font-bold'}`}>
                    ⏱️ {comboTimeLeft}s
                  </span>'''

code = code.replace(
    '<span className="tracking-wide uppercase font-extrabold">🔥 ATEŞ FIRTINASI ×{combo}</span>',
    '<span className="tracking-wide uppercase font-extrabold">🔥 ATEŞ FIRTINASI ×{combo}</span>' + timer_span
)
code = code.replace(
    '<span className="tracking-widest uppercase font-black">🌋 VOLKANİK ÖFKE ×{combo}</span>',
    '<span className="tracking-widest uppercase font-black">🌋 VOLKANİK ÖFKE ×{combo}</span>' + timer_span
)
code = code.replace(
    '<span className="tracking-widest uppercase font-black text-cyan-200">🌌 SUPERNOVA ×{combo}</span>',
    '<span className="tracking-widest uppercase font-black text-cyan-200">🌌 SUPERNOVA ×{combo}</span>' + timer_span
)

with open(header_path, "w", encoding="utf-8") as f:
    f.write(code)

print("Timer badge added to all combo tiers in HeaderBar.jsx!")

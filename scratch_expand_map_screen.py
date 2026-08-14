import os, re

map_path = r"c:\Users\omr_k\Projects\kelime-deckbuilder\src\components\MapScreen.jsx"

with open(map_path, "r", encoding="utf-8") as f:
    code = f.read()

# 1. Remove Section 2 (Neon Connector Stepper Line)
stepper_pattern = r"\{/\* ── 2\. NEON CONNECTOR STEPPER LINE ── \*/\}.*?</div>\n\n"
code = re.sub(stepper_pattern, "", code, flags=re.DOTALL)

# 2. Expand Carousel Container to full width with flex centering
code = code.replace(
    'className="flex-1 h-full flex items-center justify-start sm:justify-center snap-x snap-mandatory gap-4 sm:gap-6 py-2 px-4 overflow-x-auto scrollbar-none w-full max-w-6xl mx-auto"',
    'className="flex-1 w-full h-full flex items-center justify-center gap-3 sm:gap-6 py-2 px-2 overflow-x-auto scrollbar-none"'
)

# 3. Increase Card Width & Min Height so CTA button NEVER clips
code = code.replace(
    'className={`w-[260px] sm:w-[280px] min-h-[380px] h-auto snap-center shrink-0 rounded-3xl p-4 sm:p-5 flex flex-col justify-between border backdrop-blur-xl relative overflow-hidden shadow-2xl ${cardStyle}`}',
    'className={`flex-1 min-w-[240px] max-w-[310px] min-h-[420px] h-auto snap-center shrink-0 rounded-3xl p-4 sm:p-5 flex flex-col justify-between border backdrop-blur-xl relative shadow-2xl ${cardStyle}`}'
)

# 4. Hide Carousel Arrow buttons if not needed or make them sleeker
code = code.replace(
    'className="shrink-0 w-10 h-16 rounded-2xl bg-slate-950/90 hover:bg-slate-900 border border-amber-500/40 text-amber-300 flex items-center justify-center transition cursor-pointer shadow-xl"',
    'className="hidden md:flex shrink-0 w-10 h-16 rounded-2xl bg-slate-950/90 hover:bg-slate-900 border border-amber-500/40 text-amber-300 items-center justify-center transition cursor-pointer shadow-xl"'
)

with open(map_path, "w", encoding="utf-8") as f:
    f.write(code)

print("MapScreen.jsx updated: Stepper line removed & full widescreen expansion applied!")

import os

web_dir = r"c:\Users\omr_k\Projects\kelime-deckbuilder\src\components"
map_path = os.path.join(web_dir, "MapScreen.jsx")
toast_path = os.path.join(web_dir, "ObjectiveCompletedToast.jsx")

# 1. Update ObjectiveCompletedToast.jsx top position to top-16
with open(toast_path, "r", encoding="utf-8") as f:
    toast_code = f.read()

toast_code = toast_code.replace(
    'className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-3 pointer-events-auto"',
    'className="fixed top-16 sm:top-20 left-1/2 -translate-x-1/2 z-[200] w-full max-w-md px-3 pointer-events-auto"'
)

with open(toast_path, "w", encoding="utf-8") as f:
    f.write(toast_code)

# 2. Update MapScreen.jsx layout & centering
with open(map_path, "r", encoding="utf-8") as f:
    map_code = f.read()

# Add max-w-6xl mx-auto & justify-center to carousel container
map_code = map_code.replace(
    'className="flex-1 h-full flex items-center snap-x snap-mandatory gap-4 py-2 px-2 overflow-x-auto scrollbar-none"',
    'className="flex-1 h-full flex items-center justify-start sm:justify-center snap-x snap-mandatory gap-4 sm:gap-6 py-2 px-4 overflow-x-auto scrollbar-none w-full max-w-6xl mx-auto"'
)

# Expand card min-height to min-h-[380px] h-auto so bottom button never overflows
map_code = map_code.replace(
    'className={`w-[270px] sm:w-[290px] h-[340px] snap-center shrink-0 rounded-3xl p-4 flex flex-col justify-between border backdrop-blur-xl relative overflow-hidden shadow-2xl ${cardStyle}`}',
    'className={`w-[260px] sm:w-[280px] min-h-[380px] h-auto snap-center shrink-0 rounded-3xl p-4 sm:p-5 flex flex-col justify-between border backdrop-blur-xl relative overflow-hidden shadow-2xl ${cardStyle}`}'
)

# Center Stepper & Tags tray
map_code = map_code.replace(
    'className="my-3 px-4 py-2.5 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-2xl backdrop-blur-md flex items-center justify-between gap-2 z-20 overflow-x-auto scrollbar-none"',
    'className="my-3 px-4 py-2.5 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-2xl backdrop-blur-md flex items-center justify-between gap-2 z-20 overflow-x-auto scrollbar-none w-full max-w-5xl mx-auto"'
)

map_code = map_code.replace(
    'className="mt-3 p-3 rounded-3xl bg-slate-950/90 border border-purple-800/60 backdrop-blur-md flex items-center gap-2 overflow-x-auto z-20 shrink-0 shadow-2xl"',
    'className="mt-3 p-3 rounded-3xl bg-slate-950/90 border border-purple-800/60 backdrop-blur-md flex items-center justify-center gap-2 overflow-x-auto z-20 shrink-0 shadow-2xl w-full max-w-4xl mx-auto"'
)

with open(map_path, "w", encoding="utf-8") as f:
    f.write(map_code)

print("MapScreen.jsx & ObjectiveCompletedToast.jsx layout centering fixed!")

import os

web_dir = r"c:\Users\omr_k\Projects\kelime-deckbuilder\src\components"
splash_path = os.path.join(web_dir, "SplashScreen.jsx")
menu_path = os.path.join(web_dir, "StartMenuModal.jsx")

# 1. Update SplashScreen.jsx
with open(splash_path, "r", encoding="utf-8") as f:
    splash = f.read()

# Replace bg-slate-950 with bg-transparent in root container
splash = splash.replace(
    'className="absolute inset-0 z-[500] w-full h-full bg-slate-950 flex flex-col',
    'className="absolute inset-0 z-[500] w-full h-full bg-transparent flex flex-col'
)

# Remove the img wrapper block
old_img_block_splash = '''      {/* BACKGROUND IMAGE WITH BLURRED BACKDROP & FULL MOBILE FIT */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
        <img
          src="/1.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-xl opacity-40 scale-110 pointer-events-none"
        />
        <img
          src="/1.png"
          alt="Kelime Destesi Arka Planı"
          className="w-full h-full object-contain sm:object-cover object-center filter brightness-105 contrast-110 relative z-10"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/60 z-20 pointer-events-none" />
      </div>'''

splash = splash.replace(old_img_block_splash, '')

with open(splash_path, "w", encoding="utf-8") as f:
    f.write(splash)

# 2. Update StartMenuModal.jsx
with open(menu_path, "r", encoding="utf-8") as f:
    menu = f.read()

# Replace bg-slate-950 with bg-transparent in root container
menu = menu.replace(
    'className="absolute inset-0 z-50 w-full h-full flex flex-col justify-between p-4 sm:p-6 select-none overflow-y-auto bg-slate-950"',
    'className="absolute inset-0 z-50 w-full h-full flex flex-col justify-between p-4 sm:p-6 select-none overflow-y-auto bg-transparent"'
)

# Remove the img wrapper block
old_img_block_menu = '''      {/* BACKGROUND IMAGE WITH BLURRED BACKDROP & FULL MOBILE FIT */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
        <img
          src="/3.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-xl opacity-40 scale-110 pointer-events-none"
        />
        <img
          src="/3.png"
          alt="Kelime Destesi Ana Menü Arka Planı"
          className="w-full h-full object-contain sm:object-cover object-center filter brightness-105 contrast-110 relative z-10"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/60 z-20 pointer-events-none" />
      </div>'''

menu = menu.replace(old_img_block_menu, '')

# Add Balatro Logo Tile Graphic in center of StartMenuModal
logo_graphic_jsx = '''      {/* BALATRO LOGO GRAPHIC */}
      <div className="flex flex-col items-center justify-center my-auto z-10">
        <div className="flex items-center justify-center gap-1 sm:gap-2">
          {['K', 'E', 'L', 'İ'].map((char, i) => (
            <div key={i} className="w-12 h-16 sm:w-16 sm:h-22 rounded-xl bg-gradient-to-b from-blue-600 via-indigo-700 to-slate-900 border-2 border-cyan-400 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.5)] transform -rotate-3 hover:rotate-0 transition-transform">
              <span className="text-xl sm:text-3xl font-black text-white font-cinzel">{char}</span>
              <span className="text-[9px] font-bold text-cyan-300">+2p</span>
            </div>
          ))}
          
          {/* M Joker Tile */}
          <div className="w-14 h-18 sm:w-18 sm:h-24 rounded-xl bg-gradient-to-b from-amber-400 via-yellow-500 to-amber-600 border-2 border-yellow-200 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.8)] scale-110 z-10 animate-pulse">
            <span className="text-2xl sm:text-4xl font-black text-slate-950 font-cinzel">M</span>
            <span className="text-[9px] font-extrabold text-slate-950 bg-amber-200 px-1 rounded">🃏 JOKER</span>
          </div>

          {['E'].map((char, i) => (
            <div key={i} className="w-12 h-16 sm:w-16 sm:h-22 rounded-xl bg-gradient-to-b from-rose-600 via-red-700 to-slate-900 border-2 border-rose-400 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.5)] transform rotate-3 hover:rotate-0 transition-transform">
              <span className="text-xl sm:text-3xl font-black text-white font-cinzel">{char}</span>
              <span className="text-[9px] font-bold text-rose-300">+1p</span>
            </div>
          ))}
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-amber-300 font-cinzel tracking-widest mt-4 drop-shadow-[0_0_25px_rgba(245,158,11,0.8)]">
          KELİME DEKBUILDER
        </h1>
        <p className="text-xs sm:text-sm font-extrabold text-cyan-300 uppercase tracking-widest mt-1 bg-slate-950/80 px-3 py-1 rounded-full border border-cyan-500/40">
          ✨ TÜRKÇE ROGUELITE DECKBUILDER
        </p>
      </div>'''

menu = menu.replace(
    '/* MAIN MENU ACTION BUTTONS — POSITIONED AT VERY BOTTOM OF SCREEN */',
    logo_graphic_jsx + '\n\n      {/* MAIN MENU ACTION BUTTONS — POSITIONED AT VERY BOTTOM OF SCREEN */}'
)

with open(menu_path, "w", encoding="utf-8") as f:
    f.write(menu)

print("Static background images removed & Balatro logo tile added successfully!")

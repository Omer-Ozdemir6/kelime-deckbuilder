import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Wand2, Swords, Feather, ChevronRight, X, Check, Lock, Crown } from 'lucide-react';
import { soundEngine } from '../game/audioEngine';
import { getUnlockedHeroes } from '../game/codexManager';

export const HERO_CHARACTERS = [
  {
    id: 'SPELLCASTER',
    name: '🧙‍♂️ Söz Büyücüsü',
    role: 'Mistik Efsun Üstadı',
    icon: '🧙‍♂️',
    starterDeckId: 'starter_basit',
    color: 'from-purple-900/90 via-slate-900 to-purple-950 border-purple-500/60 text-purple-300',
    perkDesc: 'Sesli harfler +15 Ekstra Taban Puan verir. Harf çekimlerinde Joker gelme şansı %50 daha yüksektir.',
    perkBadge: '✨ Sesli Harf Efsunu',
    achievementReq: 'Varsayılan Başlangıç Karakteri (AÇIK)'
  },
  {
    id: 'WARRIOR',
    name: '⚔️ Söz Savaşçısı',
    role: 'Ağır Kelime Muhafızı',
    icon: '⚔️',
    starterDeckId: 'starter_uzun',
    color: 'from-amber-900/90 via-slate-900 to-amber-950 border-amber-500/60 text-amber-300',
    perkDesc: '5+ Harfli uzun kelimeler yazıldığında kombo asla sıfırlanmaz ve %25 ekstra puan bonusu kazanılır.',
    perkBadge: '🛡️ Çelik Kombo',
    achievementReq: 'Bölge 2 Boss\'unu Mağlup Et'
  },
  {
    id: 'TRICKSTER',
    name: '🎭 Kurnaz Şair',
    role: 'Gizemli Söz Cambazı',
    icon: '🎭',
    starterDeckId: 'starter_combo',
    color: 'from-emerald-900/90 via-slate-900 to-emerald-950 border-emerald-500/60 text-emerald-300',
    perkDesc: 'Kelime zincirlerinde (Uzatma/Dönüştürme) +8 Ekstra Altın kazandırır ve rastgele Mühür verir.',
    perkBadge: '💰 Şair Midası',
    achievementReq: '1 Savaşta 15 Kelime Yap'
  },
  {
    id: 'LEXICON_ARCHON',
    name: '👑 Kadim Mimar',
    role: 'Efsanevi Söz Hakimi',
    icon: '👑',
    starterDeckId: 'starter_joker',
    color: 'from-yellow-900/90 via-slate-900 to-amber-950 border-yellow-400 text-yellow-300',
    perkDesc: 'Tüm harfler +10 Taban Puan ile başlar ve destede 2 Ekstra Efsanevi Joker kartı yer alır!',
    perkBadge: '👑 Kadim Hakimiyet',
    achievementReq: 'Bölge 4 Final Boss\'unu Mağlup Et (Ante 4 Victory)'
  }
];

export function CharacterSelectModal({ onSelectCharacter, onBack }) {
  const unlockedHeroes = getUnlockedHeroes();
  const [selectedHeroId, setSelectedHeroId] = useState('SPELLCASTER');

  const selectedHero = HERO_CHARACTERS.find(h => h.id === selectedHeroId) || HERO_CHARACTERS[0];
  const isSelectedUnlocked = unlockedHeroes.has(selectedHeroId);

  const handleConfirm = () => {
    if (!isSelectedUnlocked) {
      soundEngine.playInvalidWord();
      return;
    }
    soundEngine.playSuccess();
    if (onSelectCharacter) {
      onSelectCharacter(selectedHero);
    }
  };

  return (
    <div className="fixed inset-0 z-[400] bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between p-5 select-none overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300">
            <Wand2 size={22} />
          </div>
          <div>
            <h2 className="text-base font-black text-amber-300 font-cinzel">KARAKTERİNİ SEÇ (ADIM 1/2)</h2>
            <p className="text-[11px] text-slate-400 font-medium">Başarımlar kazandıkça efsanevi yeni sınıflar açılır.</p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Character Choice Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
        {HERO_CHARACTERS.map((hero) => {
          const isUnlocked = unlockedHeroes.has(hero.id);
          const isSelected = hero.id === selectedHeroId;

          return (
            <motion.div
              key={hero.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                soundEngine.playTap();
                setSelectedHeroId(hero.id);
              }}
              className={`p-4 rounded-3xl border-2 transition-all flex flex-col justify-between cursor-pointer relative shadow-xl bg-gradient-to-b ${hero.color} ${
                isSelected
                  ? 'ring-2 ring-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.35)] scale-102'
                  : isUnlocked
                  ? 'opacity-70 hover:opacity-100 border-slate-800'
                  : 'opacity-50 border-slate-900 grayscale-[0.4]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-4xl filter drop-shadow">{hero.icon}</span>
                  {isSelected && isUnlocked && (
                    <span className="bg-amber-400 text-slate-950 p-1 rounded-full text-xs font-black shadow-md">
                      <Check size={14} />
                    </span>
                  )}
                  {!isUnlocked && (
                    <div className="flex items-center gap-1 bg-rose-950/90 border border-rose-500/60 px-2 py-0.5 rounded-lg text-[10px] font-black text-rose-300 shadow-md">
                      <Lock size={12} />
                      <span>KİLİTLİ</span>
                    </div>
                  )}
                </div>

                <h3 className="text-base font-black tracking-wide font-cinzel flex items-center gap-1.5">
                  <span>{hero.name}</span>
                </h3>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-2">
                  {hero.role}
                </span>

                <div className="p-2.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-[11px] font-bold leading-relaxed text-slate-300">
                  {isUnlocked ? (
                    hero.perkDesc
                  ) : (
                    <div className="text-rose-300 font-extrabold">
                      🔒 Başarım Koşulu: {hero.achievementReq}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-black text-amber-300">
                <span>{hero.perkBadge}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Confirm Action */}
      <div className="pt-3 border-t border-slate-800">
        <button
          disabled={!isSelectedUnlocked}
          onClick={handleConfirm}
          className={`w-full py-4 px-6 rounded-2xl transition flex items-center justify-center gap-2 shadow-2xl text-sm tracking-wide border cursor-pointer ${
            isSelectedUnlocked
              ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black border-amber-300 shadow-amber-500/30 animate-pulse-glow'
              : 'bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          {isSelectedUnlocked ? (
            <>
              <span>{selectedHero.name} İLE DEVAM ET — ZORLUK MÜHRÜNE GEÇ</span>
              <ChevronRight size={18} />
            </>
          ) : (
            <span>🔒 BU KARAKTER KİLİTLİ (BAŞARIM GEREKLİ)</span>
          )}
        </button>
      </div>
    </div>
  );
}

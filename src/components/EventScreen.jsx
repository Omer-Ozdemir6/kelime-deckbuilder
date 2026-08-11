import React, { useState } from 'react';
import { Sparkles, BookOpen, Gift, Coins, ChevronRight } from 'lucide-react';

export function EventScreen({ onResolveEvent }) {
  const [eventData] = useState(() => {
    const events = [
      {
        title: 'Eski Sözlük Buldun',
        icon: '📖',
        desc: 'Terk edilmiş bir kütüphane masasında tozlu ve gizemli bir eski Türkçe sözlük duruyor.',
        choices: [
          { text: 'A) Destene rastgele nadir harf ekle (Ş / Ğ / Ç)', action: 'ADD_RARE' },
          { text: 'B) Destedeki bir harfi ücretsiz geliştir', action: 'UPGRADE_FREE' },
          { text: 'C) Sözlüğü antikacıya sat (+35 💰 Altın)', action: 'GOLD_35' }
        ]
      },
      {
        title: 'Kayıp Kelime Bilmecesi',
        icon: '🧩',
        desc: 'Yaşlı bir bilge seninle iddiaya girmek istiyor: "Bir sonraki bölümde en az 5 harfli kelime oluşturabilir misin?"',
        choices: [
          { text: 'A) İddiayı kabul et (+50 💰 Altın Bonusu)', action: 'GOLD_50' },
          { text: 'B) Riski reddet, bilgeden küçük hediye al (+15 💰 Altın)', action: 'GOLD_15' }
        ]
      }
    ];

    return events[Math.floor(Math.random() * events.length)];
  });

  return (
    <div className="flex-1 flex flex-col justify-between p-5 bg-gradient-to-b from-slate-950 via-purple-950/40 to-slate-950 text-slate-100 overflow-y-auto">
      {/* Header */}
      <div className="text-center mt-3">
        <div className="w-16 h-16 rounded-2xl bg-purple-900/60 border border-purple-500/50 flex items-center justify-center text-3xl mx-auto mb-2 shadow-lg animate-float">
          {eventData.icon}
        </div>
        <h2 className="text-xl font-extrabold text-purple-300">{eventData.title}</h2>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
          "{eventData.desc}"
        </p>
      </div>

      {/* Choices */}
      <div className="flex flex-col gap-3 my-4">
        <span className="text-xs font-bold text-slate-400 text-center">BİR SEÇENEK SEÇ:</span>

        {eventData.choices.map((choice, idx) => (
          <button
            key={idx}
            onClick={() => onResolveEvent(choice.action)}
            className="p-3.5 rounded-2xl border border-purple-800/60 bg-slate-900/90 hover:bg-purple-950/60 text-left transition flex items-center justify-between shadow-md active:scale-95 group"
          >
            <span className="text-xs font-bold text-slate-200 group-hover:text-purple-200">
              {choice.text}
            </span>
            <ChevronRight size={18} className="text-purple-400 shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}

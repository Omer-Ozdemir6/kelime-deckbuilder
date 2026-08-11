import React from 'react';

export default function WordMeaningModal({ meaningData, onClose }) {
  if (!meaningData) return null;

  const { word, originalWord, isStemMatched, found, meanings } = meaningData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-2xl p-6 shadow-2xl text-slate-100 space-y-4 transform transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Badge */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-semibold tracking-wider flex items-center gap-1.5">
              <span>📖</span> TDK GÜNCEL TÜRKÇE SÖZLÜK
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            title="Kapat"
          >
            ✕
          </button>
        </div>

        {/* Word Title Section */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-3">
            <h2 className="text-3xl font-extrabold text-amber-400 tracking-wide">{originalWord}</h2>
            {isStemMatched && (
              <span className="text-xs font-semibold px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded">
                Kök: {word}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            {found ? 'Türk Dil Kurumu resmi tanımı ve örnek kullanımı:' : 'Sözlük tanımı bulunamadı.'}
          </p>
        </div>

        {/* Meanings List */}
        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
          {meanings && meanings.length > 0 ? (
            meanings.map((m, idx) => (
              <div key={idx} className="bg-slate-850/60 border border-slate-800 rounded-xl p-3.5 space-y-2 hover:border-slate-700 transition-colors">
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div className="flex-1 space-y-1">
                    {m.type && (
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-800/50 rounded mr-2">
                        {m.type}
                      </span>
                    )}
                    <p className="text-sm text-slate-200 leading-relaxed font-medium">
                      {m.anlam}
                    </p>
                  </div>
                </div>

                {/* Example sentence if available */}
                {m.example && (
                  <div className="ml-8 pl-3 border-l-2 border-amber-500/30 text-xs italic text-slate-400 space-y-0.5">
                    <p>"{m.example}"</p>
                    {m.author && <p className="text-[10px] text-amber-400 font-semibold">— {m.author}</p>}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400 italic">Anlam bilgisi mevcut değil.</p>
          )}
        </div>

        {/* Footer Action */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20"
          >
            Anlaşıldı
          </button>
        </div>
      </div>
    </div>
  );
}

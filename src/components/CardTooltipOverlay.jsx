import React from 'react';
import { createPortal } from 'react-dom';
import { Sparkles } from 'lucide-react';
import { SPECIAL_CARDS, SEAL_DEFINITIONS } from '../game/cardData';
import { JokerCardIllustration } from './JokerCardIllustration';

export function CardTooltipOverlay({ card, targetRect }) {
  if (!card || !targetRect) return null;

  const cardLetterStr = String(card.letter || '').toUpperCase();
  const isJokerLike = card.isSpecial || card.type === 'joker' || cardLetterStr.includes('JOKER') || cardLetterStr.includes('BUFFOON') || cardLetterStr.includes('ARCANA') || cardLetterStr.length > 2;

  // Only show tooltip for important/special cards (Special Tiles, Jokers, Seals, Upgraded Cards, or cards with explicit description)
  const isImportantCard = isJokerLike || Boolean(card.seal) || Boolean(card.desc) || (card.upgradeLevel && card.upgradeLevel > 0);
  if (!isImportantCard) return null;

  let title = '';
  let description = '';
  let pointText = card.points > 0 ? `+${card.points} Puan` : 'Joker Harf';

  if (isJokerLike) {
    if (cardLetterStr.includes('BUFFOON')) {
      title = 'Buffoon Joker Taşı';
      description = 'Kelimeyi tamamlayan en uygun harfe dönüşür ve kombo puanı kazandırır.';
    } else if (cardLetterStr.includes('ARCANA')) {
      title = 'Arkana Mistik Taşı';
      description = 'Kelimelerdeki harf puanlarını katlayan kadim büyü taşı.';
    } else if (card.name && !card.name.includes('_')) {
      title = card.name;
      description = card.desc || 'Kelimeyi tamamlayan en uygun harfe dönüşür.';
    } else {
      title = 'Joker Harf Taşı';
      description = 'Kelimeyi tamamlayan en uygun harfe dönüşür ve ekstra puan kazandırır.';
    }
  } else {
    const cleanLetter = cardLetterStr.substring(0, 1) || 'A';
    if (card.rarity === 'nadir') {
      title = `💎 ${cleanLetter} Harfi (Nadir)`;
      description = `Mavi parlaklığa sahip Nadir Türkçe harf (+${card.points || 3} Yüksek Puan).`;
    } else if (card.rarity === 'cok_nadir' || card.rarity === 'efsanevi') {
      title = `⭐ ${cleanLetter} Harfi (Efsanevi)`;
      description = `Altın parlaklığa sahip Efsanevi harf (+${card.points || 5} Ekstra Yüksek Puan).`;
    } else {
      title = `${cleanLetter} Harfi (Yaygın)`;
      description = `Standart Türkçe harf taşı (+${card.points || 1} Puan).`;
    }
  }


  const sealDef = card.seal ? SEAL_DEFINITIONS[card.seal] : null;

  // Calculate top/left position safely above targetRect
  const tooltipWidth = 250;
  const tooltipHeight = 115;
  
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 800;
  const left = Math.max(12, Math.min(viewportWidth - tooltipWidth - 12, targetRect.left + targetRect.width / 2 - tooltipWidth / 2));
  const top = Math.max(12, targetRect.top - tooltipHeight - 12);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      style={{ left: `${left}px`, top: `${top}px` }}
      className="fixed z-[99999] w-64 p-3 rounded-2xl bg-slate-950/95 border-2 border-amber-400 text-left shadow-[0_0_40px_rgba(245,158,11,0.9)] backdrop-blur-xl pointer-events-none animate-fade-in space-y-1.5 select-none"
    >
      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-400 flex items-center justify-center shrink-0">
            {isJokerLike ? (
              <JokerCardIllustration cardId={card.id} type={card.specialType || 'joker'} className="w-4 h-4" />
            ) : (
              <span className="text-xs font-black text-amber-300 font-cinzel">{card.letter ? String(card.letter).substring(0, 1) : 'A'}</span>
            )}
          </div>
          <span className="text-xs font-black text-amber-300 font-cinzel truncate">{title}</span>
        </div>
        <span className="text-[9px] font-black text-amber-400 bg-amber-950 px-1.5 py-0.5 rounded border border-amber-500/50 shrink-0">
          {pointText}
        </span>
      </div>


      {/* Description */}
      <p className="text-[11px] font-medium text-slate-200 leading-snug bg-slate-900/90 p-2 rounded-xl border border-slate-800">
        {description}
      </p>

      {/* Seal info if present */}
      {sealDef && (
        <div className="flex items-center gap-1 text-[10px] text-pink-300 font-bold bg-pink-950/60 p-1.5 rounded-lg border border-pink-500/40">
          <Sparkles size={11} className="text-pink-400 animate-pulse shrink-0" />
          <span>{sealDef.name}: {sealDef.desc}</span>
        </div>
      )}
    </div>,
    document.body
  );
}

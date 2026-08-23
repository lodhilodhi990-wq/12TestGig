'use client';
import React from 'react';
import { Coins } from 'lucide-react';

export function CoinIcon({ className = "w-4 h-4 inline-block" }: { className?: string }) {
  return (
    <span className="inline-flex items-center align-middle justify-center text-amber-500 font-bold">
      <Coins className={`${className} text-amber-500`} />
    </span>
  );
}

export function CoinBadge({ amount, sub }: { amount: string | number, sub?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-600 font-black text-xs font-mono">
      <Coins className="w-3.5 h-3.5 text-amber-500 shrink-0" />
      <span>{typeof amount === 'number' ? amount.toLocaleString() : amount} Coins</span>
      {sub && <span className="text-[10px] text-zinc-500 font-normal">({sub})</span>}
    </span>
  );
}

export default CoinIcon;

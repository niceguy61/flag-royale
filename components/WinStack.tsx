import React from "react";

type WinEntry = { code: string; iso2: string; name: string; wins: number };

type Props = {
  winStack: WinEntry[];
};

export default function WinStack({ winStack }: Props) {
  if (winStack.length === 0) return null;

  return (
    <div className="absolute top-[72px] left-4 z-50 flex flex-col gap-1.5">
      {winStack.slice(0, 3).map((w, i) => (
        <div
          key={w.code}
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-full border backdrop-blur-md ${
            i === 0 ? "bg-amber-500/20 border-amber-400/30" : "bg-white/[0.06] border-white/[0.1]"
          }`}
        >
          <span className="mono text-[10px] text-white/40">#{i + 1}</span>
          <img src={`https://flagcdn.com/w40/${w.iso2}.png`} alt={w.code} className="w-[18px] h-[13px] object-cover rounded-[2px]" />
          <span className="mono text-[11px] font-bold">{w.code}</span>
          <span className="mono text-[10px] text-white/50">{w.wins}W</span>
        </div>
      ))}
    </div>
  );
}

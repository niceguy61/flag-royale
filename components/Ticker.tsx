import React from "react";

type Country = { iso2: string; code: string; name: string };

type Props = {
  elimTicker: Country[];
};

export default function Ticker({ elimTicker }: Props) {
  return (
    <div className="w-full h-[28px] rounded-full bg-black/80 border border-white/[0.08] overflow-hidden flex items-center relative shrink-0">
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
      {elimTicker.length === 0 ? (
        <div className="w-full text-center mono text-[11px] tracking-wide text-white/30">
          WAITING...
        </div>
      ) : (
        <div className="flex items-center whitespace-nowrap animate-[marquee_18s_linear_infinite] will-change-transform">
          <span className="mono text-[11px] tracking-wide text-white/75 px-4">
            {elimTicker.slice(-12).map((c) => `❌ ${c.name.toUpperCase()}`).join("  •  ")}  •  
          </span>
          <span className="mono text-[11px] tracking-wide text-white/75 px-4" aria-hidden="true">
            {elimTicker.slice(-12).map((c) => `❌ ${c.name.toUpperCase()}`).join("  •  ")}  •  
          </span>
        </div>
      )}
    </div>
  );
}

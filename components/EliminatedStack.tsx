import React from "react";

type Country = { iso2: string; code: string; name: string };

type Props = {
  elimTicker: Country[];
  totalCount: number;
};

export default function EliminatedStack({ elimTicker, totalCount }: Props) {
  const flagW = 26;
  const flagH = 18;
  const gap = 2;

  return (
    <div
      className="w-full rounded-[14px] bg-white/[0.02] border border-white/[0.06] p-2"
      style={{ minHeight: '58px', maxHeight: '140px', overflowY: 'auto' }}
    >
      {elimTicker.length === 0 ? (
        <div className="flex items-center justify-center h-[42px]">
          <span className="mono text-[10px] text-white/20 tracking-wide">ELIMINATED FLAGS APPEAR HERE</span>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fill, ${flagW}px)`,
            gap: `${gap}px`,
            width: '100%',
          }}
        >
          {elimTicker.map((c, i) => (
            <div
              key={`${c.code}-${i}`}
              className="rounded-[3px] overflow-hidden border border-white/10"
              style={{ width: `${flagW}px`, height: `${flagH}px` }}
              title={c.name}
            >
              <img
                src={`https://flagcdn.com/w40/${c.iso2}.png`}
                alt={c.code}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

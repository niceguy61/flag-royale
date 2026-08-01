import React from "react";

type Country = { iso2: string; code: string; name: string };

type Props = {
  elimTicker: Country[];
  totalCount: number;
};

export default function EliminatedStack({ elimTicker, totalCount }: Props) {
  const flagW = 39;
  const flagH = 27;
  const gap = 1;

  if (elimTicker.length === 0) return null;

  return (
    <div className="w-full" style={{ maxHeight: '140px', overflowY: 'auto' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fill, ${flagW}px)`,
          gap: `${gap}px`,
          width: '100%',
        }}
      >
        {elimTicker.slice().reverse().map((c, i) => (
          <div
            key={`${c.code}-${i}`}
            className="rounded-[2px] overflow-hidden"
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
    </div>
  );
}

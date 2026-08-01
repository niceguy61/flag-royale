import React, { useEffect, useState } from "react";
import type { BoostEvent } from "../hooks/useLiveChat";

type Props = {
  events: BoostEvent[];
};

type VisibleEvent = BoostEvent & { id: number };

let eventIdCounter = 0;

export default function BoostTicker({ events }: Props) {
  const [visible, setVisible] = useState<VisibleEvent[]>([]);

  useEffect(() => {
    if (events.length === 0) return;
    const latest = events[events.length - 1];
    const ve: VisibleEvent = { ...latest, id: ++eventIdCounter };
    setVisible(prev => [...prev.slice(-4), ve]);

    // Auto remove after 3s
    const timer = setTimeout(() => {
      setVisible(prev => prev.filter(v => v.id !== ve.id));
    }, 3000);

    return () => clearTimeout(timer);
  }, [events.length]);

  if (visible.length === 0) return null;

  return (
    <div className="absolute top-[70px] right-4 z-50 flex flex-col gap-1.5 items-end">
      {visible.map((ev) => (
        <div
          key={ev.id}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-md animate-[slideDown_0.3s_ease-out]"
        >
          <img src={`https://flagcdn.com/w40/${ev.country.iso2}.png`} alt={ev.country.code} className="w-[20px] h-[14px] object-cover rounded-[2px]" />
          <span className="mono text-[11px] font-bold text-emerald-200">{ev.country.name} +1</span>
          <span className="mono text-[9px] text-white/40">{ev.user}</span>
        </div>
      ))}
    </div>
  );
}

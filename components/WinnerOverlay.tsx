import React from "react";

type Country = { iso2: string; code: string; name: string };

type Props = {
  show: boolean;
  winner: Country | null;
};

export default function WinnerOverlay({ show, winner }: Props) {
  if (!show || !winner) return null;

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center">
      <div className="absolute inset-0 bg-[#0a0a12]/80 backdrop-blur-[12px] rounded-full" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-full">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2.5 h-2.5 rounded-[2px] animate-[fall_1.8s_ease-in_forwards]"
            style={{
              left: `${Math.random() * 100}%`,
              top: "-10px",
              background: `hsl(${Math.random() * 80 + 180}, 100%, 65%)`,
              animationDelay: `${Math.random() * 0.6}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
      </div>
      <div className="relative z-10 flex flex-col items-center text-center animate-[winnerScale_0.6s_cubic-bezier(.175,.885,.32,1.275)]">
        <div className="text-[36px] font-black tracking-[-0.02em] leading-[0.9] drop-shadow-[0_0_40px_rgba(251,191,36,0.6)] mb-2">
          <span className="bg-gradient-to-b from-white via-amber-100 to-amber-300 bg-clip-text text-transparent">
            {winner.name.toUpperCase()}
          </span>
        </div>
        <div className="text-[20px] font-black text-white/30 mb-4">WON! 🏆</div>
        <div className="relative">
          <div className="absolute inset-0 blur-[30px] bg-gradient-to-br from-violet-500 to-amber-400 opacity-40 rounded-[16px] scale-150" />
          <div className="relative w-[140px] h-[100px] rounded-[12px] bg-white shadow-[0_0_50px_rgba(255,255,255,0.25)] flex items-center justify-center overflow-hidden animate-[pop_0.6s_cubic-bezier(.175,.885,.32,1.275)]">
            <img src={`https://flagcdn.com/w160/${winner.iso2}.png`} alt={winner.code} className="w-full h-full object-cover" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-400 text-black flex items-center justify-center text-[14px] shadow-lg animate-bounce">
            👑
          </div>
        </div>
        <div className="mono text-[10px] text-white/30 tracking-[0.2em] mt-4 animate-pulse">NEXT ROUND...</div>
      </div>
    </div>
  );
}

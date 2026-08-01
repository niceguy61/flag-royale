import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  ballCount: number;
  onBallCountChange: (v: number) => void;
  isPlaying: boolean;
  ttsEnabled: boolean;
  setTtsEnabled: (v: boolean) => void;
  ttsVolume: number;
  setTtsVolume: (v: number) => void;
  announceWinnerOnly: boolean;
  setAnnounceWinnerOnly: (v: boolean) => void;
  announceElim: boolean;
  setAnnounceElim: (v: boolean) => void;
  speedMult: number;
  setSpeedMult: (v: number) => void;
  elasticity: number;
  setElasticity: (v: number) => void;
  friction: number;
  setFriction: (v: number) => void;
  wallBoost: number;
  setWallBoost: (v: number) => void;
  onFullRoyale: () => void;
  speak: (text: string, rate?: number, pitch?: number, isWinner?: boolean) => void;
};

export default function SettingsModal({
  open, onClose, ballCount, onBallCountChange, isPlaying,
  ttsEnabled, setTtsEnabled, ttsVolume, setTtsVolume,
  announceWinnerOnly, setAnnounceWinnerOnly, announceElim, setAnnounceElim,
  speedMult, setSpeedMult, elasticity, setElasticity,
  friction, setFriction, wallBoost, setWallBoost,
  onFullRoyale, speak,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-[90%] max-w-[460px] max-h-[80vh] bg-[#12121e] border border-white/10 rounded-[24px] p-5 overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="mono text-[14px] font-bold tracking-wide">⚙️ SETTINGS</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[16px] transition-all">✕</button>
        </div>

        {/* Flag Count */}
        <section className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="mono text-[11px] text-white/60">FLAG COUNT</label>
            <span className="mono text-[12px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-200">{ballCount}</span>
          </div>
          <input type="range" min={20} max={195} step={5} value={ballCount} onChange={(e) => onBallCountChange(Number(e.target.value))} className="w-full accent-violet-500 h-1" disabled={isPlaying} />
          <div className="flex justify-between mono text-[9px] text-white/25 mt-1">
            <span>20</span><span>195 FULL</span>
          </div>
          <button onClick={onFullRoyale} disabled={isPlaying} className="w-full mt-2 h-[38px] rounded-[10px] bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-fuchsia-500/20 border border-violet-400/20 mono text-[11px] font-bold hover:from-cyan-500/30 hover:via-violet-500/30 hover:to-fuchsia-500/30 transition-all disabled:opacity-40">
            🌍 FULL ROYALE (195)
          </button>
        </section>

        {/* TTS */}
        <section className="mb-5 rounded-[14px] bg-white/[0.03] border border-white/[0.06] p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="mono text-[11px] text-white/60 font-bold">🔊 TTS</h3>
            <button
              onClick={() => setTtsEnabled(!ttsEnabled)}
              className={`mono text-[10px] px-3 py-1 rounded-full border transition-all ${ttsEnabled ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' : 'bg-white/5 border-white/10 text-white/30'}`}
            >
              {ttsEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
          <label className="flex items-center gap-2 cursor-pointer mb-2">
            <input type="checkbox" checked={announceWinnerOnly} onChange={(e) => setAnnounceWinnerOnly(e.target.checked)} className="accent-violet-500 w-3.5 h-3.5" />
            <span className="mono text-[11px] text-white/70">Winner only</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer mb-3">
            <input type="checkbox" checked={announceElim} onChange={(e) => setAnnounceElim(e.target.checked)} className="accent-amber-500 w-3.5 h-3.5" />
            <span className="mono text-[11px] text-white/60">Every elimination (noisy)</span>
          </label>
          <div className="flex items-center justify-between mb-1">
            <span className="mono text-[10px] text-white/40">VOLUME</span>
            <span className="mono text-[10px] text-white/60">{Math.round(ttsVolume * 100)}%</span>
          </div>
          <input type="range" min={0} max={1} step={0.05} value={ttsVolume} onChange={(e) => setTtsVolume(parseFloat(e.target.value))} className="w-full accent-violet-500 h-1" />
          <div className="flex gap-2 mt-3">
            <button onClick={() => speak('Brazil won!', 0.9, 1.15, true)} className="flex-1 h-[32px] rounded-[8px] bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 mono text-[10px] font-bold transition-all">Test TTS</button>
            <button onClick={() => { try { window.speechSynthesis.cancel(); } catch {} }} className="flex-1 h-[32px] rounded-[8px] bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 mono text-[10px] font-bold text-red-300 transition-all">Stop</button>
          </div>
        </section>

        {/* Physics */}
        <section className="rounded-[14px] bg-white/[0.03] border border-white/[0.06] p-3">
          <h3 className="mono text-[11px] text-white/60 font-bold mb-3">⚡ PHYSICS</h3>
          {[
            { label: 'SPEED', value: speedMult, set: setSpeedMult, min: 0.5, max: 3, step: 0.1 },
            { label: 'BOUNCE', value: elasticity, set: setElasticity, min: 0.5, max: 2, step: 0.1 },
            { label: 'FRICTION', value: friction, set: setFriction, min: 0.8, max: 1.2, step: 0.01 },
            { label: 'WALL BOOST', value: wallBoost, set: setWallBoost, min: 1, max: 1.2, step: 0.01 },
          ].map((s) => (
            <div key={s.label} className="mb-2">
              <div className="flex items-center justify-between">
                <span className="mono text-[10px] text-white/40">{s.label}</span>
                <span className="mono text-[10px] text-white/70">{s.value.toFixed(2)}</span>
              </div>
              <input type="range" min={s.min} max={s.max} step={s.step} value={s.value} onChange={(e) => s.set(parseFloat(e.target.value))} className="w-full accent-cyan-500 h-1" />
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

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
  showWinStackOverlay: boolean;
  setShowWinStackOverlay: (v: boolean) => void;
  ytApiKey: string;
  setYtApiKey: (v: string) => void;
  ytVideoId: string;
  setYtVideoId: (v: string) => void;
  ytConnected: boolean;
  onYtConnect: () => void;
  onYtDisconnect: () => void;
};

export default function SettingsModal({
  open, onClose, ballCount, onBallCountChange, isPlaying,
  ttsEnabled, setTtsEnabled, ttsVolume, setTtsVolume,
  announceWinnerOnly, setAnnounceWinnerOnly, announceElim, setAnnounceElim,
  speedMult, setSpeedMult, elasticity, setElasticity,
  friction, setFriction, wallBoost, setWallBoost,
  onFullRoyale, speak,
  showWinStackOverlay, setShowWinStackOverlay,
  ytApiKey, setYtApiKey, ytVideoId, setYtVideoId,
  ytConnected, onYtConnect, onYtDisconnect,
}: Props) {
  if (!open) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-[9999] bg-[#12121e] border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] rounded-t-[20px] max-h-[70vh] overflow-y-auto hide-scrollbar" onClick={(e) => e.stopPropagation()}>
      {/* Handle bar */}
      <div className="sticky top-0 bg-[#12121e] pt-3 pb-2 px-5 flex items-center justify-between z-10 border-b border-white/5">
        <h2 className="mono text-[13px] font-bold tracking-wide">⚙️ SETTINGS</h2>
        <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[14px] transition-all">✕</button>
      </div>

      <div className="p-4 space-y-4">
        {/* Flag Count + Full Royale */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <label className="mono text-[10px] text-white/50">FLAGS</label>
              <span className="mono text-[11px] font-bold text-violet-300">{ballCount}</span>
            </div>
            <input type="range" min={20} max={195} step={5} value={ballCount} onChange={(e) => onBallCountChange(Number(e.target.value))} className="w-full accent-violet-500 h-1" disabled={isPlaying} />
          </div>
          <button onClick={onFullRoyale} disabled={isPlaying} className="h-[34px] px-3 rounded-[8px] bg-violet-500/20 border border-violet-400/20 mono text-[10px] font-bold text-violet-200 hover:bg-violet-500/30 transition-all disabled:opacity-30 shrink-0">195</button>
        </div>

        {/* Display + TTS row */}
        <div className="flex gap-3">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={showWinStackOverlay} onChange={(e) => setShowWinStackOverlay(e.target.checked)} className="accent-violet-500 w-3 h-3" />
            <span className="mono text-[10px] text-white/60">Win Stack</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={ttsEnabled} onChange={(e) => setTtsEnabled(e.target.checked)} className="accent-emerald-500 w-3 h-3" />
            <span className="mono text-[10px] text-white/60">TTS</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={announceWinnerOnly} onChange={(e) => setAnnounceWinnerOnly(e.target.checked)} className="accent-violet-500 w-3 h-3" />
            <span className="mono text-[10px] text-white/60">Winner only</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={announceElim} onChange={(e) => setAnnounceElim(e.target.checked)} className="accent-amber-500 w-3 h-3" />
            <span className="mono text-[10px] text-white/60">Elim TTS</span>
          </label>
        </div>

        {/* TTS Volume */}
        {ttsEnabled && (
          <div className="flex items-center gap-2">
            <span className="mono text-[9px] text-white/40">VOL</span>
            <input type="range" min={0} max={1} step={0.05} value={ttsVolume} onChange={(e) => setTtsVolume(parseFloat(e.target.value))} className="flex-1 accent-violet-500 h-1" />
            <span className="mono text-[9px] text-white/50">{Math.round(ttsVolume * 100)}%</span>
            <button onClick={() => speak('Brazil won!', 0.9, 1.15, true)} className="h-[24px] px-2 rounded bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 mono text-[9px] font-bold transition-all">Test</button>
          </div>
        )}

        {/* Physics - compact */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'SPD', value: speedMult, set: setSpeedMult, min: 0.5, max: 3, step: 0.1 },
            { label: 'BNC', value: elasticity, set: setElasticity, min: 0.5, max: 2, step: 0.1 },
            { label: 'FRC', value: friction, set: setFriction, min: 0.8, max: 1.2, step: 0.01 },
            { label: 'WB', value: wallBoost, set: setWallBoost, min: 1, max: 1.2, step: 0.01 },
          ].map((s) => (
            <div key={s.label}>
              <div className="flex items-center justify-between">
                <span className="mono text-[8px] text-white/30">{s.label}</span>
                <span className="mono text-[8px] text-white/50">{s.value.toFixed(1)}</span>
              </div>
              <input type="range" min={s.min} max={s.max} step={s.step} value={s.value} onChange={(e) => s.set(parseFloat(e.target.value))} className="w-full accent-cyan-500 h-0.5" />
            </div>
          ))}
        </div>

        {/* YouTube Live Chat */}
        <div className="rounded-[10px] bg-white/[0.03] border border-white/[0.06] p-3">
          <h3 className="mono text-[10px] text-white/50 font-bold mb-2">📺 YOUTUBE CHAT</h3>
          <div className="space-y-2">
            <input
              type="password"
              value={ytApiKey}
              onChange={(e) => setYtApiKey(e.target.value)}
              placeholder="API Key"
              className="w-full h-[28px] px-2 rounded-[6px] bg-black/40 border border-white/10 mono text-[10px] text-white placeholder:text-white/20 outline-none focus:border-violet-500/50"
            />
            <input
              type="text"
              value={ytVideoId}
              onChange={(e) => setYtVideoId(e.target.value)}
              placeholder="Video ID"
              className="w-full h-[28px] px-2 rounded-[6px] bg-black/40 border border-white/10 mono text-[10px] text-white placeholder:text-white/20 outline-none focus:border-violet-500/50"
            />
            <button
              onClick={ytConnected ? onYtDisconnect : onYtConnect}
              disabled={!ytApiKey || !ytVideoId}
              className={`w-full h-[30px] rounded-[8px] mono text-[10px] font-bold transition-all disabled:opacity-30 ${
                ytConnected
                  ? 'bg-red-500/20 border border-red-500/30 text-red-300'
                  : 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'
              }`}
            >
              {ytConnected ? '● DISCONNECT' : '▶ CONNECT'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

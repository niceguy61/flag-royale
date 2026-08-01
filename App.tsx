import React, { useRef, useState, useEffect, useCallback } from "react";
import SettingsModal from "./components/SettingsModal";
import WinStack from "./components/WinStack";
import WinnerOverlay from "./components/WinnerOverlay";
import EliminatedStack from "./components/EliminatedStack";
import BoostTicker from "./components/BoostTicker";
import { useLiveChat } from "./hooks/useLiveChat";

type Country = { iso2: string; code: string; name: string; shortName?: string };
// 195 UN member + observers (193 + Palestine PS + Vatican VA) + Ivory Coast fix = 195 total
const COUNTRIES: Country[] = [
  { iso2: "af", code: "AFG", name: "Afghanistan" },
  { iso2: "al", code: "ALB", name: "Albania" },
  { iso2: "dz", code: "DZA", name: "Algeria" },
  { iso2: "ad", code: "AND", name: "Andorra" },
  { iso2: "ao", code: "AGO", name: "Angola" },
  { iso2: "ag", code: "ATG", name: "Antigua and Barbuda" },
  { iso2: "ar", code: "ARG", name: "Argentina" },
  { iso2: "am", code: "ARM", name: "Armenia" },
  { iso2: "au", code: "AUS", name: "Australia" },
  { iso2: "at", code: "AUT", name: "Austria" },
  { iso2: "az", code: "AZE", name: "Azerbaijan" },
  { iso2: "bs", code: "BHS", name: "Bahamas" },
  { iso2: "bh", code: "BHR", name: "Bahrain" },
  { iso2: "bd", code: "BGD", name: "Bangladesh" },
  { iso2: "bb", code: "BRB", name: "Barbados" },
  { iso2: "by", code: "BLR", name: "Belarus" },
  { iso2: "be", code: "BEL", name: "Belgium" },
  { iso2: "bz", code: "BLZ", name: "Belize" },
  { iso2: "bj", code: "BEN", name: "Benin" },
  { iso2: "bt", code: "BTN", name: "Bhutan" },
  { iso2: "bo", code: "BOL", name: "Bolivia" },
  { iso2: "ba", code: "BIH", name: "Bosnia and Herzegovina" },
  { iso2: "bw", code: "BWA", name: "Botswana" },
  { iso2: "br", code: "BRA", name: "Brazil" },
  { iso2: "bn", code: "BRN", name: "Brunei" },
  { iso2: "bg", code: "BGR", name: "Bulgaria" },
  { iso2: "bf", code: "BFA", name: "Burkina Faso" },
  { iso2: "bi", code: "BDI", name: "Burundi" },
  { iso2: "cv", code: "CPV", name: "Cabo Verde" },
  { iso2: "kh", code: "KHM", name: "Cambodia" },
  { iso2: "cm", code: "CMR", name: "Cameroon" },
  { iso2: "ca", code: "CAN", name: "Canada" },
  { iso2: "cf", code: "CAF", name: "Central African Republic" },
  { iso2: "td", code: "TCD", name: "Chad" },
  { iso2: "cl", code: "CHL", name: "Chile" },
  { iso2: "cn", code: "CHN", name: "China" },
  { iso2: "co", code: "COL", name: "Colombia" },
  { iso2: "km", code: "COM", name: "Comoros" },
  { iso2: "cg", code: "COG", name: "Congo" },
  { iso2: "cr", code: "CRI", name: "Costa Rica" },
  { iso2: "ci", code: "CIV", name: "Ivory Coast" },
  { iso2: "hr", code: "HRV", name: "Croatia" },
  { iso2: "cu", code: "CUB", name: "Cuba" },
  { iso2: "cy", code: "CYP", name: "Cyprus" },
  { iso2: "cz", code: "CZE", name: "Czechia" },
  { iso2: "cd", code: "COD", name: "DR Congo" },
  { iso2: "dk", code: "DNK", name: "Denmark" },
  { iso2: "dj", code: "DJI", name: "Djibouti" },
  { iso2: "dm", code: "DMA", name: "Dominica" },
  { iso2: "do", code: "DOM", name: "Dominican Republic" },
  { iso2: "ec", code: "ECU", name: "Ecuador" },
  { iso2: "eg", code: "EGY", name: "Egypt" },
  { iso2: "sv", code: "SLV", name: "El Salvador" },
  { iso2: "gq", code: "GNQ", name: "Equatorial Guinea" },
  { iso2: "er", code: "ERI", name: "Eritrea" },
  { iso2: "ee", code: "EST", name: "Estonia" },
  { iso2: "sz", code: "SWZ", name: "Eswatini" },
  { iso2: "et", code: "ETH", name: "Ethiopia" },
  { iso2: "fj", code: "FJI", name: "Fiji" },
  { iso2: "fi", code: "FIN", name: "Finland" },
  { iso2: "fr", code: "FRA", name: "France" },
  { iso2: "ga", code: "GAB", name: "Gabon" },
  { iso2: "gm", code: "GMB", name: "Gambia" },
  { iso2: "ge", code: "GEO", name: "Georgia" },
  { iso2: "de", code: "DEU", name: "Germany" },
  { iso2: "gh", code: "GHA", name: "Ghana" },
  { iso2: "gr", code: "GRC", name: "Greece" },
  { iso2: "gd", code: "GRD", name: "Grenada" },
  { iso2: "gt", code: "GTM", name: "Guatemala" },
  { iso2: "gn", code: "GIN", name: "Guinea" },
  { iso2: "gw", code: "GNB", name: "Guinea-Bissau" },
  { iso2: "gy", code: "GUY", name: "Guyana" },
  { iso2: "ht", code: "HTI", name: "Haiti" },
  { iso2: "hn", code: "HND", name: "Honduras" },
  { iso2: "hu", code: "HUN", name: "Hungary" },
  { iso2: "is", code: "ISL", name: "Iceland" },
  { iso2: "in", code: "IND", name: "India" },
  { iso2: "id", code: "IDN", name: "Indonesia" },
  { iso2: "ir", code: "IRN", name: "Iran" },
  { iso2: "iq", code: "IRQ", name: "Iraq" },
  { iso2: "ie", code: "IRL", name: "Ireland" },
  { iso2: "il", code: "ISR", name: "Israel" },
  { iso2: "it", code: "ITA", name: "Italy" },
  { iso2: "jm", code: "JAM", name: "Jamaica" },
  { iso2: "jp", code: "JPN", name: "Japan" },
  { iso2: "jo", code: "JOR", name: "Jordan" },
  { iso2: "kz", code: "KAZ", name: "Kazakhstan" },
  { iso2: "ke", code: "KEN", name: "Kenya" },
  { iso2: "ki", code: "KIR", name: "Kiribati" },
  { iso2: "kp", code: "PRK", name: "North Korea" },
  { iso2: "kr", code: "KOR", name: "South Korea" },
  { iso2: "kw", code: "KWT", name: "Kuwait" },
  { iso2: "kg", code: "KGZ", name: "Kyrgyzstan" },
  { iso2: "la", code: "LAO", name: "Laos" },
  { iso2: "lv", code: "LVA", name: "Latvia" },
  { iso2: "lb", code: "LBN", name: "Lebanon" },
  { iso2: "ls", code: "LSO", name: "Lesotho" },
  { iso2: "lr", code: "LBR", name: "Liberia" },
  { iso2: "ly", code: "LBY", name: "Libya" },
  { iso2: "li", code: "LIE", name: "Liechtenstein" },
  { iso2: "lt", code: "LTU", name: "Lithuania" },
  { iso2: "lu", code: "LUX", name: "Luxembourg" },
  { iso2: "mg", code: "MDG", name: "Madagascar" },
  { iso2: "mw", code: "MWI", name: "Malawi" },
  { iso2: "my", code: "MYS", name: "Malaysia" },
  { iso2: "mv", code: "MDV", name: "Maldives" },
  { iso2: "ml", code: "MLI", name: "Mali" },
  { iso2: "mt", code: "MLT", name: "Malta" },
  { iso2: "mh", code: "MHL", name: "Marshall Islands" },
  { iso2: "mr", code: "MRT", name: "Mauritania" },
  { iso2: "mu", code: "MUS", name: "Mauritius" },
  { iso2: "mx", code: "MEX", name: "Mexico" },
  { iso2: "fm", code: "FSM", name: "Micronesia" },
  { iso2: "md", code: "MDA", name: "Moldova" },
  { iso2: "mc", code: "MCO", name: "Monaco" },
  { iso2: "mn", code: "MNG", name: "Mongolia" },
  { iso2: "me", code: "MNE", name: "Montenegro" },
  { iso2: "ma", code: "MAR", name: "Morocco" },
  { iso2: "mz", code: "MOZ", name: "Mozambique" },
  { iso2: "mm", code: "MMR", name: "Myanmar" },
  { iso2: "na", code: "NAM", name: "Namibia" },
  { iso2: "nr", code: "NRU", name: "Nauru" },
  { iso2: "np", code: "NPL", name: "Nepal" },
  { iso2: "nl", code: "NLD", name: "Netherlands" },
  { iso2: "nz", code: "NZL", name: "New Zealand" },
  { iso2: "ni", code: "NIC", name: "Nicaragua" },
  { iso2: "ne", code: "NER", name: "Niger" },
  { iso2: "ng", code: "NGA", name: "Nigeria" },
  { iso2: "mk", code: "MKD", name: "North Macedonia" },
  { iso2: "no", code: "NOR", name: "Norway" },
  { iso2: "om", code: "OMN", name: "Oman" },
  { iso2: "pk", code: "PAK", name: "Pakistan" },
  { iso2: "pw", code: "PLW", name: "Palau" },
  { iso2: "ps", code: "PSE", name: "Palestine" },
  { iso2: "pa", code: "PAN", name: "Panama" },
  { iso2: "pg", code: "PNG", name: "Papua New Guinea" },
  { iso2: "py", code: "PRY", name: "Paraguay" },
  { iso2: "pe", code: "PER", name: "Peru" },
  { iso2: "ph", code: "PHL", name: "Philippines" },
  { iso2: "pl", code: "POL", name: "Poland" },
  { iso2: "pt", code: "PRT", name: "Portugal" },
  { iso2: "qa", code: "QAT", name: "Qatar" },
  { iso2: "ro", code: "ROU", name: "Romania" },
  { iso2: "ru", code: "RUS", name: "Russia" },
  { iso2: "rw", code: "RWA", name: "Rwanda" },
  { iso2: "kn", code: "KNA", name: "Saint Kitts and Nevis" },
  { iso2: "lc", code: "LCA", name: "Saint Lucia" },
  { iso2: "vc", code: "VCT", name: "Saint Vincent and the Grenadines" },
  { iso2: "ws", code: "WSM", name: "Samoa" },
  { iso2: "sm", code: "SMR", name: "San Marino" },
  { iso2: "st", code: "STP", name: "Sao Tome and Principe" },
  { iso2: "sa", code: "SAU", name: "Saudi Arabia" },
  { iso2: "sn", code: "SEN", name: "Senegal" },
  { iso2: "rs", code: "SRB", name: "Serbia" },
  { iso2: "sc", code: "SYC", name: "Seychelles" },
  { iso2: "sl", code: "SLE", name: "Sierra Leone" },
  { iso2: "sg", code: "SGP", name: "Singapore" },
  { iso2: "sk", code: "SVK", name: "Slovakia" },
  { iso2: "si", code: "SVN", name: "Slovenia" },
  { iso2: "sb", code: "SLB", name: "Solomon Islands" },
  { iso2: "so", code: "SOM", name: "Somalia" },
  { iso2: "za", code: "ZAF", name: "South Africa" },
  { iso2: "ss", code: "SSD", name: "South Sudan" },
  { iso2: "es", code: "ESP", name: "Spain" },
  { iso2: "lk", code: "LKA", name: "Sri Lanka" },
  { iso2: "sd", code: "SDN", name: "Sudan" },
  { iso2: "sr", code: "SUR", name: "Suriname" },
  { iso2: "se", code: "SWE", name: "Sweden" },
  { iso2: "ch", code: "CHE", name: "Switzerland" },
  { iso2: "sy", code: "SYR", name: "Syria" },
  { iso2: "tj", code: "TJK", name: "Tajikistan" },
  { iso2: "tz", code: "TZA", name: "Tanzania" },
  { iso2: "th", code: "THA", name: "Thailand" },
  { iso2: "tl", code: "TLS", name: "Timor-Leste" },
  { iso2: "tg", code: "TGO", name: "Togo" },
  { iso2: "to", code: "TON", name: "Tonga" },
  { iso2: "tt", code: "TTO", name: "Trinidad and Tobago" },
  { iso2: "tn", code: "TUN", name: "Tunisia" },
  { iso2: "tr", code: "TUR", name: "Turkey" },
  { iso2: "tm", code: "TKM", name: "Turkmenistan" },
  { iso2: "tv", code: "TUV", name: "Tuvalu" },
  { iso2: "ug", code: "UGA", name: "Uganda" },
  { iso2: "ua", code: "UKR", name: "Ukraine" },
  { iso2: "ae", code: "ARE", name: "United Arab Emirates" },
  { iso2: "gb", code: "GBR", name: "United Kingdom" },
  { iso2: "us", code: "USA", name: "United States" },
  { iso2: "uy", code: "URY", name: "Uruguay" },
  { iso2: "uz", code: "UZB", name: "Uzbekistan" },
  { iso2: "vu", code: "VUT", name: "Vanuatu" },
  { iso2: "va", code: "VAT", name: "Vatican City" },
  { iso2: "ve", code: "VEN", name: "Venezuela" },
  { iso2: "vn", code: "VNM", name: "Vietnam" },
  { iso2: "ye", code: "YEM", name: "Yemen" },
  { iso2: "zm", code: "ZMB", name: "Zambia" },
  { iso2: "zw", code: "ZWE", name: "Zimbabwe" },
];

type Ball = {
  id: number;
  country: Country;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  exiting: boolean;
  exitAngle: number;
  exitProgress: number;
  alive: boolean;
};

type WinEntry = { code: string; iso2: string; name: string; wins: number };

const getBallRadius = (count: number) => {
  if (count > 150) return 9;
  if (count > 100) return 11;
  return 14;
};

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const ballsRef = useRef<Ball[]>([]);
  const holeAngleRef = useRef(0);
  const holeWidthRef = useRef(0);
  const startTimeRef = useRef<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gameActiveRef = useRef(false);
  const frameCountRef = useRef(0);
  const flagImagesRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const flagFailedRef = useRef<Set<string>>(new Set());
  const speedMultRef = useRef(1);
  const elasticityRef = useRef(1);
  const frictionRef = useRef(1);
  const wallBoostRef = useRef(1.03);

  const [ballCount, setBallCount] = useState(195);
  const [remaining, setRemaining] = useState(0);
  const [winner, setWinner] = useState<Country | null>(null);
  const [showWinner, setShowWinner] = useState(false);
  const [winStack, setWinStack] = useState<WinEntry[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [holePercent, setHolePercent] = useState(0);
  const [round, setRound] = useState(1);
 const [flagsLoaded, setFlagsLoaded] = useState(false);
 const [loadProgress, setLoadProgress] = useState(0);
 const [loadedCount, setLoadedCount] = useState(0);
 const [shuffleFlash, setShuffleFlash] = useState(false);
  const [showGear, setShowGear] = useState(false);
  const [showWinStackOverlay, setShowWinStackOverlay] = useState(true);
  const [speedMult, setSpeedMult] = useState(1);
  const [elasticity, setElasticity] = useState(1);
  const [friction, setFriction] = useState(1);
  const [wallBoost, setWallBoost] = useState(1.03);

  const [elimTicker, setElimTicker] = useState<Country[]>([]);
  const [toast, setToast] = useState<Country | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  // --- TTS STATE ---
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [ttsVolume, setTtsVolume] = useState(0.8);
  const [announceElim, setAnnounceElim] = useState(false);
  const [announceWinnerOnly, setAnnounceWinnerOnly] = useState(true);
  const ttsVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const [ttsVoices, setTtsVoices] = useState<SpeechSynthesisVoice[]>([]);
  const ttsQueueRef = useRef<{ text: string; rate: number; pitch: number; isWinner?: boolean }[]>([]);
  const ttsSpeakingRef = useRef(false);
  const ttsEnabledRef = useRef(true);
  const announceElimRef = useRef(false);
  const announceWinnerRef = useRef(true);
  const ttsVolumeRef = useRef(0.8);

  useEffect(()=>{ ttsEnabledRef.current = ttsEnabled; },[ttsEnabled]);
  useEffect(()=>{ announceElimRef.current = announceElim; },[announceElim]);
  useEffect(()=>{ announceWinnerRef.current = announceWinnerOnly; },[announceWinnerOnly]);
  useEffect(()=>{ ttsVolumeRef.current = ttsVolume; },[ttsVolume]);

  useEffect(() => { speedMultRef.current = speedMult; }, [speedMult]);
  useEffect(() => { elasticityRef.current = elasticity; }, [elasticity]);
  useEffect(() => { frictionRef.current = friction; }, [friction]);
  useEffect(() => { wallBoostRef.current = wallBoost; }, [wallBoost]);

  // YouTube Live Chat
  const liveChat = useLiveChat(COUNTRIES);

  // Boost logic: when chat mentions a country, speed up that ball
  useEffect(() => {
    if (liveChat.boostEvents.length === 0) return;
    const latest = liveChat.boostEvents[liveChat.boostEvents.length - 1];
    const balls = ballsRef.current;
    for (const b of balls) {
      if (b.alive && b.country.iso2 === latest.country.iso2) {
        // Boost: increase speed by 40%
        const speed = Math.hypot(b.vx, b.vy);
        const boost = Math.max(speed * 1.4, 12);
        const angle = Math.atan2(b.vy, b.vx);
        b.vx = Math.cos(angle) * boost;
        b.vy = Math.sin(angle) * boost;
        break;
      }
    }
  }, [liveChat.boostEvents.length]);

  // TTS voice loading
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis?.getVoices() || [];
      if (voices.length > 0) {
        setTtsVoices(voices);
        // Prefer English US female voice if available
        const enUS = voices.filter(v => v.lang.toLowerCase().includes('en-us'));
        const femaleHints = ['Samantha','Google US English','Karen','Moira','Tessa','Aria','Jenny','Female','Zira'];
        let preferred: SpeechSynthesisVoice | undefined;
        for (const hint of femaleHints) {
          preferred = enUS.find(v => v.name.toLowerCase().includes(hint.toLowerCase()));
          if (preferred) break;
        }
        if (!preferred) preferred = enUS.find(v => v.name.toLowerCase().includes('female'));
        if (!preferred) preferred = enUS[0];
        if (!preferred) preferred = voices.find(v => v.lang.toLowerCase().startsWith('en'));
        if (preferred) ttsVoiceRef.current = preferred;
        else if (voices[0]) ttsVoiceRef.current = voices[0];
      }
    };
    loadVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null as any;
      }
    };
  }, []);

  const speak = useCallback((text: string, rate = 1.1, pitch = 1.0, isWinner = false) => {
    if (!ttsEnabledRef.current) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      const synth = window.speechSynthesis;
      // For non-winner, cancel overlapping to keep quiet. Winner utterances queue.
      if (!isWinner && synth.speaking) {
        synth.cancel();
      }
      const utter = new SpeechSynthesisUtterance(text);
      if (ttsVoiceRef.current) utter.voice = ttsVoiceRef.current;
      utter.rate = rate;
      utter.pitch = pitch;
      utter.volume = ttsVolumeRef.current;
      utter.lang = ttsVoiceRef.current?.lang || 'en-US';
      utter.onend = () => {
        ttsSpeakingRef.current = false;
        // process queue
        const next = ttsQueueRef.current.shift();
        if (next) {
          setTimeout(() => speak(next.text, next.rate, next.pitch, !!next.isWinner), next.isWinner ? 0 : 80);
        }
      };
      utter.onerror = () => { ttsSpeakingRef.current = false; };
      // queue if winner already speaking to avoid cut
      if (isWinner && synth.speaking) {
        ttsQueueRef.current.push({ text, rate, pitch, isWinner });
        return;
      }
      ttsSpeakingRef.current = true;
      synth.speak(utter);
    } catch {}
  }, []);

  const speakWinner = useCallback((countryName: string) => {
    if (!ttsEnabledRef.current || !announceWinnerRef.current) return;
    const text = `${countryName} won!`;
    // Clear queue for winner moment
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      ttsQueueRef.current = [];
    }
    speak(text, 0.9, 1.15, true);
  }, [speak]);

  // preload flags - 195 with progress 132/195 style
  useEffect(() => {
    const uniqueIso = Array.from(new Set(COUNTRIES.map((c) => c.iso2)));
    let loaded = 0;
    const total = uniqueIso.length;
    uniqueIso.forEach((iso) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = `https://flagcdn.com/w40/${iso}.png`;
      const done = (ok: boolean) => {
        if (ok) flagImagesRef.current.set(iso, img);
        else flagFailedRef.current.add(iso);
        loaded++;
        setLoadedCount(loaded);
        setLoadProgress(Math.round((loaded / total) * 100));
        if (loaded === total) setFlagsLoaded(true);
      };
      img.onload = () => done(true);
      img.onerror = () => done(false);
    });
  }, []);

  // toast auto-dismiss 2.5s
  useEffect(() => {
    if (toast) {
      if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = window.setTimeout(() => setToast(null), 2500) as unknown as number;
    }
    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
        toastTimeoutRef.current = null;
      }
    };
  }, [toast]);

  const ensureAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === "suspended") audioCtxRef.current.resume();
    try {
      // @ts-ignore
      if (navigator.audioSession) navigator.audioSession.type = "playback";
    } catch {}
    return audioCtxRef.current;
  }, []);

  const playPop = useCallback(
    (freq = 800, type: "pop" | "win" = "pop") => {
      const ctx = ensureAudio();
      if (!ctx) return;
      const now = ctx.currentTime;
      const master = ctx.createGain();
      master.gain.value = 0.18;
      master.connect(ctx.destination);
      if (type === "pop") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(master);
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + 0.12);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.9, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.2);
        osc.onended = () => { gain.disconnect(); master.disconnect(); };
      } else {
        [0, 0.15, 0.3, 0.45].forEach((d, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g);
          g.connect(master);
          o.frequency.setValueAtTime(400 + i * 200, now + d);
          g.gain.setValueAtTime(0.0001, now + d);
          g.gain.exponentialRampToValueAtTime(0.8, now + d + 0.02);
          g.gain.exponentialRampToValueAtTime(0.0001, now + d + 0.35);
          o.start(now + d);
          o.stop(now + d + 0.4);
          o.onended = () => { g.disconnect(); if (i === 3) master.disconnect(); };
        });
      }
    },
    [ensureAudio]
  );

  const initBalls = useCallback((count: number) => {
    const balls: Ball[] = [];
    const cx = 350;
    const cy = 350;
    const arenaR = 280;
    const r = getBallRadius(count);
    const minDist = r * 2 + 1;
    // shuffle countries
    const shuffled = [...COUNTRIES].sort(() => Math.random() - 0.5);
    for (let i = 0; i < count; i++) {
      const country = shuffled[i % shuffled.length];
      let tries = 0;
      let x = 0,
        y = 0;
      do {
        const ang = Math.random() * Math.PI * 2;
        const rad = 20 + Math.random() * (arenaR - r - 30);
        x = cx + Math.cos(ang) * rad;
        y = cy + Math.sin(ang) * rad;
        tries++;
      // early exit if many tries
        if (tries > 80) break;
      } while (balls.some((b) => Math.hypot(b.x - x, b.y - y) < minDist));
      // FAST: 6-10 speed * speedMult
      const base = 6 + Math.random() * 4;
      const speed = base * speedMultRef.current;
      const randAng = Math.random() * Math.PI * 2;
      const vx = Math.cos(randAng) * speed;
      const vy = Math.sin(randAng) * speed;
      balls.push({
        id: i,
        country,
        x,
        y,
        vx,
        vy,
        r,
        exiting: false,
        exitAngle: 0,
        exitProgress: 0,
        alive: true,
      });
    }
    ballsRef.current = balls;
    setRemaining(balls.length);
  }, []);

  useEffect(() => {
    if (flagsLoaded) initBalls(ballCount);
  }, [flagsLoaded]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = 700;
    const H = 700;
    const cx = W / 2;
    const cy = H / 2;
    const arenaR = 280;
    const totalCount = ballsRef.current.length;
    const isDense = totalCount > 100;
    const isActive = gameActiveRef.current;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0a0a12";
    ctx.fillRect(0, 0, W, H);

    const grad = ctx.createRadialGradient(cx, cy, arenaR - 20, cx, cy, arenaR + 140);
    grad.addColorStop(0, "rgba(99,102,241,0.0)");
    grad.addColorStop(0.35, "rgba(99,102,241,0.12)");
    grad.addColorStop(0.65, "rgba(139,92,246,0.15)");
    grad.addColorStop(1, "rgba(10,10,18,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, arenaR + 100, 0, Math.PI * 2);
    ctx.fill();

    const innerGrad = ctx.createRadialGradient(cx, cy, arenaR * 0.2, cx, cy, arenaR);
    innerGrad.addColorStop(0, "rgba(255,255,255,0.02)");
    innerGrad.addColorStop(1, "rgba(0,0,0,0.35)");
    ctx.fillStyle = innerGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, arenaR, 0, Math.PI * 2);
    ctx.fill();

    const holeA = holeAngleRef.current;
    const holeW = holeWidthRef.current;
    const fullyClosed = !isActive || holeW < 0.001;

    if (fullyClosed) {
      // BEFORE START: 100% closed arena, no gap, no yellow
      ctx.save();
      ctx.lineWidth = 12;
      ctx.strokeStyle = "#3a3a6a";
      ctx.shadowColor = "rgba(99,102,241,0.9)";
      ctx.shadowBlur = isDense ? 14 : 28;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(cx, cy, arenaR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.beginPath();
      ctx.arc(cx, cy, arenaR - 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    } else {
      // AFTER START: arena with growing hole
      ctx.save();
      ctx.lineWidth = 12;
      ctx.strokeStyle = "#2a2a55";
      ctx.shadowColor = "rgba(99,102,241,0.9)";
      ctx.shadowBlur = isDense ? 14 : 28;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(cx, cy, arenaR, holeA + holeW / 2, holeA - holeW / 2 + Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.beginPath();
      ctx.arc(cx, cy, arenaR - 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      const edge1 = holeA - holeW / 2;
      const edge2 = holeA + holeW / 2;
      ctx.save();
      ctx.strokeStyle = "rgba(251,191,36,0.95)";
      ctx.lineWidth = 16;
      ctx.shadowColor = "rgba(251,191,36,1)";
      ctx.shadowBlur = 30;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(cx, cy, arenaR, edge1 - 0.05, edge1 + 0.05);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, arenaR, edge2 - 0.05, edge2 + 0.05);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.strokeStyle = "rgba(251,191,36,0.25)";
      ctx.setLineDash([8, 12]);
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx, cy, arenaR, edge1, edge2);
      ctx.stroke();
      ctx.restore();
    }

    ballsRef.current.forEach((b) => {
      if (!b.alive) return;
      const speed = Math.hypot(b.vx, b.vy);
      ctx.save();
      if (b.exiting) {
        ctx.globalAlpha = Math.max(0, 1 - b.exitProgress * 1.2);
        const scale = 1 + b.exitProgress * 0.7;
        ctx.translate(b.x, b.y);
        ctx.scale(scale, scale);
        ctx.translate(-b.x, -b.y);
      }

      if (speed > 7 && !b.exiting && !isDense) {
        ctx.save();
        ctx.strokeStyle = `rgba(255,255,255,${Math.min(0.35, (speed - 6) * 0.12)})`;
        ctx.lineWidth = 1.5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(b.x - b.vx * 0.8, b.y - b.vy * 0.8);
        ctx.lineTo(b.x - b.vx * 1.6, b.y - b.vy * 1.6);
        ctx.stroke();
        ctx.restore();
      }

      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      if (!isDense) {
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 2;
      }
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      ctx.save();
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r - 1, 0, Math.PI * 2);
      ctx.clip();
      const img = flagImagesRef.current.get(b.country.iso2);
      if (img && img.complete && img.naturalWidth > 0) {
        const diam = (b.r - 1) * 2;
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;
        const scale = Math.max(diam / iw, diam / ih);
        const w = iw * scale;
        const h = ih * scale;
        const dx = b.x - w / 2;
        const dy = b.y - h / 2;
        ctx.drawImage(img, dx, dy, w, h);
      } else {
        ctx.fillStyle = "#1f1f2e";
        ctx.fillRect(b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
        ctx.fillStyle = "#ffffff";
        ctx.font = `700 ${Math.max(7, b.r * 0.7)}px JetBrains Mono, monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(b.country.code, b.x, b.y);
      }
      ctx.restore();

      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = isDense ? 1.5 : 2.2;
      ctx.stroke();

      if (b.r >= 11) {
        const code = b.country.code;
        ctx.save();
        ctx.font = `700 ${b.r > 12 ? 7.5 : 6.5}px JetBrains Mono, monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const pillW = ctx.measureText(code).width + 6;
        const pillH = 8;
        const pillY = b.y + b.r * 0.55;
        ctx.fillStyle = "rgba(0,0,0,0.72)";
        // @ts-ignore
        if (ctx.roundRect) {
          ctx.beginPath();
          // @ts-ignore
          ctx.roundRect(b.x - pillW / 2, pillY - pillH / 2, pillW, pillH, 3);
          ctx.fill();
        } else {
          ctx.fillRect(b.x - pillW / 2, pillY - pillH / 2, pillW, pillH);
        }
        ctx.fillStyle = "#ffffff";
        ctx.fillText(code, b.x, pillY + 0.5);
        ctx.restore();
      }

      if (!isDense) {
        const g2 = ctx.createRadialGradient(b.x - b.r * 0.3, b.y - b.r * 0.35, 1, b.x, b.y, b.r);
        g2.addColorStop(0, "rgba(255,255,255,0.7)");
        g2.addColorStop(0.35, "rgba(255,255,255,0.12)");
        g2.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g2;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });
  }, []);

  const stepPhysics = useCallback(() => {
    const cx = 350;
    const cy = 350;
    const arenaR = 280;
    const now = performance.now();
    const elapsed = (now - startTimeRef.current) / 1000;

    frameCountRef.current++;

    if (gameActiveRef.current) {
      // Hole starts at 0 after START, grows to 92deg over 40s
      const t = Math.min(1, elapsed / 40);
      const eased = 1 - Math.pow(1 - t, 2);
      const startDeg = 0;
      const endDeg = (92 * Math.PI) / 180;
      holeWidthRef.current = startDeg + (endDeg - startDeg) * eased;
      setHolePercent(Math.round((holeWidthRef.current * 180) / Math.PI));
      const rotSpeed = 0.005 + holeWidthRef.current * 0.004;
      holeAngleRef.current += rotSpeed;
    }

    const holeA = holeAngleRef.current;
    const holeW = holeWidthRef.current;
    const balls = ballsRef.current;
    const newlyEliminated: Country[] = [];

    balls.forEach((b) => {
      if (!b.alive) return;
      if (b.exiting) {
        b.exitProgress += 0.028;
        const push = 2.5 + b.exitProgress * 5;
        b.x += Math.cos(b.exitAngle) * push;
        b.y += Math.sin(b.exitAngle) * push;
        if (b.exitProgress > 1.25) b.alive = false;
        return;
      }

      // chaos impulse scaled by speedMult
      if (frameCountRef.current % 180 === 0) {
        b.vx += (Math.random() - 0.5) * 0.08 * speedMultRef.current;
        b.vy += (Math.random() - 0.5) * 0.08 * speedMultRef.current;
      }

      b.x += b.vx;
      b.y += b.vy;

      // friction controlled via slider
      b.vx *= frictionRef.current;
      b.vy *= frictionRef.current;

      let speed = Math.hypot(b.vx, b.vy);
      const minSpeed = 4 * speedMultRef.current;
      if (speed < minSpeed) {
        const ang = Math.random() * Math.PI * 2;
        b.vx += Math.cos(ang) * 0.8 * speedMultRef.current;
        b.vy += Math.sin(ang) * 0.8 * speedMultRef.current;
        speed = Math.hypot(b.vx, b.vy);
      }
      const maxSpeed = 14 * speedMultRef.current;
      if (speed > maxSpeed) {
        b.vx = (b.vx / speed) * maxSpeed;
        b.vy = (b.vy / speed) * maxSpeed;
      }

      const nDist = Math.hypot(b.x - cx, b.y - cy);
      const isClosedArena = !gameActiveRef.current || holeW < 0.05;
      const angle = Math.atan2(b.y - cy, b.x - cx);
      let inHole = false;
      if (!isClosedArena) {
        let diff = angle - holeA;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        inHole = Math.abs(diff) < holeW / 2;
      }

      if (nDist + b.r > arenaR) {
        if (inHole && !isClosedArena) {
          b.exiting = true;
          b.exitAngle = angle;
          newlyEliminated.push(b.country);
          playPop(500 + Math.random() * 700, "pop");
        } else {
          // Elastic bounce with wallBoost control
          const nxn = (b.x - cx) / nDist;
          const nyn = (b.y - cy) / nDist;
          const dot = b.vx * nxn + b.vy * nyn;
          if (dot > 0) {
            const restitution = wallBoostRef.current;
            b.vx = b.vx - 2 * dot * nxn * restitution;
            b.vy = b.vy - 2 * dot * nyn * restitution;
          }
          const overlap = nDist + b.r - arenaR;
          b.x -= nxn * (overlap + 1.5);
          b.y -= nyn * (overlap + 1.5);
        }
      }
    });

    // --- SPATIAL HASH GRID for O(n) collisions ---
    const cellSize = 40;
    const grid = new Map<string, Ball[]>();
    for (const b of balls) {
      if (!b.alive || b.exiting) continue;
      const gx = Math.floor(b.x / cellSize);
      const gy = Math.floor(b.y / cellSize);
      const key = `${gx},${gy}`;
      let arr = grid.get(key);
      if (!arr) {
        arr = [];
        grid.set(key, arr);
      }
      arr.push(b);
    }
    for (const b of balls) {
      if (!b.alive || b.exiting) continue;
      const gx = Math.floor(b.x / cellSize);
      const gy = Math.floor(b.y / cellSize);
      for (let ox = -1; ox <= 1; ox++) {
        for (let oy = -1; oy <= 1; oy++) {
          const key = `${gx + ox},${gy + oy}`;
          const cell = grid.get(key);
          if (!cell) continue;
          for (const other of cell) {
            if (other.id <= b.id) continue;
            if (!other.alive || other.exiting) continue;
            const dx = other.x - b.x;
            const dy = other.y - b.y;
            const dist = Math.hypot(dx, dy);
            const minD = b.r + other.r;
            if (dist < minD && dist > 0.001) {
              const nx = dx / dist;
              const ny = dy / dist;
              const overlap = minD - dist;
              b.x -= nx * overlap * 0.5;
              b.y -= ny * overlap * 0.5;
              other.x += nx * overlap * 0.5;
              other.y += ny * overlap * 0.5;
              const dvx = b.vx - other.vx;
              const dvy = b.vy - other.vy;
              const dot = dvx * nx + dvy * ny;
              if (dot < 0) continue;
              const impulse = (2 * dot) / 2;
              const elasticity = elasticityRef.current;
              b.vx -= impulse * nx * elasticity;
              b.vy -= impulse * ny * elasticity;
              other.vx += impulse * nx * elasticity;
              other.vy += impulse * ny * elasticity;
            }
          }
        }
      }
    }

    setRemaining(Math.max(0, balls.filter((bb) => bb.alive).length));
    // elimination toast + ticker (max 1 toast, 2.5s)
    if (newlyEliminated.length > 0) {
      setElimTicker((prev) => {
        return [...prev, ...newlyEliminated];
      });
      const last = newlyEliminated[newlyEliminated.length - 1];
      setToast(last);
      // TTS optional elimination
      if (ttsEnabledRef.current && announceElimRef.current) {
        // only speak last to avoid spam when multiple same frame
        const txt = `${last.name} out`;
        speak(txt, 1.1, 1.0, false);
      }
    }

    if (gameActiveRef.current && balls.filter((bb) => bb.alive).length === 1) {
      const last = balls.find((bb) => bb.alive);
      if (last) {
        gameActiveRef.current = false;
        setIsPlaying(false);
        setWinner(last.country);
        setShowWinner(true);
        playPop(0, "win");
        // TTS winner - dramatic
        if (ttsEnabledRef.current && announceWinnerRef.current) {
          // slight delay to let win pop play
          setTimeout(() => {
            const t = `${last.country.name} won!`;
            // use speakWinner logic directly inline to ensure queue cleared
            if (typeof window !== 'undefined' && window.speechSynthesis) {
              window.speechSynthesis.cancel();
              ttsQueueRef.current = [];
            }
            speak(t, 0.9, 1.15, true);
          }, 250);
        }
        setWinStack((prev) => {
          const idx = prev.findIndex((p) => p.code === last.country.code);
          if (idx >= 0) {
            const copy = [...prev];
            copy[idx] = { ...copy[idx], wins: copy[idx].wins + 1 };
            return copy.sort((a, b) => b.wins - a.wins);
          } else {
            return [
              ...prev,
              { code: last.country.code, iso2: last.country.iso2, name: last.country.name, wins: 1 },
            ].sort((a, b) => b.wins - a.wins);
          }
        });
        setTimeout(() => {
          setShowWinner(false);
          setRound((r) => r + 1);
          setElimTicker([]);
          setToast(null);
          initBalls(ballCount);
          holeWidthRef.current = (5 * Math.PI) / 180;
          setHolePercent(5);
          setTimeout(() => startGame(), 400);
        }, 3200);
      }
    } else if (gameActiveRef.current && balls.filter((bb) => bb.alive).length === 0) {
      gameActiveRef.current = false;
      setIsPlaying(false);
      setWinner(null);
      setShowWinner(false);
    }
  }, [ballCount, initBalls, playPop, speak]);

  const loop = useCallback(() => {
    stepPhysics();
    draw();
    rafRef.current = requestAnimationFrame(loop);
  }, [stepPhysics, draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = 700 * dpr;
    canvas.height = 700 * dpr;
    canvas.style.width = "700px";
    canvas.style.height = "700px";
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
    draw();
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw, loop]);

  useEffect(() => {
  const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      const size = Math.min(container.clientWidth - 16, 700);
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const startGame = useCallback(() => {
    ensureAudio();
    // Unlock TTS on user gesture (required for mobile)
    try {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length === 0) {
          // trigger voice load
          window.speechSynthesis.getVoices();
        }
        // Warmup: cancel any stale
        window.speechSynthesis.cancel();
      }
    } catch {}
    holeWidthRef.current = 0;
    startTimeRef.current = performance.now();
    frameCountRef.current = 0;
    gameActiveRef.current = true;
    setIsPlaying(true);
    setShowWinner(false);
    setWinner(null);
    setHolePercent(0);
  }, [ensureAudio]);

  const resetGame = useCallback(() => {
    gameActiveRef.current = false;
    setIsPlaying(false);
    setShowWinner(false);
    setWinner(null);
    holeWidthRef.current = 0;
    holeAngleRef.current = Math.random() * Math.PI * 2;
    setHolePercent(0);
    setElimTicker([]);
    setToast(null);
    try { if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel(); } catch {}
    initBalls(ballCount);
    setRound(1);
  }, [ballCount, initBalls]);

  const handleBallCount = (v: number) => {
    setBallCount(v);
    if (!isPlaying) {
      setElimTicker([]);
      setToast(null);
      initBalls(v);
    }
  };

  const handleFullRoyale = () => {
    setBallCount(195);
    setElimTicker([]);
    setToast(null);
    initBalls(195);
    holeWidthRef.current = 0;
    holeAngleRef.current = Math.random() * Math.PI * 2;
    setHolePercent(0);
    setShuffleFlash(true);
    setTimeout(() => setShuffleFlash(false), 1200);
  };

  const eliminated = ballCount - remaining;
  const eliminationPct = ballCount > 0 ? Math.round((eliminated / ballCount) * 100) : 0;
  const remainPct = ballCount > 0 ? (remaining / ballCount) * 100 : 0;

  return (
    <>
    <div className="w-screen h-screen bg-[#0a0a12] text-white flex flex-col overflow-hidden relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=JetBrains+Mono:wght@500;700&display=swap');
        *{font-family:'Space Grotesk',system-ui,sans-serif;}
        .mono{font-family:'JetBrains Mono',monospace;}
        @keyframes slideDown{0%{transform:translate(-50%,-18px);opacity:0}100%{transform:translate(-50%,0);opacity:1}}
        @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes fall{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(700px) rotate(720deg);opacity:0}}
        @keyframes pop{0%{transform:scale(0.3) rotate(-10deg)}100%{transform:scale(1) rotate(0deg)}}
        @keyframes float{0%,100%{transform:translate(-50%,0)}50%{transform:translate(-50%,-6px)}}
        @keyframes winnerScale{0%{transform:scale(0.5);opacity:0}100%{transform:scale(1);opacity:1}}
        .hide-scrollbar::-webkit-scrollbar{display:none;}
        .hide-scrollbar{-ms-overflow-style:none;scrollbar-width:none;}
      `}</style>

      {/* Toast */}
      {toast && (
        <div className="absolute top-[70px] left-1/2 z-[100] pointer-events-none" style={{transform:'translateX(-50%)'}}>
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#1a1a24]/95 backdrop-blur-xl border border-white/15 shadow-[0_10px_40px_rgba(0,0,0,0.6)] animate-[slideDown_0.35s_cubic-bezier(0.16,1,0.3,1)]">
            <img src={`https://flagcdn.com/w40/${toast.iso2}.png`} alt={toast.code} className="w-[28px] h-[20px] object-cover rounded-[4px]" />
            <span className="mono text-[13px] font-bold text-white">{toast.name.toUpperCase()}</span>
            <span className="mono text-[10px] px-2 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/25">OUT ❌</span>
          </div>
        </div>
      )}

      {/* Win Stack overlay */}
      {showWinStackOverlay && <WinStack winStack={winStack} />}

      {/* Boost Ticker - chat events */}
      <BoostTicker events={liveChat.boostEvents} />

      {/* CTA - fixed banner between arena and eliminated stack */}

      {/* Header */}
      <header className="w-full px-5 pt-4 pb-2 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-[16px] shadow-[0_0_24px_rgba(99,102,241,0.6)]">👑</div>
          <div>
            <h1 className="text-[16px] font-bold tracking-tight leading-none">FLAG ROYALE</h1>
            <p className="mono text-[10px] text-white/40 mt-0.5">ROUND {round} • {ballCount} FLAGS</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 h-[34px] rounded-full bg-white/[0.07] border border-white/[0.08]">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="mono text-[12px] text-white/80">{remaining}</span>
          </div>
          <button onClick={() => setShowGear(true)} className="w-[34px] h-[34px] rounded-full bg-white/[0.07] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.12] transition-all">
            <span className="text-[15px]">⚙️</span>
          </button>
        </div>
      </header>

      {/* Progress bar removed - cleaner for shorts */}


      {/* Arena canvas - fills remaining vertical space */}
      <div ref={containerRef} className="flex-1 w-full flex items-center justify-center relative px-4 py-2 min-h-0">
        <div className="relative flex items-center justify-center" style={{width:'min(100%, 96vw)',height:'100%',maxHeight:'100%'}}>
          <canvas
            ref={canvasRef}
            width={700}
            height={700}
            className="relative z-10 rounded-full"
            style={{width:'auto',height:'100%',maxHeight:'100%',maxWidth:'100%',aspectRatio:'1/1',display:'block',touchAction:'none'}}
          />

          {/* Loading */}
          {!flagsLoaded && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#0a0a12]/90 backdrop-blur">
              <div className="text-center">
                <div className="mono text-[11px] tracking-[0.3em] text-white/40 mb-3">LOADING FLAGS</div>
                <div className="w-[180px] h-[5px] bg-white/10 rounded-full overflow-hidden mx-auto">
                  <div className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 transition-all" style={{width:`${loadProgress}%`}} />
                </div>
                <div className="mono text-[12px] text-white/70 mt-2">{loadedCount}/{COUNTRIES.length}</div>
              </div>
            </div>
          )}

          {/* Winner overlay */}
          <WinnerOverlay show={showWinner} winner={winner} />

          {/* Start prompt */}
          {!isPlaying && !showWinner && remaining > 1 && flagsLoaded && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full bg-white text-black mono text-[11px] font-bold shadow-xl animate-[float_2s_ease-in-out_infinite]">
              PRESS START • {remaining} FLAGS
            </div>
          )}
        </div>
      </div>

      {/* CTA banner - fixed between arena and eliminated */}
      {liveChat.connected && (
        <div className="w-full px-5 py-1 shrink-0">
          <div className="w-full py-1.5 rounded-full bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border border-violet-400/20 text-center">
            <span className="mono text-[11px] font-bold text-white/80">💬 Chat your country to BOOST it!</span>
          </div>
        </div>
      )}

      {/* Eliminated flags stack */}
      <div className="w-full px-5">
        <EliminatedStack elimTicker={elimTicker} totalCount={ballCount} />
      </div>


      {/* Bottom bar - START / RESET */}
      <div className="w-full px-5 py-3 shrink-0 flex gap-2">
        <button
          onClick={startGame}
          disabled={isPlaying || !flagsLoaded}
          className={`flex-1 h-[50px] rounded-[16px] font-bold text-[15px] tracking-wide transition-all flex items-center justify-center gap-2 ${
            isPlaying || !flagsLoaded
              ? "bg-white/10 text-white/30 cursor-not-allowed"
              : "bg-white text-black hover:bg-white/90 active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          }`}
        >
          {!flagsLoaded ? `LOADING...` : isPlaying ? "● BATTLE..." : "▶ START"}
        </button>
        <button
          onClick={resetGame}
          className="h-[50px] px-5 rounded-[16px] bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.08] text-[13px] font-semibold mono transition-all active:scale-[0.98]"
        >
          RESET
        </button>
      </div>

      {/* Settings Modal - outside overflow container */}
    </div>
    <SettingsModal
        open={showGear}
        onClose={() => setShowGear(false)}
        ballCount={ballCount}
        onBallCountChange={handleBallCount}
        isPlaying={isPlaying}
        ttsEnabled={ttsEnabled}
        setTtsEnabled={setTtsEnabled}
        ttsVolume={ttsVolume}
        setTtsVolume={setTtsVolume}
        announceWinnerOnly={announceWinnerOnly}
        setAnnounceWinnerOnly={setAnnounceWinnerOnly}
        announceElim={announceElim}
        setAnnounceElim={setAnnounceElim}
        speedMult={speedMult}
        setSpeedMult={setSpeedMult}
        elasticity={elasticity}
        setElasticity={setElasticity}
        friction={friction}
        setFriction={setFriction}
        wallBoost={wallBoost}
        setWallBoost={setWallBoost}
        onFullRoyale={handleFullRoyale}
        speak={speak}
        showWinStackOverlay={showWinStackOverlay}
        setShowWinStackOverlay={setShowWinStackOverlay}
        ytApiKey={liveChat.apiKey}
        setYtApiKey={liveChat.setApiKey}
        ytVideoId={liveChat.videoId}
        setYtVideoId={liveChat.setVideoId}
        ytConnected={liveChat.connected}
        onYtConnect={liveChat.connect}
        onYtDisconnect={liveChat.disconnect}
      />
    </>
  );
}

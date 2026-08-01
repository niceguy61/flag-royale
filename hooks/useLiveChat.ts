import { useRef, useCallback, useState, useEffect } from "react";

type Country = { iso2: string; code: string; name: string };

export type BoostEvent = {
  country: Country;
  user: string;
  timestamp: number;
};

// Build lookup maps for country matching
function buildCountryLookup(countries: Country[]) {
  const map = new Map<string, Country>();
  for (const c of countries) {
    // full name (lowercase)
    map.set(c.name.toLowerCase(), c);
    // 3-letter code
    map.set(c.code.toLowerCase(), c);
    // 2-letter iso
    map.set(c.iso2.toLowerCase(), c);
  }
  // Common aliases
  const aliases: Record<string, string> = {
    usa: "us", america: "us", "united states": "us",
    uk: "gb", england: "gb", britain: "gb", "united kingdom": "gb",
    korea: "kr", "south korea": "kr",
    "north korea": "kp",
    russia: "ru",
    china: "cn",
    japan: "jp",
    france: "fr",
    germany: "de",
    italy: "it",
    spain: "es",
    brazil: "br",
    india: "in",
    canada: "ca",
    australia: "au",
    mexico: "mx",
    argentina: "ar",
    colombia: "co",
    turkey: "tr", turkiye: "tr",
    netherlands: "nl", holland: "nl",
    philippines: "ph",
    vietnam: "vn",
    thailand: "th",
    indonesia: "id",
    malaysia: "my",
    singapore: "sg",
    pakistan: "pk",
    bangladesh: "bd",
    egypt: "eg",
    nigeria: "ng",
    "south africa": "za",
    morocco: "ma",
    iran: "ir",
    iraq: "iq",
    "saudi arabia": "sa", saudi: "sa",
    uae: "ae", emirates: "ae",
    portugal: "pt",
    poland: "pl",
    ukraine: "ua",
    romania: "ro",
    chile: "cl",
    peru: "pe",
    venezuela: "ve",
    ecuador: "ec",
    cuba: "cu",
    sweden: "se",
    norway: "no",
    finland: "fi",
    denmark: "dk",
    ireland: "ie",
    switzerland: "ch",
    austria: "at",
    belgium: "be",
    greece: "gr",
    czech: "cz", czechia: "cz",
    hungary: "hu",
    israel: "il",
    nepal: "np",
    "sri lanka": "lk",
    myanmar: "mm", burma: "mm",
    cambodia: "kh",
    laos: "la",
    mongolia: "mn",
    kazakhstan: "kz",
    uzbekistan: "uz",
    georgia: "ge",
    armenia: "am",
    azerbaijan: "az",
    jordan: "jo",
    lebanon: "lb",
    syria: "sy",
    palestine: "ps",
    qatar: "qa",
    kuwait: "kw",
    bahrain: "bh",
    oman: "om",
    yemen: "ye",
    afghanistan: "af",
    ethiopia: "et",
    kenya: "ke",
    tanzania: "tz",
    uganda: "ug",
    ghana: "gh",
    cameroon: "cm",
    "ivory coast": "ci",
    senegal: "sn",
    algeria: "dz",
    tunisia: "tn",
    libya: "ly",
    sudan: "sd",
    somalia: "so",
    congo: "cd",
    angola: "ao",
    mozambique: "mz",
    zimbabwe: "zw",
    zambia: "zm",
    jamaica: "jm",
    "costa rica": "cr",
    panama: "pa",
    "dominican republic": "do",
    honduras: "hn",
    "el salvador": "sv",
    guatemala: "gt",
    nicaragua: "ni",
    paraguay: "py",
    uruguay: "uy",
    bolivia: "bo",
    "new zealand": "nz",
    iceland: "is",
    luxembourg: "lu",
    malta: "mt",
    cyprus: "cy",
    latvia: "lv",
    lithuania: "lt",
    estonia: "ee",
    slovenia: "si",
    croatia: "hr",
    serbia: "rs",
    albania: "al",
    "north macedonia": "mk", macedonia: "mk",
    montenegro: "me",
    "bosnia": "ba",
  };

  for (const [alias, iso2] of Object.entries(aliases)) {
    const country = countries.find(c => c.iso2 === iso2);
    if (country) map.set(alias, country);
  }

  return map;
}

function detectCountry(message: string, lookup: Map<string, Country>): Country | null {
  const lower = message.toLowerCase().trim();

  // Try exact match first (for short codes)
  if (lookup.has(lower)) return lookup.get(lower)!;

  // Try multi-word matches (longer names first)
  const keys = Array.from(lookup.keys()).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (key.length >= 3 && lower.includes(key)) {
      return lookup.get(key)!;
    }
  }

  return null;
}

export function useLiveChat(countries: Country[]) {
  const [connected, setConnected] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('yt_api_key') || '');
  const [videoId, setVideoId] = useState(() => localStorage.getItem('yt_video_id') || '');
  const [boostEvents, setBoostEvents] = useState<BoostEvent[]>([]);

  const liveChatIdRef = useRef<string | null>(null);
  const nextPageTokenRef = useRef<string | null>(null);
  const intervalRef = useRef<number | null>(null);
  const lookupRef = useRef<Map<string, Country>>(buildCountryLookup(countries));
  const processedIdsRef = useRef<Set<string>>(new Set());

  // Save to localStorage
  useEffect(() => { localStorage.setItem('yt_api_key', apiKey); }, [apiKey]);
  useEffect(() => { localStorage.setItem('yt_video_id', videoId); }, [videoId]);

  const fetchLiveChatId = useCallback(async () => {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${videoId}&key=${apiKey}`
    );
    const data = await res.json();
    const chatId = data?.items?.[0]?.liveStreamingDetails?.activeLiveChatId;
    if (!chatId) throw new Error('No active live chat found. Is the stream live?');
    return chatId;
  }, [apiKey, videoId]);

  const pollChat = useCallback(async () => {
    if (!liveChatIdRef.current) return;
    try {
      let url = `https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${liveChatIdRef.current}&part=snippet,authorDetails&maxResults=200&key=${apiKey}`;
      if (nextPageTokenRef.current) url += `&pageToken=${nextPageTokenRef.current}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.error) {
        console.warn('YouTube Chat API error:', data.error.message);
        return;
      }

      nextPageTokenRef.current = data.nextPageToken || null;

      const newEvents: BoostEvent[] = [];
      for (const item of data.items || []) {
        if (processedIdsRef.current.has(item.id)) continue;
        processedIdsRef.current.add(item.id);

        const msg = item.snippet?.displayMessage || '';
        const user = item.authorDetails?.displayName || 'anon';
        const country = detectCountry(msg, lookupRef.current);

        if (country) {
          newEvents.push({ country, user, timestamp: Date.now() });
        }
      }

      // Keep processed IDs from growing forever (keep last 5000)
      if (processedIdsRef.current.size > 5000) {
        const arr = Array.from(processedIdsRef.current);
        processedIdsRef.current = new Set(arr.slice(-3000));
      }

      if (newEvents.length > 0) {
        setBoostEvents(prev => [...prev.slice(-50), ...newEvents]);
      }
    } catch (e) {
      console.warn('Chat poll error:', e);
    }
  }, [apiKey]);

  const connect = useCallback(async () => {
    try {
      const chatId = await fetchLiveChatId();
      liveChatIdRef.current = chatId;
      nextPageTokenRef.current = null;
      processedIdsRef.current.clear();
      setConnected(true);

      // Start polling every 6 seconds
      intervalRef.current = window.setInterval(pollChat, 6000);
      // Initial poll
      pollChat();
    } catch (e: any) {
      alert(e.message || 'Failed to connect to YouTube Live Chat');
    }
  }, [fetchLiveChatId, pollChat]);

  const disconnect = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    liveChatIdRef.current = null;
    setConnected(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  // Consume boost events (returns and clears)
  const consumeBoostEvents = useCallback(() => {
    const events = [...boostEvents];
    setBoostEvents([]);
    return events;
  }, [boostEvents]);

  return {
    connected,
    apiKey, setApiKey,
    videoId, setVideoId,
    connect,
    disconnect,
    boostEvents,
    consumeBoostEvents,
  };
}

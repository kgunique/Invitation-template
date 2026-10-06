'use client';

import { useEffect, useState } from 'react';

const pad = (n: number) => String(n).padStart(2, '0');

export interface Countdown {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

/**
 * The time left until `weddingDate` (an ISO timestamp with its offset), as
 * zero-padded strings that tick every second. Until the component has mounted
 * it reports zeros — the real time can't be known on the server, and a guess
 * would mismatch on hydration. Past the date it stays at zero. Used by every
 * section that shows a countdown.
 */
export function useCountdown(weddingDate: string): Countdown {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const left = now === null ? 0 : Math.max(0, new Date(weddingDate).getTime() - now);
  return {
    days: String(Math.floor(left / 86_400_000)).padStart(2, '0'),
    hours: pad(Math.floor(left / 3_600_000) % 24),
    minutes: pad(Math.floor(left / 60_000) % 60),
    seconds: pad(Math.floor(left / 1000) % 60),
  };
}

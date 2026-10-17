'use client';

import { useEffect, useState } from 'react';

/**
 * A call's running time, "00:00" ticking up every second as a phone shows it ("1:02:05" past the hour). It stands
 * at 00:00 until `running` (so server and browser draw the same), then counts from that moment.
 */
export function CallTimer({ running, className = '' }: { running: boolean; className?: string }) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!running) return;
    const start = Date.now();
    const id = setInterval(() => setSeconds(Math.floor((Date.now() - start) / 1000)), 1000);
    return () => clearInterval(id);
  }, [running]);

  const two = (n: number) => String(n).padStart(2, '0');
  const h = Math.floor(seconds / 3600);
  const text = `${h ? `${h}:` : ''}${two(Math.floor(seconds / 60) % 60)}:${two(seconds % 60)}`;
  return <span className={`tabular-nums ${className}`}>{text}</span>;
}

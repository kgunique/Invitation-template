import type { CSSProperties } from 'react';

/** A small clay lamp, its flame flickering and a warm light round it. */
export function Diya({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 28" aria-hidden className={className} style={style}>
      <circle cx="12" cy="18" r="11" fill="#ffb347" fillOpacity="0.28" />
      <g className="amb-flicker" style={{ transformBox: 'fill-box', transformOrigin: 'center bottom', animationDelay: 'var(--flicker-delay, 0s)' }}>
        <path d="M12 2c4 5 4 8 0 11-4-3-4-6 0-11z" fill="#ff8a1f" />
        <path d="M12 6c2 3 2 5 0 7-2-2-2-4 0-7z" fill="#ffe27a" />
      </g>
      <path d="M3 16h18c-1 6-5 8-9 8s-8-2-9-8z" fill="#9a4a1c" />
      <path d="M3 16h18" stroke="#f0b04a" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

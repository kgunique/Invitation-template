import type { CSSProperties } from 'react';

/** A kalash: a copper pot, a ring of marigolds round its neck, mango leaves fanning from its mouth and a coconut on top. */
export function Kalash({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 -12 80 116" aria-hidden className={className} style={style}>
      <defs>
        <linearGradient id="kalash-pot" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f0b25a" />
          <stop offset="0.5" stopColor="#c9792b" />
          <stop offset="1" stopColor="#8a4a14" />
        </linearGradient>
      </defs>
      {/* The mango leaves. */}
      {[-52, -26, 0, 26, 52].map((a, i) => (
        <path
          key={a}
          d="M0 0C-8 -12 -8 -30 0 -42C8 -30 8 -12 0 0Z"
          transform={`translate(40 46) rotate(${a})`}
          fill={i % 2 ? '#2f8a3f' : '#3f9d4c'}
        />
      ))}
            {/* The coconut, big, with its husk lines, three dark eyes and a tuft of fibre. */}
      <ellipse cx="40" cy="24" rx="15.5" ry="17.5" fill="#8a5a2b" />
      <ellipse cx="35" cy="17" rx="7" ry="9" fill="#ffffff" fillOpacity="0.12" />
      <path d="M28 20c3-9 21-9 24 0M26 26c4 8 24 8 28 0" fill="none" stroke="#6b3f17" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M40 7V41" stroke="#6b3f17" strokeWidth="0.9" strokeOpacity="0.55" />
      <circle cx="34.5" cy="27" r="2" fill="#3a220c" />
      <circle cx="45.5" cy="27" r="2" fill="#3a220c" />
      <circle cx="40" cy="33" r="2" fill="#3a220c" />
      <path d="M40 7l-5-9M40 7l5-9M40 7V-4M40 7l-9-5M40 7l9-5" stroke="#c9792b" strokeWidth="1.8" strokeLinecap="round" />
      {/* The pot. */}
      <ellipse cx="40" cy="48" rx="13" ry="3.4" fill="#f4c27a" />
      <path d="M28 49h24l-2 8H30z" fill="url(#kalash-pot)" />
      <path d="M30 57C12 62 8 90 28 98h24C72 90 68 62 50 57z" fill="url(#kalash-pot)" />
      <path d="M12 76C30 84 50 84 68 76" fill="none" stroke="#f6d88a" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M14 82C32 90 48 90 66 82" fill="none" stroke="#7a3d10" strokeOpacity="0.5" strokeWidth="1" />
      {/* A swastika in kumkum on the belly. */}
      <path d="M40 66v14M33 73h14M40 66h5M47 73v5M40 80h-5M33 73v-5" fill="none" stroke="#c0392b" strokeWidth="2" strokeLinecap="round" />
      {/* The marigold garland round the neck. */}
      {Array.from({ length: 9 }, (_, i) => {
        const t = i / 8;
        return <circle key={i} cx={26 + t * 28} cy={52 + Math.sin(t * Math.PI) * 5} r="3" fill={i % 2 ? '#f5a623' : '#e8591a'} />;
      })}
    </svg>
  );
}

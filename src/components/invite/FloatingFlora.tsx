import { useId, type CSSProperties } from 'react';

/**
 * Things that float on water, drawn in SVG (each a square box that takes its size from `className`/`style`, seen from above):
 * a lotus, a lily pad, a marigold, a jasmine, and a few loose petals. Every colour is a prop with a sensible default.
 */
type Props = { className?: string; style?: CSSProperties };

const ring = (n: number, from = 0) => Array.from({ length: n }, (_, i) => from + (360 / n) * i);

/** A lotus: two rings of pointed petals round a golden heart. */
export function Lotus({ className, style, outer = ['#fbc4d9', '#e8629a'], inner = ['#fff0f5', '#f6a3c3'] }: Props & { outer?: [string, string]; inner?: [string, string] }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={className} style={style}>
      <defs>
        <radialGradient id={`${id}o`} cx="50%" cy="85%" r="90%">
          <stop offset="0" stopColor={outer[1]} />
          <stop offset="1" stopColor={outer[0]} />
        </radialGradient>
        <radialGradient id={`${id}i`} cx="50%" cy="85%" r="90%">
          <stop offset="0" stopColor={inner[1]} />
          <stop offset="1" stopColor={inner[0]} />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="56" rx="38" ry="38" fill="rgba(20,50,50,0.28)" />
      {ring(8).map((a) => (
        <path key={`o${a}`} d="M50 52C34 40 36 14 50 3C64 14 66 40 50 52Z" fill={`url(#${id}o)`} stroke="rgba(150,30,80,0.35)" strokeWidth="0.6" transform={`rotate(${a} 50 52)`} />
      ))}
      {ring(8, 22.5).map((a) => (
        <path key={`i${a}`} d="M50 52C39 43 41 24 50 15C59 24 61 43 50 52Z" fill={`url(#${id}i)`} stroke="rgba(180,60,110,0.3)" strokeWidth="0.5" transform={`rotate(${a} 50 52)`} />
      ))}
      <circle cx="50" cy="52" r="7.5" fill="#f3c33b" />
      <circle cx="50" cy="52" r="4.2" fill="#e8961e" />
      {ring(10).map((a) => (
        <circle key={`s${a}`} cx="50" cy="43.5" r="1.1" fill="#ffe9a0" transform={`rotate(${a} 50 52)`} />
      ))}
    </svg>
  );
}

/** A lily pad: a green disc with a wedge cut out, veins running from the notch. */
export function LilyPad({ className, style, colors = ['#4fae5a', '#1f6b3a'] }: Props & { colors?: [string, string] }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={className} style={style}>
      <defs>
        <radialGradient id={id} cx="40%" cy="38%" r="75%">
          <stop offset="0" stopColor={colors[0]} />
          <stop offset="1" stopColor={colors[1]} />
        </radialGradient>
      </defs>
      <path d="M50 50L86 38A38 38 0 1 1 74 18Z" fill="rgba(10,40,30,0.3)" transform="translate(2 3)" />
      <path d="M50 50L86 40A38 38 0 1 1 72 17Z" fill={`url(#${id})`} stroke="#16502c" strokeWidth="1" />
      {ring(9, 8).map((a) => (
        <path key={a} d="M50 50L50 16" stroke="rgba(190,240,170,0.5)" strokeWidth="0.8" transform={`rotate(${a} 50 50)`} />
      ))}
    </svg>
  );
}

/** A marigold seen from above: three rings of frilled petals and a dark eye. */
export function Marigold({ className, style, colors = ['#ffb21e', '#e8591a'] }: Props & { colors?: [string, string] }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={className} style={style}>
      <defs>
        <radialGradient id={id} cx="50%" cy="50%" r="55%">
          <stop offset="0" stopColor={colors[0]} />
          <stop offset="1" stopColor={colors[1]} />
        </radialGradient>
      </defs>
      <circle cx="50" cy="52" r="40" fill="rgba(20,40,40,0.25)" />
      {[[16, 0, 40, 9], [14, 12, 31, 8], [12, 6, 21, 7]].map(([n, from, rad, rx], k) =>
        ring(n, from).map((a) => <ellipse key={`${k}-${a}`} cx="50" cy={50 - rad + 4} rx={rx - 2.5} ry={rx + 1} fill={`url(#${id})`} stroke="rgba(150,50,10,0.35)" strokeWidth="0.5" transform={`rotate(${a} 50 50)`} />),
      )}
      <circle cx="50" cy="50" r="6" fill="#a8400e" />
    </svg>
  );
}

/** A jasmine: five white petals round a pale gold eye. */
export function Jasmine({ className, style }: Props) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={className} style={style}>
      <circle cx="50" cy="52" r="30" fill="rgba(20,40,40,0.22)" />
      {ring(5).map((a) => (
        <ellipse key={a} cx="50" cy="28" rx="13" ry="21" fill="#fffdf6" stroke="rgba(120,110,80,0.35)" strokeWidth="0.6" transform={`rotate(${a} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="6" fill="#f2d675" />
    </svg>
  );
}

/** A loose petal, curled a little, for a scatter on the water. */
export function Petal({ className, style, color = '#f06292' }: Props & { color?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={className} style={style}>
      <path d="M50 8C78 28 84 66 50 92C16 66 22 28 50 8Z" fill={color} />
      <path d="M50 8C60 40 56 66 50 92" stroke="rgba(255,255,255,0.35)" strokeWidth="2" fill="none" />
    </svg>
  );
}

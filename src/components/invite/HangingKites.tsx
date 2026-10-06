import { useId, type CSSProperties } from 'react';

export interface HangingKitesColors {
  /** The kite's three bands, outside in: [outer, middle, inner]. */
  bands: [string, string, string];
  /** The dotted string and the tassel. */
  string: string;
  tassel: string;
}

const DEFAULT_COLORS: HangingKitesColors = {
  bands: ['#f9c74f', '#f3722c', '#90be6d'],
  string: '#e6a46a',
  tassel: '#f06b8a',
};

// Each string: where it hangs, how long it is, how big its kite, how it swings.
const STRINGS = [
  { x: 22, len: 76, kite: 1, dur: 4.7, delay: -1.2, angle: 4.2 },
  { x: 46, len: 116, kite: 0.52, dur: 3.8, delay: -2.9, angle: 3 },
];

const pivot = (x: number, y: number): CSSProperties => ({ transformBox: 'view-box', transformOrigin: `${x}px ${y}px` });

export interface HangingKitesProps {
  /** Mirror it, for the top right corner. */
  mirror?: boolean;
  colors?: Partial<HangingKitesColors>;
  /** Put the width and position here (it is 84 x 230 and hangs from its top edge). */
  className?: string;
}

/**
 * Paper kites hanging from the top of a page on dotted strings, the way they
 * are strung across a courtyard for a celebration: a big diamond with three
 * coloured bands and a small one beside it on a longer string, each ending in a
 * tassel. They swing from their strings and the kites swing a little further
 * and quicker, never in step (CSS only: `amb-sway amb-sway--hang`). Put one in
 * each top corner, the second with `mirror`. Pointer-transparent.
 */
export function HangingKites({ mirror = false, colors, className = '' }: HangingKitesProps) {
  const c = { ...DEFAULT_COLORS, ...colors };
  const id = useId().replace(/:/g, '');

  return (
    <svg
      viewBox="0 0 84 230"
      aria-hidden
      className={`pointer-events-none overflow-visible ${mirror ? '-scale-x-100' : ''} ${className}`}
    >
      <defs>
        {/* One kite, centred on (0, 0): a diamond with two more inside it, a cross of bones and a tassel. */}
        <g id={`${id}-kite`}>
          <path d="M0 -26L22 0 0 26-22 0z" fill={c.bands[0]} />
          <path d="M0 -19L16 0 0 19-16 0z" fill={c.bands[1]} />
          <path d="M0 -11L9 0 0 11-9 0z" fill={c.bands[2]} />
          <path d="M0 -26V26M-22 0H22" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="1" />
          <path d="M0 -26L22 0 0 26-22 0z" fill="none" stroke="#c9852f" strokeOpacity="0.6" strokeWidth="1" />
          <path d="M0 26V36M-4 28L-5 40M4 28L5 40" stroke={c.tassel} strokeWidth="1.6" strokeLinecap="round" />
          <circle cy="26" r="2.2" fill={c.tassel} />
        </g>
      </defs>

      {STRINGS.map((s) => (
        <g
          key={s.x}
          className="amb-sway amb-sway--hang"
          style={
            {
              ...pivot(s.x, 0),
              animationDuration: `${s.dur}s`,
              animationDelay: `${s.delay}s`,
              '--sway-angle': `${s.angle}deg`,
            } as CSSProperties
          }
        >
          <path d={`M${s.x} 0V${s.len}`} stroke={c.string} strokeWidth="1.6" strokeLinecap="round" strokeDasharray="0.1 4.4" />
          <g
            className="amb-sway amb-sway--hang"
            style={
              {
                ...pivot(s.x, s.len),
                animationDuration: `${s.dur * 0.7}s`,
                animationDelay: `${s.delay * 1.5}s`,
                '--sway-angle': `${s.angle * 1.9}deg`,
              } as CSSProperties
            }
          >
            <g transform={`translate(${s.x} ${s.len + 26 * s.kite}) scale(${s.kite})`}>
              <use href={`#${id}-kite`} />
            </g>
          </g>
        </g>
      ))}
    </svg>
  );
}

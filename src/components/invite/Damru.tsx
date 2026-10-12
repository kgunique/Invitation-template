'use client';

import { useEffect, useId, useState, type CSSProperties } from 'react';

export interface DamruColors {
  /** The wood of the drum, light and dark, and the gold of its band. */
  wood: [string, string];
  gold: string;
  /** The skins stretched over its two ends, and the bead on each cord. */
  skin: string;
  bead: string;
}

const DEFAULT_COLORS: DamruColors = { wood: ['#c8792f', '#4e2208'], gold: '#e9c97a', skin: '#f6e7c8', bead: '#b4501b' };

/**
 * Shiva's damru, drawn in SVG: an hourglass drum (two cones meeting at a narrow waist, a skin over each end, a band of gold
 * and a row of studs round the waist) with two knotted cords, one running up the drum from the waist and one down it, each ending in a bead. It shakes
 * from the wrist all the time, slowly — the drum turning a little to and fro, the cords swinging from the waist, one a beat behind the other
 * — and when it is touched it shakes hard for a couple of seconds, as it does when it is played. CSS only (`amb-limb`),
 * a touch only changes the speed; it stops under reduced motion. Scales to the width you give it (`className`).
 */
export function Damru({ className = '', colors, label = 'डमरू' }: { className?: string; colors?: Partial<DamruColors>; label?: string }) {
  const c = { ...DEFAULT_COLORS, ...colors };
  const id = useId().replace(/:/g, '');
  const [played, setPlayed] = useState(0);
  const [hard, setHard] = useState(false);
  useEffect(() => {
    if (!played) return;
    setHard(true);
    const t = setTimeout(() => setHard(false), 2200);
    return () => clearTimeout(t);
  }, [played]);

  const drum = { ['--limb-origin' as string]: 'center', ['--limb-angle' as string]: hard ? '22deg' : '10deg', ['--limb-dur' as string]: hard ? '0.16s' : '0.9s' } as CSSProperties;
  // each cord swings from the waist, the upper one from its foot and the lower one from its top, one a beat behind the other
  const cord = (up: boolean) =>
    ({
      ['--limb-origin' as string]: up ? 'bottom center' : 'top center',
      ['--limb-angle' as string]: hard ? '46deg' : '22deg',
      ['--limb-dur' as string]: hard ? '0.16s' : '0.9s',
      ['--limb-delay' as string]: up ? '0s' : hard ? '-0.08s' : '-0.45s',
    }) as CSSProperties;

  return (
    <button type="button" onClick={() => setPlayed((n) => n + 1)} aria-label={label} className={`block ${className}`}>
      <svg viewBox="-6 0 112 124" aria-hidden className="block h-auto w-full overflow-visible">
        <defs>
          <linearGradient id={`${id}w`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={c.wood[1]} />
            <stop offset="0.35" stopColor={c.wood[0]} />
            <stop offset="0.7" stopColor={c.wood[0]} />
            <stop offset="1" stopColor={c.wood[1]} />
          </linearGradient>
        </defs>
        {/* the drum */}
        <g className="amb-limb" style={drum}>
          <path d="M14 17C32 36 43 51 41 61C43 71 32 86 14 105C30 112 70 112 86 105C68 86 57 71 59 61C57 51 68 36 86 17C70 10 30 10 14 17Z" fill={`url(#${id}w)`} stroke="#4a2008" strokeWidth="1" />
          <ellipse cx="50" cy="15" rx="36" ry="8" fill={c.skin} stroke="#4a2008" strokeWidth="1.2" />
          <ellipse cx="50" cy="15" rx="30" ry="5.6" fill="none" stroke="#c9a46a" strokeWidth="0.8" />
          <ellipse cx="50" cy="107" rx="36" ry="8" fill={c.skin} stroke="#4a2008" strokeWidth="1.2" />
          <ellipse cx="50" cy="107" rx="30" ry="5.6" fill="none" stroke="#c9a46a" strokeWidth="0.8" />
          {/* the gold band at the waist and its studs, and two thinner bands */}
          <path d="M40 56C46 59 54 59 60 56L60 66C54 69 46 69 40 66Z" fill={c.gold} stroke="#7a5a1a" strokeWidth="0.8" />
          {[44, 50, 56].map((x) => (
            <circle key={x} cx={x} cy={62 + (x === 50 ? 1.8 : 0)} r="1.2" fill="#7a3a14" />
          ))}
          <path d="M22 30C30 38 36 44 38 49" fill="none" stroke={c.gold} strokeWidth="1.4" opacity="0.8" />
          <path d="M78 30C70 38 64 44 62 49" fill="none" stroke={c.gold} strokeWidth="1.4" opacity="0.8" />
          <path d="M22 92C30 84 36 78 38 73" fill="none" stroke={c.gold} strokeWidth="1.4" opacity="0.8" />
          <path d="M78 92C70 84 64 78 62 73" fill="none" stroke={c.gold} strokeWidth="1.4" opacity="0.8" />
          {/* a highlight down the left of each cone */}
          <path d="M20 22C30 36 36 46 36 58" fill="none" stroke="#fff0cf" strokeWidth="2" opacity="0.28" strokeLinecap="round" />
        </g>
        {/* the two cords, one up the drum from the waist and one down it, each ending in a bead */}
        <g className="amb-limb" style={cord(true)}>
          <path d="M50 59L50 34" fill="none" stroke={c.gold} strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="50" cy="30" r="5.4" fill={c.bead} stroke="#5a2a0e" strokeWidth="0.8" />
          <circle cx="48.4" cy="28.2" r="1.5" fill="#fff0cf" opacity="0.6" />
        </g>
        <g className="amb-limb" style={cord(false)}>
          <path d="M50 63L50 88" fill="none" stroke={c.gold} strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="50" cy="92" r="5.4" fill={c.bead} stroke="#5a2a0e" strokeWidth="0.8" />
          <circle cx="48.4" cy="90.2" r="1.5" fill="#fff0cf" opacity="0.6" />
        </g>
      </svg>
    </button>
  );
}

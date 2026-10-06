import type { CSSProperties } from 'react';

export interface ElephantFriezeColors {
  /** The elephants' skin: [lit, shaded]. */
  skin: [string, string];
  /** The cloth over their backs and heads. */
  cloth: string;
  /** The gold trim on the cloth, the anklets and the diya's rim. */
  gold: string;
  /** The lamp's bowl, and the centre of the forehead jewel. */
  bowl: string;
  /** The flame: [outer, inner]. */
  flame: [string, string];
  /** The tusks and toenails. */
  ivory: string;
}

const DEFAULT_COLORS: ElephantFriezeColors = {
  skin: ['#a183d4', '#6d4ea3'],
  cloth: '#e0489a',
  gold: '#f4b942',
  bowl: '#8a4513',
  flame: ['#ff8a1f', '#ffd54a'],
  ivory: '#f8efe2',
};

const W = 124; // one elephant's width in the drawing's units
const MID = 6; // extra room between the two of a pair, where the lamp is held
const GAP = 16; // room between one pair and the next
const H = 100;

/** One step takes this long (a leg swings one way across); a whole stride is twice it. */
const STEP = 0.85;

const limb = (angle: number, dur: number, delay: number, origin?: string): CSSProperties =>
  ({
    '--limb-angle': `${angle}deg`,
    '--limb-dur': `${dur}s`,
    '--limb-delay': `${delay}s`,
    ...(origin ? { '--limb-origin': origin } : {}),
  }) as CSSProperties;

/** The body rises and falls twice for each stride, once per step. */
const bob = (delay: number): CSSProperties =>
  ({ '--bob-dur': `${STEP / 2}s`, '--bob-delay': `${delay}s`, '--bob-y': '-1.6px' }) as CSSProperties;

/**
 * One elephant, facing right, standing on y = 90 inside a 124 x 100 box, its
 * trunk raised with the tip at about (118, 14). It walks on the spot: the legs
 * swing in diagonal pairs (the near fore with the far hind, then the other two),
 * the body bobs once a step, the ear flaps and the tail swings. `phase`
 * (seconds) shifts the whole stride, so two elephants don't step in unison.
 */
function Elephant({ c, phase }: { c: ElephantFriezeColors; phase: number }) {
  // Diagonal pairs swing opposite ways: a delay of one whole step puts a limb half a stride out.
  const a = phase;
  const b = phase - STEP;
  return (
    <g>
      {/* The far legs, in shade, and the tail with its tuft. */}
      <g className="amb-limb" style={limb(9, STEP, a)}>
        <path d="M40 66h13l1 22q-7 4-15 0z" fill={c.skin[1]} />
      </g>
      <g className="amb-limb" style={limb(9, STEP, b)}>
        <path d="M68 66h13l1 22q-7 4-15 0z" fill={c.skin[1]} />
      </g>
      <g className="amb-limb" style={limb(13, 1.5, phase, '100% 0%')}>
        <path d="M14 46C6 52 5 62 9 70" fill="none" stroke={c.skin[1]} strokeWidth="3.2" strokeLinecap="round" />
        <path d="M9 69c-3 3-4 6-3 9 3 0 6-2 7-5z" fill={c.skin[1]} />
      </g>

      {/* The body, with a soft shade along the belly. */}
      <g className="amb-bob" style={bob(phase)}>
        <path d="M14 52C10 34 24 22 46 21c20-1 36 6 40 22l2 22c0 6-4 9-10 9H26c-8 0-12-6-12-14z" fill={c.skin[0]} />
        <path d="M26 72c14 5 46 5 62-2" fill="none" stroke={c.skin[1]} strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* The near legs, with anklets and toenails. */}
      <g className="amb-limb" style={limb(9, STEP, b)}>
        <path d="M22 64h16l2 24q-9 5-19 0z" fill={c.skin[0]} />
        <path d="M21 76h17" stroke={c.gold} strokeWidth="3" strokeLinecap="round" />
        <path d="M23 86h3M29 86h3M35 86h3" stroke={c.ivory} strokeWidth="2.2" strokeLinecap="round" />
      </g>
      <g className="amb-limb" style={limb(9, STEP, a)}>
        <path d="M72 64h17l1 24q-10 5-19 0z" fill={c.skin[0]} />
        <path d="M72 76h17" stroke={c.gold} strokeWidth="3" strokeLinecap="round" />
        <path d="M74 86h3M80 86h3M86 86h3" stroke={c.ivory} strokeWidth="2.2" strokeLinecap="round" />
      </g>

      {/* Everything above the legs rides the same bob. */}
      <g className="amb-bob" style={bob(phase)}>
        {/* The ear, in shade, with a fold; it flaps. */}
        <g className="amb-limb" style={limb(5, 0.9, phase - 0.2, '50% 0%')}>
          <path d="M80 22C64 18 56 34 62 52c4 8 14 8 18-2 4-10 4-20 0-28z" fill={c.skin[1]} />
          <path d="M77 28C68 28 64 38 67 48" fill="none" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="2" strokeLinecap="round" />
        </g>
        {/* The head, with the two domes of its brow. */}
        <path d="M78 36C76 18 94 8 104 18c8 8 6 26-2 34l-12 8c-8-4-12-12-12-24z" fill={c.skin[0]} />
        <path d="M86 12c4-4 10-4 14 0" fill="none" stroke={c.skin[1]} strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />
        {/* The trunk, raised, curling up at its end, with its folds; and the tusk. */}
        <path d="M98 40C110 48 120 42 120 28C120 22 120 18 118 14" fill="none" stroke={c.skin[0]} strokeWidth="11" strokeLinecap="round" />
        <path d="M118 22C118 18 118 16 117 13" fill="none" stroke={c.skin[0]} strokeWidth="7.5" strokeLinecap="round" />
        <path d="M104 44c4 1 8 0 10-3M113 40c3 1 6 0 7-3M118 32c2 0 4-1 5-3" fill="none" stroke={c.skin[1]} strokeOpacity="0.5" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M96 50C104 56 112 54 114 46" fill="none" stroke={c.ivory} strokeWidth="3.6" strokeLinecap="round" />
        {/* The eye. */}
        <ellipse cx="94" cy="32" rx="2.4" ry="2.8" fill="#2a1b3d" />
        <circle cx="93.3" cy="31" r="0.8" fill="#ffffff" />
        {/* The forehead cloth and its jewel. */}
        <path d="M80 20C86 10 100 10 104 20 100 28 90 30 82 28z" fill={c.cloth} stroke={c.gold} strokeWidth="1.4" />
        <path d="M84 21c6-5 12-5 17 0" fill="none" stroke={c.gold} strokeWidth="1" strokeDasharray="1.6 2.2" />
        <circle cx="92" cy="22" r="3" fill={c.gold} />
        <circle cx="92" cy="22" r="1.2" fill={c.bowl} />
        {/* The saddle cloth: scalloped hem, dotted border, gold dots and tassels, and a golden crown. */}
        <path
          d="M24 28C38 18 62 18 78 28l3 30q-4 6-8 0-4 6-8 0-4 6-8 0-4 6-8 0-4 6-8 0-4 6-8 0-4 6-6 0z"
          fill={c.cloth}
          stroke={c.gold}
          strokeWidth="1.6"
        />
        <path d="M30 38C44 30 62 30 76 38" fill="none" stroke={c.gold} strokeWidth="1.3" strokeDasharray="2 3" />
        <circle cx="38" cy="47" r="2.2" fill={c.gold} />
        <circle cx="50" cy="45" r="2.2" fill={c.gold} />
        <circle cx="62" cy="45" r="2.2" fill={c.gold} />
        <circle cx="73" cy="47" r="2.2" fill={c.gold} />
        <path d="M30 62v6M42 63v6M54 63v6M66 63v6M77 62v6" stroke={c.gold} strokeWidth="1.6" strokeLinecap="round" />
        <path d="M44 20c2-8 14-8 16 0z" fill={c.gold} />
        <circle cx="52" cy="11" r="2" fill={c.gold} />
        {/* The bell necklace. */}
        <path d="M80 44C84 54 90 58 98 56" fill="none" stroke={c.gold} strokeWidth="2" strokeDasharray="1 3.4" strokeLinecap="round" />
      </g>
    </g>
  );
}

export interface ElephantFriezeProps {
  colors?: Partial<ElephantFriezeColors>;
  /** How many elephants stand in the row (it is rounded down to whole pairs). They face each other in pairs, a lamp held up between the two trunks of each pair. */
  count?: number;
  /** Put the width here; the row keeps its shape. */
  className?: string;
}

/**
 * A row of decorated elephants, drawn in SVG, walking on the spot in pairs that
 * face each other with a lit diya held up between their two raised trunks:
 * purple skin with a shaded far ear and far legs, ivory tusks, a pink saddle
 * cloth with a gold scalloped hem, tassels and dotted border under a golden
 * crown, a jewelled forehead cloth, a bell necklace, gold anklets and toenails.
 * Each one strides — legs swinging in diagonal pairs, the body bobbing a little
 * with every step, the ear flapping, the tail swinging — and every flame
 * flickers (`amb-limb`, `amb-bob`, `amb-flicker`; all CSS, so it costs no
 * JavaScript and stops under reduced motion). Meant as a divider between two
 * sections, along a thin gold ground line. Colours are props.
 */
export function ElephantFrieze({ colors, count = 4, className = '' }: ElephantFriezeProps) {
  const c = { ...DEFAULT_COLORS, ...colors };
  const pairs = Math.max(1, Math.floor(count / 2));
  const pairW = 2 * W + MID;
  const width = pairs * pairW + (pairs - 1) * GAP;

  return (
    <svg viewBox={`0 -14 ${width} ${H + 14}`} aria-hidden preserveAspectRatio="xMidYMax meet" className={`block ${className}`}>
      {Array.from({ length: pairs }, (_, p) => {
        const x = p * (pairW + GAP);
        const mid = x + W + MID / 2;
        return (
          <g key={p}>
            <g transform={`translate(${x} 0)`}>
              <Elephant c={c} phase={-p * 0.3} />
            </g>
            <g transform={`translate(${x + pairW} 0) scale(-1 1)`}>
              <Elephant c={c} phase={-0.45 - p * 0.3} />
            </g>
            {/* The lamp they hold between their trunks. */}
            <path d={`M${mid - 9} 8h18c-1 7-5 10-9 10s-8-3-9-10z`} fill={c.bowl} />
            <path d={`M${mid - 9} 8h18`} stroke={c.gold} strokeWidth="2" strokeLinecap="round" />
            <g className="amb-flicker" style={{ transformBox: 'fill-box', transformOrigin: 'center bottom' }}>
              <path d={`M${mid} -6c5 6 5 10 0 14-5-4-5-8 0-14z`} fill={c.flame[0]} />
              <path d={`M${mid} 0c2.5 3 2.5 5 0 7-2.5-2-2.5-4 0-7z`} fill={c.flame[1]} />
            </g>
          </g>
        );
      })}
      {/* The ground they stand on. */}
      <path d={`M0 92H${width}`} stroke={c.gold} strokeWidth="1.3" strokeOpacity="0.75" strokeLinecap="round" />
      <path d={`M0 96H${width}`} stroke={c.gold} strokeWidth="0.7" strokeOpacity="0.4" strokeLinecap="round" strokeDasharray="3 5" />
    </svg>
  );
}

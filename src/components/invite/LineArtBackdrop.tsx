import { useId } from 'react';

const r1 = (n: number) => Math.round(n * 10) / 10;

// A peacock in profile, facing right, in a 120 x 100 box: nine tail feathers
// fanned up and back from the body, each a long teardrop with an eye in it.
const FEATHERS = Array.from({ length: 9 }, (_, k) => {
  const angle = 190 + k * 16;
  return { angle, eye: 41 + (k % 2) * 2 };
});
const FEATHER = 'M16 0C26 -6 44 -9 54 0C44 9 26 6 16 0Z';

function Peacock({ x, y, scale = 1, flip = false }: { x: number; y: number; scale?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale}) ${flip ? 'translate(-120 0)' : ''}`}>
      {FEATHERS.map((f) => (
        <g key={f.angle} transform={`translate(50 74) rotate(${f.angle})`}>
          <path d={FEATHER} />
          <circle cx={f.eye} r="3.6" />
          <circle cx={f.eye} r="1.4" />
        </g>
      ))}
      <ellipse cx="62" cy="82" rx="23" ry="10" />
      <path d="M78 76C86 66 85 54 82 44M84 82C95 70 94 54 89 42" />
      <circle cx="86" cy="37" r="5" />
      <path d="M90 36L98 39L90 42" />
      <path d="M84 32L80 23M86 31V21M88 32L92 23" />
      <circle cx="80" cy="22" r="1.2" />
      <circle cx="86" cy="20" r="1.2" />
      <circle cx="92" cy="22" r="1.2" />
      <path d="M56 92V99M68 92V99M52 99H60M64 99H72" />
    </g>
  );
}

// A hanging brass lantern in a 60 x 140 box: chain, ring, a domed cap over a
// lattice body, a tassel.
function Lantern({ x, y, scale = 1, drop = 0 }: { x: number; y: number; scale?: number; drop?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d={`M30 ${-drop}V22`} />
      <circle cx="30" cy="26" r="4" />
      <path d="M16 46C16 35 24 29 30 29C36 29 44 35 44 46Z" />
      <path d="M16 46L10 86H50L44 46M23 46L20 86M30 46V86M37 46L40 86M14 62H46M12 74H48" />
      <path d="M10 86Q30 96 50 86M30 92V110" />
      <circle cx="30" cy="114" r="4" />
      <path d="M30 118L24 138M30 118V140M30 118L36 138" />
    </g>
  );
}

// A canopy (mandap): a domed roof on two pillars with an arch between and
// drapes at the sides, in a 200 x 92 box.
function Canopy({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <circle cx="100" cy="4" r="2.2" />
      <path d="M100 6V16M70 42C70 26 86 16 100 16C114 16 130 26 130 42M60 42H140M64 47H136" />
      <path d="M68 47V90M132 47V90M68 90C68 64 132 64 132 90M78 90C78 70 122 70 122 90" />
      <path d="M60 42C55 58 60 74 53 90M140 42C145 58 140 74 147 90" />
      <path d="M82 47C82 52 88 52 88 47M94 47C94 52 100 52 100 47M106 47C106 52 112 52 112 47M118 47C118 52 124 52 124 47" />
    </g>
  );
}

// A paisley and a small flower: the tile the rest of the page is spotted with.
const PAISLEY = 'M0 0C-12 -6 -16 -26 -4 -38C8 -48 22 -38 20 -24C18 -10 8 -2 0 0Z';
const PAISLEY_INNER = 'M3 -8C-5 -14 -5 -26 3 -32';
const PETALS = Array.from({ length: 6 }, (_, i) => i * 60);

export interface LineArtBackdropProps {
  /** The line colour. */
  color?: string;
  /** How much of it shows: 0.12 to 0.2 is a faint print on paper. */
  opacity?: number;
  /** The ornaments across the top (lanterns, canopy, peacocks). Turn off for a section that wants only the spotted paper. */
  ornaments?: boolean;
  /** Where, from the top, the spotted paper starts to fade in, in px. */
  fadeFrom?: number;
}

/**
 * A faint line-art print for the paper behind a section: across the top, two
 * hanging lanterns, a canopy and a pair of peacocks facing each other (one
 * mirrored), and below that, spread over the rest, small paisleys and flowers
 * in a repeating tile that fades in under the peacocks. All one colour, all
 * thin strokes, all at a few percent opacity, so it reads as printing on the
 * paper rather than as pictures. Fills its nearest positioned ancestor and
 * ignores the pointer; put the section's content above it.
 */
export function LineArtBackdrop({ color = '#b88624', opacity = 0.17, ornaments = true, fadeFrom = 150 }: LineArtBackdropProps) {
  const id = useId().replace(/:/g, '');
  const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.1, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-[0] overflow-hidden" style={{ color, opacity }}>
      {/* The pattern for the rest of the page, fading in below the top ornaments. */}
      <svg
        className="absolute inset-[0] h-full w-full"
        style={{
          maskImage: `linear-gradient(to bottom, transparent ${fadeFrom}px, #000 ${fadeFrom + 130}px)`,
          WebkitMaskImage: `linear-gradient(to bottom, transparent ${fadeFrom}px, #000 ${fadeFrom + 130}px)`,
        }}
      >
        <defs>
          <pattern id={`${id}-tile`} width="150" height="150" patternUnits="userSpaceOnUse">
            <g {...stroke}>
              <g transform="translate(40 66) rotate(-18)">
                <path d={PAISLEY} />
                <path d={PAISLEY_INNER} />
                <circle cx="10" cy="-28" r="1.6" />
              </g>
              <g transform="translate(116 132) rotate(158) scale(0.8)">
                <path d={PAISLEY} />
                <path d={PAISLEY_INNER} />
                <circle cx="10" cy="-28" r="1.6" />
              </g>
              <g transform="translate(112 30)">
                <circle r="2.4" />
                {PETALS.map((a) => (
                  <ellipse key={a} cx="0" cy="-7" rx="2.8" ry="5.2" transform={`rotate(${a})`} />
                ))}
              </g>
              <g transform="translate(26 128) scale(0.7)">
                <circle r="2.4" />
                {PETALS.map((a) => (
                  <ellipse key={a} cx="0" cy="-7" rx="2.8" ry="5.2" transform={`rotate(${a})`} />
                ))}
              </g>
              <path d="M70 12C78 6 86 8 88 16M64 100C72 94 80 96 82 104" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id}-tile)`} />
      </svg>

      {/* The top ornaments. */}
      {ornaments && (
      <svg viewBox="0 0 375 230" preserveAspectRatio="xMidYMin meet" className="absolute inset-x-[0] top-[0] h-auto w-full">
        <g {...stroke}>
          <Lantern x={18} y={0} scale={0.74} drop={0} />
          <Lantern x={300} y={0} scale={0.6} drop={0} />
          <Canopy x={98} y={22} scale={0.9} />
          <Peacock x={28} y={118} scale={0.92} />
          <Peacock x={247} y={118} scale={0.92} flip />
        </g>
      </svg>
      )}
    </div>
  );
}

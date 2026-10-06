import type { CSSProperties, ReactNode } from 'react';

// Where each sparkle lands, in px from the medallion's centre. Fixed numbers
// rather than computed angles so server and client render identical markup.
const SPARKS = [
  { x: -42, y: -32, size: 11, glyph: '✦' },
  { x: 40, y: -26, size: 9, glyph: '✿' },
  { x: -46, y: 24, size: 9, glyph: '✦' },
  { x: 36, y: 38, size: 11, glyph: '✦' },
  { x: 4, y: -52, size: 8, glyph: '✿' },
];

const tint = (color: string, percent: number) => `color-mix(in srgb, ${color} ${percent}%, transparent)`;

export interface MedallionProps {
  /** Colour of the rings, the sparkles and the core's outline. */
  accent: string;
  /** What sits in the core: an emoji, an icon, an <Image>. Sized for a 58px circle. */
  children: ReactNode;
  /** Offsets the sparkles' timing, so a column of medallions doesn't pulse in
   * step. Pass the item's index. */
  phase?: number;
}

/**
 * A round badge for any icon or artwork: two dashed rings turning in opposite
 * directions, and sparkles that slip out from under the core, drift outward
 * and pop. All of it is CSS (.amb-ring and .amb-spark in motion.css), so it
 * costs no JavaScript and stops under reduced motion (the sparkles then rest
 * where they would have landed).
 *
 * It is 100px tall and as wide as its parent; the rings are 100px and 80px.
 * The core's fill is --surface-raised, so a page on a fixed palette should pin
 * that variable. To change the look rather than the content: the rings' pace is
 * --ring-dur and the sparkles' is --spark-dur (see motion.css).
 */
export function Medallion({ accent, children, phase = 0 }: MedallionProps) {
  return (
    <div aria-hidden className="relative flex h-[100px] items-center justify-center">
      {/* Counter-rotating dashed rings: outer clockwise, inner back. */}
      <span
        className="amb-ring absolute h-[100px] w-[100px] rounded-pill border border-dashed"
        style={{ borderColor: tint(accent, 40), '--ring-dur': '26s' } as CSSProperties}
      />
      <span
        className="amb-ring amb-ring--rev absolute h-[80px] w-[80px] rounded-pill border border-dashed"
        style={{ borderColor: tint(accent, 55), '--ring-dur': '18s' } as CSSProperties}
      />

      {/* Sparkles come out from under the core, drift outward and pop. Before the
          core in the DOM so it covers where they start. */}
      {SPARKS.map((s, j) => (
        <span
          key={j}
          className="amb-spark absolute inset-[0] flex items-center justify-center leading-none"
          style={
            {
              color: accent,
              fontSize: s.size,
              '--sx': `${s.x}px`,
              '--sy': `${s.y}px`,
              '--spark-delay': `${-(j * 0.64 + phase * 0.9).toFixed(2)}s`,
            } as CSSProperties
          }
        >
          {s.glyph}
        </span>
      ))}

      <span
        className="relative flex h-[58px] w-[58px] items-center justify-center rounded-pill border bg-surface-raised text-[26px] leading-none shadow-md"
        style={{ borderColor: tint(accent, 45) }}
      >
        {children}
      </span>
    </div>
  );
}

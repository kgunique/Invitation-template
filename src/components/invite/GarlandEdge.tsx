export interface GarlandEdgeProps {
  /** Which edge of the box the strip hangs along. Both: pass `side="both"`. */
  side?: 'left' | 'right' | 'both';
  /** How wide each strip is, px. */
  width?: number;
  /** The strip fades in over this many px at its top (a garland that begins where the night ends). */
  fadeIn?: number;
  /** Start this far down the box, px. */
  top?: number;
}

const TILE = '/art/ganga/garland-tile.webp';

/**
 * A garland of marigolds along the edge of the page: one seamless strip (a tile of two flowers' pattern, orange and
 * yellow in turn) repeated the whole height of the box, with a soft shadow on the paper. `side="both"` makes the
 * pair that frame a long page. It fills the nearest positioned ancestor's height and ignores the pointer.
 */
export function GarlandEdge({ side = 'both', width = 24, fadeIn = 0, top = 0 }: GarlandEdgeProps) {
  const fade = fadeIn > 0 ? `linear-gradient(to bottom, transparent, #000 ${fadeIn}px)` : undefined;
  const strip = (pos: 'left' | 'right') => (
    <span
      aria-hidden
      className="pointer-events-none absolute bottom-[0] block"
      style={{
        [pos]: 0,
        top,
        width,
        backgroundImage: `url(${TILE})`,
        backgroundSize: `${width}px auto`,
        backgroundRepeat: 'repeat-y',
        filter: 'drop-shadow(1px 2px 2px rgba(70,35,5,0.4))',
        maskImage: fade,
        WebkitMaskImage: fade,
      }}
    />
  );
  return (
    <>
      {side !== 'right' && strip('left')}
      {side !== 'left' && strip('right')}
    </>
  );
}

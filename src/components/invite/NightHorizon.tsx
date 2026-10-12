export interface NightHorizonColors {
  /** The warm light low on the sky, brightest right on the horizon: any CSS colour. */
  glow: string;
  /** The ridges, from the farthest (palest) to the nearest (darkest). */
  far: string;
  mid: string;
  near: string;
}

const DEFAULT_COLORS: NightHorizonColors = {
  glow: 'rgba(240, 150, 92, 0.9)',
  far: '#1c2750',
  mid: '#0d1632',
  near: '#040813',
};

const W = 400;
const r1 = (n: number) => Math.round(n * 10) / 10;

/** A ridge line across the box: peaks from a few sines (rounded to a tenth, so server and browser print the same path). */
function ridge(seed: number, base: number, amp: number) {
  const pts: string[] = [];
  for (let x = 0; x <= W; x += 8) {
    const a = Math.abs(Math.sin(x * 0.021 + seed)) ** 0.7;
    const b = Math.abs(Math.sin(x * 0.053 + seed * 2.3)) ** 0.9;
    const c = Math.sin(x * 0.131 + seed * 3.7);
    const y = base - amp * (0.62 * a + 0.28 * b + 0.1 * c);
    pts.push(`${x} ${r1(y)}`);
  }
  return `M0 150L${pts.join('L')}L${W} 150Z`;
}

const FAR = ridge(1.3, 112, 56);
const MID = ridge(4.1, 128, 44);
const NEAR = ridge(7.7, 146, 30);

/**
 * A strip of mountains against a low glow, for the foot of a night scene: the warm light of the horizon
 * (a gradient that is brightest at the bottom and fades up into the sky) behind three ridges, each darker
 * than the one behind it. Absolutely placed along the bottom of the nearest positioned ancestor, full width,
 * and ignores the pointer; give it the height on `className` ("h-[22%]"). Colours are props.
 */
export function NightHorizon({ colors, className = '' }: { colors?: Partial<NightHorizonColors>; className?: string }) {
  const c = { ...DEFAULT_COLORS, ...colors };
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-x-[0] bottom-[0] ${className}`}>
      {/* The glow reaches higher than the ridges, so the sky above them warms. */}
      <span
        className="absolute inset-x-[0] bottom-[0] h-[170%]"
        style={{ background: `radial-gradient(ellipse 100% 78% at 50% 100%, ${c.glow}, transparent 72%)` }}
      />
      <svg viewBox="0 0 400 150" preserveAspectRatio="none" className="absolute inset-[0] h-full w-full">
        <path d={FAR} fill={c.far} />
        <path d={MID} fill={c.mid} />
        <path d={NEAR} fill={c.near} />
      </svg>
    </div>
  );
}

/**
 * Fine warm film grain as a CSS background layer (a tile of SVG noise turned
 * brown, its strength baked in as `opacity`). Use it as one layer of any
 * background — `background: ${grainBackground(0.2)}, #e6d0a0` — where an overlay
 * element can't reach, such as a clipped shape like `TornEdge`.
 */
export function grainBackground(opacity: number) {
  const alpha = (0.9 * opacity).toFixed(3);
  const svg =
    "<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n' x='0' y='0' width='100%' height='100%'>" +
    "<feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/>" +
    `<feColorMatrix values='0 0 0 0 0.36  0 0 0 0 0.26  0 0 0 0 0.12  0 0 0 ${alpha} 0'/></filter>` +
    "<rect width='100%' height='100%' filter='url(#n)'/></svg>";
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 0 0 / 180px 180px`;
}

/**
 * A veil of fine paper grain over whatever it fills (the nearest positioned
 * ancestor), so a flat gradient reads as paper or a painted wall instead of a
 * screen. It ignores the pointer. `opacity` is how much you see of it; 0.15 to
 * 0.3 is a whisper that still takes the flatness off.
 */
export function Grain({ opacity = 0.22 }: { opacity?: number }) {
  return <div aria-hidden className="pointer-events-none absolute inset-[0]" style={{ background: grainBackground(opacity) }} />;
}

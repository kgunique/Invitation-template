import { useId } from 'react';

const r1 = (n: number) => Math.round(n * 10) / 10;
const H = 150; // the ground line, in the drawing's own units (it is 400 wide and H + 6 tall)

/** A rectangle as a path, so a whole skyline layer can be one `d`. */
const box = (x: number, y: number, w: number, h: number) => `M${r1(x)} ${r1(y)}h${r1(w)}v${r1(h)}h${r1(-w)}z`;
/** A niche or window: a rectangle with a round top, standing on y = bottom. */
const arch = (cx: number, bottom: number, w: number, h: number) =>
  `M${r1(cx - w / 2)} ${r1(bottom)}V${r1(bottom - h + w / 2)}a${r1(w / 2)} ${r1(w / 2)} 0 0 1 ${r1(w)} 0V${r1(bottom)}z`;
/** A small dome standing on y. */
const bump = (cx: number, y: number, r: number) => `M${r1(cx - r)} ${r1(y)}a${r1(r)} ${r1(r)} 0 0 1 ${r1(2 * r)} 0z`;
const ball = (cx: number, cy: number, r: number) =>
  `M${r1(cx - r)} ${r1(cy)}a${r} ${r} 0 1 1 ${r1(2 * r)} 0a${r} ${r} 0 1 1 ${r1(-2 * r)} 0z`;
/** A kalasam: the pot-and-spire finial. */
const kalasam = (x: number, y: number, s = 1) =>
  `${box(x - 0.6 * s, y - 5 * s, 1.2 * s, 5 * s)}${ball(x, y - 6 * s, 1.9 * s)}${ball(x, y - 9 * s, 0.9 * s)}`;
const flag = (x: number, y: number, h: number) => `${box(x - 0.5, y - h, 1, h)}M${r1(x + 0.5)} ${r1(y - h)}l7 2.4-7 2.4z`;

interface Parts {
  /** The silhouette. */
  solid: string;
  /** What is carved into it (doorways, windows, niches, ridges): drawn over it in a paler or deeper tone. */
  cut?: string;
}

const join = (parts: Parts[]) =>
  parts.reduce((a, p) => ({ solid: a.solid + p.solid, cut: a.cut + (p.cut ?? '') }), { solid: '', cut: '' });

/**
 * A gopuram, the tiered gateway tower of a South Indian temple: a plinth with
 * a doorway between two pilasters, then tiers each with a body, niches, a
 * cornice with a row of little kudu arches and a finial at each end, every
 * tier a little narrower, and on top a barrel roof with a ridge, three kalasams
 * and (if `flagged`) a flag.
 */
function gopuram(cx: number, baseW: number, height: number, tiers: number, { flagged = true, niches = true } = {}): Parts {
  let solid = '';
  let cut = '';
  const plinthH = height * 0.13;
  solid += box(cx - baseW * 0.56, H - plinthH, baseW * 1.12, plinthH);
  solid += box(cx - baseW * 0.6, H - plinthH - 2, baseW * 1.2, 2.4);
  cut += arch(cx, H, baseW * 0.2, plinthH * 0.82);
  for (const s of [-1, 1]) cut += box(cx + s * baseW * 0.3 - 1, H - plinthH * 0.7, 2, plinthH * 0.55);

  let y = H - plinthH - 2;
  let w = baseW;
  const th = (height * 0.7) / tiers;
  for (let i = 0; i < tiers; i++) {
    const bodyH = th * 0.7;
    solid += box(cx - w * 0.44, y - bodyH, w * 0.88, bodyH);
    const cy = y - bodyH;
    solid += box(cx - w / 2, cy - th * 0.16, w, th * 0.16);
    solid += box(cx - w * 0.47, cy - th * 0.16 - 1, w * 0.94, 1.1);
    const n = Math.max(2, Math.round(w / 12));
    for (let k = 0; k < n; k++) solid += bump(cx - w / 2 + (w * (k + 0.5)) / n, cy - th * 0.16, Math.min(3.2, w / n / 2.4));
    for (const s of [-1, 1]) {
      solid += `M${r1(cx + s * (w / 2 - 1.2))} ${r1(cy - th * 0.16)}l${r1(s * 1.6)} ${r1(-th * 0.2)} ${r1(s * 1.6)} ${r1(th * 0.2)}z`;
    }
    if (niches) {
      const count = w > 44 ? 5 : w > 30 ? 3 : 1;
      for (let k = 0; k < count; k++) {
        const nx = cx + (k - (count - 1) / 2) * ((w * 0.8) / Math.max(count, 2));
        cut += arch(nx, cy - bodyH * 0.14, Math.min(5, w * 0.1), bodyH * 0.62);
      }
    }
    y = cy - th * 0.16 - 1;
    w *= 0.86;
  }

  const rx = (w / 2) * 1.08;
  const ry = height * 0.1;
  solid += `M${r1(cx - rx)} ${r1(y)}A${r1(rx)} ${r1(ry)} 0 0 1 ${r1(cx + rx)} ${r1(y)}z`;
  cut += `M${r1(cx - rx * 0.6)} ${r1(y - ry * 0.55)}Q${r1(cx)} ${r1(y - ry * 0.95)} ${r1(cx + rx * 0.6)} ${r1(y - ry * 0.55)}`;
  const top = y - ry;
  solid += kalasam(cx - rx * 0.62, y - ry * 0.55, 0.8) + kalasam(cx, top, 1) + kalasam(cx + rx * 0.62, y - ry * 0.55, 0.8);
  if (flagged) solid += flag(cx, top - 10, 11);
  return { solid, cut };
}

/** A vimana, the shrine tower: three steps with niches, a ribbed dome and a kalasha on a spire. */
function vimana(cx: number, baseW: number, height: number): Parts {
  let solid = '';
  let cut = '';
  const steps = 3;
  const sh = (height * 0.5) / steps;
  let w = baseW;
  let y = H;
  for (let i = 0; i < steps; i++) {
    solid += box(cx - w / 2, y - sh, w, sh);
    solid += box(cx - w / 2 - 1.2, y - sh - 1.2, w + 2.4, 1.4);
    if (i === 0) cut += arch(cx, H, w * 0.2, sh * 0.8);
    else for (const s of [-1, 1]) cut += arch(cx + s * w * 0.25, y, 3.6, sh * 0.6);
    y -= sh + 1;
    w *= 0.78;
  }
  const r = w * 0.64;
  solid += `M${r1(cx - r)} ${r1(y)}a${r1(r)} ${r1(r * 1.15)} 0 0 1 ${r1(2 * r)} 0z`;
  for (const k of [-0.5, 0, 0.5]) {
    cut += `M${r1(cx + k * r)} ${r1(y)}Q${r1(cx + k * r * 0.9)} ${r1(y - r * 0.8)} ${r1(cx)} ${r1(y - r * 1.12)}`;
  }
  solid += `M${r1(cx - 2.6)} ${r1(y - r * 1.1)}l2.6 ${r1(-height * 0.16)} 2.6 ${r1(height * 0.16)}z${kalasam(cx, y - r * 1.1 - height * 0.16, 1)}`;
  return { solid, cut };
}

/** A pillared hall: roof slabs with kudu arches and kalasams, and a row of pillars with caps and bases, brackets between. */
function mandapam(x: number, w: number, height: number, pillars: number): Parts {
  let solid = '';
  const slab = height * 0.3;
  solid += box(x, H - height, w, slab * 0.5);
  solid += box(x + w * 0.02, H - height + slab * 0.5, w * 0.96, slab * 0.34);
  solid += box(x - 1, H - height - 1.4, w + 2, 1.6);
  const n = Math.round(w / 9);
  for (let k = 0; k < n; k++) solid += bump(x + (w * (k + 0.5)) / n, H - height - 1.4, 2.6);
  for (const s of [0, 1]) solid += kalasam(x + (s ? w - 5 : 5), H - height - 1.4, 0.9);
  const gap = w / pillars;
  for (let i = 0; i <= pillars; i++) {
    const px = x + i * gap;
    const pw = 4;
    const left = Math.min(Math.max(px - pw / 2, x), x + w - pw);
    solid += box(left, H - height + slab, pw, height - slab);
    solid += box(left - 1.2, H - height + slab, pw + 2.4, 2);
    solid += box(left - 1.2, H - 2.6, pw + 2.4, 2.6);
    if (i < pillars) solid += `M${r1(px + 2)} ${r1(H - height + slab)}q${r1(gap / 2 - 2)} ${r1(slab * 0.6)} ${r1(gap - 4)} 0z`;
  }
  return { solid };
}

/** A compound wall: kudu arches along its top and arched niches in it. */
function wall(x: number, w: number, hh: number): Parts {
  let solid = box(x, H - hh, w, hh) + box(x - 1, H - hh - 1.6, w + 2, 1.8);
  let cut = '';
  const n = Math.round(w / 14);
  for (let k = 0; k < n; k++) {
    solid += bump(x + (w * (k + 0.5)) / n, H - hh - 1.6, 2.4);
    cut += arch(x + (w * (k + 0.5)) / n, H - 1, 5, hh * 0.7);
  }
  return { solid, cut };
}

/** A coconut palm: a leaning trunk and six fronds. */
function palm(x: number, h: number, lean: number): Parts {
  let d = `M${x - 1.6} ${H}Q${r1(x + lean * 0.5)} ${r1(H - h * 0.5)} ${r1(x + lean)} ${r1(H - h)}L${r1(x + lean + 1.6)} ${r1(H - h)}Q${r1(x + lean * 0.5 + 3)} ${r1(H - h * 0.5)} ${r1(x + 1.6)} ${H}z`;
  const tx = x + lean + 0.8;
  const ty = H - h;
  for (const a of [-170, -140, -110, -70, -40, -10]) {
    const rad = (a * Math.PI) / 180;
    const ex = tx + Math.cos(rad) * 16;
    const ey = ty + Math.sin(rad) * 9 + 6;
    d += `M${r1(tx)} ${r1(ty)}Q${r1(tx + Math.cos(rad) * 9)} ${r1(ty + Math.sin(rad) * 13 - 3)} ${r1(ex)} ${r1(ey)}Q${r1(tx + Math.cos(rad) * 9)} ${r1(ty + Math.sin(rad) * 13 + 1)} ${r1(tx)} ${r1(ty + 1.6)}z`;
  }
  return { solid: d };
}

// Three layers, back to front, each one `solid` path and one `cut` path.
const FAR = join([
  gopuram(44, 52, 112, 6, { niches: false }),
  gopuram(112, 34, 70, 4, { niches: false, flagged: false }),
  vimana(176, 50, 90),
  gopuram(246, 40, 82, 5, { niches: false }),
  gopuram(316, 46, 104, 6, { niches: false }),
  gopuram(382, 34, 72, 4, { niches: false, flagged: false }),
  palm(150, 52, 5),
  palm(214, 44, -6),
  palm(284, 48, 4),
]);
const MID = join([
  gopuram(78, 46, 92, 5),
  vimana(142, 38, 66),
  gopuram(214, 52, 98, 6),
  gopuram(268, 34, 66, 4, { flagged: false }),
  vimana(340, 42, 76),
]);
const NEAR = join([
  mandapam(0, 112, 44, 5),
  vimana(150, 34, 56),
  wall(168, 70, 16),
  gopuram(238, 40, 70, 4, { flagged: false }),
  wall(262, 24, 16),
  gopuram(346, 94, 128, 7),
  wall(300, 100, 12),
]);

export interface TempleSkylineColors {
  /** The towers farthest away: the palest. */
  far: string;
  /** The middle towers. */
  mid: string;
  /** The towers in front, and the ground they stand on: the deepest. */
  near: string;
}

const DEFAULT_COLORS: TempleSkylineColors = { far: '#f4c866', mid: '#e8a63c', near: '#c3801f' };

const lighter = (c: string, percent: number) => `color-mix(in srgb, ${c} ${percent}%, #fff6dc)`;

export interface TempleSkylineProps {
  colors?: Partial<TempleSkylineColors>;
  /** Put the width here; it keeps its shape and is 400 : 156. */
  className?: string;
}

/**
 * A skyline of South Indian temples in three layers of gold, drawn in SVG:
 * far away, pale gopurams, a ribbed-domed vimana and coconut palms; in the
 * middle, gopurams and vimanas carved with rows of niches; in front, a pillared
 * mandapam, compound walls with arched niches, a small shrine, and a tall
 * seven-tier gopuram. Every tower has its plinth and doorway, tiers with
 * cornices, little kudu arches and end finials, a barrel roof with three
 * kalasams and (the tall ones) a flag; each layer is paler at its top than at
 * its foot, and the carved niches show in a lighter or deeper tone, so it reads
 * as relief and not as a flat cut-out. Meant to run along the foot of a section,
 * full width, over a ground band of the `near` colour. Colours are props.
 */
export function TempleSkyline({ colors, className = '' }: TempleSkylineProps) {
  const c = { ...DEFAULT_COLORS, ...colors };
  const id = useId().replace(/:/g, '');
  const gradient = (key: string, base: string) => (
    <linearGradient id={`${id}-${key}`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={lighter(base, 70)} />
      <stop offset="1" stopColor={base} />
    </linearGradient>
  );

  return (
    <svg viewBox={`0 0 400 ${H + 6}`} aria-hidden preserveAspectRatio="xMidYMax meet" className={`block ${className}`}>
      <defs>
        {gradient('f', c.far)}
        {gradient('m', c.mid)}
        {gradient('n', c.near)}
      </defs>
      <path d={FAR.solid} fill={`url(#${id}-f)`} />
      <path d={MID.solid} fill={`url(#${id}-m)`} />
      <path d={MID.cut} fill={c.near} fillOpacity="0.4" />
      <path d={NEAR.solid} fill={`url(#${id}-n)`} />
      <path d={NEAR.cut} fill={lighter(c.near, 45)} fillOpacity="0.9" />
      {/* The ground, with a bright lip along its edge. */}
      <path d={`M0 ${H - 5}H400V${H + 6}H0z`} fill={c.near} />
      <path d={`M0 ${H - 4.5}H400`} stroke={lighter(c.near, 55)} strokeWidth="1" />
    </svg>
  );
}

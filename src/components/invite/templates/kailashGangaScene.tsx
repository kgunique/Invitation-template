import type { CSSProperties } from 'react';
import Image from 'next/image';
import { Starfield } from '../Starfield';

/**
 * The artwork of the Kailash–Ganga template's second scene: the night sky, the moon (where the slider's moon lands),
 * Kailash, and the clouds that circle it. Every picture is in public/art/ganga/, made from the stock pictures in
 * public/art/platinum/Ganga Theme/ (see ai-doc/rule.md). To dress the scene differently, change this file.
 */
const R = '/art/ganga/';

/** The colour the night ends on at the foot of the scene, which the sections below begin on. */
export const NIGHT_FOOT = '#060b19';

/** One cloud's orbit: its sprite, its width (a share of the scene's), where its loop is centred (shares of the scene), how wide and how tall the loop is (shares of the scene's width), one lap in seconds and how far round it starts (0..1). */
interface Orbit {
  sprite: 'cloud-a' | 'cloud-b';
  w: number;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  dur: number;
  phase: number;
  flip?: boolean;
}

// Two rings of cloud round Kailash's shoulders: a high, wide one that passes behind the peak and a low one that sweeps across its foot.
const ORBITS: Orbit[] = [
  { sprite: 'cloud-a', w: 0.6, cx: 0.5, cy: 0.56, rx: 0.62, ry: 0.06, dur: 96, phase: 0.0 },
  { sprite: 'cloud-b', w: 0.48, cx: 0.5, cy: 0.56, rx: 0.62, ry: 0.06, dur: 96, phase: 0.34, flip: true },
  { sprite: 'cloud-a', w: 0.54, cx: 0.5, cy: 0.56, rx: 0.62, ry: 0.06, dur: 96, phase: 0.67 },
  { sprite: 'cloud-b', w: 0.7, cx: 0.5, cy: 0.74, rx: 0.5, ry: 0.05, dur: 74, phase: 0.12 },
  { sprite: 'cloud-a', w: 0.62, cx: 0.5, cy: 0.74, rx: 0.5, ry: 0.05, dur: 74, phase: 0.55, flip: true },
  { sprite: 'cloud-b', w: 0.66, cx: 0.5, cy: 0.79, rx: 0.56, ry: 0.04, dur: 110, phase: 0.85 },
];

const SIZES: Record<Orbit['sprite'], [number, number]> = { 'cloud-a': [900, 526], 'cloud-b': [900, 351] };

/** The place the slider's moon flies to: right over Kailash's peak. */
export const MOON_TARGET = '[data-moon-target]';

/**
 * The night behind the scene: the Milky Way, a few twinkling stars, and a haze of moonlight round the moon.
 */
export function KailashSky() {
  return (
    <>
      <Image src={`${R}stars.webp`} alt="" fill priority sizes="(min-width: 480px) 480px, 100vw" className="object-cover" style={{ opacity: 0.9 }} />
      <span aria-hidden className="absolute inset-[0]" style={{ background: `linear-gradient(to bottom, rgba(4,8,22,0.1) 0%, rgba(4,8,22,0.25) 45%, ${NIGHT_FOOT} 100%)` }} />
      <Starfield color="#f7ecd2" count={44} constellations={false} />
    </>
  );
}

/**
 * The moon, in the place the slider's moon lands (found by `MOON_TARGET`). Hidden until it has landed; then a
 * halo of light rises round it and breathes, and the moon itself begins to turn slowly about its centre (160 s a lap). Positioned by the caller's `className` (a size and a place).
 */
export function LandedMoon({ landed, className }: { landed: boolean; className: string }) {
  return (
    <div className={`absolute z-[4] ${className}`}>
      <span
        aria-hidden
        className="amb-breathe absolute left-[50%] top-[50%] h-[300%] w-[300%] -translate-x-1/2 -translate-y-1/2 rounded-pill transition-opacity duration-1000"
        style={{ opacity: landed ? 1 : 0, background: 'radial-gradient(closest-side, rgba(223,233,255,0.5), rgba(120,150,255,0.14) 55%, transparent)', ['--breathe-dur' as string]: '5s' }}
      />
      <span
        data-moon-target
        className="absolute inset-[0] block overflow-hidden rounded-pill shadow-[0_0_34px_rgba(232,240,255,0.55)] transition-opacity duration-200"
        style={{ opacity: landed ? 1 : 0 }}
      >
        <Image src={`${R}moon.webp`} alt="The moon" fill sizes="96px" className={`object-cover ${landed ? 'amb-turn-slow' : ''}`} />
      </span>
    </div>
  );
}

/**
 * Kailash, in moonlight (the snowy face of the owner's photograph, cut from its sky and graded to night), standing
 * in the middle of the scene with a pair of cloud rings turning round it: the high ring passes behind the peak, the
 * low one sweeps across its foot (`amb-orbit`, CSS only; it stops under reduced motion and leaves the clouds
 * where they are). The mountain is at z-index 2, the clouds behind it at 1 and those in front at 3.
 */
export function KailashMountain() {
  return (
    <div className="absolute inset-[0]" style={{ ['--stage' as string]: 'min(100vw, 480px)' } as CSSProperties}>
      {/* Mist behind the mountain, so it does not stand cut-out against the stars. */}
      <span
        aria-hidden
        className="absolute inset-x-[0] bottom-[16%] h-[34%]"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 70%, rgba(110,140,220,0.3), transparent 70%)' }}
      />
      <Image
        src={`${R}kailash-night.webp`}
        alt="Mount Kailash by moonlight"
        width={1100}
        height={729}
        priority
        sizes="(min-width: 480px) 720px, 150vw"
        className="absolute bottom-[8%] left-[-20.5%] z-[2] h-auto w-[150%] max-w-none"
        // its foot is a shade off the night below it: let it dissolve into it rather than end in a line
        style={{ maskImage: 'linear-gradient(to bottom, #000 82%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, #000 82%, transparent)' }}
      />
      {ORBITS.map((o, i) => {
        const [w, h] = SIZES[o.sprite];
        return (
          <span
            key={i}
            aria-hidden
            className="amb-orbit pointer-events-none absolute block"
            style={
              {
                left: `${(o.cx - o.w / 2) * 100}%`,
                top: `${o.cy * 100}%`,
                // centred on its loop's centre: half its own height up (its height is its width times the sprite's shape)
                marginTop: `calc(var(--stage) * ${-(o.w * (h / w)) / 2})`,
                width: `${o.w * 100}%`,
                aspectRatio: `${w} / ${h}`,
                '--orb-rx': `calc(var(--stage) * ${o.rx})`,
                '--orb-ry': `calc(var(--stage) * ${o.ry})`,
                '--orb-dur': `${o.dur}s`,
                '--orb-delay': `${-o.dur * o.phase}s`,
              } as CSSProperties
            }
          >
            <Image src={`${R}${o.sprite}.webp`} alt="" fill sizes="480px" className={`object-contain ${o.flip ? '-scale-x-100' : ''}`} />
          </span>
        );
      })}
    </div>
  );
}

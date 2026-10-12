'use client';

import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { buildRiver, maskUrl, type River, type RiverPoint } from './river';
import { Jasmine, LilyPad, Lotus, Marigold, Petal } from './FloatingFlora';
import { Diya } from './Diya';

export type FloaterKind = 'lotus' | 'pad' | 'marigold' | 'jasmine' | 'petal' | 'diya';

export interface Floater {
  kind: FloaterKind;
  /** Its width, px. */
  size: number;
  /** Which part of the river's width it travels in: -1 the left bank, 0 the middle, 1 the right bank. */
  lane: number;
  /** How fast it is carried, px a second. */
  speed: number;
  /** How far along its journey it has got at the start (0..1), so the river is already full of flowers. */
  phase: number;
  /** How far it turns over a whole journey, degrees. */
  spin?: number;
  /** A colour, for the kinds that take one (a petal). */
  color?: string;
}

export interface GangaRiverProps {
  /** The waypoints the river runs through (see `river.ts`). */
  points: RiverPoint[];
  /** The box's height, px: at least as far down as the last waypoint. */
  height: number;
  /** What floats on it. */
  floaters?: Floater[];
  /** The first this-many px of the box fade in (a river that rises out of something above it, not off a line). */
  fadeStart?: number;
  /** The last this-many px of the box fade away (a river that goes on in the next part of the page). */
  fadeEnd?: number;
  /** Touch the water and a lit lamp is set afloat from that spot, to drift downstream. */
  releasable?: boolean;
  /** A line of words floated over the water at `hintAt` px down (it goes with the first lamp): what to do with it. */
  hint?: string;
  hintAt?: number;
  /** The faces for the hint (see `hindiFonts.ts` for Hindi). */
  hintClassName?: string;
  className?: string;
}

interface Lamp {
  id: number;
  /** Where it was set down: the distance down, and how far across the water it was from the middle (a share of the width). */
  y: number;
  dx: number;
}

/** A lamp set afloat: it drops in, steadies, and goes downstream on the river's own bends for a while, then fades. */
function ReleasedLamp({ lamp, river, yEnd, onDone }: { lamp: Lamp; river: River; yEnd: number; onDone: () => void }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const run = Math.min(yEnd, lamp.y + 1000);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof el.animate !== 'function') {
      el.style.transform = `translate(${(river.centre(lamp.y) + lamp.dx) * 100}cqw, ${lamp.y}px)`;
      const t = setTimeout(onDone, 5000);
      return () => clearTimeout(t);
    }
    const steps = Math.max(8, Math.round((run - lamp.y) / 30));
    const frames: Keyframe[] = [];
    for (let j = 0; j <= steps; j++) {
      const t = j / steps;
      const y = lamp.y + (run - lamp.y) * t;
      // it settles towards the middle of the stream as it goes
      const x = river.centre(y) + lamp.dx * Math.exp(-3.5 * t) + river.width(y) * 0.05 * Math.sin(y * 0.02);
      const scale = t < 0.05 ? 0.3 + 0.7 * (t / 0.05) : 1;
      const opacity = t > 0.88 ? (1 - t) / 0.12 : 1;
      frames.push({ transform: `translate(${(x * 100).toFixed(2)}cqw, ${y.toFixed(1)}px) scale(${scale.toFixed(2)})`, opacity, offset: t });
    }
    const a = el.animate(frames, { duration: ((run - lamp.y) / 30) * 1000, easing: 'linear', fill: 'forwards' });
    a.onfinish = onDone;
    return () => a.cancel();
  }, [lamp, river, yEnd, onDone]);

  return (
    <span ref={ref} className="absolute left-[0] top-[0] block opacity-0" style={{ width: 46, height: 46, marginLeft: -23, marginTop: -23, willChange: 'transform' }}>
      <span aria-hidden className="amb-breathe absolute inset-[-45%] rounded-pill" style={{ background: 'radial-gradient(closest-side, rgba(255,200,100,0.6), rgba(255,170,60,0.18) 60%, transparent)', ['--breathe-dur' as string]: '2.2s' }} />
      <span className="amb-bob block h-full w-full" style={{ ['--bob-dur' as string]: '2.6s', ['--bob-y' as string]: '-2px' }}>
        <Diya className="block h-full w-full" />
      </span>
    </span>
  );
}

const R = '/art/ganga/';
const BODY_TILE = 520; // px one lap of the water texture takes the water through
const GLINT_TILE = 640;

function Flora({ f }: { f: Floater }) {
  const cls = 'block h-full w-full';
  switch (f.kind) {
    case 'lotus':
      return <Lotus className={cls} />;
    case 'pad':
      return <LilyPad className={cls} />;
    case 'marigold':
      return <Marigold className={cls} />;
    case 'jasmine':
      return <Jasmine className={cls} />;
    case 'petal':
      return <Petal className={cls} color={f.color} />;
    case 'diya':
      return <Diya className={cls} />;
  }
}

/**
 * A river that runs down a column of the page: stone banks (wet pebbles, a pale foam line where the water meets them), the
 * water itself (a deep teal body with caustic light and, above it, streaks and glints, each a seamless texture sliding
 * downstream at its own pace so the surface seems to flow, and a soft darkening where it deepens at the edges) and
 * whatever floats on it — lotuses, lily pads, marigolds, jasmine, petals, lamps — each carried along the river's own
 * bends at its own speed, turning slowly, drifting a little from side to side.
 *
 * The shape comes from waypoints (`points`: how far down, how far across, how wide), so the river can wander from the
 * middle of the page to an edge and back, widening as it goes. It is drawn through masks that stretch with the column,
 * so it fits any width; the moving textures are compositor animations (CSS), the flowers are Web Animations on
 * transforms — nothing runs on the main thread each frame, and under reduced motion everything stands still.
 */
export function GangaRiver({ points, height, floaters = [], fadeStart = 0, fadeEnd = 0, releasable = false, hint, hintAt = 560, hintClassName = '', className = '' }: GangaRiverProps) {
  const river = useMemo(() => buildRiver(points, height), [points, height]);
  const water = useMemo(() => maskUrl(river.water, height), [river, height]);
  const bank = useMemo(() => maskUrl(river.bank, height), [river, height]);
  const refs = useRef<(HTMLSpanElement | null)[]>([]);
  const [lamps, setLamps] = useState<Lamp[]>([]);
  const nextLamp = useRef(0);
  const yFirst = points[0].y;
  const yLast = points[points.length - 1].y;

  // a touch on the water sets a lamp afloat there
  const release = (e: MouseEvent<HTMLDivElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - box.top;
    const x = (e.clientX - box.left) / box.width;
    if (y < yFirst + 90 || y > yLast - fadeEnd - 40) return;
    const dx = x - river.centre(y);
    if (Math.abs(dx) > (river.width(y) / 2) * 0.92) return;
    setLamps((all) => [...all.slice(-6), { id: nextLamp.current++, y, dx }]);
  };
  const lampDone = (id: number) => setLamps((all) => all.filter((l) => l.id !== id));

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // standing still: put each flower where it would be at the start of its journey
      floaters.forEach((f, i) => {
        const el = refs.current[i];
        if (!el) return;
        const y = points[0].y + (points[points.length - 1].y - points[0].y) * (0.12 + 0.76 * ((f.phase * 7.13) % 1));
        el.style.transform = `translate(${(river.centre(y) + f.lane * river.width(y) * 0.34) * 100}cqw, ${y}px)`;
        el.style.opacity = '1';
      });
      return;
    }
    const animations: Animation[] = [];
    // the flowers begin where the river is wide enough to carry them
    let yStart = points[0].y;
    while (yStart < points[points.length - 1].y && river.width(yStart) < 0.075) yStart += 10;
    const yEnd = points[points.length - 1].y - fadeEnd * 0.4;
    floaters.forEach((f, i) => {
      const el = refs.current[i];
      if (!el || typeof el.animate !== 'function') return;
      const steps = Math.max(8, Math.round((yEnd - yStart) / 36));
      const frames: Keyframe[] = [];
      for (let j = 0; j <= steps; j++) {
        const t = j / steps;
        const y = yStart + (yEnd - yStart) * t;
        // the water carries it, and a slow sway takes it a little either side
        const x = river.centre(y) + f.lane * river.width(y) * 0.34 + river.width(y) * 0.07 * Math.sin(y * 0.021 + i * 1.9);
        const rot = (f.spin ?? 90) * t + 14 * Math.sin(y * 0.03 + i);
        const opacity = t < 0.04 ? t / 0.04 : t > 0.94 ? (1 - t) / 0.06 : 1;
        frames.push({ transform: `translate(${(x * 100).toFixed(2)}cqw, ${y.toFixed(1)}px) rotate(${rot.toFixed(1)}deg)`, opacity, offset: t });
      }
      const duration = ((yEnd - yStart) / f.speed) * 1000;
      const a = el.animate(frames, { duration, iterations: Infinity, easing: 'linear', delay: -f.phase * duration });
      animations.push(a);
    });
    return () => animations.forEach((a) => a.cancel());
  }, [floaters, points, river, fadeEnd]);

  const fade =
    fadeStart > 0 || fadeEnd > 0
      ? `linear-gradient(to bottom, ${fadeStart > 0 ? `transparent, #000 ${fadeStart}px` : '#000'}, #000 calc(100% - ${fadeEnd}px), ${fadeEnd > 0 ? 'transparent' : '#000'})`
      : undefined;

  return (
    <div
      aria-hidden
      className={`relative w-full ${releasable ? 'cursor-pointer' : 'pointer-events-none'} ${className}`}
      style={{ height, containerType: 'inline-size', maskImage: fade, WebkitMaskImage: fade }}
      onClick={releasable ? release : undefined}
    >
      {/* The bank: wet pebbles, with a soft shadow on the paper round them. */}
      <div className="absolute inset-[0]" style={{ filter: 'drop-shadow(0 3px 5px rgba(60,40,15,0.38))' }}>
        <div
          className="absolute inset-[0]"
          style={{
            backgroundImage: `url(${R}pebbles.webp)`,
            backgroundSize: '104px 104px',
            maskImage: bank,
            WebkitMaskImage: bank,
            maskSize: '100% 100%',
            WebkitMaskSize: '100% 100%',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
          }}
        />
      </div>

      {/* The foam where the water meets the stones: a pale line under the water's edge, of which the outer half shows. */}
      <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="absolute inset-[0] h-full w-full" style={{ filter: 'blur(1.1px)' }}>
        <path d={river.water} fill="none" stroke="rgba(236,250,246,0.7)" strokeWidth="3.4" vectorEffect="non-scaling-stroke" />
      </svg>

      {/* The water. */}
      <div
        className="absolute inset-[0] overflow-hidden"
        style={{ maskImage: water, WebkitMaskImage: water, maskSize: '100% 100%', WebkitMaskSize: '100% 100%', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat' }}
      >
        <div
          className="amb-stream absolute inset-x-[0]"
          style={{
            top: -BODY_TILE,
            height: height + BODY_TILE,
            backgroundImage: `url(${R}water-body.webp)`,
            backgroundSize: `${BODY_TILE / 2}px ${BODY_TILE}px`,
            ['--stream-tile' as string]: `${BODY_TILE}px`,
            ['--stream-dur' as string]: '26s',
          }}
        />
        <div
          className="amb-stream absolute inset-x-[0] opacity-80"
          style={{
            top: -GLINT_TILE,
            height: height + GLINT_TILE,
            backgroundImage: `url(${R}water-glints.webp)`,
            backgroundSize: `${GLINT_TILE / 2}px ${GLINT_TILE}px`,
            ['--stream-tile' as string]: `${GLINT_TILE}px`,
            ['--stream-dur' as string]: '15s',
          }}
        />
        {/* The water deepens towards the banks: a dark, soft band along the edge. */}
        <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="absolute inset-[0] h-full w-full" style={{ filter: 'blur(3px)' }}>
          <path d={river.water} fill="none" stroke="rgba(2,34,46,0.75)" strokeWidth="9" vectorEffect="non-scaling-stroke" />
        </svg>
        {/* A little light from above, so the water is not flat. */}
        <span aria-hidden className="absolute inset-[0]" style={{ background: 'linear-gradient(to bottom, rgba(210,240,255,0.14), transparent 30%)' }} />
      </div>

      {/* What floats. */}
      {floaters.map((f, i) => (
        <span
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="absolute left-[0] top-[0] block opacity-0"
          style={{ width: f.size, height: f.size, marginLeft: -f.size / 2, marginTop: -f.size / 2, willChange: 'transform' }}
        >
          {/* the water rings round it, where it sits */}
          <span aria-hidden className="amb-breathe absolute inset-[-24%] rounded-pill border border-[rgba(236,250,246,0.4)]" style={{ ['--breathe-dur' as string]: `${2.6 + (i % 3) * 0.8}s` }} />
          <span className="amb-bob block h-full w-full" style={{ ['--bob-dur' as string]: `${2.4 + (i % 4) * 0.7}s`, ['--bob-delay' as string]: `${-i * 0.5}s`, ['--bob-y' as string]: '-2px', filter: 'drop-shadow(0 2px 2px rgba(0,30,40,0.35))' }}>
            <Flora f={f} />
          </span>
        </span>
      ))}

      {/* The lamps set afloat by a touch. */}
      {lamps.map((l) => (
        <ReleasedLamp key={l.id} lamp={l} river={river} yEnd={yLast - fadeEnd * 0.4} onDone={() => lampDone(l.id)} />
      ))}

      {/* What to do, until the first lamp. */}
      {releasable && hint && lamps.length === 0 && (
        <span
          aria-hidden
          className={`${hintClassName} amb-bob pointer-events-none absolute -translate-x-1/2 whitespace-nowrap rounded-pill border border-[rgba(233,201,122,0.7)] bg-[rgba(10,20,48,0.78)] px-3 py-[5px] text-[12.5px] font-semibold text-[#f7ecd2] shadow-[0_4px_12px_rgba(0,0,0,0.35)]`}
          style={{ left: `clamp(92px, ${river.centre(hintAt) * 100}%, calc(100% - 92px))`, top: hintAt, ['--bob-dur' as string]: '3.2s', ['--bob-y' as string]: '-3px' }}
        >
          🪔 {hint}
        </span>
      )}
    </div>
  );
}

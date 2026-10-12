'use client';

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import Image from 'next/image';
import { AnimatePresence, m } from 'motion/react';
import { EASE } from '@/styles/motion';
import { Diya } from './Diya';
import { Lotus, Marigold } from './FloatingFlora';
import { WaterDrops, WaterRipples, WaterStreaks } from './FlowingWater';
import { Petals } from './Petals';

export interface ShrinePicture {
  src: string;
  /** The picture's own size, px. */
  width: number;
  height: number;
}

export interface AbhishekShrineProps {
  /** The lingam in its pool: a cut-out. `landing` is the top of the dome, where the water falls (shares of the picture); `pool` the pool's ellipse (shares: middle, half-width, half-height); `foot` where the dome meets its base. */
  lingam: ShrinePicture & {
    landing: { x: number; y: number };
    pool: { cx: number; cy: number; rx: number; ry: number };
    dome: { halfWidth: number; foot: number };
  };
  /** The hand with the lota pouring to the left, a cut-out; `spout` is where its stream ends (shares of the picture). */
  hand?: ShrinePicture & { spout: { x: number; y: number } };
  /** Nandi, a cut-out sitting and facing left: he is turned to face the lingam. */
  nandi?: ShrinePicture;
  /** What fills the top of the scene above the falling water: the end of the river (a mist, a cloud). Absolutely placed in the scene (375 wide, `SCENE_H` tall design box). */
  sky?: ReactNode;
  words: {
    /** The button that has the water poured, and what it says while it is poured. */
    pour: string;
    pouring: string;
    /** The line that appears over Nandi when he is touched, and its hint. */
    blessing: string;
    nandiHint: string;
  };
  /** The faces for the words (see `hindiFonts.ts` for Hindi), and the language. */
  displayClassName?: string;
  bodyClassName?: string;
  lang?: string;
  /** The button's fill (any CSS background), the colour of its words, and the colour of the line under it. */
  accent?: string;
  ink?: string;
  text?: string;
  /** Petals that fall over the scene. */
  petals?: string[];
}

/** The scene is drawn in a 375 x SCENE_H design box and scales with the page's width. */
export const SCENE_W = 375;
export const SCENE_H = 470;

const pct = (n: number, of: number) => `${(n / of) * 100}%`;

/**
 * The end of the river: the Ganga falls on the lingam. Under the last of the river a stream comes down onto the dome of
 * a lingam standing in its pool — streaks of bright water running down it, trickles down its two sides, a splash where it
 * lands, rings swelling across the pool, petals and a lotus afloat — with Nandi sitting by, turned to face it, and a row
 * of lamps along the stone. Two things can be touched: the button pours a lota of water from a hand (a heavier stream
 * and a bigger splash for a few seconds), and Nandi, who bows and gives his blessing. The pictures, the words and the colours are
 * props; the water is SVG animated with CSS (see `FlowingWater.tsx`), the touches are Framer Motion.
 */
export function AbhishekShrine({ lingam, hand, nandi, sky, words, displayClassName = '', bodyClassName = '', lang, accent = 'linear-gradient(to right, #b4501b, #8f3a10)', ink = '#fff6e0', text = '#3b3147', petals = ['#f5a623', '#e8791a', '#f8c850'] }: AbhishekShrineProps) {
  const [pouring, setPouring] = useState(false);
  const [blessed, setBlessed] = useState(0);

  // the stream from the lota runs a few seconds
  useEffect(() => {
    if (!pouring) return;
    const t = setTimeout(() => setPouring(false), 5200);
    return () => clearTimeout(t);
  }, [pouring]);
  // the blessing stays a moment
  const [showBlessing, setShowBlessing] = useState(false);
  useEffect(() => {
    if (!blessed) return;
    setShowBlessing(true);
    const t = setTimeout(() => setShowBlessing(false), 2600);
    return () => clearTimeout(t);
  }, [blessed]);

  // where everything sits in the design box
  const lw = 330;
  const lh = (lw * lingam.height) / lingam.width;
  const landX = SCENE_W / 2;
  const landY = 214;
  const lx = landX - lingam.landing.x * lw;
  const ly = landY - lingam.landing.y * lh;
  const poolX = lx + lingam.pool.cx * lw;
  const poolY = ly + lingam.pool.cy * lh;
  const poolRx = lingam.pool.rx * lw;
  const poolRy = lingam.pool.ry * lh;
  const domeHalf = lingam.dome.halfWidth * lw;
  const footY = ly + lingam.dome.foot * lh;

  const hw = 250;
  const hh = hand ? (hw * hand.height) / hand.width : 0;
  const spoutX = 232;
  const spoutY = 150;
  const hx = hand ? spoutX - hand.spout.x * hw : 0;
  const hy = hand ? spoutY - hand.spout.y * hh : 0;

  const nw = 142;
  const nh = nandi ? (nw * nandi.height) / nandi.width : 0;
  const nx = 26;
  const ny = poolY + poolRy * 0.9 - nh;

  const fall = `M${landX - 11} 40L${landX + 11} 40L${landX + 15} ${landY}L${landX - 15} ${landY}Z`;
  const streaks = [`M${landX - 6} 44C${landX - 8} 100 ${landX - 10} 160 ${landX - 8} ${landY}`, `M${landX} 44C${landX} 100 ${landX + 1} 160 ${landX} ${landY}`, `M${landX + 6} 44C${landX + 8} 100 ${landX + 10} 160 ${landX + 8} ${landY}`];
  const trickles = [
    `M${landX - 12} ${landY + 8}C${landX - 34} ${landY + 30} ${landX - domeHalf + 6} ${landY + 60} ${landX - domeHalf + 4} ${footY - 6}`,
    `M${landX + 12} ${landY + 8}C${landX + 34} ${landY + 30} ${landX + domeHalf - 6} ${landY + 60} ${landX + domeHalf - 4} ${footY - 6}`,
    `M${landX - 4} ${landY + 10}C${landX - 14} ${landY + 40} ${landX - 24} ${landY + 64} ${landX - 22} ${footY - 6}`,
    `M${landX + 5} ${landY + 10}C${landX + 16} ${landY + 40} ${landX + 24} ${landY + 64} ${landX + 22} ${footY - 6}`,
  ];
  const pourPath = (dx: number) => `M${spoutX + dx} ${spoutY}C${spoutX + dx} ${spoutY + 28} ${landX + 22 + dx} ${landY - 24} ${landX + 4 + dx} ${landY - 2}`;
  const pourPaths = [pourPath(0), pourPath(3), pourPath(-3)];

  return (
    <div lang={lang} className="relative mx-auto w-full" style={{ maxWidth: 480 }}>
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: `${SCENE_W} / ${SCENE_H}` }}>
        {/* a soft warm glow behind the lingam, as if lamplit */}
        <span aria-hidden className="amb-breathe pointer-events-none absolute rounded-pill" style={{ left: pct(landX - 150, SCENE_W), top: pct(landY - 40, SCENE_H), width: pct(300, SCENE_W), height: pct(300, SCENE_H), background: 'radial-gradient(closest-side, rgba(255,214,140,0.5), rgba(255,190,100,0.12) 62%, transparent)', ['--breathe-dur' as string]: '6s' }} />

        {sky}

        {/* the lingam in its pool */}
        <Image src={lingam.src} alt="" width={lingam.width} height={lingam.height} sizes="400px" className="pointer-events-none absolute max-w-none" style={{ left: pct(lx, SCENE_W), top: pct(ly, SCENE_H), width: pct(lw, SCENE_W), height: 'auto' }} />

        {/* the water: the fall, the trickles down the dome, the splash and the rings */}
        <svg viewBox={`0 0 ${SCENE_W} ${SCENE_H}`} aria-hidden className="pointer-events-none absolute inset-[0] h-full w-full">
          <defs>
            <linearGradient id="shrine-fall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#d8f3fb" stopOpacity="0" />
              <stop offset="0.18" stopColor="#d8f3fb" stopOpacity="0.55" />
              <stop offset="1" stopColor="#bfe9f7" stopOpacity="0.38" />
            </linearGradient>
          </defs>
          <WaterRipples cx={poolX} cy={poolY} rx={poolRx} ry={poolRy} count={3} duration={4.8} color="#e8fbff" width={2} />
          <WaterRipples cx={landX} cy={footY + 4} rx={domeHalf + 12} ry={9} count={2} duration={3.4} color="#e8fbff" width={1.6} />
          <path d={fall} fill="url(#shrine-fall)" />
          <WaterStreaks paths={streaks} color="#f2fdff" width={2.4} duration={0.5} dash={[14, 26]} opacity={0.92} />
          <WaterStreaks paths={trickles} color="#ffffff" width={2.3} duration={1.2} dash={[20, 26]} opacity={0.85} />
          <WaterDrops x={landX} y={landY + 2} count={pouring ? 16 : 9} spread={pouring ? 46 : 30} rise={pouring ? 40 : 26} radius={2.4} />

          {/* the lota's stream, while it is poured */}
          <m.g initial={false} animate={{ opacity: pouring ? 1 : 0 }} transition={{ duration: 0.5 }}>
            <WaterStreaks paths={pourPaths} color="#ffffff" width={4.2} duration={0.4} dash={[26, 10]} opacity={1} />
            <WaterRipples cx={poolX} cy={poolY} rx={poolRx * 0.8} ry={poolRy * 0.8} count={3} duration={2.4} color="#ffffff" width={2.4} />
          </m.g>
        </svg>

        {/* a lotus and a marigold afloat in the pool */}
        <Lotus className="amb-bob pointer-events-none absolute" style={{ left: pct(poolX + 60, SCENE_W), top: pct(poolY - 8, SCENE_H), width: pct(46, SCENE_W), ['--bob-dur' as string]: '3.4s' } as CSSProperties} />
        <Marigold className="amb-bob pointer-events-none absolute" style={{ left: pct(poolX - 92, SCENE_W), top: pct(poolY + 4, SCENE_H), width: pct(28, SCENE_W), ['--bob-dur' as string]: '2.8s' } as CSSProperties} />

        {/* the hand with the lota, in for the pouring */}
        {hand && (
          <m.div
            initial={false}
            animate={{ x: pouring ? 0 : 150, opacity: pouring ? 1 : 0, rotate: pouring ? -4 : 8 }}
            transition={{ duration: 0.7, ease: EASE.entrance }}
            className="pointer-events-none absolute"
            style={{ left: pct(hx, SCENE_W), top: pct(hy, SCENE_H), width: pct(hw, SCENE_W), transformOrigin: '85% 40%' }}
          >
            <Image src={hand.src} alt="" width={hand.width} height={hand.height} sizes="300px" className="block h-auto w-full" />
          </m.div>
        )}

        {/* Nandi, facing the lingam: touch him for his blessing */}
        {nandi && (
          <m.button
            type="button"
            onClick={() => setBlessed((n) => n + 1)}
            aria-label={words.blessing}
            animate={blessed ? { rotate: [0, -5, 0], y: [0, 4, 0] } : {}}
            transition={{ duration: 0.8, ease: EASE.entrance }}
            key={blessed}
            className="absolute block"
            style={{ left: pct(nx, SCENE_W), top: pct(ny, SCENE_H), width: pct(nw, SCENE_W), transformOrigin: '50% 100%' }}
          >
            <Image src={nandi.src} alt="" width={nandi.width} height={nandi.height} sizes="200px" className="block h-auto w-full -scale-x-100 drop-shadow-[0_8px_8px_rgba(40,20,0,0.35)]" />
          </m.button>
        )}
        <AnimatePresence>
          {showBlessing && (
            <m.span
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.5, ease: EASE.entrance }}
              className={`${displayClassName} pointer-events-none absolute -translate-x-1/2 whitespace-nowrap rounded-pill border border-[rgba(233,201,122,0.8)] bg-[rgba(10,20,48,0.85)] px-3 py-1 text-[15px] font-semibold text-[#f7ecd2] shadow-[0_6px_14px_rgba(0,0,0,0.35)]`}
              style={{ left: pct(nx + nw * 0.5, SCENE_W), top: pct(ny - 8, SCENE_H) }}
            >
              {words.blessing}
            </m.span>
          )}
        </AnimatePresence>
        {blessed > 0 && <div key={`p${blessed}`} className="pointer-events-none absolute inset-[0]"><Petals color={petals} count={12} size={[8, 13]} speed={1.6} loop={false} fit /></div>}

        {/* a row of lamps along the stone in front */}
        {[0, 1, 2, 3, 4].map((i) => (
          <Diya
            key={i}
            className="absolute"
            style={{ left: pct(112 + i * 36, SCENE_W), top: pct(SCENE_H - 52 + Math.abs(i - 2) * 5, SCENE_H), width: pct(26, SCENE_W), ['--flicker-delay' as string]: `${-i * 0.43}s` } as CSSProperties}
          />
        ))}
      </div>

      {/* the pouring */}
      <div className="flex flex-col items-center px-6 pb-2 pt-2 text-center">
        <button
          type="button"
          onClick={() => setPouring(true)}
          disabled={pouring}
          className={`${bodyClassName} rounded-pill px-7 py-3 text-[16px] font-bold shadow-[0_8px_20px_rgba(120,50,10,0.4)] transition-opacity disabled:opacity-80`}
          style={{ background: accent, color: ink }}
        >
          <span aria-hidden className="mr-2">🔱</span>
          {pouring ? words.pouring : words.pour}
        </button>
        <p className={`${bodyClassName} mt-3 text-[13px] opacity-80`} style={{ color: text }}>
          {words.nandiHint}
        </p>
      </div>
    </div>
  );
}

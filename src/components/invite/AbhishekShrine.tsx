'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import { AnimatePresence, m } from 'motion/react';
import { EASE } from '@/styles/motion';
import { Lotus, Marigold } from './FloatingFlora';
import { WaterRipples, WaterStreaks } from './FlowingWater';
import { Petals } from './Petals';
import { SCENE_H, SCENE_W } from './shrine';

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
  /** Nandi, a cut-out sitting and facing left: he is turned to face the lingam. */
  nandi?: ShrinePicture;
  /** The slab of stone Nandi sits on in the water (a seamless picture, repeated). */
  stone?: string;
  words: {
    /** The line that appears over Nandi when he is touched. */
    blessing: string;
  };
  /** The faces for the words (see `hindiFonts.ts` for Hindi), and the language. */
  displayClassName?: string;
  bodyClassName?: string;
  lang?: string;
  /** Petals that fall over the scene. */
  petals?: string[];
}


const pct = (n: number, of: number) => `${(n / of) * 100}%`;

/**
 * The end of the river: the pool the Ganga runs into, with Shiva standing in it. A lingam stands in the middle (a picture of
 * one in its own ring of water), its dome wet — bright trickles running down its sides, rings swelling across the pool and
 * round its foot; a lotus and a marigold afloat; a glow behind; Nandi on a slab of stone in the water, turned to face it.
 * Touch Nandi and he bows, gives his blessing in a bubble and a few petals fall. The pictures, the words and the colours are
 * props; the water is SVG moved by CSS (see `FlowingWater.tsx`), the touch is Framer Motion.
 */
export function AbhishekShrine({ lingam, nandi, stone, words, displayClassName = '', bodyClassName = '', lang, petals = ['#f5a623', '#e8791a', '#f8c850'] }: AbhishekShrineProps) {
  const [blessed, setBlessed] = useState(0);

  // the blessing stays a moment
  const [showBlessing, setShowBlessing] = useState(false);
  useEffect(() => {
    if (!blessed) return;
    setShowBlessing(true);
    const t = setTimeout(() => setShowBlessing(false), 2600);
    return () => clearTimeout(t);
  }, [blessed]);

  // where everything sits in the design box
  const lw = 320;
  const lh = (lw * lingam.height) / lingam.width;
  const landX = SCENE_W / 2;
  const landY = 140;
  const lx = landX - lingam.landing.x * lw;
  const ly = landY - lingam.landing.y * lh;
  const poolX = lx + lingam.pool.cx * lw;
  const poolY = ly + lingam.pool.cy * lh;
  const poolRx = lingam.pool.rx * lw;
  const poolRy = lingam.pool.ry * lh;
  const domeHalf = lingam.dome.halfWidth * lw;
  const footY = ly + lingam.dome.foot * lh;

  const nw = 140;
  const nh = nandi ? (nw * nandi.height) / nandi.width : 0;
  const nx = 26;
  const nBase = 326; // where he sits: the top of his slab
  const ny = nBase - nh;

  const trickles = [
    `M${landX - 10} ${landY + 8}C${landX - 28} ${landY + 28} ${landX - domeHalf + 6} ${landY + 56} ${landX - domeHalf + 4} ${footY - 6}`,
    `M${landX + 10} ${landY + 8}C${landX + 28} ${landY + 28} ${landX + domeHalf - 6} ${landY + 56} ${landX + domeHalf - 4} ${footY - 6}`,
    `M${landX - 3} ${landY + 10}C${landX - 12} ${landY + 38} ${landX - 20} ${landY + 58} ${landX - 18} ${footY - 6}`,
    `M${landX + 4} ${landY + 10}C${landX + 14} ${landY + 38} ${landX + 20} ${landY + 58} ${landX + 18} ${footY - 6}`,
  ];
  return (
    <div lang={lang} className="relative mx-auto w-full" style={{ maxWidth: 480 }}>
      <div className="relative w-full" style={{ aspectRatio: `${SCENE_W} / ${SCENE_H}` }}>
        {/* a soft warm glow behind the lingam, as if lamplit */}
        <span aria-hidden className="amb-breathe pointer-events-none absolute rounded-pill" style={{ left: pct(landX - 140, SCENE_W), top: pct(landY - 70, SCENE_H), width: pct(280, SCENE_W), height: pct(280, SCENE_H), background: 'radial-gradient(closest-side, rgba(255,214,140,0.42), rgba(255,190,100,0.1) 62%, transparent)', ['--breathe-dur' as string]: '6s' }} />

        {/* the lingam in its own pool */}
        <Image src={lingam.src} alt="" width={lingam.width} height={lingam.height} sizes="320px" className="pointer-events-none absolute max-w-none" style={{ left: pct(lx, SCENE_W), top: pct(ly, SCENE_H), width: pct(lw, SCENE_W), height: 'auto' }} />

        {/* the water: the trickles down the dome and the rings */}
        <svg viewBox={`0 0 ${SCENE_W} ${SCENE_H}`} aria-hidden className="pointer-events-none absolute inset-[0] h-full w-full">
          <WaterRipples cx={poolX} cy={poolY} rx={poolRx} ry={poolRy} count={3} duration={4.8} color="#e8fbff" width={1.8} />
          <WaterRipples cx={landX} cy={footY + 4} rx={domeHalf + 12} ry={8} count={2} duration={3.4} color="#e8fbff" width={1.5} />
          <WaterStreaks paths={trickles} color="#ffffff" width={2.1} duration={1.2} dash={[18, 24]} opacity={0.7} />
        </svg>

        {/* a lotus and a marigold afloat in the pool */}
        <Lotus className="amb-bob pointer-events-none absolute" style={{ left: pct(poolX + 66, SCENE_W), top: pct(poolY - 12, SCENE_H), width: pct(48, SCENE_W), ['--bob-dur' as string]: '3.4s' } as CSSProperties} />
        <Marigold className="amb-bob pointer-events-none absolute" style={{ left: pct(poolX - 104, SCENE_W), top: pct(poolY + 10, SCENE_H), width: pct(30, SCENE_W), ['--bob-dur' as string]: '2.8s' } as CSSProperties} />

        {/* Nandi on his slab of stone in the water, facing the lingam: touch him for his blessing */}
        {nandi && (
          <>
            <span
              aria-hidden
              className="pointer-events-none absolute rounded-pill shadow-[0_8px_12px_rgba(0,25,35,0.5)]"
              style={{
                left: pct(nx - 12, SCENE_W),
                top: pct(nBase - 14, SCENE_H),
                width: pct(nw + 24, SCENE_W),
                height: pct(30, SCENE_H),
                backgroundImage: stone ? `linear-gradient(to bottom, rgba(255,255,255,0.18), rgba(0,0,0,0.18)), url(${stone})` : undefined,
                backgroundColor: '#5d584f',
                backgroundSize: stone ? 'auto, 80px 80px' : undefined,
                boxShadow: 'inset 0 3px 3px rgba(255,255,255,0.25), inset 0 -4px 5px rgba(0,0,0,0.35), 0 8px 12px rgba(0,25,35,0.5)',
              }}
            />
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
              <Image src={nandi.src} alt="" width={nandi.width} height={nandi.height} sizes="160px" className="block h-auto w-full -scale-x-100 drop-shadow-[0_6px_6px_rgba(40,20,0,0.35)]" />
            </m.button>
          </>
        )}
        <AnimatePresence>
          {showBlessing && (
            <m.span
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.5, ease: EASE.entrance }}
              className={`${displayClassName} pointer-events-none absolute -translate-x-1/2 whitespace-nowrap rounded-pill border border-[rgba(233,201,122,0.8)] bg-[rgba(10,20,48,0.85)] px-3 py-1 text-[15px] font-semibold text-[#f7ecd2] shadow-[0_6px_14px_rgba(0,0,0,0.35)]`}
              style={{ left: pct(nx + nw * 0.5, SCENE_W), top: pct(ny - 6, SCENE_H) }}
            >
              {words.blessing}
            </m.span>
          )}
        </AnimatePresence>
        {blessed > 0 && (
          <div key={`p${blessed}`} className="pointer-events-none absolute inset-[0]">
            <Petals color={petals} count={12} size={[8, 13]} speed={1.6} loop={false} fit />
          </div>
        )}

      </div>

    </div>
  );
}

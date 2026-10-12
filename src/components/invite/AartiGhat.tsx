import type { CSSProperties, ReactNode } from 'react';
import Image from 'next/image';
import { Diya } from './Diya';

/** The picture of one person performing the aarti, a cut-out from the waist up: and where the flame of his lamp is in it. */
export interface AartiFigure {
  src: string;
  /** The picture's own size, px. */
  width: number;
  height: number;
  /** Where the lamp's flames are, as shares of the picture. */
  flame: { x: number; y: number };
}

export interface AartiPerson {
  /** Where he stands: his middle, as a share of the scene's width. */
  x: number;
  /** On the far terrace (smaller) or the near one (bigger). */
  row: 'back' | 'front';
  /** Turn him about, so his lamp is held on the other side. */
  flip?: boolean;
  /** Shift the colour of his clothes, degrees (a little: the flames shift with them). */
  hue?: number;
}

export interface AartiGhatProps {
  figure: AartiFigure;
  people: AartiPerson[];
  /** Seamless pictures: the stone of the ghat, the water under it, and a garland (a tile that repeats across). */
  art: { stone: string; water: string; garland: string };
  /** What hangs from the beam over the scene (a toran): absolutely placed children of the scene, which is 375 wide and `AARTI_H` tall in its own units; the beam is the top 24 of them. */
  hanging?: ReactNode;
  /** The ghat's pavilion: a stone pillar either side of the men and a beam across the top, for the toran to hang from (on by default). */
  frame?: boolean;
  className?: string;
}

/** The scene is drawn in a 375 x AARTI_H box and scales with the page's width. */
export const AARTI_W = 375;
export const AARTI_H = 480;

const pct = (n: number, of: number) => `${(n / of) * 100}%`;

// The two terraces: how wide a man is drawn on each (px of the scene), where the wall in front of him begins (px down), how much of him shows above it.
const ROW = {
  back: { w: 100, wall: 300, show: 0.8, z: 2 },
  front: { w: 156, wall: 364, show: 0.84, z: 4 },
} as const;
const WATER_TOP = 414;

/**
 * The Ganga aarti, at night: a ghat of two stone terraces (the far one only if there are men on it) with a row of men on each, all of them lifting the same
 * many-tiered lamp and swaying together (the way the priests of the river's ghats do), their flames glowing and
 * smoking, a garland along the wall in front, and the river below carrying the light as streaks of gold and a few lamps
 * afloat. One picture of one man is every one of them (turned about, or his clothes shifted in colour, so they are not
 * quite alike). The ghat is a pavilion — a pillar at each side and a beam across the top — and what hangs from the beam is the caller's (`hanging`). Everything is CSS and pictures; it stops under reduced
 * motion. The sky is the page's own.
 */
export function AartiGhat({ figure, people, art, hanging, frame = true, className = '' }: AartiGhatProps) {
  const stone = (extra = ''): CSSProperties => ({
    backgroundImage: `linear-gradient(to bottom, rgba(40,30,70,0.55), rgba(8,6,22,0.9)), url(${art.stone})`,
    backgroundSize: 'auto, 96px 96px',
    backgroundColor: '#1a1330',
    boxShadow: `inset 0 2px 0 rgba(255,176,96,0.4), inset 0 -10px 18px rgba(0,0,0,0.5)${extra}`,
  });

  return (
    <div className={`relative w-full overflow-hidden ${className}`} style={{ aspectRatio: `${AARTI_W} / ${AARTI_H}` }}>
      {/* a warm haze low on the scene, from all the flames */}
      <span aria-hidden className="pointer-events-none absolute inset-x-[0]" style={{ top: pct(190, AARTI_H), height: pct(240, AARTI_H), background: 'radial-gradient(ellipse 70% 60% at 50% 60%, rgba(255,150,60,0.22), transparent 75%)' }} />

      {/* the men: each row in order, behind its own wall */}
      {(['back', 'front'] as const).map((row) => {
        const r = ROW[row];
        const h = (r.w * figure.height) / figure.width;
        return people
          .filter((p) => p.row === row)
          .map((p, i) => {
            const fx = p.flip ? 1 - figure.flame.x : figure.flame.x;
            return (
              <div
                key={`${row}-${i}`}
                className="absolute"
                style={{ left: pct(p.x * AARTI_W - r.w / 2, AARTI_W), top: pct(r.wall - r.show * h, AARTI_H), width: pct(r.w, AARTI_W), aspectRatio: `${figure.width} / ${figure.height}`, zIndex: r.z }}
              >
                {/* they sway together, the same beat for all */}
                <div className="amb-limb absolute inset-[0]" style={{ ['--limb-origin' as string]: '50% 100%', ['--limb-angle' as string]: '2deg', ['--limb-dur' as string]: '2.6s' } as CSSProperties}>
                  <Image
                    src={figure.src}
                    alt=""
                    width={figure.width}
                    height={figure.height}
                    sizes="160px"
                    className="block h-full w-full max-w-none"
                    style={{ transform: p.flip ? 'scaleX(-1)' : undefined, filter: p.hue ? `hue-rotate(${p.hue}deg)` : undefined }}
                  />
                  {/* the flames glow and the smoke leaves them */}
                  <span
                    aria-hidden
                    className="amb-breathe pointer-events-none absolute rounded-pill mix-blend-screen"
                    style={{ left: `${fx * 100}%`, top: `${figure.flame.y * 100}%`, width: '96%', aspectRatio: '1 / 1', transform: 'translate(-50%, -50%)', background: 'radial-gradient(closest-side, rgba(255,184,76,0.75), rgba(255,140,40,0.26) 46%, transparent 72%)', ['--breathe-from' as string]: 0.35, ['--breathe-to' as string]: 0.85, ['--breathe-dur' as string]: `${1.6 + (i % 3) * 0.4}s` } as CSSProperties}
                  />
                  {[0, 1].map((k) => (
                    <span
                      key={k}
                      aria-hidden
                      className="amb-smoke pointer-events-none absolute rounded-pill"
                      style={{ left: `${fx * 100}%`, top: `${(figure.flame.y - 0.12) * 100}%`, width: '22%', aspectRatio: '1 / 1', marginLeft: '-11%', background: 'radial-gradient(closest-side, rgba(214,196,178,0.55), transparent 70%)', filter: 'blur(2px)', ['--smoke-dur' as string]: `${5 + k * 1.6}s`, ['--smoke-delay' as string]: `${-(i * 1.3 + k * 2.4)}s`, ['--smoke-rise' as string]: `${row === 'front' ? 90 : 64}px`, ['--smoke-drift' as string]: `${(k ? -1 : 1) * (p.flip ? -1 : 1) * 12}px` } as CSSProperties}
                    />
                  ))}
                </div>
              </div>
            );
          });
      })}

      {/* the far wall, in front of the far row and behind the near one (only when there is a far row) */}
      {people.some((p) => p.row === 'back') && <div aria-hidden className="pointer-events-none absolute inset-x-[0]" style={{ top: pct(ROW.back.wall, AARTI_H), height: pct(WATER_TOP - ROW.back.wall, AARTI_H), zIndex: 3, ...stone() }} />}
      {/* the near wall, with the flames' light along its top, and its garland */}
      <div aria-hidden className="pointer-events-none absolute inset-x-[0]" style={{ top: pct(ROW.front.wall, AARTI_H), height: pct(WATER_TOP - ROW.front.wall + 4, AARTI_H), zIndex: 5, ...stone() }} />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-[0]"
        style={{ top: pct(ROW.front.wall - 12, AARTI_H), height: pct(28, AARTI_H), zIndex: 6, backgroundImage: `url(${art.garland})`, backgroundRepeat: 'repeat-x', backgroundSize: 'auto 100%', filter: 'drop-shadow(0 3px 3px rgba(0,0,0,0.5))' }}
      />

      {/* the river: dark, moving, and carrying the lamps' gold */}
      <div aria-hidden className="pointer-events-none absolute inset-x-[0] bottom-[0] overflow-hidden" style={{ top: pct(WATER_TOP, AARTI_H), zIndex: 5 }}>
        <div
          className="amb-stream absolute inset-x-[0]"
          style={{ top: -520, height: 'calc(100% + 520px)', backgroundImage: `url(${art.water})`, backgroundSize: '260px 520px', ['--stream-tile' as string]: '520px', ['--stream-dur' as string]: '46s' } as CSSProperties}
        />
        <span className="absolute inset-[0]" style={{ background: 'linear-gradient(to bottom, rgba(6,10,36,0.6), rgba(6,10,36,0.2) 60%, rgba(6,10,36,0.45))' }} />
        {/* the reflections of the lamps, under the men who hold them */}
        {people
          .filter((p) => p.row === 'front')
          .map((p, i) => (
            <span
              key={i}
              className="amb-breathe absolute top-[0] rounded-pill"
              style={{ left: pct(p.x * AARTI_W - 30, AARTI_W), width: pct(60, AARTI_W), height: '100%', background: 'linear-gradient(to bottom, rgba(255,170,70,0.65), rgba(255,140,40,0.16) 70%, transparent)', filter: 'blur(5px)', ['--breathe-from' as string]: 0.3, ['--breathe-to' as string]: 0.75, ['--breathe-dur' as string]: `${2.4 + i * 0.5}s` } as CSSProperties}
            />
          ))}
        {/* lamps set afloat */}
        {[0.12, 0.3, 0.46, 0.63, 0.79, 0.93].map((x, i) => (
          <span key={i} className="amb-bob absolute block" style={{ left: pct(x * AARTI_W - 12, AARTI_W), top: `${24 + (i % 3) * 22}%`, width: pct(24, AARTI_W), ['--bob-dur' as string]: `${2.4 + i * 0.4}s`, ['--bob-delay' as string]: `${-i * 0.5}s` } as CSSProperties}>
            <span aria-hidden className="amb-breathe absolute inset-[-60%] rounded-pill" style={{ background: 'radial-gradient(closest-side, rgba(255,190,90,0.55), transparent)', ['--breathe-dur' as string]: `${2 + i * 0.3}s` } as CSSProperties} />
            <Diya className="relative block w-full" style={{ ['--flicker-delay' as string]: `${-i * 0.37}s` } as CSSProperties} />
          </span>
        ))}
      </div>

      {/* the pavilion: two pillars, lit from within by the flames, and the beam the toran hangs from */}
      {frame && (
        <>
          {[8, 341].map((x, i) => (
            <div key={x} aria-hidden className="pointer-events-none absolute" style={{ left: pct(x, AARTI_W), top: 0, width: pct(26, AARTI_W), height: pct(ROW.front.wall + 8, AARTI_H), zIndex: 1 }}>
              <div className="absolute inset-[0]" style={{ ...stone(), backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.55), rgba(255,176,96,0.22) ${i ? 62 : 38}%, rgba(0,0,0,0.6)), linear-gradient(to bottom, rgba(40,30,70,0.5), rgba(8,6,22,0.85)), url(${art.stone})`, backgroundSize: 'auto, auto, 96px 96px', boxShadow: 'none' }} />
              {/* its capital, under the beam, and its foot */}
              <span className="absolute -left-[16%] -right-[16%] top-[22px] block h-[12px] rounded-[3px]" style={stone()} />
              <span className="absolute -left-[16%] -right-[16%] bottom-[0] block h-[14px] rounded-[3px]" style={stone()} />
            </div>
          ))}
          <div aria-hidden className="pointer-events-none absolute inset-x-[0] top-[0]" style={{ height: pct(24, AARTI_H), zIndex: 7, ...stone(), boxShadow: 'inset 0 -2px 0 rgba(255,176,96,0.5), 0 4px 8px rgba(0,0,0,0.5)' }} />
        </>
      )}

      {hanging && <div className="pointer-events-none absolute inset-[0]" style={{ zIndex: 8 }}>{hanging}</div>}
    </div>
  );
}

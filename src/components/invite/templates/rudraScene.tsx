import type { CSSProperties } from 'react';
import Image from 'next/image';
import { DriftingClouds } from '../DriftingClouds';
import { HangingBells } from '../HangingBells';
import { HangingSprite } from '../HangingSprite';
import { WaterDrops, WaterRipples, WaterStreaks } from '../FlowingWater';
import { Petals } from '../Petals';

/**
 * The artwork for the Rudra template: the closed gate (a painted sky with Shiva's
 * lingam on it) and the temple that the invitation opens onto. Every picture is in
 * public/art/rudra/ (cut out of the stock images in public/art/platinum/rudra theme/;
 * the strands, the toran and the bells are the same ones the Platinum events use,
 * from public/art/platinum/events/). To dress the scene differently, change this file;
 * the template only composes it.
 */
const R = '/art/rudra/';
const EV = '/art/platinum/events/';

/** The colour the temple picture's sky is, flat, along its top edge: the sky above it ends on this so the two join with no seam. */
export const TEMPLE_SKY = '#6497ac';
/** The colour its ground is, flat, along its bottom edge: the ground under it starts on this. */
export const TEMPLE_GROUND = '#563d33';

/** The sky of the gate: a bright morning blue paling to white at the foot, where the lingam stands in the mist. */
const GATE_SKY = [
  'radial-gradient(ellipse at 50% 70%, rgba(255,250,225,0.95), rgba(255,250,225,0) 55%)',
  'linear-gradient(to bottom, #5aa6d6 0%, #8cc6e8 28%, #cfe8f6 58%, #f4faff 85%, #ffffff 100%)',
].join(', ');

/** Snow mountains, in two pale layers, standing behind the lingam. */
function GateMountains() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 220"
      preserveAspectRatio="xMidYMax slice"
      className="pointer-events-none absolute inset-x-[0] bottom-[0] h-[52%] w-full"
    >
      <path d="M0 220V120L38 92L66 112L118 40L160 98L198 70L252 14L304 92L342 62L400 106V220Z" fill="#b9d6ea" />
      <path d="M118 40L102 66L112 62L120 72L130 62L138 70Z M252 14L232 46L244 40L254 52L266 40L276 48Z M198 70L186 88L196 84L204 92L212 84Z" fill="#ffffff" fillOpacity="0.92" />
      <path d="M0 220V150L58 118L110 150L170 108L232 150L292 124L352 150L400 130V220Z" fill="#9fc3dc" />
      <path d="M170 108L156 126L166 122L174 132L184 122L192 128Z M292 124L280 140L290 136L298 146L306 138Z" fill="#ffffff" fillOpacity="0.85" />
    </svg>
  );
}

/**
 * The gate, which PhotoLock pushes into: Shiva's lingam under a stream of water, on a
 * bright sky among snow peaks, with clouds crossing, marigold strands and bells
 * hanging from the top corners, and petals drifting down. Lay out as a box that fills the screen.
 */
export function RudraGateScene({ petals }: { petals: string[] }) {
  return (
    <div className="absolute inset-[0] overflow-hidden" style={{ background: GATE_SKY }}>
      <DriftingClouds />
      <GateMountains />
      {/* A pale pool of mist at the foot, across the whole screen. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-[0] bottom-[0] h-[22%]"
        style={{ background: 'linear-gradient(to top, rgba(255,255,255,0.95), rgba(255,255,255,0))' }}
      />

      {/* On a wide screen the lingam and its dressing keep to a phone-width column, so they stay in proportion. */}
      <div className="absolute inset-y-[0] left-[50%] w-full max-w-[480px] -translate-x-1/2">
        {/* The lingam, big, its body on the centre line (its spout runs off the right edge). */}
        <Image
          src={`${R}shiva-lingam.webp`}
          alt="Lord Shiva's lingam, water running down it"
          width={1238}
          height={1246}
          priority
          sizes="(min-width: 480px) 520px, 108vw"
          className="pointer-events-none absolute bottom-[5%] left-[15%] h-auto w-[108%] max-w-none drop-shadow-[0_18px_22px_rgba(20,40,70,0.35)]"
        />

        <HangingSprite eager src={`${EV}marigold-1.webp`} width={90} height={942} size="3.2%" left="4%" angle={2.2} duration={5.4} delay={-1} />
        <HangingSprite eager src={`${EV}marigold-4.webp`} width={93} height={470} size="4.4%" left="10%" angle={3} duration={4.3} delay={-2.6} />
        <HangingSprite eager src={`${EV}marigold-2.webp`} width={92} height={784} size="3.2%" right="4%" angle={2.4} duration={5.9} delay={-3.1} />
        <HangingSprite eager src={`${EV}marigold-3.webp`} width={93} height={628} size="4.4%" right="10%" angle={3.2} duration={4.7} delay={-0.4} />
        <HangingBells className="absolute left-[16%] top-[0] w-[17%]" />
        <HangingBells mirror className="absolute right-[16%] top-[0] w-[17%]" />
      </div>

      <div className="pointer-events-none absolute inset-[0]">
        <Petals color={petals} count={12} size={[8, 15]} speed={0.5} />
      </div>
    </div>
  );
}

/** A small clay lamp, its flame flickering and a warm light round it. */
export function Diya({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 28" aria-hidden className={className} style={style}>
      <circle cx="12" cy="18" r="11" fill="#ffb347" fillOpacity="0.28" />
      <g className="amb-flicker" style={{ transformBox: 'fill-box', transformOrigin: 'center bottom', animationDelay: 'var(--flicker-delay, 0s)' }}>
        <path d="M12 2c4 5 4 8 0 11-4-3-4-6 0-11z" fill="#ff8a1f" />
        <path d="M12 6c2 3 2 5 0 7-2-2-2-4 0-7z" fill="#ffe27a" />
      </g>
      <path d="M3 16h18c-1 6-5 8-9 8s-8-2-9-8z" fill="#9a4a1c" />
      <path d="M3 16h18" stroke="#f0b04a" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Dressing for the temple picture, laid out in the picture's own box (a square), so
 * every `%` is a share of the picture: a toran over the doorway, marigold strands
 * hung from the porch and the tower, bells at the porch corners, and a row of lamps
 * along the platform. (The small pilgrim the picture painted by the door has been
 * painted out of `kedarnath.webp`.)
 */
export function TempleDressing() {
  return (
    <>
      {/* The tower: two strands from its balcony. */}
      <HangingSprite eager src={`${EV}marigold-4.webp`} width={93} height={470} size="3.6%" left="19%" top="55.5%" angle={2.4} duration={4.6} delay={-1.2} />
      <HangingSprite eager src={`${EV}marigold-3.webp`} width={93} height={628} size="3.6%" left="27%" top="55.5%" angle={2.8} duration={5.2} delay={-2.8} />

      {/* The porch: strands from its beam, between the bells. */}
      <HangingSprite eager src={`${EV}marigold-2.webp`} width={92} height={784} size="3.2%" left="53.5%" top="52%" angle={2.2} duration={5.6} delay={-0.6} />
      <HangingSprite eager src={`${EV}marigold-1.webp`} width={90} height={942} size="2.8%" left="58.5%" top="52%" angle={2.6} duration={4.9} delay={-3.4} />
      <HangingSprite eager src={`${EV}marigold-3.webp`} width={93} height={628} size="3.2%" left="71%" top="52%" angle={2.4} duration={5.3} delay={-1.9} />
      <HangingSprite eager src={`${EV}marigold-4.webp`} width={93} height={470} size="3.4%" left="75.5%" top="52%" angle={2.9} duration={4.4} delay={-2.2} />
      <HangingBells className="absolute left-[46.5%] top-[50.5%] w-[6.5%]" />
      <HangingBells mirror className="absolute left-[78.5%] top-[50.5%] w-[6.5%]" />

      {/* The toran across the doorway. */}
      <HangingSprite eager src={`${EV}toran.webp`} width={760} height={777} size="20%" left="54.2%" top="56.4%" angle={0.9} duration={6.5} />

      {/* A row of lamps along the front of the platform. */}
      {Array.from({ length: 8 }, (_, i) => (
        <Diya key={i} className="absolute w-[2.6%]" style={{ left: `${8.5 + i * 5.6}%`, top: `${85.5 + (i % 2) * 0.8}%`, ['--flicker-delay' as string]: `${-i * 0.37}s` }} />
      ))}
    </>
  );
}

/**
 * The water in `shiva-abhishek.webp`, brought to life: bright streaks running down the stream
 * from the bowl, thin trickles down the lingam's two sides, a splash where the stream lands,
 * and rings swelling across the pool. An `<svg>` in the picture's own coordinates (900 x 800,
 * the picture NOT turned about), so lay it over the picture inside the same box — and turn them
 * about together if the picture is.
 */
export function AbhishekWater() {
  return (
    <svg viewBox="0 0 900 800" aria-hidden className="pointer-events-none absolute inset-[0] h-full w-full">
      <WaterRipples cx={388} cy={690} rx={365} ry={55} count={3} duration={4.6} />
      <WaterStreaks
        paths={[
          'M413 152C399 178 393 207 392 237C391 267 395 293 397 322',
          'M419 157C405 181 399 209 398 239C397 269 400 294 402 322',
          'M407 150C393 176 387 206 386 236C385 266 389 292 391 322',
        ]}
        width={3.2}
        duration={0.55}
        dash={[12, 22]}
      />
      <WaterStreaks
        paths={['M345 360C328 390 322 440 322 508', 'M447 358C464 390 470 440 470 508']}
        color="#bfe9ff"
        width={2.4}
        duration={1.6}
        dash={[16, 46]}
        opacity={0.55}
      />
      <WaterDrops x={396} y={328} count={9} spread={70} rise={50} />
    </svg>
  );
}

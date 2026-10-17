import Image from 'next/image';
import { Bansuri } from '../Bansuri';
import type { PosterScene } from '../EventPoster';
import { HangingSprite } from '../HangingSprite';
import { Kalash } from '../Kalash';
import { PeacockFeather } from '../PeacockFeather';
import { Petals } from '../Petals';
import { Starfield } from '../Starfield';

/**
 * The artwork for the Krishna–Radha event cards, by name (an event picks one with its `art` field; otherwise they
 * go in turn). Each keeps its subject in the lower half of the card — the words stand over the upper half — and uses
 * pictures the site already has (the garlands, leaves and altar flowers in public/art/platinum/events/, the rose,
 * the moon) plus the shared SVG pieces (kalash, peacock feather, bansuri).
 */
const EV = '/art/platinum/events/';
const ROSE = '/art/krishna/rose-cutout.webp';

/** Marigold strands hanging from the two top corners of a card. */
function Strands() {
  return (
    <>
      <HangingSprite src={`${EV}marigold-1.webp`} width={90} height={942} size="5.4%" left="3%" angle={2.2} duration={5.4} delay={-1} />
      <HangingSprite src={`${EV}marigold-4.webp`} width={93} height={470} size="5.8%" left="10.5%" angle={3} duration={4.3} delay={-2.6} />
      <HangingSprite src={`${EV}marigold-2.webp`} width={92} height={784} size="5.4%" right="3%" angle={2.4} duration={5.9} delay={-3.1} />
      <HangingSprite src={`${EV}marigold-3.webp`} width={93} height={628} size="5.8%" right="10.5%" angle={3.2} duration={4.7} delay={-0.4} />
    </>
  );
}

/** A few roses lying along the foot of a card. */
function Roses({ at }: { at: { left: string; bottom: string; size: string; rotate: number }[] }) {
  return (
    <>
      {at.map((r, i) => (
        <span key={i} className="absolute block aspect-square" style={{ left: r.left, bottom: r.bottom, width: r.size, transform: `rotate(${r.rotate}deg)` }}>
          <Image src={ROSE} alt="" fill sizes="80px" className="object-contain drop-shadow-[0_6px_8px_rgba(90,10,20,0.3)]" />
        </span>
      ))}
    </>
  );
}

export function krishnaEventScenes(petals: { haldi: string[]; rose: string[] }): Record<string, PosterScene> {
  return {
    // Haldi: a warm gold morning, marigold strands, leaves at the foot and three kalash.
    haldi: {
      background: 'linear-gradient(to bottom, #fdf2cf 0%, #fbe19b 42%, #f6c964 78%, #ecb243 100%)',
      behind: (
        <>
          <Strands />
          <Image src={`${EV}ugadi-low-3.webp`} alt="" width={226} height={527} className="pointer-events-none absolute -bottom-[3%] -left-[6%] h-auto w-[34%] -scale-y-100" />
          <Image src={`${EV}ugadi-low-6.webp`} alt="" width={227} height={540} className="pointer-events-none absolute -bottom-[3%] -right-[6%] h-auto w-[34%] -scale-x-100 -scale-y-100" />
          <Kalash className="absolute bottom-[8%] left-[24%] w-[22%] drop-shadow-[0_8px_10px_rgba(120,60,10,0.3)]" />
          <Kalash className="absolute bottom-[8%] left-[54%] w-[22%] drop-shadow-[0_8px_10px_rgba(120,60,10,0.3)]" />
          <Kalash className="absolute bottom-[12%] left-[39%] w-[22%] drop-shadow-[0_8px_10px_rgba(120,60,10,0.3)]" />
        </>
      ),
      front: <Petals color={petals.haldi} count={9} size={[8, 14]} speed={0.42} />,
    },

    // Mehendi: a fresh green garden, flowers at the foot and two peacock feathers.
    mehendi: {
      background: 'linear-gradient(to bottom, #f7fbef 0%, #e6f1d3 45%, #cfe4b4 80%, #b9d79a 100%)',
      behind: (
        <>
          <Image src={`${EV}altar-floral-2.webp`} alt="" width={471} height={431} className="pointer-events-none absolute -bottom-[2%] -left-[8%] h-auto w-[52%]" />
          <Image src={`${EV}altar-floral-1.webp`} alt="" width={478} height={403} className="pointer-events-none absolute -bottom-[2%] -right-[8%] h-auto w-[52%] -scale-x-100" />
          <PeacockFeather className="absolute bottom-[10%] left-[34%] w-[16%] rotate-[-16deg]" sway={4} />
          <PeacockFeather className="absolute bottom-[10%] right-[34%] w-[16%] rotate-[16deg]" sway={4} phase={-3} />
        </>
      ),
      front: <Petals color={['#f06b7e', '#ffd36b', '#ffffff']} count={8} size={[7, 12]} speed={0.4} />,
    },

    // The wedding: blush and gold, an altar of flowers at the foot, roses strewn in front of it.
    vivah: {
      background: 'linear-gradient(to bottom, #fff6f1 0%, #fbe3dc 45%, #f4c6bd 80%, #ecaea3 100%)',
      behind: (
        <>
          <Strands />
          <Image src={`${EV}altar-drape-2.webp`} alt="" width={435} height={442} className="pointer-events-none absolute -bottom-[6%] left-1/2 h-auto w-[62%] -translate-x-1/2" />
          <Roses
            at={[
              { left: '4%', bottom: '3%', size: '20%', rotate: -18 },
              { left: '20%', bottom: '1%', size: '15%', rotate: 12 },
              { left: '64%', bottom: '1%', size: '15%', rotate: -10 },
              { left: '77%', bottom: '3%', size: '20%', rotate: 20 },
            ]}
          />
        </>
      ),
      front: <Petals color={petals.rose} count={10} size={[8, 14]} speed={0.4} />,
    },

    // The reception: a night in Vrindavan — stars, the moon low over the foot, and the flute playing.
    reception: {
      background: 'linear-gradient(to bottom, #0e1a3d 0%, #1b2c5e 50%, #3b2a5c 100%)',
      ink: '#fbeede',
      sub: '#e6d6ee',
      behind: (
        <>
          <div className="absolute inset-[0]">
            <Starfield count={50} color="#ffe9b0" constellations={false} />
          </div>
          <span aria-hidden className="absolute bottom-[14%] left-1/2 h-[46%] w-[120%] -translate-x-1/2" style={{ background: 'radial-gradient(closest-side, rgba(255,226,170,0.28), transparent)' }} />
          {/* centred by the outer box; the inner one turns (its animation owns `transform`) */}
          <span className="absolute bottom-[22%] left-1/2 block aspect-square w-[34%] -translate-x-1/2">
            <span className="amb-turn-slow absolute inset-[0] block">
              <Image src="/art/ganga/moon.webp" alt="" fill sizes="140px" className="rounded-pill object-cover" />
            </span>
          </span>
          <div className="absolute bottom-[8%] left-1/2 w-[84%] -translate-x-1/2">
            <Bansuri className="w-full rotate-[-6deg]" colors={{ notes: ['#ffe9b0', '#f6b6c2', '#9fe3d6'] }} />
          </div>
        </>
      ),
      front: <Petals color={petals.rose} count={7} size={[7, 12]} speed={0.35} />,
    },
  };
}

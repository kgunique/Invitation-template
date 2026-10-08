import Image from 'next/image';
import { ConvergingPieces } from '../ConvergingPieces';
import { DriftingClouds } from '../DriftingClouds';
import { Starfield } from '../Starfield';
import type { PosterScene } from '../EventPoster';
import { HangingBells } from '../HangingBells';
import { HangingSprite } from '../HangingSprite';
import { Kalash } from '../Kalash';
import { Petals } from '../Petals';
import { AbhishekWater, Diya } from './rudraScene';

/**
 * The artwork for the Rudra template's event cards, by name. An event picks one with its `art` field. Each
 * scene keeps its subject in the lower half of the card — the words stand over the upper half — and the
 * pictures are the ones the page already uses (public/art/rudra/ and the garlands in public/art/platinum/events/).
 * To dress a card differently, add a scene here and give the event its name.
 */
const R = '/art/rudra/';
const EV = '/art/platinum/events/';
const RT = '/art/platinum/rudra%20theme/';

/** Marigold strands hanging from the top corners of a card, and (with `bells`) a pair of bells between them and the title. */
function Garlands({ bells = false }: { bells?: boolean }) {
  return (
    <>
      <HangingSprite src={`${EV}marigold-1.webp`} width={90} height={942} size="5.4%" left="3%" angle={2.2} duration={5.4} delay={-1} />
      <HangingSprite src={`${EV}marigold-4.webp`} width={93} height={470} size="5.8%" left="10.5%" angle={3} duration={4.3} delay={-2.6} />
      <HangingSprite src={`${EV}marigold-2.webp`} width={92} height={784} size="5.4%" right="3%" angle={2.4} duration={5.9} delay={-3.1} />
      <HangingSprite src={`${EV}marigold-3.webp`} width={93} height={628} size="5.8%" right="10.5%" angle={3.2} duration={4.7} delay={-0.4} />
      {bells && (
        <>
          <HangingBells className="absolute left-[17%] top-[0] w-[15%]" />
          <HangingBells mirror className="absolute right-[17%] top-[0] w-[15%]" />
        </>
      )}
    </>
  );
}

/** A row of lamps along the foot of a card. */
function Lamps({ from, step, count, bottom }: { from: number; step: number; count: number; bottom: string }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <Diya
          key={i}
          className="absolute w-[6%]"
          style={{ left: `${from + i * step}%`, bottom, ['--flicker-delay' as string]: `${-i * 0.37}s` }}
        />
      ))}
    </>
  );
}

export function rudraEventScenes(petals: { haldi: string[]; dev: string[]; vivah: string[] }): Record<string, PosterScene> {
  return {
    // Satyanarayan puja, mandap and haldi kalash: a warm gold morning, marigold strands, leaves and kalash.
    haldi: {
      background: 'linear-gradient(to bottom, #fdf2cf 0%, #fbe19b 42%, #f6c964 78%, #ecb243 100%)',
      behind: (
        <>
          <span aria-hidden className="absolute left-[50%] top-[72%] h-[44%] w-[110%] -translate-x-1/2 -translate-y-1/2" style={{ background: 'radial-gradient(closest-side, rgba(255,246,200,0.9), transparent)' }} />
          <Garlands />
          <Image src={`${EV}ugadi-low-3.webp`} alt="" width={226} height={527} className="pointer-events-none absolute -bottom-[3%] -left-[6%] h-auto w-[34%] -scale-y-100" />
          <Image src={`${EV}ugadi-low-6.webp`} alt="" width={227} height={540} className="pointer-events-none absolute -bottom-[3%] -right-[6%] h-auto w-[34%] -scale-x-100 -scale-y-100" />
          <Kalash className="absolute bottom-[8%] left-[24%] w-[22%] drop-shadow-[0_8px_10px_rgba(120,60,10,0.3)]" />
          <Kalash className="absolute bottom-[8%] left-[54%] w-[22%] drop-shadow-[0_8px_10px_rgba(120,60,10,0.3)]" />
          <Kalash className="absolute bottom-[12%] left-[39%] w-[22%] drop-shadow-[0_8px_10px_rgba(120,60,10,0.3)]" />
          <Lamps from={30} step={6.4} count={2} bottom="4%" />
          <Lamps from={56} step={6.4} count={2} bottom="4%" />
        </>
      ),
      front: <Petals color={petals.haldi} count={9} size={[8, 14]} speed={0.42} />,
    },

    // Ghritdhari and dev puja: a dusk sky, drifting clouds, and the lingam being bathed.
    dev: {
      background: 'linear-gradient(to bottom, #c8def5 0%, #e6e4f0 46%, #f7dcc4 82%, #f2c9a4 100%)',
      behind: (
        <>
          <DriftingClouds
            color="#ffffff"
            clouds={[
              { top: 34, width: 40, duration: 120, offset: 0.2, opacity: 0.8 },
              { top: 50, width: 30, duration: 150, offset: 0.7, opacity: 0.6 },
            ]}
          />
          <HangingBells className="absolute left-[4%] top-[0] w-[15%]" />
          <HangingBells mirror className="absolute right-[4%] top-[0] w-[15%]" />
          <span aria-hidden className="amb-breathe absolute left-[50%] top-[76%] h-[40%] w-[100%] -translate-x-1/2 -translate-y-1/2" style={{ background: 'radial-gradient(closest-side, rgba(255,214,120,0.55), transparent)' }} />
          {/* The lingam and the hand that bathes it, turned about so the arm pours in from the left; the water moves over them. */}
          <div className="pointer-events-none absolute -bottom-[1%] left-[-4%] w-[108%]" style={{ aspectRatio: '900 / 800' }}>
            <div className="absolute inset-[0] -scale-x-100">
              <div className="absolute inset-x-[0] top-[39.75%] h-[60.25%]">
                <Image src={`${R}shiva-abhishek-lingam.webp`} alt="" fill sizes="420px" className="object-contain" />
              </div>
              <div className="absolute inset-x-[0] top-[0] h-[40.25%]">
                <Image src={`${R}shiva-abhishek-hand.webp`} alt="" fill sizes="420px" className="object-contain" />
              </div>
              <AbhishekWater />
            </div>
          </div>
          <Lamps from={4} step={5.4} count={3} bottom="2.5%" />
          <Lamps from={78} step={5.4} count={3} bottom="2.5%" />
        </>
      ),
      front: <Petals color={petals.dev} count={9} size={[8, 14]} speed={0.45} />,
    },

    // Baraat and the sacred wedding, "रात्रि में": a moonlit night, stars, a warm glow at the horizon, and the hands of Shiva and Shakti clasping.
    vivah: {
      background: 'linear-gradient(to bottom, #0b1738 0%, #15306a 36%, #2f4590 62%, #7a5aa0 84%, #e0906c 100%)',
      ink: '#fff4d8',
      sub: '#e6dcc6',
      behind: (
        <>
          <Starfield color="#fdf6e3" count={64} constellations={false} />
          <span aria-hidden className="absolute left-[50%] top-[72%] h-[56%] w-[130%] -translate-x-1/2 -translate-y-1/2" style={{ background: 'radial-gradient(closest-side, rgba(255,214,130,0.62), transparent)' }} />
          <div className="pointer-events-none absolute -bottom-[12%] left-[-5%] w-[110%]" style={{ aspectRatio: '900 / 1010' }}>
            <ConvergingPieces
              alt="शिव और पार्वती के हाथ एक-दूसरे को थामे हुए"
              pieces={[
                { src: `${RT}Blue%20Striped%20Hand%20with%20Rudraksha%20Bracelets.png`, from: 'right', delay: 0.3 },
                { src: `${RT}shiva-parvati-hands.png`, from: 'left', delay: 1.6 },
              ]}
              duration={1.4}
              meetAt={2.6}
              sizes="440px"
            />
          </div>
        </>
      ),
      front: <Petals color={petals.vivah} count={9} size={[8, 14]} speed={0.42} />,
    },

    // The welcome of the bride and groom: Shiva and Parvati on a swing under a tree, in the open air.
    swagat: {
      background: 'linear-gradient(to bottom, #d7edf8 0%, #9fd4f0 35%, #7cc4ee 100%)',
      wash: 'linear-gradient(to bottom, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.6) 38%, rgba(255,255,255,0) 100%)',
      behind: (
        <>
          <Image
            src={`${R}swing.webp`}
            alt="शिव और पार्वती वृक्ष के नीचे झूले पर"
            fill
            sizes="380px"
            className="object-cover"
            style={{
              objectPosition: '50% 100%',
              transform: 'translateY(15%) scale(1.04)',
              transformOrigin: '50% 100%',
              maskImage: 'linear-gradient(to bottom, transparent 10%, #000 30%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 10%, #000 30%)',
            }}
          />
        </>
      ),
      front: <Petals color={petals.vivah} count={8} size={[8, 13]} speed={0.4} />,
    },
  };
}

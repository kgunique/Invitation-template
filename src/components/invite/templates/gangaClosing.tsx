import Image from 'next/image';
import { AartiGhat } from '../AartiGhat';
import { HangingSprite } from '../HangingSprite';
import { hindiBody, hindiDisplay } from '../hindiFonts';
import { Starfield } from '../Starfield';
import { ThankYouSection } from '../ThankYouSection';
import type { InviteCouple } from '@/content/invites';
import { NIGHT_FOOT } from './kailashGangaScene';

/**
 * The last scene of the Kailash–Ganga template: the thank-you. The sheet the river ran on is torn off above it (the page
 * pulls this section up behind the tear) and under it is dusk, then night — stars, the moon again, turning slowly, and the
 * Ganga aarti on its ghat (`AartiGhat`: three men lifting their lamps together, a pavilion with a toran over them, the river
 * carrying the light) — so the page ends at the river's own evening worship. The words are the shared closing
 * (`ThankYouSection`) in Hindi on a night colour scheme.
 */
const R = '/art/ganga/';
const EV = '/art/platinum/events/';

export interface GangaClosingProps {
  groom: string;
  bride: string;
  couple?: InviteCouple;
  /** The note to the guests. */
  thankYou?: string;
}

export function GangaClosing({ groom, bride, couple, thankYou }: GangaClosingProps) {
  return (
    <ThankYouSection
      lang="hi"
      displayClassName={hindiDisplay.className}
      bodyClassName={hindiBody.className}
      // the shared closing prints `bride` first and `groom` second; this page writes the groom first everywhere, so they go in the other way round
      bride={couple?.groom.name ?? groom}
      groom={couple?.bride.name ?? bride}
      eyebrow="हार्दिक आभार"
      title="धन्यवाद"
      message={thankYou ?? 'हमारे इस शुभ अवसर पर आपका स्नेह और आशीर्वाद पाकर हम धन्य हुए।'}
      wish="महादेव और माँ गंगा का आशीर्वाद आप सब पर सदा बना रहे।"
      creditLabel="प्रेमपूर्वक बनाया"
      creditByLabel="द्वारा"
      showKalash={false}
      plants={false}
      petals={['#f5a623', '#e8791a', '#f8c850']}
      base={NIGHT_FOOT}
      colors={{ ink: '#f7ecd2', body: '#dcd6ea', muted: '#aeb6d6', accent: '#e9c97a' }}
      background={`linear-gradient(to bottom, #2c3569 0, #1b2557 14%, #101a40 40%, ${NIGHT_FOOT} 72%)`}
      backgroundScene={
        <div className="absolute inset-[0]">
          <div className="absolute inset-x-[0] bottom-[0] top-[10%]">
            <Starfield count={55} constellations={false} />
          </div>
        </div>
      }
      scene={
        // The Ganga aarti: a ghat of men lifting their lamps together, the river below carrying the light, a toran and garlands over it all.
        <div className="relative mx-auto w-full max-w-[480px]" style={{ maskImage: 'linear-gradient(to bottom, #000 88%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, #000 88%, transparent)' }}>
          <AartiGhat
            figure={{ src: `${R}priest.webp`, width: 560, height: 597, flame: { x: 0.779, y: 0.26 } }}
            art={{ stone: `${R}pebbles.webp`, water: `${R}water-body.webp`, garland: `${R}garland-tile-h.webp` }}
            people={[
              { x: 0.2, row: 'front' },
              { x: 0.5, row: 'front', hue: 6 },
              { x: 0.8, row: 'front', flip: true },
            ]}
            hanging={<HangingSprite eager src={`${EV}toran.webp`} width={760} height={777} size="50%" left="25%" top="5%" angle={0.8} duration={6.5} />}
          />
          {/* the moon, come round again, over the river */}
          <div className="absolute top-[44px] z-[6] h-[96px] w-[96px]" style={{ left: 'calc(17% - 48px)' }}>
            <span aria-hidden className="amb-breathe absolute inset-[0] rounded-pill" style={{ background: 'radial-gradient(closest-side, rgba(247,236,210,0.45), rgba(247,236,210,0.1) 60%, transparent)', ['--breathe-dur' as string]: '5s' }} />
            <Image src={`${R}moon.webp`} alt="" width={420} height={420} sizes="56px" className="amb-turn-slow absolute inset-[20px] h-[56px] w-[56px]" />
          </div>
        </div>
      }
    />
  );
}

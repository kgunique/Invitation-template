import type { CSSProperties } from 'react';
import Image from 'next/image';
import { Diya } from '../Diya';
import { hindiBody, hindiDisplay } from '../hindiFonts';
import { Starfield } from '../Starfield';
import { ThankYouSection } from '../ThankYouSection';
import type { InviteCouple } from '@/content/invites';
import { NIGHT_FOOT } from './kailashGangaScene';
import { PAPER } from './gangaStretch';

/**
 * The last scene of the Kailash–Ganga template: the thank-you. The paper the river ran on turns to dusk and then to the
 * night the page began in — stars, the moon again, turning slowly, and Kailash standing at the foot with a row of lamps
 * lit before it — so the page ends where it started, the river having come full circle. The words are the shared closing
 * (`ThankYouSection`) in Hindi on a night colour scheme.
 */
const R = '/art/ganga/';

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
      bride={couple?.bride.name ?? bride}
      groom={couple?.groom.name ?? groom}
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
      background={`linear-gradient(to bottom, ${PAPER} 0, #d9c9b3 3%, #8d88a4 11%, #35416f 24%, #121c42 44%, ${NIGHT_FOOT} 70%)`}
      backgroundScene={
        <div className="absolute inset-[0]">
          <div className="absolute inset-x-[0] bottom-[0] top-[10%]">
            <Starfield count={55} constellations={false} />
          </div>
        </div>
      }
      scene={
        <div className="relative mx-auto h-[250px] w-full max-w-[480px] overflow-hidden">
          <Image src={`${R}kailash-night.webp`} alt="" width={1100} height={729} sizes="(min-width: 480px) 600px, 125vw" className="absolute bottom-[-6%] left-[-12%] w-[125%] max-w-none opacity-90" style={{ maskImage: 'linear-gradient(to bottom, transparent, #000 30%, #000 80%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 30%, #000 80%, transparent)' }} />
          {/* the moon, come round again, over the peak */}
          <div className="absolute right-[7%] top-[0] h-[110px] w-[110px]">
            <span aria-hidden className="amb-breathe absolute inset-[0] rounded-pill" style={{ background: 'radial-gradient(closest-side, rgba(247,236,210,0.45), rgba(247,236,210,0.1) 60%, transparent)', ['--breathe-dur' as string]: '5s' }} />
            <Image src={`${R}moon.webp`} alt="" width={420} height={420} sizes="64px" className="amb-turn-slow absolute inset-[23px] h-[64px] w-[64px]" />
          </div>
          <div className="absolute inset-x-[0] bottom-[10px] flex items-end justify-center gap-[18px]">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <Diya key={i} className="block w-[30px]" style={{ ['--flicker-delay' as string]: `${-i * 0.41}s`, marginBottom: Math.abs(i - 3) * 3 } as CSSProperties} />
            ))}
          </div>
        </div>
      }
    />
  );
}

import Image from 'next/image';
import type { EventScene } from '../EventCard';
import { HangingBells } from '../HangingBells';
import { HangingSprite } from '../HangingSprite';
import { Mandala } from '../Mandala';

/**
 * The artwork for the Platinum template's event cards, by name. An event picks
 * one with its `art` field; an event with none takes them in this order. Every
 * picture is a cut-out in public/art/platinum/events/ (made from the stock
 * sheets in public/art/platinum/). To dress a card differently, add a scene
 * here and give the event its name — nothing else changes.
 *
 * Every card is 640px tall at least (see EventCard), so each scene's
 * `topSpace` + the text (about 270–290) + `bottomSpace` comes to about 640: the
 * art fills the card and the four cards stand at one height.
 */
const EV = '/art/platinum/events/';

export function platinumEventScenes(accent: string): Record<string, EventScene> {
  return {
    // The whole card stands under a gold canopy hung with chandeliers. The canopy is drawn wide enough that its
    // opening is the width of the text and its posts run down the card's edges; above it, a half mandala between two strings of bells.
    canopy: {
      background: 'linear-gradient(to bottom, #fff6ea, #fbe7d0)',
      topSpace: 298,
      bottomSpace: 42,
      plate: true,
      behind: (
        <Image
          src={`${EV}canopy-gold.webp`}
          alt=""
          width={969}
          height={1008}
          className="pointer-events-none absolute bottom-[0] left-[50%] -ml-[226px] h-auto w-[452px] max-w-none"
        />
      ),
      top: (
        <>
          <Mandala color={accent} duration={100} className="absolute left-[50%] top-[-92px] -ml-[92px] w-[184px]" />
          <HangingBells className="absolute left-[3%] top-[0] w-[66px]" />
          <HangingBells mirror className="absolute right-[3%] top-[0] w-[66px]" />
        </>
      ),
    },

    // A marigold toran, with its bells and lamps, across the top.
    toran: {
      background: 'linear-gradient(to bottom, #fffbe6, #fcf0c4)',
      topSpace: 330,
      bottomSpace: 18,
      plate: true,
      top: (
        <HangingSprite
          src={`${EV}toran.webp`}
          width={760}
          height={777}
          size={326}
          left="50%"
          top={6}
          angle={0.9}
          duration={6.5}
          className="-ml-[163px]"
        />
      ),
    },

    // The whole card stands inside an arch of flowers, drawn wide from a third of the way down so the text starts
    // where its opening is widest; a soft wash behind the text keeps it readable over the blooms. Bells hang above.
    'floral-arch': {
      background: 'linear-gradient(to bottom, #fff7f0, #fbe6dc)',
      topSpace: 306,
      bottomSpace: 36,
      plate: true,
      behind: (
        <Image
          src={`${EV}altar-floral-2.webp`}
          alt=""
          width={471}
          height={431}
          className="pointer-events-none absolute bottom-[0] left-[50%] -ml-[290px] h-auto w-[580px] max-w-none"
        />
      ),
      top: (
        <>
          <HangingBells className="absolute left-[4%] top-[0] w-[70px]" />
          <HangingBells mirror className="absolute right-[4%] top-[0] w-[70px]" />
        </>
      ),
    },

    // Marigold garlands down both sides under a half mandala, and the Shubh Vivah emblem (joined hands in a
    // ring of petals), poured in gold through its mask, at the foot.
    vivah: {
      background: 'linear-gradient(to bottom, #fff3e0, #fde8c6)',
      topSpace: 118,
      bottomSpace: 214,
      plate: true,
      top: (
        <>
          <Mandala color={accent} duration={90} className="absolute left-[50%] top-[-84px] -ml-[84px] w-[168px]" />
          <HangingSprite src={`${EV}marigold-1.webp`} width={90} height={942} size={22} left={8} angle={2.2} duration={5.4} delay={-1} />
          <HangingSprite src={`${EV}marigold-4.webp`} width={93} height={470} size={19} left={40} angle={3} duration={4.3} delay={-2.6} />
          <HangingSprite src={`${EV}marigold-2.webp`} width={92} height={784} size={22} right={8} angle={2.4} duration={5.9} delay={-3.1} />
          <HangingSprite src={`${EV}marigold-3.webp`} width={93} height={628} size={17} right={40} angle={3.2} duration={4.7} delay={-0.4} />
        </>
      ),
      bottom: (
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-[14px] left-[50%] -ml-[100px] block h-[200px] w-[200px]"
          style={{
            background: 'linear-gradient(135deg, #d4a23a, #7a4a0f 70%)',
            maskImage: `url(${EV}shubh-vivah-mask.webp)`,
            WebkitMaskImage: `url(${EV}shubh-vivah-mask.webp)`,
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
          }}
        />
      ),
    },
  };
}

'use client';

import Image from 'next/image';
import { m } from 'motion/react';
import type { InviteGalleryItem } from '@/content/invites';
import { hindiBody, hindiDisplay } from '../hindiFonts';
import { HeartIcon, SparkleIcon } from '../icons';
import { RevealLine, fadeUp } from '../RevealLines';
import { sectionVars, type SectionColors } from '../sectionTheme';

export interface RudraGallerySectionProps {
  items: InviteGalleryItem[];
  background?: string;
  colors?: Partial<SectionColors>;
}

/** A pale-blue, horizontally swipeable photo strip for the Rudra invitation. */
export function RudraGallerySection({
  items,
  background = 'transparent',
  colors,
}: RudraGallerySectionProps) {
  return (
    <section
      aria-label="फोटो गैलरी"
      style={{ ...sectionVars(colors), background }}
      className="relative overflow-hidden pb-12 pt-10"
    >
      <m.div
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.35 }}
        className="relative"
      >
        <div className="flex flex-col items-center px-5 text-center">
          <m.p variants={fadeUp} className={`${hindiBody.className} invite-eyebrow text-invite-metal`}>
            यादगार पल
          </m.p>
          <div className="mt-3">
            <RevealLine className={`${hindiDisplay.className} display-lg italic text-invite-ink`}>फोटो गैलरी</RevealLine>
          </div>
          <m.div variants={fadeUp} aria-hidden className="mt-3 flex items-center gap-2 text-invite-metal">
            <span className="block h-px w-8 bg-current opacity-50" />
            <HeartIcon className="h-[13px] w-[13px]" />
            <span className="block h-px w-8 bg-current opacity-50" />
          </m.div>
        </div>

        <div
          role="region"
          aria-label="विवाह की तस्वीरें"
          aria-roledescription="carousel"
          aria-live="off"
          tabIndex={0}
          className="rudra-gallery-window mx-auto mt-8 max-w-[480px] overflow-hidden px-4 pb-4 pt-1 outline-none"
        >
          <div className="amb-gallery-marquee flex w-max">
            {[false, true].map((duplicate) => (
              <div
                key={duplicate ? 'loop' : 'photos'}
                aria-hidden={duplicate || undefined}
                className="flex shrink-0 gap-4 pr-4"
              >
                {items.map((item, index) => (
                  <article
                    key={item.src}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${index + 1} of ${items.length}: ${item.alt}`}
                    className={`relative flex h-[330px] w-[240px] shrink-0 flex-col rounded-2xl border border-[#38bdf8]/35 bg-white p-3 pb-9 shadow-[0_12px_32px_rgba(2,132,199,0.12)] transition-shadow hover:shadow-[0_20px_45px_rgba(2,132,199,0.22)] sm:h-[390px] sm:w-[290px] sm:p-3.5 sm:pb-11 ${
                      index % 2 === 0 ? 'rotate-[2deg]' : '-rotate-[2deg]'
                    }`}
                  >
                    <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl bg-[#eaf5fb]">
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        sizes="(min-width: 640px) 290px, 240px"
                        className="object-cover"
                      />
                    </div>
                    <span
                      aria-hidden
                      className="absolute bottom-2 left-1/2 flex h-[22px] w-[22px] -translate-x-1/2 items-center justify-center rounded-full border border-[#38bdf8]/35 bg-[#f2faff] text-[#1684bd]"
                    >
                      <SparkleIcon className="h-[12px] w-[12px]" />
                    </span>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      </m.div>
    </section>
  );
}

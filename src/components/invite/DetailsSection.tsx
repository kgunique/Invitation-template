'use client';

import type { ReactNode } from 'react';
import { m } from 'motion/react';
import type { InviteDetail } from '@/content/invites';
import { DURATION, EASE } from '@/styles/motion';
import { GoldDivider } from './GoldDivider';
import { GiftIcon, HeartIcon, PhoneIcon } from './icons';
import { RevealLine, fadeUp, lineGroup } from './RevealLines';
import { sectionVars, type SectionColors } from './sectionTheme';

const ICONS = { phone: PhoneIcon, gift: GiftIcon };

// The cream card Silver was made with.
const DEFAULT_CARD = 'linear-gradient(135deg, #fbf6e9, #f6eedb)';

const GOLD = (percent: number) => `color-mix(in srgb, var(--invite-metal) ${percent}%, transparent)`;

const group = lineGroup(0.1);

const pop = (delay: number) => ({
  hidden: { opacity: 0, scale: 0.5 },
  shown: { opacity: 1, scale: 1, transition: { duration: DURATION.slow, ease: EASE.entrance, delay } },
});

export interface DetailsSectionProps {
  details: InviteDetail[];
  title?: string;
  /** What the cards are filled with: any CSS background. Defaults to Silver's cream. */
  cardBackground?: string;
  /** The section's own background: any CSS background. Leave it transparent on a page that has its own sky. */
  background?: string;
  /** Palette. Defaults to the Silver cream/plum; a night page passes its own. */
  colors?: Partial<SectionColors>;
  /** Anything to show under the cards — the gift registry, say. Put motion
   * children (with `variants={fadeUp}`) in it and they join the reveal. */
  children?: ReactNode;
}

/**
 * "Wedding details": a heart, a title and a divider, then one framed card per
 * detail (icon medallion left, title, text and an optional gold line right),
 * then whatever you pass as `children`. Reveals on scroll: the heart pops, the
 * title rises, the divider draws, then the cards rise one after another with
 * their icons popping a beat behind. The card fill, the section background and
 * the palette are props, so it sits on cream (Silver) or a night sky (Gold).
 */
export function DetailsSection({
  details,
  title = 'Wedding Details',
  cardBackground = DEFAULT_CARD,
  background = 'transparent',
  colors,
  children,
}: DetailsSectionProps) {
  return (
    <section style={{ ...sectionVars(colors), background }} className="relative overflow-hidden px-5 pb-16 pt-16">
      <m.div
        variants={group}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.15 }}
        className="mx-auto w-full max-w-[420px]"
      >
        <div className="text-center">
          <m.span variants={pop(0)} className="inline-block text-invite-metal">
            <HeartIcon className="h-[26px] w-[26px]" />
          </m.span>
          <div className="mt-3">
            <RevealLine className="display-lg text-invite-ink">{title}</RevealLine>
          </div>
          <GoldDivider className="mt-5" />
        </div>

        <ul className="mt-10 space-y-6">
          {details.map((detail) => {
            const Icon = ICONS[detail.icon];
            return (
              <m.li
                key={detail.title}
                variants={fadeUp}
                className="relative rounded-[20px] border-[1.5px] p-5 shadow-md"
                style={{ background: cardBackground, borderColor: GOLD(45) }}
              >
                {/* Inner hairline frame, with a bracket on two opposite corners. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-[5px] rounded-[15px] border"
                  style={{ borderColor: GOLD(28) }}
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-[3px] top-[3px] h-[16px] w-[16px] rounded-tl-[17px] border-l-2 border-t-2"
                  style={{ borderColor: GOLD(75) }}
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute bottom-[3px] right-[3px] h-[16px] w-[16px] rounded-br-[17px] border-b-2 border-r-2"
                  style={{ borderColor: GOLD(75) }}
                />

                <div className="relative flex gap-4 text-left">
                  <m.span
                    variants={pop(0.25)}
                    aria-hidden
                    className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-pill text-invite-metal"
                    style={{ background: GOLD(16) }}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </m.span>
                  <div className="min-w-0">
                    <p className="body-lg font-bold text-invite-ink">{detail.title}</p>
                    <p className="body-sm mt-1 text-ink-body">{detail.body}</p>
                    {detail.highlight && (
                      <p className="body-sm mt-2 font-bold text-invite-metal">
                        {detail.highlightHref ? <a href={detail.highlightHref}>{detail.highlight}</a> : detail.highlight}
                      </p>
                    )}
                  </div>
                </div>
              </m.li>
            );
          })}
        </ul>

        {children}
      </m.div>
    </section>
  );
}

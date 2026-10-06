'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import { m } from 'motion/react';
import type { InvitePerson } from '@/content/invites';
import { DURATION, EASE } from '@/styles/motion';
import { GoldDivider } from './GoldDivider';
import { HangingBells, type HangingBellsColors } from './HangingBells';
import { HeartIcon } from './icons';
import { Mandala } from './Mandala';
import { RevealLine, fadeUp, lineGroup } from './RevealLines';
import { sectionVars, type SectionColors } from './sectionTheme';

const GOLD = (percent: number) => `color-mix(in srgb, var(--invite-metal) ${percent}%, transparent)`;

const header = lineGroup(0.1);
const person = lineGroup(0.05);

const pop = {
  hidden: { opacity: 0, scale: 0.4 },
  shown: { opacity: 1, scale: 1, transition: { duration: DURATION.slow, ease: EASE.entrance } },
};

// The mandala swells out from behind the picture as the picture arrives.
const mandalaIn = {
  hidden: { opacity: 0, scale: 0.55 },
  shown: { opacity: 1, scale: 1, transition: { duration: 1.2, ease: EASE.entrance } },
};

// The backdrop every portrait stands on: a pale watercolour wash (rose and blue
// at the sides, a glow behind the figure). A cut-out portrait shows it through.
const WASH = [
  'radial-gradient(circle at 8% 80%, rgba(232,160,160,0.4), transparent 42%)',
  'radial-gradient(circle at 6% 36%, rgba(140,184,224,0.36), transparent 40%)',
  'radial-gradient(circle at 94% 72%, rgba(232,160,160,0.34), transparent 40%)',
  'radial-gradient(circle at 92% 28%, rgba(140,184,224,0.3), transparent 38%)',
  'radial-gradient(ellipse at 50% 42%, rgba(255,253,244,0.95), transparent 62%)',
  'linear-gradient(170deg, #fbf3df, #f0e0bc)',
].join(', ');

export interface CouplePerson extends InvitePerson {
  /** The name to show. */
  name: string;
}

export interface MeetTheCoupleProps {
  groom: CouplePerson;
  bride: CouplePerson;
  /** The small tracked line above the title. */
  eyebrow?: string;
  title?: string;
  /** The tracked words over each name. */
  groomLabel?: string;
  brideLabel?: string;
  /** What the empty frame says when a person has no picture yet. */
  groomPhotoLabel?: string;
  bridePhotoLabel?: string;
  /** What the portraits stand on, inside the frame: any CSS background. Defaults to a pale watercolour wash with a faint gold arch; a cut-out picture shows it through. */
  portraitBackdrop?: string;
  /** The italic line under each name when the person has none of their own. */
  groomBlessing?: string;
  brideBlessing?: string;
  /** Artwork centred on the section's top edge, drawn behind whatever covers that edge (a torn sheet, say): the half of it above the edge stays hidden and the lower half shows, rising out from under it. The header makes room for it. */
  topArt?: ReactNode;
  /** The strings of bells hanging in the top corners. `false` leaves them out; pass colours to re-tint them. */
  bells?: false | Partial<HangingBellsColors>;
  /** Fill of the picture frames and of the family lines. Any CSS background; defaults to `colors.raised`. */
  cardBackground?: string;
  /** The section's own background: any CSS background. Leave it transparent on a page that has its own paper. */
  background?: string;
  /** Palette. The mandalas and the names take it too. */
  colors?: Partial<SectionColors>;
}

/**
 * "Meet the couple": under hanging bells that swing left and right, a title and
 * a divider, then the groom and the bride one after the other. Each is a picture
 * in a leaf-cornered frame with a gold mandala turning slowly behind it, half
 * hidden by the frame and cut off by the page's edge — on the groom's right,
 * turning clockwise; on the bride's left, turning the other way — then a tracked
 * label, the name, an italic blessing and a family line in a card with a gold
 * edge. The frame has a backdrop of its own (a pale wash and a faint arch) that a
 * cut-out portrait stands on; a person with no picture gets "Groom Photo" /
 * "Bride Photo" written in it.
 *
 * Reveals on scroll: the header lines rise, then each person's frame rises while
 * the mandala swells out from behind it. Palette, background and card fill are
 * props, so it sits on ivory paper or a night sky.
 */
export function MeetTheCouple({
  groom,
  bride,
  eyebrow = 'Beginning of Forever',
  title = 'Meet the Couple',
  groomLabel = 'The Groom',
  brideLabel = 'The Bride',
  groomPhotoLabel = 'Groom Photo',
  bridePhotoLabel = 'Bride Photo',
  portraitBackdrop,
  groomBlessing = 'With Divine Blessings…',
  brideBlessing = 'In the presence of love…',
  topArt,
  bells = {},
  cardBackground,
  background = 'transparent',
  colors,
}: MeetTheCoupleProps) {
  const card = cardBackground ?? 'var(--surface-raised)';

  return (
    <section style={{ ...sectionVars(colors), background }} className={`relative overflow-hidden px-5 pb-16 ${topArt ? 'pt-32' : 'pt-16'}`}
    >
      {topArt && (
        <m.div
          initial={{ opacity: 0, y: -60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.4, ease: EASE.entrance }}
          className="pointer-events-none absolute left-[50%] top-[14px]"
          style={{ translate: '-50% -50%' }}
        >
          {topArt}
        </m.div>
      )}

      {bells && (
        <>
          <HangingBells colors={bells} className="absolute left-[2%] top-[0] w-[84px]" />
          <HangingBells mirror colors={bells} className="absolute right-[2%] top-[0] w-[84px]" />
        </>
      )}

      <m.div
        variants={header}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.4 }}
        className="relative mx-auto flex w-full max-w-[420px] flex-col items-center pt-8 text-center"
      >
        <m.p variants={fadeUp} className="invite-eyebrow text-invite-metal">
          {eyebrow}
        </m.p>
        <div className="mt-4">
          <RevealLine className="invite-title italic text-invite-ink">{title}</RevealLine>
        </div>
        <GoldDivider className="mt-4" />
      </m.div>

      <div className="relative mx-auto mt-12 flex w-full max-w-[420px] flex-col items-center gap-12">
        <PersonCard
          person={groom}
          side="groom"
          label={groomLabel}
          photoLabel={groomPhotoLabel}
          blessing={groomBlessing}
          card={card}
          backdrop={portraitBackdrop}
        />
        <m.span
          variants={pop}
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, amount: 1 }}
          aria-hidden
          className="text-invite-metal"
        >
          <HeartIcon className="h-[22px] w-[22px]" />
        </m.span>
        <PersonCard
          person={bride}
          side="bride"
          label={brideLabel}
          photoLabel={bridePhotoLabel}
          blessing={brideBlessing}
          card={card}
          backdrop={portraitBackdrop}
        />
      </div>
    </section>
  );
}

function PersonCard({
  person: p,
  side,
  label,
  photoLabel,
  blessing,
  card,
  backdrop,
}: {
  person: CouplePerson;
  side: 'groom' | 'bride';
  label: string;
  photoLabel: string;
  blessing: string;
  card: string;
  backdrop?: string;
}) {
  const groomSide = side === 'groom';
  // Leaf corners: the two that face the mandala are the round ones.
  const corners = groomSide
    ? 'rounded-tl-[44px] rounded-br-[44px] rounded-tr-md rounded-bl-md'
    : 'rounded-tr-[44px] rounded-bl-[44px] rounded-tl-md rounded-br-md';
  const inner = groomSide
    ? 'rounded-tl-[38px] rounded-br-[38px] rounded-tr-sm rounded-bl-sm'
    : 'rounded-tr-[38px] rounded-bl-[38px] rounded-tl-sm rounded-br-sm';

  return (
    <m.article
      variants={person}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.3 }}
      className="relative flex w-full flex-col items-center text-center"
    >
      <div className="relative w-[58%] max-w-[240px]">
        {/* The mandala, behind the frame: on the groom's right, the bride's left. It
            reaches out only as far as the page has room for, so no edge of it is cut off. */}
        <m.div
          variants={mandalaIn}
          className={`absolute top-[6%] w-[100%] ${groomSide ? '-right-[42%]' : '-left-[42%]'}`}
        >
          <Mandala turn={groomSide ? 'cw' : 'ccw'} color="var(--invite-metal)" />
        </m.div>

        <m.div
          variants={fadeUp}
          className={`relative aspect-[4/5] p-[6px] shadow-[0_14px_34px_rgba(90,60,20,0.2)] ${corners}`}
          style={{ background: card }}
        >
          <div className={`relative h-full overflow-hidden ${inner}`} style={{ background: backdrop ?? WASH }}>
            {/* A faint gold arch behind the figure, on the default backdrop. */}
            {!backdrop && (
              <svg
                aria-hidden
                viewBox="0 0 200 250"
                preserveAspectRatio="xMidYMid slice"
                className="absolute inset-[0] h-full w-full"
                fill="none"
                stroke="var(--invite-metal)"
                strokeOpacity="0.4"
                strokeWidth="1"
              >
                <path d="M34 250V104A66 66 0 0 1 166 104V250" />
                <path d="M46 250V108A54 54 0 0 1 154 108V250" strokeOpacity="0.55" />
                <path d="M100 28l2.4 6.6 6.6 2.4-6.6 2.4-2.4 6.6-2.4-6.6-6.6-2.4 6.6-2.4z" fill="var(--invite-metal)" stroke="none" fillOpacity="0.6" />
              </svg>
            )}
            {p.image ? (
              <Image
                src={p.image}
                alt={p.name}
                fill
                sizes="(min-width: 480px) 240px, 58vw"
                className="object-cover"
                style={{ objectPosition: '50% 20%' }}
              />
            ) : (
              <span className="display-md relative flex h-full items-center justify-center px-4 text-center italic text-invite-metal">
                {photoLabel}
              </span>
            )}
          </div>
        </m.div>
      </div>

      <m.p variants={fadeUp} className="invite-eyebrow mt-8 text-invite-metal">
        {label}
      </m.p>
      <div className="mt-3">
        <RevealLine className="display-lg italic text-invite-ink">{p.name}</RevealLine>
      </div>
      <m.p variants={fadeUp} className="body-sm mt-1 italic text-invite-metal">
        {p.blessing ?? blessing}
      </m.p>

      {p.family && (
        <m.p
          variants={fadeUp}
          className={`body-sm mt-6 w-full max-w-[300px] rounded-md px-5 py-4 text-ink-body shadow-sm ${
            groomSide ? 'border-r-[4px]' : 'border-l-[4px]'
          }`}
          style={{ background: card, borderColor: 'var(--invite-metal)' }}
        >
          {p.family}
        </m.p>
      )}
    </m.article>
  );
}

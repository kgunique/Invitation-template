'use client';

import Image from 'next/image';
import { m } from 'motion/react';
import { EASE } from '@/styles/motion';
import { formatDay } from './dates';
import { MarryMeCredit } from './MarryMeCredit';
import { Petals } from './Petals';
import { RevealLine, fadeUp, lineGroup } from './RevealLines';
import { sectionVars, type SectionColors } from './sectionTheme';
import { Starfield } from './Starfield';

// Hearts in a few reds, so the shower isn't one flat colour.
const DEFAULT_HEARTS = ['#e11d48', '#f43f5e', '#be123c', '#fb7185'];

const group = lineGroup(0.1);

const artIn = {
  hidden: { opacity: 0, scale: 0.96, y: 20 },
  shown: { opacity: 1, scale: 1, y: 0, transition: { duration: 1, ease: EASE.entrance } },
};

const SIL = 'color-mix(in srgb, var(--surface-raised) 35%, #000)';

/** The drawn artwork: a doorway-shaped double frame under a starry sky, planets
 * and a crescent moon, and — when there is no portrait to put at its foot — a
 * couple's silhouette. It uses the section's accent and `--surface-raised`, so
 * it follows the palette. */
function StarryArch({ silhouette }: { silhouette: boolean }) {
  const sparkle = (x: number, y: number, s = 1) =>
    `M${x} ${y - 3 * s}l${1 * s} ${2 * s} ${2 * s} ${1 * s}-${2 * s} ${1 * s}-${1 * s} ${2 * s}-${1 * s}-${2 * s}-${2 * s}-${1 * s} ${2 * s}-${1 * s}z`;
  return (
    <svg
      viewBox="0 0 300 450"
      aria-hidden
      className="absolute inset-[0] h-full w-full text-invite-metal"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {/* The doorway, in two lines, filled a shade lighter than the sky. */}
      <path d="M24 440V160a126 126 0 0 1 252 0V440z" fill="var(--surface-raised)" fillOpacity="0.55" />
      <path d="M34 434V162a116 116 0 0 1 232 0V434" strokeOpacity="0.45" />
      <path d="M10 440H290" strokeOpacity="0.6" />

      {/* A crescent moon and a small planet up in the corners. */}
      <path d="M44 56A14 14 0 1 0 50 82A11 11 0 1 1 44 56Z" />
      <circle cx="268" cy="70" r="11" fill="var(--surface-raised)" />
      <ellipse cx="268" cy="70" rx="19" ry="4.5" transform="rotate(-18 268 70)" strokeOpacity="0.7" />

      {/* Two planets at the doorway's feet. */}
      <circle cx="40" cy="418" r="28" fill="var(--surface-raised)" />
      <ellipse cx="40" cy="418" rx="46" ry="11" transform="rotate(-18 40 418)" strokeOpacity="0.8" />
      <circle cx="262" cy="412" r="22" fill="var(--surface-raised)" />
      <ellipse cx="262" cy="412" rx="36" ry="9" transform="rotate(15 262 412)" strokeOpacity="0.8" />

      <g fill="currentColor" stroke="none">
        <path d={sparkle(150, 14, 1.6)} />
        <path d={sparkle(22, 130)} />
        <path d={sparkle(282, 150)} />
        <path d={sparkle(60, 250, 0.8)} />
        <path d={sparkle(244, 280, 0.8)} />
      </g>

      {/* The couple, hand in hand. */}
      {silhouette && (
        <>
          <g transform="translate(0 30)" stroke="none" style={{ fill: SIL }}>
            <circle cx="134" cy="338" r="6.5" />
            <path d="M126 347Q134 343 142 347L144 384H139V404H135L134 388L133 404H129V384H124Z" />
            <circle cx="166" cy="340" r="6.5" />
            <circle cx="166" cy="333" r="3.5" />
            <path d="M166 348Q160 351 159 360L151 404H187L174 360Q172 351 166 348Z" />
          </g>
          <path d="M143 396Q151 402 160 396" strokeOpacity="0.5" />
        </>
      )}
    </svg>
  );
}

export interface ArchClosingProps {
  bride: string;
  groom: string;
  /** ISO timestamp with offset. Printed under the names. */
  weddingDate?: string;
  /** IANA zone the date is shown in. */
  timeZone?: string;
  /** The italic line at the top of the frame. */
  tagline?: string;
  /** The couple's picture, shown small in an arched cameo at the foot of the
   * frame. Omit and a drawn silhouette of a couple stands there instead. */
  portrait?: string;
  /** CSS object-position, for centring the couple in the cameo. */
  portraitFocus?: string;
  /** The falling hearts' colours (one or several). `false` for none. */
  hearts?: string[] | false;
  /** The section's own background: any CSS background. Leave it transparent on a page that has its own sky. */
  background?: string;
  /** Palette. Defaults to the Silver cream/plum; a night page passes its own. */
  colors?: Partial<SectionColors>;
}

/**
 * The last thing on a night page: an arched frame under a field of twinkling
 * stars, planets and a crescent moon drawn around it — a tagline, the couple's
 * names, the date and the shared <MarryMeCredit /> set inside it, and at its
 * foot a small arched cameo of the couple's picture (`portrait`; a silhouette
 * if none is given). Red hearts rain down the whole section, each popping into
 * being as it starts to fall and bursting like a bubble at the end (`Petals`
 * with `shape="heart" pop fit`). Reveals on scroll: the frame floats up, then
 * the lines of text rise one after another, then the cameo. The bottom padding
 * is the room for the floating Order Now bar.
 */
export function ArchClosing({
  bride,
  groom,
  weddingDate,
  timeZone = 'Asia/Kolkata',
  tagline = 'We will be so happy if you come',
  portrait,
  portraitFocus = '45% 40%',
  hearts = DEFAULT_HEARTS,
  background = 'transparent',
  colors,
}: ArchClosingProps) {
  return (
    <section style={{ ...sectionVars(colors), background }} className="relative overflow-hidden px-5 pb-32 pt-8">
      <m.div
        variants={group}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.25 }}
        className="relative mx-auto aspect-[300/450] w-full max-w-[340px]"
      >
        <m.div variants={artIn} className="absolute inset-[0]">
          <Starfield count={50} constellations={false} color="var(--invite-ink)" />
          <StarryArch silhouette={!portrait} />
        </m.div>

        {/* The words, in the upper part of the frame where it is widest. */}
        <div className="absolute inset-x-[0] top-[20%] flex flex-col items-center px-12 text-center">
          <m.p variants={fadeUp} className="display-md italic text-invite-metal">
            {tagline}
          </m.p>
          <div className="mt-5">
            <RevealLine className="display-md uppercase tracking-[0.15em] text-invite-ink">
              {groom} &amp; {bride}
            </RevealLine>
          </div>
          <m.p variants={fadeUp} aria-hidden className="caption mt-2 tracking-[0.5em] text-ink-muted">
            ☾ • ☽
          </m.p>
          {weddingDate && (
            <m.p variants={fadeUp} className="body-sm mt-2 uppercase tracking-[0.2em] text-ink-body">
              {formatDay(weddingDate, timeZone)}
            </m.p>
          )}
          <div className="mt-5">
            <MarryMeCredit heart={false} compact />
          </div>
        </div>

        {/* The couple's picture, small, in an arched cameo at the foot of the frame
            (a wrapper centres it, so Framer's own transform has the element to itself). */}
        {portrait && (
          <div className="absolute inset-x-[0] bottom-[3.5%] flex justify-center">
            <m.div
              variants={fadeUp}
              className="relative h-[120px] w-[96px] overflow-hidden border shadow-lg"
              style={{
                borderRadius: '48px 48px 10px 10px',
                borderColor: 'color-mix(in srgb, var(--invite-metal) 60%, transparent)',
              }}
            >
              <Image
                src={portrait}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
                style={{ objectPosition: portraitFocus }}
              />
            </m.div>
          </div>
        )}
      </m.div>

      {/* Hearts over the whole section, falling from its top edge to its bottom. */}
      {hearts && <Petals shape="heart" pop fit color={hearts} count={16} speed={0.8} size={[10, 18]} />}
    </section>
  );
}

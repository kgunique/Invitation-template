'use client';

import type { ReactNode } from 'react';
import { m } from 'motion/react';
import { Lotus } from './FloatingFlora';
import { hindiBody, hindiDisplay } from './hindiFonts';
import { NIGHT_GLASS, nightGlassVars, type NightGlassColors } from './nightGlass';

export interface PoeticInviteSectionProps {
  quote?: string;
  title?: string;
  verses?: string[];
  signOff?: string;
  lang?: string;
  /** The faint picture in the card's lower right corner; `false` for none. Defaults to a gold lotus. */
  watermark?: ReactNode | false;
  displayClassName?: string;
  bodyClassName?: string;
  colors?: Partial<NightGlassColors>;
  className?: string;
}

const DEFAULT_QUOTE = 'प्रेम एक अद्भुत अहसास है, जो दो आत्माओं को एक करता है और जीवन को सुंदर बनाता है।';
const DEFAULT_TITLE = '|| स्नेह निमंत्रण ||';
const DEFAULT_VERSES = [
  'चाँदनी रात है और तारों की बारात है,',
  'आज हमारे आँगन में मंगल उत्सव और मधुर गान है।',
  'स्नेह के पावन बंधन में बंधा यह पवित्र मिलन,',
  'आशीर्वाद देने अवश्य पधारें, यही हमारा मान और सम्मान है।',
];
const DEFAULT_SIGNOFF = '- हार्दिक निमंत्रण';

/** The ✿ on the card's top and bottom edge. */
const EMBLEM =
  'absolute left-1/2 -translate-x-1/2 z-10 flex h-7 w-7 items-center justify-center rounded-pill border border-[color-mix(in_srgb,var(--ng-gold)_80%,transparent)] bg-[var(--ng-card)] text-[13px] text-[color:var(--ng-gold)] shadow-[0_0_10px_color-mix(in_srgb,var(--ng-gold)_60%,transparent)]';

/**
 * PoeticInviteSection — Auspicious poetic wedding invitation verse ("स्नेह निमंत्रण" / Tahuko).
 * Features a top philosophical quote on love, a double-golden-bordered card with floral rosettes,
 * a faint sacred lotus watermark, and traditional poetic invitation stanzas in Hindi.
 */
export function PoeticInviteSection({
  quote = DEFAULT_QUOTE,
  title = DEFAULT_TITLE,
  verses = DEFAULT_VERSES,
  signOff = DEFAULT_SIGNOFF,
  lang = 'hi',
  watermark,
  displayClassName = hindiDisplay.className,
  bodyClassName = hindiBody.className,
  colors,
  className = '',
}: PoeticInviteSectionProps) {
  const c = { ...NIGHT_GLASS, ...colors };
  const mark =
    watermark === undefined ? (
      <Lotus className="w-full h-full" outer={['#fbd38d', c.gold]} inner={['#fff8e7', '#f6ad55']} />
    ) : (
      watermark
    );

  return (
    <section lang={lang} style={nightGlassVars(c)} className={`relative z-10 w-full mb-16 text-center ${className}`}>
      {/* 1. Top Quote in Golden Serif */}
      {quote && (
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-8 px-4"
        >
          <p
            className={`${displayClassName} text-[18px] sm:text-[22px] font-medium leading-[1.65] text-[color:var(--ng-gold)] drop-shadow-[0_2px_12px_color-mix(in_srgb,var(--ng-gold)_40%,transparent)] max-w-md mx-auto`}
          >
            &ldquo;{quote}&rdquo;
          </p>
        </m.div>
      )}

      {/* 2. Double-Bordered Poetic Invitation Card */}
      <m.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative mx-auto w-full max-w-[440px]"
      >
        {/* Outer Golden Border & Translucent Dark Glass */}
        <div className="relative rounded-[24px] border border-[color-mix(in_srgb,var(--ng-gold)_60%,transparent)] bg-[color-mix(in_srgb,var(--ng-card)_85%,transparent)] p-2 sm:p-[10px] shadow-[0_8px_32px_rgba(0,0,0,0.65)] backdrop-blur-md">
          <div aria-hidden className={`${EMBLEM} -top-[13px]`}>
            ✿
          </div>

          {/* Inner Golden Concentric Border */}
          <div className="relative rounded-[17px] border border-[color-mix(in_srgb,var(--ng-gold)_40%,transparent)] px-5 sm:px-8 py-9 sm:py-11 overflow-hidden">
            {mark && (
              <div
                aria-hidden
                className="pointer-events-none absolute -right-[24px] -bottom-[24px] w-[180px] h-[180px] opacity-[0.14] select-none"
              >
                {mark}
              </div>
            )}

            <h3
              className={`${displayClassName} text-[26px] sm:text-[30px] font-bold tracking-normal text-[color:var(--ng-gold)] drop-shadow-[0_2px_10px_color-mix(in_srgb,var(--ng-gold)_55%,transparent)] mb-6`}
            >
              {title}
            </h3>

            {/* Poem Verses */}
            <div className="space-y-2 relative z-10">
              {verses.map((line, idx) => (
                <p
                  key={idx}
                  className={`${bodyClassName} text-[16px] sm:text-[18px] font-medium leading-[1.9] text-[color:var(--ng-ink)] drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]`}
                >
                  {line}
                </p>
              ))}
            </div>

            {signOff && (
              <div className="mt-7 text-right pr-2 sm:pr-4 relative z-10">
                <p
                  className={`${bodyClassName} text-[16px] sm:text-[18px] font-semibold text-[color:var(--ng-gold)] tracking-normal drop-shadow-[0_0_8px_color-mix(in_srgb,var(--ng-gold)_60%,transparent)]`}
                >
                  {signOff}
                </p>
              </div>
            )}
          </div>

          <div aria-hidden className={`${EMBLEM} -bottom-[13px]`}>
            ✿
          </div>
        </div>
      </m.div>
    </section>
  );
}

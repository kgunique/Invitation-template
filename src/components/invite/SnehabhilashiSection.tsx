'use client';

import { m } from 'motion/react';
import { hindiBody, hindiDisplay } from './hindiFonts';
import { NIGHT_GLASS, nightGlassVars, type NightGlassColors } from './nightGlass';

export interface FamilyMember {
  relation: string;
  name: string;
}

export interface FamilySide {
  sideTitle: string;
  members: FamilyMember[];
}

export const DEFAULT_HINDI_SNEHABHILASHI: FamilySide[] = [
  {
    sideTitle: 'व र   प क्ष',
    members: [
      { relation: 'पिता', name: 'श्री किरणभाई कनाणी' },
      { relation: 'माता', name: 'श्रीमती उर्मिलाबेन कनाणी' },
      { relation: 'भाई', name: 'चिराग कनाणी' },
    ],
  },
  {
    sideTitle: 'क न्य़ा   प क्ष',
    members: [
      { relation: 'पिता', name: 'श्री हितेशभाई भावाला' },
      { relation: 'माता', name: 'श्रीमती गीताबेन भावाला' },
      { relation: 'भाई', name: 'भावेश भावाला' },
    ],
  },
];

export interface SnehabhilashiSectionProps {
  title?: string;
  sides?: FamilySide[];
  lang?: string;
  displayClassName?: string;
  bodyClassName?: string;
  colors?: Partial<NightGlassColors>;
  className?: string;
}

const riseCard = {
  hidden: { opacity: 0, y: 32 },
  shown: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/**
 * SnehabhilashiSection — Auspicious Family Well-Wishers Section (|| स्नेहाभिलाषी ||) in Hindi
 *
 * Displays groom's family (वर पक्ष) and bride's family (कन्या पक्ष)
 * in elegant celestial glassmorphism cards with golden role badges and crisp white serif names.
 */
export function SnehabhilashiSection({
  title = '|| स्नेहाभिलाषी ||',
  sides = DEFAULT_HINDI_SNEHABHILASHI,
  lang = 'hi',
  displayClassName = hindiDisplay.className,
  bodyClassName = hindiBody.className,
  colors,
  className = '',
}: SnehabhilashiSectionProps) {
  const c = { ...NIGHT_GLASS, ...colors };

  return (
    <section lang={lang} style={nightGlassVars(c)} className={`relative z-10 w-full mb-16 px-4 ${className}`}>
      <div className="text-center mb-8">
        <h2
          className={`${displayClassName} text-[28px] sm:text-[34px] font-bold text-[color:var(--ng-ink)] tracking-wider drop-shadow-[0_2px_14px_color-mix(in_srgb,var(--ng-gold)_55%,transparent)]`}
        >
          {title}
        </h2>
      </div>

      <div className="max-w-[440px] mx-auto space-y-6">
        {sides.map((side, sIdx) => (
          <m.div
            key={sIdx}
            variants={riseCard}
            initial="hidden"
            whileInView="shown"
            viewport={{ once: true, amount: 0.2 }}
            className="relative rounded-[16px] sm:rounded-[24px] border border-[color-mix(in_srgb,var(--ng-gold)_35%,transparent)] bg-[color-mix(in_srgb,var(--ng-card)_85%,transparent)] backdrop-blur-md p-5 sm:p-6 shadow-[0_12px_36px_rgba(0,0,0,0.7)] overflow-hidden"
          >
            {/* Subtle inner top glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(to_bottom,color-mix(in_srgb,var(--ng-glow)_15%,transparent),transparent)]"
            />

            <div className="relative text-center mb-4 z-10">
              <h3
                className={`${displayClassName} text-[20px] sm:text-[22px] font-semibold text-[color:var(--ng-bright)] tracking-[0.25em] drop-shadow-[0_1px_8px_color-mix(in_srgb,var(--ng-bright)_40%,transparent)]`}
              >
                {side.sideTitle}
              </h3>
              <span
                aria-hidden
                className="block mx-auto mt-2 h-[2px] w-[38px] rounded-pill bg-[var(--ng-gold)] shadow-[0_0_8px_var(--ng-bright)]"
              />
            </div>

            <div className="relative z-10 space-y-3">
              {side.members.map((member, mIdx) => (
                <div
                  key={mIdx}
                  className="rounded-xl sm:rounded-[16px] bg-[color-mix(in_srgb,var(--ng-deep)_90%,transparent)] border border-[color-mix(in_srgb,var(--ng-glow)_25%,transparent)] hover:border-[color-mix(in_srgb,var(--ng-gold)_60%,transparent)] transition-colors duration-300 py-3.5 px-4 text-center shadow-md"
                >
                  <p className={`${bodyClassName} text-[14px] sm:text-[15px] font-medium text-[color:var(--ng-bright)] tracking-wide mb-0.5`}>
                    {member.relation}
                  </p>
                  <p className={`${displayClassName} text-[18px] sm:text-[20px] font-medium text-[color:var(--ng-ink)] tracking-normal drop-shadow-sm`}>
                    {member.name}
                  </p>
                </div>
              ))}
            </div>
          </m.div>
        ))}
      </div>
    </section>
  );
}

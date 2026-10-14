'use client';

import { m } from 'motion/react';
import { hindiBody, hindiDisplay } from './hindiFonts';

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
  className = '',
}: SnehabhilashiSectionProps) {
  return (
    <section
      lang="hi"
      className={`relative z-10 w-full mb-16 px-4 ${className}`}
    >
      {/* 1. Main Heading: || स्नेहाभिलाषी || */}
      <div className="text-center mb-8">
        <h2
          className={`${hindiDisplay.className} text-[28px] sm:text-[34px] font-bold text-[#ffffff] tracking-wider drop-shadow-[0_2px_14px_rgba(230,190,96,0.55)]`}
        >
          {title}
        </h2>
      </div>

      {/* 2. Side Cards Container */}
      <div className="max-w-[440px] mx-auto space-y-6">
        {sides.map((side, sIdx) => (
          <m.div
            key={sIdx}
            variants={riseCard}
            initial="hidden"
            whileInView="shown"
            viewport={{ once: true, amount: 0.2 }}
            className="relative rounded-2xl sm:rounded-3xl border border-[#e6be60]/35 bg-[#061129]/85 backdrop-blur-md p-5 sm:p-6 shadow-[0_12px_36px_rgba(0,0,0,0.7)] overflow-hidden"
          >
            {/* Subtle inner top glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-purple-500/15 to-transparent"
            />

            {/* Category Title: व र   प क्ष / क न्य़ा   प क्ष */}
            <div className="relative text-center mb-4 z-10">
              <h3
                className={`${hindiDisplay.className} text-[20px] sm:text-[22px] font-semibold text-[#ffd875] tracking-[0.25em] drop-shadow-[0_1px_8px_rgba(255,216,117,0.4)]`}
              >
                {side.sideTitle}
              </h3>
              {/* Short Golden Accent Bar */}
              <span
                aria-hidden
                className="block mx-auto mt-2 h-[2px] w-[38px] rounded-pill bg-[#e6be60] shadow-[0_0_8px_#ffd875]"
              />
            </div>

            {/* Stacked Member Boxes */}
            <div className="relative z-10 space-y-3">
              {side.members.map((member, mIdx) => (
                <div
                  key={mIdx}
                  className="rounded-xl sm:rounded-2xl bg-[#040c1e]/90 border border-purple-500/25 hover:border-[#e6be60]/60 transition-colors duration-300 py-3.5 px-4 text-center shadow-md group"
                >
                  {/* Relation Label: पिता / माता / भाई */}
                  <p
                    className={`${hindiBody.className} text-[14px] sm:text-[15px] font-medium text-[#ffd875] tracking-wide mb-0.5`}
                  >
                    {member.relation}
                  </p>
                  {/* Member Name: श्री किरणभाई कनाणी */}
                  <p
                    className={`${hindiDisplay.className} text-[18px] sm:text-[20px] font-medium text-[#ffffff] tracking-normal drop-shadow-sm group-hover:text-[#fff9eb] transition-colors`}
                  >
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

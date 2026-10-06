'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import { TierBadge } from '@/components/ui/TierBadge';
import { HERO_SLIDES, slideInitials, slideSlug } from './heroSlides';
import { CheckIcon, MusicIcon, PinIcon, PlayIcon } from './icons';

const TINTS = {
  mehendi: 'bg-mehendi-100 text-mehendi-700',
  peacock: 'bg-peacock-100 text-peacock-700',
  rani: 'bg-rani-100 text-rani-700',
} as const;

/** Controlled by Hero, which owns the autoplay timer — both this and the
 * "Watch a live preview" button must open the same slide's route. */
export function PhoneShowcase({
  activeIndex,
  onSelectIndex,
}: {
  activeIndex: number;
  onSelectIndex: (index: number) => void;
}) {
  const slide = HERO_SLIDES[activeIndex];
  const slug = slideSlug(slide);

  return (
    <div className="relative mx-auto w-full max-w-[220px]">
      <div className="relative aspect-[9/18.5] w-full rounded-[40px] border-[6px] border-ink-strong bg-ink-strong shadow-lg">
        <div className="relative h-full w-full overflow-hidden rounded-[32px] bg-invite-ground">
          <div className="absolute left-1/2 top-[0] z-content h-5 w-24 -translate-x-1/2 rounded-b-lg bg-ink-strong" />

          {/* A real invite fills the screen and brings its own controls, so the
              placeholder's tier badge and music chip would sit on top of them. */}
          {!slide.screen && (
            <>
              {/* Fixed to the screen's own corners, not floating outside the frame. */}
              <div className="absolute left-3 top-3 z-content">
                <TierBadge tier={slide.tier} />
              </div>
              <span className="absolute right-3 top-3 z-content flex h-[36px] w-[36px] items-center justify-center rounded-pill bg-[color-mix(in_srgb,var(--surface-raised)_90%,transparent)] text-peacock-700 shadow-sm">
                <span className="amb-spin-slow flex">
                  <MusicIcon />
                </span>
              </span>
            </>
          )}

          {slide.screen ? (
            <div key={activeIndex} className="slide-fade-in absolute inset-[0]">
              <Image
                src={slide.screen}
                alt={`${slide.bride} & ${slide.groom}'s invitation`}
                fill
                sizes="220px"
                className="object-cover object-top"
              />
            </div>
          ) : (
            <div
              key={activeIndex}
              className="slide-fade-in flex h-full flex-col items-center justify-center gap-4 px-6 text-center"
            >
              <span className="display-md flex h-16 w-16 items-center justify-center rounded-pill border-[1.5px] border-invite-metal bg-surface-raised text-invite-ink">
                {slideInitials(slide)}
              </span>
              <p className="invite-eyebrow text-invite-ink-soft">The wedding of</p>
              <p className="festive-md text-invite-ink">
                {slide.bride} &amp; {slide.groom}
              </p>
              <p className="label text-invite-metal">{slide.venue}</p>
            </div>
          )}

          {/* Hardcoded route for now — becomes real once templates are dynamic. */}
          <a
            href={`/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="action absolute inset-x-4 bottom-4 z-content flex items-center justify-center gap-2 rounded-pill bg-surface-raised py-2 text-ink-strong no-underline shadow-md"
          >
            <PlayIcon /> Open full screen
          </a>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSelectIndex(i)}
            aria-label={`Show slide ${i + 1}`}
            aria-current={i === activeIndex}
            className="p-1"
          >
            <span
              className={`block h-[6px] w-[6px] rounded-pill transition-colors ${
                i === activeIndex ? 'bg-invite-metal' : 'bg-line-firm'
              }`}
            />
          </button>
        ))}
      </div>

      <FeatureChip className="-left-10 top-[38%]" tint="mehendi" icon={<CheckIcon />} label="Instant RSVP" />
      <FeatureChip
        className="-top-2 -right-12"
        tint="peacock"
        animate="amb-bounce"
        icon={<MusicIcon />}
        label="Background music"
      />
      <FeatureChip className="-right-10 bottom-24" tint="rani" icon={<PinIcon />} label="Google Maps venue" />
    </div>
  );
}

function FeatureChip({
  icon,
  label,
  tint,
  className = '',
  animate = '',
}: {
  icon: ReactNode;
  label: string;
  tint: keyof typeof TINTS;
  className?: string;
  animate?: string;
}) {
  return (
    <div
      className={`absolute z-content hidden items-center gap-[6px] whitespace-nowrap rounded-pill bg-surface-raised px-2 py-[6px] shadow-md sm:flex ${animate} ${className}`}
    >
      <span className={`flex h-[22px] w-[22px] items-center justify-center rounded-pill ${TINTS[tint]}`}>
        {icon}
      </span>
      <span className="caption font-bold text-ink-strong">{label}</span>
    </div>
  );
}

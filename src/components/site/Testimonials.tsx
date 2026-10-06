'use client';

import { SectionHeading } from './SectionHeading';
import { CarouselArrows } from './CarouselArrows';
import { FloralCorners } from './FloralAtmosphere';
import { HeartIcon, MuteIcon, PlayIcon } from './icons';
import { useCarousel } from './useCarousel';

const TESTIMONIALS = [
  {
    name: 'Meera R.',
    quote:
      'The gate-opening reveal had every guest gasp out loud — it felt like a real cinematic moment, not just a webpage.',
  },
  {
    name: 'Kunal S.',
    quote:
      'Every detail was customised for our ceremony, down to the ambient music. Guests kept asking who built it for us.',
  },
  {
    name: 'Aditi & Rohan',
    quote:
      'Sharing one link on WhatsApp instead of a hundred photos made the whole family feel included, wherever they were.',
  },
  {
    name: 'Rhea D.',
    quote: 'The RSVP tracking alone saved us hours — no more chasing forty relatives on the phone.',
  },
  {
    name: 'Vivaan & Sana',
    quote: 'Guests kept replaying the gate animation just to show their friends. It set the tone for the whole wedding.',
  },
  {
    name: 'Arjun M.',
    quote: 'Loading the invite on my grandmother’s phone and watching her face light up made it worth every rupee.',
  },
] as const;

const VISIBLE_COUNT = 3;

/** No real video files yet, so each card is a static placeholder panel.
 * Three stories per row, but the arrows step by one — a sliding window that
 * wraps around — not by a full page of three. */
export function Testimonials() {
  const { visible, direction, startIndex, go } = useCarousel(TESTIMONIALS, VISIBLE_COUNT);

  return (
    <div className="relative overflow-hidden">
      <FloralCorners corner="both" />

      <section className="relative z-content py-8 sm:py-10">
      <div className="mx-auto max-w-[1200px] px-4">
        <SectionHeading
          eyebrow={
            <>
              <HeartIcon /> Client stories
            </>
          }
          title="What our happy couples say"
          subtitle="Memorable moments shared by couples who celebrated with Marry Me."
        />

        <div
          key={startIndex}
          className={`mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3 ${
            direction === 1 ? 'slide-in-from-right' : 'slide-in-from-left'
          }`}
        >
          {visible.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <CarouselArrows label="stories" onPrev={() => go(-1)} onNext={() => go(1)} />
        </div>
      </div>
      </section>
    </div>
  );
}

function TestimonialCard({ name, quote }: { name: string; quote: string }) {
  return (
    <div className="rounded-lg border border-[color-mix(in_srgb,var(--line-soft)_60%,transparent)] bg-[color-mix(in_srgb,var(--surface-raised)_70%,transparent)] p-3 shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[5/4] overflow-hidden rounded-md bg-ink-strong">
        <span className="absolute inset-[0] m-auto flex h-[44px] w-[44px] items-center justify-center rounded-pill bg-surface-raised text-ink-strong shadow-md">
          <PlayIcon />
        </span>
        <span className="label absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-pill bg-[color-mix(in_srgb,var(--ink-on-inverse)_15%,transparent)] px-2 py-1 text-ink-on-inverse">
          <MuteIcon /> Unmute
        </span>
      </div>
      <p className="mt-3 text-center text-[13px] italic leading-snug text-ink-body [font-family:var(--font-display)]">
        &ldquo;{quote}&rdquo;
      </p>
      <p className="label mt-2 text-center text-ink-muted">{name}</p>
    </div>
  );
}

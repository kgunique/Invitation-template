'use client';

import { CarouselArrows } from './CarouselArrows';
import { SectionHeading } from './SectionHeading';
import { StarIcon } from './icons';
import { useCarousel } from './useCarousel';

const REVIEWS = [
  {
    name: 'Priya S.',
    time: '2 days ago',
    rating: 5,
    text: 'From start to finish the process was seamless. The invitation turned out elegant and unforgettable.',
  },
  {
    name: 'Rohit M.',
    time: '1 week ago',
    rating: 5,
    text: 'The attention to detail was beyond our expectations — customised beautifully for our ceremony.',
  },
  {
    name: 'Ananya K.',
    time: '3 weeks ago',
    rating: 5,
    text: 'Our families are spread across three countries and everyone could open the invite instantly. Zero complaints.',
  },
  {
    name: 'Devansh P.',
    time: '1 month ago',
    rating: 4,
    text: 'Beautiful design and quick turnaround. Would have liked a couple more colour options for our tier.',
  },
] as const;

const VISIBLE_COUNT = 2;

/** Plain "guest reviews", not branded as any third-party platform — this is
 * placeholder content, and there's no real review integration behind it. A
 * sliding window of two, same carousel mechanics as Testimonials. */
export function Reviews() {
  const { visible, direction, startIndex, go } = useCarousel(REVIEWS, VISIBLE_COUNT);

  return (
    <section className="bg-surface-raised py-8 sm:py-10">
      <div className="mx-auto max-w-[1200px] px-4">
        <SectionHeading
          eyebrow={
            <>
              <StarIcon className="h-[14px] w-[14px]" /> Guest reviews
            </>
          }
          title="What our couples say"
          subtitle="A few words from couples who've already celebrated with us."
        />

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <ReviewsSummary />

          <div
            key={startIndex}
            className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2 ${
              direction === 1 ? 'slide-in-from-right' : 'slide-in-from-left'
            }`}
          >
            {visible.map((r) => (
              <ReviewCard key={r.name} {...r} />
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <CarouselArrows label="reviews" onPrev={() => go(-1)} onNext={() => go(1)} />
        </div>
      </div>
    </section>
  );
}

function ReviewsSummary() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-surface-sunken p-6 text-center">
      <span className="display-md flex h-[44px] w-[44px] items-center justify-center rounded-pill border-[1.5px] border-invite-metal bg-surface-raised italic text-ink-strong">
        M
      </span>
      <p className="body-sm mt-1 text-ink-strong">Marry Me</p>
      <p className="display-lg tabular text-ink-strong">5.0</p>
      <StarRow />
      <p className="caption text-ink-muted">Based on 120+ guest reviews</p>
    </div>
  );
}

function ReviewCard({ name, time, rating, text }: { name: string; time: string; rating: number; text: string }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('');

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[color-mix(in_srgb,var(--line-soft)_60%,transparent)] bg-[color-mix(in_srgb,var(--surface-raised)_70%,transparent)] p-5 shadow-md backdrop-blur-md">
      <div className="flex items-center gap-3">
        <span className="label flex h-[36px] w-[36px] items-center justify-center rounded-pill bg-surface-sunken text-ink-strong">
          {initials}
        </span>
        <div>
          <p className="body-sm text-ink-strong">{name}</p>
          <p className="caption text-ink-muted">{time}</p>
        </div>
      </div>
      <StarRow count={rating} />
      <p className="body-sm max-h-[80px] overflow-y-auto text-ink-body">{text}</p>
    </div>
  );
}

function StarRow({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-[2px] text-marigold-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} filled={i < count} />
      ))}
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FloralAtmosphere } from './FloralAtmosphere';
import { HERO_SLIDES, slideSlug } from './heroSlides';
import { PhoneShowcase } from './PhoneShowcase';
import { PlayIcon, SparkleIcon } from './icons';

const AUTOPLAY_MS = 4000;

/** Owns the slider index so the phone preview and the "Watch a live preview"
 * link — two separate components — always point at the same slide. */
export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Re-armed on every change, manual or automatic, so picking a dot doesn't
    // get immediately overridden by a tick already in flight.
    const id = setTimeout(() => {
      setActiveIndex((i) => (i + 1) % HERO_SLIDES.length);
    }, AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [activeIndex]);

  const activeSlug = slideSlug(HERO_SLIDES[activeIndex]);

  return (
    <div className="relative overflow-hidden">
      <FloralAtmosphere />

      <section className="relative z-content mx-auto grid max-w-[1200px] items-center gap-16 px-4 py-8 lg:h-[calc(100vh-80px)] lg:grid-cols-2 lg:py-[0]">
        <div className="min-w-0">
          <span className="label inline-flex items-center gap-2 rounded-pill bg-surface-sunken px-4 py-2 text-marigold-700">
            <SparkleIcon /> Handcrafted Indian wedding invitations
          </span>

          <h1 className="display-hero mt-6">
            Craft your dream
            <br />
            <span className="bg-gradient-to-r from-marigold-500 to-rani-500 bg-clip-text text-transparent">
              cinematic invitation
            </span>
          </h1>

          <p className="body-lg mt-6 max-w-[46ch] text-ink-body">
            Interactive digital invites with a gate-opening reveal, background music, live RSVPs
            and venue navigation — one category, done properly.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button variant="primary">Explore templates</Button>
            {/* Hardcoded route for now — synced to whichever slide is active in PhoneShowcase. */}
            <a
              href={`/${activeSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="action inline-flex items-center gap-3 rounded-pill bg-surface-raised py-2 pl-2 pr-5 text-ink-strong no-underline shadow-md"
            >
              <span className="flex h-[36px] w-[36px] items-center justify-center rounded-pill bg-surface-brand text-ink-on-brand">
                <PlayIcon />
              </span>
              Watch a live preview
            </a>
          </div>

          <Link href="/kitchen-sink" className="caption mt-4 inline-block text-ink-muted underline">
            Or browse the kitchen sink
          </Link>

          <dl className="mt-12 flex flex-wrap gap-10 border-t border-line-soft pt-8">
            <Stat value="500+" label="Happy couples" />
            <Stat value="24 hr" label="Fast delivery" />
            <Stat value="4.9" label="Average rating" />
          </dl>
        </div>

        <PhoneShowcase activeIndex={activeIndex} onSelectIndex={setActiveIndex} />
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dd className="display-md tabular text-ink-strong">{value}</dd>
      <dt className="caption uppercase text-ink-muted">{label}</dt>
    </div>
  );
}

import type { ReactNode } from 'react';
import { FloralCorners } from './FloralAtmosphere';
import { SectionHeading } from './SectionHeading';
import {
  BoltIcon,
  ChatIcon,
  ClockIcon,
  DownloadIcon,
  GlobeIcon,
  MobileIcon,
  MusicIcon,
  PaletteIcon,
  ShareIcon,
  SparkleIcon,
  StarIcon,
  UsersIcon,
} from './icons';

const FEATURES = [
  { icon: <BoltIcon />, title: 'Fast delivery', desc: 'Your personalised invitation link within 24 hours of sharing details.' },
  { icon: <PaletteIcon />, title: 'Full customisation', desc: 'Names, dates, venue and colours — all tailored to your vision.' },
  { icon: <MobileIcon />, title: 'Mobile optimised', desc: 'A flawless experience on every phone, tablet and screen size.' },
  { icon: <ChatIcon />, title: 'WhatsApp ready', desc: 'One beautiful link to share across WhatsApp, Instagram and email.' },
  { icon: <MusicIcon />, title: 'Ambient music', desc: 'Curated background music that plays along with the invitation.' },
  { icon: <UsersIcon />, title: 'RSVP tracking', desc: 'Built-in RSVP collection with a live guest list, no spreadsheets.' },
  { icon: <StarIcon />, title: 'Polished animation', desc: 'Smooth, considered motion that still respects reduced-motion settings.' },
  { icon: <ClockIcon />, title: 'Rush delivery', desc: 'Need it sooner? Rush delivery is available for urgent dates.' },
  { icon: <GlobeIcon />, title: 'Multi-language', desc: 'Gujarati, Hindi, English and more. Your language, your invitation.' },
  { icon: <DownloadIcon />, title: 'Share anywhere', desc: 'Works perfectly across all platforms, browsers and devices globally.' },
  { icon: <ShareIcon />, title: 'Easy ordering', desc: 'Simple four-step process. No technical knowledge required whatsoever.' },
] as const;

export function Features({
  eyebrow = 'Why Get Invites',
  title = 'Everything you need',
  subtitle,
  as,
}: {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  /** The heading level, h1 when the section opens a page of its own. */
  as?: 'h1' | 'h2';
}) {
  return (
    <div className="relative overflow-hidden">
      <FloralCorners corner="both" />

      <section className="relative z-content py-8 sm:py-10">
        <div className="mx-auto max-w-[1200px] px-4">
          <SectionHeading
            eyebrow={
              <>
                <SparkleIcon /> {eyebrow}
              </>
            }
            title={title}
            subtitle={subtitle}
            as={as}
          />

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-lg bg-surface-raised p-6 shadow-sm">
      <span className="flex h-[44px] w-[44px] items-center justify-center rounded-md bg-surface-sunken text-rani-700">
        {icon}
      </span>
      <p className="display-md mt-4 text-ink-strong">{title}</p>
      <p className="body-sm mt-2 text-ink-body">{desc}</p>
    </div>
  );
}

import Link from 'next/link';
import { FloralCorners } from './FloralAtmosphere';
import { SectionHeading } from './SectionHeading';
import { ArrowRightIcon, SparkleIcon } from './icons';

const STEPS = [
  { title: 'Choose a template', desc: 'Browse the collection and pick the tradition that matches your celebration.' },
  { title: 'Share your details', desc: 'Names, dates, venue and any customisation, through a simple form.' },
  { title: 'We craft it', desc: 'Every element — typography, photos, animation and music — personalised.' },
  { title: 'Share the magic', desc: 'Receive your link and share it on WhatsApp. Guests open a live experience.' },
] as const;

export function HowItWorks() {
  return (
    <div className="relative overflow-hidden">
      <FloralCorners corner="both" />

      <section className="relative z-content py-8 sm:py-10">
        <div className="mx-auto max-w-[1200px] px-4">
          <SectionHeading
            eyebrow={
              <>
                <SparkleIcon /> Your journey
              </>
            }
            title="Four steps. That's all."
          />

          <div className="relative mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            <div aria-hidden className="absolute left-[0] right-[0] top-[38px] hidden h-px bg-line-soft lg:block" />
            {STEPS.map((s, i) => (
              <StepCard key={s.title} index={i + 1} {...s} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/templates" className="action group inline-flex items-center gap-2 rounded-pill px-5 py-3 text-marigold-700 no-underline transition-colors hover:bg-surface-sunken">
              Browse all templates <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function StepCard({ index, title, desc }: { index: number; title: string; desc: string }) {
  return (
    <div className="rounded-lg bg-surface-raised p-6 shadow-sm">
      <span className="tabular label relative z-content flex h-[44px] w-[44px] items-center justify-center rounded-pill bg-marigold-500 text-ink-on-brand">
        {String(index).padStart(2, '0')}
      </span>
      <p className="display-md mt-4 text-ink-strong">{title}</p>
      <p className="body-sm mt-2 text-ink-body">{desc}</p>
    </div>
  );
}

import Link from 'next/link';
import { buttonClasses } from '@/components/ui/Button';
import { ArrowRightIcon, SparkleIcon } from './icons';

/** The dark closing band: a line, and the two places to go next. */
export function CtaBand() {
  return (
    <section className="bg-surface-inverse px-4 py-16 text-center text-ink-on-inverse">
      <h2 className="display-xl mx-auto max-w-[18ch] text-ink-on-inverse">Ready to create your invitation?</h2>
      <p className="body mx-auto mt-3 max-w-[48ch] text-[color-mix(in_srgb,var(--ink-on-inverse)_80%,transparent)]">
        Pick a design and we will make it yours, or tell us what you have in mind.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link href="/templates" className={buttonClasses('primary')}>
          <SparkleIcon /> Explore templates <ArrowRightIcon />
        </Link>
        <Link
          href="/contact"
          className={buttonClasses('ghost', 'md', '!text-ink-on-inverse no-underline')}
        >
          Talk to our team
        </Link>
      </div>
    </section>
  );
}

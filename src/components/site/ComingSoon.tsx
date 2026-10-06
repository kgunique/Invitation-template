import { SparkleIcon } from './icons';

/** The placeholder panel for a category nothing is built for yet. */
export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="mt-10 flex flex-col items-center gap-3 rounded-lg border border-dashed border-line-firm bg-[color-mix(in_srgb,var(--surface-sunken)_50%,transparent)] px-4 py-20 text-center">
      <SparkleIcon className="h-8 w-8 text-marigold-500" />
      <p className="display-md text-ink-strong">{title}</p>
      <p className="body-sm max-w-[36ch] text-ink-body">
        We're crafting something special for this category — check back shortly.
      </p>
    </div>
  );
}

import type { ReactNode } from 'react';

/** Eyebrow + title (+ optional subtitle), reused by every marketing section below the hero. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-[640px] text-center">
      <span className="label inline-flex items-center gap-2 rounded-pill bg-surface-sunken px-4 py-2 text-rani-700">
        {eyebrow}
      </span>
      <h2 className="display-xl mt-5">{title}</h2>
      {subtitle && <p className="body mt-3 text-ink-body">{subtitle}</p>}
    </div>
  );
}

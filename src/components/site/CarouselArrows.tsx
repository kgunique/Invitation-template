import { ChevronLeftIcon, ChevronRightIcon } from './icons';

export function CarouselArrows({
  onPrev,
  onNext,
  label,
  className = '',
}: {
  onPrev: () => void;
  onNext: () => void;
  /** What this carousel is paging through, e.g. "stories" or "reviews" —
   * makes the buttons distinguishable when a page has more than one carousel. */
  label: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        type="button"
        onClick={onPrev}
        aria-label={`Previous ${label}`}
        className="flex h-[44px] w-[44px] items-center justify-center rounded-pill bg-surface-raised text-ink-strong shadow-md transition-shadow hover:shadow-lg"
      >
        <ChevronLeftIcon />
      </button>
      <button
        type="button"
        onClick={onNext}
        aria-label={`Next ${label}`}
        className="flex h-[44px] w-[44px] items-center justify-center rounded-pill bg-surface-raised text-ink-strong shadow-md transition-shadow hover:shadow-lg"
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
}

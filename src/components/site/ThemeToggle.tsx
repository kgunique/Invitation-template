'use client';

import { useEffect, useState } from 'react';
import { CrownIcon } from './icons';

const STORAGE_KEY = 'marryme-theme';

/** Visitor-facing switch between the default theme and "Regal Sapphire &
 * Gold" — same tokens.json pipeline as the light/dark system, just a third
 * named theme picked explicitly instead of by OS preference. Persisted in
 * localStorage; never touches "light"/"dark" so the existing OS-dark
 * behaviour is untouched when this is off. */
export function ThemeToggle() {
  const [isRegal, setIsRegal] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === 'regal') {
      document.documentElement.setAttribute('data-theme', 'regal');
      setIsRegal(true);
    }
  }, []);

  function toggle() {
    const next = !isRegal;
    setIsRegal(next);
    if (next) {
      document.documentElement.setAttribute('data-theme', 'regal');
      localStorage.setItem(STORAGE_KEY, 'regal');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isRegal}
      className="label flex h-10 items-center gap-2 rounded-pill border border-line-firm px-4 text-ink-strong transition-colors hover:bg-surface-sunken"
    >
      <CrownIcon className={isRegal ? 'text-marigold-500' : 'text-ink-muted'} />
      {isRegal ? 'Regal theme' : 'Try Regal theme'}
    </button>
  );
}

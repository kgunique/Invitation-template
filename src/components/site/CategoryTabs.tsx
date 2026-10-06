'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { OTHER, TABS, categoryHref } from './categories';

// Sizes step up with the screen: phone (11px, then 12px), tablet (15px, two header rows), laptop (13px, to fit
// the header's single row), desktop (15px).
const TAB =
  'action inline-flex items-center gap-2 rounded-pill border px-[6px] py-[6px] text-[11px] no-underline transition-colors ' +
  'min-[380px]:px-2 min-[380px]:text-[12px] sm:px-4 sm:text-[15px] lg:px-[10px] lg:text-[13px] xl:px-4 xl:text-[15px]';
const ON = 'border-transparent bg-surface-brand text-ink-on-brand shadow-sm';
const OFF = 'border-line-soft bg-surface-raised text-ink-body hover:text-ink-strong';

/**
 * The category menu in the header of every page. Each tab is a link: Wedding to /templates, the others to
 * /templates?c=…; `selected` (what /templates is showing) lights its tab, and nothing is lit on a page that
 * is not /templates, except "Other" on /services and /contact, which live in its menu. "Other" opens a floating
 * menu (right-aligned under the whole bar, so it stays on screen on a phone) that closes on a click outside it,
 * on Escape, or when a choice is made.
 */
export function CategoryTabs({ selected }: { selected?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);

  const isOther =
    (selected !== undefined && !TABS.some((t) => t.id === selected)) || pathname === '/services' || pathname === '/contact';

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => !menu.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', away);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('pointerdown', away);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);

  return (
    <nav aria-label="Invitation category" className="relative flex flex-wrap justify-center gap-1 sm:gap-2">
      {TABS.map((t) => (
        <Link
          key={t.id}
          href={categoryHref(t.id)}
          aria-current={selected === t.id ? 'page' : undefined}
          className={`${TAB} ${selected === t.id ? ON : OFF}`}
        >
          <span aria-hidden className="hidden sm:inline">
            {t.icon}
          </span>
          {t.label}
        </Link>
      ))}

      <div ref={menu}>
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={`${TAB} ${isOther ? ON : OFF}`}
        >
          Other
          <svg viewBox="0 0 12 12" aria-hidden className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`}>
            <path d="M2 4.5 6 8.5 10 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {open && (
          <div
            role="menu"
            className="absolute right-[0] top-full z-control mt-2 w-[240px] max-w-[calc(100vw-32px)] rounded-lg border border-line-soft bg-surface-raised py-2 shadow-lg"
          >
            {OTHER.map((item, i) => {
              if (item === null) return <div key={i} role="separator" className="my-2 border-t border-line-soft" />;
              const label = typeof item === 'string' ? item : item.label;
              const href = typeof item === 'string' ? categoryHref(item) : item.href;
              const current = typeof item === 'string' ? selected === item : pathname === item.href;
              return (
                <Link
                  key={label}
                  role="menuitem"
                  href={href}
                  aria-current={current ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                  className={`body block w-full px-5 py-2 text-left text-ink-strong no-underline hover:bg-surface-sunken ${
                    current ? 'bg-surface-sunken font-bold' : ''
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}

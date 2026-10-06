/**
 * The header's category menu, shared by the header (client) and /templates (server).
 * Only Wedding has templates. The rest are placeholders so the shape of the site is visible;
 * nothing behind them is real. A category is a tab's id, or, for the "Other" menu, the item's label.
 */
export const TABS = [
  { id: 'wedding', label: 'Wedding', icon: '💍' },
  { id: 'engagement', label: 'Engagement', icon: '💎' },
  { id: 'baby-shower', label: 'Baby Shower', icon: '👶' },
] as const;

/** The "Other" menu. A string is a "coming soon" category; an object is a page of its own, and `null` is the divider before them. */
export const OTHER = [
  'Birthday Party',
  'Rice Ceremony',
  'Housewarming',
  'Opening Ceremony',
  'Ganesh Festival',
  null,
  { label: 'Services & Add-ons', href: '/services' },
  { label: 'Contact us', href: '/contact' },
] as const;

const COMING_SOON = OTHER.filter((o): o is Extract<typeof o, string> => typeof o === 'string');

/** What /templates shows when the URL names no (or an unknown) category. */
export const DEFAULT_CATEGORY = 'wedding';

/** The category a `?c=` value names, or the default for anything unknown. */
export function resolveCategory(c: string | undefined): string {
  if (c && (TABS.some((t) => t.id === c) || COMING_SOON.some((o) => o === c))) return c;
  return DEFAULT_CATEGORY;
}

/** What to call a category: a tab's label, or the menu item itself. */
export const categoryLabel = (id: string) => TABS.find((t) => t.id === id)?.label ?? id;

/** Where a category lives: Wedding is /templates itself; the others are /templates?c=… */
export const categoryHref = (id: string) =>
  id === DEFAULT_CATEGORY ? '/templates' : `/templates?c=${encodeURIComponent(id)}`;

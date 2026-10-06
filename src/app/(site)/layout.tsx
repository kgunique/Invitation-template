/**
 * Platform layer: marketing site, gallery, pricing.
 * Kept apart from (invite) on purpose — see the design system README.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-modal focus:rounded-pill focus:bg-surface-brand focus:px-5 focus:py-3 focus:text-ink-on-brand"
      >
        Skip to content
      </a>
      <main id="main">{children}</main>
    </>
  );
}

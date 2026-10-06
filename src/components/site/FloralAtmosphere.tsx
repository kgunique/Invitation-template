import Image from 'next/image';

/**
 * Ambient decoration only — no JS, no state, no Canvas. Real painterly
 * artwork (transparent WebP, Freepik-licensed — see footer credit),
 * animated with the existing amb-sway (branches) and amb-fall (loose
 * petals/leaves) keyframes from motion.css, so reduced-motion support
 * comes for free.
 *
 * Both components are scoped to their own section: mount inside a
 * `relative overflow-hidden` wrapper alongside a sibling that carries
 * `relative z-content`, so the section's real content always paints above
 * this (z-base). They're never `fixed` — each scrolls away with its own
 * section instead of staying pinned over content below it.
 *
 * Only one corner asset exists (hero-floral-left.webp). Every other corner
 * reuses it mirrored via scaleX(-1) instead of downloading more files.
 */

type Corner = 'left' | 'right' | 'both';

const CORNER_ART = '/art/floral/hero-floral-left.webp';

/** Lightweight corner flourish, reused across secondary sections (no loose
 * petals — that denser "atmosphere" treatment stays hero-only). `size="sm"` is for a
 * band that has text right down to its edges (the footer): the flowers are smaller, so the
 * band can leave room for them (its top padding must clear 72px, or 96px from sm). */
export function FloralCorners({ corner = 'both', size = 'md' }: { corner?: Corner; size?: 'md' | 'sm' }) {
  const h = size === 'sm' ? 'h-[96px] sm:h-[120px]' : 'h-[140px] sm:h-[200px]';
  return (
    <div aria-hidden="true" className="absolute inset-[0] z-base overflow-hidden pointer-events-none">
      {corner !== 'right' && (
        <div className="amb-sway absolute -left-6 -top-6" style={{ animationDuration: '11s' }}>
          <Image src={CORNER_ART} alt="" width={700} height={700} className={`${h} w-auto`} />
        </div>
      )}
      {corner !== 'left' && (
        <div className="amb-sway absolute -right-6 -top-6" style={{ animationDuration: '12s', animationDelay: '-4s' }}>
          <Image src={CORNER_ART} alt="" width={700} height={700} className={`${h} w-auto -scale-x-100`} />
        </div>
      )}
    </div>
  );
}

const LOOSE_ACCENTS = [
  { src: '/art/floral/petal-01.webp', top: '18%', left: '44%', size: 26, delay: '-1s', duration: '9s', drift: 16 },
  { src: '/art/floral/leaf-01.webp', top: '30%', left: '60%', size: 30, delay: '-4s', duration: '10s', drift: -14 },
  { src: '/art/floral/petal-02.webp', top: '58%', left: '6%', size: 24, delay: '-6s', duration: '8s', drift: 12 },
  { src: '/art/floral/petal-01.webp', top: '10%', left: '80%', size: 20, delay: '-2.5s', duration: '8s', drift: -10 },
  { src: '/art/floral/leaf-01.webp', top: '68%', left: '90%', size: 26, delay: '-7s', duration: '11s', drift: 14 },
  { src: '/art/floral/petal-02.webp', top: '46%', left: '25%', size: 18, delay: '-5s', duration: '9s', drift: -12 },
  { src: '/art/floral/leaf-01.webp', top: '8%', left: '30%', size: 22, delay: '-3.5s', duration: '10s', drift: 10 },
] as const;

/** Hero-only: right corner only (per design direction) plus a scatter of
 * loose falling petals/leaves for the denser "atmosphere" feel. */
export function FloralAtmosphere() {
  return (
    <div aria-hidden="true" className="absolute inset-[0] z-base overflow-hidden pointer-events-none">
      <div className="amb-sway absolute -right-6 -top-6" style={{ animationDuration: '12s' }}>
        <Image src={CORNER_ART} alt="" width={700} height={700} className="h-[260px] w-auto -scale-x-100 sm:h-[380px]" />
      </div>

      {LOOSE_ACCENTS.map((accent, i) => (
        <span
          key={i}
          className="amb-fall absolute"
          style={{
            top: accent.top,
            left: accent.left,
            width: accent.size,
            height: accent.size,
            animationDelay: accent.delay,
            animationDuration: accent.duration,
            ['--fall-to' as string]: '50px',
            ['--drift' as string]: `${accent.drift}px`,
          }}
        >
          <Image src={accent.src} alt="" fill className="object-contain" />
        </span>
      ))}
    </div>
  );
}

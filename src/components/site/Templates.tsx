'use client';

import Image from 'next/image';
import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { TierBadge } from '@/components/ui/TierBadge';
import { TEMPLATE_NAMES, whatsappOrderUrl } from '@/content/site';
import { TIERS, TRADITIONS, type TierId, type TraditionId } from '@/content/traditions';
import { FloralCorners } from './FloralAtmosphere';
import { SectionHeading } from './SectionHeading';
import { ArrowRightIcon, ChatIcon, EyeIcon, SparkleIcon } from './icons';

// Every card is a real template: its screens are screenshots of the live invite
// (the screen a guest taps, then the invite it opens to), and Preview opens that
// page. To refresh a card after its template changes, retake the two screenshots
// at 375x812 into public/templates/ (see ai-doc/rule.md, "Gallery screenshots").
const FEATURED = [
  {
    tier: 'silver',
    tradition: 'gujarati',
    couple: 'Ishani & Advait',
    initials: 'I&A',
    name: TEMPLATE_NAMES['gujarati-kankotri'],
    tag: 'Floral Romance',
    slug: 'ishani-weds-advait',
    screens: { cover: '/templates/ishani-advait-invite.webp', preview: '/templates/ishani-advait-gate.webp' },
  },
  {
    tier: 'gold',
    tradition: 'contemporary',
    couple: 'Lily & Ethan',
    initials: 'L&E',
    name: TEMPLATE_NAMES['gold-envelope'],
    tag: 'Starlit Night',
    slug: 'lily-weds-ethan',
    screens: { cover: '/templates/lily-ethan-invite.webp', preview: '/templates/lily-ethan-gate.webp' },
  },
  {
    tier: 'platinum',
    tradition: 'south-indian',
    couple: 'Aarthi & Prashanth',
    initials: 'A&P',
    name: TEMPLATE_NAMES['platinum-temple'],
    slug: 'aarthi-weds-prashanth',
    screens: { cover: '/templates/aarthi-prashanth-invite.webp', preview: '/templates/aarthi-prashanth-gate.webp' },
  },
] satisfies {
  tier: TierId;
  tradition: TraditionId;
  couple: string;
  initials: string;
  name: string;
  /** The pill in the card's corner, for a template whose look says more than its
   * tradition does. Omit and the pill shows the tradition's name. */
  tag?: string;
  /** The live invite's route, when there is one. Preview links to it. */
  slug?: string;
  screens?: { cover: string; preview: string };
}[];

const CATEGORIES = [
  { id: 'wedding', label: 'Wedding Invitations' },
  { id: 'birthday', label: 'Birthday' },
  { id: 'engagement', label: 'Engagement' },
] as const;

type CategoryId = (typeof CATEGORIES)[number]['id'];

/** Birthday and Engagement are inert placeholders, requested as a one-off UI
 * exception — this product is weddings only (see README). Nothing behind
 * them is real, and this isn't a category expansion of the actual product. */
export function Templates() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('wedding');

  return (
    <div className="relative overflow-hidden">
      {/* <FloralCorners corner="both" /> */}

      <section className="relative z-content py-8 sm:py-10">
      <div className="mx-auto max-w-[1200px] px-4">
        <SectionHeading
          eyebrow={
            <>
              <SparkleIcon /> Our collection
            </>
          }
          title="Featured invitation designs"
        />

        <div className="mt-8 flex justify-center">
          <div className="inline-flex gap-1 rounded-pill border border-[color-mix(in_srgb,var(--line-soft)_60%,transparent)] bg-[color-mix(in_srgb,var(--surface-raised)_50%,transparent)] p-1 shadow-md backdrop-blur-md">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                aria-current={activeCategory === cat.id}
                className={`action rounded-pill px-5 py-2 transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-surface-brand text-ink-on-brand shadow-sm'
                    : 'text-ink-body hover:text-ink-strong'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {activeCategory === 'wedding' ? (
          <>
            <p className="body mt-6 text-center text-ink-body">
              A sample across tiers and traditions. The full gallery filters by tradition.
            </p>

            <div className="mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-[0]">
              {FEATURED.map((f) => (
                <TemplateCard key={f.couple} {...f} />
              ))}
            </div>

            <div className="mt-10 text-center">
              <Button variant="primary">
                Explore all templates <ArrowRightIcon />
              </Button>
            </div>
          </>
        ) : (
          <ComingSoon label={CATEGORIES.find((c) => c.id === activeCategory)!.label} />
        )}
      </div>
      </section>
    </div>
  );
}

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="mt-10 flex flex-col items-center gap-3 rounded-lg border border-dashed border-line-firm bg-[color-mix(in_srgb,var(--surface-sunken)_50%,transparent)] py-20 text-center">
      <SparkleIcon className="h-8 w-8 text-marigold-500" />
      <p className="display-md text-ink-strong">{label} templates are coming soon</p>
      <p className="body-sm max-w-[36ch] text-ink-body">
        We're crafting something special for this category — check back shortly.
      </p>
    </div>
  );
}

/** A realistic phone chrome — side buttons and a camera notch — shared by
 * both mock screens in a card. Position/size/rotation come from the caller,
 * since the two screens need different positioning strategies (one sits in
 * normal flow so the pair centers together, the other is offset from it). */
function MockPhone({
  className,
  image,
  children,
}: {
  className: string;
  image?: string;
  children: ReactNode;
}) {
  return (
    <div className={`rounded-[22px] border-[3px] border-ink-strong bg-ink-strong shadow-lg ${className}`}>
      <span className="absolute -left-[3px] top-[15%] h-[18px] w-[3px] rounded-l-sm bg-ink-strong" />
      <span className="absolute -left-[3px] top-[24%] h-[26px] w-[3px] rounded-l-sm bg-ink-strong" />
      <span className="absolute -right-[3px] top-[18%] h-[30px] w-[3px] rounded-r-sm bg-ink-strong" />
      <div className="absolute left-1/2 top-[8px] z-content h-[9px] w-[38%] -translate-x-1/2 rounded-pill bg-ink-strong" />
      <div className="relative h-full w-full overflow-hidden rounded-[19px] bg-invite-ground">
        {image ? <Image src={image} alt="" fill sizes="140px" className="object-cover" /> : children}
      </div>
    </div>
  );
}

function TemplateCard({
  tier,
  tradition,
  couple,
  initials,
  name,
  tag,
  slug,
  screens,
}: {
  tier: TierId;
  tradition: TraditionId;
  couple: string;
  initials: string;
  name: string;
  tag?: string;
  slug?: string;
  screens?: { cover: string; preview: string };
}) {
  const tierData = TIERS.find((t) => t.id === tier)!;
  const traditionData = TRADITIONS.find((t) => t.id === tradition)!;
  const original = Math.round((tierData.price * 1.3) / 10) * 10;

  return (
    <div className="w-[85%] shrink-0 snap-center overflow-hidden rounded-lg border border-[color-mix(in_srgb,var(--line-soft)_60%,transparent)] bg-[color-mix(in_srgb,var(--surface-raised)_70%,transparent)] shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:w-[60%] lg:w-auto">
      <div className="px-5 pt-6">
        <div className="flex items-center justify-between">
          <TierBadge tier={tier} />
          <span className="label rounded-pill bg-surface-sunken px-3 py-1 text-ink-strong">
            {tag ?? traditionData.name}
          </span>
        </div>

        {/* Two mock screens: the closed gate a guest taps, and the invite it opens to. */}
        <div className="relative mx-auto mt-6 flex h-[300px] items-center justify-center">
          <MockPhone
            className="absolute h-[250px] w-[122px] -translate-x-[46px] -rotate-6 shadow-md"
            image={screens?.preview}
          >
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-1 text-center">
              <span className="flex h-[28px] w-[28px] items-center justify-center rounded-pill border border-invite-metal text-[9px] text-invite-ink">
                {initials}
              </span>
              <span className="text-[7px] uppercase tracking-[0.15em] text-invite-metal">Tap to open</span>
            </div>
          </MockPhone>

          <MockPhone
            className="relative z-content h-[280px] w-[132px] translate-x-[46px] rotate-3 shadow-lg"
            image={screens?.cover}
          >
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 px-2 text-center">
              <span className="text-[7px] uppercase tracking-[0.1em] text-invite-ink-soft">The wedding of</span>
              <span className="festive-sm text-[11px] text-invite-ink">{couple}</span>
              <span className="text-[7px] text-invite-metal">{traditionData.ceremony}</span>
            </div>
          </MockPhone>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-5">
        <p className="display-md text-ink-strong">{name}</p>

        <div className="flex items-center justify-between gap-3">
          <p className="flex items-baseline gap-2">
            <span className="display-md tabular text-ink-strong">₹{tierData.price}</span>
            <span className="tabular caption text-ink-muted line-through">₹{original}</span>
          </p>
          {slug ? (
            <a
              href={`/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="action inline-flex items-center gap-1 rounded-md px-3 py-[6px] text-ink-strong no-underline shadow-[inset_0_0_0_1.5px_var(--line-firm)]"
            >
              <EyeIcon /> Preview
            </a>
          ) : (
            <span className="action inline-flex items-center gap-1 rounded-md px-3 py-[6px] text-ink-strong shadow-[inset_0_0_0_1.5px_var(--line-firm)]">
              <EyeIcon /> Preview
            </span>
          )}
        </div>
        {/* The preview link is built from the page's own origin at click time, so
            it is localhost in dev and the hosted address once deployed. */}
        <Button
          variant="order"
          size="sm"
          className="w-full"
          onClick={() =>
            window.open(
              whatsappOrderUrl(name, slug ? `${window.location.origin}/${slug}` : undefined),
              '_blank',
              'noopener,noreferrer',
            )
          }
        >
          <ChatIcon /> Order on WhatsApp
        </Button>
      </div>
    </div>
  );
}

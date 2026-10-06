'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { TierBadge } from '@/components/ui/TierBadge';
import { whatsappOrderUrl } from '@/content/site';
import type { TemplateListing } from '@/content/templateCatalog';
import { TIERS, TRADITIONS } from '@/content/traditions';
import { EyeIcon, WhatsAppIcon } from './icons';

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

/** One template in the gallery: two mock screens of its sample invite, its tier and price, Preview and Order on WhatsApp. `className` sizes it, since the home page lays the cards in a carousel and /templates in a grid. */
export function TemplateCard({ listing, className = '' }: { listing: TemplateListing; className?: string }) {
  const { tier, tradition, couple, initials, name, tag, slug, screens } = listing;
  const tierData = TIERS.find((t) => t.id === tier)!;
  const traditionData = TRADITIONS.find((t) => t.id === tradition)!;
  const original = Math.round((tierData.price * 1.3) / 10) * 10;

  return (
    <div className={`overflow-hidden rounded-lg border border-[color-mix(in_srgb,var(--line-soft)_60%,transparent)] bg-[color-mix(in_srgb,var(--surface-raised)_70%,transparent)] shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${className}`}>
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
          <WhatsAppIcon /> Order on WhatsApp
        </Button>
      </div>
    </div>
  );
}

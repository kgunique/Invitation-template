import type { TierId } from '@/content/traditions';

const TIER_STYLES: Record<TierId, string> = {
  silver: 'bg-peacock-100 text-peacock-700',
  gold: 'bg-marigold-100 text-marigold-700',
  platinum: 'bg-rani-100 text-rani-700',
};

/** Colour is never the only indicator — the word is always present. */
export function TierBadge({ tier }: { tier: TierId }) {
  return (
    <span className={`label inline-block rounded-pill px-2 py-1  uppercase ${TIER_STYLES[tier]}`}>
      {tier}
    </span>
  );
}

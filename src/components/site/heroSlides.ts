import type { TierId, TraditionId } from '@/content/traditions';

/** Hardcoded stand-ins for the hero's live-preview slider. Swap for real
 * template data once the invite config schema and registry land (Phase 1). */
export interface HeroSlide {
  bride: string;
  groom: string;
  venue: string;
  tier: TierId;
  tradition: TraditionId;
  /** A screenshot of the real invite, shown full-bleed in the phone. Omit and
   * the phone shows the placeholder card (initials, names, venue). */
  screen?: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    bride: 'Lily',
    groom: 'Ethan',
    venue: 'Starlight Garden Estate, Udaipur',
    tier: 'gold',
    tradition: 'contemporary',
    screen: '/templates/lily-ethan-gate.webp',
  },
  {
    bride: 'Ishani',
    groom: 'Advait',
    venue: 'Ahmedabad Kankotri Hall',
    tier: 'silver',
    tradition: 'gujarati',
    screen: '/templates/ishani-advait-gate.webp',
  },
  { bride: 'Meera', groom: 'Karthik', venue: 'Chennai Muhurtham Mandapam', tier: 'platinum', tradition: 'south-indian' },
];

/** e.g. "lily-weds-ethan" — the invite route for this slide (bride, then groom). */
export function slideSlug(slide: HeroSlide): string {
  return `${slide.bride.toLowerCase()}-weds-${slide.groom.toLowerCase()}`;
}

export function slideInitials(slide: HeroSlide): string {
  return `${slide.bride[0]}&${slide.groom[0]}`;
}

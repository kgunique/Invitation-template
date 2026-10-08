import type { TierId, TraditionId } from '@/content/traditions';

/** The hero's live-preview slider: one slide per tier, each a screenshot of its
 * real invite (see `screen`). Still hand-listed here; swap for data from
 * content/invites.ts if the slides should ever follow the registry. */
export interface HeroSlide {
  bride: string;
  groom: string;
  venue: string;
  tier: TierId;
  tradition: TraditionId;
  /** A screenshot of the real invite, shown full-bleed in the phone. Omit and
   * the phone shows the placeholder card (initials, names, venue). */
  screen?: string;
  /** The invite's route, when it is not `bride-weds-groom` (a template whose sample puts the groom first). */
  slug?: string;
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
  {
    bride: 'Aarthi',
    groom: 'Prashanth',
    venue: 'Sri Meenakshi Kalyana Mandapam, Madurai',
    tier: 'platinum',
    tradition: 'south-indian',
    screen: '/templates/aarthi-prashanth-gate.webp',
  },
  {
    bride: 'Neha',
    groom: 'Karan',
    venue: 'Shri Kedareshwar Mandir Gardens, Rishikesh',
    tier: 'platinum',
    tradition: 'contemporary',
    screen: '/templates/karan-neha-rudra-gate.webp',
    slug: 'karan-weds-neha-rudra',
  },
];

/** e.g. "lily-weds-ethan" — the invite route for this slide (bride, then groom, unless the slide names its own). */
export function slideSlug(slide: HeroSlide): string {
  return slide.slug ?? `${slide.bride.toLowerCase()}-weds-${slide.groom.toLowerCase()}`;
}

export function slideInitials(slide: HeroSlide): string {
  return `${slide.bride[0]}&${slide.groom[0]}`;
}

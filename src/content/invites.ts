import type { TierId, TraditionId } from './traditions';

/**
 * Stand-in for the real invite database (Phase 1 in the README). One real
 * order = one new entry here, keyed by slug — never a new page file. The
 * dynamic route at (invite)/[slug] looks a couple up by slug and hands their
 * data to whichever template component `templateId` points at (see
 * src/components/invite/templates/registry.ts). Swap this array for a DB
 * query later; nothing else about the routing/template split changes.
 */
/** One line of the schedule. */
export interface InviteEvent {
  title: string;
  description: string;
  /** ISO timestamp WITH its UTC offset, e.g. "2027-02-19T17:00:00+05:30". */
  startsAt: string;
  /** Where it happens; also the Google Maps search text for the location link. */
  place: string;
  /** One emoji for the timeline medallion. */
  icon: string;
}

/** One card in the "Wedding details" section: a coordinator contact, a gift note… */
export interface InviteDetail {
  icon: 'phone' | 'gift';
  title: string;
  body: string;
  /** A bold gold line under the body, e.g. a name and number. */
  highlight?: string;
  /** Makes `highlight` a link, e.g. "tel:+919876543210". */
  highlightHref?: string;
}

/** How guests reply. There is no backend yet, so a reply is a WhatsApp message
 * to the hosts, pre-written by the form and sent by the guest. */
export interface InviteRsvp {
  /** The hosts' WhatsApp number: digits only, with country code, e.g. "919876543210". */
  whatsapp: string;
  /** Last day to reply, as an ISO timestamp WITH its UTC offset. Shown above the form. */
  replyBy?: string;
  /** Most extra guests ("plus members") one reply can bring. Defaults to 5. */
  maxPlusMembers?: number;
}

/** A gift registry shown as a "gift box" that opens to payment details. */
export interface InviteRegistry {
  /** The tracked line under the box's title, e.g. "Bank transfer". Defaults to that. */
  method?: string;
  /** Whom it is paid to, e.g. "Ethan & Lily". */
  holder: string;
  /** The lines to show, each with a copy button: [{ label: "IFSC", value: "…" }]. */
  details: { label: string; value: string }[];
}

/** Where the wedding is: the "Location" section. */
export interface InviteLocation {
  name: string;
  address: string;
  /** Artwork of the venue (an illustration or a photo). Omit and a starry placeholder is drawn. */
  image?: string;
  /** A Google Maps link. Omit and a search link is built from the name and address. */
  mapsUrl?: string;
}

export interface InviteRecord {
  slug: string;
  bride: string;
  groom: string;
  venue: string;
  tier: TierId;
  tradition: TraditionId;
  templateId: string;
  greeting: string;
  /** Hero backdrop for this couple. Omit and the hero shows without one. */
  coupleImage?: string;
  /** Artwork for the "We will wait for you" section. Omit and it reuses `coupleImage`. */
  waitingImage?: string;
  /** The ceremony's start as an ISO timestamp WITH its UTC offset, e.g.
   * "2027-02-21T19:00:00+05:30". Drives the countdown; omit and there isn't one. */
  weddingDate?: string;
  /** The schedule, in order. Omit and there isn't one. */
  events?: InviteEvent[];
  /** The "Wedding details" cards, in order. Omit and there isn't one. */
  details?: InviteDetail[];
  /** The RSVP form. Omit and there isn't one. */
  rsvp?: InviteRsvp;
  /** The venue, for the "Location" section. Omit and there isn't one. */
  location?: InviteLocation;
  /** The gift registry, under the wedding details. Omit and there isn't one. */
  registry?: InviteRegistry;
}

export const INVITES: InviteRecord[] = [
  {
    slug: 'ishani-weds-advait',
    bride: 'Ishani',
    groom: 'Advait',
    venue: 'Ahmedabad Kankotri Hall',
    tier: 'silver',
    tradition: 'gujarati',
    templateId: 'gujarati-kankotri',
    greeting: 'Dear Honoured Guest,\nYou are warmly invited to celebrate our wedding day.',
    coupleImage: '/art/couple/ishani-advait.webp',
    weddingDate: '2027-02-21T19:00:00+05:30',
    events: [
      {
        title: 'Mehendi & Garba',
        description: 'Henna, folk songs and an evening of Garba with family and friends.',
        startsAt: '2027-02-19T17:00:00+05:30',
        place: 'Vastrapur Party Lawn, Ahmedabad',
        icon: '🌿',
      },
      {
        title: 'Haldi',
        description: 'A morning of turmeric, laughter and blessings from the elders.',
        startsAt: '2027-02-20T10:00:00+05:30',
        place: 'Satellite Family Residence, Ahmedabad',
        icon: '🌼',
      },
      {
        title: 'Baraat Aagman',
        description: 'The groom’s procession arrives with dhol, dance and a warm welcome.',
        startsAt: '2027-02-21T17:30:00+05:30',
        place: 'Ahmedabad Kankotri Hall',
        icon: '🥁',
      },
      {
        title: 'Wedding Ceremony',
        description: 'Vows and pheras around the sacred fire, beneath the mandap.',
        startsAt: '2027-02-21T19:00:00+05:30',
        place: 'Ahmedabad Kankotri Hall',
        icon: '💍',
      },
    ],
    details: [
      {
        icon: 'phone',
        title: 'Need Assistance?',
        body: 'For any questions regarding travel, accommodations, or schedule, feel free to reach out to our coordinator:',
        highlight: 'Meera Shah: +91 98765 43210',
        highlightHref: 'tel:+919876543210',
      },
      {
        icon: 'gift',
        title: 'Wedding Gift Registry',
        body: 'Your warm presence is the greatest gift to us on our wedding day. If you wish to bless us with a present, a monetary contribution toward our new home would be sincerely appreciated.',
      },
    ],
    // Placeholder number, same as the coordinator's in `details`.
    rsvp: { whatsapp: '919876543210', replyBy: '2027-02-10T23:59:00+05:30', maxPlusMembers: 5 },
  },
  {
    slug: 'karan-weds-neha',
    bride: 'Neha',
    groom: 'Karan',
    venue: 'Surat Riverside Banquet',
    tier: 'silver',
    tradition: 'gujarati',
    templateId: 'gujarati-kankotri-yellow',
    greeting: 'Dear Honoured Guest,\nYou are warmly invited to celebrate our wedding day.',
    // Placeholder: reuses Ishani & Advait's illustration until Karan & Neha have their own.
    coupleImage: '/art/couple/ishani-advait.webp',
  },
  {
    // The Gold-tier sample: Starlit Envelope.
    slug: 'lily-weds-ethan',
    bride: 'Lily',
    groom: 'Ethan',
    venue: 'Starlight Garden Estate, Udaipur',
    tier: 'gold',
    tradition: 'contemporary',
    templateId: 'gold-envelope',
    greeting: 'Together with our families,\nwe joyfully invite you to celebrate our wedding.',
    coupleImage: '/art/couple/Midnight Wedding Dance Under Golden Lights.png',
    weddingDate: '2027-03-14T18:30:00+05:30',
    events: [
      {
        title: 'Celestial Union',
        description: 'Witness the exchange of rings and vows in an elegant candlelight ceremony.',
        startsAt: '2027-03-14T17:00:00+05:30',
        place: 'The Starlight Chapel, Udaipur',
        icon: '💍',
      },
      {
        title: 'Starry Gala Feast',
        description: 'An exquisite multi-course dinner under a canopy of lights, with vintage pairings.',
        startsAt: '2027-03-14T20:00:00+05:30',
        place: 'Grand Constellation Hall, Udaipur',
        icon: '🍽️',
      },
      {
        title: 'Midnight Soiree',
        description: 'A toast, live music and dancing until the morning stars appear.',
        startsAt: '2027-03-14T21:30:00+05:30',
        place: 'Astro Pavilion, Udaipur',
        icon: '🎶',
      },
    ],
    // Placeholder number, as for Ishani & Advait.
    rsvp: { whatsapp: '919876543210', replyBy: '2027-02-28T23:59:00+05:30', maxPlusMembers: 5 },
    location: {
      name: 'Starlight Garden Estate',
      address: 'Gardens Road, Udaipur, Rajasthan',
    },
    details: [
      {
        icon: 'phone',
        title: 'Need Assistance?',
        body: 'For travel, Udaipur hotel stays or the programme, please reach out to our coordinator:',
        highlight: 'Aarav Mehta, Wedding Concierge: +91 98765 43210',
        highlightHref: 'tel:+919876543210',
      },
    ],
    // Placeholder account details.
    registry: {
      method: 'Bank transfer',
      holder: 'Ethan & Lily',
      details: [
        { label: 'A/C No.', value: '0123 4567 8901' },
        { label: 'IFSC', value: 'SAMP0001234' },
        { label: 'UPI', value: 'ethan.lily@upi' },
      ],
    },
  },
];

export function getInvite(slug: string): InviteRecord | undefined {
  return INVITES.find((i) => i.slug === slug);
}

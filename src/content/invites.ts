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
  /** Where it happens: the venue's name. Also the start of the Google Maps search for the location link. */
  place: string;
  /** The venue's address, as one line under its name, e.g. "Chanakyapuri, New Delhi, India". Also in the Maps search. */
  address?: string;
  /** A Google Maps link. Omit and a search link is built from `place` and `address`. */
  mapsUrl?: string;
  /** Which artwork dresses this event's card. A template maps these keys to scenes (the Platinum template knows
   * "canopy", "toran", "floral-arch" and "vivah"); omit and the template picks one by the event's position. */
  art?: string;
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

/** One half of the couple, for the "Meet the couple" section. */
export interface InvitePerson {
  /** The full name, e.g. "Akshar Patel". Omit and the short name on the record is used. */
  name?: string;
  /** A portrait: ideally a cut-out or a soft watercolour on a pale ground, about 4:5. Omit and a monogram is drawn. */
  image?: string;
  /** The italic line under the name, e.g. "With Divine Blessings…". Omit and the template's own is used. */
  blessing?: string;
  /** The family line, e.g. "Son of Mr. Kirit Patel & Mrs. Savita Patel". Omit and there isn't one. */
  family?: string;
}

export interface InviteCouple {
  groom: InvitePerson;
  bride: InvitePerson;
}

/** One card of the "How we met" story. */
export interface InviteMilestone {
  /** The year (or any short date) shown in gold italic, e.g. "2021". */
  year: string;
  /** The bold heading, e.g. "First Met". */
  title: string;
  /** A sentence or two. */
  text: string;
  /** Optional extras for a timeline that shows them: the chapter label ("अध्याय १"), an italic line under the title, and a footer tag and note. */
  label?: string;
  subtitle?: string;
  tag?: string;
  note?: string;
}

/** The "How we met" section: the couple's illustration and their milestones. */
export interface InviteStory {
  /** An illustration of the pair standing side by side (transparent PNG/WebP). Omit and a labelled placeholder is drawn. */
  image?: string;
  milestones: InviteMilestone[];
}

/** One picture in "Our love gallery". */
export interface InviteGalleryItem {
  /** The picture: a photograph or an illustration, any shape (it is cropped to a tall frame). */
  src: string;
  /** What it shows, for screen readers and the lightbox. */
  alt: string;
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
  /** The portraits, full names and families for "Meet the couple". Omit and there isn't one. */
  couple?: InviteCouple;
  /** "Our love gallery": the pictures, in order. Omit and there isn't one. */
  gallery?: InviteGalleryItem[];
  /** The note in the closing "Thank you". Omit and the template's own is used. */
  thankYou?: string;
  /** "How we met": the couple's illustration and their milestones. Omit and there isn't one. */
  story?: InviteStory;
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
  {
    // The Platinum-tier sample: Divine Temple Cinematic.
    slug: 'aarthi-weds-prashanth',
    bride: 'Aarthi',
    groom: 'Prashanth',
    venue: 'Sri Meenakshi Kalyana Mandapam, Madurai',
    tier: 'platinum',
    tradition: 'south-indian',
    templateId: 'platinum-temple',
    greeting: 'With the blessings of our elders,\nwe invite you to the wedding of our children.',
    weddingDate: '2027-04-18T06:30:00+05:30',
    couple: {
      groom: { name: 'Prashanth Raman', image: '/art/platinum/groom-portrait.webp', family: 'Son of Mr. Raman Iyer & Mrs. Lakshmi Raman' },
      bride: { name: 'Aarthi Subramanian', image: '/art/platinum/bride-portrait.webp', family: 'Daughter of Mr. Subramanian & Mrs. Meenakshi Subramanian' },
    },
    events: [
      { title: 'Nichayathartham', description: 'The families exchange vows and betel leaves, and the date is made official.', startsAt: '2027-04-16T18:00:00+05:30', place: 'Sri Meenakshi Kalyana Mandapam', address: 'West Masi Street, Madurai, Tamil Nadu', icon: '🪔', art: 'canopy' },
      { title: 'Nalangu & Haldi', description: 'Turmeric, laughter and playful rituals with the whole family.', startsAt: '2027-04-17T10:00:00+05:30', place: 'Sri Meenakshi Kalyana Mandapam', address: 'West Masi Street, Madurai, Tamil Nadu', icon: '🌼', art: 'toran' },
      { title: 'Grand Reception', description: 'An evening of music, blessings and a feast to welcome the couple.', startsAt: '2027-04-17T19:00:00+05:30', place: 'The Gateway Banquet Hall', address: 'Alagar Koil Road, Madurai, Tamil Nadu', icon: '🎶', art: 'floral-arch' },
      { title: 'Muhurtham', description: 'The sacred hour: the thali is tied and the saptapadi taken.', startsAt: '2027-04-18T06:30:00+05:30', place: 'Sri Meenakshi Kalyana Mandapam', address: 'West Masi Street, Madurai, Tamil Nadu', icon: '🔔', art: 'vivah' },
    ],
    rsvp: { whatsapp: '919876543210', replyBy: '2027-04-04T23:59:00+05:30', maxPlusMembers: 5 },
    gallery: [
      { src: '/art/platinum/groom-portrait.webp', alt: 'Prashanth in his wedding sherwani' },
      { src: '/art/platinum/bride-portrait.webp', alt: 'Aarthi in her bridal saree' },
      { src: '/art/platinum/indian-temple-with-lotus-pond-people.webp', alt: 'The temple courtyard where the families will gather' },
      { src: '/art/platinum/temple-lanterns.webp', alt: 'A temple hung with lanterns' },
      { src: '/art/couple/ishani-advait.webp', alt: 'A couple in celebration' },
    ],
    story: {
      image: '/art/platinum/couple-vector.webp',
      milestones: [
        { year: '2021', title: 'First Met', text: 'Our families met at a cousin’s wedding in Chennai — a shared plate of idlis and filter coffee turned into hours of easy conversation.' },
        { year: '2023', title: 'Shared Dreams', text: 'Weekend trips to temple towns, Sunday cooking, long drives and a quiet certainty that we were meant to be.' },
        { year: '2025', title: 'The Proposal', text: 'With the Meenakshi temple glowing at dusk, Prashanth asked, and Aarthi said Yes!' },
        { year: '2027', title: 'Forever Begins', text: 'Now we invite you to share our joy as we pledge a lifetime of always to one another.' },
      ],
    },
  },
  {
    // The Rudra sample: a Shiva-themed invitation. (karan-weds-neha is the unfinished Yellow Gate sample.)
    slug: 'karan-weds-neha-rudra',
    bride: 'Neha',
    groom: 'Karan',
    venue: 'Shri Kedareshwar Mandir Gardens, Rishikesh',
    tier: 'platinum',
    tradition: 'contemporary',
    templateId: 'rudra',
    greeting: 'With the blessings of Lord Shiva,\nwe invite you to celebrate our wedding.',
    weddingDate: '2027-02-21T19:00:00+05:30',
    // Written in Hindi, as the printed card is.
    couple: {
      groom: {
        name: 'करण कुमार',
        blessing: 'आयुष्मान्',
        image: '/art/rudra/groom-portrait.webp',
        family: 'सुपौत्र: स्व० चाँदी देवी एवं स्व० गंगा विशुन साह\nप्रथम सुपुत्र: श्रीमती निलू देवी एवं श्री सुधीर कुमार\nबुजरा, पहलवान घाट, पटना',
      },
      bride: {
        name: 'नेहा कुमारी',
        blessing: 'आयुष्मती',
        image: '/art/rudra/bride-portrait.webp',
        family: 'सुपुत्री: श्रीमती सुनैना देवी एवं श्री सुनील कुमार साह\nग्राम + पो० – पभेर',
      },
    },
    // The programme of the printed card (the times of the first two are placeholders: the card gives only the day).
    events: [
      { title: 'सत्यनारायण पूजा', description: 'मण्डपाच्छादन एवं हल्दी कलश', startsAt: '2027-02-19T10:00:00+05:30', place: 'वर निवास, दुजरा ', address: 'पहलवान घाट, पटना', art: 'haldi', icon: '🌼' },
      { title: 'घृतधारी एवं देवपूजा', description: '', startsAt: '2027-02-20T09:00:00+05:30', place: 'वर निवास, दुजरा', address: 'पहलवान घाट, पटना', art: 'dev', icon: '🔱' },
      { title: 'बारात प्रस्थान एवं शुभ विवाह', description: 'रात्रि में शुभ विवाह', startsAt: '2027-02-21T18:00:00+05:30', place: 'रूपा मैरेज हॉल', address: 'आलमगंज, गायघाट, पटना', art: 'vivah', icon: '🪔' },
      { title: 'वर-वधू स्वागत समारोह', description: 'एवं प्रीतिभोज', startsAt: '2027-02-24T19:30:00+05:30', place: 'सदाकत आश्रम', address: 'बिहार विद्यापीठ, पटना-10', art: 'swagat', icon: '🎉' },
    ],
    story: {
      milestones: [
        { year: '2022', label: 'अध्याय १', title: 'नियति का मिलन', subtitle: 'ब्रह्मांडीय संयोग', text: 'पावन मंत्रों की शांत आभा के बीच हमारे रास्ते यूँ मिले, मानो ब्रह्मांड ने पहले से ही लिख रखा हो।', tag: 'पहली झलक', note: 'पावन पड़ाव' },
        { year: '2023', label: 'अध्याय २', title: 'पावन वचन', subtitle: 'संध्या की घंटियाँ और एक अटूट “हाँ”', text: 'मंदिर की घंटियों और संध्या के दीपों के बीच करण ने पूछा और नेहा ने कहा — हाँ!', tag: 'प्रस्ताव', note: 'पावन पड़ाव' },
        { year: '2024', label: 'अध्याय ३', title: 'कृपा का शाश्वत बंधन', subtitle: 'सात वचन, अनंत तक', text: 'महादेव और माता गौरी के दिव्य आशीर्वाद से, हम एक शाश्वत यात्रा में साथ-साथ कदम रख रहे हैं।', tag: 'विवाह', note: 'पावन पड़ाव' },
      ],
    },
  },
];

export function getInvite(slug: string): InviteRecord | undefined {
  return INVITES.find((i) => i.slug === slug);
}

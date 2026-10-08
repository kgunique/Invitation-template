import type { TemplateId } from '@/components/invite/templates/registry';
import { INVITES } from './invites';
import { TEMPLATE_NAMES } from './site';
import type { TierId, TraditionId } from './traditions';

/** What the gallery shows for one template design: a card on the home page and on /templates. */
export interface TemplateListing {
  id: TemplateId;
  tier: TierId;
  tradition: TraditionId;
  couple: string;
  initials: string;
  name: string;
  /** The pill in the card's corner, for a template whose look says more than its tradition does. Omit and the pill shows the tradition's name. */
  tag?: string;
  /** The sample invite's route. Preview links to it. */
  slug: string;
  /** Screenshots of the sample: the screen a guest taps, then the invite it opens to. Omit and a drawn stand-in is shown. */
  screens?: { cover: string; preview: string };
}

/** The gallery's own notes on each template. `Record<TemplateId, …>` makes a new template in the registry a type error until it has an entry here — which is what puts it on /templates. */
const LISTINGS: Record<
  TemplateId,
  { tag?: string; screens?: TemplateListing['screens']; featured?: boolean; hidden?: boolean }
> = {
  // Cards' screens are screenshots of the live sample invite; to refresh one after its template changes,
  // retake the two at 375x812 into public/templates/ (see ai-doc/rule.md, "Gallery screenshots").
  'gujarati-kankotri': {
    tag: 'Floral Romance',
    featured: true,
    screens: { cover: '/templates/ishani-advait-invite.webp', preview: '/templates/ishani-advait-gate.webp' },
  },
  // Incomplete: kept out of the gallery until it is finished. Then drop `hidden`, add a tag and retake its two screenshots.
  'gujarati-kankotri-yellow': { hidden: true },
  'gold-envelope': {
    tag: 'Starlit Night',
    featured: true,
    screens: { cover: '/templates/lily-ethan-invite.webp', preview: '/templates/lily-ethan-gate.webp' },
  },
  'platinum-temple': {
    featured: true,
    screens: { cover: '/templates/aarthi-prashanth-invite.webp', preview: '/templates/aarthi-prashanth-gate.webp' },
  },
  // Retake both screens once the template has more than its opening and landing.
  rudra: {
    tag: 'Shiva Blessings',
    featured: true,
    screens: { cover: '/templates/karan-neha-rudra-invite.webp', preview: '/templates/karan-neha-rudra-gate.webp' },
  },
};

/**
 * Every template that is built, in the order of `LISTINGS` above: its sample invite
 * (the first record in invites.ts that uses it) supplies the couple, tier,
 * tradition and preview route. A template with no sample invite yet, or flagged `hidden` (unfinished), is left
 * out.
 */
export function allTemplates(): TemplateListing[] {
  return (Object.keys(LISTINGS) as TemplateId[]).flatMap((id) => {
    const sample = INVITES.find((i) => i.templateId === id);
    if (!sample || LISTINGS[id].hidden) return [];
    return [
      {
        id,
        tier: sample.tier,
        tradition: sample.tradition,
        couple: `${sample.bride} & ${sample.groom}`,
        initials: `${sample.bride[0]}&${sample.groom[0]}`,
        name: TEMPLATE_NAMES[id],
        slug: sample.slug,
        ...LISTINGS[id],
      },
    ];
  });
}

/** The few the home page shows. */
export function featuredTemplates(): TemplateListing[] {
  return allTemplates().filter((t) => LISTINGS[t.id].featured);
}

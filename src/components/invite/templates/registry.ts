import { GoldEnvelopeInvite } from './GoldEnvelopeInvite';
import { GujaratiKankotriInvite } from './GujaratiKankotriInvite';
import { GujaratiKankotriYellowInvite } from './GujaratiKankotriYellowInvite';
import { PlatinumTempleInvite } from './PlatinumTempleInvite';

/**
 * templateId -> component. A new template (new design) is a code change —
 * a new entry here. A new customer on an EXISTING template is just a new
 * row in src/content/invites.ts; this registry never changes for that.
 */
export const TEMPLATES = {
  'gujarati-kankotri': GujaratiKankotriInvite,
  'gujarati-kankotri-yellow': GujaratiKankotriYellowInvite,
  'gold-envelope': GoldEnvelopeInvite,
  'platinum-temple': PlatinumTempleInvite,
} as const;

export type TemplateId = keyof typeof TEMPLATES;

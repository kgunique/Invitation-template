import { GaneshaBlessingsInvite } from './GaneshaBlessingsInvite';
import { GoldEnvelopeInvite } from './GoldEnvelopeInvite';
import { GujaratiKankotriInvite } from './GujaratiKankotriInvite';
import { GujaratiKankotriYellowInvite } from './GujaratiKankotriYellowInvite';
import { KailashGangaInvite } from './KailashGangaInvite';
import { JeevanJyotiInvite } from './JeevanJyotiInvite';
import { KrishnaRadhaInvite } from './KrishnaRadhaInvite';
import { PlatinumTempleInvite } from './PlatinumTempleInvite';
import { RudraInvite } from './RudraInvite';

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
  rudra: RudraInvite,
  'kailash-ganga': KailashGangaInvite,
  'ganesha-blessings': GaneshaBlessingsInvite,
  'krishna-radha': KrishnaRadhaInvite,
  'jeevan-jyoti': JeevanJyotiInvite,
} as const;


export type TemplateId = keyof typeof TEMPLATES;

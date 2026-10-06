/** The brand, and where "Order on WhatsApp" lands. Shared by both route groups,
 * which is why it sits in content/ and not under components/site. */
export const BRAND_NAME = 'Marry Me';

/** The name each template goes by in the gallery and in order enquiries,
 * keyed by its id in components/invite/templates/registry.ts. One list, so the
 * site's card and the invite's own Order button can never disagree. */
export const TEMPLATE_NAMES = {
  'gujarati-kankotri': 'Floral Swing Kankotri',
  'gujarati-kankotri-yellow': 'Floral Swing Kankotri (Yellow Gate)',
  'gold-envelope': 'Starlit Envelope',
} as const;

/** Digits only, with the country code (91 = India), as wa.me wants it. */
export const ORDER_WHATSAPP = '918083499618';

/**
 * The wa.me link that opens a chat with a ready-written order enquiry.
 * `previewUrl` is left out for a template with no live preview yet, rather than
 * sending a link that goes nowhere.
 */
export function whatsappOrderUrl(templateName: string, previewUrl?: string) {
  const lines = [
    `Hello ${BRAND_NAME} 👋`,
    '',
    'I am interested in ordering this invitation template:',
    `📌 Template: ${templateName}`,
    ...(previewUrl ? [`🔗 Preview Link: ${previewUrl}`] : []),
    '',
    'Please share pricing, customization process, and next steps. Thank you!',
  ];
  return `https://wa.me/${ORDER_WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`;
}

/** The brand, and where "Order on WhatsApp" lands. Shared by both route groups,
 * which is why it sits in content/ and not under components/site. */
export const BRAND_NAME = 'Get Invites';

/** The name each template goes by in the gallery and in order enquiries,
 * keyed by its id in components/invite/templates/registry.ts. One list, so the
 * site's card and the invite's own Order button can never disagree. */
export const TEMPLATE_NAMES = {
  'gujarati-kankotri': 'Floral Swing Kankotri',
  'gujarati-kankotri-yellow': 'Floral Swing Kankotri (Yellow Gate)',
  'gold-envelope': 'Starlit Envelope',
  'platinum-temple': 'Divine Temple Cinematic',
} as const;

/** Digits only, with the country code (91 = India), as wa.me wants it. */
export const ORDER_WHATSAPP = '918083499618';

/** Where a visitor can reach us. The footer and /contact both read this, so they never disagree. Placeholders until the real ones are known. */
export const CONTACT = {
  email: 'hello@getinvites.example',
  phone: '+91 80834 99618',
  phoneHref: 'tel:+918083499618',
} as const;

/** A wa.me link to our WhatsApp that opens a chat with `lines` ready to send. */
function whatsappUrl(lines: string[]) {
  return `https://wa.me/${ORDER_WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`;
}

/**
 * The wa.me link that opens a chat with a ready-written order enquiry.
 * `previewUrl` is left out for a template with no live preview yet, rather than
 * sending a link that goes nowhere.
 */
export function whatsappOrderUrl(templateName: string, previewUrl?: string) {
  return whatsappUrl([
    `Hello ${BRAND_NAME} 👋`,
    '',
    'I am interested in ordering this invitation template:',
    `📌 Template: ${templateName}`,
    ...(previewUrl ? [`🔗 Preview Link: ${previewUrl}`] : []),
    '',
    'Please share pricing, customization process, and next steps. Thank you!',
  ]);
}

/** A chat opened with a question about one service or add-on. */
export function whatsappEnquiryUrl(topic: string) {
  return whatsappUrl([
    `Hello ${BRAND_NAME} 👋`,
    '',
    `I would like to know more about: ${topic}`,
    '',
    'Please share details and pricing. Thank you!',
  ]);
}

/** The /contact form, sent as a WhatsApp message (there is no backend to post it to yet). */
export function whatsappContactUrl(f: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  template?: string;
  message: string;
}) {
  return whatsappUrl([
    `Hello ${BRAND_NAME} 👋`,
    '',
    `Subject: ${f.subject}`,
    ...(f.template ? [`📌 Template: ${f.template}`] : []),
    '',
    f.message || '(no message)',
    '',
    `— ${f.name}`,
    `📧 ${f.email}`,
    `📞 ${f.phone}`,
  ]);
}

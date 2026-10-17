/**
 * A contact card (.vcf) as a `data:` link, so "Save contact" needs no server: a name, an optional phone number and
 * a note. Give the link a `download` name ending in `.vcf`; a phone offers to add it to its contacts.
 */
export function vcardHref({ name, phone, note }: { name: string; phone?: string; note?: string }) {
  const text = (s: string) => s.replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${text(name)}`,
    `N:${text(name)};;;;`,
    ...(phone ? [`TEL;TYPE=CELL:+${phone.replace(/\D/g, '')}`] : []),
    ...(note ? [`NOTE:${text(note)}`] : []),
    'END:VCARD',
  ];
  return `data:text/vcard;charset=utf-8,${encodeURIComponent(lines.join('\r\n'))}`;
}

import { Hind, Noto_Serif_Devanagari } from 'next/font/google';

/**
 * The two faces for an invitation written in Hindi (Devanagari): a serif for headings and names, a
 * clean sans for running text. Loaded only on a page that imports this file. Use `.className` on
 * the element (or `.variable` to expose the CSS variable), and `lang="hi"` on the section so the
 * browser sets the text properly.
 */
export const hindiDisplay = Noto_Serif_Devanagari({
  subsets: ['devanagari', 'latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
});

export const hindiBody = Hind({
  subsets: ['devanagari', 'latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

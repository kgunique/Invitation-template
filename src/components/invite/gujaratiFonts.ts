import { Noto_Sans_Gujarati, Noto_Serif_Gujarati } from 'next/font/google';

/**
 * The two faces for an invitation written in Gujarati: a serif for sacred mantras, headings,
 * and names, and a clean sans for running text. Loaded only on a page that imports this file.
 * Use `.className` on the element (or `.variable` to expose the CSS variable), and `lang="gu"`
 * on the section so the browser shapes the text properly and zeroes letter-spacing.
 */
export const gujaratiDisplay = Noto_Serif_Gujarati({
  subsets: ['gujarati', 'latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
});

export const gujaratiBody = Noto_Sans_Gujarati({
  subsets: ['gujarati', 'latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

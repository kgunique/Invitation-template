import { Great_Vibes } from 'next/font/google';
import localFont from 'next/font/local';

/**
 * The two faces of the Kailash–Ganga template, loaded for it alone: a flowing script for the names, and a
 * refined old-style serif (roman and italic) for dates, blessings and headings. The small tracked capitals
 * take the site's own sans.
 */
export const gangaScript = Great_Vibes({ subsets: ['latin'], weight: '400', display: 'swap' });

// Self-hosted: Google sometimes serves this family from the build server under a URL next/font/google can't parse, failing the build.
export const gangaSerif = localFont({
  src: [
    { path: '../../../fonts/cormorant-garamond-latin.woff2', weight: '400 600', style: 'normal' },
    { path: '../../../fonts/cormorant-garamond-latin-italic.woff2', weight: '400 600', style: 'italic' },
  ],
  display: 'swap',
});

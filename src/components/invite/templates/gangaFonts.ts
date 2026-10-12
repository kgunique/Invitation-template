import { Cormorant_Garamond, Great_Vibes } from 'next/font/google';

/**
 * The two faces of the Kailash–Ganga template, loaded for it alone: a flowing script for the names, and a
 * refined old-style serif (roman and italic) for dates, blessings and headings. The small tracked capitals
 * take the site's own sans.
 */
export const gangaScript = Great_Vibes({ subsets: ['latin'], weight: '400', display: 'swap' });

export const gangaSerif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
});

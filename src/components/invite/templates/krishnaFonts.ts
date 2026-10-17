import { Cormorant_Garamond, Great_Vibes } from 'next/font/google';

/** The Krishna–Radha template's two faces, loaded for it alone: a flowing script for the names, an old-style serif for the rest. */
export const krishnaScript = Great_Vibes({ subsets: ['latin'], weight: '400', display: 'swap' });

export const krishnaSerif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
});

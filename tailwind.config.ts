import type { Config } from 'tailwindcss';
import tokens from './tailwind.tokens.json';

/**
 * Every scale here comes from tailwind.tokens.json, which is generated from
 * the design system's tokens.json. Never hand-edit a value into this file:
 * add it to the design system and re-run `npm run tokens`.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    colors: {
      // Replacing theme.colors drops Tailwind's keywords, and `bg-transparent`
      // is load-bearing on the ghost button. Put them back.
      transparent: 'transparent',
      current: 'currentColor',
      inherit: 'inherit',
      ...tokens.colors,
    },
    spacing: tokens.spacing,
    borderRadius: tokens.borderRadius,
    boxShadow: tokens.boxShadow,
    zIndex: tokens.zIndex,
    fontFamily: tokens.fontFamily,
    fontSize: tokens.fontSize as unknown as NonNullable<Config['theme']>['fontSize'],
    extend: {},
  },
  plugins: [],
};

export default config;

# Marry Me

Interactive digital wedding invitations for Indian weddings. Next.js App Router, built on the Marry Me design system.

## Scope

**Weddings only.** No engagement, baby shower, birthday or housewarming categories. Templates vary by *tradition* (Gujarati, South Indian, Punjabi, Marwari, Bengali, Contemporary), never by occasion.

## Getting started

```bash
npm install
npm run dev
```

Open `/` for the scaffold and `/kitchen-sink` for every token and component on one page.

## Design tokens

`src/styles/tokens.json` is exported from the Marry Me design system and is the single source of truth. `scripts/build-tokens.mjs` turns it into:

- `src/styles/tokens.css` — custom properties for light and dark, plus a class per type style
- `tailwind.tokens.json` — the same scale shaped for `tailwind.config.ts`

Both are generated and gitignored. The script runs on `predev` and `prebuild`, so code cannot drift from the system.

**To change a token:** edit it in the design system, re-export `tokens.json`, run `npm run tokens`. Never hand-edit the generated files or put a raw hex value in a component.

## Layer split

| Path | Layer | Changes when |
| --- | --- | --- |
| `src/app/(site)/` | Platform — marketing, gallery, pricing | The business changes |
| `src/app/(invite)/` | Invitation — the invites themselves | A couple orders |

Keep them apart. Mixing them is the decision that costs the most to undo.

## Theme

Three states, handled in `tokens.css`: bare `:root` is light, `@media (prefers-color-scheme: dark) :root:not([data-theme="light"])` covers the unstamped default, and `:root[data-theme="dark"]` lets an explicit toggle win.

## Next up

Phase 1 in the build plan: the invite config schema, the template registry, and the theme token contract.

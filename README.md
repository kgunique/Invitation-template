# Get Invites

Interactive digital wedding invitations for Indian weddings. Next.js App Router, built on the Get Invites design system.

## Scope

**Weddings only.** Engagement, baby shower, birthday and the other tabs on `/templates` are "coming soon" placeholders — nothing is built for them. Templates vary by *tradition* (Gujarati, South Indian, Punjabi, Marwari, Bengali, Contemporary), never by occasion.

## Getting started

```bash
npm install
npm run dev
```

Open `/` for the site, `/templates` for the gallery, `/<slug>` for an invite (e.g. `/kailash-weds-ganga`), and `/kitchen-sink` for every token and component on one page.

## How an invite is rendered

- `src/content/invites.ts` — `INVITES`, one row per couple (stand-in for a future database). A new customer on an existing design is a new row, never a new page.
- `src/components/invite/templates/registry.ts` — `TEMPLATES`, `templateId → component`. A new design is a new entry.
- `src/app/(invite)/[slug]/page.tsx` — the one invite route: looks up the row, renders its template.
- `src/content/templateCatalog.ts` — `LISTINGS` puts each template on `/templates` (and `featured` on the home page).

Templates are compositions of shared parts in `src/components/invite/`. Before building or changing one, read [`ai-doc/rule.md`](ai-doc/rule.md): the rules plus a catalog of every shared component, animation and section.

| Template | Tier | Id |
| --- | --- | --- |
| Gujarati Kankotri (+ yellow variation) | Silver | `gujarati-kankotri`, `gujarati-kankotri-yellow` |
| Gold Envelope | Gold | `gold-envelope` |
| Platinum Temple | Platinum | `platinum-temple` |
| Rudra | Platinum | `rudra` |
| Kailash–Ganga | Platinum | `kailash-ganga` |
| Ganesha Blessings | Platinum | `ganesha-blessings` |

No backend: Order, Contact and RSVP open a prefilled WhatsApp message.

## Design tokens

`src/styles/tokens.json` is exported from the Get Invites design system and is the single source of truth. `scripts/build-tokens.mjs` turns it into:

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

## Motion

Ambient loops are CSS classes in `src/styles/motion.css`; interactive motion is Framer Motion (`m.*` only), loaded in `(invite)/layout.tsx`. See [`src/components/motion/README.md`](src/components/motion/README.md).

## Next up

- A real backend: invites in a database instead of `invites.ts`, RSVP replies stored (`GuestRsvp` has an `onSubmit` with nothing behind it).
- A validated invite config schema (`zod` is installed but unused).
- Licensed artwork: several stock images under `public/art/platinum/` carry watermarks (see `ai-doc/rule.md`, section 2.7).

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Get Invites — interactive digital wedding invitations for Indian weddings, built on Next.js App Router (React 19, Next 15). Weddings only: the only templates are wedding templates. The occasion tabs on `/templates` (Engagement, Baby Shower, Other ▸ Birthday Party, …) are "coming soon" placeholders, not categories being built. Templates vary by *tradition* (Gujarati, South Indian, Punjabi, Marwari, Bengali, Contemporary), never by occasion. This is Phase 0 (scaffold) — see the "Next up" section in [README.md](README.md) for what Phase 1 adds (invite config schema, template registry, theme token contract).

## Commands

```bash
npm run dev         # start dev server (runs npm run tokens first via predev)
npm run build        # production build (runs npm run tokens first via prebuild)
npm run tokens        # regenerate src/styles/tokens.css + tailwind.tokens.json from tokens.json
npm run lint          # next lint
npm run typecheck     # tsc --noEmit
```

No test suite exists yet. There is no `start`-without-`build` workflow worth relying on for iteration — use `dev`.

## Design token pipeline

`src/styles/tokens.json` is exported from the Get Invites design system and is the single source of truth for color, spacing, radius, shadow, z-index, and type styles. `scripts/build-tokens.mjs` compiles it into two generated, gitignored files:

- `src/styles/tokens.css` — CSS custom properties for each theme, plus a class per type style
- `tailwind.tokens.json` — the same scale reshaped for `tailwind.config.ts`

Both regenerate on `predev`/`prebuild`. **Never hand-edit either generated file, and never put a raw hex value or magic number in a component** — add the value to `tokens.json` and run `npm run tokens`. `tailwind.config.ts` pulls every scale from `tailwind.tokens.json`; it only keeps Tailwind's `transparent`/`current`/`inherit` keywords hardcoded (dropped otherwise, and `bg-transparent` is load-bearing on the ghost button variant).

## Gallery

`/templates` (`src/app/(site)/templates/`) lists every template that is built, and the home page shows only the few flagged `featured`. Both read `allTemplates()`/`featuredTemplates()` in `src/content/templateCatalog.ts`; a new template registered in `registry.ts` must get a `LISTINGS` entry there (typecheck enforces it) and then appears on its own. The category tabs live in the header there (`Header`'s `center` slot, `CategoryTabs`), so the page opens straight onto the cards. Its "Other" menu links to `/services` (what an invitation includes, plus the add-ons in `src/content/services.ts`) and `/contact` (a form that opens a prefilled WhatsApp message — there is no backend). Contact details live in `CONTACT` in `src/content/site.ts`; the email and phone there are placeholders.

## Layer split: (site) vs (invite)

Two route groups under `src/app/`, kept deliberately apart:

| Path | Layer | Changes when |
| --- | --- | --- |
| `src/app/(site)/` | Platform — marketing, gallery, pricing | The business changes |
| `src/app/(invite)/` | Invitation — the invites themselves | A couple orders |

Do not mix them or share layout logic across the boundary — this is the decision that costs the most to undo. Concretely: `MotionProvider` is mounted in `(invite)/layout.tsx`, not the root layout, so the marketing site never pays for the Framer Motion bundle.

## Building or changing a template: read `ai-doc/rule.md` first

Templates are compositions of shared parts. **Whatever a template reuses must be shared** (in `src/components/invite/`, generic name, every visual a prop), so the same design with another colour, animation or artwork is a thin wrapper that passes props — never a copy of the template. Every animation must work with any artwork. [`ai-doc/rule.md`](ai-doc/rule.md) holds the rules, the catalog of every shared component/animation/section built so far (with props and where each is used), recipes for a new template/variation/animation, and a checklist. Check the catalog before building, and update it in the same change whenever you add or alter a shared part.

## Motion: two systems, one rule

Ambient motion (loops forever, ignores input) and interactive motion (reacts to tap/drag/scroll) are handled by different systems — see `src/components/motion/README.md` for the full rationale.

- **Ambient → CSS** classes in `src/styles/motion.css` (`.amb-sway`, `.amb-flicker`, `.amb-fall`, `.amb-turn`). Compositor-only, zero JS.
- **Interactive → Framer Motion** (`motion/react`), only inside client components under `src/components/motion/` or `src/components/invite/`. Import Framer Motion only where it's needed — never from a shared layout.

`MotionProvider` loads `domAnimation` (not `domMax`) with `strict`, which makes `motion.div` throw — every call site must use `m.div`/`m.g`/etc. This is intentional: one stray `motion` import silently pulls the full bundle back in.

Reduced motion must be handled in both systems independently: `MotionConfig reducedMotion="user"` (Framer Motion side) and the `prefers-reduced-motion` block in `motion.css` (CSS side). Handling only one leaves half the page still moving.

Motion timing constants are duplicated by hand: `src/styles/motion.ts` (seconds, for Framer Motion) and the `:root` block in `src/styles/motion.css` (ms, for CSS) must be changed together — there's no generator for these yet.

## Theming

Three CSS states, all resolved in the generated `tokens.css`: bare `:root` is light, `@media (prefers-color-scheme: dark) :root:not([data-theme="light"])` covers the unstamped OS-dark default, and `:root[data-theme="dark"]` lets an explicit in-app toggle win over the OS setting.

## Other conventions

- `@/*` resolves to `src/*` (see `tsconfig.json`).
- Fonts are bound via `src/lib/fonts.ts` using `next/font/google`, each exposing a CSS variable (`--font-display-face`, `--font-sans-face`, `--font-festive-face`) that the token CSS references as `var(--font-display)` etc.
- A link is never nested inside a button, or vice versa (see the comment in `src/app/(site)/page.tsx`).
- `src/app/kitchen-sink/page.tsx` renders every token and component on one page — treat it as the visual-regression surface; update it when adding a new token family or UI primitive.

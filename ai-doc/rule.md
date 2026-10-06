# Rules for building invite templates

Read this before you build or change a template, and update it in the same
change whenever you add or alter a shared component (the checklist is at the
end).

> The owner's rule, in their words: while building a template, whatever is
> reused must be **shared**; and the same thing with a different colour,
> animation or other props must never mean rebuilding the whole template.
> Every animation must be reusable with different artwork and assets.

---

## 1. The rules

1. **Look before you build.** Check the catalog (section 2). If a gate, an
   animation, a divider, a button or a section already does 80% of it, use it
   and add a prop for the other 20%.
2. **If a second template (or a second place) could use it, it is shared.**
   Put it in `src/components/invite/` — not inside a template file — under a
   generic name (`EnvelopeLock`, not `GoldEnvelopeCover`; never `Kankotri…`
   for something that isn't Kankotri-specific). Data, copy and helpers that
   both route groups need go in `src/content/`.
3. **Everything visual is a prop.** Colours, gradients, fonts, artwork (image
   paths), copy, sizes, speed, direction, timings, and on/off switches. The
   defaults are the look it was first made for. `SimpleLock`, `EnvelopeLock`
   and `Petals` are the model: a small, typed props object, sensible defaults,
   nothing hard-wired.
4. **A template is a composition, and its file stays thin.** It wires shared
   parts together and owns only what is genuinely its own (its first page, its
   section order). A **variation** — other colours, other animation, other
   artwork — is a *thin wrapper* that passes props (see
   `GujaratiKankotriYellowInvite.tsx`: one `lock` object and a few `show…={false}`).
   Never copy a template to re-skin it.
5. **Every animation works with any artwork.**
   - *Ambient* (loops, ignores input) = a CSS class in `src/styles/motion.css`
     with CSS variables as the knobs. *Interactive or one-shot* = Framer Motion,
     only in the invite layer. Never mix the two on one element's `transform`
     (give the loop its own layer, as `SwingArt` does).
   - Wrap the artwork, don't embed it: take `children` (`SwingArt`,
     `Medallion`) or an image path prop (`KankotriWaiting image`). Never bake a
     file path into an animation.
   - Reduced motion is handled twice: add the class to the
     `prefers-reduced-motion` block in `motion.css` (CSS side); Framer is covered
     by `MotionConfig reducedMotion="user"` in `(invite)/layout.tsx`.
6. **No cross-layer sharing.** `(site)` and `(invite)` stay apart (see
   CLAUDE.md). Invite components import nothing from `components/site`; data both
   need (`content/site.ts`, `content/invites.ts`) lives in `content/`.
7. **Names live in one place.** A template's display name is in
   `TEMPLATE_NAMES` (`content/site.ts`); the gallery card and the invite's Order
   button both read it.
8. **Chrome is shared.** Back = `BackLink`. Order = `OrderButton` /
   `FloatingOrderBar` (opens WhatsApp with the enquiry). Don't hand-roll either.
9. **Pin the palette on fixed-colour surfaces.** A section on cream paper, or a
   night sky, sets its own `--invite-*` / `--ink-*` variables on its root (the
   `SECTION_COLORS` pattern) so an OS-dark visitor doesn't get dark tokens on a
   light page. Expose them as a `colors` / `theme` prop when the component is
   meant to be re-coloured.
10. **No `Math.random()` or `Date.now()` in render.** Server and client must
    draw identical markup. Use a fixed table or an integer sequence (see
    `Starfield`, `Petals`, the torn edge in `KankotriLetter`).
11. **Record what you built** (section 5 checklist).

### Tailwind gotchas that have bitten this repo

The theme *replaces* Tailwind's scales; a missing key silently produces no CSS.

- Spacing keys exist only for `1 2 3 4 5 6 8 10 12 16 20 24 32`. For anything
  else (`0`, `7`, `9`, `14`, `px`) use an arbitrary value: `inset-[0]`,
  `h-[1px]`, `pt-[14px]`.
- Radius keys: `xs sm md lg xl pill`. There is **no** `rounded-full` — use
  `rounded-pill` (without it, circles render square).
- Colours are CSS variables, so `/NN` opacity modifiers produce nothing. Use
  `color-mix(in srgb, var(--x) NN%, transparent)` as an arbitrary value.
- `.label` carries its own letter-spacing; to set your own, use `caption` /
  `body-sm` plus `font-bold` and `tracking-[…]` instead.
- Never hand-edit `tokens.css` / `tailwind.tokens.json`; edit `tokens.json`.

---

## 2. Catalog of shared parts

Paths are under `src/components/invite/` unless noted. "Used by" = where it
runs today.

### 2.1 Opening screens ("gates")

A gate is a full-screen overlay mounted over the page it reveals. Contract:
`onOpen` fires when the page underneath should start its entrance, `onOpened`
when the gate has removed itself; the sequence is **timer-driven** (never wait
on an animation callback, a hidden tab would leave the screen stuck); tapping
calls `scrollToTop()` so the invite always starts from the top.

| Name | File | What it is | Main props | Used by |
| --- | --- | --- | --- | --- |
| `SimpleLock` | `SimpleLock.tsx` | Two solid panels meet at a gold seam with a key-lock on it. Tap: the key turns, the left panel slides left and the right slides right, petals fall. | content: `eyebrow title message buttonLabel lockLabel topLeft bottomLeft`; look: `colors{accent,ink,inkSoft,petal} gradient{from,to,angle} depth fonts{title,body} frame lockSize keySize`; motion: `rotation rotationDuration openDuration openEase petals{ambient,burst}`; `onOpen onOpened` | Silver, Yellow |
| `EnvelopeLock` | `EnvelopeLock.tsx` | A sealed envelope with a gold light running round its edge like a snake. Tap: seal pops, flap folds back in 3D, a letter rises out, cover fades. No background of its own (shows the page's sky). | content: `eyebrow title initials sealLabel letterLabel buttonLabel lockLabel`; look: `colors{accent,ink,paper,flap,sealFrom,sealTo,sealInk,letter,letterInk} width` (max px, default 420; fills a phone minus a 12px margin); motion: `snake(false \| {duration}) openMs fadeMs`; `onOpen onOpened` | Gold |
| `GateScene` | `GateScene.tsx` | Phase-0 scaffold gate (doors + camera push). **Unused and legacy** — do not build on it; its two type errors are the known baseline. | — | nothing |

### 2.2 Animations and artwork wrappers

| Name | File | Animation | Reuse with other artwork / assets | Used by |
| --- | --- | --- | --- | --- |
| `Petals` | `Petals.tsx` | Petals drifting in any direction (leaf or heart shaped); ambient loop or one-shot burst; optionally popping (bursting into being at the start, swelling and vanishing like a bubble at the end). | `color` (one or an array), `count`, `speed`, `direction down\|up\|left\|right`, `size [min,max]`, `shape leaf\|heart`, `pop`, `fit` (travel exactly the container's own height/width instead of the screen's, so a section-sized shower fades at its far edge), `loop`, `onDone`. Any colour/direction/pace. | SimpleLock (ambient + burst), KankotriWaiting (up), CountdownReveal (confetti), RsvpSection (thank-you), ArchClosing (red hearts) |
| `Starfield` | `Starfield.tsx` | Twinkling stars + two faint constellations. | `color`, `count` (≤ 80), `constellations`. Fills the nearest positioned ancestor; put any gradient behind it. | GoldEnvelopeInvite |
| `SwingArt` | `SwingArt.tsx` | Rocks children forward and back from the top edge, with real depth (perspective). | Takes any `children` (an `Image fill`, an SVG). Knobs are CSS variables you can set on any ancestor: `--swing-angle` (9deg), `--swing-dur` (2.8s one way), `--swing-pivot` (50% 4%). Wrap artwork whose hanging point is at its top edge. | Silver hero, KankotriWaiting |
| `Medallion` | `Medallion.tsx` | Round badge: two dashed rings counter-rotating, sparkles that slip out, drift and pop. | `accent`, `children` (emoji / icon / image in the 58px core), `phase` (stagger). Knobs `--ring-dur`, `--spark-dur`. Pins `--surface-raised` for the core. | KankotriSchedule |
| `HeartNames` | `HeartNames.tsx` | Two names start at opposite sides, drift together and are packed inside a red heart that pops in and then beats (CSS `amb-beat`). Plays once, when scrolled into view. | `left`, `right`, `heart [top,bottom]` (fill), `ink`, `inkOnHeart`, `joinAfter` (s apart before joining), `onJoined`. Any two names, any colours. 250px-tall stage; the names start at ¼ and ¾ of the parent's width. | CoupleScene |
| `CoupleScene` | `CoupleScene.tsx` | Opening scene for a dark page: the couple's artwork (4:5 frame, dissolving into the page at top and bottom, slow zoom-in) with `HeartNames` under it — groom's name on his side, bride's on hers. | `image`, `alt`, `left` (groom), `right` (bride), `focus` (CSS object-position to crop a landscape picture), `heart` (HeartNames overrides). Any artwork with the groom on the left. | GoldEnvelopeInvite |
| `MarryMeCredit` | `MarryMeCredit.tsx` | "Designed with Love by Marry Me": an optional beating heart, the tracked line, the brand linking to the site. Renders as motion children, so it joins its parent group's stagger. The closing credit of every invite. | `heart`, `compact`. Colours come from the section (`--ink-muted`, `--invite-metal`). | KankotriClosing, ArchClosing |
| `GiftRegistry` | `GiftRegistry.tsx` | A gift box (SVG, floats gently): tap and the lid lifts in a glow, then a card shows the registry — what it is, whom it is paid to, and lines that each copy with one tap; "Close box" puts the lid back. Takes `InviteRegistry`. A motion child (`fadeUp`), so put it inside a motion group. | `registry{method?,holder,details[{label,value}]}`, `openLabel`, `closeLabel`. Follows the section's accent and `--surface-raised`. | Gold (inside DetailsSection) |
| `GoldDivider` | `GoldDivider.tsx` | Diamond pops, lines draw outward. Joins a parent's stagger. | `className`. Colour = `--invite-metal` of the section. | Silver sections, Gold first page |
| `ScratchCard` | `ScratchCard.tsx` | Canvas scratch-off foil over any content; reveals past a threshold, then fades. | `children` (what is underneath), `label`, `colors[]`, `angle`, `brushSize`, `revealAt`, `revealLabel`, `className`, `style`, `onReveal`. Works with any content. | CountdownReveal |
| `RevealLines` | `RevealLines.tsx` | Line-by-line text rise, plus `fadeUp` for blocks. | `lineGroup(delay)` (the parent's `variants`), `RevealLine`, `lineRise`, `fadeUp`. Pattern: `<m.div variants={lineGroup(0.2)} initial="hidden" whileInView="shown" viewport={{ once: true }}>`; other children with `hidden/shown` variants join the stagger. | every section |

### 2.2b Shared sections (full-width blocks of a page)

Every one takes `colors` (a `SectionColors`, see `sectionTheme.ts`) and
`background`, so the same section sits on a cream page or a night sky. **Defaults
are the Silver cream/plum look and a transparent background**; a template passes
its own palette. They reveal on scroll and need no wrapper. Pass
`sectionVars`-style colours from your theme (see `GoldEnvelopeInvite`, which maps
its `NightTheme` to a `SectionColors`).

| Name | File | What it is | Main props | Used by |
| --- | --- | --- | --- | --- |
| `sectionTheme` | `sectionTheme.ts` | `SectionColors {ink, body, muted, accent, raised, line, danger}`, `LIGHT_SECTION` defaults, `sectionVars(colors)` (pins the CSS variables the shared pieces read). | — | all sections below |
| `CountdownReveal` | `CountdownReveal.tsx` | Date reveal: heading, a scratch card (`ScratchCard`) over a ticking countdown card, confetti on reveal. | `weddingDate`, `venue`, `timeZone`, `heading[]`, `label`, `foil[]`, `confetti[]`, `cardBackground`, `background`, `colors` | Silver (`KankotriCountdown` wrapper), Gold |
| `ArchTimeline` | `ArchTimeline.tsx` | Schedule as a timeline: a vertical line with a node per event and an arch-topped card under each (icon, 12-hour time, title, place as a Maps link, description). Line draws, node pops, card rises as each scrolls in. Takes `InviteEvent[]`. | `events`, `weddingDate`, `timeZone`, `title`, `subtitle`, `background`, `colors` | Gold |
| `VenueSection` | `VenueSection.tsx` | "Location": framed artwork square, venue name, address, "View on Google Maps". Without artwork it draws a starlit palace in the accent colour. Takes `InviteLocation`. | `location{name,address,image?,mapsUrl?}`, `eyebrow`, `title`, `buttonLabel`, `background`, `colors` | Gold |
| `DetailsSection` | `DetailsSection.tsx` | "Wedding details": a heart, title and divider, then one framed card per detail (icon, title, text, optional gold line / tap-to-call), then whatever you pass as `children` (the gift registry). Takes `InviteDetail[]`. | `details`, `title`, `cardBackground` (default Silver's cream), `background`, `colors`, `children` (motion children join the reveal) | Silver (`KankotriDetails` wrapper), Gold |
| `ArchClosing` | `ArchClosing.tsx` | The night page's closing: an arched double frame under twinkling stars, planets and a moon (drawn); inside it a tagline, the names, the date and `MarryMeCredit`; at its foot a small arched cameo of the couple's picture (a silhouette if none). Red hearts rain down the whole section, popping in and out. Frame floats up, then the lines rise, then the cameo. | `bride`, `groom`, `weddingDate`, `timeZone`, `tagline` (default "We will be so happy if you come"), `portrait` (the cameo picture), `portraitFocus`, `hearts` (colours, or `false`), `background`, `colors` | Gold |
| `RsvpSection` | `RsvpSection.tsx` | The RSVP form: reply (yes/maybe/no), plus members as a count stepper, celebrations, meal, note; submit opens WhatsApp with the reply written out, then a thank-you card (petals on yes). | `rsvp`, `bride`, `groom`, `events`, `timeZone`, `heading[]`, `intro`, `ctaLabel` (set it and the form opens from a button under the heading instead of showing at once), `confetti[]`, `background`, `colors`. Private helpers worth lifting if another form appears: `Choice`, `Collapse`, `StepButton`, `SummaryRow`, `buildMessage`. | Silver (`KankotriRsvp` wrapper), Gold |

### 2.3 CSS ambient classes (`src/styles/motion.css`)

Each is a class plus variables. All stop under `prefers-reduced-motion`.

| Class | Effect | Knobs |
| --- | --- | --- |
| `amb-sway` (`--hang`) | gentle leaf/garland sway | durations per element |
| `amb-flicker` | flame flicker | — |
| `amb-fall` | falling petal (older) | `--fall-to --drift` |
| `amb-petal` | petal in any direction (used by `Petals`) | `--dx --dy --spin --petal-dur --petal-delay --petal-iter` |
| `amb-turn`, `amb-spin`, `amb-spin-slow` | slow rotation / loader spin / badge spin | — |
| `amb-ring` (`--rev`) | dashed ring turning (must be dashed to be visible) | `--ring-dur` |
| `amb-spark` | sparkle drifts out and pops | `--sx --sy --spark-dur --spark-delay` |
| `amb-swing-depth` | forward/back pendulum (parent needs `perspective`; use `SwingArt`) | `--swing-angle --swing-dur --swing-pivot` |
| `amb-twinkle` | star twinkle | `--tw-base --tw-dur --tw-delay` |
| `amb-snake` | light travelling an SVG outline; stack long-faint to short-bright rects with `pathLength="100"`; each gets a negative `animation-delay` of (longest − its length)/100 × lap so the heads stay level (keyframes are plain `0 → -100`: mixing a unitless value with `calc()` doesn't interpolate in Chrome and the light sits still) | `--snake-dur`, per-rect `animation-delay` |
| `amb-beat` | heartbeat | — |
| `amb-bounce` | gentle bob | — |
| `amb-petal--pop` | the popping variant of `amb-petal` (used by `Petals pop`): swells in at the start, swells out at the end; the fall stays even | same variables as `amb-petal` |

Timing constants live twice and must change together: `src/styles/motion.ts`
(seconds) and the `:root` block of `motion.css` (ms).

### 2.4 Shared chrome and helpers

| Name | File | What | Props |
| --- | --- | --- | --- |
| `BackLink` | `BackLink.tsx` | The "Back" pill to the site. | `tone: 'gate' (gold on dark) \| 'page' (ink on light)` |
| `OrderButton` | `OrderButton.tsx` | "Order Now" → WhatsApp with the enquiry (template name + the page's own URL). | `templateName`, `className` |
| `FloatingOrderBar` | `OrderButton.tsx` | Order Now (left) + optional music toggle (right), pinned to the bottom in the phone-width column. | `templateName`, `music`, `delay`, `style` |
| `scrollToTop` | `scrollToTop.ts` | Instant jump to the top. Call it when a gate is tapped. | — |
| `formatDay`, `formatTime` | `dates.ts` | "February 21st, 2027" / "19:00" or "07:00 PM", fixed locale + IANA zone so server and client agree. | `formatDay(iso, timeZone, month?)`, `formatTime(iso, timeZone, hour12?)` |
| icons | `icons.tsx` | `BackIcon EnvelopeIcon ChatIcon KeyIcon PinIcon ArrowUpRightIcon HeartIcon PhoneIcon GiftIcon NavigationIcon PauseIcon`. Invite-layer copies on purpose; add new ones here. | `className` |

UI primitives (shared by both layers, `src/components/ui/`): `Button`
(variants `primary accent ghost order`), `Field` (labelled input with error),
`TierBadge`.

### 2.5 Content and data (`src/content/`)

| File | What |
| --- | --- |
| `invites.ts` | `INVITES`: one row per customer — `slug bride groom venue tier tradition templateId greeting coupleImage waitingImage weddingDate events details rsvp location registry`. A new customer on an existing template is a new row, never a new page file. Types: `InviteEvent`, `InviteDetail`, `InviteRsvp`, `InviteLocation`, `InviteRegistry`. |
| `site.ts` | `BRAND_NAME`, `ORDER_WHATSAPP` (91 8083499618, placeholder number), `TEMPLATE_NAMES`, `whatsappOrderUrl(templateName, previewUrl?)`. |
| `traditions.ts` | `TRADITIONS`, `TIERS` (silver 999, gold 1499, platinum 1999). |
| `templates/registry.ts` (under `components/invite/`) | `TEMPLATES`: `templateId → component`. A new design = one new entry. |

### 2.6 Silver sections (the `Kankotri*` files in `templates/`)

Written for Silver but not Silver-specific in structure. Each reveals on scroll,
takes its data as props, and pins its own palette in a `SECTION_COLORS`
constant. To use one in another template, import it as is; to re-colour it, add
a `colors` prop in the `SimpleLock` style (do not copy the file); if you do add
it, record it here.

| Section | Props | Notes for reuse |
| --- | --- | --- |
| `KankotriLetter` | `image` (archway/frame, 4:3 transparent), `heading[]`, `paragraphs[]` | Its torn-paper top edge assumes a **pure-white page directly above** and overlaps it (`-mt-16`). The tear helpers (`hash`, `noise`, `tornBottom`) are private — lift them to a `TornEdge` component if a second template wants a torn edge. |
| `KankotriCountdown` | `weddingDate`, `venue`, `timeZone` | Thin wrapper: the shared `CountdownReveal` on a white page. |
| `KankotriSchedule` | `events[]`, `weddingDate`, `timeZone` | Cards with accent bar, date/time pills, Google Maps link; timeline with `Medallion`s. Per-event accents in `ACCENTS`. |
| `KankotriDetails` | `details[]` (`icon 'phone'\|'gift'`) | Thin wrapper: the shared `DetailsSection` on the cream-to-white sheet. Add icons to its `ICONS` map for more kinds. |
| `KankotriRsvp` | `rsvp`, `bride`, `groom`, `events`, `timeZone` | Thin wrapper: the shared `RsvpSection` on the white-to-cream sheet, form open from the start. |
| `KankotriWaiting` | `bride`, `groom`, `image`, `swing` | Heading, divider, artwork (with `SwingArt` + rope-top mask), sign-off, rising `Petals`. Pass any artwork; `swing={false}` for artwork that isn't a swing. |
| `KankotriClosing` | none | Divider, the shared `MarryMeCredit` (beating heart, "Designed with Love by Marry Me"), two bouquets that rise and sway. |

### 2.7 Templates today

| Template | Tier | Id | Composition |
| --- | --- | --- | --- |
| `GujaratiKankotriInvite` | Silver | `gujarati-kankotri` | `SimpleLock` over `RevealHero` (names + `SwingArt` couple) + the Silver sections + `FloatingOrderBar`. Props: `lock`, `templateName`, `show…` switches, section data. |
| `GujaratiKankotriYellowInvite` | Silver (variation) | `gujarati-kankotri-yellow` | The above with a yellow `lock` object and every section switched off. **The pattern to copy for a variation.** |
| `GoldEnvelopeInvite` | Gold | `gold-envelope` | `Starfield` sky + `EnvelopeLock`, then `CoupleScene` (artwork, names into a heart), a first page, `CountdownReveal`, `ArchTimeline`, `VenueSection`, `DetailsSection` (+ `GiftRegistry`), `RsvpSection`, `ArchClosing` (all given the theme's colours; the closing's cameo is `coupleImage`) + `BackLink` + `FloatingOrderBar`. Props: `coupleImage` (omit and it starts at the text), `events`, `location`, `details`, `registry`, `rsvp`, `weddingDate`, `show{Countdown,Schedule,Location,Details,Rsvp,Closing}`, `theme{sky,accent,ink,inkSoft,ground,card,foil,confetti}`, `lock`, `stars`, `templateName`. The theme is mapped to a `SectionColors` inside the template. |

---

## 3. Recipes

**A new template**
1. Read section 2. List what the design needs and mark what already exists.
2. Build only what is new, as shared parts in `invite/` with props (rule 3).
3. Add the template file under `templates/`, composing the parts; add it to
   `registry.ts`, a name to `TEMPLATE_NAMES`, a sample row to `invites.ts`.
4. Use `BackLink`, `OrderButton`/`FloatingOrderBar`, `scrollToTop` on the gate.
5. Add its card to the gallery in `components/site/Templates.tsx` (screens are
   screenshots of the live invite in `public/templates/`; see below).
6. Update this file.

**A variation (new colours / animation / artwork)** — a wrapper, nothing more:

```tsx
export function GoldEnvelopeRoseInvite(props: Omit<GoldEnvelopeInviteProps, 'theme' | 'lock' | 'stars'>) {
  return (
    <GoldEnvelopeInvite
      {...props}
      templateName={TEMPLATE_NAMES['gold-envelope-rose']}
      theme={{ sky: 'linear-gradient(#5a2a3f, #2e1424)', accent: '#f1c5a4' }}
      lock={{ colors: { paper: '…', flap: '…' }, snake: { duration: 3 } }}
      stars={{ count: 30, constellations: false }}
    />
  );
}
```

**A new animation** — decide ambient vs interactive (rule 5). Ambient: a class in
`motion.css` + knobs as CSS variables + a reduced-motion entry + a row in 2.3;
if it needs structure (perspective parent, layers) wrap it in a component taking
`children`, like `SwingArt`. Interactive: Framer variants in a component that
takes the artwork as `children`/props.

**Checking it in the browser pane**: a hidden pane freezes animations and
observers (a `computer` screenshot wakes it, so a Framer scene only starts
playing when you take one). An *emulated* phone size crops screenshots on the
right; for a full-width picture use the pane's own desktop size (the invite
column is only 480px wide there). To hold a timer-driven stage for a screenshot,
patch `window.setTimeout` for that one delay before tapping (match the exact ms,
not a range — a broad patch also stalls the boot loader).

**Gallery screenshots**: capture the live invite at 375×812 (gate and opened
state), hide the Next dev badge (`document.querySelector('nextjs-portal').style.display='none'`),
convert with `sharp` to ~480px-wide `.webp` in `public/templates/`.

---

## 4. Known gaps (reuse backlog)

Not yet generic — fix when a second template needs them, not before, and update
section 2 when you do:

- `KankotriLetter`, `KankotriSchedule`, `KankotriWaiting` and `KankotriClosing`
  still pin their palette in a constant instead of taking a `colors` prop
  (`CountdownReveal`, `RsvpSection` and `DetailsSection` were generalised when
  Gold needed them; do the same for these when a second template needs one), and
  `KankotriClosing` / `KankotriWaiting` have their copy inline.
- The torn-paper edge (`KankotriLetter`) and the form helpers (`RsvpSection`)
  are private to their files.
- `SimpleLock` and `EnvelopeLock` each carry their own small timer-driven stage
  machine; a shared hook would fit once a third gate exists.
- The music buttons are visual only (no audio yet); Order/Back chrome is shared
  but the Silver hero's names block is still inline in `GujaratiKankotriInvite`.

---

## 5. Checklist before you finish a template change

- [ ] Anything a second template could use is in `invite/` (or `content/`), generic, prop-driven.
- [ ] No colour, copy, timing or asset path is hard-wired where a prop would do; defaults keep the original look.
- [ ] A variation would be a thin wrapper, not a copy.
- [ ] New ambient animation: CSS class + variables + reduced-motion entry; new interactive animation: Framer, invite layer only.
- [ ] Chrome uses `BackLink` / `OrderButton` / `FloatingOrderBar`; name is in `TEMPLATE_NAMES`.
- [ ] Ambient animations **verified moving**, not just present: read the animated property (`getComputedStyle(el).strokeDashoffset`, `transform`, …) at two moments in a visible tab and see it change. A hidden browser pane freezes timelines (a `computer` screenshot wakes it), so take the readings with screenshots in between.
- [ ] No `Math.random()` / `Date.now()` in render; dates use `dates.ts` with an explicit zone.
- [ ] `npm run typecheck`: only the known baseline (2 in `GateScene.tsx`, 1 in `tailwind.config.ts`).
- [ ] **This file updated**: new or changed shared parts added to section 2, backlog trimmed in section 4.

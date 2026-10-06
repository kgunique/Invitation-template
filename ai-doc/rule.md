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
calls `scrollToTop()` so the invite always starts from the top. `EnvelopeLock`
and `PhotoLock` get all of that from the shared hook `useOpenSequence`
(`useOpenSequence.ts`: `{ openMs, fadeMs, onOpen, onOpened }` →
`{ stage, opening, fading, open }`) — a new gate that follows the same
closed → opening → open → revealed timeline should use it, not re-write it.

| Name | File | What it is | Main props | Used by |
| --- | --- | --- | --- | --- |
| `SimpleLock` | `SimpleLock.tsx` | Two solid panels meet at a gold seam with a key-lock on it. Tap: the key turns, the left panel slides left and the right slides right, petals fall. | content: `eyebrow title message buttonLabel lockLabel topLeft bottomLeft`; look: `colors{accent,ink,inkSoft,petal} gradient{from,to,angle} depth fonts{title,body} frame lockSize keySize`; motion: `rotation rotationDuration openDuration openEase petals{ambient,burst}`; `onOpen onOpened` | Silver, Yellow |
| `EnvelopeLock` | `EnvelopeLock.tsx` | A sealed envelope with a gold light (`SnakePaths`) running round its edge like a snake. Tap: seal pops, flap folds back in 3D, a letter rises out, cover fades. No background of its own (shows the page's sky). | content: `eyebrow title initials sealLabel letterLabel buttonLabel lockLabel`; look: `colors{accent,ink,paper,flap,sealFrom,sealTo,sealInk,letter,letterInk} width` (max px, default 420; fills a phone minus a 12px margin); motion: `snake(false \| {duration}) openMs fadeMs`; `onOpen onOpened` | Gold |
| `PhotoLock` | `PhotoLock.tsx` | A full-screen photograph or painting with a glowing disc floating over it: gold ring that breathes, a halo that ripples out, a monogram ("A & P", the "&" in gold) and a "Tap to open" line whose text glows. Tap: the disc swells and fades while the camera pushes into the picture (toward `zoomOrigin`), the screen washes to light, then the cover fades to the page. Any picture, any monogram. | `image`, `imageAlt`, `focus` (object-position), `zoomOrigin` (transform-origin the camera walks into — the doorway), `zoom`; `initials`, `label`, `lockLabel`, `size`, `top`, `ornament`; `colors{accent,ink,disc,flash}`; `openMs`, `fadeMs`; `onOpen onOpened` | Platinum |
| `GateScene` | `GateScene.tsx` | Phase-0 scaffold gate (doors + camera push). **Unused and legacy** — do not build on it. | — | nothing |

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
| `BananaTree` | `BananaTree.tsx` | A banana plant, drawn as an illustration: a ringed stem, six torn two-toned leaves (shaded half and lit half either side of a pale midrib, each sawtooth-edged, with veins), an optional bunch of bananas and maroon flower under the crown, and an optional ground (soft shadow plus young leaves at the foot). Every leaf, and every young leaf, sways on its own pace and delay (so it moves like a plant, not one rigid shape). The leaf is drawn once in `<defs>` and `<use>`d by all of them. Scales to the width you give it. No JS. | `mirror`, `phase` (shifts every leaf's timing, so two trees don't move in step), `sway` (degrees each leaf leans, default 3.2), `still`, `fruit`, `extend` (taller trunk, in drawing units, for a stem that runs off the page), `ground`, `colors{leaf[[shade base,tip],[lit base,tip]],rib,vein,stem[2],fruit[2],flower[2]}`, `className` (put the width and position here). The same trick suits any plant or hanging garland: draw one part, `<use>` it inside `<g transform="translate rotate scale">` and give the inner `<g>` the `amb-sway` class. | PlatinumTempleInvite |
| `ScrollHint` | `ScrollHint.tsx` | The "scroll down" mouse: an outlined mouse whose wheel notch runs down and fades, a chevron bobbing under it; also a button that scrolls a screen down (smoothly unless reduced motion). | `label`, `by` (share of the screen scrolled per tap), `className` (set a text colour: it is `currentColor`) | PlatinumTempleInvite |
| `SnakePaths` | `SnakePaths.tsx` | A gold light running along any outline like a snake: three stacked strokes, long and faint to short and bright, with the heads kept level (the `amb-snake` class). Drop it inside your own `<svg fill="none">` whose viewBox is the shape's, and give that svg a drop-shadow filter for the glow. | `d` (any SVG path, followed from its first point round to the last), `color`, `duration` (s per lap) | EnvelopeLock (the envelope's edge), PlatinumTempleInvite (the arch's edge) |
| `useCountdown` | `useCountdown.ts` | Hook: `{days, hours, minutes, seconds}` as zero-padded strings, ticking every second toward an ISO date; zeros until mounted (so server and client markup agree), and zero once the date has passed. | `weddingDate` | CountdownReveal, GateCountdown |
| `Grain` | `Grain.tsx` | A veil of fine warm film grain over whatever it fills (nearest positioned ancestor), so a flat gradient reads as paper instead of a screen. Pointer-transparent. Also `grainBackground(opacity)`: the same grain as one CSS background layer (`background: ${grainBackground(0.2)}, #e6d0a0`), for places an overlay can't reach, such as a clipped shape. | `opacity` (0.15–0.3 is a whisper that still helps) | PlatinumTempleInvite, TornEdge users |
| `TornEdge` | `TornEdge.tsx` | The bottom edge of a sheet of paper, torn: a strip in the sheet's colour with a ragged lower edge (four octaves of deterministic noise, so no two stretches repeat and server and client agree), a thin darker fibre `rim` under it and a soft drop shadow. Put it at the top of the section that follows, inside a `relative` parent; it carries the sheet past the section's edge and ends it in a tear, so two sections of different paper merge instead of meeting in a straight line or a gap. Things that should hang from beneath the paper (bells) or rise from behind it (a half mandala) sit under it in the DOM. `tornBottom(seed, base, amp)` is exported for other tears. | `sheet`, `rim` (any CSS background: pass grain in it), `base` (mean depth px, 24), `amp` (px, 20), `seed`, `shadow` (colour or `false`). It is `base + amp + 6` px tall. | KankotriLetter (white sheet over cream), PlatinumTempleInvite (landing over the couple section) |
| `TempleSkyline` | `TempleSkyline.tsx` | A skyline of South Indian temples in three layers of gold (SVG): far, pale gopurams, a ribbed-domed vimana and coconut palms; in the middle, gopurams and vimanas carved with rows of niches; in front, a pillared mandapam (roof slabs, kudu arches, kalasams, capped pillars with brackets), compound walls with arched niches, a small shrine and a tall seven-tier gopuram with a flag. Every tower has a plinth and doorway, tiers with cornices, little kudu arches and end finials, a barrel roof with a ridge and three kalasams. Each layer is paler at its top, and the carved niches show in a lighter/deeper tone, so it reads as relief. Built from helpers (`gopuram`, `vimana`, `mandapam`, `wall`, `palm`) returning a `solid` and a `cut` path. Meant to run along the foot of a section over a ground band of the `near` colour. | `colors{far,mid,near}`, `className` (width; 400 : 156) | PlatinumTempleInvite (QuoteSection, ThankYouSection) |
| `Mandala` | `Mandala.tsx` | A gold line mandala (SVG): ring of dots, scalloped edge, layered petal rings (12 / 12 / 8) down to a rosette; turns slowly (`amb-turn`, CSS only). Square; meant to sit behind a picture, half covered by it or cut off by the page edge. | `color` (any CSS colour; the petals take a faint wash of it), `turn` (`cw` | `ccw` | `false`: a mirrored pair turn opposite ways), `duration` (s per turn), `className` (width + position) | MeetTheCouple |
| `HangingBells` | `HangingBells.tsx` | Two strings of marigold beads (one long, one short) hanging from the top of a page, a bell at the foot of each. Each string swings from its top and its bell swings further and quicker, so they ring left and right, never in step (`amb-sway amb-sway--hang`, pivots set in viewBox units so the nested swing is exact). Pointer-transparent. | `mirror` (the top-right corner), `colors{bead[2],bell[2],trim}`, `className` (84×200 drawing; width + position). Same trick for any hanging thing: nest two `amb-sway--hang` groups with `transformBox:'view-box'` and a pivot per group. | MeetTheCouple |
| `HangingDiyas` | `HangingDiyas.tsx` | Lamps hanging from the top of a page as across a wedding doorway: four chains (links drawn as thin ovals), each ending in a lit diya (flame, bowl, lotus fanned under it), and between them a diya in a ring of petals on two short chains. Every chain swings from its top, every lamp further and quicker from the foot of its chain (nested `amb-sway amb-sway--hang`, pivots in viewBox units), never in step; each flame flickers (`amb-flicker`), the petal ring turns very slowly (`amb-turn`). Pointer-transparent. | `colors{chain,flame[2],bowl}`, `className` (width; 375 : 200, hangs from its top edge) | EventsSection |
| `GoldDivider` | `GoldDivider.tsx` | Diamond pops, lines draw outward. Joins a parent's stagger. | `className`. Colour = `--invite-metal` of the section. | Silver sections, Gold first page |
| `ScratchCard` | `ScratchCard.tsx` | Canvas scratch-off foil over any content; reveals past a threshold, then fades. | `children` (what is underneath), `label`, `colors[]`, `angle`, `brushSize`, `revealAt`, `revealLabel`, `className`, `style`, `onReveal`. Works with any content. | CountdownReveal |
| `RevealLines` | `RevealLines.tsx` | Line-by-line text rise, plus `fadeUp` for blocks. `RevealLine` clips each line (a little wider than it is tall-padded, so italic overhangs and descenders are not cut). | `lineGroup(delay)` (the parent's `variants`), `RevealLine`, `lineRise`, `fadeUp`. Pattern: `<m.div variants={lineGroup(0.2)} initial="hidden" whileInView="shown" viewport={{ once: true }}>`; other children with `hidden/shown` variants join the stagger. | every section |

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
| `ArchTimeline` | `ArchTimeline.tsx` | Schedule as a timeline: a vertical line with a node per event and an arch-topped card under each (icon, 12-hour time, title, place as a Maps link, description). Line draws, node pops, card rises as each scrolls in. Takes `InviteEvent[]`. | `events`, `weddingDate`, `timeZone`, `title`, `subtitle`, `heading` (false leaves its heading block out, for a page that puts its own above), `background`, `colors` | Gold |
| `VenueSection` | `VenueSection.tsx` | "Location": framed artwork square, venue name, address, "View on Google Maps". Without artwork it draws a starlit palace in the accent colour. Takes `InviteLocation`. | `location{name,address,image?,mapsUrl?}`, `eyebrow`, `title`, `buttonLabel`, `background`, `colors` | Gold |
| `DetailsSection` | `DetailsSection.tsx` | "Wedding details": a heart, title and divider, then one framed card per detail (icon, title, text, optional gold line / tap-to-call), then whatever you pass as `children` (the gift registry). Takes `InviteDetail[]`. | `details`, `title`, `cardBackground` (default Silver's cream), `background`, `colors`, `children` (motion children join the reveal) | Silver (`KankotriDetails` wrapper), Gold |
| `ArchClosing` | `ArchClosing.tsx` | The night page's closing: an arched double frame under twinkling stars, planets and a moon (drawn); inside it a tagline, the names, the date and `MarryMeCredit`; at its foot a small arched cameo of the couple's picture (a silhouette if none). Red hearts rain down the whole section, popping in and out. Frame floats up, then the lines rise, then the cameo. | `bride`, `groom`, `weddingDate`, `timeZone`, `tagline` (default "We will be so happy if you come"), `portrait` (the cameo picture), `portraitFocus`, `hearts` (colours, or `false`), `background`, `colors` | Gold |
| `RsvpSection` | `RsvpSection.tsx` | The RSVP form: reply (yes/maybe/no), plus members as a count stepper, celebrations, meal, note; submit opens WhatsApp with the reply written out, then a thank-you card (petals on yes). | `rsvp`, `bride`, `groom`, `events`, `timeZone`, `heading[]`, `intro`, `ctaLabel` (set it and the form opens from a button under the heading instead of showing at once), `confetti[]`, `background`, `colors`. Private helpers worth lifting if another form appears: `Choice`, `Collapse`, `StepButton`, `SummaryRow`, `buildMessage`. | Silver (`KankotriRsvp` wrapper), Gold |
| `MeetTheCouple` | `MeetTheCouple.tsx` | "Meet the couple": `HangingBells` in both top corners, eyebrow + italic title + `GoldDivider`, then the groom and the bride: a picture in a leaf-cornered frame with a `Mandala` turning behind it (groom: on the right, clockwise; bride: on the left, the other way), tracked label, name, italic blessing, family line in a card with a gold edge on the mandala-less side. A person with no picture gets "Groom Photo" / "Bride Photo" written in the frame. Reveals on scroll (header lines rise; frames rise as the mandalas swell out). Takes `InvitePerson`s. | `groom`, `bride` (`{name, image?, blessing?, family?}`), `eyebrow`, `title`, `groomLabel`, `brideLabel`, `groomPhotoLabel` / `bridePhotoLabel` (what an empty frame says: "Groom Photo"), `portraitBackdrop` (what portraits stand on: default a pale watercolour wash with a faint gold arch that a cut-out shows through), `groomBlessing`, `brideBlessing`, `topArt` (artwork centred on the section's top edge, behind whatever covers it: the half above stays hidden and the lower half rises out, e.g. a `Mandala` under a `TornEdge`; the header makes room), `bells` (`false` or `HangingBellsColors`), `cardBackground`, `background`, `colors` | Platinum |
| `QuoteSection` | `QuoteSection.tsx` | A pulled quote: italic serif in a frosted, softly outlined card (translucent, `backdrop-blur`, so decoration beneath shows blurred through it) with a tracked "— A Divine Promise" under it, decoration at the card's two sides and a scene along the section's foot. The card rises, then the scene rises behind it. | `quote`, `label`, `sides` (absolutely placed children of the card's frame: trees, say), `scene` (full-width artwork flush with the section's foot), `cardBackground`, `background`, `colors` | Platinum (`BananaTree`s at the sides, `TempleSkyline` at the foot) |
| `EventsSection` | `EventsSection.tsx` | "Wedding events": a heading (tracked eyebrow, italic title) under `HangingDiyas` swaying across the top, a very faint blurred shadow of palm leaves across the paper, then one `EventCard` per event (all one height), each dressed in its own artwork (`scenes`) and parted from the next by a small gold divider, over paper printed with a faint paisley-and-flower pattern. Takes `InviteEvent[]`. | `events`, `timeZone`, `scenes` (`Record<name, EventScene>`: an event whose `art` names one gets it; others take them in turn), `eyebrow`, `title`, `diyas` (colours or `false`), `background`, `colors` | Platinum |
| `EventCard` | `EventCard.tsx` | One event as a card of its own: "EVENT 01" pill and an add-to-calendar button (a generated `.ics` data link, no server) in the corners, title (large italic) with a gold line-and-diamond rule, start time in a pill ("06:00 PM Onwards"), the day in tracked capitals (weekday in gold), a box with the venue name + address, and a dark "View location map" button (Google Maps from `mapsUrl`, or `place` + `address`). The card is one shared part; its artwork comes in as an `EventScene`: `behind` (drawn first: a big arch/canopy the text stands inside), `top` (behind the text) and `bottom` (in front of it), plus `topSpace` / `bottomSpace` (px the text leaves clear), `background`, `arch` (a paler arch behind the text), `plate` (a frosted panel behind the text, on every Platinum card so the title/time/venue read the same whatever art is behind them), `pattern` (a faint print of paisleys and flowers on the card's paper, on by default). **Every card is at least 640px tall and up to 380px wide, so a list of them stands at one height**: a scene's `topSpace` + the text (about 270–290) + `bottomSpace` should come to about 640. Rises on scroll, its lines follow one by one. | `event`, `index`, `timeZone`, `scene`, `eventLabel`, `onwardsLabel`, `mapLabel`, `calendarLabel` | EventsSection |
| `ElephantFrieze` | `ElephantFrieze.tsx` | A row of decorated elephants (SVG) standing in pairs that face each other with a lit diya held up between their two raised trunks: purple skin with a shaded far ear and far legs, ivory tusks, a pink saddle cloth (scalloped gold hem, dotted border, tassels, golden crown), a jewelled forehead cloth, a bell necklace, gold anklets, toenails and a tufted tail, on a thin gold ground line. Each walks on the spot: legs swing in diagonal pairs (`amb-limb`, one set a whole step out of phase), the body bobs once per step (`amb-bob`), the ear flaps, the tail swings, and every flame flickers (`amb-flicker`). CSS only. Each elephant is drawn inline (not `<use>`d) so its limbs can animate; the second of every pair is mirrored and steps a beat later. A divider between sections. | `colors{skin[2],cloth,gold,bowl,flame[2],ivory}`, `count` (elephants, in whole pairs; default 4), `className` (width) | PlatinumTempleInvite |
| `GallerySection` | `GallerySection.tsx` | "Our love gallery": eyebrow, italic title, a gold line with a heart; a carousel of pictures in a tall frame (gold rim round a cream mat, soft shadow) with a round arrow overlapping each side, a `01 / 05` chip and an expand chip on the picture, and dots under it (the current one larger and ringed). Swipe (drag with a velocity/offset threshold), arrows, dots, the arrow keys (it is a focusable `role=region` carousel), or leave it: it turns the page by itself every 4.8s while on screen and stops the moment the visitor touches it (never under reduced motion; paused while hovered/focused/dragged). Slides move direction-aware (`AnimatePresence`, `custom`). Tap a picture: a full-screen lightbox, portalled to `<body>` so it is above the page's chrome, swipeable, with close button/backdrop/Esc, arrows, caption, body scroll locked. A faint turning `Mandala` behind the frame and a `LineArtBackdrop` print. Takes `InviteGalleryItem[]`. | `items`, `eyebrow`, `title`, `autoplay`, `background`, `colors` | Platinum |
| `HangingKites` | `HangingKites.tsx` | Paper kites on dotted strings hanging from the top of a page: a big diamond (three coloured bands, bones, tassel) and a small one on a longer string, swinging from their strings and a little further and quicker from the foot (nested `amb-sway amb-sway--hang`). One in each top corner, the second with `mirror`. | `mirror`, `colors{bands[3],string,tassel}`, `className` (84×230) | GuestRsvp |
| `GuestRsvp` | `GuestRsvp.tsx` | "Guest RSVP": kites in the corners, eyebrow, italic title, a "Kindly respond by …" pill, then a form in a card with a gold arched rim: guest name, contact number, attendance (select) and guests count side by side, special blessings. One button, "Send blessings & RSVP": it validates first (and says what is missing under the field), hands the reply to `onSubmit` and the card turns into a thank-you with the reply summarised, a petal shower on a yes and "Change my reply". **No backend**: until `onSubmit` is wired to one, a reply goes nowhere (there is no WhatsApp send any more). Takes `InviteRsvp`. | `rsvp`, `bride`, `groom`, `timeZone`, `eyebrow`, `title`, `onSubmit(GuestReply)`, `kites`, `confetti`, `background`, `colors` | Platinum (Silver/Gold keep `RsvpSection`) |
| `ThankYouSection` | `ThankYouSection.tsx` | The closing "Thank you": art hanging from the top (a `top` slot), a soft marigold-yellow watercolour wash, a kalash (SVG: copper pot, kumkum swastika, marigold ring, mango leaves, a big coconut with husk lines, three eyes and a tuft) that pops in and then hops now and then (`amb-hop`: up a little, a soft squash, a small second hop), twinkling gold sparkles, "With gratitude", the title and a gold rule, the note, the names in gold italic between two swaying potted banana plants, a wish, `MarryMeCredit`, marigold petals drifting down, and a `scene` along the foot over a ground band (`base`). Reveals line by line. | `bride`, `groom`, `message`, `eyebrow`, `title`, `wish`, `top`, `scene`, `base`, `plants`, `petals` (colours or `false`), `background`, `colors` | Platinum (art in `platinumThankYou.tsx`) |
| `HangingSprite` | `HangingSprite.tsx` | Any picture of something that hangs (a marigold garland, a toran, a bell) swinging left and right from its top edge (`amb-sway amb-sway--hang`, CSS only, stops under reduced motion). Absolutely placed in a `relative` parent. | `src`, `width`/`height` (the picture's own, for its shape), `size` (px wide), `left`/`right`/`top`, `angle`, `duration`, `delay` (give each of a group its own), `flip`, `className` | EventCard scenes (Platinum) |
| `LineArtBackdrop` | `LineArtBackdrop.tsx` | A faint line-art print for the paper behind a section, one colour of thin strokes at a few percent opacity: across the top two hanging lanterns, a canopy and two peacocks facing each other (one mirrored; nine eyed tail feathers each), then over the rest a repeating tile of paisleys and small flowers (an SVG `<pattern>`, fading in under the peacocks). Fills the nearest positioned ancestor, pointer-transparent. | `color`, `opacity` (0.12–0.2), `ornaments` (false: only the spotted paper), `fadeFrom` (px where the spots start) | PlatinumTempleInvite (behind StorySection) |
| `WireLink` | `WireLink.tsx` | Two glowing golden wires hanging between a card and the one under it, a bead where each is fastened. An `li` for an `ol` (or any `relative` block in a list): full width, `height` px tall. In view, each wire draws itself down (Framer `pathLength`), one a beat after the other; then a halo breathes round it (`amb-breathe`) and a comet of light runs down it for ever (`SnakePaths`; CSS, stays under reduced motion). The wires sag a little rather than ruled straight. | `height` (the gap, px), `inset` (% in from each side), `color` (the wire), `glow` (the halo and the drop-shadow, brighter than the wire), `glint` (the comet) | StorySection |
| `StorySection` | `StorySection.tsx` | "How we met": eyebrow + italic title, then a column of milestone cards down the right (year in gold italic, bold heading, justified hyphenated paragraph, frosted card) and the couple's illustration standing at the left, cut off by the screen's edge and tucked behind the cards, **pinned to the foot of the screen (`position: sticky`) while the cards scroll** and resting at the foot of the last card. Cards slide in from the right as they arrive, the couple from the left, and golden wires draw themselves between the cards. Takes `InviteMilestone[]`. **Sticky dies under any `overflow: hidden` ancestor**: this section and the page around it clip with `overflow-x: clip`, never `hidden`. | `milestones`, `wires` (`WireLink` between each pair of cards, default on), `imageClassName` (the picture's box at the foot of the pinned column: default `-left-[46%] w-[140%]` shoves a pair standing side by side off the left edge so the one on the right, and both faces, stay clear of the cards; re-tune for other art), `image` (transparent PNG/WebP of the pair; omit for a labelled arch placeholder), `imageAlt`, `placeholder`, `eyebrow`, `title`, `backdrop` (any node that fills the section: `LineArtBackdrop`), `cardBackground`, `background`, `colors` | Platinum |
| `GateCountdown` | `GateCountdown.tsx` | "Counting down the days": eyebrow, italic title and a hint over a pair of maroon doors (gold seam, inner frame, corner brackets) with a glowing ring that says OPEN. Tap it: the doors swing wide on their outer hinges in 3D, petals shower, and behind them in a golden glow is the live countdown (days / hours / minutes / seconds) with the date and venue under it. The section's background is any photograph, veiled to a faded print that is still easy to make out (`blur` is 0 by default; a few px turns it into a haze, which loses the picture), slightly warmed, fading into the page above and below; the heading carries a soft cream glow so it reads over a busy picture. Uses `useCountdown`, `Petals`, `formatDay`. | `weddingDate`, `venue`, `timeZone`, `image`, `eyebrow`, `title`, `hint`, `openLabel`, `openAria`, `unitLabels`, `gates{door,gold[2],disc,discInk,light}`, `blur`, `veil`, `confetti`, `background`, `colors` | Platinum |

### 2.3 CSS ambient classes (`src/styles/motion.css`)

Each is a class plus variables. All stop under `prefers-reduced-motion`.

| Class | Effect | Knobs |
| --- | --- | --- |
| `amb-sway` (`--hang`) | gentle leaf/garland sway (in SVG, around the bottom centre of the element's own box: draw the part upright inside a rotated wrapper) | `--sway-angle` (2.2deg), duration and delay per element |
| `amb-wheel` | a "scroll" mouse's wheel notch running down and fading (used by `ScrollHint`) | — |
| `amb-flicker` | flame flicker | — |
| `amb-fall` | falling petal (older) | `--fall-to --drift` |
| `amb-petal` | petal in any direction (used by `Petals`) | `--dx --dy --spin --petal-dur --petal-delay --petal-iter` |
| `amb-turn` | slow rotation for mandalas and rosettes (used by `Mandala`) | `--turn-dur` (90s per turn), `--turn-dir` (`reverse` to turn the other way) |
| `amb-spin`, `amb-spin-slow` | loader spin / badge spin | — |
| `amb-ring` (`--rev`) | dashed ring turning (must be dashed to be visible) | `--ring-dur` |
| `amb-spark` | sparkle drifts out and pops | `--sx --sy --spark-dur --spark-delay` |
| `amb-swing-depth` | forward/back pendulum (parent needs `perspective`; use `SwingArt`) | `--swing-angle --swing-dur --swing-pivot` |
| `amb-twinkle` | star twinkle | `--tw-base --tw-dur --tw-delay` |
| `amb-limb` | a limb swinging to and fro from its top (a leg stepping, an ear flapping, a tail): on an SVG group | `--limb-angle` (8deg), `--limb-dur` (one way across), `--limb-delay` (a negative whole `--limb-dur` = opposite phase), `--limb-origin` (top center) |
| `amb-bob` | a body rising and falling as it walks; set `--bob-dur` to half a `--limb-dur` for a bob a step | `--bob-y` (-1.4px), `--bob-dur`, `--bob-delay` |
| `amb-hop` | a little hop: lifts, lands with a soft squash, a smaller second hop, rests | `--hop-y` (14px), `--hop-dur` (2.2s) |
| `amb-eq` | an equaliser bar growing and shrinking from its foot | `--eq-dur`, `--eq-delay` |
| `amb-breathe` | opacity swells and settles: a faint halo that breathes (put it on a wider copy of a line, under the line) | `--breathe-from` (0.2), `--breathe-to` (0.65), `--breathe-dur` (2.8s) |
| `amb-snake` | light travelling an SVG outline; stack long-faint to short-bright paths with `pathLength="100"` (use `SnakePaths`, which does this); each gets a negative `animation-delay` of (longest − its length)/100 × lap so the heads stay level (keyframes are plain `0 → -100`: mixing a unitless value with `calc()` doesn't interpolate in Chrome and the light sits still) | `--snake-dur`, per-path `animation-delay` |
| `amb-drift` | a very slow camera drift over a picture: a few percent of zoom and pan, back and forth. Put it on the picture inside a clipping (overflow-hidden) frame | `--drift-dur` (22s) |
| `amb-sheen` | a slanted band of light that crosses a picture now and then, then waits. Give it a clipping parent, a width and a gradient; it is hidden under reduced motion | `--sheen-dur` (8s, the whole cycle) |
| `amb-glow-ring` | a ring whose box-shadow swells and settles (a glowing gold ring) | `--glow` (colour), `--glow-dur` |
| `amb-halo` | a copy of the ring that ripples outward and fades | `--glow-dur` |
| `amb-glow-text` | text whose colour (deep to bright) and halo breathe together — the colour moves too because a glow alone doesn't show on a pale background | `--glow`, `--glow-dur` |
| `amb-beat` | heartbeat | — |
| `amb-bounce` | gentle bob | — |
| `amb-petal--pop` | the popping variant of `amb-petal` (used by `Petals pop`): swells in at the start, swells out at the end; the fall stays even | same variables as `amb-petal` |

Timing constants live twice and must change together: `src/styles/motion.ts`
(seconds) and the `:root` block of `motion.css` (ms).

### 2.4 Shared chrome and helpers

| Name | File | What | Props |
| --- | --- | --- | --- |
| `BackLink` | `BackLink.tsx` | The "Back" pill to the site. | `tone: 'gate' (gold on dark) \| 'solid' (cream on a solid `--invite-ground` pill, for over a photograph) \| 'page' (ink on light)` |
| `OrderButton` | `OrderButton.tsx` | "Order Now" → WhatsApp with the enquiry (template name + the page's own URL). | `templateName`, `className` |
| `FloatingOrderBar` | `OrderButton.tsx` | Order Now (left) + optional music button (right), pinned to the bottom in the phone-width column. `music` is `true` (a button that plays the sample loop when tapped) or the object from `useBackgroundMusic` (a page that starts the music at the tap that opens its gate). | `templateName`, `music`, `delay`, `style` | every template |
| `MusicButton` | `OrderButton.tsx` | The round music button: a note with a slash while off; while playing, three equaliser bars (`amb-eq`) dance in it and a gold ring breathes round it (`amb-glow-ring`). `aria-pressed`, labelled Play/Pause. Reads `--surface-raised`, `--ink-strong`, `--line-firm`, `--invite-metal`. | `playing`, `onToggle` | FloatingOrderBar |
| `useBackgroundMusic` | `useBackgroundMusic.ts` | Looping background music for a play/pause button: the audio element is made on the first `play()`, fades in and out over 0.9s, falls silent when the tab is hidden and returns with it if it was on, and stays off (button still there) if the browser refuses. `SAMPLE_MUSIC` = `/audio/raga-bhoopali-loop.mp3`, a 53s loop (tanpura drone, a flute singing raga Bhoopali, soft bells) **synthesised from scratch for this project, so no licence is attached**; swap in a real licensed track with `src`. Start it from a tap: `PhotoLock`/`EnvelopeLock` take `onTap` (via `useOpenSequence`, called synchronously in the click handler). | `src`, `{ volume }` → `{ playing, play, pause, toggle }` | FloatingOrderBar, PlatinumTempleInvite |
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
| `PlatinumTempleInvite` | Platinum | `platinum-temple` | `PhotoLock` over a page that opens on a one-screen landing: warm ivory paper (`Grain` over a soft glow), "The Wedding Of", the names big and italic in wine, the temple painting framed in a gold-leaf arch (slow `amb-drift`, a glint `amb-sheen` crossing it, a `SnakePaths` light running round the arch's edge, the venue on a maroon-shaded plaque at its foot), a swaying `BananaTree` on each side standing behind the arch with their leaves reaching past its shoulders, marigold `Petals` drifting down, and a `ScrollHint` mouse; the landing is a champagne sheet (`sky`, with `Grain`) that ends in a `TornEdge` over a paler cream `page`; under the tear `MeetTheCouple` (when the record has `couple`: bells hanging from beneath the paper, a half `Mandala` rising from behind it, the groom and bride with mandalas turning opposite ways), then `QuoteSection` (a frosted quote card, small `BananaTree`s at its sides, `TempleSkyline` at the foot), then `StorySection` "How we met" (when the record has `story`: line-art print, milestone cards joined by glowing `WireLink`s, the couple pinned at the left), then `GateCountdown` (when the record has `weddingDate`: maroon doors that swing open on the live countdown, over a faded lantern-temple photo `temple-lanterns.webp`), then `EventsSection` (when the record has `events`: swaying hanging diyas over "Wedding Events", then one `EventCard` per event dressed by `platinumEventScenes`: a gold chandelier canopy, a marigold toran, an arch of flowers, marigold garlands + a half mandala + the Shubh Vivah emblem), then an `ElephantFrieze` divider (walking elephants), `GallerySection` (when the record has `gallery`), `GuestRsvp` (when it has `rsvp`) and `ThankYouSection` (a toran of flower strings and mango leaves cut from the Ugadi sheet, the temple skyline at the foot). The old placeholder greeting block is gone. The page keeps marigold petals drifting down for its whole length (a fixed `Petals` layer under the Back/Order buttons), the gate's tap starts the music (`useBackgroundMusic`) and the button on the right pauses it; + `BackLink tone="solid"` + `FloatingOrderBar music`. The painting is `public/art/platinum/indian-temple-with-lotus-pond-people.webp` (a 1500px copy of the 10MB `.jpg` the owner supplied; the garland PNG next to it is for later sections). Props: `gallery` (`InviteGalleryItem[]`), `rsvp` (`InviteRsvp`), `thankYou` (the closing note), `quote` (the pulled quote's words), `events` (`InviteEvent[]`), `story` (`InviteStory`: `image?` of the pair, `milestones[{year,title,text}]`), `couple` (`InviteCouple` from `content/invites.ts`: per person `name?`, `image?`, `blessing?`, `family?`), `backdrop`, `theme{sky,sheet,rim,page,accent,ink,inkSoft,ground,glint,paper,petals[]}`, `lock` (any `PhotoLock` prop: disc size/position, colours, camera), `templateName`. Only the opening and a first page exist so far. |
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
- `SimpleLock` still carries its own stage machine (it has extra stages: the
  key turning, and waiting for the petals); `EnvelopeLock` and `PhotoLock` share
  `useOpenSequence`.
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
- [ ] `npm run typecheck` passes (it was clean after the Next 15.5 update; before that three old errors — two in `GateScene.tsx`, one in `tailwind.config.ts` — were the accepted baseline).
- [ ] **This file updated**: new or changed shared parts added to section 2, backlog trimmed in section 4.

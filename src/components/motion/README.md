# Motion

Two systems, one rule.

| Kind of movement | Where it lives | Why |
| --- | --- | --- |
| Loops forever, ignores input | CSS class in `motion.css` | Compositor-only, zero JS, survives a failed bundle |
| Reacts to tap, drag or scroll | Framer Motion in this folder | Interruptible, orchestrated, scroll-linked |

**Ambient = CSS. Interactive = Framer Motion.** If you cannot say which input drives an animation, it is ambient.

## Keeping the bundle honest

`MotionProvider` loads `domAnimation`, not `domMax`, and sets `strict`. Strict mode makes `motion.div` throw, so every call site must use `m.div`. Without it, one stray `motion` import pulls the full bundle back in and the saving disappears silently.

Import Framer Motion **only inside client components that need it**. Never from a shared layout, or every invite page pays for it.

## Reduced motion needs covering twice

- Framer Motion: `MotionConfig reducedMotion="user"` in the provider
- CSS: the `prefers-reduced-motion` block at the bottom of `motion.css`

Handling one and not the other leaves half the page still moving, which is worse than either extreme.

## Token drift

`motion.ts` (seconds, for Framer Motion) and `motion.css` (ms, for CSS) hold the same values in two formats. There is no generator for this yet — change both. If the pair grows past a dozen values, generate the CSS from the TS the way `tokens.css` is generated.

# Footer Banner Snake-Trail Animation — Design

## Goal

Add a premium, elegant, continuously-looping decorative "snake trail" animation to the
existing mobile/tablet footer promo banner (`components/home/FooterBanner.tsx`), without
altering the banner's existing image, layout, colors, typography, or `CardDecoration`
elements. The trail should feel like a natural extension of the site's current visual
language (sage green / terracotta / gold / dusty rose / wood brown, 16px card radius,
soft card shadows), travel along a smooth curved path that dips outside the card and
back in, and create a believable depth illusion by passing behind the card edge and a
small number of new decorative accents.

## Non-goals

- No changes to the uploaded banner photo, its aspect ratios, or `CardDecoration`.
- No changes to `PromoShowcase` (the desktop equivalent) — this is mobile/tablet
  (`lg:hidden`) scope only, matching where `FooterBanner` renders today.
- No device-tier detection or FPS throttling beyond `prefers-reduced-motion` — the
  effect is lightweight enough (one stroked path, one head, a handful of pooled
  particles) that additional tiering isn't warranted.
- No floating dust layer, shimmer-on-decoration layer, or scroll parallax — deferred per
  "core trail + light ambience" scope decision.

## Why the illusion needs new accents

The banner image is a flat uploaded photo (`settings.home_footer_banner_image` /
`home_footer_banner_mobile_image`) with no separate floral/bunny/gift-icon layers in the
DOM — a trail cannot literally pass "behind the bunny" because the bunny is baked into
pixels. To deliver a real depth illusion (not just a claim of one), we add 2–4 small,
subtle new SVG decorative accents (a thin floral flourish / leaf sprig, in the existing
theme palette) purely so the trail has something concrete to weave behind and in front
of. These are additive only — they sit in the same corner-accent visual language as the
existing `CardDecoration` sparkles and do not touch the photo or existing layout.

## Architecture

New files under `components/home/snake-trail/`:

- **`paths.ts`** — hand-authored SVG path `d` strings and `viewBox` definitions for the
  mobile (3:4) and tablet (4:3) card variants, each a single closed bezier loop that
  dips outside the card on at least one side and re-enters on another. Also defines the
  small local mask regions used for the "trail passes in front of an accent" moments
  (see below).
- **`DecorativeAccents.tsx`** — renders the 2–4 new SVG flourish shapes at fixed
  positions (e.g. two opposite corners not already occupied by `CardDecoration`'s
  brackets), sized and colored to read as a quiet extension of the existing corner
  accents. Takes `colorHex` as a prop.
- **`SnakeTrailLayer.tsx`** — the GSAP-driven overlay: the three masked path copies, the
  glowing head, the trailing dash, and the particle pool. Takes `variant: "mobile" |
  "tablet"` and `colorHex` as props. Renders `null` if
  `prefers-reduced-motion: reduce` is set.

`components/home/FooterBanner.tsx` changes:

- Each existing card block (mobile, tablet) gets `<DecorativeAccents />` and
  `<SnakeTrailLayer variant="..." colorHex={decorationColor} />` added as siblings of
  the existing `<CardDecoration />`, inside the same card container. No existing JSX is
  restructured, removed, or re-styled.
- The outer card wrapper (or the existing `content` div) gets a small GSAP-driven
  scroll-reveal (see below), layered on top of — not replacing — the existing
  `transition-transform duration-300 group-hover:scale-[1.01]` hover treatment.

**New dependency:** `gsap` (includes `MotionPathPlugin` and `ScrollTrigger` in the base
package — no separate plugin install).

## Depth illusion: masked triple-path technique

The same closed path `d` is rendered three times as separate `<path>` elements, each
clipped by a different static `<mask>`, all animated by one shared, synced GSAP
timeline (progress, not per-frame branching):

1. **Outside-card copy** — masked to everything *except* the card's rounded rectangle
   (mask = full canvas white, card shape cut out black). Positioned at a stacking level
   below the card's own background/shadow. Only visible while the glowing head is
   physically outside the card bounds — this is what sells "diving under the card
   edge."
2. **Inside-card copy** — masked to the card's rounded rectangle. Sits above the banner
   image, below `DecorativeAccents`. This is the default "inside the card" appearance.
3. **Above-accent copy** — masked to only the 1–2 small local regions matching a
   specific accent's silhouette (authored once in `paths.ts` alongside that accent's
   position). Sits above `DecorativeAccents`. Because this mask only unmasks a tiny
   region, the trail only pops in front of that one flourish for the brief stretch of
   the loop passing through it, then returns to the "inside, below accents" appearance.

Because all three copies share identical path geometry and are driven by the same
timeline progress, whichever copy is geometrically unmasked at a given instant is
exactly where the head currently is — the depth ordering falls out of static masks, not
runtime conditionals.

## Motion

- **Path authoring** — each variant's loop is split into 5–6 arcs at its natural
  direction changes (e.g., long curve along the top, a dip outside the left edge, a
  sweep along the bottom, a dip outside the right edge, back to start). Each arc is
  authored so the end tangent of one matches the start tangent of the next — this is
  what avoids sharp corners or sudden direction changes.
- **Timeline** — a `gsap.timeline({repeat: -1})` chains one `motionPath` tween per arc,
  each with its own duration and `ease: "power1.inOut"`. This produces the requested
  "accelerate through long curves, decelerate before turning" feel rather than flat
  constant-speed traversal, while the shared start/end points between arcs keep the loop
  seamless with no visible restart.
- **Head & tail** — a small circle (soft static blur filter, no animated filter
  properties) moves along the path via `MotionPathPlugin`. The path's own stroke uses a
  `stroke-dasharray`/`dashoffset` "comet tail" kept in sync via the same timeline
  progress (not a separate uncoupled tween), tapering opacity along its length, rounded
  line caps, ~1.5–2px width, gradient stroke derived from `colorHex`.
- **Particles** — a fixed pool of 6–8 reused sparkle nodes (not mounted/unmounted per
  spawn). Every ~600–900ms while the timeline is playing, one pooled node is
  repositioned to the head's current point and tweened: fade in → slight drift → fade
  out. Only `opacity`/`transform` are animated.

## Color

`SnakeTrailLayer` and `DecorativeAccents` both take `colorHex`, sourced from the same
`decorationColor` (`getThemeAccentHex(settings.home_footer_banner_decoration_color ||
"brown")`) already computed in `FooterBanner.tsx` for `CardDecoration`. The trail's
gradient, glow, and particles are derived from this single hex (e.g., a soft
lighter/darker stop pair), so the effect always matches whatever decoration color an
admin has configured for that banner, rather than a fixed multi-hue gradient that could
clash.

## Scroll interaction

Implemented via `ScrollTrigger`, layered onto the existing card wrapper:

- **Reveal** — on first entering the viewport: fade in, slight upward translate, and a
  few-px scale-up, extending the existing hover-scale treatment (not replacing it).
  Runs once.
- **Play/pause** — a second trigger calls `.pause()` on the GSAP timeline when the
  section is fully out of the viewport (`onLeave`/`onEnterBack` etc.) and `.play()` when
  it re-enters, so the loop isn't consuming frames off-screen. Resumes from wherever it
  left off — no restart pop.

## Reduced motion

`SnakeTrailLayer` checks `window.matchMedia('(prefers-reduced-motion: reduce)')` once on
mount. If it matches, the component renders `null` — no trail, no particles, no GSAP
timeline created. `DecorativeAccents` (static, non-animated shapes) still render, since
they're just quiet additional artwork, not motion. The banner's existing behavior is
otherwise completely unchanged.

## Performance

- Only `transform`, `opacity`, and `stroke-dashoffset` are ever animated — all
  GPU/compositor-friendly.
- Glow uses one static (non-animated) SVG `<feGaussianBlur>` filter, not an animated CSS
  filter.
- `will-change: transform` applied only to the head and particle nodes, not the whole
  layer.
- Effect is scoped to where `FooterBanner` already renders (`lg:hidden`), so it never
  runs on desktop.
- GSAP timeline instance and ScrollTrigger instances are created in a `useEffect` /
  `gsap.context()` and reverted on unmount to avoid leaks across client-side navigation.

## Testing / verification

- Manual verification in a running dev server: confirm the trail loops seamlessly,
  dips outside the card and back, passes behind the card edge and the new accents at
  the intended moments, particles fade cleanly, and the banner's existing image/
  decorations/link behavior is pixel-identical to before at rest.
- Verify with `prefers-reduced-motion: reduce` (via devtools emulation) that the trail
  and particles do not render at all.
- Verify scroll pause/resume by scrolling the section fully out of view and back with
  devtools performance/rAF monitoring showing no active ticks while off-screen.
- Check both the mobile (3:4) and tablet (4:3) breakpoints render their own path variant
  correctly.

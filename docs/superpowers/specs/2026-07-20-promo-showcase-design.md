# Promo Showcase Carousel — Design Spec

Date: 2026-07-20

## Problem

The homepage needs a rotating, auto-scrolling row of promotional image cards
(image + title + "Buy Now" button) placed directly below the Testimonials
section, similar to a 3D "coverflow" carousel where the centered card sits
flat/large and side cards tilt away in perspective. Content must be fully
editable by the admin (image upload, title, button text/link) from the
existing "Website Content" admin page — no code changes required to add,
reorder, or remove cards.

## Non-goals

- No new database collection or dedicated CRUD admin page (unlike Banners).
  This feature reuses the existing `SiteSettings` key/value content system.
- No video support, only static images per card.
- No per-card scheduling/expiry — visibility is just "in the list or not."

## Architecture

Reuses the existing `SiteSettings` key/value store that already backs the
"Website Content" admin page (same mechanism as the Marquee items,
Why-Choose-Us steps, and footer link lists). A new settings key,
`home_promo_cards`, stores a JSON-encoded array of:

```ts
interface PromoCard {
  imageUrl: string;
  title: string;
  buttonText: string;
  buttonLink: string;
  bgColor: string; // one of a small preset palette, e.g. "green" | "yellow" | "tan" | "blue" | "pink"
}
```

No new API routes are needed: the existing `/api/admin/settings` (PUT, used
by the content page's "Save Changes") and `/api/settings` (GET, used by the
public `useSettings()` hook) already read/write arbitrary keys in
`SiteSettings`.

## Components

1. **`lib/siteContent.ts`**
   - Add `PromoCard` interface, `DEFAULT_PROMO_CARDS` (3 sample cards using
     existing placeholder images so the section renders sensibly before an
     admin configures it), and `PROMO_CARD_COLORS` (the small preset palette
     of background gradients/colors offered in the admin swatch picker).

2. **`components/admin/ContentEditors.tsx`**
   - Add `PromoCardListEditor`: a list editor in the same visual style as
     the existing `ListEditor` (reorder up/down, remove, dashed "add" button)
     but each row renders an `ImageUploader` (single image) plus text inputs
     for title / button text / button link, and a row of small clickable
     color swatches for `bgColor`.

3. **`app/admin/content/page.tsx`**
   - New "Promo Showcase" `Section` under the existing "Home" tab, directly
     below the "Testimonials — heading & stats" section, wired to the
     `home_promo_cards` key via the page's existing `listVal`/`setListVal`
     helpers. Saved through the page's existing "Save Changes" button —
     no separate save action.

4. **`components/home/PromoShowcase.tsx`** (new public component)
   - Reads `home_promo_cards` via the existing `useSettings()` hook,
     falling back to `DEFAULT_PROMO_CARDS` when empty/unset.
   - Renders nothing (returns `null`) if the resolved list is empty.
   - Built on `embla-carousel-react` + `embla-carousel-autoplay` (already
     project dependencies), configured with `loop: true` and the autoplay
     plugin (~2.5s/slide, `stopOnInteraction: false` so it resumes
     auto-scrolling after a manual swipe/drag).
   - Applies a scroll-progress-driven tween to each slide (scale down +
     `rotateY` + reduced opacity as a card's distance from the viewport
     center increases) — the standard Embla "coverflow" recipe — to
     produce the curved/tilted look from the reference screenshot. Center
     card renders flat and at full scale.
   - Respects `prefers-reduced-motion`: disables autoplay and the tilt
     transform, falling back to a plain static swipeable row of flat cards.
   - Responsive breakpoints: mobile shows one centered card with peeking
     neighbors either side; tablet/desktop widen the visible card count and
     peek amount, consistent with the site's existing carousel patterns
     (e.g. `Testimonials.tsx`'s `visibleItems` breakpoints).
   - Each card: background per `bgColor`, image, title, and a "Buy Now"-style
     button (label from `buttonText`) linking to `buttonLink` (internal
     Next.js `Link` if it starts with `/`, otherwise a plain external link).

5. **`components/home/BelowFoldSections.tsx`**
   - Import `PromoShowcase` via the same `dynamic(..., { ssr: false })`
     pattern used for the other below-fold sections, and render it
     immediately after `<Testimonials />` and before `<TextMarquee />`.

## Data flow

Admin edits card list in "Website Content" → Home tab → "Promo Showcase" →
clicks "Save Changes" → `PUT /api/admin/settings` (existing route) →
`home_promo_cards` JSON string persisted in `SiteSettings` → homepage's
`useSettings()` (existing SWR hook, already used by `Testimonials.tsx` and
others) picks up the change → `PromoShowcase` parses the JSON list and
re-renders.

## Edge cases

- No cards configured and no defaults applicable → component returns `null`;
  section simply doesn't appear (no empty carousel shell).
- A card's `imageUrl` is empty/broken → card still renders with its
  `bgColor` background and text so layout doesn't break, image area shows
  a neutral placeholder fill.
- `buttonLink` empty → button is not rendered for that card (title/image
  still show), same convention as `Banner.buttonText`/`buttonLink` being
  optional today.
- Very narrow viewports → carousel still degrades to one visible (tilted)
  card at a time rather than clipping/overflowing horizontally.
- `prefers-reduced-motion: reduce` → no autoplay, no 3D tilt; cards are
  static and flat, swipeable only.

## Testing / verification plan

- Manual: `npm run dev`, open homepage, confirm the carousel appears below
  Testimonials and above the marquee, auto-scrolls continuously and loops
  without a visible jump, and that side cards visibly tilt/scale relative
  to the centered card.
- Resize check across mobile/tablet/desktop breakpoints for layout and peek
  amount.
- Admin round-trip: add a card (image + title + button text/link + color),
  Save, confirm it appears live on the homepage; reorder two cards and
  confirm order changes on the homepage; remove a card and confirm it
  disappears; leave the list empty and confirm the section disappears from
  the homepage entirely.
- Drag/swipe the carousel manually and confirm autoplay resumes afterward.
- Toggle OS-level reduced-motion and confirm autoplay/tilt are disabled.

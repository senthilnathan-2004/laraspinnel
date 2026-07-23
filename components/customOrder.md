MASTER IMPLEMENTATION PROMPT — LARA’S PINNAL CUSTOM ORDER SECTION

Your task is to redesign and implement ONLY the existing “Custom Order” section of the Lara’s Pinnal e-commerce website, using the provided reference design as the visual target.

IMPORTANT:
Do not blindly recreate the reference as a static image.

First inspect and analyze the existing codebase, current Custom Order component, global styles, design tokens, assets, responsive system, typography, routing, reusable components, and animation setup.

Then implement the redesign directly into the existing website using the project’s current technology stack and coding conventions.

Do NOT modify unrelated sections or introduce regressions.

==================================================
1. FIRST — ANALYZE THE EXISTING PROJECT
==================================================

Before writing code:

1. Locate the existing Custom Order section/component.
2. Identify:
   - Framework and architecture
   - Styling approach
   - Existing design tokens
   - Fonts and typography
   - Brand colors
   - Border-radius values
   - Shadows
   - Container/max-width conventions
   - Responsive breakpoints
   - Existing animation libraries
   - Image optimization component/system
   - Existing product/custom-order images
   - Existing CTA routes/actions

3. Reuse existing components, utilities, assets, and tokens wherever possible.

4. Do not install new dependencies unless absolutely necessary.

5. Preserve the existing functionality of:
   - “Start Your Custom Order”
   - “View Custom Creations”

Do not use placeholder links if working routes/actions already exist.

==================================================
2. DESIGN OBJECTIVE
==================================================

Redesign the Custom Order section into a premium editorial handmade-gifting showcase inspired by the provided reference image.

The section should communicate:

- Handmade craftsmanship
- Personalization
- Made-to-order products
- Emotional gifting
- Boutique quality
- Premium but warm aesthetics

The final section should feel elegant, sophisticated, handcrafted, modern, and conversion-focused.

It must integrate naturally with the rest of Lara’s Pinnal.

Do NOT make it look like a generic SaaS hero, standard product grid, or template section.

==================================================
3. OVERALL SECTION LAYOUT
==================================================

Create one cohesive full-width Custom Order banner with two primary visual zones:

LEFT:
Editorial content and CTAs.

RIGHT:
Animated 3-column custom-product gallery.

Use approximately:

Desktop:
Left content: 43–48%
Right showcase: 52–57%

Do not create a harsh visible divider.

The two sides should visually blend into one continuous composition.

Use the existing site container/max-width system where appropriate.

Give the section generous vertical space similar to the reference, while ensuring it does not become unnecessarily tall.

Use a premium large border radius on the outer section only if consistent with the existing website.

==================================================
4. BACKGROUND & ATMOSPHERE
==================================================

Create a subtle warm editorial background inspired by the reference.

Use the existing Lara’s Pinnal palette first.

Preferred visual direction:

Left:
Warm ivory / cream.

Transition toward right:
Very soft blush-peach / warm nude tone.

Example visual direction only:

#FFFDF8
→ #FDF4EA
→ subtle warm blush

Do NOT blindly use these exact colors if they conflict with existing design tokens.

Create a seamless gradient transition rather than a hard 50/50 split.

OPTIONAL DECORATIVE DETAILS:

Add extremely subtle:
- Botanical line-art
- Floral outlines
- Handmade-inspired organic motifs
- Soft texture/grain
- Diffused glow

These decorations must remain low-opacity and secondary.

They must NEVER interfere with:
- Text readability
- Product images
- CTA visibility

Avoid visual clutter.

==================================================
5. LEFT-SIDE CONTENT
==================================================

Preserve the existing content meaning and CTA functionality.

Use the existing copy:

Eyebrow:
CUSTOM MADE · JUST FOR YOU

Main heading:
Made by Hand.
Made for You.

Description:
From forever bouquets to meaningful gifts, we create something uniquely yours.

Benefits:
CHOOSE YOUR COLORS
PERSONALIZED DETAILS
HANDMADE TO ORDER

Primary CTA:
Start Your Custom Order

Secondary CTA:
View Custom Creations

Do not unnecessarily rewrite the copy.

==================================================
6. TYPOGRAPHY
==================================================

Create stronger editorial hierarchy.

EYEBROW:
- Small uppercase
- Increased letter spacing
- Refined muted brand tone
- Optional short decorative line before text

HEADING:

“Made by Hand.
Made for You.”

Make this the dominant element.

If the existing brand already includes an editorial serif/display font, use it.

Otherwise preserve the established typography rather than introducing an unrelated font dependency.

Target feeling:
- Editorial
- Boutique
- Emotional
- Premium handmade brand

Use responsive typography with clamp() or the project’s existing responsive typography utilities.

Avoid oversized text that causes awkward wrapping.

DESCRIPTION:

Use comfortable line-height and a muted neutral tone.

Keep width controlled for readability.

==================================================
7. DECORATIVE DIVIDER
==================================================

Below the heading, optionally add a subtle decorative divider inspired by the reference:

──── ♡ ────

or an equivalent handmade/floral motif.

Keep it minimal.

If it conflicts with the existing brand identity, use a simple refined line instead.

Do not make decorative elements visually dominant.

==================================================
8. BENEFIT ROW
==================================================

Improve the three benefit labels:

- Choose Your Colors
- Personalized Details
- Handmade to Order

Instead of plain text separated only by dots, use subtle icon-supported benefits if compatible with the existing visual system.

Possible icon concepts:

Choose Your Colors:
Flower / palette / leaf

Personalized Details:
Gift / customization

Handmade to Order:
Hand / heart / craft

Use existing icon libraries already installed.

Do NOT install a new icon library just for this section.

Icons should sit inside subtle circular or softly tinted backgrounds.

Keep them small and premium.

Desktop:
Display benefits horizontally.

Mobile:
Allow wrapping or compact stacking.

==================================================
9. CTA AREA
==================================================

PRIMARY CTA:

“Start Your Custom Order →”

Use the existing primary CTA style as the foundation.

It should feel:
- Strong
- Premium
- Rounded
- Highly clickable

Preserve existing hover/focus behavior where possible.

Add only subtle interaction:
- Slight translate
- Arrow movement
- Shadow refinement

SECONDARY CTA:

“View Custom Creations”

Use a refined text-link treatment.

Optional:
Subtle underline or animated underline.

Primary CTA must remain visually dominant.

Do not change existing routes or click behavior.

==================================================
10. RIGHT-SIDE PRODUCT SHOWCASE
==================================================

This is the key visual feature.

Build a premium animated 3-COLUMN vertical product gallery.

The gallery must use ACTUAL product/custom-order images available in the project wherever possible.

Search existing assets before adding placeholders.

Prioritize diverse products:

- Crochet bouquets
- Crochet flower arrangements
- Crochet toys
- Personalized gifts
- Photo frames
- Bangles
- Gift hampers
- Birthday gifts
- Wedding gifts
- Handmade keepsakes
- Other custom-made creations

Distribute product categories intelligently.

Do not place too many visually similar products next to one another.

==================================================
11. THREE-COLUMN LAYOUT
==================================================

Create three narrow vertical tracks.

Movement:

COLUMN 1
↑ Scroll UP continuously

COLUMN 2
↓ Scroll DOWN continuously

COLUMN 3
↑ Scroll UP continuously

Pattern:

↑   ↓   ↑

Adjacent columns must move in opposite directions.

The composition should resemble the reference but be implemented as a real animated interface.

Do NOT make all three columns start at the same vertical position.

Apply different initial offsets.

Example conceptual staggering:

Column 1:
Normal offset

Column 2:
Shifted downward

Column 3:
Different upward/downward offset

This creates an asymmetrical editorial moodboard.

Avoid a rigid synchronized grid.

==================================================
12. PRODUCT CARD DESIGN
==================================================

Use relatively SMALL and refined product cards so several products are visible simultaneously.

Do not return to oversized cards.

Each card should:

- Preserve correct aspect ratio
- Never distort images
- Use object-fit: cover or contain based on actual product asset composition
- Use existing border-radius tokens
- Have subtle premium borders if appropriate
- Use restrained soft shadows
- Have a clean warm/off-white card background where required

Use controlled size variation.

For example:
- Some portrait cards
- Some near-square cards
- Occasional slightly taller cards

Do not randomize excessively.

The composition should feel intentionally curated.

Maintain compact, consistent vertical gaps.

==================================================
13. IMAGE QUALITY
==================================================

Inspect available assets.

Use the highest-quality relevant product images.

Do not:
- Stretch images
- Pixelate assets
- Crop important product details
- Mix inconsistent low-quality placeholders unnecessarily

If the framework provides optimized images, use the existing image component.

Provide explicit dimensions or aspect ratios to prevent CLS/layout shifts.

Lazy-load below-the-fold/non-critical images where appropriate.

==================================================
14. SEAMLESS INFINITE ANIMATION
==================================================

Each column must animate continuously.

This must be a TRUE seamless infinite loop.

Requirements:

- No visible restart
- No jump
- No flicker
- No blank gap
- No sudden reset
- No layout shift

Recommended architecture:

Each column/track should internally contain:

[IMAGE SEQUENCE]
+
[IDENTICAL DUPLICATED IMAGE SEQUENCE]

Animate exactly one sequence length before looping.

For upward movement:

transform:
translate3d(0, 0, 0)
→
translate3d(0, -50%, 0)

For downward movement:

Start from the duplicated-track offset and animate in the opposite direction.

Calculate implementation correctly based on actual DOM structure and gaps.

Do not blindly use -50% if track sizing/gaps make the loop discontinuous.

The duplicate sequence must create pixel-continuous looping.

==================================================
15. ANIMATION SPEED
==================================================

Use a moderately slow premium speed, but slightly more active than an extremely slow decorative marquee.

Suggested starting range:

22–32 seconds per full cycle.

Fine-tune based on:
- Column height
- Number of cards
- Actual perceived movement

The products must remain easy to inspect.

Optionally vary duration slightly:

Column 1:
~26s

Column 2:
~30s

Column 3:
~27s

Variation must remain subtle.

Avoid chaotic movement.

Use:

will-change: transform;

and GPU-friendly transforms.

Prefer CSS animations.

Do not implement continuous React/JavaScript state updates for animation.

==================================================
16. HOVER INTERACTIONS
==================================================

Desktop only:

When the user hovers over a column or product card:

Option A:
Pause that specific column.

OR

Option B:
Subtly slow the visual movement if implementation remains performant.

Preferred:
Pause only the hovered column.

Product card hover:

- Scale image approximately 1.01–1.03
- Slight shadow refinement
- Smooth 300–500ms transition

No dramatic zoom.

No rotation.

No bounce.

No flashy effects.

==================================================
17. TOP & BOTTOM EDGE FADES
==================================================

Add soft fade masks at the top and bottom of the gallery.

Products should appear to:

Fade in
↓
Become fully visible
↓
Fade out

Use CSS mask-image / WebKit mask where supported or carefully positioned gradient overlays.

Blend fades into the actual section background.

Avoid hard clipping.

Do not make the fade so large that product visibility is significantly reduced.

==================================================
18. OPTIONAL MOTION INDICATORS
==================================================

The reference includes subtle directional visual cues.

You may add very understated arrows or dotted vertical lines between/above columns ONLY if they improve the composition.

Examples:

↑
↓
↑

These should be decorative only.

Use:
- Low opacity
- Thin strokes
- Muted warm accent tone

Do not make them look like interactive controls.

If the design looks cleaner without them, omit them.

==================================================
19. RESPONSIVE BEHAVIOR
==================================================

DESKTOP — >= existing large breakpoint

Use:
- Two-zone layout
- Left editorial content
- Right 3-column animated gallery
- ↑ ↓ ↑ movement
- Full visual composition

TABLET

Keep two-column section layout if enough width exists.

Gallery:
Prefer 2 or 3 product columns depending on available width.

Do not make cards excessively narrow.

If using 2 columns:

Column 1 ↑
Column 2 ↓

Reduce:
- Gaps
- Card sizes
- Decorative details
- Heading size

MOBILE

Do NOT squeeze three vertical columns beside the content.

Stack the section:

1. Text/content
2. Benefits
3. CTAs
4. Product showcase

For the product showcase, convert the vertical gallery into a compact horizontal infinite marquee/carousel.

Preferred mobile behavior:

Row 1 → scroll horizontally left
Optional Row 2 → scroll horizontally right

OR use one clean horizontal product strip if that better matches the existing mobile design.

Keep cards touch-friendly.

Do not create horizontal page overflow.

==================================================
20. PREFERS-REDUCED-MOTION
==================================================

Fully support:

@media (prefers-reduced-motion: reduce)

When enabled:

- Disable continuous marquee animations
- Present products as a polished static gallery
- Keep all essential content accessible
- Avoid hiding important products/content

==================================================
21. ACCESSIBILITY
==================================================

Ensure:

- Semantic section structure
- Correct heading hierarchy
- Meaningful image alt text
- Keyboard-accessible CTAs
- Visible focus states
- Sufficient text contrast
- Decorative elements marked appropriately
- No animation that blocks interaction

Duplicated images used only for infinite looping should not create duplicate accessibility announcements.

Use aria-hidden appropriately on duplicated decorative tracks/content.

==================================================
22. PERFORMANCE
==================================================

Optimize aggressively.

Requirements:

- Prefer CSS animations
- Avoid requestAnimationFrame loops unless genuinely necessary
- Avoid React state updates every animation frame
- Use transform rather than top/margin positioning
- Use will-change carefully
- Optimize image dimensions
- Lazy-load appropriate images
- Prevent CLS
- Avoid excessive DOM duplication
- Reuse existing dependencies

The animation must remain smooth on normal laptops and mid-range mobile devices.

==================================================
23. IMPLEMENTATION QUALITY
==================================================

Do not create one giant unmaintainable component.

Follow the existing project architecture.

If appropriate, structure into reusable pieces such as:

CustomOrderSection
CustomProductGallery
ProductColumn
ProductCard

But do not over-engineer.

Keep product data in a clean array/config rather than repeating markup manually.

Example conceptual structure:

const customProducts = [
  {
    src: "...",
    alt: "...",
    aspect: "portrait"
  },
  ...
];

Then distribute images across columns.

Use the project’s existing conventions.

==================================================
24. DO NOT DO THESE
==================================================

Do NOT:

- Redesign unrelated homepage sections
- Modify global styles unnecessarily
- Change navigation/footer
- Break existing routes
- Replace actual assets with random stock photos
- Introduce a new unrelated color palette
- Create oversized product cards
- Use a rigid grid
- Make all columns move in the same direction
- Make all columns perfectly aligned
- Add excessive animations
- Add heavy animation dependencies unnecessarily
- Use autoplay video
- Cause horizontal overflow
- Duplicate accessibility content
- Distort images
- Leave placeholder TODOs
- Deliver only a mockup without implementation

==================================================
25. VISUAL TARGET
==================================================

Use the supplied reference image as the visual direction.

Match its key characteristics:

- Warm ivory/blush atmosphere
- Premium editorial composition
- Large expressive heading
- Clear conversion-focused CTA
- Refined benefit indicators
- 3-column handmade-product showcase
- Small elegant product cards
- Staggered/asymmetrical positioning
- Alternating vertical motion
- Subtle botanical decoration
- Soft depth and shadows
- Generous whitespace

However:

Do NOT pixel-copy the reference blindly.

Adapt it intelligently to the existing Lara’s Pinnal design system and actual website dimensions.

The implementation should look native to the current website.

==================================================
26. FINAL QUALITY CHECK
==================================================

After implementation:

1. Run/build the project.
2. Fix all TypeScript/ESLint/build errors related to the changes.
3. Check desktop, tablet, and mobile layouts.
4. Verify both CTA actions still work.
5. Verify all product images load correctly.
6. Verify Column 1 moves UP.
7. Verify Column 2 moves DOWN.
8. Verify Column 3 moves UP.
9. Watch at least one complete animation cycle and confirm there is NO visible jump.
10. Check hover/pause behavior.
11. Check prefers-reduced-motion.
12. Check for horizontal overflow.
13. Check image distortion and cropping.
14. Confirm no unrelated sections were changed.
15. Remove unused code introduced during implementation.

FINAL EXPECTED RESULT:

A production-ready Custom Order section that feels like a premium handmade boutique editorial banner.

LEFT:
“Made by Hand. Made for You.” content, benefits, and conversion CTAs.

RIGHT:
A visually rich 3-column animated showcase of real Lara’s Pinnal custom creations:

Column 1 ↑
Column 2 ↓
Column 3 ↑

The product cards should be compact, staggered, continuously moving, seamless, elegant, and integrated into a warm cream/blush editorial background.

Do not stop after describing what should be changed.

Inspect the existing implementation, make the actual code changes, test them, and deliver a complete working implementation while preserving the rest of the website.
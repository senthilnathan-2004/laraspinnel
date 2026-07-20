"use client";

import React, { useEffect, useRef, useState } from "react";

interface StickyBoxProps {
  /** Pixels from the top of the viewport where the content should pin. */
  topOffset: number;
  /**
   * Minimum viewport width (px) at which sticky/fixed behavior is allowed to
   * engage — below this, the box always stays in normal document flow. Use
   * this to match whatever breakpoint your layout switches to a side-by-side
   * column arrangement at (e.g. 768 for Tailwind's `md:`); otherwise a
   * single-column mobile layout would get a fixed box overlapping the
   * content stacked beneath it.
   */
  enableFrom?: number;
  /** Applied to the outer slot — use this for hidden/display/grid-cell classes. */
  className?: string;
  children: React.ReactNode;
}

// A JS-driven alternative to `position: sticky`, for cases where native
// sticky doesn't engage (browser/ancestor quirks) — this measures its own
// slot and switches the content to `position: fixed` via scroll tracking,
// so it's guaranteed to work regardless of any CSS containing-block issue.
// Same approach used for the admin header (AdminTopbar).
//
// Mirrors native sticky's full behavior, not just the "pin to viewport"
// part: once the slot's own container (its parent element — must be
// `position: relative`) approaches its bottom edge, the box docks there
// instead of continuing to float over whatever comes after the container
// (e.g. the footer).
export default function StickyBox({ topOffset, enableFrom = 0, className = "", children }: StickyBoxProps) {
  const slotRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const measuredRef = useRef<{ height: number; width: number } | undefined>(undefined);
  const [slotHeight, setSlotHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const slot = slotRef.current;
      const container = slot?.parentElement;
      if (!slot || !container) return;

      if (window.innerWidth < enableFrom) {
        // Below the breakpoint where the layout goes side-by-side — stay in
        // normal flow (mirrors how the column layout itself collapses).
        measuredRef.current = undefined;
        setSlotHeight(undefined);
        setStyle({});
        ticking = false;
        return;
      }

      const slotRect = slot.getBoundingClientRect();

      // Measure the slot's natural size once per layout, before it's ever
      // repositioned, so removing it from flow later doesn't collapse the
      // layout. Cleared above whenever we drop below `enableFrom` so a
      // resize back up re-measures fresh instead of reusing a stale value.
      if (!measuredRef.current) {
        measuredRef.current = { height: slot.scrollHeight, width: slotRect.width };
        setSlotHeight(slot.scrollHeight);
      }
      const { height: boxHeight, width: boxWidth } = measuredRef.current;

      const containerRect = container.getBoundingClientRect();
      // The lowest viewport position the box's top could sit at while fixed
      // without its bottom edge overflowing past the container's bottom.
      const maxFixedTop = containerRect.bottom - boxHeight;

      if (slotRect.top > topOffset) {
        // Hasn't reached the sticky point yet — normal flow.
        setStyle({});
      } else if (maxFixedTop > topOffset) {
        // Room to spare within the container — pin to the viewport.
        setStyle({ position: "fixed", top: topOffset, left: slotRect.left, width: boxWidth, zIndex: 20 });
      } else {
        // Container's bottom is approaching — dock there instead of
        // floating past it over whatever comes next (e.g. the footer).
        // `position: absolute` is relative to the container, so `left` must
        // be the slot's offset from the container's left edge — not 0,
        // which only happened to look right for a slot that starts flush
        // with the container's left side (e.g. a left-hand sidebar) and
        // snaps a right-hand column (e.g. a cart summary) to the far left.
        setStyle({
          position: "absolute",
          left: slotRect.left - containerRect.left,
          top: container.clientHeight - boxHeight,
          width: boxWidth,
        });
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    const onResize = () => {
      // Force a fresh measurement — column widths/breakpoint may have changed.
      measuredRef.current = undefined;
      onScroll();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [topOffset, enableFrom]);

  return (
    <div ref={slotRef} className={className} style={slotHeight ? { minHeight: slotHeight } : undefined}>
      <div style={style}>{children}</div>
    </div>
  );
}

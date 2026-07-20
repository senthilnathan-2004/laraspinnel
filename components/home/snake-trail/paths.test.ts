import { test } from "node:test";
import assert from "node:assert/strict";
import { getTrailGeometry } from "./paths";

function assertRectWithinCanvas(
  rect: { x: number; y: number; width: number; height: number },
  width: number,
  height: number
) {
  assert.ok(rect.x >= 0 && rect.y >= 0);
  assert.ok(rect.x + rect.width <= width);
  assert.ok(rect.y + rect.height <= height);
}

for (const variant of ["mobile", "tablet"] as const) {
  test(`getTrailGeometry("${variant}") card rect fits within the canvas`, () => {
    const geometry = getTrailGeometry(variant);
    assertRectWithinCanvas(geometry.cardRect, geometry.width, geometry.height);
  });

  test(`getTrailGeometry("${variant}") accent regions fit within the canvas`, () => {
    const geometry = getTrailGeometry(variant);
    for (const region of geometry.accentMaskRegions) {
      assertRectWithinCanvas(region, geometry.width, geometry.height);
    }
  });

  test(`getTrailGeometry("${variant}") produces a closed SVG path`, () => {
    const geometry = getTrailGeometry(variant);
    assert.ok(geometry.pathD.startsWith("M "));
    assert.ok(geometry.pathD.trim().endsWith("Z"));
  });
}

test("mobile and tablet geometries use distinct aspect ratios", () => {
  const mobile = getTrailGeometry("mobile");
  const tablet = getTrailGeometry("tablet");
  assert.notEqual(mobile.width / mobile.height, tablet.width / tablet.height);
});

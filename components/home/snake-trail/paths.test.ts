import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getTrailGeometry,
  getRandomizedPathD,
  getBaseLoopPoints,
  getRandomizedLoopPoints,
  lerpLoopPoints,
  loopPointsToPathD,
} from "./paths";

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

for (const variant of ["mobile", "tablet"] as const) {
  test(`getRandomizedPathD("${variant}") always starts at the same fixed anchor point`, () => {
    const first = getRandomizedPathD(variant);
    const second = getRandomizedPathD(variant);
    const startOf = (d: string) => d.match(/^M (\S+) (\S+)/)?.slice(1).join(" ");
    assert.equal(startOf(first), startOf(second));
  });

  test(`getRandomizedPathD("${variant}") produces a closed SVG path`, () => {
    const d = getRandomizedPathD(variant);
    assert.ok(d.startsWith("M "));
    assert.ok(d.trim().endsWith("Z"));
  });

  test(`getRandomizedPathD("${variant}") varies between calls`, () => {
    const attempts = Array.from({ length: 5 }, () => getRandomizedPathD(variant));
    const distinct = new Set(attempts);
    assert.ok(distinct.size > 1);
  });

  test(`getRandomizedLoopPoints("${variant}") never jitters point [0]`, () => {
    const base = getBaseLoopPoints(variant);
    const jittered = getRandomizedLoopPoints(variant);
    assert.deepEqual(jittered[0], base[0]);
  });

  test(`getRandomizedLoopPoints("${variant}") returns the same point count as the base loop`, () => {
    const base = getBaseLoopPoints(variant);
    const jittered = getRandomizedLoopPoints(variant);
    assert.equal(jittered.length, base.length);
  });
}

test("lerpLoopPoints at t=0 returns the from loop unchanged", () => {
  const from = getBaseLoopPoints("mobile");
  const to = getRandomizedLoopPoints("mobile");
  assert.deepEqual(lerpLoopPoints(from, to, 0), from);
});

test("lerpLoopPoints at t=1 returns the to loop", () => {
  const from = getBaseLoopPoints("mobile");
  const to = getRandomizedLoopPoints("mobile");
  const result = lerpLoopPoints(from, to, 1);
  for (let i = 0; i < result.length; i++) {
    assert.ok(Math.abs(result[i][0] - to[i][0]) < 1e-9);
    assert.ok(Math.abs(result[i][1] - to[i][1]) < 1e-9);
  }
});

test("lerpLoopPoints at t=0.5 lands halfway between the two loops", () => {
  const from: [number, number][] = [
    [0, 0],
    [10, 20],
  ];
  const to: [number, number][] = [
    [0, 0],
    [30, 60],
  ];
  const result = lerpLoopPoints(from, to, 0.5);
  assert.deepEqual(result[1], [20, 40]);
});

test("loopPointsToPathD produces a closed path for a loop point set", () => {
  const d = loopPointsToPathD(getBaseLoopPoints("tablet"));
  assert.ok(d.startsWith("M "));
  assert.ok(d.trim().endsWith("Z"));
});

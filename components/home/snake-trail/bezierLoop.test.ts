import { test } from "node:test";
import assert from "node:assert/strict";
import { catmullRomLoopToBezier, arcsToPathD, type Point } from "./bezierLoop";

const SQUARE: Point[] = [
  [0, 0],
  [100, 0],
  [100, 100],
  [0, 100],
];

test("catmullRomLoopToBezier produces one arc per input point", () => {
  const arcs = catmullRomLoopToBezier(SQUARE);
  assert.equal(arcs.length, SQUARE.length);
});

test("catmullRomLoopToBezier forms a closed loop: each arc's end matches the next arc's start", () => {
  const arcs = catmullRomLoopToBezier(SQUARE);
  for (let i = 0; i < arcs.length; i++) {
    const next = arcs[(i + 1) % arcs.length];
    assert.deepEqual(arcs[i].end, next.start);
  }
});

test("catmullRomLoopToBezier throws for fewer than 3 points", () => {
  assert.throws(() =>
    catmullRomLoopToBezier([
      [0, 0],
      [1, 1],
    ])
  );
});

test("arcsToPathD starts with M, includes one C per arc, and closes with Z", () => {
  const arcs = catmullRomLoopToBezier(SQUARE);
  const d = arcsToPathD(arcs);
  assert.ok(d.startsWith("M 0 0"));
  assert.equal((d.match(/C /g) ?? []).length, arcs.length);
  assert.ok(d.trim().endsWith("Z"));
});

test("arcsToPathD returns an empty string for no arcs", () => {
  assert.equal(arcsToPathD([]), "");
});

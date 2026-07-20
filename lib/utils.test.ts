import { test } from "node:test";
import assert from "node:assert/strict";
import { hexToRgba, getTrailGradientStops } from "./utils";

test("hexToRgba converts a hex color and alpha into an rgba string", () => {
  assert.equal(hexToRgba("#6B4A2E", 0.9), "rgba(107, 74, 46, 0.9)");
});

test("hexToRgba handles alpha 0 and 1", () => {
  assert.equal(hexToRgba("#000000", 0), "rgba(0, 0, 0, 0)");
  assert.equal(hexToRgba("#ffffff", 1), "rgba(255, 255, 255, 1)");
});

test("getTrailGradientStops returns a lighter, base, and darker hex triad", () => {
  const stops = getTrailGradientStops("#6B4A2E");
  assert.equal(stops.base, "#6b4a2e");
  assert.match(stops.light, /^#[0-9a-f]{6}$/);
  assert.match(stops.dark, /^#[0-9a-f]{6}$/);
  assert.notEqual(stops.light, stops.base);
  assert.notEqual(stops.dark, stops.base);
});

test("getTrailGradientStops light stop is closer to white than base", () => {
  const stops = getTrailGradientStops("#202020");
  const baseLuminance = parseInt(stops.base.slice(1, 3), 16);
  const lightLuminance = parseInt(stops.light.slice(1, 3), 16);
  assert.ok(lightLuminance > baseLuminance);
});

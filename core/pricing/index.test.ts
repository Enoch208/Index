import { test, expect } from "vitest";
import { fmvDeviation, findMispriced } from "./index";
import type { Listing } from "../types";

const base = (over: Partial<Listing>): Listing => ({
  card_id: "x", name: "n", set: "S", grade: "10", grader: "PSA",
  fmv: 100, custody_status: "vaulted", url: "u", ...over,
});

test("fmvDeviation is (ask-fmv)/fmv", () => {
  expect(fmvDeviation(80, 100)).toBeCloseTo(-0.2, 6);
});

test("findMispriced returns only listings under -threshold, sorted most-underpriced first", () => {
  const ls = [
    base({ card_id: "a", ask: 80, fmv: 100 }),   // -20%
    base({ card_id: "b", ask: 95, fmv: 100 }),   // -5%  (above threshold)
    base({ card_id: "c", ask: 60, fmv: 100 }),   // -40%
    base({ card_id: "d", fmv: 100 }),            // no ask -> excluded
  ];
  const out = findMispriced(ls, {});
  expect(out.map((m) => m.listing.card_id)).toEqual(["c", "a"]);
  expect(out[0].fmv_deviation).toBeCloseTo(-0.4, 6);
});

test("findMispriced honours set/grade/budget filters", () => {
  const ls = [
    base({ card_id: "a", ask: 50, fmv: 100, set: "Eden", grade: "10" }),
    base({ card_id: "b", ask: 50, fmv: 100, set: "Omega", grade: "10" }),
    base({ card_id: "c", ask: 500, fmv: 1000, set: "Eden", grade: "10" }), // over budget
  ];
  const out = findMispriced(ls, { set: "Eden", grade: "10", budget: 100 });
  expect(out.map((m) => m.listing.card_id)).toEqual(["a"]);
});

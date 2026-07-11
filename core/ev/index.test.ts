import { test, expect } from "vitest";
import { packEv, effectiveProbs } from "./index";
import type { PoolOdds } from "../types";

const infinitePool: PoolOdds = {
  pack_slug: "t", pack_price: 100, model: "infinite",
  tiers: [
    { label: "A", odds: 0.1, card_count: 1, fmv_low: 500, fmv_high: 500 },
    { label: "B", odds: 0.9, card_count: 9, fmv_low: 50, fmv_high: 50 },
  ],
};

test("packEv computes EV as the odds-weighted mean of tier mids", () => {
  const r = packEv(infinitePool);
  // 0.1*500 + 0.9*50 = 95
  expect(r.ev_per_rip).toBeCloseTo(95, 6);
  expect(r.ev_cost_ratio).toBeCloseTo(0.95, 6);
  expect(r.depletion_adjusted).toBe(false);
});

test("tier-hit probability over k rips is 1-(1-p)^k", () => {
  const r = packEv(infinitePool, 10);
  const a = r.tier_hit_probs.find((t) => t.label === "A")!;
  expect(a.p_at_least_one).toBeCloseTo(1 - Math.pow(0.9, 10), 6); // ~0.651
});

test("limited pools with remaining counts use depletion-adjusted probabilities", () => {
  const limited: PoolOdds = {
    pack_slug: "t2", pack_price: 100, model: "limited",
    tiers: [
      { label: "A", odds: 0.5, card_count: 10, cards_remaining: 1, fmv_low: 500, fmv_high: 500 },
      { label: "B", odds: 0.5, card_count: 10, cards_remaining: 9, fmv_low: 50, fmv_high: 50 },
    ],
  };
  const { probs, depletion } = effectiveProbs(limited);
  expect(depletion).toBe(true);
  expect(probs[0]).toBeCloseTo(0.1, 6); // 1/(1+9)
  expect(packEv(limited).ev_per_rip).toBeCloseTo(0.1 * 500 + 0.9 * 50, 6); // 95
});

test("variance combines between-tier spread and the within-tier uniform term", () => {
  // Two equally-likely tiers: A mid=0 (0..0), B mid=6 (0..12); EV = 3.
  // between-tier: 0.5*(0-3)^2 + 0.5*(6-3)^2 = 9
  // within-tier:  0.5*0 + 0.5*(12-0)^2/12 = 6
  // variance = 15  ->  std_dev = sqrt(15)
  const pool: PoolOdds = {
    pack_slug: "spread", pack_price: 10, model: "infinite",
    tiers: [
      { label: "A", odds: 0.5, card_count: 1, fmv_low: 0, fmv_high: 0 },
      { label: "B", odds: 0.5, card_count: 1, fmv_low: 0, fmv_high: 12 },
    ],
  };
  const r = packEv(pool);
  expect(r.ev_per_rip).toBeCloseTo(3, 6);
  expect(r.std_dev).toBeCloseTo(Math.sqrt(15), 6);
});

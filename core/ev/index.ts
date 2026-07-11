import type { PoolOdds, Tier } from "../types";

export interface EvComputation {
  ev_per_rip: number;
  ev_cost_ratio: number;
  std_dev: number;
  tier_hit_probs: { label: string; p_at_least_one: number; rips: number }[];
  depletion_adjusted: boolean;
}

const tierMid = (t: Tier): number => (t.fmv_low + t.fmv_high) / 2;

export function effectiveProbs(pool: PoolOdds): { probs: number[]; depletion: boolean } {
  if (pool.model === "limited" && pool.tiers.every((t) => typeof t.cards_remaining === "number")) {
    const total = pool.tiers.reduce((s, t) => s + (t.cards_remaining ?? 0), 0);
    if (total > 0) {
      return { probs: pool.tiers.map((t) => (t.cards_remaining ?? 0) / total), depletion: true };
    }
  }
  return { probs: pool.tiers.map((t) => t.odds), depletion: false };
}

export function packEv(pool: PoolOdds, rips = 1): EvComputation {
  const { probs, depletion } = effectiveProbs(pool);
  const mids = pool.tiers.map(tierMid);
  const ev = probs.reduce((s, p, i) => s + p * mids[i], 0);
  const variance = probs.reduce((s, p, i) => {
    const withinTier = Math.pow(pool.tiers[i].fmv_high - pool.tiers[i].fmv_low, 2) / 12;
    return s + p * (Math.pow(mids[i] - ev, 2) + withinTier);
  }, 0);
  return {
    ev_per_rip: ev,
    ev_cost_ratio: ev / pool.pack_price,
    std_dev: Math.sqrt(variance),
    depletion_adjusted: depletion,
    tier_hit_probs: pool.tiers.map((t, i) => ({
      label: t.label,
      rips,
      p_at_least_one: 1 - Math.pow(1 - probs[i], rips),
    })),
  };
}

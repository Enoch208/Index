import { z } from "zod";
import { envelope } from "../envelope";
import { packEv, ripOrBuy } from "../ev/index";
import { findMispriced } from "../pricing/index";
import type { EvResult, RipOrBuyResult } from "../types";
import type { Registry, ToolDeps } from "./index";

const EV_ASSUMPTIONS = [
  "Published odds are accurate (partially supported by the Merkle audit).",
  "Tier FMV taken as the midpoint of the published range.",
  "No marketplace fees or bid/ask spread included.",
];

export function registerAnalysisTools(reg: Registry, d: ToolDeps): void {
  reg.compute_pack_ev = {
    description: "Compute EV per rip, EV/cost, variance, and tier-hit probabilities for a pack.",
    inputSchema: z.object({ pack_slug: z.string(), rips: z.number().int().positive().optional() }),
    handler: async (input) => {
      const { pack_slug, rips } = input as { pack_slug: string; rips?: number };
      const f = await d.source.poolOdds(pack_slug);
      const c = packEv(f.data, rips ?? 1);
      const result: EvResult = {
        pack_slug,
        cost: f.data.pack_price,
        ev_per_rip: c.ev_per_rip,
        ev_cost_ratio: c.ev_cost_ratio,
        std_dev: c.std_dev,
        tier_hit_probs: c.tier_hit_probs,
        depletion_adjusted: c.depletion_adjusted,
        assumptions: EV_ASSUMPTIONS,
      };
      return envelope(result, { source: f.source, data_kind: f.data_kind });
    },
  };

  reg.rip_or_buy = {
    description: "Compare buying a target card directly vs acquiring it via gacha (depletion-adjusted EV).",
    inputSchema: z.object({ card_id: z.string(), pack_slug: z.string(), hit_prob: z.number().positive() }),
    handler: async (input) => {
      const { card_id, pack_slug, hit_prob } = input as { card_id: string; pack_slug: string; hit_prob: number };
      const pool = await d.source.poolOdds(pack_slug);
      const listing = await d.source.listings({ cardId: card_id });
      const target = listing.data[0];
      if (!target) throw new Error(`no listing for ${card_id}`);
      const c = packEv(pool.data);
      const ask = target.ask ?? target.fmv;
      const rb = ripOrBuy({
        target_fmv: target.fmv, hit_prob, pack_price: pool.data.pack_price,
        ev_per_rip: c.ev_per_rip, direct_ask: ask,
      });
      const result: RipOrBuyResult = {
        card_id, direct_ask: ask,
        gacha_net_expected_cost: rb.gacha_net_expected_cost,
        expected_rips: rb.expected_rips, hit_prob, verdict: rb.verdict,
        workings:
          `Direct ask $${ask}. Expected ${rb.expected_rips.toFixed(1)} rips at p=${hit_prob}; ` +
          `net expected gacha cost = (P−EV)/p + FMV = ($${pool.data.pack_price}−$${c.ev_per_rip.toFixed(0)})/${hit_prob} + $${target.fmv} ` +
          `= $${rb.gacha_net_expected_cost.toFixed(0)}. Verdict: ${rb.verdict}.`,
      };
      // data_kind is the weaker of the two reads
      const dk = pool.data_kind === "live" && listing.data_kind === "live" ? "live" : "snapshot";
      return envelope(result, { source: `${pool.source}; ${listing.source}`, data_kind: dk });
    },
  };

  reg.find_mispriced_listings = {
    description: "Find listings whose ask deviates below FMV beyond a threshold, ranked.",
    inputSchema: z.object({
      set: z.string().optional(), grade: z.string().optional(),
      budget: z.number().positive().optional(), threshold: z.number().positive().optional(),
      q: z.string().optional(),
    }),
    handler: async (input) => {
      const opts = input as { set?: string; grade?: string; budget?: number; threshold?: number; q?: string };
      const f = await d.source.listings({ q: opts.q });
      const ranked = findMispriced(f.data, opts);
      return envelope(ranked, { source: f.source, data_kind: f.data_kind });
    },
  };
}

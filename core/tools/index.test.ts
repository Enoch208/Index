import { test, expect } from "vitest";
import { getRegistry } from "./index";
import { DISCLAIMER } from "../envelope";

const reg = getRegistry();

test("registry exposes the four M1 read tools", () => {
  for (const name of ["get_listing", "get_pool_odds", "get_portfolio", "get_fmv_history"]) {
    expect(reg[name]).toBeDefined();
  }
});

test("get_pool_odds returns an envelope with required contract fields", async () => {
  const e = await reg.get_pool_odds.handler({ pack_slug: "eden-pack" });
  expect(e.source).toBeTruthy();
  expect(e.data_kind).toBe("snapshot");
  expect(e.retrieved_at).toBeTruthy();
  expect(e.caveats).toContain(DISCLAIMER);
  expect((e.data as any).pack_price).toBe(150);
});

test("get_listing validates input via zod", async () => {
  await expect(reg.get_listing.handler({} as any)).resolves.toBeDefined(); // both fields optional
  const e = await reg.get_listing.handler({ q: "eevee" });
  expect(Array.isArray(e.data)).toBe(true);
});

test("compute_pack_ev returns an EvResult envelope with assumptions", async () => {
  const e = await reg.compute_pack_ev.handler({ pack_slug: "eden-pack", rips: 5 });
  const d = e.data as any;
  expect(d.pack_slug).toBe("eden-pack");
  expect(d.cost).toBe(150);
  expect(typeof d.ev_per_rip).toBe("number");
  expect(d.assumptions.length).toBeGreaterThan(0);
  expect(e.caveats).toContain("Probability and pricing math, not financial advice; FMV is an estimate.");
});

test("rip_or_buy compares direct ask against depletion-adjusted gacha EV", async () => {
  const e = await reg.rip_or_buy.handler({ card_id: "charizard-base-psa9-014", pack_slug: "eden-pack", hit_prob: 0.01 });
  const d = e.data as any;
  expect(["buy", "rip", "toss-up"]).toContain(d.verdict);
  expect(typeof d.gacha_net_expected_cost).toBe("number");
  expect(d.workings).toContain("expected");
});

test("find_mispriced_listings ranks underpriced listings", async () => {
  const e = await reg.find_mispriced_listings.handler({ threshold: 0.1 });
  expect(Array.isArray(e.data)).toBe(true);
});

test("verify_merkle_proof reports match when readers agree", async () => {
  const { merkleRoot } = await import("../chain/merkle");
  const leaves = ["0x01", "0x02"] as `0x${string}`[];
  const root = merkleRoot(leaves);
  const reg2 = getRegistry({
    rootReader: { getRoot: async () => root },
    leavesReader: { getLeaves: async () => leaves },
  });
  const e = await reg2.verify_merkle_proof.handler({ pack_slug: "eden-pack" });
  expect((e.data as any).match).toBe(true);
  expect((e.data as any).not_proven.length).toBeGreaterThan(0);
});

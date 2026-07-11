import { test, expect } from "vitest";
import { resolveSource, ttlCache, type RenaissSource } from "./index";
import { SnapshotSource } from "./snapshot";

const snap = new SnapshotSource();

test("SnapshotSource reads a seeded pool", async () => {
  const pool = await snap.poolOdds("eden-pack");
  expect(pool.pack_price).toBe(150);
  expect(pool.tiers.length).toBeGreaterThan(0);
});

test("resolveSource falls back to snapshot and tags data_kind", async () => {
  const broken: RenaissSource = {
    kind: "live", name: "live",
    listings: async () => { throw new Error("down"); },
    poolOdds: async () => { throw new Error("down"); },
    portfolio: async () => { throw new Error("down"); },
    fmvHistory: async () => { throw new Error("down"); },
    marketPulse: async () => { throw new Error("down"); },
  };
  const r = resolveSource(broken, snap);
  const res = await r.poolOdds("eden-pack");
  expect(res.data_kind).toBe("snapshot");
  expect(res.data.pack_price).toBe(150);
});

test("resolveSource prefers live when it succeeds", async () => {
  const r = resolveSource(snap /* stand-in live */, snap);
  const res = await r.listings({ q: "eevee" });
  expect(res.source).toBe(snap.name);
});

test("ttlCache expires entries using injected clock", () => {
  let now = 0;
  const c = ttlCache<number>(100, () => now);
  c.set("k", 5);
  expect(c.get("k")).toBe(5);
  now = 101;
  expect(c.get("k")).toBeUndefined();
});

import { test, expect } from "vitest";
import { verifyMerkle } from "./verify";
import { merkleRoot } from "./merkle";

const leaves = ["0x01", "0x02", "0x03"] as `0x${string}`[];

test("verifyMerkle reports match when recomputed root equals on-chain root", () => {
  const root = merkleRoot(leaves);
  const v = verifyMerkle({ packSlug: "eden-pack", leaves, onchainRoot: root });
  expect(v.match).toBe(true);
  expect(v.proven.join(" ")).toMatch(/committed/i);
  expect(v.not_proven.join(" ")).toMatch(/FMV/i);
});

test("verifyMerkle reports mismatch when roots differ", () => {
  const v = verifyMerkle({ packSlug: "eden-pack", leaves, onchainRoot: "0xdeadbeef" as `0x${string}` });
  expect(v.match).toBe(false);
});

test("verifyMerkle returns match=null when leaves are unavailable", () => {
  const v = verifyMerkle({ packSlug: "eden-pack", leaves: null, onchainRoot: "0xabc" as `0x${string}` });
  expect(v.match).toBeNull();
  expect(v.not_proven.length).toBeGreaterThan(0);
});

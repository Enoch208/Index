import { test, expect } from "vitest";
import { enforceOutputContract, buildDraftOrder, refuseUngrounded, PolicyError } from "./index";
import { envelope, DISCLAIMER } from "../envelope";

test("enforceOutputContract passes a well-formed envelope", () => {
  const e = envelope({ v: 1 }, { source: "s", data_kind: "snapshot" });
  expect(enforceOutputContract(e)).toBe(e);
});

test("enforceOutputContract throws when the disclaimer is missing", () => {
  const bad = { data: 1, source: "s", retrieved_at: "t", data_kind: "snapshot" as const, caveats: [] };
  expect(() => enforceOutputContract(bad)).toThrow(PolicyError);
});

test("enforceOutputContract throws when source is empty", () => {
  const bad = { data: 1, source: "", retrieved_at: "t", data_kind: "snapshot" as const, caveats: [DISCLAIMER] };
  expect(() => enforceOutputContract(bad)).toThrow(/source/);
});

test("buildDraftOrder requires confirmation and enforces the spend cap", () => {
  const d = buildDraftOrder({ kind: "offer", card_id: "c", amount: 50 }, 100, () => 0);
  expect(d.requires_confirmation).toBe(true);
  expect(d.spend_cap).toBe(100);
  expect(() => buildDraftOrder({ kind: "offer", card_id: "c", amount: 500 }, 100, () => 0)).toThrow(/cap/i);
});

test("refuseUngrounded returns a structured refusal", () => {
  expect(refuseUngrounded("no tool data")).toEqual({ refused: true, reason: "no tool data" });
});

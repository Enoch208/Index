import { test, expect } from "vitest";
import { negotiate } from "./negotiate";
import { getRegistry } from "../tools/index";

test("negotiate verifies custody, converges, and emits a draft settlement within spend cap", async () => {
  const reg = getRegistry();
  const { transcript, settlement } = await negotiate(
    { name: "A", wallet: "0xa", wants: "charizard-base-psa9-014", max_spend: 3000 },
    { name: "B", wallet: "0xdemo", wants: "cash", max_spend: 0 },
    "charizard-base-psa9-014",
    reg,
  );
  expect(transcript.some((t) => t.tool === "get_listing")).toBe(true);
  expect(transcript.some((t) => t.tool === "verify_merkle_proof")).toBe(true);
  expect(settlement).not.toBeNull();
  expect(settlement!.requires_confirmation).toBe(true);
  expect(settlement!.amount).toBeLessThanOrEqual(3000);
});

test("negotiate produces no settlement when the price exceeds the buyer's cap", async () => {
  const reg = getRegistry();
  const { settlement } = await negotiate(
    { name: "A", wallet: "0xa", wants: "charizard-base-psa9-014", max_spend: 100 },
    { name: "B", wallet: "0xdemo", wants: "cash", max_spend: 0 },
    "charizard-base-psa9-014",
    reg,
  );
  expect(settlement).toBeNull();
});

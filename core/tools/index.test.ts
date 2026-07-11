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

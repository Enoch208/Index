import { test, expect } from "vitest";
import { envelope, DISCLAIMER } from "./envelope";

test("envelope carries source/retrieved_at/data_kind and always appends the disclaimer", () => {
  const e = envelope({ x: 1 }, { source: "renaiss.xyz", data_kind: "snapshot", retrieved_at: "2026-07-11T00:00:00Z" });
  expect(e.data).toEqual({ x: 1 });
  expect(e.source).toBe("renaiss.xyz");
  expect(e.data_kind).toBe("snapshot");
  expect(e.retrieved_at).toBe("2026-07-11T00:00:00Z");
  expect(e.caveats).toContain(DISCLAIMER);
});

test("envelope does not duplicate the disclaimer when already provided", () => {
  const e = envelope(1, { source: "s", data_kind: "mock", caveats: [DISCLAIMER, "stale"] });
  expect(e.caveats.filter((c) => c === DISCLAIMER)).toHaveLength(1);
  expect(e.caveats).toContain("stale");
});

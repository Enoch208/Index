import { test, expect } from "vitest";
import { merkleRoot } from "./merkle";

test("merkleRoot is deterministic and pair-order independent", () => {
  const a = "0x01" as `0x${string}`;
  const b = "0x02" as `0x${string}`;
  expect(merkleRoot([a, b])).toBe(merkleRoot([b, a]));
  expect(merkleRoot([a, b])).toMatch(/^0x[0-9a-f]{64}$/);
});

test("merkleRoot of a single leaf is a 32-byte hash", () => {
  expect(merkleRoot(["0xabcd" as `0x${string}`])).toMatch(/^0x[0-9a-f]{64}$/);
});

import { test, expect } from "vitest";
import { LiveRenaissSource } from "./live";

function fakeFetch(payload: unknown): typeof fetch {
  return (async () => new Response(JSON.stringify(payload), { status: 200 })) as unknown as typeof fetch;
}

test("LiveRenaissSource maps API pool response into PoolOdds and reports kind=live", async () => {
  const src = new LiveRenaissSource({
    baseUrl: "https://api.example",
    fetchImpl: fakeFetch({ pack_slug: "eden-pack", pack_price: 150, model: "limited", tiers: [] }),
  });
  expect(src.kind).toBe("live");
  const pool = await src.poolOdds("eden-pack");
  expect(pool.pack_price).toBe(150);
});

test("LiveRenaissSource caches within the TTL window", async () => {
  let calls = 0;
  const counting = (async () => { calls++; return new Response(JSON.stringify({ pack_slug: "x", pack_price: 1, model: "infinite", tiers: [] }), { status: 200 }); }) as unknown as typeof fetch;
  let now = 0;
  const src = new LiveRenaissSource({ baseUrl: "https://api.example", fetchImpl: counting, now: () => now });
  await src.poolOdds("x");
  await src.poolOdds("x"); // within 10s depletion TTL -> cached
  expect(calls).toBe(1);
});

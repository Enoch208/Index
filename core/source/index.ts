import type { DataKind, Listing, PoolOdds, Portfolio, FmvHistory, MarketPulse } from "../types";

export interface RenaissSource {
  readonly kind: DataKind;
  readonly name: string;
  listings(query: { cardId?: string; q?: string }): Promise<Listing[]>;
  poolOdds(packSlug: string): Promise<PoolOdds>;
  portfolio(addr: string): Promise<Portfolio>;
  fmvHistory(cardId: string): Promise<FmvHistory>;
  marketPulse(): Promise<MarketPulse>;
}

export interface Fetched<T> { data: T; data_kind: DataKind; source: string; }

export function resolveSource(live: RenaissSource | null, snapshot: RenaissSource) {
  async function attempt<T>(fn: (s: RenaissSource) => Promise<T>): Promise<Fetched<T>> {
    if (live) {
      try {
        return { data: await fn(live), data_kind: live.kind, source: live.name };
      } catch {
        /* fall through to snapshot */
      }
    }
    return { data: await fn(snapshot), data_kind: snapshot.kind, source: snapshot.name };
  }
  return {
    listings: (q: { cardId?: string; q?: string }) => attempt((s) => s.listings(q)),
    poolOdds: (slug: string) => attempt((s) => s.poolOdds(slug)),
    portfolio: (addr: string) => attempt((s) => s.portfolio(addr)),
    fmvHistory: (cardId: string) => attempt((s) => s.fmvHistory(cardId)),
    marketPulse: () => attempt((s) => s.marketPulse()),
  };
}

export function ttlCache<V>(ttlMs: number, now: () => number = () => Date.now()) {
  const store = new Map<string, { v: V; exp: number }>();
  return {
    get(key: string): V | undefined {
      const e = store.get(key);
      if (!e) return undefined;
      if (now() > e.exp) { store.delete(key); return undefined; }
      return e.v;
    },
    set(key: string, v: V) { store.set(key, { v, exp: now() + ttlMs }); },
  };
}

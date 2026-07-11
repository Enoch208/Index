import type { Listing, PoolOdds, Portfolio, FmvHistory, MarketPulse } from "../types";
import type { RenaissSource } from "./index";
import eden from "./fixtures/eden-pack.json";
import omega from "./fixtures/omega.json";
import renacrypt from "./fixtures/renacrypt.json";
import listings from "./fixtures/listings.json";
import portfolios from "./fixtures/portfolios.json";
import marketPulse from "./fixtures/market-pulse.json";

const POOLS: Record<string, PoolOdds> = {
  "eden-pack": eden as PoolOdds,
  omega: omega as PoolOdds,
  renacrypt: renacrypt as PoolOdds,
};
const LISTINGS = listings as Listing[];
const PORTFOLIOS = portfolios as Record<string, { owner_addr: string; holdings: string[]; confidence: Portfolio["confidence"] }>;

export class SnapshotSource implements RenaissSource {
  readonly kind = "snapshot" as const;
  readonly name = "snapshot:fixtures";

  async listings(query: { cardId?: string; q?: string }): Promise<Listing[]> {
    let out = LISTINGS;
    if (query.cardId) out = out.filter((l) => l.card_id === query.cardId);
    if (query.q) {
      const q = query.q.toLowerCase();
      out = out.filter((l) => `${l.name} ${l.set}`.toLowerCase().includes(q));
    }
    return out;
  }
  async poolOdds(packSlug: string): Promise<PoolOdds> {
    const pool = POOLS[packSlug];
    if (!pool) throw new Error(`unknown pack: ${packSlug}`);
    return pool;
  }
  async portfolio(addr: string): Promise<Portfolio> {
    const p = PORTFOLIOS[addr];
    if (!p) throw new Error(`unknown wallet: ${addr}`);
    const holdings = LISTINGS.filter((l) => p.holdings.includes(l.card_id));
    return {
      owner_addr: p.owner_addr,
      holdings,
      total_fmv: holdings.reduce((s, l) => s + l.fmv, 0),
      confidence: p.confidence,
    };
  }
  async fmvHistory(cardId: string): Promise<FmvHistory> {
    const l = LISTINGS.find((x) => x.card_id === cardId);
    const base = l?.fmv ?? 100;
    return {
      card_id: cardId,
      points: [
        { t: "2026-06-01T00:00:00Z", price: Math.round(base * 0.9), kind: "sale", source_internal: true },
        { t: "2026-07-01T00:00:00Z", price: base, kind: "sale", source_internal: true },
      ],
    };
  }
  async marketPulse(): Promise<MarketPulse> {
    return marketPulse as MarketPulse;
  }
}

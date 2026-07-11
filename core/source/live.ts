import type { Listing, PoolOdds, Portfolio, FmvHistory, MarketPulse } from "../types";
import { ttlCache, type RenaissSource } from "./index";

export class LiveRenaissSource implements RenaissSource {
  readonly kind = "live" as const;
  readonly name = "renaiss:api";
  private fetchImpl: typeof fetch;
  private baseUrl: string;
  private apiKey?: string;
  private marketCache = ttlCache<unknown>(60_000, () => this.now());
  private poolCache = ttlCache<PoolOdds>(10_000, () => this.now());
  private now: () => number;

  constructor(opts: { baseUrl: string; apiKey?: string; fetchImpl?: typeof fetch; now?: () => number }) {
    this.baseUrl = opts.baseUrl.replace(/\/$/, "");
    this.apiKey = opts.apiKey;
    this.fetchImpl = opts.fetchImpl ?? fetch;
    this.now = opts.now ?? (() => Date.now());
  }

  private async get<T>(path: string): Promise<T> {
    const res = await this.fetchImpl(`${this.baseUrl}${path}`, {
      headers: this.apiKey ? { authorization: `Bearer ${this.apiKey}` } : {},
    });
    if (!res.ok) throw new Error(`renaiss api ${res.status}`);
    return (await res.json()) as T;
  }

  // NOTE: adjust paths + field mapping to the real Renaiss schema when available.
  async poolOdds(packSlug: string): Promise<PoolOdds> {
    const cached = this.poolCache.get(packSlug);
    if (cached) return cached;
    const data = await this.get<PoolOdds>(`/packs/${packSlug}/pool`);
    this.poolCache.set(packSlug, data);
    return data;
  }
  async listings(query: { cardId?: string; q?: string }): Promise<Listing[]> {
    const qs = query.cardId ? `card_id=${encodeURIComponent(query.cardId)}` : query.q ? `q=${encodeURIComponent(query.q)}` : "";
    return this.get<Listing[]>(`/listings?${qs}`);
  }
  async portfolio(addr: string): Promise<Portfolio> {
    return this.get<Portfolio>(`/portfolio/${addr}`);
  }
  async fmvHistory(cardId: string): Promise<FmvHistory> {
    return this.get<FmvHistory>(`/cards/${cardId}/fmv-history`);
  }
  async marketPulse(): Promise<MarketPulse> {
    const cached = this.marketCache.get("pulse") as MarketPulse | undefined;
    if (cached) return cached;
    const data = await this.get<MarketPulse>(`/market/pulse`);
    this.marketCache.set("pulse", data);
    return data;
  }
}

export function liveFromEnv(): RenaissSource | null {
  const baseUrl = process.env.RENAISS_API_URL;
  if (!baseUrl) return null;
  return new LiveRenaissSource({ baseUrl, apiKey: process.env.RENAISS_API_KEY });
}

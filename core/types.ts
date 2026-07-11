export type DataKind = "live" | "snapshot" | "mock";
export type Grader = "PSA" | "BGS";

export interface Listing {
  card_id: string;
  name: string;
  set: string;
  grade: string;
  grader: Grader;
  serial?: string;
  fmv: number;
  cmv?: number;          // RWE Oracle current market value
  ask?: number;
  last_sale?: number;
  top_offer?: number;
  owner_addr?: string;
  custody_status: "vaulted" | "redeemed" | "unknown";
  url: string;
}

export interface Tier {
  label: string;
  odds: number;          // published probability 0..1
  card_count: number;
  cards_remaining?: number;
  fmv_low: number;
  fmv_high: number;
}

export interface PoolOdds {
  pack_slug: string;
  pack_price: number;
  model: "infinite" | "limited";
  tiers: Tier[];
  total_remaining?: number;
}

export interface Portfolio {
  owner_addr: string;
  holdings: Listing[];
  total_fmv: number;
  confidence: "low" | "medium" | "high";
}

export interface FmvPoint { t: string; price: number; kind: "sale" | "offer"; source_internal: boolean; }
export interface FmvHistory { card_id: string; points: FmvPoint[]; }

export interface MarketPulse {
  window_hours: number;
  volume: number;
  floor_moves: { set: string; pct: number }[];
  notable_sales: { card_id: string; price: number }[];
}

export interface EvResult {
  pack_slug: string;
  cost: number;
  ev_per_rip: number;
  ev_cost_ratio: number;
  std_dev: number;
  tier_hit_probs: { label: string; p_at_least_one: number; rips: number }[];
  depletion_adjusted: boolean;
  assumptions: string[];
}

export interface RipOrBuyResult {
  card_id: string;
  direct_ask: number;
  gacha_net_expected_cost: number;
  expected_rips: number;
  hit_prob: number;
  verdict: "buy" | "rip" | "toss-up";
  workings: string;
}

export interface Mispricing { listing: Listing; fmv_deviation: number; reason: string; }

export interface MerkleVerification {
  pack_slug: string;
  onchain_root?: string;
  recomputed_root?: string;
  match: boolean | null;   // null = leaves not reproducible from public data
  proven: string[];
  not_proven: string[];
  explanation: string;
}

export interface DraftOrder {
  kind: "offer" | "listing";
  card_id: string;
  amount: number;
  spend_cap: number;
  requires_confirmation: true;
  expires_at: string;
}

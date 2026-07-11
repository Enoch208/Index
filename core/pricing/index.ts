import type { Listing, Mispricing } from "../types";

export function fmvDeviation(ask: number, fmv: number): number {
  return (ask - fmv) / fmv;
}

export interface MispricingOpts {
  set?: string;
  grade?: string;
  budget?: number;
  threshold?: number; // default 0.15
}

export function findMispriced(listings: Listing[], opts: MispricingOpts): Mispricing[] {
  const threshold = opts.threshold ?? 0.15;
  return listings
    .filter((l) => typeof l.ask === "number")
    .filter((l) => (opts.set ? l.set === opts.set : true))
    .filter((l) => (opts.grade ? l.grade === opts.grade : true))
    .filter((l) => (opts.budget ? (l.ask as number) <= opts.budget : true))
    .map((l) => {
      const dev = fmvDeviation(l.ask as number, l.fmv);
      return {
        listing: l,
        fmv_deviation: dev,
        reason: `ask ${l.ask} vs FMV ${l.fmv} = ${(dev * 100).toFixed(1)}%` +
          (typeof l.cmv === "number" ? ` (CMV ${l.cmv} flagged separately)` : ""),
      };
    })
    .filter((m) => m.fmv_deviation <= -threshold)
    .sort((a, b) => a.fmv_deviation - b.fmv_deviation);
}

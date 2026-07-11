import type { DataKind } from "./types";

export const DISCLAIMER =
  "Probability and pricing math, not financial advice; FMV is an estimate.";

export interface Envelope<T> {
  data: T;
  source: string;
  retrieved_at: string;
  data_kind: DataKind;
  caveats: string[];
}

export function envelope<T>(
  data: T,
  opts: { source: string; data_kind: DataKind; retrieved_at?: string; caveats?: string[] },
): Envelope<T> {
  const caveats = [...(opts.caveats ?? [])];
  if (!caveats.includes(DISCLAIMER)) caveats.push(DISCLAIMER);
  return {
    data,
    source: opts.source,
    data_kind: opts.data_kind,
    retrieved_at: opts.retrieved_at ?? new Date().toISOString(),
    caveats,
  };
}

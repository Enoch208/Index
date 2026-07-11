import { DISCLAIMER, type Envelope } from "../envelope";
import type { DraftOrder } from "../types";

export class PolicyError extends Error {}

export function enforceOutputContract<T>(e: Envelope<T>): Envelope<T> {
  const problems: string[] = [];
  if (!e.source) problems.push("missing source");
  if (!e.retrieved_at) problems.push("missing retrieved_at");
  if (!e.data_kind) problems.push("missing data_kind");
  if (!e.caveats?.includes(DISCLAIMER)) problems.push("missing disclaimer caveat");
  if (problems.length) throw new PolicyError(`output contract violated: ${problems.join("; ")}`);
  return e;
}

export function buildDraftOrder(
  req: { kind: "offer" | "listing"; card_id: string; amount: number },
  spendCap: number,
  now: () => number = () => Date.now(),
): DraftOrder {
  if (req.amount > spendCap) {
    throw new PolicyError(`draft amount ${req.amount} exceeds spend cap ${spendCap}`);
  }
  return {
    kind: req.kind,
    card_id: req.card_id,
    amount: req.amount,
    spend_cap: spendCap,
    requires_confirmation: true,
    expires_at: new Date(now() + 15 * 60_000).toISOString(),
  };
}

export function refuseUngrounded(reason: string): { refused: true; reason: string } {
  return { refused: true, reason };
}

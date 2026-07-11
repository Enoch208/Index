"use client";

import { useState } from "react";
import { callTool, type Envelope } from "@/lib/hooks/use-tool";
import { Provenance } from "@/components/dashboard/provenance";
import {
  PageHeader,
  Panel,
  Field,
  TextInput,
  Select,
  PrimaryButton,
  Skeleton,
  EmptyState,
  ErrorNote,
  formatUsd,
} from "@/components/dashboard/kit";
import { cn } from "@/lib/utils";

interface RipOrBuyResult {
  card_id: string;
  direct_ask: number;
  gacha_net_expected_cost: number;
  expected_rips: number;
  hit_prob: number;
  verdict: "buy" | "rip" | "toss-up";
  workings: string;
}

interface EvResult {
  pack_slug: string;
  cost: number;
  ev_per_rip: number;
  ev_cost_ratio: number;
  std_dev: number;
  tier_hit_probs: { label: string; p_at_least_one: number; rips: number }[];
  depletion_adjusted: boolean;
  assumptions: string[];
}

const CARD_OPTIONS = ["charizard-base-psa9-014", "eevee-heroes-psa10-001"] as const;
const PACK_OPTIONS = ["eden-pack", "omega", "renacrypt"] as const;

const VERDICT_STYLES: Record<RipOrBuyResult["verdict"], string> = {
  rip: "border-[var(--sw-mint)]/40 bg-[var(--sw-mint)]/10 text-[var(--sw-mint)]",
  buy: "border-[var(--sw-border)] bg-[var(--sw-card-inset)] text-[var(--sw-text)]",
  "toss-up": "border-amber-400/40 bg-amber-400/10 text-amber-400",
};

const VERDICT_LABELS: Record<RipOrBuyResult["verdict"], string> = {
  rip: "Rip — gacha wins",
  buy: "Buy — direct wins",
  "toss-up": "Toss-up",
};

export default function RipOrBuyPage() {
  const [cardId, setCardId] = useState<string>(CARD_OPTIONS[0]);
  const [packSlug, setPackSlug] = useState<string>(PACK_OPTIONS[0]);
  const [hitProb, setHitProb] = useState<string>("0.01");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ripOrBuyEnvelope, setRipOrBuyEnvelope] = useState<Envelope<RipOrBuyResult> | null>(null);
  const [evEnvelope, setEvEnvelope] = useState<Envelope<EvResult> | null>(null);

  async function handleCompute() {
    const parsedHitProb = Number(hitProb);
    if (!Number.isFinite(parsedHitProb) || parsedHitProb <= 0) {
      setError("Hit probability must be a positive number.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const [ripOrBuy, ev] = await Promise.all([
        callTool<RipOrBuyResult>("rip_or_buy", {
          card_id: cardId,
          pack_slug: packSlug,
          hit_prob: parsedHitProb,
        }),
        callTool<EvResult>("compute_pack_ev", { pack_slug: packSlug }),
      ]);
      setRipOrBuyEnvelope(ripOrBuy);
      setEvEnvelope(ev);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to compute rip-or-buy.");
      setRipOrBuyEnvelope(null);
      setEvEnvelope(null);
    } finally {
      setIsLoading(false);
    }
  }

  const result = ripOrBuyEnvelope?.data;
  const ev = evEnvelope?.data;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 space-y-6">
      <PageHeader
        title="Rip or buy"
        subtitle="Compare buying a card outright against its expected cost through gacha."
      />

      <Panel className="flex flex-col gap-4 p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Field label="Target card">
            <Select value={cardId} onChange={(e) => setCardId(e.target.value)}>
              {CARD_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Pack">
            <Select value={packSlug} onChange={(e) => setPackSlug(e.target.value)}>
              {PACK_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Hit probability">
            <TextInput
              type="number"
              step="0.001"
              min="0"
              max="1"
              value={hitProb}
              onChange={(e) => setHitProb(e.target.value)}
            />
          </Field>
        </div>
        <div>
          <PrimaryButton onClick={handleCompute} disabled={isLoading}>
            {isLoading ? "Computing…" : "Compute"}
          </PrimaryButton>
        </div>
      </Panel>

      {!ripOrBuyEnvelope && !isLoading && !error && (
        <EmptyState
          title="No computation yet"
          hint="Pick a card, a pack, and a hit probability, then hit Compute."
        />
      )}

      {isLoading && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-16" />
          <Skeleton className="h-32" />
          <Skeleton className="h-48" />
        </div>
      )}

      {error && !isLoading && <ErrorNote message={error} />}

      {result && ev && !isLoading && (
        <>
          <Panel className={cn("flex flex-col gap-1 border p-5", VERDICT_STYLES[result.verdict])}>
            <p className="text-[12px] font-semibold uppercase tracking-[0.06em] opacity-80">Verdict</p>
            <p className="text-[22px] font-semibold tracking-[-0.02em]">{VERDICT_LABELS[result.verdict]}</p>
          </Panel>

          <Panel className="flex flex-col gap-4 p-5">
            <h2 className="text-[15px] font-semibold text-[var(--sw-text)]">Direct vs gacha</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-[var(--sw-border)] bg-[var(--sw-bg)] p-4">
                <p className="text-[12px] text-[var(--sw-text-muted)]">Direct ask</p>
                <p className="mt-1 text-[18px] font-semibold text-[var(--sw-text)]">
                  {formatUsd(result.direct_ask)}
                </p>
              </div>
              <div className="rounded-xl border border-[var(--sw-border)] bg-[var(--sw-bg)] p-4">
                <p className="text-[12px] text-[var(--sw-text-muted)]">Net expected gacha cost</p>
                <p className="mt-1 text-[18px] font-semibold text-[var(--sw-text)]">
                  {formatUsd(result.gacha_net_expected_cost)}
                </p>
              </div>
              <div className="rounded-xl border border-[var(--sw-border)] bg-[var(--sw-bg)] p-4">
                <p className="text-[12px] text-[var(--sw-text-muted)]">Expected rips</p>
                <p className="mt-1 text-[18px] font-semibold text-[var(--sw-text)]">
                  {result.expected_rips.toFixed(1)}
                </p>
              </div>
              <div className="rounded-xl border border-[var(--sw-border)] bg-[var(--sw-bg)] p-4">
                <p className="text-[12px] text-[var(--sw-text-muted)]">Hit probability</p>
                <p className="mt-1 text-[18px] font-semibold text-[var(--sw-text)]">{result.hit_prob}</p>
              </div>
            </div>
          </Panel>

          <Panel className="flex flex-col gap-2 p-5">
            <h2 className="text-[15px] font-semibold text-[var(--sw-text)]">Show the math</h2>
            <pre className="whitespace-pre-wrap break-words rounded-xl border border-[var(--sw-border)] bg-[var(--sw-bg)] p-4 font-mono text-[12.5px] leading-relaxed text-[var(--sw-text)]">
              {result.workings}
            </pre>
          </Panel>

          <Panel className="flex flex-col gap-4 p-5">
            <h2 className="text-[15px] font-semibold text-[var(--sw-text)]">Pack EV — {ev.pack_slug}</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-[var(--sw-border)] bg-[var(--sw-bg)] p-4">
                <p className="text-[12px] text-[var(--sw-text-muted)]">EV per rip</p>
                <p className="mt-1 text-[18px] font-semibold text-[var(--sw-text)]">
                  {formatUsd(ev.ev_per_rip)}
                </p>
              </div>
              <div className="rounded-xl border border-[var(--sw-border)] bg-[var(--sw-bg)] p-4">
                <p className="text-[12px] text-[var(--sw-text-muted)]">EV / cost ratio</p>
                <p className="mt-1 text-[18px] font-semibold text-[var(--sw-text)]">
                  {ev.ev_cost_ratio.toFixed(2)}×
                </p>
              </div>
              <div className="rounded-xl border border-[var(--sw-border)] bg-[var(--sw-bg)] p-4">
                <p className="text-[12px] text-[var(--sw-text-muted)]">Std dev</p>
                <p className="mt-1 text-[18px] font-semibold text-[var(--sw-text)]">
                  {formatUsd(ev.std_dev)}
                </p>
              </div>
              <div className="rounded-xl border border-[var(--sw-border)] bg-[var(--sw-bg)] p-4">
                <p className="text-[12px] text-[var(--sw-text-muted)]">Depletion adjusted</p>
                <p className="mt-1 text-[18px] font-semibold text-[var(--sw-text)]">
                  {ev.depletion_adjusted ? "Yes" : "No"}
                </p>
              </div>
            </div>

            {ev.tier_hit_probs.length > 0 && (
              <div className="overflow-hidden rounded-xl border border-[var(--sw-border)]">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="border-b border-[var(--sw-border)] bg-[var(--sw-bg)] text-left text-[12px] text-[var(--sw-text-muted)]">
                      <th className="px-3 py-2 font-medium">Tier</th>
                      <th className="px-3 py-2 font-medium">P(at least one)</th>
                      <th className="px-3 py-2 font-medium">Rips</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ev.tier_hit_probs.map((tier) => (
                      <tr
                        key={tier.label}
                        className="border-b border-[var(--sw-border)] transition-colors last:border-b-0 hover:bg-[var(--sw-bg)]"
                      >
                        <td className="px-3 py-2 text-[var(--sw-text)]">{tier.label}</td>
                        <td className="px-3 py-2 tabular-nums text-[var(--sw-text)]">
                          {(tier.p_at_least_one * 100).toFixed(1)}%
                        </td>
                        <td className="px-3 py-2 tabular-nums text-[var(--sw-text)]">{tier.rips}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {ev.assumptions.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <p className="text-[12px] font-medium text-[var(--sw-text-muted)]">Assumptions</p>
                <ul className="list-disc space-y-1 pl-4 text-[12.5px] text-[var(--sw-text-muted)]">
                  {ev.assumptions.map((assumption, i) => (
                    <li key={i}>{assumption}</li>
                  ))}
                </ul>
              </div>
            )}
          </Panel>

          <Panel className="flex flex-col gap-2 p-5">
            <Provenance envelope={ripOrBuyEnvelope} />
            <Provenance envelope={evEnvelope} />
          </Panel>
        </>
      )}
    </div>
  );
}

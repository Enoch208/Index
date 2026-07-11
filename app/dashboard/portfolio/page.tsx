"use client";

import { useState, type FormEvent } from "react";
import { useTool } from "@/lib/hooks/use-tool";
import { Provenance } from "@/components/dashboard/provenance";
import {
  PageHeader,
  Panel,
  Field,
  TextInput,
  PrimaryButton,
  Skeleton,
  EmptyState,
  ErrorNote,
  formatUsd,
} from "@/components/dashboard/kit";
import { cn } from "@/lib/utils";

type Grader = "PSA" | "BGS";
type CustodyStatus = "vaulted" | "redeemed" | "unknown";
type Confidence = "low" | "medium" | "high";

interface Listing {
  card_id: string;
  name: string;
  set: string;
  grade: string;
  grader: Grader;
  fmv: number;
  cmv?: number;
  ask?: number;
  last_sale?: number;
  top_offer?: number;
  custody_status: CustodyStatus;
  url: string;
}

interface Portfolio {
  owner_addr: string;
  holdings: Listing[];
  total_fmv: number;
  confidence: Confidence;
}

function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  const styles: Record<Confidence, string> = {
    high: "border-[var(--sw-mint)] text-[var(--sw-mint)]",
    medium: "border-amber-400/40 text-amber-400",
    low: "border-red-500/40 text-red-400",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em]",
        styles[confidence]
      )}
    >
      {confidence} confidence
    </span>
  );
}

function CustodyBadge({ status }: { status: CustodyStatus }) {
  const styles: Record<CustodyStatus, string> = {
    vaulted: "border-[var(--sw-mint)] text-[var(--sw-mint)]",
    redeemed: "border-[var(--sw-text-dim)] text-[var(--sw-text-muted)]",
    unknown: "border-amber-400/40 text-amber-400",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em]",
        styles[status]
      )}
    >
      {status}
    </span>
  );
}

export default function PortfolioPage() {
  const [address, setAddress] = useState("0xdemo");
  const [submitted, setSubmitted] = useState("");

  const { data: envelope, isLoading, isError, error } = useTool<Portfolio>(
    "get_portfolio",
    { address: submitted },
    { enabled: !!submitted }
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(address.trim());
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 space-y-6">
      <PageHeader
        title="Portfolio"
        subtitle="Paste a public wallet address to value its vaulted holdings."
      />

      <Panel className="p-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Field label="Wallet address">
              <TextInput
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0xdemo"
              />
            </Field>
          </div>
          <PrimaryButton type="submit" disabled={!address.trim() || isLoading}>
            Value vault
          </PrimaryButton>
        </form>
      </Panel>

      {!submitted && (
        <EmptyState title="Value a wallet" hint="Try the preloaded 0xdemo address." />
      )}

      {submitted && isLoading && (
        <Panel className="flex flex-col gap-2 p-5">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </Panel>
      )}

      {submitted && !isLoading && isError && (
        <ErrorNote message={error instanceof Error ? error.message : "Failed to value wallet."} />
      )}

      {submitted && !isLoading && !isError && envelope && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[22px] font-semibold tracking-[-0.02em] text-[var(--sw-text)]">
              {formatUsd(envelope.data.total_fmv)}
            </span>
            <ConfidenceBadge confidence={envelope.data.confidence} />
          </div>

          <Panel className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-[var(--sw-border)] text-left text-[11px] uppercase tracking-[0.06em] text-[var(--sw-text-dim)]">
                  <th className="px-4 py-3 font-medium">Card</th>
                  <th className="px-4 py-3 font-medium">Grade</th>
                  <th className="px-4 py-3 font-medium">FMV</th>
                  <th className="px-4 py-3 font-medium">Custody</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {envelope.data.holdings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-[var(--sw-text-muted)]">
                      No holdings found for this wallet.
                    </td>
                  </tr>
                ) : (
                  envelope.data.holdings.map((listing) => (
                    <tr
                      key={listing.card_id}
                      className="border-b border-[var(--sw-border)] last:border-b-0"
                    >
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-[var(--sw-text)]">{listing.name}</span>
                          <span className="text-[12px] text-[var(--sw-text-muted)]">{listing.set}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[var(--sw-text)]">
                        {listing.grader} {listing.grade}
                      </td>
                      <td className="px-4 py-3 text-[var(--sw-text)]">{formatUsd(listing.fmv)}</td>
                      <td className="px-4 py-3">
                        <CustodyBadge status={listing.custody_status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <a
                          href={listing.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[var(--sw-text-muted)] transition-colors hover:text-[var(--sw-mint)]"
                        >
                          ↗
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Panel>

          <Provenance envelope={envelope} />
        </div>
      )}
    </div>
  );
}

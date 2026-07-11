"use client";

import { useState } from "react";
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

interface Listing {
  card_id: string;
  name: string;
  set: string;
  grade: string;
  grader: string;
  fmv: number;
  cmv?: number;
  ask?: number;
  last_sale?: number;
  top_offer?: number;
  custody_status: string;
  url: string;
}

interface Mispricing {
  listing: Listing;
  fmv_deviation: number;
  reason: string;
}

interface Filters {
  set?: string;
  grade?: string;
  budget?: number;
  threshold?: number;
  q?: string;
}

function buildInput(filters: Filters): Record<string, unknown> {
  const input: Record<string, unknown> = {};
  if (filters.set) input.set = filters.set;
  if (filters.grade) input.grade = filters.grade;
  if (filters.budget !== undefined) input.budget = filters.budget;
  if (filters.threshold !== undefined) input.threshold = filters.threshold;
  if (filters.q) input.q = filters.q;
  return input;
}

function DeviationBadge({ deviation }: { deviation: number }) {
  const pct = deviation * 100;
  const underpriced = deviation < 0;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[12px] font-semibold tabular-nums",
        underpriced
          ? "border-[var(--sw-mint)] text-[var(--sw-mint)]"
          : "border-red-500/40 text-red-400"
      )}
    >
      {pct >= 0 ? "+" : ""}
      {pct.toFixed(1)}%
    </span>
  );
}

function MispricingRow({ item }: { item: Mispricing }) {
  const { listing, fmv_deviation, reason } = item;
  return (
    <div className="flex flex-col gap-2 border-b border-[var(--sw-border)] px-4 py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-0.5">
        <a
          href={listing.url}
          target="_blank"
          rel="noreferrer"
          className="text-[13.5px] font-medium text-[var(--sw-text)] hover:text-[var(--sw-mint)]"
        >
          {listing.name}
        </a>
        <p className="text-[12px] text-[var(--sw-text-muted)]">
          {listing.set} · {listing.grader} {listing.grade}
        </p>
        <p className="text-[12px] text-[var(--sw-text-dim)]">{reason}</p>
      </div>

      <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[13.5px] font-semibold tabular-nums text-[var(--sw-text)]">
            {formatUsd(listing.ask ?? 0)}
          </span>
          <span className="text-[12px] text-[var(--sw-text-dim)]">
            vs {formatUsd(listing.fmv)} fmv
          </span>
        </div>
        <DeviationBadge deviation={fmv_deviation} />
      </div>
    </div>
  );
}

export default function ScannerPage() {
  const [set, setSet] = useState("");
  const [grade, setGrade] = useState("");
  const [budget, setBudget] = useState("");
  const [threshold, setThreshold] = useState("0.15");
  const [q, setQ] = useState("");
  const [submitted, setSubmitted] = useState<Filters | null>(null);

  const { data: envelope, isLoading, isError, error } = useTool<Mispricing[]>(
    "find_mispriced_listings",
    submitted ? buildInput(submitted) : {},
    { enabled: submitted !== null }
  );

  function handleScan() {
    const filters: Filters = {};
    if (set.trim()) filters.set = set.trim();
    if (grade.trim()) filters.grade = grade.trim();
    if (budget.trim()) filters.budget = Number(budget);
    if (threshold.trim()) filters.threshold = Number(threshold);
    if (q.trim()) filters.q = q.trim();
    setSubmitted(filters);
  }

  const results = envelope?.data ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 space-y-6">
      <PageHeader title="Scanner" subtitle="Find listings priced below FMV, ranked by deviation." />

      <Panel className="flex flex-col gap-4 p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Field label="Set">
            <TextInput
              placeholder="e.g. Base Set"
              value={set}
              onChange={(e) => setSet(e.target.value)}
            />
          </Field>
          <Field label="Grade">
            <TextInput
              placeholder="e.g. PSA 10"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            />
          </Field>
          <Field label="Budget">
            <TextInput
              type="number"
              placeholder="e.g. 500"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </Field>
          <Field label="Threshold">
            <TextInput
              type="number"
              step="0.01"
              placeholder="0.15"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
            />
          </Field>
          <Field label="Search">
            <TextInput
              placeholder="Optional keyword"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </Field>
        </div>

        <div>
          <PrimaryButton onClick={handleScan} disabled={isLoading}>
            Scan
          </PrimaryButton>
        </div>
      </Panel>

      {submitted === null && (
        <EmptyState
          title="Scan the market"
          hint="Leave filters empty to see everything under FMV."
        />
      )}

      {submitted !== null && isLoading && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      )}

      {submitted !== null && isError && (
        <ErrorNote message={error instanceof Error ? error.message : "Failed to scan listings"} />
      )}

      {submitted !== null && !isLoading && !isError && envelope && (
        <div className="flex flex-col gap-3">
          <Panel className="overflow-hidden">
            {results.length === 0 ? (
              <p className="px-4 py-6 text-center text-[13px] text-[var(--sw-text-muted)]">
                No underpriced listings match.
              </p>
            ) : (
              <div className="flex flex-col">
                {results.map((item) => (
                  <MispricingRow key={item.listing.card_id} item={item} />
                ))}
              </div>
            )}
          </Panel>

          <Provenance envelope={envelope} />
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useTool } from "@/lib/hooks/use-tool";
import { Provenance } from "@/components/dashboard/provenance";
import {
  PageHeader,
  Panel,
  Field,
  Select,
  PrimaryButton,
  Skeleton,
  EmptyState,
  ErrorNote,
} from "@/components/dashboard/kit";
import { cn } from "@/lib/utils";

interface MerkleVerification {
  pack_slug: string;
  onchain_root?: string;
  recomputed_root?: string;
  match: boolean | null;
  proven: string[];
  not_proven: string[];
  explanation: string;
}

const PACKS: readonly string[] = ["eden-pack", "omega", "renacrypt"];

function StatusBanner({ verification }: { verification: MerkleVerification }) {
  const { match, explanation } = verification;

  const style =
    match === true
      ? {
          wrap: "border-[var(--sw-mint)]/40 bg-[var(--sw-mint)]/10",
          dot: "bg-[var(--sw-mint)]",
          text: "text-[var(--sw-mint)]",
          label: "Verified",
        }
      : match === false
        ? {
            wrap: "border-red-500/40 bg-red-500/10",
            dot: "bg-red-400",
            text: "text-red-400",
            label: "Mismatch",
          }
        : {
            wrap: "border-amber-400/40 bg-amber-400/10",
            dot: "bg-amber-400",
            text: "text-amber-400",
            label: "Not reproducible from public data",
          };

  return (
    <div className={cn("flex flex-col gap-1.5 rounded-xl border px-4 py-3", style.wrap)}>
      <div className="flex items-center gap-2">
        <span className={cn("h-2 w-2 rounded-full", style.dot)} />
        <span className={cn("text-[13.5px] font-semibold", style.text)}>{style.label}</span>
      </div>
      <p className="text-[12.5px] text-[var(--sw-text-muted)]">{explanation}</p>
    </div>
  );
}

function RootsRow({ verification }: { verification: MerkleVerification }) {
  const { onchain_root, recomputed_root } = verification;
  if (!onchain_root && !recomputed_root) return null;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {onchain_root && (
        <div className="rounded-xl border border-[var(--sw-border)] bg-[var(--sw-bg)] p-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--sw-text-dim)]">
            On-chain root
          </p>
          <p className="mt-1 break-all font-mono text-[12px] text-[var(--sw-text)]">{onchain_root}</p>
        </div>
      )}
      {recomputed_root && (
        <div className="rounded-xl border border-[var(--sw-border)] bg-[var(--sw-bg)] p-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--sw-text-dim)]">
            Recomputed root
          </p>
          <p className="mt-1 break-all font-mono text-[12px] text-[var(--sw-text)]">{recomputed_root}</p>
        </div>
      )}
    </div>
  );
}

function ProvenLists({ verification }: { verification: MerkleVerification }) {
  const { proven, not_proven } = verification;
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="rounded-xl border border-[var(--sw-border)] bg-[var(--sw-bg)] p-4">
        <p className="text-[13px] font-semibold text-[var(--sw-text)]">Proven</p>
        {proven.length > 0 ? (
          <ul className="mt-2 flex flex-col gap-1.5">
            {proven.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-[12.5px] text-[var(--sw-text)]">
                <span className="mt-0.5 text-[var(--sw-mint)]">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-[12.5px] text-[var(--sw-text-dim)]">Nothing proven yet.</p>
        )}
      </div>

      <div className="rounded-xl border border-[var(--sw-border)] bg-[var(--sw-bg)] p-4">
        <p className="text-[13px] font-semibold text-[var(--sw-text)]">Not proven</p>
        {not_proven.length > 0 ? (
          <ul className="mt-2 flex flex-col gap-1.5">
            {not_proven.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-[12.5px] text-[var(--sw-text)]">
                <span className="mt-0.5 text-amber-400">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-[12.5px] text-[var(--sw-text-dim)]">Nothing outstanding.</p>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  const [pack, setPack] = useState<string>("");
  const [selected, setSelected] = useState<string>("");

  const { data: envelope, isLoading, isError, error } = useTool<MerkleVerification>(
    "verify_merkle_proof",
    { pack_slug: selected },
    { enabled: !!selected }
  );

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 space-y-6">
      <PageHeader
        title="Fairness"
        subtitle="Verify a gacha pool's on-chain Merkle commitment — and see exactly what it does and doesn't prove."
      />

      <Panel className="flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="w-full sm:w-64">
            <Field label="Pack">
              <Select value={pack} onChange={(e) => setPack(e.target.value)}>
                <option value="" disabled>
                  Select a pack…
                </option>
                {PACKS.map((slug) => (
                  <option key={slug} value={slug}>
                    {slug}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <PrimaryButton disabled={!pack} onClick={() => setSelected(pack)}>
            Verify
          </PrimaryButton>
        </div>

        {!selected && (
          <EmptyState
            title="No pack verified yet"
            hint="Pick a pack and hit Verify to check its on-chain Merkle commitment."
          />
        )}

        {selected && isLoading && (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-16" />
            <Skeleton className="h-14" />
            <Skeleton className="h-32" />
          </div>
        )}

        {selected && isError && (
          <ErrorNote message={error instanceof Error ? error.message : "Failed to verify pack"} />
        )}

        {selected && !isLoading && !isError && envelope && (
          <div className="flex flex-col gap-4">
            <StatusBanner verification={envelope.data} />
            <RootsRow verification={envelope.data} />
            <ProvenLists verification={envelope.data} />
            <Provenance envelope={envelope} />
          </div>
        )}
      </Panel>
    </div>
  );
}

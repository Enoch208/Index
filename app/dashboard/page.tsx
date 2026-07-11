"use client";

import Link from "next/link";
import { useTool } from "@/lib/hooks/use-tool";
import { Provenance } from "@/components/dashboard/provenance";
import {
  PageHeader,
  Panel,
  Skeleton,
  ErrorNote,
  formatUsd,
} from "@/components/dashboard/kit";
import { cn } from "@/lib/utils";

interface MarketPulse {
  window_hours: number;
  volume: number;
  floor_moves: { set: string; pct: number }[];
  notable_sales: { card_id: string; price: number }[];
}

const entryCards: readonly { title: string; description: string; href: string }[] = [
  { title: "Portfolio", description: "Value a public wallet", href: "/dashboard/portfolio" },
  { title: "Scanner", description: "Find underpriced listings", href: "/dashboard/scanner" },
  { title: "Rip-or-buy", description: "Buy vs gacha EV", href: "/dashboard/rip-or-buy" },
  { title: "Fairness", description: "Verify a pool on-chain", href: "/dashboard/verify" },
];

function MarketPulseSection() {
  const { data: envelope, isLoading, isError, error } = useTool<MarketPulse>("get_market_pulse");

  return (
    <Panel className="flex flex-col gap-4 p-5">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-[15px] font-semibold text-[var(--sw-text)]">Market pulse</h2>
        {envelope && (
          <span className="text-[12px] text-[var(--sw-text-muted)]">
            last {envelope.data.window_hours}h
          </span>
        )}
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      )}

      {isError && <ErrorNote message={error instanceof Error ? error.message : "Failed to load market pulse"} />}

      {envelope && (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-[var(--sw-border)] bg-[var(--sw-bg)] p-4">
              <p className="text-[12px] text-[var(--sw-text-muted)]">24h volume</p>
              <p className="mt-1 text-[20px] font-semibold text-[var(--sw-text)]">
                {formatUsd(envelope.data.volume)}
              </p>
            </div>

            <div className="rounded-xl border border-[var(--sw-border)] bg-[var(--sw-bg)] p-4">
              <p className="text-[12px] text-[var(--sw-text-muted)]">Floor moves</p>
              <ul className="mt-2 flex flex-col gap-1.5">
                {envelope.data.floor_moves.map((move) => (
                  <li key={move.set} className="flex items-center justify-between gap-2 text-[13px]">
                    <span className="truncate text-[var(--sw-text)]">{move.set}</span>
                    <span
                      className={cn(
                        "font-medium tabular-nums",
                        move.pct >= 0 ? "text-[var(--sw-mint)]" : "text-red-400"
                      )}
                    >
                      {move.pct >= 0 ? "+" : ""}
                      {move.pct.toFixed(1)}%
                    </span>
                  </li>
                ))}
                {envelope.data.floor_moves.length === 0 && (
                  <li className="text-[13px] text-[var(--sw-text-dim)]">No moves</li>
                )}
              </ul>
            </div>

            <div className="rounded-xl border border-[var(--sw-border)] bg-[var(--sw-bg)] p-4">
              <p className="text-[12px] text-[var(--sw-text-muted)]">Notable sales</p>
              <ul className="mt-2 flex flex-col gap-1.5">
                {envelope.data.notable_sales.map((sale) => (
                  <li key={sale.card_id} className="flex items-center justify-between gap-2 text-[13px]">
                    <span className="truncate text-[var(--sw-text)]">{sale.card_id}</span>
                    <span className="font-medium tabular-nums text-[var(--sw-text)]">
                      {formatUsd(sale.price)}
                    </span>
                  </li>
                ))}
                {envelope.data.notable_sales.length === 0 && (
                  <li className="text-[13px] text-[var(--sw-text-dim)]">No notable sales</li>
                )}
              </ul>
            </div>
          </div>

          <Provenance envelope={envelope} />
        </>
      )}
    </Panel>
  );
}

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 space-y-6">
      <PageHeader
        title="Overview"
        subtitle="The agent layer for collectibles — value a vault, catch mispriced cards, verify pool fairness."
      />

      <MarketPulseSection />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {entryCards.map((card) => (
          <Link key={card.href} href={card.href}>
            <Panel className="flex h-full flex-col gap-1 p-4 transition-colors hover:border-[var(--sw-mint)]">
              <p className="text-[14px] font-semibold text-[var(--sw-text)]">{card.title}</p>
              <p className="text-[12.5px] text-[var(--sw-text-muted)]">{card.description}</p>
            </Panel>
          </Link>
        ))}
      </div>
    </div>
  );
}

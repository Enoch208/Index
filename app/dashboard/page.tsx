"use client";

import Link from "next/link";
import { PageHeader, Panel } from "@/components/dashboard/kit";

const links: readonly { label: string; href: string }[] = [
  { label: "Portfolio", href: "/dashboard/portfolio" },
  { label: "Scanner", href: "/dashboard/scanner" },
  { label: "Rip-or-buy", href: "/dashboard/rip-or-buy" },
  { label: "Fairness", href: "/dashboard/verify" },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 pb-10">
      <PageHeader title="Overview" />
      <div className="px-4 sm:px-6">
        <Panel className="flex flex-col gap-4 p-5">
          <p className="text-[13px] text-[var(--sw-text-muted)]">Collector tools</p>
          <div className="flex flex-wrap gap-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg border border-[var(--sw-border)] px-3 py-1.5 text-[13px] font-medium text-[var(--sw-text)] transition-colors hover:border-[var(--sw-mint)] hover:text-[var(--sw-mint)]"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

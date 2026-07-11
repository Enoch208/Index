import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { StreamMeter } from "@/components/services/stream-meter";
import { cn } from "@/lib/utils";

function ServiceIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round" />
      <path d="M22 2l-4 4M22 2h-5M22 2v5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Tile({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "group flex flex-col rounded-[22px] border border-border bg-surface p-6 transition duration-300",
        "hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_18px_40px_rgba(4,40,80,0.08)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function TileCopy({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mt-5">
      <h3 className="text-[16px] font-semibold text-text-primary">{title}</h3>
      <p className="mt-1.5 text-[13px] leading-[1.6] text-text-secondary">{desc}</p>
    </div>
  );
}

// Underpriced listings the scanner surfaces — ask vs. fair-market value.
const mispriced = [
  { card: "Charizard · Base Set", grade: "10", dev: "−18%" },
  { card: "Umbreon VMAX Alt", grade: "9", dev: "−12%" },
  { card: "Eevee Heroes", grade: "9.5", dev: "−9%" },
  { card: "Lugia · 1st Edition", grade: "8", dev: "−7%" },
];

function TrendDown() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
      <path d="M4 8l5 5 4-4 7 7M16 16h4v-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ServicesSection() {
  return (
    <Section className="bg-white">
      <SectionHeading
        eyebrow="The Curator"
        eyebrowIcon={<ServiceIcon />}
        title={
          <>
            One agent, grounded <span className="text-text-muted">only in verified data</span>
          </>
        }
        description="Paste a public wallet and The Curator values it, scans for mispriced listings, runs rip-or-buy EV, and verifies pool fairness on-chain — every number cites its source."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* A — portfolio valuation (wide) */}
        <Reveal className="md:col-span-2">
          <Tile className="h-full rounded-[28px] bg-surface p-7">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium text-brand">
              Live estimate
            </span>
            <div className="mt-5">
              <StreamMeter />
            </div>
            <TileCopy
              title="Portfolio Valuation"
              desc="Paste a public wallet and every card is valued with a confidence range — and a source and timestamp on every number."
            />
          </Tile>
        </Reveal>

        {/* B — mispricing scanner */}
        <Reveal delay={0.06}>
          <Tile className="h-full justify-between">
            <div className="flex flex-col gap-2">
              {mispriced.map((m) => (
                <div
                  key={m.card}
                  className="flex items-center justify-between rounded-xl border border-border bg-white px-3 py-2.5"
                >
                  <span className="flex items-center gap-2 text-[13px] font-medium text-text-primary">
                    <span className="grid size-5 place-items-center rounded-md bg-brand/10 text-[10px] font-semibold text-brand">
                      {m.grade}
                    </span>
                    {m.card}
                  </span>
                  <span className="flex items-center gap-1 text-[13px] font-semibold text-brand">
                    <TrendDown />
                    {m.dev}
                  </span>
                </div>
              ))}
            </div>
            <TileCopy
              title="Mispricing Scanner"
              desc="Ranked listings where the ask sits below fair-market value — with the deviation math behind every pick."
            />
          </Tile>
        </Reveal>

        {/* C — rip-or-buy EV */}
        <Reveal delay={0.12}>
          <Tile className="h-full justify-between">
            <div className="rounded-2xl border border-border bg-white p-4">
              <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">Rip-or-buy · Eden Pack</p>
              <div className="mt-2 flex items-end justify-between">
                <div>
                  <p className="text-[22px] font-semibold tabular-nums text-text-primary">$180</p>
                  <p className="text-[11px] text-text-muted">buy direct</p>
                </div>
                <span className="pb-1 text-[13px] text-text-muted">vs</span>
                <div className="text-right">
                  <p className="text-[22px] font-semibold tabular-nums text-text-primary">$206</p>
                  <p className="text-[11px] text-text-muted">rip EV</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-center gap-1.5 rounded-full bg-[rgba(196,245,107,0.2)] py-2 text-[12px] font-semibold text-[#3f7a17]">
                <Check />
                Buy is +EV
              </div>
            </div>
            <TileCopy
              title="Rip-or-Buy EV"
              desc="Compare buying a card outright against its expected cost via gacha — depletion-adjusted math, not just a verdict."
            />
          </Tile>
        </Reveal>

        {/* D — fairness check (wide) */}
        <Reveal delay={0.06} className="md:col-span-2">
          <Tile className="h-full justify-between">
            <div className="rounded-2xl border border-border bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-text-primary">Eden Pack · pool integrity</span>
                <span className="flex items-center gap-1 rounded-full bg-[rgba(196,245,107,0.2)] px-2 py-0.5 text-[11px] font-semibold text-[#3f7a17]">
                  <Check />
                  Verified
                </span>
              </div>
              <div className="mt-3 space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">on-chain root</span>
                  <span className="text-text-secondary">0x9f2a…c41d</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">recomputed</span>
                  <span className="text-text-secondary">0x9f2a…c41d</span>
                </div>
              </div>
              <p className="mt-3 text-[11px] leading-[1.5] text-text-secondary">
                2,000 cards committed before sales began. Proves the pool — not the FMV estimates.
              </p>
            </div>
            <TileCopy
              title="Fairness Check"
              desc="Recompute a pack's Merkle root and match it against the on-chain root — a plain-language proof of what was, and wasn't, committed."
            />
          </Tile>
        </Reveal>
      </div>
    </Section>
  );
}

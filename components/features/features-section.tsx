import { FeatureCard } from "@/components/features/feature-card";
import { MarketScanMap } from "@/components/features/market-scan-map";
import { SourceRouting } from "@/components/features/source-routing";
import { EvMeter } from "@/components/features/ev-meter";
import { FairnessCheck } from "@/components/features/fairness-check";
import { PolicyGuard } from "@/components/features/policy-guard";
import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";

const rowOne = [
  {
    id: "valuation",
    tag: "Valuation",
    lead: "Value any vault",
    rest: "Paste a public wallet — every card priced with a confidence range and a cited source.",
    imageAlt: "A vault valued from verified Renaiss and on-chain data",
  },
  {
    id: "scanner",
    tag: "Scanner",
    lead: "Catch mispriced cards",
    rest: "Ranked listings where the ask drifts below fair-market value, with the deviation math.",
    imageAlt: "Mispriced listings surfaced across the Renaiss marketplace",
  },
];

const rowTwo = [
  {
    id: "ev",
    tag: "EV",
    lead: "Rip-or-buy, with the math",
    rest: "Buying direct vs. expected gacha cost — depletion-adjusted, never a bare verdict.",
    imageAlt: "Rip-or-buy expected-value math for a pack",
  },
  {
    id: "fairness",
    tag: "Fairness",
    lead: "Verify pool fairness",
    rest: "Recompute a pack's Merkle root and match it against the on-chain root.",
    imageAlt: "On-chain Merkle root matching a recomputed pool root",
  },
  {
    id: "safety",
    tag: "Safety",
    lead: "Safe by architecture",
    rest: "Read-only by default, human-in-the-loop, and every claim carries its source.",
    imageAlt: "Read-only, paper-trading, human-approval policy engine",
  },
];

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
      <path d="M13 2 L4 14 h6 l-1 8 9-12 h-6 z" />
    </svg>
  );
}

export function FeaturesSection() {
  return (
    <Section id="features" className="bg-[#f9fafb]">
      <SectionHeading
        align="center"
        eyebrow="Core Features"
        eyebrowIcon={<BoltIcon />}
        title="Grounded, safe, and yours"
        description="Everything the Curator does is built only from verified data — with safety wired into the architecture, not bolted on."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {rowOne.map((card, index) => (
          <Reveal key={card.id} delay={index * 0.08}>
            <FeatureCard
              {...card}
              aspect="aspect-[3/2]"
              align="left"
              large
              media={
                card.id === "scanner" ? (
                  <MarketScanMap />
                ) : card.id === "valuation" ? (
                  <SourceRouting />
                ) : undefined
              }
            />
          </Reveal>
        ))}
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rowTwo.map((card, index) => (
          <Reveal key={card.id} delay={index * 0.08}>
            <FeatureCard
              {...card}
              aspect="aspect-[16/15]"
              align="center"
              media={
                card.id === "ev" ? (
                  <EvMeter />
                ) : card.id === "fairness" ? (
                  <FairnessCheck />
                ) : card.id === "safety" ? (
                  <PolicyGuard />
                ) : undefined
              }
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

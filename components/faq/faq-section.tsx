import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How does portfolio valuation work?",
    a: "Paste a public wallet and the Curator pulls your vaulted holdings, values each card against Renaiss fair-market value with a confidence range, and cites the source and timestamp on every number.",
  },
  {
    q: "Is this financial advice?",
    a: "No. Index shows probability and pricing math with stated assumptions — every answer carries the line “FMV is an estimate; not financial advice.” It never predicts prices.",
  },
  {
    q: "Where does the data come from?",
    a: "Public, clearly-labeled sources only: renaiss.xyz listings and pack-odds panels, and BNB Chain (BscScan) for Merkle roots and provenance. Any external comps are labeled as estimates.",
  },
  {
    q: "Do you hold my keys or funds?",
    a: "Never. Index is read-only and works from public wallet addresses only — no private keys, no custody, and no auth flows.",
  },
  {
    q: "How does the fairness check work?",
    a: "It fetches a pack's on-chain Merkle root and recomputes it from the published pool. A match proves the pool was committed before sales began — it does not prove the FMV estimates are accurate, and the result says so.",
  },
  {
    q: "What is the MCP server?",
    a: "An open Model Context Protocol server that exposes Renaiss data as typed tools, so any agent — Claude Desktop or your own — can query listings, odds, EV, and custody. It installs with a single command.",
  },
  {
    q: "Can the agent buy or trade for me?",
    a: "No auto-execution. Any action renders as a draft that needs your explicit confirmation, with a spend cap. Paper-trading is the default.",
  },
];

function QuestionIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 0 1 5 .5c0 1.5-2.5 2.5-2.5 3.5" strokeLinecap="round" />
      <circle cx="12" cy="17.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function FaqSection() {
  return (
    <Section id="faq" className="bg-white">
      <SectionHeading
        align="center"
        eyebrow="FAQ"
        eyebrowIcon={<QuestionIcon />}
        title="Frequently Asked Questions"
        description="Everything you need to know about how Index values, verifies, and stays safe."
      />

      <div className="grid items-start gap-8 lg:grid-cols-[320px_1fr]">
        {/* left */}
        <Reveal>
          <div className="flex flex-col gap-4">
            <div className="grid h-[300px] w-full place-items-center overflow-hidden">
              <div className="relative flex h-full w-full items-center justify-center">
                <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(196,245,107,0.22),transparent_70%)] blur-2xl" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/faq_brand_art.png" alt="A graded collectible card slab, verified" className="relative h-full w-full rounded-[20px] object-contain" />
              </div>
            </div>
            <div className="rounded-[16px] border border-border bg-surface p-5">
              <h3 className="text-[15px] font-semibold text-text-primary">Do you have more questions?</h3>
              <p className="mt-1.5 text-[12px] leading-[1.7] text-text-secondary">
                Our team will answer all your questions. We ensure a quick response.
              </p>
              <Button
                asChild
                size="sm"
                className="mt-4 gap-1.5 rounded-full bg-brand-dark text-white hover:bg-brand-dark/90"
              >
                <a href="mailto:hello@index.app">
                  Contact Us
                  <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                    <path d="M7 17L17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </Button>
            </div>
          </div>
        </Reveal>

        {/* right: accordion */}
        <Reveal delay={0.08}>
          <Accordion type="single" collapsible defaultValue="faq-0" className="space-y-2.5">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.q}
                value={`faq-${index}`}
                className="rounded-[14px] border border-border bg-surface px-6 last:border-b"
              >
                <AccordionTrigger className="gap-4 py-4 text-[16px] font-medium text-text-primary hover:no-underline">
                  <span className="flex items-center gap-5">
                    <span className="shrink-0 text-[14px] font-medium text-text-muted">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {faq.q}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pl-[42px] text-[13px] leading-[1.7] text-text-secondary">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </Section>
  );
}

import { Reveal } from "@/components/motion/reveal";
import { InfiniteMovingCards, type MarqueeItem } from "@/components/ui/aceternity/infinite-moving-cards";

// Clean text wordmarks for the data/tech stack — no third-party logo files, so
// nothing can 404 and the strip reads as one consistent lockup.
function TextMark({ label }: { label: string }) {
  return (
    <span className="whitespace-nowrap text-[17px] font-semibold tracking-tight text-[#344054]">
      {label}
    </span>
  );
}

const ecosystem: MarqueeItem[] = [
  { name: "Renaiss", node: <TextMark label="Renaiss" /> },
  { name: "BNB Chain", node: <TextMark label="BNB Chain" /> },
  { name: "BscScan", node: <TextMark label="BscScan" /> },
  { name: "Claude (MCP)", node: <TextMark label="Claude · MCP" /> },
  { name: "PSA", node: <TextMark label="PSA" /> },
  { name: "BGS", node: <TextMark label="BGS" /> },
  { name: "USDC", node: <TextMark label="USDC" /> },
];

export function IntegrationsSection() {
  return (
    <section id="integrations" className="bg-white py-12">
      <Reveal className="mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-24">
        <p className="mb-8 text-center text-[13px] font-medium text-text-muted">
          Grounded in verifiable, on-chain data
        </p>
        <InfiniteMovingCards items={ecosystem} speed="slow" />
      </Reveal>
    </section>
  );
}

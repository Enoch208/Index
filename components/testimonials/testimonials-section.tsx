import { Wallet, Code2, ShieldCheck, Boxes, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" strokeLinecap="round" />
      <path d="M16 5.5a3 3 0 0 1 0 5.6M17.5 19a5.5 5.5 0 0 0-2.4-4.5" strokeLinecap="round" />
    </svg>
  );
}

type Persona = { icon: LucideIcon; role: string; need: string; answer: string };

const personas: Persona[] = [
  {
    icon: Wallet,
    role: "Collector / Trader",
    need: "“What's my vault worth? What's underpriced? Should I rip or buy?”",
    answer: "Portfolio valuation, a mispricing scanner, and rip-or-buy EV — every number sourced.",
  },
  {
    icon: Code2,
    role: "Agent developer",
    need: "“I need standard, programmatic access to collectibles data.”",
    answer: "An open MCP server with 6+ typed tools — installs in Claude or any MCP client.",
  },
  {
    icon: ShieldCheck,
    role: "Skeptical newcomer",
    need: "“Is this gacha actually fair?”",
    answer: "One-click on-chain fairness check that states plainly what is — and isn't — proven.",
  },
  {
    icon: Boxes,
    role: "Renaiss ecosystem",
    need: "“Show tooling that proves fairness and drives marketplace traffic.”",
    answer: "Open infrastructure that links every finding back to renaiss.xyz.",
  },
];

export function TestimonialsSection() {
  return (
    <Section className="bg-white">
      <SectionHeading
        eyebrow="Who it's for"
        eyebrowIcon={<UsersIcon />}
        title={
          <>
            Built for the
            <br />
            whole collector market
          </>
        }
        description="From collectors to agent developers to the skeptics — every answer is grounded, sourced, and safe by default."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {personas.map((p, i) => (
          <Reveal key={p.role} delay={i * 0.06}>
            <div className="flex h-full flex-col rounded-[20px] border border-[#eef0f3] bg-white p-6">
              <span className="grid size-10 place-items-center rounded-xl bg-[rgba(196,245,107,0.18)] text-[#3f7a17]">
                <p.icon className="size-5" strokeWidth={1.9} />
              </span>
              <p className="mt-4 text-[13px] font-semibold text-brand">{p.role}</p>
              <p className="mt-2 text-[14px] leading-[1.55] text-[#1a2535]">{p.need}</p>
              <div className="mt-5 border-t border-[#f0f2f5] pt-4">
                <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">The Curator</p>
                <p className="mt-1.5 text-[12.5px] leading-[1.55] text-text-secondary">{p.answer}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

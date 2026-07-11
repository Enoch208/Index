"use client";

/* eslint-disable react-hooks/refs -- AnimatedBeam and the forwarded Node consume
   RefObjects created via createRef(); the beam reads `.current` inside an effect
   (to measure DOM positions), never during render. This is the canonical
   AnimatedBeam wiring pattern. */

import { createRef, forwardRef, useRef } from "react";
import { Boxes, Search, BadgeCheck, Bot, Wallet } from "lucide-react";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { cn } from "@/lib/utils";

const LIME = "#c4f56b";
const VIOLET = "#bcaef7";

// Public, clearly-labeled sources every answer is grounded in.
const SOURCES = [
  { name: "Renaiss", Icon: Boxes, color: LIME },
  { name: "BscScan", Icon: Search, color: VIOLET },
  { name: "PSA · BGS", Icon: BadgeCheck, color: LIME },
  { name: "Claude · MCP", Icon: Bot, color: VIOLET },
];

const Node = forwardRef<
  HTMLDivElement,
  { className?: string; children: React.ReactNode; size?: "md" | "lg" }
>(({ className, children, size = "md" }, ref) => (
  <div
    ref={ref}
    className={cn(
      "z-10 flex items-center justify-center rounded-full border border-white/10 bg-white/[0.06] backdrop-blur-md",
      "shadow-[0_4px_20px_rgba(0,0,0,0.35)]",
      size === "lg" ? "size-16" : "size-11",
      className,
    )}
  >
    {children}
  </div>
));
Node.displayName = "Node";

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {children}
      <span className="text-[11px] font-medium text-white/55">{label}</span>
    </div>
  );
}

export function SourceRouting() {
  const containerRef = useRef<HTMLDivElement>(null);
  const vaultRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef<HTMLDivElement>(null);
  const sourceRefs = useRef(SOURCES.map(() => createRef<HTMLDivElement>()));

  const mid = (SOURCES.length - 1) / 2;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex items-stretch justify-between overflow-hidden bg-[#131316] px-6 md:px-12"
    >
      {/* left — your public wallet */}
      <div className="z-10 flex flex-col justify-center">
        <Labeled label="Your vault">
          <Node ref={vaultRef}>
            <Wallet className="size-5 text-white/80" strokeWidth={1.9} />
          </Node>
        </Labeled>
      </div>

      {/* center — the index agent */}
      <div className="z-10 flex flex-col justify-center">
        <Labeled label="index">
          <Node ref={indexRef} size="lg" className="border-transparent bg-[#c4f56b]">
            <span className="flex items-end gap-[2px] text-[#0a0c10]">
              <span className="text-[19px] font-bold lowercase leading-none tracking-[-0.04em]">i</span>
              <span className="mb-[3px] inline-block size-[6px] rounded-[1.5px] bg-[#0a0c10]" />
            </span>
          </Node>
        </Labeled>
      </div>

      {/* right — verified data sources */}
      <div className="z-10 flex flex-col justify-center gap-3">
        {SOURCES.map((s, i) => (
          <Labeled key={s.name} label={s.name}>
            <Node ref={sourceRefs.current[i]} className="size-10">
              <s.Icon className="size-[18px]" style={{ color: s.color }} strokeWidth={1.9} />
            </Node>
          </Labeled>
        ))}
      </div>

      {/* wallet → index */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={vaultRef}
        toRef={indexRef}
        duration={4}
        pathColor="#ffffff"
        pathOpacity={0.08}
        gradientStartColor={LIME}
        gradientStopColor={VIOLET}
      />

      {/* index → each verified source */}
      {SOURCES.map((_, i) => (
        <AnimatedBeam
          key={i}
          containerRef={containerRef}
          fromRef={indexRef}
          toRef={sourceRefs.current[i]}
          curvature={(mid - i) * 14}
          duration={4}
          delay={0.3 + i * 0.2}
          pathColor="#ffffff"
          pathOpacity={0.08}
          gradientStartColor={LIME}
          gradientStopColor={VIOLET}
        />
      ))}
    </div>
  );
}

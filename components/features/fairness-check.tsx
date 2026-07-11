// On-chain Merkle verification readout for the fairness feature card.
function Check({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" className={className} aria-hidden>
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const rows = [
  { label: "on-chain root", hash: "0x9f2a…c41d" },
  { label: "recomputed", hash: "0x9f2a…c41d" },
];

export function FairnessCheck() {
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-3 bg-[#131316] px-5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-white/50">Merkle verification</span>
        <span className="flex items-center gap-1 rounded-full bg-[rgba(196,245,107,0.16)] px-2 py-0.5 text-[11px] font-semibold text-[#c4f56b]">
          <Check />
          Verified
        </span>
      </div>

      <div className="space-y-1.5 font-mono text-[11px]">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2"
          >
            <span className="text-white/45">{r.label}</span>
            <span className="flex items-center gap-1.5 text-white/80">
              {r.hash}
              <Check className="text-[#c4f56b]" />
            </span>
          </div>
        ))}
      </div>

      <p className="text-[11px] leading-[1.5] text-white/45">
        2,000 cards committed before sales — proves the pool, not the prices.
      </p>
    </div>
  );
}

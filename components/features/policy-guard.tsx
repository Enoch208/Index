// Safety-as-architecture readout for the safety feature card.
function Shield() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#c4f56b" strokeWidth="1.7" aria-hidden>
      <path d="M12 3 l7 3 v5 c0 4-3 6.8-7 8 -4-1.2-7-4-7-8 V6 z" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const policies = ["Read-only default", "Paper trading", "Human approval", "Spend cap", "Source + timestamp", "Refuses to guess"];

export function PolicyGuard() {
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-3.5 bg-[#131316] px-5">
      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-white/50">
        <Shield />
        Policy engine
      </div>

      <div className="flex flex-wrap gap-1.5">
        {policies.map((p) => (
          <span
            key={p}
            className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] font-medium text-white/70"
          >
            {p}
          </span>
        ))}
      </div>

      <p className="text-[11px] leading-[1.5] text-white/45">
        Safety is enforced in the architecture — not left to the model&apos;s mood.
      </p>
    </div>
  );
}

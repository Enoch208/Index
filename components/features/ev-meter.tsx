// Gacha odds → expected-value readout for the rip-or-buy feature card.
const tiers = [
  { label: "Chase", pct: 2, color: "#c4f56b" },
  { label: "Rare", pct: 12, color: "#bcaef7" },
  { label: "Common", pct: 86, color: "rgba(255,255,255,0.14)" },
];

export function EvMeter() {
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-4 bg-[#131316] px-5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-white/50">Eden Pack · odds</span>
        <span className="rounded-full bg-[rgba(196,245,107,0.16)] px-2 py-0.5 text-[11px] font-semibold text-[#c4f56b]">
          EV/cost 0.94×
        </span>
      </div>

      {/* stacked odds bar */}
      <div className="flex h-2.5 overflow-hidden rounded-full">
        {tiers.map((t) => (
          <div key={t.label} style={{ width: `${t.pct}%`, background: t.color }} />
        ))}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {tiers.map((t) => (
          <span key={t.label} className="flex items-center gap-1.5 text-[11px] text-white/60">
            <span className="size-2 rounded-full" style={{ background: t.color }} />
            {t.label}
            <span className="font-semibold text-white">{t.pct}%</span>
          </span>
        ))}
      </div>

      <p className="text-[11px] leading-[1.5] text-white/45">
        Buy direct $180 · rip EV $206 — depletion-adjusted.
      </p>
    </div>
  );
}

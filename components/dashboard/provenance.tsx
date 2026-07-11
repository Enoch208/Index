import { cn } from "@/lib/utils";
import type { DataKind, Envelope } from "@/lib/hooks/use-tool";

function KindBadge({ kind }: { kind: DataKind }) {
  const isLive = kind === "live";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em]",
        isLive
          ? "border-[var(--sw-mint)] text-[var(--sw-mint)]"
          : "border-amber-400/40 text-amber-400"
      )}
    >
      {kind}
    </span>
  );
}

export function Provenance({
  envelope,
  className,
}: {
  envelope: Envelope<unknown>;
  className?: string;
}) {
  const retrievedAt = (() => {
    try {
      return new Date(envelope.retrieved_at).toLocaleString();
    } catch {
      return envelope.retrieved_at;
    }
  })();

  return (
    <div className={cn("flex flex-col gap-1.5 text-[12px] text-[var(--sw-text-muted)]", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <KindBadge kind={envelope.data_kind} />
        <span>
          source: <span className="text-[var(--sw-text)]">{envelope.source}</span>
        </span>
        <span className="text-[var(--sw-text-dim)]">·</span>
        <span>{retrievedAt}</span>
      </div>
      {envelope.caveats.length > 0 && (
        <ul className="list-disc space-y-0.5 pl-4 text-[var(--sw-text-dim)]">
          {envelope.caveats.map((caveat, i) => (
            <li key={i}>{caveat}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="flex h-[60px] shrink-0 items-center justify-between gap-4 border-b border-[var(--sw-border)] px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          aria-label="Toggle sidebar"
          onClick={onMenuClick}
          type="button"
          className="flex size-9 items-center justify-center rounded-lg border border-[var(--sw-border)] text-[var(--sw-text-muted)] hover:text-[var(--sw-text)] lg:hidden"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
        <p className="hidden text-[13px] text-[var(--sw-text-muted)] sm:block">
          Read-only · public data · not financial advice
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 rounded-full border border-[var(--sw-border)] bg-[var(--sw-card-inset)] px-3 py-1.5 text-[12px] font-medium text-[var(--sw-text-muted)]">
          <span aria-hidden className="size-1.5 rounded-full bg-[var(--sw-mint)]" />
          Renaiss · BNB Chain
        </span>
      </div>
    </header>
  );
}

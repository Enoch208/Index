import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col gap-1 px-4 pt-6 sm:px-6">
      <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-[var(--sw-text)]">{title}</h1>
      {subtitle && <p className="text-[13px] text-[var(--sw-text-muted)]">{subtitle}</p>}
    </div>
  );
}

export function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--sw-border)] bg-[var(--sw-card-inset)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12px] font-medium text-[var(--sw-text-muted)]">{label}</span>
      {children}
    </label>
  );
}

export function TextInput({ className, disabled, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      disabled={disabled}
      className={cn(
        "h-9 rounded-lg border border-[var(--sw-border)] bg-[var(--sw-bg)] px-3 text-[13px] text-[var(--sw-text)]",
        "placeholder:text-[var(--sw-text-dim)] outline-none transition-colors",
        "hover:border-[var(--sw-border-strong)]",
        "focus:border-[var(--sw-mint)]/60 focus:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[var(--sw-border)]",
        className
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  disabled,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      disabled={disabled}
      className={cn(
        "h-9 cursor-pointer rounded-lg border border-[var(--sw-border)] bg-[var(--sw-bg)] px-3 text-[13px] text-[var(--sw-text)]",
        "outline-none transition-colors",
        "hover:border-[var(--sw-border-strong)]",
        "focus:border-[var(--sw-mint)]/60 focus:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[var(--sw-border)]",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function PrimaryButton({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[var(--sw-mint)] px-3.5 text-[13px] font-semibold text-black",
        "transition-all duration-150 hover:brightness-110 active:scale-[0.97] active:brightness-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sw-mint)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--sw-bg)]",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:brightness-100 disabled:active:scale-100",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-[var(--sw-border)]", className)} />;
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-[var(--sw-border)] px-6 py-10 text-center">
      <p className="text-[13.5px] font-medium text-[var(--sw-text)]">{title}</p>
      {hint && <p className="text-[12.5px] text-[var(--sw-text-muted)]">{hint}</p>}
    </div>
  );
}

export function ErrorNote({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-[12.5px] text-red-400">
      {message}
    </div>
  );
}

export function formatUsd(n: number): string {
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

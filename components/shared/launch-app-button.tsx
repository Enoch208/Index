import Link from "next/link";
import type { ReactNode } from "react";

export function LaunchAppButton({ children, className }: { children: ReactNode; className?: string }) {
  return <Link href="/dashboard" className={className}>{children}</Link>;
}

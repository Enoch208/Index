"use client";
import { useQuery } from "@tanstack/react-query";

export type DataKind = "live" | "snapshot" | "mock";
export interface Envelope<T = unknown> {
  data: T;
  source: string;
  retrieved_at: string;
  data_kind: DataKind;
  caveats: string[];
}

export async function callTool<T = unknown>(tool: string, input: Record<string, unknown> = {}): Promise<Envelope<T>> {
  const res = await fetch("/api/tools", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ tool, input }),
  });
  const json = await res.json();
  if (!res.ok || !json.ok) throw new Error(json?.error ?? `tool ${tool} failed`);
  return json.envelope as Envelope<T>;
}

export function useTool<T = unknown>(tool: string, input: Record<string, unknown> = {}, opts?: { enabled?: boolean }) {
  return useQuery({ queryKey: [tool, input], queryFn: () => callTool<T>(tool, input), enabled: opts?.enabled ?? true });
}

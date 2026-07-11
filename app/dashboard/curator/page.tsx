"use client";

import { useRef, useState } from "react";
import { PageHeader, Panel, PrimaryButton } from "@/components/dashboard/kit";
import { Provenance } from "@/components/dashboard/provenance";
import type { Envelope } from "@/lib/hooks/use-tool";
import { cn } from "@/lib/utils";

type Role = "user" | "assistant";
interface ToolCall {
  name: string;
  envelope: Envelope;
}
interface Msg {
  role: Role;
  content: string;
  toolCalls?: ToolCall[];
}

const SUGGESTIONS = [
  "What's the Eden pack EV right now?",
  "Value the wallet 0xdemo",
  "Is Eevee Heroes PSA 10 underpriced?",
  "Verify the Eden pack pool on-chain",
];

export default function CuratorPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsKey, setNeedsKey] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    setError(null);
    setNeedsKey(false);
    const history: Msg[] = [...messages, { role: "user", content }];
    setMessages(history);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/curator", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: history.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        if (res.status === 503) setNeedsKey(true);
        setError(json?.error ?? `Curator request failed (${res.status})`);
        return;
      }
      setMessages([
        ...history,
        { role: "assistant", content: json.reply ?? "", toolCalls: json.toolCalls ?? [] },
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
      requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: "smooth" }));
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-60px)] max-w-4xl flex-col px-4 py-6 sm:px-6">
      <PageHeader
        title="The Curator"
        subtitle="A grounded collector agent. Every answer is built from live tool calls — value a vault, catch mispriced cards, run rip-or-buy EV, verify a pool. It refuses anything it can't ground."
      />

      {/* Transcript */}
      <div className="mt-4 min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
        {messages.length === 0 && (
          <div className="space-y-4">
            <p className="text-[13px] text-[var(--sw-text-muted)]">Try one of these:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="cursor-pointer rounded-full border border-[var(--sw-border)] bg-[var(--sw-card-inset)] px-3 py-1.5 text-[12.5px] text-[var(--sw-text-muted)] transition-colors hover:border-[var(--sw-border-strong)] hover:text-[var(--sw-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sw-mint)]/40"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed",
                m.role === "user"
                  ? "bg-[var(--sw-mint)] text-black"
                  : "border border-[var(--sw-border)] bg-[var(--sw-card-inset)] text-[var(--sw-text)]"
              )}
            >
              <p className="whitespace-pre-wrap">{m.content}</p>

              {m.toolCalls && m.toolCalls.length > 0 && (
                <details className="mt-3 border-t border-[var(--sw-border)] pt-2.5">
                  <summary className="cursor-pointer text-[11.5px] font-medium text-[var(--sw-text-muted)] transition-colors hover:text-[var(--sw-text)]">
                    Grounded in {m.toolCalls.length} tool call{m.toolCalls.length > 1 ? "s" : ""}
                  </summary>
                  <div className="mt-2 space-y-2.5">
                    {m.toolCalls.map((tc, j) => (
                      <div key={j} className="rounded-lg border border-[var(--sw-border)] bg-[var(--sw-bg)] p-2.5">
                        <span className="mb-1.5 inline-block rounded bg-[var(--sw-card-inset)] px-1.5 py-0.5 font-mono text-[11px] text-[var(--sw-mint)]">
                          {tc.name}
                        </span>
                        <Provenance envelope={tc.envelope} />
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl border border-[var(--sw-border)] bg-[var(--sw-card-inset)] px-4 py-2.5 text-[13px] text-[var(--sw-text-muted)]">
              The Curator is working…
            </div>
          </div>
        )}

        {needsKey && (
          <Panel className="border-amber-400/30 bg-amber-400/5 p-3 text-[13px] text-amber-200">
            The Curator needs <code className="font-mono">ANTHROPIC_API_KEY</code> set on the server. Add it to{" "}
            <code className="font-mono">.env.local</code> and restart, then it will answer using the tools. (The rest of the
            dashboard works without it.)
          </Panel>
        )}
        {error && !needsKey && (
          <Panel className="border-red-400/30 bg-red-400/5 p-3 text-[13px] text-red-300">{error}</Panel>
        )}

        <div ref={endRef} />
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mt-4 flex items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the Curator…"
          className="h-11 flex-1 rounded-xl border border-[var(--sw-border)] bg-[var(--sw-card-inset)] px-4 text-[14px] text-[var(--sw-text)] outline-none placeholder:text-[var(--sw-text-dim)] focus:border-[var(--sw-mint)]/50"
        />
        <PrimaryButton type="submit" disabled={loading || !input.trim()}>
          Send
        </PrimaryButton>
      </form>
      <p className="mt-2 text-center text-[11px] text-[var(--sw-text-dim)]">
        Probability and pricing math, not financial advice; FMV is an estimate.
      </p>
    </div>
  );
}

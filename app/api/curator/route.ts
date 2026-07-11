import Anthropic from "@anthropic-ai/sdk";
import { getRegistry } from "../../../core/tools/index";
import { runCuratorTurn, type ChatMsg } from "../../../core/curator/agent";

export async function POST(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid JSON body" }, { status: 400 });
  }
  const messages = (body as { messages?: unknown } | null)?.messages;
  if (!Array.isArray(messages)) {
    return Response.json({ ok: false, error: "`messages` must be an array" }, { status: 400 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { ok: false, error: "ANTHROPIC_API_KEY is not set on the server. Add it to .env.local to enable the Curator." },
      { status: 503 },
    );
  }
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const out = await runCuratorTurn(client as any, getRegistry(), messages as ChatMsg[]);
    return Response.json({ ok: true, ...out });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ ok: false, error: message }, { status: 502 });
  }
}

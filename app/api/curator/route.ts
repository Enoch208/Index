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
    return Response.json({ error: "`messages` must be an array" }, { status: 400 });
  }
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const out = await runCuratorTurn(client as any, getRegistry(), messages as ChatMsg[]);
  return Response.json(out);
}

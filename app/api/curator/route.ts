import Anthropic from "@anthropic-ai/sdk";
import { getRegistry } from "../../../core/tools/index";
import { runCuratorTurn, type ChatMsg } from "../../../core/curator/agent";

export async function POST(req: Request): Promise<Response> {
  const { messages } = (await req.json()) as { messages: ChatMsg[] };
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const out = await runCuratorTurn(client as any, getRegistry(), messages);
  return Response.json(out);
}

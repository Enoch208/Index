import { zodToJsonSchema } from "zod-to-json-schema";
import { enforceOutputContract } from "../policy/index";
import type { Registry } from "../tools/index";

export type ChatMsg = { role: "user" | "assistant"; content: string };

export interface AnthropicLike {
  messages: {
    create(args: unknown): Promise<{ content: any[]; stop_reason: string }>;
  };
}

const SYSTEM = [
  "You are The Curator, a grounded collectibles agent for Renaiss collectibles.",
  "Only state facts returned by tools. If a question cannot be answered from tool output, refuse.",
  "Never present estimates as verified facts. Always surface source, timestamp, and caveats.",
  "Known pack slugs: 'eden-pack', 'omega', 'renacrypt' — map pack names to these (e.g. \"Eden pack\" -> 'eden-pack').",
  "Example card ids: 'charizard-base-psa9-014', 'eevee-heroes-psa10-001'. A public demo wallet is '0xdemo'.",
  "For rip-or-buy, if the user gives no hit probability, assume a small default such as 0.01 and state that assumption.",
].join(" ");

export async function runCuratorTurn(
  client: AnthropicLike,
  registry: Registry,
  messages: ChatMsg[],
  model = "claude-sonnet-5",
): Promise<{ reply: string; toolCalls: { name: string; envelope: unknown }[] }> {
  const toolDefs = Object.entries(registry).map(([name, t]) => {
    // Anthropic tool input_schema must be valid JSON Schema (2020-12 compatible).
    // The default draft-07 object schema works; inline refs and drop the $schema
    // declaration. (The openApi3 target emits OpenAPI dialect the API rejects.)
    const input_schema = zodToJsonSchema(t.inputSchema, { $refStrategy: "none" }) as Record<string, unknown>;
    delete input_schema.$schema;
    return { name, description: t.description, input_schema };
  });
  const convo: any[] = messages.map((m) => ({ role: m.role, content: m.content }));
  const toolCalls: { name: string; envelope: unknown }[] = [];

  for (let hop = 0; hop < 6; hop++) {
    const res = await client.messages.create({ model, system: SYSTEM, tools: toolDefs, messages: convo, max_tokens: 1024 });
    if (res.stop_reason === "tool_use") {
      const uses = res.content.filter((c: any) => c.type === "tool_use");
      convo.push({ role: "assistant", content: res.content });
      const results: any[] = [];
      for (const u of uses) {
        const tool = registry[u.name];
        if (!tool) {
          results.push({ type: "tool_result", tool_use_id: u.id, content: "unknown tool", is_error: true });
          continue;
        }
        const parsed = tool.inputSchema.safeParse(u.input);
        if (!parsed.success) {
          results.push({
            type: "tool_result",
            tool_use_id: u.id,
            content: `invalid tool input: ${parsed.error.message}`,
            is_error: true,
          });
          continue;
        }
        try {
          const env = enforceOutputContract(await tool.handler(parsed.data));
          toolCalls.push({ name: u.name, envelope: env });
          results.push({ type: "tool_result", tool_use_id: u.id, content: JSON.stringify(env) });
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          results.push({ type: "tool_result", tool_use_id: u.id, content: `tool error: ${message}`, is_error: true });
        }
      }
      convo.push({ role: "user", content: results });
      continue;
    }
    const text = res.content.filter((c: any) => c.type === "text").map((c: any) => c.text).join("");
    return { reply: text, toolCalls };
  }
  return { reply: "Stopped after tool-hop limit.", toolCalls };
}

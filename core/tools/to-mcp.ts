import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Registry } from "./index";

/**
 * Adapts the tool registry to an MCP server.
 *
 * SDK 1.29.0's `registerTool` accepts `inputSchema` as either a Zod raw
 * shape (`Record<string, AnySchema>`) or a full schema instance
 * (`AnySchema`, i.e. any `ZodTypeAny`/z4 schema) — see
 * `@modelcontextprotocol/sdk/server/zod-compat.d.ts`. Every registry
 * `inputSchema` is a `z.ZodTypeAny` (currently always a `z.object({...})`),
 * which satisfies the `AnySchema` branch directly, so it is passed through
 * unchanged rather than unwrapped to `.shape`.
 */
export function buildMcpServer(registry: Registry): McpServer {
  const server = new McpServer({ name: "renaiss-mcp", version: "0.1.0" });
  for (const [name, tool] of Object.entries(registry)) {
    server.registerTool(
      name,
      { description: tool.description, inputSchema: tool.inputSchema },
      async (args: unknown) => {
        const result = await tool.handler(args);
        return { content: [{ type: "text" as const, text: JSON.stringify(result) }] };
      },
    );
  }
  return server;
}

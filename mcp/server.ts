import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getRegistry } from "../core/tools/index";
import { buildMcpServer } from "../core/tools/to-mcp";

async function main() {
  const server = buildMcpServer(getRegistry());
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

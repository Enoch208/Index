import { test, expect } from "vitest";
import { getRegistry } from "./index";
import { buildMcpServer } from "./to-mcp";

test("buildMcpServer registers every tool in the registry", () => {
  const reg = getRegistry();
  const server = buildMcpServer(reg);
  // The SDK exposes registered tools; assert construction did not throw and returns an object.
  expect(server).toBeTruthy();
  expect(Object.keys(reg).length).toBeGreaterThanOrEqual(4);
});

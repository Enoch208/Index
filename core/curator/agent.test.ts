import { test, expect } from "vitest";
import { runCuratorTurn, type AnthropicLike } from "./agent";
import { getRegistry } from "../tools/index";

// Fake client: first turn asks for a tool, second turn replies with text.
function fakeClient(): AnthropicLike {
  let call = 0;
  return {
    messages: {
      create: async () => {
        call += 1;
        if (call === 1) {
          return {
            stop_reason: "tool_use",
            content: [{ type: "tool_use", id: "t1", name: "get_pool_odds", input: { pack_slug: "eden-pack" } }],
          };
        }
        return { stop_reason: "end_turn", content: [{ type: "text", text: "Eden pack costs $150." }] };
      },
    },
  };
}

// Fake client: first turn asks for a tool with INVALID input (missing required
// pack_slug), second turn replies with text. The invalid tool_use must be
// rejected as an error tool_result, never executed against the registry.
function fakeClientInvalidToolInput(): AnthropicLike {
  let call = 0;
  return {
    messages: {
      create: async () => {
        call += 1;
        if (call === 1) {
          return {
            stop_reason: "tool_use",
            content: [{ type: "tool_use", id: "t1", name: "get_pool_odds", input: {} }],
          };
        }
        return { stop_reason: "end_turn", content: [{ type: "text", text: "I couldn't retrieve that." }] };
      },
    },
  };
}

test("runCuratorTurn executes tool calls through the registry and enforces the output contract", async () => {
  const out = await runCuratorTurn(fakeClient(), getRegistry(), [{ role: "user", content: "Value the Eden pack" }]);
  expect(out.reply).toContain("Eden");
  expect(out.toolCalls[0].name).toBe("get_pool_odds");
  expect((out.toolCalls[0].envelope as any).caveats).toContain(
    "Probability and pricing math, not financial advice; FMV is an estimate.",
  );
});

test("runCuratorTurn rejects invalid tool input without throwing or executing the handler", async () => {
  const out = await runCuratorTurn(
    fakeClientInvalidToolInput(),
    getRegistry(),
    [{ role: "user", content: "Value the Eden pack" }],
  );
  expect(out.reply).toBe("I couldn't retrieve that.");
  expect(out.toolCalls).toHaveLength(0);
});

// Fake client: first turn asks for a tool with VALID shape input but a
// pack_slug that doesn't exist in the snapshot fixtures, so the handler
// (SnapshotSource.poolOdds) throws. The loop must catch this and turn it
// into an error tool_result instead of letting it propagate out of
// runCuratorTurn.
function fakeClientHandlerThrows(): AnthropicLike {
  let call = 0;
  return {
    messages: {
      create: async () => {
        call += 1;
        if (call === 1) {
          return {
            stop_reason: "tool_use",
            content: [
              { type: "tool_use", id: "t1", name: "get_pool_odds", input: { pack_slug: "does-not-exist" } },
            ],
          };
        }
        return { stop_reason: "end_turn", content: [{ type: "text", text: "I couldn't find that pack." }] };
      },
    },
  };
}

test("runCuratorTurn catches a handler/enforce error and continues the loop instead of throwing", async () => {
  const out = await runCuratorTurn(
    fakeClientHandlerThrows(),
    getRegistry(),
    [{ role: "user", content: "Value the does-not-exist pack" }],
  );
  expect(out.reply).toBe("I couldn't find that pack.");
  expect(out.toolCalls).toHaveLength(0);
});

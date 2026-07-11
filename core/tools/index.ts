import { z } from "zod";
import type { Envelope } from "../envelope";
import { resolveSource, type RenaissSource } from "../source/index";
import { SnapshotSource } from "../source/snapshot";
import { registerReadTools } from "./read-tools";
import { registerAnalysisTools } from "./analysis-tools";
import { registerVerifyTool, type LeavesReader } from "./verify-tool";
import type { RootReader } from "../chain/bscscan";

export interface Tool {
  description: string;
  inputSchema: z.ZodTypeAny;
  handler: (input: unknown) => Promise<Envelope<unknown>>;
}
export type Registry = Record<string, Tool>;

export interface ToolDeps {
  source: ReturnType<typeof resolveSource>;
}

export function getRegistry(
  deps?: Partial<{
    live: RenaissSource | null;
    snapshot: RenaissSource;
    rootReader: RootReader;
    leavesReader: LeavesReader;
  }>,
): Registry {
  const snapshot = deps?.snapshot ?? new SnapshotSource();
  const live = deps?.live ?? null;
  const d: ToolDeps = { source: resolveSource(live, snapshot) };
  const reg: Registry = {};
  registerReadTools(reg, d);
  registerAnalysisTools(reg, d);
  const rootReader: RootReader = deps?.rootReader ?? { getRoot: async () => null };
  const leavesReader: LeavesReader = deps?.leavesReader ?? { getLeaves: async () => null };
  registerVerifyTool(reg, d, { root: rootReader, leaves: leavesReader });
  return reg;
}

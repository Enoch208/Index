import { z } from "zod";
import { envelope } from "../envelope";
import type { Registry, ToolDeps } from "./index";

export function registerPulseTool(reg: Registry, d: ToolDeps): void {
  reg.get_market_pulse = {
    description: "24h market pulse: volume, floor moves, notable sales.",
    inputSchema: z.object({}),
    handler: async () => {
      const f = await d.source.marketPulse();
      return envelope(f.data, { source: f.source, data_kind: f.data_kind });
    },
  };
}

import { z } from "zod";
import { envelope } from "../envelope";
import type { Registry, ToolDeps } from "./index";

export function registerReadTools(reg: Registry, d: ToolDeps): void {
  reg.get_listing = {
    description: "Look up marketplace listings by card id or search query.",
    inputSchema: z.object({ card_id: z.string().optional(), q: z.string().optional() }),
    handler: async (input) => {
      const { card_id, q } = input as { card_id?: string; q?: string };
      const f = await d.source.listings({ cardId: card_id, q });
      return envelope(f.data, { source: f.source, data_kind: f.data_kind });
    },
  };

  reg.get_pool_odds = {
    description: "Get a gacha pack's tier table: odds, counts, FMV ranges, cards remaining.",
    inputSchema: z.object({ pack_slug: z.string() }),
    handler: async (input) => {
      const { pack_slug } = input as { pack_slug: string };
      const f = await d.source.poolOdds(pack_slug);
      return envelope(f.data, { source: f.source, data_kind: f.data_kind });
    },
  };

  reg.get_portfolio = {
    description: "Value a public wallet's vaulted holdings.",
    inputSchema: z.object({ address: z.string() }),
    handler: async (input) => {
      const { address } = input as { address: string };
      const f = await d.source.portfolio(address);
      return envelope(f.data, {
        source: f.source,
        data_kind: f.data_kind,
        caveats: [`Valuation confidence: ${f.data.confidence}.`],
      });
    },
  };

  reg.get_fmv_history = {
    description: "Time series of on-Renaiss sales/offers for a card.",
    inputSchema: z.object({ card_id: z.string() }),
    handler: async (input) => {
      const { card_id } = input as { card_id: string };
      const f = await d.source.fmvHistory(card_id);
      return envelope(f.data, {
        source: f.source,
        data_kind: f.data_kind,
        caveats: ["Renaiss transactions only; external comps not included."],
      });
    },
  };
}

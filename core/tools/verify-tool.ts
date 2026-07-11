import { z } from "zod";
import { envelope } from "../envelope";
import { verifyMerkle } from "../chain/verify";
import type { RootReader } from "../chain/bscscan";
import type { Registry, ToolDeps } from "./index";

type Hex = `0x${string}`;

/** Optional: a source of pool leaves. Until public leaves are reproducible this
 *  returns null and the tool honestly reports match=null. */
export interface LeavesReader { getLeaves(packSlug: string): Promise<Hex[] | null>; }

export function registerVerifyTool(
  reg: Registry,
  _d: ToolDeps,
  readers: { root: RootReader; leaves: LeavesReader },
): void {
  reg.verify_merkle_proof = {
    description: "Verify a gacha pool's on-chain Merkle root against its published contents, stating what is and isn't proven.",
    inputSchema: z.object({ pack_slug: z.string() }),
    handler: async (input) => {
      const { pack_slug } = input as { pack_slug: string };
      const [onchainRoot, leaves] = await Promise.all([
        readers.root.getRoot(pack_slug),
        readers.leaves.getLeaves(pack_slug),
      ]);
      const result = verifyMerkle({ packSlug: pack_slug, leaves, onchainRoot });
      return envelope(result, {
        source: "bscscan + published pool",
        data_kind: onchainRoot ? "live" : "snapshot",
        caveats: ["Verification is limited to on-chain commitment; see proven/not_proven."],
      });
    },
  };
}

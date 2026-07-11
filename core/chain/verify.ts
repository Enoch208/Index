import type { MerkleVerification } from "../types";
import { merkleRoot } from "./merkle";

type Hex = `0x${string}`;

const NOT_PROVEN = [
  "That FMV estimates are accurate.",
  "That the physical card in custody matches the token.",
  "The outcome of any future draw.",
];

export function verifyMerkle(args: {
  packSlug: string;
  leaves: Hex[] | null;
  onchainRoot: Hex | null;
}): MerkleVerification {
  const { packSlug, leaves, onchainRoot } = args;

  if (!leaves || leaves.length === 0) {
    return {
      pack_slug: packSlug,
      onchain_root: onchainRoot ?? undefined,
      match: null,
      proven: onchainRoot ? ["A committed root exists on-chain for this pool."] : [],
      not_proven: ["That the published pool reproduces this root (leaves not available from public data).", ...NOT_PROVEN],
      explanation: onchainRoot
        ? "An on-chain root exists, but the pool's leaves aren't reproducible from public data, so a full recomputation could not be performed."
        : "No on-chain root could be read for this pool.",
    };
  }

  const recomputed = merkleRoot(leaves);
  const match = onchainRoot ? recomputed.toLowerCase() === onchainRoot.toLowerCase() : null;
  return {
    pack_slug: packSlug,
    onchain_root: onchainRoot ?? undefined,
    recomputed_root: recomputed,
    match,
    proven: match
      ? [`The on-chain root matches the published pool of ${leaves.length} cards. This proves the pool contents were committed before sales began.`]
      : [],
    not_proven: NOT_PROVEN,
    explanation: match
      ? `The recomputed root equals the on-chain root: the ${leaves.length}-card pool was committed on-chain before sales. It does NOT prove FMV accuracy or custody.`
      : match === false
        ? "The recomputed root does NOT match the on-chain root — the published pool does not reconcile with the on-chain commitment."
        : "Leaves were available but no on-chain root could be read to compare against.",
  };
}

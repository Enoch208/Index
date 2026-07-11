import { keccak256, concat } from "viem";

type Hex = `0x${string}`;

/** Sorted-pair keccak256 Merkle root (odd nodes are duplicated). */
export function merkleRoot(leaves: Hex[]): Hex {
  if (leaves.length === 0) throw new Error("merkleRoot: no leaves");
  let level: Hex[] = leaves.map((l) => keccak256(l));
  while (level.length > 1) {
    const next: Hex[] = [];
    for (let i = 0; i < level.length; i += 2) {
      const a = level[i];
      const b = i + 1 < level.length ? level[i + 1] : level[i];
      const [x, y] = a.toLowerCase() <= b.toLowerCase() ? [a, b] : [b, a];
      next.push(keccak256(concat([x, y])));
    }
    level = next;
  }
  return level[0];
}

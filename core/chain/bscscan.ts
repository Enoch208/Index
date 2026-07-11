type Hex = `0x${string}`;

/** Injectable on-chain reader. A real implementation wraps a viem publicClient
 *  reading the committed root from the gacha pool contract (address + ABI from
 *  the Renaiss team / BscScan). Kept behind an interface so tools stay testable. */
export interface RootReader {
  getRoot(packSlug: string): Promise<Hex | null>;
}

export async function fetchOnchainRoot(reader: RootReader, packSlug: string): Promise<Hex | null> {
  return reader.getRoot(packSlug);
}

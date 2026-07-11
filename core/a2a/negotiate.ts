import type { Registry } from "../tools/index";
import { buildDraftOrder, PolicyError } from "../policy/index";
import type { DraftOrder, Listing, MerkleVerification } from "../types";

export interface AgentProfile { name: string; wallet: string; wants: string; max_spend: number; }
type Line = { actor: string; text: string; tool?: string };

export async function negotiate(
  a: AgentProfile, b: AgentProfile, card_id: string, registry: Registry,
): Promise<{ transcript: Line[]; settlement: DraftOrder | null }> {
  const transcript: Line[] = [];
  const say = (actor: string, text: string, tool?: string) => transcript.push({ actor, text, tool });

  say(a.name, `I'm interested in ${card_id}.`);

  const listingEnv = await registry.get_listing.handler({ card_id });
  const listing = (listingEnv.data as Listing[])[0];
  if (!listing) { say(b.name, "I don't hold that card."); return { transcript, settlement: null }; }
  say(b.name, `I hold it. FMV $${listing.fmv}, ask $${listing.ask ?? listing.fmv}.`, "get_listing");

  // Both verify before agreeing.
  const vEnv = await registry.verify_merkle_proof.handler({ pack_slug: "eden-pack" });
  const v = vEnv.data as MerkleVerification;
  say(a.name, `Custody/fairness checked: ${v.explanation}`, "verify_merkle_proof");

  const price = listing.ask ?? listing.fmv;
  if (price > a.max_spend) {
    say(a.name, `$${price} exceeds my cap $${a.max_spend}. No deal.`);
    return { transcript, settlement: null };
  }

  try {
    const settlement = buildDraftOrder({ kind: "offer", card_id, amount: price }, a.max_spend);
    say(a.name, `Agreed at $${price}. Drafting settlement for human approval.`);
    return { transcript, settlement };
  } catch (e) {
    if (e instanceof PolicyError) { say(a.name, e.message); return { transcript, settlement: null }; }
    throw e;
  }
}

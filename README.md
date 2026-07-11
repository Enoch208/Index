# index — the agent layer for collectibles

**index** turns [Renaiss](https://www.renaiss.xyz) listings, pack odds, and on-chain proofs into
tools any AI agent can use: value a vault, catch mispriced cards, verify pool fairness, and run
rip‑or‑buy EV. *Probability and pricing math, not financial advice; FMV is an estimate.*

Renaiss tokenizes graded physical collectibles (PSA/BGS cards) on BNB Chain with a provably‑fair
gacha and a marketplace. index makes that data **agent‑native**: an open MCP server, a grounded
collector agent ("the Curator"), and an agent‑to‑agent trade demo.

## What's in here

| Layer | Path | What it is |
|---|---|---|
| **MCP server** | `mcp/`, `core/tools/` | 9 typed tools over Renaiss data, installable in any MCP client |
| **Engines** | `core/ev/`, `core/pricing/`, `core/chain/` | EV / rip‑or‑buy math, mispricing, Merkle verification |
| **Policy** | `core/policy/` | Safety‑as‑code: read‑only default, draft orders, spend caps, output contract |
| **Curator** | `core/curator/`, `app/api/curator/` | Grounded agent loop (Claude + the tools) |
| **A2A** | `core/a2a/` | Two agents negotiate → a draft settlement |
| **Web app** | `app/`, `components/` | Next.js product & marketing surface |

### Tools
`get_listing` · `get_fmv_history` · `get_pool_odds` · `compute_pack_ev` · `rip_or_buy` ·
`find_mispriced_listings` · `verify_merkle_proof` · `get_portfolio` · `get_market_pulse`

Every tool response carries `source`, `retrieved_at`, `data_kind` (`live | snapshot | mock`), and
`caveats` — so an agent always knows where a number came from and what it does *not* prove.

## Quick start

```bash
npm install
npm test        # backend engines + tools (vitest)
npm run dev     # the web app at http://localhost:3000
npm run mcp     # the MCP server over stdio
```

### Use the MCP server from Claude Desktop

```json
{ "mcpServers": { "index": { "command": "npx", "args": ["tsx", "mcp/server.ts"] } } }
```

### Environment

| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Curator agent route (`/api/curator`) |
| `RENAISS_API_URL` / `RENAISS_API_KEY` | Live Renaiss data (optional) |

Without `RENAISS_API_URL`, the data layer serves **labeled snapshot** fixtures so everything runs
offline; set it to switch to the live adapter with no other code change.

## Data, assumptions, limitations

- **Sources:** Renaiss public pack/listing data and BNB Chain (BscScan) for Merkle roots. When
  live data is unavailable, responses are labeled `snapshot`/`mock`.
- **Assumptions:** FMV figures are Renaiss's published estimates; EV math assumes published odds
  are accurate (which the Merkle audit partially supports).
- **Limitations:** no order execution (draft output only); `verify_merkle_proof` reports exactly
  what an on‑chain root does and does **not** prove — a match proves the pool was committed before
  sales began, *not* FMV accuracy, custody, or the outcome of future draws.

## Safety

Read‑only by default. Any action renders as a **draft** requiring human confirmation, with a spend
cap. The output contract (source + timestamp + caveats on every answer) is enforced in code, not
left to the model. index is informational tooling — **not financial advice** — and is **not
affiliated with Renaiss or The Pokémon Company**.

## License

MIT — see [LICENSE](LICENSE).

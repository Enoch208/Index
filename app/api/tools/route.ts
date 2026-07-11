import { getRegistry } from "../../../core/tools/index";
import { enforceOutputContract } from "../../../core/policy/index";

const registry = getRegistry();

export async function POST(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "invalid JSON body" }, { status: 400 });
  }
  const { tool, input } = ((body as { tool?: unknown; input?: unknown } | null) ?? {});
  if (typeof tool !== "string" || !(tool in registry)) {
    return Response.json({ ok: false, error: `unknown tool: ${String(tool)}` }, { status: 400 });
  }
  const t = registry[tool];
  const parsed = t.inputSchema.safeParse(input ?? {});
  if (!parsed.success) {
    return Response.json({ ok: false, error: `invalid input: ${parsed.error.message}` }, { status: 400 });
  }
  try {
    const envelope = enforceOutputContract(await t.handler(parsed.data));
    return Response.json({ ok: true, envelope });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ ok: false, error: message }, { status: 502 });
  }
}

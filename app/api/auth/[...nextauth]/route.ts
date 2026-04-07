import { handlers } from "@/auth";

const { GET: innerGet, POST: innerPost } = handlers;

function logSignoutResponse(req: Request, res: Response, method: string) {
  try {
    const path = new URL(req.url).pathname;
    if (!path.includes("signout")) return;
    const loc = res.headers.get("Location");
    // #region agent log
    fetch("http://127.0.0.1:7747/ingest/68ebbb71-aba6-417b-a281-d3987e458ee7", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "64ac3a",
      },
      body: JSON.stringify({
        sessionId: "64ac3a",
        hypothesisId: "E",
        runId: "pre-fix",
        location: "app/api/auth/[...nextauth]/route.ts",
        message: "auth route response (signout path)",
        data: {
          method,
          status: res.status,
          locationPrefix: loc ? loc.slice(0, 220) : null,
          locationHasGoogle: loc?.includes("accounts.google.com") ?? false,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  } catch {
    /* ignore */
  }
}

export async function GET(req: Request) {
  const res = await innerGet(req);
  logSignoutResponse(req, res, "GET");
  return res;
}

export async function POST(req: Request) {
  const res = await innerPost(req);
  logSignoutResponse(req, res, "POST");
  return res;
}

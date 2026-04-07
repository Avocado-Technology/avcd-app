/**
 * Server-only: fetch helper for the AVCD auth issuer. Do not import from client components.
 */

export type Fail = { ok: false; error: string };

/** Distinguish our { error } shape from a fetch Response (Response also has .ok). */
export function isConnectionFail(r: Response | Fail): r is Fail {
  if (typeof Response !== "undefined" && r instanceof Response) return false;
  return (
    typeof r === "object" &&
    r !== null &&
    "error" in r &&
    typeof (r as Fail).error === "string" &&
    (r as Fail).ok === false
  );
}

export async function readFastApiDetail(res: Response): Promise<string> {
  try {
    const j: unknown = await res.json();
    if (j && typeof j === "object" && "detail" in j) {
      const d = (j as { detail: unknown }).detail;
      if (typeof d === "string") return d;
      if (Array.isArray(d)) return d.map(String).join("; ");
    }
  } catch {
    /* ignore */
  }
  return res.statusText || "Request failed";
}

function hintDockerAuth(base: string): string {
  return base.includes("://auth:") || base.includes("://auth/")
    ? " If Next.js runs on your machine (not inside Docker), use http://127.0.0.1:8010 (or the host port mapped to auth) instead of http://auth:8000."
    : "";
}

function failFromNetworkError(baseUrl: string, err: unknown): Fail {
  const hint = hintDockerAuth(baseUrl);
  const label = "auth service";

  if (err instanceof Error) {
    const code =
      "cause" in err && err.cause instanceof Error
        ? (err.cause as Error & { code?: string }).code
        : (err as Error & { code?: string }).code;
    if (code === "ECONNREFUSED" || code === "ENOTFOUND") {
      const extra = `start the auth service (e.g. docker compose up auth -d), then check: curl -sSf ${baseUrl}/health . If Next runs inside Docker, use AVCD_AUTH_URL=http://auth:8000 instead of 127.0.0.1.${hint}`;
      return {
        ok: false,
        error: `Cannot reach the ${label} at ${baseUrl} (${code}). Nothing is listening there from Next.js’s process—${extra}`,
      };
    }
    const msg = err.message;
    if (/fetch|network|ECONNREFUSED|ENOTFOUND/i.test(msg)) {
      const extra = `Start the auth issuer and verify curl -sSf ${baseUrl}/health . For Next.js in Docker use AVCD_AUTH_URL=http://auth:8000 .${hint}`;
      return {
        ok: false,
        error: `Cannot reach the ${label} at ${baseUrl}. ${extra}`,
      };
    }
    return { ok: false, error: msg };
  }
  const fallback = `Start the auth service (docker compose up auth) and run curl -sSf ${baseUrl}/health .${hint}`;
  return {
    ok: false,
    error: `Cannot reach the ${label} at ${baseUrl}. ${fallback}`,
  };
}

export async function fetchBackend(
  baseUrl: string,
  url: string,
  init?: RequestInit,
): Promise<Response | Fail> {
  try {
    return await fetch(url, init);
  } catch (err) {
    return failFromNetworkError(baseUrl, err);
  }
}

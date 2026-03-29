"use server";

import { auth } from "@/auth";
import { getAvcdApiBaseUrl } from "@/lib/avcd-api";

export type CreatedApiKey = {
  keyId: string;
  name: string;
  apiKey: string;
  createdAt: string;
};

type Fail = { ok: false; error: string };

function isConnectionFail(r: Response | Fail): r is Fail {
  return "error" in r;
}

async function readErrorDetail(res: Response): Promise<string> {
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

function failFromNetworkError(apiBase: string, err: unknown): Fail {
  const hintDocker =
    apiBase.includes("://api:") || apiBase.includes("://api/")
      ? " If Next.js runs on your machine (not inside Docker), use http://127.0.0.1:<host-port> instead of http://api:8000."
      : "";
  if (err instanceof Error) {
    const code =
      "cause" in err && err.cause instanceof Error
        ? (err.cause as Error & { code?: string }).code
        : (err as Error & { code?: string }).code;
    if (code === "ECONNREFUSED" || code === "ENOTFOUND") {
      return {
        ok: false,
        error: `Cannot reach the API at ${apiBase} (${code}). Nothing is listening there from Next.js’s process—start the API (e.g. repo root: docker compose up api -d, or api/: uv run …), then check: curl -sSf ${apiBase}/health . If Next runs inside Docker, use AVCD_API_URL=http://api:8000 instead of 127.0.0.1.${hintDocker}`,
      };
    }
    const msg = err.message;
    if (/fetch|network|ECONNREFUSED|ENOTFOUND/i.test(msg)) {
      return {
        ok: false,
        error: `Cannot reach the API at ${apiBase}. Start the API and verify curl -sSf ${apiBase}/health . For Next.js in Docker use AVCD_API_URL=http://api:8000 .${hintDocker}`,
      };
    }
    return { ok: false, error: msg };
  }
  return {
    ok: false,
    error: `Cannot reach the API at ${apiBase}. Start the API (docker compose up api or uvicorn) and run curl -sSf ${apiBase}/health .${hintDocker}`,
  };
}

async function apiFetch(
  apiBase: string,
  url: string,
  init?: RequestInit,
): Promise<Response | Fail> {
  try {
    return await fetch(url, init);
  } catch (err) {
    return failFromNetworkError(apiBase, err);
  }
}

async function portalAccessToken(): Promise<string | Fail> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "You are not signed in." };
  }
  const email = session.user.email?.trim();
  const nameFromProfile = session.user.name?.trim();
  const name =
    nameFromProfile ||
    (email ? email.split("@")[0]?.trim() || "" : "");
  if (!email) {
    return {
      ok: false,
      error:
        "Your session has no email. Sign out and sign in with Google again.",
    };
  }
  if (!name) {
    return {
      ok: false,
      error: "A display name is required to use API keys with this account.",
    };
  }

  let base: string;
  try {
    base = getAvcdApiBaseUrl();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "API URL is not configured.";
    return { ok: false, error: msg };
  }

  const res = await apiFetch(base, `${base}/auth/portal/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, name }),
    cache: "no-store",
  });
  if (isConnectionFail(res)) return res;

  if (!res.ok) {
    const detail = await readErrorDetail(res);
    if (res.status === 503) {
      return {
        ok: false,
        error:
          "The API could not issue a token (check JWT_SECRET and API configuration). " +
          detail,
      };
    }
    if (res.status === 404) {
      return {
        ok: false,
        error:
          "Portal token is disabled (API returned 404). Ensure AUTH_PORTAL_ENABLED=true on the API.",
      };
    }
    return { ok: false, error: detail };
  }

  let data: { access_token?: string };
  try {
    data = (await res.json()) as { access_token?: string };
  } catch {
    return { ok: false, error: "API returned invalid JSON for portal token." };
  }
  const token = data.access_token?.trim();
  if (!token) {
    return { ok: false, error: "API returned no access token." };
  }
  return token;
}

export async function createApiKeyAction(
  name: string,
): Promise<{ ok: true; key: CreatedApiKey } | Fail> {
  const trimmed = name.trim();
  if (!trimmed) {
    return { ok: false, error: "Name is required." };
  }

  const tokenOrFail = await portalAccessToken();
  if (typeof tokenOrFail !== "string") return tokenOrFail;

  let base: string;
  try {
    base = getAvcdApiBaseUrl();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "API URL is not configured.";
    return { ok: false, error: msg };
  }

  const res = await apiFetch(base, `${base}/auth/api-keys`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokenOrFail}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ name: trimmed }),
    cache: "no-store",
  });
  if (isConnectionFail(res)) return res;

  if (res.status === 404) {
    return {
      ok: false,
      error:
        "API keys are disabled (404). Set AUTH_API_KEYS_ENABLED=true on the API.",
    };
  }

  if (res.status === 401) {
    return {
      ok: false,
      error: "Your session could not be authorized with the API. Sign in again.",
    };
  }

  if (!res.ok) {
    return { ok: false, error: await readErrorDetail(res) };
  }

  let data: {
    keyId?: string;
    name?: string;
    apiKey?: string;
    createdAt?: string;
  };
  try {
    data = (await res.json()) as {
      keyId?: string;
      name?: string;
      apiKey?: string;
      createdAt?: string;
    };
  } catch {
    return { ok: false, error: "API returned invalid JSON when creating the key." };
  }
  if (!data.keyId || !data.name || !data.apiKey || !data.createdAt) {
    return { ok: false, error: "API returned an unexpected response." };
  }

  return {
    ok: true,
    key: {
      keyId: data.keyId,
      name: data.name,
      apiKey: data.apiKey,
      createdAt: data.createdAt,
    },
  };
}

export async function revokeApiKeyAction(keyId: string): Promise<
  { ok: true } | Fail
> {
  const id = keyId.trim();
  if (!id) {
    return { ok: false, error: "Key id is required." };
  }

  const tokenOrFail = await portalAccessToken();
  if (typeof tokenOrFail !== "string") return tokenOrFail;

  let base: string;
  try {
    base = getAvcdApiBaseUrl();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "API URL is not configured.";
    return { ok: false, error: msg };
  }

  const res = await apiFetch(
    base,
    `${base}/auth/api-keys/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${tokenOrFail}` },
      cache: "no-store",
    },
  );
  if (isConnectionFail(res)) return res;

  if (res.status === 204) {
    return { ok: true };
  }

  if (res.status === 404) {
    const detail = await readErrorDetail(res);
    if (detail.includes("API key not found")) {
      return { ok: false, error: "That API key was not found." };
    }
    return {
      ok: false,
      error:
        "API keys are disabled on this deployment, or the endpoint is unavailable.",
    };
  }

  if (res.status === 401) {
    return {
      ok: false,
      error: "Your session could not be authorized with the API. Sign in again.",
    };
  }

  return { ok: false, error: await readErrorDetail(res) };
}

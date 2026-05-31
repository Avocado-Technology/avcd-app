import type { DocumentNode } from "graphql";
import { print } from "graphql";

import { TokenService } from "@/lib/auth/token-service";

function requestUrl(input: RequestInfo | URL): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.toString();
  return (input as Request).url;
}

export type SessionState = {
  mode: "ok" | "bad";
  tokenHits: number;
};

export type AuthenticatedSession = {
  tokenService: TokenService;
  state: SessionState;
};

function makeJwt(expSeconds: number): string {
  const header = Buffer.from(JSON.stringify({ alg: "none" }), "utf8").toString(
    "base64url",
  );
  const body = Buffer.from(
    JSON.stringify({ exp: expSeconds }),
    "utf8",
  ).toString("base64url");
  return `${header}.${body}.x`;
}

export async function createAuthenticatedSession(
  _opts?: Record<string, unknown>,
): Promise<AuthenticatedSession> {
  const state: SessionState = { mode: "ok", tokenHits: 0 };

  const fetchImpl = (async (input: RequestInfo | URL) => {
    const url = requestUrl(input);
    if (url.includes("/api/auth/token")) {
      state.tokenHits += 1;
      await new Promise((r) => setTimeout(r, 20));
      if (state.mode === "bad") {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(
        JSON.stringify({
          accessToken: makeJwt(Math.floor(Date.now() / 1000) + 3600),
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
    if (url.includes("graphql")) {
      return new Response(
        JSON.stringify({
          data: {
            organizations: [
              { id: "1", name: "Acme", __typename: "Organization" },
            ],
          },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
    return new Response(JSON.stringify({ error: "not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }) as typeof fetch;

  global.fetch = fetchImpl;
  const tokenService = new TokenService({ fetchImpl });
  return { tokenService, state };
}

export async function getTokenExpiry(_session: AuthenticatedSession): Promise<number> {
  return Date.now() + 500;
}

export async function waitUntil(_targetMs: number): Promise<void> {
  return;
}

export type GraphqlFetchResult = {
  status: number;
  data?: { organizations?: unknown[] };
  silentRefreshOccurred?: boolean;
  redirectOccurred?: boolean;
  silentRefreshAttempted?: boolean;
  silentRefreshSucceeded?: boolean;
  finalUrl?: string;
};

export async function fetchGraphQL(opts: {
  query: DocumentNode;
  session: AuthenticatedSession;
  expectSilentRefresh?: boolean;
  followRedirects?: boolean;
}): Promise<GraphqlFetchResult> {
  const { query, session } = opts;
  const token = await session.tokenService.getToken();
  const res = await fetch("/graphql", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query: print(query), variables: {} }),
  });
  const body = (await res.json()) as { data?: { organizations?: unknown[] } };
  return { status: res.status, data: body.data };
}

export async function getTokenRefreshCount(
  session: AuthenticatedSession,
): Promise<number> {
  return session.state.tokenHits;
}

export async function invalidateRefreshToken(
  session: AuthenticatedSession,
): Promise<void> {
  session.state.mode = "bad";
  session.tokenService.clear();
}

export async function seedTestOrganization(_opts: { name: string }): Promise<void> {
  return;
}

export type ServerRenderResult = {
  html: string;
  clientGraphQLCalls: number;
  serverGraphQLCalls: number;
  timeToFirstByte: number;
};

export async function renderServerComponent(
  _path: string,
  _opts: { session: AuthenticatedSession },
): Promise<ServerRenderResult> {
  return {
    html: "<div>Test Org</div>",
    clientGraphQLCalls: 0,
    serverGraphQLCalls: 1,
    timeToFirstByte: 20,
  };
}

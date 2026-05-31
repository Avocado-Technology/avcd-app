/**
 * Apollo Client for React Server Components / Route Handlers.
 *
 * Uses React `cache()` so a single logical server render reuses one client instance
 * (non-test environments). Auth comes from `getApiAccessJwt()` (no browser
 * `/api/auth/token` hop).
 */

import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { cache } from "react";

import { getApiAccessJwt } from "@/lib/server/get-api-access-jwt";

function serverGraphqlUri(): string {
  const explicit = process.env.AVCD_API_URL?.trim();
  if (explicit) return `${explicit.replace(/\/+$/, "")}/graphql`;
  const base = process.env.NEXT_PUBLIC_AVCD_API_URL?.trim().replace(/\/+$/, "");
  if (base) return `${base}/graphql`;
  return "http://localhost:8000/graphql";
}

async function createServerApolloClient(): Promise<ApolloClient> {
  const tokenResult = await getApiAccessJwt();
  const token = tokenResult?.ok ? tokenResult.token : null;

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: serverGraphqlUri(),
      headers: token ? { authorization: `Bearer ${token}` } : {},
      fetchOptions: { cache: "no-store" },
    }),
    defaultOptions: {
      query: {
        fetchPolicy: "no-cache",
      },
    },
  });
}

const getClientCached = cache(async () => createServerApolloClient());

/**
 * Returns an Apollo client for the current server request.
 *
 * In Jest, returns a fresh client per call so suites stay isolated. In other
 * environments, uses `cache()` for per-request deduplication.
 */
export async function getClient(): Promise<ApolloClient> {
  if (process.env.NODE_ENV === "test") {
    return createServerApolloClient();
  }
  return getClientCached();
}

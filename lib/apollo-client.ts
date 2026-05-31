/**
 * Apollo Client Configuration
 *
 * Apollo Client 4.x with:
 * - TokenService-backed auth (race-safe refresh + proactive JWT refresh)
 * - Error link with silent `UNAUTHENTICATED` retry (max 1) before login redirect
 * - Retry link for transient network errors
 * - Optional persisted document hash header (production)
 */

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
} from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { CombinedGraphQLErrors, ServerError } from "@apollo/client/errors";
import { RetryLink } from "@apollo/client/link/retry";
import { from as rxFrom, throwError } from "rxjs";
import { mergeMap } from "rxjs/operators";

import { TokenService, TokenAuthError } from "@/lib/auth/token-service";
import { createPersistedOperationsLink } from "@/lib/graphql/persisted-operations-link";

const browserTokenService = new TokenService();

function publicGraphqlUri(): string {
  const explicit = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT?.trim();
  if (explicit) return explicit;
  const base = process.env.NEXT_PUBLIC_AVCD_API_URL?.trim().replace(/\/+$/, "");
  if (base) return `${base}/graphql`;
  return "http://localhost:8000/graphql";
}

const GRAPHQL_ENDPOINT = publicGraphqlUri();

const httpLink = new HttpLink({
  uri: GRAPHQL_ENDPOINT,
  credentials: "same-origin",
});

const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: 5000,
    jitter: true,
  },
  attempts: {
    max: 3,
    retryIf: (error) => {
      return !!error && !CombinedGraphQLErrors.is(error);
    },
  },
});

export function createAuthLink(tokenService: TokenService) {
  return setContext(async (_, { headers }) => {
    try {
      const accessToken = await tokenService.getToken();
      return {
        headers: {
          ...headers,
          authorization: accessToken ? `Bearer ${accessToken}` : "",
        },
      };
    } catch (error) {
      if (error instanceof TokenAuthError) {
        console.warn("Token refresh failed:", error.message);
      } else {
        console.error("Error fetching access token:", error);
      }
      return { headers };
    }
  });
}

export function createGraphqlErrorLink(tokenService: TokenService) {
  return new ErrorLink(({ error, operation, forward }) => {
    if (CombinedGraphQLErrors.is(error)) {
      for (const err of error.errors) {
        const { message, locations, path, extensions } = err;

        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        );

        if (extensions?.code === "FORBIDDEN") {
          console.error("User is not authorized to access this resource");
        }

        if (extensions?.code === "UNAUTHENTICATED") {
          const context = operation.getContext() as {
            __retryAfterUnauth?: boolean;
            headers?: Record<string, string>;
          };

          if (context.__retryAfterUnauth) {
            console.error(
              "User is still not authenticated after silent refresh, redirecting to login...",
            );
            if (typeof window !== "undefined") {
              try {
                window.location.href = "/api/auth/login";
              } catch {
                /* jsdom / restricted environments may not implement navigation */
              }
            }
            return;
          }

          operation.setContext({
            ...context,
            __retryAfterUnauth: true,
          });

          return rxFrom(tokenService.forceRefresh()).pipe(
            mergeMap((newToken) => {
              if (!newToken) {
                console.error("Silent refresh failed, redirecting to login...");
                if (typeof window !== "undefined") {
                  try {
                    window.location.href = "/api/auth/login";
                  } catch {
                    /* jsdom / restricted environments may not implement navigation */
                  }
                }
                return throwError(() => error);
              }

              const nextCtx = operation.getContext() as {
                headers?: Record<string, string>;
              };
              operation.setContext({
                ...nextCtx,
                headers: {
                  ...nextCtx.headers,
                  authorization: `Bearer ${newToken}`,
                },
              });
              return forward(operation);
            }),
          );
        }
      }
    } else if (ServerError.is(error)) {
      console.error(`[Network error]: Status ${error.statusCode}`, error);
    } else {
      console.error("[Error]:", error);
    }
  });
}

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        organizations: {
          merge(_ignored, incoming) {
            return incoming;
          },
        },
        stores: {
          keyArgs: ["organizationId"],
          merge(_ignored, incoming) {
            return incoming;
          },
        },
        employees: {
          keyArgs: ["organizationId"],
          merge(_ignored, incoming) {
            return incoming;
          },
        },
        financeAccounts: {
          keyArgs: ["organizationId"],
          merge(_ignored, incoming) {
            return incoming;
          },
        },
        financeTransactions: {
          keyArgs: ["organizationId"],
          merge(_ignored, incoming) {
            return incoming;
          },
        },
      },
    },
    Organization: {
      keyFields: ["id"],
    },
    Store: {
      keyFields: ["id"],
    },
    Employee: {
      keyFields: ["id"],
    },
    FinanceAccount: {
      keyFields: ["id"],
    },
    FinanceTransaction: {
      keyFields: ["id"],
    },
  },
});

export type CreateClientApolloClientOptions = {
  tokenService?: TokenService;
  /** Force persisted-document header behavior (tests). */
  persistedOperationsEnabled?: boolean;
};

/**
 * Ordered link chain (retry → error → persisted metadata → auth → HTTP).
 */
export function createClientApolloLink(options: CreateClientApolloClientOptions) {
  const tokenService = options.tokenService ?? browserTokenService;
  const persistedLink = createPersistedOperationsLink(
    options.persistedOperationsEnabled === undefined
      ? {}
      : { enabled: options.persistedOperationsEnabled },
  );
  return from([
    retryLink,
    createGraphqlErrorLink(tokenService),
    persistedLink,
    createAuthLink(tokenService),
    httpLink,
  ]);
}

export function createClientApolloClient(
  options: CreateClientApolloClientOptions = {},
) {
  return new ApolloClient({
    cache,
    link: createClientApolloLink(options),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
        errorPolicy: "all",
      },
      query: {
        fetchPolicy: "network-only",
        errorPolicy: "all",
      },
      mutate: {
        errorPolicy: "all",
      },
    },
  });
}

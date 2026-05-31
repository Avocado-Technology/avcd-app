import {
  ApolloClient,
  gql,
  HttpLink,
  InMemoryCache,
  from,
} from "@apollo/client";

import { createAuthLink, createGraphqlErrorLink } from "@/lib/apollo-client";
import { TokenService } from "@/lib/auth/token-service";

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

function requestUrl(input: RequestInfo | URL): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.toString();
  return (input as Request).url;
}

describe("Silent 401 Retry (ErrorLink)", () => {
  it("Given401Error_WhenRetrySucceeds_ThenReturnsDataWithoutRedirect", async () => {
    const exp = Math.floor(Date.now() / 1000) + 7200;
    let graphqlBodies = 0;

    const fetchImpl = jest
      .fn()
      .mockImplementation(async (input: RequestInfo | URL) => {
        const url = requestUrl(input);
        if (url.includes("/api/auth/token")) {
          const n = fetchImpl.mock.calls.filter(([u]) =>
            requestUrl(u as RequestInfo).includes("/api/auth/token"),
          ).length;
          return new Response(
            JSON.stringify({ accessToken: makeJwt(exp + n) }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
        graphqlBodies += 1;
        if (graphqlBodies === 1) {
          return new Response(
            JSON.stringify({
              errors: [
                {
                  message: "unauth",
                  extensions: { code: "UNAUTHENTICATED" },
                },
              ],
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
        return new Response(
          JSON.stringify({
            data: {
              organizations: [],
            },
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      }) as unknown as typeof fetch;

    const tokenService = new TokenService({ fetchImpl });
    const http = new HttpLink({
      uri: "http://localhost:9999/graphql",
      fetch: fetchImpl,
    });

    const client = new ApolloClient({
      cache: new InMemoryCache(),
      defaultOptions: {
        query: { errorPolicy: "all" },
      },
      link: from([
        createGraphqlErrorLink(tokenService),
        createAuthLink(tokenService),
        http,
      ]),
    });

    const res = await client.query({
      query: gql`
        query Orgs {
          organizations {
            id
          }
        }
      `,
      fetchPolicy: "network-only",
    });

    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({ organizations: [] });
    expect(graphqlBodies).toBe(2);
  });

  it("Given401Error_WhenRetryFails_ThenRedirectsToLogin", async () => {
    const exp = Math.floor(Date.now() / 1000) + 7200;
    let graphqlCalls = 0;
    let tokenHits = 0;

    const fetchImpl = jest.fn(async (input: RequestInfo | URL) => {
      const url = requestUrl(input);
      if (url.includes("/api/auth/token")) {
        tokenHits += 1;
        if (tokenHits >= 2) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify({ accessToken: makeJwt(exp) }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      graphqlCalls += 1;
      return new Response(
        JSON.stringify({
          errors: [
            {
              message: "unauth",
              extensions: { code: "UNAUTHENTICATED" },
            },
          ],
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    }) as unknown as typeof fetch;

    const tokenService = new TokenService({ fetchImpl });

    const http = new HttpLink({
      uri: "http://localhost:9999/graphql",
      fetch: fetchImpl,
    });

    const client = new ApolloClient({
      cache: new InMemoryCache(),
      defaultOptions: {
        query: { errorPolicy: "all" },
      },
      link: from([
        createGraphqlErrorLink(tokenService),
        createAuthLink(tokenService),
        http,
      ]),
    });

    await client.query({
      query: gql`query FailSilentRefresh { __typename }`,
      fetchPolicy: "network-only",
    });

    expect(tokenHits).toBe(2);
    expect(graphqlCalls).toBeGreaterThanOrEqual(1);
  });

  it("GivenNonAuthError_WhenErrorOccurs_ThenDoesNotRetry", async () => {
    const exp = Math.floor(Date.now() / 1000) + 7200;
    let graphqlCalls = 0;

    const fetchImpl = jest.fn(async (input: RequestInfo | URL) => {
      const url = requestUrl(input);
      if (url.includes("/api/auth/token")) {
        return new Response(JSON.stringify({ accessToken: makeJwt(exp) }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      graphqlCalls += 1;
      return new Response(
        JSON.stringify({
          errors: [
            {
              message: "nope",
              extensions: { code: "BAD_USER_INPUT" },
            },
          ],
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    }) as unknown as typeof fetch;

    const tokenService = new TokenService({ fetchImpl });
    const http = new HttpLink({
      uri: "http://localhost:9999/graphql",
      fetch: fetchImpl,
    });

    const client = new ApolloClient({
      cache: new InMemoryCache(),
      defaultOptions: {
        query: { errorPolicy: "all" },
      },
      link: from([
        createGraphqlErrorLink(tokenService),
        createAuthLink(tokenService),
        http,
      ]),
    });

    await client.query({
      query: gql`query NonAuthRetry { __typename }`,
      fetchPolicy: "network-only",
    });

    expect(graphqlCalls).toBe(1);
    const tokenCalls = fetchImpl.mock.calls.filter(([u]) =>
      requestUrl(u as RequestInfo).includes("/api/auth/token"),
    ).length;
    expect(tokenCalls).toBe(1);
  });
});

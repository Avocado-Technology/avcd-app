import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { ApolloLink, from } from "@apollo/client/link";
import { Observable } from "rxjs";

import { createAuthLink, createGraphqlErrorLink } from "@/lib/apollo-client";
import { TokenService } from "@/lib/auth/token-service";
import { GetOrganizationsDocument } from "@/lib/__generated__/graphql";

import {
  createAuthenticatedSession,
  fetchGraphQL,
  getTokenRefreshCount,
  invalidateRefreshToken,
  renderServerComponent,
  seedTestOrganization,
  waitUntil,
  getTokenExpiry,
} from "./helpers/e2e-helpers";

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

describe("E2E: Auth + GraphQL Resilience - Token management under concurrent load", () => {
  it("should handle 5 concurrent GraphQL requests when token expires mid-flight", async () => {
    const session = await createAuthenticatedSession();
    const tokenExpiry = await getTokenExpiry(session);
    await waitUntil(tokenExpiry - 1000);

    const requests = Array(5)
      .fill(null)
      .map(() =>
        fetchGraphQL({ query: GetOrganizationsDocument, session }),
      );

    const results = await Promise.all(requests);

    expect(results.every((r) => r.status === 200)).toBe(true);
    expect(results.every((r) => r.data?.organizations !== undefined)).toBe(
      true,
    );

    const refreshCount = await getTokenRefreshCount(session);
    expect(refreshCount).toBe(1);
  });

  it("should silently recover and retry on 401 without redirect", async () => {
    const exp = Math.floor(Date.now() / 1000) + 7200;
    const fetchImpl = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ accessToken: makeJwt(exp) }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ accessToken: makeJwt(exp + 10) }),
      }) as unknown as typeof fetch;

    const tokenService = new TokenService({ fetchImpl });
    let calls = 0;
    const httpMock = new ApolloLink(
      () =>
        new Observable((subscriber) => {
          calls += 1;
          if (calls === 1) {
            subscriber.next({
              data: null,
              errors: [
                {
                  message: "unauth",
                  extensions: { code: "UNAUTHENTICATED" },
                },
              ],
            });
          } else {
            subscriber.next({
              data: {
                organizations: [
                  { id: "1", name: "Sim", __typename: "Organization" },
                ],
              },
            });
          }
          subscriber.complete();
        }),
    );

    const client = new ApolloClient({
      cache: new InMemoryCache(),
      defaultOptions: { query: { errorPolicy: "all" } },
      link: from([
        createGraphqlErrorLink(tokenService),
        createAuthLink(tokenService),
        httpMock,
      ]),
    });

    const res = await client.query({ query: GetOrganizationsDocument });
    expect(res.data?.organizations).toBeDefined();
    expect(calls).toBe(2);
  });

  it("should redirect to login only when silent refresh fails", async () => {
    const session = await createAuthenticatedSession();
    await invalidateRefreshToken(session);

    delete (window as { location?: unknown }).location;
    (window as { location: { href: string } }).location = { href: "" };

    const exp = Math.floor(Date.now() / 1000) + 7200;
    const fetchImpl = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ accessToken: makeJwt(exp) }),
      })
      .mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({}),
      }) as unknown as typeof fetch;

    const tokenService = new TokenService({ fetchImpl });

    const httpMock = new ApolloLink(
      () =>
        new Observable((subscriber) => {
          subscriber.next({
            data: null,
            errors: [
              {
                message: "unauth",
                extensions: { code: "UNAUTHENTICATED" },
              },
            ],
          });
          subscriber.complete();
        }),
    );

    const client = new ApolloClient({
      cache: new InMemoryCache(),
      defaultOptions: { query: { errorPolicy: "all" } },
      link: from([
        createGraphqlErrorLink(tokenService),
        createAuthLink(tokenService),
        httpMock,
      ]),
    });

    await expect(
      client.query({ query: GetOrganizationsDocument }),
    ).rejects.toBeDefined();

    expect(window.location.href).toContain("/api/auth/login");
  });

  it("should render organization list via Server Component without client fetch", async () => {
    await seedTestOrganization({ name: "Test Org" });
    const session = await createAuthenticatedSession();

    const pageResult = await renderServerComponent("/org", { session });

    expect(pageResult.html).toContain("Test Org");
    expect(pageResult.clientGraphQLCalls).toBe(0);
    expect(pageResult.serverGraphQLCalls).toBe(1);
    expect(pageResult.timeToFirstByte).toBeLessThan(500);
  });
});

import {
  ApolloClient,
  gql,
  HttpLink,
  InMemoryCache,
  from,
  empty,
} from "@apollo/client";
import { execute } from "@apollo/client/link";
import { firstValueFrom } from "rxjs";

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

const dummyClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: empty(),
});

describe("Enhanced Auth Link", () => {
  it("GivenTokenNearExpiry_WhenMakingRequest_ThenRefreshesProactively", async () => {
    const nowSec = Math.floor(Date.now() / 1000);
    const nearExpiry = nowSec + 120;
    const freshExpiry = nowSec + 7200;

    const fetchImpl = jest.fn(async (input: RequestInfo | URL) => {
      const url = requestUrl(input);
      if (url.includes("/api/auth/token")) {
        const tokenCalls = fetchImpl.mock.calls.filter(([u]) =>
          requestUrl(u as RequestInfo).includes("/api/auth/token"),
        ).length;
        const exp = tokenCalls === 1 ? nearExpiry : freshExpiry;
        return new Response(JSON.stringify({ accessToken: makeJwt(exp) }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ data: { ok: true } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }) as unknown as typeof fetch;

    const tokenService = new TokenService({ fetchImpl });
    const http = new HttpLink({
      uri: "http://localhost:9999/graphql",
      fetch: fetchImpl,
    });

    const link = from([createAuthLink(tokenService), http]);

    await firstValueFrom(
      execute(
        link,
        { query: gql`query Probe { __typename }` },
        { client: dummyClient },
      ),
    );

    const afterFirst = fetchImpl.mock.calls.filter(([u]) =>
      requestUrl(u as RequestInfo).includes("/api/auth/token"),
    ).length;
    expect(afterFirst).toBe(1);

    await firstValueFrom(
      execute(
        link,
        { query: gql`query Second { __typename }` },
        { client: dummyClient },
      ),
    );

    const afterSecond = fetchImpl.mock.calls.filter(([u]) =>
      requestUrl(u as RequestInfo).includes("/api/auth/token"),
    ).length;
    expect(afterSecond).toBeGreaterThanOrEqual(2);
  });

  it("GivenConcurrentRequests_WhenTokenExpired_ThenQueuesAllUntilRefresh", async () => {
    const exp = Math.floor(Date.now() / 1000) + 3600;
    let concurrent = 0;
    let peak = 0;

    const fetchImpl = jest.fn(async (input: RequestInfo | URL) => {
      const url = requestUrl(input);
      if (url.includes("/api/auth/token")) {
        concurrent += 1;
        peak = Math.max(peak, concurrent);
        await new Promise((r) => setTimeout(r, 30));
        concurrent -= 1;
        return new Response(JSON.stringify({ accessToken: makeJwt(exp) }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ data: { ok: true } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }) as unknown as typeof fetch;

    const tokenService = new TokenService({ fetchImpl });
    const http = new HttpLink({
      uri: "http://localhost:9999/graphql",
      fetch: fetchImpl,
    });

    const link = from([createAuthLink(tokenService), http]);

    await Promise.all([
      firstValueFrom(
        execute(
          link,
          { query: gql`query A { __typename }` },
          { client: dummyClient },
        ),
      ),
      firstValueFrom(
        execute(
          link,
          { query: gql`query B { __typename }` },
          { client: dummyClient },
        ),
      ),
      firstValueFrom(
        execute(
          link,
          { query: gql`query C { __typename }` },
          { client: dummyClient },
        ),
      ),
    ]);

    const tokenCalls = fetchImpl.mock.calls.filter(([u]) =>
      requestUrl(u as RequestInfo).includes("/api/auth/token"),
    ).length;
    expect(tokenCalls).toBe(1);
    expect(peak).toBe(1);
  });

  it("GivenValidToken_WhenMakingRequest_ThenAddsAuthorizationHeader", async () => {
    const exp = Math.floor(Date.now() / 1000) + 7200;
    let authHeader = "";

    const fetchImpl = jest.fn(async (input: RequestInfo | URL, init) => {
      const url = requestUrl(input);
      if (url.includes("/api/auth/token")) {
        return new Response(JSON.stringify({ accessToken: makeJwt(exp) }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      const h = new Headers(init?.headers);
      authHeader = h.get("authorization") ?? "";
      return new Response(JSON.stringify({ data: { ok: true } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }) as unknown as typeof fetch;

    const tokenService = new TokenService({ fetchImpl });
    const http = new HttpLink({
      uri: "http://localhost:9999/graphql",
      fetch: fetchImpl,
    });

    const link = from([createAuthLink(tokenService), http]);

    await firstValueFrom(
      execute(
        link,
        { query: gql`query T { __typename }` },
        { client: dummyClient },
      ),
    );

    expect(authHeader.startsWith("Bearer ")).toBe(true);
  });
});

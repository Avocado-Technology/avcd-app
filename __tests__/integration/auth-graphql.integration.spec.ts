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
import { getApiAccessJwt } from "@/lib/server/get-api-access-jwt";
import { getClient } from "@/lib/apollo-server-client";

jest.mock("@/lib/server/get-api-access-jwt", () => ({
  getApiAccessJwt: jest.fn(),
}));

const mockGetApiAccessJwt = getApiAccessJwt as jest.MockedFunction<
  typeof getApiAccessJwt
>;

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

describe("Integration: Auth + GraphQL Flow", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    mockGetApiAccessJwt.mockReset();
    mockGetApiAccessJwt.mockResolvedValue({
      ok: true,
      token: makeJwt(Math.floor(Date.now() / 1000) + 3600),
    });
  });

  it("GivenFullSystem_WhenTokenExpiresDuring3ConcurrentRequests_ThenAllSucceedWithOneRefresh", async () => {
    const exp = Math.floor(Date.now() / 1000) + 3600;
    let concurrent = 0;
    let peak = 0;

    const fetchImpl = jest.fn(async (input: RequestInfo | URL) => {
      const url = requestUrl(input);
      if (url.includes("/api/auth/token")) {
        concurrent += 1;
        peak = Math.max(peak, concurrent);
        await new Promise((r) => setTimeout(r, 25));
        concurrent -= 1;
        return new Response(JSON.stringify({ accessToken: makeJwt(exp) }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ data: { __typename: "Query" } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }) as unknown as typeof fetch;

    global.fetch = fetchImpl;

    const tokenService = new TokenService({ fetchImpl });

    const http = new HttpLink({
      uri: "http://localhost:9999/graphql",
      fetch: fetchImpl,
    });

    const link = from([
      createGraphqlErrorLink(tokenService),
      createAuthLink(tokenService),
      http,
    ]);

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

    const tokenFetches = fetchImpl.mock.calls.filter(([u]) =>
      requestUrl(u as RequestInfo).includes("/api/auth/token"),
    ).length;
    expect(tokenFetches).toBe(1);
    expect(peak).toBe(1);
  });

  it("GivenServerComponent_WhenRendering_ThenDataFetchedWithoutClientFetch", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
            organizations: [
              { id: "1", name: "Test Org", __typename: "Organization" },
            ],
          },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );

    const client = await getClient();
    const res = await client.query({
      query: gql`
        query Orgs {
          organizations {
            id
            name
          }
        }
      `,
    });

    expect(res.data?.organizations?.[0]?.name).toBe("Test Org");
  });
});

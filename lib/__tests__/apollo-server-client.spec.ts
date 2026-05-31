/**
 * @jest-environment node
 */

import { gql } from "@apollo/client";

import { getClient } from "@/lib/apollo-server-client";
import { getApiAccessJwt } from "@/lib/server/get-api-access-jwt";

jest.mock("@/lib/server/get-api-access-jwt", () => ({
  getApiAccessJwt: jest.fn(),
}));

const mockGetApiAccessJwt = getApiAccessJwt as jest.MockedFunction<
  typeof getApiAccessJwt
>;

describe("Server Component Apollo Client", () => {
  beforeEach(() => {
    mockGetApiAccessJwt.mockReset();
    mockGetApiAccessJwt.mockResolvedValue({
      ok: true,
      token: "eyJhbGciOiJub25lIn0.eyJleHAiOjk5OTk5OTk5OTl9.x",
    });
  });

  it("GivenServerEnvironment_WhenQuerying_ThenFetchesDataWithoutBrowserRoundtrip", async () => {
    const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ data: { __typename: "Query" } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const client = await getClient();
    const res = await client.query({
      query: gql`
        query Ping {
          __typename
        }
      `,
    });

    expect(res.data?.__typename).toBe("Query");
    expect(fetchSpy).toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it("GivenValidSession_WhenQuerying_ThenIncludesAuthHeader", async () => {
    const fetchSpy = jest.spyOn(global, "fetch").mockImplementation(async (_url, init) => {
      const headers = (init?.headers ?? {}) as Record<string, string>;
      expect(headers.authorization).toMatch(/^Bearer /);
      return new Response(JSON.stringify({ data: { __typename: "Query" } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    });

    const client = await getClient();
    await client.query({
      query: gql`
        query AuthProbe {
          __typename
        }
      `,
    });

    fetchSpy.mockRestore();
  });

  it("GivenCachedResult_WhenQueryingAgain_ThenReturnsCachedData", async () => {
    const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ data: { __typename: "Query" } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const client = await getClient();
    const q = gql`
      query CacheProbe {
        __typename
      }
    `;

    await client.query({ query: q, fetchPolicy: "network-only" });
    await client.query({ query: q, fetchPolicy: "cache-first" });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    fetchSpy.mockRestore();
  });
});

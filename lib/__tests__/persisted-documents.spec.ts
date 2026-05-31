import { parse, print } from "graphql";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloLink, empty, execute } from "@apollo/client/link";
import { firstValueFrom } from "rxjs";
import { Observable } from "rxjs";

import { createPersistedOperationsLink } from "@/lib/graphql/persisted-operations-link";
import {
  DocumentWithOptionalHash,
  getEmbeddedDocumentHash,
  sha256Hex,
} from "@/lib/graphql/persisted-operations";

describe("Persisted Documents", () => {
  const dummyClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: empty(),
  });

  it("GivenKnownQuery_WhenSending_ThenUsesHashInsteadOfFullQuery", async () => {
    const doc = parse(`query Ping { __typename }`);
    (doc as DocumentWithOptionalHash).__meta__ = {
      __documentHash: "abc123hash",
    };

    const link = ApolloLink.from([
      createPersistedOperationsLink({ enabled: true }),
      new ApolloLink((operation) => {
        expect(
          operation.getContext().headers["x-graphql-document-hash"],
        ).toEqual("abc123hash");
        return new Observable((subscriber) => {
          subscriber.next({ data: {} });
          subscriber.complete();
        });
      }),
    ]);

    await firstValueFrom(
      execute(link, { query: doc }, { client: dummyClient }),
    );
  });

  it("GivenUnknownQuery_WhenSending_ThenIncludesFullQuery", async () => {
    const doc = parse(`query AdHoc { __typename }`);
    expect(getEmbeddedDocumentHash(doc)).toBeUndefined();

    const expected = await sha256Hex(print(doc));

    const link = ApolloLink.from([
      createPersistedOperationsLink({ enabled: true }),
      new ApolloLink((operation) => {
        expect(
          operation.getContext().headers["x-graphql-document-hash"],
        ).toEqual(expected);
        return new Observable((subscriber) => {
          subscriber.next({ data: {} });
          subscriber.complete();
        });
      }),
    ]);

    await firstValueFrom(
      execute(link, { query: doc }, { client: dummyClient }),
    );
  });
});

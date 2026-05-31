/**
 * Apollo link: attach `X-GraphQL-Document-Hash` for known operations.
 *
 * The AVCD API may use this for allowlisting / auditing; the full query
 * is still sent for compatibility unless the server negotiates APQ-only.
 */

import { ApolloLink } from "@apollo/client/link";
import { from } from "rxjs";
import { mergeMap } from "rxjs/operators";

import {
  getEmbeddedDocumentHash,
  shouldAttachPersistedDocumentMetadata,
  sha256HexOfPrintedDocument,
} from "@/lib/graphql/persisted-operations";

export type PersistedOperationsLinkOptions = {
  /** Override environment-based default (useful in tests). */
  enabled?: boolean;
};

export function createPersistedOperationsLink(
  options: PersistedOperationsLinkOptions = {},
): ApolloLink {
  return new ApolloLink((operation, forward) => {
    const enabled =
      options.enabled ?? shouldAttachPersistedDocumentMetadata();
    if (!enabled) {
      return forward(operation);
    }

    const embedded = getEmbeddedDocumentHash(operation.query);
    const attachPromise = embedded
      ? Promise.resolve(embedded)
      : sha256HexOfPrintedDocument(operation.query);

    return from(attachPromise).pipe(
      mergeMap((hash) => {
        const prev = operation.getContext();
        const headers = {
          ...(prev.headers as Record<string, string> | undefined),
          "x-graphql-document-hash": hash,
        };
        operation.setContext({ ...prev, headers });
        return forward(operation);
      }),
    );
  });
}

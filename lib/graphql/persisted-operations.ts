/**
 * Persisted GraphQL operation metadata (SHA-256) from codegen
 * (`persistedDocuments` in `@graphql-codegen/client-preset`).
 */

import type { DocumentNode } from "graphql";
import { print } from "graphql";

export const DOCUMENT_HASH_PROPERTY = "__documentHash" as const;

export type DocumentWithOptionalHash = DocumentNode & {
  [DOCUMENT_HASH_PROPERTY]?: string;
  __meta__?: { [DOCUMENT_HASH_PROPERTY]?: string };
};

/**
 * Reads the hash embedded by GraphQL Codegen (`persistedDocuments` preset).
 * Newer client-preset versions store it under `__meta__.__documentHash`.
 */
export function getEmbeddedDocumentHash(
  document: DocumentNode,
): string | undefined {
  const d = document as DocumentWithOptionalHash;
  const hash =
    d[DOCUMENT_HASH_PROPERTY] ?? d.__meta__?.[DOCUMENT_HASH_PROPERTY];
  return typeof hash === "string" && hash.length > 0 ? hash : undefined;
}

/**
 * SHA-256 hex digest of the canonical printed operation (APQ-style).
 * Works in browser (SubtleCrypto) and Node (crypto).
 */
export async function sha256HexOfPrintedDocument(
  document: DocumentNode,
): Promise<string> {
  const text = print(document);
  return sha256Hex(text);
}

export async function sha256Hex(message: string): Promise<string> {
  const data = new TextEncoder().encode(message);
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const digest = await crypto.subtle.digest("SHA-256", data);
    return bufferToHex(digest);
  }
  // Node / Jest — hide import from webpack via eval to prevent bundling
   
  const nodeCrypto = eval("require('crypto')") as typeof import("node:crypto");
  return nodeCrypto.createHash("sha256").update(message, "utf8").digest("hex");
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Whether persisted document headers should be attached for this build.
 * Development keeps full queries for debugging; production adds the hash header.
 */
export function shouldAttachPersistedDocumentMetadata(): boolean {
  return process.env.NODE_ENV === "production";
}

"use client";

import { useMemo, useState } from "react";

import { isMcpUiResource, type McpUiResource } from "@/lib/chat/types";

function decodeBlob(blob: string): string {
  try {
    const bin = atob(blob);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  } catch {
    return blob;
  }
}

function extractResourceFromUnknown(result: unknown): McpUiResource | null {
  if (result === null || result === undefined) return null;
  if (isMcpUiResource(result)) return result;
  if (typeof result === "object" && result !== null && "content" in result) {
    const content = (result as { content?: unknown }).content;
    if (Array.isArray(content)) {
      for (const item of content) {
        if (isMcpUiResource(item)) return item;
      }
    }
  }
  return null;
}

/** Strips the `isError` wrapper MCP returns and returns the inner text payload. */
function extractText(result: unknown): string {
  if (result === null || result === undefined) return "";
  if (typeof result === "string") return result;
  const obj = result as Record<string, unknown>;
  if (Array.isArray(obj.content)) {
    const texts = (obj.content as Array<{ type?: string; text?: string }>)
      .filter((c) => c.type === "text" && typeof c.text === "string")
      .map((c) => c.text as string);
    if (texts.length) return texts.join("\n");
  }
  return JSON.stringify(result, null, 2);
}

function isErrorResult(result: unknown): boolean {
  return (
    typeof result === "object" &&
    result !== null &&
    (result as Record<string, unknown>).isError === true
  );
}

/**
 * Renders MCP tool results.
 *
 * - HTML MCP-App resources → sandboxed iframe.
 * - Everything else → collapsed chip (the AI already summarizes in text).
 *   Click to expand raw output for debugging.
 */
export function ToolResultCard({
  toolName,
  result,
}: {
  toolName: string;
  result: unknown;
}) {
  const [expanded, setExpanded] = useState(false);

  const htmlSrc = useMemo(() => {
    const ui = extractResourceFromUnknown(result);
    if (!ui) return null;
    const text = ui.resource.text;
    const blob = ui.resource.blob;
    if (text?.trim()) return text;
    if (blob?.trim()) return decodeBlob(blob);
    return null;
  }, [result]);

  if (result === null || result === undefined) return null;

  if (htmlSrc !== null) {
    return (
      <div className="my-2 overflow-hidden rounded-xl border border-gray-200">
        <iframe
          title={`MCP UI: ${toolName}`}
          className="block min-h-[200px] w-full bg-white"
          sandbox="allow-scripts allow-same-origin allow-forms"
          srcDoc={htmlSrc}
        />
      </div>
    );
  }

  const hasError = isErrorResult(result);
  const rawText = extractText(result);
  const label = toolName.replace(/_/g, " ");

  return (
    <div className="my-1">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className={[
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
          hasError
            ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
            : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100",
        ].join(" ")}
        aria-expanded={expanded}
      >
        <svg
          aria-hidden="true"
          className="h-3 w-3 shrink-0"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path d="M9.5 1.5a1 1 0 0 0-3 0L5.25 3H3a1.5 1.5 0 0 0 0 3h.25l1 8h7.5l1-8H13A1.5 1.5 0 0 0 13 3h-2.25L9.5 1.5ZM8 4a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-5A.5.5 0 0 1 8 4Z" />
        </svg>
        {hasError ? `Tool error: ${label}` : `Used tool: ${label}`}
        <svg
          aria-hidden="true"
          className={`h-3 w-3 shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" />
        </svg>
      </button>
      {expanded && (
        <pre className="mt-1.5 overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
          {rawText}
        </pre>
      )}
    </div>
  );
}

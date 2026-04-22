"use client";

import type { DynamicToolUIPart } from "ai";
import { useMemo } from "react";

import { isMcpUiResource } from "@/lib/chat/types";

/** Turn snake_case tool names into readable labels. */
function humanize(toolName: string): string {
  return toolName
    .replace(
      /^(list_|get_|fetch_|query_|search_|find_|check_|create_|update_|delete_)/i,
      "",
    )
    .replace(/_/g, " ")
    .toLowerCase();
}

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

function extractHtmlFromOutput(output: unknown): string | null {
  if (output === null || output === undefined) return null;
  if (isMcpUiResource(output)) {
    const { text, blob } = output.resource;
    if (text?.trim()) return text;
    if (blob?.trim()) return decodeBlob(blob);
  }
  if (typeof output === "object" && output !== null && "content" in output) {
    const content = (output as { content?: unknown }).content;
    if (Array.isArray(content)) {
      for (const item of content) {
        if (isMcpUiResource(item)) {
          const { text, blob } = item.resource;
          if (text?.trim()) return text;
          if (blob?.trim()) return decodeBlob(blob);
        }
      }
    }
  }
  return null;
}

/**
 * Shows an animated status pill while a tool is running.
 *
 * - input-streaming  → "Thinking…"  (bouncing dots)
 * - input-available  → "Checking <label>…" (spinner)
 * - output-available → null  **unless** the result is an HTML MCP-UI resource
 * - output-error     → null  (the model's text response handles errors)
 */
export function ToolStatusPill({ part }: { part: DynamicToolUIPart }) {
  const label = useMemo(() => humanize(part.toolName), [part.toolName]);

  if (part.state === "input-streaming") {
    return (
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-400 shadow-sm">
        <span className="flex gap-0.5">
          <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
          <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
          <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
        </span>
        Thinking…
      </div>
    );
  }

  if (part.state === "input-available") {
    return (
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-400 shadow-sm">
        <svg
          aria-hidden="true"
          className="h-3 w-3 animate-spin text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        Checking {label}…
      </div>
    );
  }

  if (part.state === "approval-requested") {
    return (
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-800 shadow-sm">
        Waiting for approval…
      </div>
    );
  }

  if (part.state === "approval-responded") {
    return null;
  }

  if (part.state === "output-available") {
    const html = extractHtmlFromOutput(part.output);
    if (html) {
      return (
        <div className="my-2 overflow-hidden rounded-xl border border-gray-200">
          <iframe
            title={`Result: ${label}`}
            className="block min-h-[200px] w-full bg-white"
            sandbox="allow-scripts allow-same-origin allow-forms"
            srcDoc={html}
          />
        </div>
      );
    }
    return null;
  }

  if (part.state === "output-denied") {
    return null;
  }

  // output-error → silent; the model's text already summarises
  return null;
}
